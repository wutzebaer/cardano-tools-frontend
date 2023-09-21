import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm, NgModel } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { AccountPrivate, MintOrderSubmission } from 'src/cardano-tools-client';
import { Transaction } from './../../cardano-tools-client/model/transaction';
import { AccountService } from './../account.service';

export interface Submission {
  targetAddress?: string;
  tip?: boolean;
  pin: boolean;
}

@Component({
  selector: 'app-fund-account',
  templateUrl: './fund-account.component.html',
  styleUrls: ['./fund-account.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class FundAccountComponent implements OnInit, OnDestroy {
  account?: AccountPrivate;
  funds?: number;
  fundingAddresses?: string[];

  @Input() mintTransaction!: Transaction;
  @Output() updateMintTransaction = new EventEmitter<void>();
  @Input() mintOrderSubmission!: Submission;
  @Input() requesttargetAddress = true;
  @Input() showTooltip = true;
  @Input() showTip = true;
  @Input() showPin = false;

  @ViewChild('adaBalanceInput') adaBalanceInput!: NgModel;
  @ViewChild('targetAddressInput') targetAddressInput!: NgModel;
  @ViewChild('txSizeInput') txSizeInput!: NgModel;

  @Input() activeStep!: boolean;

  timer: Subscription;
  accountSubscription: Subscription;
  fundsSubscription: Subscription;
  fundingAddressesSubscription: Subscription;

  constructor(
    private clipboard: Clipboard,
    private accountService: AccountService,
  ) {
    this.accountSubscription = accountService.account.subscribe(
      (account) => (this.account = account),
    );
    this.fundsSubscription = accountService.funds.subscribe(
      (funds) => (this.funds = funds),
    );
    this.fundingAddressesSubscription =
      accountService.fundingAddresses.subscribe(
        (fundingAddresses) => (this.fundingAddresses = fundingAddresses),
      );

    this.timer = interval(10000).subscribe(() => {
      if (
        this.activeStep &&
        (this.adaBalance < this.minAdaBalance ||
          this.fundingAddresses?.length == 0)
      ) {
        this.updateFunds();
      }
    });
  }

  niceBytes(x: number) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0,
      n = x || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
    this.accountSubscription.unsubscribe();
    this.fundsSubscription.unsubscribe();
    this.fundingAddressesSubscription.unsubscribe();
  }

  ngOnInit(): void {}

  get invalid() {
    return (
      this.adaBalanceInput?.invalid ||
      this.targetAddressInput?.invalid ||
      this.txSizeInput?.invalid
    );
  }

  updateFunds() {
    this.accountService.updateFunds();
  }

  emitUpdateMintTransaction() {
    this.updateMintTransaction.emit();
  }

  copyAddressToClipboard() {
    this.clipboard.copy(this.account!.address.address);
  }

  copyFunds() {
    this.clipboard.copy(this.minAdaBalance + '');
  }

  get adaPinFee() {
    if (!this.mintTransaction.pinFee) {
      return 0;
    }
    return this.mintTransaction.pinFee / 1000000;
  }

  get minAdaBalance() {
    let minBalance = 0;
    minBalance += this.mintTransaction.fee || 0;
    minBalance += this.mintTransaction.minOutput || 0;
    minBalance += this.mintTransaction.pinFee || 0;
    return minBalance / 1000000;
  }

  get adaBalance() {
    return (this.funds || 0) / 1000000;
  }

  get adaFee() {
    return (this.mintTransaction.fee || 0) / 1000000;
  }

  get adaMinOutput() {
    return (this.mintTransaction.minOutput || 0) / 1000000;
  }
}
