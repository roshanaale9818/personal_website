import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  AbstractControlDirective,
  Validators,
} from "@angular/forms";
import { ToastrMessageService } from "./../../../../shared/services/toastr-message/toastr-message.service";
import { CookieService } from "ngx-cookie-service";
import { FooterComponent } from "./../../../../core/layout/admin-panel/footer/footer.component";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { LoginService } from "../services/login.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { TabsetComponent } from "ngx-bootstrap";
import { LoginConst } from "./../constants/login.constant";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";
import { SettingService } from "@app/modules/setting/general-setting/services/setting.service";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { environment } from "@env/environment";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { GlobalService } from "@app/shared/services/global/global.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild("loginTabs", { static: false }) tabset: TabsetComponent;
  loginConst = LoginConst;
  entryComponent = FooterComponent;
  activeTab: string;

  showTimerSection: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    private cookieService: CookieService,
    private settingService: SettingService,
    private authService: AuthService,
    private globalService:GlobalService
  ) {
    // this.subdomain

  }
  domainUrl: any;
  subdomain: string;
  ngOnInit() {
    const parsedUrl = new URL(window.location.href);
    // const baseUrl = parsedUrl.hostname;
    // console.log("parseUrl", parsedUrl);
    // console.log('splitted',)
    this.domainUrl = parsedUrl.host.split(".")
    this.subdomain = this.domainUrl ? this.domainUrl[0] : '';
    // console.log("sub domain",this.subdomain)
    // console.log(baseUrl);
    this.isInvalidLoginRetry();
    this.isUserLoggedIn();
    this.checkRoute();
    this.rememberCredentials = true;
    this.invalidLoginCount = 0;
    this.buildLoginByUsernameForm();
    this.subdomain ? this.getCompanyDetail("b5dd-27-34-104-219") : null;
    this.getSystemToken();
  }
  imageUrl = environment.baseImageUrl;
  companyDetailObj: any;
  getCompanyDetail(domain) {
    this.loginService.getCompanyDetail(domain).subscribe((res: any) => {
      // console.log(res);
      // console.log("companyDetail by subdomaiun is", res);
      if (res.status) {
        this.companyDetailObj = res;
        this.globalService.companyName.next(this.companyDetailObj ? this.companyDetailObj.comapny.company_name : null)
        this.cookieService.set("company_name",this.companyDetailObj ? this.companyDetailObj.comapny.company_name : null)
      }
      // console.log("this is companyDetailOj",this.companyDetailObj)
      this.loginForm.patchValue({
        company_id: this.companyDetailObj ? this.companyDetailObj.comapny.company_id : null
      })
    })
  }

  checkRoute(): void {
    // console.log("activated route", this.activatedRoute);
    this.activatedRoute.queryParams.subscribe((params) => {
      let user_access_token = params.access_token;
      this.loginWithToken(user_access_token);
    });
  }

  loginWithToken(access_token): void {
    if (!access_token) return;
    this.loginService.loginByToken(access_token).subscribe((response) => {
      if (response.access_token) {
        this.localStorageService.setLocalStorageItem(
          "flexYear-token",
          response.access_token
        );
        this.localStorageService.setLocalStorageItem(
          "access_level",
          response.access_level
        );
        this.localStorageService.setLocalStorageItem("user_id", response.id);
        this.toastrMessageService.showSuccess("User signed in successfully");
        this.loginService.setUserInfoOnStorage(response.staff);

        this.getSettingsAfterLogin(response.staff.company_id);

        this.router.navigate(["/daybook-management/attendance"]);
        return;
      }

      if (!response.status) {
        this.toastrMessageService.showError(response.response);
      }
    });
  }

  //passed the companyId from login
  getSettingsAfterLogin(id): void {
    this.loginService.getSettings(id).subscribe((response) => {
      if (response.status) {
        // this.loginService.setSettingsParametersOnStorage(
        //   response.setting,
        //   response.emailsetting
        this.localStorageService.setLocalStorageItem(
          "setting_list",
          response.setting
        );
        this.localStorageService.setLocalStorageItem(
          "emailSetting_list",
          response.emailsetting
        );

        return;
      }
    });
  }

  getRouteQueryParams(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.type === "pin-login") {
        const interval = setTimeout(() => {
          this.tabset.tabs[1].active = true;
          clearInterval(interval);
        }, 1);
      }
    });
  }

  ngAfterViewInit(): void {
    this.getRouteQueryParams();
  }

  /**
   * Starts the timer again when the user tries to reload the page on preview of timer section
   */
  isInvalidLoginRetry(): void {
    const showTimer = this.localStorageService.getLocalStorageItem("showTimer");
    if (showTimer) {
      this.showTimer(true);
    }
  }

  /**
   * Redirects to dashboard when the user is already logged in
   */
  isUserLoggedIn(): void {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(["dashboard/admin"]);
    }
  }

  loginByUsername: boolean = true;
  loginType: string;
  changeTab($event, loginType): void {
    this.activeTab = $event.heading;
    this.loginType = loginType;

    if (loginType === "usernameLogin") {
      this.loginByUsername = true;
      const queryParams: Params = { type: "username-login" };
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: "merge", // remove to replace all query params by provided
      });
    } else {
      this.loginByUsername = false;

      const queryParams: Params = { type: "pin-login" };

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: "merge", // remove to replace all query params by provided
      });
    }
  }

  /**
   * Replaces login tab with timer section
   * @param event true or false
   */
  showTimer(event: boolean): void {
    if (event) {
      this.showTimerSection = true;
      this.localStorageService.setLocalStorageItem("showTimer", true);
      this.startTimer();
    }
  }

  remainingTime: number;
  startTimer(): void {
    this.remainingTime = 60;
    let showTimerInterval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime === 0) {
        this.showTimerSection = false;
        this.localStorageService.removeLocalStorageItem("showTimer");
        clearInterval(showTimerInterval);
      }
    }, 1000);
  }

  rememberCredentials;
  loginForm: FormGroup;
  buildLoginByUsernameForm(): void {
    const credentials = this.loginService.getCredentialsFromStorage();
    if (credentials) {
      this.rememberCredentials = true;
    }
    this.loginForm = this.formBuilder.group({
      username: [credentials ? credentials.username : "", Validators.required],
      password: [credentials ? credentials.password : "", Validators.required],
      company_id: [this.companyDetailObj ? this.companyDetailObj.comapny.company_id : null],

    });
  }
  clientId;

  loginButtonClick: boolean = false;

  submitted: boolean;
  loading: boolean = false;
  login(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.submitted = true;
    this.loginButtonClick = true;

    this.loginService
      .loginByUsername(this.loginForm.value)
      .subscribe((response) => {
        if (response.access_token) {
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
          this.loading = false;
          this.incrementInvalidLoginCount();
        }
      });
  }

  onInvalidLoginAttempt;
  invalidLoginCount;
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
  // get username(): AbstractControl {
  //   return this.loginForm.get("username");
  // }

  // get password(): AbstractControlDirective {
  //   return this.loginForm.get("password");
  // }

  //get userrole  menu by user id
  getUserMenuDetail(id, companyId, response) {
    this.loginService.getMenuDetails(id, companyId).subscribe((res) => {
      if (res.status) {
        this.localStorageService.setLocalStorageItem(
          "userMenuDetails",
          res.data
        );
        // this.loading = false;
        this.navigateToDashboard(response);
      } else {
        // console.error("no any user role", res.data);
      }
    });
    this.getUserPreferenceSetting(response.id);
  }

  //navigateAccording to User role
  navigateToDashboard(response) {
    // role changed to angular role
    // console.log(
    //   this.localStorageService.getLocalStorageItem("userMenuDetails")
    // );
    // console.log("response", response);
    this.loading = false;
    if (
      response.angular_role &&
      (response.angular_role == "Super Admin" ||
        response.angular_role == "Admin")
    ) {
      setTimeout(() => {
        this.router.navigate(["/dashboard/admin"]).then((data) => {
          if (data) {
            this.toastrMessageService.showSuccess(
              "Your are successfully logged in."
            );
          }
        });
      }, 1000);
    } else {
      setTimeout(() => {
        this.router.navigate(["/dashboard/staff-dashboard"]).then((data) => {
          if (data) {
            this.toastrMessageService.showSuccess(
              "Your are successfully logged in."
            );
          }
        });
      }, 1000);
    }
  }

  //getUserPreferenceSettingByUserId
  getUserPreferenceSetting(userId) {
    this.loginService
      .getUserPreferenceSetting(userId)
      .subscribe((data: CustomResponse) => {
        if (data.status) {
          this.localStorageService.setLocalStorageItem(
            "userPreferenceSetting",
            data.data
          );
        }
      });
  }
  onLoadingChange(event) {
    this.loading = event;
  }
  async loginWithPromise() {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    // this.loginForm.patchValue({
    //   company_id:this.companyDetailObj?this.companyDetailObj.comapny.company_id:null
    // })
    this.loading = true;
    this.submitted = true;
    this.loginButtonClick = true;
    let res;

    await this.loginService
      .loginByUsername(this.loginForm.value).toPromise()
      .then((response) => {
        if (response.access_token) {
          this.loginButtonClick = false;
          this.localStorageService.setLocalStorageItem(
            "flexYear-token",
            response.access_token
          );
          this.localStorageService.setLocalStorageItem(
            "access_level",
            response.access_level
          );
          if (response.client && response.client.length) {
            this.clientId = response.client[0].client_id;
          }
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

          if (!response.staff.company_id) {
            console.error("no companyId");
          }

          //assign response to res;
          res = response;

          this.authService.currentUserRoleSubject.next(response.angular_role);
          this.authService.currentUserSubject.next(response.staff);
        }

        if (!response.status) {
          this.loginButtonClick = false;

          this.toastrMessageService.showError(response.response);
          this.loading = false;
          this.incrementInvalidLoginCount();
        }
      })

    if (!res) { return }
    let settings;
    await this.loginService.getSettings(res.staff.company_id).toPromise().then((response) => {

      if (response.status) {
        this.localStorageService.setLocalStorageItem(
          "setting_list",
          response.setting
        );
        settings = response.setting;
        this.localStorageService.setLocalStorageItem(
          "emailSetting_list",
          response.emailsetting
        );
      }
    });


    if (!settings) { return; }
    let menu;
    await this.loginService.getMenuDetails(res.id,
      res.staff.company_id).toPromise().then((response) => {
        if (response && response.status) {
          this.localStorageService.setLocalStorageItem(
            "userMenuDetails",
            response.data
          );
          menu = response.data;
          // this.loading = false;
          // this.navigateToDashboard(res);
        } else {
          console.error("no any user role", res.data);
        }
      });



    if (!menu) { return }
    await this.getUserPrefSettingWithPromise(res.id).then((resolve) => {
      ((data: CustomResponse) => {
        if (data.status) {
          this.localStorageService.setLocalStorageItem(
            "userPreferenceSetting",
            data.data
          );
        }
      });
    });

    if (!menu) { return };
    await this.routeWithPromise(res);

  }

  routeWithPromise(response): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loading = false;
      if(response.login_attempt == 1){
        this.router.navigate(["/guide"]).then((data) => {
          if (data) {
            this.toastrMessageService.showSuccess(
              "Your are successfully logged in."
            );
          }
        });
      }
      if (
        response.angular_role &&
        (response.angular_role == "Super Admin" ||
          response.angular_role == "Admin")
      ) {
        this.router.navigate(["/dashboard/admin"]).then((data) => {
          if (data) {
            this.toastrMessageService.showSuccess(
              "Your are successfully logged in."
            );
          }
        });
      } else {
        this.router.navigate(["/dashboard/staff-dashboard"]).then((data) => {
          if (data) {
            this.toastrMessageService.showSuccess(
              "Your are successfully logged in."
            );
          }
        });
      }

    })
  }


  getUserPrefSettingWithPromise(userId) {
    return this.loginService
      .getUserPreferenceSetting(userId).toPromise();
  }
  ngDestroy: Subject<boolean> = new Subject();
  async getSystemToken() {
    //returning without doing anything for now because of SSL error from API.
    return;
    await this.loginService.getSystemToken().toPromise().then((res: any) => {
      console.log("res from system token", res);
      if (res) {
        this.localStorageService.setLocalStorageItem(
          "access_token",
          res.att_token
        );
        this.cookieService.set(
          "access_token",
          res.att_token
        )
        this.localStorageService.setLocalStorageItem(
          "flexyear-token",
          res.att_token
        );
      }

      console.log("res", res)
    })
    // this.subdomain ? this.getCompanyDetail("b5dd-27-34-104-219"):null;
  }
  ngOnDestroy() {
    this.ngDestroy.next(true);
  }
}
