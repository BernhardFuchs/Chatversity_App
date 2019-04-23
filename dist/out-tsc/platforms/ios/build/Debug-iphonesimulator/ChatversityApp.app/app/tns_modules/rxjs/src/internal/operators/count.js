"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
/**
 * Counts the number of emissions on the source and emits that number when the
 * source completes.
 *
 * <span class="informal">Tells how many values were emitted, when the source
 * completes.</span>
 *
 * ![](count.png)
 *
 * `count` transforms an Observable that emits values into an Observable that
 * emits a single value that represents the number of values emitted by the
 * source Observable. If the source Observable terminates with an error, `count`
 * will pass this error notification along without emitting a value first. If
 * the source Observable does not terminate at all, `count` will neither emit
 * a value nor terminate. This operator takes an optional `predicate` function
 * as argument, in which case the output emission will represent the number of
 * source values that matched `true` with the `predicate`.
 *
 * ## Examples
 *
 * Counts how many seconds have passed before the first click happened
 * ```javascript
 * const seconds = interval(1000);
 * const clicks = fromEvent(document, 'click');
 * const secondsBeforeClick = seconds.pipe(takeUntil(clicks));
 * const result = secondsBeforeClick.pipe(count());
 * result.subscribe(x => console.log(x));
 * ```
 *
 * Counts how many odd numbers are there between 1 and 7
 * ```javascript
 * const numbers = range(1, 7);
 * const result = numbers.pipe(count(i => i % 2 === 1));
 * result.subscribe(x => console.log(x));
 * // Results in:
 * // 4
 * ```
 *
 * @see {@link max}
 * @see {@link min}
 * @see {@link reduce}
 *
 * @param {function(value: T, i: number, source: Observable<T>): boolean} [predicate] A
 * boolean function to select what values are to be counted. It is provided with
 * arguments of:
 * - `value`: the value from the source Observable.
 * - `index`: the (zero-based) "index" of the value from the source Observable.
 * - `source`: the source Observable instance itself.
 * @return {Observable} An Observable of one number that represents the count as
 * described above.
 * @method count
 * @owner Observable
 */
function count(predicate) {
    return function (source) { return source.lift(new CountOperator(predicate, source)); };
}
exports.count = count;
var CountOperator = /** @class */ (function () {
    function CountOperator(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    CountOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new CountSubscriber(subscriber, this.predicate, this.source));
    };
    return CountOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var CountSubscriber = /** @class */ (function (_super) {
    __extends(CountSubscriber, _super);
    function CountSubscriber(destination, predicate, source) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.source = source;
        _this.count = 0;
        _this.index = 0;
        return _this;
    }
    CountSubscriber.prototype._next = function (value) {
        if (this.predicate) {
            this._tryPredicate(value);
        }
        else {
            this.count++;
        }
    };
    CountSubscriber.prototype._tryPredicate = function (value) {
        var result;
        try {
            result = this.predicate(value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.count++;
        }
    };
    CountSubscriber.prototype._complete = function () {
        this.destination.next(this.count);
        this.destination.complete();
    };
    return CountSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9jb3VudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLDRDQUEyQztBQUMzQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9ERztBQUVILFNBQWdCLEtBQUssQ0FBSSxTQUF1RTtJQUM5RixPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQWpELENBQWlELENBQUM7QUFDdEYsQ0FBQztBQUZELHNCQUVDO0FBRUQ7SUFDRSx1QkFBb0IsU0FBdUUsRUFDdkUsTUFBc0I7UUFEdEIsY0FBUyxHQUFULFNBQVMsQ0FBOEQ7UUFDdkUsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7SUFDMUMsQ0FBQztJQUVELDRCQUFJLEdBQUosVUFBSyxVQUE4QixFQUFFLE1BQVc7UUFDOUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQWlDLG1DQUFhO0lBSTVDLHlCQUFZLFdBQTZCLEVBQ3JCLFNBQXVFLEVBQ3ZFLE1BQXNCO1FBRjFDLFlBR0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBSG1CLGVBQVMsR0FBVCxTQUFTLENBQThEO1FBQ3ZFLFlBQU0sR0FBTixNQUFNLENBQWdCO1FBTGxDLFdBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsV0FBSyxHQUFXLENBQUMsQ0FBQzs7SUFNMUIsQ0FBQztJQUVTLCtCQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzQjthQUFNO1lBQ0wsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2Q7SUFDSCxDQUFDO0lBRU8sdUNBQWEsR0FBckIsVUFBc0IsS0FBUTtRQUM1QixJQUFJLE1BQVcsQ0FBQztRQUVoQixJQUFJO1lBQ0YsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDM0Q7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLE9BQU87U0FDUjtRQUVELElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2Q7SUFDSCxDQUFDO0lBRVMsbUNBQVMsR0FBbkI7UUFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBckNELENBQWlDLHVCQUFVLEdBcUMxQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2ZXIsIE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG4vKipcbiAqIENvdW50cyB0aGUgbnVtYmVyIG9mIGVtaXNzaW9ucyBvbiB0aGUgc291cmNlIGFuZCBlbWl0cyB0aGF0IG51bWJlciB3aGVuIHRoZVxuICogc291cmNlIGNvbXBsZXRlcy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+VGVsbHMgaG93IG1hbnkgdmFsdWVzIHdlcmUgZW1pdHRlZCwgd2hlbiB0aGUgc291cmNlXG4gKiBjb21wbGV0ZXMuPC9zcGFuPlxuICpcbiAqICFbXShjb3VudC5wbmcpXG4gKlxuICogYGNvdW50YCB0cmFuc2Zvcm1zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB2YWx1ZXMgaW50byBhbiBPYnNlcnZhYmxlIHRoYXRcbiAqIGVtaXRzIGEgc2luZ2xlIHZhbHVlIHRoYXQgcmVwcmVzZW50cyB0aGUgbnVtYmVyIG9mIHZhbHVlcyBlbWl0dGVkIGJ5IHRoZVxuICogc291cmNlIE9ic2VydmFibGUuIElmIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0ZXJtaW5hdGVzIHdpdGggYW4gZXJyb3IsIGBjb3VudGBcbiAqIHdpbGwgcGFzcyB0aGlzIGVycm9yIG5vdGlmaWNhdGlvbiBhbG9uZyB3aXRob3V0IGVtaXR0aW5nIGEgdmFsdWUgZmlyc3QuIElmXG4gKiB0aGUgc291cmNlIE9ic2VydmFibGUgZG9lcyBub3QgdGVybWluYXRlIGF0IGFsbCwgYGNvdW50YCB3aWxsIG5laXRoZXIgZW1pdFxuICogYSB2YWx1ZSBub3IgdGVybWluYXRlLiBUaGlzIG9wZXJhdG9yIHRha2VzIGFuIG9wdGlvbmFsIGBwcmVkaWNhdGVgIGZ1bmN0aW9uXG4gKiBhcyBhcmd1bWVudCwgaW4gd2hpY2ggY2FzZSB0aGUgb3V0cHV0IGVtaXNzaW9uIHdpbGwgcmVwcmVzZW50IHRoZSBudW1iZXIgb2ZcbiAqIHNvdXJjZSB2YWx1ZXMgdGhhdCBtYXRjaGVkIGB0cnVlYCB3aXRoIHRoZSBgcHJlZGljYXRlYC5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICpcbiAqIENvdW50cyBob3cgbWFueSBzZWNvbmRzIGhhdmUgcGFzc2VkIGJlZm9yZSB0aGUgZmlyc3QgY2xpY2sgaGFwcGVuZWRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHNlY29uZHMgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBzZWNvbmRzQmVmb3JlQ2xpY2sgPSBzZWNvbmRzLnBpcGUodGFrZVVudGlsKGNsaWNrcykpO1xuICogY29uc3QgcmVzdWx0ID0gc2Vjb25kc0JlZm9yZUNsaWNrLnBpcGUoY291bnQoKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQ291bnRzIGhvdyBtYW55IG9kZCBudW1iZXJzIGFyZSB0aGVyZSBiZXR3ZWVuIDEgYW5kIDdcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG51bWJlcnMgPSByYW5nZSgxLCA3KTtcbiAqIGNvbnN0IHJlc3VsdCA9IG51bWJlcnMucGlwZShjb3VudChpID0+IGkgJSAyID09PSAxKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogLy8gUmVzdWx0cyBpbjpcbiAqIC8vIDRcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIG1heH1cbiAqIEBzZWUge0BsaW5rIG1pbn1cbiAqIEBzZWUge0BsaW5rIHJlZHVjZX1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBULCBpOiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPik6IGJvb2xlYW59IFtwcmVkaWNhdGVdIEFcbiAqIGJvb2xlYW4gZnVuY3Rpb24gdG8gc2VsZWN0IHdoYXQgdmFsdWVzIGFyZSB0byBiZSBjb3VudGVkLiBJdCBpcyBwcm92aWRlZCB3aXRoXG4gKiBhcmd1bWVudHMgb2Y6XG4gKiAtIGB2YWx1ZWA6IHRoZSB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIC0gYGluZGV4YDogdGhlICh6ZXJvLWJhc2VkKSBcImluZGV4XCIgb2YgdGhlIHZhbHVlIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogLSBgc291cmNlYDogdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGluc3RhbmNlIGl0c2VsZi5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgb2Ygb25lIG51bWJlciB0aGF0IHJlcHJlc2VudHMgdGhlIGNvdW50IGFzXG4gKiBkZXNjcmliZWQgYWJvdmUuXG4gKiBAbWV0aG9kIGNvdW50XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBjb3VudDxUPihwcmVkaWNhdGU/OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gYm9vbGVhbik6IE9wZXJhdG9yRnVuY3Rpb248VCwgbnVtYmVyPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgQ291bnRPcGVyYXRvcihwcmVkaWNhdGUsIHNvdXJjZSkpO1xufVxuXG5jbGFzcyBDb3VudE9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgbnVtYmVyPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJlZGljYXRlPzogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlPzogT2JzZXJ2YWJsZTxUPikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPG51bWJlcj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgQ291bnRTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMucHJlZGljYXRlLCB0aGlzLnNvdXJjZSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBDb3VudFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBjb3VudDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogT2JzZXJ2ZXI8bnVtYmVyPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwcmVkaWNhdGU/OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzb3VyY2U/OiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucHJlZGljYXRlKSB7XG4gICAgICB0aGlzLl90cnlQcmVkaWNhdGUodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvdW50Kys7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdHJ5UHJlZGljYXRlKHZhbHVlOiBUKSB7XG4gICAgbGV0IHJlc3VsdDogYW55O1xuXG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IHRoaXMucHJlZGljYXRlKHZhbHVlLCB0aGlzLmluZGV4KyssIHRoaXMuc291cmNlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICB0aGlzLmNvdW50Kys7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodGhpcy5jb3VudCk7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=