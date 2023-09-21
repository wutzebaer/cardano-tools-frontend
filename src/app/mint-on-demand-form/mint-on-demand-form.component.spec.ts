import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintOnDemandFormComponent } from './mint-on-demand-form.component';

describe('MintOnDemandFormComponent', () => {
  let component: MintOnDemandFormComponent;
  let fixture: ComponentFixture<MintOnDemandFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintOnDemandFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintOnDemandFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
