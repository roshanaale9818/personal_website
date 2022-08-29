import { Component, forwardRef, OnInit } from "@angular/core";
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "time24-picker",
  template: ` <select
      class="form-control hours"
      [(ngModel)]="hours"
      placeholder="HH"
      (change)="changedHours($event)"
    >
      <option value="">HH</option>
      <option
        placeholder="HH"
        [ngValue]="hours"
        *ngFor="let hours of hoursList"
      >
        {{ hours }}
      </option>
    </select>
    :
    <select
      [(ngModel)]="mins"
      class="form-control mins"
      placeholder="mm"
      (change)="changedMins($event)"
    >
      <option value="">mm</option>
      <option [ngValue]="mins" *ngFor="let mins of minuteList">
        {{ mins }}
      </option>
    </select>`,
  styleUrls: ["./time24-picker.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Time24PickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => Time24PickerComponent),
      multi: true,
    },
  ],
})
export class Time24PickerComponent implements OnInit {
  constructor() {}
  hours;
  mins;
  subscriptions: Subscription[] = [];
  threshold_time = new FormControl("");
  ngOnInit() {
    this.getMinuteList();
    this.getHoursList();
    console.log(" threshold Time");

    this.subscriptions.push(
      this.threshold_time.valueChanges.subscribe((value: string) => {
        console.log(" threshold Time" + value);
        if (value) {
          const thresholdTime = JSON.stringify(value);
          this.hours = thresholdTime.split(":")[0].replace('"', "");
          this.mins = thresholdTime.split(":")[1];
          const convertedValue = this.hours + ":" + this.mins + ":" + "00";
          console.log(" Converted " + convertedValue);
          this.onChange(convertedValue);
          this.onTouched();
        }
      })
    );
  }

  minuteList: any[] = [];
  getMinuteList(): void {
    for (let i = 0; i <= 60; i++) {
      const padNum =
        i < 10 ? JSON.stringify(i).padStart(2, "0") : JSON.stringify(i);
      this.minuteList.push(padNum);
    }
  }

  hoursList: any[] = [];
  getHoursList(): void {
    for (let i = 0; i <= 24; i++) {
      const padNum =
        i < 10 ? JSON.stringify(i).padStart(2, "0") : JSON.stringify(i);
      this.hoursList.push(padNum);
    }
  }

  get value(): string {
    return this.threshold_time.value;
  }

  set value(value: string) {
    console.log(" Set Value " + value);
    if (value) {
      this.threshold_time.setValue(value);
      this.onChange(value);
      this.onTouched();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  changedHours(event): void {
    console.log(" Changed Hours " + JSON.stringify(this.hours));
    this.value = this.hours + ":" + this.mins + ":" + "00";
    this.onChange(this.value);
    // this.value = threshold_time;
    // this.onChange(threshold_time);
    this.onTouched();
  }

  changedMins(event): void {
    console.log(" Changed Mins " + JSON.stringify(this.mins));

    this.value = this.hours + ":" + this.mins + ":" + "00";
    this.onChange(this.value);
    // this.value = threshold_time;
    // this.onChange(threshold_time);
    this.onTouched();
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  // registerOnChange(fn: (_: string | "") => void): void {
  //   this.onChange = (value) => {
  //     console.log(" ON Value Change " + value);
  //     this.value = value;
  //     //this.threshold_time.setValue(value);
  //     fn(value == "" ? "" : value);
  //   };
  // }

  registerOnChange(fn: string) {
    this.onChange = fn;
  }

  writeValue(value: string) {
    console.log(" write Value");
    // const val = this.hours + ":" + this.mins + ":" + "00";
    // this.changeAccount(value);
    // this.threshold_time.setValue(val);
    if (value) {
      //  this.value = this.hours + ":" + this.mins + ":" + "00";
      this.threshold_time.setValue(value);
    }

    if (value === null) {
      this.threshold_time.reset();
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.threshold_time.valid ? null : { profile: { valid: false } };
  }
}
