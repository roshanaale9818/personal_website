import { Injectable } from "@angular/core";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { Observable, Subject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class LayoutService {
  private subject = new Subject<any>();
  constructor(private localStorageService: LocalStorageService) {}

  userName: string;
  setUserFullName(fullName: string) {
    this.userName = fullName;
  }

  getUserFullName() {
    return this.userName;
  }
  setContentTitle(title: string) {
    this.subject.next({ text: title });
  }
  getContentTitle() {
    return this.subject.asObservable();
  }
}
