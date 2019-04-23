"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var messaging_service_1 = require("../../Core/_services/messaging.service");
var auth_service_1 = require("../../Core/_services/auth.service");
var NavbarComponent = /** @class */ (function () {
    function NavbarComponent(authService, messageService) {
        this.authService = authService;
        this.messageService = messageService;
        this.roomsWithNewMessages = [];
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
    NavbarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.getCurrentUser().subscribe(function (user) {
            _this.currentUser = user;
        });
        console.log(this.currentUser);
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2YmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvU2hhcmVkL25hdmJhci9uYXZiYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlEO0FBQ3pELDRFQUEwRTtBQUMxRSxrRUFBZ0U7QUFTaEU7SUFNRSx5QkFBb0IsV0FBd0IsRUFBVSxjQUFnQztRQUFsRSxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFrQjtRQUZ0Rix5QkFBb0IsR0FBZSxFQUFFLENBQUM7SUFFbUQsQ0FBQztJQUUxRiwwQ0FBZ0IsR0FBaEIsVUFBaUIsSUFBSTtRQUFyQixpQkFpQ0M7UUEvQkMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFVix3REFBd0Q7UUFDeEQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7WUFFaEIscUJBQXFCO1lBQ3JCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztnQkFDMUIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNmLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixLQUFLLEVBQUUsQ0FBQzthQUNULENBQUM7aUJBQ0MsSUFBSSxDQUFDLFVBQUEsUUFBUTtnQkFFWixvQ0FBb0M7Z0JBQ3BDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUNuQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7aUJBQ2hCLENBQUMsQ0FBQyxRQUFRLEVBQUU7b0JBRVgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBa0IsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFNLENBQUMsQ0FBQztvQkFDdkQsS0FBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFFdEM7WUFDSCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLFVBQUEsR0FBRztnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE0QixHQUFLLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQztZQUVILENBQUMsRUFBRSxDQUFDO1FBRVIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsa0NBQVEsR0FBUjtRQUFBLGlCQU9DO1FBTEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBQyxJQUFJO1lBQy9DLEtBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO1FBQ3pCLENBQUMsQ0FBQyxDQUFBO1FBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDL0IsQ0FBQztJQWxEVSxlQUFlO1FBTDNCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsWUFBWTtZQUN0QixXQUFXLEVBQUUseUJBQXlCO1lBQ3RDLFNBQVMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO1NBQ3ZDLENBQUM7eUNBT2lDLDBCQUFXLEVBQTBCLG9DQUFnQjtPQU4zRSxlQUFlLENBbUQzQjtJQUFELHNCQUFDO0NBQUEsQUFuREQsSUFtREM7QUFuRFksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1lc3NhZ2luZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9tZXNzYWdpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyL3NyYy91dGlscy9jb2xsZWN0aW9uJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5hdmJhcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9uYXZiYXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uYXZiYXIuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBOYXZiYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGN1cnJlbnRVc2VyOiBhbnk7XG4gIHJvb21zOiBBcnJheTxhbnk+O1xuICByb29tc1dpdGhOZXdNZXNzYWdlczogQXJyYXk8YW55PiA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLCBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdpbmdTZXJ2aWNlKSB7fVxuXG4gIHNldE5vdGlmaWNhdGlvbnModXNlcikge1xuXG4gICAgY29uc3Qgcm9vbXMgPSB1c2VyLnJvb21zO1xuICAgIGxldCBpID0gMDtcblxuICAgIC8vIGZvcmVhY2ggcm9vbSAtPiBjb21wYXJlIGxhdGVzdCBtZXNzYWdlIHRvIHVzZXIgY3Vyc29yXG4gICAgcm9vbXMuZm9yRWFjaChyb29tID0+IHtcblxuICAgICAgLy8gZ2V0IGxhdGVzdCBtZXNzYWdlXG4gICAgICB1c2VyLmZldGNoTXVsdGlwYXJ0TWVzc2FnZXMoe1xuICAgICAgICByb29tSWQ6IHJvb20uaWQsXG4gICAgICAgIGRpcmVjdGlvbjogJ29sZGVyJyxcbiAgICAgICAgbGltaXQ6IDEsXG4gICAgICB9KVxuICAgICAgICAudGhlbihtZXNzYWdlcyA9PiB7XG5cbiAgICAgICAgICAvLyBjb21wYXJlIGRhdGVzIC0+IGRldGVybWluZSBpZiBuZXdcbiAgICAgICAgICBpZiAobWVzc2FnZXNbMF0uaWQgPiB1c2VyLnJlYWRDdXJzb3Ioe1xuICAgICAgICAgICAgcm9vbUlkOiByb29tLmlkXG4gICAgICAgICAgfSkucG9zaXRpb24pIHtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coYE5ldyBtZXNzYWdlIGluICR7bWVzc2FnZXNbMF0ucm9vbS5uYW1lfWApO1xuICAgICAgICAgICAgdGhpcy5yb29tc1dpdGhOZXdNZXNzYWdlcy5wdXNoKHJvb20pO1xuXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgZmV0Y2hpbmcgbWVzc2FnZXM6ICR7ZXJyfWApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpKys7XG5cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuXG4gICAgdGhpcy5hdXRoU2VydmljZS5nZXRDdXJyZW50VXNlcigpLnN1YnNjcmliZSgodXNlcikgPT4ge1xuICAgICAgdGhpcy5jdXJyZW50VXNlciA9IHVzZXJcbiAgICB9KVxuXG4gICAgY29uc29sZS5sb2codGhpcy5jdXJyZW50VXNlcilcbiAgfVxufVxuIl19