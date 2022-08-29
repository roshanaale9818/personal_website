import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollParametersComponent } from './payroll-parameters.component';

describe('PayrollParametersComponent', () => {
  let component: PayrollParametersComponent;
  let fixture: ComponentFixture<PayrollParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
