"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsdocParamsValidHelper = /** @class */ (function () {
    function JsdocParamsValidHelper() {
    }
    JsdocParamsValidHelper.prototype.helperFunc = function (context, jsdocTags, options) {
        var i = 0;
        var len = jsdocTags.length;
        var tags = [];
        var valid = false;
        for (i; i < len; i++) {
            if (jsdocTags[i].tagName) {
                if (jsdocTags[i].tagName.text === 'param') {
                    valid = true;
                }
            }
        }
        if (valid) {
            return options.fn(context);
        }
        else {
            return options.inverse(context);
        }
    };
    return JsdocParamsValidHelper;
}());
exports.JsdocParamsValidHelper = JsdocParamsValidHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNkb2MtcGFyYW1zLXZhbGlkLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9odG1sLWVuZ2luZS1oZWxwZXJzL2pzZG9jLXBhcmFtcy12YWxpZC5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQTtJQUFBO0lBb0JBLENBQUM7SUFuQlUsMkNBQVUsR0FBakIsVUFBa0IsT0FBWSxFQUFFLFNBQThCLEVBQUUsT0FBMkI7UUFDdkYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7UUFFbEIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQixJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3RCLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO29CQUN2QyxLQUFLLEdBQUcsSUFBSSxDQUFDO2lCQUNoQjthQUNKO1NBQ0o7UUFDRCxJQUFJLEtBQUssRUFBRTtZQUNQLE9BQU8sT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QjthQUFNO1lBQ0gsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25DO0lBQ0wsQ0FBQztJQUNMLDZCQUFDO0FBQUQsQ0FBQyxBQXBCRCxJQW9CQztBQXBCWSx3REFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJSHRtbEVuZ2luZUhlbHBlciwgSUhhbmRsZWJhcnNPcHRpb25zIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7IEpzZG9jVGFnSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9qc2RvYy10YWcuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNsYXNzIEpzZG9jUGFyYW1zVmFsaWRIZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCBqc2RvY1RhZ3M6IEpzZG9jVGFnSW50ZXJmYWNlW10sIG9wdGlvbnM6IElIYW5kbGViYXJzT3B0aW9ucykge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGxldCBsZW4gPSBqc2RvY1RhZ3MubGVuZ3RoO1xuICAgICAgICBsZXQgdGFncyA9IFtdO1xuICAgICAgICBsZXQgdmFsaWQgPSBmYWxzZTtcblxuICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGpzZG9jVGFnc1tpXS50YWdOYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGpzZG9jVGFnc1tpXS50YWdOYW1lLnRleHQgPT09ICdwYXJhbScpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZShjb250ZXh0KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==