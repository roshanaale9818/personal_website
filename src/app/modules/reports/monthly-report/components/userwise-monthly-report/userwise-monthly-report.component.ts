import { DateConverterService } from "@app/shared/services/dateConverter/date-converter.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { DatePipe, DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit, TemplateRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GlobalService } from "@app/shared/services/global/global.service";
import { Summary } from "../userwise-monthly-report/models/userwise-monthly-report.model";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import {
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";

import { BsDatepickerConfig, BsModalRef, BsModalService } from "ngx-bootstrap";

import { MonthlyReportService } from "../../services/monthly-report.service";
import {
  UserwiseMonthlyReport,
  Attendance,
} from "./models/userwise-monthly-report.model";
import { Employee } from "@app/shared/models/employee.model";
import { UserPreferenceSettingService } from "@app/modules/setting/user-preference-setting/services/user-preference-setting.service";
import { WeeklyReports } from "../../models/monthly-reports.models";
import { NepaliDatePickerSettings } from './../../../../../shared/components/nepali-date-picker/modals/nepalidatepickersettings.interface';
import { AdBsDateConvertService } from "@app/shared/components/custom-nepalidatepicker/services/ad-bs-date-convert.service";
declare var require: any;
var adbs = require("ad-bs-converter");

@Component({
  selector: "app-userwise-monthly-report",
  templateUrl: "./userwise-monthly-report.component.html",
  styleUrls: ["./userwise-monthly-report.component.scss"],
})
export class UserwiseMonthlyReportComponent implements OnInit {
  addAttendanceForm: FormGroup;
  companyId = this.globalService.getCompanyIdFromStorage();
  showMonthlyReport: boolean = false;
  loading: boolean;
  monthType;
  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
  };

  userwiseMonthlyReportList: UserwiseMonthlyReport;
  summaryList: Summary;
  userMonthlyReport: Attendance[] = [];

  todaysDateInEnglish = new Date();
  userwiseMonthlyReportForm: FormGroup;

  role = this.localStorageService.getLocalStorageItem("role");
  userId = this.localStorageService.getLocalStorageItem("staff_id");
  user_id = this.localStorageService.getLocalStorageItem("user_id");
  datePickerConfig: Partial<BsDatepickerConfig>;

  //Kendo Table
  public state: State = {
    skip: 0,
    take: 32,
    //initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
    sort: [{ dir: "asc", field: "" }],
  };
  public gridView: GridDataResult;

  // to expand the + button in Kendo Grid
  public expandedDetailKeys: any[] = [1];

  public showMoreDetails(dataItem: any, index: number) {
    return null;
  }
  timeFormatSetting;
  dateSetting = this.globalService.getDateSettingFromStorage();
  dateFormat = this.dateSetting.GS_DT_FORMAT;
  nepaliFirstDayOfMonth = this.globalService.nepalifirstDayOfMonth;
  nepaliFirstDayInString = this.globalService.nepaliFirstDayInString;

  currentNepaliMonth = this.globalService.currentNepaliMonth;

  currentNepaliDate = this.globalService.currentNepaliDate;
  currentNepaliDateInString = this.globalService.currentNepaliDateInString;
  // todaysDateInEnglish = new Date();
  currentDateInenglish = this.datePipe.transform(
    this.todaysDateInEnglish,
    "MM-dd-yyyy"
  );

  showDepartment: boolean = true;
  showEmpId: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private globalService: GlobalService,
    private localStorageService: LocalStorageService,
    private userwiseMonthlyReportService: MonthlyReportService,
    private modalService: BsModalService,
    private toastrMessageService: ToastrMessageService,
    private dateConverterService: DateConverterService,
    private adbsConvertService:AdBsDateConvertService,
    @Inject(DOCUMENT) private document: Document,

    private userPreferenceService: UserPreferenceSettingService
  ) {
    //get the setting by userpreference
    this.timeFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_TIME_FORMAT");
    this.dateFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
    //configure the setting by general and userwise preference
    this.configUserDateAndTimeSetting();
    // this.configureUserPreferenceSetting();
    this.initSettings();
  }
  nepaliMonthType;
  englishMonthType;
  ngOnInit() {
    this.getUserPreference();
    if (this.role == "staff") {
      this.reportType = "daily";
    }
    this.buildReportForm();
    this.buildAddAttendanceForm();
    this.englishMonthType = this.globalService.englishMonth;
    this.nepaliMonthType = this.globalService.nepaliMonth;
    this.getEmployeeList();
  }

  buildReportForm() {
    this.userwiseMonthlyReportForm = this.formBuilder.group({
      client_id: [""],
      user: [""],
      types: "",
      reportType: [this.reportType ? this.reportType : null],

      date: this.assignDailyDateBySetting(),
      month: [this.datePickerFormat == "E" ? this.globalService.currentEnglishMonth :
        this.getCurrentNepaliMonth()],
      id: "",

      gracetime: "",
      // date_from: [
      //   this.datePipe.transform(
      //     this.globalService.englishFirstDayOfMonth,
      //     "MM-dd-yyyy"
      //   ),
      //   Validators.required,
      //   ,
      // ],
      date_from: [
        // this.datePipe.transform(
        //   this.globalService.englishFirstDayOfMonth,
        //   "MM-dd-yyyy"
        // ),
        this.dateSetting.GS_DATE && this.dateSetting.GS_DATE !== 'N' ?
        this.globalService.transformForDatepickerPreview(
          this.globalService.englishFirstDayOfMonth,
          this.datePickerConfig.dateInputFormat
        ):"",
        Validators.required,
        ,
      ],
      // date_to: [this.currentDateInenglish, [Validators.required]],
      date_to: [
        this.dateSetting.GS_DATE && this.dateSetting.GS_DATE !== 'N' ?
       this.globalService.transformForDatepickerPreview(
        this.currentDateInenglish,
        this.datePickerConfig.dateInputFormat
      ):"",],
      begDate: "",
      status: "",
      endDate: "",
      department_column: "",
      eeid_column: "",
      lunch_column: "",
    });
  }

  timeFormat;

  setTimeFormatSetting(): void {
    if (this.timeFormatSetting) {
      this.timeFormat = this.timeFormatSetting.value;
    } else {
      this.timeFormat = "12";
    }
  }

  // buildMonthlyReportForm(): void {
  //   const monthType = this.dateSetting.GS_DATE;
  //   this.userwiseMonthlyReportForm = this.formBuilder.group({
  //     month:
  //       monthType == "E"
  //         ? this.globalService.currentEnglishMonth
  //         : this.globalService.currentNepaliMonth,
  //     user_id: ["", [Validators.required]],
  //     id: this.userId,
  //     date_from:
  //       monthType == "E"
  //         ? this.globalService.transformForDatepickerPreview(
  //           this.globalService.englishFirstDayOfMonth
  //         )
  //         : this.nepalifirstDayOfMonth,
  //     date_to:
  //       monthType == "E"
  //         ? this.datePipe.transform(this.todaysDateInEnglish, "MM-dd-yyyy")
  //         : this.currentNepaliDate,
  //     //reportType for toggling fields
  //     reportType: [this.reportType ? this.reportType : null],
  //     date: this.globalService.transformForDatepickerPreview(
  //       this.currentDateInenglish,
  //       this.datePickerConfig.dateInputFormat
  //     ),
  //   });
  // }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.userMonthlyReport, this.state);
  }

  nepalifirstDayOfMonth = this.globalService.nepalifirstDayOfMonth;
  englishFirstDayOfMonth = this.globalService.englishFirstDayOfMonth;
  currentNepaliYear = this.globalService.currentNepaliYear;

  // method get fired when user change the month in dropdown.
  getFirstAndLastDayOfMonth(value) {
    // this.globalService.englishFirstDayOfMonth = this.datePipe.transform(
    //   new Date(this.todaysDateInEnglish.getFullYear(), value - 1, 1),
    //   this.datePickerConfig.dateInputFormat
    // );

    let englishFirstDayOfMonth =
      this.globalService.transformForDatepickerPreview(
        new Date(this.todaysDateInEnglish.getFullYear(), value - 1, 1),
        this.datePickerConfig.dateInputFormat
      );
    this.userwiseMonthlyReportForm
      .get("date_from")
      .patchValue(englishFirstDayOfMonth);

    // let englishLastDayOfMonth = this.datePipe.transform(
    //   new Date(this.todaysDateInEnglish.getFullYear(), value, 0),
    //   "MM-dd-yyyy"
    // );
    let englishLastDayOfMonth =
      this.globalService.transformForDatepickerPreview(
        new Date(this.todaysDateInEnglish.getFullYear(), value, 0),
        this.datePickerConfig.dateInputFormat
      );
    this.userwiseMonthlyReportForm
      .get("date_to")
      .patchValue(englishLastDayOfMonth);
  }
  setForNepaliDate(value,type:string){
    console.log("value and type",value,type)
  //  if(type == 'm'){
  //   this.dateConverterService.adToBsInObject(
  //     new Date
  //   )
  //  }
  }

  onNepaliDateChange(event,type){
  console.log("event and type",event,type)
  }

  endWeek;
  // Get the 7th day after selecting particular date
  getLastDayOfWeek(firstDay): void {
    var start = new Date(firstDay);
    var lastWeek = new Date(start.setDate(start.getDate() + 6));
    // this.endWeek = this.globalService.transformForDatepickerPreview(lastWeek);
    this.endWeek = this.globalService.transformForDatepickerPreview(
      lastWeek,
      this.datePickerConfig.dateInputFormat
    );
    this.userwiseMonthlyReportForm.get("endDate").patchValue(this.endWeek);
  }

  convertDateFormater(date) {
    return `${date.year}/${date.month + 1}/${date.day}`;
  }

  limit = "30";
  viewMonthly: boolean = false;
  viewCustom:boolean = false;
  viewDaily: boolean = false;
  viewWeekly: boolean = false;
  onSubmitStaffReport(dataItem): void {
    if (dataItem == "monthly" || dataItem == "custom" ) {
      this.viewMonthly = true;
      this.viewDaily = false;
      this.viewWeekly = false;
      this.loading = true;
      if (this.role == "staff") {
        this.userwiseMonthlyReportForm.patchValue({ user_id: this.userId });
      }
      if (this.datePickerFormat == "N") {
        const nepBody = {
          id: this.user_id,
          date_from: this.adbsConvertService.transformDateForAPI(
            this.userwiseMonthlyReportForm.value.date_from,this.datePickerConfig.dateInputFormat
          ),
          // this.userwiseMonthlyReportForm.value.date_to
          date_to: this.adbsConvertService.transformDateForAPI(
            this.userwiseMonthlyReportForm.value.date_to,this.datePickerConfig.dateInputFormat
          )
          ,
        };
        this.getMonthlyReportList(nepBody);
      } else {
        let userArray = [];
        userArray.push(String(this.user_id));
        const body = {
          // this.localStorageService.getLocalStorageItem("user_id")
          id: userArray,
          date_from: this.globalService.transformFromDatepicker(
            this.userwiseMonthlyReportForm.value.date_from
          ),
          date_to: this.globalService.transformFromDatepicker(
            this.userwiseMonthlyReportForm.value.date_to
          ),
        };
        this.getMonthlyReportList(body);
      }
    }
    if (dataItem == "daily") {
      this.viewDaily = true;
      let userArray = [];
      userArray.push(String(this.userId));
      this.viewMonthly = false;
      this.viewWeekly = false;
      this.viewMonthly = false;
      const body = {
        company_id: this.companyId,
        gracetime: "",
        user: userArray,
        type: "",
        client_id: "",
        date: this.datePickerFormat =='N'?
        this.adbsConvertService.transformDateForAPI(
          this.userwiseMonthlyReportForm.value.date,this.datePickerConfig.dateInputFormat
        ) :this.globalService.transformFromDatepicker(
          this.userwiseMonthlyReportForm.value.date
        ),

        department_column:
          this.userwiseMonthlyReportForm.value.department_column,

        eeid_column: this.userwiseMonthlyReportForm.value.eeid_column,
        lunch_column: this.userwiseMonthlyReportForm.value.lunch_column,
        limit: this.limit,
        page: this.globalService.pageNumber,
      };
      // if(this.dateLang == "N"){
      //   body.date = this.dateConverterService.bsToAdInString(
      //      this.convertDateFormater(
      //        this.userwiseMonthlyReportForm.value.date
      //      )
      //    )
      //  }
      this.getDailyReport(body);
    } else if (dataItem == "weekly") {
      let userArray = [];
      userArray.push(String(this.user_id));
      this.viewWeekly = true;
      this.viewDaily = false;
      this.viewCustom = false;

      this.viewMonthly = false;
      if (this.userwiseMonthlyReportForm.invalid) return;
      const body = {
        page: this.globalService.pageNumber,
        limit: this.limit,
        company_id: this.companyId,
        client_id: "",
        user: userArray,
        begDate: this.datePickerFormat == 'N'?
        this.adbsConvertService.transformDateForAPI(
          this.userwiseMonthlyReportForm.value.begDate,
          this.datePickerConfig.dateInputFormat
        )
        :this.globalService.transformFromDatepicker(
          this.userwiseMonthlyReportForm.value.begDate
        ),
        endDate:
        this.datePickerFormat == 'N'?
        this.adbsConvertService.transformDateForAPI(
          this.userwiseMonthlyReportForm.value.endDate,
          this.datePickerConfig.dateInputFormat
        ): this.globalService.transformFromDatepicker(
          this.userwiseMonthlyReportForm.value.endDate
        ),
        type: this.userwiseMonthlyReportForm.value.type,
        lunch_column: this.userwiseMonthlyReportForm.value.lunch_column,
      };
      // if(this.dateLang == "N"){
      //   body.begDate = this.dateConverterService.bsToAdInString(
      //      this.convertDateFormater(
      //        this.userwiseMonthlyReportForm.value.begDate
      //      )
      //    ),
      //    body.endDate =
      //    this.dateConverterService.bsToAdInString(
      //     this.convertDateFormater(
      //       this.userwiseMonthlyReportForm.value.endDate
      //     )
      //   )
      //  }
      this.getWeeklyReports(body);
    }
  }

  gridViewWeeklyReport: GridDataResult;
  weeklyReportList: WeeklyReports[] = [];

  grandTotalMonday;
  grandTotalTuesday;
  grandTotalWednesday;
  grandTotalThursday;
  grandTotalFriday;
  grandTotalSaturday;
  grandTotalSunday;
  grandTotal;

  head_fri;
  headMonday;
  headTuesday;
  headWednesday;
  headThursday;
  headFriday;
  headSaturday;
  headSunday;
  // Get Weekly Report
  getWeeklyReports(body): void {
    this.loading = true;
    this.userwiseMonthlyReportService.getWeeklyReport(body).subscribe(
      (response) => {
        if (response.status) {
          this.weeklyReportList = response.data;
          this.grandTotalMonday =
            response.summary.daily_total_hr.grand_total_mon;
          this.grandTotalTuesday =
            response.summary.daily_total_hr.grand_total_tue;
          this.grandTotalWednesday =
            response.summary.daily_total_hr.grand_total_wed;
          this.grandTotalThursday =
            response.summary.daily_total_hr.grand_total_thu;
          this.grandTotalFriday =
            response.summary.daily_total_hr.grand_total_fri;
          this.grandTotalSaturday =
            response.summary.daily_total_hr.grand_total_sat;
          this.grandTotalSunday =
            response.summary.daily_total_hr.grand_total_sun;
          this.grandTotal = response.summary.daily_head_count.grand_total;
          this.headMonday = response.summary.daily_head_count.head_mon;
          this.headTuesday = response.summary.daily_head_count.head_tue;
          this.headWednesday = response.summary.daily_head_count.head_wed;
          this.headThursday = response.summary.daily_head_count.head_thu;
          this.headFriday = response.summary.daily_head_count.head_fri;
          this.headSaturday = response.summary.daily_head_count.head_sat;
          this.headSunday = response.summary.daily_head_count.head_sun;

          this.gridViewWeeklyReport = {
            data: this.weeklyReportList,
            total: response.count,
          };
        } else {
          this.gridViewWeeklyReport = {
            data: [],
            total: 0,
          };
        }
      },
      (error) => {
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  pageLimit = parseInt(this.limit);
  skip = 0;
  dailyReportList: any[] = [];
  gridViewDailyReport: GridDataResult;
  // DAILY Get Reports
  getDailyReport(body): void {
    this.dailyReportList = [];
    this.loading = true;
    this.userwiseMonthlyReportService.getDailyReport(body).subscribe(
      (response) => {
        if (response.status) {
          this.dailyReportList = response.data;
          this.gridViewDailyReport = {
            data: response.data,
            total: response.count,
          };
        } else {
          this.gridViewDailyReport = { data: [], total: 0 };
        }
      },
      (error) => {
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  dataStateChangeDaily(event): void {}
  dataStateChangeWeekly(event): void {}

  onSubmitAdminReport(): void {
    this.showMonthlyReport = true;
    if (this.dateLang == "N") {
      const nepBody = {
        id: this.userwiseMonthlyReportForm.value.user_id,
        date_from: this.dateConverterService.bsToAdInString(
          this.convertDateFormater(
            this.userwiseMonthlyReportForm.value.date_from
          )
        ),
        date_to: this.dateConverterService.bsToAdInString(
          this.convertDateFormater(this.userwiseMonthlyReportForm.value.date_to)
        ),
      };
      this.getMonthlyReportList(nepBody);
    } else {
      const body = {
        id: this.userwiseMonthlyReportForm.value.user_id,
        date_from: this.globalService.transformFromDatepicker(
          this.userwiseMonthlyReportForm.value.date_from
        ),
        date_to: this.datePipe.transform(
          this.userwiseMonthlyReportForm.value.date_to,
          "yyyy-MM-dd"
        ),
      };
      this.getMonthlyReportList(body);
    }
  }

  dateFormatSetting: any;
  settingFromCompanyWise: any;
  configUserDateAndTimeSetting() {
    //if no userpreference
    this.settingFromCompanyWise = this.localStorageService.getLocalStorageItem(
      "setting_list"
    )
      ? this.localStorageService.getLocalStorageItem("setting_list")
      : null;
    if (!this.dateFormatSetting) {
      let generalDateFormatSetting = this.settingFromCompanyWise.filter(
        (x) => x.code == "GS_DT_FORMAT"
      )[0];
      this.datePickerConfig = Object.assign(
        {},
        {
          containerClass: "theme-dark-blue",
          showWeekNumbers: false,
          dateInputFormat:
            generalDateFormatSetting && generalDateFormatSetting.value == "0"
              ? "YYYY/MM/DD"
              : "MM/DD/YYYY",
        }
      );
    }
    //if user has userpreference
    else {
      this.datePickerConfig = Object.assign(
        {},
        {
          containerClass: "theme-dark-blue",
          showWeekNumbers: false,
          // dateInputFormat: "MM/DD/YYYY",
          dateInputFormat:
            this.dateFormatSetting &&
            this.dateFormatSetting.value == "yyyy/mm/dd"
              ? "YYYY/MM/DD"
              : "MM/DD/YYYY",
        }
      );
    }
    this.setTimeFormatSetting();
  }

  totalHours: number;
  forceChangeUserId: number;
  getMonthlyReportList(body): void {
    if (this.userwiseMonthlyReportForm.invalid) return;
    this.loading = true;
    this.userwiseMonthlyReportService.getUserwiseMonthlyReport(body).subscribe(
      (response) => {
        if (response.status) {
          this.userwiseMonthlyReportList = response.data;
          this.userMonthlyReport = response.data.attendance;
          this.summaryList = response.data.summary;
          this.forceChangeUserId = response.data.summary.user_id;
          this.gridView = process(this.userMonthlyReport, this.state);
        } else {
          this.gridView = process([], this.state);
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  // call back function to apply css to row of a kendo for Monthly Report.
  public rowCallback = (context, index) => {
    let date = this.datePipe.transform(context.dataItem.date, "yyyy/MM/dd");

    let dateObjectInAd = adbs.ad2bs(date);
    // checking weekend
    if (dateObjectInAd.en.dayOfWeek == 6 || dateObjectInAd.en.dayOfWeek == 0) {
      return {
        weekend: true,
      };
    }

    // checking absent
    else if (context.dataItem.in == "00:00") {
      return {
        absent: true,
      };
    } else if (context.dataItem.out == "00:00") {
      return {
        checkout: true,
      };
    }
    // checking present
    else {
      return {
        present: true,
      };
    }
  };

  // call back function to apply css to row of a kendo for Daily Report.
  public rowDailyCallback = (context, index) => {
    let date = this.datePipe.transform(context.dataItem.date, "yyyy/MM/dd");

    let dateObjectInAd = adbs.ad2bs(date);
    // checking weekend
    if (dateObjectInAd.en.dayOfWeek == 6 || dateObjectInAd.en.dayOfWeek == 0) {
      return {
        weekend: true,
      };
    }
    // checking absent
    else if (context.dataItem.time_in == "00:00") {
      return {
        absent: true,
      };
    } else if (context.dataItem.time_out == "00:00") {
      return {
        checkout: true,
      };
    }
    // checking present
    else {
      return {
        present: true,
      };
    }
  };

  employeeList: Employee[] = [];
  getEmployeeList(): void {
    this.userwiseMonthlyReportService.getStaffList().subscribe((response) => {
      if (response.status) {
        this.employeeList = response.data;
      } else {
        this.employeeList = [];
      }
    });
  }

  openAddAttendanceModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  buildAddAttendanceForm() {
    this.addAttendanceForm = this.formBuilder.group({
      company_id: this.companyId,
      user_id: [""],
      status: [""],
      lunchout_datetime: "",
      lunchin_datetime: "",
      checkin_datetime: [""],
      checkout_datetime: [""],
      checkin_message: [""],
      check: [""],
      lunch: [""],
    });
  }

  onSubmitAttendance(): void {
    let body = {
      client_id: this.addAttendanceForm.value.client_id,
      user_id: this.addAttendanceForm.value.user_id,
      checkin_datetime: this.addAttendanceForm.value.checkin_datetime.replace(
        "T",
        " "
      ),
      lunchout_datetime: this.addAttendanceForm.value.lunchout_datetime.replace(
        "T",
        " "
      ),
      lunchin_datetime: this.addAttendanceForm.value.lunchin_datetime.replace(
        "T",
        " "
      ),
      checkout_datetime: this.addAttendanceForm.value.checkout_datetime.replace(
        "T",
        " "
      ),
      company_id: this.companyId ? this.companyId : "",
    };
    if (this.addAttendanceForm.invalid) return;
    this.userwiseMonthlyReportService.addAttendance(body).subscribe(
      (response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Attendance is added successfully."
          );
          this.modalRef.hide();
          this.getMonthlyReportList(body);
        } else {
          this.toastrMessageService.showError(response.data);
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  // date formator for nepali date-picker
  dateFormatter(date) {
    const formatedDate = `${date.year}-${parseInt(date.month) + 1}-${date.day}`;
    return formatedDate;
  }

  bsToAdInString(dateInBs) {
    return this.dateConverterService.bsToAdInString(dateInBs);
  }
  adToBsInString(dateInAd) {
    return this.dateConverterService.adToBsInString(dateInAd);
  }

  dateLang = this.globalService.getDateSettingFromStorage().GS_DATE;

  reportType: string;
  changeEmployeeReportType(value) {
    this.reportType = value;
    if (this.datePickerFormat == "N") {
      //  this.disableBefore = null;
      this.nepaliDatePickerSettingsForDateTo = null;
      this.nepaliDatePickerSettingsForMonthlyDateFrom = null;
      this.nepaliDatePickerSettingsForDailyDate = null;
      this.initNepaliDatePickerSettingByReportType(value);
    }
  }
  nepaliDatePickerSettingsForDailyDate: NepaliDatePickerSettings;
  nepaliDatePickerSettingsForDateFrom: NepaliDatePickerSettings;
  nepaliDatePickerSettingsForDateTo: NepaliDatePickerSettings;
  nepaliDatePickerSettingsForMonthlyDateFrom: NepaliDatePickerSettings
  nepaliDatePickerSettingsForMonthlyDateTo: NepaliDatePickerSettings;
  nepaliDatePickerSettingsForWeeklyDateFrom: NepaliDatePickerSettings;
  NepaliDatePickerSettingsForWeeklyDateTo: NepaliDatePickerSettings;
  initNepaliDatePickerSettingByReportType(reportType) {
    if (this.datePickerFormat == 'E') {
      return;
    }

    switch (reportType) {
      //monthly
      case "monthly":
        this.nepaliDatePickerSettingsForMonthlyDateFrom = {
          language: "english",
          dateFormat: this.datePickerConfig.dateInputFormat,
          ndpMonth: true,
          ndpYear: true
        };
        this.nepaliDatePickerSettingsForMonthlyDateTo = {
          language: "english",
          dateFormat: this.datePickerConfig.dateInputFormat,
          ndpMonth: true,
          ndpYear: true,
        }
        this.setNepaliDateForMonthly();
        break;
      //daily
      case "daily":

        this.nepaliDatePickerSettingsForDailyDate = {
          language: "english",
          dateFormat: this.datePickerConfig.dateInputFormat,
          ndpMonth: true,
          ndpYear: true
        }
        this.disableBefore = null;
        setTimeout(() => {
          this.userwiseMonthlyReportForm.get("date").setValue(this.assignDailyDateBySetting());
        }, 100)
        break;
      //weekly
      case "weekly":
        this.nepaliDatePickerSettingsForWeeklyDateFrom = {
          language: "english",
          dateFormat: this.datePickerConfig.dateInputFormat,
          ndpMonth: true,
          ndpYear: true
        };
        this.NepaliDatePickerSettingsForWeeklyDateTo = {
          language: "english",
          dateFormat: this.datePickerConfig.dateInputFormat,
          ndpMonth: true,
          ndpYear: true,
        }
        this.setNepaliDateForWeekly();


        break;
        case "custom":
          this.nepaliDatePickerSettingsForMonthlyDateFrom = {
            language: "english",
            dateFormat: this.datePickerConfig.dateInputFormat,
            ndpMonth: true,
            ndpYear: true
          };
          this.nepaliDatePickerSettingsForMonthlyDateTo = {
            language: "english",
            dateFormat: this.datePickerConfig.dateInputFormat,
            ndpMonth: true,
            ndpYear: true,
          }
          this.setNepaliDateForMonthly();
          break;
      default:
        break;
    }
  }
  datePickerFormat;
  systemSetting;
  datePickerSettingUserWise;
  initSettings() {
    this.systemSetting = this.globalService.getDateSettingFromStorage();
    //init the system date picker setting
    if (this.systemSetting !== null && this.systemSetting !== undefined) {
      this.datePickerFormat = this.systemSetting.GS_DATE;
    }
    this.datePickerSettingUserWise = this.globalService.getUserPreferenceSetting('UP_DATE_TYPE');
    if (this.datePickerSettingUserWise !== undefined && this.datePickerSettingUserWise !== null) {
      if (this.datePickerSettingUserWise.value) {
        this.datePickerFormat = this.datePickerSettingUserWise.value == 'BS' ? 'N' : 'E';
        // alert("this is datepicker"+this.datePickerFormat);
      }
    }
  }
  changeDate(date, type) {
    console.log("date ", date, type);
    if (type == "monthly") {
      this.disableBefore = date;
      let currentNepaliMonth = this.datePickerConfig.dateInputFormat == "YYYY/MM/DD" ? this.userwiseMonthlyReportForm.get('date_from').value.substring(5, 7)
        :
        this.userwiseMonthlyReportForm.get('date_from').value.substring(0, 2);
      currentNepaliMonth = currentNepaliMonth < 9 ? currentNepaliMonth.substring(1, 2) : currentNepaliMonth;
      this.userwiseMonthlyReportForm.get("month").setValue(currentNepaliMonth);

    }
    if (type == "weekly") {
      console.log("this is date", date);
      this.setLastDayOfNepaliWeek(date);
    }
  }

  checkDepartment(event): void {
    if (event.target.checked == true) {
      this.showDepartment = true;
      this.userwiseMonthlyReportForm.controls["department_column"].setValue(1);
    }
    if (event.target.checked == false) {
      this.showDepartment = false;
      this.userwiseMonthlyReportForm.get("department_column").setValue(0);
    }
  }

  checkEmpId(event): void {
    if (event.target.checked == true) {
      this.showEmpId = true;
      this.userwiseMonthlyReportForm.get("eeid_column").setValue(1);
    }
    if (event.target.checked == false) {
      this.showEmpId = false;
      this.userwiseMonthlyReportForm.get("eeid_column").setValue(0);
    }
  }
  showLunch: boolean = true;
  checkLunchColumn(event): void {
    if (event.target.checked == true) {
      this.showLunch = true;
      this.userwiseMonthlyReportForm.get("lunch_column").setValue(1);
    } else {
      this.showLunch = false;
      this.userwiseMonthlyReportForm.get("lunch_column").setValue(0);
    }
  }

  userPrefId;
  userPreferenceList: any[] = [];
  getUserPreference(): void {
    this.userPrefId = this.localStorageService.getLocalStorageItem("user_id");
    this.userPreferenceService
      .getUserPreferenceSetting(this.userPrefId)
      .subscribe((response) => {
        if (response.status) {
          this.userPreferenceList = response.data;
          //patch value only if there is setting
          if (this.userPreferenceList.length > 0) {
            //patching value
            this.initGridByUserPreferenceSetting();
          }
        }
      });
  }

  departmentChecked: boolean = true;
  eeIdChecked: boolean = true;
  upLunchChecked: boolean = true;
  initGridByUserPreferenceSetting() {
    let departMentHideObj = this.userPreferenceList.filter(
      (x) => x.code == "UP_DEPARTMENT"
    )[0];
    if (
      departMentHideObj &&
      departMentHideObj !== null &&
      departMentHideObj.value == "1"
    ) {
      this.departmentChecked = true;
      this.showDepartment = true;
      this.userwiseMonthlyReportForm.controls["department_column"].setValue(1);
    } else {
      this.departmentChecked = false;
      this.showDepartment = false;
      this.userwiseMonthlyReportForm.controls["department_column"].setValue(0);
    }

    let eeIdObj = this.userPreferenceList.filter((x) => x.code == "UP_EEID")[0];
    if (eeIdObj && eeIdObj !== null && eeIdObj.value == "1") {
      this.eeIdChecked = true;
      this.showEmpId = true;
      this.userwiseMonthlyReportForm.get("eeid_column").setValue(1);
    } else {
      this.eeIdChecked = false;
      this.showEmpId = false;
    }

    let lunchObj = this.userPreferenceList.filter(
      (x) => x.code == "UP_LUNCH"
    )[0];
    if (lunchObj && lunchObj !== null && lunchObj.value == "1") {
      this.upLunchChecked = true;
      this.showLunch = true;
      this.userwiseMonthlyReportForm.get("lunch_column").setValue(1);
    } else {
      this.upLunchChecked = false;
      this.showLunch = false;
    }
  }

  // Export Weekly Report
  exportWeeklyReport(): void {
    if (this.userwiseMonthlyReportForm.invalid) return;
    let userArray = [];
    userArray.push(String(this.user_id));
    const body = {
      company_id: this.companyId,
      client_id: this.userwiseMonthlyReportForm.value.client_id,
      user: userArray,
      begDate: this.globalService.transformFromDatepicker(
        this.userwiseMonthlyReportForm.value.begDate
      ),
      endDate: this.globalService.transformFromDatepicker(
        this.userwiseMonthlyReportForm.value.endDate
      ),
      type: this.userwiseMonthlyReportForm.value.type,
      department_column: this.userwiseMonthlyReportForm.value.department_column,
      eeid_column: this.userwiseMonthlyReportForm.value.eeid_column,
      lunch_column: this.userwiseMonthlyReportForm.value.lunch_column,
    };

    this.userwiseMonthlyReportService
      .exportWeeklyExcelReport(body)
      .subscribe((response) => {
        this.document.location.href = response.data;
      });
  }

  // DAILY Export Excel Report
  exportDailyReport(): void {
    let userArray = [];
    userArray.push(String(this.userId));

    const body = {
      company_id: this.companyId,
      client_id: this.userwiseMonthlyReportForm.value.client_id,
      date: this.globalService.transformFromDatepicker(
        this.userwiseMonthlyReportForm.value.date
      ),
      type: this.userwiseMonthlyReportForm.value.type,
      user: userArray, // Staff id of all Users
      department_column: this.userwiseMonthlyReportForm.value.department_column,

      eeid_column: this.userwiseMonthlyReportForm.value.eeid_column,
      lunch_column: this.userwiseMonthlyReportForm.value.lunch_column,
      limit: this.limit,
      page: this.globalService.pageNumber,
    };

    this.userwiseMonthlyReportService
      .exportExcel(body)
      .subscribe((response) => {
        this.document.location.href = response.data;
      });
  }

  // Export Monthly Reports
  exportMonthlyReport(): void {
    let userArray = [];
    userArray.push(String(this.user_id));

    const body = {
      company_id: this.companyId,
      client_id: this.userwiseMonthlyReportForm.value.client_id,
      user: userArray,
      begDate: this.globalService.transformFromDatepicker(
        this.userwiseMonthlyReportForm.value.date_from
      ),
      endDate: this.globalService.transformFromDatepicker(
        this.userwiseMonthlyReportForm.value.date_to
      ),
      type: this.userwiseMonthlyReportForm.value.type,
      department_column: this.userwiseMonthlyReportForm.value.department_column,
      eeid_column: this.userwiseMonthlyReportForm.value.eeid_column,
      lunch_column: this.userwiseMonthlyReportForm.value.lunch_column,
    };
    this.userwiseMonthlyReportService
      .exportMonthlyExcelReport(body)
      .subscribe((response) => {
        this.document.location.href = response.data;
      });
  }


  datePickerType:any;
  configureUserPreferenceSetting(){
    //for date picker
    let datePicker = this.globalService.getUserPreferenceSetting('UP_DATE_TYPE');
    if(datePicker !== null && datePicker !== undefined){
        this.datePickerType = datePicker.value;
        this.datePickerType && this.datePickerType == 'BS' ?
        this.dateSetting.GS_DATE="N":
        this.dateSetting.GS_DATE = 'E';
      }
  }
  disableBefore;
  setNepaliDateForMonthly() {
    this.userwiseMonthlyReportForm.get("date_from").setValue(
      this.adbsConvertService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat)
    );
    // this.disableBefore = this.reportForm.get("date_from").value;
    this.userwiseMonthlyReportForm.get("date_to").setValue(
      this.adbsConvertService.getLastDayOfNepaliMonth(this.datePickerConfig.dateInputFormat)
    );
    setTimeout(() => {
      this.disableBefore = this.adbsConvertService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat)

    })
  }
  assignDailyDateBySetting() {
    if (this.datePickerFormat == "E") {
      return this.globalService.transformForDatepickerPreview(
        this.currentDateInenglish,
        this.datePickerConfig.dateInputFormat
      );
    }
    else {
      return this.adbsConvertService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat);
    }
  }
  setNepaliDateForWeekly() {
    this.userwiseMonthlyReportForm.get("endDate").setValue(
      this.adbsConvertService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat)
    );
    this.userwiseMonthlyReportForm.get("begDate").setValue(
      this.adbsConvertService.getPreviousSevenDaysDate(this.datePickerConfig.dateInputFormat)
    );
    setTimeout(()=>{
      this.weeklyDisableBefore =  this.adbsConvertService.getPreviousSevenDaysDate(this.datePickerConfig.dateInputFormat)

    },100)
  }
  currentNepaliFirstDayOfMonth;
  getCurrentNepaliMonth() {
    this.currentNepaliFirstDayOfMonth = this.adbsConvertService.getNepaliFirstDayOfMonth(this.datePickerConfig.dateInputFormat);
    let currentNepaliMonth = this.datePickerConfig.dateInputFormat == "YYYY/MM/DD" ? this.currentNepaliFirstDayOfMonth.substring(5, 7)
      :
      this.currentNepaliFirstDayOfMonth.substring(0, 2);
    this.disableBefore = this.currentNepaliFirstDayOfMonth
    currentNepaliMonth = currentNepaliMonth < 9 ? currentNepaliMonth.substring(1, 2) : currentNepaliMonth;
    return currentNepaliMonth;
  }
  setLastDayOfNepaliWeek(date) {
    this.weeklyDisableBefore = date;
    if (this.datePickerConfig.dateInputFormat == "MM/DD/YYYY") {
      let month = date.substring(0, 2);
      let day = date.substring(3, 5);
      let year = date.substring(6, 10);
      let dateTo = (month) + "/" + this.adbsConvertService.getTwoDigitString((parseInt(day) + 6)) + "/" + year;
      let lastDayOfMonth = this.getLastdateOfNepaliMonth(month);
      let increasedDate = (parseInt(day) + 7);
      if(increasedDate > lastDayOfMonth){
        let differenceDate = increasedDate - lastDayOfMonth;
        dateTo = this.adbsConvertService.getTwoDigitString((parseInt(month)+1)) + "/" + (this.adbsConvertService.getTwoDigitString(differenceDate)) + "/" + year;
      }
      this.userwiseMonthlyReportForm.get("endDate").setValue(
        dateTo
      );
    }
    else {
      // yyyy/mm/dd
      let month = date.substring(5, 7);
      let day = date.substring(8, 10);
      let year = date.substring(0, 4);
      console.log("month.day,year", month, day, year);
      let dateTo = year+"/"+(month) + "/" + this.adbsConvertService.getTwoDigitString((parseInt(day) + 6));
      let lastDayOfMonth = this.getLastdateOfNepaliMonth(month);
      let increasedDate = (parseInt(day) + 7);
      if(increasedDate > lastDayOfMonth){
        let differenceDate = increasedDate - lastDayOfMonth;
        dateTo =  year+"/"+this.adbsConvertService.getTwoDigitString((parseInt(month)+1)) + "/" + (this.adbsConvertService.getTwoDigitString(differenceDate));
      }
      this.userwiseMonthlyReportForm.get("endDate").setValue(
        dateTo
      );
    }
  }

getLastdateOfNepaliMonth(month) {
  month = parseInt(month);
  // month = parseInt(month)
  let value;
  switch (month) {
    case 1:
      value = 31;
      break;
    case 2:
      value = 31;
      break;
    case 3:
      value = 31;
      break;
    case 4:
      value = 32;
      break;
    case 5:
      value = 31;
      break;
    case 6:
      value = 31;
      break;
    case 7:
      value = 30;
      break;
    case 8:
      value = 29;
      break;
    case 9:
      value = 30;
      break;
    case 10:
      value = 29;
      break;
    case 11:
      value = 30;
      break;
    case 12:
      value = 30;
      break;
    default:
      value = 30;
      break;
  }
  return value;


}
onNepaliMonthChange(value) {
  // console.log(value)
  if (this.datePickerConfig.dateInputFormat == "YYYY/MM/DD") {
    // reportForm
    let year = this.userwiseMonthlyReportForm.get("date_from").value.substring(0, 4);
    value = value.length == 1 ? "0" + value : value;
    this.userwiseMonthlyReportForm.get("date_from").setValue(
      `${year}/${value}/01`
    )
    this.userwiseMonthlyReportForm.get("date_to").setValue(
      `${year}/${value}/${this.getLastdateOfNepaliMonth(value)}`
    )
    this.disableBefore = `${year}/${value}/${this.getLastdateOfNepaliMonth(value)}`;

  }
  else {
    let year = this.userwiseMonthlyReportForm.get("date_from").value.substring(6, 10);
    value = value.length == 1 ? "0" + value : value;
    this.userwiseMonthlyReportForm.get("date_from").setValue(
      `${value}/01/${year}`
    )

    this.userwiseMonthlyReportForm.get("date_to").setValue(
      `${value}/${this.getLastdateOfNepaliMonth(value)}/${year}`
    )
    this.disableBefore = `${value}/${this.getLastdateOfNepaliMonth(value)}/${year}`;

  }

}
weeklyDisableBefore;

}

// selectedForceChangeItem;
// forceChangeAttendanceList;
// openForceChange(template: TemplateRef<any>, dataItem): void {
//   this.selectedForceChangeItem = dataItem;
//   this.buildForceChangeForm();
//   this.modalRef = this.modalService.show(template, this.config);
//   let body = {
//     id: this.userId,
//     date: dataItem.date,
//   };
//   this.userwiseMonthlyReportService
//     .getUserAttendances(body)
//     .subscribe((response) => {
//       if (response.status) {
//         this.forceChangeAttendanceList = response.data;
//         this.setForceChangeList();
//       }
//     });
// }

// setForceChangeList(): void {
//   this.forceChangeForm.setControl(
//     "attendance",
//     this.setForceChangeFormArray(this.forceChangeAttendanceList)
//   );
// }

// setForceChangeFormArray(forceChangeAttendanceList): FormArray {
//   const forceChangeFormArray = new FormArray([]);
//   if (forceChangeAttendanceList && forceChangeAttendanceList.length > 0) {
//     forceChangeAttendanceList.forEach((element) => {
//       forceChangeFormArray.push(
//         this.formBuilder.group({
//           id: element.id,
//           in_datetime: element.checkin_datetime.replace(" ", "T"),
//           out_datetime: element.checkout_datetime.replace(" ", "T"),
//         })
//       );
//     });
//   } else {
//     forceChangeFormArray.push(
//       this.formBuilder.group({
//         id: "",
//         in_datetime: "",
//         out_datetime: "",
//       })
//     );
//   }
//   return forceChangeFormArray;
// }

// forceChangeSubmit;
// forceChangeForm: FormGroup;

// buildForceChangeForm(): void {
//   this.forceChangeForm = this.formBuilder.group({
//     checkin_datetime: this.selectedForceChangeItem
//       ? this.selectedForceChangeItem.in
//       : "",
//     lunchout_datetime: this.selectedForceChangeItem
//       ? this.selectedForceChangeItem.lunch_out
//       : "",
//     lunchin_datetime: this.selectedForceChangeItem
//       ? this.selectedForceChangeItem.lunch_in
//       : "",
//     checkout_datetime: this.selectedForceChangeItem
//       ? this.selectedForceChangeItem.out
//       : "",
//     attendance: this.formBuilder.array([this.addForceEntryFormGroup()]),
//   });
// }

// get forceChangeList() {
//   return this.forceChangeForm.get("attendance") as FormArray;
// }

// addForceEntryFormGroup(): FormGroup {
//   return this.formBuilder.group({
//     in_datetime: [""],
//     out_datetime: [""],
//     tot_work: [""],
//     status: [""],
//     status_out: [""],
//   });
// }

//...............................................ATTENDANCE....................................................//
