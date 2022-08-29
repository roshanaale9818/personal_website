import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RolesService } from "../../services/roles.service";
import { Subject } from "rxjs";
import { GlobalService } from "@app/shared/services/global/global.service";
import { takeUntil } from "rxjs/operators";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { Route } from "./../../modals/route.interface";

@Component({
  selector: "app-view-roles",
  templateUrl: "./view-roles.component.html",
  styleUrls: ["./view-roles.component.scss"],
})
export class ViewRolesComponent implements OnInit {
  candidatePoolLoading: boolean;
  noResult: boolean;
  fieldSearchTerm: any;
  selectedSearchTerm: any;
  listLoading: boolean;

  selectedRoles;
  RolesForm: FormGroup;
  companyId: any;
  constructor(
    private rolesService: RolesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private globalService: GlobalService,
    private activeRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private tostrService: ToastrMessageService
  ) {
    this.companyId = this.globalService.getCompanyIdFromStorage();
    this.roleId = this.activeRoute.snapshot.params["id"];
  }
  roleId;
  ngOnInit() {
    this.getRolesList();
    this.buildRolesForm();
    this.getRoleDetail();
    this.getRoleRoutes();
    this.getAllMenusList();
    // this.routeListRefesh();
  }

  getRolesList() {
    this.selectedRoles = this.rolesService.getRolesList();
    return this.selectedRoles;
  }

  navigateToEditRoles(roles): void {
    this.router.navigate(["/rbac/roles/edit", roles.id]);
  }

  buildRolesForm(): void {
    this.RolesForm = this.formBuilder.group({
      name: [
        this.selectedRoles ? this.selectedRoles.name : "",
        [Validators.required],
      ],
      description: [this.selectedRoles ? this.selectedRoles.description : ""],
    });
  }
  getRoleDetail() {
    this.rolesService
      .getRoleByName(this.companyId, this.roleId)
      .pipe(takeUntil(this.ngDestroy))
      .subscribe((res: any) => {
        if (res.status) {
          this.selectedRoles = res.data[0];
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
  routeArray: any[] = [];

  assignRoute() {
    if (this.selectedRoute) {
      let routeObj = {
        role_name: this.roleId,
        route: this.selectedRoute,
      };
      this.routeArray.push(routeObj);
      this.saveRoute(this.routeArray);
    }
  }
  saveRoute(dataArr: any) {
    let body = {
      access_token:
        this.localStorageService.getLocalStorageItem("flexYear-token"),
      company_id: +this.companyId,
      data: dataArr,
      //static hello route now
    };
    this.rolesService
      .assignRoute(body)
      .pipe(takeUntil(this.ngDestroy))
      .subscribe((res: any) => {
        if (res.status) {
          this.tostrService.showSuccess("Route is assigned successfully");
          this.routeListRefesh();
        }
      });
  }
  removeRoute() {
    let route = this.assignedRouteList.filter(
      (x) => x.child == this.selectedRoute
    )[0];
    if (this.selectedRoute && route != null) {
      let body = {
        access_token:
          this.localStorageService.getLocalStorageItem("flexYear-token"),
        role_name: this.roleId,
        company_id: +this.companyId,
        //static hello now
        route: this.selectedRoute,
      };
      this.rolesService
        .removeRoute(body)
        .pipe(takeUntil(this.ngDestroy))
        .subscribe((res: any) => {
          if (res.status) {
            this.tostrService.showWarning("Route is removed successfully");
            this.routeListRefesh();
          }
        }),(err)=>{
          console.log(err)
        }
        ,()=>{
          // this.routeListRefesh();
        };
    }
  }

  //role wise menu lists
  assignedRouteList: any[] = [];
  getRoleRoutes() {
    this.rolesService
      .getRoleRoute(this.roleId, this.companyId)
      .pipe(takeUntil(this.ngDestroy))
      .subscribe((res: any) => {
        if (res.status) {
          // console.log(res);
          this.assignedRouteList = res.data;
          // console.log(this.assignedRouteList, "Assigned Route List");
        } else {
          this.assignedRouteList = []
          this.tostrService.showError("There are no assigned route list");
        }
      });
  }
  allRouteList: Route[] = [];
  //get all menus list
  getAllMenusList() {
    this.rolesService
      .getAllMenus(this.companyId)
      .pipe(takeUntil(this.ngDestroy))
      .subscribe((res: any) => {
        if (res.status) {
          this.allRouteList = res.data;
          // console.log(this.allRouteList, "Route List");
          this.initRouteList();
          setTimeout(() => {
            this.filterRouteForTemplate();
          }, 500);
        } else {
          this.allRouteList = [];
        }
      });
  }
  selectedRoute: string;
  selectRoute(route) {
    this.selectedRoute = route;
    // console.log("selectRouite", this.selectedRoute);
  }

  filterRouteForTemplate() {
    if (this.assignedRouteList && this.allRouteList) {
      this.allRouteList.forEach((x) => {
        this.assignedRouteList.forEach((y) => {
          if (x.angular_route == y.child) {
            x.show = false;
          }
        });
      });
    }
  }
  routeListRefesh() {
    this.getRoleRoutes();
    this.getAllMenusList();
    this.selectedRoute = null;
  }

  initRouteList() {
    this.allRouteList.forEach((x) => {
      x.show = true;
    });
  }
}
