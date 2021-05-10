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

    this.tableData = [];
    for (let key in this.token.metaData) {
      let value = this.token.metaData[key]
      if (!value.toFixed && !value.substring) {
        this.tableData.push({ name: key, value: JSON.stringify(value, null, 2) })
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

  calculateTime(epochNo: number, epochSlotNo: number) {
    let timestamp = Date.parse('2017-09-23T21:44:51Z');
    timestamp += epochNo * 432000 * 1000
    timestamp += epochSlotNo * 1000
    return timestamp;
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
