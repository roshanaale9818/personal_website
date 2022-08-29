import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollPeriodsComponent } from './payroll-periods.component';

describe('PayrollPeriodsComponent', () => {
  let component: PayrollPeriodsComponent;
  let fixture: ComponentFixture<PayrollPeriodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollPeriodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
