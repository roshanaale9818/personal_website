import { BsDatepickerConfig } from "ngx-bootstrap";
import { LeaveRequestService } from "./../../../request-received/service/leave-request.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "./../../../../../shared/services/local-storage/local-storage.service";
import { MonthlyReportService } from "./../../../../reports/monthly-report/services/monthly-report.service";
import { DatePipe } from "@angular/common";
import { ToastrMessageService } from "./../../../../../shared/services/toastr-message/toastr-message.service";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { GlobalService } from "@app/shared/services/global/global.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { CreateRequestService } from "../../service/create-request.service";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { DateConverterService } from "@app/shared/services/dateConverter/date-converter.service";
import { NepaliDatePickerSettings } from './../../../../../shared/components/nepali-date-picker/modals/nepalidatepickersettings.interface';
import { AdBsDateConvertService } from "@app/shared/components/custom-nepalidatepicker/services/ad-bs-date-convert.service";

@Component({
  selector: "app-create-request",
  templateUrl: "./create-request.component.html",
  styleUrls: ["./create-request.component.scss"],
})
export class CreateRequestComponent implements OnInit {
  submitted: boolean;
  createRequestForm: FormGroup;
  listleaveType;
  staffList: any;
  dateLang; //: string;
  currentDate = new Date();
  accessLevel = this.globalService.getAccessLevelFromStorage();
  role = this.localStorageService.getLocalStorageItem("role");

  // Api Params variable
  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "";
  search_value = "";
  selectedLeaveRequest: any;
  dateFormatSetting: any;
  disableBeforeForFrom
  constructor(
    private globalService: GlobalService,
    private fb: FormBuilder,
    private createRequestService: CreateRequestService,
    private dateConverterService: DateConverterService,
    private toastrMessageService: ToastrMessageService,
    private datePipe: DatePipe,
    private monthlyReportService: MonthlyReportService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private leaveRequestService: LeaveRequestService,
    private toasterMessageService: ToastrMessageService,
    private cdref: ChangeDetectorRef,
    private adbsDateConverService: AdBsDateConvertService
  ) {
    this.selectedLeaveRequest =
      this.leaveRequestService.getSelectedLeaveRequest();
    this.dateFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
    this.configUserDateAndTimeSetting();
    this.initSettings();
  }

  // ngOnChanges(changeDetectorRef: ChangeDetectorRef) {
  //   this.cdref.detectChanges()
  //  }
  ngAfterViewChecked() {
    //your code to update the model
    this.cdref.detectChanges();
  }


  company_id = this.globalService.getCompanyIdFromStorage();
  staff_id = this.localStorageService.getLocalStorageItem("user_id");
  // staffDisabled = this.selectedLeaveRequest ? true : false;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  datePickerConfig: Partial<BsDatepickerConfig>;
  datePickerConfigForTo: Partial<BsDatepickerConfig>;

  ngOnInit() {
    this.initSettingsForNepaliDatePicker();
    this.buildCreateRequestForm();
    this.getLeaveTypes();
    // this.getStaffList();
    this.getUserList();
    this.patchValueToForm();
    // this.dateLang = this.globalService.getDateSettingFromStorage().GS_DATE;
  }
  patchValueToForm() {
    if (this.selectedLeaveRequest && this.dateLang == "N") {
      console.log("Patching value to the form")
      this.createRequestForm.get(
        'date_from'
      )
        .setValue(
          this.adbsDateConverService.transformNepaliDatePickerPreview(
            this.selectedLeaveRequest.date_from,
            this.datePickerConfig.dateInputFormat
          )
        )
      this.createRequestForm.get(
        'date_to'
      )
        .setValue(
          this.adbsDateConverService.transformNepaliDatePickerPreview(
            this.selectedLeaveRequest.date_to,
            this.datePickerConfig.dateInputFormat
          )
        )
    }

  }
  datePickerFormat;
  systemSetting;
  datePickerSettingUserWise;
  initSettings() {
    this.systemSetting = this.globalService.getDateSettingFromStorage();
    //init the system date picker setting
    if (this.systemSetting !== null && this.systemSetting !== undefined) {
      this.dateLang = this.systemSetting.GS_DATE;
    }
    this.datePickerSettingUserWise = this.globalService.getUserPreferenceSetting('UP_DATE_TYPE');
    if (this.datePickerSettingUserWise !== undefined && this.datePickerSettingUserWise !== null) {
      if (this.datePickerSettingUserWise.value) {
        this.dateLang = this.datePickerSettingUserWise.value == 'BS' ? 'N' : 'E';
      }
    }
  }
  disableBefore;
  changeDate(value, type) {
    if (type == "dateFrom") {
      this.disableBefore = value;
      let dateToValue = this.createRequestForm.get("date_to").value;
      if (dateToValue && dateToValue < value) {
        this.createRequestForm.get("date_to").setValue("");
      }
    }
    console.log("cahnged called and form value", this.createRequestForm.value)
  }


  //settings for nepali datepicker

  nepaliDatePickerSettingsForDateFrom: NepaliDatePickerSettings;
  nepaliDatePickerSettingsForDateTo: NepaliDatePickerSettings;
  initSettingsForNepaliDatePicker() {
    if (this.dateLang !== "N") {
      return;
    }
    this.disableBeforeForFrom = this.adbsDateConverService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat);
    this.nepaliDatePickerSettingsForDateFrom = {
      language: "english",
      dateFormat: this.datePickerConfig.dateInputFormat,
      disableBefore: !this.selectedLeaveRequest ? this.adbsDateConverService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat) : null,
      ndpMonth: true,
      ndpYear: true
    }
    this.nepaliDatePickerSettingsForDateTo = {
      language: "english",
      dateFormat: this.datePickerConfig.dateInputFormat,
      ndpYear: true,
      disableBefore: this.adbsDateConverService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat),
      // disableBefore: this.adbsDateConverService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat),
      ndpMonth: true,
    }
  }


















  todaysDate = new Date();
  // user_id: [
  // "",
  // {
  //   value: this.selectedLeaveRequest
  //     ? this.selectedLeaveRequest.staff_id
  //     : this.staff_id,
  //   disabled: this.selectedLeaveRequest ? true : false,
  // },
  buildCreateRequestForm() {
    this.createRequestForm = this.fb.group({
      user_id: [
        this.selectedLeaveRequest ? this.selectedLeaveRequest.staff_id : "",
      ],
      leave_type: [
        this.selectedLeaveRequest ? this.selectedLeaveRequest.leave_type : "",
        [Validators.required],
      ],
      date_from: [
        this.dateLang == "E" ? (this.selectedLeaveRequest
          ? this.globalService.transformForDatepickerPreview(
            this.selectedLeaveRequest.date_from,
            this.datePickerConfig.dateInputFormat
          )
          : this.todaysDate) :
          this.adbsDateConverService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat),
        [Validators.required],
      ],
      date_to: [
        this.dateLang == "E" ? (this.selectedLeaveRequest
          ? // this.selectedLeaveRequest.date_to,
          this.globalService.transformForDatepickerPreview(
            this.selectedLeaveRequest.date_from,
            this.datePickerConfig.dateInputFormat
          )
          : this.todaysDate) :
          this.adbsDateConverService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat),
        [Validators.required],
      ],
      // [Validators.required],
      to_time: [
        this.selectedLeaveRequest
          ? this.selectedLeaveRequest.to_time
          : this.currentDate,

      ],
      // [Validators.required]
      from_time: [
        this.selectedLeaveRequest
          ? this.selectedLeaveRequest.from_time
          : this.currentDate,
        ,
      ],
      description: [
        this.selectedLeaveRequest ? this.selectedLeaveRequest.description : "",
      ],
      company_id: [
        this.selectedLeaveRequest ? this.selectedLeaveRequest.company_id : this.globalService.getCompanyIdFromStorage()],
      is_half_day: [
        this.selectedLeaveRequest ? this.selectedLeaveRequest.is_half_day : "",
      ],
    });
  }

  // custom validator to check whether the date is greater than current date..
  dateCheckValidator(control: AbstractControl) {
    console.log(control);
    // here getDate() is done to check current date with control
    // value because we cannot directly check date object because
    //  of time it will show different. so we have to catch date and check..

    let todaysDate = this.currentDate.getDate();
    if (this.dateLang == "N") {
      // convert nepali date object to date and check..
      let dateInString = this.dateConverterService.getNepalidateObjectToString(
        control.value
      );
      let dateStringInAd =
        this.dateConverterService.bsToAdInString(dateInString);
      let controlDateObject = new Date(dateStringInAd);
      let controlDate = new Date(dateStringInAd).getDate();

      if (controlDateObject < this.currentDate && controlDate !== todaysDate) {
        return { dateValidator: true };
      }
    } else {
      let controlDate = new Date(control.value).getDate();
      if (control.value < this.currentDate && controlDate !== todaysDate) {
        return { dateValidator: true };
      }
    }
  }

  getLeaveTypes(): void {
    const params = {
      limit: this.limit,
      page: this.globalService.pageNumber,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
    };

    this.createRequestService
      .getLeaveTypes(params)
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.listleaveType = response.data;
        } else {
          this.listleaveType = [];
        }
      });
  }

  getStaffList() {
    this.staffList = [];
    this.monthlyReportService
      .getStaffList()
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.staffList = response.data;
        } else {
          this.staffList = [];
        }
      });
  }

  getUserList() {
    this.staffList = [];
    this.createRequestService.getUserList().subscribe((response: CustomResponse) => {
      if (response.status) {
        this.staffList = response.data;
      } else {
        this.staffList = [];
      }
    })
  }

  addLeaveRequest() {
    // this.createRequestForm.value.date_from
    // this.createRequestForm.value.date_to
    let body = {
      user_id:
        this.role !== "staff"
          ? this.createRequestForm.value.user_id
          : this.localStorageService.getLocalStorageItem("user_id"),
      leave_type: this.createRequestForm.value.leave_type,
      date_from: "",
      date_to: "",
      to_time: this.createRequestForm.value.is_half_day == '1' ? this.createRequestForm.value.to_time : "",
      from_time: this.createRequestForm.value.is_half_day == '1' ? this.createRequestForm.value.from_time : "",
      description: this.createRequestForm.value.description,
      company_id: this.globalService.getCompanyIdFromStorage(),
      is_half_day: this.createRequestForm.value.is_half_day,
    };
    if (this.dateLang == "N") {
      console.log("this.createRequestForm.value.date_from", this.createRequestForm.value)
      console.log("sending", this.createRequestForm.value.date_from, this.createRequestForm.value.date_to)
      body.date_from = this.adbsDateConverService.transformDateForAPI(this.createRequestForm.value.date_from, this.datePickerConfig.dateInputFormat),
        body.date_to = this.adbsDateConverService.transformDateForAPI(
          this.createRequestForm.value.date_to, this.datePickerConfig.dateInputFormat
        )

    }
    else {
      body.date_from = this.createRequestForm.value.date_from,
        body.date_to =
        this.createRequestForm.value.date_to
    }
    // console.log("ToTime",body);
    // return;
    if (body.is_half_day) {
      // console.log("bodyasdisad",body.is_half_day,body.from_time > body.to_time);
      if (body.from_time > body.to_time) {
        this.toasterMessageService.showError(
          "From Time cannot be greater then To time."
        );
        return;
      }
    }
    // return;
    // || this.createRequestForm.pristine
    if (this.createRequestForm.invalid)
      return;
    this.createRequestService.addLeaveRequest(body).subscribe(
      (response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Leave Request is added successfully"
          );
          // this.router.navigate(["/leave-request/request-received"]);
          this.buildCreateRequestForm();
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  editLeaveRequest(body) {
    // || this.createRequestForm.pristine
    if (this.createRequestForm.invalid)
      return;

    // console.log("body", body);
    // return;
    let bodyObj = {
      company_id: body.company_id,
      date_from: this.adbsDateConverService.transformNepaliDatePickerPreview(body.date_from,this.datePickerConfig.dateInputFormat),
      date_to: this.adbsDateConverService.transformNepaliDatePickerPreview(body.date_to,this.datePickerConfig.dateInputFormat),
      description: body.description,
      from_time: body.from_time,
      id: body.id,
      is_half_day: body.is_half_day,
      leave_type: body.leave_type,
      to_time: body.to_time,
      user_id: body.user_id
    }
    this.createRequestService.editLeaveRequest(bodyObj).subscribe(
      (response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Leave Request is updated successfully"
          );
          this.createRequestForm.reset();
          this.router.navigate(["/leave-request/request-received"]);
        }
        else {
          if (response.data.date_from) {
            this.toastrMessageService.showError(response.data.date_from[0])
          }
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  // this.datePipe.transform(
  //   this.createRequestForm.value.from_time,
  //   "hh:mm:ss"
  // );

  convertDateFormater(date) {
    return `${date.year}/${date.month + 1}/${date.day}`;
  }
  onCreateRequestFormSubmit() {
    this.submitted = true;
    if (this.createRequestForm.invalid) return;

    if (!this.globalService.dateTimeLocalValidator(this.createRequestForm.value.date_to,
      this.createRequestForm.value.date_from)) {
      this.toastrMessageService.showError("Date from should  be smaller than Date to");
      return;
    }

    // To convert Bs to Ad
    if (this.dateLang === "E") {
      this.createRequestForm.value.date_from = this.datePipe.transform(
        this.createRequestForm.value.date_from,
        "yyyy-MM-dd"
      );
      this.createRequestForm.value.date_to = this.datePipe.transform(
        this.createRequestForm.value.date_to,
        "yyyy-MM-dd"
      );
      //  let formatedDate_from = this.dateConverterService.bsToAdInString(
      //      this.convertDateFormater(this.createRequestForm.get("date_from").value)
      //   );
      //   let formatedDate_to = this.dateConverterService.bsToAdInString(
      //     this.convertDateFormater(this.createRequestForm.get("date_to").value)
      //   );
      //   this.createRequestForm.value.date_from = formatedDate_from;
      //   this.createRequestForm.value.date_to = formatedDate_to;
    }
    // else {

    // }

    if (this.createRequestForm.value) {
      this.createRequestForm.value.is_half_day =
        this.createRequestForm.value.is_half_day == true ? "1" : "0";
    }

    if (this.selectedLeaveRequest) {
      this.createRequestForm.value["id"] = this.selectedLeaveRequest.id;
      this.createRequestForm.value["user_id"] =
        this.selectedLeaveRequest.staff_id;

      this.editLeaveRequest(this.createRequestForm.value);
    } else {
      this.addLeaveRequest();
    }
  }

  // date formator for nepali date-picker
  dateFormatter(date) {
    const formatedDate = `${date.year}-${parseInt(date.month) + 1}-${date.day}`;
    return formatedDate;
  }

  setDateTo(event) {
    this.createRequestForm.get("date_to").patchValue(event);
    this.onDateFromChange(event)
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
          minDate: new Date(),
          dateInputFormat:
            generalDateFormatSetting && generalDateFormatSetting.value == "0"
              ? "YYYY/MM/DD"
              : "MM/DD/YYYY",
        }
      );
      this.datePickerConfigForTo = Object.assign(
        {},
        {
          containerClass: "theme-dark-blue",
          showWeekNumbers: false,
          minDate: new Date(),
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
          minDate: new Date(),
          // dateInputFormat: "MM/DD/YYYY",
          dateInputFormat:
            this.dateFormatSetting &&
              this.dateFormatSetting.value == "yyyy/mm/dd"
              ? "YYYY/MM/DD"
              : "MM/DD/YYYY",
        }
      );
      this.datePickerConfigForTo = Object.assign(
        {},
        {
          containerClass: "theme-dark-blue",
          showWeekNumbers: false,
          minDate: new Date(),
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

  onResetForm() {
    this.selectedLeaveRequest = null;
    this.createRequestForm.reset();
    this.leaveRequestService.setSelectedLeaveRequests(null)

  }
  onDateFromChange(value) {
    // console.log('change is called',value)
    // console.log("value passed",new Date(value));
    this.datePickerConfigForTo.minDate = new Date(value);
  }
}
