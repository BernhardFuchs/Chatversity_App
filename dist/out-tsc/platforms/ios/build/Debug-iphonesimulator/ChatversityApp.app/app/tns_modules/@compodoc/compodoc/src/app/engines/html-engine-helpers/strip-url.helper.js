"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StripURLHelper = /** @class */ (function () {
    function StripURLHelper() {
    }
    StripURLHelper.prototype.helperFunc = function (context, prefix, url, options) {
        return prefix + url.split("/").pop();
    };
    return StripURLHelper;
}());
exports.StripURLHelper = StripURLHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaXAtdXJsLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9odG1sLWVuZ2luZS1oZWxwZXJzL3N0cmlwLXVybC5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTtJQUFBO0lBSUEsQ0FBQztJQUhVLG1DQUFVLEdBQWpCLFVBQWtCLE9BQVksRUFBRSxNQUFjLEVBQUUsR0FBVyxFQUFFLE9BQU87UUFDaEUsT0FBTyxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBQ0wscUJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUh0bWxFbmdpbmVIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlci5pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgU3RyaXBVUkxIZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCBwcmVmaXg6IHN0cmluZywgdXJsOiBzdHJpbmcsIG9wdGlvbnMpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gcHJlZml4ICsgdXJsLnNwbGl0KFwiL1wiKS5wb3AoKTtcbiAgICB9XG59Il19