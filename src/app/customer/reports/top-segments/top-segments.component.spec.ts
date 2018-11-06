import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSegmentsComponent } from './top-segments.component';

describe('TopSegmentsComponent', () => {
  let component: TopSegmentsComponent;
  let fixture: ComponentFixture<TopSegmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopSegmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
