/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('getUserMedia', function (global, Zone, api) {
    function wrapFunctionArgs(func, source) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            var wrappedArgs = api.bindArguments(args, source ? source : func.name);
            return func.apply(this, wrappedArgs);
        };
    }
    var navigator = global['navigator'];
    if (navigator && navigator.getUserMedia) {
        navigator.getUserMedia = wrapFunctionArgs(navigator.getUserMedia);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViYXBpcy11c2VyLW1lZGlhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvYnJvd3Nlci93ZWJhcGlzLXVzZXItbWVkaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsVUFBQyxNQUFXLEVBQUUsSUFBUyxFQUFFLEdBQWlCO0lBQzFFLFNBQVMsZ0JBQWdCLENBQUMsSUFBYyxFQUFFLE1BQWU7UUFDdkQsT0FBTztZQUNMLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNuRCxJQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUUsSUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xGLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNELElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNwQyxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsWUFBWSxFQUFFO1FBQ3ZDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQ25FO0FBQ0gsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5ab25lLl9fbG9hZF9wYXRjaCgnZ2V0VXNlck1lZGlhJywgKGdsb2JhbDogYW55LCBab25lOiBhbnksIGFwaTogX1pvbmVQcml2YXRlKSA9PiB7XG4gIGZ1bmN0aW9uIHdyYXBGdW5jdGlvbkFyZ3MoZnVuYzogRnVuY3Rpb24sIHNvdXJjZT86IHN0cmluZyk6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIGNvbnN0IHdyYXBwZWRBcmdzID0gYXBpLmJpbmRBcmd1bWVudHMoYXJncywgc291cmNlID8gc291cmNlIDogKGZ1bmMgYXMgYW55KS5uYW1lKTtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIHdyYXBwZWRBcmdzKTtcbiAgICB9O1xuICB9XG4gIGxldCBuYXZpZ2F0b3IgPSBnbG9iYWxbJ25hdmlnYXRvciddO1xuICBpZiAobmF2aWdhdG9yICYmIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEpIHtcbiAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhID0gd3JhcEZ1bmN0aW9uQXJncyhuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKTtcbiAgfVxufSk7XG4iXX0=