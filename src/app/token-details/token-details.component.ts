import { Clipboard } from '@angular/cdk/clipboard';
import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { RestHandlerService, TokenListItem } from 'src/dbsync-client';
import { TableRow } from '../mint-token-mini/mint-token-mini.component';
import {
  TokenDataWithMetadata,
  TokenEnhancerService,
} from '../token-enhancer.service';

@Component({
  selector: 'app-token-details',
  templateUrl: './token-details.component.html',
  styleUrls: ['./token-details.component.scss'],
})
export class TokenDetailsComponent implements OnInit {
  @Input() tokenListItem!: TokenListItem;
  tokenDataWithMetadata?: TokenDataWithMetadata;

  tableData: TableRow[] = [];
  tokenRegistryMetadataFormatted: string | undefined;
  displayedColumns = ['name', 'value'];
  previewUrl = '';
  previewType = '';

  constructor(
    private tokenEnhancerService: TokenEnhancerService,
    private api: RestHandlerService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.api
      .getTokenDetails(this.tokenListItem.maPolicyId, this.tokenListItem.maName)
      .subscribe((details) => {
        this.tokenDataWithMetadata =
          this.tokenEnhancerService.enhanceToken(details);

        for (let key in this.tokenDataWithMetadata.metaDataObject) {
          let value = this.tokenDataWithMetadata.metaDataObject[key];
          if (!value.toFixed && !value.substring) {
            this.tableData.push({
              name: key,
              value: JSON.stringify(value, null, 2),
            });
          } else {
            this.tableData.push({ name: key, value: value });
          }
        }
        // if (this.token.tokenRegistryMetadata) {
        //   this.tokenRegistryMetadataFormatted = JSON.stringify(this.token.tokenRegistryMetadata, null, 2);
        // }
        if (this.tokenDataWithMetadata.mediaTypes.length) {
          this.previewType = this.tokenDataWithMetadata.mediaTypes[0];
          this.previewUrl = this.tokenDataWithMetadata.mediaUrls[0];
        } else {
          this.previewType = '';
          this.previewUrl = '';
        }
      });
  }

  buildShareUrl() {
    return (
      window.location.origin +
      this.location.prepareExternalUrl(
        'latest?q=' + this.tokenDataWithMetadata?.fingerprint,
      )
    );
  }

  buildPoolpmUrl() {
    return 'https://pool.pm/' + this.tokenDataWithMetadata?.fingerprint;
  }

  copyToClipboard(value: string) {
    this.clipboard.copy(value);
    this.snackBar.open('Copied to clipboard: ' + value, undefined, {
      duration: 2000,
    });
  }

  copyMetadataToClipboard() {
    this.clipboard.copy(
      '"' +
        this.tokenDataWithMetadata!.maName +
        '": ' +
        JSON.stringify(
          JSON.parse(this.tokenDataWithMetadata!.metadata!),
          null,
          3,
        ) +
        ',',
    );
  }
}
