import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurnTokensSuccessComponent } from './burn-tokens-success.component';

describe('BurnTokensSuccessComponent', () => {
  let component: BurnTokensSuccessComponent;
  let fixture: ComponentFixture<BurnTokensSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BurnTokensSuccessComponent]
    });
    fixture = TestBed.createComponent(BurnTokensSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
