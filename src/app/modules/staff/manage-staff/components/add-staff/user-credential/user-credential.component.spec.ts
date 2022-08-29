import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCredentialComponent } from './user-credential.component';

describe('UserCredentialComponent', () => {
  let component: UserCredentialComponent;
  let fixture: ComponentFixture<UserCredentialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCredentialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
