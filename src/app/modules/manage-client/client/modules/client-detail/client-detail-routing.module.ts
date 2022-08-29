import { RoleGuard } from "@app/core/guards/role.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ClientDepartmentComponent } from "../../components/client-department/client-department.component";
import { ClientDetailComponent } from "../../components/client-detail/client-detail.component";
import { ClientInfoComponent } from "../../components/client-info/client-info.component";
import { ClientDivisionComponent } from "../../components/client-division/client-division.component";
import { ClientIpAddressComponent } from "../../components/client-ip-address/client-ip-address.component";
import { ClientShiftComponent } from "../../components/client-shift/client-shift.component";
import { ClientStaffShiftComponent } from "../../components/client-staff-shift/client-staff-shift.component";
import { GraceRuleComponent } from "../../components/grace-rule/grace-rule.component";
import { ClientEmployeesComponent } from "../../components/client-employees/components/active-client-employees/client-employees.component";
import { RolesAccess } from "@app/core/guards/auth/services/rolesaccess";

const routes: Routes = [
  {
    path: "",
    component: ClientDetailComponent,
    canActivate: [RoleGuard],
    data: {
      // roles: ["Admin", "Super Admin"],
      roles:RolesAccess.viewAccess
    },

    children: [
      { path: "", component: ClientInfoComponent },
      {
        path: "department",
        component: ClientDepartmentComponent,
        data: {
          breadcrumb: "Department",
        },
      },
      {
        path: "division",
        component: ClientDivisionComponent,
        data: {
          breadcrumb: "Division",
        },
      },
      {
        path: "clients-employees",
        component: ClientEmployeesComponent,
        data: {
          breadcrumb: "Client Employees",
        },
      },
      {
        path: "clients-ip-address",
        component: ClientIpAddressComponent,
        data: {
          breadcrumb: "Client IP Address",
        },
      },
      {
        path: "client-shift",
        component: ClientShiftComponent,
        data: {
          breadcrumb: "Client Shift",
        },
      },
      {
        path: "client-employee-shift",
        component: ClientStaffShiftComponent,
        data: {
          breadcrumb: "Client Employee Shift",
        },
      },
      {
        path: "grace-rule",
        component: GraceRuleComponent,
        data: {
          breadcrumb: "Grace Rule",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientDetailRoutingModule {}
