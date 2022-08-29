import { Router, ActivatedRoute } from "@angular/router";
import { ConfirmationDialogComponent } from "./../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { HelperService } from "./../../../../../../shared/services/helper/helper.service";
import { GlobalService } from "./../../../../../../shared/services/global/global.service";
import { FormBuilder } from "@angular/forms";
import { ManageUserService } from "./../../../services/manage-user.service";

import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";

@Component({
  selector: "app-assign-role",
  templateUrl: "./assign-role.component.html",
  styleUrls: ["./assign-role.component.scss"],
})
export class AssignRoleComponent implements OnInit {
  submitted: boolean;
  skip = 0;
  listLoading: boolean;
  user_id = this.activatedRoute.snapshot.params.id;
  constructor(
    private manageUserService: ManageUserService,
    private modalService: BsModalService,
    private toasterMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private helperService: HelperService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  userDetail = this.manageUserService.getUserDetail();
  selectedUserFullName = this.userDetail
    ? this.getStaffFullNameWithEmpId(this.userDetail)
    : "";

  userRoleList: any;

  ngOnInit() {
    // if (!this.userDetail) {
    //   this.router.navigate(["/staff/manage-user/"]);
    // }
    this.getRoleswithAssignment();
  }

  // two apis merged with forkJoin...
  getRoleswithAssignment() {
    this.listLoading = true;
    this.manageUserService.getRoleswithAssignment(this.user_id).subscribe(
      (response) => {
        // response[0] is the assigned role list from assignment api
        // response[1] is the all available role list from roles api
        let assignedRoles = response[0].data;
        let availableRoles = response[1].data;
        console.log("assignedRoles",assignedRoles);
        console.log("availableRoles",availableRoles)
        for (let i = 0; i < availableRoles.length; i++) {
          for (let j = 0; j < assignedRoles.length; j++) {
            if (availableRoles[i].name == assignedRoles[j].item_name) {
              availableRoles[i]["roleAssigned"] = "true";
              break;
            } else {
              availableRoles[i]["roleAssigned"] = "false";
            }
          }
        }
        this.userRoleList = response[1].data;
        // this.userRoleList = []
        // this.userRoleList = availableRoles;
        // console.log("userRoleList",this.userRoleList);

        return;
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.listLoading = false;
      }
    );
  }

  roleAssignToUser(body) {
    this.manageUserService.assignRoleToUser(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("Role Assigned Successfully");
          this.getRoleswithAssignment();
        }
        else{
          this.toasterMessageService.showError(response.data);
          // this.getRoleswithAssignment();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.listLoading = false;
      }
    );
  }

  removeRoleFromUser(body) {
    this.manageUserService.removeRoleFromUser(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("Role Removed Successfully");
          this.getRoleswithAssignment();
        }
          else{
          this.toasterMessageService.showError(response.data);
          // this.getRoleswithAssignment();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.listLoading = false;
      }
    );
  }

  changeAssignment(event, dataItem) {
    let body = {
      user_id: this.user_id,
      name: "",
      company_id: this.globalService.getCompanyIdFromStorage(),
    };
    if (event == true) {
      body.name = dataItem.name;
      this.roleAssignToUser(body);
    } else {
      body.name = dataItem.name;
      this.removeRoleFromUser(body);
    }
  }

  getStaffFullNameWithEmpId(staff) {
    return this.helperService.getStaffFullName(staff);
  }
}
