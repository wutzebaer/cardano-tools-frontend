import { LocalStorageService } from './local-storage.service';
import { startWith } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Account, RestInterfaceService } from 'src/cardano-tools-client';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  readonly account: Subject<Account> = new BehaviorSubject<Account>({
    key: "",
    address: "",
    balance: 0,
    fundingAddresses: [],
    createdAt: new Date(),
    skey: "",
    vkey: "",
    lastUpdate: 0,
    policyId: "",
    policy: "{\"scripts\":[{\"slot\":0}]}",
    policyDueDate: new Date()
  });

  constructor(private localStorageService: LocalStorageService, private api: RestInterfaceService) {
  }


  updateAccount() {
    let accountKey = this.localStorageService.retrieveAccountKey();
    let accountObservable;

    if (!accountKey) {
      accountObservable = this.api.createAccount();
    }
    else {
      accountObservable = this.api.getAccount(accountKey);
    }
    this.loadAccount(accountObservable);
  }

  discardPolicy() {
    let accountKey = this.localStorageService.retrieveAccountKey();
    if (accountKey && confirm('Discard policy and start with a new one? You will not be able to mint more tokens for the old one!')) {
      this.loadAccount(this.api.refreshPolicy(accountKey));
    }
  }

  private loadAccount(accountObservable: Observable<Account>) {
    accountObservable.subscribe(
      {
        error: error => {
          if (error.status >= 400 && error.status < 500) {
            alert("Account not found, creating a new one.");
            this.localStorageService.clearAccountKey();
            this.updateAccount();
          }
        },
        next: account => {
          this.localStorageService.storeAccountKey(account.key);
          this.account.next(account);
        }
      }
    );
  }

}
