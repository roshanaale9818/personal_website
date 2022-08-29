import { TestBed } from '@angular/core/testing';

import { CreateRequestService } from './create-request.service';

describe('CreateRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateRequestService = TestBed.get(CreateRequestService);
    expect(service).toBeTruthy();
  });
});
