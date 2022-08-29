import { RegexConst } from "@app/shared/constants/regex.constant";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AllowIpList } from "../../model/allow-ip.model";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { AllowIpService } from "../../services/allow-ip.service";
import { GlobalService } from "../../../../../shared/services/global/global.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
@Component({
  selector: "app-list-ip",
  templateUrl: "./list-ip.component.html",
  styleUrls: ["./list-ip.component.scss"],
})
export class ListIpComponent implements OnInit {
  allowedIpForm: FormGroup;
  submitted: boolean;
  editMode: boolean;
  paginationMode = true;
  submitButton: string;
  modalTitle: string;
  modalRef: BsModalRef;
  companyId = this.globalService.getCompanyIdFromStorage();
  allowedIpListLoading: boolean;
  allowedIpDetail: AllowIpList;
  selectedAllowedIp: AllowIpList;
  public gridView: GridDataResult;
  skip = 0;
  language: any;
  statusDropdown = [
    {
      text: "Enable",
      value: "enable",
    },
    {
      text: "Disable",
      value: "disable",
    },
  ];
  defaultItem = {
    text: "Select All",
    value: null,
  };
  regex = RegexConst;
  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = "2";
  sortnane = "";
  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);
  constructor(
    private modalService: BsModalService,
    private globalService: GlobalService,
    private allowedIpService: AllowIpService,
    private toasterMessageService: ToastrMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getAllowedIp(this.getBody);
    this.buildAllowedIpForm();
  }

  buildAllowedIpForm() {
    const allowedIp = this.selectedAllowedIp;
    this.allowedIpForm = this.fb.group({
      ip_address: [
        allowedIp ? allowedIp.ip_address : "",
        [Validators.required, Validators.pattern(this.regex.IP_ADDRESS)],
      ],
      isp_name: [allowedIp ? allowedIp.isp_name : ""],
      status: [allowedIp ? allowedIp.status : "", Validators.required],
      company_id: [this.companyId],
      id: [""],
    });
  }

  getBody = {
    company_id: this.companyId,
    limit: this.limit,
    page: this.page,
    sortno: this.sortno,
    sortnane: this.sortnane,
    search: {
      ip_address: "",
      isp_name: "",
      status: "",
    },
  };

  getAllowedIp(body): void {
    this.allowedIpListLoading = true;
    this.allowedIpService.getAllowedIpList(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };
          this.checkPaginationMode(response.count);
          return;
        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.allowedIpListLoading = false;
      },
      () => {
        this.allowedIpListLoading = false;
      }
    );
  }
  checkPaginationMode(count) {
    if (count <= this.limit) {
      this.paginationMode = false;
    }
  }

  // delet method
  deleteAllowdIpById(id): void {
    this.allowedIpService.deleteAllowedIp(id).subscribe(
      (response: CustomResponse) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess(
            "Allowed Ip deleted sucessfully"
          );
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getAllowedIp(this.getBody);
      }
    );
  }

  // add allowed Ip..
  addAllowedIp(body): void {
    this.allowedIpService.addAllowedIp(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Allowed Ip Added successfully"
          );

          this.modalRef.hide();

          this.getAllowedIp(this.getBody);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  // edit method
  editAllowedIp(body): void {
    this.allowedIpService.editDesignation(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Allowed Ip edited successfully"
          );

          this.modalRef.hide();

          this.getAllowedIp(this.getBody);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
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

  searchStatus(event): void {
    this.getBody.search.status = event.value;
    if (event.value == null) {
      this.getBody.search.ip_address = "";
      this.getBody.search.isp_name = "";
      this.getBody.search.status = "";
    }
    this.skip = 0;
    this.getAllowedIp(this.getBody);
  }

  dataStateChange(event): void {
    if (event.sort[0]) {
      this.sort = event.sort;
      if (event.sort[0].dir === "asc") {
        this.getBody.sortno = "2";
      } else {
        this.getBody.sortno = "1";
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
        if (event.filter.filters[0].field == "ip_address") {
          this.getBody.search.ip_address = event.filter.filters[0].value;
        }
        if (event.filter.filters[0].field == "isp_name") {
          this.getBody.search.isp_name = event.filter.filters[0].value;
        }
      } else {
        this.getBody.search.ip_address = "";
        this.getBody.search.isp_name = "";
        this.getBody.search.status = "";
      }

      this.getAllowedIp(this.getBody);
    }
    // search logic ends here
  }

  onSubmitAllowedIp() {
    this.submitted = true;

    if (this.allowedIpForm.invalid) return;
    if (this.editMode) {
      this.allowedIpForm.patchValue({
        id: this.selectedAllowedIp.id,
      });
      // edit code..
      this.editAllowedIp(this.allowedIpForm.value);
    } else {
      this.addAllowedIp(this.allowedIpForm.value);
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
    this.modalTitle = "Add Allowed Ip";
    this.selectedAllowedIp = null;
    this.buildAllowedIpForm();

    this.modalRef = this.modalService.show(template, this.config);
  }
  // edit modal
  openEditModel(allowedIp, template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = true;
    this.submitButton = "Update";
    this.modalTitle = "Edit Allowed Ip";

    this.allowedIpService.setSelectedAllowedIp(allowedIp);
    this.selectedAllowedIp = this.allowedIpService.getSelectedAllowedIp();

    this.buildAllowedIpForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openViewModal(template: TemplateRef<any>, allowedIpDetail): void {
    this.allowedIpDetail = allowedIpDetail;
    this.modalRef = this.modalService.show(template, this.config);
  }

  openConfirmationDialogue(allowedIp: AllowIpList): void {
    const allowedIpId = {
      id: allowedIp.id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = allowedIp.ip_address;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteAllowdIpById(JSON.stringify(allowedIpId));
      }
    });
  }
}
