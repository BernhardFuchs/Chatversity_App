"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
var Notification_1 = require("../Notification");
/**
 * Represents all of the notifications from the source Observable as `next`
 * emissions marked with their original types within {@link Notification}
 * objects.
 *
 * <span class="informal">Wraps `next`, `error` and `complete` emissions in
 * {@link Notification} objects, emitted as `next` on the output Observable.
 * </span>
 *
 * ![](materialize.png)
 *
 * `materialize` returns an Observable that emits a `next` notification for each
 * `next`, `error`, or `complete` emission of the source Observable. When the
 * source Observable emits `complete`, the output Observable will emit `next` as
 * a Notification of type "complete", and then it will emit `complete` as well.
 * When the source Observable emits `error`, the output will emit `next` as a
 * Notification of type "error", and then `complete`.
 *
 * This operator is useful for producing metadata of the source Observable, to
 * be consumed as `next` emissions. Use it in conjunction with
 * {@link dematerialize}.
 *
 * ## Example
 * Convert a faulty Observable to an Observable of Notifications
 * ```javascript
 * const letters = of('a', 'b', 13, 'd');
 * const upperCase = letters.pipe(map(x => x.toUpperCase()));
 * const materialized = upperCase.pipe(materialize());
 * materialized.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // - Notification {kind: "N", value: "A", error: undefined, hasValue: true}
 * // - Notification {kind: "N", value: "B", error: undefined, hasValue: true}
 * // - Notification {kind: "E", value: undefined, error: TypeError:
 * //   x.toUpperCase is not a function at MapSubscriber.letters.map.x
 * //   [as project] (http://1…, hasValue: false}
 * ```
 *
 * @see {@link Notification}
 * @see {@link dematerialize}
 *
 * @return {Observable<Notification<T>>} An Observable that emits
 * {@link Notification} objects that wrap the original emissions from the source
 * Observable with metadata.
 * @method materialize
 * @owner Observable
 */
function materialize() {
    return function materializeOperatorFunction(source) {
        return source.lift(new MaterializeOperator());
    };
}
exports.materialize = materialize;
var MaterializeOperator = /** @class */ (function () {
    function MaterializeOperator() {
    }
    MaterializeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MaterializeSubscriber(subscriber));
    };
    return MaterializeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MaterializeSubscriber = /** @class */ (function (_super) {
    __extends(MaterializeSubscriber, _super);
    function MaterializeSubscriber(destination) {
        return _super.call(this, destination) || this;
    }
    MaterializeSubscriber.prototype._next = function (value) {
        this.destination.next(Notification_1.Notification.createNext(value));
    };
    MaterializeSubscriber.prototype._error = function (err) {
        var destination = this.destination;
        destination.next(Notification_1.Notification.createError(err));
        destination.complete();
    };
    MaterializeSubscriber.prototype._complete = function () {
        var destination = this.destination;
        destination.next(Notification_1.Notification.createComplete());
        destination.complete();
    };
    return MaterializeSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9tYXRlcmlhbGl6ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDRDQUEyQztBQUMzQyxnREFBK0M7QUFHL0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Q0c7QUFDSCxTQUFnQixXQUFXO0lBQ3pCLE9BQU8sU0FBUywyQkFBMkIsQ0FBQyxNQUFxQjtRQUMvRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxtQkFBbUIsRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUpELGtDQUlDO0FBRUQ7SUFBQTtJQUlBLENBQUM7SUFIQyxrQ0FBSSxHQUFKLFVBQUssVUFBdUMsRUFBRSxNQUFXO1FBQ3ZELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFFRDs7OztHQUlHO0FBQ0g7SUFBdUMseUNBQWE7SUFDbEQsK0JBQVksV0FBd0M7ZUFDbEQsa0JBQU0sV0FBVyxDQUFDO0lBQ3BCLENBQUM7SUFFUyxxQ0FBSyxHQUFmLFVBQWdCLEtBQVE7UUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsMkJBQVksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRVMsc0NBQU0sR0FBaEIsVUFBaUIsR0FBUTtRQUN2QixJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3JDLFdBQVcsQ0FBQyxJQUFJLENBQUMsMkJBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNoRCxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVTLHlDQUFTLEdBQW5CO1FBQ0UsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNyQyxXQUFXLENBQUMsSUFBSSxDQUFDLDJCQUFZLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUNoRCxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUNILDRCQUFDO0FBQUQsQ0FBQyxBQXBCRCxDQUF1Qyx1QkFBVSxHQW9CaEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbiB9IGZyb20gJy4uL05vdGlmaWNhdGlvbic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYWxsIG9mIHRoZSBub3RpZmljYXRpb25zIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGFzIGBuZXh0YFxuICogZW1pc3Npb25zIG1hcmtlZCB3aXRoIHRoZWlyIG9yaWdpbmFsIHR5cGVzIHdpdGhpbiB7QGxpbmsgTm90aWZpY2F0aW9ufVxuICogb2JqZWN0cy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+V3JhcHMgYG5leHRgLCBgZXJyb3JgIGFuZCBgY29tcGxldGVgIGVtaXNzaW9ucyBpblxuICoge0BsaW5rIE5vdGlmaWNhdGlvbn0gb2JqZWN0cywgZW1pdHRlZCBhcyBgbmV4dGAgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICogPC9zcGFuPlxuICpcbiAqICFbXShtYXRlcmlhbGl6ZS5wbmcpXG4gKlxuICogYG1hdGVyaWFsaXplYCByZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhIGBuZXh0YCBub3RpZmljYXRpb24gZm9yIGVhY2hcbiAqIGBuZXh0YCwgYGVycm9yYCwgb3IgYGNvbXBsZXRlYCBlbWlzc2lvbiBvZiB0aGUgc291cmNlIE9ic2VydmFibGUuIFdoZW4gdGhlXG4gKiBzb3VyY2UgT2JzZXJ2YWJsZSBlbWl0cyBgY29tcGxldGVgLCB0aGUgb3V0cHV0IE9ic2VydmFibGUgd2lsbCBlbWl0IGBuZXh0YCBhc1xuICogYSBOb3RpZmljYXRpb24gb2YgdHlwZSBcImNvbXBsZXRlXCIsIGFuZCB0aGVuIGl0IHdpbGwgZW1pdCBgY29tcGxldGVgIGFzIHdlbGwuXG4gKiBXaGVuIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBlbWl0cyBgZXJyb3JgLCB0aGUgb3V0cHV0IHdpbGwgZW1pdCBgbmV4dGAgYXMgYVxuICogTm90aWZpY2F0aW9uIG9mIHR5cGUgXCJlcnJvclwiLCBhbmQgdGhlbiBgY29tcGxldGVgLlxuICpcbiAqIFRoaXMgb3BlcmF0b3IgaXMgdXNlZnVsIGZvciBwcm9kdWNpbmcgbWV0YWRhdGEgb2YgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCB0b1xuICogYmUgY29uc3VtZWQgYXMgYG5leHRgIGVtaXNzaW9ucy4gVXNlIGl0IGluIGNvbmp1bmN0aW9uIHdpdGhcbiAqIHtAbGluayBkZW1hdGVyaWFsaXplfS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBDb252ZXJ0IGEgZmF1bHR5IE9ic2VydmFibGUgdG8gYW4gT2JzZXJ2YWJsZSBvZiBOb3RpZmljYXRpb25zXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBsZXR0ZXJzID0gb2YoJ2EnLCAnYicsIDEzLCAnZCcpO1xuICogY29uc3QgdXBwZXJDYXNlID0gbGV0dGVycy5waXBlKG1hcCh4ID0+IHgudG9VcHBlckNhc2UoKSkpO1xuICogY29uc3QgbWF0ZXJpYWxpemVkID0gdXBwZXJDYXNlLnBpcGUobWF0ZXJpYWxpemUoKSk7XG4gKiBtYXRlcmlhbGl6ZWQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZzpcbiAqIC8vIC0gTm90aWZpY2F0aW9uIHtraW5kOiBcIk5cIiwgdmFsdWU6IFwiQVwiLCBlcnJvcjogdW5kZWZpbmVkLCBoYXNWYWx1ZTogdHJ1ZX1cbiAqIC8vIC0gTm90aWZpY2F0aW9uIHtraW5kOiBcIk5cIiwgdmFsdWU6IFwiQlwiLCBlcnJvcjogdW5kZWZpbmVkLCBoYXNWYWx1ZTogdHJ1ZX1cbiAqIC8vIC0gTm90aWZpY2F0aW9uIHtraW5kOiBcIkVcIiwgdmFsdWU6IHVuZGVmaW5lZCwgZXJyb3I6IFR5cGVFcnJvcjpcbiAqIC8vICAgeC50b1VwcGVyQ2FzZSBpcyBub3QgYSBmdW5jdGlvbiBhdCBNYXBTdWJzY3JpYmVyLmxldHRlcnMubWFwLnhcbiAqIC8vICAgW2FzIHByb2plY3RdIChodHRwOi8vMeKApiwgaGFzVmFsdWU6IGZhbHNlfVxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgTm90aWZpY2F0aW9ufVxuICogQHNlZSB7QGxpbmsgZGVtYXRlcmlhbGl6ZX1cbiAqXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPE5vdGlmaWNhdGlvbjxUPj59IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0c1xuICoge0BsaW5rIE5vdGlmaWNhdGlvbn0gb2JqZWN0cyB0aGF0IHdyYXAgdGhlIG9yaWdpbmFsIGVtaXNzaW9ucyBmcm9tIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgd2l0aCBtZXRhZGF0YS5cbiAqIEBtZXRob2QgbWF0ZXJpYWxpemVcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXRlcmlhbGl6ZTxUPigpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIE5vdGlmaWNhdGlvbjxUPj4ge1xuICByZXR1cm4gZnVuY3Rpb24gbWF0ZXJpYWxpemVPcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgTWF0ZXJpYWxpemVPcGVyYXRvcigpKTtcbiAgfTtcbn1cblxuY2xhc3MgTWF0ZXJpYWxpemVPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIE5vdGlmaWNhdGlvbjxUPj4ge1xuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8Tm90aWZpY2F0aW9uPFQ+Piwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBNYXRlcmlhbGl6ZVN1YnNjcmliZXIoc3Vic2NyaWJlcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBNYXRlcmlhbGl6ZVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Tm90aWZpY2F0aW9uPFQ+Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChOb3RpZmljYXRpb24uY3JlYXRlTmV4dCh2YWx1ZSkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSkge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICBkZXN0aW5hdGlvbi5uZXh0KE5vdGlmaWNhdGlvbi5jcmVhdGVFcnJvcihlcnIpKTtcbiAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpIHtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb247XG4gICAgZGVzdGluYXRpb24ubmV4dChOb3RpZmljYXRpb24uY3JlYXRlQ29tcGxldGUoKSk7XG4gICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxufVxuIl19