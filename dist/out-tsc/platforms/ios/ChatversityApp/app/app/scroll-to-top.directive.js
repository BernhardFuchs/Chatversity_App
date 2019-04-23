"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ScrollToTopDirective = /** @class */ (function () {
    function ScrollToTopDirective(el) {
        el.nativeElement.style.backgroundColor = 'yellow';
        console.log(el.nativeElement.offsetHeight);
    }
    ScrollToTopDirective = __decorate([
        core_1.Directive({
            selector: '[appScrollToTop]'
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], ScrollToTopDirective);
    return ScrollToTopDirective;
}());
exports.ScrollToTopDirective = ScrollToTopDirective;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXRvLXRvcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC9hcHAvc2Nyb2xsLXRvLXRvcC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0Q7QUFLdEQ7SUFFRSw4QkFBWSxFQUFjO1FBQ3hCLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUM7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFMVyxvQkFBb0I7UUFIaEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxrQkFBa0I7U0FDN0IsQ0FBQzt5Q0FHZ0IsaUJBQVU7T0FGZixvQkFBb0IsQ0FPaEM7SUFBRCwyQkFBQztDQUFBLEFBUEQsSUFPQztBQVBZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYXBwU2Nyb2xsVG9Ub3BdJ1xufSlcbmV4cG9ydCBjbGFzcyBTY3JvbGxUb1RvcERpcmVjdGl2ZSB7XG5cbiAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYpIHtcbiAgICBlbC5uYXRpdmVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd5ZWxsb3cnO1xuICAgIGNvbnNvbGUubG9nKGVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0KTtcbiB9XG5cbn1cbiJdfQ==