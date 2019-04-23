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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9TZXR0aW5ncy1WaWV3cy9zZXR0aW5ncy9zZXR0aW5ncy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFFbEQsMENBQWlFO0FBQ2pFLGtFQUFnRTtBQU9oRTtJQVdFLDJCQUFvQixjQUE4QixFQUFVLE1BQWMsRUFBVSxLQUFrQjtRQUFsRixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQVZ0RyxnQkFBVyxHQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUMvRCxnQkFBVyxHQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUMvRCxpQkFBWSxHQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNqRSxvQkFBZSxHQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUV2RSxVQUFLLEdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFLWSxDQUFDO0lBRTNHLG9DQUFRLEdBQVI7UUFBQSxpQkFXQztRQVZDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBRTFCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLElBQUksQ0FB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RSxDQUFDO2dCQUN2QixNQUFNO1NBQ1Q7SUFDSCxDQUFDO0lBakdVLGlCQUFpQjtRQUw3QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGNBQWM7WUFDeEIsV0FBVyxFQUFFLDJCQUEyQjtZQUN4QyxTQUFTLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQztTQUN6QyxDQUFDO3lDQVlvQyx1QkFBYyxFQUFrQixlQUFNLEVBQWlCLDBCQUFXO09BWDNGLGlCQUFpQixDQWtHN0I7SUFBRCx3QkFBQztDQUFBLEFBbEdELElBa0dDO0FBbEdZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi4vLi4vQ29yZS9fbW9kZWxzL3ZpZXcnO1xuaW1wb3J0IHsgUm91dGVyLCBBY3RpdmF0ZWRSb3V0ZSwgUGFyYW1zIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXNldHRpbmdzJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3NldHRpbmdzLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc2V0dGluZ3MuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBTZXR0aW5nc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIFByb2ZpbGVWaWV3OiBWaWV3ID0geyBpZDogMSwgbmFtZTogJ1Byb2ZpbGUnLCBjdXJyZW50OiBmYWxzZSB9O1xuICBQcml2YWN5VmlldzogVmlldyA9IHsgaWQ6IDIsIG5hbWU6ICdQcml2YWN5JywgY3VycmVudDogZmFsc2UgfTtcbiAgU2VjdXJpdHlWaWV3OiBWaWV3ID0geyBpZDogMywgbmFtZTogJ1NlY3VyaXR5JywgY3VycmVudDogZmFsc2UgfTtcbiAgQ29ubmVjdGlvbnNWaWV3OiBWaWV3ID0geyBpZDogNCwgbmFtZTogJ0Nvbm5lY3Rpb25zJywgY3VycmVudDogZmFsc2UgfTtcblxuICB2aWV3czogVmlld1tdID0gW3RoaXMuUHJvZmlsZVZpZXcsIHRoaXMuUHJpdmFjeVZpZXcsIHRoaXMuU2VjdXJpdHlWaWV3LCB0aGlzLkNvbm5lY3Rpb25zVmlld107XG5cbiAgaGVhZGVyVGV4dDogc3RyaW5nO1xuICByZXR1cm5Vcmw6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBfYXV0aDogQXV0aFNlcnZpY2UpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucmV0dXJuVXJsID0gJy9sb2dpbic7XG5cbiAgICB0aGlzLlByb2ZpbGVWaWV3LmN1cnJlbnQgPSB0cnVlO1xuICAgIHRoaXMuaGVhZGVyVGV4dCA9IHRoaXMuUHJvZmlsZVZpZXcubmFtZTtcblxuICAgIHRoaXMuYWN0aXZhdGVkUm91dGUucXVlcnlQYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG4gICAgICBjb25zdCB2aWV3ID0gcGFyYW1zWyd2aWV3J107XG5cbiAgICAgIHRoaXMuaGFuZGxlVmlld1BhcmFtKHZpZXcpO1xuICAgIH0pO1xuICB9XG5cbiAgbG9nT3V0KCkge1xuICAgIHRoaXMuX2F1dGgubG9nb3V0KCk7XG4gICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMucmV0dXJuVXJsXSk7XG4gIH1cblxuICAvLyBEaXNwbGF5IHByb2ZpbGUgdmlld1xuICBzaG93UHJvZmlsZVZpZXcoKSB7XG4gICAgdGhpcy5zaG93UGFnZSh0aGlzLlByb2ZpbGVWaWV3LmlkKTtcbiAgfVxuXG4gIC8vIERpc3BsYXkgcHJpdmFjeSB2aWV3XG4gIHNob3dQcml2YWN5VmlldygpIHtcbiAgICB0aGlzLnNob3dQYWdlKHRoaXMuUHJpdmFjeVZpZXcuaWQpO1xuICB9XG5cbiAgLy8gRGlzcGxheSBzZWN1cml0eSB2aWV3XG4gIHNob3dTZWN1cml0eVZpZXcoKSB7XG4gICAgdGhpcy5zaG93UGFnZSh0aGlzLlNlY3VyaXR5Vmlldy5pZCk7XG4gIH1cblxuICAvLyBEaXNwbGF5IGNvbm5lY3Rpb25zIHZpZXdcbiAgc2hvd0Nvbm5lY3Rpb25zVmlldygpIHtcbiAgICB0aGlzLnNob3dQYWdlKHRoaXMuQ29ubmVjdGlvbnNWaWV3LmlkKTtcbiAgfVxuXG4gIC8vIEhpZGUgYWxsIHNldHRpbmdzIHZpZXdzXG4gIGhpZGVBbGxWaWV3cygpIHtcbiAgICB0aGlzLnZpZXdzLmZvckVhY2goZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgIHZpZXcuY3VycmVudCA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRGlzcGxheSB2aWV3IGJ5IGlkXG4gIHNob3dQYWdlKF9pZDogbnVtYmVyKSB7XG4gICAgdGhpcy5oaWRlQWxsVmlld3MoKTtcbiAgICBzd2l0Y2ggKF9pZCkge1xuICAgICAgY2FzZSAyOlxuICAgICAgICB0aGlzLlByaXZhY3lWaWV3LmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICB0aGlzLmhlYWRlclRleHQgPSB0aGlzLlByaXZhY3lWaWV3Lm5hbWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICB0aGlzLlNlY3VyaXR5Vmlldy5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oZWFkZXJUZXh0ID0gdGhpcy5TZWN1cml0eVZpZXcubmFtZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQ6XG4gICAgICAgIHRoaXMuQ29ubmVjdGlvbnNWaWV3LmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICB0aGlzLmhlYWRlclRleHQgPSB0aGlzLkNvbm5lY3Rpb25zVmlldy5uYW1lO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuUHJvZmlsZVZpZXcuY3VycmVudCA9IHRydWU7XG4gICAgICAgIHRoaXMuaGVhZGVyVGV4dCA9IHRoaXMuUHJvZmlsZVZpZXcubmFtZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gRGlzcGxheSB2aWV3IGJhc2VkIG9uIHVybCBwYXJhbVxuICBoYW5kbGVWaWV3UGFyYW0ocGFyYW06IHN0cmluZykge1xuICAgIHN3aXRjaCAocGFyYW0pIHtcbiAgICAgIGNhc2UgJ3ByaXZhY3knOlxuICAgICAgICB0aGlzLnNob3dQcml2YWN5VmlldygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NlY3VyaXR5JzpcbiAgICAgICAgdGhpcy5zaG93U2VjdXJpdHlWaWV3KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29ubmVjdGlvbnMnOlxuICAgICAgICB0aGlzLnNob3dDb25uZWN0aW9uc1ZpZXcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnNob3dQcm9maWxlVmlldygpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cbiJdfQ==