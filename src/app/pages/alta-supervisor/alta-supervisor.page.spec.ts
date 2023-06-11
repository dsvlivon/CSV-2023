import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AltaSupervisorPage } from './alta-supervisor.page';

describe('AltaSupervisorPage', () => {
  let component: AltaSupervisorPage;
  let fixture: ComponentFixture<AltaSupervisorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AltaSupervisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
