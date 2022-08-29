import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDivisionComponent } from './client-division.component';

describe('ClientDivisionComponent', () => {
  let component: ClientDivisionComponent;
  let fixture: ComponentFixture<ClientDivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
