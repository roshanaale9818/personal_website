import { ClientLocationService } from "./../../../client-branch/services/client-location.service";
import { ClientBranchService } from "./../../../client-branch/services/client-branch.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ClientService } from "./../../client.service";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { GlobalService } from "./../../../../../shared/services/global/global.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { ClientInfoService } from "../client-info/services/client-info.service";
// import moment from 'moment-timezone';
import { Moment } from "moment";
import * as moment from "moment-timezone";
@Component({
  selector: "app-client-detail",
  templateUrl: "./client-detail.component.html",
  styleUrls: ["./client-detail.component.scss"],
})
export class ClientDetailComponent implements OnInit {
  modalRef: BsModalRef;
  clientCreateForm: FormGroup;
  regexconstant = RegexConst;
  companyId = this.globalService.getCompanyIdFromStorage();
  listLoading: boolean;

  clientInformation: any;
  client_id = this.activatedRoute.snapshot.params.id;
  constructor(
    private modalService: BsModalService,
    private toasterMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private clientService: ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clientBranchService: ClientBranchService,
    private clientLocationService: ClientLocationService,
    private clientInfoService: ClientInfoService
  ) {
    this.getClientBasicInformation();
    this.getClientBranchList();
  }

  ngOnInit() {
    this.buildCreateClientForm();
  }

  locationId;
  // Need  to understand better...............................
  getClientBasicInformation() {
    this.listLoading = true;
    const params = {
      limit: this.globalService.pagelimit,
      page: this.globalService.pageNumber,
      sortno: 2,
      sortnane: "",
      search_key: "",
      search_value: "",
    };
    this.clientService.getClientBasicInformationList(params).subscribe(
      (response) => {
        if (response.status) {
          response.data.forEach((item) => {
            if (item.client_id == this.client_id) {
              this.clientInformation = item;
              this.locationId = item.client_location_id;
              this.getTimeZoneList(this.locationId);
            }
          });
        } else {
          this.clientInformation = [];
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

  dateWithClientTimeZone;
  timeZone: any;
  getTimeZoneList(locationId): void {
    this.clientInfoService
      .getLocationLists(locationId)
      .subscribe((response) => {
        if (response.status) {
          this.timeZone = response.data.timezone;

          const date = new Date();
          const date2 = moment.tz(date, this.timeZone);
          const timezoneOffset = moment(new Date())
            .tz(this.timeZone)
            .format("Z");

          this.dateWithClientTimeZone = date2.format("LLLL");
        }
      });
  }

  buildCreateClientForm() {
    this.clientCreateForm = this.fb.group({
      client_code: [
        this.clientInformation ? this.clientInformation.client_code : "",
        Validators.required,
      ],
      name: [
        this.clientInformation ? this.clientInformation.name : "",
        Validators.required,
      ],
      phone: [
        this.clientInformation ? this.clientInformation.phone : "",
        [Validators.required, Validators.pattern(this.regexconstant.PHONE_NO)],
      ],
      email: [
        this.clientInformation ? this.clientInformation.email : "",
        [Validators.required, Validators.pattern(this.regexconstant.EMAIL)],
      ],
      address: [
        this.clientInformation ? this.clientInformation.address : "",
        Validators.required,
      ],
      post_code: [
        this.clientInformation ? this.clientInformation.post_code : "",
        Validators.pattern(this.regexconstant.NUMBER),
      ],
      city: [
        this.clientInformation ? this.clientInformation.city : "",
        Validators.required,
      ],
      state: [
        this.clientInformation ? this.clientInformation.state : "",
        Validators.required,
      ],
      client_location_id: [
        this.clientInformation ? this.clientInformation.client_location_id : "",
        Validators.required,
      ],
      client_branch_id: [
        this.clientInformation ? this.clientInformation.client_branch_id : "",
        Validators.required,
      ],
      company_id: [this.companyId],
      id: [""],
    });
  }

  editClientBasicInformation(body): void {
    if (this.clientCreateForm.pristine) {
      this.modalRef.hide();
      return;
    }
    this.clientService.editClientBasicInformation(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("Client edited successfully");

          this.modalRef.hide();

          this.getClientBasicInformation();
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
  openEditModal(template: TemplateRef<any>): void {
    this.buildCreateClientForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  onEditClient() {
    if (this.clientCreateForm.invalid) return;
    this.clientCreateForm.patchValue({
      id: this.clientInformation.client_id,
    });
    console.log(this.clientCreateForm.value);
    this.editClientBasicInformation(this.clientCreateForm.value);
  }

  clientBranchList: any;
  // get client branch
  getClientBranchList(): void {
    const params = {
      limit: this.globalService.pagelimit,
      page: this.globalService.pageNumber,
      sortno: 2,
      sortnane: "",
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
        this.toasterMessageService.showError(error);
      }
    );
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

  onChange(client_branch_id) {
    this.getClientLocationList(client_branch_id);
  }
}
