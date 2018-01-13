import { Component, OnInit } from '@angular/core';

import { App } from '../../models/App';
import { Manager } from '../../models/Manager';
import { PackageManagerService } from '../../services/package-manager.service';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {

  app: App;

  constructor(private packageService: PackageManagerService) {
    this.app = this.packageService.getAppLocal();
  }

  ngOnInit() {
    this.packageService.getRepos().then(res => {
      this.app.managers = Object.values(res) as Manager[];
      this.packageService.setAppLocal(this.app);
    });
  }

}
