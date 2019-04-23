"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsdocReturnsCommentHelper = /** @class */ (function () {
    function JsdocReturnsCommentHelper() {
    }
    JsdocReturnsCommentHelper.prototype.helperFunc = function (context, jsdocTags, options) {
        var i = 0;
        var len = jsdocTags.length;
        var result;
        for (i; i < len; i++) {
            if (jsdocTags[i].tagName) {
                if (jsdocTags[i].tagName.text === 'returns' ||
                    jsdocTags[i].tagName.text === 'return') {
                    result = jsdocTags[i].comment;
                    break;
                }
            }
        }
        return result;
    };
    return JsdocReturnsCommentHelper;
}());
exports.JsdocReturnsCommentHelper = JsdocReturnsCommentHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNkb2MtcmV0dXJucy1jb21tZW50LmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9odG1sLWVuZ2luZS1oZWxwZXJzL2pzZG9jLXJldHVybnMtY29tbWVudC5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTtJQUFBO0lBa0JBLENBQUM7SUFqQlUsOENBQVUsR0FBakIsVUFBa0IsT0FBWSxFQUFFLFNBQXFCLEVBQUUsT0FBMkI7UUFDOUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLE1BQU0sQ0FBQztRQUNYLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEIsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO2dCQUN0QixJQUNJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFNBQVM7b0JBQ3ZDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFDeEM7b0JBQ0UsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzlCLE1BQU07aUJBQ1Q7YUFDSjtTQUNKO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNMLGdDQUFDO0FBQUQsQ0FBQyxBQWxCRCxJQWtCQztBQWxCWSw4REFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJSHRtbEVuZ2luZUhlbHBlciwgSUhhbmRsZWJhcnNPcHRpb25zIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXIuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNsYXNzIEpzZG9jUmV0dXJuc0NvbW1lbnRIZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCBqc2RvY1RhZ3M6IEFycmF5PGFueT4sIG9wdGlvbnM6IElIYW5kbGViYXJzT3B0aW9ucykge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGxldCBsZW4gPSBqc2RvY1RhZ3MubGVuZ3RoO1xuICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGpzZG9jVGFnc1tpXS50YWdOYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBqc2RvY1RhZ3NbaV0udGFnTmFtZS50ZXh0ID09PSAncmV0dXJucycgfHxcbiAgICAgICAgICAgICAgICAgICAganNkb2NUYWdzW2ldLnRhZ05hbWUudGV4dCA9PT0gJ3JldHVybidcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0ganNkb2NUYWdzW2ldLmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbiJdfQ==