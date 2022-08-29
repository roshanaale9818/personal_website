import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
@Injectable({
  providedIn: "root",
})
export class HelperService {
  startCount: number;
  page: number;
  limit: number;
  formSubmitted: boolean;
  constructor() {}

  setFormSubmitted() {
    this.formSubmitted = true;
  }

  getFormSubmitted() {
    return this.formSubmitted;
  }

  /**
   * This method is to return the full name of the user
   */
  getFullName(person: any) {
    if (person.middle_name) {
      const fullName =
        person.first_name + " " + person.middle_name + " " + person.last_name;
      return fullName;
    } else {
      const fullName = person.first_name + " " + person.last_name;
      return fullName;
    }
  }

  getStaffFullName(staff: any) {
    let fullName;
    if (staff.middle_name) {
      fullName =
        staff.last_name + " " + staff.middle_name + " " + staff.first_name;
    } else {
      fullName = staff.last_name + " " + staff.first_name;
    }

    if (staff.emp_id) {
      return staff.emp_id + " - " + " " + fullName;
    } else {
      return fullName;
    }
  }

  /**
   * replace hyphen by space
   * @param value
   */
  replaceHyphenWithSpace(value) {
    let i = 0;
    while (value.includes("-")) {
      value = value.replace("-", " ");
    }
    return value;
  }

  // method to show pagination start and end count
  getStartCount(currentPage, page, limit) {
    const startCount = (currentPage ? page : 1) * limit - (limit - 1);
    this.startCount = startCount;
    this.page = page;
    this.limit = limit;
    return startCount;
  }
  getEndCount(holidayCount) {
    const endCount = Math.min(this.startCount + this.limit - 1, holidayCount);
    return endCount;
  }

  kendoSort(event, sort, sortno, sortnane) {
    if (event.sort[0]) {
      sort = event.sort;
      if (event.sort[0].dir === "asc") {
        sortno = 2;
      } else {
        sortno = 1;
      }
      sortnane = event.sort[0].field;
    }
  }
}
