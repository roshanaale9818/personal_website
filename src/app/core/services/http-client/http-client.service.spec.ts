import { TestBed } from '@angular/core/testing';

import { HttpClientService } from './http-client.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HttpClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: HttpClientService = TestBed.get(HttpClientService);
    expect(service).toBeTruthy();
  });
});
