import { Component, Input, OnInit } from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
  }

  displayedColumns = ['name', 'value']

  toIpfsUrl(ipfs: any) {
    // https://ipfs.io/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt
    // https://ipfs.blockfrost.dev/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt
    // https://cloudflare-ipfs.com/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt
    // https://ipfs.eternum.io/ipfs/QmNSVrsLZLWUJDtTF27z2KGAStCQyxdxfadTqsTy4bcKzt
    return ipfs.replace("ipfs://", "https://ipfs.cardano-tools.io/ipfs/");
  }

  get tableData(): TableRow[] {
    let data: TableRow[] = [
      { name: 'Amount', value: this.token.quantity },
    ];
    for (let key in this.token.metaData) {
      if (Array.isArray(this.token.metaData[key])) {
        data.push({ name: key, value: this.token.metaData[key].map((el: any) => JSON.stringify(el)) })
      }
      else {
        data.push({ name: key, value: this.token.metaData[key] })
      }
    }
    return data;
  }


  onLoad() {
    this.loading = false;
  }

}
