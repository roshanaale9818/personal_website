import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveClientEmployeesComponent } from './archive-client-employees.component';

describe('ArchiveClientEmployeesComponent', () => {
  let component: ArchiveClientEmployeesComponent;
  let fixture: ComponentFixture<ArchiveClientEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiveClientEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveClientEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
