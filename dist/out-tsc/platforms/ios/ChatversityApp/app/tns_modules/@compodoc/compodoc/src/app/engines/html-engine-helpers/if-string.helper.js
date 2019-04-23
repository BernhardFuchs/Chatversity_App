"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IfStringHelper = /** @class */ (function () {
    function IfStringHelper() {
    }
    IfStringHelper.prototype.helperFunc = function (context, a, options) {
        if (typeof a === 'string') {
            return options.fn(context);
        }
        return options.inverse(context);
    };
    return IfStringHelper;
}());
exports.IfStringHelper = IfStringHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWYtc3RyaW5nLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvaHRtbC1lbmdpbmUtaGVscGVycy9pZi1zdHJpbmcuaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7SUFBQTtJQU9BLENBQUM7SUFOVSxtQ0FBVSxHQUFqQixVQUFrQixPQUFZLEVBQUUsQ0FBTSxFQUFFLE9BQTJCO1FBQy9ELElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ3ZCLE9BQU8sT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QjtRQUNELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ0wscUJBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQVBZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUh0bWxFbmdpbmVIZWxwZXIsIElIYW5kbGViYXJzT3B0aW9ucyB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVyLmludGVyZmFjZSc7XG5cbmV4cG9ydCBjbGFzcyBJZlN0cmluZ0hlbHBlciBpbXBsZW1lbnRzIElIdG1sRW5naW5lSGVscGVyIHtcbiAgICBwdWJsaWMgaGVscGVyRnVuYyhjb250ZXh0OiBhbnksIGE6IGFueSwgb3B0aW9uczogSUhhbmRsZWJhcnNPcHRpb25zKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuZm4oY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZShjb250ZXh0KTtcbiAgICB9XG59XG4iXX0=