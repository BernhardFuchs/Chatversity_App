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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBbUQ7QUFDbkQsNkNBQWtEO0FBQ2xELGlFQUFnRTtBQUNoRSx5REFBb0U7QUFDcEUsNkJBQWdFO0FBQ2hFLHlEQUF1RDtBQUN2RCxtQ0FBeUM7QUFHekM7SUFrQkkscUJBQW9CLElBQWdCLEVBQVUsV0FBNkI7UUFBM0UsaUJBeUJDO1FBekJtQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWtCO1FBaEJuRSxnQkFBVyxHQUFRLElBQUksY0FBTyxFQUFFLENBQUM7UUFDbEMsaUJBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRTlDLGFBQVEsR0FBUSxJQUFJLGNBQU8sRUFBRSxDQUFDO1FBQy9CLGNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXhDLHVCQUFrQixHQUFRLElBQUksY0FBTyxFQUFFLENBQUM7UUFDekMsZ0JBQVcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFHcEQsU0FBSSxHQUFRLElBQUksY0FBTyxFQUFFLENBQUM7UUFDM0IsVUFBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFaEMsZ0JBQVcsR0FBUSxJQUFJLGNBQU8sRUFBRSxDQUFDO1FBQ2xDLGlCQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUlsRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxzQkFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFD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SUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2dCQUNuQixJQUFJLENBQUMsd0JBQXdCLENBQUM7b0JBQzFCLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDZixLQUFLLEVBQUU7d0JBQ0gsU0FBUyxFQUFFLFVBQUEsT0FBTzs0QkFDZCxLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs0QkFDNUIsNkNBQTZDO3dCQUNqRCxDQUFDO3FCQUNKO2lCQUNKLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztJQUNULENBQUM7SUFJRCxFQUFFO0lBQ0YsbUZBQW1GO0lBQ25GLEVBQUU7SUFFRiw0QkFBTSxHQUFOO1FBQ0kseUVBQXlFO1FBQ3pFLGlEQUFpRDtRQUNqRCxZQUFZLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUNELG9FQUFvRTtJQUVwRSw4QkFBUSxHQUFSO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsWUFBWSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQTdMUSxXQUFXO1FBRHZCLGlCQUFVLEVBQUU7eUNBbUJpQixpQkFBVSxFQUF1QixvQ0FBZ0I7T0FsQmxFLFdBQVcsQ0E4THZCO0lBQUQsa0JBQUM7Q0FBQSxBQTlMRCxJQThMQztBQTlMWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vLi4vLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcbmltcG9ydCB7IENoYXRNYW5hZ2VyLCBUb2tlblByb3ZpZGVyIH0gZnJvbSAnQHB1c2hlci9jaGF0a2l0LWNsaWVudCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIFN1YmplY3QsIFJlcGxheVN1YmplY3QsIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBNZXNzYWdpbmdTZXJ2aWNlIH0gZnJvbSAnLi9tZXNzYWdpbmcuc2VydmljZSc7XG5pbXBvcnQge3BhcnNlLCBzdHJpbmdpZnl9IGZyb20gJ2ZsYXR0ZWQnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2UgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgcHJpdmF0ZSBjdXJyZW50Um9vbTogYW55ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgY3VycmVudFJvb20kID0gdGhpcy5jdXJyZW50Um9vbS5hc09ic2VydmFibGUoKTtcblxuICAgIHByaXZhdGUgbWVzc2FnZXM6IGFueSA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIG1lc3NhZ2VzJCA9IHRoaXMubWVzc2FnZXMuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICBwcml2YXRlIGN1cnJlbnRVc2VyU3ViamVjdDogYW55ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwdWJsaWMgY3VycmVudFVzZXIgPSB0aGlzLmN1cnJlbnRVc2VyU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgICBjaGF0TWFuYWdlcjogYW55O1xuXG4gICAgcHJpdmF0ZSB1c2VyOiBhbnkgPSBuZXcgU3ViamVjdCgpO1xuICAgIHB1YmxpYyB1c2VyJCA9IHRoaXMudXNlci5hc09ic2VydmFibGUoKTtcblxuICAgIHByaXZhdGUgY2hhdGtpdFVzZXI6IGFueSA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHVibGljIGNoYXRraXRVc2VyJCA9IHRoaXMuY2hhdGtpdFVzZXIuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgX21zZ1NlcnZpY2U6IE1lc3NhZ2luZ1NlcnZpY2UgKSB7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VXNlclN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRVc2VyJykpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50VXNlciA9IHRoaXMuY3VycmVudFVzZXJTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdhdXRoIHNlcnZpY2UgY29uc3RydWN0ZWQnKTtcblxuICAgICAgICB0aGlzLnVzZXIgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjaGF0a2l0VXNlcklkJykpO1xuICAgICAgICB0aGlzLnVzZXIkID0gdGhpcy51c2VyLmFzT2JzZXJ2YWJsZSgpO1xuXG5cbiAgICAgICAgLy8gdGhpcy5jaGF0a2l0VXNlciA9IG5ldyBCZWhhdmlvclN1YmplY3QobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NoYXRraXRVc2VyJykpO1xuICAgICAgICB0aGlzLmNoYXRraXRVc2VyID0gbmV3IFJlcGxheVN1YmplY3Q8T2JqZWN0PigxKTtcbiAgICAgICAgdGhpcy5jaGF0a2l0VXNlciQgPSB0aGlzLmNoYXRraXRVc2VyLmFzT2JzZXJ2YWJsZSgpO1xuXG4gICAgICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgUmVwbGF5U3ViamVjdDxPYmplY3Q+KDEpO1xuICAgICAgICB0aGlzLm1lc3NhZ2VzJCA9IHRoaXMubWVzc2FnZXMuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICAgICAgLy8gT25seSBjYWxsZWQgb24gbG9naW5cbiAgICAgICAgdGhpcy51c2VyJC5zdWJzY3JpYmUoKHgpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHgpO1xuICAgICAgICAgICAgaWYgKCF4KSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICB0aGlzLmluaXRDaGF0a2l0KHgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGN1cnJlbnRVc2VyVmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRVc2VyU3ViamVjdC52YWx1ZTtcbiAgICB9XG5cblxuICAgIHB1YmxpYyBnZXQgdXNlclZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy51c2VyO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc2V0VXNlcih1c2VyKSB7IHRoaXMudXNlci5uZXh0KHVzZXIpOyB9XG5cbiAgICAvLyBwdWJsaWMgZ2V0IGNoYXRraXRVc2VyVmFsdWUoKSB7XG4gICAgLy8gICAgIHJldHVybiB0aGlzLmNoYXRVc2VyU3ViamVjdC52YWx1ZTtcbiAgICAvLyB9XG5cblxuICAgIC8vXG4gICAgLy8g4pSA4pSA4pSAIFNFTkQgU0lHTiBVUCBSRVFVRVNUIFRPIFNFUlZFUiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgICAvL1xuXG4gICAgICAgIHNpZ251cChmbmFtZTogc3RyaW5nLCBsbmFtZTogc3RyaW5nLCB1bml2ZXJzaXR5OiBzdHJpbmcsIHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBPa3RhIFVzZXJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke2Vudmlyb25tZW50LmFwaVVybH0vb2t0YS9zaWdudXBgLCB7IGZuYW1lLCBsbmFtZSwgdXNlcm5hbWUsIHBhc3N3b3JkIH0pXG4gICAgICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgICAgIC50aGVuKCh1c2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codXNlcik7XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGNoYXRraXQgdXNlciBmcm9tIE9rdGEgVXNlciBJRFxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2NoYXRraXQvY3JlYXRldXNlcmAsIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHVzZXIucHJvZmlsZS5maXJzdE5hbWUgKyAnICcgKyB1c2VyLnByb2ZpbGUubGFzdE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbV9kYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0aW9uczogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0aW9uUmVxdWVzdHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmlvOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXZlcnNpdHk6IHVuaXZlcnNpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICBncmFkdWF0aW9uWWVhcjogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcmVzdHM6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2x1YnM6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFqb3I6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZUFjY291bnQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0FjdGl2aXR5U3RhdHVzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgICAgICAgICAudGhlbigoY2hhdGtpdFVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlZCBDaGF0a2l0IHVzZXJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ0NyZWF0ZWQgQ2hhdGtpdCB1c2VyIScpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGF0a2l0VXNlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKS50aGVuKGxvZ2dlZGluVXNlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9nZ2VkaW5Vc2VyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gICAgLy9cbiAgICAvLyDilIDilIDilIAgVkFMSURBVEUgTE9HSU4gVEhST1VHSCBPS1RBIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vXG5cbiAgICBsb2dpbih1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke2Vudmlyb25tZW50LmFwaVVybH0vb2t0YS9sb2dpbmAsIHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pXG4gICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAudGhlbigodXNlcikgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMT0dHRUQgSU4gVVNFUjogJywgdXNlcik7XG5cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50VXNlcicsIEpTT04uc3RyaW5naWZ5KHVzZXIpKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFVzZXJTdWJqZWN0Lm5leHQodXNlcik7XG5cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjaGF0a2l0VXNlcklkJywgdXNlci5fZW1iZWRkZWQudXNlci5pZCk7XG4gICAgICAgICAgICB0aGlzLnVzZXIubmV4dCh1c2VyLl9lbWJlZGRlZC51c2VyLmlkKTtcblxuICAgICAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgICBpbml0Q2hhdGtpdCh1c2VySWQpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2codXNlcklkKTtcbiAgICAgICAgdGhpcy5jaGF0TWFuYWdlciA9IG5ldyBDaGF0TWFuYWdlcih7XG4gICAgICAgICAgICBpbnN0YW5jZUxvY2F0b3I6ICd2MTp1czE6YTU0YmRmMTItOTNkNi00NmY5LWJlM2ItYmZhODM3OTE3ZmI1JyxcbiAgICAgICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgdG9rZW5Qcm92aWRlcjogbmV3IFRva2VuUHJvdmlkZXIoe1xuICAgICAgICAgICAgICB1cmw6ICdodHRwczovL3VzMS5wdXNoZXJwbGF0Zm9ybS5pby9zZXJ2aWNlcy9jaGF0a2l0X3Rva2VuX3Byb3ZpZGVyL3YxL2E1NGJkZjEyLTkzZDYtNDZmOS1iZTNiLWJmYTgzNzkxN2ZiNS90b2tlbidcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gdGhpcy5jaGF0TWFuYWdlci5jb25uZWN0KCkudGhlbih1c2VyID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhdGtpdFVzZXIubmV4dCh1c2VyKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjaGF0a2l0VXNlcicsIHN0cmluZ2lmeSh1c2VyKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQ29ubmVjdGVkIGFzICR7dXNlci5uYW1lfWApO1xuXG4gICAgICAgICAgICAvLyBJZiB1c2VyIGhhcyBubyByb29tcyB0aGVuIHJldHVyblxuICAgICAgICAgICAgaWYgKCF1c2VyLnJvb21zLmxlbmd0aCkgeyByZXR1cm4gdXNlcjsgfVxuXG4gICAgICAgICAgICB1c2VyLmpvaW5Sb29tKHsgcm9vbUlkOiB1c2VyLnJvb21zWzBdLmlkIH0pXG4gICAgICAgICAgICAudGhlbihyb29tID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRSb29tLm5leHQocm9vbSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEpvaW5lZCByb29tIHdpdGggSUQ6ICR7cm9vbS5pZH1gKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGVyciwgcm9vbSkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3Igam9pbmluZyByb29tICR7cm9vbS5pZH06ICR7ZXJyfWApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHVzZXIucm9vbXMuZm9yRWFjaChyb29tID0+IHtcbiAgICAgICAgICAgICAgICB1c2VyLnN1YnNjcmliZVRvUm9vbU11bHRpcGFydCh7XG4gICAgICAgICAgICAgICAgICAgIHJvb21JZDogcm9vbS5pZCxcbiAgICAgICAgICAgICAgICAgICAgaG9va3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uTWVzc2FnZTogbWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlcy5uZXh0KG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdSZWNlaXZlZCBtZXNzYWdlOicsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgICAgICAgfSk7XG4gICAgfVxuXG5cblxuICAgIC8vXG4gICAgLy8g4pSA4pSA4pSAIEhBTkRMRSBMT0dPVVQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gICAgLy9cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgLy8gVE9ETzogQWRkIGxvZ291dCBmdW5jdGlvbiB0byBhdXRoZW50aWNhdGlvbiBBUEkgLSB0aGlzIGlzIGZpbmUgZm9yIG5vd1xuICAgICAgICAvLyByZW1vdmUgdXNlciBmcm9tIGxvY2FsIHN0b3JhZ2UgdG8gbG9nIHVzZXIgb3V0XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdjdXJyZW50VXNlcicpO1xuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyU3ViamVjdC5uZXh0KG51bGwpO1xuICAgIH1cbiAgICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRVc2VyU3ViamVjdC52YWx1ZSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjaGF0a2l0VXNlcklkJywgbnVsbCk7XG4gICAgfVxufVxuIl19