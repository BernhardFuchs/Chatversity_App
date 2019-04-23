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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuZ3VhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL2FwcC9Db3JlL19ndWFyZHMvcm91dGUuZ3VhcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0MsMENBQTRHO0FBRTVHLDBEQUF3RDtBQU14RDtJQUNFLG9CQUNVLE1BQWMsRUFDZCxXQUF3QjtRQUR4QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsZ0JBQVcsR0FBWCxXQUFXLENBQWE7SUFDL0IsQ0FBQztJQUVKLGdDQUFXLEdBQVgsVUFDRSxJQUE0QixFQUM1QixLQUEwQjtRQUN4QixJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQztRQUMvQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2hCLHdDQUF3QztZQUN4QyxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQseURBQXlEO1FBQ3pELElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQztRQUNyQixJQUFNLElBQUksR0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBbkJRLFVBQVU7UUFKdEIsaUJBQVUsQ0FBQztZQUNWLFVBQVUsRUFBRSxNQUFNO1NBQ25CLENBQUM7eUNBSWtCLGVBQU07WUFDRCwwQkFBVztPQUh2QixVQUFVLENBb0J0QjtJQUFELGlCQUFDO0NBQUEsQUFwQkQsSUFvQkM7QUFwQlksZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYW5BY3RpdmF0ZSwgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgUm91dGVyU3RhdGVTbmFwc2hvdCwgVXJsVHJlZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuXG5leHBvcnQgY2xhc3MgUm91dGVHdWFyZCBpbXBsZW1lbnRzIENhbkFjdGl2YXRlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZVxuICApIHt9XG5cbiAgY2FuQWN0aXZhdGUoXG4gICAgbmV4dDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCxcbiAgICBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IE9ic2VydmFibGU8Ym9vbGVhbiB8IFVybFRyZWU+IHwgUHJvbWlzZTxib29sZWFuIHwgVXJsVHJlZT4gfCBib29sZWFuIHwgVXJsVHJlZSB7XG4gICAgICBjb25zdCBjdXJyZW50VXNlciA9IHRoaXMuYXV0aFNlcnZpY2UuY3VycmVudFVzZXI7XG4gICAgICAgIGlmICghY3VycmVudFVzZXIpIHtcbiAgICAgICAgICAvLyBVc2VyIGlzIG5vdCBhdXRob3JpemVkIHNvIHJldHVybiB0cnVlXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVc2VyIGlzIG9nZ2VkIGluIHNvIHJlZGlyZWN0IHRvIGxvZ2luIHBhZ2UgdmlhIFVybFRyZWVcbiAgICAgICAgY29uc3QgdXJsID0gJy9sb2dpbic7XG4gICAgICAgIGNvbnN0IHRyZWU6IFVybFRyZWUgPSB0aGlzLnJvdXRlci5wYXJzZVVybCh1cmwpO1xuICAgICAgICByZXR1cm4gdHJlZTtcbiAgICB9XG59XG4iXX0=