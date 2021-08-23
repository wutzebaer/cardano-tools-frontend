import { TokenEnhancerService } from './../token-enhancer.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, interval, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, retry, switchMap } from 'rxjs/operators';
import { RestInterfaceService, TokenData, TokenRegistryMetadata } from 'src/cardano-tools-client';
import { LatestTokensDetailComponent } from '../latest-tokens-detail/latest-tokens-detail.component';
import { TokenDataWithMetadata } from '../token-enhancer.service';


export enum FetchMode {
  replace, append, prepend
}

@Component({
  selector: 'app-latest-tokens',
  templateUrl: './latest-tokens.component.html',
  styleUrls: ['./latest-tokens.component.scss']
})
export class LatestTokensComponent implements OnInit, OnDestroy {

  searchInput: string = "";
  searchText: string = "";
  searchText$ = new Subject<string>();
  latestTokens: TokenDataWithMetadata[] = []
  lastOffset = 0
  timer: Subscription;

  constructor(private api: RestInterfaceService, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private router: Router, private tokenEnhancerService: TokenEnhancerService) {
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
    ).subscribe(foundTokens => this.updateTokens(foundTokens, FetchMode.replace))

    this.activatedRoute.queryParams.subscribe(params => {
      let q = params['q'];
      let policy = params['policy'];
      let name = params['name'];

      if (q)
        this.searchString(q)
      else
        this.searchString("")
    });

    this.timer = interval(1000).subscribe(() => {
      if (this.searchText == '') {
        let mintid = this.latestTokens[0].mintid
        this.api.latestTokens(-mintid).subscribe(
          latestTokens => {
            this.updateTokens(latestTokens, FetchMode.prepend);
          }
        );
      }
    });
  }
  ngOnDestroy(): void {
    this.timer.unsubscribe();
  }

  ngOnInit(): void {
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

  updateTokens(latestTokens: TokenData[], fetchMode: FetchMode) {

    if (!latestTokens.length && fetchMode !== FetchMode.replace) {
      return;
    }

    let enhancedLatestTokens = this.tokenEnhancerService.enhanceTokens(latestTokens);

    if (fetchMode == FetchMode.replace) {
      this.latestTokens = []
      document.getElementsByClassName("my-sidenav-content")[0].scrollTop = 0
      this.lastOffset = 0
    }

    if (fetchMode == FetchMode.prepend) {
      this.latestTokens = enhancedLatestTokens.concat(this.latestTokens)
    } else {
      this.latestTokens = this.latestTokens.concat(enhancedLatestTokens)
    }


    if (fetchMode == FetchMode.replace && latestTokens.length === 1) {
      this.details(this.latestTokens[0]);
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
          this.updateTokens(latestTokens, FetchMode.append)
        }
      );
    } else {
      this.api.findTokens(this.searchText, mintid).subscribe(
        latestTokens => {
          this.updateTokens(latestTokens, FetchMode.append)
        }
      );
    }

  }

}
