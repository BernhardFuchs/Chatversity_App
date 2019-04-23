"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FilterAngular2ModulesHelper = /** @class */ (function () {
    function FilterAngular2ModulesHelper() {
    }
    FilterAngular2ModulesHelper.prototype.helperFunc = function (context, text, options) {
        var NG2_MODULES = [
            'BrowserModule',
            'FormsModule',
            'HttpModule',
            'RouterModule'
        ];
        var len = NG2_MODULES.length;
        var i = 0;
        var result = false;
        for (i; i < len; i++) {
            if (text.indexOf(NG2_MODULES[i]) > -1) {
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
    return FilterAngular2ModulesHelper;
}());
exports.FilterAngular2ModulesHelper = FilterAngular2ModulesHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLWFuZ3VsYXIyLW1vZHVsZXMuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9odG1sLWVuZ2luZS1oZWxwZXJzL2ZpbHRlci1hbmd1bGFyMi1tb2R1bGVzLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBO0lBQUE7SUFzQkEsQ0FBQztJQXJCVSxnREFBVSxHQUFqQixVQUFrQixPQUFZLEVBQUUsSUFBWSxFQUFFLE9BQTJCO1FBQ3JFLElBQU0sV0FBVyxHQUFhO1lBQzFCLGVBQWU7WUFDZixhQUFhO1lBQ2IsWUFBWTtZQUNaLGNBQWM7U0FDakIsQ0FBQztRQUNGLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNuQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2FBQ2pCO1NBQ0o7UUFDRCxJQUFJLE1BQU0sRUFBRTtZQUNSLE9BQU8sT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QjthQUFNO1lBQ0gsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25DO0lBQ0wsQ0FBQztJQUNMLGtDQUFDO0FBQUQsQ0FBQyxBQXRCRCxJQXNCQztBQXRCWSxrRUFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJSHRtbEVuZ2luZUhlbHBlciwgSUhhbmRsZWJhcnNPcHRpb25zIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXIuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNsYXNzIEZpbHRlckFuZ3VsYXIyTW9kdWxlc0hlbHBlciBpbXBsZW1lbnRzIElIdG1sRW5naW5lSGVscGVyIHtcbiAgICBwdWJsaWMgaGVscGVyRnVuYyhjb250ZXh0OiBhbnksIHRleHQ6IHN0cmluZywgb3B0aW9uczogSUhhbmRsZWJhcnNPcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IE5HMl9NT0RVTEVTOiBzdHJpbmdbXSA9IFtcbiAgICAgICAgICAgICdCcm93c2VyTW9kdWxlJyxcbiAgICAgICAgICAgICdGb3Jtc01vZHVsZScsXG4gICAgICAgICAgICAnSHR0cE1vZHVsZScsXG4gICAgICAgICAgICAnUm91dGVyTW9kdWxlJ1xuICAgICAgICBdO1xuICAgICAgICBsZXQgbGVuID0gTkcyX01PRFVMRVMubGVuZ3RoO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0ZXh0LmluZGV4T2YoTkcyX01PRFVMRVNbaV0pID4gLTEpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZShjb250ZXh0KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==