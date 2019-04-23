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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5kcy1tZXJnZXIudXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy91dGlscy9leHRlbmRzLW1lcmdlci51dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQWlEO0FBRWpELHNCQUFtRDtBQUNuRCxzREFBaUQ7QUFFakQ7SUFNSTtJQUF1QixDQUFDO0lBQ1YseUJBQVcsR0FBekI7UUFDSSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtZQUN6QixhQUFhLENBQUMsUUFBUSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7U0FDaEQ7UUFDRCxPQUFPLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDbEMsQ0FBQztJQUVNLDZCQUFLLEdBQVosVUFBYSxJQUFJO1FBQWpCLGlCQWlKQztRQWhKRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUVwQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFNBQVM7WUFDN0IsSUFBSSxHQUFHLENBQUM7WUFDUixJQUFJLE9BQU8sU0FBUyxDQUFDLE9BQU8sS0FBSyxXQUFXLEVBQUU7Z0JBQzFDLEdBQUcsR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqRCxJQUFJLEdBQUcsRUFBRTtvQkFDTCxJQUFJLDhCQUE0QixHQUFHLFVBQUEsR0FBRzt3QkFDbEMsMEJBQTBCO3dCQUMx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LEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0UsSUFBSSxNQUFNLEdBQUcsYUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQVMsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sTUFBTSxJQUFJLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0wsb0JBQUM7QUFBRCxDQUFDLEFBaExELElBZ0xDO0FBaExZLHNDQUFhO0FBa0wxQixrQkFBZSxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjbG9uZURlZXAsIGNvbmNhdCwgZmluZCB9IGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7IGNsZWFuTGlmZWN5Y2xlSG9va3NGcm9tTWV0aG9kcyB9IGZyb20gJy4nO1xuaW1wb3J0IENvbmZpZ3VyYXRpb24gZnJvbSAnLi4vYXBwL2NvbmZpZ3VyYXRpb24nO1xuXG5leHBvcnQgY2xhc3MgRXh0ZW5kc01lcmdlciB7XG4gICAgcHJpdmF0ZSBjb21wb25lbnRzO1xuICAgIHByaXZhdGUgY2xhc3NlcztcbiAgICBwcml2YXRlIGluamVjdGFibGVzO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEV4dGVuZHNNZXJnZXI7XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKCFFeHRlbmRzTWVyZ2VyLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBFeHRlbmRzTWVyZ2VyLmluc3RhbmNlID0gbmV3IEV4dGVuZHNNZXJnZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRXh0ZW5kc01lcmdlci5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWVyZ2UoZGVwcykge1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBkZXBzLmNvbXBvbmVudHM7XG4gICAgICAgIHRoaXMuY2xhc3NlcyA9IGRlcHMuY2xhc3NlcztcbiAgICAgICAgdGhpcy5pbmplY3RhYmxlcyA9IGRlcHMuaW5qZWN0YWJsZXM7XG5cbiAgICAgICAgdGhpcy5jb21wb25lbnRzLmZvckVhY2goY29tcG9uZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBleHQ7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5leHRlbmRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGV4dCA9IHRoaXMuZmluZEluRGVwZW5kZW5jaWVzKGNvbXBvbmVudC5leHRlbmRzKTtcbiAgICAgICAgICAgICAgICBpZiAoZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZWN1cnNpdmVTY2FuV2l0aEluaGVyaXRhbmNlID0gY2xzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZyb20gY2xhc3MgdG8gY29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNscy5tZXRob2RzICE9PSAndW5kZWZpbmVkJyAmJiBjbHMubWV0aG9kcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld01ldGhvZHMgPSBjbG9uZURlZXAoY2xzLm1ldGhvZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld01ldGhvZHMgPSB0aGlzLm1hcmtJbmhlcml0YW5jZShuZXdNZXRob2RzLCBjbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm1ldGhvZHNDbGFzcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm1ldGhvZHNDbGFzcyA9IFsuLi5jb21wb25lbnQubWV0aG9kc0NsYXNzLCAuLi5uZXdNZXRob2RzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNscy5wcm9wZXJ0aWVzICE9PSAndW5kZWZpbmVkJyAmJiBjbHMucHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1Byb3BlcnRpZXMgPSBjbG9uZURlZXAoY2xzLnByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Byb3BlcnRpZXMgPSB0aGlzLm1hcmtJbmhlcml0YW5jZShuZXdQcm9wZXJ0aWVzLCBjbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LnByb3BlcnRpZXNDbGFzcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LnByb3BlcnRpZXNDbGFzcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbXBvbmVudC5wcm9wZXJ0aWVzQ2xhc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5uZXdQcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRnJvbSBjb21wb25lbnQgdG8gY29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNscy5pbnB1dHNDbGFzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgY2xzLmlucHV0c0NsYXNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SW5wdXRzID0gY2xvbmVEZWVwKGNscy5pbnB1dHNDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SW5wdXRzID0gdGhpcy5tYXJrSW5oZXJpdGFuY2UobmV3SW5wdXRzLCBjbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LmlucHV0c0NsYXNzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuaW5wdXRzQ2xhc3MgPSBbLi4uY29tcG9uZW50LmlucHV0c0NsYXNzLCAuLi5uZXdJbnB1dHNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgY2xzLm91dHB1dHNDbGFzcyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHMub3V0cHV0c0NsYXNzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdPdXRwdXRzID0gY2xvbmVEZWVwKGNscy5vdXRwdXRzQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld091dHB1dHMgPSB0aGlzLm1hcmtJbmhlcml0YW5jZShuZXdPdXRwdXRzLCBjbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50Lm91dHB1dHNDbGFzcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lm91dHB1dHNDbGFzcyA9IFsuLi5jb21wb25lbnQub3V0cHV0c0NsYXNzLCAuLi5uZXdPdXRwdXRzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGNscy5tZXRob2RzQ2xhc3MgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzLm1ldGhvZHNDbGFzcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3TWV0aG9kcyA9IGNsb25lRGVlcChjbHMubWV0aG9kc0NsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdNZXRob2RzID0gdGhpcy5tYXJrSW5oZXJpdGFuY2UobmV3TWV0aG9kcywgY2xzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5tZXRob2RzQ2xhc3MgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5tZXRob2RzQ2xhc3MgPSBbLi4uY29tcG9uZW50Lm1ldGhvZHNDbGFzcywgLi4ubmV3TWV0aG9kc107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBjbHMucHJvcGVydGllc0NsYXNzICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNscy5wcm9wZXJ0aWVzQ2xhc3MubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1Byb3BlcnRpZXMgPSBjbG9uZURlZXAoY2xzLnByb3BlcnRpZXNDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3UHJvcGVydGllcyA9IHRoaXMubWFya0luaGVyaXRhbmNlKG5ld1Byb3BlcnRpZXMsIGNscyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQucHJvcGVydGllc0NsYXNzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQucHJvcGVydGllc0NsYXNzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uY29tcG9uZW50LnByb3BlcnRpZXNDbGFzcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLm5ld1Byb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGNscy5ob3N0QmluZGluZ3MgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzLmhvc3RCaW5kaW5ncy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SG9zdEJpbmRpbmdzID0gY2xvbmVEZWVwKGNscy5ob3N0QmluZGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hvc3RCaW5kaW5ncyA9IHRoaXMubWFya0luaGVyaXRhbmNlKG5ld0hvc3RCaW5kaW5ncywgY2xzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5ob3N0QmluZGluZ3MgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5ob3N0QmluZGluZ3MgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5jb21wb25lbnQuaG9zdEJpbmRpbmdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ubmV3SG9zdEJpbmRpbmdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBjbHMuaG9zdExpc3RlbmVycyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHMuaG9zdExpc3RlbmVycy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SG9zdExpc3RlbmVycyA9IGNsb25lRGVlcChjbHMuaG9zdExpc3RlbmVycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SG9zdExpc3RlbmVycyA9IHRoaXMubWFya0luaGVyaXRhbmNlKG5ld0hvc3RMaXN0ZW5lcnMsIGNscyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuaG9zdExpc3RlbmVycyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Lmhvc3RMaXN0ZW5lcnMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5jb21wb25lbnQuaG9zdExpc3RlbmVycyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLm5ld0hvc3RMaXN0ZW5lcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlTGlmZUN5Y2xlSG9va3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubWV0aG9kc0NsYXNzID0gY2xlYW5MaWZlY3ljbGVIb29rc0Zyb21NZXRob2RzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQubWV0aG9kc0NsYXNzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbHMuZXh0ZW5kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZVNjYW5XaXRoSW5oZXJpdGFuY2UodGhpcy5maW5kSW5EZXBlbmRlbmNpZXMoY2xzLmV4dGVuZHMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgLy8gRnJvbSBjbGFzcyB0byBjbGFzc1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNpdmVTY2FuV2l0aEluaGVyaXRhbmNlKGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBtZXJnZUV4dGVuZGVkQ2xhc3NlcyA9IGVsID0+IHtcbiAgICAgICAgICAgIGxldCBleHQ7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVsLmV4dGVuZHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgZXh0ID0gdGhpcy5maW5kSW5EZXBlbmRlbmNpZXMoZWwuZXh0ZW5kcyk7XG4gICAgICAgICAgICAgICAgaWYgKGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVjdXJzaXZlU2NhbldpdGhJbmhlcml0YW5jZSA9IGNscyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNscy5tZXRob2RzICE9PSAndW5kZWZpbmVkJyAmJiBjbHMubWV0aG9kcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld01ldGhvZHMgPSBjbG9uZURlZXAoY2xzLm1ldGhvZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld01ldGhvZHMgPSB0aGlzLm1hcmtJbmhlcml0YW5jZShuZXdNZXRob2RzLCBjbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZWwubWV0aG9kcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwubWV0aG9kcyA9IFsuLi5lbC5tZXRob2RzLCAuLi5uZXdNZXRob2RzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNscy5wcm9wZXJ0aWVzICE9PSAndW5kZWZpbmVkJyAmJiBjbHMucHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1Byb3BlcnRpZXMgPSBjbG9uZURlZXAoY2xzLnByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Byb3BlcnRpZXMgPSB0aGlzLm1hcmtJbmhlcml0YW5jZShuZXdQcm9wZXJ0aWVzLCBjbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZWwucHJvcGVydGllcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwucHJvcGVydGllcyA9IFsuLi5lbC5wcm9wZXJ0aWVzLCAuLi5uZXdQcm9wZXJ0aWVzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2xzLmV4dGVuZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWN1cnNpdmVTY2FuV2l0aEluaGVyaXRhbmNlKHRoaXMuZmluZEluRGVwZW5kZW5jaWVzKGNscy5leHRlbmRzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIC8vIEZyb20gZWxzcyB0byBlbHNzXG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZVNjYW5XaXRoSW5oZXJpdGFuY2UoZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5jbGFzc2VzLmZvckVhY2gobWVyZ2VFeHRlbmRlZENsYXNzZXMpO1xuICAgICAgICB0aGlzLmluamVjdGFibGVzLmZvckVhY2gobWVyZ2VFeHRlbmRlZENsYXNzZXMpO1xuXG4gICAgICAgIHJldHVybiBkZXBzO1xuICAgIH1cblxuICAgIHByaXZhdGUgbWFya0luaGVyaXRhbmNlKGRhdGEsIG9yaWdpbmFsb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEubWFwKGVsID0+IHtcbiAgICAgICAgICAgIGxldCBuZXdFbGVtZW50ID0gZWw7XG4gICAgICAgICAgICBuZXdFbGVtZW50LmluaGVyaXRhbmNlID0ge1xuICAgICAgICAgICAgICAgIGZpbGU6IG9yaWdpbmFsb3VyY2UubmFtZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBuZXdFbGVtZW50O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmRJbkRlcGVuZGVuY2llcyhuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IG1lcmdlZERhdGEgPSBjb25jYXQoW10sIHRoaXMuY29tcG9uZW50cywgdGhpcy5jbGFzc2VzLCB0aGlzLmluamVjdGFibGVzKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZpbmQobWVyZ2VkRGF0YSwgeyBuYW1lOiBuYW1lIH0gYXMgYW55KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBmYWxzZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV4dGVuZHNNZXJnZXIuZ2V0SW5zdGFuY2UoKTtcbiJdfQ==