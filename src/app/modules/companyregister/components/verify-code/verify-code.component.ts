import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyregisterService } from '../../services/companyregister.service';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';
import { CustomResponse } from '@app/shared/models/custom-response.model';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent implements OnInit {
verifyForm:FormGroup;
  constructor(
    private fb:FormBuilder,
    private companyRegisterService:CompanyregisterService,
    private toastrMessageService:ToastrMessageService,
    private cookieService:CookieService,
    private activateRoute:ActivatedRoute,
    private router:Router
  ) { }
  accessToken:string;

verificationStatus:boolean ;
  getActivatedStatus(token){


    this.companyRegisterService.getCompanyActivatedStatus(token).subscribe((res:CustomResponse)=>{
      // console.log("resssssadsdsa",res);
      if(res.status){
        this.toastrMessageService.showSuccess(res.detail);
        this.verificationStatus = true;
        this.routeToLogin();
      }
      else{
        this.toastrMessageService.showError(res.data);
        this.verificationStatus = false;
      }
    })
  }
  routeToLogin(){
    this.router.navigate(['/login']);
  }
  ngOnInit() {
    console.log("activateRoute",this.activateRoute.queryParams);
    this.activateRoute.queryParams.subscribe((res)=>{
      console.log("res this",res);
      if(res['verify_code']){
      this.getActivatedStatus((res['verify_code']))
      }
    })
    this.buildVerificationForm();
    console.log("this cokkied",this.cookieService.getAll())
  }
  buildVerificationForm(){
    this.verifyForm = this.fb.group({
      verify_code:["",Validators.required],
      company_id:[]
    })
  }
  verifyCode(){
    if(this.verifyForm.invalid) return;
    this.companyRegisterService.verifyCompany(this.verifyForm.value).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.toastrMessageService.showSuccess("Company verified successfully.")
      }
      else{
        this.toastrMessageService.showError(res.data)
      }
    })
  }

}
