"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var messaging_service_1 = require("../Core/_services/messaging.service");
var forms_1 = require("@angular/forms");
var auth_service_1 = require("../Core/_services/auth.service");
var RoomsComponent = /** @class */ (function () {
    //
    // ─── CONSTRUCTOR ────────────────────────────────────────────────────────────────
    //
    function RoomsComponent(http, msgService, _auth) {
        var _this = this;
        this.http = http;
        this.msgService = msgService;
        this._auth = _auth;
        this.selectedFile = null;
        this.fd = new FormData();
        this.rooms = [];
        this.room_messages = [];
        this.roomNotifications = [];
        // TODO: Can probably remove these props
        this._roomPrivate = '';
        this._message = '';
        this.formImport = new forms_1.FormGroup({
            userAvatarFileGroup: new forms_1.FormGroup({
                avatar: new forms_1.FormControl(''),
            }),
            roomNameGroup: new forms_1.FormGroup({
                roomName: new forms_1.FormControl('', [
                    forms_1.Validators.required,
                    forms_1.Validators.maxLength(60)
                ])
            }),
            privateRoomGroup: new forms_1.FormGroup({
                privateRoom: new forms_1.FormControl('')
            })
        });
        this.subscription = this._auth.chatkitUser$.subscribe(function (user) {
            if (user) {
                _this.chatkitUser = user;
                // console.log(this.chatkitUser);
                _this.rooms = user.rooms;
                // console.log(this.rooms);
            }
        });
        this.incomingMessages = this._auth.messages$.subscribe(function (incomingMessage) {
            _this.room_messages.push(incomingMessage);
        });
        this.current_room = this._auth.currentRoom$.subscribe(function (currentRoom) {
            _this.current_room = currentRoom;
            // console.log(currentRoom);
        });
    }
    Object.defineProperty(RoomsComponent.prototype, "roomPrivate", {
        get: function () {
            return this._roomPrivate;
        },
        set: function (value) {
            this._roomPrivate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoomsComponent.prototype, "message", {
        get: function () {
            return this._message;
        },
        set: function (value) {
            this._message = value;
        },
        enumerable: true,
        configurable: true
    });
    // ────────────────────────────────────────────────────────────────────────────────
    RoomsComponent.prototype.onFileChange = function (event) {
        if (!(event.target.files && event.target.files[0])) {
            return;
        }
        this.selectedFile = event.target.files[0];
        this.fd.append('avatar', this.selectedFile, this.selectedFile.name);
        // this.fileToUpload = file;
        // const reader = new FileReader();
        // reader.readAsDataURL(file); // read file as data url
        // reader.onload = (_event) => {
        //   console.log(reader.result); // log base64 string
        //   this.imagePath = reader.result;
        // };
    };
    //
    // ─── VIEW A USER IN THE ROOM ────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.setSelectedRoomMember = function (user) {
        this.selectedRoomMember = user;
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── SEND A MESSAGE ─────────────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.sendMessage = function () {
        var _a = this, message = _a.message, currentUser = _a.currentUser;
        this.chatkitUser.sendMessage({
            text: message,
            roomId: this.current_room.id,
        }).then(function (res) {
            console.log(res);
        });
        this.message = '';
    };
    // ─────────────────────────────────────────────────────────────────
    // Join a room
    RoomsComponent.prototype.joinRoom = function (roomID) {
        var _this = this;
        this.chatkitUser.joinRoom({ roomId: roomID }).then(function (room) {
            _this.current_room = room;
            console.log(_this.current_room);
            // After joining room, fetch messages
            _this.chatkitUser.fetchMultipartMessages({ roomId: roomID }).then(function (messages) {
                // Check if messages
                if (messages === undefined || messages.length === 0) {
                    return;
                }
                // Set read cursor
                _this.chatkitUser.setReadCursor({
                    roomId: _this.current_room.id,
                    position: messages[messages.length - 1].id
                })
                    .then(function () {
                    _this.roomNotifications[room.id] = false;
                }); // Remove marker from notifications array
                // .then(() => {
                //     console.log('Set cursor');
                //   })
                //   .catch(err => {
                //     console.log(`Error setting cursor: ${err}`);
                //   });
                messages.forEach(function (message) {
                    // console.log(message.parts[0].payload.content);
                    // console.log(message);
                });
                _this.room_messages = messages;
            });
        });
    };
    // end Join room
    // Function => check if user has unread messages in a room
    RoomsComponent.prototype.hasUnread = function (roomID) {
        var hasUnread = false; // Track return status
        // First, check if cursor exists
        var cursor = this.chatkitUser.readCursor({
            roomId: roomID
        });
        // if read cursor ID !== latest message ID...
        this.chatkitUser.fetchMultipartMessages({
            roomId: roomID,
            limit: 1,
        })
            .then(function (messages) {
            if (cursor) { // Has cursor so check cursor pos vs latest message id
                hasUnread = (cursor.position !== messages[0].initialId) ? true : false;
            }
            else {
                // No cursor => set
            }
        })
            .catch(function (err) {
            console.log("Error fetching messages: " + err);
        });
        return hasUnread;
    };
    //
    // ─── GET CHATKIT USER ───────────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.getUser = function (user_id) {
        return this.http.post(environment_1.environment.apiUrl + "/chatkit/getuser", { user_id: user_id })
            .toPromise()
            .then(function (res) {
            return res;
            console.log(res);
        })
            .catch(function (error) { return console.log(error); });
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── GET CHATKIT USERS ROOMS ────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.getUserRooms = function (user_id) {
        return this.http.post(environment_1.environment.apiUrl + "/chatkit/getuserrooms", { user_id: user_id })
            .toPromise()
            .then(function (res) {
            // this.rooms = res;
            console.log(res);
            return res;
        })
            .catch(function (error) { return console.log(error); });
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── SUBSCRIBE TO ROOM ──────────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.subscribeToRoom = function (roomID) {
        var _this = this;
        this.chatkitUser.subscribeToRoomMultipart({
            roomId: roomID,
            hooks: {
                onMessage: function (message) {
                    // When a message is received...
                    // Push to messages array and update view
                    _this.room_messages.push(message);
                    // Scroll chat window to reveal latest message
                    // document.getElementById('chatReel').scrollTop = 0;
                    // alert(document.getElementById('chatReel'));
                    // Get the users last cursor position from the room
                    var cursor = _this.chatkitUser.readCursor({
                        roomId: message.roomId
                    });
                    if ((cursor.position !== message.id) && (message.roomId !== _this.current_room.id)) {
                        // If the current user has not seen the message, AND the message was received in a different room,
                        // add marker to notification array
                        _this.roomNotifications[message.room.id] = true;
                    }
                    else {
                        // Otherwise, message was sent in current room, so all we must do is update the
                        // read cursor for the current user's room
                        _this.chatkitUser.setReadCursor({
                            roomId: message.roomId,
                            position: message.id,
                        });
                    }
                    // Count rooms with unread notifucations
                    var roomsWithNotifications = 0;
                    _this.roomNotifications.forEach(function (room) {
                        roomsWithNotifications += room === true ? 1 : 0;
                    });
                    // Add to global notification counter
                    _this.msgService.setRoomsWithNotifications(roomsWithNotifications);
                },
                onAddedToRoom: function (room) {
                    console.log("Added to room " + room.name);
                }
            },
            messageLimit: 1
        });
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── CREATE ROOM ────────────────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.createRoom = function () {
        var _this = this;
        var roomName = this.formImport.value.roomNameGroup.roomName;
        var roomAvatar = '';
        // TODO: Add this to upload service
        // Upload image
        this.http.post(environment_1.environment.apiUrl + "/rooms/avatar", this.fd)
            .toPromise()
            .then(function (avatar) {
            roomAvatar = avatar['filename']; // Store path
            console.log(roomAvatar);
            // Create the room
            _this.chatkitUser.createRoom({
                name: roomName,
                private: false,
                customData: { roomAvatar: roomAvatar },
            }).then(function (room) {
                _this.rooms.push(room); // Add the new room to the list
                _this.roomCreated = true;
                console.log(room);
                console.log("Created room called " + room.name);
            })
                .catch(function (err) {
                console.log("Error creating room " + err);
            });
        });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    RoomsComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Subscribe to new notifications
        this.msgService.notificationCount
            .subscribe(function (notification) { return _this.notificationCount = notification; });
        // Get user id from local storage
        var user_id = JSON.parse(localStorage.getItem('currentUser'))._embedded.user.id;
    };
    RoomsComponent.prototype.ngAfterViewInit = function () {
        // setInterval(this.logtheheight, 3000);
        // console.log(this.chatReel);
        this.chatReel.changes.subscribe(function (c) {
            c.toArray().forEach(function (item) {
                // console.log(item);
                // console.log(item.nativeElement);
                // console.log(item.nativeElement.scrollHeight);
                // console.log('Scroll Height: ' + item.nativeElement.offsetParent.scrollHeight);
                // console.log('Scroll Top: ' + item.nativeElement.offsetParent.scrollTop);
                item.nativeElement.offsetParent.scrollTop = item.nativeElement.offsetParent.scrollHeight;
                // item.nativeElement.scrollTop = item.nativeElement.offsetTop;
                // item.nativeElement.animate({ scrollTop: 0 }, 'fast');
                // item.nativeElement.scrollTop = 0;
            });
        });
        // console.log(elem.nativeElement);
    };
    __decorate([
        core_1.ViewChildren('chatReel'),
        __metadata("design:type", core_1.QueryList)
    ], RoomsComponent.prototype, "chatReel", void 0);
    RoomsComponent = __decorate([
        core_1.Component({
            selector: 'app-rooms',
            templateUrl: './rooms.component.html',
            styleUrls: ['./rooms.component.scss']
        }),
        __metadata("design:paramtypes", [http_1.HttpClient, messaging_service_1.MessagingService, auth_service_1.AuthService])
    ], RoomsComponent);
    return RoomsComponent;
}());
exports.RoomsComponent = RoomsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9yb29tcy9yb29tcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0k7QUFDbEksNkNBQWtEO0FBQ2xELDhEQUE2RDtBQUM3RCx5RUFBdUU7QUFDdkUsd0NBQW9FO0FBRXBFLCtEQUE2RDtBQU83RDtJQXVERSxFQUFFO0lBQ0YsbUZBQW1GO0lBQ25GLEVBQUU7SUFDQSx3QkFBb0IsSUFBZ0IsRUFBVSxVQUE0QixFQUFVLEtBQWtCO1FBQXRHLGlCQXlCQztRQXpCbUIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUFVLGVBQVUsR0FBVixVQUFVLENBQWtCO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQWhEeEcsaUJBQVksR0FBUyxJQUFJLENBQUM7UUFDMUIsT0FBRSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDcEIsVUFBSyxHQUFlLEVBQUUsQ0FBQztRQUd2QixrQkFBYSxHQUFlLEVBQUUsQ0FBQztRQUkvQixzQkFBaUIsR0FBZSxFQUFFLENBQUM7UUFHbkMsd0NBQXdDO1FBQ3hDLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBU2xCLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFRZCxlQUFVLEdBQUcsSUFBSSxpQkFBUyxDQUFDO1lBQ3pCLG1CQUFtQixFQUFFLElBQUksaUJBQVMsQ0FBQztnQkFDakMsTUFBTSxFQUFFLElBQUksbUJBQVcsQ0FBQyxFQUFFLENBQUM7YUFDNUIsQ0FBQztZQUNGLGFBQWEsRUFBRSxJQUFJLGlCQUFTLENBQUM7Z0JBQzNCLFFBQVEsRUFBRSxJQUFJLG1CQUFXLENBQUMsRUFBRSxFQUFFO29CQUM1QixrQkFBVSxDQUFDLFFBQVE7b0JBQ25CLGtCQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztpQkFDekIsQ0FBQzthQUNILENBQUM7WUFDRixnQkFBZ0IsRUFBRSxJQUFJ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LGlCQUFVLEVBQXNCLG9DQUFnQixFQUFpQiwwQkFBVztPQTFEN0YsY0FBYyxDQXlWMUI7SUFBRCxxQkFBQztDQUFBLEFBelZELElBeVZDO0FBelZZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIEVsZW1lbnRSZWYsIFZpZXdDaGlsZCwgQWZ0ZXJWaWV3SW5pdCwgVmlld0NoaWxkcmVuLCBRdWVyeUxpc3QsIFZpZXdDb250YWluZXJSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcbmltcG9ydCB7IE1lc3NhZ2luZ1NlcnZpY2UgfSBmcm9tICcuLi9Db3JlL19zZXJ2aWNlcy9tZXNzYWdpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBGb3JtR3JvdXAsIEZvcm1Db250cm9sLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi4vYXBwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1yb29tcycsXG4gIHRlbXBsYXRlVXJsOiAnLi9yb29tcy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3Jvb21zLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUm9vbXNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuXG4gIEBWaWV3Q2hpbGRyZW4oJ2NoYXRSZWVsJykgY2hhdFJlZWw6IFF1ZXJ5TGlzdDxWaWV3Q29udGFpbmVyUmVmPjtcbiAgY3VyclVzZXI6IGFueTtcbiAgc3Vic2NyaXB0aW9uOiBhbnk7XG4gIGluY29taW5nTWVzc2FnZXM6IGFueTtcbiAgY2hhdGtpdFVzZXI6IGFueTtcbiAgZmlsZVRvVXBsb2FkOiBGaWxlO1xuICBpbWFnZVBhdGg6IGFueTtcbiAgbm90aWZpY2F0aW9uQ291bnQ6IGFueTtcbiAgc2VsZWN0ZWRGaWxlOiBGaWxlID0gbnVsbDtcbiAgZmQgPSBuZXcgRm9ybURhdGEoKTtcbiAgcm9vbXM6IEFycmF5PGFueT4gPSBbXTtcbiAgY3VycmVudFVzZXI6IGFueTtcbiAgdXNlcl9pZDogYW55O1xuICByb29tX21lc3NhZ2VzOiBBcnJheTxhbnk+ID0gW107XG4gIGN1cnJlbnRfcm9vbTogYW55O1xuICBjaGF0VXNlcjogYW55O1xuICByb29tQ3JlYXRlZDogYm9vbGVhbjtcbiAgcm9vbU5vdGlmaWNhdGlvbnM6IEFycmF5PGFueT4gPSBbXTtcbiAgdXJsOiBzdHJpbmc7XG5cbiAgLy8gVE9ETzogQ2FuIHByb2JhYmx5IHJlbW92ZSB0aGVzZSBwcm9wc1xuICBfcm9vbVByaXZhdGUgPSAnJztcbiAgc2VsZWN0ZWRSb29tTWVtYmVyOiBhbnk7XG4gIGdldCByb29tUHJpdmF0ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9yb29tUHJpdmF0ZTtcbiAgfVxuICBzZXQgcm9vbVByaXZhdGUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3Jvb21Qcml2YXRlID0gdmFsdWU7XG4gIH1cblxuICBfbWVzc2FnZSA9ICcnO1xuICBnZXQgbWVzc2FnZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9tZXNzYWdlO1xuICB9XG4gIHNldCBtZXNzYWdlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9tZXNzYWdlID0gdmFsdWU7XG4gIH1cblxuICBmb3JtSW1wb3J0ID0gbmV3IEZvcm1Hcm91cCh7XG4gICAgdXNlckF2YXRhckZpbGVHcm91cDogbmV3IEZvcm1Hcm91cCh7XG4gICAgICBhdmF0YXI6IG5ldyBGb3JtQ29udHJvbCgnJyksXG4gICAgfSksXG4gICAgcm9vbU5hbWVHcm91cDogbmV3IEZvcm1Hcm91cCh7XG4gICAgICByb29tTmFtZTogbmV3IEZvcm1Db250cm9sKCcnLCBbXG4gICAgICAgIFZhbGlkYXRvcnMucmVxdWlyZWQsXG4gICAgICAgIFZhbGlkYXRvcnMubWF4TGVuZ3RoKDYwKVxuICAgICAgXSlcbiAgICB9KSxcbiAgICBwcml2YXRlUm9vbUdyb3VwOiBuZXcgRm9ybUdyb3VwKHtcbiAgICAgIHByaXZhdGVSb29tOiBuZXcgRm9ybUNvbnRyb2woJycpXG4gICAgfSlcbiAgfSk7XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIENPTlNUUlVDVE9SIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHJpdmF0ZSBtc2dTZXJ2aWNlOiBNZXNzYWdpbmdTZXJ2aWNlLCBwcml2YXRlIF9hdXRoOiBBdXRoU2VydmljZSkge1xuXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuX2F1dGguY2hhdGtpdFVzZXIkLnN1YnNjcmliZShcbiAgICAgICAgKHVzZXIpID0+IHtcbiAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgdGhpcy5jaGF0a2l0VXNlciA9IHVzZXI7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNoYXRraXRVc2VyKTtcbiAgICAgICAgICAgIHRoaXMucm9vbXMgPSB1c2VyLnJvb21zO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5yb29tcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuXG4gICAgICB0aGlzLmluY29taW5nTWVzc2FnZXMgPSB0aGlzLl9hdXRoLm1lc3NhZ2VzJC5zdWJzY3JpYmUoXG4gICAgICAgIChpbmNvbWluZ01lc3NhZ2UpID0+IHtcbiAgICAgICAgICB0aGlzLnJvb21fbWVzc2FnZXMucHVzaChpbmNvbWluZ01lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICApO1xuXG4gICAgICB0aGlzLmN1cnJlbnRfcm9vbSA9IHRoaXMuX2F1dGguY3VycmVudFJvb20kLnN1YnNjcmliZShcbiAgICAgICAgKGN1cnJlbnRSb29tKSA9PiB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50X3Jvb20gPSBjdXJyZW50Um9vbTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjdXJyZW50Um9vbSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICBvbkZpbGVDaGFuZ2UoZXZlbnQpIHtcblxuICAgIGlmICghKGV2ZW50LnRhcmdldC5maWxlcyAmJiBldmVudC50YXJnZXQuZmlsZXNbMF0pKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5zZWxlY3RlZEZpbGUgPSA8RmlsZT5ldmVudC50YXJnZXQuZmlsZXNbMF07XG4gICAgdGhpcy5mZC5hcHBlbmQoJ2F2YXRhcicsIHRoaXMuc2VsZWN0ZWRGaWxlLCB0aGlzLnNlbGVjdGVkRmlsZS5uYW1lKTtcbiAgICAvLyB0aGlzLmZpbGVUb1VwbG9hZCA9IGZpbGU7XG4gICAgLy8gY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAvLyByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTsgLy8gcmVhZCBmaWxlIGFzIGRhdGEgdXJsXG4gICAgLy8gcmVhZGVyLm9ubG9hZCA9IChfZXZlbnQpID0+IHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKHJlYWRlci5yZXN1bHQpOyAvLyBsb2cgYmFzZTY0IHN0cmluZ1xuICAgIC8vICAgdGhpcy5pbWFnZVBhdGggPSByZWFkZXIucmVzdWx0O1xuICAgIC8vIH07XG4gIH1cblxuICAvL1xuICAvLyDilIDilIDilIAgVklFVyBBIFVTRVIgSU4gVEhFIFJPT00g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgc2V0U2VsZWN0ZWRSb29tTWVtYmVyKHVzZXI6IGFueSkge1xuICAgIHRoaXMuc2VsZWN0ZWRSb29tTWVtYmVyID0gdXNlcjtcbiAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBTRU5EIEEgTUVTU0FHRSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cbiAgICBzZW5kTWVzc2FnZSgpIHtcbiAgICAgIGNvbnN0IHsgbWVzc2FnZSwgY3VycmVudFVzZXIgfSA9IHRoaXM7XG4gICAgICB0aGlzLmNoYXRraXRVc2VyLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgdGV4dDogbWVzc2FnZSxcbiAgICAgICAgcm9vbUlkOiB0aGlzLmN1cnJlbnRfcm9vbS5pZCxcbiAgICAgIH0pLnRoZW4ocmVzID0+IHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5tZXNzYWdlID0gJyc7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICAvLyBKb2luIGEgcm9vbVxuICBqb2luUm9vbShyb29tSUQpIHtcbiAgICB0aGlzLmNoYXRraXRVc2VyLmpvaW5Sb29tKHtyb29tSWQ6IHJvb21JRH0pLnRoZW4ocm9vbSA9PiB7XG4gICAgICB0aGlzLmN1cnJlbnRfcm9vbSA9IHJvb207XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRfcm9vbSk7XG5cbiAgICAgIC8vIEFmdGVyIGpvaW5pbmcgcm9vbSwgZmV0Y2ggbWVzc2FnZXNcbiAgICAgIHRoaXMuY2hhdGtpdFVzZXIuZmV0Y2hNdWx0aXBhcnRNZXNzYWdlcyh7cm9vbUlkOiByb29tSUR9KS50aGVuKG1lc3NhZ2VzID0+IHtcblxuICAgICAgICAvLyBDaGVjayBpZiBtZXNzYWdlc1xuICAgICAgICBpZiAobWVzc2FnZXMgPT09IHVuZGVmaW5lZCB8fCBtZXNzYWdlcy5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgLy8gU2V0IHJlYWQgY3Vyc29yXG4gICAgICAgIHRoaXMuY2hhdGtpdFVzZXIuc2V0UmVhZEN1cnNvcih7XG4gICAgICAgICAgcm9vbUlkOiB0aGlzLmN1cnJlbnRfcm9vbS5pZCxcbiAgICAgICAgICBwb3NpdGlvbjogbWVzc2FnZXNbbWVzc2FnZXMubGVuZ3RoIC0gMV0uaWRcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMucm9vbU5vdGlmaWNhdGlvbnNbcm9vbS5pZF0gPSBmYWxzZTtcbiAgICAgICAgfSk7IC8vIFJlbW92ZSBtYXJrZXIgZnJvbSBub3RpZmljYXRpb25zIGFycmF5XG4gICAgICAgIC8vIC50aGVuKCgpID0+IHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdTZXQgY3Vyc29yJyk7XG4gICAgICAgIC8vICAgfSlcbiAgICAgICAgLy8gICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGBFcnJvciBzZXR0aW5nIGN1cnNvcjogJHtlcnJ9YCk7XG4gICAgICAgIC8vICAgfSk7XG4gICAgICAgIG1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZSA9PiB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2cobWVzc2FnZS5wYXJ0c1swXS5wYXlsb2FkLmNvbnRlbnQpO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yb29tX21lc3NhZ2VzID0gbWVzc2FnZXM7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICAvLyBlbmQgSm9pbiByb29tXG5cbiAgLy8gRnVuY3Rpb24gPT4gY2hlY2sgaWYgdXNlciBoYXMgdW5yZWFkIG1lc3NhZ2VzIGluIGEgcm9vbVxuICBoYXNVbnJlYWQocm9vbUlEKSB7XG5cbiAgICBsZXQgaGFzVW5yZWFkID0gZmFsc2U7IC8vIFRyYWNrIHJldHVybiBzdGF0dXNcblxuICAgIC8vIEZpcnN0LCBjaGVjayBpZiBjdXJzb3IgZXhpc3RzXG4gICAgY29uc3QgY3Vyc29yID0gdGhpcy5jaGF0a2l0VXNlci5yZWFkQ3Vyc29yKHtcbiAgICAgIHJvb21JZDogcm9vbUlEXG4gICAgfSk7XG5cbiAgICAvLyBpZiByZWFkIGN1cnNvciBJRCAhPT0gbGF0ZXN0IG1lc3NhZ2UgSUQuLi5cbiAgICB0aGlzLmNoYXRraXRVc2VyLmZldGNoTXVsdGlwYXJ0TWVzc2FnZXMoeyAvLyBHZXQgbGF0ZXN0IG1lc3NhZ2VcbiAgICAgIHJvb21JZDogcm9vbUlELFxuICAgICAgbGltaXQ6IDEsXG4gICAgfSlcbiAgICAudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgICBpZiAoY3Vyc29yKSB7IC8vIEhhcyBjdXJzb3Igc28gY2hlY2sgY3Vyc29yIHBvcyB2cyBsYXRlc3QgbWVzc2FnZSBpZFxuICAgICAgICBoYXNVbnJlYWQgPSAoY3Vyc29yLnBvc2l0aW9uICE9PSBtZXNzYWdlc1swXS5pbml0aWFsSWQpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm8gY3Vyc29yID0+IHNldFxuICAgICAgfVxuICAgIH0pXG4gICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgRXJyb3IgZmV0Y2hpbmcgbWVzc2FnZXM6ICR7ZXJyfWApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGhhc1VucmVhZDtcbiAgfVxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgR0VUIENIQVRLSVQgVVNFUiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIGdldFVzZXIodXNlcl9pZCkge1xuICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9jaGF0a2l0L2dldHVzZXJgLCB7dXNlcl9pZH0pXG4gICAgICAudG9Qcm9taXNlKClcbiAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSk7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEdFVCBDSEFUS0lUIFVTRVJTIFJPT01TIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgZ2V0VXNlclJvb21zKHVzZXJfaWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke2Vudmlyb25tZW50LmFwaVVybH0vY2hhdGtpdC9nZXR1c2Vycm9vbXNgLCB7dXNlcl9pZH0pXG4gICAgICAudG9Qcm9taXNlKClcbiAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgIC8vIHRoaXMucm9vbXMgPSByZXM7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSk7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIFNVQlNDUklCRSBUTyBST09NIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgc3Vic2NyaWJlVG9Sb29tKHJvb21JRCkge1xuICAgICAgdGhpcy5jaGF0a2l0VXNlci5zdWJzY3JpYmVUb1Jvb21NdWx0aXBhcnQoe1xuICAgICAgICByb29tSWQ6IHJvb21JRCxcbiAgICAgICAgaG9va3M6IHtcbiAgICAgICAgICBvbk1lc3NhZ2U6IG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgLy8gV2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuLi5cblxuICAgICAgICAgICAgLy8gUHVzaCB0byBtZXNzYWdlcyBhcnJheSBhbmQgdXBkYXRlIHZpZXdcbiAgICAgICAgICAgIHRoaXMucm9vbV9tZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xuICAgICAgICAgICAgLy8gU2Nyb2xsIGNoYXQgd2luZG93IHRvIHJldmVhbCBsYXRlc3QgbWVzc2FnZVxuICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXRSZWVsJykuc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgICAgIC8vIGFsZXJ0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGF0UmVlbCcpKTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSB1c2VycyBsYXN0IGN1cnNvciBwb3NpdGlvbiBmcm9tIHRoZSByb29tXG4gICAgICAgICAgICBjb25zdCBjdXJzb3IgPSB0aGlzLmNoYXRraXRVc2VyLnJlYWRDdXJzb3Ioe1xuICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKChjdXJzb3IucG9zaXRpb24gIT09IG1lc3NhZ2UuaWQpICYmIChtZXNzYWdlLnJvb21JZCAhPT0gdGhpcy5jdXJyZW50X3Jvb20uaWQpKSB7XG4gICAgICAgICAgICAgIC8vIElmIHRoZSBjdXJyZW50IHVzZXIgaGFzIG5vdCBzZWVuIHRoZSBtZXNzYWdlLCBBTkQgdGhlIG1lc3NhZ2Ugd2FzIHJlY2VpdmVkIGluIGEgZGlmZmVyZW50IHJvb20sXG4gICAgICAgICAgICAgIC8vIGFkZCBtYXJrZXIgdG8gbm90aWZpY2F0aW9uIGFycmF5XG4gICAgICAgICAgICAgIHRoaXMucm9vbU5vdGlmaWNhdGlvbnNbbWVzc2FnZS5yb29tLmlkXSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIG1lc3NhZ2Ugd2FzIHNlbnQgaW4gY3VycmVudCByb29tLCBzbyBhbGwgd2UgbXVzdCBkbyBpcyB1cGRhdGUgdGhlXG4gICAgICAgICAgICAgIC8vIHJlYWQgY3Vyc29yIGZvciB0aGUgY3VycmVudCB1c2VyJ3Mgcm9vbVxuICAgICAgICAgICAgICB0aGlzLmNoYXRraXRVc2VyLnNldFJlYWRDdXJzb3Ioe1xuICAgICAgICAgICAgICAgIHJvb21JZDogbWVzc2FnZS5yb29tSWQsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IG1lc3NhZ2UuaWQsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDb3VudCByb29tcyB3aXRoIHVucmVhZCBub3RpZnVjYXRpb25zXG4gICAgICAgICAgICBsZXQgcm9vbXNXaXRoTm90aWZpY2F0aW9ucyA9IDA7XG4gICAgICAgICAgICB0aGlzLnJvb21Ob3RpZmljYXRpb25zLmZvckVhY2gocm9vbSA9PiB7XG4gICAgICAgICAgICAgIHJvb21zV2l0aE5vdGlmaWNhdGlvbnMgKz0gcm9vbSA9PT0gdHJ1ZSA/IDEgOiAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBBZGQgdG8gZ2xvYmFsIG5vdGlmaWNhdGlvbiBjb3VudGVyXG4gICAgICAgICAgICB0aGlzLm1zZ1NlcnZpY2Uuc2V0Um9vbXNXaXRoTm90aWZpY2F0aW9ucyhyb29tc1dpdGhOb3RpZmljYXRpb25zKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uQWRkZWRUb1Jvb206IHJvb20gPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEFkZGVkIHRvIHJvb20gJHtyb29tLm5hbWV9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlTGltaXQ6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBDUkVBVEUgUk9PTSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIGNyZWF0ZVJvb20oKSB7IC8vIFRPRE86IEFkZCB0byBtZXNzYWdlIHNlcnZpY2VcblxuICAgICAgY29uc3Qgcm9vbU5hbWUgPSB0aGlzLmZvcm1JbXBvcnQudmFsdWUucm9vbU5hbWVHcm91cC5yb29tTmFtZTtcbiAgICAgIGxldCByb29tQXZhdGFyID0gJyc7XG5cbiAgICAgIC8vIFRPRE86IEFkZCB0aGlzIHRvIHVwbG9hZCBzZXJ2aWNlXG4gICAgICAvLyBVcGxvYWQgaW1hZ2VcbiAgICAgIHRoaXMuaHR0cC5wb3N0KGAke2Vudmlyb25tZW50LmFwaVVybH0vcm9vbXMvYXZhdGFyYCwgdGhpcy5mZClcbiAgICAgIC50b1Byb21pc2UoKVxuICAgICAgLnRoZW4oIGF2YXRhciA9PiB7XG4gICAgICAgIHJvb21BdmF0YXIgPSBhdmF0YXJbJ2ZpbGVuYW1lJ107IC8vIFN0b3JlIHBhdGhcbiAgICAgICAgY29uc29sZS5sb2cocm9vbUF2YXRhcik7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgcm9vbVxuICAgICAgICB0aGlzLmNoYXRraXRVc2VyLmNyZWF0ZVJvb20oeyAvLyBDcmVhdGUgdGhlIHJvb21cbiAgICAgICAgICBuYW1lOiByb29tTmFtZSxcbiAgICAgICAgICBwcml2YXRlOiBmYWxzZSxcbiAgICAgICAgICBjdXN0b21EYXRhOiB7IHJvb21BdmF0YXI6IHJvb21BdmF0YXIgfSwgLy8gQWRkIHJvb20gYXZhdGFyIHRvIGN1c3RvbSByb29tIGRhdGFcbiAgICAgICAgfSkudGhlbiggcm9vbSA9PiB7IC8vIFN1Y2Nlc1xuICAgICAgICAgICAgdGhpcy5yb29tcy5wdXNoKHJvb20pOyAvLyBBZGQgdGhlIG5ldyByb29tIHRvIHRoZSBsaXN0XG4gICAgICAgICAgICB0aGlzLnJvb21DcmVhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJvb20pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYENyZWF0ZWQgcm9vbSBjYWxsZWQgJHtyb29tLm5hbWV9YCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZXJyID0+IHsgLy8gRmFpbGVkIHJvb20gY3JlYXRpb25cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBjcmVhdGluZyByb29tICR7ZXJyfWApO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIFN1YnNjcmliZSB0byBuZXcgbm90aWZpY2F0aW9uc1xuICAgIHRoaXMubXNnU2VydmljZS5ub3RpZmljYXRpb25Db3VudFxuICAgIC5zdWJzY3JpYmUobm90aWZpY2F0aW9uID0+IHRoaXMubm90aWZpY2F0aW9uQ291bnQgPSBub3RpZmljYXRpb24pO1xuXG4gICAgLy8gR2V0IHVzZXIgaWQgZnJvbSBsb2NhbCBzdG9yYWdlXG4gICAgY29uc3QgdXNlcl9pZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRVc2VyJykpLl9lbWJlZGRlZC51c2VyLmlkO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIHNldEludGVydmFsKHRoaXMubG9ndGhlaGVpZ2h0LCAzMDAwKTtcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNoYXRSZWVsKTtcbiAgICB0aGlzLmNoYXRSZWVsLmNoYW5nZXMuc3Vic2NyaWJlKGMgPT4geyBjLnRvQXJyYXkoKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhpdGVtLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgLy8gY29uc29sZS5sb2coaXRlbS5uYXRpdmVFbGVtZW50LnNjcm9sbEhlaWdodCk7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTY3JvbGwgSGVpZ2h0OiAnICsgaXRlbS5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudC5zY3JvbGxIZWlnaHQpO1xuICAgICAgLy8gY29uc29sZS5sb2coJ1Njcm9sbCBUb3A6ICcgKyBpdGVtLm5hdGl2ZUVsZW1lbnQub2Zmc2V0UGFyZW50LnNjcm9sbFRvcCk7XG5cbiAgICAgIGl0ZW0ubmF0aXZlRWxlbWVudC5vZmZzZXRQYXJlbnQuc2Nyb2xsVG9wID0gaXRlbS5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudC5zY3JvbGxIZWlnaHQ7XG4gICAgICAvLyBpdGVtLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gaXRlbS5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgIC8vIGl0ZW0ubmF0aXZlRWxlbWVudC5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sICdmYXN0Jyk7XG4gICAgICAvLyBpdGVtLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgICB9KTtcbiAgfSk7XG4gICAgLy8gY29uc29sZS5sb2coZWxlbS5uYXRpdmVFbGVtZW50KTtcbiAgfVxufVxuIl19