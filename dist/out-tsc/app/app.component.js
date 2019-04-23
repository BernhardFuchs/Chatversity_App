"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var auth_service_1 = require("./Core/_services/auth.service");
var router_1 = require("@angular/router");
var service_worker_1 = require("@angular/service-worker");
var messaging_service_1 = require("./Core/_services/messaging.service");
var AppComponent = /** @class */ (function () {
    // chatkitUser: any;
    function AppComponent(router, authService, updates, messageService) {
        this.router = router;
        this.authService = authService;
        this.updates = updates;
        this.messageService = messageService;
        this.title = 'Chatversity';
        this.update = false;
    }
    //
    // ─── LOGOUT USER ────────────────────────────────────────────────────────────────
    //
    AppComponent.prototype.logout = function () {
        this.authService.logout();
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
        var _this = this;
        console.log('%cWelcome to Chatversity!', 'font-size: 20px; color: #186fa0;');
        console.log('Initializing app');
        this.authService.getCurrentUser().subscribe(function (user) {
            _this.currentUser = user;
            // if (user) { this.currentUser = user; return } else {
            //   this.messageService.initChatkit(this.authService.getUserId())
            // }
            console.log(user);
        });
        //   this.messageService.initChatkit(this.authService.getUserId())
        //   .then(chatkitUser => {
        //     console.log('got chatkit user');
        //     console.log(chatkitUser);
        //     this.authService.currentUser = chatkitUser;
        //     this.currentUser = chatkitUser;
        //     console.log(this.authService.currentUser);
        // });
        console.log('User Logged In: ' + this.authService.userLoggedIn());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFpRDtBQUNqRCw4REFBMkQ7QUFFM0QsMENBQXdDO0FBQ3hDLDBEQUFrRDtBQUNsRCx3RUFBcUU7QUFVckU7SUFNRSxvQkFBb0I7SUFFcEIsc0JBQ1ksTUFBYyxFQUNkLFdBQXdCLEVBQ3hCLE9BQWlCLEVBQ2pCLGNBQWdDO1FBSGhDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixZQUFPLEdBQVAsT0FBTyxDQUFVO1FBQ2pCLG1CQUFjLEdBQWQsY0FBYyxDQUFrQjtRQVY1QyxVQUFLLEdBQUcsYUFBYSxDQUFBO1FBQ3JCLFdBQU0sR0FBRyxLQUFLLENBQUE7SUFTaUMsQ0FBQztJQUVoRCxFQUFFO0lBQ0YsbUZBQW1GO0lBQ25GLEVBQUU7SUFFQSw2QkFBTSxHQUFOO1FBQ0UsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUMzQixDQUFDO0lBQ0gsbUZBQW1GO0lBSW5GLElBQUk7SUFDSiwrRkFBK0Y7SUFDL0YsSUFBSTtJQUVGLDZDQUFzQixHQUF0QjtRQUNFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssUUFBUTtlQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxTQUFTO2VBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLFNBQVM7ZUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssV0FBVztlQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxNQUFNLEVBQUU7WUFDN0IsT0FBTyxLQUFLLENBQUE7U0FDYjtRQUVELE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUNILHFGQUFxRjtJQUlyRiwrQkFBUSxHQUFSO1FBQUEsaUJBd0JDO1FBdkJDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsa0NBQWtDLENBQUMsQ0FBQTtRQUM1RSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUE7UUFFL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBQyxJQUFJO1lBRS9DLEtBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO1lBQ3ZCLHVEQUF1RDtZQUN2RCxrRUFBa0U7WUFDbEUsSUFBSTtZQUVKLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDbkIsQ0FBQyxDQUFDLENBQUE7UUFFSixrRUFBa0U7UUFDbEUsMkJBQTJCO1FBQzNCLHVDQUF1QztRQUN2QyxnQ0FBZ0M7UUFDaEMsa0RBQWtEO1FBQ2xELHNDQUFzQztRQUN0QyxpREFBaUQ7UUFFakQsTUFBTTtRQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFBO0lBQ25FLENBQUM7SUFwRVUsWUFBWTtRQVB4QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFVBQVU7WUFDcEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSxzQkFBc0I7WUFDbkMsU0FBUyxFQUFFLENBQUMsc0JBQXNCLENBQUM7U0FDcEMsQ0FBQzt5Q0FXb0IsZUFBTTtZQUNELDBCQUFXO1lBQ2YseUJBQVE7WUFDRCxvQ0FBZ0I7T0FaakMsWUFBWSxDQXFFeEI7SUFBRCxtQkFBQztDQUFBLEFBckVELElBcUVDO0FBckVZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSdcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL0NvcmUvX21vZGVscy91c2VyJ1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJ1xuaW1wb3J0IHsgU3dVcGRhdGUgfSBmcm9tICdAYW5ndWxhci9zZXJ2aWNlLXdvcmtlcidcbmltcG9ydCB7IE1lc3NhZ2luZ1NlcnZpY2UgfSBmcm9tICcuL0NvcmUvX3NlcnZpY2VzL21lc3NhZ2luZy5zZXJ2aWNlJ1xuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1yb290JyxcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgdGVtcGxhdGVVcmw6ICcuL2FwcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2FwcC5jb21wb25lbnQuc2NzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgY3VycmVudFVzZXJMb2dnZWRJbjogYW55XG4gIHRpdGxlID0gJ0NoYXR2ZXJzaXR5J1xuICB1cGRhdGUgPSBmYWxzZVxuICBjdXJyVXNlcjogYW55XG4gIGN1cnJlbnRVc2VyOiBhbnlcbiAgLy8gY2hhdGtpdFVzZXI6IGFueTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgICBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSxcbiAgICAgIHByaXZhdGUgdXBkYXRlczogU3dVcGRhdGUsXG4gICAgICBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdpbmdTZXJ2aWNlKSB7fVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBMT0dPVVQgVVNFUiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIGxvZ291dCgpIHtcbiAgICAgIHRoaXMuYXV0aFNlcnZpY2UubG9nb3V0KClcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvLyAhXG4gIC8vICEg4pSA4pSA4pSAIEZPUiBURVNUSU5HIE9OTFkgLSBVU0UgVEhJUyBGVU5DVElPTiBUTyBSRU1PVkUgVEhFIE5BVkJBUiBPTiBQQUdFUyBUSEFUIERPIE5PVCBORUVEIElUXG4gIC8vICFcblxuICAgIFJlbW92ZU5hdmJhckZvclRlc3RpbmcoKSB7XG4gICAgICBpZiAodGhpcy5yb3V0ZXIudXJsID09PSAnL2xvZ2luJ1xuICAgICAgfHwgdGhpcy5yb3V0ZXIudXJsID09PSAnL3NpZ251cCdcbiAgICAgIHx8IHRoaXMucm91dGVyLnVybCA9PT0gJy9mb3Jnb3QnXG4gICAgICB8fCB0aGlzLnJvdXRlci51cmwgPT09ICcvbmV3LXVzZXInXG4gICAgICB8fCB0aGlzLnJvdXRlci51cmwgPT09ICcvNDA0Jykge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIC8vICEg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIG5nT25Jbml0KCkge1xuICAgIGNvbnNvbGUubG9nKCclY1dlbGNvbWUgdG8gQ2hhdHZlcnNpdHkhJywgJ2ZvbnQtc2l6ZTogMjBweDsgY29sb3I6ICMxODZmYTA7JylcbiAgICBjb25zb2xlLmxvZygnSW5pdGlhbGl6aW5nIGFwcCcpXG5cbiAgICB0aGlzLmF1dGhTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCkuc3Vic2NyaWJlKCh1c2VyKSA9PiB7XG5cbiAgICAgIHRoaXMuY3VycmVudFVzZXIgPSB1c2VyXG4gICAgICAvLyBpZiAodXNlcikgeyB0aGlzLmN1cnJlbnRVc2VyID0gdXNlcjsgcmV0dXJuIH0gZWxzZSB7XG4gICAgICAvLyAgIHRoaXMubWVzc2FnZVNlcnZpY2UuaW5pdENoYXRraXQodGhpcy5hdXRoU2VydmljZS5nZXRVc2VySWQoKSlcbiAgICAgIC8vIH1cblxuICAgICAgY29uc29sZS5sb2codXNlcilcbiAgICB9KVxuXG4gIC8vICAgdGhpcy5tZXNzYWdlU2VydmljZS5pbml0Q2hhdGtpdCh0aGlzLmF1dGhTZXJ2aWNlLmdldFVzZXJJZCgpKVxuICAvLyAgIC50aGVuKGNoYXRraXRVc2VyID0+IHtcbiAgLy8gICAgIGNvbnNvbGUubG9nKCdnb3QgY2hhdGtpdCB1c2VyJyk7XG4gIC8vICAgICBjb25zb2xlLmxvZyhjaGF0a2l0VXNlcik7XG4gIC8vICAgICB0aGlzLmF1dGhTZXJ2aWNlLmN1cnJlbnRVc2VyID0gY2hhdGtpdFVzZXI7XG4gIC8vICAgICB0aGlzLmN1cnJlbnRVc2VyID0gY2hhdGtpdFVzZXI7XG4gIC8vICAgICBjb25zb2xlLmxvZyh0aGlzLmF1dGhTZXJ2aWNlLmN1cnJlbnRVc2VyKTtcblxuICAvLyB9KTtcbiAgICBjb25zb2xlLmxvZygnVXNlciBMb2dnZWQgSW46ICcgKyB0aGlzLmF1dGhTZXJ2aWNlLnVzZXJMb2dnZWRJbigpKVxuICB9XG59XG4iXX0=