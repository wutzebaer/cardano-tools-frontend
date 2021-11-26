import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { AccountPrivate, ExchangeRestInterfaceService } from 'src/cardano-tools-client';
import { TokenDataWithMetadata } from '../token-enhancer.service';
import { AccountService } from './../account.service';
import { ExchangeSellFormComponent } from './../exchange-sell-form/exchange-sell-form.component';
import { TokenEnhancerService } from './../token-enhancer.service';

@Component({
  selector: 'app-exchange-sell',
  templateUrl: './exchange-sell.component.html',
  styleUrls: ['./exchange-sell.component.scss']
})
export class ExchangeSellComponent implements OnInit, OnDestroy {

  account!: AccountPrivate;
  myTokens: TokenDataWithMetadata[] = []
  timer: Subscription
  accountSubscription: Subscription
  readonly minStake = 95000000
  offeredTokens: any = {};


  constructor(private accountService: AccountService, private api: ExchangeRestInterfaceService, private tokenEnhancerService: TokenEnhancerService, public dialog: MatDialog, private clipboard: Clipboard) {
    this.accountSubscription = accountService.account.subscribe(account => {
      this.account = account;
      if (account.key && account.stake > this.minStake) {
        this.api.getOfferableTokens(this.account.key).subscribe(foundTokens => {
          this.myTokens = this.tokenEnhancerService.enhanceTokens(foundTokens);
          this.sortTokens();
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
    const price = this.offeredTokens[token.policyId + token.name]?.price;
    return (price || 0) / 1000000
  }

  details(token: TokenDataWithMetadata) {
    this.dialog.open(ExchangeSellFormComponent, {
      width: '750px',
      maxWidth: '90vw',
      data: { token: token, account: this.account, tokenOffer: this.offeredTokens[token.policyId + token.name] },
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
      this.offeredTokens = {};
      offers.forEach(offer => {
        this.offeredTokens[offer.policyId + offer.assetName] = offer;
      });
      this.sortTokens();
    });
  }


  private sortTokens() {
    this.myTokens.sort(((t1, t2) => {
      let t1order = this.offeredTokens[t1.policyId + t1.name] ? 0 : 1;
      let t2order = this.offeredTokens[t2.policyId + t2.name] ? 0 : 1;
      return t1order - t2order;
    }));
  }
}
