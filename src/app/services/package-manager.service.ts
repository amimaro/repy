import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { saveAs } from 'file-saver';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as moment from 'moment';

import 'rxjs/add/operator/toPromise';

import { Manager } from '../models/Manager';
import { Registry } from '../models/Registry';
import * as comments from '../../assets/comments.json';
import * as pypiSimple from '../../assets/pypiSimple.json';

@Injectable()
export class PackageManagerService {

  private review: number = 1003;
  private manager: Manager;
  private localUrl = 'http://localhost:8080/api/';
  private apiUrl = 'https://repy-app.herokuapp.com/api/';
  private shareUrl = 'https://repy-api-shares.herokuapp.com/';

  private headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  constructor(private router: Router, private http: Http, private spinnerService: Ng4LoadingSpinnerService) {
    if (localStorage.getItem("repy-local") === 'undefined' ||
      localStorage.getItem("repy-local") === null ||
      this.review != JSON.parse(localStorage.getItem("repy-local")).review) {
      this.manager = new Manager();
      this.manager.review = this.review;
      localStorage.setItem("repy-local", JSON.stringify(this.manager));
    } else {
      this.manager = JSON.parse(localStorage.getItem("repy-local"));
    }
  }

  setManager(manager: Manager) {
    this.manager = manager;
    localStorage.setItem("repy-local", JSON.stringify(this.manager));
  }

  getManager() {
    this.manager = JSON.parse(localStorage.getItem("repy-local"));
    return this.manager;
  }

  getSearch(query) {
    return this.http
      .post(this.apiUrl + "package", {
        "manager": query.manager,
        "query": query.search
      })
      .toPromise()
      .then(res => {
        return res.json();
      }).catch(this.handleError);
  }

  getRepos() {
    return this.http
      .get(this.apiUrl + "manager")
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  postAnonymousGist() {
    this.setupFileName();
    this.spinnerService.show();
    this.http.post('https://api.github.com/gists', {
      "description": "Anonymous Gist created with repy.io",
      "public": true,
      "files": {
        [this.manager.filename]: {
          "content": this.manager.script
        }
      }
    }, { headers: this.headers })
      .toPromise()
      .then(res => {
        res = res.json();
        console.log(res);
        this.postAsShared(res);
      })
      .catch(this.handleError);
  }

  postAsShared(res) {
    this.http.post(this.shareUrl + "shares", {
      "api_url": res['url'],
      "html_url": res['html_url'],
      "raw_url": res['files'][Object.keys(res['files'])[0]]['raw_url'],
      "created_at": res['created_at'],
      "filename": res['files'][Object.keys(res['files'])[0]]['filename'],
      "description": res['description'],
      "content": res['files'][Object.keys(res['files'])[0]]['content']
    }, { headers: this.headers })
      .toPromise()
      .then(res => {
        res = res.json();
        this.spinnerService.hide();
        window.location.href = res['html_url'];
      })
      .catch(this.handleError);
  }

  getShared(page) {
    return this.http
      .get(this.shareUrl + 'shares/' + page, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  addSelectedPack(pack) {
    this.manager.selectedPacks.push(pack);
    this.setManager(this.manager);
  }

  removeSelectedPack(pack) {
    let index = -1;
    for (let i in this.manager.selectedPacks) {
      if (this.manager.selectedPacks[i].name == pack.name &&
        this.manager.selectedPacks[i].repo == pack.repo &&
        this.manager.selectedPacks[i].pub == pack.pub) {
        index = parseInt(i);
      }
    }
    if (index > -1)
      this.manager.selectedPacks.splice(index, 1);
    for (let p of this.manager.searchedPacks) {
      if (p.name == pack.name &&
        p.repo == pack.repo &&
        p.pub == pack.pub) {
        p.isSelected = false;
      }
    }
    this.setManager(this.manager);
  }

  clearSelectedPacks() {
    this.manager.selectedPacks = [];
    for (let p of this.manager.searchedPacks) {
      p.isSelected = false;
    }
    this.setManager(this.manager);
  }

  getSelectedPacks() {
    return this.manager.selectedPacks;
  }

  addDate() {
    let date = this.manager.selectedOS == 'windows' ? 'REM' : '#';
    date += ' Created at: ' + moment().format('MMMM Do YYYY, h:mm:ss a');
    return date;
  }

  setupFileName() {
    let ff = this.manager.selectedOS == 'windows' ? '.cmd' : '.sh';
    let nff = this.manager.selectedOS == 'windows' ? '.sh' : '.cmd';
    if (this.manager.filename == '') {
      this.manager.filename = 'repy-script-' + (new Date().getTime()) + ff;
    } else if (this.manager.filename.indexOf(ff) < 0) {
      this.manager.filename += ff;
    }
    if (this.manager.filename.indexOf(nff) > 0) {
      this.manager.filename = this.manager.filename.substring(0, this.manager.filename.length - 7) + ff;
    }
  }

  generateScript() {
    let os = this.manager.selectedOS;
    this.manager.script = comments[os]['header'] + '\n' + this.addDate() + '\n\n';
    let text = "";

    if (this.getSelectedPacks().findIndex(pack => pack.repo == 'apt') >= 0 && os != 'windows')
      text += comments['config']['apt'];
    if (this.getSelectedPacks().findIndex(pack => pack.repo == 'brew') >= 0 && os != 'windows')
      text += comments['config']['brew'];
    if (this.getSelectedPacks().findIndex(pack => pack.repo == 'choco') >= 0 && os == 'windows')
      text += comments['config']['choco'];

    for (let pack of this.getSelectedPacks()) {
      if (pack.repo == 'npm') {
        text += pack.options.sudo ? "sudo " : "";
        text += "npm install";
        text += pack.options.global ? " -g " : " ";
        text += pack.name;// + "@" + pack.selectedRelease;
        text += pack.options.save ? " --save" : "";
      } else if (pack.repo == 'apt') {
        if (os != 'windows') {
          //   if (pack.selectedRelease != '')
          //     text += "sudo apt-get install -y " + pack.name + "=" + pack.selectedRelease;
          //   else
          text += "sudo apt-get install -y " + pack.name;
        }
      } else if (pack.repo == 'brew') {
        text += "brew install ";
        text += pack.name;
      } else if (pack.repo == 'gem') {
        if (os != 'windows')
          text += "sudo ";
        text += "gem install ";
        text += pack.name;// + ' -v ' + pack.selectedRelease + '\n';
      } else if (pack.repo == 'pip') {
        if (os != 'windows')
          text += "sudo ";
        text += "pip install ";
        text += pack.name;// + ' -v ' + pack.selectedRelease + '\n';
      } else if (pack.repo == 'choco') {
        if (os == 'windows') {
          text += "choco install ";
          text += pack.name + " -y";// + ' -v ' + pack.selectedRelease + '\n';
        }
      }
      text += "\n";
    }
    this.manager.script += text + comments[this.manager.selectedOS]['footer'];
    this.setupFileName();
    this.setManager(this.manager);
  }

  downloadScript() {
    this.setupFileName();
    let blob = new Blob([this.manager.script], { type: "text/plain;charset=utf-8" });
    saveAs(blob, this.manager.filename);
  }

  downloadFile(file) {
    let blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, file.filename);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
