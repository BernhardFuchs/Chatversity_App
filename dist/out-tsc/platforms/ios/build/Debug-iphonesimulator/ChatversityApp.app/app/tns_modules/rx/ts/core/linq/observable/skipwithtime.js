/// <reference path="../../observable.ts"/>
/// <reference path="../../concurrency/scheduler.ts" />
(function () {
    var o;
    o = o.skipWithTime(1);
    o = o.skipWithTime(100, Rx.Scheduler.default);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tpcHdpdGh0aW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9yeC90cy9jb3JlL2xpbnEvb2JzZXJ2YWJsZS9za2lwd2l0aHRpbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkNBQTJDO0FBQzNDLHVEQUF1RDtBQXVCdkQsQ0FBQztJQUNHLElBQUksQ0FBd0IsQ0FBQztJQUM3QixDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0QixDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNsRCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9vYnNlcnZhYmxlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2NvbmN1cnJlbmN5L3NjaGVkdWxlci50c1wiIC8+XG5tb2R1bGUgUngge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgT2JzZXJ2YWJsZTxUPiB7XG4gICAgICAgIC8qKlxuICAgICAgICAqICBTa2lwcyBlbGVtZW50cyBmb3IgdGhlIHNwZWNpZmllZCBkdXJhdGlvbiBmcm9tIHRoZSBzdGFydCBvZiB0aGUgb2JzZXJ2YWJsZSBzb3VyY2Ugc2VxdWVuY2UsIHVzaW5nIHRoZSBzcGVjaWZpZWQgc2NoZWR1bGVyIHRvIHJ1biB0aW1lcnMuXG4gICAgICAgICpcbiAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAqICAxIC0gcmVzID0gc291cmNlLnNraXBXaXRoVGltZSg1MDAwLCBbb3B0aW9uYWwgc2NoZWR1bGVyXSk7XG4gICAgICAgICpcbiAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgKiAgU3BlY2lmeWluZyBhIHplcm8gdmFsdWUgZm9yIGR1cmF0aW9uIGRvZXNuJ3QgZ3VhcmFudGVlIG5vIGVsZW1lbnRzIHdpbGwgYmUgZHJvcHBlZCBmcm9tIHRoZSBzdGFydCBvZiB0aGUgc291cmNlIHNlcXVlbmNlLlxuICAgICAgICAqICBUaGlzIGlzIGEgc2lkZS1lZmZlY3Qgb2YgdGhlIGFzeW5jaHJvbnkgaW50cm9kdWNlZCBieSB0aGUgc2NoZWR1bGVyLCB3aGVyZSB0aGUgYWN0aW9uIHRoYXQgY2F1c2VzIGNhbGxiYWNrcyBmcm9tIHRoZSBzb3VyY2Ugc2VxdWVuY2UgdG8gYmUgZm9yd2FyZGVkXG4gICAgICAgICogIG1heSBub3QgZXhlY3V0ZSBpbW1lZGlhdGVseSwgZGVzcGl0ZSB0aGUgemVybyBkdWUgdGltZS5cbiAgICAgICAgKlxuICAgICAgICAqICBFcnJvcnMgcHJvZHVjZWQgYnkgdGhlIHNvdXJjZSBzZXF1ZW5jZSBhcmUgYWx3YXlzIGZvcndhcmRlZCB0byB0aGUgcmVzdWx0IHNlcXVlbmNlLCBldmVuIGlmIHRoZSBlcnJvciBvY2N1cnMgYmVmb3JlIHRoZSBkdXJhdGlvbi5cbiAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gRHVyYXRpb24gZm9yIHNraXBwaW5nIGVsZW1lbnRzIGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBzZXF1ZW5jZS5cbiAgICAgICAgKiBAcGFyYW0ge1NjaGVkdWxlcn0gc2NoZWR1bGVyIFNjaGVkdWxlciB0byBydW4gdGhlIHRpbWVyIG9uLiBJZiBub3Qgc3BlY2lmaWVkLCBkZWZhdWx0cyB0byBSeC5TY2hlZHVsZXIudGltZW91dC5cbiAgICAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB3aXRoIHRoZSBlbGVtZW50cyBza2lwcGVkIGR1cmluZyB0aGUgc3BlY2lmaWVkIGR1cmF0aW9uIGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBzb3VyY2Ugc2VxdWVuY2UuXG4gICAgICAgICovXG4gICAgICAgIHNraXBXaXRoVGltZShkdXJhdGlvbjogbnVtYmVyLCBzY2hlZHVsZXI/OiBJU2NoZWR1bGVyKTogT2JzZXJ2YWJsZTxUPjtcbiAgICB9XG59XG5cbihmdW5jdGlvbigpIHtcbiAgICB2YXIgbzogUnguT2JzZXJ2YWJsZTxudW1iZXI+O1xuICAgIG8gPSBvLnNraXBXaXRoVGltZSgxKTtcbiAgICBvID0gby5za2lwV2l0aFRpbWUoMTAwLCBSeC5TY2hlZHVsZXIuZGVmYXVsdCk7XG59KTtcbiJdfQ==