import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Time24PickerComponent } from './time24-picker.component';

describe('Time24PickerComponent', () => {
  let component: Time24PickerComponent;
  let fixture: ComponentFixture<Time24PickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Time24PickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Time24PickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
