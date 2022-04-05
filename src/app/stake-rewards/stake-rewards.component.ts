import { Submission } from './../fund-account/fund-account.component';
import { StakeRewardRestInterfaceService } from './../../cardano-tools-client/api/stakeRewardRestInterface.service';
import { Subscription } from 'rxjs';
import { AccountService } from './../account.service';
import { Transaction, MintOrderSubmission, AccountPrivate, TokenData } from 'src/cardano-tools-client';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CardanoUtils } from '../cardano-utils';
import { EpochStakePosition } from './../../cardano-tools-client/model/epochStakePosition';
import { JsonpClientBackend } from '@angular/common/http';

@Component({
  selector: 'app-stake-rewards',
  templateUrl: './stake-rewards.component.html',
  styleUrls: ['./stake-rewards.component.scss']
})
export class StakeRewardsComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<EpochStakePosition> = new MatTableDataSource();
  displayedColumns = ['stakeAddress', 'rewardAddress', 'amount', 'share', 'rewards']
  poolHash: string = '';
  epoch: number = CardanoUtils.currentEpoch();
  epochStakes: EpochStakePosition[] = [];
  totalStake = 0;
  rewards: { [key: string]: { [key: string]: number; }; } = {};
  accountSubscription: Subscription
  account?: AccountPrivate;
  minStakeAda = 1000

  mintOrderSubmission: Submission = {
    tip: true,
    targetAddress: ''
  };

  mintTransaction: Transaction = {
    rawData: "",
    txId: "",
    fee: 0,
    outputs: "",
    inputs: "",
    metaDataJson: "",
    minOutput: 0,
    txSize: 0,
    signedData: ""
  };

  constructor(private stakeRewardRestInterfaceService: StakeRewardRestInterfaceService, private accountService: AccountService) {
    this.accountSubscription = accountService.account.subscribe(account => {
      this.account = account
      if(this.mintTransaction.minOutput == 0)
      this.refresh();
    });
  }

  ngOnInit(): void {
    this.poolHash = 'pool1uyhmy8mxfly2hgmcgkpedsw3juszrwl6au7p3t2d8zmgwaved6q'
    this.epoch = 196;
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }

  refresh() {
    this.stakeRewardRestInterfaceService.getEpochStakes(this.account!.key, this.poolHash, this.epoch, this.mintOrderSubmission.tip, this.minStakeAda * 1_000_000).subscribe(result => {
      this.epochStakes = result
      this.totalStake = result.map(r => r.amount).reduce((p, c) => p + c, 0)
      this.dataSource.data = result;
      this.dataSource.sort = this.sort;
      //this.buildRewards();
      console.log(this.mintTransaction.minOutput)
      this.buildTransaction();
    });
  }


  buildTransaction() {
    console.trace()
    this.stakeRewardRestInterfaceService.buildTransaction(this.epochStakes, this.account!.key).subscribe(mintTransaction => {
      this.mintTransaction = mintTransaction;
    })
  }

  typeSafeOutputs(ident: any): { [key: string]: number; } {
    return ident;
  }

}
