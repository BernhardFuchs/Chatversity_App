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
    //
    // ─── SEND AN INVITE TO THE REQUESTED USER ───────────────────────────────────────
    //
    UserService.prototype.inviteConnection = function (userId) {
        var headers = new http_1.HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });
        var data = JSON.stringify({ 'userId': "" + userId });
        return this.http.post(environment_1.environment.apiUrl + "/chatkit/invite/", data, { headers: headers });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    UserService.prototype.getAll = function () {
        var headers = new http_1.HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });
        return this.http.get(environment_1.environment.apiUrl + "/chatkit/users");
    };
    UserService.prototype.getById = function (id) {
        return this.http.get(environment_1.environment.apiUrl + "/okta/users/" + id);
    };
    UserService.prototype.register = function (user) {
        return this.http.post(environment_1.environment.apiUrl + "/users/register", user);
    };
    // update(user: any) {
    //     console.log(user)
    //     return this.http.put(`${environment.apiUrl}/updateUser/` + user.id, user)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9Db3JlL19zZXJ2aWNlcy91c2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFDMUMsNkNBQThEO0FBQzlELGlFQUErRDtBQUsvRDtJQUNJLHFCQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUksQ0FBQztJQUV6QyxFQUFFO0lBQ0YsK0ZBQStGO0lBQy9GLEVBQUU7SUFFRSxvQ0FBYyxHQUFkLFVBQWUsRUFBVTtRQUNyQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFJLHlCQUFXLENBQUMsTUFBTSw2QkFBd0IsRUFBSSxDQUFDLENBQUE7SUFDM0UsQ0FBQztJQUNMLG1GQUFtRjtJQUluRixFQUFFO0lBQ0YsNEVBQTRFO0lBQzVFLEVBQUU7SUFFRSw0QkFBTSxHQUFOLFVBQU8sTUFBTSxFQUFFLElBQUk7UUFDZixJQUFNLE9BQU8sR0FBRyxJQUFJLGtCQUFXLENBQUM7WUFDNUIsY0FBYyxFQUFFLGtCQUFrQjtZQUNsQyxRQUFRLEVBQUUsa0JBQWtCO1NBQy9CLENBQUMsQ0FBQTtRQUVGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUkseUJBQVcsQ0FBQyxNQUFNLHNCQUFpQixNQUFRLEVBQUUsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUE7SUFDbkcsQ0FBQztJQUNMLG9FQUFvRTtJQUlwRSxFQUFFO0lBQ0YsbUZBQW1GO0lBQ25GLEVBQUU7SUFFRSxzQ0FBZ0IsR0FBaEIsVUFBaUIsTUFBTTtRQUNuQixJQUFNLE9BQU8sR0FBRyxJQUFJLGtCQUFXLENBQUM7WUFDNUIsY0FBYyxFQUFFLGtCQUFrQjtZQUNsQyxRQUFRLEVBQUUsa0JBQWtCO1NBQy9CLENBQUMsQ0FBQTtRQUVGLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBRyxNQUFRLEVBQUUsQ0FBQyxDQUFBO1FBRXRELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUkseUJBQVcsQ0FBQyxNQUFNLHFCQUFrQixFQUFFLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFBO0lBQzVGLENBQUM7SUFDTCxtRkFBbUY7SUFJbkYsNEJBQU0sR0FBTjtRQUNJLElBQU0sT0FBTyxHQUFHLElBQUksa0JBQVcsQ0FBQztZQUM1QixjQUFjLEVBQUUsa0JBQWtCO1lBQ2xDLFFBQVEsRUFBRSxrQkFBa0I7U0FDL0IsQ0FBQyxDQUFBO1FBRUYsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBVyx5QkFBVyxDQUFDLE1BQU0sbUJBQWdCLENBQUMsQ0FBQTtJQUN0RSxDQUFDO0lBRUQsNkJBQU8sR0FBUCxVQUFRLEVBQVU7UUFDZCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFJLHlCQUFXLENBQUMsTUFBTSxpQkFBYyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0lBQ2xFLENBQUM7SUFFRCw4QkFBUSxHQUFSLFVBQVMsSUFBUztRQUNkLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUkseUJBQVcsQ0FBQyxNQUFNLG9CQUFpQixFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ3ZFLENBQUM7SUFFRCxzQkFBc0I7SUFDdEIsd0JBQXdCO0lBQ3hCLGdGQUFnRjtJQUNoRixJQUFJO0lBRUosNEJBQU0sR0FBTixVQUFPLEVBQVU7UUFDYixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFJLHlCQUFXLENBQUMsTUFBTSxpQkFBYyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0lBQ3JFLENBQUM7SUF4RVEsV0FBVztRQUh2QixpQkFBVSxDQUFDO1lBQ1IsVUFBVSxFQUFFLE1BQU07U0FDckIsQ0FBQzt5Q0FFNEIsaUJBQVU7T0FEM0IsV0FBVyxDQXlFdkI7SUFBRCxrQkFBQztDQUFBLEFBekVELElBeUVDO0FBekVZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJ1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi8uLi8uLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnXG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgVXNlclNlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkgeyB9XG5cbiAgICAvL1xuICAgIC8vIOKUgOKUgOKUgCBHRVQgQUxMIENPTk5FQ1RJT05TIEZPUiBBIEdJVkVOIFVTRVIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gICAgLy9cblxuICAgICAgICBnZXRDb25uZWN0aW9ucyhpZDogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2NoYXRraXQvY29ubmVjdGlvbnMvJHtpZH1gKVxuICAgICAgICB9XG4gICAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gICAgLy9cbiAgICAvLyDilIDilIDilIAgVVBEQVRFIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vXG5cbiAgICAgICAgdXBkYXRlKHVzZXJJZCwgZGF0YSkge1xuICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGAke2Vudmlyb25tZW50LmFwaVVybH0vY2hhdGtpdC91c2VyLyR7dXNlcklkfWAsIGRhdGEsIHtoZWFkZXJzOiBoZWFkZXJzfSlcbiAgICAgICAgfVxuICAgIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAgIC8vXG4gICAgLy8g4pSA4pSA4pSAIFNFTkQgQU4gSU5WSVRFIFRPIFRIRSBSRVFVRVNURUQgVVNFUiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgICAvL1xuXG4gICAgICAgIGludml0ZUNvbm5lY3Rpb24odXNlcklkKSB7XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5zdHJpbmdpZnkoeyAndXNlcklkJzogYCR7dXNlcklkfWAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGAke2Vudmlyb25tZW50LmFwaVVybH0vY2hhdGtpdC9pbnZpdGUvYCwgZGF0YSwge2hlYWRlcnM6IGhlYWRlcnN9KVxuICAgICAgICB9XG4gICAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gICAgZ2V0QWxsKCkge1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PGFueVtdPihgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2NoYXRraXQvdXNlcnNgKVxuICAgIH1cblxuICAgIGdldEJ5SWQoaWQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L29rdGEvdXNlcnMvYCArIGlkKVxuICAgIH1cblxuICAgIHJlZ2lzdGVyKHVzZXI6IGFueSkge1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS91c2Vycy9yZWdpc3RlcmAsIHVzZXIpXG4gICAgfVxuXG4gICAgLy8gdXBkYXRlKHVzZXI6IGFueSkge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyh1c2VyKVxuICAgIC8vICAgICByZXR1cm4gdGhpcy5odHRwLnB1dChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L3VwZGF0ZVVzZXIvYCArIHVzZXIuaWQsIHVzZXIpXG4gICAgLy8gfVxuXG4gICAgZGVsZXRlKGlkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9va3RhL3VzZXJzL2AgKyBpZClcbiAgICB9XG59XG4iXX0=