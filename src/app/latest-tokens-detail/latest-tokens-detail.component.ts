import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TokenDataWithMetadata } from '../latest-tokens/latest-tokens.component';
import { TableRow } from '../mint-token-mini/mint-token-mini.component';

@Component({
  selector: 'app-latest-tokens-detail',
  templateUrl: './latest-tokens-detail.component.html',
  styleUrls: ['./latest-tokens-detail.component.scss']
})
export class LatestTokensDetailComponent implements OnInit {

  token: TokenDataWithMetadata
  loading: boolean = true
  tableData: TableRow[]

  constructor(@Inject(MAT_DIALOG_DATA) public data: { token: TokenDataWithMetadata }, private clipboard: Clipboard, private dialogRef: MatDialog) {
    this.token = data.token

    this.tableData = [
      { name: 'PolicyId', value: this.token.policyId },
    ];
    for (let key in this.token.metaData) {
      let value = this.token.metaData[key]
      if (!value.toFixed && !value.substring) {
        this.tableData.push({ name: key, value: JSON.stringify(value) })
      } else {
        this.tableData.push({ name: key, value: value })
      }
    }
  }

  ngOnInit(): void {
  }

  displayedColumns = ['name', 'value']

  toIpfsUrl(ipfs: any) {
    // https://ipfs.io/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt
    // https://ipfs.blockfrost.dev/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt
    // https://cloudflare-ipfs.com/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt
    // https://ipfs.eternum.io/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt
    return "https://ipfs.cardano-tools.io/ipfs/" + ipfs.replace("ipfs://ipfs/", "").replace("ipfs://", "");
  }

  onLoad() {
    this.loading = false;
  }

  close() { 
    this.dialogRef.closeAll()
  }

  copyToClipboard(value: string) {
    console.log(value)
    this.clipboard.copy(value);
  }

}
