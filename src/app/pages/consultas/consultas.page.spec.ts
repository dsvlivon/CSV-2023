import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultasPage } from './consultas.page';

describe('ConsultasPage', () => {
  let component: ConsultasPage;
  let fixture: ComponentFixture<ConsultasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConsultasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
