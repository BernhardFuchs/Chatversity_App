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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnaW5nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC9hcHAvQ29yZS9fc2VydmljZXMvbWVzc2FnaW5nLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBbUQ7QUFFbkQseURBQW9FO0FBRXBFLDZCQUFxRDtBQUNyRCw2Q0FBK0Q7QUFDL0QsMkVBQXFFO0FBTXJFO0lBbUJFLDBCQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBakI1QixrQkFBYSxHQUFHLElBQUksc0JBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQyxzQkFBaUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBS3RELGFBQVEsR0FBRyxFQUFFLENBQUM7UUFHZCxhQUFRLEdBQUcsRUFBRSxDQUFDO0lBUXlCLENBQUM7SUFQeEMsc0JBQUkscUNBQU87YUFBWDtZQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QixDQUFDO2FBQ0QsVUFBWSxLQUFhO1lBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLENBQUM7OztPQUhBO0lBU0QsRUFBRTtJQUNGLG1GQUFtRjtJQUNuRixFQUFFO0lBQ0EsZ0RBQXFCLEdBQXJCLFVBQXNCLEVBQW1CO1FBRXpDLElBQU0sT0FBTyxHQUFHLElBQUksa0JBQVcsQ0FBQztZQUM5QixjQUFjLEVBQUUsa0JBQWtCO1lBQ2xDLFFBQVEsRUFBRSxrQkFBa0I7U0FDN0IsQ0FBQyxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBSSw4QkFBVyxDQUFDLE1BQU0sdUNBQWtDLEVBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO0lBQ3hHLENBQUM7SUFDSCxvRUFB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RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFwSFUsZ0JBQWdCO1FBSDVCLGlCQUFVLENBQUM7WUFDVixVQUFVLEVBQUUsTUFBTTtTQUNuQixDQUFDO3lDQW9CMEIsaUJBQVU7T0FuQnpCLGdCQUFnQixDQXFINUI7SUFBRCx1QkFBQztDQUFBLEFBckhELElBcUhDO0FBckhZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBdXRoU2VydmljZX0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2hhdE1hbmFnZXIsIFRva2VuUHJvdmlkZXIgfSBmcm9tICdAcHVzaGVyL2NoYXRraXQtY2xpZW50JztcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi9fbW9kZWxzL3VzZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi8uLi8uLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQucHJvZCc7XG5cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTWVzc2FnaW5nU2VydmljZSB7XG5cbiAgcHJpdmF0ZSBub3RpZmljYXRpb25zID0gbmV3IEJlaGF2aW9yU3ViamVjdCgwKTtcbiAgbm90aWZpY2F0aW9uQ291bnQgPSB0aGlzLm5vdGlmaWNhdGlvbnMuYXNPYnNlcnZhYmxlKCk7XG5cbiAgY3VycmVudFVzZXI6IGFueTtcbiAgY2hhdE1hbmFnZXI6IGFueTtcbiAgY2hhdGtpdFVzZXI6IGFueTtcbiAgbWVzc2FnZXMgPSBbXTtcbiAgY3VycmVudFVzZXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBfbWVzc2FnZSA9ICcnO1xuICBnZXQgbWVzc2FnZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9tZXNzYWdlO1xuICB9XG4gIHNldCBtZXNzYWdlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9tZXNzYWdlID0gdmFsdWU7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHt9XG5cblxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBHRVQgQUxMIE9GIEEgVVNFUlMgUkVBRCBDVVJTT1JTIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICAgIGdldFJlYWRDdXJzb3JzRm9yVXNlcihpZDogbnVtYmVyIHwgc3RyaW5nKSB7XG5cbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9jaGF0a2l0L2dldFJlYWRDdXJzb3JzRm9yVXNlci8ke2lkfWAsIHtoZWFkZXJzOiBoZWFkZXJzfSk7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuXG5cbiAgaW5pdGlhbGl6ZSh1c2VySWQpIHtcbiAgICB0aGlzLmNoYXRNYW5hZ2VyID0gbmV3IENoYXRNYW5hZ2VyKHtcbiAgICAgIGluc3RhbmNlTG9jYXRvcjogJ3YxOnVzMTphNTRiZGYxMi05M2Q2LTQ2ZjktYmUzYi1iZmE4Mzc5MTdmYjUnLFxuICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICB0b2tlblByb3ZpZGVyOiBuZXcgVG9rZW5Qcm92aWRlcih7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vdXMxLnB1c2hlcnBsYXRmb3JtLmlvL3NlcnZpY2VzL2NoYXRraXRfdG9rZW5fcHJvdmlkZXIvdjEvYTU0YmRmMTItOTNkNi00NmY5LWJlM2ItYmZhODM3OTE3ZmI1L3Rva2VuJ1xuICAgICAgfSlcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLmNoYXRNYW5hZ2VyLmNvbm5lY3QoKS50aGVuKHVzZXIgPT4ge1xuICAgICAgcmV0dXJuIHVzZXI7XG4gICAgfSk7XG4gIH1cblxuICBzZXRSb29tc1dpdGhOb3RpZmljYXRpb25zKGNvdW50KSB7XG4gICAgLy8gR2V0IGN1cnJlbnQgbm90aWZpY2F0aW9uIGNvdW50XG4gICAgY29uc3QgY3Vyck5vdGlmaWNhdGlvbkNvdW50ID0gdGhpcy5ub3RpZmljYXRpb25zLnZhbHVlO1xuICAgIC8vIFVwZGF0ZSB0aGUgZ2xvYmFibCB0b3RhbFxuICAgIHRoaXMubm90aWZpY2F0aW9ucy5uZXh0KGNvdW50KTtcbiAgfVxuXG5cbiAgLy8gU2VuZCBhIG1lc3NhZ2VcbiAgc2VuZE1lc3NhZ2Uocm9vbSwgbWVzc2FnZSkge1xuICAgIHRoaXMuY2hhdGtpdFVzZXIuc2VuZFNpbXBsZU1lc3NhZ2Uoe1xuICAgICAgcm9vbUlkOiByb29tLmlkLFxuICAgICAgdGV4dDogJ0hpIHRoZXJlIScsXG4gICAgfSlcbiAgICAudGhlbihtZXNzYWdlSWQgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coYEFkZGVkIG1lc3NhZ2UgdG8gJHtteVJvb20ubmFtZX1gKTtcbiAgICAgIGNvbnNvbGUubG9nKGBBZGRlZCBtZXNzYWdlIHRvICR7cm9vbS5uYW1lfWApO1xuICAgIH0pXG4gICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhgRXJyb3IgYWRkaW5nIG1lc3NhZ2UgdG8gJHtteVJvb20ubmFtZX06ICR7ZXJyfWApO1xuICAgICAgY29uc29sZS5sb2coYEVycm9yIGFkZGluZyBtZXNzYWdlIHRvICR7cm9vbS5uYW1lfTogJHtlcnJ9YCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBKb2luIGEgcm9vbVxuICBqb2luUm9vbShyb29tSUQpIHtcbiAgICByZXR1cm4gdGhpcy5jaGF0a2l0VXNlci5qb2luUm9vbSggeyByb29tSWQ6IHJvb21JRCB9IClcbiAgICAudGhlbihyb29tID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGBKb2luZWQgcm9vbSB3aXRoIElEOiAke3Jvb20uaWR9YCk7XG4gICAgICAvLyBTdWJzY3JpYmUgdG8gcm9vbSB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnNcbiAgICAgIHJldHVybiByb29tO1xuICAgIH0pXG4gICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgRXJyb3Igam9pbmluZyByb29tICR7cm9vbUlEfTogJHtlcnJ9YCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBTdWJzY3JpYmUgdG8gcm9vbVxuICBzdWJzY3JpYmVUb1Jvb20ocm9vbUlEKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhdGtpdFVzZXIuc3Vic2NyaWJlVG9Sb29tTXVsdGlwYXJ0KHtcbiAgICAgIHJvb21JZDogcm9vbUlELFxuICAgICAgaG9va3M6IHtcbiAgICAgICAgb25NZXNzYWdlOiBtZXNzYWdlID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygncmVjZWl2ZWQgbWVzc2FnZScsIG1lc3NhZ2UpO1xuICAgICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbWVzc2FnZUxpbWl0OiAxMFxuICAgIH0pO1xuICB9XG5cbiAgLy8gRmV0Y2ggbWVzc2FnZXMgZnJvbSByb29tXG4gIGZldGNoTWVzc2FnZXMocm9vbUlEKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhdGtpdFVzZXJcbiAgICAuZmV0Y2hNdWx0aXBhcnRNZXNzYWdlcyhcbiAgICB7XG4gICAgICByb29tSWQ6IHJvb21JRCxcbiAgICAgIGRpcmVjdGlvbjogJ29sZGVyJyxcbiAgICAgIGxpbWl0OiAxMCxcbiAgICB9KVxuICAgIC50aGVuKG1lc3NhZ2VzID0+IG1lc3NhZ2VzIClcbiAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBmZXRjaGluZyBtZXNzYWdlczogJHtlcnJ9YCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==