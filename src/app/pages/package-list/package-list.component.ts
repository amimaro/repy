import { Component, OnInit } from '@angular/core';

import { Manager } from '../../models/Manager';
import { PackageManagerService } from '../../services/package-manager.service';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})
export class PackageListComponent implements OnInit {

  manager: Manager;

  constructor(private packageService: PackageManagerService) {
    this.manager = this.packageService.getManager();
    console.log(this.manager.selectedPacks);
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
      let tmp = this.manager.selectedPacks[i];
      this.manager.selectedPacks[i] = this.manager.selectedPacks[i - 1];
      this.manager.selectedPacks[i - 1] = tmp;
      this.packageService.setManager(this.manager);
    }
  }

  down(i) {
    if (i < this.manager.selectedPacks.length) {
      let tmp = this.manager.selectedPacks[i];
      this.manager.selectedPacks[i] = this.manager.selectedPacks[i + 1];
      this.manager.selectedPacks[i + 1] = tmp;
      this.packageService.setManager(this.manager);
    }
  }

  setChecked() {
      this.packageService.setManager(this.manager);
  }

  selectOS(os) {
    this.manager.displayOS = os;
    this.manager.selectedOS = os.toLowerCase();
    this.packageService.setManager(this.manager);
  }

  setRelease(release) {
      this.packageService.setManager(this.manager);
  }

}
