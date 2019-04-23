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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2YmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvYXBwL1NoYXJlZC9uYXZiYXIvbmF2YmFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5RDtBQUN6RCw0RUFBMEU7QUFDMUUsa0VBQWdFO0FBU2hFO0lBTUUseUJBQW9CLEtBQWtCLEVBQVUsVUFBNEI7UUFBNUUsaUJBWUM7UUFabUIsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQUFVLGVBQVUsR0FBVixVQUFVLENBQWtCO1FBRjVFLHlCQUFvQixHQUFlLEVBQUUsQ0FBQztRQUlwQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQy9CLFVBQUMsSUFBSTtZQUVILEtBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBRWhELElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQy9CLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM3QjtRQUNILENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELDBDQUFnQixHQUFoQixVQUFpQixJQUFJO1FBQXJCLGlCQWlDQztRQS9CQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVWLHdEQUF3RDtRQUN4RCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtZQUVoQixxQkFBcUI7WUFDckIsSUFBSSxDQUFDLHNCQUFzQixDQUFDO2dCQUMxQixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQ2YsU0FBUyxFQUFFLE9BQU87Z0JBQ2xCLEtBQUssRUFBRSxDQUFDO2FBQ1QsQ0FBQztpQkFDQyxJQUFJLENBQUMsVUFBQSxRQUFRO2dCQUVaLG9DQUFvQztnQkFDcEMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7b0JBQ25DLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtpQkFDaEIsQ0FBQyxDQUFDLFFBQVEsRUFBRTtvQkFFWCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFrQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQU0sQ0FBQyxDQUFDO29CQUN2RCxLQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUV0QztZQUNILENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsVUFBQSxHQUFHO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQTRCLEdBQUssQ0FBQyxDQUFDO1lBQ2pELENBQUMsQ0FBQyxDQUFDO1lBRUgsQ0FBQyxFQUFFLENBQUM7UUFFUixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxrQ0FBUSxHQUFSLGNBQVksQ0FBQztJQXZERixlQUFlO1FBTDNCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsWUFBWTtZQUN0QixXQUFXLEVBQUUseUJBQXlCO1lBQ3RDLFNBQVMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO1NBQ3ZDLENBQUM7eUNBTzJCLDBCQUFXLEVBQXNCLG9DQUFnQjtPQU5qRSxlQUFlLENBd0QzQjtJQUFELHNCQUFDO0NBQUEsQUF4REQsSUF3REM7QUF4RFksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1lc3NhZ2luZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9tZXNzYWdpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyL3NyYy91dGlscy9jb2xsZWN0aW9uJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5hdmJhcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9uYXZiYXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uYXZiYXIuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBOYXZiYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGN1cnJlbnRVc2VyOiBhbnk7XG4gIHJvb21zOiBBcnJheTxhbnk+O1xuICByb29tc1dpdGhOZXdNZXNzYWdlczogQXJyYXk8YW55PiA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2F1dGg6IEF1dGhTZXJ2aWNlLCBwcml2YXRlIF9tZXNzYWdpbmc6IE1lc3NhZ2luZ1NlcnZpY2UpIHtcblxuICAgIHRoaXMuX2F1dGguY2hhdGtpdFVzZXIkLnN1YnNjcmliZShcbiAgICAgICh1c2VyKSA9PiB7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VXNlciA9ICh1c2VyICE9IG51bGwpID8gdXNlciA6IG51bGw7XG5cbiAgICAgICAgaWYgKCh1c2VyICE9IG51bGwpICYmICh1c2VyLmlkKSkge1xuICAgICAgICAgIHRoaXMuc2V0Tm90aWZpY2F0aW9ucyh1c2VyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBzZXROb3RpZmljYXRpb25zKHVzZXIpIHtcblxuICAgIGNvbnN0IHJvb21zID0gdXNlci5yb29tcztcbiAgICBsZXQgaSA9IDA7XG5cbiAgICAvLyBmb3JlYWNoIHJvb20gLT4gY29tcGFyZSBsYXRlc3QgbWVzc2FnZSB0byB1c2VyIGN1cnNvclxuICAgIHJvb21zLmZvckVhY2gocm9vbSA9PiB7XG5cbiAgICAgIC8vIGdldCBsYXRlc3QgbWVzc2FnZVxuICAgICAgdXNlci5mZXRjaE11bHRpcGFydE1lc3NhZ2VzKHtcbiAgICAgICAgcm9vbUlkOiByb29tLmlkLFxuICAgICAgICBkaXJlY3Rpb246ICdvbGRlcicsXG4gICAgICAgIGxpbWl0OiAxLFxuICAgICAgfSlcbiAgICAgICAgLnRoZW4obWVzc2FnZXMgPT4ge1xuXG4gICAgICAgICAgLy8gY29tcGFyZSBkYXRlcyAtPiBkZXRlcm1pbmUgaWYgbmV3XG4gICAgICAgICAgaWYgKG1lc3NhZ2VzWzBdLmlkID4gdXNlci5yZWFkQ3Vyc29yKHtcbiAgICAgICAgICAgIHJvb21JZDogcm9vbS5pZFxuICAgICAgICAgIH0pLnBvc2l0aW9uKSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBOZXcgbWVzc2FnZSBpbiAke21lc3NhZ2VzWzBdLnJvb20ubmFtZX1gKTtcbiAgICAgICAgICAgIHRoaXMucm9vbXNXaXRoTmV3TWVzc2FnZXMucHVzaChyb29tKTtcblxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIGZldGNoaW5nIG1lc3NhZ2VzOiAke2Vycn1gKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaSsrO1xuXG4gICAgfSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHt9XG59XG4iXX0=