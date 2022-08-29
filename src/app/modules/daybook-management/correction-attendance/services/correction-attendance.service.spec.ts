import { TestBed } from '@angular/core/testing';

import { CorrectionAttendanceService } from './correction-attendance.service';

describe('CorrectionAttendanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CorrectionAttendanceService = TestBed.get(CorrectionAttendanceService);
    expect(service).toBeTruthy();
  });
});
