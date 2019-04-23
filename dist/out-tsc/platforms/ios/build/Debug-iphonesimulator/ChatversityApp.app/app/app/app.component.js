"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var auth_service_1 = require("./Core/_services/auth.service");
var router_1 = require("@angular/router");
var service_worker_1 = require("@angular/service-worker");
var messaging_service_1 = require("./Core/_services/messaging.service");
var AppComponent = /** @class */ (function () {
    // chatkitUser: any;
    function AppComponent(router, authenticationService, updates, messagingService) {
        var _this = this;
        this.router = router;
        this.authenticationService = authenticationService;
        this.updates = updates;
        this.messagingService = messagingService;
        this.title = 'Chatversity';
        this.update = false;
        this.authenticationService.currentUser.subscribe(function (x) { return _this.currentUser = x; });
        // this.authenticationService.chatkitUser.subscribe(y => this.chatkitUser = y);
    }
    //
    // ─── LOGOUT USER ────────────────────────────────────────────────────────────────
    //
    AppComponent.prototype.logout = function () {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    };
    // ────────────────────────────────────────────────────────────────────────────────
    // !
    // ! ─── FOR TESTING ONLY - USE THIS FUNCTION TO REMOVE THE NAVBAR ON PAGES THAT DO NOT NEED IT
    // !
    AppComponent.prototype.RemoveNavbarForTesting = function () {
        if (this.router.url === '/login'
            || this.router.url === '/signup'
            || this.router.url === '/forgot'
            || this.router.url === '/new-user'
            || this.router.url === '/404') {
            return false;
        }
        return true;
    };
    // ! ────────────────────────────────────────────────────────────────────────────────
    AppComponent.prototype.ngOnInit = function () {
        // this.currentUser = this.authenticationService.currentUser;
        console.log('%cWelcome to Chatversity!', 'font-size: 20px; color: #186fa0;');
        console.log('OKTA USER:', this.currentUser);
        // if (this.currentUser) {
        //   this.messagingService.chatManager.connect()
        //   .then((user) => {
        //     this.currUser = user;
        //     console.log(user);
        //     user.rooms.forEach(room => {
        //       user.subscribeToRoomMultipart({
        //         roomId: room.id,
        //         messageLimit: 10
        //       });
        //     });
        //   });
        //   this.updates.available.subscribe(event => {
        //     this.update = true;
        //   });
        //   console.log(this.currentUser);
        // }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            moduleId: module.id,
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            auth_service_1.AuthService,
            service_worker_1.SwUpdate,
            messaging_service_1.MessagingService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvYXBwL2FwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFDbEQsOERBQTREO0FBRTVELDBDQUF5QztBQUN6QywwREFBbUQ7QUFDbkQsd0VBQXNFO0FBVXRFO0lBS0Usb0JBQW9CO0lBRXBCLHNCQUNZLE1BQWMsRUFDZCxxQkFBa0MsRUFDbEMsT0FBaUIsRUFDakIsZ0JBQWtDO1FBSjlDLGlCQVFDO1FBUFcsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBYTtRQUNsQyxZQUFPLEdBQVAsT0FBTyxDQUFVO1FBQ2pCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFUOUMsVUFBSyxHQUFHLGFBQWEsQ0FBQztRQUN0QixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBVWIsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO1FBQzVFLCtFQUErRTtJQUNqRixDQUFDO0lBRUQsRUFBRTtJQUNGLG1GQUFtRjtJQUNuRixFQUFFO0lBRUEsNkJBQU0sR0FBTjtRQUNFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUNILG1GQUFtRjtJQUluRixJQUFJO0lBQ0osK0ZBQStGO0lBQy9GLElBQUk7SUFFRiw2Q0FBc0IsR0FBdEI7UUFDRSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLFFBQVE7ZUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssU0FBUztlQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxTQUFTO2VBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLFdBQVc7ZUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssTUFBTSxFQUFFO1lBQzdCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDSCxxRkFBcUY7SUFJckYsK0JBQVEsR0FBUjtRQUNFLDZEQUE2RDtRQUM3RCxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixFQUFFLGtDQUFrQyxDQUFDLENBQUM7UUFFN0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTVDLDBCQUEwQjtRQUMxQixnREFBZ0Q7UUFDaEQsc0JBQXNCO1FBQ3RCLDRCQUE0QjtRQUM1Qix5QkFBeUI7UUFDekIsbUNBQW1DO1FBQ25DLHdDQUF3QztRQUN4QywyQkFBMkI7UUFDM0IsMkJBQTJCO1FBQzNCLFlBQVk7UUFDWixVQUFVO1FBQ1YsUUFBUTtRQUVSLGdEQUFnRDtRQUNoRCwwQkFBMEI7UUFDMUIsUUFBUTtRQUVSLG1DQUFtQztRQUNuQyxJQUFJO0lBQ04sQ0FBQztJQXpFVSxZQUFZO1FBUHhCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsVUFBVTtZQUNwQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHNCQUFzQjtZQUNuQyxTQUFTLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztTQUNwQyxDQUFDO3lDQVVvQixlQUFNO1lBQ1MsMEJBQVc7WUFDekIseUJBQVE7WUFDQyxvQ0FBZ0I7T0FYbkMsWUFBWSxDQTBFeEI7SUFBRCxtQkFBQztDQUFBLEFBMUVELElBMEVDO0FBMUVZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vQ29yZS9fbW9kZWxzL3VzZXInO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFN3VXBkYXRlIH0gZnJvbSAnQGFuZ3VsYXIvc2VydmljZS13b3JrZXInO1xuaW1wb3J0IHsgTWVzc2FnaW5nU2VydmljZSB9IGZyb20gJy4vQ29yZS9fc2VydmljZXMvbWVzc2FnaW5nLnNlcnZpY2UnO1xuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1yb290JyxcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgdGVtcGxhdGVVcmw6ICcuL2FwcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2FwcC5jb21wb25lbnQuc2NzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgY3VycmVudFVzZXI6IGFueTtcbiAgdGl0bGUgPSAnQ2hhdHZlcnNpdHknO1xuICB1cGRhdGUgPSBmYWxzZTtcbiAgY3VyclVzZXI6IGFueTtcbiAgLy8gY2hhdGtpdFVzZXI6IGFueTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgICBwcml2YXRlIGF1dGhlbnRpY2F0aW9uU2VydmljZTogQXV0aFNlcnZpY2UsXG4gICAgICBwcml2YXRlIHVwZGF0ZXM6IFN3VXBkYXRlLFxuICAgICAgcHJpdmF0ZSBtZXNzYWdpbmdTZXJ2aWNlOiBNZXNzYWdpbmdTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMuYXV0aGVudGljYXRpb25TZXJ2aWNlLmN1cnJlbnRVc2VyLnN1YnNjcmliZSh4ID0+IHRoaXMuY3VycmVudFVzZXIgPSB4KTtcbiAgICAvLyB0aGlzLmF1dGhlbnRpY2F0aW9uU2VydmljZS5jaGF0a2l0VXNlci5zdWJzY3JpYmUoeSA9PiB0aGlzLmNoYXRraXRVc2VyID0geSk7XG4gIH1cblxuICAvL1xuICAvLyDilIDilIDilIAgTE9HT1VUIFVTRVIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBsb2dvdXQoKSB7XG4gICAgICB0aGlzLmF1dGhlbnRpY2F0aW9uU2VydmljZS5sb2dvdXQoKTtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnL2xvZ2luJ10pO1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIC8vICFcbiAgLy8gISDilIDilIDilIAgRk9SIFRFU1RJTkcgT05MWSAtIFVTRSBUSElTIEZVTkNUSU9OIFRPIFJFTU9WRSBUSEUgTkFWQkFSIE9OIFBBR0VTIFRIQVQgRE8gTk9UIE5FRUQgSVRcbiAgLy8gIVxuXG4gICAgUmVtb3ZlTmF2YmFyRm9yVGVzdGluZygpIHtcbiAgICAgIGlmICh0aGlzLnJvdXRlci51cmwgPT09ICcvbG9naW4nXG4gICAgICB8fCB0aGlzLnJvdXRlci51cmwgPT09ICcvc2lnbnVwJ1xuICAgICAgfHwgdGhpcy5yb3V0ZXIudXJsID09PSAnL2ZvcmdvdCdcbiAgICAgIHx8IHRoaXMucm91dGVyLnVybCA9PT0gJy9uZXctdXNlcidcbiAgICAgIHx8IHRoaXMucm91dGVyLnVybCA9PT0gJy80MDQnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAvLyAhIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyB0aGlzLmN1cnJlbnRVc2VyID0gdGhpcy5hdXRoZW50aWNhdGlvblNlcnZpY2UuY3VycmVudFVzZXI7XG4gICAgY29uc29sZS5sb2coJyVjV2VsY29tZSB0byBDaGF0dmVyc2l0eSEnLCAnZm9udC1zaXplOiAyMHB4OyBjb2xvcjogIzE4NmZhMDsnKTtcblxuICAgIGNvbnNvbGUubG9nKCdPS1RBIFVTRVI6JywgdGhpcy5jdXJyZW50VXNlcik7XG5cbiAgICAvLyBpZiAodGhpcy5jdXJyZW50VXNlcikge1xuICAgIC8vICAgdGhpcy5tZXNzYWdpbmdTZXJ2aWNlLmNoYXRNYW5hZ2VyLmNvbm5lY3QoKVxuICAgIC8vICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAvLyAgICAgdGhpcy5jdXJyVXNlciA9IHVzZXI7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKHVzZXIpO1xuICAgIC8vICAgICB1c2VyLnJvb21zLmZvckVhY2gocm9vbSA9PiB7XG4gICAgLy8gICAgICAgdXNlci5zdWJzY3JpYmVUb1Jvb21NdWx0aXBhcnQoe1xuICAgIC8vICAgICAgICAgcm9vbUlkOiByb29tLmlkLFxuICAgIC8vICAgICAgICAgbWVzc2FnZUxpbWl0OiAxMFxuICAgIC8vICAgICAgIH0pO1xuICAgIC8vICAgICB9KTtcbiAgICAvLyAgIH0pO1xuXG4gICAgLy8gICB0aGlzLnVwZGF0ZXMuYXZhaWxhYmxlLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgLy8gICAgIHRoaXMudXBkYXRlID0gdHJ1ZTtcbiAgICAvLyAgIH0pO1xuXG4gICAgLy8gICBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRVc2VyKTtcbiAgICAvLyB9XG4gIH1cbn1cbiJdfQ==