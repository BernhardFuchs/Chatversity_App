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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXRvLXRvcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL2FwcC9zY3JvbGwtdG8tdG9wLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzRDtBQUt0RDtJQUVFLDhCQUFZLEVBQWM7UUFDeEIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQztRQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUxXLG9CQUFvQjtRQUhoQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGtCQUFrQjtTQUM3QixDQUFDO3lDQUdnQixpQkFBVTtPQUZmLG9CQUFvQixDQU9oQztJQUFELDJCQUFDO0NBQUEsQUFQRCxJQU9DO0FBUFksb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thcHBTY3JvbGxUb1RvcF0nXG59KVxuZXhwb3J0IGNsYXNzIFNjcm9sbFRvVG9wRGlyZWN0aXZlIHtcblxuICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZikge1xuICAgIGVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3llbGxvdyc7XG4gICAgY29uc29sZS5sb2coZWwubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQpO1xuIH1cblxufVxuIl19