import { Component, OnInit } from '@angular/core';

import { App } from '../../models/App';
import { PackageManagerService } from '../../services/package-manager.service';

@Component({
  selector: 'app-script',
  templateUrl: './script.component.html',
  styleUrls: ['./script.component.css']
})
export class ScriptComponent implements OnInit {

  app: App;

  constructor(private packageService: PackageManagerService) {
    this.app = this.packageService.getAppLocal();
    this.packageService.generateScript();
  }

  ngOnInit() {
  }

  createAnonymousGist() {
    this.packageService.postAnonymousGist();
  }

  downloadScript() {
    this.packageService.downloadScript();
  }

}
