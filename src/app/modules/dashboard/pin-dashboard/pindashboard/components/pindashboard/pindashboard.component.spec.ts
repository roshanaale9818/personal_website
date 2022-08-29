import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PindashboardComponent } from './pindashboard.component';

describe('PindashboardComponent', () => {
  let component: PindashboardComponent;
  let fixture: ComponentFixture<PindashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PindashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PindashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
