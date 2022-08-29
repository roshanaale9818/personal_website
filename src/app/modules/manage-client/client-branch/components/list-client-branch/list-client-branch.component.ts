import { ClientBranchList } from "./../../modals/client-branch.modal";
import { CustomResponse } from "./../../../../../shared/models/custom-response.model";
import { ClientBranchService } from "./../../services/client-branch.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

import { GlobalService } from "@app/shared/services/global/global.service";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";

@Component({
  selector: "app-list-client-branch",
  templateUrl: "./list-client-branch.component.html",
  styleUrls: ["./list-client-branch.component.scss"],
})
export class ListClientBranchComponent implements OnInit {
  clientBranchForm: FormGroup;
  selectedclientBranch: ClientBranchList;
  submitted: boolean;
  editMode: boolean;
  submitButton: string;
  modalTitle: string;
  modalRef: BsModalRef;
  public gridView: GridDataResult;
  skip: 0;
  clientBranchDetail: ClientBranchList;
  language: any;
  companyId = this.globalService.getCompanyIdFromStorage();
  ClientBranchListLoading: boolean;
  public statusList = [
    { text: "Active", value: "Active" },
    { text: "Inactive", value: "Inactive" },
  ];
  public defaultItem: { text: string; value: number } = {
    text: "Select All",
    value: null,
  };
  constructor(
    private modalService: BsModalService,
    private clientBranchService: ClientBranchService,
    private fb: FormBuilder,

    private toasterMessageService: ToastrMessageService,
    private router: Router,
    private globalService: GlobalService,
  public authService:AuthService,
    private activatedRow:ActivatedRoute
  ) {}

  ngOnInit() {
    this.getClientBranchList();
    this.buildClientBranchForm();
  }

  buildClientBranchForm() {
    const clientBranch = this.selectedclientBranch;
    this.clientBranchForm = this.fb.group({
      title: [clientBranch ? clientBranch.title : "", Validators.required],
      details: [clientBranch ? clientBranch.details : ""],
      status: [
        clientBranch ? clientBranch.status : "Active",
        Validators.required,
      ],
      company_id: [""],
      id: [""],
    });
  }

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = "2";
  sortnane = "";
  search_key = "";
  search_value = "";
  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);
  //  get method
  getClientBranchList(): void {
    this.ClientBranchListLoading = true;

    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
      company_id: this.companyId,
    };

    this.clientBranchService.getClientBranchList(params).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };

          return;
        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.ClientBranchListLoading = false;
      },
      () => {
        this.ClientBranchListLoading = false;
      }
    );
  }

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

  // searchStatus(event) {
  //   console.log(event.value);
  //   this.search_key = "status";
  //   this.search_value = event.value;
  //   this.page = "''";
  //   if (event.value == null) {
  //     this.search_key = "";
  //     this.search_value = "";
  //   }
  //   this.skip = 0;
  //   this.getClientBranchList();
  // }

  dataStateChange(event) {
    if (event.sort[0]) {
      this.sort = event.sort;
      if (event.sort[0].dir === "asc") {
        this.sortno = "2";
      } else {
        this.sortno = "1";
      }
      this.sortnane = event.sort[0].field;
    }

    // sorting logic ends here..
    this.skip = event.skip;
    if (event.skip == 0) {
      // this.skip = event.skip;
      this.page = "1";
    } else {
      // this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;

      this.page = pageNo.toString();
    }

    // pagination logic ends here
    if (event.filter) {
      if (event.filter.filters[0]) {
        // search api call

        this.search_value = event.filter.filters[0].value;
        this.search_key = event.filter.filters[0].field;
      } else {
        // normal api call
        this.search_value = "";
        this.search_key = "";
      }
    }
    // search logic ends here
    this.getClientBranchList();
  }

  addClientBranch(body) {
    this.clientBranchService.addClientBranch(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Client Branch Added successfully"
          );

          this.modalRef.hide();

          this.getClientBranchList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  editClientBranch(body) {
    this.clientBranchService.editClientBranch(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Client Branch edited successfully"
          );

          this.modalRef.hide();

          this.getClientBranchList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  // delete method
  // id is sent in json formate not a number as per backend requirement
  deleteClientBranchById(id) {
    this.clientBranchService.deleteClientBranch(id).subscribe(
      (response: CustomResponse) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess(
            "Client Branch deleted sucessfully"
          );
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getClientBranchList();
      }
    );
  }

  onSubmitClientBranch() {
    this.submitted = true;

    if (this.clientBranchForm.invalid) return;
    this.clientBranchForm.patchValue({
      company_id: this.companyId,
    });
    this.modalRef.hide();
    if (this.editMode) {
      this.clientBranchForm.patchValue({
        id: this.selectedclientBranch.client_branch_id,
      });
      this.editClientBranch(this.clientBranchForm.value);
    } else {
      this.addClientBranch(this.clientBranchForm.value);
    }
  }

  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  openAddModal(template: TemplateRef<any>) {
    this.submitted = false;
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Client Branch";
    this.selectedclientBranch = null;
    this.buildClientBranchForm();
    this.clientBranchForm.valueChanges.subscribe((data) => {});
    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModel(clientBranch, template: TemplateRef<any>) {
    this.submitted = false;
    this.editMode = true;
    this.submitButton = "Edit";
    this.modalTitle = "Edit Client Branch";
    this.clientBranchService.setSelectedClientBranch(clientBranch);
    this.selectedclientBranch =
      this.clientBranchService.getSelectedClientBranch();
    this.buildClientBranchForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openViewModal(template: TemplateRef<any>, clientBranchDetail) {
    this.clientBranchDetail = clientBranchDetail;
    console.log(this.clientBranchDetail);
    this.modalRef = this.modalService.show(template, this.config);
  }

  openConfirmationDialogue(clientBranch: ClientBranchList) {
    const clientBranchId = {
      id: clientBranch.client_branch_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = clientBranch.title;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteClientBranchById(JSON.stringify(clientBranchId));
      }
    });
  }

  navigateToAddLocation(clientBranch: ClientBranchList) {
    // navigation code here
    // manage-client/client-branch/
    this.router.navigate([
      "add-location",
      clientBranch.client_branch_id,
    ],{
      relativeTo:this.activatedRow
    });
  }
}
