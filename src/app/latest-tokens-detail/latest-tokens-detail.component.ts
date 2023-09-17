import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableRow } from '../mint-token-mini/mint-token-mini.component';
import { TokenDataWithMetadata } from '../token-enhancer.service';
import { TokenListItem } from 'src/dbsync-client';

@Component({
  selector: 'app-latest-tokens-detail',
  templateUrl: './latest-tokens-detail.component.html',
  styleUrls: ['./latest-tokens-detail.component.scss']
})
export class LatestTokensDetailComponent implements OnInit {

  tokenListItem!: TokenListItem;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { tokenListItem: TokenListItem }, private clipboard: Clipboard, private dialogRef: MatDialog) {
    this.tokenListItem = data.tokenListItem;
  }

  ngOnInit(): void {
  }

}
