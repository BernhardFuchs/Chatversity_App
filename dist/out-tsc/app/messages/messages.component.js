"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var messaging_service_1 = require("../Core/_services/messaging.service");
var forms_1 = require("@angular/forms");
var auth_service_1 = require("../Core/_services/auth.service");
var MessagesComponent = /** @class */ (function () {
    function MessagesComponent(http, msgService, authService) {
        this.http = http;
        this.msgService = msgService;
        this.authService = authService;
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
        this.currentUser.sendMessage({
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
        this.currentUser.joinRoom({ roomId: roomID }).then(function (room) {
            _this.current_room = room;
            // After joining room, fetch messages
            _this.currentUser.fetchMultipartMessages({ roomId: roomID }).then(function (messages) {
                // Check if messages
                if (messages === undefined || messages.length === 0) {
                    return;
                }
                // Set read cursor
                _this.currentUser.setReadCursor({
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
        var cursor = this.currentUser.readCursor({
            roomId: roomID
        });
        // if read cursor ID !== latest message ID...
        this.currentUser.fetchMultipartMessages({
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
        this.currentUser.subscribeToRoomMultipart({
            roomId: roomID,
            hooks: {
                onMessage: function (message) {
                    // When a message is received...
                    // Push to messages array and update view
                    _this.room_messages.push(message);
                    // Get the users last cursor position from the room
                    var cursor = _this.currentUser.readCursor({
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
                        _this.currentUser.setReadCursor({
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
                    // this.msgService.setRoomsWithNotifications(roomsWithNotifications);
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
            _this.currentUser.createRoom({
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
        this.subscription = this.authService.currentUser.subscribe(function (user) {
            _this.currentUser = user;
            _this.rooms = user.rooms;
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9tZXNzYWdlcy9tZXNzYWdlcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBd0U7QUFDeEUsNkNBQStEO0FBQy9ELDhEQUE2RDtBQUM3RCx5RUFBdUU7QUFDdkUsd0NBQW9FO0FBQ3BFLCtEQUE2RDtBQU83RDtJQXFERSwyQkFBb0IsSUFBZ0IsRUFBVSxVQUE0QixFQUFVLFdBQXdCO1FBQXhGLFNBQUksR0FBSixJQUFJLENBQVk7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFrQjtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBN0M1RyxVQUFLLEdBQWUsRUFBRSxDQUFDO1FBRXZCLGtCQUFhLEdBQWUsRUFBRSxDQUFDO1FBSy9CLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFFZCxzQkFBaUIsR0FBZSxFQUFFLENBQUM7UUFZbkMsd0NBQXdDO1FBQ3hDLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBUWxCLGVBQVUsR0FBRyxJQUFJLGlCQUFTLENBQUM7WUFDekIsZUFBZSxFQUFFLElBQUksaUJBQVMsQ0FBQztnQkFDN0IsVUFBVSxFQUFFLElBQUksbUJBQVcsQ0FBQyxFQUFFLENBQUM7YUFDaEMsQ0FBQztZQUNGLGFBQWEsRUFBRSxJQUFJLGlCQUFTLENBQUM7Z0JBQzNCLFFBQVEsRUFBRSxJQUFJLG1CQUFXLENBQUMsRUFBRSxFQUFFO29CQUM1QixrQkFBVSxDQUFDLFFBQVE7b0JBQ25CLGtCQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztpQkFDekIsQ0FBQzthQUNILENBQUM7WUFDRixnQkFBZ0IsRUFBRSxJQUFJLGlCQUFTLENBQUM7Z0JBQzlCLFdBQVcsRUFBRSxJQUFJLG1CQUFXLENBQUMsRUFBRSxDQUFDO2FBQ2pDLENBQUM7U0FDSCxDQUFDLENBQUM7SUFFNEcsQ0FBQztJQS9CaEgsc0JBQUks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QU5ELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUN4RCxVQUFDLElBQUk7WUFDSCxLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDMUIsQ0FBQyxDQUNGLENBQUM7SUFDRixDQUFDO0lBdFJrQjtRQUFwQixnQkFBUyxDQUFDLFFBQVEsQ0FBQztrQ0FBUyxpQkFBVTtxREFBQztJQUQ3QixpQkFBaUI7UUFMN0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxjQUFjO1lBQ3hCLFdBQVcsRUFBRSwyQkFBMkI7WUFDeEMsU0FBUyxFQUFFLENBQUMsMkJBQTJCLENBQUM7U0FDekMsQ0FBQzt5Q0FzRDBCLGlCQUFVLEVBQXNCLG9DQUFnQixFQUF1QiwwQkFBVztPQXJEakcsaUJBQWlCLENBd1I3QjtJQUFELHdCQUFDO0NBQUEsQUF4UkQsSUF3UkM7QUF4UlksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcbmltcG9ydCB7IE1lc3NhZ2luZ1NlcnZpY2UgfSBmcm9tICcuLi9Db3JlL19zZXJ2aWNlcy9tZXNzYWdpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBGb3JtR3JvdXAsIEZvcm1Db250cm9sLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbWVzc2FnZXMnLFxuICB0ZW1wbGF0ZVVybDogJy4vbWVzc2FnZXMuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9tZXNzYWdlcy5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQFZpZXdDaGlsZCgnYXZhdGFyJykgYXZhdGFyOiBFbGVtZW50UmVmO1xuICBmaWxlVG9VcGxvYWQ6IEZpbGU7XG5cbiAgaW1hZ2VQYXRoOiBhbnk7XG5cbiAgbm90aWZpY2F0aW9uQ291bnQ6IGFueTtcblxuICByb29tczogQXJyYXk8YW55PiA9IFtdO1xuICB1c2VyX2lkOiBhbnk7XG4gIHJvb21fbWVzc2FnZXM6IEFycmF5PGFueT4gPSBbXTtcbiAgLy8gcm9vbV9tZXNzYWdlczogT2JzZXJ2YWJsZTxhbnlbXT47XG4gIGN1cnJlbnRfcm9vbTogYW55O1xuICBjaGF0VXNlcjogYW55O1xuXG4gIF9tZXNzYWdlID0gJyc7XG4gIHJvb21DcmVhdGVkOiBib29sZWFuO1xuICByb29tTm90aWZpY2F0aW9uczogQXJyYXk8YW55PiA9IFtdO1xuICBjdXJyZW50VXNlcjogYW55O1xuICBzdWJzY3JpcHRpb246IGFueTtcbiAgaW5jb21pbmdNZXNzYWdlczogYW55O1xuXG4gIGdldCBtZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX21lc3NhZ2U7XG4gIH1cbiAgc2V0IG1lc3NhZ2UodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX21lc3NhZ2UgPSB2YWx1ZTtcbiAgfVxuXG4gIC8vIFRPRE86IENhbiBwcm9iYWJseSByZW1vdmUgdGhlc2UgcHJvcHNcbiAgX3Jvb21Qcml2YXRlID0gJyc7XG4gIGdldCByb29tUHJpdmF0ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9yb29tUHJpdmF0ZTtcbiAgfVxuICBzZXQgcm9vbVByaXZhdGUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3Jvb21Qcml2YXRlID0gdmFsdWU7XG4gIH1cblxuICBmb3JtSW1wb3J0ID0gbmV3IEZvcm1Hcm91cCh7XG4gICAgaW1wb3J0RmlsZUdyb3VwOiBuZXcgRm9ybUdyb3VwKHtcbiAgICAgIGltcG9ydEZpbGU6IG5ldyBGb3JtQ29udHJvbCgnJyksXG4gICAgfSksXG4gICAgcm9vbU5hbWVHcm91cDogbmV3IEZvcm1Hcm91cCh7XG4gICAgICByb29tTmFtZTogbmV3IEZvcm1Db250cm9sKCcnLCBbXG4gICAgICAgIFZhbGlkYXRvcnMucmVxdWlyZWQsXG4gICAgICAgIFZhbGlkYXRvcnMubWF4TGVuZ3RoKDYwKVxuICAgICAgXSlcbiAgICB9KSxcbiAgICBwcml2YXRlUm9vbUdyb3VwOiBuZXcgRm9ybUdyb3VwKHtcbiAgICAgIHByaXZhdGVSb29tOiBuZXcgRm9ybUNvbnRyb2woJycpXG4gICAgfSlcbiAgfSk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIG1zZ1NlcnZpY2U6IE1lc3NhZ2luZ1NlcnZpY2UsIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlKSB7fVxuXG4gIHVybDogc3RyaW5nO1xuICBvbkZpbGVDaGFuZ2UoZXZlbnQpIHtcbiAgICBpZiAoIShldmVudC50YXJnZXQuZmlsZXMgJiYgZXZlbnQudGFyZ2V0LmZpbGVzWzBdKSkgeyByZXR1cm47IH1cbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzWzBdO1xuICAgIHRoaXMuZmlsZVRvVXBsb2FkID0gZmlsZTtcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpOyAvLyByZWFkIGZpbGUgYXMgZGF0YSB1cmxcbiAgICByZWFkZXIub25sb2FkID0gKF9ldmVudCkgPT4ge1xuICAgICAgY29uc29sZS5sb2cocmVhZGVyLnJlc3VsdCk7IC8vIGxvZyBiYXNlNjQgc3RyaW5nXG4gICAgICB0aGlzLmltYWdlUGF0aCA9IHJlYWRlci5yZXN1bHQ7XG4gICAgfTtcbiAgfVxuXG5cbiAgLy8gU2VuZCBhIG1lc3NhZ2VcbiAgc2VuZE1lc3NhZ2UoKSB7XG4gICAgY29uc3QgeyBtZXNzYWdlLCBjdXJyZW50VXNlciB9ID0gdGhpcztcbiAgICB0aGlzLmN1cnJlbnRVc2VyLnNlbmRNZXNzYWdlKHtcbiAgICAgIHRleHQ6IG1lc3NhZ2UsXG4gICAgICByb29tSWQ6IHRoaXMuY3VycmVudF9yb29tLmlkLFxuICAgIH0pLnRoZW4ocmVzID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgfSk7XG4gICAgdGhpcy5tZXNzYWdlID0gJyc7XG4gIH1cblxuXG4gIC8vIEpvaW4gYSByb29tXG4gIGpvaW5Sb29tKHJvb21JRCkge1xuICAgIHRoaXMuY3VycmVudFVzZXIuam9pblJvb20oe3Jvb21JZDogcm9vbUlEfSkudGhlbihyb29tID0+IHtcbiAgICAgIHRoaXMuY3VycmVudF9yb29tID0gcm9vbTtcblxuICAgICAgLy8gQWZ0ZXIgam9pbmluZyByb29tLCBmZXRjaCBtZXNzYWdlc1xuICAgICAgdGhpcy5jdXJyZW50VXNlci5mZXRjaE11bHRpcGFydE1lc3NhZ2VzKHtyb29tSWQ6IHJvb21JRH0pLnRoZW4obWVzc2FnZXMgPT4ge1xuXG4gICAgICAgIC8vIENoZWNrIGlmIG1lc3NhZ2VzXG4gICAgICAgIGlmIChtZXNzYWdlcyA9PT0gdW5kZWZpbmVkIHx8IG1lc3NhZ2VzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cblxuICAgICAgICAvLyBTZXQgcmVhZCBjdXJzb3JcbiAgICAgICAgdGhpcy5jdXJyZW50VXNlci5zZXRSZWFkQ3Vyc29yKHtcbiAgICAgICAgICByb29tSWQ6IHRoaXMuY3VycmVudF9yb29tLmlkLFxuICAgICAgICAgIHBvc2l0aW9uOiBtZXNzYWdlc1ttZXNzYWdlcy5sZW5ndGggLSAxXS5pZFxuICAgICAgICB9KVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yb29tTm90aWZpY2F0aW9uc1tyb29tLmlkXSA9IGZhbHNlO1xuICAgICAgICB9KTsgLy8gUmVtb3ZlIG1hcmtlciBmcm9tIG5vdGlmaWNhdGlvbnMgYXJyYXlcbiAgICAgICAgLy8gLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ1NldCBjdXJzb3InKTtcbiAgICAgICAgLy8gICB9KVxuICAgICAgICAvLyAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coYEVycm9yIHNldHRpbmcgY3Vyc29yOiAke2Vycn1gKTtcbiAgICAgICAgLy8gICB9KTtcbiAgICAgICAgbWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtZXNzYWdlLnBhcnRzWzBdLnBheWxvYWQuY29udGVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJvb21fbWVzc2FnZXMgPSBtZXNzYWdlcztcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIC8vIGVuZCBKb2luIHJvb21cblxuXG4gIC8vIEZ1bmN0aW9uID0+IGNoZWNrIGlmIHVzZXIgaGFzIHVucmVhZCBtZXNzYWdlcyBpbiBhIHJvb21cbiAgaGFzVW5yZWFkKHJvb21JRCkge1xuXG4gICAgbGV0IGhhc1VucmVhZCA9IGZhbHNlOyAvLyBUcmFjayByZXR1cm4gc3RhdHVzXG5cbiAgICAvLyBGaXJzdCwgY2hlY2sgaWYgY3Vyc29yIGV4aXN0c1xuICAgIGNvbnN0IGN1cnNvciA9IHRoaXMuY3VycmVudFVzZXIucmVhZEN1cnNvcih7XG4gICAgICByb29tSWQ6IHJvb21JRFxuICAgIH0pO1xuXG4gICAgICAvLyBpZiByZWFkIGN1cnNvciBJRCAhPT0gbGF0ZXN0IG1lc3NhZ2UgSUQuLi5cbiAgICAgIHRoaXMuY3VycmVudFVzZXIuZmV0Y2hNdWx0aXBhcnRNZXNzYWdlcyh7IC8vIEdldCBsYXRlc3QgbWVzc2FnZVxuICAgICAgICByb29tSWQ6IHJvb21JRCxcbiAgICAgICAgbGltaXQ6IDEsXG4gICAgICB9KVxuICAgICAgLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgICAgICBpZiAoY3Vyc29yKSB7IC8vIEhhcyBjdXJzb3Igc28gY2hlY2sgY3Vyc29yIHBvcyB2cyBsYXRlc3QgbWVzc2FnZSBpZFxuICAgICAgICAgIGhhc1VucmVhZCA9IChjdXJzb3IucG9zaXRpb24gIT09IG1lc3NhZ2VzWzBdLmluaXRpYWxJZCkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTm8gY3Vyc29yID0+IHNldFxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBmZXRjaGluZyBtZXNzYWdlczogJHtlcnJ9YCk7XG4gICAgICB9KTtcblxuICAgIHJldHVybiBoYXNVbnJlYWQ7XG4gIH1cblxuXG4gIC8vIEdldCBDaGF0a2l0IHVzZXJcbiAgZ2V0VXNlcih1c2VyX2lkKSB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9jaGF0a2l0L2dldHVzZXJgLCB7dXNlcl9pZH0pXG4gICAgLnRvUHJvbWlzZSgpXG4gICAgLnRoZW4ocmVzID0+IHtcbiAgICAgIHJldHVybiByZXM7XG4gICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSk7XG4gIH1cblxuICAvLyBHZXQgQ2hhdGtpdCB1c2VyJ3Mgcm9vbXNcbiAgZ2V0VXNlclJvb21zKHVzZXJfaWQpIHtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2NoYXRraXQvZ2V0dXNlcnJvb21zYCwge3VzZXJfaWR9KVxuICAgIC50b1Byb21pc2UoKVxuICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAvLyB0aGlzLnJvb21zID0gcmVzO1xuICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpKTtcbiAgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBTVUJTQ1JJQkUgVE8gUk9PTSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIHN1YnNjcmliZVRvUm9vbShyb29tSUQpIHtcbiAgICAgIHRoaXMuY3VycmVudFVzZXIuc3Vic2NyaWJlVG9Sb29tTXVsdGlwYXJ0KHtcbiAgICAgICAgcm9vbUlkOiByb29tSUQsXG4gICAgICAgIGhvb2tzOiB7XG4gICAgICAgICAgb25NZXNzYWdlOiBtZXNzYWdlID0+IHtcbiAgICAgICAgICAgIC8vIFdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLi4uXG5cbiAgICAgICAgICAgIC8vIFB1c2ggdG8gbWVzc2FnZXMgYXJyYXkgYW5kIHVwZGF0ZSB2aWV3XG4gICAgICAgICAgICB0aGlzLnJvb21fbWVzc2FnZXMucHVzaChtZXNzYWdlKTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSB1c2VycyBsYXN0IGN1cnNvciBwb3NpdGlvbiBmcm9tIHRoZSByb29tXG4gICAgICAgICAgICBjb25zdCBjdXJzb3IgPSB0aGlzLmN1cnJlbnRVc2VyLnJlYWRDdXJzb3Ioe1xuICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKChjdXJzb3IucG9zaXRpb24gIT09IG1lc3NhZ2UuaWQpICYmIChtZXNzYWdlLnJvb21JZCAhPT0gdGhpcy5jdXJyZW50X3Jvb20uaWQpKSB7XG4gICAgICAgICAgICAgIC8vIElmIHRoZSBjdXJyZW50IHVzZXIgaGFzIG5vdCBzZWVuIHRoZSBtZXNzYWdlLCBBTkQgdGhlIG1lc3NhZ2Ugd2FzIHJlY2VpdmVkIGluIGEgZGlmZmVyZW50IHJvb20sXG4gICAgICAgICAgICAgIC8vIGFkZCBtYXJrZXIgdG8gbm90aWZpY2F0aW9uIGFycmF5XG4gICAgICAgICAgICAgIHRoaXMucm9vbU5vdGlmaWNhdGlvbnNbbWVzc2FnZS5yb29tLmlkXSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIG1lc3NhZ2Ugd2FzIHNlbnQgaW4gY3VycmVudCByb29tLCBzbyBhbGwgd2UgbXVzdCBkbyBpcyB1cGRhdGUgdGhlXG4gICAgICAgICAgICAgIC8vIHJlYWQgY3Vyc29yIGZvciB0aGUgY3VycmVudCB1c2VyJ3Mgcm9vbVxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRVc2VyLnNldFJlYWRDdXJzb3Ioe1xuICAgICAgICAgICAgICAgIHJvb21JZDogbWVzc2FnZS5yb29tSWQsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IG1lc3NhZ2UuaWQsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDb3VudCByb29tcyB3aXRoIHVucmVhZCBub3RpZnVjYXRpb25zXG4gICAgICAgICAgICBsZXQgcm9vbXNXaXRoTm90aWZpY2F0aW9ucyA9IDA7XG4gICAgICAgICAgICB0aGlzLnJvb21Ob3RpZmljYXRpb25zLmZvckVhY2gocm9vbSA9PiB7XG4gICAgICAgICAgICAgIHJvb21zV2l0aE5vdGlmaWNhdGlvbnMgKz0gcm9vbSA9PT0gdHJ1ZSA/IDEgOiAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBBZGQgdG8gZ2xvYmFsIG5vdGlmaWNhdGlvbiBjb3VudGVyXG4gICAgICAgICAgICAvLyB0aGlzLm1zZ1NlcnZpY2Uuc2V0Um9vbXNXaXRoTm90aWZpY2F0aW9ucyhyb29tc1dpdGhOb3RpZmljYXRpb25zKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uQWRkZWRUb1Jvb206IHJvb20gPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEFkZGVkIHRvIHJvb20gJHtyb29tLm5hbWV9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlTGltaXQ6IDBcbiAgICAgIH0pO1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuICAvLyBDcmVhdGUgcm9vbVxuICBjcmVhdGVSb29tKCkge1xuICAgIHRoaXMucm9vbUNyZWF0ZWQgPSB0cnVlOyByZXR1cm47XG4gICAgLy8gdGhpcy5pc0xvYWRpbmcgPSB0cnVlOyAvLyBEaXNwbGF5IGxvYWRpbmcgaWNvblxuICAgIGNvbnN0IHJvb21OYW1lID0gdGhpcy5mb3JtSW1wb3J0LnZhbHVlLnJvb21OYW1lR3JvdXAucm9vbU5hbWU7XG4gICAgY29uc3QgcHJpdmF0ZVJvb20gPSB0aGlzLmZvcm1JbXBvcnQudmFsdWUucHJpdmF0ZVJvb21Hcm91cC5wcml2YXRlUm9vbTtcbiAgICBjb25zdCByb29tQXZhdGFyID0gdGhpcy5mb3JtSW1wb3J0LnZhbHVlLmltcG9ydEZpbGVHcm91cC5pbXBvcnRGaWxlO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuZm9ybUltcG9ydC52YWx1ZS5yb29tTmFtZUdyb3VwLnJvb21OYW1lKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmZvcm1JbXBvcnQudmFsdWUucHJpdmF0ZVJvb21Hcm91cC5wcml2YXRlUm9vbSk7XG4gICAgY29uc29sZS5sb2codGhpcy5mb3JtSW1wb3J0LnZhbHVlLmltcG9ydEZpbGVHcm91cC5pbXBvcnRGaWxlKTtcblxuICAgIGNvbnNvbGUubG9nKHRoaXMuZmlsZVRvVXBsb2FkKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmZvcm1JbXBvcnQudmFsdWUpO1xuXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBjb25zdCBiNjRzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmltYWdlUGF0aCk7XG5cbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBiNjRzdHJpbmcpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgndGVzdHZhcicsICdteSB0ZXN0IHZhciB2YWx1ZScpO1xuXG4gICAgY29uc29sZS5sb2coZm9ybURhdGEpO1xuXG4gICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xuICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG4gICAgaGVhZGVycy5hcHBlbmQoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5cbiAgICAvLyBDcmVhdGUgcm9vbSBhbmQgaW5zZXJ0IHJvb20gYXZhdGFyIGludG8gZGF0YWJhc2VcbiAgICB0aGlzLmh0dHAucG9zdChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2FzZGZgLCBmb3JtRGF0YSlcbiAgICAudG9Qcm9taXNlKClcbiAgICAudGhlbihyZXMgPT4geyAvLyBJbWFnZSB1cGxvYWRlZFxuICAgICAgY29uc29sZS5sb2cocmVzKTtcblxuICAgICAgY29uc29sZS5sb2coJ0ltYWdlIHVwbG9hZGVkJyk7XG4gICAgICB0aGlzLmN1cnJlbnRVc2VyLmNyZWF0ZVJvb20oeyAvLyBDcmVhdGUgdGhlIHJvb21cbiAgICAgICAgbmFtZTogcm9vbU5hbWUsXG4gICAgICAgIHByaXZhdGU6IHRydWUsXG4gICAgICAgIGN1c3RvbURhdGE6IHsgcm9vbUF2YXRhcjogcmVzWydfaWQnXSB9LFxuICAgICAgfSkudGhlbihyb29tID0+IHsgLy8gU3VjY2Vzc1xuICAgICAgICAvLyB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJvb21DcmVhdGVkID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5sb2coYENyZWF0ZWQgcm9vbSBjYWxsZWQgJHtyb29tLm5hbWV9YCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVyciA9PiB7IC8vIEZhaWxlZCByb29tIGNyZWF0aW9uXG4gICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBjcmVhdGluZyByb29tICR7ZXJyfWApO1xuICAgICAgfSk7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyID0+IHsgLy8gRmFpbGVkIGltYWdlIHVwbG9hZFxuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHVwbG9hZGluZyByb29tIGltYWdlJyk7XG4gICAgfSk7XG4gIH1cblxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5hdXRoU2VydmljZS5jdXJyZW50VXNlci5zdWJzY3JpYmUoXG4gICAgICAodXNlcikgPT4ge1xuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICAgICAgdGhpcy5yb29tcyA9IHVzZXIucm9vbXM7XG4gICAgICB9XG4gICAgKTtcbiAgICB9XG59XG4iXX0=