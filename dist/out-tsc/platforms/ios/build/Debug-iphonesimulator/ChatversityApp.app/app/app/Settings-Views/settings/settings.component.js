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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC9hcHAvU2V0dGluZ3MtVmlld3Mvc2V0dGluZ3Mvc2V0dGluZ3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBRWxELDBDQUFpRTtBQUNqRSxrRUFBZ0U7QUFPaEU7SUFXRSwyQkFBb0IsY0FBOEIsRUFBVSxNQUFjLEVBQVUsS0FBa0I7UUFBbEYsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLFVBQUssR0FBTCxLQUFLLENBQWE7UUFWdEcsZ0JBQVcsR0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDL0QsZ0JBQVcsR0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDL0QsaUJBQVksR0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDakUsb0JBQWUsR0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFFdkUsVUFBSyxHQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBS1ksQ0FBQztJQUUzRyxvQ0FBUSxHQUFSO1FBQUEsaUJBV0M7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QUFhO2dCQUNoQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztnQkFDM0IsTUFBTTtZQUNSO2dCQUNFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDdkIsTUFBTTtTQUNUO0lBQ0gsQ0FBQztJQWpHVSxpQkFBaUI7UUFMN0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxjQUFjO1lBQ3hCLFdBQVcsRUFBRSwyQkFBMkI7WUFDeEMsU0FBUyxFQUFFLENBQUMsMkJBQTJCLENBQUM7U0FDekMsQ0FBQzt5Q0FZb0MsdUJBQWMsRUFBa0IsZUFBTSxFQUFpQiwwQkFBVztPQVgzRixpQkFBaUIsQ0FrRzdCO0lBQUQsd0JBQUM7Q0FBQSxBQWxHRCxJQWtHQztBQWxHWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4uLy4uL0NvcmUvX21vZGVscy92aWV3JztcbmltcG9ydCB7IFJvdXRlciwgQWN0aXZhdGVkUm91dGUsIFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1zZXR0aW5ncycsXG4gIHRlbXBsYXRlVXJsOiAnLi9zZXR0aW5ncy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3NldHRpbmdzLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBQcm9maWxlVmlldzogVmlldyA9IHsgaWQ6IDEsIG5hbWU6ICdQcm9maWxlJywgY3VycmVudDogZmFsc2UgfTtcbiAgUHJpdmFjeVZpZXc6IFZpZXcgPSB7IGlkOiAyLCBuYW1lOiAnUHJpdmFjeScsIGN1cnJlbnQ6IGZhbHNlIH07XG4gIFNlY3VyaXR5VmlldzogVmlldyA9IHsgaWQ6IDMsIG5hbWU6ICdTZWN1cml0eScsIGN1cnJlbnQ6IGZhbHNlIH07XG4gIENvbm5lY3Rpb25zVmlldzogVmlldyA9IHsgaWQ6IDQsIG5hbWU6ICdDb25uZWN0aW9ucycsIGN1cnJlbnQ6IGZhbHNlIH07XG5cbiAgdmlld3M6IFZpZXdbXSA9IFt0aGlzLlByb2ZpbGVWaWV3LCB0aGlzLlByaXZhY3lWaWV3LCB0aGlzLlNlY3VyaXR5VmlldywgdGhpcy5Db25uZWN0aW9uc1ZpZXddO1xuXG4gIGhlYWRlclRleHQ6IHN0cmluZztcbiAgcmV0dXJuVXJsOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgX2F1dGg6IEF1dGhTZXJ2aWNlKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnJldHVyblVybCA9ICcvbG9naW4nO1xuXG4gICAgdGhpcy5Qcm9maWxlVmlldy5jdXJyZW50ID0gdHJ1ZTtcbiAgICB0aGlzLmhlYWRlclRleHQgPSB0aGlzLlByb2ZpbGVWaWV3Lm5hbWU7XG5cbiAgICB0aGlzLmFjdGl2YXRlZFJvdXRlLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xuICAgICAgY29uc3QgdmlldyA9IHBhcmFtc1sndmlldyddO1xuXG4gICAgICB0aGlzLmhhbmRsZVZpZXdQYXJhbSh2aWV3KTtcbiAgICB9KTtcbiAgfVxuXG4gIGxvZ091dCgpIHtcbiAgICB0aGlzLl9hdXRoLmxvZ291dCgpO1xuICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLnJldHVyblVybF0pO1xuICB9XG5cbiAgLy8gRGlzcGxheSBwcm9maWxlIHZpZXdcbiAgc2hvd1Byb2ZpbGVWaWV3KCkge1xuICAgIHRoaXMuc2hvd1BhZ2UodGhpcy5Qcm9maWxlVmlldy5pZCk7XG4gIH1cblxuICAvLyBEaXNwbGF5IHByaXZhY3kgdmlld1xuICBzaG93UHJpdmFjeVZpZXcoKSB7XG4gICAgdGhpcy5zaG93UGFnZSh0aGlzLlByaXZhY3lWaWV3LmlkKTtcbiAgfVxuXG4gIC8vIERpc3BsYXkgc2VjdXJpdHkgdmlld1xuICBzaG93U2VjdXJpdHlWaWV3KCkge1xuICAgIHRoaXMuc2hvd1BhZ2UodGhpcy5TZWN1cml0eVZpZXcuaWQpO1xuICB9XG5cbiAgLy8gRGlzcGxheSBjb25uZWN0aW9ucyB2aWV3XG4gIHNob3dDb25uZWN0aW9uc1ZpZXcoKSB7XG4gICAgdGhpcy5zaG93UGFnZSh0aGlzLkNvbm5lY3Rpb25zVmlldy5pZCk7XG4gIH1cblxuICAvLyBIaWRlIGFsbCBzZXR0aW5ncyB2aWV3c1xuICBoaWRlQWxsVmlld3MoKSB7XG4gICAgdGhpcy52aWV3cy5mb3JFYWNoKGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICB2aWV3LmN1cnJlbnQgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIERpc3BsYXkgdmlldyBieSBpZFxuICBzaG93UGFnZShfaWQ6IG51bWJlcikge1xuICAgIHRoaXMuaGlkZUFsbFZpZXdzKCk7XG4gICAgc3dpdGNoIChfaWQpIHtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgdGhpcy5Qcml2YWN5Vmlldy5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oZWFkZXJUZXh0ID0gdGhpcy5Qcml2YWN5Vmlldy5uYW1lO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgdGhpcy5TZWN1cml0eVZpZXcuY3VycmVudCA9IHRydWU7XG4gICAgICAgIHRoaXMuaGVhZGVyVGV4dCA9IHRoaXMuU2VjdXJpdHlWaWV3Lm5hbWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0OlxuICAgICAgICB0aGlzLkNvbm5lY3Rpb25zVmlldy5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oZWFkZXJUZXh0ID0gdGhpcy5Db25uZWN0aW9uc1ZpZXcubmFtZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLlByb2ZpbGVWaWV3LmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICB0aGlzLmhlYWRlclRleHQgPSB0aGlzLlByb2ZpbGVWaWV3Lm5hbWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIERpc3BsYXkgdmlldyBiYXNlZCBvbiB1cmwgcGFyYW1cbiAgaGFuZGxlVmlld1BhcmFtKHBhcmFtOiBzdHJpbmcpIHtcbiAgICBzd2l0Y2ggKHBhcmFtKSB7XG4gICAgICBjYXNlICdwcml2YWN5JzpcbiAgICAgICAgdGhpcy5zaG93UHJpdmFjeVZpZXcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzZWN1cml0eSc6XG4gICAgICAgIHRoaXMuc2hvd1NlY3VyaXR5VmlldygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Nvbm5lY3Rpb25zJzpcbiAgICAgICAgdGhpcy5zaG93Q29ubmVjdGlvbnNWaWV3KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5zaG93UHJvZmlsZVZpZXcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG4iXX0=