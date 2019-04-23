"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DebugHelper = /** @class */ (function () {
    function DebugHelper() {
    }
    DebugHelper.prototype.helperFunc = function (context, optionalValue) {
        console.log('Current Context');
        console.log('====================');
        console.log(context);
        if (optionalValue) {
            console.log('OptionalValue');
            console.log('====================');
            console.log(optionalValue);
        }
    };
    return DebugHelper;
}());
exports.DebugHelper = DebugHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWcuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9odG1sLWVuZ2luZS1oZWxwZXJzL2RlYnVnLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBO0lBQUE7SUFZQSxDQUFDO0lBWFUsZ0NBQVUsR0FBakIsVUFBa0IsT0FBWSxFQUFFLGFBQWtCO1FBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVyQixJQUFJLGFBQWEsRUFBRTtZQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDOUI7SUFDTCxDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQVpZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUh0bWxFbmdpbmVIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlci5pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgRGVidWdIZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCBvcHRpb25hbFZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0N1cnJlbnQgQ29udGV4dCcpO1xuICAgICAgICBjb25zb2xlLmxvZygnPT09PT09PT09PT09PT09PT09PT0nKTtcbiAgICAgICAgY29uc29sZS5sb2coY29udGV4dCk7XG5cbiAgICAgICAgaWYgKG9wdGlvbmFsVmFsdWUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdPcHRpb25hbFZhbHVlJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPT09PT09PT09PT09PT09PT09PT0nKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG9wdGlvbmFsVmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19