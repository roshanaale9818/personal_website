import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { ManageStaffService } from "./../../services/manage-staff.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MaskConst } from "@app/shared/constants/mask.constant";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { environment } from "@env/environment";
import { Route } from "@angular/compiler/src/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-update-staff-detail",
  templateUrl: "./update-staff-detail.component.html",
  styleUrls: ["./update-staff-detail.component.scss"],
})
export class UpdateStaffDetailComponent implements OnInit {
  staffForm: FormGroup;
  regexConst = RegexConst;
  staffDetail: any;
  zipMask = MaskConst.ZIP;
  imageUrl = environment.baseImageUrl;
  url: any;
  countryList;

  constructor(
    private formBuilder: FormBuilder,
    private manageStaffService: ManageStaffService,
    private activatedRoute: ActivatedRoute,
    private globalService: GlobalService,
    private toastrMessageService: ToastrMessageService
  ) {}

  ngOnInit() {
    this.buildStaffForm();
    this.getStaffDetailById();
    this.getCountryList();
  }

  buildStaffForm() {
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
        [Validators.pattern(this.regexConst.EMAIL)],
      ],
      mobile_code: "",
      mobile: [this.staffDetail ? this.staffDetail.staff.mobile : ""],
      phone_code: "",

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

      citizenship_no: [
        this.staffDetail ? this.staffDetail.staff.citizenship_no : "",
      ],
      gender: [this.staffDetail ? this.staffDetail.staff.gender : ""],
      marital_status: [this.staffDetail ? this.staffDetail.staff.gender : ""],
      dob: [this.staffDetail ? this.staffDetail.staff.dob : ""],
      // citizenship
    });
  }

  staffId = this.activatedRoute.snapshot.params.id;
  getStaffDetailById(): void {
    this.manageStaffService.getStaffDetailById(this.staffId).subscribe(
      (response) => {
        if (response.status) {
          this.staffDetail = response;
          console.log(this.staffDetail, "Staff ko detail");
          this.buildStaffForm();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCountryList(): void {
    this.globalService.getCountryList().subscribe((response) => {
      if (response) {
        this.countryList = response;
      }
    });
  }

  updateStaffDetails() {
    let staff = {
      id: this.activatedRoute.snapshot.params.id,
      first_name: this.staffForm.value.first_name,
      middle_name: this.staffForm.value.middle_name,
      last_name: this.staffForm.value.last_name,
      mobile: this.staffForm.value.mobile,
      phone: this.staffForm.value.phone,
      email_address: this.staffForm.value.email_address,
      address_per: {
        country_id: this.staffForm.value.country_id,
        address_line1: this.staffForm.value.address_line1,
        address_line2: this.staffForm.value.address_line2,
        city: this.staffForm.value.city,
        state: this.staffForm.value.state,
      },
    };
    this.manageStaffService.updateStaff(staff).subscribe((response) => {
      if (response.status) {
        this.toastrMessageService.showSuccess("Staff is updated successfully");
      }
    });
  }

  onFileSelect(event): void {}
}
