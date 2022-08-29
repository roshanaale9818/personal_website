import { environment } from "./../../../../../../environments/environment.dev";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { GlobalService } from "@app/shared/services/global/global.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { SettingService } from "../../services/setting.service";
import { ElementRef } from "@angular/core";
import { ViewChild } from "@angular/core";

@Component({
  selector: "app-company-logo",
  templateUrl: "./company-logo.component.html",
  styleUrls: ["./company-logo.component.scss"],
})
export class CompanyLogoComponent implements OnInit {
  companyLogoForm: FormGroup;
  baseIp = environment.baseImageUrl;

  constructor(
    private globalService: GlobalService,
    private generalSettingService: SettingService,
    private formBuilder: FormBuilder,
    private toastrMessageService: ToastrMessageService
  ) {}

  ngOnInit() {
    this.companyId = this.globalService.getCompanyIdFromStorage();
    this.buildCompanyLogoForm();
    this.getCompanyLogo();
    console.log(this.companyId);
  }

  buildCompanyLogoForm() {
    this.companyLogoForm = this.formBuilder.group({
      logo: "",
    });
  }

  companyId: number = this.globalService.getCompanyIdFromStorage();
  companyLogoDtl: any;

  getCompanyLogo(): void {
    this.generalSettingService
      .getCompanyLogo(this.companyId)
      .subscribe((response) => {
        this.companyLogoDtl = response;
      });
  }

  uploadCompanyLogo(): void {
    this.generalSettingService
      .uploadCompanyLogo(this.companyLogoForm.value, this.companyId)
      .subscribe(
        (response) => {
          this.toastrMessageService.showSuccess(
            "Company logo is added successfully"
          );
        },
        (error) => {
          this.toastrMessageService.showError("Compay logo cannot be added");
        },
        () => {}
      );
  }

  url: any;
  /**
   * called each time file input changes
   * @param event - image data
   */
  //native element ref
  @ViewChild('fileInput',{static:false})file_path: ElementRef;
  onFileSelect(event1): void {
    // file is selected
    if (event1.target.files && event1.target.files[0]) {
      const allowed_types = [
        'image/jpg',
        'image/jpeg',
        'image/png'];
        if (!allowed_types.includes(event1.target.files[0].type)) {
          let fileError = 'File type is not supported';
          this.toastrMessageService.showError(fileError);
          this.file_path.nativeElement.value ="";
          return;
      }
      var reader = new FileReader();

      reader.readAsDataURL(event1.target.files[0]); // read file as data url

      reader.onload = (event2: any) => {
        // called once readAsDataURL is completed
        this.url = event2.target.result;

        this.companyLogoForm.patchValue({
          logo: event1.target.files[0],
        });

        this.companyLogoDtl.company_logo = "";
      };
    }
  }
}
