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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24uZW5naW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9lbmdpbmVzL21hcmtkb3duLmVuZ2luZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUErQjtBQUMvQiwwQkFBNEI7QUFDNUIsMkJBQTZCO0FBRTdCLDZDQUF1QztBQUV2QztJQVNJO1FBQUEsaUJBc0NDO1FBOUNEOztXQUVHO1FBQ2Msa0JBQWEsR0FBRyxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVwRixtQkFBYyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUl2QyxJQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEQsUUFBUSxDQUFDLElBQUksR0FBRyxVQUFDLElBQUksRUFBRSxRQUFRO1lBQzNCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNYLFFBQVEsR0FBRyxNQUFNLENBQUM7YUFDckI7WUFFRCxXQUFXLEdBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxPQUFPLDZEQUF3RCxRQUFRLFdBQUssV0FBVyx3QkFBcUIsQ0FBQztRQUNqSCxDQUFDLENBQUM7UUFFRixRQUFRLENBQUMsS0FBSyxHQUFHLFVBQUMsTUFBTSxFQUFFLElBQUk7WUFDMUIsT0FBTyxDQUNILHVEQUF1RDtnQkFDdkQsV0FBVztnQkFDWCxNQUFNO2dCQUNOLFlBQVk7Z0JBQ1osV0FBVztnQkFDWCxJ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QUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBRG5ELENBQ21ELENBQzFELENBQUM7UUFFRixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVPLCtCQUFNLEdBQWQsVUFBZSxJQUFZO1FBQ3ZCLE9BQU8sSUFBSTthQUNOLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO2FBQ3RCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO2FBQ3JCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO2FBQ3JCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO2FBQ3ZCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO2FBQ3RCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVEOztPQUVHO0lBQ0ssbUNBQVUsR0FBbEIsVUFBbUIsS0FBb0I7UUFDbkMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBZCxDQUFjLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ0wscUJBQUM7QUFBRCxDQUFDLEFBbklELElBbUlDO0FBbklZLHdDQUFjO0FBcUkzQixrQkFBZSxjQUFjLENBQUMsV0FBVyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgRmlsZUVuZ2luZSBmcm9tICcuL2ZpbGUuZW5naW5lJztcblxuZXhwb3J0IGNsYXNzIE1hcmtkb3duRW5naW5lIHtcbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIG1hcmtkb3duIGZpbGVzIHdpdGhvdXQgLm1kIGV4dGVuc2lvblxuICAgICAqL1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbWFya2Rvd25GaWxlcyA9IFsnUkVBRE1FJywgJ0NIQU5HRUxPRycsICdMSUNFTlNFJywgJ0NPTlRSSUJVVElORycsICdUT0RPJ107XG5cbiAgICBwcml2YXRlIG1hcmtlZEluc3RhbmNlID0gcmVxdWlyZSgnbWFya2VkJyk7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogTWFya2Rvd25FbmdpbmU7XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgdGhpcy5tYXJrZWRJbnN0YW5jZS5SZW5kZXJlcigpO1xuICAgICAgICByZW5kZXJlci5jb2RlID0gKGNvZGUsIGxhbmd1YWdlKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGlnaGxpZ2h0ZWQgPSBjb2RlO1xuICAgICAgICAgICAgaWYgKCFsYW5ndWFnZSkge1xuICAgICAgICAgICAgICAgIGxhbmd1YWdlID0gJ25vbmUnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBoaWdobGlnaHRlZCA9IHRoaXMuZXNjYXBlKGNvZGUpO1xuICAgICAgICAgICAgcmV0dXJuIGA8ZGl2PjxwcmUgY2xhc3M9XCJsaW5lLW51bWJlcnNcIj48Y29kZSBjbGFzcz1cImxhbmd1YWdlLSR7bGFuZ3VhZ2V9XCI+JHtoaWdobGlnaHRlZH08L2NvZGU+PC9wcmU+PC9kaXY+YDtcbiAgICAgICAgfTtcblxuICAgICAgICByZW5kZXJlci50YWJsZSA9IChoZWFkZXIsIGJvZHkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgJzx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWJvcmRlcmVkIGNvbXBvZG9jLXRhYmxlXCI+XFxuJyArXG4gICAgICAgICAgICAgICAgJzx0aGVhZD5cXG4nICtcbiAgICAgICAgICAgICAgICBoZWFkZXIgK1xuICAgICAgICAgICAgICAgICc8L3RoZWFkPlxcbicgK1xuICAgICAgICAgICAgICAgICc8dGJvZHk+XFxuJyArXG4gICAgICAgICAgICAgICAgYm9keSArXG4gICAgICAgICAgICAgICAgJzwvdGJvZHk+XFxuJyArXG4gICAgICAgICAgICAgICAgJzwvdGFibGU+XFxuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZW5kZXJlci5pbWFnZSA9IGZ1bmN0aW9uKGhyZWY6IHN0cmluZywgdGl0bGU6IHN0cmluZywgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgICAgICBsZXQgb3V0ID0gJzxpbWcgc3JjPVwiJyArIGhyZWYgKyAnXCIgYWx0PVwiJyArIHRleHQgKyAnXCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiJztcbiAgICAgICAgICAgIGlmICh0aXRsZSkge1xuICAgICAgICAgICAgICAgIG91dCArPSAnIHRpdGxlPVwiJyArIHRpdGxlICsgJ1wiJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dCArPSAnPic7XG4gICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubWFya2VkSW5zdGFuY2Uuc2V0T3B0aW9ucyh7XG4gICAgICAgICAgICByZW5kZXJlcjogcmVuZGVyZXIsXG4gICAgICAgICAgICBicmVha3M6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgICAgICBpZiAoIU1hcmtkb3duRW5naW5lLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBNYXJrZG93bkVuZ2luZS5pbnN0YW5jZSA9IG5ldyBNYXJrZG93bkVuZ2luZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXJrZG93bkVuZ2luZS5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VHJhZGl0aW9uYWxNYXJrZG93bihmaWxlcGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIEZpbGVFbmdpbmUuZ2V0KHByb2Nlc3MuY3dkKCkgKyBwYXRoLnNlcCArIGZpbGVwYXRoICsgJy5tZCcpXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IEZpbGVFbmdpbmUuZ2V0KHByb2Nlc3MuY3dkKCkgKyBwYXRoLnNlcCArIGZpbGVwYXRoKS50aGVuKCkpXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHRoaXMubWFya2VkSW5zdGFuY2UoZGF0YSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRUcmFkaXRpb25hbE1hcmtkb3duU3luYyhmaWxlcGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFya2VkSW5zdGFuY2UoRmlsZUVuZ2luZS5nZXRTeW5jKHByb2Nlc3MuY3dkKCkgKyBwYXRoLnNlcCArIGZpbGVwYXRoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRSZWFkbWVGaWxlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBGaWxlRW5naW5lLmdldChwcm9jZXNzLmN3ZCgpICsgcGF0aC5zZXAgKyAnUkVBRE1FLm1kJykudGhlbihkYXRhID0+XG4gICAgICAgICAgICB0aGlzLm1hcmtlZEluc3RhbmNlKGRhdGEpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlYWROZWlnaGJvdXJSZWFkbWVGaWxlKGZpbGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCBkaXJuYW1lID0gcGF0aC5kaXJuYW1lKGZpbGUpO1xuICAgICAgICBsZXQgcmVhZG1lRmlsZSA9IGRpcm5hbWUgKyBwYXRoLnNlcCArIHBhdGguYmFzZW5hbWUoZmlsZSwgJy50cycpICsgJy5tZCc7XG4gICAgICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMocmVhZG1lRmlsZSwgJ3V0ZjgnKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaGFzTmVpZ2hib3VyUmVhZG1lRmlsZShmaWxlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGRpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZmlsZSk7XG4gICAgICAgIGxldCByZWFkbWVGaWxlID0gZGlybmFtZSArIHBhdGguc2VwICsgcGF0aC5iYXNlbmFtZShmaWxlLCAnLnRzJykgKyAnLm1kJztcbiAgICAgICAgcmV0dXJuIEZpbGVFbmdpbmUuZXhpc3RzU3luYyhyZWFkbWVGaWxlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbXBvbmVudFJlYWRtZUZpbGUoZmlsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGRpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZmlsZSk7XG4gICAgICAgIGxldCByZWFkbWVGaWxlID0gZGlybmFtZSArIHBhdGguc2VwICsgJ1JFQURNRS5tZCc7XG4gICAgICAgIGxldCByZWFkbWVBbHRlcm5hdGl2ZUZpbGUgPSBkaXJuYW1lICsgcGF0aC5zZXAgKyBwYXRoLmJhc2VuYW1lKGZpbGUsICcudHMnKSArICcubWQnO1xuICAgICAgICBsZXQgZmluYWxQYXRoID0gJyc7XG4gICAgICAgIGlmIChGaWxlRW5naW5lLmV4aXN0c1N5bmMocmVhZG1lRmlsZSkpIHtcbiAgICAgICAgICAgIGZpbmFsUGF0aCA9IHJlYWRtZUZpbGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaW5hbFBhdGggPSByZWFkbWVBbHRlcm5hdGl2ZUZpbGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbmFsUGF0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYW55IG9mIHRoZSBtYXJrZG93biBmaWxlcyBpcyBleGlzdHMgd2l0aCBvciB3aXRob3V0IGVuZGluZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFzUm9vdE1hcmtkb3ducygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkRW5kaW5ncyh0aGlzLm1hcmtkb3duRmlsZXMpLnNvbWUoeCA9PlxuICAgICAgICAgICAgRmlsZUVuZ2luZS5leGlzdHNTeW5jKHByb2Nlc3MuY3dkKCkgKyBwYXRoLnNlcCArIHgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIGxpc3RSb290TWFya2Rvd25zKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgbGV0IGZvdW5kRmlsZXMgPSB0aGlzLm1hcmtkb3duRmlsZXMuZmlsdGVyKFxuICAgICAgICAgICAgeCA9PlxuICAgICAgICAgICAgICAgIEZpbGVFbmdpbmUuZXhpc3RzU3luYyhwcm9jZXNzLmN3ZCgpICsgcGF0aC5zZXAgKyB4ICsgJy5tZCcpIHx8XG4gICAgICAgICAgICAgICAgRmlsZUVuZ2luZS5leGlzdHNTeW5jKHByb2Nlc3MuY3dkKCkgKyBwYXRoLnNlcCArIHgpXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkRW5kaW5ncyhmb3VuZEZpbGVzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGVzY2FwZShodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gaHRtbFxuICAgICAgICAgICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAgICAgICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAgICAgICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JylcbiAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csICcmIzM5OycpXG4gICAgICAgICAgICAucmVwbGFjZSgvQC9nLCAnJiM2NDsnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBbJ1JFQURNRSddID0+IFsnUkVBRE1FJywgJ1JFQURNRS5tZCddXG4gICAgICovXG4gICAgcHJpdmF0ZSBhZGRFbmRpbmdzKGZpbGVzOiBBcnJheTxzdHJpbmc+KTogQXJyYXk8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBfLmZsYXRNYXAoZmlsZXMsIHggPT4gW3gsIHggKyAnLm1kJ10pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFya2Rvd25FbmdpbmUuZ2V0SW5zdGFuY2UoKTtcbiJdfQ==