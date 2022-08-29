import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowanceComponent } from './allowance.component';

describe('AllowanceComponent', () => {
  let component: AllowanceComponent;
  let fixture: ComponentFixture<AllowanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllowanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
