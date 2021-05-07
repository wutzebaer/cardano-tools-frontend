import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestTokensComponent } from './latest-tokens.component';

describe('LatestTokensComponent', () => {
  let component: LatestTokensComponent;
  let fixture: ComponentFixture<LatestTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestTokensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
