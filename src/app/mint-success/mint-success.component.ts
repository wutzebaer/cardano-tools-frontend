import { Subscription } from 'rxjs';
import { Transaction } from './../../cardano-tools-client/model/transaction';
import { AccountService } from './../account.service';
import { AccountKeyComponent } from './../account-key/account-key.component';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountPrivate } from 'src/cardano-tools-client';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-mint-success',
  templateUrl: './mint-success.component.html',
  styleUrls: ['./mint-success.component.scss']
})
export class MintSuccessComponent implements OnInit, OnDestroy {

  account?: AccountPrivate;
  @Input() mintTransaction!: Transaction;
  @Output() updateMintTransaction = new EventEmitter<void>();
  @Output() restart = new EventEmitter<void>();
  accountSubscription: Subscription

  constructor(public dialog: MatDialog, private clipboard: Clipboard, accountService: AccountService) {
    this.accountSubscription = accountService.account.subscribe(account => this.account = account);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }

  accountKeyPopup() {
    this.dialog.open(AccountKeyComponent, {
      data: { account: this.account },
    });
  }

  copyAccountKey() {
    this.clipboard.copy(this.account!.key);
  }

  get adaTip() {
    let change = (this.account?.address.balance || 0) - (this.mintTransaction.fee || 0) - (this.mintTransaction.minOutput || 0) - (this.mintTransaction.pinFee || 0)
    return (Math.max(change, 0)) / 1000000;
  }

  get adaChange() {
    let change = (this.account?.address.balance || 0) - (this.mintTransaction.fee || 0) - (this.mintTransaction.pinFee || 0)
    return (Math.max(change, 0)) / 1000000;
  }

  restartMinting() {
    this.restart.emit();
  }

}
