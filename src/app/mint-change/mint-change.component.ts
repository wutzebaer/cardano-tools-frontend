import { ControlContainer, NgForm } from '@angular/forms';
import { MintOrderSubmission } from 'src/cardano-tools-client/model/mintOrderSubmission';
import { TransferAccount } from 'src/cardano-tools-client';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mint-change',
  templateUrl: './mint-change.component.html',
  styleUrls: ['./mint-change.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MintChangeComponent implements OnInit {

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
