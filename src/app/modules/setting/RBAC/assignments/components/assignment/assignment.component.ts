import { config } from "rxjs";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalService } from "@app/shared/services/global/global.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import {
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { State, process, SortDescriptor } from "@progress/kendo-data-query";
import { AssignmentService } from "../../services/assignment.service";
import { ManageUserService } from "@app/modules/staff/manage-user/services/manage-user.service";
import { HelperService } from "@app/shared/services/helper/helper.service";

@Component({
  selector: "app-assignment",
  templateUrl: "./assignment.component.html",
  styleUrls: ["./assignment.component.scss"],
})
export class AssignmentComponent implements OnInit {
  //Kendo Table
  listLoading: boolean;
  skip = 0;
  companyId;

  // sortDescriptor declaration for kendo grid
  gridView: GridDataResult;
  limit = this.globalService.pagelimit;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];
  public state: State = {
    skip: 0,
    take: 10,
    filter: {
      logic: "and",
      filters: [],
    },
  };

  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private assignmentService: AssignmentService,
    private toasterMessageService: ToastrMessageService
  ) {
    this.companyId = this.globalService.getCompanyIdFromStorage();
  }

  dataStateChange(event): void {
    // if (event.sort[0]) {
    //   this.sort = event.sort;
    //   if (event.sort[0].dir === "asc") {
    //     this.getBody.sortno = 2;
    //   } else {
    //     this.getBody.sortno = 1;
    //   }
    //   if (event.sort[0].field != "") {
    //     this.getBody.sortnane = event.sort[0].field;
    //   }
    // }

    // sorting logic ends here..

    if (event.skip == 0) {
      this.skip = event.skip;

      this.getBody.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;

      this.getBody.page = pageNo.toString();
    }

    // pagination logic ends here
    if (event.filter) {
      if (event.filter.filters[0]) {
        if (event.filter.filters[0].field == "staff_id") {
          this.getBody.search.staff_id = event.filter.filters[0].value;
        }
        if (event.filter.filters[0].field == "username") {
          this.getBody.search.username = event.filter.filters[0].value;
        }
      } else {
        this.getBody.search.staff_id = "";
        this.getBody.search.username = "";
      }
    }
    this.getUserList(this.getBody);

    // search logic ends here
  }

  ngOnInit() {
    this.getUserList(this.getBody);
  }
  getBody = {
    company_id: this.globalService.getCompanyIdFromStorage(),
    limit: this.globalService.pagelimit,
    page: this.globalService.pageNumber,
    sortno: 1,
    sortnane: "username",
    // status: "Active",
    search: {
      staff_id: "",
      username: "",
      status: "",
    },
  };
  pageLimit = parseInt(this.getBody.limit);

  getUserList(body) {
    this.listLoading = true;
    this.assignmentService.getUserList(body).subscribe(
      (response) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };
        } else {
          this.gridView = { data: [], total: 0 };
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

  navigateToRoleAssign(dataItem): void {
    this.router.navigate(["/staff/manage-user/assign-role", dataItem.user_id]);
  }
}
