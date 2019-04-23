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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhhYmxlLXNpZ25hdHVyZS5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvaHRtbC1lbmdpbmUtaGVscGVycy9pbmRleGFibGUtc2lnbmF0dXJlLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBO0lBQUE7SUFTQSxDQUFDO0lBUlUsNkNBQVUsR0FBakIsVUFBa0IsT0FBWSxFQUFFLE1BQU07UUFDbEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBRyxHQUFHLENBQUMsSUFBSSxVQUFLLEdBQUcsQ0FBQyxJQUFNLEVBQTFCLENBQTBCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0UsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQ2IsT0FBVSxNQUFNLENBQUMsSUFBSSxTQUFJLElBQUksTUFBRyxDQUFDO1NBQ3BDO2FBQU07WUFDSCxPQUFPLE1BQUksSUFBSSxNQUFHLENBQUM7U0FDdEI7SUFDTCxDQUFDO0lBQ0wsK0JBQUM7QUFBRCxDQUFDLEFBVEQsSUFTQztBQVRZLDREQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElIdG1sRW5naW5lSGVscGVyIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXIuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNsYXNzIEluZGV4YWJsZVNpZ25hdHVyZUhlbHBlciBpbXBsZW1lbnRzIElIdG1sRW5naW5lSGVscGVyIHtcbiAgICBwdWJsaWMgaGVscGVyRnVuYyhjb250ZXh0OiBhbnksIG1ldGhvZCkge1xuICAgICAgICBjb25zdCBhcmdzID0gbWV0aG9kLmFyZ3MubWFwKGFyZyA9PiBgJHthcmcubmFtZX06ICR7YXJnLnR5cGV9YCkuam9pbignLCAnKTtcbiAgICAgICAgaWYgKG1ldGhvZC5uYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7bWV0aG9kLm5hbWV9WyR7YXJnc31dYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgWyR7YXJnc31dYDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==