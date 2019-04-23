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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUNsRCw4REFBNEQ7QUFFNUQsMENBQXlDO0FBQ3pDLDBEQUFtRDtBQUNuRCx3RUFBc0U7QUFVdEU7SUFLRSxvQkFBb0I7SUFFcEIsc0JBQ1ksTUFBYyxFQUNkLHFCQUFrQyxFQUNsQyxPQUFpQixFQUNqQixnQkFBa0M7UUFKOUMsaUJBUUM7UUFQVyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUFhO1FBQ2xDLFlBQU8sR0FBUCxPQUFPLENBQVU7UUFDakIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQVQ5QyxVQUFLLEdBQUcsYUFBYSxDQUFDO1FBQ3RCLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFVYixJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUM7UUFDNUUsK0VBQStFO0lBQ2pGLENBQUM7SUFFRCxFQUFFO0lBQ0YsbUZBQW1GO0lBQ25GLEVBQUU7SUFFQSw2QkFBTSxHQUFOO1FBQ0UsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQ0gsbUZBQW1GO0lBSW5GLElBQUk7SUFDSiwrRkFBK0Y7SUFDL0YsSUFBSTtJQUVGLDZDQUFzQixHQUF0QjtRQUNFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssUUFBUTtlQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxTQUFTO2VBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLFNBQVM7ZUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssV0FBVztlQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxNQUFNLEVBQUU7WUFDN0IsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNILHFGQUFxRjtJQUlyRiwrQkFBUSxHQUFSO1FBQ0UsNkRBQTZEO1FBQzdELE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztRQUU3RSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFNUMsMEJBQTBCO1FBQzFCLGdEQUFnRDtRQUNoRCxzQkFBc0I7UUFDdEIsNEJBQTRCO1FBQzVCLHlCQUF5QjtRQUN6QixtQ0FBbUM7UUFDbkMsd0NBQXdDO1FBQ3hDLDJCQUEyQjtRQUMzQiwyQkFBMkI7UUFDM0IsWUFBWTtRQUNaLFVBQVU7UUFDVixRQUFRO1FBRVIsZ0RBQWdEO1FBQ2hELDBCQUEwQjtRQUMxQixRQUFRO1FBRVIsbUNBQW1DO1FBQ25DLElBQUk7SUFDTixDQUFDO0lBekVVLFlBQVk7UUFQeEIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsc0JBQXNCO1lBQ25DLFNBQVMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO1NBQ3BDLENBQUM7eUNBVW9CLGVBQU07WUFDUywwQkFBVztZQUN6Qix5QkFBUTtZQUNDLG9DQUFnQjtPQVhuQyxZQUFZLENBMEV4QjtJQUFELG1CQUFDO0NBQUEsQUExRUQsSUEwRUM7QUExRVksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi9Db3JlL19tb2RlbHMvdXNlcic7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU3dVcGRhdGUgfSBmcm9tICdAYW5ndWxhci9zZXJ2aWNlLXdvcmtlcic7XG5pbXBvcnQgeyBNZXNzYWdpbmdTZXJ2aWNlIH0gZnJvbSAnLi9Db3JlL19zZXJ2aWNlcy9tZXNzYWdpbmcuc2VydmljZSc7XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXJvb3QnLFxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICB0ZW1wbGF0ZVVybDogJy4vYXBwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vYXBwLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBjdXJyZW50VXNlcjogYW55O1xuICB0aXRsZSA9ICdDaGF0dmVyc2l0eSc7XG4gIHVwZGF0ZSA9IGZhbHNlO1xuICBjdXJyVXNlcjogYW55O1xuICAvLyBjaGF0a2l0VXNlcjogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICAgIHByaXZhdGUgYXV0aGVudGljYXRpb25TZXJ2aWNlOiBBdXRoU2VydmljZSxcbiAgICAgIHByaXZhdGUgdXBkYXRlczogU3dVcGRhdGUsXG4gICAgICBwcml2YXRlIG1lc3NhZ2luZ1NlcnZpY2U6IE1lc3NhZ2luZ1NlcnZpY2VcbiAgKSB7XG4gICAgdGhpcy5hdXRoZW50aWNhdGlvblNlcnZpY2UuY3VycmVudFVzZXIuc3Vic2NyaWJlKHggPT4gdGhpcy5jdXJyZW50VXNlciA9IHgpO1xuICAgIC8vIHRoaXMuYXV0aGVudGljYXRpb25TZXJ2aWNlLmNoYXRraXRVc2VyLnN1YnNjcmliZSh5ID0+IHRoaXMuY2hhdGtpdFVzZXIgPSB5KTtcbiAgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBMT0dPVVQgVVNFUiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIGxvZ291dCgpIHtcbiAgICAgIHRoaXMuYXV0aGVudGljYXRpb25TZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvbG9naW4nXSk7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgLy8gIVxuICAvLyAhIOKUgOKUgOKUgCBGT1IgVEVTVElORyBPTkxZIC0gVVNFIFRISVMgRlVOQ1RJT04gVE8gUkVNT1ZFIFRIRSBOQVZCQVIgT04gUEFHRVMgVEhBVCBETyBOT1QgTkVFRCBJVFxuICAvLyAhXG5cbiAgICBSZW1vdmVOYXZiYXJGb3JUZXN0aW5nKCkge1xuICAgICAgaWYgKHRoaXMucm91dGVyLnVybCA9PT0gJy9sb2dpbidcbiAgICAgIHx8IHRoaXMucm91dGVyLnVybCA9PT0gJy9zaWdudXAnXG4gICAgICB8fCB0aGlzLnJvdXRlci51cmwgPT09ICcvZm9yZ290J1xuICAgICAgfHwgdGhpcy5yb3V0ZXIudXJsID09PSAnL25ldy11c2VyJ1xuICAgICAgfHwgdGhpcy5yb3V0ZXIudXJsID09PSAnLzQwNCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIC8vICEg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIHRoaXMuY3VycmVudFVzZXIgPSB0aGlzLmF1dGhlbnRpY2F0aW9uU2VydmljZS5jdXJyZW50VXNlcjtcbiAgICBjb25zb2xlLmxvZygnJWNXZWxjb21lIHRvIENoYXR2ZXJzaXR5IScsICdmb250LXNpemU6IDIwcHg7IGNvbG9yOiAjMTg2ZmEwOycpO1xuXG4gICAgY29uc29sZS5sb2coJ09LVEEgVVNFUjonLCB0aGlzLmN1cnJlbnRVc2VyKTtcblxuICAgIC8vIGlmICh0aGlzLmN1cnJlbnRVc2VyKSB7XG4gICAgLy8gICB0aGlzLm1lc3NhZ2luZ1NlcnZpY2UuY2hhdE1hbmFnZXIuY29ubmVjdCgpXG4gICAgLy8gICAudGhlbigodXNlcikgPT4ge1xuICAgIC8vICAgICB0aGlzLmN1cnJVc2VyID0gdXNlcjtcbiAgICAvLyAgICAgY29uc29sZS5sb2codXNlcik7XG4gICAgLy8gICAgIHVzZXIucm9vbXMuZm9yRWFjaChyb29tID0+IHtcbiAgICAvLyAgICAgICB1c2VyLnN1YnNjcmliZVRvUm9vbU11bHRpcGFydCh7XG4gICAgLy8gICAgICAgICByb29tSWQ6IHJvb20uaWQsXG4gICAgLy8gICAgICAgICBtZXNzYWdlTGltaXQ6IDEwXG4gICAgLy8gICAgICAgfSk7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vICAgfSk7XG5cbiAgICAvLyAgIHRoaXMudXBkYXRlcy5hdmFpbGFibGUuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAvLyAgICAgdGhpcy51cGRhdGUgPSB0cnVlO1xuICAgIC8vICAgfSk7XG5cbiAgICAvLyAgIGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFVzZXIpO1xuICAgIC8vIH1cbiAgfVxufVxuIl19