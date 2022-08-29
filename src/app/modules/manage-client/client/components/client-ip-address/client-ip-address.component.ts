import { ClientLocationService } from "./../../../client-branch/services/client-location.service";
import { ConfirmationDialogComponent } from "./../../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { ActivatedRoute } from "@angular/router";
import { ClientService } from "./../../client.service";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { GlobalService } from "./../../../../../shared/services/global/global.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";

import { CustomResponse } from "@app/shared/models/custom-response.model";
@Component({
  selector: "app-client-ip-address",
  templateUrl: "./client-ip-address.component.html",
  styleUrls: ["./client-ip-address.component.scss"],
})
export class ClientIpAddressComponent implements OnInit {
  modalRef: BsModalRef;
  clientIpForm: FormGroup;
  regexconstant = RegexConst;
  companyId = this.globalService.getCompanyIdFromStorage();
  listLoading: boolean;
  skip = 0;

  editMode: boolean;
  submitButton: any;
  modalTitle: any;
  selectedIp: any;
  constructor(
    private modalService: BsModalService,
    private toasterMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private clientService: ClientService,

    private activatedRoute: ActivatedRoute,
    private clientLocationService: ClientLocationService
  ) {
    this.getClientBranchId();
    this.getClientDepartment();
    this.getClientDivision();
  }

  gridView: any;
  clientId: any;

  pageLimit = parseInt(this.globalService.pagelimit);

  ngOnInit() {
    this.activatedRoute.parent.params.subscribe((params) => {
      this.clientId = params["id"];
      if (this.clientId) {
        this.getClientIps();
      }
    });
    this.buildClientIpForm();
  }

  buildClientIpForm() {
    this.clientIpForm = this.fb.group({
      client_id: [this.clientId],
      client_department_id: [
        this.selectedIp ? this.selectedIp.client_department_id : "",
        Validators.required,
      ],
      client_division_id: [
        this.selectedIp ? this.selectedIp.client_division_id : "",
        Validators.required,
      ],
      client_location_id: [
        this.selectedIp ? this.selectedIp.client_location_id : "",
        Validators.required,
      ],
      ip_address: [this.selectedIp ? this.selectedIp.ip_address : ""],
      isp_name: [
        this.selectedIp ? this.selectedIp.isp_name : "",
        Validators.required,
      ],

      status: [
        this.selectedIp ? this.selectedIp.status : "1",
        Validators.required,
      ],

      company_id: [this.companyId],
      id: [""],
    });
  }

  getClientIps() {
    this.clientService.getClientsIps(this.clientId).subscribe(
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

  addClientIp(body) {
    this.clientService.addClientIps(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Client Ip Added successfully"
          );
          this.modalRef.hide();
          this.getClientIps();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  editClientIp(body): void {
    if (this.clientIpForm.pristine) {
      this.modalRef.hide();
      return;
    }
    this.clientService.editClientIps(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Client Ip edited successfully"
          );

          this.modalRef.hide();

          this.getClientIps();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  deleteClientIpById(id) {
    this.clientService.deleteClientIps(id).subscribe(
      (response) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess(
            "Client Ip Deleted Sucessfully"
          );
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getClientIps();
      }
    );
  }
  divisionList: any;
  getClientDivision() {
    const body = {
      company_id: this.companyId,
      limit: 100,
      sortno: 1,
      sortnane: "",
      page: 1,
      search: {
        name: "",
        details: "",
        status: "",
        client_id: this.clientId,
      },
    };
    this.clientService.getClientsDivisions(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.divisionList = response.data;

          return;
        } else {
          this.divisionList = [];
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
  clientDepartmentList: any;
  getClientDepartment() {
    const body = {
      company_id: this.companyId,
      limit: 100,
      sortno: 1,
      sortnane: "",
      page: 1,
      search: {
        name: "",
        details: "",
        status: "",
        client_id: this.clientId,
      },
    };
    this.clientService.getClientsDeparment(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.clientDepartmentList = response.data;

          return;
        } else {
          this.clientDepartmentList = [];
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

  clientBranchId: any;
  // return client branch id for client location
  getClientBranchId() {
    this.listLoading = true;
    const params = {
      limit: 100,
      page: 1,
      sortno: 1,
      sortnane: "",
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
              return;
            }
          });
          return;
        }
      });
  }

  // get client branch location with branch id
  clientBranchLocation: any;
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

    this.clientLocationService.getClientLocationList(params).subscribe(
      (response) => {
        if (response.status) {
          this.clientBranchLocation = response.data;

          return;
        } else {
          this.clientBranchLocation = [];
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
    const client_ip_id = {
      id: dataItem.client_ip_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = dataItem.isp_name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteClientIpById(JSON.stringify(client_ip_id));
      }
    });
  }

  openAddModal(template: TemplateRef<any>): void {
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Ip";
    this.selectedIp = null;
    this.buildClientIpForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModal(dataItem, template: TemplateRef<any>): void {
    this.editMode = true;
    this.submitButton = "Edit";
    this.modalTitle = "Edit Ip";
    this.selectedIp = dataItem;
    this.buildClientIpForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmit() {
    if (this.clientIpForm.invalid) return;
    if (this.editMode) {
      this.clientIpForm.patchValue({
        id: this.selectedIp.client_ip_id,
      });
      this.editClientIp(this.clientIpForm.value);
    } else {
      this.addClientIp(this.clientIpForm.value);
    }
  }
}
