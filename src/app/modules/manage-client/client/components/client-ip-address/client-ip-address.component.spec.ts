import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientIpAddressComponent } from './client-ip-address.component';

describe('ClientIpAddressComponent', () => {
  let component: ClientIpAddressComponent;
  let fixture: ComponentFixture<ClientIpAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientIpAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientIpAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
