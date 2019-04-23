"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var logger_1 = require("../../utils/logger");
var dependencies_engine_1 = require("./dependencies.engine");
var file_engine_1 = require("./file.engine");
var traverse = require('traverse');
var ExportJsonEngine = /** @class */ (function () {
    function ExportJsonEngine() {
    }
    ExportJsonEngine.getInstance = function () {
        if (!ExportJsonEngine.instance) {
            ExportJsonEngine.instance = new ExportJsonEngine();
        }
        return ExportJsonEngine.instance;
    };
    ExportJsonEngine.prototype.export = function (outputFolder, data) {
        var exportData = {};
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
        exportData.pipes = data.pipes;
        exportData.interfaces = data.interfaces;
        exportData.injectables = data.injectables;
        exportData.classes = data.classes;
        exportData.directives = data.directives;
        exportData.components = data.components;
        exportData.modules = this.processModules();
        exportData.miscellaneous = data.miscellaneous;
        exportData.routes = data.routes;
        exportData.coverage = data.coverageData;
        return file_engine_1.default.write(outputFolder + path.sep + '/documentation.json', JSON.stringify(exportData, undefined, 4)).catch(function (err) {
            logger_1.logger.error('Error during export file generation ', err);
            return Promise.reject(err);
        });
    };
    ExportJsonEngine.prototype.processModules = function () {
        var modules = dependencies_engine_1.default.getModules();
        var _resultedModules = [];
        for (var moduleNr = 0; moduleNr < modules.length; moduleNr++) {
            var moduleElement = {
                name: modules[moduleNr].name,
                children: [
                    {
                        type: 'providers',
                        elements: []
                    },
                    {
                        type: 'declarations',
                        elements: []
                    },
                    {
                        type: 'imports',
                        elements: []
                    },
                    {
                        type: 'exports',
                        elements: []
                    },
                    {
                        type: 'bootstrap',
                        elements: []
                    },
                    {
                        type: 'classes',
                        elements: []
                    }
                ]
            };
            for (var k = 0; k < modules[moduleNr].providers.length; k++) {
                var providerElement = {
                    name: modules[moduleNr].providers[k].name
                };
                moduleElement.children[0].elements.push(providerElement);
            }
            for (var k = 0; k < modules[moduleNr].declarations.length; k++) {
                var declarationElement = {
                    name: modules[moduleNr].declarations[k].name
                };
                moduleElement.children[1].elements.push(declarationElement);
            }
            for (var k = 0; k < modules[moduleNr].imports.length; k++) {
                var importElement = {
                    name: modules[moduleNr].imports[k].name
                };
                moduleElement.children[2].elements.push(importElement);
            }
            for (var k = 0; k < modules[moduleNr].exports.length; k++) {
                var exportElement = {
                    name: modules[moduleNr].exports[k].name
                };
                moduleElement.children[3].elements.push(exportElement);
            }
            for (var k = 0; k < modules[moduleNr].bootstrap.length; k++) {
                var bootstrapElement = {
                    name: modules[moduleNr].bootstrap[k].name
                };
                moduleElement.children[4].elements.push(bootstrapElement);
            }
            _resultedModules.push(moduleElement);
        }
        return _resultedModules;
    };
    return ExportJsonEngine;
}());
exports.ExportJsonEngine = ExportJsonEngine;
exports.default = ExportJsonEngine.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LWpzb24uZW5naW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9leHBvcnQtanNvbi5lbmdpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBNkI7QUFFN0IsNkNBQTRDO0FBQzVDLDZEQUF1RDtBQUt2RCw2Q0FBdUM7QUFFdkMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRXJDO0lBRUk7SUFBdUIsQ0FBQztJQUNWLDRCQUFXLEdBQXpCO1FBQ0ksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtZQUM1QixnQkFBZ0IsQ0FBQyxRQUFRLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1NBQ3REO1FBQ0QsT0FBTyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7SUFDckMsQ0FBQztJQUVNLGlDQUFNLEdBQWIsVUFBYyxZQUFZLEVBQUUsSUFBSTtRQUM1QixJQUFJLFVBQVUsR0FBZSxFQUFFLENBQUM7UUFFaEMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFTLElBQUk7WUFDaEMsSUFBSSxJQUFJLEVBQUU7Z0JBQ04sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNiLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztpQkFDdEI7Z0JBQ0QsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUNsQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7aUJBQzNCO2FBQ0o7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUM5QixVQUFVLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENB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QUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7YUFDN0Q7WUFFRCxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDeEM7UUFFRCxPQUFPLGdCQUFnQixDQUFDO0lBQzVCLENBQUM7SUFDTCx1QkFBQztBQUFELENBQUMsQUFwSEQsSUFvSEM7QUFwSFksNENBQWdCO0FBc0g3QixrQkFBZSxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQgRGVwZW5kZW5jaWVzRW5naW5lIGZyb20gJy4vZGVwZW5kZW5jaWVzLmVuZ2luZSc7XG5cbmltcG9ydCB7IEV4cG9ydERhdGEgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2V4cG9ydC1kYXRhLmludGVyZmFjZSc7XG5cbmltcG9ydCB7IEFuZ3VsYXJOZ01vZHVsZU5vZGUgfSBmcm9tICcuLi9ub2Rlcy9hbmd1bGFyLW5nbW9kdWxlLW5vZGUnO1xuaW1wb3J0IEZpbGVFbmdpbmUgZnJvbSAnLi9maWxlLmVuZ2luZSc7XG5cbmNvbnN0IHRyYXZlcnNlID0gcmVxdWlyZSgndHJhdmVyc2UnKTtcblxuZXhwb3J0IGNsYXNzIEV4cG9ydEpzb25FbmdpbmUge1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBFeHBvcnRKc29uRW5naW5lO1xuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICghRXhwb3J0SnNvbkVuZ2luZS5pbnN0YW5jZSkge1xuICAgICAgICAgICAgRXhwb3J0SnNvbkVuZ2luZS5pbnN0YW5jZSA9IG5ldyBFeHBvcnRKc29uRW5naW5lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEV4cG9ydEpzb25FbmdpbmUuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgcHVibGljIGV4cG9ydChvdXRwdXRGb2xkZXIsIGRhdGEpIHtcbiAgICAgICAgbGV0IGV4cG9ydERhdGE6IEV4cG9ydERhdGEgPSB7fTtcblxuICAgICAgICB0cmF2ZXJzZShkYXRhKS5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlLnBhcmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5vZGUuaW5pdGlhbGl6ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBleHBvcnREYXRhLnBpcGVzID0gZGF0YS5waXBlcztcbiAgICAgICAgZXhwb3J0RGF0YS5pbnRlcmZhY2VzID0gZGF0YS5pbnRlcmZhY2VzO1xuICAgICAgICBleHBvcnREYXRhLmluamVjdGFibGVzID0gZGF0YS5pbmplY3RhYmxlcztcbiAgICAgICAgZXhwb3J0RGF0YS5jbGFzc2VzID0gZGF0YS5jbGFzc2VzO1xuICAgICAgICBleHBvcnREYXRhLmRpcmVjdGl2ZXMgPSBkYXRhLmRpcmVjdGl2ZXM7XG4gICAgICAgIGV4cG9ydERhdGEuY29tcG9uZW50cyA9IGRhdGEuY29tcG9uZW50cztcbiAgICAgICAgZXhwb3J0RGF0YS5tb2R1bGVzID0gdGhpcy5wcm9jZXNzTW9kdWxlcygpO1xuICAgICAgICBleHBvcnREYXRhLm1pc2NlbGxhbmVvdXMgPSBkYXRhLm1pc2NlbGxhbmVvdXM7XG4gICAgICAgIGV4cG9ydERhdGEucm91dGVzID0gZGF0YS5yb3V0ZXM7XG4gICAgICAgIGV4cG9ydERhdGEuY292ZXJhZ2UgPSBkYXRhLmNvdmVyYWdlRGF0YTtcblxuICAgICAgICByZXR1cm4gRmlsZUVuZ2luZS53cml0ZShcbiAgICAgICAgICAgIG91dHB1dEZvbGRlciArIHBhdGguc2VwICsgJy9kb2N1bWVudGF0aW9uLmpzb24nLFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZXhwb3J0RGF0YSwgdW5kZWZpbmVkLCA0KVxuICAgICAgICApLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGR1cmluZyBleHBvcnQgZmlsZSBnZW5lcmF0aW9uICcsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHByb2Nlc3NNb2R1bGVzKCkge1xuICAgICAgICBjb25zdCBtb2R1bGVzOiBBbmd1bGFyTmdNb2R1bGVOb2RlW10gPSBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0TW9kdWxlcygpO1xuXG4gICAgICAgIGxldCBfcmVzdWx0ZWRNb2R1bGVzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgbW9kdWxlTnIgPSAwOyBtb2R1bGVOciA8IG1vZHVsZXMubGVuZ3RoOyBtb2R1bGVOcisrKSB7XG4gICAgICAgICAgICBjb25zdCBtb2R1bGVFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IG1vZHVsZXNbbW9kdWxlTnJdLm5hbWUsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Byb3ZpZGVycycsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50czogW11cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlY2xhcmF0aW9ucycsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50czogW11cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ltcG9ydHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHM6IFtdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdleHBvcnRzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzOiBbXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYm9vdHN0cmFwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzOiBbXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2xhc3NlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50czogW11cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbW9kdWxlc1ttb2R1bGVOcl0ucHJvdmlkZXJzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvdmlkZXJFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBtb2R1bGVzW21vZHVsZU5yXS5wcm92aWRlcnNba10ubmFtZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbW9kdWxlRWxlbWVudC5jaGlsZHJlblswXS5lbGVtZW50cy5wdXNoKHByb3ZpZGVyRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IG1vZHVsZXNbbW9kdWxlTnJdLmRlY2xhcmF0aW9ucy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlY2xhcmF0aW9uRWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbW9kdWxlc1ttb2R1bGVOcl0uZGVjbGFyYXRpb25zW2tdLm5hbWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIG1vZHVsZUVsZW1lbnQuY2hpbGRyZW5bMV0uZWxlbWVudHMucHVzaChkZWNsYXJhdGlvbkVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBtb2R1bGVzW21vZHVsZU5yXS5pbXBvcnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW1wb3J0RWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbW9kdWxlc1ttb2R1bGVOcl0uaW1wb3J0c1trXS5uYW1lXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBtb2R1bGVFbGVtZW50LmNoaWxkcmVuWzJdLmVsZW1lbnRzLnB1c2goaW1wb3J0RWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IG1vZHVsZXNbbW9kdWxlTnJdLmV4cG9ydHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBvcnRFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBtb2R1bGVzW21vZHVsZU5yXS5leHBvcnRzW2tdLm5hbWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIG1vZHVsZUVsZW1lbnQuY2hpbGRyZW5bM10uZWxlbWVudHMucHVzaChleHBvcnRFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbW9kdWxlc1ttb2R1bGVOcl0uYm9vdHN0cmFwLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYm9vdHN0cmFwRWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbW9kdWxlc1ttb2R1bGVOcl0uYm9vdHN0cmFwW2tdLm5hbWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIG1vZHVsZUVsZW1lbnQuY2hpbGRyZW5bNF0uZWxlbWVudHMucHVzaChib290c3RyYXBFbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3Jlc3VsdGVkTW9kdWxlcy5wdXNoKG1vZHVsZUVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRlZE1vZHVsZXM7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFeHBvcnRKc29uRW5naW5lLmdldEluc3RhbmNlKCk7XG4iXX0=