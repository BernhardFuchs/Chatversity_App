"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShortURLHelper = /** @class */ (function () {
    function ShortURLHelper() {
    }
    ShortURLHelper.prototype.helperFunc = function (context, url, options) {
        var newUrl = url;
        var firstIndexOfSlash = newUrl.indexOf('/');
        var lastIndexOfSlash = newUrl.lastIndexOf('/');
        if (firstIndexOfSlash !== -1 || lastIndexOfSlash !== -1) {
            newUrl =
                newUrl.substr(0, firstIndexOfSlash + 1) +
                    '...' +
                    newUrl.substr(lastIndexOfSlash, newUrl.length);
        }
        return newUrl;
    };
    return ShortURLHelper;
}());
exports.ShortURLHelper = ShortURLHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvcnQtdXJsLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9odG1sLWVuZ2luZS1oZWxwZXJzL3Nob3J0LXVybC5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTtJQUFBO0lBYUEsQ0FBQztJQVpVLG1DQUFVLEdBQWpCLFVBQWtCLE9BQVksRUFBRSxHQUFXLEVBQUUsT0FBTztRQUNoRCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsSUFBSSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLElBQUksZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQyxJQUFJLGlCQUFpQixLQUFLLENBQUMsQ0FBQyxJQUFJLGdCQUFnQixLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ3JELE1BQU07Z0JBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO29CQUN2QyxLQUFLO29CQUNMLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3REO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQyxBQWJELElBYUM7QUFiWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElIdG1sRW5naW5lSGVscGVyIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXIuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNsYXNzIFNob3J0VVJMSGVscGVyIGltcGxlbWVudHMgSUh0bWxFbmdpbmVIZWxwZXIge1xuICAgIHB1YmxpYyBoZWxwZXJGdW5jKGNvbnRleHQ6IGFueSwgdXJsOiBzdHJpbmcsIG9wdGlvbnMpOiBzdHJpbmcge1xuICAgICAgICBsZXQgbmV3VXJsID0gdXJsO1xuICAgICAgICBsZXQgZmlyc3RJbmRleE9mU2xhc2ggPSBuZXdVcmwuaW5kZXhPZignLycpO1xuICAgICAgICBsZXQgbGFzdEluZGV4T2ZTbGFzaCA9IG5ld1VybC5sYXN0SW5kZXhPZignLycpO1xuICAgICAgICBpZiAoZmlyc3RJbmRleE9mU2xhc2ggIT09IC0xIHx8IGxhc3RJbmRleE9mU2xhc2ggIT09IC0xKSB7XG4gICAgICAgICAgICBuZXdVcmwgPVxuICAgICAgICAgICAgICAgIG5ld1VybC5zdWJzdHIoMCwgZmlyc3RJbmRleE9mU2xhc2ggKyAxKSArXG4gICAgICAgICAgICAgICAgJy4uLicgK1xuICAgICAgICAgICAgICAgIG5ld1VybC5zdWJzdHIobGFzdEluZGV4T2ZTbGFzaCwgbmV3VXJsLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1VybDtcbiAgICB9XG59XG4iXX0=