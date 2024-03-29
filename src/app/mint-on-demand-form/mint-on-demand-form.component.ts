import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  AccountPrivate,
  Drop,
  DropNftTransient,
  DropRestInterfaceService,
  DropTransient,
} from 'src/cardano-tools-client';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mint-on-demand-form',
  templateUrl: './mint-on-demand-form.component.html',
  styleUrls: ['./mint-on-demand-form.component.scss'],
})
export class MintOnDemandFormComponent implements OnInit {
  @Input() drop!: DropTransient | Drop;
  @Input() policyId = '';
  @Input() account?: AccountPrivate;

  @Output() dropChanged = new EventEmitter<void>();

  @ViewChild('nftForm') nftForm!: NgForm;

  parseError = '';
  nftsString!: string;
  whitelistString: string = '';

  constructor(
    private dropRestInterfaceService: DropRestInterfaceService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) {}

  get priceAda() {
    return this.drop.price / 1_000_000;
  }
  set priceAda(price) {
    this.drop.price = price * 1_000_000;
  }

  ngOnInit(): void {
    this.dropNftsToNftsString();
    this.whitelistString = [...this.drop.whitelist].join('\n');
  }

  isPersited() {
    return 'id' in this.drop;
  }

  formatWhitelist() {
    this.whitelistString = this.whitelistString
      .replace(/[\s]+/g, '\n')
      .replace(/[\s]+$/, '')
      .trim();
    this.drop.whitelist = this.whitelistString.split(/[\s]+/);
  }

  dropNftsToNftsString() {
    console.log('serializeMetaData');
    let embeddedMetadata: any[] = [];
    this.drop.dropNfts.forEach((dropNft) => {
      embeddedMetadata.push({
        assetName: dropNft.assetName,
        metadata: JSON.parse(dropNft.metadata),
      });
    });
    this.nftsString = JSON.stringify(embeddedMetadata, null, 3);
    console.log('serializeMetaData end');
  }

  nftsStringToDropNfts() {
    console.log('deserializeMetaData');
    try {
      let parsed: DropNftTransient[] = JSON.parse(this.nftsString);
      parsed.forEach((dropNft) => {
        this.checkStringLengthRecursive(parsed.map((p) => dropNft.metadata));
        dropNft.metadata = JSON.stringify(dropNft.metadata, null, 3);
      });

      this.checkIfDuplicateExists(parsed.map((p) => p.assetName));

      this.drop.dropNfts = parsed;
      this.parseError = '';
    } catch (error) {
      this.parseError = error as string;
    }
    console.log('deserializeMetaData end');
  }

  checkIfDuplicateExists(array: string[]) {
    let usedNames: string[] = [];
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (usedNames.indexOf(element) !== -1) {
        throw new Error('Duplicate AssetName: ' + element);
      }
      usedNames.push(element);
    }
  }

  checkStringLengthRecursive(object: any) {
    if (Array.isArray(object)) {
      for (const element of object) {
        this.checkStringLengthRecursive(element);
      }
    } else {
      for (const key in object) {
        const element = object[key];
        if (typeof element === 'string') {
          if (element.length > 64) {
            throw new Error('String longer than 64: ' + element);
          }
        } else if (typeof element === 'object') {
          this.checkStringLengthRecursive(element);
        }
      }
    }
  }

  utf8ByteCount(str: string) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      const codePoint = str.codePointAt(i);
      if (codePoint == null) {
        throw new Error('String illegal: ' + str);
      }
      if (codePoint <= 0x7f) {
        count += 1;
      } else if (codePoint <= 0x7ff) {
        count += 2;
      } else if (codePoint <= 0xffff) {
        count += 3;
      } else if (codePoint <= 0x10ffff) {
        count += 4;
        i++; // Surrogate pair, skip the next unit.
      }
    }
    return count;
  }

  getAddress() {
    return (this.drop as Drop).address.address;
  }

  getPrettyUrl() {
    return (this.drop as Drop).prettyUrl;
  }

  getApiUrl() {
    return location.origin + '/api/drop/' + this.drop.prettyUrl;
  }

  getPageUrl() {
    return location.origin + '/drop/' + this.drop.prettyUrl;
  }

  upload() {
    if (!this.nftForm.form.valid) {
      return;
    }
    if (this.isPersited()) {
      let persistedDrop = this.drop as Drop;
      persistedDrop.prettyUrl =
        persistedDrop.name.toLowerCase().replace(/[^a-z\\s0-9]/g, '-') +
        '-' +
        persistedDrop.id;
      this.dropRestInterfaceService
        .updateDrop(
          this.drop,
          this.account!.key,
          this.policyId,
          persistedDrop.id
        )
        .subscribe(() => {});
    } else {
      this.dropRestInterfaceService
        .createDrop(this.drop, this.account!.key, this.policyId)
        .subscribe(() => {
          delete history.state.mintMetadata;
          this.dropChanged.next();
        });
    }
  }

  start() {
    this.drop.running = true;
    this.upload();
  }

  stop() {
    this.drop.running = false;
    this.upload();
  }

  copyToClipboard(value: string) {
    this.clipboard.copy(value);
    let snackBarRef = this.snackBar.open(
      'Copied to clipboard: ' + value,
      undefined,
      { duration: 2000 }
    );
  }
}
