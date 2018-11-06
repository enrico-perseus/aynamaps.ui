import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorsmapComponent } from './floorsmap.component';

describe('FloorsmapComponent', () => {
  let component: FloorsmapComponent;
  let fixture: ComponentFixture<FloorsmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorsmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorsmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
