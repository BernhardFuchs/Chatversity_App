/// <reference path="./disposables/disposable.ts" />
/// <reference path="./checkedobserver.ts" />
/// <reference path="./notification.ts" />
(function () {
    var observer;
    var n = observer.toNotifier();
    var o = observer.asObserver();
    var c = observer.checked();
    o = observer.notifyOn(Rx.Scheduler.immediate);
    var so = Rx.Observer.fromNotifier(function (n) {
        // Handle next calls
        if (n.kind === 'N') {
            console.log('Next: ' + n.value);
        }
        // Handle error calls
        if (n.kind === 'E') {
            console.log('Error: ' + n.exception);
        }
        // Handle completed
        if (n.kind === 'C') {
            console.log('Completed');
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2ZXItZXh0cmFzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvcngvdHMvY29yZS9vYnNlcnZlci1leHRyYXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0RBQW9EO0FBQ3BELDZDQUE2QztBQUM3QywwQ0FBMEM7QUE0QzFDLENBQUM7SUFDRyxJQUFJLFFBQThCLENBQUM7SUFDbkMsSUFBSSxDQUFDLEdBQXFELFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUVoRixJQUFJLENBQUMsR0FBeUIsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBRXBELElBQUksQ0FBQyxHQUFnQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFeEQsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUU5QyxJQUFJLEVBQUUsR0FBeUIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQVMsVUFBQyxDQUFDO1FBQzlELG9CQUFvQjtRQUNwQixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNuQztRQUVELHFCQUFxQjtRQUNyQixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN4QztRQUVELG1CQUFtQjtRQUNuQixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7U0FDM0I7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZGlzcG9zYWJsZXMvZGlzcG9zYWJsZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9jaGVja2Vkb2JzZXJ2ZXIudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vbm90aWZpY2F0aW9uLnRzXCIgLz5cbm1vZHVsZSBSeCB7XG5cdGV4cG9ydCBpbnRlcmZhY2UgT2JzZXJ2ZXI8VD4ge1xuICAgICAgICAvKipcbiAgICAgICAgKiAgQ3JlYXRlcyBhIG5vdGlmaWNhdGlvbiBjYWxsYmFjayBmcm9tIGFuIG9ic2VydmVyLlxuICAgICAgICAqIEByZXR1cm5zIFRoZSBhY3Rpb24gdGhhdCBmb3J3YXJkcyBpdHMgaW5wdXQgbm90aWZpY2F0aW9uIHRvIHRoZSB1bmRlcmx5aW5nIG9ic2VydmVyLlxuICAgICAgICAqL1xuXHRcdHRvTm90aWZpZXIoKTogKG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uPFQ+KSA9PiB2b2lkO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAqICBIaWRlcyB0aGUgaWRlbnRpdHkgb2YgYW4gb2JzZXJ2ZXIuXG4gICAgICAgICogQHJldHVybnMgQW4gb2JzZXJ2ZXIgdGhhdCBoaWRlcyB0aGUgaWRlbnRpdHkgb2YgdGhlIHNwZWNpZmllZCBvYnNlcnZlci5cbiAgICAgICAgKi9cblx0XHRhc09ic2VydmVyKCk6IE9ic2VydmVyPFQ+O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAqICBDaGVja3MgYWNjZXNzIHRvIHRoZSBvYnNlcnZlciBmb3IgZ3JhbW1hciB2aW9sYXRpb25zLiBUaGlzIGluY2x1ZGVzIGNoZWNraW5nIGZvciBtdWx0aXBsZSBPbkVycm9yIG9yIE9uQ29tcGxldGVkIGNhbGxzLCBhcyB3ZWxsIGFzIHJlZW50cmFuY3kgaW4gYW55IG9mIHRoZSBvYnNlcnZlciBtZXRob2RzLlxuICAgICAgICAqICBJZiBhIHZpb2xhdGlvbiBpcyBkZXRlY3RlZCwgYW4gRXJyb3IgaXMgdGhyb3duIGZyb20gdGhlIG9mZmVuZGluZyBvYnNlcnZlciBtZXRob2QgY2FsbC5cbiAgICAgICAgKiBAcmV0dXJucyBBbiBvYnNlcnZlciB0aGF0IGNoZWNrcyBjYWxsYmFja3MgaW52b2NhdGlvbnMgYWdhaW5zdCB0aGUgb2JzZXJ2ZXIgZ3JhbW1hciBhbmQsIGlmIHRoZSBjaGVja3MgcGFzcywgZm9yd2FyZHMgdGhvc2UgdG8gdGhlIHNwZWNpZmllZCBvYnNlcnZlci5cbiAgICAgICAgKi9cbiAgICAgICAgY2hlY2tlZCgpOiBDaGVja2VkT2JzZXJ2ZXI8VD47XG5cbiAgICAgICAgLyoqXG4gICAgICAgICogU2NoZWR1bGVzIHRoZSBpbnZvY2F0aW9uIG9mIG9ic2VydmVyIG1ldGhvZHMgb24gdGhlIGdpdmVuIHNjaGVkdWxlci5cbiAgICAgICAgKiBAcGFyYW0ge1NjaGVkdWxlcn0gc2NoZWR1bGVyIFNjaGVkdWxlciB0byBzY2hlZHVsZSBvYnNlcnZlciBtZXNzYWdlcyBvbi5cbiAgICAgICAgKiBAcmV0dXJucyB7T2JzZXJ2ZXJ9IE9ic2VydmVyIHdob3NlIG1lc3NhZ2VzIGFyZSBzY2hlZHVsZWQgb24gdGhlIGdpdmVuIHNjaGVkdWxlci5cbiAgICAgICAgKi9cbiAgICAgICAgbm90aWZ5T24oc2NoZWR1bGVyOiBJU2NoZWR1bGVyKTogT2JzZXJ2ZXI8VD47XG5cdH1cblxuXHRleHBvcnQgaW50ZXJmYWNlIE9ic2VydmVyU3RhdGljIHtcbiAgICAgICAgLyoqXG4gICAgICAgICogIENyZWF0ZXMgYW4gb2JzZXJ2ZXIgZnJvbSBhIG5vdGlmaWNhdGlvbiBjYWxsYmFjay5cbiAgICAgICAgKlxuICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgKiBAbWVtYmVyT2YgT2JzZXJ2ZXJcbiAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyIEFjdGlvbiB0aGF0IGhhbmRsZXMgYSBub3RpZmljYXRpb24uXG4gICAgICAgICogQHJldHVybnMgVGhlIG9ic2VydmVyIG9iamVjdCB0aGF0IGludm9rZXMgdGhlIHNwZWNpZmllZCBoYW5kbGVyIHVzaW5nIGEgbm90aWZpY2F0aW9uIGNvcnJlc3BvbmRpbmcgdG8gZWFjaCBtZXNzYWdlIGl0IHJlY2VpdmVzLlxuICAgICAgICAqL1xuXHRcdGZyb21Ob3RpZmllcjxUPihoYW5kbGVyOiAobm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb248VD4sIHRoaXNBcmc/OiBhbnkpID0+IHZvaWQpOiBPYnNlcnZlcjxUPjtcblx0fVxufVxuXG5cbihmdW5jdGlvbigpIHtcbiAgICB2YXIgb2JzZXJ2ZXI6IFJ4Lk9ic2VydmVyPGJvb2xlYW4+O1xuICAgIHZhciBuOiAobm90aWZpY2F0aW9uOiBSeC5Ob3RpZmljYXRpb248Ym9vbGVhbj4pID0+IHZvaWQgPSBvYnNlcnZlci50b05vdGlmaWVyKCk7XG5cbiAgICB2YXIgbzogUnguT2JzZXJ2ZXI8Ym9vbGVhbj4gPSBvYnNlcnZlci5hc09ic2VydmVyKCk7XG5cbiAgICB2YXIgYzogUnguQ2hlY2tlZE9ic2VydmVyPGJvb2xlYW4+ID0gb2JzZXJ2ZXIuY2hlY2tlZCgpO1xuXG4gICAgbyA9IG9ic2VydmVyLm5vdGlmeU9uKFJ4LlNjaGVkdWxlci5pbW1lZGlhdGUpO1xuXG4gICAgdmFyIHNvIDogUnguT2JzZXJ2ZXI8bnVtYmVyPiA9IFJ4Lk9ic2VydmVyLmZyb21Ob3RpZmllcjxudW1iZXI+KChuKSA9PiB7XG4gICAgICAgIC8vIEhhbmRsZSBuZXh0IGNhbGxzXG4gICAgICAgIGlmIChuLmtpbmQgPT09ICdOJykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ05leHQ6ICcgKyBuLnZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhhbmRsZSBlcnJvciBjYWxsc1xuICAgICAgICBpZiAobi5raW5kID09PSAnRScpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogJyArIG4uZXhjZXB0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhhbmRsZSBjb21wbGV0ZWRcbiAgICAgICAgaWYgKG4ua2luZCA9PT0gJ0MnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ29tcGxldGVkJylcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iXX0=