"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var Subscription_1 = require("../Subscription");
var SubscriptionLoggable_1 = require("./SubscriptionLoggable");
var applyMixins_1 = require("../util/applyMixins");
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ColdObservable = /** @class */ (function (_super) {
    __extends(ColdObservable, _super);
    function ColdObservable(messages, scheduler) {
        var _this = _super.call(this, function (subscriber) {
            var observable = this;
            var index = observable.logSubscribedFrame();
            var subscription = new Subscription_1.Subscription();
            subscription.add(new Subscription_1.Subscription(function () {
                observable.logUnsubscribedFrame(index);
            }));
            observable.scheduleMessages(subscriber);
            return subscription;
        }) || this;
        _this.messages = messages;
        _this.subscriptions = [];
        _this.scheduler = scheduler;
        return _this;
    }
    ColdObservable.prototype.scheduleMessages = function (subscriber) {
        var messagesLength = this.messages.length;
        for (var i = 0; i < messagesLength; i++) {
            var message = this.messages[i];
            subscriber.add(this.scheduler.schedule(function (_a) {
                var message = _a.message, subscriber = _a.subscriber;
                message.notification.observe(subscriber);
            }, message.frame, { message: message, subscriber: subscriber }));
        }
    };
    return ColdObservable;
}(Observable_1.Observable));
exports.ColdObservable = ColdObservable;
applyMixins_1.applyMixins(ColdObservable, [SubscriptionLoggable_1.SubscriptionLoggable]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sZE9ic2VydmFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3Rlc3RpbmcvQ29sZE9ic2VydmFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFDM0MsZ0RBQStDO0FBSS9DLCtEQUE4RDtBQUM5RCxtREFBa0Q7QUFHbEQ7Ozs7R0FJRztBQUNIO0lBQXVDLGtDQUFhO0lBTWxELHdCQUFtQixRQUF1QixFQUM5QixTQUFvQjtRQURoQyxZQUVFLGtCQUFNLFVBQStCLFVBQTJCO1lBQzlELElBQU0sVUFBVSxHQUFzQixJQUFXLENBQUM7WUFDbEQsSUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDOUMsSUFBTSxZQUFZLEdBQUcsSUFBSSwyQkFBWSxFQUFFLENBQUM7WUFDeEMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLDJCQUFZLENBQUM7Z0JBQ2hDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0osVUFBVSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hDLE9BQU8sWUFBWSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxTQUVIO1FBYmtCLGNBQVEsR0FBUixRQUFRLENBQWU7UUFMbkMsbUJBQWEsR0FBc0IsRUFBRSxDQUFDO1FBaUIzQyxLQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQzs7SUFDN0IsQ0FBQztJQUVELHlDQUFnQixHQUFoQixVQUFpQixVQUEyQjtRQUMxQyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUM1QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsVUFBVSxDQUFDLEdBQUcsQ0FDWixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFDLEVBQXVCO29CQUFyQixvQkFBTyxFQUFFLDBCQUFVO2dCQUFTLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxFQUNoRyxPQUFPLENBQUMsS0FBSyxFQUNiLEVBQUUsT0FBTyxTQUFBLEVBQUUsVUFBVSxZQUFBLEVBQUUsQ0FBQyxDQUMzQixDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBaENELENBQXVDLHVCQUFVLEdBZ0NoRDtBQWhDWSx3Q0FBYztBQWlDM0IseUJBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQywyQ0FBb0IsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgU2NoZWR1bGVyIH0gZnJvbSAnLi4vU2NoZWR1bGVyJztcbmltcG9ydCB7IFRlc3RNZXNzYWdlIH0gZnJvbSAnLi9UZXN0TWVzc2FnZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25Mb2cgfSBmcm9tICcuL1N1YnNjcmlwdGlvbkxvZyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25Mb2dnYWJsZSB9IGZyb20gJy4vU3Vic2NyaXB0aW9uTG9nZ2FibGUnO1xuaW1wb3J0IHsgYXBwbHlNaXhpbnMgfSBmcm9tICcuLi91dGlsL2FwcGx5TWl4aW5zJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBDb2xkT2JzZXJ2YWJsZTxUPiBleHRlbmRzIE9ic2VydmFibGU8VD4gaW1wbGVtZW50cyBTdWJzY3JpcHRpb25Mb2dnYWJsZSB7XG4gIHB1YmxpYyBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25Mb2dbXSA9IFtdO1xuICBzY2hlZHVsZXI6IFNjaGVkdWxlcjtcbiAgbG9nU3Vic2NyaWJlZEZyYW1lOiAoKSA9PiBudW1iZXI7XG4gIGxvZ1Vuc3Vic2NyaWJlZEZyYW1lOiAoaW5kZXg6IG51bWJlcikgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbWVzc2FnZXM6IFRlc3RNZXNzYWdlW10sXG4gICAgICAgICAgICAgIHNjaGVkdWxlcjogU2NoZWR1bGVyKSB7XG4gICAgc3VwZXIoZnVuY3Rpb24gKHRoaXM6IE9ic2VydmFibGU8VD4sIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55Pikge1xuICAgICAgY29uc3Qgb2JzZXJ2YWJsZTogQ29sZE9ic2VydmFibGU8VD4gPSB0aGlzIGFzIGFueTtcbiAgICAgIGNvbnN0IGluZGV4ID0gb2JzZXJ2YWJsZS5sb2dTdWJzY3JpYmVkRnJhbWUoKTtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgIHN1YnNjcmlwdGlvbi5hZGQobmV3IFN1YnNjcmlwdGlvbigoKSA9PiB7XG4gICAgICAgIG9ic2VydmFibGUubG9nVW5zdWJzY3JpYmVkRnJhbWUoaW5kZXgpO1xuICAgICAgfSkpO1xuICAgICAgb2JzZXJ2YWJsZS5zY2hlZHVsZU1lc3NhZ2VzKHN1YnNjcmliZXIpO1xuICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9KTtcbiAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgfVxuXG4gIHNjaGVkdWxlTWVzc2FnZXMoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxhbnk+KSB7XG4gICAgY29uc3QgbWVzc2FnZXNMZW5ndGggPSB0aGlzLm1lc3NhZ2VzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc3NhZ2VzTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2VzW2ldO1xuICAgICAgc3Vic2NyaWJlci5hZGQoXG4gICAgICAgIHRoaXMuc2NoZWR1bGVyLnNjaGVkdWxlKCh7IG1lc3NhZ2UsIHN1YnNjcmliZXIgfSkgPT4geyBtZXNzYWdlLm5vdGlmaWNhdGlvbi5vYnNlcnZlKHN1YnNjcmliZXIpOyB9LFxuICAgICAgICAgIG1lc3NhZ2UuZnJhbWUsXG4gICAgICAgICAgeyBtZXNzYWdlLCBzdWJzY3JpYmVyIH0pXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuYXBwbHlNaXhpbnMoQ29sZE9ic2VydmFibGUsIFtTdWJzY3JpcHRpb25Mb2dnYWJsZV0pO1xuIl19