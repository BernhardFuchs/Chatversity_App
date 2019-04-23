"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbol_helper_1 = require("./symbol-helper");
var ModuleHelper = /** @class */ (function () {
    function ModuleHelper(cache, symbolHelper) {
        if (symbolHelper === void 0) { symbolHelper = new symbol_helper_1.SymbolHelper(); }
        this.cache = cache;
        this.symbolHelper = symbolHelper;
    }
    ModuleHelper.prototype.getModuleProviders = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'providers', srcFile)
            .map(function (providerName) { return _this.symbolHelper.parseDeepIndentifier(providerName, srcFile); });
    };
    ModuleHelper.prototype.getModuleControllers = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'controllers', srcFile)
            .map(function (providerName) { return _this.symbolHelper.parseDeepIndentifier(providerName, srcFile); });
    };
    ModuleHelper.prototype.getModuleDeclarations = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper.getSymbolDeps(props, 'declarations', srcFile).map(function (name) {
            var component = _this.cache.get(name);
            if (component) {
                return component;
            }
            return _this.symbolHelper.parseDeepIndentifier(name, srcFile);
        });
    };
    ModuleHelper.prototype.getModuleEntryComponents = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper.getSymbolDeps(props, 'entryComponents', srcFile).map(function (name) {
            var component = _this.cache.get(name);
            if (component) {
                return component;
            }
            return _this.symbolHelper.parseDeepIndentifier(name, srcFile);
        });
    };
    ModuleHelper.prototype.cleanImportForRootForChild = function (name) {
        var nsModule = name.split('.');
        if (nsModule.length > 0) {
            name = nsModule[0];
        }
        return name;
    };
    ModuleHelper.prototype.getModuleImports = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'imports', srcFile)
            .map(function (name) { return _this.cleanImportForRootForChild(name); })
            .map(function (name) { return _this.symbolHelper.parseDeepIndentifier(name); });
    };
    ModuleHelper.prototype.getModuleExports = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'exports', srcFile)
            .map(function (name) { return _this.symbolHelper.parseDeepIndentifier(name, srcFile); });
    };
    ModuleHelper.prototype.getModuleImportsRaw = function (props, srcFile) {
        return this.symbolHelper.getSymbolDepsRaw(props, 'imports');
    };
    ModuleHelper.prototype.getModuleId = function (props, srcFile) {
        var _id = this.symbolHelper.getSymbolDeps(props, 'id', srcFile), id;
        if (_id.length === 1) {
            id = _id[0];
        }
        return id;
    };
    ModuleHelper.prototype.getModuleSchemas = function (props, srcFile) {
        var schemas = this.symbolHelper.getSymbolDeps(props, 'schemas', srcFile);
        return schemas;
    };
    ModuleHelper.prototype.getModuleBootstrap = function (props, srcFile) {
        var _this = this;
        return this.symbolHelper
            .getSymbolDeps(props, 'bootstrap', srcFile)
            .map(function (name) { return _this.symbolHelper.parseDeepIndentifier(name, srcFile); });
    };
    return ModuleHelper;
}());
exports.ModuleHelper = ModuleHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvY29tcGlsZXIvYW5ndWxhci9kZXBzL2hlbHBlcnMvbW9kdWxlLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUEyRTtBQUszRTtJQUNJLHNCQUNZLEtBQXFCLEVBQ3JCLFlBQStDO1FBQS9DLDZCQUFBLEVBQUEsbUJBQWlDLDRCQUFZLEVBQUU7UUFEL0MsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDckIsaUJBQVksR0FBWixZQUFZLENBQW1DO0lBQ3hELENBQUM7SUFFRyx5Q0FBa0IsR0FBekIsVUFDSSxLQUFpRCxFQUNqRCxPQUFzQjtRQUYxQixpQkFPQztRQUhHLE9BQU8sSUFBSSxDQUFDLFlBQVk7YUFDbkIsYUFBYSxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDO2FBQzFDLEdBQUcsQ0FBQyxVQUFBLFlBQVksSUFBSSxPQUFBLEtBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxFQUE3RCxDQUE2RCxDQUFDLENBQUM7SUFDNUYsQ0FBQztJQUVNLDJDQUFvQixHQUEzQixVQUNJLEtBQWlELEVBQ2pELE9BQXNCO1FBRjFCLGlCQU9DO1FBSEcsT0FBTyxJQUFJLENBQUMsWUFBWTthQUNuQixhQUFhLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUM7YUFDNUMsR0FBRyxDQUFDLFVBQUEsWUFBWSxJQUFJLE9BQUEsS0FBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFD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QyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xCLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDZjtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVNLHVDQUFnQixHQUF2QixVQUNJLEtBQWlELEVBQ2pELE9BQXNCO1FBRXRCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekUsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVNLHlDQUFrQixHQUF6QixVQUNJLEtBQWlELEVBQ2pELE9BQXNCO1FBRjFCLGlCQU9DO1FBSEcsT0FBTyxJQUFJLENBQUMsWUFBWTthQUNuQixhQUFhLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUM7YUFDMUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsS0FBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQXJELENBQXFELENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEFBcEhELElBb0hDO0FBcEhZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3ltYm9sSGVscGVyLCBJUGFyc2VEZWVwSWRlbnRpZmllclJlc3VsdCB9IGZyb20gJy4vc3ltYm9sLWhlbHBlcic7XG5pbXBvcnQgeyBDb21wb25lbnRDYWNoZSB9IGZyb20gJy4vY29tcG9uZW50LWhlbHBlcic7XG5pbXBvcnQgeyBEZXBzIH0gZnJvbSAnLi4vLi4vZGVwZW5kZW5jaWVzLmludGVyZmFjZXMnO1xuaW1wb3J0IHsgdHMgfSBmcm9tICd0cy1zaW1wbGUtYXN0JztcblxuZXhwb3J0IGNsYXNzIE1vZHVsZUhlbHBlciB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgY2FjaGU6IENvbXBvbmVudENhY2hlLFxuICAgICAgICBwcml2YXRlIHN5bWJvbEhlbHBlcjogU3ltYm9sSGVscGVyID0gbmV3IFN5bWJvbEhlbHBlcigpXG4gICAgKSB7fVxuXG4gICAgcHVibGljIGdldE1vZHVsZVByb3ZpZGVycyhcbiAgICAgICAgcHJvcHM6IFJlYWRvbmx5QXJyYXk8dHMuT2JqZWN0TGl0ZXJhbEVsZW1lbnRMaWtlPixcbiAgICAgICAgc3JjRmlsZTogdHMuU291cmNlRmlsZVxuICAgICk6IEFycmF5PElQYXJzZURlZXBJZGVudGlmaWVyUmVzdWx0PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bWJvbEhlbHBlclxuICAgICAgICAgICAgLmdldFN5bWJvbERlcHMocHJvcHMsICdwcm92aWRlcnMnLCBzcmNGaWxlKVxuICAgICAgICAgICAgLm1hcChwcm92aWRlck5hbWUgPT4gdGhpcy5zeW1ib2xIZWxwZXIucGFyc2VEZWVwSW5kZW50aWZpZXIocHJvdmlkZXJOYW1lLCBzcmNGaWxlKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE1vZHVsZUNvbnRyb2xsZXJzKFxuICAgICAgICBwcm9wczogUmVhZG9ubHlBcnJheTx0cy5PYmplY3RMaXRlcmFsRWxlbWVudExpa2U+LFxuICAgICAgICBzcmNGaWxlOiB0cy5Tb3VyY2VGaWxlXG4gICAgKTogQXJyYXk8SVBhcnNlRGVlcElkZW50aWZpZXJSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sSGVscGVyXG4gICAgICAgICAgICAuZ2V0U3ltYm9sRGVwcyhwcm9wcywgJ2NvbnRyb2xsZXJzJywgc3JjRmlsZSlcbiAgICAgICAgICAgIC5tYXAocHJvdmlkZXJOYW1lID0+IHRoaXMuc3ltYm9sSGVscGVyLnBhcnNlRGVlcEluZGVudGlmaWVyKHByb3ZpZGVyTmFtZSwgc3JjRmlsZSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRNb2R1bGVEZWNsYXJhdGlvbnMoXG4gICAgICAgIHByb3BzOiBSZWFkb25seUFycmF5PHRzLk9iamVjdExpdGVyYWxFbGVtZW50TGlrZT4sXG4gICAgICAgIHNyY0ZpbGU6IHRzLlNvdXJjZUZpbGVcbiAgICApOiBEZXBzW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2xIZWxwZXIuZ2V0U3ltYm9sRGVwcyhwcm9wcywgJ2RlY2xhcmF0aW9ucycsIHNyY0ZpbGUpLm1hcChuYW1lID0+IHtcbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmNhY2hlLmdldChuYW1lKTtcblxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN5bWJvbEhlbHBlci5wYXJzZURlZXBJbmRlbnRpZmllcihuYW1lLCBzcmNGaWxlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE1vZHVsZUVudHJ5Q29tcG9uZW50cyhcbiAgICAgICAgcHJvcHM6IFJlYWRvbmx5QXJyYXk8dHMuT2JqZWN0TGl0ZXJhbEVsZW1lbnRMaWtlPixcbiAgICAgICAgc3JjRmlsZTogdHMuU291cmNlRmlsZVxuICAgICk6IERlcHNbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bWJvbEhlbHBlci5nZXRTeW1ib2xEZXBzKHByb3BzLCAnZW50cnlDb21wb25lbnRzJywgc3JjRmlsZSkubWFwKG5hbWUgPT4ge1xuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuY2FjaGUuZ2V0KG5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sSGVscGVyLnBhcnNlRGVlcEluZGVudGlmaWVyKG5hbWUsIHNyY0ZpbGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFuSW1wb3J0Rm9yUm9vdEZvckNoaWxkKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCBuc01vZHVsZSA9IG5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgaWYgKG5zTW9kdWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG5hbWUgPSBuc01vZHVsZVswXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TW9kdWxlSW1wb3J0cyhcbiAgICAgICAgcHJvcHM6IFJlYWRvbmx5QXJyYXk8dHMuT2JqZWN0TGl0ZXJhbEVsZW1lbnRMaWtlPixcbiAgICAgICAgc3JjRmlsZTogdHMuU291cmNlRmlsZVxuICAgICk6IEFycmF5PElQYXJzZURlZXBJZGVudGlmaWVyUmVzdWx0PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bWJvbEhlbHBlclxuICAgICAgICAgICAgLmdldFN5bWJvbERlcHMocHJvcHMsICdpbXBvcnRzJywgc3JjRmlsZSlcbiAgICAgICAgICAgIC5tYXAobmFtZSA9PiB0aGlzLmNsZWFuSW1wb3J0Rm9yUm9vdEZvckNoaWxkKG5hbWUpKVxuICAgICAgICAgICAgLm1hcChuYW1lID0+IHRoaXMuc3ltYm9sSGVscGVyLnBhcnNlRGVlcEluZGVudGlmaWVyKG5hbWUpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TW9kdWxlRXhwb3J0cyhcbiAgICAgICAgcHJvcHM6IFJlYWRvbmx5QXJyYXk8dHMuT2JqZWN0TGl0ZXJhbEVsZW1lbnRMaWtlPixcbiAgICAgICAgc3JjRmlsZTogdHMuU291cmNlRmlsZVxuICAgICk6IEFycmF5PElQYXJzZURlZXBJZGVudGlmaWVyUmVzdWx0PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bWJvbEhlbHBlclxuICAgICAgICAgICAgLmdldFN5bWJvbERlcHMocHJvcHMsICdleHBvcnRzJywgc3JjRmlsZSlcbiAgICAgICAgICAgIC5tYXAobmFtZSA9PiB0aGlzLnN5bWJvbEhlbHBlci5wYXJzZURlZXBJbmRlbnRpZmllcihuYW1lLCBzcmNGaWxlKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE1vZHVsZUltcG9ydHNSYXcoXG4gICAgICAgIHByb3BzOiBSZWFkb25seUFycmF5PHRzLk9iamVjdExpdGVyYWxFbGVtZW50TGlrZT4sXG4gICAgICAgIHNyY0ZpbGU6IHRzLlNvdXJjZUZpbGVcbiAgICApOiBBcnJheTx0cy5PYmplY3RMaXRlcmFsRWxlbWVudExpa2U+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sSGVscGVyLmdldFN5bWJvbERlcHNSYXcocHJvcHMsICdpbXBvcnRzJyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE1vZHVsZUlkKFxuICAgICAgICBwcm9wczogUmVhZG9ubHlBcnJheTx0cy5PYmplY3RMaXRlcmFsRWxlbWVudExpa2U+LFxuICAgICAgICBzcmNGaWxlOiB0cy5Tb3VyY2VGaWxlXG4gICAgKTogQXJyYXk8SVBhcnNlRGVlcElkZW50aWZpZXJSZXN1bHQ+IHtcbiAgICAgICAgbGV0IF9pZCA9IHRoaXMuc3ltYm9sSGVscGVyLmdldFN5bWJvbERlcHMocHJvcHMsICdpZCcsIHNyY0ZpbGUpLFxuICAgICAgICAgICAgaWQ7XG4gICAgICAgIGlmIChfaWQubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBpZCA9IF9pZFswXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE1vZHVsZVNjaGVtYXMoXG4gICAgICAgIHByb3BzOiBSZWFkb25seUFycmF5PHRzLk9iamVjdExpdGVyYWxFbGVtZW50TGlrZT4sXG4gICAgICAgIHNyY0ZpbGU6IHRzLlNvdXJjZUZpbGVcbiAgICApIHtcbiAgICAgICAgbGV0IHNjaGVtYXMgPSB0aGlzLnN5bWJvbEhlbHBlci5nZXRTeW1ib2xEZXBzKHByb3BzLCAnc2NoZW1hcycsIHNyY0ZpbGUpO1xuICAgICAgICByZXR1cm4gc2NoZW1hcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TW9kdWxlQm9vdHN0cmFwKFxuICAgICAgICBwcm9wczogUmVhZG9ubHlBcnJheTx0cy5PYmplY3RMaXRlcmFsRWxlbWVudExpa2U+LFxuICAgICAgICBzcmNGaWxlOiB0cy5Tb3VyY2VGaWxlXG4gICAgKTogQXJyYXk8SVBhcnNlRGVlcElkZW50aWZpZXJSZXN1bHQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sSGVscGVyXG4gICAgICAgICAgICAuZ2V0U3ltYm9sRGVwcyhwcm9wcywgJ2Jvb3RzdHJhcCcsIHNyY0ZpbGUpXG4gICAgICAgICAgICAubWFwKG5hbWUgPT4gdGhpcy5zeW1ib2xIZWxwZXIucGFyc2VEZWVwSW5kZW50aWZpZXIobmFtZSwgc3JjRmlsZSkpO1xuICAgIH1cbn1cbiJdfQ==