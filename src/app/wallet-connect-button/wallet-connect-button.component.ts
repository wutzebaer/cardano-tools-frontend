import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';
import {
  Cardano,
  DappWallet,
  WalletConnectService,
} from '../wallet-connect.service';
import { CardanoDappService } from '../cardano-dapp.service';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-wallet-connect-button',
  templateUrl: './wallet-connect-button.component.html',
  styleUrls: ['./wallet-connect-button.component.scss'],
})
export class WalletConnectButtonComponent implements OnInit {
  private dappWalletSubscription: Subscription;

  cardano: Cardano;
  dappWallet?: DappWallet;

  constructor(
    private walletConnectServiceService: WalletConnectService,
    private localStorageService: LocalStorageService,
    private cardanoDappService: CardanoDappService,
    private errorService: ErrorService
  ) {
    this.cardano = this.walletConnectServiceService.getCardano();
    this.dappWalletSubscription =
      this.walletConnectServiceService.dappWallet$.subscribe((dappWallet) => {
        this.dappWallet = dappWallet;
      });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.dappWalletSubscription.unsubscribe();
  }

  get balance() {
    return this.dappWallet?.balance;
  }
  get walletInfo() {
    return this.dappWallet?.walletInfo;
  }
  get walletConnector() {
    return this.dappWallet?.walletConnector;
  }

  async connect(walletKey: string) {
    try {
      await this.walletConnectServiceService.connect(walletKey);
    } catch (error) {
      this.errorService.handleError(error);
    }
  }
}
