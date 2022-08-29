import * as NepaliDateConverter from "nepali-date";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  Component,
  forwardRef,
  Input,
  ViewEncapsulation,
  Pipe
} from "@angular/core";
import {
  NepaliDate,
  MonthData,
  DaysMapping,
  MonthMapping,
  DateFormatter
} from "./models/types.model";
@Component({
  selector: "np-datepicker",
  template:
    '<input\n    class="datepicker__input form-control"\n    type="text"\n    [value]="formattedDate | toNp: language"\n    [ngClass]="inputClass"\n    #origin="cdkOverlayOrigin"\n    cdk-overlay-origin\n    (focus)="open()"\n    (keydown)="$event.preventDefault()"\n    aria-hidden="true"\n    [hidden]="hideInput">\n<ng-template\n    cdk-connected-overlay\n    cdkConnectedOverlayLockPosition\n    cdkConnectedOverlayHasBackdrop\n    cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"\n    [cdkConnectedOverlayOrigin]="origin"\n    [cdkConnectedOverlayOpen]="isOpen"\n    (backdropClick)="close()"\n    (detach)="close()">\n  <ng-container [ngTemplateOutlet]="dp"></ng-container>\n</ng-template>\n\n<ng-container [ngTemplateOutlet]="dp" *ngIf="alwaysVisible"></ng-container>\n\n<ng-template #dp>\n  <div class="datepicker__container">\n    <div class="datepicker__options-container">\n      <span class="datepicker__options-year-container">\n        <span>\n          {{\'Year\' | toNp : language : \'word\'}}:\n        </span>\n        <select (change)="selectYear($event.target.value)">\n          <option\n              *ngFor="let year of years"\n              [value]="year"\n              [selected]="year === currentNepaliDate?.year">\n            {{year | toNp: language }}\n          </option>\n        </select>\n      </span>\n      <span class="datepicker__options-month-container">\n        <span>{{\'Month\' | toNp : language : \'word\'}}: </span>\n        <select (change)="selectMonth($event.target.value)">\n          <option\n              *ngFor="let month of monthsMapping[language][monthDisplayType]; index as i"\n              [value]="month"\n              [selected]="i === currentNepaliDate?.month">\n            {{month}}\n          </option>\n        </select>\n      </span>\n    </div>\n    <div class="datepicker__days-container">\n      <div class="datepicker__days" *ngFor="let day of daysMapping[language][dayDisplayType]; index as i">\n        <div class="datepicker__weekday">{{day}}</div>\n        <div class="datepicker__date-container" *ngFor="let date of currentMonthData[i]">\n          <div\n              class="datepicker__date"\n              [class.datepicker__date--active]="\n                date === selectedDate?.day &&\n                currentNepaliDate.month === selectedDate?.month &&\n                currentNepaliDate.year === selectedDate?.year\n              "\n              [class.datepicker__date--current-day]="\n                date === nepaliDateToday.day &&\n                currentNepaliDate.month === nepaliDateToday.month &&\n                currentNepaliDate.year === nepaliDateToday.year\n              "\n              [class.datepicker__date--disabled]="!date"\n              (click)="selectDate(date)">\n            <span *ngIf="!date">&nbsp;</span>\n            {{date | toNp: language }}\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</ng-template>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NepaliDatepickerComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    '.cdk-global-overlay-wrapper,.cdk-overlay-container{pointer-events:none;top:0;left:0;height:100%;width:100%}.cdk-overlay-container{position:fixed;z-index:1000}.cdk-overlay-container:empty{display:none}.cdk-global-overlay-wrapper{display:flex;position:absolute;z-index:1000}.cdk-overlay-pane{position:absolute;pointer-events:auto;box-sizing:border-box;z-index:1000;display:flex;max-width:100%;max-height:100%}.cdk-overlay-backdrop{position:absolute;top:0;bottom:0;left:0;right:0;z-index:1000;pointer-events:auto;-webkit-tap-highlight-color:transparent;transition:opacity .4s cubic-bezier(.25,.8,.25,1);opacity:0}.cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:1}@media screen and (-ms-high-contrast:active){.cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:.6}}.cdk-overlay-dark-backdrop{background:rgba(0,0,0,.32)}.cdk-overlay-transparent-backdrop,.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing{opacity:0}.cdk-overlay-connected-position-bounding-box{position:absolute;z-index:1000;display:flex;flex-direction:column;min-width:1px;min-height:1px}.cdk-global-scrollblock{position:fixed;width:100%;overflow-y:scroll}.datepicker__input{display:block}.datepicker__container{--font-family:arial,sans-serif;--font-size:14px;--container-padding:8px 5px;--container-border-color:lightgray;--container-border:1px solid;--container-background-color:white;--select-height:24px;--option-margin:0 0 7px;--option-year-container-margin:0 10px 0;--days-size:40px;--weekday-margin:0 0 5px;--active-day-color:white;--active-day-background:#27a4f7;--hover-color:#27a4f7;--selected-color:#27a4f7;display:inline-block;font-family:"arial, sans-serif";font-family:var(--font-family);font-size:14px;font-size:var(--font-size);padding:8px 5px;padding:var(--container-padding);border:1px solid #d3d3d3;border:var(--container-border);border-color:var(--container-border-color);background-color:#fff;background-color:var(--container-background-color)}.datepicker__options-container{margin:0 0 7px;margin:var(--option-margin)}.datepicker__options-container select{height:24px;height:var(--select-height)}.datepicker__options-year-container{display:inline-block;margin:0 10px;margin:var(--option-year-container-margin)}.datepicker__days{display:inline-block;vertical-align:top;text-align:center;width:40px;width:var(--days-size)}.datepicker__weekday{margin:0 0 5px;margin:var(--weekday-margin);font-weight:700;text-align:center}.datepicker__date{width:40px;width:var(--days-size);height:40px;height:var(--days-size);line-height:40px;line-height:var(--days-size);cursor:pointer}.datepicker__date--active{color:#fff;color:var(--active-day-color);background:#27a4f7;background:var(--active-day-background)}.datepicker__date--current-day:not(.datepicker__date--active){color:#27a4f7;color:var(--selected-color);font-weight:700}.datepicker__date--disabled{pointer-events:none}.datepicker__date:hover:not(.datepicker__date--active){color:#27a4f7;color:var(--hover-color);transition:color .3s}'
  ]
})
export class NepaliDatepickerComponent {
  nepaliDateToday: NepaliDate;
  currentNepaliDate: NepaliDate;
  selectedDate: NepaliDate;
  formattedDate: string;
  currentDate: Date;
  displayDate: string;
  years: number[];
  currentMonthData: MonthData;
  daysMapping: DaysMapping;
  monthsMapping: MonthMapping;
  isOpen: boolean;
  hideInput: boolean;
  alwaysVisible: boolean;
  inputClass: string;
  language: "en" | "ne";
  monthDisplayType: "default" | "modern" | "short";
  dayDisplayType: "default" | "short";
  @Input() dateFormatter: DateFormatter;
  propagateChange: (_: any) => void;
  propagateTouch: (_: any) => void;
  numberMapping: any;
  wordsMapping: any;

  constructor() {
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    this.daysMapping = {
      en: {
        default: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
      },
      ne: {
        default: ["आइत", "सोम", "मंगल्", "बुध", "बिही", "शुक्र", "शनि"],
        short: ["आ", "सो", "मं", "बु", "बि", "शु", "श"]
      }
    };
    /** @type {?} */
    this.monthsMapping = {
      en: {
        default: [
          "Baisakh",
          "Jestha",
          "Asadh",
          "Shrawan",
          "Bhadra",
          "Ashwin",
          "Kartik",
          "Mangsir",
          "Poush",
          "Marga",
          "Falgun",
          "Chaitra"
        ],
        modern: [
          "Baisakh",
          "Jeth",
          "Asaar",
          "Saawn",
          "Bhadau",
          "Aashoj",
          "Kartik",
          "Mangsir",
          "Push",
          "Magh",
          "Fagun",
          "Chait"
        ],
        short: [
          "Bai",
          "Jes",
          "Asa",
          "Shr",
          "Bha",
          "Ash",
          "Kar",
          "Man",
          "Pou",
          "Mar",
          "Fal",
          "Cha"
        ]
      },
      ne: {
        default: [
          "बैशाख",
          "जेष्ठ",
          "आषाढ",
          "श्रवण",
          "भाद्र",
          "आश्विन",
          "कार्तिक",
          "मंसिर",
          "पौष",
          "मार्ग",
          "फाल्गुन",
          "चैत्र"
        ],
        modern: [
          "बैशाख",
          "जेठ",
          "असार",
          "साउन",
          "भदौ",
          "अशोज",
          "कार्तिक",
          "मंसिर",
          "पुष",
          "माघ",
          "फागुन",
          "चैत"
        ],
        short: [
          "बै",
          "जे",
          "अ",
          "श्रा",
          "भा",
          "आ",
          "का",
          "मं",
          "पौ",
          "मा",
          "फा",
          "चै"
        ]
      }
    };
    this.nepaliDateToday = { day: 0, month: 0, year: 0 };
    this.currentNepaliDate = { day: 0, month: 0, year: 0 };
    this.formattedDate = "";
    this.currentDate = new Date();
    this.years = [];
    this.isOpen = false;
    this.hideInput = false;
    this.alwaysVisible = false;
    this.language = "en";
    this.monthDisplayType = "default";
    this.dayDisplayType = "default";
    this.dateFormatter = selectedDate => {
      /** @type {?} */
      const dd =
        selectedDate.day < 10 ? "0" + selectedDate.day : selectedDate.day;
      /** @type {?} */
      const mm =
        selectedDate.month < 10 ? "0" + selectedDate.month : selectedDate.month;
      return `${dd}/${mm}/${this.selectedDate.year}`;
    };
    this.propagateChange = _ => {};
    this.propagateTouch = _ => {};
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    /** @type {?} */
    const nepaliDateToday = new NepaliDateConverter(new Date());
    this.nepaliDateToday = {
      year: nepaliDateToday.getYear(),
      month: nepaliDateToday.getMonth(),
      day: nepaliDateToday.getDate()
    };
    this.setCurrentDate();
    this.populateYears();
    this.setCurrentMonthData();
  }
  /**
   * @return {?}
   */
  setCurrentDate() {
    /** @type {?} */
    let currentNepaliDate;
    if (!this.selectedDate) {
      currentNepaliDate = new NepaliDateConverter(this.currentDate);
    } else {
      const { year, month, day } = this.selectedDate;
      currentNepaliDate = new NepaliDateConverter(year, month, day);
      this.currentDate = currentNepaliDate.getEnglishDate();
    }
    this.currentNepaliDate = {
      year: currentNepaliDate.getYear(),
      month: currentNepaliDate.getMonth(),
      day: currentNepaliDate.getDate()
    };
  }
  /**
   * @return {?}
   */
  populateYears() {
    for (let i = 2001; i <= 2088; i++) {
      this.years.push(i);
    }
  }
  /**
   * @return {?}
   */
  resetCurrentMonthData() {
    this.currentMonthData = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: []
    };
  }
  /**
   * @return {?}
   */
  formatValue() {
    if (this.selectedDate) {
      this.formattedDate = this.dateFormatter(this.selectedDate);
    }
  }
  /**
   * @param {?} value
   * @return {?}
   */
  writeValue(value) {
    if (value) {
      this.selectedDate = value;
      this.formatValue();
    }
  }
  /**
   * @return {?}
   */
  registerOnTouched() {}
  /**
   * @param {?} fn
   * @return {?}
   */
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  /**
   * @return {?}
   */
  setCurrentMonthData() {
    this.resetCurrentMonthData();
    // fill the currentMonthData with current date
    /** @type {?} */
    const day = this.currentDate.getDay();
    this.currentMonthData[day] = [this.currentNepaliDate.day];
    // fill the currentMonthData with day before the current date
    this.setMonthDataBefore(day - 1, this.currentNepaliDate.day - 1);
    // fill the currentMonthData with day after the current date
    this.setMonthDataAfter(day + 1, this.currentNepaliDate.day + 1);
    // we need some empty spaces in place so that the dates are shown in correct order
    // eg if the 1st day starts on monday then we need 1 empty space for non existingn date on Sunday
    this.createEmptySpaces();
  }
  /**
   * @param {?} day
   * @param {?} date
   * @return {?}
   */
  setMonthDataBefore(day, date) {
    if (date >= 1) {
      if (day < 0) {
        day = 6;
      }
      this.currentMonthData[day] = [date, ...this.currentMonthData[day]];
      this.setMonthDataBefore(--day, --date);
    }
  }
  /**
   * @param {?} day
   * @param {?} date
   * @return {?}
   */
  setMonthDataAfter(day, date) {
    /** @type {?} */
    const nepaliDate = new NepaliDateConverter(
      this.currentNepaliDate.year,
      this.currentNepaliDate.month,
      date
    );
    //  only add the data if the current month matches
    if (nepaliDate.getMonth() === this.currentNepaliDate.month) {
      if (day > 6) {
        day = 0;
      }
      this.currentMonthData[day] = [...this.currentMonthData[day], date];
      this.setMonthDataAfter(++day, ++date);
    }
  }
  /**
   * @return {?}
   */
  createEmptySpaces() {
    // first find out which day has the 1st
    //  if its a Sunday, then don't do anything else add 1 space on each previous day
    /** @type {?} */
    let dayIndex = 0;
    Object.values(this.currentMonthData).find((value, index) => {
      if (value.includes(1)) {
        dayIndex = index;
      }
      return value.includes(1);
    });
    if (dayIndex) {
      for (dayIndex; dayIndex > 0; dayIndex--) {
        /** @type {?} */
        const monthData = this.currentMonthData[dayIndex - 1];
        this.currentMonthData[dayIndex - 1] = [null, ...monthData];
      }
    }
  }
  /**
   * @param {?} day
   * @return {?}
   */
  selectDate(day) {
    this.selectedDate = Object.assign({}, this.currentNepaliDate, { day });
    this.formatValue();
    this.close();
    this.propagateChange(this.selectedDate);
  }
  /**
   * @param {?} year
   * @return {?}
   */
  selectYear(year) {
    this.currentNepaliDate.year = +year;
    /** @type {?} */
    const newDate = new NepaliDateConverter(
      this.currentNepaliDate.year,
      this.currentNepaliDate.month,
      this.currentNepaliDate.day
    );
    this.currentDate = newDate.getEnglishDate();
    this.setCurrentMonthData();
  }
  /**
   * @param {?} month
   * @return {?}
   */
  selectMonth(month) {
    this.currentNepaliDate.month = this.monthsMapping[this.language][
      this.monthDisplayType
    ].indexOf(month);
    /** @type {?} */
    const newDate = new NepaliDateConverter(
      this.currentNepaliDate.year,
      this.currentNepaliDate.month,
      this.currentNepaliDate.day
    );
    this.currentDate = newDate.getEnglishDate();
    this.setCurrentMonthData();
  }
  /**
   * @return {?}
   */
  toggleOpen() {
    if (!this.alwaysVisible) {
      this.isOpen = !this.isOpen;
    }
  }
  /**
   * @return {?}
   */
  open() {
    const monthArray = this.monthsMapping[this.language][this.monthDisplayType];
    if (this.selectedDate) {
      const month = monthArray[this.selectedDate.month];
      this.selectYear(this.selectedDate.year);
      this.selectMonth(month);
      this.selectDate(this.selectedDate.day);
    }

    this.isOpen = true;
  }
  /**
   * @return {?}
   */
  close() {
    this.isOpen = false;
    this.setCurrentDate();
  }
}

@Pipe({
  name: "toNp"
})
export class ToNpPipe {
  /**
   * @param {?} value
   * @param {?=} language
   * @param {?=} type
   * @return {?}
   */
  transform(value, language = "ne", type = "number") {
    /** @type {?} */
    const numberMapping = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    /** @type {?} */
    const wordsMapping = {
      year: "साल",
      month: "महिना"
    };
    if (value) {
      if (language === "ne") {
        switch (type) {
          case "number":
            /** @type {?} */
            const split = value.toString().split("");
            return split
              .map(n => {
                if (n === " ") {
                  return " ";
                }
                return numberMapping[+n] ? numberMapping[+n] : n;
              })
              .join("");
          case "word":
            return wordsMapping[value.toString().toLowerCase()];
          default:
        }
      }
      return value;
    }
    return "";
  }
}
