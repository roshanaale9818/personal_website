import { DatePipe } from "@angular/common";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { GlobalService } from "@app/shared/services/global/global.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";

import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import { process, State, SortDescriptor } from "@progress/kendo-data-query";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ClientService } from "../../client.service";

@Component({
  selector: "app-client-staff-shift",
  templateUrl: "./client-staff-shift.component.html",
  styleUrls: ["./client-staff-shift.component.scss"],
})
export class ClientStaffShiftComponent implements OnInit {
  modalRef: BsModalRef;
  clientStaffShiftForm: FormGroup;
  regexconstant = RegexConst;
  companyId = this.globalService.getCompanyIdFromStorage();

  listLoading: boolean;
  isCollapsed: boolean = true;

  skip = 0;
  editMode: boolean;
  submitButton: any;
  modalTitle: any;
  selectedClientShift: any;
  date: DatePipe;

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  //Kendo Table
  public clientEmployeeShiftList: any[] = [];
  // state declaration for kendo grid
  public state: State = {
    skip: 0,
    take: 15,
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

  public gridView: GridDataResult;
  constructor(
    private modalService: BsModalService,
    private toasterMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private clientService: ClientService,

    private activatedRoute: ActivatedRoute
  ) {}

  clientId = this.activatedRoute.parent.snapshot.params.id;

  ngOnInit() {
    this.activatedRoute.parent.params.subscribe((params) => {
      this.clientId = params["id"];
      if (this.clientId) {
        this.getClientStaffShift(this.getBody);
      }
    });

    this.buildClientStaffShiftForm();
    this.getClientShift();
    this.getClientEmployees(this.body);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  buildClientStaffShiftForm() {
    this.clientStaffShiftForm = this.fb.group({
      id: "",
      client_id: this.activatedRoute.parent.snapshot.params.id,
      staff_id: [
        this.selectedClientShift ? this.selectedClientShift.staff_id : "",
        [Validators.required],
      ],
      client_shift_id: [
        this.selectedClientShift
          ? this.selectedClientShift.client_shift_id
          : "",
        [Validators.required],
      ],
      rate: [
        this.selectedClientShift ? this.selectedClientShift.rate : "",
        [Validators.required],
      ],
      pay_period: this.selectedClientShift
        ? this.selectedClientShift.pay_period
        : "",
      status: this.selectedClientShift
        ? this.selectedClientShift.status
        : "Active",
      company_id: this.globalService.getCompanyIdFromStorage(),
    });
  }

  obj = {
    limit: 15,
    page: this.page,
    sortnane: this.sortnane,
    sortno: this.sortno,
    company_id: this.globalService.getCompanyIdFromStorage(),
    search: {
      client_id: this.clientId,
      staff_id: "",
      client_shift_id: "",
      rate: "",
      pay_period: "",
      status: "",
    },
  };

  collapseButton: any;
  collapsed(): void {
    // this.searchForm.reset();
    // this.getStaffList(this.getBody);
    this.collapseButton = "Search Client Employee";
  }
  expanded(): void {
    this.collapseButton = "Hide Search Bar";
  }

  onSearchClientEmployee(): void {
    this.obj.search.staff_id = this.clientStaffShiftForm.value.staff_id;
    this.getClientStaffShift(this.obj);
  }

  onCancel(): void {
    let cancelObj = {
      limit: 15,
      page: this.page,
      sortnane: this.sortnane,
      sortno: this.sortno,
      company_id: this.globalService.getCompanyIdFromStorage(),
      search: {
        client_id: this.clientId,
        staff_id: "",
        client_shift_id: "",
        rate: "",
        pay_period: "",
        status: "",
      },
    };
    this.clientStaffShiftForm.reset();
    this.getClientStaffShift(cancelObj);
    this.isCollapsed = true;
  }

  getBody = {
    limit: 15,
    page: this.page,
    sortnane: this.sortnane,
    sortno: this.sortno,
    company_id: this.globalService.getCompanyIdFromStorage(),
    search: {
      client_id: this.clientId,
      stff_id: "",
      client_shift_id: "",
      rate: "",
      pay_period: "",
      status: "",
    },
  };

  pageLimit = parseInt(this.limit);
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
    // Sorting logic ends here..

    if (event.skip === 0) {
      this.skip = event.skip;
      this.getBody.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;
      this.getBody.page = pageNo.toString();
    }
    // Pagination logic ends here..

    // if (event.filter) {
    //   if (event.filter.filters[0]) {
    //     if ((event.filter.filters[0].field = "pay_period")) {
    //       this.getBody.search.pay_period = event.filter.filters[0].value;
    //     }
    //   }
    // } else {
    //   this.getBody.search.pay_period = "";
    //   this.getBody.search.stff_id = "";
    //   this.getBody.search.client_shift_id = "";
    //   this.getBody.search.rate = "";
    //   this.getBody.search.pay_period = "";
    //   this.getBody.search.status = "";
    // }
    // Search logic ends here...
    this.getClientStaffShift(this.getBody);
  }

  getClientStaffShift(getBody): void {
    this.loading = true;
    this.clientService.getClientStaffShift(getBody).subscribe(
      (response) => {
        if (response.status) {
          this.clientEmployeeShiftList = response.data;
          this.gridView = {
            data: response.data,
            total: response.count,
          };
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

  body = {
    client_id: this.clientId,
    limit: 1000000,
    sortno: this.sortno,
    sortnane: this.sortnane,
    page: this.page,
    search: {
      company_id: this.companyId,
      client_location_id: "",
      client_division_id: "",
      client_department_id: "",
      staff_id: "",
      role: "",
      status: "",
    },
  };

  loading: boolean;
  clientEmployeeList: any[] = [];
  getClientEmployees(body) {
    this.clientEmployeeList = [];
    this.clientService
      .getClientsEmployee(this.clientId)
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.clientEmployeeList = response.data;
        } else {
          this.clientEmployeeList = [];
        }
      });
  }

  clientShiftList;
  shiftBody = {
    limit: this.limit,
    page: this.page,
    sortnane: this.sortnane,
    sortno: this.sortno,
    company_id: this.globalService.getCompanyIdFromStorage(),
    search: {
      client_id: this.activatedRoute.snapshot.params.id,
      name: "",
      shift_from: "",
      shift_to: "",
      late_warn_time: "",
      check_in_restriction: "",
    },
  };

  getClientShift() {
    const getBody = {
      limit: 1000000,
      page: this.page,
      sortnane: this.sortnane,
      sortno: this.sortno,
      company_id: this.globalService.getCompanyIdFromStorage(),
      search: {
        client_id: this.clientId,
        stff_id: "",
        client_shift_id: "",
        rate: "",
        pay_period: "",
        status: "",
      },
    };
    this.clientShiftList = [];
    this.clientService.getClientShift(getBody).subscribe((response: any) => {
      if (response.status) {
        this.clientShiftList = response.data;
      } else {
        this.clientShiftList = [];
      }
    });
  }

  // dataStateChange(event): void {
  //   if (event.sort[0]) {
  //     this.sort = event.sort;
  //     if (event.sort[0].dir === "asc") {
  //       this.getBody.sortno = 2;
  //     } else {
  //       this.getBody.sortno = 1;
  //     }
  //     this.getBody.sortnane = event.sort[0].field;
  //   }
  //   // sorting logic ends here..

  //   if (event.skip == 0) {
  //     this.skip = event.skip;
  //     this.getBody.page = "1";
  //   } else {
  //     this.skip = event.skip;
  //     const pageNo = event.skip / event.take + 1;

  //     this.getBody.page = pageNo.toString();
  //   }
  //   // pagination logic ends here

  //   // if (event.filter) {
  //   //   if (event.filter.filters[0]) {
  //   //     // search api call

  //   //     if (event.filter.filters[0].field == "name") {
  //   //       this.getBody.search.name =
  //   //         event.filter.filters[0].value;
  //   //     }
  //   //     if (event.filter.filters[0].field == "client_division_id") {
  //   //       this.getBody.search.client_division_id =
  //   //         event.filter.filters[0].value;
  //   //     }
  //   //     if (event.filter.filters[0].field == "client_department_id") {
  //   //       this.getBody.search.client_department_id =
  //   //         event.filter.filters[0].value;
  //   //     }
  //   //     if (event.filter.filters[0].field == "staff_id") {
  //   //       this.getBody.search.staff_id = event.filter.filters[0].value;
  //   //     }
  //   //     if (event.filter.filters[0].field == "role") {
  //   //       this.getBody.search.role = event.filter.filters[0].value;
  //   //     }
  //   //     if (event.filter.filters[0].field == "status") {
  //   //       this.getBody.search.status = event.filter.filters[0].value;
  //   //     }
  //   //   } else {
  //   //     // normal api call
  //   //     this.getBody.search.client_location_id = "";
  //   //     this.getBody.search.client_division_id = "";
  //   //     this.getBody.search.client_department_id = "";
  //   //     this.getBody.search.staff_id = "";
  //   //     this.getBody.search.role = "";
  //   //     this.getBody.search.status = "";
  //   //   }
  //   // }
  //   this.getClientEmployees(this.getBody);
  //   // search logic ends here
  // }

  addClientShift(body) {
    let shift = {
      client_id: parseInt(this.clientStaffShiftForm.value.client_id),
      staff_id: parseInt(this.clientStaffShiftForm.value.staff_id),
      client_shift_id: parseInt(
        this.clientStaffShiftForm.value.client_shift_id
      ),
      rate: this.clientStaffShiftForm.value.rate,
      pay_period: this.clientStaffShiftForm.value.pay_period,
      status: this.clientStaffShiftForm.value.status,
      company_id: parseInt(this.clientStaffShiftForm.value.company_id),
    };
    this.clientService.addClientStaffShift(shift).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Client Employee Shift is added successfully"
          );
          this.modalRef.hide();
          this.getClientStaffShift(this.getBody);
        } else {
          this.toasterMessageService.showError(
            "Client Employee Shift cannot be added"
          );
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  addMultipleClientShift(body) {
    let shift = {
      client_id: parseInt(this.clientStaffShiftForm.value.client_id),
      staff_id: this.clientStaffShiftForm.value.staff_id,
      client_shift_id: parseInt(
        this.clientStaffShiftForm.value.client_shift_id
      ),
      rate: this.clientStaffShiftForm.value.rate,
      pay_period: this.clientStaffShiftForm.value.pay_period,
      status: this.clientStaffShiftForm.value.status,
      company_id: parseInt(this.clientStaffShiftForm.value.company_id),
    };
    this.clientService.addMultipleClientStaffShift(shift).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Client Employee Shift is added successfully"
          );
          this.modalRef.hide();
          this.getClientStaffShift(this.getBody);
        } else {
          this.toasterMessageService.showError(
            "Client Employee Shift cannot be added"
          );
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  // To select all employees at once....
  public onSelectedAll() {
    const selected = this.clientEmployeeList.map((item) => item.staff_id);

    this.clientStaffShiftForm.get("staff_id").patchValue(selected);
  }

  // to clear all employees at once....
  public onClearableAll() {
    this.clientStaffShiftForm.get("staff_id").patchValue([]);
  }

  editClientShift(body): void {
    if (this.clientStaffShiftForm.pristine) {
      this.modalRef.hide();
      return;
    }

    this.clientService.editClientStaffShift(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Client Employee Shift is updated successfully"
          );

          this.modalRef.hide();

          this.getClientStaffShift(this.getBody);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  openConfirmationDialogue(dataItem) {
    const clientShiftId = {
      id: dataItem.client_staff_shift_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = dataItem.name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteClientStaffShift(JSON.stringify(clientShiftId));
      }
    });
  }

  deleteClientStaffShift(id) {
    this.clientService.deleteClientStaffShift(id).subscribe(
      (response) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess(
            "Client Employee Shift is deleted Sucessfully"
          );
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getClientStaffShift(this.getBody);
      }
    );
  }

  openAddModal(template: TemplateRef<any>): void {
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Client Employee Shift";
    this.selectedClientShift = null;
    this.buildClientStaffShiftForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModal(dataItem, template: TemplateRef<any>): void {
    this.editMode = true;
    this.submitButton = "Edit";
    this.modalTitle = "Edit Client Employee Shift";
    this.selectedClientShift = dataItem;
    this.buildClientStaffShiftForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmit() {
    if (this.clientStaffShiftForm.invalid) return;
    if (this.editMode) {
      this.clientStaffShiftForm.patchValue({
        id: this.selectedClientShift.client_staff_shift_id,
      });
      this.editClientShift(this.clientStaffShiftForm.value);
    } else {
      this.addMultipleClientShift(this.clientStaffShiftForm.value);
    }
  }
}
