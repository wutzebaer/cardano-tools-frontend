import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeBuyComponent } from './exchange-buy.component';

describe('ExchangeBuyComponent', () => {
  let component: ExchangeBuyComponent;
  let fixture: ComponentFixture<ExchangeBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeBuyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
