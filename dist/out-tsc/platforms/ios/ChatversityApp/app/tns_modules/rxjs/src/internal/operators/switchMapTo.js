"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var switchMap_1 = require("./switchMap");
/* tslint:enable:max-line-length */
/**
 * Projects each source value to the same Observable which is flattened multiple
 * times with {@link switchMap} in the output Observable.
 *
 * <span class="informal">It's like {@link switchMap}, but maps each value
 * always to the same inner Observable.</span>
 *
 * ![](switchMapTo.png)
 *
 * Maps each source value to the given Observable `innerObservable` regardless
 * of the source value, and then flattens those resulting Observables into one
 * single Observable, which is the output Observable. The output Observables
 * emits values only from the most recently emitted instance of
 * `innerObservable`.
 *
 * ## Example
 * Rerun an interval Observable on every click event
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(switchMapTo(interval(1000)));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link concatMapTo}
 * @see {@link switchAll}
 * @see {@link switchMap}
 * @see {@link mergeMapTo}
 *
 * @param {ObservableInput} innerObservable An Observable to replace each value from
 * the source Observable.
 * @return {Observable} An Observable that emits items from the given
 * `innerObservable` (and optionally transformed through the deprecated `resultSelector`)
 * every time a value is emitted on the source Observable, and taking only the values
 * from the most recently projected inner Observable.
 * @method switchMapTo
 * @owner Observable
 */
function switchMapTo(innerObservable, resultSelector) {
    return resultSelector ? switchMap_1.switchMap(function () { return innerObservable; }, resultSelector) : switchMap_1.switchMap(function () { return innerObservable; });
}
exports.switchMapTo = switchMapTo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpdGNoTWFwVG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvc3dpdGNoTWFwVG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSx5Q0FBd0M7QUFReEMsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQ0c7QUFDSCxTQUFnQixXQUFXLENBQ3pCLGVBQW1DLEVBQ25DLGNBQTRGO0lBRTVGLE9BQU8sY0FBYyxDQUFDLENBQUMsQ0FBQyxxQkFBUyxDQUFDLGNBQU0sT0FBQSxlQUFlLEVBQWYsQ0FBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBUyxDQUFDLGNBQU0sT0FBQSxlQUFlLEVBQWYsQ0FBZSxDQUFDLENBQUM7QUFDOUcsQ0FBQztBQUxELGtDQUtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgc3dpdGNoTWFwIH0gZnJvbSAnLi9zd2l0Y2hNYXAnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hNYXBUbzxSPihvYnNlcnZhYmxlOiBPYnNlcnZhYmxlSW5wdXQ8Uj4pOiBPcGVyYXRvckZ1bmN0aW9uPGFueSwgUj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZC4gU3dpdGNoIHRvIHVzaW5nIHN3aXRjaE1hcCB3aXRoIGFuIGlubmVyIG1hcCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaE1hcFRvPFQsIFI+KG9ic2VydmFibGU6IE9ic2VydmFibGVJbnB1dDxSPiwgcmVzdWx0U2VsZWN0b3I6IHVuZGVmaW5lZCk6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZC4gU3dpdGNoIHRvIHVzaW5nIHN3aXRjaE1hcCB3aXRoIGFuIGlubmVyIG1hcCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaE1hcFRvPFQsIEksIFI+KG9ic2VydmFibGU6IE9ic2VydmFibGVJbnB1dDxJPiwgcmVzdWx0U2VsZWN0b3I6IChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBJLCBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcikgPT4gUik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIFByb2plY3RzIGVhY2ggc291cmNlIHZhbHVlIHRvIHRoZSBzYW1lIE9ic2VydmFibGUgd2hpY2ggaXMgZmxhdHRlbmVkIG11bHRpcGxlXG4gKiB0aW1lcyB3aXRoIHtAbGluayBzd2l0Y2hNYXB9IGluIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBsaWtlIHtAbGluayBzd2l0Y2hNYXB9LCBidXQgbWFwcyBlYWNoIHZhbHVlXG4gKiBhbHdheXMgdG8gdGhlIHNhbWUgaW5uZXIgT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogIVtdKHN3aXRjaE1hcFRvLnBuZylcbiAqXG4gKiBNYXBzIGVhY2ggc291cmNlIHZhbHVlIHRvIHRoZSBnaXZlbiBPYnNlcnZhYmxlIGBpbm5lck9ic2VydmFibGVgIHJlZ2FyZGxlc3NcbiAqIG9mIHRoZSBzb3VyY2UgdmFsdWUsIGFuZCB0aGVuIGZsYXR0ZW5zIHRob3NlIHJlc3VsdGluZyBPYnNlcnZhYmxlcyBpbnRvIG9uZVxuICogc2luZ2xlIE9ic2VydmFibGUsIHdoaWNoIGlzIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS4gVGhlIG91dHB1dCBPYnNlcnZhYmxlc1xuICogZW1pdHMgdmFsdWVzIG9ubHkgZnJvbSB0aGUgbW9zdCByZWNlbnRseSBlbWl0dGVkIGluc3RhbmNlIG9mXG4gKiBgaW5uZXJPYnNlcnZhYmxlYC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBSZXJ1biBhbiBpbnRlcnZhbCBPYnNlcnZhYmxlIG9uIGV2ZXJ5IGNsaWNrIGV2ZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoc3dpdGNoTWFwVG8oaW50ZXJ2YWwoMTAwMCkpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBjb25jYXRNYXBUb31cbiAqIEBzZWUge0BsaW5rIHN3aXRjaEFsbH1cbiAqIEBzZWUge0BsaW5rIHN3aXRjaE1hcH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlTWFwVG99XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlSW5wdXR9IGlubmVyT2JzZXJ2YWJsZSBBbiBPYnNlcnZhYmxlIHRvIHJlcGxhY2UgZWFjaCB2YWx1ZSBmcm9tXG4gKiB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgaXRlbXMgZnJvbSB0aGUgZ2l2ZW5cbiAqIGBpbm5lck9ic2VydmFibGVgIChhbmQgb3B0aW9uYWxseSB0cmFuc2Zvcm1lZCB0aHJvdWdoIHRoZSBkZXByZWNhdGVkIGByZXN1bHRTZWxlY3RvcmApXG4gKiBldmVyeSB0aW1lIGEgdmFsdWUgaXMgZW1pdHRlZCBvbiB0aGUgc291cmNlIE9ic2VydmFibGUsIGFuZCB0YWtpbmcgb25seSB0aGUgdmFsdWVzXG4gKiBmcm9tIHRoZSBtb3N0IHJlY2VudGx5IHByb2plY3RlZCBpbm5lciBPYnNlcnZhYmxlLlxuICogQG1ldGhvZCBzd2l0Y2hNYXBUb1xuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaE1hcFRvPFQsIEksIFI+KFxuICBpbm5lck9ic2VydmFibGU6IE9ic2VydmFibGVJbnB1dDxJPixcbiAgcmVzdWx0U2VsZWN0b3I/OiAob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogSSwgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIpID0+IFJcbik6IE9wZXJhdG9yRnVuY3Rpb248VCwgSXxSPiB7XG4gIHJldHVybiByZXN1bHRTZWxlY3RvciA/IHN3aXRjaE1hcCgoKSA9PiBpbm5lck9ic2VydmFibGUsIHJlc3VsdFNlbGVjdG9yKSA6IHN3aXRjaE1hcCgoKSA9PiBpbm5lck9ic2VydmFibGUpO1xufVxuIl19