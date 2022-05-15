import { MintOnDemandInstructionsComponent } from './mint-on-demand-instructions/mint-on-demand-instructions.component';
import { MintOnDemandComponent } from './mint-on-demand/mint-on-demand.component';
import { StakeRewardsComponent } from './stake-rewards/stake-rewards.component';
import { BurnTokensComponent } from './burn-tokens/burn-tokens.component';
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
  { path: 'burn', component: BurnTokensComponent },
  { path: 'burn-address', component: BurnComponent },
  { path: 'register', component: RegisterTokenComponent },
  { path: 'latest', component: LatestTokensComponent },
  { path: 'my', component: MyTokensComponent },
  { path: 'exchange', component: ExchangeComponent },
  { path: 'royaltiescip27', component: RoyaltiesCip27MintComponent },
  { path: 'reward-stakers', component: StakeRewardsComponent },
  { path: 'mint-on-demand', component: MintOnDemandComponent },
  { path: 'drop/:prettyUrl', component: MintOnDemandInstructionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
