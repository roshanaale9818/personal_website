import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BentRayStaffDashboardComponent } from './bent-ray-staff-dashboard.component';

describe('BentRayStaffDashboardComponent', () => {
  let component: BentRayStaffDashboardComponent;
  let fixture: ComponentFixture<BentRayStaffDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BentRayStaffDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BentRayStaffDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
