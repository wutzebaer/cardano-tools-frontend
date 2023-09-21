import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  clearAccountKey() {
    localStorage.removeItem('accountKey_1');
  }

  storeAccountKey(accountKey: string) {
    localStorage.setItem('accountKey_1', accountKey);
  }

  retrieveAccountKey(): string | null {
    return localStorage.getItem('accountKey_1');
  }

  storeMyAddress(address: string) {
    localStorage.setItem('myaddress', address);
  }

  retrieveMyAddress(): string | null {
    return localStorage.getItem('myaddress');
  }

  clearPolicyId() {
    localStorage.removeItem('policyId');
  }

  storePolicyId(policyId: string) {
    localStorage.setItem('policyId', policyId);
  }

  retrievePolicyId(): string | null {
    return localStorage.getItem('policyId');
  }
}
