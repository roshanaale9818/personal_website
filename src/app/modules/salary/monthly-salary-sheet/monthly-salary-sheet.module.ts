import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MonthlySalarySheetRoutingModule } from "./monthly-salary-sheet-routing.module";
import { MonthlySalarySheetComponent } from "./components/monthly-salary-sheet/monthly-salary-sheet.component";
import { SharedModule } from "@app/shared/shared.module";
import { SearchPayrollComponent } from './components/search-payroll/search-payroll.component';
@NgModule({
  declarations: [MonthlySalarySheetComponent, SearchPayrollComponent],
  imports: [CommonModule, MonthlySalarySheetRoutingModule, SharedModule],
})
export class MonthlySalarySheetModule {}
