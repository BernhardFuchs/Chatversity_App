"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
var noop_1 = require("../util/noop");
var isFunction_1 = require("../util/isFunction");
/* tslint:enable:max-line-length */
/**
 * Perform a side effect for every emission on the source Observable, but return
 * an Observable that is identical to the source.
 *
 * <span class="informal">Intercepts each emission on the source and runs a
 * function, but returns an output which is identical to the source as long as errors don't occur.</span>
 *
 * ![](do.png)
 *
 * Returns a mirrored Observable of the source Observable, but modified so that
 * the provided Observer is called to perform a side effect for every value,
 * error, and completion emitted by the source. Any errors that are thrown in
 * the aforementioned Observer or handlers are safely sent down the error path
 * of the output Observable.
 *
 * This operator is useful for debugging your Observables for the correct values
 * or performing other side effects.
 *
 * Note: this is different to a `subscribe` on the Observable. If the Observable
 * returned by `tap` is not subscribed, the side effects specified by the
 * Observer will never happen. `tap` therefore simply spies on existing
 * execution, it does not trigger an execution to happen like `subscribe` does.
 *
 * ## Example
 * Map every click to the clientX position of that click, while also logging the click event
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const positions = clicks.pipe(
 *   tap(ev => console.log(ev)),
 *   map(ev => ev.clientX),
 * );
 * positions.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link map}
 * @see {@link Observable#subscribe}
 *
 * @param {Observer|function} [nextOrObserver] A normal Observer object or a
 * callback for `next`.
 * @param {function} [error] Callback for errors in the source.
 * @param {function} [complete] Callback for the completion of the source.
 * @return {Observable} An Observable identical to the source, but runs the
 * specified Observer or callback(s) for each item.
 * @name tap
 */
function tap(nextOrObserver, error, complete) {
    return function tapOperatorFunction(source) {
        return source.lift(new DoOperator(nextOrObserver, error, complete));
    };
}
exports.tap = tap;
var DoOperator = /** @class */ (function () {
    function DoOperator(nextOrObserver, error, complete) {
        this.nextOrObserver = nextOrObserver;
        this.error = error;
        this.complete = complete;
    }
    DoOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TapSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
    };
    return DoOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TapSubscriber = /** @class */ (function (_super) {
    __extends(TapSubscriber, _super);
    function TapSubscriber(destination, observerOrNext, error, complete) {
        var _this = _super.call(this, destination) || this;
        _this._tapNext = noop_1.noop;
        _this._tapError = noop_1.noop;
        _this._tapComplete = noop_1.noop;
        _this._tapError = error || noop_1.noop;
        _this._tapComplete = complete || noop_1.noop;
        if (isFunction_1.isFunction(observerOrNext)) {
            _this._context = _this;
            _this._tapNext = observerOrNext;
        }
        else if (observerOrNext) {
            _this._context = observerOrNext;
            _this._tapNext = observerOrNext.next || noop_1.noop;
            _this._tapError = observerOrNext.error || noop_1.noop;
            _this._tapComplete = observerOrNext.complete || noop_1.noop;
        }
        return _this;
    }
    TapSubscriber.prototype._next = function (value) {
        try {
            this._tapNext.call(this._context, value);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(value);
    };
    TapSubscriber.prototype._error = function (err) {
        try {
            this._tapError.call(this._context, err);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.error(err);
    };
    TapSubscriber.prototype._complete = function () {
        try {
            this._tapComplete.call(this._context);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        return this.destination.complete();
    };
    return TapSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvdGFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNENBQTJDO0FBRzNDLHFDQUFvQztBQUNwQyxpREFBZ0Q7QUFLaEQsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRDRztBQUNILFNBQWdCLEdBQUcsQ0FBSSxjQUFzRCxFQUN0RCxLQUF3QixFQUN4QixRQUFxQjtJQUMxQyxPQUFPLFNBQVMsbUJBQW1CLENBQUMsTUFBcUI7UUFDdkQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUM7QUFDSixDQUFDO0FBTkQsa0JBTUM7QUFFRDtJQUNFLG9CQUFvQixjQUFzRCxFQUN0RCxLQUF3QixFQUN4QixRQUFxQjtRQUZyQixtQkFBYyxHQUFkLGNBQWMsQ0FBd0M7UUFDdEQsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFDeEIsYUFBUSxHQUFSLFFBQVEsQ0FBYTtJQUN6QyxDQUFDO0lBQ0QseUJBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxhQUFhLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN6RyxDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQUVEOzs7O0dBSUc7QUFFSDtJQUErQixpQ0FBYTtJQVMxQyx1QkFBWSxXQUEwQixFQUMxQixjQUEwRCxFQUMxRCxLQUF5QixFQUN6QixRQUFxQjtRQUhqQyxZQUlJLGtCQUFNLFdBQVcsQ0FBQyxTQVluQjtRQXRCSyxjQUFRLEdBQXlCLFdBQUksQ0FBQztRQUV0QyxlQUFTLEdBQXlCLFdBQUksQ0FBQztRQUV2QyxrQkFBWSxHQUFpQixXQUFJLENBQUM7UUFPdEMsS0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLElBQUksV0FBSSxDQUFDO1FBQy9CLEtBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxJQUFJLFdBQUksQ0FBQztRQUNyQyxJQUFJLHVCQUFVLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDOUIsS0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFJLENBQUM7WUFDckIsS0FBSSxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUM7U0FDaEM7YUFBTSxJQUFJLGNBQWMsRUFBRTtZQUN6QixLQUFJLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQztZQUMvQixLQUFJLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQyxJQUFJLElBQUksV0FBSSxDQUFDO1lBQzVDLEtBQUksQ0FBQyxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUssSUFBSSxXQUFJLENBQUM7WUFDOUMsS0FBSSxDQUFDLFlBQVksR0FBRyxjQUFjLENBQUMsUUFBUSxJQUFJLFdBQUksQ0FBQztTQUNyRDs7SUFDSCxDQUFDO0lBRUgsNkJBQUssR0FBTCxVQUFNLEtBQVE7UUFDWixJQUFJO1lBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMxQztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELDhCQUFNLEdBQU4sVUFBTyxHQUFRO1FBQ2IsSUFBSTtZQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDekM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxpQ0FBUyxHQUFUO1FBQ0UsSUFBSTtZQUNGLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUcsQ0FBQztTQUN6QztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsT0FBTztTQUNSO1FBQ0QsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUF4REQsQ0FBK0IsdUJBQVUsR0F3RHhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFBhcnRpYWxPYnNlcnZlciwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRhcDxUPihuZXh0PzogKHg6IFQpID0+IHZvaWQsIGVycm9yPzogKGU6IGFueSkgPT4gdm9pZCwgY29tcGxldGU/OiAoKSA9PiB2b2lkKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHRhcDxUPihvYnNlcnZlcjogUGFydGlhbE9ic2VydmVyPFQ+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBQZXJmb3JtIGEgc2lkZSBlZmZlY3QgZm9yIGV2ZXJ5IGVtaXNzaW9uIG9uIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgYnV0IHJldHVyblxuICogYW4gT2JzZXJ2YWJsZSB0aGF0IGlzIGlkZW50aWNhbCB0byB0aGUgc291cmNlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5JbnRlcmNlcHRzIGVhY2ggZW1pc3Npb24gb24gdGhlIHNvdXJjZSBhbmQgcnVucyBhXG4gKiBmdW5jdGlvbiwgYnV0IHJldHVybnMgYW4gb3V0cHV0IHdoaWNoIGlzIGlkZW50aWNhbCB0byB0aGUgc291cmNlIGFzIGxvbmcgYXMgZXJyb3JzIGRvbid0IG9jY3VyLjwvc3Bhbj5cbiAqXG4gKiAhW10oZG8ucG5nKVxuICpcbiAqIFJldHVybnMgYSBtaXJyb3JlZCBPYnNlcnZhYmxlIG9mIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgYnV0IG1vZGlmaWVkIHNvIHRoYXRcbiAqIHRoZSBwcm92aWRlZCBPYnNlcnZlciBpcyBjYWxsZWQgdG8gcGVyZm9ybSBhIHNpZGUgZWZmZWN0IGZvciBldmVyeSB2YWx1ZSxcbiAqIGVycm9yLCBhbmQgY29tcGxldGlvbiBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UuIEFueSBlcnJvcnMgdGhhdCBhcmUgdGhyb3duIGluXG4gKiB0aGUgYWZvcmVtZW50aW9uZWQgT2JzZXJ2ZXIgb3IgaGFuZGxlcnMgYXJlIHNhZmVseSBzZW50IGRvd24gdGhlIGVycm9yIHBhdGhcbiAqIG9mIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqXG4gKiBUaGlzIG9wZXJhdG9yIGlzIHVzZWZ1bCBmb3IgZGVidWdnaW5nIHlvdXIgT2JzZXJ2YWJsZXMgZm9yIHRoZSBjb3JyZWN0IHZhbHVlc1xuICogb3IgcGVyZm9ybWluZyBvdGhlciBzaWRlIGVmZmVjdHMuXG4gKlxuICogTm90ZTogdGhpcyBpcyBkaWZmZXJlbnQgdG8gYSBgc3Vic2NyaWJlYCBvbiB0aGUgT2JzZXJ2YWJsZS4gSWYgdGhlIE9ic2VydmFibGVcbiAqIHJldHVybmVkIGJ5IGB0YXBgIGlzIG5vdCBzdWJzY3JpYmVkLCB0aGUgc2lkZSBlZmZlY3RzIHNwZWNpZmllZCBieSB0aGVcbiAqIE9ic2VydmVyIHdpbGwgbmV2ZXIgaGFwcGVuLiBgdGFwYCB0aGVyZWZvcmUgc2ltcGx5IHNwaWVzIG9uIGV4aXN0aW5nXG4gKiBleGVjdXRpb24sIGl0IGRvZXMgbm90IHRyaWdnZXIgYW4gZXhlY3V0aW9uIHRvIGhhcHBlbiBsaWtlIGBzdWJzY3JpYmVgIGRvZXMuXG4gKlxuICogIyMgRXhhbXBsZVxuICogTWFwIGV2ZXJ5IGNsaWNrIHRvIHRoZSBjbGllbnRYIHBvc2l0aW9uIG9mIHRoYXQgY2xpY2ssIHdoaWxlIGFsc28gbG9nZ2luZyB0aGUgY2xpY2sgZXZlbnRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBwb3NpdGlvbnMgPSBjbGlja3MucGlwZShcbiAqICAgdGFwKGV2ID0+IGNvbnNvbGUubG9nKGV2KSksXG4gKiAgIG1hcChldiA9PiBldi5jbGllbnRYKSxcbiAqICk7XG4gKiBwb3NpdGlvbnMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgbWFwfVxuICogQHNlZSB7QGxpbmsgT2JzZXJ2YWJsZSNzdWJzY3JpYmV9XG4gKlxuICogQHBhcmFtIHtPYnNlcnZlcnxmdW5jdGlvbn0gW25leHRPck9ic2VydmVyXSBBIG5vcm1hbCBPYnNlcnZlciBvYmplY3Qgb3IgYVxuICogY2FsbGJhY2sgZm9yIGBuZXh0YC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtlcnJvcl0gQ2FsbGJhY2sgZm9yIGVycm9ycyBpbiB0aGUgc291cmNlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2NvbXBsZXRlXSBDYWxsYmFjayBmb3IgdGhlIGNvbXBsZXRpb24gb2YgdGhlIHNvdXJjZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgaWRlbnRpY2FsIHRvIHRoZSBzb3VyY2UsIGJ1dCBydW5zIHRoZVxuICogc3BlY2lmaWVkIE9ic2VydmVyIG9yIGNhbGxiYWNrKHMpIGZvciBlYWNoIGl0ZW0uXG4gKiBAbmFtZSB0YXBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRhcDxUPihuZXh0T3JPYnNlcnZlcj86IFBhcnRpYWxPYnNlcnZlcjxUPiB8ICgoeDogVCkgPT4gdm9pZCksXG4gICAgICAgICAgICAgICAgICAgICAgIGVycm9yPzogKGU6IGFueSkgPT4gdm9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU/OiAoKSA9PiB2b2lkKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRhcE9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBEb09wZXJhdG9yKG5leHRPck9ic2VydmVyLCBlcnJvciwgY29tcGxldGUpKTtcbiAgfTtcbn1cblxuY2xhc3MgRG9PcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBuZXh0T3JPYnNlcnZlcj86IFBhcnRpYWxPYnNlcnZlcjxUPiB8ICgoeDogVCkgPT4gdm9pZCksXG4gICAgICAgICAgICAgIHByaXZhdGUgZXJyb3I/OiAoZTogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbXBsZXRlPzogKCkgPT4gdm9pZCkge1xuICB9XG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgVGFwU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLm5leHRPck9ic2VydmVyLCB0aGlzLmVycm9yLCB0aGlzLmNvbXBsZXRlKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cblxuY2xhc3MgVGFwU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIF9jb250ZXh0OiBhbnk7XG5cbiAgcHJpdmF0ZSBfdGFwTmV4dDogKCh2YWx1ZTogVCkgPT4gdm9pZCkgPSBub29wO1xuXG4gIHByaXZhdGUgX3RhcEVycm9yOiAoKGVycjogYW55KSA9PiB2b2lkKSA9IG5vb3A7XG5cbiAgcHJpdmF0ZSBfdGFwQ29tcGxldGU6ICgoKSA9PiB2b2lkKSA9IG5vb3A7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIG9ic2VydmVyT3JOZXh0PzogUGFydGlhbE9ic2VydmVyPFQ+IHwgKCh2YWx1ZTogVCkgPT4gdm9pZCksXG4gICAgICAgICAgICAgIGVycm9yPzogKGU/OiBhbnkpID0+IHZvaWQsXG4gICAgICAgICAgICAgIGNvbXBsZXRlPzogKCkgPT4gdm9pZCkge1xuICAgICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgICAgdGhpcy5fdGFwRXJyb3IgPSBlcnJvciB8fCBub29wO1xuICAgICAgdGhpcy5fdGFwQ29tcGxldGUgPSBjb21wbGV0ZSB8fCBub29wO1xuICAgICAgaWYgKGlzRnVuY3Rpb24ob2JzZXJ2ZXJPck5leHQpKSB7XG4gICAgICAgIHRoaXMuX2NvbnRleHQgPSB0aGlzO1xuICAgICAgICB0aGlzLl90YXBOZXh0ID0gb2JzZXJ2ZXJPck5leHQ7XG4gICAgICB9IGVsc2UgaWYgKG9ic2VydmVyT3JOZXh0KSB7XG4gICAgICAgIHRoaXMuX2NvbnRleHQgPSBvYnNlcnZlck9yTmV4dDtcbiAgICAgICAgdGhpcy5fdGFwTmV4dCA9IG9ic2VydmVyT3JOZXh0Lm5leHQgfHwgbm9vcDtcbiAgICAgICAgdGhpcy5fdGFwRXJyb3IgPSBvYnNlcnZlck9yTmV4dC5lcnJvciB8fCBub29wO1xuICAgICAgICB0aGlzLl90YXBDb21wbGV0ZSA9IG9ic2VydmVyT3JOZXh0LmNvbXBsZXRlIHx8IG5vb3A7XG4gICAgICB9XG4gICAgfVxuXG4gIF9uZXh0KHZhbHVlOiBUKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX3RhcE5leHQuY2FsbCh0aGlzLl9jb250ZXh0LCB2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBfZXJyb3IoZXJyOiBhbnkpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fdGFwRXJyb3IuY2FsbCh0aGlzLl9jb250ZXh0LCBlcnIpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gIH1cblxuICBfY29tcGxldGUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX3RhcENvbXBsZXRlLmNhbGwodGhpcy5fY29udGV4dCwgKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxufVxuIl19