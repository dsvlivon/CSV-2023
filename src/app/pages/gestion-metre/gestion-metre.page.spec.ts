import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionMetrePage } from './gestion-metre.page';

describe('GestionMetrePage', () => {
  let component: GestionMetrePage;
  let fixture: ComponentFixture<GestionMetrePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GestionMetrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
