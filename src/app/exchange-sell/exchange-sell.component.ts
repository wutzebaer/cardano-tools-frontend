import { TokenOffer } from './../../cardano-tools-client/model/tokenOffer';
import { ExchangeSellFormComponent } from './../exchange-sell-form/exchange-sell-form.component';
import { interval, Observable, Subscription } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { LatestTokensDetailComponent } from './../latest-tokens-detail/latest-tokens-detail.component';
import { TokenEnhancerService } from './../token-enhancer.service';
import { Account, RestInterfaceService } from 'src/cardano-tools-client';
import { AccountService } from './../account.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TokenDataWithMetadata } from '../token-enhancer.service';
import { MatDialog } from '@angular/material/dialog';
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'app-exchange-sell',
  templateUrl: './exchange-sell.component.html',
  styleUrls: ['./exchange-sell.component.scss']
})
export class ExchangeSellComponent implements OnInit, OnDestroy {

  account!: Account;
  myTokens: TokenDataWithMetadata[] = []
  timer: Subscription
  accountSubscription: Subscription
  readonly minStake = 95000000
  offeredTokens: Map<String, TokenOffer> = new Map();


  constructor(private accountService: AccountService, private api: RestInterfaceService, private tokenEnhancerService: TokenEnhancerService, public dialog: MatDialog, private clipboard: Clipboard) {
    this.accountSubscription = accountService.account.subscribe(account => {
      this.account = account;
      if (account.key) {
        this.api.getOfferableTokens(this.account.key).subscribe(foundTokens => {
          this.myTokens = this.tokenEnhancerService.enhanceTokens(foundTokens);
        });
        this.reloadMyOfferedTokens();
      }
    });

    this.timer = interval(10000).subscribe(() => {
      if (this.account.stake < this.minStake) {
        accountService.updateAccount();
      }
    });

  }
  ngOnDestroy(): void {
    this.timer.unsubscribe();
    this.accountSubscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  getAdaPrice(token: TokenDataWithMetadata) {
    const price = this.offeredTokens.get(token.policyId + token.name)?.price;
    return (price || 0) / 1000000
  }

  details(token: TokenDataWithMetadata) {
    this.dialog.open(ExchangeSellFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { token: token, account: this.account, tokenOffer: this.offeredTokens.get(token.policyId + token.name) },
      closeOnNavigation: true
    }).afterClosed().subscribe(result => {
      if (result) {
        this.reloadMyOfferedTokens();
      }
    });
  }

  copyToClipboard(value: string) {
    this.clipboard.copy(value);
  }

  reloadMyOfferedTokens() {
    this.api.getOfferedTokens(this.account.key).subscribe(offers => {
      this.offeredTokens.clear();
      offers.forEach(offer => {
        this.offeredTokens.set(offer.policyId + offer.assetName, offer);
      });
    });
  }

}
