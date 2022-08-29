import { DateConverterService } from "@app/shared/services/dateConverter/date-converter.service";
import { DatePipe } from "@angular/common";
import { LocalStorageService } from "./../../../../../shared/services/local-storage/local-storage.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { SalarySheetService } from "./../../services/salary-sheet.service";
import { MonthlyReportService } from "./../../../../reports/monthly-report/services/monthly-report.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { Component, OnInit } from "@angular/core";
declare var require: any;
var adbs = require("ad-bs-converter");
@Component({
  selector: "app-search-payroll",
  templateUrl: "./search-payroll.component.html",
  styleUrls: ["./search-payroll.component.scss"],
})
export class SearchPayrollComponent implements OnInit {
  dateSetting = this.globalService.getDateSettingFromStorage();
  nepaliMonth = this.globalService.nepaliMonth;
  englishMonth = this.globalService.englishMonth;
  monthList: any;
  yearList: any;
  englishYear = this.globalService.englishYear;
  NepaliYear = this.globalService.nepaliYear;

  staffList: any;
  staff_id = this.localStorageService.getLocalStorageItem("user_id");
  loading: boolean;
  payrollList: any;
  companyId = this.globalService.getCompanyIdFromStorage();
  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;

  currentEnglishMonth = this.globalService.currentEnglishMonth;
  currentNepaliMonth = this.globalService.currentNepaliMonth;

  currentNepaliYear = this.globalService.currentNepaliYear;

  englishFirstDayOfMonth = this.globalService.englishFirstDayOfMonth;

  nepaliFirstDayInString = this.globalService.nepaliFirstDayInString;

  // current nepali year object
  currentNepaliYearObject = this.globalService.currentNepaliYearObject;
  currentNepaliLastDayOfMonth = `${this.currentNepaliYear}-${this.currentNepaliMonth}-${this.currentNepaliYearObject.en.totalDaysInMonth}`;

  month =
    this.dateSetting.GS_DATE == "E"
      ? new Date().getMonth() + 1
      : this.currentNepaliMonth;
  year =
    this.dateSetting.GS_DATE == "E"
      ? new Date().getFullYear()
      : this.currentNepaliYear;

  constructor(
    private globalService: GlobalService,
    private monthlyReportService: MonthlyReportService,
    private salarySheetService: SalarySheetService,
    private tosterMessageService: ToastrMessageService,
    private router: Router,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private datePipe: DatePipe,
    private dateConverterService: DateConverterService
  ) {}

  ngOnInit() {
    this.getStaffList();
    this.setMonthAndYearType();
    this.searchPayroll(this.searchPayrollBody);
    this.buildSearchSalaryForm();
  }
  // get body for search payroll
  searchPayrollBody = {
    date_from:
      this.dateSetting.GS_DATE == "E"
        ? this.englishFirstDayOfMonth
        : this.bsToAdInString(this.nepaliFirstDayInString),
    date_to:
      this.dateSetting.GS_DATE == "E"
        ? this.datePipe.transform(
            new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            "yyyy-MM-dd"
          )
        : this.bsToAdInString(this.currentNepaliLastDayOfMonth),
    company_id: this.companyId,
    limit: this.limit,
    page: 1,
    sortno: 1,
    sortnane: "staff_id",
    search: {
      staff_id: "",
      salary: "",
      status: "",
      bonus_advance: "",
    },
  };

  searchSalaryForm: FormGroup;
  buildSearchSalaryForm() {
    this.searchSalaryForm = this.fb.group({
      user_id: [this.staff_id ? this.staff_id : ""],
      month: [this.month, Validators.required],
      year: [this.year ? this.year : "", Validators.required],
    });
  }

  getStaffList() {
    this.monthlyReportService
      .getStaffList()
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.staffList = response.data;
          return;
        }
      });
  }

  searchPayroll(body) {
    this.loading = true;
    this.salarySheetService.searchPayroll(body).subscribe(
      (response) => {
        if (response.status) {
          this.payrollList = response.data;
        }
      },
      (error) => {
        this.loading = false;
        this.tosterMessageService.showError(error);
      },
      () => {
        this.loading = false;
      }
    );
  }

  navigateToGenerateSalary() {
    this.router.navigate(["/salary/monthly-salary-sheet/monthly-payroll"]);
  }

  // method get fired when user change the month in dropdown.
  getFirstAndLastDayOfMonth(value) {}

  // date formator for nepali date-picker
  dateFormatter(date) {
    const formatedDate = `${date.year}-${parseInt(date.month) + 1}-${date.day}`;
    return formatedDate;
  }

  setMonthAndYearType() {
    this.monthList =
      this.dateSetting.GS_DATE === "E" ? this.englishMonth : this.nepaliMonth;
    this.yearList =
      this.dateSetting.GS_DATE === "E" ? this.englishYear : this.NepaliYear;
  }

  onSearchPayroll() {
    if (this.searchSalaryForm.invalid) return;
    if (this.searchSalaryForm.pristine) return;

    if (this.dateSetting.GS_DATE == "E") {
      // first day of selected day and month
      this.searchPayrollBody.date_from = `${this.searchSalaryForm.value.year}-${
        this.searchSalaryForm.value.month
      }-${1}`;
      // last day of selected month and year
      this.searchPayrollBody.date_to = this.datePipe.transform(
        new Date(
          this.searchSalaryForm.value.year,
          this.searchSalaryForm.value.month,
          0
        ),
        "yyyy-MM-dd"
      );
      this.searchPayrollBody.search.staff_id = this.searchSalaryForm.value.user_id;
      this.searchPayroll(this.searchPayrollBody);
    } else {
      this.searchPayrollBody.date_from = this.bsToAdInString(
        `${this.searchSalaryForm.value.year}/${
          this.searchSalaryForm.value.month
        }/${1}`
      );

      // english first of current month for converting ad to bs
      const FirstDay = this.datePipe.transform(
        this.searchPayrollBody.date_from,
        "yyyy/MM/dd"
      );

      // calculated to find last nepali day.
      const nepaliDateObject = adbs.ad2bs(FirstDay);

      // nepali last day of selected month converted into AD
      this.searchPayrollBody.date_to = this.bsToAdInString(
        `${this.searchSalaryForm.value.year}-${this.searchSalaryForm.value.month}-${nepaliDateObject.en.totalDaysInMonth}`
      );

      // console.log(this.searchPayrollBody);
      this.searchPayroll(this.searchPayrollBody);
    }
  }

  bsToAdInString(dateInBs) {
    return this.dateConverterService.bsToAdInString(dateInBs);
  }
  adToBsInString(dateInAd) {
    return this.dateConverterService.adToBsInString(dateInAd);
  }
}
