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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2YmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL2FwcC9TaGFyZWQvbmF2YmFyL25hdmJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFDekQsNEVBQTBFO0FBQzFFLGtFQUFnRTtBQVNoRTtJQU1FLHlCQUFvQixLQUFrQixFQUFVLFVBQTRCO1FBQTVFLGlCQVlDO1FBWm1CLFVBQUssR0FBTCxLQUFLLENBQWE7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFrQjtRQUY1RSx5QkFBb0IsR0FBZSxFQUFFLENBQUM7UUFJcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUMvQixVQUFDLElBQUk7WUFFSCxLQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUVoRCxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUMvQixLQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDN0I7UUFDSCxDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCwwQ0FBZ0IsR0FBaEIsVUFBaUIsSUFBSTtRQUFyQixpQkFpQ0M7UUEvQkMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFVix3REFBd0Q7UUFDeEQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7WUFFaEIscUJBQXFCO1lBQ3JCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztnQkFDMUIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNmLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixLQUFLLEVBQUUsQ0FBQzthQUNULENBQUM7aUJBQ0MsSUFBSSxDQUFDLFVBQUEsUUFBUTtnQkFFWixvQ0FBb0M7Z0JBQ3BDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUNuQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7aUJBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUU7b0JBRVgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBa0IsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFNLENBQUMsQ0FBQztvQkFDdkQsS0FBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFFdEM7WUFDSCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLFVBQUEsR0FBRztnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE0QixHQUFLLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQztZQUVILENBQUMsRUFBRSxDQUFDO1FBRVIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsa0NBQVEsR0FBUixjQUFZLENBQUM7SUF2REYsZUFBZTtRQUwzQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFlBQVk7WUFDdEIsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxTQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztTQUN2QyxDQUFDO3lDQU8yQiwwQkFBVyxFQUFzQixvQ0FBZ0I7T0FOakUsZUFBZSxDQXdEM0I7SUFBRCxzQkFBQztDQUFBLEFBeERELElBd0RDO0FBeERZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNZXNzYWdpbmdTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvbWVzc2FnaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlci9zcmMvdXRpbHMvY29sbGVjdGlvbic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1uYXZiYXInLFxuICB0ZW1wbGF0ZVVybDogJy4vbmF2YmFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmF2YmFyLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmF2YmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjdXJyZW50VXNlcjogYW55O1xuICByb29tczogQXJyYXk8YW55PjtcbiAgcm9vbXNXaXRoTmV3TWVzc2FnZXM6IEFycmF5PGFueT4gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9hdXRoOiBBdXRoU2VydmljZSwgcHJpdmF0ZSBfbWVzc2FnaW5nOiBNZXNzYWdpbmdTZXJ2aWNlKSB7XG5cbiAgICB0aGlzLl9hdXRoLmNoYXRraXRVc2VyJC5zdWJzY3JpYmUoXG4gICAgICAodXNlcikgPT4ge1xuXG4gICAgICAgIHRoaXMuY3VycmVudFVzZXIgPSAodXNlciAhPSBudWxsKSA/IHVzZXIgOiBudWxsO1xuXG4gICAgICAgIGlmICgodXNlciAhPSBudWxsKSAmJiAodXNlci5pZCkpIHtcbiAgICAgICAgICB0aGlzLnNldE5vdGlmaWNhdGlvbnModXNlcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgc2V0Tm90aWZpY2F0aW9ucyh1c2VyKSB7XG5cbiAgICBjb25zdCByb29tcyA9IHVzZXIucm9vbXM7XG4gICAgbGV0IGkgPSAwO1xuXG4gICAgLy8gZm9yZWFjaCByb29tIC0+IGNvbXBhcmUgbGF0ZXN0IG1lc3NhZ2UgdG8gdXNlciBjdXJzb3JcbiAgICByb29tcy5mb3JFYWNoKHJvb20gPT4ge1xuXG4gICAgICAvLyBnZXQgbGF0ZXN0IG1lc3NhZ2VcbiAgICAgIHVzZXIuZmV0Y2hNdWx0aXBhcnRNZXNzYWdlcyh7XG4gICAgICAgIHJvb21JZDogcm9vbS5pZCxcbiAgICAgICAgZGlyZWN0aW9uOiAnb2xkZXInLFxuICAgICAgICBsaW1pdDogMSxcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKG1lc3NhZ2VzID0+IHtcblxuICAgICAgICAgIC8vIGNvbXBhcmUgZGF0ZXMgLT4gZGV0ZXJtaW5lIGlmIG5ld1xuICAgICAgICAgIGlmIChtZXNzYWdlc1swXS5pZCA+IHVzZXIucmVhZEN1cnNvcih7XG4gICAgICAgICAgICByb29tSWQ6IHJvb20uaWRcbiAgICAgICAgICB9KS5wb3NpdGlvbikge1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgTmV3IG1lc3NhZ2UgaW4gJHttZXNzYWdlc1swXS5yb29tLm5hbWV9YCk7XG4gICAgICAgICAgICB0aGlzLnJvb21zV2l0aE5ld01lc3NhZ2VzLnB1c2gocm9vbSk7XG5cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBmZXRjaGluZyBtZXNzYWdlczogJHtlcnJ9YCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGkrKztcblxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7fVxufVxuIl19