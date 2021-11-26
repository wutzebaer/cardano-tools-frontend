import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { AccountPrivate, AccountRestInterfaceService } from 'src/cardano-tools-client';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  readonly account: Subject<AccountPrivate> = new ReplaySubject<AccountPrivate>();

  constructor(private localStorageService: LocalStorageService, private api: AccountRestInterfaceService) {
    this.account.next({
      key: "",
      createdAt: new Date(0),
      policies: [],
      address: {
        address: "",
        balance: 0,
        tokensData: "[]",
        skey: "",
        vkey: ""
      },
      fundingAddresses: [],
      fundingAddressesHistory: [],
      stake: 0,
      lastUpdate: new Date(0),
    });
  }


  updateAccount() {
    console.log("updateAccount")
    let accountKey = this.localStorageService.retrieveAccountKey();
    let accountObservable;

    if (!accountKey) {
      console.log("no key")
      accountObservable = this.api.createAccount();
    }
    else {
      console.log("yes key")
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

  private loadAccount(accountObservable: Observable<AccountPrivate>) {
    console.log("load account")
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
          console.log("loaded account")
          this.localStorageService.storeAccountKey(account.key);
          this.account.next(account);
        }
      }
    );
  }

}
