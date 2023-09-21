import { ClipboardModule } from '@angular/cdk/clipboard';
import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BackendApiModule } from 'src/cardano-tools-client';
import { DbsyncApiModule } from 'src/dbsync-client';
import { MaxValidatorDirective } from 'src/max-validator.directive';
import { BASE_PATH as BACKEND_BASE_PATH } from './../cardano-tools-client/variables';
import { BASE_PATH as DBSYNC_BASE_PATH } from './../dbsync-client/variables';
import { MaxBytesValidatorDirective } from './../max-bytes-validator.directive';
import { MinValidatorDirective } from './../min-validator.directive';
import { AccountKeyComponent } from './account-key/account-key.component';
import { AdaPipe } from './ada.pipe';
import { AjaxInterceptor } from './ajax.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BurnTokensComponent } from './burn-tokens/burn-tokens.component';
import { BurnComponent } from './burn/burn.component';
import { ChiplistComponent } from './chiplist/chiplist.component';
import { ContactComponent } from './contact/contact.component';
import { EuroPoolComponent } from './euro-pool/euro-pool.component';
import { FooterComponent } from './footer/footer.component';
import { FundAccountComponent } from './fund-account/fund-account.component';
import { HexToStringPipe } from './hex-to-string.pipe';
import { ImprintComponent } from './imprint/imprint.component';
import { JsonFormatPipe } from './json-format.pipe';
import { LatestTokensDetailComponent } from './latest-tokens-detail/latest-tokens-detail.component';
import { LatestTokensMiniComponent } from './latest-tokens-mini/latest-tokens-mini.component';
import { LatestTokensComponent } from './latest-tokens/latest-tokens.component';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { MintFormAdvancedComponent } from './mint-form-advanced/mint-form-advanced.component';
import { MintFormComponent } from './mint-form/mint-form.component';
import { MintOnDemandFormComponent } from './mint-on-demand-form/mint-on-demand-form.component';
import { MintOnDemandInstructionsComponent } from './mint-on-demand-instructions/mint-on-demand-instructions.component';
import { MintOnDemandComponent } from './mint-on-demand/mint-on-demand.component';
import { MintPolicyFormComponent } from './mint-policy-form/mint-policy-form.component';
import { MintReviewAndSubmitComponent } from './mint-review-and-submit/mint-review-and-submit.component';
import { MintSuccessComponent } from './mint-success/mint-success.component';
import { MintTokenMiniComponent } from './mint-token-mini/mint-token-mini.component';
import { MintComponent } from './mint/mint.component';
import { MyTokensComponent } from './my-tokens/my-tokens.component';
import { NavComponent } from './nav/nav.component';
import { PolicySelectorComponent } from './policy-selector/policy-selector.component';
import { RegisterTokenSuccessComponent } from './register-token-success/register-token-success.component';
import { RegisterTokenComponent } from './register-token/register-token.component';
import { RoyaltiesCip27MintSuccessComponent } from './royalties-cip27-mint-success/royalties-cip27-mint-success.component';
import { RoyaltiesCip27MintComponent } from './royalties-cip27-mint/royalties-cip27-mint.component';
import { SlotPipe } from './slot.pipe';
import { StakeRewardsComponent } from './stake-rewards/stake-rewards.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { TokenDetailsComponent } from './token-details/token-details.component';
import { WalletStatementComponent } from './wallet-statement/wallet-statement.component';
import { LocaleInitializerService } from './locale-initializer.service';
import { DatePipe } from '@angular/common';

export function initApp(localeInitializerService: LocaleInitializerService) {
  return () => localeInitializerService.initialize();
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    MintComponent,
    MintFormComponent,
    ChiplistComponent,
    LoadingOverlayComponent,
    FundAccountComponent,
    MinValidatorDirective,
    MaxValidatorDirective,
    MaxBytesValidatorDirective,
    MintReviewAndSubmitComponent,
    MintTokenMiniComponent,
    MintSuccessComponent,
    FooterComponent,
    TermsOfServiceComponent,
    ContactComponent,
    ImprintComponent,
    AccountKeyComponent,
    RegisterTokenComponent,
    LatestTokensComponent,
    LatestTokensMiniComponent,
    LatestTokensDetailComponent,
    MintFormAdvancedComponent,
    RegisterTokenSuccessComponent,
    MyTokensComponent,
    EuroPoolComponent,
    BurnComponent,
    TokenDetailsComponent,
    MintPolicyFormComponent,
    PolicySelectorComponent,
    RoyaltiesCip27MintComponent,
    RoyaltiesCip27MintSuccessComponent,
    BurnTokensComponent,
    StakeRewardsComponent,
    MintOnDemandComponent,
    MintOnDemandFormComponent,
    MintOnDemandInstructionsComponent,
    WalletStatementComponent,
    AdaPipe,
    SlotPipe,
    HexToStringPipe,
    JsonFormatPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    HttpClientModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    FormsModule,
    BackendApiModule,
    DbsyncApiModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    OverlayModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    MatExpansionModule,
    MatCheckboxModule,
    ClipboardModule,
    MatDialogModule,
    InfiniteScrollModule,
    MatTabsModule,
    MatSnackBarModule,
    MatSortModule,
    MatSlideToggleModule,
  ],
  providers: [
    AjaxInterceptor,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: AjaxInterceptor,
      multi: true,
    },
    {
      provide: BACKEND_BASE_PATH,
      useValue: '.',
    },
    {
      provide: DBSYNC_BASE_PATH,
      useValue: '.',
    },
    {
      provide: LOCALE_ID,
      useValue: navigator.language,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [LocaleInitializerService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
