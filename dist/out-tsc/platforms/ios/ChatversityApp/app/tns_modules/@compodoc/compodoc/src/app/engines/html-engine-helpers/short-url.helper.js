"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShortURLHelper = /** @class */ (function () {
    function ShortURLHelper() {
    }
    ShortURLHelper.prototype.helperFunc = function (context, url, options) {
        var newUrl = url;
        var firstIndexOfSlash = newUrl.indexOf('/');
        var lastIndexOfSlash = newUrl.lastIndexOf('/');
        if (firstIndexOfSlash !== -1 || lastIndexOfSlash !== -1) {
            newUrl =
                newUrl.substr(0, firstIndexOfSlash + 1) +
                    '...' +
                    newUrl.substr(lastIndexOfSlash, newUrl.length);
        }
        return newUrl;
    };
    return ShortURLHelper;
}());
exports.ShortURLHelper = ShortURLHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvcnQtdXJsLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvaHRtbC1lbmdpbmUtaGVscGVycy9zaG9ydC11cmwuaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7SUFBQTtJQWFBLENBQUM7SUFaVSxtQ0FBVSxHQUFqQixVQUFrQixPQUFZLEVBQUUsR0FBVyxFQUFFLE9BQU87UUFDaEQsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLElBQUksaUJBQWlCLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QyxJQUFJLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0MsSUFBSSxpQkFBaUIsS0FBSyxDQUFDLENBQUMsSUFBSSxnQkFBZ0IsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNyRCxNQUFNO2dCQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixHQUFHLENBQUMsQ0FBQztvQkFDdkMsS0FBSztvQkFDTCxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN0RDtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFDTCxxQkFBQztBQUFELENBQUMsQUFiRCxJQWFDO0FBYlksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJSHRtbEVuZ2luZUhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVyLmludGVyZmFjZSc7XG5cbmV4cG9ydCBjbGFzcyBTaG9ydFVSTEhlbHBlciBpbXBsZW1lbnRzIElIdG1sRW5naW5lSGVscGVyIHtcbiAgICBwdWJsaWMgaGVscGVyRnVuYyhjb250ZXh0OiBhbnksIHVybDogc3RyaW5nLCBvcHRpb25zKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IG5ld1VybCA9IHVybDtcbiAgICAgICAgbGV0IGZpcnN0SW5kZXhPZlNsYXNoID0gbmV3VXJsLmluZGV4T2YoJy8nKTtcbiAgICAgICAgbGV0IGxhc3RJbmRleE9mU2xhc2ggPSBuZXdVcmwubGFzdEluZGV4T2YoJy8nKTtcbiAgICAgICAgaWYgKGZpcnN0SW5kZXhPZlNsYXNoICE9PSAtMSB8fCBsYXN0SW5kZXhPZlNsYXNoICE9PSAtMSkge1xuICAgICAgICAgICAgbmV3VXJsID1cbiAgICAgICAgICAgICAgICBuZXdVcmwuc3Vic3RyKDAsIGZpcnN0SW5kZXhPZlNsYXNoICsgMSkgK1xuICAgICAgICAgICAgICAgICcuLi4nICtcbiAgICAgICAgICAgICAgICBuZXdVcmwuc3Vic3RyKGxhc3RJbmRleE9mU2xhc2gsIG5ld1VybC5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdVcmw7XG4gICAgfVxufVxuIl19