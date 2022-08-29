import { ElementRef, NgZone, Renderer2, TemplateRef } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { GlobalService } from "@app/shared/services/global/global.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { DatePipe } from "@angular/common";
import { PinDashboardService } from "../../services/pindashboard.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { FormBuilder } from "@angular/forms";
import { DateConverterService } from "@app/shared/services/dateConverter/date-converter.service";
import { IntlService } from "@progress/kendo-angular-intl";
import { environment } from "@env/environment";
import { SettingService } from "@app/modules/setting/general-setting/services/setting.service";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { DEFAULT_INTERRUPTSOURCES, Idle } from "@ng-idle/core";
import { Keepalive } from "@ng-idle/keepalive";
import { HostListener } from "@angular/core";
import { LoginService } from "@app/modules/auth/login/services/login.service";
import { LayoutService } from "@app/core/layout/services/layout.service";
import { HelperService } from "@app/shared/services/helper/helper.service";

@Component({
  selector: "app-pindashboard",
  templateUrl: "./pindashboard.component.html",
  styleUrls: ["./pindashboard.component.scss"],
})
export class PindashboardComponent implements OnInit {
  userName;
  todaysDateInEnglish = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  currentDate = new Date();
  dateSetting = this.globalService.getDateSettingFromStorage()
    ? this.globalService.getDateSettingFromStorage()
    : null;
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
  forgetToCheckout = {
    status: true,
    message: "",
    forgottenDate: "",
  };
  modalRef: BsModalRef;
  requestReviewForm: FormGroup;
  submitted: boolean;
  defaultImagePath = environment.defaultImagePath;
  imageUrl = environment.baseImageUrl;

  timeoutId;
  userInactive: Subject<any> = new Subject();

  displayTimer$: Observable<number>;

  //For ng2 idel
  idleState = "Not started.";
  timedOut = false;
  lastPing?: Date = null;
  userActivity;
  // userInactive: Subject<any> = new Subject();

  // ngZone and renderer2 is used for displaying current time.
  constructor(
    private globalService: GlobalService,
    private zone: NgZone,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private pindashboardService: PinDashboardService,
    private toasterMessageService: ToastrMessageService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private dateConverterService: DateConverterService,
    public intl: IntlService,
    private generalSettingService: SettingService,
    private idle: Idle,
    private router: Router,
    private keepalive: Keepalive,
    private loginService: LoginService,
    private layoutService: LayoutService,
    private helperService: HelperService
  ) {
    this.companyId = this.globalService.getCompanyIdFromStorage();
    this.showTime();
    //   this.setTimeout();
    //   this.userInactive.subscribe((data) =>
    //  {
    //   console.log('user has been inactive for 3s')
    //   this.globalService.logout();
    //  }
    //   );
    //For ng2 idel

    // sets an idle timeout of 5 seconds, for testing purposes.
    // 2
    idle.setIdle(30);

    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => (this.idleState = "No longer idle."));
    idle.onTimeout.subscribe(() => {
      this.idleState = "Timed out!";
      this.timedOut = true;
      console.log("iddle time out");
      this.globalService.logout();
      // window.location.reload();
    });
    idle.onIdleStart.subscribe(() => (this.idleState = "You've gone idle!"));
    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = "You will time out in " + countdown + " seconds!";
      if (countdown == 0) {
        this.globalService.logout();
      }
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(5);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.reset();
  }

  reset() {
    this.idle.watch();
    this.idleState = "Started.";
    this.timedOut = false;
  }
  userInfo: any;
  isPinLogin: any;
  getUserInfo() {
    this.userInfo = this.loginService.getUserInfoFromStorage();
    this.getUserFullName();
    this.isPinLogin =
      this.localStorageService.getLocalStorageItem("isPinLogin");
  }
  // userName: string;
  getUserFullName() {
    if (this.userInfo) {
      this.userName = this.helperService.getFullName(this.userInfo);
    } else {
      this.userName = "Unknown";
    }
    this.layoutService.setUserFullName(this.userName);
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

    this.getCompanyLogo();
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
    this.pindashboardService
      .getClientFromStaff(userInfo.staff_id)
      .subscribe((response) => {
        if (response.status) {
          this.showClient = true;
          this.clientList = response.data;
          console.log(this.clientList);
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
    this.pindashboardService
      .getAttendanceHistory(id, date)
      .subscribe((response) => {
        if (response) {
          this.attendanceHistory = response;
          console.log(response);
        }
      });
  }
  getButtonStatus(id) {
    this.pindashboardService.getButtonStatus(id, this.clientId).subscribe(
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
  // forget to checkout status
  getForgetTocheckoutStatus(id) {
    this.pindashboardService
      .getForgetTocheckoutStatus(id)
      .subscribe((response) => {
        if (response) {
          this.forgetToCheckout.status = response.status;
          this.forgetToCheckout.message = response.reason;
          this.forgetToCheckout.forgottenDate = response.forgotton_date;
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

  addAttendance(attendanceFormData, successMessage) {
    this.pindashboardService
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
    this.pindashboardService.requestReviewCheckIn(reqReviewFormData).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Your Request Has Been Submitted "
          );
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  // request review for chekout
  requestReviewCheckOut(reqReviewFormData) {
    this.pindashboardService.requestReviewCheckOut(reqReviewFormData).subscribe(
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
    // if (buttonType == "checkout") {
    //   this.logout();
    // }
  }

  logout(): void {
    this.localStorageService.clearLocalStorage();
  }

  checkoutReviewData = {
    id: this.staff_id,
    req_date: "",
    datetime: "",
    checkout_message: "",
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

  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  requestReviewStatus: any;
  modal: any;
  openModal(template: TemplateRef<any>, status, modal, item): void {
    this.requestReviewStatus = status;
    if (item) {
      this.checkinReviewData.attendance_id = item.attendance_id;
    }

    this.modal = modal;
    this.buildRequestReviewForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmitRequestReview() {
    if (this.requestReviewForm.invalid) return;
    let reqTime = this.datePipe.transform(
      this.requestReviewForm.value.checkinTime,
      "HH:mm:ss"
    );
    if (this.modal == 1) {
      //  call chcekout review api
      this.checkoutReviewData.req_date = this.forgetToCheckout.forgottenDate;
      this.checkoutReviewData.datetime =
        this.forgetToCheckout.forgottenDate + " " + reqTime;
      this.checkoutReviewData.checkout_message =
        this.requestReviewForm.value.message;

      this.requestReviewCheckOut(this.checkoutReviewData);
      this.modalRef.hide();
    } else {
      // call correction request api
      let result = this.attendanceHistory[0].checkin_datetime.split(" ");
      this.checkinReviewData.req_date = result[0];
      this.checkinReviewData.datetime = result[0] + " " + reqTime;
      this.checkinReviewData.message = this.requestReviewForm.value.message;

      // console.log(this.checkinReviewData);
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

  detail;
  getCompanyLogo(): void {
    this.generalSettingService
      .getCompanyLogo(this.companyId)
      .subscribe((response) => {
        this.detail = response;
      });
  }
  openModalForLogout(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  closeModal(): void {
    this.modalRef.hide();
  }
  onLogout() {
    this.closeModal();
    this.globalService.logout();
  }
}
