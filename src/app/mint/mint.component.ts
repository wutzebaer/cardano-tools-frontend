import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { AccountService } from 'src/app/account.service';
import { AjaxInterceptor } from 'src/app/ajax.interceptor';
import { MintFormAdvancedComponent } from 'src/app/mint-form-advanced/mint-form-advanced.component';
import {
  MetaValue,
  MintFormComponent,
} from 'src/app/mint-form/mint-form.component';
import { MintPolicyFormComponent } from 'src/app/mint-policy-form/mint-policy-form.component';
import {
  TokenDataWithMetadata,
  TokenEnhancerService,
} from '../token-enhancer.service';
import {
  AccountPrivate,
  MintOrderSubmission,
  MintRestInterfaceService,
  Transaction,
} from 'src/cardano-tools-client';
import { RestHandlerService, TokenListItem } from 'src/dbsync-client';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss'],
})
export class MintComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('tokenCountInput') tokenCountInput!: NgModel;
  @ViewChildren('mintForm') components!: QueryList<MintFormComponent>;

  account?: AccountPrivate;
  funds?: number;
  fundingAddresses?: string[];
  mintOrderSubmission!: MintOrderSubmission;
  mintTransaction!: Transaction;
  loading = false;
  tokens: TokenListItem[] = [];

  accountSubscription: Subscription;
  fundsSubscription: Subscription;
  fundingAddressesSubscription: Subscription;

  initializeValues() {
    this.mintOrderSubmission = {
      tokens: [],
      targetAddress: '',
      pin: true,
      policyId: '',
      metaData: '{}',
    };
    this.mintTransaction = {
      rawData: '',
      txId: '',
      fee: 0,
      outputs: '',
      inputs: '',
      metaDataJson: '',
      mintOrderSubmission: this.mintOrderSubmission,
      minOutput: 1000000,
      txSize: 0,
      signedData: '',
    };
  }

  constructor(
    private api: MintRestInterfaceService,
    ajaxInterceptor: AjaxInterceptor,
    private dialog: MatDialog,
    private accountService: AccountService,
    private tokenApi: RestHandlerService,
    private tokenEnhancerService: TokenEnhancerService,
    private router: Router,
  ) {
    this.initializeValues();

    this.accountSubscription = accountService.account.subscribe((account) => {
      this.account = account;
    });

    this.fundingAddressesSubscription =
      accountService.fundingAddresses.subscribe((fundingAddresses) => {
        this.fundingAddresses = fundingAddresses;
        if (
          fundingAddresses.indexOf(this.mintOrderSubmission.targetAddress) ===
          -1
        ) {
          this.mintOrderSubmission.targetAddress = fundingAddresses[0];
        }
      });

    this.fundsSubscription = accountService.funds.subscribe((funds) => {
      let balanceChanged = funds != this.funds;
      this.funds = funds;
      if (this.stepper?.selectedIndex > 0 && balanceChanged) {
        this.updateMintTransaction();
      }
    });

    ajaxInterceptor.ajaxStatusChanged$.subscribe(
      (ajaxStatus) => (this.loading = ajaxStatus),
    );
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
    this.fundsSubscription.unsubscribe();
    this.fundingAddressesSubscription.unsubscribe();
  }

  changePolicyId(policyId: string) {
    const metaData: any = JSON.parse(this.mintOrderSubmission.metaData!);
    if (metaData['721']) {
      delete metaData['721'][this.mintOrderSubmission.policyId];
      this.mintOrderSubmission.metaData = JSON.stringify(metaData);
    }
    this.tokenApi
      .getTokenList(undefined, undefined, policyId)
      .subscribe({ next: (tokens) => (this.tokens = tokens) });
    this.mintOrderSubmission.policyId = policyId;
  }

  ngAfterViewInit() {
    this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
      if (event.previouslySelectedIndex == 0) {
        this.updateMintTransaction();
      }
    });
  }

  updateMintTransaction() {
    const metaData = this.buildMetadata();
    let metaDataString = JSON.stringify(metaData, null, 3);
    this.mintOrderSubmission.metaData = metaDataString;
    this.api
      .buildMintTransaction(this.account!.key, this.mintOrderSubmission)
      .subscribe((mintTransaction) => {
        this.mintTransaction = mintTransaction;
      });
  }

  discardPolicy() {
    const dialogRef = this.dialog.open(MintPolicyFormComponent, {
      width: '800px',
      maxWidth: '90vw',
      closeOnNavigation: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
    });
  }

  ngOnInit(): void {
    this.addToken();
  }

  spreadMetaValue($event: MetaValue) {
    let value = JSON.stringify($event.value);
    this.components.forEach((c) => {
      c.metaData[$event.key] = JSON.parse(value);
      c.updatePreview();
    });
  }

  addToken() {
    let token = { assetName: '', amount: 1 };
    this.mintOrderSubmission.tokens.push(token);
    return token;
  }

  removeToken(index: number) {
    this.mintOrderSubmission.tokens.splice(index, 1);
  }

  addFiles(event: any) {
    for (let index in Object.values(event.target.files)) {
      let file = event.target.files.item(index);
      setTimeout(() => {
        let token = { assetName: '', amount: 1 };
        let hack = token as any;
        hack.file = file;
        this.mintOrderSubmission.tokens.push(token);
      });
    }
    event.target.value = '';
  }

  updateFunds() {
    this.accountService.updateFunds();
  }

  mintSuccess() {
    this.stepper.selectedIndex = 3;
    this.stepper.steps.forEach((s) => (s.editable = false));
  }

  restart() {
    this.stepper.steps.forEach((s) => (s.editable = true));
    this.stepper.steps.forEach((s) => (s.completed = false));
    this.stepper.selectedIndex = 0;

    const oldPolicyId = this.mintOrderSubmission.policyId;
    this.initializeValues();
    this.addToken();
    this.updateFunds();
    this.mintOrderSubmission.policyId = oldPolicyId;
  }

  buildMetadata() {
    const metaData: any = JSON.parse(this.mintOrderSubmission.metaData!);
    metaData['721'] = metaData['721'] || {};
    metaData['721'][this.mintOrderSubmission.policyId] = {};
    this.components.forEach((c) => {
      metaData['721'][this.mintOrderSubmission.policyId][c.token.assetName!] =
        c.metaData;
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
      closeOnNavigation: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      let newMetadata = JSON.parse(result);

      this.mintOrderSubmission.tokens = [];
      const tokenDatas =
        newMetadata['721']?.[this.mintOrderSubmission.policyId];
      for (const key in tokenDatas) {
        let token = {
          assetName: key,
          amount: 1,
          metaData: tokenDatas[key] ?? {},
        };
        this.mintOrderSubmission.tokens.push(token);
      }
      this.mintOrderSubmission.metaData = result;
    });
  }

  mintOnDemand() {
    let route = '/mint-on-demand';
    this.router.navigate([route], {
      state: {
        mintMetadata:
          this.buildMetadata()['721'][this.mintOrderSubmission.policyId],
      },
    });
  }
}
