/// <reference path="../../observable.ts" />
/// <reference path="../../concurrency/scheduler.ts" />
(function () {
    var o;
    o.delay(1000);
    o.delay(new Date());
    o.delay(1000, Rx.Scheduler.async);
    o.delay(new Date(), Rx.Scheduler.async);
    o.delay(function (x) { return Rx.Observable.timer(x.length); });
    o.delay(Rx.Observable.timer(1000), function (x) { return Rx.Observable.timer(x.length); });
    o.delay(function (x) { return Rx.Observable.timer(x.length).toPromise(); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9yeC90cy9jb3JlL2xpbnEvb2JzZXJ2YWJsZS9kZWxheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0Q0FBNEM7QUFDNUMsdURBQXVEO0FBOER2RCxDQUFDO0lBQ0csSUFBSSxDQUF3QixDQUFDO0lBQzdCLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDZCxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNwQixDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXhDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQTdCLENBQTZCLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUE3QixDQUE2QixDQUFDLENBQUM7SUFDdkUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDO0FBQzVELENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL29ic2VydmFibGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2NvbmN1cnJlbmN5L3NjaGVkdWxlci50c1wiIC8+XG5tb2R1bGUgUngge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgT2JzZXJ2YWJsZTxUPiB7XG4gICAgICAgIC8qKlxuICAgICAgICAqICBUaW1lIHNoaWZ0cyB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSBieSBkdWVUaW1lLiBUaGUgcmVsYXRpdmUgdGltZSBpbnRlcnZhbHMgYmV0d2VlbiB0aGUgdmFsdWVzIGFyZSBwcmVzZXJ2ZWQuXG4gICAgICAgICpcbiAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAqICAxIC0gcmVzID0gUnguT2JzZXJ2YWJsZS5kZWxheShuZXcgRGF0ZSgpKTtcbiAgICAgICAgKiAgMiAtIHJlcyA9IFJ4Lk9ic2VydmFibGUuZGVsYXkobmV3IERhdGUoKSwgUnguU2NoZWR1bGVyLnRpbWVvdXQpO1xuICAgICAgICAqXG4gICAgICAgICogIDMgLSByZXMgPSBSeC5PYnNlcnZhYmxlLmRlbGF5KDUwMDApO1xuICAgICAgICAqICA0IC0gcmVzID0gUnguT2JzZXJ2YWJsZS5kZWxheSg1MDAwLCAxMDAwLCBSeC5TY2hlZHVsZXIudGltZW91dCk7XG4gICAgICAgICogQG1lbWJlck9mIE9ic2VydmFibGUjXG4gICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1ZVRpbWUgQWJzb2x1dGUgKHNwZWNpZmllZCBhcyBhIERhdGUgb2JqZWN0KSBvciByZWxhdGl2ZSB0aW1lIChzcGVjaWZpZWQgYXMgYW4gaW50ZWdlciBkZW5vdGluZyBtaWxsaXNlY29uZHMpIGJ5IHdoaWNoIHRvIHNoaWZ0IHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSBTY2hlZHVsZXIgdG8gcnVuIHRoZSBkZWxheSB0aW1lcnMgb24uIElmIG5vdCBzcGVjaWZpZWQsIHRoZSB0aW1lb3V0IHNjaGVkdWxlciBpcyB1c2VkLlxuICAgICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaW1lLXNoaWZ0ZWQgc2VxdWVuY2UuXG4gICAgICAgICovXG4gICAgICAgIGRlbGF5KGR1ZVRpbWU6IERhdGUsIHNjaGVkdWxlcj86IElTY2hlZHVsZXIpOiBPYnNlcnZhYmxlPFQ+O1xuICAgICAgICAvKipcbiAgICAgICAgKiAgVGltZSBzaGlmdHMgdGhlIG9ic2VydmFibGUgc2VxdWVuY2UgYnkgZHVlVGltZS4gVGhlIHJlbGF0aXZlIHRpbWUgaW50ZXJ2YWxzIGJldHdlZW4gdGhlIHZhbHVlcyBhcmUgcHJlc2VydmVkLlxuICAgICAgICAqXG4gICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgKiAgMSAtIHJlcyA9IFJ4Lk9ic2VydmFibGUuZGVsYXkobmV3IERhdGUoKSk7XG4gICAgICAgICogIDIgLSByZXMgPSBSeC5PYnNlcnZhYmxlLmRlbGF5KG5ldyBEYXRlKCksIFJ4LlNjaGVkdWxlci50aW1lb3V0KTtcbiAgICAgICAgKlxuICAgICAgICAqICAzIC0gcmVzID0gUnguT2JzZXJ2YWJsZS5kZWxheSg1MDAwKTtcbiAgICAgICAgKiAgNCAtIHJlcyA9IFJ4Lk9ic2VydmFibGUuZGVsYXkoNTAwMCwgMTAwMCwgUnguU2NoZWR1bGVyLnRpbWVvdXQpO1xuICAgICAgICAqIEBtZW1iZXJPZiBPYnNlcnZhYmxlI1xuICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdWVUaW1lIEFic29sdXRlIChzcGVjaWZpZWQgYXMgYSBEYXRlIG9iamVjdCkgb3IgcmVsYXRpdmUgdGltZSAoc3BlY2lmaWVkIGFzIGFuIGludGVnZXIgZGVub3RpbmcgbWlsbGlzZWNvbmRzKSBieSB3aGljaCB0byBzaGlmdCB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKiBAcGFyYW0ge1NjaGVkdWxlcn0gW3NjaGVkdWxlcl0gU2NoZWR1bGVyIHRvIHJ1biB0aGUgZGVsYXkgdGltZXJzIG9uLiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgdGltZW91dCBzY2hlZHVsZXIgaXMgdXNlZC5cbiAgICAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gVGltZS1zaGlmdGVkIHNlcXVlbmNlLlxuICAgICAgICAqL1xuICAgICAgICBkZWxheShkdWVUaW1lOiBudW1iZXIsIHNjaGVkdWxlcj86IElTY2hlZHVsZXIpOiBPYnNlcnZhYmxlPFQ+O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAqICBUaW1lIHNoaWZ0cyB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSBiYXNlZCBvbiBhIHN1YnNjcmlwdGlvbiBkZWxheSBhbmQgYSBkZWxheSBzZWxlY3RvciBmdW5jdGlvbiBmb3IgZWFjaCBlbGVtZW50LlxuICAgICAgICAqXG4gICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgKiAgMSAtIHJlcyA9IHNvdXJjZS5kZWxheVdpdGhTZWxlY3RvcihmdW5jdGlvbiAoeCkgeyByZXR1cm4gUnguU2NoZWR1bGVyLnRpbWVyKDUwMDApOyB9KTsgLy8gd2l0aCBzZWxlY3RvciBvbmx5XG4gICAgICAgICogIDEgLSByZXMgPSBzb3VyY2UuZGVsYXlXaXRoU2VsZWN0b3IoUnguT2JzZXJ2YWJsZS50aW1lcigyMDAwKSwgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIFJ4Lk9ic2VydmFibGUudGltZXIoeCk7IH0pOyAvLyB3aXRoIGRlbGF5IGFuZCBzZWxlY3RvclxuICAgICAgICAqXG4gICAgICAgICogQHBhcmFtIHtPYnNlcnZhYmxlfSBbc3Vic2NyaXB0aW9uRGVsYXldICBTZXF1ZW5jZSBpbmRpY2F0aW5nIHRoZSBkZWxheSBmb3IgdGhlIHN1YnNjcmlwdGlvbiB0byB0aGUgc291cmNlLlxuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGRlbGF5RHVyYXRpb25TZWxlY3RvciBTZWxlY3RvciBmdW5jdGlvbiB0byByZXRyaWV2ZSBhIHNlcXVlbmNlIGluZGljYXRpbmcgdGhlIGRlbGF5IGZvciBlYWNoIGdpdmVuIGVsZW1lbnQuXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IFRpbWUtc2hpZnRlZCBzZXF1ZW5jZS5cbiAgICAgICAgKi9cbiAgICAgICAgZGVsYXkoZGVsYXlEdXJhdGlvblNlbGVjdG9yOiAoaXRlbTogVCkgPT4gT2JzZXJ2YWJsZU9yUHJvbWlzZTxudW1iZXI+KTogT2JzZXJ2YWJsZTxUPjtcblxuICAgICAgICAvKipcbiAgICAgICAgKiAgVGltZSBzaGlmdHMgdGhlIG9ic2VydmFibGUgc2VxdWVuY2UgYmFzZWQgb24gYSBzdWJzY3JpcHRpb24gZGVsYXkgYW5kIGEgZGVsYXkgc2VsZWN0b3IgZnVuY3Rpb24gZm9yIGVhY2ggZWxlbWVudC5cbiAgICAgICAgKlxuICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICogIDEgLSByZXMgPSBzb3VyY2UuZGVsYXlXaXRoU2VsZWN0b3IoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIFJ4LlNjaGVkdWxlci50aW1lcig1MDAwKTsgfSk7IC8vIHdpdGggc2VsZWN0b3Igb25seVxuICAgICAgICAqICAxIC0gcmVzID0gc291cmNlLmRlbGF5V2l0aFNlbGVjdG9yKFJ4Lk9ic2VydmFibGUudGltZXIoMjAwMCksIGZ1bmN0aW9uICh4KSB7IHJldHVybiBSeC5PYnNlcnZhYmxlLnRpbWVyKHgpOyB9KTsgLy8gd2l0aCBkZWxheSBhbmQgc2VsZWN0b3JcbiAgICAgICAgKlxuICAgICAgICAqIEBwYXJhbSB7T2JzZXJ2YWJsZX0gW3N1YnNjcmlwdGlvbkRlbGF5XSAgU2VxdWVuY2UgaW5kaWNhdGluZyB0aGUgZGVsYXkgZm9yIHRoZSBzdWJzY3JpcHRpb24gdG8gdGhlIHNvdXJjZS5cbiAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBkZWxheUR1cmF0aW9uU2VsZWN0b3IgU2VsZWN0b3IgZnVuY3Rpb24gdG8gcmV0cmlldmUgYSBzZXF1ZW5jZSBpbmRpY2F0aW5nIHRoZSBkZWxheSBmb3IgZWFjaCBnaXZlbiBlbGVtZW50LlxuICAgICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaW1lLXNoaWZ0ZWQgc2VxdWVuY2UuXG4gICAgICAgICovXG4gICAgICAgIGRlbGF5KHN1YnNjcmlwdGlvbkRlbGF5OiBPYnNlcnZhYmxlPG51bWJlcj4sIGRlbGF5RHVyYXRpb25TZWxlY3RvcjogKGl0ZW06IFQpID0+IE9ic2VydmFibGVPclByb21pc2U8bnVtYmVyPik6IE9ic2VydmFibGU8VD47XG4gICAgfVxufVxuXG4oZnVuY3Rpb24gKCkge1xuICAgIHZhciBvOiBSeC5PYnNlcnZhYmxlPHN0cmluZz47XG4gICAgby5kZWxheSgxMDAwKTtcbiAgICBvLmRlbGF5KG5ldyBEYXRlKCkpO1xuICAgIG8uZGVsYXkoMTAwMCwgUnguU2NoZWR1bGVyLmFzeW5jKTtcbiAgICBvLmRlbGF5KG5ldyBEYXRlKCksIFJ4LlNjaGVkdWxlci5hc3luYyk7XG5cbiAgICBvLmRlbGF5KHggPT4gUnguT2JzZXJ2YWJsZS50aW1lcih4Lmxlbmd0aCkpO1xuICAgIG8uZGVsYXkoUnguT2JzZXJ2YWJsZS50aW1lcigxMDAwKSwgeCA9PiBSeC5PYnNlcnZhYmxlLnRpbWVyKHgubGVuZ3RoKSk7XG4gICAgby5kZWxheSh4ID0+IFJ4Lk9ic2VydmFibGUudGltZXIoeC5sZW5ndGgpLnRvUHJvbWlzZSgpKTtcbn0pO1xuIl19