"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isArray_1 = require("../util/isArray");
var race_1 = require("../observable/race");
/* tslint:enable:max-line-length */
/**
 * Returns an Observable that mirrors the first source Observable to emit an item
 * from the combination of this Observable and supplied Observables.
 * @param {...Observables} ...observables Sources used to race for which Observable emits first.
 * @return {Observable} An Observable that mirrors the output of the first Observable to emit an item.
 * @method race
 * @owner Observable
 * @deprecated Deprecated in favor of static {@link race}.
 */
function race() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    return function raceOperatorFunction(source) {
        // if the only argument is an array, it was most likely called with
        // `pair([obs1, obs2, ...])`
        if (observables.length === 1 && isArray_1.isArray(observables[0])) {
            observables = observables[0];
        }
        return source.lift.call(race_1.race.apply(void 0, [source].concat(observables)));
    };
}
exports.race = race;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3JhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyQ0FBMEM7QUFFMUMsMkNBQXdEO0FBV3hELG1DQUFtQztBQUVuQzs7Ozs7Ozs7R0FRRztBQUNILFNBQWdCLElBQUk7SUFBSSxxQkFBMkQ7U0FBM0QsVUFBMkQsRUFBM0QscUJBQTJELEVBQTNELElBQTJEO1FBQTNELGdDQUEyRDs7SUFDakYsT0FBTyxTQUFTLG9CQUFvQixDQUFDLE1BQXFCO1FBQ3hELG1FQUFtRTtRQUNuRSw0QkFBNEI7UUFDNUIsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxpQkFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3ZELFdBQVcsR0FBeUIsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFVLGdCQUFJLE1BQU0sU0FBSyxXQUFXLEdBQUUsQ0FBQztJQUNqRSxDQUFDLENBQUM7QUFDSixDQUFDO0FBVkQsb0JBVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHJhY2UgYXMgcmFjZVN0YXRpYyB9IGZyb20gJy4uL29ic2VydmFibGUvcmFjZSc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuLyoqIEBkZXByZWNhdGVkIERlcHJlY2F0ZWQgaW4gZmF2b3Igb2Ygc3RhdGljIHJhY2UuICovXG5leHBvcnQgZnVuY3Rpb24gcmFjZTxUPihvYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZTxUPj4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG4vKiogQGRlcHJlY2F0ZWQgRGVwcmVjYXRlZCBpbiBmYXZvciBvZiBzdGF0aWMgcmFjZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYWNlPFQsIFI+KG9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlPFQ+Pik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG4vKiogQGRlcHJlY2F0ZWQgRGVwcmVjYXRlZCBpbiBmYXZvciBvZiBzdGF0aWMgcmFjZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYWNlPFQ+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlPFQ+IHwgQXJyYXk8T2JzZXJ2YWJsZTxUPj4+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuLyoqIEBkZXByZWNhdGVkIERlcHJlY2F0ZWQgaW4gZmF2b3Igb2Ygc3RhdGljIHJhY2UuICovXG5leHBvcnQgZnVuY3Rpb24gcmFjZTxULCBSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZTxhbnk+IHwgQXJyYXk8T2JzZXJ2YWJsZTxhbnk+Pj4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBtaXJyb3JzIHRoZSBmaXJzdCBzb3VyY2UgT2JzZXJ2YWJsZSB0byBlbWl0IGFuIGl0ZW1cbiAqIGZyb20gdGhlIGNvbWJpbmF0aW9uIG9mIHRoaXMgT2JzZXJ2YWJsZSBhbmQgc3VwcGxpZWQgT2JzZXJ2YWJsZXMuXG4gKiBAcGFyYW0gey4uLk9ic2VydmFibGVzfSAuLi5vYnNlcnZhYmxlcyBTb3VyY2VzIHVzZWQgdG8gcmFjZSBmb3Igd2hpY2ggT2JzZXJ2YWJsZSBlbWl0cyBmaXJzdC5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBtaXJyb3JzIHRoZSBvdXRwdXQgb2YgdGhlIGZpcnN0IE9ic2VydmFibGUgdG8gZW1pdCBhbiBpdGVtLlxuICogQG1ldGhvZCByYWNlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICogQGRlcHJlY2F0ZWQgRGVwcmVjYXRlZCBpbiBmYXZvciBvZiBzdGF0aWMge0BsaW5rIHJhY2V9LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFjZTxUPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZTxUPiB8IEFycmF5PE9ic2VydmFibGU8VD4+Pik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiBmdW5jdGlvbiByYWNlT3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgICAvLyBpZiB0aGUgb25seSBhcmd1bWVudCBpcyBhbiBhcnJheSwgaXQgd2FzIG1vc3QgbGlrZWx5IGNhbGxlZCB3aXRoXG4gICAgLy8gYHBhaXIoW29iczEsIG9iczIsIC4uLl0pYFxuICAgIGlmIChvYnNlcnZhYmxlcy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShvYnNlcnZhYmxlc1swXSkpIHtcbiAgICAgIG9ic2VydmFibGVzID0gPEFycmF5PE9ic2VydmFibGU8VD4+Pm9ic2VydmFibGVzWzBdO1xuICAgIH1cblxuICAgIHJldHVybiBzb3VyY2UubGlmdC5jYWxsKHJhY2VTdGF0aWM8VD4oc291cmNlLCAuLi5vYnNlcnZhYmxlcykpO1xuICB9O1xufVxuIl19