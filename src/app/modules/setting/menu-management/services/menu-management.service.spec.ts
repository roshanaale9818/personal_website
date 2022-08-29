import { TestBed } from '@angular/core/testing';

import { MenuManagementService } from './menu-management.service';

describe('MenuManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenuManagementService = TestBed.get(MenuManagementService);
    expect(service).toBeTruthy();
  });
});
