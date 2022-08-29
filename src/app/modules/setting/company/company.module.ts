import { SharedModule } from "./../../../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CompanyComponent } from "./components/company.component";
import { CompanyRoutingModule } from "./company-routing.module";
import { CompanyListComponent } from "./components/company-list/company-list.component";
import { GridModule } from "@progress/kendo-angular-grid";
import { ReactiveFormsModule } from "@angular/forms";
import { CompanyDetailComponent } from './components/company-detail/company-detail.component';
import { CompanyUserComponent } from './components/company-user/company-user/company-user.component';
// import { BsModalService, ModalModule } from "ngx-bootstrap";

@NgModule({
  declarations: [CompanyComponent, CompanyListComponent, CompanyDetailComponent, CompanyUserComponent],
  imports: [
  CommonModule,
    CompanyRoutingModule,
    GridModule,
    ReactiveFormsModule,
    SharedModule,
  ],
providers:[
]
})
export class CompanyModule {}
