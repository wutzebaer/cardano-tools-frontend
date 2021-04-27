import { TokenSubmission } from './../../cardano-tools-client/model/tokenSubmission';
import { Component, Input, OnInit } from '@angular/core';

export interface TableRow {
  name: string;
  value: any;
}

@Component({
  selector: 'app-mint-token-mini',
  templateUrl: './mint-token-mini.component.html',
  styleUrls: ['./mint-token-mini.component.scss']
})
export class MintTokenMiniComponent implements OnInit {

  @Input() token!: TokenSubmission;

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
      { name: 'Amount', value: this.token.amount },
    ];
    for (let key in this.token.metaData) {
      data.push({ name: key, value: this.token.metaData[key].value || this.token.metaData[key].listValue })
    }
    return data;
  }

}
