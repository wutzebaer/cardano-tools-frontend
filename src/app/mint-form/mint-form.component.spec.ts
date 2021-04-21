import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintFormComponent } from './mint-form.component';

describe('MintTokenComponent', () => {
  let component: MintFormComponent;
  let fixture: ComponentFixture<MintFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MintFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
