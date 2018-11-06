import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFloorsmapComponent } from './add-floorsmap.component';

describe('AddBuildingComponent', () => {
  let component: AddFloorsmapComponent;
  let fixture: ComponentFixture<AddFloorsmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFloorsmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFloorsmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
