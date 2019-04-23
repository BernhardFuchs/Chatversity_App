"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var _1 = require(".");
var configuration_1 = require("../app/configuration");
var ExtendsMerger = /** @class */ (function () {
    function ExtendsMerger() {
    }
    ExtendsMerger.getInstance = function () {
        if (!ExtendsMerger.instance) {
            ExtendsMerger.instance = new ExtendsMerger();
        }
        return ExtendsMerger.instance;
    };
    ExtendsMerger.prototype.merge = function (deps) {
        var _this = this;
        this.components = deps.components;
        this.classes = deps.classes;
        this.injectables = deps.injectables;
        this.components.forEach(function (component) {
            var ext;
            if (typeof component.extends !== 'undefined') {
                ext = _this.findInDependencies(component.extends);
                if (ext) {
                    var recursiveScanWithInheritance_1 = function (cls) {
                        // From class to component
                        if (typeof cls.methods !== 'undefined' && cls.methods.length > 0) {
                            var newMethods = lodash_1.cloneDeep(cls.methods);
                            newMethods = _this.markInheritance(newMethods, cls);
                            if (typeof component.methodsClass !== 'undefined') {
                                component.methodsClass = component.methodsClass.concat(newMethods);
                            }
                        }
                        if (typeof cls.properties !== 'undefined' && cls.properties.length > 0) {
                            var newProperties = lodash_1.cloneDeep(cls.properties);
                            newProperties = _this.markInheritance(newProperties, cls);
                            if (typeof component.propertiesClass !== 'undefined') {
                                component.propertiesClass = component.propertiesClass.concat(newProperties);
                            }
                        }
                        // From component to component
                        if (typeof cls.inputsClass !== 'undefined' && cls.inputsClass.length > 0) {
                            var newInputs = lodash_1.cloneDeep(cls.inputsClass);
                            newInputs = _this.markInheritance(newInputs, cls);
                            if (typeof component.inputsClass !== 'undefined') {
                                component.inputsClass = component.inputsClass.concat(newInputs);
                            }
                        }
                        if (typeof cls.outputsClass !== 'undefined' &&
                            cls.outputsClass.length > 0) {
                            var newOutputs = lodash_1.cloneDeep(cls.outputsClass);
                            newOutputs = _this.markInheritance(newOutputs, cls);
                            if (typeof component.outputsClass !== 'undefined') {
                                component.outputsClass = component.outputsClass.concat(newOutputs);
                            }
                        }
                        if (typeof cls.methodsClass !== 'undefined' &&
                            cls.methodsClass.length > 0) {
                            var newMethods = lodash_1.cloneDeep(cls.methodsClass);
                            newMethods = _this.markInheritance(newMethods, cls);
                            if (typeof component.methodsClass !== 'undefined') {
                                component.methodsClass = component.methodsClass.concat(newMethods);
                            }
                        }
                        if (typeof cls.propertiesClass !== 'undefined' &&
                            cls.propertiesClass.length > 0) {
                            var newProperties = lodash_1.cloneDeep(cls.propertiesClass);
                            newProperties = _this.markInheritance(newProperties, cls);
                            if (typeof component.propertiesClass !== 'undefined') {
                                component.propertiesClass = component.propertiesClass.concat(newProperties);
                            }
                        }
                        if (typeof cls.hostBindings !== 'undefined' &&
                            cls.hostBindings.length > 0) {
                            var newHostBindings = lodash_1.cloneDeep(cls.hostBindings);
                            newHostBindings = _this.markInheritance(newHostBindings, cls);
                            if (typeof component.hostBindings !== 'undefined') {
                                component.hostBindings = component.hostBindings.concat(newHostBindings);
                            }
                        }
                        if (typeof cls.hostListeners !== 'undefined' &&
                            cls.hostListeners.length > 0) {
                            var newHostListeners = lodash_1.cloneDeep(cls.hostListeners);
                            newHostListeners = _this.markInheritance(newHostListeners, cls);
                            if (typeof component.hostListeners !== 'undefined') {
                                component.hostListeners = component.hostListeners.concat(newHostListeners);
                            }
                        }
                        if (configuration_1.default.mainData.disableLifeCycleHooks) {
                            component.methodsClass = _1.cleanLifecycleHooksFromMethods(component.methodsClass);
                        }
                        if (cls.extends) {
                            recursiveScanWithInheritance_1(_this.findInDependencies(cls.extends));
                        }
                    };
                    // From class to class
                    recursiveScanWithInheritance_1(ext);
                }
            }
        });
        var mergeExtendedClasses = function (el) {
            var ext;
            if (typeof el.extends !== 'undefined') {
                ext = _this.findInDependencies(el.extends);
                if (ext) {
                    var recursiveScanWithInheritance_2 = function (cls) {
                        if (typeof cls.methods !== 'undefined' && cls.methods.length > 0) {
                            var newMethods = lodash_1.cloneDeep(cls.methods);
                            newMethods = _this.markInheritance(newMethods, cls);
                            if (typeof el.methods !== 'undefined') {
                                el.methods = el.methods.concat(newMethods);
                            }
                        }
                        if (typeof cls.properties !== 'undefined' && cls.properties.length > 0) {
                            var newProperties = lodash_1.cloneDeep(cls.properties);
                            newProperties = _this.markInheritance(newProperties, cls);
                            if (typeof el.properties !== 'undefined') {
                                el.properties = el.properties.concat(newProperties);
                            }
                        }
                        if (cls.extends) {
                            recursiveScanWithInheritance_2(_this.findInDependencies(cls.extends));
                        }
                    };
                    // From elss to elss
                    recursiveScanWithInheritance_2(ext);
                }
            }
        };
        this.classes.forEach(mergeExtendedClasses);
        this.injectables.forEach(mergeExtendedClasses);
        return deps;
    };
    ExtendsMerger.prototype.markInheritance = function (data, originalource) {
        return data.map(function (el) {
            var newElement = el;
            newElement.inheritance = {
                file: originalource.name
            };
            return newElement;
        });
    };
    ExtendsMerger.prototype.findInDependencies = function (name) {
        var mergedData = lodash_1.concat([], this.components, this.classes, this.injectables);
        var result = lodash_1.find(mergedData, { name: name });
        return result || false;
    };
    return ExtendsMerger;
}());
exports.ExtendsMerger = ExtendsMerger;
exports.default = ExtendsMerger.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5kcy1tZXJnZXIudXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvdXRpbHMvZXh0ZW5kcy1tZXJnZXIudXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFpRDtBQUVqRCxzQkFBbUQ7QUFDbkQsc0RBQWlEO0FBRWpEO0lBTUk7SUFBdUIsQ0FBQztJQUNWLHlCQUFXLEdBQXpCO1FBQ0ksSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUU7WUFDekIsYUFBYSxDQUFDLFFBQVEsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1NBQ2hEO1FBQ0QsT0FBTyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBQ2xDLENBQUM7SUFFTSw2QkFBSyxHQUFaLFVBQWEsSUFBSTtRQUFqQixpQkFpSkM7UUFoSkcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFFcEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxTQUFTO1lBQzdCLElBQUksR0FBRyxDQUFDO1lBQ1IsSUFBSSxPQUFPLFNBQVMsQ0FBQyxPQUFPLEtBQUssV0FBVyxFQUFFO2dCQUMxQyxHQUFHLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDakQsSUFBSSxHQUFHLEVBQUU7b0JBQ0wsSUFBSSw4QkFBNEIsR0FBRyxVQUFBLEdBQUc7d0JBQ2xDLDBCQUEwQjt3QkFDMUIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxPQUFPLEtBQUssV0FBVyxJ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QVcsQ0FBQyxDQUFDO1FBQzdFLElBQUksTUFBTSxHQUFHLGFBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFTLENBQUMsQ0FBQztRQUNyRCxPQUFPLE1BQU0sSUFBSSxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNMLG9CQUFDO0FBQUQsQ0FBQyxBQWhMRCxJQWdMQztBQWhMWSxzQ0FBYTtBQWtMMUIsa0JBQWUsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2xvbmVEZWVwLCBjb25jYXQsIGZpbmQgfSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBjbGVhbkxpZmVjeWNsZUhvb2tzRnJvbU1ldGhvZHMgfSBmcm9tICcuJztcbmltcG9ydCBDb25maWd1cmF0aW9uIGZyb20gJy4uL2FwcC9jb25maWd1cmF0aW9uJztcblxuZXhwb3J0IGNsYXNzIEV4dGVuZHNNZXJnZXIge1xuICAgIHByaXZhdGUgY29tcG9uZW50cztcbiAgICBwcml2YXRlIGNsYXNzZXM7XG4gICAgcHJpdmF0ZSBpbmplY3RhYmxlcztcblxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBFeHRlbmRzTWVyZ2VyO1xuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICghRXh0ZW5kc01lcmdlci5pbnN0YW5jZSkge1xuICAgICAgICAgICAgRXh0ZW5kc01lcmdlci5pbnN0YW5jZSA9IG5ldyBFeHRlbmRzTWVyZ2VyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEV4dGVuZHNNZXJnZXIuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgcHVibGljIG1lcmdlKGRlcHMpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gZGVwcy5jb21wb25lbnRzO1xuICAgICAgICB0aGlzLmNsYXNzZXMgPSBkZXBzLmNsYXNzZXM7XG4gICAgICAgIHRoaXMuaW5qZWN0YWJsZXMgPSBkZXBzLmluamVjdGFibGVzO1xuXG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5mb3JFYWNoKGNvbXBvbmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZXh0O1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuZXh0ZW5kcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBleHQgPSB0aGlzLmZpbmRJbkRlcGVuZGVuY2llcyhjb21wb25lbnQuZXh0ZW5kcyk7XG4gICAgICAgICAgICAgICAgaWYgKGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVjdXJzaXZlU2NhbldpdGhJbmhlcml0YW5jZSA9IGNscyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGcm9tIGNsYXNzIHRvIGNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjbHMubWV0aG9kcyAhPT0gJ3VuZGVmaW5lZCcgJiYgY2xzLm1ldGhvZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdNZXRob2RzID0gY2xvbmVEZWVwKGNscy5tZXRob2RzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdNZXRob2RzID0gdGhpcy5tYXJrSW5oZXJpdGFuY2UobmV3TWV0aG9kcywgY2xzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5tZXRob2RzQ2xhc3MgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tZXRob2RzQ2xhc3MgPSBbLi4uY29tcG9uZW50Lm1ldGhvZHNDbGFzcywgLi4ubmV3TWV0aG9kc107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjbHMucHJvcGVydGllcyAhPT0gJ3VuZGVmaW5lZCcgJiYgY2xzLnByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdQcm9wZXJ0aWVzID0gY2xvbmVEZWVwKGNscy5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdQcm9wZXJ0aWVzID0gdGhpcy5tYXJrSW5oZXJpdGFuY2UobmV3UHJvcGVydGllcywgY2xzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5wcm9wZXJ0aWVzQ2xhc3MgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wZXJ0aWVzQ2xhc3MgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5jb21wb25lbnQucHJvcGVydGllc0NsYXNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ubmV3UHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZyb20gY29tcG9uZW50IHRvIGNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjbHMuaW5wdXRzQ2xhc3MgIT09ICd1bmRlZmluZWQnICYmIGNscy5pbnB1dHNDbGFzcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0lucHV0cyA9IGNsb25lRGVlcChjbHMuaW5wdXRzQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0lucHV0cyA9IHRoaXMubWFya0luaGVyaXRhbmNlKG5ld0lucHV0cywgY2xzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5pbnB1dHNDbGFzcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmlucHV0c0NsYXNzID0gWy4uLmNvbXBvbmVudC5pbnB1dHNDbGFzcywgLi4ubmV3SW5wdXRzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGNscy5vdXRwdXRzQ2xhc3MgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzLm91dHB1dHNDbGFzcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3T3V0cHV0cyA9IGNsb25lRGVlcChjbHMub3V0cHV0c0NsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPdXRwdXRzID0gdGhpcy5tYXJrSW5oZXJpdGFuY2UobmV3T3V0cHV0cywgY2xzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5vdXRwdXRzQ2xhc3MgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5vdXRwdXRzQ2xhc3MgPSBbLi4uY29tcG9uZW50Lm91dHB1dHNDbGFzcywgLi4ubmV3T3V0cHV0c107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBjbHMubWV0aG9kc0NsYXNzICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNscy5tZXRob2RzQ2xhc3MubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld01ldGhvZHMgPSBjbG9uZURlZXAoY2xzLm1ldGhvZHNDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3TWV0aG9kcyA9IHRoaXMubWFya0luaGVyaXRhbmNlKG5ld01ldGhvZHMsIGNscyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQubWV0aG9kc0NsYXNzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubWV0aG9kc0NsYXNzID0gWy4uLmNvbXBvbmVudC5tZXRob2RzQ2xhc3MsIC4uLm5ld01ldGhvZHNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgY2xzLnByb3BlcnRpZXNDbGFzcyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHMucHJvcGVydGllc0NsYXNzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdQcm9wZXJ0aWVzID0gY2xvbmVEZWVwKGNscy5wcm9wZXJ0aWVzQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Byb3BlcnRpZXMgPSB0aGlzLm1hcmtJbmhlcml0YW5jZShuZXdQcm9wZXJ0aWVzLCBjbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnByb3BlcnRpZXNDbGFzcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LnByb3BlcnRpZXNDbGFzcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbXBvbmVudC5wcm9wZXJ0aWVzQ2xhc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5uZXdQcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBjbHMuaG9zdEJpbmRpbmdzICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNscy5ob3N0QmluZGluZ3MubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0hvc3RCaW5kaW5ncyA9IGNsb25lRGVlcChjbHMuaG9zdEJpbmRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIb3N0QmluZGluZ3MgPSB0aGlzLm1hcmtJbmhlcml0YW5jZShuZXdIb3N0QmluZGluZ3MsIGNscyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuaG9zdEJpbmRpbmdzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuaG9zdEJpbmRpbmdzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uY29tcG9uZW50Lmhvc3RCaW5kaW5ncyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLm5ld0hvc3RCaW5kaW5nc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgY2xzLmhvc3RMaXN0ZW5lcnMgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzLmhvc3RMaXN0ZW5lcnMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0hvc3RMaXN0ZW5lcnMgPSBjbG9uZURlZXAoY2xzLmhvc3RMaXN0ZW5lcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hvc3RMaXN0ZW5lcnMgPSB0aGlzLm1hcmtJbmhlcml0YW5jZShuZXdIb3N0TGlzdGVuZXJzLCBjbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lmhvc3RMaXN0ZW5lcnMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5ob3N0TGlzdGVuZXJzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uY29tcG9uZW50Lmhvc3RMaXN0ZW5lcnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5uZXdIb3N0TGlzdGVuZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUxpZmVDeWNsZUhvb2tzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1ldGhvZHNDbGFzcyA9IGNsZWFuTGlmZWN5Y2xlSG9va3NGcm9tTWV0aG9kcyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1ldGhvZHNDbGFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2xzLmV4dGVuZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWN1cnNpdmVTY2FuV2l0aEluaGVyaXRhbmNlKHRoaXMuZmluZEluRGVwZW5kZW5jaWVzKGNscy5leHRlbmRzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIC8vIEZyb20gY2xhc3MgdG8gY2xhc3NcbiAgICAgICAgICAgICAgICAgICAgcmVjdXJzaXZlU2NhbldpdGhJbmhlcml0YW5jZShleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgbWVyZ2VFeHRlbmRlZENsYXNzZXMgPSBlbCA9PiB7XG4gICAgICAgICAgICBsZXQgZXh0O1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbC5leHRlbmRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGV4dCA9IHRoaXMuZmluZEluRGVwZW5kZW5jaWVzKGVsLmV4dGVuZHMpO1xuICAgICAgICAgICAgICAgIGlmIChleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlY3Vyc2l2ZVNjYW5XaXRoSW5oZXJpdGFuY2UgPSBjbHMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjbHMubWV0aG9kcyAhPT0gJ3VuZGVmaW5lZCcgJiYgY2xzLm1ldGhvZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdNZXRob2RzID0gY2xvbmVEZWVwKGNscy5tZXRob2RzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdNZXRob2RzID0gdGhpcy5tYXJrSW5oZXJpdGFuY2UobmV3TWV0aG9kcywgY2xzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVsLm1ldGhvZHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLm1ldGhvZHMgPSBbLi4uZWwubWV0aG9kcywgLi4ubmV3TWV0aG9kc107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjbHMucHJvcGVydGllcyAhPT0gJ3VuZGVmaW5lZCcgJiYgY2xzLnByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdQcm9wZXJ0aWVzID0gY2xvbmVEZWVwKGNscy5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdQcm9wZXJ0aWVzID0gdGhpcy5tYXJrSW5oZXJpdGFuY2UobmV3UHJvcGVydGllcywgY2xzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVsLnByb3BlcnRpZXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLnByb3BlcnRpZXMgPSBbLi4uZWwucHJvcGVydGllcywgLi4ubmV3UHJvcGVydGllc107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNscy5leHRlbmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjdXJzaXZlU2NhbldpdGhJbmhlcml0YW5jZSh0aGlzLmZpbmRJbkRlcGVuZGVuY2llcyhjbHMuZXh0ZW5kcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAvLyBGcm9tIGVsc3MgdG8gZWxzc1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNpdmVTY2FuV2l0aEluaGVyaXRhbmNlKGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuY2xhc3Nlcy5mb3JFYWNoKG1lcmdlRXh0ZW5kZWRDbGFzc2VzKTtcbiAgICAgICAgdGhpcy5pbmplY3RhYmxlcy5mb3JFYWNoKG1lcmdlRXh0ZW5kZWRDbGFzc2VzKTtcblxuICAgICAgICByZXR1cm4gZGVwcztcbiAgICB9XG5cbiAgICBwcml2YXRlIG1hcmtJbmhlcml0YW5jZShkYXRhLCBvcmlnaW5hbG91cmNlKSB7XG4gICAgICAgIHJldHVybiBkYXRhLm1hcChlbCA9PiB7XG4gICAgICAgICAgICBsZXQgbmV3RWxlbWVudCA9IGVsO1xuICAgICAgICAgICAgbmV3RWxlbWVudC5pbmhlcml0YW5jZSA9IHtcbiAgICAgICAgICAgICAgICBmaWxlOiBvcmlnaW5hbG91cmNlLm5hbWVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gbmV3RWxlbWVudDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kSW5EZXBlbmRlbmNpZXMobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBtZXJnZWREYXRhID0gY29uY2F0KFtdLCB0aGlzLmNvbXBvbmVudHMsIHRoaXMuY2xhc3NlcywgdGhpcy5pbmplY3RhYmxlcyk7XG4gICAgICAgIGxldCByZXN1bHQgPSBmaW5kKG1lcmdlZERhdGEsIHsgbmFtZTogbmFtZSB9IGFzIGFueSk7XG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgZmFsc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFeHRlbmRzTWVyZ2VyLmdldEluc3RhbmNlKCk7XG4iXX0=