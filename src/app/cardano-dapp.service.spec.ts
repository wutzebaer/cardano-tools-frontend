import { TestBed } from '@angular/core/testing';

import { CardanoDappService } from './cardano-dapp.service';

describe('CardanoDappServiceService', () => {
  let service: CardanoDappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardanoDappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
