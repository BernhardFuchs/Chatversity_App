"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var messaging_service_1 = require("../Core/_services/messaging.service");
var forms_1 = require("@angular/forms");
var auth_service_1 = require("../Core/_services/auth.service");
var RoomsComponent = /** @class */ (function () {
    function RoomsComponent(http, messageService, authService) {
        this.http = http;
        this.messageService = messageService;
        this.authService = authService;
        this.selectedFile = null;
        this.fd = new FormData();
        this.rooms = [];
        this.rooms_with_messages = {};
        this.roomNotifications = [];
        this.room_messages = [];
        this.isConnection = false;
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
        this.pondFiles = [];
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
    RoomsComponent.prototype.pondHandleInit = function () {
        console.log('FilePond has initialised', this.pond);
    };
    RoomsComponent.prototype.pondHandleAddFile = function (event) {
        // event.preventDefault()
        console.log(event);
        this.pondFiles.push(event.file.file);
        console.log('A file was added');
        // removes the file at index 1
    };
    //
    // ─── HANDLE DELETE ROOM ─────────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.deleteRoom = function (id) {
        var _this = this;
        console.log(id);
        this.messageService.deleteRoom(this.currentUser, id).then(function (latestRoom) {
            // remove local messages from the deleted room...
            for (var i = 0; i < _this.room_messages.length; i++) {
                if (_this.room_messages[i].id === id) {
                    _this.room_messages.splice(i, 1);
                }
            }
            // remove the deleted room from the local rooms array...
            for (var i = 0; i < _this.rooms.length; i++) {
                if (_this.rooms[i].id === id) {
                    _this.rooms.splice(i, 1);
                }
            }
            // ...then join the latest room
            _this.messageService.joinRoom(_this.currentUser, latestRoom.id).then(function (room) {
                // update current room
                _this.current_room = room;
                // and get the room messages
                _this.messageService.fetchRoomMessages(_this.currentUser, room.id, '', 20).then(function (messages) {
                    _this.room_messages = messages;
                    console.log(_this.room_messages);
                    console.log(messages);
                });
            });
        });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── DETECT FILE CHANGE FOR ROOM AVATAR ON CREATION ─────────────────────────────
    //
    RoomsComponent.prototype.onFileChange = function (event) {
        if (!(event.target.files && event.target.files[0])) {
            return;
        }
        this.selectedFile = event.target.files[0];
        this.fd.append('avatar', this.selectedFile, this.selectedFile.name);
    };
    // ────────────────────────────────────────────────────────────────────────────────
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
        this.currentUser.sendMessage({
            text: message,
            roomId: this.current_room.id,
        }).then(function (res) {
            console.log(res);
            console.log();
        });
        this.message = '';
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── JOIN A ROOM ────────────────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.joinRoom = function (roomID) {
        var _this = this;
        this.messageService.joinRoom(this.currentUser, roomID).then(function (room) {
            // update current room
            _this.current_room = room;
            // and get the room messages
            _this.messageService.fetchRoomMessages(_this.currentUser, roomID, '', 20).then(function (messages) {
                _this.room_messages = messages;
                console.log(_this.room_messages);
                console.log(messages);
            });
        });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── CHECK UNREAD MESSAGES ──────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.hasUnread = function (roomID) {
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
    // ────────────────────────────────────────────────────────────────────────────────
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
    // ─── CREATE ROOM ────────────────────────────────────────────────────────────────
    //
    RoomsComponent.prototype.createRoom = function () {
        var _this = this;
        console.log('room submitted');
        console.log(this.formImport);
        console.log(this.finalRoomData);
        this.pond.processFile().then(function (file) {
            console.log(file);
            var roomName = _this.formImport.value.roomNameGroup.roomName;
            var roomAvatar = '';
            _this.http.post(environment_1.environment.apiUrl + "/rooms/avatar", _this.finalRoomData)
                .toPromise()
                .then(function (response) { return console.log(JSON.stringify(response)); })
                .catch(function (error) { return console.log(error); });
            // TODO: Add this to upload service
            // Upload image
            _this.http.post(environment_1.environment.apiUrl + "/rooms/avatar", _this.fd)
                .toPromise()
                .then(function (avatar) {
                roomAvatar = avatar['filename']; // Store path
                console.log(roomAvatar);
                // Create the room
                _this.currentUser.createRoom({
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
        });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── CHECK IF MESSAGE TIMESTAMP IS TODAY ────────────────────────────────────────
    //
    RoomsComponent.prototype.MessageSentToday = function (msgDate) {
        // get current date
        var currDate = new Date();
        currDate.setDate(currDate.getDate());
        // console.log(currDate);
        // get message date
        msgDate = new Date(msgDate);
        // console.log(msgDate);
        var daysBetween = Math.floor((Date.parse(currDate.toDateString()) - Date.parse(msgDate.toDateString())) / 86400000);
        if (daysBetween >= 7) {
            // console.log('Message is at least 7 days old')
        }
        return false;
    };
    // ────────────────────────────────────────────────────────────────────────────────
    RoomsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.finalRoomData = new FormData();
        this.authService.getCurrentUser().subscribe(function (user) {
            _this.currentUser = user;
            if (user.rooms.length) {
                _this.rooms = user.rooms;
                _this.current_room = _this.messageService.getLatestRoom(user);
                _this.joinRoom(_this.current_room.id);
                _this.messageService.messages.subscribe(function (message) {
                    _this.room_messages.push(message);
                });
            }
            _this.pondOptions = {
                fileRenameFunction: function (file) {
                    var randomFileName = new Uint32Array(1);
                    window.crypto.getRandomValues(randomFileName);
                    return "" + randomFileName + file.extension;
                },
                allowFileRename: true,
                instantUpload: false,
                class: 'my-filepond',
                multiple: false,
                labelIdle: 'Upload .jpeg or .png',
                acceptedFileTypes: 'image/jpeg, image/png',
                checkValidity: true,
                server: {
                    url: "" + environment_1.environment.apiUrl,
                    process: '/rooms/avatar/tmp',
                    load: function (source, load, error, progress, abort, headers) {
                        // Should request a file object from the server here
                        // ...
                        // Can call the error method if something is wrong, should exit after
                        error('oh my goodness');
                        // Can call the header method to supply FilePond with early response header string
                        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
                        // headers(headersString);
                        // Should call the progress method to update the progress to 100% before calling load
                        // (endlessMode, loadedSize, totalSize)
                        progress(true, 0, 1024);
                        // Should call the load method with a file object or blob when done
                        // load(file);
                        // Should expose an abort method so the request can be cancelled
                        return {
                            abort: function () {
                                // User tapped cancel, abort our ongoing actions here
                                // Let FilePond know the request has been cancelled
                                abort();
                            }
                        };
                    },
                    revert: './revert.php',
                    restore: './restore.php?id=',
                    fetch: './fetch.php?data='
                }
            };
            console.log(_this.current_room);
            console.log(user.rooms);
            console.log(user);
        });
    };
    RoomsComponent.prototype.ngAfterViewInit = function () {
        this.chatReel.changes.subscribe(function (c) {
            c.toArray().forEach(function (item) {
                item.nativeElement.offsetParent.scrollTop = item.nativeElement.offsetParent.scrollHeight;
            });
        });
    };
    __decorate([
        core_1.ViewChildren('chatReel'),
        __metadata("design:type", core_1.QueryList)
    ], RoomsComponent.prototype, "chatReel", void 0);
    __decorate([
        core_1.ViewChild('newRoomPond'),
        __metadata("design:type", Object)
    ], RoomsComponent.prototype, "pond", void 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9yb29tcy9yb29tcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBaUk7QUFDakksNkNBQWlEO0FBQ2pELDhEQUE0RDtBQUM1RCx5RUFBc0U7QUFDdEUsd0NBQW1FO0FBRW5FLCtEQUE0RDtBQVM1RDtJQThESSx3QkFBb0IsSUFBZ0IsRUFBVSxjQUFnQyxFQUFVLFdBQXdCO1FBQTVGLFNBQUksR0FBSixJQUFJLENBQVk7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBa0I7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQXZEbEgsaUJBQVksR0FBUyxJQUFJLENBQUE7UUFDekIsT0FBRSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUE7UUFDbkIsVUFBSyxHQUFlLEVBQUUsQ0FBQTtRQUd0Qix3QkFBbUIsR0FBUSxFQUFFLENBQUE7UUFJN0Isc0JBQWlCLEdBQWUsRUFBRSxDQUFBO1FBQ2xDLGtCQUFhLEdBQWUsRUFBRSxDQUFBO1FBRTlCLGlCQUFZLEdBQUcsS0FBSyxDQUFBO1FBRXBCLHdDQUF3QztRQUN4QyxpQkFBWSxHQUFHLEVBQUUsQ0FBQTtRQVlqQixhQUFRLEdBQUcsRUFBRSxDQUFBO1FBUWIsZUFBVSxHQUFHLElBQUksaUJBQVMsQ0FBQztZQUN6QixtQkFBbUIsRUFBRSxJQUFJLGlCQUFTLENBQUM7Z0JBQ2pDLE1BQU0sRUFBRSxJQUFJLG1CQUFXLENBQUMsRUFBRSxDQUFDO2FBQzVCLENBQUM7WUFDRixhQUFhLEVBQUUsSUFBSSxpQkFBUyxDQUFDO2dCQUMzQixRQUFRLEVBQUUsSUFBSSxtQkFBVyxDQUFDLEVBQUUsRUFBRTtvQkFDNUIsa0JBQVUsQ0FBQyxRQUFRO29CQUNuQixrQkFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7aUJBQ3pCLENBQUM7YUFDSCxDQUFDO1lBQ0YsZ0JBQWdCLEVB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YVksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgRWxlbWVudFJlZiwgVmlld0NoaWxkLCBBZnRlclZpZXdJbml0LCBWaWV3Q2hpbGRyZW4sIFF1ZXJ5TGlzdCwgVmlld0NvbnRhaW5lclJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCdcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50J1xuaW1wb3J0IHsgTWVzc2FnaW5nU2VydmljZSB9IGZyb20gJy4uL0NvcmUvX3NlcnZpY2VzL21lc3NhZ2luZy5zZXJ2aWNlJ1xuaW1wb3J0IHsgRm9ybUdyb3VwLCBGb3JtQ29udHJvbCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJ1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi4vYXBwLmNvbXBvbmVudCdcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJ1xuaW1wb3J0IHsgcGFyc2VEYXRlIH0gZnJvbSAndG91Z2gtY29va2llJ1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1yb29tcycsXG4gIHRlbXBsYXRlVXJsOiAnLi9yb29tcy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3Jvb21zLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUm9vbXNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuXG4gIEBWaWV3Q2hpbGRyZW4oJ2NoYXRSZWVsJykgY2hhdFJlZWw6IFF1ZXJ5TGlzdDxWaWV3Q29udGFpbmVyUmVmPlxuICBjdXJyVXNlcjogYW55XG4gIHN1YnNjcmlwdGlvbjogYW55XG4gIGZpbGVUb1VwbG9hZDogRmlsZVxuICBpbWFnZVBhdGg6IGFueVxuICBzZWxlY3RlZEZpbGU6IEZpbGUgPSBudWxsXG4gIGZkID0gbmV3IEZvcm1EYXRhKClcbiAgcm9vbXM6IEFycmF5PGFueT4gPSBbXVxuICBjdXJyZW50VXNlcjogYW55XG4gIHVzZXJfaWQ6IGFueVxuICByb29tc193aXRoX21lc3NhZ2VzOiBhbnkgPSB7fVxuICBjdXJyZW50X3Jvb206IGFueVxuICBjaGF0VXNlcjogYW55XG4gIHJvb21DcmVhdGVkOiBib29sZWFuXG4gIHJvb21Ob3RpZmljYXRpb25zOiBBcnJheTxhbnk+ID0gW11cbiAgcm9vbV9tZXNzYWdlczogQXJyYXk8YW55PiA9IFtdXG4gIHVybDogc3RyaW5nXG4gIGlzQ29ubmVjdGlvbiA9IGZhbHNlXG5cbiAgLy8gVE9ETzogQ2FuIHByb2JhYmx5IHJlbW92ZSB0aGVzZSBwcm9wc1xuICBfcm9vbVByaXZhdGUgPSAnJ1xuICBzZWxlY3RlZFJvb21NZW1iZXI6IGFueVxuICBtZXNzYWdlczogT2JqZWN0XG4gIHBvbmRPcHRpb25zOiBhbnlcbiAgZmluYWxSb29tRGF0YTogRm9ybURhdGFcbiAgZ2V0IHJvb21Qcml2YXRlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvb21Qcml2YXRlXG4gIH1cbiAgc2V0IHJvb21Qcml2YXRlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9yb29tUHJpdmF0ZSA9IHZhbHVlXG4gIH1cblxuICBfbWVzc2FnZSA9ICcnXG4gIGdldCBtZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX21lc3NhZ2VcbiAgfVxuICBzZXQgbWVzc2FnZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fbWVzc2FnZSA9IHZhbHVlXG4gIH1cblxuICBmb3JtSW1wb3J0ID0gbmV3IEZvcm1Hcm91cCh7XG4gICAgdXNlckF2YXRhckZpbGVHcm91cDogbmV3IEZvcm1Hcm91cCh7XG4gICAgICBhdmF0YXI6IG5ldyBGb3JtQ29udHJvbCgnJyksXG4gICAgfSksXG4gICAgcm9vbU5hbWVHcm91cDogbmV3IEZvcm1Hcm91cCh7XG4gICAgICByb29tTmFtZTogbmV3IEZvcm1Db250cm9sKCcnLCBbXG4gICAgICAgIFZhbGlkYXRvcnMucmVxdWlyZWQsXG4gICAgICAgIFZhbGlkYXRvcnMubWF4TGVuZ3RoKDYwKVxuICAgICAgXSlcbiAgICB9KSxcbiAgICBwcml2YXRlUm9vbUdyb3VwOiBuZXcgRm9ybUdyb3VwKHtcbiAgICAgIHByaXZhdGVSb29tOiBuZXcgRm9ybUNvbnRyb2woJycpXG4gICAgfSlcbiAgfSlcblxuICAvL1xuICAvLyDilIDilIDilIAgQ09OU1RSVUNUT1Ig4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG4gICAgQFZpZXdDaGlsZCgnbmV3Um9vbVBvbmQnKSBwb25kOiBhbnlcbiAgICBwb25kRmlsZXMgPSBbXVxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHJpdmF0ZSBtZXNzYWdlU2VydmljZTogTWVzc2FnaW5nU2VydmljZSwgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UpIHt9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cbiAgcG9uZEhhbmRsZUluaXQoKSB7XG4gICAgY29uc29sZS5sb2coJ0ZpbGVQb25kIGhhcyBpbml0aWFsaXNlZCcsIHRoaXMucG9uZClcbiAgfVxuXG5cbiAgcG9uZEhhbmRsZUFkZEZpbGUoZXZlbnQ6IGFueSkge1xuICAgIC8vIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBjb25zb2xlLmxvZyhldmVudClcbiAgICB0aGlzLnBvbmRGaWxlcy5wdXNoKGV2ZW50LmZpbGUuZmlsZSlcblxuXG5cbiAgICBjb25zb2xlLmxvZygnQSBmaWxlIHdhcyBhZGRlZCcpXG4gICAgLy8gcmVtb3ZlcyB0aGUgZmlsZSBhdCBpbmRleCAxXG4gIH1cblxuXG4gIFxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBIQU5ETEUgREVMRVRFIFJPT00g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBkZWxldGVSb29tKGlkKSB7XG5cbiAgICAgIGNvbnNvbGUubG9nKGlkKVxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5kZWxldGVSb29tKHRoaXMuY3VycmVudFVzZXIsIGlkKS50aGVuKChsYXRlc3RSb29tKSA9PiB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGxvY2FsIG1lc3NhZ2VzIGZyb20gdGhlIGRlbGV0ZWQgcm9vbS4uLlxuICAgICAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGlzLnJvb21fbWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoIHRoaXMucm9vbV9tZXNzYWdlc1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgIHRoaXMucm9vbV9tZXNzYWdlcy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgdGhlIGRlbGV0ZWQgcm9vbSBmcm9tIHRoZSBsb2NhbCByb29tcyBhcnJheS4uLlxuICAgICAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGlzLnJvb21zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKCB0aGlzLnJvb21zW2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgdGhpcy5yb29tcy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyAuLi50aGVuIGpvaW4gdGhlIGxhdGVzdCByb29tXG4gICAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2Uuam9pblJvb20odGhpcy5jdXJyZW50VXNlciwgbGF0ZXN0Um9vbS5pZCkudGhlbigocm9vbSkgPT4ge1xuXG4gICAgICAgIC8vIHVwZGF0ZSBjdXJyZW50IHJvb21cbiAgICAgICAgdGhpcy5jdXJyZW50X3Jvb20gPSByb29tXG5cbiAgICAgICAgLy8gYW5kIGdldCB0aGUgcm9vbSBtZXNzYWdlc1xuICAgICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLmZldGNoUm9vbU1lc3NhZ2VzKHRoaXMuY3VycmVudFVzZXIsIHJvb20uaWQsICcnLCAyMCkudGhlbigobWVzc2FnZXMpID0+IHtcbiAgICAgICAgICAgIHRoaXMucm9vbV9tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnJvb21fbWVzc2FnZXMpXG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2VzKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgIH0pXG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIERFVEVDVCBGSUxFIENIQU5HRSBGT1IgUk9PTSBBVkFUQVIgT04gQ1JFQVRJT04g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBvbkZpbGVDaGFuZ2UoZXZlbnQpIHtcblxuICAgICAgaWYgKCEoZXZlbnQudGFyZ2V0LmZpbGVzICYmIGV2ZW50LnRhcmdldC5maWxlc1swXSkpIHsgcmV0dXJuIH1cblxuICAgICAgdGhpcy5zZWxlY3RlZEZpbGUgPSA8RmlsZT5ldmVudC50YXJnZXQuZmlsZXNbMF1cbiAgICAgIHRoaXMuZmQuYXBwZW5kKCdhdmF0YXInLCB0aGlzLnNlbGVjdGVkRmlsZSwgdGhpcy5zZWxlY3RlZEZpbGUubmFtZSlcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgVklFVyBBIFVTRVIgSU4gVEhFIFJPT00g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBzZXRTZWxlY3RlZFJvb21NZW1iZXIodXNlcjogYW55KSB7XG4gICAgICB0aGlzLnNlbGVjdGVkUm9vbU1lbWJlciA9IHVzZXJcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgU0VORCBBIE1FU1NBR0Ug4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBzZW5kTWVzc2FnZSgpIHtcbiAgICAgIGNvbnN0IHsgbWVzc2FnZSwgY3VycmVudFVzZXIgfSA9IHRoaXNcbiAgICAgIHRoaXMuY3VycmVudFVzZXIuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICB0ZXh0OiBtZXNzYWdlLFxuICAgICAgICByb29tSWQ6IHRoaXMuY3VycmVudF9yb29tLmlkLFxuICAgICAgfSkudGhlbihyZXMgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpXG4gICAgICAgIGNvbnNvbGUubG9nKClcbiAgICAgIH0pXG4gICAgICB0aGlzLm1lc3NhZ2UgPSAnJ1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBKT0lOIEEgUk9PTSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIGpvaW5Sb29tKHJvb21JRCkge1xuXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLmpvaW5Sb29tKHRoaXMuY3VycmVudFVzZXIsIHJvb21JRCkudGhlbigocm9vbSkgPT4ge1xuXG4gICAgICAgIC8vIHVwZGF0ZSBjdXJyZW50IHJvb21cbiAgICAgICAgdGhpcy5jdXJyZW50X3Jvb20gPSByb29tXG5cbiAgICAgICAgLy8gYW5kIGdldCB0aGUgcm9vbSBtZXNzYWdlc1xuICAgICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLmZldGNoUm9vbU1lc3NhZ2VzKHRoaXMuY3VycmVudFVzZXIsIHJvb21JRCwgJycsIDIwKS50aGVuKChtZXNzYWdlcykgPT4ge1xuXG4gICAgICAgICAgdGhpcy5yb29tX21lc3NhZ2VzID0gbWVzc2FnZXNcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnJvb21fbWVzc2FnZXMpXG5cbiAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlcylcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgQ0hFQ0sgVU5SRUFEIE1FU1NBR0VTIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgaGFzVW5yZWFkKHJvb21JRCkge1xuXG4gICAgICBsZXQgaGFzVW5yZWFkID0gZmFsc2UgLy8gVHJhY2sgcmV0dXJuIHN0YXR1c1xuXG4gICAgICAvLyBGaXJzdCwgY2hlY2sgaWYgY3Vyc29yIGV4aXN0c1xuICAgICAgY29uc3QgY3Vyc29yID0gdGhpcy5jdXJyZW50VXNlci5yZWFkQ3Vyc29yKHtcbiAgICAgICAgcm9vbUlkOiByb29tSURcbiAgICAgIH0pXG5cbiAgICAgIC8vIGlmIHJlYWQgY3Vyc29yIElEICE9PSBsYXRlc3QgbWVzc2FnZSBJRC4uLlxuICAgICAgdGhpcy5jdXJyZW50VXNlci5mZXRjaE11bHRpcGFydE1lc3NhZ2VzKHsgLy8gR2V0IGxhdGVzdCBtZXNzYWdlXG4gICAgICAgIHJvb21JZDogcm9vbUlELFxuICAgICAgICBsaW1pdDogMSxcbiAgICAgIH0pXG4gICAgICAudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgICAgIGlmIChjdXJzb3IpIHsgLy8gSGFzIGN1cnNvciBzbyBjaGVjayBjdXJzb3IgcG9zIHZzIGxhdGVzdCBtZXNzYWdlIGlkXG4gICAgICAgICAgaGFzVW5yZWFkID0gKGN1cnNvci5wb3NpdGlvbiAhPT0gbWVzc2FnZXNbMF0uaW5pdGlhbElkKSA/IHRydWUgOiBmYWxzZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE5vIGN1cnNvciA9PiBzZXRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgZmV0Y2hpbmcgbWVzc2FnZXM6ICR7ZXJyfWApXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gaGFzVW5yZWFkXG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEdFVCBDSEFUS0lUIFVTRVIg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBnZXRVc2VyKHVzZXJfaWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxhbnk+KGAke2Vudmlyb25tZW50LmFwaVVybH0vY2hhdGtpdC9nZXR1c2VyYCwge3VzZXJfaWR9KVxuICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICByZXR1cm4gcmVzXG4gICAgICAgIGNvbnNvbGUubG9nKHJlcylcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpKVxuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBHRVQgQ0hBVEtJVCBVU0VSUyBST09NUyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIGdldFVzZXJSb29tcyh1c2VyX2lkKSB7XG4gICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8YW55PihgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2NoYXRraXQvZ2V0dXNlcnJvb21zYCwge3VzZXJfaWR9KVxuICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAvLyB0aGlzLnJvb21zID0gcmVzO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpXG4gICAgICAgIHJldHVybiByZXNcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpKVxuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBDUkVBVEUgUk9PTSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICAgIGNyZWF0ZVJvb20oKSB7IC8vIFRPRE86IEFkZCB0byBtZXNzYWdlIHNlcnZpY2VcbiAgICAgIGNvbnNvbGUubG9nKCdyb29tIHN1Ym1pdHRlZCcpXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmZvcm1JbXBvcnQpXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmZpbmFsUm9vbURhdGEpXG5cbiAgICAgIHRoaXMucG9uZC5wcm9jZXNzRmlsZSgpLnRoZW4oKGZpbGUpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZmlsZSlcblxuICAgICAgICBjb25zdCByb29tTmFtZSA9IHRoaXMuZm9ybUltcG9ydC52YWx1ZS5yb29tTmFtZUdyb3VwLnJvb21OYW1lXG4gICAgICAgIGxldCByb29tQXZhdGFyID0gJydcblxuICAgICAgICB0aGlzLmh0dHAucG9zdChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L3Jvb21zL2F2YXRhcmAsIHRoaXMuZmluYWxSb29tRGF0YSlcbiAgICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSlcblxuXG4gICAgICAgIC8vIFRPRE86IEFkZCB0aGlzIHRvIHVwbG9hZCBzZXJ2aWNlXG4gICAgICAgIC8vIFVwbG9hZCBpbWFnZVxuICAgICAgICB0aGlzLmh0dHAucG9zdChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L3Jvb21zL2F2YXRhcmAsIHRoaXMuZmQpXG4gICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAudGhlbiggYXZhdGFyID0+IHtcbiAgICAgICAgICByb29tQXZhdGFyID0gYXZhdGFyWydmaWxlbmFtZSddIC8vIFN0b3JlIHBhdGhcbiAgICAgICAgICBjb25zb2xlLmxvZyhyb29tQXZhdGFyKVxuICAgICAgICAgIC8vIENyZWF0ZSB0aGUgcm9vbVxuICAgICAgICAgIHRoaXMuY3VycmVudFVzZXIuY3JlYXRlUm9vbSh7IC8vIENyZWF0ZSB0aGUgcm9vbVxuICAgICAgICAgICAgbmFtZTogcm9vbU5hbWUsXG4gICAgICAgICAgICBwcml2YXRlOiBmYWxzZSxcbiAgICAgICAgICAgIGN1c3RvbURhdGE6IHsgcm9vbUF2YXRhcjogcm9vbUF2YXRhciB9LCAvLyBBZGQgcm9vbSBhdmF0YXIgdG8gY3VzdG9tIHJvb20gZGF0YVxuICAgICAgICAgIH0pLnRoZW4oIHJvb20gPT4geyAvLyBTdWNjZXNcbiAgICAgICAgICAgICAgdGhpcy5yb29tcy5wdXNoKHJvb20pIC8vIEFkZCB0aGUgbmV3IHJvb20gdG8gdGhlIGxpc3RcbiAgICAgICAgICAgICAgdGhpcy5yb29tQ3JlYXRlZCA9IHRydWVcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocm9vbSlcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coYENyZWF0ZWQgcm9vbSBjYWxsZWQgJHtyb29tLm5hbWV9YClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHsgLy8gRmFpbGVkIHJvb20gY3JlYXRpb25cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIGNyZWF0aW5nIHJvb20gJHtlcnJ9YClcbiAgICAgICAgICAgIH0pXG4gICAgICB9KVxuXG5cbiAgICAgIH0pXG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIENIRUNLIElGIE1FU1NBR0UgVElNRVNUQU1QIElTIFRPREFZIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgTWVzc2FnZVNlbnRUb2RheShtc2dEYXRlOiBEYXRlKSB7XG5cbiAgICAgIC8vIGdldCBjdXJyZW50IGRhdGVcbiAgICAgIGNvbnN0IGN1cnJEYXRlID0gbmV3IERhdGUoKVxuICAgICAgY3VyckRhdGUuc2V0RGF0ZShjdXJyRGF0ZS5nZXREYXRlKCkpXG4gICAgICAvLyBjb25zb2xlLmxvZyhjdXJyRGF0ZSk7XG5cblxuICAgICAgLy8gZ2V0IG1lc3NhZ2UgZGF0ZVxuICAgICAgbXNnRGF0ZSA9IG5ldyBEYXRlKG1zZ0RhdGUpXG4gICAgICAvLyBjb25zb2xlLmxvZyhtc2dEYXRlKTtcblxuICAgICAgY29uc3QgZGF5c0JldHdlZW4gPSBNYXRoLmZsb29yKCggRGF0ZS5wYXJzZShjdXJyRGF0ZS50b0RhdGVTdHJpbmcoKSkgLSBEYXRlLnBhcnNlKG1zZ0RhdGUudG9EYXRlU3RyaW5nKCkpICkgLyA4NjQwMDAwMClcblxuICAgICAgaWYgKGRheXNCZXR3ZWVuID49IDcpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ01lc3NhZ2UgaXMgYXQgbGVhc3QgNyBkYXlzIG9sZCcpXG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICBuZ09uSW5pdCgpIHtcblxuICAgIHRoaXMuZmluYWxSb29tRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG5cbiAgICB0aGlzLmF1dGhTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCkuc3Vic2NyaWJlKCh1c2VyKSA9PiB7XG4gICAgICB0aGlzLmN1cnJlbnRVc2VyID0gdXNlclxuXG4gICAgICBpZiAodXNlci5yb29tcy5sZW5ndGgpIHtcblxuICAgICAgICB0aGlzLnJvb21zID0gdXNlci5yb29tc1xuICAgICAgICB0aGlzLmN1cnJlbnRfcm9vbSA9IHRoaXMubWVzc2FnZVNlcnZpY2UuZ2V0TGF0ZXN0Um9vbSh1c2VyKVxuICAgICAgICB0aGlzLmpvaW5Sb29tKHRoaXMuY3VycmVudF9yb29tLmlkKVxuICAgICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2VzLnN1YnNjcmliZSgobWVzc2FnZSkgPT4ge1xuICAgICAgICAgIHRoaXMucm9vbV9tZXNzYWdlcy5wdXNoKG1lc3NhZ2UpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMucG9uZE9wdGlvbnMgPSB7XG4gICAgICAgIGZpbGVSZW5hbWVGdW5jdGlvbjogKGZpbGUpID0+IHtcblxuICAgICAgICAgIHZhciByYW5kb21GaWxlTmFtZSA9IG5ldyBVaW50MzJBcnJheSgxKTtcbiAgICAgICAgICB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhyYW5kb21GaWxlTmFtZSlcbiAgICAgICAgICByZXR1cm4gYCR7cmFuZG9tRmlsZU5hbWV9JHtmaWxlLmV4dGVuc2lvbn1gXG4gICAgICB9LFxuICAgICAgICBhbGxvd0ZpbGVSZW5hbWU6IHRydWUsXG4gICAgICAgIGluc3RhbnRVcGxvYWQ6IGZhbHNlLFxuICAgICAgICBjbGFzczogJ215LWZpbGVwb25kJyxcbiAgICAgICAgbXVsdGlwbGU6IGZhbHNlLFxuICAgICAgICBsYWJlbElkbGU6ICdVcGxvYWQgLmpwZWcgb3IgLnBuZycsXG4gICAgICAgIGFjY2VwdGVkRmlsZVR5cGVzOiAnaW1hZ2UvanBlZywgaW1hZ2UvcG5nJyxcbiAgICAgICAgY2hlY2tWYWxpZGl0eTogdHJ1ZSxcbiAgICAgICAgc2VydmVyOiB7XG4gICAgICAgICAgdXJsOiBgJHtlbnZpcm9ubWVudC5hcGlVcmx9YCxcbiAgICAgICAgICBwcm9jZXNzOiAnL3Jvb21zL2F2YXRhci90bXAnLFxuICAgICAgICAgIGxvYWQ6IChzb3VyY2UsIGxvYWQsIGVycm9yLCBwcm9ncmVzcywgYWJvcnQsIGhlYWRlcnMpID0+IHtcbiAgICAgICAgICAgIC8vIFNob3VsZCByZXF1ZXN0IGEgZmlsZSBvYmplY3QgZnJvbSB0aGUgc2VydmVyIGhlcmVcbiAgICAgICAgICAgIC8vIC4uLlxuXG4gICAgICAgICAgICAvLyBDYW4gY2FsbCB0aGUgZXJyb3IgbWV0aG9kIGlmIHNvbWV0aGluZyBpcyB3cm9uZywgc2hvdWxkIGV4aXQgYWZ0ZXJcbiAgICAgICAgICAgIGVycm9yKCdvaCBteSBnb29kbmVzcycpO1xuXG4gICAgICAgICAgICAvLyBDYW4gY2FsbCB0aGUgaGVhZGVyIG1ldGhvZCB0byBzdXBwbHkgRmlsZVBvbmQgd2l0aCBlYXJseSByZXNwb25zZSBoZWFkZXIgc3RyaW5nXG4gICAgICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvWE1MSHR0cFJlcXVlc3QvZ2V0QWxsUmVzcG9uc2VIZWFkZXJzXG4gICAgICAgICAgICAvLyBoZWFkZXJzKGhlYWRlcnNTdHJpbmcpO1xuXG4gICAgICAgICAgICAvLyBTaG91bGQgY2FsbCB0aGUgcHJvZ3Jlc3MgbWV0aG9kIHRvIHVwZGF0ZSB0aGUgcHJvZ3Jlc3MgdG8gMTAwJSBiZWZvcmUgY2FsbGluZyBsb2FkXG4gICAgICAgICAgICAvLyAoZW5kbGVzc01vZGUsIGxvYWRlZFNpemUsIHRvdGFsU2l6ZSlcbiAgICAgICAgICAgIHByb2dyZXNzKHRydWUsIDAsIDEwMjQpO1xuXG4gICAgICAgICAgICAvLyBTaG91bGQgY2FsbCB0aGUgbG9hZCBtZXRob2Qgd2l0aCBhIGZpbGUgb2JqZWN0IG9yIGJsb2Igd2hlbiBkb25lXG4gICAgICAgICAgICAvLyBsb2FkKGZpbGUpO1xuXG4gICAgICAgICAgICAvLyBTaG91bGQgZXhwb3NlIGFuIGFib3J0IG1ldGhvZCBzbyB0aGUgcmVxdWVzdCBjYW4gYmUgY2FuY2VsbGVkXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGFib3J0OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVzZXIgdGFwcGVkIGNhbmNlbCwgYWJvcnQgb3VyIG9uZ29pbmcgYWN0aW9ucyBoZXJlXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTGV0IEZpbGVQb25kIGtub3cgdGhlIHJlcXVlc3QgaGFzIGJlZW4gY2FuY2VsbGVkXG4gICAgICAgICAgICAgICAgICAgIGFib3J0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgICByZXZlcnQ6ICcuL3JldmVydC5waHAnLFxuICAgICAgICAgIHJlc3RvcmU6ICcuL3Jlc3RvcmUucGhwP2lkPScsXG4gICAgICAgICAgZmV0Y2g6ICcuL2ZldGNoLnBocD9kYXRhPSdcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRfcm9vbSlcbiAgICAgIGNvbnNvbGUubG9nKHVzZXIucm9vbXMpXG4gICAgICBjb25zb2xlLmxvZyh1c2VyKVxuICAgIH0pXG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG5cbiAgICB0aGlzLmNoYXRSZWVsLmNoYW5nZXMuc3Vic2NyaWJlKGMgPT4ge1xuICAgICAgYy50b0FycmF5KCkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaXRlbS5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudC5zY3JvbGxUb3AgPSBpdGVtLm5hdGl2ZUVsZW1lbnQub2Zmc2V0UGFyZW50LnNjcm9sbEhlaWdodFxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG4iXX0=