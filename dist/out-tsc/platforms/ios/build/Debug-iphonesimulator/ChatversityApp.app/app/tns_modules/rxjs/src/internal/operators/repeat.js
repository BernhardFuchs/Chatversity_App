"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
var empty_1 = require("../observable/empty");
/**
 * Returns an Observable that repeats the stream of items emitted by the source Observable at most count times.
 *
 * ![](repeat.png)
 *
 * @param {number} [count] The number of times the source Observable items are repeated, a count of 0 will yield
 * an empty Observable.
 * @return {Observable} An Observable that repeats the stream of items emitted by the source Observable at most
 * count times.
 * @method repeat
 * @owner Observable
 */
function repeat(count) {
    if (count === void 0) { count = -1; }
    return function (source) {
        if (count === 0) {
            return empty_1.empty();
        }
        else if (count < 0) {
            return source.lift(new RepeatOperator(-1, source));
        }
        else {
            return source.lift(new RepeatOperator(count - 1, source));
        }
    };
}
exports.repeat = repeat;
var RepeatOperator = /** @class */ (function () {
    function RepeatOperator(count, source) {
        this.count = count;
        this.source = source;
    }
    RepeatOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RepeatSubscriber(subscriber, this.count, this.source));
    };
    return RepeatOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RepeatSubscriber = /** @class */ (function (_super) {
    __extends(RepeatSubscriber, _super);
    function RepeatSubscriber(destination, count, source) {
        var _this = _super.call(this, destination) || this;
        _this.count = count;
        _this.source = source;
        return _this;
    }
    RepeatSubscriber.prototype.complete = function () {
        if (!this.isStopped) {
            var _a = this, source = _a.source, count = _a.count;
            if (count === 0) {
                return _super.prototype.complete.call(this);
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            source.subscribe(this._unsubscribeAndRecycle());
        }
    };
    return RepeatSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvcmVwZWF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNENBQTJDO0FBRTNDLDZDQUE0QztBQUc1Qzs7Ozs7Ozs7Ozs7R0FXRztBQUNILFNBQWdCLE1BQU0sQ0FBSSxLQUFrQjtJQUFsQixzQkFBQSxFQUFBLFNBQWlCLENBQUM7SUFDMUMsT0FBTyxVQUFDLE1BQXFCO1FBQzNCLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNmLE9BQU8sYUFBSyxFQUFFLENBQUM7U0FDaEI7YUFBTSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDcEIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDcEQ7YUFBTTtZQUNMLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQWMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDM0Q7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDO0FBVkQsd0JBVUM7QUFFRDtJQUNFLHdCQUFvQixLQUFhLEVBQ2IsTUFBcUI7UUFEckIsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUNiLFdBQU0sR0FBTixNQUFNLENBQWU7SUFDekMsQ0FBQztJQUNELDZCQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFFRDs7OztHQUlHO0FBQ0g7SUFBa0Msb0NBQWE7SUFDN0MsMEJBQVksV0FBNEIsRUFDcEIsS0FBYSxFQUNiLE1BQXFCO1FBRnpDLFlBR0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBSG1CLFdBQUssR0FBTCxLQUFLLENBQVE7UUFDYixZQUFNLEdBQU4sTUFBTSxDQUFlOztJQUV6QyxDQUFDO0lBQ0QsbUNBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2IsSUFBQSxTQUF3QixFQUF0QixrQkFBTSxFQUFFLGdCQUFjLENBQUM7WUFDL0IsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO2dCQUNmLE9BQU8saUJBQU0sUUFBUSxXQUFFLENBQUM7YUFDekI7aUJBQU0sSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQzthQUN4QjtZQUNELE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQztTQUNqRDtJQUNILENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUFqQkQsQ0FBa0MsdUJBQVUsR0FpQjNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBlbXB0eSB9IGZyb20gJy4uL29ic2VydmFibGUvZW1wdHknO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IHJlcGVhdHMgdGhlIHN0cmVhbSBvZiBpdGVtcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBhdCBtb3N0IGNvdW50IHRpbWVzLlxuICpcbiAqICFbXShyZXBlYXQucG5nKVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbY291bnRdIFRoZSBudW1iZXIgb2YgdGltZXMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGl0ZW1zIGFyZSByZXBlYXRlZCwgYSBjb3VudCBvZiAwIHdpbGwgeWllbGRcbiAqIGFuIGVtcHR5IE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgcmVwZWF0cyB0aGUgc3RyZWFtIG9mIGl0ZW1zIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGF0IG1vc3RcbiAqIGNvdW50IHRpbWVzLlxuICogQG1ldGhvZCByZXBlYXRcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXBlYXQ8VD4oY291bnQ6IG51bWJlciA9IC0xKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHtcbiAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiBlbXB0eSgpO1xuICAgIH0gZWxzZSBpZiAoY291bnQgPCAwKSB7XG4gICAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IFJlcGVhdE9wZXJhdG9yKC0xLCBzb3VyY2UpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBSZXBlYXRPcGVyYXRvcihjb3VudCAtIDEsIHNvdXJjZSkpO1xuICAgIH1cbiAgfTtcbn1cblxuY2xhc3MgUmVwZWF0T3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY291bnQ6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgfVxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFJlcGVhdFN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5jb3VudCwgdGhpcy5zb3VyY2UpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgUmVwZWF0U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxhbnk+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvdW50OiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG4gIGNvbXBsZXRlKCkge1xuICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIGNvbnN0IHsgc291cmNlLCBjb3VudCB9ID0gdGhpcztcbiAgICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29tcGxldGUoKTtcbiAgICAgIH0gZWxzZSBpZiAoY291bnQgPiAtMSkge1xuICAgICAgICB0aGlzLmNvdW50ID0gY291bnQgLSAxO1xuICAgICAgfVxuICAgICAgc291cmNlLnN1YnNjcmliZSh0aGlzLl91bnN1YnNjcmliZUFuZFJlY3ljbGUoKSk7XG4gICAgfVxuICB9XG59XG4iXX0=