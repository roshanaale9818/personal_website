import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TopbarComponent } from "./admin-panel/topbar/topbar.component";
import { FooterComponent } from "./admin-panel/footer/footer.component";
import { AdminPanelComponent } from "./admin-panel/admin-panel.component";
import { RouterModule } from "@angular/router";
import { MenuItemComponent } from "./admin-panel/sidebar/menu-item/menu-item.component";
import { MatIconModule } from "@angular/material/icon";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { SharedModule } from "@app/shared/shared.module";
import { BreadcrumbsModule } from "ng6-breadcrumbs";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { PopoverModule } from "ngx-bootstrap/popover";
import { SidebarComponent } from "./admin-panel/sidebar/sidebar.component";
@NgModule({
  declarations: [
    AdminPanelComponent,
    TopbarComponent,
    SidebarComponent,
    FooterComponent,
    MenuItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    BrowserAnimationsModule,
    SharedModule,
    BreadcrumbsModule,
    Ng2SearchPipeModule,
    PopoverModule.forRoot(),
  ],
  entryComponents: [ConfirmationDialogComponent, FooterComponent],
  exports: [ConfirmationDialogComponent, FooterComponent],
})
export class LayoutModule {}
