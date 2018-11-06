import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTimeslotsComponent } from './new-timeslots.component';

describe('NewTimeslotsComponent', () => {
  let component: NewTimeslotsComponent;
  let fixture: ComponentFixture<NewTimeslotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTimeslotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTimeslotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
