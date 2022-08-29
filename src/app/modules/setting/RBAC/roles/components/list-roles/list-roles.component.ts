import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { GlobalService } from "@app/shared/services/global/global.service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";

import {
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { State, process } from "@progress/kendo-data-query";
import { Role } from "../../modals/role.interface";
import { RolesService } from "../../services/roles.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";

@Component({
  selector: "app-list-roles",
  templateUrl: "./list-roles.component.html",
  styleUrls: ["./list-roles.component.scss"],
})
export class ListRolesComponent implements OnInit {
  rolesForm: FormGroup;
  flexyearLoading: boolean;

  // Kendo Table
  rolesList: Role[] = [];
  public state: State = {
    skip: 0,
    take: 10,
    //initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
    sort: [{ dir: "desc", field: "Roles" }],
  };
  public gridView: GridDataResult = process(this.rolesList, this.state);
  companyId: any;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private rolesService: RolesService,
    private globalService: GlobalService,
    private localStorageService: LocalStorageService,
    private toastRMessageService: ToastrMessageService
  ) {
    this.companyId = this.globalService.getCompanyIdFromStorage();
  }

  ngOnInit() {
    this.buildRolesForm();
    this.getAllRolesList();
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.rolesList, this.state);
  }

  // navigateToAddRoles(): void {
  //   this.router.navigate(["setting/rbac/roles/add"]);
  // }

  navigateToUpdateRoles(roles): void {
    this.rolesService.setRolesList(roles);
    this.router.navigate(["setting/rbac/roles/edit", roles.name]);
  }

  navigateToViewRoles(roles): void {
    this.rolesService.setRolesList(roles);
    this.router.navigate(["setting/rbac/roles/view", roles.name]);
  }

  buildRolesForm(): void {
    this.rolesForm = this.formBuilder.group({
      name: [
        this.selectedRole ? this.selectedRole.name : "",
        [Validators.required],
      ],
      description: [this.selectedRole ? this.selectedRole.description : ""],
    });
  }

  selectedRole: any;
  clearModal(): void {
    this.selectedRole = null;
    this.isEdit=false;
    this.submitted = false;
    this.buildRolesForm();
  }
  submitted:boolean = false;
  addRole() {
    this.submitted = true;
    if (this.rolesForm.invalid) return;
    let body = {
      access_token:
        this.localStorageService.getLocalStorageItem("flexYear-token"),
      name: this.rolesForm.value.name,
      description: this.rolesForm.value.description,
      company_id: +this.companyId,
    };
    this.flexyearLoading = true;
    this.rolesService
      .addRole(body)
      .pipe(takeUntil(this.ngDestroy))
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.status) {
            this.flexyearLoading = false;
            this.toastRMessageService.showSuccess(
              "Roles has been successfully added."
            );
            this.getAllRolesList();
          } else {
            this.flexyearLoading = false;
          }
        },
        (err) => {
          this.flexyearLoading = false;
        }
      );
  }

  deleteRoles(role) {
    let body = {
      name: role.name,
      access_token:
        this.localStorageService.getLocalStorageItem("flexYear-token"),
      company_id: this.companyId,
    };
    this.rolesService
      .removeRole(body)
      .pipe(takeUntil(this.ngDestroy))
      .subscribe((res: any) => {
        if (res.status) {
          this.toastRMessageService.showSuccess("Deleted successfully.");
          this.getAllRolesList();
        } else {
          this.toastRMessageService.showError(res.data);
        }
      });
  }

  openModal(data) {
    this.selectedRole = data;
    this.isEdit = true;
    this.buildRolesForm();
  }
  isEdit:boolean=false;
  updateRole() {
    if (this.rolesForm.invalid || this.rolesForm.pristine) return;
    let bodyObj = {
      access_token:
        this.localStorageService.getLocalStorageItem("flexYear-token"),
      name: this.rolesForm.value.name,
      description: this.rolesForm.value.description,
      company_id: +this.companyId,
    };
    this.rolesService
      .editRole(bodyObj)
      .pipe(takeUntil(this.ngDestroy))
      .subscribe((res: any) => {
        if (res.status) {
          this.toastRMessageService.showSuccess(res.detail);
          this.getAllRolesList();
        } else {
          this.toastRMessageService.showError(res.detail);
        }
      });
  }

  //get all roles list
  getAllRolesList() {
    this.flexyearLoading = true;
    this.rolesService.getAllRolesList(this.companyId).subscribe((res: any) => {
      if (res.status) {
        this.rolesList = res.data;
        this.gridView = process(this.rolesList, this.state);
        this.flexyearLoading = false;
      } else {
        this.flexyearLoading = false;
      }
    });
  }
  ngDestroy = new Subject();
  //handling all subscription with
  //subject and rxjs takeUntil operator
  ngOnDestroy() {
    this.ngDestroy.next(true);
    this.ngDestroy.complete();
  }
}
