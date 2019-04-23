"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../../environments/environment");
var rxjs_1 = require("rxjs");
var messaging_service_1 = require("./messaging.service");
var router_1 = require("@angular/router");
var AuthService = /** @class */ (function () {
    function AuthService(http, messageService, router) {
        this.http = http;
        this.messageService = messageService;
        this.router = router;
        this._currentUser = new rxjs_1.ReplaySubject(1);
        this.initializeApp();
        console.log('Auth service constructed');
    }
    Object.defineProperty(AuthService.prototype, "currentUser", {
        get: function () {
            return this._currentUser.asObservable();
        },
        set: function (user) {
            console.log('setting current user');
            this._currentUser.next(user);
        },
        enumerable: true,
        configurable: true
    });
    AuthService.prototype.getCurrentUser = function () {
        return this._currentUser.asObservable();
    };
    AuthService.prototype.getUserId = function () {
        return localStorage.getItem('chatkitUserId');
    };
    AuthService.prototype.initializeApp = function () {
        var _this = this;
        if (!localStorage.getItem('chatkitUserId')) {
            return;
        }
        this.messageService.initChatkit(localStorage.getItem('chatkitUserId'))
            .then(function (chatkitUser) {
            console.log('setting chatkit user');
            localStorage.setItem('chatkitUser', chatkitUser);
            _this._currentUser.next(chatkitUser);
        });
    };
    AuthService.prototype.userLoggedIn = function () {
        return localStorage.getItem('chatkitUserId') != null;
    };
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
                console.log('Created Chatkit user!');
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
            console.log('LOGGED IN OKTA USER: ', user);
            localStorage.setItem('OktaUser', JSON.stringify(user));
            return _this.messageService.initChatkit(user._embedded.user.id)
                .then(function (chatkitUser) {
                _this.currentUser = chatkitUser;
                return chatkitUser;
            });
        });
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── HANDLE LOGOUT ──────────────────────────────────────────────────────────────
    //
    AuthService.prototype.logout = function () {
        this.messageService.disconnect();
        localStorage.clear();
        this.router.navigate(['/login']);
        console.clear();
    };
    AuthService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient, messaging_service_1.MessagingService, router_1.Router])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFDbEQsNkNBQWlEO0FBQ2pELGlFQUErRDtBQUUvRCw2QkFBMkU7QUFDM0UseURBQXNEO0FBR3RELDBDQUF3QztBQUd4QztJQUdJLHFCQUFvQixJQUFnQixFQUFVLGNBQWdDLEVBQVUsTUFBYztRQUFsRixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWtCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNsRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksb0JBQWEsQ0FBTSxDQUFDLENBQUMsQ0FBQTtRQUM3QyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0lBQzNDLENBQUM7SUFFRCxzQkFBSSxvQ0FBVzthQUFmO1lBQ0ksT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFBO1FBQzNDLENBQUM7YUFFRCxVQUFnQixJQUFTO1lBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtZQUNuQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNoQyxDQUFDOzs7T0FMQTtJQU9ELG9DQUFjLEdBQWQ7UUFDSSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUE7SUFDM0MsQ0FBQztJQUdELCtCQUFTLEdBQVQ7UUFDSSxPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUE7SUFDaEQsQ0FBQztJQUlELG1DQUFhLEdBQWI7UUFBQSxpQkFRQztRQVBHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFD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SSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBRXRELE9BQU8sS0FBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2lCQUM3RCxJQUFJLENBQUMsVUFBQSxXQUFXO2dCQUVmLEtBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO2dCQUU5QixPQUFPLFdBQVcsQ0FBQTtZQUN0QixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUNMLG9FQUFvRTtJQUlwRSxFQUFFO0lBQ0YsbUZBQW1GO0lBQ25GLEVBQUU7SUFFRSw0QkFBTSxHQUFOO1FBQ0ksSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUNoQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQ2hDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBM0hJLFdBQVc7UUFEdkIsaUJBQVUsRUFBRTt5Q0FJaUIsaUJBQVUsRUFBMEIsb0NBQWdCLEVBQWtCLGVBQU07T0FIN0YsV0FBVyxDQThIdkI7SUFBRCxrQkFBQztDQUFBLEFBOUhELElBOEhDO0FBOUhZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCdcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vLi4vLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50J1xuaW1wb3J0IHsgQ2hhdE1hbmFnZXIsIFRva2VuUHJvdmlkZXIgfSBmcm9tICdAcHVzaGVyL2NoYXRraXQtY2xpZW50J1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBTdWJqZWN0LCBSZXBsYXlTdWJqZWN0LCBPYnNlcnZhYmxlLCB9IGZyb20gJ3J4anMnXG5pbXBvcnQgeyBNZXNzYWdpbmdTZXJ2aWNlIH0gZnJvbSAnLi9tZXNzYWdpbmcuc2VydmljZSdcbmltcG9ydCB7cGFyc2UsIHN0cmluZ2lmeX0gZnJvbSAnZmxhdHRlZCdcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJ1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJ1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuICAgIHByaXZhdGUgX2N1cnJlbnRVc2VyOiBSZXBsYXlTdWJqZWN0PGFueT5cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHJpdmF0ZSBtZXNzYWdlU2VydmljZTogTWVzc2FnaW5nU2VydmljZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciApIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFVzZXIgPSBuZXcgUmVwbGF5U3ViamVjdDxhbnk+KDEpXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUFwcCgpXG4gICAgICAgIGNvbnNvbGUubG9nKCdBdXRoIHNlcnZpY2UgY29uc3RydWN0ZWQnKVxuICAgIH1cblxuICAgIGdldCBjdXJyZW50VXNlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRVc2VyLmFzT2JzZXJ2YWJsZSgpXG4gICAgfVxuXG4gICAgc2V0IGN1cnJlbnRVc2VyKHVzZXI6IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZygnc2V0dGluZyBjdXJyZW50IHVzZXInKVxuICAgICAgICB0aGlzLl9jdXJyZW50VXNlci5uZXh0KHVzZXIpXG4gICAgfVxuXG4gICAgZ2V0Q3VycmVudFVzZXIoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRVc2VyLmFzT2JzZXJ2YWJsZSgpXG4gICAgfVxuXG5cbiAgICBnZXRVc2VySWQoKSB7XG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2hhdGtpdFVzZXJJZCcpXG4gICAgfVxuXG5cblxuICAgIGluaXRpYWxpemVBcHAoKSB7XG4gICAgICAgIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NoYXRraXRVc2VySWQnKSkgeyByZXR1cm4gfVxuICAgICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLmluaXRDaGF0a2l0KGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjaGF0a2l0VXNlcklkJykpXG4gICAgICAgIC50aGVuKGNoYXRraXRVc2VyID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZXR0aW5nIGNoYXRraXQgdXNlcicpXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2hhdGtpdFVzZXInLCBjaGF0a2l0VXNlcilcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRVc2VyLm5leHQoY2hhdGtpdFVzZXIpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdXNlckxvZ2dlZEluKCkge1xuICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NoYXRraXRVc2VySWQnKSAhPSBudWxsXG4gICAgfVxuXG5cblxuICAgIC8vXG4gICAgLy8g4pSA4pSA4pSAIFNFTkQgU0lHTiBVUCBSRVFVRVNUIFRPIFNFUlZFUiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgICAvL1xuXG4gICAgICAgIHNpZ251cChmbmFtZTogc3RyaW5nLCBsbmFtZTogc3RyaW5nLCB1bml2ZXJzaXR5OiBzdHJpbmcsIHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBPa3RhIFVzZXJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke2Vudmlyb25tZW50LmFwaVVybH0vb2t0YS9zaWdudXBgLCB7IGZuYW1lLCBsbmFtZSwgdXNlcm5hbWUsIHBhc3N3b3JkIH0pXG4gICAgICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgICAgIC50aGVuKHVzZXIgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXIpO1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBjaGF0a2l0IHVzZXIgZnJvbSBPa3RhIFVzZXIgSURcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9jaGF0a2l0L2NyZWF0ZXVzZXJgLCB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiB1c2VyLnByb2ZpbGUuZmlyc3ROYW1lICsgJyAnICsgdXNlci5wcm9maWxlLmxhc3ROYW1lLFxuICAgICAgICAgICAgICAgICAgICBjdXN0b21fZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvbnM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvblJlcXVlc3RzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml2ZXJzaXR5OiB1bml2ZXJzaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhZHVhdGlvblllYXI6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJlc3RzOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsdWJzOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ham9yOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaXZhdGVBY2NvdW50OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dBY3Rpdml0eVN0YXR1czogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAgICAgLnRoZW4oKGNoYXRraXRVc2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZWQgQ2hhdGtpdCB1c2VyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDcmVhdGVkIENoYXRraXQgdXNlciEnKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGF0a2l0VXNlcilcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpLnRoZW4obG9nZ2VkaW5Vc2VyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2dnZWRpblVzZXJcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAgIC8vXG4gICAgLy8g4pSA4pSA4pSAIFZBTElEQVRFIExPR0lOIFRIUk9VR0ggT0tUQSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgICAvL1xuXG4gICAgICAgIGxvZ2luKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke2Vudmlyb25tZW50LmFwaVVybH0vb2t0YS9sb2dpbmAsIHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pXG4gICAgICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgICAgIC50aGVuKCh1c2VyKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTE9HR0VEIElOIE9LVEEgVVNFUjogJywgdXNlcilcblxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdPa3RhVXNlcicsIEpTT04uc3RyaW5naWZ5KHVzZXIpKVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZVNlcnZpY2UuaW5pdENoYXRraXQodXNlci5fZW1iZWRkZWQudXNlci5pZClcbiAgICAgICAgICAgICAgICAudGhlbihjaGF0a2l0VXNlciA9PiB7XG5cbiAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFVzZXIgPSBjaGF0a2l0VXNlclxuXG4gICAgICAgICAgICAgICAgICByZXR1cm4gY2hhdGtpdFVzZXJcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgICAvL1xuICAgIC8vIOKUgOKUgOKUgCBIQU5ETEUgTE9HT1VUIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vXG5cbiAgICAgICAgbG9nb3V0KCkge1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5kaXNjb25uZWN0KClcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpXG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy9sb2dpbiddKVxuICAgICAgICAgICAgY29uc29sZS5jbGVhcigpXG4gICAgICAgIH1cbiAgICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxufVxuIl19