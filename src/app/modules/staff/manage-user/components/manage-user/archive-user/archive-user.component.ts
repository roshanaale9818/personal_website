import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ManageUserService } from "../../../services/manage-user.service";
import { BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "../../../../../../shared/services/toastr-message/toastr-message.service";
import { GlobalService } from "../../../../../../shared/services/global/global.service";
import { HelperService } from "../../../../../../shared/services/helper/helper.service";
import { Router } from "@angular/router";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import { CustomResponse } from "@app/shared/models/custom-response.model";

@Component({
  selector: "app-archive-user",
  templateUrl: "./archive-user.component.html",
  styleUrls: ["./archive-user.component.scss"],
})
export class ArchiveUserComponent implements OnInit {
  companyId = this.globalService.getCompanyIdFromStorage();
  listLoading: boolean;
  skip: any;
  archiveSearchForm: FormGroup;

  // state declaration for kendo grid
  public state: State = {
    skip: 0,
    take: 10,
    filter: {
      logic: "and",
      filters: [],
    },
  };
  // sortDescriptor declaration for kendo grid
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];

  constructor(
    private fb: FormBuilder,
    private manageUserService: ManageUserService,
    private toasterMessageService: ToastrMessageService,
    private globalService: GlobalService,
    private helperService: HelperService
  ) {
    // this.getStaffList();
  }

  ngOnInit() {
    this.getArchiveUserList(this.getBody);
    this.buildArchiveUserForm();
    this.getUserLists();
  }

  buildArchiveUserForm() {
    this.archiveSearchForm = this.fb.group({
      staff_id: "",
      username: "",
    });
  }

  collapseButton: any;
  isCollapsed: boolean = true;
  collapsed(): void {
    this.collapseButton = "Search Employee";
  }

  expanded(): void {
    this.collapseButton = "Hide Search Bar";
  }

  changeEmp() {
    console.log(this.archiveSearchForm.value, "1");
    if (this.archiveSearchForm.value.staff_id == null) {
      this.archiveSearchForm.controls["staff_id"].setValue("");
    }
    if (this.archiveSearchForm.value.username == null) {
      this.archiveSearchForm.controls["username"].setValue("");
    }
  }

  userLists;
  getUserLists(): void {
    this.manageUserService.getUserLists().subscribe((response:CustomResponse) => {
      this.userLists = response.data;
      this.staffList = response.data;
    });
  }

  limit = this.globalService.pagelimit;
  getBody = {
    company_id: this.companyId,
    limit: this.globalService.pagelimit,
    page: this.globalService.pageNumber,
    sortno: 1,
    sortnane: "username",
    search: {
      staff_id: "",
      username: "",
      status: "Inactive",
    },
  };

  onSearchStaff(): void {
    this.getBody.search.staff_id = this.archiveSearchForm.value.staff_id;
    this.getBody.search.username = this.archiveSearchForm.value.username;
    this.getArchiveUserList(this.getBody);
  }

  onCancel(): void {
    const getBody = {
      company_id: this.companyId,
      limit: this.globalService.pagelimit,
      page: this.globalService.pageNumber,
      sortno: 1,
      sortnane: "username",
      search: {
        staff_id: "",
        username: "",
        status: "Inactive",
      },
    };
    this.isCollapsed = true;
    this.state.skip = 0;
    this.skip = 0;
    this.buildArchiveUserForm();
    this.getArchiveUserList(getBody);
  }

  pageLimit = parseInt(this.getBody.limit);

  userList: GridDataResult;

  getStaffFullNameWithEmpId(staff) {
    return this.helperService.getStaffFullName(staff);
  }

  staffList;
  getStaffList() {
    this.manageUserService.getStaffList().subscribe((response) => {
      if (response.status) {
        this.staffList = response.data;
      }
    });
  }

  archiveUserList;
  getArchiveUserList(body) {
    this.listLoading = true;
    this.manageUserService.getUserList(body).subscribe(
      (response) => {
        console.log(response);
        if (response.status) {
          console.log(response);
          this.archiveUserList = response.data;
          this.userList = { data: response.data, total: response.count };
        } else {
          this.userList = { data: [], total: 0 };
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
        if (event.filter.filters[0].field == "username") {
          this.getBody.search.username = event.filter.filters[0].value;
        }
      } else {
        this.getBody.search.username = "";
      }

      this.getArchiveUserList(this.getBody);
    }
    // search logic ends here
  }

  changeStatus(event, dataItem) {
    const body = {
      user_id: dataItem.user_id,
      status: event == true ? "Active" : "Inactive",
    };
    this.manageUserService.changeStatus(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("Status Changed Successfully");

          this.getArchiveUserList(this.getBody);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
}
