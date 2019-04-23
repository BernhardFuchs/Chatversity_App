/// <reference path="../../observable.ts"/>
(function () {
    var o;
    var n;
    n = o.flatMap(function (x) { return Rx.Observable.from([1, 2, 3]); });
    n = o.flatMap(function (x) { return Rx.Observable.from([1, 2, 3]).toPromise(); });
    n = o.flatMap(function (x) { return [1, 2, 3]; });
    n = o.flatMap(function (x, z, b) { return Rx.Observable.from([1, 2, 3]); }, function (x, y, a, b) { return y; });
    n = o.flatMap(function (x) { return Rx.Observable.from([1, 2, 3]).toPromise(); }, function (x, y) { return y; });
    n = o.flatMap(function (x) { return [1, 2, 3]; }, function (x, y) { return y; });
    n = o.flatMap(Rx.Observable.from([1, 2, 3]));
    n = o.flatMap(Rx.Observable.from([1, 2, 3]).toPromise());
    n = o.flatMap([1, 2, 3]);
    n = o.flatMap(Rx.Observable.from([1, 2, 3]), function (x, y) { return y; });
    n = o.flatMap(Rx.Observable.from([1, 2, 3]).toPromise(), function (x, y) { return y; });
    n = o.flatMap([1, 2, 3], function (x, y) { return y; });
    n = o.selectMany(function (x) { return Rx.Observable.from([1, 2, 3]); });
    n = o.selectMany(function (x) { return Rx.Observable.from([1, 2, 3]).toPromise(); });
    n = o.selectMany(function (x) { return [1, 2, 3]; });
    n = o.selectMany(function (x) { return Rx.Observable.from([1, 2, 3]); }, function (x, y) { return y; });
    n = o.selectMany(function (x) { return Rx.Observable.from([1, 2, 3]).toPromise(); }, function (x, y) { return y; });
    n = o.selectMany(function (x) { return [1, 2, 3]; }, function (x, y) { return y; });
    n = o.selectMany(Rx.Observable.from([1, 2, 3]));
    n = o.selectMany(Rx.Observable.from([1, 2, 3]).toPromise());
    n = o.selectMany([1, 2, 3]);
    n = o.selectMany(Rx.Observable.from([1, 2, 3]), function (x, y) { return y; });
    n = o.selectMany(Rx.Observable.from([1, 2, 3]).toPromise(), function (x, y) { return y; });
    n = o.selectMany([1, 2, 3], function (x, y) { return y; });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdG1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvcngvdHMvY29yZS9saW5xL29ic2VydmFibGUvZmxhdG1hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyQ0FBMkM7QUF1SzNDLENBQUM7SUFDRyxJQUFJLENBQXdCLENBQUM7SUFDN0IsSUFBSSxDQUF3QixDQUFDO0lBQzdCLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQTdCLENBQTZCLENBQUMsQ0FBQztJQUNsRCxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUF6QyxDQUF5QyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQVQsQ0FBUyxDQUFDLENBQUM7SUFDOUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUE3QixDQUE2QixFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxFQUFELENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQXpDLENBQXlDLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxFQUFELENBQUMsQ0FBQyxDQUFDO0lBQzNFLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFULENBQVMsRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUM7SUFDM0MsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUMsQ0FBQztJQUV0QyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUE3QixDQUE2QixDQUFDLENBQUM7SUFDckQsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFULENBQVMsQ0FBQyxDQUFDO0lBQ2pDLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQTdCLENBQTZCLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxFQUFELENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQXpDLENBQXlDLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxFQUFELENBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFULENBQVMsRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQzVELENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUMsQ0FBQztBQUM3QyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9vYnNlcnZhYmxlLnRzXCIvPlxubW9kdWxlIFJ4IHtcblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgT2JzZXJ2YWJsZTxUPiB7XG4gICAgICAgIC8qKlxuICAgICAgICAqICBPbmUgb2YgdGhlIEZvbGxvd2luZzpcbiAgICAgICAgKiAgUHJvamVjdHMgZWFjaCBlbGVtZW50IG9mIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdG8gYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBhbmQgbWVyZ2VzIHRoZSByZXN1bHRpbmcgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgaW50byBvbmUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKlxuICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICogIHZhciByZXMgPSBzb3VyY2Uuc2VsZWN0TWFueShmdW5jdGlvbiAoeCkgeyByZXR1cm4gUnguT2JzZXJ2YWJsZS5yYW5nZSgwLCB4KTsgfSk7XG4gICAgICAgICogIE9yOlxuICAgICAgICAqICBQcm9qZWN0cyBlYWNoIGVsZW1lbnQgb2YgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlLCBpbnZva2VzIHRoZSByZXN1bHQgc2VsZWN0b3IgZm9yIHRoZSBzb3VyY2UgZWxlbWVudCBhbmQgZWFjaCBvZiB0aGUgY29ycmVzcG9uZGluZyBpbm5lciBzZXF1ZW5jZSdzIGVsZW1lbnRzLCBhbmQgbWVyZ2VzIHRoZSByZXN1bHRzIGludG8gb25lIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICAgICpcbiAgICAgICAgKiAgdmFyIHJlcyA9IHNvdXJjZS5zZWxlY3RNYW55KGZ1bmN0aW9uICh4KSB7IHJldHVybiBSeC5PYnNlcnZhYmxlLnJhbmdlKDAsIHgpOyB9LCBmdW5jdGlvbiAoeCwgeSkgeyByZXR1cm4geCArIHk7IH0pO1xuICAgICAgICAqICBPcjpcbiAgICAgICAgKiAgUHJvamVjdHMgZWFjaCBlbGVtZW50IG9mIHRoZSBzb3VyY2Ugb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byB0aGUgb3RoZXIgb2JzZXJ2YWJsZSBzZXF1ZW5jZSBhbmQgbWVyZ2VzIHRoZSByZXN1bHRpbmcgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgaW50byBvbmUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKlxuICAgICAgICAqICB2YXIgcmVzID0gc291cmNlLnNlbGVjdE1hbnkoUnguT2JzZXJ2YWJsZS5mcm9tQXJyYXkoWzEsMiwzXSkpO1xuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHNlbGVjdG9yIEEgdHJhbnNmb3JtIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggZWxlbWVudCBvciBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRvIHByb2plY3QgZWFjaCBlbGVtZW50IGZyb20gdGhlIHNvdXJjZSBzZXF1ZW5jZSBvbnRvIHdoaWNoIGNvdWxkIGJlIGVpdGhlciBhbiBvYnNlcnZhYmxlIG9yIFByb21pc2UuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc3VsdFNlbGVjdG9yXSAgQSB0cmFuc2Zvcm0gZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnRlcm1lZGlhdGUgc2VxdWVuY2UuXG4gICAgICAgICogQHBhcmFtIHtBbnl9IFt0aGlzQXJnXSBPYmplY3QgdG8gdXNlIGFzIHRoaXMgd2hlbiBleGVjdXRpbmcgY2FsbGJhY2suXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2Ugd2hvc2UgZWxlbWVudHMgYXJlIHRoZSByZXN1bHQgb2YgaW52b2tpbmcgdGhlIG9uZS10by1tYW55IHRyYW5zZm9ybSBmdW5jdGlvbiBjb2xsZWN0aW9uU2VsZWN0b3Igb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZSBhbmQgdGhlbiBtYXBwaW5nIGVhY2ggb2YgdGhvc2Ugc2VxdWVuY2UgZWxlbWVudHMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgc291cmNlIGVsZW1lbnQgdG8gYSByZXN1bHQgZWxlbWVudC5cbiAgICAgICAgKi9cbiAgICAgICAgZmxhdE1hcDxUUmVzdWx0PihzZWxlY3RvcjogX1ZhbHVlT3JTZWxlY3RvcjxULCBPYnNlcnZhYmxlT3JQcm9taXNlPFRSZXN1bHQ+Pik6IE9ic2VydmFibGU8VFJlc3VsdD47XG4gICAgICAgIC8qKlxuICAgICAgICAqICBPbmUgb2YgdGhlIEZvbGxvd2luZzpcbiAgICAgICAgKiAgUHJvamVjdHMgZWFjaCBlbGVtZW50IG9mIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdG8gYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBhbmQgbWVyZ2VzIHRoZSByZXN1bHRpbmcgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgaW50byBvbmUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKlxuICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICogIHZhciByZXMgPSBzb3VyY2Uuc2VsZWN0TWFueShmdW5jdGlvbiAoeCkgeyByZXR1cm4gUnguT2JzZXJ2YWJsZS5yYW5nZSgwLCB4KTsgfSk7XG4gICAgICAgICogIE9yOlxuICAgICAgICAqICBQcm9qZWN0cyBlYWNoIGVsZW1lbnQgb2YgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlLCBpbnZva2VzIHRoZSByZXN1bHQgc2VsZWN0b3IgZm9yIHRoZSBzb3VyY2UgZWxlbWVudCBhbmQgZWFjaCBvZiB0aGUgY29ycmVzcG9uZGluZyBpbm5lciBzZXF1ZW5jZSdzIGVsZW1lbnRzLCBhbmQgbWVyZ2VzIHRoZSByZXN1bHRzIGludG8gb25lIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICAgICpcbiAgICAgICAgKiAgdmFyIHJlcyA9IHNvdXJjZS5zZWxlY3RNYW55KGZ1bmN0aW9uICh4KSB7IHJldHVybiBSeC5PYnNlcnZhYmxlLnJhbmdlKDAsIHgpOyB9LCBmdW5jdGlvbiAoeCwgeSkgeyByZXR1cm4geCArIHk7IH0pO1xuICAgICAgICAqICBPcjpcbiAgICAgICAgKiAgUHJvamVjdHMgZWFjaCBlbGVtZW50IG9mIHRoZSBzb3VyY2Ugb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byB0aGUgb3RoZXIgb2JzZXJ2YWJsZSBzZXF1ZW5jZSBhbmQgbWVyZ2VzIHRoZSByZXN1bHRpbmcgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgaW50byBvbmUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKlxuICAgICAgICAqICB2YXIgcmVzID0gc291cmNlLnNlbGVjdE1hbnkoUnguT2JzZXJ2YWJsZS5mcm9tQXJyYXkoWzEsMiwzXSkpO1xuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHNlbGVjdG9yIEEgdHJhbnNmb3JtIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggZWxlbWVudCBvciBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRvIHByb2plY3QgZWFjaCBlbGVtZW50IGZyb20gdGhlIHNvdXJjZSBzZXF1ZW5jZSBvbnRvIHdoaWNoIGNvdWxkIGJlIGVpdGhlciBhbiBvYnNlcnZhYmxlIG9yIFByb21pc2UuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc3VsdFNlbGVjdG9yXSAgQSB0cmFuc2Zvcm0gZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnRlcm1lZGlhdGUgc2VxdWVuY2UuXG4gICAgICAgICogQHBhcmFtIHtBbnl9IFt0aGlzQXJnXSBPYmplY3QgdG8gdXNlIGFzIHRoaXMgd2hlbiBleGVjdXRpbmcgY2FsbGJhY2suXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2Ugd2hvc2UgZWxlbWVudHMgYXJlIHRoZSByZXN1bHQgb2YgaW52b2tpbmcgdGhlIG9uZS10by1tYW55IHRyYW5zZm9ybSBmdW5jdGlvbiBjb2xsZWN0aW9uU2VsZWN0b3Igb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZSBhbmQgdGhlbiBtYXBwaW5nIGVhY2ggb2YgdGhvc2Ugc2VxdWVuY2UgZWxlbWVudHMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgc291cmNlIGVsZW1lbnQgdG8gYSByZXN1bHQgZWxlbWVudC5cbiAgICAgICAgKi9cbiAgICAgICAgZmxhdE1hcDxUUmVzdWx0PihzZWxlY3RvcjogX1ZhbHVlT3JTZWxlY3RvcjxULCBBcnJheU9ySXRlcmFibGU8VFJlc3VsdD4+KTogT2JzZXJ2YWJsZTxUUmVzdWx0PjtcbiAgICAgICAgLyoqXG4gICAgICAgICogIE9uZSBvZiB0aGUgRm9sbG93aW5nOlxuICAgICAgICAqICBQcm9qZWN0cyBlYWNoIGVsZW1lbnQgb2YgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGFuZCBtZXJnZXMgdGhlIHJlc3VsdGluZyBvYnNlcnZhYmxlIHNlcXVlbmNlcyBpbnRvIG9uZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqXG4gICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgKiAgdmFyIHJlcyA9IHNvdXJjZS5zZWxlY3RNYW55KGZ1bmN0aW9uICh4KSB7IHJldHVybiBSeC5PYnNlcnZhYmxlLnJhbmdlKDAsIHgpOyB9KTtcbiAgICAgICAgKiAgT3I6XG4gICAgICAgICogIFByb2plY3RzIGVhY2ggZWxlbWVudCBvZiBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRvIGFuIG9ic2VydmFibGUgc2VxdWVuY2UsIGludm9rZXMgdGhlIHJlc3VsdCBzZWxlY3RvciBmb3IgdGhlIHNvdXJjZSBlbGVtZW50IGFuZCBlYWNoIG9mIHRoZSBjb3JyZXNwb25kaW5nIGlubmVyIHNlcXVlbmNlJ3MgZWxlbWVudHMsIGFuZCBtZXJnZXMgdGhlIHJlc3VsdHMgaW50byBvbmUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKlxuICAgICAgICAqICB2YXIgcmVzID0gc291cmNlLnNlbGVjdE1hbnkoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIFJ4Lk9ic2VydmFibGUucmFuZ2UoMCwgeCk7IH0sIGZ1bmN0aW9uICh4LCB5KSB7IHJldHVybiB4ICsgeTsgfSk7XG4gICAgICAgICogIE9yOlxuICAgICAgICAqICBQcm9qZWN0cyBlYWNoIGVsZW1lbnQgb2YgdGhlIHNvdXJjZSBvYnNlcnZhYmxlIHNlcXVlbmNlIHRvIHRoZSBvdGhlciBvYnNlcnZhYmxlIHNlcXVlbmNlIGFuZCBtZXJnZXMgdGhlIHJlc3VsdGluZyBvYnNlcnZhYmxlIHNlcXVlbmNlcyBpbnRvIG9uZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqXG4gICAgICAgICogIHZhciByZXMgPSBzb3VyY2Uuc2VsZWN0TWFueShSeC5PYnNlcnZhYmxlLmZyb21BcnJheShbMSwyLDNdKSk7XG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gc2VsZWN0b3IgQSB0cmFuc2Zvcm0gZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBlbGVtZW50IG9yIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdG8gcHJvamVjdCBlYWNoIGVsZW1lbnQgZnJvbSB0aGUgc291cmNlIHNlcXVlbmNlIG9udG8gd2hpY2ggY291bGQgYmUgZWl0aGVyIGFuIG9ic2VydmFibGUgb3IgUHJvbWlzZS5cbiAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzdWx0U2VsZWN0b3JdICBBIHRyYW5zZm9ybSBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIGVsZW1lbnQgb2YgdGhlIGludGVybWVkaWF0ZSBzZXF1ZW5jZS5cbiAgICAgICAgKiBAcGFyYW0ge0FueX0gW3RoaXNBcmddIE9iamVjdCB0byB1c2UgYXMgdGhpcyB3aGVuIGV4ZWN1dGluZyBjYWxsYmFjay5cbiAgICAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB3aG9zZSBlbGVtZW50cyBhcmUgdGhlIHJlc3VsdCBvZiBpbnZva2luZyB0aGUgb25lLXRvLW1hbnkgdHJhbnNmb3JtIGZ1bmN0aW9uIGNvbGxlY3Rpb25TZWxlY3RvciBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlIGFuZCB0aGVuIG1hcHBpbmcgZWFjaCBvZiB0aG9zZSBzZXF1ZW5jZSBlbGVtZW50cyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBzb3VyY2UgZWxlbWVudCB0byBhIHJlc3VsdCBlbGVtZW50LlxuICAgICAgICAqL1xuICAgICAgICBmbGF0TWFwPFRPdGhlciwgVFJlc3VsdD4oc2VsZWN0b3I6IF9WYWx1ZU9yU2VsZWN0b3I8VCwgT2JzZXJ2YWJsZU9yUHJvbWlzZTxUT3RoZXI+PiwgcmVzdWx0U2VsZWN0b3I6IHNwZWNpYWwuX0ZsYXRNYXBSZXN1bHRTZWxlY3RvcjxULCBUT3RoZXIsIFRSZXN1bHQ+LCB0aGlzQXJnPzogYW55KTogT2JzZXJ2YWJsZTxUUmVzdWx0PjtcbiAgICAgICAgLyoqXG4gICAgICAgICogIE9uZSBvZiB0aGUgRm9sbG93aW5nOlxuICAgICAgICAqICBQcm9qZWN0cyBlYWNoIGVsZW1lbnQgb2YgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGFuZCBtZXJnZXMgdGhlIHJlc3VsdGluZyBvYnNlcnZhYmxlIHNlcXVlbmNlcyBpbnRvIG9uZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqXG4gICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgKiAgdmFyIHJlcyA9IHNvdXJjZS5zZWxlY3RNYW55KGZ1bmN0aW9uICh4KSB7IHJldHVybiBSeC5PYnNlcnZhYmxlLnJhbmdlKDAsIHgpOyB9KTtcbiAgICAgICAgKiAgT3I6XG4gICAgICAgICogIFByb2plY3RzIGVhY2ggZWxlbWVudCBvZiBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRvIGFuIG9ic2VydmFibGUgc2VxdWVuY2UsIGludm9rZXMgdGhlIHJlc3VsdCBzZWxlY3RvciBmb3IgdGhlIHNvdXJjZSBlbGVtZW50IGFuZCBlYWNoIG9mIHRoZSBjb3JyZXNwb25kaW5nIGlubmVyIHNlcXVlbmNlJ3MgZWxlbWVudHMsIGFuZCBtZXJnZXMgdGhlIHJlc3VsdHMgaW50byBvbmUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKlxuICAgICAgICAqICB2YXIgcmVzID0gc291cmNlLnNlbGVjdE1hbnkoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIFJ4Lk9ic2VydmFibGUucmFuZ2UoMCwgeCk7IH0sIGZ1bmN0aW9uICh4LCB5KSB7IHJldHVybiB4ICsgeTsgfSk7XG4gICAgICAgICogIE9yOlxuICAgICAgICAqICBQcm9qZWN0cyBlYWNoIGVsZW1lbnQgb2YgdGhlIHNvdXJjZSBvYnNlcnZhYmxlIHNlcXVlbmNlIHRvIHRoZSBvdGhlciBvYnNlcnZhYmxlIHNlcXVlbmNlIGFuZCBtZXJnZXMgdGhlIHJlc3VsdGluZyBvYnNlcnZhYmxlIHNlcXVlbmNlcyBpbnRvIG9uZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqXG4gICAgICAgICogIHZhciByZXMgPSBzb3VyY2Uuc2VsZWN0TWFueShSeC5PYnNlcnZhYmxlLmZyb21BcnJheShbMSwyLDNdKSk7XG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gc2VsZWN0b3IgQSB0cmFuc2Zvcm0gZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBlbGVtZW50IG9yIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdG8gcHJvamVjdCBlYWNoIGVsZW1lbnQgZnJvbSB0aGUgc291cmNlIHNlcXVlbmNlIG9udG8gd2hpY2ggY291bGQgYmUgZWl0aGVyIGFuIG9ic2VydmFibGUgb3IgUHJvbWlzZS5cbiAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzdWx0U2VsZWN0b3JdICBBIHRyYW5zZm9ybSBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIGVsZW1lbnQgb2YgdGhlIGludGVybWVkaWF0ZSBzZXF1ZW5jZS5cbiAgICAgICAgKiBAcGFyYW0ge0FueX0gW3RoaXNBcmddIE9iamVjdCB0byB1c2UgYXMgdGhpcyB3aGVuIGV4ZWN1dGluZyBjYWxsYmFjay5cbiAgICAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB3aG9zZSBlbGVtZW50cyBhcmUgdGhlIHJlc3VsdCBvZiBpbnZva2luZyB0aGUgb25lLXRvLW1hbnkgdHJhbnNmb3JtIGZ1bmN0aW9uIGNvbGxlY3Rpb25TZWxlY3RvciBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlIGFuZCB0aGVuIG1hcHBpbmcgZWFjaCBvZiB0aG9zZSBzZXF1ZW5jZSBlbGVtZW50cyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBzb3VyY2UgZWxlbWVudCB0byBhIHJlc3VsdCBlbGVtZW50LlxuICAgICAgICAqL1xuICAgICAgICBmbGF0TWFwPFRPdGhlciwgVFJlc3VsdD4oc2VsZWN0b3I6IF9WYWx1ZU9yU2VsZWN0b3I8VCwgQXJyYXlPckl0ZXJhYmxlPFRPdGhlcj4+LCByZXN1bHRTZWxlY3Rvcjogc3BlY2lhbC5fRmxhdE1hcFJlc3VsdFNlbGVjdG9yPFQsIFRPdGhlciwgVFJlc3VsdD4sIHRoaXNBcmc/OiBhbnkpOiBPYnNlcnZhYmxlPFRSZXN1bHQ+O1xuICAgICAgICAvKipcbiAgICAgICAgKiAgT25lIG9mIHRoZSBGb2xsb3dpbmc6XG4gICAgICAgICogIFByb2plY3RzIGVhY2ggZWxlbWVudCBvZiBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRvIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgYW5kIG1lcmdlcyB0aGUgcmVzdWx0aW5nIG9ic2VydmFibGUgc2VxdWVuY2VzIGludG8gb25lIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICAgICpcbiAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAqICB2YXIgcmVzID0gc291cmNlLnNlbGVjdE1hbnkoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIFJ4Lk9ic2VydmFibGUucmFuZ2UoMCwgeCk7IH0pO1xuICAgICAgICAqICBPcjpcbiAgICAgICAgKiAgUHJvamVjdHMgZWFjaCBlbGVtZW50IG9mIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdG8gYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSwgaW52b2tlcyB0aGUgcmVzdWx0IHNlbGVjdG9yIGZvciB0aGUgc291cmNlIGVsZW1lbnQgYW5kIGVhY2ggb2YgdGhlIGNvcnJlc3BvbmRpbmcgaW5uZXIgc2VxdWVuY2UncyBlbGVtZW50cywgYW5kIG1lcmdlcyB0aGUgcmVzdWx0cyBpbnRvIG9uZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqXG4gICAgICAgICogIHZhciByZXMgPSBzb3VyY2Uuc2VsZWN0TWFueShmdW5jdGlvbiAoeCkgeyByZXR1cm4gUnguT2JzZXJ2YWJsZS5yYW5nZSgwLCB4KTsgfSwgZnVuY3Rpb24gKHgsIHkpIHsgcmV0dXJuIHggKyB5OyB9KTtcbiAgICAgICAgKiAgT3I6XG4gICAgICAgICogIFByb2plY3RzIGVhY2ggZWxlbWVudCBvZiB0aGUgc291cmNlIG9ic2VydmFibGUgc2VxdWVuY2UgdG8gdGhlIG90aGVyIG9ic2VydmFibGUgc2VxdWVuY2UgYW5kIG1lcmdlcyB0aGUgcmVzdWx0aW5nIG9ic2VydmFibGUgc2VxdWVuY2VzIGludG8gb25lIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICAgICpcbiAgICAgICAgKiAgdmFyIHJlcyA9IHNvdXJjZS5zZWxlY3RNYW55KFJ4Lk9ic2VydmFibGUuZnJvbUFycmF5KFsxLDIsM10pKTtcbiAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzZWxlY3RvciBBIHRyYW5zZm9ybSBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIGVsZW1lbnQgb3IgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byBwcm9qZWN0IGVhY2ggZWxlbWVudCBmcm9tIHRoZSBzb3VyY2Ugc2VxdWVuY2Ugb250byB3aGljaCBjb3VsZCBiZSBlaXRoZXIgYW4gb2JzZXJ2YWJsZSBvciBQcm9taXNlLlxuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtyZXN1bHRTZWxlY3Rvcl0gIEEgdHJhbnNmb3JtIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggZWxlbWVudCBvZiB0aGUgaW50ZXJtZWRpYXRlIHNlcXVlbmNlLlxuICAgICAgICAqIEBwYXJhbSB7QW55fSBbdGhpc0FyZ10gT2JqZWN0IHRvIHVzZSBhcyB0aGlzIHdoZW4gZXhlY3V0aW5nIGNhbGxiYWNrLlxuICAgICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHdob3NlIGVsZW1lbnRzIGFyZSB0aGUgcmVzdWx0IG9mIGludm9raW5nIHRoZSBvbmUtdG8tbWFueSB0cmFuc2Zvcm0gZnVuY3Rpb24gY29sbGVjdGlvblNlbGVjdG9yIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UgYW5kIHRoZW4gbWFwcGluZyBlYWNoIG9mIHRob3NlIHNlcXVlbmNlIGVsZW1lbnRzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIHNvdXJjZSBlbGVtZW50IHRvIGEgcmVzdWx0IGVsZW1lbnQuXG4gICAgICAgICovXG4gICAgICAgIHNlbGVjdE1hbnk8VFJlc3VsdD4oc2VsZWN0b3I6IF9WYWx1ZU9yU2VsZWN0b3I8VCwgT2JzZXJ2YWJsZU9yUHJvbWlzZTxUUmVzdWx0Pj4pOiBPYnNlcnZhYmxlPFRSZXN1bHQ+O1xuICAgICAgICAvKipcbiAgICAgICAgKiAgT25lIG9mIHRoZSBGb2xsb3dpbmc6XG4gICAgICAgICogIFByb2plY3RzIGVhY2ggZWxlbWVudCBvZiBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRvIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgYW5kIG1lcmdlcyB0aGUgcmVzdWx0aW5nIG9ic2VydmFibGUgc2VxdWVuY2VzIGludG8gb25lIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICAgICpcbiAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAqICB2YXIgcmVzID0gc291cmNlLnNlbGVjdE1hbnkoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIFJ4Lk9ic2VydmFibGUucmFuZ2UoMCwgeCk7IH0pO1xuICAgICAgICAqICBPcjpcbiAgICAgICAgKiAgUHJvamVjdHMgZWFjaCBlbGVtZW50IG9mIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdG8gYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSwgaW52b2tlcyB0aGUgcmVzdWx0IHNlbGVjdG9yIGZvciB0aGUgc291cmNlIGVsZW1lbnQgYW5kIGVhY2ggb2YgdGhlIGNvcnJlc3BvbmRpbmcgaW5uZXIgc2VxdWVuY2UncyBlbGVtZW50cywgYW5kIG1lcmdlcyB0aGUgcmVzdWx0cyBpbnRvIG9uZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqXG4gICAgICAgICogIHZhciByZXMgPSBzb3VyY2Uuc2VsZWN0TWFueShmdW5jdGlvbiAoeCkgeyByZXR1cm4gUnguT2JzZXJ2YWJsZS5yYW5nZSgwLCB4KTsgfSwgZnVuY3Rpb24gKHgsIHkpIHsgcmV0dXJuIHggKyB5OyB9KTtcbiAgICAgICAgKiAgT3I6XG4gICAgICAgICogIFByb2plY3RzIGVhY2ggZWxlbWVudCBvZiB0aGUgc291cmNlIG9ic2VydmFibGUgc2VxdWVuY2UgdG8gdGhlIG90aGVyIG9ic2VydmFibGUgc2VxdWVuY2UgYW5kIG1lcmdlcyB0aGUgcmVzdWx0aW5nIG9ic2VydmFibGUgc2VxdWVuY2VzIGludG8gb25lIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICAgICpcbiAgICAgICAgKiAgdmFyIHJlcyA9IHNvdXJjZS5zZWxlY3RNYW55KFJ4Lk9ic2VydmFibGUuZnJvbUFycmF5KFsxLDIsM10pKTtcbiAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzZWxlY3RvciBBIHRyYW5zZm9ybSBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIGVsZW1lbnQgb3IgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byBwcm9qZWN0IGVhY2ggZWxlbWVudCBmcm9tIHRoZSBzb3VyY2Ugc2VxdWVuY2Ugb250byB3aGljaCBjb3VsZCBiZSBlaXRoZXIgYW4gb2JzZXJ2YWJsZSBvciBQcm9taXNlLlxuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtyZXN1bHRTZWxlY3Rvcl0gIEEgdHJhbnNmb3JtIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggZWxlbWVudCBvZiB0aGUgaW50ZXJtZWRpYXRlIHNlcXVlbmNlLlxuICAgICAgICAqIEBwYXJhbSB7QW55fSBbdGhpc0FyZ10gT2JqZWN0IHRvIHVzZSBhcyB0aGlzIHdoZW4gZXhlY3V0aW5nIGNhbGxiYWNrLlxuICAgICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHdob3NlIGVsZW1lbnRzIGFyZSB0aGUgcmVzdWx0IG9mIGludm9raW5nIHRoZSBvbmUtdG8tbWFueSB0cmFuc2Zvcm0gZnVuY3Rpb24gY29sbGVjdGlvblNlbGVjdG9yIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UgYW5kIHRoZW4gbWFwcGluZyBlYWNoIG9mIHRob3NlIHNlcXVlbmNlIGVsZW1lbnRzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIHNvdXJjZSBlbGVtZW50IHRvIGEgcmVzdWx0IGVsZW1lbnQuXG4gICAgICAgICovXG4gICAgICAgIHNlbGVjdE1hbnk8VFJlc3VsdD4oc2VsZWN0b3I6IF9WYWx1ZU9yU2VsZWN0b3I8VCwgQXJyYXlPckl0ZXJhYmxlPFRSZXN1bHQ+Pik6IE9ic2VydmFibGU8VFJlc3VsdD47XG4gICAgICAgIC8qKlxuICAgICAgICAqICBPbmUgb2YgdGhlIEZvbGxvd2luZzpcbiAgICAgICAgKiAgUHJvamVjdHMgZWFjaCBlbGVtZW50IG9mIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdG8gYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBhbmQgbWVyZ2VzIHRoZSByZXN1bHRpbmcgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgaW50byBvbmUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKlxuICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICogIHZhciByZXMgPSBzb3VyY2Uuc2VsZWN0TWFueShmdW5jdGlvbiAoeCkgeyByZXR1cm4gUnguT2JzZXJ2YWJsZS5yYW5nZSgwLCB4KTsgfSk7XG4gICAgICAgICogIE9yOlxuICAgICAgICAqICBQcm9qZWN0cyBlYWNoIGVsZW1lbnQgb2YgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlLCBpbnZva2VzIHRoZSByZXN1bHQgc2VsZWN0b3IgZm9yIHRoZSBzb3VyY2UgZWxlbWVudCBhbmQgZWFjaCBvZiB0aGUgY29ycmVzcG9uZGluZyBpbm5lciBzZXF1ZW5jZSdzIGVsZW1lbnRzLCBhbmQgbWVyZ2VzIHRoZSByZXN1bHRzIGludG8gb25lIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICAgICpcbiAgICAgICAgKiAgdmFyIHJlcyA9IHNvdXJjZS5zZWxlY3RNYW55KGZ1bmN0aW9uICh4KSB7IHJldHVybiBSeC5PYnNlcnZhYmxlLnJhbmdlKDAsIHgpOyB9LCBmdW5jdGlvbiAoeCwgeSkgeyByZXR1cm4geCArIHk7IH0pO1xuICAgICAgICAqICBPcjpcbiAgICAgICAgKiAgUHJvamVjdHMgZWFjaCBlbGVtZW50IG9mIHRoZSBzb3VyY2Ugb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byB0aGUgb3RoZXIgb2JzZXJ2YWJsZSBzZXF1ZW5jZSBhbmQgbWVyZ2VzIHRoZSByZXN1bHRpbmcgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgaW50byBvbmUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKlxuICAgICAgICAqICB2YXIgcmVzID0gc291cmNlLnNlbGVjdE1hbnkoUnguT2JzZXJ2YWJsZS5mcm9tQXJyYXkoWzEsMiwzXSkpO1xuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHNlbGVjdG9yIEEgdHJhbnNmb3JtIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggZWxlbWVudCBvciBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRvIHByb2plY3QgZWFjaCBlbGVtZW50IGZyb20gdGhlIHNvdXJjZSBzZXF1ZW5jZSBvbnRvIHdoaWNoIGNvdWxkIGJlIGVpdGhlciBhbiBvYnNlcnZhYmxlIG9yIFByb21pc2UuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc3VsdFNlbGVjdG9yXSAgQSB0cmFuc2Zvcm0gZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnRlcm1lZGlhdGUgc2VxdWVuY2UuXG4gICAgICAgICogQHBhcmFtIHtBbnl9IFt0aGlzQXJnXSBPYmplY3QgdG8gdXNlIGFzIHRoaXMgd2hlbiBleGVjdXRpbmcgY2FsbGJhY2suXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2Ugd2hvc2UgZWxlbWVudHMgYXJlIHRoZSByZXN1bHQgb2YgaW52b2tpbmcgdGhlIG9uZS10by1tYW55IHRyYW5zZm9ybSBmdW5jdGlvbiBjb2xsZWN0aW9uU2VsZWN0b3Igb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZSBhbmQgdGhlbiBtYXBwaW5nIGVhY2ggb2YgdGhvc2Ugc2VxdWVuY2UgZWxlbWVudHMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgc291cmNlIGVsZW1lbnQgdG8gYSByZXN1bHQgZWxlbWVudC5cbiAgICAgICAgKi9cbiAgICAgICAgc2VsZWN0TWFueTxUT3RoZXIsIFRSZXN1bHQ+KHNlbGVjdG9yOiBfVmFsdWVPclNlbGVjdG9yPFQsIE9ic2VydmFibGVPclByb21pc2U8VE90aGVyPj4sIHJlc3VsdFNlbGVjdG9yOiBzcGVjaWFsLl9GbGF0TWFwUmVzdWx0U2VsZWN0b3I8VCwgVE90aGVyLCBUUmVzdWx0PiwgdGhpc0FyZz86IGFueSk6IE9ic2VydmFibGU8VFJlc3VsdD47XG4gICAgICAgIC8qKlxuICAgICAgICAqICBPbmUgb2YgdGhlIEZvbGxvd2luZzpcbiAgICAgICAgKiAgUHJvamVjdHMgZWFjaCBlbGVtZW50IG9mIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdG8gYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBhbmQgbWVyZ2VzIHRoZSByZXN1bHRpbmcgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgaW50byBvbmUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKlxuICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICogIHZhciByZXMgPSBzb3VyY2Uuc2VsZWN0TWFueShmdW5jdGlvbiAoeCkgeyByZXR1cm4gUnguT2JzZXJ2YWJsZS5yYW5nZSgwLCB4KTsgfSk7XG4gICAgICAgICogIE9yOlxuICAgICAgICAqICBQcm9qZWN0cyBlYWNoIGVsZW1lbnQgb2YgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlLCBpbnZva2VzIHRoZSByZXN1bHQgc2VsZWN0b3IgZm9yIHRoZSBzb3VyY2UgZWxlbWVudCBhbmQgZWFjaCBvZiB0aGUgY29ycmVzcG9uZGluZyBpbm5lciBzZXF1ZW5jZSdzIGVsZW1lbnRzLCBhbmQgbWVyZ2VzIHRoZSByZXN1bHRzIGludG8gb25lIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICAgICpcbiAgICAgICAgKiAgdmFyIHJlcyA9IHNvdXJjZS5zZWxlY3RNYW55KGZ1bmN0aW9uICh4KSB7IHJldHVybiBSeC5PYnNlcnZhYmxlLnJhbmdlKDAsIHgpOyB9LCBmdW5jdGlvbiAoeCwgeSkgeyByZXR1cm4geCArIHk7IH0pO1xuICAgICAgICAqICBPcjpcbiAgICAgICAgKiAgUHJvamVjdHMgZWFjaCBlbGVtZW50IG9mIHRoZSBzb3VyY2Ugb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byB0aGUgb3RoZXIgb2JzZXJ2YWJsZSBzZXF1ZW5jZSBhbmQgbWVyZ2VzIHRoZSByZXN1bHRpbmcgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgaW50byBvbmUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKlxuICAgICAgICAqICB2YXIgcmVzID0gc291cmNlLnNlbGVjdE1hbnkoUnguT2JzZXJ2YWJsZS5mcm9tQXJyYXkoWzEsMiwzXSkpO1xuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHNlbGVjdG9yIEEgdHJhbnNmb3JtIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggZWxlbWVudCBvciBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRvIHByb2plY3QgZWFjaCBlbGVtZW50IGZyb20gdGhlIHNvdXJjZSBzZXF1ZW5jZSBvbnRvIHdoaWNoIGNvdWxkIGJlIGVpdGhlciBhbiBvYnNlcnZhYmxlIG9yIFByb21pc2UuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc3VsdFNlbGVjdG9yXSAgQSB0cmFuc2Zvcm0gZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnRlcm1lZGlhdGUgc2VxdWVuY2UuXG4gICAgICAgICogQHBhcmFtIHtBbnl9IFt0aGlzQXJnXSBPYmplY3QgdG8gdXNlIGFzIHRoaXMgd2hlbiBleGVjdXRpbmcgY2FsbGJhY2suXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2Ugd2hvc2UgZWxlbWVudHMgYXJlIHRoZSByZXN1bHQgb2YgaW52b2tpbmcgdGhlIG9uZS10by1tYW55IHRyYW5zZm9ybSBmdW5jdGlvbiBjb2xsZWN0aW9uU2VsZWN0b3Igb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZSBhbmQgdGhlbiBtYXBwaW5nIGVhY2ggb2YgdGhvc2Ugc2VxdWVuY2UgZWxlbWVudHMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgc291cmNlIGVsZW1lbnQgdG8gYSByZXN1bHQgZWxlbWVudC5cbiAgICAgICAgKi9cbiAgICAgICAgc2VsZWN0TWFueTxUT3RoZXIsIFRSZXN1bHQ+KHNlbGVjdG9yOiBfVmFsdWVPclNlbGVjdG9yPFQsIEFycmF5T3JJdGVyYWJsZTxUT3RoZXI+PiwgcmVzdWx0U2VsZWN0b3I6IHNwZWNpYWwuX0ZsYXRNYXBSZXN1bHRTZWxlY3RvcjxULCBUT3RoZXIsIFRSZXN1bHQ+LCB0aGlzQXJnPzogYW55KTogT2JzZXJ2YWJsZTxUUmVzdWx0PjtcbiAgICB9XG59XG5cbihmdW5jdGlvbigpIHtcbiAgICB2YXIgbzogUnguT2JzZXJ2YWJsZTxzdHJpbmc+O1xuICAgIHZhciBuOiBSeC5PYnNlcnZhYmxlPG51bWJlcj47XG4gICAgbiA9IG8uZmxhdE1hcCh4ID0+IFJ4Lk9ic2VydmFibGUuZnJvbShbMSwgMiwgM10pKTtcbiAgICBuID0gby5mbGF0TWFwKHggPT4gUnguT2JzZXJ2YWJsZS5mcm9tKFsxLCAyLCAzXSkudG9Qcm9taXNlKCkpO1xuICAgIG4gPSBvLmZsYXRNYXAoeCA9PiBbMSwgMiwgM10pO1xuICAgIG4gPSBvLmZsYXRNYXAoKHgsIHosIGIpID0+IFJ4Lk9ic2VydmFibGUuZnJvbShbMSwgMiwgM10pLCAoeCwgeSwgYSwgYikgPT4geSk7XG4gICAgbiA9IG8uZmxhdE1hcCh4ID0+IFJ4Lk9ic2VydmFibGUuZnJvbShbMSwgMiwgM10pLnRvUHJvbWlzZSgpLCAoeCwgeSkgPT4geSk7XG4gICAgbiA9IG8uZmxhdE1hcCh4ID0+IFsxLCAyLCAzXSwgKHgsIHkpID0+IHkpO1xuICAgIG4gPSBvLmZsYXRNYXAoUnguT2JzZXJ2YWJsZS5mcm9tKFsxLCAyLCAzXSkpO1xuICAgIG4gPSBvLmZsYXRNYXAoUnguT2JzZXJ2YWJsZS5mcm9tKFsxLCAyLCAzXSkudG9Qcm9taXNlKCkpO1xuICAgIG4gPSBvLmZsYXRNYXAoWzEsIDIsIDNdKTtcbiAgICBuID0gby5mbGF0TWFwKFJ4Lk9ic2VydmFibGUuZnJvbShbMSwgMiwgM10pLCAoeCwgeSkgPT4geSk7XG4gICAgbiA9IG8uZmxhdE1hcChSeC5PYnNlcnZhYmxlLmZyb20oWzEsIDIsIDNdKS50b1Byb21pc2UoKSwgKHgsIHkpID0+IHkpO1xuICAgIG4gPSBvLmZsYXRNYXAoWzEsIDIsIDNdLCAoeCwgeSkgPT4geSk7XG5cbiAgICBuID0gby5zZWxlY3RNYW55KHggPT4gUnguT2JzZXJ2YWJsZS5mcm9tKFsxLCAyLCAzXSkpO1xuICAgIG4gPSBvLnNlbGVjdE1hbnkoeCA9PiBSeC5PYnNlcnZhYmxlLmZyb20oWzEsIDIsIDNdKS50b1Byb21pc2UoKSk7XG4gICAgbiA9IG8uc2VsZWN0TWFueSh4ID0+IFsxLCAyLCAzXSk7XG4gICAgbiA9IG8uc2VsZWN0TWFueSh4ID0+IFJ4Lk9ic2VydmFibGUuZnJvbShbMSwgMiwgM10pLCAoeCwgeSkgPT4geSk7XG4gICAgbiA9IG8uc2VsZWN0TWFueSh4ID0+IFJ4Lk9ic2VydmFibGUuZnJvbShbMSwgMiwgM10pLnRvUHJvbWlzZSgpLCAoeCwgeSkgPT4geSk7XG4gICAgbiA9IG8uc2VsZWN0TWFueSh4ID0+IFsxLCAyLCAzXSwgKHgsIHkpID0+IHkpO1xuICAgIG4gPSBvLnNlbGVjdE1hbnkoUnguT2JzZXJ2YWJsZS5mcm9tKFsxLCAyLCAzXSkpO1xuICAgIG4gPSBvLnNlbGVjdE1hbnkoUnguT2JzZXJ2YWJsZS5mcm9tKFsxLCAyLCAzXSkudG9Qcm9taXNlKCkpO1xuICAgIG4gPSBvLnNlbGVjdE1hbnkoWzEsIDIsIDNdKTtcbiAgICBuID0gby5zZWxlY3RNYW55KFJ4Lk9ic2VydmFibGUuZnJvbShbMSwgMiwgM10pLCAoeCwgeSkgPT4geSk7XG4gICAgbiA9IG8uc2VsZWN0TWFueShSeC5PYnNlcnZhYmxlLmZyb20oWzEsIDIsIDNdKS50b1Byb21pc2UoKSwgKHgsIHkpID0+IHkpO1xuICAgIG4gPSBvLnNlbGVjdE1hbnkoWzEsIDIsIDNdLCAoeCwgeSkgPT4geSk7XG59KTtcbiJdfQ==