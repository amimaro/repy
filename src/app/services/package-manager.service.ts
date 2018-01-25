import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { saveAs } from 'file-saver';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as moment from 'moment';

import 'rxjs/add/operator/toPromise';

import { App } from '../models/App';
import { Manager } from '../models/Manager';
import { Registry } from '../models/Registry';
import * as comments from '../../assets/comments.json';

@Injectable()
export class PackageManagerService {

  private review: number = 1006;
  private app: App;
  // private apiUrl = 'http://localhost:8080/api/';
  private apiUrl = 'http://www.repy.io/api/';
  private shareUrl = 'https://repy-api-shares.herokuapp.com/';

  private headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  constructor(private router: Router, private http: Http, private spinnerService: Ng4LoadingSpinnerService) {
    if (localStorage.getItem("repy-local") === 'undefined' ||
      localStorage.getItem("repy-local") === null ||
      this.review != JSON.parse(localStorage.getItem("repy-local")).review) {
      this.app = new App();
      this.app.review = this.review;
      localStorage.setItem("repy-local", JSON.stringify(this.app));
    } else {
      this.app = JSON.parse(localStorage.getItem("repy-local"));
    }
  }

  setAppLocal(app: App) {
    this.app = app;
    localStorage.setItem("repy-local", JSON.stringify(this.app));
  }

  getAppLocal() {
    this.app = JSON.parse(localStorage.getItem("repy-local"));
    return this.app;
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

  authorize() {
    window.location.href = 'https://github.com/login/oauth/authorize?scope=gist&client_id=d0482296dbff8b53191c';
  }

  postGist(code) {
    this.spinnerService.show();
    this.http.post(this.apiUrl + 'callback', {
      "code": code,
      "data": {
        "description": "Gist created with repy.io",
        "public": true,
        "files": {
          [this.app.filename]: {
            "content": this.app.script
          }
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

  postAnonymousGist() {
    this.setupFileName();
    this.spinnerService.show();
    this.http.post('https://api.github.com/gists', {
      "description": "Anonymous Gist created with repy.io",
      "public": true,
      "files": {
        [this.app.filename]: {
          "content": this.app.script
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
    this.app.selectedPacks.push(pack);
    this.setAppLocal(this.app);
  }

  removeSelectedPack(pack) {
    let index = -1;
    for (let i in this.app.selectedPacks) {
      if (this.app.selectedPacks[i].name == pack.name &&
        this.app.selectedPacks[i].manager == pack.manager &&
        this.app.selectedPacks[i].pub == pack.pub) {
        index = parseInt(i);
      }
    }
    if (index > -1)
      this.app.selectedPacks.splice(index, 1);
    for (let p of this.app.searchedPacks) {
      if (p.name == pack.name &&
        p.manager == pack.manager &&
        p.pub == pack.pub) {
        p.isSelected = false;
      }
    }
    this.setAppLocal(this.app);
  }

  clearSelectedPacks() {
    this.app.selectedPacks = [];
    for (let p of this.app.searchedPacks) {
      p.isSelected = false;
    }
    this.setAppLocal(this.app);
  }

  getSelectedPacks() {
    return this.app.selectedPacks;
  }

  addDate() {
    let date = this.app.selectedOS == 'windows' ? 'REM' : '#';
    date += ' Created at: ' + moment().format('MMMM Do YYYY, h:mm:ss a');
    return date;
  }

  setupFileName() {
    let ff = this.app.selectedOS == 'windows' ? '.cmd' : '.sh';
    let nff = this.app.selectedOS == 'windows' ? '.sh' : '.cmd';
    if (this.app.filename == '' || this.app.filename.indexOf('repy-script-') >= 0) {
      this.app.filename = 'repy-script-' + (new Date().getTime()) + ff;
    } else if (this.app.filename.indexOf(ff) < 0) {
      this.app.filename += ff;
    }
    if (this.app.filename.indexOf(nff) > 0) {
      this.app.filename = this.app.filename.substring(0, this.app.filename.length - 7) + ff;
    }
  }

  generateScript() {
    let os = this.app.selectedOS;
    this.app.script = comments[os]['header'] + '\n' + this.addDate() + '\n\n';
    let text = "";

    if (this.getSelectedPacks().findIndex(pack => pack.manager == 'apt-get') >= 0)
      text += comments['config']['apt-get'];
    if (this.getSelectedPacks().findIndex(pack => pack.manager == 'brew') >= 0)
      text += comments['config']['brew'];
    if (this.getSelectedPacks().findIndex(pack => pack.manager == 'choco') >= 0)
      text += comments['config']['choco'];
    text += "\n";

    for (let pack of this.getSelectedPacks()) {
      let managerOptions: Manager = this.app.managers[this.app.managers.findIndex(manager => manager['code'] == pack.manager)];
      text += (os === 'windows') ? 'CALL ' : '';
      text += managerOptions['cmd'];
      text += pack.options.global ? " -g " : " ";
      text += pack.name;
      text += managerOptions['sufix'] ? ' ' + managerOptions['sufix'] : "";
      text += pack.options.save ? " --save" : "";
      text += pack.options.saveDev ? " --save-dev" : "";
      text += "\n";
    }
    this.app.script += text + comments[this.app.selectedOS]['footer'];
    this.setupFileName();
    this.setAppLocal(this.app);
  }

  downloadScript() {
    this.setupFileName();
    let blob = new Blob([this.app.script], { type: "text/plain;charset=utf-8" });
    saveAs(blob, this.app.filename);
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
