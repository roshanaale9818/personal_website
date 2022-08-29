import { formatDate } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DashboardService } from "@app/modules/dashboard/services/dashboard.service";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { GlobalService } from "@app/shared/services/global/global.service";

@Component({
  selector: "app-admin-dashboard",
  // encapsulation: ViewEncapsulation.None,
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
})
export class AdminDashboardComponent implements OnInit {
  bsInlineValue = new Date();
  todayDate = "";
  constructor(
    private globalService:GlobalService,
    private dashboardService:DashboardService
  ) {}

  ngOnInit() {
    this.changeDateFormat();
    this.getAdminDashboardSummary();
  }

  changeDateFormat() {
    this.todayDate = formatDate(
      this.bsInlineValue,
      "dd-MM-yyyy hh:mm:ss a",
      "en-US"
    );
  }
  
  summaryDataObj: any = {
    totalstaff: "",
    activeusers: "",
    pending_leave: "",
    approve_leave: "",
    decline_leave: "",
    today_present_staff: "",
    attendance_correction: "",
    upcomming_holiday: []
  }
  getAdminDashboardSummary() {
    this.dashboardService.getAdminDashboardSummary(this.globalService.getCompanyIdFromStorage())
      .subscribe((res: CustomResponse) => {
        if (res.status) {
          this.summaryDataObj = res.data
        }
        else{
          this.summaryDataObj = {};
        }
      })

  }
  
}
