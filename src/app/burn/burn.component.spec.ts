import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurnComponent } from './burn.component';

describe('BurnComponent', () => {
  let component: BurnComponent;
  let fixture: ComponentFixture<BurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
