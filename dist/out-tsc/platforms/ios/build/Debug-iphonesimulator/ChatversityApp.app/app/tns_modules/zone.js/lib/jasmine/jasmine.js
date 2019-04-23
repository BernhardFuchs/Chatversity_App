/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
'use strict';
(function () {
    var __extends = function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
    var _global = typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global;
    // Patch jasmine's describe/it/beforeEach/afterEach functions so test code always runs
    // in a testZone (ProxyZone). (See: angular/zone.js#91 & angular/angular#10503)
    if (!Zone)
        throw new Error('Missing: zone.js');
    if (typeof jasmine == 'undefined')
        throw new Error('Missing: jasmine.js');
    if (jasmine['__zone_patch__'])
        throw new Error("'jasmine' has already been patched with 'Zone'.");
    jasmine['__zone_patch__'] = true;
    var SyncTestZoneSpec = Zone['SyncTestZoneSpec'];
    var ProxyZoneSpec = Zone['ProxyZoneSpec'];
    if (!SyncTestZoneSpec)
        throw new Error('Missing: SyncTestZoneSpec');
    if (!ProxyZoneSpec)
        throw new Error('Missing: ProxyZoneSpec');
    var ambientZone = Zone.current;
    // Create a synchronous-only zone in which to run `describe` blocks in order to raise an
    // error if any asynchronous operations are attempted inside of a `describe` but outside of
    // a `beforeEach` or `it`.
    var syncZone = ambientZone.fork(new SyncTestZoneSpec('jasmine.describe'));
    var symbol = Zone.__symbol__;
    // whether patch jasmine clock when in fakeAsync
    var enableClockPatch = _global[symbol('fakeAsyncPatchLock')] === true;
    // Monkey patch all of the jasmine DSL so that each function runs in appropriate zone.
    var jasmineEnv = jasmine.getEnv();
    ['describe', 'xdescribe', 'fdescribe'].forEach(function (methodName) {
        var originalJasmineFn = jasmineEnv[methodName];
        jasmineEnv[methodName] = function (description, specDefinitions) {
            return originalJasmineFn.call(this, description, wrapDescribeInZone(specDefinitions));
        };
    });
    ['it', 'xit', 'fit'].forEach(function (methodName) {
        var originalJasmineFn = jasmineEnv[methodName];
        jasmineEnv[symbol(methodName)] = originalJasmineFn;
        jasmineEnv[methodName] = function (description, specDefinitions, timeout) {
            arguments[1] = wrapTestInZone(specDefinitions);
            return originalJasmineFn.apply(this, arguments);
        };
    });
    ['beforeEach', 'afterEach', 'beforeAll', 'afterAll'].forEach(function (methodName) {
        var originalJasmineFn = jasmineEnv[methodName];
        jasmineEnv[symbol(methodName)] = originalJasmineFn;
        jasmineEnv[methodName] = function (specDefinitions, timeout) {
            arguments[0] = wrapTestInZone(specDefinitions);
            return originalJasmineFn.apply(this, arguments);
        };
    });
    // need to patch jasmine.clock().mockDate and jasmine.clock().tick() so
    // they can work properly in FakeAsyncTest
    var originalClockFn = (jasmine[symbol('clock')] = jasmine['clock']);
    jasmine['clock'] = function () {
        var clock = originalClockFn.apply(this, arguments);
        if (!clock[symbol('patched')]) {
            clock[symbol('patched')] = symbol('patched');
            var originalTick_1 = (clock[symbol('tick')] = clock.tick);
            clock.tick = function () {
                var fakeAsyncZoneSpec = Zone.current.get('FakeAsyncTestZoneSpec');
                if (fakeAsyncZoneSpec) {
                    return fakeAsyncZoneSpec.tick.apply(fakeAsyncZoneSpec, arguments);
                }
                return originalTick_1.apply(this, arguments);
            };
            var originalMockDate_1 = (clock[symbol('mockDate')] = clock.mockDate);
            clock.mockDate = function () {
                var fakeAsyncZoneSpec = Zone.current.get('FakeAsyncTestZoneSpec');
                if (fakeAsyncZoneSpec) {
                    var dateTime = arguments.length > 0 ? arguments[0] : new Date();
                    return fakeAsyncZoneSpec.setCurrentRealTime.apply(fakeAsyncZoneSpec, dateTime && typeof dateTime.getTime === 'function' ? [dateTime.getTime()] :
                        arguments);
                }
                return originalMockDate_1.apply(this, arguments);
            };
            // for auto go into fakeAsync feature, we need the flag to enable it
            if (enableClockPatch) {
                ['install', 'uninstall'].forEach(function (methodName) {
                    var originalClockFn = (clock[symbol(methodName)] = clock[methodName]);
                    clock[methodName] = function () {
                        var FakeAsyncTestZoneSpec = Zone['FakeAsyncTestZoneSpec'];
                        if (FakeAsyncTestZoneSpec) {
                            jasmine[symbol('clockInstalled')] = 'install' === methodName;
                            return;
                        }
                        return originalClockFn.apply(this, arguments);
                    };
                });
            }
        }
        return clock;
    };
    /**
     * Gets a function wrapping the body of a Jasmine `describe` block to execute in a
     * synchronous-only zone.
     */
    function wrapDescribeInZone(describeBody) {
        return function () {
            return syncZone.run(describeBody, this, arguments);
        };
    }
    function runInTestZone(testBody, applyThis, queueRunner, done) {
        var isClockInstalled = !!jasmine[symbol('clockInstalled')];
        var testProxyZoneSpec = queueRunner.testProxyZoneSpec;
        var testProxyZone = queueRunner.testProxyZone;
        var lastDelegate;
        if (isClockInstalled && enableClockPatch) {
            // auto run a fakeAsync
            var fakeAsyncModule = Zone[Zone.__symbol__('fakeAsyncTest')];
            if (fakeAsyncModule && typeof fakeAsyncModule.fakeAsync === 'function') {
                testBody = fakeAsyncModule.fakeAsync(testBody);
            }
        }
        if (done) {
            return testProxyZone.run(testBody, applyThis, [done]);
        }
        else {
            return testProxyZone.run(testBody, applyThis);
        }
    }
    /**
     * Gets a function wrapping the body of a Jasmine `it/beforeEach/afterEach` block to
     * execute in a ProxyZone zone.
     * This will run in `testProxyZone`. The `testProxyZone` will be reset by the `ZoneQueueRunner`
     */
    function wrapTestInZone(testBody) {
        // The `done` callback is only passed through if the function expects at least one argument.
        // Note we have to make a function with correct number of arguments, otherwise jasmine will
        // think that all functions are sync or async.
        return (testBody && (testBody.length ? function (done) {
            return runInTestZone(testBody, this, this.queueRunner, done);
        } : function () {
            return runInTestZone(testBody, this, this.queueRunner);
        }));
    }
    var QueueRunner = jasmine.QueueRunner;
    jasmine.QueueRunner = (function (_super) {
        __extends(ZoneQueueRunner, _super);
        function ZoneQueueRunner(attrs) {
            var _this = this;
            attrs.onComplete = (function (fn) { return function () {
                // All functions are done, clear the test zone.
                _this.testProxyZone = null;
                _this.testProxyZoneSpec = null;
                ambientZone.scheduleMicroTask('jasmine.onComplete', fn);
            }; })(attrs.onComplete);
            var nativeSetTimeout = _global['__zone_symbol__setTimeout'];
            var nativeClearTimeout = _global['__zone_symbol__clearTimeout'];
            if (nativeSetTimeout) {
                // should run setTimeout inside jasmine outside of zone
                attrs.timeout = {
                    setTimeout: nativeSetTimeout ? nativeSetTimeout : _global.setTimeout,
                    clearTimeout: nativeClearTimeout ? nativeClearTimeout : _global.clearTimeout
                };
            }
            // create a userContext to hold the queueRunner itself
            // so we can access the testProxy in it/xit/beforeEach ...
            if (jasmine.UserContext) {
                if (!attrs.userContext) {
                    attrs.userContext = new jasmine.UserContext();
                }
                attrs.userContext.queueRunner = this;
            }
            else {
                if (!attrs.userContext) {
                    attrs.userContext = {};
                }
                attrs.userContext.queueRunner = this;
            }
            // patch attrs.onException
            var onException = attrs.onException;
            attrs.onException = function (error) {
                if (error &&
                    error.message ===
                        'Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.') {
                    // jasmine timeout, we can make the error message more
                    // reasonable to tell what tasks are pending
                    var proxyZoneSpec = this && this.testProxyZoneSpec;
                    if (proxyZoneSpec) {
                        var pendingTasksInfo = proxyZoneSpec.getAndClearPendingTasksInfo();
                        error.message += pendingTasksInfo;
                    }
                }
                if (onException) {
                    onException.call(this, error);
                }
            };
            _super.call(this, attrs);
        }
        ZoneQueueRunner.prototype.execute = function () {
            var _this = this;
            var zone = Zone.current;
            var isChildOfAmbientZone = false;
            while (zone) {
                if (zone === ambientZone) {
                    isChildOfAmbientZone = true;
                    break;
                }
                zone = zone.parent;
            }
            if (!isChildOfAmbientZone)
                throw new Error('Unexpected Zone: ' + Zone.current.name);
            // This is the zone which will be used for running individual tests.
            // It will be a proxy zone, so that the tests function can retroactively install
            // different zones.
            // Example:
            //   - In beforeEach() do childZone = Zone.current.fork(...);
            //   - In it() try to do fakeAsync(). The issue is that because the beforeEach forked the
            //     zone outside of fakeAsync it will be able to escape the fakeAsync rules.
            //   - Because ProxyZone is parent fo `childZone` fakeAsync can retroactively add
            //     fakeAsync behavior to the childZone.
            this.testProxyZoneSpec = new ProxyZoneSpec();
            this.testProxyZone = ambientZone.fork(this.testProxyZoneSpec);
            if (!Zone.currentTask) {
                // if we are not running in a task then if someone would register a
                // element.addEventListener and then calling element.click() the
                // addEventListener callback would think that it is the top most task and would
                // drain the microtask queue on element.click() which would be incorrect.
                // For this reason we always force a task when running jasmine tests.
                Zone.current.scheduleMicroTask('jasmine.execute().forceTask', function () { return QueueRunner.prototype.execute.call(_this); });
            }
            else {
                _super.prototype.execute.call(this);
            }
        };
        return ZoneQueueRunner;
    })(QueueRunner);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamFzbWluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvamFzbWluZS9qYXNtaW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILFlBQVksQ0FBQztBQUNiLENBQUM7SUFDQyxJQUFNLFNBQVMsR0FBRyxVQUFTLENBQU0sRUFBRSxDQUFNO1FBQ3ZDLEtBQUssSUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxTQUFTLEVBQUU7WUFDVCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBQ0QsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSyxFQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ2xHLENBQUMsQ0FBQztJQUNGLElBQU0sT0FBTyxHQUNULE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksSUFBSSxNQUFNLENBQUM7SUFDN0Ysc0ZBQXNGO0lBQ3RGLCtFQUErRTtJQUMvRSxJQUFJLENBQUMsSUFBSTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUMvQyxJQUFJLE9BQU8s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Q0FBQzthQUNwRjtpQkFBTTtnQkFDTCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDckM7UUFDSCxDQUFDLENBQUM7UUFDRixPQUFPLGVBQWUsQ0FBQztJQUN6QixDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNsQixDQUFDLENBQUMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG4oKCkgPT4ge1xuICBjb25zdCBfX2V4dGVuZHMgPSBmdW5jdGlvbihkOiBhbnksIGI6IGFueSkge1xuICAgIGZvciAoY29uc3QgcCBpbiBiKVxuICAgICAgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkge1xuICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7XG4gICAgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlKSwgbmV3IChfXyBhcyBhbnkpKCkpO1xuICB9O1xuICBjb25zdCBfZ2xvYmFsOiBhbnkgPVxuICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93IHx8IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmIHx8IGdsb2JhbDtcbiAgLy8gUGF0Y2ggamFzbWluZSdzIGRlc2NyaWJlL2l0L2JlZm9yZUVhY2gvYWZ0ZXJFYWNoIGZ1bmN0aW9ucyBzbyB0ZXN0IGNvZGUgYWx3YXlzIHJ1bnNcbiAgLy8gaW4gYSB0ZXN0Wm9uZSAoUHJveHlab25lKS4gKFNlZTogYW5ndWxhci96b25lLmpzIzkxICYgYW5ndWxhci9hbmd1bGFyIzEwNTAzKVxuICBpZiAoIVpvbmUpIHRocm93IG5ldyBFcnJvcignTWlzc2luZzogem9uZS5qcycpO1xuICBpZiAodHlwZW9mIGphc21pbmUgPT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBFcnJvcignTWlzc2luZzogamFzbWluZS5qcycpO1xuICBpZiAoKGphc21pbmUgYXMgYW55KVsnX196b25lX3BhdGNoX18nXSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCdqYXNtaW5lJyBoYXMgYWxyZWFkeSBiZWVuIHBhdGNoZWQgd2l0aCAnWm9uZScuYCk7XG4gIChqYXNtaW5lIGFzIGFueSlbJ19fem9uZV9wYXRjaF9fJ10gPSB0cnVlO1xuXG4gIGNvbnN0IFN5bmNUZXN0Wm9uZVNwZWM6IHtuZXcgKG5hbWU6IHN0cmluZyk6IFpvbmVTcGVjfSA9IChab25lIGFzIGFueSlbJ1N5bmNUZXN0Wm9uZVNwZWMnXTtcbiAgY29uc3QgUHJveHlab25lU3BlYzoge25ldyAoKTogWm9uZVNwZWN9ID0gKFpvbmUgYXMgYW55KVsnUHJveHlab25lU3BlYyddO1xuICBpZiAoIVN5bmNUZXN0Wm9uZVNwZWMpIHRocm93IG5ldyBFcnJvcignTWlzc2luZzogU3luY1Rlc3Rab25lU3BlYycpO1xuICBpZiAoIVByb3h5Wm9uZVNwZWMpIHRocm93IG5ldyBFcnJvcignTWlzc2luZzogUHJveHlab25lU3BlYycpO1xuXG4gIGNvbnN0IGFtYmllbnRab25lID0gWm9uZS5jdXJyZW50O1xuICAvLyBDcmVhdGUgYSBzeW5jaHJvbm91cy1vbmx5IHpvbmUgaW4gd2hpY2ggdG8gcnVuIGBkZXNjcmliZWAgYmxvY2tzIGluIG9yZGVyIHRvIHJhaXNlIGFuXG4gIC8vIGVycm9yIGlmIGFueSBhc3luY2hyb25vdXMgb3BlcmF0aW9ucyBhcmUgYXR0ZW1wdGVkIGluc2lkZSBvZiBhIGBkZXNjcmliZWAgYnV0IG91dHNpZGUgb2ZcbiAgLy8gYSBgYmVmb3JlRWFjaGAgb3IgYGl0YC5cbiAgY29uc3Qgc3luY1pvbmUgPSBhbWJpZW50Wm9uZS5mb3JrKG5ldyBTeW5jVGVzdFpvbmVTcGVjKCdqYXNtaW5lLmRlc2NyaWJlJykpO1xuXG4gIGNvbnN0IHN5bWJvbCA9IFpvbmUuX19zeW1ib2xfXztcblxuICAvLyB3aGV0aGVyIHBhdGNoIGphc21pbmUgY2xvY2sgd2hlbiBpbiBmYWtlQXN5bmNcbiAgY29uc3QgZW5hYmxlQ2xvY2tQYXRjaCA9IF9nbG9iYWxbc3ltYm9sKCdmYWtlQXN5bmNQYXRjaExvY2snKV0gPT09IHRydWU7XG5cbiAgLy8gTW9ua2V5IHBhdGNoIGFsbCBvZiB0aGUgamFzbWluZSBEU0wgc28gdGhhdCBlYWNoIGZ1bmN0aW9uIHJ1bnMgaW4gYXBwcm9wcmlhdGUgem9uZS5cbiAgY29uc3QgamFzbWluZUVudjogYW55ID0gamFzbWluZS5nZXRFbnYoKTtcbiAgWydkZXNjcmliZScsICd4ZGVzY3JpYmUnLCAnZmRlc2NyaWJlJ10uZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICBsZXQgb3JpZ2luYWxKYXNtaW5lRm46IEZ1bmN0aW9uID0gamFzbWluZUVudlttZXRob2ROYW1lXTtcbiAgICBqYXNtaW5lRW52W21ldGhvZE5hbWVdID0gZnVuY3Rpb24oZGVzY3JpcHRpb246IHN0cmluZywgc3BlY0RlZmluaXRpb25zOiBGdW5jdGlvbikge1xuICAgICAgcmV0dXJuIG9yaWdpbmFsSmFzbWluZUZuLmNhbGwodGhpcywgZGVzY3JpcHRpb24sIHdyYXBEZXNjcmliZUluWm9uZShzcGVjRGVmaW5pdGlvbnMpKTtcbiAgICB9O1xuICB9KTtcbiAgWydpdCcsICd4aXQnLCAnZml0J10uZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICBsZXQgb3JpZ2luYWxKYXNtaW5lRm46IEZ1bmN0aW9uID0gamFzbWluZUVudlttZXRob2ROYW1lXTtcbiAgICBqYXNtaW5lRW52W3N5bWJvbChtZXRob2ROYW1lKV0gPSBvcmlnaW5hbEphc21pbmVGbjtcbiAgICBqYXNtaW5lRW52W21ldGhvZE5hbWVdID0gZnVuY3Rpb24oXG4gICAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsIHNwZWNEZWZpbml0aW9uczogRnVuY3Rpb24sIHRpbWVvdXQ6IG51bWJlcikge1xuICAgICAgYXJndW1lbnRzWzFdID0gd3JhcFRlc3RJblpvbmUoc3BlY0RlZmluaXRpb25zKTtcbiAgICAgIHJldHVybiBvcmlnaW5hbEphc21pbmVGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH0pO1xuICBbJ2JlZm9yZUVhY2gnLCAnYWZ0ZXJFYWNoJywgJ2JlZm9yZUFsbCcsICdhZnRlckFsbCddLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgbGV0IG9yaWdpbmFsSmFzbWluZUZuOiBGdW5jdGlvbiA9IGphc21pbmVFbnZbbWV0aG9kTmFtZV07XG4gICAgamFzbWluZUVudltzeW1ib2wobWV0aG9kTmFtZSldID0gb3JpZ2luYWxKYXNtaW5lRm47XG4gICAgamFzbWluZUVudlttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKHNwZWNEZWZpbml0aW9uczogRnVuY3Rpb24sIHRpbWVvdXQ6IG51bWJlcikge1xuICAgICAgYXJndW1lbnRzWzBdID0gd3JhcFRlc3RJblpvbmUoc3BlY0RlZmluaXRpb25zKTtcbiAgICAgIHJldHVybiBvcmlnaW5hbEphc21pbmVGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIG5lZWQgdG8gcGF0Y2ggamFzbWluZS5jbG9jaygpLm1vY2tEYXRlIGFuZCBqYXNtaW5lLmNsb2NrKCkudGljaygpIHNvXG4gIC8vIHRoZXkgY2FuIHdvcmsgcHJvcGVybHkgaW4gRmFrZUFzeW5jVGVzdFxuICBjb25zdCBvcmlnaW5hbENsb2NrRm46IEZ1bmN0aW9uID0gKChqYXNtaW5lIGFzIGFueSlbc3ltYm9sKCdjbG9jaycpXSA9IGphc21pbmVbJ2Nsb2NrJ10pO1xuICAoamFzbWluZSBhcyBhbnkpWydjbG9jayddID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgY2xvY2sgPSBvcmlnaW5hbENsb2NrRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoIWNsb2NrW3N5bWJvbCgncGF0Y2hlZCcpXSkge1xuICAgICAgY2xvY2tbc3ltYm9sKCdwYXRjaGVkJyldID0gc3ltYm9sKCdwYXRjaGVkJyk7XG4gICAgICBjb25zdCBvcmlnaW5hbFRpY2sgPSAoY2xvY2tbc3ltYm9sKCd0aWNrJyldID0gY2xvY2sudGljayk7XG4gICAgICBjbG9jay50aWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGZha2VBc3luY1pvbmVTcGVjID0gWm9uZS5jdXJyZW50LmdldCgnRmFrZUFzeW5jVGVzdFpvbmVTcGVjJyk7XG4gICAgICAgIGlmIChmYWtlQXN5bmNab25lU3BlYykge1xuICAgICAgICAgIHJldHVybiBmYWtlQXN5bmNab25lU3BlYy50aWNrLmFwcGx5KGZha2VBc3luY1pvbmVTcGVjLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcmlnaW5hbFRpY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBvcmlnaW5hbE1vY2tEYXRlID0gKGNsb2NrW3N5bWJvbCgnbW9ja0RhdGUnKV0gPSBjbG9jay5tb2NrRGF0ZSk7XG4gICAgICBjbG9jay5tb2NrRGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBmYWtlQXN5bmNab25lU3BlYyA9IFpvbmUuY3VycmVudC5nZXQoJ0Zha2VBc3luY1Rlc3Rab25lU3BlYycpO1xuICAgICAgICBpZiAoZmFrZUFzeW5jWm9uZVNwZWMpIHtcbiAgICAgICAgICBjb25zdCBkYXRlVGltZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogbmV3IERhdGUoKTtcbiAgICAgICAgICByZXR1cm4gZmFrZUFzeW5jWm9uZVNwZWMuc2V0Q3VycmVudFJlYWxUaW1lLmFwcGx5KFxuICAgICAgICAgICAgICBmYWtlQXN5bmNab25lU3BlYyxcbiAgICAgICAgICAgICAgZGF0ZVRpbWUgJiYgdHlwZW9mIGRhdGVUaW1lLmdldFRpbWUgPT09ICdmdW5jdGlvbicgPyBbZGF0ZVRpbWUuZ2V0VGltZSgpXSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxNb2NrRGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICAgIC8vIGZvciBhdXRvIGdvIGludG8gZmFrZUFzeW5jIGZlYXR1cmUsIHdlIG5lZWQgdGhlIGZsYWcgdG8gZW5hYmxlIGl0XG4gICAgICBpZiAoZW5hYmxlQ2xvY2tQYXRjaCkge1xuICAgICAgICBbJ2luc3RhbGwnLCAndW5pbnN0YWxsJ10uZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICAgICAgICBjb25zdCBvcmlnaW5hbENsb2NrRm46IEZ1bmN0aW9uID0gKGNsb2NrW3N5bWJvbChtZXRob2ROYW1lKV0gPSBjbG9ja1ttZXRob2ROYW1lXSk7XG4gICAgICAgICAgY2xvY2tbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IEZha2VBc3luY1Rlc3Rab25lU3BlYyA9IChab25lIGFzIGFueSlbJ0Zha2VBc3luY1Rlc3Rab25lU3BlYyddO1xuICAgICAgICAgICAgaWYgKEZha2VBc3luY1Rlc3Rab25lU3BlYykge1xuICAgICAgICAgICAgICAoamFzbWluZSBhcyBhbnkpW3N5bWJvbCgnY2xvY2tJbnN0YWxsZWQnKV0gPSAnaW5zdGFsbCcgPT09IG1ldGhvZE5hbWU7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbENsb2NrRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNsb2NrO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgZnVuY3Rpb24gd3JhcHBpbmcgdGhlIGJvZHkgb2YgYSBKYXNtaW5lIGBkZXNjcmliZWAgYmxvY2sgdG8gZXhlY3V0ZSBpbiBhXG4gICAqIHN5bmNocm9ub3VzLW9ubHkgem9uZS5cbiAgICovXG4gIGZ1bmN0aW9uIHdyYXBEZXNjcmliZUluWm9uZShkZXNjcmliZUJvZHk6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzeW5jWm9uZS5ydW4oZGVzY3JpYmVCb2R5LCB0aGlzLCAoYXJndW1lbnRzIGFzIGFueSkgYXMgYW55W10pO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBydW5JblRlc3Rab25lKHRlc3RCb2R5OiBGdW5jdGlvbiwgYXBwbHlUaGlzOiBhbnksIHF1ZXVlUnVubmVyOiBhbnksIGRvbmU/OiBGdW5jdGlvbikge1xuICAgIGNvbnN0IGlzQ2xvY2tJbnN0YWxsZWQgPSAhIShqYXNtaW5lIGFzIGFueSlbc3ltYm9sKCdjbG9ja0luc3RhbGxlZCcpXTtcbiAgICBjb25zdCB0ZXN0UHJveHlab25lU3BlYyA9IHF1ZXVlUnVubmVyLnRlc3RQcm94eVpvbmVTcGVjO1xuICAgIGNvbnN0IHRlc3RQcm94eVpvbmUgPSBxdWV1ZVJ1bm5lci50ZXN0UHJveHlab25lO1xuICAgIGxldCBsYXN0RGVsZWdhdGU7XG4gICAgaWYgKGlzQ2xvY2tJbnN0YWxsZWQgJiYgZW5hYmxlQ2xvY2tQYXRjaCkge1xuICAgICAgLy8gYXV0byBydW4gYSBmYWtlQXN5bmNcbiAgICAgIGNvbnN0IGZha2VBc3luY01vZHVsZSA9IChab25lIGFzIGFueSlbWm9uZS5fX3N5bWJvbF9fKCdmYWtlQXN5bmNUZXN0JyldO1xuICAgICAgaWYgKGZha2VBc3luY01vZHVsZSAmJiB0eXBlb2YgZmFrZUFzeW5jTW9kdWxlLmZha2VBc3luYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0ZXN0Qm9keSA9IGZha2VBc3luY01vZHVsZS5mYWtlQXN5bmModGVzdEJvZHkpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZG9uZSkge1xuICAgICAgcmV0dXJuIHRlc3RQcm94eVpvbmUucnVuKHRlc3RCb2R5LCBhcHBseVRoaXMsIFtkb25lXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXN0UHJveHlab25lLnJ1bih0ZXN0Qm9keSwgYXBwbHlUaGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIGZ1bmN0aW9uIHdyYXBwaW5nIHRoZSBib2R5IG9mIGEgSmFzbWluZSBgaXQvYmVmb3JlRWFjaC9hZnRlckVhY2hgIGJsb2NrIHRvXG4gICAqIGV4ZWN1dGUgaW4gYSBQcm94eVpvbmUgem9uZS5cbiAgICogVGhpcyB3aWxsIHJ1biBpbiBgdGVzdFByb3h5Wm9uZWAuIFRoZSBgdGVzdFByb3h5Wm9uZWAgd2lsbCBiZSByZXNldCBieSB0aGUgYFpvbmVRdWV1ZVJ1bm5lcmBcbiAgICovXG4gIGZ1bmN0aW9uIHdyYXBUZXN0SW5ab25lKHRlc3RCb2R5OiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgICAvLyBUaGUgYGRvbmVgIGNhbGxiYWNrIGlzIG9ubHkgcGFzc2VkIHRocm91Z2ggaWYgdGhlIGZ1bmN0aW9uIGV4cGVjdHMgYXQgbGVhc3Qgb25lIGFyZ3VtZW50LlxuICAgIC8vIE5vdGUgd2UgaGF2ZSB0byBtYWtlIGEgZnVuY3Rpb24gd2l0aCBjb3JyZWN0IG51bWJlciBvZiBhcmd1bWVudHMsIG90aGVyd2lzZSBqYXNtaW5lIHdpbGxcbiAgICAvLyB0aGluayB0aGF0IGFsbCBmdW5jdGlvbnMgYXJlIHN5bmMgb3IgYXN5bmMuXG4gICAgcmV0dXJuICh0ZXN0Qm9keSAmJiAodGVzdEJvZHkubGVuZ3RoID8gZnVuY3Rpb24oZG9uZTogRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJ1bkluVGVzdFpvbmUodGVzdEJvZHksIHRoaXMsIHRoaXMucXVldWVSdW5uZXIsIGRvbmUpO1xuICAgICAgICAgICAgfSA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gcnVuSW5UZXN0Wm9uZSh0ZXN0Qm9keSwgdGhpcywgdGhpcy5xdWV1ZVJ1bm5lcik7XG4gICAgICAgICAgICB9KSk7XG4gIH1cbiAgaW50ZXJmYWNlIFF1ZXVlUnVubmVyIHtcbiAgICBleGVjdXRlKCk6IHZvaWQ7XG4gIH1cbiAgaW50ZXJmYWNlIFF1ZXVlUnVubmVyQXR0cnMge1xuICAgIHF1ZXVlYWJsZUZuczoge2ZuOiBGdW5jdGlvbn1bXTtcbiAgICBvbkNvbXBsZXRlOiAoKSA9PiB2b2lkO1xuICAgIGNsZWFyU3RhY2s6IChmbjogYW55KSA9PiB2b2lkO1xuICAgIG9uRXhjZXB0aW9uOiAoZXJyb3I6IGFueSkgPT4gdm9pZDtcbiAgICBjYXRjaEV4Y2VwdGlvbjogKCkgPT4gYm9vbGVhbjtcbiAgICB1c2VyQ29udGV4dDogYW55O1xuICAgIHRpbWVvdXQ6IHtzZXRUaW1lb3V0OiBGdW5jdGlvbjsgY2xlYXJUaW1lb3V0OiBGdW5jdGlvbn07XG4gICAgZmFpbDogKCkgPT4gdm9pZDtcbiAgfVxuXG4gIGNvbnN0IFF1ZXVlUnVubmVyID0gKGphc21pbmUgYXMgYW55KS5RdWV1ZVJ1bm5lciBhcyB7XG4gICAgbmV3IChhdHRyczogUXVldWVSdW5uZXJBdHRycyk6IFF1ZXVlUnVubmVyO1xuICB9O1xuICAoamFzbWluZSBhcyBhbnkpLlF1ZXVlUnVubmVyID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhab25lUXVldWVSdW5uZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gWm9uZVF1ZXVlUnVubmVyKGF0dHJzOiB7XG4gICAgICBvbkNvbXBsZXRlOiBGdW5jdGlvbjtcbiAgICAgIHVzZXJDb250ZXh0PzogYW55O1xuICAgICAgdGltZW91dD86IHtzZXRUaW1lb3V0OiBGdW5jdGlvbjsgY2xlYXJUaW1lb3V0OiBGdW5jdGlvbn07XG4gICAgICBvbkV4Y2VwdGlvbj86IChlcnJvcjogYW55KSA9PiB2b2lkO1xuICAgIH0pIHtcbiAgICAgIGF0dHJzLm9uQ29tcGxldGUgPSAoZm4gPT4gKCkgPT4ge1xuICAgICAgICAvLyBBbGwgZnVuY3Rpb25zIGFyZSBkb25lLCBjbGVhciB0aGUgdGVzdCB6b25lLlxuICAgICAgICB0aGlzLnRlc3RQcm94eVpvbmUgPSBudWxsO1xuICAgICAgICB0aGlzLnRlc3RQcm94eVpvbmVTcGVjID0gbnVsbDtcbiAgICAgICAgYW1iaWVudFpvbmUuc2NoZWR1bGVNaWNyb1Rhc2soJ2phc21pbmUub25Db21wbGV0ZScsIGZuKTtcbiAgICAgIH0pKGF0dHJzLm9uQ29tcGxldGUpO1xuXG4gICAgICBjb25zdCBuYXRpdmVTZXRUaW1lb3V0ID0gX2dsb2JhbFsnX196b25lX3N5bWJvbF9fc2V0VGltZW91dCddO1xuICAgICAgY29uc3QgbmF0aXZlQ2xlYXJUaW1lb3V0ID0gX2dsb2JhbFsnX196b25lX3N5bWJvbF9fY2xlYXJUaW1lb3V0J107XG4gICAgICBpZiAobmF0aXZlU2V0VGltZW91dCkge1xuICAgICAgICAvLyBzaG91bGQgcnVuIHNldFRpbWVvdXQgaW5zaWRlIGphc21pbmUgb3V0c2lkZSBvZiB6b25lXG4gICAgICAgIGF0dHJzLnRpbWVvdXQgPSB7XG4gICAgICAgICAgc2V0VGltZW91dDogbmF0aXZlU2V0VGltZW91dCA/IG5hdGl2ZVNldFRpbWVvdXQgOiBfZ2xvYmFsLnNldFRpbWVvdXQsXG4gICAgICAgICAgY2xlYXJUaW1lb3V0OiBuYXRpdmVDbGVhclRpbWVvdXQgPyBuYXRpdmVDbGVhclRpbWVvdXQgOiBfZ2xvYmFsLmNsZWFyVGltZW91dFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLyBjcmVhdGUgYSB1c2VyQ29udGV4dCB0byBob2xkIHRoZSBxdWV1ZVJ1bm5lciBpdHNlbGZcbiAgICAgIC8vIHNvIHdlIGNhbiBhY2Nlc3MgdGhlIHRlc3RQcm94eSBpbiBpdC94aXQvYmVmb3JlRWFjaCAuLi5cbiAgICAgIGlmICgoamFzbWluZSBhcyBhbnkpLlVzZXJDb250ZXh0KSB7XG4gICAgICAgIGlmICghYXR0cnMudXNlckNvbnRleHQpIHtcbiAgICAgICAgICBhdHRycy51c2VyQ29udGV4dCA9IG5ldyAoamFzbWluZSBhcyBhbnkpLlVzZXJDb250ZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgYXR0cnMudXNlckNvbnRleHQucXVldWVSdW5uZXIgPSB0aGlzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFhdHRycy51c2VyQ29udGV4dCkge1xuICAgICAgICAgIGF0dHJzLnVzZXJDb250ZXh0ID0ge307XG4gICAgICAgIH1cbiAgICAgICAgYXR0cnMudXNlckNvbnRleHQucXVldWVSdW5uZXIgPSB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBwYXRjaCBhdHRycy5vbkV4Y2VwdGlvblxuICAgICAgY29uc3Qgb25FeGNlcHRpb24gPSBhdHRycy5vbkV4Y2VwdGlvbjtcbiAgICAgIGF0dHJzLm9uRXhjZXB0aW9uID0gZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuICAgICAgICBpZiAoZXJyb3IgJiZcbiAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPT09XG4gICAgICAgICAgICAgICAgJ1RpbWVvdXQgLSBBc3luYyBjYWxsYmFjayB3YXMgbm90IGludm9rZWQgd2l0aGluIHRpbWVvdXQgc3BlY2lmaWVkIGJ5IGphc21pbmUuREVGQVVMVF9USU1FT1VUX0lOVEVSVkFMLicpIHtcbiAgICAgICAgICAvLyBqYXNtaW5lIHRpbWVvdXQsIHdlIGNhbiBtYWtlIHRoZSBlcnJvciBtZXNzYWdlIG1vcmVcbiAgICAgICAgICAvLyByZWFzb25hYmxlIHRvIHRlbGwgd2hhdCB0YXNrcyBhcmUgcGVuZGluZ1xuICAgICAgICAgIGNvbnN0IHByb3h5Wm9uZVNwZWM6IGFueSA9IHRoaXMgJiYgdGhpcy50ZXN0UHJveHlab25lU3BlYztcbiAgICAgICAgICBpZiAocHJveHlab25lU3BlYykge1xuICAgICAgICAgICAgY29uc3QgcGVuZGluZ1Rhc2tzSW5mbyA9IHByb3h5Wm9uZVNwZWMuZ2V0QW5kQ2xlYXJQZW5kaW5nVGFza3NJbmZvKCk7XG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlICs9IHBlbmRpbmdUYXNrc0luZm87XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvbkV4Y2VwdGlvbikge1xuICAgICAgICAgIG9uRXhjZXB0aW9uLmNhbGwodGhpcywgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBfc3VwZXIuY2FsbCh0aGlzLCBhdHRycyk7XG4gICAgfVxuICAgIFpvbmVRdWV1ZVJ1bm5lci5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHpvbmU6IFpvbmV8bnVsbCA9IFpvbmUuY3VycmVudDtcbiAgICAgIGxldCBpc0NoaWxkT2ZBbWJpZW50Wm9uZSA9IGZhbHNlO1xuICAgICAgd2hpbGUgKHpvbmUpIHtcbiAgICAgICAgaWYgKHpvbmUgPT09IGFtYmllbnRab25lKSB7XG4gICAgICAgICAgaXNDaGlsZE9mQW1iaWVudFpvbmUgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHpvbmUgPSB6b25lLnBhcmVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc0NoaWxkT2ZBbWJpZW50Wm9uZSkgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIFpvbmU6ICcgKyBab25lLmN1cnJlbnQubmFtZSk7XG5cbiAgICAgIC8vIFRoaXMgaXMgdGhlIHpvbmUgd2hpY2ggd2lsbCBiZSB1c2VkIGZvciBydW5uaW5nIGluZGl2aWR1YWwgdGVzdHMuXG4gICAgICAvLyBJdCB3aWxsIGJlIGEgcHJveHkgem9uZSwgc28gdGhhdCB0aGUgdGVzdHMgZnVuY3Rpb24gY2FuIHJldHJvYWN0aXZlbHkgaW5zdGFsbFxuICAgICAgLy8gZGlmZmVyZW50IHpvbmVzLlxuICAgICAgLy8gRXhhbXBsZTpcbiAgICAgIC8vICAgLSBJbiBiZWZvcmVFYWNoKCkgZG8gY2hpbGRab25lID0gWm9uZS5jdXJyZW50LmZvcmsoLi4uKTtcbiAgICAgIC8vICAgLSBJbiBpdCgpIHRyeSB0byBkbyBmYWtlQXN5bmMoKS4gVGhlIGlzc3VlIGlzIHRoYXQgYmVjYXVzZSB0aGUgYmVmb3JlRWFjaCBmb3JrZWQgdGhlXG4gICAgICAvLyAgICAgem9uZSBvdXRzaWRlIG9mIGZha2VBc3luYyBpdCB3aWxsIGJlIGFibGUgdG8gZXNjYXBlIHRoZSBmYWtlQXN5bmMgcnVsZXMuXG4gICAgICAvLyAgIC0gQmVjYXVzZSBQcm94eVpvbmUgaXMgcGFyZW50IGZvIGBjaGlsZFpvbmVgIGZha2VBc3luYyBjYW4gcmV0cm9hY3RpdmVseSBhZGRcbiAgICAgIC8vICAgICBmYWtlQXN5bmMgYmVoYXZpb3IgdG8gdGhlIGNoaWxkWm9uZS5cblxuICAgICAgdGhpcy50ZXN0UHJveHlab25lU3BlYyA9IG5ldyBQcm94eVpvbmVTcGVjKCk7XG4gICAgICB0aGlzLnRlc3RQcm94eVpvbmUgPSBhbWJpZW50Wm9uZS5mb3JrKHRoaXMudGVzdFByb3h5Wm9uZVNwZWMpO1xuICAgICAgaWYgKCFab25lLmN1cnJlbnRUYXNrKSB7XG4gICAgICAgIC8vIGlmIHdlIGFyZSBub3QgcnVubmluZyBpbiBhIHRhc2sgdGhlbiBpZiBzb21lb25lIHdvdWxkIHJlZ2lzdGVyIGFcbiAgICAgICAgLy8gZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIGFuZCB0aGVuIGNhbGxpbmcgZWxlbWVudC5jbGljaygpIHRoZVxuICAgICAgICAvLyBhZGRFdmVudExpc3RlbmVyIGNhbGxiYWNrIHdvdWxkIHRoaW5rIHRoYXQgaXQgaXMgdGhlIHRvcCBtb3N0IHRhc2sgYW5kIHdvdWxkXG4gICAgICAgIC8vIGRyYWluIHRoZSBtaWNyb3Rhc2sgcXVldWUgb24gZWxlbWVudC5jbGljaygpIHdoaWNoIHdvdWxkIGJlIGluY29ycmVjdC5cbiAgICAgICAgLy8gRm9yIHRoaXMgcmVhc29uIHdlIGFsd2F5cyBmb3JjZSBhIHRhc2sgd2hlbiBydW5uaW5nIGphc21pbmUgdGVzdHMuXG4gICAgICAgIFpvbmUuY3VycmVudC5zY2hlZHVsZU1pY3JvVGFzayhcbiAgICAgICAgICAgICdqYXNtaW5lLmV4ZWN1dGUoKS5mb3JjZVRhc2snLCAoKSA9PiBRdWV1ZVJ1bm5lci5wcm90b3R5cGUuZXhlY3V0ZS5jYWxsKHRoaXMpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9zdXBlci5wcm90b3R5cGUuZXhlY3V0ZS5jYWxsKHRoaXMpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFpvbmVRdWV1ZVJ1bm5lcjtcbiAgfSkoUXVldWVSdW5uZXIpO1xufSkoKTtcbiJdfQ==