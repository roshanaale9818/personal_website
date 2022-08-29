import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekendManagementComponent } from './weekend-management.component';

describe('WeekendManagementComponent', () => {
  let component: WeekendManagementComponent;
  let fixture: ComponentFixture<WeekendManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekendManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekendManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
