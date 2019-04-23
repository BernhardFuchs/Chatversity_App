"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FilterAngular2ModulesHelper = /** @class */ (function () {
    function FilterAngular2ModulesHelper() {
    }
    FilterAngular2ModulesHelper.prototype.helperFunc = function (context, text, options) {
        var NG2_MODULES = [
            'BrowserModule',
            'FormsModule',
            'HttpModule',
            'RouterModule'
        ];
        var len = NG2_MODULES.length;
        var i = 0;
        var result = false;
        for (i; i < len; i++) {
            if (text.indexOf(NG2_MODULES[i]) > -1) {
                result = true;
            }
        }
        if (result) {
            return options.fn(context);
        }
        else {
            return options.inverse(context);
        }
    };
    return FilterAngular2ModulesHelper;
}());
exports.FilterAngular2ModulesHelper = FilterAngular2ModulesHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLWFuZ3VsYXIyLW1vZHVsZXMuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9lbmdpbmVzL2h0bWwtZW5naW5lLWhlbHBlcnMvZmlsdGVyLWFuZ3VsYXIyLW1vZHVsZXMuaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7SUFBQTtJQXNCQSxDQUFDO0lBckJVLGdEQUFVLEdBQWpCLFVBQWtCLE9BQVksRUFBRSxJQUFZLEVBQUUsT0FBMkI7UUFDckUsSUFBTSxXQUFXLEdBQWE7WUFDMUIsZUFBZTtZQUNmLGFBQWE7WUFDYixZQUFZO1lBQ1osY0FBYztTQUNqQixDQUFDO1FBQ0YsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbkIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ25DLE1BQU0sR0FBRyxJQUFJLENBQUM7YUFDakI7U0FDSjtRQUNELElBQUksTUFBTSxFQUFFO1lBQ1IsT0FBTyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzlCO2FBQU07WUFDSCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbkM7SUFDTCxDQUFDO0lBQ0wsa0NBQUM7QUFBRCxDQUFDLEFBdEJELElBc0JDO0FBdEJZLGtFQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElIdG1sRW5naW5lSGVscGVyLCBJSGFuZGxlYmFyc09wdGlvbnMgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlci5pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyQW5ndWxhcjJNb2R1bGVzSGVscGVyIGltcGxlbWVudHMgSUh0bWxFbmdpbmVIZWxwZXIge1xuICAgIHB1YmxpYyBoZWxwZXJGdW5jKGNvbnRleHQ6IGFueSwgdGV4dDogc3RyaW5nLCBvcHRpb25zOiBJSGFuZGxlYmFyc09wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgTkcyX01PRFVMRVM6IHN0cmluZ1tdID0gW1xuICAgICAgICAgICAgJ0Jyb3dzZXJNb2R1bGUnLFxuICAgICAgICAgICAgJ0Zvcm1zTW9kdWxlJyxcbiAgICAgICAgICAgICdIdHRwTW9kdWxlJyxcbiAgICAgICAgICAgICdSb3V0ZXJNb2R1bGUnXG4gICAgICAgIF07XG4gICAgICAgIGxldCBsZW4gPSBORzJfTU9EVUxFUy5sZW5ndGg7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKHRleHQuaW5kZXhPZihORzJfTU9EVUxFU1tpXSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuZm4oY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19