"use strict";
// app.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
/* Whenever a user attempts to access a route that
is protected by OktaAuthGuard, it first checks to
see if the user has been authenticated.
If isAuthenticated() returns false, start the login flow. */
var core_1 = require("@angular/core");
var OktaAuthService = /** @class */ (function () {
    function OktaAuthService() {
    }
    OktaAuthService = __decorate([
        core_1.Injectable()
    ], OktaAuthService);
    return OktaAuthService;
}());
exports.OktaAuthService = OktaAuthService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL2FwcC9hcHAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUJBQWlCOztBQUVqQjs7OzREQUc0RDtBQUc1RCxzQ0FBMkM7QUFLM0M7SUFBQTtJQUE4QixDQUFDO0lBQWxCLGVBQWU7UUFEM0IsaUJBQVUsRUFBRTtPQUNBLGVBQWUsQ0FBRztJQUFELHNCQUFDO0NBQUEsQUFBL0IsSUFBK0I7QUFBbEIsMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBhcHAuc2VydmljZS50c1xuXG4vKiBXaGVuZXZlciBhIHVzZXIgYXR0ZW1wdHMgdG8gYWNjZXNzIGEgcm91dGUgdGhhdFxuaXMgcHJvdGVjdGVkIGJ5IE9rdGFBdXRoR3VhcmQsIGl0IGZpcnN0IGNoZWNrcyB0b1xuc2VlIGlmIHRoZSB1c2VyIGhhcyBiZWVuIGF1dGhlbnRpY2F0ZWQuXG5JZiBpc0F1dGhlbnRpY2F0ZWQoKSByZXR1cm5zIGZhbHNlLCBzdGFydCB0aGUgbG9naW4gZmxvdy4gKi9cblxuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0ICogYXMgT2t0YUF1dGggZnJvbSAnQG9rdGEvb2t0YS1hbmd1bGFyJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE9rdGFBdXRoU2VydmljZSB7fVxuIl19