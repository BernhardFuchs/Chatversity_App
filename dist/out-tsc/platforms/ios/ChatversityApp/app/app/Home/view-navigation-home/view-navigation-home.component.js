"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var ViewNavigationHomeComponent = /** @class */ (function () {
    function ViewNavigationHomeComponent(activatedRoute) {
        this.activatedRoute = activatedRoute;
        this.HomeView = { id: 1, name: 'Latest News', current: false };
        this.FriendsView = { id: 2, name: 'Connections', current: false };
        this.ProfileView = { id: 3, name: 'Profile', current: false };
        this.views = [this.HomeView, this.FriendsView, this.ProfileView];
    }
    ViewNavigationHomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.HomeView.current = true;
        this.headerText = this.HomeView.name;
        // [routerLink]="['/home']" [queryParams]="{view:'param'}"
        this.activatedRoute.queryParams.subscribe(function (params) {
            var view = params['view'];
            _this.handleViewParam(view);
        });
    };
    // Display home view
    ViewNavigationHomeComponent.prototype.showHomeView = function () {
        this.showPage(this.HomeView.id);
    };
    // Display friends view
    ViewNavigationHomeComponent.prototype.showFriendsView = function () {
        this.showPage(this.FriendsView.id);
    };
    // Display profile view
    ViewNavigationHomeComponent.prototype.showProfileView = function () {
        this.showPage(this.ProfileView.id);
    };
    // Display view by id
    ViewNavigationHomeComponent.prototype.showPage = function (_id) {
        this.hideAllViews();
        switch (_id) {
            case 2:
                this.FriendsView.current = true;
                this.headerText = this.FriendsView.name;
                break;
            case 3:
                this.ProfileView.current = true;
                this.headerText = this.ProfileView.name;
                break;
            default:
                this.HomeView.current = true;
                this.headerText = this.HomeView.name;
                break;
        }
    };
    // Hide all home views
    ViewNavigationHomeComponent.prototype.hideAllViews = function () {
        this.views.forEach(function (view) {
            view.current = false;
        });
    };
    // Display views based on url param
    ViewNavigationHomeComponent.prototype.handleViewParam = function (param) {
        switch (param) {
            case 'profile':
                this.showProfileView();
                break;
            case 'connections':
                this.showFriendsView();
                break;
            default:
                this.showHomeView();
                break;
        }
    };
    ViewNavigationHomeComponent = __decorate([
        core_1.Component({
            selector: 'app-view-navigation-home',
            templateUrl: './view-navigation-home.component.html',
            styleUrls: ['./view-navigation-home.component.css']
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute])
    ], ViewNavigationHomeComponent);
    return ViewNavigationHomeComponent;
}());
exports.ViewNavigationHomeComponent = ViewNavigationHomeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy1uYXZpZ2F0aW9uLWhvbWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvYXBwL0hvbWUvdmlldy1uYXZpZ2F0aW9uLWhvbWUvdmlldy1uYXZpZ2F0aW9uLWhvbWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBRWxELDBDQUErRDtBQU8vRDtJQVNFLHFDQUFvQixjQUE4QjtRQUE5QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFSbEQsYUFBUSxHQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNoRSxnQkFBVyxHQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNuRSxnQkFBVyxHQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUUvRCxVQUFLLEdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBSWQsQ0FBQztJQUV2RCw4Q0FBUSxHQUFSO1FBQUEsaUJBVUM7UUFUQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUVyQywwREFBMEQ7UUFDMUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTTtZQUM5QyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFNUIsS0FBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxvQkFBb0I7SUFDcEIsa0RBQVksR0FBWjtRQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsdUJBQXVCO0lBQ3ZCLHFEQUFlLEdBQWY7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELHVCQUF1QjtJQUN2QixxREFBZSxHQUFmO1FBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxxQkFBcUI7SUFDckIsOENBQVEsR0FBUixVQUFTLEdBQVc7UUFDbEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLFFBQVEsR0FBRyxFQUFFO1lBQ1gsS0FBSyxDQUFDO2dCQUNKLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztnQkFDeEMsTUFBTTtZQUNSLEtBQUssQ0FBQztnQkFDSixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7Z0JBQ3hDLE1BQU07WUFDUjtnQkFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ3JDLE1BQU07U0FDVDtJQUNILENBQUM7SUFFRCxzQkFBc0I7SUFDdEIsa0RBQVksR0FBWjtRQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSTtZQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxtQ0FBbUM7SUFDbkMscURBQWUsR0FBZixVQUFnQixLQUFhO1FBQzNCLFFBQVEsS0FBSyxFQUFFO1lBQ2IsS0FBSyxTQUFTO2dCQUNaLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDdkIsTUFBTTtZQUNSLEtBQUssYUFBYTtnQkFDaEIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN2QixNQUFNO1lBQ1I7Z0JBQ0UsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNwQixNQUFNO1NBQ1Q7SUFDSCxDQUFDO0lBN0VVLDJCQUEyQjtRQUx2QyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLDBCQUEwQjtZQUNwQyxXQUFXLEVBQUUsdUNBQXVDO1lBQ3BELFNBQVMsRUFBRSxDQUFDLHNDQUFzQyxDQUFDO1NBQ3BELENBQUM7eUNBVW9DLHVCQUFjO09BVHZDLDJCQUEyQixDQThFdkM7SUFBRCxrQ0FBQztDQUFBLEFBOUVELElBOEVDO0FBOUVZLGtFQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi4vLi4vQ29yZS9fbW9kZWxzL3ZpZXcnO1xuaW1wb3J0IHtSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlLCBQYXJhbXN9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC12aWV3LW5hdmlnYXRpb24taG9tZScsXG4gIHRlbXBsYXRlVXJsOiAnLi92aWV3LW5hdmlnYXRpb24taG9tZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3ZpZXctbmF2aWdhdGlvbi1ob21lLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBWaWV3TmF2aWdhdGlvbkhvbWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBIb21lVmlldzogVmlldyA9IHsgaWQ6IDEsIG5hbWU6ICdMYXRlc3QgTmV3cycsIGN1cnJlbnQ6IGZhbHNlIH07XG4gIEZyaWVuZHNWaWV3OiBWaWV3ID0geyBpZDogMiwgbmFtZTogJ0Nvbm5lY3Rpb25zJywgY3VycmVudDogZmFsc2UgfTtcbiAgUHJvZmlsZVZpZXc6IFZpZXcgPSB7IGlkOiAzLCBuYW1lOiAnUHJvZmlsZScsIGN1cnJlbnQ6IGZhbHNlIH07XG5cbiAgdmlld3M6IFZpZXdbXSA9IFt0aGlzLkhvbWVWaWV3LCB0aGlzLkZyaWVuZHNWaWV3LCB0aGlzLlByb2ZpbGVWaWV3XTtcblxuICBoZWFkZXJUZXh0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuSG9tZVZpZXcuY3VycmVudCA9IHRydWU7XG4gICAgdGhpcy5oZWFkZXJUZXh0ID0gdGhpcy5Ib21lVmlldy5uYW1lO1xuXG4gICAgLy8gW3JvdXRlckxpbmtdPVwiWycvaG9tZSddXCIgW3F1ZXJ5UGFyYW1zXT1cInt2aWV3OidwYXJhbSd9XCJcbiAgICB0aGlzLmFjdGl2YXRlZFJvdXRlLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xuICAgICAgY29uc3QgdmlldyA9IHBhcmFtc1sndmlldyddO1xuXG4gICAgICB0aGlzLmhhbmRsZVZpZXdQYXJhbSh2aWV3KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIERpc3BsYXkgaG9tZSB2aWV3XG4gIHNob3dIb21lVmlldygpIHtcbiAgICB0aGlzLnNob3dQYWdlKHRoaXMuSG9tZVZpZXcuaWQpO1xuICB9XG5cbiAgLy8gRGlzcGxheSBmcmllbmRzIHZpZXdcbiAgc2hvd0ZyaWVuZHNWaWV3KCkge1xuICAgIHRoaXMuc2hvd1BhZ2UodGhpcy5GcmllbmRzVmlldy5pZCk7XG4gIH1cblxuICAvLyBEaXNwbGF5IHByb2ZpbGUgdmlld1xuICBzaG93UHJvZmlsZVZpZXcoKSB7XG4gICAgdGhpcy5zaG93UGFnZSh0aGlzLlByb2ZpbGVWaWV3LmlkKTtcbiAgfVxuXG4gIC8vIERpc3BsYXkgdmlldyBieSBpZFxuICBzaG93UGFnZShfaWQ6IG51bWJlcikge1xuICAgIHRoaXMuaGlkZUFsbFZpZXdzKCk7XG4gICAgc3dpdGNoIChfaWQpIHtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgdGhpcy5GcmllbmRzVmlldy5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oZWFkZXJUZXh0ID0gdGhpcy5GcmllbmRzVmlldy5uYW1lO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgdGhpcy5Qcm9maWxlVmlldy5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oZWFkZXJUZXh0ID0gdGhpcy5Qcm9maWxlVmlldy5uYW1lO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuSG9tZVZpZXcuY3VycmVudCA9IHRydWU7XG4gICAgICAgIHRoaXMuaGVhZGVyVGV4dCA9IHRoaXMuSG9tZVZpZXcubmFtZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gSGlkZSBhbGwgaG9tZSB2aWV3c1xuICBoaWRlQWxsVmlld3MoKSB7XG4gICAgdGhpcy52aWV3cy5mb3JFYWNoKGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgIHZpZXcuY3VycmVudCA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRGlzcGxheSB2aWV3cyBiYXNlZCBvbiB1cmwgcGFyYW1cbiAgaGFuZGxlVmlld1BhcmFtKHBhcmFtOiBzdHJpbmcpIHtcbiAgICBzd2l0Y2ggKHBhcmFtKSB7XG4gICAgICBjYXNlICdwcm9maWxlJzpcbiAgICAgICAgdGhpcy5zaG93UHJvZmlsZVZpZXcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb25uZWN0aW9ucyc6XG4gICAgICAgIHRoaXMuc2hvd0ZyaWVuZHNWaWV3KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5zaG93SG9tZVZpZXcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG4iXX0=