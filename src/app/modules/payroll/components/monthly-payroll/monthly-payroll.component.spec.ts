import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyPayrollComponent } from './monthly-payroll.component';

describe('MonthlyPayrollComponent', () => {
  let component: MonthlyPayrollComponent;
  let fixture: ComponentFixture<MonthlyPayrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyPayrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
