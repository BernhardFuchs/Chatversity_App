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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jaWVzLmVuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvZGVwZW5kZW5jaWVzLmVuZ2luZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBCQUE0QjtBQU01QixpRUFBMEQ7QUFFMUQsMkNBQXNEO0FBa0J0RCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFckM7SUEyQkk7UUFaTyxrQkFBYSxHQUFzQjtZQUN0QyxTQUFTLEVBQUUsRUFBRTtZQUNiLFNBQVMsRUFBRSxFQUFFO1lBQ2IsV0FBVyxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsRUFBRTtZQUNoQixnQkFBZ0IsRUFBRSxFQUFFO1lBQ3BCLGdCQUFnQixFQUFFLEVBQUU7WUFDcEIsbUJBQW1CLEVBQUUsRUFBRTtZQUN2QixrQkFBa0IsRUFBRSxFQUFFO1NBQ3pCLENBQUM7SUFHcUIsQ0FBQztJQUNWLDhCQUFXLEdBQXpCO1FBQ0ksSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRTtZQUM5QixrQkFBa0IsQ0FBQyxRQUFRLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1NBQzFEO1FBQ0QsT0FBTyxrQkFBa0IsQ0FBQyxRQUFRLENBQUM7SUFDdkMsQ0FBQztJQUVPLGtFQUFxQyxHQUE3QztRQUFBLGlCQXdDQztRQXZDRyxJQUFJLFVBQVUsR0FBRyxVQUFBLEtBQUs7WUFDbEIsSUFBSSxTQUFTLEdBQUcsS0FBSSxDQUFDLDBCQUEwQixDQUMzQyxLQUFLLENBQUMsSUFBSSxFQUNWLEtBQUksQ0FBQyxVQUFVLEVBQ2YsS0FBSyxDQUFDLElBQUksQ0FDYixDQUFDO1lBQ0YsSUFBSSxPQUFPLFNBQVMsQ0FBQyxJQUFJ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QUFhLEdBQXBCO1FBQ0ksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFTSxzQ0FBUyxHQUFoQjtRQUNJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRU0scUNBQVEsR0FBZjtRQUNJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRU0sdUNBQVUsR0FBakI7UUFDSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQztJQUVNLDZDQUFnQixHQUF2QjtRQUNJLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM5QixDQUFDO0lBQ0wseUJBQUM7QUFBRCxDQUFDLEFBdmFELElBdWFDO0FBdmFZLGdEQUFrQjtBQXlhL0Isa0JBQWUsa0JBQWtCLENBQUMsV0FBVyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7IE1pc2NlbGxhbmVvdXNEYXRhIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9taXNjZWxsYW5lb3VzLWRhdGEuaW50ZXJmYWNlJztcbmltcG9ydCB7IFBhcnNlZERhdGEgfSBmcm9tICcuLi9pbnRlcmZhY2VzL3BhcnNlZC1kYXRhLmludGVyZmFjZSc7XG5pbXBvcnQgeyBSb3V0ZUludGVyZmFjZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvcm91dGVzLmludGVyZmFjZSc7XG5cbmltcG9ydCBBbmd1bGFyQXBpVXRpbCBmcm9tICcuLi8uLi91dGlscy9hbmd1bGFyLWFwaS51dGlsJztcbmltcG9ydCB7IElBcGlTb3VyY2VSZXN1bHQgfSBmcm9tICcuLi8uLi91dGlscy9hcGktc291cmNlLXJlc3VsdC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgZ2V0TmFtZXNDb21wYXJlRm4gfSBmcm9tICcuLi8uLi91dGlscy91dGlscyc7XG5cbmltcG9ydCB7XG4gICAgSUVudW1EZWNEZXAsXG4gICAgSUZ1bmN0aW9uRGVjRGVwLFxuICAgIElHdWFyZERlcCxcbiAgICBJSW5qZWN0YWJsZURlcCxcbiAgICBJSW50ZXJjZXB0b3JEZXAsXG4gICAgSUludGVyZmFjZURlcCxcbiAgICBJUGlwZURlcCxcbiAgICBJVHlwZUFsaWFzRGVjRGVwXG59IGZyb20gJy4uL2NvbXBpbGVyL2FuZ3VsYXIvZGVwZW5kZW5jaWVzLmludGVyZmFjZXMnO1xuXG5pbXBvcnQgeyBJQ29tcG9uZW50RGVwIH0gZnJvbSAnLi4vY29tcGlsZXIvYW5ndWxhci9kZXBzL2NvbXBvbmVudC1kZXAuZmFjdG9yeSc7XG5pbXBvcnQgeyBJQ29udHJvbGxlckRlcCB9IGZyb20gJy4uL2NvbXBpbGVyL2FuZ3VsYXIvZGVwcy9jb250cm9sbGVyLWRlcC5mYWN0b3J5JztcbmltcG9ydCB7IElEaXJlY3RpdmVEZXAgfSBmcm9tICcuLi9jb21waWxlci9hbmd1bGFyL2RlcHMvZGlyZWN0aXZlLWRlcC5mYWN0b3J5JztcbmltcG9ydCB7IElNb2R1bGVEZXAgfSBmcm9tICcuLi9jb21waWxlci9hbmd1bGFyL2RlcHMvbW9kdWxlLWRlcC5mYWN0b3J5JztcblxuY29uc3QgdHJhdmVyc2UgPSByZXF1aXJlKCd0cmF2ZXJzZScpO1xuXG5leHBvcnQgY2xhc3MgRGVwZW5kZW5jaWVzRW5naW5lIHtcbiAgICBwdWJsaWMgcmF3RGF0YTogUGFyc2VkRGF0YTtcbiAgICBwdWJsaWMgbW9kdWxlczogT2JqZWN0W107XG4gICAgcHVibGljIHJhd01vZHVsZXM6IE9iamVjdFtdO1xuICAgIHB1YmxpYyByYXdNb2R1bGVzRm9yT3ZlcnZpZXc6IE9iamVjdFtdO1xuICAgIHB1YmxpYyBjb21wb25lbnRzOiBPYmplY3RbXTtcbiAgICBwdWJsaWMgY29udHJvbGxlcnM6IE9iamVjdFtdO1xuICAgIHB1YmxpYyBkaXJlY3RpdmVzOiBPYmplY3RbXTtcbiAgICBwdWJsaWMgaW5qZWN0YWJsZXM6IE9iamVjdFtdO1xuICAgIHB1YmxpYyBpbnRlcmNlcHRvcnM6IE9iamVjdFtdO1xuICAgIHB1YmxpYyBndWFyZHM6IE9iamVjdFtdO1xuICAgIHB1YmxpYyBpbnRlcmZhY2VzOiBPYmplY3RbXTtcbiAgICBwdWJsaWMgcm91dGVzOiBSb3V0ZUludGVyZmFjZTtcbiAgICBwdWJsaWMgcGlwZXM6IE9iamVjdFtdO1xuICAgIHB1YmxpYyBjbGFzc2VzOiBPYmplY3RbXTtcbiAgICBwdWJsaWMgbWlzY2VsbGFuZW91czogTWlzY2VsbGFuZW91c0RhdGEgPSB7XG4gICAgICAgIHZhcmlhYmxlczogW10sXG4gICAgICAgIGZ1bmN0aW9uczogW10sXG4gICAgICAgIHR5cGVhbGlhc2VzOiBbXSxcbiAgICAgICAgZW51bWVyYXRpb25zOiBbXSxcbiAgICAgICAgZ3JvdXBlZFZhcmlhYmxlczogW10sXG4gICAgICAgIGdyb3VwZWRGdW5jdGlvbnM6IFtdLFxuICAgICAgICBncm91cGVkRW51bWVyYXRpb25zOiBbXSxcbiAgICAgICAgZ3JvdXBlZFR5cGVBbGlhc2VzOiBbXVxuICAgIH07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogRGVwZW5kZW5jaWVzRW5naW5lO1xuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICghRGVwZW5kZW5jaWVzRW5naW5lLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBEZXBlbmRlbmNpZXNFbmdpbmUuaW5zdGFuY2UgPSBuZXcgRGVwZW5kZW5jaWVzRW5naW5lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIERlcGVuZGVuY2llc0VuZ2luZS5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZU1vZHVsZXNEZWNsYXJhdGlvbnNFeHBvcnRzVHlwZXMoKSB7XG4gICAgICAgIGxldCBtZXJnZVR5cGVzID0gZW50cnkgPT4ge1xuICAgICAgICAgICAgbGV0IGRpcmVjdGl2ZSA9IHRoaXMuZmluZEluQ29tcG9kb2NEZXBlbmRlbmNpZXMoXG4gICAgICAgICAgICAgICAgZW50cnkubmFtZSxcbiAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGl2ZXMsXG4gICAgICAgICAgICAgICAgZW50cnkuZmlsZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGlyZWN0aXZlLmRhdGEgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgZW50cnkudHlwZSA9ICdkaXJlY3RpdmUnO1xuICAgICAgICAgICAgICAgIGVudHJ5LmlkID0gZGlyZWN0aXZlLmRhdGEuaWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSB0aGlzLmZpbmRJbkNvbXBvZG9jRGVwZW5kZW5jaWVzKFxuICAgICAgICAgICAgICAgIGVudHJ5Lm5hbWUsXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLFxuICAgICAgICAgICAgICAgIGVudHJ5LmZpbGVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5kYXRhICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGVudHJ5LnR5cGUgPSAnY29tcG9uZW50JztcbiAgICAgICAgICAgICAgICBlbnRyeS5pZCA9IGNvbXBvbmVudC5kYXRhLmlkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcGlwZSA9IHRoaXMuZmluZEluQ29tcG9kb2NEZXBlbmRlbmNpZXMoZW50cnkubmFtZSwgdGhpcy5waXBlcywgZW50cnkuZmlsZSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHBpcGUuZGF0YSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBlbnRyeS50eXBlID0gJ3BpcGUnO1xuICAgICAgICAgICAgICAgIGVudHJ5LmlkID0gcGlwZS5kYXRhLmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubW9kdWxlcy5mb3JFYWNoKG1vZHVsZSA9PiB7XG4gICAgICAgICAgICBtb2R1bGUuZGVjbGFyYXRpb25zLmZvckVhY2goZGVjbGFyYXRpb24gPT4ge1xuICAgICAgICAgICAgICAgIG1lcmdlVHlwZXMoZGVjbGFyYXRpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtb2R1bGUuZXhwb3J0cy5mb3JFYWNoKGV4cHQgPT4ge1xuICAgICAgICAgICAgICAgIG1lcmdlVHlwZXMoZXhwdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1vZHVsZS5lbnRyeUNvbXBvbmVudHMuZm9yRWFjaChlbnQgPT4ge1xuICAgICAgICAgICAgICAgIG1lcmdlVHlwZXMoZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdChkYXRhOiBQYXJzZWREYXRhKSB7XG4gICAgICAgIHRyYXZlcnNlKGRhdGEpLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5vZGUucGFyZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5pbml0aWFsaXplcikge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbm9kZS5pbml0aWFsaXplcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJhd0RhdGEgPSBkYXRhO1xuICAgICAgICB0aGlzLm1vZHVsZXMgPSBfLnNvcnRCeSh0aGlzLnJhd0RhdGEubW9kdWxlcywgW2VsID0+IGVsLm5hbWUudG9Mb3dlckNhc2UoKV0pO1xuICAgICAgICB0aGlzLnJhd01vZHVsZXNGb3JPdmVydmlldyA9IF8uc29ydEJ5KGRhdGEubW9kdWxlc0ZvckdyYXBoLCBbZWwgPT4gZWwubmFtZS50b0xvd2VyQ2FzZSgpXSk7XG4gICAgICAgIHRoaXMucmF3TW9kdWxlcyA9IF8uc29ydEJ5KGRhdGEubW9kdWxlc0ZvckdyYXBoLCBbZWwgPT4gZWwubmFtZS50b0xvd2VyQ2FzZSgpXSk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IF8uc29ydEJ5KHRoaXMucmF3RGF0YS5jb21wb25lbnRzLCBbZWwgPT4gZWwubmFtZS50b0xvd2VyQ2FzZSgpXSk7XG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgPSBfLnNvcnRCeSh0aGlzLnJhd0RhdGEuY29udHJvbGxlcnMsIFtlbCA9PiBlbC5uYW1lLnRvTG93ZXJDYXNlKCldKTtcbiAgICAgICAgdGhpcy5kaXJlY3RpdmVzID0gXy5zb3J0QnkodGhpcy5yYXdEYXRhLmRpcmVjdGl2ZXMsIFtlbCA9PiBlbC5uYW1lLnRvTG93ZXJDYXNlKCldKTtcbiAgICAgICAgdGhpcy5pbmplY3RhYmxlcyA9IF8uc29ydEJ5KHRoaXMucmF3RGF0YS5pbmplY3RhYmxlcywgW2VsID0+IGVsLm5hbWUudG9Mb3dlckNhc2UoKV0pO1xuICAgICAgICB0aGlzLmludGVyY2VwdG9ycyA9IF8uc29ydEJ5KHRoaXMucmF3RGF0YS5pbnRlcmNlcHRvcnMsIFtlbCA9PiBlbC5uYW1lLnRvTG93ZXJDYXNlKCldKTtcbiAgICAgICAgdGhpcy5ndWFyZHMgPSBfLnNvcnRCeSh0aGlzLnJhd0RhdGEuZ3VhcmRzLCBbZWwgPT4gZWwubmFtZS50b0xvd2VyQ2FzZSgpXSk7XG4gICAgICAgIHRoaXMuaW50ZXJmYWNlcyA9IF8uc29ydEJ5KHRoaXMucmF3RGF0YS5pbnRlcmZhY2VzLCBbZWwgPT4gZWwubmFtZS50b0xvd2VyQ2FzZSgpXSk7XG4gICAgICAgIHRoaXMucGlwZXMgPSBfLnNvcnRCeSh0aGlzLnJhd0RhdGEucGlwZXMsIFtlbCA9PiBlbC5uYW1lLnRvTG93ZXJDYXNlKCldKTtcbiAgICAgICAgdGhpcy5jbGFzc2VzID0gXy5zb3J0QnkodGhpcy5yYXdEYXRhLmNsYXNzZXMsIFtlbCA9PiBlbC5uYW1lLnRvTG93ZXJDYXNlKCldKTtcbiAgICAgICAgdGhpcy5taXNjZWxsYW5lb3VzID0gdGhpcy5yYXdEYXRhLm1pc2NlbGxhbmVvdXM7XG4gICAgICAgIHRoaXMucHJlcGFyZU1pc2NlbGxhbmVvdXMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVNb2R1bGVzRGVjbGFyYXRpb25zRXhwb3J0c1R5cGVzKCk7XG4gICAgICAgIHRoaXMucm91dGVzID0gdGhpcy5yYXdEYXRhLnJvdXRlc1RyZWU7XG4gICAgICAgIHRoaXMubWFuYWdlRHVwbGljYXRlc05hbWUoKTtcbiAgICAgICAgdGhpcy5jbGVhblJhd01vZHVsZXNOYW1lcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYW5SYXdNb2R1bGVzTmFtZXMoKSB7XG4gICAgICAgIHRoaXMucmF3TW9kdWxlc0Zvck92ZXJ2aWV3ID0gdGhpcy5yYXdNb2R1bGVzRm9yT3ZlcnZpZXcubWFwKG1vZHVsZSA9PiB7XG4gICAgICAgICAgICBtb2R1bGUubmFtZSA9IG1vZHVsZS5uYW1lLnJlcGxhY2UoJyQnLCAnJyk7XG4gICAgICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmRJbkNvbXBvZG9jRGVwZW5kZW5jaWVzKG5hbWUsIGRhdGEsIGZpbGU/KTogSUFwaVNvdXJjZVJlc3VsdDxhbnk+IHtcbiAgICAgICAgbGV0IF9yZXN1bHQgPSB7XG4gICAgICAgICAgICBzb3VyY2U6ICdpbnRlcm5hbCcsXG4gICAgICAgICAgICBkYXRhOiB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IG5hbWVGb3VuZENvdW50ZXIgPSAwO1xuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUuaW5kZXhPZihkYXRhW2ldLm5hbWUpICE9PSAtMSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUucmVwbGFjZSgvXFxcXC9nLCAnLycpLmluZGV4T2YoZGF0YVtpXS5maWxlKSAhPT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVGb3VuZENvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVzdWx0LmRhdGEgPSBkYXRhW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUuaW5kZXhPZihkYXRhW2ldLm5hbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVGb3VuZENvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVzdWx0LmRhdGEgPSBkYXRhW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBQcmV2ZW50IHdyb25nIG1hdGNoaW5nIGxpa2UgTXVsdGlTZWxlY3RPcHRpb25EaXJlY3RpdmUgd2l0aCBTZWxlY3RPcHRpb25EaXJlY3RpdmUsIG9yIFF1ZXJ5UGFyYW1Hcm91cFNlcnZpY2Ugd2l0aCBRdWVyeVBhcmFtR3JvdXBcbiAgICAgICAgICAgIGlmIChuYW1lRm91bmRDb3VudGVyID4gMSkge1xuICAgICAgICAgICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZpbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lID09PSBkYXRhW2ldLm5hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZS5yZXBsYWNlKC9cXFxcL2csICcvJykuaW5kZXhPZihkYXRhW2ldLmZpbGUpICE9PSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXN1bHQuZGF0YSA9IGRhdGFbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gZGF0YVtpXS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Jlc3VsdC5kYXRhID0gZGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICBfcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiAnaW50ZXJuYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgbWFuYWdlRHVwbGljYXRlc05hbWUoKSB7XG4gICAgICAgIGxldCBwcm9jZXNzRHVwbGljYXRlcyA9IChlbGVtZW50LCBpbmRleCwgYXJyYXkpID0+IHtcbiAgICAgICAgICAgIGxldCBlbGVtZW50c1dpdGhTYW1lTmFtZSA9IF8uZmlsdGVyKGFycmF5LCB7IG5hbWU6IGVsZW1lbnQubmFtZSB9KTtcbiAgICAgICAgICAgIGlmIChlbGVtZW50c1dpdGhTYW1lTmFtZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgLy8gRmlyc3QgZWxlbWVudCBpcyB0aGUgcmVmZXJlbmNlIGZvciBkdXBsaWNhdGVzXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBlbGVtZW50c1dpdGhTYW1lTmFtZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudFRvRWRpdCA9IGVsZW1lbnRzV2l0aFNhbWVOYW1lW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnRUb0VkaXQuaXNEdXBsaWNhdGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VG9FZGl0LmlzRHVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRUb0VkaXQuZHVwbGljYXRlSWQgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFRvRWRpdC5kdXBsaWNhdGVOYW1lID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VG9FZGl0Lm5hbWUgKyAnLScgKyBlbGVtZW50VG9FZGl0LmR1cGxpY2F0ZUlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFRvRWRpdC5pZCA9IGVsZW1lbnRUb0VkaXQuaWQgKyAnLScgKyBlbGVtZW50VG9FZGl0LmR1cGxpY2F0ZUlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2xhc3NlcyA9IHRoaXMuY2xhc3Nlcy5tYXAocHJvY2Vzc0R1cGxpY2F0ZXMpO1xuICAgICAgICB0aGlzLmludGVyZmFjZXMgPSB0aGlzLmludGVyZmFjZXMubWFwKHByb2Nlc3NEdXBsaWNhdGVzKTtcbiAgICAgICAgdGhpcy5pbmplY3RhYmxlcyA9IHRoaXMuaW5qZWN0YWJsZXMubWFwKHByb2Nlc3NEdXBsaWNhdGVzKTtcbiAgICAgICAgdGhpcy5waXBlcyA9IHRoaXMucGlwZXMubWFwKHByb2Nlc3NEdXBsaWNhdGVzKTtcbiAgICAgICAgdGhpcy5pbnRlcmNlcHRvcnMgPSB0aGlzLmludGVyY2VwdG9ycy5tYXAocHJvY2Vzc0R1cGxpY2F0ZXMpO1xuICAgICAgICB0aGlzLmd1YXJkcyA9IHRoaXMuZ3VhcmRzLm1hcChwcm9jZXNzRHVwbGljYXRlcyk7XG4gICAgICAgIHRoaXMubW9kdWxlcyA9IHRoaXMubW9kdWxlcy5tYXAocHJvY2Vzc0R1cGxpY2F0ZXMpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSB0aGlzLmNvbXBvbmVudHMubWFwKHByb2Nlc3NEdXBsaWNhdGVzKTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyA9IHRoaXMuY29udHJvbGxlcnMubWFwKHByb2Nlc3NEdXBsaWNhdGVzKTtcbiAgICAgICAgdGhpcy5kaXJlY3RpdmVzID0gdGhpcy5kaXJlY3RpdmVzLm1hcChwcm9jZXNzRHVwbGljYXRlcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGZpbmQobmFtZTogc3RyaW5nKTogSUFwaVNvdXJjZVJlc3VsdDxhbnk+IHwgdW5kZWZpbmVkIHtcbiAgICAgICAgbGV0IHNlYXJjaEZ1bmN0aW9uczogQXJyYXk8KCkgPT4gSUFwaVNvdXJjZVJlc3VsdDxhbnk+PiA9IFtcbiAgICAgICAgICAgICgpID0+IHRoaXMuZmluZEluQ29tcG9kb2NEZXBlbmRlbmNpZXMobmFtZSwgdGhpcy5pbmplY3RhYmxlcyksXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmZpbmRJbkNvbXBvZG9jRGVwZW5kZW5jaWVzKG5hbWUsIHRoaXMuaW50ZXJjZXB0b3JzKSxcbiAgICAgICAgICAgICgpID0+IHRoaXMuZmluZEluQ29tcG9kb2NEZXBlbmRlbmNpZXMobmFtZSwgdGhpcy5ndWFyZHMpLFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5maW5kSW5Db21wb2RvY0RlcGVuZGVuY2llcyhuYW1lLCB0aGlzLmludGVyZmFjZXMpLFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5maW5kSW5Db21wb2RvY0RlcGVuZGVuY2llcyhuYW1lLCB0aGlzLmNsYXNzZXMpLFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5maW5kSW5Db21wb2RvY0RlcGVuZGVuY2llcyhuYW1lLCB0aGlzLmNvbXBvbmVudHMpLFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5maW5kSW5Db21wb2RvY0RlcGVuZGVuY2llcyhuYW1lLCB0aGlzLmNvbnRyb2xsZXJzKSxcbiAgICAgICAgICAgICgpID0+IHRoaXMuZmluZEluQ29tcG9kb2NEZXBlbmRlbmNpZXMobmFtZSwgdGhpcy5taXNjZWxsYW5lb3VzLnZhcmlhYmxlcyksXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmZpbmRJbkNvbXBvZG9jRGVwZW5kZW5jaWVzKG5hbWUsIHRoaXMubWlzY2VsbGFuZW91cy5mdW5jdGlvbnMpLFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5maW5kSW5Db21wb2RvY0RlcGVuZGVuY2llcyhuYW1lLCB0aGlzLm1pc2NlbGxhbmVvdXMudHlwZWFsaWFzZXMpLFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5maW5kSW5Db21wb2RvY0RlcGVuZGVuY2llcyhuYW1lLCB0aGlzLm1pc2NlbGxhbmVvdXMuZW51bWVyYXRpb25zKSxcbiAgICAgICAgICAgICgpID0+IEFuZ3VsYXJBcGlVdGlsLmZpbmRBcGkobmFtZSlcbiAgICAgICAgXTtcblxuICAgICAgICBmb3IgKGxldCBzZWFyY2hGdW5jdGlvbiBvZiBzZWFyY2hGdW5jdGlvbnMpIHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBzZWFyY2hGdW5jdGlvbigpO1xuXG4gICAgICAgICAgICBpZiAocmVzdWx0LmRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKHVwZGF0ZWREYXRhKTogdm9pZCB7XG4gICAgICAgIGlmICh1cGRhdGVkRGF0YS5tb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaCh1cGRhdGVkRGF0YS5tb2R1bGVzLCAobW9kdWxlOiBJTW9kdWxlRGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IF9pbmRleCA9IF8uZmluZEluZGV4KHRoaXMubW9kdWxlcywgeyBuYW1lOiBtb2R1bGUubmFtZSB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZHVsZXNbX2luZGV4XSA9IG1vZHVsZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVkRGF0YS5jb21wb25lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaCh1cGRhdGVkRGF0YS5jb21wb25lbnRzLCAoY29tcG9uZW50OiBJQ29tcG9uZW50RGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IF9pbmRleCA9IF8uZmluZEluZGV4KHRoaXMuY29tcG9uZW50cywgeyBuYW1lOiBjb21wb25lbnQubmFtZSB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHNbX2luZGV4XSA9IGNvbXBvbmVudDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVkRGF0YS5jb250cm9sbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBfLmZvckVhY2godXBkYXRlZERhdGEuY29udHJvbGxlcnMsIChjb250cm9sbGVyOiBJQ29udHJvbGxlckRlcCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBfaW5kZXggPSBfLmZpbmRJbmRleCh0aGlzLmNvbnRyb2xsZXJzLCB7IG5hbWU6IGNvbnRyb2xsZXIubmFtZSB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXJzW19pbmRleF0gPSBjb250cm9sbGVyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhLmRpcmVjdGl2ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgXy5mb3JFYWNoKHVwZGF0ZWREYXRhLmRpcmVjdGl2ZXMsIChkaXJlY3RpdmU6IElEaXJlY3RpdmVEZXApID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgX2luZGV4ID0gXy5maW5kSW5kZXgodGhpcy5kaXJlY3RpdmVzLCB7IG5hbWU6IGRpcmVjdGl2ZS5uYW1lIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aXZlc1tfaW5kZXhdID0gZGlyZWN0aXZlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhLmluamVjdGFibGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaCh1cGRhdGVkRGF0YS5pbmplY3RhYmxlcywgKGluamVjdGFibGU6IElJbmplY3RhYmxlRGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IF9pbmRleCA9IF8uZmluZEluZGV4KHRoaXMuaW5qZWN0YWJsZXMsIHsgbmFtZTogaW5qZWN0YWJsZS5uYW1lIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5qZWN0YWJsZXNbX2luZGV4XSA9IGluamVjdGFibGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlZERhdGEuaW50ZXJjZXB0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaCh1cGRhdGVkRGF0YS5pbnRlcmNlcHRvcnMsIChpbnRlcmNlcHRvcjogSUludGVyY2VwdG9yRGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IF9pbmRleCA9IF8uZmluZEluZGV4KHRoaXMuaW50ZXJjZXB0b3JzLCB7IG5hbWU6IGludGVyY2VwdG9yLm5hbWUgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmNlcHRvcnNbX2luZGV4XSA9IGludGVyY2VwdG9yO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhLmd1YXJkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBfLmZvckVhY2godXBkYXRlZERhdGEuZ3VhcmRzLCAoZ3VhcmQ6IElHdWFyZERlcCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBfaW5kZXggPSBfLmZpbmRJbmRleCh0aGlzLmd1YXJkcywgeyBuYW1lOiBndWFyZC5uYW1lIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuZ3VhcmRzW19pbmRleF0gPSBndWFyZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVkRGF0YS5pbnRlcmZhY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaCh1cGRhdGVkRGF0YS5pbnRlcmZhY2VzLCAoaW50OiBJSW50ZXJmYWNlRGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IF9pbmRleCA9IF8uZmluZEluZGV4KHRoaXMuaW50ZXJmYWNlcywgeyBuYW1lOiBpbnQubmFtZSB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmludGVyZmFjZXNbX2luZGV4XSA9IGludDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVkRGF0YS5waXBlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBfLmZvckVhY2godXBkYXRlZERhdGEucGlwZXMsIChwaXBlOiBJUGlwZURlcCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBfaW5kZXggPSBfLmZpbmRJbmRleCh0aGlzLnBpcGVzLCB7IG5hbWU6IHBpcGUubmFtZSB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLnBpcGVzW19pbmRleF0gPSBwaXBlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhLmNsYXNzZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgXy5mb3JFYWNoKHVwZGF0ZWREYXRhLmNsYXNzZXMsIChjbGFzc2U6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBfaW5kZXggPSBfLmZpbmRJbmRleCh0aGlzLmNsYXNzZXMsIHsgbmFtZTogY2xhc3NlLm5hbWUgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc2VzW19pbmRleF0gPSBjbGFzc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogTWlzY2VsbGFuZW91cyB1cGRhdGVcbiAgICAgICAgICovXG4gICAgICAgIGlmICh1cGRhdGVkRGF0YS5taXNjZWxsYW5lb3VzLnZhcmlhYmxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBfLmZvckVhY2godXBkYXRlZERhdGEubWlzY2VsbGFuZW91cy52YXJpYWJsZXMsICh2YXJpYWJsZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IF9pbmRleCA9IF8uZmluZEluZGV4KHRoaXMubWlzY2VsbGFuZW91cy52YXJpYWJsZXMsIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdmFyaWFibGUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZTogdmFyaWFibGUuZmlsZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMubWlzY2VsbGFuZW91cy52YXJpYWJsZXNbX2luZGV4XSA9IHZhcmlhYmxlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhLm1pc2NlbGxhbmVvdXMuZnVuY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaCh1cGRhdGVkRGF0YS5taXNjZWxsYW5lb3VzLmZ1bmN0aW9ucywgKGZ1bmM6IElGdW5jdGlvbkRlY0RlcCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBfaW5kZXggPSBfLmZpbmRJbmRleCh0aGlzLm1pc2NlbGxhbmVvdXMuZnVuY3Rpb25zLCB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGZ1bmMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZTogZnVuYy5maWxlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5taXNjZWxsYW5lb3VzLmZ1bmN0aW9uc1tfaW5kZXhdID0gZnVuYztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVkRGF0YS5taXNjZWxsYW5lb3VzLnR5cGVhbGlhc2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaCh1cGRhdGVkRGF0YS5taXNjZWxsYW5lb3VzLnR5cGVhbGlhc2VzLCAodHlwZWFsaWFzOiBJVHlwZUFsaWFzRGVjRGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IF9pbmRleCA9IF8uZmluZEluZGV4KHRoaXMubWlzY2VsbGFuZW91cy50eXBlYWxpYXNlcywge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiB0eXBlYWxpYXMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZTogdHlwZWFsaWFzLmZpbGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLm1pc2NlbGxhbmVvdXMudHlwZWFsaWFzZXNbX2luZGV4XSA9IHR5cGVhbGlhcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVkRGF0YS5taXNjZWxsYW5lb3VzLmVudW1lcmF0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBfLmZvckVhY2godXBkYXRlZERhdGEubWlzY2VsbGFuZW91cy5lbnVtZXJhdGlvbnMsIChlbnVtZXJhdGlvbjogSUVudW1EZWNEZXApID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgX2luZGV4ID0gXy5maW5kSW5kZXgodGhpcy5taXNjZWxsYW5lb3VzLmVudW1lcmF0aW9ucywge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBlbnVtZXJhdGlvbi5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBmaWxlOiBlbnVtZXJhdGlvbi5maWxlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5taXNjZWxsYW5lb3VzLmVudW1lcmF0aW9uc1tfaW5kZXhdID0gZW51bWVyYXRpb247XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXBhcmVNaXNjZWxsYW5lb3VzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGZpbmRJbkNvbXBvZG9jKG5hbWU6IHN0cmluZykge1xuICAgICAgICBsZXQgbWVyZ2VkRGF0YSA9IF8uY29uY2F0KFxuICAgICAgICAgICAgW10sXG4gICAgICAgICAgICB0aGlzLm1vZHVsZXMsXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMsXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXJzLFxuICAgICAgICAgICAgdGhpcy5kaXJlY3RpdmVzLFxuICAgICAgICAgICAgdGhpcy5pbmplY3RhYmxlcyxcbiAgICAgICAgICAgIHRoaXMuaW50ZXJjZXB0b3JzLFxuICAgICAgICAgICAgdGhpcy5ndWFyZHMsXG4gICAgICAgICAgICB0aGlzLmludGVyZmFjZXMsXG4gICAgICAgICAgICB0aGlzLnBpcGVzLFxuICAgICAgICAgICAgdGhpcy5jbGFzc2VzLFxuICAgICAgICAgICAgdGhpcy5taXNjZWxsYW5lb3VzLmVudW1lcmF0aW9ucyxcbiAgICAgICAgICAgIHRoaXMubWlzY2VsbGFuZW91cy50eXBlYWxpYXNlcyxcbiAgICAgICAgICAgIHRoaXMubWlzY2VsbGFuZW91cy52YXJpYWJsZXMsXG4gICAgICAgICAgICB0aGlzLm1pc2NlbGxhbmVvdXMuZnVuY3Rpb25zXG4gICAgICAgICk7XG4gICAgICAgIGxldCByZXN1bHQgPSBfLmZpbmQobWVyZ2VkRGF0YSwgeyBuYW1lOiBuYW1lIH0gYXMgYW55KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByZXBhcmVNaXNjZWxsYW5lb3VzKCkge1xuICAgICAgICB0aGlzLm1pc2NlbGxhbmVvdXMudmFyaWFibGVzLnNvcnQoZ2V0TmFtZXNDb21wYXJlRm4oKSk7XG4gICAgICAgIHRoaXMubWlzY2VsbGFuZW91cy5mdW5jdGlvbnMuc29ydChnZXROYW1lc0NvbXBhcmVGbigpKTtcbiAgICAgICAgdGhpcy5taXNjZWxsYW5lb3VzLmVudW1lcmF0aW9ucy5zb3J0KGdldE5hbWVzQ29tcGFyZUZuKCkpO1xuICAgICAgICB0aGlzLm1pc2NlbGxhbmVvdXMudHlwZWFsaWFzZXMuc29ydChnZXROYW1lc0NvbXBhcmVGbigpKTtcbiAgICAgICAgLy8gZ3JvdXAgZWFjaCBzdWJnb3VwIGJ5IGZpbGVcbiAgICAgICAgdGhpcy5taXNjZWxsYW5lb3VzLmdyb3VwZWRWYXJpYWJsZXMgPSBfLmdyb3VwQnkodGhpcy5taXNjZWxsYW5lb3VzLnZhcmlhYmxlcywgJ2ZpbGUnKTtcbiAgICAgICAgdGhpcy5taXNjZWxsYW5lb3VzLmdyb3VwZWRGdW5jdGlvbnMgPSBfLmdyb3VwQnkodGhpcy5taXNjZWxsYW5lb3VzLmZ1bmN0aW9ucywgJ2ZpbGUnKTtcbiAgICAgICAgdGhpcy5taXNjZWxsYW5lb3VzLmdyb3VwZWRFbnVtZXJhdGlvbnMgPSBfLmdyb3VwQnkodGhpcy5taXNjZWxsYW5lb3VzLmVudW1lcmF0aW9ucywgJ2ZpbGUnKTtcbiAgICAgICAgdGhpcy5taXNjZWxsYW5lb3VzLmdyb3VwZWRUeXBlQWxpYXNlcyA9IF8uZ3JvdXBCeSh0aGlzLm1pc2NlbGxhbmVvdXMudHlwZWFsaWFzZXMsICdmaWxlJyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE1vZHVsZShuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLm1vZHVsZXMsIFsnbmFtZScsIG5hbWVdKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0UmF3TW9kdWxlKG5hbWU6IHN0cmluZyk6IGFueSB7XG4gICAgICAgIHJldHVybiBfLmZpbmQodGhpcy5yYXdNb2R1bGVzLCBbJ25hbWUnLCBuYW1lXSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE1vZHVsZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZHVsZXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENvbXBvbmVudHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudHM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENvbnRyb2xsZXJzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sbGVycztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RGlyZWN0aXZlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlyZWN0aXZlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0SW5qZWN0YWJsZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluamVjdGFibGVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRJbnRlcmNlcHRvcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVyY2VwdG9ycztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0R3VhcmRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ndWFyZHM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEludGVyZmFjZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVyZmFjZXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFJvdXRlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm91dGVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRQaXBlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGlwZXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENsYXNzZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzZXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE1pc2NlbGxhbmVvdXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pc2NlbGxhbmVvdXM7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0SW5zdGFuY2UoKTtcbiJdfQ==