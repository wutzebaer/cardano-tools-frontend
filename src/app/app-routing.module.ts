import { MintComponent } from './mint/mint.component';
import { DashComponent } from './dash/dash.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'mint', component: MintComponent },
  { path: 'dashboard', component: DashComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
