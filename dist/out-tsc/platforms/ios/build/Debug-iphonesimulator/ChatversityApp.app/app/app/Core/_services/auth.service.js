"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../../environments/environment");
var chatkit_client_1 = require("@pusher/chatkit-client");
var rxjs_1 = require("rxjs");
var messaging_service_1 = require("./messaging.service");
var flatted_1 = require("flatted");
var AuthService = /** @class */ (function () {
    function AuthService(http, _msgService) {
        var _this = this;
        this.http = http;
        this._msgService = _msgService;
        this.currentRoom = new rxjs_1.Subject();
        this.currentRoom$ = this.currentRoom.asObservable();
        this.messages = new rxjs_1.Subject();
        this.messages$ = this.messages.asObservable();
        this.currentUserSubject = new rxjs_1.Subject();
        this.currentUser = this.currentUserSubject.asObservable();
        this.user = new rxjs_1.Subject();
        this.user$ = this.user.asObservable();
        this.chatkitUser = new rxjs_1.Subject();
        this.chatkitUser$ = this.chatkitUser.asObservable();
        this.currentUserSubject = new rxjs_1.BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        // console.log('auth service constructed');
        this.user = new rxjs_1.BehaviorSubject(localStorage.getItem('chatkitUserId'));
        this.user$ = this.user.asObservable();
        // this.chatkitUser = new BehaviorSubject(localStorage.getItem('chatkitUser'));
        this.chatkitUser = new rxjs_1.ReplaySubject(1);
        this.chatkitUser$ = this.chatkitUser.asObservable();
        this.messages = new rxjs_1.ReplaySubject(1);
        this.messages$ = this.messages.asObservable();
        // Only called on login
        this.user$.subscribe(function (x) {
            // console.log(x);
            if (!x) {
                return;
            }
            _this.initChatkit(x);
        });
    }
    Object.defineProperty(AuthService.prototype, "currentUserValue", {
        get: function () {
            return this.currentUserSubject.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "userValue", {
        get: function () {
            return this.user;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "setUser", {
        set: function (user) { this.user.next(user); },
        enumerable: true,
        configurable: true
    });
    // public get chatkitUserValue() {
    //     return this.chatUserSubject.value;
    // }
    //
    // ─── SEND SIGN UP REQUEST TO SERVER ─────────────────────────────────────────────
    //
    AuthService.prototype.signup = function (fname, lname, university, username, password) {
        var _this = this;
        // Create Okta User
        return this.http.post(environment_1.environment.apiUrl + "/okta/signup", { fname: fname, lname: lname, username: username, password: password })
            .toPromise()
            .then(function (user) {
            // console.log(user);
            // Create chatkit user from Okta User ID
            return _this.http.post(environment_1.environment.apiUrl + "/chatkit/createuser", {
                id: user.id,
                name: user.profile.firstName + ' ' + user.profile.lastName,
                custom_data: {
                    connections: [],
                    connectionRequests: [],
                    bio: '',
                    university: university,
                    graduationYear: '',
                    interests: '',
                    clubs: '',
                    major: '',
                    privateAccount: false,
                    showActivityStatus: true,
                }
            })
                .toPromise()
                .then(function (chatkitUser) {
                // Created Chatkit user
                // console.log('Created Chatkit user!');
                console.log(chatkitUser);
                return _this.login(username, password).then(function (loggedinUser) {
                    return loggedinUser;
                });
            });
        });
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── VALIDATE LOGIN THROUGH OKTA ────────────────────────────────────────────────
    //
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        return this.http.post(environment_1.environment.apiUrl + "/okta/login", { username: username, password: password })
            .toPromise()
            .then(function (user) {
            _this.currentUser = user;
            console.log('LOGGED IN USER: ', user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            _this.currentUserSubject.next(user);
            localStorage.setItem('chatkitUserId', user._embedded.user.id);
            _this.user.next(user._embedded.user.id);
            return user;
        });
    };
    // ─────────────────────────────────────────────────────────────────
    AuthService.prototype.initChatkit = function (userId) {
        var _this = this;
        // console.log(userId);
        this.chatManager = new chatkit_client_1.ChatManager({
            instanceLocator: 'v1:us1:a54bdf12-93d6-46f9-be3b-bfa837917fb5',
            userId: userId,
            tokenProvider: new chatkit_client_1.TokenProvider({
                url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a54bdf12-93d6-46f9-be3b-bfa837917fb5/token'
            })
        });
        return this.chatManager.connect().then(function (user) {
            _this.chatkitUser.next(user);
            localStorage.setItem('chatkitUser', flatted_1.stringify(user));
            console.log("Connected as " + user.name);
            // If user has no rooms then return
            if (!user.rooms.length) {
                return user;
            }
            user.joinRoom({ roomId: user.rooms[0].id })
                .then(function (room) {
                _this.currentRoom.next(room);
                console.log("Joined room with ID: " + room.id);
            })
                .catch(function (err, room) {
                console.log("Error joining room " + room.id + ": " + err);
            });
            user.rooms.forEach(function (room) {
                user.subscribeToRoomMultipart({
                    roomId: room.id,
                    hooks: {
                        onMessage: function (message) {
                            _this.messages.next(message);
                            // console.log('Received message:', message);
                        }
                    }
                });
            });
            return user;
        });
    };
    //
    // ─── HANDLE LOGOUT ──────────────────────────────────────────────────────────────
    //
    AuthService.prototype.logout = function () {
        // TODO: Add logout function to authentication API - this is fine for now
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    };
    // ─────────────────────────────────────────────────────────────────
    AuthService.prototype.ngOnInit = function () {
        console.log(this.currentUserSubject.value);
        localStorage.setItem('chatkitUserId', null);
    };
    AuthService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient, messaging_service_1.MessagingService])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC9hcHAvQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQW1EO0FBQ25ELDZDQUFrRDtBQUNsRCxpRUFBZ0U7QUFDaEUseURBQW9FO0FBQ3BFLDZCQUFnRTtBQUNoRSx5REFBdUQ7QUFDdkQsbUNBQXlDO0FBR3pDO0lBa0JJLHFCQUFvQixJQUFnQixFQUFVLFdBQTZCO1FBQTNFLGlCQXlCQztRQXpCbUIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFrQjtRQWhCbkUsZ0JBQVcsR0FBUSxJQUFJLGNBQU8sRUFBRSxDQUFDO1FBQ2xDLGlCQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUU5QyxhQUFRLEdBQVEsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUMvQixjQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUV4Qyx1QkFBa0IsR0FBUSxJQUFJLGNBQU8sRUFBRSxDQUFDO1FBQ3pDLGdCQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBR3BELFNBQUksR0FBUSxJQUFJLGNBQU8sRUFBRSxDQUFDO1FBQzNCLFVBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRWhDLGdCQUFXLEdBQVEsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUNsQyxpQkFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7UUFJbEQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksc0JBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9GLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBRTFELDJDQUEyQztRQUUzQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksc0JBQWUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBR3RDLCtFQUErRTtRQUMvRSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksb0JBQWEsQ0FBUyxDQUFDLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFcEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLG9CQUFhLENBQVMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRTlDLHVCQUF1QjtRQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFDLENBQUM7WUFDbkIsa0JBQWtCO1lBQ2xCLElBQUksQ0FBQyxDQUFDLEVBQUU7Z0JBQUUsT0FBTzthQUFFO1lBRW5CLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsc0JBQVcseUNBQWdCO2FBQTNCO1lBQ0ksT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDO1FBQ3pDLENBQUM7OztPQUFBO0lBR0Qsc0JBQVcsa0NBQVM7YUFBcEI7WUFDSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDckIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyxnQ0FBTzthQUFsQixVQUFtQixJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUVsRCxrQ0FBa0M7SUFDbEMseUNBQXlDO0lBQ3pDLElBQUk7SUFHSixFQUFFO0lBQ0YsbUZBQW1GO0lBQ25GLEVBQUU7SUFFRSw0QkFBTSxHQUFOLFVBQU8sS0FBYSxFQUFFLEtBQWEsRUFBRSxVQUFrQixFQUFFLFFBQWdCLEVBQUUsUUFBZ0I7UUFBM0YsaUJBa0NDO1FBakNHLG1CQUFtQjtRQUNuQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFTLHlCQUFXLENBQUMsTUFBTSxpQkFBYyxFQUFFLEVBQUUsS0FBSyxPQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUUsUUFBUSxVQUFBLEVBQUUsUUFBUSxVQUFBLEVBQUUsQ0FBQzthQUNwRyxTQUFTLEVBQUU7YUFDWCxJQUFJLENBQUMsVUFBQyxJQUFJO1lBQ1AscUJBQXFCO1lBQ3JCLHdDQUF3QztZQUN4QyxPQUFPLEtBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFJLHlCQUFXLENBQUMsTUFBTSx3QkFBcUIsRUFBRTtnQkFDOUQsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNYLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRO2dCQUMxRCxXQUFXLEVBQUU7b0JBQ1QsV0FBVyxFQUFFLEVBQUU7b0JBQ2Ysa0JBQWtCLEVBQUUsRUFBRTtvQkFDdEIsR0FBRyxFQUFFLEVBQUU7b0JBQ1AsVUFBVSxFQUFFLFVBQVU7b0JBQ3RCLGNBQWMsRUFBRSxFQUFFO29CQUNsQixTQUFTLEVBQUUsRUFBRTtvQkFDYixLQUFLLEVBQUUsRUFBRTtvQkFDVCxLQUFLLEVBQUUsRUFBRTtvQkFDVCxjQUFjLEVBQUUsS0FBSztvQkFDckIsa0JBQWtCLEVBQUUsSUFBSTtpQkFDM0I7YUFDSixDQUFDO2lCQUNELFNBQVMsRUFBRTtpQkFDWCxJQUFJLENBQUMsVUFBQyxXQUFXO2dCQUNkLHVCQUF1QjtnQkFDdkIsd0NBQXdDO2dCQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUV6QixPQUFPLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFlBQVk7b0JBQ25ELE9BQU8sWUFBWSxDQUFDO2dCQUN4QixDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsb0VBQW9FO0lBSXBFLEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUVGLDJCQUFLLEdBQUwsVUFBTSxRQUFnQixFQUFFLFFBQWdCO1FBQXhDLGlCQWdCQztRQWZHLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQVMseUJBQVcsQ0FBQyxNQUFNLGdCQUFhLEVBQUUsRUFBRSxRQUFRLFVBQUEsRUFBRSxRQUFRLFVBQUEsRUFBRSxDQUFDO2FBQ3JGLFNBQVMsRUFBRTthQUNYLElBQUksQ0FBQyxVQUFDLElBQUk7WUFFUCxLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBRXRDLFlBQVksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxRCxLQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRW5DLFlBQVksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzlELEtBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXZDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNELG9FQUFvRTtJQUlwRSxpQ0FBVyxHQUFYLFVBQVksTUFBTTtRQUFsQixpQkF5Q0M7UUF4Q0csdUJBQXVCO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSw0QkFBVyxDQUFDO1lBQy9CLGVBQWUsRUFBRSw2Q0FBNkM7WUFDOUQsTUFBTSxFQUFFLE1BQU07WUFDZCxhQUFhLEVBQUUsSUFBSSw4QkFBYSxDQUFDO2dCQUMvQixHQUFHLEVBQUUsNkdBQTZHO2FBQ25ILENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtZQUN6QyxLQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixZQUFZLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxtQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBZ0IsSUFBSSxDQUFDLElBQU0sQ0FBQyxDQUFDO1lBRXpDLG1DQUFtQztZQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQUUsT0FBTyxJQUFJLENBQUM7YUFBRTtZQUV4QyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7aUJBQzFDLElBQUksQ0FBQyxVQUFBLElBQUk7Z0JBQ04sS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQXdCLElBQUksQ0FBQyxFQUFJLENBQUMsQ0FBQztZQUNuRCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLFVBQUMsR0FBRyxFQUFFLElBQUk7Z0JBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBc0IsSUFBSSxDQUFDLEVBQUUsVUFBSyxHQUFLLENBQUMsQ0FBQztZQUN2RCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtnQkFDbkIsSUFBSSxDQUFDLHdCQUF3QixDQUFDO29CQUMxQixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQ2YsS0FBSyxFQUFFO3dCQUNILFNBQVMsRUFBRSxVQUFBLE9BQU87NEJBQ2QsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7NEJBQzVCLDZDQUE2Qzt3QkFDakQsQ0FBQztxQkFDSjtpQkFDSixDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDO0lBSUQsRUFBRTtJQUNGLG1GQUFtRjtJQUNuRixFQUFFO0lBRUYsNEJBQU0sR0FBTjtRQUNJLHlFQUF5RTtRQUN6RSxpREFBaUQ7UUFDakQsWUFBWSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFDRCxvRUFBb0U7SUFFcEUsOEJBQVEsR0FBUjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLFlBQVksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUE3TFEsV0FBVztRQUR2QixpQkFBVSxFQUFFO3lDQW1CaUIsaUJBQVUsRUFBdUIsb0NBQWdCO09BbEJsRSxXQUFXLENBOEx2QjtJQUFELGtCQUFDO0NBQUEsQUE5TEQsSUE4TEM7QUE5TFksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uLy4uLy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBDaGF0TWFuYWdlciwgVG9rZW5Qcm92aWRlciB9IGZyb20gJ0BwdXNoZXIvY2hhdGtpdC1jbGllbnQnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBTdWJqZWN0LCBSZXBsYXlTdWJqZWN0LCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTWVzc2FnaW5nU2VydmljZSB9IGZyb20gJy4vbWVzc2FnaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHtwYXJzZSwgc3RyaW5naWZ5fSBmcm9tICdmbGF0dGVkJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIHByaXZhdGUgY3VycmVudFJvb206IGFueSA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIGN1cnJlbnRSb29tJCA9IHRoaXMuY3VycmVudFJvb20uYXNPYnNlcnZhYmxlKCk7XG5cbiAgICBwcml2YXRlIG1lc3NhZ2VzOiBhbnkgPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBtZXNzYWdlcyQgPSB0aGlzLm1lc3NhZ2VzLmFzT2JzZXJ2YWJsZSgpO1xuXG4gICAgcHJpdmF0ZSBjdXJyZW50VXNlclN1YmplY3Q6IGFueSA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIGN1cnJlbnRVc2VyID0gdGhpcy5jdXJyZW50VXNlclN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gICAgY2hhdE1hbmFnZXI6IGFueTtcblxuICAgIHByaXZhdGUgdXNlcjogYW55ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgdXNlciQgPSB0aGlzLnVzZXIuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICBwcml2YXRlIGNoYXRraXRVc2VyOiBhbnkgPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBjaGF0a2l0VXNlciQgPSB0aGlzLmNoYXRraXRVc2VyLmFzT2JzZXJ2YWJsZSgpO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIF9tc2dTZXJ2aWNlOiBNZXNzYWdpbmdTZXJ2aWNlICkge1xuXG4gICAgICAgIHRoaXMuY3VycmVudFVzZXJTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50VXNlcicpKSk7XG4gICAgICAgIHRoaXMuY3VycmVudFVzZXIgPSB0aGlzLmN1cnJlbnRVc2VyU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygnYXV0aCBzZXJ2aWNlIGNvbnN0cnVjdGVkJyk7XG5cbiAgICAgICAgdGhpcy51c2VyID0gbmV3IEJlaGF2aW9yU3ViamVjdChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2hhdGtpdFVzZXJJZCcpKTtcbiAgICAgICAgdGhpcy51c2VyJCA9IHRoaXMudXNlci5hc09ic2VydmFibGUoKTtcblxuXG4gICAgICAgIC8vIHRoaXMuY2hhdGtpdFVzZXIgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjaGF0a2l0VXNlcicpKTtcbiAgICAgICAgdGhpcy5jaGF0a2l0VXNlciA9IG5ldyBSZXBsYXlTdWJqZWN0PE9iamVjdD4oMSk7XG4gICAgICAgIHRoaXMuY2hhdGtpdFVzZXIkID0gdGhpcy5jaGF0a2l0VXNlci5hc09ic2VydmFibGUoKTtcblxuICAgICAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IFJlcGxheVN1YmplY3Q8T2JqZWN0PigxKTtcbiAgICAgICAgdGhpcy5tZXNzYWdlcyQgPSB0aGlzLm1lc3NhZ2VzLmFzT2JzZXJ2YWJsZSgpO1xuXG4gICAgICAgIC8vIE9ubHkgY2FsbGVkIG9uIGxvZ2luXG4gICAgICAgIHRoaXMudXNlciQuc3Vic2NyaWJlKCh4KSA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh4KTtcbiAgICAgICAgICAgIGlmICgheCkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgdGhpcy5pbml0Q2hhdGtpdCh4KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBjdXJyZW50VXNlclZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VXNlclN1YmplY3QudmFsdWU7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgZ2V0IHVzZXJWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHNldFVzZXIodXNlcikgeyB0aGlzLnVzZXIubmV4dCh1c2VyKTsgfVxuXG4gICAgLy8gcHVibGljIGdldCBjaGF0a2l0VXNlclZhbHVlKCkge1xuICAgIC8vICAgICByZXR1cm4gdGhpcy5jaGF0VXNlclN1YmplY3QudmFsdWU7XG4gICAgLy8gfVxuXG5cbiAgICAvL1xuICAgIC8vIOKUgOKUgOKUgCBTRU5EIFNJR04gVVAgUkVRVUVTVCBUTyBTRVJWRVIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gICAgLy9cblxuICAgICAgICBzaWdudXAoZm5hbWU6IHN0cmluZywgbG5hbWU6IHN0cmluZywgdW5pdmVyc2l0eTogc3RyaW5nLCB1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgT2t0YSBVc2VyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHtlbnZpcm9ubWVudC5hcGlVcmx9L29rdGEvc2lnbnVwYCwgeyBmbmFtZSwgbG5hbWUsIHVzZXJuYW1lLCBwYXNzd29yZCB9KVxuICAgICAgICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAgICAgICAudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXIpO1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBjaGF0a2l0IHVzZXIgZnJvbSBPa3RhIFVzZXIgSURcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9jaGF0a2l0L2NyZWF0ZXVzZXJgLCB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiB1c2VyLnByb2ZpbGUuZmlyc3ROYW1lICsgJyAnICsgdXNlci5wcm9maWxlLmxhc3ROYW1lLFxuICAgICAgICAgICAgICAgICAgICBjdXN0b21fZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvbnM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvblJlcXVlc3RzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml2ZXJzaXR5OiB1bml2ZXJzaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhZHVhdGlvblllYXI6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJlc3RzOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsdWJzOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ham9yOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaXZhdGVBY2NvdW50OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dBY3Rpdml0eVN0YXR1czogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKGNoYXRraXRVc2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZWQgQ2hhdGtpdCB1c2VyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdDcmVhdGVkIENoYXRraXQgdXNlciEnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhdGtpdFVzZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvZ2luKHVzZXJuYW1lLCBwYXNzd29yZCkudGhlbihsb2dnZWRpblVzZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvZ2dlZGluVXNlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAgIC8vXG4gICAgLy8g4pSA4pSA4pSAIFZBTElEQVRFIExPR0lOIFRIUk9VR0ggT0tUQSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgICAvL1xuXG4gICAgbG9naW4odXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHtlbnZpcm9ubWVudC5hcGlVcmx9L29rdGEvbG9naW5gLCB7IHVzZXJuYW1lLCBwYXNzd29yZCB9KVxuICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VXNlciA9IHVzZXI7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTE9HR0VEIElOIFVTRVI6ICcsIHVzZXIpO1xuXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY3VycmVudFVzZXInLCBKU09OLnN0cmluZ2lmeSh1c2VyKSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRVc2VyU3ViamVjdC5uZXh0KHVzZXIpO1xuXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2hhdGtpdFVzZXJJZCcsIHVzZXIuX2VtYmVkZGVkLnVzZXIuaWQpO1xuICAgICAgICAgICAgdGhpcy51c2VyLm5leHQodXNlci5fZW1iZWRkZWQudXNlci5pZCk7XG5cbiAgICAgICAgICAgIHJldHVybiB1c2VyO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gICAgaW5pdENoYXRraXQodXNlcklkKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXJJZCk7XG4gICAgICAgIHRoaXMuY2hhdE1hbmFnZXIgPSBuZXcgQ2hhdE1hbmFnZXIoe1xuICAgICAgICAgICAgaW5zdGFuY2VMb2NhdG9yOiAndjE6dXMxOmE1NGJkZjEyLTkzZDYtNDZmOS1iZTNiLWJmYTgzNzkxN2ZiNScsXG4gICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgICAgIHRva2VuUHJvdmlkZXI6IG5ldyBUb2tlblByb3ZpZGVyKHtcbiAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly91czEucHVzaGVycGxhdGZvcm0uaW8vc2VydmljZXMvY2hhdGtpdF90b2tlbl9wcm92aWRlci92MS9hNTRiZGYxMi05M2Q2LTQ2ZjktYmUzYi1iZmE4Mzc5MTdmYjUvdG9rZW4nXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2hhdE1hbmFnZXIuY29ubmVjdCgpLnRoZW4odXNlciA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoYXRraXRVc2VyLm5leHQodXNlcik7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2hhdGtpdFVzZXInLCBzdHJpbmdpZnkodXNlcikpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYENvbm5lY3RlZCBhcyAke3VzZXIubmFtZX1gKTtcblxuICAgICAgICAgICAgLy8gSWYgdXNlciBoYXMgbm8gcm9vbXMgdGhlbiByZXR1cm5cbiAgICAgICAgICAgIGlmICghdXNlci5yb29tcy5sZW5ndGgpIHsgcmV0dXJuIHVzZXI7IH1cblxuICAgICAgICAgICAgdXNlci5qb2luUm9vbSh7IHJvb21JZDogdXNlci5yb29tc1swXS5pZCB9KVxuICAgICAgICAgICAgLnRoZW4ocm9vbSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Um9vbS5uZXh0KHJvb20pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBKb2luZWQgcm9vbSB3aXRoIElEOiAke3Jvb20uaWR9YCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlcnIsIHJvb20pID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIGpvaW5pbmcgcm9vbSAke3Jvb20uaWR9OiAke2Vycn1gKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB1c2VyLnJvb21zLmZvckVhY2gocm9vbSA9PiB7XG4gICAgICAgICAgICAgICAgdXNlci5zdWJzY3JpYmVUb1Jvb21NdWx0aXBhcnQoe1xuICAgICAgICAgICAgICAgICAgICByb29tSWQ6IHJvb20uaWQsXG4gICAgICAgICAgICAgICAgICAgIGhvb2tzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbk1lc3NhZ2U6IG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZXMubmV4dChtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnUmVjZWl2ZWQgbWVzc2FnZTonLCBtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB1c2VyO1xuICAgICAgICAgIH0pO1xuICAgIH1cblxuXG5cbiAgICAvL1xuICAgIC8vIOKUgOKUgOKUgCBIQU5ETEUgTE9HT1VUIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vXG5cbiAgICBsb2dvdXQoKSB7XG4gICAgICAgIC8vIFRPRE86IEFkZCBsb2dvdXQgZnVuY3Rpb24gdG8gYXV0aGVudGljYXRpb24gQVBJIC0gdGhpcyBpcyBmaW5lIGZvciBub3dcbiAgICAgICAgLy8gcmVtb3ZlIHVzZXIgZnJvbSBsb2NhbCBzdG9yYWdlIHRvIGxvZyB1c2VyIG91dFxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnY3VycmVudFVzZXInKTtcbiAgICAgICAgdGhpcy5jdXJyZW50VXNlclN1YmplY3QubmV4dChudWxsKTtcbiAgICB9XG4gICAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5jdXJyZW50VXNlclN1YmplY3QudmFsdWUpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2hhdGtpdFVzZXJJZCcsIG51bGwpO1xuICAgIH1cbn1cbiJdfQ==