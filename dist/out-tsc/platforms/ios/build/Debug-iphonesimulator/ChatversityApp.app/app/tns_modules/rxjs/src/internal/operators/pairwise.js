"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
/**
 * Groups pairs of consecutive emissions together and emits them as an array of
 * two values.
 *
 * <span class="informal">Puts the current value and previous value together as
 * an array, and emits that.</span>
 *
 * ![](pairwise.png)
 *
 * The Nth emission from the source Observable will cause the output Observable
 * to emit an array [(N-1)th, Nth] of the previous and the current value, as a
 * pair. For this reason, `pairwise` emits on the second and subsequent
 * emissions from the source Observable, but not on the first emission, because
 * there is no previous value in that case.
 *
 * ## Example
 * On every click (starting from the second), emit the relative distance to the previous click
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const pairs = clicks.pipe(pairwise());
 * const distance = pairs.pipe(
 *   map(pair => {
 *     const x0 = pair[0].clientX;
 *     const y0 = pair[0].clientY;
 *     const x1 = pair[1].clientX;
 *     const y1 = pair[1].clientY;
 *     return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
 *   }),
 * );
 * distance.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 *
 * @return {Observable<Array<T>>} An Observable of pairs (as arrays) of
 * consecutive values from the source Observable.
 * @method pairwise
 * @owner Observable
 */
function pairwise() {
    return function (source) { return source.lift(new PairwiseOperator()); };
}
exports.pairwise = pairwise;
var PairwiseOperator = /** @class */ (function () {
    function PairwiseOperator() {
    }
    PairwiseOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new PairwiseSubscriber(subscriber));
    };
    return PairwiseOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var PairwiseSubscriber = /** @class */ (function (_super) {
    __extends(PairwiseSubscriber, _super);
    function PairwiseSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.hasPrev = false;
        return _this;
    }
    PairwiseSubscriber.prototype._next = function (value) {
        if (this.hasPrev) {
            this.destination.next([this.prev, value]);
        }
        else {
            this.hasPrev = true;
        }
        this.prev = value;
    };
    return PairwiseSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFpcndpc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9wYWlyd2lzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDRDQUEyQztBQUczQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUNHO0FBQ0gsU0FBZ0IsUUFBUTtJQUN0QixPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDLEVBQW5DLENBQW1DLENBQUM7QUFDeEUsQ0FBQztBQUZELDRCQUVDO0FBRUQ7SUFBQTtJQUlBLENBQUM7SUFIQywrQkFBSSxHQUFKLFVBQUssVUFBOEIsRUFBRSxNQUFXO1FBQzlDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFFRDs7OztHQUlHO0FBQ0g7SUFBb0Msc0NBQWE7SUFJL0MsNEJBQVksV0FBK0I7UUFBM0MsWUFDRSxrQkFBTSxXQUFXLENBQUMsU0FDbkI7UUFKTyxhQUFPLEdBQVksS0FBSyxDQUFDOztJQUlqQyxDQUFDO0lBRUQsa0NBQUssR0FBTCxVQUFNLEtBQVE7UUFDWixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDM0M7YUFBTTtZQUNMLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQWpCRCxDQUFvQyx1QkFBVSxHQWlCN0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogR3JvdXBzIHBhaXJzIG9mIGNvbnNlY3V0aXZlIGVtaXNzaW9ucyB0b2dldGhlciBhbmQgZW1pdHMgdGhlbSBhcyBhbiBhcnJheSBvZlxuICogdHdvIHZhbHVlcy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+UHV0cyB0aGUgY3VycmVudCB2YWx1ZSBhbmQgcHJldmlvdXMgdmFsdWUgdG9nZXRoZXIgYXNcbiAqIGFuIGFycmF5LCBhbmQgZW1pdHMgdGhhdC48L3NwYW4+XG4gKlxuICogIVtdKHBhaXJ3aXNlLnBuZylcbiAqXG4gKiBUaGUgTnRoIGVtaXNzaW9uIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHdpbGwgY2F1c2UgdGhlIG91dHB1dCBPYnNlcnZhYmxlXG4gKiB0byBlbWl0IGFuIGFycmF5IFsoTi0xKXRoLCBOdGhdIG9mIHRoZSBwcmV2aW91cyBhbmQgdGhlIGN1cnJlbnQgdmFsdWUsIGFzIGFcbiAqIHBhaXIuIEZvciB0aGlzIHJlYXNvbiwgYHBhaXJ3aXNlYCBlbWl0cyBvbiB0aGUgc2Vjb25kIGFuZCBzdWJzZXF1ZW50XG4gKiBlbWlzc2lvbnMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUsIGJ1dCBub3Qgb24gdGhlIGZpcnN0IGVtaXNzaW9uLCBiZWNhdXNlXG4gKiB0aGVyZSBpcyBubyBwcmV2aW91cyB2YWx1ZSBpbiB0aGF0IGNhc2UuXG4gKlxuICogIyMgRXhhbXBsZVxuICogT24gZXZlcnkgY2xpY2sgKHN0YXJ0aW5nIGZyb20gdGhlIHNlY29uZCksIGVtaXQgdGhlIHJlbGF0aXZlIGRpc3RhbmNlIHRvIHRoZSBwcmV2aW91cyBjbGlja1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHBhaXJzID0gY2xpY2tzLnBpcGUocGFpcndpc2UoKSk7XG4gKiBjb25zdCBkaXN0YW5jZSA9IHBhaXJzLnBpcGUoXG4gKiAgIG1hcChwYWlyID0+IHtcbiAqICAgICBjb25zdCB4MCA9IHBhaXJbMF0uY2xpZW50WDtcbiAqICAgICBjb25zdCB5MCA9IHBhaXJbMF0uY2xpZW50WTtcbiAqICAgICBjb25zdCB4MSA9IHBhaXJbMV0uY2xpZW50WDtcbiAqICAgICBjb25zdCB5MSA9IHBhaXJbMV0uY2xpZW50WTtcbiAqICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHgwIC0geDEsIDIpICsgTWF0aC5wb3coeTAgLSB5MSwgMikpO1xuICogICB9KSxcbiAqICk7XG4gKiBkaXN0YW5jZS5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBidWZmZXJ9XG4gKiBAc2VlIHtAbGluayBidWZmZXJDb3VudH1cbiAqXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPEFycmF5PFQ+Pn0gQW4gT2JzZXJ2YWJsZSBvZiBwYWlycyAoYXMgYXJyYXlzKSBvZlxuICogY29uc2VjdXRpdmUgdmFsdWVzIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQG1ldGhvZCBwYWlyd2lzZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhaXJ3aXNlPFQ+KCk6IE9wZXJhdG9yRnVuY3Rpb248VCwgW1QsIFRdPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgUGFpcndpc2VPcGVyYXRvcigpKTtcbn1cblxuY2xhc3MgUGFpcndpc2VPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFtULCBUXT4ge1xuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8W1QsIFRdPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBQYWlyd2lzZVN1YnNjcmliZXIoc3Vic2NyaWJlcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBQYWlyd2lzZVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBwcmV2OiBUO1xuICBwcml2YXRlIGhhc1ByZXY6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxbVCwgVF0+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5oYXNQcmV2KSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoW3RoaXMucHJldiwgdmFsdWVdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYXNQcmV2ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLnByZXYgPSB2YWx1ZTtcbiAgfVxufVxuIl19