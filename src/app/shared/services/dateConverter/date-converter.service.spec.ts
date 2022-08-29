import { TestBed } from '@angular/core/testing';

import { DateConverterService } from './date-converter.service';

describe('DateConverterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DateConverterService = TestBed.get(DateConverterService);
    expect(service).toBeTruthy();
  });
});
