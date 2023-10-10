import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { CardanoUtils } from '../cardano-utils';
import { StakeRewardRestInterfaceService } from './../../cardano-tools-client/api/stakeRewardRestInterface.service';
import { AccountService } from './../account.service';
import { Submission } from './../fund-account/fund-account.component';
import { RoyaltiesCip27MintSuccessComponent } from './../royalties-cip27-mint-success/royalties-cip27-mint-success.component';
import {
  AccountPrivate,
  EpochStakesRequest,
  MintRestInterfaceService,
  StakeRewardPosition,
  Transaction,
} from 'src/cardano-tools-client';
import { PoolInfo, RestHandlerService } from 'src/dbsync-client';

@Component({
  selector: 'app-stake-rewards',
  templateUrl: './stake-rewards.component.html',
  styleUrls: ['./stake-rewards.component.scss'],
})
export class StakeRewardsComponent implements OnInit, OnDestroy {
  @ViewChild('rewardForm') rewardForm!: NgForm;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<StakeRewardPosition> =
    new MatTableDataSource();
  displayedColumns = [
    'stakeAddress',
    'rewardAddress',
    'amount',
    'share',
    'rewards',
    'exclude',
  ];
  poolHash: string = '';
  epoch: number = CardanoUtils.currentEpoch();
  epochStakes: StakeRewardPosition[] = [];
  rewards: { [key: string]: { [key: string]: number } } = {};
  accountSubscription: Subscription;
  fundsSubscription: Subscription;
  account?: AccountPrivate;
  minStakeAda = 1000;
  oldFunds?: number;
  poolList?: PoolInfo[];
  filteredOptions!: Subject<PoolInfo[]>;
  message = '';
  excludedStakersCheckboxes: { [key: string]: boolean } = {};
  isValid = true;

  mintOrderSubmission: Submission = {
    tip: true,
    pin: false,
    targetAddress: '',
  };

  mintTransaction: Transaction = {
    rawData: '',
    txId: '',
    fee: 0,
    outputs: '',
    inputs: '',
    metaDataJson: '',
    minOutput: 0,
    txSize: 0,
    signedData: '',
  };

  constructor(
    restHandlerService: RestHandlerService,
    private accountService: AccountService,
    private stakeRewardRestInterfaceService: StakeRewardRestInterfaceService,
    private mintRestInterfaceService: MintRestInterfaceService,
    public dialog: MatDialog,
  ) {
    restHandlerService
      .getPoolList()
      .subscribe((list) => (this.poolList = list));

    this.accountSubscription = accountService.account.subscribe((account) => {
      this.account = account;
    });

    this.fundsSubscription = accountService.funds.subscribe((funds) => {
      if (this.oldFunds !== funds && this.rewardForm?.valid) {
        this.oldFunds = funds;
        let excludedStakers: string[] = Object.entries(
          this.excludedStakersCheckboxes,
        )
          .filter((entry) => entry[1])
          .map((entry) => entry[0]);
        let request: EpochStakesRequest = {
          tip: this.mintOrderSubmission.tip,
          minStake: this.minStakeAda * 1_000_000,
          message: this.message,
          excludedStakers: excludedStakers,
        };
        this.stakeRewardRestInterfaceService
          .getEpochStakes(this.account!.key, this.poolHash, this.epoch, request)
          .subscribe((result) => {
            this.epochStakes = result;
            this.dataSource.data = result;
            this.dataSource.sort = this.sort;
            this.buildTransaction();
          });
      }
    });
  }

  ngOnInit(): void {
    this.filteredOptions = new BehaviorSubject([] as PoolInfo[]);
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
    this.fundsSubscription.unsubscribe();
  }

  invalidate() {
    this.isValid = false;
  }

  refresh() {
    this.oldFunds = undefined;
    this.accountService.updateFunds();
  }

  filter() {
    if (!this.poolList) {
      return;
    }
    const filterValue = this.poolHash.toLowerCase();
    this.filteredOptions.next(
      this.poolList.filter((option) =>
        option.tickerName.toLowerCase().includes(filterValue),
      ),
    );
  }

  buildTransaction() {
    this.stakeRewardRestInterfaceService
      .buildTransaction(this.account!.key, this.message, this.epochStakes)
      .subscribe((mintTransaction) => {
        this.mintTransaction = mintTransaction;
        this.isValid = true;
      });
  }

  typeSafeOutputs(ident: any): { [key: string]: number } {
    return ident;
  }

  submit() {
    if (confirm('Do you really want to submit this transaction?')) {
      this.mintRestInterfaceService
        .submitMintTransaction(this.account!.key, this.mintTransaction)
        .subscribe({
          complete: () => {
            this.dialog.open(RoyaltiesCip27MintSuccessComponent, {
              width: '600px',
              maxWidth: '90vw',
              data: { transaction: this.mintTransaction },
              closeOnNavigation: true,
            });
          },
        });
    }
  }
}
