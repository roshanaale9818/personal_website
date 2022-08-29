export interface RequestForgotPassword{
company_id:number;
email:string;
}
export interface ResetPassword{
  reset_token:string;
  password:string;
  password_repeat:string;
  company_id:string;
}
