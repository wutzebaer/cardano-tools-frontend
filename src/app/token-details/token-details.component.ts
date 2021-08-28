import { TokenOffer } from './../../cardano-tools-client/model/tokenOffer';
import { RestInterfaceService, Account } from 'src/cardano-tools-client';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableRow } from '../mint-token-mini/mint-token-mini.component';
import { TokenDataWithMetadata } from '../token-enhancer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-token-details',
  templateUrl: './token-details.component.html',
  styleUrls: ['./token-details.component.scss']
})
export class TokenDetailsComponent implements OnInit {

  @Input() token!: TokenDataWithMetadata
  loading: boolean = true
  tableData!: TableRow[]
  tokenRegistryMetadataFormatted: string | undefined
  previewUrl = ""
  previewType = ""

  constructor(private clipboard: Clipboard, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.tableData = [];
    for (let key in this.token.metaData) {
      let value = this.token.metaData[key]
      if (!value.toFixed && !value.substring) {
        this.tableData.push({ name: key, value: JSON.stringify(value, null, 2) })
      } else {
        this.tableData.push({ name: key, value: value })
      }
    }

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


  copyToClipboard(value: string) {
    this.clipboard.copy(value);
    let snackBarRef = this.snackBar.open('Copied to clipboard: ' + value);
  }

  copyMetadataToClipboard() {
    this.clipboard.copy('"' + this.token.name + '": ' + JSON.stringify(JSON.parse(this.token.json), null, 3) + ',');
  }
}
