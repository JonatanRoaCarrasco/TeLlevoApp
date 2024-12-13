import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarViajePage } from './agregar-viaje.page';

describe('AgregarViajePage', () => {
  let component: AgregarViajePage;
  let fixture: ComponentFixture<AgregarViajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
