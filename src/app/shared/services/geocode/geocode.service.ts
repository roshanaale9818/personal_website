// import { GoogleMapLocation } from "./googleMapLocation";
// import { GoogleMapLocation } from './../../../modules/client/models/map-location';

import { Injectable } from "@angular/core";
import { MapsAPILoader } from "@agm/core";
import { Observable, from, of, Subject } from "rxjs";
import { filter, catchError, tap, map, switchMap } from "rxjs/operators";

declare var google: any;

@Injectable()
export class GeocodeService {
  private geocoder: any;

  constructor(private mapLoader: MapsAPILoader) {}

  private initGeocoder() {
    console.log("Init geocoder!");
    this.geocoder = new google.maps.Geocoder();
  }

  private waitForMapsToLoad(): Observable<boolean> {
    if (!this.geocoder) {
      return from(this.mapLoader.load()).pipe(
        tap(() => this.initGeocoder()),
        map(() => true)
      );
    }
    return of(true);
  }

  // geocodeAddress(location: string): Observable<GoogleMapLocation> {
  //   console.log("Start geocoding!");
  //   return this.waitForMapsToLoad().pipe(
  //     // filter(loaded => loaded),
  //     switchMap(() => {
  //       return new Observable(observer => {
  //         this.geocoder.geocode({ address: location }, (results, status) => {
  //           if (status == google.maps.GeocoderStatus.OK) {
  //             console.log("Geocoding complete!");
  //             observer.next({
  //               lat: results[0].geometry.location.lat(),
  //               lng: results[0].geometry.location.lng()
  //             });
  //           } else {
  //             console.log("Error - ", results, " & Status - ", status);
  //             observer.next({ lat: 0, lng: 0 });
  //           }
  //           observer.complete();
  //         });
  //       });
  //     })
  //   );
  // }
}
