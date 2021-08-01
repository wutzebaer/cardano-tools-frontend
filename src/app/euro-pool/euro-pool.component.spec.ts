import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EuroPoolComponent } from './euro-pool.component';

describe('EuroPoolComponent', () => {
  let component: EuroPoolComponent;
  let fixture: ComponentFixture<EuroPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EuroPoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EuroPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
