import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintPolicyFormComponent } from './mint-policy-form.component';

describe('MintPolicyFormComponent', () => {
  let component: MintPolicyFormComponent;
  let fixture: ComponentFixture<MintPolicyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintPolicyFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintPolicyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
