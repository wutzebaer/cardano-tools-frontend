import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeRewardsComponent } from './stake-rewards.component';

describe('StakeRewardsComponent', () => {
  let component: StakeRewardsComponent;
  let fixture: ComponentFixture<StakeRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StakeRewardsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
