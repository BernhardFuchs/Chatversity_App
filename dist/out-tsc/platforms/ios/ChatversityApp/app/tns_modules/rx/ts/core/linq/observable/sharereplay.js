/// <reference path="./multicast.ts" />
(function () {
    var o;
    var oc;
    var is;
    var s;
    var a;
    o = o.shareReplay();
    o = o.shareReplay(1);
    o = o.shareReplay(1, 2);
    o = o.shareReplay(1, 2, Rx.Scheduler.default);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVyZXBsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9yeC90cy9jb3JlL2xpbnEvb2JzZXJ2YWJsZS9zaGFyZXJlcGxheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1Q0FBdUM7QUFzQnZDLENBQUM7SUFDRyxJQUFJLENBQXdCLENBQUM7SUFDN0IsSUFBSSxFQUFvQyxDQUFDO0lBQ3pDLElBQUksRUFBdUIsQ0FBQztJQUM1QixJQUFJLENBQXFCLENBQUM7SUFDMUIsSUFBSSxDQUF3QixDQUFDO0lBRTdCLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDcEIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL211bHRpY2FzdC50c1wiIC8+XG5tb2R1bGUgUngge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgT2JzZXJ2YWJsZTxUPiB7XG4gICAgICAgIC8qKlxuICAgICAgICAqIFJldHVybnMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IHNoYXJlcyBhIHNpbmdsZSBzdWJzY3JpcHRpb24gdG8gdGhlIHVuZGVybHlpbmcgc2VxdWVuY2UgcmVwbGF5aW5nIG5vdGlmaWNhdGlvbnMgc3ViamVjdCB0byBhIG1heGltdW0gdGltZSBsZW5ndGggZm9yIHRoZSByZXBsYXkgYnVmZmVyLlxuICAgICAgICAqIFRoaXMgb3BlcmF0b3IgaXMgYSBzcGVjaWFsaXphdGlvbiBvZiByZXBsYXkgd2hpY2ggY3JlYXRlcyBhIHN1YnNjcmlwdGlvbiB3aGVuIHRoZSBudW1iZXIgb2Ygb2JzZXJ2ZXJzIGdvZXMgZnJvbSB6ZXJvIHRvIG9uZSwgdGhlbiBzaGFyZXMgdGhhdCBzdWJzY3JpcHRpb24gd2l0aCBhbGwgc3Vic2VxdWVudCBvYnNlcnZlcnMgdW50aWwgdGhlIG51bWJlciBvZiBvYnNlcnZlcnMgcmV0dXJucyB0byB6ZXJvLCBhdCB3aGljaCBwb2ludCB0aGUgc3Vic2NyaXB0aW9uIGlzIGRpc3Bvc2VkLlxuICAgICAgICAqXG4gICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgKiB2YXIgcmVzID0gc291cmNlLnNoYXJlUmVwbGF5KDMpO1xuICAgICAgICAqIHZhciByZXMgPSBzb3VyY2Uuc2hhcmVSZXBsYXkoMywgNTAwKTtcbiAgICAgICAgKiB2YXIgcmVzID0gc291cmNlLnNoYXJlUmVwbGF5KDMsIDUwMCwgc2NoZWR1bGVyKTtcbiAgICAgICAgKlxuXG4gICAgICAgICogQHBhcmFtIGJ1ZmZlclNpemUgW09wdGlvbmFsXSBNYXhpbXVtIGVsZW1lbnQgY291bnQgb2YgdGhlIHJlcGxheSBidWZmZXIuXG4gICAgICAgICogQHBhcmFtIHdpbmRvdyBbT3B0aW9uYWxdIE1heGltdW0gdGltZSBsZW5ndGggb2YgdGhlIHJlcGxheSBidWZmZXIuXG4gICAgICAgICogQHBhcmFtIHNjaGVkdWxlciBbT3B0aW9uYWxdIFNjaGVkdWxlciB3aGVyZSBjb25uZWN0ZWQgb2JzZXJ2ZXJzIHdpdGhpbiB0aGUgc2VsZWN0b3IgZnVuY3Rpb24gd2lsbCBiZSBpbnZva2VkIG9uLlxuICAgICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgcHJvZHVjZWQgYnkgbXVsdGljYXN0aW5nIHRoZSBzb3VyY2Ugc2VxdWVuY2UuXG4gICAgICAgICovXG4gICAgICAgIHNoYXJlUmVwbGF5KGJ1ZmZlclNpemU/OiBudW1iZXIsIHdpbmRvdz86IG51bWJlciwgc2NoZWR1bGVyPzogSVNjaGVkdWxlcik6IE9ic2VydmFibGU8VD47XG4gICAgfVxufVxuXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIG86IFJ4Lk9ic2VydmFibGU8bnVtYmVyPjtcbiAgICB2YXIgb2M6IFJ4LkNvbm5lY3RhYmxlT2JzZXJ2YWJsZTxudW1iZXI+O1xuICAgIHZhciBpczogUnguSVN1YmplY3Q8bnVtYmVyPjtcbiAgICB2YXIgczogUnguU3ViamVjdDxudW1iZXI+O1xuICAgIHZhciBhOiBSeC5PYnNlcnZhYmxlPHN0cmluZz47XG5cbiAgICBvID0gby5zaGFyZVJlcGxheSgpO1xuICAgIG8gPSBvLnNoYXJlUmVwbGF5KDEpO1xuICAgIG8gPSBvLnNoYXJlUmVwbGF5KDEsMik7XG4gICAgbyA9IG8uc2hhcmVSZXBsYXkoMSwyLCBSeC5TY2hlZHVsZXIuZGVmYXVsdCk7XG59KTtcbiJdfQ==