import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShiftList } from '@app/modules/utilities/shift/modal/shiftList.modal';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CustomResponse } from '@app/shared/models/custom-response.model';
import { GlobalService } from '@app/shared/services/global/global.service';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GuideService } from '../../service/guide.service';


@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {
  personalDetails!: FormGroup;
  addressDetails!: FormGroup;
  educationalDetails!: FormGroup;
  personal_step = false;
  address_step = false;
  education_step = false;
  weekendForm: FormGroup;
  checkedStatus: boolean = false;
  dayList = [
    { day: "Sunday", checked: this.checkedStatus, is_remove: 1 },
    { day: "Monday", checked: this.checkedStatus, is_remove: 1 },
    { day: "Tuesday", checked: this.checkedStatus, is_remove: 1},
    { day: "Wednesday", checked: this.checkedStatus, is_remove: 1},
    { day: "Thursday", checked: this.checkedStatus, is_remove: 1},
    { day: "Friday", checked: this.checkedStatus ,is_remove:1},
    { day: "Saturday", checked: this.checkedStatus, is_remove: 1 },
  ];

  step = 1;
  constructor(private formBuilder: FormBuilder,
    private guideService: GuideService,
    private toasterMessageService: ToastrMessageService,
    private globalService:GlobalService,
    private modalService: BsModalService,
  ) { }
  ngOnInit() {
    this.personalDetails = this.formBuilder.group({
      name: [''],
      email: [''],
      phone: ['']
    });
    this.addressDetails = this.formBuilder.group({
      city: [''],
      address: [''],
      pincode: ['',]
    });
    this.educationalDetails = this.formBuilder.group({
      highest_qualification: [''],
      university: [''],
      total_marks: ['']
    });
    // this.workingShiftForm = this.formBuilder.group({
    //   start_time:['09:00:00',Validators.required],
    //   end_time:['18:00:00',Validators.required]
    // });
    this.buildShiftForm();
    this.buildDepartmentForm();
    this.buildfundTypeForm();
  }
  fundTypeForm: FormGroup;
  selectedFundType: any;
  buildfundTypeForm() {
    this.fundTypeForm = this.formBuilder.group({
      company_id: '',
      id: this.selectedFundType ? this.selectedFundType.fund_id : "",
      title: [
        this.selectedFundType ? this.selectedFundType.title : "",
        [Validators.required],
      ],
      details: [
        this.selectedFundType ? this.selectedFundType.details : "",
        [Validators.required],
      ],
      tax_apply: [
        this.selectedFundType ? this.selectedFundType.tax_apply : "",
        [Validators.required],
      ],
      // status: [this.selectedFundType ? this.selectedFundType.status : "Active"],
    });
  }
  get personal() { return this.personalDetails.controls; }
  get education() { return this.educationalDetails.controls; }
  get address() { return this.addressDetails.controls; }
  next() {
    console.log("this is step init", this.step);
    if (this.step == 1) {
      this.personal_step = true;
      // if (this.personalDetails.invalid) { return  }
      this.step++
    }
    else if (this.step == 2) {
      this.address_step = true;
      // if (this.addressDetails.invalid) { return }
      this.step++;
    }
    //   else if(this.step==3){
    //         this.step++;
    // }
    console.log("this is step", this.step);
  }
  previous() {
    this.step--
    if (this.step == 1) {
      this.personal_step = false;
    }
    if (this.step == 2) {
      this.education_step = false;
    }
  }
  submit() {
    if (this.step == 3) {
      this.education_step = true;
      // if (this.educationalDetails.invalid)
      //  { return }
    }
  }
  savePersonal() {

  }
  savedWeekendArray: any[] = [];
  getWeekendArray() {
    this.weekendSendingArray = [];
    this.guideService.getWeekendArray().subscribe((data: CustomResponse) => {
      console.log(data);
      if (data.status) {
        this.savedWeekendArray = data.data;
        data.data.forEach(x => {
          this.dayList.filter(y => y.day == x.day)[0].checked = true;
          this.dayList.filter(y => y.day == x.day)[0]['reg_id'] = x.reg_id;
        })
      }
    })
  }
  weekendSendingArray: any[] = [];
  selectWeekendForSave(checked: boolean, value) {
    console.log("adsad",value);
    if (checked) {
      value.is_remove = 0
    }
    else {
      value.is_remove = 1
    }


  }
  workingShiftForm: FormGroup;
  departmentForm: FormGroup;
  selectedShift;
  buildShiftForm() {
    const shift = this.selectedShift;
    this.workingShiftForm = this.formBuilder.group({
      name: [shift ? shift.name : "", Validators.required],
      shift_from: [shift ? shift.shift_from : "", [Validators.required]],
      shift_to: [shift ? shift.shift_to : "", [Validators.required]],
      sunday: [shift ? shift.sunday : ""],
      monday: [shift ? shift.monday : ""],
      tuesday: [shift ? shift.tuesday : ""],
      wednesday: [shift ? shift.wednesday : ""],
      thursday: [shift ? shift.thursday : ""],
      friday: [shift ? shift.friday : ""],
      saturday: [shift ? shift.saturday : ""],
      late_warn_time: [shift ? shift.late_warn_time : "", Validators.required],
      check_in_restriction: [shift ? shift.check_in_restriction : ""],
      break_time: [shift ? shift.break_time : ""],
      company_id: [""],
      id: [""],
    });
  }
  onShiftEdit(item){
    this.selectedShift = item;
    this.editShiftMode = true;
    this.buildShiftForm();
  }
  selectedDepartment;
  buildDepartmentForm(): void {

    const department = this.selectedDepartment;
    this.departmentForm = this.formBuilder.group({
      department_name: [
        department ? department.department_name : "",
        Validators.required,
      ],
      description: [
        department ? department.description : "",
        Validators.required,
      ],
      company_id: [""],
      id: [""],
    });
  }
  // let dayObj ={
  //   day:value.day,
  //   id:value.reg_id,
  //   is_remove:1
  // }
  onWeekendSubmit(): void {
    // if (!this.weekendSendingArray.length) {
    //   this.toasterMessageService.showWarning("Please select at least one.");
    //   return;
    // }
    // console.log("returing", this.weekendSendingArray);
    // return;
    let array = [];
    console.log("array", this.dayList);
    this.dayList.forEach(x => {
      if (x.is_remove == 0) {
        let dayObj = {
          day: x.day,
          id: null,
          is_remove: 0
        }
        array.push(dayObj);
      }
    })
    if (array.length == 0) {
      this.toasterMessageService.showWarning("Please select at least one.");
      return;
    }
    console.log("sending",array);

    // return;

    this.guideService.addWeekends(array).subscribe(
      (response: CustomResponse) => {
        if (response) {
          this.toasterMessageService.showSuccess("Weekends added successfully");
        }

        // this.modalRef.hide();
        // this.getWeekendList();
        this.getWeekendArray();
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = "2";
  sortnane = "";
  search_key = "";
  search_value = "";
  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);


  shiftList:any[];
  getShiftList(): void {
    // this.shiftListLoading = true;

    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
    };
//     break_time: null
// check_in_restriction: "00:30:00"
// company_id: 1
// friday: true
// late_warn_time: "00:30:00"
// monday: true
// name: "Day Shift"
// saturday: false
// shift_from: "09:00:00"
// shift_id: 28
// shift_to: "18:00:00"
// sunday: false
// thursday: true
// tuesday: true
// wednesday: true

    this.guideService.getShiftList(params).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.shiftList = response.data;
          // this.gridView = { data: response.data, total: response.count };

          return;
        } else {
          this.shiftList = [];
          // this.gridView = { data: [], total: 0 };

        }
      },
      // (error) => {
      //   // this.shiftListLoading = false;
      // },
      // () => {
      //   this.shiftListLoading = false;
      // }
    );
  }
    // add shift..
    addShift(body): void {
      this.guideService.addShift(body).subscribe(
        (response: CustomResponse) => {
          if (response.status) {
            this.toasterMessageService.showSuccess("Shift Added successfully");

            // this.modalRef.hide();

            this.getShiftList();
          }
        },
        (error) => {
          this.toasterMessageService.showError(error);
        }
      );
    }
    editShiftMode:boolean = false;
    companyId = this.globalService.getCompanyIdFromStorage();
    onSubmitShift(): void {
      // this.submitted = true;

      if (this.workingShiftForm.invalid) return;
      this.workingShiftForm.patchValue({
        company_id: this.companyId,
      });

      if (this.editShiftMode) {
        this.workingShiftForm.patchValue({
          id: this.selectedShift.shift_id,
        });
        // this.changeTimeFormate();
        this.setCheckedValues();

        this.editShift(this.workingShiftForm.value);
      } else {
        // this.changeTimeFormate();
        this.setCheckedValues();
        this.addShift(this.workingShiftForm.value);
      }
    }
    setCheckedValues(): void {
      if (this.workingShiftForm.value.sunday == true) {
        this.workingShiftForm.value.sunday = "1";
      } else {
        this.workingShiftForm.value.sunday = "0";
      }
      if (this.workingShiftForm.value.monday == true) {
        this.workingShiftForm.value.monday = "1";
      } else {
        this.workingShiftForm.value.monday = "0";
      }
      if (this.workingShiftForm.value.tuesday == true) {
        this.workingShiftForm.value.tuesday = "1";
      } else {
        this.workingShiftForm.value.tuesday = "0";
      }
      if (this.workingShiftForm.value.wednesday == true) {
        this.workingShiftForm.value.wednesday = "1";
      } else {
        this.workingShiftForm.value.wednesday = "0";
      }
      if (this.workingShiftForm.value.thursday == true) {
        this.workingShiftForm.value.thursday = "1";
      } else {
        this.workingShiftForm.value.thrusday = "0";
      }
      if (this.workingShiftForm.value.friday == true) {
        this.workingShiftForm.value.friday = "1";
      } else {
        this.workingShiftForm.value.friday = "0";
      }
      if (this.workingShiftForm.value.saturday == true) {
        this.workingShiftForm.value.saturday = "1";
      } else {
        this.workingShiftForm.value.saturday = "0";
      }
    }
    editShift(body): void {
      if (this.workingShiftForm.pristine) {
        // this.modalRef.hide();
        return;
      }
      this.guideService.editShift(body).subscribe(
        (response: CustomResponse) => {
          if (response.status) {
            this.toasterMessageService.showSuccess("Shift edited successfully");

            // this.modalRef.hide();

            this.getShiftList();
          }
        },
        (error) => {
          this.toasterMessageService.showError(error);
        }
      );
    }
    modalRef: BsModalRef;
     // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
    openDeleteShiftConfirmation(shift: ShiftList): void {
      const shiftId = {
        id: shift.shift_id,
      };

      this.modalRef = this.modalService.show(
        ConfirmationDialogComponent,
        this.config
      );
      this.modalRef.content.data = shift.name;
      this.modalRef.content.action = "delete";
      this.modalRef.content.onClose.subscribe((confirm) => {
        if (confirm) {
          this.deleteShiftById(JSON.stringify(shiftId));
        }
      });
    }
    // delet method
  deleteShiftById(id): void {
    this.guideService.deleteShift(id).subscribe(
      (response: CustomResponse) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess("Shift deleted sucessfully");
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getShiftList();
      }
    );
  }

  fundTypeList:any[];
  // get fund type list
  getFundTypeList(): void {
    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      company_id: this.companyId,
      search: {
        title: "",
        details: "",
        status: "",
      },
    };


    this.guideService
      .getFundTypeList(params)
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.fundTypeList = response.data;

        } else {
          this.fundTypeList = []
        }
      });
  }

  deleteFundType(dataItem) {
    console.log(dataItem);
    const body = {
      id: dataItem.fund_id,
      company_id:dataItem.company_id
    };
    this.guideService.deleteFundTypeList(body).subscribe(
      (response:CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("Fund deleted successfully");
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getFundTypeList();
      }
    );
  }
  // submit fund type method
  fundtypeEditMode:boolean = false;
  onSubmitFundType() {
    if (this.fundTypeForm.invalid) return;
    this.fundTypeForm.patchValue({
      company_id: this.companyId,
    });
    if (this.fundtypeEditMode) {
      this.fundTypeForm.patchValue({
        id: this.selectedFundType.fund_id,
      });
      this.editFundType(this.fundTypeForm.value);
      // edit code..
    } else {
      this.addFundType(this.fundTypeForm.value);
    }
  }
  //edit fundtype
  editFundType(body) {
    if (this.fundTypeForm.pristine) {
      // this.modalRef.hide();
    }
    this.guideService.updateFundTypeList(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("Fund is edited successfully");
          this.getFundTypeList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
    // add fund method
    addFundType(body) {
      this.guideService.addFundTypeList(body).subscribe(
        (response: CustomResponse) => {
          if (response.status) {
            this.toasterMessageService.showSuccess(
              "Fund type is added successfully."
            );
            this.getFundTypeList();
          }
        },
        (error) => {
          this.toasterMessageService.showError(error);
        }
      );
    }
    onFundEditClick(item){
      this.selectedFundType = item;
      this.buildfundTypeForm();
    }
    openDeleteFundTypeConfirmation(fundtype): void {
      // const fundObj = {
      //   id: fundtype.fund_id
      // };

      this.modalRef = this.modalService.show(
        ConfirmationDialogComponent,
        this.config
      );
      this.modalRef.content.data = fundtype.title;
      this.modalRef.content.action = "delete";
      this.modalRef.content.onClose.subscribe((confirm) => {
        if (confirm) {
          this.deleteFundType(fundtype);
        }
      });
    }



}
