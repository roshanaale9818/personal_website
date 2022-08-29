import { ClientLocationList } from "./../../modals/client-location.modal";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { ClientLocationService } from "./../../services/client-location.service";
import { Component, Input, OnInit, SimpleChange, TemplateRef, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { HelperService } from "./../../../../../shared/services/helper/helper.service";
import { ValidationMessageService } from "@app/shared/services/validation-message/validation-message.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

import { GlobalService } from "@app/shared/services/global/global.service";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";

@Component({
  selector: "app-add-client-location",
  templateUrl: "./add-client-location.component.html",
  styleUrls: ["./add-client-location.component.scss"],
})
export class AddClientLocationComponent implements OnInit {
  clientLocationForm: FormGroup;
  selectedclientLocation;
  submitted: boolean;
  editMode: boolean;
  submitButton: string;
  modalTitle: string;
  modalRef: BsModalRef;
  public gridView: GridDataResult;
  skip: 0;
  clientLocationDetail: ClientLocationList;
  language: any;
  companyId = this.globalService.getCompanyIdFromStorage();
  ClientLocationListLoading: boolean;
  clientBranchId: number;
  count = 0;
  @Input() hideDetails:boolean;
  @Input()hideTimeZone:boolean;
  @Input() id:any;
  @Input() hideTopHeading:boolean;
  public statusList = [
    { text: "Active", value: "1" },
    { text: "Inactive", value: "0" },
  ];
  public defaultItem: { text: string; value: number } = {
    text: "Select All",
    value: null,
  };

  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  @ViewChild("clientLocationModal",{static:false})clientLocationFormRef;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,

    private toasterMessageService: ToastrMessageService,
    private router: Router,
    private globalService: GlobalService,
    private clientLocationService: ClientLocationService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.clientBranchId = this.activatedRoute.snapshot.params.id;
    // if(this.id){
    //   console.log("input id and id is",this.id)
    //   this.clientBranchId = this.id;
    //   console.log("input id and id is",this.id,this.clientBranchId);
    // }
    if(!this.hideDetails){
      this.clientBranchId = this.activatedRoute.snapshot.params.id;
      this.getClientLocationList();
      console.log("NO ID HERE AND CALLED LOCATION WITH PARAMS ")
    }
    this.buildClientLocationForm();
    this.getTimeZone();
  }
  ngOnChanges(change:SimpleChange){
    // console.log(change)
    if(change["id"]&& change["id"].currentValue){
      this.clientBranchId = change["id"].currentValue;
      this.getClientLocationList();
    }
  }

  statusInfo;
  buildClientLocationForm(): void {
    const clientLocation = this.selectedclientLocation;

    this.clientLocationForm = this.fb.group({
      name: [clientLocation ? clientLocation.name : "", Validators.required],
      details: [clientLocation ? clientLocation.details : ""],
      status: [clientLocation ? clientLocation.status : 1, Validators.required],
      company_id: [""],
      client_branch_id: [
        clientLocation ? clientLocation.client_branch_id : "",
        Validators.required,
      ],
      id: [""],
      timezone: [
        clientLocation ? clientLocation.timezone : "",
        Validators.required,
      ],
    });
  }

  // Get Time zone list
  timeZoneLocationList: any;
  getTimeZone(): void {
    this.timeZoneLocationList = this.globalService.timeZone;
  }

  // dynamic form validation section ends here...

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = "2";
  sortnane = "";
  search_key = "";
  search_value = "";
  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);

  //  get client location list
  getClientLocationList(): void {
    this.ClientLocationListLoading = true;

    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
      client_branch_id: this.clientBranchId,
    };

    this.clientLocationService.getClientLocationList(params).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };

          // this.convertApiData();
          return;
        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.ClientLocationListLoading = false;
      },
      () => {
        this.ClientLocationListLoading = false;
      }
    );
  }

  convertApiData() {
    this.gridView.data.forEach((item) => {
      if (item.status == 1) {
        item.status = "Active";
      } else {
        item.status = "Inactive";
      }
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

  searchStatus(event) {
    this.search_key = "status";
    this.search_value = event.value;
    this.page = "''";
    if (event.value == null) {
      this.search_key = "";
      this.search_value = "";
    }
    this.skip = 0;
    this.getClientLocationList();
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
    this.getClientLocationList();
  }

  editClientLocation(body): void {
    this.modalRef.hide();
    this.clientLocationService.editClientLocation(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Client Location edited successfully"
          );
          this.modalRef.hide();
          this.getClientLocationList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  // delete method
  // id is sent in json formate not a number as per backend requirement
  deleteClientLocationById(id): void {
    this.clientLocationService.deleteClientLocation(id).subscribe(
      (response: CustomResponse) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess(
            "Client Location deleted sucessfully"
          );
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getClientLocationList();
      }
    );
  }

  onSubmitClientLocation(): void {
    this.clientLocationForm.patchValue({
      company_id: this.companyId,
      client_branch_id: this.clientBranchId,
    });
    if (this.clientLocationForm.invalid) return;

    if (this.editMode) {
      this.clientLocationForm.patchValue({
        id: this.selectedclientLocation.client_location_id,
      });
      this.editClientLocation(this.clientLocationForm.value);
    } else {
      this.addClientLocation(this.clientLocationForm.value);
    }
  }

  addClientLocation(body): void {
    this.modalRef.hide();
    this.clientLocationService.addClientLocation(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Client Location Added successfully"
          );
          this.modalRef.hide();
          this.getClientLocationList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  openAddModal(template: TemplateRef<any>): void {
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Client Location";
    this.selectedclientLocation = null;
    this.buildClientLocationForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  reverseApIData(clientLocation: ClientLocationList) {
    let modifiedClientLocation = {
      client_location_id: clientLocation.client_location_id,
      company_id: clientLocation.company_id,
      client_id: clientLocation.client_id,
      name: clientLocation.name,
      details: clientLocation.details,
      status: null,
      client_branch_id: clientLocation.client_branch_id,
    };
    if (clientLocation.status == "Active") {
      modifiedClientLocation.status = 1;
    } else {
      modifiedClientLocation.status = 0;
    }

    return modifiedClientLocation;
  }

  openEditModel(clientLocation, template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = true;
    this.submitButton = "Edit";
    this.modalTitle = "Edit Client Location";
    console.log("Client Locatiom" + JSON.stringify(clientLocation));
    //const modifiedClientLocation = this.reverseApIData(clientLocation);
    // this.clientLocationService.setSelectedClientLocation(
    //   modifiedClientLocation
    // );

    this.selectedclientLocation = clientLocation;

    this.buildClientLocationForm();
    console.log(this.clientLocationForm.value, "status");
    this.modalRef = this.modalService.show(template, this.config);
  }

  openViewModal(template: TemplateRef<any>, clientLocationDetail): void {
    this.clientLocationDetail = clientLocationDetail;
    this.modalRef = this.modalService.show(template, this.config);
  }

  openConfirmationDialogue(clientLocation: ClientLocationList): void {
    const clientLocationId = {
      id: clientLocation.client_location_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = clientLocation.name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteClientLocationById(JSON.stringify(clientLocationId));
      }
    });
  }
}
