import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySalarySheetComponent } from './monthly-salary-sheet.component';

describe('MonthlySalarySheetComponent', () => {
  let component: MonthlySalarySheetComponent;
  let fixture: ComponentFixture<MonthlySalarySheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlySalarySheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlySalarySheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
