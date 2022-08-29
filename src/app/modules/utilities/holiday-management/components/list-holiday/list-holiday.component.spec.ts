import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHolidayComponent } from './list-holiday.component';

describe('ListHolidayComponent', () => {
  let component: ListHolidayComponent;
  let fixture: ComponentFixture<ListHolidayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListHolidayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
