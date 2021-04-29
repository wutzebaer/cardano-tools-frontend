import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintSuccessComponent } from './mint-success.component';

describe('MintSuccessComponent', () => {
  let component: MintSuccessComponent;
  let fixture: ComponentFixture<MintSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MintSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
