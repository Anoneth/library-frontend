import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyOfTheBookDialogComponent } from './copy-of-the-book-dialog.component';

describe('CopyOfTheBookDialogComponent', () => {
  let component: CopyOfTheBookDialogComponent;
  let fixture: ComponentFixture<CopyOfTheBookDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyOfTheBookDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyOfTheBookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
