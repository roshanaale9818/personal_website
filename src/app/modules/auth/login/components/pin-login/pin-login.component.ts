import { RegexConst } from "@app/shared/constants/regex.constant";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { LoginService } from "../../services/login.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { LoginConst } from "./../../constants/login.constant";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { SettingResponse } from "@app/modules/setting/general-setting/model/settingResponse.model";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";
import { MaskingService } from "@progress/kendo-angular-inputs";
import { MaskConst } from "@app/shared/constants/mask.constant";
import { Observable, Subject } from "rxjs";
import { DEFAULT_INTERRUPTSOURCES, Idle } from "@ng-idle/core";
import { GlobalService } from "@app/shared/services/global/global.service";
import { Keepalive } from "@ng-idle/keepalive";

@Component({
  selector: "app-pin-login",
  templateUrl: "./pin-login.component.html",
  styleUrls: ["./pin-login.component.scss"],
})
export class PinLoginComponent implements OnInit {
  timeoutId;
  userInactive: Subject<any> = new Subject();

  displayTimer$: Observable<number>;

  //For ng2 idel
  idleState = "Not started.";
  timedOut = false;
  lastPing?: Date = null;
  pinMask = MaskConst.PIN;
  @Output() onInvalidLoginAttempt: EventEmitter<boolean> = new EventEmitter();
  @Output() loading:EventEmitter<boolean> = new EventEmitter();
  loginConst = LoginConst;

  loginByPinForm: FormGroup;

  invalidLoginCount: number = 0;
  submitted: boolean;
  regex = RegexConst;
  constructor(
    private loginService: LoginService,
    private toastrMessageService: ToastrMessageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private idle: Idle,
    private globalService: GlobalService,
    private keepalive: Keepalive
  ) {
    //For ng2 idel

    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(5);

    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(895);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => (this.idleState = "No longer idle."));
    idle.onTimeout.subscribe(() => {
      this.idleState = "Timed out!";
      this.timedOut = true;
      this.globalService.logout();
      window.location.reload();
    });
    idle.onIdleStart.subscribe(() => (this.idleState = "You've gone idle!"));
    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = "You will time out in " + countdown + " seconds!";
      if (countdown == 0) {
        this.globalService.logout();
      }
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(5);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.reset();
  }

  reset() {
    this.idle.watch();
    this.idleState = "Started.";
    this.timedOut = false;
  }

  ngOnInit() {
    this.buildLoginByPinForm();
  }

  buildLoginByPinForm(): void {
    this.loginByPinForm = this.formBuilder.group({
      pin: [
        "",
        [
          Validators.required,
          Validators.maxLength(6),
          Validators.pattern(this.regex.NUMBER),
        ],
      ],
    });
  }

  get pin(): AbstractControl {
    return this.loginByPinForm.get("pin");
  }

  loginButtonClick: boolean = false;

  login(): void {
    this.submitted = true;
    if (this.loginByPinForm.invalid) return;
    this.loading.emit(true);
    // this.submitted = true;
    this.loginButtonClick = true;

    this.loginService.loginByPin(this.loginByPinForm.value).subscribe(
      (response) => {
        if (response.access_token) {
          this.loginButtonClick = false;

          // this.router.navigate(["/dashboard/admin"]);
          // this.cookieService.set(
          //   "token",
          //   response.access_token,
          //   null,
          //   "/",
          //   null,
          //   false,
          //   "Lax"
          // );
          // this.cookieService.set(
          //   "access_level",
          //   response.access_level,
          //   null,
          //   "/",
          //   null,
          //   false,
          //   "Lax"
          // );
          this.localStorageService.setLocalStorageItem(
            "flexYear-token",
            response.access_token
          );
          this.localStorageService.setLocalStorageItem("user_id", response.id);
          this.localStorageService.setLocalStorageItem(
            "access_level",
            response.access_level
          );
          this.getSettingsAfterLogin(response.staff.company_id);
          this.loginService.setUserInfoOnStorage(response.staff);
          this.authService.currentUserSubject.next(response.staff);
          localStorage.setItem("isPinLogin", JSON.stringify(true));
          // this.router.navigate(['/pin/dashboard'],{skipLocationChange:true});
          // if (this.rememberCredentials) {
          //   this.localStorageService.setLocalStorageItem(
          //     "credentials",
          //     this.loginForm.value
          //   );
          // }
          this.loading.emit(false);
          setTimeout(() => {
            this.router.navigate(["/pin/dashboard"]);
            this.toastrMessageService.showSuccess(
              "Your are successfully logged in."
            );
          }, 1000);
          return;
        }

        if (!response.status) {
          this.loginButtonClick = false;
          this.toastrMessageService.showError(response.response);
          this.incrementInvalidLoginCount();
          this.loading.emit(false);
        }
      },
      (error) => {
        console.log(error);
      }
    );
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
}
