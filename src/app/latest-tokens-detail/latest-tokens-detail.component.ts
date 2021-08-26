import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableRow } from '../mint-token-mini/mint-token-mini.component';
import { TokenDataWithMetadata } from '../token-enhancer.service';

@Component({
  selector: 'app-latest-tokens-detail',
  templateUrl: './latest-tokens-detail.component.html',
  styleUrls: ['./latest-tokens-detail.component.scss']
})
export class LatestTokensDetailComponent implements OnInit {

  token: TokenDataWithMetadata

  constructor(@Inject(MAT_DIALOG_DATA) public data: { token: TokenDataWithMetadata }, private clipboard: Clipboard, private dialogRef: MatDialog) {
    this.token = data.token
  }

  ngOnInit(): void {
  }

}
