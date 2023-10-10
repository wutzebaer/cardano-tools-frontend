import { TestBed } from '@angular/core/testing';

import { WalletConnectServiceService } from './wallet-connect-service.service';

describe('WalletConnectServiceService', () => {
  let service: WalletConnectServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletConnectServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
