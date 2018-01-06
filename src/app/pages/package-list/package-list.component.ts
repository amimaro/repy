import { Component, OnInit } from '@angular/core';

import { App } from '../../models/App';
import { PackageManagerService } from '../../services/package-manager.service';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})
export class PackageListComponent implements OnInit {

  app: App;

  constructor(private packageService: PackageManagerService) {
    this.app = this.packageService.getAppLocal();
    console.log(this.app.selectedPacks);
  }

  ngOnInit() {
  }

  remove(pack) {
    pack.status = false;
    this.packageService.removeSelectedPack(pack);
  }

  clearSelections() {
    this.packageService.clearSelectedPacks();
  }

  up(i) {
    if (i > 0) {
      let tmp = this.app.selectedPacks[i];
      this.app.selectedPacks[i] = this.app.selectedPacks[i - 1];
      this.app.selectedPacks[i - 1] = tmp;
      this.packageService.setAppLocal(this.app);
    }
  }

  down(i) {
    if (i < this.app.selectedPacks.length) {
      let tmp = this.app.selectedPacks[i];
      this.app.selectedPacks[i] = this.app.selectedPacks[i + 1];
      this.app.selectedPacks[i + 1] = tmp;
      this.packageService.setAppLocal(this.app);
    }
  }

  setChecked() {
    this.packageService.setAppLocal(this.app);
  }

  selectOS(os) {
    this.app.displayOS = os;
    this.app.selectedOS = os.toLowerCase();
    this.packageService.setAppLocal(this.app);
  }

  setRelease(release) {
    this.packageService.setAppLocal(this.app);
  }

}
