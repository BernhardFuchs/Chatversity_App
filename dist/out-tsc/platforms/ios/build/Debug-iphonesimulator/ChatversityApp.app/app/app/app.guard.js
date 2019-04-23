"use strict";
// app.guard.ts
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var okta_angular_1 = require("@okta/okta-angular");
var OktaAuthGuard = /** @class */ (function () {
    function OktaAuthGuard(okta, router) {
        this.okta = okta;
        this.router = router;
        this.authenticated = okta.isAuthenticated();
        this.oktaAuth = okta;
    }
    OktaAuthGuard.prototype.canActivate = function (route, state) {
        if (this.authenticated) {
            return true;
        }
        // Redirect to login flow.
        this.oktaAuth.login();
        return false;
    };
    OktaAuthGuard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [okta_angular_1.OktaAuthService, router_1.Router])
    ], OktaAuthGuard);
    return OktaAuthGuard;
}());
exports.OktaAuthGuard = OktaAuthGuard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmd1YXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC9hcHAvYXBwLmd1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxlQUFlOztBQUVmLHNDQUEyQztBQUMzQywwQ0FBbUc7QUFDbkcsbURBQXFEO0FBR3JEO0lBR0UsdUJBQW9CLElBQXFCLEVBQVUsTUFBYztRQUE3QyxTQUFJLEdBQUosSUFBSSxDQUFpQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDL0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUVELG1DQUFXLEdBQVgsVUFBWSxLQUE2QixFQUFFLEtBQTBCO1FBQ25FLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDO1NBQUU7UUFFeEMsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdEIsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBZFUsYUFBYTtRQUR6QixpQkFBVSxFQUFFO3lDQUllLDhCQUFlLEVBQWtCLGVBQU07T0FIdEQsYUFBYSxDQWV6QjtJQUFELG9CQUFDO0NBQUEsQUFmRCxJQWVDO0FBZlksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBhcHAuZ3VhcmQudHNcblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyLCBDYW5BY3RpdmF0ZSwgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgUm91dGVyU3RhdGVTbmFwc2hvdCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBPa3RhQXV0aFNlcnZpY2UgfSBmcm9tICdAb2t0YS9va3RhLWFuZ3VsYXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgT2t0YUF1dGhHdWFyZCBpbXBsZW1lbnRzIENhbkFjdGl2YXRlIHtcbiAgb2t0YUF1dGg7XG4gIGF1dGhlbnRpY2F0ZWQ7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgb2t0YTogT2t0YUF1dGhTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyKSB7XG4gICAgdGhpcy5hdXRoZW50aWNhdGVkID0gb2t0YS5pc0F1dGhlbnRpY2F0ZWQoKTtcbiAgICB0aGlzLm9rdGFBdXRoID0gb2t0YTtcbiAgfVxuXG4gIGNhbkFjdGl2YXRlKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCkge1xuICAgIGlmICh0aGlzLmF1dGhlbnRpY2F0ZWQpIHsgcmV0dXJuIHRydWU7IH1cblxuICAgIC8vIFJlZGlyZWN0IHRvIGxvZ2luIGZsb3cuXG4gICAgdGhpcy5va3RhQXV0aC5sb2dpbigpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19