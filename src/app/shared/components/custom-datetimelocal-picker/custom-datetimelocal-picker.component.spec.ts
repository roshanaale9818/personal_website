import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDatetimelocalPickerComponent } from './custom-datetimelocal-picker.component';

describe('CustomDatetimelocalPickerComponent', () => {
  let component: CustomDatetimelocalPickerComponent;
  let fixture: ComponentFixture<CustomDatetimelocalPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDatetimelocalPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDatetimelocalPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
