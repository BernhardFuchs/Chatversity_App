/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global) {
    var OriginalDate = global.Date;
    var FakeDate = /** @class */ (function () {
        function FakeDate() {
            if (arguments.length === 0) {
                var d = new OriginalDate();
                d.setTime(FakeDate.now());
                return d;
            }
            else {
                var args = Array.prototype.slice.call(arguments);
                return new (OriginalDate.bind.apply(OriginalDate, [void 0].concat(args)))();
            }
        }
        FakeDate.now = function () {
            var fakeAsyncTestZoneSpec = Zone.current.get('FakeAsyncTestZoneSpec');
            if (fakeAsyncTestZoneSpec) {
                return fakeAsyncTestZoneSpec.getCurrentRealTime() + fakeAsyncTestZoneSpec.getCurrentTime();
            }
            return OriginalDate.now.apply(this, arguments);
        };
        return FakeDate;
    }());
    FakeDate.UTC = OriginalDate.UTC;
    FakeDate.parse = OriginalDate.parse;
    // keep a reference for zone patched timer function
    var timers = {
        setTimeout: global.setTimeout,
        setInterval: global.setInterval,
        clearTimeout: global.clearTimeout,
        clearInterval: global.clearInterval
    };
    var Scheduler = /** @class */ (function () {
        function Scheduler() {
            // Next scheduler id.
            this.nextId = 1;
            // Scheduler queue with the tuple of end time and callback function - sorted by end time.
            this._schedulerQueue = [];
            // Current simulated time in millis.
            this._currentTime = 0;
            // Current real time in millis.
            this._currentRealTime = OriginalDate.now();
        }
        Scheduler.prototype.getCurrentTime = function () {
            return this._currentTime;
        };
        Scheduler.prototype.getCurrentRealTime = function () {
            return this._currentRealTime;
        };
        Scheduler.prototype.setCurrentRealTime = function (realTime) {
            this._currentRealTime = realTime;
        };
        Scheduler.prototype.scheduleFunction = function (cb, delay, args, isPeriodic, isRequestAnimationFrame, id) {
            if (args === void 0) { args = []; }
            if (isPeriodic === void 0) { isPeriodic = false; }
            if (isRequestAnimationFrame === void 0) { isRequestAnimationFrame = false; }
            if (id === void 0) { id = -1; }
            var currentId = id < 0 ? this.nextId++ : id;
            var endTime = this._currentTime + delay;
            // Insert so that scheduler queue remains sorted by end time.
            var newEntry = {
                endTime: endTime,
                id: currentId,
                func: cb,
                args: args,
                delay: delay,
                isPeriodic: isPeriodic,
                isRequestAnimationFrame: isRequestAnimationFrame
            };
            var i = 0;
            for (; i < this._schedulerQueue.length; i++) {
                var currentEntry = this._schedulerQueue[i];
                if (newEntry.endTime < currentEntry.endTime) {
                    break;
                }
            }
            this._schedulerQueue.splice(i, 0, newEntry);
            return currentId;
        };
        Scheduler.prototype.removeScheduledFunctionWithId = function (id) {
            for (var i = 0; i < this._schedulerQueue.length; i++) {
                if (this._schedulerQueue[i].id == id) {
                    this._schedulerQueue.splice(i, 1);
                    break;
                }
            }
        };
        Scheduler.prototype.tick = function (millis, doTick) {
            if (millis === void 0) { millis = 0; }
            var finalTime = this._currentTime + millis;
            var lastCurrentTime = 0;
            if (this._schedulerQueue.length === 0 && doTick) {
                doTick(millis);
                return;
            }
            while (this._schedulerQueue.length > 0) {
                var current = this._schedulerQueue[0];
                if (finalTime < current.endTime) {
                    // Done processing the queue since it's sorted by endTime.
                    break;
                }
                else {
                    // Time to run scheduled function. Remove it from the head of queue.
                    var current_1 = this._schedulerQueue.shift();
                    lastCurrentTime = this._currentTime;
                    this._currentTime = current_1.endTime;
                    if (doTick) {
                        doTick(this._currentTime - lastCurrentTime);
                    }
                    var retval = current_1.func.apply(global, current_1.args);
                    if (!retval) {
                        // Uncaught exception in the current scheduled function. Stop processing the queue.
                        break;
                    }
                }
            }
            lastCurrentTime = this._currentTime;
            this._currentTime = finalTime;
            if (doTick) {
                doTick(this._currentTime - lastCurrentTime);
            }
        };
        Scheduler.prototype.flush = function (limit, flushPeriodic, doTick) {
            if (limit === void 0) { limit = 20; }
            if (flushPeriodic === void 0) { flushPeriodic = false; }
            if (flushPeriodic) {
                return this.flushPeriodic(doTick);
            }
            else {
                return this.flushNonPeriodic(limit, doTick);
            }
        };
        Scheduler.prototype.flushPeriodic = function (doTick) {
            if (this._schedulerQueue.length === 0) {
                return 0;
            }
            // Find the last task currently queued in the scheduler queue and tick
            // till that time.
            var startTime = this._currentTime;
            var lastTask = this._schedulerQueue[this._schedulerQueue.length - 1];
            this.tick(lastTask.endTime - startTime, doTick);
            return this._currentTime - startTime;
        };
        Scheduler.prototype.flushNonPeriodic = function (limit, doTick) {
            var startTime = this._currentTime;
            var lastCurrentTime = 0;
            var count = 0;
            while (this._schedulerQueue.length > 0) {
                count++;
                if (count > limit) {
                    throw new Error('flush failed after reaching the limit of ' + limit +
                        ' tasks. Does your code use a polling timeout?');
                }
                // flush only non-periodic timers.
                // If the only remaining tasks are periodic(or requestAnimationFrame), finish flushing.
                if (this._schedulerQueue.filter(function (task) { return !task.isPeriodic && !task.isRequestAnimationFrame; })
                    .length === 0) {
                    break;
                }
                var current = this._schedulerQueue.shift();
                lastCurrentTime = this._currentTime;
                this._currentTime = current.endTime;
                if (doTick) {
                    // Update any secondary schedulers like Jasmine mock Date.
                    doTick(this._currentTime - lastCurrentTime);
                }
                var retval = current.func.apply(global, current.args);
                if (!retval) {
                    // Uncaught exception in the current scheduled function. Stop processing the queue.
                    break;
                }
            }
            return this._currentTime - startTime;
        };
        return Scheduler;
    }());
    var FakeAsyncTestZoneSpec = /** @class */ (function () {
        function FakeAsyncTestZoneSpec(namePrefix, trackPendingRequestAnimationFrame, macroTaskOptions) {
            if (trackPendingRequestAnimationFrame === void 0) { trackPendingRequestAnimationFrame = false; }
            this.trackPendingRequestAnimationFrame = trackPendingRequestAnimationFrame;
            this.macroTaskOptions = macroTaskOptions;
            this._scheduler = new Scheduler();
            this._microtasks = [];
            this._lastError = null;
            this._uncaughtPromiseErrors = Promise[Zone.__symbol__('uncaughtPromiseErrors')];
            this.pendingPeriodicTimers = [];
            this.pendingTimers = [];
            this.patchDateLocked = false;
            this.properties = { 'FakeAsyncTestZoneSpec': this };
            this.name = 'fakeAsyncTestZone for ' + namePrefix;
            // in case user can't access the construction of FakeAsyncTestSpec
            // user can also define macroTaskOptions by define a global variable.
            if (!this.macroTaskOptions) {
                this.macroTaskOptions = global[Zone.__symbol__('FakeAsyncTestMacroTask')];
            }
        }
        FakeAsyncTestZoneSpec.assertInZone = function () {
            if (Zone.current.get('FakeAsyncTestZoneSpec') == null) {
                throw new Error('The code should be running in the fakeAsync zone to call this function');
            }
        };
        FakeAsyncTestZoneSpec.prototype._fnAndFlush = function (fn, completers) {
            var _this = this;
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                fn.apply(global, args);
                if (_this._lastError === null) { // Success
                    if (completers.onSuccess != null) {
                        completers.onSuccess.apply(global);
                    }
                    // Flush microtasks only on success.
                    _this.flushMicrotasks();
                }
                else { // Failure
                    if (completers.onError != null) {
                        completers.onError.apply(global);
                    }
                }
                // Return true if there were no errors, false otherwise.
                return _this._lastError === null;
            };
        };
        FakeAsyncTestZoneSpec._removeTimer = function (timers, id) {
            var index = timers.indexOf(id);
            if (index > -1) {
                timers.splice(index, 1);
            }
        };
        FakeAsyncTestZoneSpec.prototype._dequeueTimer = function (id) {
            var _this = this;
            return function () {
                FakeAsyncTestZoneSpec._removeTimer(_this.pendingTimers, id);
            };
        };
        FakeAsyncTestZoneSpec.prototype._requeuePeriodicTimer = function (fn, interval, args, id) {
            var _this = this;
            return function () {
                // Requeue the timer callback if it's not been canceled.
                if (_this.pendingPeriodicTimers.indexOf(id) !== -1) {
                    _this._scheduler.scheduleFunction(fn, interval, args, true, false, id);
                }
            };
        };
        FakeAsyncTestZoneSpec.prototype._dequeuePeriodicTimer = function (id) {
            var _this = this;
            return function () {
                FakeAsyncTestZoneSpec._removeTimer(_this.pendingPeriodicTimers, id);
            };
        };
        FakeAsyncTestZoneSpec.prototype._setTimeout = function (fn, delay, args, isTimer) {
            if (isTimer === void 0) { isTimer = true; }
            var removeTimerFn = this._dequeueTimer(this._scheduler.nextId);
            // Queue the callback and dequeue the timer on success and error.
            var cb = this._fnAndFlush(fn, { onSuccess: removeTimerFn, onError: removeTimerFn });
            var id = this._scheduler.scheduleFunction(cb, delay, args, false, !isTimer);
            if (isTimer) {
                this.pendingTimers.push(id);
            }
            return id;
        };
        FakeAsyncTestZoneSpec.prototype._clearTimeout = function (id) {
            FakeAsyncTestZoneSpec._removeTimer(this.pendingTimers, id);
            this._scheduler.removeScheduledFunctionWithId(id);
        };
        FakeAsyncTestZoneSpec.prototype._setInterval = function (fn, interval, args) {
            var id = this._scheduler.nextId;
            var completers = { onSuccess: null, onError: this._dequeuePeriodicTimer(id) };
            var cb = this._fnAndFlush(fn, completers);
            // Use the callback created above to requeue on success.
            completers.onSuccess = this._requeuePeriodicTimer(cb, interval, args, id);
            // Queue the callback and dequeue the periodic timer only on error.
            this._scheduler.scheduleFunction(cb, interval, args, true);
            this.pendingPeriodicTimers.push(id);
            return id;
        };
        FakeAsyncTestZoneSpec.prototype._clearInterval = function (id) {
            FakeAsyncTestZoneSpec._removeTimer(this.pendingPeriodicTimers, id);
            this._scheduler.removeScheduledFunctionWithId(id);
        };
        FakeAsyncTestZoneSpec.prototype._resetLastErrorAndThrow = function () {
            var error = this._lastError || this._uncaughtPromiseErrors[0];
            this._uncaughtPromiseErrors.length = 0;
            this._lastError = null;
            throw error;
        };
        FakeAsyncTestZoneSpec.prototype.getCurrentTime = function () {
            return this._scheduler.getCurrentTime();
        };
        FakeAsyncTestZoneSpec.prototype.getCurrentRealTime = function () {
            return this._scheduler.getCurrentRealTime();
        };
        FakeAsyncTestZoneSpec.prototype.setCurrentRealTime = function (realTime) {
            this._scheduler.setCurrentRealTime(realTime);
        };
        FakeAsyncTestZoneSpec.patchDate = function () {
            if (global['Date'] === FakeDate) {
                // already patched
                return;
            }
            global['Date'] = FakeDate;
            FakeDate.prototype = OriginalDate.prototype;
            // try check and reset timers
            // because jasmine.clock().install() may
            // have replaced the global timer
            FakeAsyncTestZoneSpec.checkTimerPatch();
        };
        FakeAsyncTestZoneSpec.resetDate = function () {
            if (global['Date'] === FakeDate) {
                global['Date'] = OriginalDate;
            }
        };
        FakeAsyncTestZoneSpec.checkTimerPatch = function () {
            if (global.setTimeout !== timers.setTimeout) {
                global.setTimeout = timers.setTimeout;
                global.clearTimeout = timers.clearTimeout;
            }
            if (global.setInterval !== timers.setInterval) {
                global.setInterval = timers.setInterval;
                global.clearInterval = timers.clearInterval;
            }
        };
        FakeAsyncTestZoneSpec.prototype.lockDatePatch = function () {
            this.patchDateLocked = true;
            FakeAsyncTestZoneSpec.patchDate();
        };
        FakeAsyncTestZoneSpec.prototype.unlockDatePatch = function () {
            this.patchDateLocked = false;
            FakeAsyncTestZoneSpec.resetDate();
        };
        FakeAsyncTestZoneSpec.prototype.tick = function (millis, doTick) {
            if (millis === void 0) { millis = 0; }
            FakeAsyncTestZoneSpec.assertInZone();
            this.flushMicrotasks();
            this._scheduler.tick(millis, doTick);
            if (this._lastError !== null) {
                this._resetLastErrorAndThrow();
            }
        };
        FakeAsyncTestZoneSpec.prototype.flushMicrotasks = function () {
            var _this = this;
            FakeAsyncTestZoneSpec.assertInZone();
            var flushErrors = function () {
                if (_this._lastError !== null || _this._uncaughtPromiseErrors.length) {
                    // If there is an error stop processing the microtask queue and rethrow the error.
                    _this._resetLastErrorAndThrow();
                }
            };
            while (this._microtasks.length > 0) {
                var microtask = this._microtasks.shift();
                microtask.func.apply(microtask.target, microtask.args);
            }
            flushErrors();
        };
        FakeAsyncTestZoneSpec.prototype.flush = function (limit, flushPeriodic, doTick) {
            FakeAsyncTestZoneSpec.assertInZone();
            this.flushMicrotasks();
            var elapsed = this._scheduler.flush(limit, flushPeriodic, doTick);
            if (this._lastError !== null) {
                this._resetLastErrorAndThrow();
            }
            return elapsed;
        };
        FakeAsyncTestZoneSpec.prototype.onScheduleTask = function (delegate, current, target, task) {
            switch (task.type) {
                case 'microTask':
                    var args = task.data && task.data.args;
                    // should pass additional arguments to callback if have any
                    // currently we know process.nextTick will have such additional
                    // arguments
                    var additionalArgs = void 0;
                    if (args) {
                        var callbackIndex = task.data.cbIdx;
                        if (typeof args.length === 'number' && args.length > callbackIndex + 1) {
                            additionalArgs = Array.prototype.slice.call(args, callbackIndex + 1);
                        }
                    }
                    this._microtasks.push({
                        func: task.invoke,
                        args: additionalArgs,
                        target: task.data && task.data.target
                    });
                    break;
                case 'macroTask':
                    switch (task.source) {
                        case 'setTimeout':
                            task.data['handleId'] = this._setTimeout(task.invoke, task.data['delay'], Array.prototype.slice.call(task.data['args'], 2));
                            break;
                        case 'setImmediate':
                            task.data['handleId'] = this._setTimeout(task.invoke, 0, Array.prototype.slice.call(task.data['args'], 1));
                            break;
                        case 'setInterval':
                            task.data['handleId'] = this._setInterval(task.invoke, task.data['delay'], Array.prototype.slice.call(task.data['args'], 2));
                            break;
                        case 'XMLHttpRequest.send':
                            throw new Error('Cannot make XHRs from within a fake async test. Request URL: ' +
                                task.data['url']);
                        case 'requestAnimationFrame':
                        case 'webkitRequestAnimationFrame':
                        case 'mozRequestAnimationFrame':
                            // Simulate a requestAnimationFrame by using a setTimeout with 16 ms.
                            // (60 frames per second)
                            task.data['handleId'] = this._setTimeout(task.invoke, 16, task.data['args'], this.trackPendingRequestAnimationFrame);
                            break;
                        default:
                            // user can define which macroTask they want to support by passing
                            // macroTaskOptions
                            var macroTaskOption = this.findMacroTaskOption(task);
                            if (macroTaskOption) {
                                var args_1 = task.data && task.data['args'];
                                var delay = args_1 && args_1.length > 1 ? args_1[1] : 0;
                                var callbackArgs = macroTaskOption.callbackArgs ? macroTaskOption.callbackArgs : args_1;
                                if (!!macroTaskOption.isPeriodic) {
                                    // periodic macroTask, use setInterval to simulate
                                    task.data['handleId'] = this._setInterval(task.invoke, delay, callbackArgs);
                                    task.data.isPeriodic = true;
                                }
                                else {
                                    // not periodic, use setTimeout to simulate
                                    task.data['handleId'] = this._setTimeout(task.invoke, delay, callbackArgs);
                                }
                                break;
                            }
                            throw new Error('Unknown macroTask scheduled in fake async test: ' + task.source);
                    }
                    break;
                case 'eventTask':
                    task = delegate.scheduleTask(target, task);
                    break;
            }
            return task;
        };
        FakeAsyncTestZoneSpec.prototype.onCancelTask = function (delegate, current, target, task) {
            switch (task.source) {
                case 'setTimeout':
                case 'requestAnimationFrame':
                case 'webkitRequestAnimationFrame':
                case 'mozRequestAnimationFrame':
                    return this._clearTimeout(task.data['handleId']);
                case 'setInterval':
                    return this._clearInterval(task.data['handleId']);
                default:
                    // user can define which macroTask they want to support by passing
                    // macroTaskOptions
                    var macroTaskOption = this.findMacroTaskOption(task);
                    if (macroTaskOption) {
                        var handleId = task.data['handleId'];
                        return macroTaskOption.isPeriodic ? this._clearInterval(handleId) :
                            this._clearTimeout(handleId);
                    }
                    return delegate.cancelTask(target, task);
            }
        };
        FakeAsyncTestZoneSpec.prototype.onInvoke = function (delegate, current, target, callback, applyThis, applyArgs, source) {
            try {
                FakeAsyncTestZoneSpec.patchDate();
                return delegate.invoke(target, callback, applyThis, applyArgs, source);
            }
            finally {
                if (!this.patchDateLocked) {
                    FakeAsyncTestZoneSpec.resetDate();
                }
            }
        };
        FakeAsyncTestZoneSpec.prototype.findMacroTaskOption = function (task) {
            if (!this.macroTaskOptions) {
                return null;
            }
            for (var i = 0; i < this.macroTaskOptions.length; i++) {
                var macroTaskOption = this.macroTaskOptions[i];
                if (macroTaskOption.source === task.source) {
                    return macroTaskOption;
                }
            }
            return null;
        };
        FakeAsyncTestZoneSpec.prototype.onHandleError = function (parentZoneDelegate, currentZone, targetZone, error) {
            this._lastError = error;
            return false; // Don't propagate error to parent zone.
        };
        return FakeAsyncTestZoneSpec;
    }());
    // Export the class so that new instances can be created with proper
    // constructor params.
    Zone['FakeAsyncTestZoneSpec'] = FakeAsyncTestZoneSpec;
})(typeof window === 'object' && window || typeof self === 'object' && self || global);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1hc3luYy10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvem9uZS1zcGVjL2Zha2UtYXN5bmMtdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxDQUFDLFVBQVMsTUFBVztJQXVCckIsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNqQztRQUNFO1lBQ0UsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDMUIsSUFBTSxDQUFDLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztnQkFDN0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDMUIsT0FBTyxDQUFDLENBQUM7YUFDVjtpQkFBTTtnQkFDTCxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ25ELFlBQVcsWUFBWSxZQUFaLFlBQVksa0JBQUksSUFBSSxNQUFFO2FBQ2xDO1FBQ0gsQ0FBQztRQUVNLFlBQUcsR0FBVjtZQUNFLElBQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUN4RSxJQUFJLHFCQUFxQixFQUFFO2dCQUN6QixPQUFPLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFLEdBQUcscUJBQXFCLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDNUY7WUFDRCxPQUFPLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBQ0gsZUFBQztJQUFELENBQUMsQUFuQkQsSUFtQkM7SUFFQSxR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ZSxDQUFDO2lCQUN4QjthQUNGO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsNkNBQWEsR0FBYixVQUFjLGtCQUFnQyxFQUFFLFdBQWlCLEVBQUUsVUFBZ0IsRUFBRSxLQUFVO1lBRTdGLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLE9BQU8sS0FBSyxDQUFDLENBQUUsd0NBQXdDO1FBQ3pELENBQUM7UUFDSCw0QkFBQztJQUFELENBQUMsQUF0VkQsSUFzVkM7SUFFRCxvRUFBb0U7SUFDcEUsc0JBQXNCO0lBQ3JCLElBQVksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLHFCQUFxQixDQUFDO0FBQy9ELENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxNQUFNLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuKGZ1bmN0aW9uKGdsb2JhbDogYW55KSB7XG5pbnRlcmZhY2UgU2NoZWR1bGVkRnVuY3Rpb24ge1xuICBlbmRUaW1lOiBudW1iZXI7XG4gIGlkOiBudW1iZXI7XG4gIGZ1bmM6IEZ1bmN0aW9uO1xuICBhcmdzOiBhbnlbXTtcbiAgZGVsYXk6IG51bWJlcjtcbiAgaXNQZXJpb2RpYzogYm9vbGVhbjtcbiAgaXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWU6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBNaWNyb1Rhc2tTY2hlZHVsZWRGdW5jdGlvbiB7XG4gIGZ1bmM6IEZ1bmN0aW9uO1xuICBhcmdzPzogYW55W107XG4gIHRhcmdldDogYW55O1xufVxuXG5pbnRlcmZhY2UgTWFjcm9UYXNrT3B0aW9ucyB7XG4gIHNvdXJjZTogc3RyaW5nO1xuICBpc1BlcmlvZGljPzogYm9vbGVhbjtcbiAgY2FsbGJhY2tBcmdzPzogYW55O1xufVxuXG5jb25zdCBPcmlnaW5hbERhdGUgPSBnbG9iYWwuRGF0ZTtcbmNsYXNzIEZha2VEYXRlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgT3JpZ2luYWxEYXRlKCk7XG4gICAgICBkLnNldFRpbWUoRmFrZURhdGUubm93KCkpO1xuICAgICAgcmV0dXJuIGQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIG5ldyBPcmlnaW5hbERhdGUoLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5vdygpIHtcbiAgICBjb25zdCBmYWtlQXN5bmNUZXN0Wm9uZVNwZWMgPSBab25lLmN1cnJlbnQuZ2V0KCdGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnKTtcbiAgICBpZiAoZmFrZUFzeW5jVGVzdFpvbmVTcGVjKSB7XG4gICAgICByZXR1cm4gZmFrZUFzeW5jVGVzdFpvbmVTcGVjLmdldEN1cnJlbnRSZWFsVGltZSgpICsgZmFrZUFzeW5jVGVzdFpvbmVTcGVjLmdldEN1cnJlbnRUaW1lKCk7XG4gICAgfVxuICAgIHJldHVybiBPcmlnaW5hbERhdGUubm93LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cbn1cblxuKEZha2VEYXRlIGFzIGFueSkuVVRDID0gT3JpZ2luYWxEYXRlLlVUQztcbihGYWtlRGF0ZSBhcyBhbnkpLnBhcnNlID0gT3JpZ2luYWxEYXRlLnBhcnNlO1xuXG4vLyBrZWVwIGEgcmVmZXJlbmNlIGZvciB6b25lIHBhdGNoZWQgdGltZXIgZnVuY3Rpb25cbmNvbnN0IHRpbWVycyA9IHtcbiAgc2V0VGltZW91dDogZ2xvYmFsLnNldFRpbWVvdXQsXG4gIHNldEludGVydmFsOiBnbG9iYWwuc2V0SW50ZXJ2YWwsXG4gIGNsZWFyVGltZW91dDogZ2xvYmFsLmNsZWFyVGltZW91dCxcbiAgY2xlYXJJbnRlcnZhbDogZ2xvYmFsLmNsZWFySW50ZXJ2YWxcbn07XG5cbmNsYXNzIFNjaGVkdWxlciB7XG4gIC8vIE5leHQgc2NoZWR1bGVyIGlkLlxuICBwdWJsaWMgbmV4dElkOiBudW1iZXIgPSAxO1xuXG4gIC8vIFNjaGVkdWxlciBxdWV1ZSB3aXRoIHRoZSB0dXBsZSBvZiBlbmQgdGltZSBhbmQgY2FsbGJhY2sgZnVuY3Rpb24gLSBzb3J0ZWQgYnkgZW5kIHRpbWUuXG4gIHByaXZhdGUgX3NjaGVkdWxlclF1ZXVlOiBTY2hlZHVsZWRGdW5jdGlvbltdID0gW107XG4gIC8vIEN1cnJlbnQgc2ltdWxhdGVkIHRpbWUgaW4gbWlsbGlzLlxuICBwcml2YXRlIF9jdXJyZW50VGltZTogbnVtYmVyID0gMDtcbiAgLy8gQ3VycmVudCByZWFsIHRpbWUgaW4gbWlsbGlzLlxuICBwcml2YXRlIF9jdXJyZW50UmVhbFRpbWU6IG51bWJlciA9IE9yaWdpbmFsRGF0ZS5ub3coKTtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgZ2V0Q3VycmVudFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRUaW1lO1xuICB9XG5cbiAgZ2V0Q3VycmVudFJlYWxUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50UmVhbFRpbWU7XG4gIH1cblxuICBzZXRDdXJyZW50UmVhbFRpbWUocmVhbFRpbWU6IG51bWJlcikge1xuICAgIHRoaXMuX2N1cnJlbnRSZWFsVGltZSA9IHJlYWxUaW1lO1xuICB9XG5cbiAgc2NoZWR1bGVGdW5jdGlvbihcbiAgICAgIGNiOiBGdW5jdGlvbiwgZGVsYXk6IG51bWJlciwgYXJnczogYW55W10gPSBbXSwgaXNQZXJpb2RpYzogYm9vbGVhbiA9IGZhbHNlLFxuICAgICAgaXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWU6IGJvb2xlYW4gPSBmYWxzZSwgaWQ6IG51bWJlciA9IC0xKTogbnVtYmVyIHtcbiAgICBsZXQgY3VycmVudElkOiBudW1iZXIgPSBpZCA8IDAgPyB0aGlzLm5leHRJZCsrIDogaWQ7XG4gICAgbGV0IGVuZFRpbWUgPSB0aGlzLl9jdXJyZW50VGltZSArIGRlbGF5O1xuXG4gICAgLy8gSW5zZXJ0IHNvIHRoYXQgc2NoZWR1bGVyIHF1ZXVlIHJlbWFpbnMgc29ydGVkIGJ5IGVuZCB0aW1lLlxuICAgIGxldCBuZXdFbnRyeTogU2NoZWR1bGVkRnVuY3Rpb24gPSB7XG4gICAgICBlbmRUaW1lOiBlbmRUaW1lLFxuICAgICAgaWQ6IGN1cnJlbnRJZCxcbiAgICAgIGZ1bmM6IGNiLFxuICAgICAgYXJnczogYXJncyxcbiAgICAgIGRlbGF5OiBkZWxheSxcbiAgICAgIGlzUGVyaW9kaWM6IGlzUGVyaW9kaWMsXG4gICAgICBpc1JlcXVlc3RBbmltYXRpb25GcmFtZTogaXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICB9O1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKDsgaSA8IHRoaXMuX3NjaGVkdWxlclF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgY3VycmVudEVudHJ5ID0gdGhpcy5fc2NoZWR1bGVyUXVldWVbaV07XG4gICAgICBpZiAobmV3RW50cnkuZW5kVGltZSA8IGN1cnJlbnRFbnRyeS5lbmRUaW1lKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9zY2hlZHVsZXJRdWV1ZS5zcGxpY2UoaSwgMCwgbmV3RW50cnkpO1xuICAgIHJldHVybiBjdXJyZW50SWQ7XG4gIH1cblxuICByZW1vdmVTY2hlZHVsZWRGdW5jdGlvbldpdGhJZChpZDogbnVtYmVyKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zY2hlZHVsZXJRdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMuX3NjaGVkdWxlclF1ZXVlW2ldLmlkID09IGlkKSB7XG4gICAgICAgIHRoaXMuX3NjaGVkdWxlclF1ZXVlLnNwbGljZShpLCAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGljayhtaWxsaXM6IG51bWJlciA9IDAsIGRvVGljaz86IChlbGFwc2VkOiBudW1iZXIpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBsZXQgZmluYWxUaW1lID0gdGhpcy5fY3VycmVudFRpbWUgKyBtaWxsaXM7XG4gICAgbGV0IGxhc3RDdXJyZW50VGltZSA9IDA7XG4gICAgaWYgKHRoaXMuX3NjaGVkdWxlclF1ZXVlLmxlbmd0aCA9PT0gMCAmJiBkb1RpY2spIHtcbiAgICAgIGRvVGljayhtaWxsaXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB3aGlsZSAodGhpcy5fc2NoZWR1bGVyUXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IGN1cnJlbnQgPSB0aGlzLl9zY2hlZHVsZXJRdWV1ZVswXTtcbiAgICAgIGlmIChmaW5hbFRpbWUgPCBjdXJyZW50LmVuZFRpbWUpIHtcbiAgICAgICAgLy8gRG9uZSBwcm9jZXNzaW5nIHRoZSBxdWV1ZSBzaW5jZSBpdCdzIHNvcnRlZCBieSBlbmRUaW1lLlxuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRpbWUgdG8gcnVuIHNjaGVkdWxlZCBmdW5jdGlvbi4gUmVtb3ZlIGl0IGZyb20gdGhlIGhlYWQgb2YgcXVldWUuXG4gICAgICAgIGxldCBjdXJyZW50ID0gdGhpcy5fc2NoZWR1bGVyUXVldWUuc2hpZnQoKSE7XG4gICAgICAgIGxhc3RDdXJyZW50VGltZSA9IHRoaXMuX2N1cnJlbnRUaW1lO1xuICAgICAgICB0aGlzLl9jdXJyZW50VGltZSA9IGN1cnJlbnQuZW5kVGltZTtcbiAgICAgICAgaWYgKGRvVGljaykge1xuICAgICAgICAgIGRvVGljayh0aGlzLl9jdXJyZW50VGltZSAtIGxhc3RDdXJyZW50VGltZSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJldHZhbCA9IGN1cnJlbnQuZnVuYy5hcHBseShnbG9iYWwsIGN1cnJlbnQuYXJncyk7XG4gICAgICAgIGlmICghcmV0dmFsKSB7XG4gICAgICAgICAgLy8gVW5jYXVnaHQgZXhjZXB0aW9uIGluIHRoZSBjdXJyZW50IHNjaGVkdWxlZCBmdW5jdGlvbi4gU3RvcCBwcm9jZXNzaW5nIHRoZSBxdWV1ZS5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBsYXN0Q3VycmVudFRpbWUgPSB0aGlzLl9jdXJyZW50VGltZTtcbiAgICB0aGlzLl9jdXJyZW50VGltZSA9IGZpbmFsVGltZTtcbiAgICBpZiAoZG9UaWNrKSB7XG4gICAgICBkb1RpY2sodGhpcy5fY3VycmVudFRpbWUgLSBsYXN0Q3VycmVudFRpbWUpO1xuICAgIH1cbiAgfVxuXG4gIGZsdXNoKGxpbWl0ID0gMjAsIGZsdXNoUGVyaW9kaWMgPSBmYWxzZSwgZG9UaWNrPzogKGVsYXBzZWQ6IG51bWJlcikgPT4gdm9pZCk6IG51bWJlciB7XG4gICAgaWYgKGZsdXNoUGVyaW9kaWMpIHtcbiAgICAgIHJldHVybiB0aGlzLmZsdXNoUGVyaW9kaWMoZG9UaWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZmx1c2hOb25QZXJpb2RpYyhsaW1pdCwgZG9UaWNrKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZsdXNoUGVyaW9kaWMoZG9UaWNrPzogKGVsYXBzZWQ6IG51bWJlcikgPT4gdm9pZCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMuX3NjaGVkdWxlclF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIC8vIEZpbmQgdGhlIGxhc3QgdGFzayBjdXJyZW50bHkgcXVldWVkIGluIHRoZSBzY2hlZHVsZXIgcXVldWUgYW5kIHRpY2tcbiAgICAvLyB0aWxsIHRoYXQgdGltZS5cbiAgICBjb25zdCBzdGFydFRpbWUgPSB0aGlzLl9jdXJyZW50VGltZTtcbiAgICBjb25zdCBsYXN0VGFzayA9IHRoaXMuX3NjaGVkdWxlclF1ZXVlW3RoaXMuX3NjaGVkdWxlclF1ZXVlLmxlbmd0aCAtIDFdO1xuICAgIHRoaXMudGljayhsYXN0VGFzay5lbmRUaW1lIC0gc3RhcnRUaW1lLCBkb1RpY2spO1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50VGltZSAtIHN0YXJ0VGltZTtcbiAgfVxuXG4gIHByaXZhdGUgZmx1c2hOb25QZXJpb2RpYyhsaW1pdDogbnVtYmVyLCBkb1RpY2s/OiAoZWxhcHNlZDogbnVtYmVyKSA9PiB2b2lkKTogbnVtYmVyIHtcbiAgICBjb25zdCBzdGFydFRpbWUgPSB0aGlzLl9jdXJyZW50VGltZTtcbiAgICBsZXQgbGFzdEN1cnJlbnRUaW1lID0gMDtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHdoaWxlICh0aGlzLl9zY2hlZHVsZXJRdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBjb3VudCsrO1xuICAgICAgaWYgKGNvdW50ID4gbGltaXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgJ2ZsdXNoIGZhaWxlZCBhZnRlciByZWFjaGluZyB0aGUgbGltaXQgb2YgJyArIGxpbWl0ICtcbiAgICAgICAgICAgICcgdGFza3MuIERvZXMgeW91ciBjb2RlIHVzZSBhIHBvbGxpbmcgdGltZW91dD8nKTtcbiAgICAgIH1cblxuICAgICAgLy8gZmx1c2ggb25seSBub24tcGVyaW9kaWMgdGltZXJzLlxuICAgICAgLy8gSWYgdGhlIG9ubHkgcmVtYWluaW5nIHRhc2tzIGFyZSBwZXJpb2RpYyhvciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUpLCBmaW5pc2ggZmx1c2hpbmcuXG4gICAgICBpZiAodGhpcy5fc2NoZWR1bGVyUXVldWUuZmlsdGVyKHRhc2sgPT4gIXRhc2suaXNQZXJpb2RpYyAmJiAhdGFzay5pc1JlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgICAgICAgICAgICAgLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMuX3NjaGVkdWxlclF1ZXVlLnNoaWZ0KCkhO1xuICAgICAgbGFzdEN1cnJlbnRUaW1lID0gdGhpcy5fY3VycmVudFRpbWU7XG4gICAgICB0aGlzLl9jdXJyZW50VGltZSA9IGN1cnJlbnQuZW5kVGltZTtcbiAgICAgIGlmIChkb1RpY2spIHtcbiAgICAgICAgLy8gVXBkYXRlIGFueSBzZWNvbmRhcnkgc2NoZWR1bGVycyBsaWtlIEphc21pbmUgbW9jayBEYXRlLlxuICAgICAgICBkb1RpY2sodGhpcy5fY3VycmVudFRpbWUgLSBsYXN0Q3VycmVudFRpbWUpO1xuICAgICAgfVxuICAgICAgY29uc3QgcmV0dmFsID0gY3VycmVudC5mdW5jLmFwcGx5KGdsb2JhbCwgY3VycmVudC5hcmdzKTtcbiAgICAgIGlmICghcmV0dmFsKSB7XG4gICAgICAgIC8vIFVuY2F1Z2h0IGV4Y2VwdGlvbiBpbiB0aGUgY3VycmVudCBzY2hlZHVsZWQgZnVuY3Rpb24uIFN0b3AgcHJvY2Vzc2luZyB0aGUgcXVldWUuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFRpbWUgLSBzdGFydFRpbWU7XG4gIH1cbn1cblxuY2xhc3MgRmFrZUFzeW5jVGVzdFpvbmVTcGVjIGltcGxlbWVudHMgWm9uZVNwZWMge1xuICBzdGF0aWMgYXNzZXJ0SW5ab25lKCk6IHZvaWQge1xuICAgIGlmIChab25lLmN1cnJlbnQuZ2V0KCdGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnKSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb2RlIHNob3VsZCBiZSBydW5uaW5nIGluIHRoZSBmYWtlQXN5bmMgem9uZSB0byBjYWxsIHRoaXMgZnVuY3Rpb24nKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zY2hlZHVsZXI6IFNjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoKTtcbiAgcHJpdmF0ZSBfbWljcm90YXNrczogTWljcm9UYXNrU2NoZWR1bGVkRnVuY3Rpb25bXSA9IFtdO1xuICBwcml2YXRlIF9sYXN0RXJyb3I6IEVycm9yfG51bGwgPSBudWxsO1xuICBwcml2YXRlIF91bmNhdWdodFByb21pc2VFcnJvcnM6IHtyZWplY3Rpb246IGFueX1bXSA9XG4gICAgICAoUHJvbWlzZSBhcyBhbnkpWyhab25lIGFzIGFueSkuX19zeW1ib2xfXygndW5jYXVnaHRQcm9taXNlRXJyb3JzJyldO1xuXG4gIHBlbmRpbmdQZXJpb2RpY1RpbWVyczogbnVtYmVyW10gPSBbXTtcbiAgcGVuZGluZ1RpbWVyczogbnVtYmVyW10gPSBbXTtcblxuICBwcml2YXRlIHBhdGNoRGF0ZUxvY2tlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgbmFtZVByZWZpeDogc3RyaW5nLCBwcml2YXRlIHRyYWNrUGVuZGluZ1JlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZhbHNlLFxuICAgICAgcHJpdmF0ZSBtYWNyb1Rhc2tPcHRpb25zPzogTWFjcm9UYXNrT3B0aW9uc1tdKSB7XG4gICAgdGhpcy5uYW1lID0gJ2Zha2VBc3luY1Rlc3Rab25lIGZvciAnICsgbmFtZVByZWZpeDtcbiAgICAvLyBpbiBjYXNlIHVzZXIgY2FuJ3QgYWNjZXNzIHRoZSBjb25zdHJ1Y3Rpb24gb2YgRmFrZUFzeW5jVGVzdFNwZWNcbiAgICAvLyB1c2VyIGNhbiBhbHNvIGRlZmluZSBtYWNyb1Rhc2tPcHRpb25zIGJ5IGRlZmluZSBhIGdsb2JhbCB2YXJpYWJsZS5cbiAgICBpZiAoIXRoaXMubWFjcm9UYXNrT3B0aW9ucykge1xuICAgICAgdGhpcy5tYWNyb1Rhc2tPcHRpb25zID0gZ2xvYmFsW1pvbmUuX19zeW1ib2xfXygnRmFrZUFzeW5jVGVzdE1hY3JvVGFzaycpXTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9mbkFuZEZsdXNoKGZuOiBGdW5jdGlvbiwgY29tcGxldGVyczoge29uU3VjY2Vzcz86IEZ1bmN0aW9uLCBvbkVycm9yPzogRnVuY3Rpb259KTpcbiAgICAgIEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKTogYm9vbGVhbiA9PiB7XG4gICAgICBmbi5hcHBseShnbG9iYWwsIGFyZ3MpO1xuXG4gICAgICBpZiAodGhpcy5fbGFzdEVycm9yID09PSBudWxsKSB7ICAvLyBTdWNjZXNzXG4gICAgICAgIGlmIChjb21wbGV0ZXJzLm9uU3VjY2VzcyAhPSBudWxsKSB7XG4gICAgICAgICAgY29tcGxldGVycy5vblN1Y2Nlc3MuYXBwbHkoZ2xvYmFsKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGbHVzaCBtaWNyb3Rhc2tzIG9ubHkgb24gc3VjY2Vzcy5cbiAgICAgICAgdGhpcy5mbHVzaE1pY3JvdGFza3MoKTtcbiAgICAgIH0gZWxzZSB7ICAvLyBGYWlsdXJlXG4gICAgICAgIGlmIChjb21wbGV0ZXJzLm9uRXJyb3IgIT0gbnVsbCkge1xuICAgICAgICAgIGNvbXBsZXRlcnMub25FcnJvci5hcHBseShnbG9iYWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBSZXR1cm4gdHJ1ZSBpZiB0aGVyZSB3ZXJlIG5vIGVycm9ycywgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgcmV0dXJuIHRoaXMuX2xhc3RFcnJvciA9PT0gbnVsbDtcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX3JlbW92ZVRpbWVyKHRpbWVyczogbnVtYmVyW10sIGlkOiBudW1iZXIpOiB2b2lkIHtcbiAgICBsZXQgaW5kZXggPSB0aW1lcnMuaW5kZXhPZihpZCk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRpbWVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2RlcXVldWVUaW1lcihpZDogbnVtYmVyKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMuX3JlbW92ZVRpbWVyKHRoaXMucGVuZGluZ1RpbWVycywgaWQpO1xuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9yZXF1ZXVlUGVyaW9kaWNUaW1lcihmbjogRnVuY3Rpb24sIGludGVydmFsOiBudW1iZXIsIGFyZ3M6IGFueVtdLCBpZDogbnVtYmVyKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAvLyBSZXF1ZXVlIHRoZSB0aW1lciBjYWxsYmFjayBpZiBpdCdzIG5vdCBiZWVuIGNhbmNlbGVkLlxuICAgICAgaWYgKHRoaXMucGVuZGluZ1BlcmlvZGljVGltZXJzLmluZGV4T2YoaWQpICE9PSAtMSkge1xuICAgICAgICB0aGlzLl9zY2hlZHVsZXIuc2NoZWR1bGVGdW5jdGlvbihmbiwgaW50ZXJ2YWwsIGFyZ3MsIHRydWUsIGZhbHNlLCBpZCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgX2RlcXVldWVQZXJpb2RpY1RpbWVyKGlkOiBudW1iZXIpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIEZha2VBc3luY1Rlc3Rab25lU3BlYy5fcmVtb3ZlVGltZXIodGhpcy5wZW5kaW5nUGVyaW9kaWNUaW1lcnMsIGlkKTtcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0VGltZW91dChmbjogRnVuY3Rpb24sIGRlbGF5OiBudW1iZXIsIGFyZ3M6IGFueVtdLCBpc1RpbWVyID0gdHJ1ZSk6IG51bWJlciB7XG4gICAgbGV0IHJlbW92ZVRpbWVyRm4gPSB0aGlzLl9kZXF1ZXVlVGltZXIodGhpcy5fc2NoZWR1bGVyLm5leHRJZCk7XG4gICAgLy8gUXVldWUgdGhlIGNhbGxiYWNrIGFuZCBkZXF1ZXVlIHRoZSB0aW1lciBvbiBzdWNjZXNzIGFuZCBlcnJvci5cbiAgICBsZXQgY2IgPSB0aGlzLl9mbkFuZEZsdXNoKGZuLCB7b25TdWNjZXNzOiByZW1vdmVUaW1lckZuLCBvbkVycm9yOiByZW1vdmVUaW1lckZufSk7XG4gICAgbGV0IGlkID0gdGhpcy5fc2NoZWR1bGVyLnNjaGVkdWxlRnVuY3Rpb24oY2IsIGRlbGF5LCBhcmdzLCBmYWxzZSwgIWlzVGltZXIpO1xuICAgIGlmIChpc1RpbWVyKSB7XG4gICAgICB0aGlzLnBlbmRpbmdUaW1lcnMucHVzaChpZCk7XG4gICAgfVxuICAgIHJldHVybiBpZDtcbiAgfVxuXG4gIHByaXZhdGUgX2NsZWFyVGltZW91dChpZDogbnVtYmVyKTogdm9pZCB7XG4gICAgRmFrZUFzeW5jVGVzdFpvbmVTcGVjLl9yZW1vdmVUaW1lcih0aGlzLnBlbmRpbmdUaW1lcnMsIGlkKTtcbiAgICB0aGlzLl9zY2hlZHVsZXIucmVtb3ZlU2NoZWR1bGVkRnVuY3Rpb25XaXRoSWQoaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0SW50ZXJ2YWwoZm46IEZ1bmN0aW9uLCBpbnRlcnZhbDogbnVtYmVyLCBhcmdzOiBhbnlbXSk6IG51bWJlciB7XG4gICAgbGV0IGlkID0gdGhpcy5fc2NoZWR1bGVyLm5leHRJZDtcbiAgICBsZXQgY29tcGxldGVycyA9IHtvblN1Y2Nlc3M6IG51bGwgYXMgYW55LCBvbkVycm9yOiB0aGlzLl9kZXF1ZXVlUGVyaW9kaWNUaW1lcihpZCl9O1xuICAgIGxldCBjYiA9IHRoaXMuX2ZuQW5kRmx1c2goZm4sIGNvbXBsZXRlcnMpO1xuXG4gICAgLy8gVXNlIHRoZSBjYWxsYmFjayBjcmVhdGVkIGFib3ZlIHRvIHJlcXVldWUgb24gc3VjY2Vzcy5cbiAgICBjb21wbGV0ZXJzLm9uU3VjY2VzcyA9IHRoaXMuX3JlcXVldWVQZXJpb2RpY1RpbWVyKGNiLCBpbnRlcnZhbCwgYXJncywgaWQpO1xuXG4gICAgLy8gUXVldWUgdGhlIGNhbGxiYWNrIGFuZCBkZXF1ZXVlIHRoZSBwZXJpb2RpYyB0aW1lciBvbmx5IG9uIGVycm9yLlxuICAgIHRoaXMuX3NjaGVkdWxlci5zY2hlZHVsZUZ1bmN0aW9uKGNiLCBpbnRlcnZhbCwgYXJncywgdHJ1ZSk7XG4gICAgdGhpcy5wZW5kaW5nUGVyaW9kaWNUaW1lcnMucHVzaChpZCk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2xlYXJJbnRlcnZhbChpZDogbnVtYmVyKTogdm9pZCB7XG4gICAgRmFrZUFzeW5jVGVzdFpvbmVTcGVjLl9yZW1vdmVUaW1lcih0aGlzLnBlbmRpbmdQZXJpb2RpY1RpbWVycywgaWQpO1xuICAgIHRoaXMuX3NjaGVkdWxlci5yZW1vdmVTY2hlZHVsZWRGdW5jdGlvbldpdGhJZChpZCk7XG4gIH1cblxuICBwcml2YXRlIF9yZXNldExhc3RFcnJvckFuZFRocm93KCk6IHZvaWQge1xuICAgIGxldCBlcnJvciA9IHRoaXMuX2xhc3RFcnJvciB8fCB0aGlzLl91bmNhdWdodFByb21pc2VFcnJvcnNbMF07XG4gICAgdGhpcy5fdW5jYXVnaHRQcm9taXNlRXJyb3JzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fbGFzdEVycm9yID0gbnVsbDtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxuXG4gIGdldEN1cnJlbnRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zY2hlZHVsZXIuZ2V0Q3VycmVudFRpbWUoKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRSZWFsVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2NoZWR1bGVyLmdldEN1cnJlbnRSZWFsVGltZSgpO1xuICB9XG5cbiAgc2V0Q3VycmVudFJlYWxUaW1lKHJlYWxUaW1lOiBudW1iZXIpIHtcbiAgICB0aGlzLl9zY2hlZHVsZXIuc2V0Q3VycmVudFJlYWxUaW1lKHJlYWxUaW1lKTtcbiAgfVxuXG4gIHN0YXRpYyBwYXRjaERhdGUoKSB7XG4gICAgaWYgKGdsb2JhbFsnRGF0ZSddID09PSBGYWtlRGF0ZSkge1xuICAgICAgLy8gYWxyZWFkeSBwYXRjaGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGdsb2JhbFsnRGF0ZSddID0gRmFrZURhdGU7XG4gICAgRmFrZURhdGUucHJvdG90eXBlID0gT3JpZ2luYWxEYXRlLnByb3RvdHlwZTtcblxuICAgIC8vIHRyeSBjaGVjayBhbmQgcmVzZXQgdGltZXJzXG4gICAgLy8gYmVjYXVzZSBqYXNtaW5lLmNsb2NrKCkuaW5zdGFsbCgpIG1heVxuICAgIC8vIGhhdmUgcmVwbGFjZWQgdGhlIGdsb2JhbCB0aW1lclxuICAgIEZha2VBc3luY1Rlc3Rab25lU3BlYy5jaGVja1RpbWVyUGF0Y2goKTtcbiAgfVxuXG4gIHN0YXRpYyByZXNldERhdGUoKSB7XG4gICAgaWYgKGdsb2JhbFsnRGF0ZSddID09PSBGYWtlRGF0ZSkge1xuICAgICAgZ2xvYmFsWydEYXRlJ10gPSBPcmlnaW5hbERhdGU7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGNoZWNrVGltZXJQYXRjaCgpIHtcbiAgICBpZiAoZ2xvYmFsLnNldFRpbWVvdXQgIT09IHRpbWVycy5zZXRUaW1lb3V0KSB7XG4gICAgICBnbG9iYWwuc2V0VGltZW91dCA9IHRpbWVycy5zZXRUaW1lb3V0O1xuICAgICAgZ2xvYmFsLmNsZWFyVGltZW91dCA9IHRpbWVycy5jbGVhclRpbWVvdXQ7XG4gICAgfVxuICAgIGlmIChnbG9iYWwuc2V0SW50ZXJ2YWwgIT09IHRpbWVycy5zZXRJbnRlcnZhbCkge1xuICAgICAgZ2xvYmFsLnNldEludGVydmFsID0gdGltZXJzLnNldEludGVydmFsO1xuICAgICAgZ2xvYmFsLmNsZWFySW50ZXJ2YWwgPSB0aW1lcnMuY2xlYXJJbnRlcnZhbDtcbiAgICB9XG4gIH1cblxuICBsb2NrRGF0ZVBhdGNoKCkge1xuICAgIHRoaXMucGF0Y2hEYXRlTG9ja2VkID0gdHJ1ZTtcbiAgICBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMucGF0Y2hEYXRlKCk7XG4gIH1cbiAgdW5sb2NrRGF0ZVBhdGNoKCkge1xuICAgIHRoaXMucGF0Y2hEYXRlTG9ja2VkID0gZmFsc2U7XG4gICAgRmFrZUFzeW5jVGVzdFpvbmVTcGVjLnJlc2V0RGF0ZSgpO1xuICB9XG5cbiAgdGljayhtaWxsaXM6IG51bWJlciA9IDAsIGRvVGljaz86IChlbGFwc2VkOiBudW1iZXIpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMuYXNzZXJ0SW5ab25lKCk7XG4gICAgdGhpcy5mbHVzaE1pY3JvdGFza3MoKTtcbiAgICB0aGlzLl9zY2hlZHVsZXIudGljayhtaWxsaXMsIGRvVGljayk7XG4gICAgaWYgKHRoaXMuX2xhc3RFcnJvciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fcmVzZXRMYXN0RXJyb3JBbmRUaHJvdygpO1xuICAgIH1cbiAgfVxuXG4gIGZsdXNoTWljcm90YXNrcygpOiB2b2lkIHtcbiAgICBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMuYXNzZXJ0SW5ab25lKCk7XG4gICAgY29uc3QgZmx1c2hFcnJvcnMgPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fbGFzdEVycm9yICE9PSBudWxsIHx8IHRoaXMuX3VuY2F1Z2h0UHJvbWlzZUVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gZXJyb3Igc3RvcCBwcm9jZXNzaW5nIHRoZSBtaWNyb3Rhc2sgcXVldWUgYW5kIHJldGhyb3cgdGhlIGVycm9yLlxuICAgICAgICB0aGlzLl9yZXNldExhc3RFcnJvckFuZFRocm93KCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZSAodGhpcy5fbWljcm90YXNrcy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgbWljcm90YXNrID0gdGhpcy5fbWljcm90YXNrcy5zaGlmdCgpITtcbiAgICAgIG1pY3JvdGFzay5mdW5jLmFwcGx5KG1pY3JvdGFzay50YXJnZXQsIG1pY3JvdGFzay5hcmdzKTtcbiAgICB9XG4gICAgZmx1c2hFcnJvcnMoKTtcbiAgfVxuXG4gIGZsdXNoKGxpbWl0PzogbnVtYmVyLCBmbHVzaFBlcmlvZGljPzogYm9vbGVhbiwgZG9UaWNrPzogKGVsYXBzZWQ6IG51bWJlcikgPT4gdm9pZCk6IG51bWJlciB7XG4gICAgRmFrZUFzeW5jVGVzdFpvbmVTcGVjLmFzc2VydEluWm9uZSgpO1xuICAgIHRoaXMuZmx1c2hNaWNyb3Rhc2tzKCk7XG4gICAgY29uc3QgZWxhcHNlZCA9IHRoaXMuX3NjaGVkdWxlci5mbHVzaChsaW1pdCwgZmx1c2hQZXJpb2RpYywgZG9UaWNrKTtcbiAgICBpZiAodGhpcy5fbGFzdEVycm9yICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9yZXNldExhc3RFcnJvckFuZFRocm93KCk7XG4gICAgfVxuICAgIHJldHVybiBlbGFwc2VkO1xuICB9XG5cbiAgLy8gWm9uZVNwZWMgaW1wbGVtZW50YXRpb24gYmVsb3cuXG5cbiAgbmFtZTogc3RyaW5nO1xuXG4gIHByb3BlcnRpZXM6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0geydGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnOiB0aGlzfTtcblxuICBvblNjaGVkdWxlVGFzayhkZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50OiBab25lLCB0YXJnZXQ6IFpvbmUsIHRhc2s6IFRhc2spOiBUYXNrIHtcbiAgICBzd2l0Y2ggKHRhc2sudHlwZSkge1xuICAgICAgY2FzZSAnbWljcm9UYXNrJzpcbiAgICAgICAgbGV0IGFyZ3MgPSB0YXNrLmRhdGEgJiYgKHRhc2suZGF0YSBhcyBhbnkpLmFyZ3M7XG4gICAgICAgIC8vIHNob3VsZCBwYXNzIGFkZGl0aW9uYWwgYXJndW1lbnRzIHRvIGNhbGxiYWNrIGlmIGhhdmUgYW55XG4gICAgICAgIC8vIGN1cnJlbnRseSB3ZSBrbm93IHByb2Nlc3MubmV4dFRpY2sgd2lsbCBoYXZlIHN1Y2ggYWRkaXRpb25hbFxuICAgICAgICAvLyBhcmd1bWVudHNcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxBcmdzOiBhbnlbXXx1bmRlZmluZWQ7XG4gICAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgICAgbGV0IGNhbGxiYWNrSW5kZXggPSAodGFzay5kYXRhIGFzIGFueSkuY2JJZHg7XG4gICAgICAgICAgaWYgKHR5cGVvZiBhcmdzLmxlbmd0aCA9PT0gJ251bWJlcicgJiYgYXJncy5sZW5ndGggPiBjYWxsYmFja0luZGV4ICsgMSkge1xuICAgICAgICAgICAgYWRkaXRpb25hbEFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLCBjYWxsYmFja0luZGV4ICsgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21pY3JvdGFza3MucHVzaCh7XG4gICAgICAgICAgZnVuYzogdGFzay5pbnZva2UsXG4gICAgICAgICAgYXJnczogYWRkaXRpb25hbEFyZ3MsXG4gICAgICAgICAgdGFyZ2V0OiB0YXNrLmRhdGEgJiYgKHRhc2suZGF0YSBhcyBhbnkpLnRhcmdldFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtYWNyb1Rhc2snOlxuICAgICAgICBzd2l0Y2ggKHRhc2suc291cmNlKSB7XG4gICAgICAgICAgY2FzZSAnc2V0VGltZW91dCc6XG4gICAgICAgICAgICB0YXNrLmRhdGEhWydoYW5kbGVJZCddID0gdGhpcy5fc2V0VGltZW91dChcbiAgICAgICAgICAgICAgICB0YXNrLmludm9rZSwgdGFzay5kYXRhIVsnZGVsYXknXSEsXG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoKHRhc2suZGF0YSBhcyBhbnkpWydhcmdzJ10sIDIpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3NldEltbWVkaWF0ZSc6XG4gICAgICAgICAgICB0YXNrLmRhdGEhWydoYW5kbGVJZCddID0gdGhpcy5fc2V0VGltZW91dChcbiAgICAgICAgICAgICAgICB0YXNrLmludm9rZSwgMCwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoKHRhc2suZGF0YSBhcyBhbnkpWydhcmdzJ10sIDEpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3NldEludGVydmFsJzpcbiAgICAgICAgICAgIHRhc2suZGF0YSFbJ2hhbmRsZUlkJ10gPSB0aGlzLl9zZXRJbnRlcnZhbChcbiAgICAgICAgICAgICAgICB0YXNrLmludm9rZSwgdGFzay5kYXRhIVsnZGVsYXknXSEsXG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoKHRhc2suZGF0YSBhcyBhbnkpWydhcmdzJ10sIDIpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ1hNTEh0dHBSZXF1ZXN0LnNlbmQnOlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICdDYW5ub3QgbWFrZSBYSFJzIGZyb20gd2l0aGluIGEgZmFrZSBhc3luYyB0ZXN0LiBSZXF1ZXN0IFVSTDogJyArXG4gICAgICAgICAgICAgICAgKHRhc2suZGF0YSBhcyBhbnkpWyd1cmwnXSk7XG4gICAgICAgICAgY2FzZSAncmVxdWVzdEFuaW1hdGlvbkZyYW1lJzpcbiAgICAgICAgICBjYXNlICd3ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnOlxuICAgICAgICAgIGNhc2UgJ21velJlcXVlc3RBbmltYXRpb25GcmFtZSc6XG4gICAgICAgICAgICAvLyBTaW11bGF0ZSBhIHJlcXVlc3RBbmltYXRpb25GcmFtZSBieSB1c2luZyBhIHNldFRpbWVvdXQgd2l0aCAxNiBtcy5cbiAgICAgICAgICAgIC8vICg2MCBmcmFtZXMgcGVyIHNlY29uZClcbiAgICAgICAgICAgIHRhc2suZGF0YSFbJ2hhbmRsZUlkJ10gPSB0aGlzLl9zZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgIHRhc2suaW52b2tlLCAxNiwgKHRhc2suZGF0YSBhcyBhbnkpWydhcmdzJ10sXG4gICAgICAgICAgICAgICAgdGhpcy50cmFja1BlbmRpbmdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIC8vIHVzZXIgY2FuIGRlZmluZSB3aGljaCBtYWNyb1Rhc2sgdGhleSB3YW50IHRvIHN1cHBvcnQgYnkgcGFzc2luZ1xuICAgICAgICAgICAgLy8gbWFjcm9UYXNrT3B0aW9uc1xuICAgICAgICAgICAgY29uc3QgbWFjcm9UYXNrT3B0aW9uID0gdGhpcy5maW5kTWFjcm9UYXNrT3B0aW9uKHRhc2spO1xuICAgICAgICAgICAgaWYgKG1hY3JvVGFza09wdGlvbikge1xuICAgICAgICAgICAgICBjb25zdCBhcmdzID0gdGFzay5kYXRhICYmICh0YXNrLmRhdGEgYXMgYW55KVsnYXJncyddO1xuICAgICAgICAgICAgICBjb25zdCBkZWxheSA9IGFyZ3MgJiYgYXJncy5sZW5ndGggPiAxID8gYXJnc1sxXSA6IDA7XG4gICAgICAgICAgICAgIGxldCBjYWxsYmFja0FyZ3MgPSBtYWNyb1Rhc2tPcHRpb24uY2FsbGJhY2tBcmdzID8gbWFjcm9UYXNrT3B0aW9uLmNhbGxiYWNrQXJncyA6IGFyZ3M7XG4gICAgICAgICAgICAgIGlmICghIW1hY3JvVGFza09wdGlvbi5pc1BlcmlvZGljKSB7XG4gICAgICAgICAgICAgICAgLy8gcGVyaW9kaWMgbWFjcm9UYXNrLCB1c2Ugc2V0SW50ZXJ2YWwgdG8gc2ltdWxhdGVcbiAgICAgICAgICAgICAgICB0YXNrLmRhdGEhWydoYW5kbGVJZCddID0gdGhpcy5fc2V0SW50ZXJ2YWwodGFzay5pbnZva2UsIGRlbGF5LCBjYWxsYmFja0FyZ3MpO1xuICAgICAgICAgICAgICAgIHRhc2suZGF0YSEuaXNQZXJpb2RpYyA9IHRydWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gbm90IHBlcmlvZGljLCB1c2Ugc2V0VGltZW91dCB0byBzaW11bGF0ZVxuICAgICAgICAgICAgICAgIHRhc2suZGF0YSFbJ2hhbmRsZUlkJ10gPSB0aGlzLl9zZXRUaW1lb3V0KHRhc2suaW52b2tlLCBkZWxheSwgY2FsbGJhY2tBcmdzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBtYWNyb1Rhc2sgc2NoZWR1bGVkIGluIGZha2UgYXN5bmMgdGVzdDogJyArIHRhc2suc291cmNlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2V2ZW50VGFzayc6XG4gICAgICAgIHRhc2sgPSBkZWxlZ2F0ZS5zY2hlZHVsZVRhc2sodGFyZ2V0LCB0YXNrKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiB0YXNrO1xuICB9XG5cbiAgb25DYW5jZWxUYXNrKGRlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnQ6IFpvbmUsIHRhcmdldDogWm9uZSwgdGFzazogVGFzayk6IGFueSB7XG4gICAgc3dpdGNoICh0YXNrLnNvdXJjZSkge1xuICAgICAgY2FzZSAnc2V0VGltZW91dCc6XG4gICAgICBjYXNlICdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnOlxuICAgICAgY2FzZSAnd2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lJzpcbiAgICAgIGNhc2UgJ21velJlcXVlc3RBbmltYXRpb25GcmFtZSc6XG4gICAgICAgIHJldHVybiB0aGlzLl9jbGVhclRpbWVvdXQoPG51bWJlcj50YXNrLmRhdGEhWydoYW5kbGVJZCddKTtcbiAgICAgIGNhc2UgJ3NldEludGVydmFsJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsZWFySW50ZXJ2YWwoPG51bWJlcj50YXNrLmRhdGEhWydoYW5kbGVJZCddKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIHVzZXIgY2FuIGRlZmluZSB3aGljaCBtYWNyb1Rhc2sgdGhleSB3YW50IHRvIHN1cHBvcnQgYnkgcGFzc2luZ1xuICAgICAgICAvLyBtYWNyb1Rhc2tPcHRpb25zXG4gICAgICAgIGNvbnN0IG1hY3JvVGFza09wdGlvbiA9IHRoaXMuZmluZE1hY3JvVGFza09wdGlvbih0YXNrKTtcbiAgICAgICAgaWYgKG1hY3JvVGFza09wdGlvbikge1xuICAgICAgICAgIGNvbnN0IGhhbmRsZUlkOiBudW1iZXIgPSA8bnVtYmVyPnRhc2suZGF0YSFbJ2hhbmRsZUlkJ107XG4gICAgICAgICAgcmV0dXJuIG1hY3JvVGFza09wdGlvbi5pc1BlcmlvZGljID8gdGhpcy5fY2xlYXJJbnRlcnZhbChoYW5kbGVJZCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NsZWFyVGltZW91dChoYW5kbGVJZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmNhbmNlbFRhc2sodGFyZ2V0LCB0YXNrKTtcbiAgICB9XG4gIH1cblxuICBvbkludm9rZShcbiAgICAgIGRlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnQ6IFpvbmUsIHRhcmdldDogWm9uZSwgY2FsbGJhY2s6IEZ1bmN0aW9uLCBhcHBseVRoaXM6IGFueSxcbiAgICAgIGFwcGx5QXJncz86IGFueVtdLCBzb3VyY2U/OiBzdHJpbmcpOiBhbnkge1xuICAgIHRyeSB7XG4gICAgICBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMucGF0Y2hEYXRlKCk7XG4gICAgICByZXR1cm4gZGVsZWdhdGUuaW52b2tlKHRhcmdldCwgY2FsbGJhY2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzLCBzb3VyY2UpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoIXRoaXMucGF0Y2hEYXRlTG9ja2VkKSB7XG4gICAgICAgIEZha2VBc3luY1Rlc3Rab25lU3BlYy5yZXNldERhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmaW5kTWFjcm9UYXNrT3B0aW9uKHRhc2s6IFRhc2spIHtcbiAgICBpZiAoIXRoaXMubWFjcm9UYXNrT3B0aW9ucykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tYWNyb1Rhc2tPcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtYWNyb1Rhc2tPcHRpb24gPSB0aGlzLm1hY3JvVGFza09wdGlvbnNbaV07XG4gICAgICBpZiAobWFjcm9UYXNrT3B0aW9uLnNvdXJjZSA9PT0gdGFzay5zb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIG1hY3JvVGFza09wdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBvbkhhbmRsZUVycm9yKHBhcmVudFpvbmVEZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZTogWm9uZSwgdGFyZ2V0Wm9uZTogWm9uZSwgZXJyb3I6IGFueSk6XG4gICAgICBib29sZWFuIHtcbiAgICB0aGlzLl9sYXN0RXJyb3IgPSBlcnJvcjtcbiAgICByZXR1cm4gZmFsc2U7ICAvLyBEb24ndCBwcm9wYWdhdGUgZXJyb3IgdG8gcGFyZW50IHpvbmUuXG4gIH1cbn1cblxuLy8gRXhwb3J0IHRoZSBjbGFzcyBzbyB0aGF0IG5ldyBpbnN0YW5jZXMgY2FuIGJlIGNyZWF0ZWQgd2l0aCBwcm9wZXJcbi8vIGNvbnN0cnVjdG9yIHBhcmFtcy5cbihab25lIGFzIGFueSlbJ0Zha2VBc3luY1Rlc3Rab25lU3BlYyddID0gRmFrZUFzeW5jVGVzdFpvbmVTcGVjO1xufSkodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgJiYgd2luZG93IHx8IHR5cGVvZiBzZWxmID09PSAnb2JqZWN0JyAmJiBzZWxmIHx8IGdsb2JhbCk7XG4iXX0=