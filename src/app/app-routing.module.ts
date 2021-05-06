import { RegisterTokenComponent } from './register-token/register-token.component';
import { MintComponent } from './mint/mint.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/mint', pathMatch: 'full' },
  { path: 'mint', component: MintComponent },
  { path: 'register', component: RegisterTokenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
