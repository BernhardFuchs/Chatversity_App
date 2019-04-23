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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmd1YXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvYXBwL2FwcC5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsZUFBZTs7QUFFZixzQ0FBMkM7QUFDM0MsMENBQW1HO0FBQ25HLG1EQUFxRDtBQUdyRDtJQUdFLHVCQUFvQixJQUFxQixFQUFVLE1BQWM7UUFBN0MsU0FBSSxHQUFKLElBQUksQ0FBaUI7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQy9ELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxtQ0FBVyxHQUFYLFVBQVksS0FBNkIsRUFBRSxLQUEwQjtRQUNuRSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQztTQUFFO1FBRXhDLDBCQUEwQjtRQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQWRVLGFBQWE7UUFEekIsaUJBQVUsRUFBRTt5Q0FJZSw4QkFBZSxFQUFrQixlQUFNO09BSHRELGFBQWEsQ0FlekI7SUFBRCxvQkFBQztDQUFBLEFBZkQsSUFlQztBQWZZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYXBwLmd1YXJkLnRzXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciwgQ2FuQWN0aXZhdGUsIEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIFJvdXRlclN0YXRlU25hcHNob3QgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgT2t0YUF1dGhTZXJ2aWNlIH0gZnJvbSAnQG9rdGEvb2t0YS1hbmd1bGFyJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE9rdGFBdXRoR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSB7XG4gIG9rdGFBdXRoO1xuICBhdXRoZW50aWNhdGVkO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG9rdGE6IE9rdGFBdXRoU2VydmljZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcikge1xuICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IG9rdGEuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgdGhpcy5va3RhQXV0aCA9IG9rdGE7XG4gIH1cblxuICBjYW5BY3RpdmF0ZShyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpIHtcbiAgICBpZiAodGhpcy5hdXRoZW50aWNhdGVkKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICAvLyBSZWRpcmVjdCB0byBsb2dpbiBmbG93LlxuICAgIHRoaXMub2t0YUF1dGgubG9naW4oKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==