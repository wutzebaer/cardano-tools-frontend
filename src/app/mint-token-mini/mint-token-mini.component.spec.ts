import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintTokenMiniComponent } from './mint-token-mini.component';

describe('MintTokenMiniComponent', () => {
  let component: MintTokenMiniComponent;
  let fixture: ComponentFixture<MintTokenMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MintTokenMiniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintTokenMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
