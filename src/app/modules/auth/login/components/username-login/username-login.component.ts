import { SettingResponse } from "./../../../../setting/general-setting/model/settingResponse.model";
import { SettingService } from "./../../../../setting/general-setting/services/setting.service";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { LoginService } from "../../services/login.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { Router } from "@angular/router";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { CookieService } from "ngx-cookie-service";
import { LoginConst } from "./../../constants/login.constant";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";
import { CustomResponse } from '@app/shared/models/custom-response.model';
@Component({
  selector: "app-username-login",
  templateUrl: "./username-login.component.html",
  styleUrls: ["./username-login.component.scss"],
})
export class UsernameLoginComponent implements OnInit {
  @Output() onInvalidLoginAttempt: EventEmitter<boolean> = new EventEmitter();
  loginConst = LoginConst;

  loginForm: FormGroup;
  submitted: boolean;

  rememberCredentials: boolean;
  invalidLoginCount: number;

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    private cookieService: CookieService,
    private settingService: SettingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.rememberCredentials = true;
    this.invalidLoginCount = 0;
    this.buildLoginByUsernameForm();
  }

  buildLoginByUsernameForm(): void {
    const credentials = this.loginService.getCredentialsFromStorage();
    if (credentials) {
      this.rememberCredentials = true;
    }
    this.loginForm = this.formBuilder.group({
      username: [credentials ? credentials.username : "", Validators.required],
      password: [credentials ? credentials.password : "", Validators.required],
      pin: ["", [Validators.required, Validators.maxLength(6)]],
    });
  }
  clientId;

  loginButtonClick: boolean = false;

  login(): void {
    this.submitted = true;
    this.loginButtonClick = true;
    if (this.loginForm.invalid) return;

    this.loginService
      .loginByUsername(this.loginForm.value)
      .subscribe((response) => {
        if (response.access_token) {
          // this.toastrMessageService.showSuccess(
          //   "Your are successfully logged in."
          // );

          this.loginButtonClick = false;
          this.localStorageService.setLocalStorageItem(
            "flexYear-token",
            response.access_token
          );
          this.localStorageService.setLocalStorageItem(
            "access_level",
            response.access_level
          );
          // this.cookieService.set(
          //   "token",
          //   response.access_token,
          //   null,
          //   "/",
          //   null,
          //   false,
          //   "Lax"
          // );

          if (response.client && response.client.length) {
            this.clientId = response.client[0].client_id;
          }
          //commented code from before
          // this.localStorageService.setLocalStorageItem("role", response.role);
          this.localStorageService.setLocalStorageItem(
            "role",
            response.angular_role
          );
          this.loginService.setUserInfoOnStorage(response.staff);
          this.localStorageService.setLocalStorageItem("user_id", response.id);
          this.localStorageService.setLocalStorageItem(
            "staff_id",
            response.staff.staff_id
          );
          this.localStorageService.setLocalStorageItem(
            "client_id",
            this.clientId
          );
          this.getSettingsAfterLogin(response.staff.company_id);

          //getMenuRoles
          console.log("response companyId", response.staff.company_id);
          if (!response.staff.company_id) {
            console.error("no companyId");
          }
          this.getUserMenuDetail(
            response.id,
            response.staff.company_id,
            response
          );

          // if (this.rememberCredentials) {
          //   this.localStorageService.setLocalStorageItem(
          //     "credentials",
          //     this.loginForm.value
          //   );
          // }

          //commented code from before
          // this.authService.currentUserRoleSubject.next(response.role);
          this.authService.currentUserRoleSubject.next(response.angular_role);
          this.authService.currentUserSubject.next(response.staff);

          // if(response.role && response.role.toLowerCase() == 'staff'){
          //   setTimeout(()=>{
          //     this.router.navigate(['/dashboard/staff-dashboard'])
          //   },2000)
          // }
          // else{
          //   setTimeout(()=>{
          //     this.router.navigate(["/dashboard/admin"]);
          //   },1000)
          // }
        }

        if (!response.status) {
          this.loginButtonClick = false;

          this.toastrMessageService.showError(response.response);
          this.incrementInvalidLoginCount();
        }
      });
  }

  /**
   * counter for invalid login attempt
   */
  incrementInvalidLoginCount(): void {
    this.invalidLoginCount++;
    if (
      this.invalidLoginCount >= this.loginConst.ALLOWED_INVALID_LOGIN_ATTEMPT
    ) {
      this.onInvalidLoginAttempt.emit(true);
    }
  }

  rememberMe(value) {
    if (value) {
      this.rememberCredentials = true;
    } else {
      this.rememberCredentials = false;
      this.localStorageService.removeLocalStorageItem("credentials");
    }
  }

  // form controls
  get username(): AbstractControl {
    return this.loginForm.get("username");
  }

  get password(): AbstractControl {
    return this.loginForm.get("password");
  }

  // method to get setting parameter after login and set it to localStorage.
  getSettingsAfterLogin(id) {
    this.loginService.getSettings(id).subscribe((response: SettingResponse) => {
      if (response.status) {
        this.loginService.setSettingsParametersOnStorage(
          response.setting,
          response.emailsetting
        );
        return;
      }
    });
  }

  //get userrole  menu by user id
  getUserMenuDetail(id, companyId, response) {
    this.loginService.getMenuDetails(id, companyId).subscribe((res) => {
      if (res.status) {
        this.localStorageService.setLocalStorageItem(
          "userMenuDetails",
          res.data
        );
        this.navigateToDashboard(response);
      } else {
        console.error("no any user role", res.data);
      }
    });
    this.getUserPreferenceSetting(response.id);
  }

  //getUserPreferenceSettingByUserId
  getUserPreferenceSetting(userId){
    console.log("userpreference called")
    this.loginService.getUserPreferenceSetting(userId).subscribe((data:CustomResponse)=>{
      if(data.status){
        this.localStorageService.setLocalStorageItem("userPreferenceSetting",data.data);
      }
    })
  }

  //navigateAccording to User role
  navigateToDashboard(response) {
    // role changed to angular role
    console.log(
      this.localStorageService.getLocalStorageItem("userMenuDetails")
    );
    console.log("response", response);
    if (
      response.angular_role &&
      (response.angular_role == "Super Admin" ||
        response.angular_role == "Admin" ||
        response.angular_role == "HR")
    ) {
      setTimeout(() => {
        this.router.navigate(["/dashboard/admin"]).then((data) => {
          console.log("reached inner here", data);
          if (data) {
            this.toastrMessageService.showSuccess(
              "Your are successfully logged in."
            );
          }
        });
      }, 1000);
    } else {
      this.router.navigate(["/dashboard/staff-dashboard"]).then((data) => {
        if (data) {
          this.toastrMessageService.showSuccess(
            "Your are successfully logged in."
          );
        }
      });
    }
  }
}
