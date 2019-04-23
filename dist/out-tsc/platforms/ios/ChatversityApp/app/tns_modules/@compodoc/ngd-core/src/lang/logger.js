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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL25nZC1jb3JlL3NyYy9sYW5nL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMvQixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN4QyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFdEMsSUFBSyxLQUtKO0FBTEQsV0FBSyxLQUFLO0lBQ1QsaUNBQUksQ0FBQTtJQUNKLGlDQUFJLENBQUE7SUFDSixtQ0FBSyxDQUFBO0lBQ0wsbUNBQUssQ0FBQTtJQUFFLG1DQUFLLENBQUE7QUFDYixDQUFDLEVBTEksS0FBSyxLQUFMLEtBQUssUUFLVDtBQUVEO0lBT0M7UUFDQyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFRCwyQkFBVSxHQUFWLFVBQVcsS0FBYztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUYsc0JBQUssR0FBTDtRQUFNLGNBQU87YUFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO1lBQVAseUJBQU87O1FBQ1YsSUFBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBRTtZQUN2QixJQUFJLENBQUMsTUFBTSxDQUNULENBQUMsQ0FBQyxJQUFJLE9BQU4s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QyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLFVBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUksQ0FBQztTQUM3RDtRQUdELFFBQU8sS0FBSyxFQUFFO1lBQ2IsS0FBSyxLQUFLLENBQUMsSUFBSTtnQkFDZCxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkIsTUFBTTtZQUVQLEtBQUssS0FBSyxDQUFDLElBQUk7Z0JBQ2QsR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU07WUFFUCxLQUFLLEtBQUssQ0FBQyxLQUFLO2dCQUNmLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQixNQUFNO1lBRVAsS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ2pCLEtBQUssS0FBSyxDQUFDLEtBQUs7Z0JBQ2YsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU07U0FDUDtRQUVELE9BQU87WUFDTixHQUFHO1NBQ0gsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDWixDQUFDO0lBQ0YsYUFBQztBQUFELENBQUMsQUEzR0QsSUEyR0M7QUEzR1ksd0JBQU07QUE2R1IsUUFBQSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImxldCBjID0gcmVxdWlyZSgnYW5zaS1jb2xvcnMnKTtcbmxldCBwa2cgPSByZXF1aXJlKCcuLi8uLi9wYWNrYWdlLmpzb24nKTtcbmNvbnN0IGZhbmN5TG9nID0gcmVxdWlyZSgnZmFuY3ktbG9nJyk7XG5cbmVudW0gTEVWRUwge1xuXHRJTkZPLFxuXHRXQVJOLFxuXHRERUJVRyxcblx0RkFUQUwsIEVSUk9SXG59XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xuXG5cdG5hbWU7XG5cdGxvZ2dlcjtcblx0dmVyc2lvbjtcblx0c2lsZW50O1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMubmFtZSA9IHBrZy5uYW1lO1xuXHRcdHRoaXMudmVyc2lvbiA9IHBrZy52ZXJzaW9uO1xuXHRcdHRoaXMubG9nZ2VyID0gZmFuY3lMb2c7XG5cdFx0dGhpcy5zaWxlbnQgPSBmYWxzZTtcbiAgfVxuICBcbiAgc2V0VmVyYm9zZShsZXZlbDogYm9vbGVhbikge1xuICAgIHRoaXMuc2lsZW50ID0gbGV2ZWw7XG4gIH1cblxuXHR0aXRsZSguLi5hcmdzKSB7XG4gICAgaWYodGhpcy5zaWxlbnQgPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMubG9nZ2VyKFxuICAgICAgICBjLmN5YW4oLi4uYXJncylcbiAgICAgICk7XG4gICAgfVxuXHR9XG5cblx0aW5mbyguLi5hcmdzKSB7XG4gICAgaWYodGhpcy5zaWxlbnQgPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMubG9nZ2VyKFxuICAgICAgICB0aGlzLmZvcm1hdChMRVZFTC5JTkZPLCAuLi5hcmdzKVxuICAgICAgKTtcbiAgICB9XG5cdH1cblxuXHR3YXJuKC4uLmFyZ3MpIHtcbiAgICBpZih0aGlzLnNpbGVudCA9PSBmYWxzZSkge1xuICAgICAgdGhpcy5sb2dnZXIoXG4gICAgICAgIHRoaXMuZm9ybWF0KExFVkVMLldBUk4sIC4uLmFyZ3MpXG4gICAgICApO1xuICAgIH1cblx0fVxuXG5cdGVycm9yKC4uLmFyZ3MpIHtcbiAgICBpZih0aGlzLnNpbGVudCA9PSBmYWxzZSkge1xuICAgICAgdGhpcy5sb2dnZXIoXG4gICAgICAgIHRoaXMuZm9ybWF0KExFVkVMLkZBVEFMLCAuLi5hcmdzKVxuICAgICAgKTtcbiAgICB9XG5cdH1cblxuXHRmYXRhbCguLi5hcmdzKSB7XG4gICAgaWYodGhpcy5zaWxlbnQgPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuZXJyb3IoLi4uYXJncyk7XG4gICAgfVxuICAgIFxuICB9XG5cdGRlYnVnKC4uLmFyZ3MpIHtcbiAgICBpZih0aGlzLnNpbGVudCA9PSBmYWxzZSkge1xuICAgICAgdGhpcy5sb2dnZXIoXG4gICAgICAgIHRoaXMuZm9ybWF0KExFVkVMLkRFQlVHLCAuLi5hcmdzKVxuICAgICAgKTtcbiAgICB9XG5cdH1cblxuXHR0cmFjZShlcnJvciwgZmlsZSkge1xuXHRcdHRoaXMuZmF0YWwoJ091Y2gnLCBmaWxlKTtcblx0XHR0aGlzLmZhdGFsKCcnLCBlcnJvcik7XG5cdFx0dGhpcy53YXJuKCdpZ25vcmluZycsIGZpbGUpO1xuXHRcdHRoaXMud2Fybignc2VlIGVycm9yJywgJycpO1xuXHRcdGNvbnNvbGUudHJhY2UoZXJyb3IpO1xuXHR9XG5cblx0cHJpdmF0ZSBmb3JtYXQobGV2ZWwsIC4uLmFyZ3MpIHtcblxuXHRcdGxldCBwYWQgPSAocywgbCwgYz0nJykgPT4ge1xuXHRcdFx0cmV0dXJuIHMgKyBBcnJheSggTWF0aC5tYXgoMCwgbCAtIHMubGVuZ3RoICsgMSkpLmpvaW4oIGMgKVxuXHRcdH07XG5cblx0XHRsZXQgbXNnID0gYXJncy5qb2luKCcgJyk7XG5cdFx0aWYoYXJncy5sZW5ndGggPiAxKSB7XG5cdFx0XHRtc2cgPSBgJHsgcGFkKGFyZ3Muc2hpZnQoKSwgMTMsICcgJykgfTogJHsgYXJncy5qb2luKCcgJykgfWA7XG5cdFx0fVxuXG5cblx0XHRzd2l0Y2gobGV2ZWwpIHtcblx0XHRcdGNhc2UgTEVWRUwuSU5GTzpcblx0XHRcdFx0bXNnID0gYy5ncmVlbihtc2cpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBMRVZFTC5XQVJOOlxuXHRcdFx0XHRtc2cgPSBjLnllbGxvdyhtc2cpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBMRVZFTC5ERUJVRzpcblx0XHRcdFx0bXNnID0gYy5ncmF5KG1zZyk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIExFVkVMLkVSUk9SOlxuXHRcdFx0Y2FzZSBMRVZFTC5GQVRBTDpcblx0XHRcdFx0bXNnID0gYy5yZWQobXNnKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFtcblx0XHRcdG1zZ1xuXHRcdF0uam9pbignJyk7XG5cdH1cbn1cblxuZXhwb3J0IGxldCBsb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG4iXX0=