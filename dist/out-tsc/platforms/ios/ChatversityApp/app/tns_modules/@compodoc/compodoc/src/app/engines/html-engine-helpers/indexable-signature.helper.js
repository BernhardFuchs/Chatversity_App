"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IndexableSignatureHelper = /** @class */ (function () {
    function IndexableSignatureHelper() {
    }
    IndexableSignatureHelper.prototype.helperFunc = function (context, method) {
        var args = method.args.map(function (arg) { return arg.name + ": " + arg.type; }).join(', ');
        if (method.name) {
            return method.name + "[" + args + "]";
        }
        else {
            return "[" + args + "]";
        }
    };
    return IndexableSignatureHelper;
}());
exports.IndexableSignatureHelper = IndexableSignatureHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhhYmxlLXNpZ25hdHVyZS5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9lbmdpbmVzL2h0bWwtZW5naW5lLWhlbHBlcnMvaW5kZXhhYmxlLXNpZ25hdHVyZS5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTtJQUFBO0lBU0EsQ0FBQztJQVJVLDZDQUFVLEdBQWpCLFVBQWtCLE9BQVksRUFBRSxNQUFNO1FBQ2xDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUcsR0FBRyxDQUFDLElBQUksVUFBSyxHQUFHLENBQUMsSUFBTSxFQUExQixDQUEwQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNFLElBQUksTUFBTSxDQUFDLElBQUksRUFBRTtZQUNiLE9BQVUsTUFBTSxDQUFDLElBQUksU0FBSSxJQUFJLE1BQUcsQ0FBQztTQUNwQzthQUFNO1lBQ0gsT0FBTyxNQUFJLElBQUksTUFBRyxDQUFDO1NBQ3RCO0lBQ0wsQ0FBQztJQUNMLCtCQUFDO0FBQUQsQ0FBQyxBQVRELElBU0M7QUFUWSw0REFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJSHRtbEVuZ2luZUhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVyLmludGVyZmFjZSc7XG5cbmV4cG9ydCBjbGFzcyBJbmRleGFibGVTaWduYXR1cmVIZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCBtZXRob2QpIHtcbiAgICAgICAgY29uc3QgYXJncyA9IG1ldGhvZC5hcmdzLm1hcChhcmcgPT4gYCR7YXJnLm5hbWV9OiAke2FyZy50eXBlfWApLmpvaW4oJywgJyk7XG4gICAgICAgIGlmIChtZXRob2QubmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke21ldGhvZC5uYW1lfVske2FyZ3N9XWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYFske2FyZ3N9XWA7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=