"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/**
 * Emits the values emitted by the source Observable until a `notifier`
 * Observable emits a value.
 *
 * <span class="informal">Lets values pass until a second Observable,
 * `notifier`, emits a value. Then, it completes.</span>
 *
 * ![](takeUntil.png)
 *
 * `takeUntil` subscribes and begins mirroring the source Observable. It also
 * monitors a second Observable, `notifier` that you provide. If the `notifier`
 * emits a value, the output Observable stops mirroring the source Observable
 * and completes. If the `notifier` doesn't emit any value and completes
 * then `takeUntil` will pass all values.
 *
 * ## Example
 * Tick every second until the first click happens
 * ```javascript
 * const interval = interval(1000);
 * const clicks = fromEvent(document, 'click');
 * const result = interval.pipe(takeUntil(clicks));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link take}
 * @see {@link takeLast}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @param {Observable} notifier The Observable whose first emitted value will
 * cause the output Observable of `takeUntil` to stop emitting values from the
 * source Observable.
 * @return {Observable<T>} An Observable that emits the values from the source
 * Observable until such time as `notifier` emits its first value.
 * @method takeUntil
 * @owner Observable
 */
function takeUntil(notifier) {
    return function (source) { return source.lift(new TakeUntilOperator(notifier)); };
}
exports.takeUntil = takeUntil;
var TakeUntilOperator = /** @class */ (function () {
    function TakeUntilOperator(notifier) {
        this.notifier = notifier;
    }
    TakeUntilOperator.prototype.call = function (subscriber, source) {
        var takeUntilSubscriber = new TakeUntilSubscriber(subscriber);
        var notifierSubscription = subscribeToResult_1.subscribeToResult(takeUntilSubscriber, this.notifier);
        if (notifierSubscription && !takeUntilSubscriber.seenValue) {
            takeUntilSubscriber.add(notifierSubscription);
            return source.subscribe(takeUntilSubscriber);
        }
        return takeUntilSubscriber;
    };
    return TakeUntilOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeUntilSubscriber = /** @class */ (function (_super) {
    __extends(TakeUntilSubscriber, _super);
    function TakeUntilSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.seenValue = false;
        return _this;
    }
    TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.seenValue = true;
        this.complete();
    };
    TakeUntilSubscriber.prototype.notifyComplete = function () {
        // noop
    };
    return TakeUntilSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFrZVVudGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvdGFrZVVudGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsc0RBQXFEO0FBRXJELCtEQUE4RDtBQUk5RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0NHO0FBQ0gsU0FBZ0IsU0FBUyxDQUFJLFFBQXlCO0lBQ3BELE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQTVDLENBQTRDLENBQUM7QUFDakYsQ0FBQztBQUZELDhCQUVDO0FBRUQ7SUFDRSwyQkFBb0IsUUFBeUI7UUFBekIsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7SUFDN0MsQ0FBQztJQUVELGdDQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsSUFBTSxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hFLElBQU0sb0JBQW9CLEdBQUcscUNBQWlCLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25GLElBQUksb0JBQW9CLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUU7WUFDMUQsbUJBQW1CLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDOUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDOUM7UUFDRCxPQUFPLG1CQUFtQixDQUFDO0lBQzdCLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFiRCxJQWFDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQXdDLHVDQUFxQjtJQUczRCw2QkFBWSxXQUE0QjtRQUF4QyxZQUNFLGtCQUFNLFdBQVcsQ0FBQyxTQUNuQjtRQUpELGVBQVMsR0FBRyxLQUFLLENBQUM7O0lBSWxCLENBQUM7SUFFRCx3Q0FBVSxHQUFWLFVBQVcsVUFBYSxFQUFFLFVBQWEsRUFDNUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUErQjtRQUN4QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELDRDQUFjLEdBQWQ7UUFDRSxPQUFPO0lBQ1QsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQWpCRCxDQUF3QyxpQ0FBZSxHQWlCdEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuXG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogRW1pdHMgdGhlIHZhbHVlcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB1bnRpbCBhIGBub3RpZmllcmBcbiAqIE9ic2VydmFibGUgZW1pdHMgYSB2YWx1ZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+TGV0cyB2YWx1ZXMgcGFzcyB1bnRpbCBhIHNlY29uZCBPYnNlcnZhYmxlLFxuICogYG5vdGlmaWVyYCwgZW1pdHMgYSB2YWx1ZS4gVGhlbiwgaXQgY29tcGxldGVzLjwvc3Bhbj5cbiAqXG4gKiAhW10odGFrZVVudGlsLnBuZylcbiAqXG4gKiBgdGFrZVVudGlsYCBzdWJzY3JpYmVzIGFuZCBiZWdpbnMgbWlycm9yaW5nIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gSXQgYWxzb1xuICogbW9uaXRvcnMgYSBzZWNvbmQgT2JzZXJ2YWJsZSwgYG5vdGlmaWVyYCB0aGF0IHlvdSBwcm92aWRlLiBJZiB0aGUgYG5vdGlmaWVyYFxuICogZW1pdHMgYSB2YWx1ZSwgdGhlIG91dHB1dCBPYnNlcnZhYmxlIHN0b3BzIG1pcnJvcmluZyB0aGUgc291cmNlIE9ic2VydmFibGVcbiAqIGFuZCBjb21wbGV0ZXMuIElmIHRoZSBgbm90aWZpZXJgIGRvZXNuJ3QgZW1pdCBhbnkgdmFsdWUgYW5kIGNvbXBsZXRlc1xuICogdGhlbiBgdGFrZVVudGlsYCB3aWxsIHBhc3MgYWxsIHZhbHVlcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBUaWNrIGV2ZXJ5IHNlY29uZCB1bnRpbCB0aGUgZmlyc3QgY2xpY2sgaGFwcGVuc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgaW50ZXJ2YWwgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCByZXN1bHQgPSBpbnRlcnZhbC5waXBlKHRha2VVbnRpbChjbGlja3MpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayB0YWtlfVxuICogQHNlZSB7QGxpbmsgdGFrZUxhc3R9XG4gKiBAc2VlIHtAbGluayB0YWtlV2hpbGV9XG4gKiBAc2VlIHtAbGluayBza2lwfVxuICpcbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZX0gbm90aWZpZXIgVGhlIE9ic2VydmFibGUgd2hvc2UgZmlyc3QgZW1pdHRlZCB2YWx1ZSB3aWxsXG4gKiBjYXVzZSB0aGUgb3V0cHV0IE9ic2VydmFibGUgb2YgYHRha2VVbnRpbGAgdG8gc3RvcCBlbWl0dGluZyB2YWx1ZXMgZnJvbSB0aGVcbiAqIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSB2YWx1ZXMgZnJvbSB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlIHVudGlsIHN1Y2ggdGltZSBhcyBgbm90aWZpZXJgIGVtaXRzIGl0cyBmaXJzdCB2YWx1ZS5cbiAqIEBtZXRob2QgdGFrZVVudGlsXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGFrZVVudGlsPFQ+KG5vdGlmaWVyOiBPYnNlcnZhYmxlPGFueT4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFRha2VVbnRpbE9wZXJhdG9yKG5vdGlmaWVyKSk7XG59XG5cbmNsYXNzIFRha2VVbnRpbE9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5vdGlmaWVyOiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICBjb25zdCB0YWtlVW50aWxTdWJzY3JpYmVyID0gbmV3IFRha2VVbnRpbFN1YnNjcmliZXIoc3Vic2NyaWJlcik7XG4gICAgY29uc3Qgbm90aWZpZXJTdWJzY3JpcHRpb24gPSBzdWJzY3JpYmVUb1Jlc3VsdCh0YWtlVW50aWxTdWJzY3JpYmVyLCB0aGlzLm5vdGlmaWVyKTtcbiAgICBpZiAobm90aWZpZXJTdWJzY3JpcHRpb24gJiYgIXRha2VVbnRpbFN1YnNjcmliZXIuc2VlblZhbHVlKSB7XG4gICAgICB0YWtlVW50aWxTdWJzY3JpYmVyLmFkZChub3RpZmllclN1YnNjcmlwdGlvbik7XG4gICAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZSh0YWtlVW50aWxTdWJzY3JpYmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIHRha2VVbnRpbFN1YnNjcmliZXI7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFRha2VVbnRpbFN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgUj4ge1xuICBzZWVuVmFsdWUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxhbnk+LCApIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFIsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuc2VlblZhbHVlID0gdHJ1ZTtcbiAgICB0aGlzLmNvbXBsZXRlKCk7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZSgpOiB2b2lkIHtcbiAgICAvLyBub29wXG4gIH1cbn1cbiJdfQ==