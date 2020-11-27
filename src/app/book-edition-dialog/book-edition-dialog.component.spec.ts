import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookEditionDialogComponent } from './book-edition-dialog.component';

describe('BookEditionDialogComponent', () => {
  let component: BookEditionDialogComponent;
  let fixture: ComponentFixture<BookEditionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookEditionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookEditionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
