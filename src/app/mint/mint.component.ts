import { MintFormComponent, MetaValue } from './../mint-form/mint-form.component';
import { MintFormAdvancedComponent } from './../mint-form-advanced/mint-form-advanced.component';
import { MintOrderSubmission } from 'src/cardano-tools-client/model/mintOrderSubmission';
import { AccountKeyComponent } from './../account-key/account-key.component';
import { NgModel } from '@angular/forms';
import { AjaxInterceptor } from './../ajax.interceptor';
import { MintTransaction } from './../../cardano-tools-client/model/mintTransaction';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnInit, ViewChild, EventEmitter, Optional, ViewChildren, QueryList } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { RestInterfaceService, Account } from 'src/cardano-tools-client';
import { LocalStorageService } from '../local-storage.service';
import { F } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JsonpClientBackend } from '@angular/common/http';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('tokenCountInput') tokenCountInput!: NgModel;
  @ViewChildren('mintForm') components!: QueryList<MintFormComponent>;


  account!: Account;
  mintOrderSubmission!: MintOrderSubmission;
  mintTransaction!: MintTransaction;
  loading = false;

  initializeValues() {
    this.account = {
      key: "",
      address: "",
      balance: 0,
      fundingAddresses: [],
      createdAt: new Date(),
      skey: "",
      vkey: "",
      lastUpdate: 0,
      policyId: "",
      policy: "{\"scripts\":[{\"slot\":0}]}",
      policyDueDate: new Date()
    };
    this.mintOrderSubmission = { tokens: [], targetAddress: "", tip: false };
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
      minOutput: 1000000,
      txSize: 0,
      signedData: ""
    }
  }

  constructor(private api: RestInterfaceService, private localStorageService: LocalStorageService, private ajaxInterceptor: AjaxInterceptor, private activatedRoute: ActivatedRoute, private dialog: MatDialog) {

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

  spreadMetaValue($event: MetaValue) {
    this.components.forEach(c => c.metaData[$event.key] = $event.value)
  }

  addToken() {
    let token = { assetName: "", amount: 1, metaData: "{}" };
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
        let token = { assetName: "", amount: 1, metaData: "{}" };
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

      this.account = account
      if (account.fundingAddresses.indexOf(this.mintOrderSubmission.targetAddress) === -1) {
        this.mintOrderSubmission.targetAddress = account.fundingAddresses[0];
      }

      if (balanceChanged || this.mintTransaction.fee == 0) {
        this.updateMintTransaction();
      }
    })
  }

  updateMintTransaction() {
    this.components.forEach(c => c.serializeMetadata())
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

    this.initializeValues()
    this.updateAccount();
    this.addToken()
  }

  getLockDate() {
    let policy = JSON.parse(this.account.policy);
    let slot = policy.scripts[0].slot
    return new Date((1596491091 + (slot - 4924800)) * 1000)
  }

  advanced() {
    this.components.forEach(c => c.serializeMetadata())
    this.api.buildMintTransaction(this.mintOrderSubmission, this.account.key).subscribe(mintTransaction => {
      this.mintTransaction = mintTransaction;

      let parsed = JSON.parse(this.mintTransaction.metaDataJson)
      let policyData = parsed["721"][this.account.policyId]
      Object.keys(policyData).map(function (key, index) {
        delete policyData[key]['policy']
      });
      let cleanMetaDataJson = JSON.stringify(parsed, null, 3)

      const dialogRef = this.dialog.open(MintFormAdvancedComponent, {
        data: {
          metaDataJson: cleanMetaDataJson,
        },
        width: '800px',
        maxWidth: '90vw',
        closeOnNavigation: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          return;
        }
        let newMetadata = JSON.parse(result)
        this.mintOrderSubmission.tokens.forEach(token => {
          token.metaData = JSON.stringify(newMetadata["721"]?.[this.account.policyId]?.[token.assetName] ?? {}, null, 3);
        })
        this.components.forEach(c => c.reloadMetadata())
      });

    })
  }

}
