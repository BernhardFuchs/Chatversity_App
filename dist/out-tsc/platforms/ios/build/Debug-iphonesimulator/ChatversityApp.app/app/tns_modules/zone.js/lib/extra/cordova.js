/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('cordova', function (global, Zone, api) {
    if (global.cordova) {
        var SUCCESS_SOURCE_1 = 'cordova.exec.success';
        var ERROR_SOURCE_1 = 'cordova.exec.error';
        var FUNCTION_1 = 'function';
        var nativeExec_1 = api.patchMethod(global.cordova, 'exec', function () { return function (self, args) {
            if (args.length > 0 && typeof args[0] === FUNCTION_1) {
                args[0] = Zone.current.wrap(args[0], SUCCESS_SOURCE_1);
            }
            if (args.length > 1 && typeof args[1] === FUNCTION_1) {
                args[1] = Zone.current.wrap(args[1], ERROR_SOURCE_1);
            }
            return nativeExec_1.apply(self, args);
        }; });
    }
});
Zone.__load_patch('cordova.FileReader', function (global, Zone) {
    if (global.cordova && typeof global['FileReader'] !== 'undefined') {
        document.addEventListener('deviceReady', function () {
            var FileReader = global['FileReader'];
            ['abort', 'error', 'load', 'loadstart', 'loadend', 'progress'].forEach(function (prop) {
                var eventNameSymbol = Zone.__symbol__('ON_PROPERTY' + prop);
                Object.defineProperty(FileReader.prototype, eventNameSymbol, {
                    configurable: true,
                    get: function () {
                        return this._realReader && this._realReader[eventNameSymbol];
                    }
                });
            });
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZG92YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvZXh0cmEvY29yZG92YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxVQUFDLE1BQVcsRUFBRSxJQUFjLEVBQUUsR0FBaUI7SUFDMUUsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO1FBQ2xCLElBQU0sZ0JBQWMsR0FBRyxzQkFBc0IsQ0FBQztRQUM5QyxJQUFNLGNBQVksR0FBRyxvQkFBb0IsQ0FBQztRQUMxQyxJQUFNLFVBQVEsR0FBRyxVQUFVLENBQUM7UUFDNUIsSUFBTSxZQUFVLEdBQ1osR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFNLE9BQUEsVUFBUyxJQUFTLEVBQUUsSUFBVztZQUMzRSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVEsRUFBRTtnQkFDbEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxnQkFBYyxDQUFDLENBQUM7YUFDdEQ7WUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVEsRUFBRTtnQkFDbEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxjQUFZLENBQUMsQ0FBQzthQUNwRDtZQUNELE9BQU8sWUFBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxFQVI2QyxDQVE3QyxDQUFDLENBQUM7S0FDUjtBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsRUFBRSxVQUFDLE1BQVcsRUFBRSxJQUFjO0lBQ2xFLElBQUksTUFBTSxDQUFDLE9BQU8sSUFBSSxPQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxXQUFXLEVBQUU7UUFDakUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRTtZQUN2QyxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDeEMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7Z0JBQ3pFLElBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxDQUFDO2dCQUM5RCxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxFQUFFO29CQUMzRCxZQUFZLEVBQUUsSUFBSTtvQkFDbEIsR0FBRyxFQUFFO3dCQUNILE9BQU8sSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUMvRCxDQUFDO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7S0FDSjtBQUNILENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuWm9uZS5fX2xvYWRfcGF0Y2goJ2NvcmRvdmEnLCAoZ2xvYmFsOiBhbnksIFpvbmU6IFpvbmVUeXBlLCBhcGk6IF9ab25lUHJpdmF0ZSkgPT4ge1xuICBpZiAoZ2xvYmFsLmNvcmRvdmEpIHtcbiAgICBjb25zdCBTVUNDRVNTX1NPVVJDRSA9ICdjb3Jkb3ZhLmV4ZWMuc3VjY2Vzcyc7XG4gICAgY29uc3QgRVJST1JfU09VUkNFID0gJ2NvcmRvdmEuZXhlYy5lcnJvcic7XG4gICAgY29uc3QgRlVOQ1RJT04gPSAnZnVuY3Rpb24nO1xuICAgIGNvbnN0IG5hdGl2ZUV4ZWM6IEZ1bmN0aW9ufG51bGwgPVxuICAgICAgICBhcGkucGF0Y2hNZXRob2QoZ2xvYmFsLmNvcmRvdmEsICdleGVjJywgKCkgPT4gZnVuY3Rpb24oc2VsZjogYW55LCBhcmdzOiBhbnlbXSkge1xuICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IDAgJiYgdHlwZW9mIGFyZ3NbMF0gPT09IEZVTkNUSU9OKSB7XG4gICAgICAgICAgICBhcmdzWzBdID0gWm9uZS5jdXJyZW50LndyYXAoYXJnc1swXSwgU1VDQ0VTU19TT1VSQ0UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAxICYmIHR5cGVvZiBhcmdzWzFdID09PSBGVU5DVElPTikge1xuICAgICAgICAgICAgYXJnc1sxXSA9IFpvbmUuY3VycmVudC53cmFwKGFyZ3NbMV0sIEVSUk9SX1NPVVJDRSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuYXRpdmVFeGVjIS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gIH1cbn0pO1xuXG5ab25lLl9fbG9hZF9wYXRjaCgnY29yZG92YS5GaWxlUmVhZGVyJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSkgPT4ge1xuICBpZiAoZ2xvYmFsLmNvcmRvdmEgJiYgdHlwZW9mIGdsb2JhbFsnRmlsZVJlYWRlciddICE9PSAndW5kZWZpbmVkJykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZVJlYWR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgRmlsZVJlYWRlciA9IGdsb2JhbFsnRmlsZVJlYWRlciddO1xuICAgICAgWydhYm9ydCcsICdlcnJvcicsICdsb2FkJywgJ2xvYWRzdGFydCcsICdsb2FkZW5kJywgJ3Byb2dyZXNzJ10uZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgY29uc3QgZXZlbnROYW1lU3ltYm9sID0gWm9uZS5fX3N5bWJvbF9fKCdPTl9QUk9QRVJUWScgKyBwcm9wKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZpbGVSZWFkZXIucHJvdG90eXBlLCBldmVudE5hbWVTeW1ib2wsIHtcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWFsUmVhZGVyICYmIHRoaXMuX3JlYWxSZWFkZXJbZXZlbnROYW1lU3ltYm9sXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn0pO1xuIl19