"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_1 = require("../../configuration");
var IsNotToggleHelper = /** @class */ (function () {
    function IsNotToggleHelper() {
    }
    IsNotToggleHelper.prototype.helperFunc = function (context, type, options) {
        var result = configuration_1.default.mainData.toggleMenuItems.indexOf(type);
        if (configuration_1.default.mainData.toggleMenuItems.indexOf('all') !== -1) {
            return options.inverse(context);
        }
        else if (result === -1) {
            return options.fn(context);
        }
        else {
            return options.inverse(context);
        }
    };
    return IsNotToggleHelper;
}());
exports.IsNotToggleHelper = IsNotToggleHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtbm90LXRvZ2dsZS5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9lbmdpbmVzL2h0bWwtZW5naW5lLWhlbHBlcnMvaXMtbm90LXRvZ2dsZS5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxxREFBZ0Q7QUFFaEQ7SUFDSTtJQUFlLENBQUM7SUFFVCxzQ0FBVSxHQUFqQixVQUFrQixPQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU87UUFDekMsSUFBSSxNQUFNLEdBQUcsdUJBQWEsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsRSxJQUFJLHVCQUFhLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDOUQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25DO2FBQU0sSUFBSSxNQUFNLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDdEIsT0FBTyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzlCO2FBQU07WUFDSCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbkM7SUFDTCxDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQUFDLEFBZEQsSUFjQztBQWRZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElIdG1sRW5naW5lSGVscGVyIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXIuaW50ZXJmYWNlJztcbmltcG9ydCBDb25maWd1cmF0aW9uIGZyb20gJy4uLy4uL2NvbmZpZ3VyYXRpb24nO1xuXG5leHBvcnQgY2xhc3MgSXNOb3RUb2dnbGVIZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCB0eXBlLCBvcHRpb25zKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRvZ2dsZU1lbnVJdGVtcy5pbmRleE9mKHR5cGUpO1xuXG4gICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLnRvZ2dsZU1lbnVJdGVtcy5pbmRleE9mKCdhbGwnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UoY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuZm4oY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19