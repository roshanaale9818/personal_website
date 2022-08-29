import { DateConverterService } from "./../../../../../shared/services/dateConverter/date-converter.service";
import { LocalStorageService } from "./../../../../../shared/services/local-storage/local-storage.service";
import { GlobalService } from "./../../../../../shared/services/global/global.service";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IntlService } from "@progress/kendo-angular-intl";
import { Router } from "@angular/router";
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
  Renderer2,
} from "@angular/core";
import { DashboardService } from "@app/modules/dashboard/services/dashboard.service";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { Holiday } from "../../interfaces/holiday.interface";

@Component({
  selector: "app-bent-ray-staff-dashboard",
  templateUrl: "./bent-ray-staff-dashboard.component.html",
  styleUrls: ["./bent-ray-staff-dashboard.component.scss"],
})
export class BentRayStaffDashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private localStorageService: LocalStorageService,
    private zone: NgZone,
    private renderer: Renderer2,
    private dateConverterService: DateConverterService,
    public intl: IntlService,
    private dashboardService: DashboardService
  ) {
    this.showTime();
  }
  dateConvertForm: FormGroup;
  regex = RegexConst;
  dateSetting = this.globalService.getDateSettingFromStorage();
  staffName =
    this.localStorageService.getLocalStorageItem("user_info").first_name;
  currentNepaliDateObject = this.globalService.currentNepaliYearObject;
  currentNepaliDate =
    this.currentNepaliDateObject.ne.year +
    "  " +
    this.currentNepaliDateObject.ne.strMonth +
    "  " +
    this.currentNepaliDateObject.ne.day;
  todaysDateInEnglish = new Date();
  @ViewChild("time", { static: false })
  public time: ElementRef;
  convertedDateInBs;
  convertedDateInAd;
  ngOnInit() {
    this.buildForm();
    this.getStaffDashboardSummary();
  }

  buildForm() {
    this.dateConvertForm = this.fb.group({
      ad: ["", [Validators.required, Validators.pattern(this.regex.DATE)]],
      bs: ["", [Validators.required, Validators.pattern(this.regex.DATE)]],
    });
  }

  convertToBs() {
    if (this.dateConvertForm.get("ad").invalid) return;
    if (this.dateConvertForm.value.ad) {
      this.convertedDateInBs = this.dateConverterService.adToBsInString(
        this.dateConvertForm.value.ad
      );
    }
  }

  convertToAd() {
    if (this.dateConvertForm.get("bs").invalid) return;
    if (this.dateConvertForm.value.bs) {
      this.convertedDateInAd = this.dateConverterService.bsToAdInString(
        this.dateConvertForm.value.bs
      );
    }
  }

  navigateToReport() {
    this.router.navigate(["/reports/monthly-report"]);
  }
  navigateToCorrection() {
    this.router.navigate(["/daybook-management/correction-attendance"]);
  }
  navigateToAttendance() {
    this.router.navigate(["/daybook-management/attendance"]);
  }
  navigateToLeaveRequest() {
    this.router.navigate(["/leave-request/create"]);
  }
  // navigateToYearlyReport() {
  //   this.router.navigate(["/reports/yearly-monthly-reports"]);
  // }
  navigateToMessage() {
    this.router.navigate(["/message"]);
  }

  // logic to show time in 1s interval
  showTime() {
    this.zone.runOutsideAngular(() => {
      setInterval(() => {
        let timezoneDate = this.dateConverterService.getTimeFromTimeZone(
          this.dateSetting.GS_TIME_ZONE
        );
        this.renderer.setProperty(
          this.time.nativeElement,
          "textContent",
          // this.datePipe.transform(new Date(), "hh:mm:ss a")
          this.intl.formatDate(timezoneDate, "hh:mm:ss a")
        );
      }, 1);
    });
  }
  staffDashboardSummaryObj: any = {
    att_correction_pending: "",
    att_correction_approve: "",
    att_correction_decline: "",
    approve_leave: "",
    decline_leave: "",
    pending_leave: "",
    upcomming_holiday: []
  }
  upcommingHolidays:Holiday[] = [];
  getStaffDashboardSummary() {
    this.dashboardService.getStaffDashboardSummary(this.globalService.getCompanyIdFromStorage())
      .subscribe((res: CustomResponse) => {
        console.log(res);
        if(res.status){
          this.upcommingHolidays = res.data.upcomming_holiday
        }
        console.log(this.upcommingHolidays);
        // this.upcommingHolidays =
      })
  }
}
