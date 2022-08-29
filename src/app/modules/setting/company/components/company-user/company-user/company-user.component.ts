import { LocalStorageService } from "./../../../../../../shared/services/local-storage/local-storage.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ManageUserService } from "@app/modules/staff/manage-user/services/manage-user.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";

@Component({
  selector: "app-company-user",
  templateUrl: "./company-user.component.html",
  styleUrls: ["./company-user.component.scss"],
})
export class CompanyUserComponent implements OnInit {
  name;

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private manageUserService: ManageUserService,
    private toastrMessageService: ToastrMessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {}
  staffId;
  ngOnInit() {
    this.buildCompanyUserForm();
  }

  newCompanyId = this.activatedRoute.snapshot.params.id;
  userCredentialsForm: FormGroup;

  buildCompanyUserForm() {
    this.userCredentialsForm = this.fb.group({
      username: ["", [Validators.required]],
      staff_id: this.localStorageService.getLocalStorageItem("company_staff_id"),
      password: ["", [Validators.required]],
      verify_password: ["", [Validators.required]],
      access_level: [1],
      role: [1],
      company_id: [this.newCompanyId],
      user_id: [""],
    });
  }

  limit = this.globalService.pagelimit;
  getBody = {
    company_id: this.newCompanyId,
    limit: this.globalService.pagelimit,
    page: this.globalService.pageNumber,
    sortno: 1,
    sortnane: "username",
    search: {
      staff_id: "",
      username: "",
      password: "",
    },
  };
  pageLimit = parseInt(this.getBody.limit);

  registerUser(): void {
    if (this.userCredentialsForm.invalid) return;
    if (
      this.userCredentialsForm.value.password ===
      this.userCredentialsForm.value.verify_password
    ) {
      this.getBody.search.username = this.userCredentialsForm.value.username;
      this.getBody.search.password = this.userCredentialsForm.value.password;
      this.manageUserService
        .registerUser(this.userCredentialsForm.value)
        .subscribe(
          (response) => {
            if (response.status) {
              this.toastrMessageService.showSuccess(
                "User Registered Successfully"
              );
              this.router.navigate(["/setting/company"]);
            } else {
              this.toastrMessageService.showError(response.detail);
            }
          },

          (error) => {
            this.toastrMessageService.showError(error);
          }
        );
    } else if (
      this.userCredentialsForm.value.password &&
      this.userCredentialsForm.value.verify_password
    ) {
      this.toastrMessageService.showError("Password doesn't match.");
    }
  }
}
