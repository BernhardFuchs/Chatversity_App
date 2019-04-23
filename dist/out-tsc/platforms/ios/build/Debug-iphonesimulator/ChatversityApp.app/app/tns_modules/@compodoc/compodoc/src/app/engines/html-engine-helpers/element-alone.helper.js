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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudC1hbG9uZS5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvaHRtbC1lbmdpbmUtaGVscGVycy9lbGVtZW50LWFsb25lLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDhEQUF3RDtBQUV4RDtJQUNJO0lBQWUsQ0FBQztJQUVULHVDQUFVLEdBQWpCLFVBQWtCLE9BQVksRUFBRSxRQUFRLEVBQUUsV0FBbUIsRUFBRSxPQUEyQjtRQUN0RixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxPQUFPLEdBQUcsNkJBQWtCLENBQUMsT0FBTyxDQUFDO1FBRXpDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO1lBQ3BCLElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxNQUFNO2dCQUNsQixNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFdBQVc7b0JBQ25DLElBQUksV0FBVyxDQUFDLEVBQUUsS0FBSyxPQUFPLENBQUMsRUFBRSxFQUFFO3dCQUMvQixnQkFBZ0IsR0FBRyxJQUFJLENBQUM7cUJBQzNCO29CQUNELElBQUksV0FBVyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsSUFBSSxFQUFFO3dCQUNuQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7cUJBQzNCO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUNILE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsVUFBVTtvQkFDakMsSUFBSSxVQUFVLENBQUMsRUFBRSxLQUFLLE9BQU8sQ0FBQyxFQUFFLEVBQUU7d0JBQzlCLGdCQUFnQixHQUFHLElBQUksQ0FBQztxQkFDM0I7b0JBQ0QsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxJQUFJLEVBQUU7d0JBQ2xDLGdCQUFnQixHQUFHLElBQUksQ0FBQztxQkFDM0I7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQSxRQUFRO29CQUM3QixJQUFJLFFBQVEsQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDLEVBQUUsRUFBRTt3QkFDNUIsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO3FCQUMzQjtvQkFDRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLElBQUksRUFBRTt3QkFDaEMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO3FCQUMzQjtnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3hCO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLFFBQVEsV0FBVyxFQUFFO2dCQUNqQixLQUFLLFdBQVc7b0JBQ1osT0FBTyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7b0JBQzVCLE1BQU07Z0JBQ1YsS0FBSyxXQUFXO29CQUNaLE9BQU8sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO29CQUM1QixNQUFNO2dCQUNWLEtBQUssWUFBWTtvQkFDYixPQUFPLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztvQkFDN0IsTUFBTTtnQkFDVixLQUFLLFlBQVk7b0JBQ2IsT0FBTyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7b0JBQzdCLE1BQU07Z0JBQ1YsS0FBSyxNQUFNO29CQUNQLE9BQU8sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO29CQUN2QixNQUFNO2FBQ2I7WUFDRCxPQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUI7SUFDTCxDQUFDO0lBQ0wseUJBQUM7QUFBRCxDQUFDLEFBN0RELElBNkRDO0FBN0RZLGdEQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElIdG1sRW5naW5lSGVscGVyLCBJSGFuZGxlYmFyc09wdGlvbnMgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlci5pbnRlcmZhY2UnO1xuaW1wb3J0IERlcGVuZGVuY2llc0VuZ2luZSBmcm9tICcuLi9kZXBlbmRlbmNpZXMuZW5naW5lJztcblxuZXhwb3J0IGNsYXNzIEVsZW1lbnRBbG9uZUhlbHBlciBpbXBsZW1lbnRzIElIdG1sRW5naW5lSGVscGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBwdWJsaWMgaGVscGVyRnVuYyhjb250ZXh0OiBhbnksIGVsZW1lbnRzLCBlbGVtZW50VHlwZTogc3RyaW5nLCBvcHRpb25zOiBJSGFuZGxlYmFyc09wdGlvbnMpIHtcbiAgICAgICAgbGV0IGFsb25lcyA9IFtdO1xuICAgICAgICBsZXQgbW9kdWxlcyA9IERlcGVuZGVuY2llc0VuZ2luZS5tb2R1bGVzO1xuXG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZm91bmRJbk9uZU1vZHVsZSA9IGZhbHNlO1xuICAgICAgICAgICAgbW9kdWxlcy5mb3JFYWNoKG1vZHVsZSA9PiB7XG4gICAgICAgICAgICAgICAgbW9kdWxlLmRlY2xhcmF0aW9ucy5mb3JFYWNoKGRlY2xhcmF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlY2xhcmF0aW9uLmlkID09PSBlbGVtZW50LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZEluT25lTW9kdWxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVjbGFyYXRpb24uZmlsZSA9PT0gZWxlbWVudC5maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZEluT25lTW9kdWxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1vZHVsZS5jb250cm9sbGVycy5mb3JFYWNoKGNvbnRyb2xsZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29udHJvbGxlci5pZCA9PT0gZWxlbWVudC5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRJbk9uZU1vZHVsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXIuZmlsZSA9PT0gZWxlbWVudC5maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZEluT25lTW9kdWxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1vZHVsZS5wcm92aWRlcnMuZm9yRWFjaChwcm92aWRlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm92aWRlci5pZCA9PT0gZWxlbWVudC5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRJbk9uZU1vZHVsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3ZpZGVyLmZpbGUgPT09IGVsZW1lbnQuZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRJbk9uZU1vZHVsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFmb3VuZEluT25lTW9kdWxlKSB7XG4gICAgICAgICAgICAgICAgYWxvbmVzLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChhbG9uZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc3dpdGNoIChlbGVtZW50VHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbXBvbmVudCc6XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuY29tcG9uZW50cyA9IGFsb25lcztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZGlyZWN0aXZlJzpcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5kaXJlY3RpdmVzID0gYWxvbmVzO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdjb250cm9sbGVyJzpcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5jb250cm9sbGVycyA9IGFsb25lcztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnaW5qZWN0YWJsZSc6XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuaW5qZWN0YWJsZXMgPSBhbG9uZXM7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3BpcGUnOlxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnBpcGVzID0gYWxvbmVzO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19