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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LWxlbmd0aC5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9lbmdpbmVzL2h0bWwtZW5naW5lLWhlbHBlcnMvb2JqZWN0LWxlbmd0aC5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTtJQUFBO0lBc0NBLENBQUM7SUFyQ1UsdUNBQVUsR0FBakIsVUFBa0IsT0FBWSxFQUFFLEdBQVcsRUFBRSxRQUFnQixFQUFFLE1BQWM7UUFDekUsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDL0IsSUFBSSxPQUFPLEdBQXVCLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqRCxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtZQUN6QixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbkM7UUFFRCxJQUFJLElBQUksR0FBRyxDQUFDLEVBQ1IsR0FBRyxDQUFDO1FBQ1IsS0FBSyxHQUFHLElBQUksR0FBRyxFQUFFO1lBQ2IsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUN6QixJQUFJLEVBQUUsQ0FBQzthQUNWO1NBQ0o7UUFFRCxJQUFJLE1BQU0sQ0FBQztRQUNYLFFBQVEsUUFBUSxFQUFFO1lBQ2QsS0FBSyxLQUFLO2dCQUNOLE1BQU0sR0FBRyxJQUFJLEtBQUssTUFBTSxDQUFDO2dCQUN6QixNQUFNO1lBQ1YsS0FBSyxLQUFLO2dCQUNOLE1BQU0sR0FBRyxJQUFJLEtBQUssTUFBTSxDQUFDO2dCQUN6QixNQUFNO1lBQ1YsS0FBSyxHQUFHO2dCQUNKLE1BQU0sR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDO2dCQUN2QixNQUFNO1lBQ1YsT0FBTyxDQUFDLENBQUM7Z0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUM7YUFDcEY7U0FDSjtRQUVELElBQUksTUFBTSxLQUFLLEtBQUssRUFBRTtZQUNsQixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbkM7UUFDRCxPQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNMLHlCQUFDO0FBQUQsQ0FBQyxBQXRDRCxJQXNDQztBQXRDWSxnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJSHRtbEVuZ2luZUhlbHBlciwgSUhhbmRsZWJhcnNPcHRpb25zIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXIuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNsYXNzIE9iamVjdExlbmd0aEhlbHBlciBpbXBsZW1lbnRzIElIdG1sRW5naW5lSGVscGVyIHtcbiAgICBwdWJsaWMgaGVscGVyRnVuYyhjb250ZXh0OiBhbnksIG9iajogT2JqZWN0LCBvcGVyYXRvcjogc3RyaW5nLCBsZW5ndGg6IG51bWJlcikge1xuICAgICAgICBsZXQgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gICAgICAgIGxldCBvcHRpb25zOiBJSGFuZGxlYmFyc09wdGlvbnMgPSBhcmd1bWVudHNbbGVuXTtcblxuICAgICAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UoY29udGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2l6ZSA9IDAsXG4gICAgICAgICAgICBrZXk7XG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgc2l6ZSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgc3dpdGNoIChvcGVyYXRvcikge1xuICAgICAgICAgICAgY2FzZSAnPT09JzpcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBzaXplID09PSBsZW5ndGg7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICchPT0nOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHNpemUgIT09IGxlbmd0aDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJz4nOlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHNpemUgPiBsZW5ndGg7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdoZWxwZXIge3tvYmplY3RMZW5ndGh9fTogaW52YWxpZCBvcGVyYXRvcjogYCcgKyBvcGVyYXRvciArICdgJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZShjb250ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3B0aW9ucy5mbihjb250ZXh0KTtcbiAgICB9XG59XG4iXX0=