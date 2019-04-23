/// <reference path="../../observable.ts" />
/// <reference path="../../concurrency/scheduler.ts" />
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbWV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvcngvdHMvY29yZS9saW5xL29ic2VydmFibGUvZnJvbWV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDRDQUE0QztBQUM1Qyx1REFBdUQiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vb2JzZXJ2YWJsZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vY29uY3VycmVuY3kvc2NoZWR1bGVyLnRzXCIgLz5cbm1vZHVsZSBSeCB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBPYnNlcnZhYmxlU3RhdGljIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBieSBhZGRpbmcgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIG1hdGNoaW5nIERPTUVsZW1lbnQgb3IgZWFjaCBpdGVtIGluIHRoZSBOb2RlTGlzdC5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgVGhlIERPTUVsZW1lbnQgb3IgTm9kZUxpc3QgdG8gYXR0YWNoIGEgbGlzdGVuZXIuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgVGhlIGV2ZW50IG5hbWUgdG8gYXR0YWNoIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc2VsZWN0b3JdIEEgc2VsZWN0b3Igd2hpY2ggdGFrZXMgdGhlIGFyZ3VtZW50cyBmcm9tIHRoZSBldmVudCBoYW5kbGVyIHRvIHByb2R1Y2UgYSBzaW5nbGUgaXRlbSB0byB5aWVsZCBvbiBuZXh0LlxuICAgICAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBvZiBldmVudHMgZnJvbSB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgYW5kIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmcm9tRXZlbnQ8VD4oZWxlbWVudDogRXZlbnRUYXJnZXQsIGV2ZW50TmFtZTogc3RyaW5nLCBzZWxlY3Rvcj86IChhcmd1bWVudHM6IGFueVtdKSA9PiBUKTogT2JzZXJ2YWJsZTxUPjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBieSBhZGRpbmcgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIG1hdGNoaW5nIERPTUVsZW1lbnQgb3IgZWFjaCBpdGVtIGluIHRoZSBOb2RlTGlzdC5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgVGhlIERPTUVsZW1lbnQgb3IgTm9kZUxpc3QgdG8gYXR0YWNoIGEgbGlzdGVuZXIuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgVGhlIGV2ZW50IG5hbWUgdG8gYXR0YWNoIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc2VsZWN0b3JdIEEgc2VsZWN0b3Igd2hpY2ggdGFrZXMgdGhlIGFyZ3VtZW50cyBmcm9tIHRoZSBldmVudCBoYW5kbGVyIHRvIHByb2R1Y2UgYSBzaW5nbGUgaXRlbSB0byB5aWVsZCBvbiBuZXh0LlxuICAgICAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBvZiBldmVudHMgZnJvbSB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgYW5kIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmcm9tRXZlbnQ8VD4oZWxlbWVudDogeyBvbjogKG5hbWU6IHN0cmluZywgY2I6IChlOiBhbnkpID0+IGFueSkgPT4gdm9pZDsgb2ZmOiAobmFtZTogc3RyaW5nLCBjYjogKGU6IGFueSkgPT4gYW55KSA9PiB2b2lkIH0sIGV2ZW50TmFtZTogc3RyaW5nLCBzZWxlY3Rvcj86IChhcmd1bWVudHM6IGFueVtdKSA9PiBUKTogT2JzZXJ2YWJsZTxUPjtcbiAgICB9XG59XG4iXX0=