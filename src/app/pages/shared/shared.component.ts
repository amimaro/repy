import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { App } from '../../models/App';
import { PackageManagerService } from '../../services/package-manager.service';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.css']
})
export class SharedComponent implements OnInit {

  page: number;
  hasData: boolean = true;
  app: App;

  constructor(private packageService: PackageManagerService, private route: ActivatedRoute, private router: Router) {
    this.page = route.params['_value']['page'];
    if (this.page == undefined || this.page < 1) {
      this.page = 1;
    }
    router.navigate(['/shared/' + this.page]);
    this.app = this.packageService.getAppLocal();
  }

  ngOnInit() {
    this.getShared(this.page);
  }

  downloadFile(file) {
    this.packageService.downloadFile(file);
  }

  getShared(page) {
    this.packageService.getShared(parseInt(page) + 1).then(res => {
      if (res.length == 0)
        this.hasData = false;
      else
        this.hasData = true;
    });
    this.packageService.getShared(page).then(res => {
      this.app.shared = res;
      this.packageService.setAppLocal(this.app);
    });
  }

  next() {
    this.clearShared();
    this.page++;
    this.router.navigate(['/shared/' + this.page]);
    this.getShared(this.page);
  }

  previous() {
    this.clearShared();
    this.page--;
    if (this.page < 1)
      this.page = 1;
    this.router.navigate(['/shared/' + this.page]);
    this.getShared(this.page);
  }

  clearShared() {
    this.app.shared = [];
    this.packageService.setAppLocal(this.app);
  }

}
