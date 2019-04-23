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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC9hcHAvcm9vbXMvcm9vbXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtJO0FBQ2xJLDZDQUFrRDtBQUNsRCw4REFBNkQ7QUFDN0QseUVBQXVFO0FBQ3ZFLHdDQUFvRTtBQUVwRSwrREFBNkQ7QUFPN0Q7SUF1REUsRUFBRTtJQUNGLG1GQUFtRjtJQUNuRixFQUFFO0lBQ0Esd0JBQW9CLElBQWdCLEVBQVUsVUFBNEIsRUFBVSxLQUFrQjtRQUF0RyxpQkF5QkM7UUF6Qm1CLFNBQUksR0FBSixJQUFJLENBQVk7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFrQjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQWE7UUFoRHhHLGlCQUFZLEdBQVMsSUFBSSxDQUFDO1FBQzFCLE9BQUUsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQ3BCLFVBQUssR0FBZSxFQUFFLENBQUM7UUFHdkIsa0JBQWEsR0FBZSxFQUFFLENBQUM7UUFJL0Isc0JBQWlCLEdBQWUsRUFBRSxDQUFDO1FBR25DLHdDQUF3QztRQUN4QyxpQkFBWSxHQUFHLEVBQUUsQ0FBQztRQVNsQixhQUFRLEdBQUcsRUFBRSxDQUFDO1FBUWQsZUFBVSxHQUFHLElBQUksaUJBQVMsQ0FBQztZQUN6QixtQkFBbUIsRUFBRSxJQUFJLGlCQUFTLENBQUM7Z0JBQ2pDLE1BQU0sRUFBRSxJQUFJLG1CQUFXLENBQUMsRUFBRSxDQUFDO2FBQzVCLENBQUM7WUFDRixhQUFhLEVBQUUsSUFBSSxpQkFBUyxDQUFDO2dCQUMzQixRQUFRLEVBQUUsSUFBSSxtQkFBVyxDQUFDLEVBQUUsRUFBRTtvQkFDNUIsa0JBQVUsQ0FBQyxRQUFRO29CQUNuQixrQkFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7aUJBQ3pCLENBQUM7YUFDSCxDQUFDO1lBQ0YsZ0JBQWdCLEVBQUUsSUFBSSxpQkFBUyxDQUFDO2dCQUM5QixXQUFXLEVBQUUsSUFBSSxtQkFBVyxDQUFDLEVBQUUsQ0FBQzthQUNqQyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBT0MsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQ25ELFVBQUMsSUFBSTtZQUNILElBQUksSUFBSSxFQUFFO2dCQUNSLEtBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixpQ0FBaUM7Z0JBQ2pDLEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDeEIsMkJBQTJCO2FBQzVCO1FBQ0gsQ0FBQyxDQUNGLENBQUM7UUFFRixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUNwRCxVQUFDLGVBQWU7WUFDZCxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQ0YsQ0FBQztRQUVGLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUNuRCxVQUFDLFdBQVc7WUFDVixLQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztZQUNoQyw0QkFBNEI7UUFDOUIsQ0FBQyxDQUNGLENBQUM7SUFDSixDQUFDO0lBMURILHNCQUFJLHVDQUFXO2FBQWY7WUFDRSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDM0IsQ0FBQzthQUNELFVBQWdCLEtBQWE7WUFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDNUIsQ0FBQzs7O09BSEE7SUFNRCxzQkFBSSxtQ0FBTzthQUFYO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7YUFDRCxVQUFZLEtBQWE7WUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDeEIsQ0FBQzs7O09BSEE7SUFpREQsbUZBQW1GO0lBRW5GLHFDQUFZLEdBQVosVUFBYSxLQUFLO1FBRWhCLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFFL0QsSUFBSSxDQUFDLFlBQVksR0FBUyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BFLDRCQUE0QjtRQUM1QixtQ0FBbUM7UUFDbkMsdURBQXVEO1FBQ3ZELGdDQUFnQztRQUNoQyxxREFBcUQ7UUFDckQsb0NBQW9DO1FBQ3BDLEtBQUs7SUFDUCxDQUFDO0lBRUQsRUFBRTtJQUNGLG1GQUFtRjtJQUNuRixFQUFFO0lBRUYsOENBQXFCLEdBQXJCLFVBQXNCLElBQVM7UUFDN0IsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBQ0QsbUZBQW1GO0lBR25GLEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUNBLG9DQUFXLEdBQVg7UUFDUSxJQUFBLFNBQStCLEVBQTdCLG9CQUFPLEVBQUUsNEJBQW9CLENBQUM7UUFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUM7WUFDM0IsSUFBSSxFQUFFLE9BQU87WUFDYixNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFO1NBQzdCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxHQUFHO1lBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFDSCxvRUFBb0U7SUFFcEUsY0FBYztJQUNkLGlDQUFRLEdBQVIsVUFBUyxNQUFNO1FBQWYsaUJBZ0NDO1FBL0JDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtZQUNuRCxLQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUUvQixxQ0FBcUM7WUFDckMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7Z0JBRXJFLG9CQUFvQjtnQkFDcEIsSUFBSSxRQUFRLEtBQUssU0FBUyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO29CQUFFLE9BQU87aUJBQUU7Z0JBRWhFLGtCQUFrQjtnQkFDbEIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7b0JBQzdCLE1BQU0sRUFBRSxLQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7b0JBQzVCLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lCQUMzQyxDQUFDO3FCQUNELElBQUksQ0FBQztvQkFDSixLQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDMUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx5Q0FBeUM7Z0JBQzdDLGdCQUFnQjtnQkFDaEIsaUNBQWlDO2dCQUNqQyxPQUFPO2dCQUNQLG9CQUFvQjtnQkFDcEIsbURBQW1EO2dCQUNuRCxRQUFRO2dCQUNSLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO29CQUN0QixpREFBaUQ7b0JBQ2pELHdCQUF3QjtnQkFDMUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsS0FBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUM7WUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCxnQkFBZ0I7SUFFaEIsMERBQTBEO0lBQzFELGtDQUFTLEdBQVQsVUFBVSxNQUFNO1FBRWQsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsc0JBQXNCO1FBRTdDLGdDQUFnQztRQUNoQyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQztZQUN6QyxNQUFNLEVBQUUsTUFBTTtTQUNmLENBQUMsQ0FBQztRQUVILDZDQUE2QztRQUM3QyxJQUFJLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDO1lBQ3RDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsS0FBSyxFQUFFLENBQUM7U0FDVCxDQUFDO2FBQ0QsSUFBSSxDQUFDLFVBQUEsUUFBUTtZQUNaLElBQUksTUFBTSxFQUFFLEVBQUUsc0RBQXNEO2dCQUNsRSxTQUFTLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7YUFDeEU7aUJBQU07Z0JBQ0wsbUJBQW1CO2FBQ3BCO1FBQ0gsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLFVBQUEsR0FBRztZQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQTRCLEdBQUssQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUlELEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUVBLGdDQUFPLEdBQVAsVUFBUSxPQUFPO1FBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBUyx5QkFBVyxDQUFDLE1BQU0scUJBQWtCLEVBQUUsRUFBQyxPQUFPLFNBQUEsRUFBQyxDQUFDO2FBQzdFLFNBQVMsRUFBRTthQUNYLElBQUksQ0FBQyxVQUFBLEdBQUc7WUFDUCxPQUFPLEdBQUcsQ0FBQztZQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFDSCxvRUFBb0U7SUFJcEUsRUFBRTtJQUNGLG1GQUFtRjtJQUNuRixFQUFFO0lBRUEscUNBQVksR0FBWixVQUFhLE9BQU87UUFDbEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBUyx5QkFBVyxDQUFDLE1BQU0sMEJBQXVCLEVBQUUsRUFBQyxPQUFPLFNBQUEsRUFBQyxDQUFDO2FBQ2xGLFNBQVMsRUFBRTthQUNYLElBQUksQ0FBQyxVQUFBLEdBQUc7WUFDUCxvQkFBb0I7WUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQWxCLENBQWtCLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0gsb0VBQW9FO0lBSXBFLEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUVBLHdDQUFlLEdBQWYsVUFBZ0IsTUFBTTtRQUF0QixpQkE2Q0M7UUE1Q0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQztZQUN4QyxNQUFNLEVBQUUsTUFBTTtZQUNkLEtBQUssRUFBRTtnQkFDTCxTQUFTLEVBQUUsVUFBQSxPQUFPO29CQUNoQixnQ0FBZ0M7b0JBRWhDLHlDQUF5QztvQkFDekMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2pDLDhDQUE4QztvQkFDOUMscURBQXFEO29CQUNyRCw4Q0FBOEM7b0JBRTlDLG1EQUFtRDtvQkFDbkQsSUFBTSxNQUFNLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7d0JBQ3pDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtxQkFDdkIsQ0FBQyxDQUFDO29CQUVILElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssS0FBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBRTt3QkFDakYsa0dBQWtHO3dCQUNsRyxtQ0FBbUM7d0JBQ25DLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztxQkFDaEQ7eUJBQU07d0JBQ0wsK0VBQStFO3dCQUMvRSwwQ0FBMEM7d0JBQzFDLEtBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDOzRCQUM3QixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07NEJBQ3RCLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRTt5QkFDckIsQ0FBQyxDQUFDO3FCQUNKO29CQUVELHdDQUF3QztvQkFDeEMsSUFBSSxzQkFBc0IsR0FBRyxDQUFDLENBQUM7b0JBQy9CLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO3dCQUNqQyxzQkFBc0IsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEQsQ0FBQyxDQUFDLENBQUM7b0JBQ0gscUNBQXFDO29CQUNyQyxLQUFJLENBQUMsVUFBVSxDQUFDLHlCQUF5QixDQUFDLHNCQUFzQixDQUFDLENBQUM7Z0JBQ3BFLENBQUM7Z0JBQ0QsYUFBYSxFQUFFLFVBQUEsSUFBSTtvQkFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBaUIsSUFBSSxDQUFDLElBQU0sQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO2FBQ0Y7WUFDRCxZQUFZLEVBQUUsQ0FBQztTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsb0VBQW9FO0lBSXBFLEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUVBLG1DQUFVLEdBQVY7UUFBQSxpQkEyQkM7UUF6QkMsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztRQUM5RCxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFFcEIsbUNBQW1DO1FBQ25DLGVBQWU7UUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBSSx5QkFBVyxDQUFDLE1BQU0sa0JBQWUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDO2FBQzVELFNBQVMsRUFBRTthQUNYLElBQUksQ0FBRSxVQUFBLE1BQU07WUFDWCxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBYTtZQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hCLGtCQUFrQjtZQUNsQixLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQztnQkFDMUIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsVUFBVSxFQUFFLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRTthQUN2QyxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQUEsSUFBSTtnQkFDVCxLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLCtCQUErQjtnQkFDdEQsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Z0JBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXVCLElBQUksQ0FBQyxJQUFNLENBQUMsQ0FBQztZQUNsRCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLFVBQUEsR0FBRztnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF1QixHQUFLLENBQUMsQ0FBQztZQUM1QyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILG1GQUFtRjtJQUduRixpQ0FBUSxHQUFSO1FBQUEsaUJBT0M7UUFOQyxpQ0FBaUM7UUFDakMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUI7YUFDaEMsU0FBUyxDQUFDLFVBQUEsWUFBWSxJQUFJLE9BQUEsS0FBSSxDQUFDLGlCQUFpQixHQUFHLFlBQVksRUFBckMsQ0FBcUMsQ0FBQyxDQUFDO1FBRWxFLGlDQUFpQztRQUNqQyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNwRixDQUFDO0lBRUQsd0NBQWUsR0FBZjtRQUNFLHdDQUF3QztRQUN4Qyw4QkFBOEI7UUFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2dCQUM3RCxxQkFBcUI7Z0JBQ3JCLG1DQUFtQztnQkFDbkMsZ0RBQWdEO2dCQUVoRCxpRkFBaUY7Z0JBQ2pGLDJFQUEyRTtnQkFFM0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQztnQkFDekYsK0RBQStEO2dCQUMvRCx3REFBd0Q7Z0JBQ3hELG9DQUFvQztZQUN0QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0QsbUNBQW1DO0lBQ3JDLENBQUM7SUF0VnlCO1FBQXpCLG1CQUFZLENBQUMsVUFBVSxDQUFDO2tDQUFXLGdCQUFTO29EQUFtQjtJQUZyRCxjQUFjO1FBTDFCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsV0FBVztZQUNyQixXQUFXLEVBQUUsd0JBQXdCO1lBQ3JDLFNBQVMsRUFBRSxDQUFDLHdCQUF3QixDQUFDO1NBQ3RDLENBQUM7eUNBMkQ0QixpQkFBVSxFQUFzQixvQ0FBZ0IsRUFBaUIsMEJBQVc7T0ExRDdGLGNBQWMsQ0F5VjFCO0lBQUQscUJBQUM7Q0FBQSxBQXpWRCxJQXlWQztBQXpWWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBFbGVtZW50UmVmLCBWaWV3Q2hpbGQsIEFmdGVyVmlld0luaXQsIFZpZXdDaGlsZHJlbiwgUXVlcnlMaXN0LCBWaWV3Q29udGFpbmVyUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uLy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBNZXNzYWdpbmdTZXJ2aWNlIH0gZnJvbSAnLi4vQ29yZS9fc2VydmljZXMvbWVzc2FnaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgRm9ybUdyb3VwLCBGb3JtQ29udHJvbCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gJy4uL2FwcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtcm9vbXMnLFxuICB0ZW1wbGF0ZVVybDogJy4vcm9vbXMuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9yb29tcy5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIFJvb21zQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcblxuICBAVmlld0NoaWxkcmVuKCdjaGF0UmVlbCcpIGNoYXRSZWVsOiBRdWVyeUxpc3Q8Vmlld0NvbnRhaW5lclJlZj47XG4gIGN1cnJVc2VyOiBhbnk7XG4gIHN1YnNjcmlwdGlvbjogYW55O1xuICBpbmNvbWluZ01lc3NhZ2VzOiBhbnk7XG4gIGNoYXRraXRVc2VyOiBhbnk7XG4gIGZpbGVUb1VwbG9hZDogRmlsZTtcbiAgaW1hZ2VQYXRoOiBhbnk7XG4gIG5vdGlmaWNhdGlvbkNvdW50OiBhbnk7XG4gIHNlbGVjdGVkRmlsZTogRmlsZSA9IG51bGw7XG4gIGZkID0gbmV3IEZvcm1EYXRhKCk7XG4gIHJvb21zOiBBcnJheTxhbnk+ID0gW107XG4gIGN1cnJlbnRVc2VyOiBhbnk7XG4gIHVzZXJfaWQ6IGFueTtcbiAgcm9vbV9tZXNzYWdlczogQXJyYXk8YW55PiA9IFtdO1xuICBjdXJyZW50X3Jvb206IGFueTtcbiAgY2hhdFVzZXI6IGFueTtcbiAgcm9vbUNyZWF0ZWQ6IGJvb2xlYW47XG4gIHJvb21Ob3RpZmljYXRpb25zOiBBcnJheTxhbnk+ID0gW107XG4gIHVybDogc3RyaW5nO1xuXG4gIC8vIFRPRE86IENhbiBwcm9iYWJseSByZW1vdmUgdGhlc2UgcHJvcHNcbiAgX3Jvb21Qcml2YXRlID0gJyc7XG4gIHNlbGVjdGVkUm9vbU1lbWJlcjogYW55O1xuICBnZXQgcm9vbVByaXZhdGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcm9vbVByaXZhdGU7XG4gIH1cbiAgc2V0IHJvb21Qcml2YXRlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9yb29tUHJpdmF0ZSA9IHZhbHVlO1xuICB9XG5cbiAgX21lc3NhZ2UgPSAnJztcbiAgZ2V0IG1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZTtcbiAgfVxuICBzZXQgbWVzc2FnZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fbWVzc2FnZSA9IHZhbHVlO1xuICB9XG5cbiAgZm9ybUltcG9ydCA9IG5ldyBGb3JtR3JvdXAoe1xuICAgIHVzZXJBdmF0YXJGaWxlR3JvdXA6IG5ldyBGb3JtR3JvdXAoe1xuICAgICAgYXZhdGFyOiBuZXcgRm9ybUNvbnRyb2woJycpLFxuICAgIH0pLFxuICAgIHJvb21OYW1lR3JvdXA6IG5ldyBGb3JtR3JvdXAoe1xuICAgICAgcm9vbU5hbWU6IG5ldyBGb3JtQ29udHJvbCgnJywgW1xuICAgICAgICBWYWxpZGF0b3JzLnJlcXVpcmVkLFxuICAgICAgICBWYWxpZGF0b3JzLm1heExlbmd0aCg2MClcbiAgICAgIF0pXG4gICAgfSksXG4gICAgcHJpdmF0ZVJvb21Hcm91cDogbmV3IEZvcm1Hcm91cCh7XG4gICAgICBwcml2YXRlUm9vbTogbmV3IEZvcm1Db250cm9sKCcnKVxuICAgIH0pXG4gIH0pO1xuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBDT05TVFJVQ1RPUiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgbXNnU2VydmljZTogTWVzc2FnaW5nU2VydmljZSwgcHJpdmF0ZSBfYXV0aDogQXV0aFNlcnZpY2UpIHtcblxuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLl9hdXRoLmNoYXRraXRVc2VyJC5zdWJzY3JpYmUoXG4gICAgICAgICh1c2VyKSA9PiB7XG4gICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhdGtpdFVzZXIgPSB1c2VyO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5jaGF0a2l0VXNlcik7XG4gICAgICAgICAgICB0aGlzLnJvb21zID0gdXNlci5yb29tcztcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucm9vbXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgdGhpcy5pbmNvbWluZ01lc3NhZ2VzID0gdGhpcy5fYXV0aC5tZXNzYWdlcyQuc3Vic2NyaWJlKFxuICAgICAgICAoaW5jb21pbmdNZXNzYWdlKSA9PiB7XG4gICAgICAgICAgdGhpcy5yb29tX21lc3NhZ2VzLnB1c2goaW5jb21pbmdNZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgdGhpcy5jdXJyZW50X3Jvb20gPSB0aGlzLl9hdXRoLmN1cnJlbnRSb29tJC5zdWJzY3JpYmUoXG4gICAgICAgIChjdXJyZW50Um9vbSkgPT4ge1xuICAgICAgICAgIHRoaXMuY3VycmVudF9yb29tID0gY3VycmVudFJvb207XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coY3VycmVudFJvb20pO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbiAgb25GaWxlQ2hhbmdlKGV2ZW50KSB7XG5cbiAgICBpZiAoIShldmVudC50YXJnZXQuZmlsZXMgJiYgZXZlbnQudGFyZ2V0LmZpbGVzWzBdKSkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuc2VsZWN0ZWRGaWxlID0gPEZpbGU+ZXZlbnQudGFyZ2V0LmZpbGVzWzBdO1xuICAgIHRoaXMuZmQuYXBwZW5kKCdhdmF0YXInLCB0aGlzLnNlbGVjdGVkRmlsZSwgdGhpcy5zZWxlY3RlZEZpbGUubmFtZSk7XG4gICAgLy8gdGhpcy5maWxlVG9VcGxvYWQgPSBmaWxlO1xuICAgIC8vIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgLy8gcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7IC8vIHJlYWQgZmlsZSBhcyBkYXRhIHVybFxuICAgIC8vIHJlYWRlci5vbmxvYWQgPSAoX2V2ZW50KSA9PiB7XG4gICAgLy8gICBjb25zb2xlLmxvZyhyZWFkZXIucmVzdWx0KTsgLy8gbG9nIGJhc2U2NCBzdHJpbmdcbiAgICAvLyAgIHRoaXMuaW1hZ2VQYXRoID0gcmVhZGVyLnJlc3VsdDtcbiAgICAvLyB9O1xuICB9XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIFZJRVcgQSBVU0VSIElOIFRIRSBST09NIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gIHNldFNlbGVjdGVkUm9vbU1lbWJlcih1c2VyOiBhbnkpIHtcbiAgICB0aGlzLnNlbGVjdGVkUm9vbU1lbWJlciA9IHVzZXI7XG4gIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgU0VORCBBIE1FU1NBR0Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG4gICAgc2VuZE1lc3NhZ2UoKSB7XG4gICAgICBjb25zdCB7IG1lc3NhZ2UsIGN1cnJlbnRVc2VyIH0gPSB0aGlzO1xuICAgICAgdGhpcy5jaGF0a2l0VXNlci5zZW5kTWVzc2FnZSh7XG4gICAgICAgIHRleHQ6IG1lc3NhZ2UsXG4gICAgICAgIHJvb21JZDogdGhpcy5jdXJyZW50X3Jvb20uaWQsXG4gICAgICB9KS50aGVuKHJlcyA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMubWVzc2FnZSA9ICcnO1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbiAgLy8gSm9pbiBhIHJvb21cbiAgam9pblJvb20ocm9vbUlEKSB7XG4gICAgdGhpcy5jaGF0a2l0VXNlci5qb2luUm9vbSh7cm9vbUlkOiByb29tSUR9KS50aGVuKHJvb20gPT4ge1xuICAgICAgdGhpcy5jdXJyZW50X3Jvb20gPSByb29tO1xuICAgICAgY29uc29sZS5sb2codGhpcy5jdXJyZW50X3Jvb20pO1xuXG4gICAgICAvLyBBZnRlciBqb2luaW5nIHJvb20sIGZldGNoIG1lc3NhZ2VzXG4gICAgICB0aGlzLmNoYXRraXRVc2VyLmZldGNoTXVsdGlwYXJ0TWVzc2FnZXMoe3Jvb21JZDogcm9vbUlEfSkudGhlbihtZXNzYWdlcyA9PiB7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgbWVzc2FnZXNcbiAgICAgICAgaWYgKG1lc3NhZ2VzID09PSB1bmRlZmluZWQgfHwgbWVzc2FnZXMubGVuZ3RoID09PSAwKSB7IHJldHVybjsgfVxuXG4gICAgICAgIC8vIFNldCByZWFkIGN1cnNvclxuICAgICAgICB0aGlzLmNoYXRraXRVc2VyLnNldFJlYWRDdXJzb3Ioe1xuICAgICAgICAgIHJvb21JZDogdGhpcy5jdXJyZW50X3Jvb20uaWQsXG4gICAgICAgICAgcG9zaXRpb246IG1lc3NhZ2VzW21lc3NhZ2VzLmxlbmd0aCAtIDFdLmlkXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJvb21Ob3RpZmljYXRpb25zW3Jvb20uaWRdID0gZmFsc2U7XG4gICAgICAgIH0pOyAvLyBSZW1vdmUgbWFya2VyIGZyb20gbm90aWZpY2F0aW9ucyBhcnJheVxuICAgICAgICAvLyAudGhlbigoKSA9PiB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnU2V0IGN1cnNvcicpO1xuICAgICAgICAvLyAgIH0pXG4gICAgICAgIC8vICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhgRXJyb3Igc2V0dGluZyBjdXJzb3I6ICR7ZXJyfWApO1xuICAgICAgICAvLyAgIH0pO1xuICAgICAgICBtZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1lc3NhZ2UucGFydHNbMF0ucGF5bG9hZC5jb250ZW50KTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucm9vbV9tZXNzYWdlcyA9IG1lc3NhZ2VzO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgLy8gZW5kIEpvaW4gcm9vbVxuXG4gIC8vIEZ1bmN0aW9uID0+IGNoZWNrIGlmIHVzZXIgaGFzIHVucmVhZCBtZXNzYWdlcyBpbiBhIHJvb21cbiAgaGFzVW5yZWFkKHJvb21JRCkge1xuXG4gICAgbGV0IGhhc1VucmVhZCA9IGZhbHNlOyAvLyBUcmFjayByZXR1cm4gc3RhdHVzXG5cbiAgICAvLyBGaXJzdCwgY2hlY2sgaWYgY3Vyc29yIGV4aXN0c1xuICAgIGNvbnN0IGN1cnNvciA9IHRoaXMuY2hhdGtpdFVzZXIucmVhZEN1cnNvcih7XG4gICAgICByb29tSWQ6IHJvb21JRFxuICAgIH0pO1xuXG4gICAgLy8gaWYgcmVhZCBjdXJzb3IgSUQgIT09IGxhdGVzdCBtZXNzYWdlIElELi4uXG4gICAgdGhpcy5jaGF0a2l0VXNlci5mZXRjaE11bHRpcGFydE1lc3NhZ2VzKHsgLy8gR2V0IGxhdGVzdCBtZXNzYWdlXG4gICAgICByb29tSWQ6IHJvb21JRCxcbiAgICAgIGxpbWl0OiAxLFxuICAgIH0pXG4gICAgLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgICAgaWYgKGN1cnNvcikgeyAvLyBIYXMgY3Vyc29yIHNvIGNoZWNrIGN1cnNvciBwb3MgdnMgbGF0ZXN0IG1lc3NhZ2UgaWRcbiAgICAgICAgaGFzVW5yZWFkID0gKGN1cnNvci5wb3NpdGlvbiAhPT0gbWVzc2FnZXNbMF0uaW5pdGlhbElkKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vIGN1cnNvciA9PiBzZXRcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coYEVycm9yIGZldGNoaW5nIG1lc3NhZ2VzOiAke2Vycn1gKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBoYXNVbnJlYWQ7XG4gIH1cblxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEdFVCBDSEFUS0lUIFVTRVIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBnZXRVc2VyKHVzZXJfaWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke2Vudmlyb25tZW50LmFwaVVybH0vY2hhdGtpdC9nZXR1c2VyYCwge3VzZXJfaWR9KVxuICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvcikpO1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBHRVQgQ0hBVEtJVCBVU0VSUyBST09NUyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIGdldFVzZXJSb29tcyh1c2VyX2lkKSB7XG4gICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2NoYXRraXQvZ2V0dXNlcnJvb21zYCwge3VzZXJfaWR9KVxuICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAvLyB0aGlzLnJvb21zID0gcmVzO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvcikpO1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBTVUJTQ1JJQkUgVE8gUk9PTSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIHN1YnNjcmliZVRvUm9vbShyb29tSUQpIHtcbiAgICAgIHRoaXMuY2hhdGtpdFVzZXIuc3Vic2NyaWJlVG9Sb29tTXVsdGlwYXJ0KHtcbiAgICAgICAgcm9vbUlkOiByb29tSUQsXG4gICAgICAgIGhvb2tzOiB7XG4gICAgICAgICAgb25NZXNzYWdlOiBtZXNzYWdlID0+IHtcbiAgICAgICAgICAgIC8vIFdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLi4uXG5cbiAgICAgICAgICAgIC8vIFB1c2ggdG8gbWVzc2FnZXMgYXJyYXkgYW5kIHVwZGF0ZSB2aWV3XG4gICAgICAgICAgICB0aGlzLnJvb21fbWVzc2FnZXMucHVzaChtZXNzYWdlKTtcbiAgICAgICAgICAgIC8vIFNjcm9sbCBjaGF0IHdpbmRvdyB0byByZXZlYWwgbGF0ZXN0IG1lc3NhZ2VcbiAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGF0UmVlbCcpLnNjcm9sbFRvcCA9IDA7XG4gICAgICAgICAgICAvLyBhbGVydChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhdFJlZWwnKSk7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgdXNlcnMgbGFzdCBjdXJzb3IgcG9zaXRpb24gZnJvbSB0aGUgcm9vbVxuICAgICAgICAgICAgY29uc3QgY3Vyc29yID0gdGhpcy5jaGF0a2l0VXNlci5yZWFkQ3Vyc29yKHtcbiAgICAgICAgICAgICAgcm9vbUlkOiBtZXNzYWdlLnJvb21JZFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICgoY3Vyc29yLnBvc2l0aW9uICE9PSBtZXNzYWdlLmlkKSAmJiAobWVzc2FnZS5yb29tSWQgIT09IHRoaXMuY3VycmVudF9yb29tLmlkKSkge1xuICAgICAgICAgICAgICAvLyBJZiB0aGUgY3VycmVudCB1c2VyIGhhcyBub3Qgc2VlbiB0aGUgbWVzc2FnZSwgQU5EIHRoZSBtZXNzYWdlIHdhcyByZWNlaXZlZCBpbiBhIGRpZmZlcmVudCByb29tLFxuICAgICAgICAgICAgICAvLyBhZGQgbWFya2VyIHRvIG5vdGlmaWNhdGlvbiBhcnJheVxuICAgICAgICAgICAgICB0aGlzLnJvb21Ob3RpZmljYXRpb25zW21lc3NhZ2Uucm9vbS5pZF0gPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBtZXNzYWdlIHdhcyBzZW50IGluIGN1cnJlbnQgcm9vbSwgc28gYWxsIHdlIG11c3QgZG8gaXMgdXBkYXRlIHRoZVxuICAgICAgICAgICAgICAvLyByZWFkIGN1cnNvciBmb3IgdGhlIGN1cnJlbnQgdXNlcidzIHJvb21cbiAgICAgICAgICAgICAgdGhpcy5jaGF0a2l0VXNlci5zZXRSZWFkQ3Vyc29yKHtcbiAgICAgICAgICAgICAgICByb29tSWQ6IG1lc3NhZ2Uucm9vbUlkLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBtZXNzYWdlLmlkLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ291bnQgcm9vbXMgd2l0aCB1bnJlYWQgbm90aWZ1Y2F0aW9uc1xuICAgICAgICAgICAgbGV0IHJvb21zV2l0aE5vdGlmaWNhdGlvbnMgPSAwO1xuICAgICAgICAgICAgdGhpcy5yb29tTm90aWZpY2F0aW9ucy5mb3JFYWNoKHJvb20gPT4ge1xuICAgICAgICAgICAgICByb29tc1dpdGhOb3RpZmljYXRpb25zICs9IHJvb20gPT09IHRydWUgPyAxIDogMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gQWRkIHRvIGdsb2JhbCBub3RpZmljYXRpb24gY291bnRlclxuICAgICAgICAgICAgdGhpcy5tc2dTZXJ2aWNlLnNldFJvb21zV2l0aE5vdGlmaWNhdGlvbnMocm9vbXNXaXRoTm90aWZpY2F0aW9ucyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbkFkZGVkVG9Sb29tOiByb29tID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBBZGRlZCB0byByb29tICR7cm9vbS5uYW1lfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZUxpbWl0OiAxXG4gICAgICB9KTtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgQ1JFQVRFIFJPT00g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBjcmVhdGVSb29tKCkgeyAvLyBUT0RPOiBBZGQgdG8gbWVzc2FnZSBzZXJ2aWNlXG5cbiAgICAgIGNvbnN0IHJvb21OYW1lID0gdGhpcy5mb3JtSW1wb3J0LnZhbHVlLnJvb21OYW1lR3JvdXAucm9vbU5hbWU7XG4gICAgICBsZXQgcm9vbUF2YXRhciA9ICcnO1xuXG4gICAgICAvLyBUT0RPOiBBZGQgdGhpcyB0byB1cGxvYWQgc2VydmljZVxuICAgICAgLy8gVXBsb2FkIGltYWdlXG4gICAgICB0aGlzLmh0dHAucG9zdChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L3Jvb21zL2F2YXRhcmAsIHRoaXMuZmQpXG4gICAgICAudG9Qcm9taXNlKClcbiAgICAgIC50aGVuKCBhdmF0YXIgPT4ge1xuICAgICAgICByb29tQXZhdGFyID0gYXZhdGFyWydmaWxlbmFtZSddOyAvLyBTdG9yZSBwYXRoXG4gICAgICAgIGNvbnNvbGUubG9nKHJvb21BdmF0YXIpO1xuICAgICAgICAvLyBDcmVhdGUgdGhlIHJvb21cbiAgICAgICAgdGhpcy5jaGF0a2l0VXNlci5jcmVhdGVSb29tKHsgLy8gQ3JlYXRlIHRoZSByb29tXG4gICAgICAgICAgbmFtZTogcm9vbU5hbWUsXG4gICAgICAgICAgcHJpdmF0ZTogZmFsc2UsXG4gICAgICAgICAgY3VzdG9tRGF0YTogeyByb29tQXZhdGFyOiByb29tQXZhdGFyIH0sIC8vIEFkZCByb29tIGF2YXRhciB0byBjdXN0b20gcm9vbSBkYXRhXG4gICAgICAgIH0pLnRoZW4oIHJvb20gPT4geyAvLyBTdWNjZXNcbiAgICAgICAgICAgIHRoaXMucm9vbXMucHVzaChyb29tKTsgLy8gQWRkIHRoZSBuZXcgcm9vbSB0byB0aGUgbGlzdFxuICAgICAgICAgICAgdGhpcy5yb29tQ3JlYXRlZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyb29tKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDcmVhdGVkIHJvb20gY2FsbGVkICR7cm9vbS5uYW1lfWApO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiB7IC8vIEZhaWxlZCByb29tIGNyZWF0aW9uXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgY3JlYXRpbmcgcm9vbSAke2Vycn1gKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBTdWJzY3JpYmUgdG8gbmV3IG5vdGlmaWNhdGlvbnNcbiAgICB0aGlzLm1zZ1NlcnZpY2Uubm90aWZpY2F0aW9uQ291bnRcbiAgICAuc3Vic2NyaWJlKG5vdGlmaWNhdGlvbiA9PiB0aGlzLm5vdGlmaWNhdGlvbkNvdW50ID0gbm90aWZpY2F0aW9uKTtcblxuICAgIC8vIEdldCB1c2VyIGlkIGZyb20gbG9jYWwgc3RvcmFnZVxuICAgIGNvbnN0IHVzZXJfaWQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50VXNlcicpKS5fZW1iZWRkZWQudXNlci5pZDtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBzZXRJbnRlcnZhbCh0aGlzLmxvZ3RoZWhlaWdodCwgMzAwMCk7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5jaGF0UmVlbCk7XG4gICAgdGhpcy5jaGF0UmVlbC5jaGFuZ2VzLnN1YnNjcmliZShjID0+IHsgYy50b0FycmF5KCkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgLy8gY29uc29sZS5sb2coaXRlbS5uYXRpdmVFbGVtZW50KTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGl0ZW0ubmF0aXZlRWxlbWVudC5zY3JvbGxIZWlnaHQpO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZygnU2Nyb2xsIEhlaWdodDogJyArIGl0ZW0ubmF0aXZlRWxlbWVudC5vZmZzZXRQYXJlbnQuc2Nyb2xsSGVpZ2h0KTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTY3JvbGwgVG9wOiAnICsgaXRlbS5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudC5zY3JvbGxUb3ApO1xuXG4gICAgICBpdGVtLm5hdGl2ZUVsZW1lbnQub2Zmc2V0UGFyZW50LnNjcm9sbFRvcCA9IGl0ZW0ubmF0aXZlRWxlbWVudC5vZmZzZXRQYXJlbnQuc2Nyb2xsSGVpZ2h0O1xuICAgICAgLy8gaXRlbS5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IGl0ZW0ubmF0aXZlRWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAvLyBpdGVtLm5hdGl2ZUVsZW1lbnQuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCAnZmFzdCcpO1xuICAgICAgLy8gaXRlbS5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgfSk7XG4gIH0pO1xuICAgIC8vIGNvbnNvbGUubG9nKGVsZW0ubmF0aXZlRWxlbWVudCk7XG4gIH1cbn1cbiJdfQ==