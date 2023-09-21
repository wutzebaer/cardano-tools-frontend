import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletStatementComponent } from './wallet-statement.component';

describe('WalletStatementComponent', () => {
  let component: WalletStatementComponent;
  let fixture: ComponentFixture<WalletStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletStatementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
