import { DayPipe } from "./services/pipes/day.pipe";
import { ShowWeekendPipe } from "./services/pipes/show-weekend.pipe";
import { HoursAndMinutesPipe } from "./services/pipes/hoursAndMinutes.pipe";
import { DateConversionPipe } from "./services/pipes/date-conversion.pipe";
import { DayNumberPipe } from "./services/pipes/daynumber.pipe";

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CollapseModule } from "ngx-bootstrap/collapse";
import {
  TooltipModule,
  TabsModule,
  ModalModule,
  TimepickerModule,
  BsDatepickerModule,
  BsDropdownModule,
} from "ngx-bootstrap";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { NgxPaginationModule } from "ngx-pagination";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { OrderModule } from "ngx-order-pipe";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PopoverModule } from "ngx-bootstrap/popover";
import { MatStepperModule } from "@angular/material/stepper";
import { LanguageSwitcherComponent } from "./components/language-switcher/language-switcher.component";
import { TextMaskModule } from "angular2-text-mask";

import { AvatarModule } from "ngx-avatar";

// validation directive.....
import { FormControlValidationMsgDirective } from "./directives/validators/validation-message.directive";
import { FormSubmitValidationMsgDirective } from "./directives/validators/submit-validation-msg.directive";
import { ValidationMsgService } from "./directives/validation-message.service";

import { NpDatepickerModule } from "angular-nepali-datepicker";
// ..................kendo...............................
import {
  GridModule,
  PDFModule,
  ExcelModule,
} from "@progress/kendo-angular-grid";
import { IntlModule } from "@progress/kendo-angular-intl";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { ExcelExportModule } from "@progress/kendo-angular-excel-export";

// ................kendo..........................
// ............shared components.............
import { MonthlyReportComponent } from "./../modules/reports/monthly-report/components/monthly-report.component";
// import { CorrectionAttendanceComponent } from "./../modules/daybook-management/correction-attendance/components/correction-attendance.component";
import { MonthlyChartComponent } from "./../modules/reports/all-users-monthly-chart/components/monthly-chart.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { DeleteConfirmationModalComponent } from "./components/delete-confirmation-modal/delete-confirmation-modal.component";
import { ConfirmationDialogComponent } from "./components/confirmation-dialog/confirmation-dialog.component";
import { AddModalComponent } from "./components/add-modal/add-modal.component";
import { DeleteModalComponent } from "./components/delete-modal/delete-modal.component";
import { MonthlyReportDetailsComponent } from "@app/modules/reports/monthly-report/components/monthly-report-details/monthly-report-details.component";
import { Time24Directive } from "./directives/time-24/time-24.directive";
import { Time24PickerComponent } from "./components/time-24/time24-picker/time24-picker.component";
import { LogoutConfirmationComponent } from "./components/logout-confirmation/logout-confirmation.component";
import { TwoDigitNumber } from "./directives/twoDigitiNumber/twoDigitiNumber.pipe";
import { CustomDatetimelocalPickerComponent } from './components/custom-datetimelocal-picker/custom-datetimelocal-picker.component';
import { CustomNepalidatepickerComponent } from "./components/custom-nepalidatepicker/custom-nepalidatepicker.component";
import { NepaliDatePickerComponent } from "./components/nepali-date-picker/nepali-date-picker.component";
import { NepaliDatePipePipe } from './directives/nepalidatePipe/nepali-date-pipe.pipe';
import { CustomdateFormatPipe } from './directives/customDateFormatter/customdate-format.pipe';
import { MonthConverterPipe } from "./directives/monthPipe/month.pipe";
import { AppInputRestrictionDirective } from "./directives/appInputRestriction/appInputRestriction.directive";
import { BlockCopyPasteDirective } from "./directives/appInputRestriction/apppreventcopypaste.directive";
import { NamePipe } from './directives/name/name.pipe';
import { SingleClickDirective } from "./directives/singleclick/singleclick.directive";



@NgModule({
  declarations: [
    PaginationComponent,
    AddModalComponent,
    DeleteConfirmationModalComponent,
    ConfirmationDialogComponent,
    DeleteModalComponent,

    LanguageSwitcherComponent,
    DayNumberPipe,
    DateConversionPipe,
    ShowWeekendPipe,
    HoursAndMinutesPipe,
    DayPipe,
    FormControlValidationMsgDirective,
    FormSubmitValidationMsgDirective,
    // MonthlyReportComponent,
    // MonthlyReportDetailsComponent,
    // CorrectionAttendanceComponent,
    MonthlyChartComponent,
    Time24Directive,
    Time24PickerComponent,
    LogoutConfirmationComponent,
    TwoDigitNumber,
    CustomDatetimelocalPickerComponent,
    CustomNepalidatepickerComponent,
    NepaliDatePickerComponent,
    NepaliDatePipePipe,
    CustomdateFormatPipe,
    MonthConverterPipe,
    // input restriction directives ,
    AppInputRestrictionDirective,
    BlockCopyPasteDirective,
    NamePipe,
    SingleClickDirective

  ],
  imports: [
    CommonModule,
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    NgxPaginationModule,
    Ng2SearchPipeModule,
    OrderModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    TextMaskModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    // NgMultiSelectDropDownModule.forRoot(),
    AvatarModule,
    NpDatepickerModule,
    // ........kendo...........
    GridModule,
    PDFModule,
    ExcelModule,
    IntlModule,
    DateInputsModule,
    ExcelExportModule,
    // ........kendo............
    NgSelectModule,
  ],
  exports: [
    CollapseModule,
    TooltipModule,
    TabsModule,
    ModalModule,
    PopoverModule,
    PaginationComponent,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    OrderModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    LanguageSwitcherComponent,
    DeleteModalComponent,
    TextMaskModule,
    TimepickerModule,
    BsDatepickerModule,
    BsDropdownModule,
    AvatarModule,
    NgSelectModule,
    DayNumberPipe,
    DateConversionPipe,
    ShowWeekendPipe,
    HoursAndMinutesPipe,
    DayPipe,
    FormControlValidationMsgDirective,
    FormSubmitValidationMsgDirective,
    NpDatepickerModule,
    TwoDigitNumber,
    NamePipe,
    //...... shared  components.........
    // MonthlyReportComponent,
    // MonthlyReportDetailsComponent,
    // CorrectionAttendanceComponent,
    MonthlyChartComponent,
    AddModalComponent,
    DeleteConfirmationModalComponent,
    ConfirmationDialogComponent,
    LogoutConfirmationComponent,

    //....... kendo..........
    GridModule,
    PDFModule,
    ExcelModule,
    IntlModule,
    DateInputsModule,
    ExcelExportModule,
    Time24Directive,
    Time24PickerComponent,
    // ........................

    //custom components
    CustomDatetimelocalPickerComponent,
    CustomNepalidatepickerComponent,
    NepaliDatePickerComponent,
    NepaliDatePipePipe,
    CustomdateFormatPipe,
    MonthConverterPipe,
    AppInputRestrictionDirective,
    BlockCopyPasteDirective,
    SingleClickDirective
  ],
  providers: [ValidationMsgService],
})
export class SharedModule {}
