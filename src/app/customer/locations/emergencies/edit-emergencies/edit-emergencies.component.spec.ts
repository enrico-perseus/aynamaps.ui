import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmergenciesComponent } from './edit-emergencies.component';

describe('EditEmergenciesComponent', () => {
  let component: EditEmergenciesComponent;
  let fixture: ComponentFixture<EditEmergenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmergenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmergenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
