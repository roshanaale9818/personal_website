import { ConfirmationDialogComponent } from "./../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { GlobalService } from "@app/shared/services/global/global.service";
import { RegexConst } from "./../../../../shared/constants/regex.constant";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { CorrectionAttendanceService } from "../services/correction-attendance.service";
import { CorrectionAttendance } from "../models/correction-attendance.model";
import {
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "../../../../shared/services/toastr-message/toastr-message.service";
import * as moment from "moment";
import { process, SortDescriptor, State } from "@progress/kendo-data-query";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";
import { MonthlyReportService } from "@app/modules/reports/monthly-report/services/monthly-report.service";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { TimeCardService } from "@app/modules/reports/time-card/services/time-card.service";
import { ClientService } from "@app/modules/manage-client/client/client.service";
import { CustomDateTimeLocalPickerSettings } from "@app/shared/components/custom-datetimelocal-picker/modal/datepickerSetting";
import { DatePipe } from '@angular/common';

@Component({
  selector: "app-correction-attendance",
  templateUrl: "./correction-attendance.component.html",
  styleUrls: ["./correction-attendance.component.scss"],
})
export class CorrectionAttendanceComponent implements OnInit {
  correctionAttendanceForm: FormGroup;
  testForm: FormGroup;
  regex = RegexConst;
  listLoading: boolean;
  correctionAttendanceLists: any;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  modalRef: BsModalRef;

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 1;
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
  // sortDescriptor declaration for kendo grid
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];

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
  dateFormatSetting;
  timeFormatSetting;

  constructor(
    private globalService: GlobalService,
    private localStorageService: LocalStorageService,
    private correctionAttendanceService: CorrectionAttendanceService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private toastrMessageService: ToastrMessageService,
    public authService: AuthService,
    private monthlyReportService: MonthlyReportService,
    private timeCardService: TimeCardService,
    private clientService: ClientService,
    private datePipe:DatePipe
  ) {
    this.dateFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
    this.timeFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_TIME_FORMAT");
    this.configUserDateAndTimeSetting();
  }

  ngOnInit() {
    // console.log("userData",this.authService.currentUserRoleValue)
    if (this.authService.currentUserRoleValue == "staff") {
      this.params.search.user_id = this.globalService.getCurrentUserId()
        ? this.globalService.getCurrentUserId()
        : "";
    }
    this.buildAttendanceDetailsForm();
    this.getClientListByRole(this.authService.currentUserRoleValue);
    // this.clientChange();
    // this.getClientBasicInformationList();
    // if (this.authService.currentUserRoleValue == "staff") {
    //   this.getClientFromStaff();
    // } else {
    //   this.getClientBasicInformationList();
    // }
    // this.getEmployeeList();

    this.getClientAttendanceList(this.params);
  }

  params = {
    limit: 10,
    page: this.page,
    sortnane: "checkin_datetime",
    // 2 is for desc
    sortno: 2,
    company_id: this.globalService.getCompanyIdFromStorage(),
    search: {
      user_id: "",
      checkin_datetime: "",
      checkout_datetime: "",
      correction_status: "",
      checked_by: "",
      checkin_message: "",
      correction_request: 1,
    },
  };

  date = new Date();
  buildCorrectionAttendanceForm(): void {
    // if (this.selectedAttendanceCorrection) {
    //   this.checkin_DateTime = this.selectedAttendanceCorrection.checkin_datetime;
    //   this.checkout_DateTime = this.selectedAttendanceCorrection.checkout_datetime;
    // }
    // console.log("datetime",this.datePipe.transform(this.selectedAttendanceCorrection.checkin_datetime,'HH:mm:ss'));
    this.correctionAttendanceForm = this.formBuilder.group({
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


  getClientListByRole(role){
    switch(role){
      case "Super Admin":
        this.getUserLists(this.companyId);
        this.getClientBasicInformationList();
      break;

      case "Admin":
        this.getUserLists(this.companyId);
        this.getClientBasicInformationList();
      break;

      default:
        this.getClientFromStaff();
      break;

    }
  }

  dataStateChangeAll(event): void {
    if (event.sort[0]) {
      this.sort = event.sort;
      // if (event.sort[0].dir === "asc") {
      //   this.params.sortno = 2;
      // } else {
      //   this.params.sortno = 1;
      // }
      // this.params.sortnane = event.sort[0].field;
    }

    // sorting logic ends here..

    if (event.skip == 0) {
      this.skip = event.skip;
      this.params.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;
      this.params.page = pageNo.toString();
    }

    this.getClientAttendanceList(this.params);
  }

  selectedAttendanceCorrection;
  setAttendanceCorrection(attendance) {
    this.selectedAttendanceCorrection = attendance;
    this.buildCorrectionAttendanceForm();
  }

  // listAllLeaves() {
  //   this.params.search.user_id = "";
  //   (this.params.search.correction_status = ""),
  //     this.updateClientAttendanceList(this.params);
  // }

  getClientAttendanceList(body): void {
    this.listLoading = true;
    this.correctionAttendanceService.getAttendanceList(body).subscribe(
      (response) => {
        if (response.status) {
          this.allAttendanceList = response.data;
          console.log("all attendance list", this.allAttendanceList);
          this.gridViewAll = { data: response.data, total: response.count };
        } else {
          this.gridViewAll = { data: [], total: 0 };
        }
      },
      (error) => {
        this.listLoading = false;
      },
      () => {
        this.listLoading = false;
      }
    );
  }

  openViewModal(template: TemplateRef<any>, attendanceList) {
    this.correctionAttendanceLists = attendanceList;
    console.log(this.correctionAttendanceLists);
    this.modalRef = this.modalService.show(template, this.config);
  }

  // as per backend A is approved P is pending and D is declined
  // searchBy(parameter) {
  //   if (parameter == "approved") {
  //     this.params.search.correction_status = "A";
  //   } else if (parameter == "pending") {
  //     this.params.search.correction_status = "P";
  //   } else {
  //     this.params.search.correction_status = "D";
  //   }

  //   this.getClientAttendanceList(this.params);
  // }

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
    console.log("update value", correctionAttendace);
    this.selectedAttendanceCorrection = correctionAttendace;
    console.log(this.selectedAttendanceCorrection);
    // this.timeCheckin = this.selectedAttendanceCorrection.checkin_datetime
    //   ? this.selectedAttendanceCorrection.checkin_datetime.replace(" ", "T")
    //   : null;
    // this.timeCheckout = this.selectedAttendanceCorrection.checkout_datetime
    //   ? this.selectedAttendanceCorrection.checkout_datetime.replace(" ", "T")
    //   : null;
    // this.newTimeCheckin = new Date(this.timeCheckin);
    // this.newTimeCheckout = new Date(this.timeCheckout);
    this.buildCorrectionAttendanceForm();
    this.modalRef = this.modalService.show(templateRef, this.config);
  }

  onSave(): void {
    console.log('dasd',this.correctionAttendanceForm.value.checkout_datetime,this.correctionAttendanceForm.value.checkin_datetime)
 if(!this.globalService.dateTimeLocalValidator(this.correctionAttendanceForm.value.checkout_datetime,this.correctionAttendanceForm.value.checkin_datetime)){
  this.toastrMessageService.showError("Checkout date cannot be smaller than check in date.");
  return;
}
if(!this.correctionAttendanceForm.value.checkout_datetime){
  this.toastrMessageService.showError("Checkout date cannot be null.");
  return;
}
    this.sendDateCheckin =
      this.globalService.transformFromDatepicker(
        this.correctionAttendanceForm.value.checkin_datetime
      ) +
      " " +
      this.globalService.transformFromTimePicker(
        this.correctionAttendanceForm.value.checkin_datetime
      );

    this.sendDateCheckout =
      this.globalService.transformFromDatepicker(
        this.correctionAttendanceForm.value.checkout_datetime
      ) +
      " " +
      this.globalService.transformFromTimePicker(
        this.correctionAttendanceForm.value.checkout_datetime
      );

    console.log(
      this.globalService.transformFromDatepicker(
        this.correctionAttendanceForm.value.checkin_datetime
      ),
      "date"
    );
    console.log(
      this.globalService.transformFromTimePicker(
        this.correctionAttendanceForm.value.checkin_datetime
      ),
      "time"
    );

    const params = {
      id: this.correctionAttendanceForm.value.id,
      checkin_datetime: this.sendDateCheckin,
      checkin_message: this.correctionAttendanceForm.value.checkin_message,
      checkout_datetime: this.sendDateCheckout,
      checkout_message: this.correctionAttendanceForm.value.checkout_message,
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

  openApprovalConfirmation(dataItem) {
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

  selectedData;
  setData(dataItem): void {
    this.selectedData = dataItem;
  }

  pointedStaff;
  activeIndex;
  viewStaffButtons(dataItem, rowIndex) {
    this.pointedStaff = dataItem;
    this.activeIndex = rowIndex;
  }
  heading: string = "all";
  selectedTab(heading) {
    this.heading = heading;
    if (heading == "all") {
      this.getClientAttendanceList(this.params);
    }
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
    if (!this.dateFormatSetting || !this.dateFormatSetting.value) {
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
    this.initSettings();
  }
  timeFormat;
  setTimeFormat() {
    if (this.timeFormatSetting) {
      this.timeFormat = this.timeFormatSetting.value;
    } else {
      this.timeFormat = "12";
    }
  }
  dateChanged(event) {}
  staffList: any[] = [];
  getStaffList() {
    this.monthlyReportService
      .getStaffList()
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.staffList = response.data;
        }
      });
  }
  getStaffId(value) {
    console.log("value", value);
    this.params.search.user_id = value;
    this.correctionAttendanceService.setSharedUserId(value);
    this.getClientAttendanceList(this.params);
  }

  attendanceDetailsForm: FormGroup;
  buildAttendanceDetailsForm(): void {
    this.attendanceDetailsForm = this.formBuilder.group({
      client_id: "",
      user_id: "",
      checkin_datetime: "",
      checkout_datetime: "",
    });
  }

  // on Client Change function
  clientChange(): void {
    this.attendanceDetailsForm.controls["user_id"].setValue("");
    this.staffList = [];
    // let staffId = this.globalService.getStaffId()?this.globalService.getStaffId():null;
    // if(!staffId){
    //     return;
    // }
    // staffId
    this.timeCardService
      .getUserByClientId(this.attendanceDetailsForm.get("client_id").value)
      .subscribe((response) => {
        if (response.status) {
          this.staffList = response.data;
        } else {
          this.staffList = [];
        }
      });
  }
  companyId = this.globalService.getCompanyIdFromStorage();
  employeeList;
  getEmployeeList(): void {
    let companyId = this.globalService.getCompanyIdFromStorage();
    this.correctionAttendanceService
      .getEmployeeList(companyId)
      .subscribe((response) => {
        if (response.status) {
          this.employeeList = response.data;
          console.log(this.employeeList);
        }
      });
  }
  clientList;
  search_key = "";
  search_value = "";
  showClient: boolean;
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
          this.showClient = true;
          this.clientList = response.data;
        } else {
          this.showClient = false;
          this.clientList = [];
        }
      });
  }
  getUserLists(companyId){
    this.correctionAttendanceService.getUserList(companyId).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.staffList = res.data;
      }
    })
  }

  getClientFromStaff() {
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    this.correctionAttendanceService
      .getClientFromStaff(userInfo.staff_id)
      .subscribe((response) => {
        if (response.status) {
          this.showClient = true;
          this.clientList = response.data;
          // for (let list of this.clientList) {
          //   this.clientId = list.client_id;
          //   this.attendanceMessageForm
          //     .get("clientId")
          //     .patchValue(this.clientId);
          // }
        } else {
          // this.showClient = false;
          this.showClient = true;
          // this.clientList = [];
          // this.attendanceMessageForm.get("clientId").patchValue("");
        }
      });
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
    this.correctionAttendanceForm.get('checkout_datetime').setValue(value);
    console.log("value is set", this.correctionAttendanceForm.get('checkout_datetime').value)
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
}
