import { ConfirmationDialogComponent } from "./../../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { ClientLocationService } from "./../../../client-branch/services/client-location.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ClientService } from "./../../client.service";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { GlobalService } from "./../../../../../shared/services/global/global.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ClientIpModalComponent } from "../../components/client-ip-modal/client-ip-modal.component";
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { AddClientLocationComponent } from "@app/modules/manage-client/client-branch/components/add-client-location/add-client-location.component";
import { MaskConst } from './../../../../../shared/constants/mask.constant';

@Component({
  selector: "app-client-contact",
  templateUrl: "./client-contact.component.html",
  styleUrls: ["./client-contact.component.scss"],
})
export class ClientContactComponent implements OnInit {
  phoneMask = MaskConst.PHONE_NUMBER;
  modalRef: BsModalRef;
  clientContactForm: FormGroup;
  clientIpForm: FormGroup;
  regexconstant = RegexConst;
  companyId = this.globalService.getCompanyIdFromStorage();
  listLoading: boolean;
  client_id = this.activatedRoute.snapshot.params.id;
  skip = 0;
  editMode: boolean;
  submitButton: any;
  modalTitle: any;
  selectedContact: any;
  selectedIp: any;
  contactGridView: any;
  ipGridView: any;
  daysGridView: any;
  defaultStatus = 1;
  @Input() branchName;
  @Input() branchId;
  @Output() onOpenBranchPopup:EventEmitter<any>= new EventEmitter();

  constructor(
    private modalService: BsModalService,
    private toasterMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private clientService: ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clientLocationService: ClientLocationService
  ) {
    this.getClientBranchId();
    this.getClientDepartment();
    this.getClientDivision();
  }

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";

  getBody = {
    client_id: this.activatedRoute.snapshot.params.id,
    limit: this.limit,
    sortno: this.sortno,
    sortnane: this.sortnane,
    page: this.page,
    search: {
      name: "",
      email: "",
      mobile: "",
      phone: "",
      address: "",
      post: "",
      status: "",
    },
  };

  pageLimit = parseInt(this.limit);

  ngOnInit() {
    this.getClientContact(this.getBody);
    this.buildclientContactForm();
    //commented for ips here by roshan accordig to tika dai
    // this.getClientIps();
    // this.buildClientIpForm();
  }

  buildclientContactForm() {
    this.clientContactForm = this.fb.group({
      name: [
        this.selectedContact ? this.selectedContact.name : "",
        Validators.required,
      ],
      email: [
        this.selectedContact ? this.selectedContact.email : "",
        [Validators.required, Validators.pattern(this.regexconstant.EMAIL)],
      ],
      mobile: [
        this.selectedContact ? this.selectedContact.mobile : "",
        [Validators.required, Validators.pattern(this.regexconstant.PHONE_NO)],
      ],
      phone: [
        this.selectedContact ? this.selectedContact.phone : "",
        [Validators.required, Validators.pattern(this.regexconstant.PHONE_NO)],
      ],
      address: [
        this.selectedContact ? this.selectedContact.address : "",
        Validators.required,
      ],
      post: [
        this.selectedContact ? this.selectedContact.post : "",
        Validators.required,
      ],
      status: [
        this.selectedContact ? this.selectedContact.status : "",
        Validators.required,
      ],
      client_id: [this.activatedRoute.snapshot.params.id],
      id: [""],
    });
  }

  buildClientIpForm() {
    this.clientIpForm = this.fb.group({
      client_id: [this.client_id],
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
      ip_address: [
        this.selectedIp ? this.selectedIp.ip_address : "",
        Validators.required,
      ],
      isp_name: [
        this.selectedIp ? this.selectedIp.isp_name : "",
        Validators.required,
      ],

      status: [
        this.selectedIp ? this.selectedIp.status : "",
        Validators.required,
      ],

      company_id: [this.companyId],
      id: [""],
    });
  }

  getClientContact(body) {
    this.clientService.getClientsContact(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.contactGridView = { data: response.data, total: response.count };

          return;
        } else {
          this.contactGridView = { data: [], total: 0 };
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

    // pagination logic ends here
    if (event.filter) {
      if (event.filter.filters[0]) {
        // search api call

        if (event.filter.filters[0].field == "name") {
          this.getBody.search.name = event.filter.filters[0].value;
        }
        if (event.filter.filters[0].field == "email") {
          this.getBody.search.email = event.filter.filters[0].value;
        }
        if (event.filter.filters[0].field == "mobile") {
          this.getBody.search.mobile = event.filter.filters[0].value;
        }
      } else {
        // normal api call

        this.getBody.search.address = "";
        this.getBody.search.name = "";
        this.getBody.search.email = "";
        this.getBody.search.mobile = "";
        this.getBody.search.phone = "";
        this.getBody.search.post = "";
        this.getBody.search.status = "";
      }
    }
    // search logic ends here
    this.getClientContact(this.getBody);
  }

  addClientContact(body) {
    this.clientService.addClientContact(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Client contact person Added successfully"
          );

          this.modalRef.hide();

          this.getClientContact(this.getBody);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  editClientContact(body): void {
    if (this.clientContactForm.pristine) {
      this.modalRef.hide();
      return;
    }
    this.clientService.editClientContact(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("Contact edited successfully");

          this.modalRef.hide();

          this.getClientContact(this.getBody);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  deleteClientContactById(id) {
    this.clientService.deleteClientContact(id).subscribe(
      (response) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess("Contact Deleted Sucessfully");
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getClientContact(this.getBody);
      }
    );
  }

  openConfirmationDialogue(dataItem) {
    const clientContactId = {
      id: dataItem.client_contact_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = dataItem.name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteClientContactById(JSON.stringify(clientContactId));
      }
    });
  }

  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  openAddModal(template: TemplateRef<any>): void {
    this.editMode = false;

    this.modalTitle = "Add Contact";
    this.selectedContact = null;
    this.buildclientContactForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModal(dataItem, template: TemplateRef<any>): void {
    this.editMode = true;
    this.modalTitle = "Edit Contact";
    this.selectedContact = dataItem;
    this.buildclientContactForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmit() {
    if (this.clientContactForm.invalid) return;
    if (this.editMode) {
      this.clientContactForm.patchValue({
        id: this.selectedContact.client_contact_id,
      });

      this.editClientContact(this.clientContactForm.value);
    } else {
      this.addClientContact(this.clientContactForm.value);
    }
  }

  // clientIpModal

  getClientIps() {
    this.clientService.getClientsIps(this.client_id).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.ipGridView = { data: response.data, total: response.count };

          return;
        } else {
          this.ipGridView = { data: [], total: 0 };
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
        client_id: this.activatedRoute.snapshot.params.id,
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
            if (item.client_id == this.client_id) {
              this.clientBranchId = item.client_branch_id;
              if(this.branchId){
                console.log("returned here")
                return;
              }
              console.log("fetching api here")
              this.getClientLocationList(this.clientBranchId);
              return;
            }
          });
          return;
        }
      });
  }

  // get client branch location with branch id
  clientLocationList: any;
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
          this.clientLocationList = response.data;
        } else {
          this.clientLocationList = [];
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
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
        client_id: this.activatedRoute.snapshot.params.id,
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

  openAddIpModal(template: TemplateRef<any>): void {
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Ip";
    this.selectedIp = null;
    this.buildClientIpForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditIpModal(dataItem, template: TemplateRef<any>): void {
    this.editMode = true;
    this.submitButton = "Edit";
    this.modalTitle = "Edit Ip";
    this.selectedIp = dataItem;
    this.buildClientIpForm();
    this.modalRef = this.modalService.show(template, this.config);
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

  openIpConfirmationDialogue(dataItem) {
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

  onIpSubmit() {
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
  @ViewChild(AddClientLocationComponent,{static:false}) child: AddClientLocationComponent ;
  onOpenBranchModal(){
    // this.onOpenBranchPopup.emit(true);
    this.child.openAddModal(this.child.clientLocationFormRef);
  }
}
