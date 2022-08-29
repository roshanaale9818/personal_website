import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
// import { AuthService } from '@app/core/guards/auth/services/auth-service.service';
import { FooterComponent } from '@app/core/layout/admin-panel/footer/footer.component';
import { LoginConst } from '@app/modules/auth/login/constants/login.constant';
import { LoginService } from '@app/modules/auth/login/services/login.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';
import { TabsetComponent } from 'ngx-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { environment } from "@env/environment";
import { CustomResponse } from '@app/shared/models/custom-response.model';
import { ForgotpasswordService } from '../../services/forgotpassword.service';
import { RequestForgotPassword, ResetPassword } from '../modal/requestforgetpassword.interface';
import { ConfirmedValidator } from '@app/modules/companyregister/validators/confirm.password.validator';
import { CustomValidators } from '@app/shared/directives/validators/CustomValidators';
// import { Subject } from 'rxjs';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  @ViewChild("loginTabs", { static: false }) tabset: TabsetComponent;
  loginConst = LoginConst;
  entryComponent = FooterComponent;
  activeTab: string;

  showTimerSection: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
private forgotService:ForgotpasswordService,
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    private cookieService: CookieService,
    private globalService:GlobalService
  ) {
    // this.subdomain
    this.activatedRoute.queryParams.subscribe((params) => {
      if(params){
        this.id = params.id?params.id:null;
        console.log("id",this.id)
        this.reset_token = params.reset_token;
        if(this.reset_token){
          this.showPasswordForm = true;
          this.buildForgotForm('password')
          // this.forgotForm.get('email').setValidators([]);
          // this.forgotForm.get('password').setValidators(Validators.required);
          // this.forgotForm.
        }
      }
    });

  }
  reset_token:string = '';
  domainUrl: any;
  subdomain: string;
  ngOnInit() {
  if(this.showPasswordForm == true){
    this.buildForgotForm('password');
  }
  else{
    this.buildForgotForm();
  }
    const parsedUrl = new URL(window.location.href);
    this.domainUrl = parsedUrl.host.split(".")
    this.subdomain = this.domainUrl ? this.domainUrl[0] : '';

    this.subdomain ? this.getCompanyDetail("b5dd-27-34-104-219") : null;
    // this.getCompanyDetail("b5dd-27-34-104-219");

  }
  showPasswordForm:boolean = false;
  imageUrl = environment.baseImageUrl;
  companyDetailObj: any;
  getCompanyDetail(domain) {
    this.forgotService.getCompanyDetail(domain).subscribe((res: any) => {
      // console.log(res);
      // console.log("companyDetail by subdomaiun is", res);
      if (res.status) {
        this.companyDetailObj = res;
        this.globalService.companyName.next(this.companyDetailObj ? this.companyDetailObj.comapny.company_name : null)
        this.cookieService.set("company_name",this.companyDetailObj ? this.companyDetailObj.comapny.company_name : null);
        this.cookieService.set('company_id',this.companyDetailObj.comapny.company_id)
      }
      // console.log("this is companyDetailOj",this.companyDetailObj)

  }
    )
}
submitted:boolean = false;


id:string | number;
  ngAfterViewInit(): void {

  }

  get passwordValidationMessage() {
    // get error from the formcontrol
    let errorsObj = this.forgotForm.controls['password'].errors;
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

  forgotForm:FormGroup;
  buildForgotForm(password?:string){
    this.forgotForm = this.formBuilder.group({
      email:[
        '',
      password? null:  Validators.compose(
        [
          Validators.email,
          Validators.required
        ]

      )
      ],
      password:[
        '',
        password ? Validators.compose([
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
        ]):null
      ],
      confirm_password:[
        '', password ? Validators.required:[]
      ]

    },
    password?
    { validators: ConfirmedValidator("password", "confirm_password") }:null

    )
  }

  onSubmit(){
    this.submitted= true;
    if(this.forgotForm.invalid) return;
    console.log(this.forgotForm.value)
    if(!this.showPasswordForm){
      this.sendVerificationEmail();
    }
   else if(this.showPasswordForm){
          // console.log("sending")
          this.resetpassword();
    }

  }
  sendVerificationEmail(){
    let request:RequestForgotPassword = {
      email:this.forgotForm.get('email').value,
      company_id:+this.cookieService.get('company_id')
    }
    this.forgotService.sendVerificationEmail(request).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.toastrMessageService.showSuccess(res.response);
      }
      else{
        for(let x in res.data){
          this.toastrMessageService.showError(res.data[x]);
        }
      }
    })
  }

  resetpassword(){
  let resetPassword:ResetPassword = {
    company_id:this.cookieService.get('company_id'),
    password:this.forgotForm.get('password').value,
    password_repeat:this.forgotForm.get('confirm_password').value,
    reset_token:this.reset_token
  }
  this.forgotService.changePassword(resetPassword).subscribe((res:CustomResponse)=>{
    if(res.status){
      this.toastrMessageService.showSuccess(res.data);
      this.router.navigate(['login']);
    }
    else{
      this.toastrMessageService.showError(res.data);
    }
  })
  }




}
