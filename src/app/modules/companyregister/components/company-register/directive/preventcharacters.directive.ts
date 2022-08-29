
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
    selector: '[appInputRestriction]'
})
export class InputRestrictionDirective {
    inputElement: ElementRef;

    @Input('appInputRestriction') appInputRestriction: string;
    arabicRegex = '[\u0600-\u06FF]';

    constructor(el: ElementRef) {
        this.inputElement = el;
    }

    @HostListener('keypress', ['$event']) onKeyPress(event) {

        if (this.appInputRestriction === 'integer') {
            this.integerOnly(event);
        } else if (this.appInputRestriction === 'noSpecialChars') {
            this.noSpecialChars(event);
        }
        else if (
          this.appInputRestriction == "allowSpaceWithNoSpecialchars"
        ){
          this.noSpecialCharsWithSpace(event);
        }
        else if (this.appInputRestriction =="noNegative"){
          this.noNegative(event);
        }
        else if (
          this.appInputRestriction =='noDots'
        ){

          this.noDotsCharacters(event);
        }
    }

    integerOnly(event) {
        const e = <KeyboardEvent>event;
        if (e.key === 'Tab' || e.key === 'TAB') {
            return;
        }
        if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode === 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode === 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+V
            (e.keyCode === 86 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode === 88 && e.ctrlKey === true)) {
            // let it happen, don't do anything
            return;
        }
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1) {
            e.preventDefault();
        }
    }

    noSpecialChars(event) {
      // console.log("e",event);
        const e = <KeyboardEvent>event;
        if (e.key === 'Tab' || e.key === 'TAB') {
            return;
        }
        let k;
        // console.log("keycode",event.keyCode)
        k = event.keyCode;
        // if(k == 32){
        //   return;
        // }
        if(k == 45){
          return;
        } // k = event.charCode;  (Both can be used)
        // || k === 32
        if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || (k >= 48 && k <= 57)) {
          console.log("returned")
            return;
        }
        if(k == 32){
          e.preventDefault();
          return;
        }
        const ch = String.fromCharCode(e.keyCode);
        const regEx = new RegExp(this.arabicRegex);
        if (regEx.test(ch)) {
            return;
        }
        e.preventDefault();
    }
    noSpecialCharsWithSpace(event) {
      const e = <KeyboardEvent>event;
      console.log("hello e",e)
      // console.log(e)
      // return;
      // if(e.key == 190){

      // }
      if (e.key === 'Tab' || e.key === 'TAB') {
          return;
      }
      let k;
      // console.log("keycode",event.keyCode)
      k = event.keyCode;

      if(k == 45 || k == 95){
        return;
      }
      //. allowed
      if(k == 46){
        return;
      }
       // k = event.charCode;  (Both can be used)
      // || k === 32
      if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || (k >= 48 && k <= 57)) {
        // console.log("returned")
          return;
      }
      if(k == 32){
        // e.preventDefault();
        return;
      }
      const ch = String.fromCharCode(e.keyCode);
      const regEx = new RegExp(this.arabicRegex);
      if (regEx.test(ch)) {
          return;
      }
      e.preventDefault();
  }
    noDotsCharacters(event){
      const e = <KeyboardEvent>event;

      if (['.'].includes(e.key)) {
        // console.log("e.key",e.key)
        e.preventDefault();
    }
    }
    noNegative(event){
      const e = <KeyboardEvent>event;

      if (['-'].includes(e.key)) {
        // console.log("e.key",e.key)
        e.preventDefault();
    }
    }

    @HostListener('paste', ['$event']) onPaste(event) {
        let regex;
        if (this.appInputRestriction === 'integer') {
            regex = /[0-9]/g;
        } else if (this.appInputRestriction === 'noSpecialChars') {
            regex = /[a-zA-Z0-9\u0600-\u06FF]/g;
        }
        const e = <ClipboardEvent>event;
        const pasteData = e.clipboardData.getData('text/plain');
        let m;
        let matches = 0;
        while ((m = regex.exec(pasteData)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                matches++;
            });
        }
        if (matches === pasteData.length) {
            return;
        } else {
            e.preventDefault();
        }
    }

}
