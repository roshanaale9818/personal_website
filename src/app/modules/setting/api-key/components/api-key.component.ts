import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { Component, OnInit } from "@angular/core";
import { timezoneNames, ZonedDate } from "@progress/kendo-date-math";

import "@progress/kendo-date-math/tz/all";
import { ApiKeyService } from "../services/api-key.service";
@Component({
  selector: "app-api-key",
  templateUrl: "./api-key.component.html",
  styleUrls: ["./api-key.component.scss"],
})
export class ApiKeyComponent implements OnInit {
  dateTime: Date;
  date = new Date();
  timeZone = this.globalService.getDateSettingFromStorage().GS_TIME_ZONE;

  constructor(
    private globalService: GlobalService,
    private apiKeyService: ApiKeyService
  ) {}

  ngOnInit() {
    this.convertTimezone();
    this.getApiKey();
  }
  convertTimezone() {
    this.dateTime = ZonedDate.fromLocalDate(this.date, this.timeZone);
    console.log(this.dateTime.toDateString());
  }

  getApiKey(): void {
    this.apiKeyService.getApiKeyLists().subscribe((response) => {
      console.log(response);
    });
  }
}
