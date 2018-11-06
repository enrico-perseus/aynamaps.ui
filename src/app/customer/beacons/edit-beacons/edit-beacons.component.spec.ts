import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBeaconsComponent } from './edit-beacons.component';

describe('EditBeaconsComponent', () => {
  let component: EditBeaconsComponent;
  let fixture: ComponentFixture<EditBeaconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBeaconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBeaconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
