/// <reference path="../../observable.ts"/>
(function () {
    var o;
    var o2;
    var o3;
    var o4;
    o = Rx.Observable.toAsync(function () { return 'abc'; });
    o2 = Rx.Observable.toAsync(function (a) { return 'abc'; });
    o3 = Rx.Observable.toAsync(function (a, b) { return 'abc'; });
    o4 = Rx.Observable.toAsync(function (a, b, c) { return 'abc'; });
    o = Rx.Observable.toAsync(function () { return 'abc'; }, {}, Rx.Scheduler.async);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL3J4L3RzL2NvcmUvbGlucS9vYnNlcnZhYmxlL3RvYXN5bmMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkNBQTJDO0FBK0MzQyxDQUFDO0lBQ0csSUFBSSxDQUE4QixDQUFDO0lBQ25DLElBQUksRUFBcUMsQ0FBQztJQUMxQyxJQUFJLEVBQTZDLENBQUM7SUFDbEQsSUFBSSxFQUFxRCxDQUFDO0lBQzFELENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxjQUFNLE9BQUEsS0FBSyxFQUFMLENBQUssQ0FBQyxDQUFDO0lBQ3ZDLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLEtBQUssRUFBTCxDQUFLLENBQUMsQ0FBQztJQUN6QyxFQUFFLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsS0FBSyxFQUFMLENBQUssQ0FBQyxDQUFDO0lBQzVDLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsS0FBSyxFQUFMLENBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxjQUFNLE9BQUEsS0FBSyxFQUFMLENBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUVuRSxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9vYnNlcnZhYmxlLnRzXCIvPlxubW9kdWxlIFJ4IHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIE9ic2VydmFibGVTdGF0aWMge1xuICAgICAgICAvKipcbiAgICAgICAgKiBDb252ZXJ0cyB0aGUgZnVuY3Rpb24gaW50byBhbiBhc3luY2hyb25vdXMgZnVuY3Rpb24uIEVhY2ggaW52b2NhdGlvbiBvZiB0aGUgcmVzdWx0aW5nIGFzeW5jaHJvbm91cyBmdW5jdGlvbiBjYXVzZXMgYW4gaW52b2NhdGlvbiBvZiB0aGUgb3JpZ2luYWwgc3luY2hyb25vdXMgZnVuY3Rpb24gb24gdGhlIHNwZWNpZmllZCBzY2hlZHVsZXIuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY3Rpb24gRnVuY3Rpb24gdG8gY29udmVydCB0byBhbiBhc3luY2hyb25vdXMgZnVuY3Rpb24uXG4gICAgICAgICogQHBhcmFtIHtTY2hlZHVsZXJ9IFtzY2hlZHVsZXJdIFNjaGVkdWxlciB0byBydW4gdGhlIGZ1bmN0aW9uIG9uLiBJZiBub3Qgc3BlY2lmaWVkLCBkZWZhdWx0cyB0byBTY2hlZHVsZXIudGltZW91dC5cbiAgICAgICAgKiBAcGFyYW0ge01peGVkfSBbY29udGV4dF0gVGhlIGNvbnRleHQgZm9yIHRoZSBmdW5jIHBhcmFtZXRlciB0byBiZSBleGVjdXRlZC4gIElmIG5vdCBzcGVjaWZpZWQsIGRlZmF1bHRzIHRvIHVuZGVmaW5lZC5cbiAgICAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IEFzeW5jaHJvbm91cyBmdW5jdGlvbi5cbiAgICAgICAgKi9cbiAgICAgICAgdG9Bc3luYzxUUmVzdWx0PihmdW5jOiAoKSA9PiBUUmVzdWx0LCBjb250ZXh0PzogYW55LCBzY2hlZHVsZXI/OiBJU2NoZWR1bGVyKTogKCkgPT4gT2JzZXJ2YWJsZTxUUmVzdWx0PjtcbiAgICAgICAgLyoqXG4gICAgICAgICogQ29udmVydHMgdGhlIGZ1bmN0aW9uIGludG8gYW4gYXN5bmNocm9ub3VzIGZ1bmN0aW9uLiBFYWNoIGludm9jYXRpb24gb2YgdGhlIHJlc3VsdGluZyBhc3luY2hyb25vdXMgZnVuY3Rpb24gY2F1c2VzIGFuIGludm9jYXRpb24gb2YgdGhlIG9yaWdpbmFsIHN5bmNocm9ub3VzIGZ1bmN0aW9uIG9uIHRoZSBzcGVjaWZpZWQgc2NoZWR1bGVyLlxuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmN0aW9uIEZ1bmN0aW9uIHRvIGNvbnZlcnQgdG8gYW4gYXN5bmNocm9ub3VzIGZ1bmN0aW9uLlxuICAgICAgICAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSBTY2hlZHVsZXIgdG8gcnVuIHRoZSBmdW5jdGlvbiBvbi4gSWYgbm90IHNwZWNpZmllZCwgZGVmYXVsdHMgdG8gU2NoZWR1bGVyLnRpbWVvdXQuXG4gICAgICAgICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHRdIFRoZSBjb250ZXh0IGZvciB0aGUgZnVuYyBwYXJhbWV0ZXIgdG8gYmUgZXhlY3V0ZWQuICBJZiBub3Qgc3BlY2lmaWVkLCBkZWZhdWx0cyB0byB1bmRlZmluZWQuXG4gICAgICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBBc3luY2hyb25vdXMgZnVuY3Rpb24uXG4gICAgICAgICovXG4gICAgICAgIHRvQXN5bmM8VDEsIFRSZXN1bHQ+KGZ1bmM6IChhcmcxOiBUMSkgPT4gVFJlc3VsdCwgY29udGV4dD86IGFueSwgc2NoZWR1bGVyPzogSVNjaGVkdWxlcik6IChhcmcxOiBUMSkgPT4gT2JzZXJ2YWJsZTxUUmVzdWx0PjtcbiAgICAgICAgLyoqXG4gICAgICAgICogQ29udmVydHMgdGhlIGZ1bmN0aW9uIGludG8gYW4gYXN5bmNocm9ub3VzIGZ1bmN0aW9uLiBFYWNoIGludm9jYXRpb24gb2YgdGhlIHJlc3VsdGluZyBhc3luY2hyb25vdXMgZnVuY3Rpb24gY2F1c2VzIGFuIGludm9jYXRpb24gb2YgdGhlIG9yaWdpbmFsIHN5bmNocm9ub3VzIGZ1bmN0aW9uIG9uIHRoZSBzcGVjaWZpZWQgc2NoZWR1bGVyLlxuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmN0aW9uIEZ1bmN0aW9uIHRvIGNvbnZlcnQgdG8gYW4gYXN5bmNocm9ub3VzIGZ1bmN0aW9uLlxuICAgICAgICAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSBTY2hlZHVsZXIgdG8gcnVuIHRoZSBmdW5jdGlvbiBvbi4gSWYgbm90IHNwZWNpZmllZCwgZGVmYXVsdHMgdG8gU2NoZWR1bGVyLnRpbWVvdXQuXG4gICAgICAgICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHRdIFRoZSBjb250ZXh0IGZvciB0aGUgZnVuYyBwYXJhbWV0ZXIgdG8gYmUgZXhlY3V0ZWQuICBJZiBub3Qgc3BlY2lmaWVkLCBkZWZhdWx0cyB0byB1bmRlZmluZWQuXG4gICAgICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBBc3luY2hyb25vdXMgZnVuY3Rpb24uXG4gICAgICAgICovXG4gICAgICAgIHRvQXN5bmM8VDEsIFQyLCBUUmVzdWx0PihmdW5jOiAoYXJnMTogVDEsIGFyZzI6IFQyKSA9PiBUUmVzdWx0LCBjb250ZXh0PzogYW55LCBzY2hlZHVsZXI/OiBJU2NoZWR1bGVyKTogKGFyZzE6IFQxLCBhcmcyOiBUMikgPT4gT2JzZXJ2YWJsZTxUUmVzdWx0PjtcbiAgICAgICAgLyoqXG4gICAgICAgICogQ29udmVydHMgdGhlIGZ1bmN0aW9uIGludG8gYW4gYXN5bmNocm9ub3VzIGZ1bmN0aW9uLiBFYWNoIGludm9jYXRpb24gb2YgdGhlIHJlc3VsdGluZyBhc3luY2hyb25vdXMgZnVuY3Rpb24gY2F1c2VzIGFuIGludm9jYXRpb24gb2YgdGhlIG9yaWdpbmFsIHN5bmNocm9ub3VzIGZ1bmN0aW9uIG9uIHRoZSBzcGVjaWZpZWQgc2NoZWR1bGVyLlxuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmN0aW9uIEZ1bmN0aW9uIHRvIGNvbnZlcnQgdG8gYW4gYXN5bmNocm9ub3VzIGZ1bmN0aW9uLlxuICAgICAgICAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSBTY2hlZHVsZXIgdG8gcnVuIHRoZSBmdW5jdGlvbiBvbi4gSWYgbm90IHNwZWNpZmllZCwgZGVmYXVsdHMgdG8gU2NoZWR1bGVyLnRpbWVvdXQuXG4gICAgICAgICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHRdIFRoZSBjb250ZXh0IGZvciB0aGUgZnVuYyBwYXJhbWV0ZXIgdG8gYmUgZXhlY3V0ZWQuICBJZiBub3Qgc3BlY2lmaWVkLCBkZWZhdWx0cyB0byB1bmRlZmluZWQuXG4gICAgICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBBc3luY2hyb25vdXMgZnVuY3Rpb24uXG4gICAgICAgICovXG4gICAgICAgIHRvQXN5bmM8VDEsIFQyLCBUMywgVFJlc3VsdD4oZnVuYzogKGFyZzE6IFQxLCBhcmcyOiBUMiwgYXJnMzogVDMpID0+IFRSZXN1bHQsIGNvbnRleHQ/OiBhbnksIHNjaGVkdWxlcj86IElTY2hlZHVsZXIpOiAoYXJnMTogVDEsIGFyZzI6IFQyLCBhcmczOiBUMykgPT4gT2JzZXJ2YWJsZTxUUmVzdWx0PjtcbiAgICAgICAgLyoqXG4gICAgICAgICogQ29udmVydHMgdGhlIGZ1bmN0aW9uIGludG8gYW4gYXN5bmNocm9ub3VzIGZ1bmN0aW9uLiBFYWNoIGludm9jYXRpb24gb2YgdGhlIHJlc3VsdGluZyBhc3luY2hyb25vdXMgZnVuY3Rpb24gY2F1c2VzIGFuIGludm9jYXRpb24gb2YgdGhlIG9yaWdpbmFsIHN5bmNocm9ub3VzIGZ1bmN0aW9uIG9uIHRoZSBzcGVjaWZpZWQgc2NoZWR1bGVyLlxuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmN0aW9uIEZ1bmN0aW9uIHRvIGNvbnZlcnQgdG8gYW4gYXN5bmNocm9ub3VzIGZ1bmN0aW9uLlxuICAgICAgICAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSBTY2hlZHVsZXIgdG8gcnVuIHRoZSBmdW5jdGlvbiBvbi4gSWYgbm90IHNwZWNpZmllZCwgZGVmYXVsdHMgdG8gU2NoZWR1bGVyLnRpbWVvdXQuXG4gICAgICAgICogQHBhcmFtIHtNaXhlZH0gW2NvbnRleHRdIFRoZSBjb250ZXh0IGZvciB0aGUgZnVuYyBwYXJhbWV0ZXIgdG8gYmUgZXhlY3V0ZWQuICBJZiBub3Qgc3BlY2lmaWVkLCBkZWZhdWx0cyB0byB1bmRlZmluZWQuXG4gICAgICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBBc3luY2hyb25vdXMgZnVuY3Rpb24uXG4gICAgICAgICovXG4gICAgICAgIHRvQXN5bmM8VDEsIFQyLCBUMywgVDQsIFRSZXN1bHQ+KGZ1bmM6IChhcmcxOiBUMSwgYXJnMjogVDIsIGFyZzM6IFQzLCBhcmc0OiBUNCkgPT4gVFJlc3VsdCwgY29udGV4dD86IGFueSwgc2NoZWR1bGVyPzogSVNjaGVkdWxlcik6IChhcmcxOiBUMSwgYXJnMjogVDIsIGFyZzM6IFQzLCBhcmc0OiBUNCkgPT4gT2JzZXJ2YWJsZTxUUmVzdWx0PjtcbiAgICB9XG59XG5cblxuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBvOiAoKSA9PiBSeC5PYnNlcnZhYmxlPHN0cmluZz47XG4gICAgdmFyIG8yOiAoYTogYW55KSA9PiBSeC5PYnNlcnZhYmxlPHN0cmluZz47XG4gICAgdmFyIG8zOiAoYTogYW55LCBiOiBhbnkpID0+IFJ4Lk9ic2VydmFibGU8c3RyaW5nPjtcbiAgICB2YXIgbzQ6IChhOiBhbnksIGI6IGFueSwgYzogYW55KSA9PiBSeC5PYnNlcnZhYmxlPHN0cmluZz47XG4gICAgbyA9IFJ4Lk9ic2VydmFibGUudG9Bc3luYygoKSA9PiAnYWJjJyk7XG4gICAgbzIgPSBSeC5PYnNlcnZhYmxlLnRvQXN5bmMoKGEpID0+ICdhYmMnKTtcbiAgICBvMyA9IFJ4Lk9ic2VydmFibGUudG9Bc3luYygoYSwgYikgPT4gJ2FiYycpO1xuICAgIG80ID0gUnguT2JzZXJ2YWJsZS50b0FzeW5jKChhLCBiLCBjKSA9PiAnYWJjJyk7XG4gICAgbyA9IFJ4Lk9ic2VydmFibGUudG9Bc3luYygoKSA9PiAnYWJjJywge30sIFJ4LlNjaGVkdWxlci5hc3luYyk7XG5cbn0pO1xuIl19