import {Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/operators';

@Directive({
  selector: '[appSingleClick]'
})
export class SingleClickDirective implements OnInit, OnDestroy {
  private subscription: Subscription;

  @Input()
  throttleMillis = 1500;

  @Output()
  onClick = new EventEmitter();

  @Input()
  enableDisable:boolean = false;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {

    this.subscription = fromEvent(this.elementRef.nativeElement, 'click')
      .pipe(throttleTime(5000))
      .subscribe((v) => {
        if(this.enableDisable == true){
          this.elementRef.nativeElement.disabled = true;
        }
        this.onClick.emit(v);
      });
  }

  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe():null;
   this.onClick ?  this.onClick.unsubscribe():null;
  }

}
