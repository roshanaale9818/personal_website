import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";
import { EmployeeGroupListComponent } from "./components/employee-group-list/employee-group-list.component";

// import { WeekendManagementComponent } from "./components/weekend-management.component";

const routes: Routes = [
  { path: "", component: EmployeeGroupListComponent,canActivate:[RoleGuard]
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeGroupRoutingModule {}
