import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { GridModule } from "@progress/kendo-angular-grid";
import { PayrollRoutingModule } from "./payroll-routing.module";
import { MonthlyPayrollComponent } from './components/monthly-payroll/monthly-payroll.component';
import { PayrollHistoryComponent } from './components/payroll-history/payroll-history.component';
import { PayrollDetailComponent } from './components/payroll-detail/payroll-detail.component';
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";
import { PdfDownloadComponent } from "./components/pdf-download/pdf-download.component";
import { NgxPrintModule } from "ngx-print";
import { PayrollViewComponent } from "./components/payroll-view/payrollview.component";
// import { PayrollParametersComponent } from './components/payroll-parameters/payroll-parameters.component';
// import { PayrollPeriodsComponent } from './components/payroll-periods/payroll-periods.component';
@NgModule({
  declarations: [MonthlyPayrollComponent, PayrollHistoryComponent,
    PayrollDetailComponent,
  PdfDownloadComponent,
  PayrollViewComponent
  // PayrollParametersComponent,
  // PayrollPeriodsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PayrollRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    PDFExportModule,
    NgxPrintModule
  ]
})
export class PayrollModule {}
