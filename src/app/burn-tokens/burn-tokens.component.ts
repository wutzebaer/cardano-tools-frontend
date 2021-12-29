import { TokenSubmission } from './../../cardano-tools-client/model/tokenSubmission';
import { RoyaltiesCip27MintSuccessComponent } from './../royalties-cip27-mint-success/royalties-cip27-mint-success.component';
import { NgForm } from '@angular/forms';
import { debounceTime, switchMap, tap, distinctUntilChanged } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { interval, Subscription, Subject } from 'rxjs';
import { AccountPrivate, MintOrderSubmission, MintRestInterfaceService, PolicyPrivate, TokenRestInterfaceService, Transaction } from 'src/cardano-tools-client';
import { AccountService } from './../account.service';
import { AjaxInterceptor } from './../ajax.interceptor';
import { TokenDataWithMetadata, TokenEnhancerService } from './../token-enhancer.service';
import { LatestTokensDetailComponent } from '../latest-tokens-detail/latest-tokens-detail.component';
@Component({
  selector: 'app-burn-tokens',
  templateUrl: './burn-tokens.component.html',
  styleUrls: ['./burn-tokens.component.scss']
})
export class BurnTokensComponent implements OnInit {


  @ViewChild('instructionsForm') instructionsForm!: NgForm;

  account?: AccountPrivate;
  policy?: PolicyPrivate;
  tokens: TokenDataWithMetadata[] = [];
  percent: number = 20
  addr: string = ""
  timer: Subscription;
  loading = false;


  constructor(
    public dialog: MatDialog,
    private accountService: AccountService,
    private tokenApi: TokenRestInterfaceService,
    private tokenEnhancerService: TokenEnhancerService,
    private clipboard: Clipboard,
    private api: MintRestInterfaceService,
    ajaxInterceptor: AjaxInterceptor) {

    accountService.account.subscribe(account => {
      this.account = account;
      this.filterTokens()
    });
    this.timer = interval(10000).subscribe(() => {
      if (this.account?.address.balance || 0 < 2000000) {
        this.updateAccount();
      }
    });
    ajaxInterceptor.ajaxStatusChanged$.subscribe(ajaxStatus => this.loading = ajaxStatus)
  }

  ngOnInit(): void {
  }

  filterTokens() {
    if (this.account && this.policy) {
      this.tokens = this.tokenEnhancerService.enhanceTokens(JSON.parse(this.account.address.tokensData)).filter(t => t.policyId == this.policy?.policyId)
    }
  }

  updateAccount() {
    this.accountService.updateAccount();
  }

  copyToClipboard(value: string) {
    this.clipboard.copy(value);
  }

  changePolicyId(policyId: string) {
    this.policy = this.account?.policies.find(p => p.policyId === policyId)
    this.filterTokens()
  }

  details(token: TokenDataWithMetadata) {
    this.dialog.open(LatestTokensDetailComponent, {
      width: '750px',
      maxWidth: '90vw',
      data: { tokens: this.tokens, tokenIndex: this.tokens.indexOf(token) },
      closeOnNavigation: true
    });
  }


  burn() {

    let mintOrderSubmission: MintOrderSubmission = {
      tokens: this.tokens.map(t => ({ amount: -t.quantity, assetName: t.name } as TokenSubmission)),
      targetAddress: this.account!.fundingAddresses[0],
      tip: false,
      policyId: this.policy!.policyId,
      metaData: '{}'
    };

    this.api.buildMintTransaction(mintOrderSubmission, this.account!.key).subscribe({
      next: (mintTransaction: Transaction) => {

        if (confirm('Do you really want to submit this burn transaction?')) {
          this.api.submitMintTransaction(mintTransaction, this.account!.key).subscribe({
            complete: () => {
              this.instructionsForm.reset();
              this.dialog.open(RoyaltiesCip27MintSuccessComponent, {
                width: '600px',
                maxWidth: '90vw',
                data: { transaction: mintTransaction },
                closeOnNavigation: true
              });
            }
          });
        }

      }
    });

  }

}
