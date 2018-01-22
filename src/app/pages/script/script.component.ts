import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { App } from '../../models/App';
import { PackageManagerService } from '../../services/package-manager.service';

@Component({
  selector: 'app-script',
  templateUrl: './script.component.html',
  styleUrls: ['./script.component.css']
})
export class ScriptComponent implements OnInit {

  app: App;

  constructor(private packageService: PackageManagerService, private activatedRoute: ActivatedRoute) {
    this.app = this.packageService.getAppLocal();
    this.packageService.generateScript();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      let code = params['code'];
      if (code)
        this.createGist(code);
    });
  }

  authorize() {
    this.packageService.authorize();
  }

  createGist(code) {
    if(this.app.code !== code){
      this.app.code = code;
      this.packageService.setAppLocal(this.app);
      this.packageService.postGist(code);
    }
  }

  createAnonymousGist() {
    this.packageService.postAnonymousGist();
  }

  downloadScript() {
    this.packageService.downloadScript();
  }

}
