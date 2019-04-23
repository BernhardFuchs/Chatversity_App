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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci12ZXJzaW9uLnV0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL3V0aWxzL2FuZ3VsYXItdmVyc2lvbi51dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQWlDO0FBR2pDO0lBSUk7SUFBdUIsQ0FBQztJQUNWLDhCQUFXLEdBQXpCO1FBQ0ksSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRTtZQUM5QixrQkFBa0IsQ0FBQyxRQUFRLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1NBQzFEO1FBQ0QsT0FBTyxrQkFBa0IsQ0FBQyxRQUFRLENBQUM7SUFDdkMsQ0FBQztJQUVNLHlDQUFZLEdBQW5CLFVBQW9CLE9BQWU7UUFDL0IsT0FBTyxPQUFPO2FBQ1QsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7YUFDaEIsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7YUFDaEIsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7YUFDaEIsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7YUFDaEIsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRU0sdURBQTBCLEdBQWpDLFVBQWtDLFdBQVc7UUFDekMsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBRWpCLElBQUksV0FBVyxDQUFDLFlBQVksRUFBRTtZQUMxQixJQUFJLFdBQVcsR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzNFLElBQUksV0FBVyxFQUFFO2dCQUNiLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQzVDO1NBQ0o7UUFFRCxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRU8scURBQXdCLEdBQWhDLFVBQWlDLE9BQWU7UUFDNUMsSUFBSSxNQUFNLENBQUM7UUFFWCxJQUFJO1lBQ0EsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuRDtRQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUU7UUFFZCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU0sOENBQWlCLEdBQXhCLFVBQXlCLE9BQWU7UUFDcEMsT0FBTyxJQUFJLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQy9ELENBQUM7SUFFTSx1Q0FBVSxHQUFqQixVQUFrQixHQUFnQixFQUFFLGNBQXNCO1FBQ3RELElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlELE9BQU8sYUFBVyxnQkFBZ0IsbUJBQWMsR0FBRyxDQUFDLElBQU0sQ0FBQztJQUMvRCxDQUFDO0lBbER1Qiw4QkFBVyxHQUFHLGVBQWUsQ0FBQztJQW1EMUQseUJBQUM7Q0FBQSxBQXBERCxJQW9EQztBQXBEWSxnREFBa0I7QUFzRC9CLGtCQUFlLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc2VtdmVyIGZyb20gJ3NlbXZlcic7XG5pbXBvcnQgeyBJQW5ndWxhckFwaSB9IGZyb20gJy4vYW5ndWxhci1hcGkudXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBBbmd1bGFyVmVyc2lvblV0aWwge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IENvcmVQYWNrYWdlID0gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEFuZ3VsYXJWZXJzaW9uVXRpbDtcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgICAgICBpZiAoIUFuZ3VsYXJWZXJzaW9uVXRpbC5pbnN0YW5jZSkge1xuICAgICAgICAgICAgQW5ndWxhclZlcnNpb25VdGlsLmluc3RhbmNlID0gbmV3IEFuZ3VsYXJWZXJzaW9uVXRpbCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBBbmd1bGFyVmVyc2lvblV0aWwuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFuVmVyc2lvbih2ZXJzaW9uOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdmVyc2lvblxuICAgICAgICAgICAgLnJlcGxhY2UoJ34nLCAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKCdeJywgJycpXG4gICAgICAgICAgICAucmVwbGFjZSgnPScsICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoJzwnLCAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKCc+JywgJycpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRBbmd1bGFyVmVyc2lvbk9mUHJvamVjdChwYWNrYWdlRGF0YSk6IHN0cmluZyB7XG4gICAgICAgIGxldCBfcmVzdWx0ID0gJyc7XG5cbiAgICAgICAgaWYgKHBhY2thZ2VEYXRhLmRlcGVuZGVuY2llcykge1xuICAgICAgICAgICAgbGV0IGFuZ3VsYXJDb3JlID0gcGFja2FnZURhdGEuZGVwZW5kZW5jaWVzW0FuZ3VsYXJWZXJzaW9uVXRpbC5Db3JlUGFja2FnZV07XG4gICAgICAgICAgICBpZiAoYW5ndWxhckNvcmUpIHtcbiAgICAgICAgICAgICAgICBfcmVzdWx0ID0gdGhpcy5jbGVhblZlcnNpb24oYW5ndWxhckNvcmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9yZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0FuZ3VsYXJWZXJzaW9uQXJjaGl2ZWQodmVyc2lvbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCByZXN1bHQ7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHNlbXZlci5jb21wYXJlKHZlcnNpb24sICcyLjQuMTAnKSA8PSAwO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHByZWZpeE9mZmljaWFsRG9jKHZlcnNpb246IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQW5ndWxhclZlcnNpb25BcmNoaXZlZCh2ZXJzaW9uKSA/ICd2Mi4nIDogJyc7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEFwaUxpbmsoYXBpOiBJQW5ndWxhckFwaSwgYW5ndWxhclZlcnNpb246IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCBhbmd1bGFyRG9jUHJlZml4ID0gdGhpcy5wcmVmaXhPZmZpY2lhbERvYyhhbmd1bGFyVmVyc2lvbik7XG4gICAgICAgIHJldHVybiBgaHR0cHM6Ly8ke2FuZ3VsYXJEb2NQcmVmaXh9YW5ndWxhci5pby8ke2FwaS5wYXRofWA7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBbmd1bGFyVmVyc2lvblV0aWwuZ2V0SW5zdGFuY2UoKTtcbiJdfQ==