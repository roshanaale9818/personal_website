import { Component, OnInit } from "@angular/core";
import { GlobalService } from "@app/shared/services/global/global.service";
import { ClientwiseAttendanceReportService } from "../services/clientwise-attendance-report.service";

@Component({
  selector: "app-clientwise-attendance-report",
  templateUrl: "./clientwise-attendance-report.component.html",
  styleUrls: ["./clientwise-attendance-report.component.scss"],
})
export class ClientwiseAttendanceReportComponent implements OnInit {
  companyId = this.globalService.getCompanyIdFromStorage();
  dateSetting = this.globalService.getDateSettingFromStorage();

  constructor(
    private clientwiseAttendanceReportService: ClientwiseAttendanceReportService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    this.getClient();
    console.log(this.dateSetting);
  }

  getClient(): void {
    this.clientwiseAttendanceReportService
      .getClientList(this.companyId)
      .subscribe((response) => {
        if (response) {
          console.log(response);
        }
      });
  }
}
