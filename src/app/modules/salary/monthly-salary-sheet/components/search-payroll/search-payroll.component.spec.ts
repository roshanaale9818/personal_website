import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPayrollComponent } from './search-payroll.component';

describe('SearchPayrollComponent', () => {
  let component: SearchPayrollComponent;
  let fixture: ComponentFixture<SearchPayrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPayrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
