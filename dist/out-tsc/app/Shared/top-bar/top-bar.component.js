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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wLWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBwL1NoYXJlZC90b3AtYmFyL3RvcC1iYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlEO0FBQ3pELGtFQUFnRTtBQUNoRSwwQ0FBeUQ7QUFPekQ7SUFNRSx5QkFBb0IsSUFBaUIsRUFDM0IsS0FBcUIsRUFDckIsTUFBYztRQUZKLFNBQUksR0FBSixJQUFJLENBQWE7UUFDM0IsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDckIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUFJLENBQUM7SUFFN0Isa0NBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzVCLENBQUM7SUFFRCxjQUFjO0lBQ2QsZ0NBQU0sR0FBTjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBakJRO1FBQVIsWUFBSyxFQUFFOztxREFBa0I7SUFDakI7UUFBUixZQUFLLEVBQUU7O3VEQUFvQjtJQUZqQixlQUFlO1FBTDNCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsYUFBYTtZQUN2QixXQUFXLEVBQUUsMEJBQTBCO1lBQ3ZDLFNBQVMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO1NBQ3ZDLENBQUM7eUNBTzBCLDBCQUFXO1lBQ3BCLHVCQUFjO1lBQ2IsZUFBTTtPQVJiLGVBQWUsQ0FvQjNCO0lBQUQsc0JBQUM7Q0FBQSxBQXBCRCxJQW9CQztBQXBCWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC10b3AtYmFyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3RvcC1iYXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi90b3AtYmFyLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBUb3BCYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSB2aWV3TmFtZTogc3RyaW5nO1xuICBASW5wdXQoKSBoZWFkZXJUZXh0OiBzdHJpbmc7XG5cbiAgcmV0dXJuVXJsOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhdXRoOiBBdXRoU2VydmljZSxcbiAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnJldHVyblVybCA9ICcvbG9naW4nO1xuICB9XG5cbiAgLy8gTG9nb3V0IHVzZXJcbiAgbG9nT3V0KCkge1xuICAgIHRoaXMuYXV0aC5sb2dvdXQoKTtcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5yZXR1cm5VcmxdKTtcbiAgfVxuXG59XG4iXX0=