import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookEditionComponent } from './book-edition.component';

describe('BookEditionComponent', () => {
  let component: BookEditionComponent;
  let fixture: ComponentFixture<BookEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
