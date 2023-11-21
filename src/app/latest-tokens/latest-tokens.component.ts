import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  retry,
  switchMap,
} from 'rxjs/operators';
import { LatestTokensDetailComponent } from '../latest-tokens-detail/latest-tokens-detail.component';
import { TokenDataWithMetadata } from '../token-enhancer.service';
import { TokenEnhancerService } from './../token-enhancer.service';
import { TokenRestInterfaceService } from 'src/cardano-tools-client';
import { RestHandlerService, TokenListItem } from 'src/dbsync-client';

export enum FetchMode {
  replace,
  append,
  prepend,
}

@Component({
  selector: 'app-latest-tokens',
  templateUrl: './latest-tokens.component.html',
  styleUrls: ['./latest-tokens.component.scss'],
})
export class LatestTokensComponent implements OnInit, OnDestroy {
  searchInput: string = '';
  searchText: string = '';
  searchText$ = new Subject<string>();
  latestTokens: TokenListItem[] = [];
  lastOffset = 0;
  timer: Subscription;

  constructor(
    private api: RestHandlerService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private tokenEnhancerService: TokenEnhancerService
  ) {
    this.searchText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchText) => {
          this.updateTokens([], FetchMode.replace);
          if (searchText != '') {
            router.navigate(['/latest'], { queryParams: { q: searchText } });
          } else {
            router.navigate(['/latest']);
          }
          return this.api.getTokenList(undefined, undefined, searchText);
        }),
        retry()
      )
      .subscribe((foundTokens) =>
        this.updateTokens(foundTokens, FetchMode.replace)
      );

    this.activatedRoute.queryParams.subscribe((params) => {
      let q = params['q'];
      let policy = params['policy'];
      let name = params['name'];

      if (q) this.searchString(q);
      else this.searchString('');
    });

    this.timer = interval(5000).subscribe(() => {
      let mintid = this.latestTokens[0].maMintId;
      this.api
        .getTokenList(mintid, undefined, this.searchText)
        .subscribe((latestTokens) => {
          this.updateTokens(latestTokens, FetchMode.prepend);
        });
    });
  }
  ngOnDestroy(): void {
    this.timer.unsubscribe();
  }

  ngOnInit(): void {}

  details(token: TokenListItem) {
    this.dialog.open(LatestTokensDetailComponent, {
      width: '750px',
      maxWidth: '90vw',
      data: { tokenListItem: token },
      closeOnNavigation: true,
    });
  }

  searchString(policyId: string) {
    let searchText = policyId;
    this.searchInput = policyId;
    this.searchText = searchText;
    this.searchText$.next(searchText);
  }

  search(event: any) {
    let searchText = event.target.value;
    this.searchText = searchText;
    this.searchText$.next(searchText);
  }

  updateTokens(latestTokens: TokenListItem[], fetchMode: FetchMode) {
    if (!latestTokens.length && fetchMode !== FetchMode.replace) {
      return;
    }

    if (fetchMode == FetchMode.replace) {
      this.latestTokens = [];
      document.getElementsByClassName('my-sidenav-content')[0].scrollTop = 0;
      this.lastOffset = 0;
    }

    if (fetchMode == FetchMode.prepend) {
      this.latestTokens = latestTokens.concat(this.latestTokens);
    } else {
      this.latestTokens = this.latestTokens.concat(latestTokens);
    }

    if (fetchMode == FetchMode.replace && latestTokens.length === 1) {
      this.details(this.latestTokens[0]);
    }
  }

  onScroll() {
    let mintid = this.latestTokens[this.latestTokens.length - 1].maMintId ?? 0;

    if (mintid == this.lastOffset) {
      return;
    } else {
      this.lastOffset = mintid;
    }

    this.api
      .getTokenList(undefined, mintid, this.searchText)
      .subscribe((latestTokens) => {
        this.updateTokens(latestTokens, FetchMode.append);
      });
  }
}
