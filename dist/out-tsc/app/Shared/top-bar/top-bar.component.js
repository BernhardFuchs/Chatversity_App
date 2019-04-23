"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var auth_service_1 = require("../../Core/_services/auth.service");
var router_1 = require("@angular/router");
var messaging_service_1 = require("../../Core/_services/messaging.service");
var TopBarComponent = /** @class */ (function () {
    function TopBarComponent(authService, route, router, messageService) {
        this.authService = authService;
        this.route = route;
        this.router = router;
        this.messageService = messageService;
        this.roomDeleted = new core_1.EventEmitter();
    }
    //
    // ─── HANDLE DELETE ROOM ─────────────────────────────────────────────────────────
    //
    TopBarComponent.prototype.deleteRoom = function (id) {
        this.roomDeleted.emit(id);
    };
    // ────────────────────────────────────────────────────────────────────────────────
    TopBarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.getCurrentUser().subscribe(function (user) {
            _this.currentUser = user;
        });
        this.returnUrl = '/login';
    };
    // Logout user
    TopBarComponent.prototype.logOut = function () {
        this.authService.logout();
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
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TopBarComponent.prototype, "roomId", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], TopBarComponent.prototype, "roomDeleted", void 0);
    TopBarComponent = __decorate([
        core_1.Component({
            selector: 'app-top-bar',
            templateUrl: './top-bar.component.html',
            styleUrls: ['./top-bar.component.css']
        }),
        __metadata("design:paramtypes", [auth_service_1.AuthService,
            router_1.ActivatedRoute,
            router_1.Router,
            messaging_service_1.MessagingService])
    ], TopBarComponent);
    return TopBarComponent;
}());
exports.TopBarComponent = TopBarComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wLWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBwL1NoYXJlZC90b3AtYmFyL3RvcC1iYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQThFO0FBQzlFLGtFQUErRDtBQUMvRCwwQ0FBd0Q7QUFDeEQsNEVBQXlFO0FBT3pFO0lBU0UseUJBQW9CLFdBQXdCLEVBQ2xDLEtBQXFCLEVBQ3JCLE1BQWMsRUFDZCxjQUFnQztRQUh0QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUNsQyxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsbUJBQWMsR0FBZCxjQUFjLENBQWtCO1FBUmhDLGdCQUFXLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUE7SUFRSSxDQUFDO0lBRy9DLEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUVBLG9DQUFVLEdBQVYsVUFBVyxFQUFFO1FBRVgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDM0IsQ0FBQztJQUNILG1GQUFtRjtJQUluRixrQ0FBUSxHQUFSO1FBQUEsaUJBUUM7UUFOQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFDLElBQUk7WUFFL0MsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7UUFDekIsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQTtJQUMzQixDQUFDO0lBRUQsY0FBYztJQUNkLGdDQUFNLEdBQU47UUFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFDeEMsQ0FBQztJQXhDUTtRQUFSLFlBQUssRUFBRTs7cURBQWlCO0lBQ2hCO1FBQVIsWUFBSyxFQUFFOzt1REFBbUI7SUFDbEI7UUFBUixZQUFLLEVBQUU7O21EQUFlO0lBQ2I7UUFBVCxhQUFNLEVBQUU7O3dEQUFpQztJQUovQixlQUFlO1FBTDNCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsYUFBYTtZQUN2QixXQUFXLEVBQUUsMEJBQTBCO1lBQ3ZDLFNBQVMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO1NBQ3ZDLENBQUM7eUNBVWlDLDBCQUFXO1lBQzNCLHVCQUFjO1lBQ2IsZUFBTTtZQUNFLG9DQUFnQjtPQVovQixlQUFlLENBMkMzQjtJQUFELHNCQUFDO0NBQUEsQUEzQ0QsSUEyQ0M7QUEzQ1ksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJ1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcidcbmltcG9ydCB7IE1lc3NhZ2luZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9tZXNzYWdpbmcuc2VydmljZSdcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXRvcC1iYXInLFxuICB0ZW1wbGF0ZVVybDogJy4vdG9wLWJhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3RvcC1iYXIuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFRvcEJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIHZpZXdOYW1lOiBzdHJpbmdcbiAgQElucHV0KCkgaGVhZGVyVGV4dDogc3RyaW5nXG4gIEBJbnB1dCgpIHJvb21JZDogc3RyaW5nXG4gIEBPdXRwdXQoKSByb29tRGVsZXRlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuXG4gIHJldHVyblVybDogc3RyaW5nXG4gIGN1cnJlbnRVc2VyOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UsXG4gICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdpbmdTZXJ2aWNlKSB7IH1cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBIQU5ETEUgREVMRVRFIFJPT00g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBkZWxldGVSb29tKGlkKSB7XG5cbiAgICAgIHRoaXMucm9vbURlbGV0ZWQuZW1pdChpZClcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICBuZ09uSW5pdCgpIHtcblxuICAgIHRoaXMuYXV0aFNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKS5zdWJzY3JpYmUoKHVzZXIpID0+IHtcblxuICAgICAgdGhpcy5jdXJyZW50VXNlciA9IHVzZXJcbiAgICB9KVxuXG4gICAgdGhpcy5yZXR1cm5VcmwgPSAnL2xvZ2luJ1xuICB9XG5cbiAgLy8gTG9nb3V0IHVzZXJcbiAgbG9nT3V0KCkge1xuICAgIHRoaXMuYXV0aFNlcnZpY2UubG9nb3V0KClcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5yZXR1cm5VcmxdKVxuICB9XG5cbn1cbiJdfQ==