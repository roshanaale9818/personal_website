import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEmployeeComponent } from './client-employee.component';

describe('ClientEmployeeComponent', () => {
  let component: ClientEmployeeComponent;
  let fixture: ComponentFixture<ClientEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
