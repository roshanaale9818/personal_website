import { TestBed } from '@angular/core/testing';

import { ToastrMessageService } from './toastr-message.service';

describe('ToastrMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastrMessageService = TestBed.get(ToastrMessageService);
    expect(service).toBeTruthy();
  });
});
