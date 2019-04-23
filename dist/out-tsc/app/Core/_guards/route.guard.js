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
        var currentUser = this.authService.userLoggedIn();
        if (currentUser) {
            // User is authorized
            if (state.url === '/login' || state.url === '/signup' || state.url === '/forgot') {
                this.returnUrl = '/home';
                this.tree = this.router.parseUrl(this.returnUrl);
                return this.tree;
            }
            return true;
        }
        return true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuZ3VhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBwL0NvcmUvX2d1YXJkcy9yb3V0ZS5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQywwQ0FBNEc7QUFFNUcsMERBQXdEO0FBTXhEO0lBSUUsb0JBQ1UsTUFBYyxFQUNkLFdBQXdCO1FBRHhCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUMvQixDQUFDO0lBRUosZ0NBQVcsR0FBWCxVQUNFLElBQTRCLEVBQzVCLEtBQTBCO1FBQ3hCLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFbEQsSUFBSSxXQUFXLEVBQUU7WUFDZixxQkFBcUI7WUFDckIsSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLFNBQVMsRUFBRTtnQkFDaEYsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUE7Z0JBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2dCQUNoRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUE7YUFDaEI7WUFDRixPQUFPLElBQUksQ0FBQTtTQUNaO1FBQ0QsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBeEJNLFVBQVU7UUFKdEIsaUJBQVUsQ0FBQztZQUNWLFVBQVUsRUFBRSxNQUFNO1NBQ25CLENBQUM7eUNBT2tCLGVBQU07WUFDRCwwQkFBVztPQU52QixVQUFVLENBeUJ0QjtJQUFELGlCQUFDO0NBQUEsQUF6QkQsSUF5QkM7QUF6QlksZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYW5BY3RpdmF0ZSwgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgUm91dGVyU3RhdGVTbmFwc2hvdCwgVXJsVHJlZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuXG5leHBvcnQgY2xhc3MgUm91dGVHdWFyZCBpbXBsZW1lbnRzIENhbkFjdGl2YXRlIHtcbiAgcmV0dXJuVXJsOiBzdHJpbmc7XG4gIHRyZWU6IFVybFRyZWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZVxuICApIHt9XG5cbiAgY2FuQWN0aXZhdGUoXG4gICAgbmV4dDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCxcbiAgICBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IE9ic2VydmFibGU8Ym9vbGVhbiB8IFVybFRyZWU+IHwgUHJvbWlzZTxib29sZWFuIHwgVXJsVHJlZT4gfCBib29sZWFuIHwgVXJsVHJlZSB7XG4gICAgICBjb25zdCBjdXJyZW50VXNlciA9IHRoaXMuYXV0aFNlcnZpY2UudXNlckxvZ2dlZEluKCk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRVc2VyKSB7XG4gICAgICAgICAgLy8gVXNlciBpcyBhdXRob3JpemVkXG4gICAgICAgICAgaWYgKHN0YXRlLnVybCA9PT0gJy9sb2dpbicgfHwgc3RhdGUudXJsID09PSAnL3NpZ251cCcgfHwgc3RhdGUudXJsID09PSAnL2ZvcmdvdCcpIHtcbiAgICAgICAgICAgIHRoaXMucmV0dXJuVXJsID0gJy9ob21lJ1xuICAgICAgICAgICAgdGhpcy50cmVlID0gdGhpcy5yb3V0ZXIucGFyc2VVcmwodGhpcy5yZXR1cm5VcmwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmVlXG4gICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG59XG4iXX0=