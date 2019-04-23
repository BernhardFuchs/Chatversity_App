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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvbmdkLXRyYW5zZm9ybWVyL3NyYy9lbmdpbmVzL2RvdC9kb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBNkI7QUFDN0IsK0NBQTRDO0FBQzVDLCtDQUFzRDtBQWdCdEQsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzdCLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QixJQUFJLFFBQVEsR0FBWSxLQUFLLENBQUM7QUFDOUIsSUFBSSxRQUFRLEdBQVksS0FBSyxDQUFDO0FBRTlCLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUVwRCxxREFBcUQ7QUFDckQ7SUFxQkUsbUJBQVksT0FBaUI7UUFuQjdCLCtDQUErQztRQUMvQyxhQUFRLEdBQUcsMkJBQVksQ0FBQztRQUV4QixRQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXBCLFVBQUssR0FBRztZQUNOLFNBQVMsRUFBRSxJQUFJO1NBQ2hCLENBQUM7UUFFRixVQUFLLEdBQUc7WUFDTixHQUFHLEVBQUUsSUFBSTtZQUNULElBQUksRUFBRSxJQUFJO1lBQ1YsR0FBRyxFQUFFLElBQUk7WUFDVCxHQUFHLEVBQUUsSUFBSTtZQUNULElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQztRQUVGLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFJckIsSUFBSSxPQUFPLEdBQUcsT0FBSyxPQUFPLE1BQUcsQ0FBQztRQUU5QixJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2IsSUFBSSxFQUFF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QU07WUFDL0IsUUFBUSxDQUFDLE9BQU8sQ0FDZCxLQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFDZCxLQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FDZixDQUFDLElBQUksQ0FBQztnQkFDTCxpQkFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFSCxnQkFBQztBQUFELENBQUMsQUFoU0QsSUFnU0M7QUFoU1ksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQGNvbXBvZG9jL25nZC1jb3JlJztcbmltcG9ydCB7IERPVF9URU1QTEFURSwgTEVHRU5EIH0gZnJvbSAnLi9kb3QudGVtcGxhdGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElPcHRpb25zIHtcblx0bmFtZT86IHN0cmluZztcblx0b3V0cHV0Pzogc3RyaW5nO1xuXHRkaXNwbGF5TGVnZW5kPzogYm9vbGVhbjtcblx0b3V0cHV0Rm9ybWF0cz86IHN0cmluZztcbiAgICBzaWxlbnQ/OiBib29sZWFuO1xuXHRkb3Q/OiB7XG5cdFx0c2hhcGVNb2R1bGVzOiBzdHJpbmdcblx0XHRzaGFwZVByb3ZpZGVyczogc3RyaW5nXG5cdFx0c2hhcGVEaXJlY3RpdmVzOiBzdHJpbmdcblx0XHRjb2xvclNjaGVtZTogc3RyaW5nXG5cdH07XG59XG5cbmxldCBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJyk7XG5sZXQgVml6ID0gcmVxdWlyZSgndml6LmpzJyk7XG5sZXQgY2xlYW5Eb3Q6IGJvb2xlYW4gPSBmYWxzZTtcbmxldCBjbGVhblN2ZzogYm9vbGVhbiA9IGZhbHNlO1xuXG5sZXQgYXBwTmFtZSA9IHJlcXVpcmUoJy4uLy4uLy4uL3BhY2thZ2UuanNvbicpLm5hbWU7XG5cbi8vIGh0dHA6Ly93d3cuZ3JhcGh2aXoub3JnL0RvY3VtZW50YXRpb24vZG90Z3VpZGUucGRmXG5leHBvcnQgY2xhc3MgRG90RW5naW5lIHtcblxuICAvLyBodHRwOi8vd3d3LmdyYXBodml6Lm9yZy9kb2MvaW5mby9zaGFwZXMuaHRtbFxuICB0ZW1wbGF0ZSA9IERPVF9URU1QTEFURTtcblxuICBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xuXG4gIGZpbGVzID0ge1xuICAgIGNvbXBvbmVudDogbnVsbFxuICB9O1xuXG4gIHBhdGhzID0ge1xuICAgIGRvdDogbnVsbCxcbiAgICBqc29uOiBudWxsLFxuICAgIHBuZzogbnVsbCxcbiAgICBzdmc6IG51bGwsXG4gICAgaHRtbDogbnVsbFxuICB9O1xuXG4gIG9wdGlvbnM6IElPcHRpb25zID0ge307XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogSU9wdGlvbnMpIHtcblxuICAgIGxldCBiYXNlRGlyID0gYC4vJHthcHBOYW1lfS9gO1xuXG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgbmFtZTogYCR7YXBwTmFtZX1gLFxuICAgICAgb3V0cHV0OiBvcHRpb25zLm91dHB1dCxcbiAgICAgIGRpc3BsYXlMZWdlbmQ6IG9wdGlvbnMuZGlzcGxheUxlZ2VuZCxcbiAgICAgIG91dHB1dEZvcm1hdHM6IG9wdGlvbnMub3V0cHV0Rm9ybWF0cyxcbiAgICAgIGRvdDoge1xuICAgICAgICBzaGFwZU1vZHVsZXM6ICdjb21wb25lbnQnLFxuICAgICAgICBzaGFwZVByb3ZpZGVyczogJ2VsbGlwc2UnLFxuICAgICAgICBzaGFwZURpcmVjdGl2ZXM6ICdjZHMnLFxuXG4gICAgICAgIC8vaHR0cDovL3d3dy5ncmFwaHZpei5vcmcvZG9jL2luZm8vY29sb3JzLmh0bWxcbiAgICAgICAgY29sb3JTY2hlbWU6ICdzZXQzMTInXG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChvcHRpb25zLm91dHB1dCkge1xuXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vdXRwdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGxvZ2dlci5mYXRhbCgnT3B0aW9uIFwib3V0cHV0XCIgaGFzIGJlZW4gcHJvdmlkZWQgYnV0IGl0IGlzIG5vdCBhIHZhbGlkIG5hbWUuJyk7XG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBhdGhzID0ge1xuICAgICAgZG90OiBwYXRoLmpvaW4odGhpcy5vcHRpb25zLm91dHB1dCwgJy9kZXBlbmRlbmNpZXMuZG90JyksXG4gICAgICBqc29uOiBwYXRoLmpvaW4odGhpcy5vcHRpb25zLm91dHB1dCwgJy9kZXBlbmRlbmNpZXMuanNvbicpLFxuICAgICAgc3ZnOiBwYXRoLmpvaW4odGhpcy5vcHRpb25zLm91dHB1dCwgJy9kZXBlbmRlbmNpZXMuc3ZnJyksXG4gICAgICBwbmc6IHBhdGguam9pbih0aGlzLm9wdGlvbnMub3V0cHV0LCAnL2RlcGVuZGVuY2llcy5wbmcnKSxcbiAgICAgIGh0bWw6IHBhdGguam9pbih0aGlzLm9wdGlvbnMub3V0cHV0LCAnL2RlcGVuZGVuY2llcy5odG1sJylcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnNpbGVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbG9nZ2VyLnNpbGVudCA9IG9wdGlvbnMuc2lsZW50O1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZU91dHB1dChvdXRwdXQ6IHN0cmluZykge1xuICAgICAgdGhpcy5wYXRocyA9IHtcbiAgICAgICAgZG90OiBwYXRoLmpvaW4ob3V0cHV0LCAnL2RlcGVuZGVuY2llcy5kb3QnKSxcbiAgICAgICAganNvbjogcGF0aC5qb2luKG91dHB1dCwgJy9kZXBlbmRlbmNpZXMuanNvbicpLFxuICAgICAgICBzdmc6IHBhdGguam9pbihvdXRwdXQsICcvZGVwZW5kZW5jaWVzLnN2ZycpLFxuICAgICAgICBwbmc6IHBhdGguam9pbihvdXRwdXQsICcvZGVwZW5kZW5jaWVzLnBuZycpLFxuICAgICAgICBodG1sOiBwYXRoLmpvaW4ob3V0cHV0LCAnL2RlcGVuZGVuY2llcy5odG1sJylcbiAgICAgIH07XG4gIH1cblxuICBnZW5lcmF0ZUdyYXBoKGRlcHMpIHtcbiAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLnByZXByb2Nlc3NUZW1wbGF0ZXModGhpcy5vcHRpb25zKTtcbiAgICBsZXQgZ2VuZXJhdG9ycyA9IFtdO1xuXG4gICAgLy8gSGFuZGxlIHN2ZyBkZXBlbmRlbmN5IHdpdGggZG90LCBhbmQgaHRtbCB3aXRoIHN2Z1xuICAgIGlmICh0aGlzLm9wdGlvbnMub3V0cHV0Rm9ybWF0cy5pbmRleE9mKCdkb3QnKSA+IC0xICYmIHRoaXMub3B0aW9ucy5vdXRwdXRGb3JtYXRzLmluZGV4T2YoJ3N2ZycpID09PSAtMSAmJiB0aGlzLm9wdGlvbnMub3V0cHV0Rm9ybWF0cy5pbmRleE9mKCdodG1sJykgPT09IC0xKSB7XG4gICAgICBnZW5lcmF0b3JzLnB1c2godGhpcy5nZW5lcmF0ZURvdCh0ZW1wbGF0ZSwgZGVwcykpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMub3V0cHV0Rm9ybWF0cy5pbmRleE9mKCdzdmcnKSA+IC0xICYmIHRoaXMub3B0aW9ucy5vdXRwdXRGb3JtYXRzLmluZGV4T2YoJ2h0bWwnKSA9PT0gLTEpIHtcbiAgICAgIGdlbmVyYXRvcnMucHVzaCh0aGlzLmdlbmVyYXRlRG90KHRlbXBsYXRlLCBkZXBzKS50aGVuKF8gPT4gdGhpcy5nZW5lcmF0ZVNWRygpKSk7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLm91dHB1dEZvcm1hdHMuaW5kZXhPZignc3ZnJykgPiAtMSAmJiB0aGlzLm9wdGlvbnMub3V0cHV0Rm9ybWF0cy5pbmRleE9mKCdkb3QnKSA9PT0gLTEpIHtcbiAgICAgICAgY2xlYW5Eb3QgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMub3V0cHV0Rm9ybWF0cy5pbmRleE9mKCdqc29uJykgPiAtMSkge1xuICAgICAgZ2VuZXJhdG9ycy5wdXNoKHRoaXMuZ2VuZXJhdGVKU09OKGRlcHMpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm91dHB1dEZvcm1hdHMuaW5kZXhPZignaHRtbCcpID4gLTEpIHtcbiAgICAgIGdlbmVyYXRvcnMucHVzaCh0aGlzLmdlbmVyYXRlRG90KHRlbXBsYXRlLCBkZXBzKS50aGVuKF8gPT4gdGhpcy5nZW5lcmF0ZVNWRygpKS50aGVuKF8gPT4gdGhpcy5nZW5lcmF0ZUhUTUwoKSkpO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5vdXRwdXRGb3JtYXRzLmluZGV4T2YoJ2h0bWwnKSA+IC0xICYmIHRoaXMub3B0aW9ucy5vdXRwdXRGb3JtYXRzLmluZGV4T2YoJ3N2ZycpID09PSAtMSkge1xuICAgICAgICBjbGVhblN2ZyA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLm91dHB1dEZvcm1hdHMuaW5kZXhPZignaHRtbCcpID4gLTEgJiYgdGhpcy5vcHRpb25zLm91dHB1dEZvcm1hdHMuaW5kZXhPZignZG90JykgPT09IC0xKSB7XG4gICAgICAgIGNsZWFuRG90ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgLy8gdG9kbyhXQ0gpOiBkaXNhYmxlIFBORyBjcmVhdGlvbiBkdWUgdG8gc29tZSBlcnJvcnMgd2l0aCBwaGFudG9tanNcbiAgICAvKlxuICAgICBpZiAodGhpcy5vcHRpb25zLm91dHB1dEZvcm1hdHMuaW5kZXhPZigncG5nJykgPiAtMSkge1xuICAgICBnZW5lcmF0b3JzLnB1c2godGhpcy5nZW5lcmF0ZVBORygpKTtcbiAgICAgfVxuICAgICAqL1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGdlbmVyYXRvcnMpLnRoZW4oXyA9PiB0aGlzLmNsZWFuR2VuZXJhdGVkRmlsZXMoKSk7XG4gIH1cblxuICBwcml2YXRlIGNsZWFuR2VuZXJhdGVkRmlsZXMoKSB7XG4gICAgbGV0IHJlbW92ZUZpbGUgPSAocGF0aCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZnMudW5saW5rKHBhdGgsIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgbGV0IGNsZWFuZXJzID0gW107XG4gICAgaWYgKGNsZWFuRG90KSB7XG4gICAgICBjbGVhbmVycy5wdXNoKHJlbW92ZUZpbGUodGhpcy5wYXRocy5kb3QpKTtcbiAgICB9XG4gICAgaWYgKGNsZWFuU3ZnKSB7XG4gICAgICBjbGVhbmVycy5wdXNoKHJlbW92ZUZpbGUodGhpcy5wYXRocy5zdmcpKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGNsZWFuZXJzKTtcbiAgfVxuXG4gIHByaXZhdGUgcHJlcHJvY2Vzc1RlbXBsYXRlcyhvcHRpb25zPykge1xuICAgIGxldCBkb1QgPSByZXF1aXJlKCdkb3QnKTtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmIChvcHRpb25zLmRpc3BsYXlMZWdlbmQgPT09ICd0cnVlJyB8fCBvcHRpb25zLmRpc3BsYXlMZWdlbmQgPT09IHRydWUpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMudGVtcGxhdGUucmVwbGFjZSgvIyMjbGVnZW5kIyMjL2csIExFR0VORCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMudGVtcGxhdGUucmVwbGFjZSgvIyMjbGVnZW5kIyMjL2csICdcIlwiJyk7XG4gICAgfVxuICAgIHJldHVybiBkb1QudGVtcGxhdGUocmVzdWx0LnJlcGxhY2UoLyMjI3NjaGVtZSMjIy9nLCBvcHRpb25zLmRvdC5jb2xvclNjaGVtZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZUpTT04oZGVwcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZzLm91dHB1dEZpbGUoXG4gICAgICAgICAgdGhpcy5wYXRocy5qc29uLFxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGRlcHMsIG51bGwsIDIpLFxuICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnY3JlYXRpbmcgSlNPTicsIHRoaXMucGF0aHMuanNvbik7XG4gICAgICAgICAgICByZXNvbHZlKHRoaXMucGF0aHMuanNvbik7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gQG5vdC11c2VkXG4gIHByaXZhdGUgZXNjYXBlKGRlcHMpIHtcbiAgICByZXR1cm4gZGVwcy5tYXAoZCA9PiB7XG4gICAgICBmb3IgKGxldCBwcm9wIGluIGQpIHtcbiAgICAgICAgaWYgKGQuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICBsZXQgYSA9IGRbcHJvcF07XG4gICAgICAgICAgY29uc29sZS5sb2coYSk7XG5cbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXNjYXBlKGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgYSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGEgPSBhLnJlcGxhY2UoL1wiL2csICdcXFwiJyk7XG4gICAgICAgICAgICBhID0gYS5yZXBsYWNlKC8nL2csIFwiXFwnXCIpO1xuICAgICAgICAgICAgYSA9IGEucmVwbGFjZSgvXFx7L2csIFwiXFx7XCIpO1xuICAgICAgICAgICAgYSA9IGEucmVwbGFjZSgvXFwpL2csIFwiXFwpXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZDtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVEb3QodGVtcGxhdGUsIGRlcHMpIHtcblxuICAgIC8vIHRvZG8od2NoKVxuICAgIC8vZGVwcyA9IHRoaXMuZXNjYXBlKGRlcHMpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZnMub3V0cHV0RmlsZShcbiAgICAgICAgICB0aGlzLnBhdGhzLmRvdCxcbiAgICAgICAgICB0ZW1wbGF0ZSh7XG4gICAgICAgICAgICBtb2R1bGVzOiBkZXBzXG4gICAgICAgICAgfSksXG4gICAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNsZWFuRG90ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnY3JlYXRpbmcgRE9UJywgdGhpcy5wYXRocy5kb3QpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNvbHZlKHRoaXMucGF0aHMuZG90KTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlU1ZHKCkge1xuICAgIGxldCB2aXpTdmcgPSBWaXooXG4gICAgICBmcy5yZWFkRmlsZVN5bmModGhpcy5wYXRocy5kb3QpLnRvU3RyaW5nKCksIHtcbiAgICAgICAgZm9ybWF0OiAnc3ZnJyxcbiAgICAgICAgZW5naW5lOiAnZG90J1xuICAgICAgfSwgeyB0b3RhbE1lbW9yeTogMzIgKiAxMDI0ICogMTAyNCB9KTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZzLm91dHB1dEZpbGUoXG4gICAgICAgICAgdGhpcy5wYXRocy5zdmcsXG4gICAgICAgICAgdml6U3ZnLFxuICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjbGVhblN2ZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ2NyZWF0aW5nIFNWRycsIHRoaXMucGF0aHMuc3ZnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnBhdGhzLnN2Zyk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZUhUTUwoKSB7XG4gICAgbGV0IHN2Z0NvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmModGhpcy5wYXRocy5zdmcpLnRvU3RyaW5nKCk7XG4gICAgbGV0IGNzc0NvbnRlbnQgPSBgXG5cdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdC5lZGdlIHtcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXM7XG5cdFx0XHRcdFx0b3BhY2l0eTowLjI7XG5cdFx0XHRcdH1cblx0XHRcdFx0Lm5vZGUge1xuXHRcdFx0XHRcdHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjFzO1xuXHRcdFx0XHRcdHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlciBjZW50ZXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0Lm5vZGU6aG92ZXIge1xuXHRcdFx0XHRcdHRyYW5zZm9ybTogc2NhbGUoMS4wMyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Lm5vZGU6aG92ZXIgKyAuZWRnZSB7XG5cdFx0XHRcdFx0b3BhY2l0eToxO1xuXHRcdFx0XHR9XG5cdFx0XHQ8L3N0eWxlPmA7XG4gICAgbGV0IGh0bWxDb250ZW50ID0gYFxuXHRcdFx0XHQke3N2Z0NvbnRlbnR9XG5cdFx0XHRgO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZzLm91dHB1dEZpbGUoXG4gICAgICAgICAgdGhpcy5wYXRocy5odG1sLFxuICAgICAgICAgIGh0bWxDb250ZW50LFxuICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnY3JlYXRpbmcgSFRNTCcsIHRoaXMucGF0aHMuaHRtbCk7XG4gICAgICAgICAgICByZXNvbHZlKHRoaXMucGF0aHMuaHRtbCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZVBORygpIHtcbiAgICBsZXQgc3ZnVG9QbmcgPSByZXF1aXJlKCdzdmctdG8tcG5nJyk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgc3ZnVG9QbmcuY29udmVydChcbiAgICAgICAgICB0aGlzLnBhdGhzLnN2ZyxcbiAgICAgICAgICB0aGlzLnBhdGhzLnBuZ1xuICAgICAgICApLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxvZ2dlci5pbmZvKCdjcmVhdGluZyBQTkcnLCB0aGlzLnBhdGhzLnBuZyk7XG4gICAgICAgICAgcmVzb2x2ZSh0aGlzLnBhdGhzLmltYWdlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxufVxuIl19