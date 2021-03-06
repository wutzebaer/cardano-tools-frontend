import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExchangeRestInterfaceService } from 'src/cardano-tools-client';
import { ExchangeBuyFormComponent } from './../exchange-buy-form/exchange-buy-form.component';
import { TokenEnhancerService, TokenOfferWithParsedTokenData } from './../token-enhancer.service';


@Component({
  selector: 'app-exchange-buy',
  templateUrl: './exchange-buy.component.html',
  styleUrls: ['./exchange-buy.component.scss']
})
export class ExchangeBuyComponent implements OnInit {
  offers: TokenOfferWithParsedTokenData[] = [];

  constructor(private api: ExchangeRestInterfaceService, private tokenEnhancerService: TokenEnhancerService, public dialog: MatDialog) {
    this.reloadOffers();
  }

  private reloadOffers() {
    this.api.getOffers().subscribe(offers => {
      this.offers = [];
      offers.forEach(offer => {
        this.offers.push(this.tokenEnhancerService.enhanceOffer(offer));
      });
    });
  }

  ngOnInit(): void {
  }

  details(offer: TokenOfferWithParsedTokenData) {
    this.dialog.open(ExchangeBuyFormComponent, {
      width: '750px',
      maxWidth: '90vw',
      data: { offer: offer },
      closeOnNavigation: true
    }).afterClosed().subscribe(result => {
      this.reloadOffers();
    });
  }

}
