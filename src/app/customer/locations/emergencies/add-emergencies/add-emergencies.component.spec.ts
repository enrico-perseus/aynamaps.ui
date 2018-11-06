import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmergenciesComponent } from './add-emergencies.component';

describe('AddEmergenciesComponent', () => {
  let component: AddEmergenciesComponent;
  let fixture: ComponentFixture<AddEmergenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmergenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmergenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
