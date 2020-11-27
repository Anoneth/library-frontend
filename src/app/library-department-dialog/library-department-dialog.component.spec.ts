import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryDepartmentDialogComponent } from './library-department-dialog.component';

describe('LibraryDepartmentDialogComponent', () => {
  let component: LibraryDepartmentDialogComponent;
  let fixture: ComponentFixture<LibraryDepartmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryDepartmentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryDepartmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
