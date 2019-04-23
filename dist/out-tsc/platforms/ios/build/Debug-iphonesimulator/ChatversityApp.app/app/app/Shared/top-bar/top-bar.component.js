"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var auth_service_1 = require("../../Core/_services/auth.service");
var router_1 = require("@angular/router");
var TopBarComponent = /** @class */ (function () {
    function TopBarComponent(auth, route, router) {
        this.auth = auth;
        this.route = route;
        this.router = router;
    }
    TopBarComponent.prototype.ngOnInit = function () {
        this.returnUrl = '/login';
    };
    // Logout user
    TopBarComponent.prototype.logOut = function () {
        this.auth.logout();
        this.router.navigate([this.returnUrl]);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TopBarComponent.prototype, "viewName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TopBarComponent.prototype, "headerText", void 0);
    TopBarComponent = __decorate([
        core_1.Component({
            selector: 'app-top-bar',
            templateUrl: './top-bar.component.html',
            styleUrls: ['./top-bar.component.css']
        }),
        __metadata("design:paramtypes", [auth_service_1.AuthService,
            router_1.ActivatedRoute,
            router_1.Router])
    ], TopBarComponent);
    return TopBarComponent;
}());
exports.TopBarComponent = TopBarComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wLWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL2FwcC9TaGFyZWQvdG9wLWJhci90b3AtYmFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5RDtBQUN6RCxrRUFBZ0U7QUFDaEUsMENBQXlEO0FBT3pEO0lBTUUseUJBQW9CLElBQWlCLEVBQzNCLEtBQXFCLEVBQ3JCLE1BQWM7UUFGSixTQUFJLEdBQUosSUFBSSxDQUFhO1FBQzNCLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQVE7SUFBSSxDQUFDO0lBRTdCLGtDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM1QixDQUFDO0lBRUQsY0FBYztJQUNkLGdDQUFNLEdBQU47UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQWpCUTtRQUFSLFlBQUssRUFBRTs7cURBQWtCO0lBQ2pCO1FBQVIsWUFBSyxFQUFFOzt1REFBb0I7SUFGakIsZUFBZTtRQUwzQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGFBQWE7WUFDdkIsV0FBVyxFQUFFLDBCQUEwQjtZQUN2QyxTQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztTQUN2QyxDQUFDO3lDQU8wQiwwQkFBVztZQUNwQix1QkFBYztZQUNiLGVBQU07T0FSYixlQUFlLENBb0IzQjtJQUFELHNCQUFDO0NBQUEsQUFwQkQsSUFvQkM7QUFwQlksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtdG9wLWJhcicsXG4gIHRlbXBsYXRlVXJsOiAnLi90b3AtYmFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vdG9wLWJhci5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgVG9wQmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgdmlld05hbWU6IHN0cmluZztcbiAgQElucHV0KCkgaGVhZGVyVGV4dDogc3RyaW5nO1xuXG4gIHJldHVyblVybDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXV0aDogQXV0aFNlcnZpY2UsXG4gICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcikgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5yZXR1cm5VcmwgPSAnL2xvZ2luJztcbiAgfVxuXG4gIC8vIExvZ291dCB1c2VyXG4gIGxvZ091dCgpIHtcbiAgICB0aGlzLmF1dGgubG9nb3V0KCk7XG4gICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMucmV0dXJuVXJsXSk7XG4gIH1cblxufVxuIl19