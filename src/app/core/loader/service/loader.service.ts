import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Loader } from "../model/loader";

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  loaderSubject = new Subject<Loader>();
  loaderState = this.loaderSubject.asObservable();

  constructor() {}

  showLoader() {
    this.loaderSubject.next(<Loader>{ show: true });
  }

  hideLoader() {
    this.loaderSubject.next(<Loader>{ show: false });
  }
}
