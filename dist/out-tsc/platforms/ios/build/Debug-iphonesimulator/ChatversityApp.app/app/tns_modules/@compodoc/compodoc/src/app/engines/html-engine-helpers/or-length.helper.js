"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrLengthHelper = /** @class */ (function () {
    function OrLengthHelper() {
    }
    OrLengthHelper.prototype.helperFunc = function (context /* any, any, ..., options */) {
        var len = arguments.length - 1;
        var options = arguments[len];
        // We start at 1 because of options
        for (var i = 1; i < len; i++) {
            if (typeof arguments[i] !== 'undefined') {
                if (Object.keys(arguments[i]).length > 0) {
                    return options.fn(context);
                }
            }
        }
        return options.inverse(context);
    };
    return OrLengthHelper;
}());
exports.OrLengthHelper = OrLengthHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ItbGVuZ3RoLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9odG1sLWVuZ2luZS1oZWxwZXJzL29yLWxlbmd0aC5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTtJQUFBO0lBZ0JBLENBQUM7SUFmVSxtQ0FBVSxHQUFqQixVQUFrQixPQUFZLENBQUMsNEJBQTRCO1FBQ3ZELElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLElBQUksT0FBTyxHQUF1QixTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFakQsbUNBQW1DO1FBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUIsSUFBSSxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFXLEVBQUU7Z0JBQ3JDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUN0QyxPQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzlCO2FBQ0o7U0FDSjtRQUVELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ0wscUJBQUM7QUFBRCxDQUFDLEFBaEJELElBZ0JDO0FBaEJZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUh0bWxFbmdpbmVIZWxwZXIsIElIYW5kbGViYXJzT3B0aW9ucyB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVyLmludGVyZmFjZSc7XG5cbmV4cG9ydCBjbGFzcyBPckxlbmd0aEhlbHBlciBpbXBsZW1lbnRzIElIdG1sRW5naW5lSGVscGVyIHtcbiAgICBwdWJsaWMgaGVscGVyRnVuYyhjb250ZXh0OiBhbnkgLyogYW55LCBhbnksIC4uLiwgb3B0aW9ucyAqLykge1xuICAgICAgICBsZXQgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gICAgICAgIGxldCBvcHRpb25zOiBJSGFuZGxlYmFyc09wdGlvbnMgPSBhcmd1bWVudHNbbGVuXTtcblxuICAgICAgICAvLyBXZSBzdGFydCBhdCAxIGJlY2F1c2Ugb2Ygb3B0aW9uc1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1tpXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoYXJndW1lbnRzW2ldKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UoY29udGV4dCk7XG4gICAgfVxufVxuIl19