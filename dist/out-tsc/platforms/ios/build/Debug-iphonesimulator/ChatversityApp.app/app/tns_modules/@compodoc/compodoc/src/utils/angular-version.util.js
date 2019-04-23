"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var semver = require("semver");
var AngularVersionUtil = /** @class */ (function () {
    function AngularVersionUtil() {
    }
    AngularVersionUtil.getInstance = function () {
        if (!AngularVersionUtil.instance) {
            AngularVersionUtil.instance = new AngularVersionUtil();
        }
        return AngularVersionUtil.instance;
    };
    AngularVersionUtil.prototype.cleanVersion = function (version) {
        return version
            .replace('~', '')
            .replace('^', '')
            .replace('=', '')
            .replace('<', '')
            .replace('>', '');
    };
    AngularVersionUtil.prototype.getAngularVersionOfProject = function (packageData) {
        var _result = '';
        if (packageData.dependencies) {
            var angularCore = packageData.dependencies[AngularVersionUtil.CorePackage];
            if (angularCore) {
                _result = this.cleanVersion(angularCore);
            }
        }
        return _result;
    };
    AngularVersionUtil.prototype.isAngularVersionArchived = function (version) {
        var result;
        try {
            result = semver.compare(version, '2.4.10') <= 0;
        }
        catch (e) { }
        return result;
    };
    AngularVersionUtil.prototype.prefixOfficialDoc = function (version) {
        return this.isAngularVersionArchived(version) ? 'v2.' : '';
    };
    AngularVersionUtil.prototype.getApiLink = function (api, angularVersion) {
        var angularDocPrefix = this.prefixOfficialDoc(angularVersion);
        return "https://" + angularDocPrefix + "angular.io/" + api.path;
    };
    AngularVersionUtil.CorePackage = '@angular/core';
    return AngularVersionUtil;
}());
exports.AngularVersionUtil = AngularVersionUtil;
exports.default = AngularVersionUtil.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci12ZXJzaW9uLnV0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvdXRpbHMvYW5ndWxhci12ZXJzaW9uLnV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFHakM7SUFJSTtJQUF1QixDQUFDO0lBQ1YsOEJBQVcsR0FBekI7UUFDSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFO1lBQzlCLGtCQUFrQixDQUFDLFFBQVEsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7U0FDMUQ7UUFDRCxPQUFPLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztJQUN2QyxDQUFDO0lBRU0seUNBQVksR0FBbkIsVUFBb0IsT0FBZTtRQUMvQixPQUFPLE9BQU87YUFDVCxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQzthQUNoQixPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQzthQUNoQixPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQzthQUNoQixPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQzthQUNoQixPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFTSx1REFBMEIsR0FBakMsVUFBa0MsV0FBVztRQUN6QyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFFakIsSUFBSSxXQUFXLENBQUMsWUFBWSxFQUFFO1lBQzFCLElBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDM0UsSUFBSSxXQUFXLEVBQUU7Z0JBQ2IsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDNUM7U0FDSjtRQUVELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTyxxREFBd0IsR0FBaEMsVUFBaUMsT0FBZTtRQUM1QyxJQUFJLE1BQU0sQ0FBQztRQUVYLElBQUk7WUFDQSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25EO1FBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRTtRQUVkLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTSw4Q0FBaUIsR0FBeEIsVUFBeUIsT0FBZTtRQUNwQyxPQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDL0QsQ0FBQztJQUVNLHVDQUFVLEdBQWpCLFVBQWtCLEdBQWdCLEVBQUUsY0FBc0I7UUFDdEQsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDOUQsT0FBTyxhQUFXLGdCQUFnQixtQkFBYyxHQUFHLENBQUMsSUFBTSxDQUFDO0lBQy9ELENBQUM7SUFsRHVCLDhCQUFXLEdBQUcsZUFBZSxDQUFDO0lBbUQxRCx5QkFBQztDQUFBLEFBcERELElBb0RDO0FBcERZLGdEQUFrQjtBQXNEL0Isa0JBQWUsa0JBQWtCLENBQUMsV0FBVyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzZW12ZXIgZnJvbSAnc2VtdmVyJztcbmltcG9ydCB7IElBbmd1bGFyQXBpIH0gZnJvbSAnLi9hbmd1bGFyLWFwaS51dGlsJztcblxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJWZXJzaW9uVXRpbCB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQ29yZVBhY2thZ2UgPSAnQGFuZ3VsYXIvY29yZSc7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogQW5ndWxhclZlcnNpb25VdGlsO1xuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICghQW5ndWxhclZlcnNpb25VdGlsLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBBbmd1bGFyVmVyc2lvblV0aWwuaW5zdGFuY2UgPSBuZXcgQW5ndWxhclZlcnNpb25VdGlsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEFuZ3VsYXJWZXJzaW9uVXRpbC5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYW5WZXJzaW9uKHZlcnNpb246IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB2ZXJzaW9uXG4gICAgICAgICAgICAucmVwbGFjZSgnficsICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoJ14nLCAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKCc9JywgJycpXG4gICAgICAgICAgICAucmVwbGFjZSgnPCcsICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoJz4nLCAnJyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEFuZ3VsYXJWZXJzaW9uT2ZQcm9qZWN0KHBhY2thZ2VEYXRhKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IF9yZXN1bHQgPSAnJztcblxuICAgICAgICBpZiAocGFja2FnZURhdGEuZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgICAgICBsZXQgYW5ndWxhckNvcmUgPSBwYWNrYWdlRGF0YS5kZXBlbmRlbmNpZXNbQW5ndWxhclZlcnNpb25VdGlsLkNvcmVQYWNrYWdlXTtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyQ29yZSkge1xuICAgICAgICAgICAgICAgIF9yZXN1bHQgPSB0aGlzLmNsZWFuVmVyc2lvbihhbmd1bGFyQ29yZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX3Jlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzQW5ndWxhclZlcnNpb25BcmNoaXZlZCh2ZXJzaW9uOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IHJlc3VsdDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzdWx0ID0gc2VtdmVyLmNvbXBhcmUodmVyc2lvbiwgJzIuNC4xMCcpIDw9IDA7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJlZml4T2ZmaWNpYWxEb2ModmVyc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNBbmd1bGFyVmVyc2lvbkFyY2hpdmVkKHZlcnNpb24pID8gJ3YyLicgOiAnJztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0QXBpTGluayhhcGk6IElBbmd1bGFyQXBpLCBhbmd1bGFyVmVyc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGFuZ3VsYXJEb2NQcmVmaXggPSB0aGlzLnByZWZpeE9mZmljaWFsRG9jKGFuZ3VsYXJWZXJzaW9uKTtcbiAgICAgICAgcmV0dXJuIGBodHRwczovLyR7YW5ndWxhckRvY1ByZWZpeH1hbmd1bGFyLmlvLyR7YXBpLnBhdGh9YDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFuZ3VsYXJWZXJzaW9uVXRpbC5nZXRJbnN0YW5jZSgpO1xuIl19