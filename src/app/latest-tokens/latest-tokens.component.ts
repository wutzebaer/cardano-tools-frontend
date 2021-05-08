import { Component, HostListener, OnInit } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { RestInterfaceService, TokenData } from 'src/cardano-tools-client';

export interface TokenDataWithMetadata extends TokenData {
  metaData: any
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

  constructor(private api: RestInterfaceService) {
    this.api.latestTokens().subscribe(
      latestTokens => this.updateTokens(latestTokens, false)
    );
  }

  ngOnInit(): void {
    this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchText => {
        if (searchText != '') {
          return this.api.findTokens(searchText)
        } else {
          return this.api.latestTokens()
        }
      })
    ).subscribe(foundTokens => this.updateTokens(foundTokens, false))
  }



  search(event: any) {
    let searchText = event.target.value
    this.searchText = searchText;
    this.searchText$.next(searchText);
  }

  updateTokens(latestTokens: TokenData[], append: boolean) {
    console.log(latestTokens)
    if (!append)
      this.latestTokens = []

    latestTokens.forEach(element => {
      let tokenDataWithMetadata = element as TokenDataWithMetadata;

      let metaData = JSON.parse(element.json)
      metaData = metaData[tokenDataWithMetadata.policyId] || {}
      metaData = metaData[tokenDataWithMetadata.name] || {}
      tokenDataWithMetadata.metaData = metaData;

      this.latestTokens.push(tokenDataWithMetadata)
    });

  }

  onScroll() {
    if (this.searchText == '') {
      let tid = this.latestTokens[this.latestTokens.length - 1].tid
      this.api.latestTokens(tid).subscribe(
        latestTokens => {
          this.updateTokens(latestTokens, true)
        }
      );
    }
  }

}
