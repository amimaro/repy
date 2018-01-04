import { Component, OnInit } from '@angular/core';

import { Manager } from '../../models/Manager';
import { PackageManagerService } from '../../services/package-manager.service';

@Component({
  selector: 'app-script',
  templateUrl: './script.component.html',
  styleUrls: ['./script.component.css']
})
export class ScriptComponent implements OnInit {

  manager: Manager;

  constructor(private packageService: PackageManagerService) {
    this.manager = this.packageService.getManager();
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
