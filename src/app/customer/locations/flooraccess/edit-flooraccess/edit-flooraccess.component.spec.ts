import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFlooraccessComponent } from './edit-flooraccess.component';

describe('EditFlooraccessComponent', () => {
  let component: EditFlooraccessComponent;
  let fixture: ComponentFixture<EditFlooraccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFlooraccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFlooraccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
