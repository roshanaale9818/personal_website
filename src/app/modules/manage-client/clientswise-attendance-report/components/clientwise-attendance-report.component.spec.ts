import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientwiseAttendanceReportComponent } from './clientwise-attendance-report.component';

describe('ClientwiseAttendanceReportComponent', () => {
  let component: ClientwiseAttendanceReportComponent;
  let fixture: ComponentFixture<ClientwiseAttendanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientwiseAttendanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientwiseAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
