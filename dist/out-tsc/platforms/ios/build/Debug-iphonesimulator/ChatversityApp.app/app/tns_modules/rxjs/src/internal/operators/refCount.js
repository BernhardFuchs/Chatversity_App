"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
function refCount() {
    return function refCountOperatorFunction(source) {
        return source.lift(new RefCountOperator(source));
    };
}
exports.refCount = refCount;
var RefCountOperator = /** @class */ (function () {
    function RefCountOperator(connectable) {
        this.connectable = connectable;
    }
    RefCountOperator.prototype.call = function (subscriber, source) {
        var connectable = this.connectable;
        connectable._refCount++;
        var refCounter = new RefCountSubscriber(subscriber, connectable);
        var subscription = source.subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    };
    return RefCountOperator;
}());
var RefCountSubscriber = /** @class */ (function (_super) {
    __extends(RefCountSubscriber, _super);
    function RefCountSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
    }
    RefCountSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        var refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        ///
        // Compare the local RefCountSubscriber's connection Subscription to the
        // connection Subscription on the shared ConnectableObservable. In cases
        // where the ConnectableObservable source synchronously emits values, and
        // the RefCountSubscriber's downstream Observers synchronously unsubscribe,
        // execution continues to here before the RefCountOperator has a chance to
        // supply the RefCountSubscriber with the shared connection Subscription.
        // For example:
        // ```
        // range(0, 10).pipe(
        //   publish(),
        //   refCount(),
        //   take(5),
        // )
        // .subscribe();
        // ```
        // In order to account for this case, RefCountSubscriber should only dispose
        // the ConnectableObservable's shared connection Subscription if the
        // connection Subscription exists, *and* either:
        //   a. RefCountSubscriber doesn't have a reference to the shared connection
        //      Subscription yet, or,
        //   b. RefCountSubscriber's connection Subscription reference is identical
        //      to the shared connection Subscription
        ///
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    };
    return RefCountSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmQ291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9yZWZDb3VudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDRDQUEyQztBQU0zQyxTQUFnQixRQUFRO0lBQ3RCLE9BQU8sU0FBUyx3QkFBd0IsQ0FBQyxNQUFnQztRQUN2RSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ25ELENBQWdDLENBQUM7QUFDbkMsQ0FBQztBQUpELDRCQUlDO0FBRUQ7SUFDRSwwQkFBb0IsV0FBcUM7UUFBckMsZ0JBQVcsR0FBWCxXQUFXLENBQTBCO0lBQ3pELENBQUM7SUFDRCwrQkFBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBRWpDLElBQUEsOEJBQVcsQ0FBVTtRQUN0QixXQUFZLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFaEMsSUFBTSxVQUFVLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbkUsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVsRCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNmLFVBQVcsQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3ZEO1FBRUQsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQWpCRCxJQWlCQztBQUVEO0lBQW9DLHNDQUFhO0lBSS9DLDRCQUFZLFdBQTBCLEVBQ2xCLFdBQXFDO1FBRHpELFlBRUUsa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBRm1CLGlCQUFXLEdBQVgsV0FBVyxDQUEwQjs7SUFFekQsQ0FBQztJQUVTLHlDQUFZLEdBQXRCO1FBRVUsSUFBQSw4QkFBVyxDQUFVO1FBQzdCLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBTSxRQUFRLEdBQVUsV0FBWSxDQUFDLFNBQVMsQ0FBQztRQUMvQyxJQUFJLFFBQVEsSUFBSSxDQUFDLEVBQUU7WUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsT0FBTztTQUNSO1FBRU0sV0FBWSxDQUFDLFNBQVMsR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRTtZQUNoQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixPQUFPO1NBQ1I7UUFFRCxHQUFHO1FBQ0gsd0VBQXdFO1FBQ3hFLHdFQUF3RTtRQUN4RSx5RUFBeUU7UUFDekUsMkVBQTJFO1FBQzNFLDBFQUEwRTtRQUMxRSx5RUFBeUU7UUFDekUsZUFBZTtRQUNmLE1BQU07UUFDTixxQkFBcUI7UUFDckIsZUFBZTtRQUNmLGdCQUFnQjtRQUNoQixhQUFhO1FBQ2IsSUFBSTtRQUNKLGdCQUFnQjtRQUNoQixNQUFNO1FBQ04sNEVBQTRFO1FBQzVFLG9FQUFvRTtRQUNwRSxnREFBZ0Q7UUFDaEQsNEVBQTRFO1FBQzVFLDZCQUE2QjtRQUM3QiwyRUFBMkU7UUFDM0UsNkNBQTZDO1FBQzdDLEdBQUc7UUFDSyxJQUFBLDRCQUFVLENBQVU7UUFDNUIsSUFBTSxnQkFBZ0IsR0FBVSxXQUFZLENBQUMsV0FBVyxDQUFDO1FBQ3pELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBRXZCLElBQUksZ0JBQWdCLElBQUksQ0FBQyxDQUFDLFVBQVUsSUFBSSxnQkFBZ0IsS0FBSyxVQUFVLENBQUMsRUFBRTtZQUN4RSxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNoQztJQUNILENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUE5REQsQ0FBb0MsdUJBQVUsR0E4RDdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgQ29ubmVjdGFibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9Db25uZWN0YWJsZU9ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVmQ291bnQ8VD4oKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHJlZkNvdW50T3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPik6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgUmVmQ291bnRPcGVyYXRvcihzb3VyY2UpKTtcbiAgfSBhcyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG59XG5cbmNsYXNzIFJlZkNvdW50T3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29ubmVjdGFibGU6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPikge1xuICB9XG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcblxuICAgIGNvbnN0IHsgY29ubmVjdGFibGUgfSA9IHRoaXM7XG4gICAgKDxhbnk+IGNvbm5lY3RhYmxlKS5fcmVmQ291bnQrKztcblxuICAgIGNvbnN0IHJlZkNvdW50ZXIgPSBuZXcgUmVmQ291bnRTdWJzY3JpYmVyKHN1YnNjcmliZXIsIGNvbm5lY3RhYmxlKTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBzb3VyY2Uuc3Vic2NyaWJlKHJlZkNvdW50ZXIpO1xuXG4gICAgaWYgKCFyZWZDb3VudGVyLmNsb3NlZCkge1xuICAgICAgKDxhbnk+IHJlZkNvdW50ZXIpLmNvbm5lY3Rpb24gPSBjb25uZWN0YWJsZS5jb25uZWN0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxufVxuXG5jbGFzcyBSZWZDb3VudFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcblxuICBwcml2YXRlIGNvbm5lY3Rpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb25uZWN0YWJsZTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF91bnN1YnNjcmliZSgpIHtcblxuICAgIGNvbnN0IHsgY29ubmVjdGFibGUgfSA9IHRoaXM7XG4gICAgaWYgKCFjb25uZWN0YWJsZSkge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbm5lY3RhYmxlID0gbnVsbDtcbiAgICBjb25zdCByZWZDb3VudCA9ICg8YW55PiBjb25uZWN0YWJsZSkuX3JlZkNvdW50O1xuICAgIGlmIChyZWZDb3VudCA8PSAwKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgICg8YW55PiBjb25uZWN0YWJsZSkuX3JlZkNvdW50ID0gcmVmQ291bnQgLSAxO1xuICAgIGlmIChyZWZDb3VudCA+IDEpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8vXG4gICAgLy8gQ29tcGFyZSB0aGUgbG9jYWwgUmVmQ291bnRTdWJzY3JpYmVyJ3MgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gdG8gdGhlXG4gICAgLy8gY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gb24gdGhlIHNoYXJlZCBDb25uZWN0YWJsZU9ic2VydmFibGUuIEluIGNhc2VzXG4gICAgLy8gd2hlcmUgdGhlIENvbm5lY3RhYmxlT2JzZXJ2YWJsZSBzb3VyY2Ugc3luY2hyb25vdXNseSBlbWl0cyB2YWx1ZXMsIGFuZFxuICAgIC8vIHRoZSBSZWZDb3VudFN1YnNjcmliZXIncyBkb3duc3RyZWFtIE9ic2VydmVycyBzeW5jaHJvbm91c2x5IHVuc3Vic2NyaWJlLFxuICAgIC8vIGV4ZWN1dGlvbiBjb250aW51ZXMgdG8gaGVyZSBiZWZvcmUgdGhlIFJlZkNvdW50T3BlcmF0b3IgaGFzIGEgY2hhbmNlIHRvXG4gICAgLy8gc3VwcGx5IHRoZSBSZWZDb3VudFN1YnNjcmliZXIgd2l0aCB0aGUgc2hhcmVkIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uLlxuICAgIC8vIEZvciBleGFtcGxlOlxuICAgIC8vIGBgYFxuICAgIC8vIHJhbmdlKDAsIDEwKS5waXBlKFxuICAgIC8vICAgcHVibGlzaCgpLFxuICAgIC8vICAgcmVmQ291bnQoKSxcbiAgICAvLyAgIHRha2UoNSksXG4gICAgLy8gKVxuICAgIC8vIC5zdWJzY3JpYmUoKTtcbiAgICAvLyBgYGBcbiAgICAvLyBJbiBvcmRlciB0byBhY2NvdW50IGZvciB0aGlzIGNhc2UsIFJlZkNvdW50U3Vic2NyaWJlciBzaG91bGQgb25seSBkaXNwb3NlXG4gICAgLy8gdGhlIENvbm5lY3RhYmxlT2JzZXJ2YWJsZSdzIHNoYXJlZCBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiBpZiB0aGVcbiAgICAvLyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiBleGlzdHMsICphbmQqIGVpdGhlcjpcbiAgICAvLyAgIGEuIFJlZkNvdW50U3Vic2NyaWJlciBkb2Vzbid0IGhhdmUgYSByZWZlcmVuY2UgdG8gdGhlIHNoYXJlZCBjb25uZWN0aW9uXG4gICAgLy8gICAgICBTdWJzY3JpcHRpb24geWV0LCBvcixcbiAgICAvLyAgIGIuIFJlZkNvdW50U3Vic2NyaWJlcidzIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIHJlZmVyZW5jZSBpcyBpZGVudGljYWxcbiAgICAvLyAgICAgIHRvIHRoZSBzaGFyZWQgY29ubmVjdGlvbiBTdWJzY3JpcHRpb25cbiAgICAvLy9cbiAgICBjb25zdCB7IGNvbm5lY3Rpb24gfSA9IHRoaXM7XG4gICAgY29uc3Qgc2hhcmVkQ29ubmVjdGlvbiA9ICg8YW55PiBjb25uZWN0YWJsZSkuX2Nvbm5lY3Rpb247XG4gICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcblxuICAgIGlmIChzaGFyZWRDb25uZWN0aW9uICYmICghY29ubmVjdGlvbiB8fCBzaGFyZWRDb25uZWN0aW9uID09PSBjb25uZWN0aW9uKSkge1xuICAgICAgc2hhcmVkQ29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxufVxuIl19