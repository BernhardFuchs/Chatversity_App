"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dependencies_engine_1 = require("./dependencies.engine");
var file_engine_1 = require("./file.engine");
var ngdT = require('@compodoc/ngd-transformer');
var NgdEngine = /** @class */ (function () {
    function NgdEngine() {
    }
    NgdEngine.getInstance = function () {
        if (!NgdEngine.instance) {
            NgdEngine.instance = new NgdEngine();
        }
        return NgdEngine.instance;
    };
    NgdEngine.prototype.init = function (outputpath) {
        this.engine = new ngdT.DotEngine({
            output: outputpath,
            displayLegend: true,
            outputFormats: 'svg',
            silent: true
        });
    };
    NgdEngine.prototype.renderGraph = function (filepath, outputpath, type, name) {
        this.engine.updateOutput(outputpath);
        if (type === 'f') {
            return this.engine.generateGraph([dependencies_engine_1.default.getRawModule(name)]);
        }
        else {
            return this.engine.generateGraph(dependencies_engine_1.default.rawModulesForOverview);
        }
    };
    NgdEngine.prototype.readGraph = function (filepath, name) {
        return file_engine_1.default.get(filepath).catch(function (err) {
            return Promise.reject('Error during graph read ' + name);
        });
    };
    return NgdEngine;
}());
exports.NgdEngine = NgdEngine;
exports.default = NgdEngine.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdkLmVuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvbmdkLmVuZ2luZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZEQUF1RDtBQUN2RCw2Q0FBdUM7QUFFdkMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFFbEQ7SUFJSTtJQUF1QixDQUFDO0lBQ1YscUJBQVcsR0FBekI7UUFDSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTtZQUNyQixTQUFTLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7U0FDeEM7UUFDRCxPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFDOUIsQ0FBQztJQUVNLHdCQUFJLEdBQVgsVUFBWSxVQUFrQjtRQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUM3QixNQUFNLEVBQUUsVUFBVTtZQUNsQixhQUFhLEVBQUUsSUFBSTtZQUNuQixhQUFhLEVBQUUsS0FBSztZQUNwQixNQUFNLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSwrQkFBVyxHQUFsQixVQUFtQixRQUFnQixFQUFFLFVBQWtCLEVBQUUsSUFBWSxFQUFFLElBQWE7UUFDaEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFckMsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFO1lBQ2QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLDZCQUFrQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDN0U7YUFBTTtZQUNILE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsNkJBQWtCLENBQUMscUJBQXFCLENBQUMsQ0FBQztTQUM5RTtJQUNMLENBQUM7SUFFTSw2QkFBUyxHQUFoQixVQUFpQixRQUFnQixFQUFFLElBQVk7UUFDM0MsT0FBTyxxQkFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxHQUFHO1lBQ3JDLE9BQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUM7UUFBakQsQ0FBaUQsQ0FDcEQsQ0FBQztJQUNOLENBQUM7SUFDTCxnQkFBQztBQUFELENBQUMsQUFwQ0QsSUFvQ0M7QUFwQ1ksOEJBQVM7QUFzQ3RCLGtCQUFlLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEZXBlbmRlbmNpZXNFbmdpbmUgZnJvbSAnLi9kZXBlbmRlbmNpZXMuZW5naW5lJztcbmltcG9ydCBGaWxlRW5naW5lIGZyb20gJy4vZmlsZS5lbmdpbmUnO1xuXG5jb25zdCBuZ2RUID0gcmVxdWlyZSgnQGNvbXBvZG9jL25nZC10cmFuc2Zvcm1lcicpO1xuXG5leHBvcnQgY2xhc3MgTmdkRW5naW5lIHtcbiAgICBwdWJsaWMgZW5naW5lO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IE5nZEVuZ2luZTtcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgICAgICBpZiAoIU5nZEVuZ2luZS5pbnN0YW5jZSkge1xuICAgICAgICAgICAgTmdkRW5naW5lLmluc3RhbmNlID0gbmV3IE5nZEVuZ2luZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBOZ2RFbmdpbmUuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXQob3V0cHV0cGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZW5naW5lID0gbmV3IG5nZFQuRG90RW5naW5lKHtcbiAgICAgICAgICAgIG91dHB1dDogb3V0cHV0cGF0aCxcbiAgICAgICAgICAgIGRpc3BsYXlMZWdlbmQ6IHRydWUsXG4gICAgICAgICAgICBvdXRwdXRGb3JtYXRzOiAnc3ZnJyxcbiAgICAgICAgICAgIHNpbGVudDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyR3JhcGgoZmlsZXBhdGg6IHN0cmluZywgb3V0cHV0cGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcsIG5hbWU/OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5lbmdpbmUudXBkYXRlT3V0cHV0KG91dHB1dHBhdGgpO1xuXG4gICAgICAgIGlmICh0eXBlID09PSAnZicpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5nZW5lcmF0ZUdyYXBoKFtEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0UmF3TW9kdWxlKG5hbWUpXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbmdpbmUuZ2VuZXJhdGVHcmFwaChEZXBlbmRlbmNpZXNFbmdpbmUucmF3TW9kdWxlc0Zvck92ZXJ2aWV3KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZWFkR3JhcGgoZmlsZXBhdGg6IHN0cmluZywgbmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIEZpbGVFbmdpbmUuZ2V0KGZpbGVwYXRoKS5jYXRjaChlcnIgPT5cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvciBkdXJpbmcgZ3JhcGggcmVhZCAnICsgbmFtZSlcbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5nZEVuZ2luZS5nZXRJbnN0YW5jZSgpO1xuIl19