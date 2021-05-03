import { AccountKeyComponent } from './../account-key/account-key.component';
import { NgModel } from '@angular/forms';
import { AjaxInterceptor } from './../ajax.interceptor';
import { MintTransaction } from './../../cardano-tools-client/model/mintTransaction';
import { MintOrderSubmission } from 'src/cardano-tools-client/model/mintOrderSubmission';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnInit, ViewChild, EventEmitter, Optional } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { RestInterfaceService, TransferAccount } from 'src/cardano-tools-client';
import { LocalStorageService } from '../local-storage.service';
import { F } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('tokenCountInput') tokenCountInput!: NgModel;

  account!: TransferAccount;
  mintOrderSubmission!: MintOrderSubmission;
  mintTransaction!: MintTransaction;
  loading = false;

  initializeValues() {
    this.account = { key: "", address: "", balance: 0, fundingAddresses: [] };
    this.mintOrderSubmission = { tokens: [], targetAddress: "", tip: true };
    this.mintTransaction = {
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
  }

  constructor(private api: RestInterfaceService, private localStorageService: LocalStorageService, private ajaxInterceptor: AjaxInterceptor, private activatedRoute: ActivatedRoute) {

    this.activatedRoute.queryParams.subscribe(params => {
      let accountKey = params['accountKey'];
      if (accountKey) {
        localStorageService.storeAccountKey(accountKey)
        this.updateAccount()
      }
    });

    this.initializeValues()
    this.updateAccount();
    ajaxInterceptor.ajaxStatusChanged$.subscribe(ajaxStatus => this.loading = ajaxStatus)
  }

  ngOnInit(): void {
    this.addToken();
  }

  ngAfterViewInit() {
    this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
      if (event.previouslySelectedIndex == 0 && this.account.key) {
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

      let balanceChanged = account.balance != this.account.balance || account.key != this.account.key
      let targetAddressChanged = this.mintOrderSubmission.targetAddress != account.fundingAddresses[0];

      this.account = account
      this.mintOrderSubmission.targetAddress = account.fundingAddresses[0];

      if (balanceChanged || this.mintTransaction.fee == 0 || targetAddressChanged) {
        this.updateMintTransaction();
      }
    })
  }

  updateMintTransaction() {
    this.api.buildMintTransaction(this.mintOrderSubmission, this.account.key).subscribe(mintTransaction => {
      this.mintTransaction = mintTransaction;
    })
  }

  mintSuccess() {
    this.stepper.selectedIndex = 3
    this.stepper.steps.forEach(s => s.editable = false)
  }

  restart() {
    this.stepper.steps.forEach(s => s.editable = true)
    this.stepper.steps.forEach(s => s.completed = false)
    this.stepper.selectedIndex = 0

    this.localStorageService.clearAccountKey()
    this.initializeValues()
    this.updateAccount();
    this.addToken()
  }

}
