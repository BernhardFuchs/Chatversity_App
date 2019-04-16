import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appScrollToTop]'
})
export class ScrollToTopDirective {

  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundColor = 'yellow';
    console.log(el.nativeElement.offsetHeight);
 }

}
