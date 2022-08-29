import { LayoutService } from "./../../../services/layout.service";
import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { GlobalService } from "@app/shared/services/global/global.service";
declare var $: any;
@Component({
  selector: "flexyear-menu-item",
  templateUrl: "./menu-item.component.html",
  styleUrls: ["./menu-item.component.scss"],
})
export class MenuItemComponent implements OnInit {
  @Input() navItems;

  expanded: boolean;
  term: any;
  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      if (trees) {
        trees.tree();
      }
    });
  }

  companyId = this.globalService.getCompanyIdFromStorage();

  setExpandedTrue(event) {
    if (event.target.value != "") {
      this.expanded = true;
    } else {
      this.expanded = false;
    }
  }

  setTitle(title) {
    // this.layoutService.setSideBarTitle(this.router.url);
    this.layoutService.setContentTitle(title);
    // console.log(title);
  }
  // onItemSelect(item) {
  //   if (!item.children || !item.children.length) {
  //     this.router.navigate([item.route]);
  //   }

  //   if (item.children && item.children.length) {
  //     this.expanded = !this.expanded;
  //   }
  // }
  ngOnChanges(change:SimpleChanges){
    // this.navItemsArray();
    this.groupNavItems();
  }
  navItemsByGroup;
  groupNavItems(){
    this.navItemsByGroup = this.navItems.reduce((r,{parent_name})=>{
      if(!r.some(o=>o.parent_name==parent_name)){
        r.push({parent_name,groupItem:this.navItems.filter(v=>v.parent_name==parent_name),iconName:this.navItems.filter(v=>v.parent_name==parent_name)[0].parent_icon});
  }
  return r;
  },[]);
  this.navItemsByGroup.sort(function (a, b) {
   if(a.parent_name && b.parent_name){
    return a.parent_name.localeCompare(b.parent_name);
   } //using String.prototype.localCompare()
  });
  }
//   navItemsArray =()=> this.navItems.reduce((r,{group})=>{
//     if(!r.some(o=>o.group==group)){
//       r.push({group,groupItem:this.array.filter(v=>v.group==group)});
// }
// return r;
// },[]);
}
