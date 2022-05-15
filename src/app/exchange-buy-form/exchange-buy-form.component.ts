import { TokenDataWithMetadata, TokenEnhancerService, TokenOfferWithParsedTokenData } from './../token-enhancer.service';
import { interval, Subscription } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ExchangeRestInterfaceService } from 'src/cardano-tools-client';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-exchange-buy-form',
  templateUrl: './exchange-buy-form.component.html',
  styleUrls: ['./exchange-buy-form.component.scss']
})
export class ExchangeBuyFormComponent implements OnInit, OnDestroy {
  offer: TokenOfferWithParsedTokenData;
  timer: Subscription;
  receivedToken?: TokenDataWithMetadata;


  constructor(@Inject(MAT_DIALOG_DATA) public data: { offer: TokenOfferWithParsedTokenData }, private clipboard: Clipboard, private api: ExchangeRestInterfaceService, private tokenEnhancerService: TokenEnhancerService, private snackBar: MatSnackBar) {
    this.offer = data.offer;

    this.timer = interval(10000).subscribe(() => { this.updateOffer(api); });
    this.updateOffer(api);
  }


  private updateOffer(api: ExchangeRestInterfaceService) {
    api.getOffer(this.offer.id).subscribe(
      offer => {
        this.offer = this.tokenEnhancerService.enhanceOffer(offer);
        this.receivedToken = this.offer.receivedTokensParsed.find(t => t.policyId == offer.policyId && t.name == offer.assetName);
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
    let snackBarRef = this.snackBar.open('Copied to clipboard: ' + value, undefined, { duration: 2000 });
  }

}
