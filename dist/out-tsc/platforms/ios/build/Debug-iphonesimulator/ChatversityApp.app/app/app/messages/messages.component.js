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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC9hcHAvbWVzc2FnZXMvbWVzc2FnZXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXdFO0FBQ3hFLDZDQUErRDtBQUMvRCw4REFBNkQ7QUFDN0QseUVBQXVFO0FBQ3ZFLHdDQUFvRTtBQUNwRSwrREFBNkQ7QUFPN0Q7SUFzREUsMkJBQW9CLElBQWdCLEVBQVUsVUFBNEIsRUFBVSxLQUFrQjtRQUF0RyxpQkF5QkM7UUF6Qm1CLFNBQUksR0FBSixJQUFJLENBQVk7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFrQjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQWE7UUE5Q3RHLFVBQUssR0FBZSxFQUFFLENBQUM7UUFHdkIsa0JBQWEsR0FBZSxFQUFFLENBQUM7UUFLL0IsYUFBUSxHQUFHLEVBQUUsQ0FBQztRQUVkLHNCQUFpQixHQUFlLEVBQUUsQ0FBQztRQVluQyx3Q0FBd0M7UUFDeEMsaUJBQVksR0FBRyxFQUFFLENBQUM7UUFRbEIsZUFBVSxHQUFHLElBQUksaUJBQVMsQ0FBQztZQUN6QixlQUFlLEVBQUUsSUFBSSxpQkFBUyxDQUFDO2dCQUM3QixVQUFVLEVBQUUsSUFBSSxtQkFBVyxDQUFDLEVBQUUsQ0FBQzthQUNoQyxDQUFDO1lBQ0YsYUFBYSxFQUFFLElBQUksaUJBQVMsQ0FBQztnQkFDM0IsUUFBUSxFQUFFLElBQUksbUJBQVcsQ0FBQyxFQUFFLEVBQUU7b0JBQzVCLGtCQUFVLENBQUMsUUFBUTtvQkFDbkIsa0JBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO2lCQUN6QixDQUFDO2FBQ0gsQ0FBQztZQUNGLGdCQUFnQixFQUFFLElBQUksaUJBQVMsQ0FBQztn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RCx3QkFBQztDQUFBLEFBM1ZELElBMlZDO0FBM1ZZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uLy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBNZXNzYWdpbmdTZXJ2aWNlIH0gZnJvbSAnLi4vQ29yZS9fc2VydmljZXMvbWVzc2FnaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgRm9ybUdyb3VwLCBGb3JtQ29udHJvbCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW1lc3NhZ2VzJyxcbiAgdGVtcGxhdGVVcmw6ICcuL21lc3NhZ2VzLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbWVzc2FnZXMuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBNZXNzYWdlc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBWaWV3Q2hpbGQoJ2F2YXRhcicpIGF2YXRhcjogRWxlbWVudFJlZjtcbiAgZmlsZVRvVXBsb2FkOiBGaWxlO1xuXG4gIGltYWdlUGF0aDogYW55O1xuXG4gIG5vdGlmaWNhdGlvbkNvdW50OiBhbnk7XG5cbiAgcm9vbXM6IEFycmF5PGFueT4gPSBbXTtcbiAgY3VycmVudFVzZXI6IGFueTtcbiAgdXNlcl9pZDogYW55O1xuICByb29tX21lc3NhZ2VzOiBBcnJheTxhbnk+ID0gW107XG4gIC8vIHJvb21fbWVzc2FnZXM6IE9ic2VydmFibGU8YW55W10+O1xuICBjdXJyZW50X3Jvb206IGFueTtcbiAgY2hhdFVzZXI6IGFueTtcblxuICBfbWVzc2FnZSA9ICcnO1xuICByb29tQ3JlYXRlZDogYm9vbGVhbjtcbiAgcm9vbU5vdGlmaWNhdGlvbnM6IEFycmF5PGFueT4gPSBbXTtcbiAgY2hhdGtpdFVzZXI6IGFueTtcbiAgc3Vic2NyaXB0aW9uOiBhbnk7XG4gIGluY29taW5nTWVzc2FnZXM6IGFueTtcbiAgXG4gIGdldCBtZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX21lc3NhZ2U7XG4gIH1cbiAgc2V0IG1lc3NhZ2UodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX21lc3NhZ2UgPSB2YWx1ZTtcbiAgfVxuXG4gIC8vIFRPRE86IENhbiBwcm9iYWJseSByZW1vdmUgdGhlc2UgcHJvcHNcbiAgX3Jvb21Qcml2YXRlID0gJyc7XG4gIGdldCByb29tUHJpdmF0ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9yb29tUHJpdmF0ZTtcbiAgfVxuICBzZXQgcm9vbVByaXZhdGUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3Jvb21Qcml2YXRlID0gdmFsdWU7XG4gIH1cblxuICBmb3JtSW1wb3J0ID0gbmV3IEZvcm1Hcm91cCh7XG4gICAgaW1wb3J0RmlsZUdyb3VwOiBuZXcgRm9ybUdyb3VwKHtcbiAgICAgIGltcG9ydEZpbGU6IG5ldyBGb3JtQ29udHJvbCgnJyksXG4gICAgfSksXG4gICAgcm9vbU5hbWVHcm91cDogbmV3IEZvcm1Hcm91cCh7XG4gICAgICByb29tTmFtZTogbmV3IEZvcm1Db250cm9sKCcnLCBbXG4gICAgICAgIFZhbGlkYXRvcnMucmVxdWlyZWQsXG4gICAgICAgIFZhbGlkYXRvcnMubWF4TGVuZ3RoKDYwKVxuICAgICAgXSlcbiAgICB9KSxcbiAgICBwcml2YXRlUm9vbUdyb3VwOiBuZXcgRm9ybUdyb3VwKHtcbiAgICAgIHByaXZhdGVSb29tOiBuZXcgRm9ybUNvbnRyb2woJycpXG4gICAgfSlcbiAgfSk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIG1zZ1NlcnZpY2U6IE1lc3NhZ2luZ1NlcnZpY2UsIHByaXZhdGUgX2F1dGg6IEF1dGhTZXJ2aWNlKSB7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuX2F1dGguY2hhdGtpdFVzZXIkLnN1YnNjcmliZShcbiAgICAgICh1c2VyKSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXIpO1xuICAgICAgICB0aGlzLmNoYXRraXRVc2VyID0gdXNlcjtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5jaGF0a2l0VXNlcik7XG4gICAgICAgIHRoaXMucm9vbXMgPSB1c2VyLnJvb21zO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnJvb21zKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy5pbmNvbWluZ01lc3NhZ2VzID0gdGhpcy5fYXV0aC5tZXNzYWdlcyQuc3Vic2NyaWJlKFxuICAgICAgKGluY29taW5nTWVzc2FnZSkgPT4ge1xuICAgICAgICB0aGlzLnJvb21fbWVzc2FnZXMucHVzaChpbmNvbWluZ01lc3NhZ2UpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLmN1cnJlbnRfcm9vbSA9IHRoaXMuX2F1dGguY3VycmVudFJvb20kLnN1YnNjcmliZShcbiAgICAgIChjdXJyZW50Um9vbSkgPT4ge1xuICAgICAgICB0aGlzLmN1cnJlbnRfcm9vbSA9IGN1cnJlbnRSb29tO1xuICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50Um9vbSk7XG4gICAgICB9XG4gICAgKTtcblxuICB9XG5cbiAgdXJsOiBzdHJpbmc7XG4gIG9uRmlsZUNoYW5nZShldmVudCkge1xuICAgIGlmICghKGV2ZW50LnRhcmdldC5maWxlcyAmJiBldmVudC50YXJnZXQuZmlsZXNbMF0pKSB7IHJldHVybjsgfVxuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXNbMF07XG4gICAgdGhpcy5maWxlVG9VcGxvYWQgPSBmaWxlO1xuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7IC8vIHJlYWQgZmlsZSBhcyBkYXRhIHVybFxuICAgIHJlYWRlci5vbmxvYWQgPSAoX2V2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhyZWFkZXIucmVzdWx0KTsgLy8gbG9nIGJhc2U2NCBzdHJpbmdcbiAgICAgIHRoaXMuaW1hZ2VQYXRoID0gcmVhZGVyLnJlc3VsdDtcbiAgICB9O1xuICB9XG5cblxuICAvLyBTZW5kIGEgbWVzc2FnZVxuICBzZW5kTWVzc2FnZSgpIHtcbiAgICBjb25zdCB7IG1lc3NhZ2UsIGN1cnJlbnRVc2VyIH0gPSB0aGlzO1xuICAgIHRoaXMuY2hhdGtpdFVzZXIuc2VuZE1lc3NhZ2Uoe1xuICAgICAgdGV4dDogbWVzc2FnZSxcbiAgICAgIHJvb21JZDogdGhpcy5jdXJyZW50X3Jvb20uaWQsXG4gICAgfSkudGhlbihyZXMgPT4ge1xuICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICB9KTtcbiAgICB0aGlzLm1lc3NhZ2UgPSAnJztcbiAgfVxuXG5cbiAgLy8gSm9pbiBhIHJvb21cbiAgam9pblJvb20ocm9vbUlEKSB7XG4gICAgdGhpcy5jaGF0a2l0VXNlci5qb2luUm9vbSh7cm9vbUlkOiByb29tSUR9KS50aGVuKHJvb20gPT4ge1xuICAgICAgdGhpcy5jdXJyZW50X3Jvb20gPSByb29tO1xuXG4gICAgICAvLyBBZnRlciBqb2luaW5nIHJvb20sIGZldGNoIG1lc3NhZ2VzXG4gICAgICB0aGlzLmNoYXRraXRVc2VyLmZldGNoTXVsdGlwYXJ0TWVzc2FnZXMoe3Jvb21JZDogcm9vbUlEfSkudGhlbihtZXNzYWdlcyA9PiB7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgbWVzc2FnZXNcbiAgICAgICAgaWYgKG1lc3NhZ2VzID09PSB1bmRlZmluZWQgfHwgbWVzc2FnZXMubGVuZ3RoID09PSAwKSB7IHJldHVybjsgfVxuXG4gICAgICAgIC8vIFNldCByZWFkIGN1cnNvclxuICAgICAgICB0aGlzLmNoYXRraXRVc2VyLnNldFJlYWRDdXJzb3Ioe1xuICAgICAgICAgIHJvb21JZDogdGhpcy5jdXJyZW50X3Jvb20uaWQsXG4gICAgICAgICAgcG9zaXRpb246IG1lc3NhZ2VzW21lc3NhZ2VzLmxlbmd0aCAtIDFdLmlkXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJvb21Ob3RpZmljYXRpb25zW3Jvb20uaWRdID0gZmFsc2U7XG4gICAgICAgIH0pOyAvLyBSZW1vdmUgbWFya2VyIGZyb20gbm90aWZpY2F0aW9ucyBhcnJheVxuICAgICAgICAvLyAudGhlbigoKSA9PiB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnU2V0IGN1cnNvcicpO1xuICAgICAgICAvLyAgIH0pXG4gICAgICAgIC8vICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhgRXJyb3Igc2V0dGluZyBjdXJzb3I6ICR7ZXJyfWApO1xuICAgICAgICAvLyAgIH0pO1xuICAgICAgICBtZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1lc3NhZ2UucGFydHNbMF0ucGF5bG9hZC5jb250ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucm9vbV9tZXNzYWdlcyA9IG1lc3NhZ2VzO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgLy8gZW5kIEpvaW4gcm9vbVxuXG5cbiAgLy8gRnVuY3Rpb24gPT4gY2hlY2sgaWYgdXNlciBoYXMgdW5yZWFkIG1lc3NhZ2VzIGluIGEgcm9vbVxuICBoYXNVbnJlYWQocm9vbUlEKSB7XG5cbiAgICBsZXQgaGFzVW5yZWFkID0gZmFsc2U7IC8vIFRyYWNrIHJldHVybiBzdGF0dXNcblxuICAgIC8vIEZpcnN0LCBjaGVjayBpZiBjdXJzb3IgZXhpc3RzXG4gICAgY29uc3QgY3Vyc29yID0gdGhpcy5jaGF0a2l0VXNlci5yZWFkQ3Vyc29yKHtcbiAgICAgIHJvb21JZDogcm9vbUlEXG4gICAgfSk7XG5cbiAgICAgIC8vIGlmIHJlYWQgY3Vyc29yIElEICE9PSBsYXRlc3QgbWVzc2FnZSBJRC4uLlxuICAgICAgdGhpcy5jaGF0a2l0VXNlci5mZXRjaE11bHRpcGFydE1lc3NhZ2VzKHsgLy8gR2V0IGxhdGVzdCBtZXNzYWdlXG4gICAgICAgIHJvb21JZDogcm9vbUlELFxuICAgICAgICBsaW1pdDogMSxcbiAgICAgIH0pXG4gICAgICAudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgICAgIGlmIChjdXJzb3IpIHsgLy8gSGFzIGN1cnNvciBzbyBjaGVjayBjdXJzb3IgcG9zIHZzIGxhdGVzdCBtZXNzYWdlIGlkXG4gICAgICAgICAgaGFzVW5yZWFkID0gKGN1cnNvci5wb3NpdGlvbiAhPT0gbWVzc2FnZXNbMF0uaW5pdGlhbElkKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBObyBjdXJzb3IgPT4gc2V0XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYEVycm9yIGZldGNoaW5nIG1lc3NhZ2VzOiAke2Vycn1gKTtcbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIGhhc1VucmVhZDtcbiAgfVxuXG5cbiAgLy8gR2V0IENoYXRraXQgdXNlclxuICBnZXRVc2VyKHVzZXJfaWQpIHtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2NoYXRraXQvZ2V0dXNlcmAsIHt1c2VyX2lkfSlcbiAgICAudG9Qcm9taXNlKClcbiAgICAudGhlbihyZXMgPT4ge1xuICAgICAgcmV0dXJuIHJlcztcbiAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpKTtcbiAgfVxuXG4gIC8vIEdldCBDaGF0a2l0IHVzZXIncyByb29tc1xuICBnZXRVc2VyUm9vbXModXNlcl9pZCkge1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke2Vudmlyb25tZW50LmFwaVVybH0vY2hhdGtpdC9nZXR1c2Vycm9vbXNgLCB7dXNlcl9pZH0pXG4gICAgLnRvUHJvbWlzZSgpXG4gICAgLnRoZW4ocmVzID0+IHtcbiAgICAgIC8vIHRoaXMucm9vbXMgPSByZXM7XG4gICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9KVxuICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvcikpO1xuICB9XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIFNVQlNDUklCRSBUTyBST09NIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgc3Vic2NyaWJlVG9Sb29tKHJvb21JRCkge1xuICAgICAgdGhpcy5jaGF0a2l0VXNlci5zdWJzY3JpYmVUb1Jvb21NdWx0aXBhcnQoe1xuICAgICAgICByb29tSWQ6IHJvb21JRCxcbiAgICAgICAgaG9va3M6IHtcbiAgICAgICAgICBvbk1lc3NhZ2U6IG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgLy8gV2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuLi5cblxuICAgICAgICAgICAgLy8gUHVzaCB0byBtZXNzYWdlcyBhcnJheSBhbmQgdXBkYXRlIHZpZXdcbiAgICAgICAgICAgIHRoaXMucm9vbV9tZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHVzZXJzIGxhc3QgY3Vyc29yIHBvc2l0aW9uIGZyb20gdGhlIHJvb21cbiAgICAgICAgICAgIGNvbnN0IGN1cnNvciA9IHRoaXMuY2hhdGtpdFVzZXIucmVhZEN1cnNvcih7XG4gICAgICAgICAgICAgIHJvb21JZDogbWVzc2FnZS5yb29tSWRcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoKGN1cnNvci5wb3NpdGlvbiAhPT0gbWVzc2FnZS5pZCkgJiYgKG1lc3NhZ2Uucm9vbUlkICE9PSB0aGlzLmN1cnJlbnRfcm9vbS5pZCkpIHtcbiAgICAgICAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgdXNlciBoYXMgbm90IHNlZW4gdGhlIG1lc3NhZ2UsIEFORCB0aGUgbWVzc2FnZSB3YXMgcmVjZWl2ZWQgaW4gYSBkaWZmZXJlbnQgcm9vbSxcbiAgICAgICAgICAgICAgLy8gYWRkIG1hcmtlciB0byBub3RpZmljYXRpb24gYXJyYXlcbiAgICAgICAgICAgICAgdGhpcy5yb29tTm90aWZpY2F0aW9uc1ttZXNzYWdlLnJvb20uaWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgbWVzc2FnZSB3YXMgc2VudCBpbiBjdXJyZW50IHJvb20sIHNvIGFsbCB3ZSBtdXN0IGRvIGlzIHVwZGF0ZSB0aGVcbiAgICAgICAgICAgICAgLy8gcmVhZCBjdXJzb3IgZm9yIHRoZSBjdXJyZW50IHVzZXIncyByb29tXG4gICAgICAgICAgICAgIHRoaXMuY2hhdGtpdFVzZXIuc2V0UmVhZEN1cnNvcih7XG4gICAgICAgICAgICAgICAgcm9vbUlkOiBtZXNzYWdlLnJvb21JZCxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbWVzc2FnZS5pZCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENvdW50IHJvb21zIHdpdGggdW5yZWFkIG5vdGlmdWNhdGlvbnNcbiAgICAgICAgICAgIGxldCByb29tc1dpdGhOb3RpZmljYXRpb25zID0gMDtcbiAgICAgICAgICAgIHRoaXMucm9vbU5vdGlmaWNhdGlvbnMuZm9yRWFjaChyb29tID0+IHtcbiAgICAgICAgICAgICAgcm9vbXNXaXRoTm90aWZpY2F0aW9ucyArPSByb29tID09PSB0cnVlID8gMSA6IDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIEFkZCB0byBnbG9iYWwgbm90aWZpY2F0aW9uIGNvdW50ZXJcbiAgICAgICAgICAgIHRoaXMubXNnU2VydmljZS5zZXRSb29tc1dpdGhOb3RpZmljYXRpb25zKHJvb21zV2l0aE5vdGlmaWNhdGlvbnMpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb25BZGRlZFRvUm9vbTogcm9vbSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQWRkZWQgdG8gcm9vbSAke3Jvb20ubmFtZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VMaW1pdDogMFxuICAgICAgfSk7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG4gIC8vIENyZWF0ZSByb29tXG4gIGNyZWF0ZVJvb20oKSB7XG4gICAgdGhpcy5yb29tQ3JlYXRlZCA9IHRydWU7IHJldHVybjtcbiAgICAvLyB0aGlzLmlzTG9hZGluZyA9IHRydWU7IC8vIERpc3BsYXkgbG9hZGluZyBpY29uXG4gICAgY29uc3Qgcm9vbU5hbWUgPSB0aGlzLmZvcm1JbXBvcnQudmFsdWUucm9vbU5hbWVHcm91cC5yb29tTmFtZTtcbiAgICBjb25zdCBwcml2YXRlUm9vbSA9IHRoaXMuZm9ybUltcG9ydC52YWx1ZS5wcml2YXRlUm9vbUdyb3VwLnByaXZhdGVSb29tO1xuICAgIGNvbnN0IHJvb21BdmF0YXIgPSB0aGlzLmZvcm1JbXBvcnQudmFsdWUuaW1wb3J0RmlsZUdyb3VwLmltcG9ydEZpbGU7XG4gICAgY29uc29sZS5sb2codGhpcy5mb3JtSW1wb3J0LnZhbHVlLnJvb21OYW1lR3JvdXAucm9vbU5hbWUpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuZm9ybUltcG9ydC52YWx1ZS5wcml2YXRlUm9vbUdyb3VwLnByaXZhdGVSb29tKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmZvcm1JbXBvcnQudmFsdWUuaW1wb3J0RmlsZUdyb3VwLmltcG9ydEZpbGUpO1xuXG4gICAgY29uc29sZS5sb2codGhpcy5maWxlVG9VcGxvYWQpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuZm9ybUltcG9ydC52YWx1ZSk7XG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGNvbnN0IGI2NHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHRoaXMuaW1hZ2VQYXRoKTtcblxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGI2NHN0cmluZyk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCd0ZXN0dmFyJywgJ215IHRlc3QgdmFyIHZhbHVlJyk7XG5cbiAgICBjb25zb2xlLmxvZyhmb3JtRGF0YSk7XG5cbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XG4gICAgaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcbiAgICBoZWFkZXJzLmFwcGVuZCgnQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcblxuICAgIC8vIENyZWF0ZSByb29tIGFuZCBpbnNlcnQgcm9vbSBhdmF0YXIgaW50byBkYXRhYmFzZVxuICAgIHRoaXMuaHR0cC5wb3N0KGAke2Vudmlyb25tZW50LmFwaVVybH0vYXNkZmAsIGZvcm1EYXRhKVxuICAgIC50b1Byb21pc2UoKVxuICAgIC50aGVuKHJlcyA9PiB7IC8vIEltYWdlIHVwbG9hZGVkXG4gICAgICBjb25zb2xlLmxvZyhyZXMpO1xuXG4gICAgICBjb25zb2xlLmxvZygnSW1hZ2UgdXBsb2FkZWQnKTtcbiAgICAgIHRoaXMuY2hhdGtpdFVzZXIuY3JlYXRlUm9vbSh7IC8vIENyZWF0ZSB0aGUgcm9vbVxuICAgICAgICBuYW1lOiByb29tTmFtZSxcbiAgICAgICAgcHJpdmF0ZTogdHJ1ZSxcbiAgICAgICAgY3VzdG9tRGF0YTogeyByb29tQXZhdGFyOiByZXNbJ19pZCddIH0sXG4gICAgICB9KS50aGVuKHJvb20gPT4geyAvLyBTdWNjZXNzXG4gICAgICAgIC8vIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucm9vbUNyZWF0ZWQgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmxvZyhgQ3JlYXRlZCByb29tIGNhbGxlZCAke3Jvb20ubmFtZX1gKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyID0+IHsgLy8gRmFpbGVkIHJvb20gY3JlYXRpb25cbiAgICAgICAgY29uc29sZS5sb2coYEVycm9yIGNyZWF0aW5nIHJvb20gJHtlcnJ9YCk7XG4gICAgICB9KTtcbiAgICB9KVxuICAgIC5jYXRjaChlcnIgPT4geyAvLyBGYWlsZWQgaW1hZ2UgdXBsb2FkXG4gICAgICBjb25zb2xlLmxvZygnRXJyb3IgdXBsb2FkaW5nIHJvb20gaW1hZ2UnKTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgbmdPbkluaXQoKSB7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNoYXRraXRVc2VyKTtcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNoYXRraXRVc2VyLnJvb21TdG9yZS5yb29tcyk7XG4gICAgY29uc29sZS5sb2codGhpcy5yb29tcyk7XG4gICAgY29uc29sZS5sb2codGhpcy5yb29tX21lc3NhZ2VzKTtcbiAgICAvLyB0aGlzLmNoYXRraXRVc2VyLnJvb21zO1xuICAgIGNvbnNvbGUubG9nKE9iamVjdC5rZXlzKHRoaXMucm9vbXMpKTtcbiAgICAvLyB0aGlzLnJvb21zLmZvckVhY2goKHJvb20pID0+IHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKHJvb20pO1xuICAgIC8vIH0pO1xuXG5cbiAgICBjb25zb2xlLmxvZyh0aGlzLnJvb21zKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdDb25uZWN0ZWQgYXMgdXNlciAnLCB1c2VyKTtcbiAgICAvLyB0aGlzLmNoYXRraXRVc2VyID0gdXNlcjtcbiAgICAvLyB0aGlzLnJvb21zID0gdXNlci5yb29tcztcblxuICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCByb29tcyBhbmQgc3Vic2NyaWJlIHRvIGVhY2hcblxuICAgIC8vIEpvaW4gZmlyc3Qgcm9vbSBpbiBhcnJheVxuICAgIC8vIFRPRE86IHJlZmFjdG9yIHRoaXMgaW1wbGVtZW50YXRpb25cblxuICAgIC8vIHRoaXMuY2hhdGtpdFVzZXIuam9pblJvb20oe3Jvb21JZDogdGhpcy5yb29tc1swXS5pZH0pLnRoZW4ocm9vbSA9PiB7XG4gICAgLy8gICB0aGlzLmN1cnJlbnRfcm9vbSA9IHJvb207XG5cblxuICAgIC8vICAgLy8gRmV0Y2ggYWxsIG1lc3NhZ2VzIGZvciBqb2luZWQgcm9vbVxuICAgIC8vICAgdGhpcy5jaGF0a2l0VXNlci5mZXRjaE11bHRpcGFydE1lc3NhZ2VzKHtcbiAgICAvLyAgICAgcm9vbUlkOiB0aGlzLnJvb21zWzBdLmlkLFxuICAgIC8vICAgICBsaW1pdDogMTAsXG4gICAgLy8gICB9KS50aGVuKG1lc3NhZ2VzID0+IHtcbiAgICAvLyAgICAgbWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAvLyAgICAgICAvLyBjb25zb2xlLmxvZyhtZXNzYWdlLnBhcnRzWzBdLnBheWxvYWQuY29udGVudCk7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vICAgICB0aGlzLnJvb21fbWVzc2FnZXMgPSBtZXNzYWdlcztcbiAgICAvLyAgIH0pO1xuICAgIC8vIH0pO1xuXG5cbiAgLy8gR2V0IHVzZXIgaWQgZnJvbSBsb2NhbCBzdG9yYWdlXG4gIGNvbnN0IHVzZXJfaWQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50VXNlcicpKS5fZW1iZWRkZWQudXNlci5pZDtcblxuICAgIC8vIFN1YnNjcmliZSB0byBuZXcgbm90aWZpY2F0aW9uc1xuICAgIHRoaXMubXNnU2VydmljZS5ub3RpZmljYXRpb25Db3VudFxuICAgIC5zdWJzY3JpYmUobm90aWZpY2F0aW9uID0+IHRoaXMubm90aWZpY2F0aW9uQ291bnQgPSBub3RpZmljYXRpb24pO1xuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY2hhdGtpdFVzZXIpO1xuICAgIH1cbn1cbiJdfQ==