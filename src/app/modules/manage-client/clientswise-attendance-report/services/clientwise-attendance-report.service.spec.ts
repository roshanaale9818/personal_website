import { TestBed } from '@angular/core/testing';

import { ClientwiseAttendanceReportService } from './clientwise-attendance-report.service';

describe('ClientwiseAttendanceReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientwiseAttendanceReportService = TestBed.get(ClientwiseAttendanceReportService);
    expect(service).toBeTruthy();
  });
});
