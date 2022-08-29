import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepaliDatepickerComponent } from './nepali-datepicker.component';

describe('NepaliDatepickerComponent', () => {
  let component: NepaliDatepickerComponent;
  let fixture: ComponentFixture<NepaliDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepaliDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepaliDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
