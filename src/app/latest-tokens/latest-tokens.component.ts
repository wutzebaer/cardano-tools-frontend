import { Component, OnInit } from '@angular/core';
import { RestInterfaceService, TokenData } from 'src/cardano-tools-client';

export interface TokenDataWithMetadata extends TokenData {
  metaData: any
}

@Component({
  selector: 'app-latest-tokens',
  templateUrl: './latest-tokens.component.html',
  styleUrls: ['./latest-tokens.component.scss']
})
export class LatestTokensComponent implements OnInit {

  latestTokens: TokenDataWithMetadata[] = []

  constructor(private api: RestInterfaceService) {
    this.api.latestTokens().subscribe(
      latestTokens => {
        console.log(latestTokens)
        this.latestTokens = []

        latestTokens.forEach(element => {
          let tokenDataWithMetadata = element as TokenDataWithMetadata;
          
          let metaData = JSON.parse(element.json)
          metaData = metaData[tokenDataWithMetadata.policyId] || {}
          metaData = metaData[tokenDataWithMetadata.name] || {}
          tokenDataWithMetadata.metaData = metaData;
          
          this.latestTokens.push(tokenDataWithMetadata)
        });

        console.log(this.latestTokens)

      }
    );
  }

  ngOnInit(): void {

  }


}
