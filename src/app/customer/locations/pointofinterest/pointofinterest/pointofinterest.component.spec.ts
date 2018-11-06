import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointofinterestComponent } from './pointofinterest.component';

describe('PointofinterestComponent', () => {
  let component: PointofinterestComponent;
  let fixture: ComponentFixture<PointofinterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointofinterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointofinterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
