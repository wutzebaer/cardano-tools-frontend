import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mint-success-popup',
  templateUrl: './mint-success-popup.component.html',
  styleUrls: ['./mint-success-popup.component.scss'],
})
export class MintSuccessPopupComponent {
  txHash: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { txHash: string }) {
    this.txHash = data.txHash;
  }
}
