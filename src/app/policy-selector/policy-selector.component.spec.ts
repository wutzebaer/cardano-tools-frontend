import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySelectorComponent } from './policy-selector.component';

describe('PolicySelectorComponent', () => {
  let component: PolicySelectorComponent;
  let fixture: ComponentFixture<PolicySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolicySelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
