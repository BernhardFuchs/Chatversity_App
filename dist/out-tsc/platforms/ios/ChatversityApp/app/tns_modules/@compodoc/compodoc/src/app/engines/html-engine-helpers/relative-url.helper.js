"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RelativeURLHelper = /** @class */ (function () {
    function RelativeURLHelper() {
    }
    RelativeURLHelper.prototype.helperFunc = function (context, currentDepth, options) {
        switch (currentDepth) {
            case 0:
                return './';
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                return '../'.repeat(currentDepth);
        }
        return '';
    };
    return RelativeURLHelper;
}());
exports.RelativeURLHelper = RelativeURLHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsYXRpdmUtdXJsLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvaHRtbC1lbmdpbmUtaGVscGVycy9yZWxhdGl2ZS11cmwuaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7SUFBQTtJQWVBLENBQUM7SUFkVSxzQ0FBVSxHQUFqQixVQUFrQixPQUFZLEVBQUUsWUFBb0IsRUFBRSxPQUFPO1FBQ3pELFFBQVEsWUFBWSxFQUFFO1lBQ2xCLEtBQUssQ0FBQztnQkFDRixPQUFPLElBQUksQ0FBQztZQUNoQixLQUFLLENBQUMsQ0FBQztZQUNQLEtBQUssQ0FBQyxDQUFDO1lBQ1AsS0FBSyxDQUFDLENBQUM7WUFDUCxLQUFLLENBQUMsQ0FBQztZQUNQLEtBQUssQ0FBQztnQkFDRixPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDekM7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFDTCx3QkFBQztBQUFELENBQUMsQUFmRCxJQWVDO0FBZlksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUh0bWxFbmdpbmVIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlci5pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgUmVsYXRpdmVVUkxIZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCBjdXJyZW50RGVwdGg6IG51bWJlciwgb3B0aW9ucyk6IHN0cmluZyB7XG4gICAgICAgIHN3aXRjaCAoY3VycmVudERlcHRoKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgcmV0dXJuICcuLyc7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgcmV0dXJuICcuLi8nLnJlcGVhdChjdXJyZW50RGVwdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbn1cbiJdfQ==