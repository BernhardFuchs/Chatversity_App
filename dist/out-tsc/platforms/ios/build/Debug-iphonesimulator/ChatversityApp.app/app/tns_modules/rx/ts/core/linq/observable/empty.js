/// <reference path="../../observable.ts" />
/// <reference path="../../concurrency/scheduler.ts" />
(function () {
    var o;
    o = Rx.Observable.empty();
    o = Rx.Observable.empty(Rx.Scheduler.async);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4L3RzL2NvcmUvbGlucS9vYnNlcnZhYmxlL2VtcHR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDRDQUE0QztBQUM1Qyx1REFBdUQ7QUFnQnZELENBQUM7SUFDRyxJQUFJLENBQXlCLENBQUM7SUFDOUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFVLENBQUM7SUFDbEMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vb2JzZXJ2YWJsZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vY29uY3VycmVuY3kvc2NoZWR1bGVyLnRzXCIgLz5cbm1vZHVsZSBSeCB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBPYnNlcnZhYmxlU3RhdGljIHtcbiAgICAgICAgLyoqXG4gICogIFJldHVybnMgYW4gZW1wdHkgb2JzZXJ2YWJsZSBzZXF1ZW5jZSwgdXNpbmcgdGhlIHNwZWNpZmllZCBzY2hlZHVsZXIgdG8gc2VuZCBvdXQgdGhlIHNpbmdsZSBPbkNvbXBsZXRlZCBtZXNzYWdlLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiAgdmFyIHJlcyA9IFJ4Lk9ic2VydmFibGUuZW1wdHkoKTtcbiAgKiAgdmFyIHJlcyA9IFJ4Lk9ic2VydmFibGUuZW1wdHkoUnguU2NoZWR1bGVyLnRpbWVvdXQpO1xuICAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSBTY2hlZHVsZXIgdG8gc2VuZCB0aGUgdGVybWluYXRpb24gY2FsbCBvbi5cbiAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB3aXRoIG5vIGVsZW1lbnRzLlxuICAqL1xuICAgICAgICBlbXB0eTxUPihzY2hlZHVsZXI/OiBJU2NoZWR1bGVyKTogT2JzZXJ2YWJsZTxUPjtcbiAgICB9XG59XG5cbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG8gOiBSeC5PYnNlcnZhYmxlPHN0cmluZz47XG4gICAgbyA9IFJ4Lk9ic2VydmFibGUuZW1wdHk8c3RyaW5nPigpO1xuICAgIG8gPSBSeC5PYnNlcnZhYmxlLmVtcHR5PHN0cmluZz4oUnguU2NoZWR1bGVyLmFzeW5jKTtcbn0pO1xuIl19