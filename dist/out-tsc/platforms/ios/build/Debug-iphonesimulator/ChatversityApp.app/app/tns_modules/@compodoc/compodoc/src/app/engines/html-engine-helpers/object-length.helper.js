"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectLengthHelper = /** @class */ (function () {
    function ObjectLengthHelper() {
    }
    ObjectLengthHelper.prototype.helperFunc = function (context, obj, operator, length) {
        var len = arguments.length - 1;
        var options = arguments[len];
        if (typeof obj !== 'object') {
            return options.inverse(context);
        }
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        var result;
        switch (operator) {
            case '===':
                result = size === length;
                break;
            case '!==':
                result = size !== length;
                break;
            case '>':
                result = size > length;
                break;
            default: {
                throw new Error('helper {{objectLength}}: invalid operator: `' + operator + '`');
            }
        }
        if (result === false) {
            return options.inverse(context);
        }
        return options.fn(context);
    };
    return ObjectLengthHelper;
}());
exports.ObjectLengthHelper = ObjectLengthHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LWxlbmd0aC5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvaHRtbC1lbmdpbmUtaGVscGVycy9vYmplY3QtbGVuZ3RoLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBO0lBQUE7SUFzQ0EsQ0FBQztJQXJDVSx1Q0FBVSxHQUFqQixVQUFrQixPQUFZLEVBQUUsR0FBVyxFQUFFLFFBQWdCLEVBQUUsTUFBYztRQUN6RSxJQUFJLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLE9BQU8sR0FBdUIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpELElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQ3pCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNuQztRQUVELElBQUksSUFBSSxHQUFHLENBQUMsRUFDUixHQUFHLENBQUM7UUFDUixLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUU7WUFDYixJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3pCLElBQUksRUFBRSxDQUFDO2FBQ1Y7U0FDSjtRQUVELElBQUksTUFBTSxDQUFDO1FBQ1gsUUFBUSxRQUFRLEVBQUU7WUFDZCxLQUFLLEtBQUs7Z0JBQ04sTUFBTSxHQUFHLElBQUksS0FBSyxNQUFNLENBQUM7Z0JBQ3pCLE1BQU07WUFDVixLQUFLLEtBQUs7Z0JBQ04sTUFBTSxHQUFHLElBQUksS0FBSyxNQUFNLENBQUM7Z0JBQ3pCLE1BQU07WUFDVixLQUFLLEdBQUc7Z0JBQ0osTUFBTSxHQUFHLElBQUksR0FBRyxNQUFNLENBQUM7Z0JBQ3ZCLE1BQU07WUFDVixPQUFPLENBQUMsQ0FBQztnQkFDTCxNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUMsQ0FBQzthQUNwRjtTQUNKO1FBRUQsSUFBSSxNQUFNLEtBQUssS0FBSyxFQUFFO1lBQ2xCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNuQztRQUNELE9BQU8sT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQ0wseUJBQUM7QUFBRCxDQUFDLEFBdENELElBc0NDO0FBdENZLGdEQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElIdG1sRW5naW5lSGVscGVyLCBJSGFuZGxlYmFyc09wdGlvbnMgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlci5pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgT2JqZWN0TGVuZ3RoSGVscGVyIGltcGxlbWVudHMgSUh0bWxFbmdpbmVIZWxwZXIge1xuICAgIHB1YmxpYyBoZWxwZXJGdW5jKGNvbnRleHQ6IGFueSwgb2JqOiBPYmplY3QsIG9wZXJhdG9yOiBzdHJpbmcsIGxlbmd0aDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgICAgICAgbGV0IG9wdGlvbnM6IElIYW5kbGViYXJzT3B0aW9ucyA9IGFyZ3VtZW50c1tsZW5dO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZShjb250ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzaXplID0gMCxcbiAgICAgICAgICAgIGtleTtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBzaXplKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICBzd2l0Y2ggKG9wZXJhdG9yKSB7XG4gICAgICAgICAgICBjYXNlICc9PT0nOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHNpemUgPT09IGxlbmd0aDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyE9PSc6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gc2l6ZSAhPT0gbGVuZ3RoO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnPic6XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gc2l6ZSA+IGxlbmd0aDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2hlbHBlciB7e29iamVjdExlbmd0aH19OiBpbnZhbGlkIG9wZXJhdG9yOiBgJyArIG9wZXJhdG9yICsgJ2AnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICAgIH1cbn1cbiJdfQ==