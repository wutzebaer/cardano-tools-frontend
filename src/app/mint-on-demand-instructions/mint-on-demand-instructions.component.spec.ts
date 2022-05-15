import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintOnDemandInstructionsComponent } from './mint-on-demand-instructions.component';

describe('MintOnDemandInstructionsComponent', () => {
  let component: MintOnDemandInstructionsComponent;
  let fixture: ComponentFixture<MintOnDemandInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MintOnDemandInstructionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintOnDemandInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
