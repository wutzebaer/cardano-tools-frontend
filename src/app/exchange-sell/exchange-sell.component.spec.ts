import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeSellComponent } from './exchange-sell.component';

describe('ExchangeSellComponent', () => {
  let component: ExchangeSellComponent;
  let fixture: ComponentFixture<ExchangeSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeSellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
