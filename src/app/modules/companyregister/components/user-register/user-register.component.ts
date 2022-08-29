import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomResponse } from '@app/shared/models/custom-response.model';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';
import { CookieService } from 'ngx-cookie-service';
import { CompanyregisterService } from '../../services/companyregister.service';
import { ConfirmedValidator } from '../../validators/confirm.password.validator';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {

  constructor(
    private fb:FormBuilder,
    private cookieService:CookieService,
    private toasterMessageService:ToastrMessageService,
    private companyRegisterService:CompanyregisterService
  ) { }

  ngOnInit() {
    this.buildCompanyUserForm();
  }
  userCredentialsForm:FormGroup;
  buildCompanyUserForm(response?:any) {
    this.userCredentialsForm = this.fb.group({
      username: ["", [Validators.required]],
      staff_id: [response?response.staff_id:""],
      password: ["", [Validators.required]],
      verify_password: ["", [Validators.required,
       ]],
       access_token:[""],
      // access_level: [1],
      // role: [1],
      company_id: [response?response.data.company_id:""],
      // user_id: [""],
    },
    {validators:ConfirmedValidator("password","verify_password")}
    );
    // CustomValidators.matchValues('password')
    // this.userCredentialsForm.get('verify_password').valueChanges.subscribe((re)=>{
    //   console.log("Err",this.userCredentialsForm.get('verify_password'),re)
    // })
  }
  onCancelUserRegister(){
   this.buildCompanyUserForm();
  }
  onSaveUser(){
    console.log("begin",this.userCredentialsForm)
    if(this.userCredentialsForm.invalid){return}

    else{
      // this.saveAndLoginDisable = true;
      this.userCredentialsForm.get("access_token").setValue(
        this.cookieService.get('access_token')
      )

      console.log("success",this.userCredentialsForm)
      this.companyRegisterService.userRegister(this.userCredentialsForm.value).subscribe((res:CustomResponse)=>{
        if(res.status){
          this.toasterMessageService.showSuccess("User created successfully.");
          // this.backToLogin();



        }
        else{
          this.toasterMessageService.showError(res.data);
        }
      })
    }
  }

}
