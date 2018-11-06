import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoiComponent } from './add-poi.component';

describe('AddPoiComponent', () => {
  let component: AddPoiComponent;
  let fixture: ComponentFixture<AddPoiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPoiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
