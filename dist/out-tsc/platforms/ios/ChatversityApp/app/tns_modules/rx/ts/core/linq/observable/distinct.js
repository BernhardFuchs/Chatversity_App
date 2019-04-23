/// <reference path="../../observable.ts" />
(function () {
    var o;
    o = o.distinct();
    o = o.distinct(function (x) { return x.length; });
    o = o.distinct(function (x) { return x.length; }, function (x) { return x.toString() + '' + x; });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdGluY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9yeC90cy9jb3JlL2xpbnEvb2JzZXJ2YWJsZS9kaXN0aW5jdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0Q0FBNEM7QUFtQjVDLENBQUM7SUFDRyxJQUFJLENBQXlCLENBQUM7SUFDOUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqQixDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxNQUFNLEVBQVIsQ0FBUSxDQUFDLENBQUM7SUFDOUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxFQUFSLENBQVEsRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFyQixDQUFxQixDQUFDLENBQUM7QUFDOUQsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vb2JzZXJ2YWJsZS50c1wiIC8+XG5tb2R1bGUgUngge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgT2JzZXJ2YWJsZTxUPiB7XG4gICAgICAgIC8qKlxuICAgICAgICAqICBSZXR1cm5zIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBjb250YWlucyBvbmx5IGRpc3RpbmN0IGVsZW1lbnRzIGFjY29yZGluZyB0byB0aGUga2V5U2VsZWN0b3IgYW5kIHRoZSBjb21wYXJlci5cbiAgICAgICAgKiAgVXNhZ2Ugb2YgdGhpcyBvcGVyYXRvciBzaG91bGQgYmUgY29uc2lkZXJlZCBjYXJlZnVsbHkgZHVlIHRvIHRoZSBtYWludGVuYW5jZSBvZiBhbiBpbnRlcm5hbCBsb29rdXAgc3RydWN0dXJlIHdoaWNoIGNhbiBncm93IGxhcmdlLlxuICAgICAgICAqXG4gICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgKiAgdmFyIHJlcyA9IG9icyA9IHhzLmRpc3RpbmN0KCk7XG4gICAgICAgICogIDIgLSBvYnMgPSB4cy5kaXN0aW5jdChmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5pZDsgfSk7XG4gICAgICAgICogIDIgLSBvYnMgPSB4cy5kaXN0aW5jdChmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5pZDsgfSwgZnVuY3Rpb24gKGEsYikgeyByZXR1cm4gYSA9PT0gYjsgfSk7XG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2tleVNlbGVjdG9yXSAgQSBmdW5jdGlvbiB0byBjb21wdXRlIHRoZSBjb21wYXJpc29uIGtleSBmb3IgZWFjaCBlbGVtZW50LlxuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJlcl0gIFVzZWQgdG8gY29tcGFyZSBpdGVtcyBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBvbmx5IGNvbnRhaW5pbmcgdGhlIGRpc3RpbmN0IGVsZW1lbnRzLCBiYXNlZCBvbiBhIGNvbXB1dGVkIGtleSB2YWx1ZSwgZnJvbSB0aGUgc291cmNlIHNlcXVlbmNlLlxuICAgICAgICAqL1xuICAgICAgICBkaXN0aW5jdDxUS2V5PihrZXlTZWxlY3Rvcj86ICh2YWx1ZTogVCkgPT4gVEtleSwga2V5U2VyaWFsaXplcj86IChrZXk6IFRLZXkpID0+IHN0cmluZyk6IE9ic2VydmFibGU8VD47XG4gICAgfVxufVxuXG4oZnVuY3Rpb24gKCkge1xuICAgIHZhciBvIDogUnguT2JzZXJ2YWJsZTxzdHJpbmc+O1xuICAgIG8gPSBvLmRpc3RpbmN0KCk7XG4gICAgbyA9IG8uZGlzdGluY3QoeCA9PiB4Lmxlbmd0aCk7XG4gICAgbyA9IG8uZGlzdGluY3QoeCA9PiB4Lmxlbmd0aCwgeCA9PiB4LnRvU3RyaW5nKCkgKyAnJyArIHgpO1xufSk7XG4iXX0=