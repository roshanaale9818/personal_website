import { CustomResponse } from "@app/shared/models/custom-response.model";
import { WeekendManagementService } from "../../services/weekend-management.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { GlobalService } from "@app/shared/services/global/global.service";
@Component({
  selector: "app-list-weekend",
  templateUrl: "./list-weekend.component.html",
  styleUrls: ["./list-weekend.component.scss"],
})
export class ListWeekendComponent implements OnInit {
  weekendForm: FormGroup;
  modalRef: BsModalRef;
  weekendListLoading: boolean;
  weekendListCount: number;
  checkedStatus:boolean = false;
  dayList = [];
  weekendList;
  weekend: any;
  isMarked = false;
  dayExist: boolean;
  index;
  companyId = this.globalService.getCompanyIdFromStorage();

  weekendArray = [];
  constructor(
    private modalService: BsModalService,
    private weekendService: WeekendManagementService,
    private fb: FormBuilder,
    private toasterMessageService: ToastrMessageService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    // this.getWeekendList();
    this.initializeDaysList();
    this.getWeekendArray();
  }
  savedWeekendArray:any[]=[];
  getWeekendArray(){
    this.weekendSendingArray = [];
    this.weekendService.getWeekendArray().subscribe((data:CustomResponse)=>{
      console.log(data);
      if(data.status){
        this.savedWeekendArray = data.data;
        data.data.forEach(x=>{
          this.dayList.filter(y=> y.day == x.day)[0].checked = true;
          this.dayList.filter(y=> y.day == x.day)[0]['reg_id'] = x.reg_id;
        })
      }
    })
  }

  initializeDaysList() {
    this.dayList = [
      { day: "Sunday", checked: this.checkedStatus },
      { day: "Monday", checked: this.checkedStatus },
      { day: "Tuesday", checked: this.checkedStatus },
      { day: "Wednesday", checked: this.checkedStatus },
      { day: "Thrusday", checked: this.checkedStatus },
      { day: "Friday", checked: this.checkedStatus },
      { day: "Saturday", checked: this.checkedStatus },
    ];
  }

  // get weekend list
  getWeekendList(): void {
    this.weekendListLoading = true;
    this.weekendService.getWeekendList().subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.weekendList = response.data;
          this.weekendListCount = response.count;
          this.setvalueChecked();

          return;
        }
        else if (response.data == "empty") {
          this.weekendList = [];
          this.weekendListCount = 0;
          this.setvalueChecked();
        }
      },
      (error) => {
        this.weekendListLoading = false;
      },
      () => {
        this.weekendListLoading = false;
      }
    );
  }

  setvalueChecked(): void {
    // reinitializing inoder to prevent being checked even after delete..
    this.initializeDaysList();
    this.dayList.forEach((item, index) => {
      if (this.weekendList !== undefined) {
        this.weekendList.forEach((element) => {
          if (item.day === element.day) {
            this.dayList[index].checked = true;
          }
        });
      }
    });
  }
  onCancel(){
    this.weekendSendingArray = [];
    this.initializeDaysList
    this.getWeekendArray();
  }

  onSubmit(): void {
    if(!this.weekendSendingArray.length){
      this.toasterMessageService.showWarning("No any changes to be saved");
      return;
    }
    // if(this.weekendArray.length == 0){
    //   this.toasterMessageService.showError('Plesae select new days for weekends.');
    //   return;
    // }
    // this.modalRef.hide();
    this.weekendService.addWeekends(this.weekendSendingArray).subscribe(
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

  selectWeekend(event: Boolean, day): void {
    this.dayExist = false;
    if (event) {
      let weekend = {
        day: day.day,
        company_id: this.companyId,
      };

      let existDay = this.weekendList.filter(x => x.day === day.day)[0];

      if (existDay != null || existDay !== undefined) {
        this.toasterMessageService.showError('This day is already in weekends.');
        return;
      }
      if (this.weekendArray == null) {
        this.weekendArray.push(weekend);
      } else {
        this.weekendArray.forEach((item) => {
          if (item.day === day.day) {
            this.dayExist = true;
          }
        });
        if (!this.dayExist) {
          this.weekendArray.push(weekend);
        }
      }
    } else {

      // // idententifying the index of unchecked day
      // this.weekendArray.forEach((item, index) => {
      //   if (item.day === day.day) {
      //     this.index = index;
      //   }
      // });
      // // deleting the day from array when unchecked
      // this.weekendArray.splice(this.index, 1);
      // let weekend = {
      //   day: day.day,
      //   company_id: this.companyId,
      // };
      let index = this.weekendArray.findIndex(x=> x.day === day.day);
      if (index > -1) {
        this.weekendArray.splice(index, 1);
      }

    }
  }
  deleteWeekendById(id): void {
    this.weekendService.deleteWeekend(id).subscribe(
      (response: CustomResponse) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess("Weekend deleted sucessfully");
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getWeekendList();
      }
    );
  }

  // modal config to unhide modal when clicked outside of modal.
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  openModal(template: TemplateRef<any>): void {
    this.setvalueChecked();
    this.weekendArray = [];
    this.modalRef = this.modalService.show(template, this.config);
  }

  openConfirmationDialogue(weekend): void {
    const weekendId = {
      id: weekend.reg_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = weekend.day;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteWeekendById(JSON.stringify(weekendId));
      }
    });
  }
  hoveredWeekend: any;
  hoveredIndex: any;
  onHoverIn(data, index) {
    this.hoveredWeekend = data;
    this.hoveredIndex = index;
  }
  weekendSendingArray:any[] = [];
  selectWeekendForSave(checked:boolean,value){
    console.log("checked",checked,value)
    if(checked == true){
      let dayObj ={
        day:value.day,
        id:null,
        is_remove:0
      }
      this.weekendSendingArray.push(dayObj);

    }
    else{
      let exist = this.savedWeekendArray.filter(x=>x.day == value.day)[0];
      if(exist){
        console.log("reached inside",value)
      let dayObj ={
        day:value.day,
        id:value.reg_id,
        is_remove:1
      }
      this.weekendSendingArray.push(dayObj);
    }
    else{
      return;
    }
  }

  }
}
