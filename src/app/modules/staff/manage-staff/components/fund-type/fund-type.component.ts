import { Component, Input, OnInit, SimpleChange, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ManageStaffService } from "../../services/manage-staff.service";
import { FundType } from './../../../../utilities/fund-type/model/fund-type.model';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';
import { GlobalService } from "@app/shared/services/global/global.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-fund-type",
  templateUrl: "./fund-type.component.html",
  styleUrls: ["./fund-type.component.scss"],
})
export class FundTypeComponent implements OnInit {
  fundTypeForm: FormGroup;
  @Input() details: any;
  constructor(private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private manageStaffService: ManageStaffService,
    private bsModalService: BsModalService,
    private toastrMessageService: ToastrMessageService,
    private activatedRoute:ActivatedRoute) {

      this.staff_id = this.activatedRoute.snapshot.params['id'];
     }

  ngOnInit() {
    this.buildFundTypeForm();
    this.getFundTypeList();
    this.getAllAssignedFundList();
  }
  ngOnChanges(simpleChange: SimpleChange) {
    console.log("simpleChange", simpleChange)
  }
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  fundTypeList: FundType[] = [];
  getFundTypeList() {
    this.manageStaffService.getFundTypeList().subscribe((res: CustomResponse) => {
      if (res.status) {
        this.fundTypeList = res.data;
      }
    })
  }
  modalRef: BsModalRef;
  openModal(template: TemplateRef<any>) {
    this.buildFundTypeForm();
    this.modalRef = this.bsModalService.show(template, this.config);
  }
  selectedFund: any;
  openMultipleModal(template: TemplateRef<any>){
    this.buildMulitpleForm();
    this.modalRef = this.bsModalService.show(template, Object.assign({}, { class: 'modal-lg-width',
    ignoreBackdropClick: true, backdrop: true,}));
  }
  buildMulitpleForm(): void {
    this.fundTypeForm = this.formBuilder.group({
      fund: this.formBuilder.array([this.addFundTypeFormArray()]),
    });
  }

  addFundTypeFormArray() {
    return this.formBuilder.group({
      fund_type_id: ["",Validators.required],
      percent: ["",Validators.required],
      // tax_apply_from: ["",Validators.required],
      status:["Active",Validators.required],
      isFlat:"true"
    });
  }
  activatedFundType:any = 'true';
  onFundTypeChange(value,index){
    console.log("value and i",value,index);
    let formArr = this.fundTypeForm.get('fund').value;
    if(this.hasDuplicates(formArr)){
      console.log(this.fundTypeForm.get('fund'));
      (this.fundTypeForm.get('fund') as FormArray).controls[index].get('fund_type_id').setValue("");
      // <FormArray>this.fundTypeForm.get('fund').
      //   controls
      // [index]['fund_type_id'].setValue("");
      this.toastrMessageService.showError("Fund type same detected.Please choose another");
      return;
    }
  }
  onFlatOrPercentChange(event){
    this.activatedFundType = event;
    console.log("this is ati",this.activatedFundType);
  }
  hasDuplicates(formArr:any[]=[]){
    if(formArr && formArr.length > 1){
      let constFundTypes = formArr.map(x=>x.fund_type_id);
      console.log("returning",new Set(constFundTypes).size !== constFundTypes.length)
       return new Set(constFundTypes).size !== constFundTypes.length
    }
  }

  addFundType(): void {
    const addFund = this.fundTypeForm.get("fund") as FormArray;
    addFund.push(this.addFundTypeFormArray());
  }

  removeFundTypeFormArray(index, fundList): void {
    (<FormArray>this.fundTypeForm.get("fund")).removeAt(index);
  }
  closeModal() {
    this.modalRef.hide();
  }
  addfundTypeForm: FormGroup;
  buildFundTypeForm() {
    this.addfundTypeForm = this.formBuilder.group({
      fund_type_id: [this.selectedFund ? this.selectedFund.fund_id:"", [Validators.required]],
      percent: [this.selectedFund ? this.selectedFund.fund_percent:"", Validators.required],
      status: [this.selectedFund ? this.selectedFund.status:"Active", Validators.required],
      tax_apply_from:[
        this.selectedFund ? this.selectedFund.tax_apply_from:"",Validators.required
      ],
      isFlat: ['true']
    })
  }
  loadedFundTypeList: any[] = [];
  isSaving:boolean;
  updateFundType() {
    if(this.addfundTypeForm.invalid){return};

    let body = {
      access_token: this.globalService.getAccessTokenFromCookie(),
      company_id:this.globalService.getCompanyIdFromStorage(),
      id: this.selectedFund.staff_fund_id,
      fund_id: this.addfundTypeForm.get('fund_type_id').value,
      staff_id: this.staff_id,
      fund_percent: this.addfundTypeForm.get('percent').value,
      join_date: this.selectedFund.join_date,
      tax_apply_from:this.addfundTypeForm.get('tax_apply_from').value,
      status: this.addfundTypeForm.get('status').value
    }
    this.isSaving = true;
    this.manageStaffService.updateStaffFund(body).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.toastrMessageService.showSuccess("Edited successfully");
        this.getAllAssignedFundList();
        this.isSaving = false;
        this.modalRef.hide();
      }
      else{
        this.toastrMessageService.showError("Staff fund update failed");
      }
    })
  }
  // saveFundType() {
  //   console.log("this form", this.addfundTypeForm.value);
  //   console.log("from parent here is data", this.details)
  //   if (this.addfundTypeForm.invalid) { return };
  //   // console.log("this form",this.addfundTypeForm.value);
  //   // return;
  //   let fund: any[] = this.addfundTypeForm.get("fund_type_id").value;
  //   let fundArr: any[] = [];
  //   fund.forEach(x => {
  //     fundArr.push({
  //       fund_id: x,
  //       fund_percent: this.addfundTypeForm.get('percent').value,
  //       join_date: this.globalService.transformFromDatepicker(new Date()),
  //       // tax_apply_from: string,
  //       status: this.addfundTypeForm.get("status").value
  //     })
  //   });
  //   let body = {
  //     access_token: this.globalService.getAccessTokenFromCookie(),
  //     company_id: this.globalService.getCompanyIdFromStorage(),
  //     staff_id: this.details ? this.details.staff.staff_id : null,
  //     fund: fundArr
  //   }

  //   this.modalRef.hide();
  //   this.manageStaffService.addStaffFundMultiple(body).subscribe((res: CustomResponse) => {
  //     if (res.status) {
  //       this.toastrMessageService.showSuccess("Fund Type assigned succesfully");
  //     }
  //     else {
  //       this.toastrMessageService.showError("Fund type cannot be saved");
  //     }
  //   })
  // }
  openEdit(value,template) {
    this.selectedFund = value;
    // this.buildFundTypeForm();
    this.openModal(template);
  }
  deleteFundType(fund) {
    console.log(fund);
    let body = {
      access_token:this.globalService.getAccessTokenFromCookie(),
      id:fund.staff_fund_id
    }
    this.manageStaffService.removeStaffFund(body).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.toastrMessageService.showSuccess("Staff Fund removed successfully.")
        this.getAllAssignedFundList();
      }
      else{
        this.toastrMessageService.showError("Staff fund cannot be removed now. Please try again");
      }
    })
  }
  staff_id;
  assignedFundList:any[]=[];
  getAllAssignedFundList() {
    console.log("getAllAssignedFundList")
    let body = {
      access_token: this.globalService.getAccessTokenFromCookie(),
      limit: 10,
      page: 1,
      sortnane: "fund_id",
      sortno: 0,
      company_id: this.globalService.getCompanyIdFromStorage(),
      search: {
        staff_id: this.staff_id
      }
  }
  this.manageStaffService.getStaffFundList(body).subscribe((res:CustomResponse)=>{
    if(res.status){
      this.assignedFundList = res.data;
    }
  })
}

addNewFundRow(value){
this.addFundType();
}
onSaveMultiple(){
    if (this.fundTypeForm.invalid) { return };

    let fund: any[] = this.fundTypeForm.get("fund").value;
    let fundArr: any[] = [];
  if(fund.length > 0) {
    fund.forEach(x => {
      fundArr.push({
        fund_id: x.fund_type_id,
        fund_percent: x.percent,
        join_date: this.globalService.transformFromDatepicker(new Date()),
        tax_apply_from: x.tax_apply_from,
        status: x.status
      })
    });
  }
  else{
    return;
  }
    console.log("fund arr",this.fundTypeForm.get('fund').value)
    // return;
    let body = {
      access_token: this.globalService.getAccessTokenFromCookie(),
      company_id: this.globalService.getCompanyIdFromStorage(),
      staff_id: this.details ? this.details.staff.staff_id : null,
      fund: fundArr
    }


    this.manageStaffService.addStaffFundMultiple(body).subscribe((res: CustomResponse) => {
      if (res.status) {
        this.toastrMessageService.showSuccess("Fund Type assigned succesfully");
        this.getAllAssignedFundList();
        this.modalRef.hide();
      }
      else {
        this.toastrMessageService.showError(res.message);
      }
    })
}
}
