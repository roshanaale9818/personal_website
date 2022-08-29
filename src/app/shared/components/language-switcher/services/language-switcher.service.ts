import { Injectable } from "@angular/core";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LanguageSwitcherService {
  constructor(private localStorageService: LocalStorageService) {}

  private languageSubject = new Subject<any>();
  private language: string;
  /**
   * Set website language
   * @param lang
   */
  setLanguage(lang): void {
    this.languageSubject.next({ language: lang });
    this.language = lang;
    this.localStorageService.setLocalStorageItem("language", lang);
  }

  /**
   * Get selected language from the nav bar
   */
  getLanguage(): Observable<any> {
    return this.languageSubject.asObservable();
  }

  getSelectedLanguage() {
    if (this.language) return this.language;
    else return this.localStorageService.getLocalStorageItem("language");
  }
}
