import { TemplateRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { GlobalService } from '@app/shared/services/global/global.service';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EmployeegroupService } from './../../services/employeegroup.service';
import { ConfirmationDialogComponent } from './../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { EmployeeGroup } from '../../modals/employeegroup.modal';
import { CustomResponse } from './../../../../../shared/models/custom-response.model';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-employee-group-list',
  templateUrl: './employee-group-list.component.html',
  styleUrls: ['./employee-group-list.component.scss']
})
export class EmployeeGroupListComponent implements OnInit {
  employeeGroupForm: FormGroup;
  searching: boolean;
  loading: boolean;
  employeeTypeList: EmployeeGroup[];
  employeeTypeListCount: number;
  responseStatus: boolean;
  startCount: number;
  endCount: number;
  currentPage: number;
  employeeGroupDetail: EmployeeGroup;
  modalRef: BsModalRef;
  submitButton: string;
  selectedEmployeeGroup: EmployeeGroup;
  submitted: boolean;
  language: any;
  editMode: boolean;
  modalTitle: string;
  companyId = this.globalService.getCompanyIdFromStorage();
  public gridView: GridDataResult;
  paginationMode = true;
  skip = 0;
  constructor(
    private modalService: BsModalService,
    private employeeGroupService: EmployeegroupService,
    private fb: FormBuilder,
    private toasterMessageService: ToastrMessageService,
    private globalService: GlobalService,
  ) { }
  params = {
    access_token: this.globalService.getAccessTokenFromCookie,
    limit: this.globalService.pagelimit,
    page: this.globalService.pageNumber,
    sortnane: "",
    sortno: 1,
    company_id: this.globalService.getCompanyIdFromStorage(),
    search: {
      title: "",
      code: "",
      status: ""
    }
  }

  ngOnInit() {
    this.getEmployeeGroupList();
    this.buildEmployeeGroupForm();
  }

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  // sortno = 2;
  // sortnane = "";
  // search_key = "";
  // search_value = "";

  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);

  buildEmployeeGroupForm() {
    const employeeGroup = this.selectedEmployeeGroup;
    this.employeeGroupForm = this.fb.group({
      title: [
        employeeGroup ? employeeGroup.title : "",
        Validators.required,
      ],
      code: [
        employeeGroup ? employeeGroup.code : "",
        Validators.required,
      ],
      status: [
        employeeGroup ? employeeGroup.status : "Active",
        Validators.required,
      ],
      company_id: [""],
      id: [
        employeeGroup ? employeeGroup.employee_group_id : ""],
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

  dataStateChange(event) {
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
      // console.log("Event filter",event)
      if (event.filter.filters[0]) {
        // search api call
        // this.paginationMode = false;
        const searchTerm = event.filter.filters[0].value;
        const searchField = event.filter.filters[0].field;
        this.params.search[searchField] = searchTerm

        // this.search_value = searchTerm;
        // this.search_key = searchField;
      } else {
        // normal api call
        // this.paginationMode = true;
        // this.search_value = "";
        // this.search_key = "";
        // this.params.search
        this.params.search.status = '';
        this.params.search.code ='';
        this.params.search.title='';
      }
    }
    // search logic ends here
    this.getEmployeeGroupList();
  }

  //  get method
  getEmployeeGroupList(): void {
    this.loading = true;
    this.employeeGroupService.getEmployeeGroupList(this.params).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };

        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }



  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  openViewModal(template: TemplateRef<any>, employeeGroupDetail) {
    this.employeeGroupDetail = employeeGroupDetail;
    this.modalRef = this.modalService.show(template, this.config);
  }

  openAddModal(template: TemplateRef<any>) {
    this.submitted = false;
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Employee Group";
    this.selectedEmployeeGroup = null;
    this.buildEmployeeGroupForm();

    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModel(employeeType, template: TemplateRef<any>) {
    this.submitButton = "Update";
    this.submitted = false;
    this.editMode = true;
    this.modalTitle = "Edit Employee Group";
    this.selectedEmployeeGroup = employeeType;
    // this.employeeGroupService.setSelectedEmployeeType(employeeType);
    // this.selectedEmployeeGroup = this.employeeGroupService.getSelectedEmployeeType();
    this.buildEmployeeGroupForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openConfirmationDialogue(employeeType: EmployeeGroup) {
    const employeeGroupObj = {
      id: employeeType.employee_group_id,
      company_id: employeeType.company_id
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = employeeType.title;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        console.log("Sneding", JSON.stringify(employeeGroupObj));
        // this.deleteEmployeeTypeById(JSON.stringify(employeeTypeId));
        this.onDeleteEmployeeGroupById(employeeGroupObj);
      }
    });
  }

  onSubmitEmployeeType() {
    this.submitted = true;
    if (this.employeeGroupForm.invalid) return;
    this.employeeGroupForm.patchValue({
      company_id: this.companyId,
    });
    if (this.editMode) {
      this.employeeGroupForm.patchValue({
        id: this.selectedEmployeeGroup.employee_group_id,
      });
      this.onEditEmployeeGroup();
      // edit code..
    } else {
     this.onAddEmployeeGroup();
    }
  }


  onAddEmployeeGroup() {
    let bodyObj = {
      access_token: this.params.access_token,
      company_id: this.params.company_id,
      title: this.employeeGroupForm.get('title').value,
      code:  this.employeeGroupForm.get('code').value,
      status:  this.employeeGroupForm.get('status').value
    }
    this.modalRef.hide()
    this.employeeGroupService.onAddEmployeeGroup(bodyObj).subscribe((res: CustomResponse) => {
      if (res.status) {
        this.getEmployeeGroupList();
        this.toasterMessageService.showSuccess("Employee Group added sucessfully.");
      }
      else {
        this.toasterMessageService.showError(res.data);
      }
    })
  }

  onEditEmployeeGroup(){
    let bodyObj = {
      access_token: this.params.access_token,
      company_id: this.selectedEmployeeGroup.company_id,
      title: this.employeeGroupForm.get('title').value,
      code:  this.employeeGroupForm.get('code').value,
      status:  this.employeeGroupForm.get('status').value,
      id:this.employeeGroupForm.get('id').value
    }
    this.modalRef.hide()
    this.employeeGroupService.onEditEmployeeGroup(bodyObj).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.toasterMessageService.showSuccess("Employee Group edited successfully.");
        this.getEmployeeGroupList();
      }
      else{
        this.toasterMessageService.showError(res.data);
      }
    })
  }
  onDeleteEmployeeGroupById(bodyObj){
    this.employeeGroupService.onDeleteEmployeeGroup(bodyObj).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.toasterMessageService.showSuccess("Employee Group Deleted Successfully");
        this.getEmployeeGroupList();
      }
      else{
        this.toasterMessageService.showError(res.data);
      }
    })
  }

}
