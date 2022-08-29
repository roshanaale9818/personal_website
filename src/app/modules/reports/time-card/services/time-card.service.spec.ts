import { TestBed } from '@angular/core/testing';

import { TimeCardService } from './time-card.service';

describe('TimeCardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeCardService = TestBed.get(TimeCardService);
    expect(service).toBeTruthy();
  });
});
