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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnaW5nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL0NvcmUvX3NlcnZpY2VzL21lc3NhZ2luZy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQW1EO0FBRW5ELHlEQUFvRTtBQUVwRSw2QkFBcUQ7QUFDckQsNkNBQStEO0FBQy9ELDJFQUFxRTtBQU1yRTtJQW1CRSwwQkFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQWpCNUIsa0JBQWEsR0FBRyxJQUFJLHNCQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0Msc0JBQWlCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUt0RCxhQUFRLEdBQUcsRUFBRSxDQUFDO1FBR2QsYUFBUSxHQUFHLEVBQUUsQ0FBQztJQVF5QixDQUFDO0lBUHhDLHNCQUFJLHFDQUFPO2FBQVg7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQzthQUNELFVBQVksS0FBYTtZQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN4QixDQUFDOzs7T0FIQTtJQVNELEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUNBLGdEQUFxQixHQUFyQixVQUFzQixFQUFtQjtRQUV6QyxJQUFNLE9BQU8sR0FBRyxJQUFJLGtCQUFXLENBQUM7WUFDOUIsY0FBYyxFQUFFLGtCQUFrQjtZQUNsQyxRQUFRLEVBQUUsa0JBQWtCO1NBQzdCLENBQUMsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUksOEJBQVcsQ0FBQyxNQUFNLHVDQUFrQyxFQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztJQUN4RyxDQUFDO0lBQ0gsb0VBQW9FO0lBSXBFLHFDQUFVLEdBQVYsVUFBVyxNQUFNO1FBQ2YsSUFB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QjtRQUg1QixpQkFBVSxDQUFDO1lBQ1YsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FBQzt5Q0FvQjBCLGlCQUFVO09BbkJ6QixnQkFBZ0IsQ0FxSDVCO0lBQUQsdUJBQUM7Q0FBQSxBQXJIRCxJQXFIQztBQXJIWSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QXV0aFNlcnZpY2V9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IENoYXRNYW5hZ2VyLCBUb2tlblByb3ZpZGVyIH0gZnJvbSAnQHB1c2hlci9jaGF0a2l0LWNsaWVudCc7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi4vX21vZGVscy91c2VyJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vLi4vLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50LnByb2QnO1xuXG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2luZ1NlcnZpY2Uge1xuXG4gIHByaXZhdGUgbm90aWZpY2F0aW9ucyA9IG5ldyBCZWhhdmlvclN1YmplY3QoMCk7XG4gIG5vdGlmaWNhdGlvbkNvdW50ID0gdGhpcy5ub3RpZmljYXRpb25zLmFzT2JzZXJ2YWJsZSgpO1xuXG4gIGN1cnJlbnRVc2VyOiBhbnk7XG4gIGNoYXRNYW5hZ2VyOiBhbnk7XG4gIGNoYXRraXRVc2VyOiBhbnk7XG4gIG1lc3NhZ2VzID0gW107XG4gIGN1cnJlbnRVc2VyU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgX21lc3NhZ2UgPSAnJztcbiAgZ2V0IG1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZTtcbiAgfVxuICBzZXQgbWVzc2FnZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fbWVzc2FnZSA9IHZhbHVlO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7fVxuXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgR0VUIEFMTCBPRiBBIFVTRVJTIFJFQUQgQ1VSU09SUyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cbiAgICBnZXRSZWFkQ3Vyc29yc0ZvclVzZXIoaWQ6IG51bWJlciB8IHN0cmluZykge1xuXG4gICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGAke2Vudmlyb25tZW50LmFwaVVybH0vY2hhdGtpdC9nZXRSZWFkQ3Vyc29yc0ZvclVzZXIvJHtpZH1gLCB7aGVhZGVyczogaGVhZGVyc30pO1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuXG4gIGluaXRpYWxpemUodXNlcklkKSB7XG4gICAgdGhpcy5jaGF0TWFuYWdlciA9IG5ldyBDaGF0TWFuYWdlcih7XG4gICAgICBpbnN0YW5jZUxvY2F0b3I6ICd2MTp1czE6YTU0YmRmMTItOTNkNi00NmY5LWJlM2ItYmZhODM3OTE3ZmI1JyxcbiAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgdG9rZW5Qcm92aWRlcjogbmV3IFRva2VuUHJvdmlkZXIoe1xuICAgICAgICB1cmw6ICdodHRwczovL3VzMS5wdXNoZXJwbGF0Zm9ybS5pby9zZXJ2aWNlcy9jaGF0a2l0X3Rva2VuX3Byb3ZpZGVyL3YxL2E1NGJkZjEyLTkzZDYtNDZmOS1iZTNiLWJmYTgzNzkxN2ZiNS90b2tlbidcbiAgICAgIH0pXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5jaGF0TWFuYWdlci5jb25uZWN0KCkudGhlbih1c2VyID0+IHtcbiAgICAgIHJldHVybiB1c2VyO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0Um9vbXNXaXRoTm90aWZpY2F0aW9ucyhjb3VudCkge1xuICAgIC8vIEdldCBjdXJyZW50IG5vdGlmaWNhdGlvbiBjb3VudFxuICAgIGNvbnN0IGN1cnJOb3RpZmljYXRpb25Db3VudCA9IHRoaXMubm90aWZpY2F0aW9ucy52YWx1ZTtcbiAgICAvLyBVcGRhdGUgdGhlIGdsb2JhYmwgdG90YWxcbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMubmV4dChjb3VudCk7XG4gIH1cblxuXG4gIC8vIFNlbmQgYSBtZXNzYWdlXG4gIHNlbmRNZXNzYWdlKHJvb20sIG1lc3NhZ2UpIHtcbiAgICB0aGlzLmNoYXRraXRVc2VyLnNlbmRTaW1wbGVNZXNzYWdlKHtcbiAgICAgIHJvb21JZDogcm9vbS5pZCxcbiAgICAgIHRleHQ6ICdIaSB0aGVyZSEnLFxuICAgIH0pXG4gICAgLnRoZW4obWVzc2FnZUlkID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGBBZGRlZCBtZXNzYWdlIHRvICR7bXlSb29tLm5hbWV9YCk7XG4gICAgICBjb25zb2xlLmxvZyhgQWRkZWQgbWVzc2FnZSB0byAke3Jvb20ubmFtZX1gKTtcbiAgICB9KVxuICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coYEVycm9yIGFkZGluZyBtZXNzYWdlIHRvICR7bXlSb29tLm5hbWV9OiAke2Vycn1gKTtcbiAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBhZGRpbmcgbWVzc2FnZSB0byAke3Jvb20ubmFtZX06ICR7ZXJyfWApO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gSm9pbiBhIHJvb21cbiAgam9pblJvb20ocm9vbUlEKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhdGtpdFVzZXIuam9pblJvb20oIHsgcm9vbUlkOiByb29tSUQgfSApXG4gICAgLnRoZW4ocm9vbSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgSm9pbmVkIHJvb20gd2l0aCBJRDogJHtyb29tLmlkfWApO1xuICAgICAgLy8gU3Vic2NyaWJlIHRvIHJvb20gdG8gcmVjZWl2ZSBub3RpZmljYXRpb25zXG4gICAgICByZXR1cm4gcm9vbTtcbiAgICB9KVxuICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coYEVycm9yIGpvaW5pbmcgcm9vbSAke3Jvb21JRH06ICR7ZXJyfWApO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gU3Vic2NyaWJlIHRvIHJvb21cbiAgc3Vic2NyaWJlVG9Sb29tKHJvb21JRCkge1xuICAgIHJldHVybiB0aGlzLmNoYXRraXRVc2VyLnN1YnNjcmliZVRvUm9vbU11bHRpcGFydCh7XG4gICAgICByb29tSWQ6IHJvb21JRCxcbiAgICAgIGhvb2tzOiB7XG4gICAgICAgIG9uTWVzc2FnZTogbWVzc2FnZSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3JlY2VpdmVkIG1lc3NhZ2UnLCBtZXNzYWdlKTtcbiAgICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1lc3NhZ2VMaW1pdDogMTBcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEZldGNoIG1lc3NhZ2VzIGZyb20gcm9vbVxuICBmZXRjaE1lc3NhZ2VzKHJvb21JRCkge1xuICAgIHJldHVybiB0aGlzLmNoYXRraXRVc2VyXG4gICAgLmZldGNoTXVsdGlwYXJ0TWVzc2FnZXMoXG4gICAge1xuICAgICAgcm9vbUlkOiByb29tSUQsXG4gICAgICBkaXJlY3Rpb246ICdvbGRlcicsXG4gICAgICBsaW1pdDogMTAsXG4gICAgfSlcbiAgICAudGhlbihtZXNzYWdlcyA9PiBtZXNzYWdlcyApXG4gICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgRXJyb3IgZmV0Y2hpbmcgbWVzc2FnZXM6ICR7ZXJyfWApO1xuICAgIH0pO1xuICB9XG59XG4iXX0=