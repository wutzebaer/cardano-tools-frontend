import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaltiesCip27MintComponent } from './royalties-cip27-mint.component';

describe('RoyaltiesCip27MintComponent', () => {
  let component: RoyaltiesCip27MintComponent;
  let fixture: ComponentFixture<RoyaltiesCip27MintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoyaltiesCip27MintComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoyaltiesCip27MintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
