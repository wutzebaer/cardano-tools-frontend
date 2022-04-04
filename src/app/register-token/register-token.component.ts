import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenDataWithMetadata, TokenEnhancerService } from './../token-enhancer.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AccountService } from 'src/app/account.service';
import { AccountPrivate,  RegistrationRestInterfaceService, TokenData, TokenRestInterfaceService } from 'src/cardano-tools-client';
import { RegisterTokenSuccessComponent } from './../register-token-success/register-token-success.component';

@Component({
  selector: 'app-register-token',
  templateUrl: './register-token.component.html',
  styleUrls: ['./register-token.component.scss']
})
export class RegisterTokenComponent implements OnInit, OnDestroy {

  account!: AccountPrivate;
  tokens: TokenDataWithMetadata[] = [];
  selectedToken?: TokenDataWithMetadata;
  accountSubscription: Subscription

  registrationMetadata: any = {
    assetName: "",
    policyId: "",
    policy: "",
    policySkey: "",
    name: "",
    description: "",
    ticker: "",
    url: "",
    decimals: 0
  }

  uploadProgress: number = 0;

  file!: Blob | null;
  url!: SafeUrl | null;

  constructor(private api: RegistrationRestInterfaceService, private sanitizer: DomSanitizer, public dialog: MatDialog, private accountService: AccountService, private tokenApi: TokenRestInterfaceService, private tokenEnhancerService: TokenEnhancerService, private httpClient: HttpClient) {
    this.accountSubscription = accountService.account.subscribe(account => {
      this.account = account;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }

  changePolicyId(policyId: string) {
    const policy = this.account.policies.find(p => p.policyId === policyId)
    this.registrationMetadata.policyId = policy!.policyId;
    this.registrationMetadata.policy = policy!.policy;
    this.registrationMetadata.policySkey = policy!.address.skey;
    this.tokenApi.policyTokens(policy!.policyId).subscribe({ next: tokens => this.tokens = this.tokenEnhancerService.enhanceTokens(tokens) });

  }

  tokenChanged() {
    this.registrationMetadata.assetName = this.selectedToken?.name!;
    this.registrationMetadata.name = this.selectedToken?.metaData?.name;

    if (this.selectedToken?.metaData?.image) {
      const url = this.tokenEnhancerService.toSimpleIpfsUrl(this.selectedToken?.metaData?.image);
      this.httpClient.get(url, { responseType: 'blob' }).subscribe(
        results => {
          this.appendFile(results);
        }
      );
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

    if (file?.size as number > 52428800) {
      alert("Max 50mb");
      return;
    }

    this.file = file
    const reader = new FileReader();
    reader.readAsDataURL(this.file as Blob);
    reader.onload = _event => {
      this.url = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
    };

  }

  generateRegistration() {
    this.api.generateTokenRegistrationForm(JSON.stringify(this.registrationMetadata), this.file as Blob).subscribe(tokenRegistration => {

      this.dialog.open(RegisterTokenSuccessComponent, {
        width: '600px',
        maxWidth: '90vw',
        data: { tokenRegistration: tokenRegistration },
        closeOnNavigation: true
      });


    })
  }


}
