import { CardanoUtils } from './../cardano-utils';
import { MetaValue } from 'src/app/mint-form/mint-form.component';
import { MintFormAdvancedComponent } from 'src/app/mint-form-advanced/mint-form-advanced.component';
import { LocalStorageService } from 'src/app/local-storage.service';
import { AccountService } from 'src/app/account.service';
import { AjaxInterceptor } from 'src/app/ajax.interceptor';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { interval } from 'rxjs';
import { Account, MintOrderSubmission, Policy, RestInterfaceService, Transaction } from 'src/cardano-tools-client';
import { MintFormComponent } from 'src/app/mint-form/mint-form.component';
import { MintPolicyFormComponent } from 'src/app/mint-policy-form/mint-policy-form.component';



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
  mintTransaction!: Transaction;
  loading = false;

  initializeValues() {
    this.mintOrderSubmission = {
      tokens: [],
      targetAddress: '',
      tip: true,
      policyId: '',
    };
    this.mintTransaction = {
      rawData: "",
      txId: "",
      fee: 0,
      outputs: "",
      inputs: "",
      metaDataJson: "",
      mintOrderSubmission: this.mintOrderSubmission,
      minOutput: 1000000,
      txSize: 0,
      signedData: ""
    }
  }

  constructor(private api: RestInterfaceService, ajaxInterceptor: AjaxInterceptor, private dialog: MatDialog, private accountService: AccountService, private localStorageService: LocalStorageService) {

    this.initializeValues();

    accountService.account.subscribe(account => {

      if (!this.account) {

        this.account = account;
        return;

      } else {

        let balanceChanged = account.address.balance != this.account.address.balance || account.key != this.account.key;
        this.account = account;
        if (account.fundingAddresses.indexOf(this.mintOrderSubmission.targetAddress) === -1) {
          this.mintOrderSubmission.targetAddress = account.fundingAddresses[0];
        }
        if (this.stepper.selectedIndex > 0 && balanceChanged) {
          this.updateMintTransaction();
        }

      }
    });

    ajaxInterceptor.ajaxStatusChanged$.subscribe(ajaxStatus => this.loading = ajaxStatus)

  }

  changePolicyId(policyId: string) {
    this.mintOrderSubmission.policyId = policyId;
    this.updateMintTransaction();
  }

  discardPolicy() {
    const dialogRef = this.dialog.open(MintPolicyFormComponent, {
      width: '800px',
      maxWidth: '90vw',
      closeOnNavigation: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
    });
  }

  ngOnInit(): void {
    this.addToken();
    interval(1000).subscribe(() => {
    });
  }

  ngAfterViewInit() {
    this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
      if (event.previouslySelectedIndex == 0) {
        this.updateMintTransaction()
      }
    });
  }

  spreadMetaValue($event: MetaValue) {
    this.components.forEach(c => {
      c.metaData[$event.key] = $event.value
      c.updatePreview()
    })
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

  getTimeLeft(policyId: string): number {
    const policy: Policy = this.account?.policies.find(p => p.policyId === policyId)!;
    return CardanoUtils.getTimeLeft(policy);
  }

  getTimeLeftString(policyId: string): string {
    const policy: Policy = this.account?.policies.find(p => p.policyId === policyId)!;
    return CardanoUtils.getTimeLeftString(policy);
  }

  updateAccount() {
    this.accountService.updateAccount();
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

  advanced() {
    this.components.forEach(c => c.serializeMetadata())
    this.api.buildMintTransaction(this.mintOrderSubmission, this.account.key).subscribe(mintTransaction => {
      this.mintTransaction = mintTransaction;

      let parsed = JSON.parse(this.mintTransaction.metaDataJson as string)
      let policyData = parsed["721"][this.mintOrderSubmission.policyId]
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

        this.mintOrderSubmission.tokens = [];
        const tokenDatas = newMetadata["721"]?.[this.mintOrderSubmission.policyId];
        for (const key in tokenDatas) {
          let token = { assetName: key, amount: 1, metaData: "{}" };
          token.metaData = JSON.stringify(tokenDatas[key] ?? {}, null, 3);
          this.mintOrderSubmission.tokens.push(token);
        }
        this.components.forEach(c => c.reloadMetadata())
      });

    })
  }

}
