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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2FwcC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpQkFBaUI7O0FBRWpCOzs7NERBRzREO0FBRzVELHNDQUEyQztBQUszQztJQUFBO0lBQThCLENBQUM7SUFBbEIsZUFBZTtRQUQzQixpQkFBVSxFQUFFO09BQ0EsZUFBZSxDQUFHO0lBQUQsc0JBQUM7Q0FBQSxBQUEvQixJQUErQjtBQUFsQiwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbIi8vIGFwcC5zZXJ2aWNlLnRzXG5cbi8qIFdoZW5ldmVyIGEgdXNlciBhdHRlbXB0cyB0byBhY2Nlc3MgYSByb3V0ZSB0aGF0XG5pcyBwcm90ZWN0ZWQgYnkgT2t0YUF1dGhHdWFyZCwgaXQgZmlyc3QgY2hlY2tzIHRvXG5zZWUgaWYgdGhlIHVzZXIgaGFzIGJlZW4gYXV0aGVudGljYXRlZC5cbklmIGlzQXV0aGVudGljYXRlZCgpIHJldHVybnMgZmFsc2UsIHN0YXJ0IHRoZSBsb2dpbiBmbG93LiAqL1xuXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgKiBhcyBPa3RhQXV0aCBmcm9tICdAb2t0YS9va3RhLWFuZ3VsYXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgT2t0YUF1dGhTZXJ2aWNlIHt9XG4iXX0=