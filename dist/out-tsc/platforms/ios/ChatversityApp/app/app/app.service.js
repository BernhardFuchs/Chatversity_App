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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC9hcHAvYXBwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlCQUFpQjs7QUFFakI7Ozs0REFHNEQ7QUFHNUQsc0NBQTJDO0FBSzNDO0lBQUE7SUFBOEIsQ0FBQztJQUFsQixlQUFlO1FBRDNCLGlCQUFVLEVBQUU7T0FDQSxlQUFlLENBQUc7SUFBRCxzQkFBQztDQUFBLEFBQS9CLElBQStCO0FBQWxCLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYXBwLnNlcnZpY2UudHNcblxuLyogV2hlbmV2ZXIgYSB1c2VyIGF0dGVtcHRzIHRvIGFjY2VzcyBhIHJvdXRlIHRoYXRcbmlzIHByb3RlY3RlZCBieSBPa3RhQXV0aEd1YXJkLCBpdCBmaXJzdCBjaGVja3MgdG9cbnNlZSBpZiB0aGUgdXNlciBoYXMgYmVlbiBhdXRoZW50aWNhdGVkLlxuSWYgaXNBdXRoZW50aWNhdGVkKCkgcmV0dXJucyBmYWxzZSwgc3RhcnQgdGhlIGxvZ2luIGZsb3cuICovXG5cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCAqIGFzIE9rdGFBdXRoIGZyb20gJ0Bva3RhL29rdGEtYW5ndWxhcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBPa3RhQXV0aFNlcnZpY2Uge31cbiJdfQ==