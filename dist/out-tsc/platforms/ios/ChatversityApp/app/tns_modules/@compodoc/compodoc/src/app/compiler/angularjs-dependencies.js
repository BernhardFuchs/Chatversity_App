"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_helper_1 = require("./angular/deps/helpers/component-helper");
var js_doc_helper_1 = require("./angular/deps/helpers/js-doc-helper");
var module_helper_1 = require("./angular/deps/helpers/module-helper");
var symbol_helper_1 = require("./angular/deps/helpers/symbol-helper");
var framework_dependencies_1 = require("./framework-dependencies");
var AngularJSDependencies = /** @class */ (function (_super) {
    __extends(AngularJSDependencies, _super);
    function AngularJSDependencies(files, options) {
        var _this = _super.call(this, files, options) || this;
        _this.cache = new component_helper_1.ComponentCache();
        _this.moduleHelper = new module_helper_1.ModuleHelper(_this.cache);
        _this.jsDocHelper = new js_doc_helper_1.JsDocHelper();
        _this.symbolHelper = new symbol_helper_1.SymbolHelper();
        return _this;
    }
    AngularJSDependencies.prototype.getDependencies = function () {
        var deps = {
            modules: [],
            modulesForGraph: [],
            components: [],
            injectables: [],
            interceptors: [],
            pipes: [],
            directives: [],
            routes: [],
            classes: [],
            interfaces: [],
            miscellaneous: {
                variables: [],
                functions: [],
                typealiases: [],
                enumerations: []
            },
            routesTree: undefined
        };
        return deps;
    };
    return AngularJSDependencies;
}(framework_dependencies_1.FrameworkDependencies));
exports.AngularJSDependencies = AngularJSDependencies;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcmpzLWRlcGVuZGVuY2llcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2NvbXBpbGVyL2FuZ3VsYXJqcy1kZXBlbmRlbmNpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0RUFBeUU7QUFDekUsc0VBQW1FO0FBQ25FLHNFQUFvRTtBQUNwRSxzRUFBb0U7QUFDcEUsbUVBQWlFO0FBRWpFO0lBQTJDLHlDQUFxQjtJQU81RCwrQkFBWSxLQUFlLEVBQUUsT0FBWTtRQUF6QyxZQUNJLGtCQUFNLEtBQUssRUFBRSxPQUFPLENBQUMsU0FDeEI7UUFQTyxXQUFLLEdBQW1CLElBQUksaUNBQWMsRUFBRSxDQUFDO1FBQzdDLGtCQUFZLEdBQUcsSUFBSSw0QkFBWSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QyxpQkFBVyxHQUFHLElBQUksMkJBQVcsRUFBRSxDQUFDO1FBQ2hDLGtCQUFZLEdBQUcsSUFBSSw0QkFBWSxFQUFFLENBQUM7O0lBSTFDLENBQUM7SUFFTSwrQ0FBZSxHQUF0QjtRQUNJLElBQUksSUFBSSxHQUFHO1lBQ1AsT0FBTyxFQUFFLEVBQUU7WUFDWCxlQUFlLEVBQUUsRUFBRTtZQUNuQixVQUFVLEVBQUUsRUFBRTtZQUNkLFdBQVcsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEVBQUU7WUFDaEIsS0FBSyxFQUFFLEVBQUU7WUFDVCxVQUFVLEVBQUUsRUFBRTtZQUNkLE1BQU0sRUFBRSxFQUFFO1lBQ1YsT0FBTyxFQUFFLEVBQUU7WUFDWCxVQUFVLEVBQUUsRUFBRTtZQUNkLGFBQWEsRUFBRTtnQkFDWCxTQUFTLEVBQUUsRUFBRTtnQkFDYixTQUFTLEVBQUUsRUFBRTtnQkFDYixXQUFXLEVBQUUsRUFBRTtnQkFDZixZQUFZLEVBQUUsRUFBRTthQUNuQjtZQUNELFVBQVUsRUFBRSxTQUFTO1NBQ3hCLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0wsNEJBQUM7QUFBRCxDQUFDLEFBakNELENBQTJDLDhDQUFxQixHQWlDL0Q7QUFqQ1ksc0RBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50Q2FjaGUgfSBmcm9tICcuL2FuZ3VsYXIvZGVwcy9oZWxwZXJzL2NvbXBvbmVudC1oZWxwZXInO1xuaW1wb3J0IHsgSnNEb2NIZWxwZXIgfSBmcm9tICcuL2FuZ3VsYXIvZGVwcy9oZWxwZXJzL2pzLWRvYy1oZWxwZXInO1xuaW1wb3J0IHsgTW9kdWxlSGVscGVyIH0gZnJvbSAnLi9hbmd1bGFyL2RlcHMvaGVscGVycy9tb2R1bGUtaGVscGVyJztcbmltcG9ydCB7IFN5bWJvbEhlbHBlciB9IGZyb20gJy4vYW5ndWxhci9kZXBzL2hlbHBlcnMvc3ltYm9sLWhlbHBlcic7XG5pbXBvcnQgeyBGcmFtZXdvcmtEZXBlbmRlbmNpZXMgfSBmcm9tICcuL2ZyYW1ld29yay1kZXBlbmRlbmNpZXMnO1xuXG5leHBvcnQgY2xhc3MgQW5ndWxhckpTRGVwZW5kZW5jaWVzIGV4dGVuZHMgRnJhbWV3b3JrRGVwZW5kZW5jaWVzIHtcbiAgICBwcml2YXRlIGVuZ2luZTogYW55O1xuICAgIHByaXZhdGUgY2FjaGU6IENvbXBvbmVudENhY2hlID0gbmV3IENvbXBvbmVudENhY2hlKCk7XG4gICAgcHJpdmF0ZSBtb2R1bGVIZWxwZXIgPSBuZXcgTW9kdWxlSGVscGVyKHRoaXMuY2FjaGUpO1xuICAgIHByaXZhdGUganNEb2NIZWxwZXIgPSBuZXcgSnNEb2NIZWxwZXIoKTtcbiAgICBwcml2YXRlIHN5bWJvbEhlbHBlciA9IG5ldyBTeW1ib2xIZWxwZXIoKTtcblxuICAgIGNvbnN0cnVjdG9yKGZpbGVzOiBzdHJpbmdbXSwgb3B0aW9uczogYW55KSB7XG4gICAgICAgIHN1cGVyKGZpbGVzLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RGVwZW5kZW5jaWVzKCkge1xuICAgICAgICBsZXQgZGVwcyA9IHtcbiAgICAgICAgICAgIG1vZHVsZXM6IFtdLFxuICAgICAgICAgICAgbW9kdWxlc0ZvckdyYXBoOiBbXSxcbiAgICAgICAgICAgIGNvbXBvbmVudHM6IFtdLFxuICAgICAgICAgICAgaW5qZWN0YWJsZXM6IFtdLFxuICAgICAgICAgICAgaW50ZXJjZXB0b3JzOiBbXSxcbiAgICAgICAgICAgIHBpcGVzOiBbXSxcbiAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtdLFxuICAgICAgICAgICAgcm91dGVzOiBbXSxcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgaW50ZXJmYWNlczogW10sXG4gICAgICAgICAgICBtaXNjZWxsYW5lb3VzOiB7XG4gICAgICAgICAgICAgICAgdmFyaWFibGVzOiBbXSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbnM6IFtdLFxuICAgICAgICAgICAgICAgIHR5cGVhbGlhc2VzOiBbXSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhdGlvbnM6IFtdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm91dGVzVHJlZTogdW5kZWZpbmVkXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkZXBzO1xuICAgIH1cbn1cbiJdfQ==