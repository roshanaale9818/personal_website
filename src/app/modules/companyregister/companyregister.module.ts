import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyregisterRoutingModule } from './companyregister-routing.module';
import { CompanyRegisterComponent } from './components/company-register/company-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { InputRestrictionDirective } from './components/company-register/directive/preventcharacters.directive';
import { VerifyCodeComponent } from './components/verify-code/verify-code.component';
import { RecaptchaModule, RecaptchaFormsModule } from "ng-recaptcha";

@NgModule({
  declarations: [CompanyRegisterComponent, UserRegisterComponent,InputRestrictionDirective, VerifyCodeComponent],
  imports: [
    CommonModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    CompanyregisterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CompanyregisterModule { }
