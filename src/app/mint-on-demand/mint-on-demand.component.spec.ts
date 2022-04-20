import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintOnDemandComponent } from './mint-on-demand.component';

describe('MintOnDemandComponent', () => {
  let component: MintOnDemandComponent;
  let fixture: ComponentFixture<MintOnDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MintOnDemandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintOnDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
