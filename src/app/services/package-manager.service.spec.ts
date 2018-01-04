import { TestBed, inject } from '@angular/core/testing';

import { PackageManagerService } from './package-manager.service';

describe('PackageManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PackageManagerService]
    });
  });

  it('should be created', inject([PackageManagerService], (service: PackageManagerService) => {
    expect(service).toBeTruthy();
  }));
});
