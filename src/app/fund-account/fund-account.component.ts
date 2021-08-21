import { AccountService } from './../account.service';
import { MintFormAdvancedComponent } from './../mint-form-advanced/mint-form-advanced.component';
import { MintTransaction } from './../../cardano-tools-client/model/mintTransaction';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, AfterContentChecked } from '@angular/core';
import { ControlContainer, NgForm, NgModel } from '@angular/forms';
import { interval } from 'rxjs';
import { RestInterfaceService, Account, MintOrderSubmission } from 'src/cardano-tools-client';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-fund-account',
  templateUrl: './fund-account.component.html',
  styleUrls: ['./fund-account.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class FundAccountComponent implements OnInit {

  account!: Account;

  @Input() mintTransaction!: MintTransaction;
  @Output() updateMintTransaction = new EventEmitter<void>();

  @Input() mintOrderSubmission!: MintOrderSubmission;

  @ViewChild('adaBalanceInput') adaBalanceInput!: NgModel

  @Input() activeStep!: boolean;

  @Input() loading!: boolean;

  constructor(private clipboard: Clipboard, private accountService: AccountService) {
    accountService.account.subscribe(account => this.account = account);
  }

  ngOnInit(): void {
    interval(10000).subscribe(() => {
      if (this.activeStep && (this.adaBalance < this.minAdaBalance || this.account.fundingAddresses.length == 0)) {
        this.updateAccount();
      }
    });
  }

  updateAccount() {
    this.accountService.updateAccount();
  }

  emitUpdateMintTransaction() {
    this.updateMintTransaction.emit();
  }

  copyAddressToClipboard() {
    this.clipboard.copy(this.account.address);
  }

  copyFunds() {
    this.clipboard.copy(this.minAdaBalance + "");
  }

  get adaTip() {
    if (!this.mintTransaction.mintOrderSubmission.tip) {
      return 0;
    }
    let change = (this.account.balance || 0) - (this.mintTransaction.fee || 0) - this.mintTransaction.minOutput
    return (Math.max(change, 1000000)) / 1000000;
  }

  get minAdaBalance() {
    let minBalance = 0;
    minBalance += (this.mintTransaction.fee || 0)
    minBalance += this.mintTransaction.minOutput

    if (this.mintTransaction.mintOrderSubmission.tip)
      minBalance += 1000000

    return minBalance / 1000000;
  }

  get adaBalance() {
    return ((this.account.balance || 0)) / 1000000;
  }

  get adaFee() {
    return ((this.mintTransaction.fee || 0)) / 1000000;
  }

  get adaMinOutput() {
    return ((this.mintTransaction.minOutput || 0)) / 1000000;
  }

}
