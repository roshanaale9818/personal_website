import { TestBed } from '@angular/core/testing';

import { BreakReportService } from './break-report.service';

describe('BreakReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BreakReportService = TestBed.get(BreakReportService);
    expect(service).toBeTruthy();
  });
});
