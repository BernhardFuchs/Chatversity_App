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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXRvLXRvcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL3Njcm9sbC10by10b3AuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNEO0FBS3REO0lBRUUsOEJBQVksRUFBYztRQUN4QixFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDO1FBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBTFcsb0JBQW9CO1FBSGhDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsa0JBQWtCO1NBQzdCLENBQUM7eUNBR2dCLGlCQUFVO09BRmYsb0JBQW9CLENBT2hDO0lBQUQsMkJBQUM7Q0FBQSxBQVBELElBT0M7QUFQWSxvREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2FwcFNjcm9sbFRvVG9wXSdcbn0pXG5leHBvcnQgY2xhc3MgU2Nyb2xsVG9Ub3BEaXJlY3RpdmUge1xuXG4gIGNvbnN0cnVjdG9yKGVsOiBFbGVtZW50UmVmKSB7XG4gICAgZWwubmF0aXZlRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAneWVsbG93JztcbiAgICBjb25zb2xlLmxvZyhlbC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCk7XG4gfVxuXG59XG4iXX0=