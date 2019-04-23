"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var FileEngine = /** @class */ (function () {
    function FileEngine() {
    }
    FileEngine.getInstance = function () {
        if (!FileEngine.instance) {
            FileEngine.instance = new FileEngine();
        }
        return FileEngine.instance;
    };
    FileEngine.prototype.get = function (filepath) {
        return new Promise(function (resolve, reject) {
            fs.readFile(path.resolve(filepath), 'utf8', function (err, data) {
                if (err) {
                    reject('Error during ' + filepath + ' read');
                }
                else {
                    resolve(data);
                }
            });
        });
    };
    FileEngine.prototype.write = function (filepath, contents) {
        return new Promise(function (resolve, reject) {
            fs.outputFile(path.resolve(filepath), contents, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    FileEngine.prototype.getSync = function (filepath) {
        return fs.readFileSync(path.resolve(filepath), 'utf8');
    };
    /**
     * @param file The file to check
     */
    FileEngine.prototype.existsSync = function (file) {
        return fs.existsSync(file);
    };
    return FileEngine;
}());
exports.FileEngine = FileEngine;
exports.default = FileEngine.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5lbmdpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9lbmdpbmVzL2ZpbGUuZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQStCO0FBQy9CLDJCQUE2QjtBQUU3QjtJQUVJO0lBQXVCLENBQUM7SUFDVixzQkFBVyxHQUF6QjtRQUNJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFO1lBQ3RCLFVBQVUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztTQUMxQztRQUNELE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQztJQUMvQixDQUFDO0lBRU0sd0JBQUcsR0FBVixVQUFXLFFBQWdCO1FBQ3ZCLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUMvQixFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQUMsR0FBRyxFQUFFLElBQUk7Z0JBQ2xELElBQUksR0FBRyxFQUFFO29CQUNMLE1BQU0sQ0FBQyxlQUFlLEdBQUcsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDO2lCQUNoRDtxQkFBTTtvQkFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2pCO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSwwQkFBSyxHQUFaLFVBQWEsUUFBZ0IsRUFBRSxRQUFnQjtRQUMzQyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxVQUFBLEdBQUc7Z0JBQy9DLElBQUksR0FBRyxFQUFFO29CQUNMLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDZjtxQkFBTTtvQkFDSCxPQUFPLEVBQUUsQ0FBQztpQkFDYjtZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sNEJBQU8sR0FBZCxVQUFlLFFBQWdCO1FBQzNCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7T0FFRztJQUNJLCtCQUFVLEdBQWpCLFVBQWtCLElBQVk7UUFDMUIsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDTCxpQkFBQztBQUFELENBQUMsQUE1Q0QsSUE0Q0M7QUE1Q1ksZ0NBQVU7QUE4Q3ZCLGtCQUFlLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBjbGFzcyBGaWxlRW5naW5lIHtcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogRmlsZUVuZ2luZTtcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgICAgICBpZiAoIUZpbGVFbmdpbmUuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIEZpbGVFbmdpbmUuaW5zdGFuY2UgPSBuZXcgRmlsZUVuZ2luZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBGaWxlRW5naW5lLmluc3RhbmNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQoZmlsZXBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBmcy5yZWFkRmlsZShwYXRoLnJlc29sdmUoZmlsZXBhdGgpLCAndXRmOCcsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgnRXJyb3IgZHVyaW5nICcgKyBmaWxlcGF0aCArICcgcmVhZCcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyB3cml0ZShmaWxlcGF0aDogc3RyaW5nLCBjb250ZW50czogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBmcy5vdXRwdXRGaWxlKHBhdGgucmVzb2x2ZShmaWxlcGF0aCksIGNvbnRlbnRzLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0U3luYyhmaWxlcGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoZmlsZXBhdGgpLCAndXRmOCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBmaWxlIFRoZSBmaWxlIHRvIGNoZWNrXG4gICAgICovXG4gICAgcHVibGljIGV4aXN0c1N5bmMoZmlsZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBmcy5leGlzdHNTeW5jKGZpbGUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRmlsZUVuZ2luZS5nZXRJbnN0YW5jZSgpO1xuIl19