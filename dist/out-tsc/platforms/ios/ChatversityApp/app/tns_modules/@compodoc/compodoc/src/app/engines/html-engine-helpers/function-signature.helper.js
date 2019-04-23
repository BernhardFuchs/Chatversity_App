"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dependencies_engine_1 = require("../dependencies.engine");
var angular_version_util_1 = require("../../../utils/angular-version.util");
var basic_type_util_1 = require("../../../utils/basic-type.util");
var configuration_1 = require("../../configuration");
var FunctionSignatureHelper = /** @class */ (function () {
    function FunctionSignatureHelper() {
    }
    FunctionSignatureHelper.prototype.handleFunction = function (arg) {
        var _this = this;
        if (arg.function.length === 0) {
            return "" + arg.name + this.getOptionalString(arg) + ": () => void";
        }
        var argums = arg.function.map(function (argu) {
            var _result = dependencies_engine_1.default.find(argu.type);
            if (_result) {
                if (_result.source === 'internal') {
                    var path = _result.data.type;
                    if (_result.data.type === 'class') {
                        path = 'classe';
                    }
                    return "" + argu.name + _this.getOptionalString(arg) + ": <a href=\"../" + path + "s/" + _result.data.name + ".html\">" + argu.type + "</a>";
                }
                else {
                    var path = angular_version_util_1.default.getApiLink(_result.data, configuration_1.default.mainData.angularVersion);
                    return "" + argu.name + _this.getOptionalString(arg) + ": <a href=\"" + path + "\" target=\"_blank\">" + argu.type + "</a>";
                }
            }
            else if (basic_type_util_1.default.isKnownType(argu.type)) {
                var path = basic_type_util_1.default.getTypeUrl(argu.type);
                return "" + argu.name + _this.getOptionalString(arg) + ": <a href=\"" + path + "\" target=\"_blank\">" + argu.type + "</a>";
            }
            else {
                if (argu.name && argu.type) {
                    return "" + argu.name + _this.getOptionalString(arg) + ": " + argu.type;
                }
                else {
                    if (argu.name) {
                        return "" + argu.name.text;
                    }
                    else {
                        return '';
                    }
                }
            }
        });
        return "" + arg.name + this.getOptionalString(arg) + ": (" + argums + ") => void";
    };
    FunctionSignatureHelper.prototype.getOptionalString = function (arg) {
        return arg.optional ? '?' : '';
    };
    FunctionSignatureHelper.prototype.helperFunc = function (context, method) {
        var _this = this;
        var args = [];
        if (method.args) {
            args = method.args
                .map(function (arg) {
                var _result = dependencies_engine_1.default.find(arg.type);
                if (_result) {
                    if (_result.source === 'internal') {
                        var path = _result.data.type;
                        if (_result.data.type === 'class') {
                            path = 'classe';
                        }
                        return "" + arg.name + _this.getOptionalString(arg) + ": <a href=\"../" + path + "s/" + _result.data.name + ".html\">" + arg.type + "</a>";
                    }
                    else {
                        var path = angular_version_util_1.default.getApiLink(_result.data, configuration_1.default.mainData.angularVersion);
                        return "" + arg.name + _this.getOptionalString(arg) + ": <a href=\"" + path + "\" target=\"_blank\">" + arg.type + "</a>";
                    }
                }
                else if (arg.dotDotDotToken) {
                    return "..." + arg.name + ": " + arg.type;
                }
                else if (arg.function) {
                    return _this.handleFunction(arg);
                }
                else if (basic_type_util_1.default.isKnownType(arg.type)) {
                    var path = basic_type_util_1.default.getTypeUrl(arg.type);
                    return "" + arg.name + _this.getOptionalString(arg) + ": <a href=\"" + path + "\" target=\"_blank\">" + arg.type + "</a>";
                }
                else {
                    if (arg.type) {
                        return "" + arg.name + _this.getOptionalString(arg) + ": " + arg.type;
                    }
                    else {
                        return "" + arg.name + _this.getOptionalString(arg);
                    }
                }
            })
                .join(', ');
        }
        if (method.name) {
            return method.name + "(" + args + ")";
        }
        else {
            return "(" + args + ")";
        }
    };
    return FunctionSignatureHelper;
}());
exports.FunctionSignatureHelper = FunctionSignatureHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24tc2lnbmF0dXJlLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvaHRtbC1lbmdpbmUtaGVscGVycy9mdW5jdGlvbi1zaWduYXR1cmUuaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsOERBQXdEO0FBQ3hELDRFQUFxRTtBQUNyRSxrRUFBMkQ7QUFDM0QscURBQWdEO0FBRWhEO0lBQ0k7SUFBZSxDQUFDO0lBRVIsZ0RBQWMsR0FBdEIsVUFBdUIsR0FBRztRQUExQixpQkEyQ0M7UUExQ0csSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDM0IsT0FBTyxLQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxpQkFBYyxDQUFDO1NBQ2xFO1FBRUQsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJO1lBQzlCLElBQUksT0FBTyxHQUFHLDZCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakQsSUFBSSxPQUFPLEVBQUU7Z0JBQ1QsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtvQkFDL0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQzdCLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO3dCQUMvQixJQUFJLEdBQUcsUUFBUSxDQUFDO3FCQUNuQjtvQkFDRCxPQUFPLEtBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFJLENBQUMsaUJB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O2FBQU07WUFDSCxPQUFPLE1BQUksSUFBSSxNQUFHLENBQUM7U0FDdEI7SUFDTCxDQUFDO0lBQ0wsOEJBQUM7QUFBRCxDQUFDLEFBdEdELElBc0dDO0FBdEdZLDBEQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElIdG1sRW5naW5lSGVscGVyIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXIuaW50ZXJmYWNlJztcblxuaW1wb3J0IERlcGVuZGVuY2llc0VuZ2luZSBmcm9tICcuLi9kZXBlbmRlbmNpZXMuZW5naW5lJztcbmltcG9ydCBBbmd1bGFyVmVyc2lvblV0aWwgZnJvbSAnLi4vLi4vLi4vdXRpbHMvYW5ndWxhci12ZXJzaW9uLnV0aWwnO1xuaW1wb3J0IEJhc2ljVHlwZVV0aWwgZnJvbSAnLi4vLi4vLi4vdXRpbHMvYmFzaWMtdHlwZS51dGlsJztcbmltcG9ydCBDb25maWd1cmF0aW9uIGZyb20gJy4uLy4uL2NvbmZpZ3VyYXRpb24nO1xuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25TaWduYXR1cmVIZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVGdW5jdGlvbihhcmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAoYXJnLmZ1bmN0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke2FyZy5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhhcmcpfTogKCkgPT4gdm9pZGA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYXJndW1zID0gYXJnLmZ1bmN0aW9uLm1hcChhcmd1ID0+IHtcbiAgICAgICAgICAgIGxldCBfcmVzdWx0ID0gRGVwZW5kZW5jaWVzRW5naW5lLmZpbmQoYXJndS50eXBlKTtcbiAgICAgICAgICAgIGlmIChfcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgaWYgKF9yZXN1bHQuc291cmNlID09PSAnaW50ZXJuYWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRoID0gX3Jlc3VsdC5kYXRhLnR5cGU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfcmVzdWx0LmRhdGEudHlwZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9ICdjbGFzc2UnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmd1Lm5hbWV9JHt0aGlzLmdldE9wdGlvbmFsU3RyaW5nKGFyZyl9OiA8YSBocmVmPVwiLi4vJHtwYXRofXMvJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZXN1bHQuZGF0YS5uYW1lXG4gICAgICAgICAgICAgICAgICAgIH0uaHRtbFwiPiR7YXJndS50eXBlfTwvYT5gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRoID0gQW5ndWxhclZlcnNpb25VdGlsLmdldEFwaUxpbmsoXG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVzdWx0LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmFuZ3VsYXJWZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmd1Lm5hbWV9JHt0aGlzLmdldE9wdGlvbmFsU3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnXG4gICAgICAgICAgICAgICAgICAgICl9OiA8YSBocmVmPVwiJHtwYXRofVwiIHRhcmdldD1cIl9ibGFua1wiPiR7YXJndS50eXBlfTwvYT5gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoQmFzaWNUeXBlVXRpbC5pc0tub3duVHlwZShhcmd1LnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBhdGggPSBCYXNpY1R5cGVVdGlsLmdldFR5cGVVcmwoYXJndS50eXBlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7YXJndS5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgYXJnXG4gICAgICAgICAgICAgICAgKX06IDxhIGhyZWY9XCIke3BhdGh9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHthcmd1LnR5cGV9PC9hPmA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChhcmd1Lm5hbWUgJiYgYXJndS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmd1Lm5hbWV9JHt0aGlzLmdldE9wdGlvbmFsU3RyaW5nKGFyZyl9OiAke2FyZ3UudHlwZX1gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmd1Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmd1Lm5hbWUudGV4dH1gO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGAke2FyZy5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhhcmcpfTogKCR7YXJndW1zfSkgPT4gdm9pZGA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRPcHRpb25hbFN0cmluZyhhcmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYXJnLm9wdGlvbmFsID8gJz8nIDogJyc7XG4gICAgfVxuXG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCBtZXRob2QpIHtcbiAgICAgICAgbGV0IGFyZ3MgPSBbXTtcblxuICAgICAgICBpZiAobWV0aG9kLmFyZ3MpIHtcbiAgICAgICAgICAgIGFyZ3MgPSBtZXRob2QuYXJnc1xuICAgICAgICAgICAgICAgIC5tYXAoYXJnID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IF9yZXN1bHQgPSBEZXBlbmRlbmNpZXNFbmdpbmUuZmluZChhcmcudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX3Jlc3VsdC5zb3VyY2UgPT09ICdpbnRlcm5hbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGF0aCA9IF9yZXN1bHQuZGF0YS50eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfcmVzdWx0LmRhdGEudHlwZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoID0gJ2NsYXNzZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmcubmFtZX0ke3RoaXMuZ2V0T3B0aW9uYWxTdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9OiA8YSBocmVmPVwiLi4vJHtwYXRofXMvJHtfcmVzdWx0LmRhdGEubmFtZX0uaHRtbFwiPiR7YXJnLnR5cGV9PC9hPmA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXRoID0gQW5ndWxhclZlcnNpb25VdGlsLmdldEFwaUxpbmsoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXN1bHQuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5hbmd1bGFyVmVyc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2FyZy5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX06IDxhIGhyZWY9XCIke3BhdGh9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHthcmcudHlwZX08L2E+YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcuZG90RG90RG90VG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgLi4uJHthcmcubmFtZX06ICR7YXJnLnR5cGV9YDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcuZnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUZ1bmN0aW9uKGFyZyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQmFzaWNUeXBlVXRpbC5pc0tub3duVHlwZShhcmcudHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXRoID0gQmFzaWNUeXBlVXRpbC5nZXRUeXBlVXJsKGFyZy50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmcubmFtZX0ke3RoaXMuZ2V0T3B0aW9uYWxTdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnXG4gICAgICAgICAgICAgICAgICAgICAgICApfTogPGEgaHJlZj1cIiR7cGF0aH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2FyZy50eXBlfTwvYT5gO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZy50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2FyZy5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhhcmcpfTogJHthcmcudHlwZX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7YXJnLm5hbWV9JHt0aGlzLmdldE9wdGlvbmFsU3RyaW5nKGFyZyl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmpvaW4oJywgJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1ldGhvZC5uYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7bWV0aG9kLm5hbWV9KCR7YXJnc30pYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgKCR7YXJnc30pYDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==