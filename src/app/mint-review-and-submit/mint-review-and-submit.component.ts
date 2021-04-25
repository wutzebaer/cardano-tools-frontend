import { ControlContainer, NgForm } from '@angular/forms';
import { MintOrderSubmission } from './../../cardano-tools-client/model/mintOrderSubmission';
import { TransferAccount } from './../../cardano-tools-client/model/transferAccount';
import { Component, OnInit, Input } from '@angular/core';
import { RestInterfaceService } from 'src/cardano-tools-client';

@Component({
  selector: 'app-mint-review-and-submit',
  templateUrl: './mint-review-and-submit.component.html',
  styleUrls: ['./mint-review-and-submit.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MintReviewAndSubmitComponent implements OnInit {

  @Input() account!: TransferAccount;
  @Input() mintOrderSubmission!: MintOrderSubmission;

  selectedAddress: string = "";

  constructor(private api: RestInterfaceService) { }

  ngOnInit(): void {
  }

  get adaChange() {
    return ((this.account.balance || 0) - (this.mintOrderSubmission.fee || 0) - 1000000) / 1000000;
  }

  get adaFee() {
    return ((this.mintOrderSubmission.fee || 0)) / 1000000;
  }

  get minAdaBalance() {
    return ((this.mintOrderSubmission.fee || 0)) / 1000000 + 1;
  }

  get adaBalance() {
    return ((this.account.balance || 0)) / 1000000;
  }

  mint() {
    this.api.postMintCoinOrder(this.mintOrderSubmission, this.account.key).subscribe();
  }

}
