import { LocalStorageService } from './local-storage.service';
import { startWith } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, ReplaySubject } from 'rxjs';
import { Account, RestInterfaceService } from 'src/cardano-tools-client';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  readonly account: Subject<Account> = new ReplaySubject<Account>();

  constructor(private localStorageService: LocalStorageService, private api: RestInterfaceService) {
    this.account.next({
      key: "",
      createdAt: new Date(0),
      policies: [],
      address: {
        address: "",
        balance: 0,
        tokensData: "[]"
      },
      fundingAddresses: [],
      fundingAddressesHistory: [],
      stake: 0,
      lastUpdate: new Date(0),
    });
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

  discardPolicy(days: number) {
    let accountKey = this.localStorageService.retrieveAccountKey();
    if (accountKey) {
      this.loadAccount(this.api.refreshPolicy(days, accountKey));
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
