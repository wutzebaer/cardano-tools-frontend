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
  loading: boolean = true
  tableData: TableRow[]
  tokenRegistryMetadataFormatted: string | undefined

  previewUrl = ""
  previewType = ""

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
    if (this.token.tokenRegistryMetadata) {
      this.tokenRegistryMetadataFormatted = JSON.stringify(this.token.tokenRegistryMetadata, null, 2)
    }
    if (this.token.mediaTypes.length) {
      this.previewType = this.token.mediaTypes[0]
      this.previewUrl = this.token.mediaUrls[0]
    } else {
      this.previewType = ""
      this.previewUrl = ""
    }
  }

  displayedColumns = ['name', 'value']


  onLoad() {
    this.loading = false;
  }

  close() {
    this.dialogRef.closeAll()
  }

  copyToClipboard(value: string) {
    this.clipboard.copy(value);
  }

}
