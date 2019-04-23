"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var angular_api_util_1 = require("../../utils/angular-api.util");
var utils_1 = require("../../utils/utils");
var traverse = require('traverse');
var DependenciesEngine = /** @class */ (function () {
    function DependenciesEngine() {
        this.miscellaneous = {
            variables: [],
            functions: [],
            typealiases: [],
            enumerations: [],
            groupedVariables: [],
            groupedFunctions: [],
            groupedEnumerations: [],
            groupedTypeAliases: []
        };
    }
    DependenciesEngine.getInstance = function () {
        if (!DependenciesEngine.instance) {
            DependenciesEngine.instance = new DependenciesEngine();
        }
        return DependenciesEngine.instance;
    };
    DependenciesEngine.prototype.updateModulesDeclarationsExportsTypes = function () {
        var _this = this;
        var mergeTypes = function (entry) {
            var directive = _this.findInCompodocDependencies(entry.name, _this.directives, entry.file);
            if (typeof directive.data !== 'undefined') {
                entry.type = 'directive';
                entry.id = directive.data.id;
            }
            var component = _this.findInCompodocDependencies(entry.name, _this.components, entry.file);
            if (typeof component.data !== 'undefined') {
                entry.type = 'component';
                entry.id = component.data.id;
            }
            var pipe = _this.findInCompodocDependencies(entry.name, _this.pipes, entry.file);
            if (typeof pipe.data !== 'undefined') {
                entry.type = 'pipe';
                entry.id = pipe.data.id;
            }
        };
        this.modules.forEach(function (module) {
            module.declarations.forEach(function (declaration) {
                mergeTypes(declaration);
            });
            module.exports.forEach(function (expt) {
                mergeTypes(expt);
            });
            module.entryComponents.forEach(function (ent) {
                mergeTypes(ent);
            });
        });
    };
    DependenciesEngine.prototype.init = function (data) {
        traverse(data).forEach(function (node) {
            if (node) {
                if (node.parent) {
                    delete node.parent;
                }
                if (node.initializer) {
                    delete node.initializer;
                }
            }
        });
        this.rawData = data;
        this.modules = _.sortBy(this.rawData.modules, [function (el) { return el.name.toLowerCase(); }]);
        this.rawModulesForOverview = _.sortBy(data.modulesForGraph, [function (el) { return el.name.toLowerCase(); }]);
        this.rawModules = _.sortBy(data.modulesForGraph, [function (el) { return el.name.toLowerCase(); }]);
        this.components = _.sortBy(this.rawData.components, [function (el) { return el.name.toLowerCase(); }]);
        this.controllers = _.sortBy(this.rawData.controllers, [function (el) { return el.name.toLowerCase(); }]);
        this.directives = _.sortBy(this.rawData.directives, [function (el) { return el.name.toLowerCase(); }]);
        this.injectables = _.sortBy(this.rawData.injectables, [function (el) { return el.name.toLowerCase(); }]);
        this.interceptors = _.sortBy(this.rawData.interceptors, [function (el) { return el.name.toLowerCase(); }]);
        this.guards = _.sortBy(this.rawData.guards, [function (el) { return el.name.toLowerCase(); }]);
        this.interfaces = _.sortBy(this.rawData.interfaces, [function (el) { return el.name.toLowerCase(); }]);
        this.pipes = _.sortBy(this.rawData.pipes, [function (el) { return el.name.toLowerCase(); }]);
        this.classes = _.sortBy(this.rawData.classes, [function (el) { return el.name.toLowerCase(); }]);
        this.miscellaneous = this.rawData.miscellaneous;
        this.prepareMiscellaneous();
        this.updateModulesDeclarationsExportsTypes();
        this.routes = this.rawData.routesTree;
        this.manageDuplicatesName();
        this.cleanRawModulesNames();
    };
    DependenciesEngine.prototype.cleanRawModulesNames = function () {
        this.rawModulesForOverview = this.rawModulesForOverview.map(function (module) {
            module.name = module.name.replace('$', '');
            return module;
        });
    };
    DependenciesEngine.prototype.findInCompodocDependencies = function (name, data, file) {
        var _result = {
            source: 'internal',
            data: undefined
        };
        var nameFoundCounter = 0;
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (typeof name !== 'undefined') {
                    if (typeof file !== 'undefined') {
                        if (name.indexOf(data[i].name) !== -1 &&
                            file.replace(/\\/g, '/').indexOf(data[i].file) !== -1) {
                            nameFoundCounter += 1;
                            _result.data = data[i];
                        }
                    }
                    else {
                        if (name.indexOf(data[i].name) !== -1) {
                            nameFoundCounter += 1;
                            _result.data = data[i];
                        }
                    }
                }
            }
            // Prevent wrong matching like MultiSelectOptionDirective with SelectOptionDirective, or QueryParamGroupService with QueryParamGroup
            if (nameFoundCounter > 1) {
                var found = false;
                for (var i = 0; i < data.length; i++) {
                    if (typeof name !== 'undefined') {
                        if (typeof file !== 'undefined') {
                            if (name === data[i].name &&
                                file.replace(/\\/g, '/').indexOf(data[i].file) !== -1) {
                                found = true;
                                _result.data = data[i];
                            }
                        }
                        else {
                            if (name === data[i].name) {
                                found = true;
                                _result.data = data[i];
                            }
                        }
                    }
                }
                if (!found) {
                    _result = {
                        source: 'internal',
                        data: undefined
                    };
                }
            }
        }
        return _result;
    };
    DependenciesEngine.prototype.manageDuplicatesName = function () {
        var processDuplicates = function (element, index, array) {
            var elementsWithSameName = _.filter(array, { name: element.name });
            if (elementsWithSameName.length > 1) {
                // First element is the reference for duplicates
                for (var i = 1; i < elementsWithSameName.length; i++) {
                    var elementToEdit = elementsWithSameName[i];
                    if (typeof elementToEdit.isDuplicate === 'undefined') {
                        elementToEdit.isDuplicate = true;
                        elementToEdit.duplicateId = i;
                        elementToEdit.duplicateName =
                            elementToEdit.name + '-' + elementToEdit.duplicateId;
                        elementToEdit.id = elementToEdit.id + '-' + elementToEdit.duplicateId;
                    }
                }
            }
            return element;
        };
        this.classes = this.classes.map(processDuplicates);
        this.interfaces = this.interfaces.map(processDuplicates);
        this.injectables = this.injectables.map(processDuplicates);
        this.pipes = this.pipes.map(processDuplicates);
        this.interceptors = this.interceptors.map(processDuplicates);
        this.guards = this.guards.map(processDuplicates);
        this.modules = this.modules.map(processDuplicates);
        this.components = this.components.map(processDuplicates);
        this.controllers = this.controllers.map(processDuplicates);
        this.directives = this.directives.map(processDuplicates);
    };
    DependenciesEngine.prototype.find = function (name) {
        var _this = this;
        var searchFunctions = [
            function () { return _this.findInCompodocDependencies(name, _this.injectables); },
            function () { return _this.findInCompodocDependencies(name, _this.interceptors); },
            function () { return _this.findInCompodocDependencies(name, _this.guards); },
            function () { return _this.findInCompodocDependencies(name, _this.interfaces); },
            function () { return _this.findInCompodocDependencies(name, _this.classes); },
            function () { return _this.findInCompodocDependencies(name, _this.components); },
            function () { return _this.findInCompodocDependencies(name, _this.controllers); },
            function () { return _this.findInCompodocDependencies(name, _this.miscellaneous.variables); },
            function () { return _this.findInCompodocDependencies(name, _this.miscellaneous.functions); },
            function () { return _this.findInCompodocDependencies(name, _this.miscellaneous.typealiases); },
            function () { return _this.findInCompodocDependencies(name, _this.miscellaneous.enumerations); },
            function () { return angular_api_util_1.default.findApi(name); }
        ];
        for (var _i = 0, searchFunctions_1 = searchFunctions; _i < searchFunctions_1.length; _i++) {
            var searchFunction = searchFunctions_1[_i];
            var result = searchFunction();
            if (result.data) {
                return result;
            }
        }
        return undefined;
    };
    DependenciesEngine.prototype.update = function (updatedData) {
        var _this = this;
        if (updatedData.modules.length > 0) {
            _.forEach(updatedData.modules, function (module) {
                var _index = _.findIndex(_this.modules, { name: module.name });
                _this.modules[_index] = module;
            });
        }
        if (updatedData.components.length > 0) {
            _.forEach(updatedData.components, function (component) {
                var _index = _.findIndex(_this.components, { name: component.name });
                _this.components[_index] = component;
            });
        }
        if (updatedData.controllers.length > 0) {
            _.forEach(updatedData.controllers, function (controller) {
                var _index = _.findIndex(_this.controllers, { name: controller.name });
                _this.controllers[_index] = controller;
            });
        }
        if (updatedData.directives.length > 0) {
            _.forEach(updatedData.directives, function (directive) {
                var _index = _.findIndex(_this.directives, { name: directive.name });
                _this.directives[_index] = directive;
            });
        }
        if (updatedData.injectables.length > 0) {
            _.forEach(updatedData.injectables, function (injectable) {
                var _index = _.findIndex(_this.injectables, { name: injectable.name });
                _this.injectables[_index] = injectable;
            });
        }
        if (updatedData.interceptors.length > 0) {
            _.forEach(updatedData.interceptors, function (interceptor) {
                var _index = _.findIndex(_this.interceptors, { name: interceptor.name });
                _this.interceptors[_index] = interceptor;
            });
        }
        if (updatedData.guards.length > 0) {
            _.forEach(updatedData.guards, function (guard) {
                var _index = _.findIndex(_this.guards, { name: guard.name });
                _this.guards[_index] = guard;
            });
        }
        if (updatedData.interfaces.length > 0) {
            _.forEach(updatedData.interfaces, function (int) {
                var _index = _.findIndex(_this.interfaces, { name: int.name });
                _this.interfaces[_index] = int;
            });
        }
        if (updatedData.pipes.length > 0) {
            _.forEach(updatedData.pipes, function (pipe) {
                var _index = _.findIndex(_this.pipes, { name: pipe.name });
                _this.pipes[_index] = pipe;
            });
        }
        if (updatedData.classes.length > 0) {
            _.forEach(updatedData.classes, function (classe) {
                var _index = _.findIndex(_this.classes, { name: classe.name });
                _this.classes[_index] = classe;
            });
        }
        /**
         * Miscellaneous update
         */
        if (updatedData.miscellaneous.variables.length > 0) {
            _.forEach(updatedData.miscellaneous.variables, function (variable) {
                var _index = _.findIndex(_this.miscellaneous.variables, {
                    name: variable.name,
                    file: variable.file
                });
                _this.miscellaneous.variables[_index] = variable;
            });
        }
        if (updatedData.miscellaneous.functions.length > 0) {
            _.forEach(updatedData.miscellaneous.functions, function (func) {
                var _index = _.findIndex(_this.miscellaneous.functions, {
                    name: func.name,
                    file: func.file
                });
                _this.miscellaneous.functions[_index] = func;
            });
        }
        if (updatedData.miscellaneous.typealiases.length > 0) {
            _.forEach(updatedData.miscellaneous.typealiases, function (typealias) {
                var _index = _.findIndex(_this.miscellaneous.typealiases, {
                    name: typealias.name,
                    file: typealias.file
                });
                _this.miscellaneous.typealiases[_index] = typealias;
            });
        }
        if (updatedData.miscellaneous.enumerations.length > 0) {
            _.forEach(updatedData.miscellaneous.enumerations, function (enumeration) {
                var _index = _.findIndex(_this.miscellaneous.enumerations, {
                    name: enumeration.name,
                    file: enumeration.file
                });
                _this.miscellaneous.enumerations[_index] = enumeration;
            });
        }
        this.prepareMiscellaneous();
    };
    DependenciesEngine.prototype.findInCompodoc = function (name) {
        var mergedData = _.concat([], this.modules, this.components, this.controllers, this.directives, this.injectables, this.interceptors, this.guards, this.interfaces, this.pipes, this.classes, this.miscellaneous.enumerations, this.miscellaneous.typealiases, this.miscellaneous.variables, this.miscellaneous.functions);
        var result = _.find(mergedData, { name: name });
        return result || false;
    };
    DependenciesEngine.prototype.prepareMiscellaneous = function () {
        this.miscellaneous.variables.sort(utils_1.getNamesCompareFn());
        this.miscellaneous.functions.sort(utils_1.getNamesCompareFn());
        this.miscellaneous.enumerations.sort(utils_1.getNamesCompareFn());
        this.miscellaneous.typealiases.sort(utils_1.getNamesCompareFn());
        // group each subgoup by file
        this.miscellaneous.groupedVariables = _.groupBy(this.miscellaneous.variables, 'file');
        this.miscellaneous.groupedFunctions = _.groupBy(this.miscellaneous.functions, 'file');
        this.miscellaneous.groupedEnumerations = _.groupBy(this.miscellaneous.enumerations, 'file');
        this.miscellaneous.groupedTypeAliases = _.groupBy(this.miscellaneous.typealiases, 'file');
    };
    DependenciesEngine.prototype.getModule = function (name) {
        return _.find(this.modules, ['name', name]);
    };
    DependenciesEngine.prototype.getRawModule = function (name) {
        return _.find(this.rawModules, ['name', name]);
    };
    DependenciesEngine.prototype.getModules = function () {
        return this.modules;
    };
    DependenciesEngine.prototype.getComponents = function () {
        return this.components;
    };
    DependenciesEngine.prototype.getControllers = function () {
        return this.controllers;
    };
    DependenciesEngine.prototype.getDirectives = function () {
        return this.directives;
    };
    DependenciesEngine.prototype.getInjectables = function () {
        return this.injectables;
    };
    DependenciesEngine.prototype.getInterceptors = function () {
        return this.interceptors;
    };
    DependenciesEngine.prototype.getGuards = function () {
        return this.guards;
    };
    DependenciesEngine.prototype.getInterfaces = function () {
        return this.interfaces;
    };
    DependenciesEngine.prototype.getRoutes = function () {
        return this.routes;
    };
    DependenciesEngine.prototype.getPipes = function () {
        return this.pipes;
    };
    DependenciesEngine.prototype.getClasses = function () {
        return this.classes;
    };
    DependenciesEngine.prototype.getMiscellaneous = function () {
        return this.miscellaneous;
    };
    return DependenciesEngine;
}());
exports.DependenciesEngine = DependenciesEngine;
exports.default = DependenciesEngine.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jaWVzLmVuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9kZXBlbmRlbmNpZXMuZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMEJBQTRCO0FBTTVCLGlFQUEwRDtBQUUxRCwyQ0FBc0Q7QUFrQnRELElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUVyQztJQTJCSTtRQVpPLGtCQUFhLEdBQXNCO1lBQ3RDLFNBQVMsRUFBRSxFQUFFO1lBQ2IsU0FBUyxFQUFFLEVBQUU7WUFDYixXQUFXLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxFQUFFO1lBQ2hCLGdCQUFnQixFQUFFLEVBQUU7WUFDcEIsZ0JBQWdCLEVBQUUsRUFBRTtZQUNwQixtQkFBbUIsRUFBRSxFQUFFO1lBQ3ZCLGtCQUFrQixFQUFFLEVBQUU7U0FDekIsQ0FBQztJQUdxQixDQUFDO0lBQ1YsOEJBQVcsR0FBekI7UUFDSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFO1lBQzlCLGtCQUFrQixDQUFDLFFBQVEsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7U0FDMUQ7UUFDRCxPQUFPLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztJQUN2QyxDQUFDO0lBRU8sa0VBQXFDLEdBQTdDO1FBQUEsaUJBd0NDO1FBdkNHLElBQUksVUFBVSxHQUFHLFVBQUEsS0FBSztZQUNsQixJQUFJLFNBQVMsR0FBRyxLQUFJLENBQUMsMEJBQTBCLENBQzNDLEtBQUssQ0FBQyxJQUFJLEVBQ1YsS0FBSSxDQUFDLFVBQVUsRUFDZixLQUFLLENBQUMsSUFBSSxD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SUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRU0sMENBQWEsR0FBcEI7UUFDSSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVNLHNDQUFTLEdBQWhCO1FBQ0ksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxxQ0FBUSxHQUFmO1FBQ0ksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFTSx1Q0FBVSxHQUFqQjtRQUNJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBRU0sNkNBQWdCLEdBQXZCO1FBQ0ksT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLENBQUM7SUFDTCx5QkFBQztBQUFELENBQUMsQUF2YUQsSUF1YUM7QUF2YVksZ0RBQWtCO0FBeWEvQixrQkFBZSxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgTWlzY2VsbGFuZW91c0RhdGEgfSBmcm9tICcuLi9pbnRlcmZhY2VzL21pc2NlbGxhbmVvdXMtZGF0YS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgUGFyc2VkRGF0YSB9IGZyb20gJy4uL2ludGVyZmFjZXMvcGFyc2VkLWRhdGEuaW50ZXJmYWNlJztcbmltcG9ydCB7IFJvdXRlSW50ZXJmYWNlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9yb3V0ZXMuaW50ZXJmYWNlJztcblxuaW1wb3J0IEFuZ3VsYXJBcGlVdGlsIGZyb20gJy4uLy4uL3V0aWxzL2FuZ3VsYXItYXBpLnV0aWwnO1xuaW1wb3J0IHsgSUFwaVNvdXJjZVJlc3VsdCB9IGZyb20gJy4uLy4uL3V0aWxzL2FwaS1zb3VyY2UtcmVzdWx0LmludGVyZmFjZSc7XG5pbXBvcnQgeyBnZXROYW1lc0NvbXBhcmVGbiB9IGZyb20gJy4uLy4uL3V0aWxzL3V0aWxzJztcblxuaW1wb3J0IHtcbiAgICBJRW51bURlY0RlcCxcbiAgICBJRnVuY3Rpb25EZWNEZXAsXG4gICAgSUd1YXJkRGVwLFxuICAgIElJbmplY3RhYmxlRGVwLFxuICAgIElJbnRlcmNlcHRvckRlcCxcbiAgICBJSW50ZXJmYWNlRGVwLFxuICAgIElQaXBlRGVwLFxuICAgIElUeXBlQWxpYXNEZWNEZXBcbn0gZnJvbSAnLi4vY29tcGlsZXIvYW5ndWxhci9kZXBlbmRlbmNpZXMuaW50ZXJmYWNlcyc7XG5cbmltcG9ydCB7IElDb21wb25lbnREZXAgfSBmcm9tICcuLi9jb21waWxlci9hbmd1bGFyL2RlcHMvY29tcG9uZW50LWRlcC5mYWN0b3J5JztcbmltcG9ydCB7IElDb250cm9sbGVyRGVwIH0gZnJvbSAnLi4vY29tcGlsZXIvYW5ndWxhci9kZXBzL2NvbnRyb2xsZXItZGVwLmZhY3RvcnknO1xuaW1wb3J0IHsgSURpcmVjdGl2ZURlcCB9IGZyb20gJy4uL2NvbXBpbGVyL2FuZ3VsYXIvZGVwcy9kaXJlY3RpdmUtZGVwLmZhY3RvcnknO1xuaW1wb3J0IHsgSU1vZHVsZURlcCB9IGZyb20gJy4uL2NvbXBpbGVyL2FuZ3VsYXIvZGVwcy9tb2R1bGUtZGVwLmZhY3RvcnknO1xuXG5jb25zdCB0cmF2ZXJzZSA9IHJlcXVpcmUoJ3RyYXZlcnNlJyk7XG5cbmV4cG9ydCBjbGFzcyBEZXBlbmRlbmNpZXNFbmdpbmUge1xuICAgIHB1YmxpYyByYXdEYXRhOiBQYXJzZWREYXRhO1xuICAgIHB1YmxpYyBtb2R1bGVzOiBPYmplY3RbXTtcbiAgICBwdWJsaWMgcmF3TW9kdWxlczogT2JqZWN0W107XG4gICAgcHVibGljIHJhd01vZHVsZXNGb3JPdmVydmlldzogT2JqZWN0W107XG4gICAgcHVibGljIGNvbXBvbmVudHM6IE9iamVjdFtdO1xuICAgIHB1YmxpYyBjb250cm9sbGVyczogT2JqZWN0W107XG4gICAgcHVibGljIGRpcmVjdGl2ZXM6IE9iamVjdFtdO1xuICAgIHB1YmxpYyBpbmplY3RhYmxlczogT2JqZWN0W107XG4gICAgcHVibGljIGludGVyY2VwdG9yczogT2JqZWN0W107XG4gICAgcHVibGljIGd1YXJkczogT2JqZWN0W107XG4gICAgcHVibGljIGludGVyZmFjZXM6IE9iamVjdFtdO1xuICAgIHB1YmxpYyByb3V0ZXM6IFJvdXRlSW50ZXJmYWNlO1xuICAgIHB1YmxpYyBwaXBlczogT2JqZWN0W107XG4gICAgcHVibGljIGNsYXNzZXM6IE9iamVjdFtdO1xuICAgIHB1YmxpYyBtaXNjZWxsYW5lb3VzOiBNaXNjZWxsYW5lb3VzRGF0YSA9IHtcbiAgICAgICAgdmFyaWFibGVzOiBbXSxcbiAgICAgICAgZnVuY3Rpb25zOiBbXSxcbiAgICAgICAgdHlwZWFsaWFzZXM6IFtdLFxuICAgICAgICBlbnVtZXJhdGlvbnM6IFtdLFxuICAgICAgICBncm91cGVkVmFyaWFibGVzOiBbXSxcbiAgICAgICAgZ3JvdXBlZEZ1bmN0aW9uczogW10sXG4gICAgICAgIGdyb3VwZWRFbnVtZXJhdGlvbnM6IFtdLFxuICAgICAgICBncm91cGVkVHlwZUFsaWFzZXM6IFtdXG4gICAgfTtcblxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBEZXBlbmRlbmNpZXNFbmdpbmU7XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKCFEZXBlbmRlbmNpZXNFbmdpbmUuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIERlcGVuZGVuY2llc0VuZ2luZS5pbnN0YW5jZSA9IG5ldyBEZXBlbmRlbmNpZXNFbmdpbmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRGVwZW5kZW5jaWVzRW5naW5lLmluc3RhbmNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlTW9kdWxlc0RlY2xhcmF0aW9uc0V4cG9ydHNUeXBlcygpIHtcbiAgICAgICAgbGV0IG1lcmdlVHlwZXMgPSBlbnRyeSA9PiB7XG4gICAgICAgICAgICBsZXQgZGlyZWN0aXZlID0gdGhpcy5maW5kSW5Db21wb2RvY0RlcGVuZGVuY2llcyhcbiAgICAgICAgICAgICAgICBlbnRyeS5uYW1lLFxuICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aXZlcyxcbiAgICAgICAgICAgICAgICBlbnRyeS5maWxlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkaXJlY3RpdmUuZGF0YSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBlbnRyeS50eXBlID0gJ2RpcmVjdGl2ZSc7XG4gICAgICAgICAgICAgICAgZW50cnkuaWQgPSBkaXJlY3RpdmUuZGF0YS5pZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXMuZmluZEluQ29tcG9kb2NEZXBlbmRlbmNpZXMoXG4gICAgICAgICAgICAgICAgZW50cnkubmFtZSxcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMsXG4gICAgICAgICAgICAgICAgZW50cnkuZmlsZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LmRhdGEgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgZW50cnkudHlwZSA9ICdjb21wb25lbnQnO1xuICAgICAgICAgICAgICAgIGVudHJ5LmlkID0gY29tcG9uZW50LmRhdGEuaWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBwaXBlID0gdGhpcy5maW5kSW5Db21wb2RvY0RlcGVuZGVuY2llcyhlbnRyeS5uYW1lLCB0aGlzLnBpcGVzLCBlbnRyeS5maWxlKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGlwZS5kYXRhICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGVudHJ5LnR5cGUgPSAncGlwZSc7XG4gICAgICAgICAgICAgICAgZW50cnkuaWQgPSBwaXBlLmRhdGEuaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5tb2R1bGVzLmZvckVhY2gobW9kdWxlID0+IHtcbiAgICAgICAgICAgIG1vZHVsZS5kZWNsYXJhdGlvbnMuZm9yRWFjaChkZWNsYXJhdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgbWVyZ2VUeXBlcyhkZWNsYXJhdGlvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzLmZvckVhY2goZXhwdCA9PiB7XG4gICAgICAgICAgICAgICAgbWVyZ2VUeXBlcyhleHB0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbW9kdWxlLmVudHJ5Q29tcG9uZW50cy5mb3JFYWNoKGVudCA9PiB7XG4gICAgICAgICAgICAgICAgbWVyZ2VUeXBlcyhlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KGRhdGE6IFBhcnNlZERhdGEpIHtcbiAgICAgICAgdHJhdmVyc2UoZGF0YSkuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbm9kZS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub2RlLmluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlLmluaXRpYWxpemVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmF3RGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMubW9kdWxlcyA9IF8uc29ydEJ5KHRoaXMucmF3RGF0YS5tb2R1bGVzLCBbZWwgPT4gZWwubmFtZS50b0xvd2VyQ2FzZSgpXSk7XG4gICAgICAgIHRoaXMucmF3TW9kdWxlc0Zvck92ZXJ2aWV3ID0gXy5zb3J0QnkoZGF0YS5tb2R1bGVzRm9yR3JhcGgsIFtlbCA9PiBlbC5uYW1lLnRvTG93ZXJDYXNlKCldKTtcbiAgICAgICAgdGhpcy5yYXdNb2R1bGVzID0gXy5zb3J0QnkoZGF0YS5tb2R1bGVzRm9yR3JhcGgsIFtlbCA9PiBlbC5uYW1lLnRvTG93ZXJDYXNlKCldKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gXy5zb3J0QnkodGhpcy5yYXdEYXRhLmNvbXBvbmVudHMsIFtlbCA9PiBlbC5uYW1lLnRvTG93ZXJDYXNlKCldKTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyA9IF8uc29ydEJ5KHRoaXMucmF3RGF0YS5jb250cm9sbGVycywgW2VsID0+IGVsLm5hbWUudG9Mb3dlckNhc2UoKV0pO1xuICAgICAgICB0aGlzLmRpcmVjdGl2ZXMgPSBfLnNvcnRCeSh0aGlzLnJhd0RhdGEuZGlyZWN0aXZlcywgW2VsID0+IGVsLm5hbWUudG9Mb3dlckNhc2UoKV0pO1xuICAgICAgICB0aGlzLmluamVjdGFibGVzID0gXy5zb3J0QnkodGhpcy5yYXdEYXRhLmluamVjdGFibGVzLCBbZWwgPT4gZWwubmFtZS50b0xvd2VyQ2FzZSgpXSk7XG4gICAgICAgIHRoaXMuaW50ZXJjZXB0b3JzID0gXy5zb3J0QnkodGhpcy5yYXdEYXRhLmludGVyY2VwdG9ycywgW2VsID0+IGVsLm5hbWUudG9Mb3dlckNhc2UoKV0pO1xuICAgICAgICB0aGlzLmd1YXJkcyA9IF8uc29ydEJ5KHRoaXMucmF3RGF0YS5ndWFyZHMsIFtlbCA9PiBlbC5uYW1lLnRvTG93ZXJDYXNlKCldKTtcbiAgICAgICAgdGhpcy5pbnRlcmZhY2VzID0gXy5zb3J0QnkodGhpcy5yYXdEYXRhLmludGVyZmFjZXMsIFtlbCA9PiBlbC5uYW1lLnRvTG93ZXJDYXNlKCldKTtcbiAgICAgICAgdGhpcy5waXBlcyA9IF8uc29ydEJ5KHRoaXMucmF3RGF0YS5waXBlcywgW2VsID0+IGVsLm5hbWUudG9Mb3dlckNhc2UoKV0pO1xuICAgICAgICB0aGlzLmNsYXNzZXMgPSBfLnNvcnRCeSh0aGlzLnJhd0RhdGEuY2xhc3NlcywgW2VsID0+IGVsLm5hbWUudG9Mb3dlckNhc2UoKV0pO1xuICAgICAgICB0aGlzLm1pc2NlbGxhbmVvdXMgPSB0aGlzLnJhd0RhdGEubWlzY2VsbGFuZW91cztcbiAgICAgICAgdGhpcy5wcmVwYXJlTWlzY2VsbGFuZW91cygpO1xuICAgICAgICB0aGlzLnVwZGF0ZU1vZHVsZXNEZWNsYXJhdGlvbnNFeHBvcnRzVHlwZXMoKTtcbiAgICAgICAgdGhpcy5yb3V0ZXMgPSB0aGlzLnJhd0RhdGEucm91dGVzVHJlZTtcbiAgICAgICAgdGhpcy5tYW5hZ2VEdXBsaWNhdGVzTmFtZSgpO1xuICAgICAgICB0aGlzLmNsZWFuUmF3TW9kdWxlc05hbWVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGVhblJhd01vZHVsZXNOYW1lcygpIHtcbiAgICAgICAgdGhpcy5yYXdNb2R1bGVzRm9yT3ZlcnZpZXcgPSB0aGlzLnJhd01vZHVsZXNGb3JPdmVydmlldy5tYXAobW9kdWxlID0+IHtcbiAgICAgICAgICAgIG1vZHVsZS5uYW1lID0gbW9kdWxlLm5hbWUucmVwbGFjZSgnJCcsICcnKTtcbiAgICAgICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmluZEluQ29tcG9kb2NEZXBlbmRlbmNpZXMobmFtZSwgZGF0YSwgZmlsZT8pOiBJQXBpU291cmNlUmVzdWx0PGFueT4ge1xuICAgICAgICBsZXQgX3Jlc3VsdCA9IHtcbiAgICAgICAgICAgIHNvdXJjZTogJ2ludGVybmFsJyxcbiAgICAgICAgICAgIGRhdGE6IHVuZGVmaW5lZFxuICAgICAgICB9O1xuICAgICAgICBsZXQgbmFtZUZvdW5kQ291bnRlciA9IDA7XG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZpbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZS5pbmRleE9mKGRhdGFbaV0ubmFtZSkgIT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZS5yZXBsYWNlKC9cXFxcL2csICcvJykuaW5kZXhPZihkYXRhW2ldLmZpbGUpICE9PSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZUZvdW5kQ291bnRlciArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXN1bHQuZGF0YSA9IGRhdGFbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5pbmRleE9mKGRhdGFbaV0ubmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZUZvdW5kQ291bnRlciArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXN1bHQuZGF0YSA9IGRhdGFbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFByZXZlbnQgd3JvbmcgbWF0Y2hpbmcgbGlrZSBNdWx0aVNlbGVjdE9wdGlvbkRpcmVjdGl2ZSB3aXRoIFNlbGVjdE9wdGlvbkRpcmVjdGl2ZSwgb3IgUXVlcnlQYXJhbUdyb3VwU2VydmljZSB3aXRoIFF1ZXJ5UGFyYW1Hcm91cFxuICAgICAgICAgICAgaWYgKG5hbWVGb3VuZENvdW50ZXIgPiAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZmlsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgPT09IGRhdGFbaV0ubmFtZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlLnJlcGxhY2UoL1xcXFwvZywgJy8nKS5pbmRleE9mKGRhdGFbaV0uZmlsZSkgIT09IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Jlc3VsdC5kYXRhID0gZGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSBkYXRhW2ldLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVzdWx0LmRhdGEgPSBkYXRhW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIF9yZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICdpbnRlcm5hbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtYW5hZ2VEdXBsaWNhdGVzTmFtZSgpIHtcbiAgICAgICAgbGV0IHByb2Nlc3NEdXBsaWNhdGVzID0gKGVsZW1lbnQsIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRzV2l0aFNhbWVOYW1lID0gXy5maWx0ZXIoYXJyYXksIHsgbmFtZTogZWxlbWVudC5uYW1lIH0pO1xuICAgICAgICAgICAgaWYgKGVsZW1lbnRzV2l0aFNhbWVOYW1lLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCBlbGVtZW50IGlzIHRoZSByZWZlcmVuY2UgZm9yIGR1cGxpY2F0ZXNcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGVsZW1lbnRzV2l0aFNhbWVOYW1lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50VG9FZGl0ID0gZWxlbWVudHNXaXRoU2FtZU5hbWVbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudFRvRWRpdC5pc0R1cGxpY2F0ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRUb0VkaXQuaXNEdXBsaWNhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFRvRWRpdC5kdXBsaWNhdGVJZCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VG9FZGl0LmR1cGxpY2F0ZU5hbWUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRUb0VkaXQubmFtZSArICctJyArIGVsZW1lbnRUb0VkaXQuZHVwbGljYXRlSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VG9FZGl0LmlkID0gZWxlbWVudFRvRWRpdC5pZCArICctJyArIGVsZW1lbnRUb0VkaXQuZHVwbGljYXRlSWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jbGFzc2VzID0gdGhpcy5jbGFzc2VzLm1hcChwcm9jZXNzRHVwbGljYXRlcyk7XG4gICAgICAgIHRoaXMuaW50ZXJmYWNlcyA9IHRoaXMuaW50ZXJmYWNlcy5tYXAocHJvY2Vzc0R1cGxpY2F0ZXMpO1xuICAgICAgICB0aGlzLmluamVjdGFibGVzID0gdGhpcy5pbmplY3RhYmxlcy5tYXAocHJvY2Vzc0R1cGxpY2F0ZXMpO1xuICAgICAgICB0aGlzLnBpcGVzID0gdGhpcy5waXBlcy5tYXAocHJvY2Vzc0R1cGxpY2F0ZXMpO1xuICAgICAgICB0aGlzLmludGVyY2VwdG9ycyA9IHRoaXMuaW50ZXJjZXB0b3JzLm1hcChwcm9jZXNzRHVwbGljYXRlcyk7XG4gICAgICAgIHRoaXMuZ3VhcmRzID0gdGhpcy5ndWFyZHMubWFwKHByb2Nlc3NEdXBsaWNhdGVzKTtcbiAgICAgICAgdGhpcy5tb2R1bGVzID0gdGhpcy5tb2R1bGVzLm1hcChwcm9jZXNzRHVwbGljYXRlcyk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHRoaXMuY29tcG9uZW50cy5tYXAocHJvY2Vzc0R1cGxpY2F0ZXMpO1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXJzID0gdGhpcy5jb250cm9sbGVycy5tYXAocHJvY2Vzc0R1cGxpY2F0ZXMpO1xuICAgICAgICB0aGlzLmRpcmVjdGl2ZXMgPSB0aGlzLmRpcmVjdGl2ZXMubWFwKHByb2Nlc3NEdXBsaWNhdGVzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZmluZChuYW1lOiBzdHJpbmcpOiBJQXBpU291cmNlUmVzdWx0PGFueT4gfCB1bmRlZmluZWQge1xuICAgICAgICBsZXQgc2VhcmNoRnVuY3Rpb25zOiBBcnJheTwoKSA9PiBJQXBpU291cmNlUmVzdWx0PGFueT4+ID0gW1xuICAgICAgICAgICAgKCkgPT4gdGhpcy5maW5kSW5Db21wb2RvY0RlcGVuZGVuY2llcyhuYW1lLCB0aGlzLmluamVjdGFibGVzKSxcbiAgICAgICAgICAgICgpID0+IHRoaXMuZmluZEluQ29tcG9kb2NEZXBlbmRlbmNpZXMobmFtZSwgdGhpcy5pbnRlcmNlcHRvcnMpLFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5maW5kSW5Db21wb2RvY0RlcGVuZGVuY2llcyhuYW1lLCB0aGlzLmd1YXJkcyksXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmZpbmRJbkNvbXBvZG9jRGVwZW5kZW5jaWVzKG5hbWUsIHRoaXMuaW50ZXJmYWNlcyksXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmZpbmRJbkNvbXBvZG9jRGVwZW5kZW5jaWVzKG5hbWUsIHRoaXMuY2xhc3NlcyksXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmZpbmRJbkNvbXBvZG9jRGVwZW5kZW5jaWVzKG5hbWUsIHRoaXMuY29tcG9uZW50cyksXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmZpbmRJbkNvbXBvZG9jRGVwZW5kZW5jaWVzKG5hbWUsIHRoaXMuY29udHJvbGxlcnMpLFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5maW5kSW5Db21wb2RvY0RlcGVuZGVuY2llcyhuYW1lLCB0aGlzLm1pc2NlbGxhbmVvdXMudmFyaWFibGVzKSxcbiAgICAgICAgICAgICgpID0+IHRoaXMuZmluZEluQ29tcG9kb2NEZXBlbmRlbmNpZXMobmFtZSwgdGhpcy5taXNjZWxsYW5lb3VzLmZ1bmN0aW9ucyksXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmZpbmRJbkNvbXBvZG9jRGVwZW5kZW5jaWVzKG5hbWUsIHRoaXMubWlzY2VsbGFuZW91cy50eXBlYWxpYXNlcyksXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmZpbmRJbkNvbXBvZG9jRGVwZW5kZW5jaWVzKG5hbWUsIHRoaXMubWlzY2VsbGFuZW91cy5lbnVtZXJhdGlvbnMpLFxuICAgICAgICAgICAgKCkgPT4gQW5ndWxhckFwaVV0aWwuZmluZEFwaShuYW1lKVxuICAgICAgICBdO1xuXG4gICAgICAgIGZvciAobGV0IHNlYXJjaEZ1bmN0aW9uIG9mIHNlYXJjaEZ1bmN0aW9ucykge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHNlYXJjaEZ1bmN0aW9uKCk7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQuZGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGUodXBkYXRlZERhdGEpOiB2b2lkIHtcbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhLm1vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgXy5mb3JFYWNoKHVwZGF0ZWREYXRhLm1vZHVsZXMsIChtb2R1bGU6IElNb2R1bGVEZXApID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgX2luZGV4ID0gXy5maW5kSW5kZXgodGhpcy5tb2R1bGVzLCB7IG5hbWU6IG1vZHVsZS5uYW1lIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kdWxlc1tfaW5kZXhdID0gbW9kdWxlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhLmNvbXBvbmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgXy5mb3JFYWNoKHVwZGF0ZWREYXRhLmNvbXBvbmVudHMsIChjb21wb25lbnQ6IElDb21wb25lbnREZXApID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgX2luZGV4ID0gXy5maW5kSW5kZXgodGhpcy5jb21wb25lbnRzLCB7IG5hbWU6IGNvbXBvbmVudC5uYW1lIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tfaW5kZXhdID0gY29tcG9uZW50O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhLmNvbnRyb2xsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaCh1cGRhdGVkRGF0YS5jb250cm9sbGVycywgKGNvbnRyb2xsZXI6IElDb250cm9sbGVyRGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IF9pbmRleCA9IF8uZmluZEluZGV4KHRoaXMuY29udHJvbGxlcnMsIHsgbmFtZTogY29udHJvbGxlci5uYW1lIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlcnNbX2luZGV4XSA9IGNvbnRyb2xsZXI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlZERhdGEuZGlyZWN0aXZlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBfLmZvckVhY2godXBkYXRlZERhdGEuZGlyZWN0aXZlcywgKGRpcmVjdGl2ZTogSURpcmVjdGl2ZURlcCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBfaW5kZXggPSBfLmZpbmRJbmRleCh0aGlzLmRpcmVjdGl2ZXMsIHsgbmFtZTogZGlyZWN0aXZlLm5hbWUgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXJlY3RpdmVzW19pbmRleF0gPSBkaXJlY3RpdmU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlZERhdGEuaW5qZWN0YWJsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgXy5mb3JFYWNoKHVwZGF0ZWREYXRhLmluamVjdGFibGVzLCAoaW5qZWN0YWJsZTogSUluamVjdGFibGVEZXApID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgX2luZGV4ID0gXy5maW5kSW5kZXgodGhpcy5pbmplY3RhYmxlcywgeyBuYW1lOiBpbmplY3RhYmxlLm5hbWUgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmplY3RhYmxlc1tfaW5kZXhdID0gaW5qZWN0YWJsZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVkRGF0YS5pbnRlcmNlcHRvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgXy5mb3JFYWNoKHVwZGF0ZWREYXRhLmludGVyY2VwdG9ycywgKGludGVyY2VwdG9yOiBJSW50ZXJjZXB0b3JEZXApID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgX2luZGV4ID0gXy5maW5kSW5kZXgodGhpcy5pbnRlcmNlcHRvcnMsIHsgbmFtZTogaW50ZXJjZXB0b3IubmFtZSB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmludGVyY2VwdG9yc1tfaW5kZXhdID0gaW50ZXJjZXB0b3I7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlZERhdGEuZ3VhcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaCh1cGRhdGVkRGF0YS5ndWFyZHMsIChndWFyZDogSUd1YXJkRGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IF9pbmRleCA9IF8uZmluZEluZGV4KHRoaXMuZ3VhcmRzLCB7IG5hbWU6IGd1YXJkLm5hbWUgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5ndWFyZHNbX2luZGV4XSA9IGd1YXJkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhLmludGVyZmFjZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgXy5mb3JFYWNoKHVwZGF0ZWREYXRhLmludGVyZmFjZXMsIChpbnQ6IElJbnRlcmZhY2VEZXApID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgX2luZGV4ID0gXy5maW5kSW5kZXgodGhpcy5pbnRlcmZhY2VzLCB7IG5hbWU6IGludC5uYW1lIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJmYWNlc1tfaW5kZXhdID0gaW50O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhLnBpcGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaCh1cGRhdGVkRGF0YS5waXBlcywgKHBpcGU6IElQaXBlRGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IF9pbmRleCA9IF8uZmluZEluZGV4KHRoaXMucGlwZXMsIHsgbmFtZTogcGlwZS5uYW1lIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMucGlwZXNbX2luZGV4XSA9IHBpcGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlZERhdGEuY2xhc3Nlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBfLmZvckVhY2godXBkYXRlZERhdGEuY2xhc3NlcywgKGNsYXNzZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IF9pbmRleCA9IF8uZmluZEluZGV4KHRoaXMuY2xhc3NlcywgeyBuYW1lOiBjbGFzc2UubmFtZSB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzZXNbX2luZGV4XSA9IGNsYXNzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNaXNjZWxsYW5lb3VzIHVwZGF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhLm1pc2NlbGxhbmVvdXMudmFyaWFibGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaCh1cGRhdGVkRGF0YS5taXNjZWxsYW5lb3VzLnZhcmlhYmxlcywgKHZhcmlhYmxlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgX2luZGV4ID0gXy5maW5kSW5kZXgodGhpcy5taXNjZWxsYW5lb3VzLnZhcmlhYmxlcywge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiB2YXJpYWJsZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBmaWxlOiB2YXJpYWJsZS5maWxlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5taXNjZWxsYW5lb3VzLnZhcmlhYmxlc1tfaW5kZXhdID0gdmFyaWFibGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlZERhdGEubWlzY2VsbGFuZW91cy5mdW5jdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgXy5mb3JFYWNoKHVwZGF0ZWREYXRhLm1pc2NlbGxhbmVvdXMuZnVuY3Rpb25zLCAoZnVuYzogSUZ1bmN0aW9uRGVjRGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IF9pbmRleCA9IF8uZmluZEluZGV4KHRoaXMubWlzY2VsbGFuZW91cy5mdW5jdGlvbnMsIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogZnVuYy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBmaWxlOiBmdW5jLmZpbGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLm1pc2NlbGxhbmVvdXMuZnVuY3Rpb25zW19pbmRleF0gPSBmdW5jO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhLm1pc2NlbGxhbmVvdXMudHlwZWFsaWFzZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgXy5mb3JFYWNoKHVwZGF0ZWREYXRhLm1pc2NlbGxhbmVvdXMudHlwZWFsaWFzZXMsICh0eXBlYWxpYXM6IElUeXBlQWxpYXNEZWNEZXApID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgX2luZGV4ID0gXy5maW5kSW5kZXgodGhpcy5taXNjZWxsYW5lb3VzLnR5cGVhbGlhc2VzLCB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHR5cGVhbGlhcy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBmaWxlOiB0eXBlYWxpYXMuZmlsZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMubWlzY2VsbGFuZW91cy50eXBlYWxpYXNlc1tfaW5kZXhdID0gdHlwZWFsaWFzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhLm1pc2NlbGxhbmVvdXMuZW51bWVyYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaCh1cGRhdGVkRGF0YS5taXNjZWxsYW5lb3VzLmVudW1lcmF0aW9ucywgKGVudW1lcmF0aW9uOiBJRW51bURlY0RlcCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBfaW5kZXggPSBfLmZpbmRJbmRleCh0aGlzLm1pc2NlbGxhbmVvdXMuZW51bWVyYXRpb25zLCB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGVudW1lcmF0aW9uLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGZpbGU6IGVudW1lcmF0aW9uLmZpbGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLm1pc2NlbGxhbmVvdXMuZW51bWVyYXRpb25zW19pbmRleF0gPSBlbnVtZXJhdGlvbjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJlcGFyZU1pc2NlbGxhbmVvdXMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZmluZEluQ29tcG9kb2MobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBtZXJnZWREYXRhID0gXy5jb25jYXQoXG4gICAgICAgICAgICBbXSxcbiAgICAgICAgICAgIHRoaXMubW9kdWxlcyxcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyxcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlcnMsXG4gICAgICAgICAgICB0aGlzLmRpcmVjdGl2ZXMsXG4gICAgICAgICAgICB0aGlzLmluamVjdGFibGVzLFxuICAgICAgICAgICAgdGhpcy5pbnRlcmNlcHRvcnMsXG4gICAgICAgICAgICB0aGlzLmd1YXJkcyxcbiAgICAgICAgICAgIHRoaXMuaW50ZXJmYWNlcyxcbiAgICAgICAgICAgIHRoaXMucGlwZXMsXG4gICAgICAgICAgICB0aGlzLmNsYXNzZXMsXG4gICAgICAgICAgICB0aGlzLm1pc2NlbGxhbmVvdXMuZW51bWVyYXRpb25zLFxuICAgICAgICAgICAgdGhpcy5taXNjZWxsYW5lb3VzLnR5cGVhbGlhc2VzLFxuICAgICAgICAgICAgdGhpcy5taXNjZWxsYW5lb3VzLnZhcmlhYmxlcyxcbiAgICAgICAgICAgIHRoaXMubWlzY2VsbGFuZW91cy5mdW5jdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IF8uZmluZChtZXJnZWREYXRhLCB7IG5hbWU6IG5hbWUgfSBhcyBhbnkpO1xuICAgICAgICByZXR1cm4gcmVzdWx0IHx8IGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgcHJlcGFyZU1pc2NlbGxhbmVvdXMoKSB7XG4gICAgICAgIHRoaXMubWlzY2VsbGFuZW91cy52YXJpYWJsZXMuc29ydChnZXROYW1lc0NvbXBhcmVGbigpKTtcbiAgICAgICAgdGhpcy5taXNjZWxsYW5lb3VzLmZ1bmN0aW9ucy5zb3J0KGdldE5hbWVzQ29tcGFyZUZuKCkpO1xuICAgICAgICB0aGlzLm1pc2NlbGxhbmVvdXMuZW51bWVyYXRpb25zLnNvcnQoZ2V0TmFtZXNDb21wYXJlRm4oKSk7XG4gICAgICAgIHRoaXMubWlzY2VsbGFuZW91cy50eXBlYWxpYXNlcy5zb3J0KGdldE5hbWVzQ29tcGFyZUZuKCkpO1xuICAgICAgICAvLyBncm91cCBlYWNoIHN1YmdvdXAgYnkgZmlsZVxuICAgICAgICB0aGlzLm1pc2NlbGxhbmVvdXMuZ3JvdXBlZFZhcmlhYmxlcyA9IF8uZ3JvdXBCeSh0aGlzLm1pc2NlbGxhbmVvdXMudmFyaWFibGVzLCAnZmlsZScpO1xuICAgICAgICB0aGlzLm1pc2NlbGxhbmVvdXMuZ3JvdXBlZEZ1bmN0aW9ucyA9IF8uZ3JvdXBCeSh0aGlzLm1pc2NlbGxhbmVvdXMuZnVuY3Rpb25zLCAnZmlsZScpO1xuICAgICAgICB0aGlzLm1pc2NlbGxhbmVvdXMuZ3JvdXBlZEVudW1lcmF0aW9ucyA9IF8uZ3JvdXBCeSh0aGlzLm1pc2NlbGxhbmVvdXMuZW51bWVyYXRpb25zLCAnZmlsZScpO1xuICAgICAgICB0aGlzLm1pc2NlbGxhbmVvdXMuZ3JvdXBlZFR5cGVBbGlhc2VzID0gXy5ncm91cEJ5KHRoaXMubWlzY2VsbGFuZW91cy50eXBlYWxpYXNlcywgJ2ZpbGUnKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TW9kdWxlKG5hbWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMubW9kdWxlcywgWyduYW1lJywgbmFtZV0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRSYXdNb2R1bGUobmFtZTogc3RyaW5nKTogYW55IHtcbiAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLnJhd01vZHVsZXMsIFsnbmFtZScsIG5hbWVdKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TW9kdWxlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kdWxlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q29tcG9uZW50cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50cztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q29udHJvbGxlcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXREaXJlY3RpdmVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXJlY3RpdmVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRJbmplY3RhYmxlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5qZWN0YWJsZXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEludGVyY2VwdG9ycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJjZXB0b3JzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRHdWFyZHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmd1YXJkcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0SW50ZXJmYWNlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJmYWNlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Um91dGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3V0ZXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFBpcGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5waXBlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q2xhc3NlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TWlzY2VsbGFuZW91cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlzY2VsbGFuZW91cztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlcGVuZGVuY2llc0VuZ2luZS5nZXRJbnN0YW5jZSgpO1xuIl19