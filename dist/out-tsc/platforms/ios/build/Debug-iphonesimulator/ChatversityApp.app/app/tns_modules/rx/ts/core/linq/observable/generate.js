/// <reference path="../../observable.ts" />
/// <reference path="../../concurrency/scheduler.ts" />
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4L3RzL2NvcmUvbGlucS9vYnNlcnZhYmxlL2dlbmVyYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDRDQUE0QztBQUM1Qyx1REFBdUQiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vb2JzZXJ2YWJsZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vY29uY3VycmVuY3kvc2NoZWR1bGVyLnRzXCIgLz5cbm1vZHVsZSBSeCB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBPYnNlcnZhYmxlU3RhdGljIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICBHZW5lcmF0ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBieSBydW5uaW5nIGEgc3RhdGUtZHJpdmVuIGxvb3AgcHJvZHVjaW5nIHRoZSBzZXF1ZW5jZSdzIGVsZW1lbnRzLCB1c2luZyB0aGUgc3BlY2lmaWVkIHNjaGVkdWxlciB0byBzZW5kIG91dCBvYnNlcnZlciBtZXNzYWdlcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogIHZhciByZXMgPSBSeC5PYnNlcnZhYmxlLmdlbmVyYXRlKDAsIGZ1bmN0aW9uICh4KSB7IHJldHVybiB4IDwgMTA7IH0sIGZ1bmN0aW9uICh4KSB7IHJldHVybiB4ICsgMTsgfSwgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHg7IH0pO1xuICAgICAgICAgKiAgdmFyIHJlcyA9IFJ4Lk9ic2VydmFibGUuZ2VuZXJhdGUoMCwgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHggPCAxMDsgfSwgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHggKyAxOyB9LCBmdW5jdGlvbiAoeCkgeyByZXR1cm4geDsgfSwgUnguU2NoZWR1bGVyLnRpbWVvdXQpO1xuICAgICAgICAgKiBAcGFyYW0ge01peGVkfSBpbml0aWFsU3RhdGUgSW5pdGlhbCBzdGF0ZS5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29uZGl0aW9uIENvbmRpdGlvbiB0byB0ZXJtaW5hdGUgZ2VuZXJhdGlvbiAodXBvbiByZXR1cm5pbmcgZmFsc2UpLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlIEl0ZXJhdGlvbiBzdGVwIGZ1bmN0aW9uLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXN1bHRTZWxlY3RvciBTZWxlY3RvciBmdW5jdGlvbiBmb3IgcmVzdWx0cyBwcm9kdWNlZCBpbiB0aGUgc2VxdWVuY2UuXG4gICAgICAgICAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSBTY2hlZHVsZXIgb24gd2hpY2ggdG8gcnVuIHRoZSBnZW5lcmF0b3IgbG9vcC4gSWYgbm90IHByb3ZpZGVkLCBkZWZhdWx0cyB0byBTY2hlZHVsZXIuY3VycmVudFRocmVhZC5cbiAgICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IFRoZSBnZW5lcmF0ZWQgc2VxdWVuY2UuXG4gICAgICAgICAqL1xuICAgICAgICBnZW5lcmF0ZTxUU3RhdGUsIFRSZXN1bHQ+KGluaXRpYWxTdGF0ZTogVFN0YXRlLCBjb25kaXRpb246IChzdGF0ZTogVFN0YXRlKSA9PiBib29sZWFuLCBpdGVyYXRlOiAoc3RhdGU6IFRTdGF0ZSkgPT4gVFN0YXRlLCByZXN1bHRTZWxlY3RvcjogKHN0YXRlOiBUU3RhdGUpID0+IFRSZXN1bHQsIHNjaGVkdWxlcj86IElTY2hlZHVsZXIpOiBPYnNlcnZhYmxlPFRSZXN1bHQ+O1xuICAgIH1cbn1cbiJdfQ==