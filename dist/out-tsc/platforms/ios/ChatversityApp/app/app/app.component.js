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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL2FwcC9hcHAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDhEQUE0RDtBQUU1RCwwQ0FBeUM7QUFDekMsMERBQW1EO0FBQ25ELHdFQUFzRTtBQVV0RTtJQUtFLG9CQUFvQjtJQUVwQixzQkFDWSxNQUFjLEVBQ2QscUJBQWtDLEVBQ2xDLE9BQWlCLEVBQ2pCLGdCQUFrQztRQUo5QyxpQkFRQztRQVBXLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCwwQkFBcUIsR0FBckIscUJBQXFCLENBQWE7UUFDbEMsWUFBTyxHQUFQLE9BQU8sQ0FBVTtRQUNqQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBVDlDLFVBQUssR0FBRyxhQUFhLENBQUM7UUFDdEIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQVViLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQztRQUM1RSwrRUFBK0U7SUFDakYsQ0FBQztJQUVELEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUVBLDZCQUFNLEdBQU47UUFDRSxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFDSCxtRkFBbUY7SUFJbkYsSUFBSTtJQUNKLCtGQUErRjtJQUMvRixJQUFJO0lBRUYsNkNBQXNCLEdBQXRCO1FBQ0UsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxRQUFRO2VBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLFNBQVM7ZUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssU0FBUztlQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxXQUFXO2VBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLE1BQU0sRUFBRTtZQUM3QixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0gscUZBQXFGO0lBSXJGLCtCQUFRLEdBQVI7UUFDRSw2REFBNkQ7UUFDN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsRUFBRSxrQ0FBa0MsQ0FBQyxDQUFDO1FBRTdFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU1QywwQkFBMEI7UUFDMUIsZ0RBQWdEO1FBQ2hELHNCQUFzQjtRQUN0Qiw0QkFBNEI7UUFDNUIseUJBQXlCO1FBQ3pCLG1DQUFtQztRQUNuQyx3Q0FBd0M7UUFDeEMsMkJBQTJCO1FBQzNCLDJCQUEyQjtRQUMzQixZQUFZO1FBQ1osVUFBVTtRQUNWLFFBQVE7UUFFUixnREFBZ0Q7UUFDaEQsMEJBQTBCO1FBQzFCLFFBQVE7UUFFUixtQ0FBbUM7UUFDbkMsSUFBSTtJQUNOLENBQUM7SUF6RVUsWUFBWTtRQVB4QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFVBQVU7WUFDcEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSxzQkFBc0I7WUFDbkMsU0FBUyxFQUFFLENBQUMsc0JBQXNCLENBQUM7U0FDcEMsQ0FBQzt5Q0FVb0IsZUFBTTtZQUNTLDBCQUFXO1lBQ3pCLHlCQUFRO1lBQ0Msb0NBQWdCO09BWG5DLFlBQVksQ0EwRXhCO0lBQUQsbUJBQUM7Q0FBQSxBQTFFRCxJQTBFQztBQTFFWSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL0NvcmUvX21vZGVscy91c2VyJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBTd1VwZGF0ZSB9IGZyb20gJ0Bhbmd1bGFyL3NlcnZpY2Utd29ya2VyJztcbmltcG9ydCB7IE1lc3NhZ2luZ1NlcnZpY2UgfSBmcm9tICcuL0NvcmUvX3NlcnZpY2VzL21lc3NhZ2luZy5zZXJ2aWNlJztcblxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtcm9vdCcsXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHRlbXBsYXRlVXJsOiAnLi9hcHAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9hcHAuY29tcG9uZW50LnNjc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGN1cnJlbnRVc2VyOiBhbnk7XG4gIHRpdGxlID0gJ0NoYXR2ZXJzaXR5JztcbiAgdXBkYXRlID0gZmFsc2U7XG4gIGN1cnJVc2VyOiBhbnk7XG4gIC8vIGNoYXRraXRVc2VyOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgICAgcHJpdmF0ZSBhdXRoZW50aWNhdGlvblNlcnZpY2U6IEF1dGhTZXJ2aWNlLFxuICAgICAgcHJpdmF0ZSB1cGRhdGVzOiBTd1VwZGF0ZSxcbiAgICAgIHByaXZhdGUgbWVzc2FnaW5nU2VydmljZTogTWVzc2FnaW5nU2VydmljZVxuICApIHtcbiAgICB0aGlzLmF1dGhlbnRpY2F0aW9uU2VydmljZS5jdXJyZW50VXNlci5zdWJzY3JpYmUoeCA9PiB0aGlzLmN1cnJlbnRVc2VyID0geCk7XG4gICAgLy8gdGhpcy5hdXRoZW50aWNhdGlvblNlcnZpY2UuY2hhdGtpdFVzZXIuc3Vic2NyaWJlKHkgPT4gdGhpcy5jaGF0a2l0VXNlciA9IHkpO1xuICB9XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIExPR09VVCBVU0VSIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgbG9nb3V0KCkge1xuICAgICAgdGhpcy5hdXRoZW50aWNhdGlvblNlcnZpY2UubG9nb3V0KCk7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy9sb2dpbiddKTtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvLyAhXG4gIC8vICEg4pSA4pSA4pSAIEZPUiBURVNUSU5HIE9OTFkgLSBVU0UgVEhJUyBGVU5DVElPTiBUTyBSRU1PVkUgVEhFIE5BVkJBUiBPTiBQQUdFUyBUSEFUIERPIE5PVCBORUVEIElUXG4gIC8vICFcblxuICAgIFJlbW92ZU5hdmJhckZvclRlc3RpbmcoKSB7XG4gICAgICBpZiAodGhpcy5yb3V0ZXIudXJsID09PSAnL2xvZ2luJ1xuICAgICAgfHwgdGhpcy5yb3V0ZXIudXJsID09PSAnL3NpZ251cCdcbiAgICAgIHx8IHRoaXMucm91dGVyLnVybCA9PT0gJy9mb3Jnb3QnXG4gICAgICB8fCB0aGlzLnJvdXRlci51cmwgPT09ICcvbmV3LXVzZXInXG4gICAgICB8fCB0aGlzLnJvdXRlci51cmwgPT09ICcvNDA0Jykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgLy8gISDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gdGhpcy5jdXJyZW50VXNlciA9IHRoaXMuYXV0aGVudGljYXRpb25TZXJ2aWNlLmN1cnJlbnRVc2VyO1xuICAgIGNvbnNvbGUubG9nKCclY1dlbGNvbWUgdG8gQ2hhdHZlcnNpdHkhJywgJ2ZvbnQtc2l6ZTogMjBweDsgY29sb3I6ICMxODZmYTA7Jyk7XG5cbiAgICBjb25zb2xlLmxvZygnT0tUQSBVU0VSOicsIHRoaXMuY3VycmVudFVzZXIpO1xuXG4gICAgLy8gaWYgKHRoaXMuY3VycmVudFVzZXIpIHtcbiAgICAvLyAgIHRoaXMubWVzc2FnaW5nU2VydmljZS5jaGF0TWFuYWdlci5jb25uZWN0KClcbiAgICAvLyAgIC50aGVuKCh1c2VyKSA9PiB7XG4gICAgLy8gICAgIHRoaXMuY3VyclVzZXIgPSB1c2VyO1xuICAgIC8vICAgICBjb25zb2xlLmxvZyh1c2VyKTtcbiAgICAvLyAgICAgdXNlci5yb29tcy5mb3JFYWNoKHJvb20gPT4ge1xuICAgIC8vICAgICAgIHVzZXIuc3Vic2NyaWJlVG9Sb29tTXVsdGlwYXJ0KHtcbiAgICAvLyAgICAgICAgIHJvb21JZDogcm9vbS5pZCxcbiAgICAvLyAgICAgICAgIG1lc3NhZ2VMaW1pdDogMTBcbiAgICAvLyAgICAgICB9KTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICB9KTtcblxuICAgIC8vICAgdGhpcy51cGRhdGVzLmF2YWlsYWJsZS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgIC8vICAgICB0aGlzLnVwZGF0ZSA9IHRydWU7XG4gICAgLy8gICB9KTtcblxuICAgIC8vICAgY29uc29sZS5sb2codGhpcy5jdXJyZW50VXNlcik7XG4gICAgLy8gfVxuICB9XG59XG4iXX0=