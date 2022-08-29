import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTypeComponent } from './fund-type.component';

describe('FundTypeComponent', () => {
  let component: FundTypeComponent;
  let fixture: ComponentFixture<FundTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
