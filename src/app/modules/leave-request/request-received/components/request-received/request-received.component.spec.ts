import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestReceivedComponent } from './request-received.component';

describe('RequestReceivedComponent', () => {
  let component: RequestReceivedComponent;
  let fixture: ComponentFixture<RequestReceivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
