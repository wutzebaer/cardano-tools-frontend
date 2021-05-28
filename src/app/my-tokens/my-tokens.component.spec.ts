import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTokensComponent } from './my-tokens.component';

describe('MyTokensComponent', () => {
  let component: MyTokensComponent;
  let fixture: ComponentFixture<MyTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTokensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
