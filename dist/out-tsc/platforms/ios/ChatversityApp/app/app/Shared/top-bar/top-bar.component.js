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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wLWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC9hcHAvU2hhcmVkL3RvcC1iYXIvdG9wLWJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFDekQsa0VBQWdFO0FBQ2hFLDBDQUF5RDtBQU96RDtJQU1FLHlCQUFvQixJQUFpQixFQUMzQixLQUFxQixFQUNyQixNQUFjO1FBRkosU0FBSSxHQUFKLElBQUksQ0FBYTtRQUMzQixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQUksQ0FBQztJQUU3QixrQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDNUIsQ0FBQztJQUVELGNBQWM7SUFDZCxnQ0FBTSxHQUFOO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFqQlE7UUFBUixZQUFLLEVBQUU7O3FEQUFrQjtJQUNqQjtRQUFSLFlBQUssRUFBRTs7dURBQW9CO0lBRmpCLGVBQWU7UUFMM0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFdBQVcsRUFBRSwwQkFBMEI7WUFDdkMsU0FBUyxFQUFFLENBQUMseUJBQXlCLENBQUM7U0FDdkMsQ0FBQzt5Q0FPMEIsMEJBQVc7WUFDcEIsdUJBQWM7WUFDYixlQUFNO09BUmIsZUFBZSxDQW9CM0I7SUFBRCxzQkFBQztDQUFBLEFBcEJELElBb0JDO0FBcEJZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXRvcC1iYXInLFxuICB0ZW1wbGF0ZVVybDogJy4vdG9wLWJhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3RvcC1iYXIuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFRvcEJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIHZpZXdOYW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGhlYWRlclRleHQ6IHN0cmluZztcblxuICByZXR1cm5Vcmw6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGF1dGg6IEF1dGhTZXJ2aWNlLFxuICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucmV0dXJuVXJsID0gJy9sb2dpbic7XG4gIH1cblxuICAvLyBMb2dvdXQgdXNlclxuICBsb2dPdXQoKSB7XG4gICAgdGhpcy5hdXRoLmxvZ291dCgpO1xuICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLnJldHVyblVybF0pO1xuICB9XG5cbn1cbiJdfQ==