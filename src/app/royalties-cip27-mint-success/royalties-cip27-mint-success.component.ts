import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Transaction } from 'src/cardano-tools-client';

@Component({
  selector: 'app-royalties-cip27-mint-success',
  templateUrl: './royalties-cip27-mint-success.component.html',
  styleUrls: ['./royalties-cip27-mint-success.component.scss'],
})
export class RoyaltiesCip27MintSuccessComponent implements OnInit {
  txId: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { txId: string }) {
    this.txId = data.txId;
  }

  ngOnInit(): void {}
}
