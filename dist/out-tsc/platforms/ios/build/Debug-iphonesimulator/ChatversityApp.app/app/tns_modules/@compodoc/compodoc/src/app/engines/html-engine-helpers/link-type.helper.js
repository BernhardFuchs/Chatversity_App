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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay10eXBlLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9odG1sLWVuZ2luZS1oZWxwZXJzL2xpbmstdHlwZS5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw4REFBd0Q7QUFDeEQsNEVBQXFFO0FBQ3JFLGtFQUEyRDtBQUMzRCxxREFBZ0Q7QUFFaEQ7SUFDSTtJQUFlLENBQUM7SUFFVCxtQ0FBVSxHQUFqQixVQUFrQixPQUFZLEVBQUUsSUFBWSxFQUFFLE9BQTJCO1FBQ3JFLElBQUksT0FBTyxHQUFHLDZCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxJQUFJLGdCQUFnQixHQUFHLDhCQUFrQixDQUFDLGlCQUFpQixDQUN2RCx1QkFBYSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQ3hDLENBQUM7UUFDRixJQUFJLE9BQU8sRUFBRTtZQUNULE9BQU8sQ0FBQyxJQUFJLEdBQUc7Z0JBQ1gsR0FBRyxFQUFFLElBQUk7YUFDWixDQUFDO1lBQ0YsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtnQkFDL0IsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7b0JBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztpQkFDaEM7Z0JBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7Z0JBQ25GLElBQ0ksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssZUFBZTtvQkFDckMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxlQUFlLENBQUMsRUFDaEU7b0JBQ0UsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO29CQUNsQixRQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUMxQixLQUFLLE1BQU07NEJBQ1AsUUFBUSxHQUFHLGNBQWMsQ0FBQzs0QkFDMUIsTUFBTTt3QkFDVixLQUFLLFVBQVU7NEJBQ1gsUUFBUSxHQUFHLFdBQVcsQ0FBQzs0QkFDdkIsTUFBTTt3QkFDVixLQUFLLFdBQVc7NEJBQ1osUUFBUSxHQUFHLGFBQWEsQ0FBQzs0QkFDekIsTUFBTTt3QkFDVixLQUFLLFVBQVU7NEJBQ1gsUUFBUSxHQUFHLFdBQVcsQ0FBQztxQkFDOUI7b0JBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJO3dCQUNiLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsUUFBUSxHQUFHLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztpQkFDbEY7Z0JBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO2FBQ2pDO2lCQUFNO2dCQUNILE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLGFBQVcsZ0JBQWdCLG1CQUFjLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBTSxDQUFDO2dCQUNqRixPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7YUFDbEM7WUFFRCxPQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUI7YUFBTSxJQUFJLHlCQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3hDLE9BQU8sQ0FBQyxJQUFJLEdBQUc7Z0JBQ1gsR0FBRyxFQUFFLElBQUk7YUFDWixDQUFDO1lBQ0YsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1lBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLHlCQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25ELE9BQU8sT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QjthQUFNO1lBQ0gsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25DO0lBQ0wsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQyxBQXhERCxJQXdEQztBQXhEWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElIdG1sRW5naW5lSGVscGVyLCBJSGFuZGxlYmFyc09wdGlvbnMgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlci5pbnRlcmZhY2UnO1xuaW1wb3J0IERlcGVuZGVuY2llc0VuZ2luZSBmcm9tICcuLi9kZXBlbmRlbmNpZXMuZW5naW5lJztcbmltcG9ydCBBbmd1bGFyVmVyc2lvblV0aWwgZnJvbSAnLi4vLi4vLi4vdXRpbHMvYW5ndWxhci12ZXJzaW9uLnV0aWwnO1xuaW1wb3J0IEJhc2ljVHlwZVV0aWwgZnJvbSAnLi4vLi4vLi4vdXRpbHMvYmFzaWMtdHlwZS51dGlsJztcbmltcG9ydCBDb25maWd1cmF0aW9uIGZyb20gJy4uLy4uL2NvbmZpZ3VyYXRpb24nO1xuXG5leHBvcnQgY2xhc3MgTGlua1R5cGVIZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCBuYW1lOiBzdHJpbmcsIG9wdGlvbnM6IElIYW5kbGViYXJzT3B0aW9ucykge1xuICAgICAgICBsZXQgX3Jlc3VsdCA9IERlcGVuZGVuY2llc0VuZ2luZS5maW5kKG5hbWUpO1xuICAgICAgICBsZXQgYW5ndWxhckRvY1ByZWZpeCA9IEFuZ3VsYXJWZXJzaW9uVXRpbC5wcmVmaXhPZmZpY2lhbERvYyhcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYW5ndWxhclZlcnNpb25cbiAgICAgICAgKTtcbiAgICAgICAgaWYgKF9yZXN1bHQpIHtcbiAgICAgICAgICAgIGNvbnRleHQudHlwZSA9IHtcbiAgICAgICAgICAgICAgICByYXc6IG5hbWVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoX3Jlc3VsdC5zb3VyY2UgPT09ICdpbnRlcm5hbCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3Jlc3VsdC5kYXRhLnR5cGUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgX3Jlc3VsdC5kYXRhLnR5cGUgPSAnY2xhc3NlJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGV4dC50eXBlLmhyZWYgPSAnLi4vJyArIF9yZXN1bHQuZGF0YS50eXBlICsgJ3MvJyArIF9yZXN1bHQuZGF0YS5uYW1lICsgJy5odG1sJztcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIF9yZXN1bHQuZGF0YS50eXBlID09PSAnbWlzY2VsbGFuZW91cycgfHxcbiAgICAgICAgICAgICAgICAgICAgKF9yZXN1bHQuZGF0YS5jdHlwZSAmJiBfcmVzdWx0LmRhdGEuY3R5cGUgPT09ICdtaXNjZWxsYW5lb3VzJylcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1haW5wYWdlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoX3Jlc3VsdC5kYXRhLnN1YnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2VudW0nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5wYWdlID0gJ2VudW1lcmF0aW9ucyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbnBhZ2UgPSAnZnVuY3Rpb25zJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3R5cGVhbGlhcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbnBhZ2UgPSAndHlwZWFsaWFzZXMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndmFyaWFibGUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5wYWdlID0gJ3ZhcmlhYmxlcyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC50eXBlLmhyZWYgPVxuICAgICAgICAgICAgICAgICAgICAgICAgJy4uLycgKyBfcmVzdWx0LmRhdGEuY3R5cGUgKyAnLycgKyBtYWlucGFnZSArICcuaHRtbCMnICsgX3Jlc3VsdC5kYXRhLm5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRleHQudHlwZS50YXJnZXQgPSAnX3NlbGYnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnR5cGUuaHJlZiA9IGBodHRwczovLyR7YW5ndWxhckRvY1ByZWZpeH1hbmd1bGFyLmlvLyR7X3Jlc3VsdC5kYXRhLnBhdGh9YDtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnR5cGUudGFyZ2V0ID0gJ19ibGFuayc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICAgICAgICB9IGVsc2UgaWYgKEJhc2ljVHlwZVV0aWwuaXNLbm93blR5cGUobmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnRleHQudHlwZSA9IHtcbiAgICAgICAgICAgICAgICByYXc6IG5hbWVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb250ZXh0LnR5cGUudGFyZ2V0ID0gJ19ibGFuayc7XG4gICAgICAgICAgICBjb250ZXh0LnR5cGUuaHJlZiA9IEJhc2ljVHlwZVV0aWwuZ2V0VHlwZVVybChuYW1lKTtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZShjb250ZXh0KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==