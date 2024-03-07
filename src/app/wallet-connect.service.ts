import { Injectable } from '@angular/core';
import { Value } from '@emurgo/cardano-serialization-lib-browser';
import { BehaviorSubject } from 'rxjs';
import { ErrorService } from './error.service';
import { LocalStorageService } from './local-storage.service';

export type Cardano = Map<string, WalletInfo>;

export interface WalletInfo {
  apiVersion: string;
  name: string;
  icon: string;
  isEnabled: () => Promise<boolean>;
  enable: () => Promise<WalletConnection>;
}

export interface WalletConnection {
  getBalance: () => Promise<string>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
  getUtxos: () => Promise<string[]>;
  getCollateral: () => Promise<string[]>;
  signTx: (cbor: string, partialSign: boolean) => Promise<string>;
  submitTx: (cbor: string) => Promise<string>;
}

export type DappWallet = {
  walletInfo: WalletInfo;
  walletConnector: WalletConnection;
  balance?: number;
};

@Injectable({
  providedIn: 'root',
})
export class WalletConnectService {
  private cardano: Cardano;
  private dappWalletSubject: BehaviorSubject<DappWallet | undefined> =
    new BehaviorSubject<DappWallet | undefined>(undefined);
  public dappWallet$ = this.dappWalletSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    this.cardano = Object.entries(((window as any).cardano ?? {}) as Cardano)
      .filter(([key, value]: [string, WalletInfo]) => value.apiVersion)
      .reduce((cardano, [key, value]) => {
        cardano.set(key, value);
        return cardano;
      }, new Map());
    this.restoreLast();
  }

  private async restoreLast() {
    const walletKey = this.localStorageService.retrieveWallet();
    if (walletKey) {
      if (await this.cardano.get(walletKey)?.isEnabled()) {
        this.connect(walletKey);
      }
    }
  }

  getCardano() {
    return this.cardano;
  }

  getDappWallet() {
    if (!this.dappWalletSubject.value) {
      throw new Error('Please connect wallet first');
    }
    return this.dappWalletSubject.value;
  }

  public async getRewardAddressHash() {
    return (await this.getDappWallet().walletConnector.getRewardAddresses())[0];
  }

  public async connect(walletKey: string) {
    this.dappWalletSubject.next(undefined);
    this.localStorageService.storeWallet(walletKey);

    const walletInfo = this.cardano.get(walletKey);
    const walletConnector = await walletInfo?.enable();
    if (walletInfo && walletConnector) {
      this.dappWalletSubject.next({
        walletInfo,
        walletConnector,
      });
      this.updateBalance();
    }
  }

  public async updateBalance() {
    const dappWallet = this.dappWalletSubject.value;
    if (dappWallet) {
      const balanceCBORHex = await dappWallet.walletConnector.getBalance();
      const balanceBigNum = Value.from_bytes(
        Buffer.from(balanceCBORHex, 'hex')
      ).coin();
      const balance = Number(balanceBigNum.to_str());
      this.dappWalletSubject.next({
        ...dappWallet,
        balance,
      });
    }
  }
}
