"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../../environments/environment");
var UserService = /** @class */ (function () {
    function UserService(http) {
        this.http = http;
    }
    //
    // ─── GET ALL CONNECTIONS FOR A GIVEN USER ───────────────────────────────────────────────────
    //
    UserService.prototype.getConnections = function (id) {
        return this.http.get(environment_1.environment.apiUrl + "/chatkit/connections/" + id);
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── UPDATE ──────────────────────────────────────────────────────────────
    //
    UserService.prototype.update = function (userId, data) {
        var headers = new http_1.HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });
        return this.http.post(environment_1.environment.apiUrl + "/chatkit/user/" + userId, data, { headers: headers });
    };
    // ─────────────────────────────────────────────────────────────────
    UserService.prototype.getAll = function () {
        return this.http.get(environment_1.environment.apiUrl + "/users");
    };
    UserService.prototype.getById = function (id) {
        return this.http.get(environment_1.environment.apiUrl + "/okta/users/" + id);
    };
    UserService.prototype.register = function (user) {
        return this.http.post(environment_1.environment.apiUrl + "/users/register", user);
    };
    // update(user: any) {
    //     console.log(user);
    //     return this.http.put(`${environment.apiUrl}/updateUser/` + user.id, user);
    // }
    UserService.prototype.delete = function (id) {
        return this.http.delete(environment_1.environment.apiUrl + "/okta/users/" + id);
    };
    UserService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9Db3JlL19zZXJ2aWNlcy91c2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0MsNkNBQStEO0FBRy9ELGlFQUFnRTtBQUtoRTtJQUNJLHFCQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUksQ0FBQztJQUV6QyxFQUFFO0lBQ0YsK0ZBQStGO0lBQy9GLEVBQUU7SUFFRSxvQ0FBYyxHQUFkLFVBQWUsRUFBVTtRQUNyQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFJLHlCQUFXLENBQUMsTUFBTSw2QkFBd0IsRUFBSSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUNMLG1GQUFtRjtJQUluRixFQUFFO0lBQ0YsNEVBQTRFO0lBQzVFLEVBQUU7SUFFRSw0QkFBTSxHQUFOLFVBQU8sTUFBTSxFQUFFLElBQUk7UUFDZixJQUFNLE9BQU8sR0FBRyxJQUFJLGtCQUFXLENBQUM7WUFDNUIsY0FBYyxFQUFFLGtCQUFrQjtZQUNsQyxRQUFRLEVBQUUsa0JBQWtCO1NBQy9CLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUkseUJBQVcsQ0FBQyxNQUFNLHNCQUFpQixNQUFRLEVBQUUsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7SUFDcEcsQ0FBQztJQUNMLG9FQUFvRTtJQUlwRSw0QkFBTSxHQUFOO1FBQ0ksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBWSx5QkFBVyxDQUFDLE1BQU0sV0FBUSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELDZCQUFPLEdBQVAsVUFBUSxFQUFVO1FBQ2QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBSSx5QkFBVyxDQUFDLE1BQU0saUJBQWMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsOEJBQVEsR0FBUixVQUFTLElBQVU7UUFDZixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFJLHlCQUFXLENBQUMsTUFBTSxvQkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsc0JBQXNCO0lBQ3RCLHlCQUF5QjtJQUN6QixpRkFBaUY7SUFDakYsSUFBSTtJQUVKLDRCQUFNLEdBQU4sVUFBTyxFQUFVO1FBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBSSx5QkFBVyxDQUFDLE1BQU0saUJBQWMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBakRRLFdBQVc7UUFIdkIsaUJBQVUsQ0FBQztZQUNSLFVBQVUsRUFBRSxNQUFNO1NBQ3JCLENBQUM7eUNBRTRCLGlCQUFVO09BRDNCLFdBQVcsQ0FrRHZCO0lBQUQsa0JBQUM7Q0FBQSxBQWxERCxJQWtEQztBQWxEWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi4vX21vZGVscy91c2VyJztcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vLi4vLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBVc2VyU2VydmljZSB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7IH1cblxuICAgIC8vXG4gICAgLy8g4pSA4pSA4pSAIEdFVCBBTEwgQ09OTkVDVElPTlMgRk9SIEEgR0lWRU4gVVNFUiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgICAvL1xuXG4gICAgICAgIGdldENvbm5lY3Rpb25zKGlkOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGAke2Vudmlyb25tZW50LmFwaVVybH0vY2hhdGtpdC9jb25uZWN0aW9ucy8ke2lkfWApO1xuICAgICAgICB9XG4gICAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gICAgLy9cbiAgICAvLyDilIDilIDilIAgVVBEQVRFIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vXG5cbiAgICAgICAgdXBkYXRlKHVzZXJJZCwgZGF0YSkge1xuICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2NoYXRraXQvdXNlci8ke3VzZXJJZH1gLCBkYXRhLCB7aGVhZGVyczogaGVhZGVyc30pO1xuICAgICAgICB9XG4gICAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gICAgZ2V0QWxsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldDxVc2VyW10+KGAke2Vudmlyb25tZW50LmFwaVVybH0vdXNlcnNgKTtcbiAgICB9XG5cbiAgICBnZXRCeUlkKGlkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9va3RhL3VzZXJzL2AgKyBpZCk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXIodXNlcjogVXNlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS91c2Vycy9yZWdpc3RlcmAsIHVzZXIpO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSh1c2VyOiBhbnkpIHtcbiAgICAvLyAgICAgY29uc29sZS5sb2codXNlcik7XG4gICAgLy8gICAgIHJldHVybiB0aGlzLmh0dHAucHV0KGAke2Vudmlyb25tZW50LmFwaVVybH0vdXBkYXRlVXNlci9gICsgdXNlci5pZCwgdXNlcik7XG4gICAgLy8gfVxuXG4gICAgZGVsZXRlKGlkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9va3RhL3VzZXJzL2AgKyBpZCk7XG4gICAgfVxufVxuIl19