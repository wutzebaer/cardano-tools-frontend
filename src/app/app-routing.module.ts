import { ExchangeComponent } from './exchange/exchange.component';
import { BurnComponent } from './burn/burn.component';
import { EuroPoolComponent } from './euro-pool/euro-pool.component';
import { MyTokensComponent } from './my-tokens/my-tokens.component';
import { RegisterTokenComponent } from './register-token/register-token.component';
import { MintComponent } from './mint/mint.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LatestTokensComponent } from './latest-tokens/latest-tokens.component';
import { RoyaltiesCip27MintComponent } from './royalties-cip27-mint/royalties-cip27-mint.component';

const routes: Routes = [
  { path: '', redirectTo: '/latest', pathMatch: 'full' },
  { path: 'europool', component: EuroPoolComponent },
  { path: 'mint', component: MintComponent },
  { path: 'burn', component: BurnComponent },
  { path: 'register', component: RegisterTokenComponent },
  { path: 'latest', component: LatestTokensComponent },
  { path: 'my', component: MyTokensComponent },
  { path: 'exchange', component: ExchangeComponent },
  { path: 'royaltiescip27', component: RoyaltiesCip27MintComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
