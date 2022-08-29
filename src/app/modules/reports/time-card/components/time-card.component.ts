import { DateConverterService } from "./../../../../shared/services/dateConverter/date-converter.service";
import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ClientService } from "@app/modules/manage-client/client/client.service";
import { ClientwiseAttendanceReportService } from "@app/modules/manage-client/clientswise-attendance-report/services/clientwise-attendance-report.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import {
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { BsDatepickerConfig } from "ngx-bootstrap";
import { TimeCardReport, Users } from "../models/time-card.models";
import { TimeCardService } from "../services/time-card.service";
import * as XLSX from "xlsx";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { NepaliDatePickerSettings } from "@app/shared/components/nepali-date-picker/modals/nepalidatepickersettings.interface";
import { AdBsDateConvertService } from "@app/shared/components/custom-nepalidatepicker/services/ad-bs-date-convert.service";
declare var require: any;
var adbs = require("ad-bs-converter");

@Component({
  selector: "app-time-card",
  templateUrl: "./time-card.component.html",
  styleUrls: ["./time-card.component.scss"],
})
export class TimeCardComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>;

  timeCardReportList: TimeCardReport[] = [];
  clientList = [];
  userList: Users[] = [];

  companyId = this.globalService.getCompanyIdFromStorage();
  dateSettingFromStorage =
    this.globalService.getDateSettingFromStorage().GS_DATE;
  staff_id = this.localStorageService.getLocalStorageItem("user_id");

  excelButtonView: boolean = false;
  showClient: boolean = false;
  loading: boolean;

  // ....Kendo Table....
  public state: State = {
    skip: 0,
    take: 10,
  };
  //Initial Filter Descriptor
  filter: {
    logic: "and";
    filters: [];
  };
  dateFormatSetting: any;
  englishFirstDayOfMonth;
  userStaff;
  constructor(
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private localStorageService: LocalStorageService,
    private datePipe: DatePipe,
    private timeCardService: TimeCardService,
    private toastrMessageService: ToastrMessageService,
    private dateConverterService: DateConverterService,
    public authService: AuthService,
    private adbsConvertService:AdBsDateConvertService
  ) {
    (this.userStaff = this.localStorageService.getLocalStorageItem("staff_id")),
      (this.dateFormatSetting =
        this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT"));
    // this.datePickerConfig = Object.assign(
    //   {},
    //   {
    //     containerClass: "theme-dark-blue",
    //     showWeekNumbers: false,
    //     dateInputFormat:
    //       this.dateFormatSetting && this.dateFormatSetting.value == "yyyy/mm/dd"
    //         ? "YYYY/MM/DD"
    //         : "MM/DD/YYYY",
    //   }
    // );
    this.configUserDateAndTimeSetting();
    this.englishFirstDayOfMonth =
      this.globalService.transformForDatepickerPreview(
        this.firstDay,
        this.datePickerConfig.dateInputFormat
      );
      this.initSettings();
  }

  nepaliMonthType;
  timeCardForm: FormGroup;
  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "";
  search_value = "";
  monthType;
  todaysDateInEnglish = new Date();
  nepaliMonth = this.globalService.nepaliMonth;
  englishMonth = this.globalService.englishMonth;

  ngOnInit() {
    this.buildTimeCardForm();
    this.getEmployeeList();
    this.getClientListByRole();
    // this.getClientBasicInformationList();
    // if(this.authService.currentUserRoleValue =='Admin'
    // ||this.authService.currentUserRoleValue =='Super Admin'
    //   ){
    //     this.getClientBasicInformationList();
    //   }
    //   else if(
    //     this.authService.currentUserRoleValue == 'Manager' ||
    //     this.authService.currentUserRoleValue == 'HR'
    //   ){
    //     this.getClientFromStaff();
    //   }

    this.nepaliMonthType = this.globalService.nepaliMonth;

    this.monthType = this.englishMonth;
    this.initNepaliDatePickerSetting();
  }

  getClientListByRole(){
    if(this.authService.currentUserRoleValue =='Admin'
    ||this.authService.currentUserRoleValue =='Super Admin'
      ){
        this.getClientBasicInformationList();
            // getallusersatFirst
        this.getAllUsersList();
      }
      else if(
        this.authService.currentUserRoleValue == 'Manager' ||
        this.authService.currentUserRoleValue == 'HR'
      ){
        this.getClientFromStaff();
      }
  }
  getAllUsersList(){
    this.timeCardService.getUserLists().subscribe((data:CustomResponse)=>{
      console.log(data);
      if(data.status){
        this.userList = data.data;
      }
    })
  }
  onClearAll(){
    this.getClientListByRole();
  }



  getClientFromStaff() {
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    this.timeCardService
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

  // For exporting the time card report in excel
  exportExcel(): void {
    let fileName;
    if (this.timeCardForm.value.user_id.length == 1) {
      const selectedUser = this.userList.filter(
        (users) => users.staff_id === this.timeCardForm.value.user_id[0]
      );
    }

    /* table id is passed over here */
    let element = document.getElementById("excel-table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(
      wb,
      "Time_Card_Report_" +
        this.datePipe.transform(Date.now(), "yyyy_MM_dd_H_m_s") +
        ".xlsx"
    );
  }

  buildTimeCardForm(): void {
    this.timeCardForm = this.formBuilder.group({
      company_id: this.companyId,
      client_id: [""],
      user_id: [""],
      month: [
        this.datePickerFormat == "E"
          ? this.globalService.currentEnglishMonth
          :this.getCurrentNepaliMonth(),
      ],
      begDate: [
        this.datePickerFormat == "E"
          ? this.englishFirstDayOfMonth
          : this.globalService.nepalifirstDayOfMonth,
      ],
      endDate: [
        this.datePickerFormat == "E"
          ? this.globalService.transformForDatepickerPreview(
              this.todaysDate,
              this.datePickerConfig.dateInputFormat
            )
          : this.currentNepaliDate,
      ],
    });
  }

  todaysDate = new Date();

  currentNepaliYearObject = this.globalService.currentNepaliYearObject;
  currentNepaliYear = this.globalService.currentNepaliYear;
  firstDay = this.globalService.englishFirstDayOfMonth;
  // englishFirstDayOfMonth = this.globalService.transformForDatepickerPreview(
  //   this.firstDay,this.datePickerConfig.dateInputFormat
  // );
  nepalifirstDayOfMonth = this.globalService.nepalifirstDayOfMonth;
  // nepaliFirstDayInString = this.globalService.nepaliFirstDayInString;
  currentNepaliDate = this.globalService.currentNepaliDate;
  currentNepaliDateInString = this.globalService.currentNepaliDateInString;

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
    this.timeCardForm.get("begDate").patchValue(englishFirstDayOfMonth);

    // let englishLastDayOfMonth = this.datePipe.transform(
    //   new Date(this.todaysDateInEnglish.getFullYear(), value, 0),
    //   "MM-dd-yyyy"
    // );
    let englishLastDayOfMonth =
      this.globalService.transformForDatepickerPreview(
        new Date(this.todaysDateInEnglish.getFullYear(), value, 0),
        this.datePickerConfig.dateInputFormat
      );
    this.timeCardForm.get("endDate").patchValue(englishLastDayOfMonth);
  }

  getClientBasicInformationList(): void {
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
          this.showClient = true;
          this.clientList = response.data;
        } else {
          this.showClient = false;
          this.clientList = [];
        }
      });
  }

  clientChange(): void {
    this.timeCardForm.get("user_id").setValue("");
    this.userList = [];
    let clientid  = this.timeCardForm.get('client_id').value;
    if(clientid == null || clientid == ''){
      this.getClientListByRole();
    }
    else{
      this.timeCardService
      .getUserByClientId(this.timeCardForm.get("client_id").value)
      .subscribe((response) => {
        if (response.status) {
          this.userList = response.data;
        } else {
          this.userList = [];
        }
      });
    }
  }

  employeeList;
  getEmployeeList(): void {
    this.globalService.getEmployeeList(this.companyId).subscribe((response) => {
      if (response.status) {
        this.employeeList = response.data;
      } else {
        this.employeeList = [];
      }
    });
  }

  onSubmitTimeCard(): void {
    this.excelButtonView = true;
    if (this.datePickerFormat == "N") {
      const nepObj = {
        company_id: this.companyId,
        client_id: this.timeCardForm.value.client_id,
        begDate: this.datePickerFormat == "E"? this.dateConverterService.bsToAdInString(
          this.dateFormatter(this.timeCardForm.value.begDate)
        ):this.adbsConvertService.transformDateForAPI(
          this.timeCardForm.value.begDate,
          this.datePickerConfig.dateInputFormat
        )
        ,

        endDate: this.datePickerFormat=='E'? this.dateConverterService.bsToAdInString(
          this.dateFormatter(this.timeCardForm.value.endDate)
        ):
        this.adbsConvertService.transformDateForAPI(
          this.timeCardForm.value.endDate,
          this.datePickerConfig.dateInputFormat
        )
        ,
        user: this.timeCardForm.value.user_id,
      };
      this.getTimeCardList(nepObj);
    } else {
      const obj = {
        company_id: this.companyId,
        client_id: this.timeCardForm.value.client_id,
        begDate: this.globalService.transformFromDatepicker(
          this.timeCardForm.value.begDate
        ),
        endDate: this.globalService.transformFromDatepicker(
          this.timeCardForm.value.endDate
        ),
        user: this.timeCardForm.value.user_id,
      };
      this.getTimeCardList(obj);
    }
  }

  onSubmitTimeCards(): void {
    let staffArr = [];
    staffArr.push(String(this.userStaff));
    this.excelButtonView = true;
    if (this.dateSettingFromStorage == "N") {
      const nepObj = {
        company_id: this.companyId,
        client_id: null,
        begDate: this.dateConverterService.bsToAdInString(
          this.dateFormatter(this.timeCardForm.value.begDate)
        ),

        endDate: this.dateConverterService.bsToAdInString(
          this.dateFormatter(this.timeCardForm.value.endDate)
        ),
        user: staffArr,
      };
      this.getTimeCardList(nepObj);
    } else {
      const obj = {
        company_id: this.companyId,
        client_id: null,
        begDate: this.globalService.transformFromDatepicker(
          this.timeCardForm.value.begDate
        ),
        endDate: this.globalService.transformFromDatepicker(
          this.timeCardForm.value.endDate
        ),
        user: staffArr,
      };
      this.getTimeCardList(obj);
    }
  }

  // date formater for nepali date-picker
  dateFormatter(date) {
    let dateFormatter = `${date.year}/${date.month + 1}/${date.day}`;
    return dateFormatter;
  }
  getTimeCardList(obj): void {
    this.timeCardReportList = [];
    this.loading = true;
    if (this.timeCardForm.invalid) return;

    this.timeCardService.getTimeCardReportList(obj).subscribe(
      (response) => {
        if (response.status) {
          this.timeCardReportList = response.data;
          this.loading = false;
        } else {
          this.timeCardReportList = [];
          this.toastrMessageService.showError(response.data);
        }
      },
      (error) => {
        this.loading = false;
        this.toastrMessageService.showError(error);
      },
      () => {
        this.loading = false;
      }
    );
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
  nepaliDatePickerSettingsForDateTo: NepaliDatePickerSettings;
  nepaliDatePickerSettingsForDateFrom: NepaliDatePickerSettings;
  changeDate(date, type) {
    console.log("date ", date, type);
    if (type == "dateFrom") {
      this.disableBefore = date;
      let dateToValue = this.timeCardForm.get("endDate").value;
      if (dateToValue && dateToValue < date) {
        this.timeCardForm.get("nepaliDateTo").setValue("");
      }
  }

}
disableBefore;
initNepaliDatePickerSetting() {
  if (this.datePickerFormat == 'E') {
    return;
  }
      this.nepaliDatePickerSettingsForDateFrom = {
        language: "english",
        dateFormat: this.datePickerConfig.dateInputFormat,
        ndpMonth: true,
        ndpYear: true
      };
      this.nepaliDatePickerSettingsForDateTo = {
        language: "english",
        dateFormat: this.datePickerConfig.dateInputFormat,
        ndpMonth: true,
        ndpYear: true,
      }
      this.setNepaliDateForMonthly();
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
onNepaliMonthChange(value) {
  // console.log(value)
  if (this.datePickerConfig.dateInputFormat == "YYYY/MM/DD") {
    // reportForm
    let year = this.timeCardForm.get("begDate").value.substring(0, 4);
    value = value.length == 1 ? "0" + value : value;
    this.timeCardForm.get("begDate").setValue(
      `${year}/${value}/01`
    )
    this.timeCardForm.get("endDate").setValue(
      `${year}/${value}/${this.getLastdateOfNepaliMonth(value)}`
    )
    this.disableBefore = `${year}/${value}/${this.getLastdateOfNepaliMonth(value)}`;

  }
  else {
    let year = this.timeCardForm.get("begDate").value.substring(6, 10);
    value = value.length == 1 ? "0" + value : value;
    this.timeCardForm.get("begDate").setValue(
      `${value}/01/${year}`
    )

    this.timeCardForm.get("endDate").setValue(
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
  this.timeCardForm.get("begDate").setValue(
    this.adbsConvertService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat)
  );
  // this.disableBefore = this.reportForm.get("date_from").value;
  this.timeCardForm.get("endDate").setValue(
    this.adbsConvertService.getLastDayOfNepaliMonth(this.datePickerConfig.dateInputFormat)
  );
  setTimeout(() => {
    this.disableBefore = this.adbsConvertService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat)

  })
}

}
