import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFacilitiesComponent } from './edit-facilities.component';

describe('EditFacilitiesComponent', () => {
  let component: EditFacilitiesComponent;
  let fixture: ComponentFixture<EditFacilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFacilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
