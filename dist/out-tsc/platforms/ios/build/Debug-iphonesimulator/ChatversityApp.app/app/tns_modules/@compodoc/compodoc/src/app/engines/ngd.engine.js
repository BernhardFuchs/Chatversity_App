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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdkLmVuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9uZ2QuZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkRBQXVEO0FBQ3ZELDZDQUF1QztBQUV2QyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUVsRDtJQUlJO0lBQXVCLENBQUM7SUFDVixxQkFBVyxHQUF6QjtRQUNJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO1lBQ3JCLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztTQUN4QztRQUNELE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUM5QixDQUFDO0lBRU0sd0JBQUksR0FBWCxVQUFZLFVBQWtCO1FBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQzdCLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLGFBQWEsRUFBRSxJQUFJO1lBQ25CLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLE1BQU0sRUFBRSxJQUFJO1NBQ2YsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLCtCQUFXLEdBQWxCLFVBQW1CLFFBQWdCLEVBQUUsVUFBa0IsRUFBRSxJQUFZLEVBQUUsSUFBYTtRQUNoRixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVyQyxJQUFJLElBQUksS0FBSyxHQUFHLEVBQUU7WUFDZCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsNkJBQWtCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3RTthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyw2QkFBa0IsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQzlFO0lBQ0wsQ0FBQztJQUVNLDZCQUFTLEdBQWhCLFVBQWlCLFFBQWdCLEVBQUUsSUFBWTtRQUMzQyxPQUFPLHFCQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLEdBQUc7WUFDckMsT0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQztRQUFqRCxDQUFpRCxDQUNwRCxDQUFDO0lBQ04sQ0FBQztJQUNMLGdCQUFDO0FBQUQsQ0FBQyxBQXBDRCxJQW9DQztBQXBDWSw4QkFBUztBQXNDdEIsa0JBQWUsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERlcGVuZGVuY2llc0VuZ2luZSBmcm9tICcuL2RlcGVuZGVuY2llcy5lbmdpbmUnO1xuaW1wb3J0IEZpbGVFbmdpbmUgZnJvbSAnLi9maWxlLmVuZ2luZSc7XG5cbmNvbnN0IG5nZFQgPSByZXF1aXJlKCdAY29tcG9kb2MvbmdkLXRyYW5zZm9ybWVyJyk7XG5cbmV4cG9ydCBjbGFzcyBOZ2RFbmdpbmUge1xuICAgIHB1YmxpYyBlbmdpbmU7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogTmdkRW5naW5lO1xuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICghTmdkRW5naW5lLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBOZ2RFbmdpbmUuaW5zdGFuY2UgPSBuZXcgTmdkRW5naW5lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE5nZEVuZ2luZS5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdChvdXRwdXRwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5lbmdpbmUgPSBuZXcgbmdkVC5Eb3RFbmdpbmUoe1xuICAgICAgICAgICAgb3V0cHV0OiBvdXRwdXRwYXRoLFxuICAgICAgICAgICAgZGlzcGxheUxlZ2VuZDogdHJ1ZSxcbiAgICAgICAgICAgIG91dHB1dEZvcm1hdHM6ICdzdmcnLFxuICAgICAgICAgICAgc2lsZW50OiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXJHcmFwaChmaWxlcGF0aDogc3RyaW5nLCBvdXRwdXRwYXRoOiBzdHJpbmcsIHR5cGU6IHN0cmluZywgbmFtZT86IHN0cmluZykge1xuICAgICAgICB0aGlzLmVuZ2luZS51cGRhdGVPdXRwdXQob3V0cHV0cGF0aCk7XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICdmJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW5naW5lLmdlbmVyYXRlR3JhcGgoW0RlcGVuZGVuY2llc0VuZ2luZS5nZXRSYXdNb2R1bGUobmFtZSldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuZ2luZS5nZW5lcmF0ZUdyYXBoKERlcGVuZGVuY2llc0VuZ2luZS5yYXdNb2R1bGVzRm9yT3ZlcnZpZXcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlYWRHcmFwaChmaWxlcGF0aDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gRmlsZUVuZ2luZS5nZXQoZmlsZXBhdGgpLmNhdGNoKGVyciA9PlxuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yIGR1cmluZyBncmFwaCByZWFkICcgKyBuYW1lKVxuICAgICAgICApO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTmdkRW5naW5lLmdldEluc3RhbmNlKCk7XG4iXX0=