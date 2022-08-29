import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { ClientService } from "../../client.service";
import { GlobalService } from "../../../../../shared/services/global/global.service";
import { ActivatedRoute } from "@angular/router";
import { CustomResponse } from "../../../../../shared/models/custom-response.model";

import { ToastrMessageService } from "../../../../../shared/services/toastr-message/toastr-message.service";

@Component({
  selector: "app-grace-rule",
  templateUrl: "./grace-rule.component.html",
  styleUrls: ["./grace-rule.component.scss"],
})
export class GraceRuleComponent implements OnInit {
  graceRuleForm: FormGroup;

  ifRulesStart: boolean;
  uptoRulesStart: boolean;
  dontAllowRulesStart: boolean;
  dontAllowEndRuleStart: boolean;
  ifRulesEnd: boolean;
  uptoRulesEnd: boolean;
  dontAllowRulesEnd: boolean;
  dontAllowEndRuleEnd: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private globalService: GlobalService,
    private activatedRoute: ActivatedRoute,
    private toastrMessageService: ToastrMessageService
  ) {}

  ngOnInit() {
    this.buildStartGraceRuleForm();
    this.activatedRoute.parent.params.subscribe((params) => {
      this.clientId = params["id"];
      if (this.clientId) {
        this.getShiftList();
        this.getShiftFromCompany();
      }
    });
  }

  companyShiftList: any[] = [];
  getShiftFromCompany(): void {
    this.clientService.getShiftByCompanyId().subscribe((response) => {
      this.companyShiftList = response.data;
    });
  }

  buildStartGraceRuleForm(): void {
    this.graceRuleForm = this.formBuilder.group({
      status: "",
      rule_type: "",
      ifRuleStart: this.formBuilder.array([]),
      uptoRuleStart: this.formBuilder.array([]),
      dontAllowRuleStart: this.formBuilder.array([]),
      ifRuleEnd: this.formBuilder.array([]),
      uptoRuleEnd: this.formBuilder.array([]),
      dontAllowRuleEnd: this.formBuilder.array([]),
    });
  }

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  clientId: any;

  clientShiftList;
  getShiftList(): void {
    const getBody = {
      limit: this.limit,
      page: this.page,
      sortnane: this.sortnane,
      sortno: this.sortno,
      company_id: this.globalService.getCompanyIdFromStorage(),
      search: {
        client_id: this.clientId,
        name: "",
        shift_from: "",
        shift_to: "",
        late_warn_time: "",
        check_in_restriction: "",
      },
    };
    this.clientService
      .getClientShift(getBody)
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.clientShiftList = response.data;
        }
      });
  }

  shiftFrom;
  shiftTo;
  clinetShiftId: any;

  editMode: boolean;
  addMode: boolean;
  selectedShift;
  graceReportList: any;

  changeShift(event): void {
    this.selectedShift = this.clientShiftList.filter(
      (a) => a.client_shift_id == event
    );
    this.shiftFrom = this.selectedShift[0].shift_from;
    this.shiftTo = this.selectedShift[0].shift_to;
    this.clinetShiftId = this.selectedShift[0].client_shift_id;
    const selectedShift = this.graceRuleForm.get("status").value;
    this.removeStart = [];
    this.removeEnd = [];
    this.graceRuleForm.reset();
    this.buildStartGraceRuleForm();
    this.shiftCopyForm = false;
    this.graceRuleForm.get("status").setValue(selectedShift);
    this.getGraceReport();
  }

  // Get Grace Time List
  getGraceReport(): void {
    this.clientService
      .getGraceTime(this.clientId, this.selectedShift[0].client_shift_id)
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.graceReportList = response.data;
          if (
            this.graceReportList.start_if_rule.length > 0 ||
            this.graceReportList.start_upto_rule.length > 0 ||
            this.graceReportList.start_dont_allow > 0
          ) {
            this.editMode = true;
            this.addMode = false;
          } else {
            this.addMode = true;
            this.editMode = false;
          }

          this.setGraceList();
        }
      });
  }

  removeStart = [];
  removeEnd = [];

  removeIfRuleStart(index, grace): void {
    (<FormArray>this.graceRuleForm.get("ifRuleStart")).removeAt(index);
    if (grace.get("id").value) {
      this.removeStart.push({ is_remove: "1", id: grace.get("id").value });
    }
  }

  removeIfRulesEnd(index, grace): void {
    (<FormArray>this.graceRuleForm.get("ifRuleEnd")).removeAt(index);
    if (grace.get("id").value) {
      this.removeEnd.push({ is_remove: "1", id: grace.get("id").value });
    }
  }

  removeUptoRulesStart(index, grace): void {
    (<FormArray>this.graceRuleForm.get("uptoRuleStart")).removeAt(index);
    if (grace.get("id").value) {
      this.removeStart.push({ is_remove: "1", id: grace.get("id").value });
    }
  }

  removeUptoRulesEnd(index, grace): void {
    (<FormArray>this.graceRuleForm.get("uptoRuleEnd")).removeAt(index);
    if (grace.get("id").value) {
      this.removeEnd.push({ is_remove: "1", id: grace.get("id").value });
    }
  }

  removeDontAllowRuleStart(index, grace): void {
    (<FormArray>this.graceRuleForm.get("dontAllowRuleStart")).removeAt(index);
    if (grace.get("id").value) {
      this.removeStart.push({ is_remove: "1", id: grace.get("id").value });
    }
  }

  removeDontAllowRulesEnd(index, grace): void {
    (<FormArray>this.graceRuleForm.get("dontAllowRuleEnd")).removeAt(index);
    if (grace.get("id").value) {
      this.removeEnd.push({ is_remove: "1", id: grace.get("id").value });
    }
  }

  endGraceForm: FormGroup;
  ifEndRules: FormArray;

  setGraceList(): void {
    if (
      this.graceReportList.start_if_rule &&
      this.graceReportList.start_if_rule.length
    ) {
      this.graceRuleForm.setControl(
        "ifRuleStart",
        this.setIfStartFormArray(this.graceReportList.start_if_rule)
      );
    }
    if (
      this.graceReportList.start_upto_rule &&
      this.graceReportList.start_upto_rule.length
    ) {
      this.graceRuleForm.setControl(
        "uptoRuleStart",
        this.setUptoStartFormArray(this.graceReportList.start_upto_rule)
      );
    }
    if (
      this.graceReportList.start_dont_allow &&
      this.graceReportList.start_dont_allow.length
    ) {
      this.graceRuleForm.setControl(
        "dontAllowRuleStart",
        this.setDontAllowStartFormArray(this.graceReportList.start_dont_allow)
      );
    }

    if (
      this.graceReportList.end_if_rule &&
      this.graceReportList.end_if_rule.length
    ) {
      this.graceRuleForm.setControl(
        "ifRuleEnd",
        this.setIfEndFormArray(this.graceReportList.end_if_rule)
      );
    }
    if (
      this.graceReportList.end_upto_rule &&
      this.graceReportList.end_upto_rule.length
    ) {
      this.graceRuleForm.setControl(
        "uptoRuleEnd",
        this.setUptoEndFormArray(this.graceReportList.end_upto_rule)
      );
    }
    if (
      this.graceReportList.end_dont_allow &&
      this.graceReportList.end_dont_allow.length
    ) {
      this.graceRuleForm.setControl(
        "dontAllowRuleEnd",
        this.setDontAllowEndFormArray(this.graceReportList.end_dont_allow)
      );
    }
  }

  public mask = {
    guide: true,
    showMask: true,
    mask: [/\d/, /\d/, ":", /\d/, /\d/],
  };

  inputIfEndOnBlur(event, i): void {
    const converted = JSON.stringify(event);

    let hours = converted.split(":")[0].replace('"', "");
    let mins = converted.split(":")[1];

    if (hours && hours.includes("_")) {
      this.graceRuleForm
        .get("ifRuleEnd")
        ["controls"][i].get("threshold_time")
        .setValue("00" + ":" + mins);
    }
    if (mins && mins.includes("_")) {
      this.graceRuleForm
        .get("ifRuleEnd")
        ["controls"][i].get("threshold_time")
        .setValue(hours + ":" + "00");
    }
    if (parseInt(hours) > 23) {
      //alert(" Hours can't be greater then 23");
      this.toastrMessageService.showError(" Hours can't be greater then 23");
      this.graceRuleForm
        .get("ifRuleEnd")
        ["controls"][i].get("threshold_time")
        .setValue("");
    }
    if (parseInt(mins) > 59) {
      //  alert(" Mins can't be greater then 59");
      this.toastrMessageService.showError("Minutes can't be greater then 59");
      this.graceRuleForm
        .get("ifRuleEnd")
        ["controls"][i].get("threshold_time")
        .setValue("");
    }
  }

  inputIfStartOnBlur(event, i): void {
    const converted = JSON.stringify(event);
    const hours = converted.split(":")[0].replace('"', "");
    const mins = converted.split(":")[1];

    if (hours && hours.includes("_")) {
      this.graceRuleForm
        .get("ifRuleStart")
        ["controls"][i].get("threshold_time")
        .setValue("00" + ":" + mins);
    }
    if (mins && mins.includes("_")) {
      this.graceRuleForm
        .get("ifRuleStart")
        ["controls"][i].get("threshold_time")
        .setValue(hours + ":" + "00");
    }
    if (parseInt(hours) > 23) {
      //alert(" Hours can't be greater then 23");
      this.toastrMessageService.showError(" Hours can't be greater then 23");
      this.graceRuleForm
        .get("ifRuleStart")
        ["controls"][i].get("threshold_time")
        .setValue("");
    }
    if (parseInt(mins) > 59) {
      //  alert(" Mins can't be greater then 59");
      this.toastrMessageService.showError("Minutes can't be greater then 59");
      this.graceRuleForm
        .get("ifRuleStart")
        ["controls"][i].get("threshold_time")
        .setValue("");
    }
  }

  setIfStartFormArray(ifStartList): FormArray {
    this.ifRulesStart = true;
    const ifStartFormArray = new FormArray([]);
    if (ifStartList && ifStartList.length > 0) {
      ifStartList.forEach((element) => {
        ifStartFormArray.push(
          this.formBuilder.group({
            id: element.grace_time_id,
            type: element.type,
            rule_type: element.rule_type,
            threshold_time: element.threshold_time,
            status: element.status,
            rounded_time: element.rounded_time,
          })
        );
      });
    } else {
      ifStartFormArray.push(
        this.formBuilder.group({
          id: "",
          type: "",
          rule_type: this.graceRuleForm.get("rule_type").value,
          threshold_time: "",
          status: "",
          rounded_time: "",
        })
      );
    }
    return ifStartFormArray;
  }

  setIfEndFormArray(ifStartList): FormArray {
    this.ifRulesEnd = true;
    const ifStartFormArray = new FormArray([]);
    if (ifStartList && ifStartList.length > 0) {
      ifStartList.forEach((element) => {
        ifStartFormArray.push(
          this.formBuilder.group({
            id: element.grace_time_id,
            type: element.type,
            rule_type: element.rule_type,

            threshold_time: element.threshold_time,
            status: element.status,
            rounded_time: element.rounded_time,
          })
        );
      });
    } else {
      ifStartFormArray.push(
        this.formBuilder.group({
          id: "",
          rule_type: "",

          threshold_time: "",
          type: "",
          status: "",
          rounded_time: "",
        })
      );
    }
    return ifStartFormArray;
  }

  shiftCopyForm: boolean = true;
  changeCopyShift(event): void {
    const selectedShift = this.companyShiftList.filter(
      (x) => x.client_shift_id === event
    );
    console.log(selectedShift);
    this.clientService
      .getGraceTime(selectedShift[0].client_id, event)
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          if (
            response.data.start_if_rule &&
            response.data.start_if_rule.length
          ) {
            this.graceRuleForm.setControl(
              "ifRuleStart",
              this.setIfStartFormArray(response.data.start_if_rule)
            );
          } else {
            this.graceRuleForm.setControl(
              "ifRuleStart",
              this.setIfStartFormArray([])
            );
          }
          if (
            response.data.start_upto_rule &&
            response.data.start_upto_rule.length
          ) {
            this.graceRuleForm.setControl(
              "uptoRuleStart",
              this.setUptoStartFormArray(response.data.start_upto_rule)
            );
          } else {
            this.graceRuleForm.setControl(
              "uptoRuleStart",
              this.setUptoStartFormArray([])
            );
          }
          if (
            response.data.start_dont_allow &&
            response.data.start_dont_allow.length
          ) {
            this.graceRuleForm.setControl(
              "dontAllowRuleStart",
              this.setDontAllowStartFormArray(response.data.start_dont_allow)
            );
          } else {
            this.graceRuleForm.setControl(
              "dontAllowRuleStart",
              this.setDontAllowStartFormArray([])
            );
          }

          if (response.data.end_if_rule && response.data.end_if_rule.length) {
            this.graceRuleForm.setControl(
              "ifRuleEnd",
              this.setIfEndFormArray(response.data.end_if_rule)
            );
          } else {
            this.graceRuleForm.setControl(
              "ifRuleEnd",
              this.setIfEndFormArray([])
            );
          }
          if (
            response.data.end_upto_rule &&
            response.data.end_upto_rule.length
          ) {
            this.graceRuleForm.setControl(
              "uptoRuleEnd",
              this.setUptoEndFormArray(response.data.end_upto_rule)
            );
          } else {
            this.graceRuleForm.setControl(
              "uptoRuleEnd",
              this.setUptoEndFormArray([])
            );
          }
          if (
            response.data.end_dont_allow &&
            response.data.end_dont_allow.length
          ) {
            this.graceRuleForm.setControl(
              "dontAllowRuleEnd",
              this.setDontAllowEndFormArray(response.data.end_dont_allow)
            );
          } else {
            this.graceRuleForm.setControl(
              "dontAllowRuleEnd",
              this.setDontAllowEndFormArray([])
            );
          }
        }
      });
  }

  setUptoStartFormArray(uptoStartList): FormArray {
    this.uptoRulesStart = true;
    const uptoStartFormArray = new FormArray([]);
    if (uptoStartList && uptoStartList.length > 0) {
      uptoStartList.forEach((element) => {
        uptoStartFormArray.push(
          this.formBuilder.group({
            id: element.grace_time_id,
            threshold_time: element.threshold_time,
            status: element.status,
            rule_type: element.rule_type,
            type: element.type,
            rounded_time: element.rounded_time,
          })
        );
      });
    } else {
      uptoStartFormArray.push(
        this.formBuilder.group({
          id: "",
          threshold_time: "",
          status: "",
          type: "",
          rule_type: "",
          rounded_time: "",
        })
      );
    }
    return uptoStartFormArray;
  }

  setUptoEndFormArray(uptoStartList): FormArray {
    this.uptoRulesEnd = true;
    const uptoStartFormArray = new FormArray([]);
    if (uptoStartList && uptoStartList.length > 0) {
      uptoStartList.forEach((element) => {
        uptoStartFormArray.push(
          this.formBuilder.group({
            id: element.grace_time_id,
            threshold_time: element.threshold_time,
            status: element.status,
            type: element.type,
            rounded_time: element.rounded_time,
          })
        );
      });
    } else {
      uptoStartFormArray.push(
        this.formBuilder.group({
          id: "",
          threshold_time: "",
          status: "",
          type: "",
          rounded_time: "",
        })
      );
    }
    return uptoStartFormArray;
  }

  setDontAllowStartFormArray(dontAllowStartList): FormArray {
    this.dontAllowRulesStart = true;
    const dontAllowStartFormArray = new FormArray([]);
    if (dontAllowStartList && dontAllowStartList.length > 0) {
      dontAllowStartList.forEach((element) => {
        dontAllowStartFormArray.push(
          this.formBuilder.group({
            id: element.grace_time_id,
            threshold_time: element.threshold_time,
            status: element.status,
            type: element.type,
            rounded_time: element.rounded_time,
          })
        );
      });
    } else {
      dontAllowStartFormArray.push(
        this.formBuilder.group({
          id: "",
          threshold_time: "",
          status: "",
          type: "",
          rounded_time: "",
        })
      );
    }
    return dontAllowStartFormArray;
  }

  setDontAllowEndFormArray(dontAllowStartList): FormArray {
    this.dontAllowRulesEnd = true;
    const dontAllowStartFormArray = new FormArray([]);
    if (dontAllowStartList && dontAllowStartList.length > 0) {
      dontAllowStartList.forEach((element) => {
        dontAllowStartFormArray.push(
          this.formBuilder.group({
            id: element.grace_time_id,
            threshold_time: element.threshold_time,
            status: element.status,
            rounded_time: element.rounded_time,
            rule_type: element.rule_type,
            type: element.type,
          })
        );
      });
    } else {
      dontAllowStartFormArray.push(
        this.formBuilder.group({
          id: "",
          threshold_time: "",
          status: "",
          rounded_time: "",
          rule_type: "",
          type: "",
        })
      );
    }
    return dontAllowStartFormArray;
  }

  ifEndRule: boolean;
  uptoRuless: boolean;
  checkRulesType(event): void {
    this.endGraceForm.get("rule_type").setValue(null);

    if (event == "ifRule") {
      this.ifEndRule = true;
      const ifRuleArray = this.endGraceForm.get("ifRule") as FormArray;
      ifRuleArray.push(this.addIfRuleFormGroup());
    }
    if (event == "uptoRule") {
      this.uptoRuless = true;
      const uptoRuleArray = this.endGraceForm.get("uptoRule") as FormArray;
      uptoRuleArray.push(this.addUptoRuleStartFormGroup());
    }
    if (event == "dontAllowRule") {
      this.dontAllowEndRuleEnd = true;
      const dontAllowRuleArray = this.endGraceForm.get(
        "dontAllowRule"
      ) as FormArray;
      dontAllowRuleArray.push(this.addDontAllowRuleStartFormGroup());
    }
  }

  ifStartRule;
  addNewStartIfRule(event): void {
    this.ifStartRule = event;
    this.ifRulesStart = true;
    const ifRuleArray = this.graceRuleForm.get("ifRuleStart") as FormArray;
    ifRuleArray.push(this.addIfRuleFormGroup());
  }

  //**If Rule */
  addIfRuleFormGroup() {
    return this.formBuilder.group({
      threshold_time: "",
      status: "",
      hours: "",
      mins: "",
      rounded_time: this.shiftFrom,
      type: "start",
      id: "",
      rule_type: this.ifStartRule,
    });
  }

  disabledUptoStart: boolean = false;
  startUptoRule;
  addNewStartUptoRule(event): void {
    this.startUptoRule = event;
    this.uptoRulesStart = true;
    const uptoRuleArray = this.graceRuleForm.get("uptoRuleStart") as FormArray;
    uptoRuleArray.push(this.addUptoRuleStartFormGroup());
  }

  //**Upto Rule */
  addUptoRuleStartFormGroup() {
    return this.formBuilder.group({
      id: "",
      threshold_time: "",
      status: "",
      type: "start",
      rounded_time: "",
      rule_type: this.startUptoRule,
    });
  }

  addNewStartDontAllowRule(): void {
    const dontAllowRuleArray = this.graceRuleForm.get(
      "dontAllowRuleStart"
    ) as FormArray;
    if (dontAllowRuleArray)
      dontAllowRuleArray.push(this.addDontAllowRuleStartFormGroup());
  }

  // ** Don't Allow Rule *//
  addDontAllowRuleStartFormGroup() {
    return this.formBuilder.group({
      id: "",
      rule_type: "dont_allow",
      threshold_time: "",
      status: "",
      type: "start",
      rounded_time: "",
    });
  }

  endIfRule;
  addNewEndIfRule(event): void {
    this.endIfRule = event;
    const ifRuleArray = this.graceRuleForm.get("ifRuleEnd") as FormArray;
    ifRuleArray.push(this.addIfRuleEndFormGroup());
  }

  // ** End If Rule**//
  addIfRuleEndFormGroup() {
    return this.formBuilder.group({
      id: "",
      rule_type: this.endIfRule,
      threshold_time: "",
      status: "",
      type: "end",
      rounded_time: this.shiftTo,
    });
  }

  endUptoRule;
  addNewEndUptoRule(event): void {
    this.endUptoRule = event;
    const uptoRuleArray = this.graceRuleForm.get("uptoRuleEnd") as FormArray;
    uptoRuleArray.push(this.addUptoRuleEndFormGroup());
  }

  // ** End Up to Rule
  addUptoRuleEndFormGroup() {
    return this.formBuilder.group({
      threshold_time: "",
      rounded_time: "",
      type: "end",
      rule_type: this.endUptoRule,
      id: "",
    });
  }

  endDontAllow;
  addNewEndDontAllowRule(event): void {
    this.endDontAllow = event;
    const dontAllowRuleArray = this.graceRuleForm.get(
      "dontAllowRuleEnd"
    ) as FormArray;
    dontAllowRuleArray.push(this.addDontAllowRuleEndFormGroup());
  }

  // ** End Dont Allow Rule
  addDontAllowRuleEndFormGroup() {
    return this.formBuilder.group({
      grace_time_id: "",
      rounded_time: "",
      rule_type: this.endDontAllow,
      status: "",
      threshold_time: "",
      type: "end",
      id: "",
    });
  }

  addRuleStartType(event): void {
    if (event == "if_rule") {
      this.ifRulesStart = true;
      const ifRuleArray = this.graceRuleForm.get("ifRuleStart") as FormArray;
      ifRuleArray.push(this.addIfRuleFormGroup());
    }

    if (event == "upto_rule") {
      this.uptoRulesStart = true;
      const uptoRuleArray = this.graceRuleForm.get(
        "uptoRuleStart"
      ) as FormArray;
      uptoRuleArray.push(this.addUptoRuleStartFormGroup());
    }

    if (event == "dont_allow") {
      this.dontAllowRulesStart = true;
      const dontAllowRuleArray = this.graceRuleForm.get(
        "dontAllowRuleStart"
      ) as FormArray;
      dontAllowRuleArray.push(this.addDontAllowRuleStartFormGroup());
    }
  }

  addRuleEndType(event): void {
    if (event == "if_rule") {
      this.ifRulesEnd = true;
      const ifRuleArray = this.graceRuleForm.get("ifRuleEnd") as FormArray;
      ifRuleArray.push(this.addIfRuleEndFormGroup());
    }

    if (event == "upto_rule") {
      this.uptoRulesEnd = true;
      const uptoRuleArray = this.graceRuleForm.get("uptoRuleEnd") as FormArray;
      uptoRuleArray.push(this.addUptoRuleEndFormGroup());
    }

    if (event == "dont_allow") {
      this.dontAllowRulesEnd = true;
      const dontAllowRuleArray = this.graceRuleForm.get(
        "dontAllowRuleEnd"
      ) as FormArray;
      dontAllowRuleArray.push(this.addDontAllowRuleEndFormGroup());
    }
  }

  addShift(): void {
    const startArray = this.graceRuleForm.get("ifRuleStart").value;
    startArray.push(...this.graceRuleForm.get("uptoRuleStart").value);
    startArray.push(...this.graceRuleForm.get("dontAllowRuleStart").value);
    startArray.push(...this.removeStart);

    const endArray = this.graceRuleForm.get("ifRuleEnd").value;
    endArray.push(...this.graceRuleForm.get("uptoRuleEnd").value);
    endArray.push(...this.graceRuleForm.get("dontAllowRuleEnd").value);
    endArray.push(...this.removeEnd);
    const obj = {
      access_token: this.globalService.getAccessTokenFromCookie(),
      client_id: this.clientId,
      client_shift_id: this.clinetShiftId,
      company_id: this.globalService.getCompanyIdFromStorage(),
      start: startArray,
      end: endArray,
    };

    this.clientService
      .addGraceTime(obj)
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Grace Rule is added successfully."
          );
        }
        this.getGraceReport();
      });
  }

  updateShift(): void {
    const startArray = this.graceRuleForm.get("ifRuleStart").value;
    startArray.push(...this.graceRuleForm.get("uptoRuleStart").value);
    startArray.push(...this.graceRuleForm.get("dontAllowRuleStart").value);
    startArray.push(...this.removeStart);

    const endArray = this.graceRuleForm.get("ifRuleEnd").value;
    endArray.push(...this.graceRuleForm.get("uptoRuleEnd").value);
    endArray.push(...this.graceRuleForm.get("dontAllowRuleEnd").value);
    endArray.push(...this.removeEnd);

    const obj = {
      id: "",
      access_token: this.globalService.getAccessTokenFromCookie(),
      client_id: this.clientId,
      client_shift_id: this.clinetShiftId,
      company_id: this.globalService.getCompanyIdFromStorage(),
      start: startArray,
      end: endArray,
    };

    this.clientService
      .updateGraceTime(obj)
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Grace rule is updated successfully"
          );
        }
        this.getGraceReport();
      });
  }
}
