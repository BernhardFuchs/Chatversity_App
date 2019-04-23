"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var auth_service_1 = require("../_services/auth.service");
var AuthGuard = /** @class */ (function () {
    function AuthGuard(router, authService) {
        this.router = router;
        this.authService = authService;
    }
    AuthGuard.prototype.canActivate = function (next, state) {
        if (this.authService.userLoggedIn()) {
            // User authorized so return true
            console.log('USER AUTHORIZED');
            return true;
        }
        // User not authorized so redirect to login page via UrlTree
        console.log('USER NOT AUTHORIZED');
        var url = '/login';
        var tree = this.router.parseUrl(url);
        return tree;
    };
    AuthGuard = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [router_1.Router,
            auth_service_1.AuthService])
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvQ29yZS9fZ3VhcmRzL2F1dGguZ3VhcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0MsMENBQTRHO0FBRTVHLDBEQUF3RDtBQU14RDtJQUNFLG1CQUNVLE1BQWMsRUFDZCxXQUF3QjtRQUR4QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsZ0JBQVcsR0FBWCxXQUFXLENBQWE7SUFDL0IsQ0FBQztJQUVKLCtCQUFXLEdBQVgsVUFDRSxJQUE0QixFQUM1QixLQUEwQjtRQUV4QixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLEVBQUU7WUFDbkMsaUNBQWlDO1lBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtZQUM5QixPQUFPLElBQUksQ0FBQTtTQUNaO1FBRUQsNERBQTREO1FBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQTtRQUNsQyxJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUE7UUFDcEIsSUFBTSxJQUFJLEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDL0MsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBckJRLFNBQVM7UUFKckIsaUJBQVUsQ0FBQztZQUNWLFVBQVUsRUFBRSxNQUFNO1NBQ25CLENBQUM7eUNBSWtCLGVBQU07WUFDRCwwQkFBVztPQUh2QixTQUFTLENBc0JyQjtJQUFELGdCQUFDO0NBQUEsQUF0QkQsSUFzQkM7QUF0QlksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYW5BY3RpdmF0ZSwgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgUm91dGVyU3RhdGVTbmFwc2hvdCwgVXJsVHJlZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuXG5leHBvcnQgY2xhc3MgQXV0aEd1YXJkIGltcGxlbWVudHMgQ2FuQWN0aXZhdGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlXG4gICkge31cblxuICBjYW5BY3RpdmF0ZShcbiAgICBuZXh0OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LFxuICAgIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KTogT2JzZXJ2YWJsZTxib29sZWFuIHwgVXJsVHJlZT4gfCBQcm9taXNlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IGJvb2xlYW4gfCBVcmxUcmVlIHtcblxuICAgICAgaWYgKHRoaXMuYXV0aFNlcnZpY2UudXNlckxvZ2dlZEluKCkpIHtcbiAgICAgICAgLy8gVXNlciBhdXRob3JpemVkIHNvIHJldHVybiB0cnVlXG4gICAgICAgIGNvbnNvbGUubG9nKCdVU0VSIEFVVEhPUklaRUQnKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuXG4gICAgICAvLyBVc2VyIG5vdCBhdXRob3JpemVkIHNvIHJlZGlyZWN0IHRvIGxvZ2luIHBhZ2UgdmlhIFVybFRyZWVcbiAgICAgIGNvbnNvbGUubG9nKCdVU0VSIE5PVCBBVVRIT1JJWkVEJylcbiAgICAgIGNvbnN0IHVybCA9ICcvbG9naW4nXG4gICAgICBjb25zdCB0cmVlOiBVcmxUcmVlID0gdGhpcy5yb3V0ZXIucGFyc2VVcmwodXJsKVxuICAgICAgcmV0dXJuIHRyZWVcbiAgICB9XG59XG4iXX0=