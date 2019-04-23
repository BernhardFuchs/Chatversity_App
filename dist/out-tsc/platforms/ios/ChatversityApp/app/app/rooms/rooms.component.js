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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvYXBwL3Jvb21zL3Jvb21zLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrSTtBQUNsSSw2Q0FBa0Q7QUFDbEQsOERBQTZEO0FBQzdELHlFQUF1RTtBQUN2RSx3Q0FBb0U7QUFFcEUsK0RBQTZEO0FBTzdEO0lBdURFLEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUNBLHdCQUFvQixJQUFnQixFQUFVLFVBQTRCLEVBQVUsS0FBa0I7UUFBdEcsaUJBeUJDO1FBekJtQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBa0I7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFhO1FBaER4RyxpQkFBWSxHQUFTLElBQUksQ0FBQztRQUMxQixPQUFFLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUNwQixVQUFLLEdBQWUsRUFBRSxDQUFDO1FBR3ZCLGtCQUFhLEdBQWUsRUFBRSxDQUFDO1FBSS9CLHNCQUFpQixHQUFlLEVBQUUsQ0FBQztRQUduQyx3Q0FBd0M7UUFDeEMsaUJBQVksR0FBRyxFQUFFLENBQUM7UUFTbEIsYUFBUSxHQUFHLEVBQUUsQ0FBQztRQVFkLGVBQVUsR0FBRyxJQUFJLGlCQUFTLENBQUM7WUFDekIsbUJBQW1CLEVBQUUsSUFBSSxpQkFBUyxDQUFDO2dCQUNqQyxNQUFNLEVBQUUsSUFBSSxtQkFBVyxDQUFDLEVBQUUsQ0FBQzthQUM1QixDQUFDO1lBQ0YsYUFBYSxFQUFFLElBQUksaUJBQVMsQ0FBQztnQkFDM0IsUUFBUSxFQUFFLElBQUksbUJBQVcsQ0FBQyxFQUFFLEVBQUU7b0JBQzVCLGtCQUFVLENBQUMsUUFBUTtvQkFDbkIsa0JBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO2lCQUN6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QUUsQ0FBQyx3QkFBd0IsQ0FBQztTQUN0QyxDQUFDO3lDQTJENEIsaUJBQVUsRUFBc0Isb0NBQWdCLEVBQWlCLDBCQUFXO09BMUQ3RixjQUFjLENBeVYxQjtJQUFELHFCQUFDO0NBQUEsQUF6VkQsSUF5VkM7QUF6Vlksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgRWxlbWVudFJlZiwgVmlld0NoaWxkLCBBZnRlclZpZXdJbml0LCBWaWV3Q2hpbGRyZW4sIFF1ZXJ5TGlzdCwgVmlld0NvbnRhaW5lclJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi8uLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgTWVzc2FnaW5nU2VydmljZSB9IGZyb20gJy4uL0NvcmUvX3NlcnZpY2VzL21lc3NhZ2luZy5zZXJ2aWNlJztcbmltcG9ydCB7IEZvcm1Hcm91cCwgRm9ybUNvbnRyb2wsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuLi9hcHAuY29tcG9uZW50JztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXJvb21zJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3Jvb21zLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcm9vbXMuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBSb29tc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgQFZpZXdDaGlsZHJlbignY2hhdFJlZWwnKSBjaGF0UmVlbDogUXVlcnlMaXN0PFZpZXdDb250YWluZXJSZWY+O1xuICBjdXJyVXNlcjogYW55O1xuICBzdWJzY3JpcHRpb246IGFueTtcbiAgaW5jb21pbmdNZXNzYWdlczogYW55O1xuICBjaGF0a2l0VXNlcjogYW55O1xuICBmaWxlVG9VcGxvYWQ6IEZpbGU7XG4gIGltYWdlUGF0aDogYW55O1xuICBub3RpZmljYXRpb25Db3VudDogYW55O1xuICBzZWxlY3RlZEZpbGU6IEZpbGUgPSBudWxsO1xuICBmZCA9IG5ldyBGb3JtRGF0YSgpO1xuICByb29tczogQXJyYXk8YW55PiA9IFtdO1xuICBjdXJyZW50VXNlcjogYW55O1xuICB1c2VyX2lkOiBhbnk7XG4gIHJvb21fbWVzc2FnZXM6IEFycmF5PGFueT4gPSBbXTtcbiAgY3VycmVudF9yb29tOiBhbnk7XG4gIGNoYXRVc2VyOiBhbnk7XG4gIHJvb21DcmVhdGVkOiBib29sZWFuO1xuICByb29tTm90aWZpY2F0aW9uczogQXJyYXk8YW55PiA9IFtdO1xuICB1cmw6IHN0cmluZztcblxuICAvLyBUT0RPOiBDYW4gcHJvYmFibHkgcmVtb3ZlIHRoZXNlIHByb3BzXG4gIF9yb29tUHJpdmF0ZSA9ICcnO1xuICBzZWxlY3RlZFJvb21NZW1iZXI6IGFueTtcbiAgZ2V0IHJvb21Qcml2YXRlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvb21Qcml2YXRlO1xuICB9XG4gIHNldCByb29tUHJpdmF0ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fcm9vbVByaXZhdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIF9tZXNzYWdlID0gJyc7XG4gIGdldCBtZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX21lc3NhZ2U7XG4gIH1cbiAgc2V0IG1lc3NhZ2UodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX21lc3NhZ2UgPSB2YWx1ZTtcbiAgfVxuXG4gIGZvcm1JbXBvcnQgPSBuZXcgRm9ybUdyb3VwKHtcbiAgICB1c2VyQXZhdGFyRmlsZUdyb3VwOiBuZXcgRm9ybUdyb3VwKHtcbiAgICAgIGF2YXRhcjogbmV3IEZvcm1Db250cm9sKCcnKSxcbiAgICB9KSxcbiAgICByb29tTmFtZUdyb3VwOiBuZXcgRm9ybUdyb3VwKHtcbiAgICAgIHJvb21OYW1lOiBuZXcgRm9ybUNvbnRyb2woJycsIFtcbiAgICAgICAgVmFsaWRhdG9ycy5yZXF1aXJlZCxcbiAgICAgICAgVmFsaWRhdG9ycy5tYXhMZW5ndGgoNjApXG4gICAgICBdKVxuICAgIH0pLFxuICAgIHByaXZhdGVSb29tR3JvdXA6IG5ldyBGb3JtR3JvdXAoe1xuICAgICAgcHJpdmF0ZVJvb206IG5ldyBGb3JtQ29udHJvbCgnJylcbiAgICB9KVxuICB9KTtcblxuICAvL1xuICAvLyDilIDilIDilIAgQ09OU1RSVUNUT1Ig4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIG1zZ1NlcnZpY2U6IE1lc3NhZ2luZ1NlcnZpY2UsIHByaXZhdGUgX2F1dGg6IEF1dGhTZXJ2aWNlKSB7XG5cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5fYXV0aC5jaGF0a2l0VXNlciQuc3Vic2NyaWJlKFxuICAgICAgICAodXNlcikgPT4ge1xuICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICB0aGlzLmNoYXRraXRVc2VyID0gdXNlcjtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY2hhdGtpdFVzZXIpO1xuICAgICAgICAgICAgdGhpcy5yb29tcyA9IHVzZXIucm9vbXM7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnJvb21zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIHRoaXMuaW5jb21pbmdNZXNzYWdlcyA9IHRoaXMuX2F1dGgubWVzc2FnZXMkLnN1YnNjcmliZShcbiAgICAgICAgKGluY29taW5nTWVzc2FnZSkgPT4ge1xuICAgICAgICAgIHRoaXMucm9vbV9tZXNzYWdlcy5wdXNoKGluY29taW5nTWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIHRoaXMuY3VycmVudF9yb29tID0gdGhpcy5fYXV0aC5jdXJyZW50Um9vbSQuc3Vic2NyaWJlKFxuICAgICAgICAoY3VycmVudFJvb20pID0+IHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRfcm9vbSA9IGN1cnJlbnRSb29tO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGN1cnJlbnRSb29tKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIG9uRmlsZUNoYW5nZShldmVudCkge1xuXG4gICAgaWYgKCEoZXZlbnQudGFyZ2V0LmZpbGVzICYmIGV2ZW50LnRhcmdldC5maWxlc1swXSkpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLnNlbGVjdGVkRmlsZSA9IDxGaWxlPmV2ZW50LnRhcmdldC5maWxlc1swXTtcbiAgICB0aGlzLmZkLmFwcGVuZCgnYXZhdGFyJywgdGhpcy5zZWxlY3RlZEZpbGUsIHRoaXMuc2VsZWN0ZWRGaWxlLm5hbWUpO1xuICAgIC8vIHRoaXMuZmlsZVRvVXBsb2FkID0gZmlsZTtcbiAgICAvLyBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIC8vIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpOyAvLyByZWFkIGZpbGUgYXMgZGF0YSB1cmxcbiAgICAvLyByZWFkZXIub25sb2FkID0gKF9ldmVudCkgPT4ge1xuICAgIC8vICAgY29uc29sZS5sb2cocmVhZGVyLnJlc3VsdCk7IC8vIGxvZyBiYXNlNjQgc3RyaW5nXG4gICAgLy8gICB0aGlzLmltYWdlUGF0aCA9IHJlYWRlci5yZXN1bHQ7XG4gICAgLy8gfTtcbiAgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBWSUVXIEEgVVNFUiBJTiBUSEUgUk9PTSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICBzZXRTZWxlY3RlZFJvb21NZW1iZXIodXNlcjogYW55KSB7XG4gICAgdGhpcy5zZWxlY3RlZFJvb21NZW1iZXIgPSB1c2VyO1xuICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIFNFTkQgQSBNRVNTQUdFIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICAgIHNlbmRNZXNzYWdlKCkge1xuICAgICAgY29uc3QgeyBtZXNzYWdlLCBjdXJyZW50VXNlciB9ID0gdGhpcztcbiAgICAgIHRoaXMuY2hhdGtpdFVzZXIuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICB0ZXh0OiBtZXNzYWdlLFxuICAgICAgICByb29tSWQ6IHRoaXMuY3VycmVudF9yb29tLmlkLFxuICAgICAgfSkudGhlbihyZXMgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSAnJztcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIC8vIEpvaW4gYSByb29tXG4gIGpvaW5Sb29tKHJvb21JRCkge1xuICAgIHRoaXMuY2hhdGtpdFVzZXIuam9pblJvb20oe3Jvb21JZDogcm9vbUlEfSkudGhlbihyb29tID0+IHtcbiAgICAgIHRoaXMuY3VycmVudF9yb29tID0gcm9vbTtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuY3VycmVudF9yb29tKTtcblxuICAgICAgLy8gQWZ0ZXIgam9pbmluZyByb29tLCBmZXRjaCBtZXNzYWdlc1xuICAgICAgdGhpcy5jaGF0a2l0VXNlci5mZXRjaE11bHRpcGFydE1lc3NhZ2VzKHtyb29tSWQ6IHJvb21JRH0pLnRoZW4obWVzc2FnZXMgPT4ge1xuXG4gICAgICAgIC8vIENoZWNrIGlmIG1lc3NhZ2VzXG4gICAgICAgIGlmIChtZXNzYWdlcyA9PT0gdW5kZWZpbmVkIHx8IG1lc3NhZ2VzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cblxuICAgICAgICAvLyBTZXQgcmVhZCBjdXJzb3JcbiAgICAgICAgdGhpcy5jaGF0a2l0VXNlci5zZXRSZWFkQ3Vyc29yKHtcbiAgICAgICAgICByb29tSWQ6IHRoaXMuY3VycmVudF9yb29tLmlkLFxuICAgICAgICAgIHBvc2l0aW9uOiBtZXNzYWdlc1ttZXNzYWdlcy5sZW5ndGggLSAxXS5pZFxuICAgICAgICB9KVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yb29tTm90aWZpY2F0aW9uc1tyb29tLmlkXSA9IGZhbHNlO1xuICAgICAgICB9KTsgLy8gUmVtb3ZlIG1hcmtlciBmcm9tIG5vdGlmaWNhdGlvbnMgYXJyYXlcbiAgICAgICAgLy8gLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ1NldCBjdXJzb3InKTtcbiAgICAgICAgLy8gICB9KVxuICAgICAgICAvLyAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coYEVycm9yIHNldHRpbmcgY3Vyc29yOiAke2Vycn1gKTtcbiAgICAgICAgLy8gICB9KTtcbiAgICAgICAgbWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtZXNzYWdlLnBhcnRzWzBdLnBheWxvYWQuY29udGVudCk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJvb21fbWVzc2FnZXMgPSBtZXNzYWdlcztcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIC8vIGVuZCBKb2luIHJvb21cblxuICAvLyBGdW5jdGlvbiA9PiBjaGVjayBpZiB1c2VyIGhhcyB1bnJlYWQgbWVzc2FnZXMgaW4gYSByb29tXG4gIGhhc1VucmVhZChyb29tSUQpIHtcblxuICAgIGxldCBoYXNVbnJlYWQgPSBmYWxzZTsgLy8gVHJhY2sgcmV0dXJuIHN0YXR1c1xuXG4gICAgLy8gRmlyc3QsIGNoZWNrIGlmIGN1cnNvciBleGlzdHNcbiAgICBjb25zdCBjdXJzb3IgPSB0aGlzLmNoYXRraXRVc2VyLnJlYWRDdXJzb3Ioe1xuICAgICAgcm9vbUlkOiByb29tSURcbiAgICB9KTtcblxuICAgIC8vIGlmIHJlYWQgY3Vyc29yIElEICE9PSBsYXRlc3QgbWVzc2FnZSBJRC4uLlxuICAgIHRoaXMuY2hhdGtpdFVzZXIuZmV0Y2hNdWx0aXBhcnRNZXNzYWdlcyh7IC8vIEdldCBsYXRlc3QgbWVzc2FnZVxuICAgICAgcm9vbUlkOiByb29tSUQsXG4gICAgICBsaW1pdDogMSxcbiAgICB9KVxuICAgIC50aGVuKG1lc3NhZ2VzID0+IHtcbiAgICAgIGlmIChjdXJzb3IpIHsgLy8gSGFzIGN1cnNvciBzbyBjaGVjayBjdXJzb3IgcG9zIHZzIGxhdGVzdCBtZXNzYWdlIGlkXG4gICAgICAgIGhhc1VucmVhZCA9IChjdXJzb3IucG9zaXRpb24gIT09IG1lc3NhZ2VzWzBdLmluaXRpYWxJZCkgPyB0cnVlIDogZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBObyBjdXJzb3IgPT4gc2V0XG4gICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBmZXRjaGluZyBtZXNzYWdlczogJHtlcnJ9YCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaGFzVW5yZWFkO1xuICB9XG5cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBHRVQgQ0hBVEtJVCBVU0VSIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgZ2V0VXNlcih1c2VyX2lkKSB7XG4gICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2NoYXRraXQvZ2V0dXNlcmAsIHt1c2VyX2lkfSlcbiAgICAgIC50b1Byb21pc2UoKVxuICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpKTtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgR0VUIENIQVRLSVQgVVNFUlMgUk9PTVMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBnZXRVc2VyUm9vbXModXNlcl9pZCkge1xuICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9jaGF0a2l0L2dldHVzZXJyb29tc2AsIHt1c2VyX2lkfSlcbiAgICAgIC50b1Byb21pc2UoKVxuICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgLy8gdGhpcy5yb29tcyA9IHJlcztcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpKTtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgU1VCU0NSSUJFIFRPIFJPT00g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBzdWJzY3JpYmVUb1Jvb20ocm9vbUlEKSB7XG4gICAgICB0aGlzLmNoYXRraXRVc2VyLnN1YnNjcmliZVRvUm9vbU11bHRpcGFydCh7XG4gICAgICAgIHJvb21JZDogcm9vbUlELFxuICAgICAgICBob29rczoge1xuICAgICAgICAgIG9uTWVzc2FnZTogbWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAvLyBXaGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC4uLlxuXG4gICAgICAgICAgICAvLyBQdXNoIHRvIG1lc3NhZ2VzIGFycmF5IGFuZCB1cGRhdGUgdmlld1xuICAgICAgICAgICAgdGhpcy5yb29tX21lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gICAgICAgICAgICAvLyBTY3JvbGwgY2hhdCB3aW5kb3cgdG8gcmV2ZWFsIGxhdGVzdCBtZXNzYWdlXG4gICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhdFJlZWwnKS5zY3JvbGxUb3AgPSAwO1xuICAgICAgICAgICAgLy8gYWxlcnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXRSZWVsJykpO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHVzZXJzIGxhc3QgY3Vyc29yIHBvc2l0aW9uIGZyb20gdGhlIHJvb21cbiAgICAgICAgICAgIGNvbnN0IGN1cnNvciA9IHRoaXMuY2hhdGtpdFVzZXIucmVhZEN1cnNvcih7XG4gICAgICAgICAgICAgIHJvb21JZDogbWVzc2FnZS5yb29tSWRcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoKGN1cnNvci5wb3NpdGlvbiAhPT0gbWVzc2FnZS5pZCkgJiYgKG1lc3NhZ2Uucm9vbUlkICE9PSB0aGlzLmN1cnJlbnRfcm9vbS5pZCkpIHtcbiAgICAgICAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgdXNlciBoYXMgbm90IHNlZW4gdGhlIG1lc3NhZ2UsIEFORCB0aGUgbWVzc2FnZSB3YXMgcmVjZWl2ZWQgaW4gYSBkaWZmZXJlbnQgcm9vbSxcbiAgICAgICAgICAgICAgLy8gYWRkIG1hcmtlciB0byBub3RpZmljYXRpb24gYXJyYXlcbiAgICAgICAgICAgICAgdGhpcy5yb29tTm90aWZpY2F0aW9uc1ttZXNzYWdlLnJvb20uaWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgbWVzc2FnZSB3YXMgc2VudCBpbiBjdXJyZW50IHJvb20sIHNvIGFsbCB3ZSBtdXN0IGRvIGlzIHVwZGF0ZSB0aGVcbiAgICAgICAgICAgICAgLy8gcmVhZCBjdXJzb3IgZm9yIHRoZSBjdXJyZW50IHVzZXIncyByb29tXG4gICAgICAgICAgICAgIHRoaXMuY2hhdGtpdFVzZXIuc2V0UmVhZEN1cnNvcih7XG4gICAgICAgICAgICAgICAgcm9vbUlkOiBtZXNzYWdlLnJvb21JZCxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbWVzc2FnZS5pZCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENvdW50IHJvb21zIHdpdGggdW5yZWFkIG5vdGlmdWNhdGlvbnNcbiAgICAgICAgICAgIGxldCByb29tc1dpdGhOb3RpZmljYXRpb25zID0gMDtcbiAgICAgICAgICAgIHRoaXMucm9vbU5vdGlmaWNhdGlvbnMuZm9yRWFjaChyb29tID0+IHtcbiAgICAgICAgICAgICAgcm9vbXNXaXRoTm90aWZpY2F0aW9ucyArPSByb29tID09PSB0cnVlID8gMSA6IDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIEFkZCB0byBnbG9iYWwgbm90aWZpY2F0aW9uIGNvdW50ZXJcbiAgICAgICAgICAgIHRoaXMubXNnU2VydmljZS5zZXRSb29tc1dpdGhOb3RpZmljYXRpb25zKHJvb21zV2l0aE5vdGlmaWNhdGlvbnMpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb25BZGRlZFRvUm9vbTogcm9vbSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQWRkZWQgdG8gcm9vbSAke3Jvb20ubmFtZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VMaW1pdDogMVxuICAgICAgfSk7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIENSRUFURSBST09NIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgY3JlYXRlUm9vbSgpIHsgLy8gVE9ETzogQWRkIHRvIG1lc3NhZ2Ugc2VydmljZVxuXG4gICAgICBjb25zdCByb29tTmFtZSA9IHRoaXMuZm9ybUltcG9ydC52YWx1ZS5yb29tTmFtZUdyb3VwLnJvb21OYW1lO1xuICAgICAgbGV0IHJvb21BdmF0YXIgPSAnJztcblxuICAgICAgLy8gVE9ETzogQWRkIHRoaXMgdG8gdXBsb2FkIHNlcnZpY2VcbiAgICAgIC8vIFVwbG9hZCBpbWFnZVxuICAgICAgdGhpcy5odHRwLnBvc3QoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9yb29tcy9hdmF0YXJgLCB0aGlzLmZkKVxuICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAudGhlbiggYXZhdGFyID0+IHtcbiAgICAgICAgcm9vbUF2YXRhciA9IGF2YXRhclsnZmlsZW5hbWUnXTsgLy8gU3RvcmUgcGF0aFxuICAgICAgICBjb25zb2xlLmxvZyhyb29tQXZhdGFyKTtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSByb29tXG4gICAgICAgIHRoaXMuY2hhdGtpdFVzZXIuY3JlYXRlUm9vbSh7IC8vIENyZWF0ZSB0aGUgcm9vbVxuICAgICAgICAgIG5hbWU6IHJvb21OYW1lLFxuICAgICAgICAgIHByaXZhdGU6IGZhbHNlLFxuICAgICAgICAgIGN1c3RvbURhdGE6IHsgcm9vbUF2YXRhcjogcm9vbUF2YXRhciB9LCAvLyBBZGQgcm9vbSBhdmF0YXIgdG8gY3VzdG9tIHJvb20gZGF0YVxuICAgICAgICB9KS50aGVuKCByb29tID0+IHsgLy8gU3VjY2VzXG4gICAgICAgICAgICB0aGlzLnJvb21zLnB1c2gocm9vbSk7IC8vIEFkZCB0aGUgbmV3IHJvb20gdG8gdGhlIGxpc3RcbiAgICAgICAgICAgIHRoaXMucm9vbUNyZWF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocm9vbSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQ3JlYXRlZCByb29tIGNhbGxlZCAke3Jvb20ubmFtZX1gKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4geyAvLyBGYWlsZWQgcm9vbSBjcmVhdGlvblxuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIGNyZWF0aW5nIHJvb20gJHtlcnJ9YCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gU3Vic2NyaWJlIHRvIG5ldyBub3RpZmljYXRpb25zXG4gICAgdGhpcy5tc2dTZXJ2aWNlLm5vdGlmaWNhdGlvbkNvdW50XG4gICAgLnN1YnNjcmliZShub3RpZmljYXRpb24gPT4gdGhpcy5ub3RpZmljYXRpb25Db3VudCA9IG5vdGlmaWNhdGlvbik7XG5cbiAgICAvLyBHZXQgdXNlciBpZCBmcm9tIGxvY2FsIHN0b3JhZ2VcbiAgICBjb25zdCB1c2VyX2lkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudFVzZXInKSkuX2VtYmVkZGVkLnVzZXIuaWQ7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gc2V0SW50ZXJ2YWwodGhpcy5sb2d0aGVoZWlnaHQsIDMwMDApO1xuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY2hhdFJlZWwpO1xuICAgIHRoaXMuY2hhdFJlZWwuY2hhbmdlcy5zdWJzY3JpYmUoYyA9PiB7IGMudG9BcnJheSgpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGl0ZW0ubmF0aXZlRWxlbWVudCk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhpdGVtLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsSGVpZ2h0KTtcblxuICAgICAgLy8gY29uc29sZS5sb2coJ1Njcm9sbCBIZWlnaHQ6ICcgKyBpdGVtLm5hdGl2ZUVsZW1lbnQub2Zmc2V0UGFyZW50LnNjcm9sbEhlaWdodCk7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU2Nyb2xsIFRvcDogJyArIGl0ZW0ubmF0aXZlRWxlbWVudC5vZmZzZXRQYXJlbnQuc2Nyb2xsVG9wKTtcblxuICAgICAgaXRlbS5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudC5zY3JvbGxUb3AgPSBpdGVtLm5hdGl2ZUVsZW1lbnQub2Zmc2V0UGFyZW50LnNjcm9sbEhlaWdodDtcbiAgICAgIC8vIGl0ZW0ubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSBpdGVtLm5hdGl2ZUVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgLy8gaXRlbS5uYXRpdmVFbGVtZW50LmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgJ2Zhc3QnKTtcbiAgICAgIC8vIGl0ZW0ubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSAwO1xuICAgIH0pO1xuICB9KTtcbiAgICAvLyBjb25zb2xlLmxvZyhlbGVtLm5hdGl2ZUVsZW1lbnQpO1xuICB9XG59XG4iXX0=