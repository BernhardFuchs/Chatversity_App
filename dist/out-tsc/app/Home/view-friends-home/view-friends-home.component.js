"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/common/http");
var environment_prod_1 = require("../../../environments/environment.prod");
var user_service_1 = require("../../Core/_services/user.service");
var messaging_service_1 = require("../../Core/_services/messaging.service");
var app_component_1 = require("../../app.component");
var auth_service_1 = require("../../Core/_services/auth.service");
var ViewFriendsHomeComponent = /** @class */ (function () {
    //
    // ─── CONSTRUCTOR ────────────────────────────────────────────────────────────────
    //
    function ViewFriendsHomeComponent(http, formBuilder, _userService, _msgService, app, _auth) {
        var _this = this;
        this.http = http;
        this.formBuilder = formBuilder;
        this._userService = _userService;
        this._msgService = _msgService;
        this.app = app;
        this._auth = _auth;
        this.loading = false;
        this.submitted = false;
        this.isConnection = false;
        // Field for connection
        this.connectionToAdd = new forms_1.FormControl('');
        this.subscription = this._auth.chatkitUser$.subscribe(function (user) {
            _this.chatkitUser = user;
            console.log(_this.chatkitUser);
            _this.rooms = user.rooms;
            console.log(_this.rooms);
        });
        // this.incomingMessages = this._auth.messages$.subscribe(
        //   (incomingMessage) => {
        //     this.room_messages.push(incomingMessage);
        //   }
        // );
        // this.current_room = this._auth.currentRoom$.subscribe(
        //   (currentRoom) => {
        //     this.current_room = currentRoom;
        //     console.log(currentRoom);
        //   }
        // );
    }
    Object.defineProperty(ViewFriendsHomeComponent.prototype, "f", {
        // ────────────────────────────────────────────────────────────────────────────────
        //
        // ─── CONVENIENCE GETTER FOR EASY ACCESS TO FORM FIELDS ──────────────────────────
        //
        get: function () { return this.searchForm.controls; },
        enumerable: true,
        configurable: true
    });
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── ADD CONNECTION ─────────────────────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.addConnection = function () {
        var _this = this;
        console.log(this.connectionToAdd.value);
        // Get okta user by login (email)
        this.http.get(environment_prod_1.environment.apiUrl + "/okta/GetUserByLogin/" + this.connectionToAdd.value)
            .toPromise()
            .then(function (oktaUser) {
            console.log(oktaUser);
            // Get the user from Chatkit by matching the IDs
            _this.http.get(environment_prod_1.environment.apiUrl + "/chatkit/GetUserById/" + oktaUser['id'])
                .toPromise()
                .then(function (chatkitUser) {
                // Found user => add 'connection request marker' to custom data field
                // TODO: Check if users are already connected
            })
                .catch(function (error) {
                console.log('Chatkit user not found!');
            });
        })
            .catch(function (error) {
            console.log('Okta user not found!');
        });
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
    // ─── FILTER LIST OF USERS BY NAME ───────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.getUsersByName = function (_name) {
        _name = _name.toLowerCase();
        this.results = this.connections.filter(function (c) {
            return (c.firstName.toLowerCase() + ' ' + c.lastName.toLowerCase()).includes(_name);
        }).slice(0, 5);
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
    // ─── HANDLE CLICK USER BUTTON ───────────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.setUser = function (_id) {
        this.connection = this.getUser(_id);
        this.isConnected(_id);
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── HANDLE SIGN UP ─────────────────────────────────────────────────────────────
    //
    ViewFriendsHomeComponent.prototype.onSearch = function () {
        this.submitted = true;
        this.loading = true;
        if (this.searchForm.invalid) {
            this.submitted = false;
            this.loading = false;
            return;
        }
        var query = this.searchForm.get('search').value;
        this.getUsersByName(query);
        this.loading = false;
    };
    // ────────────────────────────────────────────────────────────────────────────────
    ViewFriendsHomeComponent.prototype.ngOnInit = function () {
        //
        // ─── LOAD USER CONNECTIONS ───────────────────────────────────────
        //
        var _this = this;
        this._userService.getConnections(this.chatkitUser.id)
            .toPromise()
            .then(function (connections) {
            _this.connections = connections;
            console.log(connections);
        });
        // ────────────────────────────────────────────────────────────────────────────────
        //
        // ─── SETUP SEARCH BOX ────────────────────────────────────────────
        //
        this.searchForm = this.formBuilder.group({
            search: ['', forms_1.Validators.required]
        });
        // ─────────────────────────────────────────────────────────────────
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy1mcmllbmRzLWhvbWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9Ib21lL3ZpZXctZnJpZW5kcy1ob21lL3ZpZXctZnJpZW5kcy1ob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUNsRCx3Q0FBeUY7QUFFekYsNkNBQWtEO0FBQ2xELDJFQUFxRTtBQUNyRSxrRUFBZ0U7QUFDaEUsNEVBQTBFO0FBQzFFLHFEQUFtRDtBQUNuRCxrRUFBZ0U7QUFPaEU7SUFrQkUsRUFBRTtJQUNGLG1GQUFtRjtJQUNuRixFQUFFO0lBRUEsa0NBQW9CLElBQWdCLEVBQzFCLFdBQXdCLEVBQ3hCLFlBQXlCLEVBQ3pCLFdBQTZCLEVBQzdCLEdBQWlCLEVBQ2pCLEtBQWtCO1FBTDVCLGlCQTJCRztRQTNCaUIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUMxQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixpQkFBWSxHQUFaLFlBQVksQ0FBYTtRQUN6QixnQkFBVyxHQUFYLFdBQVcsQ0FBa0I7UUFDN0IsUUFBRyxHQUFILEdBQUcsQ0FBYztRQUNqQixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBeEI5QixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFHbEIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFJckIsdUJBQXVCO1FBQ3ZCLG9CQUFlLEdBQUcsSUFBSSxtQkFBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBZ0JoQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FDbkQsVUFBQyxJQUFJO1lBQ0gsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDOUIsS0FBSSxDQUFD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QUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUNILG1GQUFtRjtJQUluRiwyQ0FBUSxHQUFSO1FBRUUsRUFBRTtRQUNGLG9FQUFvRTtRQUNwRSxFQUFFO1FBSkosaUJBeUJDO1FBbkJHLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO2FBQ3BELFNBQVMsRUFBRTthQUNYLElBQUksQ0FBQyxVQUFDLFdBQVc7WUFDaEIsS0FBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztRQUNMLG1GQUFtRjtRQUluRixFQUFFO1FBQ0Ysb0VBQW9FO1FBQ3BFLEVBQUU7UUFFQSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQ3ZDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxrQkFBVSxDQUFDLFFBQVEsQ0FBQztTQUNsQyxDQUFDLENBQUM7UUFDTCxvRUFBb0U7SUFFdEUsQ0FBQztJQS9NVSx3QkFBd0I7UUFMcEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSx1QkFBdUI7WUFDakMsV0FBVyxFQUFFLG9DQUFvQztZQUNqRCxTQUFTLEVBQUUsQ0FBQyxtQ0FBbUMsQ0FBQztTQUNqRCxDQUFDO3lDQXVCNEIsaUJBQVU7WUFDYixtQkFBVztZQUNWLDBCQUFXO1lBQ1osb0NBQWdCO1lBQ3hCLDRCQUFZO1lBQ1YsMEJBQVc7T0EzQm5CLHdCQUF3QixDQWdOcEM7SUFBRCwrQkFBQztDQUFBLEFBaE5ELElBZ05DO0FBaE5ZLDREQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ0Zvcm0sIEZvcm1Hcm91cCwgRm9ybUJ1aWxkZXIsIFZhbGlkYXRvcnMsIEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uLy4uL0NvcmUvX21vZGVscy91c2VyJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uLy4uLy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudC5wcm9kJztcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvdXNlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1lc3NhZ2luZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9tZXNzYWdpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9hcHAuY29tcG9uZW50JztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXZpZXctZnJpZW5kcy1ob21lJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3ZpZXctZnJpZW5kcy1ob21lLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vdmlldy1mcmllbmRzLWhvbWUuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFZpZXdGcmllbmRzSG9tZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgc2VhcmNoRm9ybTogRm9ybUdyb3VwO1xuICBsb2FkaW5nID0gZmFsc2U7XG4gIHN1Ym1pdHRlZCA9IGZhbHNlO1xuICBjb25uZWN0aW9uczogYW55O1xuICBjb25uZWN0aW9uOiBVc2VyO1xuICBpc0Nvbm5lY3Rpb24gPSBmYWxzZTtcbiAgY3VyclVzZXI6IGFueTtcbiAgYXBwVXNlcjogYW55O1xuICByZXN1bHRzOiBVc2VyW107XG4gIC8vIEZpZWxkIGZvciBjb25uZWN0aW9uXG4gIGNvbm5lY3Rpb25Ub0FkZCA9IG5ldyBGb3JtQ29udHJvbCgnJyk7XG4gIHN1YnNjcmlwdGlvbjogYW55O1xuICBjaGF0a2l0VXNlcjogYW55O1xuICByb29tczogYW55O1xuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIENPTlNUUlVDVE9SIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgICAgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXG4gICAgICBwcml2YXRlIF91c2VyU2VydmljZTogVXNlclNlcnZpY2UsXG4gICAgICBwcml2YXRlIF9tc2dTZXJ2aWNlOiBNZXNzYWdpbmdTZXJ2aWNlLFxuICAgICAgcHJpdmF0ZSBhcHA6IEFwcENvbXBvbmVudCxcbiAgICAgIHByaXZhdGUgX2F1dGg6IEF1dGhTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5fYXV0aC5jaGF0a2l0VXNlciQuc3Vic2NyaWJlKFxuICAgICAgICAgICh1c2VyKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoYXRraXRVc2VyID0gdXNlcjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2hhdGtpdFVzZXIpO1xuICAgICAgICAgICAgdGhpcy5yb29tcyA9IHVzZXIucm9vbXM7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnJvb21zKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gdGhpcy5pbmNvbWluZ01lc3NhZ2VzID0gdGhpcy5fYXV0aC5tZXNzYWdlcyQuc3Vic2NyaWJlKFxuICAgICAgICAvLyAgIChpbmNvbWluZ01lc3NhZ2UpID0+IHtcbiAgICAgICAgLy8gICAgIHRoaXMucm9vbV9tZXNzYWdlcy5wdXNoKGluY29taW5nTWVzc2FnZSk7XG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyApO1xuXG4gICAgICAgIC8vIHRoaXMuY3VycmVudF9yb29tID0gdGhpcy5fYXV0aC5jdXJyZW50Um9vbSQuc3Vic2NyaWJlKFxuICAgICAgICAvLyAgIChjdXJyZW50Um9vbSkgPT4ge1xuICAgICAgICAvLyAgICAgdGhpcy5jdXJyZW50X3Jvb20gPSBjdXJyZW50Um9vbTtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGN1cnJlbnRSb29tKTtcbiAgICAgICAgLy8gICB9XG4gICAgICAgIC8vICk7XG4gICAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgQ09OVkVOSUVOQ0UgR0VUVEVSIEZPUiBFQVNZIEFDQ0VTUyBUTyBGT1JNIEZJRUxEUyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIGdldCBmKCkgeyByZXR1cm4gdGhpcy5zZWFyY2hGb3JtLmNvbnRyb2xzOyB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgQUREIENPTk5FQ1RJT04g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBhZGRDb25uZWN0aW9uKCkge1xuICAgICAgY29uc29sZS5sb2codGhpcy5jb25uZWN0aW9uVG9BZGQudmFsdWUpO1xuICAgICAgLy8gR2V0IG9rdGEgdXNlciBieSBsb2dpbiAoZW1haWwpXG4gICAgICB0aGlzLmh0dHAuZ2V0KGAke2Vudmlyb25tZW50LmFwaVVybH0vb2t0YS9HZXRVc2VyQnlMb2dpbi8ke3RoaXMuY29ubmVjdGlvblRvQWRkLnZhbHVlfWAgKVxuICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAudGhlbigob2t0YVVzZXIpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2cob2t0YVVzZXIpO1xuICAgICAgICAvLyBHZXQgdGhlIHVzZXIgZnJvbSBDaGF0a2l0IGJ5IG1hdGNoaW5nIHRoZSBJRHNcbiAgICAgICAgdGhpcy5odHRwLmdldChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2NoYXRraXQvR2V0VXNlckJ5SWQvJHtva3RhVXNlclsnaWQnXX1gKVxuICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgLnRoZW4oKGNoYXRraXRVc2VyKSA9PiB7XG4gICAgICAgICAgLy8gRm91bmQgdXNlciA9PiBhZGQgJ2Nvbm5lY3Rpb24gcmVxdWVzdCBtYXJrZXInIHRvIGN1c3RvbSBkYXRhIGZpZWxkXG4gICAgICAgICAgLy8gVE9ETzogQ2hlY2sgaWYgdXNlcnMgYXJlIGFscmVhZHkgY29ubmVjdGVkXG5cbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdDaGF0a2l0IHVzZXIgbm90IGZvdW5kIScpO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdPa3RhIHVzZXIgbm90IGZvdW5kIScpO1xuICAgICAgfSk7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIFJFVFVSTiBVU0VSIEZST00gRlJJRU5EIExJU1Qg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBnZXRVc2VyKF9pZDogbnVtYmVyKTogVXNlciB7XG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9ucy5maW5kKGMgPT4gYy5pZCA9PT0gX2lkKTtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIFNPUlQgQ09OTkVDVElPTlMgTElTVCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIHNvcnRMaXN0KHVzZXJzOiBVc2VyW10pIHtcbiAgICAgIHJldHVybiAgdXNlcnMuc29ydCgoYSwgYikgPT4gKChhLmZpcnN0TmFtZS50b0xvd2VyQ2FzZSgpICsgJyAnICsgYS5sYXN0TmFtZS50b0xvd2VyQ2FzZSgpKVxuICAgICAgPiAoYi5maXJzdE5hbWUudG9Mb3dlckNhc2UoKSArICcgJyArIGIubGFzdE5hbWUudG9Mb3dlckNhc2UoKSkgPyAxIDogLTEpKTtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgRklMVEVSIExJU1QgT0YgVVNFUlMgQlkgTkFNRSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIGdldFVzZXJzQnlOYW1lKF9uYW1lOiBzdHJpbmcpIHtcbiAgICAgIF9uYW1lID0gX25hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIHRoaXMucmVzdWx0cyA9IHRoaXMuY29ubmVjdGlvbnMuZmlsdGVyKGMgPT5cbiAgICAgICAgKGMuZmlyc3ROYW1lLnRvTG93ZXJDYXNlKCkgKyAnICcgKyBjLmxhc3ROYW1lLnRvTG93ZXJDYXNlKCkpLmluY2x1ZGVzKF9uYW1lKSkuc2xpY2UoMCwgNSk7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIENIRUNLIElGIFVTRVJTIEFSRSBGUklFTkRTIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgaXNDb25uZWN0ZWQoX2lkOiBudW1iZXIpIHtcbiAgICAgIC8vIEdldCBjdXJyZW50IHVzZXIgZGF0YVxuXG4gICAgICAvLyBDaGVjayBpZiB0aGlzIHVzZXIgaXMgb24gdGhlIG90aGVyIHVzZXIncyBjb25uZWN0aW9ucyBsaXN0XG5cbiAgICAgIC8vIFRvZ2dsZSBpc0Nvbm5lY3Rpb24gdmFyaWFibGVcblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBIQU5ETEUgQ0xJQ0sgVVNFUiBCVVRUT04g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBzZXRVc2VyKF9pZDogbnVtYmVyKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSB0aGlzLmdldFVzZXIoX2lkKTtcbiAgICAgIHRoaXMuaXNDb25uZWN0ZWQoX2lkKTtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgSEFORExFIFNJR04gVVAg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBvblNlYXJjaCgpIHtcbiAgICAgIHRoaXMuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG5cbiAgICAgIGlmICh0aGlzLnNlYXJjaEZvcm0uaW52YWxpZCkge1xuICAgICAgICB0aGlzLnN1Ym1pdHRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBxdWVyeTogc3RyaW5nID0gdGhpcy5zZWFyY2hGb3JtLmdldCgnc2VhcmNoJykudmFsdWU7XG5cbiAgICAgIHRoaXMuZ2V0VXNlcnNCeU5hbWUocXVlcnkpO1xuXG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICBuZ09uSW5pdCgpIHtcblxuICAgIC8vXG4gICAgLy8g4pSA4pSA4pSAIExPQUQgVVNFUiBDT05ORUNUSU9OUyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgICAvL1xuXG4gICAgICB0aGlzLl91c2VyU2VydmljZS5nZXRDb25uZWN0aW9ucyh0aGlzLmNoYXRraXRVc2VyLmlkKVxuICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAudGhlbigoY29ubmVjdGlvbnMpID0+IHtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucyA9IGNvbm5lY3Rpb25zO1xuICAgICAgICBjb25zb2xlLmxvZyhjb25uZWN0aW9ucyk7XG4gICAgICB9KTtcbiAgICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgICAvL1xuICAgIC8vIOKUgOKUgOKUgCBTRVRVUCBTRUFSQ0ggQk9YIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vXG5cbiAgICAgIHRoaXMuc2VhcmNoRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xuICAgICAgICBzZWFyY2g6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICAgIH0pO1xuICAgIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIH1cbn1cbiJdfQ==