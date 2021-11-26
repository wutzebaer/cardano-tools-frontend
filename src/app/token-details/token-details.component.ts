import { Clipboard } from '@angular/cdk/clipboard';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableRow } from '../mint-token-mini/mint-token-mini.component';
import { TokenDataWithMetadata } from '../token-enhancer.service';

@Component({
  selector: 'app-token-details',
  templateUrl: './token-details.component.html',
  styleUrls: ['./token-details.component.scss']
})
export class TokenDetailsComponent implements OnInit {

  @Input() tokens!: TokenDataWithMetadata[]
  @Input() tokenIndex!: number
  @Input() token!: TokenDataWithMetadata
  loading: boolean = true
  tableData!: TableRow[]
  tokenRegistryMetadataFormatted: string | undefined
  previewUrl = ""
  previewType = ""

  displayedColumns = ['name', 'value']

  constructor(private clipboard: Clipboard, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    if (this.token) {
      this.tokens = [this.token]
      this.tokenIndex = 0
    }
    this.token = this.tokens[this.tokenIndex];
    this.refreshData();
  }

  private refreshData() {
    this.tableData = [];
    for (let key in this.token.metaData) {
      let value = this.token.metaData[key];
      if (!value.toFixed && !value.substring) {
        this.tableData.push({ name: key, value: JSON.stringify(value, null, 2) });
      } else {
        this.tableData.push({ name: key, value: value });
      }
    }

    if (this.token.tokenRegistryMetadata) {
      this.tokenRegistryMetadataFormatted = JSON.stringify(this.token.tokenRegistryMetadata, null, 2);
    }
    if (this.token.mediaTypes.length) {
      this.previewType = this.token.mediaTypes[0];
      this.previewUrl = this.token.mediaUrls[0];
    } else {
      this.previewType = "";
      this.previewUrl = "";
    }
    this.loading = true;
  }

  onLoad() {
    this.loading = false;
  }


  copyToClipboard(value: string) {
    this.clipboard.copy(value);
    let snackBarRef = this.snackBar.open('Copied to clipboard: ' + value, undefined, { duration: 2000 });
  }

  copyMetadataToClipboard() {
    this.clipboard.copy('"' + this.token.name + '": ' + JSON.stringify(JSON.parse(this.token.json), null, 3) + ',');
  }

  @HostListener('document:keydown.ArrowLeft')
  prev() {
    this.switch(-1)
  }

  @HostListener('document:keydown.ArrowRight')
  next() {
    this.switch(1)
  }

  switch(step: number) {
    const newIndex = this.tokenIndex + step;
    if (newIndex >= 0 && newIndex < this.tokens.length) {
      this.tokenIndex = newIndex
      this.token = this.tokens[newIndex]
      this.refreshData();
    }
  }

}
