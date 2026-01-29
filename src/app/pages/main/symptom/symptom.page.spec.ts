import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SymptomPage } from './symptom.page';

describe('SymptomPage', () => {
  let component: SymptomPage;
  let fixture: ComponentFixture<SymptomPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SymptomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
