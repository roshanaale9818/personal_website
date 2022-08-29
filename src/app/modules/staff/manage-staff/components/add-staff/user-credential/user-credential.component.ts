import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { checkPassword } from "@app/shared/directives/validators/check-password";
import { GlobalService } from "@app/shared/services/global/global.service";
import { HelperService } from "@app/shared/services/helper/helper.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ManageUserService } from "../../../../manage-user/services/manage-user.service";

@Component({
  selector: "app-user-credential",
  templateUrl: "./user-credential.component.html",
  styleUrls: ["./user-credential.component.scss"],
})
export class UserCredentialComponent implements OnInit {
  userCredentialsForm: FormGroup;
  staffList: any;
  submitted: boolean;
  skip = 0;
  listLoading: boolean;
  editMode: boolean;
  modalTitle: any;
  selectedUser: any;
  archiveUserToggle: boolean;
  public checked: boolean = true;
  modalRef: BsModalRef;

  companyId = this.globalService.getCompanyIdFromStorage();

  constructor(
    private manageUserService: ManageUserService,
    private modalService: BsModalService,
    private toasterMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private helperService: HelperService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildUserCredentialsForm();
    this.getStaffList();
    this.buildPinChangeForm();
  }

  buildUserCredentialsForm() {
    this.userCredentialsForm = this.fb.group(
      {
        staff_id: [this.selectedUser ? this.selectedUser.staff_id : ""],
        username: [
          this.selectedUser ? this.selectedUser.username : "",
          Validators.required,
        ],
        password: ["", Validators.required],
        confirmPassword: [""],
        access_level: [0],
        role: [2],
        company_id: [this.companyId],
        user_id: [""],
        pin: this.returnRandomNmber,
      },
      { Validator: checkPassword }
    );
  }

  getStaffList() {
    this.manageUserService.getStaffList().subscribe((response) => {
      if (response.status) {
        this.staffList = response.data;
        console.log(this.staffList, "Staff ko List");
      } else {
        this.staffList = [];
      }
    });
  }

  showUserCredentials: boolean = false;
  showPinUser: boolean = false;
  activateUserCredentials(event): void {
    if (event.target.checked) {
      this.showUserCredentials = true;
    } else {
      this.showUserCredentials = false;
    }
  }

  activatePinUser(event): void {
    if (event.target.checked) {
      this.showPinUser = true;
    } else {
      this.showPinUser = false;
    }
  }

  limit = this.globalService.pagelimit;
  getBody = {
    company_id: this.companyId,
    limit: this.globalService.pagelimit,
    page: this.globalService.pageNumber,
    sortno: 1,
    sortnane: "",
    search: {
      staff_id: "",
      username: "",
      status: "",
    },
  };

  pageLimit = parseInt(this.getBody.limit);
  userList: GridDataResult;
  getUserList(body) {
    this.listLoading = true;
    this.manageUserService.getStaffList().subscribe(
      (response) => {
        if (response.status) {
          this.userList = { data: response.data, total: response.count };
        } else {
          this.userList = { data: [], total: 0 };
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.listLoading = false;
      }
    );
  }

  registerUser(body) {
    this.manageUserService.registerUser(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "User registered successfully"
          );

          this.modalRef.hide();
          this.getUserList(this.getBody);
        } else {
          this.toasterMessageService.showError(response.detail);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  openArchiveUserLists(): void {
    this.router.navigate(["/staff/manage-user/archive-list"]);
  }

  // state declaration for kendo grid
  public state: State = {
    skip: 0,
    take: 10,
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

  dataStateChange(event): void {
    if (event.sort[0]) {
      this.sort = event.sort;
      if (event.sort[0].dir === "asc") {
        this.getBody.sortno = 2;
      } else {
        this.getBody.sortno = 1;
      }
      if (event.sort[0].field != "") {
        this.getBody.sortnane = event.sort[0].field;
      }
    }

    // sorting logic ends here..

    if (event.skip == 0) {
      this.skip = event.skip;

      this.getBody.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;

      this.getBody.page = pageNo.toString();
    }

    // pagination logic ends here
    if (event.filter) {
      if (event.filter.filters[0]) {
        if (event.filter.filters[0].field == "staff_id") {
          this.getBody.search.staff_id = event.filter.filters[0].value;
        }
        if (event.filter.filters[0].field == "username") {
          this.getBody.search.username = event.filter.filters[0].value;
        }
      } else {
        this.getBody.search.staff_id = "";
        this.getBody.search.username = "";
      }

      this.getUserList(this.getBody);
    }
    // search logic ends here
  }

  // registerUser() {
  //   this.manageUserService.registerUser(body).subscribe(
  //     (response) => {
  //       if (response.status) {
  //         this.toasterMessageService.showSuccess(
  //           "User Registered Successfully"
  //         );

  //         this.modalRef.hide();
  //         this.getUserList(this.getBody);
  //       } else {
  //         this.toasterMessageService.showError(response.detail);
  //       }
  //     },
  //     (error) => {
  //       this.toasterMessageService.showError(error);
  //     }
  //   );
  // }

  editUser(body) {
    this.manageUserService.editUser(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "User Credentials edited successfully"
          );

          this.modalRef.hide();
          this.getUserList(this.getBody);
        } else {
          this.toasterMessageService.showError(response.data);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  deleteUser(body) {
    this.manageUserService.deleteUser(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("User deleted successfully");

          this.modalRef.hide();
          this.getUserList(this.getBody);
        } else {
          this.toasterMessageService.showError(response.data);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  // status change
  changeUserStatus(body) {
    this.manageUserService.changeStatus(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("Status Changed Successfully");

          this.getUserList(this.getBody);
        } else {
          this.toasterMessageService.showError(response.data);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: "modal-sm",
  };

  openAddUserCredentialModal(template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = false;
    this.modalTitle = "Add Credentials To Employee";
    this.selectedUser = null;
    this.buildUserCredentialsForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  selectedUserFullName: any;
  openEditModal(dataItem, template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = true;
    this.modalTitle = "Edit User Credentials";
    this.selectedUser = dataItem;
    // this.selectedUserFullName = this.getStaffFullNameWithEmpId(dataItem);
    this.buildUserCredentialsForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openPinCredentialModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  changeStatus(event, dataItem) {
    const body = {
      user_id: dataItem.user_id,
      status: event == true ? "Active" : "Inactive",
    };
    this.changeUserStatus(body);
  }

  // onCreate() {
  //   this.submitted = true;
  //   if (this.userCredentialsForm.invalid) return;
  //   if (this.editMode) {
  //     this.userCredentialsForm.patchValue({
  //       user_id: this.selectedUser.user_id,
  //     });

  //     const body = {
  //       pin: this.userCredentialsForm.value.pin,
  //       user_id: parseInt(this.userCredentialsForm.value.user_id),
  //       staff_id: parseInt(this.userCredentialsForm.value.staff_id),
  //       username: this.userCredentialsForm.value.username,
  //       password: this.userCredentialsForm.value.password,
  //       access_level: this.userCredentialsForm.value.access_level,
  //       company_id: this.companyId,
  //     };
  //     this.editUser(body);
  //   } else {
  //     this.registerUser(this.userCredentialsForm.value);
  //   }
  // }

  randomNumber: number;
  pinChangeForm: FormGroup;
  buildPinChangeForm() {
    this.pinChangeForm = this.fb.group({
      user_id: ["", Validators.required],
      pin: [this.randomNumber],
    });
  }

  onPinChange() {
    if (this.pinChangeForm.invalid) return;
    this.changePin(this.pinChangeForm.value);
  }

  changePin(body) {
    this.manageUserService.changePin(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("Pin Changed Successfully");

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

  onCreate() {
    this.submitted = true;
    if (this.userCredentialsForm.invalid) return;
    if (this.editMode) {
      this.userCredentialsForm.patchValue({
        user_id: this.selectedUser.user_id,
      });

      const body = {
        user_id: parseInt(this.userCredentialsForm.value.user_id),
        staff_id: parseInt(this.userCredentialsForm.value.staff_id),
        username: this.userCredentialsForm.value.username,
        password: this.userCredentialsForm.value.password,
        access_level: this.userCredentialsForm.value.access_level,
        company_id: this.companyId,
        pin: this.userCredentialsForm.value.pin,
      };
      this.editUser(body);
    } else {
      this.registerUser(this.userCredentialsForm.value);
    }
  }

  getStaffFullNameWithEmpId(staff) {
    return this.helperService.getStaffFullName(staff);
  }

  navigateToAddDeviceId(dataItem) {
    this.router.navigate(["/staff/manage-user/device-id/", dataItem.user_id]);
    this.manageUserService.setUserDetail(dataItem);
  }

  navigateToRoleAssign(dataItem) {
    this.router.navigate(["/staff/manage-user/assign-role/", dataItem.user_id]);
    this.manageUserService.setUserDetail(dataItem);
  }

  returnRandomNmber() {
    // this.randomNumber = Math.floor(1000 + Math.random() * 9000);  -- this. is for 4 no. pin
    // the given below code is for 6 digit pin
    this.randomNumber = Math.floor(Math.random() * 899999 + 100000);
  }
}
