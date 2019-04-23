"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EmptyError_1 = require("../util/EmptyError");
var filter_1 = require("./filter");
var takeLast_1 = require("./takeLast");
var throwIfEmpty_1 = require("./throwIfEmpty");
var defaultIfEmpty_1 = require("./defaultIfEmpty");
var identity_1 = require("../util/identity");
/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits only the last item emitted by the source Observable.
 * It optionally takes a predicate function as a parameter, in which case, rather than emitting
 * the last item from the source Observable, the resulting Observable will emit the last item
 * from the source Observable that satisfies the predicate.
 *
 * ![](last.png)
 *
 * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
 * callback if the Observable completes before any `next` notification was sent.
 * @param {function} [predicate] - The condition any source emitted item has to satisfy.
 * @param {any} [defaultValue] - An optional default value to provide if last
 * predicate isn't met or no values were emitted.
 * @return {Observable} An Observable that emits only the last item satisfying the given condition
 * from the source, or an NoSuchElementException if no such items are emitted.
 * @throws - Throws if no items that match the predicate are emitted by the source Observable.
 */
function last(predicate, defaultValue) {
    var hasDefaultValue = arguments.length >= 2;
    return function (source) { return source.pipe(predicate ? filter_1.filter(function (v, i) { return predicate(v, i, source); }) : identity_1.identity, takeLast_1.takeLast(1), hasDefaultValue ? defaultIfEmpty_1.defaultIfEmpty(defaultValue) : throwIfEmpty_1.throwIfEmpty(function () { return new EmptyError_1.EmptyError(); })); };
}
exports.last = last;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9sYXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsaURBQWdEO0FBRWhELG1DQUFrQztBQUNsQyx1Q0FBc0M7QUFDdEMsK0NBQThDO0FBQzlDLG1EQUFrRDtBQUNsRCw2Q0FBNEM7QUFlNUMsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsU0FBZ0IsSUFBSSxDQUNsQixTQUFnRixFQUNoRixZQUFnQjtJQUVoQixJQUFNLGVBQWUsR0FBRyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUM5QyxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQzNDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFRLEVBQ2hFLG1CQUFRLENBQUMsQ0FBQyxDQUFDLEVBQ1gsZUFBZSxDQUFDLENBQUMsQ0FBQywrQkFBYyxDQUFRLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQywyQkFBWSxDQUFDLGNBQU0sT0FBQSxJQUFJLHVCQUFVLEVBQUUsRUFBaEIsQ0FBZ0IsQ0FBQyxDQUM3RixFQUppQyxDQUlqQyxDQUFDO0FBQ0osQ0FBQztBQVZELG9CQVVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBFbXB0eUVycm9yIH0gZnJvbSAnLi4vdXRpbC9FbXB0eUVycm9yJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi8uLi9pbnRlcm5hbC90eXBlcyc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICcuL2ZpbHRlcic7XG5pbXBvcnQgeyB0YWtlTGFzdCB9IGZyb20gJy4vdGFrZUxhc3QnO1xuaW1wb3J0IHsgdGhyb3dJZkVtcHR5IH0gZnJvbSAnLi90aHJvd0lmRW1wdHknO1xuaW1wb3J0IHsgZGVmYXVsdElmRW1wdHkgfSBmcm9tICcuL2RlZmF1bHRJZkVtcHR5JztcbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxhc3Q8VCwgRCA9IFQ+KFxuICBwcmVkaWNhdGU/OiBudWxsLFxuICBkZWZhdWx0VmFsdWU/OiBEXG4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFQgfCBEPjtcbmV4cG9ydCBmdW5jdGlvbiBsYXN0PFQsIFMgZXh0ZW5kcyBUPihcbiAgcHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gdmFsdWUgaXMgUyxcbiAgZGVmYXVsdFZhbHVlPzogU1xuKTogT3BlcmF0b3JGdW5jdGlvbjxULCBTPjtcbmV4cG9ydCBmdW5jdGlvbiBsYXN0PFQsIEQgPSBUPihcbiAgcHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gYm9vbGVhbixcbiAgZGVmYXVsdFZhbHVlPzogRFxuKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgRD47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG9ubHkgdGhlIGxhc3QgaXRlbSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEl0IG9wdGlvbmFsbHkgdGFrZXMgYSBwcmVkaWNhdGUgZnVuY3Rpb24gYXMgYSBwYXJhbWV0ZXIsIGluIHdoaWNoIGNhc2UsIHJhdGhlciB0aGFuIGVtaXR0aW5nXG4gKiB0aGUgbGFzdCBpdGVtIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCB0aGUgcmVzdWx0aW5nIE9ic2VydmFibGUgd2lsbCBlbWl0IHRoZSBsYXN0IGl0ZW1cbiAqIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRoYXQgc2F0aXNmaWVzIHRoZSBwcmVkaWNhdGUuXG4gKlxuICogIVtdKGxhc3QucG5nKVxuICpcbiAqIEB0aHJvd3Mge0VtcHR5RXJyb3J9IERlbGl2ZXJzIGFuIEVtcHR5RXJyb3IgdG8gdGhlIE9ic2VydmVyJ3MgYGVycm9yYFxuICogY2FsbGJhY2sgaWYgdGhlIE9ic2VydmFibGUgY29tcGxldGVzIGJlZm9yZSBhbnkgYG5leHRgIG5vdGlmaWNhdGlvbiB3YXMgc2VudC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtwcmVkaWNhdGVdIC0gVGhlIGNvbmRpdGlvbiBhbnkgc291cmNlIGVtaXR0ZWQgaXRlbSBoYXMgdG8gc2F0aXNmeS5cbiAqIEBwYXJhbSB7YW55fSBbZGVmYXVsdFZhbHVlXSAtIEFuIG9wdGlvbmFsIGRlZmF1bHQgdmFsdWUgdG8gcHJvdmlkZSBpZiBsYXN0XG4gKiBwcmVkaWNhdGUgaXNuJ3QgbWV0IG9yIG5vIHZhbHVlcyB3ZXJlIGVtaXR0ZWQuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgb25seSB0aGUgbGFzdCBpdGVtIHNhdGlzZnlpbmcgdGhlIGdpdmVuIGNvbmRpdGlvblxuICogZnJvbSB0aGUgc291cmNlLCBvciBhbiBOb1N1Y2hFbGVtZW50RXhjZXB0aW9uIGlmIG5vIHN1Y2ggaXRlbXMgYXJlIGVtaXR0ZWQuXG4gKiBAdGhyb3dzIC0gVGhyb3dzIGlmIG5vIGl0ZW1zIHRoYXQgbWF0Y2ggdGhlIHByZWRpY2F0ZSBhcmUgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXN0PFQsIEQ+KFxuICBwcmVkaWNhdGU/OiAoKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4pIHwgbnVsbCxcbiAgZGVmYXVsdFZhbHVlPzogRFxuKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgRD4ge1xuICBjb25zdCBoYXNEZWZhdWx0VmFsdWUgPSBhcmd1bWVudHMubGVuZ3RoID49IDI7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UucGlwZShcbiAgICBwcmVkaWNhdGUgPyBmaWx0ZXIoKHYsIGkpID0+IHByZWRpY2F0ZSh2LCBpLCBzb3VyY2UpKSA6IGlkZW50aXR5LFxuICAgIHRha2VMYXN0KDEpLFxuICAgIGhhc0RlZmF1bHRWYWx1ZSA/IGRlZmF1bHRJZkVtcHR5PFQgfCBEPihkZWZhdWx0VmFsdWUpIDogdGhyb3dJZkVtcHR5KCgpID0+IG5ldyBFbXB0eUVycm9yKCkpLFxuICApO1xufVxuIl19