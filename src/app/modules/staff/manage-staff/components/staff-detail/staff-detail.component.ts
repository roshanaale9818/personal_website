import { ManageUserService } from "./../../../manage-user/services/manage-user.service";
import { EmployeeService } from "./../../../../../shared/services/employee/employee.service";
import { LocalStorageService } from "./../../../../../shared/services/local-storage/local-storage.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "./../../../../../../environments/environment";
import { ToastrMessageService } from "./../../../../../shared/services/toastr-message/toastr-message.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ManageStaffService } from "./../../services/manage-staff.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { GlobalService } from "@app/shared/services/global/global.service";

@Component({
  selector: "app-staff-detail",
  templateUrl: "./staff-detail.component.html",
  styleUrls: ["./staff-detail.component.scss"],
})
export class StaffDetailComponent implements OnInit {
  staffId = this.activatedRoute.snapshot.params.id;
  experiences = [];
  academics = [];
  languages = [];
  attachments = [];
  staffDetail: any;
  baseImageUrl = environment.baseImageUrl;
  listLoading: boolean;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  modalRef: BsModalRef;
  userId = this.localStorageService.getLocalStorageItem("user_id");
  constructor(
    private manageStaffService: ManageStaffService,
    private activatedRoute: ActivatedRoute,
    private toastrMessageService: ToastrMessageService,
    private router: Router,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private employeeService: EmployeeService,
    private manageUserService: ManageUserService,
    private globalService:GlobalService
  ) {}
  noUpdateButton: boolean = false;
  ngOnInit() {
    this.getStaffDetailById();
    this.buildChangePasswordForm();
    this.getStaffList();
    this.buildPinChangeForm();
    if (this.router.url.includes("/view")) {
      this.noUpdateButton = true;
    }
  }

  passwordForm: FormGroup;
  buildChangePasswordForm(): void {
    this.passwordForm = this.formBuilder.group({
      user_id: this.userId,
      old_password: ["", [Validators.required]],
      password: "",
      // confirm_password: "",
      verify_password:""
    });
  }

  getStaffDetailById(): void {
    this.manageStaffService.getStaffDetailById(this.staffId).subscribe(
      (response) => {
        if (response.status) {
          this.staffDetail = response;
          console.log(this.staffDetail);
          this.experiences = response.experience;
          this.academics = response.academic;
          this.languages = response.languages;
          this.attachments = response.attechment;
          this.globalService.setUserIdForPinChange(response.user_credential.user_id);
          return;
        }
      },
      (error) => {
        console.log(error);
        this.toastrMessageService.showError(error);
      }
    );
  }

  staffList;
  getStaffList() {
    this.staffList = [];
    this.manageUserService.getStaffList().subscribe((response) => {
      if (response.status) {
        this.staffList = response.data;
      } else {
        this.staffList = [];
      }
    });
  }

  navigateToEdit(): void {
    this.router.navigate([
      "/staff/manage-staff/update/",
      this.activatedRoute.snapshot.params.id,
    ]);
  }

  openChangePasswordModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  openImageModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  modalTitle: any;
  openChangePinModal(template: TemplateRef<any>): void {
    this.modalTitle = "Change User's Pin";
    this.modalRef = this.modalService.show(template, this.config);
  }

  updatePassword(): void {
    if (this.passwordForm.invalid || this.passwordForm.pristine) return;
    if (
      this.passwordForm.value.password !==
      this.passwordForm.value.verify_password
    ) {
      this.toastrMessageService.showError(
        "Your password and confirm password doesnot match"
      );
      return;
    } else {
      this.passwordForm.get('user_id').setValue(this.globalService.getPinChangeUserId())
      this.manageStaffService
        .updatePassword(this.passwordForm.value)
        .subscribe((response) => {
          if (response.status) {
            this.toastrMessageService.showSuccess(
              "Your password is changed successfully."
            );
            this.modalRef.hide();
            this.buildChangePasswordForm();
          } else {
            this.toastrMessageService.showError(
              "Your old password is invalid."
            );
          }
        });
    }
  }

  randomNumber;
  returnRandomNmber() {
    // this.randomNumber = Math.floor(1000 + Math.random() * 9000);  -- this. is for 4 no. pin
    // the given below code is for 6 digit pin
    this.randomNumber = Math.floor(Math.random() * 899999 + 100000);
    this.showPin = true;
    return this.randomNumber;
  }

  pinChangeForm: FormGroup;
  buildPinChangeForm() {
    this.pinChangeForm = this.formBuilder.group({
      user_id: this.localStorageService.getLocalStorageItem("user_id"),
      pin: "",
    });
  }

  showPin: boolean = false;
  changePin() {
    console.log("pin is changed");
    let body = {
      // this.pinChangeForm.value.user_id
      user_id: this.globalService.getPinChangeUserId(),
      pin: this.randomNumber,
    };
    // if (this.pinChangeForm.invalid) return;
    this.manageUserService.changePin(body).subscribe(
      (response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess("Pin Changed Successfully");

          this.modalRef.hide();
          this.showPin = false;
        } else {
          this.toastrMessageService.showError(response.detail);
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  onCancel(): void {
    this.modalRef.hide();
    this.showPin = false;
  }
}
