import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestTokensDetailComponent } from './latest-tokens-detail.component';

describe('LatestTokensDetailComponent', () => {
  let component: LatestTokensDetailComponent;
  let fixture: ComponentFixture<LatestTokensDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestTokensDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestTokensDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
