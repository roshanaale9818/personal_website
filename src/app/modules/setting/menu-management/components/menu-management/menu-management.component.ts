import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GlobalService } from "@app/shared/services/global/global.service";
import {
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { State, process } from "@progress/kendo-data-query";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { MenuManagement } from "../../models/menu-management.model";

@Component({
  selector: "app-menu-management",
  templateUrl: "./menu-management.component.html",
  styleUrls: ["./menu-management.component.scss"],
})
export class MenuManagementComponent implements OnInit {
  menuForm: FormGroup;
  modalRef: BsModalRef;
  selectedViewMenu: MenuManagement;
  selectedMenu: MenuManagement;

  //Kendo Table
  public menuList: MenuManagement[] = [
    {
      id: 1,
      name: "Dashboard",
      parent_name: "(not set)",
      route: "/site/index",
      order: 1,
      data: "Hello There whats up with yo",
    },
    {
      id: 2,
      name: "Attendance Management",
      parent_name: "(not set)",
      route: "/site/audit/index",
      order: 4,
      data: "Hello There whats up with yo",
    },
    {
      id: 3,
      name: "Setting",
      parent_name: "(not set)",
      route: "/site/index",
      order: 1,
      data: "Hello There whats up with yo",
    },
    {
      id: 4,
      name: "Audit Log",
      parent_name: "(not set)",
      route: "/site/index",
      order: 1,
      data: "Hello There whats up with yo",
    },
  ];
  public state: State = {
    skip: 0,
    take: 10,
    //initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
    sort: [{ dir: "desc", field: "designation" }],
  };
  public gridView: GridDataResult = process(this.menuList, this.state);

  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    this.buildMenuManagementForm();
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.menuList, this.state);
  }

  buildMenuManagementForm(): void {
    this.menuForm = this.formBuilder.group({
      name: [
        this.selectedMenu ? this.selectedMenu.name : "",
        [Validators.required],
      ],
      parent_name: [this.selectedMenu ? this.selectedMenu.parent_name : ""],
      route: [this.selectedMenu ? this.selectedMenu.route : ""],
      order: [this.selectedMenu ? this.selectedMenu.order : ""],
      data: [this.selectedMenu ? this.selectedMenu.data : ""],
    });
  }

  openViewModal(template: TemplateRef<any>, menu): void {
    this.selectedViewMenu = menu;
    this.buildMenuManagementForm();
    this.modalRef = this.modalService.show(template);
  }

  /**
   * Clears the form when the user clicks on add Menu button
   */
  clearModal(): void {
    this.selectedMenu = null;
    this.buildMenuManagementForm();
  }

  /**
   * Stores the selected Menu when the user clicks on edit button
   * @param menu
   */
  setMenu(menu): void {
    this.selectedMenu = menu;
    this.buildMenuManagementForm();
  }

  addMenu(): void {
    this.globalService.markAsTouched(this.menuForm);
    if (this.menuForm.invalid || this.menuForm.pristine) return;
  }
}
