"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OuterSubscriber_1 = require("../OuterSubscriber");
var InnerSubscriber_1 = require("../InnerSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
function catchError(selector) {
    return function catchErrorOperatorFunction(source) {
        var operator = new CatchOperator(selector);
        var caught = source.lift(operator);
        return (operator.caught = caught);
    };
}
exports.catchError = catchError;
var CatchOperator = /** @class */ (function () {
    function CatchOperator(selector) {
        this.selector = selector;
    }
    CatchOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
    };
    return CatchOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var CatchSubscriber = /** @class */ (function (_super) {
    __extends(CatchSubscriber, _super);
    function CatchSubscriber(destination, selector, caught) {
        var _this = _super.call(this, destination) || this;
        _this.selector = selector;
        _this.caught = caught;
        return _this;
    }
    // NOTE: overriding `error` instead of `_error` because we don't want
    // to have this flag this subscriber as `isStopped`. We can mimic the
    // behavior of the RetrySubscriber (from the `retry` operator), where
    // we unsubscribe from our source chain, reset our Subscriber flags,
    // then subscribe to the selector result.
    CatchSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var result = void 0;
            try {
                result = this.selector(err, this.caught);
            }
            catch (err2) {
                _super.prototype.error.call(this, err2);
                return;
            }
            this._unsubscribeAndRecycle();
            var innerSubscriber = new InnerSubscriber_1.InnerSubscriber(this, undefined, undefined);
            this.add(innerSubscriber);
            subscribeToResult_1.subscribeToResult(this, result, undefined, undefined, innerSubscriber);
        }
    };
    return CatchSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0Y2hFcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2NhdGNoRXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxzREFBbUQ7QUFDbkQsc0RBQXFEO0FBQ3JELCtEQUE0RDtBQXdFNUQsU0FBZ0IsVUFBVSxDQUFPLFFBQWlFO0lBQ2hHLE9BQU8sU0FBUywwQkFBMEIsQ0FBQyxNQUFxQjtRQUM5RCxJQUFNLFFBQVEsR0FBRyxJQUFJLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QyxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE1BQXVCLENBQUMsQ0FBQztJQUNyRCxDQUFDLENBQUM7QUFDSixDQUFDO0FBTkQsZ0NBTUM7QUFFRDtJQUdFLHVCQUFvQixRQUFxRTtRQUFyRSxhQUFRLEdBQVIsUUFBUSxDQUE2RDtJQUN6RixDQUFDO0lBRUQsNEJBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQVRELElBU0M7QUFFRDs7OztHQUlHO0FBQ0g7SUFBb0MsbUNBQXlCO0lBQzNELHlCQUFZLFdBQTRCLEVBQ3BCLFFBQXFFLEVBQ3JFLE1BQXFCO1FBRnpDLFlBR0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBSG1CLGNBQVEsR0FBUixRQUFRLENBQTZEO1FBQ3JFLFlBQU0sR0FBTixNQUFNLENBQWU7O0lBRXpDLENBQUM7SUFFRCxxRUFBcUU7SUFDckUscUVBQXFFO0lBQ3JFLHFFQUFxRTtJQUNyRSxvRUFBb0U7SUFDcEUseUNBQXlDO0lBQ3pDLCtCQUFLLEdBQUwsVUFBTSxHQUFRO1FBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxNQUFNLFNBQUssQ0FBQztZQUNoQixJQUFJO2dCQUNGLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDMUM7WUFBQyxPQUFPLElBQUksRUFBRTtnQkFDYixpQkFBTSxLQUFLLFlBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xCLE9BQU87YUFDUjtZQUNELElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBQzlCLElBQU0sZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDMUIscUNBQWlCLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1NBQ3hFO0lBQ0gsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQTNCRCxDQUFvQyxpQ0FBZSxHQTJCbEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge09wZXJhdG9yfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQge1N1YnNjcmliZXJ9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcblxuaW1wb3J0IHtPdXRlclN1YnNjcmliZXJ9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHtzdWJzY3JpYmVUb1Jlc3VsdH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQge09ic2VydmFibGVJbnB1dCwgT3BlcmF0b3JGdW5jdGlvbiwgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9ufSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQ2F0Y2hlcyBlcnJvcnMgb24gdGhlIG9ic2VydmFibGUgdG8gYmUgaGFuZGxlZCBieSByZXR1cm5pbmcgYSBuZXcgb2JzZXJ2YWJsZSBvciB0aHJvd2luZyBhbiBlcnJvci5cbiAqXG4gKiAhW10oY2F0Y2gucG5nKVxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiBDb250aW51ZXMgd2l0aCBhIGRpZmZlcmVudCBPYnNlcnZhYmxlIHdoZW4gdGhlcmUncyBhbiBlcnJvclxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIG9mKDEsIDIsIDMsIDQsIDUpLnBpcGUoXG4gKiAgICAgbWFwKG4gPT4ge1xuICogICBcdCAgIGlmIChuID09IDQpIHtcbiAqIFx0ICAgICAgIHRocm93ICdmb3VyISc7XG4gKiAgICAgICB9XG4gKlx0ICAgICByZXR1cm4gbjtcbiAqICAgICB9KSxcbiAqICAgICBjYXRjaEVycm9yKGVyciA9PiBvZignSScsICdJSScsICdJSUknLCAnSVYnLCAnVicpKSxcbiAqICAgKVxuICogICAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogICAvLyAxLCAyLCAzLCBJLCBJSSwgSUlJLCBJViwgVlxuICogYGBgXG4gKlxuICogUmV0cmllcyB0aGUgY2F1Z2h0IHNvdXJjZSBPYnNlcnZhYmxlIGFnYWluIGluIGNhc2Ugb2YgZXJyb3IsIHNpbWlsYXIgdG8gcmV0cnkoKSBvcGVyYXRvclxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIG9mKDEsIDIsIDMsIDQsIDUpLnBpcGUoXG4gKiAgICAgbWFwKG4gPT4ge1xuICogICBcdCAgIGlmIChuID09PSA0KSB7XG4gKiAgIFx0ICAgICB0aHJvdyAnZm91ciEnO1xuICogICAgICAgfVxuICogXHQgICAgIHJldHVybiBuO1xuICogICAgIH0pLFxuICogICAgIGNhdGNoRXJyb3IoKGVyciwgY2F1Z2h0KSA9PiBjYXVnaHQpLFxuICogICAgIHRha2UoMzApLFxuICogICApXG4gKiAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiAgIC8vIDEsIDIsIDMsIDEsIDIsIDMsIC4uLlxuICogYGBgXG4gKlxuICogVGhyb3dzIGEgbmV3IGVycm9yIHdoZW4gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRocm93cyBhbiBlcnJvclxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIG9mKDEsIDIsIDMsIDQsIDUpLnBpcGUoXG4gKiAgICAgbWFwKG4gPT4ge1xuICogICAgICAgaWYgKG4gPT0gNCkge1xuICogICAgICAgICB0aHJvdyAnZm91ciEnO1xuICogICAgICAgfVxuICogICAgICAgcmV0dXJuIG47XG4gKiAgICAgfSksXG4gKiAgICAgY2F0Y2hFcnJvcihlcnIgPT4ge1xuICogICAgICAgdGhyb3cgJ2Vycm9yIGluIHNvdXJjZS4gRGV0YWlsczogJyArIGVycjtcbiAqICAgICB9KSxcbiAqICAgKVxuICogICAuc3Vic2NyaWJlKFxuICogICAgIHggPT4gY29uc29sZS5sb2coeCksXG4gKiAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAqICAgKTtcbiAqICAgLy8gMSwgMiwgMywgZXJyb3IgaW4gc291cmNlLiBEZXRhaWxzOiBmb3VyIVxuICogYGBgXG4gKlxuICogIEBwYXJhbSB7ZnVuY3Rpb259IHNlbGVjdG9yIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhcyBhcmd1bWVudHMgYGVycmAsIHdoaWNoIGlzIHRoZSBlcnJvciwgYW5kIGBjYXVnaHRgLCB3aGljaFxuICogIGlzIHRoZSBzb3VyY2Ugb2JzZXJ2YWJsZSwgaW4gY2FzZSB5b3UnZCBsaWtlIHRvIFwicmV0cnlcIiB0aGF0IG9ic2VydmFibGUgYnkgcmV0dXJuaW5nIGl0IGFnYWluLiBXaGF0ZXZlciBvYnNlcnZhYmxlXG4gKiAgaXMgcmV0dXJuZWQgYnkgdGhlIGBzZWxlY3RvcmAgd2lsbCBiZSB1c2VkIHRvIGNvbnRpbnVlIHRoZSBvYnNlcnZhYmxlIGNoYWluLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSB0aGF0IG9yaWdpbmF0ZXMgZnJvbSBlaXRoZXIgdGhlIHNvdXJjZSBvciB0aGUgb2JzZXJ2YWJsZSByZXR1cm5lZCBieSB0aGVcbiAqICBjYXRjaCBgc2VsZWN0b3JgIGZ1bmN0aW9uLlxuICogQG5hbWUgY2F0Y2hFcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gY2F0Y2hFcnJvcjxUPihzZWxlY3RvcjogKGVycjogYW55LCBjYXVnaHQ6IE9ic2VydmFibGU8VD4pID0+IG5ldmVyKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGNhdGNoRXJyb3I8VCwgUj4oc2VsZWN0b3I6IChlcnI6IGFueSwgY2F1Z2h0OiBPYnNlcnZhYmxlPFQ+KSA9PiBPYnNlcnZhYmxlSW5wdXQ8Uj4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFQgfCBSPjtcbmV4cG9ydCBmdW5jdGlvbiBjYXRjaEVycm9yPFQsIFI+KHNlbGVjdG9yOiAoZXJyOiBhbnksIGNhdWdodDogT2JzZXJ2YWJsZTxUPikgPT4gT2JzZXJ2YWJsZUlucHV0PFI+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgUj4ge1xuICByZXR1cm4gZnVuY3Rpb24gY2F0Y2hFcnJvck9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogT2JzZXJ2YWJsZTxUIHwgUj4ge1xuICAgIGNvbnN0IG9wZXJhdG9yID0gbmV3IENhdGNoT3BlcmF0b3Ioc2VsZWN0b3IpO1xuICAgIGNvbnN0IGNhdWdodCA9IHNvdXJjZS5saWZ0KG9wZXJhdG9yKTtcbiAgICByZXR1cm4gKG9wZXJhdG9yLmNhdWdodCA9IGNhdWdodCBhcyBPYnNlcnZhYmxlPFQ+KTtcbiAgfTtcbn1cblxuY2xhc3MgQ2F0Y2hPcGVyYXRvcjxULCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQgfCBSPiB7XG4gIGNhdWdodDogT2JzZXJ2YWJsZTxUPjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNlbGVjdG9yOiAoZXJyOiBhbnksIGNhdWdodDogT2JzZXJ2YWJsZTxUPikgPT4gT2JzZXJ2YWJsZUlucHV0PFQgfCBSPikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IENhdGNoU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnNlbGVjdG9yLCB0aGlzLmNhdWdodCkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBDYXRjaFN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgVCB8IFI+IHtcbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzZWxlY3RvcjogKGVycjogYW55LCBjYXVnaHQ6IE9ic2VydmFibGU8VD4pID0+IE9ic2VydmFibGVJbnB1dDxUIHwgUj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY2F1Z2h0OiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgLy8gTk9URTogb3ZlcnJpZGluZyBgZXJyb3JgIGluc3RlYWQgb2YgYF9lcnJvcmAgYmVjYXVzZSB3ZSBkb24ndCB3YW50XG4gIC8vIHRvIGhhdmUgdGhpcyBmbGFnIHRoaXMgc3Vic2NyaWJlciBhcyBgaXNTdG9wcGVkYC4gV2UgY2FuIG1pbWljIHRoZVxuICAvLyBiZWhhdmlvciBvZiB0aGUgUmV0cnlTdWJzY3JpYmVyIChmcm9tIHRoZSBgcmV0cnlgIG9wZXJhdG9yKSwgd2hlcmVcbiAgLy8gd2UgdW5zdWJzY3JpYmUgZnJvbSBvdXIgc291cmNlIGNoYWluLCByZXNldCBvdXIgU3Vic2NyaWJlciBmbGFncyxcbiAgLy8gdGhlbiBzdWJzY3JpYmUgdG8gdGhlIHNlbGVjdG9yIHJlc3VsdC5cbiAgZXJyb3IoZXJyOiBhbnkpIHtcbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSB0aGlzLnNlbGVjdG9yKGVyciwgdGhpcy5jYXVnaHQpO1xuICAgICAgfSBjYXRjaCAoZXJyMikge1xuICAgICAgICBzdXBlci5lcnJvcihlcnIyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fdW5zdWJzY3JpYmVBbmRSZWN5Y2xlKCk7XG4gICAgICBjb25zdCBpbm5lclN1YnNjcmliZXIgPSBuZXcgSW5uZXJTdWJzY3JpYmVyKHRoaXMsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgIHRoaXMuYWRkKGlubmVyU3Vic2NyaWJlcik7XG4gICAgICBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCByZXN1bHQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBpbm5lclN1YnNjcmliZXIpO1xuICAgIH1cbiAgfVxufVxuIl19