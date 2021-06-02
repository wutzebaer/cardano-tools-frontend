import { Component, Input, OnInit } from '@angular/core';
import { RestInterfaceService } from 'src/cardano-tools-client';
import { TokenDataWithMetadata } from '../latest-tokens/latest-tokens.component';
import { TableRow } from '../mint-token-mini/mint-token-mini.component';

@Component({
  selector: 'app-latest-tokens-mini',
  templateUrl: './latest-tokens-mini.component.html',
  styleUrls: ['./latest-tokens-mini.component.scss']
})
export class LatestTokensMiniComponent implements OnInit {

  @Input() token!: TokenDataWithMetadata;
  loading: boolean = true

  constructor(private api: RestInterfaceService) { }

  ngOnInit(): void {
  }

  displayedColumns = ['name', 'value']

  toIpfsUrl(ipfs: any) {
    // https://ipfs.io/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt
    // https://ipfs.blockfrost.dev/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt
    // https://cloudflare-ipfs.com/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt
    // https://ipfs.eternum.io/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt

    if (Array.isArray(ipfs)) {
      ipfs = ipfs.join("")
    }

    return "https://ipfs.cardano-tools.io/ipfs/" + ipfs.replace("ipfs://ipfs/", "").replace("ipfs://", "").replace("ipfs/", "").replace("https://ipfs.io/", "");
  }

  hasMedia() {
    return this.token.metaData['image'] || this.token.metaData['audio'] || this.token.metaData['video']
  }

  isLoadingImage() {
    return this.loading && this.token.metaData['image']
  }

  onLoad() {
    this.loading = false;
  }

}
