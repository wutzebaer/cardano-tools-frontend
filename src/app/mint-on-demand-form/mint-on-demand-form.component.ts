import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountPrivate, Drop, DropNftTransient, DropRestInterfaceService, DropTransient } from 'src/cardano-tools-client';

@Component({
  selector: 'app-mint-on-demand-form',
  templateUrl: './mint-on-demand-form.component.html',
  styleUrls: ['./mint-on-demand-form.component.scss']
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
  ) {
  }

  get priceAda() {
    return this.drop.price / 1_000_000;
  }
  set priceAda(price) {
    this.drop.price = price * 1_000_000;
  }

  ngOnInit(): void {
    this.serializeMetaData();
    this.whitelistString = this.drop.whitelist.join('\n')
  }

  isPersited() {
    return 'id' in this.drop;
  }


  formatWhitelist() {
    this.whitelistString = this.whitelistString.replace(/[\s]+/g, '\n').replace(/[\s]+$/, '').trim();
    this.drop.whitelist = this.whitelistString.split(/[\s]+/);
  }

  serializeMetaData() {
    let embeddedMetadata: any[] = [];
    this.drop.dropNfts.forEach(dropNft => {
      embeddedMetadata.push({
        assetName: dropNft.assetName,
        metadata: JSON.parse(dropNft.metadata)
      });
    });
    this.nftsString = JSON.stringify(embeddedMetadata, null, 3);
  }

  checkIfDuplicateExists(arr: any[]) {
    return new Set(arr).size !== arr.length
  }

  deserializeMetaData() {
    try {
      let parsed: DropNftTransient[] = JSON.parse(this.nftsString);
      parsed.forEach(dropNft => {
        dropNft.metadata = JSON.stringify(dropNft.metadata, null, 3);
      });

      if (this.checkIfDuplicateExists(parsed.map(p => p.assetName))) {
        throw new Error("Duplicate AssetNames!");
      }

      this.drop.dropNfts = parsed;
      this.parseError = '';
    } catch (error) {
      this.parseError = error as string;
    }
  }

  getAddress() {
    return (this.drop as Drop).address.address
  }

  upload() {
    if (!this.nftForm.form.valid) {
      return;
    }

    if (this.isPersited()) {
      this.dropRestInterfaceService.updateDrop(this.drop, this.account!.key, this.policyId, (this.drop as Drop).id).subscribe(() => {
        this.dropChanged.next();
      });
    } else {
      this.dropRestInterfaceService.createDrop(this.drop, this.account!.key, this.policyId).subscribe(() => {
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

}
