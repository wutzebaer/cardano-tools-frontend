import { AddressFormComponent } from './address-form/address-form.component';
import { DashComponent } from './dash/dash.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'dashboard', component: DashComponent }, { path: 'address-form', component: AddressFormComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
