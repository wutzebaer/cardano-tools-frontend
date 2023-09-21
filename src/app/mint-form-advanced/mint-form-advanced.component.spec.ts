import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintFormAdvancedComponent } from './mint-form-advanced.component';

describe('MintFormAdvancedComponent', () => {
  let component: MintFormAdvancedComponent;
  let fixture: ComponentFixture<MintFormAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintFormAdvancedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintFormAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
