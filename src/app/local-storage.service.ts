import { TransferAccount } from './../cardano-tools-client/model/transferAccount';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  storeAccountKey(accountKey: string) {
    localStorage.setItem("accountKey", accountKey);
  }

  retrieveAccountKey(): string | null {
    return localStorage.getItem("accountKey");
  }
}