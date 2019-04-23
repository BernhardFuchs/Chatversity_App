"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var asap_1 = require("../scheduler/asap");
var isNumeric_1 = require("../util/isNumeric");
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var SubscribeOnObservable = /** @class */ (function (_super) {
    __extends(SubscribeOnObservable, _super);
    function SubscribeOnObservable(source, delayTime, scheduler) {
        if (delayTime === void 0) { delayTime = 0; }
        if (scheduler === void 0) { scheduler = asap_1.asap; }
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.delayTime = delayTime;
        _this.scheduler = scheduler;
        if (!isNumeric_1.isNumeric(delayTime) || delayTime < 0) {
            _this.delayTime = 0;
        }
        if (!scheduler || typeof scheduler.schedule !== 'function') {
            _this.scheduler = asap_1.asap;
        }
        return _this;
    }
    /** @nocollapse */
    SubscribeOnObservable.create = function (source, delay, scheduler) {
        if (delay === void 0) { delay = 0; }
        if (scheduler === void 0) { scheduler = asap_1.asap; }
        return new SubscribeOnObservable(source, delay, scheduler);
    };
    /** @nocollapse */
    SubscribeOnObservable.dispatch = function (arg) {
        var source = arg.source, subscriber = arg.subscriber;
        return this.add(source.subscribe(subscriber));
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    SubscribeOnObservable.prototype._subscribe = function (subscriber) {
        var delay = this.delayTime;
        var source = this.source;
        var scheduler = this.scheduler;
        return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
            source: source, subscriber: subscriber
        });
    };
    return SubscribeOnObservable;
}(Observable_1.Observable));
exports.SubscribeOnObservable = SubscribeOnObservable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vic2NyaWJlT25PYnNlcnZhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL1N1YnNjcmliZU9uT2JzZXJ2YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLDRDQUEyQztBQUMzQywwQ0FBeUM7QUFDekMsK0NBQThDO0FBTzlDOzs7O0dBSUc7QUFDSDtJQUE4Qyx5Q0FBYTtJQVl6RCwrQkFBbUIsTUFBcUIsRUFDcEIsU0FBcUIsRUFDckIsU0FBK0I7UUFEL0IsMEJBQUEsRUFBQSxhQUFxQjtRQUNyQiwwQkFBQSxFQUFBLFlBQTJCLFdBQUk7UUFGbkQsWUFHRSxpQkFBTyxTQU9SO1FBVmtCLFlBQU0sR0FBTixNQUFNLENBQWU7UUFDcEIsZUFBUyxHQUFULFNBQVMsQ0FBWTtRQUNyQixlQUFTLEdBQVQsU0FBUyxDQUFzQjtRQUVqRCxJQUFJLENBQUMscUJBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFO1lBQzFDLEtBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCO1FBQ0QsSUFBSSxDQUFDLFNBQVMsSUFBSSxPQUFPLFNBQVMsQ0FBQyxRQUFRLEtBQUssVUFBVSxFQUFFO1lBQzFELEtBQUksQ0FBQyxTQUFTLEdBQUcsV0FBSSxDQUFDO1NBQ3ZCOztJQUNILENBQUM7SUFyQkQsa0JBQWtCO0lBQ1gsNEJBQU0sR0FBYixVQUFpQixNQUFxQixFQUFFLEtBQWlCLEVBQUUsU0FBK0I7UUFBbEQsc0JBQUEsRUFBQSxTQUFpQjtRQUFFLDBCQUFBLEVBQUEsWUFBMkIsV0FBSTtRQUN4RixPQUFPLElBQUkscUJBQXFCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsa0JBQWtCO0lBQ1gsOEJBQVEsR0FBZixVQUE2QyxHQUFtQjtRQUN0RCxJQUFBLG1CQUFNLEVBQUUsMkJBQVUsQ0FBUztRQUNuQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFjRCx5RUFBeUU7SUFDekUsMENBQVUsR0FBVixVQUFXLFVBQXlCO1FBQ2xDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDN0IsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBRWpDLE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBbUIscUJBQXFCLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUNqRixNQUFNLFFBQUEsRUFBRSxVQUFVLFlBQUE7U0FDbkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILDRCQUFDO0FBQUQsQ0FBQyxBQWxDRCxDQUE4Qyx1QkFBVSxHQWtDdkQ7QUFsQ1ksc0RBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSwgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGFzYXAgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXNhcCc7XG5pbXBvcnQgeyBpc051bWVyaWMgfSBmcm9tICcuLi91dGlsL2lzTnVtZXJpYyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGlzcGF0Y2hBcmc8VD4ge1xuICBzb3VyY2U6IE9ic2VydmFibGU8VD47XG4gIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD47XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICogQGhpZGUgdHJ1ZVxuICovXG5leHBvcnQgY2xhc3MgU3Vic2NyaWJlT25PYnNlcnZhYmxlPFQ+IGV4dGVuZHMgT2JzZXJ2YWJsZTxUPiB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgY3JlYXRlPFQ+KHNvdXJjZTogT2JzZXJ2YWJsZTxUPiwgZGVsYXk6IG51bWJlciA9IDAsIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzYXApOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gbmV3IFN1YnNjcmliZU9uT2JzZXJ2YWJsZShzb3VyY2UsIGRlbGF5LCBzY2hlZHVsZXIpO1xuICB9XG5cbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBkaXNwYXRjaDxUPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIGFyZzogRGlzcGF0Y2hBcmc8VD4pOiBTdWJzY3JpcHRpb24ge1xuICAgIGNvbnN0IHsgc291cmNlLCBzdWJzY3JpYmVyIH0gPSBhcmc7XG4gICAgcmV0dXJuIHRoaXMuYWRkKHNvdXJjZS5zdWJzY3JpYmUoc3Vic2NyaWJlcikpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIHNvdXJjZTogT2JzZXJ2YWJsZTxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBkZWxheVRpbWU6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXNhcCkge1xuICAgIHN1cGVyKCk7XG4gICAgaWYgKCFpc051bWVyaWMoZGVsYXlUaW1lKSB8fCBkZWxheVRpbWUgPCAwKSB7XG4gICAgICB0aGlzLmRlbGF5VGltZSA9IDA7XG4gICAgfVxuICAgIGlmICghc2NoZWR1bGVyIHx8IHR5cGVvZiBzY2hlZHVsZXIuc2NoZWR1bGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuc2NoZWR1bGVyID0gYXNhcDtcbiAgICB9XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikge1xuICAgIGNvbnN0IGRlbGF5ID0gdGhpcy5kZWxheVRpbWU7XG4gICAgY29uc3Qgc291cmNlID0gdGhpcy5zb3VyY2U7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG5cbiAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlPERpc3BhdGNoQXJnPGFueT4+KFN1YnNjcmliZU9uT2JzZXJ2YWJsZS5kaXNwYXRjaCwgZGVsYXksIHtcbiAgICAgIHNvdXJjZSwgc3Vic2NyaWJlclxuICAgIH0pO1xuICB9XG59XG4iXX0=