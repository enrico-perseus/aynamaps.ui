import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AynaroutesComponent } from './aynaroutes.component';

describe('AynaroutesComponent', () => {
  let component: AynaroutesComponent;
  let fixture: ComponentFixture<AynaroutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AynaroutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AynaroutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
