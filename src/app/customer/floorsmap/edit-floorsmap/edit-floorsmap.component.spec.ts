import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFloorsmapComponent } from './edit-floorsmap.component';

describe('AddBuildingComponent', () => {
  let component: EditFloorsmapComponent;
  let fixture: ComponentFixture<EditFloorsmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFloorsmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFloorsmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
