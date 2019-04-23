/// <reference path="../../observable.ts"/>
/// <reference path="../../concurrency/scheduler.ts" />
(function () {
    var o;
    o = Rx.Observable.throw(new Error());
    o = Rx.Observable.throw(new Error(), Rx.Scheduler.async);
    o = Rx.Observable.throw('abc');
    o = Rx.Observable.throw('abc', Rx.Scheduler.async);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyb3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9yeC90cy9jb3JlL2xpbnEvb2JzZXJ2YWJsZS90aHJvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyQ0FBMkM7QUFDM0MsdURBQXVEO0FBb0J2RCxDQUFDO0lBQ0csSUFBSSxDQUFzQixDQUFDO0lBQzNCLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6RCxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZELENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL29ic2VydmFibGUudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vY29uY3VycmVuY3kvc2NoZWR1bGVyLnRzXCIgLz5cbm1vZHVsZSBSeCB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBPYnNlcnZhYmxlU3RhdGljIHtcbiAgICAgICAgLyoqXG4gICAgICAgICogIFJldHVybnMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IHRlcm1pbmF0ZXMgd2l0aCBhbiBleGNlcHRpb24sIHVzaW5nIHRoZSBzcGVjaWZpZWQgc2NoZWR1bGVyIHRvIHNlbmQgb3V0IHRoZSBzaW5nbGUgb25FcnJvciBtZXNzYWdlLlxuICAgICAgICAqIEBwYXJhbSB7TWl4ZWR9IGVycm9yIEFuIG9iamVjdCB1c2VkIGZvciB0aGUgc2VxdWVuY2UncyB0ZXJtaW5hdGlvbi5cbiAgICAgICAgKiBAcGFyYW0ge1NjaGVkdWxlcn0gc2NoZWR1bGVyIFNjaGVkdWxlciB0byBzZW5kIHRoZSBleGNlcHRpb25hbCB0ZXJtaW5hdGlvbiBjYWxsIG9uLiBJZiBub3Qgc3BlY2lmaWVkLCBkZWZhdWx0cyB0byBTY2hlZHVsZXIuaW1tZWRpYXRlLlxuICAgICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IHRlcm1pbmF0ZXMgZXhjZXB0aW9uYWxseSB3aXRoIHRoZSBzcGVjaWZpZWQgZXhjZXB0aW9uIG9iamVjdC5cbiAgICAgICAgKi9cbiAgICAgICAgdGhyb3c8VD4oZXhjZXB0aW9uOiBFcnJvciwgc2NoZWR1bGVyPzogSVNjaGVkdWxlcik6IE9ic2VydmFibGU8VD47XG4gICAgICAgIC8qKlxuICAgICAgICAqICBSZXR1cm5zIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCB0ZXJtaW5hdGVzIHdpdGggYW4gZXhjZXB0aW9uLCB1c2luZyB0aGUgc3BlY2lmaWVkIHNjaGVkdWxlciB0byBzZW5kIG91dCB0aGUgc2luZ2xlIG9uRXJyb3IgbWVzc2FnZS5cbiAgICAgICAgKiBAcGFyYW0ge01peGVkfSBlcnJvciBBbiBvYmplY3QgdXNlZCBmb3IgdGhlIHNlcXVlbmNlJ3MgdGVybWluYXRpb24uXG4gICAgICAgICogQHBhcmFtIHtTY2hlZHVsZXJ9IHNjaGVkdWxlciBTY2hlZHVsZXIgdG8gc2VuZCB0aGUgZXhjZXB0aW9uYWwgdGVybWluYXRpb24gY2FsbCBvbi4gSWYgbm90IHNwZWNpZmllZCwgZGVmYXVsdHMgdG8gU2NoZWR1bGVyLmltbWVkaWF0ZS5cbiAgICAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gVGhlIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCB0ZXJtaW5hdGVzIGV4Y2VwdGlvbmFsbHkgd2l0aCB0aGUgc3BlY2lmaWVkIGV4Y2VwdGlvbiBvYmplY3QuXG4gICAgICAgICovXG4gICAgICAgIHRocm93PFQ+KGV4Y2VwdGlvbjogYW55LCBzY2hlZHVsZXI/OiBJU2NoZWR1bGVyKTogT2JzZXJ2YWJsZTxUPjtcbiAgICB9XG59XG5cbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG8gOiBSeC5PYnNlcnZhYmxlPGFueT47XG4gICAgbyA9IFJ4Lk9ic2VydmFibGUudGhyb3cobmV3IEVycm9yKCkpO1xuICAgIG8gPSBSeC5PYnNlcnZhYmxlLnRocm93KG5ldyBFcnJvcigpLCBSeC5TY2hlZHVsZXIuYXN5bmMpO1xuICAgIG8gPSBSeC5PYnNlcnZhYmxlLnRocm93KCdhYmMnKTtcbiAgICBvID0gUnguT2JzZXJ2YWJsZS50aHJvdygnYWJjJywgUnguU2NoZWR1bGVyLmFzeW5jKTtcbn0pO1xuIl19