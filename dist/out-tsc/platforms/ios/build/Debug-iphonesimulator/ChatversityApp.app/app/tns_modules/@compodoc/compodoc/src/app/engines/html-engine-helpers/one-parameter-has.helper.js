"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OneParameterHasHelper = /** @class */ (function () {
    function OneParameterHasHelper() {
    }
    OneParameterHasHelper.prototype.helperFunc = function (context, tags, typeToCheck) {
        var result = false;
        var len = arguments.length - 1;
        var options = arguments[len];
        var i = 0, leng = tags.length;
        for (i; i < leng; i++) {
            if (typeof tags[i][typeToCheck] !== 'undefined' && tags[i][typeToCheck] !== '') {
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
    return OneParameterHasHelper;
}());
exports.OneParameterHasHelper = OneParameterHasHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25lLXBhcmFtZXRlci1oYXMuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9lbmdpbmVzL2h0bWwtZW5naW5lLWhlbHBlcnMvb25lLXBhcmFtZXRlci1oYXMuaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7SUFBQTtJQXFCQSxDQUFDO0lBcEJVLDBDQUFVLEdBQWpCLFVBQWtCLE9BQVksRUFBRSxJQUFJLEVBQUUsV0FBVztRQUM3QyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDL0IsSUFBSSxPQUFPLEdBQXVCLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqRCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQ0wsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFdkIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQixJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLFdBQVcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUM1RSxNQUFNLEdBQUcsSUFBSSxDQUFDO2FBQ2pCO1NBQ0o7UUFFRCxJQUFJLE1BQU0sRUFBRTtZQUNSLE9BQU8sT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QjthQUFNO1lBQ0gsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25DO0lBQ0wsQ0FBQztJQUNMLDRCQUFDO0FBQUQsQ0FBQyxBQXJCRCxJQXFCQztBQXJCWSxzREFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJSHRtbEVuZ2luZUhlbHBlciwgSUhhbmRsZWJhcnNPcHRpb25zIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXIuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNsYXNzIE9uZVBhcmFtZXRlckhhc0hlbHBlciBpbXBsZW1lbnRzIElIdG1sRW5naW5lSGVscGVyIHtcbiAgICBwdWJsaWMgaGVscGVyRnVuYyhjb250ZXh0OiBhbnksIHRhZ3MsIHR5cGVUb0NoZWNrKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBsZXQgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gICAgICAgIGxldCBvcHRpb25zOiBJSGFuZGxlYmFyc09wdGlvbnMgPSBhcmd1bWVudHNbbGVuXTtcblxuICAgICAgICBsZXQgaSA9IDAsXG4gICAgICAgICAgICBsZW5nID0gdGFncy5sZW5ndGg7XG5cbiAgICAgICAgZm9yIChpOyBpIDwgbGVuZzsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRhZ3NbaV1bdHlwZVRvQ2hlY2tdICE9PSAndW5kZWZpbmVkJyAmJiB0YWdzW2ldW3R5cGVUb0NoZWNrXSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuZm4oY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19