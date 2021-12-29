import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ControlContainer, NgForm, NgModel } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { AccountPrivate, MintOrderSubmission } from 'src/cardano-tools-client';
import { Transaction } from './../../cardano-tools-client/model/transaction';
import { AccountService } from './../account.service';



@Component({
  selector: 'app-fund-account',
  templateUrl: './fund-account.component.html',
  styleUrls: ['./fund-account.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class FundAccountComponent implements OnInit, OnDestroy {

  account?: AccountPrivate;

  @Input() mintTransaction!: Transaction;
  @Output() updateMintTransaction = new EventEmitter<void>();

  @Input() mintOrderSubmission!: MintOrderSubmission;

  @ViewChild('adaBalanceInput') adaBalanceInput!: NgModel
  @ViewChild('targetAddressInput') targetAddressInput!: NgModel
  @ViewChild('txSizeInput') txSizeInput!: NgModel

  @Input() activeStep!: boolean;

  timer: Subscription;
  accountSubscription: Subscription

  constructor(private clipboard: Clipboard, private accountService: AccountService) {
    this.accountSubscription = accountService.account.subscribe(account => this.account = account);
    this.timer = interval(10000).subscribe(() => {
      if (this.activeStep && (this.adaBalance < this.minAdaBalance || this.account?.fundingAddresses.length == 0)) {
        this.updateAccount();
      }
    });
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
    this.accountSubscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  get invalid(){
    return this.adaBalanceInput?.invalid || this.targetAddressInput?.invalid || this.txSizeInput?.invalid
  }

  updateAccount() {
    this.accountService.updateAccount();
  }

  emitUpdateMintTransaction() {
    this.updateMintTransaction.emit();
  }

  copyAddressToClipboard() {
    this.clipboard.copy(this.account!.address.address);
  }

  copyFunds() {
    this.clipboard.copy(this.minAdaBalance + "");
  }

  get adaTip() {
    if (!this.mintTransaction.mintOrderSubmission?.tip) {
      return 0;
    }
    let change = (this.account?.address.balance || 0) - (this.mintTransaction.fee || 0) - (this.mintTransaction.minOutput as number)
    return (Math.max(change, 1000000)) / 1000000;
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
    return ((this.account?.address.balance || 0)) / 1000000;
  }

  get adaFee() {
    return ((this.mintTransaction.fee || 0)) / 1000000;
  }

  get adaMinOutput() {
    return ((this.mintTransaction.minOutput || 0)) / 1000000;
  }

}
