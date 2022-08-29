import { ClientLocationService } from "./../../../client-branch/services/client-location.service";
import { ClientBranchService } from "./../../../client-branch/services/client-branch.service";
import { ConfirmationDialogComponent } from "./../../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { Router } from "@angular/router";
import { ClientService } from "./../../client.service";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { GlobalService } from "./../../../../../shared/services/global/global.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { State, SortDescriptor, process } from "@progress/kendo-data-query";
import { MaskConst } from "@app/shared/constants/mask.constant";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";
@Component({
  selector: "app-list-client",
  templateUrl: "./list-client.component.html",
  styleUrls: ["./list-client.component.scss"],
})
export class ListClientComponent implements OnInit {
  modalRef: BsModalRef;
  clientCreateForm: FormGroup;
  regexconstant = RegexConst;
  companyId = this.globalService.getCompanyIdFromStorage();
  listLoading: boolean;
  skip = 0;
  clientList: any[] = [];
  phoneMask = MaskConst.PHONE_NUMBER;
  constructor(
    private modalService: BsModalService,
    private toasterMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private clientService: ClientService,
    private router: Router,
    private clientBranchService: ClientBranchService,
    private clientLocationService: ClientLocationService,
    public authService:AuthService
  ) {
    this.getClientBranchList();
    console.log(this.companyId);
  }

  gridView: any;

  //gridviewforView only is for only view purpose
  gridViewForView:any;

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "";
  search_value = "";

  pageLimit = parseInt(this.limit);
  ngOnInit() {
    this.buildCreateClientForm();
    if(
      this.authService.currentUserRoleValue =="Admin" ||
      this.authService.currentUserRoleValue =="Super Admin"
    ){
      this.getClientBasicInformationList();
    }
    else if(
      this.authService.currentUserRoleValue =="Manager" ||
      this.authService.currentUserRoleValue =="HR"
    ){
      this.getClientFromStaff();
    }
  }

  buildCreateClientForm() {
    this.clientCreateForm = this.fb.group({
      name: ["", Validators.required],
      phone: [
        "",
        [Validators.required, Validators.pattern(this.regexconstant.PHONE_NO)],
      ],
      email: [
        "",
        [Validators.required, Validators.pattern(this.regexconstant.EMAIL)],
      ],
      address: ["", Validators.required],
      post_code: ["", Validators.pattern(this.regexconstant.NUMBER)],
      city: ["", Validators.required],
      state: ["", Validators.required],
      client_location_id: "",
      client_branch_id: ["", Validators.required],
      company_id: [this.companyId],
      client_code: ["", [Validators.required]],
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

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.clientList, this.state);
    // if (event.sort[0]) {
    //   this.sort = event.sort;
    //   if (event.sort[0].dir === "asc") {
    //     this.sortno = 2;
    //   } else {
    //     this.sortno = 1;
    //   }
    //   this.sortnane = event.sort[0].field;
    // }
    // sorting logic ends here..

    //     if (event.skip == 0) {
    //   this.skip = event.skip;
    //   this.page = "1";
    // } else {
    //   this.skip = event.skip;
    //   const pageNo = event.skip / event.take + 1;

    //   this.page = pageNo.toString();
    // }
    // pagination logic ends here

    // if (event.filter) {
    //   if (event.filter.filters[0]) {
    //     // search api call
    //     // this.paginationMode = false;
    //     const searchTerm = event.filter.filters[0].value;
    //     const searchField = event.filter.filters[0].field;
    //     this.search_value = searchTerm;
    //     this.search_key = searchField;
    //   } else {
    //     // normal api call
    //     // this.paginationMode = true;
    //     this.search_value = "";
    //     this.search_key = "";
    //   }
    // }
    // search logic ends here
    this.getClientBasicInformationList();
  }

  getClientBasicInformationList() {
    this.listLoading = true;
    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
      company_id: this.companyId,
    };
    this.clientService.getClientBasicInformationList(params).subscribe(
      (response) => {
        console.log(response);
        if (response.status) {
          this.clientList = response.data;
          this.gridView = process(this.clientList, this.state);
          // this.gridView = { data: response.data, total: response.count };

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

  // add clients basic information...
  addBasicInformation(body) {
    this.clientService.addClientBasicInformation(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Client's Basic Information Added successfully"
          );

          this.modalRef.hide();

          this.getClientBasicInformationList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  clientBranchList: any;
  // get client branch
  getClientBranchList(): void {
    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
      company_id: this.companyId,
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
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
      client_branch_id: clientBranchId,
    };

    this.clientLocationService.getClientLocationList(params).subscribe(
      (response) => {
        if (response.status) {
          this.clientBranchLocation = response.data;
          console.log(response);
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
    console.log(client_branch_id, "Ahile ko lagi ko kura");
    console.log(client_branch_id);
    this.getClientLocationList(client_branch_id);
  }

  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  addClientModal(template: TemplateRef<any>): void {
    this.buildCreateClientForm();
    this.modalRef = this.modalService.show(template, this.config);
  }
  onCreateClient() {
    if (this.clientCreateForm.invalid) {
      return;
    }
    console.log(this.clientCreateForm.value);
    this.addBasicInformation(this.clientCreateForm.value);
  }

  deleteClientById(id) {
    this.clientService.deleteClient(id).subscribe(
      (response) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess("Client deleted sucessfully");
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getClientBasicInformationList();
      }
    );
  }

  openConfirmationDialogue(dataItem) {
    const clientId = {
      id: dataItem.client_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = dataItem.name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteClientById(JSON.stringify(clientId));
      }
    });
  }

  navigateToClientDetailView(dataItem) {
    this.clientService.setClientInformation(dataItem);
    this.router.navigate([
      "/manage-client/client/client-detail",
      dataItem.client_id,
    ]);
  }


clientListArray:[] =[];
  getClientFromStaff() {
    this.listLoading = true;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    this.clientService
      .getClientFromStaff(userInfo.staff_id)
      .subscribe((response) => {
        if (response.status) {
          // this.showClient = true;
          // this.clientList = response.data;
          console.log("MESSSAGE",response);
          this.clientListArray = response.data;
          this.gridViewForView = process(this.clientListArray, this.state);
          this.listLoading = false;
        }
        else{
          this.listLoading = false;
        }

      });
  }


  dataStateChangeForView(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridViewForView =  process(this.clientListArray, this.state);
    this.getClientFromStaff();
  }
}
