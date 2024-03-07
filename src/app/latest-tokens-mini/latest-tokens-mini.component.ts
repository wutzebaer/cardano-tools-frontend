import { Component, Input, OnInit } from '@angular/core';
import { TokenListItem } from 'src/dbsync-client';
import { TokenEnhancerService } from './../token-enhancer.service';

@Component({
  selector: 'app-latest-tokens-mini',
  templateUrl: './latest-tokens-mini.component.html',
  styleUrls: ['./latest-tokens-mini.component.scss'],
})
export class LatestTokensMiniComponent implements OnInit {
  @Input() tokenListItem!: TokenListItem;
  imageUrl?: string;

  constructor(private tokenEnhancerService: TokenEnhancerService) {}
  ngOnInit(): void {
    this.imageUrl = this.tokenEnhancerService.toIpfsUrl(
      this.tokenListItem.image
    );
  }
}
