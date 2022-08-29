import { DOCUMENT } from "@angular/common";
import {
  Component,
  Inject,
  Input,
  OnInit,
  SimpleChanges,
  TemplateRef,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientBranchService } from "@app/modules/manage-client/client-branch/services/client-branch.service";
import { ClientLocationService } from "@app/modules/manage-client/client-branch/services/client-location.service";
import { ClientService } from "@app/modules/manage-client/client/client.service";
import { ManageStaffService } from "@app/modules/staff/manage-staff/services/manage-staff.service";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { GlobalService } from "@app/shared/services/global/global.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { FileRestrictions, SelectEvent } from "@progress/kendo-angular-upload";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import { BsModalRef, BsModalService } from "ngx-bootstrap";

@Component({
  selector: "app-archive-client-employees",
  templateUrl: "./archive-client-employees.component.html",
  styleUrls: ["./archive-client-employees.component.scss"],
})
export class ArchiveClientEmployeesComponent implements OnInit {
  @Input() selectHeading: string;
  @Input() employeeList;
  @Input() clientStaffShiftList;
  @Input() clientLists;
  @Input() clientDivisionList;
  @Input() departmentList;
  @Input() branchList;
  @Input() clientEmployeeList;
  @Input() selectedHeading;

  clientEmployeeForm: FormGroup;
  moveClientEmployeeForm: FormGroup;
  clientCsvUploadForm: FormGroup;
  searchEmployeeform: FormGroup;

  clientArchiveEmployeeList: any[] = [];

  regexconstant = RegexConst;
  companyId = this.globalService.getCompanyIdFromStorage();

  archiveEmployeesLoading: boolean;
  editMode: boolean;
  isCollapsed: boolean = true;

  public skip = 0;

  submitButton: any;
  modalTitle: any;
  selectedEmployee: any;
  collapseButton: any;
  clientBranchId: any;
  clientBranchLocation: any;
  selectedMoveEmployee;

  modalRef: BsModalRef;
  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  //..................... KENDO GRID TABLE........................
  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
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
  gridView: GridDataResult;
  gridArchiveView: GridDataResult;

  clientId = this.activatedRoute.parent.snapshot.params.id;

  constructor(
    private modalService: BsModalService,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private clientService: ClientService,
    private activatedRoute: ActivatedRoute,
    private clientLocationService: ClientLocationService,
    private manageStaffService: ManageStaffService,

    @Inject(DOCUMENT) private document: Document
  ) {
    this.getClientBranchId();
    this.getArchiveClientEmployees(this.getArchiveBody);
  }

  collapsed(): void {
    this.buildSearchEmployeeForm();
    this.collapseButton = "Search Client Employee";
  }
  expanded(): void {
    this.collapseButton = "Hide Search Bar";
  }

  // To select all employees at once....
  public onSelectedAll() {
    const selected = this.employeeList.map((item) => item.staff_id);
    this.clientEmployeeForm.get("staff_id").patchValue(selected);
  }

  // to clear all employees at once....
  public onClearableAll() {
    this.clientEmployeeForm.get("staff_id").patchValue([]);
  }

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

  ngOnInit() {
    this.buildClientCsvUploadForm();
    this.buildSearchEmployeeForm();
    this.buildClientEmployeeForm();
    this.buildMoveClientEmployeeForm();
  }

  buildClientEmployeeForm() {
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

  dataStateArchiveChange(event): void {
    if (event.sort[0]) {
      this.sort = event.sort;
      if (event.sort[0].dir === "asc") {
        this.getArchiveBody.sortno = 2;
      } else {
        this.getArchiveBody.sortno = 1;
      }
      this.getArchiveBody.sortnane = event.sort[0].field;
    }
    // sorting logic ends here..

    if (event.skip == 0) {
      this.skip = event.skip;
      this.getArchiveBody.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;

      this.getArchiveBody.page = pageNo.toString();
    }

    this.getArchiveClientEmployees(this.getArchiveBody);
  }

  public uploadRestrictions: FileRestrictions = {
    allowedExtensions: [".csv"],
  };

  formData = new FormData();
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
        this.getArchiveClientEmployees(this.getArchiveBody);
      }
    );
  }

  onChange(client_branch_id): void {
    this.getClientLocationList(client_branch_id);
  }

  getArchiveClientEmployees(body): void {
    this.archiveEmployeesLoading = true;
    this.clientService.getClientsEmployees(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.gridArchiveView = { data: response.data, total: response.count };
        } else {
          this.gridArchiveView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.archiveEmployeesLoading = false;
      },
      () => {
        this.archiveEmployeesLoading = false;
      }
    );
  }

  // return client branch id for client location
  getClientBranchId() {
    this.archiveEmployeesLoading = true;
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
    this.clientLocationService
      .getClientLocationList(params)
      .subscribe((response) => {
        if (response.status) {
          this.clientBranchLocation = [];
          this.clientBranchLocation = response.data;
        } else {
          this.clientBranchLocation = [];
        }
      });
  }

  activeClient: any;
  openActivateConfirmationDialogues(dataItem) {
    this.activeClient = dataItem;
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = dataItem.first_name;
    this.modalRef.content.action = "activate";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.activateClientEmployees();
      }
    });
  }

  activateClientEmployees() {
    const activeBody = {
      id: this.activeClient ? this.activeClient.client_staff_id : "",
      staff_id: this.activeClient ? this.activeClient.staff_id : "",

      client_id: this.clientId,

      client_department_id: this.activeClient
        ? this.activeClient.client_department_id
        : "",

      client_division_id: this.activeClient
        ? this.activeClient.client_division_id
        : "",

      client_location_id: this.activeClient
        ? this.activeClient.client_location_id
        : "",

      role: this.activeClient ? this.activeClient.role : "",
      status: 1,

      company_id: this.companyId,

      branch_name: this.activeClient ? this.activeClient.client_branch_id : "",

      payRate: this.activeClient ? this.activeClient.payRate : "",
    };
    this.clientService.editClientEmployees(activeBody).subscribe(
      (response) => {
        if (response.status === true) {
          this.toastrMessageService.showSuccess(
            "Employee is activated sucessfully"
          );
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      },
      () => {
        this.getArchiveClientEmployees(this.getArchiveBody);
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

  onArchiveSubmit() {
    if (this.clientEmployeeForm.invalid) return;
    if (this.editMode) {
      this.clientEmployeeForm.patchValue({
        id: this.selectedEmployee.client_staff_id,
      });
      this.editArchiveClientEmployees(this.clientEmployeeForm.value);
      console.log(this.clientEmployeeForm.value.client_id);
    } else {
      this.addArchiveClientEmployees(this.clientEmployeeForm.value);
    }
  }

  addArchiveClientEmployees(body) {
    this.clientService.addClientEmployees(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Client Employee is added successfully"
          );
          this.modalRef.hide();
          this.getArchiveClientEmployees(this.getArchiveBody);
        } else {
          this.toastrMessageService.showError(response.data);
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  editArchiveClientEmployees(body): void {
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
          this.getArchiveClientEmployees(this.getArchiveBody);
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
          this.getArchiveClientEmployees(this.getArchiveBody);
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

  // Search Function for Archive Employees
  onSearchArchiveClientEmployee(): void {
    this.getArchiveBody.search.status = "0";
    this.getArchiveBody.search.staff_id =
      this.searchEmployeeform.value.staff_id;
    this.getArchiveBody.search.client_department_id =
      this.searchEmployeeform.value.client_department_id;
    this.getArchiveBody.search.client_division_id =
      this.searchEmployeeform.value.client_division_id;
    this.getArchiveBody.search.client_location_id =
      this.searchEmployeeform.value.client_location_id;
    this.getArchiveClientEmployees(this.getArchiveBody);
  }

  onArchiveCancel(): void {
    this.getArchiveBody.search.status = "0";
    this.getArchiveBody.search.staff_id = "";
    this.getArchiveBody.search.client_department_id = "";
    this.getArchiveBody.search.client_division_id = "";
    this.getArchiveBody.search.client_location_id = "";
    this.isCollapsed = true;
    this.getArchiveClientEmployees(this.getArchiveBody);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes["selectedHeading"]&&changes["selectedHeading"].currentValue == "archiveEmployees") {
      this.getArchiveClientEmployees(this.getArchiveBody);
    }
  }
}
