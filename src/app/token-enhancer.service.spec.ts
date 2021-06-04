import { TestBed } from '@angular/core/testing';

import { TokenEnhancerService } from './token-enhancer.service';

describe('TokenEnhancerService', () => {
  let service: TokenEnhancerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenEnhancerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
