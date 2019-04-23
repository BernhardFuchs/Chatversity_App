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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy1uYXZpZ2F0aW9uLWhvbWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9Ib21lL3ZpZXctbmF2aWdhdGlvbi1ob21lL3ZpZXctbmF2aWdhdGlvbi1ob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFpRDtBQUVqRCwwQ0FBOEQ7QUFPOUQ7SUFTRSxxQ0FBb0IsY0FBOEI7UUFBOUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBUmxELGFBQVEsR0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUE7UUFDL0QsZ0JBQVcsR0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUE7UUFDbEUsZ0JBQVcsR0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUE7UUFFOUQsVUFBSyxHQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUliLENBQUM7SUFFdkQsOENBQVEsR0FBUjtRQUFBLGlCQVVDO1FBVEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO1FBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUE7UUFFcEMsMERBQTBEO1FBQzFELElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU07WUFDOUMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRTNCLEtBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDNUIsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsb0JBQW9CO0lBQ3BCLGtEQUFZLEdBQVo7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDakMsQ0FBQztJQUVELHVCQUF1QjtJQUN2QixxREFBZSxHQUFmO1FBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ3BDLENBQUM7SUFFRCx1QkFBdUI7SUFDdkIscURBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBRUQscUJBQXFCO0lBQ3JCLDhDQUFRLEdBQVIsVUFBUyxHQUFXO1FBQ2xCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUNuQixRQUFRLEdBQUcsRUFBRTtZQUNYLEtBQUssQ0FBQztnQkFDSixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7Z0JBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUE7Z0JBQ3ZDLE1BQUs7WUFDUCxLQUFLLENBQUM7Z0JBQ0osSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO2dCQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFBO2dCQUN2QyxNQUFLO1lBQ1A7Z0JBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO2dCQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFBO2dCQUNwQyxNQUFLO1NBQ1I7SUFDSCxDQUFDO0lBRUQsc0JBQXNCO0lBQ3RCLGtEQUFZLEdBQVo7UUFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFTLElBQUk7WUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7UUFDdEIsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLHFEQUFlLEdBQWYsVUFBZ0IsS0FBYTtRQUMzQixRQUFRLEtBQUssRUFBRTtZQUNiLEtBQUssU0FBUztnQkFDWixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUE7Z0JBQ3RCLE1BQUs7WUFDUCxLQUFLLGFBQWE7Z0JBQ2hCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQTtnQkFDdEIsTUFBSztZQUNQO2dCQUNFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtnQkFDbkIsTUFBSztTQUNSO0lBQ0gsQ0FBQztJQTdFVSwyQkFBMkI7UUFMdkMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSwwQkFBMEI7WUFDcEMsV0FBVyxFQUFFLHVDQUF1QztZQUNwRCxTQUFTLEVBQUUsQ0FBQyxzQ0FBc0MsQ0FBQztTQUNwRCxDQUFDO3lDQVVvQyx1QkFBYztPQVR2QywyQkFBMkIsQ0E4RXZDO0lBQUQsa0NBQUM7Q0FBQSxBQTlFRCxJQThFQztBQTlFWSxrRUFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi4vLi4vQ29yZS9fbW9kZWxzL3ZpZXcnXG5pbXBvcnQge1JvdXRlciwgQWN0aXZhdGVkUm91dGUsIFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJ1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtdmlldy1uYXZpZ2F0aW9uLWhvbWUnLFxuICB0ZW1wbGF0ZVVybDogJy4vdmlldy1uYXZpZ2F0aW9uLWhvbWUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi92aWV3LW5hdmlnYXRpb24taG9tZS5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgVmlld05hdmlnYXRpb25Ib21lQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgSG9tZVZpZXc6IFZpZXcgPSB7IGlkOiAxLCBuYW1lOiAnTGF0ZXN0IE5ld3MnLCBjdXJyZW50OiBmYWxzZSB9XG4gIEZyaWVuZHNWaWV3OiBWaWV3ID0geyBpZDogMiwgbmFtZTogJ0Nvbm5lY3Rpb25zJywgY3VycmVudDogZmFsc2UgfVxuICBQcm9maWxlVmlldzogVmlldyA9IHsgaWQ6IDMsIG5hbWU6ICdQcm9maWxlJywgY3VycmVudDogZmFsc2UgfVxuXG4gIHZpZXdzOiBWaWV3W10gPSBbdGhpcy5Ib21lVmlldywgdGhpcy5GcmllbmRzVmlldywgdGhpcy5Qcm9maWxlVmlld11cblxuICBoZWFkZXJUZXh0OiBzdHJpbmdcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5Ib21lVmlldy5jdXJyZW50ID0gdHJ1ZVxuICAgIHRoaXMuaGVhZGVyVGV4dCA9IHRoaXMuSG9tZVZpZXcubmFtZVxuXG4gICAgLy8gW3JvdXRlckxpbmtdPVwiWycvaG9tZSddXCIgW3F1ZXJ5UGFyYW1zXT1cInt2aWV3OidwYXJhbSd9XCJcbiAgICB0aGlzLmFjdGl2YXRlZFJvdXRlLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xuICAgICAgY29uc3QgdmlldyA9IHBhcmFtc1sndmlldyddXG5cbiAgICAgIHRoaXMuaGFuZGxlVmlld1BhcmFtKHZpZXcpXG4gICAgfSlcbiAgfVxuXG4gIC8vIERpc3BsYXkgaG9tZSB2aWV3XG4gIHNob3dIb21lVmlldygpIHtcbiAgICB0aGlzLnNob3dQYWdlKHRoaXMuSG9tZVZpZXcuaWQpXG4gIH1cblxuICAvLyBEaXNwbGF5IGZyaWVuZHMgdmlld1xuICBzaG93RnJpZW5kc1ZpZXcoKSB7XG4gICAgdGhpcy5zaG93UGFnZSh0aGlzLkZyaWVuZHNWaWV3LmlkKVxuICB9XG5cbiAgLy8gRGlzcGxheSBwcm9maWxlIHZpZXdcbiAgc2hvd1Byb2ZpbGVWaWV3KCkge1xuICAgIHRoaXMuc2hvd1BhZ2UodGhpcy5Qcm9maWxlVmlldy5pZClcbiAgfVxuXG4gIC8vIERpc3BsYXkgdmlldyBieSBpZFxuICBzaG93UGFnZShfaWQ6IG51bWJlcikge1xuICAgIHRoaXMuaGlkZUFsbFZpZXdzKClcbiAgICBzd2l0Y2ggKF9pZCkge1xuICAgICAgY2FzZSAyOlxuICAgICAgICB0aGlzLkZyaWVuZHNWaWV3LmN1cnJlbnQgPSB0cnVlXG4gICAgICAgIHRoaXMuaGVhZGVyVGV4dCA9IHRoaXMuRnJpZW5kc1ZpZXcubmFtZVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAzOlxuICAgICAgICB0aGlzLlByb2ZpbGVWaWV3LmN1cnJlbnQgPSB0cnVlXG4gICAgICAgIHRoaXMuaGVhZGVyVGV4dCA9IHRoaXMuUHJvZmlsZVZpZXcubmFtZVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5Ib21lVmlldy5jdXJyZW50ID0gdHJ1ZVxuICAgICAgICB0aGlzLmhlYWRlclRleHQgPSB0aGlzLkhvbWVWaWV3Lm5hbWVcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICAvLyBIaWRlIGFsbCBob21lIHZpZXdzXG4gIGhpZGVBbGxWaWV3cygpIHtcbiAgICB0aGlzLnZpZXdzLmZvckVhY2goZnVuY3Rpb24odmlldykge1xuICAgICAgdmlldy5jdXJyZW50ID0gZmFsc2VcbiAgICB9KVxuICB9XG5cbiAgLy8gRGlzcGxheSB2aWV3cyBiYXNlZCBvbiB1cmwgcGFyYW1cbiAgaGFuZGxlVmlld1BhcmFtKHBhcmFtOiBzdHJpbmcpIHtcbiAgICBzd2l0Y2ggKHBhcmFtKSB7XG4gICAgICBjYXNlICdwcm9maWxlJzpcbiAgICAgICAgdGhpcy5zaG93UHJvZmlsZVZpZXcoKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnY29ubmVjdGlvbnMnOlxuICAgICAgICB0aGlzLnNob3dGcmllbmRzVmlldygpXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnNob3dIb21lVmlldygpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG59XG4iXX0=