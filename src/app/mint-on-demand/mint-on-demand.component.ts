import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  AccountPrivate,
  Drop,
  DropRestInterfaceService,
} from 'src/cardano-tools-client';
import { RestHandlerService, TokenListItem } from 'src/dbsync-client';
import { DropNftTransient } from './../../cardano-tools-client/model/dropNftTransient';
import { DropTransient } from './../../cardano-tools-client/model/dropTransient';
import { AccountService } from './../account.service';
import { TokenEnhancerService } from './../token-enhancer.service';

@Component({
  selector: 'app-mint-on-demand',
  templateUrl: './mint-on-demand.component.html',
  styleUrls: ['./mint-on-demand.component.scss'],
})
export class MintOnDemandComponent implements OnInit, OnDestroy {
  policyId = '';
  account?: AccountPrivate;
  accountSubscription: Subscription;
  tokens: TokenListItem[] = [];
  drops: Drop[] = [];
  drop: DropTransient = {
    name: '',
    price: 5_000_000,
    maxPerTransaction: 5,
    profitAddress: '',
    whitelist: [],
    dropNfts: [
      {
        assetName: 'Assetname#1',
        metadata: `{
          "name": "My NFT#1",
          "Artists": "Artist",
          "Website": "Website",
          "image": "ipfs://QmQ83JBXLTQtKXby3Hq29vbTAzrT5AH8Yds873Ni1fV5KY",
          "description": "Description"
        }`,
      },
      {
        assetName: 'Assetname#2',
        metadata: `{
          "name": "My NFT#2",
          "Artists": "Artist",
          "Website": "Website",
          "image": "ipfs://QmQ83JBXLTQtKXby3Hq29vbTAzrT5AH8Yds873Ni1fV5KY",
          "description": "Description"
        }`,
      },
    ],
    running: false,
    dropNftsAvailableAssetNames: [],
    dropNftsSoldAssetNames: [],
    prettyUrl: '',
  };

  constructor(
    private tokenApi: RestHandlerService,
    private tokenEnhancerService: TokenEnhancerService,
    private sanitizer: DomSanitizer,
    private dropRestInterfaceService: DropRestInterfaceService,
    private accountService: AccountService,
    private router: Router
  ) {
    this.accountSubscription = accountService.account.subscribe((account) => {
      this.account = account;
    });
  }

  ngOnInit(): void {
    // metadata passed from normal mint page
    if (history.state.mintMetadata) {
      let tokenMetadata = history.state.mintMetadata;
      let nfts: DropNftTransient[] = [];
      Object.keys(tokenMetadata).forEach((assetName) => {
        nfts.push({
          assetName: assetName,
          metadata: JSON.stringify(tokenMetadata[assetName], null, 3),
        });
        this.drop.dropNfts = nfts;
      });
    }
  }

  openLatestDrop() {
    return !history.state.mintMetadata;
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }

  changePolicyId(newPolicyId: string) {
    this.policyId = newPolicyId;
    this.tokenApi
      .getTokenList(undefined, undefined, newPolicyId)
      .subscribe({ next: (tokens) => (this.tokens = tokens) });
    this.updateDrops();
  }

  updateDrops() {
    this.dropRestInterfaceService
      .getDrops(this.account!.key, this.policyId)
      .subscribe((drops) => (this.drops = drops));
  }
}
