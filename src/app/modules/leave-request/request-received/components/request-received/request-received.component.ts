import { Router } from "@angular/router";
import { DepartmentService } from "../../../../utilities/department/services/department.service";
import { CustomResponse } from "./../../../../../shared/models/custom-response.model";
import { LocalStorageService } from "./../../../../../shared/services/local-storage/local-storage.service";
import { ToastrMessageService } from "./../../../../../shared/services/toastr-message/toastr-message.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { GlobalService } from "@app/shared/services/global/global.service";
import { LeaveRequestService } from "../../service/leave-request.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import {
  DataStateChangeEvent,
  GridDataResult,
  SelectableSettings,
} from "@progress/kendo-angular-grid";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { process, SortDescriptor, State } from "@progress/kendo-data-query";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ManageStaffService } from "@app/modules/staff/manage-staff/services/manage-staff.service";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";
@Component({
  selector: "app-request-received",
  templateUrl: "./request-received.component.html",
  styleUrls: ["./request-received.component.scss"],
})
export class RequestReceivedComponent implements OnInit {
  modalRef: BsModalRef;
  requestDetail;
  loading: boolean;
  listLoading: boolean;

  staff_id = this.localStorageService.getLocalStorageItem("user_id");
  company_id = this.globalService.getCompanyIdFromStorage();

  // Api params
  limit = "10";
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "staff_id";
  search_value = this.staff_id;
  skip = 0;

  allLeaveRequest: any[] = [];
  pendingLeaveRequest: any[] = [];
  approvedLeaveRequest: any[] = [];
  declinedLeaveRequest: any[] = [];
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
    this.allLeaveRequest,
    this.state
  );

  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  dateFormatSetting: any;
  timeFormatSetting: any;
  constructor(
    private globalService: GlobalService,
    private leaveRequestService: LeaveRequestService,
    private modelService: BsModalService,
    private toastrMessageService: ToastrMessageService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private manageStaffService: ManageStaffService,
    public authService:AuthService
  ) {
    this.dateFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
    this.timeFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_TIME_FORMAT");
    this.configUserDateAndTimeSetting();
  }

  public selectableSettings: SelectableSettings;

  ngOnInit() {
    this.getAllRequestReceivedList(this.getBody);
    // this.getStaffList();
    this.callMethodByRole();
    this.buildSearchEmployeeForm();
  }

  callMethodByRole(){
    if(this.authService.currentUserRoleValue == 'Admin'
    || this.authService.currentUserRoleValue == 'Super Admin'){
      // this.getStaffList();
      this.getUserList();
    }
    else if(
      this.authService.currentUserRoleValue == 'HR'
      ||  this.authService.currentUserRoleValue == 'Manager'
    ){
      // this.getAssignedStaff();
      // this.getStaffList();
      this.getUserList();
    }
  }


getAssignedStaff(){
  this.leaveRequestService.getClientStaff(this.staff_id).subscribe((response: CustomResponse) => {
    if (response.status) {
      console.log("ths is",response);
      this.staffList = response.data;
    } else {
      this.staffList = [];
      this.toastrMessageService.showError(response.data);
    }
  },
  (error) => {
    this.listLoading = false;
  },
  () => {
    this.listLoading = false;
  })
}

  getBody = {
    company_id: this.company_id,
    limit: 10,
    page: this.globalService.pageNumber,
    sortno: 2,
    sortnane: "date_to",
    search: {
      staff_id: this.authService.currentUserRoleValue == 'staff' ?this.globalService.getCurrentUserId() :"",
      date_to: "",
      date_from: "",
      description: "",
      leave_type: "",
      status: "",
    },
  };

  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);

  dataStateChangeAll(event): void {
    // if (event.sort[0]) {
    //   this.sort = event.sort;
    //   if (event.sort[0].dir === "asc") {
    //     this.getBody.sortno = 2;
    //   } else {
    //     this.getBody.sortno = 1;
    //   }
    //   this.getBody.sortnane = event.sort[0].field;
    // }

    // sorting logic ends here..

    if (event.skip == 0) {
      this.skip = event.skip;
      this.getBody.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;
      this.getBody.page = pageNo.toString();
    }
    this.getAllRequestReceivedList(this.getBody);
  }

  //  get method
  getAllRequestReceivedList(body): void {
    this.listLoading = true;

    this.leaveRequestService.getLeaveRequests(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.allLeaveRequest = response.data;
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

  // listAllLeaves() {
  //   this.getBody.search.staff_id = "";
  //   this.getBody.search.status = "";
  //   this.getRequestReceivedList(this.getBody);
  // }

  searchEmployeeForm: FormGroup;
  buildSearchEmployeeForm(): void {
    this.searchEmployeeForm = this.formBuilder.group({
      staff_id: "",
    });
  }

  staffList: any[] = [];
  getStaffList() {
    this.manageStaffService.getStaffLists().subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.staffList = response.data;
        } else {
          this.staffList = [];
          this.toastrMessageService.showError(response.data);
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

  getUserList(){
    this.leaveRequestService.getUserList().subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.staffList = response.data;
        } else {
          this.staffList = [];
          this.toastrMessageService.showError(response.data);
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

  onSearchEmployees(): void {
    this.getBody.page = "1";
    this.getBody.search.staff_id = this.searchEmployeeForm.value.staff_id;
    this.leaveRequestService.setSearchStaffId(this.searchEmployeeForm.value.staff_id)
    this.getAllRequestReceivedList(this.getBody);
  }

  onCancel(): void {
    this.getBody.search.staff_id = "";
    this.isCollapsed = true;
    this.leaveRequestService.setSearchStaffId(null);

    this.getAllRequestReceivedList(this.getBody);
    this.buildSearchEmployeeForm();
  }

  isCollapsed: boolean = true;
  collapseButton: any;
  collapsed(): void {
    this.buildSearchEmployeeForm();
    this.collapseButton = "Search Employee";
  }
  expanded(): void {
    this.collapseButton = "Hide Search Bar";
  }

  public mySelection: number[] = [];

  public selectedCallback = (args) => args.dataItem.id;

  // as per backend 1 is approved 0 is pending and 2 is declined
  // searchBy(parameter) {
  //   if (parameter == "approved") {
  //     this.getBody.search.status = "1";
  //   } else if (parameter == "pending") {
  //     this.getBody.search.status = "0";
  //   } else {
  //     this.getBody.search.status = "2";
  //   }

  //   this.getRequestReceivedList(this.getBody);
  // }

  // Modal

  viewRequestModal(data, template: TemplateRef<any>) {
    this.requestDetail = data;
    this.modalRef = this.modelService.show(template, this.config);
  }

  NavigatetoEdit(dataItem) {
    this.leaveRequestService.setSelectedLeaveRequests(dataItem);
    this.router.navigate(["/leave-request/create"]);
  }

  openConfirmationDialogue(leaveRequest) {
    const leveRequestId = {
      id: leaveRequest.id,
    };

    this.modalRef = this.modelService.show(
      ConfirmationDialogComponent,
      this.config
    );
    // this.modalRef.content.data = company.company_name;
    this.modalRef.content.action = "delete this leave request";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteLeaveRequestById(JSON.stringify(leveRequestId));
      }
    });
  }

  deleteLeaveRequestById(id) {
    this.leaveRequestService.deleteLeaveRequest(id).subscribe(
      (response: any) => {
        if (response.status == true) {
          this.toastrMessageService.showSuccess(
            "Leave Request is deleted succesfully"
          );
          this.getAllRequestReceivedList(this.getBody);
        } else {
          this.toastrMessageService.showError(response.data);
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  openDeclineConfirmationDialogue(dataItem): void {
    const denyLeaveRequest = {
      id: dataItem.id,
      status: 2,
      comment: "hello",
    };
    this.modalRef = this.modelService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.action = "deny the Leave Request";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.denyLeaveRequest(denyLeaveRequest);
      }
    });
  }

  denyLeaveRequest(denyLeave): void {
    this.leaveRequestService
      .updateLeaveStatus(denyLeave)
      .subscribe((response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Leave Request is denied successfully."
          );
          this.getAllRequestReceivedList(this.getBody);
        } else {
          this.toastrMessageService.showError(
            "Leave Request cannot be denied."
          );
        }
      });
  }

  openApprovalConfirmation(dataItem): void {
    const approveLeaveRequest = {
      id: dataItem.id,
      status: 1,
      comment: "hello",
    };
    this.modalRef = this.modelService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.action = "approve the Leave Request";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.approveLeaveRequest(approveLeaveRequest);
      }
    });
  }

  approveLeaveRequest(approveLeaveRequest): void {
    this.leaveRequestService
      .updateLeaveStatus(approveLeaveRequest)
      .subscribe((response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Leave Request is approved successfully."
          );
          this.getAllRequestReceivedList(this.getBody);
        } else {
          this.toastrMessageService.showError(
            "Leave Request cannot be approved."
          );
        }
      });
  }

  openConfirmation(dataItem): void {
    this.modalRef = this.modelService.show(
      ConfirmationDialogComponent,
      this.config
    );
    // this.modalRef.content.data = company.company_name;
    this.modalRef.content.action = "approve the Leave Request";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        // this.deleteLeaveRequestById(JSON.stringify(leveRequestId));
      }
    });
  }

  selectedData;
  setData(dataItem): void {
    this.selectedData = dataItem;
  }

  updateStatus(dataItem, status) {
    let body = {
      status: 2,
      id: dataItem.id,
    };
    this.leaveRequestService.updateLeaveStatus(body).subscribe((response) => {
      if (response.status) {
        this.toastrMessageService.showSuccess(
          "Leave request is approved successfully."
        );
      } else {
        this.toastrMessageService.showError(
          "Leave request cannot be approved."
        );
      }
    });
  }
  pointedStaff;
  activeIndex;
  viewStaffButtons(value, index: number) {
    this.pointedStaff = value.staffname;
    this.activeIndex = index;
  }
  heading: string = "all";
  selectedTab(heading) {
    this.heading = heading;
    if (heading == "all") {
      this.getAllRequestReceivedList(this.getBody);
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
