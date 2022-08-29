import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyRegisterComponent } from './components/company-register/company-register.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { VerifyCodeComponent } from './components/verify-code/verify-code.component';

const routes: Routes = [
  {
    path:'',
    component:CompanyRegisterComponent
  },
  {
    path:'user-register',
    component:UserRegisterComponent
  },
  {
    path:"verify-company",
    component:VerifyCodeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyregisterRoutingModule { }
