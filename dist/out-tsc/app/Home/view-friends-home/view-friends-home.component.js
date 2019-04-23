"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/common/http");
var user_service_1 = require("../../Core/_services/user.service");
var messaging_service_1 = require("../../Core/_services/messaging.service");
var app_component_1 = require("../../app.component");
var auth_service_1 = require("../../Core/_services/auth.service");
var ViewFriendsHomeComponent = /** @class */ (function () {
    //
    // ─── CONSTRUCTOR ────────────────────────────────────────────────────────────────
    //
    function ViewFriendsHomeComponent(http, formBuilder, _userService, _msgService, app, authService) {
        this.http = http;
        this.formBuilder = formBuilder;
        this._userService = _userService;
        this._msgService = _msgService;
        this.app = app;
        this.authService = authService;
        // Field for connection
        this.connectionToAdd = new forms_1.FormControl('');
        this.AllView = { id: 1, name: 'All', current: false };
        this.OnlineView = { id: 2, name: 'Online', current: false };
        this.PendingView = { id: 3, name: 'Pending', current: false };
        this.SearchView = { id: 4, name: 'Search', current: false };
        this.views = [this.AllView, this.OnlineView, this.PendingView, this.SearchView];
    }
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── ADD CONNECTION ─────────────────────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.addConnection = function () {
        var userId = '00udacjrnsj15ezNA356';
        this._userService.inviteConnection(userId).toPromise().then(function (user) {
            console.log(user);
        });
        // console.log(this.connectionToAdd.value)
        // // Get okta user by login (email)
        // this.http.get(`${environment.apiUrl}/okta/GetUserByLogin/${this.connectionToAdd.value}` )
        // .toPromise()
        // .then((oktaUser) => {
        //   console.log(oktaUser)
        //   // Get the user from Chatkit by matching the IDs
        //   this.http.get(`${environment.apiUrl}/chatkit/GetUserById/${oktaUser['id']}`)
        //   .toPromise()
        //   .then((currentUser) => {
        //     // Found user => add 'connection request marker' to custom data field
        //     // TODO: Check if users are already connected
        //   })
        //   .catch((error) => {
        //     console.log('Chatkit user not found!')
        //   })
        // })
        // .catch((error) => {
        //   console.log('Okta user not found!')
        // })
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── RETURN USER FROM FRIEND LIST ───────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.getUser = function (_id) {
        return this.connections.find(function (c) { return c.id === _id; });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── SORT CONNECTIONS LIST ──────────────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.sortList = function (users) {
        return users.sort(function (a, b) { return ((a.firstName.toLowerCase() + ' ' + a.lastName.toLowerCase())
            > (b.firstName.toLowerCase() + ' ' + b.lastName.toLowerCase()) ? 1 : -1); });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── CHECK IF USERS ARE FRIENDS ─────────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.isConnected = function (_id) {
        // Get current user data
        // Check if this user is on the other user's connections list
        // Toggle isConnection variable
        return;
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── SET ALL VIEW CURRENT ATTRIBUTE TO FALSE ─────────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.setViewsToFalse = function () {
        this.views.forEach(function (view) {
            view.current = false;
        });
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── SET CLICKED VIEW TO TRUE ─────────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.setView = function (_view) {
        this.setViewsToFalse();
        _view.current = true;
    };
    // ─────────────────────────────────────────────────────────────────
    ViewFriendsHomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.AllView.current = true;
        this._msgService.getOnlineUsers().subscribe(function (userAndState) {
            console.log(userAndState);
        });
        this.authService.getCurrentUser().subscribe(function (user) {
            _this.currentUser = user;
            _this._userService.getConnections(user.id)
                .toPromise()
                .then(function (connections) {
                _this.connections = connections;
                console.log(connections);
            });
        });
    };
    ViewFriendsHomeComponent = __decorate([
        core_1.Component({
            selector: 'app-view-friends-home',
            templateUrl: './view-friends-home.component.html',
            styleUrls: ['./view-friends-home.component.css']
        }),
        __metadata("design:paramtypes", [http_1.HttpClient,
            forms_1.FormBuilder,
            user_service_1.UserService,
            messaging_service_1.MessagingService,
            app_component_1.AppComponent,
            auth_service_1.AuthService])
    ], ViewFriendsHomeComponent);
    return ViewFriendsHomeComponent;
}());
exports.ViewFriendsHomeComponent = ViewFriendsHomeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy1mcmllbmRzLWhvbWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9Ib21lL3ZpZXctZnJpZW5kcy1ob21lL3ZpZXctZnJpZW5kcy1ob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFpRDtBQUNqRCx3Q0FBd0Y7QUFDeEYsNkNBQWlEO0FBRWpELGtFQUErRDtBQUMvRCw0RUFBeUU7QUFDekUscURBQWtEO0FBQ2xELGtFQUErRDtBQVEvRDtJQW1CRSxFQUFFO0lBQ0YsbUZBQW1GO0lBQ25GLEVBQUU7SUFFQSxrQ0FBb0IsSUFBZ0IsRUFDMUIsV0FBd0IsRUFDeEIsWUFBeUIsRUFDekIsV0FBNkIsRUFDN0IsR0FBaUIsRUFDakIsV0FBd0I7UUFMZCxTQUFJLEdBQUosSUFBSSxDQUFZO1FBQzFCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQ3pCLGdCQUFXLEdBQVgsV0FBVyxDQUFrQjtRQUM3QixRQUFHLEdBQUgsR0FBRyxDQUFjO1FBQ2pCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBeEJwQyx1QkFBdUI7UUFDdkIsb0JBQWUsR0FBRyxJQUFJLG1CQUFXLENBQUMsRUFBRSxDQUFDLENBQUE7UUFPckMsWUFBTyxHQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQTtRQUN0RCxlQUFVLEdBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFBO1FBQzVELGdCQUFXLEdBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFBO1FBQzlELGVBQVUsR0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUE7UUFFNUQsVUFBSyxHQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBVzFDLENBQUM7SUFDekMsbUZBQW1GO0lBRW5GLEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUVBLGdEQUFhLEdBQWI7UUFDRSxJQUFNLE1BQU0sR0FBRyxzQkFBc0IsQ0FBQTtRQUNyQyxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUk7WUFDL0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNuQixDQUFDLENBQUMsQ0FBQTtRQUVGLDBDQUEwQztRQUMxQyxvQ0FBb0M7UUFDcEMsNEZBQTRGO1FBQzVGLGVBQWU7UUFDZix3QkFBd0I7UUFDeEIsMEJBQTBCO1FBQzFCLHFEQUFxRDtRQUNyRCxpRkFBaUY7UUFDakYsaUJBQWlCO1FBQ2pCLDZCQUE2QjtRQUM3Qiw0RUFBNEU7UUFDNUUsb0RBQW9EO1FBRXBELE9BQU87UUFDUCx3QkFBd0I7UUFDeEIsNkNBQTZDO1FBQzdDLE9BQU87UUFDUCxLQUFLO1FBQ0wsc0JBQXNCO1FBQ3RCLHdDQUF3QztRQUN4QyxLQUFLO0lBQ1AsQ0FBQztJQUNILG9FQUFvRTtJQUlwRSxFQUFFO0lBQ0YsbUZBQW1GO0lBQ25GLEVBQUU7SUFFRiwwQ0FBTyxHQUFQLFVBQVEsR0FBVztRQUNqQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLEVBQVosQ0FBWSxDQUFDLENBQUE7SUFDakQsQ0FBQztJQUNELG1GQUFtRjtJQUduRixFQUFFO0lBQ0YsbUZBQW1GO0lBQ25GLEVBQUU7SUFFRiwyQ0FBUSxHQUFSLFVBQVMsS0FBVTtRQUNqQixPQUFRLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7Y0FDeEYsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFEM0MsQ0FDMkMsQ0FBQyxDQUFBO0lBQzNFLENBQUM7SUFDRCxtRkFBbUY7SUFHbkYsRUFBRTtJQUNGLG1GQUFtRjtJQUNuRixFQUFFO0lBRUYsOENBQVcsR0FBWCxVQUFZLEdBQVc7UUFDckIsd0JBQXdCO1FBRXhCLDZEQUE2RDtRQUU3RCwrQkFBK0I7UUFFL0IsT0FBTTtJQUNSLENBQUM7SUFDRCxvRUFBb0U7SUFFcEUsRUFBRTtJQUNGLGdHQUFnRztJQUNoRyxFQUFFO0lBRUYsa0RBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSTtZQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtRQUN0QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxvRUFBb0U7SUFFcEUsRUFBRTtJQUNGLGlGQUFpRjtJQUNqRixFQUFFO0lBRUYsMENBQU8sR0FBUCxVQUFRLEtBQVc7UUFDakIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFBO1FBQ3RCLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO0lBQ3RCLENBQUM7SUFDRCxvRUFBb0U7SUFFcEUsMkNBQVEsR0FBUjtRQUFBLGlCQWlCQztRQWhCQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7UUFFM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBQyxZQUFZO1lBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDM0IsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFDLElBQUk7WUFDL0MsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7WUFFdkIsS0FBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztpQkFDeEMsU0FBUyxFQUFFO2lCQUNYLElBQUksQ0FBQyxVQUFDLFdBQVc7Z0JBQ2hCLEtBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO2dCQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQzFCLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBN0lVLHdCQUF3QjtRQUxwQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHVCQUF1QjtZQUNqQyxXQUFXLEVBQUUsb0NBQW9DO1lBQ2pELFNBQVMsRUFBRSxDQUFDLG1DQUFtQyxDQUFDO1NBQ2pELENBQUM7eUNBd0I0QixpQkFBVTtZQUNiLG1CQUFXO1lBQ1YsMEJBQVc7WUFDWixvQ0FBZ0I7WUFDeEIsNEJBQVk7WUFDSiwwQkFBVztPQTVCekIsd0JBQXdCLENBOElwQztJQUFELCtCQUFDO0NBQUEsQUE5SUQsSUE4SUM7QUE5SVksNERBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHsgTmdGb3JtLCBGb3JtR3JvdXAsIEZvcm1CdWlsZGVyLCBWYWxpZGF0b3JzLCBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJ1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJ1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi8uLi8uLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQucHJvZCdcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvdXNlci5zZXJ2aWNlJ1xuaW1wb3J0IHsgTWVzc2FnaW5nU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL21lc3NhZ2luZy5zZXJ2aWNlJ1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYXBwLmNvbXBvbmVudCdcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJ1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4uLy4uL0NvcmUvX21vZGVscy92aWV3J1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtdmlldy1mcmllbmRzLWhvbWUnLFxuICB0ZW1wbGF0ZVVybDogJy4vdmlldy1mcmllbmRzLWhvbWUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi92aWV3LWZyaWVuZHMtaG9tZS5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgVmlld0ZyaWVuZHNIb21lQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjb25uZWN0aW9uczogYW55XG5cbiAgLy8gRmllbGQgZm9yIGNvbm5lY3Rpb25cbiAgY29ubmVjdGlvblRvQWRkID0gbmV3IEZvcm1Db250cm9sKCcnKVxuICBzdWJzY3JpcHRpb246IGFueVxuICByb29tczogYW55XG5cbiAgY3VycmVudFVzZXI6IGFueVxuICBvbmxpbmVVc2VyczogYW55XG5cbiAgQWxsVmlldzogVmlldyA9IHsgaWQ6IDEsIG5hbWU6ICdBbGwnLCBjdXJyZW50OiBmYWxzZSB9XG4gIE9ubGluZVZpZXc6IFZpZXcgPSB7IGlkOiAyLCBuYW1lOiAnT25saW5lJywgY3VycmVudDogZmFsc2UgfVxuICBQZW5kaW5nVmlldzogVmlldyA9IHsgaWQ6IDMsIG5hbWU6ICdQZW5kaW5nJywgY3VycmVudDogZmFsc2UgfVxuICBTZWFyY2hWaWV3OiBWaWV3ID0geyBpZDogNCwgbmFtZTogJ1NlYXJjaCcsIGN1cnJlbnQ6IGZhbHNlIH1cblxuICB2aWV3czogVmlld1tdID0gW3RoaXMuQWxsVmlldywgdGhpcy5PbmxpbmVWaWV3LCB0aGlzLlBlbmRpbmdWaWV3LCB0aGlzLlNlYXJjaFZpZXddXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIENPTlNUUlVDVE9SIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgICAgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXG4gICAgICBwcml2YXRlIF91c2VyU2VydmljZTogVXNlclNlcnZpY2UsXG4gICAgICBwcml2YXRlIF9tc2dTZXJ2aWNlOiBNZXNzYWdpbmdTZXJ2aWNlLFxuICAgICAgcHJpdmF0ZSBhcHA6IEFwcENvbXBvbmVudCxcbiAgICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlKSB7IH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEFERCBDT05ORUNUSU9OIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgYWRkQ29ubmVjdGlvbigpIHtcbiAgICAgIGNvbnN0IHVzZXJJZCA9ICcwMHVkYWNqcm5zajE1ZXpOQTM1NidcbiAgICAgIHRoaXMuX3VzZXJTZXJ2aWNlLmludml0ZUNvbm5lY3Rpb24odXNlcklkKS50b1Byb21pc2UoKS50aGVuKCh1c2VyKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKHVzZXIpXG4gICAgICB9KVxuXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNvbm5lY3Rpb25Ub0FkZC52YWx1ZSlcbiAgICAgIC8vIC8vIEdldCBva3RhIHVzZXIgYnkgbG9naW4gKGVtYWlsKVxuICAgICAgLy8gdGhpcy5odHRwLmdldChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L29rdGEvR2V0VXNlckJ5TG9naW4vJHt0aGlzLmNvbm5lY3Rpb25Ub0FkZC52YWx1ZX1gIClcbiAgICAgIC8vIC50b1Byb21pc2UoKVxuICAgICAgLy8gLnRoZW4oKG9rdGFVc2VyKSA9PiB7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKG9rdGFVc2VyKVxuICAgICAgLy8gICAvLyBHZXQgdGhlIHVzZXIgZnJvbSBDaGF0a2l0IGJ5IG1hdGNoaW5nIHRoZSBJRHNcbiAgICAgIC8vICAgdGhpcy5odHRwLmdldChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2NoYXRraXQvR2V0VXNlckJ5SWQvJHtva3RhVXNlclsnaWQnXX1gKVxuICAgICAgLy8gICAudG9Qcm9taXNlKClcbiAgICAgIC8vICAgLnRoZW4oKGN1cnJlbnRVc2VyKSA9PiB7XG4gICAgICAvLyAgICAgLy8gRm91bmQgdXNlciA9PiBhZGQgJ2Nvbm5lY3Rpb24gcmVxdWVzdCBtYXJrZXInIHRvIGN1c3RvbSBkYXRhIGZpZWxkXG4gICAgICAvLyAgICAgLy8gVE9ETzogQ2hlY2sgaWYgdXNlcnMgYXJlIGFscmVhZHkgY29ubmVjdGVkXG5cbiAgICAgIC8vICAgfSlcbiAgICAgIC8vICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdDaGF0a2l0IHVzZXIgbm90IGZvdW5kIScpXG4gICAgICAvLyAgIH0pXG4gICAgICAvLyB9KVxuICAgICAgLy8gLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgLy8gICBjb25zb2xlLmxvZygnT2t0YSB1c2VyIG5vdCBmb3VuZCEnKVxuICAgICAgLy8gfSlcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgUkVUVVJOIFVTRVIgRlJPTSBGUklFTkQgTElTVCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICBnZXRVc2VyKF9pZDogbnVtYmVyKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9ucy5maW5kKGMgPT4gYy5pZCA9PT0gX2lkKVxuICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIFNPUlQgQ09OTkVDVElPTlMgTElTVCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICBzb3J0TGlzdCh1c2VyczogYW55KSB7XG4gICAgcmV0dXJuICB1c2Vycy5zb3J0KChhLCBiKSA9PiAoKGEuZmlyc3ROYW1lLnRvTG93ZXJDYXNlKCkgKyAnICcgKyBhLmxhc3ROYW1lLnRvTG93ZXJDYXNlKCkpXG4gICAgPiAoYi5maXJzdE5hbWUudG9Mb3dlckNhc2UoKSArICcgJyArIGIubGFzdE5hbWUudG9Mb3dlckNhc2UoKSkgPyAxIDogLTEpKVxuICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIENIRUNLIElGIFVTRVJTIEFSRSBGUklFTkRTIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gIGlzQ29ubmVjdGVkKF9pZDogbnVtYmVyKSB7XG4gICAgLy8gR2V0IGN1cnJlbnQgdXNlciBkYXRhXG5cbiAgICAvLyBDaGVjayBpZiB0aGlzIHVzZXIgaXMgb24gdGhlIG90aGVyIHVzZXIncyBjb25uZWN0aW9ucyBsaXN0XG5cbiAgICAvLyBUb2dnbGUgaXNDb25uZWN0aW9uIHZhcmlhYmxlXG5cbiAgICByZXR1cm5cbiAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICAvL1xuICAvLyDilIDilIDilIAgU0VUIEFMTCBWSUVXIENVUlJFTlQgQVRUUklCVVRFIFRPIEZBTFNFIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gIHNldFZpZXdzVG9GYWxzZSgpIHtcbiAgICB0aGlzLnZpZXdzLmZvckVhY2goZnVuY3Rpb24odmlldykge1xuICAgICAgdmlldy5jdXJyZW50ID0gZmFsc2VcbiAgICB9KVxuICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBTRVQgQ0xJQ0tFRCBWSUVXIFRPIFRSVUUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgc2V0VmlldyhfdmlldzogVmlldykge1xuICAgIHRoaXMuc2V0Vmlld3NUb0ZhbHNlKClcbiAgICBfdmlldy5jdXJyZW50ID0gdHJ1ZVxuICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuQWxsVmlldy5jdXJyZW50ID0gdHJ1ZVxuXG4gICAgdGhpcy5fbXNnU2VydmljZS5nZXRPbmxpbmVVc2VycygpLnN1YnNjcmliZSgodXNlckFuZFN0YXRlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh1c2VyQW5kU3RhdGUpXG4gICAgfSlcblxuICAgIHRoaXMuYXV0aFNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKS5zdWJzY3JpYmUoKHVzZXIpID0+IHtcbiAgICAgIHRoaXMuY3VycmVudFVzZXIgPSB1c2VyXG5cbiAgICAgIHRoaXMuX3VzZXJTZXJ2aWNlLmdldENvbm5lY3Rpb25zKHVzZXIuaWQpXG4gICAgICAudG9Qcm9taXNlKClcbiAgICAgIC50aGVuKChjb25uZWN0aW9ucykgPT4ge1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zID0gY29ubmVjdGlvbnNcbiAgICAgICAgY29uc29sZS5sb2coY29ubmVjdGlvbnMpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==