import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcaStaffDashboardComponent } from './tca-staff-dashboard.component';

describe('TcaStaffDashboardComponent', () => {
  let component: TcaStaffDashboardComponent;
  let fixture: ComponentFixture<TcaStaffDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcaStaffDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcaStaffDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
