"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var LiveServer = require("live-server");
var _ = require("lodash");
var path = require("path");
var ts_simple_ast_1 = require("ts-simple-ast");
var chokidar = require('chokidar');
var marked = require('marked');
var traverse = require('traverse');
var crypto = require('crypto');
var logger_1 = require("../utils/logger");
var configuration_1 = require("./configuration");
var dependencies_engine_1 = require("./engines/dependencies.engine");
var export_engine_1 = require("./engines/export.engine");
var file_engine_1 = require("./engines/file.engine");
var html_engine_1 = require("./engines/html.engine");
var i18n_engine_1 = require("./engines/i18n.engine");
var markdown_engine_1 = require("./engines/markdown.engine");
var ngd_engine_1 = require("./engines/ngd.engine");
var search_engine_1 = require("./engines/search.engine");
var angular_dependencies_1 = require("./compiler/angular-dependencies");
var angularjs_dependencies_1 = require("./compiler/angularjs-dependencies");
var angular_version_util_1 = require("../utils/angular-version.util");
var constants_1 = require("../utils/constants");
var defaults_1 = require("../utils/defaults");
var promise_sequential_1 = require("../utils/promise-sequential");
var router_parser_util_1 = require("../utils/router-parser.util");
var utils_1 = require("../utils/utils");
var cwd = process.cwd();
var startTime = new Date();
var generationPromiseResolve;
var generationPromiseReject;
var generationPromise = new Promise(function (resolve, reject) {
    generationPromiseResolve = resolve;
    generationPromiseReject = reject;
});
var Application = /** @class */ (function () {
    /**
     * Create a new compodoc application instance.
     *
     * @param options An object containing the options that should be used.
     */
    function Application(options) {
        var _this = this;
        /**
         * Files changed during watch scanning
         */
        this.watchChangedFiles = [];
        /**
         * Boolean for watching status
         * @type {boolean}
         */
        this.isWatching = false;
        /**
         * Store package.json data
         */
        this.packageJsonData = {};
        this.preparePipes = function (somePipes) {
            logger_1.logger.info('Prepare pipes');
            configuration_1.default.mainData.pipes = somePipes ? somePipes : dependencies_engine_1.default.getPipes();
            return new Promise(function (resolve, reject) {
                var i = 0;
                var len = configuration_1.default.mainData.pipes.length;
                var loop = function () {
                    if (i < len) {
                        var pipe = configuration_1.default.mainData.pipes[i];
                        if (markdown_engine_1.default.hasNeighbourReadmeFile(pipe.file)) {
                            logger_1.logger.info(" " + pipe.name + " has a README file, include it");
                            var readme = markdown_engine_1.default.readNeighbourReadmeFile(pipe.file);
                            pipe.readme = marked(readme);
                        }
                        var page = {
                            path: 'pipes',
                            name: pipe.name,
                            id: pipe.id,
                            navTabs: _this.getNavTabs(pipe),
                            context: 'pipe',
                            pipe: pipe,
                            depth: 1,
                            pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                        };
                        if (pipe.isDuplicate) {
                            page.name += '-' + pipe.duplicateId;
                        }
                        configuration_1.default.addPage(page);
                        i++;
                        loop();
                    }
                    else {
                        resolve();
                    }
                };
                loop();
            });
        };
        this.prepareClasses = function (someClasses) {
            logger_1.logger.info('Prepare classes');
            configuration_1.default.mainData.classes = someClasses
                ? someClasses
                : dependencies_engine_1.default.getClasses();
            return new Promise(function (resolve, reject) {
                var i = 0;
                var len = configuration_1.default.mainData.classes.length;
                var loop = function () {
                    if (i < len) {
                        var classe = configuration_1.default.mainData.classes[i];
                        if (markdown_engine_1.default.hasNeighbourReadmeFile(classe.file)) {
                            logger_1.logger.info(" " + classe.name + " has a README file, include it");
                            var readme = markdown_engine_1.default.readNeighbourReadmeFile(classe.file);
                            classe.readme = marked(readme);
                        }
                        var page = {
                            path: 'classes',
                            name: classe.name,
                            id: classe.id,
                            navTabs: _this.getNavTabs(classe),
                            context: 'class',
                            class: classe,
                            depth: 1,
                            pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                        };
                        if (classe.isDuplicate) {
                            page.name += '-' + classe.duplicateId;
                        }
                        configuration_1.default.addPage(page);
                        i++;
                        loop();
                    }
                    else {
                        resolve();
                    }
                };
                loop();
            });
        };
        for (var option in options) {
            if (typeof configuration_1.default.mainData[option] !== 'undefined') {
                configuration_1.default.mainData[option] = options[option];
            }
            // For documentationMainName, process it outside the loop, for handling conflict with pages name
            if (option === 'name') {
                configuration_1.default.mainData.documentationMainName = options[option];
            }
            // For documentationMainName, process it outside the loop, for handling conflict with pages name
            if (option === 'silent') {
                logger_1.logger.silent = false;
            }
        }
    }
    /**
     * Start compodoc process
     */
    Application.prototype.generate = function () {
        var _this = this;
        process.on('unhandledRejection', this.unhandledRejectionListener);
        process.on('uncaughtException', this.uncaughtExceptionListener);
        i18n_engine_1.default.init(configuration_1.default.mainData.language);
        if (configuration_1.default.mainData.output.charAt(configuration_1.default.mainData.output.length - 1) !== '/') {
            configuration_1.default.mainData.output += '/';
        }
        if (configuration_1.default.mainData.exportFormat !== defaults_1.COMPODOC_DEFAULTS.exportFormat) {
            this.processPackageJson();
        }
        else {
            html_engine_1.default.init(configuration_1.default.mainData.templates).then(function () { return _this.processPackageJson(); });
        }
        return generationPromise;
    };
    Application.prototype.endCallback = function () {
        process.removeListener('unhandledRejection', this.unhandledRejectionListener);
        process.removeListener('uncaughtException', this.uncaughtExceptionListener);
    };
    Application.prototype.unhandledRejectionListener = function (err, p) {
        console.log('Unhandled Rejection at:', p, 'reason:', err);
        logger_1.logger.error('Sorry, but there was a problem during parsing or generation of the documentation. Please fill an issue on github. (https://github.com/compodoc/compodoc/issues/new)'); // tslint:disable-line
        process.exit(1);
    };
    Application.prototype.uncaughtExceptionListener = function (err) {
        logger_1.logger.error(err);
        logger_1.logger.error('Sorry, but there was a problem during parsing or generation of the documentation. Please fill an issue on github. (https://github.com/compodoc/compodoc/issues/new)'); // tslint:disable-line
        process.exit(1);
    };
    /**
     * Start compodoc documentation coverage
     */
    Application.prototype.testCoverage = function () {
        this.getDependenciesData();
    };
    /**
     * Store files for initial processing
     * @param  {Array<string>} files Files found during source folder and tsconfig scan
     */
    Application.prototype.setFiles = function (files) {
        this.files = files;
    };
    /**
     * Store files for watch processing
     * @param  {Array<string>} files Files found during source folder and tsconfig scan
     */
    Application.prototype.setUpdatedFiles = function (files) {
        this.updatedFiles = files;
    };
    /**
     * Return a boolean indicating presence of one TypeScript file in updatedFiles list
     * @return {boolean} Result of scan
     */
    Application.prototype.hasWatchedFilesTSFiles = function () {
        var result = false;
        _.forEach(this.updatedFiles, function (file) {
            if (path.extname(file) === '.ts') {
                result = true;
            }
        });
        return result;
    };
    /**
     * Return a boolean indicating presence of one root markdown files in updatedFiles list
     * @return {boolean} Result of scan
     */
    Application.prototype.hasWatchedFilesRootMarkdownFiles = function () {
        var result = false;
        _.forEach(this.updatedFiles, function (file) {
            if (path.extname(file) === '.md' && path.dirname(file) === cwd) {
                result = true;
            }
        });
        return result;
    };
    /**
     * Clear files for watch processing
     */
    Application.prototype.clearUpdatedFiles = function () {
        this.updatedFiles = [];
        this.watchChangedFiles = [];
    };
    Application.prototype.processPackageJson = function () {
        var _this = this;
        logger_1.logger.info('Searching package.json file');
        file_engine_1.default.get(cwd + path.sep + 'package.json').then(function (packageData) {
            var parsedData = JSON.parse(packageData);
            _this.packageJsonData = parsedData;
            if (typeof parsedData.name !== 'undefined' &&
                configuration_1.default.mainData.documentationMainName === defaults_1.COMPODOC_DEFAULTS.title) {
                configuration_1.default.mainData.documentationMainName =
                    parsedData.name + ' documentation';
            }
            if (typeof parsedData.description !== 'undefined') {
                configuration_1.default.mainData.documentationMainDescription = parsedData.description;
            }
            configuration_1.default.mainData.angularVersion = angular_version_util_1.default.getAngularVersionOfProject(parsedData);
            logger_1.logger.info('package.json file found');
            if (typeof parsedData.dependencies !== 'undefined') {
                _this.processPackageDependencies(parsedData.dependencies);
            }
            if (typeof parsedData.peerDependencies !== 'undefined') {
                _this.processPackagePeerDependencies(parsedData.peerDependencies);
            }
            _this.processMarkdowns().then(function () {
                _this.getDependenciesData();
            }, function (errorMessage) {
                logger_1.logger.error(errorMessage);
            });
        }, function (errorMessage) {
            logger_1.logger.error(errorMessage);
            logger_1.logger.error('Continuing without package.json file');
            _this.processMarkdowns().then(function () {
                _this.getDependenciesData();
            }, function (errorMessage1) {
                logger_1.logger.error(errorMessage1);
            });
        });
    };
    Application.prototype.processPackagePeerDependencies = function (dependencies) {
        logger_1.logger.info('Processing package.json peerDependencies');
        configuration_1.default.mainData.packagePeerDependencies = dependencies;
        if (!configuration_1.default.hasPage('dependencies')) {
            configuration_1.default.addPage({
                name: 'dependencies',
                id: 'packageDependencies',
                context: 'package-dependencies',
                depth: 0,
                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
            });
        }
    };
    Application.prototype.processPackageDependencies = function (dependencies) {
        logger_1.logger.info('Processing package.json dependencies');
        configuration_1.default.mainData.packageDependencies = dependencies;
        configuration_1.default.addPage({
            name: 'dependencies',
            id: 'packageDependencies',
            context: 'package-dependencies',
            depth: 0,
            pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
        });
    };
    Application.prototype.processMarkdowns = function () {
        logger_1.logger.info('Searching README.md, CHANGELOG.md, CONTRIBUTING.md, LICENSE.md, TODO.md files');
        return new Promise(function (resolve, reject) {
            var i = 0;
            var markdowns = ['readme', 'changelog', 'contributing', 'license', 'todo'];
            var numberOfMarkdowns = 5;
            var loop = function () {
                if (i < numberOfMarkdowns) {
                    markdown_engine_1.default.getTraditionalMarkdown(markdowns[i].toUpperCase()).then(function (readmeData) {
                        configuration_1.default.addPage({
                            name: markdowns[i] === 'readme' ? 'index' : markdowns[i],
                            context: 'getting-started',
                            id: 'getting-started',
                            markdown: readmeData,
                            depth: 0,
                            pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
                        });
                        if (markdowns[i] === 'readme') {
                            configuration_1.default.mainData.readme = true;
                            configuration_1.default.addPage({
                                name: 'overview',
                                id: 'overview',
                                context: 'overview',
                                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
                            });
                        }
                        else {
                            configuration_1.default.mainData.markdowns.push({
                                name: markdowns[i],
                                uppername: markdowns[i].toUpperCase(),
                                depth: 0,
                                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
                            });
                        }
                        logger_1.logger.info(markdowns[i].toUpperCase() + ".md file found");
                        i++;
                        loop();
                    }, function (errorMessage) {
                        logger_1.logger.warn(errorMessage);
                        logger_1.logger.warn("Continuing without " + markdowns[i].toUpperCase() + ".md file");
                        if (markdowns[i] === 'readme') {
                            configuration_1.default.addPage({
                                name: 'index',
                                id: 'index',
                                context: 'overview',
                                depth: 0,
                                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
                            });
                        }
                        i++;
                        loop();
                    });
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.rebuildRootMarkdowns = function () {
        var _this = this;
        logger_1.logger.info('Regenerating README.md, CHANGELOG.md, CONTRIBUTING.md, LICENSE.md, TODO.md pages');
        var actions = [];
        configuration_1.default.resetRootMarkdownPages();
        actions.push(function () {
            return _this.processMarkdowns();
        });
        promise_sequential_1.promiseSequential(actions)
            .then(function (res) {
            _this.processPages();
            _this.clearUpdatedFiles();
        })
            .catch(function (errorMessage) {
            logger_1.logger.error(errorMessage);
        });
    };
    /**
     * Get dependency data for small group of updated files during watch process
     */
    Application.prototype.getMicroDependenciesData = function () {
        logger_1.logger.info('Get diff dependencies data');
        var dependenciesClass = angular_dependencies_1.AngularDependencies;
        configuration_1.default.mainData.angularProject = true;
        if (this.detectAngularJSProjects()) {
            logger_1.logger.info('AngularJS project detected');
            configuration_1.default.mainData.angularProject = false;
            configuration_1.default.mainData.angularJSProject = true;
            dependenciesClass = angularjs_dependencies_1.AngularJSDependencies;
        }
        var crawler = new dependenciesClass(this.updatedFiles, {
            tsconfigDirectory: path.dirname(configuration_1.default.mainData.tsconfig)
        }, configuration_1.default, router_parser_util_1.default);
        var dependenciesData = crawler.getDependencies();
        dependencies_engine_1.default.update(dependenciesData);
        this.prepareJustAFewThings(dependenciesData);
    };
    /**
     * Rebuild external documentation during watch process
     */
    Application.prototype.rebuildExternalDocumentation = function () {
        var _this = this;
        logger_1.logger.info('Rebuild external documentation');
        var actions = [];
        configuration_1.default.resetAdditionalPages();
        if (configuration_1.default.mainData.includes !== '') {
            actions.push(function () {
                return _this.prepareExternalIncludes();
            });
        }
        promise_sequential_1.promiseSequential(actions)
            .then(function (res) {
            _this.processPages();
            _this.clearUpdatedFiles();
        })
            .catch(function (errorMessage) {
            logger_1.logger.error(errorMessage);
        });
    };
    Application.prototype.detectAngularJSProjects = function () {
        var result = false;
        if (typeof this.packageJsonData.dependencies !== 'undefined') {
            if (typeof this.packageJsonData.dependencies.angular !== 'undefined') {
                result = true;
            }
            else {
                var countJSFiles_1 = 0;
                this.files.forEach(function (file) {
                    if (path.extname(file) === '.js') {
                        countJSFiles_1 += 1;
                    }
                });
                var percentOfJSFiles = (countJSFiles_1 * 100) / this.files.length;
                if (percentOfJSFiles >= 75) {
                    result = true;
                }
            }
        }
        return false;
    };
    Application.prototype.getDependenciesData = function () {
        logger_1.logger.info('Get dependencies data');
        /**
         * AngularJS detection strategy :
         * - if in package.json
         * - if 75% of scanned files are *.js files
         */
        var dependenciesClass = angular_dependencies_1.AngularDependencies;
        configuration_1.default.mainData.angularProject = true;
        if (this.detectAngularJSProjects()) {
            logger_1.logger.info('AngularJS project detected');
            configuration_1.default.mainData.angularProject = false;
            configuration_1.default.mainData.angularJSProject = true;
            dependenciesClass = angularjs_dependencies_1.AngularJSDependencies;
        }
        var crawler = new dependenciesClass(this.files, {
            tsconfigDirectory: path.dirname(configuration_1.default.mainData.tsconfig)
        }, configuration_1.default, router_parser_util_1.default);
        var dependenciesData = crawler.getDependencies();
        dependencies_engine_1.default.init(dependenciesData);
        configuration_1.default.mainData.routesLength = router_parser_util_1.default.routesLength();
        this.printStatistics();
        this.prepareEverything();
    };
    Application.prototype.prepareJustAFewThings = function (diffCrawledData) {
        var _this = this;
        var actions = [];
        configuration_1.default.resetPages();
        if (!configuration_1.default.mainData.disableRoutesGraph) {
            actions.push(function () { return _this.prepareRoutes(); });
        }
        if (diffCrawledData.components.length > 0) {
            actions.push(function () { return _this.prepareComponents(); });
        }
        if (diffCrawledData.controllers.length > 0) {
            actions.push(function () { return _this.prepareControllers(); });
        }
        if (diffCrawledData.modules.length > 0) {
            actions.push(function () { return _this.prepareModules(); });
        }
        if (diffCrawledData.directives.length > 0) {
            actions.push(function () { return _this.prepareDirectives(); });
        }
        if (diffCrawledData.injectables.length > 0) {
            actions.push(function () { return _this.prepareInjectables(); });
        }
        if (diffCrawledData.interceptors.length > 0) {
            actions.push(function () { return _this.prepareInterceptors(); });
        }
        if (diffCrawledData.guards.length > 0) {
            actions.push(function () { return _this.prepareGuards(); });
        }
        if (diffCrawledData.pipes.length > 0) {
            actions.push(function () { return _this.preparePipes(); });
        }
        if (diffCrawledData.classes.length > 0) {
            actions.push(function () { return _this.prepareClasses(); });
        }
        if (diffCrawledData.interfaces.length > 0) {
            actions.push(function () { return _this.prepareInterfaces(); });
        }
        if (diffCrawledData.miscellaneous.variables.length > 0 ||
            diffCrawledData.miscellaneous.functions.length > 0 ||
            diffCrawledData.miscellaneous.typealiases.length > 0 ||
            diffCrawledData.miscellaneous.enumerations.length > 0) {
            actions.push(function () { return _this.prepareMiscellaneous(); });
        }
        if (!configuration_1.default.mainData.disableCoverage) {
            actions.push(function () { return _this.prepareCoverage(); });
        }
        promise_sequential_1.promiseSequential(actions)
            .then(function (res) {
            _this.processGraphs();
            _this.clearUpdatedFiles();
        })
            .catch(function (errorMessage) {
            logger_1.logger.error(errorMessage);
        });
    };
    Application.prototype.printStatistics = function () {
        logger_1.logger.info('-------------------');
        logger_1.logger.info('Project statistics ');
        if (dependencies_engine_1.default.modules.length > 0) {
            logger_1.logger.info("- files      : " + this.files.length);
        }
        if (dependencies_engine_1.default.modules.length > 0) {
            logger_1.logger.info("- module     : " + dependencies_engine_1.default.modules.length);
        }
        if (dependencies_engine_1.default.components.length > 0) {
            logger_1.logger.info("- component  : " + dependencies_engine_1.default.components.length);
        }
        if (dependencies_engine_1.default.controllers.length > 0) {
            logger_1.logger.info("- controller : " + dependencies_engine_1.default.controllers.length);
        }
        if (dependencies_engine_1.default.directives.length > 0) {
            logger_1.logger.info("- directive  : " + dependencies_engine_1.default.directives.length);
        }
        if (dependencies_engine_1.default.injectables.length > 0) {
            logger_1.logger.info("- injectable : " + dependencies_engine_1.default.injectables.length);
        }
        if (dependencies_engine_1.default.interceptors.length > 0) {
            logger_1.logger.info("- injector   : " + dependencies_engine_1.default.interceptors.length);
        }
        if (dependencies_engine_1.default.guards.length > 0) {
            logger_1.logger.info("- guard      : " + dependencies_engine_1.default.guards.length);
        }
        if (dependencies_engine_1.default.pipes.length > 0) {
            logger_1.logger.info("- pipe       : " + dependencies_engine_1.default.pipes.length);
        }
        if (dependencies_engine_1.default.classes.length > 0) {
            logger_1.logger.info("- class      : " + dependencies_engine_1.default.classes.length);
        }
        if (dependencies_engine_1.default.interfaces.length > 0) {
            logger_1.logger.info("- interface  : " + dependencies_engine_1.default.interfaces.length);
        }
        if (configuration_1.default.mainData.routesLength > 0) {
            logger_1.logger.info("- route      : " + configuration_1.default.mainData.routesLength);
        }
        logger_1.logger.info('-------------------');
    };
    Application.prototype.prepareEverything = function () {
        var _this = this;
        var actions = [];
        actions.push(function () {
            return _this.prepareComponents();
        });
        actions.push(function () {
            return _this.prepareModules();
        });
        if (dependencies_engine_1.default.directives.length > 0) {
            actions.push(function () {
                return _this.prepareDirectives();
            });
        }
        if (dependencies_engine_1.default.controllers.length > 0) {
            actions.push(function () {
                return _this.prepareControllers();
            });
        }
        if (dependencies_engine_1.default.injectables.length > 0) {
            actions.push(function () {
                return _this.prepareInjectables();
            });
        }
        if (dependencies_engine_1.default.interceptors.length > 0) {
            actions.push(function () {
                return _this.prepareInterceptors();
            });
        }
        if (dependencies_engine_1.default.guards.length > 0) {
            actions.push(function () {
                return _this.prepareGuards();
            });
        }
        if (dependencies_engine_1.default.routes &&
            dependencies_engine_1.default.routes.children.length > 0 &&
            !configuration_1.default.mainData.disableRoutesGraph) {
            actions.push(function () {
                return _this.prepareRoutes();
            });
        }
        if (dependencies_engine_1.default.pipes.length > 0) {
            actions.push(function () {
                return _this.preparePipes();
            });
        }
        if (dependencies_engine_1.default.classes.length > 0) {
            actions.push(function () {
                return _this.prepareClasses();
            });
        }
        if (dependencies_engine_1.default.interfaces.length > 0) {
            actions.push(function () {
                return _this.prepareInterfaces();
            });
        }
        if (dependencies_engine_1.default.miscellaneous.variables.length > 0 ||
            dependencies_engine_1.default.miscellaneous.functions.length > 0 ||
            dependencies_engine_1.default.miscellaneous.typealiases.length > 0 ||
            dependencies_engine_1.default.miscellaneous.enumerations.length > 0) {
            actions.push(function () {
                return _this.prepareMiscellaneous();
            });
        }
        if (!configuration_1.default.mainData.disableCoverage) {
            actions.push(function () {
                return _this.prepareCoverage();
            });
        }
        if (configuration_1.default.mainData.unitTestCoverage !== '') {
            actions.push(function () {
                return _this.prepareUnitTestCoverage();
            });
        }
        if (configuration_1.default.mainData.includes !== '') {
            actions.push(function () {
                return _this.prepareExternalIncludes();
            });
        }
        promise_sequential_1.promiseSequential(actions)
            .then(function (res) {
            if (configuration_1.default.mainData.exportFormat !== defaults_1.COMPODOC_DEFAULTS.exportFormat) {
                if (defaults_1.COMPODOC_DEFAULTS.exportFormatsSupported.indexOf(configuration_1.default.mainData.exportFormat) > -1) {
                    logger_1.logger.info("Generating documentation in export format " + configuration_1.default.mainData.exportFormat);
                    export_engine_1.default.export(configuration_1.default.mainData.output, configuration_1.default.mainData).then(function () {
                        generationPromiseResolve();
                        _this.endCallback();
                        logger_1.logger.info('Documentation generated in ' +
                            configuration_1.default.mainData.output +
                            ' in ' +
                            _this.getElapsedTime() +
                            ' seconds');
                    });
                }
                else {
                    logger_1.logger.warn("Exported format not supported");
                }
            }
            else {
                _this.processGraphs();
            }
        })
            .catch(function (errorMessage) {
            logger_1.logger.error(errorMessage);
        });
    };
    Application.prototype.getIncludedPathForFile = function (file) {
        return path.join(configuration_1.default.mainData.includes, file);
    };
    Application.prototype.prepareExternalIncludes = function () {
        var _this = this;
        logger_1.logger.info('Adding external markdown files');
        // Scan include folder for files detailed in summary.json
        // For each file, add to Configuration.mainData.additionalPages
        // Each file will be converted to html page, inside COMPODOC_DEFAULTS.additionalEntryPath
        return new Promise(function (resolve, reject) {
            file_engine_1.default.get(_this.getIncludedPathForFile('summary.json')).then(function (summaryData) {
                logger_1.logger.info('Additional documentation: summary.json file found');
                var parsedSummaryData = JSON.parse(summaryData);
                var that = _this;
                var lastLevelOnePage = undefined;
                traverse(parsedSummaryData).forEach(function () {
                    // tslint:disable-next-line:no-invalid-this
                    if (this.notRoot && typeof this.node === 'object') {
                        // tslint:disable-next-line:no-invalid-this
                        var rawPath = this.path;
                        // tslint:disable-next-line:no-invalid-this
                        var additionalNode = this.node;
                        var file = additionalNode.file;
                        var title = additionalNode.title;
                        var finalPath_1 = configuration_1.default.mainData.includesFolder;
                        var finalDepth = rawPath.filter(function (el) {
                            return !isNaN(parseInt(el, 10));
                        });
                        if (typeof file !== 'undefined' && typeof title !== 'undefined') {
                            var url = utils_1.cleanNameWithoutSpaceAndToLowerCase(title);
                            /**
                             * Id created with title + file path hash, seems to be hypothetically unique here
                             */
                            var id = crypto
                                .createHash('md5')
                                .update(title + file)
                                .digest('hex');
                            // tslint:disable-next-line:no-invalid-this
                            this.node.id = id;
                            var lastElementRootTree_1 = undefined;
                            finalDepth.forEach(function (el) {
                                var elementTree = typeof lastElementRootTree_1 === 'undefined'
                                    ? parsedSummaryData
                                    : lastElementRootTree_1;
                                if (typeof elementTree.children !== 'undefined') {
                                    elementTree = elementTree.children[el];
                                }
                                else {
                                    elementTree = elementTree[el];
                                }
                                finalPath_1 +=
                                    '/' +
                                        utils_1.cleanNameWithoutSpaceAndToLowerCase(elementTree.title);
                                lastElementRootTree_1 = elementTree;
                            });
                            finalPath_1 = finalPath_1.replace('/' + url, '');
                            var markdownFile = markdown_engine_1.default.getTraditionalMarkdownSync(that.getIncludedPathForFile(file));
                            if (finalDepth.length > 5) {
                                logger_1.logger.error('Only 5 levels of depth are supported');
                            }
                            else {
                                var _page = {
                                    name: title,
                                    id: id,
                                    filename: url,
                                    context: 'additional-page',
                                    path: finalPath_1,
                                    additionalPage: markdownFile,
                                    depth: finalDepth.length,
                                    childrenLength: additionalNode.children
                                        ? additionalNode.children.length
                                        : 0,
                                    children: [],
                                    lastChild: false,
                                    pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                                };
                                if (finalDepth.length === 1) {
                                    lastLevelOnePage = _page;
                                }
                                if (finalDepth.length > 1) {
                                    // store all child pages of the last root level 1 page inside it
                                    lastLevelOnePage.children.push(_page);
                                }
                                else {
                                    configuration_1.default.addAdditionalPage(_page);
                                }
                            }
                        }
                    }
                });
                resolve();
            }, function (errorMessage) {
                logger_1.logger.error(errorMessage);
                reject('Error during Additional documentation generation');
            });
        });
    };
    Application.prototype.prepareModules = function (someModules) {
        var _this = this;
        logger_1.logger.info('Prepare modules');
        var i = 0;
        var _modules = someModules ? someModules : dependencies_engine_1.default.getModules();
        return new Promise(function (resolve, reject) {
            configuration_1.default.mainData.modules = _modules.map(function (ngModule) {
                ngModule.compodocLinks = {
                    components: [],
                    controllers: [],
                    directives: [],
                    injectables: [],
                    pipes: []
                };
                ['declarations', 'bootstrap', 'imports', 'exports', 'controllers'].forEach(function (metadataType) {
                    ngModule[metadataType] = ngModule[metadataType].filter(function (metaDataItem) {
                        switch (metaDataItem.type) {
                            case 'directive':
                                return dependencies_engine_1.default.getDirectives().some(function (directive) {
                                    var selectedDirective;
                                    if (typeof metaDataItem.id !== 'undefined') {
                                        selectedDirective =
                                            directive.id === metaDataItem.id;
                                    }
                                    else {
                                        selectedDirective =
                                            directive.name === metaDataItem.name;
                                    }
                                    if (selectedDirective &&
                                        !ngModule.compodocLinks.directives.includes(directive)) {
                                        ngModule.compodocLinks.directives.push(directive);
                                    }
                                    return selectedDirective;
                                });
                            case 'component':
                                return dependencies_engine_1.default.getComponents().some(function (component) {
                                    var selectedComponent;
                                    if (typeof metaDataItem.id !== 'undefined') {
                                        selectedComponent =
                                            component.id === metaDataItem.id;
                                    }
                                    else {
                                        selectedComponent =
                                            component.name === metaDataItem.name;
                                    }
                                    if (selectedComponent &&
                                        !ngModule.compodocLinks.components.includes(component)) {
                                        ngModule.compodocLinks.components.push(component);
                                    }
                                    return selectedComponent;
                                });
                            case 'controller':
                                return dependencies_engine_1.default.getControllers().some(function (controller) {
                                    var selectedController;
                                    if (typeof metaDataItem.id !== 'undefined') {
                                        selectedController =
                                            controller.id === metaDataItem.id;
                                    }
                                    else {
                                        selectedController =
                                            controller.name === metaDataItem.name;
                                    }
                                    if (selectedController &&
                                        !ngModule.compodocLinks.controllers.includes(controller)) {
                                        ngModule.compodocLinks.controllers.push(controller);
                                    }
                                    return selectedController;
                                });
                            case 'module':
                                return dependencies_engine_1.default.getModules().some(function (module) { return module.name === metaDataItem.name; });
                            case 'pipe':
                                return dependencies_engine_1.default.getPipes().some(function (pipe) {
                                    var selectedPipe;
                                    if (typeof metaDataItem.id !== 'undefined') {
                                        selectedPipe = pipe.id === metaDataItem.id;
                                    }
                                    else {
                                        selectedPipe = pipe.name === metaDataItem.name;
                                    }
                                    if (selectedPipe &&
                                        !ngModule.compodocLinks.pipes.includes(pipe)) {
                                        ngModule.compodocLinks.pipes.push(pipe);
                                    }
                                    return selectedPipe;
                                });
                            default:
                                return true;
                        }
                    });
                });
                ngModule.providers = ngModule.providers.filter(function (provider) {
                    return (dependencies_engine_1.default.getInjectables().some(function (injectable) {
                        var selectedInjectable = injectable.name === provider.name;
                        if (selectedInjectable &&
                            !ngModule.compodocLinks.injectables.includes(injectable)) {
                            ngModule.compodocLinks.injectables.push(injectable);
                        }
                        return selectedInjectable;
                    }) ||
                        dependencies_engine_1.default.getInterceptors().some(function (interceptor) { return interceptor.name === provider.name; }));
                });
                // Try fixing type undefined for each providers
                _.forEach(ngModule.providers, function (provider) {
                    if (dependencies_engine_1.default.getInjectables().find(function (injectable) { return injectable.name === provider.name; })) {
                        provider.type = 'injectable';
                    }
                    if (dependencies_engine_1.default.getInterceptors().find(function (interceptor) { return interceptor.name === provider.name; })) {
                        provider.type = 'interceptor';
                    }
                });
                // Order things
                ngModule.compodocLinks.components = _.sortBy(ngModule.compodocLinks.components, [
                    'name'
                ]);
                ngModule.compodocLinks.controllers = _.sortBy(ngModule.compodocLinks.controllers, [
                    'name'
                ]);
                ngModule.compodocLinks.directives = _.sortBy(ngModule.compodocLinks.directives, [
                    'name'
                ]);
                ngModule.compodocLinks.injectables = _.sortBy(ngModule.compodocLinks.injectables, [
                    'name'
                ]);
                ngModule.compodocLinks.pipes = _.sortBy(ngModule.compodocLinks.pipes, ['name']);
                ngModule.declarations = _.sortBy(ngModule.declarations, ['name']);
                ngModule.entryComponents = _.sortBy(ngModule.entryComponents, ['name']);
                ngModule.providers = _.sortBy(ngModule.providers, ['name']);
                ngModule.imports = _.sortBy(ngModule.imports, ['name']);
                ngModule.exports = _.sortBy(ngModule.exports, ['name']);
                return ngModule;
            });
            configuration_1.default.addPage({
                name: 'modules',
                id: 'modules',
                context: 'modules',
                depth: 0,
                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
            });
            var len = configuration_1.default.mainData.modules.length;
            var loop = function () {
                if (i < len) {
                    if (markdown_engine_1.default.hasNeighbourReadmeFile(configuration_1.default.mainData.modules[i].file)) {
                        logger_1.logger.info(" " + configuration_1.default.mainData.modules[i].name + " has a README file, include it");
                        var readme = markdown_engine_1.default.readNeighbourReadmeFile(configuration_1.default.mainData.modules[i].file);
                        configuration_1.default.mainData.modules[i].readme = marked(readme);
                    }
                    configuration_1.default.addPage({
                        path: 'modules',
                        name: configuration_1.default.mainData.modules[i].name,
                        id: configuration_1.default.mainData.modules[i].id,
                        navTabs: _this.getNavTabs(configuration_1.default.mainData.modules[i]),
                        context: 'module',
                        module: configuration_1.default.mainData.modules[i],
                        depth: 1,
                        pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    });
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareInterfaces = function (someInterfaces) {
        var _this = this;
        logger_1.logger.info('Prepare interfaces');
        configuration_1.default.mainData.interfaces = someInterfaces
            ? someInterfaces
            : dependencies_engine_1.default.getInterfaces();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = configuration_1.default.mainData.interfaces.length;
            var loop = function () {
                if (i < len) {
                    var interf = configuration_1.default.mainData.interfaces[i];
                    if (markdown_engine_1.default.hasNeighbourReadmeFile(interf.file)) {
                        logger_1.logger.info(" " + interf.name + " has a README file, include it");
                        var readme = markdown_engine_1.default.readNeighbourReadmeFile(interf.file);
                        interf.readme = marked(readme);
                    }
                    var page = {
                        path: 'interfaces',
                        name: interf.name,
                        id: interf.id,
                        navTabs: _this.getNavTabs(interf),
                        context: 'interface',
                        interface: interf,
                        depth: 1,
                        pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (interf.isDuplicate) {
                        page.name += '-' + interf.duplicateId;
                    }
                    configuration_1.default.addPage(page);
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareMiscellaneous = function (someMisc) {
        logger_1.logger.info('Prepare miscellaneous');
        configuration_1.default.mainData.miscellaneous = someMisc
            ? someMisc
            : dependencies_engine_1.default.getMiscellaneous();
        return new Promise(function (resolve, reject) {
            if (configuration_1.default.mainData.miscellaneous.functions.length > 0) {
                configuration_1.default.addPage({
                    path: 'miscellaneous',
                    name: 'functions',
                    id: 'miscellaneous-functions',
                    context: 'miscellaneous-functions',
                    depth: 1,
                    pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                });
            }
            if (configuration_1.default.mainData.miscellaneous.variables.length > 0) {
                configuration_1.default.addPage({
                    path: 'miscellaneous',
                    name: 'variables',
                    id: 'miscellaneous-variables',
                    context: 'miscellaneous-variables',
                    depth: 1,
                    pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                });
            }
            if (configuration_1.default.mainData.miscellaneous.typealiases.length > 0) {
                configuration_1.default.addPage({
                    path: 'miscellaneous',
                    name: 'typealiases',
                    id: 'miscellaneous-typealiases',
                    context: 'miscellaneous-typealiases',
                    depth: 1,
                    pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                });
            }
            if (configuration_1.default.mainData.miscellaneous.enumerations.length > 0) {
                configuration_1.default.addPage({
                    path: 'miscellaneous',
                    name: 'enumerations',
                    id: 'miscellaneous-enumerations',
                    context: 'miscellaneous-enumerations',
                    depth: 1,
                    pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                });
            }
            resolve();
        });
    };
    Application.prototype.handleTemplateurl = function (component) {
        var dirname = path.dirname(component.file);
        var templatePath = path.resolve(dirname + path.sep + component.templateUrl);
        if (!file_engine_1.default.existsSync(templatePath)) {
            var err = "Cannot read template for " + component.name;
            logger_1.logger.error(err);
            return new Promise(function (resolve, reject) { });
        }
        return file_engine_1.default.get(templatePath).then(function (data) { return (component.templateData = data); }, function (err) {
            logger_1.logger.error(err);
            return Promise.reject('');
        });
    };
    Application.prototype.handleStyles = function (component) {
        var styles = component.styles;
        component.stylesData = '';
        return new Promise(function (resolveStyles, rejectStyles) {
            styles.forEach(function (style) {
                component.stylesData = component.stylesData + style + '\n';
            });
            resolveStyles();
        });
    };
    Application.prototype.handleStyleurls = function (component) {
        var dirname = path.dirname(component.file);
        var styleDataPromise = component.styleUrls.map(function (styleUrl) {
            var stylePath = path.resolve(dirname + path.sep + styleUrl);
            if (!file_engine_1.default.existsSync(stylePath)) {
                var err = "Cannot read style url " + stylePath + " for " + component.name;
                logger_1.logger.error(err);
                return new Promise(function (resolve, reject) { });
            }
            return new Promise(function (resolve, reject) {
                file_engine_1.default.get(stylePath).then(function (data) {
                    resolve({
                        data: data,
                        styleUrl: styleUrl
                    });
                });
            });
        });
        return Promise.all(styleDataPromise).then(function (data) { return (component.styleUrlsData = data); }, function (err) {
            logger_1.logger.error(err);
            return Promise.reject('');
        });
    };
    Application.prototype.getNavTabs = function (dependency) {
        var navTabConfig = configuration_1.default.mainData.navTabConfig;
        navTabConfig =
            navTabConfig.length === 0
                ? _.cloneDeep(constants_1.COMPODOC_CONSTANTS.navTabDefinitions)
                : navTabConfig;
        var matchDepType = function (depType) {
            return depType === 'all' || depType === dependency.type;
        };
        var navTabs = [];
        _.forEach(navTabConfig, function (customTab) {
            var navTab = _.find(constants_1.COMPODOC_CONSTANTS.navTabDefinitions, { id: customTab.id });
            if (!navTab) {
                throw new Error("Invalid tab ID '" + customTab.id + "' specified in tab configuration");
            }
            navTab.label = customTab.label;
            // is tab applicable to target dependency?
            if (-1 === _.findIndex(navTab.depTypes, matchDepType)) {
                return;
            }
            // global config
            if (customTab.id === 'tree' && configuration_1.default.mainData.disableDomTree) {
                return;
            }
            if (customTab.id === 'source' && configuration_1.default.mainData.disableSourceCode) {
                return;
            }
            if (customTab.id === 'templateData' && configuration_1.default.mainData.disableTemplateTab) {
                return;
            }
            if (customTab.id === 'styleData' && configuration_1.default.mainData.disableStyleTab) {
                return;
            }
            // per dependency config
            if (customTab.id === 'readme' && !dependency.readme) {
                return;
            }
            if (customTab.id === 'example' && !dependency.exampleUrls) {
                return;
            }
            if (customTab.id === 'templateData' &&
                (!dependency.templateUrl || dependency.templateUrl.length === 0)) {
                return;
            }
            if (customTab.id === 'styleData' &&
                ((!dependency.styleUrls || dependency.styleUrls.length === 0) &&
                    (!dependency.styles || dependency.styles.length === 0))) {
                return;
            }
            navTabs.push(navTab);
        });
        if (navTabs.length === 0) {
            throw new Error("No valid navigation tabs have been defined for dependency type '" + dependency.type + "'. Specify at least one config for the 'info' or 'source' tab in --navTabConfig.");
        }
        return navTabs;
    };
    Application.prototype.prepareControllers = function (someControllers) {
        var _this = this;
        logger_1.logger.info('Prepare controllers');
        configuration_1.default.mainData.controllers = someControllers
            ? someControllers
            : dependencies_engine_1.default.getControllers();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = configuration_1.default.mainData.controllers.length;
            var loop = function () {
                if (i < len) {
                    var controller = configuration_1.default.mainData.controllers[i];
                    var page = {
                        path: 'controllers',
                        name: controller.name,
                        id: controller.id,
                        navTabs: _this.getNavTabs(controller),
                        context: 'controller',
                        controller: controller,
                        depth: 1,
                        pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (controller.isDuplicate) {
                        page.name += '-' + controller.duplicateId;
                    }
                    configuration_1.default.addPage(page);
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareComponents = function (someComponents) {
        var _this = this;
        logger_1.logger.info('Prepare components');
        configuration_1.default.mainData.components = someComponents
            ? someComponents
            : dependencies_engine_1.default.getComponents();
        return new Promise(function (mainPrepareComponentResolve, mainPrepareComponentReject) {
            var i = 0;
            var len = configuration_1.default.mainData.components.length;
            var loop = function () {
                if (i <= len - 1) {
                    var component_1 = configuration_1.default.mainData.components[i];
                    if (markdown_engine_1.default.hasNeighbourReadmeFile(component_1.file)) {
                        logger_1.logger.info(" " + component_1.name + " has a README file, include it");
                        var readmeFile = markdown_engine_1.default.readNeighbourReadmeFile(component_1.file);
                        component_1.readme = marked(readmeFile);
                    }
                    var page = {
                        path: 'components',
                        name: component_1.name,
                        id: component_1.id,
                        navTabs: _this.getNavTabs(component_1),
                        context: 'component',
                        component: component_1,
                        depth: 1,
                        pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (component_1.isDuplicate) {
                        page.name += '-' + component_1.duplicateId;
                    }
                    configuration_1.default.addPage(page);
                    var componentTemplateUrlPromise = new Promise(function (componentTemplateUrlResolve, componentTemplateUrlReject) {
                        if (component_1.templateUrl.length > 0) {
                            logger_1.logger.info(" " + component_1.name + " has a templateUrl, include it");
                            _this.handleTemplateurl(component_1).then(function () {
                                componentTemplateUrlResolve();
                            }, function (e) {
                                logger_1.logger.error(e);
                                componentTemplateUrlReject();
                            });
                        }
                        else {
                            componentTemplateUrlResolve();
                        }
                    });
                    var componentStyleUrlsPromise = new Promise(function (componentStyleUrlsResolve, componentStyleUrlsReject) {
                        if (component_1.styleUrls.length > 0) {
                            logger_1.logger.info(" " + component_1.name + " has styleUrls, include them");
                            _this.handleStyleurls(component_1).then(function () {
                                componentStyleUrlsResolve();
                            }, function (e) {
                                logger_1.logger.error(e);
                                componentStyleUrlsReject();
                            });
                        }
                        else {
                            componentStyleUrlsResolve();
                        }
                    });
                    var componentStylesPromise = new Promise(function (componentStylesResolve, componentStylesReject) {
                        if (component_1.styles.length > 0) {
                            logger_1.logger.info(" " + component_1.name + " has styles, include them");
                            _this.handleStyles(component_1).then(function () {
                                componentStylesResolve();
                            }, function (e) {
                                logger_1.logger.error(e);
                                componentStylesReject();
                            });
                        }
                        else {
                            componentStylesResolve();
                        }
                    });
                    Promise.all([
                        componentTemplateUrlPromise,
                        componentStyleUrlsPromise,
                        componentStylesPromise
                    ]).then(function () {
                        i++;
                        loop();
                    });
                }
                else {
                    mainPrepareComponentResolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareDirectives = function (someDirectives) {
        var _this = this;
        logger_1.logger.info('Prepare directives');
        configuration_1.default.mainData.directives = someDirectives
            ? someDirectives
            : dependencies_engine_1.default.getDirectives();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = configuration_1.default.mainData.directives.length;
            var loop = function () {
                if (i < len) {
                    var directive = configuration_1.default.mainData.directives[i];
                    if (markdown_engine_1.default.hasNeighbourReadmeFile(directive.file)) {
                        logger_1.logger.info(" " + directive.name + " has a README file, include it");
                        var readme = markdown_engine_1.default.readNeighbourReadmeFile(directive.file);
                        directive.readme = marked(readme);
                    }
                    var page = {
                        path: 'directives',
                        name: directive.name,
                        id: directive.id,
                        navTabs: _this.getNavTabs(directive),
                        context: 'directive',
                        directive: directive,
                        depth: 1,
                        pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (directive.isDuplicate) {
                        page.name += '-' + directive.duplicateId;
                    }
                    configuration_1.default.addPage(page);
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareInjectables = function (someInjectables) {
        var _this = this;
        logger_1.logger.info('Prepare injectables');
        configuration_1.default.mainData.injectables = someInjectables
            ? someInjectables
            : dependencies_engine_1.default.getInjectables();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = configuration_1.default.mainData.injectables.length;
            var loop = function () {
                if (i < len) {
                    var injec = configuration_1.default.mainData.injectables[i];
                    if (markdown_engine_1.default.hasNeighbourReadmeFile(injec.file)) {
                        logger_1.logger.info(" " + injec.name + " has a README file, include it");
                        var readme = markdown_engine_1.default.readNeighbourReadmeFile(injec.file);
                        injec.readme = marked(readme);
                    }
                    var page = {
                        path: 'injectables',
                        name: injec.name,
                        id: injec.id,
                        navTabs: _this.getNavTabs(injec),
                        context: 'injectable',
                        injectable: injec,
                        depth: 1,
                        pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (injec.isDuplicate) {
                        page.name += '-' + injec.duplicateId;
                    }
                    configuration_1.default.addPage(page);
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareInterceptors = function (someInterceptors) {
        var _this = this;
        logger_1.logger.info('Prepare interceptors');
        configuration_1.default.mainData.interceptors = someInterceptors
            ? someInterceptors
            : dependencies_engine_1.default.getInterceptors();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = configuration_1.default.mainData.interceptors.length;
            var loop = function () {
                if (i < len) {
                    var interceptor = configuration_1.default.mainData.interceptors[i];
                    if (markdown_engine_1.default.hasNeighbourReadmeFile(interceptor.file)) {
                        logger_1.logger.info(" " + interceptor.name + " has a README file, include it");
                        var readme = markdown_engine_1.default.readNeighbourReadmeFile(interceptor.file);
                        interceptor.readme = marked(readme);
                    }
                    var page = {
                        path: 'interceptors',
                        name: interceptor.name,
                        id: interceptor.id,
                        navTabs: _this.getNavTabs(interceptor),
                        context: 'interceptor',
                        injectable: interceptor,
                        depth: 1,
                        pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (interceptor.isDuplicate) {
                        page.name += '-' + interceptor.duplicateId;
                    }
                    configuration_1.default.addPage(page);
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareGuards = function (someGuards) {
        var _this = this;
        logger_1.logger.info('Prepare guards');
        configuration_1.default.mainData.guards = someGuards ? someGuards : dependencies_engine_1.default.getGuards();
        return new Promise(function (resolve, reject) {
            var i = 0;
            var len = configuration_1.default.mainData.guards.length;
            var loop = function () {
                if (i < len) {
                    var guard = configuration_1.default.mainData.guards[i];
                    if (markdown_engine_1.default.hasNeighbourReadmeFile(guard.file)) {
                        logger_1.logger.info(" " + guard.name + " has a README file, include it");
                        var readme = markdown_engine_1.default.readNeighbourReadmeFile(guard.file);
                        guard.readme = marked(readme);
                    }
                    var page = {
                        path: 'guards',
                        name: guard.name,
                        id: guard.id,
                        navTabs: _this.getNavTabs(guard),
                        context: 'guard',
                        injectable: guard,
                        depth: 1,
                        pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.INTERNAL
                    };
                    if (guard.isDuplicate) {
                        page.name += '-' + guard.duplicateId;
                    }
                    configuration_1.default.addPage(page);
                    i++;
                    loop();
                }
                else {
                    resolve();
                }
            };
            loop();
        });
    };
    Application.prototype.prepareRoutes = function () {
        logger_1.logger.info('Process routes');
        configuration_1.default.mainData.routes = dependencies_engine_1.default.getRoutes();
        return new Promise(function (resolve, reject) {
            configuration_1.default.addPage({
                name: 'routes',
                id: 'routes',
                context: 'routes',
                depth: 0,
                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
            });
            if (configuration_1.default.mainData.exportFormat === defaults_1.COMPODOC_DEFAULTS.exportFormat) {
                router_parser_util_1.default.generateRoutesIndex(configuration_1.default.mainData.output, configuration_1.default.mainData.routes).then(function () {
                    logger_1.logger.info(' Routes index generated');
                    resolve();
                }, function (e) {
                    logger_1.logger.error(e);
                    reject();
                });
            }
            else {
                resolve();
            }
        });
    };
    Application.prototype.prepareCoverage = function () {
        logger_1.logger.info('Process documentation coverage report');
        return new Promise(function (resolve, reject) {
            /*
             * loop with components, directives, controllers, classes, injectables, interfaces, pipes, guards, misc functions variables
             */
            var files = [];
            var totalProjectStatementDocumented = 0;
            var getStatus = function (percent) {
                var status;
                if (percent <= 25) {
                    status = 'low';
                }
                else if (percent > 25 && percent <= 50) {
                    status = 'medium';
                }
                else if (percent > 50 && percent <= 75) {
                    status = 'good';
                }
                else {
                    status = 'very-good';
                }
                return status;
            };
            var processComponentsAndDirectivesAndControllers = function (list) {
                _.forEach(list, function (el) {
                    var element = Object.assign({}, el);
                    if (!element.propertiesClass) {
                        element.propertiesClass = [];
                    }
                    if (!element.methodsClass) {
                        element.methodsClass = [];
                    }
                    if (!element.hostBindings) {
                        element.hostBindings = [];
                    }
                    if (!element.hostListeners) {
                        element.hostListeners = [];
                    }
                    if (!element.inputsClass) {
                        element.inputsClass = [];
                    }
                    if (!element.outputsClass) {
                        element.outputsClass = [];
                    }
                    var cl = {
                        filePath: element.file,
                        type: element.type,
                        linktype: element.type,
                        name: element.name
                    };
                    var totalStatementDocumented = 0;
                    var totalStatements = element.propertiesClass.length +
                        element.methodsClass.length +
                        element.inputsClass.length +
                        element.hostBindings.length +
                        element.hostListeners.length +
                        element.outputsClass.length +
                        1; // +1 for element decorator comment
                    if (element.constructorObj) {
                        totalStatements += 1;
                        if (element.constructorObj &&
                            element.constructorObj.description &&
                            element.constructorObj.description !== '') {
                            totalStatementDocumented += 1;
                        }
                    }
                    if (element.description && element.description !== '') {
                        totalStatementDocumented += 1;
                    }
                    _.forEach(element.propertiesClass, function (property) {
                        if (property.modifierKind === ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (property.description &&
                            property.description !== '' &&
                            property.modifierKind !== ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    _.forEach(element.methodsClass, function (method) {
                        if (method.modifierKind === ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (method.description &&
                            method.description !== '' &&
                            method.modifierKind !== ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    _.forEach(element.hostBindings, function (property) {
                        if (property.modifierKind === ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (property.description &&
                            property.description !== '' &&
                            property.modifierKind !== ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    _.forEach(element.hostListeners, function (method) {
                        if (method.modifierKind === ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (method.description &&
                            method.description !== '' &&
                            method.modifierKind !== ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    _.forEach(element.inputsClass, function (input) {
                        if (input.modifierKind === ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (input.description &&
                            input.description !== '' &&
                            input.modifierKind !== ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    _.forEach(element.outputsClass, function (output) {
                        if (output.modifierKind === ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (output.description &&
                            output.description !== '' &&
                            output.modifierKind !== ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    cl.coveragePercent = Math.floor((totalStatementDocumented / totalStatements) * 100);
                    if (totalStatements === 0) {
                        cl.coveragePercent = 0;
                    }
                    cl.coverageCount = totalStatementDocumented + '/' + totalStatements;
                    cl.status = getStatus(cl.coveragePercent);
                    totalProjectStatementDocumented += cl.coveragePercent;
                    files.push(cl);
                });
            };
            var processCoveragePerFile = function () {
                logger_1.logger.info('Process documentation coverage per file');
                logger_1.logger.info('-------------------');
                var overFiles = files.filter(function (f) {
                    var overTest = f.coveragePercent >= configuration_1.default.mainData.coverageMinimumPerFile;
                    if (overTest && !configuration_1.default.mainData.coverageTestShowOnlyFailed) {
                        logger_1.logger.info(f.coveragePercent + " % for file " + f.filePath + " - " + f.name + " - over minimum per file");
                    }
                    return overTest;
                });
                var underFiles = files.filter(function (f) {
                    var underTest = f.coveragePercent < configuration_1.default.mainData.coverageMinimumPerFile;
                    if (underTest) {
                        logger_1.logger.error(f.coveragePercent + " % for file " + f.filePath + " - " + f.name + " - under minimum per file");
                    }
                    return underTest;
                });
                logger_1.logger.info('-------------------');
                return {
                    overFiles: overFiles,
                    underFiles: underFiles
                };
            };
            var processFunctionsAndVariables = function (id, type) {
                _.forEach(id, function (el) {
                    var cl = {
                        filePath: el.file,
                        type: type,
                        linktype: el.type,
                        linksubtype: el.subtype,
                        name: el.name
                    };
                    if (type === 'variable') {
                        cl.linktype = 'miscellaneous';
                    }
                    var totalStatementDocumented = 0;
                    var totalStatements = 1;
                    if (el.modifierKind === ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                        // Doesn't handle private for coverage
                        totalStatements -= 1;
                    }
                    if (el.description &&
                        el.description !== '' &&
                        el.modifierKind !== ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                        totalStatementDocumented += 1;
                    }
                    cl.coveragePercent = Math.floor((totalStatementDocumented / totalStatements) * 100);
                    cl.coverageCount = totalStatementDocumented + '/' + totalStatements;
                    cl.status = getStatus(cl.coveragePercent);
                    totalProjectStatementDocumented += cl.coveragePercent;
                    files.push(cl);
                });
            };
            var processClasses = function (list, type, linktype) {
                _.forEach(list, function (cl) {
                    var element = Object.assign({}, cl);
                    if (!element.properties) {
                        element.properties = [];
                    }
                    if (!element.methods) {
                        element.methods = [];
                    }
                    var cla = {
                        filePath: element.file,
                        type: type,
                        linktype: linktype,
                        name: element.name
                    };
                    var totalStatementDocumented = 0;
                    var totalStatements = element.properties.length + element.methods.length + 1; // +1 for element itself
                    if (element.constructorObj) {
                        totalStatements += 1;
                        if (element.constructorObj &&
                            element.constructorObj.description &&
                            element.constructorObj.description !== '') {
                            totalStatementDocumented += 1;
                        }
                    }
                    if (element.description && element.description !== '') {
                        totalStatementDocumented += 1;
                    }
                    _.forEach(element.properties, function (property) {
                        if (property.modifierKind === ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (property.description &&
                            property.description !== '' &&
                            property.modifierKind !== ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    _.forEach(element.methods, function (method) {
                        if (method.modifierKind === ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            // Doesn't handle private for coverage
                            totalStatements -= 1;
                        }
                        if (method.description &&
                            method.description !== '' &&
                            method.modifierKind !== ts_simple_ast_1.SyntaxKind.PrivateKeyword) {
                            totalStatementDocumented += 1;
                        }
                    });
                    cla.coveragePercent = Math.floor((totalStatementDocumented / totalStatements) * 100);
                    if (totalStatements === 0) {
                        cla.coveragePercent = 0;
                    }
                    cla.coverageCount = totalStatementDocumented + '/' + totalStatements;
                    cla.status = getStatus(cla.coveragePercent);
                    totalProjectStatementDocumented += cla.coveragePercent;
                    files.push(cla);
                });
            };
            processComponentsAndDirectivesAndControllers(configuration_1.default.mainData.components);
            processComponentsAndDirectivesAndControllers(configuration_1.default.mainData.directives);
            processComponentsAndDirectivesAndControllers(configuration_1.default.mainData.controllers);
            processClasses(configuration_1.default.mainData.classes, 'class', 'classe');
            processClasses(configuration_1.default.mainData.injectables, 'injectable', 'injectable');
            processClasses(configuration_1.default.mainData.interfaces, 'interface', 'interface');
            processClasses(configuration_1.default.mainData.guards, 'guard', 'guard');
            processClasses(configuration_1.default.mainData.interceptors, 'interceptor', 'interceptor');
            _.forEach(configuration_1.default.mainData.pipes, function (pipe) {
                var cl = {
                    filePath: pipe.file,
                    type: pipe.type,
                    linktype: pipe.type,
                    name: pipe.name
                };
                var totalStatementDocumented = 0;
                var totalStatements = 1;
                if (pipe.description && pipe.description !== '') {
                    totalStatementDocumented += 1;
                }
                cl.coveragePercent = Math.floor((totalStatementDocumented / totalStatements) * 100);
                cl.coverageCount = totalStatementDocumented + '/' + totalStatements;
                cl.status = getStatus(cl.coveragePercent);
                totalProjectStatementDocumented += cl.coveragePercent;
                files.push(cl);
            });
            processFunctionsAndVariables(configuration_1.default.mainData.miscellaneous.functions, 'function');
            processFunctionsAndVariables(configuration_1.default.mainData.miscellaneous.variables, 'variable');
            files = _.sortBy(files, ['filePath']);
            var coverageData = {
                count: files.length > 0
                    ? Math.floor(totalProjectStatementDocumented / files.length)
                    : 0,
                status: '',
                files: files
            };
            coverageData.status = getStatus(coverageData.count);
            configuration_1.default.addPage({
                name: 'coverage',
                id: 'coverage',
                context: 'coverage',
                files: files,
                data: coverageData,
                depth: 0,
                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
            });
            coverageData.files = files;
            configuration_1.default.mainData.coverageData = coverageData;
            if (configuration_1.default.mainData.exportFormat === defaults_1.COMPODOC_DEFAULTS.exportFormat) {
                html_engine_1.default.generateCoverageBadge(configuration_1.default.mainData.output, 'documentation', coverageData);
            }
            files = _.sortBy(files, ['coveragePercent']);
            var coverageTestPerFileResults;
            if (configuration_1.default.mainData.coverageTest &&
                !configuration_1.default.mainData.coverageTestPerFile) {
                // Global coverage test and not per file
                if (coverageData.count >= configuration_1.default.mainData.coverageTestThreshold) {
                    logger_1.logger.info("Documentation coverage (" + coverageData.count + "%) is over threshold (" + configuration_1.default.mainData.coverageTestThreshold + "%)");
                    generationPromiseResolve();
                    process.exit(0);
                }
                else {
                    var message = "Documentation coverage (" + coverageData.count + "%) is not over threshold (" + configuration_1.default.mainData.coverageTestThreshold + "%)";
                    generationPromiseReject();
                    if (configuration_1.default.mainData.coverageTestThresholdFail) {
                        logger_1.logger.error(message);
                        process.exit(1);
                    }
                    else {
                        logger_1.logger.warn(message);
                        process.exit(0);
                    }
                }
            }
            else if (!configuration_1.default.mainData.coverageTest &&
                configuration_1.default.mainData.coverageTestPerFile) {
                coverageTestPerFileResults = processCoveragePerFile();
                // Per file coverage test and not global
                if (coverageTestPerFileResults.underFiles.length > 0) {
                    var message = "Documentation coverage per file is not over threshold (" + configuration_1.default.mainData.coverageMinimumPerFile + "%)";
                    generationPromiseReject();
                    if (configuration_1.default.mainData.coverageTestThresholdFail) {
                        logger_1.logger.error(message);
                        process.exit(1);
                    }
                    else {
                        logger_1.logger.warn(message);
                        process.exit(0);
                    }
                }
                else {
                    logger_1.logger.info("Documentation coverage per file is over threshold (" + configuration_1.default.mainData.coverageMinimumPerFile + "%)");
                    generationPromiseResolve();
                    process.exit(0);
                }
            }
            else if (configuration_1.default.mainData.coverageTest &&
                configuration_1.default.mainData.coverageTestPerFile) {
                // Per file coverage test and global
                coverageTestPerFileResults = processCoveragePerFile();
                if (coverageData.count >= configuration_1.default.mainData.coverageTestThreshold &&
                    coverageTestPerFileResults.underFiles.length === 0) {
                    logger_1.logger.info("Documentation coverage (" + coverageData.count + "%) is over threshold (" + configuration_1.default.mainData.coverageTestThreshold + "%)");
                    logger_1.logger.info("Documentation coverage per file is over threshold (" + configuration_1.default.mainData.coverageMinimumPerFile + "%)");
                    generationPromiseResolve();
                    process.exit(0);
                }
                else if (coverageData.count >= configuration_1.default.mainData.coverageTestThreshold &&
                    coverageTestPerFileResults.underFiles.length > 0) {
                    logger_1.logger.info("Documentation coverage (" + coverageData.count + "%) is over threshold (" + configuration_1.default.mainData.coverageTestThreshold + "%)");
                    var message = "Documentation coverage per file is not over threshold (" + configuration_1.default.mainData.coverageMinimumPerFile + "%)";
                    generationPromiseReject();
                    if (configuration_1.default.mainData.coverageTestThresholdFail) {
                        logger_1.logger.error(message);
                        process.exit(1);
                    }
                    else {
                        logger_1.logger.warn(message);
                        process.exit(0);
                    }
                }
                else if (coverageData.count < configuration_1.default.mainData.coverageTestThreshold &&
                    coverageTestPerFileResults.underFiles.length > 0) {
                    var messageGlobal = "Documentation coverage (" + coverageData.count + "%) is not over threshold (" + configuration_1.default.mainData.coverageTestThreshold + "%)", messagePerFile = "Documentation coverage per file is not over threshold (" + configuration_1.default.mainData.coverageMinimumPerFile + "%)";
                    generationPromiseReject();
                    if (configuration_1.default.mainData.coverageTestThresholdFail) {
                        logger_1.logger.error(messageGlobal);
                        logger_1.logger.error(messagePerFile);
                        process.exit(1);
                    }
                    else {
                        logger_1.logger.warn(messageGlobal);
                        logger_1.logger.warn(messagePerFile);
                        process.exit(0);
                    }
                }
                else {
                    var message = "Documentation coverage (" + coverageData.count + "%) is not over threshold (" + configuration_1.default.mainData.coverageTestThreshold + "%)", messagePerFile = "Documentation coverage per file is over threshold (" + configuration_1.default.mainData.coverageMinimumPerFile + "%)";
                    generationPromiseReject();
                    if (configuration_1.default.mainData.coverageTestThresholdFail) {
                        logger_1.logger.error(message);
                        logger_1.logger.info(messagePerFile);
                        process.exit(1);
                    }
                    else {
                        logger_1.logger.warn(message);
                        logger_1.logger.info(messagePerFile);
                        process.exit(0);
                    }
                }
            }
            else {
                resolve();
            }
        });
    };
    Application.prototype.prepareUnitTestCoverage = function () {
        logger_1.logger.info('Process unit test coverage report');
        return new Promise(function (resolve, reject) {
            var covDat, covFileNames;
            var coverageData = configuration_1.default.mainData.coverageData;
            if (!coverageData.files) {
                logger_1.logger.warn('Missing documentation coverage data');
            }
            else {
                covDat = {};
                covFileNames = _.map(coverageData.files, function (el) {
                    var fileName = el.filePath;
                    covDat[fileName] = {
                        type: el.type,
                        linktype: el.linktype,
                        linksubtype: el.linksubtype,
                        name: el.name
                    };
                    return fileName;
                });
            }
            // read coverage summary file and data
            var unitTestSummary = {};
            var fileDat = file_engine_1.default.getSync(configuration_1.default.mainData.unitTestCoverage);
            if (fileDat) {
                unitTestSummary = JSON.parse(fileDat);
            }
            else {
                return Promise.reject('Error reading unit test coverage file');
            }
            var getCovStatus = function (percent, totalLines) {
                var status;
                if (totalLines === 0) {
                    status = 'uncovered';
                }
                else if (percent <= 25) {
                    status = 'low';
                }
                else if (percent > 25 && percent <= 50) {
                    status = 'medium';
                }
                else if (percent > 50 && percent <= 75) {
                    status = 'good';
                }
                else {
                    status = 'very-good';
                }
                return status;
            };
            var getCoverageData = function (data, fileName) {
                var out = {};
                if (fileName !== 'total') {
                    if (covDat === undefined) {
                        // need a name to include in output but this isn't visible
                        out = { name: fileName, filePath: fileName };
                    }
                    else {
                        var findMatch = _.filter(covFileNames, function (el) {
                            return el.includes(fileName) || fileName.includes(el);
                        });
                        if (findMatch.length > 0) {
                            out = _.clone(covDat[findMatch[0]]);
                            out['filePath'] = fileName;
                        }
                    }
                }
                var keysToGet = ['statements', 'branches', 'functions', 'lines'];
                _.forEach(keysToGet, function (key) {
                    if (data[key]) {
                        var t = data[key];
                        out[key] = {
                            coveragePercent: Math.round(t.pct),
                            coverageCount: '' + t.covered + '/' + t.total,
                            status: getCovStatus(t.pct, t.total)
                        };
                    }
                });
                return out;
            };
            var unitTestData = {};
            var files = [];
            for (var file in unitTestSummary) {
                var dat = getCoverageData(unitTestSummary[file], file);
                if (file === 'total') {
                    unitTestData['total'] = dat;
                }
                else {
                    files.push(dat);
                }
            }
            unitTestData['files'] = files;
            unitTestData['idColumn'] = covDat !== undefined; // should we include the id column
            configuration_1.default.mainData.unitTestData = unitTestData;
            configuration_1.default.addPage({
                name: 'unit-test',
                id: 'unit-test',
                context: 'unit-test',
                files: files,
                data: unitTestData,
                depth: 0,
                pageType: defaults_1.COMPODOC_DEFAULTS.PAGE_TYPES.ROOT
            });
            if (configuration_1.default.mainData.exportFormat === defaults_1.COMPODOC_DEFAULTS.exportFormat) {
                var keysToGet = ['statements', 'branches', 'functions', 'lines'];
                _.forEach(keysToGet, function (key) {
                    if (unitTestData['total'][key]) {
                        html_engine_1.default.generateCoverageBadge(configuration_1.default.mainData.output, key, {
                            count: unitTestData['total'][key]['coveragePercent'],
                            status: unitTestData['total'][key]['status']
                        });
                    }
                });
            }
            resolve();
        });
    };
    Application.prototype.processPage = function (page) {
        logger_1.logger.info('Process page', page.name);
        var htmlData = html_engine_1.default.render(configuration_1.default.mainData, page);
        var finalPath = configuration_1.default.mainData.output;
        if (configuration_1.default.mainData.output.lastIndexOf('/') === -1) {
            finalPath += '/';
        }
        if (page.path) {
            finalPath += page.path + '/';
        }
        if (page.filename) {
            finalPath += page.filename + '.html';
        }
        else {
            finalPath += page.name + '.html';
        }
        if (!configuration_1.default.mainData.disableSearch) {
            search_engine_1.default.indexPage({
                infos: page,
                rawData: htmlData,
                url: finalPath
            });
        }
        return file_engine_1.default.write(finalPath, htmlData).catch(function (err) {
            logger_1.logger.error('Error during ' + page.name + ' page generation');
            return Promise.reject('');
        });
    };
    Application.prototype.processPages = function () {
        var _this = this;
        var pages = _.sortBy(configuration_1.default.pages, ['name']);
        logger_1.logger.info('Process pages');
        Promise.all(pages.map(function (page) { return _this.processPage(page); }))
            .then(function () {
            var callbacksAfterGenerateSearchIndexJson = function () {
                if (configuration_1.default.mainData.additionalPages.length > 0) {
                    _this.processAdditionalPages();
                }
                else {
                    if (configuration_1.default.mainData.assetsFolder !== '') {
                        _this.processAssetsFolder();
                    }
                    _this.processResources();
                }
            };
            if (!configuration_1.default.mainData.disableSearch) {
                search_engine_1.default.generateSearchIndexJson(configuration_1.default.mainData.output).then(function () {
                    callbacksAfterGenerateSearchIndexJson();
                }, function (e) {
                    logger_1.logger.error(e);
                });
            }
            else {
                callbacksAfterGenerateSearchIndexJson();
            }
        })
            .then(function () {
            return _this.processMenu(configuration_1.default.mainData);
        })
            .catch(function (e) {
            logger_1.logger.error(e);
        });
    };
    Application.prototype.processMenu = function (mainData) {
        logger_1.logger.info('Process menu...');
        return html_engine_1.default.renderMenu(configuration_1.default.mainData.templates, mainData).then(function (htmlData) {
            var finalPath = mainData.output + "/js/menu-wc.js";
            return file_engine_1.default.write(finalPath, htmlData).catch(function (err) {
                logger_1.logger.error('Error during ' + finalPath + ' page generation');
                return Promise.reject('');
            });
        });
    };
    Application.prototype.processAdditionalPages = function () {
        var _this = this;
        logger_1.logger.info('Process additional pages');
        var pages = configuration_1.default.mainData.additionalPages;
        Promise.all(pages.map(function (page) {
            if (page.children.length > 0) {
                return Promise.all([
                    _this.processPage(page)
                ].concat(page.children.map(function (childPage) { return _this.processPage(childPage); })));
            }
            else {
                return _this.processPage(page);
            }
        }))
            .then(function () {
            search_engine_1.default.generateSearchIndexJson(configuration_1.default.mainData.output).then(function () {
                if (configuration_1.default.mainData.assetsFolder !== '') {
                    _this.processAssetsFolder();
                }
                _this.processResources();
            });
        })
            .catch(function (e) {
            logger_1.logger.error(e);
            return Promise.reject(e);
        });
    };
    Application.prototype.processAssetsFolder = function () {
        logger_1.logger.info('Copy assets folder');
        if (!file_engine_1.default.existsSync(configuration_1.default.mainData.assetsFolder)) {
            logger_1.logger.error("Provided assets folder " + configuration_1.default.mainData.assetsFolder + " did not exist");
        }
        else {
            var finalOutput = configuration_1.default.mainData.output;
            var testOutputDir = configuration_1.default.mainData.output.match(cwd);
            if (testOutputDir && testOutputDir.length > 0) {
                finalOutput = configuration_1.default.mainData.output.replace(cwd + path.sep, '');
            }
            var destination = path.join(finalOutput, path.basename(configuration_1.default.mainData.assetsFolder));
            fs.copy(path.resolve(configuration_1.default.mainData.assetsFolder), path.resolve(destination), function (err) {
                if (err) {
                    logger_1.logger.error('Error during resources copy ', err);
                }
            });
        }
    };
    Application.prototype.processResources = function () {
        var _this = this;
        logger_1.logger.info('Copy main resources');
        var onComplete = function () {
            logger_1.logger.info('Documentation generated in ' +
                configuration_1.default.mainData.output +
                ' in ' +
                _this.getElapsedTime() +
                ' seconds using ' +
                configuration_1.default.mainData.theme +
                ' theme');
            if (configuration_1.default.mainData.serve) {
                logger_1.logger.info("Serving documentation from " + configuration_1.default.mainData.output + " at http://127.0.0.1:" + configuration_1.default.mainData.port);
                _this.runWebServer(configuration_1.default.mainData.output);
            }
            else {
                generationPromiseResolve();
                _this.endCallback();
            }
        };
        var finalOutput = configuration_1.default.mainData.output;
        var testOutputDir = configuration_1.default.mainData.output.match(cwd);
        if (testOutputDir && testOutputDir.length > 0) {
            finalOutput = configuration_1.default.mainData.output.replace(cwd + path.sep, '');
        }
        fs.copy(path.resolve(__dirname + '/../src/resources/'), path.resolve(finalOutput), function (errorCopy) {
            if (errorCopy) {
                logger_1.logger.error('Error during resources copy ', errorCopy);
            }
            else {
                var extThemePromise = new Promise(function (extThemeResolve, extThemeReject) {
                    if (configuration_1.default.mainData.extTheme) {
                        fs.copy(path.resolve(cwd + path.sep + configuration_1.default.mainData.extTheme), path.resolve(finalOutput + '/styles/'), function (errorCopyTheme) {
                            if (errorCopyTheme) {
                                logger_1.logger.error('Error during external styling theme copy ', errorCopyTheme);
                                extThemeReject();
                            }
                            else {
                                logger_1.logger.info('External styling theme copy succeeded');
                                extThemeResolve();
                            }
                        });
                    }
                    else {
                        extThemeResolve();
                    }
                });
                var customFaviconPromise = new Promise(function (customFaviconResolve, customFaviconReject) {
                    if (configuration_1.default.mainData.customFavicon !== '') {
                        logger_1.logger.info("Custom favicon supplied");
                        fs.copy(path.resolve(cwd + path.sep + configuration_1.default.mainData.customFavicon), path.resolve(finalOutput + '/images/favicon.ico'), function (errorCopyFavicon) {
                            // tslint:disable-line
                            if (errorCopyFavicon) {
                                logger_1.logger.error('Error during resources copy of favicon', errorCopyFavicon);
                                customFaviconReject();
                            }
                            else {
                                logger_1.logger.info('External custom favicon copy succeeded');
                                customFaviconResolve();
                            }
                        });
                    }
                    else {
                        customFaviconResolve();
                    }
                });
                var customLogoPromise = new Promise(function (customLogoResolve, customLogoReject) {
                    if (configuration_1.default.mainData.customLogo !== '') {
                        logger_1.logger.info("Custom logo supplied");
                        fs.copy(path.resolve(cwd +
                            path.sep +
                            configuration_1.default.mainData.customLogo), path.resolve(finalOutput + '/images/' + configuration_1.default.mainData.customLogo.split("/").pop()), function (errorCopyLogo) {
                            // tslint:disable-line
                            if (errorCopyLogo) {
                                logger_1.logger.error('Error during resources copy of logo', errorCopyLogo);
                                customLogoReject();
                            }
                            else {
                                logger_1.logger.info('External custom logo copy succeeded');
                                customLogoResolve();
                            }
                        });
                    }
                    else {
                        customLogoResolve();
                    }
                });
                Promise.all([extThemePromise, customFaviconPromise, customLogoPromise]).then(function () {
                    onComplete();
                });
            }
        });
    };
    /**
     * Calculates the elapsed time since the program was started.
     *
     * @returns {number}
     */
    Application.prototype.getElapsedTime = function () {
        return (new Date().valueOf() - startTime.valueOf()) / 1000;
    };
    Application.prototype.processGraphs = function () {
        var _this = this;
        if (configuration_1.default.mainData.disableGraph) {
            logger_1.logger.info('Graph generation disabled');
            this.processPages();
        }
        else {
            logger_1.logger.info('Process main graph');
            var modules_1 = configuration_1.default.mainData.modules;
            var i_1 = 0;
            var len_1 = modules_1.length;
            var loop_1 = function () {
                if (i_1 <= len_1 - 1) {
                    logger_1.logger.info('Process module graph ', modules_1[i_1].name);
                    var finalPath_2 = configuration_1.default.mainData.output;
                    if (configuration_1.default.mainData.output.lastIndexOf('/') === -1) {
                        finalPath_2 += '/';
                    }
                    finalPath_2 += 'modules/' + modules_1[i_1].name;
                    var _rawModule = dependencies_engine_1.default.getRawModule(modules_1[i_1].name);
                    if (_rawModule.declarations.length > 0 ||
                        _rawModule.bootstrap.length > 0 ||
                        _rawModule.imports.length > 0 ||
                        _rawModule.exports.length > 0 ||
                        _rawModule.providers.length > 0) {
                        ngd_engine_1.default.renderGraph(modules_1[i_1].file, finalPath_2, 'f', modules_1[i_1].name).then(function () {
                            ngd_engine_1.default.readGraph(path.resolve(finalPath_2 + path.sep + 'dependencies.svg'), modules_1[i_1].name).then(function (data) {
                                modules_1[i_1].graph = data;
                                i_1++;
                                loop_1();
                            }, function (err) {
                                logger_1.logger.error('Error during graph read: ', err);
                            });
                        }, function (errorMessage) {
                            logger_1.logger.error(errorMessage);
                        });
                    }
                    else {
                        i_1++;
                        loop_1();
                    }
                }
                else {
                    _this.processPages();
                }
            };
            var finalMainGraphPath_1 = configuration_1.default.mainData.output;
            if (finalMainGraphPath_1.lastIndexOf('/') === -1) {
                finalMainGraphPath_1 += '/';
            }
            finalMainGraphPath_1 += 'graph';
            ngd_engine_1.default.init(path.resolve(finalMainGraphPath_1));
            ngd_engine_1.default.renderGraph(configuration_1.default.mainData.tsconfig, path.resolve(finalMainGraphPath_1), 'p').then(function () {
                ngd_engine_1.default.readGraph(path.resolve(finalMainGraphPath_1 + path.sep + 'dependencies.svg'), 'Main graph').then(function (data) {
                    configuration_1.default.mainData.mainGraph = data;
                    loop_1();
                }, function (err) {
                    logger_1.logger.error('Error during main graph reading : ', err);
                    configuration_1.default.mainData.disableMainGraph = true;
                    loop_1();
                });
            }, function (err) {
                logger_1.logger.error('Ooops error during main graph generation, moving on next part with main graph disabled : ', err);
                configuration_1.default.mainData.disableMainGraph = true;
                loop_1();
            });
        }
    };
    Application.prototype.runWebServer = function (folder) {
        if (!this.isWatching) {
            LiveServer.start({
                root: folder,
                open: configuration_1.default.mainData.open,
                quiet: true,
                logLevel: 0,
                wait: 1000,
                port: configuration_1.default.mainData.port
            });
        }
        if (configuration_1.default.mainData.watch && !this.isWatching) {
            if (typeof this.files === 'undefined') {
                logger_1.logger.error('No sources files available, please use -p flag');
                generationPromiseReject();
                process.exit(1);
            }
            else {
                this.runWatch();
            }
        }
        else if (configuration_1.default.mainData.watch && this.isWatching) {
            var srcFolder = utils_1.findMainSourceFolder(this.files);
            logger_1.logger.info("Already watching sources in " + srcFolder + " folder");
        }
    };
    Application.prototype.runWatch = function () {
        var _this = this;
        var sources = [utils_1.findMainSourceFolder(this.files)];
        var watcherReady = false;
        this.isWatching = true;
        logger_1.logger.info("Watching sources in " + utils_1.findMainSourceFolder(this.files) + " folder");
        if (markdown_engine_1.default.hasRootMarkdowns()) {
            sources = sources.concat(markdown_engine_1.default.listRootMarkdowns());
        }
        if (configuration_1.default.mainData.includes !== '') {
            sources = sources.concat(configuration_1.default.mainData.includes);
        }
        // Check all elements of sources list exist
        sources = utils_1.cleanSourcesForWatch(sources);
        var watcher = chokidar.watch(sources, {
            awaitWriteFinish: true,
            ignoreInitial: true,
            ignored: /(spec|\.d)\.ts/
        });
        var timerAddAndRemoveRef;
        var timerChangeRef;
        var runnerAddAndRemove = function () {
            startTime = new Date();
            _this.generate();
        };
        var waiterAddAndRemove = function () {
            clearTimeout(timerAddAndRemoveRef);
            timerAddAndRemoveRef = setTimeout(runnerAddAndRemove, 1000);
        };
        var runnerChange = function () {
            startTime = new Date();
            _this.setUpdatedFiles(_this.watchChangedFiles);
            if (_this.hasWatchedFilesTSFiles()) {
                _this.getMicroDependenciesData();
            }
            else if (_this.hasWatchedFilesRootMarkdownFiles()) {
                _this.rebuildRootMarkdowns();
            }
            else {
                _this.rebuildExternalDocumentation();
            }
        };
        var waiterChange = function () {
            clearTimeout(timerChangeRef);
            timerChangeRef = setTimeout(runnerChange, 1000);
        };
        watcher.on('ready', function () {
            if (!watcherReady) {
                watcherReady = true;
                watcher
                    .on('add', function (file) {
                    logger_1.logger.debug("File " + file + " has been added");
                    // Test extension, if ts
                    // rescan everything
                    if (path.extname(file) === '.ts') {
                        waiterAddAndRemove();
                    }
                })
                    .on('change', function (file) {
                    logger_1.logger.debug("File " + file + " has been changed");
                    // Test extension, if ts
                    // rescan only file
                    if (path.extname(file) === '.ts' ||
                        path.extname(file) === '.md' ||
                        path.extname(file) === '.json') {
                        _this.watchChangedFiles.push(path.join(cwd + path.sep + file));
                        waiterChange();
                    }
                })
                    .on('unlink', function (file) {
                    logger_1.logger.debug("File " + file + " has been removed");
                    // Test extension, if ts
                    // rescan everything
                    if (path.extname(file) === '.ts') {
                        waiterAddAndRemove();
                    }
                });
            }
        });
    };
    Object.defineProperty(Application.prototype, "application", {
        /**
         * Return the application / root component instance.
         */
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "isCLI", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return Application;
}());
exports.Application = Application;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9hcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUErQjtBQUMvQix3Q0FBMEM7QUFDMUMsMEJBQTRCO0FBQzVCLDJCQUE2QjtBQUU3QiwrQ0FBMkM7QUFFM0MsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDckMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRWpDLDBDQUF5QztBQUV6QyxpREFBNEM7QUFFNUMscUVBQStEO0FBQy9ELHlEQUFtRDtBQUNuRCxxREFBK0M7QUFDL0MscURBQStDO0FBQy9DLHFEQUErQztBQUMvQyw2REFBdUQ7QUFDdkQsbURBQTZDO0FBQzdDLHlEQUFtRDtBQUVuRCx3RUFBc0U7QUFDdEUsNEVBQTBFO0FBRTFFLHNFQUErRDtBQUMvRCxnREFBd0Q7QUFDeEQsOENBQXNEO0FBQ3RELGtFQUFnRTtBQUNoRSxrRUFBMkQ7QUFFM0Qsd0NBSXdCO0FBS3hCLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN4QixJQUFJLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQzNCLElBQUksd0JBQXdCLENBQUM7QUFDN0IsSUFBSSx1QkFBdUIsQ0FBQztBQUM1QixJQUFJLGlCQUFpQixHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07SUFDaEQsd0JBQXdCLEdB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SUFDUCxDQUFDO0lBS0Qsc0JBQUksb0NBQVc7UUFIZjs7V0FFRzthQUNIO1lBQ0ksT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSw4QkFBSzthQUFUO1lBQ0ksT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQzs7O09BQUE7SUFDTCxrQkFBQztBQUFELENBQUMsQUFsdUZELElBa3VGQztBQWx1Rlksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgKiBhcyBMaXZlU2VydmVyIGZyb20gJ2xpdmUtc2VydmVyJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7IFN5bnRheEtpbmQgfSBmcm9tICd0cy1zaW1wbGUtYXN0JztcblxuY29uc3QgY2hva2lkYXIgPSByZXF1aXJlKCdjaG9raWRhcicpO1xuY29uc3QgbWFya2VkID0gcmVxdWlyZSgnbWFya2VkJyk7XG5jb25zdCB0cmF2ZXJzZSA9IHJlcXVpcmUoJ3RyYXZlcnNlJyk7XG5jb25zdCBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblxuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi4vdXRpbHMvbG9nZ2VyJztcblxuaW1wb3J0IENvbmZpZ3VyYXRpb24gZnJvbSAnLi9jb25maWd1cmF0aW9uJztcblxuaW1wb3J0IERlcGVuZGVuY2llc0VuZ2luZSBmcm9tICcuL2VuZ2luZXMvZGVwZW5kZW5jaWVzLmVuZ2luZSc7XG5pbXBvcnQgRXhwb3J0RW5naW5lIGZyb20gJy4vZW5naW5lcy9leHBvcnQuZW5naW5lJztcbmltcG9ydCBGaWxlRW5naW5lIGZyb20gJy4vZW5naW5lcy9maWxlLmVuZ2luZSc7XG5pbXBvcnQgSHRtbEVuZ2luZSBmcm9tICcuL2VuZ2luZXMvaHRtbC5lbmdpbmUnO1xuaW1wb3J0IEkxOG5FbmdpbmUgZnJvbSAnLi9lbmdpbmVzL2kxOG4uZW5naW5lJztcbmltcG9ydCBNYXJrZG93bkVuZ2luZSBmcm9tICcuL2VuZ2luZXMvbWFya2Rvd24uZW5naW5lJztcbmltcG9ydCBOZ2RFbmdpbmUgZnJvbSAnLi9lbmdpbmVzL25nZC5lbmdpbmUnO1xuaW1wb3J0IFNlYXJjaEVuZ2luZSBmcm9tICcuL2VuZ2luZXMvc2VhcmNoLmVuZ2luZSc7XG5cbmltcG9ydCB7IEFuZ3VsYXJEZXBlbmRlbmNpZXMgfSBmcm9tICcuL2NvbXBpbGVyL2FuZ3VsYXItZGVwZW5kZW5jaWVzJztcbmltcG9ydCB7IEFuZ3VsYXJKU0RlcGVuZGVuY2llcyB9IGZyb20gJy4vY29tcGlsZXIvYW5ndWxhcmpzLWRlcGVuZGVuY2llcyc7XG5cbmltcG9ydCBBbmd1bGFyVmVyc2lvblV0aWwgZnJvbSAnLi4vdXRpbHMvYW5ndWxhci12ZXJzaW9uLnV0aWwnO1xuaW1wb3J0IHsgQ09NUE9ET0NfQ09OU1RBTlRTIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcbmltcG9ydCB7IENPTVBPRE9DX0RFRkFVTFRTIH0gZnJvbSAnLi4vdXRpbHMvZGVmYXVsdHMnO1xuaW1wb3J0IHsgcHJvbWlzZVNlcXVlbnRpYWwgfSBmcm9tICcuLi91dGlscy9wcm9taXNlLXNlcXVlbnRpYWwnO1xuaW1wb3J0IFJvdXRlclBhcnNlclV0aWwgZnJvbSAnLi4vdXRpbHMvcm91dGVyLXBhcnNlci51dGlsJztcblxuaW1wb3J0IHtcbiAgICBjbGVhbk5hbWVXaXRob3V0U3BhY2VBbmRUb0xvd2VyQ2FzZSxcbiAgICBjbGVhblNvdXJjZXNGb3JXYXRjaCxcbiAgICBmaW5kTWFpblNvdXJjZUZvbGRlclxufSBmcm9tICcuLi91dGlscy91dGlscyc7XG5cbmltcG9ydCB7IEFkZGl0aW9uYWxOb2RlIH0gZnJvbSAnLi9pbnRlcmZhY2VzL2FkZGl0aW9uYWwtbm9kZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ292ZXJhZ2VEYXRhIH0gZnJvbSAnLi9pbnRlcmZhY2VzL2NvdmVyYWdlRGF0YS5pbnRlcmZhY2UnO1xuXG5sZXQgY3dkID0gcHJvY2Vzcy5jd2QoKTtcbmxldCBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xubGV0IGdlbmVyYXRpb25Qcm9taXNlUmVzb2x2ZTtcbmxldCBnZW5lcmF0aW9uUHJvbWlzZVJlamVjdDtcbmxldCBnZW5lcmF0aW9uUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBnZW5lcmF0aW9uUHJvbWlzZVJlc29sdmUgPSByZXNvbHZlO1xuICAgIGdlbmVyYXRpb25Qcm9taXNlUmVqZWN0ID0gcmVqZWN0O1xufSk7XG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiB7XG4gICAgLyoqXG4gICAgICogRmlsZXMgcHJvY2Vzc2VkIGR1cmluZyBpbml0aWFsIHNjYW5uaW5nXG4gICAgICovXG4gICAgcHVibGljIGZpbGVzOiBBcnJheTxzdHJpbmc+O1xuICAgIC8qKlxuICAgICAqIEZpbGVzIHByb2Nlc3NlZCBkdXJpbmcgd2F0Y2ggc2Nhbm5pbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgdXBkYXRlZEZpbGVzOiBBcnJheTxzdHJpbmc+O1xuICAgIC8qKlxuICAgICAqIEZpbGVzIGNoYW5nZWQgZHVyaW5nIHdhdGNoIHNjYW5uaW5nXG4gICAgICovXG4gICAgcHVibGljIHdhdGNoQ2hhbmdlZEZpbGVzOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgLyoqXG4gICAgICogQm9vbGVhbiBmb3Igd2F0Y2hpbmcgc3RhdHVzXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgcHVibGljIGlzV2F0Y2hpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIHBhY2thZ2UuanNvbiBkYXRhXG4gICAgICovXG4gICAgcHJpdmF0ZSBwYWNrYWdlSnNvbkRhdGEgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBjb21wb2RvYyBhcHBsaWNhdGlvbiBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBvcHRpb25zIHRoYXQgc2hvdWxkIGJlIHVzZWQuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucz86IE9iamVjdCkge1xuICAgICAgICBmb3IgKGxldCBvcHRpb24gaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBDb25maWd1cmF0aW9uLm1haW5EYXRhW29wdGlvbl0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YVtvcHRpb25dID0gb3B0aW9uc1tvcHRpb25dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRm9yIGRvY3VtZW50YXRpb25NYWluTmFtZSwgcHJvY2VzcyBpdCBvdXRzaWRlIHRoZSBsb29wLCBmb3IgaGFuZGxpbmcgY29uZmxpY3Qgd2l0aCBwYWdlcyBuYW1lXG4gICAgICAgICAgICBpZiAob3B0aW9uID09PSAnbmFtZScpIHtcbiAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRvY3VtZW50YXRpb25NYWluTmFtZSA9IG9wdGlvbnNbb3B0aW9uXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEZvciBkb2N1bWVudGF0aW9uTWFpbk5hbWUsIHByb2Nlc3MgaXQgb3V0c2lkZSB0aGUgbG9vcCwgZm9yIGhhbmRsaW5nIGNvbmZsaWN0IHdpdGggcGFnZXMgbmFtZVxuICAgICAgICAgICAgaWYgKG9wdGlvbiA9PT0gJ3NpbGVudCcpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuc2lsZW50ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGFydCBjb21wb2RvYyBwcm9jZXNzXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdlbmVyYXRlKCk6IFByb21pc2U8e30+IHtcbiAgICAgICAgcHJvY2Vzcy5vbigndW5oYW5kbGVkUmVqZWN0aW9uJywgdGhpcy51bmhhbmRsZWRSZWplY3Rpb25MaXN0ZW5lcik7XG4gICAgICAgIHByb2Nlc3Mub24oJ3VuY2F1Z2h0RXhjZXB0aW9uJywgdGhpcy51bmNhdWdodEV4Y2VwdGlvbkxpc3RlbmVyKTtcblxuICAgICAgICBJMThuRW5naW5lLmluaXQoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5sYW5ndWFnZSk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQuY2hhckF0KENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0Lmxlbmd0aCAtIDEpICE9PSAnLydcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dCArPSAnLyc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5leHBvcnRGb3JtYXQgIT09IENPTVBPRE9DX0RFRkFVTFRTLmV4cG9ydEZvcm1hdCkge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzUGFja2FnZUpzb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEh0bWxFbmdpbmUuaW5pdChDb25maWd1cmF0aW9uLm1haW5EYXRhLnRlbXBsYXRlcykudGhlbigoKSA9PiB0aGlzLnByb2Nlc3NQYWNrYWdlSnNvbigpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2VuZXJhdGlvblByb21pc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbmRDYWxsYmFjaygpIHtcbiAgICAgICAgcHJvY2Vzcy5yZW1vdmVMaXN0ZW5lcigndW5oYW5kbGVkUmVqZWN0aW9uJywgdGhpcy51bmhhbmRsZWRSZWplY3Rpb25MaXN0ZW5lcik7XG4gICAgICAgIHByb2Nlc3MucmVtb3ZlTGlzdGVuZXIoJ3VuY2F1Z2h0RXhjZXB0aW9uJywgdGhpcy51bmNhdWdodEV4Y2VwdGlvbkxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVuaGFuZGxlZFJlamVjdGlvbkxpc3RlbmVyKGVyciwgcCkge1xuICAgICAgICBjb25zb2xlLmxvZygnVW5oYW5kbGVkIFJlamVjdGlvbiBhdDonLCBwLCAncmVhc29uOicsIGVycik7XG4gICAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgICdTb3JyeSwgYnV0IHRoZXJlIHdhcyBhIHByb2JsZW0gZHVyaW5nIHBhcnNpbmcgb3IgZ2VuZXJhdGlvbiBvZiB0aGUgZG9jdW1lbnRhdGlvbi4gUGxlYXNlIGZpbGwgYW4gaXNzdWUgb24gZ2l0aHViLiAoaHR0cHM6Ly9naXRodWIuY29tL2NvbXBvZG9jL2NvbXBvZG9jL2lzc3Vlcy9uZXcpJ1xuICAgICAgICApOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lXG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVuY2F1Z2h0RXhjZXB0aW9uTGlzdGVuZXIoZXJyKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvcihlcnIpO1xuICAgICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICAnU29ycnksIGJ1dCB0aGVyZSB3YXMgYSBwcm9ibGVtIGR1cmluZyBwYXJzaW5nIG9yIGdlbmVyYXRpb24gb2YgdGhlIGRvY3VtZW50YXRpb24uIFBsZWFzZSBmaWxsIGFuIGlzc3VlIG9uIGdpdGh1Yi4gKGh0dHBzOi8vZ2l0aHViLmNvbS9jb21wb2RvYy9jb21wb2RvYy9pc3N1ZXMvbmV3KSdcbiAgICAgICAgKTsgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgY29tcG9kb2MgZG9jdW1lbnRhdGlvbiBjb3ZlcmFnZVxuICAgICAqL1xuICAgIHByb3RlY3RlZCB0ZXN0Q292ZXJhZ2UoKSB7XG4gICAgICAgIHRoaXMuZ2V0RGVwZW5kZW5jaWVzRGF0YSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0b3JlIGZpbGVzIGZvciBpbml0aWFsIHByb2Nlc3NpbmdcbiAgICAgKiBAcGFyYW0gIHtBcnJheTxzdHJpbmc+fSBmaWxlcyBGaWxlcyBmb3VuZCBkdXJpbmcgc291cmNlIGZvbGRlciBhbmQgdHNjb25maWcgc2NhblxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRGaWxlcyhmaWxlczogQXJyYXk8c3RyaW5nPikge1xuICAgICAgICB0aGlzLmZpbGVzID0gZmlsZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcmUgZmlsZXMgZm9yIHdhdGNoIHByb2Nlc3NpbmdcbiAgICAgKiBAcGFyYW0gIHtBcnJheTxzdHJpbmc+fSBmaWxlcyBGaWxlcyBmb3VuZCBkdXJpbmcgc291cmNlIGZvbGRlciBhbmQgdHNjb25maWcgc2NhblxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRVcGRhdGVkRmlsZXMoZmlsZXM6IEFycmF5PHN0cmluZz4pIHtcbiAgICAgICAgdGhpcy51cGRhdGVkRmlsZXMgPSBmaWxlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBib29sZWFuIGluZGljYXRpbmcgcHJlc2VuY2Ugb2Ygb25lIFR5cGVTY3JpcHQgZmlsZSBpbiB1cGRhdGVkRmlsZXMgbGlzdFxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFJlc3VsdCBvZiBzY2FuXG4gICAgICovXG4gICAgcHVibGljIGhhc1dhdGNoZWRGaWxlc1RTRmlsZXMoKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcblxuICAgICAgICBfLmZvckVhY2godGhpcy51cGRhdGVkRmlsZXMsIGZpbGUgPT4ge1xuICAgICAgICAgICAgaWYgKHBhdGguZXh0bmFtZShmaWxlKSA9PT0gJy50cycpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIGJvb2xlYW4gaW5kaWNhdGluZyBwcmVzZW5jZSBvZiBvbmUgcm9vdCBtYXJrZG93biBmaWxlcyBpbiB1cGRhdGVkRmlsZXMgbGlzdFxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFJlc3VsdCBvZiBzY2FuXG4gICAgICovXG4gICAgcHVibGljIGhhc1dhdGNoZWRGaWxlc1Jvb3RNYXJrZG93bkZpbGVzKCk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XG5cbiAgICAgICAgXy5mb3JFYWNoKHRoaXMudXBkYXRlZEZpbGVzLCBmaWxlID0+IHtcbiAgICAgICAgICAgIGlmIChwYXRoLmV4dG5hbWUoZmlsZSkgPT09ICcubWQnICYmIHBhdGguZGlybmFtZShmaWxlKSA9PT0gY3dkKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhciBmaWxlcyBmb3Igd2F0Y2ggcHJvY2Vzc2luZ1xuICAgICAqL1xuICAgIHB1YmxpYyBjbGVhclVwZGF0ZWRGaWxlcygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51cGRhdGVkRmlsZXMgPSBbXTtcbiAgICAgICAgdGhpcy53YXRjaENoYW5nZWRGaWxlcyA9IFtdO1xuICAgIH1cblxuICAgIHByaXZhdGUgcHJvY2Vzc1BhY2thZ2VKc29uKCk6IHZvaWQge1xuICAgICAgICBsb2dnZXIuaW5mbygnU2VhcmNoaW5nIHBhY2thZ2UuanNvbiBmaWxlJyk7XG4gICAgICAgIEZpbGVFbmdpbmUuZ2V0KGN3ZCArIHBhdGguc2VwICsgJ3BhY2thZ2UuanNvbicpLnRoZW4oXG4gICAgICAgICAgICBwYWNrYWdlRGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBhcnNlZERhdGEgPSBKU09OLnBhcnNlKHBhY2thZ2VEYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhY2thZ2VKc29uRGF0YSA9IHBhcnNlZERhdGE7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgcGFyc2VkRGF0YS5uYW1lICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRvY3VtZW50YXRpb25NYWluTmFtZSA9PT0gQ09NUE9ET0NfREVGQVVMVFMudGl0bGVcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kb2N1bWVudGF0aW9uTWFpbk5hbWUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkRGF0YS5uYW1lICsgJyBkb2N1bWVudGF0aW9uJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJzZWREYXRhLmRlc2NyaXB0aW9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRvY3VtZW50YXRpb25NYWluRGVzY3JpcHRpb24gPSBwYXJzZWREYXRhLmRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmFuZ3VsYXJWZXJzaW9uID0gQW5ndWxhclZlcnNpb25VdGlsLmdldEFuZ3VsYXJWZXJzaW9uT2ZQcm9qZWN0KFxuICAgICAgICAgICAgICAgICAgICBwYXJzZWREYXRhXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygncGFja2FnZS5qc29uIGZpbGUgZm91bmQnKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcGFyc2VkRGF0YS5kZXBlbmRlbmNpZXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc1BhY2thZ2VEZXBlbmRlbmNpZXMocGFyc2VkRGF0YS5kZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHBhcnNlZERhdGEucGVlckRlcGVuZGVuY2llcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzUGFja2FnZVBlZXJEZXBlbmRlbmNpZXMocGFyc2VkRGF0YS5wZWVyRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NNYXJrZG93bnMoKS50aGVuKFxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERlcGVuZGVuY2llc0RhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignQ29udGludWluZyB3aXRob3V0IHBhY2thZ2UuanNvbiBmaWxlJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTWFya2Rvd25zKCkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXREZXBlbmRlbmNpZXNEYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycm9yTWVzc2FnZTEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByb2Nlc3NQYWNrYWdlUGVlckRlcGVuZGVuY2llcyhkZXBlbmRlbmNpZXMpOiB2b2lkIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2Nlc3NpbmcgcGFja2FnZS5qc29uIHBlZXJEZXBlbmRlbmNpZXMnKTtcbiAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5wYWNrYWdlUGVlckRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcztcbiAgICAgICAgaWYgKCFDb25maWd1cmF0aW9uLmhhc1BhZ2UoJ2RlcGVuZGVuY2llcycpKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2Uoe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdkZXBlbmRlbmNpZXMnLFxuICAgICAgICAgICAgICAgIGlkOiAncGFja2FnZURlcGVuZGVuY2llcycsXG4gICAgICAgICAgICAgICAgY29udGV4dDogJ3BhY2thZ2UtZGVwZW5kZW5jaWVzJyxcbiAgICAgICAgICAgICAgICBkZXB0aDogMCxcbiAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5ST09UXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcHJvY2Vzc1BhY2thZ2VEZXBlbmRlbmNpZXMoZGVwZW5kZW5jaWVzKTogdm9pZCB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcm9jZXNzaW5nIHBhY2thZ2UuanNvbiBkZXBlbmRlbmNpZXMnKTtcbiAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5wYWNrYWdlRGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzO1xuICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2Uoe1xuICAgICAgICAgICAgbmFtZTogJ2RlcGVuZGVuY2llcycsXG4gICAgICAgICAgICBpZDogJ3BhY2thZ2VEZXBlbmRlbmNpZXMnLFxuICAgICAgICAgICAgY29udGV4dDogJ3BhY2thZ2UtZGVwZW5kZW5jaWVzJyxcbiAgICAgICAgICAgIGRlcHRoOiAwLFxuICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuUk9PVFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByb2Nlc3NNYXJrZG93bnMoKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oXG4gICAgICAgICAgICAnU2VhcmNoaW5nIFJFQURNRS5tZCwgQ0hBTkdFTE9HLm1kLCBDT05UUklCVVRJTkcubWQsIExJQ0VOU0UubWQsIFRPRE8ubWQgZmlsZXMnXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGxldCBtYXJrZG93bnMgPSBbJ3JlYWRtZScsICdjaGFuZ2Vsb2cnLCAnY29udHJpYnV0aW5nJywgJ2xpY2Vuc2UnLCAndG9kbyddO1xuICAgICAgICAgICAgbGV0IG51bWJlck9mTWFya2Rvd25zID0gNTtcbiAgICAgICAgICAgIGxldCBsb29wID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpIDwgbnVtYmVyT2ZNYXJrZG93bnMpIHtcbiAgICAgICAgICAgICAgICAgICAgTWFya2Rvd25FbmdpbmUuZ2V0VHJhZGl0aW9uYWxNYXJrZG93bihtYXJrZG93bnNbaV0udG9VcHBlckNhc2UoKSkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgIChyZWFkbWVEYXRhOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBtYXJrZG93bnNbaV0gPT09ICdyZWFkbWUnID8gJ2luZGV4JyA6IG1hcmtkb3duc1tpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogJ2dldHRpbmctc3RhcnRlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAnZ2V0dGluZy1zdGFydGVkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFya2Rvd246IHJlYWRtZURhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5ST09UXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcmtkb3duc1tpXSA9PT0gJ3JlYWRtZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5yZWFkbWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ292ZXJ2aWV3JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAnb3ZlcnZpZXcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogJ292ZXJ2aWV3JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLlJPT1RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5tYXJrZG93bnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBtYXJrZG93bnNbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cHBlcm5hbWU6IG1hcmtkb3duc1tpXS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5ST09UXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgJHttYXJrZG93bnNbaV0udG9VcHBlckNhc2UoKX0ubWQgZmlsZSBmb3VuZGApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb29wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKGBDb250aW51aW5nIHdpdGhvdXQgJHttYXJrZG93bnNbaV0udG9VcHBlckNhc2UoKX0ubWQgZmlsZWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXJrZG93bnNbaV0gPT09ICdyZWFkbWUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdpbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAnb3ZlcnZpZXcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5ST09UXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlYnVpbGRSb290TWFya2Rvd25zKCk6IHZvaWQge1xuICAgICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgICAgICdSZWdlbmVyYXRpbmcgUkVBRE1FLm1kLCBDSEFOR0VMT0cubWQsIENPTlRSSUJVVElORy5tZCwgTElDRU5TRS5tZCwgVE9ETy5tZCBwYWdlcydcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgYWN0aW9ucyA9IFtdO1xuXG4gICAgICAgIENvbmZpZ3VyYXRpb24ucmVzZXRSb290TWFya2Rvd25QYWdlcygpO1xuXG4gICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzTWFya2Rvd25zKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHByb21pc2VTZXF1ZW50aWFsKGFjdGlvbnMpXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc1BhZ2VzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclVwZGF0ZWRGaWxlcygpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvck1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGRlcGVuZGVuY3kgZGF0YSBmb3Igc21hbGwgZ3JvdXAgb2YgdXBkYXRlZCBmaWxlcyBkdXJpbmcgd2F0Y2ggcHJvY2Vzc1xuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0TWljcm9EZXBlbmRlbmNpZXNEYXRhKCk6IHZvaWQge1xuICAgICAgICBsb2dnZXIuaW5mbygnR2V0IGRpZmYgZGVwZW5kZW5jaWVzIGRhdGEnKTtcblxuICAgICAgICBsZXQgZGVwZW5kZW5jaWVzQ2xhc3M6IEFuZ3VsYXJEZXBlbmRlbmNpZXMgfCBBbmd1bGFySlNEZXBlbmRlbmNpZXMgPSBBbmd1bGFyRGVwZW5kZW5jaWVzO1xuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmFuZ3VsYXJQcm9qZWN0ID0gdHJ1ZTtcblxuICAgICAgICBpZiAodGhpcy5kZXRlY3RBbmd1bGFySlNQcm9qZWN0cygpKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnQW5ndWxhckpTIHByb2plY3QgZGV0ZWN0ZWQnKTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYW5ndWxhclByb2plY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYW5ndWxhckpTUHJvamVjdCA9IHRydWU7XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXNDbGFzcyA9IEFuZ3VsYXJKU0RlcGVuZGVuY2llcztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjcmF3bGVyID0gbmV3IGRlcGVuZGVuY2llc0NsYXNzKFxuICAgICAgICAgICAgdGhpcy51cGRhdGVkRmlsZXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHNjb25maWdEaXJlY3Rvcnk6IHBhdGguZGlybmFtZShDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICBSb3V0ZXJQYXJzZXJVdGlsXG4gICAgICAgICk7XG5cbiAgICAgICAgbGV0IGRlcGVuZGVuY2llc0RhdGEgPSBjcmF3bGVyLmdldERlcGVuZGVuY2llcygpO1xuXG4gICAgICAgIERlcGVuZGVuY2llc0VuZ2luZS51cGRhdGUoZGVwZW5kZW5jaWVzRGF0YSk7XG5cbiAgICAgICAgdGhpcy5wcmVwYXJlSnVzdEFGZXdUaGluZ3MoZGVwZW5kZW5jaWVzRGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVidWlsZCBleHRlcm5hbCBkb2N1bWVudGF0aW9uIGR1cmluZyB3YXRjaCBwcm9jZXNzXG4gICAgICovXG4gICAgcHJpdmF0ZSByZWJ1aWxkRXh0ZXJuYWxEb2N1bWVudGF0aW9uKCk6IHZvaWQge1xuICAgICAgICBsb2dnZXIuaW5mbygnUmVidWlsZCBleHRlcm5hbCBkb2N1bWVudGF0aW9uJyk7XG5cbiAgICAgICAgbGV0IGFjdGlvbnMgPSBbXTtcblxuICAgICAgICBDb25maWd1cmF0aW9uLnJlc2V0QWRkaXRpb25hbFBhZ2VzKCk7XG5cbiAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW5jbHVkZXMgIT09ICcnKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXBhcmVFeHRlcm5hbEluY2x1ZGVzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb21pc2VTZXF1ZW50aWFsKGFjdGlvbnMpXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc1BhZ2VzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclVwZGF0ZWRGaWxlcygpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvck1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZXRlY3RBbmd1bGFySlNQcm9qZWN0cygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMucGFja2FnZUpzb25EYXRhLmRlcGVuZGVuY2llcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5wYWNrYWdlSnNvbkRhdGEuZGVwZW5kZW5jaWVzLmFuZ3VsYXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvdW50SlNGaWxlcyA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5maWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKGZpbGUpID09PSAnLmpzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRKU0ZpbGVzICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBsZXQgcGVyY2VudE9mSlNGaWxlcyA9IChjb3VudEpTRmlsZXMgKiAxMDApIC8gdGhpcy5maWxlcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKHBlcmNlbnRPZkpTRmlsZXMgPj0gNzUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RGVwZW5kZW5jaWVzRGF0YSgpOiB2b2lkIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBkZXBlbmRlbmNpZXMgZGF0YScpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbmd1bGFySlMgZGV0ZWN0aW9uIHN0cmF0ZWd5IDpcbiAgICAgICAgICogLSBpZiBpbiBwYWNrYWdlLmpzb25cbiAgICAgICAgICogLSBpZiA3NSUgb2Ygc2Nhbm5lZCBmaWxlcyBhcmUgKi5qcyBmaWxlc1xuICAgICAgICAgKi9cbiAgICAgICAgbGV0IGRlcGVuZGVuY2llc0NsYXNzOiBBbmd1bGFyRGVwZW5kZW5jaWVzIHwgQW5ndWxhckpTRGVwZW5kZW5jaWVzID0gQW5ndWxhckRlcGVuZGVuY2llcztcbiAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5hbmd1bGFyUHJvamVjdCA9IHRydWU7XG5cbiAgICAgICAgaWYgKHRoaXMuZGV0ZWN0QW5ndWxhckpTUHJvamVjdHMoKSkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ0FuZ3VsYXJKUyBwcm9qZWN0IGRldGVjdGVkJyk7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmFuZ3VsYXJQcm9qZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmFuZ3VsYXJKU1Byb2plY3QgPSB0cnVlO1xuICAgICAgICAgICAgZGVwZW5kZW5jaWVzQ2xhc3MgPSBBbmd1bGFySlNEZXBlbmRlbmNpZXM7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3Jhd2xlciA9IG5ldyBkZXBlbmRlbmNpZXNDbGFzcyhcbiAgICAgICAgICAgIHRoaXMuZmlsZXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHNjb25maWdEaXJlY3Rvcnk6IHBhdGguZGlybmFtZShDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICBSb3V0ZXJQYXJzZXJVdGlsXG4gICAgICAgICk7XG5cbiAgICAgICAgbGV0IGRlcGVuZGVuY2llc0RhdGEgPSBjcmF3bGVyLmdldERlcGVuZGVuY2llcygpO1xuXG4gICAgICAgIERlcGVuZGVuY2llc0VuZ2luZS5pbml0KGRlcGVuZGVuY2llc0RhdGEpO1xuXG4gICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEucm91dGVzTGVuZ3RoID0gUm91dGVyUGFyc2VyVXRpbC5yb3V0ZXNMZW5ndGgoKTtcblxuICAgICAgICB0aGlzLnByaW50U3RhdGlzdGljcygpO1xuXG4gICAgICAgIHRoaXMucHJlcGFyZUV2ZXJ5dGhpbmcoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByZXBhcmVKdXN0QUZld1RoaW5ncyhkaWZmQ3Jhd2xlZERhdGEpOiB2b2lkIHtcbiAgICAgICAgbGV0IGFjdGlvbnMgPSBbXTtcblxuICAgICAgICBDb25maWd1cmF0aW9uLnJlc2V0UGFnZXMoKTtcblxuICAgICAgICBpZiAoIUNvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVJvdXRlc0dyYXBoKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4gdGhpcy5wcmVwYXJlUm91dGVzKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRpZmZDcmF3bGVkRGF0YS5jb21wb25lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB0aGlzLnByZXBhcmVDb21wb25lbnRzKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaWZmQ3Jhd2xlZERhdGEuY29udHJvbGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHRoaXMucHJlcGFyZUNvbnRyb2xsZXJzKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaWZmQ3Jhd2xlZERhdGEubW9kdWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4gdGhpcy5wcmVwYXJlTW9kdWxlcygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkaWZmQ3Jhd2xlZERhdGEuZGlyZWN0aXZlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4gdGhpcy5wcmVwYXJlRGlyZWN0aXZlcygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkaWZmQ3Jhd2xlZERhdGEuaW5qZWN0YWJsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHRoaXMucHJlcGFyZUluamVjdGFibGVzKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRpZmZDcmF3bGVkRGF0YS5pbnRlcmNlcHRvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHRoaXMucHJlcGFyZUludGVyY2VwdG9ycygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkaWZmQ3Jhd2xlZERhdGEuZ3VhcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB0aGlzLnByZXBhcmVHdWFyZHMoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGlmZkNyYXdsZWREYXRhLnBpcGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB0aGlzLnByZXBhcmVQaXBlcygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkaWZmQ3Jhd2xlZERhdGEuY2xhc3Nlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4gdGhpcy5wcmVwYXJlQ2xhc3NlcygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkaWZmQ3Jhd2xlZERhdGEuaW50ZXJmYWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4gdGhpcy5wcmVwYXJlSW50ZXJmYWNlcygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGRpZmZDcmF3bGVkRGF0YS5taXNjZWxsYW5lb3VzLnZhcmlhYmxlcy5sZW5ndGggPiAwIHx8XG4gICAgICAgICAgICBkaWZmQ3Jhd2xlZERhdGEubWlzY2VsbGFuZW91cy5mdW5jdGlvbnMubGVuZ3RoID4gMCB8fFxuICAgICAgICAgICAgZGlmZkNyYXdsZWREYXRhLm1pc2NlbGxhbmVvdXMudHlwZWFsaWFzZXMubGVuZ3RoID4gMCB8fFxuICAgICAgICAgICAgZGlmZkNyYXdsZWREYXRhLm1pc2NlbGxhbmVvdXMuZW51bWVyYXRpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4gdGhpcy5wcmVwYXJlTWlzY2VsbGFuZW91cygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlQ292ZXJhZ2UpIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB0aGlzLnByZXBhcmVDb3ZlcmFnZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb21pc2VTZXF1ZW50aWFsKGFjdGlvbnMpXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0dyYXBocygpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJVcGRhdGVkRmlsZXMoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3JNZXNzYWdlID0+IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcHJpbnRTdGF0aXN0aWNzKCkge1xuICAgICAgICBsb2dnZXIuaW5mbygnLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzdGF0aXN0aWNzICcpO1xuICAgICAgICBpZiAoRGVwZW5kZW5jaWVzRW5naW5lLm1vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYC0gZmlsZXMgICAgICA6ICR7dGhpcy5maWxlcy5sZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKERlcGVuZGVuY2llc0VuZ2luZS5tb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAtIG1vZHVsZSAgICAgOiAke0RlcGVuZGVuY2llc0VuZ2luZS5tb2R1bGVzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoRGVwZW5kZW5jaWVzRW5naW5lLmNvbXBvbmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYC0gY29tcG9uZW50ICA6ICR7RGVwZW5kZW5jaWVzRW5naW5lLmNvbXBvbmVudHMubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUuY29udHJvbGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYC0gY29udHJvbGxlciA6ICR7RGVwZW5kZW5jaWVzRW5naW5lLmNvbnRyb2xsZXJzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoRGVwZW5kZW5jaWVzRW5naW5lLmRpcmVjdGl2ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYC0gZGlyZWN0aXZlICA6ICR7RGVwZW5kZW5jaWVzRW5naW5lLmRpcmVjdGl2ZXMubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUuaW5qZWN0YWJsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYC0gaW5qZWN0YWJsZSA6ICR7RGVwZW5kZW5jaWVzRW5naW5lLmluamVjdGFibGVzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoRGVwZW5kZW5jaWVzRW5naW5lLmludGVyY2VwdG9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgLSBpbmplY3RvciAgIDogJHtEZXBlbmRlbmNpZXNFbmdpbmUuaW50ZXJjZXB0b3JzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoRGVwZW5kZW5jaWVzRW5naW5lLmd1YXJkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgLSBndWFyZCAgICAgIDogJHtEZXBlbmRlbmNpZXNFbmdpbmUuZ3VhcmRzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoRGVwZW5kZW5jaWVzRW5naW5lLnBpcGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAtIHBpcGUgICAgICAgOiAke0RlcGVuZGVuY2llc0VuZ2luZS5waXBlcy5sZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKERlcGVuZGVuY2llc0VuZ2luZS5jbGFzc2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAtIGNsYXNzICAgICAgOiAke0RlcGVuZGVuY2llc0VuZ2luZS5jbGFzc2VzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoRGVwZW5kZW5jaWVzRW5naW5lLmludGVyZmFjZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYC0gaW50ZXJmYWNlICA6ICR7RGVwZW5kZW5jaWVzRW5naW5lLmludGVyZmFjZXMubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLnJvdXRlc0xlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAtIHJvdXRlICAgICAgOiAke0NvbmZpZ3VyYXRpb24ubWFpbkRhdGEucm91dGVzTGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGxvZ2dlci5pbmZvKCctLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcmVwYXJlRXZlcnl0aGluZygpIHtcbiAgICAgICAgbGV0IGFjdGlvbnMgPSBbXTtcblxuICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlcGFyZUNvbXBvbmVudHMoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVwYXJlTW9kdWxlcygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoRGVwZW5kZW5jaWVzRW5naW5lLmRpcmVjdGl2ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVwYXJlRGlyZWN0aXZlcygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoRGVwZW5kZW5jaWVzRW5naW5lLmNvbnRyb2xsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlcGFyZUNvbnRyb2xsZXJzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUuaW5qZWN0YWJsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVwYXJlSW5qZWN0YWJsZXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKERlcGVuZGVuY2llc0VuZ2luZS5pbnRlcmNlcHRvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVwYXJlSW50ZXJjZXB0b3JzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUuZ3VhcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlcGFyZUd1YXJkcygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBEZXBlbmRlbmNpZXNFbmdpbmUucm91dGVzICYmXG4gICAgICAgICAgICBEZXBlbmRlbmNpZXNFbmdpbmUucm91dGVzLmNoaWxkcmVuLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICFDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVSb3V0ZXNHcmFwaFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlcGFyZVJvdXRlcygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoRGVwZW5kZW5jaWVzRW5naW5lLnBpcGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlcGFyZVBpcGVzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUuY2xhc3Nlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXBhcmVDbGFzc2VzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUuaW50ZXJmYWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXBhcmVJbnRlcmZhY2VzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIERlcGVuZGVuY2llc0VuZ2luZS5taXNjZWxsYW5lb3VzLnZhcmlhYmxlcy5sZW5ndGggPiAwIHx8XG4gICAgICAgICAgICBEZXBlbmRlbmNpZXNFbmdpbmUubWlzY2VsbGFuZW91cy5mdW5jdGlvbnMubGVuZ3RoID4gMCB8fFxuICAgICAgICAgICAgRGVwZW5kZW5jaWVzRW5naW5lLm1pc2NlbGxhbmVvdXMudHlwZWFsaWFzZXMubGVuZ3RoID4gMCB8fFxuICAgICAgICAgICAgRGVwZW5kZW5jaWVzRW5naW5lLm1pc2NlbGxhbmVvdXMuZW51bWVyYXRpb25zLmxlbmd0aCA+IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXBhcmVNaXNjZWxsYW5lb3VzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlQ292ZXJhZ2UpIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlcGFyZUNvdmVyYWdlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLnVuaXRUZXN0Q292ZXJhZ2UgIT09ICcnKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXBhcmVVbml0VGVzdENvdmVyYWdlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmluY2x1ZGVzICE9PSAnJykge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVwYXJlRXh0ZXJuYWxJbmNsdWRlcygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm9taXNlU2VxdWVudGlhbChhY3Rpb25zKVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5leHBvcnRGb3JtYXQgIT09IENPTVBPRE9DX0RFRkFVTFRTLmV4cG9ydEZvcm1hdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBDT01QT0RPQ19ERUZBVUxUUy5leHBvcnRGb3JtYXRzU3VwcG9ydGVkLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5leHBvcnRGb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICkgPiAtMVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBHZW5lcmF0aW5nIGRvY3VtZW50YXRpb24gaW4gZXhwb3J0IGZvcm1hdCAke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmV4cG9ydEZvcm1hdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1gXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgRXhwb3J0RW5naW5lLmV4cG9ydChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICApLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRpb25Qcm9taXNlUmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW5kQ2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0RvY3VtZW50YXRpb24gZ2VuZXJhdGVkIGluICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyBpbiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RWxhcHNlZFRpbWUoKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnIHNlY29uZHMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oYEV4cG9ydGVkIGZvcm1hdCBub3Qgc3VwcG9ydGVkYCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NHcmFwaHMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yTWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEluY2x1ZGVkUGF0aEZvckZpbGUoZmlsZSkge1xuICAgICAgICByZXR1cm4gcGF0aC5qb2luKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW5jbHVkZXMsIGZpbGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcHJlcGFyZUV4dGVybmFsSW5jbHVkZXMoKSB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdBZGRpbmcgZXh0ZXJuYWwgbWFya2Rvd24gZmlsZXMnKTtcbiAgICAgICAgLy8gU2NhbiBpbmNsdWRlIGZvbGRlciBmb3IgZmlsZXMgZGV0YWlsZWQgaW4gc3VtbWFyeS5qc29uXG4gICAgICAgIC8vIEZvciBlYWNoIGZpbGUsIGFkZCB0byBDb25maWd1cmF0aW9uLm1haW5EYXRhLmFkZGl0aW9uYWxQYWdlc1xuICAgICAgICAvLyBFYWNoIGZpbGUgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gaHRtbCBwYWdlLCBpbnNpZGUgQ09NUE9ET0NfREVGQVVMVFMuYWRkaXRpb25hbEVudHJ5UGF0aFxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgRmlsZUVuZ2luZS5nZXQodGhpcy5nZXRJbmNsdWRlZFBhdGhGb3JGaWxlKCdzdW1tYXJ5Lmpzb24nKSkudGhlbihcbiAgICAgICAgICAgICAgICBzdW1tYXJ5RGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdBZGRpdGlvbmFsIGRvY3VtZW50YXRpb246IHN1bW1hcnkuanNvbiBmaWxlIGZvdW5kJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkU3VtbWFyeURhdGEgPSBKU09OLnBhcnNlKHN1bW1hcnlEYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIGxldCBsYXN0TGV2ZWxPbmVQYWdlID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgICAgIHRyYXZlcnNlKHBhcnNlZFN1bW1hcnlEYXRhKS5mb3JFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWludmFsaWQtdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubm90Um9vdCAmJiB0eXBlb2YgdGhpcy5ub2RlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbnZhbGlkLXRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmF3UGF0aCA9IHRoaXMucGF0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW52YWxpZC10aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFkZGl0aW9uYWxOb2RlOiBBZGRpdGlvbmFsTm9kZSA9IHRoaXMubm9kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmlsZSA9IGFkZGl0aW9uYWxOb2RlLmZpbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpdGxlID0gYWRkaXRpb25hbE5vZGUudGl0bGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmFsUGF0aCA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW5jbHVkZXNGb2xkZXI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmluYWxEZXB0aCA9IHJhd1BhdGguZmlsdGVyKGVsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUludChlbCwgMTApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZmlsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHRpdGxlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBjbGVhbk5hbWVXaXRob3V0U3BhY2VBbmRUb0xvd2VyQ2FzZSh0aXRsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIElkIGNyZWF0ZWQgd2l0aCB0aXRsZSArIGZpbGUgcGF0aCBoYXNoLCBzZWVtcyB0byBiZSBoeXBvdGhldGljYWxseSB1bmlxdWUgaGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSBjcnlwdG9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jcmVhdGVIYXNoKCdtZDUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZSh0aXRsZSArIGZpbGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGlnZXN0KCdoZXgnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW52YWxpZC10aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5pZCA9IGlkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsYXN0RWxlbWVudFJvb3RUcmVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbERlcHRoLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1lbnRUcmVlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgbGFzdEVsZW1lbnRSb290VHJlZSA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBwYXJzZWRTdW1tYXJ5RGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGxhc3RFbGVtZW50Um9vdFRyZWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnRUcmVlLmNoaWxkcmVuICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRUcmVlID0gZWxlbWVudFRyZWUuY2hpbGRyZW5bZWxdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VHJlZSA9IGVsZW1lbnRUcmVlW2VsXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsUGF0aCArPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcvJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYW5OYW1lV2l0aG91dFNwYWNlQW5kVG9Mb3dlckNhc2UoZWxlbWVudFRyZWUudGl0bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEVsZW1lbnRSb290VHJlZSA9IGVsZW1lbnRUcmVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFBhdGggPSBmaW5hbFBhdGgucmVwbGFjZSgnLycgKyB1cmwsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1hcmtkb3duRmlsZSA9IE1hcmtkb3duRW5naW5lLmdldFRyYWRpdGlvbmFsTWFya2Rvd25TeW5jKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5nZXRJbmNsdWRlZFBhdGhGb3JGaWxlKGZpbGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmFsRGVwdGgubGVuZ3RoID4gNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdPbmx5IDUgbGV2ZWxzIG9mIGRlcHRoIGFyZSBzdXBwb3J0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBfcGFnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAnYWRkaXRpb25hbC1wYWdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBmaW5hbFBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbFBhZ2U6IG1hcmtkb3duRmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXB0aDogZmluYWxEZXB0aC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5MZW5ndGg6IGFkZGl0aW9uYWxOb2RlLmNoaWxkcmVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYWRkaXRpb25hbE5vZGUuY2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdENoaWxkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5JTlRFUk5BTFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaW5hbERlcHRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RMZXZlbE9uZVBhZ2UgPSBfcGFnZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaW5hbERlcHRoLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSBhbGwgY2hpbGQgcGFnZXMgb2YgdGhlIGxhc3Qgcm9vdCBsZXZlbCAxIHBhZ2UgaW5zaWRlIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdExldmVsT25lUGFnZS5jaGlsZHJlbi5wdXNoKF9wYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hZGRBZGRpdGlvbmFsUGFnZShfcGFnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoJ0Vycm9yIGR1cmluZyBBZGRpdGlvbmFsIGRvY3VtZW50YXRpb24gZ2VuZXJhdGlvbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcmVwYXJlTW9kdWxlcyhzb21lTW9kdWxlcz8pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJlcGFyZSBtb2R1bGVzJyk7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IF9tb2R1bGVzID0gc29tZU1vZHVsZXMgPyBzb21lTW9kdWxlcyA6IERlcGVuZGVuY2llc0VuZ2luZS5nZXRNb2R1bGVzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubW9kdWxlcyA9IF9tb2R1bGVzLm1hcChuZ01vZHVsZSA9PiB7XG4gICAgICAgICAgICAgICAgbmdNb2R1bGUuY29tcG9kb2NMaW5rcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50czogW10sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlczogW10sXG4gICAgICAgICAgICAgICAgICAgIGluamVjdGFibGVzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgcGlwZXM6IFtdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBbJ2RlY2xhcmF0aW9ucycsICdib290c3RyYXAnLCAnaW1wb3J0cycsICdleHBvcnRzJywgJ2NvbnRyb2xsZXJzJ10uZm9yRWFjaChcbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGFUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kdWxlW21ldGFkYXRhVHlwZV0gPSBuZ01vZHVsZVttZXRhZGF0YVR5cGVdLmZpbHRlcihtZXRhRGF0YUl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAobWV0YURhdGFJdGVtLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGlyZWN0aXZlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0RGlyZWN0aXZlcygpLnNvbWUoZGlyZWN0aXZlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWREaXJlY3RpdmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtZXRhRGF0YUl0ZW0uaWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRGlyZWN0aXZlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChkaXJlY3RpdmUgYXMgYW55KS5pZCA9PT0gbWV0YURhdGFJdGVtLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRGlyZWN0aXZlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChkaXJlY3RpdmUgYXMgYW55KS5uYW1lID09PSBtZXRhRGF0YUl0ZW0ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZERpcmVjdGl2ZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhbmdNb2R1bGUuY29tcG9kb2NMaW5rcy5kaXJlY3RpdmVzLmluY2x1ZGVzKGRpcmVjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2R1bGUuY29tcG9kb2NMaW5rcy5kaXJlY3RpdmVzLnB1c2goZGlyZWN0aXZlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGVkRGlyZWN0aXZlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29tcG9uZW50JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0Q29tcG9uZW50cygpLnNvbWUoY29tcG9uZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtZXRhRGF0YUl0ZW0uaWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29tcG9uZW50ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb21wb25lbnQgYXMgYW55KS5pZCA9PT0gbWV0YURhdGFJdGVtLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29tcG9uZW50ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb21wb25lbnQgYXMgYW55KS5uYW1lID09PSBtZXRhRGF0YUl0ZW0ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZENvbXBvbmVudCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhbmdNb2R1bGUuY29tcG9kb2NMaW5rcy5jb21wb25lbnRzLmluY2x1ZGVzKGNvbXBvbmVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2R1bGUuY29tcG9kb2NMaW5rcy5jb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGVkQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29udHJvbGxlcic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRGVwZW5kZW5jaWVzRW5naW5lLmdldENvbnRyb2xsZXJzKCkuc29tZShjb250cm9sbGVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRDb250cm9sbGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWV0YURhdGFJdGVtLmlkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZENvbnRyb2xsZXIgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbnRyb2xsZXIgYXMgYW55KS5pZCA9PT0gbWV0YURhdGFJdGVtLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29udHJvbGxlciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29udHJvbGxlciBhcyBhbnkpLm5hbWUgPT09IG1ldGFEYXRhSXRlbS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29udHJvbGxlciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhbmdNb2R1bGUuY29tcG9kb2NMaW5rcy5jb250cm9sbGVycy5pbmNsdWRlcyhjb250cm9sbGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZ01vZHVsZS5jb21wb2RvY0xpbmtzLmNvbnRyb2xsZXJzLnB1c2goY29udHJvbGxlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxlY3RlZENvbnRyb2xsZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdtb2R1bGUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERlcGVuZGVuY2llc0VuZ2luZS5nZXRNb2R1bGVzKCkuc29tZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGUgPT4gKG1vZHVsZSBhcyBhbnkpLm5hbWUgPT09IG1ldGFEYXRhSXRlbS5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BpcGUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERlcGVuZGVuY2llc0VuZ2luZS5nZXRQaXBlcygpLnNvbWUocGlwZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkUGlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1ldGFEYXRhSXRlbS5pZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRQaXBlID0gKHBpcGUgYXMgYW55KS5pZCA9PT0gbWV0YURhdGFJdGVtLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkUGlwZSA9IChwaXBlIGFzIGFueSkubmFtZSA9PT0gbWV0YURhdGFJdGVtLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRQaXBlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFuZ01vZHVsZS5jb21wb2RvY0xpbmtzLnBpcGVzLmluY2x1ZGVzKHBpcGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kdWxlLmNvbXBvZG9jTGlua3MucGlwZXMucHVzaChwaXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGVkUGlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgbmdNb2R1bGUucHJvdmlkZXJzID0gbmdNb2R1bGUucHJvdmlkZXJzLmZpbHRlcihwcm92aWRlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0SW5qZWN0YWJsZXMoKS5zb21lKGluamVjdGFibGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZEluamVjdGFibGUgPSAoaW5qZWN0YWJsZSBhcyBhbnkpLm5hbWUgPT09IHByb3ZpZGVyLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEluamVjdGFibGUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIW5nTW9kdWxlLmNvbXBvZG9jTGlua3MuaW5qZWN0YWJsZXMuaW5jbHVkZXMoaW5qZWN0YWJsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2R1bGUuY29tcG9kb2NMaW5rcy5pbmplY3RhYmxlcy5wdXNoKGluamVjdGFibGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0ZWRJbmplY3RhYmxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIERlcGVuZGVuY2llc0VuZ2luZS5nZXRJbnRlcmNlcHRvcnMoKS5zb21lKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyY2VwdG9yID0+IChpbnRlcmNlcHRvciBhcyBhbnkpLm5hbWUgPT09IHByb3ZpZGVyLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBUcnkgZml4aW5nIHR5cGUgdW5kZWZpbmVkIGZvciBlYWNoIHByb3ZpZGVyc1xuICAgICAgICAgICAgICAgIF8uZm9yRWFjaChuZ01vZHVsZS5wcm92aWRlcnMsIHByb3ZpZGVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgRGVwZW5kZW5jaWVzRW5naW5lLmdldEluamVjdGFibGVzKCkuZmluZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmplY3RhYmxlID0+IChpbmplY3RhYmxlIGFzIGFueSkubmFtZSA9PT0gcHJvdmlkZXIubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyLnR5cGUgPSAnaW5qZWN0YWJsZSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgRGVwZW5kZW5jaWVzRW5naW5lLmdldEludGVyY2VwdG9ycygpLmZpbmQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJjZXB0b3IgPT4gKGludGVyY2VwdG9yIGFzIGFueSkubmFtZSA9PT0gcHJvdmlkZXIubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyLnR5cGUgPSAnaW50ZXJjZXB0b3InO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gT3JkZXIgdGhpbmdzXG4gICAgICAgICAgICAgICAgbmdNb2R1bGUuY29tcG9kb2NMaW5rcy5jb21wb25lbnRzID0gXy5zb3J0QnkobmdNb2R1bGUuY29tcG9kb2NMaW5rcy5jb21wb25lbnRzLCBbXG4gICAgICAgICAgICAgICAgICAgICduYW1lJ1xuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIG5nTW9kdWxlLmNvbXBvZG9jTGlua3MuY29udHJvbGxlcnMgPSBfLnNvcnRCeShuZ01vZHVsZS5jb21wb2RvY0xpbmtzLmNvbnRyb2xsZXJzLCBbXG4gICAgICAgICAgICAgICAgICAgICduYW1lJ1xuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIG5nTW9kdWxlLmNvbXBvZG9jTGlua3MuZGlyZWN0aXZlcyA9IF8uc29ydEJ5KG5nTW9kdWxlLmNvbXBvZG9jTGlua3MuZGlyZWN0aXZlcywgW1xuICAgICAgICAgICAgICAgICAgICAnbmFtZSdcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICBuZ01vZHVsZS5jb21wb2RvY0xpbmtzLmluamVjdGFibGVzID0gXy5zb3J0QnkobmdNb2R1bGUuY29tcG9kb2NMaW5rcy5pbmplY3RhYmxlcywgW1xuICAgICAgICAgICAgICAgICAgICAnbmFtZSdcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICBuZ01vZHVsZS5jb21wb2RvY0xpbmtzLnBpcGVzID0gXy5zb3J0QnkobmdNb2R1bGUuY29tcG9kb2NMaW5rcy5waXBlcywgWyduYW1lJ10pO1xuXG4gICAgICAgICAgICAgICAgbmdNb2R1bGUuZGVjbGFyYXRpb25zID0gXy5zb3J0QnkobmdNb2R1bGUuZGVjbGFyYXRpb25zLCBbJ25hbWUnXSk7XG4gICAgICAgICAgICAgICAgbmdNb2R1bGUuZW50cnlDb21wb25lbnRzID0gXy5zb3J0QnkobmdNb2R1bGUuZW50cnlDb21wb25lbnRzLCBbJ25hbWUnXSk7XG4gICAgICAgICAgICAgICAgbmdNb2R1bGUucHJvdmlkZXJzID0gXy5zb3J0QnkobmdNb2R1bGUucHJvdmlkZXJzLCBbJ25hbWUnXSk7XG4gICAgICAgICAgICAgICAgbmdNb2R1bGUuaW1wb3J0cyA9IF8uc29ydEJ5KG5nTW9kdWxlLmltcG9ydHMsIFsnbmFtZSddKTtcbiAgICAgICAgICAgICAgICBuZ01vZHVsZS5leHBvcnRzID0gXy5zb3J0QnkobmdNb2R1bGUuZXhwb3J0cywgWyduYW1lJ10pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5nTW9kdWxlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZSh7XG4gICAgICAgICAgICAgICAgbmFtZTogJ21vZHVsZXMnLFxuICAgICAgICAgICAgICAgIGlkOiAnbW9kdWxlcycsXG4gICAgICAgICAgICAgICAgY29udGV4dDogJ21vZHVsZXMnLFxuICAgICAgICAgICAgICAgIGRlcHRoOiAwLFxuICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLlJPT1RcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgbGVuID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5tb2R1bGVzLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBsb29wID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpIDwgbGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hcmtkb3duRW5naW5lLmhhc05laWdoYm91clJlYWRtZUZpbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5tb2R1bGVzW2ldLmZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgICR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubW9kdWxlc1tpXS5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBoYXMgYSBSRUFETUUgZmlsZSwgaW5jbHVkZSBpdGBcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVhZG1lID0gTWFya2Rvd25FbmdpbmUucmVhZE5laWdoYm91clJlYWRtZUZpbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5tb2R1bGVzW2ldLmZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm1vZHVsZXNbaV0ucmVhZG1lID0gbWFya2VkKHJlYWRtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hZGRQYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6ICdtb2R1bGVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubW9kdWxlc1tpXS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubW9kdWxlc1tpXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdlRhYnM6IHRoaXMuZ2V0TmF2VGFicyhDb25maWd1cmF0aW9uLm1haW5EYXRhLm1vZHVsZXNbaV0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogJ21vZHVsZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGU6IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubW9kdWxlc1tpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuSU5URVJOQUxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJlcGFyZVBpcGVzID0gKHNvbWVQaXBlcz8pID0+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1ByZXBhcmUgcGlwZXMnKTtcbiAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5waXBlcyA9IHNvbWVQaXBlcyA/IHNvbWVQaXBlcyA6IERlcGVuZGVuY2llc0VuZ2luZS5nZXRQaXBlcygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5waXBlcy5sZW5ndGg7XG4gICAgICAgICAgICBsZXQgbG9vcCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGlwZSA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEucGlwZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXJrZG93bkVuZ2luZS5oYXNOZWlnaGJvdXJSZWFkbWVGaWxlKHBpcGUuZmlsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgJHtwaXBlLm5hbWV9IGhhcyBhIFJFQURNRSBmaWxlLCBpbmNsdWRlIGl0YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVhZG1lID0gTWFya2Rvd25FbmdpbmUucmVhZE5laWdoYm91clJlYWRtZUZpbGUocGlwZS5maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpcGUucmVhZG1lID0gbWFya2VkKHJlYWRtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhZ2UgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiAncGlwZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogcGlwZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHBpcGUuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYXZUYWJzOiB0aGlzLmdldE5hdlRhYnMocGlwZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAncGlwZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaXBlOiBwaXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5JTlRFUk5BTFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAocGlwZS5pc0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZS5uYW1lICs9ICctJyArIHBpcGUuZHVwbGljYXRlSWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hZGRQYWdlKHBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBwcmVwYXJlQ2xhc3NlcyA9IChzb21lQ2xhc3Nlcz8pID0+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1ByZXBhcmUgY2xhc3NlcycpO1xuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNsYXNzZXMgPSBzb21lQ2xhc3Nlc1xuICAgICAgICAgICAgPyBzb21lQ2xhc3Nlc1xuICAgICAgICAgICAgOiBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0Q2xhc3NlcygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jbGFzc2VzLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBsb29wID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpIDwgbGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc2UgPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNsYXNzZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXJrZG93bkVuZ2luZS5oYXNOZWlnaGJvdXJSZWFkbWVGaWxlKGNsYXNzZS5maWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAke2NsYXNzZS5uYW1lfSBoYXMgYSBSRUFETUUgZmlsZSwgaW5jbHVkZSBpdGApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlYWRtZSA9IE1hcmtkb3duRW5naW5lLnJlYWROZWlnaGJvdXJSZWFkbWVGaWxlKGNsYXNzZS5maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZS5yZWFkbWUgPSBtYXJrZWQocmVhZG1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6ICdjbGFzc2VzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNsYXNzZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGNsYXNzZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdlRhYnM6IHRoaXMuZ2V0TmF2VGFicyhjbGFzc2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogJ2NsYXNzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBjbGFzc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXB0aDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLklOVEVSTkFMXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGFzc2UuaXNEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UubmFtZSArPSAnLScgKyBjbGFzc2UuZHVwbGljYXRlSWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hZGRQYWdlKHBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBwcmVwYXJlSW50ZXJmYWNlcyhzb21lSW50ZXJmYWNlcz8pIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1ByZXBhcmUgaW50ZXJmYWNlcycpO1xuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmludGVyZmFjZXMgPSBzb21lSW50ZXJmYWNlc1xuICAgICAgICAgICAgPyBzb21lSW50ZXJmYWNlc1xuICAgICAgICAgICAgOiBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0SW50ZXJmYWNlcygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbnRlcmZhY2VzLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBsb29wID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpIDwgbGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbnRlcmYgPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmludGVyZmFjZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXJrZG93bkVuZ2luZS5oYXNOZWlnaGJvdXJSZWFkbWVGaWxlKGludGVyZi5maWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAke2ludGVyZi5uYW1lfSBoYXMgYSBSRUFETUUgZmlsZSwgaW5jbHVkZSBpdGApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlYWRtZSA9IE1hcmtkb3duRW5naW5lLnJlYWROZWlnaGJvdXJSZWFkbWVGaWxlKGludGVyZi5maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVyZi5yZWFkbWUgPSBtYXJrZWQocmVhZG1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6ICdpbnRlcmZhY2VzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGludGVyZi5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGludGVyZi5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdlRhYnM6IHRoaXMuZ2V0TmF2VGFicyhpbnRlcmYpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogJ2ludGVyZmFjZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcmZhY2U6IGludGVyZixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuSU5URVJOQUxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGludGVyZi5pc0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZS5uYW1lICs9ICctJyArIGludGVyZi5kdXBsaWNhdGVJZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2UocGFnZSk7XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJlcGFyZU1pc2NlbGxhbmVvdXMoc29tZU1pc2M/KSB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcmVwYXJlIG1pc2NlbGxhbmVvdXMnKTtcbiAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5taXNjZWxsYW5lb3VzID0gc29tZU1pc2NcbiAgICAgICAgICAgID8gc29tZU1pc2NcbiAgICAgICAgICAgIDogRGVwZW5kZW5jaWVzRW5naW5lLmdldE1pc2NlbGxhbmVvdXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubWlzY2VsbGFuZW91cy5mdW5jdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZSh7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6ICdtaXNjZWxsYW5lb3VzJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2Z1bmN0aW9ucycsXG4gICAgICAgICAgICAgICAgICAgIGlkOiAnbWlzY2VsbGFuZW91cy1mdW5jdGlvbnMnLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAnbWlzY2VsbGFuZW91cy1mdW5jdGlvbnMnLFxuICAgICAgICAgICAgICAgICAgICBkZXB0aDogMSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuSU5URVJOQUxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLm1pc2NlbGxhbmVvdXMudmFyaWFibGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiAnbWlzY2VsbGFuZW91cycsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICd2YXJpYWJsZXMnLFxuICAgICAgICAgICAgICAgICAgICBpZDogJ21pc2NlbGxhbmVvdXMtdmFyaWFibGVzJyxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDogJ21pc2NlbGxhbmVvdXMtdmFyaWFibGVzJyxcbiAgICAgICAgICAgICAgICAgICAgZGVwdGg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLklOVEVSTkFMXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5taXNjZWxsYW5lb3VzLnR5cGVhbGlhc2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiAnbWlzY2VsbGFuZW91cycsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICd0eXBlYWxpYXNlcycsXG4gICAgICAgICAgICAgICAgICAgIGlkOiAnbWlzY2VsbGFuZW91cy10eXBlYWxpYXNlcycsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6ICdtaXNjZWxsYW5lb3VzLXR5cGVhbGlhc2VzJyxcbiAgICAgICAgICAgICAgICAgICAgZGVwdGg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLklOVEVSTkFMXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5taXNjZWxsYW5lb3VzLmVudW1lcmF0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hZGRQYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogJ21pc2NlbGxhbmVvdXMnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZW51bWVyYXRpb25zJyxcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdtaXNjZWxsYW5lb3VzLWVudW1lcmF0aW9ucycsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6ICdtaXNjZWxsYW5lb3VzLWVudW1lcmF0aW9ucycsXG4gICAgICAgICAgICAgICAgICAgIGRlcHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5JTlRFUk5BTFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlVGVtcGxhdGV1cmwoY29tcG9uZW50KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgbGV0IGRpcm5hbWUgPSBwYXRoLmRpcm5hbWUoY29tcG9uZW50LmZpbGUpO1xuICAgICAgICBsZXQgdGVtcGxhdGVQYXRoID0gcGF0aC5yZXNvbHZlKGRpcm5hbWUgKyBwYXRoLnNlcCArIGNvbXBvbmVudC50ZW1wbGF0ZVVybCk7XG5cbiAgICAgICAgaWYgKCFGaWxlRW5naW5lLmV4aXN0c1N5bmModGVtcGxhdGVQYXRoKSkge1xuICAgICAgICAgICAgbGV0IGVyciA9IGBDYW5ub3QgcmVhZCB0ZW1wbGF0ZSBmb3IgJHtjb21wb25lbnQubmFtZX1gO1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge30pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEZpbGVFbmdpbmUuZ2V0KHRlbXBsYXRlUGF0aCkudGhlbihcbiAgICAgICAgICAgIGRhdGEgPT4gKGNvbXBvbmVudC50ZW1wbGF0ZURhdGEgPSBkYXRhKSxcbiAgICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZVN0eWxlcyhjb21wb25lbnQpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsZXQgc3R5bGVzID0gY29tcG9uZW50LnN0eWxlcztcbiAgICAgICAgY29tcG9uZW50LnN0eWxlc0RhdGEgPSAnJztcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlU3R5bGVzLCByZWplY3RTdHlsZXMpID0+IHtcbiAgICAgICAgICAgIHN0eWxlcy5mb3JFYWNoKHN0eWxlID0+IHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuc3R5bGVzRGF0YSA9IGNvbXBvbmVudC5zdHlsZXNEYXRhICsgc3R5bGUgKyAnXFxuJztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzb2x2ZVN0eWxlcygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZVN0eWxldXJscyhjb21wb25lbnQpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsZXQgZGlybmFtZSA9IHBhdGguZGlybmFtZShjb21wb25lbnQuZmlsZSk7XG5cbiAgICAgICAgbGV0IHN0eWxlRGF0YVByb21pc2UgPSBjb21wb25lbnQuc3R5bGVVcmxzLm1hcChzdHlsZVVybCA9PiB7XG4gICAgICAgICAgICBsZXQgc3R5bGVQYXRoID0gcGF0aC5yZXNvbHZlKGRpcm5hbWUgKyBwYXRoLnNlcCArIHN0eWxlVXJsKTtcblxuICAgICAgICAgICAgaWYgKCFGaWxlRW5naW5lLmV4aXN0c1N5bmMoc3R5bGVQYXRoKSkge1xuICAgICAgICAgICAgICAgIGxldCBlcnIgPSBgQ2Fubm90IHJlYWQgc3R5bGUgdXJsICR7c3R5bGVQYXRofSBmb3IgJHtjb21wb25lbnQubmFtZX1gO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7fSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgRmlsZUVuZ2luZS5nZXQoc3R5bGVQYXRoKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVVybFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoc3R5bGVEYXRhUHJvbWlzZSkudGhlbihcbiAgICAgICAgICAgIGRhdGEgPT4gKGNvbXBvbmVudC5zdHlsZVVybHNEYXRhID0gZGF0YSksXG4gICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROYXZUYWJzKGRlcGVuZGVuY3kpOiBBcnJheTxhbnk+IHtcbiAgICAgICAgbGV0IG5hdlRhYkNvbmZpZyA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubmF2VGFiQ29uZmlnO1xuICAgICAgICBuYXZUYWJDb25maWcgPVxuICAgICAgICAgICAgbmF2VGFiQ29uZmlnLmxlbmd0aCA9PT0gMFxuICAgICAgICAgICAgICAgID8gXy5jbG9uZURlZXAoQ09NUE9ET0NfQ09OU1RBTlRTLm5hdlRhYkRlZmluaXRpb25zKVxuICAgICAgICAgICAgICAgIDogbmF2VGFiQ29uZmlnO1xuICAgICAgICBsZXQgbWF0Y2hEZXBUeXBlID0gKGRlcFR5cGU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGRlcFR5cGUgPT09ICdhbGwnIHx8IGRlcFR5cGUgPT09IGRlcGVuZGVuY3kudHlwZTtcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgbmF2VGFicyA9IFtdO1xuICAgICAgICBfLmZvckVhY2gobmF2VGFiQ29uZmlnLCBjdXN0b21UYWIgPT4ge1xuICAgICAgICAgICAgbGV0IG5hdlRhYiA9IF8uZmluZChDT01QT0RPQ19DT05TVEFOVFMubmF2VGFiRGVmaW5pdGlvbnMsIHsgaWQ6IGN1c3RvbVRhYi5pZCB9KTtcbiAgICAgICAgICAgIGlmICghbmF2VGFiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHRhYiBJRCAnJHtjdXN0b21UYWIuaWR9JyBzcGVjaWZpZWQgaW4gdGFiIGNvbmZpZ3VyYXRpb25gKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmF2VGFiLmxhYmVsID0gY3VzdG9tVGFiLmxhYmVsO1xuXG4gICAgICAgICAgICAvLyBpcyB0YWIgYXBwbGljYWJsZSB0byB0YXJnZXQgZGVwZW5kZW5jeT9cbiAgICAgICAgICAgIGlmICgtMSA9PT0gXy5maW5kSW5kZXgobmF2VGFiLmRlcFR5cGVzLCBtYXRjaERlcFR5cGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBnbG9iYWwgY29uZmlnXG4gICAgICAgICAgICBpZiAoY3VzdG9tVGFiLmlkID09PSAndHJlZScgJiYgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlRG9tVHJlZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdXN0b21UYWIuaWQgPT09ICdzb3VyY2UnICYmIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVNvdXJjZUNvZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY3VzdG9tVGFiLmlkID09PSAndGVtcGxhdGVEYXRhJyAmJiBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVUZW1wbGF0ZVRhYikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdXN0b21UYWIuaWQgPT09ICdzdHlsZURhdGEnICYmIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVN0eWxlVGFiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBwZXIgZGVwZW5kZW5jeSBjb25maWdcbiAgICAgICAgICAgIGlmIChjdXN0b21UYWIuaWQgPT09ICdyZWFkbWUnICYmICFkZXBlbmRlbmN5LnJlYWRtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdXN0b21UYWIuaWQgPT09ICdleGFtcGxlJyAmJiAhZGVwZW5kZW5jeS5leGFtcGxlVXJscykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjdXN0b21UYWIuaWQgPT09ICd0ZW1wbGF0ZURhdGEnICYmXG4gICAgICAgICAgICAgICAgKCFkZXBlbmRlbmN5LnRlbXBsYXRlVXJsIHx8IGRlcGVuZGVuY3kudGVtcGxhdGVVcmwubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGN1c3RvbVRhYi5pZCA9PT0gJ3N0eWxlRGF0YScgJiZcbiAgICAgICAgICAgICAgICAoKCFkZXBlbmRlbmN5LnN0eWxlVXJscyB8fCBkZXBlbmRlbmN5LnN0eWxlVXJscy5sZW5ndGggPT09IDApICYmXG4gICAgICAgICAgICAgICAgICAgICghZGVwZW5kZW5jeS5zdHlsZXMgfHwgZGVwZW5kZW5jeS5zdHlsZXMubGVuZ3RoID09PSAwKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmF2VGFicy5wdXNoKG5hdlRhYik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChuYXZUYWJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyB2YWxpZCBuYXZpZ2F0aW9uIHRhYnMgaGF2ZSBiZWVuIGRlZmluZWQgZm9yIGRlcGVuZGVuY3kgdHlwZSAnJHtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5LnR5cGVcbiAgICAgICAgICAgIH0nLiBTcGVjaWZ5IFxcXG5hdCBsZWFzdCBvbmUgY29uZmlnIGZvciB0aGUgJ2luZm8nIG9yICdzb3VyY2UnIHRhYiBpbiAtLW5hdlRhYkNvbmZpZy5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuYXZUYWJzO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcmVwYXJlQ29udHJvbGxlcnMoc29tZUNvbnRyb2xsZXJzPykge1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJlcGFyZSBjb250cm9sbGVycycpO1xuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvbnRyb2xsZXJzID0gc29tZUNvbnRyb2xsZXJzXG4gICAgICAgICAgICA/IHNvbWVDb250cm9sbGVyc1xuICAgICAgICAgICAgOiBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0Q29udHJvbGxlcnMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgbGV0IGxlbiA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY29udHJvbGxlcnMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGxvb3AgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRyb2xsZXIgPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvbnRyb2xsZXJzW2ldO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6ICdjb250cm9sbGVycycsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb250cm9sbGVyLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogY29udHJvbGxlci5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdlRhYnM6IHRoaXMuZ2V0TmF2VGFicyhjb250cm9sbGVyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6ICdjb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXB0aDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLklOVEVSTkFMXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250cm9sbGVyLmlzRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlLm5hbWUgKz0gJy0nICsgY29udHJvbGxlci5kdXBsaWNhdGVJZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2UocGFnZSk7XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJlcGFyZUNvbXBvbmVudHMoc29tZUNvbXBvbmVudHM/KSB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcmVwYXJlIGNvbXBvbmVudHMnKTtcbiAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb21wb25lbnRzID0gc29tZUNvbXBvbmVudHNcbiAgICAgICAgICAgID8gc29tZUNvbXBvbmVudHNcbiAgICAgICAgICAgIDogRGVwZW5kZW5jaWVzRW5naW5lLmdldENvbXBvbmVudHMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKG1haW5QcmVwYXJlQ29tcG9uZW50UmVzb2x2ZSwgbWFpblByZXBhcmVDb21wb25lbnRSZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGxldCBsZW4gPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvbXBvbmVudHMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGxvb3AgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPD0gbGVuIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50ID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb21wb25lbnRzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWFya2Rvd25FbmdpbmUuaGFzTmVpZ2hib3VyUmVhZG1lRmlsZShjb21wb25lbnQuZmlsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgJHtjb21wb25lbnQubmFtZX0gaGFzIGEgUkVBRE1FIGZpbGUsIGluY2x1ZGUgaXRgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZWFkbWVGaWxlID0gTWFya2Rvd25FbmdpbmUucmVhZE5laWdoYm91clJlYWRtZUZpbGUoY29tcG9uZW50LmZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LnJlYWRtZSA9IG1hcmtlZChyZWFkbWVGaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6ICdjb21wb25lbnRzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvbXBvbmVudC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGNvbXBvbmVudC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdlRhYnM6IHRoaXMuZ2V0TmF2VGFicyhjb21wb25lbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogJ2NvbXBvbmVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6IGNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuSU5URVJOQUxcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmlzRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlLm5hbWUgKz0gJy0nICsgY29tcG9uZW50LmR1cGxpY2F0ZUlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZShwYWdlKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRUZW1wbGF0ZVVybFByb21pc2UgPSBuZXcgUHJvbWlzZShcbiAgICAgICAgICAgICAgICAgICAgICAgIChjb21wb25lbnRUZW1wbGF0ZVVybFJlc29sdmUsIGNvbXBvbmVudFRlbXBsYXRlVXJsUmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC50ZW1wbGF0ZVVybC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgJHtjb21wb25lbnQubmFtZX0gaGFzIGEgdGVtcGxhdGVVcmwsIGluY2x1ZGUgaXRgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVUZW1wbGF0ZXVybChjb21wb25lbnQpLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50VGVtcGxhdGVVcmxSZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFRlbXBsYXRlVXJsUmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50VGVtcGxhdGVVcmxSZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRTdHlsZVVybHNQcm9taXNlID0gbmV3IFByb21pc2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAoY29tcG9uZW50U3R5bGVVcmxzUmVzb2x2ZSwgY29tcG9uZW50U3R5bGVVcmxzUmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5zdHlsZVVybHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgICR7Y29tcG9uZW50Lm5hbWV9IGhhcyBzdHlsZVVybHMsIGluY2x1ZGUgdGhlbWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVN0eWxldXJscyhjb21wb25lbnQpLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50U3R5bGVVcmxzUmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRTdHlsZVVybHNSZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRTdHlsZVVybHNSZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRTdHlsZXNQcm9taXNlID0gbmV3IFByb21pc2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAoY29tcG9uZW50U3R5bGVzUmVzb2x2ZSwgY29tcG9uZW50U3R5bGVzUmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5zdHlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgICR7Y29tcG9uZW50Lm5hbWV9IGhhcyBzdHlsZXMsIGluY2x1ZGUgdGhlbWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVN0eWxlcyhjb21wb25lbnQpLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50U3R5bGVzUmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRTdHlsZXNSZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRTdHlsZXNSZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFRlbXBsYXRlVXJsUHJvbWlzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFN0eWxlVXJsc1Byb21pc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRTdHlsZXNQcm9taXNlXG4gICAgICAgICAgICAgICAgICAgIF0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtYWluUHJlcGFyZUNvbXBvbmVudFJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJlcGFyZURpcmVjdGl2ZXMoc29tZURpcmVjdGl2ZXM/KSB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcmVwYXJlIGRpcmVjdGl2ZXMnKTtcblxuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpcmVjdGl2ZXMgPSBzb21lRGlyZWN0aXZlc1xuICAgICAgICAgICAgPyBzb21lRGlyZWN0aXZlc1xuICAgICAgICAgICAgOiBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0RGlyZWN0aXZlcygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXJlY3RpdmVzLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBsb29wID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpIDwgbGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXJlY3RpdmUgPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpcmVjdGl2ZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXJrZG93bkVuZ2luZS5oYXNOZWlnaGJvdXJSZWFkbWVGaWxlKGRpcmVjdGl2ZS5maWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAke2RpcmVjdGl2ZS5uYW1lfSBoYXMgYSBSRUFETUUgZmlsZSwgaW5jbHVkZSBpdGApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlYWRtZSA9IE1hcmtkb3duRW5naW5lLnJlYWROZWlnaGJvdXJSZWFkbWVGaWxlKGRpcmVjdGl2ZS5maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZS5yZWFkbWUgPSBtYXJrZWQocmVhZG1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6ICdkaXJlY3RpdmVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGRpcmVjdGl2ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGRpcmVjdGl2ZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdlRhYnM6IHRoaXMuZ2V0TmF2VGFicyhkaXJlY3RpdmUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogJ2RpcmVjdGl2ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmU6IGRpcmVjdGl2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuSU5URVJOQUxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZS5pc0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZS5uYW1lICs9ICctJyArIGRpcmVjdGl2ZS5kdXBsaWNhdGVJZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2UocGFnZSk7XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJlcGFyZUluamVjdGFibGVzKHNvbWVJbmplY3RhYmxlcz8pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1ByZXBhcmUgaW5qZWN0YWJsZXMnKTtcblxuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmluamVjdGFibGVzID0gc29tZUluamVjdGFibGVzXG4gICAgICAgICAgICA/IHNvbWVJbmplY3RhYmxlc1xuICAgICAgICAgICAgOiBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0SW5qZWN0YWJsZXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgbGV0IGxlbiA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW5qZWN0YWJsZXMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGxvb3AgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluamVjID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbmplY3RhYmxlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hcmtkb3duRW5naW5lLmhhc05laWdoYm91clJlYWRtZUZpbGUoaW5qZWMuZmlsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgJHtpbmplYy5uYW1lfSBoYXMgYSBSRUFETUUgZmlsZSwgaW5jbHVkZSBpdGApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlYWRtZSA9IE1hcmtkb3duRW5naW5lLnJlYWROZWlnaGJvdXJSZWFkbWVGaWxlKGluamVjLmZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWMucmVhZG1lID0gbWFya2VkKHJlYWRtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhZ2UgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiAnaW5qZWN0YWJsZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogaW5qZWMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpbmplYy5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdlRhYnM6IHRoaXMuZ2V0TmF2VGFicyhpbmplYyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAnaW5qZWN0YWJsZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmplY3RhYmxlOiBpbmplYyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuSU5URVJOQUxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluamVjLmlzRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlLm5hbWUgKz0gJy0nICsgaW5qZWMuZHVwbGljYXRlSWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hZGRQYWdlKHBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHByZXBhcmVJbnRlcmNlcHRvcnMoc29tZUludGVyY2VwdG9ycz8pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1ByZXBhcmUgaW50ZXJjZXB0b3JzJyk7XG5cbiAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbnRlcmNlcHRvcnMgPSBzb21lSW50ZXJjZXB0b3JzXG4gICAgICAgICAgICA/IHNvbWVJbnRlcmNlcHRvcnNcbiAgICAgICAgICAgIDogRGVwZW5kZW5jaWVzRW5naW5lLmdldEludGVyY2VwdG9ycygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbnRlcmNlcHRvcnMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGxvb3AgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGludGVyY2VwdG9yID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbnRlcmNlcHRvcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXJrZG93bkVuZ2luZS5oYXNOZWlnaGJvdXJSZWFkbWVGaWxlKGludGVyY2VwdG9yLmZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgICR7aW50ZXJjZXB0b3IubmFtZX0gaGFzIGEgUkVBRE1FIGZpbGUsIGluY2x1ZGUgaXRgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZWFkbWUgPSBNYXJrZG93bkVuZ2luZS5yZWFkTmVpZ2hib3VyUmVhZG1lRmlsZShpbnRlcmNlcHRvci5maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVyY2VwdG9yLnJlYWRtZSA9IG1hcmtlZChyZWFkbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogJ2ludGVyY2VwdG9ycycsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBpbnRlcmNlcHRvci5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGludGVyY2VwdG9yLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmF2VGFiczogdGhpcy5nZXROYXZUYWJzKGludGVyY2VwdG9yKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6ICdpbnRlcmNlcHRvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmplY3RhYmxlOiBpbnRlcmNlcHRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuSU5URVJOQUxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGludGVyY2VwdG9yLmlzRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlLm5hbWUgKz0gJy0nICsgaW50ZXJjZXB0b3IuZHVwbGljYXRlSWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hZGRQYWdlKHBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHByZXBhcmVHdWFyZHMoc29tZUd1YXJkcz8pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1ByZXBhcmUgZ3VhcmRzJyk7XG5cbiAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5ndWFyZHMgPSBzb21lR3VhcmRzID8gc29tZUd1YXJkcyA6IERlcGVuZGVuY2llc0VuZ2luZS5nZXRHdWFyZHMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgbGV0IGxlbiA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZ3VhcmRzLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBsb29wID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpIDwgbGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBndWFyZCA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZ3VhcmRzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWFya2Rvd25FbmdpbmUuaGFzTmVpZ2hib3VyUmVhZG1lRmlsZShndWFyZC5maWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAke2d1YXJkLm5hbWV9IGhhcyBhIFJFQURNRSBmaWxlLCBpbmNsdWRlIGl0YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVhZG1lID0gTWFya2Rvd25FbmdpbmUucmVhZE5laWdoYm91clJlYWRtZUZpbGUoZ3VhcmQuZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBndWFyZC5yZWFkbWUgPSBtYXJrZWQocmVhZG1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6ICdndWFyZHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZ3VhcmQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBndWFyZC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdlRhYnM6IHRoaXMuZ2V0TmF2VGFicyhndWFyZCksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAnZ3VhcmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0YWJsZTogZ3VhcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXB0aDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLklOVEVSTkFMXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChndWFyZC5pc0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZS5uYW1lICs9ICctJyArIGd1YXJkLmR1cGxpY2F0ZUlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZShwYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICBsb29wKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsb29wKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcmVwYXJlUm91dGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJvY2VzcyByb3V0ZXMnKTtcbiAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5yb3V0ZXMgPSBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0Um91dGVzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZSh7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3JvdXRlcycsXG4gICAgICAgICAgICAgICAgaWQ6ICdyb3V0ZXMnLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6ICdyb3V0ZXMnLFxuICAgICAgICAgICAgICAgIGRlcHRoOiAwLFxuICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLlJPT1RcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5leHBvcnRGb3JtYXQgPT09IENPTVBPRE9DX0RFRkFVTFRTLmV4cG9ydEZvcm1hdCkge1xuICAgICAgICAgICAgICAgIFJvdXRlclBhcnNlclV0aWwuZ2VuZXJhdGVSb3V0ZXNJbmRleChcbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQsXG4gICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEucm91dGVzXG4gICAgICAgICAgICAgICAgKS50aGVuKFxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnIFJvdXRlcyBpbmRleCBnZW5lcmF0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHByZXBhcmVDb3ZlcmFnZSgpIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2Nlc3MgZG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSByZXBvcnQnKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIGxvb3Agd2l0aCBjb21wb25lbnRzLCBkaXJlY3RpdmVzLCBjb250cm9sbGVycywgY2xhc3NlcywgaW5qZWN0YWJsZXMsIGludGVyZmFjZXMsIHBpcGVzLCBndWFyZHMsIG1pc2MgZnVuY3Rpb25zIHZhcmlhYmxlc1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBbXTtcbiAgICAgICAgICAgIGxldCB0b3RhbFByb2plY3RTdGF0ZW1lbnREb2N1bWVudGVkID0gMDtcbiAgICAgICAgICAgIGxldCBnZXRTdGF0dXMgPSBmdW5jdGlvbihwZXJjZW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXR1cztcbiAgICAgICAgICAgICAgICBpZiAocGVyY2VudCA8PSAyNSkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMgPSAnbG93JztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBlcmNlbnQgPiAyNSAmJiBwZXJjZW50IDw9IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cyA9ICdtZWRpdW0nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGVyY2VudCA+IDUwICYmIHBlcmNlbnQgPD0gNzUpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzID0gJ2dvb2QnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cyA9ICd2ZXJ5LWdvb2QnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxldCBwcm9jZXNzQ29tcG9uZW50c0FuZERpcmVjdGl2ZXNBbmRDb250cm9sbGVycyA9IGxpc3QgPT4ge1xuICAgICAgICAgICAgICAgIF8uZm9yRWFjaChsaXN0LCAoZWw6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IChPYmplY3QgYXMgYW55KS5hc3NpZ24oe30sIGVsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50LnByb3BlcnRpZXNDbGFzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5wcm9wZXJ0aWVzQ2xhc3MgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnQubWV0aG9kc0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm1ldGhvZHNDbGFzcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudC5ob3N0QmluZGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaG9zdEJpbmRpbmdzID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50Lmhvc3RMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaG9zdExpc3RlbmVycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudC5pbnB1dHNDbGFzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5pbnB1dHNDbGFzcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudC5vdXRwdXRzQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQub3V0cHV0c0NsYXNzID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsOiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlUGF0aDogZWxlbWVudC5maWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZWxlbWVudC50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGlua3R5cGU6IGVsZW1lbnQudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGVsZW1lbnQubmFtZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBsZXQgdG90YWxTdGF0ZW1lbnREb2N1bWVudGVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvdGFsU3RhdGVtZW50cyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnByb3BlcnRpZXNDbGFzcy5sZW5ndGggK1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5tZXRob2RzQ2xhc3MubGVuZ3RoICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5wdXRzQ2xhc3MubGVuZ3RoICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaG9zdEJpbmRpbmdzLmxlbmd0aCArXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lmhvc3RMaXN0ZW5lcnMubGVuZ3RoICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQub3V0cHV0c0NsYXNzLmxlbmd0aCArXG4gICAgICAgICAgICAgICAgICAgICAgICAxOyAvLyArMSBmb3IgZWxlbWVudCBkZWNvcmF0b3IgY29tbWVudFxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmNvbnN0cnVjdG9yT2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudHMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNvbnN0cnVjdG9yT2JqICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jb25zdHJ1Y3Rvck9iai5kZXNjcmlwdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY29uc3RydWN0b3JPYmouZGVzY3JpcHRpb24gIT09ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5kZXNjcmlwdGlvbiAmJiBlbGVtZW50LmRlc2NyaXB0aW9uICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTdGF0ZW1lbnREb2N1bWVudGVkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBfLmZvckVhY2goZWxlbWVudC5wcm9wZXJ0aWVzQ2xhc3MsIChwcm9wZXJ0eTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkubW9kaWZpZXJLaW5kID09PSBTeW50YXhLaW5kLlByaXZhdGVLZXl3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9lc24ndCBoYW5kbGUgcHJpdmF0ZSBmb3IgY292ZXJhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudHMgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eS5kZXNjcmlwdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5LmRlc2NyaXB0aW9uICE9PSAnJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5Lm1vZGlmaWVyS2luZCAhPT0gU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTdGF0ZW1lbnREb2N1bWVudGVkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBfLmZvckVhY2goZWxlbWVudC5tZXRob2RzQ2xhc3MsIChtZXRob2Q6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGhvZC5tb2RpZmllcktpbmQgPT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2Vzbid0IGhhbmRsZSBwcml2YXRlIGZvciBjb3ZlcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50cyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5kZXNjcmlwdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5kZXNjcmlwdGlvbiAhPT0gJycgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QubW9kaWZpZXJLaW5kICE9PSBTeW50YXhLaW5kLlByaXZhdGVLZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIF8uZm9yRWFjaChlbGVtZW50Lmhvc3RCaW5kaW5ncywgKHByb3BlcnR5OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5tb2RpZmllcktpbmQgPT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2Vzbid0IGhhbmRsZSBwcml2YXRlIGZvciBjb3ZlcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50cyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5LmRlc2NyaXB0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkuZGVzY3JpcHRpb24gIT09ICcnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkubW9kaWZpZXJLaW5kICE9PSBTeW50YXhLaW5kLlByaXZhdGVLZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIF8uZm9yRWFjaChlbGVtZW50Lmhvc3RMaXN0ZW5lcnMsIChtZXRob2Q6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGhvZC5tb2RpZmllcktpbmQgPT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2Vzbid0IGhhbmRsZSBwcml2YXRlIGZvciBjb3ZlcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50cyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5kZXNjcmlwdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5kZXNjcmlwdGlvbiAhPT0gJycgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QubW9kaWZpZXJLaW5kICE9PSBTeW50YXhLaW5kLlByaXZhdGVLZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIF8uZm9yRWFjaChlbGVtZW50LmlucHV0c0NsYXNzLCAoaW5wdXQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0Lm1vZGlmaWVyS2luZCA9PT0gU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvZXNuJ3QgaGFuZGxlIHByaXZhdGUgZm9yIGNvdmVyYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTdGF0ZW1lbnRzIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuZGVzY3JpcHRpb24gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5kZXNjcmlwdGlvbiAhPT0gJycgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5tb2RpZmllcktpbmQgIT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKGVsZW1lbnQub3V0cHV0c0NsYXNzLCAob3V0cHV0OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdXRwdXQubW9kaWZpZXJLaW5kID09PSBTeW50YXhLaW5kLlByaXZhdGVLZXl3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9lc24ndCBoYW5kbGUgcHJpdmF0ZSBmb3IgY292ZXJhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudHMgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQuZGVzY3JpcHRpb24gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQuZGVzY3JpcHRpb24gIT09ICcnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0Lm1vZGlmaWVyS2luZCAhPT0gU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTdGF0ZW1lbnREb2N1bWVudGVkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNsLmNvdmVyYWdlUGVyY2VudCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAodG90YWxTdGF0ZW1lbnREb2N1bWVudGVkIC8gdG90YWxTdGF0ZW1lbnRzKSAqIDEwMFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG90YWxTdGF0ZW1lbnRzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbC5jb3ZlcmFnZVBlcmNlbnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNsLmNvdmVyYWdlQ291bnQgPSB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgKyAnLycgKyB0b3RhbFN0YXRlbWVudHM7XG4gICAgICAgICAgICAgICAgICAgIGNsLnN0YXR1cyA9IGdldFN0YXR1cyhjbC5jb3ZlcmFnZVBlcmNlbnQpO1xuICAgICAgICAgICAgICAgICAgICB0b3RhbFByb2plY3RTdGF0ZW1lbnREb2N1bWVudGVkICs9IGNsLmNvdmVyYWdlUGVyY2VudDtcbiAgICAgICAgICAgICAgICAgICAgZmlsZXMucHVzaChjbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IHByb2Nlc3NDb3ZlcmFnZVBlckZpbGUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2Nlc3MgZG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSBwZXIgZmlsZScpO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCctLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgb3ZlckZpbGVzID0gZmlsZXMuZmlsdGVyKGYgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb3ZlclRlc3QgPVxuICAgICAgICAgICAgICAgICAgICAgICAgZi5jb3ZlcmFnZVBlcmNlbnQgPj0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZU1pbmltdW1QZXJGaWxlO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3ZlclRlc3QgJiYgIUNvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0U2hvd09ubHlGYWlsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke2YuY292ZXJhZ2VQZXJjZW50fSAlIGZvciBmaWxlICR7Zi5maWxlUGF0aH0gLSAke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC0gb3ZlciBtaW5pbXVtIHBlciBmaWxlYFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3ZlclRlc3Q7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGV0IHVuZGVyRmlsZXMgPSBmaWxlcy5maWx0ZXIoZiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB1bmRlclRlc3QgPVxuICAgICAgICAgICAgICAgICAgICAgICAgZi5jb3ZlcmFnZVBlcmNlbnQgPCBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlTWluaW11bVBlckZpbGU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1bmRlclRlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtmLmNvdmVyYWdlUGVyY2VudH0gJSBmb3IgZmlsZSAke2YuZmlsZVBhdGh9IC0gJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZi5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAtIHVuZGVyIG1pbmltdW0gcGVyIGZpbGVgXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlclRlc3Q7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG92ZXJGaWxlczogb3ZlckZpbGVzLFxuICAgICAgICAgICAgICAgICAgICB1bmRlckZpbGVzOiB1bmRlckZpbGVzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsZXQgcHJvY2Vzc0Z1bmN0aW9uc0FuZFZhcmlhYmxlcyA9IChpZCwgdHlwZSkgPT4ge1xuICAgICAgICAgICAgICAgIF8uZm9yRWFjaChpZCwgKGVsOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsOiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlUGF0aDogZWwuZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rdHlwZTogZWwudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmtzdWJ0eXBlOiBlbC5zdWJ0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZWwubmFtZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ3ZhcmlhYmxlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2wubGlua3R5cGUgPSAnbWlzY2VsbGFuZW91cyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0b3RhbFN0YXRlbWVudHMgPSAxO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbC5tb2RpZmllcktpbmQgPT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvZXNuJ3QgaGFuZGxlIHByaXZhdGUgZm9yIGNvdmVyYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudHMgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5kZXNjcmlwdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgZWwuZGVzY3JpcHRpb24gIT09ICcnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5tb2RpZmllcktpbmQgIT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmRcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNsLmNvdmVyYWdlUGVyY2VudCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAodG90YWxTdGF0ZW1lbnREb2N1bWVudGVkIC8gdG90YWxTdGF0ZW1lbnRzKSAqIDEwMFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBjbC5jb3ZlcmFnZUNvdW50ID0gdG90YWxTdGF0ZW1lbnREb2N1bWVudGVkICsgJy8nICsgdG90YWxTdGF0ZW1lbnRzO1xuICAgICAgICAgICAgICAgICAgICBjbC5zdGF0dXMgPSBnZXRTdGF0dXMoY2wuY292ZXJhZ2VQZXJjZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQcm9qZWN0U3RhdGVtZW50RG9jdW1lbnRlZCArPSBjbC5jb3ZlcmFnZVBlcmNlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVzLnB1c2goY2wpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IHByb2Nlc3NDbGFzc2VzID0gKGxpc3QsIHR5cGUsIGxpbmt0eXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKGxpc3QsIChjbDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gKE9iamVjdCBhcyBhbnkpLmFzc2lnbih7fSwgY2wpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnQucHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5wcm9wZXJ0aWVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50Lm1ldGhvZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQubWV0aG9kcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGE6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoOiBlbGVtZW50LmZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGlua3R5cGU6IGxpbmt0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZWxlbWVudC5uYW1lXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGxldCB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdG90YWxTdGF0ZW1lbnRzID0gZWxlbWVudC5wcm9wZXJ0aWVzLmxlbmd0aCArIGVsZW1lbnQubWV0aG9kcy5sZW5ndGggKyAxOyAvLyArMSBmb3IgZWxlbWVudCBpdHNlbGZcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5jb25zdHJ1Y3Rvck9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTdGF0ZW1lbnRzICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jb25zdHJ1Y3Rvck9iaiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY29uc3RydWN0b3JPYmouZGVzY3JpcHRpb24gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNvbnN0cnVjdG9yT2JqLmRlc2NyaXB0aW9uICE9PSAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTdGF0ZW1lbnREb2N1bWVudGVkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuZGVzY3JpcHRpb24gJiYgZWxlbWVudC5kZXNjcmlwdGlvbiAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKGVsZW1lbnQucHJvcGVydGllcywgKHByb3BlcnR5OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5tb2RpZmllcktpbmQgPT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2Vzbid0IGhhbmRsZSBwcml2YXRlIGZvciBjb3ZlcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50cyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5LmRlc2NyaXB0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkuZGVzY3JpcHRpb24gIT09ICcnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkubW9kaWZpZXJLaW5kICE9PSBTeW50YXhLaW5kLlByaXZhdGVLZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIF8uZm9yRWFjaChlbGVtZW50Lm1ldGhvZHMsIChtZXRob2Q6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGhvZC5tb2RpZmllcktpbmQgPT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2Vzbid0IGhhbmRsZSBwcml2YXRlIGZvciBjb3ZlcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50cyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5kZXNjcmlwdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5kZXNjcmlwdGlvbiAhPT0gJycgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QubW9kaWZpZXJLaW5kICE9PSBTeW50YXhLaW5kLlByaXZhdGVLZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2xhLmNvdmVyYWdlUGVyY2VudCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAodG90YWxTdGF0ZW1lbnREb2N1bWVudGVkIC8gdG90YWxTdGF0ZW1lbnRzKSAqIDEwMFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG90YWxTdGF0ZW1lbnRzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGEuY292ZXJhZ2VQZXJjZW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjbGEuY292ZXJhZ2VDb3VudCA9IHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCArICcvJyArIHRvdGFsU3RhdGVtZW50cztcbiAgICAgICAgICAgICAgICAgICAgY2xhLnN0YXR1cyA9IGdldFN0YXR1cyhjbGEuY292ZXJhZ2VQZXJjZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQcm9qZWN0U3RhdGVtZW50RG9jdW1lbnRlZCArPSBjbGEuY292ZXJhZ2VQZXJjZW50O1xuICAgICAgICAgICAgICAgICAgICBmaWxlcy5wdXNoKGNsYSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBwcm9jZXNzQ29tcG9uZW50c0FuZERpcmVjdGl2ZXNBbmRDb250cm9sbGVycyhDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvbXBvbmVudHMpO1xuICAgICAgICAgICAgcHJvY2Vzc0NvbXBvbmVudHNBbmREaXJlY3RpdmVzQW5kQ29udHJvbGxlcnMoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXJlY3RpdmVzKTtcbiAgICAgICAgICAgIHByb2Nlc3NDb21wb25lbnRzQW5kRGlyZWN0aXZlc0FuZENvbnRyb2xsZXJzKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY29udHJvbGxlcnMpO1xuXG4gICAgICAgICAgICBwcm9jZXNzQ2xhc3NlcyhDb25maWd1cmF0aW9uLm1haW5EYXRhLmNsYXNzZXMsICdjbGFzcycsICdjbGFzc2UnKTtcbiAgICAgICAgICAgIHByb2Nlc3NDbGFzc2VzKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW5qZWN0YWJsZXMsICdpbmplY3RhYmxlJywgJ2luamVjdGFibGUnKTtcbiAgICAgICAgICAgIHByb2Nlc3NDbGFzc2VzKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW50ZXJmYWNlcywgJ2ludGVyZmFjZScsICdpbnRlcmZhY2UnKTtcbiAgICAgICAgICAgIHByb2Nlc3NDbGFzc2VzKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZ3VhcmRzLCAnZ3VhcmQnLCAnZ3VhcmQnKTtcbiAgICAgICAgICAgIHByb2Nlc3NDbGFzc2VzKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW50ZXJjZXB0b3JzLCAnaW50ZXJjZXB0b3InLCAnaW50ZXJjZXB0b3InKTtcblxuICAgICAgICAgICAgXy5mb3JFYWNoKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEucGlwZXMsIChwaXBlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY2w6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZVBhdGg6IHBpcGUuZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogcGlwZS50eXBlLFxuICAgICAgICAgICAgICAgICAgICBsaW5rdHlwZTogcGlwZS50eXBlLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBwaXBlLm5hbWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxldCB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgPSAwO1xuICAgICAgICAgICAgICAgIGxldCB0b3RhbFN0YXRlbWVudHMgPSAxO1xuICAgICAgICAgICAgICAgIGlmIChwaXBlLmRlc2NyaXB0aW9uICYmIHBpcGUuZGVzY3JpcHRpb24gIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCArPSAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNsLmNvdmVyYWdlUGVyY2VudCA9IE1hdGguZmxvb3IoKHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCAvIHRvdGFsU3RhdGVtZW50cykgKiAxMDApO1xuICAgICAgICAgICAgICAgIGNsLmNvdmVyYWdlQ291bnQgPSB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgKyAnLycgKyB0b3RhbFN0YXRlbWVudHM7XG4gICAgICAgICAgICAgICAgY2wuc3RhdHVzID0gZ2V0U3RhdHVzKGNsLmNvdmVyYWdlUGVyY2VudCk7XG4gICAgICAgICAgICAgICAgdG90YWxQcm9qZWN0U3RhdGVtZW50RG9jdW1lbnRlZCArPSBjbC5jb3ZlcmFnZVBlcmNlbnQ7XG4gICAgICAgICAgICAgICAgZmlsZXMucHVzaChjbCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcHJvY2Vzc0Z1bmN0aW9uc0FuZFZhcmlhYmxlcyhcbiAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm1pc2NlbGxhbmVvdXMuZnVuY3Rpb25zLFxuICAgICAgICAgICAgICAgICdmdW5jdGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBwcm9jZXNzRnVuY3Rpb25zQW5kVmFyaWFibGVzKFxuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubWlzY2VsbGFuZW91cy52YXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgJ3ZhcmlhYmxlJ1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZmlsZXMgPSBfLnNvcnRCeShmaWxlcywgWydmaWxlUGF0aCddKTtcblxuICAgICAgICAgICAgbGV0IGNvdmVyYWdlRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBjb3VudDpcbiAgICAgICAgICAgICAgICAgICAgZmlsZXMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBNYXRoLmZsb29yKHRvdGFsUHJvamVjdFN0YXRlbWVudERvY3VtZW50ZWQgLyBmaWxlcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IDAsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnJyxcbiAgICAgICAgICAgICAgICBmaWxlc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvdmVyYWdlRGF0YS5zdGF0dXMgPSBnZXRTdGF0dXMoY292ZXJhZ2VEYXRhLmNvdW50KTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZSh7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvdmVyYWdlJyxcbiAgICAgICAgICAgICAgICBpZDogJ2NvdmVyYWdlJyxcbiAgICAgICAgICAgICAgICBjb250ZXh0OiAnY292ZXJhZ2UnLFxuICAgICAgICAgICAgICAgIGZpbGVzOiBmaWxlcyxcbiAgICAgICAgICAgICAgICBkYXRhOiBjb3ZlcmFnZURhdGEsXG4gICAgICAgICAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuUk9PVFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb3ZlcmFnZURhdGEuZmlsZXMgPSBmaWxlcztcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VEYXRhID0gY292ZXJhZ2VEYXRhO1xuICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZXhwb3J0Rm9ybWF0ID09PSBDT01QT0RPQ19ERUZBVUxUUy5leHBvcnRGb3JtYXQpIHtcbiAgICAgICAgICAgICAgICBIdG1sRW5naW5lLmdlbmVyYXRlQ292ZXJhZ2VCYWRnZShcbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQsXG4gICAgICAgICAgICAgICAgICAgICdkb2N1bWVudGF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgY292ZXJhZ2VEYXRhXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbGVzID0gXy5zb3J0QnkoZmlsZXMsIFsnY292ZXJhZ2VQZXJjZW50J10pO1xuXG4gICAgICAgICAgICBsZXQgY292ZXJhZ2VUZXN0UGVyRmlsZVJlc3VsdHM7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3QgJiZcbiAgICAgICAgICAgICAgICAhQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RQZXJGaWxlXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBHbG9iYWwgY292ZXJhZ2UgdGVzdCBhbmQgbm90IHBlciBmaWxlXG4gICAgICAgICAgICAgICAgaWYgKGNvdmVyYWdlRGF0YS5jb3VudCA+PSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGBEb2N1bWVudGF0aW9uIGNvdmVyYWdlICgke2NvdmVyYWdlRGF0YS5jb3VudH0lKSBpcyBvdmVyIHRocmVzaG9sZCAoJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSUpYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0aW9uUHJvbWlzZVJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlID0gYERvY3VtZW50YXRpb24gY292ZXJhZ2UgKCR7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3ZlcmFnZURhdGEuY291bnRcbiAgICAgICAgICAgICAgICAgICAgfSUpIGlzIG5vdCBvdmVyIHRocmVzaG9sZCAoJHtDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZH0lKWA7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRpb25Qcm9taXNlUmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZEZhaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAhQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3QgJiZcbiAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFBlckZpbGVcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGNvdmVyYWdlVGVzdFBlckZpbGVSZXN1bHRzID0gcHJvY2Vzc0NvdmVyYWdlUGVyRmlsZSgpO1xuICAgICAgICAgICAgICAgIC8vIFBlciBmaWxlIGNvdmVyYWdlIHRlc3QgYW5kIG5vdCBnbG9iYWxcbiAgICAgICAgICAgICAgICBpZiAoY292ZXJhZ2VUZXN0UGVyRmlsZVJlc3VsdHMudW5kZXJGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlID0gYERvY3VtZW50YXRpb24gY292ZXJhZ2UgcGVyIGZpbGUgaXMgbm90IG92ZXIgdGhyZXNob2xkICgke1xuICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZU1pbmltdW1QZXJGaWxlXG4gICAgICAgICAgICAgICAgICAgIH0lKWA7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRpb25Qcm9taXNlUmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZEZhaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oXG4gICAgICAgICAgICAgICAgICAgICAgICBgRG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSBwZXIgZmlsZSBpcyBvdmVyIHRocmVzaG9sZCAoJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlTWluaW11bVBlckZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0lKWBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGlvblByb21pc2VSZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0ICYmXG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RQZXJGaWxlXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBQZXIgZmlsZSBjb3ZlcmFnZSB0ZXN0IGFuZCBnbG9iYWxcbiAgICAgICAgICAgICAgICBjb3ZlcmFnZVRlc3RQZXJGaWxlUmVzdWx0cyA9IHByb2Nlc3NDb3ZlcmFnZVBlckZpbGUoKTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGNvdmVyYWdlRGF0YS5jb3VudCA+PSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZCAmJlxuICAgICAgICAgICAgICAgICAgICBjb3ZlcmFnZVRlc3RQZXJGaWxlUmVzdWx0cy51bmRlckZpbGVzLmxlbmd0aCA9PT0gMFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGBEb2N1bWVudGF0aW9uIGNvdmVyYWdlICgke2NvdmVyYWdlRGF0YS5jb3VudH0lKSBpcyBvdmVyIHRocmVzaG9sZCAoJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSUpYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGBEb2N1bWVudGF0aW9uIGNvdmVyYWdlIHBlciBmaWxlIGlzIG92ZXIgdGhyZXNob2xkICgke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VNaW5pbXVtUGVyRmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSUpYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0aW9uUHJvbWlzZVJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGNvdmVyYWdlRGF0YS5jb3VudCA+PSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZCAmJlxuICAgICAgICAgICAgICAgICAgICBjb3ZlcmFnZVRlc3RQZXJGaWxlUmVzdWx0cy51bmRlckZpbGVzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oXG4gICAgICAgICAgICAgICAgICAgICAgICBgRG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSAoJHtjb3ZlcmFnZURhdGEuY291bnR9JSkgaXMgb3ZlciB0aHJlc2hvbGQgKCR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RUaHJlc2hvbGRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0lKWBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSBgRG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSBwZXIgZmlsZSBpcyBub3Qgb3ZlciB0aHJlc2hvbGQgKCR7XG4gICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlTWluaW11bVBlckZpbGVcbiAgICAgICAgICAgICAgICAgICAgfSUpYDtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGlvblByb21pc2VSZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkRmFpbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4obWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICBjb3ZlcmFnZURhdGEuY291bnQgPCBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZCAmJlxuICAgICAgICAgICAgICAgICAgICBjb3ZlcmFnZVRlc3RQZXJGaWxlUmVzdWx0cy51bmRlckZpbGVzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2VHbG9iYWwgPSBgRG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSAoJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3ZlcmFnZURhdGEuY291bnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0lKSBpcyBub3Qgb3ZlciB0aHJlc2hvbGQgKCR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RUaHJlc2hvbGRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0lKWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlUGVyRmlsZSA9IGBEb2N1bWVudGF0aW9uIGNvdmVyYWdlIHBlciBmaWxlIGlzIG5vdCBvdmVyIHRocmVzaG9sZCAoJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlTWluaW11bVBlckZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0lKWA7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRpb25Qcm9taXNlUmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZEZhaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihtZXNzYWdlR2xvYmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihtZXNzYWdlUGVyRmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybihtZXNzYWdlR2xvYmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKG1lc3NhZ2VQZXJGaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlID0gYERvY3VtZW50YXRpb24gY292ZXJhZ2UgKCR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY292ZXJhZ2VEYXRhLmNvdW50XG4gICAgICAgICAgICAgICAgICAgICAgICB9JSkgaXMgbm90IG92ZXIgdGhyZXNob2xkICgke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkXG4gICAgICAgICAgICAgICAgICAgICAgICB9JSlgLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZVBlckZpbGUgPSBgRG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSBwZXIgZmlsZSBpcyBvdmVyIHRocmVzaG9sZCAoJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlTWluaW11bVBlckZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0lKWA7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRpb25Qcm9taXNlUmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZEZhaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKG1lc3NhZ2VQZXJGaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8obWVzc2FnZVBlckZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcmVwYXJlVW5pdFRlc3RDb3ZlcmFnZSgpIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2Nlc3MgdW5pdCB0ZXN0IGNvdmVyYWdlIHJlcG9ydCcpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IGNvdkRhdCwgY292RmlsZU5hbWVzO1xuXG4gICAgICAgICAgICBsZXQgY292ZXJhZ2VEYXRhOiBDb3ZlcmFnZURhdGEgPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlRGF0YTtcblxuICAgICAgICAgICAgaWYgKCFjb3ZlcmFnZURhdGEuZmlsZXMpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIud2FybignTWlzc2luZyBkb2N1bWVudGF0aW9uIGNvdmVyYWdlIGRhdGEnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY292RGF0ID0ge307XG4gICAgICAgICAgICAgICAgY292RmlsZU5hbWVzID0gXy5tYXAoY292ZXJhZ2VEYXRhLmZpbGVzLCBlbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWxlTmFtZSA9IGVsLmZpbGVQYXRoO1xuICAgICAgICAgICAgICAgICAgICBjb3ZEYXRbZmlsZU5hbWVdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZWwudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmt0eXBlOiBlbC5saW5rdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmtzdWJ0eXBlOiBlbC5saW5rc3VidHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGVsLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbGVOYW1lO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmVhZCBjb3ZlcmFnZSBzdW1tYXJ5IGZpbGUgYW5kIGRhdGFcbiAgICAgICAgICAgIGxldCB1bml0VGVzdFN1bW1hcnkgPSB7fTtcbiAgICAgICAgICAgIGxldCBmaWxlRGF0ID0gRmlsZUVuZ2luZS5nZXRTeW5jKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudW5pdFRlc3RDb3ZlcmFnZSk7XG4gICAgICAgICAgICBpZiAoZmlsZURhdCkge1xuICAgICAgICAgICAgICAgIHVuaXRUZXN0U3VtbWFyeSA9IEpTT04ucGFyc2UoZmlsZURhdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnRXJyb3IgcmVhZGluZyB1bml0IHRlc3QgY292ZXJhZ2UgZmlsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGdldENvdlN0YXR1cyA9IGZ1bmN0aW9uKHBlcmNlbnQsIHRvdGFsTGluZXMpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhdHVzO1xuICAgICAgICAgICAgICAgIGlmICh0b3RhbExpbmVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cyA9ICd1bmNvdmVyZWQnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGVyY2VudCA8PSAyNSkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMgPSAnbG93JztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBlcmNlbnQgPiAyNSAmJiBwZXJjZW50IDw9IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cyA9ICdtZWRpdW0nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGVyY2VudCA+IDUwICYmIHBlcmNlbnQgPD0gNzUpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzID0gJ2dvb2QnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cyA9ICd2ZXJ5LWdvb2QnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxldCBnZXRDb3ZlcmFnZURhdGEgPSBmdW5jdGlvbihkYXRhLCBmaWxlTmFtZSkge1xuICAgICAgICAgICAgICAgIGxldCBvdXQgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUgIT09ICd0b3RhbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvdkRhdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZWVkIGEgbmFtZSB0byBpbmNsdWRlIGluIG91dHB1dCBidXQgdGhpcyBpc24ndCB2aXNpYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQgPSB7IG5hbWU6IGZpbGVOYW1lLCBmaWxlUGF0aDogZmlsZU5hbWUgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaW5kTWF0Y2ggPSBfLmZpbHRlcihjb3ZGaWxlTmFtZXMsIGVsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuaW5jbHVkZXMoZmlsZU5hbWUpIHx8IGZpbGVOYW1lLmluY2x1ZGVzKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmRNYXRjaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ID0gXy5jbG9uZShjb3ZEYXRbZmluZE1hdGNoWzBdXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0WydmaWxlUGF0aCddID0gZmlsZU5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGtleXNUb0dldCA9IFsnc3RhdGVtZW50cycsICdicmFuY2hlcycsICdmdW5jdGlvbnMnLCAnbGluZXMnXTtcbiAgICAgICAgICAgICAgICBfLmZvckVhY2goa2V5c1RvR2V0LCBrZXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdCA9IGRhdGFba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dFtrZXldID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdmVyYWdlUGVyY2VudDogTWF0aC5yb3VuZCh0LnBjdCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY292ZXJhZ2VDb3VudDogJycgKyB0LmNvdmVyZWQgKyAnLycgKyB0LnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZ2V0Q292U3RhdHVzKHQucGN0LCB0LnRvdGFsKVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgdW5pdFRlc3REYXRhID0ge307XG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGZpbGUgaW4gdW5pdFRlc3RTdW1tYXJ5KSB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdCA9IGdldENvdmVyYWdlRGF0YSh1bml0VGVzdFN1bW1hcnlbZmlsZV0sIGZpbGUpO1xuICAgICAgICAgICAgICAgIGlmIChmaWxlID09PSAndG90YWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuaXRUZXN0RGF0YVsndG90YWwnXSA9IGRhdDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWxlcy5wdXNoKGRhdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdW5pdFRlc3REYXRhWydmaWxlcyddID0gZmlsZXM7XG4gICAgICAgICAgICB1bml0VGVzdERhdGFbJ2lkQ29sdW1uJ10gPSBjb3ZEYXQgIT09IHVuZGVmaW5lZDsgLy8gc2hvdWxkIHdlIGluY2x1ZGUgdGhlIGlkIGNvbHVtblxuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS51bml0VGVzdERhdGEgPSB1bml0VGVzdERhdGE7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2Uoe1xuICAgICAgICAgICAgICAgIG5hbWU6ICd1bml0LXRlc3QnLFxuICAgICAgICAgICAgICAgIGlkOiAndW5pdC10ZXN0JyxcbiAgICAgICAgICAgICAgICBjb250ZXh0OiAndW5pdC10ZXN0JyxcbiAgICAgICAgICAgICAgICBmaWxlczogZmlsZXMsXG4gICAgICAgICAgICAgICAgZGF0YTogdW5pdFRlc3REYXRhLFxuICAgICAgICAgICAgICAgIGRlcHRoOiAwLFxuICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLlJPT1RcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5leHBvcnRGb3JtYXQgPT09IENPTVBPRE9DX0RFRkFVTFRTLmV4cG9ydEZvcm1hdCkge1xuICAgICAgICAgICAgICAgIGxldCBrZXlzVG9HZXQgPSBbJ3N0YXRlbWVudHMnLCAnYnJhbmNoZXMnLCAnZnVuY3Rpb25zJywgJ2xpbmVzJ107XG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKGtleXNUb0dldCwga2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVuaXRUZXN0RGF0YVsndG90YWwnXVtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBIdG1sRW5naW5lLmdlbmVyYXRlQ292ZXJhZ2VCYWRnZShDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dCwga2V5LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IHVuaXRUZXN0RGF0YVsndG90YWwnXVtrZXldWydjb3ZlcmFnZVBlcmNlbnQnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHVuaXRUZXN0RGF0YVsndG90YWwnXVtrZXldWydzdGF0dXMnXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcm9jZXNzUGFnZShwYWdlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcm9jZXNzIHBhZ2UnLCBwYWdlLm5hbWUpO1xuXG4gICAgICAgIGxldCBodG1sRGF0YSA9IEh0bWxFbmdpbmUucmVuZGVyKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEsIHBhZ2UpO1xuICAgICAgICBsZXQgZmluYWxQYXRoID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQ7XG5cbiAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0Lmxhc3RJbmRleE9mKCcvJykgPT09IC0xKSB7XG4gICAgICAgICAgICBmaW5hbFBhdGggKz0gJy8nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYWdlLnBhdGgpIHtcbiAgICAgICAgICAgIGZpbmFsUGF0aCArPSBwYWdlLnBhdGggKyAnLyc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFnZS5maWxlbmFtZSkge1xuICAgICAgICAgICAgZmluYWxQYXRoICs9IHBhZ2UuZmlsZW5hbWUgKyAnLmh0bWwnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmluYWxQYXRoICs9IHBhZ2UubmFtZSArICcuaHRtbCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIUNvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVNlYXJjaCkge1xuICAgICAgICAgICAgU2VhcmNoRW5naW5lLmluZGV4UGFnZSh7XG4gICAgICAgICAgICAgICAgaW5mb3M6IHBhZ2UsXG4gICAgICAgICAgICAgICAgcmF3RGF0YTogaHRtbERhdGEsXG4gICAgICAgICAgICAgICAgdXJsOiBmaW5hbFBhdGhcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEZpbGVFbmdpbmUud3JpdGUoZmluYWxQYXRoLCBodG1sRGF0YSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgZHVyaW5nICcgKyBwYWdlLm5hbWUgKyAnIHBhZ2UgZ2VuZXJhdGlvbicpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCcnKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHByb2Nlc3NQYWdlcygpIHtcbiAgICAgICAgbGV0IHBhZ2VzID0gXy5zb3J0QnkoQ29uZmlndXJhdGlvbi5wYWdlcywgWyduYW1lJ10pO1xuXG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcm9jZXNzIHBhZ2VzJyk7XG4gICAgICAgIFByb21pc2UuYWxsKHBhZ2VzLm1hcChwYWdlID0+IHRoaXMucHJvY2Vzc1BhZ2UocGFnZSkpKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjYWxsYmFja3NBZnRlckdlbmVyYXRlU2VhcmNoSW5kZXhKc29uID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5hZGRpdGlvbmFsUGFnZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzQWRkaXRpb25hbFBhZ2VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5hc3NldHNGb2xkZXIgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzQXNzZXRzRm9sZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NSZXNvdXJjZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKCFDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVTZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgU2VhcmNoRW5naW5lLmdlbmVyYXRlU2VhcmNoSW5kZXhKc29uKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0KS50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrc0FmdGVyR2VuZXJhdGVTZWFyY2hJbmRleEpzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzQWZ0ZXJHZW5lcmF0ZVNlYXJjaEluZGV4SnNvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc01lbnUoQ29uZmlndXJhdGlvbi5tYWluRGF0YSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcHJvY2Vzc01lbnUobWFpbkRhdGEpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2Nlc3MgbWVudS4uLicpO1xuXG4gICAgICAgIHJldHVybiBIdG1sRW5naW5lLnJlbmRlck1lbnUoQ29uZmlndXJhdGlvbi5tYWluRGF0YS50ZW1wbGF0ZXMsIG1haW5EYXRhKS50aGVuKGh0bWxEYXRhID0+IHtcbiAgICAgICAgICAgIGxldCBmaW5hbFBhdGggPSBgJHttYWluRGF0YS5vdXRwdXR9L2pzL21lbnUtd2MuanNgO1xuICAgICAgICAgICAgcmV0dXJuIEZpbGVFbmdpbmUud3JpdGUoZmluYWxQYXRoLCBodG1sRGF0YSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGR1cmluZyAnICsgZmluYWxQYXRoICsgJyBwYWdlIGdlbmVyYXRpb24nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcm9jZXNzQWRkaXRpb25hbFBhZ2VzKCkge1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJvY2VzcyBhZGRpdGlvbmFsIHBhZ2VzJyk7XG4gICAgICAgIGxldCBwYWdlcyA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYWRkaXRpb25hbFBhZ2VzO1xuICAgICAgICBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIHBhZ2VzLm1hcChwYWdlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NQYWdlKHBhZ2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4ucGFnZS5jaGlsZHJlbi5tYXAoY2hpbGRQYWdlID0+IHRoaXMucHJvY2Vzc1BhZ2UoY2hpbGRQYWdlKSlcbiAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1BhZ2UocGFnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIFNlYXJjaEVuZ2luZS5nZW5lcmF0ZVNlYXJjaEluZGV4SnNvbihDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmFzc2V0c0ZvbGRlciAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0Fzc2V0c0ZvbGRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc1Jlc291cmNlcygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHByb2Nlc3NBc3NldHNGb2xkZXIoKTogdm9pZCB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdDb3B5IGFzc2V0cyBmb2xkZXInKTtcblxuICAgICAgICBpZiAoIUZpbGVFbmdpbmUuZXhpc3RzU3luYyhDb25maWd1cmF0aW9uLm1haW5EYXRhLmFzc2V0c0ZvbGRlcikpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgICAgICBgUHJvdmlkZWQgYXNzZXRzIGZvbGRlciAke0NvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYXNzZXRzRm9sZGVyfSBkaWQgbm90IGV4aXN0YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBmaW5hbE91dHB1dCA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0O1xuXG4gICAgICAgICAgICBsZXQgdGVzdE91dHB1dERpciA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0Lm1hdGNoKGN3ZCk7XG5cbiAgICAgICAgICAgIGlmICh0ZXN0T3V0cHV0RGlyICYmIHRlc3RPdXRwdXREaXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZpbmFsT3V0cHV0ID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQucmVwbGFjZShjd2QgKyBwYXRoLnNlcCwgJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHBhdGguam9pbihcbiAgICAgICAgICAgICAgICBmaW5hbE91dHB1dCxcbiAgICAgICAgICAgICAgICBwYXRoLmJhc2VuYW1lKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYXNzZXRzRm9sZGVyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGZzLmNvcHkoXG4gICAgICAgICAgICAgICAgcGF0aC5yZXNvbHZlKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYXNzZXRzRm9sZGVyKSxcbiAgICAgICAgICAgICAgICBwYXRoLnJlc29sdmUoZGVzdGluYXRpb24pLFxuICAgICAgICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgZHVyaW5nIHJlc291cmNlcyBjb3B5ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHByb2Nlc3NSZXNvdXJjZXMoKSB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdDb3B5IG1haW4gcmVzb3VyY2VzJyk7XG5cbiAgICAgICAgY29uc3Qgb25Db21wbGV0ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICAgICdEb2N1bWVudGF0aW9uIGdlbmVyYXRlZCBpbiAnICtcbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQgK1xuICAgICAgICAgICAgICAgICAgICAnIGluICcgK1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEVsYXBzZWRUaW1lKCkgK1xuICAgICAgICAgICAgICAgICAgICAnIHNlY29uZHMgdXNpbmcgJyArXG4gICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudGhlbWUgK1xuICAgICAgICAgICAgICAgICAgICAnIHRoZW1lJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLnNlcnZlKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oXG4gICAgICAgICAgICAgICAgICAgIGBTZXJ2aW5nIGRvY3VtZW50YXRpb24gZnJvbSAke1xuICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXRcbiAgICAgICAgICAgICAgICAgICAgfSBhdCBodHRwOi8vMTI3LjAuMC4xOiR7Q29uZmlndXJhdGlvbi5tYWluRGF0YS5wb3J0fWBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMucnVuV2ViU2VydmVyKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZ2VuZXJhdGlvblByb21pc2VSZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmRDYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBmaW5hbE91dHB1dCA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0O1xuXG4gICAgICAgIGxldCB0ZXN0T3V0cHV0RGlyID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQubWF0Y2goY3dkKTtcblxuICAgICAgICBpZiAodGVzdE91dHB1dERpciAmJiB0ZXN0T3V0cHV0RGlyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZpbmFsT3V0cHV0ID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQucmVwbGFjZShjd2QgKyBwYXRoLnNlcCwgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnMuY29weShcbiAgICAgICAgICAgIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUgKyAnLy4uL3NyYy9yZXNvdXJjZXMvJyksXG4gICAgICAgICAgICBwYXRoLnJlc29sdmUoZmluYWxPdXRwdXQpLFxuICAgICAgICAgICAgZXJyb3JDb3B5ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3JDb3B5KSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgZHVyaW5nIHJlc291cmNlcyBjb3B5ICcsIGVycm9yQ29weSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXh0VGhlbWVQcm9taXNlID0gbmV3IFByb21pc2UoKGV4dFRoZW1lUmVzb2x2ZSwgZXh0VGhlbWVSZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmV4dFRoZW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuY29weShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5yZXNvbHZlKGN3ZCArIHBhdGguc2VwICsgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5leHRUaGVtZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGgucmVzb2x2ZShmaW5hbE91dHB1dCArICcvc3R5bGVzLycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlcnJvckNvcHlUaGVtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yQ29weVRoZW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRXJyb3IgZHVyaW5nIGV4dGVybmFsIHN0eWxpbmcgdGhlbWUgY29weSAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNvcHlUaGVtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0VGhlbWVSZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ0V4dGVybmFsIHN0eWxpbmcgdGhlbWUgY29weSBzdWNjZWVkZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRUaGVtZVJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dFRoZW1lUmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXN0b21GYXZpY29uUHJvbWlzZSA9IG5ldyBQcm9taXNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGN1c3RvbUZhdmljb25SZXNvbHZlLCBjdXN0b21GYXZpY29uUmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY3VzdG9tRmF2aWNvbiAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEN1c3RvbSBmYXZpY29uIHN1cHBsaWVkYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLmNvcHkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3dkICsgcGF0aC5zZXAgKyBDb25maWd1cmF0aW9uLm1haW5EYXRhLmN1c3RvbUZhdmljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLnJlc29sdmUoZmluYWxPdXRwdXQgKyAnL2ltYWdlcy9mYXZpY29uLmljbycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JDb3B5RmF2aWNvbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvckNvcHlGYXZpY29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdFcnJvciBkdXJpbmcgcmVzb3VyY2VzIGNvcHkgb2YgZmF2aWNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNvcHlGYXZpY29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbUZhdmljb25SZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnRXh0ZXJuYWwgY3VzdG9tIGZhdmljb24gY29weSBzdWNjZWVkZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdG9tRmF2aWNvblJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdG9tRmF2aWNvblJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VzdG9tTG9nb1Byb21pc2UgPSBuZXcgUHJvbWlzZSgoY3VzdG9tTG9nb1Jlc29sdmUsIGN1c3RvbUxvZ29SZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmN1c3RvbUxvZ28gIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEN1c3RvbSBsb2dvIHN1cHBsaWVkYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuY29weShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3dkICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGguc2VwICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY3VzdG9tTG9nb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLnJlc29sdmUoZmluYWxPdXRwdXQgKyAnL2ltYWdlcy8nICsgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jdXN0b21Mb2dvLnNwbGl0KFwiL1wiKS5wb3AoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yQ29weUxvZ28gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yQ29weUxvZ28pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdFcnJvciBkdXJpbmcgcmVzb3VyY2VzIGNvcHkgb2YgbG9nbycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yQ29weUxvZ29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbUxvZ29SZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ0V4dGVybmFsIGN1c3RvbSBsb2dvIGNvcHkgc3VjY2VlZGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdG9tTG9nb1Jlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbUxvZ29SZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKFtleHRUaGVtZVByb21pc2UsIGN1c3RvbUZhdmljb25Qcm9taXNlLCBjdXN0b21Mb2dvUHJvbWlzZV0pLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Db21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBlbGFwc2VkIHRpbWUgc2luY2UgdGhlIHByb2dyYW0gd2FzIHN0YXJ0ZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0RWxhcHNlZFRpbWUoKSB7XG4gICAgICAgIHJldHVybiAobmV3IERhdGUoKS52YWx1ZU9mKCkgLSBzdGFydFRpbWUudmFsdWVPZigpKSAvIDEwMDA7XG4gICAgfVxuXG4gICAgcHVibGljIHByb2Nlc3NHcmFwaHMoKSB7XG4gICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVHcmFwaCkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ0dyYXBoIGdlbmVyYXRpb24gZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc1BhZ2VzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvY2VzcyBtYWluIGdyYXBoJyk7XG4gICAgICAgICAgICBsZXQgbW9kdWxlcyA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubW9kdWxlcztcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGxldCBsZW4gPSBtb2R1bGVzLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBsb29wID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpIDw9IGxlbiAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2Nlc3MgbW9kdWxlIGdyYXBoICcsIG1vZHVsZXNbaV0ubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaW5hbFBhdGggPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0Lmxhc3RJbmRleE9mKCcvJykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFBhdGggKz0gJy8nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsUGF0aCArPSAnbW9kdWxlcy8nICsgbW9kdWxlc1tpXS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICBsZXQgX3Jhd01vZHVsZSA9IERlcGVuZGVuY2llc0VuZ2luZS5nZXRSYXdNb2R1bGUobW9kdWxlc1tpXS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgX3Jhd01vZHVsZS5kZWNsYXJhdGlvbnMubGVuZ3RoID4gMCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgX3Jhd01vZHVsZS5ib290c3RyYXAubGVuZ3RoID4gMCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgX3Jhd01vZHVsZS5pbXBvcnRzLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yYXdNb2R1bGUuZXhwb3J0cy5sZW5ndGggPiAwIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmF3TW9kdWxlLnByb3ZpZGVycy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgTmdkRW5naW5lLnJlbmRlckdyYXBoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZXNbaV0uZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2YnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZXNbaV0ubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgKS50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTmdkRW5naW5lLnJlYWRHcmFwaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGgucmVzb2x2ZShmaW5hbFBhdGggKyBwYXRoLnNlcCArICdkZXBlbmRlbmNpZXMuc3ZnJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVzW2ldLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKS50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlc1tpXS5ncmFwaCA9IGRhdGEgYXMgc3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb29wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGR1cmluZyBncmFwaCByZWFkOiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc1BhZ2VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxldCBmaW5hbE1haW5HcmFwaFBhdGggPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dDtcbiAgICAgICAgICAgIGlmIChmaW5hbE1haW5HcmFwaFBhdGgubGFzdEluZGV4T2YoJy8nKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBmaW5hbE1haW5HcmFwaFBhdGggKz0gJy8nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxNYWluR3JhcGhQYXRoICs9ICdncmFwaCc7XG4gICAgICAgICAgICBOZ2RFbmdpbmUuaW5pdChwYXRoLnJlc29sdmUoZmluYWxNYWluR3JhcGhQYXRoKSk7XG5cbiAgICAgICAgICAgIE5nZEVuZ2luZS5yZW5kZXJHcmFwaChcbiAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnLFxuICAgICAgICAgICAgICAgIHBhdGgucmVzb2x2ZShmaW5hbE1haW5HcmFwaFBhdGgpLFxuICAgICAgICAgICAgICAgICdwJ1xuICAgICAgICAgICAgKS50aGVuKFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgTmdkRW5naW5lLnJlYWRHcmFwaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGgucmVzb2x2ZShmaW5hbE1haW5HcmFwaFBhdGggKyBwYXRoLnNlcCArICdkZXBlbmRlbmNpZXMuc3ZnJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAnTWFpbiBncmFwaCdcbiAgICAgICAgICAgICAgICAgICAgKS50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5tYWluR3JhcGggPSBkYXRhIGFzIHN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb29wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGR1cmluZyBtYWluIGdyYXBoIHJlYWRpbmcgOiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZU1haW5HcmFwaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgJ09vb3BzIGVycm9yIGR1cmluZyBtYWluIGdyYXBoIGdlbmVyYXRpb24sIG1vdmluZyBvbiBuZXh0IHBhcnQgd2l0aCBtYWluIGdyYXBoIGRpc2FibGVkIDogJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyclxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVNYWluR3JhcGggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBsb29wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBydW5XZWJTZXJ2ZXIoZm9sZGVyKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1dhdGNoaW5nKSB7XG4gICAgICAgICAgICBMaXZlU2VydmVyLnN0YXJ0KHtcbiAgICAgICAgICAgICAgICByb290OiBmb2xkZXIsXG4gICAgICAgICAgICAgICAgb3BlbjogQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vcGVuLFxuICAgICAgICAgICAgICAgIHF1aWV0OiB0cnVlLFxuICAgICAgICAgICAgICAgIGxvZ0xldmVsOiAwLFxuICAgICAgICAgICAgICAgIHdhaXQ6IDEwMDAsXG4gICAgICAgICAgICAgICAgcG9ydDogQ29uZmlndXJhdGlvbi5tYWluRGF0YS5wb3J0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS53YXRjaCAmJiAhdGhpcy5pc1dhdGNoaW5nKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuZmlsZXMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdObyBzb3VyY2VzIGZpbGVzIGF2YWlsYWJsZSwgcGxlYXNlIHVzZSAtcCBmbGFnJyk7XG4gICAgICAgICAgICAgICAgZ2VuZXJhdGlvblByb21pc2VSZWplY3QoKTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucnVuV2F0Y2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLndhdGNoICYmIHRoaXMuaXNXYXRjaGluZykge1xuICAgICAgICAgICAgbGV0IHNyY0ZvbGRlciA9IGZpbmRNYWluU291cmNlRm9sZGVyKHRoaXMuZmlsZXMpO1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEFscmVhZHkgd2F0Y2hpbmcgc291cmNlcyBpbiAke3NyY0ZvbGRlcn0gZm9sZGVyYCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcnVuV2F0Y2goKSB7XG4gICAgICAgIGxldCBzb3VyY2VzID0gW2ZpbmRNYWluU291cmNlRm9sZGVyKHRoaXMuZmlsZXMpXTtcbiAgICAgICAgbGV0IHdhdGNoZXJSZWFkeSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuaXNXYXRjaGluZyA9IHRydWU7XG5cbiAgICAgICAgbG9nZ2VyLmluZm8oYFdhdGNoaW5nIHNvdXJjZXMgaW4gJHtmaW5kTWFpblNvdXJjZUZvbGRlcih0aGlzLmZpbGVzKX0gZm9sZGVyYCk7XG5cbiAgICAgICAgaWYgKE1hcmtkb3duRW5naW5lLmhhc1Jvb3RNYXJrZG93bnMoKSkge1xuICAgICAgICAgICAgc291cmNlcyA9IHNvdXJjZXMuY29uY2F0KE1hcmtkb3duRW5naW5lLmxpc3RSb290TWFya2Rvd25zKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW5jbHVkZXMgIT09ICcnKSB7XG4gICAgICAgICAgICBzb3VyY2VzID0gc291cmNlcy5jb25jYXQoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbmNsdWRlcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBhbGwgZWxlbWVudHMgb2Ygc291cmNlcyBsaXN0IGV4aXN0XG4gICAgICAgIHNvdXJjZXMgPSBjbGVhblNvdXJjZXNGb3JXYXRjaChzb3VyY2VzKTtcblxuICAgICAgICBsZXQgd2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKHNvdXJjZXMsIHtcbiAgICAgICAgICAgIGF3YWl0V3JpdGVGaW5pc2g6IHRydWUsXG4gICAgICAgICAgICBpZ25vcmVJbml0aWFsOiB0cnVlLFxuICAgICAgICAgICAgaWdub3JlZDogLyhzcGVjfFxcLmQpXFwudHMvXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgdGltZXJBZGRBbmRSZW1vdmVSZWY7XG4gICAgICAgIGxldCB0aW1lckNoYW5nZVJlZjtcbiAgICAgICAgbGV0IHJ1bm5lckFkZEFuZFJlbW92ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlKCk7XG4gICAgICAgIH07XG4gICAgICAgIGxldCB3YWl0ZXJBZGRBbmRSZW1vdmUgPSAoKSA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXJBZGRBbmRSZW1vdmVSZWYpO1xuICAgICAgICAgICAgdGltZXJBZGRBbmRSZW1vdmVSZWYgPSBzZXRUaW1lb3V0KHJ1bm5lckFkZEFuZFJlbW92ZSwgMTAwMCk7XG4gICAgICAgIH07XG4gICAgICAgIGxldCBydW5uZXJDaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5zZXRVcGRhdGVkRmlsZXModGhpcy53YXRjaENoYW5nZWRGaWxlcyk7XG4gICAgICAgICAgICBpZiAodGhpcy5oYXNXYXRjaGVkRmlsZXNUU0ZpbGVzKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldE1pY3JvRGVwZW5kZW5jaWVzRGF0YSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmhhc1dhdGNoZWRGaWxlc1Jvb3RNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYnVpbGRSb290TWFya2Rvd25zKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVidWlsZEV4dGVybmFsRG9jdW1lbnRhdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBsZXQgd2FpdGVyQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyQ2hhbmdlUmVmKTtcbiAgICAgICAgICAgIHRpbWVyQ2hhbmdlUmVmID0gc2V0VGltZW91dChydW5uZXJDaGFuZ2UsIDEwMDApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHdhdGNoZXIub24oJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF3YXRjaGVyUmVhZHkpIHtcbiAgICAgICAgICAgICAgICB3YXRjaGVyUmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHdhdGNoZXJcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdhZGQnLCBmaWxlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgRmlsZSAke2ZpbGV9IGhhcyBiZWVuIGFkZGVkYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUZXN0IGV4dGVuc2lvbiwgaWYgdHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc2NhbiBldmVyeXRoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKGZpbGUpID09PSAnLnRzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhaXRlckFkZEFuZFJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsIGZpbGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKGBGaWxlICR7ZmlsZX0gaGFzIGJlZW4gY2hhbmdlZGApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGVzdCBleHRlbnNpb24sIGlmIHRzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZXNjYW4gb25seSBmaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5leHRuYW1lKGZpbGUpID09PSAnLnRzJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGguZXh0bmFtZShmaWxlKSA9PT0gJy5tZCcgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLmV4dG5hbWUoZmlsZSkgPT09ICcuanNvbidcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2F0Y2hDaGFuZ2VkRmlsZXMucHVzaChwYXRoLmpvaW4oY3dkICsgcGF0aC5zZXAgKyBmaWxlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2FpdGVyQ2hhbmdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbigndW5saW5rJywgZmlsZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYEZpbGUgJHtmaWxlfSBoYXMgYmVlbiByZW1vdmVkYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUZXN0IGV4dGVuc2lvbiwgaWYgdHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc2NhbiBldmVyeXRoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKGZpbGUpID09PSAnLnRzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhaXRlckFkZEFuZFJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSBhcHBsaWNhdGlvbiAvIHJvb3QgY29tcG9uZW50IGluc3RhbmNlLlxuICAgICAqL1xuICAgIGdldCBhcHBsaWNhdGlvbigpOiBBcHBsaWNhdGlvbiB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldCBpc0NMSSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbiJdfQ==