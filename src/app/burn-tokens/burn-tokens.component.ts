import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, interval } from 'rxjs';
import {
  AccountPrivate,
  MintOrderSubmission,
  MintRestInterfaceService,
  PolicyPrivate,
  TokenSubmission,
  Transaction,
} from 'src/cardano-tools-client';
import { RestHandlerService, TokenListItem } from 'src/dbsync-client';
import { LatestTokensDetailComponent } from '../latest-tokens-detail/latest-tokens-detail.component';
import { AccountService } from './../account.service';
import { AjaxInterceptor } from './../ajax.interceptor';
import { RoyaltiesCip27MintSuccessComponent } from './../royalties-cip27-mint-success/royalties-cip27-mint-success.component';
import { TokenEnhancerService } from './../token-enhancer.service';
import { BurnToken, CardanoDappService } from '../cardano-dapp.service';
import { DappWallet, WalletConnectService } from '../wallet-connect.service';
import {
  AssetName,
  TransactionUnspentOutput,
} from '@emurgo/cardano-serialization-lib-browser';
import { ErrorService } from '../error.service';
import { BurnTokensSuccessComponent } from '../burn-tokens-success/burn-tokens-success.component';

@Component({
  selector: 'app-burn-tokens',
  templateUrl: './burn-tokens.component.html',
  styleUrls: ['./burn-tokens.component.scss'],
})
export class BurnTokensComponent implements OnDestroy {
  dappWallet?: DappWallet;
  policies?: PolicyPrivate[];
  policy?: PolicyPrivate;
  minting = false;

  tokens: BurnToken[] = [];
  selectedTokens: BurnToken[] = [];

  policiesSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private accountService: AccountService,
    private tokenApi: RestHandlerService,
    private clipboard: Clipboard,
    private api: MintRestInterfaceService,
    private snackBar: MatSnackBar,
    private cardanoDappService: CardanoDappService,
    private walletConnectService: WalletConnectService,
    private errorService: ErrorService
  ) {
    this.policiesSubscription = accountService.policies.subscribe(
      (policies) => {
        this.policies = policies;
      }
    );

    this.walletConnectService.dappWallet$.subscribe((dappWallet) => {
      this.dappWallet = dappWallet;
      this.updateTokens();
    });
  }

  ngOnDestroy(): void {
    this.policiesSubscription.unsubscribe();
  }

  toggleSelection(token: BurnToken) {
    const index = this.selectedTokens.indexOf(token);
    if (index !== -1) {
      this.selectedTokens.splice(index, 1);
    } else {
      this.selectedTokens.push(token);
    }
  }

  async updateTokens() {
    if (!this.policy || !this.dappWallet) {
      return;
    }

    const tokens: BurnToken[] = [];
    const rawUtxos = await this.dappWallet.walletConnector.getUtxos();
    const utxos = rawUtxos.map((ru) => TransactionUnspentOutput.from_hex(ru));
    for (const utxo of utxos) {
      const multiAsset = utxo.output().amount().multiasset();
      if (!multiAsset) continue;
      const scriptHashes = multiAsset.keys();
      for (let i = 0; i < scriptHashes.len(); i++) {
        const scriptHash = scriptHashes.get(i);
        if (scriptHash.to_hex() === this.policy.policyId) {
          const assets = multiAsset.get(scriptHash)!;
          const assetNames = assets.keys();
          for (let j = 0; j < assetNames.len(); j++) {
            const assetName = assetNames.get(j);
            const value = assets.get(assetName)!;
            tokens.push({
              policyId: this.policy.policyId,
              maName: Buffer.from(assetName.name()).toString('hex'),
              amount: Number(value.to_str()),
              utxo: utxo,
            });
          }
        }
      }
    }

    this.tokens = tokens;
    this.selectedTokens = [];
  }

  changePolicyId(policyId: string) {
    this.policy = this.policies?.find((p) => p.policyId === policyId);
    this.updateTokens();
  }

  async burn() {
    if (!this.policy) {
      return;
    }

    try {
      this.minting = true;
      const txId = await this.cardanoDappService.burnTokens(
        this.policy,
        this.selectedTokens
      );

      this.updateTokens();

      this.dialog.open(BurnTokensSuccessComponent, {
        width: '600px',
        maxWidth: '90vw',
        data: { txId },
        closeOnNavigation: true,
      });
    } catch (error) {
      console.log(error);
      this.errorService.handleError(error);
    } finally {
      this.minting = false;
    }
  }
}
