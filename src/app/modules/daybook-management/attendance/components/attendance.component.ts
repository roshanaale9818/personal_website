import { DateConverterService } from "./../../../../shared/services/dateConverter/date-converter.service";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { LocalStorageService } from "./../../../../shared/services/local-storage/local-storage.service";
import { ToastrMessageService } from "./../../../../shared/services/toastr-message/toastr-message.service";
import { AttendanceService } from "./../services/attendance.service";
import { DatePipe } from "@angular/common";
import { GlobalService } from "./../../../../shared/services/global/global.service";
import {
  Component,
  OnInit,
  NgZone,
  Renderer2,
  ElementRef,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { IntlService } from "@progress/kendo-angular-intl";
import { UserPreferenceSettingService } from "@app/modules/setting/user-preference-setting/services/user-preference-setting.service";
import { CustomResponse } from "@app/shared/models/custom-response.model";
@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.scss"],
})
export class AttendanceComponent implements OnInit {
  todaysDateInEnglish = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  currentDate = new Date();
  dateSetting = this.globalService.getDateSettingFromStorage();
  currentNepaliDateObject = this.globalService.currentNepaliYearObject;
  currentNepaliDate =
    this.currentNepaliDateObject.ne.year +
    "  " +
    this.currentNepaliDateObject.ne.strMonth +
    "  " +
    this.currentNepaliDateObject.ne.day;
  @ViewChild("time", { static: false })
  public time: ElementRef;
  isCollapsed = false;
  collapseButton: string;
  staff_id = this.localStorageService.getLocalStorageItem("user_id");
  staffName = this.localStorageService.getLocalStorageItem("user_info");
  first_name;
  buttonStatus: any;
  attendanceMessageForm: FormGroup;
  companyId = this.globalService.getCompanyIdFromStorage();
  attendanceHistory = [];

  modalRef: BsModalRef;
  requestReviewForm: FormGroup;
  submitted: boolean;
  dateFormatSetting;
  timeFormatSetting;

  // ngZone and renderer2 is used for displaying current time.
  constructor(
    private globalService: GlobalService,
    private zone: NgZone,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private attendanceService: AttendanceService,
    private toasterMessageService: ToastrMessageService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private dateConverterService: DateConverterService,
    public intl: IntlService,
    private userPreferenceService: UserPreferenceSettingService
  ) {
    this.showTime();
    //get the setting by userpreference
    this.timeFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_TIME_FORMAT");
    this.dateFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
      this.companyId = this.globalService.getCompanyIdFromStorage();
  }
  timezoneDate = this.dateConverterService.getTimeFromTimeZone(
    this.dateSetting.GS_TIME_ZONE
  );
  ngOnInit() {
    this.getButtonStatus(this.staff_id);
    this.getForgetTocheckoutStatus(this.staff_id);
    this.buildForm();
    this.getAttendanceHistory(this.staff_id, this.todaysDateInEnglish);
    this.getClientFromStaff();
    if(this.companyId == 1 || this.companyId =='1'){
     this.getUserDetails();
    }

  }
  clientId: any;
  buildForm() {
    this.attendanceMessageForm = this.fb.group({
      message: [""],
      clientId: [this.clientId ? this.clientId : ""],
    });
  }

  clientList = [];
  getButtonStatusChange(event): void {
    this.getButtonStatus(this.staff_id);
  }
  

  showClient: boolean = false;
  getClientFromStaff() {
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    this.attendanceService
      .getClientFromStaff(userInfo.staff_id)
      .subscribe((response) => {
        if (response.status) {
          this.showClient = true;
          this.clientList = response.data;
          for (let list of this.clientList) {
            this.clientId = list.client_id;
            this.attendanceMessageForm
              .get("clientId")
              .patchValue(this.clientId);
          }
        } else {
          this.showClient = false;
          this.clientList = [];
          this.attendanceMessageForm.get("clientId").patchValue("");
        }
      });
  }

  getAttendanceHistory(id, date) {
    this.attendanceService
      .getAttendanceHistory(id, date)
      .subscribe((response) => {
        if (response.status) {
          // this.attendanceHistory = response;
          this.attendanceHistory = response.data;
        } else {
          this.attendanceHistory = [];
        }
      });
  }
  getButtonStatus(id) {
    this.attendanceService.getButtonStatus(id, this.clientId).subscribe(
      (response) => {
        if (response) {
          this.buttonStatus = response;
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  forgetToCheckout = {
    status: false,
    message: "",
    forgottenDate: "",
  };
  attendanceId:any;
  checkindatetime:any;
  forgottenObj:any;
  // forget to checkout status
  getForgetTocheckoutStatus(id) {
    this.forgetToCheckout.status = false;
    this.attendanceService
      .getForgetTocheckoutStatus(id)
      .subscribe((response:any) => {
        // console.log("FORGOT TOCHECKOUT RESPONSE",response)
        if (response.status) {
          // response.forEach((element) => {});
          this.forgetToCheckout.status = response.status;
          this.forgetToCheckout.message = response.model[0].reason;
          this.forgetToCheckout.forgottenDate = response.forgotton_date[0];
        }
        if(response.length){
          this.forgetToCheckout.status = response[0].status;
          // model[0]
          this.forgetToCheckout.message = response[0].reason;
          this.forgetToCheckout.forgottenDate = response[0].forgotton_date;
          this.attendanceId = response[0].model.attendance_id;
          this.checkindatetime =  response[0].model.checkin_datetime;
          // this.forgottenObj = response[0].model;
          // if(response[0].status == )
        }
      });
  }

  attendanceFormData = {
    id: this.staff_id,
    datetime: "",
    type: "",
    company_id: this.companyId,
    checkin_message: "",
  };

  forgotToLunchIn:any;

  addAttendance(attendanceFormData, successMessage) {
    this.attendanceService
      .addAttendance(attendanceFormData, this.clientId)
      .subscribe(
        (response) => {
          if (response.status) {
            this.toasterMessageService.showSuccess(
              "You have successfully set " + successMessage + " time"
            );
            this.getAttendanceHistory(this.staff_id, this.todaysDateInEnglish);
            this.getButtonStatus(this.staff_id);
          } else {
            this.toasterMessageService.showError(response.detail);
          }
        },
        (error) => {
          this.toasterMessageService.showError(error);
        }
      );
  }
  // request review for checkin
  requestReviewCheckIn(reqReviewFormData) {
    this.attendanceService.requestReviewCheckIn(reqReviewFormData).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Your Request Has Been Submitted "
          );
          this.getAttendanceHistory(this.staff_id, this.todaysDateInEnglish);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  // request review for chekout
  requestReviewCheckOut(reqReviewFormData) {
    this.attendanceService.requestReviewCheckOut(reqReviewFormData).subscribe(
      (response) => {
        if (response) {
          this.toasterMessageService.showSuccess(
            "Your Request Has Been Submitted "
          );
          this.getForgetTocheckoutStatus(this.staff_id);
          this.getButtonStatus(this.staff_id);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  onAttendanceClick(buttonType) {
    this.attendanceFormData.datetime = this.datePipe.transform(
      new Date(),
      "yyyy-MM-dd hh:mm:ss"
    );
    // checkin time according to timezone...
    // this.attendanceFormData.datetime = this.intl.formatDate(
    //   this.timezoneDate,
    //   "yyyy-MM-dd hh:mm:ss"
    // );
    this.attendanceFormData.type = buttonType;
    this.attendanceFormData.checkin_message =
      this.attendanceMessageForm.value.message;
    this.addAttendance(this.attendanceFormData, buttonType);
    this.attendanceMessageForm.reset();
  }

  checkoutReviewData = {
    // this.staff_id
    id: "",
    req_date: "",
    datetime: "",
    checkout_message: "",
    correction_request_message:""
  };
  checkinReviewData = {
    attendance_id: "",
    req_date: "",
    datetime: "",
    message: "",
  };
  buildRequestReviewForm() {
    this.requestReviewForm = this.fb.group({
      checkinTime: [this.currentDate],
      message: [""],
    });
  }
   dateValidator(c: FormControl) {
    // Not sure if c will come in as a date or if we have to convert is somehow
    const today = new Date();
    console.log(c.value)
    if(c.value > today) {
        return null;
    } else {
        return {dateValidator: {valid: false}};
    }
}
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  requestReviewStatus: any;
  modal: any;
  openModal(template: TemplateRef<any>, status, item): void {
    this.requestReviewStatus = status;
    if (item) {
      this.checkinReviewData.attendance_id = item.attendance_id;
    }


    this.modal = item;
    this.buildRequestReviewForm();
    this.modalRef = this.modalService.show(template, this.config);
    if(this.checkindatetime){
      // console.log("forgottenDate", this.checkindatetime.replace(" ","T"));
    this.requestReviewForm.patchValue({checkinTime: this.checkindatetime.replace(" ","T")});
    }
  }

  onSubmitRequestReview() {
    if (this.requestReviewForm.invalid) return;
    let reqTime = this.datePipe.transform(
      this.requestReviewForm.value.checkinTime,
      "HH:mm:ss"
    );
    if (this.modal == 1) {
      this.checkoutReviewData.id = this.attendanceId ? this.attendanceId:null;
      // this.checkoutReviewData.id = this.attendanceHistory.length > 0?this.attendanceHistory[0].attendance_id:null
      //req date aja ko date---.
      // this.checkoutReviewData.req_date = this.forgetToCheckout.forgottenDate;
      let todayDate = new Date();
      this.checkoutReviewData.req_date = this.datePipe.transform(todayDate,'yyyy-MM-dd HH:mm:ss');
      //datetimeforgton date
      this.checkoutReviewData.datetime =
        this.forgetToCheckout.forgottenDate + " " + reqTime;
      this.checkoutReviewData.checkout_message =
        this.requestReviewForm.value.message;
        this.checkoutReviewData.correction_request_message = this.requestReviewForm.value.message;
      this.requestReviewCheckOut(this.checkoutReviewData);
      this.modalRef.hide();
    }
    //  3 is for lunch in
    else if(this.modal == 3){
      this.checkoutReviewData.id = this.attendanceId ? this.attendanceId:null;
      let todayDate = new Date();
      this.checkoutReviewData.req_date = this.datePipe.transform(todayDate,'yyyy-MM-dd HH:mm:ss');
      //datetimeforgton date
      this.checkoutReviewData.datetime =
        this.forgetToCheckout.forgottenDate + " " + reqTime;
      this.checkoutReviewData.checkout_message =
        this.requestReviewForm.value.message;
        this.checkoutReviewData.correction_request_message = this.requestReviewForm.value.message;
      this.requestReviewCheckOut(this.checkoutReviewData);
      this.modalRef.hide();
    }
     else {
      // call correction request api
      let result = this.attendanceHistory.length? this.attendanceHistory[0].checkin_datetime.split(" "):null;
     if(result){
      // this.checkinReviewData.req_date = result[0];
      let todayDate = new Date();
      this.checkinReviewData.req_date = this.datePipe.transform(todayDate,'yyyy-MM-dd HH:mm:ss');
      this.checkinReviewData.datetime = result[0] + " " + reqTime;
      this.checkinReviewData.attendance_id = this.attendanceHistory.length>0 ?this.attendanceHistory[0].attendance_id:null;
     }
      this.checkinReviewData.message = this.requestReviewForm.value.message;
      this.requestReviewCheckIn(this.checkinReviewData);
      this.modalRef.hide();
    }
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

  collapsed(): void {
    this.collapseButton = "Show previous Attendance Detail";
  }
  expanded(): void {
    this.collapseButton = "Hide Previous Attendance Detail";
  }

  onCancel(): void {
    this.modalRef.hide();
  }

  onSave(): void {}

  getTimeAndDateSettings(): void {}

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
          }
        }
      });
  }

  settingFromCompanyWise: any;
  // configUserDateAndTimeSetting() {
  //   //if no userpreference
  //   this.settingFromCompanyWise = this.localStorageService.getLocalStorageItem(
  //     "setting_list"
  //   )
  //     ? this.localStorageService.getLocalStorageItem("setting_list")
  //     : null;
  //   if (!this.dateFormatSetting) {
  //     let generalDateFormatSetting = this.settingFromCompanyWise.filter(
  //       (x) => x.code == "GS_DT_FORMAT"
  //     )[0];
  //     this.datePickerConfig = Object.assign(
  //       {},
  //       {
  //         containerClass: "theme-dark-blue",
  //         showWeekNumbers: false,
  //         dateInputFormat:
  //           generalDateFormatSetting && generalDateFormatSetting.value == "0"
  //             ? "YYYY/MM/DD"
  //             : "MM/DD/YYYY",
  //       }
  //     );
  //   }
  //   //if user has userpreference
  //   else {
  //     this.datePickerConfig = Object.assign(
  //       {},
  //       {
  //         containerClass: "theme-dark-blue",
  //         showWeekNumbers: false,
  //         // dateInputFormat: "MM/DD/YYYY",
  //         dateInputFormat:
  //           this.dateFormatSetting &&
  //           this.dateFormatSetting.value == "yyyy/mm/dd"
  //             ? "YYYY/MM/DD"
  //             : "MM/DD/YYYY",
  //       }
  //     );
  //   }
  //   this.setTimeFormatSetting();
  // }

  timeFormat;

  setTimeFormatSetting(): void {
    if (this.timeFormatSetting) {
      this.timeFormat = this.timeFormatSetting.value;
    } else {
      this.timeFormat = "12";
    }
  }
  userDetail:any;
  getUserDetails(){
    this.attendanceService.getUserDetail().subscribe((res:any)=>{
      if(res.status){
        this.userDetail = res.user_credential;
      }
    })
  }
}
