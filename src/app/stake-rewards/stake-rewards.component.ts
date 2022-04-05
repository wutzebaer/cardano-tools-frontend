import { PoolInfo } from './../../cardano-tools-client/model/poolInfo';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RoyaltiesCip27MintSuccessComponent } from './../royalties-cip27-mint-success/royalties-cip27-mint-success.component';
import { Submission } from './../fund-account/fund-account.component';
import { StakeRewardRestInterfaceService } from './../../cardano-tools-client/api/stakeRewardRestInterface.service';
import { Subscription, Observable, BehaviorSubject, Subject } from 'rxjs';
import { AccountService } from './../account.service';
import { Transaction, MintOrderSubmission, AccountPrivate, TokenData, MintRestInterfaceService } from 'src/cardano-tools-client';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CardanoUtils } from '../cardano-utils';
import { EpochStakePosition } from './../../cardano-tools-client/model/epochStakePosition';
import { JsonpClientBackend } from '@angular/common/http';
import { startWith, map, filter } from 'rxjs/operators';
import { I } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-stake-rewards',
  templateUrl: './stake-rewards.component.html',
  styleUrls: ['./stake-rewards.component.scss']
})
export class StakeRewardsComponent implements OnInit, OnDestroy {

  @ViewChild('rewardForm') rewardForm!: NgForm;
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
  oldFunds?: number;
  poolList?: PoolInfo[];
  filteredOptions!: Subject<PoolInfo[]>;
  excludePledge = true;
  message = '';

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

  constructor(
    private stakeRewardRestInterfaceService: StakeRewardRestInterfaceService,
    private accountService: AccountService,
    private mintRestInterfaceService: MintRestInterfaceService,
    public dialog: MatDialog) {

    stakeRewardRestInterfaceService.getPoolList().subscribe(list => this.poolList = list);

    this.accountSubscription = accountService.account.subscribe(account => {
      this.account = account
      if (this.oldFunds !== account.address.balance && this.rewardForm?.valid) {
        this.oldFunds = account.address.balance;
        this.stakeRewardRestInterfaceService.getEpochStakes(this.account!.key, this.poolHash, this.epoch, this.mintOrderSubmission.tip, this.minStakeAda * 1_000_000, this.excludePledge, this.message).subscribe(result => {
          this.epochStakes = result
          this.totalStake = result.map(r => r.amount).reduce((p, c) => p + c, 0)
          this.dataSource.data = result;
          this.dataSource.sort = this.sort;
          //this.buildRewards();
          console.log(this.mintTransaction.minOutput)
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
  }

  refresh() {
    this.oldFunds = undefined;
    this.accountService.updateAccount();
  }


  filter() {
    if (!this.poolList) {
      return;
    }
    const filterValue = this.poolHash.toLowerCase();
    this.filteredOptions.next(this.poolList.filter(option => option.ticker.toLowerCase().includes(filterValue)));
  }


  buildTransaction() {
    this.stakeRewardRestInterfaceService.buildTransaction(this.epochStakes, this.message, this.account!.key).subscribe(mintTransaction => {
      this.mintTransaction = mintTransaction;
    })
  }

  typeSafeOutputs(ident: any): { [key: string]: number; } {
    return ident;
  }

  submit() {
    if (confirm('Do you really want to submit this transaction?')) {
      this.mintRestInterfaceService.submitMintTransaction(this.mintTransaction, this.account!.key).subscribe({
        complete: () => {
          this.dialog.open(RoyaltiesCip27MintSuccessComponent, {
            width: '600px',
            maxWidth: '90vw',
            data: { transaction: this.mintTransaction },
            closeOnNavigation: true
          });
        }
      });
    }
  }

}
