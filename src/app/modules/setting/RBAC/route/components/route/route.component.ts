import { process, SortDescriptor, State } from "@progress/kendo-data-query";
import {
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { ToastrMessageService } from "./../../../../../../shared/services/toastr-message/toastr-message.service";
import { RouteService } from "./../../services/route.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GlobalService } from "@app/shared/services/global/global.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";

@Component({
  selector: "app-route",
  templateUrl: "./route.component.html",
  styleUrls: ["./route.component.scss"],
})
export class RouteComponent implements OnInit {
  loading: boolean;
  routeList: any[] = [];
  skip = 0;
  public state: State = {
    skip: 0,
    take: 10,
    filter: {
      logic: "and",
      filters: [],
    },
  };
  //sortDescriptor declaration for kendo grid
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];
  gridView: GridDataResult;
  routeForm: FormGroup;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  // API properties
  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortnane = "name";

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private modalService: BsModalService,
    private routeService: RouteService,
    private toastrMessageService: ToastrMessageService
  ) {}

  ngOnInit() {
    this.buildRouteForm();
    this.getRouteLists(this.getRoute);
    this.getMenuList();
  }

  buildRouteForm(): void {
    this.routeForm = this.formBuilder.group({
      company_id: this.globalService.getCompanyIdFromStorage(),
      id: [this.selectedRoute ? this.selectedRoute.id : ""],
      route: [this.selectedRoute ? this.selectedRoute.route : ""],
      name: [
        this.selectedRoute ? this.selectedRoute.name : "",
        [Validators.required],
      ],
      icon: [this.selectedRoute ? this.selectedRoute.icon : ""],
      parent: [this.selectedRoute ? Number(this.selectedRoute.parent) : ""],
      order: [this.selectedRoute ? this.selectedRoute.order : ""],
      data: [this.selectedRoute ? this.selectedRoute.data : ""],
      angular_route: [
        this.selectedRoute ? this.selectedRoute.angular_route : "",
      ],
      rbac_check: [this.selectedRoute ? this.selectedRoute.rbac_check : ""],
    });
  }

  getRoute = {
    limit: "15",
    page: this.globalService.pageNumber,
    sortnane: "name",
    sortno: 1,
    company_id: this.globalService.getCompanyIdFromStorage(),
    search: {
      icon: "",
      name: "",
      parent: "",
      route: "",
      angular_route: "",
      order: "",
      data: "",
    },
  };

  pageLimit = parseInt(this.getRoute.limit);

  dataStateChange(event): void {
    if (event.sort[0]) {
      this.sort = event.sort;
      // if (event.sort[0].dir === "asc") {
      //   this.getRoute.sortno = 2;
      // } else {
      //   this.getRoute.sortno = 1;
      // }
      // if (event.sort[0].field != "") {
      //   this.getRoute.sortnane = event.sort[0].field;
      // }
    }

    // sorting logic ends here..

    if (event.skip == 0) {
      this.skip = event.skip;

      this.getRoute.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;

      this.getRoute.page = pageNo.toString();
    }

    // pagination logic ends here
    // if (event.filter) {
    //   if (event.filter.filters[0]) {
    //     if (event.filter.filters[0].field == "name") {
    //       this.getRoute.search.name = event.filter.filters[0].value;
    //     }
    //     if (event.filter.filters[0].field == "angular_route") {
    //       this.getRoute.search.angular_route = event.filter.filters[0].value;
    //     }
    //   } else {
    //     this.getRoute.search.name = "";
    //     this.getRoute.search.angular_route = "";
    //   }
    // }
    this.getRouteLists(this.getRoute);
    // search logic ends here
  }

  selectedRoute;
  clearModal(): void {
    this.selectedRoute = null;
    this.buildRouteForm();
  }

  setRoute(dataItem): void {
    this.selectedRoute = dataItem;
    this.buildRouteForm();
  }

  menuList: any[] = [];
  getMenuList(): void {
    this.routeService.getMenuList().subscribe((response) => {
      if (response.status) {
        // console.log("menulist",response
        this.menuList = response.data;
      } else {
        this.menuList = [];
      }
    });
  }

  getRouteLists(body): void {
    this.loading = true;

    this.routeService.getRouteList(body).subscribe(
      (response) => {
        if (response.status) {
          this.routeList = response.data;
          this.gridView = { data: response.data, total: response.count };
        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  openModal(dataItem): void {
    this.selectedRoute = dataItem;
    this.buildRouteForm();
  }

  addRoute(): void {
    this.globalService.markAsTouched(this.routeForm);
    if (this.routeForm.invalid || this.routeForm.pristine) return;

    this.routeService
      .addRouteList(this.routeForm.value)
      .subscribe((response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess("Route is added successfully.");
          this.getRouteLists(this.getRoute);
          this.buildRouteForm();
        } else {
          this.toastrMessageService.showError("Route cannot be added.");
        }
      });
  }

  updateRoute(): void {
    if (this.routeForm.invalid || this.routeForm.pristine) return;

    this.routeService
      .updateRouteList(this.routeForm.value)
      .subscribe((response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Route is updated successfully"
          );
          this.getRouteLists(this.getRoute);
        } else {
          this.toastrMessageService.showError("Route cannot be updated.");
        }
      });
  }

  deleteRoutes(dataItem): void {
    const params = {
      id: dataItem.id,
    };
    this.routeService.deleteRouteList(params).subscribe((response) => {
      if (response.status) {
        this.toastrMessageService.showSuccess(
          "Selected Route is deleted successfully"
        );
        this.getRouteLists(this.getRoute);
      } else {
        this.toastrMessageService.showError("Route cannot be deleted.");
      }
    });
  }
}
