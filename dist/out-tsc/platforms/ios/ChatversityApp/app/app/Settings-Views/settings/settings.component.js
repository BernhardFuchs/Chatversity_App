"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var auth_service_1 = require("../../Core/_services/auth.service");
var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(activatedRoute, router, _auth) {
        this.activatedRoute = activatedRoute;
        this.router = router;
        this._auth = _auth;
        this.ProfileView = { id: 1, name: 'Profile', current: false };
        this.PrivacyView = { id: 2, name: 'Privacy', current: false };
        this.SecurityView = { id: 3, name: 'Security', current: false };
        this.ConnectionsView = { id: 4, name: 'Connections', current: false };
        this.views = [this.ProfileView, this.PrivacyView, this.SecurityView, this.ConnectionsView];
    }
    SettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.returnUrl = '/login';
        this.ProfileView.current = true;
        this.headerText = this.ProfileView.name;
        this.activatedRoute.queryParams.subscribe(function (params) {
            var view = params['view'];
            _this.handleViewParam(view);
        });
    };
    SettingsComponent.prototype.logOut = function () {
        this._auth.logout();
        this.router.navigate([this.returnUrl]);
    };
    // Display profile view
    SettingsComponent.prototype.showProfileView = function () {
        this.showPage(this.ProfileView.id);
    };
    // Display privacy view
    SettingsComponent.prototype.showPrivacyView = function () {
        this.showPage(this.PrivacyView.id);
    };
    // Display security view
    SettingsComponent.prototype.showSecurityView = function () {
        this.showPage(this.SecurityView.id);
    };
    // Display connections view
    SettingsComponent.prototype.showConnectionsView = function () {
        this.showPage(this.ConnectionsView.id);
    };
    // Hide all settings views
    SettingsComponent.prototype.hideAllViews = function () {
        this.views.forEach(function (view) {
            view.current = false;
        });
    };
    // Display view by id
    SettingsComponent.prototype.showPage = function (_id) {
        this.hideAllViews();
        switch (_id) {
            case 2:
                this.PrivacyView.current = true;
                this.headerText = this.PrivacyView.name;
                break;
            case 3:
                this.SecurityView.current = true;
                this.headerText = this.SecurityView.name;
                break;
            case 4:
                this.ConnectionsView.current = true;
                this.headerText = this.ConnectionsView.name;
                break;
            default:
                this.ProfileView.current = true;
                this.headerText = this.ProfileView.name;
                break;
        }
    };
    // Display view based on url param
    SettingsComponent.prototype.handleViewParam = function (param) {
        switch (param) {
            case 'privacy':
                this.showPrivacyView();
                break;
            case 'security':
                this.showSecurityView();
                break;
            case 'connections':
                this.showConnectionsView();
                break;
            default:
                this.showProfileView();
                break;
        }
    };
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-settings',
            templateUrl: './settings.component.html',
            styleUrls: ['./settings.component.scss']
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, auth_service_1.AuthService])
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvYXBwL1NldHRpbmdzLVZpZXdzL3NldHRpbmdzL3NldHRpbmdzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUVsRCwwQ0FBaUU7QUFDakUsa0VBQWdFO0FBT2hFO0lBV0UsMkJBQW9CLGNBQThCLEVBQVUsTUFBYyxFQUFVLEtBQWtCO1FBQWxGLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFhO1FBVnRHLGdCQUFXLEdBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQy9ELGdCQUFXLEdBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQy9ELGlCQUFZLEdBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQ2pFLG9CQUFlLEdBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBRXZFLFVBQUssR0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUtZLENBQUM7SUFFM0csb0NBQVEsR0FBUjtRQUFBLGlCQVdDO1FBVkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFF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Z0JBQzNCLE1BQU07WUFDUjtnQkFDRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU07U0FDVDtJQUNILENBQUM7SUFqR1UsaUJBQWlCO1FBTDdCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsY0FBYztZQUN4QixXQUFXLEVBQUUsMkJBQTJCO1lBQ3hDLFNBQVMsRUFBRSxDQUFDLDJCQUEyQixDQUFDO1NBQ3pDLENBQUM7eUNBWW9DLHVCQUFjLEVBQWtCLGVBQU0sRUFBaUIsMEJBQVc7T0FYM0YsaUJBQWlCLENBa0c3QjtJQUFELHdCQUFDO0NBQUEsQUFsR0QsSUFrR0M7QUFsR1ksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFZpZXcgfSBmcm9tICcuLi8uLi9Db3JlL19tb2RlbHMvdmlldyc7XG5pbXBvcnQgeyBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlLCBQYXJhbXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtc2V0dGluZ3MnLFxuICB0ZW1wbGF0ZVVybDogJy4vc2V0dGluZ3MuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zZXR0aW5ncy5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIFNldHRpbmdzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgUHJvZmlsZVZpZXc6IFZpZXcgPSB7IGlkOiAxLCBuYW1lOiAnUHJvZmlsZScsIGN1cnJlbnQ6IGZhbHNlIH07XG4gIFByaXZhY3lWaWV3OiBWaWV3ID0geyBpZDogMiwgbmFtZTogJ1ByaXZhY3knLCBjdXJyZW50OiBmYWxzZSB9O1xuICBTZWN1cml0eVZpZXc6IFZpZXcgPSB7IGlkOiAzLCBuYW1lOiAnU2VjdXJpdHknLCBjdXJyZW50OiBmYWxzZSB9O1xuICBDb25uZWN0aW9uc1ZpZXc6IFZpZXcgPSB7IGlkOiA0LCBuYW1lOiAnQ29ubmVjdGlvbnMnLCBjdXJyZW50OiBmYWxzZSB9O1xuXG4gIHZpZXdzOiBWaWV3W10gPSBbdGhpcy5Qcm9maWxlVmlldywgdGhpcy5Qcml2YWN5VmlldywgdGhpcy5TZWN1cml0eVZpZXcsIHRoaXMuQ29ubmVjdGlvbnNWaWV3XTtcblxuICBoZWFkZXJUZXh0OiBzdHJpbmc7XG4gIHJldHVyblVybDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIF9hdXRoOiBBdXRoU2VydmljZSkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5yZXR1cm5VcmwgPSAnL2xvZ2luJztcblxuICAgIHRoaXMuUHJvZmlsZVZpZXcuY3VycmVudCA9IHRydWU7XG4gICAgdGhpcy5oZWFkZXJUZXh0ID0gdGhpcy5Qcm9maWxlVmlldy5uYW1lO1xuXG4gICAgdGhpcy5hY3RpdmF0ZWRSb3V0ZS5xdWVyeVBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcbiAgICAgIGNvbnN0IHZpZXcgPSBwYXJhbXNbJ3ZpZXcnXTtcblxuICAgICAgdGhpcy5oYW5kbGVWaWV3UGFyYW0odmlldyk7XG4gICAgfSk7XG4gIH1cblxuICBsb2dPdXQoKSB7XG4gICAgdGhpcy5fYXV0aC5sb2dvdXQoKTtcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5yZXR1cm5VcmxdKTtcbiAgfVxuXG4gIC8vIERpc3BsYXkgcHJvZmlsZSB2aWV3XG4gIHNob3dQcm9maWxlVmlldygpIHtcbiAgICB0aGlzLnNob3dQYWdlKHRoaXMuUHJvZmlsZVZpZXcuaWQpO1xuICB9XG5cbiAgLy8gRGlzcGxheSBwcml2YWN5IHZpZXdcbiAgc2hvd1ByaXZhY3lWaWV3KCkge1xuICAgIHRoaXMuc2hvd1BhZ2UodGhpcy5Qcml2YWN5Vmlldy5pZCk7XG4gIH1cblxuICAvLyBEaXNwbGF5IHNlY3VyaXR5IHZpZXdcbiAgc2hvd1NlY3VyaXR5VmlldygpIHtcbiAgICB0aGlzLnNob3dQYWdlKHRoaXMuU2VjdXJpdHlWaWV3LmlkKTtcbiAgfVxuXG4gIC8vIERpc3BsYXkgY29ubmVjdGlvbnMgdmlld1xuICBzaG93Q29ubmVjdGlvbnNWaWV3KCkge1xuICAgIHRoaXMuc2hvd1BhZ2UodGhpcy5Db25uZWN0aW9uc1ZpZXcuaWQpO1xuICB9XG5cbiAgLy8gSGlkZSBhbGwgc2V0dGluZ3Mgdmlld3NcbiAgaGlkZUFsbFZpZXdzKCkge1xuICAgIHRoaXMudmlld3MuZm9yRWFjaChmdW5jdGlvbiAodmlldykge1xuICAgICAgdmlldy5jdXJyZW50ID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICAvLyBEaXNwbGF5IHZpZXcgYnkgaWRcbiAgc2hvd1BhZ2UoX2lkOiBudW1iZXIpIHtcbiAgICB0aGlzLmhpZGVBbGxWaWV3cygpO1xuICAgIHN3aXRjaCAoX2lkKSB7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHRoaXMuUHJpdmFjeVZpZXcuY3VycmVudCA9IHRydWU7XG4gICAgICAgIHRoaXMuaGVhZGVyVGV4dCA9IHRoaXMuUHJpdmFjeVZpZXcubmFtZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIHRoaXMuU2VjdXJpdHlWaWV3LmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICB0aGlzLmhlYWRlclRleHQgPSB0aGlzLlNlY3VyaXR5Vmlldy5uYW1lO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgdGhpcy5Db25uZWN0aW9uc1ZpZXcuY3VycmVudCA9IHRydWU7XG4gICAgICAgIHRoaXMuaGVhZGVyVGV4dCA9IHRoaXMuQ29ubmVjdGlvbnNWaWV3Lm5hbWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5Qcm9maWxlVmlldy5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oZWFkZXJUZXh0ID0gdGhpcy5Qcm9maWxlVmlldy5uYW1lO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBEaXNwbGF5IHZpZXcgYmFzZWQgb24gdXJsIHBhcmFtXG4gIGhhbmRsZVZpZXdQYXJhbShwYXJhbTogc3RyaW5nKSB7XG4gICAgc3dpdGNoIChwYXJhbSkge1xuICAgICAgY2FzZSAncHJpdmFjeSc6XG4gICAgICAgIHRoaXMuc2hvd1ByaXZhY3lWaWV3KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2VjdXJpdHknOlxuICAgICAgICB0aGlzLnNob3dTZWN1cml0eVZpZXcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb25uZWN0aW9ucyc6XG4gICAgICAgIHRoaXMuc2hvd0Nvbm5lY3Rpb25zVmlldygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuc2hvd1Byb2ZpbGVWaWV3KCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuIl19