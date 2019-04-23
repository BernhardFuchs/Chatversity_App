"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
var ArgumentOutOfRangeError_1 = require("../util/ArgumentOutOfRangeError");
/**
 * Skip the last `count` values emitted by the source Observable.
 *
 * ![](skipLast.png)
 *
 * `skipLast` returns an Observable that accumulates a queue with a length
 * enough to store the first `count` values. As more values are received,
 * values are taken from the front of the queue and produced on the result
 * sequence. This causes values to be delayed.
 *
 * ## Example
 * Skip the last 2 values of an Observable with many values
 * ```javascript
 * const many = range(1, 5);
 * const skipLastTwo = many.pipe(skipLast(2));
 * skipLastTwo.subscribe(x => console.log(x));
 *
 * // Results in:
 * // 1 2 3
 * ```
 *
 * @see {@link skip}
 * @see {@link skipUntil}
 * @see {@link skipWhile}
 * @see {@link take}
 *
 * @throws {ArgumentOutOfRangeError} When using `skipLast(i)`, it throws
 * ArgumentOutOrRangeError if `i < 0`.
 *
 * @param {number} count Number of elements to skip from the end of the source Observable.
 * @returns {Observable<T>} An Observable that skips the last count values
 * emitted by the source Observable.
 * @method skipLast
 * @owner Observable
 */
function skipLast(count) {
    return function (source) { return source.lift(new SkipLastOperator(count)); };
}
exports.skipLast = skipLast;
var SkipLastOperator = /** @class */ (function () {
    function SkipLastOperator(_skipCount) {
        this._skipCount = _skipCount;
        if (this._skipCount < 0) {
            throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
        }
    }
    SkipLastOperator.prototype.call = function (subscriber, source) {
        if (this._skipCount === 0) {
            // If we don't want to skip any values then just subscribe
            // to Subscriber without any further logic.
            return source.subscribe(new Subscriber_1.Subscriber(subscriber));
        }
        else {
            return source.subscribe(new SkipLastSubscriber(subscriber, this._skipCount));
        }
    };
    return SkipLastOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SkipLastSubscriber = /** @class */ (function (_super) {
    __extends(SkipLastSubscriber, _super);
    function SkipLastSubscriber(destination, _skipCount) {
        var _this = _super.call(this, destination) || this;
        _this._skipCount = _skipCount;
        _this._count = 0;
        _this._ring = new Array(_skipCount);
        return _this;
    }
    SkipLastSubscriber.prototype._next = function (value) {
        var skipCount = this._skipCount;
        var count = this._count++;
        if (count < skipCount) {
            this._ring[count] = value;
        }
        else {
            var currentIndex = count % skipCount;
            var ring = this._ring;
            var oldValue = ring[currentIndex];
            ring[currentIndex] = value;
            this.destination.next(oldValue);
        }
    };
    return SkipLastSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tpcExhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9za2lwTGFzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDRDQUEyQztBQUMzQywyRUFBMEU7QUFJMUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQ0c7QUFDSCxTQUFnQixRQUFRLENBQUksS0FBYTtJQUN2QyxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUF4QyxDQUF3QyxDQUFDO0FBQzdFLENBQUM7QUFGRCw0QkFFQztBQUVEO0lBQ0UsMEJBQW9CLFVBQWtCO1FBQWxCLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDcEMsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRTtZQUN2QixNQUFNLElBQUksaURBQXVCLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBRUQsK0JBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLDBEQUEwRDtZQUMxRCwyQ0FBMkM7WUFDM0MsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksdUJBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1NBQ3JEO2FBQU07WUFDTCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDOUU7SUFDSCxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBaEJELElBZ0JDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQW9DLHNDQUFhO0lBSS9DLDRCQUFZLFdBQTBCLEVBQVUsVUFBa0I7UUFBbEUsWUFDRSxrQkFBTSxXQUFXLENBQUMsU0FFbkI7UUFIK0MsZ0JBQVUsR0FBVixVQUFVLENBQVE7UUFGMUQsWUFBTSxHQUFXLENBQUMsQ0FBQztRQUl6QixLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFJLFVBQVUsQ0FBQyxDQUFDOztJQUN4QyxDQUFDO0lBRVMsa0NBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDbEMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRTVCLElBQUksS0FBSyxHQUFHLFNBQVMsRUFBRTtZQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUMzQjthQUFNO1lBQ0wsSUFBTSxZQUFZLEdBQUcsS0FBSyxHQUFHLFNBQVMsQ0FBQztZQUN2QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3hCLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUVwQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQzNCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQXhCRCxDQUFvQyx1QkFBVSxHQXdCN0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yIH0gZnJvbSAnLi4vdXRpbC9Bcmd1bWVudE91dE9mUmFuZ2VFcnJvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogU2tpcCB0aGUgbGFzdCBgY291bnRgIHZhbHVlcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqXG4gKiAhW10oc2tpcExhc3QucG5nKVxuICpcbiAqIGBza2lwTGFzdGAgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgYWNjdW11bGF0ZXMgYSBxdWV1ZSB3aXRoIGEgbGVuZ3RoXG4gKiBlbm91Z2ggdG8gc3RvcmUgdGhlIGZpcnN0IGBjb3VudGAgdmFsdWVzLiBBcyBtb3JlIHZhbHVlcyBhcmUgcmVjZWl2ZWQsXG4gKiB2YWx1ZXMgYXJlIHRha2VuIGZyb20gdGhlIGZyb250IG9mIHRoZSBxdWV1ZSBhbmQgcHJvZHVjZWQgb24gdGhlIHJlc3VsdFxuICogc2VxdWVuY2UuIFRoaXMgY2F1c2VzIHZhbHVlcyB0byBiZSBkZWxheWVkLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFNraXAgdGhlIGxhc3QgMiB2YWx1ZXMgb2YgYW4gT2JzZXJ2YWJsZSB3aXRoIG1hbnkgdmFsdWVzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBtYW55ID0gcmFuZ2UoMSwgNSk7XG4gKiBjb25zdCBza2lwTGFzdFR3byA9IG1hbnkucGlwZShza2lwTGFzdCgyKSk7XG4gKiBza2lwTGFzdFR3by5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbjpcbiAqIC8vIDEgMiAzXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBza2lwfVxuICogQHNlZSB7QGxpbmsgc2tpcFVudGlsfVxuICogQHNlZSB7QGxpbmsgc2tpcFdoaWxlfVxuICogQHNlZSB7QGxpbmsgdGFrZX1cbiAqXG4gKiBAdGhyb3dzIHtBcmd1bWVudE91dE9mUmFuZ2VFcnJvcn0gV2hlbiB1c2luZyBgc2tpcExhc3QoaSlgLCBpdCB0aHJvd3NcbiAqIEFyZ3VtZW50T3V0T3JSYW5nZUVycm9yIGlmIGBpIDwgMGAuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IE51bWJlciBvZiBlbGVtZW50cyB0byBza2lwIGZyb20gdGhlIGVuZCBvZiB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiBAcmV0dXJucyB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IHNraXBzIHRoZSBsYXN0IGNvdW50IHZhbHVlc1xuICogZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiBAbWV0aG9kIHNraXBMYXN0XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2tpcExhc3Q8VD4oY291bnQ6IG51bWJlcik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgU2tpcExhc3RPcGVyYXRvcihjb3VudCkpO1xufVxuXG5jbGFzcyBTa2lwTGFzdE9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9za2lwQ291bnQ6IG51bWJlcikge1xuICAgIGlmICh0aGlzLl9za2lwQ291bnQgPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3I7XG4gICAgfVxuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIGlmICh0aGlzLl9za2lwQ291bnQgPT09IDApIHtcbiAgICAgIC8vIElmIHdlIGRvbid0IHdhbnQgdG8gc2tpcCBhbnkgdmFsdWVzIHRoZW4ganVzdCBzdWJzY3JpYmVcbiAgICAgIC8vIHRvIFN1YnNjcmliZXIgd2l0aG91dCBhbnkgZnVydGhlciBsb2dpYy5cbiAgICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBTdWJzY3JpYmVyKHN1YnNjcmliZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFNraXBMYXN0U3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLl9za2lwQ291bnQpKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFNraXBMYXN0U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIF9yaW5nOiBUW107XG4gIHByaXZhdGUgX2NvdW50OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LCBwcml2YXRlIF9za2lwQ291bnQ6IG51bWJlcikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLl9yaW5nID0gbmV3IEFycmF5PFQ+KF9za2lwQ291bnQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3Qgc2tpcENvdW50ID0gdGhpcy5fc2tpcENvdW50O1xuICAgIGNvbnN0IGNvdW50ID0gdGhpcy5fY291bnQrKztcblxuICAgIGlmIChjb3VudCA8IHNraXBDb3VudCkge1xuICAgICAgdGhpcy5fcmluZ1tjb3VudF0gPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gY291bnQgJSBza2lwQ291bnQ7XG4gICAgICBjb25zdCByaW5nID0gdGhpcy5fcmluZztcbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gcmluZ1tjdXJyZW50SW5kZXhdO1xuXG4gICAgICByaW5nW2N1cnJlbnRJbmRleF0gPSB2YWx1ZTtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChvbGRWYWx1ZSk7XG4gICAgfVxuICB9XG59XG4iXX0=