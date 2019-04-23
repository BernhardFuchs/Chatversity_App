"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RelativeURLHelper = /** @class */ (function () {
    function RelativeURLHelper() {
    }
    RelativeURLHelper.prototype.helperFunc = function (context, currentDepth, options) {
        switch (currentDepth) {
            case 0:
                return './';
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                return '../'.repeat(currentDepth);
        }
        return '';
    };
    return RelativeURLHelper;
}());
exports.RelativeURLHelper = RelativeURLHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsYXRpdmUtdXJsLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9odG1sLWVuZ2luZS1oZWxwZXJzL3JlbGF0aXZlLXVybC5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTtJQUFBO0lBZUEsQ0FBQztJQWRVLHNDQUFVLEdBQWpCLFVBQWtCLE9BQVksRUFBRSxZQUFvQixFQUFFLE9BQU87UUFDekQsUUFBUSxZQUFZLEVBQUU7WUFDbEIsS0FBSyxDQUFDO2dCQUNGLE9BQU8sSUFBSSxDQUFDO1lBQ2hCLEtBQUssQ0FBQyxDQUFDO1lBQ1AsS0FBSyxDQUFDLENBQUM7WUFDUCxLQUFLLENBQUMsQ0FBQztZQUNQLEtBQUssQ0FBQyxDQUFDO1lBQ1AsS0FBSyxDQUFDO2dCQUNGLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN6QztRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUNMLHdCQUFDO0FBQUQsQ0FBQyxBQWZELElBZUM7QUFmWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJSHRtbEVuZ2luZUhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVyLmludGVyZmFjZSc7XG5cbmV4cG9ydCBjbGFzcyBSZWxhdGl2ZVVSTEhlbHBlciBpbXBsZW1lbnRzIElIdG1sRW5naW5lSGVscGVyIHtcbiAgICBwdWJsaWMgaGVscGVyRnVuYyhjb250ZXh0OiBhbnksIGN1cnJlbnREZXB0aDogbnVtYmVyLCBvcHRpb25zKTogc3RyaW5nIHtcbiAgICAgICAgc3dpdGNoIChjdXJyZW50RGVwdGgpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICByZXR1cm4gJy4vJztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICByZXR1cm4gJy4uLycucmVwZWF0KGN1cnJlbnREZXB0aCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxufVxuIl19