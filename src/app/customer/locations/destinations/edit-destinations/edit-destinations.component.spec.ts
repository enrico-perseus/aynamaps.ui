import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDestinationsComponent } from './edit-destinations.component';

describe('EditPoiComponent', () => {
  let component: EditDestinationsComponent;
  let fixture: ComponentFixture<EditDestinationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDestinationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
