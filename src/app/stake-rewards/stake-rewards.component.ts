import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RoyaltiesCip27MintSuccessComponent } from './../royalties-cip27-mint-success/royalties-cip27-mint-success.component';
import { Submission } from './../fund-account/fund-account.component';
import { StakeRewardRestInterfaceService } from './../../cardano-tools-client/api/stakeRewardRestInterface.service';
import { Subscription } from 'rxjs';
import { AccountService } from './../account.service';
import { Transaction, MintOrderSubmission, AccountPrivate, TokenData, MintRestInterfaceService } from 'src/cardano-tools-client';
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

  @ViewChild('rewardForm') rewardForm?: NgForm;
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

    this.accountSubscription = accountService.account.subscribe(account => {
      this.account = account
      console.log(this.rewardForm?.valid)
      if (this.oldFunds !== account.address.balance && this.rewardForm?.valid) {
        this.oldFunds = account.address.balance;
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
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }

  refresh() {
    this.oldFunds = undefined;
    this.accountService.updateAccount();
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
