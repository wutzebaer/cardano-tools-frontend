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
import { NgForm, NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account.service';
import { AjaxInterceptor } from 'src/app/ajax.interceptor';
import { MintFormAdvancedComponent } from 'src/app/mint-form-advanced/mint-form-advanced.component';
import {
  MetaValue,
  MintFormComponent,
} from 'src/app/mint-form/mint-form.component';
import { MintPolicyFormComponent } from 'src/app/mint-policy-form/mint-policy-form.component';
import {
  AccountPrivate,
  MintOrderSubmission,
  PolicyPrivate,
  Transaction,
} from 'src/cardano-tools-client';
import { RestHandlerService, TokenListItem } from 'src/dbsync-client';
import { CardanoDappService } from '../cardano-dapp.service';
import { TokenEnhancerService } from '../token-enhancer.service';
import { WalletConnectService } from '../wallet-connect.service';
import { MintRestInterfaceService } from './../../cardano-tools-client/api/mintRestInterface.service';
import { MintSuccessPopupComponent } from '../mint-success-popup/mint-success-popup.component';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss'],
})
export class MintComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tokenCountInput') tokenCountInput!: NgModel;
  @ViewChildren('mintForm') components!: QueryList<MintFormComponent>;
  @ViewChild('nftForm') nftForm!: NgForm;

  policies?: PolicyPrivate[];
  mintOrderSubmission!: MintOrderSubmission;
  loading = false;
  minting = false;
  tokens: TokenListItem[] = [];

  policiesSubscription: Subscription;

  initializeValues() {
    this.mintOrderSubmission = {
      tokens: [],
      targetAddress: '',
      pin: true,
      policyId: '',
      metaData: '{}',
    };
  }

  constructor(
    ajaxInterceptor: AjaxInterceptor,
    private dialog: MatDialog,
    private accountService: AccountService,
    private tokenApi: RestHandlerService,
    private cardanoDappService: CardanoDappService,
    private router: Router,
    private errorService: ErrorService
  ) {
    this.initializeValues();

    this.policiesSubscription = accountService.policies.subscribe(
      (policies) => {
        this.policies = policies;
      }
    );

    ajaxInterceptor.ajaxStatusChanged$.subscribe(
      (ajaxStatus) => (this.loading = ajaxStatus)
    );
  }

  ngOnDestroy(): void {
    this.policiesSubscription.unsubscribe();
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

  ngAfterViewInit() {}

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

  restart() {
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

  async mint() {
    // check valid
    if (!this.nftForm.valid) {
      return;
    }

    // find policy
    const policy = this.policies?.find(
      (p) => p.policyId === this.mintOrderSubmission.policyId
    );
    if (!policy) {
      return;
    }

    // mint
    try {
      this.minting = true;
      const txHash = await this.cardanoDappService.mintTokens(
        policy,
        this.mintOrderSubmission.tokens,
        this.buildMetadata()
      );

      this.dialog.open(MintSuccessPopupComponent, {
        width: '600px',
        maxWidth: '90vw',
        data: { txHash: txHash },
        closeOnNavigation: true,
      });

      this.restart();
    } catch (error) {
      this.errorService.handleError(error);
    } finally {
      this.minting = false;
    }
  }
}
