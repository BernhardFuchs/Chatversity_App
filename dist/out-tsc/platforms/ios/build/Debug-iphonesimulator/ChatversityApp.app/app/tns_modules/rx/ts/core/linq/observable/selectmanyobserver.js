/// <reference path="../../observable.ts"/>
(function () {
    var os;
    var on;
    os.flatMapObserver(function (v, i) { return Rx.Observable.just(i); }, function (e) { return Rx.Observable.just(e); }, function () { return Rx.Observable.empty(); });
    os.selectManyObserver(function (v, i) { return Rx.Observable.just(i); }, function (e) { return Rx.Observable.just(e); }, function () { return Rx.Observable.empty(); });
    os.flatMapObserver(function (v, i) { return Rx.Observable.just(i); }, function (e) { return Rx.Observable.just(e); }, function () { return Rx.Observable.empty(); }, {});
    os.selectManyObserver(function (v, i) { return Rx.Observable.just(i); }, function (e) { return Rx.Observable.just(e); }, function () { return Rx.Observable.empty(); }, {});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0bWFueW9ic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9yeC90cy9jb3JlL2xpbnEvb2JzZXJ2YWJsZS9zZWxlY3RtYW55b2JzZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkNBQTJDO0FBeUIzQyxDQUFDO0lBQ0csSUFBSSxFQUF5QixDQUFDO0lBQzlCLElBQUksRUFBeUIsQ0FBQztJQUU5QixFQUFFLENBQUMsZUFBZSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFyQixDQUFxQixFQUFFLFVBQUMsQ0FBQyxJQUFLLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQXJCLENBQXFCLEVBQUUsY0FBTSxPQUFBLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEVBQXJCLENBQXFCLENBQUMsQ0FBQztJQUMvRyxFQUFFLENBQUMsa0JBQWtCLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQXJCLENBQXFCLEVBQUUsVUFBQyxDQUFDLElBQUssT0FBQSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBckIsQ0FBcUIsRUFBRSxjQUFNLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO0lBRWxILEVBQUUsQ0FBQyxlQUFlLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQXJCLENBQXFCLEVBQUUsVUFBQyxDQUFDLElBQUssT0FBQSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBckIsQ0FBcUIsRUFBRSxjQUFNLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsRUFBckIsQ0FBcUIsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNuSCxFQUFFLENBQUMsa0JBQWtCLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQXJCLENBQXFCLEVBQUUsVUFBQyxDQUFDLElBQUssT0FBQSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBckIsQ0FBcUIsRUFBRSxjQUFNLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsRUFBckIsQ0FBcUIsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMxSCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9vYnNlcnZhYmxlLnRzXCIvPlxubW9kdWxlIFJ4IHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIE9ic2VydmFibGU8VD4ge1xuICAgICAgICAvKipcbiAgICAgICAgKiBQcm9qZWN0cyBlYWNoIG5vdGlmaWNhdGlvbiBvZiBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRvIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgYW5kIG1lcmdlcyB0aGUgcmVzdWx0aW5nIG9ic2VydmFibGUgc2VxdWVuY2VzIGludG8gb25lIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25OZXh0IEEgdHJhbnNmb3JtIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggZWxlbWVudDsgdGhlIHNlY29uZCBwYXJhbWV0ZXIgb2YgdGhlIGZ1bmN0aW9uIHJlcHJlc2VudHMgdGhlIGluZGV4IG9mIHRoZSBzb3VyY2UgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkVycm9yIEEgdHJhbnNmb3JtIGZ1bmN0aW9uIHRvIGFwcGx5IHdoZW4gYW4gZXJyb3Igb2NjdXJzIGluIHRoZSBzb3VyY2Ugc2VxdWVuY2UuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25Db21wbGV0ZWQgQSB0cmFuc2Zvcm0gZnVuY3Rpb24gdG8gYXBwbHkgd2hlbiB0aGUgZW5kIG9mIHRoZSBzb3VyY2Ugc2VxdWVuY2UgaXMgcmVhY2hlZC5cbiAgICAgICAgKiBAcGFyYW0ge0FueX0gW3RoaXNBcmddIEFuIG9wdGlvbmFsIFwidGhpc1wiIHRvIHVzZSB0byBpbnZva2UgZWFjaCB0cmFuc2Zvcm0uXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2Ugd2hvc2UgZWxlbWVudHMgYXJlIHRoZSByZXN1bHQgb2YgaW52b2tpbmcgdGhlIG9uZS10by1tYW55IHRyYW5zZm9ybSBmdW5jdGlvbiBjb3JyZXNwb25kaW5nIHRvIGVhY2ggbm90aWZpY2F0aW9uIGluIHRoZSBpbnB1dCBzZXF1ZW5jZS5cbiAgICAgICAgKi9cbiAgICAgICAgc2VsZWN0TWFueU9ic2VydmVyPFQyLCBUMywgVDQ+KG9uTmV4dDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlPFQyPiwgb25FcnJvcjogKGV4Y2VwdGlvbjogYW55KSA9PiBPYnNlcnZhYmxlPFQzPiwgb25Db21wbGV0ZWQ6ICgpID0+IE9ic2VydmFibGU8VDQ+LCB0aGlzQXJnPzogYW55KTogT2JzZXJ2YWJsZTxUMiB8IFQzIHwgVDQ+O1xuICAgICAgICAvKipcbiAgICAgICAgKiBQcm9qZWN0cyBlYWNoIG5vdGlmaWNhdGlvbiBvZiBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRvIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgYW5kIG1lcmdlcyB0aGUgcmVzdWx0aW5nIG9ic2VydmFibGUgc2VxdWVuY2VzIGludG8gb25lIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25OZXh0IEEgdHJhbnNmb3JtIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggZWxlbWVudDsgdGhlIHNlY29uZCBwYXJhbWV0ZXIgb2YgdGhlIGZ1bmN0aW9uIHJlcHJlc2VudHMgdGhlIGluZGV4IG9mIHRoZSBzb3VyY2UgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkVycm9yIEEgdHJhbnNmb3JtIGZ1bmN0aW9uIHRvIGFwcGx5IHdoZW4gYW4gZXJyb3Igb2NjdXJzIGluIHRoZSBzb3VyY2Ugc2VxdWVuY2UuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25Db21wbGV0ZWQgQSB0cmFuc2Zvcm0gZnVuY3Rpb24gdG8gYXBwbHkgd2hlbiB0aGUgZW5kIG9mIHRoZSBzb3VyY2Ugc2VxdWVuY2UgaXMgcmVhY2hlZC5cbiAgICAgICAgKiBAcGFyYW0ge0FueX0gW3RoaXNBcmddIEFuIG9wdGlvbmFsIFwidGhpc1wiIHRvIHVzZSB0byBpbnZva2UgZWFjaCB0cmFuc2Zvcm0uXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2Ugd2hvc2UgZWxlbWVudHMgYXJlIHRoZSByZXN1bHQgb2YgaW52b2tpbmcgdGhlIG9uZS10by1tYW55IHRyYW5zZm9ybSBmdW5jdGlvbiBjb3JyZXNwb25kaW5nIHRvIGVhY2ggbm90aWZpY2F0aW9uIGluIHRoZSBpbnB1dCBzZXF1ZW5jZS5cbiAgICAgICAgKi9cbiAgICAgICAgZmxhdE1hcE9ic2VydmVyPFQyLCBUMywgVDQ+KG9uTmV4dDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlPFQyPiwgb25FcnJvcjogKGV4Y2VwdGlvbjogYW55KSA9PiBPYnNlcnZhYmxlPFQzPiwgb25Db21wbGV0ZWQ6ICgpID0+IE9ic2VydmFibGU8VDQ+LCB0aGlzQXJnPzogYW55KTogT2JzZXJ2YWJsZTxUMiB8IFQzIHwgVDQ+O1xuICAgIH1cbn1cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9zOiBSeC5PYnNlcnZhYmxlPHN0cmluZz47XG4gICAgdmFyIG9uOiBSeC5PYnNlcnZhYmxlPG51bWJlcj47XG5cbiAgICBvcy5mbGF0TWFwT2JzZXJ2ZXIoKHYsIGkpID0+IFJ4Lk9ic2VydmFibGUuanVzdChpKSwgKGUpID0+IFJ4Lk9ic2VydmFibGUuanVzdChlKSwgKCkgPT4gUnguT2JzZXJ2YWJsZS5lbXB0eSgpKTtcbiAgICBvcy5zZWxlY3RNYW55T2JzZXJ2ZXIoKHYsIGkpID0+IFJ4Lk9ic2VydmFibGUuanVzdChpKSwgKGUpID0+IFJ4Lk9ic2VydmFibGUuanVzdChlKSwgKCkgPT4gUnguT2JzZXJ2YWJsZS5lbXB0eSgpKTtcblxuICAgIG9zLmZsYXRNYXBPYnNlcnZlcigodiwgaSkgPT4gUnguT2JzZXJ2YWJsZS5qdXN0KGkpLCAoZSkgPT4gUnguT2JzZXJ2YWJsZS5qdXN0KGUpLCAoKSA9PiBSeC5PYnNlcnZhYmxlLmVtcHR5KCksIHt9KTtcbiAgICBvcy5zZWxlY3RNYW55T2JzZXJ2ZXIoKHYsIGkpID0+IFJ4Lk9ic2VydmFibGUuanVzdChpKSwgKGUpID0+IFJ4Lk9ic2VydmFibGUuanVzdChlKSwgKCkgPT4gUnguT2JzZXJ2YWJsZS5lbXB0eSgpLCB7fSk7XG59KTtcbiJdfQ==