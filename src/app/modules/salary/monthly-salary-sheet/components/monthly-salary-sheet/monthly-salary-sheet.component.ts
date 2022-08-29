import { DateConverterService } from "./../../../../../shared/services/dateConverter/date-converter.service";
import { DatePipe } from "@angular/common";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { SalarySheetService } from "./../../services/salary-sheet.service";
import { MonthlyReportService } from "./../../../../reports/monthly-report/services/monthly-report.service";
import { CustomResponse } from "./../../../../../shared/models/custom-response.model";
import { GlobalService } from "./../../../../../shared/services/global/global.service";
import { Component, OnInit } from "@angular/core";

declare var require: any;
var adbs = require("ad-bs-converter");
@Component({
  selector: "app-monthly-salary-sheet",
  templateUrl: "./monthly-salary-sheet.component.html",
  styleUrls: ["./monthly-salary-sheet.component.scss"],
})
export class MonthlySalarySheetComponent implements OnInit {
  dateSetting = this.globalService.getDateSettingFromStorage();

  // list of english and nepali month.
  nepaliMonth = this.globalService.nepaliMonth;
  englishMonth = this.globalService.englishMonth;

  // list of english and nepali month..
  englishYear = this.globalService.englishYear;
  NepaliYear = this.globalService.nepaliYear;

  // current nepali month and year
  currentNepaliMonth = this.globalService.currentNepaliMonth;
  currentNepaliYear = this.globalService.currentNepaliYear;

  // current nepali year object
  currentNepaliYearObject = this.globalService.currentNepaliYearObject;

  currentNepaliLastDayOfMonth = `${this.currentNepaliYear}-${this.currentNepaliMonth}-${this.currentNepaliYearObject.en.totalDaysInMonth}`;

  // english and nepali first day of month...
  englishFirstDayOfMonth = this.globalService.englishFirstDayOfMonth;

  nepaliFirstDayInString = this.globalService.nepaliFirstDayInString;

  month =
    this.dateSetting.GS_DATE == "E"
      ? new Date().getMonth() + 1
      : this.currentNepaliMonth;
  year =
    this.dateSetting.GS_DATE == "E"
      ? new Date().getFullYear()
      : this.currentNepaliYear;

  monthList: any;
  yearList: any;
  staffList: any;

  generatedPayrollList: any;
  payrollList: any;

  loading: boolean;

  constructor(
    private globalService: GlobalService,
    private monthlyReportService: MonthlyReportService,
    private salarySheetService: SalarySheetService,
    private tosterMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private datePipe: DatePipe,
    private dateConverterService: DateConverterService
  ) {}

  ngOnInit() {
    this.getStaffList();
    this.generatePayroll(this.generatePayrollBody);
    this.setMonthAndYearType();
    this.buildGeneratePayrollForm();
    console.log(this.currentNepaliYearObject);
  }
  companyId = this.globalService.getCompanyIdFromStorage();
  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;

  staff_id = this.localStorageService.getLocalStorageItem("user_id");

  generatePayrollForm: FormGroup;
  buildGeneratePayrollForm() {
    this.generatePayrollForm = this.fb.group({
      user_id: [this.staff_id ? this.staff_id : ""],
      month: [
        this.month ? this.month : "",
        [Validators.required, this.monthCheckValidator.bind(this)],
      ],
      year: [this.year ? this.year : "", Validators.required],
    });
  }

  setMonthAndYearType() {
    this.monthList =
      this.dateSetting.GS_DATE === "E" ? this.englishMonth : this.nepaliMonth;
    this.yearList =
      this.dateSetting.GS_DATE === "E" ? this.englishYear : this.NepaliYear;
  }

  // date formator for nepali date-picker
  dateFormatter(date) {
    const formatedDate = `${date.year}-${parseInt(date.month) + 1}-${date.day}`;
    return formatedDate;
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
  generatePayroll(body) {
    this.loading = true;
    this.salarySheetService.generatePayroll(body).subscribe(
      (response) => {
        if (response.status) {
          this.generatedPayrollList = response.data;
        }
      },
      (error) => {
        this.tosterMessageService.showError(error);
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }
  currentMonth = new Date().getMonth() + 1;
  monthCheckValidator(control: AbstractControl) {
    if (this.month < control.value) {
      return { monthValidator: true };
    }
  }

  //generatee payroll body
  generatePayrollBody = {
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
  };

  OnGeneratePayroll() {
    if (this.generatePayrollForm.invalid) return;
    if (this.generatePayrollForm.pristine) return;

    if (this.dateSetting.GS_DATE == "E") {
      this.generatePayrollBody.date_from = `${
        this.generatePayrollForm.value.year
      }-${this.generatePayrollForm.value.month}-${1}`;
      this.generatePayrollBody.date_to = this.datePipe.transform(
        new Date(
          this.generatePayrollForm.value.year,
          this.generatePayrollForm.value.month,
          0
        ),
        "yyyy-MM-dd"
      );

      this.generatePayroll(this.generatePayrollBody);
    } else {
      this.generatePayrollBody.date_from = this.bsToAdInString(
        `${this.generatePayrollForm.value.year}/${
          this.generatePayrollForm.value.month
        }/${1}`
      );

      // english first of current month for converting ad to bs
      const FirstDay = this.datePipe.transform(
        this.generatePayrollBody.date_from,
        "yyyy/MM/dd"
      );

      // calculated to find last nepali day.
      const nepaliDateObject = adbs.ad2bs(FirstDay);

      // nepali last day of selected month converted into AD
      this.generatePayrollBody.date_to = this.bsToAdInString(
        `${this.generatePayrollForm.value.year}-${this.generatePayrollForm.value.month}-${nepaliDateObject.en.totalDaysInMonth}`
      );

      this.generatePayroll(this.generatePayrollBody);
    }
  }

  bsToAdInString(dateInBs) {
    return this.dateConverterService.bsToAdInString(dateInBs);
  }
  adToBsInString(dateInAd) {
    return this.dateConverterService.adToBsInString(dateInAd);
  }
}
