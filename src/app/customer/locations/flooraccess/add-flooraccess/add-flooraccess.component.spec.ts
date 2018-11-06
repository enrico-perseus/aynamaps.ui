import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFlooraccessComponent } from './add-flooraccess.component';

describe('AddFlooraccessComponent', () => {
  let component: AddFlooraccessComponent;
  let fixture: ComponentFixture<AddFlooraccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFlooraccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFlooraccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
