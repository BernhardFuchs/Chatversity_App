"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dependencies_engine_1 = require("../dependencies.engine");
var angular_version_util_1 = require("../../../utils/angular-version.util");
var basic_type_util_1 = require("../../../utils/basic-type.util");
var configuration_1 = require("../../configuration");
var LinkTypeHelper = /** @class */ (function () {
    function LinkTypeHelper() {
    }
    LinkTypeHelper.prototype.helperFunc = function (context, name, options) {
        var _result = dependencies_engine_1.default.find(name);
        var angularDocPrefix = angular_version_util_1.default.prefixOfficialDoc(configuration_1.default.mainData.angularVersion);
        if (_result) {
            context.type = {
                raw: name
            };
            if (_result.source === 'internal') {
                if (_result.data.type === 'class') {
                    _result.data.type = 'classe';
                }
                context.type.href = '../' + _result.data.type + 's/' + _result.data.name + '.html';
                if (_result.data.type === 'miscellaneous' ||
                    (_result.data.ctype && _result.data.ctype === 'miscellaneous')) {
                    var mainpage = '';
                    switch (_result.data.subtype) {
                        case 'enum':
                            mainpage = 'enumerations';
                            break;
                        case 'function':
                            mainpage = 'functions';
                            break;
                        case 'typealias':
                            mainpage = 'typealiases';
                            break;
                        case 'variable':
                            mainpage = 'variables';
                    }
                    context.type.href =
                        '../' + _result.data.ctype + '/' + mainpage + '.html#' + _result.data.name;
                }
                context.type.target = '_self';
            }
            else {
                context.type.href = "https://" + angularDocPrefix + "angular.io/" + _result.data.path;
                context.type.target = '_blank';
            }
            return options.fn(context);
        }
        else if (basic_type_util_1.default.isKnownType(name)) {
            context.type = {
                raw: name
            };
            context.type.target = '_blank';
            context.type.href = basic_type_util_1.default.getTypeUrl(name);
            return options.fn(context);
        }
        else {
            return options.inverse(context);
        }
    };
    return LinkTypeHelper;
}());
exports.LinkTypeHelper = LinkTypeHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay10eXBlLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvaHRtbC1lbmdpbmUtaGVscGVycy9saW5rLXR5cGUuaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsOERBQXdEO0FBQ3hELDRFQUFxRTtBQUNyRSxrRUFBMkQ7QUFDM0QscURBQWdEO0FBRWhEO0lBQ0k7SUFBZSxDQUFDO0lBRVQsbUNBQVUsR0FBakIsVUFBa0IsT0FBWSxFQUFFLElBQVksRUFBRSxPQUEyQjtRQUNyRSxJQUFJLE9BQU8sR0FBRyw2QkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBSSxnQkFBZ0IsR0FBRyw4QkFBa0IsQ0FBQyxpQkFBaUIsQ0FDdkQsdUJBQWEsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUN4QyxDQUFDO1FBQ0YsSUFBSSxPQUFPLEVBQUU7WUFDVCxPQUFPLENBQUMsSUFBSSxHQUFHO2dCQUNYLEdBQUcsRUFBRSxJQUFJO2FBQ1osQ0FBQztZQUNGLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7Z0JBQy9CLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO29CQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7aUJBQ2hDO2dCQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO2dCQUNuRixJQUNJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGVBQWU7b0JBQ3JDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssZUFBZSxDQUFDLEVBQ2hFO29CQUNFLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztvQkFDbEIsUUFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDMUIsS0FBSyxNQUFNOzRCQUNQLFFBQVEsR0FBRyxjQUFjLENBQUM7NEJBQzFCLE1BQU07d0JBQ1YsS0FBSyxVQUFVOzRCQUNYLFFBQVEsR0FBRyxXQUFXLENBQUM7NEJBQ3ZCLE1BQU07d0JBQ1YsS0FBSyxXQUFXOzRCQUNaLFFBQVEsR0FBRyxhQUFhLENBQUM7NEJBQ3pCLE1BQU07d0JBQ1YsS0FBSyxVQUFVOzRCQUNYLFFBQVEsR0FBRyxXQUFXLENBQUM7cUJBQzlCO29CQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSTt3QkFDYixLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLFFBQVEsR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7aUJBQ2xGO2dCQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQzthQUNqQztpQkFBTTtnQkFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxhQUFXLGdCQUFnQixtQkFBYyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQU0sQ0FBQztnQkFDakYsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO2FBQ2xDO1lBRUQsT0FBTyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzlCO2FBQU0sSUFBSSx5QkFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QyxPQUFPLENBQUMsSUFBSSxHQUFHO2dCQUNYLEdBQUcsRUFBRSxJQUFJO2FBQ1osQ0FBQztZQUNGLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztZQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyx5QkFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuRCxPQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUI7YUFBTTtZQUNILE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNuQztJQUNMLENBQUM7SUFDTCxxQkFBQztBQUFELENBQUMsQUF4REQsSUF3REM7QUF4RFksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJSHRtbEVuZ2luZUhlbHBlciwgSUhhbmRsZWJhcnNPcHRpb25zIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXIuaW50ZXJmYWNlJztcbmltcG9ydCBEZXBlbmRlbmNpZXNFbmdpbmUgZnJvbSAnLi4vZGVwZW5kZW5jaWVzLmVuZ2luZSc7XG5pbXBvcnQgQW5ndWxhclZlcnNpb25VdGlsIGZyb20gJy4uLy4uLy4uL3V0aWxzL2FuZ3VsYXItdmVyc2lvbi51dGlsJztcbmltcG9ydCBCYXNpY1R5cGVVdGlsIGZyb20gJy4uLy4uLy4uL3V0aWxzL2Jhc2ljLXR5cGUudXRpbCc7XG5pbXBvcnQgQ29uZmlndXJhdGlvbiBmcm9tICcuLi8uLi9jb25maWd1cmF0aW9uJztcblxuZXhwb3J0IGNsYXNzIExpbmtUeXBlSGVscGVyIGltcGxlbWVudHMgSUh0bWxFbmdpbmVIZWxwZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge31cblxuICAgIHB1YmxpYyBoZWxwZXJGdW5jKGNvbnRleHQ6IGFueSwgbmFtZTogc3RyaW5nLCBvcHRpb25zOiBJSGFuZGxlYmFyc09wdGlvbnMpIHtcbiAgICAgICAgbGV0IF9yZXN1bHQgPSBEZXBlbmRlbmNpZXNFbmdpbmUuZmluZChuYW1lKTtcbiAgICAgICAgbGV0IGFuZ3VsYXJEb2NQcmVmaXggPSBBbmd1bGFyVmVyc2lvblV0aWwucHJlZml4T2ZmaWNpYWxEb2MoXG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmFuZ3VsYXJWZXJzaW9uXG4gICAgICAgICk7XG4gICAgICAgIGlmIChfcmVzdWx0KSB7XG4gICAgICAgICAgICBjb250ZXh0LnR5cGUgPSB7XG4gICAgICAgICAgICAgICAgcmF3OiBuYW1lXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKF9yZXN1bHQuc291cmNlID09PSAnaW50ZXJuYWwnKSB7XG4gICAgICAgICAgICAgICAgaWYgKF9yZXN1bHQuZGF0YS50eXBlID09PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgIF9yZXN1bHQuZGF0YS50eXBlID0gJ2NsYXNzZSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRleHQudHlwZS5ocmVmID0gJy4uLycgKyBfcmVzdWx0LmRhdGEudHlwZSArICdzLycgKyBfcmVzdWx0LmRhdGEubmFtZSArICcuaHRtbCc7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBfcmVzdWx0LmRhdGEudHlwZSA9PT0gJ21pc2NlbGxhbmVvdXMnIHx8XG4gICAgICAgICAgICAgICAgICAgIChfcmVzdWx0LmRhdGEuY3R5cGUgJiYgX3Jlc3VsdC5kYXRhLmN0eXBlID09PSAnbWlzY2VsbGFuZW91cycpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtYWlucGFnZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9yZXN1bHQuZGF0YS5zdWJ0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdlbnVtJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWlucGFnZSA9ICdlbnVtZXJhdGlvbnMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5wYWdlID0gJ2Z1bmN0aW9ucyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0eXBlYWxpYXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5wYWdlID0gJ3R5cGVhbGlhc2VzJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3ZhcmlhYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWlucGFnZSA9ICd2YXJpYWJsZXMnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQudHlwZS5ocmVmID1cbiAgICAgICAgICAgICAgICAgICAgICAgICcuLi8nICsgX3Jlc3VsdC5kYXRhLmN0eXBlICsgJy8nICsgbWFpbnBhZ2UgKyAnLmh0bWwjJyArIF9yZXN1bHQuZGF0YS5uYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250ZXh0LnR5cGUudGFyZ2V0ID0gJ19zZWxmJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC50eXBlLmhyZWYgPSBgaHR0cHM6Ly8ke2FuZ3VsYXJEb2NQcmVmaXh9YW5ndWxhci5pby8ke19yZXN1bHQuZGF0YS5wYXRofWA7XG4gICAgICAgICAgICAgICAgY29udGV4dC50eXBlLnRhcmdldCA9ICdfYmxhbmsnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5mbihjb250ZXh0KTtcbiAgICAgICAgfSBlbHNlIGlmIChCYXNpY1R5cGVVdGlsLmlzS25vd25UeXBlKG5hbWUpKSB7XG4gICAgICAgICAgICBjb250ZXh0LnR5cGUgPSB7XG4gICAgICAgICAgICAgICAgcmF3OiBuYW1lXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29udGV4dC50eXBlLnRhcmdldCA9ICdfYmxhbmsnO1xuICAgICAgICAgICAgY29udGV4dC50eXBlLmhyZWYgPSBCYXNpY1R5cGVVdGlsLmdldFR5cGVVcmwobmFtZSk7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5mbihjb250ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UoY29udGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=