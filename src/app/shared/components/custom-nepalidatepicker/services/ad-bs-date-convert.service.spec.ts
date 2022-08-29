import { TestBed } from '@angular/core/testing';

import { AdBsDateConvertService } from './ad-bs-date-convert.service';

describe('AdBsDateConvertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdBsDateConvertService = TestBed.get(AdBsDateConvertService);
    expect(service).toBeTruthy();
  });
});
