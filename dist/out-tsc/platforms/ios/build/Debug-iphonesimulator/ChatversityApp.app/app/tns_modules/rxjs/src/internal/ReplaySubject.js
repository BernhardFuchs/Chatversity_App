"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subject_1 = require("./Subject");
var queue_1 = require("./scheduler/queue");
var Subscription_1 = require("./Subscription");
var observeOn_1 = require("./operators/observeOn");
var ObjectUnsubscribedError_1 = require("./util/ObjectUnsubscribedError");
var SubjectSubscription_1 = require("./SubjectSubscription");
/**
 * A variant of Subject that "replays" or emits old values to new subscribers.
 * It buffers a set number of values and will emit those values immediately to
 * any new subscribers in addition to emitting new values to existing subscribers.
 *
 * @class ReplaySubject<T>
 */
var ReplaySubject = /** @class */ (function (_super) {
    __extends(ReplaySubject, _super);
    function ReplaySubject(bufferSize, windowTime, scheduler) {
        if (bufferSize === void 0) { bufferSize = Number.POSITIVE_INFINITY; }
        if (windowTime === void 0) { windowTime = Number.POSITIVE_INFINITY; }
        var _this = _super.call(this) || this;
        _this.scheduler = scheduler;
        _this._events = [];
        _this._infiniteTimeWindow = false;
        _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
        _this._windowTime = windowTime < 1 ? 1 : windowTime;
        if (windowTime === Number.POSITIVE_INFINITY) {
            _this._infiniteTimeWindow = true;
            _this.next = _this.nextInfiniteTimeWindow;
        }
        else {
            _this.next = _this.nextTimeWindow;
        }
        return _this;
    }
    ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
        var _events = this._events;
        _events.push(value);
        // Since this method is invoked in every next() call than the buffer
        // can overgrow the max size only by one item
        if (_events.length > this._bufferSize) {
            _events.shift();
        }
        _super.prototype.next.call(this, value);
    };
    ReplaySubject.prototype.nextTimeWindow = function (value) {
        this._events.push(new ReplayEvent(this._getNow(), value));
        this._trimBufferThenGetEvents();
        _super.prototype.next.call(this, value);
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    ReplaySubject.prototype._subscribe = function (subscriber) {
        // When `_infiniteTimeWindow === true` then the buffer is already trimmed
        var _infiniteTimeWindow = this._infiniteTimeWindow;
        var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
        var scheduler = this.scheduler;
        var len = _events.length;
        var subscription;
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        else if (this.isStopped || this.hasError) {
            subscription = Subscription_1.Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            subscription = new SubjectSubscription_1.SubjectSubscription(this, subscriber);
        }
        if (scheduler) {
            subscriber.add(subscriber = new observeOn_1.ObserveOnSubscriber(subscriber, scheduler));
        }
        if (_infiniteTimeWindow) {
            for (var i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i]);
            }
        }
        else {
            for (var i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i].value);
            }
        }
        if (this.hasError) {
            subscriber.error(this.thrownError);
        }
        else if (this.isStopped) {
            subscriber.complete();
        }
        return subscription;
    };
    ReplaySubject.prototype._getNow = function () {
        return (this.scheduler || queue_1.queue).now();
    };
    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
        var now = this._getNow();
        var _bufferSize = this._bufferSize;
        var _windowTime = this._windowTime;
        var _events = this._events;
        var eventsCount = _events.length;
        var spliceCount = 0;
        // Trim events that fall out of the time window.
        // Start at the front of the list. Break early once
        // we encounter an event that falls within the window.
        while (spliceCount < eventsCount) {
            if ((now - _events[spliceCount].time) < _windowTime) {
                break;
            }
            spliceCount++;
        }
        if (eventsCount > _bufferSize) {
            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
        }
        if (spliceCount > 0) {
            _events.splice(0, spliceCount);
        }
        return _events;
    };
    return ReplaySubject;
}(Subject_1.Subject));
exports.ReplaySubject = ReplaySubject;
var ReplayEvent = /** @class */ (function () {
    function ReplayEvent(time, value) {
        this.time = time;
        this.value = value;
    }
    return ReplayEvent;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwbGF5U3ViamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvUmVwbGF5U3ViamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFvQztBQUVwQywyQ0FBMEM7QUFFMUMsK0NBQThDO0FBQzlDLG1EQUE0RDtBQUM1RCwwRUFBeUU7QUFDekUsNkRBQTREO0FBQzVEOzs7Ozs7R0FNRztBQUNIO0lBQXNDLGlDQUFVO0lBTTlDLHVCQUFZLFVBQTZDLEVBQzdDLFVBQTZDLEVBQ3JDLFNBQXlCO1FBRmpDLDJCQUFBLEVBQUEsYUFBcUIsTUFBTSxDQUFDLGlCQUFpQjtRQUM3QywyQkFBQSxFQUFBLGFBQXFCLE1BQU0sQ0FBQyxpQkFBaUI7UUFEekQsWUFHRSxpQkFBTyxTQVVSO1FBWG1CLGVBQVMsR0FBVCxTQUFTLENBQWdCO1FBUHJDLGFBQU8sR0FBMkIsRUFBRSxDQUFDO1FBR3JDLHlCQUFtQixHQUFZLEtBQUssQ0FBQztRQU0zQyxLQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQ25ELEtBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFFbkQsSUFBSSxVQUFVLEtBQUssTUFBTSxDQUFDLGlCQUFpQixFQUFFO1lBQzNDLEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7WUFDaEMsS0FBSSxDQUFDLElBQUksR0FBRyxLQUFJLENBQUMsc0JBQXNCLENBQUM7U0FDekM7YUFBTTtZQUNMLEtBQUks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QUFELENBQUMsQUFIRCxJQUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4vU3ViamVjdCc7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBxdWV1ZSB9IGZyb20gJy4vc2NoZWR1bGVyL3F1ZXVlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT2JzZXJ2ZU9uU3Vic2NyaWJlciB9IGZyb20gJy4vb3BlcmF0b3JzL29ic2VydmVPbic7XG5pbXBvcnQgeyBPYmplY3RVbnN1YnNjcmliZWRFcnJvciB9IGZyb20gJy4vdXRpbC9PYmplY3RVbnN1YnNjcmliZWRFcnJvcic7XG5pbXBvcnQgeyBTdWJqZWN0U3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJqZWN0U3Vic2NyaXB0aW9uJztcbi8qKlxuICogQSB2YXJpYW50IG9mIFN1YmplY3QgdGhhdCBcInJlcGxheXNcIiBvciBlbWl0cyBvbGQgdmFsdWVzIHRvIG5ldyBzdWJzY3JpYmVycy5cbiAqIEl0IGJ1ZmZlcnMgYSBzZXQgbnVtYmVyIG9mIHZhbHVlcyBhbmQgd2lsbCBlbWl0IHRob3NlIHZhbHVlcyBpbW1lZGlhdGVseSB0b1xuICogYW55IG5ldyBzdWJzY3JpYmVycyBpbiBhZGRpdGlvbiB0byBlbWl0dGluZyBuZXcgdmFsdWVzIHRvIGV4aXN0aW5nIHN1YnNjcmliZXJzLlxuICpcbiAqIEBjbGFzcyBSZXBsYXlTdWJqZWN0PFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBSZXBsYXlTdWJqZWN0PFQ+IGV4dGVuZHMgU3ViamVjdDxUPiB7XG4gIHByaXZhdGUgX2V2ZW50czogKFJlcGxheUV2ZW50PFQ+IHwgVClbXSA9IFtdO1xuICBwcml2YXRlIF9idWZmZXJTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgX3dpbmRvd1RpbWU6IG51bWJlcjtcbiAgcHJpdmF0ZSBfaW5maW5pdGVUaW1lV2luZG93OiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoYnVmZmVyU2l6ZTogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICAgICAgICAgICAgICB3aW5kb3dUaW1lOiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gICAgICAgICAgICAgIHByaXZhdGUgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fYnVmZmVyU2l6ZSA9IGJ1ZmZlclNpemUgPCAxID8gMSA6IGJ1ZmZlclNpemU7XG4gICAgdGhpcy5fd2luZG93VGltZSA9IHdpbmRvd1RpbWUgPCAxID8gMSA6IHdpbmRvd1RpbWU7XG5cbiAgICBpZiAod2luZG93VGltZSA9PT0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgICB0aGlzLl9pbmZpbml0ZVRpbWVXaW5kb3cgPSB0cnVlO1xuICAgICAgdGhpcy5uZXh0ID0gdGhpcy5uZXh0SW5maW5pdGVUaW1lV2luZG93O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5leHQgPSB0aGlzLm5leHRUaW1lV2luZG93O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbmV4dEluZmluaXRlVGltZVdpbmRvdyh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IF9ldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgX2V2ZW50cy5wdXNoKHZhbHVlKTtcbiAgICAvLyBTaW5jZSB0aGlzIG1ldGhvZCBpcyBpbnZva2VkIGluIGV2ZXJ5IG5leHQoKSBjYWxsIHRoYW4gdGhlIGJ1ZmZlclxuICAgIC8vIGNhbiBvdmVyZ3JvdyB0aGUgbWF4IHNpemUgb25seSBieSBvbmUgaXRlbVxuICAgIGlmIChfZXZlbnRzLmxlbmd0aCA+IHRoaXMuX2J1ZmZlclNpemUpIHtcbiAgICAgIF9ldmVudHMuc2hpZnQoKTtcbiAgICB9XG5cbiAgICBzdXBlci5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgbmV4dFRpbWVXaW5kb3codmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLl9ldmVudHMucHVzaChuZXcgUmVwbGF5RXZlbnQodGhpcy5fZ2V0Tm93KCksIHZhbHVlKSk7XG4gICAgdGhpcy5fdHJpbUJ1ZmZlclRoZW5HZXRFdmVudHMoKTtcblxuICAgIHN1cGVyLm5leHQodmFsdWUpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pOiBTdWJzY3JpcHRpb24ge1xuICAgIC8vIFdoZW4gYF9pbmZpbml0ZVRpbWVXaW5kb3cgPT09IHRydWVgIHRoZW4gdGhlIGJ1ZmZlciBpcyBhbHJlYWR5IHRyaW1tZWRcbiAgICBjb25zdCBfaW5maW5pdGVUaW1lV2luZG93ID0gdGhpcy5faW5maW5pdGVUaW1lV2luZG93O1xuICAgIGNvbnN0IF9ldmVudHMgPSBfaW5maW5pdGVUaW1lV2luZG93ID8gdGhpcy5fZXZlbnRzIDogdGhpcy5fdHJpbUJ1ZmZlclRoZW5HZXRFdmVudHMoKTtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSB0aGlzLnNjaGVkdWxlcjtcbiAgICBjb25zdCBsZW4gPSBfZXZlbnRzLmxlbmd0aDtcbiAgICBsZXQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1N0b3BwZWQgfHwgdGhpcy5oYXNFcnJvcikge1xuICAgICAgc3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9ic2VydmVycy5wdXNoKHN1YnNjcmliZXIpO1xuICAgICAgc3Vic2NyaXB0aW9uID0gbmV3IFN1YmplY3RTdWJzY3JpcHRpb24odGhpcywgc3Vic2NyaWJlcik7XG4gICAgfVxuXG4gICAgaWYgKHNjaGVkdWxlcikge1xuICAgICAgc3Vic2NyaWJlci5hZGQoc3Vic2NyaWJlciA9IG5ldyBPYnNlcnZlT25TdWJzY3JpYmVyPFQ+KHN1YnNjcmliZXIsIHNjaGVkdWxlcikpO1xuICAgIH1cblxuICAgIGlmIChfaW5maW5pdGVUaW1lV2luZG93KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbiAmJiAhc3Vic2NyaWJlci5jbG9zZWQ7IGkrKykge1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQoPFQ+X2V2ZW50c1tpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuICYmICFzdWJzY3JpYmVyLmNsb3NlZDsgaSsrKSB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dCgoPFJlcGxheUV2ZW50PFQ+Pl9ldmVudHNbaV0pLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNFcnJvcikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcih0aGlzLnRocm93bkVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxuXG4gIF9nZXROb3coKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKHRoaXMuc2NoZWR1bGVyIHx8IHF1ZXVlKS5ub3coKTtcbiAgfVxuXG4gIHByaXZhdGUgX3RyaW1CdWZmZXJUaGVuR2V0RXZlbnRzKCk6IFJlcGxheUV2ZW50PFQ+W10ge1xuICAgIGNvbnN0IG5vdyA9IHRoaXMuX2dldE5vdygpO1xuICAgIGNvbnN0IF9idWZmZXJTaXplID0gdGhpcy5fYnVmZmVyU2l6ZTtcbiAgICBjb25zdCBfd2luZG93VGltZSA9IHRoaXMuX3dpbmRvd1RpbWU7XG4gICAgY29uc3QgX2V2ZW50cyA9IDxSZXBsYXlFdmVudDxUPltdPnRoaXMuX2V2ZW50cztcblxuICAgIGNvbnN0IGV2ZW50c0NvdW50ID0gX2V2ZW50cy5sZW5ndGg7XG4gICAgbGV0IHNwbGljZUNvdW50ID0gMDtcblxuICAgIC8vIFRyaW0gZXZlbnRzIHRoYXQgZmFsbCBvdXQgb2YgdGhlIHRpbWUgd2luZG93LlxuICAgIC8vIFN0YXJ0IGF0IHRoZSBmcm9udCBvZiB0aGUgbGlzdC4gQnJlYWsgZWFybHkgb25jZVxuICAgIC8vIHdlIGVuY291bnRlciBhbiBldmVudCB0aGF0IGZhbGxzIHdpdGhpbiB0aGUgd2luZG93LlxuICAgIHdoaWxlIChzcGxpY2VDb3VudCA8IGV2ZW50c0NvdW50KSB7XG4gICAgICBpZiAoKG5vdyAtIF9ldmVudHNbc3BsaWNlQ291bnRdLnRpbWUpIDwgX3dpbmRvd1RpbWUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBzcGxpY2VDb3VudCsrO1xuICAgIH1cblxuICAgIGlmIChldmVudHNDb3VudCA+IF9idWZmZXJTaXplKSB7XG4gICAgICBzcGxpY2VDb3VudCA9IE1hdGgubWF4KHNwbGljZUNvdW50LCBldmVudHNDb3VudCAtIF9idWZmZXJTaXplKTtcbiAgICB9XG5cbiAgICBpZiAoc3BsaWNlQ291bnQgPiAwKSB7XG4gICAgICBfZXZlbnRzLnNwbGljZSgwLCBzcGxpY2VDb3VudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9ldmVudHM7XG4gIH1cblxufVxuXG5jbGFzcyBSZXBsYXlFdmVudDxUPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0aW1lOiBudW1iZXIsIHB1YmxpYyB2YWx1ZTogVCkge1xuICB9XG59XG4iXX0=