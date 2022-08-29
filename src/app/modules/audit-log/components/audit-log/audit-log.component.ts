import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import {
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { State, process, SortDescriptor } from "@progress/kendo-data-query";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { GlobalService } from "../../../../shared/services/global/global.service";
import { AuditLogService } from "../../services/audit-log.service";
import {AuditLog} from "../../modal/auditlog.interface"
import { SearchAuditLog } from "../../modal/search.interface";
@Component({
  selector: "app-audit-log",
  templateUrl: "./audit-log.component.html",
  styleUrls: ["./audit-log.component.scss"],
})
export class AuditLogComponent implements OnInit {
  modalRef: BsModalRef;
  //Kendo Table
  corsForm: FormGroup;
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
    private auditLogService: AuditLogService,
    private fb: FormBuilder,
    private toasterMessageService: ToastrMessageService,
    private globalService: GlobalService,
    // private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.buildCorsOriginForm();
    this.getAuditLogsList();

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
    console.log("event",event)
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
    this.getAuditLogsList();
  }

  auditLog:AuditLog;

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "";
  search_value = "";

  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);


params:SearchAuditLog = {
  access_token:this.globalService.getAccessTokenFromCookie(),
  company_id:0,
  limit:0,
  sortno:0,
  sortnane:"",
  page:0,
  search:{
    user_id:"",
    description:"",
    module:""

  }

}


  //  get method
  getAuditLogsList(): void {
    this.listLoading = true;
    this.params.company_id = this.globalService.getCompanyIdFromStorage();
    this.params.limit = this.pageLimit;
    this.params.page = +this.page;
    if(this.search_key && this.search_value){
      this.params.search = {
        module:"",
        description:"",
        user_id:""
      }
      this.params.search[this.search_key] = this.search_value
    }
    else{
      this.params.search = {
        module:"",
        description:"",
        user_id:""
      }
    }
    // this.params.
    this.auditLogService.getAuditLogs(this.params).subscribe(
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









  onSubmitCorsOrigin(): void {

  }

  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };



  openViewModal(template: TemplateRef<any>, data): void {
   this.auditLog = data;
    this.modalRef = this.modalService.show(template);
  }


}
