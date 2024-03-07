import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account.service';
import {
  AccountPrivate,
  PolicyPrivate,
  RegistrationRestInterfaceService,
} from 'src/cardano-tools-client';
import { RestHandlerService, TokenListItem } from 'src/dbsync-client';
import { RegisterTokenSuccessComponent } from './../register-token-success/register-token-success.component';
import {
  TokenDataWithMetadata,
  TokenEnhancerService,
} from './../token-enhancer.service';

@Component({
  selector: 'app-register-token',
  templateUrl: './register-token.component.html',
  styleUrls: ['./register-token.component.scss'],
})
export class RegisterTokenComponent implements OnInit, OnDestroy {
  account?: AccountPrivate;
  policies?: PolicyPrivate[];
  tokens: TokenListItem[] = [];
  selectedToken?: TokenListItem;
  accountSubscription: Subscription;
  policiesSubscription: Subscription;

  registrationMetadata: any = {
    assetName: '',
    policyId: '',
    policy: '',
    policySkey: '',
    name: '',
    description: '',
    ticker: '',
    url: '',
    decimals: 0,
  };

  uploadProgress: number = 0;

  file!: Blob | null;
  url!: SafeUrl | null;

  constructor(
    private api: RegistrationRestInterfaceService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private accountService: AccountService,
    private dbsyncApi: RestHandlerService,
    private tokenEnhancerService: TokenEnhancerService,
    private httpClient: HttpClient
  ) {
    this.accountSubscription = accountService.account.subscribe((account) => {
      this.account = account;
    });

    this.policiesSubscription = accountService.policies.subscribe(
      (policies) => {
        this.policies = policies;
      }
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
    this.policiesSubscription.unsubscribe();
  }

  changePolicyId(policyId: string) {
    const policy = this.policies?.find((p) => p.policyId === policyId)!;
    this.registrationMetadata.policyId = policy.policyId;
    this.registrationMetadata.policy = policy.policy;
    this.registrationMetadata.policySkey = policy.address.skey;
    this.dbsyncApi
      .getTokenList(undefined, undefined, policy.policyId)
      .subscribe({ next: (tokens) => (this.tokens = tokens) });
  }

  tokenChanged() {
    this.registrationMetadata.assetName = this.selectedToken?.maName;
    this.registrationMetadata.name = this.selectedToken?.name;

    if (this.selectedToken?.image) {
      const url = this.tokenEnhancerService.toIpfsUrl(this.selectedToken.image);
      this.httpClient
        .get(url, { responseType: 'blob' })
        .subscribe((results) => {
          this.appendFile(results);
        });
    }
  }

  dropFile(event: any) {
    event.preventDefault();
    this.appendFile(event.dataTransfer.files.item(0));
  }

  addFile(event: any) {
    this.appendFile(event.target.files.item(0));
    event.target.value = '';
  }

  appendFile(file: Blob) {
    if ((file?.size as number) > 52428800) {
      alert('Max 50mb');
      return;
    }

    this.file = file;
    const reader = new FileReader();
    reader.readAsDataURL(this.file as Blob);
    reader.onload = (_event) => {
      this.url = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
    };
  }

  generateRegistration() {
    this.api
      .generateTokenRegistrationForm(
        JSON.stringify(this.registrationMetadata),
        this.file as Blob
      )
      .subscribe((tokenRegistration) => {
        this.dialog.open(RegisterTokenSuccessComponent, {
          width: '600px',
          maxWidth: '90vw',
          data: { tokenRegistration: tokenRegistration },
          closeOnNavigation: true,
        });
      });
  }
}
