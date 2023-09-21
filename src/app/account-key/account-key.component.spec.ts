import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountKeyComponent } from './account-key.component';

describe('AccountKeyComponent', () => {
  let component: AccountKeyComponent;
  let fixture: ComponentFixture<AccountKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountKeyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
