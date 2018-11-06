import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlooraccessComponent } from './flooraccess.component';

describe('FlooraccessComponent', () => {
  let component: FlooraccessComponent;
  let fixture: ComponentFixture<FlooraccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlooraccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlooraccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
