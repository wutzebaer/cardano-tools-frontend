import { MinValidatorDirective } from './../min-validator.directive';
import { AjaxInterceptor } from './ajax.interceptor';
import { BASE_PATH } from './../cardano-tools-client/variables';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { ApiModule } from 'src/cardano-tools-client';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MintComponent } from './mint/mint.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MintFormComponent } from './mint-form/mint-form.component';
import { ChiplistComponent } from './chiplist/chiplist.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverlayModule } from '@angular/cdk/overlay';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { MatStepperModule } from '@angular/material/stepper';
import { FundAccountComponent } from './fund-account/fund-account.component';
import { MatTableModule } from '@angular/material/table';
import { MintReviewAndSubmitComponent } from './mint-review-and-submit/mint-review-and-submit.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MintTokenMiniComponent } from './mint-token-mini/mint-token-mini.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MintSuccessComponent } from './mint-success/mint-success.component';
import { FooterComponent } from './footer/footer.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ContactComponent } from './contact/contact.component';
import { ImprintComponent } from './imprint/imprint.component';
import { AccountKeyComponent } from './account-key/account-key.component';
import { RegisterTokenComponent } from './register-token/register-token.component';
import { LatestTokensComponent } from './latest-tokens/latest-tokens.component';
import { LatestTokensMiniComponent } from './latest-tokens-mini/latest-tokens-mini.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LatestTokensDetailComponent } from './latest-tokens-detail/latest-tokens-detail.component';
import { MintFormAdvancedComponent } from './mint-form-advanced/mint-form-advanced.component';
import { RegisterTokenSuccessComponent } from './register-token-success/register-token-success.component';
import { MyTokensComponent } from './my-tokens/my-tokens.component';
import { EuroPoolComponent } from './euro-pool/euro-pool.component';
import { BurnComponent } from './burn/burn.component';

@NgModule({
  declarations: [
    AppComponent, NavComponent, MintComponent, MintFormComponent, ChiplistComponent, LoadingOverlayComponent, FundAccountComponent, MinValidatorDirective, MintReviewAndSubmitComponent, MintTokenMiniComponent, MintSuccessComponent, FooterComponent, TermsOfServiceComponent, ContactComponent, ImprintComponent, AccountKeyComponent, RegisterTokenComponent, LatestTokensComponent, LatestTokensMiniComponent, LatestTokensDetailComponent, MintFormAdvancedComponent, RegisterTokenSuccessComponent, MyTokensComponent, EuroPoolComponent, BurnComponent
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
    ApiModule,
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
    InfiniteScrollModule
  ],
  providers: [
    AjaxInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: AjaxInterceptor,
      multi: true
    },
    {
      provide: BASE_PATH,
      useValue: '.'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
