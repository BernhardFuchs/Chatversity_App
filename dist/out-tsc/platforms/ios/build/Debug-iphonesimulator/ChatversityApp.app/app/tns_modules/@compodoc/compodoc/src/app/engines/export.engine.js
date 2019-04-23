"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_1 = require("../configuration");
var export_json_engine_1 = require("./export-json.engine");
var export_pdf_engine_1 = require("./export-pdf.engine");
var ExportEngine = /** @class */ (function () {
    function ExportEngine() {
    }
    ExportEngine.getInstance = function () {
        if (!ExportEngine.instance) {
            ExportEngine.instance = new ExportEngine();
        }
        return ExportEngine.instance;
    };
    ExportEngine.prototype.export = function (outputFolder, data) {
        switch (configuration_1.default.mainData.exportFormat) {
            case 'json':
                return export_json_engine_1.default.export(outputFolder, data);
            case 'pdf':
                return export_pdf_engine_1.default.export(outputFolder, data);
        }
    };
    return ExportEngine;
}());
exports.ExportEngine = ExportEngine;
exports.default = ExportEngine.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LmVuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9leHBvcnQuZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQTZDO0FBRTdDLDJEQUFvRDtBQUNwRCx5REFBa0Q7QUFFbEQ7SUFFSTtJQUF1QixDQUFDO0lBQ1Ysd0JBQVcsR0FBekI7UUFDSSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRTtZQUN4QixZQUFZLENBQUMsUUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7U0FDOUM7UUFDRCxPQUFPLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDakMsQ0FBQztJQUVNLDZCQUFNLEdBQWIsVUFBYyxZQUFZLEVBQUUsSUFBSTtRQUM1QixRQUFRLHVCQUFhLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRTtZQUN6QyxLQUFLLE1BQU07Z0JBQ1AsT0FBTyw0QkFBZ0IsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3ZELEtBQUssS0FBSztnQkFDTixPQUFPLDJCQUFlLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN6RDtJQUNMLENBQUM7SUFDTCxtQkFBQztBQUFELENBQUMsQUFsQkQsSUFrQkM7QUFsQlksb0NBQVk7QUFvQnpCLGtCQUFlLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb25maWd1cmF0aW9uIGZyb20gJy4uL2NvbmZpZ3VyYXRpb24nO1xuXG5pbXBvcnQgRXhwb3J0SnNvbkVuZ2luZSBmcm9tICcuL2V4cG9ydC1qc29uLmVuZ2luZSc7XG5pbXBvcnQgRXhwb3J0UGRmRW5naW5lIGZyb20gJy4vZXhwb3J0LXBkZi5lbmdpbmUnO1xuXG5leHBvcnQgY2xhc3MgRXhwb3J0RW5naW5lIHtcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogRXhwb3J0RW5naW5lO1xuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICghRXhwb3J0RW5naW5lLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBFeHBvcnRFbmdpbmUuaW5zdGFuY2UgPSBuZXcgRXhwb3J0RW5naW5lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEV4cG9ydEVuZ2luZS5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZXhwb3J0KG91dHB1dEZvbGRlciwgZGF0YSkge1xuICAgICAgICBzd2l0Y2ggKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZXhwb3J0Rm9ybWF0KSB7XG4gICAgICAgICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gRXhwb3J0SnNvbkVuZ2luZS5leHBvcnQob3V0cHV0Rm9sZGVyLCBkYXRhKTtcbiAgICAgICAgICAgIGNhc2UgJ3BkZic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIEV4cG9ydFBkZkVuZ2luZS5leHBvcnQob3V0cHV0Rm9sZGVyLCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXhwb3J0RW5naW5lLmdldEluc3RhbmNlKCk7XG4iXX0=