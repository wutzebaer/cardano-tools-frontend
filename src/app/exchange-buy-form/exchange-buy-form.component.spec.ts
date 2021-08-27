import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeBuyFormComponent } from './exchange-buy-form.component';

describe('ExchangeBuyFormComponent', () => {
  let component: ExchangeBuyFormComponent;
  let fixture: ComponentFixture<ExchangeBuyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeBuyFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeBuyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
