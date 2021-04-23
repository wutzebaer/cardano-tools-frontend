import { TransferAccount } from './../cardano-tools-client/model/transferAccount';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  storeAccount(account: TransferAccount) {
    localStorage.setItem("account", JSON.stringify(account));
  }

  retrieveAccount(): TransferAccount | null {
    let accountJson: string | null = localStorage.getItem("account");
    if (accountJson) {
      return JSON.parse(accountJson);
    } else {
      return null;
    }
  }
}
