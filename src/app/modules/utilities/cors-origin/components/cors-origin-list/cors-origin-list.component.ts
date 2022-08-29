
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomResponse } from "../../../../../shared/models/custom-response.model";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";

import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

import { GlobalService } from "@app/shared/services/global/global.service";
import { State, SortDescriptor } from "@progress/kendo-data-query";

import { GridDataResult } from "@progress/kendo-angular-grid";
// import { CookieService } from "ngx-cookie-service";
// import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { CorsOriginService } from "../../services/corsorigin.service";
import { SearchCorsOrigin } from './../../modal/searchcorsorigin.interface';
import { AddCorsOrigin } from './../../modal/addCorsOrigin.interface';
import { domain } from "process";

@Component({
  selector: 'app-cors-origin-list',
  templateUrl: './cors-origin-list.component.html',
  styleUrls: ['./cors-origin-list.component.scss']
})
export class CorsOriginListComponent implements OnInit {

  corsForm: FormGroup;
  modalRef: BsModalRef;
  listLoading = false;
  submitted: boolean;
  language: any;
  submitButton: string;
  editMode: boolean;
  modalTitle: string;
  skip = 0;
  paginationMode = true;
  companyId = this.globalService.getCompanyIdFromStorage();
  public gridView: GridDataResult;

  constructor(
    private modalService: BsModalService,
    private corsOrignService: CorsOriginService,
    private fb: FormBuilder,
    private toasterMessageService: ToastrMessageService,
    private globalService: GlobalService,
    // private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.buildCorsOriginForm();
    this.getCorsList();

  }

  buildCorsOriginForm(cors?:any): void {
    // const Cors = this.selectedCors;
    this.corsForm = this.fb.group({
      domains: [
        cors ? cors.domains : "",
        Validators.required,
      ],
      details: [
        cors ? cors.details : "",

      ],
      company_id: [cors?cors.company_id:""],
      id: [cors?cors.origin_id:""],
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
    this.getCorsList();
  }

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "";
  search_value = "";

  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);
  //  get method
  getCorsList(): void {
    this.listLoading = true;

   const params:SearchCorsOrigin = {
    access_token:this.globalService.getAccessTokenFromCookie(),
    company_id:this.globalService.getCompanyIdFromStorage(),
    sortnane:"",
    limit:this.pageLimit,
    page: parseInt(this.page),
    sortno:1,
    search:{
      domains:this.search_value
    }


   }

    this.corsOrignService.getCorsList(params).subscribe(
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


  addCors(): void {
    const bodyParms:AddCorsOrigin = {
      access_token: this.globalService.getAccessTokenFromCookie(),
      details:this.corsForm.get('details').value,
      domains:this.corsForm.get('domains').value,
      company_id: this.globalService.getCompanyIdFromStorage(),
    };
    // console.log(" Body Params" + JSON.stringify(bodyParms));
    this.corsOrignService.addCors(bodyParms).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Cors Added successfully"
          );

          this.modalRef.hide();

          this.getCorsList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  editCors(body): void {
    if (this.corsForm.pristine) {
      // this.modalRef.hide();
      return;
    }
    this.corsOrignService.editCors(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Cors edited successfully"
          );
          this.modalRef.hide();
          this.getCorsList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  // delet method
  // id is sent in json formate not a number as per backend requirement
  deleteCorsOriginById(deleteObj): void {
    this.corsOrignService.deleteCorsOrigin(deleteObj).subscribe(
      (response: CustomResponse) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess(
            "Cors deleted sucessfully"
          );
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getCorsList();
      }
    );
  }

  openConfirmationDialogue(corsObj): void {
    const deleteObj = {
      access_token:this.globalService.getAccessTokenFromCookie(),
      id:corsObj.origin_id
    }

    this.modalRef = this.modalService.show(ConfirmationDialogComponent);
    this.modalRef.content.data = corsObj.domains;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteCorsOriginById(deleteObj);
      }
    });
  }

  onSubmitCorsOrigin(): void {
    if (this.corsForm.invalid) return;
    this.corsForm.patchValue({
      company_id: this.companyId,
    });
    if (this.editMode) {
      this.corsForm.patchValue({
        id: this.selectedCors.origin_id,
      });
      this.editCors(this.corsForm.value);
      // edit code..
    } else {
      this.addCors();
    }
  }

  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  openAddModal(template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = false;
    this.submitButton = "Save";
    this.modalTitle = "Add Cors Origin";
    this.selectedCors = null;
    this.buildCorsOriginForm();
    this.modalRef = this.modalService.show(template, this.config);
  }
  selectedCors;
  corsObj;
  openViewModal(template: TemplateRef<any>, corsObj): void {
    this.corsObj = corsObj;
    this.modalRef = this.modalService.show(template);
  }

  openEditModel(Cors, template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = true;
    this.submitButton = "Update";
    this.modalTitle = "Edit Cors";
    this.selectedCors = Cors;
    // this.corsOrignService.setSelectedDepartment(Cors);
    // this.selectedCors = this.corsOrignService.getSelectedDepartment();
    this.buildCorsOriginForm(Cors);
    this.modalRef = this.modalService.show(template, this.config);
  }

}
