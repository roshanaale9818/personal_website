import { AllowanceListModal } from "../../modal/allowanceListModal";
import { HelperService } from "@app/shared/services/helper/helper.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { Router } from "@angular/router";
import { ValidationMessageService } from "@app/shared/services/validation-message/validation-message.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AllowanceService } from "../../services/allowance.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { CustomResponse } from "../../../../../shared/models/custom-response.model";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "app-list-allowance",
  templateUrl: "./list-allowance.component.html",
  styleUrls: ["./list-allowance.component.scss"],
})
export class ListAllowanceComponent implements OnInit {
  modalRef: BsModalRef;
  allowanceListLoading: boolean;
  public gridView: GridDataResult;
  allowanceForm: FormGroup;
  selectedAllowance: AllowanceListModal;
  submitted: boolean;
  language: any;
  editMode: boolean;
  submitButton: string;
  modalTitle: string;
  companyId = this.globalService.getCompanyIdFromStorage();
  isChecked: boolean;
  allowanceDetail: AllowanceListModal;
  skip = 0;
  paginationMode = true;
  public allowanceTypeList = [
    { text: "Additive", value: 1 },
    { text: "Decremental", value: 0 },
  ];
  public defaultItem: { text: string; value: number } = {
    text: "Select All",
    value: null,
  };
  constructor(
    private modalService: BsModalService,
    private allowanceService: AllowanceService,
    private fb: FormBuilder,
    private validationMessageService: ValidationMessageService,
    private toasterMessageService: ToastrMessageService,
    private router: Router,
    private globalService: GlobalService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.getAllowanceList();
    this.buildAllowanceForm();
  }

  buildAllowanceForm(): void {
    const allowance = this.selectedAllowance;
    this.allowanceForm = this.fb.group({
      title: [allowance ? allowance.title : "", Validators.required],
      period: [""],
      recurring: [allowance ? allowance.recurring : ""],
      remarks: [allowance ? allowance.remarks : ""],
      allowance_type: [
        allowance ? allowance.allowance_type : "",
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
  getAllowanceList(): void {
    this.allowanceListLoading = true;

    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
    };

    this.allowanceService.getAllowanceList(params).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };
          this.convertApiData();

          return;
        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.allowanceListLoading = false;
      },
      () => {
        this.allowanceListLoading = false;
      }
    );
  }

  convertApiData(): void {
    // converting 0 and 1 from API to decremental and additive respectively..
    this.gridView.data.forEach((item) => {
      if (item.allowance_type == 0) {
        item.allowance_type = "Decremental";
      } else if (item.allowance_type == 1) {
        item.allowance_type = "Additive";
      }
    });
    // converting true and false to yes and now respectively.
    this.gridView.data.forEach((item) => {
      if (item.recurring == false) {
        item.recurring = "No";
      } else {
        item.recurring = "Yes";
      }
    });
  }

  // add allowance
  addAllowance(body): void {
    this.allowanceService.addAllowance(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Allowance Added successfully"
          );

          this.modalRef.hide();

          this.getAllowanceList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  // edit allowance
  editAllowance(body): void {
    if (this.allowanceForm.pristine) {
      this.modalRef.hide();
      return;
    }
    this.allowanceService.editAllowance(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Allowance edited successfully"
          );

          this.modalRef.hide();

          this.getAllowanceList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  // delete allowance
  deleteAllowanceById(id): void {
    this.allowanceService.deleteAllowance(id).subscribe(
      (response: CustomResponse) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess(
            "Allowance deleted sucessfully"
          );
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getAllowanceList();
      }
    );
  }

  openConfirmationDialogue(allowance: AllowanceListModal): void {
    const allowanceId = {
      id: allowance.allowance_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = allowance.title;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteAllowanceById(JSON.stringify(allowanceId));
      }
    });
  }

  onSubmitAllowance(): void {
    this.submitted = true;

    if (this.allowanceForm.invalid) return;

    this.allowanceForm.patchValue({
      company_id: this.companyId,
      period: "YEARLY",
    });
    if (this.allowanceForm.get("recurring").value == false) {
      this.allowanceForm.patchValue({
        recurring: "0",
      });
      this.isChecked = false;
    } else {
      this.allowanceForm.patchValue({
        recurring: "1",
      });
    }

    if (this.editMode) {
      this.allowanceForm.patchValue({
        id: this.selectedAllowance.allowance_id,
      });
      this.editAllowance(this.allowanceForm.value);
    } else {
      this.addAllowance(this.allowanceForm.value);
    }

    // console.log(this.allowanceForm.value);
    // console.log(this.allowanceForm.get("recurring").value);
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

  searchAllowanceType(event): void {
    this.search_key = "allowance_type";
    this.search_value = event.value;
    this.page = "''";
    if (event.value == null) {
      this.search_key = "";
      this.search_value = "";
    }
    this.skip = 0;
    this.getAllowanceList();
  }

  dataStateChange(event): void {
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
    this.getAllowanceList();
  }

  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  openAddModal(template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Allowance";
    this.selectedAllowance = null;
    this.buildAllowanceForm();

    this.modalRef = this.modalService.show(template, this.config);
  }

  openViewModal(template: TemplateRef<any>, allowanceDetail): void {
    this.allowanceDetail = allowanceDetail;
    this.modalRef = this.modalService.show(template, this.config);
  }
  // method to reverse the converted allowance type and recurring in order to make work in edit mode..
  reverseApIData(allowance) {
    let modifiedAllowance = {
      title: allowance.title,
      remarks: allowance.remarks,
      allowance_type: null,
      recurring: null,
      allowance_id: allowance.allowance_id,
    };
    if (allowance.allowance_type == "Decremental") {
      modifiedAllowance.allowance_type = 0;
    } else {
      modifiedAllowance.allowance_type = 1;
    }
    if (allowance.recurring == "No") {
      modifiedAllowance.recurring = false;
    } else {
      modifiedAllowance.recurring = true;
    }
    return modifiedAllowance;
  }

  openEditModel(allowance, template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = true;
    this.submitButton = "Update";
    this.modalTitle = "Edit Allowance";
    const modifiedAllowance = this.reverseApIData(allowance);
    this.allowanceService.setSelectedAllowance(modifiedAllowance);
    this.selectedAllowance = this.allowanceService.getSelectedAllowance();
    this.buildAllowanceForm();
    this.modalRef = this.modalService.show(template, this.config);
  }
}
