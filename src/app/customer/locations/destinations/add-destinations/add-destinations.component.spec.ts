import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDestinationsComponent } from './add-destinations.component';

describe('AddPoiComponent', () => {
  let component: AddDestinationsComponent;
  let fixture: ComponentFixture<AddDestinationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDestinationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
