import { MaskConst } from "@app/shared/constants/mask.constant";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientBranchService } from "@app/modules/manage-client/client-branch/services/client-branch.service";
import { ClientLocationService } from "@app/modules/manage-client/client-branch/services/client-location.service";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { GlobalService } from "@app/shared/services/global/global.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import * as moment from "moment";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ClientService } from "../../client.service";
import { ClientInfoService } from "./services/client-info.service";

@Component({
  selector: "app-client-info",
  templateUrl: "./client-info.component.html",
  styleUrls: ["./client-info.component.scss"],
})
export class ClientInfoComponent implements OnInit {
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
    if(this.client_id){
      console.log("CALLED HERE THIS CLIENT ID ",this.client_id);
      this.getClientLocationList(this.clientBranchId);
    }
    this.buildCreateClientForm();

  }
  clientBranchId;
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
          response.data.forEach((response) => {
            if (response.client_id == this.client_id) {
              this.clientInformation = response;
              console.log(response, "Client ko ");
              this.clientBranchId = response.client_branch_id;

              if (this.clientInformation) {
                this.locationId = this.clientInformation.client_location_id;
                this.getTimeZoneList(this.clientInformation.client_location_id);
              }
            }
          });
        } else {
          this.clientInformation = "";
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

  dateWithTimeZone: any;
  timeWithTimeZone: any;
  timeZone: any;
  getTimeZoneList(locationId): void {
    if (locationId) {
      this.clientInfoService
        .getLocationLists(locationId)
        .subscribe((response) => {
          if (response.status) {
            this.timeZone = response.data.timezone;

            const date = new Date();
            //const  timezoneOffset = moment(new Date()).tz('America/New_York').format('Z');
            const date2 = moment.tz(date, this.timeZone);
            const timezoneOffset = moment(new Date())
              .tz(this.timeZone)
              .format("Z");

            this.dateWithTimeZone = date2.format("L");
            this.timeWithTimeZone = date2.format("LT");
          }
        });
    }
  }

  phoneMask = MaskConst.PHONE_NUMBER;

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
    this.getClientLocationList(this.clientBranchId);
    this.buildCreateClientForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  onEditClient() {
    if (this.clientCreateForm.invalid) return;
    this.clientCreateForm.patchValue({
      id: this.clientInformation.client_id,
    });
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

  locationName;
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
          // this.clientBranchLocation = response.data;
          this.clientBranchLocation = [];
          console.log("TETSUKA BLADE",response.data);
          if(response.data.length){
            this.clientBranchLocation = [];
            response.data.map(x=>{
              if(x.status == 1){
                this.clientBranchLocation.push(x);
              }
            })
          }
          response.data.forEach((element) => {
            if (this.locationId == element.client_location_id) {
              this.locationName = element.name;
              console.log(this.locationName);
            }
            // console.log(element, "element ko name");
          });

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
