"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
exports.defaultThrottleConfig = {
    leading: true,
    trailing: false
};
/**
 * Emits a value from the source Observable, then ignores subsequent source
 * values for a duration determined by another Observable, then repeats this
 * process.
 *
 * <span class="informal">It's like {@link throttleTime}, but the silencing
 * duration is determined by a second Observable.</span>
 *
 * ![](throttle.png)
 *
 * `throttle` emits the source Observable values on the output Observable
 * when its internal timer is disabled, and ignores source values when the timer
 * is enabled. Initially, the timer is disabled. As soon as the first source
 * value arrives, it is forwarded to the output Observable, and then the timer
 * is enabled by calling the `durationSelector` function with the source value,
 * which returns the "duration" Observable. When the duration Observable emits a
 * value or completes, the timer is disabled, and this process repeats for the
 * next source value.
 *
 * ## Example
 * Emit clicks at a rate of at most one click per second
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(throttle(ev => interval(1000)));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link audit}
 * @see {@link debounce}
 * @see {@link delayWhen}
 * @see {@link sample}
 * @see {@link throttleTime}
 *
 * @param {function(value: T): SubscribableOrPromise} durationSelector A function
 * that receives a value from the source Observable, for computing the silencing
 * duration for each source value, returned as an Observable or a Promise.
 * @param {Object} config a configuration object to define `leading` and `trailing` behavior. Defaults
 * to `{ leading: true, trailing: false }`.
 * @return {Observable<T>} An Observable that performs the throttle operation to
 * limit the rate of emissions from the source.
 * @method throttle
 * @owner Observable
 */
function throttle(durationSelector, config) {
    if (config === void 0) { config = exports.defaultThrottleConfig; }
    return function (source) { return source.lift(new ThrottleOperator(durationSelector, config.leading, config.trailing)); };
}
exports.throttle = throttle;
var ThrottleOperator = /** @class */ (function () {
    function ThrottleOperator(durationSelector, leading, trailing) {
        this.durationSelector = durationSelector;
        this.leading = leading;
        this.trailing = trailing;
    }
    ThrottleOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ThrottleSubscriber(subscriber, this.durationSelector, this.leading, this.trailing));
    };
    return ThrottleOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc
 * @ignore
 * @extends {Ignored}
 */
var ThrottleSubscriber = /** @class */ (function (_super) {
    __extends(ThrottleSubscriber, _super);
    function ThrottleSubscriber(destination, durationSelector, _leading, _trailing) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.durationSelector = durationSelector;
        _this._leading = _leading;
        _this._trailing = _trailing;
        _this._hasValue = false;
        return _this;
    }
    ThrottleSubscriber.prototype._next = function (value) {
        this._hasValue = true;
        this._sendValue = value;
        if (!this._throttled) {
            if (this._leading) {
                this.send();
            }
            else {
                this.throttle(value);
            }
        }
    };
    ThrottleSubscriber.prototype.send = function () {
        var _a = this, _hasValue = _a._hasValue, _sendValue = _a._sendValue;
        if (_hasValue) {
            this.destination.next(_sendValue);
            this.throttle(_sendValue);
        }
        this._hasValue = false;
        this._sendValue = null;
    };
    ThrottleSubscriber.prototype.throttle = function (value) {
        var duration = this.tryDurationSelector(value);
        if (duration) {
            this.add(this._throttled = subscribeToResult_1.subscribeToResult(this, duration));
        }
    };
    ThrottleSubscriber.prototype.tryDurationSelector = function (value) {
        try {
            return this.durationSelector(value);
        }
        catch (err) {
            this.destination.error(err);
            return null;
        }
    };
    ThrottleSubscriber.prototype.throttlingDone = function () {
        var _a = this, _throttled = _a._throttled, _trailing = _a._trailing;
        if (_throttled) {
            _throttled.unsubscribe();
        }
        this._throttled = null;
        if (_trailing) {
            this.send();
        }
    };
    ThrottleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.throttlingDone();
    };
    ThrottleSubscriber.prototype.notifyComplete = function () {
        this.throttlingDone();
    };
    return ThrottleSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyb3R0bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy90aHJvdHRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBLHNEQUFxRDtBQUVyRCwrREFBOEQ7QUFTakQsUUFBQSxxQkFBcUIsR0FBbUI7SUFDbkQsT0FBTyxFQUFFLElBQUk7SUFDYixRQUFRLEVBQUUsS0FBSztDQUNoQixDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBDRztBQUNILFNBQWdCLFFBQVEsQ0FBSSxnQkFBMEQsRUFDMUQsTUFBOEM7SUFBOUMsdUJBQUEsRUFBQSxTQUF5Qiw2QkFBcUI7SUFDeEUsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBcEYsQ0FBb0YsQ0FBQztBQUN6SCxDQUFDO0FBSEQsNEJBR0M7QUFFRDtJQUNFLDBCQUFvQixnQkFBMEQsRUFDMUQsT0FBZ0IsRUFDaEIsUUFBaUI7UUFGakIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUEwQztRQUMxRCxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLGFBQVEsR0FBUixRQUFRLENBQVM7SUFDckMsQ0FBQztJQUVELCtCQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUNyQixJQUFJLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQ3ZGLENBQUM7SUFDSixDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQztBQUVEOzs7O0dBSUc7QUFDSDtJQUF1QyxzQ0FBcUI7SUFLMUQsNEJBQXNCLFdBQTBCLEVBQzVCLGdCQUE2RCxFQUM3RCxRQUFpQixFQUNqQixTQUFrQjtRQUh0QyxZQUlFLGtCQUFNLFdBQVcsQ0FBQyxTQUNuQjtRQUxxQixpQkFBVyxHQUFYLFdBQVcsQ0FBZTtRQUM1QixzQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQTZDO1FBQzdELGNBQVEsR0FBUixRQUFRLENBQVM7UUFDakIsZUFBUyxHQUFULFNBQVMsQ0FBUztRQUw5QixlQUFTLEdBQUcsS0FBSyxDQUFDOztJQU8xQixDQUFDO0lBRVMsa0NBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBRXhCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2I7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN0QjtTQUNGO0lBQ0gsQ0FBQztJQUVPLGlDQUFJLEdBQVo7UUFDUSxJQUFBLFNBQWdDLEVBQTlCLHdCQUFTLEVBQUUsMEJBQW1CLENBQUM7UUFDdkMsSUFBSSxTQUFTLEVBQUU7WUFDYixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzNCO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUVPLHFDQUFRLEdBQWhCLFVBQWlCLEtBQVE7UUFDdkIsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLHFDQUFpQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQy9EO0lBQ0gsQ0FBQztJQUVPLGdEQUFtQixHQUEzQixVQUE0QixLQUFRO1FBQ2xDLElBQUk7WUFDRixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNyQztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsT0FBTyxJQUFJLENBQUM7U0FDYjtJQUNILENBQUM7SUFFTywyQ0FBYyxHQUF0QjtRQUNRLElBQUEsU0FBZ0MsRUFBOUIsMEJBQVUsRUFBRSx3QkFBa0IsQ0FBQztRQUN2QyxJQUFJLFVBQVUsRUFBRTtZQUNkLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUMxQjtRQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBRXZCLElBQUksU0FBUyxFQUFFO1lBQ2IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRUQsdUNBQVUsR0FBVixVQUFXLFVBQWEsRUFBRSxVQUFhLEVBQzVCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBK0I7UUFDeEMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCwyQ0FBYyxHQUFkO1FBQ0UsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUF4RUQsQ0FBdUMsaUNBQWUsR0F3RXJEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuXG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5cbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgU3Vic2NyaWJhYmxlT3JQcm9taXNlLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRocm90dGxlQ29uZmlnIHtcbiAgbGVhZGluZz86IGJvb2xlYW47XG4gIHRyYWlsaW5nPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRUaHJvdHRsZUNvbmZpZzogVGhyb3R0bGVDb25maWcgPSB7XG4gIGxlYWRpbmc6IHRydWUsXG4gIHRyYWlsaW5nOiBmYWxzZVxufTtcblxuLyoqXG4gKiBFbWl0cyBhIHZhbHVlIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCB0aGVuIGlnbm9yZXMgc3Vic2VxdWVudCBzb3VyY2VcbiAqIHZhbHVlcyBmb3IgYSBkdXJhdGlvbiBkZXRlcm1pbmVkIGJ5IGFub3RoZXIgT2JzZXJ2YWJsZSwgdGhlbiByZXBlYXRzIHRoaXNcbiAqIHByb2Nlc3MuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgdGhyb3R0bGVUaW1lfSwgYnV0IHRoZSBzaWxlbmNpbmdcbiAqIGR1cmF0aW9uIGlzIGRldGVybWluZWQgYnkgYSBzZWNvbmQgT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogIVtdKHRocm90dGxlLnBuZylcbiAqXG4gKiBgdGhyb3R0bGVgIGVtaXRzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB2YWx1ZXMgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlXG4gKiB3aGVuIGl0cyBpbnRlcm5hbCB0aW1lciBpcyBkaXNhYmxlZCwgYW5kIGlnbm9yZXMgc291cmNlIHZhbHVlcyB3aGVuIHRoZSB0aW1lclxuICogaXMgZW5hYmxlZC4gSW5pdGlhbGx5LCB0aGUgdGltZXIgaXMgZGlzYWJsZWQuIEFzIHNvb24gYXMgdGhlIGZpcnN0IHNvdXJjZVxuICogdmFsdWUgYXJyaXZlcywgaXQgaXMgZm9yd2FyZGVkIHRvIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSwgYW5kIHRoZW4gdGhlIHRpbWVyXG4gKiBpcyBlbmFibGVkIGJ5IGNhbGxpbmcgdGhlIGBkdXJhdGlvblNlbGVjdG9yYCBmdW5jdGlvbiB3aXRoIHRoZSBzb3VyY2UgdmFsdWUsXG4gKiB3aGljaCByZXR1cm5zIHRoZSBcImR1cmF0aW9uXCIgT2JzZXJ2YWJsZS4gV2hlbiB0aGUgZHVyYXRpb24gT2JzZXJ2YWJsZSBlbWl0cyBhXG4gKiB2YWx1ZSBvciBjb21wbGV0ZXMsIHRoZSB0aW1lciBpcyBkaXNhYmxlZCwgYW5kIHRoaXMgcHJvY2VzcyByZXBlYXRzIGZvciB0aGVcbiAqIG5leHQgc291cmNlIHZhbHVlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEVtaXQgY2xpY2tzIGF0IGEgcmF0ZSBvZiBhdCBtb3N0IG9uZSBjbGljayBwZXIgc2Vjb25kXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUodGhyb3R0bGUoZXYgPT4gaW50ZXJ2YWwoMTAwMCkpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBhdWRpdH1cbiAqIEBzZWUge0BsaW5rIGRlYm91bmNlfVxuICogQHNlZSB7QGxpbmsgZGVsYXlXaGVufVxuICogQHNlZSB7QGxpbmsgc2FtcGxlfVxuICogQHNlZSB7QGxpbmsgdGhyb3R0bGVUaW1lfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQpOiBTdWJzY3JpYmFibGVPclByb21pc2V9IGR1cmF0aW9uU2VsZWN0b3IgQSBmdW5jdGlvblxuICogdGhhdCByZWNlaXZlcyBhIHZhbHVlIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCBmb3IgY29tcHV0aW5nIHRoZSBzaWxlbmNpbmdcbiAqIGR1cmF0aW9uIGZvciBlYWNoIHNvdXJjZSB2YWx1ZSwgcmV0dXJuZWQgYXMgYW4gT2JzZXJ2YWJsZSBvciBhIFByb21pc2UuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIGEgY29uZmlndXJhdGlvbiBvYmplY3QgdG8gZGVmaW5lIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBiZWhhdmlvci4gRGVmYXVsdHNcbiAqIHRvIGB7IGxlYWRpbmc6IHRydWUsIHRyYWlsaW5nOiBmYWxzZSB9YC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IEFuIE9ic2VydmFibGUgdGhhdCBwZXJmb3JtcyB0aGUgdGhyb3R0bGUgb3BlcmF0aW9uIHRvXG4gKiBsaW1pdCB0aGUgcmF0ZSBvZiBlbWlzc2lvbnMgZnJvbSB0aGUgc291cmNlLlxuICogQG1ldGhvZCB0aHJvdHRsZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm90dGxlPFQ+KGR1cmF0aW9uU2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gU3Vic2NyaWJhYmxlT3JQcm9taXNlPGFueT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBUaHJvdHRsZUNvbmZpZyA9IGRlZmF1bHRUaHJvdHRsZUNvbmZpZyk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgVGhyb3R0bGVPcGVyYXRvcihkdXJhdGlvblNlbGVjdG9yLCBjb25maWcubGVhZGluZywgY29uZmlnLnRyYWlsaW5nKSk7XG59XG5cbmNsYXNzIFRocm90dGxlT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZHVyYXRpb25TZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBTdWJzY3JpYmFibGVPclByb21pc2U8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBsZWFkaW5nOiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHRyYWlsaW5nOiBib29sZWFuKSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUoXG4gICAgICBuZXcgVGhyb3R0bGVTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuZHVyYXRpb25TZWxlY3RvciwgdGhpcy5sZWFkaW5nLCB0aGlzLnRyYWlsaW5nKVxuICAgICk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgVGhyb3R0bGVTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcbiAgcHJpdmF0ZSBfdGhyb3R0bGVkOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX3NlbmRWYWx1ZTogVDtcbiAgcHJpdmF0ZSBfaGFzVmFsdWUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgZHVyYXRpb25TZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBTdWJzY3JpYmFibGVPclByb21pc2U8bnVtYmVyPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbGVhZGluZzogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdHJhaWxpbmc6IGJvb2xlYW4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLl9oYXNWYWx1ZSA9IHRydWU7XG4gICAgdGhpcy5fc2VuZFZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAoIXRoaXMuX3Rocm90dGxlZCkge1xuICAgICAgaWYgKHRoaXMuX2xlYWRpbmcpIHtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRocm90dGxlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNlbmQoKSB7XG4gICAgY29uc3QgeyBfaGFzVmFsdWUsIF9zZW5kVmFsdWUgfSA9IHRoaXM7XG4gICAgaWYgKF9oYXNWYWx1ZSkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KF9zZW5kVmFsdWUpO1xuICAgICAgdGhpcy50aHJvdHRsZShfc2VuZFZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy5faGFzVmFsdWUgPSBmYWxzZTtcbiAgICB0aGlzLl9zZW5kVmFsdWUgPSBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSB0aHJvdHRsZSh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy50cnlEdXJhdGlvblNlbGVjdG9yKHZhbHVlKTtcbiAgICBpZiAoZHVyYXRpb24pIHtcbiAgICAgIHRoaXMuYWRkKHRoaXMuX3Rocm90dGxlZCA9IHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIGR1cmF0aW9uKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cnlEdXJhdGlvblNlbGVjdG9yKHZhbHVlOiBUKTogU3Vic2NyaWJhYmxlT3JQcm9taXNlPGFueT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy5kdXJhdGlvblNlbGVjdG9yKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdGhyb3R0bGluZ0RvbmUoKSB7XG4gICAgY29uc3QgeyBfdGhyb3R0bGVkLCBfdHJhaWxpbmcgfSA9IHRoaXM7XG4gICAgaWYgKF90aHJvdHRsZWQpIHtcbiAgICAgIF90aHJvdHRsZWQudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5fdGhyb3R0bGVkID0gbnVsbDtcblxuICAgIGlmIChfdHJhaWxpbmcpIHtcbiAgICAgIHRoaXMuc2VuZCgpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogUixcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgdGhpcy50aHJvdHRsaW5nRG9uZSgpO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy50aHJvdHRsaW5nRG9uZSgpO1xuICB9XG59XG4iXX0=