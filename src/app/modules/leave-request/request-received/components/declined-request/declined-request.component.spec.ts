import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclinedRequestComponent } from './declined-request.component';

describe('DeclinedRequestComponent', () => {
  let component: DeclinedRequestComponent;
  let fixture: ComponentFixture<DeclinedRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclinedRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclinedRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
