import { Component, ElementRef, OnInit, TemplateRef, ViewChildren } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { checkPassword } from "@app/shared/directives/validators/check-password";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { GlobalService } from "@app/shared/services/global/global.service";
import { HelperService } from "@app/shared/services/helper/helper.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import { BsModalRef, BsModalService, PopoverDirective } from "ngx-bootstrap";
import { ManageUserService } from "../../../services/manage-user.service";

@Component({
  selector: "app-active-user",
  templateUrl: "./active-user.component.html",
  styleUrls: ["./active-user.component.scss"],
})
export class ActiveUserComponent implements OnInit {
  staffList: any;
  modalRef: BsModalRef;
  userCredentialsForm: FormGroup;
  activeSearchForm: FormGroup;

  limit = this.globalService.pagelimit;
  userList: GridDataResult;

  submitted: boolean;
  skip = 0;
  listLoading: boolean;
  editMode: boolean;
  modalTitle: any;
  selectedUser: any;
  archiveUserToggle: boolean;
  public checked: boolean = true;
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

  constructor(
    private manageUserService: ManageUserService,
    private modalService: BsModalService,
    private toasterMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private helperService: HelperService,
    private router: Router
  ) {
    // this.getStaffList();
    this.returnRandomNmber();
  }
  companyId = this.globalService.getCompanyIdFromStorage();
  randomNumber: number;

  ngOnInit() {
    this.buildActiveUserForm();
    this.getUserList(this.getBody);
    this.buildPinChangeForm();
    this.buildActiveSearchForm();
    this.getUserLists();
    this.buildWorkFromHomeForm();
    this.getStaffListForWFH();
  }

  buildActiveUserForm() {
    this.userCredentialsForm = this.fb.group(
      {
        staff_id: [
          this.selectedUser ? this.selectedUser.staff_id : "",
          Validators.required,
        ],
        username: [
          this.selectedUser ? this.selectedUser.username : "",
          Validators.required,
        ],
        password: ["", Validators.required],
        verify_password: ["", Validators.required],
        access_level: [0],
        role: [2],
        company_id: [this.companyId],
        user_id: [""],
      },
      { Validator: checkPassword }
    );
  }

  collapseButton: any;
  isCollapsed: boolean = true;
  collapsed(): void {
    this.collapseButton = "Search Employee";
  }

  expanded(): void {
    this.collapseButton = "Hide Search Bar";
  }

  buildActiveSearchForm() {
    this.activeSearchForm = this.fb.group({
      staff_id: "",
      username: "",
    });
  }

  getBody = {
    company_id: this.companyId,
    limit: this.globalService.pagelimit,
    page: this.globalService.pageNumber,
    sortno: 1,
    sortnane: "username",
    search: {
      staff_id: "",
      username: "",
      status: "Active",
    },
  };

  onSearchStaff(): void {
    this.getBody.search.staff_id = this.activeSearchForm.value.staff_id;
    this.getBody.search.username = this.activeSearchForm.value.username;
    this.getUserList(this.getBody);
  }

  onCancel(): void {
    const getBody = {
      company_id: this.companyId,
      limit: this.globalService.pagelimit,
      page: this.globalService.pageNumber,
      sortno: 1,
      sortnane: "username",
      search: {
        staff_id: "",
        username: "",
        status: "Active",
      },
    };
    this.state.skip = 0;
    this.skip = 0;
    this.isCollapsed = true;
    this.buildActiveSearchForm();
    this.getUserList(getBody);
  }
  isOpen: false;

  staffLists;
  getStaffList() {
    this.manageUserService.getStaffList().subscribe((response) => {
      if (response.status) {
        this.staffList = response.data;
      } else {
        this.staffList = [];
      }
    });
  }
  navigateToStaffDetail(staffDetail) {
    // console.log("onviewclicked",staffDetail);
    // this.manageStaffService.setUserIdForPinChange(staffDetail);
    this.router.navigate(["/staff/manage-staff/edit/", staffDetail.staff_id]);
  }
  context: any;
  userLists;
  getUserLists(): void {
    this.manageUserService.getUserLists().subscribe((response) => {
      this.userLists = response.data;
      this.staffList = response.data;
    });
  }


  selectedData;
  setData(data): void {
    this.selectedData = data;
  }

  getUserList(body) {
    this.listLoading = true;
    this.manageUserService.getUserList(body).subscribe(
      (response) => {
        if (response.status) {
          this.staffLists = response.data;

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
  changeEmp() {
    if (this.activeSearchForm.value.staff_id == null) {
      this.activeSearchForm.controls["staff_id"].setValue("");
    }
    if (this.activeSearchForm.value.username == null) {
      this.activeSearchForm.controls["username"].setValue("");
    }
  }

  onUserChange(event, dataItem) {
    const getActiveBody = {
      company_id: this.companyId,
      limit: this.globalService.pagelimit,
      page: this.globalService.pageNumber,
      sortno: 1,
      sortnane: "",
      search: {
        staff_id: event.staff_id,
        username: "",
        status: "Active",
      },
    };
    this.getUserList(getActiveBody);
  }

  openArchiveUserLists(): void {
    this.router.navigate(["/staff/manage-user/archive-list"]);
  }

  dataStateChange(event): void {
    // if (event.sort[0]) {
    //   this.sort = event.sort;
    //   if (event.sort[0].dir === "asc") {
    //     this.getBody.sortno = 2;
    //   } else {
    //     this.getBody.sortno = 1;
    //   }
    //   if (event.sort[0].field != "") {
    //     this.getBody.sortnane = event.sort[0].field;
    //   }
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

  registerUser(body) {
    if (
      this.userCredentialsForm.value.password !==
      this.userCredentialsForm.value.confirmPassword
    ) {
      this.toasterMessageService.showError(
        "Password and Confirm Password doesnot match."
      );
      return;
    } else {
      this.manageUserService.registerUser(body).subscribe(
        (response) => {
          if (response.status) {
            this.toasterMessageService.showSuccess(
              "User Registered Successfully"
            );

            this.modalRef.hide();
            this.getUserList(this.getBody);
          }
        },
        (error) => {
          this.toasterMessageService.showError(error);
        }
      );
    }
  }

  editUser(body) {
    this.manageUserService.editUser(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "User Credentials updated successfully"
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

  deleteUser(body) {
    this.manageUserService.deleteUser(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("User Deleted Successfully");

          this.modalRef.hide();
          const getBody = {
            company_id: this.companyId,
            limit: this.globalService.pagelimit,
            page: this.globalService.pageNumber,
            sortno: 1,
            sortnane: "username",
            search: {
              staff_id: "",
              username: "",
              status: "Active",
            },
          };
          this.getUserList(getBody);
          this.getUserLists();
          this.buildActiveSearchForm();
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
          this.toasterMessageService.showSuccess(
            "Status is changed successfully."
          );

          this.getUserList(this.getBody);
        } else {
          this.toasterMessageService.showError("Status cannot be changed.");
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
  };

  openAddModal(template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = false;
    this.modalTitle = "Add Credentials To Staff";
    this.selectedUser = null;
    this.buildActiveUserForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  selectedUserFullName: any;
  openEditModal(dataItem, template: TemplateRef<any>): void {
    try {
      this.submitted = false;
      this.editMode = true;
      this.modalTitle = "Edit User Credentials";
      this.selectedUser = dataItem;
      this.buildActiveUserForm();
      this.modalRef = this.modalService.show(template, this.config);
      //disbale the username property for removing warning
      this.userCredentialsForm.get('username').disable();
      //for outside click of popover component we write this code
      const e = document.createElement('div');
      document.body.appendChild(e);
      e.click();
      e.remove();
    }
    catch (ex) {
      console.log(ex);
      throw Error(ex);
    }


  }

  openAssignPinModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  openConfirmationDialogue(user) {
    this.setConfirmationDialogMethods(user)
    const userId = {
      user_id: user.user_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = user.first_name;
    this.modalRef.content.action = "delete";
    //for outside click of popover component we write this code
    const e = document.createElement('div');
    document.body.appendChild(e);
    e.click();
    e.remove();
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteUser(JSON.stringify(userId));
      }
    });
  }

  // openConfirmationDialogues(user): void {
  //   const selectedUserId = {
  //     user_id: user.user_id,
  //   };

  //   this.modalRef = this.modalService.show(
  //     ConfirmationDialogComponent,
  //     this.config
  //   );
  //   this.modalRef.content.data = user.first_name;
  //   this.modalRef.content.action = "archive";
  //   this.modalRef.content.onClose.subscribe((confirm) => {
  //     if (confirm) {
  //       this.archiveUser(JSON.stringify(selectedUserId));
  //     }
  //   });
  // }

  archiveUser(user): void { }

  changeStatus(event, dataItem) {
    const body = {
      user_id: dataItem.user_id,
      status: event == true ? "Active" : "Inactive",
    };
    this.changeUserStatus(body);
  }
  changeWFH(event, dataItem){
    console.log("event and dataItem",event,dataItem)
    const body = {
      staff_id: dataItem.staff_id,
      username:dataItem.username,
      access_token:this.globalService.accessToken,
      // access_level: 0,
      user_id:dataItem.user_id,
      wfh: event==true ?1:0,
      company_id: this.globalService.getCompanyIdFromStorage()
    }
    this.manageUserService.addToWorkFromHome(body).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.toasterMessageService.showSuccess("Work from home edited succesfully");
        this.refresh();
      }
      else{
        this.toasterMessageService.showError("Cannot edit Work  home")
      }
    })

  }
  refresh(){
    const getBody = {
      company_id: this.companyId,
      limit: this.globalService.pagelimit,
      page: this.globalService.pageNumber,
      sortno: 1,
      sortnane: "username",
      search: {
        staff_id: "",
        username: "",
        status: "Active",
      },
    };
    this.getUserList(getBody);
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
        verify_password: this.userCredentialsForm.value.verify_password,
        access_level: this.userCredentialsForm.value.access_level,
        company_id: this.companyId,
      };
      this.editUser(body);
    } else {
      this.registerUser(this.userCredentialsForm.value);
    }
  }

  pageLimit = parseInt(this.getBody.limit);

  pinChangeForm: FormGroup;
  buildPinChangeForm() {
    this.pinChangeForm = this.fb.group({
      user_id: ["", Validators.required],
      pin: [this.randomNumber],
    });
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

  workFromHomeForm:FormGroup;
  buildWorkFromHomeForm() {
    this.workFromHomeForm = this.fb.group({
      user_id: ["", Validators.required],
      type:["add",Validators.required]
    });
  }

  openWFHModal(template: TemplateRef<any>): void {
    this.buildWorkFromHomeForm();
    this.modalRef = this.modalService.show(template, this.config);
  }
  changeWFHBulk(){
    if(this.workFromHomeForm.invalid){return}

   console.log("asdasd", this.workFromHomeForm.value)
   let body = {
     access_token:this.globalService.getAccessTokenFromCookie(),
     user:this.workFromHomeForm.value.user_id,
     wfh:this.workFromHomeForm.value.type =="add"?1 :0
   }

   this.manageUserService.bulkEditUserWorkFromHome(body).subscribe((res:CustomResponse)=>{
     if(res.status){
       this.toasterMessageService.showSuccess("Edited Successfully");
       this.modalRef.hide();
       this.refresh();
     }
     else{
       this.toasterMessageService.showError("Cannot edit Work From Home");
       this.modalRef.hide();
     }
   })
  }
  staffListForWFH:any;
  getStaffListForWFH() {
    this.manageUserService.getStaffList().subscribe((response) => {
      if (response.status) {
        this.staffListForWFH = response.data;
      } else {
        this.staffListForWFH = [];
      }
    });
  }
  onSelectAll(){
    const selected = this.staffList.map((item) => item.user_id);
    this.workFromHomeForm.get("user_id").patchValue(selected);
  }
  onClearAll(){
    this.workFromHomeForm.get("user_id").patchValue([]);
  }

  //first of all set the methods here
  confirmText:string
  setConfirmationDialogMethods(body){
    this.globalService.showConfirmBox.next(true);
    this.globalService.showConfirmationLabel.next("Enter username");
    this.globalService.confirmInputText.subscribe((res)=>{
      this.confirmText = res;
      if(this.confirmText == body.username.trim()){
        this.globalService.confirmationSubmitDisableStatus.next(false);

      }
      else{
        this.globalService.confirmationSubmitDisableStatus.next(true);
      }
    }

    )
  }
  ngOnDestroy(){
    //reset the methods so that it doesn't have effects on other component in destroy
    this.globalService.resetConfirmationMethods();
  }
}
