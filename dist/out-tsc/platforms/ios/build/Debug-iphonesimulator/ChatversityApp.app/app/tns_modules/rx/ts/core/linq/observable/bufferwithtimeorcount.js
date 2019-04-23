/// <reference path="../../observable.ts" />
/// <reference path="../../concurrency/scheduler.ts" />
(function () {
    var o;
    var so = o.bufferWithTimeOrCount(100, 200);
    var so = o.bufferWithTimeOrCount(100, 200, Rx.Scheduler.default);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyd2l0aHRpbWVvcmNvdW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9yeC90cy9jb3JlL2xpbnEvb2JzZXJ2YWJsZS9idWZmZXJ3aXRodGltZW9yY291bnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNENBQTRDO0FBQzVDLHVEQUF1RDtBQWN2RCxDQUFDO0lBQ0csSUFBSSxDQUF3QixDQUFDO0lBQzdCLElBQUksRUFBRSxHQUE0QixDQUFDLENBQUMscUJBQXFCLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BFLElBQUksRUFBRSxHQUE0QixDQUFDLENBQUMscUJBQXFCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlGLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL29ic2VydmFibGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2NvbmN1cnJlbmN5L3NjaGVkdWxlci50c1wiIC8+XG5tb2R1bGUgUngge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgT2JzZXJ2YWJsZTxUPiB7XG4gICAgICAgIC8qKlxuICAgICAgICAqICBQcm9qZWN0cyBlYWNoIGVsZW1lbnQgb2YgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBpbnRvIGEgYnVmZmVyIHRoYXQgaXMgY29tcGxldGVkIHdoZW4gZWl0aGVyIGl0J3MgZnVsbCBvciBhIGdpdmVuIGFtb3VudCBvZiB0aW1lIGhhcyBlbGFwc2VkLlxuICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lU3BhbiBNYXhpbXVtIHRpbWUgbGVuZ3RoIG9mIGEgYnVmZmVyLlxuICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBjb3VudCBNYXhpbXVtIGVsZW1lbnQgY291bnQgb2YgYSBidWZmZXIuXG4gICAgICAgICogQHBhcmFtIHtTY2hlZHVsZXJ9IFtzY2hlZHVsZXJdICBTY2hlZHVsZXIgdG8gcnVuIGJ1ZmZlcmluIHRpbWVycyBvbi4gSWYgbm90IHNwZWNpZmllZCwgdGhlIHRpbWVvdXQgc2NoZWR1bGVyIGlzIHVzZWQuXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2Ugb2YgYnVmZmVycy5cbiAgICAgICAgKi9cbiAgICAgICAgYnVmZmVyV2l0aFRpbWVPckNvdW50KHRpbWVTcGFuOiBudW1iZXIsIGNvdW50OiBudW1iZXIsIHNjaGVkdWxlcj86IElTY2hlZHVsZXIpOiBPYnNlcnZhYmxlPFRbXT47XG4gICAgfVxufVxuXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIG86IFJ4Lk9ic2VydmFibGU8c3RyaW5nPjtcbiAgICB2YXIgc286IFJ4Lk9ic2VydmFibGU8c3RyaW5nW10+ID0gby5idWZmZXJXaXRoVGltZU9yQ291bnQoMTAwLCAyMDApO1xuICAgIHZhciBzbzogUnguT2JzZXJ2YWJsZTxzdHJpbmdbXT4gPSBvLmJ1ZmZlcldpdGhUaW1lT3JDb3VudCgxMDAsIDIwMCwgUnguU2NoZWR1bGVyLmRlZmF1bHQpO1xufSlcbiJdfQ==