"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var c = require('ansi-colors');
var pkg = require('../../package.json');
var fancyLog = require('fancy-log');
var LEVEL;
(function (LEVEL) {
    LEVEL[LEVEL["INFO"] = 0] = "INFO";
    LEVEL[LEVEL["WARN"] = 1] = "WARN";
    LEVEL[LEVEL["DEBUG"] = 2] = "DEBUG";
    LEVEL[LEVEL["FATAL"] = 3] = "FATAL";
    LEVEL[LEVEL["ERROR"] = 4] = "ERROR";
})(LEVEL || (LEVEL = {}));
var Logger = /** @class */ (function () {
    function Logger() {
        this.name = pkg.name;
        this.version = pkg.version;
        this.logger = fancyLog;
        this.silent = false;
    }
    Logger.prototype.setVerbose = function (level) {
        this.silent = level;
    };
    Logger.prototype.title = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.silent == false) {
            this.logger(c.cyan.apply(c, args));
        }
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.silent == false) {
            this.logger(this.format.apply(this, [LEVEL.INFO].concat(args)));
        }
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.silent == false) {
            this.logger(this.format.apply(this, [LEVEL.WARN].concat(args)));
        }
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.silent == false) {
            this.logger(this.format.apply(this, [LEVEL.FATAL].concat(args)));
        }
    };
    Logger.prototype.fatal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.silent == false) {
            this.error.apply(this, args);
        }
    };
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.silent == false) {
            this.logger(this.format.apply(this, [LEVEL.DEBUG].concat(args)));
        }
    };
    Logger.prototype.trace = function (error, file) {
        this.fatal('Ouch', file);
        this.fatal('', error);
        this.warn('ignoring', file);
        this.warn('see error', '');
        console.trace(error);
    };
    Logger.prototype.format = function (level) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var pad = function (s, l, c) {
            if (c === void 0) { c = ''; }
            return s + Array(Math.max(0, l - s.length + 1)).join(c);
        };
        var msg = args.join(' ');
        if (args.length > 1) {
            msg = pad(args.shift(), 13, ' ') + ": " + args.join(' ');
        }
        switch (level) {
            case LEVEL.INFO:
                msg = c.green(msg);
                break;
            case LEVEL.WARN:
                msg = c.yellow(msg);
                break;
            case LEVEL.DEBUG:
                msg = c.gray(msg);
                break;
            case LEVEL.ERROR:
            case LEVEL.FATAL:
                msg = c.red(msg);
                break;
        }
        return [
            msg
        ].join('');
    };
    return Logger;
}());
exports.Logger = Logger;
exports.logger = new Logger();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvbmdkLWNvcmUvc3JjL2xhbmcvbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQy9CLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3hDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUV0QyxJQUFLLEtBS0o7QUFMRCxXQUFLLEtBQUs7SUFDVCxpQ0FBSSxDQUFBO0lBQ0osaUNBQUksQ0FBQTtJQUNKLG1DQUFLLENBQUE7SUFDTCxtQ0FBSyxDQUFBO0lBQUUsbUNBQUssQ0FBQTtBQUNiLENBQUMsRUFMSSxLQUFLLEtBQUwsS0FBSyxRQUtUO0FBRUQ7SUFPQztRQUNDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELDJCQUFVLEdBQVYsVUFBVyxLQUFjO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRixzQkFBSyxHQUFMO1FBQU0sY0FBTzthQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87WUFBUCx5QkFBTzs7UUFDVixJQUFHLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFFO1lBQ3ZCLElB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QUFFO1lBQ25CLEdBQUcsR0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsVUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBSSxDQUFDO1NBQzdEO1FBR0QsUUFBTyxLQUFLLEVBQUU7WUFDYixLQUFLLEtBQUssQ0FBQyxJQUFJO2dCQUNkLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQixNQUFNO1lBRVAsS0FBSyxLQUFLLENBQUMsSUFBSTtnQkFDZCxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEIsTUFBTTtZQUVQLEtBQUssS0FBSyxDQUFDLEtBQUs7Z0JBQ2YsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU07WUFFUCxLQUFLLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDakIsS0FBSyxLQUFLLENBQUMsS0FBSztnQkFDZixHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakIsTUFBTTtTQUNQO1FBRUQsT0FBTztZQUNOLEdBQUc7U0FDSCxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNaLENBQUM7SUFDRixhQUFDO0FBQUQsQ0FBQyxBQTNHRCxJQTJHQztBQTNHWSx3QkFBTTtBQTZHUixRQUFBLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGMgPSByZXF1aXJlKCdhbnNpLWNvbG9ycycpO1xubGV0IHBrZyA9IHJlcXVpcmUoJy4uLy4uL3BhY2thZ2UuanNvbicpO1xuY29uc3QgZmFuY3lMb2cgPSByZXF1aXJlKCdmYW5jeS1sb2cnKTtcblxuZW51bSBMRVZFTCB7XG5cdElORk8sXG5cdFdBUk4sXG5cdERFQlVHLFxuXHRGQVRBTCwgRVJST1Jcbn1cblxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XG5cblx0bmFtZTtcblx0bG9nZ2VyO1xuXHR2ZXJzaW9uO1xuXHRzaWxlbnQ7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5uYW1lID0gcGtnLm5hbWU7XG5cdFx0dGhpcy52ZXJzaW9uID0gcGtnLnZlcnNpb247XG5cdFx0dGhpcy5sb2dnZXIgPSBmYW5jeUxvZztcblx0XHR0aGlzLnNpbGVudCA9IGZhbHNlO1xuICB9XG4gIFxuICBzZXRWZXJib3NlKGxldmVsOiBib29sZWFuKSB7XG4gICAgdGhpcy5zaWxlbnQgPSBsZXZlbDtcbiAgfVxuXG5cdHRpdGxlKC4uLmFyZ3MpIHtcbiAgICBpZih0aGlzLnNpbGVudCA9PSBmYWxzZSkge1xuICAgICAgdGhpcy5sb2dnZXIoXG4gICAgICAgIGMuY3lhbiguLi5hcmdzKVxuICAgICAgKTtcbiAgICB9XG5cdH1cblxuXHRpbmZvKC4uLmFyZ3MpIHtcbiAgICBpZih0aGlzLnNpbGVudCA9PSBmYWxzZSkge1xuICAgICAgdGhpcy5sb2dnZXIoXG4gICAgICAgIHRoaXMuZm9ybWF0KExFVkVMLklORk8sIC4uLmFyZ3MpXG4gICAgICApO1xuICAgIH1cblx0fVxuXG5cdHdhcm4oLi4uYXJncykge1xuICAgIGlmKHRoaXMuc2lsZW50ID09IGZhbHNlKSB7XG4gICAgICB0aGlzLmxvZ2dlcihcbiAgICAgICAgdGhpcy5mb3JtYXQoTEVWRUwuV0FSTiwgLi4uYXJncylcbiAgICAgICk7XG4gICAgfVxuXHR9XG5cblx0ZXJyb3IoLi4uYXJncykge1xuICAgIGlmKHRoaXMuc2lsZW50ID09IGZhbHNlKSB7XG4gICAgICB0aGlzLmxvZ2dlcihcbiAgICAgICAgdGhpcy5mb3JtYXQoTEVWRUwuRkFUQUwsIC4uLmFyZ3MpXG4gICAgICApO1xuICAgIH1cblx0fVxuXG5cdGZhdGFsKC4uLmFyZ3MpIHtcbiAgICBpZih0aGlzLnNpbGVudCA9PSBmYWxzZSkge1xuICAgICAgdGhpcy5lcnJvciguLi5hcmdzKTtcbiAgICB9XG4gICAgXG4gIH1cblx0ZGVidWcoLi4uYXJncykge1xuICAgIGlmKHRoaXMuc2lsZW50ID09IGZhbHNlKSB7XG4gICAgICB0aGlzLmxvZ2dlcihcbiAgICAgICAgdGhpcy5mb3JtYXQoTEVWRUwuREVCVUcsIC4uLmFyZ3MpXG4gICAgICApO1xuICAgIH1cblx0fVxuXG5cdHRyYWNlKGVycm9yLCBmaWxlKSB7XG5cdFx0dGhpcy5mYXRhbCgnT3VjaCcsIGZpbGUpO1xuXHRcdHRoaXMuZmF0YWwoJycsIGVycm9yKTtcblx0XHR0aGlzLndhcm4oJ2lnbm9yaW5nJywgZmlsZSk7XG5cdFx0dGhpcy53YXJuKCdzZWUgZXJyb3InLCAnJyk7XG5cdFx0Y29uc29sZS50cmFjZShlcnJvcik7XG5cdH1cblxuXHRwcml2YXRlIGZvcm1hdChsZXZlbCwgLi4uYXJncykge1xuXG5cdFx0bGV0IHBhZCA9IChzLCBsLCBjPScnKSA9PiB7XG5cdFx0XHRyZXR1cm4gcyArIEFycmF5KCBNYXRoLm1heCgwLCBsIC0gcy5sZW5ndGggKyAxKSkuam9pbiggYyApXG5cdFx0fTtcblxuXHRcdGxldCBtc2cgPSBhcmdzLmpvaW4oJyAnKTtcblx0XHRpZihhcmdzLmxlbmd0aCA+IDEpIHtcblx0XHRcdG1zZyA9IGAkeyBwYWQoYXJncy5zaGlmdCgpLCAxMywgJyAnKSB9OiAkeyBhcmdzLmpvaW4oJyAnKSB9YDtcblx0XHR9XG5cblxuXHRcdHN3aXRjaChsZXZlbCkge1xuXHRcdFx0Y2FzZSBMRVZFTC5JTkZPOlxuXHRcdFx0XHRtc2cgPSBjLmdyZWVuKG1zZyk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIExFVkVMLldBUk46XG5cdFx0XHRcdG1zZyA9IGMueWVsbG93KG1zZyk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIExFVkVMLkRFQlVHOlxuXHRcdFx0XHRtc2cgPSBjLmdyYXkobXNnKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgTEVWRUwuRVJST1I6XG5cdFx0XHRjYXNlIExFVkVMLkZBVEFMOlxuXHRcdFx0XHRtc2cgPSBjLnJlZChtc2cpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gW1xuXHRcdFx0bXNnXG5cdFx0XS5qb2luKCcnKTtcblx0fVxufVxuXG5leHBvcnQgbGV0IGxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcbiJdfQ==