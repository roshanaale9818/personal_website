import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorsOriginListComponent } from './cors-origin-list.component';

describe('CorsOriginListComponent', () => {
  let component: CorsOriginListComponent;
  let fixture: ComponentFixture<CorsOriginListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorsOriginListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorsOriginListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
