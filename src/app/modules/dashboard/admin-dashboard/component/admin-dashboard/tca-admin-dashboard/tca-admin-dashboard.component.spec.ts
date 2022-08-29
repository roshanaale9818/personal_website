import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcaAdminDashboardComponent } from './tca-admin-dashboard.component';

describe('TcaAdminDashboardComponent', () => {
  let component: TcaAdminDashboardComponent;
  let fixture: ComponentFixture<TcaAdminDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcaAdminDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcaAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
