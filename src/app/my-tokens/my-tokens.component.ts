import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RestInterfaceService, TokenData } from 'src/cardano-tools-client';
import { TokenDataWithMetadata } from '../token-enhancer.service';
import { LatestTokensDetailComponent } from './../latest-tokens-detail/latest-tokens-detail.component';
import { LocalStorageService } from './../local-storage.service';
import { TokenEnhancerService } from './../token-enhancer.service';


@Component({
  selector: 'app-my-tokens',
  templateUrl: './my-tokens.component.html',
  styleUrls: ['./my-tokens.component.scss']
})
export class MyTokensComponent implements OnInit {

  myTokens: TokenDataWithMetadata[] = []
  myaddress: string | null;

  constructor(private api: RestInterfaceService, public dialog: MatDialog, private localStorageService: LocalStorageService, private tokenEnhancerService: TokenEnhancerService) {
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
    this.myTokens = this.tokenEnhancerService.enhanceTokens(latestTokens);
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
