/// <reference path="../../observable.ts" />
/// <reference path="../../concurrency/scheduler.ts" />
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGV3aXRoYWJzb2x1dGV0aW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvcngvdHMvY29yZS9saW5xL29ic2VydmFibGUvZ2VuZXJhdGV3aXRoYWJzb2x1dGV0aW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDRDQUE0QztBQUM1Qyx1REFBdUQiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vb2JzZXJ2YWJsZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vY29uY3VycmVuY3kvc2NoZWR1bGVyLnRzXCIgLz5cbm1vZHVsZSBSeCB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBPYnNlcnZhYmxlU3RhdGljIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICBHZW5lcmF0ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBieSBpdGVyYXRpbmcgYSBzdGF0ZSBmcm9tIGFuIGluaXRpYWwgc3RhdGUgdW50aWwgdGhlIGNvbmRpdGlvbiBmYWlscy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogIHJlcyA9IHNvdXJjZS5nZW5lcmF0ZVdpdGhBYnNvbHV0ZVRpbWUoMCxcbiAgICAgICAgICogICAgICBmdW5jdGlvbiAoeCkgeyByZXR1cm4gcmV0dXJuIHRydWU7IH0sXG4gICAgICAgICAqICAgICAgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHggKyAxOyB9LFxuICAgICAgICAgKiAgICAgIGZ1bmN0aW9uICh4KSB7IHJldHVybiB4OyB9LFxuICAgICAgICAgKiAgICAgIGZ1bmN0aW9uICh4KSB7IHJldHVybiBuZXcgRGF0ZSgpOyB9XG4gICAgICAgICAqICB9KTtcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtNaXhlZH0gaW5pdGlhbFN0YXRlIEluaXRpYWwgc3RhdGUuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbmRpdGlvbiBDb25kaXRpb24gdG8gdGVybWluYXRlIGdlbmVyYXRpb24gKHVwb24gcmV0dXJuaW5nIGZhbHNlKS5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZSBJdGVyYXRpb24gc3RlcCBmdW5jdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzdWx0U2VsZWN0b3IgU2VsZWN0b3IgZnVuY3Rpb24gZm9yIHJlc3VsdHMgcHJvZHVjZWQgaW4gdGhlIHNlcXVlbmNlLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB0aW1lU2VsZWN0b3IgVGltZSBzZWxlY3RvciBmdW5jdGlvbiB0byBjb250cm9sIHRoZSBzcGVlZCBvZiB2YWx1ZXMgYmVpbmcgcHJvZHVjZWQgZWFjaCBpdGVyYXRpb24sIHJldHVybmluZyBEYXRlIHZhbHVlcy5cbiAgICAgICAgICogQHBhcmFtIHtTY2hlZHVsZXJ9IFtzY2hlZHVsZXJdICBTY2hlZHVsZXIgb24gd2hpY2ggdG8gcnVuIHRoZSBnZW5lcmF0b3IgbG9vcC4gSWYgbm90IHNwZWNpZmllZCwgdGhlIHRpbWVvdXQgc2NoZWR1bGVyIGlzIHVzZWQuXG4gICAgICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaGUgZ2VuZXJhdGVkIHNlcXVlbmNlLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2VuZXJhdGVXaXRoQWJzb2x1dGVUaW1lPFRTdGF0ZSwgVFJlc3VsdD4oXG4gICAgICAgICAgICBpbml0aWFsU3RhdGU6IFRTdGF0ZSxcbiAgICAgICAgICAgIGNvbmRpdGlvbjogKHN0YXRlOiBUU3RhdGUpID0+IGJvb2xlYW4sXG4gICAgICAgICAgICBpdGVyYXRlOiAoc3RhdGU6IFRTdGF0ZSkgPT4gVFN0YXRlLFxuICAgICAgICAgICAgcmVzdWx0U2VsZWN0b3I6IChzdGF0ZTogVFN0YXRlKSA9PiBUUmVzdWx0LFxuICAgICAgICAgICAgdGltZVNlbGVjdG9yOiAoc3RhdGU6IFRTdGF0ZSkgPT4gRGF0ZSxcbiAgICAgICAgICAgIHNjaGVkdWxlcj86IElTY2hlZHVsZXIpOiBPYnNlcnZhYmxlPFRSZXN1bHQ+O1xuICAgIH1cbn1cbiJdfQ==