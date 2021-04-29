import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransferAccount } from 'src/cardano-tools-client';
import { MintTransaction } from './../../cardano-tools-client/model/mintTransaction';

@Component({
  selector: 'app-mint-success',
  templateUrl: './mint-success.component.html',
  styleUrls: ['./mint-success.component.scss']
})
export class MintSuccessComponent implements OnInit {

  @Input() account!: TransferAccount;
  @Input() mintTransaction!: MintTransaction;
  @Output() updateMintTransaction = new EventEmitter<void>();
  @Output() restart = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
    console.log(this.mintTransaction)
  }

  get adaTip() {
    let change = (this.account.balance || 0) - (this.mintTransaction.fee || 0) - this.mintTransaction.minOutput
    return (Math.max(change, 0)) / 1000000;
  }

  get adaChange() {
    let change = (this.account.balance || 0) - (this.mintTransaction.fee || 0)
    return (Math.max(change, 0)) / 1000000;
  }

  restartMinting() {
    this.restart.emit();
  }

}