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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9yYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMkNBQTBDO0FBRTFDLDJDQUF3RDtBQVd4RCxtQ0FBbUM7QUFFbkM7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFnQixJQUFJO0lBQUkscUJBQTJEO1NBQTNELFVBQTJELEVBQTNELHFCQUEyRCxFQUEzRCxJQUEyRDtRQUEzRCxnQ0FBMkQ7O0lBQ2pGLE9BQU8sU0FBUyxvQkFBb0IsQ0FBQyxNQUFxQjtRQUN4RCxtRUFBbUU7UUFDbkUsNEJBQTRCO1FBQzVCLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksaUJBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN2RCxXQUFXLEdBQXlCLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwRDtRQUVELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVSxnQkFBSSxNQUFNLFNBQUssV0FBVyxHQUFFLENBQUM7SUFDakUsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQVZELG9CQVVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyByYWNlIGFzIHJhY2VTdGF0aWMgfSBmcm9tICcuLi9vYnNlcnZhYmxlL3JhY2UnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8qKiBAZGVwcmVjYXRlZCBEZXByZWNhdGVkIGluIGZhdm9yIG9mIHN0YXRpYyByYWNlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4ob2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGU8VD4+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuLyoqIEBkZXByZWNhdGVkIERlcHJlY2F0ZWQgaW4gZmF2b3Igb2Ygc3RhdGljIHJhY2UuICovXG5leHBvcnQgZnVuY3Rpb24gcmFjZTxULCBSPihvYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZTxUPj4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuLyoqIEBkZXByZWNhdGVkIERlcHJlY2F0ZWQgaW4gZmF2b3Igb2Ygc3RhdGljIHJhY2UuICovXG5leHBvcnQgZnVuY3Rpb24gcmFjZTxUPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZTxUPiB8IEFycmF5PE9ic2VydmFibGU8VD4+Pik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbi8qKiBAZGVwcmVjYXRlZCBEZXByZWNhdGVkIGluIGZhdm9yIG9mIHN0YXRpYyByYWNlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGU8YW55PiB8IEFycmF5PE9ic2VydmFibGU8YW55Pj4+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgbWlycm9ycyB0aGUgZmlyc3Qgc291cmNlIE9ic2VydmFibGUgdG8gZW1pdCBhbiBpdGVtXG4gKiBmcm9tIHRoZSBjb21iaW5hdGlvbiBvZiB0aGlzIE9ic2VydmFibGUgYW5kIHN1cHBsaWVkIE9ic2VydmFibGVzLlxuICogQHBhcmFtIHsuLi5PYnNlcnZhYmxlc30gLi4ub2JzZXJ2YWJsZXMgU291cmNlcyB1c2VkIHRvIHJhY2UgZm9yIHdoaWNoIE9ic2VydmFibGUgZW1pdHMgZmlyc3QuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgbWlycm9ycyB0aGUgb3V0cHV0IG9mIHRoZSBmaXJzdCBPYnNlcnZhYmxlIHRvIGVtaXQgYW4gaXRlbS5cbiAqIEBtZXRob2QgcmFjZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqIEBkZXByZWNhdGVkIERlcHJlY2F0ZWQgaW4gZmF2b3Igb2Ygc3RhdGljIHtAbGluayByYWNlfS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGU8VD4gfCBBcnJheTxPYnNlcnZhYmxlPFQ+Pj4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gZnVuY3Rpb24gcmFjZU9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgLy8gaWYgdGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gYXJyYXksIGl0IHdhcyBtb3N0IGxpa2VseSBjYWxsZWQgd2l0aFxuICAgIC8vIGBwYWlyKFtvYnMxLCBvYnMyLCAuLi5dKWBcbiAgICBpZiAob2JzZXJ2YWJsZXMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkob2JzZXJ2YWJsZXNbMF0pKSB7XG4gICAgICBvYnNlcnZhYmxlcyA9IDxBcnJheTxPYnNlcnZhYmxlPFQ+Pj5vYnNlcnZhYmxlc1swXTtcbiAgICB9XG5cbiAgICByZXR1cm4gc291cmNlLmxpZnQuY2FsbChyYWNlU3RhdGljPFQ+KHNvdXJjZSwgLi4ub2JzZXJ2YWJsZXMpKTtcbiAgfTtcbn1cbiJdfQ==