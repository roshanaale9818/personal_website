import { FundType } from "./../model/fund-type.model";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { GlobalService } from "../../../../shared/services/global/global.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { State, SortDescriptor, process } from "@progress/kendo-data-query";
import { EmployeeTypeModel } from "../../employee-type/models/employeeTypeModel";
import { FundTypeService } from "../services/fund-type.service";
import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";

@Component({
  selector: "app-fund-type",
  templateUrl: "./fund-type.component.html",
  styleUrls: ["./fund-type.component.scss"],
})
export class FundTypeComponent implements OnInit {
  fundTypeForm: FormGroup;
  fundListLoading: boolean;
  fundTypeList: any[] = [];
  loading:boolean;
  companyId = this.globalService.getCompanyIdFromStorage();

  constructor(
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private fundTypeService: FundTypeService,
    private modalService: BsModalService,
    private toastrMessageService: ToastrMessageService
  ) {}

  ngOnInit() {
    this.getFundTypeList();
  }

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "";
  search_value = "";

  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);

  buildfundTypeForm() {
    this.fundTypeForm = this.formBuilder.group({
      company_id: this.companyId,
      id: this.selectedFundType ? this.selectedFundType.fund_id : "",
      title: [
        this.selectedFundType ? this.selectedFundType.title : "",
        [Validators.required],
      ],
      details: [
        this.selectedFundType ? this.selectedFundType.details : "",
        [Validators.required],
      ],
      tax_apply:[
        this.selectedFundType ? this.selectedFundType.tax_apply : "",
        [Validators.required],
      ],
      status: [this.selectedFundType ? this.selectedFundType.status : "Active"],
    });
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
  public gridView: GridDataResult;

  dataStateChange(state: DataStateChangeEvent) {
    this.state = state;
    this.gridView = process(this.fundTypeList, this.state);
  }

  //  get method
  getFundTypeList(): void {
    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      company_id: this.companyId,
      search: {
        title: "",
        details: "",
        status: "",
      },
    };
    this.loading = true;

    this.fundTypeService
      .getFundTypeList(params)
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.fundTypeList = response.data;
          this.gridView = process(this.fundTypeList, this.state);
          this.loading = false;
        } else {
          this.gridView = process([], this.state);
          this.loading = false;
        }
      });
  }

  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  editMode: boolean;
  submitButton;
  modalTitle;
  selectedFundType;
  modalRef: BsModalRef;
  selectedViewFundType: FundType;

  openViewModal(template: TemplateRef<any>, fundTypeDetail) {
    this.selectedViewFundType = fundTypeDetail;
    this.modalRef = this.modalService.show(template, this.config);
  }

  openAddModal(template: TemplateRef<any>) {
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Fund Type";
    this.selectedFundType = null;
    this.buildfundTypeForm();

    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModal(dataItem, template: TemplateRef<any>) {
    this.submitButton = "Update";
    this.editMode = true;
    this.modalTitle = "Edit Fund Type";
    this.selectedFundType = dataItem;
    this.buildfundTypeForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  // openConfirmationDialogue(fundType: FundType) {
  //   const fundTypeId = {
  //     id: fundType.fund_id,
  //   };

  //   this.modalRef = this.modalService.show(
  //     ConfirmationDialogComponent,
  //     this.config
  //   );
  //   this.modalRef.content.data = fundType.title;
  //   this.modalRef.content.action = "delete";
  //   this.modalRef.content.onClose.subscribe((confirm) => {
  //     if (confirm) {
  //       this.deleteFundTypeById(fundTypeId);
  //     }
  //   });
  // }

  // delete method
  // id is sent in json formate not a number as per backend requirement
  deleteFundType(dataItem) {
    console.log(dataItem);
    const body = {
      id: dataItem.fund_id,
      company_id:dataItem.company_id
    };
    this.fundTypeService.deleteFundTypeList(body).subscribe(
      (response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess("Fund deleted successfully");
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      },
      () => {
        this.getFundTypeList();
      }
    );
  }

  onSubmitEmployeeType() {
    if (this.fundTypeForm.invalid) return;
    this.fundTypeForm.patchValue({
      company_id: this.companyId,
    });
    if (this.editMode) {
      this.fundTypeForm.patchValue({
        id: this.selectedFundType.fund_id,
      });
      this.editFundType(this.fundTypeForm.value);
      // edit code..
    } else {
      this.addFundType(this.fundTypeForm.value);
    }
  }

  // add fund method
  addFundType(body) {
    this.fundTypeService.addFundTypeList(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Fund type is added successfully."
          );

          this.modalRef.hide();

          this.getFundTypeList();
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  editFundType(body) {
    if (this.fundTypeForm.pristine) {
      this.modalRef.hide();
    }
    this.fundTypeService.updateFundTypeList(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toastrMessageService.showSuccess("Fund is edited successfully");

          this.modalRef.hide();

          this.getFundTypeList();
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }
}
