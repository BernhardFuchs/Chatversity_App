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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtbm90LXRvZ2dsZS5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvaHRtbC1lbmdpbmUtaGVscGVycy9pcy1ub3QtdG9nZ2xlLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFEQUFnRDtBQUVoRDtJQUNJO0lBQWUsQ0FBQztJQUVULHNDQUFVLEdBQWpCLFVBQWtCLE9BQVksRUFBRSxJQUFJLEVBQUUsT0FBTztRQUN6QyxJQUFJLE1BQU0sR0FBRyx1QkFBYSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWxFLElBQUksdUJBQWEsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUM5RCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbkM7YUFBTSxJQUFJLE1BQU0sS0FBSyxDQUFDLENBQUMsRUFBRTtZQUN0QixPQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUI7YUFBTTtZQUNILE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNuQztJQUNMLENBQUM7SUFDTCx3QkFBQztBQUFELENBQUMsQUFkRCxJQWNDO0FBZFksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUh0bWxFbmdpbmVIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlci5pbnRlcmZhY2UnO1xuaW1wb3J0IENvbmZpZ3VyYXRpb24gZnJvbSAnLi4vLi4vY29uZmlndXJhdGlvbic7XG5cbmV4cG9ydCBjbGFzcyBJc05vdFRvZ2dsZUhlbHBlciBpbXBsZW1lbnRzIElIdG1sRW5naW5lSGVscGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBwdWJsaWMgaGVscGVyRnVuYyhjb250ZXh0OiBhbnksIHR5cGUsIG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudG9nZ2xlTWVudUl0ZW1zLmluZGV4T2YodHlwZSk7XG5cbiAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudG9nZ2xlTWVudUl0ZW1zLmluZGV4T2YoJ2FsbCcpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZShjb250ZXh0KTtcbiAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5mbihjb250ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UoY29udGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=