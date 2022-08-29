import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStaffDetailComponent } from './update-staff-detail.component';

describe('UpdateStaffDetailComponent', () => {
  let component: UpdateStaffDetailComponent;
  let fixture: ComponentFixture<UpdateStaffDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateStaffDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStaffDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
