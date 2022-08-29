import { LocalStorageService } from "./../../../../shared/services/local-storage/local-storage.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { YearlyMonthlyReportService } from "./../services/yearly-monthly.service";
import { GlobalService } from "./../../../../shared/services/global/global.service";
import { CustomResponse } from "./../../../../shared/models/custom-response.model";
import { MonthlyReportService } from "./../../monthly-report/services/monthly-report.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

@Component({
  selector: "app-yearly-monthly-report",
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./yearly-monthly-report.component.html",
  styleUrls: ["./yearly-monthly-report.component.scss"],
})
export class YearlyMonthlyReportComponent implements OnInit {
  staffList: any;
  yearlyReportForm: FormGroup;
  dateSetting = this.globalService.getDateSettingFromStorage();
  yearList =
    this.dateSetting.GS_DATE == "E"
      ? this.yearlyMonthlyReportService.englishYearList
      : this.yearlyMonthlyReportService.nepaliYearList;

  row = ["1"];
  loading: boolean;
  yearlyReportList: any;

  constructor(
    private monthlyReportService: MonthlyReportService,
    private globalService: GlobalService,
    private yearlyMonthlyReportService: YearlyMonthlyReportService,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,

    private sanitizer: DomSanitizer
  ) {
    this.getYearlyReport();
  }
  staff_id = +this.localStorageService.getLocalStorageItem("user_id");
  ngOnInit() {
    this.getStaffList();
    this.buildYearlyReportForm();

  }

  englishYear = new Date().getFullYear();
  nepaliyear = this.globalService.currentNepaliYear;
  displayYear =
    this.dateSetting.GS_DATE == "E" ? this.englishYear : this.nepaliyear;

  buildYearlyReportForm() {
    this.yearlyReportForm = this.fb.group({
      id: [this.staff_id ? this.staff_id : ""],
      year: [
        this.dateSetting.GS_DATE == "E" ? this.englishYear : this.nepaliyear,
      ],
    });
  }
  // async getAndBuild() {
  //   await this.getStaffList().then(
  //     (response: CustomResponse) => {
  //       if (response.status) {
  //         this.staffList = response.data;
  //         return;
  //       }


  //     }
  //   )
  //   this.buildYearlyReportForm();
  // }nepalimode
  //nepali mode added for month
  getStaffList() {
    return this.monthlyReportService
      .getStaffList()
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.staffList = response.data;
          this.yearlyReportForm.get('id').setValue(String(this.staff_id))
          return;
        }
      });
  }

  // initial value of params.
  params = {
    user_id: this.staff_id,
    year: this.dateSetting.GS_DATE == "E" ? this.englishYear : this.nepaliyear,
    date_format: this.dateSetting.GS_DATE == "E" ? "English" : "Nepali",
  };
  username: string;

  getYearlyReport(): void {
    // return;
    this.loading = true;
    this.yearlyMonthlyReportService.getYearlyReport(this.params).subscribe(
      (response) => {
        if (response.status) {
          this.yearlyReportList = response.data.allmonthrecord;
          this.username = response.data.staffname;
          this.loading = false;
          return;
        } else {
          this.yearlyReportList = [];
          this.username = "";
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
      },
      () => {
        // this.loading = false;
      }
    );
  }

  OnYearChange(year) {
    let newYear = new Date(year);
    this.params.year = newYear.getFullYear();
  }

  searchReport() {
    this.displayYear = this.yearlyReportForm.value.year;
    this.getYearlyReport();
  }

  checkHours(item) {
    let indexOfColon = item.attendance.indexOf(":");
    let lengthOfString = item.attendance.length - 1;
    let hour = item.attendance.substr(0, indexOfColon);
    let minute = item.attendance.substr(indexOfColon + 1, lengthOfString);
    if (minute == ":00") {
      minute = "0";
    }
    if (parseInt(hour) >= 8) {
      return true;
    } else {
      return false;
    }
  }

  public colorCode(item): SafeStyle {
    let result;
    if (item.weekend !== "") {
      //  weekend color
      result = "#9bc4db";
    }
    if (item.attendance !== "00:00" && item.weekend == "") {
      if (this.checkHours(item)) {
        // hours meet color
        result = "rgba(151, 233, 173, 0.68)";
      } else {
        // hour not meet color
        result = "rgb(255, 128, 128)";
      }
    }
    return this.sanitizer.bypassSecurityTrustStyle(result);
  }
  datePickerConfig: any = {
    containerClass: "theme-dark-blue",
    showWeekNumbers: false,
    minMode: 'year',
    adaptivePosition: true,
    dateInputFormat: 'YYYY'
  }
}
