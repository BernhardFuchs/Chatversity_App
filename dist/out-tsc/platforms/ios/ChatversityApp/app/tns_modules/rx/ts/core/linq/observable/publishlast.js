/// <reference path="./multicast.ts" />
(function () {
    var o;
    var oc;
    var is;
    var s;
    var a;
    oc = o.publishLast();
    o = o.publishLast(function (a) { return a.asObservable(); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGlzaGxhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9yeC90cy9jb3JlL2xpbnEvb2JzZXJ2YWJsZS9wdWJsaXNobGFzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1Q0FBdUM7QUErQnZDLENBQUM7SUFDRyxJQUFJLENBQXdCLENBQUM7SUFDN0IsSUFBSSxFQUFvQyxDQUFDO0lBQ3pDLElBQUksRUFBdUIsQ0FBQztJQUM1QixJQUFJLENBQXFCLENBQUM7SUFDMUIsSUFBSSxDQUF3QixDQUFDO0lBRTdCLEVBQUUsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsWUFBWSxFQUFFLEVBQWhCLENBQWdCLENBQUMsQ0FBQztBQUM3QyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL211bHRpY2FzdC50c1wiIC8+XG5tb2R1bGUgUngge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgT2JzZXJ2YWJsZTxUPiB7XG4gICAgICAgIC8qKlxuICAgICAgICAqIFJldHVybnMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IGlzIHRoZSByZXN1bHQgb2YgaW52b2tpbmcgdGhlIHNlbGVjdG9yIG9uIGEgY29ubmVjdGFibGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IHNoYXJlcyBhIHNpbmdsZSBzdWJzY3JpcHRpb24gdG8gdGhlIHVuZGVybHlpbmcgc2VxdWVuY2UgY29udGFpbmluZyBvbmx5IHRoZSBsYXN0IG5vdGlmaWNhdGlvbi5cbiAgICAgICAgKiBUaGlzIG9wZXJhdG9yIGlzIGEgc3BlY2lhbGl6YXRpb24gb2YgTXVsdGljYXN0IHVzaW5nIGEgQXN5bmNTdWJqZWN0LlxuICAgICAgICAqXG4gICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgKiB2YXIgcmVzID0gc291cmNlLnB1Ymxpc2hMYXN0KCk7XG4gICAgICAgICogdmFyIHJlcyA9IHNvdXJjZS5wdWJsaXNoTGFzdChmdW5jdGlvbiAoeCkgeyByZXR1cm4geDsgfSk7XG4gICAgICAgICpcbiAgICAgICAgKiBAcGFyYW0gc2VsZWN0b3IgW09wdGlvbmFsXSBTZWxlY3RvciBmdW5jdGlvbiB3aGljaCBjYW4gdXNlIHRoZSBtdWx0aWNhc3RlZCBzb3VyY2Ugc2VxdWVuY2UgYXMgbWFueSB0aW1lcyBhcyBuZWVkZWQsIHdpdGhvdXQgY2F1c2luZyBtdWx0aXBsZSBzdWJzY3JpcHRpb25zIHRvIHRoZSBzb3VyY2Ugc2VxdWVuY2UuIFN1YnNjcmliZXJzIHRvIHRoZSBnaXZlbiBzb3VyY2Ugd2lsbCBvbmx5IHJlY2VpdmUgdGhlIGxhc3Qgbm90aWZpY2F0aW9uIG9mIHRoZSBzb3VyY2UuXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBjb250YWlucyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBwcm9kdWNlZCBieSBtdWx0aWNhc3RpbmcgdGhlIHNvdXJjZSBzZXF1ZW5jZSB3aXRoaW4gYSBzZWxlY3RvciBmdW5jdGlvbi5cbiAgICAgICAgKi9cbiAgICAgICAgcHVibGlzaExhc3QoKTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+O1xuICAgICAgICAvKipcbiAgICAgICAgKiBSZXR1cm5zIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBpcyB0aGUgcmVzdWx0IG9mIGludm9raW5nIHRoZSBzZWxlY3RvciBvbiBhIGNvbm5lY3RhYmxlIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBzaGFyZXMgYSBzaW5nbGUgc3Vic2NyaXB0aW9uIHRvIHRoZSB1bmRlcmx5aW5nIHNlcXVlbmNlIGNvbnRhaW5pbmcgb25seSB0aGUgbGFzdCBub3RpZmljYXRpb24uXG4gICAgICAgICogVGhpcyBvcGVyYXRvciBpcyBhIHNwZWNpYWxpemF0aW9uIG9mIE11bHRpY2FzdCB1c2luZyBhIEFzeW5jU3ViamVjdC5cbiAgICAgICAgKlxuICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICogdmFyIHJlcyA9IHNvdXJjZS5wdWJsaXNoTGFzdCgpO1xuICAgICAgICAqIHZhciByZXMgPSBzb3VyY2UucHVibGlzaExhc3QoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHg7IH0pO1xuICAgICAgICAqXG4gICAgICAgICogQHBhcmFtIHNlbGVjdG9yIFtPcHRpb25hbF0gU2VsZWN0b3IgZnVuY3Rpb24gd2hpY2ggY2FuIHVzZSB0aGUgbXVsdGljYXN0ZWQgc291cmNlIHNlcXVlbmNlIGFzIG1hbnkgdGltZXMgYXMgbmVlZGVkLCB3aXRob3V0IGNhdXNpbmcgbXVsdGlwbGUgc3Vic2NyaXB0aW9ucyB0byB0aGUgc291cmNlIHNlcXVlbmNlLiBTdWJzY3JpYmVycyB0byB0aGUgZ2l2ZW4gc291cmNlIHdpbGwgb25seSByZWNlaXZlIHRoZSBsYXN0IG5vdGlmaWNhdGlvbiBvZiB0aGUgc291cmNlLlxuICAgICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgcHJvZHVjZWQgYnkgbXVsdGljYXN0aW5nIHRoZSBzb3VyY2Ugc2VxdWVuY2Ugd2l0aGluIGEgc2VsZWN0b3IgZnVuY3Rpb24uXG4gICAgICAgICovXG4gICAgICAgIHB1Ymxpc2hMYXN0PFRSZXN1bHQ+KHNlbGVjdG9yOiAoc291cmNlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4pID0+IE9ic2VydmFibGU8VFJlc3VsdD4pOiBPYnNlcnZhYmxlPFRSZXN1bHQ+O1xuICAgIH1cbn1cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIG86IFJ4Lk9ic2VydmFibGU8bnVtYmVyPjtcbiAgICB2YXIgb2M6IFJ4LkNvbm5lY3RhYmxlT2JzZXJ2YWJsZTxudW1iZXI+O1xuICAgIHZhciBpczogUnguSVN1YmplY3Q8bnVtYmVyPjtcbiAgICB2YXIgczogUnguU3ViamVjdDxudW1iZXI+O1xuICAgIHZhciBhOiBSeC5PYnNlcnZhYmxlPHN0cmluZz47XG5cbiAgICBvYyA9IG8ucHVibGlzaExhc3QoKTtcbiAgICBvID0gby5wdWJsaXNoTGFzdChhID0+IGEuYXNPYnNlcnZhYmxlKCkpO1xufSk7XG4iXX0=