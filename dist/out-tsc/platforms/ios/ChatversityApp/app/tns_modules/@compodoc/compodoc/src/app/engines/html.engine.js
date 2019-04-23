"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handlebars = require("handlebars");
var path = require("path");
var logger_1 = require("../../utils/logger");
var file_engine_1 = require("./file.engine");
var html_engine_helpers_1 = require("./html.engine.helpers");
var HtmlEngine = /** @class */ (function () {
    function HtmlEngine() {
        this.cache = {};
        var helper = new html_engine_helpers_1.HtmlEngineHelpers();
        helper.registerHelpers(Handlebars);
    }
    HtmlEngine.getInstance = function () {
        if (!HtmlEngine.instance) {
            HtmlEngine.instance = new HtmlEngine();
        }
        return HtmlEngine.instance;
    };
    HtmlEngine.prototype.init = function (templatePath) {
        var _this = this;
        var partials = [
            'overview',
            'markdown',
            'modules',
            'module',
            'components',
            'component',
            'controller',
            'component-detail',
            'directives',
            'directive',
            'injectables',
            'injectable',
            'interceptor',
            'guard',
            'pipes',
            'pipe',
            'classes',
            'class',
            'interface',
            'routes',
            'index',
            'index-misc',
            'search-results',
            'search-input',
            'link-type',
            'block-method',
            'block-enum',
            'block-property',
            'block-index',
            'block-constructor',
            'block-typealias',
            'block-accessors',
            'block-input',
            'block-output',
            'coverage-report',
            'unit-test-report',
            'miscellaneous-functions',
            'miscellaneous-variables',
            'miscellaneous-typealiases',
            'miscellaneous-enumerations',
            'additional-page',
            'package-dependencies'
        ];
        if (templatePath) {
            if (file_engine_1.default.existsSync(path.resolve(process.cwd() + path.sep + templatePath)) ===
                false) {
                logger_1.logger.warn('Template path specificed but does not exist...using default templates');
            }
        }
        return Promise.all(partials.map(function (partial) {
            var partialPath = _this.determineTemplatePath(templatePath, 'partials/' + partial + '.hbs');
            return file_engine_1.default.get(partialPath).then(function (data) {
                return Handlebars.registerPartial(partial, data);
            });
        }))
            .then(function () {
            var pagePath = _this.determineTemplatePath(templatePath, 'page.hbs');
            return file_engine_1.default.get(pagePath).then(function (data) {
                _this.cache.page = data;
                _this.compiledPage = Handlebars.compile(_this.cache.page, {
                    preventIndent: true,
                    strict: true
                });
            });
        })
            .then(function () {
            var menuPath = _this.determineTemplatePath(templatePath, 'partials/menu.hbs');
            return file_engine_1.default.get(menuPath).then(function (menuTemplate) {
                _this.precompiledMenu = Handlebars.compile(menuTemplate, {
                    preventIndent: true,
                    strict: true
                });
            });
        });
    };
    HtmlEngine.prototype.renderMenu = function (templatePath, data) {
        var menuPath = this.determineTemplatePath(templatePath, 'partials/menu.hbs');
        return file_engine_1.default.get(menuPath).then(function (menuTemplate) {
            data.menu = 'normal';
            return Handlebars.compile(menuTemplate, {
                preventIndent: true,
                strict: true
            })(__assign({}, data));
        });
    };
    HtmlEngine.prototype.render = function (mainData, page) {
        var o = mainData;
        Object.assign(o, page);
        // let mem = process.memoryUsage();
        // console.log(`heapTotal: ${mem.heapTotal} | heapUsed: ${mem.heapUsed}`);
        return this.compiledPage({
            data: o
        });
    };
    HtmlEngine.prototype.determineTemplatePath = function (templatePath, filePath) {
        var outPath = path.resolve(__dirname + '/../src/templates/' + filePath);
        if (templatePath) {
            var testPath = path.resolve(process.cwd() + path.sep + templatePath + path.sep + filePath);
            outPath = file_engine_1.default.existsSync(testPath) ? testPath : outPath;
        }
        return outPath;
    };
    HtmlEngine.prototype.generateCoverageBadge = function (outputFolder, label, coverageData) {
        return file_engine_1.default.get(path.resolve(__dirname + '/../src/templates/partials/coverage-badge.hbs')).then(function (data) {
            var template = Handlebars.compile(data);
            coverageData.label = label;
            var result = template({
                data: coverageData
            });
            var testOutputDir = outputFolder.match(process.cwd());
            if (testOutputDir && testOutputDir.length > 0) {
                outputFolder = outputFolder.replace(process.cwd() + path.sep, '');
            }
            return file_engine_1.default.write(outputFolder + path.sep + '/images/coverage-badge-' + label + '.svg', result).catch(function (err) {
                logger_1.logger.error('Error during coverage badge ' + label + ' file generation ', err);
                return Promise.reject(err);
            });
        }, function (err) { return Promise.reject('Error during coverage badge generation'); });
    };
    return HtmlEngine;
}());
exports.HtmlEngine = HtmlEngine;
exports.default = HtmlEngine.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5lbmdpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9lbmdpbmVzL2h0bWwuZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQXlDO0FBQ3pDLDJCQUE2QjtBQUU3Qiw2Q0FBNEM7QUFDNUMsNkNBQXVDO0FBQ3ZDLDZEQUEwRDtBQUUxRDtJQU9JO1FBTlEsVUFBSyxHQUFxQixFQUFTLENBQUM7UUFPeEMsSUFBTSxNQUFNLEdBQUcsSUFBSSx1Q0FBaUIsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUNhLHNCQUFXLEdBQXpCO1FBQ0ksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUU7WUFDdEIsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDO0lBQy9CLENBQUM7SUFFTSx5QkFBSSxHQUFYLFVBQVksWUFBb0I7UUFBaEMsaUJBc0ZDO1FBckZHLElBQUksUUFBUSxHQUFHO1lBQ1gsVUFBVTtZQUNWLFVBQVU7WUFDVixTQUFTO1lBQ1QsUUFBUTtZQUNSLFlBQVk7WUFDWixXQUFXO1lBQ1gsWUFBWTtZQUNaLGtCQUFrQjtZQUNsQixZQUFZO1lBQ1osV0FBVztZQUNYLGFBQWE7WUFDYixZQUFZO1lBQ1osYUFBYTtZQUNiLE9BQU87WUFDUCxPQUFPO1lBQ1AsTUFBTTtZQUNOLFNBQVM7WUFDVCxPQUFPO1lBQ1AsV0FBVztZQUNYLFFBQVE7WUFDUixPQUFPO1lBQ1AsWUFBWTtZQUNaLGdCQUFnQjtZQUNoQixjQUFjO1lBQ2QsV0FBVztZQUNYLGNBQWM7WUFDZCxZQUFZ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QUFhLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN0RCxJQUFJLGFBQWEsSUFBSSxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDM0MsWUFBWSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDckU7WUFFRCxPQUFPLHFCQUFVLENBQUMsS0FBSyxDQUNuQixZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyx5QkFBeUIsR0FBRyxLQUFLLEdBQUcsTUFBTSxFQUNwRSxNQUFNLENBQ1QsQ0FBQyxLQUFLLENBQUMsVUFBQSxHQUFHO2dCQUNQLGVBQU0sQ0FBQyxLQUFLLENBQUMsOEJBQThCLEdBQUcsS0FBSyxHQUFHLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNoRixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLEVBQ0QsVUFBQSxHQUFHLElBQUksT0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLHdDQUF3QyxDQUFDLEVBQXhELENBQXdELENBQ2xFLENBQUM7SUFDTixDQUFDO0lBQ0wsaUJBQUM7QUFBRCxDQUFDLEFBcktELElBcUtDO0FBcktZLGdDQUFVO0FBdUt2QixrQkFBZSxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBIYW5kbGViYXJzIGZyb20gJ2hhbmRsZWJhcnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCBGaWxlRW5naW5lIGZyb20gJy4vZmlsZS5lbmdpbmUnO1xuaW1wb3J0IHsgSHRtbEVuZ2luZUhlbHBlcnMgfSBmcm9tICcuL2h0bWwuZW5naW5lLmhlbHBlcnMnO1xuXG5leHBvcnQgY2xhc3MgSHRtbEVuZ2luZSB7XG4gICAgcHJpdmF0ZSBjYWNoZTogeyBwYWdlOiBzdHJpbmcgfSA9IHt9IGFzIGFueTtcbiAgICBwcml2YXRlIGNvbXBpbGVkUGFnZTtcblxuICAgIHByaXZhdGUgcHJlY29tcGlsZWRNZW51O1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEh0bWxFbmdpbmU7XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgY29uc3QgaGVscGVyID0gbmV3IEh0bWxFbmdpbmVIZWxwZXJzKCk7XG4gICAgICAgIGhlbHBlci5yZWdpc3RlckhlbHBlcnMoSGFuZGxlYmFycyk7XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICghSHRtbEVuZ2luZS5pbnN0YW5jZSkge1xuICAgICAgICAgICAgSHRtbEVuZ2luZS5pbnN0YW5jZSA9IG5ldyBIdG1sRW5naW5lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEh0bWxFbmdpbmUuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXQodGVtcGxhdGVQYXRoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgbGV0IHBhcnRpYWxzID0gW1xuICAgICAgICAgICAgJ292ZXJ2aWV3JyxcbiAgICAgICAgICAgICdtYXJrZG93bicsXG4gICAgICAgICAgICAnbW9kdWxlcycsXG4gICAgICAgICAgICAnbW9kdWxlJyxcbiAgICAgICAgICAgICdjb21wb25lbnRzJyxcbiAgICAgICAgICAgICdjb21wb25lbnQnLFxuICAgICAgICAgICAgJ2NvbnRyb2xsZXInLFxuICAgICAgICAgICAgJ2NvbXBvbmVudC1kZXRhaWwnLFxuICAgICAgICAgICAgJ2RpcmVjdGl2ZXMnLFxuICAgICAgICAgICAgJ2RpcmVjdGl2ZScsXG4gICAgICAgICAgICAnaW5qZWN0YWJsZXMnLFxuICAgICAgICAgICAgJ2luamVjdGFibGUnLFxuICAgICAgICAgICAgJ2ludGVyY2VwdG9yJyxcbiAgICAgICAgICAgICdndWFyZCcsXG4gICAgICAgICAgICAncGlwZXMnLFxuICAgICAgICAgICAgJ3BpcGUnLFxuICAgICAgICAgICAgJ2NsYXNzZXMnLFxuICAgICAgICAgICAgJ2NsYXNzJyxcbiAgICAgICAgICAgICdpbnRlcmZhY2UnLFxuICAgICAgICAgICAgJ3JvdXRlcycsXG4gICAgICAgICAgICAnaW5kZXgnLFxuICAgICAgICAgICAgJ2luZGV4LW1pc2MnLFxuICAgICAgICAgICAgJ3NlYXJjaC1yZXN1bHRzJyxcbiAgICAgICAgICAgICdzZWFyY2gtaW5wdXQnLFxuICAgICAgICAgICAgJ2xpbmstdHlwZScsXG4gICAgICAgICAgICAnYmxvY2stbWV0aG9kJyxcbiAgICAgICAgICAgICdibG9jay1lbnVtJyxcbiAgICAgICAgICAgICdibG9jay1wcm9wZXJ0eScsXG4gICAgICAgICAgICAnYmxvY2staW5kZXgnLFxuICAgICAgICAgICAgJ2Jsb2NrLWNvbnN0cnVjdG9yJyxcbiAgICAgICAgICAgICdibG9jay10eXBlYWxpYXMnLFxuICAgICAgICAgICAgJ2Jsb2NrLWFjY2Vzc29ycycsXG4gICAgICAgICAgICAnYmxvY2staW5wdXQnLFxuICAgICAgICAgICAgJ2Jsb2NrLW91dHB1dCcsXG4gICAgICAgICAgICAnY292ZXJhZ2UtcmVwb3J0JyxcbiAgICAgICAgICAgICd1bml0LXRlc3QtcmVwb3J0JyxcbiAgICAgICAgICAgICdtaXNjZWxsYW5lb3VzLWZ1bmN0aW9ucycsXG4gICAgICAgICAgICAnbWlzY2VsbGFuZW91cy12YXJpYWJsZXMnLFxuICAgICAgICAgICAgJ21pc2NlbGxhbmVvdXMtdHlwZWFsaWFzZXMnLFxuICAgICAgICAgICAgJ21pc2NlbGxhbmVvdXMtZW51bWVyYXRpb25zJyxcbiAgICAgICAgICAgICdhZGRpdGlvbmFsLXBhZ2UnLFxuICAgICAgICAgICAgJ3BhY2thZ2UtZGVwZW5kZW5jaWVzJ1xuICAgICAgICBdO1xuICAgICAgICBpZiAodGVtcGxhdGVQYXRoKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgRmlsZUVuZ2luZS5leGlzdHNTeW5jKHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpICsgcGF0aC5zZXAgKyB0ZW1wbGF0ZVBhdGgpKSA9PT1cbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oXG4gICAgICAgICAgICAgICAgICAgICdUZW1wbGF0ZSBwYXRoIHNwZWNpZmljZWQgYnV0IGRvZXMgbm90IGV4aXN0Li4udXNpbmcgZGVmYXVsdCB0ZW1wbGF0ZXMnXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIHBhcnRpYWxzLm1hcChwYXJ0aWFsID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGFydGlhbFBhdGggPSB0aGlzLmRldGVybWluZVRlbXBsYXRlUGF0aChcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVQYXRoLFxuICAgICAgICAgICAgICAgICAgICAncGFydGlhbHMvJyArIHBhcnRpYWwgKyAnLmhicydcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybiBGaWxlRW5naW5lLmdldChwYXJ0aWFsUGF0aCkudGhlbihkYXRhID0+XG4gICAgICAgICAgICAgICAgICAgIEhhbmRsZWJhcnMucmVnaXN0ZXJQYXJ0aWFsKHBhcnRpYWwsIGRhdGEpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGFnZVBhdGggPSB0aGlzLmRldGVybWluZVRlbXBsYXRlUGF0aCh0ZW1wbGF0ZVBhdGgsICdwYWdlLmhicycpO1xuICAgICAgICAgICAgICAgIHJldHVybiBGaWxlRW5naW5lLmdldChwYWdlUGF0aCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5wYWdlID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21waWxlZFBhZ2UgPSBIYW5kbGViYXJzLmNvbXBpbGUodGhpcy5jYWNoZS5wYWdlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2ZW50SW5kZW50OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaWN0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbWVudVBhdGggPSB0aGlzLmRldGVybWluZVRlbXBsYXRlUGF0aCh0ZW1wbGF0ZVBhdGgsICdwYXJ0aWFscy9tZW51LmhicycpO1xuICAgICAgICAgICAgICAgIHJldHVybiBGaWxlRW5naW5lLmdldChtZW51UGF0aCkudGhlbihtZW51VGVtcGxhdGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZWNvbXBpbGVkTWVudSA9IEhhbmRsZWJhcnMuY29tcGlsZShtZW51VGVtcGxhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZlbnRJbmRlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpY3Q6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyTWVudSh0ZW1wbGF0ZVBhdGgsIGRhdGEpIHtcbiAgICAgICAgbGV0IG1lbnVQYXRoID0gdGhpcy5kZXRlcm1pbmVUZW1wbGF0ZVBhdGgodGVtcGxhdGVQYXRoLCAncGFydGlhbHMvbWVudS5oYnMnKTtcbiAgICAgICAgcmV0dXJuIEZpbGVFbmdpbmUuZ2V0KG1lbnVQYXRoKS50aGVuKG1lbnVUZW1wbGF0ZSA9PiB7XG4gICAgICAgICAgICBkYXRhLm1lbnUgPSAnbm9ybWFsJztcbiAgICAgICAgICAgIHJldHVybiBIYW5kbGViYXJzLmNvbXBpbGUobWVudVRlbXBsYXRlLCB7XG4gICAgICAgICAgICAgICAgcHJldmVudEluZGVudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzdHJpY3Q6IHRydWVcbiAgICAgICAgICAgIH0pKHsgLi4uZGF0YSB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbmRlcihtYWluRGF0YTogYW55LCBwYWdlOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBsZXQgbyA9IG1haW5EYXRhO1xuICAgICAgICAoT2JqZWN0IGFzIGFueSkuYXNzaWduKG8sIHBhZ2UpO1xuXG4gICAgICAgIC8vIGxldCBtZW0gPSBwcm9jZXNzLm1lbW9yeVVzYWdlKCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBoZWFwVG90YWw6ICR7bWVtLmhlYXBUb3RhbH0gfCBoZWFwVXNlZDogJHttZW0uaGVhcFVzZWR9YCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcGlsZWRQYWdlKHtcbiAgICAgICAgICAgIGRhdGE6IG9cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHByaXZhdGUgZGV0ZXJtaW5lVGVtcGxhdGVQYXRoKHRlbXBsYXRlUGF0aDogc3RyaW5nLCBmaWxlUGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IG91dFBhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lICsgJy8uLi9zcmMvdGVtcGxhdGVzLycgKyBmaWxlUGF0aCk7XG4gICAgICAgIGlmICh0ZW1wbGF0ZVBhdGgpIHtcbiAgICAgICAgICAgIGxldCB0ZXN0UGF0aCA9IHBhdGgucmVzb2x2ZShcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmN3ZCgpICsgcGF0aC5zZXAgKyB0ZW1wbGF0ZVBhdGggKyBwYXRoLnNlcCArIGZpbGVQYXRoXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgb3V0UGF0aCA9IEZpbGVFbmdpbmUuZXhpc3RzU3luYyh0ZXN0UGF0aCkgPyB0ZXN0UGF0aCA6IG91dFBhdGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dFBhdGg7XG4gICAgfVxuXG4gICAgcHVibGljIGdlbmVyYXRlQ292ZXJhZ2VCYWRnZShvdXRwdXRGb2xkZXIsIGxhYmVsLCBjb3ZlcmFnZURhdGEpIHtcbiAgICAgICAgcmV0dXJuIEZpbGVFbmdpbmUuZ2V0KFxuICAgICAgICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSArICcvLi4vc3JjL3RlbXBsYXRlcy9wYXJ0aWFscy9jb3ZlcmFnZS1iYWRnZS5oYnMnKVxuICAgICAgICApLnRoZW4oXG4gICAgICAgICAgICBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGU6IGFueSA9IEhhbmRsZWJhcnMuY29tcGlsZShkYXRhKTtcbiAgICAgICAgICAgICAgICBjb3ZlcmFnZURhdGEubGFiZWwgPSBsYWJlbDtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gdGVtcGxhdGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBjb3ZlcmFnZURhdGFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBsZXQgdGVzdE91dHB1dERpciA9IG91dHB1dEZvbGRlci5tYXRjaChwcm9jZXNzLmN3ZCgpKTtcbiAgICAgICAgICAgICAgICBpZiAodGVzdE91dHB1dERpciAmJiB0ZXN0T3V0cHV0RGlyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0Rm9sZGVyID0gb3V0cHV0Rm9sZGVyLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSArIHBhdGguc2VwLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIEZpbGVFbmdpbmUud3JpdGUoXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dEZvbGRlciArIHBhdGguc2VwICsgJy9pbWFnZXMvY292ZXJhZ2UtYmFkZ2UtJyArIGxhYmVsICsgJy5zdmcnLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHRcbiAgICAgICAgICAgICAgICApLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgZHVyaW5nIGNvdmVyYWdlIGJhZGdlICcgKyBsYWJlbCArICcgZmlsZSBnZW5lcmF0aW9uICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVyciA9PiBQcm9taXNlLnJlamVjdCgnRXJyb3IgZHVyaW5nIGNvdmVyYWdlIGJhZGdlIGdlbmVyYXRpb24nKVxuICAgICAgICApO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSHRtbEVuZ2luZS5nZXRJbnN0YW5jZSgpO1xuIl19