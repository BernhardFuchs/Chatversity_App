/// <reference path="../../observable.ts" />
/// <reference path="../../observer-lite.ts" />
(function () {
    var o;
    var or;
    o.do(or);
    o.tap(or);
    o.do(function (v) { }, function (e) { }, function () { });
    o.tap(function (v) { }, function (e) { }, function () { });
    o.doOnNext(function (v) { });
    o.tapOnNext(function (v) { });
    o.doOnError(function (e) { });
    o.tapOnError(function (e) { });
    o.doOnCompleted(function () { });
    o.tapOnCompleted(function () { });
    o.doOnNext(function (v) { }, {});
    o.tapOnNext(function (v) { }, {});
    o.doOnError(function (e) { }, {});
    o.tapOnError(function (e) { }, {});
    o.doOnCompleted(function () { }, {});
    o.tapOnCompleted(function () { }, {});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9yeC90cy9jb3JlL2xpbnEvb2JzZXJ2YWJsZS90YXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNENBQTRDO0FBQzVDLCtDQUErQztBQThGL0MsQ0FBQztJQUNHLElBQUksQ0FBd0IsQ0FBQztJQUM3QixJQUFJLEVBQXVCLENBQUM7SUFFNUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNULENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFVixDQUFDLENBQUMsRUFBRSxDQUFDLFVBQUMsQ0FBQyxJQUFNLENBQUMsRUFBRSxVQUFBLENBQUMsSUFBSyxDQUFDLEVBQUUsY0FBTyxDQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFNLENBQUMsRUFBRSxVQUFBLENBQUMsSUFBSyxDQUFDLEVBQUUsY0FBTyxDQUFDLENBQUMsQ0FBQztJQUVwQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQUMsQ0FBQyxJQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxDQUFDLElBQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFDLENBQUMsSUFBTyxDQUFDLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsVUFBVSxDQUFDLFVBQUMsQ0FBQyxJQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBUSxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDLENBQUMsY0FBYyxDQUFDLGNBQVEsQ0FBQyxDQUFDLENBQUM7SUFDNUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFDLENBQUMsSUFBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDM0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFDLENBQUMsSUFBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDNUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFDLENBQUMsSUFBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDNUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFDLENBQUMsSUFBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUMsY0FBYyxDQUFDLGNBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL29ic2VydmFibGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL29ic2VydmVyLWxpdGUudHNcIiAvPlxubW9kdWxlIFJ4IHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIE9ic2VydmFibGU8VD4ge1xuICAgICAgICAvKipcbiAgICAgICAgKiAgSW52b2tlcyBhbiBhY3Rpb24gZm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSBhbmQgaW52b2tlcyBhbiBhY3Rpb24gdXBvbiBncmFjZWZ1bCBvciBleGNlcHRpb25hbCB0ZXJtaW5hdGlvbiBvZiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKiAgVGhpcyBtZXRob2QgY2FuIGJlIHVzZWQgZm9yIGRlYnVnZ2luZywgbG9nZ2luZywgZXRjLiBvZiBxdWVyeSBiZWhhdmlvciBieSBpbnRlcmNlcHRpbmcgdGhlIG1lc3NhZ2Ugc3RyZWFtIHRvIHJ1biBhcmJpdHJhcnkgYWN0aW9ucyBmb3IgbWVzc2FnZXMgb24gdGhlIHBpcGVsaW5lLlxuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb24gfCBPYnNlcnZlcn0gb2JzZXJ2ZXJPck9uTmV4dCBBY3Rpb24gdG8gaW52b2tlIGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIG9ic2VydmFibGUgc2VxdWVuY2Ugb3IgYW4gb2JzZXJ2ZXIuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uRXJyb3JdICBBY3Rpb24gdG8gaW52b2tlIHVwb24gZXhjZXB0aW9uYWwgdGVybWluYXRpb24gb2YgdGhlIG9ic2VydmFibGUgc2VxdWVuY2UuIFVzZWQgaWYgb25seSB0aGUgb2JzZXJ2ZXJPck9uTmV4dCBwYXJhbWV0ZXIgaXMgYWxzbyBhIGZ1bmN0aW9uLlxuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkNvbXBsZXRlZF0gIEFjdGlvbiB0byBpbnZva2UgdXBvbiBncmFjZWZ1bCB0ZXJtaW5hdGlvbiBvZiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS4gVXNlZCBpZiBvbmx5IHRoZSBvYnNlcnZlck9yT25OZXh0IHBhcmFtZXRlciBpcyBhbHNvIGEgZnVuY3Rpb24uXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IFRoZSBzb3VyY2Ugc2VxdWVuY2Ugd2l0aCB0aGUgc2lkZS1lZmZlY3RpbmcgYmVoYXZpb3IgYXBwbGllZC5cbiAgICAgICAgKi9cbiAgICAgICAgZG8ob2JzZXJ2ZXI6IE9ic2VydmVyPFQ+KTogT2JzZXJ2YWJsZTxUPjtcbiAgICAgICAgLyoqXG4gICAgICAgICogIEludm9rZXMgYW4gYWN0aW9uIGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIG9ic2VydmFibGUgc2VxdWVuY2UgYW5kIGludm9rZXMgYW4gYWN0aW9uIHVwb24gZ3JhY2VmdWwgb3IgZXhjZXB0aW9uYWwgdGVybWluYXRpb24gb2YgdGhlIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICAgICogIFRoaXMgbWV0aG9kIGNhbiBiZSB1c2VkIGZvciBkZWJ1Z2dpbmcsIGxvZ2dpbmcsIGV0Yy4gb2YgcXVlcnkgYmVoYXZpb3IgYnkgaW50ZXJjZXB0aW5nIHRoZSBtZXNzYWdlIHN0cmVhbSB0byBydW4gYXJiaXRyYXJ5IGFjdGlvbnMgZm9yIG1lc3NhZ2VzIG9uIHRoZSBwaXBlbGluZS5cbiAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uIHwgT2JzZXJ2ZXJ9IG9ic2VydmVyT3JPbk5leHQgQWN0aW9uIHRvIGludm9rZSBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlIG9yIGFuIG9ic2VydmVyLlxuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkVycm9yXSAgQWN0aW9uIHRvIGludm9rZSB1cG9uIGV4Y2VwdGlvbmFsIHRlcm1pbmF0aW9uIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLiBVc2VkIGlmIG9ubHkgdGhlIG9ic2VydmVyT3JPbk5leHQgcGFyYW1ldGVyIGlzIGFsc28gYSBmdW5jdGlvbi5cbiAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25Db21wbGV0ZWRdICBBY3Rpb24gdG8gaW52b2tlIHVwb24gZ3JhY2VmdWwgdGVybWluYXRpb24gb2YgdGhlIG9ic2VydmFibGUgc2VxdWVuY2UuIFVzZWQgaWYgb25seSB0aGUgb2JzZXJ2ZXJPck9uTmV4dCBwYXJhbWV0ZXIgaXMgYWxzbyBhIGZ1bmN0aW9uLlxuICAgICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaGUgc291cmNlIHNlcXVlbmNlIHdpdGggdGhlIHNpZGUtZWZmZWN0aW5nIGJlaGF2aW9yIGFwcGxpZWQuXG4gICAgICAgICovXG4gICAgICAgIHRhcChvYnNlcnZlcjogT2JzZXJ2ZXI8VD4pOiBPYnNlcnZhYmxlPFQ+O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAqICBJbnZva2VzIGFuIGFjdGlvbiBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlIGFuZCBpbnZva2VzIGFuIGFjdGlvbiB1cG9uIGdyYWNlZnVsIG9yIGV4Y2VwdGlvbmFsIHRlcm1pbmF0aW9uIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqICBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCBmb3IgZGVidWdnaW5nLCBsb2dnaW5nLCBldGMuIG9mIHF1ZXJ5IGJlaGF2aW9yIGJ5IGludGVyY2VwdGluZyB0aGUgbWVzc2FnZSBzdHJlYW0gdG8gcnVuIGFyYml0cmFyeSBhY3Rpb25zIGZvciBtZXNzYWdlcyBvbiB0aGUgcGlwZWxpbmUuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbiB8IE9ic2VydmVyfSBvYnNlcnZlck9yT25OZXh0IEFjdGlvbiB0byBpbnZva2UgZm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSBvciBhbiBvYnNlcnZlci5cbiAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25FcnJvcl0gIEFjdGlvbiB0byBpbnZva2UgdXBvbiBleGNlcHRpb25hbCB0ZXJtaW5hdGlvbiBvZiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS4gVXNlZCBpZiBvbmx5IHRoZSBvYnNlcnZlck9yT25OZXh0IHBhcmFtZXRlciBpcyBhbHNvIGEgZnVuY3Rpb24uXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uQ29tcGxldGVkXSAgQWN0aW9uIHRvIGludm9rZSB1cG9uIGdyYWNlZnVsIHRlcm1pbmF0aW9uIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLiBVc2VkIGlmIG9ubHkgdGhlIG9ic2VydmVyT3JPbk5leHQgcGFyYW1ldGVyIGlzIGFsc28gYSBmdW5jdGlvbi5cbiAgICAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gVGhlIHNvdXJjZSBzZXF1ZW5jZSB3aXRoIHRoZSBzaWRlLWVmZmVjdGluZyBiZWhhdmlvciBhcHBsaWVkLlxuICAgICAgICAqL1xuICAgICAgICBkbyhvbk5leHQ/OiAodmFsdWU6IFQpID0+IHZvaWQsIG9uRXJyb3I/OiAoZXhjZXB0aW9uOiBhbnkpID0+IHZvaWQsIG9uQ29tcGxldGVkPzogKCkgPT4gdm9pZCk6IE9ic2VydmFibGU8VD47XG4gICAgICAgIC8qKlxuICAgICAgICAqICBJbnZva2VzIGFuIGFjdGlvbiBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlIGFuZCBpbnZva2VzIGFuIGFjdGlvbiB1cG9uIGdyYWNlZnVsIG9yIGV4Y2VwdGlvbmFsIHRlcm1pbmF0aW9uIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqICBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCBmb3IgZGVidWdnaW5nLCBsb2dnaW5nLCBldGMuIG9mIHF1ZXJ5IGJlaGF2aW9yIGJ5IGludGVyY2VwdGluZyB0aGUgbWVzc2FnZSBzdHJlYW0gdG8gcnVuIGFyYml0cmFyeSBhY3Rpb25zIGZvciBtZXNzYWdlcyBvbiB0aGUgcGlwZWxpbmUuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbiB8IE9ic2VydmVyfSBvYnNlcnZlck9yT25OZXh0IEFjdGlvbiB0byBpbnZva2UgZm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSBvciBhbiBvYnNlcnZlci5cbiAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25FcnJvcl0gIEFjdGlvbiB0byBpbnZva2UgdXBvbiBleGNlcHRpb25hbCB0ZXJtaW5hdGlvbiBvZiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS4gVXNlZCBpZiBvbmx5IHRoZSBvYnNlcnZlck9yT25OZXh0IHBhcmFtZXRlciBpcyBhbHNvIGEgZnVuY3Rpb24uXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uQ29tcGxldGVkXSAgQWN0aW9uIHRvIGludm9rZSB1cG9uIGdyYWNlZnVsIHRlcm1pbmF0aW9uIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLiBVc2VkIGlmIG9ubHkgdGhlIG9ic2VydmVyT3JPbk5leHQgcGFyYW1ldGVyIGlzIGFsc28gYSBmdW5jdGlvbi5cbiAgICAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gVGhlIHNvdXJjZSBzZXF1ZW5jZSB3aXRoIHRoZSBzaWRlLWVmZmVjdGluZyBiZWhhdmlvciBhcHBsaWVkLlxuICAgICAgICAqL1xuICAgICAgICB0YXAob25OZXh0PzogKHZhbHVlOiBUKSA9PiB2b2lkLCBvbkVycm9yPzogKGV4Y2VwdGlvbjogYW55KSA9PiB2b2lkLCBvbkNvbXBsZXRlZD86ICgpID0+IHZvaWQpOiBPYnNlcnZhYmxlPFQ+O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAqICBJbnZva2VzIGFuIGFjdGlvbiBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqICBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCBmb3IgZGVidWdnaW5nLCBsb2dnaW5nLCBldGMuIG9mIHF1ZXJ5IGJlaGF2aW9yIGJ5IGludGVyY2VwdGluZyB0aGUgbWVzc2FnZSBzdHJlYW0gdG8gcnVuIGFyYml0cmFyeSBhY3Rpb25zIGZvciBtZXNzYWdlcyBvbiB0aGUgcGlwZWxpbmUuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25OZXh0IEFjdGlvbiB0byBpbnZva2UgZm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKiBAcGFyYW0ge0FueX0gW3RoaXNBcmddIE9iamVjdCB0byB1c2UgYXMgdGhpcyB3aGVuIGV4ZWN1dGluZyBjYWxsYmFjay5cbiAgICAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gVGhlIHNvdXJjZSBzZXF1ZW5jZSB3aXRoIHRoZSBzaWRlLWVmZmVjdGluZyBiZWhhdmlvciBhcHBsaWVkLlxuICAgICAgICAqL1xuICAgICAgICBkb09uTmV4dChvbk5leHQ6ICh2YWx1ZTogVCkgPT4gdm9pZCwgdGhpc0FyZz86IGFueSk6IE9ic2VydmFibGU8VD47XG4gICAgICAgIC8qKlxuICAgICAgICAqICBJbnZva2VzIGFuIGFjdGlvbiB1cG9uIGV4Y2VwdGlvbmFsIHRlcm1pbmF0aW9uIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqICBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCBmb3IgZGVidWdnaW5nLCBsb2dnaW5nLCBldGMuIG9mIHF1ZXJ5IGJlaGF2aW9yIGJ5IGludGVyY2VwdGluZyB0aGUgbWVzc2FnZSBzdHJlYW0gdG8gcnVuIGFyYml0cmFyeSBhY3Rpb25zIGZvciBtZXNzYWdlcyBvbiB0aGUgcGlwZWxpbmUuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25FcnJvciBBY3Rpb24gdG8gaW52b2tlIHVwb24gZXhjZXB0aW9uYWwgdGVybWluYXRpb24gb2YgdGhlIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICAgICogQHBhcmFtIHtBbnl9IFt0aGlzQXJnXSBPYmplY3QgdG8gdXNlIGFzIHRoaXMgd2hlbiBleGVjdXRpbmcgY2FsbGJhY2suXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IFRoZSBzb3VyY2Ugc2VxdWVuY2Ugd2l0aCB0aGUgc2lkZS1lZmZlY3RpbmcgYmVoYXZpb3IgYXBwbGllZC5cbiAgICAgICAgKi9cbiAgICAgICAgZG9PbkVycm9yKG9uRXJyb3I6IChleGNlcHRpb246IGFueSkgPT4gdm9pZCwgdGhpc0FyZz86IGFueSk6IE9ic2VydmFibGU8VD47XG4gICAgICAgIC8qKlxuICAgICAgICAqICBJbnZva2VzIGFuIGFjdGlvbiB1cG9uIGdyYWNlZnVsIHRlcm1pbmF0aW9uIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqICBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCBmb3IgZGVidWdnaW5nLCBsb2dnaW5nLCBldGMuIG9mIHF1ZXJ5IGJlaGF2aW9yIGJ5IGludGVyY2VwdGluZyB0aGUgbWVzc2FnZSBzdHJlYW0gdG8gcnVuIGFyYml0cmFyeSBhY3Rpb25zIGZvciBtZXNzYWdlcyBvbiB0aGUgcGlwZWxpbmUuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25Db21wbGV0ZWQgQWN0aW9uIHRvIGludm9rZSB1cG9uIGdyYWNlZnVsIHRlcm1pbmF0aW9uIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqIEBwYXJhbSB7QW55fSBbdGhpc0FyZ10gT2JqZWN0IHRvIHVzZSBhcyB0aGlzIHdoZW4gZXhlY3V0aW5nIGNhbGxiYWNrLlxuICAgICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaGUgc291cmNlIHNlcXVlbmNlIHdpdGggdGhlIHNpZGUtZWZmZWN0aW5nIGJlaGF2aW9yIGFwcGxpZWQuXG4gICAgICAgICovXG4gICAgICAgIGRvT25Db21wbGV0ZWQob25Db21wbGV0ZWQ6ICgpID0+IHZvaWQsIHRoaXNBcmc/OiBhbnkpOiBPYnNlcnZhYmxlPFQ+O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAqICBJbnZva2VzIGFuIGFjdGlvbiBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqICBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCBmb3IgZGVidWdnaW5nLCBsb2dnaW5nLCBldGMuIG9mIHF1ZXJ5IGJlaGF2aW9yIGJ5IGludGVyY2VwdGluZyB0aGUgbWVzc2FnZSBzdHJlYW0gdG8gcnVuIGFyYml0cmFyeSBhY3Rpb25zIGZvciBtZXNzYWdlcyBvbiB0aGUgcGlwZWxpbmUuXG4gICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25OZXh0IEFjdGlvbiB0byBpbnZva2UgZm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKiBAcGFyYW0ge0FueX0gW3RoaXNBcmddIE9iamVjdCB0byB1c2UgYXMgdGhpcyB3aGVuIGV4ZWN1dGluZyBjYWxsYmFjay5cbiAgICAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gVGhlIHNvdXJjZSBzZXF1ZW5jZSB3aXRoIHRoZSBzaWRlLWVmZmVjdGluZyBiZWhhdmlvciBhcHBsaWVkLlxuICAgICAgICAqL1xuICAgICAgICB0YXBPbk5leHQob25OZXh0OiAodmFsdWU6IFQpID0+IHZvaWQsIHRoaXNBcmc/OiBhbnkpOiBPYnNlcnZhYmxlPFQ+O1xuICAgICAgICAvKipcbiAgICAgICAgKiAgSW52b2tlcyBhbiBhY3Rpb24gdXBvbiBleGNlcHRpb25hbCB0ZXJtaW5hdGlvbiBvZiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgICAgKiAgVGhpcyBtZXRob2QgY2FuIGJlIHVzZWQgZm9yIGRlYnVnZ2luZywgbG9nZ2luZywgZXRjLiBvZiBxdWVyeSBiZWhhdmlvciBieSBpbnRlcmNlcHRpbmcgdGhlIG1lc3NhZ2Ugc3RyZWFtIHRvIHJ1biBhcmJpdHJhcnkgYWN0aW9ucyBmb3IgbWVzc2FnZXMgb24gdGhlIHBpcGVsaW5lLlxuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uRXJyb3IgQWN0aW9uIHRvIGludm9rZSB1cG9uIGV4Y2VwdGlvbmFsIHRlcm1pbmF0aW9uIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAqIEBwYXJhbSB7QW55fSBbdGhpc0FyZ10gT2JqZWN0IHRvIHVzZSBhcyB0aGlzIHdoZW4gZXhlY3V0aW5nIGNhbGxiYWNrLlxuICAgICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaGUgc291cmNlIHNlcXVlbmNlIHdpdGggdGhlIHNpZGUtZWZmZWN0aW5nIGJlaGF2aW9yIGFwcGxpZWQuXG4gICAgICAgICovXG4gICAgICAgIHRhcE9uRXJyb3Iob25FcnJvcjogKGV4Y2VwdGlvbjogYW55KSA9PiB2b2lkLCB0aGlzQXJnPzogYW55KTogT2JzZXJ2YWJsZTxUPjtcbiAgICAgICAgLyoqXG4gICAgICAgICogIEludm9rZXMgYW4gYWN0aW9uIHVwb24gZ3JhY2VmdWwgdGVybWluYXRpb24gb2YgdGhlIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICAgICogIFRoaXMgbWV0aG9kIGNhbiBiZSB1c2VkIGZvciBkZWJ1Z2dpbmcsIGxvZ2dpbmcsIGV0Yy4gb2YgcXVlcnkgYmVoYXZpb3IgYnkgaW50ZXJjZXB0aW5nIHRoZSBtZXNzYWdlIHN0cmVhbSB0byBydW4gYXJiaXRyYXJ5IGFjdGlvbnMgZm9yIG1lc3NhZ2VzIG9uIHRoZSBwaXBlbGluZS5cbiAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkNvbXBsZXRlZCBBY3Rpb24gdG8gaW52b2tlIHVwb24gZ3JhY2VmdWwgdGVybWluYXRpb24gb2YgdGhlIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICAgICogQHBhcmFtIHtBbnl9IFt0aGlzQXJnXSBPYmplY3QgdG8gdXNlIGFzIHRoaXMgd2hlbiBleGVjdXRpbmcgY2FsbGJhY2suXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IFRoZSBzb3VyY2Ugc2VxdWVuY2Ugd2l0aCB0aGUgc2lkZS1lZmZlY3RpbmcgYmVoYXZpb3IgYXBwbGllZC5cbiAgICAgICAgKi9cbiAgICAgICAgdGFwT25Db21wbGV0ZWQob25Db21wbGV0ZWQ6ICgpID0+IHZvaWQsIHRoaXNBcmc/OiBhbnkpOiBPYnNlcnZhYmxlPFQ+O1xuICAgIH1cbn1cblxuXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIG86IFJ4Lk9ic2VydmFibGU8c3RyaW5nPjtcbiAgICB2YXIgb3I6IFJ4Lk9ic2VydmVyPHN0cmluZz47XG5cbiAgICBvLmRvKG9yKTtcbiAgICBvLnRhcChvcik7XG5cbiAgICBvLmRvKCh2KSA9PiB7fSwgZSA9PiB7fSwgKCkgPT4ge30pO1xuICAgIG8udGFwKCh2KSA9PiB7fSwgZSA9PiB7fSwgKCkgPT4ge30pO1xuXG4gICAgby5kb09uTmV4dCgodikgPT4geyB9KTtcbiAgICBvLnRhcE9uTmV4dCgodikgPT4geyB9KTtcbiAgICBvLmRvT25FcnJvcigoZSkgPT4geyB9KTtcbiAgICBvLnRhcE9uRXJyb3IoKGUpID0+IHsgfSk7XG4gICAgby5kb09uQ29tcGxldGVkKCgpID0+IHsgfSk7XG4gICAgby50YXBPbkNvbXBsZXRlZCgoKSA9PiB7IH0pO1xuICAgIG8uZG9Pbk5leHQoKHYpID0+IHsgfSwge30pO1xuICAgIG8udGFwT25OZXh0KCh2KSA9PiB7IH0sIHt9KTtcbiAgICBvLmRvT25FcnJvcigoZSkgPT4geyB9LCB7fSk7XG4gICAgby50YXBPbkVycm9yKChlKSA9PiB7IH0sIHt9KTtcbiAgICBvLmRvT25Db21wbGV0ZWQoKCkgPT4geyB9LCB7fSk7XG4gICAgby50YXBPbkNvbXBsZXRlZCgoKSA9PiB7IH0sIHt9KTtcbn0pO1xuIl19