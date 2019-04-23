/// <reference path="../../observable.ts" />
/// <reference path="../../concurrency/scheduler.ts" />
(function () {
    var o = Rx.Observable.range(1, 2);
    o = Rx.Observable.range(1, 2, Rx.Scheduler.async);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4L3RzL2NvcmUvbGlucS9vYnNlcnZhYmxlL3JhbmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDRDQUE0QztBQUM1Qyx1REFBdUQ7QUFrQnZELENBQUM7SUFDRyxJQUFJLENBQUMsR0FBMEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEQsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vb2JzZXJ2YWJsZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vY29uY3VycmVuY3kvc2NoZWR1bGVyLnRzXCIgLz5cbm1vZHVsZSBSeCB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBPYnNlcnZhYmxlU3RhdGljIHtcbiAgICAgICAgLyoqXG4gICAgICAgICogIEdlbmVyYXRlcyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIG9mIGludGVncmFsIG51bWJlcnMgd2l0aGluIGEgc3BlY2lmaWVkIHJhbmdlLCB1c2luZyB0aGUgc3BlY2lmaWVkIHNjaGVkdWxlciB0byBzZW5kIG91dCBvYnNlcnZlciBtZXNzYWdlcy5cbiAgICAgICAgKlxuICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICogIHZhciByZXMgPSBSeC5PYnNlcnZhYmxlLnJhbmdlKDAsIDEwKTtcbiAgICAgICAgKiAgdmFyIHJlcyA9IFJ4Lk9ic2VydmFibGUucmFuZ2UoMCwgMTAsIFJ4LlNjaGVkdWxlci50aW1lb3V0KTtcbiAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnQgVGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBpbnRlZ2VyIGluIHRoZSBzZXF1ZW5jZS5cbiAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgVGhlIG51bWJlciBvZiBzZXF1ZW50aWFsIGludGVnZXJzIHRvIGdlbmVyYXRlLlxuICAgICAgICAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSBTY2hlZHVsZXIgdG8gcnVuIHRoZSBnZW5lcmF0b3IgbG9vcCBvbi4gSWYgbm90IHNwZWNpZmllZCwgZGVmYXVsdHMgdG8gU2NoZWR1bGVyLmN1cnJlbnRUaHJlYWQuXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBjb250YWlucyBhIHJhbmdlIG9mIHNlcXVlbnRpYWwgaW50ZWdyYWwgbnVtYmVycy5cbiAgICAgICAgKi9cbiAgICAgICAgcmFuZ2Uoc3RhcnQ6IG51bWJlciwgY291bnQ6IG51bWJlciwgc2NoZWR1bGVyPzogSVNjaGVkdWxlcik6IE9ic2VydmFibGU8bnVtYmVyPjtcbiAgICB9XG59XG5cbihmdW5jdGlvbigpIHtcbiAgICB2YXIgbzogUnguT2JzZXJ2YWJsZTxudW1iZXI+ID0gUnguT2JzZXJ2YWJsZS5yYW5nZSgxLCAyKTtcbiAgICBvID0gUnguT2JzZXJ2YWJsZS5yYW5nZSgxLCAyLCBSeC5TY2hlZHVsZXIuYXN5bmMpO1xufSk7XG4iXX0=