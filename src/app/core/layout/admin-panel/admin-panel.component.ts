import { FormGroup, FormBuilder } from "@angular/forms";
import { Location } from "@angular/common";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
// import { LayoutService } from "./../services/layout.service";
import { FooterComponent } from "./footer/footer.component";
import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Subscription } from "rxjs";
import { BreadcrumbsService } from "ng6-breadcrumbs";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";
import { GlobalService } from "@app/shared/services/global/global.service";

@Component({
  selector: "app-admin-panel",
  templateUrl: "./admin-panel.component.html",
  styleUrls: ["./admin-panel.component.scss"],
})
export class AdminPanelComponent implements OnInit, AfterViewChecked {
  entryComponent = FooterComponent;
  titleHeading: any;
  titleDescription: any;
  subscription: Subscription;
  @ViewChild("scrollMe", { static: false })
  private myScrollContainer: ElementRef;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private activatedRoute: ActivatedRoute,
    // private layoutService: LayoutService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private breadcrumbsService: BreadcrumbsService,
    private location: Location,
    private authService: AuthService,
    private globalService:GlobalService
  ) {
    // this.subscription = this.layoutService
    //   .getContentTitle()
    //   .subscribe((title) => {
    //     if (title) {
    //       this.titleHeading = title;
    //     } else {
    //       this.titleHeading = "";
    //     }
    //   });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let child = this.activatedRoute.firstChild;
        this.titleHeading = child.snapshot.data.breadcrumb;
        this.titleDescription = child.snapshot.data.tittleInformation;
        // scrolling to top when nav is changed
        window.scrollTo(0,0)
      }
    });
    this.globalService.getCompanyName.subscribe((data)=>{
      if(data){
        this.companyName = data;
      }
    })
  }
companyName;
  ngOnInit() {
    this.buildChatForm();
    this.scrollToBottom();

    // console.log(this.breadcrumbsService.get().subscribe());
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  chatForm: FormGroup;
  buildChatForm() {
    this.chatForm = this.fb.group({
      chat_message: [""],
    });
  }
  logout(): void {
    console.log("LogOut");
    this.cookieService.deleteAll();
    console.log(" Cookies" + JSON.stringify(this.cookieService.getAll()));

    this.localStorageService.clearLocalStorage();
    // make the current user null
    this.authService.currentUserRoleSubject.next(null);
    // this.router.navigate(["/login"]);
    this.globalService.logout();
  }
  chatOpened: boolean;
  openChatPopup() {
    this.chatOpened = true;
  }
  closeChatPopup() {
    this.chatOpened = false;
  }

  allMessage = [
    { user_name: "bentray", message: "hello" },
    { user_name: "user", message: "how are you" },
  ];

  quickMessages = [
    { message: "hello" },
    { message: "how are you?" },
    { message: "how can i help you?" },
    { message: "what's up" },
  ];

  sendQuickmessage(msg) {
    console.log(msg);
    this.allMessage.push({ user_name: "user", message: msg.message });
  }
  OnMessageSend() {
    console.log(this.chatForm.value.chat_message);
    if (this.chatForm.pristine) return;
    if (this.chatForm.value == " ") return;
    this.allMessage.push({
      user_name: "user",
      message: this.chatForm.value.chat_message,
    });
    this.chatForm.reset();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  goBack(): void {
    this.location.back();
  }
  convertedDateInBs
}
