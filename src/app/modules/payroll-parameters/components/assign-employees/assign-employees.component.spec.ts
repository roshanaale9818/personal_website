import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEmployeesComponent } from './assign-employees.component';

describe('AssignEmployeesComponent', () => {
  let component: AssignEmployeesComponent;
  let fixture: ComponentFixture<AssignEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
