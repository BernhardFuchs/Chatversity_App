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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmd1YXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9hcHAuZ3VhcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGVBQWU7O0FBRWYsc0NBQTJDO0FBQzNDLDBDQUFtRztBQUNuRyxtREFBcUQ7QUFHckQ7SUFHRSx1QkFBb0IsSUFBcUIsRUFBVSxNQUFjO1FBQTdDLFNBQUksR0FBSixJQUFJLENBQWlCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUMvRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUN2QixDQUFDO0lBRUQsbUNBQVcsR0FBWCxVQUFZLEtBQTZCLEVBQUUsS0FBMEI7UUFDbkUsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQUUsT0FBTyxJQUFJLENBQUM7U0FBRTtRQUV4QywwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0QixPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFkVSxhQUFhO1FBRHpCLGlCQUFVLEVBQUU7eUNBSWUsOEJBQWUsRUFBa0IsZUFBTTtPQUh0RCxhQUFhLENBZXpCO0lBQUQsb0JBQUM7Q0FBQSxBQWZELElBZUM7QUFmWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbIi8vIGFwcC5ndWFyZC50c1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIsIENhbkFjdGl2YXRlLCBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBSb3V0ZXJTdGF0ZVNuYXBzaG90IH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9rdGFBdXRoU2VydmljZSB9IGZyb20gJ0Bva3RhL29rdGEtYW5ndWxhcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBPa3RhQXV0aEd1YXJkIGltcGxlbWVudHMgQ2FuQWN0aXZhdGUge1xuICBva3RhQXV0aDtcbiAgYXV0aGVudGljYXRlZDtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBva3RhOiBPa3RhQXV0aFNlcnZpY2UsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHtcbiAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBva3RhLmlzQXV0aGVudGljYXRlZCgpO1xuICAgIHRoaXMub2t0YUF1dGggPSBva3RhO1xuICB9XG5cbiAgY2FuQWN0aXZhdGUocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KSB7XG4gICAgaWYgKHRoaXMuYXV0aGVudGljYXRlZCkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gICAgLy8gUmVkaXJlY3QgdG8gbG9naW4gZmxvdy5cbiAgICB0aGlzLm9rdGFBdXRoLmxvZ2luKCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXX0=