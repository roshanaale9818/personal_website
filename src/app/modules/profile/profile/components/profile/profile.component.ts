import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { environment } from "@env/environment";
import { ProfileService } from "../../services/profile.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  // staffId = this.activatedRoute.snapshot.params.id;
  staffId;
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
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute,
    private toastrMessageService: ToastrMessageService,
    private router: Router,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService
  ) {
    // this.returnRandomNmber();
    this.staffId = this.localStorageService.getLocalStorageItem("staff_id");
  }

  ngOnInit() {
    this.getStaffDetailById();
    this.buildChangePasswordForm();
    // this.getStaffList();
    this.buildPinChangeForm();
    // this.returnRandomNmber();
  }

  passwordForm: FormGroup;
  buildChangePasswordForm(): void {
    this.passwordForm = this.formBuilder.group({
      user_id: this.userId,
      old_password: ["", [Validators.required]],
      password: ["", [Validators.required]],
      confirm_password: ["", [Validators.required]],
    });
  }

  getStaffDetailById(): void {
    this.profileService.getStaffDetailById(this.staffId).subscribe(
      (response) => {
        if (response.status) {
          this.staffDetail = response;
          console.log(this.staffDetail);
          this.experiences = response.experience;
          this.academics = response.academic;
          this.languages = response.languages;
          this.attachments = response.attechment;
          return;
        }
      },
      (error) => {
        console.log(error);
        this.toastrMessageService.showError(error);
      }
    );
  }

  navigateToEdit(): void {
    // this.router.navigate([
    //   "/staff/manage-staff/update/",
    //   this.activatedRoute.snapshot.params.id,
    // ]);
    this.router.navigate(["/profile/update"]);
  }

  openChangePasswordModal(template: TemplateRef<any>) {
    this.buildChangePasswordForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openImageModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  modalTitle: any;
  openChangePinModal(template: TemplateRef<any>): void {
    this.modalTitle = "Change User's Pin";
    this.buildPinChangeForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  updatePassword(): void {
    if (this.passwordForm.invalid || this.passwordForm.pristine) return;
    if (
      this.passwordForm.value.password !==
      this.passwordForm.value.confirm_password
    ) {
      this.toastrMessageService.showError(
        "Password and confirm password didnot match."
      );
      return;
    } else {
      this.profileService
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
  showRandomNumber: boolean = true;
  randomNumber;
  returnRandomNmber() {
    // this.randomNumber = Math.floor(1000 + Math.random() * 9000);  -- this. is for 4 no. pin
    // the given below code is for 6 digit pin
    this.randomNumber = Math.floor(Math.random() * 899999 + 100000);
    this.showRandomNumber = true;
    return this.randomNumber;
  }

  pinChangeForm: FormGroup;
  buildPinChangeForm() {
    this.pinChangeForm = this.formBuilder.group({
      user_id: [this.localStorageService.getLocalStorageItem("user_id")],
      pin: [""],
    });
  }

  changePin() {
    let body = {
      user_id: this.pinChangeForm.value.user_id,
      pin: this.randomNumber,
    };
    if (this.pinChangeForm.invalid) return;
    this.profileService.changePin(body).subscribe(
      (response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess("Pin is changed Successfully");
          this.showRandomNumber = false;
          this.modalRef.hide();
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
    this.showRandomNumber = false;
  }
}
