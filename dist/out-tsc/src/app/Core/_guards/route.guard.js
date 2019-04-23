"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var auth_service_1 = require("../_services/auth.service");
var RouteGuard = /** @class */ (function () {
    function RouteGuard(router, authService) {
        this.router = router;
        this.authService = authService;
    }
    RouteGuard.prototype.canActivate = function (next, state) {
        var currentUser = this.authService.currentUser;
        if (!currentUser) {
            // User is not authorized so return true
            return true;
        }
        // User is ogged in so redirect to login page via UrlTree
        var url = '/login';
        var tree = this.router.parseUrl(url);
        return tree;
    };
    RouteGuard = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [router_1.Router,
            auth_service_1.AuthService])
    ], RouteGuard);
    return RouteGuard;
}());
exports.RouteGuard = RouteGuard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuZ3VhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL0NvcmUvX2d1YXJkcy9yb3V0ZS5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQywwQ0FBNEc7QUFFNUcsMERBQXdEO0FBTXhEO0lBQ0Usb0JBQ1UsTUFBYyxFQUNkLFdBQXdCO1FBRHhCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUMvQixDQUFDO0lBRUosZ0NBQVcsR0FBWCxVQUNFLElBQTRCLEVBQzVCLEtBQTBCO1FBQ3hCLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO1FBQy9DLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsd0NBQXdDO1lBQ3hDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCx5REFBeUQ7UUFDekQsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDO1FBQ3JCLElBQU0sSUFBSSxHQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFuQlEsVUFBVTtRQUp0QixpQkFBVSxDQUFDO1lBQ1YsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FBQzt5Q0FJa0IsZUFBTTtZQUNELDBCQUFXO09BSHZCLFVBQVUsQ0FvQnRCO0lBQUQsaUJBQUM7Q0FBQSxBQXBCRCxJQW9CQztBQXBCWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENhbkFjdGl2YXRlLCBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBSb3V0ZXJTdGF0ZVNuYXBzaG90LCBVcmxUcmVlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5cbmV4cG9ydCBjbGFzcyBSb3V0ZUd1YXJkIGltcGxlbWVudHMgQ2FuQWN0aXZhdGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlXG4gICkge31cblxuICBjYW5BY3RpdmF0ZShcbiAgICBuZXh0OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LFxuICAgIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KTogT2JzZXJ2YWJsZTxib29sZWFuIHwgVXJsVHJlZT4gfCBQcm9taXNlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IGJvb2xlYW4gfCBVcmxUcmVlIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRVc2VyID0gdGhpcy5hdXRoU2VydmljZS5jdXJyZW50VXNlcjtcbiAgICAgICAgaWYgKCFjdXJyZW50VXNlcikge1xuICAgICAgICAgIC8vIFVzZXIgaXMgbm90IGF1dGhvcml6ZWQgc28gcmV0dXJuIHRydWVcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVzZXIgaXMgb2dnZWQgaW4gc28gcmVkaXJlY3QgdG8gbG9naW4gcGFnZSB2aWEgVXJsVHJlZVxuICAgICAgICBjb25zdCB1cmwgPSAnL2xvZ2luJztcbiAgICAgICAgY29uc3QgdHJlZTogVXJsVHJlZSA9IHRoaXMucm91dGVyLnBhcnNlVXJsKHVybCk7XG4gICAgICAgIHJldHVybiB0cmVlO1xuICAgIH1cbn1cbiJdfQ==