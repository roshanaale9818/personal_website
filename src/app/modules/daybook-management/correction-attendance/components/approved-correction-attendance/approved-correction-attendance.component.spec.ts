import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedCorrectionAttendanceComponent } from './approved-correction-attendance.component';

describe('ApprovedCorrectionAttendanceComponent', () => {
  let component: ApprovedCorrectionAttendanceComponent;
  let fixture: ComponentFixture<ApprovedCorrectionAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedCorrectionAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedCorrectionAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
