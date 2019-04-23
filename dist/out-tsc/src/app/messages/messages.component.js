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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9tZXNzYWdlcy9tZXNzYWdlcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBd0U7QUFDeEUsNkNBQStEO0FBQy9ELDhEQUE2RDtBQUM3RCx5RUFBdUU7QUFDdkUsd0NBQW9FO0FBQ3BFLCtEQUE2RDtBQU83RDtJQXNERSwyQkFBb0IsSUFBZ0IsRUFBVSxVQUE0QixFQUFVLEtBQWtCO1FBQXRHLGlCQXlCQztRQXpCbUIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUFVLGVBQVUsR0FBVixVQUFVLENBQWtCO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQTlDdEcsVUFBSyxHQUFlLEVBQUUsQ0FBQztRQUd2QixrQkFBYSxHQUFlLEVBQUUsQ0FBQztRQUsvQixhQUFRLEdBQUcsRUFBRSxDQUFDO1FBRWQsc0JBQWlCLEdBQWUsRUFBRSxDQUFDO1FBWW5DLHdDQUF3QztRQUN4QyxpQkFBWSxHQUFHLEVBQUUsQ0FBQztRQVFsQixlQUFVLEdBQUcsSUFBSSxpQkFBUyxDQUFDO1lBQ3pCLGVBQWUsRUFBRSxJQUFJLGlCQUFTLENBQUM7Z0JBQzdCLFVBQVUsRUFBRSxJQUFJLG1CQUFXLENBQUMsRUFBRSxDQUFDO2FBQ2hDLENBQUM7WUFDRixhQUFhLEVBQUUsSUFBSSxpQkFBUyxDQUFDO2dCQUMzQixRQUFRLEVBQUUsSUFBSSxtQkFBVyxDQUFDLEVBQUUsRUFBRTtvQkFDNUIsa0JBQVUsQ0FBQyxRQUFRO29CQUNuQixrQkFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7aUJBQ3pCLENBQUM7YUFDSCxDQUFDO1lBQ0YsZ0JBQWdCLEVBQUUsSUFBSSxpQkFBUyxDQUFDO2dCQUM5QixXQUFXLEVBQUUsSUFBSSxtQkFBVyxDQUFDLEVBQUUsQ0FBQzthQUNqQyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBSUQsSUFB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LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcbmltcG9ydCB7IE1lc3NhZ2luZ1NlcnZpY2UgfSBmcm9tICcuLi9Db3JlL19zZXJ2aWNlcy9tZXNzYWdpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBGb3JtR3JvdXAsIEZvcm1Db250cm9sLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbWVzc2FnZXMnLFxuICB0ZW1wbGF0ZVVybDogJy4vbWVzc2FnZXMuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9tZXNzYWdlcy5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQFZpZXdDaGlsZCgnYXZhdGFyJykgYXZhdGFyOiBFbGVtZW50UmVmO1xuICBmaWxlVG9VcGxvYWQ6IEZpbGU7XG5cbiAgaW1hZ2VQYXRoOiBhbnk7XG5cbiAgbm90aWZpY2F0aW9uQ291bnQ6IGFueTtcblxuICByb29tczogQXJyYXk8YW55PiA9IFtdO1xuICBjdXJyZW50VXNlcjogYW55O1xuICB1c2VyX2lkOiBhbnk7XG4gIHJvb21fbWVzc2FnZXM6IEFycmF5PGFueT4gPSBbXTtcbiAgLy8gcm9vbV9tZXNzYWdlczogT2JzZXJ2YWJsZTxhbnlbXT47XG4gIGN1cnJlbnRfcm9vbTogYW55O1xuICBjaGF0VXNlcjogYW55O1xuXG4gIF9tZXNzYWdlID0gJyc7XG4gIHJvb21DcmVhdGVkOiBib29sZWFuO1xuICByb29tTm90aWZpY2F0aW9uczogQXJyYXk8YW55PiA9IFtdO1xuICBjaGF0a2l0VXNlcjogYW55O1xuICBzdWJzY3JpcHRpb246IGFueTtcbiAgaW5jb21pbmdNZXNzYWdlczogYW55O1xuICBcbiAgZ2V0IG1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZTtcbiAgfVxuICBzZXQgbWVzc2FnZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fbWVzc2FnZSA9IHZhbHVlO1xuICB9XG5cbiAgLy8gVE9ETzogQ2FuIHByb2JhYmx5IHJlbW92ZSB0aGVzZSBwcm9wc1xuICBfcm9vbVByaXZhdGUgPSAnJztcbiAgZ2V0IHJvb21Qcml2YXRlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvb21Qcml2YXRlO1xuICB9XG4gIHNldCByb29tUHJpdmF0ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fcm9vbVByaXZhdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGZvcm1JbXBvcnQgPSBuZXcgRm9ybUdyb3VwKHtcbiAgICBpbXBvcnRGaWxlR3JvdXA6IG5ldyBGb3JtR3JvdXAoe1xuICAgICAgaW1wb3J0RmlsZTogbmV3IEZvcm1Db250cm9sKCcnKSxcbiAgICB9KSxcbiAgICByb29tTmFtZUdyb3VwOiBuZXcgRm9ybUdyb3VwKHtcbiAgICAgIHJvb21OYW1lOiBuZXcgRm9ybUNvbnRyb2woJycsIFtcbiAgICAgICAgVmFsaWRhdG9ycy5yZXF1aXJlZCxcbiAgICAgICAgVmFsaWRhdG9ycy5tYXhMZW5ndGgoNjApXG4gICAgICBdKVxuICAgIH0pLFxuICAgIHByaXZhdGVSb29tR3JvdXA6IG5ldyBGb3JtR3JvdXAoe1xuICAgICAgcHJpdmF0ZVJvb206IG5ldyBGb3JtQ29udHJvbCgnJylcbiAgICB9KVxuICB9KTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgbXNnU2VydmljZTogTWVzc2FnaW5nU2VydmljZSwgcHJpdmF0ZSBfYXV0aDogQXV0aFNlcnZpY2UpIHtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5fYXV0aC5jaGF0a2l0VXNlciQuc3Vic2NyaWJlKFxuICAgICAgKHVzZXIpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2codXNlcik7XG4gICAgICAgIHRoaXMuY2hhdGtpdFVzZXIgPSB1c2VyO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNoYXRraXRVc2VyKTtcbiAgICAgICAgdGhpcy5yb29tcyA9IHVzZXIucm9vbXM7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucm9vbXMpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLmluY29taW5nTWVzc2FnZXMgPSB0aGlzLl9hdXRoLm1lc3NhZ2VzJC5zdWJzY3JpYmUoXG4gICAgICAoaW5jb21pbmdNZXNzYWdlKSA9PiB7XG4gICAgICAgIHRoaXMucm9vbV9tZXNzYWdlcy5wdXNoKGluY29taW5nTWVzc2FnZSk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIHRoaXMuY3VycmVudF9yb29tID0gdGhpcy5fYXV0aC5jdXJyZW50Um9vbSQuc3Vic2NyaWJlKFxuICAgICAgKGN1cnJlbnRSb29tKSA9PiB7XG4gICAgICAgIHRoaXMuY3VycmVudF9yb29tID0gY3VycmVudFJvb207XG4gICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnRSb29tKTtcbiAgICAgIH1cbiAgICApO1xuXG4gIH1cblxuICB1cmw6IHN0cmluZztcbiAgb25GaWxlQ2hhbmdlKGV2ZW50KSB7XG4gICAgaWYgKCEoZXZlbnQudGFyZ2V0LmZpbGVzICYmIGV2ZW50LnRhcmdldC5maWxlc1swXSkpIHsgcmV0dXJuOyB9XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlc1swXTtcbiAgICB0aGlzLmZpbGVUb1VwbG9hZCA9IGZpbGU7XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTsgLy8gcmVhZCBmaWxlIGFzIGRhdGEgdXJsXG4gICAgcmVhZGVyLm9ubG9hZCA9IChfZXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHJlYWRlci5yZXN1bHQpOyAvLyBsb2cgYmFzZTY0IHN0cmluZ1xuICAgICAgdGhpcy5pbWFnZVBhdGggPSByZWFkZXIucmVzdWx0O1xuICAgIH07XG4gIH1cblxuXG4gIC8vIFNlbmQgYSBtZXNzYWdlXG4gIHNlbmRNZXNzYWdlKCkge1xuICAgIGNvbnN0IHsgbWVzc2FnZSwgY3VycmVudFVzZXIgfSA9IHRoaXM7XG4gICAgdGhpcy5jaGF0a2l0VXNlci5zZW5kTWVzc2FnZSh7XG4gICAgICB0ZXh0OiBtZXNzYWdlLFxuICAgICAgcm9vbUlkOiB0aGlzLmN1cnJlbnRfcm9vbS5pZCxcbiAgICB9KS50aGVuKHJlcyA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgIH0pO1xuICAgIHRoaXMubWVzc2FnZSA9ICcnO1xuICB9XG5cblxuICAvLyBKb2luIGEgcm9vbVxuICBqb2luUm9vbShyb29tSUQpIHtcbiAgICB0aGlzLmNoYXRraXRVc2VyLmpvaW5Sb29tKHtyb29tSWQ6IHJvb21JRH0pLnRoZW4ocm9vbSA9PiB7XG4gICAgICB0aGlzLmN1cnJlbnRfcm9vbSA9IHJvb207XG5cbiAgICAgIC8vIEFmdGVyIGpvaW5pbmcgcm9vbSwgZmV0Y2ggbWVzc2FnZXNcbiAgICAgIHRoaXMuY2hhdGtpdFVzZXIuZmV0Y2hNdWx0aXBhcnRNZXNzYWdlcyh7cm9vbUlkOiByb29tSUR9KS50aGVuKG1lc3NhZ2VzID0+IHtcblxuICAgICAgICAvLyBDaGVjayBpZiBtZXNzYWdlc1xuICAgICAgICBpZiAobWVzc2FnZXMgPT09IHVuZGVmaW5lZCB8fCBtZXNzYWdlcy5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgLy8gU2V0IHJlYWQgY3Vyc29yXG4gICAgICAgIHRoaXMuY2hhdGtpdFVzZXIuc2V0UmVhZEN1cnNvcih7XG4gICAgICAgICAgcm9vbUlkOiB0aGlzLmN1cnJlbnRfcm9vbS5pZCxcbiAgICAgICAgICBwb3NpdGlvbjogbWVzc2FnZXNbbWVzc2FnZXMubGVuZ3RoIC0gMV0uaWRcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMucm9vbU5vdGlmaWNhdGlvbnNbcm9vbS5pZF0gPSBmYWxzZTtcbiAgICAgICAgfSk7IC8vIFJlbW92ZSBtYXJrZXIgZnJvbSBub3RpZmljYXRpb25zIGFycmF5XG4gICAgICAgIC8vIC50aGVuKCgpID0+IHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdTZXQgY3Vyc29yJyk7XG4gICAgICAgIC8vICAgfSlcbiAgICAgICAgLy8gICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGBFcnJvciBzZXR0aW5nIGN1cnNvcjogJHtlcnJ9YCk7XG4gICAgICAgIC8vICAgfSk7XG4gICAgICAgIG1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZSA9PiB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2cobWVzc2FnZS5wYXJ0c1swXS5wYXlsb2FkLmNvbnRlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yb29tX21lc3NhZ2VzID0gbWVzc2FnZXM7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICAvLyBlbmQgSm9pbiByb29tXG5cblxuICAvLyBGdW5jdGlvbiA9PiBjaGVjayBpZiB1c2VyIGhhcyB1bnJlYWQgbWVzc2FnZXMgaW4gYSByb29tXG4gIGhhc1VucmVhZChyb29tSUQpIHtcblxuICAgIGxldCBoYXNVbnJlYWQgPSBmYWxzZTsgLy8gVHJhY2sgcmV0dXJuIHN0YXR1c1xuXG4gICAgLy8gRmlyc3QsIGNoZWNrIGlmIGN1cnNvciBleGlzdHNcbiAgICBjb25zdCBjdXJzb3IgPSB0aGlzLmNoYXRraXRVc2VyLnJlYWRDdXJzb3Ioe1xuICAgICAgcm9vbUlkOiByb29tSURcbiAgICB9KTtcblxuICAgICAgLy8gaWYgcmVhZCBjdXJzb3IgSUQgIT09IGxhdGVzdCBtZXNzYWdlIElELi4uXG4gICAgICB0aGlzLmNoYXRraXRVc2VyLmZldGNoTXVsdGlwYXJ0TWVzc2FnZXMoeyAvLyBHZXQgbGF0ZXN0IG1lc3NhZ2VcbiAgICAgICAgcm9vbUlkOiByb29tSUQsXG4gICAgICAgIGxpbWl0OiAxLFxuICAgICAgfSlcbiAgICAgIC50aGVuKG1lc3NhZ2VzID0+IHtcbiAgICAgICAgaWYgKGN1cnNvcikgeyAvLyBIYXMgY3Vyc29yIHNvIGNoZWNrIGN1cnNvciBwb3MgdnMgbGF0ZXN0IG1lc3NhZ2UgaWRcbiAgICAgICAgICBoYXNVbnJlYWQgPSAoY3Vyc29yLnBvc2l0aW9uICE9PSBtZXNzYWdlc1swXS5pbml0aWFsSWQpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE5vIGN1cnNvciA9PiBzZXRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgZmV0Y2hpbmcgbWVzc2FnZXM6ICR7ZXJyfWApO1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gaGFzVW5yZWFkO1xuICB9XG5cblxuICAvLyBHZXQgQ2hhdGtpdCB1c2VyXG4gIGdldFVzZXIodXNlcl9pZCkge1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke2Vudmlyb25tZW50LmFwaVVybH0vY2hhdGtpdC9nZXR1c2VyYCwge3VzZXJfaWR9KVxuICAgIC50b1Byb21pc2UoKVxuICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICByZXR1cm4gcmVzO1xuICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICB9KVxuICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvcikpO1xuICB9XG5cbiAgLy8gR2V0IENoYXRraXQgdXNlcidzIHJvb21zXG4gIGdldFVzZXJSb29tcyh1c2VyX2lkKSB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9jaGF0a2l0L2dldHVzZXJyb29tc2AsIHt1c2VyX2lkfSlcbiAgICAudG9Qcm9taXNlKClcbiAgICAudGhlbihyZXMgPT4ge1xuICAgICAgLy8gdGhpcy5yb29tcyA9IHJlcztcbiAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSk7XG4gIH1cblxuICAvL1xuICAvLyDilIDilIDilIAgU1VCU0NSSUJFIFRPIFJPT00g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBzdWJzY3JpYmVUb1Jvb20ocm9vbUlEKSB7XG4gICAgICB0aGlzLmNoYXRraXRVc2VyLnN1YnNjcmliZVRvUm9vbU11bHRpcGFydCh7XG4gICAgICAgIHJvb21JZDogcm9vbUlELFxuICAgICAgICBob29rczoge1xuICAgICAgICAgIG9uTWVzc2FnZTogbWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAvLyBXaGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC4uLlxuXG4gICAgICAgICAgICAvLyBQdXNoIHRvIG1lc3NhZ2VzIGFycmF5IGFuZCB1cGRhdGUgdmlld1xuICAgICAgICAgICAgdGhpcy5yb29tX21lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgdXNlcnMgbGFzdCBjdXJzb3IgcG9zaXRpb24gZnJvbSB0aGUgcm9vbVxuICAgICAgICAgICAgY29uc3QgY3Vyc29yID0gdGhpcy5jaGF0a2l0VXNlci5yZWFkQ3Vyc29yKHtcbiAgICAgICAgICAgICAgcm9vbUlkOiBtZXNzYWdlLnJvb21JZFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICgoY3Vyc29yLnBvc2l0aW9uICE9PSBtZXNzYWdlLmlkKSAmJiAobWVzc2FnZS5yb29tSWQgIT09IHRoaXMuY3VycmVudF9yb29tLmlkKSkge1xuICAgICAgICAgICAgICAvLyBJZiB0aGUgY3VycmVudCB1c2VyIGhhcyBub3Qgc2VlbiB0aGUgbWVzc2FnZSwgQU5EIHRoZSBtZXNzYWdlIHdhcyByZWNlaXZlZCBpbiBhIGRpZmZlcmVudCByb29tLFxuICAgICAgICAgICAgICAvLyBhZGQgbWFya2VyIHRvIG5vdGlmaWNhdGlvbiBhcnJheVxuICAgICAgICAgICAgICB0aGlzLnJvb21Ob3RpZmljYXRpb25zW21lc3NhZ2Uucm9vbS5pZF0gPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBtZXNzYWdlIHdhcyBzZW50IGluIGN1cnJlbnQgcm9vbSwgc28gYWxsIHdlIG11c3QgZG8gaXMgdXBkYXRlIHRoZVxuICAgICAgICAgICAgICAvLyByZWFkIGN1cnNvciBmb3IgdGhlIGN1cnJlbnQgdXNlcidzIHJvb21cbiAgICAgICAgICAgICAgdGhpcy5jaGF0a2l0VXNlci5zZXRSZWFkQ3Vyc29yKHtcbiAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBtZXNzYWdlLmlkLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ291bnQgcm9vbXMgd2l0aCB1bnJlYWQgbm90aWZ1Y2F0aW9uc1xuICAgICAgICAgICAgbGV0IHJvb21zV2l0aE5vdGlmaWNhdGlvbnMgPSAwO1xuICAgICAgICAgICAgdGhpcy5yb29tTm90aWZpY2F0aW9ucy5mb3JFYWNoKHJvb20gPT4ge1xuICAgICAgICAgICAgICByb29tc1dpdGhOb3RpZmljYXRpb25zICs9IHJvb20gPT09IHRydWUgPyAxIDogMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gQWRkIHRvIGdsb2JhbCBub3RpZmljYXRpb24gY291bnRlclxuICAgICAgICAgICAgdGhpcy5tc2dTZXJ2aWNlLnNldFJvb21zV2l0aE5vdGlmaWNhdGlvbnMocm9vbXNXaXRoTm90aWZpY2F0aW9ucyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbkFkZGVkVG9Sb29tOiByb29tID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBBZGRlZCB0byByb29tICR7cm9vbS5uYW1lfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZUxpbWl0OiAwXG4gICAgICB9KTtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cbiAgLy8gQ3JlYXRlIHJvb21cbiAgY3JlYXRlUm9vbSgpIHtcbiAgICB0aGlzLnJvb21DcmVhdGVkID0gdHJ1ZTsgcmV0dXJuO1xuICAgIC8vIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTsgLy8gRGlzcGxheSBsb2FkaW5nIGljb25cbiAgICBjb25zdCByb29tTmFtZSA9IHRoaXMuZm9ybUltcG9ydC52YWx1ZS5yb29tTmFtZUdyb3VwLnJvb21OYW1lO1xuICAgIGNvbnN0IHByaXZhdGVSb29tID0gdGhpcy5mb3JtSW1wb3J0LnZhbHVlLnByaXZhdGVSb29tR3JvdXAucHJpdmF0ZVJvb207XG4gICAgY29uc3Qgcm9vbUF2YXRhciA9IHRoaXMuZm9ybUltcG9ydC52YWx1ZS5pbXBvcnRGaWxlR3JvdXAuaW1wb3J0RmlsZTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmZvcm1JbXBvcnQudmFsdWUucm9vbU5hbWVHcm91cC5yb29tTmFtZSk7XG4gICAgY29uc29sZS5sb2codGhpcy5mb3JtSW1wb3J0LnZhbHVlLnByaXZhdGVSb29tR3JvdXAucHJpdmF0ZVJvb20pO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuZm9ybUltcG9ydC52YWx1ZS5pbXBvcnRGaWxlR3JvdXAuaW1wb3J0RmlsZSk7XG5cbiAgICBjb25zb2xlLmxvZyh0aGlzLmZpbGVUb1VwbG9hZCk7XG4gICAgY29uc29sZS5sb2codGhpcy5mb3JtSW1wb3J0LnZhbHVlKTtcblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgY29uc3QgYjY0c3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodGhpcy5pbWFnZVBhdGgpO1xuXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgYjY0c3RyaW5nKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ3Rlc3R2YXInLCAnbXkgdGVzdCB2YXIgdmFsdWUnKTtcblxuICAgIGNvbnNvbGUubG9nKGZvcm1EYXRhKTtcblxuICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuICAgIGhlYWRlcnMuYXBwZW5kKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXG4gICAgLy8gQ3JlYXRlIHJvb20gYW5kIGluc2VydCByb29tIGF2YXRhciBpbnRvIGRhdGFiYXNlXG4gICAgdGhpcy5odHRwLnBvc3QoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9hc2RmYCwgZm9ybURhdGEpXG4gICAgLnRvUHJvbWlzZSgpXG4gICAgLnRoZW4ocmVzID0+IHsgLy8gSW1hZ2UgdXBsb2FkZWRcbiAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdJbWFnZSB1cGxvYWRlZCcpO1xuICAgICAgdGhpcy5jaGF0a2l0VXNlci5jcmVhdGVSb29tKHsgLy8gQ3JlYXRlIHRoZSByb29tXG4gICAgICAgIG5hbWU6IHJvb21OYW1lLFxuICAgICAgICBwcml2YXRlOiB0cnVlLFxuICAgICAgICBjdXN0b21EYXRhOiB7IHJvb21BdmF0YXI6IHJlc1snX2lkJ10gfSxcbiAgICAgIH0pLnRoZW4ocm9vbSA9PiB7IC8vIFN1Y2Nlc3NcbiAgICAgICAgLy8gdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yb29tQ3JlYXRlZCA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUubG9nKGBDcmVhdGVkIHJvb20gY2FsbGVkICR7cm9vbS5uYW1lfWApO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnIgPT4geyAvLyBGYWlsZWQgcm9vbSBjcmVhdGlvblxuICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgY3JlYXRpbmcgcm9vbSAke2Vycn1gKTtcbiAgICAgIH0pO1xuICAgIH0pXG4gICAgLmNhdGNoKGVyciA9PiB7IC8vIEZhaWxlZCBpbWFnZSB1cGxvYWRcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB1cGxvYWRpbmcgcm9vbSBpbWFnZScpO1xuICAgIH0pO1xuICB9XG5cblxuICBuZ09uSW5pdCgpIHtcblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY2hhdGtpdFVzZXIpO1xuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY2hhdGtpdFVzZXIucm9vbVN0b3JlLnJvb21zKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnJvb21zKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnJvb21fbWVzc2FnZXMpO1xuICAgIC8vIHRoaXMuY2hhdGtpdFVzZXIucm9vbXM7XG4gICAgY29uc29sZS5sb2coT2JqZWN0LmtleXModGhpcy5yb29tcykpO1xuICAgIC8vIHRoaXMucm9vbXMuZm9yRWFjaCgocm9vbSkgPT4ge1xuICAgIC8vICAgY29uc29sZS5sb2cocm9vbSk7XG4gICAgLy8gfSk7XG5cblxuICAgIGNvbnNvbGUubG9nKHRoaXMucm9vbXMpO1xuXG4gICAgLy8gY29uc29sZS5sb2coJ0Nvbm5lY3RlZCBhcyB1c2VyICcsIHVzZXIpO1xuICAgIC8vIHRoaXMuY2hhdGtpdFVzZXIgPSB1c2VyO1xuICAgIC8vIHRoaXMucm9vbXMgPSB1c2VyLnJvb21zO1xuXG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIHJvb21zIGFuZCBzdWJzY3JpYmUgdG8gZWFjaFxuXG4gICAgLy8gSm9pbiBmaXJzdCByb29tIGluIGFycmF5XG4gICAgLy8gVE9ETzogcmVmYWN0b3IgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG4gICAgLy8gdGhpcy5jaGF0a2l0VXNlci5qb2luUm9vbSh7cm9vbUlkOiB0aGlzLnJvb21zWzBdLmlkfSkudGhlbihyb29tID0+IHtcbiAgICAvLyAgIHRoaXMuY3VycmVudF9yb29tID0gcm9vbTtcblxuXG4gICAgLy8gICAvLyBGZXRjaCBhbGwgbWVzc2FnZXMgZm9yIGpvaW5lZCByb29tXG4gICAgLy8gICB0aGlzLmNoYXRraXRVc2VyLmZldGNoTXVsdGlwYXJ0TWVzc2FnZXMoe1xuICAgIC8vICAgICByb29tSWQ6IHRoaXMucm9vbXNbMF0uaWQsXG4gICAgLy8gICAgIGxpbWl0OiAxMCxcbiAgICAvLyAgIH0pLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgIC8vICAgICBtZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgIC8vICAgICAgIC8vIGNvbnNvbGUubG9nKG1lc3NhZ2UucGFydHNbMF0ucGF5bG9hZC5jb250ZW50KTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICAgIHRoaXMucm9vbV9tZXNzYWdlcyA9IG1lc3NhZ2VzO1xuICAgIC8vICAgfSk7XG4gICAgLy8gfSk7XG5cblxuICAvLyBHZXQgdXNlciBpZCBmcm9tIGxvY2FsIHN0b3JhZ2VcbiAgY29uc3QgdXNlcl9pZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRVc2VyJykpLl9lbWJlZGRlZC51c2VyLmlkO1xuXG4gICAgLy8gU3Vic2NyaWJlIHRvIG5ldyBub3RpZmljYXRpb25zXG4gICAgdGhpcy5tc2dTZXJ2aWNlLm5vdGlmaWNhdGlvbkNvdW50XG4gICAgLnN1YnNjcmliZShub3RpZmljYXRpb24gPT4gdGhpcy5ub3RpZmljYXRpb25Db3VudCA9IG5vdGlmaWNhdGlvbik7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5jaGF0a2l0VXNlcik7XG4gICAgfVxufVxuIl19