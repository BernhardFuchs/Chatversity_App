"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var chatkit_client_1 = require("@pusher/chatkit-client");
var rxjs_1 = require("rxjs");
var http_1 = require("@angular/common/http");
var environment_prod_1 = require("../../../environments/environment.prod");
var MessagingService = /** @class */ (function () {
    function MessagingService(http) {
        this.http = http;
        this.messages = new rxjs_1.Subject();
        this.onlineUsers = new rxjs_1.Subject();
        this.rooms = [];
        this.messages = new rxjs_1.Subject();
    }
    MessagingService.prototype.getOnlineUsers = function () {
        return this.onlineUsers.asObservable();
    };
    //
    // ─── HANDLE DELETE ROOM ─────────────────────────────────────────────────────────
    //
    MessagingService.prototype.deleteRoom = function (user, id) {
        var _this = this;
        return user.deleteRoom({ roomId: id })
            .then(function () {
            console.log("Deleted room with ID: " + id);
            _this.latestReadCursor = false;
            _this.latestRoom = false;
            _this.latestRoom = _this.getLatestRoom(user);
            return _this.latestRoom;
        })
            .catch(function (err) {
            console.log("Error deleted room " + id + ": " + err);
        });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── SET READ CURSOR ────────────────────────────────────────────────────────────
    //
    MessagingService.prototype.setLatestReadCursor = function (user, roomId) {
        var _this = this;
        // get position (ID) of latest room message
        this.fetchRoomMessages(user, roomId, '', 1).then(function (messages) {
            console.log(messages);
            if (!messages.length) {
                user.rooms.forEach(function (room) {
                    if (room.id === roomId) {
                        _this.latestRoom = room;
                        return;
                    }
                });
            }
            else {
                // set position of cursor to match
                user.setReadCursor({
                    roomId: roomId,
                    position: messages[0].id
                })
                    .then(function () {
                    user.rooms.forEach(function (room) {
                        if (room.id === messages[0].roomId) {
                            _this.latestRoom = room;
                        }
                    });
                    console.log("Set read cursor in room " + roomId + " with position " + messages[0].id);
                })
                    .catch(function (err) {
                    console.log("Error setting cursor: " + err);
                });
            }
        });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── SET READ CURSOR ────────────────────────────────────────────────────────────
    //
    MessagingService.prototype.setReadCursor = function (user, roomId, position) {
        user.setReadCursor({
            roomId: roomId,
            position: position
        })
            .then(function () {
            console.log("Set read cursor in room " + roomId);
        })
            .catch(function (err) {
            console.log("Error setting cursor: " + err);
        });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── GET LATEST ROOM ────────────────────────────────────────────────────────────
    //
    MessagingService.prototype.getLatestRoom = function (user) {
        console.log('getting latest room');
        if (this.latestRoom) {
            return this.latestRoom;
        }
        var latestRoom;
        var latestReadCursor = this.getLatestReadCursor(user);
        console.log(latestReadCursor);
        user.rooms.forEach(function (room) {
            console.log(room.id);
            console.log(latestReadCursor.roomId);
            if (room.id === latestReadCursor.roomId) {
                latestRoom = room;
            }
        });
        return latestRoom;
        // return user.rooms.forEach(room => {
        //   console.log(room.id);
        //   console.log(latestReadCursor.roomId);
        //   while (room.id)
        //   if (room.id === latestReadCursor.roomId) { return room; }
        //   // if (latestRoom) { console.log('Got latest room'); return latestRoom; }/
        // });
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── GET LATEST CURSOR ──────────────────────────────────────────────────────────
    //
    MessagingService.prototype.getLatestReadCursor = function (user) {
        if (this.latestReadCursor) {
            return this.latestReadCursor;
        }
        var cursors = [];
        // first, get user cursor from each room
        user.rooms.forEach(function (room) {
            cursors.push(user.readCursor({ roomId: room.id }));
        });
        console.log(cursors);
        // then sort to find lowest
        var sorted = cursors.sort();
        console.log(sorted);
        var latestCursor = sorted[0];
        this.latestReadCursor = latestCursor;
        return latestCursor;
    };
    // ─────────────────────────────────────────────────────────────────
    MessagingService.prototype.roomHasMessages = function (user, roomId) {
        if (!this.rooms) {
            return false;
        }
        this.rooms.forEach(function (room) {
            if (room.id === roomId) {
                return true;
            }
        });
        return false;
    };
    MessagingService.prototype.fetchRoomMessages = function (user, roomId, direction, limit) {
        var _this = this;
        if (direction === void 0) { direction = 'older'; }
        if (limit === void 0) { limit = 0; }
        if (this.roomHasMessages(user, roomId)) {
            this.rooms.forEach(function (room) {
                if (room.id === roomId) {
                    return room[1];
                }
            });
        }
        return user.fetchMultipartMessages({
            roomId: roomId,
            direction: direction,
            limit: limit,
        })
            .then(function (messages) {
            var roomWithMessages = new Array(roomId, messages);
            console.log(roomWithMessages);
            _this.rooms.push(roomWithMessages);
            return messages;
        })
            .catch(function (err) {
            console.log("Error fetching messages: " + err);
        });
    };
    //
    // ─── JOIN ROOM ───────────────────────────────────────────────────
    //
    MessagingService.prototype.joinRoom = function (user, roomId) {
        var _this = this;
        return user.joinRoom({ roomId: roomId })
            .then(function (room) {
            _this.setLatestReadCursor(user, roomId);
            return room;
        })
            .catch(function (err) {
            console.log("Error joining room " + roomId + ": " + err);
        });
    };
    // ─────────────────────────────────────────────────────────────────
    MessagingService.prototype.disconnect = function () {
        this.currentUser.disconnect();
    };
    MessagingService.prototype.subscribeToAllRooms = function () {
        var _this = this;
        var currentUser = this.currentUser;
        if (!currentUser.rooms.length) {
            return;
        }
        currentUser.rooms.forEach(function (room) {
            currentUser.subscribeToRoomMultipart({
                roomId: room.id,
                hooks: {
                    onMessage: function (message) {
                        // console.log('Received message', message);
                        _this.messages.next(message);
                    }
                },
                messageLimit: 10
            });
        });
    };
    MessagingService.prototype.getAllRooms = function () {
        var headers = new http_1.HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });
        return this.http.get(environment_prod_1.environment.apiUrl + "/chatkit/rooms");
    };
    MessagingService.prototype.initChatkit = function (userId) {
        var _this = this;
        this.chatManager = new chatkit_client_1.ChatManager({
            instanceLocator: 'v1:us1:a54bdf12-93d6-46f9-be3b-bfa837917fb5',
            userId: userId,
            tokenProvider: new chatkit_client_1.TokenProvider({
                url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a54bdf12-93d6-46f9-be3b-bfa837917fb5/token'
            })
        });
        return this.chatManager.connect({
            onAddedToRoom: function (room) {
                console.log("Added to room " + room.name);
            },
            onRemovedFromRoom: function (room) {
                console.log("Removed from room " + room.name);
            },
            onRoomUpdated: function (room) {
                console.log("Updated room " + room.name);
            },
            onRoomDeleted: function (room) {
                console.log("Deleted room " + room.name);
            },
            onPresenceChanged: function (state, user) {
                _this.onlineUsers.next({ state: state, user: user });
                console.log("User " + user.name + " is " + state.current);
            }
        })
            .then(function (user) {
            console.log("Connected as " + user.name + ". \n Setting up rooms...");
            _this.currentUser = user;
            localStorage.setItem('chatkitUserId', user.id);
            // If user has no rooms then return
            if (user.rooms.length) {
                console.log('subscribing to all rooms');
                // Subscribe to all user rooms to be notified of new messages
                _this.subscribeToAllRooms();
                // Join the latest room
                console.log(user);
                var latestRoom = _this.getLatestRoom(user);
                console.log(latestRoom);
                _this.joinRoom(user, latestRoom.id);
                // this.getLatestRoom(user).then((room) => {
                //   this.joinRoom(user, room.id);
                // });
            }
            return user;
        });
    };
    MessagingService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], MessagingService);
    return MessagingService;
}());
exports.MessagingService = MessagingService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnaW5nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBwL0NvcmUvX3NlcnZpY2VzL21lc3NhZ2luZy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBRWxELHlEQUFtRTtBQUVuRSw2QkFBd0Y7QUFDeEYsNkNBQThEO0FBQzlELDJFQUFvRTtBQU1wRTtJQVlFLDBCQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBSnBDLGFBQVEsR0FBaUIsSUFBSSxjQUFPLEVBQU8sQ0FBQTtRQUMzQyxnQkFBVyxHQUFpQixJQUFJLGNBQU8sRUFBTyxDQUFBO1FBRTlDLFVBQUssR0FBZSxFQUFFLENBQUE7UUFDa0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGNBQU8sRUFBTyxDQUFBO0lBQUMsQ0FBQztJQUc1RSx5Q0FBYyxHQUFkO1FBQ0UsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFBO0lBQ3hDLENBQUM7SUFJRCxFQUFFO0lBQ0YsbUZBQW1GO0lBQ25GLEVBQUU7SUFHQSxxQ0FBVSxHQUFWLFVBQVcsSUFBSSxFQUFFLEVBQUU7UUFBbkIsaUJBZ0JDO1FBZEMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDO2FBQ3JDLElBQUksQ0FBQztZQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQXlCLEVBQUksQ0FBQyxDQUFBO1lBRTFDLEtBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUE7WUFDN0IsS0FBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUE7WUFFdkIsS0FBSSxDQUFDLFVBQVUsR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBRTFDLE9BQU8sS0FBSSxDQUFDLFVBQVUsQ0FBQTtRQUN4QixDQUFDLENBQUM7YUFDRCxLQUFLLENB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SUFBSSxDQUFBO1FBQ2IsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBaFZVLGdCQUFnQjtRQUg1QixpQkFBVSxDQUFDO1lBQ1YsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FBQzt5Q0FhMEIsaUJBQVU7T0FaekIsZ0JBQWdCLENBaVY1QjtJQUFELHVCQUFDO0NBQUEsQUFqVkQsSUFpVkM7QUFqVlksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7QXV0aFNlcnZpY2V9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJ1xuaW1wb3J0IHsgQ2hhdE1hbmFnZXIsIFRva2VuUHJvdmlkZXIgfSBmcm9tICdAcHVzaGVyL2NoYXRraXQtY2xpZW50J1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uL19tb2RlbHMvdXNlcidcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgU3Vic2NyaXB0aW9uLCBSZXBsYXlTdWJqZWN0LCBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcydcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnXG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uLy4uLy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudC5wcm9kJ1xuXG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2luZ1NlcnZpY2Uge1xuXG5cblxuICBjaGF0TWFuYWdlcjogYW55XG4gIGN1cnJlbnRVc2VyOiBhbnlcbiAgbGF0ZXN0Um9vbTogYW55XG4gIGxhdGVzdFJlYWRDdXJzb3I6IGFueVxuICBtZXNzYWdlczogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3Q8YW55PigpXG4gIG9ubGluZVVzZXJzOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdDxhbnk+KClcbiAgcm9vbXNBbmRNZXNzYWdlczogYW55XG4gIHJvb21zOiBBcnJheTxhbnk+ID0gW11cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7IHRoaXMubWVzc2FnZXMgPSBuZXcgU3ViamVjdDxhbnk+KCkgfVxuXG5cbiAgZ2V0T25saW5lVXNlcnMoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5vbmxpbmVVc2Vycy5hc09ic2VydmFibGUoKVxuICB9XG5cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBIQU5ETEUgREVMRVRFIFJPT00g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cblxuICAgIGRlbGV0ZVJvb20odXNlciwgaWQpIHtcblxuICAgICAgcmV0dXJuIHVzZXIuZGVsZXRlUm9vbSh7IHJvb21JZDogaWQgfSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYERlbGV0ZWQgcm9vbSB3aXRoIElEOiAke2lkfWApXG5cbiAgICAgICAgdGhpcy5sYXRlc3RSZWFkQ3Vyc29yID0gZmFsc2VcbiAgICAgICAgdGhpcy5sYXRlc3RSb29tID0gZmFsc2VcblxuICAgICAgICB0aGlzLmxhdGVzdFJvb20gPSB0aGlzLmdldExhdGVzdFJvb20odXNlcilcblxuICAgICAgICByZXR1cm4gdGhpcy5sYXRlc3RSb29tXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBkZWxldGVkIHJvb20gJHtpZH06ICR7ZXJyfWApXG4gICAgICB9KVxuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBTRVQgUkVBRCBDVVJTT1Ig4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBzZXRMYXRlc3RSZWFkQ3Vyc29yKHVzZXIsIHJvb21JZCkge1xuXG4gICAgICAvLyBnZXQgcG9zaXRpb24gKElEKSBvZiBsYXRlc3Qgcm9vbSBtZXNzYWdlXG4gICAgICB0aGlzLmZldGNoUm9vbU1lc3NhZ2VzKHVzZXIsIHJvb21JZCwgJycsIDEpLnRoZW4oKG1lc3NhZ2VzKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2VzKVxuXG4gICAgICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgdXNlci5yb29tcy5mb3JFYWNoKHJvb20gPT4ge1xuICAgICAgICAgICAgaWYgKHJvb20uaWQgPT09IHJvb21JZCkge1xuICAgICAgICAgICAgICB0aGlzLmxhdGVzdFJvb20gPSByb29tXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAvLyBzZXQgcG9zaXRpb24gb2YgY3Vyc29yIHRvIG1hdGNoXG4gICAgICAgICAgdXNlci5zZXRSZWFkQ3Vyc29yKHtcbiAgICAgICAgICAgICAgcm9vbUlkOiByb29tSWQsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBtZXNzYWdlc1swXS5pZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdXNlci5yb29tcy5mb3JFYWNoKHJvb20gPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyb29tLmlkID09PSBtZXNzYWdlc1swXS5yb29tSWQpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMubGF0ZXN0Um9vbSA9IHJvb21cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBTZXQgcmVhZCBjdXJzb3IgaW4gcm9vbSAke3Jvb21JZH0gd2l0aCBwb3NpdGlvbiAke21lc3NhZ2VzWzBdLmlkfWApXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBzZXR0aW5nIGN1cnNvcjogJHtlcnJ9YClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgfSlcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgU0VUIFJFQUQgQ1VSU09SIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgc2V0UmVhZEN1cnNvcih1c2VyLCByb29tSWQsIHBvc2l0aW9uKSB7XG5cbiAgICAgIHVzZXIuc2V0UmVhZEN1cnNvcih7XG4gICAgICAgICAgcm9vbUlkOiByb29tSWQsXG4gICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgU2V0IHJlYWQgY3Vyc29yIGluIHJvb20gJHtyb29tSWR9YClcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHNldHRpbmcgY3Vyc29yOiAke2Vycn1gKVxuICAgICAgICB9KVxuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBHRVQgTEFURVNUIFJPT00g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBnZXRMYXRlc3RSb29tKHVzZXIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdnZXR0aW5nIGxhdGVzdCByb29tJylcbiAgICAgIGlmICh0aGlzLmxhdGVzdFJvb20pIHsgcmV0dXJuIHRoaXMubGF0ZXN0Um9vbSB9XG5cbiAgICAgIGxldCBsYXRlc3RSb29tXG4gICAgICBjb25zdCBsYXRlc3RSZWFkQ3Vyc29yID0gdGhpcy5nZXRMYXRlc3RSZWFkQ3Vyc29yKHVzZXIpXG4gICAgICBjb25zb2xlLmxvZyhsYXRlc3RSZWFkQ3Vyc29yKVxuXG5cbiAgICAgIHVzZXIucm9vbXMuZm9yRWFjaChyb29tID0+IHtcbiAgICAgICAgY29uc29sZS5sb2cocm9vbS5pZClcbiAgICAgICAgY29uc29sZS5sb2cobGF0ZXN0UmVhZEN1cnNvci5yb29tSWQpXG5cbiAgICAgICAgaWYgKHJvb20uaWQgPT09IGxhdGVzdFJlYWRDdXJzb3Iucm9vbUlkKSB7IGxhdGVzdFJvb20gPSByb29tIH1cblxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIGxhdGVzdFJvb21cblxuICAgICAgLy8gcmV0dXJuIHVzZXIucm9vbXMuZm9yRWFjaChyb29tID0+IHtcbiAgICAgIC8vICAgY29uc29sZS5sb2cocm9vbS5pZCk7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKGxhdGVzdFJlYWRDdXJzb3Iucm9vbUlkKTtcblxuICAgICAgLy8gICB3aGlsZSAocm9vbS5pZClcblxuICAgICAgLy8gICBpZiAocm9vbS5pZCA9PT0gbGF0ZXN0UmVhZEN1cnNvci5yb29tSWQpIHsgcmV0dXJuIHJvb207IH1cblxuICAgICAgLy8gICAvLyBpZiAobGF0ZXN0Um9vbSkgeyBjb25zb2xlLmxvZygnR290IGxhdGVzdCByb29tJyk7IHJldHVybiBsYXRlc3RSb29tOyB9L1xuXG4gICAgICAvLyB9KTtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgR0VUIExBVEVTVCBDVVJTT1Ig4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgICBnZXRMYXRlc3RSZWFkQ3Vyc29yKHVzZXIpIHtcblxuICAgICAgaWYgKHRoaXMubGF0ZXN0UmVhZEN1cnNvcikgeyByZXR1cm4gdGhpcy5sYXRlc3RSZWFkQ3Vyc29yIH1cblxuICAgICAgY29uc3QgY3Vyc29ycyA9IFtdXG5cbiAgICAgIC8vIGZpcnN0LCBnZXQgdXNlciBjdXJzb3IgZnJvbSBlYWNoIHJvb21cbiAgICAgIHVzZXIucm9vbXMuZm9yRWFjaChyb29tID0+IHtcbiAgICAgICAgY3Vyc29ycy5wdXNoKHVzZXIucmVhZEN1cnNvcih7IHJvb21JZDogcm9vbS5pZCB9KSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnNvbGUubG9nKGN1cnNvcnMpXG5cbiAgICAgIC8vIHRoZW4gc29ydCB0byBmaW5kIGxvd2VzdFxuICAgICAgY29uc3Qgc29ydGVkID0gY3Vyc29ycy5zb3J0KClcbiAgICAgIGNvbnNvbGUubG9nKHNvcnRlZClcblxuICAgICAgY29uc3QgbGF0ZXN0Q3Vyc29yID0gc29ydGVkWzBdXG5cbiAgICAgIHRoaXMubGF0ZXN0UmVhZEN1cnNvciA9IGxhdGVzdEN1cnNvclxuICAgICAgcmV0dXJuIGxhdGVzdEN1cnNvclxuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIHJvb21IYXNNZXNzYWdlcyh1c2VyLCByb29tSWQpIHtcblxuICAgIGlmICghdGhpcy5yb29tcykgeyByZXR1cm4gZmFsc2UgfVxuXG4gICAgdGhpcy5yb29tcy5mb3JFYWNoKHJvb20gPT4ge1xuICAgICAgaWYgKHJvb20uaWQgPT09IHJvb21JZCkgeyByZXR1cm4gdHJ1ZX1cbiAgICB9KVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cblxuXG4gIGZldGNoUm9vbU1lc3NhZ2VzKHVzZXIsIHJvb21JZCwgZGlyZWN0aW9uID0gJ29sZGVyJywgbGltaXQgPSAwKSB7XG5cbiAgICBpZiAodGhpcy5yb29tSGFzTWVzc2FnZXModXNlciwgcm9vbUlkKSkge1xuICAgICAgdGhpcy5yb29tcy5mb3JFYWNoKHJvb20gPT4ge1xuICAgICAgICBpZiAocm9vbS5pZCA9PT0gcm9vbUlkKSB7IHJldHVybiByb29tWzFdfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gdXNlci5mZXRjaE11bHRpcGFydE1lc3NhZ2VzKHtcbiAgICAgIHJvb21JZDogcm9vbUlkLFxuICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXG4gICAgICBsaW1pdDogbGltaXQsXG4gICAgfSlcbiAgICAgIC50aGVuKG1lc3NhZ2VzID0+IHtcblxuICAgICAgICBjb25zdCByb29tV2l0aE1lc3NhZ2VzID0gbmV3IEFycmF5KHJvb21JZCwgbWVzc2FnZXMpXG4gICAgICAgIGNvbnNvbGUubG9nKHJvb21XaXRoTWVzc2FnZXMpXG5cblxuICAgICAgICB0aGlzLnJvb21zLnB1c2gocm9vbVdpdGhNZXNzYWdlcylcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBmZXRjaGluZyBtZXNzYWdlczogJHtlcnJ9YClcbiAgICAgIH0pXG4gIH1cblxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgSk9JTiBST09NIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gICAgam9pblJvb20odXNlcjogYW55LCByb29tSWQ6IGFueSkge1xuXG4gICAgcmV0dXJuIHVzZXIuam9pblJvb20oe3Jvb21JZDogcm9vbUlkfSlcbiAgICAgICAgLnRoZW4ocm9vbSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRMYXRlc3RSZWFkQ3Vyc29yKHVzZXIsIHJvb21JZClcbiAgICAgICAgICByZXR1cm4gcm9vbVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3Igam9pbmluZyByb29tICR7cm9vbUlkfTogJHtlcnJ9YClcbiAgICAgICAgfSlcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMuY3VycmVudFVzZXIuZGlzY29ubmVjdCgpXG4gIH1cblxuXG4gIHN1YnNjcmliZVRvQWxsUm9vbXMoKSB7XG5cbiAgICBjb25zdCBjdXJyZW50VXNlciA9IHRoaXMuY3VycmVudFVzZXJcblxuICAgIGlmICghIGN1cnJlbnRVc2VyLnJvb21zLmxlbmd0aCkgeyByZXR1cm4gfVxuXG4gICAgY3VycmVudFVzZXIucm9vbXMuZm9yRWFjaChyb29tID0+IHtcbiAgICAgIGN1cnJlbnRVc2VyLnN1YnNjcmliZVRvUm9vbU11bHRpcGFydCh7XG4gICAgICAgICAgcm9vbUlkOiByb29tLmlkLFxuICAgICAgICAgIGhvb2tzOiB7XG4gICAgICAgICAgICAgIG9uTWVzc2FnZTogbWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1JlY2VpdmVkIG1lc3NhZ2UnLCBtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2VzLm5leHQobWVzc2FnZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbWVzc2FnZUxpbWl0OiAxMFxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgZ2V0QWxsUm9vbXMoKSB7XG4gICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICB9KVxuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8YW55W10+KGAke2Vudmlyb25tZW50LmFwaVVybH0vY2hhdGtpdC9yb29tc2ApXG4gIH1cblxuXG5cbiAgaW5pdENoYXRraXQodXNlcklkKSB7XG5cbiAgICB0aGlzLmNoYXRNYW5hZ2VyID0gbmV3IENoYXRNYW5hZ2VyKHtcbiAgICAgIGluc3RhbmNlTG9jYXRvcjogJ3YxOnVzMTphNTRiZGYxMi05M2Q2LTQ2ZjktYmUzYi1iZmE4Mzc5MTdmYjUnLFxuICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICB0b2tlblByb3ZpZGVyOiBuZXcgVG9rZW5Qcm92aWRlcih7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vdXMxLnB1c2hlcnBsYXRmb3JtLmlvL3NlcnZpY2VzL2NoYXRraXRfdG9rZW5fcHJvdmlkZXIvdjEvYTU0YmRmMTItOTNkNi00NmY5LWJlM2ItYmZhODM3OTE3ZmI1L3Rva2VuJ1xuICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIHRoaXMuY2hhdE1hbmFnZXIuY29ubmVjdCh7XG4gICAgICBvbkFkZGVkVG9Sb29tOiByb29tID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYEFkZGVkIHRvIHJvb20gJHtyb29tLm5hbWV9YClcbiAgICAgIH0sXG4gICAgICBvblJlbW92ZWRGcm9tUm9vbTogcm9vbSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBSZW1vdmVkIGZyb20gcm9vbSAke3Jvb20ubmFtZX1gKVxuICAgICAgfSxcbiAgICAgIG9uUm9vbVVwZGF0ZWQ6IHJvb20gPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgVXBkYXRlZCByb29tICR7cm9vbS5uYW1lfWApXG4gICAgICB9LFxuICAgICAgb25Sb29tRGVsZXRlZDogcm9vbSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBEZWxldGVkIHJvb20gJHtyb29tLm5hbWV9YClcbiAgICAgIH0sXG4gICAgICBvblByZXNlbmNlQ2hhbmdlZDogKHN0YXRlLCB1c2VyKSA9PiB7XG4gICAgICAgIHRoaXMub25saW5lVXNlcnMubmV4dCh7IHN0YXRlLCB1c2VyIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKGBVc2VyICR7dXNlci5uYW1lfSBpcyAke3N0YXRlLmN1cnJlbnR9YClcbiAgICAgIH1cbiAgICB9KVxuICAgICAgLnRoZW4odXNlciA9PiB7XG5cbiAgICAgICAgY29uc29sZS5sb2coYENvbm5lY3RlZCBhcyAke3VzZXIubmFtZX0uIFxcbiBTZXR0aW5nIHVwIHJvb21zLi4uYClcblxuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gdXNlclxuXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjaGF0a2l0VXNlcklkJywgdXNlci5pZClcblxuICAgICAgICAvLyBJZiB1c2VyIGhhcyBubyByb29tcyB0aGVuIHJldHVyblxuICAgICAgICBpZiAodXNlci5yb29tcy5sZW5ndGgpIHtcbiAgICAgICAgICAgY29uc29sZS5sb2coJ3N1YnNjcmliaW5nIHRvIGFsbCByb29tcycpXG4gICAgICAgICAgIFxuICAgICAgICAgIC8vIFN1YnNjcmliZSB0byBhbGwgdXNlciByb29tcyB0byBiZSBub3RpZmllZCBvZiBuZXcgbWVzc2FnZXNcbiAgICAgICAgICB0aGlzLnN1YnNjcmliZVRvQWxsUm9vbXMoKVxuXG4gICAgICAgICAgLy8gSm9pbiB0aGUgbGF0ZXN0IHJvb21cblxuICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXIpXG5cbiAgICAgICAgICBjb25zdCBsYXRlc3RSb29tID0gdGhpcy5nZXRMYXRlc3RSb29tKHVzZXIpXG4gICAgICAgICAgY29uc29sZS5sb2cobGF0ZXN0Um9vbSlcblxuICAgICAgICAgIHRoaXMuam9pblJvb20odXNlciwgbGF0ZXN0Um9vbS5pZClcbiAgICAgICAgICAvLyB0aGlzLmdldExhdGVzdFJvb20odXNlcikudGhlbigocm9vbSkgPT4ge1xuICAgICAgICAgIC8vICAgdGhpcy5qb2luUm9vbSh1c2VyLCByb29tLmlkKTtcbiAgICAgICAgICAvLyB9KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcmV0dXJuIHVzZXJcbiAgICAgIH0pXG4gIH1cbn1cbiJdfQ==