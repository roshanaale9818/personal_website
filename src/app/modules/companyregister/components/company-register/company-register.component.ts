import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/guards/auth/services/auth-service.service';
import { LoginService } from '@app/modules/auth/login/services/login.service';
import { MaskConst } from '@app/shared/constants/mask.constant';
import { RegexConst } from '@app/shared/constants/regex.constant';
import { CustomValidators } from '@app/shared/directives/validators/CustomValidators';
import { CustomResponse } from '@app/shared/models/custom-response.model';
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { ConfirmedValidator, } from '../../validators/confirm.password.validator';
import { CompanyregisterService } from './../../services/companyregister.service';

@Component({
  selector: 'app-company-register',
  templateUrl: './company-register.component.html',
  styleUrls: ['./company-register.component.scss']
})
export class CompanyRegisterComponent implements OnInit {
  emailPattern = RegexConst.EMAIL;
  phonePattern = RegexConst.PHONE_NO;
  companyForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private companyRegisterService: CompanyregisterService,
    private modalService: BsModalService,
    private toasterMessageService: ToastrMessageService,
    private localStorageService: LocalStorageService,
    private cookieService: CookieService,
    private authService: AuthService,
    private loginService: LoginService

  ) { }

  ngOnInit() {
    console.log(
      this.cookieService.get("app_access_info"),
      this.cookieService.get("company_information")
    )
    this.getSystemToken();
    this.createCompanyForm();
  }
  // get
  getpasswordControlMsg() {
    // return
    // this.companyForm.controls['password'].hasError('hasSpecialCharacters')"
    // switch(this.companyForm.controls['password'].errors)
    // console.log(" this.companyForm.controls['password'].errors", this.companyForm.controls['password'].errors);
    return this.companyForm.controls['password'].value;
  }
  get passwordValidationMessage() {
    // get error from the formcontrol
    let errorsObj = this.companyForm.controls['password'].errors;
    let message = '';

    for (let i in errorsObj) {
      if (i) {
        // console.log("iii", i);
        switch (i) {
          case "hasNumber":
            message = " Should have aleast 1 number.";
            break;
          case "hasCapitalCase":
            message = " Must contain at least 1 in Capital Case."
            break;
          case "hasSmallCase":
            message = "Must contain at least 1 Letter in Small Case."
            break;
          case "required":
            message = "Password is required"
            break;
          case "hasSpecialCharacters":
            message = "Should have aleast 1 special character"
            break;
          case "minlength":
            message = "Must be at least 8 characters."
            break;

          default:
            message = null;
            break;

        }


      }
      else{
        message = null;
      }

    }

    return message;

  }

  subdomainSuggestions:any[]=[];
  createCompanyForm() {
    this.companyForm = this.fb.group({
      // id: "",
      access_token: [""],
      company_name: ["", Validators.required],
      address: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(this.emailPattern)]],
      phone: ["", [Validators.required, Validators.pattern(this.phonePattern)]],
      remarks: [""],
      subdomain: ["", [Validators.required, this.patternValidator()]],
      status: ["0"],
      template: ["0"],
      username: ['', [Validators.required]],
      verify_password: ['', Validators.compose([Validators.required])],
      // custom validation entry here
      password: [
        null,
        Validators.compose([
          Validators.required,
          // check whether the entered password has a number
          CustomValidators.patternValidator(/\d/, {
            hasNumber: true
          }),
          // check whether the entered password has upper case letter
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          // check whether the entered password has a lower case letter
          CustomValidators.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          // check whether the entered password has a special character
          CustomValidators.patternValidator(
            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            {
              hasSpecialCharacters: true
            }
          ),
          Validators.minLength(8)
        ])
      ],

    },
      { validators: ConfirmedValidator("password", "verify_password") });
    this.companyForm.get('company_name').valueChanges.subscribe((res: string) => {
      this.getpasswordControlMsg();
      let value = res;
      if(value.length >10){
        value = value.trim();
        value = value.split(" ")[0];
      }
      // replace(/\_/g, "")
      // first and last
      // replace(/\_^/, "").replace(/\_$/, "")
      this.companyForm.get("subdomain").setValue(value.trim().toLowerCase().replace(/\-/g, "").replace(/\./g, '').replace(/[\/\s]+/gi, "-"))

    })
    this.companyForm.get("subdomain").valueChanges
    .pipe(
      debounceTime(600),
      switchMap(res => {
        res.replace(/[\/\s]+/gi, "-")

        //calling the api if the subdomain is available
        return this.companyRegisterService.getSubdomainSuggestion(res+".flexyear.com")
      })
      // and subscribe the response
    ).subscribe(((res:any) => {
      console.log("res",res);
      if(res.status){
        this.subdomainMessage = null;
        this.subdomainSuggestions =null;
      }
      else{
        // res.detail;
        this.subdomainMessage = "The requested subdomain is not available.Please select from below."
        res.data?this.subdomainSuggestions =res.data:this.subdomainSuggestions =null;
      }


    }))

  }
  disableBtn: boolean = false;
  phoneMask = MaskConst.PHONE_NUMBER;
  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      return;
      // const regex = new RegExp("^[a-z]*$");
      // const valid = regex.test(control.value);
      // return valid ? null : { invalidDomain: true };
    };
  }
  subdomainMessage:string;
  onSubmitCompany() {
    console.log("this is companyForm", this.companyForm)
    if (this.companyForm.invalid) { return }

    else {
      // pipe(
      //   debounceTime(300),
      // )
      this.disableBtn = true
      this.companyForm.get('access_token').setValue(
        this.localStorageService.getLocalStorageItem("access_token")
      );
      let body = {
        access_token: "",
        company_name: "",
        address: "",
        email: "",
        phone: "",
        remarks: "",
        subdomain: this.subdomainSuggestion + ".flexyear.com",
        status: "",
        template: "",
        username: "",
        password: ""
      };
      body = this.companyForm.value;
      body.phone = body.phone.replace(/\-/g,"");

      body.subdomain = this.subdomainSuggestion + ".flexyear.com";
      // console.log("phone",body)
      // return;
      this.companyRegisterService.addCompany(
        body
      ).subscribe((res: CustomResponse) => {
        console.log("res", res)

        this.cookieService.set("app_access_info", res.app_access_token);
        this.cookieService.set("company_information", res.data)
        if (res.status) {
          this.toasterMessageService.showSuccess(`Company registered sucessfully.Please verify it in your email ${this.companyForm.get("email").value}`)
          // this.createUser(res);
          this.router.navigate(["/company-registration/verify-company"]);
        }
        else {
          // this.toasterMessageService.showError(res.response)
          if (res.data && res.data) {
            for (let x in res.data) {
              console.log("this is ex", x);
              this.toasterMessageService.showHTMLErrorMessage(res.data[x])
            }
            // res.data.forEach(x=>{
            //   this.toasterMessageService.showError(x);
            // })
          }
          if(res.userdata){
            for (let x in res.userdata) {
              this.toasterMessageService.showHTMLErrorMessage(res.userdata[x][0])
            }

          }
        }
      })
    }
  }
  modalRef: BsModalRef;
  get subdomain() {
    return this.companyForm.get("subdomain");
  }
  get subdomainSuggestion() {
    const subdomainValue = this.companyForm.get("subdomain");
    return subdomainValue.value.toLowerCase().replace(/[\/\s]+/gi, "-");

  }
  onCancel() {
    this.createCompanyForm();
    // this.companyForm.reset();
    // this.companyForm.valid=true;
  }
  backToLogin() {
    // this.createUser();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  userCredentialsForm: FormGroup;
  buildCompanyUserForm(response?: any) {
    this.userCredentialsForm = this.fb.group({
      username: ["", [Validators.required]],
      staff_id: [response ? response.staff_id : ""],
      password: ["", [Validators.required]],
      verify_password: ["", [Validators.required,
      ]],
      access_token: [""],
      // access_level: [1],
      // role: [1],
      company_id: [response ? response.data.company_id : ""],
      // user_id: [""],
    },
      { validators: ConfirmedValidator("password", "verify_password") }
    );
    // matching for password validation of conifrm and verify and password
    // CustomValidators.matchValues('password')
    // this.userCredentialsForm.get('verify_password').valueChanges.subscribe((re)=>{
    //   console.log("Err",this.userCredentialsForm.get('verify_password'),re)
    // })
  }
  @ViewChild("registerUser", { static: false }) registerUser: TemplateRef<any>;
  createUser(res?: any) {
    console.log("response in createUser", res)
    this.showUserModal(this.registerUser, res);

  }
  showUserModal(template: TemplateRef<any>, res?: any) {
    this.buildCompanyUserForm(res ? res : null);
    this.modalRef = this.modalService.show(template, this.config);
  }
  config = {
    // modal config to unhide modal when clicked outside
    backdrop: true,
    ignoreBackdropClick: true,
  };
  onCancelUserRegister() {
    this.modalRef.hide();
  }
  saveAndLoginDisable: boolean = false;
  onSaveUser() {
    console.log("begin", this.userCredentialsForm)
    if (this.userCredentialsForm.invalid) { return }

    else {
      this.saveAndLoginDisable = true;
      this.userCredentialsForm.get("access_token").setValue(
        this.cookieService.get('access_token')
      )
      this.disableBtn = false;
      console.log("success", this.userCredentialsForm)
      this.companyRegisterService.userRegister(this.userCredentialsForm.value).subscribe((res: CustomResponse) => {
        if (res.status) {
          this.toasterMessageService.showSuccess("User created successfully.");
          // this.backToLogin();
          //   this.loginForm.username = this.userCredentialsForm.get("username").value;
          //   this.loginForm.password = this.userCredentialsForm.get("verify_password").value;
          //   this.loginForm.company_id = this.userCredentialsForm.get("company_id").value
          //   // this.login();
          //  if(this.modalRef){
          //   this.modalRef.hide();
          //  }
          this.backToLogin();

        }
        else {
          this.toasterMessageService.showError(res.data);
        }
      })
    }
  }
  ngDestroy: Subject<boolean> = new Subject();
  getSystemToken() {
    this.companyRegisterService.getSystemToken().pipe(
      takeUntil(this.ngDestroy)
    ).subscribe((res: any) => {
      this.localStorageService.setLocalStorageItem(
        "access_token",
        res.att_token
      );
      this.cookieService.set(
        "access_token",
        res.att_token
      )

      console.log("res", res)
    })
  }
  ngOnDestroy() {
    this.ngDestroy.next(true);
  }



  clientId;
  loginForm = {
    username: "",
    password: "",
    company_id: ''
  }
  login(): void {
    this.loginService
      .loginByUsername(this.loginForm)
      .subscribe((response) => {
        if (response.access_token) {
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


          this.toasterMessageService.showError(response.response);
          // this.loading = false;
          // this.incrementInvalidLoginCount();
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
  // getSettingsAfterLogin(id): void {
  //   this.loginService.getSettings(id).subscribe((response) => {
  //     if (response.status) {
  //       // this.loginService.setSettingsParametersOnStorage(
  //       //   response.setting,
  //       //   response.emailsetting
  //       this.localStorageService.setLocalStorageItem(
  //         "setting_list",
  //         response.setting
  //       );
  //       this.localStorageService.setLocalStorageItem(
  //         "emailSetting_list",
  //         response.emailsetting
  //       );

  //       return;
  //     }
  //   });
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
        console.error("no any user role", res.data);
      }
    });
    this.getUserPreferenceSetting(response.id);
  }
  // getUserMenuDetail(id, companyId, response) {
  //   this.loginService.getMenuDetails(id, companyId).subscribe((res) => {
  //     if (res.status) {
  //       this.localStorageService.setLocalStorageItem(
  //         "userMenuDetails",
  //         res.data
  //       );
  //       // this.loading = false;
  //       this.navigateToDashboard(response);
  //     } else {
  //       console.error("no any user role", res.data);
  //     }
  //   });
  //   this.getUserPreferenceSetting(response.id);
  // }

  //navigateAccording to User role
  navigateToDashboard(response) {
    // role changed to angular role
    // console.log(
    //   this.localStorageService.getLocalStorageItem("userMenuDetails")
    // );
    // console.log("response", response);
    // this.loading = false;
    if (
      response.angular_role &&
      (response.angular_role == "Super Admin" ||
        response.angular_role == "Admin")
    ) {
      setTimeout(() => {
        this.router.navigate(["/dashboard/admin"]).then((data) => {
          if (data) {
            this.toasterMessageService.showSuccess(
              "Your are successfully logged in."
            );
          }
        });
      }, 1000);
    } else {
      setTimeout(() => {
        this.router.navigate(["/dashboard/staff-dashboard"]).then((data) => {
          if (data) {
            this.toasterMessageService.showSuccess(
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
  // getUserPreferenceSetting(userId) {
  //   this.loginService
  //     .getUserPreferenceSetting(userId)
  //     .subscribe((data: CustomResponse) => {
  //       if (data.status) {
  //         this.localStorageService.setLocalStorageItem(
  //           "userPreferenceSetting",
  //           data.data
  //         );
  //       }
  //     });
  // }
  captchaIsResolved: boolean = false;
  resolved(event): void {
    console.log(event);
    if (event) {
      console.log(event);
      this.captchaIsResolved = true;
    }
  }
  setSubdomainValue(value:string){
    console.log("hello this is subv",value);
    let name = value.split(".flexyear.com")
    console.log("name",name);
    this.companyForm.get('subdomain').setValue(name[0]);
    this.subdomainSuggestions= [];
  }
}
// import { AbstractControl } from '@angular/forms';
// import { switchMap } from 'rxjs/operators';
// export function removeSpaces(control: AbstractControl) {
//   if (control && control.value && !control.value.replace(/\s/g, '-').length) {
//     control.setValue('-');
//   }
//   return null;
// }
// }
