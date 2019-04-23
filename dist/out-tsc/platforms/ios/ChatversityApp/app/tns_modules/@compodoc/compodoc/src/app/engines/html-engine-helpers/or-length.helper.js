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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ItbGVuZ3RoLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvaHRtbC1lbmdpbmUtaGVscGVycy9vci1sZW5ndGguaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7SUFBQTtJQWdCQSxDQUFDO0lBZlUsbUNBQVUsR0FBakIsVUFBa0IsT0FBWSxDQUFDLDRCQUE0QjtRQUN2RCxJQUFJLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLE9BQU8sR0FBdUIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpELG1DQUFtQztRQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzFCLElBQUksT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssV0FBVyxFQUFFO2dCQUNyQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDdEMsT0FBTyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUM5QjthQUNKO1NBQ0o7UUFFRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQyxBQWhCRCxJQWdCQztBQWhCWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElIdG1sRW5naW5lSGVscGVyLCBJSGFuZGxlYmFyc09wdGlvbnMgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlci5pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgT3JMZW5ndGhIZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55IC8qIGFueSwgYW55LCAuLi4sIG9wdGlvbnMgKi8pIHtcbiAgICAgICAgbGV0IGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuICAgICAgICBsZXQgb3B0aW9uczogSUhhbmRsZWJhcnNPcHRpb25zID0gYXJndW1lbnRzW2xlbl07XG5cbiAgICAgICAgLy8gV2Ugc3RhcnQgYXQgMSBiZWNhdXNlIG9mIG9wdGlvbnNcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbaV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGFyZ3VtZW50c1tpXSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5mbihjb250ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKGNvbnRleHQpO1xuICAgIH1cbn1cbiJdfQ==