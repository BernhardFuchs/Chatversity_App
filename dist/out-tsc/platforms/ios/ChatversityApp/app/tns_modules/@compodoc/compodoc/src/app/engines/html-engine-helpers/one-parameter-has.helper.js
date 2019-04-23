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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25lLXBhcmFtZXRlci1oYXMuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9odG1sLWVuZ2luZS1oZWxwZXJzL29uZS1wYXJhbWV0ZXItaGFzLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBO0lBQUE7SUFxQkEsQ0FBQztJQXBCVSwwQ0FBVSxHQUFqQixVQUFrQixPQUFZLEVBQUUsSUFBSSxFQUFFLFdBQVc7UUFDN0MsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLElBQUksT0FBTyxHQUF1QixTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFakQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUNMLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXZCLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkIsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxXQUFXLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDNUUsTUFBTSxHQUFHLElBQUksQ0FBQzthQUNqQjtTQUNKO1FBRUQsSUFBSSxNQUFNLEVBQUU7WUFDUixPQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUI7YUFBTTtZQUNILE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNuQztJQUNMLENBQUM7SUFDTCw0QkFBQztBQUFELENBQUMsQUFyQkQsSUFxQkM7QUFyQlksc0RBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUh0bWxFbmdpbmVIZWxwZXIsIElIYW5kbGViYXJzT3B0aW9ucyB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVyLmludGVyZmFjZSc7XG5cbmV4cG9ydCBjbGFzcyBPbmVQYXJhbWV0ZXJIYXNIZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCB0YWdzLCB0eXBlVG9DaGVjayk6IHN0cmluZyB7XG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgbGV0IGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuICAgICAgICBsZXQgb3B0aW9uczogSUhhbmRsZWJhcnNPcHRpb25zID0gYXJndW1lbnRzW2xlbl07XG5cbiAgICAgICAgbGV0IGkgPSAwLFxuICAgICAgICAgICAgbGVuZyA9IHRhZ3MubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaTsgaSA8IGxlbmc7IGkrKykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0YWdzW2ldW3R5cGVUb0NoZWNrXSAhPT0gJ3VuZGVmaW5lZCcgJiYgdGFnc1tpXVt0eXBlVG9DaGVja10gIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZShjb250ZXh0KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==