import { Transaction } from './../../cardano-tools-client/model/transaction';
import { AccountService } from './../account.service';
import { MintOrderSubmission } from 'src/cardano-tools-client/model/mintOrderSubmission';
import { ControlContainer, NgForm, NgModel } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { Account, RestInterfaceService } from 'src/cardano-tools-client';

@Component({
  selector: 'app-mint-review-and-submit',
  templateUrl: './mint-review-and-submit.component.html',
  styleUrls: ['./mint-review-and-submit.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MintReviewAndSubmitComponent implements OnInit {

  account!: Account;
  @Input() mintTransaction!: Transaction;
  @Output() updateMintTransaction = new EventEmitter<void>();
  @Output() mintSuccess = new EventEmitter<void>();

  @ViewChild('submittedInput') submittedInput!: NgModel

  submitted = false;

  constructor(private api: RestInterfaceService, accountService: AccountService) {
    accountService.account.subscribe(account => this.account = account);
  }

  ngOnInit(): void {
  }

  get adaTip() {
    let change = (this.account.address.balance || 0) - (this.mintTransaction.fee || 0) - (this.mintTransaction.minOutput as number)
    return (Math.max(change, 0)) / 1000000;
  }

  get adaChange() {
    let change = (this.account.address.balance || 0) - (this.mintTransaction.fee || 0)
    return (Math.max(change, 0)) / 1000000;
  }

  mint() {
    this.api.submitMintTransaction(this.mintTransaction, this.account.key).subscribe({
      error: error => {
        this.updateMintTransaction.emit();
      },
      complete: () => {
        this.submitted = true
        setTimeout(() => { this.mintSuccess.emit() });
      }
    });
  }

}
