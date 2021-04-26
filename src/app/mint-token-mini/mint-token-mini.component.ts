import { TokenSubmission } from './../../cardano-tools-client/model/tokenSubmission';
import { Component, Input, OnInit } from '@angular/core';

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

  toIpfsUrl(ipfs: any) {
    return ipfs.replace("ipfs://", "https://ipfs.io/ipfs/");
  }

}
