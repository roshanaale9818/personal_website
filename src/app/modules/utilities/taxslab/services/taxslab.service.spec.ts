import { TestBed } from '@angular/core/testing';

import { TaxslabService } from './taxslab.service';

describe('TaxslabService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaxslabService = TestBed.get(TaxslabService);
    expect(service).toBeTruthy();
  });
});
