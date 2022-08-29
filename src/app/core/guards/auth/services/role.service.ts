import { Injectable } from '@angular/core';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private authService:AuthService
  ) { }



// if it is admin
  public get admin():boolean{
    if(this.currentUserRoleValue == 'admin'){
      // return true
      return true;
    }
    else{
      //return false
      return false;

    }
  }


  public get superadmin():boolean{
    if(this.currentUserRoleValue == 'Super Admin'){
      // return true
      return true;
    }
    else{
      //return false
      return false;

    }
  }


  public get staff():boolean{
    if(this.currentUserRoleValue == 'staff'){
      // return true
      return true;
    }
    else{
      //return false
      return false;

    }
  }







  public get HR():boolean{
    if(this.currentUserRoleValue == 'HR'){
      // return true
      return true;
    }
    else{
      //return false
      return false;

    }
  }




  public get Manager():boolean{
    if(this.currentUserRoleValue == 'Manager'){
      // return true
      return true;
    }
    else{
      //return false
      return false;

    }
  }



  public get Accountant():boolean{
    if(this.currentUserRoleValue == 'accountant'){
      // return true
      return true;
    }
    else{
      //return false
      return false;

    }
  }


  public get currentUserRoleValue(): any {
    return this.authService.currentUserRoleSubject.value;
  }
}
