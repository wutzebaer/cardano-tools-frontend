import { MintTransaction } from './../../cardano-tools-client/model/mintTransaction';
import { MintOrderSubmission } from 'src/cardano-tools-client/model/mintOrderSubmission';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { RestInterfaceService, TransferAccount } from 'src/cardano-tools-client';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') stepper!: MatStepper;
  accountUpdate = new EventEmitter<void>();

  account: TransferAccount = { key: "", address: "", balance: 0, fundingAddresses: [] };
  mintOrderSubmission: MintOrderSubmission = { tokens: [], targetAddress: "", tip: true };
  mintTransaction: MintTransaction = {
    rawData: "",
    txId: "",
    fee: 0,
    policyId: "",
    outputs: "",
    inputs: "",
    metaDataJson: "",
    policy: "",
    mintOrderSubmission: this.mintOrderSubmission,
    minOutput: 1000000
  }

  constructor(private api: RestInterfaceService, private localStorageService: LocalStorageService) {
    this.updateAccount();
  }

  ngOnInit(): void {
    this.addToken();
  }

  ngAfterViewInit() {
    this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
      if (event.previouslySelectedIndex == 0) {
        this.updateMintTransaction()
      }
    });
  }

  addToken() {
    let token = { assetName: "", amount: 1, metaData: {} };
    this.mintOrderSubmission.tokens.push(token);
    return token
  }

  removeToken(index: number) {
    this.mintOrderSubmission.tokens.splice(index, 1);
  }

  addFiles(event: any) {
    for (let index in Object.values(event.target.files)) {
      let file = event.target.files.item(index);
      setTimeout(() => {
        let token = { assetName: "", amount: 1, metaData: {} };
        let hack = token as any
        hack.file = file
        this.mintOrderSubmission.tokens.push(token);
      });
    }
    event.target.value = '';
  }


  updateAccount() {
    let accountKey = this.localStorageService.retrieveAccountKey();
    let accountObservable;
    if (!accountKey) { accountObservable = this.api.createAccount(); }
    else { accountObservable = this.api.getAccount(accountKey); }
    accountObservable.subscribe(account => {
      this.localStorageService.storeAccountKey(account.key)
      let balanceChanged = account.balance != this.account.balance
      this.account = account
      this.mintOrderSubmission.targetAddress = account.fundingAddresses[0];

      if (balanceChanged || this.mintTransaction.fee == 0) {
        //this.updateMintTransaction();
      }
    })
  }

  updateMintTransaction() {
    this.api.buildMintTransaction(this.mintOrderSubmission, this.account.key).subscribe(mintTransaction => {
      this.mintTransaction = mintTransaction;
    })
  }

}
