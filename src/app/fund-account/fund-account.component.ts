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

  minOutput = 2000000

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
    let change = (this.account.balance || 0) - (this.mintTransaction.fee || 0) - this.minOutput
    return (Math.max(change, 0)) / 1000000;
  }

  get minAdaBalance() {
    let minBalance = 0;
    minBalance += (this.mintTransaction.fee || 0)
    minBalance += this.minOutput

    if (this.mintTransaction.mintOrderSubmission.changeAction != 'RETURN')
      minBalance += 1000000

    return minBalance / 1000000;
  }

  get adaBalance() {
    return ((this.account.balance || 0)) / 1000000;
  }



}
