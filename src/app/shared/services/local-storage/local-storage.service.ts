import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  constructor() {}

  setLocalStorageItem(key: string, value: string | boolean) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorageItem(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  removeLocalStorageItem(key: string) {
    localStorage.removeItem(key);
  }

  clearLocalStorage() {
    localStorage.clear();
  }
}
