"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dependencies_engine_1 = require("../dependencies.engine");
var ElementAloneHelper = /** @class */ (function () {
    function ElementAloneHelper() {
    }
    ElementAloneHelper.prototype.helperFunc = function (context, elements, elementType, options) {
        var alones = [];
        var modules = dependencies_engine_1.default.modules;
        elements.forEach(function (element) {
            var foundInOneModule = false;
            modules.forEach(function (module) {
                module.declarations.forEach(function (declaration) {
                    if (declaration.id === element.id) {
                        foundInOneModule = true;
                    }
                    if (declaration.file === element.file) {
                        foundInOneModule = true;
                    }
                });
                module.controllers.forEach(function (controller) {
                    if (controller.id === element.id) {
                        foundInOneModule = true;
                    }
                    if (controller.file === element.file) {
                        foundInOneModule = true;
                    }
                });
                module.providers.forEach(function (provider) {
                    if (provider.id === element.id) {
                        foundInOneModule = true;
                    }
                    if (provider.file === element.file) {
                        foundInOneModule = true;
                    }
                });
            });
            if (!foundInOneModule) {
                alones.push(element);
            }
        });
        if (alones.length > 0) {
            switch (elementType) {
                case 'component':
                    context.components = alones;
                    break;
                case 'directive':
                    context.directives = alones;
                    break;
                case 'controller':
                    context.controllers = alones;
                    break;
                case 'injectable':
                    context.injectables = alones;
                    break;
                case 'pipe':
                    context.pipes = alones;
                    break;
            }
            return options.fn(context);
        }
    };
    return ElementAloneHelper;
}());
exports.ElementAloneHelper = ElementAloneHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudC1hbG9uZS5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9lbmdpbmVzL2h0bWwtZW5naW5lLWhlbHBlcnMvZWxlbWVudC1hbG9uZS5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw4REFBd0Q7QUFFeEQ7SUFDSTtJQUFlLENBQUM7SUFFVCx1Q0FBVSxHQUFqQixVQUFrQixPQUFZLEVBQUUsUUFBUSxFQUFFLFdBQW1CLEVBQUUsT0FBMkI7UUFDdEYsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksT0FBTyxHQUFHLDZCQUFrQixDQUFDLE9BQU8sQ0FBQztRQUV6QyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTztZQUNwQixJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztZQUM3QixPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTTtnQkFDbEIsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQSxXQUFXO29CQUNuQyxJQUFJLFdBQVcsQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDLEVBQUUsRUFBRTt3QkFDL0IsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO3FCQUMzQjtvQkFDRCxJQUFJLFdBQVcsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLElBQUksRUFBRTt3QkFDbkMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO3FCQUMzQjtnQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFDSCxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFVBQVU7b0JBQ2pDLElBQUksVUFBVSxDQUFDLEVBQUUsS0FBSyxPQUFPLENBQUMsRUFBRSxFQUFFO3dCQUM5QixnQkFBZ0IsR0FBRyxJQUFJLENBQUM7cUJBQzNCO29CQUNELElBQUksVUFBVSxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsSUFBSSxFQUFFO3dCQUNsQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7cUJBQzNCO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUEsUUFBUTtvQkFDN0IsSUFBSSxRQUFRLENBQUMsRUFBRSxLQUFLLE9BQU8sQ0FBQyxFQUFFLEVBQUU7d0JBQzVCLGdCQUFnQixHQUFHLElBQUksQ0FBQztxQkFDM0I7b0JBQ0QsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxJQUFJLEVBQUU7d0JBQ2hDLGdCQUFnQixHQUFHLElBQUksQ0FBQztxQkFDM0I7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN4QjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNuQixRQUFRLFdBQVcsRUFBRTtnQkFDakIsS0FBSyxXQUFXO29CQUNaLE9BQU8sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO29CQUM1QixNQUFNO2dCQUNWLEtBQUssV0FBVztvQkFDWixPQUFPLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztvQkFDNUIsTUFBTTtnQkFDVixLQUFLLFlBQVk7b0JBQ2IsT0FBTyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7b0JBQzdCLE1BQU07Z0JBQ1YsS0FBSyxZQUFZO29CQUNiLE9BQU8sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO29CQUM3QixNQUFNO2dCQUNWLEtBQUssTUFBTTtvQkFDUCxPQUFPLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztvQkFDdkIsTUFBTTthQUNiO1lBQ0QsT0FBTyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzlCO0lBQ0wsQ0FBQztJQUNMLHlCQUFDO0FBQUQsQ0FBQyxBQTdERCxJQTZEQztBQTdEWSxnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJSHRtbEVuZ2luZUhlbHBlciwgSUhhbmRsZWJhcnNPcHRpb25zIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXIuaW50ZXJmYWNlJztcbmltcG9ydCBEZXBlbmRlbmNpZXNFbmdpbmUgZnJvbSAnLi4vZGVwZW5kZW5jaWVzLmVuZ2luZSc7XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50QWxvbmVIZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCBlbGVtZW50cywgZWxlbWVudFR5cGU6IHN0cmluZywgb3B0aW9uczogSUhhbmRsZWJhcnNPcHRpb25zKSB7XG4gICAgICAgIGxldCBhbG9uZXMgPSBbXTtcbiAgICAgICAgbGV0IG1vZHVsZXMgPSBEZXBlbmRlbmNpZXNFbmdpbmUubW9kdWxlcztcblxuICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGZvdW5kSW5PbmVNb2R1bGUgPSBmYWxzZTtcbiAgICAgICAgICAgIG1vZHVsZXMuZm9yRWFjaChtb2R1bGUgPT4ge1xuICAgICAgICAgICAgICAgIG1vZHVsZS5kZWNsYXJhdGlvbnMuZm9yRWFjaChkZWNsYXJhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWNsYXJhdGlvbi5pZCA9PT0gZWxlbWVudC5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRJbk9uZU1vZHVsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlY2xhcmF0aW9uLmZpbGUgPT09IGVsZW1lbnQuZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRJbk9uZU1vZHVsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtb2R1bGUuY29udHJvbGxlcnMuZm9yRWFjaChjb250cm9sbGVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXIuaWQgPT09IGVsZW1lbnQuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kSW5PbmVNb2R1bGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250cm9sbGVyLmZpbGUgPT09IGVsZW1lbnQuZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRJbk9uZU1vZHVsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtb2R1bGUucHJvdmlkZXJzLmZvckVhY2gocHJvdmlkZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvdmlkZXIuaWQgPT09IGVsZW1lbnQuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kSW5PbmVNb2R1bGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm92aWRlci5maWxlID09PSBlbGVtZW50LmZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kSW5PbmVNb2R1bGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghZm91bmRJbk9uZU1vZHVsZSkge1xuICAgICAgICAgICAgICAgIGFsb25lcy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoYWxvbmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZWxlbWVudFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdjb21wb25lbnQnOlxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmNvbXBvbmVudHMgPSBhbG9uZXM7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGl2ZSc6XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZGlyZWN0aXZlcyA9IGFsb25lcztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29udHJvbGxlcic6XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuY29udHJvbGxlcnMgPSBhbG9uZXM7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2luamVjdGFibGUnOlxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmluamVjdGFibGVzID0gYWxvbmVzO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdwaXBlJzpcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5waXBlcyA9IGFsb25lcztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5mbihjb250ZXh0KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==