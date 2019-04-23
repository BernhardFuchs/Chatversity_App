"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var Notification_1 = require("../Notification");
var ColdObservable_1 = require("./ColdObservable");
var HotObservable_1 = require("./HotObservable");
var SubscriptionLog_1 = require("./SubscriptionLog");
var VirtualTimeScheduler_1 = require("../scheduler/VirtualTimeScheduler");
var AsyncScheduler_1 = require("../scheduler/AsyncScheduler");
var defaultMaxFrame = 750;
var TestScheduler = /** @class */ (function (_super) {
    __extends(TestScheduler, _super);
    function TestScheduler(assertDeepEqual) {
        var _this = _super.call(this, VirtualTimeScheduler_1.VirtualAction, defaultMaxFrame) || this;
        _this.assertDeepEqual = assertDeepEqual;
        _this.hotObservables = [];
        _this.coldObservables = [];
        _this.flushTests = [];
        _this.runMode = false;
        return _this;
    }
    TestScheduler.prototype.createTime = function (marbles) {
        var indexOf = marbles.indexOf('|');
        if (indexOf === -1) {
            throw new Error('marble diagram for time should have a completion marker "|"');
        }
        return indexOf * TestScheduler.frameTimeFactor;
    };
    /**
     * @param marbles A diagram in the marble DSL. Letters map to keys in `values` if provided.
     * @param values Values to use for the letters in `marbles`. If ommitted, the letters themselves are used.
     * @param error The error to use for the `#` marble (if present).
     */
    TestScheduler.prototype.createColdObservable = function (marbles, values, error) {
        if (marbles.indexOf('^') !== -1) {
            throw new Error('cold observable cannot have subscription offset "^"');
        }
        if (marbles.indexOf('!') !== -1) {
            throw new Error('cold observable cannot have unsubscription marker "!"');
        }
        var messages = TestScheduler.parseMarbles(marbles, values, error, undefined, this.runMode);
        var cold = new ColdObservable_1.ColdObservable(messages, this);
        this.coldObservables.push(cold);
        return cold;
    };
    /**
     * @param marbles A diagram in the marble DSL. Letters map to keys in `values` if provided.
     * @param values Values to use for the letters in `marbles`. If ommitted, the letters themselves are used.
     * @param error The error to use for the `#` marble (if present).
     */
    TestScheduler.prototype.createHotObservable = function (marbles, values, error) {
        if (marbles.indexOf('!') !== -1) {
            throw new Error('hot observable cannot have unsubscription marker "!"');
        }
        var messages = TestScheduler.parseMarbles(marbles, values, error, undefined, this.runMode);
        var subject = new HotObservable_1.HotObservable(messages, this);
        this.hotObservables.push(subject);
        return subject;
    };
    TestScheduler.prototype.materializeInnerObservable = function (observable, outerFrame) {
        var _this = this;
        var messages = [];
        observable.subscribe(function (value) {
            messages.push({ frame: _this.frame - outerFrame, notification: Notification_1.Notification.createNext(value) });
        }, function (err) {
            messages.push({ frame: _this.frame - outerFrame, notification: Notification_1.Notification.createError(err) });
        }, function () {
            messages.push({ frame: _this.frame - outerFrame, notification: Notification_1.Notification.createComplete() });
        });
        return messages;
    };
    TestScheduler.prototype.expectObservable = function (observable, subscriptionMarbles) {
        var _this = this;
        if (subscriptionMarbles === void 0) { subscriptionMarbles = null; }
        var actual = [];
        var flushTest = { actual: actual, ready: false };
        var subscriptionParsed = TestScheduler.parseMarblesAsSubscriptions(subscriptionMarbles, this.runMode);
        var subscriptionFrame = subscriptionParsed.subscribedFrame === Number.POSITIVE_INFINITY ?
            0 : subscriptionParsed.subscribedFrame;
        var unsubscriptionFrame = subscriptionParsed.unsubscribedFrame;
        var subscription;
        this.schedule(function () {
            subscription = observable.subscribe(function (x) {
                var value = x;
                // Support Observable-of-Observables
                if (x instanceof Observable_1.Observable) {
                    value = _this.materializeInnerObservable(value, _this.frame);
                }
                actual.push({ frame: _this.frame, notification: Notification_1.Notification.createNext(value) });
            }, function (err) {
                actual.push({ frame: _this.frame, notification: Notification_1.Notification.createError(err) });
            }, function () {
                actual.push({ frame: _this.frame, notification: Notification_1.Notification.createComplete() });
            });
        }, subscriptionFrame);
        if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
            this.schedule(function () { return subscription.unsubscribe(); }, unsubscriptionFrame);
        }
        this.flushTests.push(flushTest);
        var runMode = this.runMode;
        return {
            toBe: function (marbles, values, errorValue) {
                flushTest.ready = true;
                flushTest.expected = TestScheduler.parseMarbles(marbles, values, errorValue, true, runMode);
            }
        };
    };
    TestScheduler.prototype.expectSubscriptions = function (actualSubscriptionLogs) {
        var flushTest = { actual: actualSubscriptionLogs, ready: false };
        this.flushTests.push(flushTest);
        var runMode = this.runMode;
        return {
            toBe: function (marbles) {
                var marblesArray = (typeof marbles === 'string') ? [marbles] : marbles;
                flushTest.ready = true;
                flushTest.expected = marblesArray.map(function (marbles) {
                    return TestScheduler.parseMarblesAsSubscriptions(marbles, runMode);
                });
            }
        };
    };
    TestScheduler.prototype.flush = function () {
        var _this = this;
        var hotObservables = this.hotObservables;
        while (hotObservables.length > 0) {
            hotObservables.shift().setup();
        }
        _super.prototype.flush.call(this);
        this.flushTests = this.flushTests.filter(function (test) {
            if (test.ready) {
                _this.assertDeepEqual(test.actual, test.expected);
                return false;
            }
            return true;
        });
    };
    /** @nocollapse */
    TestScheduler.parseMarblesAsSubscriptions = function (marbles, runMode) {
        var _this = this;
        if (runMode === void 0) { runMode = false; }
        if (typeof marbles !== 'string') {
            return new SubscriptionLog_1.SubscriptionLog(Number.POSITIVE_INFINITY);
        }
        var len = marbles.length;
        var groupStart = -1;
        var subscriptionFrame = Number.POSITIVE_INFINITY;
        var unsubscriptionFrame = Number.POSITIVE_INFINITY;
        var frame = 0;
        var _loop_1 = function (i) {
            var nextFrame = frame;
            var advanceFrameBy = function (count) {
                nextFrame += count * _this.frameTimeFactor;
            };
            var c = marbles[i];
            switch (c) {
                case ' ':
                    // Whitespace no longer advances time
                    if (!runMode) {
                        advanceFrameBy(1);
                    }
                    break;
                case '-':
                    advanceFrameBy(1);
                    break;
                case '(':
                    groupStart = frame;
                    advanceFrameBy(1);
                    break;
                case ')':
                    groupStart = -1;
                    advanceFrameBy(1);
                    break;
                case '^':
                    if (subscriptionFrame !== Number.POSITIVE_INFINITY) {
                        throw new Error('found a second subscription point \'^\' in a ' +
                            'subscription marble diagram. There can only be one.');
                    }
                    subscriptionFrame = groupStart > -1 ? groupStart : frame;
                    advanceFrameBy(1);
                    break;
                case '!':
                    if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
                        throw new Error('found a second subscription point \'^\' in a ' +
                            'subscription marble diagram. There can only be one.');
                    }
                    unsubscriptionFrame = groupStart > -1 ? groupStart : frame;
                    break;
                default:
                    // time progression syntax
                    if (runMode && c.match(/^[0-9]$/)) {
                        // Time progression must be preceeded by at least one space
                        // if it's not at the beginning of the diagram
                        if (i === 0 || marbles[i - 1] === ' ') {
                            var buffer = marbles.slice(i);
                            var match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
                            if (match) {
                                i += match[0].length - 1;
                                var duration = parseFloat(match[1]);
                                var unit = match[2];
                                var durationInMs = void 0;
                                switch (unit) {
                                    case 'ms':
                                        durationInMs = duration;
                                        break;
                                    case 's':
                                        durationInMs = duration * 1000;
                                        break;
                                    case 'm':
                                        durationInMs = duration * 1000 * 60;
                                        break;
                                    default:
                                        break;
                                }
                                advanceFrameBy(durationInMs / this_1.frameTimeFactor);
                                break;
                            }
                        }
                    }
                    throw new Error('there can only be \'^\' and \'!\' markers in a ' +
                        'subscription marble diagram. Found instead \'' + c + '\'.');
            }
            frame = nextFrame;
            out_i_1 = i;
        };
        var this_1 = this, out_i_1;
        for (var i = 0; i < len; i++) {
            _loop_1(i);
            i = out_i_1;
        }
        if (unsubscriptionFrame < 0) {
            return new SubscriptionLog_1.SubscriptionLog(subscriptionFrame);
        }
        else {
            return new SubscriptionLog_1.SubscriptionLog(subscriptionFrame, unsubscriptionFrame);
        }
    };
    /** @nocollapse */
    TestScheduler.parseMarbles = function (marbles, values, errorValue, materializeInnerObservables, runMode) {
        var _this = this;
        if (materializeInnerObservables === void 0) { materializeInnerObservables = false; }
        if (runMode === void 0) { runMode = false; }
        if (marbles.indexOf('!') !== -1) {
            throw new Error('conventional marble diagrams cannot have the ' +
                'unsubscription marker "!"');
        }
        var len = marbles.length;
        var testMessages = [];
        var subIndex = runMode ? marbles.replace(/^[ ]+/, '').indexOf('^') : marbles.indexOf('^');
        var frame = subIndex === -1 ? 0 : (subIndex * -this.frameTimeFactor);
        var getValue = typeof values !== 'object' ?
            function (x) { return x; } :
            function (x) {
                // Support Observable-of-Observables
                if (materializeInnerObservables && values[x] instanceof ColdObservable_1.ColdObservable) {
                    return values[x].messages;
                }
                return values[x];
            };
        var groupStart = -1;
        var _loop_2 = function (i) {
            var nextFrame = frame;
            var advanceFrameBy = function (count) {
                nextFrame += count * _this.frameTimeFactor;
            };
            var notification = void 0;
            var c = marbles[i];
            switch (c) {
                case ' ':
                    // Whitespace no longer advances time
                    if (!runMode) {
                        advanceFrameBy(1);
                    }
                    break;
                case '-':
                    advanceFrameBy(1);
                    break;
                case '(':
                    groupStart = frame;
                    advanceFrameBy(1);
                    break;
                case ')':
                    groupStart = -1;
                    advanceFrameBy(1);
                    break;
                case '|':
                    notification = Notification_1.Notification.createComplete();
                    advanceFrameBy(1);
                    break;
                case '^':
                    advanceFrameBy(1);
                    break;
                case '#':
                    notification = Notification_1.Notification.createError(errorValue || 'error');
                    advanceFrameBy(1);
                    break;
                default:
                    // Might be time progression syntax, or a value literal
                    if (runMode && c.match(/^[0-9]$/)) {
                        // Time progression must be preceeded by at least one space
                        // if it's not at the beginning of the diagram
                        if (i === 0 || marbles[i - 1] === ' ') {
                            var buffer = marbles.slice(i);
                            var match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
                            if (match) {
                                i += match[0].length - 1;
                                var duration = parseFloat(match[1]);
                                var unit = match[2];
                                var durationInMs = void 0;
                                switch (unit) {
                                    case 'ms':
                                        durationInMs = duration;
                                        break;
                                    case 's':
                                        durationInMs = duration * 1000;
                                        break;
                                    case 'm':
                                        durationInMs = duration * 1000 * 60;
                                        break;
                                    default:
                                        break;
                                }
                                advanceFrameBy(durationInMs / this_2.frameTimeFactor);
                                break;
                            }
                        }
                    }
                    notification = Notification_1.Notification.createNext(getValue(c));
                    advanceFrameBy(1);
                    break;
            }
            if (notification) {
                testMessages.push({ frame: groupStart > -1 ? groupStart : frame, notification: notification });
            }
            frame = nextFrame;
            out_i_2 = i;
        };
        var this_2 = this, out_i_2;
        for (var i = 0; i < len; i++) {
            _loop_2(i);
            i = out_i_2;
        }
        return testMessages;
    };
    TestScheduler.prototype.run = function (callback) {
        var prevFrameTimeFactor = TestScheduler.frameTimeFactor;
        var prevMaxFrames = this.maxFrames;
        TestScheduler.frameTimeFactor = 1;
        this.maxFrames = Number.POSITIVE_INFINITY;
        this.runMode = true;
        AsyncScheduler_1.AsyncScheduler.delegate = this;
        var helpers = {
            cold: this.createColdObservable.bind(this),
            hot: this.createHotObservable.bind(this),
            flush: this.flush.bind(this),
            expectObservable: this.expectObservable.bind(this),
            expectSubscriptions: this.expectSubscriptions.bind(this),
        };
        try {
            var ret = callback(helpers);
            this.flush();
            return ret;
        }
        finally {
            TestScheduler.frameTimeFactor = prevFrameTimeFactor;
            this.maxFrames = prevMaxFrames;
            this.runMode = false;
            AsyncScheduler_1.AsyncScheduler.delegate = undefined;
        }
    };
    return TestScheduler;
}(VirtualTimeScheduler_1.VirtualTimeScheduler));
exports.TestScheduler = TestScheduler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFNjaGVkdWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvdGVzdGluZy9UZXN0U2NoZWR1bGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTJDO0FBQzNDLGdEQUErQztBQUMvQyxtREFBa0Q7QUFDbEQsaURBQWdEO0FBRWhELHFEQUFvRDtBQUVwRCwwRUFBd0Y7QUFDeEYsOERBQTZEO0FBRTdELElBQU0sZUFBZSxHQUFXLEdBQUcsQ0FBQztBQW1CcEM7SUFBbUMsaUNBQW9CO0lBTXJELHVCQUFtQixlQUErRDtRQUFsRixZQUNFLGtCQUFNLG9DQUFhLEVBQUUsZUFBZSxDQUFDLFNBQ3RDO1FBRmtCLHFCQUFlLEdBQWYsZUFBZSxDQUFnRDtRQUxsRSxvQkFBYyxHQUF5QixFQUFFLENBQUM7UUFDMUMscUJBQWUsR0FBMEIsRUFBRSxDQUFDO1FBQ3BELGdCQUFVLEdBQW9CLEVBQUUsQ0FBQztRQUNqQyxhQUFPLEdBQUcsS0FBSyxDQUFDOztJQUl4QixDQUFDO0lBRUQsa0NBQVUsR0FBVixVQUFXLE9BQWU7UUFDeEIsSUFBTSxPQUFPLEdBQVcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QyxJQUFJLE9BQU8sS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLDZEQUE2RCxDQUFDLENBQUM7U0FDaEY7UUFDRCxPQUFPLE9BQU8sR0FBRyxhQUFhLENBQUMsZUFBZSxDQUFDO0lBQ2pELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsNENBQW9CLEdBQXBCLFVBQWlDLE9BQWUsRUFBRSxNQUFnQyxFQUFFLEtBQVc7UUFDN0YsSUFBSSxP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L0IsSUFBTSxPQUFPLEdBQUc7WUFDZCxJQUFJLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDMUMsR0FBRyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3hDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDNUIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDbEQsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDekQsQ0FBQztRQUNGLElBQUk7WUFDRixJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxHQUFHLENBQUM7U0FDWjtnQkFBUztZQUNSLGFBQWEsQ0FBQyxlQUFlLEdBQUcsbUJBQW1CLENBQUM7WUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7WUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDckIsK0JBQWMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQW5YRCxDQUFtQywyQ0FBb0IsR0FtWHREO0FBblhZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vTm90aWZpY2F0aW9uJztcbmltcG9ydCB7IENvbGRPYnNlcnZhYmxlIH0gZnJvbSAnLi9Db2xkT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBIb3RPYnNlcnZhYmxlIH0gZnJvbSAnLi9Ib3RPYnNlcnZhYmxlJztcbmltcG9ydCB7IFRlc3RNZXNzYWdlIH0gZnJvbSAnLi9UZXN0TWVzc2FnZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25Mb2cgfSBmcm9tICcuL1N1YnNjcmlwdGlvbkxvZyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgVmlydHVhbFRpbWVTY2hlZHVsZXIsIFZpcnR1YWxBY3Rpb24gfSBmcm9tICcuLi9zY2hlZHVsZXIvVmlydHVhbFRpbWVTY2hlZHVsZXInO1xuaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvQXN5bmNTY2hlZHVsZXInO1xuXG5jb25zdCBkZWZhdWx0TWF4RnJhbWU6IG51bWJlciA9IDc1MDtcblxuZXhwb3J0IGludGVyZmFjZSBSdW5IZWxwZXJzIHtcbiAgY29sZDogdHlwZW9mIFRlc3RTY2hlZHVsZXIucHJvdG90eXBlLmNyZWF0ZUNvbGRPYnNlcnZhYmxlO1xuICBob3Q6IHR5cGVvZiBUZXN0U2NoZWR1bGVyLnByb3RvdHlwZS5jcmVhdGVIb3RPYnNlcnZhYmxlO1xuICBmbHVzaDogdHlwZW9mIFRlc3RTY2hlZHVsZXIucHJvdG90eXBlLmZsdXNoO1xuICBleHBlY3RPYnNlcnZhYmxlOiB0eXBlb2YgVGVzdFNjaGVkdWxlci5wcm90b3R5cGUuZXhwZWN0T2JzZXJ2YWJsZTtcbiAgZXhwZWN0U3Vic2NyaXB0aW9uczogdHlwZW9mIFRlc3RTY2hlZHVsZXIucHJvdG90eXBlLmV4cGVjdFN1YnNjcmlwdGlvbnM7XG59XG5cbmludGVyZmFjZSBGbHVzaGFibGVUZXN0IHtcbiAgcmVhZHk6IGJvb2xlYW47XG4gIGFjdHVhbD86IGFueVtdO1xuICBleHBlY3RlZD86IGFueVtdO1xufVxuXG5leHBvcnQgdHlwZSBvYnNlcnZhYmxlVG9CZUZuID0gKG1hcmJsZXM6IHN0cmluZywgdmFsdWVzPzogYW55LCBlcnJvclZhbHVlPzogYW55KSA9PiB2b2lkO1xuZXhwb3J0IHR5cGUgc3Vic2NyaXB0aW9uTG9nc1RvQmVGbiA9IChtYXJibGVzOiBzdHJpbmcgfCBzdHJpbmdbXSkgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIFRlc3RTY2hlZHVsZXIgZXh0ZW5kcyBWaXJ0dWFsVGltZVNjaGVkdWxlciB7XG4gIHB1YmxpYyByZWFkb25seSBob3RPYnNlcnZhYmxlczogSG90T2JzZXJ2YWJsZTxhbnk+W10gPSBbXTtcbiAgcHVibGljIHJlYWRvbmx5IGNvbGRPYnNlcnZhYmxlczogQ29sZE9ic2VydmFibGU8YW55PltdID0gW107XG4gIHByaXZhdGUgZmx1c2hUZXN0czogRmx1c2hhYmxlVGVzdFtdID0gW107XG4gIHByaXZhdGUgcnVuTW9kZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBhc3NlcnREZWVwRXF1YWw6IChhY3R1YWw6IGFueSwgZXhwZWN0ZWQ6IGFueSkgPT4gYm9vbGVhbiB8IHZvaWQpIHtcbiAgICBzdXBlcihWaXJ0dWFsQWN0aW9uLCBkZWZhdWx0TWF4RnJhbWUpO1xuICB9XG5cbiAgY3JlYXRlVGltZShtYXJibGVzOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIGNvbnN0IGluZGV4T2Y6IG51bWJlciA9IG1hcmJsZXMuaW5kZXhPZignfCcpO1xuICAgIGlmIChpbmRleE9mID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXJibGUgZGlhZ3JhbSBmb3IgdGltZSBzaG91bGQgaGF2ZSBhIGNvbXBsZXRpb24gbWFya2VyIFwifFwiJyk7XG4gICAgfVxuICAgIHJldHVybiBpbmRleE9mICogVGVzdFNjaGVkdWxlci5mcmFtZVRpbWVGYWN0b3I7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG1hcmJsZXMgQSBkaWFncmFtIGluIHRoZSBtYXJibGUgRFNMLiBMZXR0ZXJzIG1hcCB0byBrZXlzIGluIGB2YWx1ZXNgIGlmIHByb3ZpZGVkLlxuICAgKiBAcGFyYW0gdmFsdWVzIFZhbHVlcyB0byB1c2UgZm9yIHRoZSBsZXR0ZXJzIGluIGBtYXJibGVzYC4gSWYgb21taXR0ZWQsIHRoZSBsZXR0ZXJzIHRoZW1zZWx2ZXMgYXJlIHVzZWQuXG4gICAqIEBwYXJhbSBlcnJvciBUaGUgZXJyb3IgdG8gdXNlIGZvciB0aGUgYCNgIG1hcmJsZSAoaWYgcHJlc2VudCkuXG4gICAqL1xuICBjcmVhdGVDb2xkT2JzZXJ2YWJsZTxUID0gc3RyaW5nPihtYXJibGVzOiBzdHJpbmcsIHZhbHVlcz86IHsgW21hcmJsZTogc3RyaW5nXTogVCB9LCBlcnJvcj86IGFueSk6IENvbGRPYnNlcnZhYmxlPFQ+IHtcbiAgICBpZiAobWFyYmxlcy5pbmRleE9mKCdeJykgIT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvbGQgb2JzZXJ2YWJsZSBjYW5ub3QgaGF2ZSBzdWJzY3JpcHRpb24gb2Zmc2V0IFwiXlwiJyk7XG4gICAgfVxuICAgIGlmIChtYXJibGVzLmluZGV4T2YoJyEnKSAhPT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY29sZCBvYnNlcnZhYmxlIGNhbm5vdCBoYXZlIHVuc3Vic2NyaXB0aW9uIG1hcmtlciBcIiFcIicpO1xuICAgIH1cbiAgICBjb25zdCBtZXNzYWdlcyA9IFRlc3RTY2hlZHVsZXIucGFyc2VNYXJibGVzKG1hcmJsZXMsIHZhbHVlcywgZXJyb3IsIHVuZGVmaW5lZCwgdGhpcy5ydW5Nb2RlKTtcbiAgICBjb25zdCBjb2xkID0gbmV3IENvbGRPYnNlcnZhYmxlPFQ+KG1lc3NhZ2VzLCB0aGlzKTtcbiAgICB0aGlzLmNvbGRPYnNlcnZhYmxlcy5wdXNoKGNvbGQpO1xuICAgIHJldHVybiBjb2xkO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBtYXJibGVzIEEgZGlhZ3JhbSBpbiB0aGUgbWFyYmxlIERTTC4gTGV0dGVycyBtYXAgdG8ga2V5cyBpbiBgdmFsdWVzYCBpZiBwcm92aWRlZC5cbiAgICogQHBhcmFtIHZhbHVlcyBWYWx1ZXMgdG8gdXNlIGZvciB0aGUgbGV0dGVycyBpbiBgbWFyYmxlc2AuIElmIG9tbWl0dGVkLCB0aGUgbGV0dGVycyB0aGVtc2VsdmVzIGFyZSB1c2VkLlxuICAgKiBAcGFyYW0gZXJyb3IgVGhlIGVycm9yIHRvIHVzZSBmb3IgdGhlIGAjYCBtYXJibGUgKGlmIHByZXNlbnQpLlxuICAgKi9cbiAgY3JlYXRlSG90T2JzZXJ2YWJsZTxUID0gc3RyaW5nPihtYXJibGVzOiBzdHJpbmcsIHZhbHVlcz86IHsgW21hcmJsZTogc3RyaW5nXTogVCB9LCBlcnJvcj86IGFueSk6IEhvdE9ic2VydmFibGU8VD4ge1xuICAgIGlmIChtYXJibGVzLmluZGV4T2YoJyEnKSAhPT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaG90IG9ic2VydmFibGUgY2Fubm90IGhhdmUgdW5zdWJzY3JpcHRpb24gbWFya2VyIFwiIVwiJyk7XG4gICAgfVxuICAgIGNvbnN0IG1lc3NhZ2VzID0gVGVzdFNjaGVkdWxlci5wYXJzZU1hcmJsZXMobWFyYmxlcywgdmFsdWVzLCBlcnJvciwgdW5kZWZpbmVkLCB0aGlzLnJ1bk1vZGUpO1xuICAgIGNvbnN0IHN1YmplY3QgPSBuZXcgSG90T2JzZXJ2YWJsZTxUPihtZXNzYWdlcywgdGhpcyk7XG4gICAgdGhpcy5ob3RPYnNlcnZhYmxlcy5wdXNoKHN1YmplY3QpO1xuICAgIHJldHVybiBzdWJqZWN0O1xuICB9XG5cbiAgcHJpdmF0ZSBtYXRlcmlhbGl6ZUlubmVyT2JzZXJ2YWJsZShvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ZXJGcmFtZTogbnVtYmVyKTogVGVzdE1lc3NhZ2VbXSB7XG4gICAgY29uc3QgbWVzc2FnZXM6IFRlc3RNZXNzYWdlW10gPSBbXTtcbiAgICBvYnNlcnZhYmxlLnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgIG1lc3NhZ2VzLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSAtIG91dGVyRnJhbWUsIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uLmNyZWF0ZU5leHQodmFsdWUpIH0pO1xuICAgIH0sIChlcnIpID0+IHtcbiAgICAgIG1lc3NhZ2VzLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSAtIG91dGVyRnJhbWUsIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uLmNyZWF0ZUVycm9yKGVycikgfSk7XG4gICAgfSwgKCkgPT4ge1xuICAgICAgbWVzc2FnZXMucHVzaCh7IGZyYW1lOiB0aGlzLmZyYW1lIC0gb3V0ZXJGcmFtZSwgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb24uY3JlYXRlQ29tcGxldGUoKSB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gbWVzc2FnZXM7XG4gIH1cblxuICBleHBlY3RPYnNlcnZhYmxlKG9ic2VydmFibGU6IE9ic2VydmFibGU8YW55PixcbiAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25NYXJibGVzOiBzdHJpbmcgPSBudWxsKTogKHsgdG9CZTogb2JzZXJ2YWJsZVRvQmVGbiB9KSB7XG4gICAgY29uc3QgYWN0dWFsOiBUZXN0TWVzc2FnZVtdID0gW107XG4gICAgY29uc3QgZmx1c2hUZXN0OiBGbHVzaGFibGVUZXN0ID0geyBhY3R1YWwsIHJlYWR5OiBmYWxzZSB9O1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvblBhcnNlZCA9IFRlc3RTY2hlZHVsZXIucGFyc2VNYXJibGVzQXNTdWJzY3JpcHRpb25zKHN1YnNjcmlwdGlvbk1hcmJsZXMsIHRoaXMucnVuTW9kZSk7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uRnJhbWUgPSBzdWJzY3JpcHRpb25QYXJzZWQuc3Vic2NyaWJlZEZyYW1lID09PSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkgP1xuICAgICAgMCA6IHN1YnNjcmlwdGlvblBhcnNlZC5zdWJzY3JpYmVkRnJhbWU7XG4gICAgY29uc3QgdW5zdWJzY3JpcHRpb25GcmFtZSA9IHN1YnNjcmlwdGlvblBhcnNlZC51bnN1YnNjcmliZWRGcmFtZTtcbiAgICBsZXQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICB0aGlzLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbiA9IG9ic2VydmFibGUuc3Vic2NyaWJlKHggPT4ge1xuICAgICAgICBsZXQgdmFsdWUgPSB4O1xuICAgICAgICAvLyBTdXBwb3J0IE9ic2VydmFibGUtb2YtT2JzZXJ2YWJsZXNcbiAgICAgICAgaWYgKHggaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLm1hdGVyaWFsaXplSW5uZXJPYnNlcnZhYmxlKHZhbHVlLCB0aGlzLmZyYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBhY3R1YWwucHVzaCh7IGZyYW1lOiB0aGlzLmZyYW1lLCBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbi5jcmVhdGVOZXh0KHZhbHVlKSB9KTtcbiAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgYWN0dWFsLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSwgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb24uY3JlYXRlRXJyb3IoZXJyKSB9KTtcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgYWN0dWFsLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSwgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb24uY3JlYXRlQ29tcGxldGUoKSB9KTtcbiAgICAgIH0pO1xuICAgIH0sIHN1YnNjcmlwdGlvbkZyYW1lKTtcblxuICAgIGlmICh1bnN1YnNjcmlwdGlvbkZyYW1lICE9PSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICAgIHRoaXMuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCksIHVuc3Vic2NyaXB0aW9uRnJhbWUpO1xuICAgIH1cblxuICAgIHRoaXMuZmx1c2hUZXN0cy5wdXNoKGZsdXNoVGVzdCk7XG4gICAgY29uc3QgeyBydW5Nb2RlIH0gPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvQmUobWFyYmxlczogc3RyaW5nLCB2YWx1ZXM/OiBhbnksIGVycm9yVmFsdWU/OiBhbnkpIHtcbiAgICAgICAgZmx1c2hUZXN0LnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgZmx1c2hUZXN0LmV4cGVjdGVkID0gVGVzdFNjaGVkdWxlci5wYXJzZU1hcmJsZXMobWFyYmxlcywgdmFsdWVzLCBlcnJvclZhbHVlLCB0cnVlLCBydW5Nb2RlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZXhwZWN0U3Vic2NyaXB0aW9ucyhhY3R1YWxTdWJzY3JpcHRpb25Mb2dzOiBTdWJzY3JpcHRpb25Mb2dbXSk6ICh7IHRvQmU6IHN1YnNjcmlwdGlvbkxvZ3NUb0JlRm4gfSkge1xuICAgIGNvbnN0IGZsdXNoVGVzdDogRmx1c2hhYmxlVGVzdCA9IHsgYWN0dWFsOiBhY3R1YWxTdWJzY3JpcHRpb25Mb2dzLCByZWFkeTogZmFsc2UgfTtcbiAgICB0aGlzLmZsdXNoVGVzdHMucHVzaChmbHVzaFRlc3QpO1xuICAgIGNvbnN0IHsgcnVuTW9kZSB9ID0gdGhpcztcbiAgICByZXR1cm4ge1xuICAgICAgdG9CZShtYXJibGVzOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgICAgICBjb25zdCBtYXJibGVzQXJyYXk6IHN0cmluZ1tdID0gKHR5cGVvZiBtYXJibGVzID09PSAnc3RyaW5nJykgPyBbbWFyYmxlc10gOiBtYXJibGVzO1xuICAgICAgICBmbHVzaFRlc3QucmVhZHkgPSB0cnVlO1xuICAgICAgICBmbHVzaFRlc3QuZXhwZWN0ZWQgPSBtYXJibGVzQXJyYXkubWFwKG1hcmJsZXMgPT5cbiAgICAgICAgICBUZXN0U2NoZWR1bGVyLnBhcnNlTWFyYmxlc0FzU3Vic2NyaXB0aW9ucyhtYXJibGVzLCBydW5Nb2RlKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBmbHVzaCgpIHtcbiAgICBjb25zdCBob3RPYnNlcnZhYmxlcyA9IHRoaXMuaG90T2JzZXJ2YWJsZXM7XG4gICAgd2hpbGUgKGhvdE9ic2VydmFibGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGhvdE9ic2VydmFibGVzLnNoaWZ0KCkuc2V0dXAoKTtcbiAgICB9XG5cbiAgICBzdXBlci5mbHVzaCgpO1xuXG4gICAgdGhpcy5mbHVzaFRlc3RzID0gdGhpcy5mbHVzaFRlc3RzLmZpbHRlcih0ZXN0ID0+IHtcbiAgICAgIGlmICh0ZXN0LnJlYWR5KSB7XG4gICAgICAgIHRoaXMuYXNzZXJ0RGVlcEVxdWFsKHRlc3QuYWN0dWFsLCB0ZXN0LmV4cGVjdGVkKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIHBhcnNlTWFyYmxlc0FzU3Vic2NyaXB0aW9ucyhtYXJibGVzOiBzdHJpbmcsIHJ1bk1vZGUgPSBmYWxzZSk6IFN1YnNjcmlwdGlvbkxvZyB7XG4gICAgaWYgKHR5cGVvZiBtYXJibGVzICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBTdWJzY3JpcHRpb25Mb2coTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKTtcbiAgICB9XG4gICAgY29uc3QgbGVuID0gbWFyYmxlcy5sZW5ndGg7XG4gICAgbGV0IGdyb3VwU3RhcnQgPSAtMTtcbiAgICBsZXQgc3Vic2NyaXB0aW9uRnJhbWUgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgbGV0IHVuc3Vic2NyaXB0aW9uRnJhbWUgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgbGV0IGZyYW1lID0gMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxldCBuZXh0RnJhbWUgPSBmcmFtZTtcbiAgICAgIGNvbnN0IGFkdmFuY2VGcmFtZUJ5ID0gKGNvdW50OiBudW1iZXIpID0+IHtcbiAgICAgICAgbmV4dEZyYW1lICs9IGNvdW50ICogdGhpcy5mcmFtZVRpbWVGYWN0b3I7XG4gICAgICB9O1xuICAgICAgY29uc3QgYyA9IG1hcmJsZXNbaV07XG4gICAgICBzd2l0Y2ggKGMpIHtcbiAgICAgICAgY2FzZSAnICc6XG4gICAgICAgICAgLy8gV2hpdGVzcGFjZSBubyBsb25nZXIgYWR2YW5jZXMgdGltZVxuICAgICAgICAgIGlmICghcnVuTW9kZSkge1xuICAgICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnKCc6XG4gICAgICAgICAgZ3JvdXBTdGFydCA9IGZyYW1lO1xuICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcpJzpcbiAgICAgICAgICBncm91cFN0YXJ0ID0gLTE7XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgIGlmIChzdWJzY3JpcHRpb25GcmFtZSAhPT0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZvdW5kIGEgc2Vjb25kIHN1YnNjcmlwdGlvbiBwb2ludCBcXCdeXFwnIGluIGEgJyArXG4gICAgICAgICAgICAgICdzdWJzY3JpcHRpb24gbWFyYmxlIGRpYWdyYW0uIFRoZXJlIGNhbiBvbmx5IGJlIG9uZS4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3Vic2NyaXB0aW9uRnJhbWUgPSBncm91cFN0YXJ0ID4gLTEgPyBncm91cFN0YXJ0IDogZnJhbWU7XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgIGlmICh1bnN1YnNjcmlwdGlvbkZyYW1lICE9PSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZm91bmQgYSBzZWNvbmQgc3Vic2NyaXB0aW9uIHBvaW50IFxcJ15cXCcgaW4gYSAnICtcbiAgICAgICAgICAgICAgJ3N1YnNjcmlwdGlvbiBtYXJibGUgZGlhZ3JhbS4gVGhlcmUgY2FuIG9ubHkgYmUgb25lLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB1bnN1YnNjcmlwdGlvbkZyYW1lID0gZ3JvdXBTdGFydCA+IC0xID8gZ3JvdXBTdGFydCA6IGZyYW1lO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIHRpbWUgcHJvZ3Jlc3Npb24gc3ludGF4XG4gICAgICAgICAgaWYgKHJ1bk1vZGUgJiYgYy5tYXRjaCgvXlswLTldJC8pKSB7XG4gICAgICAgICAgICAvLyBUaW1lIHByb2dyZXNzaW9uIG11c3QgYmUgcHJlY2VlZGVkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZVxuICAgICAgICAgICAgLy8gaWYgaXQncyBub3QgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgZGlhZ3JhbVxuICAgICAgICAgICAgaWYgKGkgPT09IDAgfHwgbWFyYmxlc1tpIC0gMV0gPT09ICcgJykge1xuICAgICAgICAgICAgICBjb25zdCBidWZmZXIgPSBtYXJibGVzLnNsaWNlKGkpO1xuICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGJ1ZmZlci5tYXRjaCgvXihbMC05XSsoPzpcXC5bMC05XSspPykobXN8c3xtKSAvKTtcbiAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgaSArPSBtYXRjaFswXS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIGNvbnN0IGR1cmF0aW9uID0gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdW5pdCA9IG1hdGNoWzJdO1xuICAgICAgICAgICAgICAgIGxldCBkdXJhdGlvbkluTXM6IG51bWJlcjtcblxuICAgICAgICAgICAgICAgIHN3aXRjaCAodW5pdCkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbXMnOlxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbkluTXMgPSBkdXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25Jbk1zID0gZHVyYXRpb24gKiAxMDAwO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ20nOlxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbkluTXMgPSBkdXJhdGlvbiAqIDEwMDAgKiA2MDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhZHZhbmNlRnJhbWVCeShkdXJhdGlvbkluTXMgLyB0aGlzLmZyYW1lVGltZUZhY3Rvcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoZXJlIGNhbiBvbmx5IGJlIFxcJ15cXCcgYW5kIFxcJyFcXCcgbWFya2VycyBpbiBhICcgK1xuICAgICAgICAgICAgJ3N1YnNjcmlwdGlvbiBtYXJibGUgZGlhZ3JhbS4gRm91bmQgaW5zdGVhZCBcXCcnICsgYyArICdcXCcuJyk7XG4gICAgICB9XG5cbiAgICAgIGZyYW1lID0gbmV4dEZyYW1lO1xuICAgIH1cblxuICAgIGlmICh1bnN1YnNjcmlwdGlvbkZyYW1lIDwgMCkge1xuICAgICAgcmV0dXJuIG5ldyBTdWJzY3JpcHRpb25Mb2coc3Vic2NyaXB0aW9uRnJhbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IFN1YnNjcmlwdGlvbkxvZyhzdWJzY3JpcHRpb25GcmFtZSwgdW5zdWJzY3JpcHRpb25GcmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBwYXJzZU1hcmJsZXMobWFyYmxlczogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcz86IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICBlcnJvclZhbHVlPzogYW55LFxuICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsaXplSW5uZXJPYnNlcnZhYmxlczogYm9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgIHJ1bk1vZGUgPSBmYWxzZSk6IFRlc3RNZXNzYWdlW10ge1xuICAgIGlmIChtYXJibGVzLmluZGV4T2YoJyEnKSAhPT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY29udmVudGlvbmFsIG1hcmJsZSBkaWFncmFtcyBjYW5ub3QgaGF2ZSB0aGUgJyArXG4gICAgICAgICd1bnN1YnNjcmlwdGlvbiBtYXJrZXIgXCIhXCInKTtcbiAgICB9XG4gICAgY29uc3QgbGVuID0gbWFyYmxlcy5sZW5ndGg7XG4gICAgY29uc3QgdGVzdE1lc3NhZ2VzOiBUZXN0TWVzc2FnZVtdID0gW107XG4gICAgY29uc3Qgc3ViSW5kZXggPSBydW5Nb2RlID8gbWFyYmxlcy5yZXBsYWNlKC9eWyBdKy8sICcnKS5pbmRleE9mKCdeJykgOiBtYXJibGVzLmluZGV4T2YoJ14nKTtcbiAgICBsZXQgZnJhbWUgPSBzdWJJbmRleCA9PT0gLTEgPyAwIDogKHN1YkluZGV4ICogLXRoaXMuZnJhbWVUaW1lRmFjdG9yKTtcbiAgICBjb25zdCBnZXRWYWx1ZSA9IHR5cGVvZiB2YWx1ZXMgIT09ICdvYmplY3QnID9cbiAgICAgICh4OiBhbnkpID0+IHggOlxuICAgICAgKHg6IGFueSkgPT4ge1xuICAgICAgICAvLyBTdXBwb3J0IE9ic2VydmFibGUtb2YtT2JzZXJ2YWJsZXNcbiAgICAgICAgaWYgKG1hdGVyaWFsaXplSW5uZXJPYnNlcnZhYmxlcyAmJiB2YWx1ZXNbeF0gaW5zdGFuY2VvZiBDb2xkT2JzZXJ2YWJsZSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZXNbeF0ubWVzc2FnZXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlc1t4XTtcbiAgICAgIH07XG4gICAgbGV0IGdyb3VwU3RhcnQgPSAtMTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxldCBuZXh0RnJhbWUgPSBmcmFtZTtcbiAgICAgIGNvbnN0IGFkdmFuY2VGcmFtZUJ5ID0gKGNvdW50OiBudW1iZXIpID0+IHtcbiAgICAgICAgbmV4dEZyYW1lICs9IGNvdW50ICogdGhpcy5mcmFtZVRpbWVGYWN0b3I7XG4gICAgICB9O1xuXG4gICAgICBsZXQgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb248YW55PjtcbiAgICAgIGNvbnN0IGMgPSBtYXJibGVzW2ldO1xuICAgICAgc3dpdGNoIChjKSB7XG4gICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgIC8vIFdoaXRlc3BhY2Ugbm8gbG9uZ2VyIGFkdmFuY2VzIHRpbWVcbiAgICAgICAgICBpZiAoIXJ1bk1vZGUpIHtcbiAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJygnOlxuICAgICAgICAgIGdyb3VwU3RhcnQgPSBmcmFtZTtcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnKSc6XG4gICAgICAgICAgZ3JvdXBTdGFydCA9IC0xO1xuICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgICBub3RpZmljYXRpb24gPSBOb3RpZmljYXRpb24uY3JlYXRlQ29tcGxldGUoKTtcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJyMnOlxuICAgICAgICAgIG5vdGlmaWNhdGlvbiA9IE5vdGlmaWNhdGlvbi5jcmVhdGVFcnJvcihlcnJvclZhbHVlIHx8ICdlcnJvcicpO1xuICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIE1pZ2h0IGJlIHRpbWUgcHJvZ3Jlc3Npb24gc3ludGF4LCBvciBhIHZhbHVlIGxpdGVyYWxcbiAgICAgICAgICBpZiAocnVuTW9kZSAmJiBjLm1hdGNoKC9eWzAtOV0kLykpIHtcbiAgICAgICAgICAgIC8vIFRpbWUgcHJvZ3Jlc3Npb24gbXVzdCBiZSBwcmVjZWVkZWQgYnkgYXQgbGVhc3Qgb25lIHNwYWNlXG4gICAgICAgICAgICAvLyBpZiBpdCdzIG5vdCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBkaWFncmFtXG4gICAgICAgICAgICBpZiAoaSA9PT0gMCB8fCBtYXJibGVzW2kgLSAxXSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IG1hcmJsZXMuc2xpY2UoaSk7XG4gICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gYnVmZmVyLm1hdGNoKC9eKFswLTldKyg/OlxcLlswLTldKyk/KShtc3xzfG0pIC8pO1xuICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBpICs9IG1hdGNoWzBdLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgICAgICAgICAgICAgICBjb25zdCB1bml0ID0gbWF0Y2hbMl07XG4gICAgICAgICAgICAgICAgbGV0IGR1cmF0aW9uSW5NczogbnVtYmVyO1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoICh1bml0KSB7XG4gICAgICAgICAgICAgICAgICBjYXNlICdtcyc6XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uSW5NcyA9IGR1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbkluTXMgPSBkdXJhdGlvbiAqIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbSc6XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uSW5NcyA9IGR1cmF0aW9uICogMTAwMCAqIDYwO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KGR1cmF0aW9uSW5NcyAvIHRoaXMuZnJhbWVUaW1lRmFjdG9yKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5vdGlmaWNhdGlvbiA9IE5vdGlmaWNhdGlvbi5jcmVhdGVOZXh0KGdldFZhbHVlKGMpKTtcbiAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKG5vdGlmaWNhdGlvbikge1xuICAgICAgICB0ZXN0TWVzc2FnZXMucHVzaCh7IGZyYW1lOiBncm91cFN0YXJ0ID4gLTEgPyBncm91cFN0YXJ0IDogZnJhbWUsIG5vdGlmaWNhdGlvbiB9KTtcbiAgICAgIH1cblxuICAgICAgZnJhbWUgPSBuZXh0RnJhbWU7XG4gICAgfVxuICAgIHJldHVybiB0ZXN0TWVzc2FnZXM7XG4gIH1cblxuICBydW48VD4oY2FsbGJhY2s6IChoZWxwZXJzOiBSdW5IZWxwZXJzKSA9PiBUKTogVCB7XG4gICAgY29uc3QgcHJldkZyYW1lVGltZUZhY3RvciA9IFRlc3RTY2hlZHVsZXIuZnJhbWVUaW1lRmFjdG9yO1xuICAgIGNvbnN0IHByZXZNYXhGcmFtZXMgPSB0aGlzLm1heEZyYW1lcztcblxuICAgIFRlc3RTY2hlZHVsZXIuZnJhbWVUaW1lRmFjdG9yID0gMTtcbiAgICB0aGlzLm1heEZyYW1lcyA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICB0aGlzLnJ1bk1vZGUgPSB0cnVlO1xuICAgIEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlID0gdGhpcztcblxuICAgIGNvbnN0IGhlbHBlcnMgPSB7XG4gICAgICBjb2xkOiB0aGlzLmNyZWF0ZUNvbGRPYnNlcnZhYmxlLmJpbmQodGhpcyksXG4gICAgICBob3Q6IHRoaXMuY3JlYXRlSG90T2JzZXJ2YWJsZS5iaW5kKHRoaXMpLFxuICAgICAgZmx1c2g6IHRoaXMuZmx1c2guYmluZCh0aGlzKSxcbiAgICAgIGV4cGVjdE9ic2VydmFibGU6IHRoaXMuZXhwZWN0T2JzZXJ2YWJsZS5iaW5kKHRoaXMpLFxuICAgICAgZXhwZWN0U3Vic2NyaXB0aW9uczogdGhpcy5leHBlY3RTdWJzY3JpcHRpb25zLmJpbmQodGhpcyksXG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmV0ID0gY2FsbGJhY2soaGVscGVycyk7XG4gICAgICB0aGlzLmZsdXNoKCk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0gZmluYWxseSB7XG4gICAgICBUZXN0U2NoZWR1bGVyLmZyYW1lVGltZUZhY3RvciA9IHByZXZGcmFtZVRpbWVGYWN0b3I7XG4gICAgICB0aGlzLm1heEZyYW1lcyA9IHByZXZNYXhGcmFtZXM7XG4gICAgICB0aGlzLnJ1bk1vZGUgPSBmYWxzZTtcbiAgICAgIEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxufVxuIl19