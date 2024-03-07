import { Component, Input } from '@angular/core';
import {
  RestHandlerService,
  TokenDetails,
  TokenListItem,
} from 'src/dbsync-client';
import {
  TokenDataWithMetadata,
  TokenEnhancerService,
} from './../token-enhancer.service';

@Component({
  selector: 'app-token-mini',
  templateUrl: './token-mini.component.html',
  styleUrls: ['./token-mini.component.scss'],
})
export class TokenMiniComponent {
  @Input() policyId!: string;
  @Input() assetName!: string;
  @Input() amount?: number;

  tokenDetails?: TokenDataWithMetadata;
  imageUrl?: string;

  constructor(
    private tokenEnhancerService: TokenEnhancerService,
    private restHandlerService: RestHandlerService
  ) {}
  ngOnInit(): void {
    this.restHandlerService
      .getTokenDetails(this.policyId, this.assetName)
      .toPromise()
      .then((rawData) => {
        const tokenDetails = this.tokenEnhancerService.enhanceToken(rawData);
        if (tokenDetails.metaDataObject.image) {
          this.imageUrl = this.tokenEnhancerService.toIpfsUrl(
            tokenDetails.metaDataObject.image
          );
        }
        this.tokenDetails = tokenDetails;
      });
  }
}
