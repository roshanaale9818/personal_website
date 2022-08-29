import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { DateConverterService } from "@app/shared/services/dateConverter/date-converter.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BsDatepickerConfig } from "ngx-bootstrap";
import { MonthlyReportService } from "../../monthly-report/services/monthly-report.service";
import { BreakReportService } from "../services/break-report.service";

@Component({
  selector: "app-break-report",
  templateUrl: "./break-report.component.html",
  styleUrls: ["./break-report.component.scss"],
})
export class BreakReportComponent implements OnInit {
  breakReportForm: FormGroup;

  public datePickerConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  staff_id = this.localStorageService.getLocalStorageItem("user_id");
  dateSetting = this.globalService.getDateSettingFromStorage();

  public gridView: GridDataResult;
  todaysDateInEnglish = new Date();
  staffList;
  rowCallback;
  loading;
  courseList;
  reportList: [] = [];

  constructor(
    private globalService: GlobalService,
    private monthlyReportService: MonthlyReportService,
    private localStorageService: LocalStorageService,
    private breakReportService: BreakReportService,
    private dateConverterService: DateConverterService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) {
    this.datePickerConfig = Object.assign(
      {},
      {
        containerClass: "theme-dark-blue",
        showWeekNumbers: false,
        dateInputFormat: "MM/DD/YYYY",
      }
    );
  }

  ngOnInit() {
    this.getStaffList();
    this.breakBreakReportForm();
    this.getBreakReport();
  }

  nepaliFirstDayOfMonth = this.globalService.nepalifirstDayOfMonth;
  currentNepaliDate = this.globalService.currentNepaliDate;
  breakBreakReportForm(): void {
    const dateType = this.dateSetting.GS_DATE;
    this.breakReportForm = this.formBuilder.group({
      id: this.staff_id ? this.staff_id : "",
      date_from: [
        dateType == "E"
          ? this.englishFirstDayOfMonth
          : this.nepaliFirstDayOfMonth,
      ],
      date_to: [
        dateType == "E" ? this.currentDateInEnglish : this.currentNepaliDate,
      ],
    });
  }

  // date formator for nepali date-picker
  dateFormatter(date) {
    const formatedDate = `${date.year}-${parseInt(date.month) + 1}-${date.day}`;
    return formatedDate;
  }

  getStaffList() {
    this.breakReportService
      .getStaffList()
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.staffList = response.data;
          console.log(this.staffList);
          this.returnStaffWithId(response);
        }
      });
  }

  user;
  returnStaffWithId(response) {
    this.user = [];

    response.data.forEach((item) => {
      if (item.user_id == this.params.id) {
        this.user.push(item);
      }
    });
  }

  bsToAdInString(dateInBs) {
    return this.dateConverterService.bsToAdInString(dateInBs);
  }

  englishFirstDayOfMonth = this.datePipe.transform(
    this.globalService.englishFirstDayOfMonth,
    " MM/dd/yyyy"
  );

  nepaliFirstDayInString = this.globalService.nepaliFirstDayInString;
  currentDateInEnglish = this.datePipe.transform(
    this.todaysDateInEnglish,
    " MM/dd/yyyy"
  );
  currentNepaliDateInString = this.globalService.currentNepaliDateInString;

  // initial value of params.
  params = {
    id: this.staff_id,
    date_from:
      this.dateSetting.GS_DATE == "E"
        ? this.englishFirstDayOfMonth
        : this.bsToAdInString(this.nepaliFirstDayInString),
    date_to:
      this.dateSetting.GS_DATE == "E"
        ? this.currentDateInEnglish
        : this.bsToAdInString(this.currentNepaliDateInString),
  };

  breakReportList;
  getBreakReport(): void {
    this.loading = true;
    this.breakReportService
      .getBreakReport(this.params)
      .subscribe((response) => {
        if (response) {
          this.breakReportList = response.data;
          console.log(this.breakReportList, "la auna parne yai ho");
        }
      });
  }

  searchBreakReport(): void {
    if (this.breakReportForm.invalid) return;
    this.params.id = this.breakReportForm.value.id;

    if (this.dateSetting.GS_DATE == "E") {
      this.params.date_from = this.globalService.transformFromDatepicker(
        this.breakReportForm.value.date_from
      );
      this.params.date_to = this.globalService.transformFromDatepicker(
        this.breakReportForm.value.date_to
      );
      // If the date is in Nepali format
    } else {
      // convert nepali date to english......
      let dateFromInString = `${this.breakReportForm.value.date_from.year}/${this.breakReportForm.value.date_from.month}/${this.breakReportForm.value.date_from.day}`;
      this.params.date_from = this.bsToAdInString(dateFromInString);

      let dateToInString = `${this.breakReportForm.value.date_to.year}/${this.breakReportForm.value.date_to.month}/${this.breakReportForm.value.date_to.day}`;
      this.params.date_to = this.bsToAdInString(dateToInString);
    }
    this.getBreakReport();
  }
}
