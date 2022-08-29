import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientIpModalComponent } from './client-ip-modal.component';

describe('ClientIpModalComponent', () => {
  let component: ClientIpModalComponent;
  let fixture: ComponentFixture<ClientIpModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientIpModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientIpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
