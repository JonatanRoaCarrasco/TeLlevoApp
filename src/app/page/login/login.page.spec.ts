import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOGINPage } from './login.page';

describe('LOGINPage', () => {
  let component: LOGINPage;
  let fixture: ComponentFixture<LOGINPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LOGINPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
