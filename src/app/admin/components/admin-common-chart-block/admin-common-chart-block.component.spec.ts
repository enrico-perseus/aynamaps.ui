import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCommonChartBlockComponent } from './admin-common-chart-block.component';

describe('AdminCommonChartBlockComponent', () => {
  let component: AdminCommonChartBlockComponent;
  let fixture: ComponentFixture<AdminCommonChartBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCommonChartBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCommonChartBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
