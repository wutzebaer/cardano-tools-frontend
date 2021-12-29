import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AccountPrivate } from 'src/cardano-tools-client';
import { AccountService } from './../account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnDestroy {

  account?: AccountPrivate;
  scrollPosition = 0
  accountSubscription: Subscription

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private accountService: AccountService) {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      document.getElementsByTagName('mat-sidenav-content')[0].scrollTo(0, 0)
    });
    this.accountSubscription = accountService.account.subscribe(account => {
      this.account = account;
    });
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }


}
