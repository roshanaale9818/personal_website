import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientLocationComponent } from './add-client-location.component';

describe('AddClientLocationComponent', () => {
  let component: AddClientLocationComponent;
  let fixture: ComponentFixture<AddClientLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClientLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClientLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
