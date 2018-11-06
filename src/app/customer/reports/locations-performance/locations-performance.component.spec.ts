import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsPerformanceComponent } from './locations-performance.component';

describe('LocationsPerformanceComponent', () => {
  let component: LocationsPerformanceComponent;
  let fixture: ComponentFixture<LocationsPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationsPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
