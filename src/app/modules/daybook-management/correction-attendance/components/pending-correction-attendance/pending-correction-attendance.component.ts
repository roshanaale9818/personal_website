import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { GlobalService } from "@app/shared/services/global/global.service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { CorrectionAttendance } from "../../models/correction-attendance.model";
import { CorrectionAttendanceService } from "../../services/correction-attendance.service";
import { CustomDateTimeLocalPickerSettings } from '@app/shared/components/custom-datetimelocal-picker/modal/datepickerSetting';

@Component({
  selector: "app-pending-correction-attendance",
  templateUrl: "./pending-correction-attendance.component.html",
  styleUrls: ["./pending-correction-attendance.component.scss"],
})
export class PendingCorrectionAttendanceComponent implements OnInit {
  pendingAttendanceForm: FormGroup;
  testForm: FormGroup;
  regex = RegexConst;
  pendingLoading: boolean;
  correctionAttendanceLists: any;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  modalRef: BsModalRef;
@Input() isDashboard = false;
  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  sortKey = "";
  isCollapsed = true;
  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);

  correctionAttendanceList: CorrectionAttendance[] = [];
  skip = 0;
  gridView: GridDataResult;

  currentDate = new Date();
  public checkin_DateTime: Date = new Date();
  public checkout_DateTime: Date = new Date();

  allAttendanceList: any[] = [];
  pendingAttendanceList: any[] = [];
  approvedAttendanceList: any[] = [];
  declinedAttendanceList: any[] = [];
  public state: State = {
    skip: 0,
    take: 10,
    //initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
  };
  public gridViewAll: GridDataResult = process(
    this.allAttendanceList,
    this.state
  );
  public gridViewPending: GridDataResult = process(
    this.pendingAttendanceList,
    this.state
  );
  public gridViewApproved: GridDataResult = process(
    this.approvedAttendanceList,
    this.state
  );
  public gridViewDeclined: GridDataResult = process(
    this.declinedAttendanceList,
    this.state
  );

  user_id = this.localStorageService.getLocalStorageItem("user_id");
  time: any;
  newTime: Date;
  timeCheckin: any;
  newTimeCheckin: Date;
  timeCheckout: any;
  newTimeCheckout: Date;
  sendDateCheckin: string;
  sendDateCheckout: string;
  dateFormatSetting: any;
  timeFormatSetting: any;

  constructor(
    private globalService: GlobalService,
    private localStorageService: LocalStorageService,
    private correctionAttendanceService: CorrectionAttendanceService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private toastrMessageService: ToastrMessageService,
    public authService:AuthService
  ) {
    this.dateFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
    this.timeFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_TIME_FORMAT");
    this.configUserDateAndTimeSetting();
  }

  ngOnInit() {
    if(this.authService.currentUserRoleValue =="staff")
    {
      this.params.search.user_id = this.globalService.getCurrentUserId()?this.globalService.getCurrentUserId():'';
    }
    if(this.authService.currentUserRoleValue !== 'staff'){
      if(this.correctionAttendanceService.getCorrectionUserId() !== null){
        this.params.search.user_id = this.correctionAttendanceService.getCorrectionUserId();
      }
    }
    this.getClientAttendanceList(this.params);
    this.buildPendingCorrectionAttendanceForm;
  }

  date = new Date();
  buildPendingCorrectionAttendanceForm(): void {
    // if (this.selectedAttendanceCorrection) {
    //   this.checkin_DateTime = this.selectedAttendanceCorrection.checkin_datetime;
    //   this.checkout_DateTime = this.selectedAttendanceCorrection.checkout_datetime;
    // }
    this.pendingAttendanceForm = this.formBuilder.group({
      id: this.selectedAttendanceCorrection
        ? this.selectedAttendanceCorrection.attendance_id
        : "",
      checkin_datetime: [
        this.selectedAttendanceCorrection.checkin_datetime
          ? this.selectedAttendanceCorrection.checkin_datetime.replace(" ", "T")
          : null,
      ],
      checkout_datetime: [
        this.selectedAttendanceCorrection.checkout_datetime
          ? this.selectedAttendanceCorrection.checkout_datetime.replace(
              " ",
              "T"
            )
          : null,
      ],
      checkin_datetime_request: [
        this.selectedAttendanceCorrection.checkin_datetime_request
          ? this.selectedAttendanceCorrection.checkin_datetime_request.replace(
              " ",
              "T"
            )
          : null,
      ],
      checkout_datetime_request: [
        this.selectedAttendanceCorrection.checkout_datetime_request
          ? this.selectedAttendanceCorrection.checkout_datetime_request.replace(
              " ",
              "T"
            )
          : null,
      ],

      checkin_msg: [
        this.selectedAttendanceCorrection
          ? this.selectedAttendanceCorrection.checkin_msg
          : "",
      ],
      checkout_message: [
        this.selectedAttendanceCorrection
          ? this.selectedAttendanceCorrection.checkout_message
          : "",
      ],
    });
    if(this.selectedAttendanceCorrection && this.selectedAttendanceCorrection.checkin_datetime){
      this.customDateLocalSettingsForCheckOut.minDate = this.selectedAttendanceCorrection.checkin_datetime.replace(" ", "T")
    }
  }

  dataStateChangePending(event): void {
    this.state = event;
    this.gridViewAll = process(this.pendingAttendanceList, this.state);
    if (event.skip == 0) {
      this.skip = event.skip;
      this.params.page = 1;
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;
      this.params.page = pageNo;
    }
    this.getClientAttendanceList(this.params);
  }

  selectedAttendanceCorrection;
  // setAttendanceCorrection(attendance) {
  //   this.selectedAttendanceCorrection = attendance;
  //   console.log(attendance);
  //   this.buildCorrectionAttendanceForm();
  // }
  params = {
    limit: 15,
    page: 1,
    sortnane: "checkin_datetime",
    sortno: 2,
    company_id: this.globalService.getCompanyIdFromStorage(),
    search: {
      user_id: "",
      checkin_datetime: "",
      checkout_datetime: "",
      correction_status: "P",
      checked_by: "",
      checkin_message: "",
      correction_request: 1,
    },
  };

  getClientAttendanceList(body): void {
    this.pendingAttendanceList = [];
    this.pendingLoading = true;
    this.correctionAttendanceService.getAttendanceList(body).subscribe(
      (response) => {
        this.allAttendanceList = response.data;
        this.gridViewAll = process(this.allAttendanceList, this.state);
        //if it is dashboard we assign only 10 items
        // if(this.isDashboard == true){
        //   response.data = response.data.slice(0,5);

        //   }
        response.data.forEach((element) => {
          if (element.correction_status == "P") {
            this.pendingAttendanceList.push(element);
            this.gridViewPending = process(
              this.pendingAttendanceList,
              this.state
            );
          }
        });
      },
      (error) => {
        this.pendingLoading = false;
      },
      () => {
        this.pendingLoading = false;
      }
    );
  }

  openViewModal(template: TemplateRef<any>, attendanceList) {
    this.correctionAttendanceLists = attendanceList;
    console.log(this.correctionAttendanceLists);
    this.modalRef = this.modalService.show(template, this.config);
  }

  deleteCorrectionAttendance(correctionAttendance): void {
    const body = {
      id: correctionAttendance.attendance_id,
    };
    this.correctionAttendanceService
      .deleteAttendanceCorrection(body)
      .subscribe((response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Attendace Correction is deleted successfully"
          );
          this.getClientAttendanceList(this.params);
        }
      });
  }

  updateCorrectionAttendanceStatus(
    templateRef: TemplateRef<any>,
    correctionAttendace
  ): void {
    this.selectedAttendanceCorrection = correctionAttendace;
    console.log(this.selectedAttendanceCorrection);
    this.buildPendingCorrectionAttendanceForm();
    this.modalRef = this.modalService.show(templateRef, this.config);
  }

  onSave(): void {
    console.log('dasd',this.pendingAttendanceForm.value.checkout_datetime,this.pendingAttendanceForm.value.checkin_datetime)
 if(!this.globalService.dateTimeLocalValidator(this.pendingAttendanceForm.value.checkout_datetime,this.pendingAttendanceForm.value.checkin_datetime)){
  this.toastrMessageService.showError("Checkout date cannot be smaller than check in date.");
  return;
}
if(!this.pendingAttendanceForm.value.checkout_datetime){
  this.toastrMessageService.showError("Checkout date cannot be null.");
  return;
}
    this.sendDateCheckin =
      this.globalService.transformFromDatepicker(
        this.pendingAttendanceForm.value.checkin_datetime
      ) +
      " " +
      this.globalService.transformFromTimePicker(
        this.pendingAttendanceForm.value.checkin_datetime
      );

    this.sendDateCheckout =
      this.globalService.transformFromDatepicker(
        this.pendingAttendanceForm.value.checkout_datetime
      ) +
      " " +
      this.globalService.transformFromTimePicker(
        this.pendingAttendanceForm.value.checkout_datetime
      );

    const params = {
      id: this.pendingAttendanceForm.value.id,
      checkin_datetime: this.sendDateCheckin,
      checkin_message: this.pendingAttendanceForm.value.checkin_message,
      checkout_datetime: this.sendDateCheckout,
      checkout_message: this.pendingAttendanceForm.value.checkout_message,
      company_id: this.globalService.getCompanyIdFromStorage(),
    };
    this.correctionAttendanceService
      .updateAttendanceCorrection(params)
      .subscribe((response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Attendance Correction is updated successfully"
          );
          this.modalRef.hide();
          this.getClientAttendanceList(this.params);
        }
      });
  }

  selectedData;
  setData(dataItem): void {
    this.selectedData = dataItem;
  }

  pointedStaff;
  activeIndex;
  viewStaffButtons(dataItem, rowIndex): void {
    console.log(dataItem);
    this.pointedStaff = dataItem;
    this.activeIndex = rowIndex;
  }

  openApproveConfirmationDialogue(dataItem): void {
    let body = {
      status: "Approved",
      attendance_id: dataItem.attendance_id,
      company_id: this.globalService.getCompanyIdFromStorage(),
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.action = "approve the attendance";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.approveAttendanceList(body);
      }
    });
  }

  approveAttendanceList(body): void {
    this.correctionAttendanceService
      .approveAttendanceList(body)
      .subscribe((response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Attendance is approved successfully"
          );
          this.getClientAttendanceList(this.params);
        } else {
          this.toastrMessageService.showError("Attendance cannot be approved.");
        }
      });
  }

  openDeclineConfirmationDialogue(dataItem): void {
    let body = {
      status: "Declined",
      attendance_id: dataItem.attendance_id,
      company_id: this.globalService.getCompanyIdFromStorage(),
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.action = "decline the attendance";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.declineAttendanceList(body);
      }
    });
  }

  declineAttendanceList(body): void {
    this.correctionAttendanceService
      .approveAttendanceList(body)
      .subscribe((response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Attendance is declined successfully"
          );
          this.getClientAttendanceList(this.params);
        } else {
          this.toastrMessageService.showError("Attendance cannot be approved.");
        }
      });
  }
  settingFromCompanyWise: any;
  dateFormat;
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

      this.dateFormat =
        generalDateFormatSetting && generalDateFormatSetting.value == "0"
          ? "YYYY/MM/DD"
          : "MM/DD/YYYY";
    }
    //if user has userpreference
    else {
      this.dateFormat =
        this.dateFormatSetting && this.dateFormatSetting.value == "yyyy/mm/dd"
          ? "YYYY/MM/DD"
          : "MM/DD/YYYY";
    }
    this.setTimeFormat();
  }
  timeFormat;
  setTimeFormat() {
    if (this.timeFormatSetting) {
      this.timeFormat = this.timeFormatSetting.value;
    } else {
      this.timeFormat = "12";
    }
  }

    //setting for each datepicker formcontrol
    customDateLocalSettingsForCheckIn:CustomDateTimeLocalPickerSettings = {
      id:'checkin',
      minDate:new Date(),
      maxDate:new Date(),
      class:'',
      placeholder:'Check In Date Time',
      width:'100%'
    }
    onCheckInValue(event){
      this.customDateLocalSettingsForCheckOut.minDate = event;
    }
    customDateLocalSettingsForCheckOut:CustomDateTimeLocalPickerSettings = {
      id:'checkout',
      minDate:new Date(),
      maxDate:new Date(),
      class:'',
      placeholder:'Check out Date Time',
      width:'100%'
    }
    onCheckOutValue(value){
      this.pendingAttendanceForm.get('checkout_datetime').setValue(value);
      console.log("value is set", this.pendingAttendanceForm.get('checkout_datetime').value)
    }
}
