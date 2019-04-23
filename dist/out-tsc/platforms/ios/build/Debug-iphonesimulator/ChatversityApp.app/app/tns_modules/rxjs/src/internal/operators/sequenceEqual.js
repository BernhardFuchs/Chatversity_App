"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
var tryCatch_1 = require("../util/tryCatch");
var errorObject_1 = require("../util/errorObject");
/**
 * Compares all values of two observables in sequence using an optional comparor function
 * and returns an observable of a single boolean value representing whether or not the two sequences
 * are equal.
 *
 * <span class="informal">Checks to see of all values emitted by both observables are equal, in order.</span>
 *
 * ![](sequenceEqual.png)
 *
 * `sequenceEqual` subscribes to two observables and buffers incoming values from each observable. Whenever either
 * observable emits a value, the value is buffered and the buffers are shifted and compared from the bottom
 * up; If any value pair doesn't match, the returned observable will emit `false` and complete. If one of the
 * observables completes, the operator will wait for the other observable to complete; If the other
 * observable emits before completing, the returned observable will emit `false` and complete. If one observable never
 * completes or emits after the other complets, the returned observable will never complete.
 *
 * ## Example
 * figure out if the Konami code matches
 * ```javascript
 * const codes = from([
 *   'ArrowUp',
 *   'ArrowUp',
 *   'ArrowDown',
 *   'ArrowDown',
 *   'ArrowLeft',
 *   'ArrowRight',
 *   'ArrowLeft',
 *   'ArrowRight',
 *   'KeyB',
 *   'KeyA',
 *   'Enter', // no start key, clearly.
 * ]);
 *
 * const keys = fromEvent(document, 'keyup').pipe(map(e => e.code));
 * const matches = keys.pipe(
 *   bufferCount(11, 1),
 *   mergeMap(
 *     last11 => from(last11).pipe(sequenceEqual(codes)),
 *   ),
 * );
 * matches.subscribe(matched => console.log('Successful cheat at Contra? ', matched));
 * ```
 *
 * @see {@link combineLatest}
 * @see {@link zip}
 * @see {@link withLatestFrom}
 *
 * @param {Observable} compareTo The observable sequence to compare the source sequence to.
 * @param {function} [comparor] An optional function to compare each value pair
 * @return {Observable} An Observable of a single boolean value representing whether or not
 * the values emitted by both observables were equal in sequence.
 * @method sequenceEqual
 * @owner Observable
 */
function sequenceEqual(compareTo, comparor) {
    return function (source) { return source.lift(new SequenceEqualOperator(compareTo, comparor)); };
}
exports.sequenceEqual = sequenceEqual;
var SequenceEqualOperator = /** @class */ (function () {
    function SequenceEqualOperator(compareTo, comparor) {
        this.compareTo = compareTo;
        this.comparor = comparor;
    }
    SequenceEqualOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SequenceEqualSubscriber(subscriber, this.compareTo, this.comparor));
    };
    return SequenceEqualOperator;
}());
exports.SequenceEqualOperator = SequenceEqualOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SequenceEqualSubscriber = /** @class */ (function (_super) {
    __extends(SequenceEqualSubscriber, _super);
    function SequenceEqualSubscriber(destination, compareTo, comparor) {
        var _this = _super.call(this, destination) || this;
        _this.compareTo = compareTo;
        _this.comparor = comparor;
        _this._a = [];
        _this._b = [];
        _this._oneComplete = false;
        _this.destination.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, _this)));
        return _this;
    }
    SequenceEqualSubscriber.prototype._next = function (value) {
        if (this._oneComplete && this._b.length === 0) {
            this.emit(false);
        }
        else {
            this._a.push(value);
            this.checkValues();
        }
    };
    SequenceEqualSubscriber.prototype._complete = function () {
        if (this._oneComplete) {
            this.emit(this._a.length === 0 && this._b.length === 0);
        }
        else {
            this._oneComplete = true;
        }
        this.unsubscribe();
    };
    SequenceEqualSubscriber.prototype.checkValues = function () {
        var _c = this, _a = _c._a, _b = _c._b, comparor = _c.comparor;
        while (_a.length > 0 && _b.length > 0) {
            var a = _a.shift();
            var b = _b.shift();
            var areEqual = false;
            if (comparor) {
                areEqual = tryCatch_1.tryCatch(comparor)(a, b);
                if (areEqual === errorObject_1.errorObject) {
                    this.destination.error(errorObject_1.errorObject.e);
                }
            }
            else {
                areEqual = a === b;
            }
            if (!areEqual) {
                this.emit(false);
            }
        }
    };
    SequenceEqualSubscriber.prototype.emit = function (value) {
        var destination = this.destination;
        destination.next(value);
        destination.complete();
    };
    SequenceEqualSubscriber.prototype.nextB = function (value) {
        if (this._oneComplete && this._a.length === 0) {
            this.emit(false);
        }
        else {
            this._b.push(value);
            this.checkValues();
        }
    };
    SequenceEqualSubscriber.prototype.completeB = function () {
        if (this._oneComplete) {
            this.emit(this._a.length === 0 && this._b.length === 0);
        }
        else {
            this._oneComplete = true;
        }
    };
    return SequenceEqualSubscriber;
}(Subscriber_1.Subscriber));
exports.SequenceEqualSubscriber = SequenceEqualSubscriber;
var SequenceEqualCompareToSubscriber = /** @class */ (function (_super) {
    __extends(SequenceEqualCompareToSubscriber, _super);
    function SequenceEqualCompareToSubscriber(destination, parent) {
        var _this = _super.call(this, destination) || this;
        _this.parent = parent;
        return _this;
    }
    SequenceEqualCompareToSubscriber.prototype._next = function (value) {
        this.parent.nextB(value);
    };
    SequenceEqualCompareToSubscriber.prototype._error = function (err) {
        this.parent.error(err);
        this.unsubscribe();
    };
    SequenceEqualCompareToSubscriber.prototype._complete = function () {
        this.parent.completeB();
        this.unsubscribe();
    };
    return SequenceEqualCompareToSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VxdWVuY2VFcXVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3NlcXVlbmNlRXF1YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw0Q0FBMkM7QUFFM0MsNkNBQTRDO0FBQzVDLG1EQUFrRDtBQUlsRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxREc7QUFDSCxTQUFnQixhQUFhLENBQUksU0FBd0IsRUFDeEIsUUFBa0M7SUFDakUsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQTNELENBQTJELENBQUM7QUFDaEcsQ0FBQztBQUhELHNDQUdDO0FBRUQ7SUFDRSwrQkFBb0IsU0FBd0IsRUFDeEIsUUFBaUM7UUFEakMsY0FBUyxHQUFULFNBQVMsQ0FBZTtRQUN4QixhQUFRLEdBQVIsUUFBUSxDQUF5QjtJQUNyRCxDQUFDO0lBRUQsb0NBQUksR0FBSixVQUFLLFVBQStCLEVBQUUsTUFBVztRQUMvQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSx1QkFBdUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBQ0gsNEJBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJZLHNEQUFxQjtBQVVsQzs7OztHQUlHO0FBQ0g7SUFBbUQsMkNBQWE7SUFLOUQsaUNBQVksV0FBd0IsRUFDaEIsU0FBd0IsRUFDeEIsUUFBaUM7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Q3JCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ3pEO2FBQU07WUFDTCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztTQUMxQjtJQUNILENBQUM7SUFDSCw4QkFBQztBQUFELENBQUMsQUF4RUQsQ0FBbUQsdUJBQVUsR0F3RTVEO0FBeEVZLDBEQUF1QjtBQTBFcEM7SUFBcUQsb0RBQWE7SUFDaEUsMENBQVksV0FBd0IsRUFBVSxNQUFxQztRQUFuRixZQUNFLGtCQUFNLFdBQVcsQ0FBQyxTQUNuQjtRQUY2QyxZQUFNLEdBQU4sTUFBTSxDQUErQjs7SUFFbkYsQ0FBQztJQUVTLGdEQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRVMsaURBQU0sR0FBaEIsVUFBaUIsR0FBUTtRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVTLG9EQUFTLEdBQW5CO1FBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUNILHVDQUFDO0FBQUQsQ0FBQyxBQWxCRCxDQUFxRCx1QkFBVSxHQWtCOUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyB0cnlDYXRjaCB9IGZyb20gJy4uL3V0aWwvdHJ5Q2F0Y2gnO1xuaW1wb3J0IHsgZXJyb3JPYmplY3QgfSBmcm9tICcuLi91dGlsL2Vycm9yT2JqZWN0JztcblxuaW1wb3J0IHsgT2JzZXJ2ZXIsIE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQ29tcGFyZXMgYWxsIHZhbHVlcyBvZiB0d28gb2JzZXJ2YWJsZXMgaW4gc2VxdWVuY2UgdXNpbmcgYW4gb3B0aW9uYWwgY29tcGFyb3IgZnVuY3Rpb25cbiAqIGFuZCByZXR1cm5zIGFuIG9ic2VydmFibGUgb2YgYSBzaW5nbGUgYm9vbGVhbiB2YWx1ZSByZXByZXNlbnRpbmcgd2hldGhlciBvciBub3QgdGhlIHR3byBzZXF1ZW5jZXNcbiAqIGFyZSBlcXVhbC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q2hlY2tzIHRvIHNlZSBvZiBhbGwgdmFsdWVzIGVtaXR0ZWQgYnkgYm90aCBvYnNlcnZhYmxlcyBhcmUgZXF1YWwsIGluIG9yZGVyLjwvc3Bhbj5cbiAqXG4gKiAhW10oc2VxdWVuY2VFcXVhbC5wbmcpXG4gKlxuICogYHNlcXVlbmNlRXF1YWxgIHN1YnNjcmliZXMgdG8gdHdvIG9ic2VydmFibGVzIGFuZCBidWZmZXJzIGluY29taW5nIHZhbHVlcyBmcm9tIGVhY2ggb2JzZXJ2YWJsZS4gV2hlbmV2ZXIgZWl0aGVyXG4gKiBvYnNlcnZhYmxlIGVtaXRzIGEgdmFsdWUsIHRoZSB2YWx1ZSBpcyBidWZmZXJlZCBhbmQgdGhlIGJ1ZmZlcnMgYXJlIHNoaWZ0ZWQgYW5kIGNvbXBhcmVkIGZyb20gdGhlIGJvdHRvbVxuICogdXA7IElmIGFueSB2YWx1ZSBwYWlyIGRvZXNuJ3QgbWF0Y2gsIHRoZSByZXR1cm5lZCBvYnNlcnZhYmxlIHdpbGwgZW1pdCBgZmFsc2VgIGFuZCBjb21wbGV0ZS4gSWYgb25lIG9mIHRoZVxuICogb2JzZXJ2YWJsZXMgY29tcGxldGVzLCB0aGUgb3BlcmF0b3Igd2lsbCB3YWl0IGZvciB0aGUgb3RoZXIgb2JzZXJ2YWJsZSB0byBjb21wbGV0ZTsgSWYgdGhlIG90aGVyXG4gKiBvYnNlcnZhYmxlIGVtaXRzIGJlZm9yZSBjb21wbGV0aW5nLCB0aGUgcmV0dXJuZWQgb2JzZXJ2YWJsZSB3aWxsIGVtaXQgYGZhbHNlYCBhbmQgY29tcGxldGUuIElmIG9uZSBvYnNlcnZhYmxlIG5ldmVyXG4gKiBjb21wbGV0ZXMgb3IgZW1pdHMgYWZ0ZXIgdGhlIG90aGVyIGNvbXBsZXRzLCB0aGUgcmV0dXJuZWQgb2JzZXJ2YWJsZSB3aWxsIG5ldmVyIGNvbXBsZXRlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIGZpZ3VyZSBvdXQgaWYgdGhlIEtvbmFtaSBjb2RlIG1hdGNoZXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNvZGVzID0gZnJvbShbXG4gKiAgICdBcnJvd1VwJyxcbiAqICAgJ0Fycm93VXAnLFxuICogICAnQXJyb3dEb3duJyxcbiAqICAgJ0Fycm93RG93bicsXG4gKiAgICdBcnJvd0xlZnQnLFxuICogICAnQXJyb3dSaWdodCcsXG4gKiAgICdBcnJvd0xlZnQnLFxuICogICAnQXJyb3dSaWdodCcsXG4gKiAgICdLZXlCJyxcbiAqICAgJ0tleUEnLFxuICogICAnRW50ZXInLCAvLyBubyBzdGFydCBrZXksIGNsZWFybHkuXG4gKiBdKTtcbiAqXG4gKiBjb25zdCBrZXlzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAna2V5dXAnKS5waXBlKG1hcChlID0+IGUuY29kZSkpO1xuICogY29uc3QgbWF0Y2hlcyA9IGtleXMucGlwZShcbiAqICAgYnVmZmVyQ291bnQoMTEsIDEpLFxuICogICBtZXJnZU1hcChcbiAqICAgICBsYXN0MTEgPT4gZnJvbShsYXN0MTEpLnBpcGUoc2VxdWVuY2VFcXVhbChjb2RlcykpLFxuICogICApLFxuICogKTtcbiAqIG1hdGNoZXMuc3Vic2NyaWJlKG1hdGNoZWQgPT4gY29uc29sZS5sb2coJ1N1Y2Nlc3NmdWwgY2hlYXQgYXQgQ29udHJhPyAnLCBtYXRjaGVkKSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBjb21iaW5lTGF0ZXN0fVxuICogQHNlZSB7QGxpbmsgemlwfVxuICogQHNlZSB7QGxpbmsgd2l0aExhdGVzdEZyb219XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlfSBjb21wYXJlVG8gVGhlIG9ic2VydmFibGUgc2VxdWVuY2UgdG8gY29tcGFyZSB0aGUgc291cmNlIHNlcXVlbmNlIHRvLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2NvbXBhcm9yXSBBbiBvcHRpb25hbCBmdW5jdGlvbiB0byBjb21wYXJlIGVhY2ggdmFsdWUgcGFpclxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSBvZiBhIHNpbmdsZSBib29sZWFuIHZhbHVlIHJlcHJlc2VudGluZyB3aGV0aGVyIG9yIG5vdFxuICogdGhlIHZhbHVlcyBlbWl0dGVkIGJ5IGJvdGggb2JzZXJ2YWJsZXMgd2VyZSBlcXVhbCBpbiBzZXF1ZW5jZS5cbiAqIEBtZXRob2Qgc2VxdWVuY2VFcXVhbFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlcXVlbmNlRXF1YWw8VD4oY29tcGFyZVRvOiBPYnNlcnZhYmxlPFQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGFyb3I/OiAoYTogVCwgYjogVCkgPT4gYm9vbGVhbik6IE9wZXJhdG9yRnVuY3Rpb248VCwgYm9vbGVhbj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFNlcXVlbmNlRXF1YWxPcGVyYXRvcihjb21wYXJlVG8sIGNvbXBhcm9yKSk7XG59XG5cbmV4cG9ydCBjbGFzcyBTZXF1ZW5jZUVxdWFsT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBib29sZWFuPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29tcGFyZVRvOiBPYnNlcnZhYmxlPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbXBhcm9yOiAoYTogVCwgYjogVCkgPT4gYm9vbGVhbikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGJvb2xlYW4+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFNlcXVlbmNlRXF1YWxTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuY29tcGFyZVRvLCB0aGlzLmNvbXBhcm9yKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBTZXF1ZW5jZUVxdWFsU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIF9hOiBUW10gPSBbXTtcbiAgcHJpdmF0ZSBfYjogVFtdID0gW107XG4gIHByaXZhdGUgX29uZUNvbXBsZXRlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IE9ic2VydmVyPFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbXBhcmVUbzogT2JzZXJ2YWJsZTxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb21wYXJvcjogKGE6IFQsIGI6IFQpID0+IGJvb2xlYW4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgKHRoaXMuZGVzdGluYXRpb24gYXMgU3Vic2NyaXB0aW9uKS5hZGQoY29tcGFyZVRvLnN1YnNjcmliZShuZXcgU2VxdWVuY2VFcXVhbENvbXBhcmVUb1N1YnNjcmliZXIoZGVzdGluYXRpb24sIHRoaXMpKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb25lQ29tcGxldGUgJiYgdGhpcy5fYi5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuZW1pdChmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2EucHVzaCh2YWx1ZSk7XG4gICAgICB0aGlzLmNoZWNrVmFsdWVzKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb25lQ29tcGxldGUpIHtcbiAgICAgIHRoaXMuZW1pdCh0aGlzLl9hLmxlbmd0aCA9PT0gMCAmJiB0aGlzLl9iLmxlbmd0aCA9PT0gMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX29uZUNvbXBsZXRlID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgY2hlY2tWYWx1ZXMoKSB7XG4gICAgY29uc3QgeyBfYSwgX2IsIGNvbXBhcm9yIH0gPSB0aGlzO1xuICAgIHdoaWxlIChfYS5sZW5ndGggPiAwICYmIF9iLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBhID0gX2Euc2hpZnQoKTtcbiAgICAgIGxldCBiID0gX2Iuc2hpZnQoKTtcbiAgICAgIGxldCBhcmVFcXVhbCA9IGZhbHNlO1xuICAgICAgaWYgKGNvbXBhcm9yKSB7XG4gICAgICAgIGFyZUVxdWFsID0gdHJ5Q2F0Y2goY29tcGFyb3IpKGEsIGIpO1xuICAgICAgICBpZiAoYXJlRXF1YWwgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJlRXF1YWwgPSBhID09PSBiO1xuICAgICAgfVxuICAgICAgaWYgKCFhcmVFcXVhbCkge1xuICAgICAgICB0aGlzLmVtaXQoZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVtaXQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCB7IGRlc3RpbmF0aW9uIH0gPSB0aGlzO1xuICAgIGRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cblxuICBuZXh0Qih2YWx1ZTogVCkge1xuICAgIGlmICh0aGlzLl9vbmVDb21wbGV0ZSAmJiB0aGlzLl9hLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5lbWl0KGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYi5wdXNoKHZhbHVlKTtcbiAgICAgIHRoaXMuY2hlY2tWYWx1ZXMoKTtcbiAgICB9XG4gIH1cblxuICBjb21wbGV0ZUIoKSB7XG4gICAgaWYgKHRoaXMuX29uZUNvbXBsZXRlKSB7XG4gICAgICB0aGlzLmVtaXQodGhpcy5fYS5sZW5ndGggPT09IDAgJiYgdGhpcy5fYi5sZW5ndGggPT09IDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9vbmVDb21wbGV0ZSA9IHRydWU7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFNlcXVlbmNlRXF1YWxDb21wYXJlVG9TdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBPYnNlcnZlcjxSPiwgcHJpdmF0ZSBwYXJlbnQ6IFNlcXVlbmNlRXF1YWxTdWJzY3JpYmVyPFQsIFI+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5wYXJlbnQubmV4dEIodmFsdWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIHRoaXMucGFyZW50LmVycm9yKGVycik7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnBhcmVudC5jb21wbGV0ZUIoKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiJdfQ==