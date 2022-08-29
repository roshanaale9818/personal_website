import { RoleGuard } from "./../../../core/guards/role.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserPreferenceComponent } from "./components/user-preference.component";

const routes: Routes = [
  {
    path: "",
    component: UserPreferenceComponent,
    canActivate: [RoleGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPreferenceSettingRoutingModule {}
