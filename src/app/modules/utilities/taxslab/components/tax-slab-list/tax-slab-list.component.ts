import { TemplateRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { EmployeeGroup } from '@app/modules/utilities/employee-group/modals/employeegroup.modal';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CustomResponse } from '@app/shared/models/custom-response.model';
import { GlobalService } from '@app/shared/services/global/global.service';
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { BsDatepickerConfig, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TaxSlab } from '../../modal/TaxSlab.modal';
import { TaxslabService } from '../../services/taxslab.service';
import { FormArray } from '@angular/forms';



@Component({
  selector: 'app-tax-slab-list',
  templateUrl: './tax-slab-list.component.html',
  styleUrls: ['./tax-slab-list.component.scss']
})
export class TaxSlabListComponent implements OnInit {
  taxSlabForm: FormGroup;
  searching: boolean;
  loading: boolean;
  taxSlabList: TaxSlab[];
  taxSlabListCount: number;
  responseStatus: boolean;
  startCount: number;
  endCount: number;
  currentPage: number;
  taxSlabDetail: TaxSlab;
  modalRef: BsModalRef;
  confirmRef: BsModalRef;
  submitButton: string;
  selectedTaxSlab: TaxSlab;
  submitted: boolean;
  language: any;
  editMode: boolean;
  modalTitle: string;
  companyId = this.globalService.getCompanyIdFromStorage();
  public gridView: GridDataResult;
  paginationMode = true;
  skip = 0;
  timeFormatSetting:any;
  date=new Date();
  currentYear = this.date.getFullYear();
  firstFullDate = new Date(this.currentYear,0,1);
  lastFullDate = new Date(this.currentYear,11,30);
  constructor(
    private modalService: BsModalService,
    private taxSlabService: TaxslabService,
    private fb: FormBuilder,
    private toasterMessageService: ToastrMessageService,
    private globalService: GlobalService,
    private localStorageService:LocalStorageService
  ) {
  this.dateFormatSetting =
    this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
    this.configUserDateAndTimeSetting();
  }
  params = {
    access_token: this.globalService.getAccessTokenFromCookie,
    limit: this.globalService.pagelimit,
    page: this.globalService.pageNumber,
    sortnane: "",
    sortno: 1,
    company_id: this.globalService.getCompanyIdFromStorage(),
    search: {
      annual_income: "",
      type: "",
      employee_group_id: "",
      tax_rate: '',
      valid_from:   "",
      valid_to:""
    }
    // this.globalService.transformFromDatepicker(this.firstFullDate)
    // this.globalService.transformFromDatepicker(this.lastFullDate)
  }





  ngOnInit() {
    this.getAllEmployeeGroup();
    // this.getTaxSlabList();
    this.buildtaxSlabForm();
    console.log("date here", new Date(this.currentYear,0,1));
    console.log("last date",new Date(this.currentYear,11,30));
    this.buildSearchForm();
    this.setDate();
  }
  setDate(){
    this.searchForm.get('dateFrom').setValue(
      this.globalService.transformForDatepickerPreview(new Date(this.currentYear,0,1),this.datePickerConfig.dateInputFormat)
    )
      this.searchForm.get('dateTo').setValue(
      this.globalService.transformForDatepickerPreview(new Date(this.currentYear,11,30),this.datePickerConfig.dateInputFormat)
    )
  }

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);
  datePickerConfig: Partial<BsDatepickerConfig>;
  datePickerConfigForTo:Partial<BsDatepickerConfig>;

  buildtaxSlabForm() {
    const taxSlab = this.selectedTaxSlab;
    this.taxSlabForm = this.fb.group({
      valid_to: [
        taxSlab ? this.globalService.transformForDatepickerPreview(taxSlab.valid_to,this.datePickerConfig.dateInputFormat) : "",
        // Validators.required,
      ],
      valid_from: [
        taxSlab ? this.globalService.transformForDatepickerPreview(taxSlab.valid_from,this.datePickerConfig.dateInputFormat) : "",
        // Validators.required,
      ],

      company_id: [""],
      groupname:[""],
      groupcode:[""],
      employee_group_id: [
        taxSlab ? {value:taxSlab.employee_group_id,disabled:this.editMode}: "",
        taxSlab ? null:Validators.required],
      id: [],
      taxSlabArray: this.fb.array([]),
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
      } else {
        this.params.search.type = '';
        this.params.search.valid_to = "";
        this.params.search.valid_from = "";
        this.params.search.employee_group_id = '';
        this.params.search.annual_income = '';
        this.params.search.tax_rate = '';
      }
    }
    // search logic ends here
    this.getTaxSlabList();
  }

  //  get method
  getTaxSlabList(): void {
    this.loading = true;
    this.taxSlabService.getTaxSlabList(this.params).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };

        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        // this.loading = false;
      },
      () => {
        // this.loading = false;
      }
    );
  }


  // modal config to unhide modal when clicked outside
  // config = {
  //   backdrop: true,
  //   ignoreBackdropClick: true,
  //   class:'modal-lg'
  // };
 config =  Object.assign({}, { class: 'modal-lg',
 ignoreBackdropClick: true, backdrop: true,});

  openViewModal(template: TemplateRef<any>, taxSlabDetail) {
    this.taxSlabDetail = taxSlabDetail;
    // this.taxSlabDetail['employee_group_name'] = taxSlabDetail.
    let name  = this.employeeGroupList.filter(x=> x.employee_group_id == taxSlabDetail.employee_group_id)[0].title;
    if(name !== null && name !== undefined){
      this.taxSlabDetail['employee_group_name'] = name;
    }
    this.modalRef = this.modalService.show(template, this.config);
  }

  openAddModal(template: TemplateRef<any>,id) {
    this.selectedTaxSlab = <TaxSlab>{
      employee_group_id : id
    };
    this.submitted = false;
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Tax Slab";
    this.selectedTaxSlab = null;
    this.buildtaxSlabForm();
    this.taxSlabForm.get("employee_group_id").setValue(id);
   this.addTaxSlabArray('upto');
    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModel(taxSlab, template: TemplateRef<any>) {
    this.submitButton = "Update";
    this.submitted = false;
    this.editMode = true;
    this.modalTitle = "Edit Tax Slab";
    this.selectedTaxSlab = taxSlab;
    this.buildtaxSlabForm();

    this.modalRef = this.modalService.show(template, this.config);
  }
  pointedSlab;
  openBulkEditTaxSlab(taxSlab, template: TemplateRef<any>){
   
    this.submitButton = "Update";
    this.submitted = false;
    this.editMode = true;
    this.modalTitle = "Edit Tax Slab";
    this.selectedTaxSlab = taxSlab;
    this.buildtaxSlabForm();
    //  this.selectedTaxSlab = taxSlab;
    // this.pointedSlab = taxSlab;
    this.patchFormValuesForEdit(taxSlab,template);
    // this.modalRef = this.modalService.show(template, this.config);
  }
  patchFormValuesForEdit(taxSlab,template?:any){
    if(this.allTaxListArrayObj[taxSlab.employee_group_id]){
      let filteredArray = this.allTaxListArrayObj[taxSlab.employee_group_id].filter(x=>
        x.employee_group_id == taxSlab.employee_group_id);
        console.log("array in bulk",filteredArray);
        if(filteredArray !== null && filteredArray !== undefined){
          const addBreak = this.taxSlabForm.get("taxSlabArray") as FormArray;
          // addBreak.push(this.addTaxSlabFormGroup(type))
          filteredArray.forEach(x=>{
            addBreak.push(this.addTaxSlabFormGroup(x.type,x.annual_income,x.tax_rate,x.tax_slab_id))
          })
          this.modalRef = this.modalService.show(template, this.config);
        }
    }
    // this.modalRef = this.modalService.show(template, this.config);
  }

  openConfirmationDialogue(taxSlab: TaxSlab) {
    const taxSlabObj = {
      id: taxSlab.tax_slab_id,
      company_id: taxSlab.company_id
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    let name  = this.employeeGroupList.filter(x=> x.employee_group_id == taxSlab.employee_group_id)[0].title;
    if(name !== null && name !== undefined){
      taxSlab['employee_group_name'] = name;
    }
    this.modalRef.content.data = taxSlab.employee_group_name ?taxSlab.employee_group_name :null;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.onDeleteTaxSlab(taxSlabObj);
      }
    });
  }

  openDeleteConfirm(taxSlab,index) {
    const taxSlabObj = {
      id: taxSlab.id,
      company_id: this.companyId
    };

    this.confirmRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );

    this.confirmRef.content.data = taxSlab.type;
    this.confirmRef.content.action = "delete";
    this.confirmRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.onDeleteTaxSlab(taxSlabObj,index);
      }
    });
  }

  onSubmittaxSlab() {
    this.submitted = true;
    if (this.taxSlabForm.invalid) return;
    this.taxSlabForm.patchValue({
      company_id: this.companyId,
    });
    if (this.editMode) {
      // this.taxSlabForm.patchValue({
      //   id: this.selectedTaxSlab.tax_slab_id,
      // });
      this.onEditTaxSlab();

      // edit code..
    } else {
      this.onAddTaxSlab();
      this.isAddDisabled = false;
    }
  }


  onAddTaxSlab() {
    let formValue = this.taxSlabForm.value;
    let error = "";
    if(formValue.taxSlabArray.length > 0){
      error = this.validateTaxSlabArray(formValue);
      if(error !== null ){
        // console.log("REACHED INSIDE",error);
        this.toasterMessageService.showError(error);
        return;
      }
    }

    let data:any[] = [];
    // data.push({
    //   type: this.taxSlabForm.get('type').value,
    //   annual_income: this.taxSlabForm.get('annual_income').value,
    //   tax_rate: this.taxSlabForm.get('tax_rate').value
    // })
  if(formValue.taxSlabArray.length > 0){
    formValue.taxSlabArray.forEach(x=>{
      let taxObj = {
        type: x.type,
        annual_income: x.annual_income,
        tax_rate: x.tax_rate
      }
      data.push(taxObj);
    })
  }

    let bodyObj = {
      access_token: this.params.access_token,
      // annual_income:  this.taxSlabForm.get('annual_income').value,
      // type: this.taxSlabForm.get('type').value,
      employee_group_id: +this.taxSlabForm.get('employee_group_id').value,
      // tax_rate: this.taxSlabForm.get('tax_rate').value,
      // valid_from: this.globalService.transformFromDatepicker(this.taxSlabForm.get('valid_from').value),
      // valid_to: this.globalService.transformFromDatepicker(this.taxSlabForm.get('valid_to').value),
      company_id:this.globalService.getCompanyIdFromStorage(),
      data:data

    }
    this.modalRef.hide()
    this.taxSlabService.onAddTaxSlab(bodyObj).subscribe((res: CustomResponse) => {
      if (res.status) {
        // this.getTaxSlabList();
        this.params.search.employee_group_id ='';
        this.getAllEmployeeGroup();
        this.toasterMessageService.showSuccess("Tax Slab added sucessfully.");
      }
      else {
        this.toasterMessageService.showError("Tax Slab cannot be added");
      }
    })
  }

getFormValue(controlName:string){
    return this.taxSlabForm.get(controlName).value;
  }
  validateTaxSlabArray(formValue){

    if(formValue.taxSlabArray.length > 0){
      let error = null;
      formValue.taxSlabArray.forEach(x=>{
        if(x.tax_rate > 100){
          error = "Tax Rate cannot be greater than 100.";
          // console.error(error);
          // this.toasterMessageService.showError("Tax Rate cannot be greater than 100.");
          return ;
        }
        else if(!x.tax_rate){
          error = "Tax rate is required";
          return ;
        }
        else if (!x.annual_income){
          error = "Annual Income is required";return error;
        }
        else if (!x.type){
          console.log("x.tye",x.type);
          error = "Tax slab type is required";
          return ;
        }
        else{
          error = null;
          return ;
        }
      })
      return error;
    }
  }

  onEditTaxSlab() {
    let formWholeData = this.taxSlabForm.value;
    let hasError = "";
    if(formWholeData.taxSlabArray.length > 0){
      console.log("formWholeData.taxSlabArray;",formWholeData.taxSlabArray);
      hasError = this.validateTaxSlabArray(formWholeData);
      console.log(hasError);
      if(hasError !== null ){
        this.toasterMessageService.showError(hasError);
        return;
      }
    }

    let data:any[] = [];
  if(formWholeData.taxSlabArray.length > 0){
    formWholeData.taxSlabArray.forEach(x=>{
      let taxObj = {
        type: x.type,
        annual_income: x.annual_income,
        tax_rate: x.tax_rate,
        id:x.id
      }
      data.push(taxObj);
    })

  }
  let bodyObj = {
    // valid_from: this.globalService.transformFromDatepicker(this.taxSlabForm.get('valid_from').value),
    // valid_to: this.globalService.transformFromDatepicker(this.taxSlabForm.get('valid_to').value),
    access_token: this.params.access_token,
    company_id:this.companyId,
    employee_group_id: this.selectedTaxSlab ? this.selectedTaxSlab.employee_group_id:this.taxSlabForm.get("employee_group_id").value,
    data:data
    }
    this.modalRef.hide()
    this.taxSlabService.onEditTaxSlab(bodyObj).subscribe((res: CustomResponse) => {
      if (res.status) {
        this.toasterMessageService.showSuccess("Tax Slab edited successfully.");
        this.params.search.employee_group_id ='';
        this.getAllEmployeeGroup();
        this.isAddDisabled = false;
        // this.getTaxSlabList();
      }
      else {
        this.toasterMessageService.showError("Tax Slab was failed editing");
      }
    })
}
  onDeleteTaxSlab(bodyObj,index?:any) {
    this.taxSlabService.onDeleteTaxSlab(bodyObj).subscribe((res: CustomResponse) => {
      if (res.status) {
        this.toasterMessageService.showSuccess("Tax Slab Deleted Successfully");
        // this.getTaxSlabList();
        this.params.search.employee_group_id ='';
        this.getAllEmployeeGroup();
      if(index !== undefined && index !== null){
        // console.log(index)
        (<FormArray>this.taxSlabForm.get("taxSlabArray")).removeAt(index);
        if(index == 0){
          this.modalRef.hide()
        }
       
      }
      }
      else {
        this.toasterMessageService.showError("Cannot delete taxslab");
      }
    })
  }
  dateFormatSetting:any;
  settingFromCompanyWise: any;
  configUserDateAndTimeSetting() {
    //if no userpreference
    this.settingFromCompanyWise = this.localStorageService.getLocalStorageItem(
      "setting_list"
    )
      ? this.localStorageService.getLocalStorageItem("setting_list")
      : null;
    if (!this.dateFormatSetting) {
      let generalDateFormatSetting = this.settingFromCompanyWise.filter(
        (x) => x.code == "GS_DT_FORMAT"
      )[0];
      this.datePickerConfig = Object.assign(
        {},
        {
          containerClass: "theme-dark-blue",
          showWeekNumbers: false,
          // minDate: new Date(),
          dateInputFormat:
            generalDateFormatSetting && generalDateFormatSetting.value == "0"
              ? "YYYY/MM/DD"
              : "MM/DD/YYYY",
        }
      );
      this.datePickerConfigForTo = Object.assign(
        {},
        {
          containerClass: "theme-dark-blue",
          showWeekNumbers: false,
          // minDate: new Date(),
          dateInputFormat:
            generalDateFormatSetting && generalDateFormatSetting.value == "0"
              ? "YYYY/MM/DD"
              : "MM/DD/YYYY",
        }
      );
    }
    //if user has userpreference
    else {
      this.datePickerConfig = Object.assign(
        {},
        {
          containerClass: "theme-dark-blue",
          showWeekNumbers: false,
          // minDate: new Date(),
          // dateInputFormat: "MM/DD/YYYY",
          dateInputFormat:
            this.dateFormatSetting &&
            this.dateFormatSetting.value == "yyyy/mm/dd"
              ? "YYYY/MM/DD"
              : "MM/DD/YYYY",
        }
      );
      this.datePickerConfigForTo = Object.assign(
        {},
        {
          containerClass: "theme-dark-blue",
          showWeekNumbers: false,
          // minDate: new Date(),
          // dateInputFormat: "MM/DD/YYYY",
          dateInputFormat:
            this.dateFormatSetting &&
            this.dateFormatSetting.value == "yyyy/mm/dd"
              ? "YYYY/MM/DD"
              : "MM/DD/YYYY",
        }
      );
    }
  }
  onDateFromChange(value)
  {
    this.datePickerConfigForTo.minDate = new Date(value);
  }
employeeGroupList:EmployeeGroup[] = [];
  getAllEmployeeGroup(onlyEmployeeList?:boolean,autoSelectId?:any){
    this.taxSlabService.getAllEmployeeGroup().subscribe((res:CustomResponse)=>{
      if(res.status){
        this.employeeGroupList = res.data;
      if(!onlyEmployeeList){
        this.employeeGroupList.forEach(x=>{
          this.getTaxSlabListByItsId(x.employee_group_id);
        })
      }
      if(autoSelectId){
        this.taxSlabForm.get('employee_group_id').setValue(autoSelectId);
      }
      }
      else{
        this.employeeGroupList = [];
      }
    })

  }
  setDateTo(event){
    this.taxSlabForm.get("valid_to").patchValue(event);
    this.onDateFromChange(event)
  }
  allTaxListArrayObj:any=<any>{};
  getTaxSlabListByItsId(id,searchName?:string){
      this.loading = true;
      this.params.search.employee_group_id = id;
      this.taxSlabService.getTaxSlabList(this.params).subscribe(
        (response: CustomResponse) => {
          if (response.status) {
            let groupid = String(id);
            // this.gridView = { data: response.data, total: response.count };
            this.allTaxListArrayObj[groupid]=response.data;
          } else {
            // this.gridView = { data: [], total: 0 };
            let groupid = String(id);
            this.allTaxListArrayObj[groupid]=[]
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

  removeTaxSlab(index, breakList): void {
    if(breakList.value.type =='above'){
      this.isAddDisabled = false;
    }
  
    if(breakList.value.id){
      // this.openConfirmationDialogue(breakList.value);
      this.openDeleteConfirm(breakList.value,index);
    }
   else{
    (<FormArray>this.taxSlabForm.get("taxSlabArray")).removeAt(index);
   }
    // this.removeBreak.push({ is_remove: "1", id: breakList.get("id").value });
  }
  addTaxSlabArray(type?:string){
    if(this.isAddDisabled){
      return;
    }
    const addBreak = this.taxSlabForm.get("taxSlabArray") as FormArray;
   type ?  addBreak.push(this.addTaxSlabFormGroup(type)): addBreak.push(this.addTaxSlabFormGroup(null));;
  }
  addTaxSlabFormGroup(type?:string,annualincome?:any,tax_rate?:any,id?:any) {
    
    if(type == 'above'){
      this.isAddDisabled = true;
    }
    return this.fb.group({
      id:[id?id:""],
      type: [type ? type:"",],
      annual_income: [annualincome? annualincome:""],
      tax_rate: [tax_rate?tax_rate:''],
    });
  }
  isAddDisabled:boolean;
  onTypeChange(value,index,taxSlab?:any){
  
    if(value == 'above'){
      this.isAddDisabled = true;
      let length = (<FormArray>this.taxSlabForm.get("taxSlabArray")).length;
      if(index == length){
        this.removeTaxSlab(index,null);
      }else if(index < length ){
        const control = <FormArray>this.taxSlabForm.controls['taxSlabArray'];
        for(let i = control.length-1; i > index; i--) {
            control.removeAt(i)
    }
      }

    }
    else{
      this.isAddDisabled = false;
    }
  }
  isAddEmployeeGroup:boolean = false;
  addEmployeeGroup(e){
    this.isAddEmployeeGroup = !this.isAddEmployeeGroup;

  }
  saveEmployeeGroup(){
   let  title = this.taxSlabForm.get('groupname').value;
    let code =  this.taxSlabForm.get('groupcode').value;
    if(!title){
      this.toasterMessageService.showError("Group Name is Required");
      return;
    }
    else if(!code){
      this.toasterMessageService.showError("Group Code is Required");
      return;
    }
    let bodyObj = {
      access_token: this.params.access_token,
      company_id: this.params.company_id,
      title: this.taxSlabForm.get('groupname').value,
      code:  this.taxSlabForm.get('groupcode').value,
      status: 'Active'
    }
    this.taxSlabService.onAddEmployeeGroup(bodyObj).subscribe((data:CustomResponse)=>{
      if(data.status){
        this.toasterMessageService.showSuccess("Employee Group added sucessfully.");
        this.getAllEmployeeGroup(true,data.data.employee_group_id);
        this.isAddEmployeeGroup = false;
      }
      else{
        this.toasterMessageService.showError("Employee Group cannot be saved");
      }
    })
  }
  onIncomeChange(){}
  setValidFrom(event,value,index){

    this.allTaxListArrayObj[value.employee_group_id][index].valid_from = this.globalService.transformFromDatepicker(event)
  }
  setValidTo(event,value,index){
    // console.log(event,value)
    this.allTaxListArrayObj[value.employee_group_id][index].valid_to = this.globalService.transformFromDatepicker(event)
  }

  onUpdateTaxSlab(taxSlab,index){
    let tax_rate = this.allTaxListArrayObj[taxSlab.employee_group_id][index].tax_rate;
    let income = this.allTaxListArrayObj[taxSlab.employee_group_id][index].annual_income;
    // this.allTaxListArrayObj[taxSlab.employee_group_id][index]
    if(tax_rate < 0){
      this.toasterMessageService.showError("Tax Rate cannot be negative");
      return;
    }
    if(income < 0){
      this.toasterMessageService.showError("Income cannot be negative");
      return;
    }
   let taxSlabObj =  this.allTaxListArrayObj[taxSlab.employee_group_id][index];
   this.updateTaxSlab(taxSlabObj);
  }
  updateTaxSlab(taxSlabObj){
      let bodyObj = {
        access_token: this.params.access_token,
        annual_income: taxSlabObj.annual_income,
        type: taxSlabObj.type,
        employee_group_id: taxSlabObj.employee_group_id,
        tax_rate: taxSlabObj.tax_rate,
        // valid_from: taxSlabObj.valid_from,
        // valid_to: taxSlabObj.valid_to,
        id: taxSlabObj.tax_slab_id,
        company_id:taxSlabObj.company_id
      }
      // this.modalRef.hide()
      this.taxSlabService.onEditTaxSlab(bodyObj).subscribe((res: CustomResponse) => {
        if (res.status) {
          this.toasterMessageService.showSuccess("Tax Slab edited successfully.");
          this.params.search.employee_group_id ='';
          this.getAllEmployeeGroup();
        }
        else {
          this.toasterMessageService.showError("Tax cannot be edited.");
        }
      })

  }
  isCollapsed:boolean = false;
  searchForm:FormGroup;
  buildSearchForm(){
    this.searchForm = this.fb.group({
      dateFrom:[''],
      dateTo:[""]
    })
  }
  onSearchClicked(){
    this.submitted = true;
    if(this.searchForm.invalid){return}
    else{
     
      this.params.search.valid_from = this.globalService.transformFromDatepicker(this.searchForm.value.dateFrom)
      this.params.search.valid_to = this.globalService.transformFromDatepicker(this.searchForm.value.dateTo)
      this.getAllEmployeeGroup();
    }
  }
  onReset(){
    this.searchForm.reset();
  }

}
