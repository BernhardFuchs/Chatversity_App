"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var _ = require("lodash");
var path = require("path");
var file_engine_1 = require("./file.engine");
var MarkdownEngine = /** @class */ (function () {
    function MarkdownEngine() {
        var _this = this;
        /**
         * List of markdown files without .md extension
         */
        this.markdownFiles = ['README', 'CHANGELOG', 'LICENSE', 'CONTRIBUTING', 'TODO'];
        this.markedInstance = require('marked');
        var renderer = new this.markedInstance.Renderer();
        renderer.code = function (code, language) {
            var highlighted = code;
            if (!language) {
                language = 'none';
            }
            highlighted = _this.escape(code);
            return "<div><pre class=\"line-numbers\"><code class=\"language-" + language + "\">" + highlighted + "</code></pre></div>";
        };
        renderer.table = function (header, body) {
            return ('<table class="table table-bordered compodoc-table">\n' +
                '<thead>\n' +
                header +
                '</thead>\n' +
                '<tbody>\n' +
                body +
                '</tbody>\n' +
                '</table>\n');
        };
        renderer.image = function (href, title, text) {
            var out = '<img src="' + href + '" alt="' + text + '" class="img-responsive"';
            if (title) {
                out += ' title="' + title + '"';
            }
            out += '>';
            return out;
        };
        this.markedInstance.setOptions({
            renderer: renderer,
            breaks: false
        });
    }
    MarkdownEngine.getInstance = function () {
        if (!MarkdownEngine.instance) {
            MarkdownEngine.instance = new MarkdownEngine();
        }
        return MarkdownEngine.instance;
    };
    MarkdownEngine.prototype.getTraditionalMarkdown = function (filepath) {
        var _this = this;
        return file_engine_1.default.get(process.cwd() + path.sep + filepath + '.md')
            .catch(function (err) { return file_engine_1.default.get(process.cwd() + path.sep + filepath).then(); })
            .then(function (data) { return _this.markedInstance(data); });
    };
    MarkdownEngine.prototype.getTraditionalMarkdownSync = function (filepath) {
        return this.markedInstance(file_engine_1.default.getSync(process.cwd() + path.sep + filepath));
    };
    MarkdownEngine.prototype.getReadmeFile = function () {
        var _this = this;
        return file_engine_1.default.get(process.cwd() + path.sep + 'README.md').then(function (data) {
            return _this.markedInstance(data);
        });
    };
    MarkdownEngine.prototype.readNeighbourReadmeFile = function (file) {
        var dirname = path.dirname(file);
        var readmeFile = dirname + path.sep + path.basename(file, '.ts') + '.md';
        return fs.readFileSync(readmeFile, 'utf8');
    };
    MarkdownEngine.prototype.hasNeighbourReadmeFile = function (file) {
        var dirname = path.dirname(file);
        var readmeFile = dirname + path.sep + path.basename(file, '.ts') + '.md';
        return file_engine_1.default.existsSync(readmeFile);
    };
    MarkdownEngine.prototype.componentReadmeFile = function (file) {
        var dirname = path.dirname(file);
        var readmeFile = dirname + path.sep + 'README.md';
        var readmeAlternativeFile = dirname + path.sep + path.basename(file, '.ts') + '.md';
        var finalPath = '';
        if (file_engine_1.default.existsSync(readmeFile)) {
            finalPath = readmeFile;
        }
        else {
            finalPath = readmeAlternativeFile;
        }
        return finalPath;
    };
    /**
     * Checks if any of the markdown files is exists with or without endings
     */
    MarkdownEngine.prototype.hasRootMarkdowns = function () {
        return this.addEndings(this.markdownFiles).some(function (x) {
            return file_engine_1.default.existsSync(process.cwd() + path.sep + x);
        });
    };
    MarkdownEngine.prototype.listRootMarkdowns = function () {
        var foundFiles = this.markdownFiles.filter(function (x) {
            return file_engine_1.default.existsSync(process.cwd() + path.sep + x + '.md') ||
                file_engine_1.default.existsSync(process.cwd() + path.sep + x);
        });
        return this.addEndings(foundFiles);
    };
    MarkdownEngine.prototype.escape = function (html) {
        return html
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/@/g, '&#64;');
    };
    /**
     * ['README'] => ['README', 'README.md']
     */
    MarkdownEngine.prototype.addEndings = function (files) {
        return _.flatMap(files, function (x) { return [x, x + '.md']; });
    };
    return MarkdownEngine;
}());
exports.MarkdownEngine = MarkdownEngine;
exports.default = MarkdownEngine.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24uZW5naW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9tYXJrZG93bi5lbmdpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBK0I7QUFDL0IsMEJBQTRCO0FBQzVCLDJCQUE2QjtBQUU3Qiw2Q0FBdUM7QUFFdkM7SUFTSTtRQUFBLGlCQXNDQztRQTlDRDs7V0FFRztRQUNjLGtCQUFhLEdBQUcsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFcEYsbUJBQWMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFJdkMsSUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BELFFBQVEsQ0FBQyxJQUFJLEdBQUcsVUFBQyxJQUFJLEVBQUUsUUFBUTtZQUMzQixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDWCxRQUFRLEdBQUcsTUFBTSxDQUFDO2FBQ3JCO1lBRUQsV0FBVyxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsT0FBTyw2REFBd0QsUUFBUSxXQUFLLFdBQVcsd0JBQXFCLENBQUM7UUFDakgsQ0FBQyxDQUFDO1FBRUYsUUFBUSxDQUFDLEtBQUssR0FBRyxVQUFDLE1BQU0sRUFBRSxJQUFJO1lBQzFCLE9BQU8sQ0FDSCx1REFBdUQ7Z0JBQ3ZELFdBQVc7Z0JBQ1gsTUFBTTtnQkFDTixZQUFZO2dCQUNaLFdBQVc7Z0JBQ1gsSUFBSTtnQkFDSixZQUFZO2dCQUNaLFlBQVksQ0FDZixDQUFDO1FB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RCxDQUNtRCxDQUMxRCxDQUFDO1FBRUYsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTywrQkFBTSxHQUFkLFVBQWUsSUFBWTtRQUN2QixPQUFPLElBQUk7YUFDTixPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQzthQUN0QixPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQzthQUNyQixPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQzthQUNyQixPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQzthQUN2QixPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQzthQUN0QixPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7T0FFRztJQUNLLG1DQUFVLEdBQWxCLFVBQW1CLEtBQW9CO1FBQ25DLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQWQsQ0FBYyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQyxBQW5JRCxJQW1JQztBQW5JWSx3Q0FBYztBQXFJM0Isa0JBQWUsY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IEZpbGVFbmdpbmUgZnJvbSAnLi9maWxlLmVuZ2luZSc7XG5cbmV4cG9ydCBjbGFzcyBNYXJrZG93bkVuZ2luZSB7XG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBtYXJrZG93biBmaWxlcyB3aXRob3V0IC5tZCBleHRlbnNpb25cbiAgICAgKi9cbiAgICBwcml2YXRlIHJlYWRvbmx5IG1hcmtkb3duRmlsZXMgPSBbJ1JFQURNRScsICdDSEFOR0VMT0cnLCAnTElDRU5TRScsICdDT05UUklCVVRJTkcnLCAnVE9ETyddO1xuXG4gICAgcHJpdmF0ZSBtYXJrZWRJbnN0YW5jZSA9IHJlcXVpcmUoJ21hcmtlZCcpO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IE1hcmtkb3duRW5naW5lO1xuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IHRoaXMubWFya2VkSW5zdGFuY2UuUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIuY29kZSA9IChjb2RlLCBsYW5ndWFnZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGhpZ2hsaWdodGVkID0gY29kZTtcbiAgICAgICAgICAgIGlmICghbGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgICAgICBsYW5ndWFnZSA9ICdub25lJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaGlnaGxpZ2h0ZWQgPSB0aGlzLmVzY2FwZShjb2RlKTtcbiAgICAgICAgICAgIHJldHVybiBgPGRpdj48cHJlIGNsYXNzPVwibGluZS1udW1iZXJzXCI+PGNvZGUgY2xhc3M9XCJsYW5ndWFnZS0ke2xhbmd1YWdlfVwiPiR7aGlnaGxpZ2h0ZWR9PC9jb2RlPjwvcHJlPjwvZGl2PmA7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVuZGVyZXIudGFibGUgPSAoaGVhZGVyLCBib2R5KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICc8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ib3JkZXJlZCBjb21wb2RvYy10YWJsZVwiPlxcbicgK1xuICAgICAgICAgICAgICAgICc8dGhlYWQ+XFxuJyArXG4gICAgICAgICAgICAgICAgaGVhZGVyICtcbiAgICAgICAgICAgICAgICAnPC90aGVhZD5cXG4nICtcbiAgICAgICAgICAgICAgICAnPHRib2R5PlxcbicgK1xuICAgICAgICAgICAgICAgIGJvZHkgK1xuICAgICAgICAgICAgICAgICc8L3Rib2R5PlxcbicgK1xuICAgICAgICAgICAgICAgICc8L3RhYmxlPlxcbidcbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVuZGVyZXIuaW1hZ2UgPSBmdW5jdGlvbihocmVmOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIHRleHQ6IHN0cmluZykge1xuICAgICAgICAgICAgbGV0IG91dCA9ICc8aW1nIHNyYz1cIicgKyBocmVmICsgJ1wiIGFsdD1cIicgKyB0ZXh0ICsgJ1wiIGNsYXNzPVwiaW1nLXJlc3BvbnNpdmVcIic7XG4gICAgICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgICAgICAgICBvdXQgKz0gJyB0aXRsZT1cIicgKyB0aXRsZSArICdcIic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQgKz0gJz4nO1xuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLm1hcmtlZEluc3RhbmNlLnNldE9wdGlvbnMoe1xuICAgICAgICAgICAgcmVuZGVyZXI6IHJlbmRlcmVyLFxuICAgICAgICAgICAgYnJlYWtzOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKCFNYXJrZG93bkVuZ2luZS5pbnN0YW5jZSkge1xuICAgICAgICAgICAgTWFya2Rvd25FbmdpbmUuaW5zdGFuY2UgPSBuZXcgTWFya2Rvd25FbmdpbmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWFya2Rvd25FbmdpbmUuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFRyYWRpdGlvbmFsTWFya2Rvd24oZmlsZXBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBGaWxlRW5naW5lLmdldChwcm9jZXNzLmN3ZCgpICsgcGF0aC5zZXAgKyBmaWxlcGF0aCArICcubWQnKVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiBGaWxlRW5naW5lLmdldChwcm9jZXNzLmN3ZCgpICsgcGF0aC5zZXAgKyBmaWxlcGF0aCkudGhlbigpKVxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB0aGlzLm1hcmtlZEluc3RhbmNlKGRhdGEpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VHJhZGl0aW9uYWxNYXJrZG93blN5bmMoZmlsZXBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcmtlZEluc3RhbmNlKEZpbGVFbmdpbmUuZ2V0U3luYyhwcm9jZXNzLmN3ZCgpICsgcGF0aC5zZXAgKyBmaWxlcGF0aCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UmVhZG1lRmlsZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gRmlsZUVuZ2luZS5nZXQocHJvY2Vzcy5jd2QoKSArIHBhdGguc2VwICsgJ1JFQURNRS5tZCcpLnRoZW4oZGF0YSA9PlxuICAgICAgICAgICAgdGhpcy5tYXJrZWRJbnN0YW5jZShkYXRhKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWFkTmVpZ2hib3VyUmVhZG1lRmlsZShmaWxlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBsZXQgZGlybmFtZSA9IHBhdGguZGlybmFtZShmaWxlKTtcbiAgICAgICAgbGV0IHJlYWRtZUZpbGUgPSBkaXJuYW1lICsgcGF0aC5zZXAgKyBwYXRoLmJhc2VuYW1lKGZpbGUsICcudHMnKSArICcubWQnO1xuICAgICAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKHJlYWRtZUZpbGUsICd1dGY4Jyk7XG4gICAgfVxuXG4gICAgcHVibGljIGhhc05laWdoYm91clJlYWRtZUZpbGUoZmlsZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBkaXJuYW1lID0gcGF0aC5kaXJuYW1lKGZpbGUpO1xuICAgICAgICBsZXQgcmVhZG1lRmlsZSA9IGRpcm5hbWUgKyBwYXRoLnNlcCArIHBhdGguYmFzZW5hbWUoZmlsZSwgJy50cycpICsgJy5tZCc7XG4gICAgICAgIHJldHVybiBGaWxlRW5naW5lLmV4aXN0c1N5bmMocmVhZG1lRmlsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb21wb25lbnRSZWFkbWVGaWxlKGZpbGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCBkaXJuYW1lID0gcGF0aC5kaXJuYW1lKGZpbGUpO1xuICAgICAgICBsZXQgcmVhZG1lRmlsZSA9IGRpcm5hbWUgKyBwYXRoLnNlcCArICdSRUFETUUubWQnO1xuICAgICAgICBsZXQgcmVhZG1lQWx0ZXJuYXRpdmVGaWxlID0gZGlybmFtZSArIHBhdGguc2VwICsgcGF0aC5iYXNlbmFtZShmaWxlLCAnLnRzJykgKyAnLm1kJztcbiAgICAgICAgbGV0IGZpbmFsUGF0aCA9ICcnO1xuICAgICAgICBpZiAoRmlsZUVuZ2luZS5leGlzdHNTeW5jKHJlYWRtZUZpbGUpKSB7XG4gICAgICAgICAgICBmaW5hbFBhdGggPSByZWFkbWVGaWxlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmluYWxQYXRoID0gcmVhZG1lQWx0ZXJuYXRpdmVGaWxlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaW5hbFBhdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGFueSBvZiB0aGUgbWFya2Rvd24gZmlsZXMgaXMgZXhpc3RzIHdpdGggb3Igd2l0aG91dCBlbmRpbmdzXG4gICAgICovXG4gICAgcHVibGljIGhhc1Jvb3RNYXJrZG93bnMoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZEVuZGluZ3ModGhpcy5tYXJrZG93bkZpbGVzKS5zb21lKHggPT5cbiAgICAgICAgICAgIEZpbGVFbmdpbmUuZXhpc3RzU3luYyhwcm9jZXNzLmN3ZCgpICsgcGF0aC5zZXAgKyB4KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBsaXN0Um9vdE1hcmtkb3ducygpOiBzdHJpbmdbXSB7XG4gICAgICAgIGxldCBmb3VuZEZpbGVzID0gdGhpcy5tYXJrZG93bkZpbGVzLmZpbHRlcihcbiAgICAgICAgICAgIHggPT5cbiAgICAgICAgICAgICAgICBGaWxlRW5naW5lLmV4aXN0c1N5bmMocHJvY2Vzcy5jd2QoKSArIHBhdGguc2VwICsgeCArICcubWQnKSB8fFxuICAgICAgICAgICAgICAgIEZpbGVFbmdpbmUuZXhpc3RzU3luYyhwcm9jZXNzLmN3ZCgpICsgcGF0aC5zZXAgKyB4KVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFkZEVuZGluZ3MoZm91bmRGaWxlcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlc2NhcGUoaHRtbDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGh0bWxcbiAgICAgICAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAgICAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgICAgICAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXG4gICAgICAgICAgICAucmVwbGFjZSgvJy9nLCAnJiMzOTsnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL0AvZywgJyYjNjQ7Jyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogWydSRUFETUUnXSA9PiBbJ1JFQURNRScsICdSRUFETUUubWQnXVxuICAgICAqL1xuICAgIHByaXZhdGUgYWRkRW5kaW5ncyhmaWxlczogQXJyYXk8c3RyaW5nPik6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gXy5mbGF0TWFwKGZpbGVzLCB4ID0+IFt4LCB4ICsgJy5tZCddKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcmtkb3duRW5naW5lLmdldEluc3RhbmNlKCk7XG4iXX0=