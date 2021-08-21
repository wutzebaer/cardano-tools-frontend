import { LatestTokensDetailComponent } from './../latest-tokens-detail/latest-tokens-detail.component';
import { TokenEnhancerService } from './../token-enhancer.service';
import { Account, RestInterfaceService } from 'src/cardano-tools-client';
import { AccountService } from './../account.service';
import { Component, OnInit } from '@angular/core';
import { TokenDataWithMetadata } from '../token-enhancer.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-exchange-sell',
  templateUrl: './exchange-sell.component.html',
  styleUrls: ['./exchange-sell.component.scss']
})
export class ExchangeSellComponent implements OnInit {

  account!: Account;
  myTokens: TokenDataWithMetadata[] = []

  constructor(private accountService: AccountService, private api: RestInterfaceService, private tokenEnhancerService: TokenEnhancerService, public dialog: MatDialog) {
    accountService.account.subscribe(account => {
      if (account.key) {
        this.account = account;
        this.api.offerToken(this.account.key).subscribe(foundTokens => {
          this.myTokens = this.tokenEnhancerService.enhanceTokens(foundTokens);
        });
      }
    });

  }

  ngOnInit(): void {

  }

  details(token: TokenDataWithMetadata) {
    this.dialog.open(LatestTokensDetailComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { token: token },
      closeOnNavigation: true
    });
  }

}
