import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingCorrectionAttendanceComponent } from './pending-correction-attendance.component';

describe('PendingCorrectionAttendanceComponent', () => {
  let component: PendingCorrectionAttendanceComponent;
  let fixture: ComponentFixture<PendingCorrectionAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingCorrectionAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingCorrectionAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
