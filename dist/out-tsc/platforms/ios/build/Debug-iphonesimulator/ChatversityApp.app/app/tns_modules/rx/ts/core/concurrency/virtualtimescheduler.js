/// <reference path="../disposables/disposable.ts" />
/// <reference path="./scheduler.ts" />
/// <reference path="./scheduleditem.ts" />
(function () {
    var vts;
    var b = vts.isEnabled;
    var a = vts.add(100, 500);
    var n = vts.toAbsoluteTime(1000);
    var r = vts.toRelativeTime(1000);
    var d = vts.start();
    vts.stop();
    vts.advanceTo(null);
    vts.advanceBy(null);
    vts.sleep(null);
    var i = vts.getNext();
    b = vts.isEnabled;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbHRpbWVzY2hlZHVsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4L3RzL2NvcmUvY29uY3VycmVuY3kvdmlydHVhbHRpbWVzY2hlZHVsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscURBQXFEO0FBQ3JELHVDQUF1QztBQUN2QywyQ0FBMkM7QUErRDNDLENBQUM7SUFHRyxJQUFJLEdBQW9DLENBQUM7SUFFekMsSUFBSSxDQUFDLEdBQVksR0FBRyxDQUFDLFNBQVMsQ0FBQztJQUMvQixJQUFJLENBQUMsR0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM5QixJQUFJLENBQUMsR0FBVyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLElBQUksQ0FBQyxHQUFPLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsSUFBSSxDQUFDLEdBQW1CLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNwQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDWCxHQUFHLENBQUMsU0FBUyxDQUFLLElBQUksQ0FBQyxDQUFDO0lBQ3hCLEdBQUcsQ0FBQyxTQUFTLENBQUssSUFBSSxDQUFDLENBQUM7SUFDeEIsR0FBRyxDQUFDLEtBQUssQ0FBSyxJQUFJLENBQUMsQ0FBQztJQUNwQixJQUFJLENBQUMsR0FBbUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3RELENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO0FBQ3RCLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2Rpc3Bvc2FibGVzL2Rpc3Bvc2FibGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vc2NoZWR1bGVyLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3NjaGVkdWxlZGl0ZW0udHNcIiAvPlxubW9kdWxlIFJ4IHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIFZpcnR1YWxUaW1lU2NoZWR1bGVyPFRBYnNvbHV0ZSwgVFJlbGF0aXZlPiBleHRlbmRzIElTY2hlZHVsZXIge1xuICAgICAgICAvKipcbiAgICAgICAgICogQWRkcyBhIHJlbGF0aXZlIHRpbWUgdmFsdWUgdG8gYW4gYWJzb2x1dGUgdGltZSB2YWx1ZS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGFic29sdXRlIEFic29sdXRlIHZpcnR1YWwgdGltZSB2YWx1ZS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHJlbGF0aXZlIFJlbGF0aXZlIHZpcnR1YWwgdGltZSB2YWx1ZSB0byBhZGQuXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn0gUmVzdWx0aW5nIGFic29sdXRlIHZpcnR1YWwgdGltZSBzdW0gdmFsdWUuXG4gICAgICAgICAqL1xuICAgICAgICBhZGQoZnJvbTogVEFic29sdXRlLCBieTogVFJlbGF0aXZlKTogVEFic29sdXRlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb252ZXJ0cyBhbiBhYnNvbHV0ZSB0aW1lIHRvIGEgbnVtYmVyXG4gICAgICAgICAqIEBwYXJhbSB7QW55fSBUaGUgYWJzb2x1dGUgdGltZS5cbiAgICAgICAgICogQHJldHVybnMge051bWJlcn0gVGhlIGFic29sdXRlIHRpbWUgaW4gbXNcbiAgICAgICAgICovXG4gICAgICAgIHRvQWJzb2x1dGVUaW1lKGR1ZXRpbWU6IFRBYnNvbHV0ZSk6IG51bWJlcjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29udmVydHMgdGhlIFRpbWVTcGFuIHZhbHVlIHRvIGEgcmVsYXRpdmUgdmlydHVhbCB0aW1lIHZhbHVlLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gdGltZVNwYW4gVGltZVNwYW4gdmFsdWUgdG8gY29udmVydC5cbiAgICAgICAgICogQHJldHVybiB7TnVtYmVyfSBDb3JyZXNwb25kaW5nIHJlbGF0aXZlIHZpcnR1YWwgdGltZSB2YWx1ZS5cbiAgICAgICAgICovXG4gICAgICAgIHRvUmVsYXRpdmVUaW1lKGR1ZXRpbWU6IG51bWJlcik6IFRSZWxhdGl2ZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU3RhcnRzIHRoZSB2aXJ0dWFsIHRpbWUgc2NoZWR1bGVyLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhcnQoKTogSURpc3Bvc2FibGU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFN0b3BzIHRoZSB2aXJ0dWFsIHRpbWUgc2NoZWR1bGVyLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RvcCgpOiB2b2lkO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZHZhbmNlcyB0aGUgc2NoZWR1bGVyJ3MgY2xvY2sgdG8gdGhlIHNwZWNpZmllZCB0aW1lLCBydW5uaW5nIGFsbCB3b3JrIHRpbGwgdGhhdCBwb2ludC5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgQWJzb2x1dGUgdGltZSB0byBhZHZhbmNlIHRoZSBzY2hlZHVsZXIncyBjbG9jayB0by5cbiAgICAgICAgICovXG4gICAgICAgIGFkdmFuY2VUbyh0aW1lOiBUQWJzb2x1dGUpOiB2b2lkO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZHZhbmNlcyB0aGUgc2NoZWR1bGVyJ3MgY2xvY2sgYnkgdGhlIHNwZWNpZmllZCByZWxhdGl2ZSB0aW1lLCBydW5uaW5nIGFsbCB3b3JrIHNjaGVkdWxlZCBmb3IgdGhhdCB0aW1lc3Bhbi5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgUmVsYXRpdmUgdGltZSB0byBhZHZhbmNlIHRoZSBzY2hlZHVsZXIncyBjbG9jayBieS5cbiAgICAgICAgICovXG4gICAgICAgIGFkdmFuY2VCeSh0aW1lOiBUUmVsYXRpdmUpOiB2b2lkO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZHZhbmNlcyB0aGUgc2NoZWR1bGVyJ3MgY2xvY2sgYnkgdGhlIHNwZWNpZmllZCByZWxhdGl2ZSB0aW1lLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSBSZWxhdGl2ZSB0aW1lIHRvIGFkdmFuY2UgdGhlIHNjaGVkdWxlcidzIGNsb2NrIGJ5LlxuICAgICAgICAgKi9cbiAgICAgICAgc2xlZXAodGltZTogVFJlbGF0aXZlKTogdm9pZDtcblxuICAgICAgICBpc0VuYWJsZWQ6IGJvb2xlYW47XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgdGhlIG5leHQgc2NoZWR1bGVkIGl0ZW0gdG8gYmUgZXhlY3V0ZWQuXG4gICAgICAgICAqIEByZXR1cm5zIHtTY2hlZHVsZWRJdGVtfSBUaGUgbmV4dCBzY2hlZHVsZWQgaXRlbS5cbiAgICAgICAgICovXG4gICAgICAgIGdldE5leHQoKTogaW50ZXJuYWxzLlNjaGVkdWxlZEl0ZW08VEFic29sdXRlPjtcbiAgICB9XG59XG5cbihmdW5jdGlvbigpIHtcbiAgICBpbnRlcmZhY2UgVEEgeyB9XG4gICAgaW50ZXJmYWNlIFRSIHsgfVxuICAgIHZhciB2dHM6IFJ4LlZpcnR1YWxUaW1lU2NoZWR1bGVyPFRBLCBUUj47XG5cbiAgICB2YXIgYjogYm9vbGVhbiA9IHZ0cy5pc0VuYWJsZWQ7XG4gICAgdmFyIGE6IFRBID0gdnRzLmFkZCgxMDAsIDUwMCk7XG4gICAgdmFyIG46IG51bWJlciA9IHZ0cy50b0Fic29sdXRlVGltZSgxMDAwKTtcbiAgICB2YXIgcjogVFIgPSB2dHMudG9SZWxhdGl2ZVRpbWUoMTAwMCk7XG4gICAgdmFyIGQ6IFJ4LklEaXNwb3NhYmxlID0gdnRzLnN0YXJ0KCk7XG4gICAgdnRzLnN0b3AoKTtcbiAgICB2dHMuYWR2YW5jZVRvKDxUQT5udWxsKTtcbiAgICB2dHMuYWR2YW5jZUJ5KDxUUj5udWxsKTtcbiAgICB2dHMuc2xlZXAoPFRSPm51bGwpO1xuICAgIHZhciBpOiBSeC5pbnRlcm5hbHMuU2NoZWR1bGVkSXRlbTxUQT4gPSB2dHMuZ2V0TmV4dCgpO1xuICAgIGIgPSB2dHMuaXNFbmFibGVkO1xufSlcbiJdfQ==