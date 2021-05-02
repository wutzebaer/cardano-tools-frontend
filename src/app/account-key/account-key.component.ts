import { TransferAccount } from './../../cardano-tools-client/model/transferAccount';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-account-key',
  templateUrl: './account-key.component.html',
  styleUrls: ['./account-key.component.scss']
})
export class AccountKeyComponent implements OnInit {

  account!: TransferAccount;

  constructor(private clipboard: Clipboard, @Inject(MAT_DIALOG_DATA) public data: { account: TransferAccount }) {
    this.account = data.account;
  }

  ngOnInit(): void {
  }

  copyAccountKey() {
    this.clipboard.copy(this.account.key);
  }

}
