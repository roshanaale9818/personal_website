import { TestBed } from '@angular/core/testing';

import { SalarySheetService } from './salary-sheet.service';

describe('SalarySheetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalarySheetService = TestBed.get(SalarySheetService);
    expect(service).toBeTruthy();
  });
});
