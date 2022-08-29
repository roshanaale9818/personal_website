import { CustomResponse } from "@app/shared/models/custom-response.model";
import { MonthlyReportService } from "./../../monthly-report/services/monthly-report.service";
import { LocalStorageService } from "./../../../../shared/services/local-storage/local-storage.service";
import { AttendanceDetailService } from "./../services/attendance-detail.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  GridDataResult,
  RowArgs,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import { BsModalRef, BsModalService, BsDatepickerConfig } from "ngx-bootstrap";
import { SelectableSettings } from "@progress/kendo-angular-grid";
import { ToastrMessageService } from "../../../../shared/services/toastr-message/toastr-message.service";
import { process, State } from "@progress/kendo-data-query";
import { GlobalService } from "../../../../shared/services/global/global.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { TimeCardService } from "../../time-card/services/time-card.service";
import { ClientService } from "../../../manage-client/client/client.service";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";
@Component({
  selector: "app-attendance-detail",
  templateUrl: "./attendance-detail.component.html",
  styleUrls: ["./attendance-detail.component.scss"],
})
export class AttendanceDetailComponent implements OnInit {
  loading: boolean;
  modalRef: BsModalRef;
  staff_id = this.localStorageService.getLocalStorageItem("user_id");
  staffList = [];
  attendanceDetail: any;
  datePickerConfig: Partial<BsDatepickerConfig>;

  //Kendo Table
  public attendanceDetailList: any[] = [];
  public state: State = {
    skip: 0,
    take: 10,
    //initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
  };
  dateFormatSetting;
  timeFormatSetting;
  public gridData: GridDataResult;
  constructor(
    private attendanceDetailService: AttendanceDetailService,
    private localStorageService: LocalStorageService,
    private monthlyReportService: MonthlyReportService,
    private modalService: BsModalService,
    private toastrMessageService: ToastrMessageService,
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private timeCardService: TimeCardService,
    private clientService: ClientService,
    public authService:AuthService
  ) {
    this.dateFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
    this.timeFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_TIME_FORMAT");
    this.configUserDateAndTimeSetting();
    // this.datePickerConfig = Object.assign(
    //   {},
    //   {
    //     containerClass: "theme-dark-blue",
    //     showWeekNumbers: false,
    //     dateInputFormat: "MM/DD/YYYY",
    //   }
    // );
  }

  ngOnInit() {
    this.buildAttendanceDetailsForm();
    this.getAttendanceDetail(this.staff_id);
    this.clientChange();
    // this.getClientBasicInformationList();
    this.getClientByRole();
    this.getEmployeeList();
  }
  getAllUsersList(){
    this.timeCardService.getUserLists().subscribe((data:CustomResponse)=>{
      console.log(data);
      if(data.status){
        this.staffList = data.data;
      }
    })
  }
  getClientByRole(){
    if(this.authService.currentUserRoleValue =='Admin'
    ||this.authService.currentUserRoleValue =='Super Admin'
      ){
        this.getClientBasicInformationList();
        this.getAllUsersList();
      }
      else if(
        this.authService.currentUserRoleValue == 'Manager' ||
        this.authService.currentUserRoleValue == 'HR'
      ){
        this.getClientFromStaff();
      }
  }

  getClientFromStaff() {
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    this.attendanceDetailService
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
          this.showClient = true;
          this.clientList = [];
          // this.attendanceMessageForm.get("clientId").patchValue("");
        }
      });
  }

  onSelect(dataItem, event) {
    console.log(event);
    console.log(dataItem);
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

  showClient: boolean = false;
  // Get Client List
  clientList = [];
  limit = 20;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "";
  search_value = "";
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

  // on Client Change function
  clientChange(): void {
    this.attendanceDetailsForm.controls["user_id"].setValue("");
    this.staffList = [];
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

  employeeList;
  getEmployeeList(): void {
    this.attendanceDetailService
      .getEmployeeList(this.companyId)
      .subscribe((response) => {
        if (response.status) {
          this.employeeList = response.data;
          console.log(this.employeeList);
        }
      });
  }

  userId: number;
  getStaffId(value): void {
    console.log(value, "Haitt Value ree");
    this.userId = value;
    this.getAttendanceDetail(this.userId);
  }

  public mySelectionKey(context: RowArgs) {
    return "id" + ":" + context.dataItem.attendance_id;
  }

  // getAttendanceDetails(body) {
  //   this.attendanceDetailService
  //     .getAttendanceDetails(body)
  //     .subscribe((response) => {
  //       if (response.status) {
  //         console.log(response, "Hello");
  //       }
  //     });
  // }

  getAttendanceDetail(id) {
    this.loading = true;
    this.attendanceDetailService
      .getAttendanceDetail(id, this.attendanceDetailsForm.value.client_id)
      .subscribe(
        (response) => {
          if (response.data) {
            this.attendanceDetailList = response.data;
            this.gridData = process(this.attendanceDetailList, this.state);
          } else {
            this.gridData = process([], this.state);
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

  companyId = this.globalService.getCompanyIdFromStorage();
  attendanceParams = {
    limit: this.globalService.pagelimit,
    page: this.globalService.pageNumber,
    sortnane: "",
    sortno: 1,
    company_id: this.companyId,
    search: {
      user_id: 0,
      checkin_datetime: "",
      checkout_datetime: "",
      correction_status: "",
      checked_by: 0,
      checkin_message: "",
    },
  };

  onSearchAttendanceDetail(): void {
    this.attendanceParams.search.user_id =
      this.attendanceDetailsForm.value.user_id;
    this.attendanceParams.search.checkin_datetime =
      this.globalService.transformForDatepickerPreview(
        this.attendanceDetailsForm.value.checkin_datetime
      );
    this.attendanceParams.search.checkout_datetime =
      this.globalService.transformForDatepickerPreview(
        this.attendanceDetailsForm.value.checkout_datetime
      );
    this.getAttendanceDetail(this.attendanceParams);
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.attendanceDetailList, this.state);
  }

  getStaffList() {
    this.monthlyReportService
      .getStaffList()
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.staffList = response.data;
        }
      });
  }
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  openViewModal(template: TemplateRef<any>, attendanceDetail): void {
    this.attendanceDetail = attendanceDetail;
    this.modalRef = this.modalService.show(template, this.config);
  }

  onChange(value) {
    this.getAttendanceDetail(value);
  }

  deleteAttendanceDetail(dataItem) {
    const body = {
      id: dataItem.attendance_id,
    };
    this.attendanceDetailService
      .deleteAttendanceDetail(body)
      .subscribe((response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Attendance Detail is deleted successfully."
          );
          this.getAttendanceDetail(this.userId);
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
    this.setTimeFormat();
  }

  timeFormat;
  setTimeFormat() {
    if (this.timeFormatSetting) {
      this.timeFormat = this.timeFormatSetting.value;
    } else {
      this.timeFormat = "12";
    }
    console.log("time format", this.timeFormat);
  }
}
