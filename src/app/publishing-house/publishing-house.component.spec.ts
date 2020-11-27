import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishingHouseComponent } from './publishing-house.component';

describe('PublishingHouseComponent', () => {
  let component: PublishingHouseComponent;
  let fixture: ComponentFixture<PublishingHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishingHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishingHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
