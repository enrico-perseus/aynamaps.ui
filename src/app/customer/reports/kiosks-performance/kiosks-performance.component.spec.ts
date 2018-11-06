import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KiosksPerformanceComponent } from './kiosks-performance.component';

describe('KiosksPerformanceComponent', () => {
  let component: KiosksPerformanceComponent;
  let fixture: ComponentFixture<KiosksPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KiosksPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KiosksPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
