import { EuroPoolComponent } from './euro-pool/euro-pool.component';
import { MyTokensComponent } from './my-tokens/my-tokens.component';
import { RegisterTokenComponent } from './register-token/register-token.component';
import { MintComponent } from './mint/mint.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LatestTokensComponent } from './latest-tokens/latest-tokens.component';

const routes: Routes = [
  { path: '', redirectTo: '/latest', pathMatch: 'full' },
  { path: 'europool', component: EuroPoolComponent },
  { path: 'mint', component: MintComponent },
  { path: 'register', component: RegisterTokenComponent },
  { path: 'latest', component: LatestTokensComponent },
  { path: 'my', component: MyTokensComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
