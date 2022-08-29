import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
// import { SUPPORTED_LANGS } from "@config/translate";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { LanguageSwitcherService } from "./services/language-switcher.service";

@Component({
  selector: "simpliflysaas-language-switcher",
  templateUrl: "./language-switcher.component.html",
  styleUrls: ["./language-switcher.component.scss"]
})
export class LanguageSwitcherComponent implements OnInit {
  selectedLanguage: string;

  constructor(
    public translate: TranslateService,
    private localStorageService: LocalStorageService,
    private languageSwitcherService: LanguageSwitcherService
  ) {
    // translate.addLangs(SUPPORTED_LANGS);
  }

  ngOnInit() {
    this.selectedLanguage = this.localStorageService.getLocalStorageItem(
      "language"
    );
    if (this.selectedLanguage) {
      this.languageSwitcherService.setLanguage(this.selectedLanguage);
      this.translate.use(this.selectedLanguage);
    } else {
      // this.languageSwitcherService.setLanguage(SUPPORTED_LANGS[0]);
      // this.translate.use(SUPPORTED_LANGS[0]);
      // this.selectedLanguage = SUPPORTED_LANGS[0];
    }
  }

  useLanguage(event): void {
    this.translate.use(event.target.value);
    this.languageSwitcherService.setLanguage(event.target.value);
  }
}
