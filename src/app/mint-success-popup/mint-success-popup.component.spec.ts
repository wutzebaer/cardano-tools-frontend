import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintSuccessPopupComponent } from './mint-success-popup.component';

describe('MintSuccessPopupComponent', () => {
  let component: MintSuccessPopupComponent;
  let fixture: ComponentFixture<MintSuccessPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MintSuccessPopupComponent]
    });
    fixture = TestBed.createComponent(MintSuccessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
