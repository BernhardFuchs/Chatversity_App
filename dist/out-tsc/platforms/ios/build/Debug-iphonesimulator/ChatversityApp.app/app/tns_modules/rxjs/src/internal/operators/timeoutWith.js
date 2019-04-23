"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async_1 = require("../scheduler/async");
var isDate_1 = require("../util/isDate");
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/* tslint:enable:max-line-length */
/**
 *
 * Errors if Observable does not emit a value in given time span, in case of which
 * subscribes to the second Observable.
 *
 * <span class="informal">It's a version of `timeout` operator that let's you specify fallback Observable.</span>
 *
 * ![](timeoutWith.png)
 *
 * `timeoutWith` is a variation of `timeout` operator. It behaves exactly the same,
 * still accepting as a first argument either a number or a Date, which control - respectively -
 * when values of source Observable should be emitted or when it should complete.
 *
 * The only difference is that it accepts a second, required parameter. This parameter
 * should be an Observable which will be subscribed when source Observable fails any timeout check.
 * So whenever regular `timeout` would emit an error, `timeoutWith` will instead start re-emitting
 * values from second Observable. Note that this fallback Observable is not checked for timeouts
 * itself, so it can emit values and complete at arbitrary points in time. From the moment of a second
 * subscription, Observable returned from `timeoutWith` simply mirrors fallback stream. When that
 * stream completes, it completes as well.
 *
 * Scheduler, which in case of `timeout` is provided as as second argument, can be still provided
 * here - as a third, optional parameter. It still is used to schedule timeout checks and -
 * as a consequence - when second Observable will be subscribed, since subscription happens
 * immediately after failing check.
 *
 * ## Example
 * Add fallback observable
 * ```javascript
 * const seconds = interval(1000);
 * const minutes = interval(60 * 1000);
 *
 * seconds.pipe(timeoutWith(900, minutes))
 *   .subscribe(
 *     value => console.log(value), // After 900ms, will start emitting `minutes`,
 *                                  // since first value of `seconds` will not arrive fast enough.
 *     err => console.log(err),     // Would be called after 900ms in case of `timeout`,
 *                                  // but here will never be called.
 *   );
 * ```
 *
 * @param {number|Date} due Number specifying period within which Observable must emit values
 *                          or Date specifying before when Observable should complete
 * @param {Observable<T>} withObservable Observable which will be subscribed if source fails timeout check.
 * @param {SchedulerLike} [scheduler] Scheduler controlling when timeout checks occur.
 * @return {Observable<T>} Observable that mirrors behaviour of source or, when timeout check fails, of an Observable
 *                          passed as a second parameter.
 * @method timeoutWith
 * @owner Observable
 */
function timeoutWith(due, withObservable, scheduler) {
    if (scheduler === void 0) { scheduler = async_1.async; }
    return function (source) {
        var absoluteTimeout = isDate_1.isDate(due);
        var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
        return source.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
    };
}
exports.timeoutWith = timeoutWith;
var TimeoutWithOperator = /** @class */ (function () {
    function TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
    }
    TimeoutWithOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
    };
    return TimeoutWithOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TimeoutWithSubscriber = /** @class */ (function (_super) {
    __extends(TimeoutWithSubscriber, _super);
    function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.absoluteTimeout = absoluteTimeout;
        _this.waitFor = waitFor;
        _this.withObservable = withObservable;
        _this.scheduler = scheduler;
        _this.action = null;
        _this.scheduleTimeout();
        return _this;
    }
    TimeoutWithSubscriber.dispatchTimeout = function (subscriber) {
        var withObservable = subscriber.withObservable;
        subscriber._unsubscribeAndRecycle();
        subscriber.add(subscribeToResult_1.subscribeToResult(subscriber, withObservable));
    };
    TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
        var action = this.action;
        if (action) {
            // Recycle the action if we've already scheduled one. All the production
            // Scheduler Actions mutate their state/delay time and return themeselves.
            // VirtualActions are immutable, so they create and return a clone. In this
            // case, we need to set the action reference to the most recent VirtualAction,
            // to ensure that's the one we clone from next time.
            this.action = action.schedule(this, this.waitFor);
        }
        else {
            this.add(this.action = this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, this));
        }
    };
    TimeoutWithSubscriber.prototype._next = function (value) {
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
        _super.prototype._next.call(this, value);
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    TimeoutWithSubscriber.prototype._unsubscribe = function () {
        this.action = null;
        this.scheduler = null;
        this.withObservable = null;
    };
    return TimeoutWithSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZW91dFdpdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy90aW1lb3V0V2l0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDRDQUEyQztBQUUzQyx5Q0FBd0M7QUFDeEMsc0RBQXFEO0FBQ3JELCtEQUE4RDtBQUs5RCxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpREc7QUFDSCxTQUFnQixXQUFXLENBQU8sR0FBa0IsRUFDbEIsY0FBa0MsRUFDbEMsU0FBZ0M7SUFBaEMsMEJBQUEsRUFBQSxZQUEyQixhQUFLO0lBQ2hFLE9BQU8sVUFBQyxNQUFxQjtRQUMzQixJQUFJLGVBQWUsR0FBRyxlQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsSUFBSSxPQUFPLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2pGLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDbkcsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQVJELGtDQVFDO0FBRUQ7SUFDRSw2QkFBb0IsT0FBZSxFQUNmLGVBQXdCLEVBQ3hCLGNBQW9DLEVBQ3BDLFNBQXdCO1FBSHhCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixvQkFBZSxHQUFmLGVBQWUsQ0FBUztRQUN4QixtQkFBYyxHQUFkLGNBQWMsQ0FBc0I7UUFDcEMsY0FBUyxHQUFULFNBQVMsQ0FBZTtJQUM1QyxDQUFDO0lBRUQsa0NBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxxQkFBcUIsQ0FDL0MsVUFBVSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQ3BGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUFaRCxJQVlDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQTBDLHlDQUFxQjtJQUk3RCwrQkFBWSxXQUEwQixFQUNsQixlQUF3QixFQUN4QixPQUFlLEVBQ2YsY0FBb0MsRUFDcEMsU0FBd0I7UUFKNUMsWUFLRSxrQkFBTSxXQUFXLENBQUMsU0FFbkI7UUFObUIscUJBQWUsR0FBZixlQUFlLENBQVM7UUFDeEIsYUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLG9CQUFjLEdBQWQsY0FBYyxDQUFzQjtRQUNwQyxlQUFTLEdBQVQsU0FBUyxDQUFlO1FBTnBDLFlBQU0sR0FBaUQsSUFBSSxDQUFDO1FBUWxFLEtBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7SUFDekIsQ0FBQztJQUVjLHFDQUFlLEdBQTlCLFVBQXFDLFVBQXVDO1FBQ2xFLElBQUEsMENBQWMsQ0FBZ0I7UUFDL0IsVUFBVyxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDNUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxxQ0FBaUIsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRU8sK0NBQWUsR0FBdkI7UUFDVSxJQUFBLG9CQUFNLENBQVU7UUFDeEIsSUFBSSxNQUFNLEVBQUU7WUFDVix3RUFBd0U7WUFDeEUsMEVBQTBFO1lBQzFFLDJFQUEyRTtZQUMzRSw4RUFBOEU7WUFDOUUsb0RBQW9EO1lBQ3BELElBQUksQ0FBQyxNQUFNLEdBQW1ELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUUsQ0FBQztTQUNwRzthQUFNO1lBQ0wsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFtRCxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FDNUYscUJBQXFCLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUN6RCxDQUFDLENBQUM7U0FDTDtJQUNILENBQUM7SUFFUyxxQ0FBSyxHQUFmLFVBQWdCLEtBQVE7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDekIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQ3hCO1FBQ0QsaUJBQU0sS0FBSyxZQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRCx5RUFBeUU7SUFDekUsNENBQVksR0FBWjtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0lBQzdCLENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUFoREQsQ0FBMEMsaUNBQWUsR0FnRHhEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0RhdGUgfSBmcm9tICcuLi91dGlsL2lzRGF0ZSc7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCwgT3BlcmF0b3JGdW5jdGlvbiwgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UsIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVvdXRXaXRoPFQsIFI+KGR1ZTogbnVtYmVyIHwgRGF0ZSwgd2l0aE9ic2VydmFibGU6IE9ic2VydmFibGVJbnB1dDxSPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKlxuICogRXJyb3JzIGlmIE9ic2VydmFibGUgZG9lcyBub3QgZW1pdCBhIHZhbHVlIGluIGdpdmVuIHRpbWUgc3BhbiwgaW4gY2FzZSBvZiB3aGljaFxuICogc3Vic2NyaWJlcyB0byB0aGUgc2Vjb25kIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgYSB2ZXJzaW9uIG9mIGB0aW1lb3V0YCBvcGVyYXRvciB0aGF0IGxldCdzIHlvdSBzcGVjaWZ5IGZhbGxiYWNrIE9ic2VydmFibGUuPC9zcGFuPlxuICpcbiAqICFbXSh0aW1lb3V0V2l0aC5wbmcpXG4gKlxuICogYHRpbWVvdXRXaXRoYCBpcyBhIHZhcmlhdGlvbiBvZiBgdGltZW91dGAgb3BlcmF0b3IuIEl0IGJlaGF2ZXMgZXhhY3RseSB0aGUgc2FtZSxcbiAqIHN0aWxsIGFjY2VwdGluZyBhcyBhIGZpcnN0IGFyZ3VtZW50IGVpdGhlciBhIG51bWJlciBvciBhIERhdGUsIHdoaWNoIGNvbnRyb2wgLSByZXNwZWN0aXZlbHkgLVxuICogd2hlbiB2YWx1ZXMgb2Ygc291cmNlIE9ic2VydmFibGUgc2hvdWxkIGJlIGVtaXR0ZWQgb3Igd2hlbiBpdCBzaG91bGQgY29tcGxldGUuXG4gKlxuICogVGhlIG9ubHkgZGlmZmVyZW5jZSBpcyB0aGF0IGl0IGFjY2VwdHMgYSBzZWNvbmQsIHJlcXVpcmVkIHBhcmFtZXRlci4gVGhpcyBwYXJhbWV0ZXJcbiAqIHNob3VsZCBiZSBhbiBPYnNlcnZhYmxlIHdoaWNoIHdpbGwgYmUgc3Vic2NyaWJlZCB3aGVuIHNvdXJjZSBPYnNlcnZhYmxlIGZhaWxzIGFueSB0aW1lb3V0IGNoZWNrLlxuICogU28gd2hlbmV2ZXIgcmVndWxhciBgdGltZW91dGAgd291bGQgZW1pdCBhbiBlcnJvciwgYHRpbWVvdXRXaXRoYCB3aWxsIGluc3RlYWQgc3RhcnQgcmUtZW1pdHRpbmdcbiAqIHZhbHVlcyBmcm9tIHNlY29uZCBPYnNlcnZhYmxlLiBOb3RlIHRoYXQgdGhpcyBmYWxsYmFjayBPYnNlcnZhYmxlIGlzIG5vdCBjaGVja2VkIGZvciB0aW1lb3V0c1xuICogaXRzZWxmLCBzbyBpdCBjYW4gZW1pdCB2YWx1ZXMgYW5kIGNvbXBsZXRlIGF0IGFyYml0cmFyeSBwb2ludHMgaW4gdGltZS4gRnJvbSB0aGUgbW9tZW50IG9mIGEgc2Vjb25kXG4gKiBzdWJzY3JpcHRpb24sIE9ic2VydmFibGUgcmV0dXJuZWQgZnJvbSBgdGltZW91dFdpdGhgIHNpbXBseSBtaXJyb3JzIGZhbGxiYWNrIHN0cmVhbS4gV2hlbiB0aGF0XG4gKiBzdHJlYW0gY29tcGxldGVzLCBpdCBjb21wbGV0ZXMgYXMgd2VsbC5cbiAqXG4gKiBTY2hlZHVsZXIsIHdoaWNoIGluIGNhc2Ugb2YgYHRpbWVvdXRgIGlzIHByb3ZpZGVkIGFzIGFzIHNlY29uZCBhcmd1bWVudCwgY2FuIGJlIHN0aWxsIHByb3ZpZGVkXG4gKiBoZXJlIC0gYXMgYSB0aGlyZCwgb3B0aW9uYWwgcGFyYW1ldGVyLiBJdCBzdGlsbCBpcyB1c2VkIHRvIHNjaGVkdWxlIHRpbWVvdXQgY2hlY2tzIGFuZCAtXG4gKiBhcyBhIGNvbnNlcXVlbmNlIC0gd2hlbiBzZWNvbmQgT2JzZXJ2YWJsZSB3aWxsIGJlIHN1YnNjcmliZWQsIHNpbmNlIHN1YnNjcmlwdGlvbiBoYXBwZW5zXG4gKiBpbW1lZGlhdGVseSBhZnRlciBmYWlsaW5nIGNoZWNrLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEFkZCBmYWxsYmFjayBvYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBzZWNvbmRzID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiBjb25zdCBtaW51dGVzID0gaW50ZXJ2YWwoNjAgKiAxMDAwKTtcbiAqXG4gKiBzZWNvbmRzLnBpcGUodGltZW91dFdpdGgoOTAwLCBtaW51dGVzKSlcbiAqICAgLnN1YnNjcmliZShcbiAqICAgICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksIC8vIEFmdGVyIDkwMG1zLCB3aWxsIHN0YXJ0IGVtaXR0aW5nIGBtaW51dGVzYCxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNpbmNlIGZpcnN0IHZhbHVlIG9mIGBzZWNvbmRzYCB3aWxsIG5vdCBhcnJpdmUgZmFzdCBlbm91Z2guXG4gKiAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVyciksICAgICAvLyBXb3VsZCBiZSBjYWxsZWQgYWZ0ZXIgOTAwbXMgaW4gY2FzZSBvZiBgdGltZW91dGAsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBidXQgaGVyZSB3aWxsIG5ldmVyIGJlIGNhbGxlZC5cbiAqICAgKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfERhdGV9IGR1ZSBOdW1iZXIgc3BlY2lmeWluZyBwZXJpb2Qgd2l0aGluIHdoaWNoIE9ic2VydmFibGUgbXVzdCBlbWl0IHZhbHVlc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgIG9yIERhdGUgc3BlY2lmeWluZyBiZWZvcmUgd2hlbiBPYnNlcnZhYmxlIHNob3VsZCBjb21wbGV0ZVxuICogQHBhcmFtIHtPYnNlcnZhYmxlPFQ+fSB3aXRoT2JzZXJ2YWJsZSBPYnNlcnZhYmxlIHdoaWNoIHdpbGwgYmUgc3Vic2NyaWJlZCBpZiBzb3VyY2UgZmFpbHMgdGltZW91dCBjaGVjay5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gU2NoZWR1bGVyIGNvbnRyb2xsaW5nIHdoZW4gdGltZW91dCBjaGVja3Mgb2NjdXIuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBPYnNlcnZhYmxlIHRoYXQgbWlycm9ycyBiZWhhdmlvdXIgb2Ygc291cmNlIG9yLCB3aGVuIHRpbWVvdXQgY2hlY2sgZmFpbHMsIG9mIGFuIE9ic2VydmFibGVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzZWQgYXMgYSBzZWNvbmQgcGFyYW1ldGVyLlxuICogQG1ldGhvZCB0aW1lb3V0V2l0aFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVvdXRXaXRoPFQsIFI+KGR1ZTogbnVtYmVyIHwgRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZUlucHV0PFI+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzeW5jKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgUj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4ge1xuICAgIGxldCBhYnNvbHV0ZVRpbWVvdXQgPSBpc0RhdGUoZHVlKTtcbiAgICBsZXQgd2FpdEZvciA9IGFic29sdXRlVGltZW91dCA/ICgrZHVlIC0gc2NoZWR1bGVyLm5vdygpKSA6IE1hdGguYWJzKDxudW1iZXI+ZHVlKTtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IFRpbWVvdXRXaXRoT3BlcmF0b3Iod2FpdEZvciwgYWJzb2x1dGVUaW1lb3V0LCB3aXRoT2JzZXJ2YWJsZSwgc2NoZWR1bGVyKSk7XG4gIH07XG59XG5cbmNsYXNzIFRpbWVvdXRXaXRoT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgd2FpdEZvcjogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIGFic29sdXRlVGltZW91dDogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB3aXRoT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZUlucHV0PGFueT4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFRpbWVvdXRXaXRoU3Vic2NyaWJlcihcbiAgICAgIHN1YnNjcmliZXIsIHRoaXMuYWJzb2x1dGVUaW1lb3V0LCB0aGlzLndhaXRGb3IsIHRoaXMud2l0aE9ic2VydmFibGUsIHRoaXMuc2NoZWR1bGVyXG4gICAgKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFRpbWVvdXRXaXRoU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiB7XG5cbiAgcHJpdmF0ZSBhY3Rpb246IFNjaGVkdWxlckFjdGlvbjxUaW1lb3V0V2l0aFN1YnNjcmliZXI8VCwgUj4+ID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBhYnNvbHV0ZVRpbWVvdXQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgd2FpdEZvcjogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHdpdGhPYnNlcnZhYmxlOiBPYnNlcnZhYmxlSW5wdXQ8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgdGhpcy5zY2hlZHVsZVRpbWVvdXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGRpc3BhdGNoVGltZW91dDxULCBSPihzdWJzY3JpYmVyOiBUaW1lb3V0V2l0aFN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICBjb25zdCB7IHdpdGhPYnNlcnZhYmxlIH0gPSBzdWJzY3JpYmVyO1xuICAgICg8YW55PiBzdWJzY3JpYmVyKS5fdW5zdWJzY3JpYmVBbmRSZWN5Y2xlKCk7XG4gICAgc3Vic2NyaWJlci5hZGQoc3Vic2NyaWJlVG9SZXN1bHQoc3Vic2NyaWJlciwgd2l0aE9ic2VydmFibGUpKTtcbiAgfVxuXG4gIHByaXZhdGUgc2NoZWR1bGVUaW1lb3V0KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgYWN0aW9uIH0gPSB0aGlzO1xuICAgIGlmIChhY3Rpb24pIHtcbiAgICAgIC8vIFJlY3ljbGUgdGhlIGFjdGlvbiBpZiB3ZSd2ZSBhbHJlYWR5IHNjaGVkdWxlZCBvbmUuIEFsbCB0aGUgcHJvZHVjdGlvblxuICAgICAgLy8gU2NoZWR1bGVyIEFjdGlvbnMgbXV0YXRlIHRoZWlyIHN0YXRlL2RlbGF5IHRpbWUgYW5kIHJldHVybiB0aGVtZXNlbHZlcy5cbiAgICAgIC8vIFZpcnR1YWxBY3Rpb25zIGFyZSBpbW11dGFibGUsIHNvIHRoZXkgY3JlYXRlIGFuZCByZXR1cm4gYSBjbG9uZS4gSW4gdGhpc1xuICAgICAgLy8gY2FzZSwgd2UgbmVlZCB0byBzZXQgdGhlIGFjdGlvbiByZWZlcmVuY2UgdG8gdGhlIG1vc3QgcmVjZW50IFZpcnR1YWxBY3Rpb24sXG4gICAgICAvLyB0byBlbnN1cmUgdGhhdCdzIHRoZSBvbmUgd2UgY2xvbmUgZnJvbSBuZXh0IHRpbWUuXG4gICAgICB0aGlzLmFjdGlvbiA9ICg8U2NoZWR1bGVyQWN0aW9uPFRpbWVvdXRXaXRoU3Vic2NyaWJlcjxULCBSPj4+IGFjdGlvbi5zY2hlZHVsZSh0aGlzLCB0aGlzLndhaXRGb3IpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGQodGhpcy5hY3Rpb24gPSAoPFNjaGVkdWxlckFjdGlvbjxUaW1lb3V0V2l0aFN1YnNjcmliZXI8VCwgUj4+PiB0aGlzLnNjaGVkdWxlci5zY2hlZHVsZTxUaW1lb3V0V2l0aFN1YnNjcmliZXI8VCwgUj4+KFxuICAgICAgICBUaW1lb3V0V2l0aFN1YnNjcmliZXIuZGlzcGF0Y2hUaW1lb3V0LCB0aGlzLndhaXRGb3IsIHRoaXNcbiAgICAgICkpKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuYWJzb2x1dGVUaW1lb3V0KSB7XG4gICAgICB0aGlzLnNjaGVkdWxlVGltZW91dCgpO1xuICAgIH1cbiAgICBzdXBlci5fbmV4dCh2YWx1ZSk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZSgpIHtcbiAgICB0aGlzLmFjdGlvbiA9IG51bGw7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBudWxsO1xuICAgIHRoaXMud2l0aE9ic2VydmFibGUgPSBudWxsO1xuICB9XG59XG4iXX0=