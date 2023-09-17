import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription, interval } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RestHandlerService, TokenListItem } from 'src/dbsync-client';
import { AccountService } from './../account.service';
import { AjaxInterceptor } from './../ajax.interceptor';
import { RoyaltiesCip27MintSuccessComponent } from './../royalties-cip27-mint-success/royalties-cip27-mint-success.component';
import { TokenDataWithMetadata, TokenEnhancerService } from './../token-enhancer.service';
import { AccountPrivate, MintOrderSubmission, MintRestInterfaceService, PolicyPrivate, Transaction } from 'src/cardano-tools-client';

@Component({
  selector: 'app-royalties-cip27-mint',
  templateUrl: './royalties-cip27-mint.component.html',
  styleUrls: ['./royalties-cip27-mint.component.scss']
})
export class RoyaltiesCip27MintComponent implements OnInit, OnDestroy {

  @ViewChild('instructionsForm') instructionsForm!: NgForm;

  account?: AccountPrivate;
  funds?: number;
  fundingAddresses?: string[];
  policies?: PolicyPrivate[]
  policy?: PolicyPrivate;
  tokens: TokenListItem[] = [];
  percent: number = 20
  addr: string = ""
  timer: Subscription;
  loading = false;

  mintOrderSubmission: MintOrderSubmission = {
    tokens: [],
    targetAddress: '',
    pin: false,
    policyId: '',
    metaData: '{}'
  };
  mintTransaction: Transaction = {
    rawData: "",
    txId: "",
    fee: 0,
    outputs: "",
    inputs: "",
    metaDataJson: "",
    mintOrderSubmission: this.mintOrderSubmission,
    minOutput: 1.701683 * 1000000,
    txSize: 0,
    signedData: ""
  }
  private transactionUpdates$ = new Subject<any>();
  accountSubscription: Subscription
  fundsSubscription: Subscription
  fundingAddressesSubscription: Subscription
  policiesSubscription: Subscription

  constructor(
    public dialog: MatDialog,
    private accountService: AccountService,
    private dbsyncApi: RestHandlerService,
    private clipboard: Clipboard,
    private api: MintRestInterfaceService,
    ajaxInterceptor: AjaxInterceptor,
    private snackBar: MatSnackBar
  ) {

    this.accountSubscription = accountService.account.subscribe(account => {
      this.account = account;
    });

    this.fundingAddressesSubscription = accountService.fundingAddresses.subscribe(fundingAddresses => {
      this.fundingAddresses = fundingAddresses;
      if (fundingAddresses.indexOf(this.mintOrderSubmission.targetAddress) === -1) {
        this.mintOrderSubmission.targetAddress = fundingAddresses[0];
      }
    })

    this.fundsSubscription = accountService.funds.subscribe(funds => {
      let balanceChanged = funds != this.funds;
      this.funds = funds;
      if (balanceChanged) {
        this.buildTransaction();
      }
    });

    this.policiesSubscription = accountService.policies.subscribe(policies => {
      this.policies = policies;
    });

    this.timer = interval(10000).subscribe(() => {
      if (this.funds || 0 < 2000000) {
        this.updateFunds();
      }
    })
    ajaxInterceptor.ajaxStatusChanged$.subscribe(ajaxStatus => this.loading = ajaxStatus)
  }

  ngOnInit(): void {
    this.transactionUpdates$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(value => this.buildTransaction());
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
    this.accountSubscription.unsubscribe();
    this.fundsSubscription.unsubscribe();
    this.fundingAddressesSubscription.unsubscribe();
    this.policiesSubscription.unsubscribe();
  }

  inputChanged(value: any) {
    this.transactionUpdates$.next(value);
  }

  updateFunds() {
    this.accountService.updateFunds();
  }

  copyToClipboard(value: string) {
    this.clipboard.copy(value);
    let snackBarRef = this.snackBar.open('Copied to clipboard: ' + value, undefined, { duration: 2000 });
  }

  changePolicyId(policyId: string) {
    this.policy = this.policies?.find(p => p.policyId === policyId)
    this.dbsyncApi.getTokenList(undefined, undefined, policyId).subscribe({ next: tokens => this.tokens = tokens });
    this.buildTransaction();
  }

  buildTransaction() {
    if (!this.addr) {
      return;
    }
    this.mintOrderSubmission.tokens = [{ amount: 1, assetName: '' }];
    this.mintOrderSubmission.policyId = this.policy?.policyId!;
    this.mintOrderSubmission.metaData = JSON.stringify({
      '777': {
        'rate': (this.percent / 100).toString(),
        'addr': this.addr.match(/.{1,64}/g),
      }
    }, null, 3);

    this.api.buildMintTransaction(this.account!.key, this.mintOrderSubmission).subscribe(mintTransaction => {
      this.mintTransaction = mintTransaction;
    })
  }

  generateCip27() {
    this.api.submitMintTransaction(this.account!.key, this.mintTransaction).subscribe({
      complete: () => {
        this.instructionsForm.reset();
        this.dialog.open(RoyaltiesCip27MintSuccessComponent, {
          width: '600px',
          maxWidth: '90vw',
          data: { transaction: this.mintTransaction },
          closeOnNavigation: true
        });
      }
    });




  }

}
