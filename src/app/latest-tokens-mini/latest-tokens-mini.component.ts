import { Component, Input, OnInit } from '@angular/core';
import { TokenDataWithMetadata } from '../token-enhancer.service';
import { TokenEnhancerService } from './../token-enhancer.service';

@Component({
  selector: 'app-latest-tokens-mini',
  templateUrl: './latest-tokens-mini.component.html',
  styleUrls: ['./latest-tokens-mini.component.scss']
})
export class LatestTokensMiniComponent implements OnInit {

  @Input() token!: TokenDataWithMetadata;
  loading: boolean = true
  constructor(private tokenEnhancerService: TokenEnhancerService) { }

  previewUrl = ""
  previewType = ""

  ngOnInit(): void {
    if (this.token.metaData.image) {
      this.previewType = 'image'
      this.previewUrl = this.tokenEnhancerService.toIpfsUrl(this.token.metaData.image)
    } else if (this.token.mediaTypes.length) {
      this.previewType = this.token.mediaTypes[0]
      this.previewUrl = this.token.mediaUrls[0]
    } else {
      this.previewType = ""
      this.previewUrl = ""
    }
  }

  displayedColumns = ['name', 'value']


  hasMedia() {
    return this.token.mediaTypes.length > 0
  }

  isLoadingImage() {
    return this.loading && this.token.mediaTypes[0] == 'image'
  }

  onLoad() {
    this.loading = false;
  }

}
