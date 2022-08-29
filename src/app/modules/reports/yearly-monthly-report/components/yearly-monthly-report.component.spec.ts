import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyMonthlyReportComponent } from './yearly-monthly-report.component';

describe('YearlyMonthlyReportComponent', () => {
  let component: YearlyMonthlyReportComponent;
  let fixture: ComponentFixture<YearlyMonthlyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearlyMonthlyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyMonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
