import { TestBed } from '@angular/core/testing';

import { EmployeegroupService } from './employeegroup.service';

describe('EmployeegroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmployeegroupService = TestBed.get(EmployeegroupService);
    expect(service).toBeTruthy();
  });
});
