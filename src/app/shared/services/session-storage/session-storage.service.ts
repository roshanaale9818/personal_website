import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SessionStorageService {
  constructor() {}

  setSessionStorageItem(key: string, value: string) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSessionStorageItem(key: string) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  clearSessionStorage() {
    sessionStorage.clear();
  }
}
