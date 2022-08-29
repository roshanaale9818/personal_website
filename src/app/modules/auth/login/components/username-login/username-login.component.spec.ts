import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameLoginComponent } from './username-login.component';

describe('UsernameLoginComponent', () => {
  let component: UsernameLoginComponent;
  let fixture: ComponentFixture<UsernameLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsernameLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernameLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
