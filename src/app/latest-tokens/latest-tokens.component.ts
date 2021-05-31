import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, retry, switchMap } from 'rxjs/operators';
import { RestInterfaceService, TokenData } from 'src/cardano-tools-client';
import { LatestTokensDetailComponent } from '../latest-tokens-detail/latest-tokens-detail.component';

export interface TokenDataWithMetadata extends TokenData {
  metaData: any
  tokenRegistryMetadataParsed: any
}

@Component({
  selector: 'app-latest-tokens',
  templateUrl: './latest-tokens.component.html',
  styleUrls: ['./latest-tokens.component.scss']
})
export class LatestTokensComponent implements OnInit {

  searchInput: string = "";
  searchText: string = "";
  searchText$ = new Subject<string>();
  latestTokens: TokenDataWithMetadata[] = []
  lastOffset = 0

  constructor(private api: RestInterfaceService, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private router: Router) {
    this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchText => {
        if (searchText != '') {
          router.navigate(['/latest'], { queryParams: { q: searchText } })
          return this.api.findTokens(searchText)
        } else {
          router.navigate(['/latest'])
          return this.api.latestTokens()
        }
      }),
      retry()
    ).subscribe(foundTokens => this.updateTokens(foundTokens, false))

    this.activatedRoute.queryParams.subscribe(params => {
      let q = params['q'];
      let policy = params['policy'];
      let name = params['name'];

      if (q)
        this.searchString(q)
      else
        this.searchString("")
    });
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
      width: '750px',
      maxWidth: '90vw',
      data: { token: token },
      closeOnNavigation: true
    });
  }

  searchString(policyId: string) {
    let searchText = policyId
    this.searchInput = policyId
    this.searchText = searchText;
    this.searchText$.next(searchText);
  }

  search(event: any) {
    let searchText = event.target.value
    this.searchText = searchText;
    this.searchText$.next(searchText);
  }

  updateTokens(latestTokens: TokenData[], append: boolean) {
    if (!append) {
      this.latestTokens = []
      document.getElementsByClassName("my-sidenav-content")[0].scrollTop = 0
      this.lastOffset = 0
    }

    latestTokens.forEach(element => {
      let tokenDataWithMetadata = element as TokenDataWithMetadata;

      if (element.tokenRegistryMetadata) {
        tokenDataWithMetadata.tokenRegistryMetadataParsed = JSON.parse(element.tokenRegistryMetadata)
      }

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

      this.latestTokens.push(tokenDataWithMetadata)
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

  onScroll() {
    let mintid = this.latestTokens[this.latestTokens.length - 1].mintid

    if (mintid == this.lastOffset) {
      return
    } else {
      this.lastOffset = mintid
    }

    if (this.searchText == '') {
      this.api.latestTokens(mintid).subscribe(
        latestTokens => {
          this.updateTokens(latestTokens, true)
        }
      );
    } else {
      this.api.findTokens(this.searchText, mintid).subscribe(
        latestTokens => {
          this.updateTokens(latestTokens, true)
        }
      );
    }

  }

}
