import { ConfirmationDialogComponent } from "./../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { HelperService } from "./../../../../../../shared/services/helper/helper.service";
import { GlobalService } from "./../../../../../../shared/services/global/global.service";
import { FormBuilder } from "@angular/forms";
import { ManageUserService } from "./../../../services/manage-user.service";

import {
  Component,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { State, SortDescriptor } from "@progress/kendo-data-query";
@Component({
  selector: "app-add-device-id",
  templateUrl: "./add-device-id.component.html",
  styleUrls: ["./add-device-id.component.scss"],
})
export class AddDeviceIdComponent implements OnInit {
  modalRef: BsModalRef;
  submitted: boolean;
  skip = 0;
  listLoading: boolean;
  editMode: boolean;
  modalTitle: any;
  selectedUserFullName: any;
  userDetail = this.manageUserService.getUserDetail();
  gridView: GridDataResult;
  constructor(
    private manageUserService: ManageUserService,
    private modalService: BsModalService,
    private toasterMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private helperService: HelperService
  ) {}
  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "device_name";
  search_key = "";
  search_value = "";
  ngOnInit() {
    this.getUserDeviceList();
  }

  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);

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

  dataStateChange(event): void {
    if (event.sort[0]) {
      this.sort = event.sort;
      if (event.sort[0].dir === "asc") {
        this.sortno = 2;
      } else {
        this.sortno = 1;
      }
      this.sortnane = event.sort[0].field;
    }

    // sorting logic ends here..

    if (event.skip == 0) {
      this.skip = event.skip;
      this.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;

      this.page = pageNo.toString();
    }

    // pagination logic ends here
    if (event.filter) {
      if (event.filter.filters[0]) {
        // search api call
        // this.paginationMode = false;
        const searchTerm = event.filter.filters[0].value;
        const searchField = event.filter.filters[0].field;
        this.search_value = searchTerm;
        this.search_key = searchField;
      } else {
        // normal api call
        // this.paginationMode = true;
        this.search_value = "";
        this.search_key = "";
      }
    }
    // search logic ends here
    this.getUserDeviceList();
  }

  //  get method
  getUserDeviceList(): void {
    this.listLoading = true;

    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
    };

    this.manageUserService.getUserDeviceList(params).subscribe(
      (response) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };

          return;
        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.listLoading = false;
      },
      () => {
        this.listLoading = false;
      }
    );
  }

  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  openAddModal(template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = false;
    this.modalTitle = "Add User Device";
    if (this.userDetail) {
      this.selectedUserFullName = this.getStaffFullNameWithEmpId(
        this.userDetail
      );
    }

    this.modalRef = this.modalService.show(template, this.config);
  }
  openViewModal() {}
  openEditModal(dataItem, template: TemplateRef<any>): void {}

  openConfirmationDialogue(userDevice): void {
    const departmentId = {
      id: userDevice.department_id,
    };

    this.modalRef = this.modalService.show(ConfirmationDialogComponent);
    this.modalRef.content.data = userDevice.department_name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        // this.deleteDepartmentById(JSON.stringify(departmentId));
      }
    });
  }

  onSave() {}

  getStaffFullNameWithEmpId(staff) {
    return this.helperService.getStaffFullName(staff);
  }
}
