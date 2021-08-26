import { TokenOffer } from './../../cardano-tools-client/model/tokenOffer';
import { RestInterfaceService, Account } from 'src/cardano-tools-client';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableRow } from '../mint-token-mini/mint-token-mini.component';
import { TokenDataWithMetadata } from '../token-enhancer.service';

@Component({
  selector: 'app-exchange-sell-form',
  templateUrl: './exchange-sell-form.component.html',
  styleUrls: ['./exchange-sell-form.component.scss']
})
export class ExchangeSellFormComponent implements OnInit {

  @ViewChild('sellForm') sellForm!: FormGroupDirective;

  token: TokenDataWithMetadata
  tokenOffer: TokenOffer;
  account: Account;
  price: number = 1

  constructor(@Inject(MAT_DIALOG_DATA) public data: { token: TokenDataWithMetadata, account: Account, tokenOffer: TokenOffer }, private clipboard: Clipboard, private dialogRef: MatDialogRef<ExchangeSellFormComponent>, private api: RestInterfaceService) {
    this.token = data.token
    this.account = data.account
    this.tokenOffer = data.tokenOffer;
    if (this.tokenOffer) {
      this.price = this.tokenOffer.price / 1000000;
    }
  }

  ngOnInit(): void {
  }

  sell() {
    this.api.postOfferToken({
      policyId: this.token.policyId,
      assetName: this.token.name,
      price: this.price * 1000000
    }, this.account.key).subscribe(() => {
      this.dialogRef.close(true);
    });

  }

}
