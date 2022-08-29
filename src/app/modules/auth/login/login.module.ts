import { SharedModule } from "@app/shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LoginComponent } from "./components/login.component";
import { LoginRoutingModule } from "./login-routing.module";
import { UsernameLoginComponent } from "./components/username-login/username-login.component";
import { PinLoginComponent } from "./components/pin-login/pin-login.component";

import { TabsModule } from "ngx-bootstrap/tabs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [LoginComponent, UsernameLoginComponent, PinLoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    TabsModule.forRoot(),
    SharedModule
  ]
})
export class LoginModule {}
