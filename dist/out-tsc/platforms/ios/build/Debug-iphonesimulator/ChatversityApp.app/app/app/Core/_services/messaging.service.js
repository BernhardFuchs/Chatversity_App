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
        this.notifications = new rxjs_1.BehaviorSubject(0);
        this.notificationCount = this.notifications.asObservable();
        this.messages = [];
        this._message = '';
    }
    Object.defineProperty(MessagingService.prototype, "message", {
        get: function () {
            return this._message;
        },
        set: function (value) {
            this._message = value;
        },
        enumerable: true,
        configurable: true
    });
    //
    // ─── GET ALL OF A USERS READ CURSORS ────────────────────────────────────────────
    //
    MessagingService.prototype.getReadCursorsForUser = function (id) {
        var headers = new http_1.HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });
        return this.http.get(environment_prod_1.environment.apiUrl + "/chatkit/getReadCursorsForUser/" + id, { headers: headers });
    };
    // ─────────────────────────────────────────────────────────────────
    MessagingService.prototype.initialize = function (userId) {
        this.chatManager = new chatkit_client_1.ChatManager({
            instanceLocator: 'v1:us1:a54bdf12-93d6-46f9-be3b-bfa837917fb5',
            userId: userId,
            tokenProvider: new chatkit_client_1.TokenProvider({
                url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a54bdf12-93d6-46f9-be3b-bfa837917fb5/token'
            })
        });
        return this.chatManager.connect().then(function (user) {
            return user;
        });
    };
    MessagingService.prototype.setRoomsWithNotifications = function (count) {
        // Get current notification count
        var currNotificationCount = this.notifications.value;
        // Update the globabl total
        this.notifications.next(count);
    };
    // Send a message
    MessagingService.prototype.sendMessage = function (room, message) {
        this.chatkitUser.sendSimpleMessage({
            roomId: room.id,
            text: 'Hi there!',
        })
            .then(function (messageId) {
            // console.log(`Added message to ${myRoom.name}`);
            console.log("Added message to " + room.name);
        })
            .catch(function (err) {
            // console.log(`Error adding message to ${myRoom.name}: ${err}`);
            console.log("Error adding message to " + room.name + ": " + err);
        });
    };
    // Join a room
    MessagingService.prototype.joinRoom = function (roomID) {
        return this.chatkitUser.joinRoom({ roomId: roomID })
            .then(function (room) {
            console.log("Joined room with ID: " + room.id);
            // Subscribe to room to receive notifications
            return room;
        })
            .catch(function (err) {
            console.log("Error joining room " + roomID + ": " + err);
        });
    };
    // Subscribe to room
    MessagingService.prototype.subscribeToRoom = function (roomID) {
        return this.chatkitUser.subscribeToRoomMultipart({
            roomId: roomID,
            hooks: {
                onMessage: function (message) {
                    console.log('received message', message);
                    return message;
                }
            },
            messageLimit: 10
        });
    };
    // Fetch messages from room
    MessagingService.prototype.fetchMessages = function (roomID) {
        return this.chatkitUser
            .fetchMultipartMessages({
            roomId: roomID,
            direction: 'older',
            limit: 10,
        })
            .then(function (messages) { return messages; })
            .catch(function (err) {
            console.log("Error fetching messages: " + err);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnaW5nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL2FwcC9Db3JlL19zZXJ2aWNlcy9tZXNzYWdpbmcuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFtRDtBQUVuRCx5REFBb0U7QUFFcEUsNkJBQXFEO0FBQ3JELDZDQUErRDtBQUMvRCwyRUFBcUU7QUFNckU7SUFtQkUsMEJBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7UUFqQjVCLGtCQUFhLEdBQUcsSUFBSSxzQkFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLHNCQUFpQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7UUFLdEQsYUFBUSxHQUFHLEVBQUUsQ0FBQztRQUdkLGFBQVEsR0FBRyxFQUFFLENBQUM7SUFReUIsQ0FBQztJQVB4QyxzQkFBSSxxQ0FBTzthQUFYO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7YUFDRCxVQUFZLEtBQWE7WUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDeEIsQ0FBQzs7O09BSEE7SUFTRCxFQUFFO0lBQ0YsbUZBQW1GO0lBQ25GLEVBQUU7SUFDQSxnREFBcUIsR0FBckIsVUFBc0IsRUFBbUI7UUFFekMsSUFBTSxPQUFPLEdBQUcsSUFBSSxrQkFBVyxDQUFDO1lBQzlCLGNBQWMsRUFBRSxrQkFBa0I7WUFDbEMsUUFBUSxFQUFFLGtCQUFrQjtTQUM3QixDQUFDLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFJLDhCQUFXLENBQUMsTUFBTSx1Q0FBa0MsRUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLE9B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QyxHQUFHLENBQUMsOEJBQTRCLEdBQUssQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQXBIVSxnQkFBZ0I7UUFINUIsaUJBQVUsQ0FBQztZQUNWLFVBQVUsRUFBRSxNQUFNO1NBQ25CLENBQUM7eUNBb0IwQixpQkFBVTtPQW5CekIsZ0JBQWdCLENBcUg1QjtJQUFELHVCQUFDO0NBQUEsQUFySEQsSUFxSEM7QUFySFksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0F1dGhTZXJ2aWNlfSBmcm9tICcuL2F1dGguc2VydmljZSc7XG5pbXBvcnQgeyBDaGF0TWFuYWdlciwgVG9rZW5Qcm92aWRlciB9IGZyb20gJ0BwdXNoZXIvY2hhdGtpdC1jbGllbnQnO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uL19tb2RlbHMvdXNlcic7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uLy4uLy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudC5wcm9kJztcblxuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBNZXNzYWdpbmdTZXJ2aWNlIHtcblxuICBwcml2YXRlIG5vdGlmaWNhdGlvbnMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KDApO1xuICBub3RpZmljYXRpb25Db3VudCA9IHRoaXMubm90aWZpY2F0aW9ucy5hc09ic2VydmFibGUoKTtcblxuICBjdXJyZW50VXNlcjogYW55O1xuICBjaGF0TWFuYWdlcjogYW55O1xuICBjaGF0a2l0VXNlcjogYW55O1xuICBtZXNzYWdlcyA9IFtdO1xuICBjdXJyZW50VXNlclN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIF9tZXNzYWdlID0gJyc7XG4gIGdldCBtZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX21lc3NhZ2U7XG4gIH1cbiAgc2V0IG1lc3NhZ2UodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX21lc3NhZ2UgPSB2YWx1ZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge31cblxuXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEdFVCBBTEwgT0YgQSBVU0VSUyBSRUFEIENVUlNPUlMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG4gICAgZ2V0UmVhZEN1cnNvcnNGb3JVc2VyKGlkOiBudW1iZXIgfCBzdHJpbmcpIHtcblxuICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5odHRwLmdldChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2NoYXRraXQvZ2V0UmVhZEN1cnNvcnNGb3JVc2VyLyR7aWR9YCwge2hlYWRlcnM6IGhlYWRlcnN9KTtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5cblxuICBpbml0aWFsaXplKHVzZXJJZCkge1xuICAgIHRoaXMuY2hhdE1hbmFnZXIgPSBuZXcgQ2hhdE1hbmFnZXIoe1xuICAgICAgaW5zdGFuY2VMb2NhdG9yOiAndjE6dXMxOmE1NGJkZjEyLTkzZDYtNDZmOS1iZTNiLWJmYTgzNzkxN2ZiNScsXG4gICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgIHRva2VuUHJvdmlkZXI6IG5ldyBUb2tlblByb3ZpZGVyKHtcbiAgICAgICAgdXJsOiAnaHR0cHM6Ly91czEucHVzaGVycGxhdGZvcm0uaW8vc2VydmljZXMvY2hhdGtpdF90b2tlbl9wcm92aWRlci92MS9hNTRiZGYxMi05M2Q2LTQ2ZjktYmUzYi1iZmE4Mzc5MTdmYjUvdG9rZW4nXG4gICAgICB9KVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuY2hhdE1hbmFnZXIuY29ubmVjdCgpLnRoZW4odXNlciA9PiB7XG4gICAgICByZXR1cm4gdXNlcjtcbiAgICB9KTtcbiAgfVxuXG4gIHNldFJvb21zV2l0aE5vdGlmaWNhdGlvbnMoY291bnQpIHtcbiAgICAvLyBHZXQgY3VycmVudCBub3RpZmljYXRpb24gY291bnRcbiAgICBjb25zdCBjdXJyTm90aWZpY2F0aW9uQ291bnQgPSB0aGlzLm5vdGlmaWNhdGlvbnMudmFsdWU7XG4gICAgLy8gVXBkYXRlIHRoZSBnbG9iYWJsIHRvdGFsXG4gICAgdGhpcy5ub3RpZmljYXRpb25zLm5leHQoY291bnQpO1xuICB9XG5cblxuICAvLyBTZW5kIGEgbWVzc2FnZVxuICBzZW5kTWVzc2FnZShyb29tLCBtZXNzYWdlKSB7XG4gICAgdGhpcy5jaGF0a2l0VXNlci5zZW5kU2ltcGxlTWVzc2FnZSh7XG4gICAgICByb29tSWQ6IHJvb20uaWQsXG4gICAgICB0ZXh0OiAnSGkgdGhlcmUhJyxcbiAgICB9KVxuICAgIC50aGVuKG1lc3NhZ2VJZCA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhgQWRkZWQgbWVzc2FnZSB0byAke215Um9vbS5uYW1lfWApO1xuICAgICAgY29uc29sZS5sb2coYEFkZGVkIG1lc3NhZ2UgdG8gJHtyb29tLm5hbWV9YCk7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGBFcnJvciBhZGRpbmcgbWVzc2FnZSB0byAke215Um9vbS5uYW1lfTogJHtlcnJ9YCk7XG4gICAgICBjb25zb2xlLmxvZyhgRXJyb3IgYWRkaW5nIG1lc3NhZ2UgdG8gJHtyb29tLm5hbWV9OiAke2Vycn1gKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEpvaW4gYSByb29tXG4gIGpvaW5Sb29tKHJvb21JRCkge1xuICAgIHJldHVybiB0aGlzLmNoYXRraXRVc2VyLmpvaW5Sb29tKCB7IHJvb21JZDogcm9vbUlEIH0gKVxuICAgIC50aGVuKHJvb20gPT4ge1xuICAgICAgY29uc29sZS5sb2coYEpvaW5lZCByb29tIHdpdGggSUQ6ICR7cm9vbS5pZH1gKTtcbiAgICAgIC8vIFN1YnNjcmliZSB0byByb29tIHRvIHJlY2VpdmUgbm90aWZpY2F0aW9uc1xuICAgICAgcmV0dXJuIHJvb207XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBqb2luaW5nIHJvb20gJHtyb29tSUR9OiAke2Vycn1gKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFN1YnNjcmliZSB0byByb29tXG4gIHN1YnNjcmliZVRvUm9vbShyb29tSUQpIHtcbiAgICByZXR1cm4gdGhpcy5jaGF0a2l0VXNlci5zdWJzY3JpYmVUb1Jvb21NdWx0aXBhcnQoe1xuICAgICAgcm9vbUlkOiByb29tSUQsXG4gICAgICBob29rczoge1xuICAgICAgICBvbk1lc3NhZ2U6IG1lc3NhZ2UgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWNlaXZlZCBtZXNzYWdlJywgbWVzc2FnZSk7XG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBtZXNzYWdlTGltaXQ6IDEwXG4gICAgfSk7XG4gIH1cblxuICAvLyBGZXRjaCBtZXNzYWdlcyBmcm9tIHJvb21cbiAgZmV0Y2hNZXNzYWdlcyhyb29tSUQpIHtcbiAgICByZXR1cm4gdGhpcy5jaGF0a2l0VXNlclxuICAgIC5mZXRjaE11bHRpcGFydE1lc3NhZ2VzKFxuICAgIHtcbiAgICAgIHJvb21JZDogcm9vbUlELFxuICAgICAgZGlyZWN0aW9uOiAnb2xkZXInLFxuICAgICAgbGltaXQ6IDEwLFxuICAgIH0pXG4gICAgLnRoZW4obWVzc2FnZXMgPT4gbWVzc2FnZXMgKVxuICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coYEVycm9yIGZldGNoaW5nIG1lc3NhZ2VzOiAke2Vycn1gKTtcbiAgICB9KTtcbiAgfVxufVxuIl19