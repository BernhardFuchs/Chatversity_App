"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subject_1 = require("../Subject");
var Subscription_1 = require("../Subscription");
var SubscriptionLoggable_1 = require("./SubscriptionLoggable");
var applyMixins_1 = require("../util/applyMixins");
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var HotObservable = /** @class */ (function (_super) {
    __extends(HotObservable, _super);
    function HotObservable(messages, scheduler) {
        var _this = _super.call(this) || this;
        _this.messages = messages;
        _this.subscriptions = [];
        _this.scheduler = scheduler;
        return _this;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    HotObservable.prototype._subscribe = function (subscriber) {
        var subject = this;
        var index = subject.logSubscribedFrame();
        var subscription = new Subscription_1.Subscription();
        subscription.add(new Subscription_1.Subscription(function () {
            subject.logUnsubscribedFrame(index);
        }));
        subscription.add(_super.prototype._subscribe.call(this, subscriber));
        return subscription;
    };
    HotObservable.prototype.setup = function () {
        var subject = this;
        var messagesLength = subject.messages.length;
        /* tslint:disable:no-var-keyword */
        for (var i = 0; i < messagesLength; i++) {
            (function () {
                var message = subject.messages[i];
                /* tslint:enable */
                subject.scheduler.schedule(function () { message.notification.observe(subject); }, message.frame);
            })();
        }
    };
    return HotObservable;
}(Subject_1.Subject));
exports.HotObservable = HotObservable;
applyMixins_1.applyMixins(HotObservable, [SubscriptionLoggable_1.SubscriptionLoggable]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG90T2JzZXJ2YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvdGVzdGluZy9Ib3RPYnNlcnZhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXFDO0FBRXJDLGdEQUErQztBQUkvQywrREFBOEQ7QUFDOUQsbURBQWtEO0FBRWxEOzs7O0dBSUc7QUFDSDtJQUFzQyxpQ0FBVTtJQU05Qyx1QkFBbUIsUUFBdUIsRUFDOUIsU0FBb0I7UUFEaEMsWUFFRSxpQkFBTyxTQUVSO1FBSmtCLGNBQVEsR0FBUixRQUFRLENBQWU7UUFMbkMsbUJBQWEsR0FBc0IsRUFBRSxDQUFDO1FBUTNDLEtBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDOztJQUM3QixDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLGtDQUFVLEdBQVYsVUFBVyxVQUEyQjtRQUNwQyxJQUFNLE9BQU8sR0FBcUIsSUFBSSxDQUFDO1FBQ3ZDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzNDLElBQU0sWUFBWSxHQUFHLElBQUksMkJBQVksRUFBRSxDQUFDO1FBQ3hDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSwyQkFBWSxDQUFDO1lBQ2hDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ0osWUFBWSxDQUFDLEdBQUcsQ0FBQyxpQkFBTSxVQUFVLFlBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMvQyxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBRUQsNkJBQUssR0FBTDtRQUNFLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUMvQyxtQ0FBbUM7UUFDbkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxDQUFDO2dCQUNDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLG1CQUFtQjtnQkFDZCxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FDeEIsY0FBUSxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDaEQsT0FBTyxDQUFDLEtBQUssQ0FDZCxDQUFDO1lBQ0osQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNOO0lBQ0gsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQXZDRCxDQUFzQyxpQkFBTyxHQXVDNUM7QUF2Q1ksc0NBQWE7QUF3QzFCLHlCQUFXLENBQUMsYUFBYSxFQUFFLENBQUMsMkNBQW9CLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4uL1NjaGVkdWxlcic7XG5pbXBvcnQgeyBUZXN0TWVzc2FnZSB9IGZyb20gJy4vVGVzdE1lc3NhZ2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTG9nIH0gZnJvbSAnLi9TdWJzY3JpcHRpb25Mb2cnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTG9nZ2FibGUgfSBmcm9tICcuL1N1YnNjcmlwdGlvbkxvZ2dhYmxlJztcbmltcG9ydCB7IGFwcGx5TWl4aW5zIH0gZnJvbSAnLi4vdXRpbC9hcHBseU1peGlucyc7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgSG90T2JzZXJ2YWJsZTxUPiBleHRlbmRzIFN1YmplY3Q8VD4gaW1wbGVtZW50cyBTdWJzY3JpcHRpb25Mb2dnYWJsZSB7XG4gIHB1YmxpYyBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25Mb2dbXSA9IFtdO1xuICBzY2hlZHVsZXI6IFNjaGVkdWxlcjtcbiAgbG9nU3Vic2NyaWJlZEZyYW1lOiAoKSA9PiBudW1iZXI7XG4gIGxvZ1Vuc3Vic2NyaWJlZEZyYW1lOiAoaW5kZXg6IG51bWJlcikgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbWVzc2FnZXM6IFRlc3RNZXNzYWdlW10sXG4gICAgICAgICAgICAgIHNjaGVkdWxlcjogU2NoZWR1bGVyKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGFueT4pOiBTdWJzY3JpcHRpb24ge1xuICAgIGNvbnN0IHN1YmplY3Q6IEhvdE9ic2VydmFibGU8VD4gPSB0aGlzO1xuICAgIGNvbnN0IGluZGV4ID0gc3ViamVjdC5sb2dTdWJzY3JpYmVkRnJhbWUoKTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgc3Vic2NyaXB0aW9uLmFkZChuZXcgU3Vic2NyaXB0aW9uKCgpID0+IHtcbiAgICAgIHN1YmplY3QubG9nVW5zdWJzY3JpYmVkRnJhbWUoaW5kZXgpO1xuICAgIH0pKTtcbiAgICBzdWJzY3JpcHRpb24uYWRkKHN1cGVyLl9zdWJzY3JpYmUoc3Vic2NyaWJlcikpO1xuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cblxuICBzZXR1cCgpIHtcbiAgICBjb25zdCBzdWJqZWN0ID0gdGhpcztcbiAgICBjb25zdCBtZXNzYWdlc0xlbmd0aCA9IHN1YmplY3QubWVzc2FnZXMubGVuZ3RoO1xuICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXZhci1rZXl3b3JkICovXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXNzYWdlc0xlbmd0aDsgaSsrKSB7XG4gICAgICAoKCkgPT4ge1xuICAgICAgICB2YXIgbWVzc2FnZSA9IHN1YmplY3QubWVzc2FnZXNbaV07XG4gICAvKiB0c2xpbnQ6ZW5hYmxlICovXG4gICAgICAgIHN1YmplY3Quc2NoZWR1bGVyLnNjaGVkdWxlKFxuICAgICAgICAgICgpID0+IHsgbWVzc2FnZS5ub3RpZmljYXRpb24ub2JzZXJ2ZShzdWJqZWN0KTsgfSxcbiAgICAgICAgICBtZXNzYWdlLmZyYW1lXG4gICAgICAgICk7XG4gICAgICB9KSgpO1xuICAgIH1cbiAgfVxufVxuYXBwbHlNaXhpbnMoSG90T2JzZXJ2YWJsZSwgW1N1YnNjcmlwdGlvbkxvZ2dhYmxlXSk7XG4iXX0=