import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { environment } from "@env/environment";
import { LayoutService } from "../../services/layout.service";
import { LoginService } from "@app/modules/auth/login/services/login.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { LocalStorageService } from "../../../../shared/services/local-storage/local-storage.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  defaultImagePath = environment.defaultImagePath;
  imageUrl = environment.baseImageUrl;
  navItems = [
    {
      id: 1,
      displayName: "Dashboard",
      iconName: "fa fa-dashboard",

      children: [
        {
          displayName: "Admin Dashboard",
          iconName: "fa fa-dashboard",
          route: "dashboard/admin",
        },
        // {
        //   displayName: "Staff Dashboard",
        //   iconName: "fa fa-dashboard",
        //   route: "dashboard/staff-dashboard",
        // },
      ],
    },

    {
      id: 2,
      displayName: "Employees",
      iconName: "fa fa-th",

      children: [
        {
          displayName: "Manage Employee",
          iconName: "fa fa-fw fa-user",
          route: "staff/manage-staff",
        },
        {
          displayName: "Manage User",
          iconName: "fa fa-users",
          route: "staff/manage-user",
        },
      ],
    },
    {
      id: 3,
      displayName: "Manage Clients",
      iconName: "fa fa-users",
      // route: "client"
      children: [
        {
          displayName: "Clients",
          iconName: "fa fa-users",
          route: "manage-client/client",
        },
        {
          displayName: "Client Branch",
          iconName: "fa fa-code-fork",
          route: "manage-client/client-branch",
        },

        // {
        //   displayName: "Client Employee",
        //   iconName: "fa fa-user",
        //   route: "manage-client/client-employee",
        // },
      ],
    },

    {
      id: 4,
      displayName: "Daybook Management",
      iconName: "fa fa-bar-chart-o",

      children: [
        {
          displayName: "Attendence",
          iconName: "fa fa-check-square",
          route: "daybook-management/attendance",
        },
        {
          displayName: "Correction Attendance",
          iconName: "fa fa-edit",
          route: "daybook-management/correction-attendance",
        },
      ],
    },
    {
      id: 5,
      displayName: "Reports",
      iconName: "fa fa-file",

      children: [
        {
          displayName: "Monthly Report",
          iconName: "fa fa-file",
          route: "reports/monthly-report",
        },
        // {
        //   displayName: "All Users Monthly Chart",
        //   iconName: "fa fa-signal",
        //   route: "reports/monthly-chart",
        // },
        {
          displayName: "Attendance Detail",
          iconName: "fa fa-check-square",
          route: "reports/attendance-detail",
        },
        // {
        //   displayName: "Yearly/Monthly Report ",
        //   iconName: "fa fa-file",
        //   route: "reports/yearly-monthly-reports",
        // },
        // {
        //   displayName: "Break Report ",
        //   iconName: "fa fa-files-o",
        //   route: "reports/break-report",
        // },
        {
          displayName: "Time Card",
          iconName: "fa fa-clock-o",
          route: "reports/timecard",
        },
        // {
        //   displayName: "Clients' Attendance Report",
        //   iconName: "fa fa-file",
        //   route: "manage-client/clientwise-report",
        // },
      ],
    },
    {
      id: 6,
      displayName: "Leave Request",
      iconName: "fa fa-paper-plane",

      children: [
        {
          displayName: "Create",
          iconName: "fa fa-download",
          route: "leave-request/create",
        },
        {
          displayName: "Request Received",
          iconName: "fa fa-paper-plane",
          route: "leave-request/request-received",
        },
      ],
    },
    {
      id: 7,
      displayName: "Salary",
      iconName: "fa fa-money",

      children: [
        {
          displayName: "Monthly Salary Sheet",
          iconName: "fa fa-money",
          route: "salary/monthly-salary-sheet",
        },
      ],
    },
    {
      id: 8,
      displayName: "RBAC",
      iconName: "fa fa-edit",

      children: [
        {
          displayName: "Assignments",
          iconName: "fa fa-tasks",
          route: "setting/rbac/assignments",
        },
        // {
        //   displayName: "Permission",
        //   iconName: "fa fa-certificate",
        //   route: "setting/rbac/permission",
        // },
        {
          displayName: "Roles",
          iconName: "fa fa-certificate",
          route: "setting/rbac/roles",
        },
        {
          displayName: "Route ",
          iconName: "fa fa-road",
          route: "setting/rbac/route",
        },
      ],
    },
    {
      id: 9,
      displayName: "Setting",
      iconName: "fa fa-gears",

      children: [
        {
          displayName: "General Setting",
          iconName: "fa fa-gears",
          route: "setting/general-setting",
        },
        {
          displayName: "User Preference Setting",
          iconName: "fa fa-cog",
          route: "setting/user-preference-setting",
        },

        // {
        //   displayName: "Holiday Manangement",
        //   iconName: "fa fa-certificate",
        //   route: "utilities/holiday-management",
        // },

        // {
        //   displayName: "Menu Management",
        //   iconName: "fa fa-bars",
        //   route: "setting/menu-management",
        // },

        // {
        //   displayName: "Employee Type",
        //   iconName: "fa fa-user",
        //   route: "setting/employee-type",
        // },

        // {
        //   displayName: "Api Key",
        //   iconName: "fa fa-globe",
        //   route: "setting/api-key",
        // },
        {
          displayName: "Company",
          iconName: "fa fa-home",
          route: "setting/company",
        },
      ],
    },
    {
      id: 13,
      displayName: " Utilities",
      iconName: "fa fa-wrench",
      children: [
        {
          displayName: "Shift",
          iconName: "fa fa-clock-o",
          route: "utilities/shift",
        },
        {
          displayName: "User Preference",
          iconName: "fa fa-gears",
          route: "utilities/user-preference",
        },
        {
          displayName: "Weekend Management",
          iconName: "fa fa-cubes",
          route: "utilities/weekend-management",
        },
        {
          displayName: "Department",
          iconName: "fa fa-institution",
          route: "utilities/department",
        },
        {
          displayName: "Employee Type",
          iconName: "fa fa-user",
          route: "utilities/employee-type",
        },
        {
          displayName: "Fund Type",
          iconName: "fa fa-money",
          route: "utilities/fund-type",
        },
        {
          displayName: "Allowance",
          iconName: "fa fa-level-up",
          route: "utilities/allowance",
        },
        {
          displayName: "Leave Type",
          iconName: "fa fa-paper-plane",
          route: "utilities/leave-type",
        },
        {
          displayName: "Attendance Type",
          iconName: "fa fa-clock-o",
          route: "utilities/attendance-type",
        },
        {
          displayName: "Designation",
          iconName: "fa fa-user",
          route: "utilities/designation",
        },
        {
          displayName: "Allow Ip",
          iconName: "fa fa-globe",
          route: "utilities/allow-ip",
        },
      ],
    },
    {
      id: 10,
      displayName: "Message",
      iconName: "fa fa-comments",
      route: "message",
    },
    {
      id: 12,
      displayName: "Audit Log",
      iconName: "fa fa-archive",
      route: "audit-log",
    },
  ];

  navItems_admin = [
    // Dashboard type
    {
      id: 1,
      displayName: "Dashboard",
      iconName: "fa fa-dashboard",

      children: [
        {
          displayName: "Admin Dashboard",
          iconName: "fa fa-dashboard",
          route: "dashboard/admin",
        },
        // {
        //   displayName: "Staff Dashboard",
        //   iconName: "fa fa-dashboard",
        //   route: "dashboard/staff-dashboard",
        // },
      ],
    },

    // Employees part
    {
      id: 2,
      displayName: "Employees",
      iconName: "fa fa-th",

      children: [
        {
          displayName: "Manage Employee",
          iconName: "fa fa-fw fa-user",
          route: "staff/manage-staff",
        },
        {
          displayName: "Manage User",
          iconName: "fa fa-users",
          route: "staff/manage-user",
        },
      ],
    },

    // Client Part
    {
      id: 3,
      displayName: "Manage Clients",
      iconName: "fa fa-users",
      // route: "client"
      children: [
        {
          displayName: "Clients",
          iconName: "fa fa-users",
          route: "manage-client/client",
        },
        {
          displayName: "Client Branch",
          iconName: "fa fa-code-fork",
          route: "manage-client/client-branch",
        },
        // {
        //   displayName: "Clients Wise Attendance Report",

        //   route: "manage-client/clientwise-report",
        // },
        // {
        //   displayName: "Client Employee",
        //   iconName: "fa fa-user",
        //   route: "manage-client/client-employee",
        // },
      ],
    },

    // Dailybook Management part
    {
      id: 4,
      displayName: "Daybook Management",
      iconName: "fa fa-bar-chart-o",

      children: [
        {
          displayName: "Correction Request",
          iconName: "fa fa-edit",
          route: "daybook-management/correction-attendance",
        },

        {
          displayName: "Detailed Time",
          iconName: "fa fa-file",
          route: "reports/monthly-report",
        },

        {
          displayName: "Leave Request",
          iconName: "fa fa-paper-plane",
          children: [
            {
              displayName: "Create",
              iconName: "fa fa-download",
              route: "leave-request/create",
            },
            {
              displayName: "Request Received",
              iconName: "fa fa-paper-plane",
              route: "leave-request/request-received",
            },
          ],
        },
      ],
    },

    // Report Section
    {
      id: 5,
      displayName: "Reports",
      iconName: "fa fa-file",

      children: [
        {
          displayName: "Attendance Detail",
          iconName: "fa fa-check-square",
          route: "reports/attendance-detail",
        },

        {
          displayName: "Time Card",
          iconName: "fa fa-clock-o",
          route: "reports/timecard",
        },
      ],
    },

    // Settings Part
    {
      id: 9,
      displayName: "Setting",
      iconName: "fa fa-gears",

      children: [
        {
          displayName: "General Setting",
          iconName: "fa fa-gears",
          route: "setting/general-setting",
        },
      ],
    },
  ];

  navItems_manager = [
    // Dashboard part
    {
      id: 1,
      displayName: "Dashboard",
      iconName: "fa fa-dashboard",
      children: [
        {
          displayName: "Staff Dashboard",
          iconName: "fa fa-dashboard",
          route: "dashboard/staff-dashboard",
        },
      ],
    },

    // Employees part
    {
      id: 2,
      displayName: "Employees",
      iconName: "fa fa-th",
      children: [
        {
          displayName: "Manage User",
          iconName: "fa fa-users",
          route: "staff/manage-user",
        },
      ],
    },

    // Clients part
    {
      id: 3,
      displayName: "Manage Clients",
      iconName: "fa fa-users",
      // route: "client"
      children: [
        {
          displayName: "Clients",
          iconName: "fa fa-users",
          route: "manage-client/client",
        },
      ],
    },

    // Daybook Management
    {
      id: 4,
      displayName: "Daybook Management",
      iconName: "fa fa-bar-chart-o",

      children: [
        {
          displayName: "Monthly Report",
          iconName: "fa fa-file",
          route: "reports/monthly-report",
        },

        {
          displayName: "Leave Request",
          iconName: "fa fa-paper-plane",
          children: [
            {
              displayName: "Create",
              iconName: "fa fa-download",
              route: "leave-request/create",
            },
            {
              displayName: "Request Received",
              iconName: "fa fa-paper-plane",
              route: "leave-request/request-received",
            },
          ],
        },
      ],
    },

    // Report Section
    {
      id: 5,
      displayName: "Reports",
      iconName: "fa fa-file",

      children: [
        {
          displayName: "Attendance Detail",
          iconName: "fa fa-check-square",
          route: "reports/attendance-detail",
        },

        {
          displayName: "Time Card",
          iconName: "fa fa-clock-o",
          route: "reports/timecard",
        },
      ],
    },
  ];

  navItems_employee = [
    // Dashboard part
    {
      id: 1,
      displayName: "Dashboard",
      iconName: "fa fa-dashboard",
      children: [
        {
          displayName: "Staff Dashboard",
          iconName: "fa fa-dashboard",
          route: "dashboard/staff-dashboard",
        },
      ],
    },

    // Daybook Management part
    {
      id: 4,
      displayName: "Daybook Management",
      iconName: "fa fa-bar-chart-o",

      children: [
        {
          displayName: "Attendence",
          iconName: "fa fa-check-square",
          route: "daybook-management/attendance",
        },
        {
          displayName: "Correction Attendance",
          iconName: "fa fa-edit",
          route: "daybook-management/correction-attendance",
        },
      ],
    },

    // Reports Part
    {
      id: 5,
      displayName: "Reports",
      iconName: "fa fa-file",

      children: [
        {
          displayName: "Monthly Report",
          iconName: "fa fa-file",
          route: "reports/monthly-report",
        },

        // {
        //   displayName: "Yearly/Monthly Report",
        //   iconName: "fa fa-file",
        //   route: "reports/yearly-monthly-reports",
        // },
        // {
        //   displayName: "Break Report",
        //   iconName: "fa fa-file",
        //   route: "reports/break-report",
        // },
      ],
    },

    // Leave Request
    {
      id: 6,
      displayName: "Leave Request",
      iconName: "fa fa-paper-plane",

      children: [
        {
          displayName: "Create",
          iconName: "fa fa-download",
          route: "leave-request/create",
        },
        {
          displayName: "Request Received",
          iconName: "fa fa-paper-plane",
          route: "leave-request/request-received",
        },
      ],
    },
  ];
  isPinLogin;
  constructor(
    private layoutService: LayoutService,
    private loginService: LoginService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.getUserInfo();
    this.getRoleList();
    this.isPinLogin = this.localStorageService.getLocalStorageItem("isPinLogin")
      ? this.localStorageService.getLocalStorageItem("isPinLogin")
      : false;
    //assign the usermenu here
    this.navItems =
      this.localStorageService.getLocalStorageItem("userMenuDetails");
  }

  userName: string;
  userInfo: any;
  getUserInfo() {
    this.userInfo = this.loginService.getUserInfoFromStorage();
    this.userName = this.layoutService.getUserFullName();
  }

  toogleSideNav() {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  }

  selectedRole;
  getRoleList(): void {
    this.selectedRole = this.localStorageService.getLocalStorageItem("role");
  }
  // navItems_pinLogin= [
  //   {
  //     id: 4,
  //     displayName: "Daybook Management",
  //     iconName: "fa fa-bar-chart-o",

  //     children: [
  //       {
  //         displayName: "Attendence",
  //         iconName: "fa fa-check-square",
  //         route: "pin/dashboard",
  //       },
  //     ],
  //   }
  // ]
}
