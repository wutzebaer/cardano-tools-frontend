import { MintOrderSubmission } from 'src/cardano-tools-client/model/mintOrderSubmission';
import { MintTransaction } from './../../cardano-tools-client/model/mintTransaction';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
        this.refresh();
    });
  }

  get minAdaBalance() {
    return ((this.mintTransaction.fee || 0)) / 1000000 + 1;
  }

  get minAdaTipBalance() {
    return ((this.mintTransaction.fee || 0)) / 1000000 + 2;
  }

  get adaBalance() {
    return ((this.account.balance || 0)) / 1000000;
  }

  refresh() {
   this.updateAccount.emit();
  }

}
