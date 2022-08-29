import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllowanceComponent } from './list-allowance.component';

describe('ListAllowanceComponent', () => {
  let component: ListAllowanceComponent;
  let fixture: ComponentFixture<ListAllowanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllowanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
