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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24tc2lnbmF0dXJlLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9odG1sLWVuZ2luZS1oZWxwZXJzL2Z1bmN0aW9uLXNpZ25hdHVyZS5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw4REFBd0Q7QUFDeEQsNEVBQXFFO0FBQ3JFLGtFQUEyRDtBQUMzRCxxREFBZ0Q7QUFFaEQ7SUFDSTtJQUFlLENBQUM7SUFFUixnREFBYyxHQUF0QixVQUF1QixHQUFHO1FBQTFCLGlCQTJDQztRQTFDRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMzQixPQUFPLEtBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLGlCQUFjLENBQUM7U0FDbEU7UUFFRCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7WUFDOUIsSUFBSSxPQUFPLEdBQUcsNkJBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRCxJQUFJLE9BQU8sRUFBRTtnQkFDVCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO29CQUMvQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDN0IsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7d0JBQy9CLElBQUksR0FBRyxRQUFRLENBQUM7cUJBQ25CO29CQUNELE9BQU8s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QU0sQ0FBQyxJQUFJLFNBQUksSUFBSSxNQUFHLENBQUM7U0FDcEM7YUFBTTtZQUNILE9BQU8sTUFBSSxJQUFJLE1BQUcsQ0FBQztTQUN0QjtJQUNMLENBQUM7SUFDTCw4QkFBQztBQUFELENBQUMsQUF0R0QsSUFzR0M7QUF0R1ksMERBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUh0bWxFbmdpbmVIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlci5pbnRlcmZhY2UnO1xuXG5pbXBvcnQgRGVwZW5kZW5jaWVzRW5naW5lIGZyb20gJy4uL2RlcGVuZGVuY2llcy5lbmdpbmUnO1xuaW1wb3J0IEFuZ3VsYXJWZXJzaW9uVXRpbCBmcm9tICcuLi8uLi8uLi91dGlscy9hbmd1bGFyLXZlcnNpb24udXRpbCc7XG5pbXBvcnQgQmFzaWNUeXBlVXRpbCBmcm9tICcuLi8uLi8uLi91dGlscy9iYXNpYy10eXBlLnV0aWwnO1xuaW1wb3J0IENvbmZpZ3VyYXRpb24gZnJvbSAnLi4vLi4vY29uZmlndXJhdGlvbic7XG5cbmV4cG9ydCBjbGFzcyBGdW5jdGlvblNpZ25hdHVyZUhlbHBlciBpbXBsZW1lbnRzIElIdG1sRW5naW5lSGVscGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBwcml2YXRlIGhhbmRsZUZ1bmN0aW9uKGFyZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChhcmcuZnVuY3Rpb24ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7YXJnLm5hbWV9JHt0aGlzLmdldE9wdGlvbmFsU3RyaW5nKGFyZyl9OiAoKSA9PiB2b2lkYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBhcmd1bXMgPSBhcmcuZnVuY3Rpb24ubWFwKGFyZ3UgPT4ge1xuICAgICAgICAgICAgbGV0IF9yZXN1bHQgPSBEZXBlbmRlbmNpZXNFbmdpbmUuZmluZChhcmd1LnR5cGUpO1xuICAgICAgICAgICAgaWYgKF9yZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3Jlc3VsdC5zb3VyY2UgPT09ICdpbnRlcm5hbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGggPSBfcmVzdWx0LmRhdGEudHlwZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9yZXN1bHQuZGF0YS50eXBlID09PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoID0gJ2NsYXNzZSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2FyZ3UubmFtZX0ke3RoaXMuZ2V0T3B0aW9uYWxTdHJpbmcoYXJnKX06IDxhIGhyZWY9XCIuLi8ke3BhdGh9cy8ke1xuICAgICAgICAgICAgICAgICAgICAgICAgX3Jlc3VsdC5kYXRhLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgfS5odG1sXCI+JHthcmd1LnR5cGV9PC9hPmA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGggPSBBbmd1bGFyVmVyc2lvblV0aWwuZ2V0QXBpTGluayhcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZXN1bHQuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYW5ndWxhclZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2FyZ3UubmFtZX0ke3RoaXMuZ2V0T3B0aW9uYWxTdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdcbiAgICAgICAgICAgICAgICAgICAgKX06IDxhIGhyZWY9XCIke3BhdGh9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHthcmd1LnR5cGV9PC9hPmA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChCYXNpY1R5cGVVdGlsLmlzS25vd25UeXBlKGFyZ3UudHlwZSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgcGF0aCA9IEJhc2ljVHlwZVV0aWwuZ2V0VHlwZVVybChhcmd1LnR5cGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmd1Lm5hbWV9JHt0aGlzLmdldE9wdGlvbmFsU3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICBhcmdcbiAgICAgICAgICAgICAgICApfTogPGEgaHJlZj1cIiR7cGF0aH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2FyZ3UudHlwZX08L2E+YDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3UubmFtZSAmJiBhcmd1LnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2FyZ3UubmFtZX0ke3RoaXMuZ2V0T3B0aW9uYWxTdHJpbmcoYXJnKX06ICR7YXJndS50eXBlfWA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3UubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2FyZ3UubmFtZS50ZXh0fWA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYCR7YXJnLm5hbWV9JHt0aGlzLmdldE9wdGlvbmFsU3RyaW5nKGFyZyl9OiAoJHthcmd1bXN9KSA9PiB2b2lkYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE9wdGlvbmFsU3RyaW5nKGFyZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBhcmcub3B0aW9uYWwgPyAnPycgOiAnJztcbiAgICB9XG5cbiAgICBwdWJsaWMgaGVscGVyRnVuYyhjb250ZXh0OiBhbnksIG1ldGhvZCkge1xuICAgICAgICBsZXQgYXJncyA9IFtdO1xuXG4gICAgICAgIGlmIChtZXRob2QuYXJncykge1xuICAgICAgICAgICAgYXJncyA9IG1ldGhvZC5hcmdzXG4gICAgICAgICAgICAgICAgLm1hcChhcmcgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgX3Jlc3VsdCA9IERlcGVuZGVuY2llc0VuZ2luZS5maW5kKGFyZy50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9yZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfcmVzdWx0LnNvdXJjZSA9PT0gJ2ludGVybmFsJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXRoID0gX3Jlc3VsdC5kYXRhLnR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9yZXN1bHQuZGF0YS50eXBlID09PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSAnY2xhc3NlJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2FyZy5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX06IDxhIGhyZWY9XCIuLi8ke3BhdGh9cy8ke19yZXN1bHQuZGF0YS5uYW1lfS5odG1sXCI+JHthcmcudHlwZX08L2E+YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGggPSBBbmd1bGFyVmVyc2lvblV0aWwuZ2V0QXBpTGluayhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Jlc3VsdC5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmFuZ3VsYXJWZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7YXJnLm5hbWV9JHt0aGlzLmdldE9wdGlvbmFsU3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfTogPGEgaHJlZj1cIiR7cGF0aH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2FyZy50eXBlfTwvYT5gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyZy5kb3REb3REb3RUb2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAuLi4ke2FyZy5uYW1lfTogJHthcmcudHlwZX1gO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyZy5mdW5jdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRnVuY3Rpb24oYXJnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChCYXNpY1R5cGVVdGlsLmlzS25vd25UeXBlKGFyZy50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGggPSBCYXNpY1R5cGVVdGlsLmdldFR5cGVVcmwoYXJnLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2FyZy5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdcbiAgICAgICAgICAgICAgICAgICAgICAgICl9OiA8YSBocmVmPVwiJHtwYXRofVwiIHRhcmdldD1cIl9ibGFua1wiPiR7YXJnLnR5cGV9PC9hPmA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJnLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7YXJnLm5hbWV9JHt0aGlzLmdldE9wdGlvbmFsU3RyaW5nKGFyZyl9OiAke2FyZy50eXBlfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmcubmFtZX0ke3RoaXMuZ2V0T3B0aW9uYWxTdHJpbmcoYXJnKX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuam9pbignLCAnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWV0aG9kLm5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHttZXRob2QubmFtZX0oJHthcmdzfSlgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGAoJHthcmdzfSlgO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19