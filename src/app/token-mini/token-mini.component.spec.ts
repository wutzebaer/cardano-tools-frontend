import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenMiniComponent } from './token-mini.component';

describe('TokenMiniComponent', () => {
  let component: TokenMiniComponent;
  let fixture: ComponentFixture<TokenMiniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TokenMiniComponent]
    });
    fixture = TestBed.createComponent(TokenMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
