import { DateConverterService } from "./../../../../../shared/services/dateConverter/date-converter.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { ConfirmationDialogComponent } from "./../../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { HolidayModel } from "./../../models/holidayModal";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HolidayService } from "../../holiday-services/holiday.service";
import {
  Component,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { DatePipe } from "@angular/common";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { State, SortDescriptor } from "@progress/kendo-data-query";
@Component({
  selector: "app-list-holiday",
  templateUrl: "./list-holiday.component.html",
  styleUrls: ["./list-holiday.component.scss"],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class ListHolidayComponent implements OnInit {
  holidayManagementForm: FormGroup;
  listLoading: Boolean;
  modalRef: BsModalRef;
  selectedHoliday: HolidayModel;
  submitted: boolean;
  companyId = this.globalService.getCompanyIdFromStorage();
  editMode: boolean;
  submitButton: any;
  modalTitle: any;
  holidayDetail: any;
  dateSetting = this.globalService.getDateSettingFromStorage();
  dateType = this.dateSetting.GS_DATE;
  formdate: any;
  public gridView: GridDataResult;
  paginationMode = true;
  skip = 0;
  constructor(
    private holidayService: HolidayService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toasterMessageService: ToastrMessageService,
    private datePipe: DatePipe,
    private globalService: GlobalService,
    private dateConverterService: DateConverterService
  ) {}

  ngOnInit() {
    this.getHolidays();
    this.buildHolidayForm();
  }

  buildHolidayForm(): void {
    const holiday = this.selectedHoliday;
    if (holiday) {
      this.formdate =
        this.dateType == "E" ? holiday.date : this.adToBsInObject(holiday.date);
    }
    this.holidayManagementForm = this.fb.group({
      title: [holiday ? holiday.title : "", Validators.required],
      date: [holiday ? this.formdate : "", Validators.required],

      description: [holiday ? holiday.description : "", Validators.required],
      company_id: [this.companyId ? this.companyId : 3],
      id: [""],
    });
  }

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "";
  search_value = "";

  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);

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
        const searchTerm = event.filter.filters[0].value;
        const searchField = event.filter.filters[0].field;
        this.search_value = searchTerm;
        this.search_key = searchField;
      } else {
        // normal api call
        this.search_value = "";
        this.search_key = "";
      }
    }
    // search logic ends here
    this.getHolidays();
  }

  /**
   * Call get holiday API
   */
  getHolidays(): void {
    this.listLoading = true;
    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
    };
    this.holidayService.getHolidayList(params).subscribe(
      (response: CustomResponse) => {
        if (response) {
          this.gridView = { data: response.data, total: response.count };

          return;
        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.listLoading = false;
        this.toasterMessageService.showError(error);
      },
      () => {
        this.listLoading = false;
      }
    );
  }

  // method to add holiday
  addHoliday(body): void {
    this.holidayService.addHolidays(body).subscribe(
      (response) => {
        if (response) {
          this.toasterMessageService.showSuccess("Holiday added successfully");
          this.getHolidays();
          this.holidayManagementForm.reset();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  // edit method
  editHoliday(body): void {
    if (this.holidayManagementForm.pristine) {
      this.modalRef.hide();
      return;
    }
    this.holidayService.editHoliday(body).subscribe(
      (response: CustomResponse) => {
        if (response) {
          this.toasterMessageService.showSuccess("Holiday edited successfully");

          this.getHolidays();
          this.holidayManagementForm.reset();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  openEditModel(holiday, template: TemplateRef<any>) {
    this.submitted = false;
    this.editMode = true;
    this.submitButton = "Update";
    this.modalTitle = "Edit Holiday";
    this.holidayService.setselectedHoliday(holiday);
    this.selectedHoliday = this.holidayService.getSelectedHoliday();
    this.buildHolidayForm();
    this.holidayManagementForm.get("id").patchValue(this.selectedHoliday.id);
    this.modalRef = this.modalService.show(template, this.config);
  }

  openAddModal(template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Holiday";
    this.selectedHoliday = null;
    this.buildHolidayForm();
    this.modalRef = this.modalService.show(template, this.config);
  }
  openViewModal(template: TemplateRef<any>, holidayDetail): void {
    this.holidayDetail = holidayDetail;
    this.modalRef = this.modalService.show(template);
  }

  onSubmitHoliday() {
    this.submitted = true;
    if (this.holidayManagementForm.invalid) return;
    if (this.dateType == "N") {
      let date = this.dateConverterService.getNepalidateObjectToString(
        this.holidayManagementForm.value.date
      );
      let dateInEnglish = this.bsToAdInString(date);
      this.holidayManagementForm.get("date").patchValue(dateInEnglish);
    } else {
      // when date type in English date formate.
      // converting date formate
      this.holidayManagementForm.value.date = this.datePipe.transform(
        this.holidayManagementForm.value.date,
        "yyyy-MM-dd"
      );
    }
    if (this.editMode) {
      this.editHoliday(this.holidayManagementForm.value);
    } else {
      this.addHoliday(this.holidayManagementForm.value);
    }
    this.modalRef.hide();
  }
  // delet method section here...
  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  deleteHolidayById(id) {
    this.holidayService.deleteHolidayById(id).subscribe(
      (response: CustomResponse) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess("Holiday deleted sucessfully");
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getHolidays();
      }
    );
  }

  openConfirmationDialogue(holiday: HolidayModel) {
    const holidayId = {
      id: holiday.id,
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = holiday.title;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteHolidayById(holidayId);
      }
    });
  }
  // delet method ends here

  // date formator for nepali date-picker
  dateFormatter(date) {
    const formatedDate = `${date.year}-${parseInt(date.month) + 1}-${date.day}`;
    return formatedDate;
  }

  // accepts string and and returns object
  adToBsInObject(dateString) {
    return this.dateConverterService.adToBsInObject(dateString);
  }

  // accepts string and returns string
  bsToAdInString(dateInBs) {
    return this.dateConverterService.bsToAdInString(dateInBs);
  }
}
