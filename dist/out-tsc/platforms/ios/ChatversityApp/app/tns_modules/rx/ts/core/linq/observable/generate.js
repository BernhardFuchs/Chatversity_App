/// <reference path="../../observable.ts" />
/// <reference path="../../concurrency/scheduler.ts" />
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9yeC90cy9jb3JlL2xpbnEvb2JzZXJ2YWJsZS9nZW5lcmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0Q0FBNEM7QUFDNUMsdURBQXVEIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL29ic2VydmFibGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2NvbmN1cnJlbmN5L3NjaGVkdWxlci50c1wiIC8+XG5tb2R1bGUgUngge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgT2JzZXJ2YWJsZVN0YXRpYyB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgR2VuZXJhdGVzIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgYnkgcnVubmluZyBhIHN0YXRlLWRyaXZlbiBsb29wIHByb2R1Y2luZyB0aGUgc2VxdWVuY2UncyBlbGVtZW50cywgdXNpbmcgdGhlIHNwZWNpZmllZCBzY2hlZHVsZXIgdG8gc2VuZCBvdXQgb2JzZXJ2ZXIgbWVzc2FnZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqICB2YXIgcmVzID0gUnguT2JzZXJ2YWJsZS5nZW5lcmF0ZSgwLCBmdW5jdGlvbiAoeCkgeyByZXR1cm4geCA8IDEwOyB9LCBmdW5jdGlvbiAoeCkgeyByZXR1cm4geCArIDE7IH0sIGZ1bmN0aW9uICh4KSB7IHJldHVybiB4OyB9KTtcbiAgICAgICAgICogIHZhciByZXMgPSBSeC5PYnNlcnZhYmxlLmdlbmVyYXRlKDAsIGZ1bmN0aW9uICh4KSB7IHJldHVybiB4IDwgMTA7IH0sIGZ1bmN0aW9uICh4KSB7IHJldHVybiB4ICsgMTsgfSwgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHg7IH0sIFJ4LlNjaGVkdWxlci50aW1lb3V0KTtcbiAgICAgICAgICogQHBhcmFtIHtNaXhlZH0gaW5pdGlhbFN0YXRlIEluaXRpYWwgc3RhdGUuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbmRpdGlvbiBDb25kaXRpb24gdG8gdGVybWluYXRlIGdlbmVyYXRpb24gKHVwb24gcmV0dXJuaW5nIGZhbHNlKS5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZSBJdGVyYXRpb24gc3RlcCBmdW5jdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzdWx0U2VsZWN0b3IgU2VsZWN0b3IgZnVuY3Rpb24gZm9yIHJlc3VsdHMgcHJvZHVjZWQgaW4gdGhlIHNlcXVlbmNlLlxuICAgICAgICAgKiBAcGFyYW0ge1NjaGVkdWxlcn0gW3NjaGVkdWxlcl0gU2NoZWR1bGVyIG9uIHdoaWNoIHRvIHJ1biB0aGUgZ2VuZXJhdG9yIGxvb3AuIElmIG5vdCBwcm92aWRlZCwgZGVmYXVsdHMgdG8gU2NoZWR1bGVyLmN1cnJlbnRUaHJlYWQuXG4gICAgICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaGUgZ2VuZXJhdGVkIHNlcXVlbmNlLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2VuZXJhdGU8VFN0YXRlLCBUUmVzdWx0Pihpbml0aWFsU3RhdGU6IFRTdGF0ZSwgY29uZGl0aW9uOiAoc3RhdGU6IFRTdGF0ZSkgPT4gYm9vbGVhbiwgaXRlcmF0ZTogKHN0YXRlOiBUU3RhdGUpID0+IFRTdGF0ZSwgcmVzdWx0U2VsZWN0b3I6IChzdGF0ZTogVFN0YXRlKSA9PiBUUmVzdWx0LCBzY2hlZHVsZXI/OiBJU2NoZWR1bGVyKTogT2JzZXJ2YWJsZTxUUmVzdWx0PjtcbiAgICB9XG59XG4iXX0=