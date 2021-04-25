import { ControlContainer, NgForm } from '@angular/forms';
import { MintOrderSubmission } from 'src/cardano-tools-client/model/mintOrderSubmission';
import { RestInterfaceService, TransferAccount } from 'src/cardano-tools-client';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mint-change',
  templateUrl: './mint-change.component.html',
  styleUrls: ['./mint-change.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MintChangeComponent implements OnInit {

  @Input() account!: TransferAccount;
  @Input() mintOrderSubmission!: MintOrderSubmission;

  selectedAddress: string = "";

  constructor(private api: RestInterfaceService) { }

  ngOnInit(): void {
  }

  updateChangeActionFee() {
    this.api.calculateFee(this.mintOrderSubmission, this.account.key).subscribe(fee => {
      this.mintOrderSubmission.fee = fee
    })
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

}
