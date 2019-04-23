/// <reference path="../../observable.ts"/>
/// <reference path="../../concurrency/scheduler.ts" />
(function () {
    var o;
    Rx.Observable.repeat(42, 4, Rx.Scheduler.async);
    Rx.Observable.repeat(42, null, Rx.Scheduler.async);
    Rx.Observable.repeat(42);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvcngvdHMvY29yZS9saW5xL29ic2VydmFibGUvcmVwZWF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDJDQUEyQztBQUMzQyx1REFBdUQ7QUFvQnZELENBQUM7SUFDRyxJQUFJLENBQXdCLENBQUM7SUFDN0IsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hELEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuRCxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3QixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9vYnNlcnZhYmxlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2NvbmN1cnJlbmN5L3NjaGVkdWxlci50c1wiIC8+XG5tb2R1bGUgUngge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgT2JzZXJ2YWJsZVN0YXRpYyB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgR2VuZXJhdGVzIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCByZXBlYXRzIHRoZSBnaXZlbiBlbGVtZW50IHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIHRpbWVzLCB1c2luZyB0aGUgc3BlY2lmaWVkIHNjaGVkdWxlciB0byBzZW5kIG91dCBvYnNlcnZlciBtZXNzYWdlcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogIHZhciByZXMgPSBSeC5PYnNlcnZhYmxlLnJlcGVhdCg0Mik7XG4gICAgICAgICAqICB2YXIgcmVzID0gUnguT2JzZXJ2YWJsZS5yZXBlYXQoNDIsIDQpO1xuICAgICAgICAgKiAgMyAtIHJlcyA9IFJ4Lk9ic2VydmFibGUucmVwZWF0KDQyLCA0LCBSeC5TY2hlZHVsZXIudGltZW91dCk7XG4gICAgICAgICAqICA0IC0gcmVzID0gUnguT2JzZXJ2YWJsZS5yZXBlYXQoNDIsIG51bGwsIFJ4LlNjaGVkdWxlci50aW1lb3V0KTtcbiAgICAgICAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgRWxlbWVudCB0byByZXBlYXQuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSByZXBlYXRDb3VudCBbT3B0aW9uYV0gTnVtYmVyIG9mIHRpbWVzIHRvIHJlcGVhdCB0aGUgZWxlbWVudC4gSWYgbm90IHNwZWNpZmllZCwgcmVwZWF0cyBpbmRlZmluaXRlbHkuXG4gICAgICAgICAqIEBwYXJhbSB7U2NoZWR1bGVyfSBzY2hlZHVsZXIgU2NoZWR1bGVyIHRvIHJ1biB0aGUgcHJvZHVjZXIgbG9vcCBvbi4gSWYgbm90IHNwZWNpZmllZCwgZGVmYXVsdHMgdG8gU2NoZWR1bGVyLmltbWVkaWF0ZS5cbiAgICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCByZXBlYXRzIHRoZSBnaXZlbiBlbGVtZW50IHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIHRpbWVzLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVwZWF0PFQ+KHZhbHVlOiBULCByZXBlYXRDb3VudD86IG51bWJlciB8IHZvaWQsIHNjaGVkdWxlcj86IElTY2hlZHVsZXIpOiBPYnNlcnZhYmxlPFQ+O1xuICAgIH1cbn1cblxuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBvOiBSeC5PYnNlcnZhYmxlPG51bWJlcj47XG4gICAgUnguT2JzZXJ2YWJsZS5yZXBlYXQoNDIsIDQsIFJ4LlNjaGVkdWxlci5hc3luYyk7XG4gICAgUnguT2JzZXJ2YWJsZS5yZXBlYXQoNDIsIG51bGwsIFJ4LlNjaGVkdWxlci5hc3luYyk7XG4gICAgUnguT2JzZXJ2YWJsZS5yZXBlYXQoNDIpO1xufSk7XG4iXX0=