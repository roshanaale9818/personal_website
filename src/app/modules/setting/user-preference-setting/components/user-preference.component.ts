import { ToastrMessageService } from "./../../../../shared/services/toastr-message/toastr-message.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoginService } from "./../../../auth/login/services/login.service";
import { LocalStorageService } from "./../../../../shared/services/local-storage/local-storage.service";
import { UserPreferenceSettingService } from "./../services/user-preference-setting.service";
import { Component, OnInit } from "@angular/core";
import { GlobalService } from "@app/shared/services/global/global.service";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";

@Component({
  selector: "app-user-preference",
  templateUrl: "./user-preference.component.html",
  styleUrls: ["./user-preference.component.scss"],
})
export class UserPreferenceComponent implements OnInit {
  userPreferenceForm: FormGroup;
  userId = this.localStorageService.getLocalStorageItem("user_id");

  constructor(
    private userPreferenceService: UserPreferenceSettingService,
    private localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private toastrMessageService: ToastrMessageService,
    public authService:AuthService
  ) {}

  ngOnInit() {
    this.getUserPreference();
    this.getUserType();
    this.buildUserPreferenceForm();
  }

  buildUserPreferenceForm(): void {
    this.userPreferenceForm = this.formBuilder.group({
      UP_TIME_FORMAT: "",
      UP_DATE_TYPE: "",
      UP_DATE_FORMAT: "",
      UP_ATTENDANCE_EMAIL: "",
      UP_LEAVE_EMAIL: "",
      UP_LEAVE_ALERT: "",
      UP_BIRTHDAY: "",
      UP_ATT_SUMMARY: "",
      UP_ATT_CORRECTION_EMAIL: "",
      UP_DEPARTMENT: "",
      UP_EEID: "",
      UP_LUNCH: "",
    });
  }

  settingBody = {
    user_id: this.userId,
    company_id: this.globalService.getCompanyIdFromStorage(),
    setting: {
      UP_TIME_FORMAT: "",
      UP_DATE_TYPE: "",
      UP_DATE_FORMAT: "",
      UP_ATTENDANCE_EMAIL: "",
      UP_LEAVE_EMAIL: "",
      UP_LEAVE_ALERT: "",
      UP_BIRTHDAY: "",
      UP_ATT_SUMMARY: "",
      UP_ATT_CORRECTION_EMAIL: "",
      UP_DEPARTMENT: "",
      UP_EEID: "",
      UP_LUNCH: "",
    },
  };

  getControlValue(controlName) {
    const controlValue = {
      value: "",
    };
    this.userPreferenceList.forEach((item) => {
      if (item.code == controlName) {
        controlValue.value = item.value;
      }
    });

    return controlValue.value;
  }

  userPreferenceList: any[] = [];
  getUserPreference(): void {
    this.userPreferenceService
      .getUserPreferenceSetting(this.userId)
      .subscribe((response) => {
        if (response.status) {
          this.userPreferenceList = response.data;
          //patch value only if there is setting
          if (this.userPreferenceList.length > 0) {
            //patching value
            this.patchPreferenceValue();
          }
        }
      });
  }

  getAndSetUserPreference() {
    this.userPreferenceService
      .getUserPreferenceSetting(this.userId)
      .subscribe((response) => {
        if (response.status) {
          this.localStorageService.setLocalStorageItem(
            "userPreferenceSetting",
            response.data
          );
          console.log("set successfull");
        }
      });
  }

  userTypeList;
  getUserType(): void {
    this.userPreferenceService.getUserType().subscribe((response) => {
      if (response.status) {
        this.userTypeList = response.data;
      }
    });
  }

  onSave(): void {
    this.settingBody.setting.UP_TIME_FORMAT =
      this.userPreferenceForm.value.UP_TIME_FORMAT;
    this.settingBody.setting.UP_DATE_TYPE =
      this.userPreferenceForm.value.UP_DATE_TYPE;
    this.settingBody.setting.UP_DATE_FORMAT =
      this.userPreferenceForm.value.UP_DATE_FORMAT;
    this.settingBody.setting.UP_ATTENDANCE_EMAIL =
      this.userPreferenceForm.value.UP_ATTENDANCE_EMAIL == true ? "1" : "0";
    this.settingBody.setting.UP_LEAVE_EMAIL =
      this.userPreferenceForm.value.UP_LEAVE_EMAIL == true ? "1" : "0";
    this.settingBody.setting.UP_LEAVE_ALERT =
      this.userPreferenceForm.value.UP_LEAVE_ALERT == true ? "1" : "0";
    this.settingBody.setting.UP_BIRTHDAY =
      this.userPreferenceForm.value.UP_BIRTHDAY == true ? "1" : "0";
    this.settingBody.setting.UP_ATT_SUMMARY =
      this.userPreferenceForm.value.UP_ATT_SUMMARY == true ? "1" : "0";
    this.settingBody.setting.UP_ATT_CORRECTION_EMAIL =
      this.userPreferenceForm.value.UP_ATT_CORRECTION_EMAIL == true ? "1" : "0";
    this.settingBody.setting.UP_DEPARTMENT =
      this.userPreferenceForm.value.UP_DEPARTMENT == true ? "1" : "0";
    this.settingBody.setting.UP_EEID =
      this.userPreferenceForm.value.UP_EEID == true ? "1" : "0";
    this.settingBody.setting.UP_LUNCH =
      this.userPreferenceForm.value.UP_LUNCH == true ? "1" : "0";
    this.userPreferenceService;
    if (
      this.userPreferenceList == null ||
      this.userPreferenceList.length == 0
    ) {
      this.addUserType(this.settingBody);
    } else {
      this.editUserType(this.settingBody);
    }
  }

  addUserType(body): void {
    this.userPreferenceService.addUserPreference(body).subscribe((response) => {
      if (response.status) {
        this.toastrMessageService.showSuccess("Setting is added successfully.");
        this.getAndSetUserPreference();
      } else {
        this.toastrMessageService.showError(response.detail);
      }
    });
  }

  editUserType(body): void {
    this.userPreferenceService
      .updateUserPreference(body)
      .subscribe((response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Setting is updated successfully."
          );
          this.getAndSetUserPreference();
        } else {
          this.toastrMessageService.showError(response.detail);
        }
      });
  }
  patchPreferenceValue() {
    if (this.userPreferenceList.length > 0) {
      for (let controlName in this.userPreferenceForm.controls) {
        let preferenceValue = this.userPreferenceList.filter(
          (x) => x.code == controlName
        )[0];
        if (
          controlName == "UP_DATE_FORMAT" ||
          controlName == "UP_DATE_TYPE" ||
          controlName == "UP_TIME_FORMAT"
        ) {
          this.userPreferenceForm.patchValue({
            [controlName]:
              preferenceValue != null ? preferenceValue.value : null,
          });
        } else {
          //for check box to set true or false according to the data saved
          if (preferenceValue) {
            this.userPreferenceForm
              .get(controlName)
              .setValue(preferenceValue.value == "1" ? true : false);
          }
        }
      }
    }
  }
}
