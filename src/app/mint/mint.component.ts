import { Subscription } from 'rxjs';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { AccountService } from 'src/app/account.service';
import { AjaxInterceptor } from 'src/app/ajax.interceptor';
import { MintFormAdvancedComponent } from 'src/app/mint-form-advanced/mint-form-advanced.component';
import { MetaValue, MintFormComponent } from 'src/app/mint-form/mint-form.component';
import { MintPolicyFormComponent } from 'src/app/mint-policy-form/mint-policy-form.component';
import { AccountPrivate, MintOrderSubmission, MintRestInterfaceService, TokenRestInterfaceService, Transaction } from 'src/cardano-tools-client';
import { TokenDataWithMetadata, TokenEnhancerService } from '../token-enhancer.service';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('tokenCountInput') tokenCountInput!: NgModel;
  @ViewChildren('mintForm') components!: QueryList<MintFormComponent>;

  account?: AccountPrivate;
  mintOrderSubmission!: MintOrderSubmission;
  mintTransaction!: Transaction;
  loading = false;
  tokens: TokenDataWithMetadata[] = [];
  accountSubscription: Subscription

  initializeValues() {
    this.mintOrderSubmission = {
      tokens: [],
      targetAddress: '',
      tip: true,
      policyId: '',
      metaData: '{}'
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

  constructor(
    private api: MintRestInterfaceService,
    ajaxInterceptor: AjaxInterceptor,
    private dialog: MatDialog,
    private accountService: AccountService,
    private tokenApi: TokenRestInterfaceService,
    private tokenEnhancerService: TokenEnhancerService,
  ) {

    this.initializeValues();

    this.accountSubscription = accountService.account.subscribe(account => {
      let balanceChanged = !this.account || account.address.balance != this.account.address.balance || account.key != this.account.key;
      this.account = account;
      if (account.fundingAddresses.indexOf(this.mintOrderSubmission.targetAddress) === -1) {
        this.mintOrderSubmission.targetAddress = account.fundingAddresses[0];
      }
      if (this.stepper?.selectedIndex > 0 && balanceChanged) {
        this.updateMintTransaction();
      }
    });

    ajaxInterceptor.ajaxStatusChanged$.subscribe(ajaxStatus => this.loading = ajaxStatus)

  }

    ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }

  changePolicyId(policyId: string) {
    const metaData: any = JSON.parse(this.mintOrderSubmission.metaData!);
    if (metaData['721']) {
      delete metaData['721'][this.mintOrderSubmission.policyId];
      this.mintOrderSubmission.metaData = JSON.stringify(metaData);
    }
    this.tokenApi.policyTokens(policyId).subscribe({ next: tokens => this.tokens = this.tokenEnhancerService.enhanceTokens(tokens) });
    this.mintOrderSubmission.policyId = policyId;
  }

  ngAfterViewInit() {
    this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
      if (event.previouslySelectedIndex == 0) {
        this.updateMintTransaction()
      }
    });
  }

  updateMintTransaction() {
    const metaData = this.buildMetadata();
    let metaDataString = JSON.stringify(metaData, null, 3);
    this.mintOrderSubmission.metaData = metaDataString;

    this.api.buildMintTransaction(this.mintOrderSubmission, this.account!.key).subscribe(mintTransaction => {
      this.mintTransaction = mintTransaction;
    })
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
  }



  spreadMetaValue($event: MetaValue) {
    this.components.forEach(c => {
      c.metaData[$event.key] = $event.value
      c.updatePreview()
    })
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
    this.accountService.updateAccount();
  }

  mintSuccess() {
    this.stepper.selectedIndex = 3
    this.stepper.steps.forEach(s => s.editable = false)
  }

  restart() {
    this.stepper.steps.forEach(s => s.editable = true)
    this.stepper.steps.forEach(s => s.completed = false)
    this.stepper.selectedIndex = 0

    const oldPolicyId = this.mintOrderSubmission.policyId;
    this.initializeValues()
    this.addToken()
    this.updateAccount();
    this.mintOrderSubmission.policyId = oldPolicyId;
  }

  buildMetadata() {
    const metaData: any = JSON.parse(this.mintOrderSubmission.metaData!);
    metaData['721'] = metaData['721'] || {};
    metaData['721'][this.mintOrderSubmission.policyId] = {}
    this.components.forEach(c => {
      metaData['721'][this.mintOrderSubmission.policyId][c.token.assetName!] = c.metaData;
    });
    return metaData;
  }

  advanced() {
    const metaData = this.buildMetadata();
    let metaDataString = JSON.stringify(metaData, null, 3);

    const dialogRef = this.dialog.open(MintFormAdvancedComponent, {
      data: {
        metaDataJson: metaDataString,
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
        let token = { assetName: key, amount: 1, metaData: tokenDatas[key] ?? {} };
        this.mintOrderSubmission.tokens.push(token);
      }
      this.mintOrderSubmission.metaData = result;
    });
  }

  openPoolPmPreview() {
    console.log(encodeURIComponent(encodeURIComponent(JSON.stringify(this.buildMetadata()))));
    window.open('https://pool.pm/test/metadata?metadata=' + encodeURIComponent(encodeURIComponent(JSON.stringify(this.buildMetadata()))));
  }

}
