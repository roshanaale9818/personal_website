import { FileRestrictions, SelectEvent } from "@progress/kendo-angular-upload";
import { ActivatedRoute, Router } from "@angular/router";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Component, Inject, Input, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { State, SortDescriptor, process } from "@progress/kendo-data-query";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { ClientBranchService } from "@app/modules/manage-client/client-branch/services/client-branch.service";
import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import { ManageStaffService } from "@app/modules/staff/manage-staff/services/manage-staff.service";
import { DOCUMENT } from "@angular/common";
import { ClientLocationService } from "@app/modules/manage-client/client-branch/services/client-location.service";
import { ClientService } from "@app/modules/manage-client/client/client.service";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { GlobalService } from "@app/shared/services/global/global.service";
@Component({
  selector: "app-client-employees",
  templateUrl: "./client-employees.component.html",
  styleUrls: ["./client-employees.component.scss"],
})
export class ClientEmployeesComponent implements OnInit {
  clientCsvUploadForm: FormGroup;
  moveClientEmployeeForm: FormGroup;
  clientEmployeeForm: FormGroup;
  searchEmployeeform: FormGroup;

  clientShiftList: any[] = [];
  clientArchiveEmployeeList: any[] = [];
  clientBranchList: any[] = [];
  clientList = [];

  formData = new FormData();

  divisionList: any;
  clientDepartmentList: any;
  employeeList;
  staffList: any;
  submitButton: any;
  modalTitle: any;
  selectedEmployee: any;
  clientEmployeeList: any;
  clientBranchLocation: any;
  clientBranchId: any;
  archiveClient;
  collapseButton: any;
  selectedMoveEmployee;

  regexconstant = RegexConst;
  companyId = this.globalService.getCompanyIdFromStorage();

  listLoading: boolean;
  editMode: boolean;
  isCollapsed: boolean = true;

  // state declaration for kendo grid
  public skip = 0;
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
  gridView: GridDataResult;
  gridArchiveView: GridDataResult;
  limit = this.globalService.pagelimit;
  pageLimit = parseInt(this.limit);
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";

  modalRef: BsModalRef;
  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  clientId = this.activatedRoute.parent.snapshot.params.id;

  constructor(
    private modalService: BsModalService,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private clientService: ClientService,
    private activatedRoute: ActivatedRoute,
    private clientLocationService: ClientLocationService,
    private clientBranchService: ClientBranchService,
    private manageStaffService: ManageStaffService,

    @Inject(DOCUMENT) private document: Document
  ) {
    this.getStaffList();
    this.getClientDepartment();
    this.getClientBranchId();
    this.getClientBranchList();
    this.getClientBasicInformationList();
    this.getClientShift();
  }

  getBody = {
    client_id: this.clientId,
    limit: this.limit,
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
      status: "1",
    },
  };

  body = {
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

  getArchiveBody = {
    client_id: this.clientId,
    limit: 15,
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
      status: "0",
    },
  };

  collapsed(): void {
    this.buildSearchEmployeeForm();
    this.collapseButton = "Search Client Employee";
  }
  expanded(): void {
    this.collapseButton = "Hide Search Bar";
  }

  // To select all employees at once....
  public onSelectedAll() {
    const selected = this.staffList.map((item) => item.staff_id);
    this.clientEmployeeForm.get("staff_id").patchValue(selected);
  }

  // to clear all employees at once....
  public onClearableAll() {
    this.clientEmployeeForm.get("staff_id").patchValue([]);
  }

  ngOnInit() {
    this.buildClientCsvUploadForm();
    this.buildSearchEmployeeForm();
    this.getClientDivision();
    this.getClientEmployees(this.getBody);
    this.buildClientEmployeeForm();
    this.getEmployeeList();
    this.buildMoveClientEmployeeForm();
  }

  buildClientEmployeeForm() {
    if (this.selectedEmployee) {
    }
    this.clientEmployeeForm = this.fb.group({
      staff_id: this.editMode
        ? this.selectedEmployee
          ? this.selectedEmployee.staff_id
          : ""
        : [
            this.selectedEmployee ? this.selectedEmployee.staff_id : "",
            [Validators.required],
          ],

      client_id: this.clientId,

      client_department_id: [
        this.selectedEmployee ? this.selectedEmployee.client_department_id : "",
      ],
      client_division_id: [
        this.selectedEmployee ? this.selectedEmployee.client_division_id : "",
      ],
      client_location_id: [
        this.selectedEmployee ? this.selectedEmployee.client_location_id : "",
      ],
      role: [this.selectedEmployee ? this.selectedEmployee.role : ""],
      status: [
        this.selectedEmployee ? this.selectedEmployee.status : "1",
        Validators.required,
      ],
      company_id: [this.companyId],
      id: [""],
      branch_name: [
        this.selectedEmployee ? this.selectedEmployee.client_branch_id : "",
      ],
      pay_period: [
        this.selectedEmployee ? this.selectedEmployee.pay_period : "",
        [Validators.required],
      ],
      client_shift_id: [
        this.selectedEmployee ? this.selectedEmployee.client_shift_id : "",
        [Validators.required],
      ],
      client_staff_shift_id: [
        this.selectedEmployee
          ? this.selectedEmployee.client_staff_shift_id
          : "",
      ],

      rate: [
        this.selectedEmployee ? this.selectedEmployee.rate : "",
        [Validators.required],
      ],
    });
  }

  buildMoveClientEmployeeForm(): void {
    this.moveClientEmployeeForm = this.fb.group({
      id: "",
      client_id: [
        this.selectedMoveEmployee
          ? parseInt(this.selectedMoveEmployee.client_id)
          : "",
      ],
      staff_id: this.selectedMoveEmployee
        ? this.selectedMoveEmployee.staff_id
        : "",

      client_department_id: [
        this.selectedMoveEmployee
          ? this.selectedMoveEmployee.client_department_id
          : "",
      ],
      client_division_id: [
        this.selectedMoveEmployee
          ? this.selectedMoveEmployee.client_division_id
          : "",
      ],
      client_location_id: [
        this.selectedMoveEmployee
          ? this.selectedMoveEmployee.client_location_id
          : "",
      ],
      role: [this.selectedMoveEmployee ? this.selectedMoveEmployee.role : ""],
      status: [
        this.selectedMoveEmployee ? this.selectedMoveEmployee.status : "1",
        Validators.required,
      ],
      company_id: [this.companyId],

      branch_name: [
        this.selectedMoveEmployee
          ? this.selectedMoveEmployee.client_branch_id
          : "",
      ],
      payRate: "",
    });
  }

  buildClientCsvUploadForm(): void {
    this.clientCsvUploadForm = this.fb.group({
      file: "",
    });
  }

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

    this.getClientEmployees(this.getBody);
    // search logic ends here
  }

  // Get Client List
  getClientBasicInformationList(): void {
    const params = {
      company_id: this.companyId,
    };
    this.clientService
      .getClientBasicInformationList(params)
      .subscribe((response) => {
        this.clientList = response.data;
      });
  }

  getClientEmployees(body) {
    this.listLoading = true;

    this.clientService.getClientsEmployees(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.clientEmployeeList = response.data;
          this.gridView = { data: response.data, total: response.count };
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

  getEmployeeList(): void {
    this.clientService
      .getClientsEmployee(this.clientId)
      .subscribe((response) => {
        if (response.status) {
          if (response.status) {
            this.employeeList = response.data;
          } else {
            this.employeeList = [];
          }
        }
      });
  }

  getStaffList() {
    this.manageStaffService.getStaffLists().subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.staffList = response.data;
        } else {
          this.staffList = [];
          this.toastrMessageService.showError(response.data);
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

  getClientDivision() {
    this.clientService
      .getClientsDivisions(this.body)
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.divisionList = [];
          // response.data
          if(response.data){
            response.data.map(x=>{
              if(x.status ==1){
                this.divisionList.push(x);
              }
            })
          }
        } else {
          this.divisionList = [];
        }
      });
  }

  getClientDepartment() {
    this.clientService
      .getClientsDeparment(this.body)
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.clientDepartmentList = [];
          // this.clientDepartmentList = response.data;
          if(response.data.length){
            response.data.map(x=>{
              if(x.status ==1){
                this.clientDepartmentList.push(x);
              }
            })
          }
        } else {
          this.clientDepartmentList = [];
        }
      });
  }

  // get client branch
  getClientBranchList(): void {
    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: "",
      search_value: "",
    };

    this.clientBranchService.getClientBranchList(params).subscribe(
      (response) => {
        if (response.status) {
          this.clientBranchList = response.data;


          return;
        } else {
          this.clientBranchList = [];
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  // return client branch id for client location
  getClientBranchId() {
    this.listLoading = true;
    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: "",
      search_value: "",
    };
    this.clientService
      .getClientBasicInformationList(params)
      .subscribe((response) => {
        if (response.status) {
          response.data.forEach((item) => {
            if (item.client_id == this.clientId) {
              this.clientBranchId = item.client_branch_id;
              this.getClientLocationList(this.clientBranchId);
            }
          });
        }
      });
  }

  // get client branch location with respect to branch id
  getClientLocationList(clientBranchId): void {
    const params = {
      limit: this.globalService.pagelimit,
      page: this.globalService.pageNumber,
      sortno: 2,
      sortnane: "",
      search_key: "",
      search_value: "",
      client_branch_id: clientBranchId,
    };
    this.clientBranchLocation = []
    this.clientLocationService.getClientLocationList(params).subscribe(
      (response) => {
        if (response.status) {
          // this.clientBranchLocation = response.data;
          if(response.data){
            response.data.map(x=>{
              if(x.status == 1){
                this.clientBranchLocation.push(x);
              }
            })
          }

          return;
        } else {
          this.clientBranchLocation = [];
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  getClientShift() {
    const getBody = {
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
    this.clientShiftList = [];
    this.clientService.getClientShift(getBody).subscribe((response: any) => {
      if (response.status) {
        this.clientShiftList = response.data;
      } else {
        this.clientShiftList = [];
      }
    });
  }

  public uploadRestrictions: FileRestrictions = {
    allowedExtensions: [".csv"],
  };

  public selectEventHandler(e: SelectEvent) {
    // After Version changed we commited e.files.forEach part
    //  e.files.forEach((file) => {
    if (!e.files[0].validationErrors) {
      this.formData.append("file", e.files[0].rawFile);
      this.clientCsvUploadForm.patchValue({ file: e.files[0].rawFile });
      this.clientCsvUploadForm.markAsDirty();
    }
    //   });
  }

  openCsvAddModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmitCsv(): void {
    this.formData.append("company_id", this.companyId);
    this.formData.append("client_id", this.clientId);
    this.clientService.addClientCsvUpload(this.formData).subscribe(
      (response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Client CSV is uploaded successfully"
          );

          this.modalRef.hide();
        } else {
          this.toastrMessageService.showError("Client CSV cannot be uploaded");
        }
      },
      (error) => {
        this.toastrMessageService.showError(error.data);
      },
      () => {
        this.getClientEmployees(this.getBody);
      }
    );
  }

  onChange(client_branch_id): void {
    this.getClientLocationList(client_branch_id);
  }

  openArchiveConfirmationDialogue(dataItem) {
    this.archiveClient = dataItem;
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = dataItem.first_name;
    this.modalRef.content.action = "archive";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.archiveClientEmployees();
      }
    });
  }

  archiveClientEmployees() {
    const body = {
      id: this.archiveClient ? this.archiveClient.client_staff_id : "",
      staff_id: this.archiveClient ? this.archiveClient.staff_id : "",

      client_id: this.clientId,

      client_department_id: this.archiveClient
        ? this.archiveClient.client_department_id
        : "",

      client_division_id: this.archiveClient
        ? this.archiveClient.client_division_id
        : "",

      client_location_id: this.archiveClient
        ? this.archiveClient.client_location_id
        : "",

      role: this.archiveClient ? this.archiveClient.role : "",
      status: 0,

      company_id: this.companyId,

      branch_name: this.archiveClient
        ? this.archiveClient.client_branch_id
        : "",

      payRate: this.archiveClient ? this.archiveClient.payRate : "",
    };

    this.clientService.editClientEmployees(body).subscribe(
      (response) => {
        if (response.status === true) {
          this.toastrMessageService.showSuccess(
            "Employee is archived sucessfully"
          );
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      },
      () => {
        this.getClientEmployees(this.getBody);
      }
    );
  }

  openAddModal(template: TemplateRef<any>): void {
    this.submitButton = "Submit";
    this.modalTitle = "Add Employee";
    this.selectedEmployee = null;
    this.buildClientEmployeeForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModal(dataItem, template: TemplateRef<any>): void {
    this.editMode = true;
    this.submitButton = "Edit";
    this.modalTitle = "Edit Employee";
    this.selectedEmployee = dataItem;

    this.getClientLocationList(dataItem.client_branch_id);
    this.buildClientEmployeeForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmit() {
    if (this.clientEmployeeForm.invalid) return;
    if (this.editMode) {
      this.clientEmployeeForm.patchValue({
        id: this.selectedEmployee.client_staff_id,
      });
      this.editClientEmployees(this.clientEmployeeForm.value);
    } else {
      this.addClientEmployees(this.clientEmployeeForm.value);
    }
  }

  addClientEmployees(body) {
    this.clientService.addClientEmployees(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Client Employee is added successfully"
          );
          this.modalRef.hide();
          this.getClientEmployees(this.getBody);
        } else {
          this.toastrMessageService.showError(response.data);
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  editClientEmployees(body): void {
    if (this.clientEmployeeForm.pristine) {
      this.modalRef.hide();
      return;
    }
    this.clientService.editClientEmployees(body).subscribe(
      (response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Employee is updated successfully."
          );
          this.getClientEmployees(this.getBody);
          this.modalRef.hide();
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  openMoveEmployeeModal(dataItem, template: TemplateRef<any>): void {
    this.submitButton = "Move";
    this.modalTitle = "Move Employee";
    this.selectedMoveEmployee = dataItem;
    this.buildMoveClientEmployeeForm();
    this.moveClientEmployeeForm.patchValue({
      id: this.selectedMoveEmployee.client_staff_id,
    });
    this.modalRef = this.modalService.show(template, this.config);
  }

  updateMoveEmployeeList(): void {
    this.clientService
      .editClientEmployees(this.moveClientEmployeeForm.value)
      .subscribe((response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Client Employee is moved successfully."
          );
          this.getClientEmployees(this.getBody);
          this.modalRef.hide();
        } else {
          this.toastrMessageService.showError(
            "Client Employee cannot be moved."
          );
        }
      });
  }

  exportClientEmployeeReport(): void {
    const body = {
      company_id: this.globalService.getCompanyIdFromStorage(),
      client_id: this.clientId,
    };
    this.manageStaffService.excelExport(body).subscribe((response) => {
      this.document.location.href = response.data;
    });
  }

  buildSearchEmployeeForm(): void {
    this.searchEmployeeform = this.fb.group({
      role: "",
      staff_id: "",
      client_department_id: "",
      client_division_id: "",
      client_location_id: "",
      branch_name: "",
    });
  }

  onSearchClientEmployee(): void {
    this.getBody.page = "1";
    this.getBody.search.role = this.searchEmployeeform.value.role;
    this.getBody.search.staff_id = this.searchEmployeeform.value.staff_id;
    this.getBody.search.client_department_id =
      this.searchEmployeeform.value.client_department_id;
    this.getBody.search.client_division_id =
      this.searchEmployeeform.value.client_division_id;
    this.getBody.search.client_location_id =
      this.searchEmployeeform.value.client_location_id;
    this.getClientEmployees(this.getBody);
  }

  onCancel(): void {
    this.getBody.search.status = "1";
    this.getBody.search.staff_id = "";
    this.getBody.search.client_department_id = "";
    this.getBody.search.client_division_id = "";
    this.getBody.search.client_location_id = "";
    this.getBody.search.role = "";
    this.isCollapsed = true;
    this.getClientEmployees(this.getBody);
  }

  changeRole(event, dataItem): void {
    const body = {
      id: dataItem.client_staff_id,
      role: event == true ? "Manager" : "Employee",
    };
    this.changeClientRole(body);
  }

  changeClientRole(body): void {
    this.clientService.changeClientEmployeeRole(body).subscribe((response) => {
      if (response.status) {
        this.toastrMessageService.showSuccess("Role is changed successfully.");
        this.getClientEmployees(this.getBody);
      } else {
        this.toastrMessageService.showError("Role cannot be changed.");
      }
    });
  }

  // Load the data on selecting particular tab
  selectedHeading: string = "";
  selectedTab(heading): void {
    this.selectedHeading = heading;
    if (heading == "activeEmployees") {
      this.getClientEmployees(this.getBody);
    }
  }
}
