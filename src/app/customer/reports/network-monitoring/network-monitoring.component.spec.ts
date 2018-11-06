import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkMonitoringComponent } from './network-monitoring.component';

describe('NetworkMonitoringComponent', () => {
  let component: NetworkMonitoringComponent;
  let fixture: ComponentFixture<NetworkMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
