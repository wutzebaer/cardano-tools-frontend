import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import {
  BigNum,
  LinearFee,
  TransactionBuilder,
  TransactionBuilderConfigBuilder,
  Value,
} from '@emurgo/cardano-serialization-lib-browser';

export type Cardano = Map<string, WalletInfo>;

export interface WalletInfo {
  apiVersion: string;
  name: string;
  icon: string;
  isEnabled: () => Promise<boolean>;
  enable: () => Promise<WalletConnection>;
}

export interface WalletError {
  code: number;
  info: string;
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

export const txBuilderConfig = TransactionBuilderConfigBuilder.new()
  .fee_algo(LinearFee.new(BigNum.from_str('44'), BigNum.from_str('155381')))
  .coins_per_utxo_word(BigNum.from_str('34482'))
  .pool_deposit(BigNum.from_str('500000000'))
  .key_deposit(BigNum.from_str('2000000'))
  .max_value_size(5000)
  .max_tx_size(16384)
  .build();

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

  getTxBuilder() {
    return TransactionBuilder.new(txBuilderConfig);
  }

  getCardano() {
    return this.cardano;
  }

  getDappWallet() {
    if (!this.dappWalletSubject.value) {
      alert('Please connect wallet first');
      throw new Error('No wallet available');
    }
    return this.dappWalletSubject.value;
  }

  public async getRewardAddressHash() {
    return (await this.getDappWallet().walletConnector.getRewardAddresses())[0];
  }

  public async connect(walletKey: string) {
    this.dappWalletSubject.next(undefined);
    this.localStorageService.storeWallet(walletKey);

    try {
      const walletInfo = this.cardano.get(walletKey);
      const walletConnector = await walletInfo?.enable();
      if (walletInfo && walletConnector) {
        this.dappWalletSubject.next({
          walletInfo,
          walletConnector,
        });
        this.updateBalance();
      }
    } catch (error: any) {
      if (this.isCardanoDAppError(error)) {
        console.error('Caught Cardano dApp Error:', error.code, error.info);
        alert(error.info);
      } else {
        console.error('Unknown error:', error);
        alert(JSON.stringify(error));
      }
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

  public isCardanoDAppError(error: any): error is WalletError {
    return (
      error && typeof error.code === 'number' && typeof error.info === 'string'
    );
  }
}
