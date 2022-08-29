import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeviceIdComponent } from './add-device-id.component';

describe('AddDeviceIdComponent', () => {
  let component: AddDeviceIdComponent;
  let fixture: ComponentFixture<AddDeviceIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDeviceIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeviceIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
