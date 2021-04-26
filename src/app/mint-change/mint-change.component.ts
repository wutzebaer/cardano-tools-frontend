import { MintOrderSubmission } from 'src/cardano-tools-client/model/mintOrderSubmission';
import { MintTransaction } from './../../cardano-tools-client/model/mintTransaction';
import { ControlContainer, NgForm } from '@angular/forms';
import { RestInterfaceService, TransferAccount } from 'src/cardano-tools-client';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mint-change',
  templateUrl: './mint-change.component.html',
  styleUrls: ['./mint-change.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MintChangeComponent implements OnInit {

  @Input() account!: TransferAccount;
  @Output() updateAccount = new EventEmitter<void>();

  @Input() mintTransaction!: MintTransaction;
  @Output() updateMintTransaction = new EventEmitter<void>();

  @Input() mintOrderSubmission!: MintOrderSubmission;

  selectedAddress: string = "";

  constructor(private api: RestInterfaceService) { }

  ngOnInit(): void {
  }

  updateChangeActionFee() {
    this.updateMintTransaction.emit();
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

}
