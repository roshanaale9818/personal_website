import { ChangeDetectorRef, Component, Input, OnInit, Output, SimpleChange,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomResponse } from '@app/shared/models/custom-response.model';
import { GlobalService } from '@app/shared/services/global/global.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
// import { EventEmitter } from 'protractor';
import { PayrollParameter, SearchPayrollParameter } from '../../modal/payrollparameter.interface';
import { PayrollStaff } from '../../modal/PayrollStaff.interface';
import { PayrollParameterService } from '../../service/payroll-parameter.service';
import { ToastrMessageService } from './../../../../shared/services/toastr-message/toastr-message.service';

@Component({
  selector: 'app-assign-employees',
  templateUrl: './assign-employees.component.html',
  styleUrls: ['./assign-employees.component.scss']
})
export class AssignEmployeesComponent implements OnInit {
  //data for seelcted parameter
@Input() parameter:PayrollParameter
@Input() departmentList:any[];
@Input() shiftList:any[];
  constructor(
    private fb:FormBuilder,
    private globalService:GlobalService,
    private payrollParameterService:PayrollParameterService,
    private toaster:ToastrMessageService,
    private cdref:ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.buildSearchForm();
    //ignoring expression has changed error
    setTimeout(()=>{
      this.getData()
      // this.getStaffList(this.getBody);
      // this.getSavedStaffId(this.parameter.parameter_id)
    },0)

    // this.collapsed();
  }
  async getData(){
    await this.getSaveStaffIdPromise(this.parameter.parameter_id).
      then((res:CustomResponse)=>{
         if(res.status){
          //  console.log("loadded ",res);
           this.savingArray = res.data;
           this.savingArray.forEach(x=>{
             x['checked']=true
           })
          //  console.log("this is saving array",this.savingArray)
         }
       })
    await this.getStaffList(this.getBody).then(
      (response) => {
        if (response.status) {
          if(response.data){
            response.data.forEach(x=>{
              x['checked']=false;
            })
            if(this.savingArray && this.savingArray.length>  0){
              response.data.forEach(x=>{
                // x['checked']=false;
                this.savingArray.forEach(y=>{
                  if(x.staff_id == y.staff_id){
                    x['checked']=true;
                  }
                })

              })
            }
            this.listLoading = false;


          }
          this.gridView = { data: response.data, total: response.count };

        } else {
          this.gridView = { data: [], total: 0 };
          this.listLoading = false;
        }
      },

    );



  }

getSaveStaffIdPromise(parameterId){
  let body = {
    access_token: this.globalService.getAccessTokenFromCookie(),
     limit: null,
     page: 1,
     sortnane: "",
     sortno: 1,
     company_id: this.globalService.getCompanyIdFromStorage(),
     parameter_id:parameterId
       }
       return this.payrollParameterService.getAssignedEmployees(body).toPromise();
      //  subscribe((res:CustomResponse)=>{
      //    if(res.status){
      //      console.log("loadded ",res);
      //      this.savingArray = res.data;
      //      this.savingArray.forEach(x=>{
      //        x['checked']=true
      //      })
      //      console.log("this is saving array",this.savingArray)
      //    }
      //  })

}


  getListWithPromise(){
    this.getStaffList(this.getBody).then(
      (response) => {
        if (response.status) {
          if(response.data){
            response.data.forEach(x=>{
              x['checked']=false;
            })
            if(this.savingArray && this.savingArray.length>  0){
              response.data.forEach(x=>{
                // x['checked']=false;
                this.savingArray.forEach(y=>{
                  if(x.staff_id == y.staff_id){
                    x['checked']=true;
                  }
                })

              })
            }
            this.listLoading = false;


          }
          this.gridView = { data: response.data, total: response.count };

        } else {
          this.gridView = { data: [], total: 0 };
          this.listLoading = false;
        }
      },

    );


  }
  isCollapsed: boolean = true;
  collapseButton:string;
  collapsed(): void {
    // this.searchForm.reset();
    // this.getStaffList(this.getBody);
    this.collapseButton = "Select Employees";
  }
  expanded(): void {
    this.collapseButton = "Hide Select";
  }
  searchForm:FormGroup;
  buildSearchForm(){
    this.searchForm = this.fb.group({
      department_id:[],
      designation_id:[],
      employee_type:[],
      emp_id:[],
      employee_name:[],
      shift:[]
    })

  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }
  ngOnChanges(changes:SimpleChange){
    // console.log("changes",changes)
  }

  // sortDescriptor declaration for kendo grid
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];
  loading:boolean = false;
  // state declaration for kendo grid
  public state: State = {
    skip: 0,
    take: 10,
    filter: {
      logic: "and",
      filters: [],
    },
  };


  public gridView: GridDataResult = {
    data:[],
    total:0
  };

  limit =10;
  // this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  listLoading:boolean = false;
  pageLimit = 10;
  // parseInt(this.globalService.pagelimit)
  skip = 0;


    // on data state chnage method starts here
    onDataStateChange(event) {
      // sorting logic ends here..
      this.skip = event.skip;
      if (event.skip == 0) {
        this.page = "1";
        this.params.page = 1;
      } else {
        const pageNo = event.skip / event.take + 1;
        this.page = pageNo.toString();
        this.params.page = pageNo;
        // this.globalService.setActivePageNumber("payroll",pageNo.toString())

      }
      // this.getAllPayrollParameters()

    }

    params:SearchPayrollParameter = {
      access_token: this.globalService.getAccessTokenFromCookie(),
      limit: Number(this.globalService.pagelimit),
      page: Number(this.globalService.pageNumber),
      sortnane: "title",
      sortno: 0,
      company_id: this.globalService.getCompanyIdFromStorage(),
      search: {
        type: ""
      }
    }
    datePickerFormat="E"


    dataStateChange(event): void {
      // sorting logic ends here..
      if (event.skip == 0) {
        this.skip = event.skip;
        this.getBody.page = "1";
      } else {
        this.skip = event.skip;
        const pageNo = event.skip / event.take + 1;

        this.getBody.page = pageNo.toString();
      }
      // pagination logic ends here

      if (event.filter) {
        if (event.filter.filters[0]) {
          const searchTerm = event.filter.filters[0].value;
          const searchField = event.filter.filters[0].field;
          this.search_value = searchTerm;
          this.search_key = searchField;
        } else {
          this.search_value = "";
          this.search_key = "";
        }
      }
      // search logic ends here
      // this.getStaffList(this.getBody);
      this.getListWithPromise()
    }


    search_value: any;
    search_key: any;





  getBody = {
    company_id: this.globalService.getCompanyIdFromStorage(),
    limit: this.limit,
    page: this.page,
    sortno: 1,
    sortnane: "",
    search: {
      first_name: "",
      last_name: "",
      middle_name: "",
      mobile: "",
      phone: "",
      email_address: "",
      citizenship_no: "",
      gender: "",
      marital_status: "",
      employee_type: "",
      department_id: "",
      designation_id: "",
      emp_id: "",
      dob: "",
    },
  };

  onSearch(){
    if(this.searchForm.invalid) return;
    this.getBody.search.first_name = this.searchForm.get('employee_name').value
    this.getBody.search.department_id = this.searchForm.get('department_id').value
    this.getListWithPromise();
  }

  getStaffList(body) {
    this.listLoading = true;
  return  this.payrollParameterService.getStaffListWithMultiSearch(body).toPromise()
    // subscribe(
    //   (response) => {
    //     if (response.status) {
    //       if(response.data){
    //         response.data.forEach(x=>{
    //           x['checked']=false;
    //         })
    //         if(this.savingArray && this.savingArray.length>  0){
    //           response.data.forEach(x=>{
    //             // x['checked']=false;
    //             this.savingArray.forEach(y=>{
    //               if(x.staff_id == y.staff_id){
    //                 x['checked']=true;
    //               }
    //             })

    //           })
    //         }


    //       }
    //       this.gridView = { data: response.data, total: response.count };
    //     } else {
    //       this.gridView = { data: [], total: 0 };
    //     }
    //   },
    //   (error) => {
    //     this.listLoading = false;
    //   },
    //   () => {
    //     this.listLoading = false;
    //   }
    // );
  }
  onResetForm(){
    this.searchForm.reset();
    this.getBody.search.first_name = this.searchForm.get('employee_name').value
    this.getBody.search.department_id = this.searchForm.get('department_id').value
    // this.get(this.getBody);
   this.getListWithPromise();
  }

  employeesList:any[] =[];
  onCheckboxChange(checked:boolean,item){
    // console.log("checked",checked)
    // console.log("item",item)
  if(checked == true){
    if(this.savingArray.filter(x=>x.staff_id == item.staff_id)[0] !== null && this.savingArray.filter(x=>x.staff_id == item.staff_id)[0] !== undefined){
      console.log("returning here ")
      return;
    }
    item.checked = true;
    // console.log("pushing")
    this.savingArray.push(item);
    // console.log("pushed",this.savingArray)

  }
  else{

    item.checked = false;
    if(this.savingArray.length > 0){
     if( this.savingArray.filter(x=>x.staff_id == item.staff_id)[0] !== null && this.savingArray.filter(x=>x.staff_id == item.staff_id)[0] !== undefined ){
      //  this.savingArray.findIndex(x=>{
      //    if(x.staff_id == item.)
      //  })
      this.savingArray.forEach((x,index)=>{
       if(x.staff_id ==  item.staff_id){
        this.savingArray.splice(index,1)
       }
      })
     }

    }
  }
  }


  savingArray:any[]=[];
  onRemoveItem(index:number){

    if(this.savingArray && this.savingArray.length>0){
      let item = this.savingArray[index];
      this.gridView.data.forEach(x=>{
        if(x.staff_id == item.staff_id){
          x['checked'] = false;
        }
      })
      this.savingArray.splice(index,1)

    }
  }

  onAssignEmployees(){
    console.log("called here ")
    if(!this.savingArray){return};
    // let array:number[] = this.savingArray.map(x=> Number(x.staff_id));
    let savingArrayy = this.savingArray.map(x=> Number(x.staff_id))
    let array:number[] = savingArrayy.filter((c, index) => {
      return savingArrayy.indexOf(c) === index;
  });
    let body:PayrollStaff = {
      access_token : this.globalService.getAccessTokenFromCookie(),
      company_id : this.globalService.getCompanyIdFromStorage(),
      parameter_id : this.parameter.parameter_id,
      user_id : this.globalService.getCurrentUserId(),
      staff_id : array
    };

    this.payrollParameterService.assignEmployees(body).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.toaster.showSuccess("Employees added successfully")
      }
      else{
        this.toaster.showError("Cannot add employees.")
      }
    })

  }

  onSelectAll(){
    console.log("on select all clicked");
   try{
    this.gridView.data.forEach(x=>{
      x.checked = true;
      if(this.savingArray.filter(y=>y.staff_id == x.staff_id).length > 0){
        return;
      }
      this.savingArray.push(x)
    });
   }
   catch(e){
     console.log("error has occured")
   }

  }


  //load the all staff id which is previously saved
  getSavedStaffId(parameterId:number){
    let body = {
 access_token: this.globalService.getAccessTokenFromCookie(),
  limit: null,
  page: 1,
  sortnane: "",
  sortno: 1,
  company_id: this.globalService.getCompanyIdFromStorage(),
  parameter_id:parameterId
    }
    this.payrollParameterService.getAssignedEmployees(body).subscribe((res:CustomResponse)=>{
      if(res.status){
        console.log("loadded ",res);
        this.savingArray = res.data;
        this.savingArray.forEach(x=>{
          x['checked']=true
        })
        console.log("this is saving array",this.savingArray)
        // console.log("this is saving array",this.savingArray);
        // this.gridView.data.forEach(x=>{
        //   res.data.forEach(y=>{
        //     if(x.staff_id == y.staff_id){
        //       x['checked']= true;
        //       this.savingArray.push(x);
        //     }

        //   })
        // })
      }
    })
  }

  @Output() onSavingCancel:EventEmitter<string> = new EventEmitter();
  onCancel(){
    this.onSavingCancel.emit('clicked')
  }






}
