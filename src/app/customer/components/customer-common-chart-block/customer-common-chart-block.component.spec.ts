import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCommonChartBlockComponent } from './customer-common-chart-block.component';

describe('CustomerCommonChartBlockComponent', () => {
  let component: CustomerCommonChartBlockComponent;
  let fixture: ComponentFixture<CustomerCommonChartBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCommonChartBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCommonChartBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
