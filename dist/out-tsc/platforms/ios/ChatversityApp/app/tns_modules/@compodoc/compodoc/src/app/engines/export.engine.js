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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LmVuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvZXhwb3J0LmVuZ2luZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtEQUE2QztBQUU3QywyREFBb0Q7QUFDcEQseURBQWtEO0FBRWxEO0lBRUk7SUFBdUIsQ0FBQztJQUNWLHdCQUFXLEdBQXpCO1FBQ0ksSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUU7WUFDeEIsWUFBWSxDQUFDLFFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1NBQzlDO1FBQ0QsT0FBTyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQ2pDLENBQUM7SUFFTSw2QkFBTSxHQUFiLFVBQWMsWUFBWSxFQUFFLElBQUk7UUFDNUIsUUFBUSx1QkFBYSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUU7WUFDekMsS0FBSyxNQUFNO2dCQUNQLE9BQU8sNEJBQWdCLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2RCxLQUFLLEtBQUs7Z0JBQ04sT0FBTywyQkFBZSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDekQ7SUFDTCxDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEFBbEJELElBa0JDO0FBbEJZLG9DQUFZO0FBb0J6QixrQkFBZSxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29uZmlndXJhdGlvbiBmcm9tICcuLi9jb25maWd1cmF0aW9uJztcblxuaW1wb3J0IEV4cG9ydEpzb25FbmdpbmUgZnJvbSAnLi9leHBvcnQtanNvbi5lbmdpbmUnO1xuaW1wb3J0IEV4cG9ydFBkZkVuZ2luZSBmcm9tICcuL2V4cG9ydC1wZGYuZW5naW5lJztcblxuZXhwb3J0IGNsYXNzIEV4cG9ydEVuZ2luZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEV4cG9ydEVuZ2luZTtcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgICAgICBpZiAoIUV4cG9ydEVuZ2luZS5pbnN0YW5jZSkge1xuICAgICAgICAgICAgRXhwb3J0RW5naW5lLmluc3RhbmNlID0gbmV3IEV4cG9ydEVuZ2luZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBFeHBvcnRFbmdpbmUuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgcHVibGljIGV4cG9ydChvdXRwdXRGb2xkZXIsIGRhdGEpIHtcbiAgICAgICAgc3dpdGNoIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmV4cG9ydEZvcm1hdCkge1xuICAgICAgICAgICAgY2FzZSAnanNvbic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIEV4cG9ydEpzb25FbmdpbmUuZXhwb3J0KG91dHB1dEZvbGRlciwgZGF0YSk7XG4gICAgICAgICAgICBjYXNlICdwZGYnOlxuICAgICAgICAgICAgICAgIHJldHVybiBFeHBvcnRQZGZFbmdpbmUuZXhwb3J0KG91dHB1dEZvbGRlciwgZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV4cG9ydEVuZ2luZS5nZXRJbnN0YW5jZSgpO1xuIl19