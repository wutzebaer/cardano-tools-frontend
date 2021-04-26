import { MintOrderSubmission } from 'src/cardano-tools-client/model/mintOrderSubmission';
import { MintTransaction } from './../../cardano-tools-client/model/mintTransaction';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { interval } from 'rxjs';
import { RestInterfaceService, TransferAccount } from 'src/cardano-tools-client';



@Component({
  selector: 'app-fund-account',
  templateUrl: './fund-account.component.html',
  styleUrls: ['./fund-account.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class FundAccountComponent implements OnInit {

  @Input() account!: TransferAccount;
  @Output() updateAccount = new EventEmitter<void>();

  @Input() mintTransaction!: MintTransaction;
  @Output() updateMintTransaction = new EventEmitter<void>();

  @Input() mintOrderSubmission!: MintOrderSubmission;

  constructor(private api: RestInterfaceService) { }

  ngOnInit(): void {
    interval(10000).subscribe(() => {
      if (this.adaBalance < this.minAdaBalance)
        this.emitUpdateAccount();
    });
  }

  emitUpdateAccount() {
    this.updateAccount.emit();
  }

  emitUpdateMintTransaction() {
    this.updateMintTransaction.emit();
  }

  get adaChange() {
    return (Math.max((this.account.balance || 0) - (this.mintTransaction.fee || 0) - 1000000, 0)) / 1000000;
  }

  get minAdaBalance() {
    if (this.mintOrderSubmission.changeAction == 'RETURN')
      return ((this.mintTransaction.fee || 0)) / 1000000 + 1;
    else
      return ((this.mintTransaction.fee || 0)) / 1000000 + 2;
  }

  get adaBalance() {
    return ((this.account.balance || 0)) / 1000000;
  }



}
