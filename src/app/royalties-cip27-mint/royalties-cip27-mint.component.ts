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

@Component({
  selector: 'app-royalties-cip27-mint',
  templateUrl: './royalties-cip27-mint.component.html',
  styleUrls: ['./royalties-cip27-mint.component.scss']
})
export class RoyaltiesCip27MintComponent implements OnInit {

  @ViewChild('instructionsForm') instructionsForm!: NgForm;

  account!: AccountPrivate;
  policy?: PolicyPrivate;
  tokens: TokenDataWithMetadata[] = [];
  percent: number = 20
  addr: string = ""
  timer: Subscription;
  loading = false;

  mintOrderSubmission: MintOrderSubmission = {
    tokens: [],
    targetAddress: '',
    tip: true,
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
    minOutput: 1.602519 * 1000000,
    txSize: 0,
    signedData: ""
  }
  private transactionUpdates$ = new Subject<any>();

  constructor(
    public dialog: MatDialog,
    private accountService: AccountService,
    private tokenApi: TokenRestInterfaceService,
    private tokenEnhancerService: TokenEnhancerService,
    private clipboard: Clipboard,
    private api: MintRestInterfaceService,
    ajaxInterceptor: AjaxInterceptor) {

    accountService.account.subscribe(account => {
      if (!this.account) {
        this.account = account;
        return;
      } else {
        let balanceChanged = account.address.balance != this.account.address.balance || account.key != this.account.key;
        this.account = account;
        if (account.fundingAddresses.indexOf(this.mintOrderSubmission.targetAddress) === -1) {
          this.mintOrderSubmission.targetAddress = account.fundingAddresses[0];
        }
        if (balanceChanged) {
          this.buildTransaction();
        }
      }
    });
    this.timer = interval(10000).subscribe(() => {
      if (this.account.address.balance < 2000000) {
        this.updateAccount();
      }
    });
    ajaxInterceptor.ajaxStatusChanged$.subscribe(ajaxStatus => this.loading = ajaxStatus)
  }

  ngOnInit(): void {
    this.transactionUpdates$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(value => this.buildTransaction());
  }

  inputChanged(value: any) {
    this.transactionUpdates$.next(value);
  }

  get minAdaBalance() {
    let minBalance = 0;
    minBalance += (this.mintTransaction.fee || 0)
    minBalance += this.mintTransaction.minOutput as number

    if (this.mintTransaction.mintOrderSubmission?.tip)
      minBalance += 1000000

    return minBalance / 1000000;
  }

  get adaBalance() {
    return ((this.account.address.balance || 0)) / 1000000;
  }


  get adaTip() {
    if (!this.mintTransaction.mintOrderSubmission?.tip) {
      return 0;
    }
    let change = (this.account.address.balance || 0) - (this.mintTransaction.fee || 0) - (this.mintTransaction.minOutput as number)
    return (Math.max(change, 1000000)) / 1000000;
  }

  updateAccount() {
    this.accountService.updateAccount();
  }

  copyToClipboard(value: string) {
    this.clipboard.copy(value);
  }

  changePolicyId(policyId: string) {
    this.policy = this.account.policies.find(p => p.policyId === policyId)
    this.tokenApi.policyTokens(this.policy!.policyId).subscribe({ next: tokens => this.tokens = this.tokenEnhancerService.enhanceTokens(tokens) });
    this.buildTransaction();
  }

  buildTransaction() {

    if (!this.instructionsForm || this.instructionsForm.untouched || this.instructionsForm.invalid) {
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

    this.api.buildMintTransaction(this.mintOrderSubmission, this.account.key).subscribe(mintTransaction => {
      this.mintTransaction = mintTransaction;
    })
  }

  generateCip27() {
    this.api.submitMintTransaction(this.mintTransaction, this.account.key).subscribe({
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