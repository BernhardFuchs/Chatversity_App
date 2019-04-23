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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy1uYXZpZ2F0aW9uLWhvbWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC9hcHAvSG9tZS92aWV3LW5hdmlnYXRpb24taG9tZS92aWV3LW5hdmlnYXRpb24taG9tZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFFbEQsMENBQStEO0FBTy9EO0lBU0UscUNBQW9CLGNBQThCO1FBQTlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQVJsRCxhQUFRLEdBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQ2hFLGdCQUFXLEdBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQ25FLGdCQUFXLEdBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBRS9ELFVBQUssR0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFJZCxDQUFDO0lBRXZELDhDQUFRLEdBQVI7UUFBQSxpQkFVQztRQVRDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBRXJDLDBEQUEwRDtRQUMxRCxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNO1lBQzlDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUU1QixLQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG9CQUFvQjtJQUNwQixrREFBWSxHQUFaO1FBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCx1QkFBdUI7SUFDdkIscURBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsdUJBQXVCO0lBQ3ZCLHFEQUFlLEdBQWY7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELHFCQUFxQjtJQUNyQiw4Q0FBUSxHQUFSLFVBQVMsR0FBVztRQUNsQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsUUFBUSxHQUFHLEVBQUU7WUFDWCxLQUFLLENBQUM7Z0JBQ0osSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUNoQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUN4QyxNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztnQkFDeEMsTUFBTTtZQUNSO2dCQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDckMsTUFBTTtTQUNUO0lBQ0gsQ0FBQztJQUVELHNCQUFzQjtJQUN0QixrREFBWSxHQUFaO1FBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJO1lBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG1DQUFtQztJQUNuQyxxREFBZSxHQUFmLFVBQWdCLEtBQWE7UUFDM0IsUUFBUSxLQUFLLEVBQUU7WUFDYixLQUFLLFNBQVM7Z0JBQ1osSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN2QixNQUFNO1lBQ1IsS0FBSyxhQUFhO2dCQUNoQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU07WUFDUjtnQkFDRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3BCLE1BQU07U0FDVDtJQUNILENBQUM7SUE3RVUsMkJBQTJCO1FBTHZDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsMEJBQTBCO1lBQ3BDLFdBQVcsRUFBRSx1Q0FBdUM7WUFDcEQsU0FBUyxFQUFFLENBQUMsc0NBQXNDLENBQUM7U0FDcEQsQ0FBQzt5Q0FVb0MsdUJBQWM7T0FUdkMsMkJBQTJCLENBOEV2QztJQUFELGtDQUFDO0NBQUEsQUE5RUQsSUE4RUM7QUE5RVksa0VBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFZpZXcgfSBmcm9tICcuLi8uLi9Db3JlL19tb2RlbHMvdmlldyc7XG5pbXBvcnQge1JvdXRlciwgQWN0aXZhdGVkUm91dGUsIFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXZpZXctbmF2aWdhdGlvbi1ob21lJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3ZpZXctbmF2aWdhdGlvbi1ob21lLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vdmlldy1uYXZpZ2F0aW9uLWhvbWUuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFZpZXdOYXZpZ2F0aW9uSG9tZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEhvbWVWaWV3OiBWaWV3ID0geyBpZDogMSwgbmFtZTogJ0xhdGVzdCBOZXdzJywgY3VycmVudDogZmFsc2UgfTtcbiAgRnJpZW5kc1ZpZXc6IFZpZXcgPSB7IGlkOiAyLCBuYW1lOiAnQ29ubmVjdGlvbnMnLCBjdXJyZW50OiBmYWxzZSB9O1xuICBQcm9maWxlVmlldzogVmlldyA9IHsgaWQ6IDMsIG5hbWU6ICdQcm9maWxlJywgY3VycmVudDogZmFsc2UgfTtcblxuICB2aWV3czogVmlld1tdID0gW3RoaXMuSG9tZVZpZXcsIHRoaXMuRnJpZW5kc1ZpZXcsIHRoaXMuUHJvZmlsZVZpZXddO1xuXG4gIGhlYWRlclRleHQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5Ib21lVmlldy5jdXJyZW50ID0gdHJ1ZTtcbiAgICB0aGlzLmhlYWRlclRleHQgPSB0aGlzLkhvbWVWaWV3Lm5hbWU7XG5cbiAgICAvLyBbcm91dGVyTGlua109XCJbJy9ob21lJ11cIiBbcXVlcnlQYXJhbXNdPVwie3ZpZXc6J3BhcmFtJ31cIlxuICAgIHRoaXMuYWN0aXZhdGVkUm91dGUucXVlcnlQYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG4gICAgICBjb25zdCB2aWV3ID0gcGFyYW1zWyd2aWV3J107XG5cbiAgICAgIHRoaXMuaGFuZGxlVmlld1BhcmFtKHZpZXcpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRGlzcGxheSBob21lIHZpZXdcbiAgc2hvd0hvbWVWaWV3KCkge1xuICAgIHRoaXMuc2hvd1BhZ2UodGhpcy5Ib21lVmlldy5pZCk7XG4gIH1cblxuICAvLyBEaXNwbGF5IGZyaWVuZHMgdmlld1xuICBzaG93RnJpZW5kc1ZpZXcoKSB7XG4gICAgdGhpcy5zaG93UGFnZSh0aGlzLkZyaWVuZHNWaWV3LmlkKTtcbiAgfVxuXG4gIC8vIERpc3BsYXkgcHJvZmlsZSB2aWV3XG4gIHNob3dQcm9maWxlVmlldygpIHtcbiAgICB0aGlzLnNob3dQYWdlKHRoaXMuUHJvZmlsZVZpZXcuaWQpO1xuICB9XG5cbiAgLy8gRGlzcGxheSB2aWV3IGJ5IGlkXG4gIHNob3dQYWdlKF9pZDogbnVtYmVyKSB7XG4gICAgdGhpcy5oaWRlQWxsVmlld3MoKTtcbiAgICBzd2l0Y2ggKF9pZCkge1xuICAgICAgY2FzZSAyOlxuICAgICAgICB0aGlzLkZyaWVuZHNWaWV3LmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICB0aGlzLmhlYWRlclRleHQgPSB0aGlzLkZyaWVuZHNWaWV3Lm5hbWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICB0aGlzLlByb2ZpbGVWaWV3LmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICB0aGlzLmhlYWRlclRleHQgPSB0aGlzLlByb2ZpbGVWaWV3Lm5hbWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5Ib21lVmlldy5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oZWFkZXJUZXh0ID0gdGhpcy5Ib21lVmlldy5uYW1lO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBIaWRlIGFsbCBob21lIHZpZXdzXG4gIGhpZGVBbGxWaWV3cygpIHtcbiAgICB0aGlzLnZpZXdzLmZvckVhY2goZnVuY3Rpb24odmlldykge1xuICAgICAgdmlldy5jdXJyZW50ID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICAvLyBEaXNwbGF5IHZpZXdzIGJhc2VkIG9uIHVybCBwYXJhbVxuICBoYW5kbGVWaWV3UGFyYW0ocGFyYW06IHN0cmluZykge1xuICAgIHN3aXRjaCAocGFyYW0pIHtcbiAgICAgIGNhc2UgJ3Byb2ZpbGUnOlxuICAgICAgICB0aGlzLnNob3dQcm9maWxlVmlldygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Nvbm5lY3Rpb25zJzpcbiAgICAgICAgdGhpcy5zaG93RnJpZW5kc1ZpZXcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnNob3dIb21lVmlldygpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cbiJdfQ==