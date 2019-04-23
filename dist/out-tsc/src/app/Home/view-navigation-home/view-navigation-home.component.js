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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy1uYXZpZ2F0aW9uLWhvbWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9Ib21lL3ZpZXctbmF2aWdhdGlvbi1ob21lL3ZpZXctbmF2aWdhdGlvbi1ob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUVsRCwwQ0FBK0Q7QUFPL0Q7SUFTRSxxQ0FBb0IsY0FBOEI7UUFBOUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBUmxELGFBQVEsR0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDaEUsZ0JBQVcsR0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDbkUsZ0JBQVcsR0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFFL0QsVUFBSyxHQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUlkLENBQUM7SUFFdkQsOENBQVEsR0FBUjtRQUFBLGlCQVVDO1FBVEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFFckMsMERBQTBEO1FBQzFELElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU07WUFDOUMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTVCLEtBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsb0JBQW9CO0lBQ3BCLGtEQUFZLEdBQVo7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELHVCQUF1QjtJQUN2QixxREFBZSxHQUFmO1FBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCx1QkFBdUI7SUFDdkIscURBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQscUJBQXFCO0lBQ3JCLDhDQUFRLEdBQVIsVUFBUyxHQUFXO1FBQ2xCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixRQUFRLEdBQUcsRUFBRTtZQUNYLEtBQUssQ0FBQztnQkFDSixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7Z0JBQ3hDLE1BQU07WUFDUixLQUFLLENBQUM7Z0JBQ0osSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUNoQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUN4QyxNQUFNO1lBQ1I7Z0JBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUNyQyxNQUFNO1NBQ1Q7SUFDSCxDQUFDO0lBRUQsc0JBQXNCO0lBQ3RCLGtEQUFZLEdBQVo7UUFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFTLElBQUk7WUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLHFEQUFlLEdBQWYsVUFBZ0IsS0FBYTtRQUMzQixRQUFRLEtBQUssRUFBRTtZQUNiLEtBQUssU0FBUztnQkFDWixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU07WUFDUixLQUFLLGFBQWE7Z0JBQ2hCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDdkIsTUFBTTtZQUNSO2dCQUNFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDcEIsTUFBTTtTQUNUO0lBQ0gsQ0FBQztJQTdFVSwyQkFBMkI7UUFMdkMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSwwQkFBMEI7WUFDcEMsV0FBVyxFQUFFLHVDQUF1QztZQUNwRCxTQUFTLEVBQUUsQ0FBQyxzQ0FBc0MsQ0FBQztTQUNwRCxDQUFDO3lDQVVvQyx1QkFBYztPQVR2QywyQkFBMkIsQ0E4RXZDO0lBQUQsa0NBQUM7Q0FBQSxBQTlFRCxJQThFQztBQTlFWSxrRUFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4uLy4uL0NvcmUvX21vZGVscy92aWV3JztcbmltcG9ydCB7Um91dGVyLCBBY3RpdmF0ZWRSb3V0ZSwgUGFyYW1zfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtdmlldy1uYXZpZ2F0aW9uLWhvbWUnLFxuICB0ZW1wbGF0ZVVybDogJy4vdmlldy1uYXZpZ2F0aW9uLWhvbWUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi92aWV3LW5hdmlnYXRpb24taG9tZS5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgVmlld05hdmlnYXRpb25Ib21lQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgSG9tZVZpZXc6IFZpZXcgPSB7IGlkOiAxLCBuYW1lOiAnTGF0ZXN0IE5ld3MnLCBjdXJyZW50OiBmYWxzZSB9O1xuICBGcmllbmRzVmlldzogVmlldyA9IHsgaWQ6IDIsIG5hbWU6ICdDb25uZWN0aW9ucycsIGN1cnJlbnQ6IGZhbHNlIH07XG4gIFByb2ZpbGVWaWV3OiBWaWV3ID0geyBpZDogMywgbmFtZTogJ1Byb2ZpbGUnLCBjdXJyZW50OiBmYWxzZSB9O1xuXG4gIHZpZXdzOiBWaWV3W10gPSBbdGhpcy5Ib21lVmlldywgdGhpcy5GcmllbmRzVmlldywgdGhpcy5Qcm9maWxlVmlld107XG5cbiAgaGVhZGVyVGV4dDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLkhvbWVWaWV3LmN1cnJlbnQgPSB0cnVlO1xuICAgIHRoaXMuaGVhZGVyVGV4dCA9IHRoaXMuSG9tZVZpZXcubmFtZTtcblxuICAgIC8vIFtyb3V0ZXJMaW5rXT1cIlsnL2hvbWUnXVwiIFtxdWVyeVBhcmFtc109XCJ7dmlldzoncGFyYW0nfVwiXG4gICAgdGhpcy5hY3RpdmF0ZWRSb3V0ZS5xdWVyeVBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcbiAgICAgIGNvbnN0IHZpZXcgPSBwYXJhbXNbJ3ZpZXcnXTtcblxuICAgICAgdGhpcy5oYW5kbGVWaWV3UGFyYW0odmlldyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBEaXNwbGF5IGhvbWUgdmlld1xuICBzaG93SG9tZVZpZXcoKSB7XG4gICAgdGhpcy5zaG93UGFnZSh0aGlzLkhvbWVWaWV3LmlkKTtcbiAgfVxuXG4gIC8vIERpc3BsYXkgZnJpZW5kcyB2aWV3XG4gIHNob3dGcmllbmRzVmlldygpIHtcbiAgICB0aGlzLnNob3dQYWdlKHRoaXMuRnJpZW5kc1ZpZXcuaWQpO1xuICB9XG5cbiAgLy8gRGlzcGxheSBwcm9maWxlIHZpZXdcbiAgc2hvd1Byb2ZpbGVWaWV3KCkge1xuICAgIHRoaXMuc2hvd1BhZ2UodGhpcy5Qcm9maWxlVmlldy5pZCk7XG4gIH1cblxuICAvLyBEaXNwbGF5IHZpZXcgYnkgaWRcbiAgc2hvd1BhZ2UoX2lkOiBudW1iZXIpIHtcbiAgICB0aGlzLmhpZGVBbGxWaWV3cygpO1xuICAgIHN3aXRjaCAoX2lkKSB7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHRoaXMuRnJpZW5kc1ZpZXcuY3VycmVudCA9IHRydWU7XG4gICAgICAgIHRoaXMuaGVhZGVyVGV4dCA9IHRoaXMuRnJpZW5kc1ZpZXcubmFtZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIHRoaXMuUHJvZmlsZVZpZXcuY3VycmVudCA9IHRydWU7XG4gICAgICAgIHRoaXMuaGVhZGVyVGV4dCA9IHRoaXMuUHJvZmlsZVZpZXcubmFtZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLkhvbWVWaWV3LmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICB0aGlzLmhlYWRlclRleHQgPSB0aGlzLkhvbWVWaWV3Lm5hbWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIEhpZGUgYWxsIGhvbWUgdmlld3NcbiAgaGlkZUFsbFZpZXdzKCkge1xuICAgIHRoaXMudmlld3MuZm9yRWFjaChmdW5jdGlvbih2aWV3KSB7XG4gICAgICB2aWV3LmN1cnJlbnQgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIERpc3BsYXkgdmlld3MgYmFzZWQgb24gdXJsIHBhcmFtXG4gIGhhbmRsZVZpZXdQYXJhbShwYXJhbTogc3RyaW5nKSB7XG4gICAgc3dpdGNoIChwYXJhbSkge1xuICAgICAgY2FzZSAncHJvZmlsZSc6XG4gICAgICAgIHRoaXMuc2hvd1Byb2ZpbGVWaWV3KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29ubmVjdGlvbnMnOlxuICAgICAgICB0aGlzLnNob3dGcmllbmRzVmlldygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuc2hvd0hvbWVWaWV3KCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuIl19