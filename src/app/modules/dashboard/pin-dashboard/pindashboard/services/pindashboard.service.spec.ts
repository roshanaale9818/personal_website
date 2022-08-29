import { TestBed } from '@angular/core/testing';

import { PindashboardService } from './pindashboard.service';

describe('PindashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PindashboardService = TestBed.get(PindashboardService);
    expect(service).toBeTruthy();
  });
});
