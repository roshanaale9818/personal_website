import { TestBed } from '@angular/core/testing';

import { FundTypeService } from './fund-type.service';

describe('FundTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FundTypeService = TestBed.get(FundTypeService);
    expect(service).toBeTruthy();
  });
});
