import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { AccountPrivate } from 'src/cardano-tools-client';

@Component({
  selector: 'app-account-key',
  templateUrl: './account-key.component.html',
  styleUrls: ['./account-key.component.scss'],
})
export class AccountKeyComponent implements OnInit {
  account!: AccountPrivate;

  constructor(
    private clipboard: Clipboard,
    @Inject(MAT_DIALOG_DATA) public data: { account: AccountPrivate },
  ) {
    this.account = data.account;
  }

  ngOnInit(): void {}

  copyAccountKey() {
    this.clipboard.copy(this.account.key);
  }
}
