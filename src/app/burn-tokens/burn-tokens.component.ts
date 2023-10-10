import { TokenSubmission } from './../../cardano-tools-client/model/tokenSubmission';
import { RoyaltiesCip27MintSuccessComponent } from './../royalties-cip27-mint-success/royalties-cip27-mint-success.component';
import { NgForm } from '@angular/forms';
import {
  debounceTime,
  switchMap,
  tap,
  distinctUntilChanged,
  map,
} from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { interval, Subscription, Subject } from 'rxjs';
import {
  AccountPrivate,
  MintOrderSubmission,
  MintRestInterfaceService,
  PolicyPrivate,
  TokenRestInterfaceService,
  Transaction,
} from 'src/cardano-tools-client';
import { AccountService } from './../account.service';
import { AjaxInterceptor } from './../ajax.interceptor';
import {
  TokenDataWithMetadata,
  TokenEnhancerService,
} from './../token-enhancer.service';
import { LatestTokensDetailComponent } from '../latest-tokens-detail/latest-tokens-detail.component';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { RestHandlerService, TokenListItem } from 'src/dbsync-client';
@Component({
  selector: 'app-burn-tokens',
  templateUrl: './burn-tokens.component.html',
  styleUrls: ['./burn-tokens.component.scss'],
})
export class BurnTokensComponent implements OnDestroy {
  @ViewChild('instructionsForm') instructionsForm!: NgForm;

  account?: AccountPrivate;
  policies?: PolicyPrivate[];
  policy?: PolicyPrivate;
  fundingAddresses?: string[];
  allTokens: TokenListItem[] = [];
  filteredTokens: TokenListItem[] = [];
  percent: number = 20;
  addr: string = '';
  loading = false;

  timer: Subscription;
  accountSubscription: Subscription;
  policiesSubscription: Subscription;
  fundingAddressesSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private accountService: AccountService,
    private tokenApi: RestHandlerService,
    private tokenEnhancerService: TokenEnhancerService,
    private clipboard: Clipboard,
    private api: MintRestInterfaceService,
    ajaxInterceptor: AjaxInterceptor,
    private snackBar: MatSnackBar,
  ) {
    this.accountSubscription = accountService.account.subscribe((account) => {
      this.account = account;
      this.updateTokens();
    });
    this.policiesSubscription = accountService.policies.subscribe(
      (policies) => (this.policies = policies),
    );
    this.fundingAddressesSubscription =
      accountService.fundingAddresses.subscribe(
        (fundingAddresses) => (this.fundingAddresses = fundingAddresses),
      );

    this.timer = interval(10000).subscribe(() => {
      if (this.filteredTokens.length === 0) {
        this.updateTokens();
      }
    });
    ajaxInterceptor.ajaxStatusChanged$.subscribe(
      (ajaxStatus) => (this.loading = ajaxStatus),
    );
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
    this.accountSubscription.unsubscribe();
    this.policiesSubscription.unsubscribe();
    this.fundingAddressesSubscription.unsubscribe();
  }

  filterTokens() {
    if (this.account && this.policy) {
      this.filteredTokens = this.allTokens.filter(
        (t) => t.maPolicyId == this.policy?.policyId,
      );
    }
  }

  updateTokens() {
    this.tokenApi
      .getAddressTokenList(this.account!.address.address)
      .subscribe((tokens) => {
        this.allTokens = tokens;
        this.filterTokens();
      });
  }

  copyToClipboard(value: string) {
    this.clipboard.copy(value);
    let snackBarRef = this.snackBar.open(
      'Copied to clipboard: ' + value,
      undefined,
      { duration: 2000 },
    );
  }

  changePolicyId(policyId: string) {
    this.policy = this.policies?.find((p) => p.policyId === policyId);
    this.filterTokens();
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
    let mintOrderSubmission: MintOrderSubmission = {
      tokens: this.filteredTokens.map(
        (t) =>
          ({
            amount: -t.quantity,
            assetName: Buffer.from(t.maName, 'hex').toString(),
          }) as TokenSubmission,
      ),
      targetAddress: this.fundingAddresses![0],
      pin: false,
      policyId: this.policy!.policyId,
    };

    this.api
      .buildMintTransaction(this.account!.key, mintOrderSubmission)
      .subscribe({
        next: (mintTransaction: Transaction) => {
          if (confirm('Do you really want to submit this burn transaction?')) {
            this.api
              .submitMintTransaction(this.account!.key, mintTransaction)
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
      });
  }
}
