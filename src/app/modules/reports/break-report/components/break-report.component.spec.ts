import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakReportComponent } from './break-report.component';

describe('BreakReportComponent', () => {
  let component: BreakReportComponent;
  let fixture: ComponentFixture<BreakReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreakReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
