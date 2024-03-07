import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {
  PolicyPrivate,
  TokenSubmission
} from 'src/cardano-tools-client';
import { RestHandlerService, TokenListItem } from 'src/dbsync-client';
import { CardanoDappService } from '../cardano-dapp.service';
import { ErrorService } from '../error.service';
import { AccountService } from './../account.service';
import { RoyaltiesCip27MintSuccessComponent } from './../royalties-cip27-mint-success/royalties-cip27-mint-success.component';

@Component({
  selector: 'app-royalties-cip27-mint',
  templateUrl: './royalties-cip27-mint.component.html',
  styleUrls: ['./royalties-cip27-mint.component.scss'],
})
export class RoyaltiesCip27MintComponent implements OnInit, OnDestroy {
  @ViewChild('instructionsForm') instructionsForm!: NgForm;

  policies?: PolicyPrivate[];
  policy?: PolicyPrivate;
  tokens: TokenListItem[] = [];
  percent: number = 20;
  addr: string = '';
  minting = false;

  policiesSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private accountService: AccountService,
    private dbsyncApi: RestHandlerService,
    private cardanoDappService: CardanoDappService,
    private errorService: ErrorService
  ) {
    this.policiesSubscription = accountService.policies.subscribe(
      (policies) => {
        this.policies = policies;
      }
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.policiesSubscription.unsubscribe();
  }

  changePolicyId(policyId: string) {
    this.policy = this.policies?.find((p) => p.policyId === policyId);
    this.reloadTokens(policyId);
  }

  reloadTokens(policyId: string) {
    this.dbsyncApi
      .getTokenList(undefined, undefined, policyId)
      .subscribe({ next: (tokens) => (this.tokens = tokens) });
  }

  async generateCip27() {
    if (!this.policy) {
      return;
    }

    const metadata = {
      '777': {
        rate: (this.percent / 100).toString(),
        addr: this.addr.match(/.{1,64}/g),
      },
    };

    const tokens: TokenSubmission[] = [
      {
        amount: 1,
        assetName: '',
      },
    ];

    try {
      this.minting = true;
      const txId = await this.cardanoDappService.mintTokens(
        this.policy,
        tokens,
        metadata,
        false
      );

      this.reloadTokens(this.policy.policyId);
      this.instructionsForm.reset();
      this.dialog.open(RoyaltiesCip27MintSuccessComponent, {
        width: '600px',
        maxWidth: '90vw',
        data: { txId },
        closeOnNavigation: true,
      });
    } catch (error) {
      this.errorService.handleError(error);
    } finally {
      this.minting = false;
    }
  }
}
