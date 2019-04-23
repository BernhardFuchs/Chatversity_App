"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
var Subscription_1 = require("../Subscription");
var Observable_1 = require("../Observable");
var Subject_1 = require("../Subject");
/* tslint:enable:max-line-length */
/**
 * Groups the items emitted by an Observable according to a specified criterion,
 * and emits these grouped items as `GroupedObservables`, one
 * {@link GroupedObservable} per group.
 *
 * ![](groupBy.png)
 *
 * When the Observable emits an item, a key is computed for this item with the keySelector function.
 *
 * If a {@link GroupedObservable} for this key exists, this {@link GroupedObservable} emits. Elsewhere, a new
 * {@link GroupedObservable} for this key is created and emits.
 *
 * A {@link GroupedObservable} represents values belonging to the same group represented by a common key. The common
 * key is available as the key field of a {@link GroupedObservable} instance.
 *
 * The elements emitted by {@link GroupedObservable}s are by default the items emitted by the Observable, or elements
 * returned by the elementSelector function.
 *
 * ## Examples
 * ### Group objects by id and return as array
 * ```javascript
 * import { mergeMap, groupBy } from 'rxjs/operators';
 * import { of } from 'rxjs/observable/of';
 *
 * interface Obj {
 *    id: number,
 *    name: string,
 * }
 *
 * of<Obj>(
 *   {id: 1, name: 'javascript'},
 *   {id: 2, name: 'parcel'},
 *   {id: 2, name: 'webpack'},
 *   {id: 1, name: 'typescript'},
 *   {id: 3, name: 'tslint'}
 * ).pipe(
 *   groupBy(p => p.id),
 *   mergeMap((group$) => group$.pipe(reduce((acc, cur) => [...acc, cur], []))),
 * )
 * .subscribe(p => console.log(p));
 *
 * // displays:
 * // [ { id: 1, name: 'javascript'},
 * //   { id: 1, name: 'typescript'} ]
 * //
 * // [ { id: 2, name: 'parcel'},
 * //   { id: 2, name: 'webpack'} ]
 * //
 * // [ { id: 3, name: 'tslint'} ]
 * ```
 *
 * ### Pivot data on the id field
 * ```javascript
 * import { mergeMap, groupBy, map } from 'rxjs/operators';
 * import { of } from 'rxjs/observable/of';
 *
 * of<Obj>(
 *   {id: 1, name: 'javascript'},
 *   {id: 2, name: 'parcel'},
 *   {id: 2, name: 'webpack'},
 *   {id: 1, name: 'typescript'}
 *   {id: 3, name: 'tslint'}
 * ).pipe(
 *   groupBy(p => p.id, p => p.name),
 *   mergeMap( (group$) => group$.pipe(reduce((acc, cur) => [...acc, cur], ["" + group$.key]))),
 *   map(arr => ({'id': parseInt(arr[0]), 'values': arr.slice(1)})),
 * )
 * .subscribe(p => console.log(p));
 *
 * // displays:
 * // { id: 1, values: [ 'javascript', 'typescript' ] }
 * // { id: 2, values: [ 'parcel', 'webpack' ] }
 * // { id: 3, values: [ 'tslint' ] }
 * ```
 *
 * @param {function(value: T): K} keySelector A function that extracts the key
 * for each item.
 * @param {function(value: T): R} [elementSelector] A function that extracts the
 * return element for each item.
 * @param {function(grouped: GroupedObservable<K,R>): Observable<any>} [durationSelector]
 * A function that returns an Observable to determine how long each group should
 * exist.
 * @return {Observable<GroupedObservable<K,R>>} An Observable that emits
 * GroupedObservables, each of which corresponds to a unique key value and each
 * of which emits those items from the source Observable that share that key
 * value.
 * @method groupBy
 * @owner Observable
 */
function groupBy(keySelector, elementSelector, durationSelector, subjectSelector) {
    return function (source) {
        return source.lift(new GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector));
    };
}
exports.groupBy = groupBy;
var GroupByOperator = /** @class */ (function () {
    function GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector) {
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
        this.subjectSelector = subjectSelector;
    }
    GroupByOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
    };
    return GroupByOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var GroupBySubscriber = /** @class */ (function (_super) {
    __extends(GroupBySubscriber, _super);
    function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
        var _this = _super.call(this, destination) || this;
        _this.keySelector = keySelector;
        _this.elementSelector = elementSelector;
        _this.durationSelector = durationSelector;
        _this.subjectSelector = subjectSelector;
        _this.groups = null;
        _this.attemptedToUnsubscribe = false;
        _this.count = 0;
        return _this;
    }
    GroupBySubscriber.prototype._next = function (value) {
        var key;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            this.error(err);
            return;
        }
        this._group(value, key);
    };
    GroupBySubscriber.prototype._group = function (value, key) {
        var groups = this.groups;
        if (!groups) {
            groups = this.groups = new Map();
        }
        var group = groups.get(key);
        var element;
        if (this.elementSelector) {
            try {
                element = this.elementSelector(value);
            }
            catch (err) {
                this.error(err);
            }
        }
        else {
            element = value;
        }
        if (!group) {
            group = (this.subjectSelector ? this.subjectSelector() : new Subject_1.Subject());
            groups.set(key, group);
            var groupedObservable = new GroupedObservable(key, group, this);
            this.destination.next(groupedObservable);
            if (this.durationSelector) {
                var duration = void 0;
                try {
                    duration = this.durationSelector(new GroupedObservable(key, group));
                }
                catch (err) {
                    this.error(err);
                    return;
                }
                this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
            }
        }
        if (!group.closed) {
            group.next(element);
        }
    };
    GroupBySubscriber.prototype._error = function (err) {
        var groups = this.groups;
        if (groups) {
            groups.forEach(function (group, key) {
                group.error(err);
            });
            groups.clear();
        }
        this.destination.error(err);
    };
    GroupBySubscriber.prototype._complete = function () {
        var groups = this.groups;
        if (groups) {
            groups.forEach(function (group, key) {
                group.complete();
            });
            groups.clear();
        }
        this.destination.complete();
    };
    GroupBySubscriber.prototype.removeGroup = function (key) {
        this.groups.delete(key);
    };
    GroupBySubscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.attemptedToUnsubscribe = true;
            if (this.count === 0) {
                _super.prototype.unsubscribe.call(this);
            }
        }
    };
    return GroupBySubscriber;
}(Subscriber_1.Subscriber));
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var GroupDurationSubscriber = /** @class */ (function (_super) {
    __extends(GroupDurationSubscriber, _super);
    function GroupDurationSubscriber(key, group, parent) {
        var _this = _super.call(this, group) || this;
        _this.key = key;
        _this.group = group;
        _this.parent = parent;
        return _this;
    }
    GroupDurationSubscriber.prototype._next = function (value) {
        this.complete();
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    GroupDurationSubscriber.prototype._unsubscribe = function () {
        var _a = this, parent = _a.parent, key = _a.key;
        this.key = this.parent = null;
        if (parent) {
            parent.removeGroup(key);
        }
    };
    return GroupDurationSubscriber;
}(Subscriber_1.Subscriber));
/**
 * An Observable representing values belonging to the same group represented by
 * a common key. The values emitted by a GroupedObservable come from the source
 * Observable. The common key is available as the field `key` on a
 * GroupedObservable instance.
 *
 * @class GroupedObservable<K, T>
 */
var GroupedObservable = /** @class */ (function (_super) {
    __extends(GroupedObservable, _super);
    /** @deprecated Do not construct this type. Internal use only */
    function GroupedObservable(key, groupSubject, refCountSubscription) {
        var _this = _super.call(this) || this;
        _this.key = key;
        _this.groupSubject = groupSubject;
        _this.refCountSubscription = refCountSubscription;
        return _this;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    GroupedObservable.prototype._subscribe = function (subscriber) {
        var subscription = new Subscription_1.Subscription();
        var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
        if (refCountSubscription && !refCountSubscription.closed) {
            subscription.add(new InnerRefCountSubscription(refCountSubscription));
        }
        subscription.add(groupSubject.subscribe(subscriber));
        return subscription;
    };
    return GroupedObservable;
}(Observable_1.Observable));
exports.GroupedObservable = GroupedObservable;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var InnerRefCountSubscription = /** @class */ (function (_super) {
    __extends(InnerRefCountSubscription, _super);
    function InnerRefCountSubscription(parent) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        parent.count++;
        return _this;
    }
    InnerRefCountSubscription.prototype.unsubscribe = function () {
        var parent = this.parent;
        if (!parent.closed && !this.closed) {
            _super.prototype.unsubscribe.call(this);
            parent.count -= 1;
            if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                parent.unsubscribe();
            }
        }
    };
    return InnerRefCountSubscription;
}(Subscription_1.Subscription));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXBCeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2dyb3VwQnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFDM0MsZ0RBQStDO0FBQy9DLDRDQUEyQztBQUUzQyxzQ0FBcUM7QUFRckMsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0ZHO0FBQ0gsU0FBZ0IsT0FBTyxDQUFVLFdBQTRCLEVBQzVCLGVBQTBDLEVBQzFDLGdCQUF3RSxFQUN4RSxlQUFrQztJQUNqRSxPQUFPLFVBQUMsTUFBcUI7UUFDM0IsT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFBakcsQ0FBaUcsQ0FBQztBQUN0RyxDQUFDO0FBTkQsMEJBTUM7QUFTRDtJQUNFLHlCQUFvQixXQUE0QixFQUM1QixlQUEwQyxFQUMxQyxnQkFBd0UsRUFDeEUsZUFBa0M7UUFIbEMsZ0JBQVcsR0FBWCxXQUFXLENBQWlCO1FBQzVCLG9CQUFlLEdBQWYsZUFBZSxDQUEyQjtRQUMxQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXdEO1FBQ3hFLG9CQUFlLEdBQWYsZUFBZSxDQUFtQjtJQUN0RCxDQUFDO0lBRUQsOEJBQUksR0FBSixVQUFLLFVBQStDLEVBQUUsTUFBVztRQUMvRCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxpQkFBaUIsQ0FDM0MsVUFB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SUFBSSwyQkFBWSxFQUFFLENBQUM7UUFDbEMsSUFBQSxTQUE2QyxFQUEzQyw4Q0FBb0IsRUFBRSw4QkFBcUIsQ0FBQztRQUNwRCxJQUFJLG9CQUFvQixJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFO1lBQ3hELFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSx5QkFBeUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7U0FDdkU7UUFDRCxZQUFZLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNyRCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBbEJELENBQTZDLHVCQUFVLEdBa0J0RDtBQWxCWSw4Q0FBaUI7QUFvQjlCOzs7O0dBSUc7QUFDSDtJQUF3Qyw2Q0FBWTtJQUNsRCxtQ0FBb0IsTUFBNEI7UUFBaEQsWUFDRSxpQkFBTyxTQUVSO1FBSG1CLFlBQU0sR0FBTixNQUFNLENBQXNCO1FBRTlDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7SUFDakIsQ0FBQztJQUVELCtDQUFXLEdBQVg7UUFDRSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNsQyxpQkFBTSxXQUFXLFdBQUUsQ0FBQztZQUNwQixNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRTtnQkFDdkQsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ3RCO1NBQ0Y7SUFDSCxDQUFDO0lBQ0gsZ0NBQUM7QUFBRCxDQUFDLEFBaEJELENBQXdDLDJCQUFZLEdBZ0JuRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnk8VCwgSz4oa2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSyk6IE9wZXJhdG9yRnVuY3Rpb248VCwgR3JvdXBlZE9ic2VydmFibGU8SywgVD4+O1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnk8VCwgSz4oa2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSywgZWxlbWVudFNlbGVjdG9yOiB2b2lkLCBkdXJhdGlvblNlbGVjdG9yOiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgVD4pID0+IE9ic2VydmFibGU8YW55Pik6IE9wZXJhdG9yRnVuY3Rpb248VCwgR3JvdXBlZE9ic2VydmFibGU8SywgVD4+O1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnk8VCwgSywgUj4oa2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSywgZWxlbWVudFNlbGVjdG9yPzogKHZhbHVlOiBUKSA9PiBSLCBkdXJhdGlvblNlbGVjdG9yPzogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KSA9PiBPYnNlcnZhYmxlPGFueT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+PjtcbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEssIFI+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssIGVsZW1lbnRTZWxlY3Rvcj86ICh2YWx1ZTogVCkgPT4gUiwgZHVyYXRpb25TZWxlY3Rvcj86IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPikgPT4gT2JzZXJ2YWJsZTxhbnk+LCBzdWJqZWN0U2VsZWN0b3I/OiAoKSA9PiBTdWJqZWN0PFI+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIEdyb3VwcyB0aGUgaXRlbXMgZW1pdHRlZCBieSBhbiBPYnNlcnZhYmxlIGFjY29yZGluZyB0byBhIHNwZWNpZmllZCBjcml0ZXJpb24sXG4gKiBhbmQgZW1pdHMgdGhlc2UgZ3JvdXBlZCBpdGVtcyBhcyBgR3JvdXBlZE9ic2VydmFibGVzYCwgb25lXG4gKiB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9IHBlciBncm91cC5cbiAqXG4gKiAhW10oZ3JvdXBCeS5wbmcpXG4gKlxuICogV2hlbiB0aGUgT2JzZXJ2YWJsZSBlbWl0cyBhbiBpdGVtLCBhIGtleSBpcyBjb21wdXRlZCBmb3IgdGhpcyBpdGVtIHdpdGggdGhlIGtleVNlbGVjdG9yIGZ1bmN0aW9uLlxuICpcbiAqIElmIGEge0BsaW5rIEdyb3VwZWRPYnNlcnZhYmxlfSBmb3IgdGhpcyBrZXkgZXhpc3RzLCB0aGlzIHtAbGluayBHcm91cGVkT2JzZXJ2YWJsZX0gZW1pdHMuIEVsc2V3aGVyZSwgYSBuZXdcbiAqIHtAbGluayBHcm91cGVkT2JzZXJ2YWJsZX0gZm9yIHRoaXMga2V5IGlzIGNyZWF0ZWQgYW5kIGVtaXRzLlxuICpcbiAqIEEge0BsaW5rIEdyb3VwZWRPYnNlcnZhYmxlfSByZXByZXNlbnRzIHZhbHVlcyBiZWxvbmdpbmcgdG8gdGhlIHNhbWUgZ3JvdXAgcmVwcmVzZW50ZWQgYnkgYSBjb21tb24ga2V5LiBUaGUgY29tbW9uXG4gKiBrZXkgaXMgYXZhaWxhYmxlIGFzIHRoZSBrZXkgZmllbGQgb2YgYSB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9IGluc3RhbmNlLlxuICpcbiAqIFRoZSBlbGVtZW50cyBlbWl0dGVkIGJ5IHtAbGluayBHcm91cGVkT2JzZXJ2YWJsZX1zIGFyZSBieSBkZWZhdWx0IHRoZSBpdGVtcyBlbWl0dGVkIGJ5IHRoZSBPYnNlcnZhYmxlLCBvciBlbGVtZW50c1xuICogcmV0dXJuZWQgYnkgdGhlIGVsZW1lbnRTZWxlY3RvciBmdW5jdGlvbi5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIEdyb3VwIG9iamVjdHMgYnkgaWQgYW5kIHJldHVybiBhcyBhcnJheVxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgbWVyZ2VNYXAsIGdyb3VwQnkgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKiBpbXBvcnQgeyBvZiB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9vZic7XG4gKlxuICogaW50ZXJmYWNlIE9iaiB7XG4gKiAgICBpZDogbnVtYmVyLFxuICogICAgbmFtZTogc3RyaW5nLFxuICogfVxuICpcbiAqIG9mPE9iaj4oXG4gKiAgIHtpZDogMSwgbmFtZTogJ2phdmFzY3JpcHQnfSxcbiAqICAge2lkOiAyLCBuYW1lOiAncGFyY2VsJ30sXG4gKiAgIHtpZDogMiwgbmFtZTogJ3dlYnBhY2snfSxcbiAqICAge2lkOiAxLCBuYW1lOiAndHlwZXNjcmlwdCd9LFxuICogICB7aWQ6IDMsIG5hbWU6ICd0c2xpbnQnfVxuICogKS5waXBlKFxuICogICBncm91cEJ5KHAgPT4gcC5pZCksXG4gKiAgIG1lcmdlTWFwKChncm91cCQpID0+IGdyb3VwJC5waXBlKHJlZHVjZSgoYWNjLCBjdXIpID0+IFsuLi5hY2MsIGN1cl0sIFtdKSkpLFxuICogKVxuICogLnN1YnNjcmliZShwID0+IGNvbnNvbGUubG9nKHApKTtcbiAqXG4gKiAvLyBkaXNwbGF5czpcbiAqIC8vIFsgeyBpZDogMSwgbmFtZTogJ2phdmFzY3JpcHQnfSxcbiAqIC8vICAgeyBpZDogMSwgbmFtZTogJ3R5cGVzY3JpcHQnfSBdXG4gKiAvL1xuICogLy8gWyB7IGlkOiAyLCBuYW1lOiAncGFyY2VsJ30sXG4gKiAvLyAgIHsgaWQ6IDIsIG5hbWU6ICd3ZWJwYWNrJ30gXVxuICogLy9cbiAqIC8vIFsgeyBpZDogMywgbmFtZTogJ3RzbGludCd9IF1cbiAqIGBgYFxuICpcbiAqICMjIyBQaXZvdCBkYXRhIG9uIHRoZSBpZCBmaWVsZFxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgbWVyZ2VNYXAsIGdyb3VwQnksIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqIGltcG9ydCB7IG9mIH0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL29mJztcbiAqXG4gKiBvZjxPYmo+KFxuICogICB7aWQ6IDEsIG5hbWU6ICdqYXZhc2NyaXB0J30sXG4gKiAgIHtpZDogMiwgbmFtZTogJ3BhcmNlbCd9LFxuICogICB7aWQ6IDIsIG5hbWU6ICd3ZWJwYWNrJ30sXG4gKiAgIHtpZDogMSwgbmFtZTogJ3R5cGVzY3JpcHQnfVxuICogICB7aWQ6IDMsIG5hbWU6ICd0c2xpbnQnfVxuICogKS5waXBlKFxuICogICBncm91cEJ5KHAgPT4gcC5pZCwgcCA9PiBwLm5hbWUpLFxuICogICBtZXJnZU1hcCggKGdyb3VwJCkgPT4gZ3JvdXAkLnBpcGUocmVkdWNlKChhY2MsIGN1cikgPT4gWy4uLmFjYywgY3VyXSwgW1wiXCIgKyBncm91cCQua2V5XSkpKSxcbiAqICAgbWFwKGFyciA9PiAoeydpZCc6IHBhcnNlSW50KGFyclswXSksICd2YWx1ZXMnOiBhcnIuc2xpY2UoMSl9KSksXG4gKiApXG4gKiAuc3Vic2NyaWJlKHAgPT4gY29uc29sZS5sb2cocCkpO1xuICpcbiAqIC8vIGRpc3BsYXlzOlxuICogLy8geyBpZDogMSwgdmFsdWVzOiBbICdqYXZhc2NyaXB0JywgJ3R5cGVzY3JpcHQnIF0gfVxuICogLy8geyBpZDogMiwgdmFsdWVzOiBbICdwYXJjZWwnLCAnd2VicGFjaycgXSB9XG4gKiAvLyB7IGlkOiAzLCB2YWx1ZXM6IFsgJ3RzbGludCcgXSB9XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBUKTogS30ga2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0aGF0IGV4dHJhY3RzIHRoZSBrZXlcbiAqIGZvciBlYWNoIGl0ZW0uXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBUKTogUn0gW2VsZW1lbnRTZWxlY3Rvcl0gQSBmdW5jdGlvbiB0aGF0IGV4dHJhY3RzIHRoZVxuICogcmV0dXJuIGVsZW1lbnQgZm9yIGVhY2ggaXRlbS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SyxSPik6IE9ic2VydmFibGU8YW55Pn0gW2R1cmF0aW9uU2VsZWN0b3JdXG4gKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRvIGRldGVybWluZSBob3cgbG9uZyBlYWNoIGdyb3VwIHNob3VsZFxuICogZXhpc3QuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPEdyb3VwZWRPYnNlcnZhYmxlPEssUj4+fSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHNcbiAqIEdyb3VwZWRPYnNlcnZhYmxlcywgZWFjaCBvZiB3aGljaCBjb3JyZXNwb25kcyB0byBhIHVuaXF1ZSBrZXkgdmFsdWUgYW5kIGVhY2hcbiAqIG9mIHdoaWNoIGVtaXRzIHRob3NlIGl0ZW1zIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRoYXQgc2hhcmUgdGhhdCBrZXlcbiAqIHZhbHVlLlxuICogQG1ldGhvZCBncm91cEJ5XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBCeTxULCBLLCBSPihrZXlTZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBLLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFNlbGVjdG9yPzogKCh2YWx1ZTogVCkgPT4gUikgfCB2b2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25TZWxlY3Rvcj86IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPikgPT4gT2JzZXJ2YWJsZTxhbnk+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViamVjdFNlbGVjdG9yPzogKCkgPT4gU3ViamVjdDxSPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgR3JvdXBlZE9ic2VydmFibGU8SywgUj4+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+XG4gICAgc291cmNlLmxpZnQobmV3IEdyb3VwQnlPcGVyYXRvcihrZXlTZWxlY3RvciwgZWxlbWVudFNlbGVjdG9yLCBkdXJhdGlvblNlbGVjdG9yLCBzdWJqZWN0U2VsZWN0b3IpKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWZDb3VudFN1YnNjcmlwdGlvbiB7XG4gIGNvdW50OiBudW1iZXI7XG4gIHVuc3Vic2NyaWJlOiAoKSA9PiB2b2lkO1xuICBjbG9zZWQ6IGJvb2xlYW47XG4gIGF0dGVtcHRlZFRvVW5zdWJzY3JpYmU6IGJvb2xlYW47XG59XG5cbmNsYXNzIEdyb3VwQnlPcGVyYXRvcjxULCBLLCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+PiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUga2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBlbGVtZW50U2VsZWN0b3I/OiAoKHZhbHVlOiBUKSA9PiBSKSB8IHZvaWQsXG4gICAgICAgICAgICAgIHByaXZhdGUgZHVyYXRpb25TZWxlY3Rvcj86IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPikgPT4gT2JzZXJ2YWJsZTxhbnk+LFxuICAgICAgICAgICAgICBwcml2YXRlIHN1YmplY3RTZWxlY3Rvcj86ICgpID0+IFN1YmplY3Q8Uj4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgR3JvdXBCeVN1YnNjcmliZXIoXG4gICAgICBzdWJzY3JpYmVyLCB0aGlzLmtleVNlbGVjdG9yLCB0aGlzLmVsZW1lbnRTZWxlY3RvciwgdGhpcy5kdXJhdGlvblNlbGVjdG9yLCB0aGlzLnN1YmplY3RTZWxlY3RvclxuICAgICkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBHcm91cEJ5U3Vic2NyaWJlcjxULCBLLCBSPiBleHRlbmRzIFN1YnNjcmliZXI8VD4gaW1wbGVtZW50cyBSZWZDb3VudFN1YnNjcmlwdGlvbiB7XG4gIHByaXZhdGUgZ3JvdXBzOiBNYXA8SywgU3ViamVjdDxUIHwgUj4+ID0gbnVsbDtcbiAgcHVibGljIGF0dGVtcHRlZFRvVW5zdWJzY3JpYmU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGNvdW50OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBrZXlTZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBLLFxuICAgICAgICAgICAgICBwcml2YXRlIGVsZW1lbnRTZWxlY3Rvcj86ICgodmFsdWU6IFQpID0+IFIpIHwgdm9pZCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBkdXJhdGlvblNlbGVjdG9yPzogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KSA9PiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc3ViamVjdFNlbGVjdG9yPzogKCkgPT4gU3ViamVjdDxSPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGxldCBrZXk6IEs7XG4gICAgdHJ5IHtcbiAgICAgIGtleSA9IHRoaXMua2V5U2VsZWN0b3IodmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2dyb3VwKHZhbHVlLCBrZXkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ3JvdXAodmFsdWU6IFQsIGtleTogSykge1xuICAgIGxldCBncm91cHMgPSB0aGlzLmdyb3VwcztcblxuICAgIGlmICghZ3JvdXBzKSB7XG4gICAgICBncm91cHMgPSB0aGlzLmdyb3VwcyA9IG5ldyBNYXA8SywgU3ViamVjdDxUIHwgUj4+KCk7XG4gICAgfVxuXG4gICAgbGV0IGdyb3VwID0gZ3JvdXBzLmdldChrZXkpO1xuXG4gICAgbGV0IGVsZW1lbnQ6IFI7XG4gICAgaWYgKHRoaXMuZWxlbWVudFNlbGVjdG9yKSB7XG4gICAgICB0cnkge1xuICAgICAgICBlbGVtZW50ID0gdGhpcy5lbGVtZW50U2VsZWN0b3IodmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudCA9IDxhbnk+dmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKCFncm91cCkge1xuICAgICAgZ3JvdXAgPSAodGhpcy5zdWJqZWN0U2VsZWN0b3IgPyB0aGlzLnN1YmplY3RTZWxlY3RvcigpIDogbmV3IFN1YmplY3Q8Uj4oKSkgYXMgU3ViamVjdDxUIHwgUj47XG4gICAgICBncm91cHMuc2V0KGtleSwgZ3JvdXApO1xuICAgICAgY29uc3QgZ3JvdXBlZE9ic2VydmFibGUgPSBuZXcgR3JvdXBlZE9ic2VydmFibGUoa2V5LCBncm91cCwgdGhpcyk7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoZ3JvdXBlZE9ic2VydmFibGUpO1xuICAgICAgaWYgKHRoaXMuZHVyYXRpb25TZWxlY3Rvcikge1xuICAgICAgICBsZXQgZHVyYXRpb246IGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBkdXJhdGlvbiA9IHRoaXMuZHVyYXRpb25TZWxlY3RvcihuZXcgR3JvdXBlZE9ic2VydmFibGU8SywgUj4oa2V5LCA8U3ViamVjdDxSPj5ncm91cCkpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICB0aGlzLmVycm9yKGVycik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkKGR1cmF0aW9uLnN1YnNjcmliZShuZXcgR3JvdXBEdXJhdGlvblN1YnNjcmliZXIoa2V5LCBncm91cCwgdGhpcykpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWdyb3VwLmNsb3NlZCkge1xuICAgICAgZ3JvdXAubmV4dChlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgY29uc3QgZ3JvdXBzID0gdGhpcy5ncm91cHM7XG4gICAgaWYgKGdyb3Vwcykge1xuICAgICAgZ3JvdXBzLmZvckVhY2goKGdyb3VwLCBrZXkpID0+IHtcbiAgICAgICAgZ3JvdXAuZXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuXG4gICAgICBncm91cHMuY2xlYXIoKTtcbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBncm91cHMgPSB0aGlzLmdyb3VwcztcbiAgICBpZiAoZ3JvdXBzKSB7XG4gICAgICBncm91cHMuZm9yRWFjaCgoZ3JvdXAsIGtleSkgPT4ge1xuICAgICAgICBncm91cC5jb21wbGV0ZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIGdyb3Vwcy5jbGVhcigpO1xuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cblxuICByZW1vdmVHcm91cChrZXk6IEspOiB2b2lkIHtcbiAgICB0aGlzLmdyb3Vwcy5kZWxldGUoa2V5KTtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKCkge1xuICAgIGlmICghdGhpcy5jbG9zZWQpIHtcbiAgICAgIHRoaXMuYXR0ZW1wdGVkVG9VbnN1YnNjcmliZSA9IHRydWU7XG4gICAgICBpZiAodGhpcy5jb3VudCA9PT0gMCkge1xuICAgICAgICBzdXBlci51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgR3JvdXBEdXJhdGlvblN1YnNjcmliZXI8SywgVD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBrZXk6IEssXG4gICAgICAgICAgICAgIHByaXZhdGUgZ3JvdXA6IFN1YmplY3Q8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcGFyZW50OiBHcm91cEJ5U3Vic2NyaWJlcjxhbnksIEssIFQgfCBhbnk+KSB7XG4gICAgc3VwZXIoZ3JvdXApO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmUoKSB7XG4gICAgY29uc3QgeyBwYXJlbnQsIGtleSB9ID0gdGhpcztcbiAgICB0aGlzLmtleSA9IHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBwYXJlbnQucmVtb3ZlR3JvdXAoa2V5KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBbiBPYnNlcnZhYmxlIHJlcHJlc2VudGluZyB2YWx1ZXMgYmVsb25naW5nIHRvIHRoZSBzYW1lIGdyb3VwIHJlcHJlc2VudGVkIGJ5XG4gKiBhIGNvbW1vbiBrZXkuIFRoZSB2YWx1ZXMgZW1pdHRlZCBieSBhIEdyb3VwZWRPYnNlcnZhYmxlIGNvbWUgZnJvbSB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlLiBUaGUgY29tbW9uIGtleSBpcyBhdmFpbGFibGUgYXMgdGhlIGZpZWxkIGBrZXlgIG9uIGFcbiAqIEdyb3VwZWRPYnNlcnZhYmxlIGluc3RhbmNlLlxuICpcbiAqIEBjbGFzcyBHcm91cGVkT2JzZXJ2YWJsZTxLLCBUPlxuICovXG5leHBvcnQgY2xhc3MgR3JvdXBlZE9ic2VydmFibGU8SywgVD4gZXh0ZW5kcyBPYnNlcnZhYmxlPFQ+IHtcbiAgLyoqIEBkZXByZWNhdGVkIERvIG5vdCBjb25zdHJ1Y3QgdGhpcyB0eXBlLiBJbnRlcm5hbCB1c2Ugb25seSAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMga2V5OiBLLFxuICAgICAgICAgICAgICBwcml2YXRlIGdyb3VwU3ViamVjdDogU3ViamVjdDxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSByZWZDb3VudFN1YnNjcmlwdGlvbj86IFJlZkNvdW50U3Vic2NyaXB0aW9uKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgIGNvbnN0IHsgcmVmQ291bnRTdWJzY3JpcHRpb24sIGdyb3VwU3ViamVjdCB9ID0gdGhpcztcbiAgICBpZiAocmVmQ291bnRTdWJzY3JpcHRpb24gJiYgIXJlZkNvdW50U3Vic2NyaXB0aW9uLmNsb3NlZCkge1xuICAgICAgc3Vic2NyaXB0aW9uLmFkZChuZXcgSW5uZXJSZWZDb3VudFN1YnNjcmlwdGlvbihyZWZDb3VudFN1YnNjcmlwdGlvbikpO1xuICAgIH1cbiAgICBzdWJzY3JpcHRpb24uYWRkKGdyb3VwU3ViamVjdC5zdWJzY3JpYmUoc3Vic2NyaWJlcikpO1xuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIElubmVyUmVmQ291bnRTdWJzY3JpcHRpb24gZXh0ZW5kcyBTdWJzY3JpcHRpb24ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhcmVudDogUmVmQ291bnRTdWJzY3JpcHRpb24pIHtcbiAgICBzdXBlcigpO1xuICAgIHBhcmVudC5jb3VudCsrO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoKSB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgaWYgKCFwYXJlbnQuY2xvc2VkICYmICF0aGlzLmNsb3NlZCkge1xuICAgICAgc3VwZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgIHBhcmVudC5jb3VudCAtPSAxO1xuICAgICAgaWYgKHBhcmVudC5jb3VudCA9PT0gMCAmJiBwYXJlbnQuYXR0ZW1wdGVkVG9VbnN1YnNjcmliZSkge1xuICAgICAgICBwYXJlbnQudW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==