import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishingHouseDialogComponent } from './publishing-house-dialog.component';

describe('PublishingHouseDialogComponent', () => {
  let component: PublishingHouseDialogComponent;
  let fixture: ComponentFixture<PublishingHouseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishingHouseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishingHouseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
