import { Injectable } from '@angular/core';
import { ReplaySubject, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AccountPrivate, AccountRestInterfaceService, PolicyPrivate } from 'src/cardano-tools-client';
import { RestHandlerService } from 'src/dbsync-client';
import { PolicyConfigPrivate } from './../cardano-tools-client/model/policyConfigPrivate';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  readonly account: ReplaySubject<AccountPrivate> = new ReplaySubject<AccountPrivate>(1);
  readonly funds: ReplaySubject<number> = new ReplaySubject<number>(1);
  readonly fundingAddresses: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  readonly policies: ReplaySubject<PolicyPrivate[]> = new ReplaySubject<PolicyPrivate[]>(1);

  constructor(
    private localStorageService: LocalStorageService,
    private api: AccountRestInterfaceService,
    private dbsyncApi: RestHandlerService
  ) {
    this.initializeAccount();
  }


  private initializeAccount() {
    const accountKey = this.localStorageService.retrieveAccountKey();
    const accountObservable = accountKey ? this.api.getAccount(accountKey) : this.api.createAccount();
    accountObservable.pipe(
      catchError(error => {
        if (error.status == 404) {
          alert("Account not found, creating a new one.");
          return this.api.createAccount();
        } else {
          return throwError(error);
        }
      })
    ).subscribe(account => {
      this.localStorageService.storeAccountKey(account.key);
      this.account.next(account);
      this.updateFunds();
      this.updatePolicies();
    });
  }

  updateFunds() {
    this.account.pipe(
      take(1),
      switchMap(account => this.dbsyncApi.getUtxos(account.address.address)),
    ).subscribe(utxos => {
      this.fundingAddresses.next([... new Set(utxos.map(utxo => utxo.sourceAddress))]);
      this.funds.next(utxos.filter(utxo => utxo.maPolicyId == null).reduce((sum, utxo) => sum + utxo.value, 0));
    });
  }

  updatePolicies() {
    this.account.pipe(
      take(1),
      switchMap(account => this.api.getPolicies(account.key)),
    ).subscribe(policies => {
      this.policies.next(policies);
    });
  }

  createPolicy(policyConfig: PolicyConfigPrivate) {
    let accountKey = this.localStorageService.retrieveAccountKey();
    return this.api.createNewPolicy(accountKey!, policyConfig).subscribe(() => this.updatePolicies());
  }


}
