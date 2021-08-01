import { TokenEnhancerService } from './../token-enhancer.service';
import { Component, Input, OnInit } from '@angular/core';
import { TokenSubmission } from 'src/cardano-tools-client';

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

  metaData: any;
  previewUrl = ""
  previewType = ""

  constructor(private tokenEnhancerService: TokenEnhancerService) { }

  ngOnInit(): void {
    this.metaData = JSON.parse(this.token.metaData)
    if (this.metaData.files?.length) {
      this.previewType = this.metaData.files[0].mediaType || this.metaData.files[0].mediatype
      this.previewUrl = this.tokenEnhancerService.toIpfsUrl(this.metaData.files[0].src)
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
