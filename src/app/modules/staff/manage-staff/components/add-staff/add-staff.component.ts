import { DepartmentService } from "../../../../utilities/department/services/department.service";
import { Staff } from "./../../models/staff.model";
import { DatePipe } from "@angular/common";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { BsDatepickerConfig, BsModalRef, BsModalService } from "ngx-bootstrap";
import { ManageStaffService } from "../../services/manage-staff.service";
import { ValidationMessageService } from "@app/shared/services/validation-message/validation-message.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { GlobalService } from "@app/shared/services/global/global.service";
import { Country } from "@app/shared/models/country.model";
// import { IDropdownSettings } from "ng-multiselect-dropdown";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { MaskConst } from "@app/shared/constants/mask.constant";
import { environment } from "@env/environment";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { State, process } from "@progress/kendo-data-query";
import { ManageUserService } from "../../../manage-user/services/manage-user.service";
import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { ElementRef } from "@angular/core";
import { EmployeeGroup } from "@app/modules/utilities/employee-group/modals/employeegroup.modal";
import { NepaliDatePickerSettings } from "@app/shared/components/nepali-date-picker/modals/nepalidatepickersettings.interface";
import { AdBsDateConvertService } from "@app/shared/components/custom-nepalidatepicker/services/ad-bs-date-convert.service";

@Component({
  selector: "app-add-staff",
  templateUrl: "./add-staff.component.html",
  styleUrls: ["./add-staff.component.scss"],
})
export class AddStaffComponent implements OnInit {
  userCredentialsForm: FormGroup;
  // subs = new SubSink();
  staffForm: FormGroup;
  regexConst = RegexConst;
  staffDetail: any;
  staffShift:any[] =  [];
  zipMask = MaskConst.ZIP;
  imageUrl = environment.baseImageUrl;

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  public phoneMask = MaskConst.PHONE_NUMBER;
  loading: boolean;
  // dropdown options
  countryList: Country[];
  stateList: any;
  employeeTypeList: any;
  paymentTypeList: any;
  designationList: any;
  departmentList: any;
  salaryPeriodList: any;
  shiftList = [];
  leaveTypeList: any;
  allowanceList: any;

  experiences = [];
  academics = [];
  languages = [];
  attachments = [];

  // modal
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  staffId: number;
  editStaffMode: boolean;

  disable: boolean = false;
  shiftMultiSelectValue = [];

  maritalStatusList = [
    { name: "Unmarried", value: "S" },
    { name: "Married", value: "M" },
    { name: "Divorced", value: "D" },
    { name: "Widowed", value: "W" },
  ];
  datePickerConfig: Partial<BsDatepickerConfig>;
  dateFormat;
  dateFormatSetting;

  constructor(
    private formBuilder: FormBuilder,
    private bsModalService: BsModalService,
    private manageStaffService: ManageStaffService,
    private validationMessageService: ValidationMessageService,
    private toastrMessageService: ToastrMessageService,
    private globalService: GlobalService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private modalService: BsModalService,
    private departmentService: DepartmentService,
    private datePipe: DatePipe,
    private localStorageService: LocalStorageService,
    private manageUserService: ManageUserService,
    private adbsConvertService:AdBsDateConvertService
  ) {
    this.dateFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
    //we set the date format according to setting
    // this.datePickerConfig = Object.assign(
    //   {},
    //   {
    //     containerClass: "theme-dark-blue",
    //     showWeekNumbers: false,
    //     // dateInputFormat: "MM/DD/YYYY",
    //     dateInputFormat:(this.dateFormatSetting&& this.dateFormatSetting.value =='yyyy/mm/dd')?'YYYY/MM/DD':"MM/DD/YYYY"
    //   }
    // );
    //employee group for tax type
    this.getAllEmployeeGroup();
    this.configUserDateAndTimeSetting();
    this.initSettings();
    this.getCountriesDropdownList();
    this.getStateDropdownList();
    this.getEmployeeTypeDropdownList();
    this.getPaymentTypeDropdownList();
    this.getDesignationDropdownList();
    this.getDepartmentDropdownList();
    this.getSalaryPeriodDropdownList();
    // this.getManagerDropdownList();
    this.getShiftDropdownList();
    this.getLeaveTypeList();
    this.getAllowanceList();
    this.getStaffDetailById();
    this.setNepaliDatePickerSetting();
  }
  countrySetting;
  ngOnInit() {
    this.buildUserCredentialsForm();
    this.analyzeRoute();
    this.buildProfilePictureForm();
    this.buildStaffForm();
    this.buildClientEmployeeForm();
    this.getClientEmployees();

    this.getStaffList();
    this.countrySetting = this.globalService.getCountryFromStorage();
  }

  companyId = this.globalService.getCompanyIdFromStorage();
  selectedUser;

  randomNumber: number;

  returnRandomNmber() {
    // this.randomNumber = Math.floor(1000 + Math.random() * 9000);  -- this. is for 4 no. pin
    // the given below code is for 6 digit pin
    this.randomNumber = Math.floor(Math.random() * 899999 + 100000);
  }

  analyzeRoute() {
    if (this.router.url.includes("edit")) {
      this.editStaffMode = true;
      this.staffId = this.activatedRoute.snapshot.params.id;
      this.getStaffDetailById();
    }
  }

  getCountriesDropdownList(): void {
    this.globalService.getCountryList().subscribe((response) => {
      this.countryList = response;
    });
  }

  getStateDropdownList(): void {
    this.globalService.getStateList().subscribe((response) => {
      this.stateList = response;
    });
  }

  staffList: any[] = [];
  getStaffList() {
    this.staffList = [];
    this.manageUserService.getStaffList().subscribe((response) => {
      if (response.status) {
        this.staffList = response.data;
      } else {
        this.staffList = [];
      }
    });
  }

  getEmployeeTypeDropdownList(): void {
    this.manageStaffService.getEmployeeType().subscribe((response) => {
      if (response.status) {
        this.employeeTypeList = response.data;
      } else {
        this.employeeTypeList = [];
      }
    });
  }

  getPaymentTypeDropdownList(): void {
    // this.paymentTypeList = this.manageStaffService.getPaymentType();
    this.manageStaffService.getPaymentType().subscribe((response) => {
      if (response.status) {
        this.paymentTypeList = response.data;
      } else {
        this.paymentTypeList = [];
      }
    });
  }

  getDesignationDropdownList(): void {
    this.manageStaffService.getDesignation().subscribe((response) => {
      if (response.status) {
        this.designationList = response.data;
      } else {
        this.designationList = [];
      }
    });
  }

  getDepartmentDropdownList(): void {
    const params = {
      limit: 10,
      page: "",
      sortno: 1,
      sortnane: "",
      search_key: "",
      search_value: "",
    };
    this.departmentService.getDepartmentList(params).subscribe((response) => {
      if (response.status) {
        this.departmentList = response.data;
      } else {
        this.departmentList = [];
      }
    });
  }

  getSalaryPeriodDropdownList(): void {
    this.salaryPeriodList = this.manageStaffService.getSalaryPeriod();
  }

  getShiftDropdownList(): void {
    this.manageStaffService.getShiftList().subscribe(
      (response) => {
        console.log("shiftres",response);
        if (response.status) {
          // this.shiftList = response.data;
          response.data.forEach((item) => {
            this.shiftList.push({ name: item.name, shift_id: item.shift_id });
          });
        } else {
          this.shiftList = [];
        }
      },
      (error) => {}
    );
  }

  getLeaveTypeList(): void {
    this.manageStaffService.getLeaveTypeList().subscribe((response) => {
      if (response.status) {
        this.leaveTypeList = response.data;
        this.buildStaffForm();
      }
    });
  }

  getAllowanceList(): void {
    this.manageStaffService.getAllowanceList().subscribe((response) => {
      if (response.status) {
        this.allowanceList = response.data;
        this.buildStaffForm();
      }
    });
  }

  onSelection(event): void {
    this.staffForm.patchValue({ mobile: event });
  }

  phoneCountrySelection(countryPhoneCode): void {
    this.staffForm.patchValue({ phone: countryPhoneCode });
  }

  localExperianceList = [];
  localAcademicsList = [];
  localLanguagesList = [];
  localAttachmentsList = [];
  // this extra variable declaration is done to identify the item to delete using api and delete locally in array.
  getStaffDetailById(): void {
    this.manageStaffService.getStaffDetailById(this.staffId).subscribe(
      (response) => {
        if (response.status) {
          this.staffDetail = response;
          console.log(this.staffDetail, "Staffko detail");
          this.experiences = response.experience;
          this.localExperianceList = response.experience;
          this.academics = response.academic;
          this.localAcademicsList = response.academic;
          this.languages = response.languages;
          this.localLanguagesList = response.languages;
          this.attachments = response.attechment;
          this.localAttachmentsList = response.attechment;
          response.shifts && response.shifts.length>0 ?
          response.shifts.forEach(x=>{
            this.staffShift.push(
              x.shift_id
            )
          }):[]

          this.buildStaffForm();
          if(this.datePickerFormat == 'N'){
            this.disableBefore =
          this.adbsConvertService.transformToNepaliDate( this.staffDetail.staff.hire_date,
            this.datePickerConfig.dateInputFormat,null)
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // object of validation msgs that are dynamically added to form controls
  validationMessages = {
    // U.S english validation messages
    enUS: {
      first_name: {
        required: "First Name  cannot be blank",
      },
      last_name: {
        required: "Last Name  cannot be blank",
      },
      mobile: {
        required: "Mobile cannot be blank",
        pattern: "Mobile number is invalid",
      },
      phone: {
        pattern: "Phone number is invalid",
      },
      emp_id: {
        required: "Employee Id cannot be blank",
        // minlength: "Length must be 4 digits",
        // maxlength: "Length cannot be more than 6 digits",
      },

      email_address: {
        required: "Email address cannot be blank",
        pattern: "Email is invalid",
      },
      address_line1: {
        required: "Address Line1 cannot be blank",
      },
      temp_address_line1: {
        required: "Address Line1 cannot be blank",
      },
      normal_salary_rate: {
        required: "Normal Salary Rate cannot be blank",
      },
      salary_period: {
        required: "Salary period cannot be blank",
      },
      department_id: {
        required: "Department cannot be blank",
      },
      shift: {
        required: "Shift cannot be blank",
      },
      no_of_leave: {
        required: "Required Field",
      },
      duration: {
        required: "Required Field",
      },
      amount: {
        required: "Required Field",
      },
      workingExperience: {
        designation: {
          required: "Designation cannot be blank",
        },
        company_name: {
          required: "Company name cannot be blank",
        },
      },
    },
  };

  // object for saving error message when validation fails
  formErrors = {
    first_name: "",
    last_name: "",
    email_address: "",
    mobile: "",
    phone: "",
    address_line1: "",
    temp_address_line1: "",
    normal_salary_rate: "",
    salary_period: "",
    emp_id: "",
    shift: "",
    department_id: "",
    no_of_leave: "",
    amount: "",
    duration: "",
  };

  // object of validation msgs that are dynamically added to form controls
  workExperienceValidationMessages = {
    // U.S english validation messages
    enUS: {
      designation: {
        required: "Designation cannot be blank",
      },
      company_name: {
        required: "Company name cannot be blank",
      },
      worked_from: {
        required: "Worked From cannot be blank",
      },
      worked_to: {
        required: "Worked To cannot be blank",
      },
      exp_year: {
        required: "Experience Year cannot be blank",
      },
    },
  };

  workExperienceFormErrors = {
    designation: "",
    company_name: "",
    worked_from: "",
    worked_to: "",
    exp_year: "",
  };

  onClick(event) {
    console.log(event);
  }

  /**
   * adds validation message to the form control on violation
   */
  logValidationErrors(): void {
    if (!this.submitted) return;
    this.formErrors = this.validationMessageService.getFormErrors(
      this.staffForm,
      this.formErrors,
      this.validationMessages
    );
  }

  // setSameAsPermanent() {
  //   this.staffForm.get("generalInformation").patchValue({
  //     temp_address_line1: this.staffForm.value.generalInformation.address_line1,
  //     temp_address_line2: this.staffForm.value.generalInformation.address_line2,
  //     temp_city: this.staffForm.value.generalInformation.city,
  //     temp_state: this.staffForm.value.generalInformation.state,
  //     temp_country_id: this.staffForm.value.generalInformation.country_id,
  //     temp_zip_code: this.staffForm.value.generalInformation.zip_code,
  //   });
  // }

  buildStaffForm() {
    this.setFormDisable();
    this.staffForm = this.formBuilder.group({
      first_name: [
        this.staffDetail ? this.staffDetail.staff.first_name : "",
        Validators.required,
      ],
      middle_name: [this.staffDetail ? this.staffDetail.staff.middle_name : ""],
      last_name: [
        this.staffDetail ? this.staffDetail.staff.last_name : "",
        [Validators.required],
      ],
      email_address: [
        this.staffDetail ? this.staffDetail.staff.email_address : "",
        [Validators.pattern(this.regexConst.EMAIL),Validators.required],
      ],
      mobile_code: "",
      mobile: [this.staffDetail ? this.staffDetail.staff.mobile : ""],
      phone_code: "",
      generalInformation: this.formBuilder.group({
        // address permanent
        address_line1: [
          this.staffDetail
            ? this.staffDetail.per_address
              ? this.staffDetail.per_address.address_line1
              : ""
            : "",
        ],
        address_line2: [
          this.staffDetail
            ? this.staffDetail.per_address
              ? this.staffDetail.per_address.address_line2
              : ""
            : "",
        ],
        city: [
          this.staffDetail
            ? this.staffDetail.per_address
              ? this.staffDetail.per_address.city
              : ""
            : "",
        ],
        state: [
          this.staffDetail
            ? this.staffDetail.per_address
              ? this.staffDetail.per_address.state
              : ""
            : "",
        ],
        zip_code: [
          this.staffDetail
            ? this.staffDetail.per_address
              ? this.staffDetail.per_address.zip_code
              : ""
            : "",
        ],
        country_id: [
          this.staffDetail
            ? this.staffDetail.per_address
              ? this.staffDetail.per_address.country_id
              : ""
            : "",
          ,
        ],
        // // address temporary
        // temp_address_line1: [
        //   this.staffDetail
        //     ? this.staffDetail.temp_address
        //       ? this.staffDetail.temp_address.address_line1
        //       : ""
        //     : "",
        //   Validators.required,
        // ],
        // temp_address_line2: [
        //   this.staffDetail
        //     ? this.staffDetail.temp_address
        //       ? this.staffDetail.temp_address.address_line2
        //       : ""
        //     : "",
        // ],
        // temp_city: [
        //   this.staffDetail
        //     ? this.staffDetail.temp_address
        //       ? this.staffDetail.temp_address.city
        //       : ""
        //     : "",
        // ],
        // temp_state: [
        //   this.staffDetail
        //     ? this.staffDetail.temp_address
        //       ? this.staffDetail.temp_address.state
        //       : ""
        //     : "",
        // ],
        // temp_zip_code: [
        //   this.staffDetail
        //     ? this.staffDetail.temp_address
        //       ? this.staffDetail.temp_address.zip_code
        //       : ""
        //     : "",
        // ],
        // temp_country_id: [
        //   this.staffDetail
        //     ? this.staffDetail.temp_address
        //       ? this.staffDetail.temp_address.country_id
        //       : ""
        //     : "",
        // ],
        // .............................................................................

        citizenship_no: [
          this.staffDetail ? this.staffDetail.staff.citizenship_no : "",
        ],
        gender: [this.staffDetail ? this.staffDetail.staff.gender : ""],
        marital_status: [this.staffDetail ? this.staffDetail.staff.gender : ""],
        dob: [this.staffDetail ? this.staffDetail.staff.dob : ""],
        // citizenship
      }),
      officialInformation: this.formBuilder.group({
        hire_date: [
          this.datePickerFormat == 'E'?
        (this.staffDetail
            ? this.globalService.transformForDatepickerPreview(
                this.staffDetail.staff.hire_date,
                this.datePickerConfig.dateInputFormat
              )
            : "") :
            (this.staffDetail
              ?
              this.adbsConvertService.transformToNepaliDate( this.staffDetail.staff.hire_date,
                this.datePickerConfig.dateInputFormat,null)
              : "")
        ],
        expiry_date: [
          this.datePickerFormat == 'E'? (this.staffDetail
            ? this.globalService.transformForDatepickerPreview(
                this.staffDetail.staff.expiry_date,
                this.datePickerConfig.dateInputFormat
              )
            : ""):
            (this.staffDetail
              ?
              this.adbsConvertService.transformToNepaliDate(this.staffDetail.staff.expiry_date,
                this.datePickerConfig.dateInputFormat,null)
              : ""),
        ],
        emp_id: [
          this.staffDetail ? this.staffDetail.staff.emp_id : "",
          [Validators.required],
        ],
        tax_type_id: [
          this.staffDetail ? this.staffDetail.staff.tax_type_id : "",
        ],
        // pin: this.editStaffMode
        //   ? [""]
        //   : [this.staffDetail ? this.staffDetail.staff.pin : ""],
        employee_type: [
          this.staffDetail ? this.staffDetail.staff.employee_type : "",
        ],
        payment_type: [
          this.staffDetail ? this.staffDetail.staff.payment_type : "",
        ],
        designation_id: [
          this.staffDetail ? this.staffDetail.staff.designation_id : "",
        ],
        normal_salary_rate: [
          this.staffDetail ? this.staffDetail.staff.normal_salary_rate : "",
        ],
        salary_period: [
          this.staffDetail ? this.staffDetail.staff.salary_period : "",
        ],
        tax_included: [
          this.staffDetail ? this.staffDetail.staff.tax_included : "",
        ],
        overtime_salary_rate: [
          this.staffDetail ? this.staffDetail.staff.overtime_salary_rate : "",
        ],
        shift: [
          this.staffShift ? (this.staffShift ) : "",
        ],

        cit: [this.staffDetail ? this.staffDetail.staff.cit : ""],
        department_id: [
          this.staffDetail ? this.staffDetail.staff.department_id : 0,
        ],
        manager_id: [this.staffDetail ? this.staffDetail.staff.manager_id : ""],
        checkinRestrictiontime: [
          this.staffDetail ? this.staffDetail.staff.checkinRestrictiontime : "",
        ],
        remarks: [this.staffDetail ? this.staffDetail.staff.remarks : ""],
      }),
      user_info: this.formBuilder.group({
        username: [
          this.staffDetail ? this.staffDetail.user_credential.username : "",
        ],
        password: "",
        verify_password: "",
        pin: [this.randomNumber ? this.randomNumber : ""],
      }),
      // shift: [
      //   this.staffDetail ? this.staffDetail.shifts : [],
      //   [Validators.required],
      // ],

      workingExperience: [this.experiences],
      academicQualification: [this.academics],
      leaveTypeFormArray: this.leaveTypeList
        ? this.buildLeaveTypeFormArray()
        : [],
      allowanceFormArray: this.allowanceList
        ? this.buildAllowanceFormArray()
        : [],
    });

    this.staffForm.valueChanges.subscribe(() => {
      this.logValidationErrors();
    });
    // console.log("this is hiredate",this.)
    //added here
    if (this.countrySetting && this.router.url.includes("add")) {
      this.patchValueFromSettings();
    }
  }

  // -------------------------------- Start of Work Experience ----------------------------------

  workExperienceForm: FormGroup;
  workExperienceSubmitted: boolean;
  // for edit of experience
  selectedExperience: any;
  buildWorkExperienceForm() {
    this.workExperienceForm = this.formBuilder.group({
      exp_id: [this.selectedExperience ? this.selectedExperience.exp_id : ""],
      designation: [
        this.selectedExperience ? this.selectedExperience.designation : "",
        [Validators.required],
      ],
      company_name: [
        this.selectedExperience ? this.selectedExperience.company_name : "",
        [Validators.required],
      ],
      worked_from: [
        this.selectedExperience ? this.selectedExperience.worked_from : "",
        [Validators.required],
      ],
      worked_to: [
        this.selectedExperience ? this.selectedExperience.worked_to : "",
        [Validators.required],
      ],
      exp_year: [
        this.selectedExperience ? this.selectedExperience.exp_year : "",
        [Validators.required],
      ],
      work_des: [
        this.selectedExperience ? this.selectedExperience.work_des : "",
      ],
    });

    this.workExperienceForm.valueChanges.subscribe(() => {
      this.logWorkExperienceValidationErrors();
    });
  }

  clientEmployeeForm: FormGroup;
  buildClientEmployeeForm(): void {
    this.clientEmployeeForm = this.formBuilder.group({
      client_id: "",
    });
  }

  //Kendo Table
  public clientEmployeeList: any[] = [];
  public state: State = {
    skip: 0,
    take: 10,
    //initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
  };
  public gridView: GridDataResult;

  getClientEmployees(): void {
    this.manageStaffService
      .getClientStaff(this.staffId)
      .subscribe((response) => {
        if (response.status) {
          this.clientEmployeeList = response.data;
          this.gridView = process(this.clientEmployeeList, this.state);
        } else {
          this.gridView = process([], this.state);
        }
      });
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    console.log(state);
    this.state = state;
    this.gridView = process(this.clientEmployeeList, this.state);
  }

  navigateToClientView(dataItem): void {
    this.router.navigate([
      "manage-client/client/client-detail/",
      dataItem.client_id,
    ]);
  }

  /**
   * adds validation message to the working experience form control on violation
   */
  logWorkExperienceValidationErrors(): void {
    if (!this.workExperienceSubmitted) return;
    this.workExperienceFormErrors = this.validationMessageService.getFormErrors(
      this.workExperienceForm,
      this.workExperienceFormErrors,
      this.workExperienceValidationMessages
    );
  }

  addWorkExperience() {
    this.workExperienceSubmitted = true;
    this.logWorkExperienceValidationErrors();
    if (this.workExperienceForm.invalid) return;
    let experience = {
      designation: this.workExperienceForm.value.designation,
      company_name: this.workExperienceForm.value.company_name,
      worked_from: this.convertDateObjectIntoString(
        this.workExperienceForm.value.worked_from
      ),
      worked_to: this.convertDateObjectIntoString(
        this.workExperienceForm.value.worked_to
      ),
      exp_year: this.workExperienceForm.value.exp_year,
      work_des: this.workExperienceForm.value.work_des,
      company_id: this.staffDetail ? this.staffDetail.staff.company_id : "104",
    };

    // edit mode or add mode
    if (this.selectedExperience) {
      experience["exp_id"] = this.workExperienceForm.value.exp_id;
      this.experiences[
        this.selectedExperience.index ? this.selectedExperience.index : 0
      ] = experience;
    } else {
      this.experiences.push(experience);
    }

    this.closeModal();
  }

  openDeleteExperienceConfirmation(experienceIndex, experience) {
    const expId = {
      exp_id: experience.exp_id,
    };
    console.log(experience.exp_id);

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = experience.designation;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        if (experience.exp_id) {
          this.removeById(JSON.stringify(expId));
        } else {
          this.experiences.splice(experienceIndex, 1);
        }
      }
    });
  }

  removeById(body) {
    this.manageStaffService.deleteStaffById(body).subscribe(
      (response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess("Deleted successfully");
        }
        // this.analyzeRoute();
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }
  // -------------------------------- Start of Academic Qualification ----------------------------------

  // object of validation msgs that are dynamically added to form controls
  academicQualificationValidationMessages = {
    // U.S english validation messages
    enUS: {
      qualification: {
        required: "Qualification cannot be blank",
      },
      passing_year: {
        required: "Passing year cannot be blank",
      },
      institute_name: {
        required: "Institue name cannot be blank",
      },
      result: {
        required: "Result cannot be blank",
      },
    },
  };

  academicQualificationFormErrors = {
    qualification: "",
    passing_year: "",
    institute_name: "",
    result: "",
  };

  academicQualificationForm: FormGroup;
  academicQualificationSubmitted: boolean;
  // for edit
  selectedAcademic: any;
  buildAcademicQualificationForm() {
    this.academicQualificationForm = this.formBuilder.group({
      academic_id: [
        this.selectedAcademic ? this.selectedAcademic.academic_id : "",
      ],
      qualification: [
        this.selectedAcademic ? this.selectedAcademic.qualification : "",
        [Validators.required],
      ],
      passing_year: [
        this.selectedAcademic ? this.selectedAcademic.passing_year : "",
        [Validators.required],
      ],
      institute_name: [
        this.selectedAcademic ? this.selectedAcademic.institute_name : "",
        [Validators.required],
      ],
      result: [
        this.selectedAcademic ? this.selectedAcademic.result : "",
        [Validators.required],
      ],
    });

    this.academicQualificationForm.valueChanges.subscribe((value) => {
      this.logAcademicQualificationValidationErrors();
    });
  }

  /**
   * adds validation message to the academic qualification form control on violation
   */
  logAcademicQualificationValidationErrors(): void {
    if (!this.academicQualificationSubmitted) return;
    this.academicQualificationFormErrors =
      this.validationMessageService.getFormErrors(
        this.academicQualificationForm,
        this.academicQualificationFormErrors,
        this.academicQualificationValidationMessages
      );
  }

  addAcademicQualification() {
    this.academicQualificationSubmitted = true;
    this.logAcademicQualificationValidationErrors();
    if (this.academicQualificationForm.invalid) return;

    const academic = {
      qualification: this.academicQualificationForm.value.qualification,
      passing_year: this.academicQualificationForm.value.passing_year,
      institute_name: this.academicQualificationForm.value.institute_name,
      result: this.academicQualificationForm.value.result,
      // company_id: this.staffDetail ? this.staffDetail.staff.company_id : ""
    };

    // if academic is edited, selected academic is set to selectedAcademic variable
    if (this.selectedAcademic) {
      academic["academic_id"] =
        this.academicQualificationForm.value.academic_id;
      this.academics[
        this.selectedAcademic.index ? this.selectedAcademic.index : 0
      ] = academic;
    } else {
      this.academics.push(academic);
    }
    this.closeModal();
  }

  openDeleteQualificationConfirmation(academic, index) {
    const academicId = {
      academic_id: academic.academic_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = academic.qualification;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        if (academic.academic_id) {
          this.removeById(JSON.stringify(academicId));
        } else {
          this.academics.splice(index, 1);
        }
      }
    });
  }

  // -------------------------------- Start of Attachments ----------------------------------

  // object of validation msgs that are dynamically added to form controls
  attachmentValidationMessages = {
    // U.S english validation messages
    enUS: {
      attachment_name: {
        required: "Attachment name cannot be blank",
      },
      description: {
        required: "Description cannot be blank",
      },
    },
  };

  attachmentFormErrors = {
    attachment_name: "",
    description: "",
  };

  attachmentForm: FormGroup;
  attachmentSubmitted: boolean;
  // for edit
  selectedAttachment: any;
  buildAttachmentForm() {
    this.attachmentForm = this.formBuilder.group({
      attachment_name: [
        this.selectedAttachment ? this.selectedAttachment.attachment_name : "",
        [Validators.required],
      ],
      description: [
        this.selectedAttachment ? this.selectedAttachment.description : "",
      ],
    });

    this.attachmentForm.valueChanges.subscribe((value) => {
      this.logAttachmentValidationErrors();
    });
  }

  /**
   * adds validation message to the academic qualification form control on violation
   */
  logAttachmentValidationErrors(): void {
    if (!this.attachmentSubmitted) return;
    this.attachmentFormErrors = this.validationMessageService.getFormErrors(
      this.attachmentForm,
      this.attachmentFormErrors,
      this.attachmentValidationMessages
    );
  }
  //on attachmentfile select
  onAttachmentFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.attachmentForm.get("attachment_name").setValue(file);
      // this.selectedAttachment.attachment_name = "";
    }
  }
  addAttachment(attachmentId?: any) {
    this.attachmentSubmitted = true;
    this.logAttachmentValidationErrors();
    if (this.attachmentForm.invalid) return;
    const formData = new FormData();
    if (attachmentId) {
      formData.append("id", String(attachmentId));
    }
    formData.append(
      "attachment_name",
      this.attachmentForm.get("attachment_name").value
    );
    formData.append("staff_id", String(this.staffId));
    formData.append("company_id", String(this.companyId));
    formData.append("description", this.attachmentForm.value.description);
    console.log("this is formData", formData);
    this.manageStaffService
      .addAttachment(formData)
      .subscribe((data: CustomResponse) => {
        if (data.status) {
          this.toastrMessageService.showSuccess(data.detail);
          this.closeModal();
          if (this.router.url.includes("edit")) {
            this.getStaffDetailById();
          }
          // this.attachmentForm.reset();
        } else {
          this.toastrMessageService.showError(data.detail);
        }
      });
  }

  // -------------------------------- Start of Languages ----------------------------------

  // object of validation msgs that are dynamically added to form controls
  languageValidationMessages = {
    // U.S english validation messages
    enUS: {
      language_name: {
        required: "Language name cannot be blank",
      },
      level: {
        required: "Level cannot be blank",
      },
    },
  };

  languageFormErrors = {
    language_name: "",
    level: "",
  };

  languageForm: FormGroup;
  languageSubmitted: boolean;
  // for edit
  selectedLanguage: any;
  buildLanguageForm() {
    this.languageForm = this.formBuilder.group({
      language_id: [
        this.selectedLanguage ? this.selectedLanguage.language_id : "",
      ],
      language_name: [
        this.selectedLanguage ? this.selectedLanguage.language_name : "",
        [Validators.required],
      ],
      level: [
        this.selectedLanguage ? this.selectedLanguage.level : "",
        [Validators.required],
      ],
    });

    this.languageForm.valueChanges.subscribe((value) => {
      this.logAttachmentValidationErrors();
    });
  }

  /**
   * adds validation message to the language form control on violation
   */
  logLanguageValidationErrors(): void {
    if (!this.languageSubmitted) return;
    this.languageFormErrors = this.validationMessageService.getFormErrors(
      this.languageForm,
      this.languageFormErrors,
      this.languageValidationMessages
    );
  }

  addLanguage() {
    this.languageSubmitted = true;
    this.logLanguageValidationErrors();
    if (this.languageForm.invalid) return;

    const language = {
      language_name: this.languageForm.value.language_name,
      level: this.languageForm.value.level,
    };

    if (this.selectedLanguage) {
      language["language_id"] = this.languageForm.value.language_id;
      this.languages[this.selectedLanguage.index] = language;
    } else {
      this.languages.push(language);
    }

    this.closeModal();
  }

  setFormDisable() {
    if (!this.staffDetail) {
      this.disable = true;
    }
  }

  LeaveTypeFormchecked = [];
  createLeaveTypeForm(leaveType, index): FormGroup {
    let selectedLeaveType;
    if (this.staffDetail) {
      if (this.staffDetail.leaves) {
        // this lines of code is for checking datas in formArray and enabling form if there is data..
        this.staffDetail.leaves.forEach((item) => {
          if (item.no_of_leave != undefined || item.duration !== undefined) {
            if (item.leave_type_id == leaveType.leave_type_id) {
              selectedLeaveType = item;
            }
          }
        });
      }
    }
    if (selectedLeaveType) {
      this.LeaveTypeFormchecked[index] = true;
      this.disable = false;
    } else {
      this.LeaveTypeFormchecked[index] = false;
      this.disable = true;
    }
    return this.formBuilder.group({
      leave_type_id: [
        {
          value: selectedLeaveType
            ? selectedLeaveType.leave_type_id
            : leaveType
            ? leaveType.leave_type_id
            : "",
          disabled: this.disable,
        },
      ],
      no_of_leave: [
        {
          value: selectedLeaveType ? selectedLeaveType.no_of_leave : "",
          disabled: this.disable,
        },
        Validators.required,
      ],
      duration: [
        {
          value: selectedLeaveType ? selectedLeaveType.duration : "",
          disabled: this.disable,
        },
        Validators.required,
      ],
    });
  }

  buildLeaveTypeFormArray(): FormArray {
    if (!this.leaveTypeList) {
      return;
    }
    return this.formBuilder.array(
      this.leaveTypeList.map((leaveType, index) =>
        this.createLeaveTypeForm(leaveType, index)
      )
    );
  }
  AllowanceFormchecked = [];

  createAllowanceform(allowance, index) {
    let selectedAllowance: any;
    if (this.staffDetail) {
      if (this.staffDetail.allownces) {
        this.staffDetail.allownces.forEach((item) => {
          if (item.amount != undefined || item.duration !== undefined) {
            if (item.allowance_id == allowance.allowance_id) {
              selectedAllowance = item;
            }
          }
        });
      }
    }
    if (selectedAllowance) {
      this.AllowanceFormchecked[index] = true;
      this.disable = false;
    } else {
      this.AllowanceFormchecked[index] = false;
      this.disable = true;
    }

    return this.formBuilder.group({
      allowance_id: [
        {
          value: selectedAllowance
            ? selectedAllowance.allowance_id
            : allowance
            ? allowance.allowance_id
            : "",
          disabled: this.disable,
        },
      ],
      amount: [
        {
          value: selectedAllowance ? selectedAllowance.amount : "",
          disabled: this.disable,
        },
        Validators.required,
      ],
      duration: [
        {
          value: selectedAllowance ? selectedAllowance.duration : "",
          disabled: this.disable,
        },
        Validators.required,
      ],
    });
  }
  buildAllowanceFormArray(): FormArray {
    if (!this.allowanceList) return;
    return this.formBuilder.array(
      this.allowanceList.map((allowance, index) =>
        this.createAllowanceform(allowance, index)
      )
    );
  }

  openDeleteLanguageConfirmation(language, index) {
    const languageId = {
      language_id: language.language_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = language.language_name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        if (language.language_id) {
          this.removeById(JSON.stringify(languageId));
        } else {
          this.languages.splice(index, 1);
        }
      }
    });
  }

  // ------------------------ on form submit -------------------------------------
  submitted: boolean;

  onSubmit(type): void {
    this.submitted = true;
    console.log("DDSADSA");

    this.logValidationErrors();
    if (this.staffForm.invalid) return;

    const per_address = {
      country_id: [
        this.staffForm.value.generalInformation.country_id
          ? this.staffForm.value.generalInformation.country_id
          : "",
        ,
      ],
      state: this.staffForm.value.generalInformation.state,
      zip_code: this.staffForm.value.generalInformation.zip_code,
      address_line1: this.staffForm.value.generalInformation.address_line1
        ? this.staffForm.value.generalInformation.address_line1
        : "",
      // not set
      address_line2: this.staffForm.value.generalInformation.address_line2
        ? this.staffForm.value.generalInformation.address_line2
        : " ",
      city: this.staffForm.value.generalInformation.city,
    };
    const temp_address = {
      country_id: this.staffForm.value.generalInformation.temp_country_id,
      state: this.staffForm.value.generalInformation.temp_state,
      zip_code: this.staffForm.value.generalInformation.temp_zip_code,
      address_line1: this.staffForm.value.generalInformation.temp_address_line1,
      address_line2: this.staffForm.value.generalInformation.temp_address_line2,
      city: this.staffForm.value.generalInformation.temp_city,
    };
    const user_info = {
      username: this.staffForm.value.user_info.username,
      password: this.staffForm.value.user_info.password,
      verify_password: this.staffForm.value.user_info.verify_password,
      pin: this.randomNumber,
    };
    let shiftArray=  this.staffForm.value.officialInformation.shift;
    // console.log("this is shiftArra",this.staffForm);
    // console.log("shift",shiftArray)

    const staff = {
      access_token: this.token,
      id: this.editStaffMode ? this.staffId : "",
      emp_id: this.staffForm.value.officialInformation.emp_id,
      // pin: this.staffForm.value.officialInformation.pin,
      first_name: this.staffForm.value.first_name,
      middle_name: this.staffForm.value.middle_name,
      last_name: this.staffForm.value.last_name,
      user_info: user_info,
      address_per: per_address,
      temp_address: temp_address,
      mobile: this.staffForm.value.mobile,
      phone: this.staffForm.value.phone,
      mobile_code: this.staffForm.value.mobile_code,
      phone_code: this.staffForm.value.phone_code,
      email_address: this.staffForm.value.email_address,
      citizenship_no: this.staffForm.value.generalInformation.citizenship_no,
      gender: this.staffForm.value.generalInformation.gender,
      marital_status: this.staffForm.value.generalInformation.marital_status,
      hire_date: this.datePickerFormat == 'E' ? this.convertDateObjectIntoString(
        this.staffForm.value.officialInformation.hire_date
      ):
      this.adbsConvertService.transformDateForAPI(
        this.staffForm.value.officialInformation.hire_date,this.datePickerConfig.dateInputFormat
      )
      ,
      expiry_date: this.datePickerFormat == 'E' ? this.convertDateObjectIntoString(
        this.staffForm.value.officialInformation.expiry_date
      ):
      this.adbsConvertService.transformDateForAPI(
        this.staffForm.value.officialInformation.expiry_date,this.datePickerConfig.dateInputFormat
      ),
      employee_type: this.staffForm.value.officialInformation.employee_type,

      salary_period: this.staffForm.value.officialInformation.salary_period,
      payment_type: this.staffForm.value.officialInformation.payment_type,
      designation_id: this.staffForm.value.officialInformation.designation_id,
      department_id: this.staffForm.value.officialInformation.department_id,
      manager_id: this.staffForm.value.officialInformation.manager_id,

      normal_salary_rate:
        this.staffForm.value.officialInformation.normal_salary_rate,
      overtime_salary_rate:
        this.staffForm.value.officialInformation.overtime_salary_rate,
      salary_duration: this.staffForm.value.officialInformation.salary_duration,
      cit: this.staffForm.value.officialInformation.cit,

      tax_included: this.staffForm.value.officialInformation.tax_included,
      remaining_leave_days: 2,
      checkinRestrictiontime:
        this.staffForm.value.officialInformation.checkinRestrictiontime,
      dob: this.convertDateObjectIntoString(
        this.staffForm.value.generalInformation.dob
      ),
      remarks: this.staffForm.value.officialInformation.remarks,
      company_id: this.manageStaffService.companyId,
      experience: this.experiences,
      academic: this.academics,
      language: this.languages,

      shift:shiftArray && shiftArray.length>0 ?
      this.assignShift(shiftArray):[]
      ,
      //added starts here
      tax_type_id:this.staffForm.value.officialInformation.tax_type_id,
      // added  ends here

      leave:
        this.staffForm.value.leaveTypeFormArray == undefined
          ? []
          : this.staffForm.value.leaveTypeFormArray,
      allowance:
        this.staffForm.value.allowanceFormArray == undefined
          ? []
          : this.staffForm.value.allowanceFormArray,
    };
    if (type === "add") {
      // console.log(staff);
      this.addStaff(staff);
    }

    if (type === "update") {
      // console.log(staff);
      this.updateStaff(staff);
    }
  }
  assignShift(shiftArray:any[]){
    let array = [];
    shiftArray.forEach(x=>{
      array.push({
        shift_id:x
      })
    })
    return array;
  }

  token = this.localStorageService.getLocalStorageItem("flexYear-token");
  addStaff(staff): void {
    if (this.staffForm.invalid) return;
    // return;
    this.manageStaffService.addStaff(staff).subscribe((response) => {
      if (response.status) {
        this.toastrMessageService.showSuccess(response.detail);
        if (!this.url) this.router.navigate(["/staff/manage-staff"]);
        else this.uploadStaffProfilePicture();
        return;
      }

      if (response.data.first_name) {
        this.toastrMessageService.showError(response.data.first_name[0]);
      } else if (response.data.mobile) {
        this.toastrMessageService.showError(response.data.mobile[0]);
      } else if (response.data.last_name) {
        this.toastrMessageService.showError(response.data.last_name[0]);
      } else if (response.data.email_address) {
        this.toastrMessageService.showError(response.data.email_address[0]);
      } else if (response.data.emp_id) {
        this.toastrMessageService.showError(response.data.emp_id[0]);
      }
      else if (response.data.employee_type){
        this.toastrMessageService.showError(response.data.employee_type[0]);
      } else {
        this.toastrMessageService.showError(response.detail);
      }
    });
  }

  updateStaff(staff): void {
    // || this.staffForm.pristine
    if (this.staffForm.invalid) return;

    this.staffId = staff.id;
    if (
      this.staffForm.value.user_info.password !==
      this.staffForm.value.user_info.verify_password
    ) {
      this.toastrMessageService.showError(
        "Password and Verify Password doesnot match."
      );
      return;
    } else {
      this.manageStaffService.updateStaff(staff).subscribe((response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Employee is updated successfully"
          );
          if (!this.url) this.router.navigate(["/staff/manage-staff"]);
          else this.uploadStaffProfilePicture();
        }
      });
    }
  }

  get leaveTypeFormArray() {
    return this.staffForm["controls"].leaveTypeFormArray[
      "controls"
    ] as FormArray;
  }

  get allowanceFormArray() {
    return this.staffForm["controls"].allowanceFormArray[
      "controls"
    ] as FormArray;
  }

  onCheck(event, control) {
    console.log(event);

    if (event) {
      control.enable();
    } else {
      control.disable();
    }
  }

  get isGeneralInformationFormInvalid() {
    return this.staffForm["controls"].generalInformation.invalid;
  }

  get isOfficialInformationFormInvalid() {
    return this.staffForm["controls"].officialInformation.invalid;
  }
  @ViewChild("attachmentFile", { static: false }) attachmentFile: ElementRef;

  modalRef: BsModalRef;

  /**
   *
   * @param template
   * @param type is type of modal i.e experience, qualification
   * @param value is selected item value
   * @param index is index of the selected item for edit
   */
  openModal(
    template: TemplateRef<any>,
    type,
    value = null,
    index = null
  ): void {
    switch (type) {
      case "experience":
        // to prevent from auto rendering of validation message on second open of modal
        // this.workExperienceSubmitted = false;
        this.selectedExperience = value;
        if (index) this.selectedExperience.index = index;
        this.buildWorkExperienceForm();
        break;

      // case "academic":
      // to prevent from auto rendering of validation message on second open of modal
      // this.academicQualificationSubmitted = false;
      // this.selectedAcademic = value;
      // if (index) this.selectedAcademic.index = index;
      // this.buildAcademicQualificationForm();
      // break;

      case "attachment":
        // to prevent from auto rendering of validation message on second open of modal
        // this.attachmentSubmitted = false;
        this.selectedAttachment = value;
        if (index) this.selectedAttachment.index = index;
        this.buildAttachmentForm();
        break;

      case "language":
        // to prevent from auto rendering of validation message on second open of modal
        this.languageSubmitted = false;
        this.selectedLanguage = value;
        if (index) this.selectedLanguage.index = index;
        this.buildLanguageForm();
        break;

      default:
        break;
    }

    this.modalRef = this.bsModalService.show(template, this.config);
  }

  closeModal(): void {
    this.modalRef.hide();
  }

  profilePictureForm: FormGroup;
  buildProfilePictureForm() {
    this.profilePictureForm = this.formBuilder.group({
      id: this.staffId,
      staff_photo: "",
    });
  }

  uploadStaffProfilePicture(id = this.staffId) {
    this.profilePictureForm.patchValue({ id: id });
    if (!this.profilePictureForm.value.staff_photo) return;
    this.manageStaffService
      .addStaffProfilePicture(this.profilePictureForm.value, this.staffId)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        },
        () => {
          this.router.navigate(["/staff/manage-staff"]);
        }
      );
  }

  url: any;
  /**
   * called each time file input changes
   * @param event - image data
   */
  onFileSelect(event1): void {
    // file is selected
    if (event1.target.files && event1.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event1.target.files[0]); // read file as data url

      reader.onload = (event2: any) => {
        // called once readAsDataURL is completed
        this.url = event2.target.result;
        this.profilePictureForm.patchValue({
          staff_photo: event1.target.files[0],
        });
      };
    }
  }

  convertDateObjectIntoString(dateObject) {
    let date = this.datePipe.transform(dateObject, "yyyy-MM-dd");
    return date;
  }

  openDeleteAttachmentConfirmation(attachment) {}

  updateAttachment(id) {
    this.addAttachment(id);
  }
  selectedItems = [];

  buildUserCredentialsForm() {
    this.userCredentialsForm = this.formBuilder.group({
      staff_id: this.activatedRoute.snapshot.params.id,
      username: [
        this.selectedUser ? this.selectedUser.username : "",
        Validators.required,
      ],
      password: ["", Validators.required],
      //   confirmPassword: ["", Validators.required],
      access_level: [0],
      role: [2],
      company_id: [this.companyId],
      user_id: [""],
    });
  }

  registerUser() {
    this.manageUserService
      .registerUser(this.userCredentialsForm.value)
      .subscribe(
        (response) => {
          if (response.status) {
            this.toastrMessageService.showSuccess(
              "User is registered successfully"
            );

            this.userCredentialsForm.reset();
          } else {
            this.toastrMessageService.showError(response.detail);
          }
        },
        (error) => {
          this.toastrMessageService.showError(error);
        }
      );
  }

  // for setting country value according to user setting
  patchValueFromSettings() {
    if (this.countryList) {
      const countryObj = this.countryList.filter(
        (x) => x.name == this.countrySetting.COMP_COUINTRY
      )[0];

      if (countryObj != null) {
        let countryId = countryObj.country_id;
        (this.staffForm.get("generalInformation") as FormGroup).patchValue({
          country_id: countryId,
        });
      }
    }
  }
  settingFromCompanyWise: any;
  configUserDateAndTimeSetting() {
    //if no userpreference
    this.settingFromCompanyWise = this.localStorageService.getLocalStorageItem(
      "setting_list"
    )
      ? this.localStorageService.getLocalStorageItem("setting_list")
      : null;
    if (!this.dateFormatSetting) {
      let generalDateFormatSetting = this.settingFromCompanyWise.filter(
        (x) => x.code == "GS_DT_FORMAT"
      )[0];
      this.datePickerConfig = Object.assign(
        {},
        {
          containerClass: "theme-dark-blue",
          showWeekNumbers: false,
          dateInputFormat:
            generalDateFormatSetting && generalDateFormatSetting.value == "0"
              ? "YYYY/MM/DD"
              : "MM/DD/YYYY",
        }
      );
    }
    //if user has userpreference
    else {
      this.datePickerConfig = Object.assign(
        {},
        {
          containerClass: "theme-dark-blue",
          showWeekNumbers: false,
          // dateInputFormat: "MM/DD/YYYY",
          dateInputFormat:
            this.dateFormatSetting &&
            this.dateFormatSetting.value == "yyyy/mm/dd"
              ? "YYYY/MM/DD"
              : "MM/DD/YYYY",
        }
      );
    }
  }
  downloadAttachment(attachment): void {
    if (attachment) {
      // this.document.location.href =
      //   "https://simpliflybackend.bentray.work/" + attachment;
      console.log("DD ");
      const a: any = document.createElement("a");
      // a.href = "https://simpliflybackend.bentray.work/" + attachment;
      a.download = attachment.contract;
      document.body.appendChild(a);
      a.style = "display: none";
      a.click();
      a.remove();
    }
  }
  deleteAttachment(value) {
    let bodyObj = {
      access_token: this.token,
      id: value.attachment_id,
    };
    this.manageStaffService.deleteAttachment(bodyObj).subscribe(
      (res: CustomResponse) => {
        console.log(res);
        if (res.status) {
          this.toastrMessageService.showSuccess(res.data);
          this.getStaffDetailById();
        } else {
          this.toastrMessageService.showError(res.data);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onCancelEmployee(): void {
    this.router.navigate(["/staff/manage-staff"]);
  }


  taxTypeList:EmployeeGroup[] = [];
  getAllEmployeeGroup(){
    this.manageStaffService.getAllEmployeeGroup().subscribe((res:CustomResponse)=>{
      if(res.status){
        this.taxTypeList = res.data;
      }
      else{
        this.taxTypeList = [];
      }
    })

  }
  datePickerFormat;
  systemSetting;
  datePickerSettingUserWise;
  initSettings() {
    this.systemSetting = this.globalService.getDateSettingFromStorage();
    //init the system date picker setting
    if (this.systemSetting !== null && this.systemSetting !== undefined) {
      this.datePickerFormat = this.systemSetting.GS_DATE;
    }
    this.datePickerSettingUserWise = this.globalService.getUserPreferenceSetting('UP_DATE_TYPE');
    if (this.datePickerSettingUserWise !== undefined && this.datePickerSettingUserWise !== null) {
      if (this.datePickerSettingUserWise.value) {
        this.datePickerFormat = this.datePickerSettingUserWise.value == 'BS' ? 'N' : 'E';
      }
    }
  }
  nepaliDatePickerSettingsForHireFrom: NepaliDatePickerSettings;
  nepaliDatePickerSettingsForHireTo: NepaliDatePickerSettings;
  onHireFromChange(evt){

  }
  disableBefore;
  changeDate(date, type) {
    console.log("date ", date, type);
    if (type == "hireFrom") {
      this.disableBefore =date;
      let expireDate =  this.staffForm.value.officialInformation.expiry_date;
      date > expireDate ?
      ( this.staffForm.get('officialInformation') as FormGroup).patchValue({
        expiry_date:''
      }):null;
    }
  }
  setNepaliDatePickerSetting(){
    if(this.datePickerFormat == 'E') return;
    console.log("asndas")
    this.nepaliDatePickerSettingsForHireFrom = {
      language: "english",
      dateFormat: this.datePickerConfig.dateInputFormat,
      ndpMonth: true,
      ndpYear: true
    }

    this.nepaliDatePickerSettingsForHireTo = {
      language: "english",
      dateFormat: this.datePickerConfig.dateInputFormat,
      ndpMonth: true,
      ndpYear: true,
    }
    // setTimeout(()=>{

    // },1000)
  }


}
