import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RestInterfaceService, TokenData } from 'src/cardano-tools-client';
import { LatestTokensDetailComponent } from './../latest-tokens-detail/latest-tokens-detail.component';
import { LocalStorageService } from './../local-storage.service';


export interface TokenDataWithMetadata extends TokenData {
  metaData: any
}

@Component({
  selector: 'app-my-tokens',
  templateUrl: './my-tokens.component.html',
  styleUrls: ['./my-tokens.component.scss']
})
export class MyTokensComponent implements OnInit {

  myTokens: TokenDataWithMetadata[] = []
  myaddress: string | null;

  constructor(private api: RestInterfaceService, public dialog: MatDialog, private router: Router, private localStorageService: LocalStorageService) {
    this.myaddress = localStorageService.retrieveMyAddress();
    this.update()

  }

  ngOnInit(): void {
  }

  calculateTime(epochNo: number, epochSlotNo: number) {
    let timestamp = Date.parse('2017-09-23T21:44:51Z');
    timestamp += epochNo * 432000 * 1000
    timestamp += epochSlotNo * 1000
    return timestamp;
  }

  details(token: TokenDataWithMetadata) {
    this.dialog.open(LatestTokensDetailComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { token: token },
      closeOnNavigation: true
    });
  }

  update() {
    if (this.myaddress) {
      this.localStorageService.storeMyAddress(this.myaddress);
      this.api.walletTokens(this.myaddress).subscribe(foundTokens => this.updateTokens(foundTokens));
    }
  }

  updateTokens(latestTokens: TokenData[]) {
    this.myTokens = []

    latestTokens.forEach(element => {
      let tokenDataWithMetadata = element as TokenDataWithMetadata;

      if (element.json && element.json !== 'null') {

        let metaData = JSON.parse(element.json)

        metaData = metaData[tokenDataWithMetadata.policyId] || metaData
        metaData = metaData[tokenDataWithMetadata.name] || metaData

        if (!metaData.image && !metaData.video && !metaData.audio) {
          let foundImage = this.findAnyIpfsUrl(metaData)
          if (foundImage)
            metaData.image = foundImage
        }

        tokenDataWithMetadata.metaData = metaData;

      } else {
        tokenDataWithMetadata.metaData = {};
      }

      this.myTokens.push(tokenDataWithMetadata)
    });

  }

  findAnyIpfsUrl(object: any): any {
    for (let key in object) {
      let value = object[key];
      if (value !== null && typeof (value) == "object") {
        let result = this.findAnyIpfsUrl(value);
        if (result) {
          return result
        }
      } else {
        if (value.substring && (value.startsWith("ipfs") || value.startsWith("Qm"))) {
          return value;
        }
      }
    }
  }


}
