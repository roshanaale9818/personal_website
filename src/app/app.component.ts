import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationStart, Event as NavigationEvent, Router } from "@angular/router";
import { DEFAULT_INTERRUPTSOURCES, Idle } from "@ng-idle/core";
import { Keepalive } from "@ng-idle/keepalive";
import { CookieService } from "ngx-cookie-service";
import { Observable, Subject, timer } from "rxjs";
import { GlobalService } from "./shared/services/global/global.service";
// import { ToastrMessageService } from "./shared/services/toastr-message/toastr-message.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  title = "Flexyear";
  timeoutId;
  userInactive: Subject<any> = new Subject();

  displayTimer$: Observable<number>;

  //For ng2 idel
  idleState = "Not started.";
  timedOut = false;
  lastPing?: Date = null;
  constructor(
    private globalService: GlobalService,
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private actRoute:ActivatedRoute,
    private cookieService:CookieService
  ) {
    let currentLocation = "";
    this.router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationStart) {
            // console.log(event.url);
            currentLocation = event.url;
          }
        });

    // console.log("uyrl", this.router)
    // console.log("this is router", this.router.url);
    // this.activatedRoute.url.subscribe((res)=>{
    //   console.log("RESS",res);
    // })
    //For ng2 idel

    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(5);

    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(895);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => (this.idleState = "No longer idle."));
    idle.onTimeout.subscribe(() => {
      // console.log("this is currentlocation",currentLocation)
      if (currentLocation !== '/login') {
        this.idleState = "Timed out!";
        this.timedOut = true;
        this.globalService.logout();
        // console.log("routinh")
        window.location.reload();
      }
    });
    idle.onIdleStart.subscribe(() => (this.idleState = "You've gone idle!"));
    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = "You will time out in " + countdown + " seconds!";
      if (countdown == 0) {
        this.globalService.logout();
      }
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(5);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.reset();
  }
  params
  saveParamsToCookie(){
    this.actRoute.queryParams
      .subscribe(params => {
        // console.log(params); // { orderby: "date" }
        try{
          // this.orderby = params.d;
          this.cookieService.set("subdomain",params.d);
        }
        catch(e){
          // console.log(e);
        }
         // price
      }
    );
  }

  reset() {
    this.idle.watch();
    this.idleState = "Started.";
    this.timedOut = false;
  }

  ngOnInit() { }
}
