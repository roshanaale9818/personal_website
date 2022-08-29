import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowIpComponent } from './allow-ip.component';

describe('AllowIpComponent', () => {
  let component: AllowIpComponent;
  let fixture: ComponentFixture<AllowIpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllowIpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
