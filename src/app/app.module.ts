import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { AppComponent } from "./app.component";

import { NgIdleKeepaliveModule } from "@ng-idle/keepalive"; // this includes the core NgIdleModule but includes keepalive providers for easy wireup

import { MomentModule } from "angular2-moment"; // optional, provides moment-style pipes for date formatting
import { CoreModule } from "./core/core.module";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { BsDatepickerModule } from "ngx-bootstrap";

// // ....for google map....
import { AgmCoreModule } from "@agm/core";
import { CookieService } from "ngx-cookie-service";
// kendo grid
import { GridModule } from "@progress/kendo-angular-grid";
// interceptors
import { TokenInterceptor } from "./core/interceptors/token.interceptor";
import { LogoutConfirmationComponent } from "./shared/components/logout-confirmation/logout-confirmation.component";


/**
 * Create custom TranslateLoader since we have a diff dir structure for our json files
 */
export function createTranslateLoader(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MomentModule,
    NgIdleKeepaliveModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCbtx6HD4ZY5BCZUncqj5l86YaojtQPxNw",
    }),
    GridModule,
  ],

  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

    DatePipe,
  ],
  bootstrap: [AppComponent],
  entryComponents: [LogoutConfirmationComponent],
})
export class AppModule {}
