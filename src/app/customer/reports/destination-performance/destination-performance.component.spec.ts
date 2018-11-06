import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationPerformanceComponent } from './destination-performance.component';

describe('DestinationPerformanceComponent', () => {
  let component: DestinationPerformanceComponent;
  let fixture: ComponentFixture<DestinationPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinationPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
