import { TestBed } from '@angular/core/testing';

import { NepaliDatepickerService } from './nepali-datepicker.service';

describe('NepaliDatepickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NepaliDatepickerService = TestBed.get(NepaliDatepickerService);
    expect(service).toBeTruthy();
  });
});
