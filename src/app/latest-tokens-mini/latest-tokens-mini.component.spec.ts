import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestTokensMiniComponent } from './latest-tokens-mini.component';

describe('LatestTokensMiniComponent', () => {
  let component: LatestTokensMiniComponent;
  let fixture: ComponentFixture<LatestTokensMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestTokensMiniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestTokensMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
