import { TokenEnhancerService } from './../token-enhancer.service';
import { Component, Input, OnInit } from '@angular/core';
import { TokenSubmission, MintOrderSubmission } from 'src/cardano-tools-client';

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

  @Input() mintOrderSubmission!: MintOrderSubmission;
  @Input() token!: TokenSubmission;

  metaData: any;
  previewUrl = ""
  previewType = ""

  constructor(private tokenEnhancerService: TokenEnhancerService) { }

  ngOnInit(): void {
    this.metaData = JSON.parse(this.mintOrderSubmission.metaData!)?.['721']?.[this.mintOrderSubmission.policyId]?.[this.token.assetName!] || {};
    if (this.metaData.image) {
      this.previewType = 'image'
      this.previewUrl = this.tokenEnhancerService.toIpfsUrl(this.metaData.image)
    } else {
      this.previewType = ""
      this.previewUrl = ""
    }
  }

  displayedColumns = ['name', 'value']

  get tableData(): TableRow[] {
    let data: TableRow[] = [
      { name: 'Amount', value: this.token.amount },
    ];
    for (let key in this.metaData) {
      data.push({ name: key, value: this.metaData[key] })
    }
    return data;
  }

}
