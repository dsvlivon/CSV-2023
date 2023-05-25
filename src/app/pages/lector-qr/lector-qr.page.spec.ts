import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LectorQrPage } from './lector-qr.page';

describe('LectorQrPage', () => {
  let component: LectorQrPage;
  let fixture: ComponentFixture<LectorQrPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LectorQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
