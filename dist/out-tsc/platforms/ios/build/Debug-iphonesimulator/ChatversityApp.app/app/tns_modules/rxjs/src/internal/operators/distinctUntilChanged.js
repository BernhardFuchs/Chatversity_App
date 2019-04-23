"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
var tryCatch_1 = require("../util/tryCatch");
var errorObject_1 = require("../util/errorObject");
/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item.
 *
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 *
 * If a comparator function is not provided, an equality check is used by default.
 *
 * ## Example
 * A simple example with numbers
 * ```javascript
 * of(1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 4).pipe(
 *     distinctUntilChanged(),
 *   )
 *   .subscribe(x => console.log(x)); // 1, 2, 1, 2, 3, 4
 * ```
 *
 * An example using a compare function
 * ```typescript
 * interface Person {
 *    age: number,
 *    name: string
 * }
 *
 * of<Person>(
 *     { age: 4, name: 'Foo'},
 *     { age: 7, name: 'Bar'},
 *     { age: 5, name: 'Foo'},
 *     { age: 6, name: 'Foo'},
 *   ).pipe(
 *     distinctUntilChanged((p: Person, q: Person) => p.name === q.name),
 *   )
 *   .subscribe(x => console.log(x));
 *
 * // displays:
 * // { age: 4, name: 'Foo' }
 * // { age: 7, name: 'Bar' }
 * // { age: 5, name: 'Foo' }
 * ```
 *
 * @see {@link distinct}
 * @see {@link distinctUntilKeyChanged}
 *
 * @param {function} [compare] Optional comparison function called to test if an item is distinct from the previous item in the source.
 * @return {Observable} An Observable that emits items from the source Observable with distinct values.
 * @method distinctUntilChanged
 * @owner Observable
 */
function distinctUntilChanged(compare, keySelector) {
    return function (source) { return source.lift(new DistinctUntilChangedOperator(compare, keySelector)); };
}
exports.distinctUntilChanged = distinctUntilChanged;
var DistinctUntilChangedOperator = /** @class */ (function () {
    function DistinctUntilChangedOperator(compare, keySelector) {
        this.compare = compare;
        this.keySelector = keySelector;
    }
    DistinctUntilChangedOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
    };
    return DistinctUntilChangedOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DistinctUntilChangedSubscriber = /** @class */ (function (_super) {
    __extends(DistinctUntilChangedSubscriber, _super);
    function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
        var _this = _super.call(this, destination) || this;
        _this.keySelector = keySelector;
        _this.hasKey = false;
        if (typeof compare === 'function') {
            _this.compare = compare;
        }
        return _this;
    }
    DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
        return x === y;
    };
    DistinctUntilChangedSubscriber.prototype._next = function (value) {
        var keySelector = this.keySelector;
        var key = value;
        if (keySelector) {
            key = tryCatch_1.tryCatch(this.keySelector)(value);
            if (key === errorObject_1.errorObject) {
                return this.destination.error(errorObject_1.errorObject.e);
            }
        }
        var result = false;
        if (this.hasKey) {
            result = tryCatch_1.tryCatch(this.compare)(this.key, key);
            if (result === errorObject_1.errorObject) {
                return this.destination.error(errorObject_1.errorObject.e);
            }
        }
        else {
            this.hasKey = true;
        }
        if (Boolean(result) === false) {
            this.key = key;
            this.destination.next(value);
        }
    };
    return DistinctUntilChangedSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdGluY3RVbnRpbENoYW5nZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9kaXN0aW5jdFVudGlsQ2hhbmdlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDRDQUEyQztBQUMzQyw2Q0FBNEM7QUFDNUMsbURBQWtEO0FBT2xELG1DQUFtQztBQUVuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThDRztBQUNILFNBQWdCLG9CQUFvQixDQUFPLE9BQWlDLEVBQUUsV0FBeUI7SUFDckcsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksNEJBQTRCLENBQU8sT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDLEVBQXpFLENBQXlFLENBQUM7QUFDOUcsQ0FBQztBQUZELG9EQUVDO0FBRUQ7SUFDRSxzQ0FBb0IsT0FBZ0MsRUFDaEMsV0FBd0I7UUFEeEIsWUFBTyxHQUFQLE9BQU8sQ0FBeUI7UUFDaEMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7SUFDNUMsQ0FBQztJQUVELDJDQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksOEJBQThCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDMUcsQ0FBQztJQUNILG1DQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFFRDs7OztHQUlHO0FBQ0g7SUFBbUQsa0RBQWE7SUFJOUQsd0NBQVksV0FBMEIsRUFDMUIsT0FBZ0MsRUFDeEIsV0FBd0I7UUFGNUMsWUFHRSxrQkFBTSxXQUFXLENBQUMsU0FJbkI7UUFMbUIsaUJBQVcsR0FBWCxXQUFXLENBQWE7UUFKcEMsWUFBTSxHQUFZLEtBQUssQ0FBQztRQU05QixJQUFJLE9BQU8sT0FBTyxLQUFLLFVBQVUsRUFBRTtZQUNqQyxLQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUN4Qjs7SUFDSCxDQUFDO0lBRU8sZ0RBQU8sR0FBZixVQUFnQixDQUFNLEVBQUUsQ0FBTTtRQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVTLDhDQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUV0QixJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3JDLElBQUksR0FBRyxHQUFRLEtBQUssQ0FBQztRQUVyQixJQUFJLFdBQVcsRUFBRTtZQUNmLEdBQUcsR0FBRyxtQkFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QyxJQUFJLEdBQUcsS0FBSyx5QkFBVyxFQUFFO2dCQUN2QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLHlCQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUM7U0FDRjtRQUVELElBQUksTUFBTSxHQUFRLEtBQUssQ0FBQztRQUV4QixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixNQUFNLEdBQUcsbUJBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMvQyxJQUFJLE1BQU0sS0FBSyx5QkFBVyxFQUFFO2dCQUMxQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLHlCQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUM7U0FDRjthQUFNO1lBQ0wsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7UUFFRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxLQUFLLEVBQUU7WUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDZixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUM7SUFDSCxxQ0FBQztBQUFELENBQUMsQUE3Q0QsQ0FBbUQsdUJBQVUsR0E2QzVEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyB0cnlDYXRjaCB9IGZyb20gJy4uL3V0aWwvdHJ5Q2F0Y2gnO1xuaW1wb3J0IHsgZXJyb3JPYmplY3QgfSBmcm9tICcuLi91dGlsL2Vycm9yT2JqZWN0JztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gZGlzdGluY3RVbnRpbENoYW5nZWQ8VD4oY29tcGFyZT86ICh4OiBULCB5OiBUKSA9PiBib29sZWFuKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0VW50aWxDaGFuZ2VkPFQsIEs+KGNvbXBhcmU6ICh4OiBLLCB5OiBLKSA9PiBib29sZWFuLCBrZXlTZWxlY3RvcjogKHg6IFQpID0+IEspOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFsbCBpdGVtcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0aGF0IGFyZSBkaXN0aW5jdCBieSBjb21wYXJpc29uIGZyb20gdGhlIHByZXZpb3VzIGl0ZW0uXG4gKlxuICogSWYgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCB0aGVuIGl0IHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoIGl0ZW0gdG8gdGVzdCBmb3Igd2hldGhlciBvciBub3QgdGhhdCB2YWx1ZSBzaG91bGQgYmUgZW1pdHRlZC5cbiAqXG4gKiBJZiBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gaXMgbm90IHByb3ZpZGVkLCBhbiBlcXVhbGl0eSBjaGVjayBpcyB1c2VkIGJ5IGRlZmF1bHQuXG4gKlxuICogIyMgRXhhbXBsZVxuICogQSBzaW1wbGUgZXhhbXBsZSB3aXRoIG51bWJlcnNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIG9mKDEsIDEsIDIsIDIsIDIsIDEsIDEsIDIsIDMsIDMsIDQpLnBpcGUoXG4gKiAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAqICAgKVxuICogICAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpOyAvLyAxLCAyLCAxLCAyLCAzLCA0XG4gKiBgYGBcbiAqXG4gKiBBbiBleGFtcGxlIHVzaW5nIGEgY29tcGFyZSBmdW5jdGlvblxuICogYGBgdHlwZXNjcmlwdFxuICogaW50ZXJmYWNlIFBlcnNvbiB7XG4gKiAgICBhZ2U6IG51bWJlcixcbiAqICAgIG5hbWU6IHN0cmluZ1xuICogfVxuICpcbiAqIG9mPFBlcnNvbj4oXG4gKiAgICAgeyBhZ2U6IDQsIG5hbWU6ICdGb28nfSxcbiAqICAgICB7IGFnZTogNywgbmFtZTogJ0Jhcid9LFxuICogICAgIHsgYWdlOiA1LCBuYW1lOiAnRm9vJ30sXG4gKiAgICAgeyBhZ2U6IDYsIG5hbWU6ICdGb28nfSxcbiAqICAgKS5waXBlKFxuICogICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKChwOiBQZXJzb24sIHE6IFBlcnNvbikgPT4gcC5uYW1lID09PSBxLm5hbWUpLFxuICogICApXG4gKiAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gZGlzcGxheXM6XG4gKiAvLyB7IGFnZTogNCwgbmFtZTogJ0ZvbycgfVxuICogLy8geyBhZ2U6IDcsIG5hbWU6ICdCYXInIH1cbiAqIC8vIHsgYWdlOiA1LCBuYW1lOiAnRm9vJyB9XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBkaXN0aW5jdH1cbiAqIEBzZWUge0BsaW5rIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjb21wYXJlXSBPcHRpb25hbCBjb21wYXJpc29uIGZ1bmN0aW9uIGNhbGxlZCB0byB0ZXN0IGlmIGFuIGl0ZW0gaXMgZGlzdGluY3QgZnJvbSB0aGUgcHJldmlvdXMgaXRlbSBpbiB0aGUgc291cmNlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGl0ZW1zIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHdpdGggZGlzdGluY3QgdmFsdWVzLlxuICogQG1ldGhvZCBkaXN0aW5jdFVudGlsQ2hhbmdlZFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0VW50aWxDaGFuZ2VkPFQsIEs+KGNvbXBhcmU/OiAoeDogSywgeTogSykgPT4gYm9vbGVhbiwga2V5U2VsZWN0b3I/OiAoeDogVCkgPT4gSyk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgRGlzdGluY3RVbnRpbENoYW5nZWRPcGVyYXRvcjxULCBLPihjb21wYXJlLCBrZXlTZWxlY3RvcikpO1xufVxuXG5jbGFzcyBEaXN0aW5jdFVudGlsQ2hhbmdlZE9wZXJhdG9yPFQsIEs+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbXBhcmU6ICh4OiBLLCB5OiBLKSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIGtleVNlbGVjdG9yOiAoeDogVCkgPT4gSykge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBEaXN0aW5jdFVudGlsQ2hhbmdlZFN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5jb21wYXJlLCB0aGlzLmtleVNlbGVjdG9yKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIERpc3RpbmN0VW50aWxDaGFuZ2VkU3Vic2NyaWJlcjxULCBLPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIGtleTogSztcbiAgcHJpdmF0ZSBoYXNLZXk6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgY29tcGFyZTogKHg6IEssIHk6IEspID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUga2V5U2VsZWN0b3I6ICh4OiBUKSA9PiBLKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIGlmICh0eXBlb2YgY29tcGFyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5jb21wYXJlID0gY29tcGFyZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvbXBhcmUoeDogYW55LCB5OiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4geCA9PT0geTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuXG4gICAgY29uc3Qga2V5U2VsZWN0b3IgPSB0aGlzLmtleVNlbGVjdG9yO1xuICAgIGxldCBrZXk6IGFueSA9IHZhbHVlO1xuXG4gICAgaWYgKGtleVNlbGVjdG9yKSB7XG4gICAgICBrZXkgPSB0cnlDYXRjaCh0aGlzLmtleVNlbGVjdG9yKSh2YWx1ZSk7XG4gICAgICBpZiAoa2V5ID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0OiBhbnkgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLmhhc0tleSkge1xuICAgICAgcmVzdWx0ID0gdHJ5Q2F0Y2godGhpcy5jb21wYXJlKSh0aGlzLmtleSwga2V5KTtcbiAgICAgIGlmIChyZXN1bHQgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhhc0tleSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKEJvb2xlYW4ocmVzdWx0KSA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==