import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { AccountPrivate, AccountRestInterfaceService } from 'src/cardano-tools-client';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  readonly account: ReplaySubject<AccountPrivate> = new ReplaySubject<AccountPrivate>();

  constructor(private localStorageService: LocalStorageService, private api: AccountRestInterfaceService) {
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

  private loadAccount(accountObservable: Observable<AccountPrivate>) {
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
