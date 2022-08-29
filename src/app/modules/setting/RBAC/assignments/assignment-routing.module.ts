import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ParentMenuRoute } from "@app/core/guards/auth/services/parentMenu";
import { RoleGuard } from "@app/core/guards/role.guard";

import { AssignmentComponent } from "./components/assignment/assignment.component";
import { ViewAssignmentComponent } from "./components/view-assignment/view-assignment.component";

const routes: Routes = [
  {
    path: "",
    component: AssignmentComponent,
    canActivate:[RoleGuard]
  },
  {
    path: "view/:id",
    component: ViewAssignmentComponent,
    data:{
      parentMenuRoute:ParentMenuRoute.assignments
    },
    canActivate:[RoleGuard]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentRoutingModule {}
