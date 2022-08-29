import { DateConverterService } from "./../../../../shared/services/dateConverter/date-converter.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
} from "@angular/forms";
import { GlobalService } from "@app/shared/services/global/global.service";
import { MonthlyReportService } from "./../services/monthly-report.service";
import {
  MonthlyReports,
  WeeklyReports,
} from "./../models/monthly-reports.models";
import { AttData } from "./../models/monthly-reports.models";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  TemplateRef,
  Inject,
  ViewChild,
} from "@angular/core";
import { DatePipe, DOCUMENT } from "@angular/common";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BsDatepickerConfig, BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { ClientService } from "../../../manage-client/client/client.service";
import { TimeCardService } from "../../time-card/services/time-card.service";
import { State } from "@progress/kendo-data-query";
import { UserPreferenceSettingService } from "@app/modules/setting/user-preference-setting/services/user-preference-setting.service";
import { CorrectionAttendanceService } from "@app/modules/daybook-management/correction-attendance/services/correction-attendance.service";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { CustomDateTimeLocalPickerSettings } from './../../../../shared/components/custom-datetimelocal-picker/modal/datepickerSetting';
import { ChangeDetectorRef } from "@angular/core";
import { NepaliDatePickerSettings } from './../../../../shared/components/nepali-date-picker/modals/nepalidatepickersettings.interface';
import { AdBsDateConvertService } from "@app/shared/components/custom-nepalidatepicker/services/ad-bs-date-convert.service";
import { NepaliDatePickerComponent } from "@app/shared/components/nepali-date-picker/nepali-date-picker.component";

declare var require: any;
var adbs = require("ad-bs-converter");
@Component({
  selector: "app-monthly-report",
  // encapsulation is required for rowCallBack function.
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./monthly-report.component.html",
  styleUrls: ["./monthly-report.component.scss"],
  providers: [DatePipe],
})
export class MonthlyReportComponent implements OnInit {
  reportForm: FormGroup;
  forceChangesForm: FormGroup;
  forceChangeDailyForm: FormGroup;

  monthlyReports: MonthlyReports;
  monthlyReportsList: AttData[];

  bsToAdInString;
  dateInputFormat;
  dateFormat;
  dateSetting;

  monthType: any;
  todaysDateInEnglish = new Date();
  currentDateInenglish = this.datePipe.transform(
    this.todaysDateInEnglish,
    "MM-dd-yyyy"
  );
  allEmp;
  activeEmp;
  archiveEmp;

  endWeek;
  fileName: string;
  totalHours: number;

  // Hamburger Menu items
  showDepartment: boolean = false;
  showEmpId: boolean = false;
  showLunch: boolean = false;
  archive: boolean;
  loading: boolean;
  active: boolean;
  allEmployee: boolean;
  showClientList: boolean;
  dontShowClientList: boolean;

  // Get Client List
  clientList = [];
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "";
  search_value = "";

  viewGraceMonthly;
  viewGraceDaily;
  viewGraceWeekly;
  viewMonthly;
  viewDaily;
  viewWeekly;

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

  selectedForceChangeList;
  forceChangeAttendance: any;

  public gridView: GridDataResult;
  public gridViewWeeklyReport: GridDataResult;
  public gridViewDailyReport: GridDataResult;

  dailyReportList: any[] = [];
  staffList: any[] = [];
  weeklyReportList: WeeklyReports[] = [];

  //Kendo Table
  limit = "30";
  skip = 0;
  pageLimit = parseInt(this.limit);
  public state: State = {
    skip: 0,
    take: 20,
    //initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
    sort: [{ dir: "asc", field: "" }],
  };
  nepaliMonths = this.globalService.nepaliMonth;
  // to expand the + button in Kendo Grid
  public expandedDetailKeys: any[] = [1];

  public showMoreDetails(dataItem: any, index: number) {
    return null;
  }

  responseCount = 0;
  modalRef: BsModalRef;

  companyId = this.globalService.getCompanyIdFromStorage();
  staff_id = this.localStorageService.getLocalStorageItem("user_id");
  // clientId = this.localStorageService.getLocalStorageItem("client_id");
  emp_id: any;

  datePickerConfig: Partial<BsDatepickerConfig>;
  staffLists: any[] = [];
  dateFormatSetting: any;
  timeFormatSetting;
  constructor(
    private localStorageService: LocalStorageService,
    private monthlyReportService: MonthlyReportService,
    private globalService: GlobalService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    private toasterMessageService: ToastrMessageService,
    private clientService: ClientService,
    private timeCardService: TimeCardService,
    private userPreferenceService: UserPreferenceSettingService,
    private correctionAttendanceService: CorrectionAttendanceService,
    public authService: AuthService,
    @Inject(DOCUMENT) private document: Document,
    private cdref: ChangeDetectorRef,
    private adbsConvertService: AdBsDateConvertService
  ) {
    //get the setting by userpreference
    this.timeFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_TIME_FORMAT");
    this.dateFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
    //configure the setting by general and userwise preference
    this.configUserDateAndTimeSetting();
    this.initSettings();
  }
  ngOnInit() {
    this.getUserPreference();
    // this.getClientBasicInformationList();
    // this.getClientFromStaff();
    this.getClientListByRole();
    this.buildForceChangesForm();
    this.buildReportForm();
    this.buildAddAttendanceForm();
    this.buildForceChangeForm();
    this.monthType = this.globalService.englishMonth;
    this.dateSetting = this.globalService.getDateSettingFromStorage();
    this.dateFormat = this.dateSetting.GS_DT_FORMAT;
    this.role = this.localStorageService.getLocalStorageItem("role");
  }
  getClientListByRole() {
    if (this.authService.currentUserRoleValue == 'Admin'
      || this.authService.currentUserRoleValue == 'Super Admin'
    ) {
      this.getClientBasicInformationList();
      // getallusersatFirst
      this.getAllUsersList();
    }
    else if (
      this.authService.currentUserRoleValue == 'Manager' ||
      this.authService.currentUserRoleValue == 'HR'
    ) {
      this.getClientFromStaff();
    }
  }

  archiveEmployees(event): void {
    this.allEmp = false;
    this.activeEmp = false;
    this.archiveEmp = true;

    this.archive = true;
    if (this.archiveEmp) {
      this.reportForm.controls["status"].setValue(0);

      this.getEmployeeList();
    }
  }

  activeEmployees(): void {
    this.allEmp = false;
    this.activeEmp = true;
    this.archiveEmp = false;
    this.active = true;
    if (this.activeEmp) {
      this.reportForm.controls["status"].setValue(1);
      this.getEmployeeList();
    }
  }

  allEmployees(event): void {
    this.allEmployee = true;
    this.allEmp = true;
    this.activeEmp = false;
    this.archiveEmp = false;
    // this.radioVal = event;
    if (this.allEmp) {
      this.reportForm.controls["status"].setValue("");
      this.getEmployeeList();
    }
  }

  // To select all users at once....
  public onSelectedAll() {
    const selected = this.staffList.map((item) => item.user_id);

    this.reportForm.get("user").patchValue(selected);
  }

  // to clear all users at once....
  public onClearableAll() {
    this.reportForm.get("user").patchValue([]);
  }

  hello;
  currentNepaliFirstDayOfMonth;
  // build Report Form
  buildReportForm() {
    this.reportForm = this.fb.group({
      client_id: [null],
      user: [this.userId ? this.userId : this.staff_id],
      type: "",
      types: "",
      // date:"",
      date: this.assignDailyDateBySetting(),
      month: [this.datePickerFormat == "E" ? this.globalService.currentEnglishMonth :
        this.getCurrentNepaliMonth()],
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
        this.globalService.transformForDatepickerPreview(
          this.globalService.englishFirstDayOfMonth,
          this.datePickerConfig.dateInputFormat
        ),
        Validators.required,
        ,
      ],
      // date_to: [this.currentDateInenglish, [Validators.required]],
      date_to: [
        this.globalService.transformForDatepickerPreview(
          this.currentDateInenglish,
          this.datePickerConfig.dateInputFormat
        ),
      ],
      begDate: "",
      status: "",
      endDate: "",
      department_column: "",
      eeid_column: "",
      lunch_column: "",
    });
    // this.hello = this.reportForm.value.client_id;
  }

  // Get the 7th day after selecting particular date
  getLastDayOfWeek(firstDay): void {
    var start = new Date(firstDay);
    var lastWeek = new Date(start.setDate(start.getDate() + 6));
    // this.endWeek = this.globalService.transformForDatepickerPreview(lastWeek);
    this.endWeek = this.globalService.transformForDatepickerPreview(
      lastWeek,
      this.datePickerConfig.dateInputFormat
    );
    this.reportForm.get("endDate").patchValue(this.endWeek);
  }

  currentEnglishMonth = this.todaysDateInEnglish.getMonth() + 1;

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
    this.reportForm.get("date_from").patchValue(englishFirstDayOfMonth);

    // let englishLastDayOfMonth = this.datePipe.transform(
    //   new Date(this.todaysDateInEnglish.getFullYear(), value, 0),
    //   "MM-dd-yyyy"
    // );
    let englishLastDayOfMonth =
      this.globalService.transformForDatepickerPreview(
        new Date(this.todaysDateInEnglish.getFullYear(), value, 0),
        this.datePickerConfig.dateInputFormat
      );
    this.reportForm.get("date_to").patchValue(englishLastDayOfMonth);
  }
  role;
  getClientFromStaff() {
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    this.correctionAttendanceService
      .getClientFromStaff(userInfo.staff_id)
      .subscribe((response) => {
        if (response.status) {
          this.clientList = response.data;

          // for (let list of this.clientList) {
          //   this.clientId = list.client_id;
          //   this.attendanceMessageForm
          //     .get("clientId")
          //     .patchValue(this.clientId);
          // }
        } else {
          this.clientList = [];
          // this.attendanceMessageForm.get("clientId").patchValue("");
        }
      });
  }

  getClientBasicInformationList(): void {
    this.clientList = [];
    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
      company_id: this.companyId,
    };
    this.clientService
      .getClientBasicInformationList(params)
      .subscribe((response) => {
        if (response.status) {
          this.showClientList = true;
          this.dontShowClientList = false;
          this.clientList = response.data;
        } else {
          this.showClientList = false;
          this.dontShowClientList = true;
          this.clientList = [];
        }
      });
  }

  checkClientList(): void {
    this.monthlyReportService.checkClientList(this.staffId);
  }

  //**View Reports */
viewCustomReport;
viewCustomGrace;
  viewReports(dataItem): void {
    if (dataItem == "Monthly") {
      this.viewMonthly = true;
      this.viewGraceMonthly = false;
      this.viewGraceDaily = false;
      this.viewGraceWeekly = false;
      this.viewDaily = false;
      this.viewWeekly = false;
      this.viewCustomGrace = false;
      this.viewCustomReport =false;
      this.viewMonthlyReport();
    }
    if(dataItem =="Custom"){
      this.viewCustomReport = true;
      this.viewGraceMonthly = false;
      this.viewGraceDaily = false;
      this.viewGraceWeekly = false;
      this.viewDaily = false;
      this.viewWeekly = false;
       this.viewMonthly = false;
      this.viewMonthlyReport();
    }
    if (dataItem == "Daily") {
      this.viewDaily = true;
      this.viewWeekly = false;
      this.viewMonthly = false;
      this.viewGraceMonthly = false;
      this.viewGraceDaily = false;
      this.viewGraceWeekly = false;
      this.viewDailyReport();
    }
    if (dataItem == "Weekly") {
      this.viewWeekly = true;
      this.viewDaily = false;
      this.viewMonthly = false;
      this.viewGraceMonthly = false;
      this.viewGraceDaily = false;
      this.viewGraceWeekly = false;
      this.viewWeeklyReport();
    }
  }

  //**View GraceTime Reports */
  clickGraceTime(dataItem): void {
    if (dataItem == "Monthly") {
      this.viewGraceMonthly = true;
      this.viewGraceDaily = false;
      this.viewGraceWeekly = false;
      this.viewDaily = false;
      this.viewMonthly = false;
      this.viewWeekly = false;
      if (dataItem == "Monthly") {
        this.clickedGraceTime();
      }
    }
    if (dataItem == "Custom") {
      this.viewGraceMonthly = false;
      this.viewCustomGrace = true;
      this.viewGraceDaily = false;
      this.viewGraceWeekly = false;
      this.viewDaily = false;
      this.viewMonthly = false;
      this.viewWeekly = false;
      if (dataItem == "Custom") {
        this.clickedGraceTime();
      }
    }
    if (dataItem == "Weekly") {
      this.viewGraceWeekly = true;
      this.viewGraceMonthly = false;
      this.viewDaily = false;
      this.viewMonthly = false;
      this.viewWeekly = false;
      this.viewGraceDaily = false;
      this.viewWeeklyGraceReport();
    }
    if (dataItem == "Daily") {
      this.viewGraceDaily = true;
      this.viewGraceWeekly = false;
      this.viewGraceMonthly = false;
      this.viewDaily = false;
      this.viewMonthly = false;
      this.viewWeekly = false;
      this.viewDailyGraceReport();
    }
  }

  // ..........................................................WEEKLY REPORT.................................................................................................................................................

  dataStateChangeWeekly(event): void {
    const weeklyReportBody = {
      company_id: this.companyId,
      page: 1,
      limit: this.pageLimit,
      client_id: this.reportForm.value.client_id,
      user: this.reportForm.value.user,
      begDate: this.reportForm.value.begDate,
      endDate: this.reportForm.value.endDate,
      type: this.reportForm.value.type,
      department_column: this.reportForm.value.department_column,
      eeid_column: this.reportForm.value.eeid_column,
      lunch_column: this.reportForm.value.lunch_column,
    };
    if (event.skip == 0) {
      this.skip = event.skip;
      weeklyReportBody.page = 1;
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;
      weeklyReportBody.page = pageNo;
    }
    this.getWeeklyReports(weeklyReportBody);
  }

  dataStateChangeWeeklyGrace(event): void {
    const weeklyReportBody = {
      company_id: this.companyId,
      page: this.globalService.pageNumber,
      limit: this.limit,
      client_id: this.reportForm.value.client_id,
      user: this.reportForm.value.user,
      // begDate: this.reportForm.value.begDate,
      // endDate: this.reportForm.value.endDate,
      begDate: this.datePickerFormat == "E" ? this.globalService.transformFromDatepicker(
        this.reportForm.value.begDate
      ) : this.adbsConvertService.transformDateForAPI(this.reportForm.value.begDate, this.datePickerConfig.dateInputFormat),
      endDate: this.datePickerFormat == "E" ? this.globalService.transformFromDatepicker(
        this.reportForm.value.endDate
      ) : this.adbsConvertService.transformDateForAPI(
        this.reportForm.value.endDate, this.datePickerConfig.dateInputFormat
      ),
      type: this.reportForm.value.type,
      gracetime: 1,
      department_column: this.reportForm.value.department_column,
      eeid_column: this.reportForm.value.eeid_column,
      lunch_column: this.reportForm.value.lunch_column,
    };
    if (event.skip == 0) {
      this.skip = event.skip;
      weeklyReportBody.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;
      weeklyReportBody.page = pageNo.toString();
    }
    this.getWeeklyReports(weeklyReportBody);
  }

  // View Weekly Report
  viewWeeklyReport(): void {
    if (this.reportForm.invalid) return;
    const body = {
      page: this.globalService.pageNumber,
      limit: this.limit,
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      user: this.reportForm.value.user,
      // begDate: this.reportForm.value.begDate,
      // endDate: this.reportForm.value.endDate,
      begDate: this.datePickerFormat == "E" ? this.globalService.transformFromDatepicker(
        this.reportForm.value.begDate
      ) : this.adbsConvertService.transformDateForAPI(this.reportForm.value.begDate, this.datePickerConfig.dateInputFormat),
      endDate: this.datePickerFormat == "E" ? this.globalService.transformFromDatepicker(
        this.reportForm.value.endDate
      ) : this.adbsConvertService.transformDateForAPI(
        this.reportForm.value.endDate, this.datePickerConfig.dateInputFormat
      ),
      type: this.reportForm.value.type,
      lunch_column: this.reportForm.value.lunch_column,
    };
    this.getWeeklyReports(body);
  }

  // Export Weekly Report
  exportWeeklyReport(): void {
    if (this.reportForm.invalid) return;
    const body = {
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      user: this.reportForm.value.user,
      // begDate: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.begDate
      // ),
      // endDate: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.endDate
      // ),
      begDate: this.datePickerFormat == "E" ? this.globalService.transformFromDatepicker(
        this.reportForm.value.begDate
      ) : this.adbsConvertService.transformDateForAPI(this.reportForm.value.begDate, this.datePickerConfig.dateInputFormat),
      endDate: this.datePickerFormat == "E" ? this.globalService.transformFromDatepicker(
        this.reportForm.value.endDate
      ) : this.adbsConvertService.transformDateForAPI(
        this.reportForm.value.endDate, this.datePickerConfig.dateInputFormat
      ),
      type: this.reportForm.value.type,
      department_column: this.reportForm.value.department_column,
      eeid_column: this.reportForm.value.eeid_column,
      lunch_column: this.reportForm.value.lunch_column,
    };

    this.monthlyReportService
      .exportWeeklyExcelReport(body)
      .subscribe((response) => {
        this.document.location.href = response.data;
      });
  }

  // View Weekly Grace Report
  viewWeeklyGraceReport() {
    const body = {
      company_id: this.companyId,
      page: this.globalService.pageNumber,
      limit: this.limit,
      client_id: this.reportForm.value.client_id,
      user: this.reportForm.value.user,
      // begDate: this.reportForm.value.begDate,
      // endDate: this.reportForm.value.endDate,
      // begDate: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.begDate
      // ),
      // endDate: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.endDate
      // ),
      begDate: this.datePickerFormat == "E" ? this.globalService.transformFromDatepicker(
        this.reportForm.value.begDate
      ) : this.adbsConvertService.transformDateForAPI(this.reportForm.value.begDate, this.datePickerConfig.dateInputFormat),
      endDate: this.datePickerFormat == "E" ? this.globalService.transformFromDatepicker(
        this.reportForm.value.endDate
      ) : this.adbsConvertService.transformDateForAPI(
        this.reportForm.value.endDate, this.datePickerConfig.dateInputFormat
      ),
      type: this.reportForm.value.type,
      gracetime: 1,
      lunch_column: this.reportForm.value.lunch_column,
    };
    this.getWeeklyReports(body);
  }

  // Export Weekly Grace Report
  exportWeeklyGraceReport(): void {
    if (this.reportForm.invalid) return;
    const body = {
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      user: this.reportForm.value.user,
      // begDate: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.begDate
      // ),
      // endDate: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.endDate
      // ),
      begDate: this.datePickerFormat == "E" ? this.globalService.transformFromDatepicker(
        this.reportForm.value.begDate
      ) : this.adbsConvertService.transformDateForAPI(this.reportForm.value.begDate, this.datePickerConfig.dateInputFormat),
      endDate: this.datePickerFormat == "E" ? this.globalService.transformFromDatepicker(
        this.reportForm.value.endDate
      ) : this.adbsConvertService.transformDateForAPI(
        this.reportForm.value.endDate, this.datePickerConfig.dateInputFormat
      ),
      type: this.reportForm.value.type,
      gracetime: 1,
      department_column: this.reportForm.value.department_column,
      eeid_column: this.reportForm.value.eeid_column,
      lunch_column: this.reportForm.value.lunch_column,
    };
    this.monthlyReportService
      .exportWeeklyExcelReport(body)
      .subscribe((response) => {
        this.document.location.href = response.data;
      });
  }

  // Get Weekly Report
  getWeeklyReports(body): void {
    this.loading = true;
    this.monthlyReportService.getWeeklyReport(body).subscribe(
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

  // .............................................MONTHLY REPORT..............................................................................

  viewMonthlyReport(): void {
    if (this.reportForm.invalid) return;
    if (!this.reportForm.value.user) {
      return;
    }
    const body = {
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      user: this.reportForm.value.user.split(" , "),
      date_from: this.datePickerFormat == "N" ?
        this.adbsConvertService.transformDateForAPI(this.reportForm.value.date_from, this.datePickerConfig.dateInputFormat)
        : this.globalService.transformFromDatepicker(
          this.reportForm.value.date_from
        ),
      date_to: this.datePickerFormat == "N" ?
        this.adbsConvertService.transformDateForAPI(this.reportForm.value.date_to, this.datePickerConfig.dateInputFormat)
        : this.globalService.transformFromDatepicker(
          this.reportForm.value.date_to
        ),
      type: this.reportForm.value.type,
    };
    // Check if date_from is greater than date_to...
    if (body.date_from > body.date_to) {
      this.toasterMessageService.showError(
        "Date From cannot be greater than Date To."
      );
      this.viewMonthly = false;
      return;
    }
    this.getMonthlyReport(body);
    //}
  }

  //  get Monthly report List
  monthly;
  getMonthlyReport(body): void {
    this.loading = true;
    this.monthlyReportService.getMonthlyReport(body).subscribe(
      (response) => {
        if (response.status) {
          this.monthly = response;
          this.monthlyReports = response.data;
          this.monthlyReportsList = this.monthlyReports.att_data;
          // this.gridView = {
          //   data: this.monthlyReportList.att_data,
          //   total: response.data.att_data
          //     ? response.data.att_data.length
          //     : null,
          // };
        } else {
          this.monthlyReportsList = [];
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

  // Export Monthly Reports
  exportMonthlyReport(): void {
    const body = {
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      user: this.reportForm.value.user.split(" , "),
      // begDate: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.date_from
      // ),
      // endDate: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.date_to
      // ),
      begDate: this.datePickerFormat == "N" ?
        this.adbsConvertService.transformDateForAPI(this.reportForm.value.date_from, this.datePickerConfig.dateInputFormat)
        : this.globalService.transformFromDatepicker(
          this.reportForm.value.date_from
        ),
      endDate: this.datePickerFormat == "N" ?
        this.adbsConvertService.transformDateForAPI(this.reportForm.value.date_to, this.datePickerConfig.dateInputFormat)
        : this.globalService.transformFromDatepicker(
          this.reportForm.value.date_to
        ),
      type: this.reportForm.value.type,
      department_column: this.reportForm.value.department_column,
      eeid_column: this.reportForm.value.eeid_column,
      lunch_column: this.reportForm.value.lunch_column,
    };
    this.monthlyReportService
      .exportMonthlyExcelReport(body)
      .subscribe((response) => {
        this.document.location.href = response.data;
      });
  }

  // View Grace Time Monthly Report
  clickedGraceTime() {
    if (this.reportForm.invalid) return;
    const body = {
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      user: this.reportForm.value.user.split(" , "),
      // date_from: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.date_from
      // ),
      // date_to: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.date_to
      // ),
      date_from: this.datePickerFormat == "N" ?
        this.adbsConvertService.transformDateForAPI(this.reportForm.value.date_from, this.datePickerConfig.dateInputFormat)
        : this.globalService.transformFromDatepicker(
          this.reportForm.value.date_from
        ),
      date_to: this.datePickerFormat == "N" ?
        this.adbsConvertService.transformDateForAPI(this.reportForm.value.date_to, this.datePickerConfig.dateInputFormat)
        : this.globalService.transformFromDatepicker(
          this.reportForm.value.date_to
        ),
      type: this.reportForm.value.type,
      gracetime: 1,
      department_column: this.reportForm.value.department_column,
      eeid_column: this.reportForm.value.eeid_column,
      lunch_column: this.reportForm.value.lunch_column,
    };
    this.getMonthlyReport(body);
  }

  // Export Monthly Grace Reports
  exportMonthlyGraceReport(): void {
    const body = {
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      user: this.reportForm.value.user.split(" , "),
      // begDate: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.date_from
      // ),
      // endDate: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.date_to
      // ),
      begDate: this.datePickerFormat == "N" ?
        this.adbsConvertService.transformDateForAPI(this.reportForm.value.date_from, this.datePickerConfig.dateInputFormat)
        : this.globalService.transformFromDatepicker(
          this.reportForm.value.date_from
        ),
      endDate: this.datePickerFormat == "N" ?
        this.adbsConvertService.transformDateForAPI(this.reportForm.value.date_to, this.datePickerConfig.dateInputFormat)
        : this.globalService.transformFromDatepicker(
          this.reportForm.value.date_to
        ),
      type: this.reportForm.value.type,
      gracetime: 1,
      department_column: this.reportForm.value.department_column,

      eeid_column: this.reportForm.value.eeid_column,
      lunch_column: this.reportForm.value.lunch_column,
    };

    this.monthlyReportService
      .exportMonthlyExcelReport(body)
      .subscribe((response) => {
        this.document.location.href = response.data;
      });
  }

  //......................................................DAILY REPORTS..........................................................................................

  dataStateChangeDaily(event): void {
    const dailyReportbody = {
      company_id: this.globalService.getCompanyIdFromStorage(),
      limit: this.limit,
      page: this.globalService.pageNumber,
      client_id: this.reportForm.value.client_id,
      date: this.globalService.transformFromDatepicker(
        this.reportForm.value.date
      ),
      type: this.reportForm.value.type,
      user: this.userIds,
    };
    if (event.skip == 0) {
      this.skip = event.skip;
      dailyReportbody.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;
      dailyReportbody.page = pageNo.toString();
    }
    this.getDailyReport(dailyReportbody);
  }

  dataStateChangeDailyGrace(event): void {
    const dailyReportbody = {
      company_id: this.globalService.getCompanyIdFromStorage(),
      limit: this.limit,
      page: this.globalService.pageNumber,
      client_id: this.reportForm.value.client_id,
      date: this.globalService.transformFromDatepicker(
        this.reportForm.value.date
      ),
      type: this.reportForm.value.type,
      gracetime: 1,
      user: this.userIds,
    };
    if (event.skip == 0) {
      this.skip = event.skip;
      dailyReportbody.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;
      dailyReportbody.page = pageNo.toString();
    }
    this.getDailyReport(dailyReportbody);
  }

  userIds: any[] = [];
  viewDailyReport(): void {
    const staffList = this.reportForm.value.user;
    this.userIds = [];
    // Comparing the user_id between selected id and another id in staff List!!Push the staff_id of selected user.....
    this.staffList.forEach((element) => {
      for (let i = 0; i < staffList.length; i++) {
        if (staffList[i] == element.user_id) {
          this.userIds.push(element.staff_id);
        }
      }
    });
    if (this.reportForm.invalid) return;
    const body = {
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      type: this.reportForm.value.type,
      date: this.datePickerFormat == "E" ? this.globalService.transformFromDatepicker(
        this.reportForm.value.date
      ) : this.adbsConvertService.transformDateForAPI(this.reportForm.value.date, this.datePickerConfig.dateInputFormat),
      department_column: this.reportForm.value.department_column,

      eeid_column: this.reportForm.value.eeid_column,
      lunch_column: this.reportForm.value.lunch_column,
      user: this.userIds, // Staff id of all Users
      limit: this.limit,
      page: this.globalService.pageNumber,
    };
    this.getDailyReport(body);
  }

  // DAILY Get Reports
  getDailyReport(body): void {
    this.dailyReportList = [];
    this.loading = true;
    this.monthlyReportService.getDailyReport(body).subscribe(
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

  // DAILY Grace Time Report
  viewDailyGraceReport(): void {
    const staffList = this.reportForm.value.user;
    // Comparing the user_id between selected id and another id in staff List!!Push the staff_id of selected user.....
    this.staffList.forEach((element) => {
      for (let i = 0; i < staffList.length; i++) {
        if (staffList[i] == element.user_id) {
          this.userIds.push(element.staff_id);
        }
      }
    });
    if (this.reportForm.invalid) return;
    const body = {
      company_id: this.companyId,
      gracetime: 1,
      client_id: this.reportForm.value.client_id,
      type: this.reportForm.value.type,
      department_column: this.reportForm.value.department_column,

      eeid_column: this.reportForm.value.eeid_column,
      lunch_column: this.reportForm.value.lunch_column,
      limit: this.limit,
      page: this.globalService.pageNumber,
      // date: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.date
      // ),
      date: this.datePickerFormat == "E" ? this.globalService.transformFromDatepicker(
        this.reportForm.value.date
      ) : this.adbsConvertService.transformDateForAPI(this.reportForm.value.date, this.datePickerConfig.dateInputFormat),
      user: this.userIds, // Staff id of all Users
    };
    this.getDailyReport(body);
  }

  // DAILY Export Excel Report
  exportDailyReport(): void {
    //Filter  Staff Id's of all Users for Daily Reports
    const staffList = this.reportForm.value.user;
    for (let i = 0; i < staffList.length; i++) {
      this.staffList.forEach((element) => {
        if (staffList[i] == element.user_id) {
          this.userIds.push(element.staff_id);
        }
      });
    }

    const body = {
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      date: this.datePickerFormat == "E" ? this.globalService.transformFromDatepicker(
        this.reportForm.value.date
      ) : this.adbsConvertService.transformDateForAPI(this.reportForm.value.date, this.datePickerConfig.dateInputFormat),
      // date: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.date
      // ),
      type: this.reportForm.value.type,
      user: this.userIds, // Staff id of all Users
      department_column: this.reportForm.value.department_column,

      eeid_column: this.reportForm.value.eeid_column,
      lunch_column: this.reportForm.value.lunch_column,
      limit: this.limit,
      page: this.globalService.pageNumber,
    };

    this.monthlyReportService.exportExcel(body).subscribe((response) => {
      this.document.location.href = response.data;
    });
  }

  // DAILY Grace Export Report
  exportDailyGraceReport(): void {
    // Filter  Staff Id's of all Users for Daily Reports
    const staffList = this.reportForm.value.user;
    for (let i = 0; i < staffList.length; i++) {
      this.staffList.forEach((element) => {
        if (staffList[i] == element.user_id) {
          this.userIds.push(element.staff_id);
        }
      });
    }

    const params = {
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      // date: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.date
      // ),
      date: this.datePickerFormat == "E" ? this.globalService.transformFromDatepicker(
        this.reportForm.value.date
      ) : this.adbsConvertService.transformDateForAPI(this.reportForm.value.date, this.datePickerConfig.dateInputFormat),
      gracetime: 1,
      type: this.reportForm.value.type,
      user: this.userIds, // Staff id of all Users
      department_column: this.reportForm.value.department_column,

      eeid_column: this.reportForm.value.eeid_column,
      lunch_column: this.reportForm.value.lunch_column,
      limit: this.limit,
      page: this.globalService.pageNumber,
    };

    this.monthlyReportService.exportExcel(params).subscribe((response) => {
      this.document.location.href = response.data;
    });
  }

  // ...........................................................................................................................................................

  // initial value of params.

  // params = {
  //   id: this.staff_id,
  //   client_id: this.clientId,
  //   date_from: "",
  //   // this.dateSetting.GS_DATE == "E"
  //   //   ? this.globalService.englishFirstDayOfMonth
  //   //   : this.bsToAdInString(this.globalService.nepaliFirstDayInString),
  //   date_to: "",
  //   // this.dateSetting.GS_DATE == "E"
  //   //   ? this.currentDateInenglish
  //   //   : this.bsToAdInString(this.globalService.currentNepaliDateInString),
  // };

  // on Client Change function
  clientChange(): void {
    this.reportForm.controls["user"].setValue("");
    this.reportForm.controls["status"].setValue("");
    this.staffList = [];
    let client = this.reportForm.get('client_id').value;
    if(client !==null && client !== '' ){
      this.getEmployeeList();
    }
    else{
      this.getClientListByRole()
    }



  }

  getEmployeeList(): void {
    this.staffList = [];
    this.timeCardService
      .getUsersByClientId(
        this.reportForm.get("client_id").value,
        this.reportForm.value.status
      )
      .subscribe((response) => {
        if (response.status) {
          this.staffList = response.data;
        } else {
          this.staffList = [];
        }
      });
  }

  // Add Attendance Form
  addAttendanceClientChange(): void {
    this.staffList = [];
    // if(this.addAttendanceForm.get("client_id").value == null
    // || this.addAttendanceForm.get("client_id").value == ''
    // ){
    //   this.getClientListByRole();

    // }
    // else{
      this.timeCardService
      .getUserByClientId(this.addAttendanceForm.get("client_id").value)
      .subscribe((response) => {
        this.staffLists = response.data;
      });
    }




  // Get Staff Id according to the user_id
  staffId;
  userId: number;
  getStaffId(value): void {
    this.staffList.forEach((element) => {
      if (value == element.user_id) {
        this.staffId = element.staff_id;
      }
    });
    this.userId = value;
  }

  employeeId = this.localStorageService.getLocalStorageItem("user_id");
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

  date_time;
  //...........................ADD ATTENDANCE.....................................//
  addAttendanceForm: FormGroup;
  buildAddAttendanceForm() {
    this.addAttendanceForm = this.fb.group({
      user_id: ["", [Validators.required]],
      status: [""],
      client_id: [
        this.reportForm.get("client_id").value
          ? this.reportForm.get("client_id").value
          : "",
        [Validators.required],
      ],
      lunchout_datetime: "",
      lunchin_datetime: "",
      // checkin_datetime: ["", [Validators.required]],
      // checkout_datetime: ["", [Validators.required]],
      checkin_datetime: [""],
      checkout_datetime: [""],
      checkin_message: [""],
      check: [""],
      lunch: [""],
    });
  }

  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
  };
  openModal(template: TemplateRef<any>): void {
    this.staffLists = [];
    this.buildAddAttendanceForm();
    if (this.reportForm.get("client_id").value) {
      this.timeCardService
        .getUserByClientId(this.reportForm.get("client_id").value)
        .subscribe((response) => {
          this.staffLists = response.data;
        });
    }

    this.modalRef = this.modalService.show(template, this.config);
  }

  // on submit Attendance Form
  onSubmitAttendance() {
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
    // if (body.checkin_datetime > body.checkout_datetime) {
    //   this.toasterMessageService.showError(
    //     "Checkin Datetime cannot be greater then Checkout Datetime."
    //   );
    //   return;
    // }
    if (!this.globalService.dateTimeLocalValidator(this.addAttendanceForm.value.checkout_datetime, this.addAttendanceForm.value.checkin_datetime)) {
      this.toasterMessageService.showError("Checkout date cannot be smaller than check in date.");
      return;
    }
    if (this.addAttendanceForm.get('lunch').value) {
      if (!this.globalService.dateTimeLocalValidator(this.addAttendanceForm.value.lunchin_datetime, this.addAttendanceForm.value.lunchout_datetime)) {
        this.toasterMessageService.showError("LunchOut date cannot be smaller than Lunch in date.");
        return;
      }
    }
    this.addAttendance(body);
  }

  // add Attendance..
  addAttendance(body): void {
    if (this.addAttendanceForm.invalid) return;
    this.monthlyReportService.addAttendance(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Attendance is added successfully."
          );
          this.modalRef.hide();
        } else {
          this.toasterMessageService.showError(response.data);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  openForceChangesModal(template: TemplateRef<any>, dataItem): void {
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      centered: true,
    };
    this.selectedForceChangeList = dataItem;
    this.buildForceChangesForm();
    this.modalRef = this.modalService.show(template, config);
    let body = {
      id: this.staffId,
      client_id: this.reportForm.value.client_id,
      date: dataItem.date,
    };

    this.monthlyReportService.getUserAttendance(body).subscribe((response) => {
      this.forceChangeAttendance = response;
      this.setForceChangeList();
    });
  }

  buildForceChangesForm(): void {
    this.forceChangesForm = this.fb.group({
      checkin_datetime: this.selectedForceChangeList
        ? this.selectedForceChangeList.in
        : "",
      lunchout_datetime: this.selectedForceChangeList
        ? this.selectedForceChangeList.lunch_out
        : "",
      lunchin_datetime: this.selectedForceChangeList
        ? this.selectedForceChangeList.lunch_in
        : "",
      checkout_datetime: this.selectedForceChangeList
        ? this.selectedForceChangeList.out
        : "",
    });
  }

  forceChangeForm: FormGroup;
  buildForceChangeForm(): void {
    this.forceChangeForm = this.fb.group({
      attendance: this.fb.array([this.addForceEntryFormGroup()]),
    });
  }

  // to get the data in + in html part in Monthly Report as
  get forceChangeValue() {
    return this.forceChangeForm.get("attendance") as FormArray;
  }

  addForceEntryFormGroup(): FormGroup {
    return this.fb.group({
      in_datetime: [""],
      out_datetime: [""],
      tot_work: [""],
      status: [""],
      status_out: [""],
    });
  }

  setForceChangeList(): void {
    this.forceChangeForm.setControl(
      "attendance",
      this.setForceChangeFormArray(this.forceChangeAttendance)
    );
  }

  setForceChangeFormArray(forceChangeAttendance): FormArray {
    const forceChangeFormArray = new FormArray([]);
    if (forceChangeAttendance && forceChangeAttendance.length > 0) {
      forceChangeAttendance.forEach((element) => {
        forceChangeFormArray.push(
          this.fb.group({
            id: element.attendance_id,
            in_datetime: element.checkin_datetime.replace(" ", "T"),
            out_datetime: element.checkout_datetime.replace(" ", "T"),
            tot_work: [element.tot_work],
            status: [element.status],
            status_out: [element.status_out],
          })
        );
      });
    } else {
      forceChangeFormArray.push(
        this.fb.group({
          id: [""],
          in_datetime: [""],
          out_datetime: [""],
          tot_work: [""],
          status: [""],
          status_out: [""],
        })
      );
    }
    return forceChangeFormArray;
  }

  obj: any;
  forceChangebody: any;
  forceChangeSubmit(): void {
    this.forceChangeForm.get("attendance").value[0].in_datetime =
      this.forceChangeForm
        .get("attendance")
        .value[0].in_datetime.replace("T", " ");
    this.forceChangeForm.get("attendance").value[0].out_datetime =
      this.forceChangeForm
        .get("attendance")
        .value[0].out_datetime.replace("T", " ");
    const forceChangeArray = this.forceChangeForm.get("attendance").value;

    //we validate for in date and out date
    if (forceChangeArray.length) {
      if (!this.validateCheckInAndCheckOutDate(forceChangeArray)) {
        this.toasterMessageService.showError("Checkout date cannot be smaller than checkin");
        return;
      }
    }
    this.obj = {
      client_id: this.reportForm.value.client_id,
      user_id: this.reportForm.value.user_id,
      company_id: this.globalService.getCompanyIdFromStorage(),
      attendance: forceChangeArray,
    };
    this.forceChangebody = {
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      user: this.reportForm.value.user.split(" "),
      date_from: this.globalService.transformFromDatepicker(
        this.reportForm.value.date_from
      ),
      date_to: this.globalService.transformFromDatepicker(
        this.reportForm.value.date_to
      ),

      type: this.reportForm.value.type,
    };

    this.updateForceChanges();
  }

  updateForceChanges(): void {
    if (this.forceChangeForm.invalid || this.forceChangeForm.pristine) return;

    this.monthlyReportService
      .addForceChangeMultiple(this.obj)
      .subscribe((response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(response.detail);
          this.modalRef.hide();
        }
        this.getMonthlyReport(this.forceChangebody);
      });
  }

  checkDepartment(event): void {
    if (event.target.checked == true) {
      this.showDepartment = true;
      this.reportForm.controls["department_column"].setValue(1);
    }
    if (event.target.checked == false) {
      this.showDepartment = false;
      this.reportForm.get("department_column").setValue(0);
    }
  }

  checkEmpId(event): void {
    if (event.target.checked == true) {
      this.showEmpId = true;
      this.reportForm.get("eeid_column").setValue(1);
    }
    if (event.target.checked == false) {
      this.showEmpId = false;
      this.reportForm.get("eeid_column").setValue(0);
    }
  }

  checkLunchColumn(event): void {
    if (event.target.checked == true) {
      this.showLunch = true;
      this.reportForm.get("lunch_column").setValue(1);
    } else {
      this.showLunch = false;
      this.reportForm.get("lunch_column").setValue(0);
    }
  }

  addItem(event) {
    const body = {
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      user: this.reportForm.value.user.split(" "),
      date_from: this.globalService.transformFromDatepicker(
        this.reportForm.value.date_from
      ),
      date_to: this.globalService.transformFromDatepicker(
        this.reportForm.value.date_to
      ),

      type: this.reportForm.value.type,
    };

    this.getMonthlyReport(body);
  }

  showDailyReport(event): void {
    const dailyBody = {
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      type: this.reportForm.value.type,
      date: this.globalService.transformFromDatepicker(
        this.reportForm.value.date
      ),
      department_column: this.reportForm.value.department_column,

      eeid_column: this.reportForm.value.eeid_column,
      lunch_column: this.reportForm.value.lunch_column,
      user: this.userIds, // Staff id of all Users
      limit: this.limit,
      page: this.globalService.pageNumber,
    };
    this.getDailyReport(dailyBody);
  }

  checkWeeklyReport(event): void {
    if (event.target.checked == true) {
      this.showLunch = true;
      this.reportForm.controls["lunch_column"].setValue(1);
    } else {
      this.showLunch = false;
      this.reportForm.controls["lunch_column"].setValue(0);
    }
    const body = {
      page: this.globalService.pageNumber,
      limit: "30",
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      user: this.reportForm.value.user,
      begDate: this.reportForm.value.begDate,
      endDate: this.reportForm.value.endDate,
      gracetime: this.reportForm.value.gracetime,
      type: this.reportForm.value.type,
      department_column: this.reportForm.value.department_column,
      eeid_column: this.reportForm.value.eeid_column,
      lunch_column: this.reportForm.value.lunch_column,
    };
    this.getWeeklyReports(body);
  }

  changeEmployeeForm(value): void {
    this.reportForm.get("user").reset();
    if (this.datePickerFormat == "N") {
      //  this.disableBefore = null;
      this.nepaliDatePickerSettingsForDateTo = null;
      this.nepaliDatePickerSettingsForMonthlyDateFrom = null;
      this.nepaliDatePickerSettingsForDailyDate = null;
      this.initNepaliDatePickerSettingByReportType(value);
    }
  }

  // Force Change Daily
  forceChangeDailyAttendance;

  openForceChangeDaily(template: TemplateRef<any>, dataItem): void {
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      centered: true,
    };
    this.selectedForceChangeList = dataItem;
    this.buildForceChangeDailyForm();
    this.modalRef = this.modalService.show(template, config);
    let body = {
      id: dataItem.staff_id,
      client_id: this.reportForm.value.client_id,
      date: dataItem.date,
    };

    this.monthlyReportService.getUserAttendance(body).subscribe((response) => {
      this.forceChangeDailyAttendance = response;
      this.setForceChangeDailyList();
    });
  }

  setForceChangeDailyList(): void {
    this.forceChangeDailyForm.setControl(
      "attendance",
      this.setForceChangeDailyFormArray(this.forceChangeDailyAttendance)
    );
  }

  setForceChangeDailyFormArray(forceChangeDailyAttendance): FormArray {
    const forceChangeDailyFormArray = new FormArray([]);
    if (forceChangeDailyAttendance && forceChangeDailyAttendance.length > 0) {
      forceChangeDailyAttendance.forEach((element) => {
        forceChangeDailyFormArray.push(
          this.fb.group({
            id: element.attendance_id,
            in_datetime: element.checkin_datetime.replace(" ", "T"),
            out_datetime: element.checkout_datetime.replace(" ", "T"),
            tot_work: [element.tot_work],
            status: [element.status],
            status_out: [element.status_out],
          })
        );
      });
    } else {
      forceChangeDailyFormArray.push(
        this.fb.group({
          id: [""],
          in_datetime: [""],
          out_datetime: [""],
          tot_work: [""],
          status: [""],
          status_out: [""],
        })
      );
    }
    return forceChangeDailyFormArray;
  }

  buildForceChangeDailyForm(): void {
    this.forceChangeDailyForm = this.fb.group({
      attendance: this.fb.array([this.addForceEntryDailyFormGroup()]),
    });
  }

  addForceEntryDailyFormGroup(): FormGroup {
    return this.fb.group({
      in_datetime: "",
      out_datetime: "",
      tot_work: "",
      status: "",
      status_out: "",
    });
  }

  get forceChangeDailyValue() {
    return this.forceChangeDailyForm.get("attendance") as FormArray;
  }

  forceChangeSubmitDaily(): void {
    this.forceChangeDailyForm.get("attendance").value[0].in_datetime =
      this.forceChangeDailyForm
        .get("attendance")
        .value[0].in_datetime.replace("T", " ");

    this.forceChangeDailyForm.get("attendance").value[0].out_datetime =
      this.forceChangeDailyForm
        .get("attendance")
        .value[0].out_datetime.replace("T", " ");
    const forceChangeArray = this.forceChangeDailyForm.get("attendance").value;
    if (forceChangeArray.length) {
      if (!this.validateCheckInAndCheckOutDate(forceChangeArray)) {
        this.toasterMessageService.showError("Checkout date cannot be smaller than checkin");
        return;
      }
    }
    this.obj = {
      client_id: this.reportForm.value.client_id,
      user_id: this.reportForm.value.user_ids,
      company_id: this.globalService.getCompanyIdFromStorage(),
      attendance: forceChangeArray,
    };
    this.forceChangebody = {
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      user: this.userId,
      // date_from: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.date_from
      // ),
      // date_to: this.globalService.transformFromDatepicker(
      //   this.reportForm.value.date_to
      // ),
      date: this.globalService.transformFromDatepicker(
        this.reportForm.value.date
      ),

      type: this.reportForm.value.type,
    };
    this.updateForceChangesDaily();
  }

  updateForceChangesDaily(): void {
    const body = {
      company_id: this.companyId,
      client_id: this.reportForm.value.client_id,
      type: this.reportForm.value.type,
      date: this.globalService.transformFromDatepicker(
        this.reportForm.value.date
      ),
      department_column: this.reportForm.value.department_column,

      eeid_column: this.reportForm.value.eeid_column,
      lunch_column: this.reportForm.value.lunch_column,
      user: this.userIds, // Staff id of all Users
      limit: this.limit,
      page: this.globalService.pageNumber,
    };
    this.monthlyReportService
      .addForceChangeMultiple(this.obj)
      .subscribe((response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(response.detail);
          this.modalRef.hide();
        }
        this.getDailyReport(body);
      });
  }

  // To select all users at once....
  public onSelectAll(): void {
    const selected = this.staffLists.map((item) => item.user_id);

    this.addAttendanceForm.get("user_id").patchValue(selected);
  }

  // to clear all users at once....
  public onClearAll(): void {
    this.addAttendanceForm.get("user_id").patchValue([]);
  }

  currentDate = new Date();
  // custom validator to check whether the date is greater than current date..
  dateCheckValidator(control: AbstractControl) {
    // here getDate() is done to check current date with control
    // value because we cannot directly check date object because
    //  of time it will show different. so we have to catch date and check..

    let todaysDate = this.currentDate.getDate();
    // if (this.dateLang == "N") {
    //   // convert nepali date object to date and check..
    //   let dateInString = this.dateConverterService.getNepalidateObjectToString(
    //     control.value
    //   );
    //   let dateStringInAd = this.dateConverterService.bsToAdInString(
    //     dateInString
    //   );
    //   let controlDateObject = new Date(dateStringInAd);
    //   let controlDate = new Date(dateStringInAd).getDate();

    //   if (controlDateObject < this.currentDate && controlDate !== todaysDate) {
    //     return { dateValidator: true };
    //   }
    // } else {
    let controlDate = new Date(control.value).getDate();
    if (control.value < this.currentDate && controlDate !== todaysDate) {
      return { dateValidator: true };
    }
    // }
  }

  //for setting wise showing and hiding
  userPrefId: any;
  departmentChecked: boolean;
  eeIdChecked: boolean;
  upLunchChecked: boolean;
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
      this.reportForm.controls["department_column"].setValue(1);
    } else {
      this.departmentChecked = false;
      this.showDepartment = false;
      this.reportForm.controls["department_column"].setValue(0);
    }

    let eeIdObj = this.userPreferenceList.filter((x) => x.code == "UP_EEID")[0];
    if (eeIdObj && eeIdObj !== null && eeIdObj.value == "1") {
      this.eeIdChecked = true;
      this.showEmpId = true;
      this.reportForm.get("eeid_column").setValue(1);
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
      this.reportForm.get("lunch_column").setValue(1);
    } else {
      this.upLunchChecked = false;
      this.showLunch = false;
    }
  }

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

  settingFromCompanyWise: any;
  configUserDateAndTimeSetting() {
    //if no userpreference
    this.settingFromCompanyWise = this.localStorageService.getLocalStorageItem(
      "setting_list"
    )
      ? this.localStorageService.getLocalStorageItem("setting_list")
      : null;
    if (!this.dateFormatSetting || !this.dateFormatSetting.value) {
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

  timeFormat;

  setTimeFormatSetting(): void {
    if (this.timeFormatSetting) {
      this.timeFormat = this.timeFormatSetting.value;
    } else {
      this.timeFormat = "12";
    }
  }

  onLunchChange(event) {
    if (this.addAttendanceForm.value.lunch == false) {
      this.addAttendanceForm.get("lunchin_datetime").setValue("");
      this.addAttendanceForm.get("lunchout_datetime").setValue("");
    }
    else {
      if (this.addAttendanceForm.get('checkin_datetime').value) {
        // this.customDateTimeLocalPickerSettingsForLunchOut.maxDate = this.addAttendanceForm.get('checkin_datetime').value;
        this.customDateTimeLocalPickerSettingsForLunchOut.minDate = this.addAttendanceForm.get('checkin_datetime').value;
      }
    }
  }
  onCheckInChange() {
    if (this.addAttendanceForm.value.check == false) {
      this.addAttendanceForm.get("checkin_datetime").setValue("");
      this.addAttendanceForm.get("checkout_datetime").setValue("");
    }
  }
  onForceChangeValidate(rowIndex, type) {
    if (type == 'monthly') {


      let checkInDate = this.forceChangeValue.controls[rowIndex].get('in_datetime').value;
      let checkoutDate = this.forceChangeValue.controls[rowIndex].get('out_datetime').value;
      //  console.log('condition',checkInDate  > checkoutDate)
      if (checkInDate > checkoutDate) {
        this.toasterMessageService.showError("Checkout date cannot be smaller than checkin");
        // this.forceChangeValue.controls[rowIndex].get('out_datetime').setValue("");
        return;
      }
    }
    else if (type == 'daily') {
      // forceChangeDailyValue.controls[rowIndex].get('out_datetime')
      let checkInDate = this.forceChangeDailyValue.controls[rowIndex].get('in_datetime').value;
      let checkoutDate = this.forceChangeDailyValue.controls[rowIndex].get('out_datetime').value;
      //  console.log('condition',checkInDate  > checkoutDate)
      if (checkInDate > checkoutDate) {
        this.toasterMessageService.showError("Checkout date cannot be smaller than checkin");
        // this.forceChangeValue.controls[rowIndex].get('out_datetime').setValue("");
        return;
      }
    }
  }

  validateCheckInAndCheckOutDate(forceChangeArray: any[]): boolean {
    //returns true if all checkin and checkout date are valid
    let booleanValue = true;
    forceChangeArray.forEach(x => {
      if (x.in_datetime > x.out_datetime) {
        booleanValue = false;
        return;
      }
    })
    return booleanValue;
  }

  getAllUsersList() {
    this.monthlyReportService.getUserLists().subscribe((data: CustomResponse) => {
      if (data.status) {
        this.staffList = data.data;
      }
    })
  }




  //setting for each datepicker formcontrol
  customDateTimeLocalPickerSettingsForCheckIn: CustomDateTimeLocalPickerSettings = {
    id: 'checkin',
    minDate: new Date(),
    maxDate: new Date(),
    class: '',
    placeholder: 'Check In Date Time'
  }
  customDateTimeLocalPickerSettingsForCheckOut: CustomDateTimeLocalPickerSettings = {
    id: 'checkOut',
    minDate: new Date(),
    maxDate: new Date(),
    class: '',
    placeholder: 'Check Out Date Time'
  }
  customDateTimeLocalPickerSettingsForLunchOut: CustomDateTimeLocalPickerSettings = {
    id: 'lunchOut',
    minDate: new Date(),
    maxDate: new Date(),
    class: '',
    placeholder: 'Lunch Out Date Time'
  }
  customDateTimeLocalPickerSettingsForLunchIn: CustomDateTimeLocalPickerSettings = {
    id: 'lunchIn',
    minDate: new Date(),
    maxDate: new Date(),
    class: '',
    placeholder: 'Lunch In Date Time'
  }

  onCheckInValue(value) {
    //if validation is required we just pass the date here we just pass here for min and max
    // this.customDateTimeLocalPickerSettingsForCheckOut.maxDate = value;
    this.customDateTimeLocalPickerSettingsForCheckOut.minDate = value;
    this.addAttendanceForm.get('checkout_datetime').setValue(value);

    if (this.addAttendanceForm.value.lunch) {
      //pass the lunchout date for validation
      // this.customDateTimeLocalPickerSettingsForLunchOut.maxDate = value;
      this.customDateTimeLocalPickerSettingsForLunchOut.minDate = value;
      this.addAttendanceForm.get('lunchout_datetime').setValue(value);
      this.addAttendanceForm.get('lunchin_datetime').setValue(value);
    }
  }

  checkoutValueChange(value) {
    // console.log("CHECKING OUT",value);
  }
  onLunchOutValue(value) {
    // this.customDateTimeLocalPickerSettingsForLunchIn.maxDate = value;
    this.customDateTimeLocalPickerSettingsForLunchIn.minDate = value;
  }
  ngAfterViewChecked() {
    //your code to update the model
    this.cdref.detectChanges();
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
      }
    }
  }
  nepaliDatePickerSettingsForDailyDate: NepaliDatePickerSettings;
  nepaliDatePickerSettingsForDateFrom: NepaliDatePickerSettings;
  nepaliDatePickerSettingsForDateTo: NepaliDatePickerSettings;
  nepaliDatePickerSettingsForMonthlyDateFrom: NepaliDatePickerSettings
  nepaliDatePickerSettingsForMonthlyDateTo: NepaliDatePickerSettings;
  nepaliDatePickerSettingsForWeeklyDateFrom: NepaliDatePickerSettings;
  NepaliDatePickerSettingsForWeeklyDateTo: NepaliDatePickerSettings;
  initSettingsForNepaliDatePicker() {
    if (this.datePickerFormat !== "N") {
      return;
    }
    this.nepaliDatePickerSettingsForDateFrom = {
      language: "english",
      dateFormat: this.datePickerConfig.dateInputFormat,
      ndpMonth: true,
      ndpYear: true
    }
    this.nepaliDatePickerSettingsForDateTo = {
      language: "english",
      dateFormat: this.datePickerConfig.dateInputFormat,
      ndpYear: true,
      disableBefore: null,
      ndpMonth: true,
    }
  }
  changeDate(date, type) {

    if (type == "monthly") {
      this.disableBefore = date;
      let currentNepaliMonth = this.datePickerConfig.dateInputFormat == "YYYY/MM/DD" ? this.reportForm.get('date_from').value.substring(5, 7)
        :
        this.reportForm.get('date_from').value.substring(0, 2);
      currentNepaliMonth = currentNepaliMonth < 9 ? currentNepaliMonth.substring(1, 2) : currentNepaliMonth;
      this.reportForm.get("month").setValue(currentNepaliMonth);

    }
    if (type == "weekly") {

      this.setLastDayOfNepaliWeek(date);
    }
  }
  setLastDayOfNepaliWeek(date) {
    if (this.datePickerConfig.dateInputFormat == "MM/DD/YYYY") {
      let month = date.substring(0, 2);
      let day = date.substring(3, 5);
      let year = date.substring(6, 10);
      let dateTo = (month) + "/" + this.adbsConvertService.getTwoDigitString((parseInt(day) + 6)) + "/" + year;
      let lastDayOfMonth = this.getLastdateOfNepaliMonth(month);
      let increasedDate = (parseInt(day) + 6);
      if(increasedDate > lastDayOfMonth){
        let differenceDate = increasedDate - lastDayOfMonth;
        dateTo = this.adbsConvertService.getTwoDigitString((parseInt(month)+1)) + "/" + (this.adbsConvertService.getTwoDigitString(differenceDate)) + "/" + year;
      }
      this.reportForm.get("endDate").setValue(
        dateTo
      );
    }
    else {
      // yyyy/mm/dd
      let month = date.substring(5, 7);
      let day = date.substring(8, 10);
      let year = date.substring(0, 4);

      let dateTo = year+"/"+(month) + "/" + this.adbsConvertService.getTwoDigitString((parseInt(day) + 6));
      let lastDayOfMonth = this.getLastdateOfNepaliMonth(month);
      let increasedDate = (parseInt(day) + 6);
      if(increasedDate > lastDayOfMonth){
        let differenceDate = increasedDate - lastDayOfMonth;
        dateTo =  year+"/"+this.adbsConvertService.getTwoDigitString((parseInt(month)+1)) + "/" + (this.adbsConvertService.getTwoDigitString(differenceDate));
      }
      this.reportForm.get("endDate").setValue(
        dateTo
      );
    }
  }
  // @ViewChild("showDailyPicker",{static:false}) showDailyPicker:NepaliDatePickerComponent = new NepaliDatePickerComponent();
  initNepaliDatePickerSettingByReportType(reportType) {
    if (this.datePickerFormat == 'E') {
      return;
    }

    switch (reportType) {
      //monthly
      case "1":
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
      case "2":

        this.nepaliDatePickerSettingsForDailyDate = {
          language: "english",
          dateFormat: this.datePickerConfig.dateInputFormat,
          ndpMonth: true,
          ndpYear: true
        }
        this.disableBefore = null;
        setTimeout(() => {
          this.reportForm.get("date").setValue(this.assignDailyDateBySetting());
        }, 100)
        break;
      //weekly
      case "3":
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
        case "4":
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
  getCurrentNepaliMonth() {
    this.currentNepaliFirstDayOfMonth = this.adbsConvertService.getNepaliFirstDayOfMonth(this.datePickerConfig.dateInputFormat);
    let currentNepaliMonth = this.datePickerConfig.dateInputFormat == "YYYY/MM/DD" ? this.currentNepaliFirstDayOfMonth.substring(5, 7)
      :
      this.currentNepaliFirstDayOfMonth.substring(0, 2);
    this.disableBefore = this.currentNepaliFirstDayOfMonth
    currentNepaliMonth = currentNepaliMonth < 9 ? currentNepaliMonth.substring(1, 2) : currentNepaliMonth;
    return currentNepaliMonth;
  }

  disableBefore: any;
  onNepaliMonthChange(value) {
    // console.log(value)
    if (this.datePickerConfig.dateInputFormat == "YYYY/MM/DD") {
      // reportForm
      let year = this.reportForm.get("date_from").value.substring(0, 4);
      value = value.length == 1 ? "0" + value : value;
      this.reportForm.get("date_from").setValue(
        `${year}/${value}/01`
      )
      this.reportForm.get("date_to").setValue(
        `${year}/${value}/${this.getLastdateOfNepaliMonth(value)}`
      )
      this.disableBefore = `${year}/${value}/${this.getLastdateOfNepaliMonth(value)}`;

    }
    else {
      let year = this.reportForm.get("date_from").value.substring(6, 10);
      value = value.length == 1 ? "0" + value : value;
      this.reportForm.get("date_from").setValue(
        `${value}/01/${year}`
      )

      this.reportForm.get("date_to").setValue(
        `${value}/${this.getLastdateOfNepaliMonth(value)}/${year}`
      )
      this.disableBefore = `${value}/${this.getLastdateOfNepaliMonth(value)}/${year}`;

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
  setNepaliDateForMonthly() {
    this.reportForm.get("date_from").setValue(
      this.adbsConvertService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat)
    );
    // this.disableBefore = this.reportForm.get("date_from").value;
    this.reportForm.get("date_to").setValue(
      this.adbsConvertService.getLastDayOfNepaliMonth(this.datePickerConfig.dateInputFormat)
    );
    setTimeout(() => {
      this.disableBefore = this.adbsConvertService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat)

    })
  }

  setNepaliDateForWeekly() {
    this.reportForm.get("endDate").setValue(
      this.adbsConvertService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat)
    );
    this.reportForm.get("begDate").setValue(
      this.adbsConvertService.getPreviousSevenDaysDate(this.datePickerConfig.dateInputFormat)
    );
  }

}
