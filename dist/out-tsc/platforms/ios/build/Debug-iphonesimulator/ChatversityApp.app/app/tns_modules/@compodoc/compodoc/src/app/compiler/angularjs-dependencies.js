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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcmpzLWRlcGVuZGVuY2llcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvY29tcGlsZXIvYW5ndWxhcmpzLWRlcGVuZGVuY2llcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRFQUF5RTtBQUN6RSxzRUFBbUU7QUFDbkUsc0VBQW9FO0FBQ3BFLHNFQUFvRTtBQUNwRSxtRUFBaUU7QUFFakU7SUFBMkMseUNBQXFCO0lBTzVELCtCQUFZLEtBQWUsRUFBRSxPQUFZO1FBQXpDLFlBQ0ksa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUN4QjtRQVBPLFdBQUssR0FBbUIsSUFBSSxpQ0FBYyxFQUFFLENBQUM7UUFDN0Msa0JBQVksR0FBRyxJQUFJLDRCQUFZLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVDLGlCQUFXLEdBQUcsSUFBSSwyQkFBVyxFQUFFLENBQUM7UUFDaEMsa0JBQVksR0FBRyxJQUFJLDRCQUFZLEVBQUUsQ0FBQzs7SUFJMUMsQ0FBQztJQUVNLCtDQUFlLEdBQXRCO1FBQ0ksSUFBSSxJQUFJLEdBQUc7WUFDUCxPQUFPLEVBQUUsRUFBRTtZQUNYLGVBQWUsRUFBRSxFQUFFO1lBQ25CLFVBQVUsRUFBRSxFQUFFO1lBQ2QsV0FBVyxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsRUFBRTtZQUNoQixLQUFLLEVBQUUsRUFBRTtZQUNULFVBQVUsRUFBRSxFQUFFO1lBQ2QsTUFBTSxFQUFFLEVBQUU7WUFDVixPQUFPLEVBQUUsRUFBRTtZQUNYLFVBQVUsRUFBRSxFQUFFO1lBQ2QsYUFBYSxFQUFFO2dCQUNYLFNBQVMsRUFBRSxFQUFFO2dCQUNiLFNBQVMsRUFBRSxFQUFFO2dCQUNiLFdBQVcsRUFBRSxFQUFFO2dCQUNmLFlBQVksRUFBRSxFQUFFO2FBQ25CO1lBQ0QsVUFBVSxFQUFFLFNBQVM7U0FDeEIsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDTCw0QkFBQztBQUFELENBQUMsQUFqQ0QsQ0FBMkMsOENBQXFCLEdBaUMvRDtBQWpDWSxzREFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnRDYWNoZSB9IGZyb20gJy4vYW5ndWxhci9kZXBzL2hlbHBlcnMvY29tcG9uZW50LWhlbHBlcic7XG5pbXBvcnQgeyBKc0RvY0hlbHBlciB9IGZyb20gJy4vYW5ndWxhci9kZXBzL2hlbHBlcnMvanMtZG9jLWhlbHBlcic7XG5pbXBvcnQgeyBNb2R1bGVIZWxwZXIgfSBmcm9tICcuL2FuZ3VsYXIvZGVwcy9oZWxwZXJzL21vZHVsZS1oZWxwZXInO1xuaW1wb3J0IHsgU3ltYm9sSGVscGVyIH0gZnJvbSAnLi9hbmd1bGFyL2RlcHMvaGVscGVycy9zeW1ib2wtaGVscGVyJztcbmltcG9ydCB7IEZyYW1ld29ya0RlcGVuZGVuY2llcyB9IGZyb20gJy4vZnJhbWV3b3JrLWRlcGVuZGVuY2llcyc7XG5cbmV4cG9ydCBjbGFzcyBBbmd1bGFySlNEZXBlbmRlbmNpZXMgZXh0ZW5kcyBGcmFtZXdvcmtEZXBlbmRlbmNpZXMge1xuICAgIHByaXZhdGUgZW5naW5lOiBhbnk7XG4gICAgcHJpdmF0ZSBjYWNoZTogQ29tcG9uZW50Q2FjaGUgPSBuZXcgQ29tcG9uZW50Q2FjaGUoKTtcbiAgICBwcml2YXRlIG1vZHVsZUhlbHBlciA9IG5ldyBNb2R1bGVIZWxwZXIodGhpcy5jYWNoZSk7XG4gICAgcHJpdmF0ZSBqc0RvY0hlbHBlciA9IG5ldyBKc0RvY0hlbHBlcigpO1xuICAgIHByaXZhdGUgc3ltYm9sSGVscGVyID0gbmV3IFN5bWJvbEhlbHBlcigpO1xuXG4gICAgY29uc3RydWN0b3IoZmlsZXM6IHN0cmluZ1tdLCBvcHRpb25zOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoZmlsZXMsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXREZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIGxldCBkZXBzID0ge1xuICAgICAgICAgICAgbW9kdWxlczogW10sXG4gICAgICAgICAgICBtb2R1bGVzRm9yR3JhcGg6IFtdLFxuICAgICAgICAgICAgY29tcG9uZW50czogW10sXG4gICAgICAgICAgICBpbmplY3RhYmxlczogW10sXG4gICAgICAgICAgICBpbnRlcmNlcHRvcnM6IFtdLFxuICAgICAgICAgICAgcGlwZXM6IFtdLFxuICAgICAgICAgICAgZGlyZWN0aXZlczogW10sXG4gICAgICAgICAgICByb3V0ZXM6IFtdLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBpbnRlcmZhY2VzOiBbXSxcbiAgICAgICAgICAgIG1pc2NlbGxhbmVvdXM6IHtcbiAgICAgICAgICAgICAgICB2YXJpYWJsZXM6IFtdLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uczogW10sXG4gICAgICAgICAgICAgICAgdHlwZWFsaWFzZXM6IFtdLFxuICAgICAgICAgICAgICAgIGVudW1lcmF0aW9uczogW11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByb3V0ZXNUcmVlOiB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRlcHM7XG4gICAgfVxufVxuIl19