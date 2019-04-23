"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
/* tslint:enable:max-line-length */
/**
 * Emits a given value if the source Observable completes without emitting any
 * `next` value, otherwise mirrors the source Observable.
 *
 * <span class="informal">If the source Observable turns out to be empty, then
 * this operator will emit a default value.</span>
 *
 * ![](defaultIfEmpty.png)
 *
 * `defaultIfEmpty` emits the values emitted by the source Observable or a
 * specified default value if the source Observable is empty (completes without
 * having emitted any `next` value).
 *
 * ## Example
 * If no clicks happen in 5 seconds, then emit "no clicks"
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const clicksBeforeFive = clicks.pipe(takeUntil(interval(5000)));
 * const result = clicksBeforeFive.pipe(defaultIfEmpty('no clicks'));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link empty}
 * @see {@link last}
 *
 * @param {any} [defaultValue=null] The default value used if the source
 * Observable is empty.
 * @return {Observable} An Observable that emits either the specified
 * `defaultValue` if the source Observable emits no items, or the values emitted
 * by the source Observable.
 * @method defaultIfEmpty
 * @owner Observable
 */
function defaultIfEmpty(defaultValue) {
    if (defaultValue === void 0) { defaultValue = null; }
    return function (source) { return source.lift(new DefaultIfEmptyOperator(defaultValue)); };
}
exports.defaultIfEmpty = defaultIfEmpty;
var DefaultIfEmptyOperator = /** @class */ (function () {
    function DefaultIfEmptyOperator(defaultValue) {
        this.defaultValue = defaultValue;
    }
    DefaultIfEmptyOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DefaultIfEmptySubscriber(subscriber, this.defaultValue));
    };
    return DefaultIfEmptyOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DefaultIfEmptySubscriber = /** @class */ (function (_super) {
    __extends(DefaultIfEmptySubscriber, _super);
    function DefaultIfEmptySubscriber(destination, defaultValue) {
        var _this = _super.call(this, destination) || this;
        _this.defaultValue = defaultValue;
        _this.isEmpty = true;
        return _this;
    }
    DefaultIfEmptySubscriber.prototype._next = function (value) {
        this.isEmpty = false;
        this.destination.next(value);
    };
    DefaultIfEmptySubscriber.prototype._complete = function () {
        if (this.isEmpty) {
            this.destination.next(this.defaultValue);
        }
        this.destination.complete();
    };
    return DefaultIfEmptySubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdElmRW1wdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9kZWZhdWx0SWZFbXB0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDRDQUEyQztBQU0zQyxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0NHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFPLFlBQXNCO0lBQXRCLDZCQUFBLEVBQUEsbUJBQXNCO0lBQ3pELE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLHNCQUFzQixDQUFDLFlBQVksQ0FBQyxDQUFzQixFQUExRSxDQUEwRSxDQUFDO0FBQy9HLENBQUM7QUFGRCx3Q0FFQztBQUVEO0lBRUUsZ0NBQW9CLFlBQWU7UUFBZixpQkFBWSxHQUFaLFlBQVksQ0FBRztJQUNuQyxDQUFDO0lBRUQscUNBQUksR0FBSixVQUFLLFVBQTZCLEVBQUUsTUFBVztRQUM3QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSx3QkFBd0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUNILDZCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFFRDs7OztHQUlHO0FBQ0g7SUFBNkMsNENBQWE7SUFHeEQsa0NBQVksV0FBOEIsRUFBVSxZQUFlO1FBQW5FLFlBQ0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBRm1ELGtCQUFZLEdBQVosWUFBWSxDQUFHO1FBRjNELGFBQU8sR0FBWSxJQUFJLENBQUM7O0lBSWhDLENBQUM7SUFFUyx3Q0FBSyxHQUFmLFVBQWdCLEtBQVE7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVTLDRDQUFTLEdBQW5CO1FBQ0UsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUMxQztRQUNELElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUNILCtCQUFDO0FBQUQsQ0FBQyxBQWxCRCxDQUE2Qyx1QkFBVSxHQWtCdEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24sIE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdElmRW1wdHk8VD4oZGVmYXVsdFZhbHVlPzogVCk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0SWZFbXB0eTxULCBSPihkZWZhdWx0VmFsdWU/OiBSKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgUj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIEVtaXRzIGEgZ2l2ZW4gdmFsdWUgaWYgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGNvbXBsZXRlcyB3aXRob3V0IGVtaXR0aW5nIGFueVxuICogYG5leHRgIHZhbHVlLCBvdGhlcndpc2UgbWlycm9ycyB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPklmIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0dXJucyBvdXQgdG8gYmUgZW1wdHksIHRoZW5cbiAqIHRoaXMgb3BlcmF0b3Igd2lsbCBlbWl0IGEgZGVmYXVsdCB2YWx1ZS48L3NwYW4+XG4gKlxuICogIVtdKGRlZmF1bHRJZkVtcHR5LnBuZylcbiAqXG4gKiBgZGVmYXVsdElmRW1wdHlgIGVtaXRzIHRoZSB2YWx1ZXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgb3IgYVxuICogc3BlY2lmaWVkIGRlZmF1bHQgdmFsdWUgaWYgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGlzIGVtcHR5IChjb21wbGV0ZXMgd2l0aG91dFxuICogaGF2aW5nIGVtaXR0ZWQgYW55IGBuZXh0YCB2YWx1ZSkuXG4gKlxuICogIyMgRXhhbXBsZVxuICogSWYgbm8gY2xpY2tzIGhhcHBlbiBpbiA1IHNlY29uZHMsIHRoZW4gZW1pdCBcIm5vIGNsaWNrc1wiXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgY2xpY2tzQmVmb3JlRml2ZSA9IGNsaWNrcy5waXBlKHRha2VVbnRpbChpbnRlcnZhbCg1MDAwKSkpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzQmVmb3JlRml2ZS5waXBlKGRlZmF1bHRJZkVtcHR5KCdubyBjbGlja3MnKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZW1wdHl9XG4gKiBAc2VlIHtAbGluayBsYXN0fVxuICpcbiAqIEBwYXJhbSB7YW55fSBbZGVmYXVsdFZhbHVlPW51bGxdIFRoZSBkZWZhdWx0IHZhbHVlIHVzZWQgaWYgdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSBpcyBlbXB0eS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBlaXRoZXIgdGhlIHNwZWNpZmllZFxuICogYGRlZmF1bHRWYWx1ZWAgaWYgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGVtaXRzIG5vIGl0ZW1zLCBvciB0aGUgdmFsdWVzIGVtaXR0ZWRcbiAqIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2QgZGVmYXVsdElmRW1wdHlcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0SWZFbXB0eTxULCBSPihkZWZhdWx0VmFsdWU6IFIgPSBudWxsKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgUj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IERlZmF1bHRJZkVtcHR5T3BlcmF0b3IoZGVmYXVsdFZhbHVlKSkgYXMgT2JzZXJ2YWJsZTxUIHwgUj47XG59XG5cbmNsYXNzIERlZmF1bHRJZkVtcHR5T3BlcmF0b3I8VCwgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUIHwgUj4ge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGVmYXVsdFZhbHVlOiBSKSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VCB8IFI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IERlZmF1bHRJZkVtcHR5U3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLmRlZmF1bHRWYWx1ZSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBEZWZhdWx0SWZFbXB0eVN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBpc0VtcHR5OiBib29sZWFuID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUIHwgUj4sIHByaXZhdGUgZGVmYXVsdFZhbHVlOiBSKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5pc0VtcHR5ID0gZmFsc2U7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHRoaXMuZGVmYXVsdFZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=