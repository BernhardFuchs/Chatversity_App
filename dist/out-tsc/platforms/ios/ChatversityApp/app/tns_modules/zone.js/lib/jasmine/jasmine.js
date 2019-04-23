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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamFzbWluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2phc21pbmUvamFzbWluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxZQUFZLENBQUM7QUFDYixDQUFDO0lBQ0MsSUFBTSxTQUFTLEdBQUcsVUFBUyxDQUFNLEVBQUUsQ0FBTTtRQUN2QyxLQUFLLElBQU0sQ0FBQyxJQUFJLENBQUM7WUFDZixJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsU0FBUyxFQUFFO1lBQ1QsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUNELENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUssRUFBVSxFQUFFLENBQUMsQ0FBQztJQUNsRyxDQUFDLENBQUM7SUFDRixJQUFNLE9BQU8sR0FDVCxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVcsSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDO0lBQzdGLHNGQUFzRjtJQUN0RiwrRUFBK0U7SUFDL0UsSUFBSSxDQUFDLElBQUk7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDL0MsSUFBSSxPQUFPLE9BQU8sSUFBSSxXQUFXO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FB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Q0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JDO1FBQ0gsQ0FBQyxDQUFDO1FBQ0YsT0FBTyxlQUFlLENBQUM7SUFDekIsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuKCgpID0+IHtcbiAgY29uc3QgX19leHRlbmRzID0gZnVuY3Rpb24oZDogYW55LCBiOiBhbnkpIHtcbiAgICBmb3IgKGNvbnN0IHAgaW4gYilcbiAgICAgIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHtcbiAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBkO1xuICAgIH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSksIG5ldyAoX18gYXMgYW55KSgpKTtcbiAgfTtcbiAgY29uc3QgX2dsb2JhbDogYW55ID1cbiAgICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdyB8fCB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgc2VsZiB8fCBnbG9iYWw7XG4gIC8vIFBhdGNoIGphc21pbmUncyBkZXNjcmliZS9pdC9iZWZvcmVFYWNoL2FmdGVyRWFjaCBmdW5jdGlvbnMgc28gdGVzdCBjb2RlIGFsd2F5cyBydW5zXG4gIC8vIGluIGEgdGVzdFpvbmUgKFByb3h5Wm9uZSkuIChTZWU6IGFuZ3VsYXIvem9uZS5qcyM5MSAmIGFuZ3VsYXIvYW5ndWxhciMxMDUwMylcbiAgaWYgKCFab25lKSB0aHJvdyBuZXcgRXJyb3IoJ01pc3Npbmc6IHpvbmUuanMnKTtcbiAgaWYgKHR5cGVvZiBqYXNtaW5lID09ICd1bmRlZmluZWQnKSB0aHJvdyBuZXcgRXJyb3IoJ01pc3Npbmc6IGphc21pbmUuanMnKTtcbiAgaWYgKChqYXNtaW5lIGFzIGFueSlbJ19fem9uZV9wYXRjaF9fJ10pXG4gICAgdGhyb3cgbmV3IEVycm9yKGAnamFzbWluZScgaGFzIGFscmVhZHkgYmVlbiBwYXRjaGVkIHdpdGggJ1pvbmUnLmApO1xuICAoamFzbWluZSBhcyBhbnkpWydfX3pvbmVfcGF0Y2hfXyddID0gdHJ1ZTtcblxuICBjb25zdCBTeW5jVGVzdFpvbmVTcGVjOiB7bmV3IChuYW1lOiBzdHJpbmcpOiBab25lU3BlY30gPSAoWm9uZSBhcyBhbnkpWydTeW5jVGVzdFpvbmVTcGVjJ107XG4gIGNvbnN0IFByb3h5Wm9uZVNwZWM6IHtuZXcgKCk6IFpvbmVTcGVjfSA9IChab25lIGFzIGFueSlbJ1Byb3h5Wm9uZVNwZWMnXTtcbiAgaWYgKCFTeW5jVGVzdFpvbmVTcGVjKSB0aHJvdyBuZXcgRXJyb3IoJ01pc3Npbmc6IFN5bmNUZXN0Wm9uZVNwZWMnKTtcbiAgaWYgKCFQcm94eVpvbmVTcGVjKSB0aHJvdyBuZXcgRXJyb3IoJ01pc3Npbmc6IFByb3h5Wm9uZVNwZWMnKTtcblxuICBjb25zdCBhbWJpZW50Wm9uZSA9IFpvbmUuY3VycmVudDtcbiAgLy8gQ3JlYXRlIGEgc3luY2hyb25vdXMtb25seSB6b25lIGluIHdoaWNoIHRvIHJ1biBgZGVzY3JpYmVgIGJsb2NrcyBpbiBvcmRlciB0byByYWlzZSBhblxuICAvLyBlcnJvciBpZiBhbnkgYXN5bmNocm9ub3VzIG9wZXJhdGlvbnMgYXJlIGF0dGVtcHRlZCBpbnNpZGUgb2YgYSBgZGVzY3JpYmVgIGJ1dCBvdXRzaWRlIG9mXG4gIC8vIGEgYGJlZm9yZUVhY2hgIG9yIGBpdGAuXG4gIGNvbnN0IHN5bmNab25lID0gYW1iaWVudFpvbmUuZm9yayhuZXcgU3luY1Rlc3Rab25lU3BlYygnamFzbWluZS5kZXNjcmliZScpKTtcblxuICBjb25zdCBzeW1ib2wgPSBab25lLl9fc3ltYm9sX187XG5cbiAgLy8gd2hldGhlciBwYXRjaCBqYXNtaW5lIGNsb2NrIHdoZW4gaW4gZmFrZUFzeW5jXG4gIGNvbnN0IGVuYWJsZUNsb2NrUGF0Y2ggPSBfZ2xvYmFsW3N5bWJvbCgnZmFrZUFzeW5jUGF0Y2hMb2NrJyldID09PSB0cnVlO1xuXG4gIC8vIE1vbmtleSBwYXRjaCBhbGwgb2YgdGhlIGphc21pbmUgRFNMIHNvIHRoYXQgZWFjaCBmdW5jdGlvbiBydW5zIGluIGFwcHJvcHJpYXRlIHpvbmUuXG4gIGNvbnN0IGphc21pbmVFbnY6IGFueSA9IGphc21pbmUuZ2V0RW52KCk7XG4gIFsnZGVzY3JpYmUnLCAneGRlc2NyaWJlJywgJ2ZkZXNjcmliZSddLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgbGV0IG9yaWdpbmFsSmFzbWluZUZuOiBGdW5jdGlvbiA9IGphc21pbmVFbnZbbWV0aG9kTmFtZV07XG4gICAgamFzbWluZUVudlttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKGRlc2NyaXB0aW9uOiBzdHJpbmcsIHNwZWNEZWZpbml0aW9uczogRnVuY3Rpb24pIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbEphc21pbmVGbi5jYWxsKHRoaXMsIGRlc2NyaXB0aW9uLCB3cmFwRGVzY3JpYmVJblpvbmUoc3BlY0RlZmluaXRpb25zKSk7XG4gICAgfTtcbiAgfSk7XG4gIFsnaXQnLCAneGl0JywgJ2ZpdCddLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgbGV0IG9yaWdpbmFsSmFzbWluZUZuOiBGdW5jdGlvbiA9IGphc21pbmVFbnZbbWV0aG9kTmFtZV07XG4gICAgamFzbWluZUVudltzeW1ib2wobWV0aG9kTmFtZSldID0gb3JpZ2luYWxKYXNtaW5lRm47XG4gICAgamFzbWluZUVudlttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKFxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nLCBzcGVjRGVmaW5pdGlvbnM6IEZ1bmN0aW9uLCB0aW1lb3V0OiBudW1iZXIpIHtcbiAgICAgIGFyZ3VtZW50c1sxXSA9IHdyYXBUZXN0SW5ab25lKHNwZWNEZWZpbml0aW9ucyk7XG4gICAgICByZXR1cm4gb3JpZ2luYWxKYXNtaW5lRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9KTtcbiAgWydiZWZvcmVFYWNoJywgJ2FmdGVyRWFjaCcsICdiZWZvcmVBbGwnLCAnYWZ0ZXJBbGwnXS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgIGxldCBvcmlnaW5hbEphc21pbmVGbjogRnVuY3Rpb24gPSBqYXNtaW5lRW52W21ldGhvZE5hbWVdO1xuICAgIGphc21pbmVFbnZbc3ltYm9sKG1ldGhvZE5hbWUpXSA9IG9yaWdpbmFsSmFzbWluZUZuO1xuICAgIGphc21pbmVFbnZbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbihzcGVjRGVmaW5pdGlvbnM6IEZ1bmN0aW9uLCB0aW1lb3V0OiBudW1iZXIpIHtcbiAgICAgIGFyZ3VtZW50c1swXSA9IHdyYXBUZXN0SW5ab25lKHNwZWNEZWZpbml0aW9ucyk7XG4gICAgICByZXR1cm4gb3JpZ2luYWxKYXNtaW5lRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBuZWVkIHRvIHBhdGNoIGphc21pbmUuY2xvY2soKS5tb2NrRGF0ZSBhbmQgamFzbWluZS5jbG9jaygpLnRpY2soKSBzb1xuICAvLyB0aGV5IGNhbiB3b3JrIHByb3Blcmx5IGluIEZha2VBc3luY1Rlc3RcbiAgY29uc3Qgb3JpZ2luYWxDbG9ja0ZuOiBGdW5jdGlvbiA9ICgoamFzbWluZSBhcyBhbnkpW3N5bWJvbCgnY2xvY2snKV0gPSBqYXNtaW5lWydjbG9jayddKTtcbiAgKGphc21pbmUgYXMgYW55KVsnY2xvY2snXSA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGNsb2NrID0gb3JpZ2luYWxDbG9ja0ZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKCFjbG9ja1tzeW1ib2woJ3BhdGNoZWQnKV0pIHtcbiAgICAgIGNsb2NrW3N5bWJvbCgncGF0Y2hlZCcpXSA9IHN5bWJvbCgncGF0Y2hlZCcpO1xuICAgICAgY29uc3Qgb3JpZ2luYWxUaWNrID0gKGNsb2NrW3N5bWJvbCgndGljaycpXSA9IGNsb2NrLnRpY2spO1xuICAgICAgY2xvY2sudGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBmYWtlQXN5bmNab25lU3BlYyA9IFpvbmUuY3VycmVudC5nZXQoJ0Zha2VBc3luY1Rlc3Rab25lU3BlYycpO1xuICAgICAgICBpZiAoZmFrZUFzeW5jWm9uZVNwZWMpIHtcbiAgICAgICAgICByZXR1cm4gZmFrZUFzeW5jWm9uZVNwZWMudGljay5hcHBseShmYWtlQXN5bmNab25lU3BlYywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxUaWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgY29uc3Qgb3JpZ2luYWxNb2NrRGF0ZSA9IChjbG9ja1tzeW1ib2woJ21vY2tEYXRlJyldID0gY2xvY2subW9ja0RhdGUpO1xuICAgICAgY2xvY2subW9ja0RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgZmFrZUFzeW5jWm9uZVNwZWMgPSBab25lLmN1cnJlbnQuZ2V0KCdGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnKTtcbiAgICAgICAgaWYgKGZha2VBc3luY1pvbmVTcGVjKSB7XG4gICAgICAgICAgY29uc3QgZGF0ZVRpbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IG5ldyBEYXRlKCk7XG4gICAgICAgICAgcmV0dXJuIGZha2VBc3luY1pvbmVTcGVjLnNldEN1cnJlbnRSZWFsVGltZS5hcHBseShcbiAgICAgICAgICAgICAgZmFrZUFzeW5jWm9uZVNwZWMsXG4gICAgICAgICAgICAgIGRhdGVUaW1lICYmIHR5cGVvZiBkYXRlVGltZS5nZXRUaW1lID09PSAnZnVuY3Rpb24nID8gW2RhdGVUaW1lLmdldFRpbWUoKV0gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsTW9ja0RhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICAvLyBmb3IgYXV0byBnbyBpbnRvIGZha2VBc3luYyBmZWF0dXJlLCB3ZSBuZWVkIHRoZSBmbGFnIHRvIGVuYWJsZSBpdFxuICAgICAgaWYgKGVuYWJsZUNsb2NrUGF0Y2gpIHtcbiAgICAgICAgWydpbnN0YWxsJywgJ3VuaW5zdGFsbCddLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgICAgICAgY29uc3Qgb3JpZ2luYWxDbG9ja0ZuOiBGdW5jdGlvbiA9IChjbG9ja1tzeW1ib2wobWV0aG9kTmFtZSldID0gY2xvY2tbbWV0aG9kTmFtZV0pO1xuICAgICAgICAgIGNsb2NrW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMgPSAoWm9uZSBhcyBhbnkpWydGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnXTtcbiAgICAgICAgICAgIGlmIChGYWtlQXN5bmNUZXN0Wm9uZVNwZWMpIHtcbiAgICAgICAgICAgICAgKGphc21pbmUgYXMgYW55KVtzeW1ib2woJ2Nsb2NrSW5zdGFsbGVkJyldID0gJ2luc3RhbGwnID09PSBtZXRob2ROYW1lO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxDbG9ja0ZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjbG9jaztcbiAgfTtcblxuICAvKipcbiAgICogR2V0cyBhIGZ1bmN0aW9uIHdyYXBwaW5nIHRoZSBib2R5IG9mIGEgSmFzbWluZSBgZGVzY3JpYmVgIGJsb2NrIHRvIGV4ZWN1dGUgaW4gYVxuICAgKiBzeW5jaHJvbm91cy1vbmx5IHpvbmUuXG4gICAqL1xuICBmdW5jdGlvbiB3cmFwRGVzY3JpYmVJblpvbmUoZGVzY3JpYmVCb2R5OiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc3luY1pvbmUucnVuKGRlc2NyaWJlQm9keSwgdGhpcywgKGFyZ3VtZW50cyBhcyBhbnkpIGFzIGFueVtdKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuSW5UZXN0Wm9uZSh0ZXN0Qm9keTogRnVuY3Rpb24sIGFwcGx5VGhpczogYW55LCBxdWV1ZVJ1bm5lcjogYW55LCBkb25lPzogRnVuY3Rpb24pIHtcbiAgICBjb25zdCBpc0Nsb2NrSW5zdGFsbGVkID0gISEoamFzbWluZSBhcyBhbnkpW3N5bWJvbCgnY2xvY2tJbnN0YWxsZWQnKV07XG4gICAgY29uc3QgdGVzdFByb3h5Wm9uZVNwZWMgPSBxdWV1ZVJ1bm5lci50ZXN0UHJveHlab25lU3BlYztcbiAgICBjb25zdCB0ZXN0UHJveHlab25lID0gcXVldWVSdW5uZXIudGVzdFByb3h5Wm9uZTtcbiAgICBsZXQgbGFzdERlbGVnYXRlO1xuICAgIGlmIChpc0Nsb2NrSW5zdGFsbGVkICYmIGVuYWJsZUNsb2NrUGF0Y2gpIHtcbiAgICAgIC8vIGF1dG8gcnVuIGEgZmFrZUFzeW5jXG4gICAgICBjb25zdCBmYWtlQXN5bmNNb2R1bGUgPSAoWm9uZSBhcyBhbnkpW1pvbmUuX19zeW1ib2xfXygnZmFrZUFzeW5jVGVzdCcpXTtcbiAgICAgIGlmIChmYWtlQXN5bmNNb2R1bGUgJiYgdHlwZW9mIGZha2VBc3luY01vZHVsZS5mYWtlQXN5bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGVzdEJvZHkgPSBmYWtlQXN5bmNNb2R1bGUuZmFrZUFzeW5jKHRlc3RCb2R5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRvbmUpIHtcbiAgICAgIHJldHVybiB0ZXN0UHJveHlab25lLnJ1bih0ZXN0Qm9keSwgYXBwbHlUaGlzLCBbZG9uZV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGVzdFByb3h5Wm9uZS5ydW4odGVzdEJvZHksIGFwcGx5VGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBmdW5jdGlvbiB3cmFwcGluZyB0aGUgYm9keSBvZiBhIEphc21pbmUgYGl0L2JlZm9yZUVhY2gvYWZ0ZXJFYWNoYCBibG9jayB0b1xuICAgKiBleGVjdXRlIGluIGEgUHJveHlab25lIHpvbmUuXG4gICAqIFRoaXMgd2lsbCBydW4gaW4gYHRlc3RQcm94eVpvbmVgLiBUaGUgYHRlc3RQcm94eVpvbmVgIHdpbGwgYmUgcmVzZXQgYnkgdGhlIGBab25lUXVldWVSdW5uZXJgXG4gICAqL1xuICBmdW5jdGlvbiB3cmFwVGVzdEluWm9uZSh0ZXN0Qm9keTogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gICAgLy8gVGhlIGBkb25lYCBjYWxsYmFjayBpcyBvbmx5IHBhc3NlZCB0aHJvdWdoIGlmIHRoZSBmdW5jdGlvbiBleHBlY3RzIGF0IGxlYXN0IG9uZSBhcmd1bWVudC5cbiAgICAvLyBOb3RlIHdlIGhhdmUgdG8gbWFrZSBhIGZ1bmN0aW9uIHdpdGggY29ycmVjdCBudW1iZXIgb2YgYXJndW1lbnRzLCBvdGhlcndpc2UgamFzbWluZSB3aWxsXG4gICAgLy8gdGhpbmsgdGhhdCBhbGwgZnVuY3Rpb25zIGFyZSBzeW5jIG9yIGFzeW5jLlxuICAgIHJldHVybiAodGVzdEJvZHkgJiYgKHRlc3RCb2R5Lmxlbmd0aCA/IGZ1bmN0aW9uKGRvbmU6IEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiBydW5JblRlc3Rab25lKHRlc3RCb2R5LCB0aGlzLCB0aGlzLnF1ZXVlUnVubmVyLCBkb25lKTtcbiAgICAgICAgICAgIH0gOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJ1bkluVGVzdFpvbmUodGVzdEJvZHksIHRoaXMsIHRoaXMucXVldWVSdW5uZXIpO1xuICAgICAgICAgICAgfSkpO1xuICB9XG4gIGludGVyZmFjZSBRdWV1ZVJ1bm5lciB7XG4gICAgZXhlY3V0ZSgpOiB2b2lkO1xuICB9XG4gIGludGVyZmFjZSBRdWV1ZVJ1bm5lckF0dHJzIHtcbiAgICBxdWV1ZWFibGVGbnM6IHtmbjogRnVuY3Rpb259W107XG4gICAgb25Db21wbGV0ZTogKCkgPT4gdm9pZDtcbiAgICBjbGVhclN0YWNrOiAoZm46IGFueSkgPT4gdm9pZDtcbiAgICBvbkV4Y2VwdGlvbjogKGVycm9yOiBhbnkpID0+IHZvaWQ7XG4gICAgY2F0Y2hFeGNlcHRpb246ICgpID0+IGJvb2xlYW47XG4gICAgdXNlckNvbnRleHQ6IGFueTtcbiAgICB0aW1lb3V0OiB7c2V0VGltZW91dDogRnVuY3Rpb247IGNsZWFyVGltZW91dDogRnVuY3Rpb259O1xuICAgIGZhaWw6ICgpID0+IHZvaWQ7XG4gIH1cblxuICBjb25zdCBRdWV1ZVJ1bm5lciA9IChqYXNtaW5lIGFzIGFueSkuUXVldWVSdW5uZXIgYXMge1xuICAgIG5ldyAoYXR0cnM6IFF1ZXVlUnVubmVyQXR0cnMpOiBRdWV1ZVJ1bm5lcjtcbiAgfTtcbiAgKGphc21pbmUgYXMgYW55KS5RdWV1ZVJ1bm5lciA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoWm9uZVF1ZXVlUnVubmVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFpvbmVRdWV1ZVJ1bm5lcihhdHRyczoge1xuICAgICAgb25Db21wbGV0ZTogRnVuY3Rpb247XG4gICAgICB1c2VyQ29udGV4dD86IGFueTtcbiAgICAgIHRpbWVvdXQ/OiB7c2V0VGltZW91dDogRnVuY3Rpb247IGNsZWFyVGltZW91dDogRnVuY3Rpb259O1xuICAgICAgb25FeGNlcHRpb24/OiAoZXJyb3I6IGFueSkgPT4gdm9pZDtcbiAgICB9KSB7XG4gICAgICBhdHRycy5vbkNvbXBsZXRlID0gKGZuID0+ICgpID0+IHtcbiAgICAgICAgLy8gQWxsIGZ1bmN0aW9ucyBhcmUgZG9uZSwgY2xlYXIgdGhlIHRlc3Qgem9uZS5cbiAgICAgICAgdGhpcy50ZXN0UHJveHlab25lID0gbnVsbDtcbiAgICAgICAgdGhpcy50ZXN0UHJveHlab25lU3BlYyA9IG51bGw7XG4gICAgICAgIGFtYmllbnRab25lLnNjaGVkdWxlTWljcm9UYXNrKCdqYXNtaW5lLm9uQ29tcGxldGUnLCBmbik7XG4gICAgICB9KShhdHRycy5vbkNvbXBsZXRlKTtcblxuICAgICAgY29uc3QgbmF0aXZlU2V0VGltZW91dCA9IF9nbG9iYWxbJ19fem9uZV9zeW1ib2xfX3NldFRpbWVvdXQnXTtcbiAgICAgIGNvbnN0IG5hdGl2ZUNsZWFyVGltZW91dCA9IF9nbG9iYWxbJ19fem9uZV9zeW1ib2xfX2NsZWFyVGltZW91dCddO1xuICAgICAgaWYgKG5hdGl2ZVNldFRpbWVvdXQpIHtcbiAgICAgICAgLy8gc2hvdWxkIHJ1biBzZXRUaW1lb3V0IGluc2lkZSBqYXNtaW5lIG91dHNpZGUgb2Ygem9uZVxuICAgICAgICBhdHRycy50aW1lb3V0ID0ge1xuICAgICAgICAgIHNldFRpbWVvdXQ6IG5hdGl2ZVNldFRpbWVvdXQgPyBuYXRpdmVTZXRUaW1lb3V0IDogX2dsb2JhbC5zZXRUaW1lb3V0LFxuICAgICAgICAgIGNsZWFyVGltZW91dDogbmF0aXZlQ2xlYXJUaW1lb3V0ID8gbmF0aXZlQ2xlYXJUaW1lb3V0IDogX2dsb2JhbC5jbGVhclRpbWVvdXRcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gY3JlYXRlIGEgdXNlckNvbnRleHQgdG8gaG9sZCB0aGUgcXVldWVSdW5uZXIgaXRzZWxmXG4gICAgICAvLyBzbyB3ZSBjYW4gYWNjZXNzIHRoZSB0ZXN0UHJveHkgaW4gaXQveGl0L2JlZm9yZUVhY2ggLi4uXG4gICAgICBpZiAoKGphc21pbmUgYXMgYW55KS5Vc2VyQ29udGV4dCkge1xuICAgICAgICBpZiAoIWF0dHJzLnVzZXJDb250ZXh0KSB7XG4gICAgICAgICAgYXR0cnMudXNlckNvbnRleHQgPSBuZXcgKGphc21pbmUgYXMgYW55KS5Vc2VyQ29udGV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIGF0dHJzLnVzZXJDb250ZXh0LnF1ZXVlUnVubmVyID0gdGhpcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghYXR0cnMudXNlckNvbnRleHQpIHtcbiAgICAgICAgICBhdHRycy51c2VyQ29udGV4dCA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGF0dHJzLnVzZXJDb250ZXh0LnF1ZXVlUnVubmVyID0gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gcGF0Y2ggYXR0cnMub25FeGNlcHRpb25cbiAgICAgIGNvbnN0IG9uRXhjZXB0aW9uID0gYXR0cnMub25FeGNlcHRpb247XG4gICAgICBhdHRycy5vbkV4Y2VwdGlvbiA9IGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcbiAgICAgICAgaWYgKGVycm9yICYmXG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID09PVxuICAgICAgICAgICAgICAgICdUaW1lb3V0IC0gQXN5bmMgY2FsbGJhY2sgd2FzIG5vdCBpbnZva2VkIHdpdGhpbiB0aW1lb3V0IHNwZWNpZmllZCBieSBqYXNtaW5lLkRFRkFVTFRfVElNRU9VVF9JTlRFUlZBTC4nKSB7XG4gICAgICAgICAgLy8gamFzbWluZSB0aW1lb3V0LCB3ZSBjYW4gbWFrZSB0aGUgZXJyb3IgbWVzc2FnZSBtb3JlXG4gICAgICAgICAgLy8gcmVhc29uYWJsZSB0byB0ZWxsIHdoYXQgdGFza3MgYXJlIHBlbmRpbmdcbiAgICAgICAgICBjb25zdCBwcm94eVpvbmVTcGVjOiBhbnkgPSB0aGlzICYmIHRoaXMudGVzdFByb3h5Wm9uZVNwZWM7XG4gICAgICAgICAgaWYgKHByb3h5Wm9uZVNwZWMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBlbmRpbmdUYXNrc0luZm8gPSBwcm94eVpvbmVTcGVjLmdldEFuZENsZWFyUGVuZGluZ1Rhc2tzSW5mbygpO1xuICAgICAgICAgICAgZXJyb3IubWVzc2FnZSArPSBwZW5kaW5nVGFza3NJbmZvO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob25FeGNlcHRpb24pIHtcbiAgICAgICAgICBvbkV4Y2VwdGlvbi5jYWxsKHRoaXMsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgX3N1cGVyLmNhbGwodGhpcywgYXR0cnMpO1xuICAgIH1cbiAgICBab25lUXVldWVSdW5uZXIucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB6b25lOiBab25lfG51bGwgPSBab25lLmN1cnJlbnQ7XG4gICAgICBsZXQgaXNDaGlsZE9mQW1iaWVudFpvbmUgPSBmYWxzZTtcbiAgICAgIHdoaWxlICh6b25lKSB7XG4gICAgICAgIGlmICh6b25lID09PSBhbWJpZW50Wm9uZSkge1xuICAgICAgICAgIGlzQ2hpbGRPZkFtYmllbnRab25lID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB6b25lID0gem9uZS5wYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNDaGlsZE9mQW1iaWVudFpvbmUpIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCBab25lOiAnICsgWm9uZS5jdXJyZW50Lm5hbWUpO1xuXG4gICAgICAvLyBUaGlzIGlzIHRoZSB6b25lIHdoaWNoIHdpbGwgYmUgdXNlZCBmb3IgcnVubmluZyBpbmRpdmlkdWFsIHRlc3RzLlxuICAgICAgLy8gSXQgd2lsbCBiZSBhIHByb3h5IHpvbmUsIHNvIHRoYXQgdGhlIHRlc3RzIGZ1bmN0aW9uIGNhbiByZXRyb2FjdGl2ZWx5IGluc3RhbGxcbiAgICAgIC8vIGRpZmZlcmVudCB6b25lcy5cbiAgICAgIC8vIEV4YW1wbGU6XG4gICAgICAvLyAgIC0gSW4gYmVmb3JlRWFjaCgpIGRvIGNoaWxkWm9uZSA9IFpvbmUuY3VycmVudC5mb3JrKC4uLik7XG4gICAgICAvLyAgIC0gSW4gaXQoKSB0cnkgdG8gZG8gZmFrZUFzeW5jKCkuIFRoZSBpc3N1ZSBpcyB0aGF0IGJlY2F1c2UgdGhlIGJlZm9yZUVhY2ggZm9ya2VkIHRoZVxuICAgICAgLy8gICAgIHpvbmUgb3V0c2lkZSBvZiBmYWtlQXN5bmMgaXQgd2lsbCBiZSBhYmxlIHRvIGVzY2FwZSB0aGUgZmFrZUFzeW5jIHJ1bGVzLlxuICAgICAgLy8gICAtIEJlY2F1c2UgUHJveHlab25lIGlzIHBhcmVudCBmbyBgY2hpbGRab25lYCBmYWtlQXN5bmMgY2FuIHJldHJvYWN0aXZlbHkgYWRkXG4gICAgICAvLyAgICAgZmFrZUFzeW5jIGJlaGF2aW9yIHRvIHRoZSBjaGlsZFpvbmUuXG5cbiAgICAgIHRoaXMudGVzdFByb3h5Wm9uZVNwZWMgPSBuZXcgUHJveHlab25lU3BlYygpO1xuICAgICAgdGhpcy50ZXN0UHJveHlab25lID0gYW1iaWVudFpvbmUuZm9yayh0aGlzLnRlc3RQcm94eVpvbmVTcGVjKTtcbiAgICAgIGlmICghWm9uZS5jdXJyZW50VGFzaykge1xuICAgICAgICAvLyBpZiB3ZSBhcmUgbm90IHJ1bm5pbmcgaW4gYSB0YXNrIHRoZW4gaWYgc29tZW9uZSB3b3VsZCByZWdpc3RlciBhXG4gICAgICAgIC8vIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBhbmQgdGhlbiBjYWxsaW5nIGVsZW1lbnQuY2xpY2soKSB0aGVcbiAgICAgICAgLy8gYWRkRXZlbnRMaXN0ZW5lciBjYWxsYmFjayB3b3VsZCB0aGluayB0aGF0IGl0IGlzIHRoZSB0b3AgbW9zdCB0YXNrIGFuZCB3b3VsZFxuICAgICAgICAvLyBkcmFpbiB0aGUgbWljcm90YXNrIHF1ZXVlIG9uIGVsZW1lbnQuY2xpY2soKSB3aGljaCB3b3VsZCBiZSBpbmNvcnJlY3QuXG4gICAgICAgIC8vIEZvciB0aGlzIHJlYXNvbiB3ZSBhbHdheXMgZm9yY2UgYSB0YXNrIHdoZW4gcnVubmluZyBqYXNtaW5lIHRlc3RzLlxuICAgICAgICBab25lLmN1cnJlbnQuc2NoZWR1bGVNaWNyb1Rhc2soXG4gICAgICAgICAgICAnamFzbWluZS5leGVjdXRlKCkuZm9yY2VUYXNrJywgKCkgPT4gUXVldWVSdW5uZXIucHJvdG90eXBlLmV4ZWN1dGUuY2FsbCh0aGlzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfc3VwZXIucHJvdG90eXBlLmV4ZWN1dGUuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBab25lUXVldWVSdW5uZXI7XG4gIH0pKFF1ZXVlUnVubmVyKTtcbn0pKCk7XG4iXX0=