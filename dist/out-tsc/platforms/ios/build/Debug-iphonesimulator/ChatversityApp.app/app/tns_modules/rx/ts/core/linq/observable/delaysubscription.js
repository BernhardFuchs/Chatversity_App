/// <reference path="../../observable.ts" />
/// <reference path="../../concurrency/scheduler.ts" />
(function () {
    var o;
    o.delaySubscription(1000);
    o.delaySubscription(1000, Rx.Scheduler.async);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsYXlzdWJzY3JpcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4L3RzL2NvcmUvbGlucS9vYnNlcnZhYmxlL2RlbGF5c3Vic2NyaXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDRDQUE0QztBQUM1Qyx1REFBdUQ7QUFrQnZELENBQUM7SUFDRyxJQUFJLENBQXdCLENBQUM7SUFDN0IsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsRCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9vYnNlcnZhYmxlLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9jb25jdXJyZW5jeS9zY2hlZHVsZXIudHNcIiAvPlxubW9kdWxlIFJ4IHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIE9ic2VydmFibGU8VD4ge1xuICAgICAgICAvKipcbiAgICAgICAgKiAgVGltZSBzaGlmdHMgdGhlIG9ic2VydmFibGUgc2VxdWVuY2UgYnkgZGVsYXlpbmcgdGhlIHN1YnNjcmlwdGlvbiB3aXRoIHRoZSBzcGVjaWZpZWQgcmVsYXRpdmUgdGltZSBkdXJhdGlvbiwgdXNpbmcgdGhlIHNwZWNpZmllZCBzY2hlZHVsZXIgdG8gcnVuIHRpbWVycy5cbiAgICAgICAgKlxuICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICogIDEgLSByZXMgPSBzb3VyY2UuZGVsYXlTdWJzY3JpcHRpb24oNTAwMCk7IC8vIDVzXG4gICAgICAgICogIDIgLSByZXMgPSBzb3VyY2UuZGVsYXlTdWJzY3JpcHRpb24oNTAwMCwgUnguU2NoZWR1bGVyLmRlZmF1bHQpOyAvLyA1IHNlY29uZHNcbiAgICAgICAgKlxuICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdWVUaW1lIFJlbGF0aXZlIG9yIGFic29sdXRlIHRpbWUgc2hpZnQgb2YgdGhlIHN1YnNjcmlwdGlvbi5cbiAgICAgICAgKiBAcGFyYW0ge1NjaGVkdWxlcn0gW3NjaGVkdWxlcl0gIFNjaGVkdWxlciB0byBydW4gdGhlIHN1YnNjcmlwdGlvbiBkZWxheSB0aW1lciBvbi4gSWYgbm90IHNwZWNpZmllZCwgdGhlIHRpbWVvdXQgc2NoZWR1bGVyIGlzIHVzZWQuXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IFRpbWUtc2hpZnRlZCBzZXF1ZW5jZS5cbiAgICAgICAgKi9cbiAgICAgICAgZGVsYXlTdWJzY3JpcHRpb24oZHVlVGltZTogbnVtYmVyLCBzY2hlZHVsZXI/OiBJU2NoZWR1bGVyKTogT2JzZXJ2YWJsZTxUPjtcbiAgICB9XG59XG5cbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG86IFJ4Lk9ic2VydmFibGU8c3RyaW5nPjtcbiAgICBvLmRlbGF5U3Vic2NyaXB0aW9uKDEwMDApO1xuICAgIG8uZGVsYXlTdWJzY3JpcHRpb24oMTAwMCwgUnguU2NoZWR1bGVyLmFzeW5jKTtcbn0pO1xuIl19