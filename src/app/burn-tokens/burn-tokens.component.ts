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
import { CardanoDappService } from '../cardano-dapp.service';
import { DappWallet, WalletConnectService } from '../wallet-connect.service';
import { AssetName, TransactionUnspentOutput } from '@emurgo/cardano-serialization-lib-browser';
@Component({
  selector: 'app-burn-tokens',
  templateUrl: './burn-tokens.component.html',
  styleUrls: ['./burn-tokens.component.scss'],
})
export class BurnTokensComponent implements OnDestroy {
  @ViewChild('instructionsForm') instructionsForm!: NgForm;

  dappWallet?: DappWallet;
  policies?: PolicyPrivate[];
  policy?: PolicyPrivate;
  tokens: TokenListItem[] = [];
  loading = false;

  policiesSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private accountService: AccountService,
    private tokenApi: RestHandlerService,
    private clipboard: Clipboard,
    private api: MintRestInterfaceService,
    private snackBar: MatSnackBar,
    private cardanoDappService: CardanoDappService,
    private walletConnectService: WalletConnectService
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

  async updateTokens() {
    if (!this.policy || !this.dappWallet) {
      return;
    }

    const tokens: TokenListItem[] = [];

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
              maPolicyId: this.policy.policyId,
              maName: assetName.to_hex(),
              maFingerprint: '',
              quantity: Number(value.to_str()),
              name: Buffer.from(assetName.name()).toString(),
              image: '',
            });

            console.log(
              scriptHash.to_hex(),
              Buffer.from(assetName.name()).toString(),
              value?.to_js_value()
            );
          }
        }
      }
    }

    this.tokens = tokens;
  }

  changePolicyId(policyId: string) {
    this.policy = this.policies?.find((p) => p.policyId === policyId);
    this.updateTokens();
  }

  details(token: TokenListItem) {
    this.dialog.open(LatestTokensDetailComponent, {
      width: '750px',
      maxWidth: '90vw',
      data: { tokenListItem: token },
      closeOnNavigation: true,
    });
  }

  burn() {
    /*     let mintOrderSubmission: MintOrderSubmission = {
      tokens: this.filteredTokens.map(
        (t) =>
          ({
            amount: -t.quantity,
            assetName: Buffer.from(t.maName, 'hex').toString(),
          } as TokenSubmission)
      ),
      targetAddress: this.fundingAddresses![0],
      pin: false,
      policyId: this.policy!.policyId,
    };

    this.api
      .buildMintTransaction(mintOrderSubmission, this.account!.key)
      .subscribe({
        next: (mintTransaction: Transaction) => {
          if (confirm('Do you really want to submit this burn transaction?')) {
            this.api
              .submitMintTransaction(mintTransaction, this.account!.key)
              .subscribe({
                complete: () => {
                  this.instructionsForm.reset();
                  this.dialog.open(RoyaltiesCip27MintSuccessComponent, {
                    width: '600px',
                    maxWidth: '90vw',
                    data: { transaction: mintTransaction },
                    closeOnNavigation: true,
                  });
                },
              });
          }
        },
      }); */
  }
}
