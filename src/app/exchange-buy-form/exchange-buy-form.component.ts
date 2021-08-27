import { TokenDataWithMetadata, TokenEnhancerService, TokenOfferWithParsedTokenData } from './../token-enhancer.service';
import { interval, Subscription } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { RestInterfaceService } from 'src/cardano-tools-client';

@Component({
  selector: 'app-exchange-buy-form',
  templateUrl: './exchange-buy-form.component.html',
  styleUrls: ['./exchange-buy-form.component.scss']
})
export class ExchangeBuyFormComponent implements OnInit {
  offer: TokenOfferWithParsedTokenData;
  timer: Subscription;
  receivedToken?: TokenDataWithMetadata;


  constructor(@Inject(MAT_DIALOG_DATA) public data: { offer: TokenOfferWithParsedTokenData }, private clipboard: Clipboard, private api: RestInterfaceService, private tokenEnhancerService: TokenEnhancerService) {
    this.offer = data.offer;

    this.timer = interval(10000).subscribe(() => { this.updateOffer(api); });
    this.updateOffer(api);
  }


  private updateOffer(api: RestInterfaceService) {
    api.getOffer(this.offer.id).subscribe(
      offer => {
        this.offer = this.tokenEnhancerService.enhanceOffer(offer);
        this.receivedToken = this.offer.receivedTokensParsed.find(t => t.policyId == offer.policyId && t.name == offer.assetName);
        console.log(this.receivedToken);

      }
    );
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
  }

  ngOnInit(): void {
  }

  copyToClipboard(value: string) {
    this.clipboard.copy(value);
  }

}
