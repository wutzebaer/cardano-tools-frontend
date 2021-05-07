import { RegisterTokenComponent } from './register-token/register-token.component';
import { MintComponent } from './mint/mint.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LatestTokensComponent } from './latest-tokens/latest-tokens.component';

const routes: Routes = [
  { path: '', redirectTo: '/latest', pathMatch: 'full' },
  { path: 'mint', component: MintComponent },
  { path: 'register', component: RegisterTokenComponent },
  { path: 'latest', component: LatestTokensComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
