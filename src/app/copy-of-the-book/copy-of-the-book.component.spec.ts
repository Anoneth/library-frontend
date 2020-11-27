import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyOfTheBookComponent } from './copy-of-the-book.component';

describe('CopyOfTheBookComponent', () => {
  let component: CopyOfTheBookComponent;
  let fixture: ComponentFixture<CopyOfTheBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyOfTheBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyOfTheBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
