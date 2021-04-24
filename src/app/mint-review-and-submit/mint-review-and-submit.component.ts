import { ControlContainer, NgForm } from '@angular/forms';
import { MintOrderSubmission } from './../../cardano-tools-client/model/mintOrderSubmission';
import { TransferAccount } from './../../cardano-tools-client/model/transferAccount';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mint-review-and-submit',
  templateUrl: './mint-review-and-submit.component.html',
  styleUrls: ['./mint-review-and-submit.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MintReviewAndSubmitComponent implements OnInit {

  @Input() fee!: number | null;
  @Input() account!: TransferAccount | null;
  @Input() mintOrderSubmission!: MintOrderSubmission;

  selectedAddress: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  get adaChange() {
    return ((this.account?.balance || 0) - (this.fee || 0) - 1000000) / 1000000;
  }

  get adaFee() {
    return ((this.fee || 0)) / 1000000;
  }

  get minAdaBalance() {
    return ((this.fee || 0)) / 1000000 + 1;
  }

  get adaBalance() {
    return ((this.account?.balance || 0)) / 1000000;
  }

}
