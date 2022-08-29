import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomNepalidatepickerComponent } from './custom-nepalidatepicker.component';

describe('CustomNepalidatepickerComponent', () => {
  let component: CustomNepalidatepickerComponent;
  let fixture: ComponentFixture<CustomNepalidatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomNepalidatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomNepalidatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
