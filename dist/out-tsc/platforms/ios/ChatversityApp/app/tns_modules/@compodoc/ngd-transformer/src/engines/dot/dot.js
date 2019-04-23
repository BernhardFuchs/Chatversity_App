"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var ngd_core_1 = require("@compodoc/ngd-core");
var dot_template_1 = require("./dot.template");
var fs = require('fs-extra');
var Viz = require('viz.js');
var cleanDot = false;
var cleanSvg = false;
var appName = require('../../../package.json').name;
// http://www.graphviz.org/Documentation/dotguide.pdf
var DotEngine = /** @class */ (function () {
    function DotEngine(options) {
        // http://www.graphviz.org/doc/info/shapes.html
        this.template = dot_template_1.DOT_TEMPLATE;
        this.cwd = process.cwd();
        this.files = {
            component: null
        };
        this.paths = {
            dot: null,
            json: null,
            png: null,
            svg: null,
            html: null
        };
        this.options = {};
        var baseDir = "./" + appName + "/";
        this.options = {
            name: "" + appName,
            output: options.output,
            displayLegend: options.displayLegend,
            outputFormats: options.outputFormats,
            dot: {
                shapeModules: 'component',
                shapeProviders: 'ellipse',
                shapeDirectives: 'cds',
                //http://www.graphviz.org/doc/info/colors.html
                colorScheme: 'set312'
            }
        };
        if (options.output) {
            if (typeof this.options.output !== 'string') {
                ngd_core_1.logger.fatal('Option "output" has been provided but it is not a valid name.');
                process.exit(1);
            }
        }
        this.paths = {
            dot: path.join(this.options.output, '/dependencies.dot'),
            json: path.join(this.options.output, '/dependencies.json'),
            svg: path.join(this.options.output, '/dependencies.svg'),
            png: path.join(this.options.output, '/dependencies.png'),
            html: path.join(this.options.output, '/dependencies.html')
        };
        if (typeof options.silent !== 'undefined') {
            ngd_core_1.logger.silent = options.silent;
        }
    }
    DotEngine.prototype.updateOutput = function (output) {
        this.paths = {
            dot: path.join(output, '/dependencies.dot'),
            json: path.join(output, '/dependencies.json'),
            svg: path.join(output, '/dependencies.svg'),
            png: path.join(output, '/dependencies.png'),
            html: path.join(output, '/dependencies.html')
        };
    };
    DotEngine.prototype.generateGraph = function (deps) {
        var _this = this;
        var template = this.preprocessTemplates(this.options);
        var generators = [];
        // Handle svg dependency with dot, and html with svg
        if (this.options.outputFormats.indexOf('dot') > -1 && this.options.outputFormats.indexOf('svg') === -1 && this.options.outputFormats.indexOf('html') === -1) {
            generators.push(this.generateDot(template, deps));
        }
        if (this.options.outputFormats.indexOf('svg') > -1 && this.options.outputFormats.indexOf('html') === -1) {
            generators.push(this.generateDot(template, deps).then(function (_) { return _this.generateSVG(); }));
            if (this.options.outputFormats.indexOf('svg') > -1 && this.options.outputFormats.indexOf('dot') === -1) {
                cleanDot = true;
            }
        }
        if (this.options.outputFormats.indexOf('json') > -1) {
            generators.push(this.generateJSON(deps));
        }
        if (this.options.outputFormats.indexOf('html') > -1) {
            generators.push(this.generateDot(template, deps).then(function (_) { return _this.generateSVG(); }).then(function (_) { return _this.generateHTML(); }));
            if (this.options.outputFormats.indexOf('html') > -1 && this.options.outputFormats.indexOf('svg') === -1) {
                cleanSvg = true;
            }
            if (this.options.outputFormats.indexOf('html') > -1 && this.options.outputFormats.indexOf('dot') === -1) {
                cleanDot = true;
            }
        }
        // todo(WCH): disable PNG creation due to some errors with phantomjs
        /*
         if (this.options.outputFormats.indexOf('png') > -1) {
         generators.push(this.generatePNG());
         }
         */
        return Promise.all(generators).then(function (_) { return _this.cleanGeneratedFiles(); });
    };
    DotEngine.prototype.cleanGeneratedFiles = function () {
        var removeFile = function (path) {
            return new Promise(function (resolve, reject) {
                fs.unlink(path, function (error) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                });
            });
        };
        var cleaners = [];
        if (cleanDot) {
            cleaners.push(removeFile(this.paths.dot));
        }
        if (cleanSvg) {
            cleaners.push(removeFile(this.paths.svg));
        }
        return Promise.all(cleaners);
    };
    DotEngine.prototype.preprocessTemplates = function (options) {
        var doT = require('dot');
        var result;
        if (options.displayLegend === 'true' || options.displayLegend === true) {
            result = this.template.replace(/###legend###/g, dot_template_1.LEGEND);
        }
        else {
            result = this.template.replace(/###legend###/g, '""');
        }
        return doT.template(result.replace(/###scheme###/g, options.dot.colorScheme));
    };
    DotEngine.prototype.generateJSON = function (deps) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.outputFile(_this.paths.json, JSON.stringify(deps, null, 2), function (error) {
                if (error) {
                    reject(error);
                }
                ngd_core_1.logger.info('creating JSON', _this.paths.json);
                resolve(_this.paths.json);
            });
        });
    };
    // @not-used
    DotEngine.prototype.escape = function (deps) {
        var _this = this;
        return deps.map(function (d) {
            for (var prop in d) {
                if (d.hasOwnProperty(prop)) {
                    var a = d[prop];
                    console.log(a);
                    if (Array.isArray(a)) {
                        return _this.escape(a);
                    }
                    else if (typeof a === 'string') {
                        a = a.replace(/"/g, '\"');
                        a = a.replace(/'/g, "\'");
                        a = a.replace(/\{/g, "\{");
                        a = a.replace(/\)/g, "\)");
                    }
                }
            }
            return d;
        });
    };
    DotEngine.prototype.generateDot = function (template, deps) {
        // todo(wch)
        //deps = this.escape(deps);
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.outputFile(_this.paths.dot, template({
                modules: deps
            }), function (error) {
                if (error) {
                    reject(error);
                }
                if (cleanDot === false) {
                    ngd_core_1.logger.info('creating DOT', _this.paths.dot);
                }
                resolve(_this.paths.dot);
            });
        });
    };
    DotEngine.prototype.generateSVG = function () {
        var _this = this;
        var vizSvg = Viz(fs.readFileSync(this.paths.dot).toString(), {
            format: 'svg',
            engine: 'dot'
        }, { totalMemory: 32 * 1024 * 1024 });
        return new Promise(function (resolve, reject) {
            fs.outputFile(_this.paths.svg, vizSvg, function (error) {
                if (error) {
                    reject(error);
                }
                if (cleanSvg === false) {
                    ngd_core_1.logger.info('creating SVG', _this.paths.svg);
                }
                resolve(_this.paths.svg);
            });
        });
    };
    DotEngine.prototype.generateHTML = function () {
        var _this = this;
        var svgContent = fs.readFileSync(this.paths.svg).toString();
        var cssContent = "\n\t\t\t<style>\n\t\t\t\t.edge {\n\t\t\t\t\ttransition: opacity 0.5s;\n\t\t\t\t\topacity:0.2;\n\t\t\t\t}\n\t\t\t\t.node {\n\t\t\t\t\ttransition: transform 0.1s;\n\t\t\t\t\ttransform-origin: center center;\n\t\t\t\t}\n\t\t\t\t.node:hover {\n\t\t\t\t\ttransform: scale(1.03);\n\t\t\t\t}\n\t\t\t\t.node:hover + .edge {\n\t\t\t\t\topacity:1;\n\t\t\t\t}\n\t\t\t</style>";
        var htmlContent = "\n\t\t\t\t" + svgContent + "\n\t\t\t";
        return new Promise(function (resolve, reject) {
            fs.outputFile(_this.paths.html, htmlContent, function (error) {
                if (error) {
                    reject(error);
                }
                ngd_core_1.logger.info('creating HTML', _this.paths.html);
                resolve(_this.paths.html);
            });
        });
    };
    DotEngine.prototype.generatePNG = function () {
        var _this = this;
        var svgToPng = require('svg-to-png');
        return new Promise(function (resolve, reject) {
            svgToPng.convert(_this.paths.svg, _this.paths.png).then(function () {
                ngd_core_1.logger.info('creating PNG', this.paths.png);
                resolve(this.paths.image);
            });
        });
    };
    return DotEngine;
}());
exports.DotEngine = DotEngine;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL25nZC10cmFuc2Zvcm1lci9zcmMvZW5naW5lcy9kb3QvZG90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQTZCO0FBQzdCLCtDQUE0QztBQUM1QywrQ0FBc0Q7QUFnQnRELElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3QixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUIsSUFBSSxRQUFRLEdBQVksS0FBSyxDQUFDO0FBQzlCLElBQUksUUFBUSxHQUFZLEtBQUssQ0FBQztBQUU5QixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFFcEQscURBQXFEO0FBQ3JEO0lBcUJFLG1CQUFZLE9BQWlCO1FBbkI3QiwrQ0FBK0M7UUFDL0MsYUFBUSxHQUFHLDJCQUFZLENBQUM7UUFFeEIsUUFBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVwQixVQUFLLEdBQUc7WUFDTixTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFDO1FBRUYsVUFBSyxHQUFHO1lBQ04sR0FBRyxFQUFFLElBQUk7WUFDVCxJQUFJLEVBQUUsSUFBSTtZQUNWLEdBQUcsRUFBRSxJQUFJO1lBQ1QsR0FBRyxFQUFFLElBQUk7WUFDVCxJQUFJLEVBQUUsSUFBSTtTQUNYLENBQUM7UUFFRixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBSXJCLElBQUksT0FBTyxHQUFHLE9BQUssT0FBTyxNQUFHLENBQUM7UUFFOUIsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNiLElBQUksRUFBRSxLQUFHLE9BQVM7WUFDbEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxN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LEtBQUssQ0FBQyxHQUFHLEVBQ2QsS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQ2YsQ0FBQyxJQUFJLENBQUM7Z0JBQ0wsaUJBQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzVDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUgsZ0JBQUM7QUFBRCxDQUFDLEFBaFNELElBZ1NDO0FBaFNZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0Bjb21wb2RvYy9uZ2QtY29yZSc7XG5pbXBvcnQgeyBET1RfVEVNUExBVEUsIExFR0VORCB9IGZyb20gJy4vZG90LnRlbXBsYXRlJztcblxuZXhwb3J0IGludGVyZmFjZSBJT3B0aW9ucyB7XG5cdG5hbWU/OiBzdHJpbmc7XG5cdG91dHB1dD86IHN0cmluZztcblx0ZGlzcGxheUxlZ2VuZD86IGJvb2xlYW47XG5cdG91dHB1dEZvcm1hdHM/OiBzdHJpbmc7XG4gICAgc2lsZW50PzogYm9vbGVhbjtcblx0ZG90Pzoge1xuXHRcdHNoYXBlTW9kdWxlczogc3RyaW5nXG5cdFx0c2hhcGVQcm92aWRlcnM6IHN0cmluZ1xuXHRcdHNoYXBlRGlyZWN0aXZlczogc3RyaW5nXG5cdFx0Y29sb3JTY2hlbWU6IHN0cmluZ1xuXHR9O1xufVxuXG5sZXQgZnMgPSByZXF1aXJlKCdmcy1leHRyYScpO1xubGV0IFZpeiA9IHJlcXVpcmUoJ3Zpei5qcycpO1xubGV0IGNsZWFuRG90OiBib29sZWFuID0gZmFsc2U7XG5sZXQgY2xlYW5Tdmc6IGJvb2xlYW4gPSBmYWxzZTtcblxubGV0IGFwcE5hbWUgPSByZXF1aXJlKCcuLi8uLi8uLi9wYWNrYWdlLmpzb24nKS5uYW1lO1xuXG4vLyBodHRwOi8vd3d3LmdyYXBodml6Lm9yZy9Eb2N1bWVudGF0aW9uL2RvdGd1aWRlLnBkZlxuZXhwb3J0IGNsYXNzIERvdEVuZ2luZSB7XG5cbiAgLy8gaHR0cDovL3d3dy5ncmFwaHZpei5vcmcvZG9jL2luZm8vc2hhcGVzLmh0bWxcbiAgdGVtcGxhdGUgPSBET1RfVEVNUExBVEU7XG5cbiAgY3dkID0gcHJvY2Vzcy5jd2QoKTtcblxuICBmaWxlcyA9IHtcbiAgICBjb21wb25lbnQ6IG51bGxcbiAgfTtcblxuICBwYXRocyA9IHtcbiAgICBkb3Q6IG51bGwsXG4gICAganNvbjogbnVsbCxcbiAgICBwbmc6IG51bGwsXG4gICAgc3ZnOiBudWxsLFxuICAgIGh0bWw6IG51bGxcbiAgfTtcblxuICBvcHRpb25zOiBJT3B0aW9ucyA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IElPcHRpb25zKSB7XG5cbiAgICBsZXQgYmFzZURpciA9IGAuLyR7YXBwTmFtZX0vYDtcblxuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIG5hbWU6IGAke2FwcE5hbWV9YCxcbiAgICAgIG91dHB1dDogb3B0aW9ucy5vdXRwdXQsXG4gICAgICBkaXNwbGF5TGVnZW5kOiBvcHRpb25zLmRpc3BsYXlMZWdlbmQsXG4gICAgICBvdXRwdXRGb3JtYXRzOiBvcHRpb25zLm91dHB1dEZvcm1hdHMsXG4gICAgICBkb3Q6IHtcbiAgICAgICAgc2hhcGVNb2R1bGVzOiAnY29tcG9uZW50JyxcbiAgICAgICAgc2hhcGVQcm92aWRlcnM6ICdlbGxpcHNlJyxcbiAgICAgICAgc2hhcGVEaXJlY3RpdmVzOiAnY2RzJyxcblxuICAgICAgICAvL2h0dHA6Ly93d3cuZ3JhcGh2aXoub3JnL2RvYy9pbmZvL2NvbG9ycy5odG1sXG4gICAgICAgIGNvbG9yU2NoZW1lOiAnc2V0MzEyJ1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAob3B0aW9ucy5vdXRwdXQpIHtcblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub3V0cHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICBsb2dnZXIuZmF0YWwoJ09wdGlvbiBcIm91dHB1dFwiIGhhcyBiZWVuIHByb3ZpZGVkIGJ1dCBpdCBpcyBub3QgYSB2YWxpZCBuYW1lLicpO1xuICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wYXRocyA9IHtcbiAgICAgIGRvdDogcGF0aC5qb2luKHRoaXMub3B0aW9ucy5vdXRwdXQsICcvZGVwZW5kZW5jaWVzLmRvdCcpLFxuICAgICAganNvbjogcGF0aC5qb2luKHRoaXMub3B0aW9ucy5vdXRwdXQsICcvZGVwZW5kZW5jaWVzLmpzb24nKSxcbiAgICAgIHN2ZzogcGF0aC5qb2luKHRoaXMub3B0aW9ucy5vdXRwdXQsICcvZGVwZW5kZW5jaWVzLnN2ZycpLFxuICAgICAgcG5nOiBwYXRoLmpvaW4odGhpcy5vcHRpb25zLm91dHB1dCwgJy9kZXBlbmRlbmNpZXMucG5nJyksXG4gICAgICBodG1sOiBwYXRoLmpvaW4odGhpcy5vcHRpb25zLm91dHB1dCwgJy9kZXBlbmRlbmNpZXMuaHRtbCcpXG4gICAgfTtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5zaWxlbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxvZ2dlci5zaWxlbnQgPSBvcHRpb25zLnNpbGVudDtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVPdXRwdXQob3V0cHV0OiBzdHJpbmcpIHtcbiAgICAgIHRoaXMucGF0aHMgPSB7XG4gICAgICAgIGRvdDogcGF0aC5qb2luKG91dHB1dCwgJy9kZXBlbmRlbmNpZXMuZG90JyksXG4gICAgICAgIGpzb246IHBhdGguam9pbihvdXRwdXQsICcvZGVwZW5kZW5jaWVzLmpzb24nKSxcbiAgICAgICAgc3ZnOiBwYXRoLmpvaW4ob3V0cHV0LCAnL2RlcGVuZGVuY2llcy5zdmcnKSxcbiAgICAgICAgcG5nOiBwYXRoLmpvaW4ob3V0cHV0LCAnL2RlcGVuZGVuY2llcy5wbmcnKSxcbiAgICAgICAgaHRtbDogcGF0aC5qb2luKG91dHB1dCwgJy9kZXBlbmRlbmNpZXMuaHRtbCcpXG4gICAgICB9O1xuICB9XG5cbiAgZ2VuZXJhdGVHcmFwaChkZXBzKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gdGhpcy5wcmVwcm9jZXNzVGVtcGxhdGVzKHRoaXMub3B0aW9ucyk7XG4gICAgbGV0IGdlbmVyYXRvcnMgPSBbXTtcblxuICAgIC8vIEhhbmRsZSBzdmcgZGVwZW5kZW5jeSB3aXRoIGRvdCwgYW5kIGh0bWwgd2l0aCBzdmdcbiAgICBpZiAodGhpcy5vcHRpb25zLm91dHB1dEZvcm1hdHMuaW5kZXhPZignZG90JykgPiAtMSAmJiB0aGlzLm9wdGlvbnMub3V0cHV0Rm9ybWF0cy5pbmRleE9mKCdzdmcnKSA9PT0gLTEgJiYgdGhpcy5vcHRpb25zLm91dHB1dEZvcm1hdHMuaW5kZXhPZignaHRtbCcpID09PSAtMSkge1xuICAgICAgZ2VuZXJhdG9ycy5wdXNoKHRoaXMuZ2VuZXJhdGVEb3QodGVtcGxhdGUsIGRlcHMpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm91dHB1dEZvcm1hdHMuaW5kZXhPZignc3ZnJykgPiAtMSAmJiB0aGlzLm9wdGlvbnMub3V0cHV0Rm9ybWF0cy5pbmRleE9mKCdodG1sJykgPT09IC0xKSB7XG4gICAgICBnZW5lcmF0b3JzLnB1c2godGhpcy5nZW5lcmF0ZURvdCh0ZW1wbGF0ZSwgZGVwcykudGhlbihfID0+IHRoaXMuZ2VuZXJhdGVTVkcoKSkpO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5vdXRwdXRGb3JtYXRzLmluZGV4T2YoJ3N2ZycpID4gLTEgJiYgdGhpcy5vcHRpb25zLm91dHB1dEZvcm1hdHMuaW5kZXhPZignZG90JykgPT09IC0xKSB7XG4gICAgICAgIGNsZWFuRG90ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm91dHB1dEZvcm1hdHMuaW5kZXhPZignanNvbicpID4gLTEpIHtcbiAgICAgIGdlbmVyYXRvcnMucHVzaCh0aGlzLmdlbmVyYXRlSlNPTihkZXBzKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5vdXRwdXRGb3JtYXRzLmluZGV4T2YoJ2h0bWwnKSA+IC0xKSB7XG4gICAgICBnZW5lcmF0b3JzLnB1c2godGhpcy5nZW5lcmF0ZURvdCh0ZW1wbGF0ZSwgZGVwcykudGhlbihfID0+IHRoaXMuZ2VuZXJhdGVTVkcoKSkudGhlbihfID0+IHRoaXMuZ2VuZXJhdGVIVE1MKCkpKTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMub3V0cHV0Rm9ybWF0cy5pbmRleE9mKCdodG1sJykgPiAtMSAmJiB0aGlzLm9wdGlvbnMub3V0cHV0Rm9ybWF0cy5pbmRleE9mKCdzdmcnKSA9PT0gLTEpIHtcbiAgICAgICAgY2xlYW5TdmcgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5vdXRwdXRGb3JtYXRzLmluZGV4T2YoJ2h0bWwnKSA+IC0xICYmIHRoaXMub3B0aW9ucy5vdXRwdXRGb3JtYXRzLmluZGV4T2YoJ2RvdCcpID09PSAtMSkge1xuICAgICAgICBjbGVhbkRvdCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8vIHRvZG8oV0NIKTogZGlzYWJsZSBQTkcgY3JlYXRpb24gZHVlIHRvIHNvbWUgZXJyb3JzIHdpdGggcGhhbnRvbWpzXG4gICAgLypcbiAgICAgaWYgKHRoaXMub3B0aW9ucy5vdXRwdXRGb3JtYXRzLmluZGV4T2YoJ3BuZycpID4gLTEpIHtcbiAgICAgZ2VuZXJhdG9ycy5wdXNoKHRoaXMuZ2VuZXJhdGVQTkcoKSk7XG4gICAgIH1cbiAgICAgKi9cblxuICAgIHJldHVybiBQcm9taXNlLmFsbChnZW5lcmF0b3JzKS50aGVuKF8gPT4gdGhpcy5jbGVhbkdlbmVyYXRlZEZpbGVzKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhbkdlbmVyYXRlZEZpbGVzKCkge1xuICAgIGxldCByZW1vdmVGaWxlID0gKHBhdGgpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZzLnVubGluayhwYXRoLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGxldCBjbGVhbmVycyA9IFtdO1xuICAgIGlmIChjbGVhbkRvdCkge1xuICAgICAgY2xlYW5lcnMucHVzaChyZW1vdmVGaWxlKHRoaXMucGF0aHMuZG90KSk7XG4gICAgfVxuICAgIGlmIChjbGVhblN2Zykge1xuICAgICAgY2xlYW5lcnMucHVzaChyZW1vdmVGaWxlKHRoaXMucGF0aHMuc3ZnKSk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLmFsbChjbGVhbmVycyk7XG4gIH1cblxuICBwcml2YXRlIHByZXByb2Nlc3NUZW1wbGF0ZXMob3B0aW9ucz8pIHtcbiAgICBsZXQgZG9UID0gcmVxdWlyZSgnZG90Jyk7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAob3B0aW9ucy5kaXNwbGF5TGVnZW5kID09PSAndHJ1ZScgfHwgb3B0aW9ucy5kaXNwbGF5TGVnZW5kID09PSB0cnVlKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnRlbXBsYXRlLnJlcGxhY2UoLyMjI2xlZ2VuZCMjIy9nLCBMRUdFTkQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnRlbXBsYXRlLnJlcGxhY2UoLyMjI2xlZ2VuZCMjIy9nLCAnXCJcIicpO1xuICAgIH1cbiAgICByZXR1cm4gZG9ULnRlbXBsYXRlKHJlc3VsdC5yZXBsYWNlKC8jIyNzY2hlbWUjIyMvZywgb3B0aW9ucy5kb3QuY29sb3JTY2hlbWUpKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVKU09OKGRlcHMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBmcy5vdXRwdXRGaWxlKFxuICAgICAgICAgIHRoaXMucGF0aHMuanNvbixcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeShkZXBzLCBudWxsLCAyKSxcbiAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ2NyZWF0aW5nIEpTT04nLCB0aGlzLnBhdGhzLmpzb24pO1xuICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnBhdGhzLmpzb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEBub3QtdXNlZFxuICBwcml2YXRlIGVzY2FwZShkZXBzKSB7XG4gICAgcmV0dXJuIGRlcHMubWFwKGQgPT4ge1xuICAgICAgZm9yIChsZXQgcHJvcCBpbiBkKSB7XG4gICAgICAgIGlmIChkLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgbGV0IGEgPSBkW3Byb3BdO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGEpO1xuXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVzY2FwZShhKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBhID0gYS5yZXBsYWNlKC9cIi9nLCAnXFxcIicpO1xuICAgICAgICAgICAgYSA9IGEucmVwbGFjZSgvJy9nLCBcIlxcJ1wiKTtcbiAgICAgICAgICAgIGEgPSBhLnJlcGxhY2UoL1xcey9nLCBcIlxce1wiKTtcbiAgICAgICAgICAgIGEgPSBhLnJlcGxhY2UoL1xcKS9nLCBcIlxcKVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGQ7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlRG90KHRlbXBsYXRlLCBkZXBzKSB7XG5cbiAgICAvLyB0b2RvKHdjaClcbiAgICAvL2RlcHMgPSB0aGlzLmVzY2FwZShkZXBzKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZzLm91dHB1dEZpbGUoXG4gICAgICAgICAgdGhpcy5wYXRocy5kb3QsXG4gICAgICAgICAgdGVtcGxhdGUoe1xuICAgICAgICAgICAgbW9kdWxlczogZGVwc1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjbGVhbkRvdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ2NyZWF0aW5nIERPVCcsIHRoaXMucGF0aHMuZG90KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnBhdGhzLmRvdCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZVNWRygpIHtcbiAgICBsZXQgdml6U3ZnID0gVml6KFxuICAgICAgZnMucmVhZEZpbGVTeW5jKHRoaXMucGF0aHMuZG90KS50b1N0cmluZygpLCB7XG4gICAgICAgIGZvcm1hdDogJ3N2ZycsXG4gICAgICAgIGVuZ2luZTogJ2RvdCdcbiAgICAgIH0sIHsgdG90YWxNZW1vcnk6IDMyICogMTAyNCAqIDEwMjQgfSk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBmcy5vdXRwdXRGaWxlKFxuICAgICAgICAgIHRoaXMucGF0aHMuc3ZnLFxuICAgICAgICAgIHZpelN2ZyxcbiAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2xlYW5TdmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdjcmVhdGluZyBTVkcnLCB0aGlzLnBhdGhzLnN2Zyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc29sdmUodGhpcy5wYXRocy5zdmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVIVE1MKCkge1xuICAgIGxldCBzdmdDb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKHRoaXMucGF0aHMuc3ZnKS50b1N0cmluZygpO1xuICAgIGxldCBjc3NDb250ZW50ID0gYFxuXHRcdFx0PHN0eWxlPlxuXHRcdFx0XHQuZWRnZSB7XG5cdFx0XHRcdFx0dHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzO1xuXHRcdFx0XHRcdG9wYWNpdHk6MC4yO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC5ub2RlIHtcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4xcztcblx0XHRcdFx0XHR0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXIgY2VudGVyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC5ub2RlOmhvdmVyIHtcblx0XHRcdFx0XHR0cmFuc2Zvcm06IHNjYWxlKDEuMDMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC5ub2RlOmhvdmVyICsgLmVkZ2Uge1xuXHRcdFx0XHRcdG9wYWNpdHk6MTtcblx0XHRcdFx0fVxuXHRcdFx0PC9zdHlsZT5gO1xuICAgIGxldCBodG1sQ29udGVudCA9IGBcblx0XHRcdFx0JHtzdmdDb250ZW50fVxuXHRcdFx0YDtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBmcy5vdXRwdXRGaWxlKFxuICAgICAgICAgIHRoaXMucGF0aHMuaHRtbCxcbiAgICAgICAgICBodG1sQ29udGVudCxcbiAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ2NyZWF0aW5nIEhUTUwnLCB0aGlzLnBhdGhzLmh0bWwpO1xuICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnBhdGhzLmh0bWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVQTkcoKSB7XG4gICAgbGV0IHN2Z1RvUG5nID0gcmVxdWlyZSgnc3ZnLXRvLXBuZycpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHN2Z1RvUG5nLmNvbnZlcnQoXG4gICAgICAgICAgdGhpcy5wYXRocy5zdmcsXG4gICAgICAgICAgdGhpcy5wYXRocy5wbmdcbiAgICAgICAgKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBsb2dnZXIuaW5mbygnY3JlYXRpbmcgUE5HJywgdGhpcy5wYXRocy5wbmcpO1xuICAgICAgICAgIHJlc29sdmUodGhpcy5wYXRocy5pbWFnZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbn1cbiJdfQ==