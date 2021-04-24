import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintChangeComponent } from './mint-change.component';

describe('MintChangeComponent', () => {
  let component: MintChangeComponent;
  let fixture: ComponentFixture<MintChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MintChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
