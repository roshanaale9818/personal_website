import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  TemplateRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { GlobalService } from "@app/shared/services/global/global.service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import {
  DataStateChangeEvent,
  GridDataResult,
  SelectableSettings,
} from "@progress/kendo-angular-grid";
import { process, SortDescriptor, State } from "@progress/kendo-data-query";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { LeaveRequestService } from "../../service/leave-request.service";

@Component({
  selector: "app-pending-request",
  templateUrl: "./pending-request.component.html",
  styleUrls: ["./pending-request.component.scss"],
})
export class PendingRequestComponent implements OnInit {
  modalRef: BsModalRef;
  requestDetail;
  loading: boolean;
  pendingLoading: boolean;
  @Input() heading: string;
  staff_id = this.localStorageService.getLocalStorageItem("user_id");
  company_id = this.globalService.getCompanyIdFromStorage();

  // Api params
  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "staff_id";
  search_value = this.staff_id;

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

  public gridViewPending: GridDataResult = process(
    this.pendingLeaveRequest,
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
    // this.getAllRequestReceivedList();
  }

  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];

  dataStateChangePending(event: DataStateChangeEvent): void {
    // this.state = state;
    // this.gridViewPending = process(this.pendingLeaveRequest, this.state);
    if (event.skip == 0) {
      this.skip = event.skip;
      this.getBody.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;
      this.getBody.page = pageNo.toString();
    }
     this.getAllRequestReceivedList();
  }

  skip = 0;
  getBody = {
    company_id: this.company_id,
    limit: this.globalService.pagelimit,
    page: this.globalService.pageNumber,
    sortno: 2,
    sortnane: "date_to",
    search: {
      // staff_id: "",
      staff_id:this.authService.currentUserRoleValue == 'staff' ?this.globalService.getCurrentUserId() :"",
      date_to: "",
      date_from: "",
      description: "",
      leave_type: "",
      status: "0",
    },
  };

  //  get method
  getAllRequestReceivedList(): void {
    this.pendingLoading = true;
    // let getBody = {
    //   company_id: this.company_id,
    //   limit: this.globalService.pagelimit,
    //   page: this.globalService.pageNumber,
    //   sortno: 2,
    //   sortnane: "date_to",
    //   search: {
    //     // staff_id: "",
    //     staff_id:this.authService.currentUserRoleValue == 'staff' ?this.globalService.getCurrentUserId() :"",
    //     date_to: "",
    //     date_from: "",
    //     description: "",
    //     leave_type: "",
    //     status: "0",
    //   },
    // };

    if (this.authService.currentUserRoleValue !== 'staff'){
      if(this.leaveRequestService.getSearchStaffId){
        this.getBody.search.staff_id = this.leaveRequestService.getSearchStaffId;
      }
    }
    this.leaveRequestService
      .getLeaveRequests(this.getBody)
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.pendingLeaveRequest = [];
          this.allLeaveRequest = response.data;
          response.data.forEach((element) => {
            if (element.is_approved == "0") {
              this.pendingLeaveRequest.push(element);
              // this.gridViewPending = process(
              //   this.pendingLeaveRequest,
              //   this.state
              // );
            }
          });
          // this.gridViewPending = process(this.pendingLeaveRequest, this.state);
          // this.allLeaveRequest = response.data;
          this.gridViewPending = { data: response.data, total: response.count };
          this.pendingLoading = false;
        } else {
          this.gridViewPending = process([], this.state);
          this.pendingLoading = false;
        }
      });
  }

  // listAllLeaves() {
  //   this.getBody.search.staff_id = "";
  //   this.getBody.search.status = "";
  //   this.getRequestReceivedList(this.getBody);
  // }

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
          this.getAllRequestReceivedList();
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
    this.modalRef.content.action = "deny the leave request";
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
          this.getAllRequestReceivedList();
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
    this.modalRef.content.action = "approve the leave request";
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
          this.getAllRequestReceivedList();
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
    this.modalRef.content.action = "approve the attendance";
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
        this.toastrMessageService.showSuccess("approed oro o");
      }
    });
  }
  pointedStaff;
  activeIndex;
  viewStaffButtons(value, index: number) {
    console.log(value);
    this.pointedStaff = value.staffname;
    this.activeIndex = index;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes["heading"].currentValue == "pending") {
      this.getAllRequestReceivedList();
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
