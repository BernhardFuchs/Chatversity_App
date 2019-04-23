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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvYXBwL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFtRDtBQUNuRCw2Q0FBa0Q7QUFDbEQsaUVBQWdFO0FBQ2hFLHlEQUFvRTtBQUNwRSw2QkFBZ0U7QUFDaEUseURBQXVEO0FBQ3ZELG1DQUF5QztBQUd6QztJQWtCSSxxQkFBb0IsSUFBZ0IsRUFBVSxXQUE2QjtRQUEzRSxpQkF5QkM7UUF6Qm1CLFNBQUksR0FBSixJQUFJLENBQVk7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBa0I7UUFoQm5FLGdCQUFXLEdBQVEsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUNsQyxpQkFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFOUMsYUFBUSxHQUFRLElBQUksY0FBTyxFQUFFLENBQUM7UUFDL0IsY0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFeEMsdUJBQWtCLEdBQVEsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUN6QyxnQkFBVyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUdwRCxTQUFJLEdBQVEsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUMzQixVQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVoQyxnQkFBVyxHQUFRLElBQUksY0FBTyxFQUFFLENBQUM7UUFDbEMsaUJBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBSWxELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLHNCQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMs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SyxDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7Z0JBQ25CLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztvQkFDMUIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO29CQUNmLEtBQUssRUFBRTt3QkFDSCxTQUFTLEVBQUUsVUFBQSxPQUFPOzRCQUNkLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUM1Qiw2Q0FBNkM7d0JBQ2pELENBQUM7cUJBQ0o7aUJBQ0osQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUlELEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUVGLDRCQUFNLEdBQU47UUFDSSx5RUFBeUU7UUFDekUsaURBQWlEO1FBQ2pELFlBQVksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ0Qsb0VBQW9FO0lBRXBFLDhCQUFRLEdBQVI7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxZQUFZLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBN0xRLFdBQVc7UUFEdkIsaUJBQVUsRUFBRTt5Q0FtQmlCLGlCQUFVLEVBQXVCLG9DQUFnQjtPQWxCbEUsV0FBVyxDQThMdkI7SUFBRCxrQkFBQztDQUFBLEFBOUxELElBOExDO0FBOUxZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi8uLi8uLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgQ2hhdE1hbmFnZXIsIFRva2VuUHJvdmlkZXIgfSBmcm9tICdAcHVzaGVyL2NoYXRraXQtY2xpZW50JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgU3ViamVjdCwgUmVwbGF5U3ViamVjdCwgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE1lc3NhZ2luZ1NlcnZpY2UgfSBmcm9tICcuL21lc3NhZ2luZy5zZXJ2aWNlJztcbmltcG9ydCB7cGFyc2UsIHN0cmluZ2lmeX0gZnJvbSAnZmxhdHRlZCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBwcml2YXRlIGN1cnJlbnRSb29tOiBhbnkgPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBjdXJyZW50Um9vbSQgPSB0aGlzLmN1cnJlbnRSb29tLmFzT2JzZXJ2YWJsZSgpO1xuXG4gICAgcHJpdmF0ZSBtZXNzYWdlczogYW55ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgbWVzc2FnZXMkID0gdGhpcy5tZXNzYWdlcy5hc09ic2VydmFibGUoKTtcblxuICAgIHByaXZhdGUgY3VycmVudFVzZXJTdWJqZWN0OiBhbnkgPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyBjdXJyZW50VXNlciA9IHRoaXMuY3VycmVudFVzZXJTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICAgIGNoYXRNYW5hZ2VyOiBhbnk7XG5cbiAgICBwcml2YXRlIHVzZXI6IGFueSA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIHVzZXIkID0gdGhpcy51c2VyLmFzT2JzZXJ2YWJsZSgpO1xuXG4gICAgcHJpdmF0ZSBjaGF0a2l0VXNlcjogYW55ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgY2hhdGtpdFVzZXIkID0gdGhpcy5jaGF0a2l0VXNlci5hc09ic2VydmFibGUoKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHJpdmF0ZSBfbXNnU2VydmljZTogTWVzc2FnaW5nU2VydmljZSApIHtcblxuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudFVzZXInKSkpO1xuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gdGhpcy5jdXJyZW50VXNlclN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2F1dGggc2VydmljZSBjb25zdHJ1Y3RlZCcpO1xuXG4gICAgICAgIHRoaXMudXNlciA9IG5ldyBCZWhhdmlvclN1YmplY3QobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NoYXRraXRVc2VySWQnKSk7XG4gICAgICAgIHRoaXMudXNlciQgPSB0aGlzLnVzZXIuYXNPYnNlcnZhYmxlKCk7XG5cblxuICAgICAgICAvLyB0aGlzLmNoYXRraXRVc2VyID0gbmV3IEJlaGF2aW9yU3ViamVjdChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2hhdGtpdFVzZXInKSk7XG4gICAgICAgIHRoaXMuY2hhdGtpdFVzZXIgPSBuZXcgUmVwbGF5U3ViamVjdDxPYmplY3Q+KDEpO1xuICAgICAgICB0aGlzLmNoYXRraXRVc2VyJCA9IHRoaXMuY2hhdGtpdFVzZXIuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICAgICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBSZXBsYXlTdWJqZWN0PE9iamVjdD4oMSk7XG4gICAgICAgIHRoaXMubWVzc2FnZXMkID0gdGhpcy5tZXNzYWdlcy5hc09ic2VydmFibGUoKTtcblxuICAgICAgICAvLyBPbmx5IGNhbGxlZCBvbiBsb2dpblxuICAgICAgICB0aGlzLnVzZXIkLnN1YnNjcmliZSgoeCkgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coeCk7XG4gICAgICAgICAgICBpZiAoIXgpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdENoYXRraXQoeCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY3VycmVudFVzZXJWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFVzZXJTdWJqZWN0LnZhbHVlO1xuICAgIH1cblxuXG4gICAgcHVibGljIGdldCB1c2VyVmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXI7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBzZXRVc2VyKHVzZXIpIHsgdGhpcy51c2VyLm5leHQodXNlcik7IH1cblxuICAgIC8vIHB1YmxpYyBnZXQgY2hhdGtpdFVzZXJWYWx1ZSgpIHtcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuY2hhdFVzZXJTdWJqZWN0LnZhbHVlO1xuICAgIC8vIH1cblxuXG4gICAgLy9cbiAgICAvLyDilIDilIDilIAgU0VORCBTSUdOIFVQIFJFUVVFU1QgVE8gU0VSVkVSIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vXG5cbiAgICAgICAgc2lnbnVwKGZuYW1lOiBzdHJpbmcsIGxuYW1lOiBzdHJpbmcsIHVuaXZlcnNpdHk6IHN0cmluZywgdXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIE9rdGEgVXNlclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9va3RhL3NpZ251cGAsIHsgZm5hbWUsIGxuYW1lLCB1c2VybmFtZSwgcGFzc3dvcmQgfSlcbiAgICAgICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh1c2VyKTtcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgY2hhdGtpdCB1c2VyIGZyb20gT2t0YSBVc2VyIElEXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGAke2Vudmlyb25tZW50LmFwaVVybH0vY2hhdGtpdC9jcmVhdGV1c2VyYCwge1xuICAgICAgICAgICAgICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdXNlci5wcm9maWxlLmZpcnN0TmFtZSArICcgJyArIHVzZXIucHJvZmlsZS5sYXN0TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tX2RhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Rpb25zOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Rpb25SZXF1ZXN0czogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBiaW86ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdmVyc2l0eTogdW5pdmVyc2l0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYWR1YXRpb25ZZWFyOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVyZXN0czogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbHViczogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYWpvcjogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcml2YXRlQWNjb3VudDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93QWN0aXZpdHlTdGF0dXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAgICAgICAgIC50aGVuKChjaGF0a2l0VXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGVkIENoYXRraXQgdXNlclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnQ3JlYXRlZCBDaGF0a2l0IHVzZXIhJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYXRraXRVc2VyKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpLnRoZW4obG9nZ2VkaW5Vc2VyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2dnZWRpblVzZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgICAvL1xuICAgIC8vIOKUgOKUgOKUgCBWQUxJREFURSBMT0dJTiBUSFJPVUdIIE9LVEEg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gICAgLy9cblxuICAgIGxvZ2luKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9va3RhL2xvZ2luYCwgeyB1c2VybmFtZSwgcGFzc3dvcmQgfSlcbiAgICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAgIC50aGVuKCh1c2VyKSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFVzZXIgPSB1c2VyO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0xPR0dFRCBJTiBVU0VSOiAnLCB1c2VyKTtcblxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2N1cnJlbnRVc2VyJywgSlNPTi5zdHJpbmdpZnkodXNlcikpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VXNlclN1YmplY3QubmV4dCh1c2VyKTtcblxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NoYXRraXRVc2VySWQnLCB1c2VyLl9lbWJlZGRlZC51c2VyLmlkKTtcbiAgICAgICAgICAgIHRoaXMudXNlci5uZXh0KHVzZXIuX2VtYmVkZGVkLnVzZXIuaWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAgIGluaXRDaGF0a2l0KHVzZXJJZCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh1c2VySWQpO1xuICAgICAgICB0aGlzLmNoYXRNYW5hZ2VyID0gbmV3IENoYXRNYW5hZ2VyKHtcbiAgICAgICAgICAgIGluc3RhbmNlTG9jYXRvcjogJ3YxOnVzMTphNTRiZGYxMi05M2Q2LTQ2ZjktYmUzYi1iZmE4Mzc5MTdmYjUnLFxuICAgICAgICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICAgICAgICB0b2tlblByb3ZpZGVyOiBuZXcgVG9rZW5Qcm92aWRlcih7XG4gICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vdXMxLnB1c2hlcnBsYXRmb3JtLmlvL3NlcnZpY2VzL2NoYXRraXRfdG9rZW5fcHJvdmlkZXIvdjEvYTU0YmRmMTItOTNkNi00NmY5LWJlM2ItYmZhODM3OTE3ZmI1L3Rva2VuJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiB0aGlzLmNoYXRNYW5hZ2VyLmNvbm5lY3QoKS50aGVuKHVzZXIgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGF0a2l0VXNlci5uZXh0KHVzZXIpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NoYXRraXRVc2VyJywgc3RyaW5naWZ5KHVzZXIpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDb25uZWN0ZWQgYXMgJHt1c2VyLm5hbWV9YCk7XG5cbiAgICAgICAgICAgIC8vIElmIHVzZXIgaGFzIG5vIHJvb21zIHRoZW4gcmV0dXJuXG4gICAgICAgICAgICBpZiAoIXVzZXIucm9vbXMubGVuZ3RoKSB7IHJldHVybiB1c2VyOyB9XG5cbiAgICAgICAgICAgIHVzZXIuam9pblJvb20oeyByb29tSWQ6IHVzZXIucm9vbXNbMF0uaWQgfSlcbiAgICAgICAgICAgIC50aGVuKHJvb20gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFJvb20ubmV4dChyb29tKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgSm9pbmVkIHJvb20gd2l0aCBJRDogJHtyb29tLmlkfWApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyLCByb29tKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBqb2luaW5nIHJvb20gJHtyb29tLmlkfTogJHtlcnJ9YCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdXNlci5yb29tcy5mb3JFYWNoKHJvb20gPT4ge1xuICAgICAgICAgICAgICAgIHVzZXIuc3Vic2NyaWJlVG9Sb29tTXVsdGlwYXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgcm9vbUlkOiByb29tLmlkLFxuICAgICAgICAgICAgICAgICAgICBob29rczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25NZXNzYWdlOiBtZXNzYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2VzLm5leHQobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1JlY2VpdmVkIG1lc3NhZ2U6JywgbWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgICAgICB9KTtcbiAgICB9XG5cblxuXG4gICAgLy9cbiAgICAvLyDilIDilIDilIAgSEFORExFIExPR09VVCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgICAvL1xuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICAvLyBUT0RPOiBBZGQgbG9nb3V0IGZ1bmN0aW9uIHRvIGF1dGhlbnRpY2F0aW9uIEFQSSAtIHRoaXMgaXMgZmluZSBmb3Igbm93XG4gICAgICAgIC8vIHJlbW92ZSB1c2VyIGZyb20gbG9jYWwgc3RvcmFnZSB0byBsb2cgdXNlciBvdXRcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2N1cnJlbnRVc2VyJyk7XG4gICAgICAgIHRoaXMuY3VycmVudFVzZXJTdWJqZWN0Lm5leHQobnVsbCk7XG4gICAgfVxuICAgIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFVzZXJTdWJqZWN0LnZhbHVlKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NoYXRraXRVc2VySWQnLCBudWxsKTtcbiAgICB9XG59XG4iXX0=