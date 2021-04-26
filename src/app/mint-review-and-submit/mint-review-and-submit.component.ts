import { MintOrderSubmission } from 'src/cardano-tools-client/model/mintOrderSubmission';
import { MintTransaction } from './../../cardano-tools-client/model/mintTransaction';
import { ControlContainer, NgForm } from '@angular/forms';
import { TransferAccount } from './../../cardano-tools-client/model/transferAccount';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestInterfaceService } from 'src/cardano-tools-client';

@Component({
  selector: 'app-mint-review-and-submit',
  templateUrl: './mint-review-and-submit.component.html',
  styleUrls: ['./mint-review-and-submit.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MintReviewAndSubmitComponent implements OnInit {

  @Input() account!: TransferAccount;
  @Input() mintTransaction!: MintTransaction;
  @Output() updateMintTransaction = new EventEmitter<void>();

  selectedAddress: string = "";

  constructor(private api: RestInterfaceService) { }

  ngOnInit(): void {
  }

  get adaChange() {
    return ((this.account.balance || 0) - (this.mintTransaction.fee || 0) - 1000000) / 1000000;
  }

  get adaFee() {
    return ((this.mintTransaction.fee || 0)) / 1000000;
  }

  get minAdaBalance() {
    return ((this.mintTransaction.fee || 0)) / 1000000 + 1;
  }

  get adaBalance() {
    return ((this.account.balance || 0)) / 1000000;
  }

  mint() {
    this.api.submitMintTransaction(this.mintTransaction, this.account.key).subscribe({
      error: error => {
        this.updateMintTransaction.emit();
      },
      complete: () => {
        alert("success");
      }
    });
  }

}
