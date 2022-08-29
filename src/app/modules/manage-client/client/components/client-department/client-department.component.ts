import { ConfirmationDialogComponent } from "./../../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { Router, ActivatedRoute } from "@angular/router";
import { ClientService } from "./../../client.service";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { GlobalService } from "./../../../../../shared/services/global/global.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import { CustomResponse } from "@app/shared/models/custom-response.model";

@Component({
  selector: "app-client-department",
  templateUrl: "./client-department.component.html",
  styleUrls: ["./client-department.component.scss"],
})
export class ClientDepartmentComponent implements OnInit {
  modalRef: BsModalRef;
  clientDepartmentForm: FormGroup;
  regexconstant = RegexConst;
  companyId = this.globalService.getCompanyIdFromStorage();
  listLoading: boolean;
  skip = 0;
client_id;
  editMode: boolean;
  submitButton: any;
  modalTitle: any;
  selectedDepartment: any;
  constructor(
    private modalService: BsModalService,
    private toasterMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private clientService: ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.parent.params.subscribe((data:any)=>{
      this.client_id = data['id'];

    })
  }

  gridView: any;

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";

  getBody = {
    company_id: this.companyId,
    limit: this.limit,
    sortno: this.sortno,
    sortnane: this.sortnane,
    page: this.page,
    search: {
      name: "",
      details: "",
      status: "",
      client_id: this.activatedRoute.parent.snapshot.params.id,
    },
  };
  pageLimit = parseInt(this.limit);

  ngOnInit() {
    this.getClientDepartment(this.getBody);
    this.buildClientDepartmentForm();
  }

  buildClientDepartmentForm() {

    this.clientDepartmentForm = this.fb.group({
      name: [
        this.selectedDepartment ? this.selectedDepartment.name : "",
        Validators.required,
      ],
      details: [this.selectedDepartment ? this.selectedDepartment.details : ""],
      status: [this.selectedDepartment ? this.selectedDepartment.status : "1"],
      // client_id: [this.activatedRoute.snapshot.params.id],
      client_id: [this.client_id],
      company_id: [this.companyId],
      id: [""],
    });
  }

  getClientDepartment(body) {
    this.clientService.getClientsDeparment(body).subscribe(
      (response: CustomResponse) => {
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
        this.getBody.sortno = 2;
      } else {
        this.getBody.sortno = 1;
      }
      this.getBody.sortnane = event.sort[0].field;
    }

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
        // search api call

        if (event.filter.filters[0].field == "name") {
          this.getBody.search.name = event.filter.filters[0].value;
        }
        if (event.filter.filters[0].field == "details") {
          this.getBody.search.details = event.filter.filters[0].value;
        }
        if (event.filter.filters[0].field == "status") {
          this.getBody.search.status = event.filter.filters[0].value;
        }
      } else {
        // normal api call

        this.getBody.search.details = "";
        this.getBody.search.name = "";
        this.getBody.search.status = "";
      }
    }
    // search logic ends here
    this.getClientDepartment(this.getBody);
  }

  addClientDepartment(body) {
    this.clientService.addClientDepartment(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Client Department Added successfully"
          );

          this.modalRef.hide();

          this.getClientDepartment(this.getBody);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  editClientDepartment(body): void {
    if (this.clientDepartmentForm.pristine) {
      this.modalRef.hide();
      return;
    }
    this.clientService.editClientDepartment(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Department edited successfully"
          );

          this.modalRef.hide();

          this.getClientDepartment(this.getBody);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  deleteClientDepartmentById(id) {
    this.clientService.deleteClientDepartment(id).subscribe(
      (response) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess(
            "Department Deleted Sucessfully"
          );
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getClientDepartment(this.getBody);
      }
    );
  }
  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  openConfirmationDialogue(dataItem) {
    const clientDepartmentId = {
      id: dataItem.client_department_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = dataItem.name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteClientDepartmentById(JSON.stringify(clientDepartmentId));
      }
    });
  }

  openAddModal(template: TemplateRef<any>): void {
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Department";
    this.selectedDepartment = null;
    this.buildClientDepartmentForm();
    this.modalRef = this.modalService.show(template, this.config);
  }
  openEditModal(dataItem, template: TemplateRef<any>): void {
    this.editMode = true;
    this.submitButton = "Edit";
    this.modalTitle = "Edit Department";
    this.selectedDepartment = dataItem;
    this.buildClientDepartmentForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmit() {
    if (this.clientDepartmentForm.invalid) return;
    if (this.editMode) {
      this.clientDepartmentForm.patchValue({
        id: this.selectedDepartment.client_department_id,
      });
      this.editClientDepartment(this.clientDepartmentForm.value);
    } else {
      this.addClientDepartment(this.clientDepartmentForm.value);
    }
  }
}
