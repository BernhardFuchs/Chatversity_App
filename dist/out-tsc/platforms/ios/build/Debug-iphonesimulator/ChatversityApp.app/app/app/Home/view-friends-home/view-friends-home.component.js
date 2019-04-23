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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy1mcmllbmRzLWhvbWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC9hcHAvSG9tZS92aWV3LWZyaWVuZHMtaG9tZS92aWV3LWZyaWVuZHMtaG9tZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFDbEQsd0NBQXlGO0FBRXpGLDZDQUFrRDtBQUNsRCwyRUFBcUU7QUFDckUsa0VBQWdFO0FBQ2hFLDRFQUEwRTtBQUMxRSxxREFBbUQ7QUFDbkQsa0VBQWdFO0FBT2hFO0lBa0JFLEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUVBLGtDQUFvQixJQUFnQixFQUMxQixXQUF3QixFQUN4QixZQUF5QixFQUN6QixXQUE2QixFQUM3QixHQUFpQixFQUNqQixLQUFrQjtRQUw1QixpQkEyQkc7UUEzQmlCLFNBQUksR0FBSixJQUFJLENBQVk7UUFDMUIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsaUJBQVksR0FBWixZQUFZLENBQWE7UUFDekIsZ0JBQVcsR0FBWCxXQUFXLENBQWtCO1FBQzdCLFFBQUcsR0FBSCxHQUFHLENBQWM7UUFDakIsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQXhCOUIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBR2xCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBSXJCLHVCQUF1QjtRQUN2QixvQkFBZSxHQUFHLElBQUksbUJBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQWdCaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQ25ELFVBQUMsSUFBSTtZQUNILEtBQUksQ0FBQyxXQUFXLEdB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eyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdGb3JtLCBGb3JtR3JvdXAsIEZvcm1CdWlsZGVyLCBWYWxpZGF0b3JzLCBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi8uLi9Db3JlL19tb2RlbHMvdXNlcic7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi8uLi8uLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQucHJvZCc7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL3VzZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNZXNzYWdpbmdTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvbWVzc2FnaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYXBwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC12aWV3LWZyaWVuZHMtaG9tZScsXG4gIHRlbXBsYXRlVXJsOiAnLi92aWV3LWZyaWVuZHMtaG9tZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3ZpZXctZnJpZW5kcy1ob21lLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBWaWV3RnJpZW5kc0hvbWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHNlYXJjaEZvcm06IEZvcm1Hcm91cDtcbiAgbG9hZGluZyA9IGZhbHNlO1xuICBzdWJtaXR0ZWQgPSBmYWxzZTtcbiAgY29ubmVjdGlvbnM6IGFueTtcbiAgY29ubmVjdGlvbjogVXNlcjtcbiAgaXNDb25uZWN0aW9uID0gZmFsc2U7XG4gIGN1cnJVc2VyOiBhbnk7XG4gIGFwcFVzZXI6IGFueTtcbiAgcmVzdWx0czogVXNlcltdO1xuICAvLyBGaWVsZCBmb3IgY29ubmVjdGlvblxuICBjb25uZWN0aW9uVG9BZGQgPSBuZXcgRm9ybUNvbnRyb2woJycpO1xuICBzdWJzY3JpcHRpb246IGFueTtcbiAgY2hhdGtpdFVzZXI6IGFueTtcbiAgcm9vbXM6IGFueTtcblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBDT05TVFJVQ1RPUiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcbiAgICAgIHByaXZhdGUgZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLFxuICAgICAgcHJpdmF0ZSBfdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlLFxuICAgICAgcHJpdmF0ZSBfbXNnU2VydmljZTogTWVzc2FnaW5nU2VydmljZSxcbiAgICAgIHByaXZhdGUgYXBwOiBBcHBDb21wb25lbnQsXG4gICAgICBwcml2YXRlIF9hdXRoOiBBdXRoU2VydmljZSkge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuX2F1dGguY2hhdGtpdFVzZXIkLnN1YnNjcmliZShcbiAgICAgICAgICAodXNlcikgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGF0a2l0VXNlciA9IHVzZXI7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNoYXRraXRVc2VyKTtcbiAgICAgICAgICAgIHRoaXMucm9vbXMgPSB1c2VyLnJvb21zO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5yb29tcyk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIHRoaXMuaW5jb21pbmdNZXNzYWdlcyA9IHRoaXMuX2F1dGgubWVzc2FnZXMkLnN1YnNjcmliZShcbiAgICAgICAgLy8gICAoaW5jb21pbmdNZXNzYWdlKSA9PiB7XG4gICAgICAgIC8vICAgICB0aGlzLnJvb21fbWVzc2FnZXMucHVzaChpbmNvbWluZ01lc3NhZ2UpO1xuICAgICAgICAvLyAgIH1cbiAgICAgICAgLy8gKTtcblxuICAgICAgICAvLyB0aGlzLmN1cnJlbnRfcm9vbSA9IHRoaXMuX2F1dGguY3VycmVudFJvb20kLnN1YnNjcmliZShcbiAgICAgICAgLy8gICAoY3VycmVudFJvb20pID0+IHtcbiAgICAgICAgLy8gICAgIHRoaXMuY3VycmVudF9yb29tID0gY3VycmVudFJvb207XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhjdXJyZW50Um9vbSk7XG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyApO1xuICAgICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIENPTlZFTklFTkNFIEdFVFRFUiBGT1IgRUFTWSBBQ0NFU1MgVE8gRk9STSBGSUVMRFMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBnZXQgZigpIHsgcmV0dXJuIHRoaXMuc2VhcmNoRm9ybS5jb250cm9sczsgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEFERCBDT05ORUNUSU9OIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgYWRkQ29ubmVjdGlvbigpIHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuY29ubmVjdGlvblRvQWRkLnZhbHVlKTtcbiAgICAgIC8vIEdldCBva3RhIHVzZXIgYnkgbG9naW4gKGVtYWlsKVxuICAgICAgdGhpcy5odHRwLmdldChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L29rdGEvR2V0VXNlckJ5TG9naW4vJHt0aGlzLmNvbm5lY3Rpb25Ub0FkZC52YWx1ZX1gIClcbiAgICAgIC50b1Byb21pc2UoKVxuICAgICAgLnRoZW4oKG9rdGFVc2VyKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKG9rdGFVc2VyKTtcbiAgICAgICAgLy8gR2V0IHRoZSB1c2VyIGZyb20gQ2hhdGtpdCBieSBtYXRjaGluZyB0aGUgSURzXG4gICAgICAgIHRoaXMuaHR0cC5nZXQoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9jaGF0a2l0L0dldFVzZXJCeUlkLyR7b2t0YVVzZXJbJ2lkJ119YClcbiAgICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAgIC50aGVuKChjaGF0a2l0VXNlcikgPT4ge1xuICAgICAgICAgIC8vIEZvdW5kIHVzZXIgPT4gYWRkICdjb25uZWN0aW9uIHJlcXVlc3QgbWFya2VyJyB0byBjdXN0b20gZGF0YSBmaWVsZFxuICAgICAgICAgIC8vIFRPRE86IENoZWNrIGlmIHVzZXJzIGFyZSBhbHJlYWR5IGNvbm5lY3RlZFxuXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnQ2hhdGtpdCB1c2VyIG5vdCBmb3VuZCEnKTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnT2t0YSB1c2VyIG5vdCBmb3VuZCEnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBSRVRVUk4gVVNFUiBGUk9NIEZSSUVORCBMSVNUIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgZ2V0VXNlcihfaWQ6IG51bWJlcik6IFVzZXIge1xuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbnMuZmluZChjID0+IGMuaWQgPT09IF9pZCk7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBTT1JUIENPTk5FQ1RJT05TIExJU1Qg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBzb3J0TGlzdCh1c2VyczogVXNlcltdKSB7XG4gICAgICByZXR1cm4gIHVzZXJzLnNvcnQoKGEsIGIpID0+ICgoYS5maXJzdE5hbWUudG9Mb3dlckNhc2UoKSArICcgJyArIGEubGFzdE5hbWUudG9Mb3dlckNhc2UoKSlcbiAgICAgID4gKGIuZmlyc3ROYW1lLnRvTG93ZXJDYXNlKCkgKyAnICcgKyBiLmxhc3ROYW1lLnRvTG93ZXJDYXNlKCkpID8gMSA6IC0xKSk7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEZJTFRFUiBMSVNUIE9GIFVTRVJTIEJZIE5BTUUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBnZXRVc2Vyc0J5TmFtZShfbmFtZTogc3RyaW5nKSB7XG4gICAgICBfbmFtZSA9IF9uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICB0aGlzLnJlc3VsdHMgPSB0aGlzLmNvbm5lY3Rpb25zLmZpbHRlcihjID0+XG4gICAgICAgIChjLmZpcnN0TmFtZS50b0xvd2VyQ2FzZSgpICsgJyAnICsgYy5sYXN0TmFtZS50b0xvd2VyQ2FzZSgpKS5pbmNsdWRlcyhfbmFtZSkpLnNsaWNlKDAsIDUpO1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBDSEVDSyBJRiBVU0VSUyBBUkUgRlJJRU5EUyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIGlzQ29ubmVjdGVkKF9pZDogbnVtYmVyKSB7XG4gICAgICAvLyBHZXQgY3VycmVudCB1c2VyIGRhdGFcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhpcyB1c2VyIGlzIG9uIHRoZSBvdGhlciB1c2VyJ3MgY29ubmVjdGlvbnMgbGlzdFxuXG4gICAgICAvLyBUb2dnbGUgaXNDb25uZWN0aW9uIHZhcmlhYmxlXG5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgSEFORExFIENMSUNLIFVTRVIgQlVUVE9OIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgc2V0VXNlcihfaWQ6IG51bWJlcikge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gdGhpcy5nZXRVc2VyKF9pZCk7XG4gICAgICB0aGlzLmlzQ29ubmVjdGVkKF9pZCk7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEhBTkRMRSBTSUdOIFVQIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgb25TZWFyY2goKSB7XG4gICAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICBpZiAodGhpcy5zZWFyY2hGb3JtLmludmFsaWQpIHtcbiAgICAgICAgdGhpcy5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcXVlcnk6IHN0cmluZyA9IHRoaXMuc2VhcmNoRm9ybS5nZXQoJ3NlYXJjaCcpLnZhbHVlO1xuXG4gICAgICB0aGlzLmdldFVzZXJzQnlOYW1lKHF1ZXJ5KTtcblxuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgbmdPbkluaXQoKSB7XG5cbiAgICAvL1xuICAgIC8vIOKUgOKUgOKUgCBMT0FEIFVTRVIgQ09OTkVDVElPTlMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gICAgLy9cblxuICAgICAgdGhpcy5fdXNlclNlcnZpY2UuZ2V0Q29ubmVjdGlvbnModGhpcy5jaGF0a2l0VXNlci5pZClcbiAgICAgIC50b1Byb21pc2UoKVxuICAgICAgLnRoZW4oKGNvbm5lY3Rpb25zKSA9PiB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMgPSBjb25uZWN0aW9ucztcbiAgICAgICAgY29uc29sZS5sb2coY29ubmVjdGlvbnMpO1xuICAgICAgfSk7XG4gICAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gICAgLy9cbiAgICAvLyDilIDilIDilIAgU0VUVVAgU0VBUkNIIEJPWCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgICAvL1xuXG4gICAgICB0aGlzLnNlYXJjaEZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgICAgc2VhcmNoOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgICB9KTtcbiAgICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICB9XG59XG4iXX0=