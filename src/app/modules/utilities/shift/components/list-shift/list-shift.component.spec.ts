import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShiftComponent } from './list-shift.component';

describe('ListShiftComponent', () => {
  let component: ListShiftComponent;
  let fixture: ComponentFixture<ListShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
