import { Component, OnInit } from '@angular/core';

import { Manager } from '../../models/Manager';
import { PackageManagerService } from '../../services/package-manager.service';

@Component({
  selector: 'app-package-search',
  templateUrl: './package-search.component.html',
  styleUrls: ['./package-search.component.css']
})
export class PackageSearchComponent implements OnInit {

  timer: any;
  manager: Manager;
  isSearching: boolean = false;
  loadingRepos: string = 'is-loading';

  constructor(private packageService: PackageManagerService) {
    this.manager = this.packageService.getManager();
    this.timer = 0;
  }

  ngOnInit() {
    this.packageService.getRepos().then(res => {
      this.manager.repos = res;
      if (this.manager.repo == "")
        this.manager.repo = 'apt';
      this.packageService.setManager(this.manager);
      this.loadingRepos = '';
    });
  }

  selectRepo(repo) {
    this.manager.repo = repo;
    this.manager.searchedPacks = [];
    this.packageService.setManager(this.manager);
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
    this.manager.searchedPacks = [];
    let searchObj = {
      'search': this.manager.searchInput,
      'manager': this.manager.repo
    };
    if (this.manager.searchInput.length >= 1) {
      this.isSearching = true;
      this.packageService.getSearch(searchObj)
        .then(res => {
          res.map((p) => {
            p.isSelected = this.checkSelected(p);
          });
          this.manager.searchedPacks = res;
          this.isSearching = false;
          this.packageService.setManager(this.manager);
        });
    } else {
      this.manager.searchedPacks = [];
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
    for (let p of this.manager.selectedPacks) {
      if (p.name == pack.name && p.repo == pack.repo && p.distro == pack.distro && p.publisher == pack.publisher)
        return true;
    }
    return false;
  }

  setRelease(release) {
    this.packageService.setManager(this.manager);
  }

}
