"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
var async_1 = require("../scheduler/async");
/**
 * Emits a value from the source Observable only after a particular time span
 * has passed without another source emission.
 *
 * <span class="informal">It's like {@link delay}, but passes only the most
 * recent value from each burst of emissions.</span>
 *
 * ![](debounceTime.png)
 *
 * `debounceTime` delays values emitted by the source Observable, but drops
 * previous pending delayed emissions if a new value arrives on the source
 * Observable. This operator keeps track of the most recent value from the
 * source Observable, and emits that only when `dueTime` enough time has passed
 * without any other value appearing on the source Observable. If a new value
 * appears before `dueTime` silence occurs, the previous value will be dropped
 * and will not be emitted on the output Observable.
 *
 * This is a rate-limiting operator, because it is impossible for more than one
 * value to be emitted in any time window of duration `dueTime`, but it is also
 * a delay-like operator since output emissions do not occur at the same time as
 * they did on the source Observable. Optionally takes a {@link SchedulerLike} for
 * managing timers.
 *
 * ## Example
 * Emit the most recent click after a burst of clicks
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(debounceTime(1000));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link auditTime}
 * @see {@link debounce}
 * @see {@link delay}
 * @see {@link sampleTime}
 * @see {@link throttleTime}
 *
 * @param {number} dueTime The timeout duration in milliseconds (or the time
 * unit determined internally by the optional `scheduler`) for the window of
 * time required to wait for emission silence before emitting the most recent
 * source value.
 * @param {SchedulerLike} [scheduler=async] The {@link SchedulerLike} to use for
 * managing the timers that handle the timeout for each value.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by the specified `dueTime`, and may drop some values if they occur
 * too frequently.
 * @method debounceTime
 * @owner Observable
 */
function debounceTime(dueTime, scheduler) {
    if (scheduler === void 0) { scheduler = async_1.async; }
    return function (source) { return source.lift(new DebounceTimeOperator(dueTime, scheduler)); };
}
exports.debounceTime = debounceTime;
var DebounceTimeOperator = /** @class */ (function () {
    function DebounceTimeOperator(dueTime, scheduler) {
        this.dueTime = dueTime;
        this.scheduler = scheduler;
    }
    DebounceTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
    };
    return DebounceTimeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DebounceTimeSubscriber = /** @class */ (function (_super) {
    __extends(DebounceTimeSubscriber, _super);
    function DebounceTimeSubscriber(destination, dueTime, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.dueTime = dueTime;
        _this.scheduler = scheduler;
        _this.debouncedSubscription = null;
        _this.lastValue = null;
        _this.hasValue = false;
        return _this;
    }
    DebounceTimeSubscriber.prototype._next = function (value) {
        this.clearDebounce();
        this.lastValue = value;
        this.hasValue = true;
        this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
    };
    DebounceTimeSubscriber.prototype._complete = function () {
        this.debouncedNext();
        this.destination.complete();
    };
    DebounceTimeSubscriber.prototype.debouncedNext = function () {
        this.clearDebounce();
        if (this.hasValue) {
            var lastValue = this.lastValue;
            // This must be done *before* passing the value
            // along to the destination because it's possible for
            // the value to synchronously re-enter this operator
            // recursively when scheduled with things like
            // VirtualScheduler/TestScheduler.
            this.lastValue = null;
            this.hasValue = false;
            this.destination.next(lastValue);
        }
    };
    DebounceTimeSubscriber.prototype.clearDebounce = function () {
        var debouncedSubscription = this.debouncedSubscription;
        if (debouncedSubscription !== null) {
            this.remove(debouncedSubscription);
            debouncedSubscription.unsubscribe();
            this.debouncedSubscription = null;
        }
    };
    return DebounceTimeSubscriber;
}(Subscriber_1.Subscriber));
function dispatchNext(subscriber) {
    subscriber.debouncedNext();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVib3VuY2VUaW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZGVib3VuY2VUaW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsNENBQTJDO0FBRTNDLDRDQUEyQztBQUczQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0RHO0FBQ0gsU0FBZ0IsWUFBWSxDQUFJLE9BQWUsRUFBRSxTQUFnQztJQUFoQywwQkFBQSxFQUFBLFlBQTJCLGFBQUs7SUFDL0UsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQW9CLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQXpELENBQXlELENBQUM7QUFDOUYsQ0FBQztBQUZELG9DQUVDO0FBRUQ7SUFDRSw4QkFBb0IsT0FBZSxFQUFVLFNBQXdCO1FBQWpELFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFlO0lBQ3JFLENBQUM7SUFFRCxtQ0FBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHNCQUFzQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ2hHLENBQUM7SUFDSCwyQkFBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQXdDLDBDQUFhO0lBS25ELGdDQUFZLFdBQTBCLEVBQ2xCLE9BQWUsRUFDZixTQUF3QjtRQUY1QyxZQUdFLGtCQUFNLFdBQVcsQ0FBQyxTQUNuQjtRQUhtQixhQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsZUFBUyxHQUFULFNBQVMsQ0FBZTtRQU5wQywyQkFBcUIsR0FBaUIsSUFBSSxDQUFDO1FBQzNDLGVBQVMsR0FBTSxJQUFJLENBQUM7UUFDcEIsY0FBUSxHQUFZLEtBQUssQ0FBQzs7SUFNbEMsQ0FBQztJQUVTLHNDQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuRyxDQUFDO0lBRVMsMENBQVMsR0FBbkI7UUFDRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQsOENBQWEsR0FBYjtRQUNFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUVyQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDVCxJQUFBLDBCQUFTLENBQVU7WUFDM0IsK0NBQStDO1lBQy9DLHFEQUFxRDtZQUNyRCxvREFBb0Q7WUFDcEQsOENBQThDO1lBQzlDLGtDQUFrQztZQUNsQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7SUFFTyw4Q0FBYSxHQUFyQjtRQUNFLElBQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDO1FBRXpELElBQUkscUJBQXFCLEtBQUssSUFBSSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUNuQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNwQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUNILDZCQUFDO0FBQUQsQ0FBQyxBQWhERCxDQUF3Qyx1QkFBVSxHQWdEakQ7QUFFRCxTQUFTLFlBQVksQ0FBQyxVQUF1QztJQUMzRCxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDN0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IGFzeW5jIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgU2NoZWR1bGVyTGlrZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBFbWl0cyBhIHZhbHVlIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIG9ubHkgYWZ0ZXIgYSBwYXJ0aWN1bGFyIHRpbWUgc3BhblxuICogaGFzIHBhc3NlZCB3aXRob3V0IGFub3RoZXIgc291cmNlIGVtaXNzaW9uLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5JdCdzIGxpa2Uge0BsaW5rIGRlbGF5fSwgYnV0IHBhc3NlcyBvbmx5IHRoZSBtb3N0XG4gKiByZWNlbnQgdmFsdWUgZnJvbSBlYWNoIGJ1cnN0IG9mIGVtaXNzaW9ucy48L3NwYW4+XG4gKlxuICogIVtdKGRlYm91bmNlVGltZS5wbmcpXG4gKlxuICogYGRlYm91bmNlVGltZWAgZGVsYXlzIHZhbHVlcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgYnV0IGRyb3BzXG4gKiBwcmV2aW91cyBwZW5kaW5nIGRlbGF5ZWQgZW1pc3Npb25zIGlmIGEgbmV3IHZhbHVlIGFycml2ZXMgb24gdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZS4gVGhpcyBvcGVyYXRvciBrZWVwcyB0cmFjayBvZiB0aGUgbW9zdCByZWNlbnQgdmFsdWUgZnJvbSB0aGVcbiAqIHNvdXJjZSBPYnNlcnZhYmxlLCBhbmQgZW1pdHMgdGhhdCBvbmx5IHdoZW4gYGR1ZVRpbWVgIGVub3VnaCB0aW1lIGhhcyBwYXNzZWRcbiAqIHdpdGhvdXQgYW55IG90aGVyIHZhbHVlIGFwcGVhcmluZyBvbiB0aGUgc291cmNlIE9ic2VydmFibGUuIElmIGEgbmV3IHZhbHVlXG4gKiBhcHBlYXJzIGJlZm9yZSBgZHVlVGltZWAgc2lsZW5jZSBvY2N1cnMsIHRoZSBwcmV2aW91cyB2YWx1ZSB3aWxsIGJlIGRyb3BwZWRcbiAqIGFuZCB3aWxsIG5vdCBiZSBlbWl0dGVkIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqXG4gKiBUaGlzIGlzIGEgcmF0ZS1saW1pdGluZyBvcGVyYXRvciwgYmVjYXVzZSBpdCBpcyBpbXBvc3NpYmxlIGZvciBtb3JlIHRoYW4gb25lXG4gKiB2YWx1ZSB0byBiZSBlbWl0dGVkIGluIGFueSB0aW1lIHdpbmRvdyBvZiBkdXJhdGlvbiBgZHVlVGltZWAsIGJ1dCBpdCBpcyBhbHNvXG4gKiBhIGRlbGF5LWxpa2Ugb3BlcmF0b3Igc2luY2Ugb3V0cHV0IGVtaXNzaW9ucyBkbyBub3Qgb2NjdXIgYXQgdGhlIHNhbWUgdGltZSBhc1xuICogdGhleSBkaWQgb24gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLiBPcHRpb25hbGx5IHRha2VzIGEge0BsaW5rIFNjaGVkdWxlckxpa2V9IGZvclxuICogbWFuYWdpbmcgdGltZXJzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEVtaXQgdGhlIG1vc3QgcmVjZW50IGNsaWNrIGFmdGVyIGEgYnVyc3Qgb2YgY2xpY2tzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoZGVib3VuY2VUaW1lKDEwMDApKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBhdWRpdFRpbWV9XG4gKiBAc2VlIHtAbGluayBkZWJvdW5jZX1cbiAqIEBzZWUge0BsaW5rIGRlbGF5fVxuICogQHNlZSB7QGxpbmsgc2FtcGxlVGltZX1cbiAqIEBzZWUge0BsaW5rIHRocm90dGxlVGltZX1cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gZHVlVGltZSBUaGUgdGltZW91dCBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgKG9yIHRoZSB0aW1lXG4gKiB1bml0IGRldGVybWluZWQgaW50ZXJuYWxseSBieSB0aGUgb3B0aW9uYWwgYHNjaGVkdWxlcmApIGZvciB0aGUgd2luZG93IG9mXG4gKiB0aW1lIHJlcXVpcmVkIHRvIHdhaXQgZm9yIGVtaXNzaW9uIHNpbGVuY2UgYmVmb3JlIGVtaXR0aW5nIHRoZSBtb3N0IHJlY2VudFxuICogc291cmNlIHZhbHVlLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyPWFzeW5jXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3JcbiAqIG1hbmFnaW5nIHRoZSB0aW1lcnMgdGhhdCBoYW5kbGUgdGhlIHRpbWVvdXQgZm9yIGVhY2ggdmFsdWUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZGVsYXlzIHRoZSBlbWlzc2lvbnMgb2YgdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSBieSB0aGUgc3BlY2lmaWVkIGBkdWVUaW1lYCwgYW5kIG1heSBkcm9wIHNvbWUgdmFsdWVzIGlmIHRoZXkgb2NjdXJcbiAqIHRvbyBmcmVxdWVudGx5LlxuICogQG1ldGhvZCBkZWJvdW5jZVRpbWVcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZVRpbWU8VD4oZHVlVGltZTogbnVtYmVyLCBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UgPSBhc3luYyk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgRGVib3VuY2VUaW1lT3BlcmF0b3IoZHVlVGltZSwgc2NoZWR1bGVyKSk7XG59XG5cbmNsYXNzIERlYm91bmNlVGltZU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGR1ZVRpbWU6IG51bWJlciwgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgRGVib3VuY2VUaW1lU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLmR1ZVRpbWUsIHRoaXMuc2NoZWR1bGVyKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIERlYm91bmNlVGltZVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBkZWJvdW5jZWRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gIHByaXZhdGUgbGFzdFZhbHVlOiBUID0gbnVsbDtcbiAgcHJpdmF0ZSBoYXNWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGR1ZVRpbWU6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpIHtcbiAgICB0aGlzLmNsZWFyRGVib3VuY2UoKTtcbiAgICB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuaGFzVmFsdWUgPSB0cnVlO1xuICAgIHRoaXMuYWRkKHRoaXMuZGVib3VuY2VkU3Vic2NyaXB0aW9uID0gdGhpcy5zY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2hOZXh0LCB0aGlzLmR1ZVRpbWUsIHRoaXMpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKSB7XG4gICAgdGhpcy5kZWJvdW5jZWROZXh0KCk7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG5cbiAgZGVib3VuY2VkTmV4dCgpOiB2b2lkIHtcbiAgICB0aGlzLmNsZWFyRGVib3VuY2UoKTtcblxuICAgIGlmICh0aGlzLmhhc1ZhbHVlKSB7XG4gICAgICBjb25zdCB7IGxhc3RWYWx1ZSB9ID0gdGhpcztcbiAgICAgIC8vIFRoaXMgbXVzdCBiZSBkb25lICpiZWZvcmUqIHBhc3NpbmcgdGhlIHZhbHVlXG4gICAgICAvLyBhbG9uZyB0byB0aGUgZGVzdGluYXRpb24gYmVjYXVzZSBpdCdzIHBvc3NpYmxlIGZvclxuICAgICAgLy8gdGhlIHZhbHVlIHRvIHN5bmNocm9ub3VzbHkgcmUtZW50ZXIgdGhpcyBvcGVyYXRvclxuICAgICAgLy8gcmVjdXJzaXZlbHkgd2hlbiBzY2hlZHVsZWQgd2l0aCB0aGluZ3MgbGlrZVxuICAgICAgLy8gVmlydHVhbFNjaGVkdWxlci9UZXN0U2NoZWR1bGVyLlxuICAgICAgdGhpcy5sYXN0VmFsdWUgPSBudWxsO1xuICAgICAgdGhpcy5oYXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGxhc3RWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjbGVhckRlYm91bmNlKCk6IHZvaWQge1xuICAgIGNvbnN0IGRlYm91bmNlZFN1YnNjcmlwdGlvbiA9IHRoaXMuZGVib3VuY2VkU3Vic2NyaXB0aW9uO1xuXG4gICAgaWYgKGRlYm91bmNlZFN1YnNjcmlwdGlvbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5yZW1vdmUoZGVib3VuY2VkU3Vic2NyaXB0aW9uKTtcbiAgICAgIGRlYm91bmNlZFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5kZWJvdW5jZWRTdWJzY3JpcHRpb24gPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkaXNwYXRjaE5leHQoc3Vic2NyaWJlcjogRGVib3VuY2VUaW1lU3Vic2NyaWJlcjxhbnk+KSB7XG4gIHN1YnNjcmliZXIuZGVib3VuY2VkTmV4dCgpO1xufVxuIl19