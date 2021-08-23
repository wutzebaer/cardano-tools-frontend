import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeSellFormComponent } from './exchange-sell-form.component';

describe('ExchangeSellFormComponent', () => {
  let component: ExchangeSellFormComponent;
  let fixture: ComponentFixture<ExchangeSellFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeSellFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeSellFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
