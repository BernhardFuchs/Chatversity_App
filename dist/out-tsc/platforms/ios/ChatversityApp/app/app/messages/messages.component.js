"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var messaging_service_1 = require("../Core/_services/messaging.service");
var forms_1 = require("@angular/forms");
var auth_service_1 = require("../Core/_services/auth.service");
var MessagesComponent = /** @class */ (function () {
    function MessagesComponent(http, msgService, _auth) {
        var _this = this;
        this.http = http;
        this.msgService = msgService;
        this._auth = _auth;
        this.rooms = [];
        this.room_messages = [];
        this._message = '';
        this.roomNotifications = [];
        // TODO: Can probably remove these props
        this._roomPrivate = '';
        this.formImport = new forms_1.FormGroup({
            importFileGroup: new forms_1.FormGroup({
                importFile: new forms_1.FormControl(''),
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
            // console.log(user);
            _this.chatkitUser = user;
            console.log(_this.chatkitUser);
            _this.rooms = user.rooms;
            console.log(_this.rooms);
        });
        this.incomingMessages = this._auth.messages$.subscribe(function (incomingMessage) {
            _this.room_messages.push(incomingMessage);
        });
        this.current_room = this._auth.currentRoom$.subscribe(function (currentRoom) {
            _this.current_room = currentRoom;
            console.log(currentRoom);
        });
    }
    Object.defineProperty(MessagesComponent.prototype, "message", {
        get: function () {
            return this._message;
        },
        set: function (value) {
            this._message = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessagesComponent.prototype, "roomPrivate", {
        get: function () {
            return this._roomPrivate;
        },
        set: function (value) {
            this._roomPrivate = value;
        },
        enumerable: true,
        configurable: true
    });
    MessagesComponent.prototype.onFileChange = function (event) {
        var _this = this;
        if (!(event.target.files && event.target.files[0])) {
            return;
        }
        var file = event.target.files[0];
        this.fileToUpload = file;
        var reader = new FileReader();
        reader.readAsDataURL(file); // read file as data url
        reader.onload = function (_event) {
            console.log(reader.result); // log base64 string
            _this.imagePath = reader.result;
        };
    };
    // Send a message
    MessagesComponent.prototype.sendMessage = function () {
        var _a = this, message = _a.message, currentUser = _a.currentUser;
        this.chatkitUser.sendMessage({
            text: message,
            roomId: this.current_room.id,
        }).then(function (res) {
            console.log(res);
        });
        this.message = '';
    };
    // Join a room
    MessagesComponent.prototype.joinRoom = function (roomID) {
        var _this = this;
        this.chatkitUser.joinRoom({ roomId: roomID }).then(function (room) {
            _this.current_room = room;
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
                });
                _this.room_messages = messages;
            });
        });
    };
    // end Join room
    // Function => check if user has unread messages in a room
    MessagesComponent.prototype.hasUnread = function (roomID) {
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
    // Get Chatkit user
    MessagesComponent.prototype.getUser = function (user_id) {
        return this.http.post(environment_1.environment.apiUrl + "/chatkit/getuser", { user_id: user_id })
            .toPromise()
            .then(function (res) {
            return res;
            console.log(res);
        })
            .catch(function (error) { return console.log(error); });
    };
    // Get Chatkit user's rooms
    MessagesComponent.prototype.getUserRooms = function (user_id) {
        return this.http.post(environment_1.environment.apiUrl + "/chatkit/getuserrooms", { user_id: user_id })
            .toPromise()
            .then(function (res) {
            // this.rooms = res;
            console.log(res);
            return res;
        })
            .catch(function (error) { return console.log(error); });
    };
    //
    // ─── SUBSCRIBE TO ROOM ──────────────────────────────────────────────────────────
    //
    MessagesComponent.prototype.subscribeToRoom = function (roomID) {
        var _this = this;
        this.chatkitUser.subscribeToRoomMultipart({
            roomId: roomID,
            hooks: {
                onMessage: function (message) {
                    // When a message is received...
                    // Push to messages array and update view
                    _this.room_messages.push(message);
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
            messageLimit: 0
        });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    // Create room
    MessagesComponent.prototype.createRoom = function () {
        var _this = this;
        this.roomCreated = true;
        return;
        // this.isLoading = true; // Display loading icon
        var roomName = this.formImport.value.roomNameGroup.roomName;
        var privateRoom = this.formImport.value.privateRoomGroup.privateRoom;
        var roomAvatar = this.formImport.value.importFileGroup.importFile;
        console.log(this.formImport.value.roomNameGroup.roomName);
        console.log(this.formImport.value.privateRoomGroup.privateRoom);
        console.log(this.formImport.value.importFileGroup.importFile);
        console.log(this.fileToUpload);
        console.log(this.formImport.value);
        var formData = new FormData();
        var b64string = JSON.stringify(this.imagePath);
        formData.append('file', b64string);
        formData.append('testvar', 'my test var value');
        console.log(formData);
        var headers = new http_1.HttpHeaders();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Accept', 'application/json');
        // Create room and insert room avatar into database
        this.http.post(environment_1.environment.apiUrl + "/asdf", formData)
            .toPromise()
            .then(function (res) {
            console.log(res);
            console.log('Image uploaded');
            _this.chatkitUser.createRoom({
                name: roomName,
                private: true,
                customData: { roomAvatar: res['_id'] },
            }).then(function (room) {
                // this.isLoading = false;
                _this.roomCreated = true;
                console.log("Created room called " + room.name);
            })
                .catch(function (err) {
                console.log("Error creating room " + err);
            });
        })
            .catch(function (err) {
            console.log('Error uploading room image');
        });
    };
    MessagesComponent.prototype.ngOnInit = function () {
        var _this = this;
        // console.log(this.chatkitUser);
        // console.log(this.chatkitUser.roomStore.rooms);
        console.log(this.rooms);
        console.log(this.room_messages);
        // this.chatkitUser.rooms;
        console.log(Object.keys(this.rooms));
        // this.rooms.forEach((room) => {
        //   console.log(room);
        // });
        console.log(this.rooms);
        // console.log('Connected as user ', user);
        // this.chatkitUser = user;
        // this.rooms = user.rooms;
        // Iterate through rooms and subscribe to each
        // Join first room in array
        // TODO: refactor this implementation
        // this.chatkitUser.joinRoom({roomId: this.rooms[0].id}).then(room => {
        //   this.current_room = room;
        //   // Fetch all messages for joined room
        //   this.chatkitUser.fetchMultipartMessages({
        //     roomId: this.rooms[0].id,
        //     limit: 10,
        //   }).then(messages => {
        //     messages.forEach(message => {
        //       // console.log(message.parts[0].payload.content);
        //     });
        //     this.room_messages = messages;
        //   });
        // });
        // Get user id from local storage
        var user_id = JSON.parse(localStorage.getItem('currentUser'))._embedded.user.id;
        // Subscribe to new notifications
        this.msgService.notificationCount
            .subscribe(function (notification) { return _this.notificationCount = notification; });
        // console.log(this.chatkitUser);
    };
    __decorate([
        core_1.ViewChild('avatar'),
        __metadata("design:type", core_1.ElementRef)
    ], MessagesComponent.prototype, "avatar", void 0);
    MessagesComponent = __decorate([
        core_1.Component({
            selector: 'app-messages',
            templateUrl: './messages.component.html',
            styleUrls: ['./messages.component.scss']
        }),
        __metadata("design:paramtypes", [http_1.HttpClient, messaging_service_1.MessagingService, auth_service_1.AuthService])
    ], MessagesComponent);
    return MessagesComponent;
}());
exports.MessagesComponent = MessagesComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvYXBwL21lc3NhZ2VzL21lc3NhZ2VzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF3RTtBQUN4RSw2Q0FBK0Q7QUFDL0QsOERBQTZEO0FBQzdELHlFQUF1RTtBQUN2RSx3Q0FBb0U7QUFDcEUsK0RBQTZEO0FBTzdEO0lBc0RFLDJCQUFvQixJQUFnQixFQUFVLFVBQTRCLEVBQVUsS0FBa0I7UUFBdEcsaUJBeUJDO1FBekJtQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBa0I7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFhO1FBOUN0RyxVQUFLLEdBQWUsRUFBRSxDQUFDO1FBR3ZCLGtCQUFhLEdBQWUsRUFBRSxDQUFDO1FBSy9CLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFFZCxzQkFBaUIsR0FBZSxFQUFFLENBQUM7UUFZbkMsd0NBQXdDO1FBQ3hDLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBUWxCLGVBQVUsR0FBRyxJQUFJLGlCQUFTLENBQUM7WUFDekIsZUFBZSxFQUFFLElBQUksaUJBQVMsQ0FBQztnQkFDN0IsVUFBVSxFQUFFLElBQUksbUJBQVcsQ0FBQyxFQUFFLENBQUM7YUFDaEMsQ0FBQztZQUNGLGFBQWEsRUFBRSxJQUFJLGlCQUFTLENBQUM7Z0JBQzNCLFFBQVEsRUFBRSxJQUFJLG1CQUFXLENBQUMsRUFBRSxFQUFFO29CQUM1QixrQkFBVSxDQUFDLFFBQVE7b0JBQ25CLGtCQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztpQkFDekIsQ0FBQzthQUNILENBQUM7WUFDRixnQkFBZ0IsRUFBRSxJQUFJLGlCQUFTLENBQUM7Z0JBQzlCLFdBQVcsRUFBRSxJQUFJLG1CQUFXLENBQUMsRUFBRSxD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LCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBFbGVtZW50UmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi8uLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgTWVzc2FnaW5nU2VydmljZSB9IGZyb20gJy4uL0NvcmUvX3NlcnZpY2VzL21lc3NhZ2luZy5zZXJ2aWNlJztcbmltcG9ydCB7IEZvcm1Hcm91cCwgRm9ybUNvbnRyb2wsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1tZXNzYWdlcycsXG4gIHRlbXBsYXRlVXJsOiAnLi9tZXNzYWdlcy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL21lc3NhZ2VzLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTWVzc2FnZXNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBAVmlld0NoaWxkKCdhdmF0YXInKSBhdmF0YXI6IEVsZW1lbnRSZWY7XG4gIGZpbGVUb1VwbG9hZDogRmlsZTtcblxuICBpbWFnZVBhdGg6IGFueTtcblxuICBub3RpZmljYXRpb25Db3VudDogYW55O1xuXG4gIHJvb21zOiBBcnJheTxhbnk+ID0gW107XG4gIGN1cnJlbnRVc2VyOiBhbnk7XG4gIHVzZXJfaWQ6IGFueTtcbiAgcm9vbV9tZXNzYWdlczogQXJyYXk8YW55PiA9IFtdO1xuICAvLyByb29tX21lc3NhZ2VzOiBPYnNlcnZhYmxlPGFueVtdPjtcbiAgY3VycmVudF9yb29tOiBhbnk7XG4gIGNoYXRVc2VyOiBhbnk7XG5cbiAgX21lc3NhZ2UgPSAnJztcbiAgcm9vbUNyZWF0ZWQ6IGJvb2xlYW47XG4gIHJvb21Ob3RpZmljYXRpb25zOiBBcnJheTxhbnk+ID0gW107XG4gIGNoYXRraXRVc2VyOiBhbnk7XG4gIHN1YnNjcmlwdGlvbjogYW55O1xuICBpbmNvbWluZ01lc3NhZ2VzOiBhbnk7XG4gIFxuICBnZXQgbWVzc2FnZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9tZXNzYWdlO1xuICB9XG4gIHNldCBtZXNzYWdlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9tZXNzYWdlID0gdmFsdWU7XG4gIH1cblxuICAvLyBUT0RPOiBDYW4gcHJvYmFibHkgcmVtb3ZlIHRoZXNlIHByb3BzXG4gIF9yb29tUHJpdmF0ZSA9ICcnO1xuICBnZXQgcm9vbVByaXZhdGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcm9vbVByaXZhdGU7XG4gIH1cbiAgc2V0IHJvb21Qcml2YXRlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9yb29tUHJpdmF0ZSA9IHZhbHVlO1xuICB9XG5cbiAgZm9ybUltcG9ydCA9IG5ldyBGb3JtR3JvdXAoe1xuICAgIGltcG9ydEZpbGVHcm91cDogbmV3IEZvcm1Hcm91cCh7XG4gICAgICBpbXBvcnRGaWxlOiBuZXcgRm9ybUNvbnRyb2woJycpLFxuICAgIH0pLFxuICAgIHJvb21OYW1lR3JvdXA6IG5ldyBGb3JtR3JvdXAoe1xuICAgICAgcm9vbU5hbWU6IG5ldyBGb3JtQ29udHJvbCgnJywgW1xuICAgICAgICBWYWxpZGF0b3JzLnJlcXVpcmVkLFxuICAgICAgICBWYWxpZGF0b3JzLm1heExlbmd0aCg2MClcbiAgICAgIF0pXG4gICAgfSksXG4gICAgcHJpdmF0ZVJvb21Hcm91cDogbmV3IEZvcm1Hcm91cCh7XG4gICAgICBwcml2YXRlUm9vbTogbmV3IEZvcm1Db250cm9sKCcnKVxuICAgIH0pXG4gIH0pO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHJpdmF0ZSBtc2dTZXJ2aWNlOiBNZXNzYWdpbmdTZXJ2aWNlLCBwcml2YXRlIF9hdXRoOiBBdXRoU2VydmljZSkge1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLl9hdXRoLmNoYXRraXRVc2VyJC5zdWJzY3JpYmUoXG4gICAgICAodXNlcikgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh1c2VyKTtcbiAgICAgICAgdGhpcy5jaGF0a2l0VXNlciA9IHVzZXI7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2hhdGtpdFVzZXIpO1xuICAgICAgICB0aGlzLnJvb21zID0gdXNlci5yb29tcztcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5yb29tcyk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIHRoaXMuaW5jb21pbmdNZXNzYWdlcyA9IHRoaXMuX2F1dGgubWVzc2FnZXMkLnN1YnNjcmliZShcbiAgICAgIChpbmNvbWluZ01lc3NhZ2UpID0+IHtcbiAgICAgICAgdGhpcy5yb29tX21lc3NhZ2VzLnB1c2goaW5jb21pbmdNZXNzYWdlKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy5jdXJyZW50X3Jvb20gPSB0aGlzLl9hdXRoLmN1cnJlbnRSb29tJC5zdWJzY3JpYmUoXG4gICAgICAoY3VycmVudFJvb20pID0+IHtcbiAgICAgICAgdGhpcy5jdXJyZW50X3Jvb20gPSBjdXJyZW50Um9vbTtcbiAgICAgICAgY29uc29sZS5sb2coY3VycmVudFJvb20pO1xuICAgICAgfVxuICAgICk7XG5cbiAgfVxuXG4gIHVybDogc3RyaW5nO1xuICBvbkZpbGVDaGFuZ2UoZXZlbnQpIHtcbiAgICBpZiAoIShldmVudC50YXJnZXQuZmlsZXMgJiYgZXZlbnQudGFyZ2V0LmZpbGVzWzBdKSkgeyByZXR1cm47IH1cbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzWzBdO1xuICAgIHRoaXMuZmlsZVRvVXBsb2FkID0gZmlsZTtcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpOyAvLyByZWFkIGZpbGUgYXMgZGF0YSB1cmxcbiAgICByZWFkZXIub25sb2FkID0gKF9ldmVudCkgPT4ge1xuICAgICAgY29uc29sZS5sb2cocmVhZGVyLnJlc3VsdCk7IC8vIGxvZyBiYXNlNjQgc3RyaW5nXG4gICAgICB0aGlzLmltYWdlUGF0aCA9IHJlYWRlci5yZXN1bHQ7XG4gICAgfTtcbiAgfVxuXG5cbiAgLy8gU2VuZCBhIG1lc3NhZ2VcbiAgc2VuZE1lc3NhZ2UoKSB7XG4gICAgY29uc3QgeyBtZXNzYWdlLCBjdXJyZW50VXNlciB9ID0gdGhpcztcbiAgICB0aGlzLmNoYXRraXRVc2VyLnNlbmRNZXNzYWdlKHtcbiAgICAgIHRleHQ6IG1lc3NhZ2UsXG4gICAgICByb29tSWQ6IHRoaXMuY3VycmVudF9yb29tLmlkLFxuICAgIH0pLnRoZW4ocmVzID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgfSk7XG4gICAgdGhpcy5tZXNzYWdlID0gJyc7XG4gIH1cblxuXG4gIC8vIEpvaW4gYSByb29tXG4gIGpvaW5Sb29tKHJvb21JRCkge1xuICAgIHRoaXMuY2hhdGtpdFVzZXIuam9pblJvb20oe3Jvb21JZDogcm9vbUlEfSkudGhlbihyb29tID0+IHtcbiAgICAgIHRoaXMuY3VycmVudF9yb29tID0gcm9vbTtcblxuICAgICAgLy8gQWZ0ZXIgam9pbmluZyByb29tLCBmZXRjaCBtZXNzYWdlc1xuICAgICAgdGhpcy5jaGF0a2l0VXNlci5mZXRjaE11bHRpcGFydE1lc3NhZ2VzKHtyb29tSWQ6IHJvb21JRH0pLnRoZW4obWVzc2FnZXMgPT4ge1xuXG4gICAgICAgIC8vIENoZWNrIGlmIG1lc3NhZ2VzXG4gICAgICAgIGlmIChtZXNzYWdlcyA9PT0gdW5kZWZpbmVkIHx8IG1lc3NhZ2VzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cblxuICAgICAgICAvLyBTZXQgcmVhZCBjdXJzb3JcbiAgICAgICAgdGhpcy5jaGF0a2l0VXNlci5zZXRSZWFkQ3Vyc29yKHtcbiAgICAgICAgICByb29tSWQ6IHRoaXMuY3VycmVudF9yb29tLmlkLFxuICAgICAgICAgIHBvc2l0aW9uOiBtZXNzYWdlc1ttZXNzYWdlcy5sZW5ndGggLSAxXS5pZFxuICAgICAgICB9KVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yb29tTm90aWZpY2F0aW9uc1tyb29tLmlkXSA9IGZhbHNlO1xuICAgICAgICB9KTsgLy8gUmVtb3ZlIG1hcmtlciBmcm9tIG5vdGlmaWNhdGlvbnMgYXJyYXlcbiAgICAgICAgLy8gLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ1NldCBjdXJzb3InKTtcbiAgICAgICAgLy8gICB9KVxuICAgICAgICAvLyAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coYEVycm9yIHNldHRpbmcgY3Vyc29yOiAke2Vycn1gKTtcbiAgICAgICAgLy8gICB9KTtcbiAgICAgICAgbWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtZXNzYWdlLnBhcnRzWzBdLnBheWxvYWQuY29udGVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJvb21fbWVzc2FnZXMgPSBtZXNzYWdlcztcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIC8vIGVuZCBKb2luIHJvb21cblxuXG4gIC8vIEZ1bmN0aW9uID0+IGNoZWNrIGlmIHVzZXIgaGFzIHVucmVhZCBtZXNzYWdlcyBpbiBhIHJvb21cbiAgaGFzVW5yZWFkKHJvb21JRCkge1xuXG4gICAgbGV0IGhhc1VucmVhZCA9IGZhbHNlOyAvLyBUcmFjayByZXR1cm4gc3RhdHVzXG5cbiAgICAvLyBGaXJzdCwgY2hlY2sgaWYgY3Vyc29yIGV4aXN0c1xuICAgIGNvbnN0IGN1cnNvciA9IHRoaXMuY2hhdGtpdFVzZXIucmVhZEN1cnNvcih7XG4gICAgICByb29tSWQ6IHJvb21JRFxuICAgIH0pO1xuXG4gICAgICAvLyBpZiByZWFkIGN1cnNvciBJRCAhPT0gbGF0ZXN0IG1lc3NhZ2UgSUQuLi5cbiAgICAgIHRoaXMuY2hhdGtpdFVzZXIuZmV0Y2hNdWx0aXBhcnRNZXNzYWdlcyh7IC8vIEdldCBsYXRlc3QgbWVzc2FnZVxuICAgICAgICByb29tSWQ6IHJvb21JRCxcbiAgICAgICAgbGltaXQ6IDEsXG4gICAgICB9KVxuICAgICAgLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgICAgICBpZiAoY3Vyc29yKSB7IC8vIEhhcyBjdXJzb3Igc28gY2hlY2sgY3Vyc29yIHBvcyB2cyBsYXRlc3QgbWVzc2FnZSBpZFxuICAgICAgICAgIGhhc1VucmVhZCA9IChjdXJzb3IucG9zaXRpb24gIT09IG1lc3NhZ2VzWzBdLmluaXRpYWxJZCkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTm8gY3Vyc29yID0+IHNldFxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBmZXRjaGluZyBtZXNzYWdlczogJHtlcnJ9YCk7XG4gICAgICB9KTtcblxuICAgIHJldHVybiBoYXNVbnJlYWQ7XG4gIH1cblxuXG4gIC8vIEdldCBDaGF0a2l0IHVzZXJcbiAgZ2V0VXNlcih1c2VyX2lkKSB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9jaGF0a2l0L2dldHVzZXJgLCB7dXNlcl9pZH0pXG4gICAgLnRvUHJvbWlzZSgpXG4gICAgLnRoZW4ocmVzID0+IHtcbiAgICAgIHJldHVybiByZXM7XG4gICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSk7XG4gIH1cblxuICAvLyBHZXQgQ2hhdGtpdCB1c2VyJ3Mgcm9vbXNcbiAgZ2V0VXNlclJvb21zKHVzZXJfaWQpIHtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2NoYXRraXQvZ2V0dXNlcnJvb21zYCwge3VzZXJfaWR9KVxuICAgIC50b1Byb21pc2UoKVxuICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAvLyB0aGlzLnJvb21zID0gcmVzO1xuICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpKTtcbiAgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBTVUJTQ1JJQkUgVE8gUk9PTSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIHN1YnNjcmliZVRvUm9vbShyb29tSUQpIHtcbiAgICAgIHRoaXMuY2hhdGtpdFVzZXIuc3Vic2NyaWJlVG9Sb29tTXVsdGlwYXJ0KHtcbiAgICAgICAgcm9vbUlkOiByb29tSUQsXG4gICAgICAgIGhvb2tzOiB7XG4gICAgICAgICAgb25NZXNzYWdlOiBtZXNzYWdlID0+IHtcbiAgICAgICAgICAgIC8vIFdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLi4uXG5cbiAgICAgICAgICAgIC8vIFB1c2ggdG8gbWVzc2FnZXMgYXJyYXkgYW5kIHVwZGF0ZSB2aWV3XG4gICAgICAgICAgICB0aGlzLnJvb21fbWVzc2FnZXMucHVzaChtZXNzYWdlKTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSB1c2VycyBsYXN0IGN1cnNvciBwb3NpdGlvbiBmcm9tIHRoZSByb29tXG4gICAgICAgICAgICBjb25zdCBjdXJzb3IgPSB0aGlzLmNoYXRraXRVc2VyLnJlYWRDdXJzb3Ioe1xuICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKChjdXJzb3IucG9zaXRpb24gIT09IG1lc3NhZ2UuaWQpICYmIChtZXNzYWdlLnJvb21JZCAhPT0gdGhpcy5jdXJyZW50X3Jvb20uaWQpKSB7XG4gICAgICAgICAgICAgIC8vIElmIHRoZSBjdXJyZW50IHVzZXIgaGFzIG5vdCBzZWVuIHRoZSBtZXNzYWdlLCBBTkQgdGhlIG1lc3NhZ2Ugd2FzIHJlY2VpdmVkIGluIGEgZGlmZmVyZW50IHJvb20sXG4gICAgICAgICAgICAgIC8vIGFkZCBtYXJrZXIgdG8gbm90aWZpY2F0aW9uIGFycmF5XG4gICAgICAgICAgICAgIHRoaXMucm9vbU5vdGlmaWNhdGlvbnNbbWVzc2FnZS5yb29tLmlkXSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIG1lc3NhZ2Ugd2FzIHNlbnQgaW4gY3VycmVudCByb29tLCBzbyBhbGwgd2UgbXVzdCBkbyBpcyB1cGRhdGUgdGhlXG4gICAgICAgICAgICAgIC8vIHJlYWQgY3Vyc29yIGZvciB0aGUgY3VycmVudCB1c2VyJ3Mgcm9vbVxuICAgICAgICAgICAgICB0aGlzLmNoYXRraXRVc2VyLnNldFJlYWRDdXJzb3Ioe1xuICAgICAgICAgICAgICAgIHJvb21JZDogbWVzc2FnZS5yb29tSWQsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IG1lc3NhZ2UuaWQsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDb3VudCByb29tcyB3aXRoIHVucmVhZCBub3RpZnVjYXRpb25zXG4gICAgICAgICAgICBsZXQgcm9vbXNXaXRoTm90aWZpY2F0aW9ucyA9IDA7XG4gICAgICAgICAgICB0aGlzLnJvb21Ob3RpZmljYXRpb25zLmZvckVhY2gocm9vbSA9PiB7XG4gICAgICAgICAgICAgIHJvb21zV2l0aE5vdGlmaWNhdGlvbnMgKz0gcm9vbSA9PT0gdHJ1ZSA/IDEgOiAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBBZGQgdG8gZ2xvYmFsIG5vdGlmaWNhdGlvbiBjb3VudGVyXG4gICAgICAgICAgICB0aGlzLm1zZ1NlcnZpY2Uuc2V0Um9vbXNXaXRoTm90aWZpY2F0aW9ucyhyb29tc1dpdGhOb3RpZmljYXRpb25zKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uQWRkZWRUb1Jvb206IHJvb20gPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEFkZGVkIHRvIHJvb20gJHtyb29tLm5hbWV9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlTGltaXQ6IDBcbiAgICAgIH0pO1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuICAvLyBDcmVhdGUgcm9vbVxuICBjcmVhdGVSb29tKCkge1xuICAgIHRoaXMucm9vbUNyZWF0ZWQgPSB0cnVlOyByZXR1cm47XG4gICAgLy8gdGhpcy5pc0xvYWRpbmcgPSB0cnVlOyAvLyBEaXNwbGF5IGxvYWRpbmcgaWNvblxuICAgIGNvbnN0IHJvb21OYW1lID0gdGhpcy5mb3JtSW1wb3J0LnZhbHVlLnJvb21OYW1lR3JvdXAucm9vbU5hbWU7XG4gICAgY29uc3QgcHJpdmF0ZVJvb20gPSB0aGlzLmZvcm1JbXBvcnQudmFsdWUucHJpdmF0ZVJvb21Hcm91cC5wcml2YXRlUm9vbTtcbiAgICBjb25zdCByb29tQXZhdGFyID0gdGhpcy5mb3JtSW1wb3J0LnZhbHVlLmltcG9ydEZpbGVHcm91cC5pbXBvcnRGaWxlO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuZm9ybUltcG9ydC52YWx1ZS5yb29tTmFtZUdyb3VwLnJvb21OYW1lKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmZvcm1JbXBvcnQudmFsdWUucHJpdmF0ZVJvb21Hcm91cC5wcml2YXRlUm9vbSk7XG4gICAgY29uc29sZS5sb2codGhpcy5mb3JtSW1wb3J0LnZhbHVlLmltcG9ydEZpbGVHcm91cC5pbXBvcnRGaWxlKTtcblxuICAgIGNvbnNvbGUubG9nKHRoaXMuZmlsZVRvVXBsb2FkKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmZvcm1JbXBvcnQudmFsdWUpO1xuXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBjb25zdCBiNjRzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmltYWdlUGF0aCk7XG5cbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBiNjRzdHJpbmcpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgndGVzdHZhcicsICdteSB0ZXN0IHZhciB2YWx1ZScpO1xuXG4gICAgY29uc29sZS5sb2coZm9ybURhdGEpO1xuXG4gICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xuICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG4gICAgaGVhZGVycy5hcHBlbmQoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5cbiAgICAvLyBDcmVhdGUgcm9vbSBhbmQgaW5zZXJ0IHJvb20gYXZhdGFyIGludG8gZGF0YWJhc2VcbiAgICB0aGlzLmh0dHAucG9zdChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2FzZGZgLCBmb3JtRGF0YSlcbiAgICAudG9Qcm9taXNlKClcbiAgICAudGhlbihyZXMgPT4geyAvLyBJbWFnZSB1cGxvYWRlZFxuICAgICAgY29uc29sZS5sb2cocmVzKTtcblxuICAgICAgY29uc29sZS5sb2coJ0ltYWdlIHVwbG9hZGVkJyk7XG4gICAgICB0aGlzLmNoYXRraXRVc2VyLmNyZWF0ZVJvb20oeyAvLyBDcmVhdGUgdGhlIHJvb21cbiAgICAgICAgbmFtZTogcm9vbU5hbWUsXG4gICAgICAgIHByaXZhdGU6IHRydWUsXG4gICAgICAgIGN1c3RvbURhdGE6IHsgcm9vbUF2YXRhcjogcmVzWydfaWQnXSB9LFxuICAgICAgfSkudGhlbihyb29tID0+IHsgLy8gU3VjY2Vzc1xuICAgICAgICAvLyB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJvb21DcmVhdGVkID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5sb2coYENyZWF0ZWQgcm9vbSBjYWxsZWQgJHtyb29tLm5hbWV9YCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVyciA9PiB7IC8vIEZhaWxlZCByb29tIGNyZWF0aW9uXG4gICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBjcmVhdGluZyByb29tICR7ZXJyfWApO1xuICAgICAgfSk7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyID0+IHsgLy8gRmFpbGVkIGltYWdlIHVwbG9hZFxuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHVwbG9hZGluZyByb29tIGltYWdlJyk7XG4gICAgfSk7XG4gIH1cblxuXG4gIG5nT25Jbml0KCkge1xuXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5jaGF0a2l0VXNlcik7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5jaGF0a2l0VXNlci5yb29tU3RvcmUucm9vbXMpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMucm9vbXMpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMucm9vbV9tZXNzYWdlcyk7XG4gICAgLy8gdGhpcy5jaGF0a2l0VXNlci5yb29tcztcbiAgICBjb25zb2xlLmxvZyhPYmplY3Qua2V5cyh0aGlzLnJvb21zKSk7XG4gICAgLy8gdGhpcy5yb29tcy5mb3JFYWNoKChyb29tKSA9PiB7XG4gICAgLy8gICBjb25zb2xlLmxvZyhyb29tKTtcbiAgICAvLyB9KTtcblxuXG4gICAgY29uc29sZS5sb2codGhpcy5yb29tcyk7XG5cbiAgICAvLyBjb25zb2xlLmxvZygnQ29ubmVjdGVkIGFzIHVzZXIgJywgdXNlcik7XG4gICAgLy8gdGhpcy5jaGF0a2l0VXNlciA9IHVzZXI7XG4gICAgLy8gdGhpcy5yb29tcyA9IHVzZXIucm9vbXM7XG5cbiAgICAvLyBJdGVyYXRlIHRocm91Z2ggcm9vbXMgYW5kIHN1YnNjcmliZSB0byBlYWNoXG5cbiAgICAvLyBKb2luIGZpcnN0IHJvb20gaW4gYXJyYXlcbiAgICAvLyBUT0RPOiByZWZhY3RvciB0aGlzIGltcGxlbWVudGF0aW9uXG5cbiAgICAvLyB0aGlzLmNoYXRraXRVc2VyLmpvaW5Sb29tKHtyb29tSWQ6IHRoaXMucm9vbXNbMF0uaWR9KS50aGVuKHJvb20gPT4ge1xuICAgIC8vICAgdGhpcy5jdXJyZW50X3Jvb20gPSByb29tO1xuXG5cbiAgICAvLyAgIC8vIEZldGNoIGFsbCBtZXNzYWdlcyBmb3Igam9pbmVkIHJvb21cbiAgICAvLyAgIHRoaXMuY2hhdGtpdFVzZXIuZmV0Y2hNdWx0aXBhcnRNZXNzYWdlcyh7XG4gICAgLy8gICAgIHJvb21JZDogdGhpcy5yb29tc1swXS5pZCxcbiAgICAvLyAgICAgbGltaXQ6IDEwLFxuICAgIC8vICAgfSkudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgLy8gICAgIG1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZSA9PiB7XG4gICAgLy8gICAgICAgLy8gY29uc29sZS5sb2cobWVzc2FnZS5wYXJ0c1swXS5wYXlsb2FkLmNvbnRlbnQpO1xuICAgIC8vICAgICB9KTtcbiAgICAvLyAgICAgdGhpcy5yb29tX21lc3NhZ2VzID0gbWVzc2FnZXM7XG4gICAgLy8gICB9KTtcbiAgICAvLyB9KTtcblxuXG4gIC8vIEdldCB1c2VyIGlkIGZyb20gbG9jYWwgc3RvcmFnZVxuICBjb25zdCB1c2VyX2lkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudFVzZXInKSkuX2VtYmVkZGVkLnVzZXIuaWQ7XG5cbiAgICAvLyBTdWJzY3JpYmUgdG8gbmV3IG5vdGlmaWNhdGlvbnNcbiAgICB0aGlzLm1zZ1NlcnZpY2Uubm90aWZpY2F0aW9uQ291bnRcbiAgICAuc3Vic2NyaWJlKG5vdGlmaWNhdGlvbiA9PiB0aGlzLm5vdGlmaWNhdGlvbkNvdW50ID0gbm90aWZpY2F0aW9uKTtcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNoYXRraXRVc2VyKTtcbiAgICB9XG59XG4iXX0=