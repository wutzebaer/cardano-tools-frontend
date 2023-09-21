import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintReviewAndSubmitComponent } from './mint-review-and-submit.component';

describe('MintReviewAndSubmitComponent', () => {
  let component: MintReviewAndSubmitComponent;
  let fixture: ComponentFixture<MintReviewAndSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintReviewAndSubmitComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintReviewAndSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
