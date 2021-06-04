import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RestInterfaceService } from 'src/cardano-tools-client';
import { TokenDataWithMetadata } from '../token-enhancer.service';

@Component({
  selector: 'app-latest-tokens-mini',
  templateUrl: './latest-tokens-mini.component.html',
  styleUrls: ['./latest-tokens-mini.component.scss']
})
export class LatestTokensMiniComponent implements OnInit {

  @Input() token!: TokenDataWithMetadata;
  loading: boolean = true
  constructor(private api: RestInterfaceService, private sanitizer: DomSanitizer) { }


  ngOnInit(): void {
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
