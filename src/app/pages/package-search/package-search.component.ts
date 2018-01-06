import { Component, OnInit } from '@angular/core';

import { App } from '../../models/App';
import { Manager } from '../../models/Manager';
import { PackageManagerService } from '../../services/package-manager.service';

@Component({
  selector: 'app-package-search',
  templateUrl: './package-search.component.html',
  styleUrls: ['./package-search.component.css']
})
export class PackageSearchComponent implements OnInit {

  timer: any;
  app: App;
  isSearching: boolean = false;
  loadingRepos: string = 'is-loading';

  constructor(private packageService: PackageManagerService) {
    this.app = this.packageService.getAppLocal();
    this.timer = 0;
  }

  ngOnInit() {
    this.packageService.getRepos().then(res => {
      this.app.managers = Object.values(res) as Manager[];
      if (this.app.manager == "")
        this.app.manager = 'apt-get';
      this.packageService.setAppLocal(this.app);
      this.loadingRepos = '';
    });
  }

  selectManager(manager) {
    this.app.manager = manager;
    this.app.searchedPacks = [];
    this.packageService.setAppLocal(this.app);
    this.search();
  }

  typing() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.search();
    }, 1000);
  }

  search() {
    this.app.searchedPacks = [];
    let searchObj = {
      'search': this.app.searchInput,
      'manager': this.app.manager
    };
    if (this.app.searchInput.length >= 1) {
      this.isSearching = true;
      this.packageService.getSearch(searchObj)
        .then(res => {
          res.map((p) => {
            p.isSelected = this.checkSelected(p);
          });
          this.app.searchedPacks = res;
          this.isSearching = false;
          this.packageService.setAppLocal(this.app);
        });
    } else {
      this.app.searchedPacks = [];
    }
  }

  add(pack) {
    pack.isSelected = true;
    this.packageService.addSelectedPack(pack);
  }

  remove(pack) {
    pack.isSelected = false;
    this.packageService.removeSelectedPack(pack);
  }

  checkSelected(pack) {
    for (let p of this.app.selectedPacks) {
      if (p.name == pack.name && p.manager == pack.manager && p.distro == pack.distro && p.publisher == pack.publisher)
        return true;
    }
    return false;
  }

  setRelease(release) {
    this.packageService.setAppLocal(this.app);
  }

}
