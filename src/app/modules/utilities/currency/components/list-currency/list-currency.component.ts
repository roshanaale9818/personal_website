import { CustomResponse } from "../../../../../shared/models/custom-response.model";
import { CurrencyService } from "../../services/currency.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { DatePipe } from "@angular/common";

import { FormBuilder, Validators, FormGroup } from "@angular/forms";

import {
  Component,
  OnInit,
  TemplateRef,
} from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

import {
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { Currency } from "../../modal/currency.modal";
@Component({
  selector: "app-list-currency",
  templateUrl: "./list-currency.component.html",
  styleUrls: ["./list-currency.component.scss"],
  providers: [DatePipe],
})
export class ListCurrencyComponent implements OnInit {
  currencyForm: FormGroup;
  selectedCurrency: Currency;
  modalRef: BsModalRef;
  submitted: boolean;
  language: any;
  editMode: boolean;
  paginationMode = true;

  submitButton: string;
  modalTitle: string;
  companyId = this.globalService.getCompanyIdFromStorage();
  currencyListLoading: boolean;
  public gridView: GridDataResult;
  skip = 0;
  currentDate: Date = new Date();
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private toasterMessageService: ToastrMessageService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    this.buildcurrencyForm();
    this.getCurrrencyList();
  }

  buildcurrencyForm() {
    const currency = this.selectedCurrency;
    this.currencyForm = this.fb.group({
      name:[currency ? currency.name:"",Validators.required],
      id:[''],
      symbol:[currency ? currency.symbol:'',Validators.required],
      status:[currency ? currency.status:'Active',Validators.required],
      penny_unit:[currency ? currency.penny_unit:'',Validators.required],
      company_id:[''],
      access_token:['']
    });
  }

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = "2";
  sortnane = "name";
  search_key = "";
  search_value = "";
  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);
  getCurrrencyList(): void {
    this.currencyListLoading = true;
    let body = {
      access_token: this.globalService.getAccessTokenFromCookie(),
      limit: this.limit,
      page: this.page,
      sortnane: this.sortnane,
      sortno: this.sortno,
      company_id: this.globalService.getCompanyIdFromStorage(),
      search: {
        name: "",
        status: ""
      }
    }

    this.currencyService.getCurrenyList(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };

          return;
        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.currencyListLoading = false;
      },
      () => {
        this.currencyListLoading = false;
      }
    );
  }

  // add shift..
  addCurrency(body): void {
    this.currencyService.addCurrency(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("Currency Added successfully");
          this.modalRef.hide();

          this.getCurrrencyList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  // edit method
  editCurrency(body): void {
    if (this.currencyForm.pristine) {
      this.modalRef.hide();
      return;
    }
    this.currencyService.editCurrency(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("Shift edited successfully");

          this.modalRef.hide();

          this.getCurrrencyList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  // delet method
  deleteByCurrencyId(id,companyId): void {
    this.currencyService.deleteCurrency(id,companyId).subscribe(
      (response: CustomResponse) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess("Currency deleted sucessfully");
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getCurrrencyList();
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
    // console.log(event);
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
    this.getCurrrencyList();
  }

  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  openAddModal(template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Currency";
    this.selectedCurrency = null;
    this.buildcurrencyForm();

    this.modalRef = this.modalService.show(template, this.config);
  }

  openConfirmationDialogue(currency: Currency): void {
    // const currencyId = {
    //   id: currency.currency_id,
    // };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = currency.name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteByCurrencyId(currency.currency_id,currency.company_id);
      }
    });
  }

  // shift_from: new Date(
  //   new Date().toISOString().slice(0, 10) + " " + shift.shift_from
  // ),
  // edit modal
  openEditModel(currency: Currency, template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = true;
    this.submitButton = "Update";
    this.modalTitle = "Edit Currency";
    this.selectedCurrency = currency;
    this.buildcurrencyForm();
    this.modalRef = this.modalService.show(template, this.config);
  }



  onSubmitCurrency(): void {
    this.submitted = true;

    if (this.currencyForm.invalid) return;

    this.currencyForm.patchValue({
      access_token: this.globalService.getAccessTokenFromCookie(),
    });
    if (this.editMode) {
      this.currencyForm.patchValue({
        id: this.selectedCurrency.currency_id,
      });
      this.currencyForm.patchValue({
        company_id: this.selectedCurrency.company_id,
      });

      this.editCurrency(this.currencyForm.value);
    } else {
      this.currencyForm.patchValue({
        company_id: this.companyId,
      });
      this.addCurrency(this.currencyForm.value);
    }
  }
}
