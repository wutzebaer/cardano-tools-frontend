import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTokenSuccessComponent } from './register-token-success.component';

describe('RegisterTokenSuccessComponent', () => {
  let component: RegisterTokenSuccessComponent;
  let fixture: ComponentFixture<RegisterTokenSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterTokenSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterTokenSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
