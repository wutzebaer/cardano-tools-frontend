import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TokenDataWithMetadata } from '../token-enhancer.service';
import { LatestTokensDetailComponent } from './../latest-tokens-detail/latest-tokens-detail.component';
import { LocalStorageService } from './../local-storage.service';
import { TokenEnhancerService } from './../token-enhancer.service';
import { RestHandlerService, TokenListItem } from 'src/dbsync-client';


@Component({
  selector: 'app-my-tokens',
  templateUrl: './my-tokens.component.html',
  styleUrls: ['./my-tokens.component.scss']
})
export class MyTokensComponent implements OnInit {

  myTokens: TokenListItem[] = []
  myaddress: string | null;

  constructor(private api: RestHandlerService, public dialog: MatDialog, private localStorageService: LocalStorageService, private tokenEnhancerService: TokenEnhancerService) {
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

  details(token: TokenListItem) {
    this.dialog.open(LatestTokensDetailComponent, {
      width: '750px',
      maxWidth: '90vw',
      data: { tokenListItem: token },
      closeOnNavigation: true
    });
  }

  update() {
    if (this.myaddress) {
      this.localStorageService.storeMyAddress(this.myaddress);
      this.api.getAddressTokenList(this.myaddress).subscribe(foundTokens => this.myTokens = foundTokens);
    }
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
