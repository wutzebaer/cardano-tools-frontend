import { Component, Input, OnInit } from '@angular/core';
import { TokenDataWithMetadata } from '../token-enhancer.service';
import { TokenEnhancerService } from './../token-enhancer.service';
import { RestHandlerService, TokenListItem } from 'src/dbsync-client';

@Component({
  selector: 'app-latest-tokens-mini',
  templateUrl: './latest-tokens-mini.component.html',
  styleUrls: ['./latest-tokens-mini.component.scss']
})
export class LatestTokensMiniComponent implements OnInit {

  @Input() tokenListItem!: TokenListItem;
  imageUrl?: string;

  constructor(private api: RestHandlerService,
    private tokenEnhancerService: TokenEnhancerService) {
  }
  ngOnInit(): void {
    this.imageUrl = this.tokenEnhancerService.toIpfsUrl(this.tokenListItem.image)
  }

}
