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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC9hcHAvQ29yZS9fc2VydmljZXMvdXNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBQzNDLDZDQUErRDtBQUcvRCxpRUFBZ0U7QUFLaEU7SUFDSSxxQkFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUFJLENBQUM7SUFFekMsRUFBRTtJQUNGLCtGQUErRjtJQUMvRixFQUFFO0lBRUUsb0NBQWMsR0FBZCxVQUFlLEVBQVU7UUFDckIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBSSx5QkFBVyxDQUFDLE1BQU0sNkJBQXdCLEVBQUksQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFDTCxtRkFBbUY7SUFJbkYsRUFBRTtJQUNGLDRFQUE0RTtJQUM1RSxFQUFFO0lBRUUsNEJBQU0sR0FBTixVQUFPLE1BQU0sRUFBRSxJQUFJO1FBQ2YsSUFBTSxPQUFPLEdBQUcsSUFBSSxrQkFBVyxDQUFDO1lBQzVCLGNBQWMsRUFBRSxrQkFBa0I7WUFDbEMsUUFBUSxFQUFFLGtCQUFrQjtTQUMvQixDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFJLHlCQUFXLENBQUMsTUFBTSxzQkFBaUIsTUFBUSxFQUFFLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO0lBQ3BHLENBQUM7SUFDTCxvRUFBb0U7SUFJcEUsNEJBQU0sR0FBTjtRQUNJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQVkseUJBQVcsQ0FBQyxNQUFNLFdBQVEsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCw2QkFBTyxHQUFQLFVBQVEsRUFBVTtRQUNkLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUkseUJBQVcsQ0FBQyxNQUFNLGlCQUFjLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELDhCQUFRLEdBQVIsVUFBUyxJQUFVO1FBQ2YsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBSSx5QkFBVyxDQUFDLE1BQU0sb0JBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELHNCQUFzQjtJQUN0Qix5QkFBeUI7SUFDekIsaUZBQWlGO0lBQ2pGLElBQUk7SUFFSiw0QkFBTSxHQUFOLFVBQU8sRUFBVTtRQUNiLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUkseUJBQVcsQ0FBQyxNQUFNLGlCQUFjLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQWpEUSxXQUFXO1FBSHZCLGlCQUFVLENBQUM7WUFDUixVQUFVLEVBQUUsTUFBTTtTQUNyQixDQUFDO3lDQUU0QixpQkFBVTtPQUQzQixXQUFXLENBa0R2QjtJQUFELGtCQUFDO0NBQUEsQUFsREQsSUFrREM7QUFsRFksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uL19tb2RlbHMvdXNlcic7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uLy4uLy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgVXNlclNlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkgeyB9XG5cbiAgICAvL1xuICAgIC8vIOKUgOKUgOKUgCBHRVQgQUxMIENPTk5FQ1RJT05TIEZPUiBBIEdJVkVOIFVTRVIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gICAgLy9cblxuICAgICAgICBnZXRDb25uZWN0aW9ucyhpZDogbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2NoYXRraXQvY29ubmVjdGlvbnMvJHtpZH1gKTtcbiAgICAgICAgfVxuICAgIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAgIC8vXG4gICAgLy8g4pSA4pSA4pSAIFVQREFURSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgICAvL1xuXG4gICAgICAgIHVwZGF0ZSh1c2VySWQsIGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9jaGF0a2l0L3VzZXIvJHt1c2VySWR9YCwgZGF0YSwge2hlYWRlcnM6IGhlYWRlcnN9KTtcbiAgICAgICAgfVxuICAgIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAgIGdldEFsbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8VXNlcltdPihgJHtlbnZpcm9ubWVudC5hcGlVcmx9L3VzZXJzYCk7XG4gICAgfVxuXG4gICAgZ2V0QnlJZChpZDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGAke2Vudmlyb25tZW50LmFwaVVybH0vb2t0YS91c2Vycy9gICsgaWQpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyKHVzZXI6IFVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGAke2Vudmlyb25tZW50LmFwaVVybH0vdXNlcnMvcmVnaXN0ZXJgLCB1c2VyKTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUodXNlcjogYW55KSB7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKHVzZXIpO1xuICAgIC8vICAgICByZXR1cm4gdGhpcy5odHRwLnB1dChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L3VwZGF0ZVVzZXIvYCArIHVzZXIuaWQsIHVzZXIpO1xuICAgIC8vIH1cblxuICAgIGRlbGV0ZShpZDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGAke2Vudmlyb25tZW50LmFwaVVybH0vb2t0YS91c2Vycy9gICsgaWQpO1xuICAgIH1cbn1cbiJdfQ==