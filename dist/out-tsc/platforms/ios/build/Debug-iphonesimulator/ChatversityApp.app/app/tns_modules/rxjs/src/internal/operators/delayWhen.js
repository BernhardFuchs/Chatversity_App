"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
var Observable_1 = require("../Observable");
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/* tslint:disable:max-line-length */
/**
 * Delays the emission of items from the source Observable by a given time span
 * determined by the emissions of another Observable.
 *
 * <span class="informal">It's like {@link delay}, but the time span of the
 * delay duration is determined by a second Observable.</span>
 *
 * ![](delayWhen.png)
 *
 * `delayWhen` time shifts each emitted value from the source Observable by a
 * time span determined by another Observable. When the source emits a value,
 * the `delayDurationSelector` function is called with the source value as
 * argument, and should return an Observable, called the "duration" Observable.
 * The source value is emitted on the output Observable only when the duration
 * Observable emits a value or completes.
 * The completion of the notifier triggering the emission of the source value
 * is deprecated behavior and will be removed in future versions.
 *
 * Optionally, `delayWhen` takes a second argument, `subscriptionDelay`, which
 * is an Observable. When `subscriptionDelay` emits its first value or
 * completes, the source Observable is subscribed to and starts behaving like
 * described in the previous paragraph. If `subscriptionDelay` is not provided,
 * `delayWhen` will subscribe to the source Observable as soon as the output
 * Observable is subscribed.
 *
 * ## Example
 * Delay each click by a random amount of time, between 0 and 5 seconds
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const delayedClicks = clicks.pipe(
 *   delayWhen(event => interval(Math.random() * 5000)),
 * );
 * delayedClicks.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link debounce}
 * @see {@link delay}
 *
 * @param {function(value: T, index: number): Observable} delayDurationSelector A function that
 * returns an Observable for each value emitted by the source Observable, which
 * is then used to delay the emission of that item on the output Observable
 * until the Observable returned from this function emits a value.
 * @param {Observable} subscriptionDelay An Observable that triggers the
 * subscription to the source Observable once it emits any value.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by an amount of time specified by the Observable returned by
 * `delayDurationSelector`.
 * @method delayWhen
 * @owner Observable
 */
function delayWhen(delayDurationSelector, subscriptionDelay) {
    if (subscriptionDelay) {
        return function (source) {
            return new SubscriptionDelayObservable(source, subscriptionDelay)
                .lift(new DelayWhenOperator(delayDurationSelector));
        };
    }
    return function (source) { return source.lift(new DelayWhenOperator(delayDurationSelector)); };
}
exports.delayWhen = delayWhen;
var DelayWhenOperator = /** @class */ (function () {
    function DelayWhenOperator(delayDurationSelector) {
        this.delayDurationSelector = delayDurationSelector;
    }
    DelayWhenOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DelayWhenSubscriber(subscriber, this.delayDurationSelector));
    };
    return DelayWhenOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DelayWhenSubscriber = /** @class */ (function (_super) {
    __extends(DelayWhenSubscriber, _super);
    function DelayWhenSubscriber(destination, delayDurationSelector) {
        var _this = _super.call(this, destination) || this;
        _this.delayDurationSelector = delayDurationSelector;
        _this.completed = false;
        _this.delayNotifierSubscriptions = [];
        _this.index = 0;
        return _this;
    }
    DelayWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(outerValue);
        this.removeSubscription(innerSub);
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
        var value = this.removeSubscription(innerSub);
        if (value) {
            this.destination.next(value);
        }
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype._next = function (value) {
        var index = this.index++;
        try {
            var delayNotifier = this.delayDurationSelector(value, index);
            if (delayNotifier) {
                this.tryDelay(delayNotifier, value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    DelayWhenSubscriber.prototype._complete = function () {
        this.completed = true;
        this.tryComplete();
        this.unsubscribe();
    };
    DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
        subscription.unsubscribe();
        var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
        if (subscriptionIdx !== -1) {
            this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
        }
        return subscription.outerValue;
    };
    DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
        var notifierSubscription = subscribeToResult_1.subscribeToResult(this, delayNotifier, value);
        if (notifierSubscription && !notifierSubscription.closed) {
            var destination = this.destination;
            destination.add(notifierSubscription);
            this.delayNotifierSubscriptions.push(notifierSubscription);
        }
    };
    DelayWhenSubscriber.prototype.tryComplete = function () {
        if (this.completed && this.delayNotifierSubscriptions.length === 0) {
            this.destination.complete();
        }
    };
    return DelayWhenSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubscriptionDelayObservable = /** @class */ (function (_super) {
    __extends(SubscriptionDelayObservable, _super);
    function SubscriptionDelayObservable(source, subscriptionDelay) {
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.subscriptionDelay = subscriptionDelay;
        return _this;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
        this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
    };
    return SubscriptionDelayObservable;
}(Observable_1.Observable));
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubscriptionDelaySubscriber = /** @class */ (function (_super) {
    __extends(SubscriptionDelaySubscriber, _super);
    function SubscriptionDelaySubscriber(parent, source) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.source = source;
        _this.sourceSubscribed = false;
        return _this;
    }
    SubscriptionDelaySubscriber.prototype._next = function (unused) {
        this.subscribeToSource();
    };
    SubscriptionDelaySubscriber.prototype._error = function (err) {
        this.unsubscribe();
        this.parent.error(err);
    };
    SubscriptionDelaySubscriber.prototype._complete = function () {
        this.unsubscribe();
        this.subscribeToSource();
    };
    SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
        if (!this.sourceSubscribed) {
            this.sourceSubscribed = true;
            this.unsubscribe();
            this.source.subscribe(this.parent);
        }
    };
    return SubscriptionDelaySubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsYXlXaGVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZGVsYXlXaGVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNENBQTJDO0FBQzNDLDRDQUEyQztBQUUzQyxzREFBcUQ7QUFFckQsK0RBQThEO0FBTzlELG9DQUFvQztBQUVwQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWlERztBQUNILFNBQWdCLFNBQVMsQ0FBSSxxQkFBbUUsRUFDbkUsaUJBQW1DO0lBQzlELElBQUksaUJBQWlCLEVBQUU7UUFDckIsT0FBTyxVQUFDLE1BQXFCO1lBQzNCLE9BQUEsSUFBSSwyQkFBMkIsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUM7aUJBQ3ZELElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFEckQsQ0FDcUQsQ0FBQztLQUN6RDtJQUNELE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLENBQUMsRUFBekQsQ0FBeUQsQ0FBQztBQUM5RixDQUFDO0FBUkQsOEJBUUM7QUFFRDtJQUNFLDJCQUFvQixxQkFBbUU7UUFBbkUsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUE4QztJQUN2RixDQUFDO0lBRUQsZ0NBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztJ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K0NBQVMsR0FBbkI7UUFDRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVPLHVEQUFpQixHQUF6QjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUM3QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3BDO0lBQ0gsQ0FBQztJQUNILGtDQUFDO0FBQUQsQ0FBQyxBQTVCRCxDQUE2Qyx1QkFBVSxHQTRCdEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuLyoqIEBkZXByZWNhdGVkIEluIGZ1dHVyZSB2ZXJzaW9ucywgZW1wdHkgbm90aWZpZXJzIHdpbGwgbm8gbG9uZ2VyIHJlLWVtaXQgdGhlIHNvdXJjZSB2YWx1ZSBvbiB0aGUgb3V0cHV0IG9ic2VydmFibGUuICovXG5leHBvcnQgZnVuY3Rpb24gZGVsYXlXaGVuPFQ+KGRlbGF5RHVyYXRpb25TZWxlY3RvcjogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlPG5ldmVyPiwgc3Vic2NyaXB0aW9uRGVsYXk/OiBPYnNlcnZhYmxlPGFueT4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG5leHBvcnQgZnVuY3Rpb24gZGVsYXlXaGVuPFQ+KGRlbGF5RHVyYXRpb25TZWxlY3RvcjogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlPGFueT4sIHN1YnNjcmlwdGlvbkRlbGF5PzogT2JzZXJ2YWJsZTxhbnk+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogRGVsYXlzIHRoZSBlbWlzc2lvbiBvZiBpdGVtcyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBieSBhIGdpdmVuIHRpbWUgc3BhblxuICogZGV0ZXJtaW5lZCBieSB0aGUgZW1pc3Npb25zIG9mIGFub3RoZXIgT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBsaWtlIHtAbGluayBkZWxheX0sIGJ1dCB0aGUgdGltZSBzcGFuIG9mIHRoZVxuICogZGVsYXkgZHVyYXRpb24gaXMgZGV0ZXJtaW5lZCBieSBhIHNlY29uZCBPYnNlcnZhYmxlLjwvc3Bhbj5cbiAqXG4gKiAhW10oZGVsYXlXaGVuLnBuZylcbiAqXG4gKiBgZGVsYXlXaGVuYCB0aW1lIHNoaWZ0cyBlYWNoIGVtaXR0ZWQgdmFsdWUgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgYnkgYVxuICogdGltZSBzcGFuIGRldGVybWluZWQgYnkgYW5vdGhlciBPYnNlcnZhYmxlLiBXaGVuIHRoZSBzb3VyY2UgZW1pdHMgYSB2YWx1ZSxcbiAqIHRoZSBgZGVsYXlEdXJhdGlvblNlbGVjdG9yYCBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0aGUgc291cmNlIHZhbHVlIGFzXG4gKiBhcmd1bWVudCwgYW5kIHNob3VsZCByZXR1cm4gYW4gT2JzZXJ2YWJsZSwgY2FsbGVkIHRoZSBcImR1cmF0aW9uXCIgT2JzZXJ2YWJsZS5cbiAqIFRoZSBzb3VyY2UgdmFsdWUgaXMgZW1pdHRlZCBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUgb25seSB3aGVuIHRoZSBkdXJhdGlvblxuICogT2JzZXJ2YWJsZSBlbWl0cyBhIHZhbHVlIG9yIGNvbXBsZXRlcy5cbiAqIFRoZSBjb21wbGV0aW9uIG9mIHRoZSBub3RpZmllciB0cmlnZ2VyaW5nIHRoZSBlbWlzc2lvbiBvZiB0aGUgc291cmNlIHZhbHVlXG4gKiBpcyBkZXByZWNhdGVkIGJlaGF2aW9yIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gZnV0dXJlIHZlcnNpb25zLlxuICpcbiAqIE9wdGlvbmFsbHksIGBkZWxheVdoZW5gIHRha2VzIGEgc2Vjb25kIGFyZ3VtZW50LCBgc3Vic2NyaXB0aW9uRGVsYXlgLCB3aGljaFxuICogaXMgYW4gT2JzZXJ2YWJsZS4gV2hlbiBgc3Vic2NyaXB0aW9uRGVsYXlgIGVtaXRzIGl0cyBmaXJzdCB2YWx1ZSBvclxuICogY29tcGxldGVzLCB0aGUgc291cmNlIE9ic2VydmFibGUgaXMgc3Vic2NyaWJlZCB0byBhbmQgc3RhcnRzIGJlaGF2aW5nIGxpa2VcbiAqIGRlc2NyaWJlZCBpbiB0aGUgcHJldmlvdXMgcGFyYWdyYXBoLiBJZiBgc3Vic2NyaXB0aW9uRGVsYXlgIGlzIG5vdCBwcm92aWRlZCxcbiAqIGBkZWxheVdoZW5gIHdpbGwgc3Vic2NyaWJlIHRvIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBhcyBzb29uIGFzIHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUgaXMgc3Vic2NyaWJlZC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBEZWxheSBlYWNoIGNsaWNrIGJ5IGEgcmFuZG9tIGFtb3VudCBvZiB0aW1lLCBiZXR3ZWVuIDAgYW5kIDUgc2Vjb25kc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGRlbGF5ZWRDbGlja3MgPSBjbGlja3MucGlwZShcbiAqICAgZGVsYXlXaGVuKGV2ZW50ID0+IGludGVydmFsKE1hdGgucmFuZG9tKCkgKiA1MDAwKSksXG4gKiApO1xuICogZGVsYXllZENsaWNrcy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBkZWJvdW5jZX1cbiAqIEBzZWUge0BsaW5rIGRlbGF5fVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQsIGluZGV4OiBudW1iZXIpOiBPYnNlcnZhYmxlfSBkZWxheUR1cmF0aW9uU2VsZWN0b3IgQSBmdW5jdGlvbiB0aGF0XG4gKiByZXR1cm5zIGFuIE9ic2VydmFibGUgZm9yIGVhY2ggdmFsdWUgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUsIHdoaWNoXG4gKiBpcyB0aGVuIHVzZWQgdG8gZGVsYXkgdGhlIGVtaXNzaW9uIG9mIHRoYXQgaXRlbSBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGVcbiAqIHVudGlsIHRoZSBPYnNlcnZhYmxlIHJldHVybmVkIGZyb20gdGhpcyBmdW5jdGlvbiBlbWl0cyBhIHZhbHVlLlxuICogQHBhcmFtIHtPYnNlcnZhYmxlfSBzdWJzY3JpcHRpb25EZWxheSBBbiBPYnNlcnZhYmxlIHRoYXQgdHJpZ2dlcnMgdGhlXG4gKiBzdWJzY3JpcHRpb24gdG8gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIG9uY2UgaXQgZW1pdHMgYW55IHZhbHVlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGRlbGF5cyB0aGUgZW1pc3Npb25zIG9mIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgYnkgYW4gYW1vdW50IG9mIHRpbWUgc3BlY2lmaWVkIGJ5IHRoZSBPYnNlcnZhYmxlIHJldHVybmVkIGJ5XG4gKiBgZGVsYXlEdXJhdGlvblNlbGVjdG9yYC5cbiAqIEBtZXRob2QgZGVsYXlXaGVuXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVsYXlXaGVuPFQ+KGRlbGF5RHVyYXRpb25TZWxlY3RvcjogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbkRlbGF5PzogT2JzZXJ2YWJsZTxhbnk+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgaWYgKHN1YnNjcmlwdGlvbkRlbGF5KSB7XG4gICAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+XG4gICAgICBuZXcgU3Vic2NyaXB0aW9uRGVsYXlPYnNlcnZhYmxlKHNvdXJjZSwgc3Vic2NyaXB0aW9uRGVsYXkpXG4gICAgICAgIC5saWZ0KG5ldyBEZWxheVdoZW5PcGVyYXRvcihkZWxheUR1cmF0aW9uU2VsZWN0b3IpKTtcbiAgfVxuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IERlbGF5V2hlbk9wZXJhdG9yKGRlbGF5RHVyYXRpb25TZWxlY3RvcikpO1xufVxuXG5jbGFzcyBEZWxheVdoZW5PcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkZWxheUR1cmF0aW9uU2VsZWN0b3I6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZTxhbnk+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IERlbGF5V2hlblN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5kZWxheUR1cmF0aW9uU2VsZWN0b3IpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgRGVsYXlXaGVuU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiB7XG4gIHByaXZhdGUgY29tcGxldGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgZGVsYXlOb3RpZmllclN1YnNjcmlwdGlvbnM6IEFycmF5PFN1YnNjcmlwdGlvbj4gPSBbXTtcbiAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBkZWxheUR1cmF0aW9uU2VsZWN0b3I6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZTxhbnk+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBhbnksXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChvdXRlclZhbHVlKTtcbiAgICB0aGlzLnJlbW92ZVN1YnNjcmlwdGlvbihpbm5lclN1Yik7XG4gICAgdGhpcy50cnlDb21wbGV0ZSgpO1xuICB9XG5cbiAgbm90aWZ5RXJyb3IoZXJyb3I6IGFueSwgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuX2Vycm9yKGVycm9yKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMucmVtb3ZlU3Vic2NyaXB0aW9uKGlubmVyU3ViKTtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCh2YWx1ZSk7XG4gICAgfVxuICAgIHRoaXMudHJ5Q29tcGxldGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5pbmRleCsrO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkZWxheU5vdGlmaWVyID0gdGhpcy5kZWxheUR1cmF0aW9uU2VsZWN0b3IodmFsdWUsIGluZGV4KTtcbiAgICAgIGlmIChkZWxheU5vdGlmaWVyKSB7XG4gICAgICAgIHRoaXMudHJ5RGVsYXkoZGVsYXlOb3RpZmllciwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5jb21wbGV0ZWQgPSB0cnVlO1xuICAgIHRoaXMudHJ5Q29tcGxldGUoKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZVN1YnNjcmlwdGlvbihzdWJzY3JpcHRpb246IElubmVyU3Vic2NyaWJlcjxULCBSPik6IFQge1xuICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uSWR4ID0gdGhpcy5kZWxheU5vdGlmaWVyU3Vic2NyaXB0aW9ucy5pbmRleE9mKHN1YnNjcmlwdGlvbik7XG4gICAgaWYgKHN1YnNjcmlwdGlvbklkeCAhPT0gLTEpIHtcbiAgICAgIHRoaXMuZGVsYXlOb3RpZmllclN1YnNjcmlwdGlvbnMuc3BsaWNlKHN1YnNjcmlwdGlvbklkeCwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbi5vdXRlclZhbHVlO1xuICB9XG5cbiAgcHJpdmF0ZSB0cnlEZWxheShkZWxheU5vdGlmaWVyOiBPYnNlcnZhYmxlPGFueT4sIHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3Qgbm90aWZpZXJTdWJzY3JpcHRpb24gPSBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBkZWxheU5vdGlmaWVyLCB2YWx1ZSk7XG5cbiAgICBpZiAobm90aWZpZXJTdWJzY3JpcHRpb24gJiYgIW5vdGlmaWVyU3Vic2NyaXB0aW9uLmNsb3NlZCkge1xuICAgICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uIGFzIFN1YnNjcmlwdGlvbjtcbiAgICAgIGRlc3RpbmF0aW9uLmFkZChub3RpZmllclN1YnNjcmlwdGlvbik7XG4gICAgICB0aGlzLmRlbGF5Tm90aWZpZXJTdWJzY3JpcHRpb25zLnB1c2gobm90aWZpZXJTdWJzY3JpcHRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJ5Q29tcGxldGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29tcGxldGVkICYmIHRoaXMuZGVsYXlOb3RpZmllclN1YnNjcmlwdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBTdWJzY3JpcHRpb25EZWxheU9ic2VydmFibGU8VD4gZXh0ZW5kcyBPYnNlcnZhYmxlPFQ+IHtcbiAgY29uc3RydWN0b3IocHVibGljIHNvdXJjZTogT2JzZXJ2YWJsZTxUPiwgcHJpdmF0ZSBzdWJzY3JpcHRpb25EZWxheTogT2JzZXJ2YWJsZTxhbnk+KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25EZWxheS5zdWJzY3JpYmUobmV3IFN1YnNjcmlwdGlvbkRlbGF5U3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnNvdXJjZSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBTdWJzY3JpcHRpb25EZWxheVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBzb3VyY2VTdWJzY3JpYmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwYXJlbnQ6IFN1YnNjcmliZXI8VD4sIHByaXZhdGUgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh1bnVzZWQ6IGFueSkge1xuICAgIHRoaXMuc3Vic2NyaWJlVG9Tb3VyY2UoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpIHtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5wYXJlbnQuZXJyb3IoZXJyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKSB7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuc3Vic2NyaWJlVG9Tb3VyY2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3Vic2NyaWJlVG9Tb3VyY2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNvdXJjZVN1YnNjcmliZWQpIHtcbiAgICAgIHRoaXMuc291cmNlU3Vic2NyaWJlZCA9IHRydWU7XG4gICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLnNvdXJjZS5zdWJzY3JpYmUodGhpcy5wYXJlbnQpO1xuICAgIH1cbiAgfVxufVxuIl19