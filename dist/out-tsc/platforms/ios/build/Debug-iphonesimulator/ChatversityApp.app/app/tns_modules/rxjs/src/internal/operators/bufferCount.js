"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
/**
 * Buffers the source Observable values until the size hits the maximum
 * `bufferSize` given.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * that array only when its size reaches `bufferSize`.</span>
 *
 * ![](bufferCount.png)
 *
 * Buffers a number of values from the source Observable by `bufferSize` then
 * emits the buffer and clears it, and starts a new buffer each
 * `startBufferEvery` values. If `startBufferEvery` is not provided or is
 * `null`, then new buffers are started immediately at the start of the source
 * and when each buffer closes and is emitted.
 *
 * ## Examples
 *
 * Emit the last two click events as an array
 *
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const buffered = clicks.pipe(bufferCount(2));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * On every click, emit the last two click events as an array
 *
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const buffered = clicks.pipe(bufferCount(2, 1));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link buffer}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link pairwise}
 * @see {@link windowCount}
 *
 * @param {number} bufferSize The maximum size of the buffer emitted.
 * @param {number} [startBufferEvery] Interval at which to start a new buffer.
 * For example if `startBufferEvery` is `2`, then a new buffer will be started
 * on every other value from the source. A new buffer is started at the
 * beginning of the source by default.
 * @return {Observable<T[]>} An Observable of arrays of buffered values.
 * @method bufferCount
 * @owner Observable
 */
function bufferCount(bufferSize, startBufferEvery) {
    if (startBufferEvery === void 0) { startBufferEvery = null; }
    return function bufferCountOperatorFunction(source) {
        return source.lift(new BufferCountOperator(bufferSize, startBufferEvery));
    };
}
exports.bufferCount = bufferCount;
var BufferCountOperator = /** @class */ (function () {
    function BufferCountOperator(bufferSize, startBufferEvery) {
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        if (!startBufferEvery || bufferSize === startBufferEvery) {
            this.subscriberClass = BufferCountSubscriber;
        }
        else {
            this.subscriberClass = BufferSkipCountSubscriber;
        }
    }
    BufferCountOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new this.subscriberClass(subscriber, this.bufferSize, this.startBufferEvery));
    };
    return BufferCountOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferCountSubscriber = /** @class */ (function (_super) {
    __extends(BufferCountSubscriber, _super);
    function BufferCountSubscriber(destination, bufferSize) {
        var _this = _super.call(this, destination) || this;
        _this.bufferSize = bufferSize;
        _this.buffer = [];
        return _this;
    }
    BufferCountSubscriber.prototype._next = function (value) {
        var buffer = this.buffer;
        buffer.push(value);
        if (buffer.length == this.bufferSize) {
            this.destination.next(buffer);
            this.buffer = [];
        }
    };
    BufferCountSubscriber.prototype._complete = function () {
        var buffer = this.buffer;
        if (buffer.length > 0) {
            this.destination.next(buffer);
        }
        _super.prototype._complete.call(this);
    };
    return BufferCountSubscriber;
}(Subscriber_1.Subscriber));
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferSkipCountSubscriber = /** @class */ (function (_super) {
    __extends(BufferSkipCountSubscriber, _super);
    function BufferSkipCountSubscriber(destination, bufferSize, startBufferEvery) {
        var _this = _super.call(this, destination) || this;
        _this.bufferSize = bufferSize;
        _this.startBufferEvery = startBufferEvery;
        _this.buffers = [];
        _this.count = 0;
        return _this;
    }
    BufferSkipCountSubscriber.prototype._next = function (value) {
        var _a = this, bufferSize = _a.bufferSize, startBufferEvery = _a.startBufferEvery, buffers = _a.buffers, count = _a.count;
        this.count++;
        if (count % startBufferEvery === 0) {
            buffers.push([]);
        }
        for (var i = buffers.length; i--;) {
            var buffer = buffers[i];
            buffer.push(value);
            if (buffer.length === bufferSize) {
                buffers.splice(i, 1);
                this.destination.next(buffer);
            }
        }
    };
    BufferSkipCountSubscriber.prototype._complete = function () {
        var _a = this, buffers = _a.buffers, destination = _a.destination;
        while (buffers.length > 0) {
            var buffer = buffers.shift();
            if (buffer.length > 0) {
                destination.next(buffer);
            }
        }
        _super.prototype._complete.call(this);
    };
    return BufferSkipCountSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyQ291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9idWZmZXJDb3VudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDRDQUEyQztBQUkzQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0RHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFJLFVBQWtCLEVBQUUsZ0JBQStCO0lBQS9CLGlDQUFBLEVBQUEsdUJBQStCO0lBQ2hGLE9BQU8sU0FBUywyQkFBMkIsQ0FBQyxNQUFxQjtRQUMvRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxtQkFBbUIsQ0FBSSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUMsQ0FBQztBQUNKLENBQUM7QUFKRCxrQ0FJQztBQUVEO0lBR0UsNkJBQW9CLFVBQWtCLEVBQVUsZ0JBQXdCO1FBQXBELGVBQVUsR0FBVixVQUFVLENBQVE7UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVE7UUFDdEUsSUFBSSxDQUFDLGdCQUFnQixJQUFJLFVBQVUsS0FBSyxnQkFBZ0IsRUFBRTtZQUN4RCxJQUFJLENBQUMsZUFBZSxHQUFHLHFCQUFxQixDQUFDO1NBQzlDO2FBQU07WUFDTCxJQUFJLENBQUMsZUFBZSxHQUFHLHlCQUF5QixDQUFDO1NBQ2xEO0lBQ0gsQ0FBQztJQUVELGtDQUFJLEdBQUosVUFBSyxVQUEyQixFQUFFLE1BQVc7UUFDM0MsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFB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dUJBQVUsR0FzQ3BEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEJ1ZmZlcnMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHZhbHVlcyB1bnRpbCB0aGUgc2l6ZSBoaXRzIHRoZSBtYXhpbXVtXG4gKiBgYnVmZmVyU2l6ZWAgZ2l2ZW4uXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkNvbGxlY3RzIHZhbHVlcyBmcm9tIHRoZSBwYXN0IGFzIGFuIGFycmF5LCBhbmQgZW1pdHNcbiAqIHRoYXQgYXJyYXkgb25seSB3aGVuIGl0cyBzaXplIHJlYWNoZXMgYGJ1ZmZlclNpemVgLjwvc3Bhbj5cbiAqXG4gKiAhW10oYnVmZmVyQ291bnQucG5nKVxuICpcbiAqIEJ1ZmZlcnMgYSBudW1iZXIgb2YgdmFsdWVzIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGJ5IGBidWZmZXJTaXplYCB0aGVuXG4gKiBlbWl0cyB0aGUgYnVmZmVyIGFuZCBjbGVhcnMgaXQsIGFuZCBzdGFydHMgYSBuZXcgYnVmZmVyIGVhY2hcbiAqIGBzdGFydEJ1ZmZlckV2ZXJ5YCB2YWx1ZXMuIElmIGBzdGFydEJ1ZmZlckV2ZXJ5YCBpcyBub3QgcHJvdmlkZWQgb3IgaXNcbiAqIGBudWxsYCwgdGhlbiBuZXcgYnVmZmVycyBhcmUgc3RhcnRlZCBpbW1lZGlhdGVseSBhdCB0aGUgc3RhcnQgb2YgdGhlIHNvdXJjZVxuICogYW5kIHdoZW4gZWFjaCBidWZmZXIgY2xvc2VzIGFuZCBpcyBlbWl0dGVkLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKlxuICogRW1pdCB0aGUgbGFzdCB0d28gY2xpY2sgZXZlbnRzIGFzIGFuIGFycmF5XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGJ1ZmZlcmVkID0gY2xpY2tzLnBpcGUoYnVmZmVyQ291bnQoMikpO1xuICogYnVmZmVyZWQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogT24gZXZlcnkgY2xpY2ssIGVtaXQgdGhlIGxhc3QgdHdvIGNsaWNrIGV2ZW50cyBhcyBhbiBhcnJheVxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBidWZmZXJlZCA9IGNsaWNrcy5waXBlKGJ1ZmZlckNvdW50KDIsIDEpKTtcbiAqIGJ1ZmZlcmVkLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGJ1ZmZlcn1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlclRpbWV9XG4gKiBAc2VlIHtAbGluayBidWZmZXJUb2dnbGV9XG4gKiBAc2VlIHtAbGluayBidWZmZXJXaGVufVxuICogQHNlZSB7QGxpbmsgcGFpcndpc2V9XG4gKiBAc2VlIHtAbGluayB3aW5kb3dDb3VudH1cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gYnVmZmVyU2l6ZSBUaGUgbWF4aW11bSBzaXplIG9mIHRoZSBidWZmZXIgZW1pdHRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnRCdWZmZXJFdmVyeV0gSW50ZXJ2YWwgYXQgd2hpY2ggdG8gc3RhcnQgYSBuZXcgYnVmZmVyLlxuICogRm9yIGV4YW1wbGUgaWYgYHN0YXJ0QnVmZmVyRXZlcnlgIGlzIGAyYCwgdGhlbiBhIG5ldyBidWZmZXIgd2lsbCBiZSBzdGFydGVkXG4gKiBvbiBldmVyeSBvdGhlciB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UuIEEgbmV3IGJ1ZmZlciBpcyBzdGFydGVkIGF0IHRoZVxuICogYmVnaW5uaW5nIG9mIHRoZSBzb3VyY2UgYnkgZGVmYXVsdC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VFtdPn0gQW4gT2JzZXJ2YWJsZSBvZiBhcnJheXMgb2YgYnVmZmVyZWQgdmFsdWVzLlxuICogQG1ldGhvZCBidWZmZXJDb3VudFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlckNvdW50PFQ+KGJ1ZmZlclNpemU6IG51bWJlciwgc3RhcnRCdWZmZXJFdmVyeTogbnVtYmVyID0gbnVsbCk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVFtdPiB7XG4gIHJldHVybiBmdW5jdGlvbiBidWZmZXJDb3VudE9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBCdWZmZXJDb3VudE9wZXJhdG9yPFQ+KGJ1ZmZlclNpemUsIHN0YXJ0QnVmZmVyRXZlcnkpKTtcbiAgfTtcbn1cblxuY2xhc3MgQnVmZmVyQ291bnRPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFRbXT4ge1xuICBwcml2YXRlIHN1YnNjcmliZXJDbGFzczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYnVmZmVyU2l6ZTogbnVtYmVyLCBwcml2YXRlIHN0YXJ0QnVmZmVyRXZlcnk6IG51bWJlcikge1xuICAgIGlmICghc3RhcnRCdWZmZXJFdmVyeSB8fCBidWZmZXJTaXplID09PSBzdGFydEJ1ZmZlckV2ZXJ5KSB7XG4gICAgICB0aGlzLnN1YnNjcmliZXJDbGFzcyA9IEJ1ZmZlckNvdW50U3Vic2NyaWJlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdWJzY3JpYmVyQ2xhc3MgPSBCdWZmZXJTa2lwQ291bnRTdWJzY3JpYmVyO1xuICAgIH1cbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUW10+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyB0aGlzLnN1YnNjcmliZXJDbGFzcyhzdWJzY3JpYmVyLCB0aGlzLmJ1ZmZlclNpemUsIHRoaXMuc3RhcnRCdWZmZXJFdmVyeSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBCdWZmZXJDb3VudFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBidWZmZXI6IFRbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFRbXT4sIHByaXZhdGUgYnVmZmVyU2l6ZTogbnVtYmVyKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXI7XG5cbiAgICBidWZmZXIucHVzaCh2YWx1ZSk7XG5cbiAgICBpZiAoYnVmZmVyLmxlbmd0aCA9PSB0aGlzLmJ1ZmZlclNpemUpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChidWZmZXIpO1xuICAgICAgdGhpcy5idWZmZXIgPSBbXTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgIGlmIChidWZmZXIubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGJ1ZmZlcik7XG4gICAgfVxuICAgIHN1cGVyLl9jb21wbGV0ZSgpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBCdWZmZXJTa2lwQ291bnRTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgYnVmZmVyczogQXJyYXk8VFtdPiA9IFtdO1xuICBwcml2YXRlIGNvdW50OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFRbXT4sIHByaXZhdGUgYnVmZmVyU2l6ZTogbnVtYmVyLCBwcml2YXRlIHN0YXJ0QnVmZmVyRXZlcnk6IG51bWJlcikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IHsgYnVmZmVyU2l6ZSwgc3RhcnRCdWZmZXJFdmVyeSwgYnVmZmVycywgY291bnQgfSA9IHRoaXM7XG5cbiAgICB0aGlzLmNvdW50Kys7XG4gICAgaWYgKGNvdW50ICUgc3RhcnRCdWZmZXJFdmVyeSA9PT0gMCkge1xuICAgICAgYnVmZmVycy5wdXNoKFtdKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gYnVmZmVycy5sZW5ndGg7IGktLTsgKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBidWZmZXJzW2ldO1xuICAgICAgYnVmZmVyLnB1c2godmFsdWUpO1xuICAgICAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IGJ1ZmZlclNpemUpIHtcbiAgICAgICAgYnVmZmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChidWZmZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgY29uc3QgeyBidWZmZXJzLCBkZXN0aW5hdGlvbiB9ID0gdGhpcztcblxuICAgIHdoaWxlIChidWZmZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBidWZmZXIgPSBidWZmZXJzLnNoaWZ0KCk7XG4gICAgICBpZiAoYnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGVzdGluYXRpb24ubmV4dChidWZmZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdXBlci5fY29tcGxldGUoKTtcbiAgfVxuXG59XG4iXX0=