"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var messaging_service_1 = require("../../Core/_services/messaging.service");
var auth_service_1 = require("../../Core/_services/auth.service");
var NavbarComponent = /** @class */ (function () {
    function NavbarComponent(_auth, _messaging) {
        var _this = this;
        this._auth = _auth;
        this._messaging = _messaging;
        this.roomsWithNewMessages = [];
        this._auth.chatkitUser$.subscribe(function (user) {
            _this.currentUser = (user != null) ? user : null;
            if ((user != null) && (user.id)) {
                _this.setNotifications(user);
            }
        });
    }
    NavbarComponent.prototype.setNotifications = function (user) {
        var _this = this;
        var rooms = user.rooms;
        var i = 0;
        // foreach room -> compare latest message to user cursor
        rooms.forEach(function (room) {
            // get latest message
            user.fetchMultipartMessages({
                roomId: room.id,
                direction: 'older',
                limit: 1,
            })
                .then(function (messages) {
                // compare dates -> determine if new
                if (messages[0].id > user.readCursor({
                    roomId: room.id
                }).position) {
                    console.log("New message in " + messages[0].room.name);
                    _this.roomsWithNewMessages.push(room);
                }
            })
                .catch(function (err) {
                console.log("Error fetching messages: " + err);
            });
            i++;
        });
    };
    NavbarComponent.prototype.ngOnInit = function () { };
    NavbarComponent = __decorate([
        core_1.Component({
            selector: 'app-navbar',
            templateUrl: './navbar.component.html',
            styleUrls: ['./navbar.component.scss']
        }),
        __metadata("design:paramtypes", [auth_service_1.AuthService, messaging_service_1.MessagingService])
    ], NavbarComponent);
    return NavbarComponent;
}());
exports.NavbarComponent = NavbarComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2YmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvU2hhcmVkL25hdmJhci9uYXZiYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlEO0FBQ3pELDRFQUEwRTtBQUMxRSxrRUFBZ0U7QUFTaEU7SUFNRSx5QkFBb0IsS0FBa0IsRUFBVSxVQUE0QjtRQUE1RSxpQkFZQztRQVptQixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBa0I7UUFGNUUseUJBQW9CLEdBQWUsRUFBRSxDQUFDO1FBSXBDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FDL0IsVUFBQyxJQUFJO1lBRUgsS0FBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFFaEQsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDL0IsS0FBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzdCO1FBQ0gsQ0FBQyxDQUNGLENBQUM7SUFDSixDQUFDO0lBRUQsMENBQWdCLEdBQWhCLFVBQWlCLElBQUk7UUFBckIsaUJBaUNDO1FBL0JDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRVYsd0RBQXdEO1FBQ3hELEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO1lBRWhCLHFCQUFxQjtZQUNyQixJQUFJLENBQUMsc0JBQXNCLENBQUM7Z0JBQzFCLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDZixTQUFTLEVBQUUsT0FBTztnQkFDbEIsS0FBSyxFQUFFLENBQUM7YUFDVCxDQUFDO2lCQUNDLElBQUksQ0FBQyxVQUFBLFFBQVE7Z0JBRVosb0NBQW9DO2dCQUNwQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztvQkFDbkMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO2lCQUNoQixDQUFDLENBQUMsUUFBUSxFQUFFO29CQUVYLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQWtCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBTSxDQUFDLENBQUM7b0JBQ3ZELEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBRXRDO1lBQ0gsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxVQUFBLEdBQUc7Z0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBNEIsR0FBSyxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDLENBQUM7WUFFSCxDQUFDLEVBQUUsQ0FBQztRQUVSLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGtDQUFRLEdBQVIsY0FBWSxDQUFDO0lBdkRGLGVBQWU7UUFMM0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFdBQVcsRUFBRSx5QkFBeUI7WUFDdEMsU0FBUyxFQUFFLENBQUMseUJBQXlCLENBQUM7U0FDdkMsQ0FBQzt5Q0FPMkIsMEJBQVcsRUFBc0Isb0NBQWdCO09BTmpFLGVBQWUsQ0F3RDNCO0lBQUQsc0JBQUM7Q0FBQSxBQXhERCxJQXdEQztBQXhEWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWVzc2FnaW5nU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL21lc3NhZ2luZy5zZXJ2aWNlJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZvckVhY2ggfSBmcm9tICdAYW5ndWxhci9yb3V0ZXIvc3JjL3V0aWxzL2NvbGxlY3Rpb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbmF2YmFyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25hdmJhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25hdmJhci5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5hdmJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgY3VycmVudFVzZXI6IGFueTtcbiAgcm9vbXM6IEFycmF5PGFueT47XG4gIHJvb21zV2l0aE5ld01lc3NhZ2VzOiBBcnJheTxhbnk+ID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfYXV0aDogQXV0aFNlcnZpY2UsIHByaXZhdGUgX21lc3NhZ2luZzogTWVzc2FnaW5nU2VydmljZSkge1xuXG4gICAgdGhpcy5fYXV0aC5jaGF0a2l0VXNlciQuc3Vic2NyaWJlKFxuICAgICAgKHVzZXIpID0+IHtcblxuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gKHVzZXIgIT0gbnVsbCkgPyB1c2VyIDogbnVsbDtcblxuICAgICAgICBpZiAoKHVzZXIgIT0gbnVsbCkgJiYgKHVzZXIuaWQpKSB7XG4gICAgICAgICAgdGhpcy5zZXROb3RpZmljYXRpb25zKHVzZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHNldE5vdGlmaWNhdGlvbnModXNlcikge1xuXG4gICAgY29uc3Qgcm9vbXMgPSB1c2VyLnJvb21zO1xuICAgIGxldCBpID0gMDtcblxuICAgIC8vIGZvcmVhY2ggcm9vbSAtPiBjb21wYXJlIGxhdGVzdCBtZXNzYWdlIHRvIHVzZXIgY3Vyc29yXG4gICAgcm9vbXMuZm9yRWFjaChyb29tID0+IHtcblxuICAgICAgLy8gZ2V0IGxhdGVzdCBtZXNzYWdlXG4gICAgICB1c2VyLmZldGNoTXVsdGlwYXJ0TWVzc2FnZXMoe1xuICAgICAgICByb29tSWQ6IHJvb20uaWQsXG4gICAgICAgIGRpcmVjdGlvbjogJ29sZGVyJyxcbiAgICAgICAgbGltaXQ6IDEsXG4gICAgICB9KVxuICAgICAgICAudGhlbihtZXNzYWdlcyA9PiB7XG5cbiAgICAgICAgICAvLyBjb21wYXJlIGRhdGVzIC0+IGRldGVybWluZSBpZiBuZXdcbiAgICAgICAgICBpZiAobWVzc2FnZXNbMF0uaWQgPiB1c2VyLnJlYWRDdXJzb3Ioe1xuICAgICAgICAgICAgcm9vbUlkOiByb29tLmlkXG4gICAgICAgICAgfSkucG9zaXRpb24pIHtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coYE5ldyBtZXNzYWdlIGluICR7bWVzc2FnZXNbMF0ucm9vbS5uYW1lfWApO1xuICAgICAgICAgICAgdGhpcy5yb29tc1dpdGhOZXdNZXNzYWdlcy5wdXNoKHJvb20pO1xuXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgZmV0Y2hpbmcgbWVzc2FnZXM6ICR7ZXJyfWApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpKys7XG5cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge31cbn1cbiJdfQ==