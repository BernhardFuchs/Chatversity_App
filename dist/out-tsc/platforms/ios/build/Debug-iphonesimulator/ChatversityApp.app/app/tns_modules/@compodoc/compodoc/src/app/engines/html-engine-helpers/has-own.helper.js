"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HasOwnHelper = /** @class */ (function () {
    function HasOwnHelper() {
    }
    HasOwnHelper.prototype.helperFunc = function (context, entity, key, options) {
        if (Object.hasOwnProperty.call(entity, key)) {
            return options.fn(context);
        }
        else {
            return options.inverse(context);
        }
    };
    return HasOwnHelper;
}());
exports.HasOwnHelper = HasOwnHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzLW93bi5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvaHRtbC1lbmdpbmUtaGVscGVycy9oYXMtb3duLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBO0lBQUE7SUFRQSxDQUFDO0lBUFUsaUNBQVUsR0FBakIsVUFBa0IsT0FBWSxFQUFFLE1BQU0sRUFBRSxHQUFRLEVBQUUsT0FBMkI7UUFDekUsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDekMsT0FBTyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzlCO2FBQU07WUFDSCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbkM7SUFDTCxDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUh0bWxFbmdpbmVIZWxwZXIsIElIYW5kbGViYXJzT3B0aW9ucyB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVyLmludGVyZmFjZSc7XG5cbmV4cG9ydCBjbGFzcyBIYXNPd25IZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCBlbnRpdHksIGtleTogYW55LCBvcHRpb25zOiBJSGFuZGxlYmFyc09wdGlvbnMpOiBzdHJpbmcge1xuICAgICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwoZW50aXR5LCBrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5mbihjb250ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UoY29udGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=