import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminPanelComponent } from "./core/layout/admin-panel/admin-panel.component";
import { AuthGuard } from "./core/guards/auth/auth.guard";

const routes: Routes = [
  {
    path: "login",
    loadChildren: "@flexyear-modules/auth/login/login.module#LoginModule",
  },
  {
    path: "home",
    loadChildren: "@flexyear-modules/home/home.module#HomeModule",
  },
  // {
  //   path: "register",
  //   loadChildren: "@flexyear-modules/auth/register/register.module#RegisterModule"
  // },
  // company-register
  {
    path:"company-registration",
    loadChildren:
      "@flexyear-modules/companyregister/companyregister.module#CompanyregisterModule",
  },

   //forgot password
   {
    path:"forgot-password",
    loadChildren:
      "@flexyear-modules/forgotpassword/forgotpassword.module#ForgotpasswordModule",
  },
  {
    path: "guide",
    loadChildren: "@flexyear-modules/guide/guide.module#GuideModule",
    // data: {
    //   breadcrumb: "Guide",
    //   // tittleInformation: "Send message to admin ",
    // },
  },
  {
    path: "pin/dashboard",
    loadChildren:
      "@flexyear-modules/dashboard/pin-dashboard/pindashboard/pindashboard.module#PindashboardModule",
    data: {
      breadcrumb: "Pin Attendance",
    },
  },
  {
    path: "",
    component: AdminPanelComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: "Home",
    },
    children: [
      { path: "", redirectTo: "dashboard/admin", pathMatch: "full" },
      {
        path: "dashboard/admin",
        loadChildren:
          "@flexyear-modules/dashboard/admin-dashboard/admin-dashboard.module#AdminDashboardModule",
        data: {
          breadcrumb: "Admin Dashboard",
          // tittleInformation: "Control Panel for Admin.",
        },
      },
      {
        path: "dashboard/staff-dashboard",
        loadChildren:
          "@flexyear-modules/dashboard/staff-dashboard/staff-dashboard.module#StaffDashboardModule",
        data: {
          breadcrumb: "Staff Dashboard",
          // tittleInformation:
          //   "This page includes leave, Attendance, Report and summary of staff",
        },
      },

      {
        path: "manage-client/client-branch",
        loadChildren:
          "@flexyear-modules/manage-client/client-branch/client-branch.module#ClientBranchModule",
        data: {
          breadcrumb: "Client Branch",
          // tittleInformation:
          //   "Create branches and locations for clients of registeerd company. ",
        },
      },

      {
        path: "manage-client/client",
        loadChildren:
          "@flexyear-modules/manage-client/client/client.module#ClientModule",
        data: {
          breadcrumb: "Client",
          // tittleInformation:
          //   "Create clients of registeerd company along with department, division. ",
        },
      },

      {
        path: "manage-client/clientwise-report",
        loadChildren:
          "@flexyear-modules/manage-client/clientswise-attendance-report/clientswise-attendance-report.module#ClientswiseAttendanceReportModule",
        data: {
          breadcrumb: "Clients Wise Attendance Report",
          // tittleInformation:
          //   "Create clients of registeerd company along with department, division. ",
        },
      },

      {
        path: "manage-client/client-employee",
        loadChildren:
          "@flexyear-modules/manage-client/client-employee/client-employee.module#ClientEmployeeModule",
        data: {
          breadcrumb: "Client Employee",
          // tittleInformation:
          //   "Create clients of registeerd company along with department, division. ",
        },
      },
      {
        path: "staff/manage-staff",
        loadChildren:
          "@flexyear-modules/staff/manage-staff/manage-staff.module#ManageStaffModule",
        data: {
          breadcrumb: "Manage Employee",
          // tittleInformation: "Create new Staff of registered company. ",
        },
      },
      {
        path: "profile",
        loadChildren:
          "@flexyear-modules/profile/profile/profile.module#ProfileModule",
        data: {
          breadcrumb: "Login Profile",
        },
      },
      {
        path: "staff/manage-user",
        loadChildren:
          "@flexyear-modules/staff/manage-user/manage-user.module#ManageUserModule",
        data: {
          breadcrumb: "Manage User",
          // tittleInformation:
          //   //   "Assign credentials, roles and pin to new Staff of registered company. ",
        },
      },
      {
        path: "daybook-management/attendance",
        loadChildren:
          "@flexyear-modules/daybook-management/attendance/attendance.module#AttendanceModule",
        data: {
          breadcrumb: "Attendance",
          // tittleInformation: "Set your attandance status ",
        },
      },
      {
        path: "daybook-management/correction-attendance",
        loadChildren:
          "@flexyear-modules/daybook-management/correction-attendance/correction-attendance.module#CorrectionAttendanceModule",
        data: {
          breadcrumb: "Correction Attendance",
          // tittleInformation: "List of attendance correction Request ",
        },
      },
      {
        path: "reports/monthly-chart",
        loadChildren:
          "@flexyear-modules/reports/all-users-monthly-chart/monthly-chart.module#MonthlyChartModule",
        data: {
          breadcrumb: "Monthly Chart",
          // tittleInformation:
          //   "Monthly attendance Report of staff in chart formate",
        },
      },
      {
        path: "reports/monthly-report",
        loadChildren:
          "@flexyear-modules/reports/monthly-report/monthly-report.module#MonthlyReportModule",
        data: {
          breadcrumb: "Detailed Time Report",
          // tittleInformation:
          //   // "Detail Monthly attendance report  of staff along with break",
        },
      },
      {
        path:"reports/auditlogs",
        loadChildren:"@flexyear-modules/audit-log/audit-log.module#AuditLogModule",
        data: {
          breadcrumb: "Audit Log"
        },
      },
      {
        path: "reports/attendance-detail",
        loadChildren:
          "@flexyear-modules/reports/attendance-detail/attendance-detail.module#AttendanceDetailModule",
        data: {
          breadcrumb: "Attendance Detail",
          // tittleInformation: "Detail attendance logs ",
        },
      },

      {
        path: "reports/yearly-monthly-reports",
        loadChildren:
          "@flexyear-modules/reports/yearly-monthly-report/yearly-monthly-report.module#YearlyMonthlyReportModule",
        data: {
          breadcrumb: "Yearly-Monthly Report",
          // tittleInformation: "Detail Yearly attendance report",
        },
      },
      {
        path: "reports/break-report",
        loadChildren:
          "@flexyear-modules/reports/break-report/break-report.module#BreakReportModule",
        data: {
          breadcrumb: "Break Report",
          // tittleInformation: "Detail Yearly attendance report",
        },
      },
      {
        path: "reports/timecard",
        loadChildren:
          "@flexyear-modules/reports/time-card/time-card.module#TimeCardModule",
        data: {
          breadcrumb: "Time Card",
          // tittleInformation: "Information about time card",
        },
      },
      {
        path: "leave-request/create",
        loadChildren:
          "@flexyear-modules/leave-request/create-request/create-request.module#CreateRequestModule",
        data: {
          breadcrumb: "Create Leave Request",
          // tittleInformation: "Create  your leave Requests ",
        },
      },
      {
        path: "leave-request/request-received",
        loadChildren:
          "@flexyear-modules/leave-request/request-received/request-received.module#RequestReceivedModule",
        data: {
          breadcrumb: "Leave Request received",
          // tittleInformation: "See  your leave Requests status ",
        },
      },
      {
        path: "salary/monthly-salary-sheet",
        loadChildren:
          "@flexyear-modules/salary/monthly-salary-sheet/monthly-salary-sheet.module#MonthlySalarySheetModule",
        data: {
          breadcrumb: "Monthly Salary Sheet",
          // tittleInformation: "See  your Monthly salary sheet ",
        },
      },
      {
        path: "setting/rbac/assignments",
        loadChildren:
          "@flexyear-modules/setting/RBAC/assignments/assignment.module#AssignmentModule",
        data: {
          breadcrumb: "Assignments",
          // tittleInformation: "information about Assignments ",
        },
      },
      {
        path: "setting/rbac/permission",
        loadChildren:
          "@flexyear-modules/setting/RBAC/permission/permission.module#PermissionModule",
        data: {
          breadcrumb: "Permission",
          // tittleInformation: "information about permission ",
        },
      },
      {
        path: "setting/rbac/roles",
        loadChildren:
          "@flexyear-modules/setting/RBAC/roles/roles.module#RolesModule",
        data: {
          breadcrumb: "Roles",
          // tittleInformation: "information about roles ",
        },
      },
      {
        path: "setting/rbac/route",
        loadChildren:
          "@flexyear-modules/setting/RBAC/route/route.module#RouteModule",
        data: {
          breadcrumb: "Route",
          // tittleInformation: "information about route ",
        },
      },
      {
        path: "message",
        loadChildren: "@flexyear-modules/message/message.module#MessageModule",
        data: {
          breadcrumb: "Message",
          // tittleInformation: "Send message to admin ",
        },
      },
      // {
      //   path: "audit-log",
      //   loadChildren:
      //     "@flexyear-modules/audit-log/audit-log.module#AuditLogModule",
      //   data: {
      //     breadcrumb: "Audit Log",
      //     // tittleInformation: "information about Audit log ",
      //   },
      // },
      {
        path: "setting/general-setting",
        loadChildren:
          "@flexyear-modules/setting/general-setting/general-setting.module#GeneralSettingModule",
        data: {
          breadcrumb: "General Setting",
          // tittleInformation: "Change Settings as per your requirement",
        },
      },
      {
        path: "setting/user-preference-setting",
        loadChildren:
          "@flexyear-modules/setting/user-preference-setting/user-preference-setting.module#UserPreferenceSettingModule",
        data: {
          breadcrumb: "User Preference",
          // tittleInformation: "Change your personal Preference.",
        },
      },
      {
        path: "utilities/holiday-management",
        loadChildren:
          "@flexyear-modules/utilities/holiday-management/holiday-management.module#HolidayManagementModule",
        data: {
          breadcrumb: "Holiday Management",
          // tittleInformation: "Create holidays ",
        },
      },
      {
        path: "utilities/shift",
        loadChildren:
          "@flexyear-modules/utilities/shift/shift.module#ShiftModule",
        data: {
          breadcrumb: "Shift",
          // tittleInformation: "Create Shifts as per requirement ",
        },
      },
      {
        path: "utilities/currency",
        loadChildren:
          "@flexyear-modules/utilities/currency/currency.module#CurrencyModule",
        data: {
          breadcrumb: "Currency",
          // tittleInformation: "Create Shifts as per requirement ",
        },
      },
      {
        path: "utilities/weekend-management",
        loadChildren:
          "@flexyear-modules/utilities/weekend-mangement/weekend-management.module#WeekendManagementModule",
        data: {
          breadcrumb: "Weekend Management",
          // tittleInformation: "Create weekend days as per your preference ",
        },
      },
      {
        path: "setting/menu-management",
        loadChildren:
          "@flexyear-modules/setting/menu-management/menu-management.module#MenuManagementModule",
        data: {
          breadcrumb: "Menu Management ",
          // tittleInformation: "Manage Menu Dynamically",
        },
      },
      {
        path: "utilities/department",
        loadChildren:
          "@flexyear-modules/utilities/department/department.module#DepartmentModule",
        data: {
          breadcrumb: "Department",
          // tittleInformation: "Create list of Departments to be used  ",
        },
      },
      {
        path: "utilities/employee-type",
        loadChildren:
          "@flexyear-modules/utilities/employee-type/employee-type.module#EmployeeTypeModule",
        data: {
          breadcrumb: "Employee Type",
          // tittleInformation: "Create list of Employee Type to be used  ",
        },
      },
      {
        path: "utilities/fund-type",
        loadChildren:
          "@flexyear-modules/utilities/fund-type/fund-type.module#FundTypeModule",
        data: {
          breadcrumb: "Fund Type",
          // tittleInformation: "Create list of Employee Type to be used  ",
        },
      },
      {
        path: "utilities/allowance",
        loadChildren:
          "@flexyear-modules/utilities/allowance/allowance.module#AllowanceModule",
        data: {
          breadcrumb: "Allowance",
          // tittleInformation: "Create list of Allowances to be used ",
        },
      },
      {
        path: "utilities/leave-type",
        loadChildren:
          "@flexyear-modules/utilities/leave-type/leave-type.module#LeaveTypeModule",
        data: {
          breadcrumb: "Leave Type",
          // tittleInformation: "Create list of Leave Type to be used",
        },
      },
      {
        path: "utilities/attendance-type",
        loadChildren:
          "@flexyear-modules/utilities/attendance-type/attendance-type.module#AttendanceTypeModule",
        data: {
          breadcrumb: "Attendance Type",
          // tittleInformation: "Create list of Leave Type to be used",
        },
      },
      {
        path: "utilities/designation",
        loadChildren:
          "@flexyear-modules/utilities/designation/designation.module#DesignationModule",
        data: {
          breadcrumb: "Designation",
          // tittleInformation: "Create list of designations to be used ",
        },
      },
      {
        path: "utilities/allow-ip",
        loadChildren:
          "@flexyear-modules/utilities/allow-ip/allow-ip.module#AllowIpModule",
        data: {
          breadcrumb: "Allow Ip",
          // tittleInformation: "Create ,edit and delete ips that are allowed ",
        },
      },
      {
        path: "setting/api-key",
        loadChildren:
          "@flexyear-modules/setting/api-key/api-key.module#ApiKeyModule",
        data: {
          breadcrumb: "Api Key",
          // tittleInformation: "Generate api keys for api call ",
        },
      },
      {
        path: "utilities/employeegroup",
        loadChildren:
          "@flexyear-modules/utilities/employee-group/employee-group.module#EmployeeGroupModule",
        data: {
          breadcrumb: "Employee Group",
          // tittleInformation: "Create ,edit and delete ips that are allowed ",
        },
      },
      {
        path: "utilities/taxslab",
        loadChildren:
          "@flexyear-modules/utilities/taxslab/tax-slab.module#TaxSlabModule",
        data: {
          breadcrumb: "Tax Slab",
          // tittleInformation: "Create ,edit and delete ips that are allowed ",
        },
      },
      {
        path: "utilities/additiondeduction",
        loadChildren:
          "@flexyear-modules/utilities/additiondeduction/additiondeduction.module#AdditionDeductionModule",
        data: {
          breadcrumb: "Addition/Deduction",
          // tittleInformation: "Create ,edit and delete ips that are allowed ",
        },
      },
        //cors origin module
  {
    path: "utilities/cors-origin",
    loadChildren:
      "@flexyear-modules/utilities/cors-origin/cors-origin.module#CorsOriginModule",
    data: {
      breadcrumb: "Cors Origin",
      // tittleInformation: "Create holidays ",
    },
  },
  // {
  //   path:"auditlogs",
  //   loadChildren:"@flexyear-modules/utilities/auditlog/auditlog.module#AuditLogModule",
  //   data: {
  //     breadcrumb: "Audit Log"
  //   },
  // },


      {
        path: "setting/company",
        loadChildren:
          "@flexyear-modules/setting/company/company.module#CompanyModule",
        data: {
          breadcrumb: "Company",
          // tittleInformation: "Create edit and delete company ",
        },
      },
      {
        path: "payroll",
        loadChildren: "@flexyear-modules/payroll/payroll.module#PayrollModule",
        data: {
          breadcrumb: "Payroll",
          // tittleInformation: "Send message to admin ",
        },
      },
      {
        path:"payroll/payroll-periods",
        loadChildren: "@flexyear-modules/payroll-period/payroll-period.module#PayrollPeriodModule",
        data: {
          breadcrumb: "Payroll Periods",
          // tittleInformation: "Send message to admin ",
        },
      },
      {
        path:"payroll/payroll-parameters",
        loadChildren: "@flexyear-modules/payroll-parameters/payroll-parameters.module#PayrollParametersModule",
        data: {
          breadcrumb: "Payroll Parameters",
          // tittleInformation: "Send message to admin ",
        },
      },

      {
        path: "performance",
        loadChildren: "@flexyear-modules/performance/performance.module#PerformanceModule",
        data: {
          breadcrumb: "Performance",
          // tittleInformation: "Send message to admin ",
        },
      },


      {
        path: "**",
        loadChildren: "@flexyear-modules/error/error.module#ErrorModule",
      },
    ],
  },

  // company-registration
  // company-register
  {
    path:"company-registration",
    loadChildren:
      "@flexyear-modules/companyregister/companyregister.module#CompanyregisterModule",
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled'}),],
  exports: [RouterModule],
})
export class AppRoutingModule {}
