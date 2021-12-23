import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaltiesCip27MintSuccessComponent } from './royalties-cip27-mint-success.component';

describe('RoyaltiesCip27MintSuccessComponent', () => {
  let component: RoyaltiesCip27MintSuccessComponent;
  let fixture: ComponentFixture<RoyaltiesCip27MintSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoyaltiesCip27MintSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoyaltiesCip27MintSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
