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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvYXBwL0NvcmUvX3NlcnZpY2VzL3VzZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQyw2Q0FBK0Q7QUFHL0QsaUVBQWdFO0FBS2hFO0lBQ0kscUJBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFBSSxDQUFDO0lBRXpDLEVBQUU7SUFDRiwrRkFBK0Y7SUFDL0YsRUFBRTtJQUVFLG9DQUFjLEdBQWQsVUFBZSxFQUFVO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUkseUJBQVcsQ0FBQyxNQUFNLDZCQUF3QixFQUFJLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBQ0wsbUZBQW1GO0lBSW5GLEVBQUU7SUFDRiw0RUFBNEU7SUFDNUUsRUFBRTtJQUVFLDRCQUFNLEdBQU4sVUFBTyxNQUFNLEVBQUUsSUFBSTtRQUNmLElBQU0sT0FBTyxHQUFHLElBQUksa0JBQVcsQ0FBQztZQUM1QixjQUFjLEVBQUUsa0JBQWtCO1lBQ2xDLFFBQVEsRUFBRSxrQkFBa0I7U0FDL0IsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBSSx5QkFBVyxDQUFDLE1BQU0sc0JBQWlCLE1BQVEsRUFBRSxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztJQUNwRyxDQUFDO0lBQ0wsb0VBQW9FO0lBSXBFLDRCQUFNLEdBQU47UUFDSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFZLHlCQUFXLENBQUMsTUFBTSxXQUFRLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsNkJBQU8sR0FBUCxVQUFRLEVBQVU7UUFDZCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFJLHlCQUFXLENBQUMsTUFBTSxpQkFBYyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCw4QkFBUSxHQUFSLFVBQVMsSUFBVTtRQUNmLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUkseUJBQVcsQ0FBQyxNQUFNLG9CQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxzQkFBc0I7SUFDdEIseUJBQXlCO0lBQ3pCLGlGQUFpRjtJQUNqRixJQUFJO0lBRUosNEJBQU0sR0FBTixVQUFPLEVBQVU7UUFDYixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFJLHlCQUFXLENBQUMsTUFBTSxpQkFBYyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFqRFEsV0FBVztRQUh2QixpQkFBVSxDQUFDO1lBQ1IsVUFBVSxFQUFFLE1BQU07U0FDckIsQ0FBQzt5Q0FFNEIsaUJBQVU7T0FEM0IsV0FBVyxDQWtEdkI7SUFBRCxrQkFBQztDQUFBLEFBbERELElBa0RDO0FBbERZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi9fbW9kZWxzL3VzZXInO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi8uLi8uLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFVzZXJTZXJ2aWNlIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHsgfVxuXG4gICAgLy9cbiAgICAvLyDilIDilIDilIAgR0VUIEFMTCBDT05ORUNUSU9OUyBGT1IgQSBHSVZFTiBVU0VSIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgIC8vXG5cbiAgICAgICAgZ2V0Q29ubmVjdGlvbnMoaWQ6IG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9jaGF0a2l0L2Nvbm5lY3Rpb25zLyR7aWR9YCk7XG4gICAgICAgIH1cbiAgICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgICAvL1xuICAgIC8vIOKUgOKUgOKUgCBVUERBVEUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gICAgLy9cblxuICAgICAgICB1cGRhdGUodXNlcklkLCBkYXRhKSB7XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGAke2Vudmlyb25tZW50LmFwaVVybH0vY2hhdGtpdC91c2VyLyR7dXNlcklkfWAsIGRhdGEsIHtoZWFkZXJzOiBoZWFkZXJzfSk7XG4gICAgICAgIH1cbiAgICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgICBnZXRBbGwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PFVzZXJbXT4oYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS91c2Vyc2ApO1xuICAgIH1cblxuICAgIGdldEJ5SWQoaWQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L29rdGEvdXNlcnMvYCArIGlkKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlcih1c2VyOiBVc2VyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L3VzZXJzL3JlZ2lzdGVyYCwgdXNlcik7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlKHVzZXI6IGFueSkge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyh1c2VyKTtcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS91cGRhdGVVc2VyL2AgKyB1c2VyLmlkLCB1c2VyKTtcbiAgICAvLyB9XG5cbiAgICBkZWxldGUoaWQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShgJHtlbnZpcm9ubWVudC5hcGlVcmx9L29rdGEvdXNlcnMvYCArIGlkKTtcbiAgICB9XG59XG4iXX0=