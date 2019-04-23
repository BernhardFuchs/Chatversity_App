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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5lbmdpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvaHRtbC5lbmdpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBeUM7QUFDekMsMkJBQTZCO0FBRTdCLDZDQUE0QztBQUM1Qyw2Q0FBdUM7QUFDdkMsNkRBQTBEO0FBRTFEO0lBT0k7UUFOUSxVQUFLLEdBQXFCLEVBQVMsQ0FBQztRQU94QyxJQUFNLE1BQU0sR0FBRyxJQUFJLHVDQUFpQixFQUFFLENBQUM7UUFDdkMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ2Esc0JBQVcsR0FBekI7UUFDSSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUN0QixVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7U0FDMUM7UUFDRCxPQUFPLFVBQVUsQ0FBQyxRQUFRLENBQUM7SUFDL0IsQ0FBQztJQUVNLHlCQUFJLEdBQVgsVUFBWSxZQUFvQjtRQUFoQyxpQkFzRkM7UUFyRkcsSUFBSSxRQUFRLEdBQUc7WUFDWCxVQUFVO1lBQ1YsVUFBVTtZQUNWLFNBQVM7WUFDVCxRQUFRO1lBQ1IsWUFBWTtZQUNaLFdBQVc7WUFDWCxZQUFZO1lBQ1osa0JBQWtCO1lBQ2xCLFlBQVk7WUFDWixXQUFXO1lBQ1gsYUFBYTtZQUNiLFlBQVk7WUFDWixhQUFhO1lBQ2IsT0FBTztZQUNQLE9BQU87WUFDUCxNQUFNO1lBQ04sU0FBUztZQUNULE9BQU87WUFDUCxXQUFXO1lBQ1gsUUFBUTtZQUNSLE9BQU87WUFDUCxZQUFZO1lBQ1osZ0JBQWdCO1lB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LEVBQUUsWUFBWTthQUNyQixDQUFDLENBQUM7WUFDSCxJQUFJLGFBQWEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3RELElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUMzQyxZQUFZLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNyRTtZQUVELE9BQU8scUJBQVUsQ0FBQyxLQUFLLENBQ25CLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLHlCQUF5QixHQUFHLEtBQUssR0FBRyxNQUFNLEVBQ3BFLE1BQU0sQ0FDVCxDQUFDLEtBQUssQ0FBQyxVQUFBLEdBQUc7Z0JBQ1AsZUFBTSxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsR0FBRyxLQUFLLEdBQUcsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ2hGLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsRUFDRCxVQUFBLEdBQUcsSUFBSSxPQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsd0NBQXdDLENBQUMsRUFBeEQsQ0FBd0QsQ0FDbEUsQ0FBQztJQUNOLENBQUM7SUFDTCxpQkFBQztBQUFELENBQUMsQUFyS0QsSUFxS0M7QUFyS1ksZ0NBQVU7QUF1S3ZCLGtCQUFlLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEhhbmRsZWJhcnMgZnJvbSAnaGFuZGxlYmFycyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IEZpbGVFbmdpbmUgZnJvbSAnLi9maWxlLmVuZ2luZSc7XG5pbXBvcnQgeyBIdG1sRW5naW5lSGVscGVycyB9IGZyb20gJy4vaHRtbC5lbmdpbmUuaGVscGVycyc7XG5cbmV4cG9ydCBjbGFzcyBIdG1sRW5naW5lIHtcbiAgICBwcml2YXRlIGNhY2hlOiB7IHBhZ2U6IHN0cmluZyB9ID0ge30gYXMgYW55O1xuICAgIHByaXZhdGUgY29tcGlsZWRQYWdlO1xuXG4gICAgcHJpdmF0ZSBwcmVjb21waWxlZE1lbnU7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogSHRtbEVuZ2luZTtcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjb25zdCBoZWxwZXIgPSBuZXcgSHRtbEVuZ2luZUhlbHBlcnMoKTtcbiAgICAgICAgaGVscGVyLnJlZ2lzdGVySGVscGVycyhIYW5kbGViYXJzKTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKCFIdG1sRW5naW5lLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBIdG1sRW5naW5lLmluc3RhbmNlID0gbmV3IEh0bWxFbmdpbmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSHRtbEVuZ2luZS5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdCh0ZW1wbGF0ZVBhdGg6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBsZXQgcGFydGlhbHMgPSBbXG4gICAgICAgICAgICAnb3ZlcnZpZXcnLFxuICAgICAgICAgICAgJ21hcmtkb3duJyxcbiAgICAgICAgICAgICdtb2R1bGVzJyxcbiAgICAgICAgICAgICdtb2R1bGUnLFxuICAgICAgICAgICAgJ2NvbXBvbmVudHMnLFxuICAgICAgICAgICAgJ2NvbXBvbmVudCcsXG4gICAgICAgICAgICAnY29udHJvbGxlcicsXG4gICAgICAgICAgICAnY29tcG9uZW50LWRldGFpbCcsXG4gICAgICAgICAgICAnZGlyZWN0aXZlcycsXG4gICAgICAgICAgICAnZGlyZWN0aXZlJyxcbiAgICAgICAgICAgICdpbmplY3RhYmxlcycsXG4gICAgICAgICAgICAnaW5qZWN0YWJsZScsXG4gICAgICAgICAgICAnaW50ZXJjZXB0b3InLFxuICAgICAgICAgICAgJ2d1YXJkJyxcbiAgICAgICAgICAgICdwaXBlcycsXG4gICAgICAgICAgICAncGlwZScsXG4gICAgICAgICAgICAnY2xhc3NlcycsXG4gICAgICAgICAgICAnY2xhc3MnLFxuICAgICAgICAgICAgJ2ludGVyZmFjZScsXG4gICAgICAgICAgICAncm91dGVzJyxcbiAgICAgICAgICAgICdpbmRleCcsXG4gICAgICAgICAgICAnaW5kZXgtbWlzYycsXG4gICAgICAgICAgICAnc2VhcmNoLXJlc3VsdHMnLFxuICAgICAgICAgICAgJ3NlYXJjaC1pbnB1dCcsXG4gICAgICAgICAgICAnbGluay10eXBlJyxcbiAgICAgICAgICAgICdibG9jay1tZXRob2QnLFxuICAgICAgICAgICAgJ2Jsb2NrLWVudW0nLFxuICAgICAgICAgICAgJ2Jsb2NrLXByb3BlcnR5JyxcbiAgICAgICAgICAgICdibG9jay1pbmRleCcsXG4gICAgICAgICAgICAnYmxvY2stY29uc3RydWN0b3InLFxuICAgICAgICAgICAgJ2Jsb2NrLXR5cGVhbGlhcycsXG4gICAgICAgICAgICAnYmxvY2stYWNjZXNzb3JzJyxcbiAgICAgICAgICAgICdibG9jay1pbnB1dCcsXG4gICAgICAgICAgICAnYmxvY2stb3V0cHV0JyxcbiAgICAgICAgICAgICdjb3ZlcmFnZS1yZXBvcnQnLFxuICAgICAgICAgICAgJ3VuaXQtdGVzdC1yZXBvcnQnLFxuICAgICAgICAgICAgJ21pc2NlbGxhbmVvdXMtZnVuY3Rpb25zJyxcbiAgICAgICAgICAgICdtaXNjZWxsYW5lb3VzLXZhcmlhYmxlcycsXG4gICAgICAgICAgICAnbWlzY2VsbGFuZW91cy10eXBlYWxpYXNlcycsXG4gICAgICAgICAgICAnbWlzY2VsbGFuZW91cy1lbnVtZXJhdGlvbnMnLFxuICAgICAgICAgICAgJ2FkZGl0aW9uYWwtcGFnZScsXG4gICAgICAgICAgICAncGFja2FnZS1kZXBlbmRlbmNpZXMnXG4gICAgICAgIF07XG4gICAgICAgIGlmICh0ZW1wbGF0ZVBhdGgpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBGaWxlRW5naW5lLmV4aXN0c1N5bmMocGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCkgKyBwYXRoLnNlcCArIHRlbXBsYXRlUGF0aCkpID09PVxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIud2FybihcbiAgICAgICAgICAgICAgICAgICAgJ1RlbXBsYXRlIHBhdGggc3BlY2lmaWNlZCBidXQgZG9lcyBub3QgZXhpc3QuLi51c2luZyBkZWZhdWx0IHRlbXBsYXRlcydcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICAgICAgcGFydGlhbHMubWFwKHBhcnRpYWwgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwYXJ0aWFsUGF0aCA9IHRoaXMuZGV0ZXJtaW5lVGVtcGxhdGVQYXRoKFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVBhdGgsXG4gICAgICAgICAgICAgICAgICAgICdwYXJ0aWFscy8nICsgcGFydGlhbCArICcuaGJzJ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZpbGVFbmdpbmUuZ2V0KHBhcnRpYWxQYXRoKS50aGVuKGRhdGEgPT5cbiAgICAgICAgICAgICAgICAgICAgSGFuZGxlYmFycy5yZWdpc3RlclBhcnRpYWwocGFydGlhbCwgZGF0YSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwYWdlUGF0aCA9IHRoaXMuZGV0ZXJtaW5lVGVtcGxhdGVQYXRoKHRlbXBsYXRlUGF0aCwgJ3BhZ2UuaGJzJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZpbGVFbmdpbmUuZ2V0KHBhZ2VQYXRoKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnBhZ2UgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBpbGVkUGFnZSA9IEhhbmRsZWJhcnMuY29tcGlsZSh0aGlzLmNhY2hlLnBhZ2UsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZlbnRJbmRlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpY3Q6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtZW51UGF0aCA9IHRoaXMuZGV0ZXJtaW5lVGVtcGxhdGVQYXRoKHRlbXBsYXRlUGF0aCwgJ3BhcnRpYWxzL21lbnUuaGJzJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZpbGVFbmdpbmUuZ2V0KG1lbnVQYXRoKS50aGVuKG1lbnVUZW1wbGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlY29tcGlsZWRNZW51ID0gSGFuZGxlYmFycy5jb21waWxlKG1lbnVUZW1wbGF0ZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJldmVudEluZGVudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmljdDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXJNZW51KHRlbXBsYXRlUGF0aCwgZGF0YSkge1xuICAgICAgICBsZXQgbWVudVBhdGggPSB0aGlzLmRldGVybWluZVRlbXBsYXRlUGF0aCh0ZW1wbGF0ZVBhdGgsICdwYXJ0aWFscy9tZW51LmhicycpO1xuICAgICAgICByZXR1cm4gRmlsZUVuZ2luZS5nZXQobWVudVBhdGgpLnRoZW4obWVudVRlbXBsYXRlID0+IHtcbiAgICAgICAgICAgIGRhdGEubWVudSA9ICdub3JtYWwnO1xuICAgICAgICAgICAgcmV0dXJuIEhhbmRsZWJhcnMuY29tcGlsZShtZW51VGVtcGxhdGUsIHtcbiAgICAgICAgICAgICAgICBwcmV2ZW50SW5kZW50OiB0cnVlLFxuICAgICAgICAgICAgICAgIHN0cmljdDogdHJ1ZVxuICAgICAgICAgICAgfSkoeyAuLi5kYXRhIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKG1haW5EYXRhOiBhbnksIHBhZ2U6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGxldCBvID0gbWFpbkRhdGE7XG4gICAgICAgIChPYmplY3QgYXMgYW55KS5hc3NpZ24obywgcGFnZSk7XG5cbiAgICAgICAgLy8gbGV0IG1lbSA9IHByb2Nlc3MubWVtb3J5VXNhZ2UoKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coYGhlYXBUb3RhbDogJHttZW0uaGVhcFRvdGFsfSB8IGhlYXBVc2VkOiAke21lbS5oZWFwVXNlZH1gKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jb21waWxlZFBhZ2Uoe1xuICAgICAgICAgICAgZGF0YTogb1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcHJpdmF0ZSBkZXRlcm1pbmVUZW1wbGF0ZVBhdGgodGVtcGxhdGVQYXRoOiBzdHJpbmcsIGZpbGVQYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBsZXQgb3V0UGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUgKyAnLy4uL3NyYy90ZW1wbGF0ZXMvJyArIGZpbGVQYXRoKTtcbiAgICAgICAgaWYgKHRlbXBsYXRlUGF0aCkge1xuICAgICAgICAgICAgbGV0IHRlc3RQYXRoID0gcGF0aC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgIHByb2Nlc3MuY3dkKCkgKyBwYXRoLnNlcCArIHRlbXBsYXRlUGF0aCArIHBhdGguc2VwICsgZmlsZVBhdGhcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBvdXRQYXRoID0gRmlsZUVuZ2luZS5leGlzdHNTeW5jKHRlc3RQYXRoKSA/IHRlc3RQYXRoIDogb3V0UGF0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0UGF0aDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2VuZXJhdGVDb3ZlcmFnZUJhZGdlKG91dHB1dEZvbGRlciwgbGFiZWwsIGNvdmVyYWdlRGF0YSkge1xuICAgICAgICByZXR1cm4gRmlsZUVuZ2luZS5nZXQoXG4gICAgICAgICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lICsgJy8uLi9zcmMvdGVtcGxhdGVzL3BhcnRpYWxzL2NvdmVyYWdlLWJhZGdlLmhicycpXG4gICAgICAgICkudGhlbihcbiAgICAgICAgICAgIGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZTogYW55ID0gSGFuZGxlYmFycy5jb21waWxlKGRhdGEpO1xuICAgICAgICAgICAgICAgIGNvdmVyYWdlRGF0YS5sYWJlbCA9IGxhYmVsO1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSB0ZW1wbGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGNvdmVyYWdlRGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxldCB0ZXN0T3V0cHV0RGlyID0gb3V0cHV0Rm9sZGVyLm1hdGNoKHByb2Nlc3MuY3dkKCkpO1xuICAgICAgICAgICAgICAgIGlmICh0ZXN0T3V0cHV0RGlyICYmIHRlc3RPdXRwdXREaXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRGb2xkZXIgPSBvdXRwdXRGb2xkZXIucmVwbGFjZShwcm9jZXNzLmN3ZCgpICsgcGF0aC5zZXAsICcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gRmlsZUVuZ2luZS53cml0ZShcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0Rm9sZGVyICsgcGF0aC5zZXAgKyAnL2ltYWdlcy9jb3ZlcmFnZS1iYWRnZS0nICsgbGFiZWwgKyAnLnN2ZycsXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFxuICAgICAgICAgICAgICAgICkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBkdXJpbmcgY292ZXJhZ2UgYmFkZ2UgJyArIGxhYmVsICsgJyBmaWxlIGdlbmVyYXRpb24gJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyID0+IFByb21pc2UucmVqZWN0KCdFcnJvciBkdXJpbmcgY292ZXJhZ2UgYmFkZ2UgZ2VuZXJhdGlvbicpXG4gICAgICAgICk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIdG1sRW5naW5lLmdldEluc3RhbmNlKCk7XG4iXX0=