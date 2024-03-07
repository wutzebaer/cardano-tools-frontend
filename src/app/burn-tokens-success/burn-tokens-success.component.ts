import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-burn-tokens-success',
  templateUrl: './burn-tokens-success.component.html',
  styleUrls: ['./burn-tokens-success.component.scss'],
})
export class BurnTokensSuccessComponent {
  txId: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { txId: string }) {
    this.txId = data.txId;
  }

  ngOnInit(): void {}
}
