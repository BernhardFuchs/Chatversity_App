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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2FwcGxpY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQStCO0FBQy9CLHdDQUEwQztBQUMxQywwQkFBNEI7QUFDNUIsMkJBQTZCO0FBRTdCLCtDQUEyQztBQUUzQyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDckMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFakMsMENBQXlDO0FBRXpDLGlEQUE0QztBQUU1QyxxRUFBK0Q7QUFDL0QseURBQW1EO0FBQ25ELHFEQUErQztBQUMvQyxxREFBK0M7QUFDL0MscURBQStDO0FBQy9DLDZEQUF1RDtBQUN2RCxtREFBNkM7QUFDN0MseURBQW1EO0FBRW5ELHdFQUFzRTtBQUN0RSw0RUFBMEU7QUFFMUUsc0VBQStEO0FBQy9ELGdEQUF3RDtBQUN4RCw4Q0FBc0Q7QUFDdEQsa0VBQWdFO0FBQ2hFLGtFQUEyRDtBQUUzRCx3Q0FJd0I7QUFLeEIsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLElBQUksU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDM0IsSUFBSSx3QkFBd0IsQ0FBQztBQUM3QixJQUFJLHVCQUF1QixDQUFDO0FBQzVCLElBQUksaUJBQWlCLEdBQUcsSUFBSSxPQUFPLENB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QUMsQ0FBQyxDQUFDO2FBQ1Y7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFLRCxzQkFBSSxvQ0FBVztRQUhmOztXQUVHO2FBQ0g7WUFDSSxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDhCQUFLO2FBQVQ7WUFDSSxPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDOzs7T0FBQTtJQUNMLGtCQUFDO0FBQUQsQ0FBQyxBQWx1RkQsSUFrdUZDO0FBbHVGWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCAqIGFzIExpdmVTZXJ2ZXIgZnJvbSAnbGl2ZS1zZXJ2ZXInO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHsgU3ludGF4S2luZCB9IGZyb20gJ3RzLXNpbXBsZS1hc3QnO1xuXG5jb25zdCBjaG9raWRhciA9IHJlcXVpcmUoJ2Nob2tpZGFyJyk7XG5jb25zdCBtYXJrZWQgPSByZXF1aXJlKCdtYXJrZWQnKTtcbmNvbnN0IHRyYXZlcnNlID0gcmVxdWlyZSgndHJhdmVyc2UnKTtcbmNvbnN0IGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuXG5pbXBvcnQgQ29uZmlndXJhdGlvbiBmcm9tICcuL2NvbmZpZ3VyYXRpb24nO1xuXG5pbXBvcnQgRGVwZW5kZW5jaWVzRW5naW5lIGZyb20gJy4vZW5naW5lcy9kZXBlbmRlbmNpZXMuZW5naW5lJztcbmltcG9ydCBFeHBvcnRFbmdpbmUgZnJvbSAnLi9lbmdpbmVzL2V4cG9ydC5lbmdpbmUnO1xuaW1wb3J0IEZpbGVFbmdpbmUgZnJvbSAnLi9lbmdpbmVzL2ZpbGUuZW5naW5lJztcbmltcG9ydCBIdG1sRW5naW5lIGZyb20gJy4vZW5naW5lcy9odG1sLmVuZ2luZSc7XG5pbXBvcnQgSTE4bkVuZ2luZSBmcm9tICcuL2VuZ2luZXMvaTE4bi5lbmdpbmUnO1xuaW1wb3J0IE1hcmtkb3duRW5naW5lIGZyb20gJy4vZW5naW5lcy9tYXJrZG93bi5lbmdpbmUnO1xuaW1wb3J0IE5nZEVuZ2luZSBmcm9tICcuL2VuZ2luZXMvbmdkLmVuZ2luZSc7XG5pbXBvcnQgU2VhcmNoRW5naW5lIGZyb20gJy4vZW5naW5lcy9zZWFyY2guZW5naW5lJztcblxuaW1wb3J0IHsgQW5ndWxhckRlcGVuZGVuY2llcyB9IGZyb20gJy4vY29tcGlsZXIvYW5ndWxhci1kZXBlbmRlbmNpZXMnO1xuaW1wb3J0IHsgQW5ndWxhckpTRGVwZW5kZW5jaWVzIH0gZnJvbSAnLi9jb21waWxlci9hbmd1bGFyanMtZGVwZW5kZW5jaWVzJztcblxuaW1wb3J0IEFuZ3VsYXJWZXJzaW9uVXRpbCBmcm9tICcuLi91dGlscy9hbmd1bGFyLXZlcnNpb24udXRpbCc7XG5pbXBvcnQgeyBDT01QT0RPQ19DT05TVEFOVFMgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHsgQ09NUE9ET0NfREVGQVVMVFMgfSBmcm9tICcuLi91dGlscy9kZWZhdWx0cyc7XG5pbXBvcnQgeyBwcm9taXNlU2VxdWVudGlhbCB9IGZyb20gJy4uL3V0aWxzL3Byb21pc2Utc2VxdWVudGlhbCc7XG5pbXBvcnQgUm91dGVyUGFyc2VyVXRpbCBmcm9tICcuLi91dGlscy9yb3V0ZXItcGFyc2VyLnV0aWwnO1xuXG5pbXBvcnQge1xuICAgIGNsZWFuTmFtZVdpdGhvdXRTcGFjZUFuZFRvTG93ZXJDYXNlLFxuICAgIGNsZWFuU291cmNlc0ZvcldhdGNoLFxuICAgIGZpbmRNYWluU291cmNlRm9sZGVyXG59IGZyb20gJy4uL3V0aWxzL3V0aWxzJztcblxuaW1wb3J0IHsgQWRkaXRpb25hbE5vZGUgfSBmcm9tICcuL2ludGVyZmFjZXMvYWRkaXRpb25hbC1ub2RlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDb3ZlcmFnZURhdGEgfSBmcm9tICcuL2ludGVyZmFjZXMvY292ZXJhZ2VEYXRhLmludGVyZmFjZSc7XG5cbmxldCBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xubGV0IHN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XG5sZXQgZ2VuZXJhdGlvblByb21pc2VSZXNvbHZlO1xubGV0IGdlbmVyYXRpb25Qcm9taXNlUmVqZWN0O1xubGV0IGdlbmVyYXRpb25Qcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGdlbmVyYXRpb25Qcm9taXNlUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgZ2VuZXJhdGlvblByb21pc2VSZWplY3QgPSByZWplY3Q7XG59KTtcblxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uIHtcbiAgICAvKipcbiAgICAgKiBGaWxlcyBwcm9jZXNzZWQgZHVyaW5nIGluaXRpYWwgc2Nhbm5pbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlsZXM6IEFycmF5PHN0cmluZz47XG4gICAgLyoqXG4gICAgICogRmlsZXMgcHJvY2Vzc2VkIGR1cmluZyB3YXRjaCBzY2FubmluZ1xuICAgICAqL1xuICAgIHB1YmxpYyB1cGRhdGVkRmlsZXM6IEFycmF5PHN0cmluZz47XG4gICAgLyoqXG4gICAgICogRmlsZXMgY2hhbmdlZCBkdXJpbmcgd2F0Y2ggc2Nhbm5pbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgd2F0Y2hDaGFuZ2VkRmlsZXM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAvKipcbiAgICAgKiBCb29sZWFuIGZvciB3YXRjaGluZyBzdGF0dXNcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNXYXRjaGluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogU3RvcmUgcGFja2FnZS5qc29uIGRhdGFcbiAgICAgKi9cbiAgICBwcml2YXRlIHBhY2thZ2VKc29uRGF0YSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGNvbXBvZG9jIGFwcGxpY2F0aW9uIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9wdGlvbnMgdGhhdCBzaG91bGQgYmUgdXNlZC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zPzogT2JqZWN0KSB7XG4gICAgICAgIGZvciAobGV0IG9wdGlvbiBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIENvbmZpZ3VyYXRpb24ubWFpbkRhdGFbb3B0aW9uXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhW29wdGlvbl0gPSBvcHRpb25zW29wdGlvbl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBGb3IgZG9jdW1lbnRhdGlvbk1haW5OYW1lLCBwcm9jZXNzIGl0IG91dHNpZGUgdGhlIGxvb3AsIGZvciBoYW5kbGluZyBjb25mbGljdCB3aXRoIHBhZ2VzIG5hbWVcbiAgICAgICAgICAgIGlmIChvcHRpb24gPT09ICduYW1lJykge1xuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZG9jdW1lbnRhdGlvbk1haW5OYW1lID0gb3B0aW9uc1tvcHRpb25dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRm9yIGRvY3VtZW50YXRpb25NYWluTmFtZSwgcHJvY2VzcyBpdCBvdXRzaWRlIHRoZSBsb29wLCBmb3IgaGFuZGxpbmcgY29uZmxpY3Qgd2l0aCBwYWdlcyBuYW1lXG4gICAgICAgICAgICBpZiAob3B0aW9uID09PSAnc2lsZW50Jykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5zaWxlbnQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IGNvbXBvZG9jIHByb2Nlc3NcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2VuZXJhdGUoKTogUHJvbWlzZTx7fT4ge1xuICAgICAgICBwcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCB0aGlzLnVuaGFuZGxlZFJlamVjdGlvbkxpc3RlbmVyKTtcbiAgICAgICAgcHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb24nLCB0aGlzLnVuY2F1Z2h0RXhjZXB0aW9uTGlzdGVuZXIpO1xuXG4gICAgICAgIEkxOG5FbmdpbmUuaW5pdChDb25maWd1cmF0aW9uLm1haW5EYXRhLmxhbmd1YWdlKTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dC5jaGFyQXQoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQubGVuZ3RoIC0gMSkgIT09ICcvJ1xuICAgICAgICApIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0ICs9ICcvJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmV4cG9ydEZvcm1hdCAhPT0gQ09NUE9ET0NfREVGQVVMVFMuZXhwb3J0Rm9ybWF0KSB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NQYWNrYWdlSnNvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgSHRtbEVuZ2luZS5pbml0KENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudGVtcGxhdGVzKS50aGVuKCgpID0+IHRoaXMucHJvY2Vzc1BhY2thZ2VKc29uKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZW5lcmF0aW9uUHJvbWlzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGVuZENhbGxiYWNrKCkge1xuICAgICAgICBwcm9jZXNzLnJlbW92ZUxpc3RlbmVyKCd1bmhhbmRsZWRSZWplY3Rpb24nLCB0aGlzLnVuaGFuZGxlZFJlamVjdGlvbkxpc3RlbmVyKTtcbiAgICAgICAgcHJvY2Vzcy5yZW1vdmVMaXN0ZW5lcigndW5jYXVnaHRFeGNlcHRpb24nLCB0aGlzLnVuY2F1Z2h0RXhjZXB0aW9uTGlzdGVuZXIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdW5oYW5kbGVkUmVqZWN0aW9uTGlzdGVuZXIoZXJyLCBwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdVbmhhbmRsZWQgUmVqZWN0aW9uIGF0OicsIHAsICdyZWFzb246JywgZXJyKTtcbiAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgJ1NvcnJ5LCBidXQgdGhlcmUgd2FzIGEgcHJvYmxlbSBkdXJpbmcgcGFyc2luZyBvciBnZW5lcmF0aW9uIG9mIHRoZSBkb2N1bWVudGF0aW9uLiBQbGVhc2UgZmlsbCBhbiBpc3N1ZSBvbiBnaXRodWIuIChodHRwczovL2dpdGh1Yi5jb20vY29tcG9kb2MvY29tcG9kb2MvaXNzdWVzL25ldyknXG4gICAgICAgICk7IC8vIHRzbGludDpkaXNhYmxlLWxpbmVcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdW5jYXVnaHRFeGNlcHRpb25MaXN0ZW5lcihlcnIpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgICdTb3JyeSwgYnV0IHRoZXJlIHdhcyBhIHByb2JsZW0gZHVyaW5nIHBhcnNpbmcgb3IgZ2VuZXJhdGlvbiBvZiB0aGUgZG9jdW1lbnRhdGlvbi4gUGxlYXNlIGZpbGwgYW4gaXNzdWUgb24gZ2l0aHViLiAoaHR0cHM6Ly9naXRodWIuY29tL2NvbXBvZG9jL2NvbXBvZG9jL2lzc3Vlcy9uZXcpJ1xuICAgICAgICApOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lXG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGFydCBjb21wb2RvYyBkb2N1bWVudGF0aW9uIGNvdmVyYWdlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHRlc3RDb3ZlcmFnZSgpIHtcbiAgICAgICAgdGhpcy5nZXREZXBlbmRlbmNpZXNEYXRhKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcmUgZmlsZXMgZm9yIGluaXRpYWwgcHJvY2Vzc2luZ1xuICAgICAqIEBwYXJhbSAge0FycmF5PHN0cmluZz59IGZpbGVzIEZpbGVzIGZvdW5kIGR1cmluZyBzb3VyY2UgZm9sZGVyIGFuZCB0c2NvbmZpZyBzY2FuXG4gICAgICovXG4gICAgcHVibGljIHNldEZpbGVzKGZpbGVzOiBBcnJheTxzdHJpbmc+KSB7XG4gICAgICAgIHRoaXMuZmlsZXMgPSBmaWxlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdG9yZSBmaWxlcyBmb3Igd2F0Y2ggcHJvY2Vzc2luZ1xuICAgICAqIEBwYXJhbSAge0FycmF5PHN0cmluZz59IGZpbGVzIEZpbGVzIGZvdW5kIGR1cmluZyBzb3VyY2UgZm9sZGVyIGFuZCB0c2NvbmZpZyBzY2FuXG4gICAgICovXG4gICAgcHVibGljIHNldFVwZGF0ZWRGaWxlcyhmaWxlczogQXJyYXk8c3RyaW5nPikge1xuICAgICAgICB0aGlzLnVwZGF0ZWRGaWxlcyA9IGZpbGVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIGJvb2xlYW4gaW5kaWNhdGluZyBwcmVzZW5jZSBvZiBvbmUgVHlwZVNjcmlwdCBmaWxlIGluIHVwZGF0ZWRGaWxlcyBsaXN0XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gUmVzdWx0IG9mIHNjYW5cbiAgICAgKi9cbiAgICBwdWJsaWMgaGFzV2F0Y2hlZEZpbGVzVFNGaWxlcygpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgICAgIF8uZm9yRWFjaCh0aGlzLnVwZGF0ZWRGaWxlcywgZmlsZSA9PiB7XG4gICAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKGZpbGUpID09PSAnLnRzJykge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGEgYm9vbGVhbiBpbmRpY2F0aW5nIHByZXNlbmNlIG9mIG9uZSByb290IG1hcmtkb3duIGZpbGVzIGluIHVwZGF0ZWRGaWxlcyBsaXN0XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gUmVzdWx0IG9mIHNjYW5cbiAgICAgKi9cbiAgICBwdWJsaWMgaGFzV2F0Y2hlZEZpbGVzUm9vdE1hcmtkb3duRmlsZXMoKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcblxuICAgICAgICBfLmZvckVhY2godGhpcy51cGRhdGVkRmlsZXMsIGZpbGUgPT4ge1xuICAgICAgICAgICAgaWYgKHBhdGguZXh0bmFtZShmaWxlKSA9PT0gJy5tZCcgJiYgcGF0aC5kaXJuYW1lKGZpbGUpID09PSBjd2QpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFyIGZpbGVzIGZvciB3YXRjaCBwcm9jZXNzaW5nXG4gICAgICovXG4gICAgcHVibGljIGNsZWFyVXBkYXRlZEZpbGVzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZWRGaWxlcyA9IFtdO1xuICAgICAgICB0aGlzLndhdGNoQ2hhbmdlZEZpbGVzID0gW107XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcm9jZXNzUGFja2FnZUpzb24oKTogdm9pZCB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdTZWFyY2hpbmcgcGFja2FnZS5qc29uIGZpbGUnKTtcbiAgICAgICAgRmlsZUVuZ2luZS5nZXQoY3dkICsgcGF0aC5zZXAgKyAncGFja2FnZS5qc29uJykudGhlbihcbiAgICAgICAgICAgIHBhY2thZ2VEYXRhID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGFyc2VkRGF0YSA9IEpTT04ucGFyc2UocGFja2FnZURhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMucGFja2FnZUpzb25EYXRhID0gcGFyc2VkRGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBwYXJzZWREYXRhLm5hbWUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZG9jdW1lbnRhdGlvbk1haW5OYW1lID09PSBDT01QT0RPQ19ERUZBVUxUUy50aXRsZVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRvY3VtZW50YXRpb25NYWluTmFtZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWREYXRhLm5hbWUgKyAnIGRvY3VtZW50YXRpb24nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHBhcnNlZERhdGEuZGVzY3JpcHRpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZG9jdW1lbnRhdGlvbk1haW5EZXNjcmlwdGlvbiA9IHBhcnNlZERhdGEuZGVzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYW5ndWxhclZlcnNpb24gPSBBbmd1bGFyVmVyc2lvblV0aWwuZ2V0QW5ndWxhclZlcnNpb25PZlByb2plY3QoXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZERhdGFcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdwYWNrYWdlLmpzb24gZmlsZSBmb3VuZCcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJzZWREYXRhLmRlcGVuZGVuY2llcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzUGFja2FnZURlcGVuZGVuY2llcyhwYXJzZWREYXRhLmRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcGFyc2VkRGF0YS5wZWVyRGVwZW5kZW5jaWVzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NQYWNrYWdlUGVlckRlcGVuZGVuY2llcyhwYXJzZWREYXRhLnBlZXJEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc01hcmtkb3ducygpLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RGVwZW5kZW5jaWVzRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdDb250aW51aW5nIHdpdGhvdXQgcGFja2FnZS5qc29uIGZpbGUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NNYXJrZG93bnMoKS50aGVuKFxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERlcGVuZGVuY2llc0RhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlMSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyb3JNZXNzYWdlMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgcHJvY2Vzc1BhY2thZ2VQZWVyRGVwZW5kZW5jaWVzKGRlcGVuZGVuY2llcyk6IHZvaWQge1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJvY2Vzc2luZyBwYWNrYWdlLmpzb24gcGVlckRlcGVuZGVuY2llcycpO1xuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnBhY2thZ2VQZWVyRGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzO1xuICAgICAgICBpZiAoIUNvbmZpZ3VyYXRpb24uaGFzUGFnZSgnZGVwZW5kZW5jaWVzJykpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZSh7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2RlcGVuZGVuY2llcycsXG4gICAgICAgICAgICAgICAgaWQ6ICdwYWNrYWdlRGVwZW5kZW5jaWVzJyxcbiAgICAgICAgICAgICAgICBjb250ZXh0OiAncGFja2FnZS1kZXBlbmRlbmNpZXMnLFxuICAgICAgICAgICAgICAgIGRlcHRoOiAwLFxuICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLlJPT1RcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcm9jZXNzUGFja2FnZURlcGVuZGVuY2llcyhkZXBlbmRlbmNpZXMpOiB2b2lkIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2Nlc3NpbmcgcGFja2FnZS5qc29uIGRlcGVuZGVuY2llcycpO1xuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnBhY2thZ2VEZXBlbmRlbmNpZXMgPSBkZXBlbmRlbmNpZXM7XG4gICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZSh7XG4gICAgICAgICAgICBuYW1lOiAnZGVwZW5kZW5jaWVzJyxcbiAgICAgICAgICAgIGlkOiAncGFja2FnZURlcGVuZGVuY2llcycsXG4gICAgICAgICAgICBjb250ZXh0OiAncGFja2FnZS1kZXBlbmRlbmNpZXMnLFxuICAgICAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5ST09UXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcHJvY2Vzc01hcmtkb3ducygpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgICAgICdTZWFyY2hpbmcgUkVBRE1FLm1kLCBDSEFOR0VMT0cubWQsIENPTlRSSUJVVElORy5tZCwgTElDRU5TRS5tZCwgVE9ETy5tZCBmaWxlcydcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgbGV0IG1hcmtkb3ducyA9IFsncmVhZG1lJywgJ2NoYW5nZWxvZycsICdjb250cmlidXRpbmcnLCAnbGljZW5zZScsICd0b2RvJ107XG4gICAgICAgICAgICBsZXQgbnVtYmVyT2ZNYXJrZG93bnMgPSA1O1xuICAgICAgICAgICAgbGV0IGxvb3AgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBudW1iZXJPZk1hcmtkb3ducykge1xuICAgICAgICAgICAgICAgICAgICBNYXJrZG93bkVuZ2luZS5nZXRUcmFkaXRpb25hbE1hcmtkb3duKG1hcmtkb3duc1tpXS50b1VwcGVyQ2FzZSgpKS50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlYWRtZURhdGE6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG1hcmtkb3duc1tpXSA9PT0gJ3JlYWRtZScgPyAnaW5kZXgnIDogbWFya2Rvd25zW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAnZ2V0dGluZy1zdGFydGVkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdnZXR0aW5nLXN0YXJ0ZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJrZG93bjogcmVhZG1lRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLlJPT1RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFya2Rvd25zW2ldID09PSAncmVhZG1lJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnJlYWRtZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnb3ZlcnZpZXcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdvdmVydmlldycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAnb3ZlcnZpZXcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuUk9PVFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm1hcmtkb3ducy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG1hcmtkb3duc1tpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwcGVybmFtZTogbWFya2Rvd25zW2ldLnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXB0aDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLlJPT1RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAke21hcmtkb3duc1tpXS50b1VwcGVyQ2FzZSgpfS5tZCBmaWxlIGZvdW5kYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oYENvbnRpbnVpbmcgd2l0aG91dCAke21hcmtkb3duc1tpXS50b1VwcGVyQ2FzZSgpfS5tZCBmaWxlYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcmtkb3duc1tpXSA9PT0gJ3JlYWRtZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hZGRQYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdpbmRleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogJ2luZGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6ICdvdmVydmlldycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXB0aDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLlJPT1RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb29wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsb29wKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVidWlsZFJvb3RNYXJrZG93bnMoKTogdm9pZCB7XG4gICAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgJ1JlZ2VuZXJhdGluZyBSRUFETUUubWQsIENIQU5HRUxPRy5tZCwgQ09OVFJJQlVUSU5HLm1kLCBMSUNFTlNFLm1kLCBUT0RPLm1kIHBhZ2VzJ1xuICAgICAgICApO1xuXG4gICAgICAgIGxldCBhY3Rpb25zID0gW107XG5cbiAgICAgICAgQ29uZmlndXJhdGlvbi5yZXNldFJvb3RNYXJrZG93blBhZ2VzKCk7XG5cbiAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NNYXJrZG93bnMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJvbWlzZVNlcXVlbnRpYWwoYWN0aW9ucylcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzUGFnZXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyVXBkYXRlZEZpbGVzKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yTWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgZGVwZW5kZW5jeSBkYXRhIGZvciBzbWFsbCBncm91cCBvZiB1cGRhdGVkIGZpbGVzIGR1cmluZyB3YXRjaCBwcm9jZXNzXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXRNaWNyb0RlcGVuZGVuY2llc0RhdGEoKTogdm9pZCB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgZGlmZiBkZXBlbmRlbmNpZXMgZGF0YScpO1xuXG4gICAgICAgIGxldCBkZXBlbmRlbmNpZXNDbGFzczogQW5ndWxhckRlcGVuZGVuY2llcyB8IEFuZ3VsYXJKU0RlcGVuZGVuY2llcyA9IEFuZ3VsYXJEZXBlbmRlbmNpZXM7XG4gICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYW5ndWxhclByb2plY3QgPSB0cnVlO1xuXG4gICAgICAgIGlmICh0aGlzLmRldGVjdEFuZ3VsYXJKU1Byb2plY3RzKCkpIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdBbmd1bGFySlMgcHJvamVjdCBkZXRlY3RlZCcpO1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5hbmd1bGFyUHJvamVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5hbmd1bGFySlNQcm9qZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGRlcGVuZGVuY2llc0NsYXNzID0gQW5ndWxhckpTRGVwZW5kZW5jaWVzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNyYXdsZXIgPSBuZXcgZGVwZW5kZW5jaWVzQ2xhc3MoXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZWRGaWxlcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0c2NvbmZpZ0RpcmVjdG9yeTogcGF0aC5kaXJuYW1lKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgIFJvdXRlclBhcnNlclV0aWxcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgZGVwZW5kZW5jaWVzRGF0YSA9IGNyYXdsZXIuZ2V0RGVwZW5kZW5jaWVzKCk7XG5cbiAgICAgICAgRGVwZW5kZW5jaWVzRW5naW5lLnVwZGF0ZShkZXBlbmRlbmNpZXNEYXRhKTtcblxuICAgICAgICB0aGlzLnByZXBhcmVKdXN0QUZld1RoaW5ncyhkZXBlbmRlbmNpZXNEYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWJ1aWxkIGV4dGVybmFsIGRvY3VtZW50YXRpb24gZHVyaW5nIHdhdGNoIHByb2Nlc3NcbiAgICAgKi9cbiAgICBwcml2YXRlIHJlYnVpbGRFeHRlcm5hbERvY3VtZW50YXRpb24oKTogdm9pZCB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdSZWJ1aWxkIGV4dGVybmFsIGRvY3VtZW50YXRpb24nKTtcblxuICAgICAgICBsZXQgYWN0aW9ucyA9IFtdO1xuXG4gICAgICAgIENvbmZpZ3VyYXRpb24ucmVzZXRBZGRpdGlvbmFsUGFnZXMoKTtcblxuICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbmNsdWRlcyAhPT0gJycpIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlcGFyZUV4dGVybmFsSW5jbHVkZXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvbWlzZVNlcXVlbnRpYWwoYWN0aW9ucylcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzUGFnZXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyVXBkYXRlZEZpbGVzKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yTWVzc2FnZSA9PiB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRldGVjdEFuZ3VsYXJKU1Byb2plY3RzKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wYWNrYWdlSnNvbkRhdGEuZGVwZW5kZW5jaWVzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnBhY2thZ2VKc29uRGF0YS5kZXBlbmRlbmNpZXMuYW5ndWxhciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgY291bnRKU0ZpbGVzID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGVzLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXRoLmV4dG5hbWUoZmlsZSkgPT09ICcuanMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudEpTRmlsZXMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxldCBwZXJjZW50T2ZKU0ZpbGVzID0gKGNvdW50SlNGaWxlcyAqIDEwMCkgLyB0aGlzLmZpbGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAocGVyY2VudE9mSlNGaWxlcyA+PSA3NSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXREZXBlbmRlbmNpZXNEYXRhKCk6IHZvaWQge1xuICAgICAgICBsb2dnZXIuaW5mbygnR2V0IGRlcGVuZGVuY2llcyBkYXRhJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuZ3VsYXJKUyBkZXRlY3Rpb24gc3RyYXRlZ3kgOlxuICAgICAgICAgKiAtIGlmIGluIHBhY2thZ2UuanNvblxuICAgICAgICAgKiAtIGlmIDc1JSBvZiBzY2FubmVkIGZpbGVzIGFyZSAqLmpzIGZpbGVzXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgZGVwZW5kZW5jaWVzQ2xhc3M6IEFuZ3VsYXJEZXBlbmRlbmNpZXMgfCBBbmd1bGFySlNEZXBlbmRlbmNpZXMgPSBBbmd1bGFyRGVwZW5kZW5jaWVzO1xuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmFuZ3VsYXJQcm9qZWN0ID0gdHJ1ZTtcblxuICAgICAgICBpZiAodGhpcy5kZXRlY3RBbmd1bGFySlNQcm9qZWN0cygpKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnQW5ndWxhckpTIHByb2plY3QgZGV0ZWN0ZWQnKTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYW5ndWxhclByb2plY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYW5ndWxhckpTUHJvamVjdCA9IHRydWU7XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXNDbGFzcyA9IEFuZ3VsYXJKU0RlcGVuZGVuY2llcztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjcmF3bGVyID0gbmV3IGRlcGVuZGVuY2llc0NsYXNzKFxuICAgICAgICAgICAgdGhpcy5maWxlcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0c2NvbmZpZ0RpcmVjdG9yeTogcGF0aC5kaXJuYW1lKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgIFJvdXRlclBhcnNlclV0aWxcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgZGVwZW5kZW5jaWVzRGF0YSA9IGNyYXdsZXIuZ2V0RGVwZW5kZW5jaWVzKCk7XG5cbiAgICAgICAgRGVwZW5kZW5jaWVzRW5naW5lLmluaXQoZGVwZW5kZW5jaWVzRGF0YSk7XG5cbiAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5yb3V0ZXNMZW5ndGggPSBSb3V0ZXJQYXJzZXJVdGlsLnJvdXRlc0xlbmd0aCgpO1xuXG4gICAgICAgIHRoaXMucHJpbnRTdGF0aXN0aWNzKCk7XG5cbiAgICAgICAgdGhpcy5wcmVwYXJlRXZlcnl0aGluZygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcHJlcGFyZUp1c3RBRmV3VGhpbmdzKGRpZmZDcmF3bGVkRGF0YSk6IHZvaWQge1xuICAgICAgICBsZXQgYWN0aW9ucyA9IFtdO1xuXG4gICAgICAgIENvbmZpZ3VyYXRpb24ucmVzZXRQYWdlcygpO1xuXG4gICAgICAgIGlmICghQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlUm91dGVzR3JhcGgpIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB0aGlzLnByZXBhcmVSb3V0ZXMoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGlmZkNyYXdsZWREYXRhLmNvbXBvbmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHRoaXMucHJlcGFyZUNvbXBvbmVudHMoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpZmZDcmF3bGVkRGF0YS5jb250cm9sbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4gdGhpcy5wcmVwYXJlQ29udHJvbGxlcnMoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpZmZDcmF3bGVkRGF0YS5tb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB0aGlzLnByZXBhcmVNb2R1bGVzKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRpZmZDcmF3bGVkRGF0YS5kaXJlY3RpdmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB0aGlzLnByZXBhcmVEaXJlY3RpdmVzKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRpZmZDcmF3bGVkRGF0YS5pbmplY3RhYmxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4gdGhpcy5wcmVwYXJlSW5qZWN0YWJsZXMoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGlmZkNyYXdsZWREYXRhLmludGVyY2VwdG9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4gdGhpcy5wcmVwYXJlSW50ZXJjZXB0b3JzKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRpZmZDcmF3bGVkRGF0YS5ndWFyZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHRoaXMucHJlcGFyZUd1YXJkcygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkaWZmQ3Jhd2xlZERhdGEucGlwZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHRoaXMucHJlcGFyZVBpcGVzKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRpZmZDcmF3bGVkRGF0YS5jbGFzc2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB0aGlzLnByZXBhcmVDbGFzc2VzKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRpZmZDcmF3bGVkRGF0YS5pbnRlcmZhY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB0aGlzLnByZXBhcmVJbnRlcmZhY2VzKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZGlmZkNyYXdsZWREYXRhLm1pc2NlbGxhbmVvdXMudmFyaWFibGVzLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgICAgIGRpZmZDcmF3bGVkRGF0YS5taXNjZWxsYW5lb3VzLmZ1bmN0aW9ucy5sZW5ndGggPiAwIHx8XG4gICAgICAgICAgICBkaWZmQ3Jhd2xlZERhdGEubWlzY2VsbGFuZW91cy50eXBlYWxpYXNlcy5sZW5ndGggPiAwIHx8XG4gICAgICAgICAgICBkaWZmQ3Jhd2xlZERhdGEubWlzY2VsbGFuZW91cy5lbnVtZXJhdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB0aGlzLnByZXBhcmVNaXNjZWxsYW5lb3VzKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVDb3ZlcmFnZSkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHRoaXMucHJlcGFyZUNvdmVyYWdlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvbWlzZVNlcXVlbnRpYWwoYWN0aW9ucylcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzR3JhcGhzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclVwZGF0ZWRGaWxlcygpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvck1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcmludFN0YXRpc3RpY3MoKSB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCctLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHN0YXRpc3RpY3MgJyk7XG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUubW9kdWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgLSBmaWxlcyAgICAgIDogJHt0aGlzLmZpbGVzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoRGVwZW5kZW5jaWVzRW5naW5lLm1vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYC0gbW9kdWxlICAgICA6ICR7RGVwZW5kZW5jaWVzRW5naW5lLm1vZHVsZXMubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUuY29tcG9uZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgLSBjb21wb25lbnQgIDogJHtEZXBlbmRlbmNpZXNFbmdpbmUuY29tcG9uZW50cy5sZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKERlcGVuZGVuY2llc0VuZ2luZS5jb250cm9sbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgLSBjb250cm9sbGVyIDogJHtEZXBlbmRlbmNpZXNFbmdpbmUuY29udHJvbGxlcnMubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUuZGlyZWN0aXZlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgLSBkaXJlY3RpdmUgIDogJHtEZXBlbmRlbmNpZXNFbmdpbmUuZGlyZWN0aXZlcy5sZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKERlcGVuZGVuY2llc0VuZ2luZS5pbmplY3RhYmxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgLSBpbmplY3RhYmxlIDogJHtEZXBlbmRlbmNpZXNFbmdpbmUuaW5qZWN0YWJsZXMubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUuaW50ZXJjZXB0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAtIGluamVjdG9yICAgOiAke0RlcGVuZGVuY2llc0VuZ2luZS5pbnRlcmNlcHRvcnMubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUuZ3VhcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAtIGd1YXJkICAgICAgOiAke0RlcGVuZGVuY2llc0VuZ2luZS5ndWFyZHMubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUucGlwZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYC0gcGlwZSAgICAgICA6ICR7RGVwZW5kZW5jaWVzRW5naW5lLnBpcGVzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoRGVwZW5kZW5jaWVzRW5naW5lLmNsYXNzZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYC0gY2xhc3MgICAgICA6ICR7RGVwZW5kZW5jaWVzRW5naW5lLmNsYXNzZXMubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUuaW50ZXJmYWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgLSBpbnRlcmZhY2UgIDogJHtEZXBlbmRlbmNpZXNFbmdpbmUuaW50ZXJmYWNlcy5sZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEucm91dGVzTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYC0gcm91dGUgICAgICA6ICR7Q29uZmlndXJhdGlvbi5tYWluRGF0YS5yb3V0ZXNMZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgbG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByZXBhcmVFdmVyeXRoaW5nKCkge1xuICAgICAgICBsZXQgYWN0aW9ucyA9IFtdO1xuXG4gICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVwYXJlQ29tcG9uZW50cygpO1xuICAgICAgICB9KTtcbiAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXBhcmVNb2R1bGVzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUuZGlyZWN0aXZlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXBhcmVEaXJlY3RpdmVzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUuY29udHJvbGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVwYXJlQ29udHJvbGxlcnMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKERlcGVuZGVuY2llc0VuZ2luZS5pbmplY3RhYmxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXBhcmVJbmplY3RhYmxlcygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoRGVwZW5kZW5jaWVzRW5naW5lLmludGVyY2VwdG9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXBhcmVJbnRlcmNlcHRvcnMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKERlcGVuZGVuY2llc0VuZ2luZS5ndWFyZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVwYXJlR3VhcmRzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIERlcGVuZGVuY2llc0VuZ2luZS5yb3V0ZXMgJiZcbiAgICAgICAgICAgIERlcGVuZGVuY2llc0VuZ2luZS5yb3V0ZXMuY2hpbGRyZW4ubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgIUNvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVJvdXRlc0dyYXBoXG4gICAgICAgICkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVwYXJlUm91dGVzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChEZXBlbmRlbmNpZXNFbmdpbmUucGlwZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVwYXJlUGlwZXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKERlcGVuZGVuY2llc0VuZ2luZS5jbGFzc2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlcGFyZUNsYXNzZXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKERlcGVuZGVuY2llc0VuZ2luZS5pbnRlcmZhY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlcGFyZUludGVyZmFjZXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgRGVwZW5kZW5jaWVzRW5naW5lLm1pc2NlbGxhbmVvdXMudmFyaWFibGVzLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgICAgIERlcGVuZGVuY2llc0VuZ2luZS5taXNjZWxsYW5lb3VzLmZ1bmN0aW9ucy5sZW5ndGggPiAwIHx8XG4gICAgICAgICAgICBEZXBlbmRlbmNpZXNFbmdpbmUubWlzY2VsbGFuZW91cy50eXBlYWxpYXNlcy5sZW5ndGggPiAwIHx8XG4gICAgICAgICAgICBEZXBlbmRlbmNpZXNFbmdpbmUubWlzY2VsbGFuZW91cy5lbnVtZXJhdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlcGFyZU1pc2NlbGxhbmVvdXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVDb3ZlcmFnZSkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcmVwYXJlQ292ZXJhZ2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudW5pdFRlc3RDb3ZlcmFnZSAhPT0gJycpIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJlcGFyZVVuaXRUZXN0Q292ZXJhZ2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW5jbHVkZXMgIT09ICcnKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXBhcmVFeHRlcm5hbEluY2x1ZGVzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb21pc2VTZXF1ZW50aWFsKGFjdGlvbnMpXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmV4cG9ydEZvcm1hdCAhPT0gQ09NUE9ET0NfREVGQVVMVFMuZXhwb3J0Rm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIENPTVBPRE9DX0RFRkFVTFRTLmV4cG9ydEZvcm1hdHNTdXBwb3J0ZWQuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmV4cG9ydEZvcm1hdFxuICAgICAgICAgICAgICAgICAgICAgICAgKSA+IC0xXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYEdlbmVyYXRpbmcgZG9jdW1lbnRhdGlvbiBpbiBleHBvcnQgZm9ybWF0ICR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZXhwb3J0Rm9ybWF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWBcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBFeHBvcnRFbmdpbmUuZXhwb3J0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGlvblByb21pc2VSZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmRDYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRG9jdW1lbnRhdGlvbiBnZW5lcmF0ZWQgaW4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnIGluICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRFbGFwc2VkVGltZSgpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgc2Vjb25kcydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybihgRXhwb3J0ZWQgZm9ybWF0IG5vdCBzdXBwb3J0ZWRgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0dyYXBocygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3JNZXNzYWdlID0+IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW5jbHVkZWRQYXRoRm9yRmlsZShmaWxlKSB7XG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4oQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbmNsdWRlcywgZmlsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcmVwYXJlRXh0ZXJuYWxJbmNsdWRlcygpIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ0FkZGluZyBleHRlcm5hbCBtYXJrZG93biBmaWxlcycpO1xuICAgICAgICAvLyBTY2FuIGluY2x1ZGUgZm9sZGVyIGZvciBmaWxlcyBkZXRhaWxlZCBpbiBzdW1tYXJ5Lmpzb25cbiAgICAgICAgLy8gRm9yIGVhY2ggZmlsZSwgYWRkIHRvIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYWRkaXRpb25hbFBhZ2VzXG4gICAgICAgIC8vIEVhY2ggZmlsZSB3aWxsIGJlIGNvbnZlcnRlZCB0byBodG1sIHBhZ2UsIGluc2lkZSBDT01QT0RPQ19ERUZBVUxUUy5hZGRpdGlvbmFsRW50cnlQYXRoXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBGaWxlRW5naW5lLmdldCh0aGlzLmdldEluY2x1ZGVkUGF0aEZvckZpbGUoJ3N1bW1hcnkuanNvbicpKS50aGVuKFxuICAgICAgICAgICAgICAgIHN1bW1hcnlEYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ0FkZGl0aW9uYWwgZG9jdW1lbnRhdGlvbjogc3VtbWFyeS5qc29uIGZpbGUgZm91bmQnKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRTdW1tYXJ5RGF0YSA9IEpTT04ucGFyc2Uoc3VtbWFyeURhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RMZXZlbE9uZVBhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgdHJhdmVyc2UocGFyc2VkU3VtbWFyeURhdGEpLmZvckVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW52YWxpZC10aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ub3RSb290ICYmIHR5cGVvZiB0aGlzLm5vZGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWludmFsaWQtdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByYXdQYXRoID0gdGhpcy5wYXRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbnZhbGlkLXRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWRkaXRpb25hbE5vZGU6IEFkZGl0aW9uYWxOb2RlID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWxlID0gYWRkaXRpb25hbE5vZGUuZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGl0bGUgPSBhZGRpdGlvbmFsTm9kZS50aXRsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmluYWxQYXRoID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbmNsdWRlc0ZvbGRlcjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaW5hbERlcHRoID0gcmF3UGF0aC5maWx0ZXIoZWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlSW50KGVsLCAxMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgdGl0bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGNsZWFuTmFtZVdpdGhvdXRTcGFjZUFuZFRvTG93ZXJDYXNlKHRpdGxlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogSWQgY3JlYXRlZCB3aXRoIHRpdGxlICsgZmlsZSBwYXRoIGhhc2gsIHNlZW1zIHRvIGJlIGh5cG90aGV0aWNhbGx5IHVuaXF1ZSBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGNyeXB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNyZWF0ZUhhc2goJ21kNScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHRpdGxlICsgZmlsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kaWdlc3QoJ2hleCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbnZhbGlkLXRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmlkID0gaWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RFbGVtZW50Um9vdFRyZWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsRGVwdGguZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudFRyZWUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBsYXN0RWxlbWVudFJvb3RUcmVlID09PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHBhcnNlZFN1bW1hcnlEYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbGFzdEVsZW1lbnRSb290VHJlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudFRyZWUuY2hpbGRyZW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFRyZWUgPSBlbGVtZW50VHJlZS5jaGlsZHJlbltlbF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRUcmVlID0gZWxlbWVudFRyZWVbZWxdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxQYXRoICs9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJy8nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhbk5hbWVXaXRob3V0U3BhY2VBbmRUb0xvd2VyQ2FzZShlbGVtZW50VHJlZS50aXRsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0RWxlbWVudFJvb3RUcmVlID0gZWxlbWVudFRyZWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsUGF0aCA9IGZpbmFsUGF0aC5yZXBsYWNlKCcvJyArIHVybCwgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbWFya2Rvd25GaWxlID0gTWFya2Rvd25FbmdpbmUuZ2V0VHJhZGl0aW9uYWxNYXJrZG93blN5bmMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmdldEluY2x1ZGVkUGF0aEZvckZpbGUoZmlsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmluYWxEZXB0aC5sZW5ndGggPiA1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ09ubHkgNSBsZXZlbHMgb2YgZGVwdGggYXJlIHN1cHBvcnRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IF9wYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6ICdhZGRpdGlvbmFsLXBhZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGZpbmFsUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsUGFnZTogbWFya2Rvd25GaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoOiBmaW5hbERlcHRoLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbkxlbmd0aDogYWRkaXRpb25hbE5vZGUuY2hpbGRyZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBhZGRpdGlvbmFsTm9kZS5jaGlsZHJlbi5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0Q2hpbGQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLklOVEVSTkFMXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmFsRGVwdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdExldmVsT25lUGFnZSA9IF9wYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmFsRGVwdGgubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIGFsbCBjaGlsZCBwYWdlcyBvZiB0aGUgbGFzdCByb290IGxldmVsIDEgcGFnZSBpbnNpZGUgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0TGV2ZWxPbmVQYWdlLmNoaWxkcmVuLnB1c2goX3BhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZEFkZGl0aW9uYWxQYWdlKF9wYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgnRXJyb3IgZHVyaW5nIEFkZGl0aW9uYWwgZG9jdW1lbnRhdGlvbiBnZW5lcmF0aW9uJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHByZXBhcmVNb2R1bGVzKHNvbWVNb2R1bGVzPyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcmVwYXJlIG1vZHVsZXMnKTtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBsZXQgX21vZHVsZXMgPSBzb21lTW9kdWxlcyA/IHNvbWVNb2R1bGVzIDogRGVwZW5kZW5jaWVzRW5naW5lLmdldE1vZHVsZXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5tb2R1bGVzID0gX21vZHVsZXMubWFwKG5nTW9kdWxlID0+IHtcbiAgICAgICAgICAgICAgICBuZ01vZHVsZS5jb21wb2RvY0xpbmtzID0ge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcnM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgaW5qZWN0YWJsZXM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBwaXBlczogW11cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFsnZGVjbGFyYXRpb25zJywgJ2Jvb3RzdHJhcCcsICdpbXBvcnRzJywgJ2V4cG9ydHMnLCAnY29udHJvbGxlcnMnXS5mb3JFYWNoKFxuICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YVR5cGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2R1bGVbbWV0YWRhdGFUeXBlXSA9IG5nTW9kdWxlW21ldGFkYXRhVHlwZV0uZmlsdGVyKG1ldGFEYXRhSXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChtZXRhRGF0YUl0ZW0udHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkaXJlY3RpdmUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERlcGVuZGVuY2llc0VuZ2luZS5nZXREaXJlY3RpdmVzKCkuc29tZShkaXJlY3RpdmUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZERpcmVjdGl2ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1ldGFEYXRhSXRlbS5pZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWREaXJlY3RpdmUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGRpcmVjdGl2ZSBhcyBhbnkpLmlkID09PSBtZXRhRGF0YUl0ZW0uaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWREaXJlY3RpdmUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGRpcmVjdGl2ZSBhcyBhbnkpLm5hbWUgPT09IG1ldGFEYXRhSXRlbS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRGlyZWN0aXZlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFuZ01vZHVsZS5jb21wb2RvY0xpbmtzLmRpcmVjdGl2ZXMuaW5jbHVkZXMoZGlyZWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZ01vZHVsZS5jb21wb2RvY0xpbmtzLmRpcmVjdGl2ZXMucHVzaChkaXJlY3RpdmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0ZWREaXJlY3RpdmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjb21wb25lbnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERlcGVuZGVuY2llc0VuZ2luZS5nZXRDb21wb25lbnRzKCkuc29tZShjb21wb25lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZENvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1ldGFEYXRhSXRlbS5pZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRDb21wb25lbnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbXBvbmVudCBhcyBhbnkpLmlkID09PSBtZXRhRGF0YUl0ZW0uaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRDb21wb25lbnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbXBvbmVudCBhcyBhbnkpLm5hbWUgPT09IG1ldGFEYXRhSXRlbS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29tcG9uZW50ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFuZ01vZHVsZS5jb21wb2RvY0xpbmtzLmNvbXBvbmVudHMuaW5jbHVkZXMoY29tcG9uZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZ01vZHVsZS5jb21wb2RvY0xpbmtzLmNvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0ZWRDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjb250cm9sbGVyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0Q29udHJvbGxlcnMoKS5zb21lKGNvbnRyb2xsZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZENvbnRyb2xsZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtZXRhRGF0YUl0ZW0uaWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29udHJvbGxlciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29udHJvbGxlciBhcyBhbnkpLmlkID09PSBtZXRhRGF0YUl0ZW0uaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRDb250cm9sbGVyID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb250cm9sbGVyIGFzIGFueSkubmFtZSA9PT0gbWV0YURhdGFJdGVtLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRDb250cm9sbGVyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFuZ01vZHVsZS5jb21wb2RvY0xpbmtzLmNvbnRyb2xsZXJzLmluY2x1ZGVzKGNvbnRyb2xsZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kdWxlLmNvbXBvZG9jTGlua3MuY29udHJvbGxlcnMucHVzaChjb250cm9sbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGVkQ29udHJvbGxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ21vZHVsZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRGVwZW5kZW5jaWVzRW5naW5lLmdldE1vZHVsZXMoKS5zb21lKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZSA9PiAobW9kdWxlIGFzIGFueSkubmFtZSA9PT0gbWV0YURhdGFJdGVtLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncGlwZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRGVwZW5kZW5jaWVzRW5naW5lLmdldFBpcGVzKCkuc29tZShwaXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRQaXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWV0YURhdGFJdGVtLmlkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFBpcGUgPSAocGlwZSBhcyBhbnkpLmlkID09PSBtZXRhRGF0YUl0ZW0uaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRQaXBlID0gKHBpcGUgYXMgYW55KS5uYW1lID09PSBtZXRhRGF0YUl0ZW0ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFBpcGUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIW5nTW9kdWxlLmNvbXBvZG9jTGlua3MucGlwZXMuaW5jbHVkZXMocGlwZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2R1bGUuY29tcG9kb2NMaW5rcy5waXBlcy5wdXNoKHBpcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0ZWRQaXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBuZ01vZHVsZS5wcm92aWRlcnMgPSBuZ01vZHVsZS5wcm92aWRlcnMuZmlsdGVyKHByb3ZpZGVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIERlcGVuZGVuY2llc0VuZ2luZS5nZXRJbmplY3RhYmxlcygpLnNvbWUoaW5qZWN0YWJsZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSW5qZWN0YWJsZSA9IChpbmplY3RhYmxlIGFzIGFueSkubmFtZSA9PT0gcHJvdmlkZXIubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5qZWN0YWJsZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhbmdNb2R1bGUuY29tcG9kb2NMaW5rcy5pbmplY3RhYmxlcy5pbmNsdWRlcyhpbmplY3RhYmxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZ01vZHVsZS5jb21wb2RvY0xpbmtzLmluamVjdGFibGVzLnB1c2goaW5qZWN0YWJsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxlY3RlZEluamVjdGFibGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgRGVwZW5kZW5jaWVzRW5naW5lLmdldEludGVyY2VwdG9ycygpLnNvbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJjZXB0b3IgPT4gKGludGVyY2VwdG9yIGFzIGFueSkubmFtZSA9PT0gcHJvdmlkZXIubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIFRyeSBmaXhpbmcgdHlwZSB1bmRlZmluZWQgZm9yIGVhY2ggcHJvdmlkZXJzXG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKG5nTW9kdWxlLnByb3ZpZGVycywgcHJvdmlkZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0SW5qZWN0YWJsZXMoKS5maW5kKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGFibGUgPT4gKGluamVjdGFibGUgYXMgYW55KS5uYW1lID09PSBwcm92aWRlci5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXIudHlwZSA9ICdpbmplY3RhYmxlJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0SW50ZXJjZXB0b3JzKCkuZmluZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcmNlcHRvciA9PiAoaW50ZXJjZXB0b3IgYXMgYW55KS5uYW1lID09PSBwcm92aWRlci5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXIudHlwZSA9ICdpbnRlcmNlcHRvcic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBPcmRlciB0aGluZ3NcbiAgICAgICAgICAgICAgICBuZ01vZHVsZS5jb21wb2RvY0xpbmtzLmNvbXBvbmVudHMgPSBfLnNvcnRCeShuZ01vZHVsZS5jb21wb2RvY0xpbmtzLmNvbXBvbmVudHMsIFtcbiAgICAgICAgICAgICAgICAgICAgJ25hbWUnXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgbmdNb2R1bGUuY29tcG9kb2NMaW5rcy5jb250cm9sbGVycyA9IF8uc29ydEJ5KG5nTW9kdWxlLmNvbXBvZG9jTGlua3MuY29udHJvbGxlcnMsIFtcbiAgICAgICAgICAgICAgICAgICAgJ25hbWUnXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgbmdNb2R1bGUuY29tcG9kb2NMaW5rcy5kaXJlY3RpdmVzID0gXy5zb3J0QnkobmdNb2R1bGUuY29tcG9kb2NMaW5rcy5kaXJlY3RpdmVzLCBbXG4gICAgICAgICAgICAgICAgICAgICduYW1lJ1xuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIG5nTW9kdWxlLmNvbXBvZG9jTGlua3MuaW5qZWN0YWJsZXMgPSBfLnNvcnRCeShuZ01vZHVsZS5jb21wb2RvY0xpbmtzLmluamVjdGFibGVzLCBbXG4gICAgICAgICAgICAgICAgICAgICduYW1lJ1xuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIG5nTW9kdWxlLmNvbXBvZG9jTGlua3MucGlwZXMgPSBfLnNvcnRCeShuZ01vZHVsZS5jb21wb2RvY0xpbmtzLnBpcGVzLCBbJ25hbWUnXSk7XG5cbiAgICAgICAgICAgICAgICBuZ01vZHVsZS5kZWNsYXJhdGlvbnMgPSBfLnNvcnRCeShuZ01vZHVsZS5kZWNsYXJhdGlvbnMsIFsnbmFtZSddKTtcbiAgICAgICAgICAgICAgICBuZ01vZHVsZS5lbnRyeUNvbXBvbmVudHMgPSBfLnNvcnRCeShuZ01vZHVsZS5lbnRyeUNvbXBvbmVudHMsIFsnbmFtZSddKTtcbiAgICAgICAgICAgICAgICBuZ01vZHVsZS5wcm92aWRlcnMgPSBfLnNvcnRCeShuZ01vZHVsZS5wcm92aWRlcnMsIFsnbmFtZSddKTtcbiAgICAgICAgICAgICAgICBuZ01vZHVsZS5pbXBvcnRzID0gXy5zb3J0QnkobmdNb2R1bGUuaW1wb3J0cywgWyduYW1lJ10pO1xuICAgICAgICAgICAgICAgIG5nTW9kdWxlLmV4cG9ydHMgPSBfLnNvcnRCeShuZ01vZHVsZS5leHBvcnRzLCBbJ25hbWUnXSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmdNb2R1bGU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hZGRQYWdlKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbW9kdWxlcycsXG4gICAgICAgICAgICAgICAgaWQ6ICdtb2R1bGVzJyxcbiAgICAgICAgICAgICAgICBjb250ZXh0OiAnbW9kdWxlcycsXG4gICAgICAgICAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuUk9PVFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBsZW4gPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLm1vZHVsZXMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGxvb3AgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgTWFya2Rvd25FbmdpbmUuaGFzTmVpZ2hib3VyUmVhZG1lRmlsZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm1vZHVsZXNbaV0uZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAgJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5tb2R1bGVzW2ldLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGhhcyBhIFJFQURNRSBmaWxlLCBpbmNsdWRlIGl0YFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZWFkbWUgPSBNYXJrZG93bkVuZ2luZS5yZWFkTmVpZ2hib3VyUmVhZG1lRmlsZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm1vZHVsZXNbaV0uZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubW9kdWxlc1tpXS5yZWFkbWUgPSBtYXJrZWQocmVhZG1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogJ21vZHVsZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogQ29uZmlndXJhdGlvbi5tYWluRGF0YS5tb2R1bGVzW2ldLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogQ29uZmlndXJhdGlvbi5tYWluRGF0YS5tb2R1bGVzW2ldLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmF2VGFiczogdGhpcy5nZXROYXZUYWJzKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubW9kdWxlc1tpXSksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAnbW9kdWxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZTogQ29uZmlndXJhdGlvbi5tYWluRGF0YS5tb2R1bGVzW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5JTlRFUk5BTFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICBsb29wKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsb29wKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcmVwYXJlUGlwZXMgPSAoc29tZVBpcGVzPykgPT4ge1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJlcGFyZSBwaXBlcycpO1xuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnBpcGVzID0gc29tZVBpcGVzID8gc29tZVBpcGVzIDogRGVwZW5kZW5jaWVzRW5naW5lLmdldFBpcGVzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGxldCBsZW4gPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLnBpcGVzLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBsb29wID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpIDwgbGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwaXBlID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5waXBlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hcmtkb3duRW5naW5lLmhhc05laWdoYm91clJlYWRtZUZpbGUocGlwZS5maWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAke3BpcGUubmFtZX0gaGFzIGEgUkVBRE1FIGZpbGUsIGluY2x1ZGUgaXRgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZWFkbWUgPSBNYXJrZG93bkVuZ2luZS5yZWFkTmVpZ2hib3VyUmVhZG1lRmlsZShwaXBlLmZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGlwZS5yZWFkbWUgPSBtYXJrZWQocmVhZG1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6ICdwaXBlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwaXBlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogcGlwZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hdlRhYnM6IHRoaXMuZ2V0TmF2VGFicyhwaXBlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6ICdwaXBlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpcGU6IHBpcGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXB0aDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLklOVEVSTkFMXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChwaXBlLmlzRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlLm5hbWUgKz0gJy0nICsgcGlwZS5kdXBsaWNhdGVJZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2UocGFnZSk7XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIHByZXBhcmVDbGFzc2VzID0gKHNvbWVDbGFzc2VzPykgPT4ge1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJlcGFyZSBjbGFzc2VzJyk7XG4gICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY2xhc3NlcyA9IHNvbWVDbGFzc2VzXG4gICAgICAgICAgICA/IHNvbWVDbGFzc2VzXG4gICAgICAgICAgICA6IERlcGVuZGVuY2llc0VuZ2luZS5nZXRDbGFzc2VzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGxldCBsZW4gPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNsYXNzZXMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGxvb3AgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsYXNzZSA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY2xhc3Nlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hcmtkb3duRW5naW5lLmhhc05laWdoYm91clJlYWRtZUZpbGUoY2xhc3NlLmZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgICR7Y2xhc3NlLm5hbWV9IGhhcyBhIFJFQURNRSBmaWxlLCBpbmNsdWRlIGl0YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVhZG1lID0gTWFya2Rvd25FbmdpbmUucmVhZE5laWdoYm91clJlYWRtZUZpbGUoY2xhc3NlLmZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NlLnJlYWRtZSA9IG1hcmtlZChyZWFkbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogJ2NsYXNzZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogY2xhc3NlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogY2xhc3NlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmF2VGFiczogdGhpcy5nZXROYXZUYWJzKGNsYXNzZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAnY2xhc3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IGNsYXNzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuSU5URVJOQUxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzZS5pc0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZS5uYW1lICs9ICctJyArIGNsYXNzZS5kdXBsaWNhdGVJZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2UocGFnZSk7XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIHByZXBhcmVJbnRlcmZhY2VzKHNvbWVJbnRlcmZhY2VzPykge1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJlcGFyZSBpbnRlcmZhY2VzJyk7XG4gICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW50ZXJmYWNlcyA9IHNvbWVJbnRlcmZhY2VzXG4gICAgICAgICAgICA/IHNvbWVJbnRlcmZhY2VzXG4gICAgICAgICAgICA6IERlcGVuZGVuY2llc0VuZ2luZS5nZXRJbnRlcmZhY2VzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGxldCBsZW4gPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmludGVyZmFjZXMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGxvb3AgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGludGVyZiA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW50ZXJmYWNlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hcmtkb3duRW5naW5lLmhhc05laWdoYm91clJlYWRtZUZpbGUoaW50ZXJmLmZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgICR7aW50ZXJmLm5hbWV9IGhhcyBhIFJFQURNRSBmaWxlLCBpbmNsdWRlIGl0YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVhZG1lID0gTWFya2Rvd25FbmdpbmUucmVhZE5laWdoYm91clJlYWRtZUZpbGUoaW50ZXJmLmZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJmLnJlYWRtZSA9IG1hcmtlZChyZWFkbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogJ2ludGVyZmFjZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogaW50ZXJmLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogaW50ZXJmLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmF2VGFiczogdGhpcy5nZXROYXZUYWJzKGludGVyZiksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAnaW50ZXJmYWNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVyZmFjZTogaW50ZXJmLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5JTlRFUk5BTFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJmLmlzRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlLm5hbWUgKz0gJy0nICsgaW50ZXJmLmR1cGxpY2F0ZUlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZShwYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICBsb29wKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsb29wKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcmVwYXJlTWlzY2VsbGFuZW91cyhzb21lTWlzYz8pIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1ByZXBhcmUgbWlzY2VsbGFuZW91cycpO1xuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm1pc2NlbGxhbmVvdXMgPSBzb21lTWlzY1xuICAgICAgICAgICAgPyBzb21lTWlzY1xuICAgICAgICAgICAgOiBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0TWlzY2VsbGFuZW91cygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5taXNjZWxsYW5lb3VzLmZ1bmN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hZGRQYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogJ21pc2NlbGxhbmVvdXMnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZnVuY3Rpb25zJyxcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdtaXNjZWxsYW5lb3VzLWZ1bmN0aW9ucycsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6ICdtaXNjZWxsYW5lb3VzLWZ1bmN0aW9ucycsXG4gICAgICAgICAgICAgICAgICAgIGRlcHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5JTlRFUk5BTFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubWlzY2VsbGFuZW91cy52YXJpYWJsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZSh7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6ICdtaXNjZWxsYW5lb3VzJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3ZhcmlhYmxlcycsXG4gICAgICAgICAgICAgICAgICAgIGlkOiAnbWlzY2VsbGFuZW91cy12YXJpYWJsZXMnLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAnbWlzY2VsbGFuZW91cy12YXJpYWJsZXMnLFxuICAgICAgICAgICAgICAgICAgICBkZXB0aDogMSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuSU5URVJOQUxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLm1pc2NlbGxhbmVvdXMudHlwZWFsaWFzZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZSh7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6ICdtaXNjZWxsYW5lb3VzJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3R5cGVhbGlhc2VzJyxcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdtaXNjZWxsYW5lb3VzLXR5cGVhbGlhc2VzJyxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDogJ21pc2NlbGxhbmVvdXMtdHlwZWFsaWFzZXMnLFxuICAgICAgICAgICAgICAgICAgICBkZXB0aDogMSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuSU5URVJOQUxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLm1pc2NlbGxhbmVvdXMuZW51bWVyYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiAnbWlzY2VsbGFuZW91cycsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdlbnVtZXJhdGlvbnMnLFxuICAgICAgICAgICAgICAgICAgICBpZDogJ21pc2NlbGxhbmVvdXMtZW51bWVyYXRpb25zJyxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDogJ21pc2NlbGxhbmVvdXMtZW51bWVyYXRpb25zJyxcbiAgICAgICAgICAgICAgICAgICAgZGVwdGg6IDEsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VUeXBlOiBDT01QT0RPQ19ERUZBVUxUUy5QQUdFX1RZUEVTLklOVEVSTkFMXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVUZW1wbGF0ZXVybChjb21wb25lbnQpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsZXQgZGlybmFtZSA9IHBhdGguZGlybmFtZShjb21wb25lbnQuZmlsZSk7XG4gICAgICAgIGxldCB0ZW1wbGF0ZVBhdGggPSBwYXRoLnJlc29sdmUoZGlybmFtZSArIHBhdGguc2VwICsgY29tcG9uZW50LnRlbXBsYXRlVXJsKTtcblxuICAgICAgICBpZiAoIUZpbGVFbmdpbmUuZXhpc3RzU3luYyh0ZW1wbGF0ZVBhdGgpKSB7XG4gICAgICAgICAgICBsZXQgZXJyID0gYENhbm5vdCByZWFkIHRlbXBsYXRlIGZvciAke2NvbXBvbmVudC5uYW1lfWA7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7fSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gRmlsZUVuZ2luZS5nZXQodGVtcGxhdGVQYXRoKS50aGVuKFxuICAgICAgICAgICAgZGF0YSA9PiAoY29tcG9uZW50LnRlbXBsYXRlRGF0YSA9IGRhdGEpLFxuICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlU3R5bGVzKGNvbXBvbmVudCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxldCBzdHlsZXMgPSBjb21wb25lbnQuc3R5bGVzO1xuICAgICAgICBjb21wb25lbnQuc3R5bGVzRGF0YSA9ICcnO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmVTdHlsZXMsIHJlamVjdFN0eWxlcykgPT4ge1xuICAgICAgICAgICAgc3R5bGVzLmZvckVhY2goc3R5bGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdHlsZXNEYXRhID0gY29tcG9uZW50LnN0eWxlc0RhdGEgKyBzdHlsZSArICdcXG4nO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXNvbHZlU3R5bGVzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlU3R5bGV1cmxzKGNvbXBvbmVudCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxldCBkaXJuYW1lID0gcGF0aC5kaXJuYW1lKGNvbXBvbmVudC5maWxlKTtcblxuICAgICAgICBsZXQgc3R5bGVEYXRhUHJvbWlzZSA9IGNvbXBvbmVudC5zdHlsZVVybHMubWFwKHN0eWxlVXJsID0+IHtcbiAgICAgICAgICAgIGxldCBzdHlsZVBhdGggPSBwYXRoLnJlc29sdmUoZGlybmFtZSArIHBhdGguc2VwICsgc3R5bGVVcmwpO1xuXG4gICAgICAgICAgICBpZiAoIUZpbGVFbmdpbmUuZXhpc3RzU3luYyhzdHlsZVBhdGgpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVyciA9IGBDYW5ub3QgcmVhZCBzdHlsZSB1cmwgJHtzdHlsZVBhdGh9IGZvciAke2NvbXBvbmVudC5uYW1lfWA7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHt9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBGaWxlRW5naW5lLmdldChzdHlsZVBhdGgpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlVXJsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChzdHlsZURhdGFQcm9taXNlKS50aGVuKFxuICAgICAgICAgICAgZGF0YSA9PiAoY29tcG9uZW50LnN0eWxlVXJsc0RhdGEgPSBkYXRhKSxcbiAgICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE5hdlRhYnMoZGVwZW5kZW5jeSk6IEFycmF5PGFueT4ge1xuICAgICAgICBsZXQgbmF2VGFiQ29uZmlnID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5uYXZUYWJDb25maWc7XG4gICAgICAgIG5hdlRhYkNvbmZpZyA9XG4gICAgICAgICAgICBuYXZUYWJDb25maWcubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgICAgPyBfLmNsb25lRGVlcChDT01QT0RPQ19DT05TVEFOVFMubmF2VGFiRGVmaW5pdGlvbnMpXG4gICAgICAgICAgICAgICAgOiBuYXZUYWJDb25maWc7XG4gICAgICAgIGxldCBtYXRjaERlcFR5cGUgPSAoZGVwVHlwZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGVwVHlwZSA9PT0gJ2FsbCcgfHwgZGVwVHlwZSA9PT0gZGVwZW5kZW5jeS50eXBlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBuYXZUYWJzID0gW107XG4gICAgICAgIF8uZm9yRWFjaChuYXZUYWJDb25maWcsIGN1c3RvbVRhYiA9PiB7XG4gICAgICAgICAgICBsZXQgbmF2VGFiID0gXy5maW5kKENPTVBPRE9DX0NPTlNUQU5UUy5uYXZUYWJEZWZpbml0aW9ucywgeyBpZDogY3VzdG9tVGFiLmlkIH0pO1xuICAgICAgICAgICAgaWYgKCFuYXZUYWIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdGFiIElEICcke2N1c3RvbVRhYi5pZH0nIHNwZWNpZmllZCBpbiB0YWIgY29uZmlndXJhdGlvbmApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuYXZUYWIubGFiZWwgPSBjdXN0b21UYWIubGFiZWw7XG5cbiAgICAgICAgICAgIC8vIGlzIHRhYiBhcHBsaWNhYmxlIHRvIHRhcmdldCBkZXBlbmRlbmN5P1xuICAgICAgICAgICAgaWYgKC0xID09PSBfLmZpbmRJbmRleChuYXZUYWIuZGVwVHlwZXMsIG1hdGNoRGVwVHlwZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGdsb2JhbCBjb25maWdcbiAgICAgICAgICAgIGlmIChjdXN0b21UYWIuaWQgPT09ICd0cmVlJyAmJiBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVEb21UcmVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGN1c3RvbVRhYi5pZCA9PT0gJ3NvdXJjZScgJiYgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlU291cmNlQ29kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdXN0b21UYWIuaWQgPT09ICd0ZW1wbGF0ZURhdGEnICYmIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVRlbXBsYXRlVGFiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGN1c3RvbVRhYi5pZCA9PT0gJ3N0eWxlRGF0YScgJiYgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlU3R5bGVUYWIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHBlciBkZXBlbmRlbmN5IGNvbmZpZ1xuICAgICAgICAgICAgaWYgKGN1c3RvbVRhYi5pZCA9PT0gJ3JlYWRtZScgJiYgIWRlcGVuZGVuY3kucmVhZG1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGN1c3RvbVRhYi5pZCA9PT0gJ2V4YW1wbGUnICYmICFkZXBlbmRlbmN5LmV4YW1wbGVVcmxzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGN1c3RvbVRhYi5pZCA9PT0gJ3RlbXBsYXRlRGF0YScgJiZcbiAgICAgICAgICAgICAgICAoIWRlcGVuZGVuY3kudGVtcGxhdGVVcmwgfHwgZGVwZW5kZW5jeS50ZW1wbGF0ZVVybC5sZW5ndGggPT09IDApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgY3VzdG9tVGFiLmlkID09PSAnc3R5bGVEYXRhJyAmJlxuICAgICAgICAgICAgICAgICgoIWRlcGVuZGVuY3kuc3R5bGVVcmxzIHx8IGRlcGVuZGVuY3kuc3R5bGVVcmxzLmxlbmd0aCA9PT0gMCkgJiZcbiAgICAgICAgICAgICAgICAgICAgKCFkZXBlbmRlbmN5LnN0eWxlcyB8fCBkZXBlbmRlbmN5LnN0eWxlcy5sZW5ndGggPT09IDApKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuYXZUYWJzLnB1c2gobmF2VGFiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG5hdlRhYnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHZhbGlkIG5hdmlnYXRpb24gdGFicyBoYXZlIGJlZW4gZGVmaW5lZCBmb3IgZGVwZW5kZW5jeSB0eXBlICcke1xuICAgICAgICAgICAgICAgIGRlcGVuZGVuY3kudHlwZVxuICAgICAgICAgICAgfScuIFNwZWNpZnkgXFxcbmF0IGxlYXN0IG9uZSBjb25maWcgZm9yIHRoZSAnaW5mbycgb3IgJ3NvdXJjZScgdGFiIGluIC0tbmF2VGFiQ29uZmlnLmApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5hdlRhYnM7XG4gICAgfVxuXG4gICAgcHVibGljIHByZXBhcmVDb250cm9sbGVycyhzb21lQ29udHJvbGxlcnM/KSB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcmVwYXJlIGNvbnRyb2xsZXJzJyk7XG4gICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY29udHJvbGxlcnMgPSBzb21lQ29udHJvbGxlcnNcbiAgICAgICAgICAgID8gc29tZUNvbnRyb2xsZXJzXG4gICAgICAgICAgICA6IERlcGVuZGVuY2llc0VuZ2luZS5nZXRDb250cm9sbGVycygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb250cm9sbGVycy5sZW5ndGg7XG4gICAgICAgICAgICBsZXQgbG9vcCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29udHJvbGxlciA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY29udHJvbGxlcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogJ2NvbnRyb2xsZXJzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvbnRyb2xsZXIubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBjb250cm9sbGVyLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmF2VGFiczogdGhpcy5nZXROYXZUYWJzKGNvbnRyb2xsZXIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogJ2NvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuSU5URVJOQUxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXIuaXNEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UubmFtZSArPSAnLScgKyBjb250cm9sbGVyLmR1cGxpY2F0ZUlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZShwYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICBsb29wKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsb29wKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcmVwYXJlQ29tcG9uZW50cyhzb21lQ29tcG9uZW50cz8pIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1ByZXBhcmUgY29tcG9uZW50cycpO1xuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvbXBvbmVudHMgPSBzb21lQ29tcG9uZW50c1xuICAgICAgICAgICAgPyBzb21lQ29tcG9uZW50c1xuICAgICAgICAgICAgOiBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0Q29tcG9uZW50cygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgobWFpblByZXBhcmVDb21wb25lbnRSZXNvbHZlLCBtYWluUHJlcGFyZUNvbXBvbmVudFJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgbGV0IGxlbiA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY29tcG9uZW50cy5sZW5ndGg7XG4gICAgICAgICAgICBsZXQgbG9vcCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaSA8PSBsZW4gLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnQgPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvbXBvbmVudHNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXJrZG93bkVuZ2luZS5oYXNOZWlnaGJvdXJSZWFkbWVGaWxlKGNvbXBvbmVudC5maWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAke2NvbXBvbmVudC5uYW1lfSBoYXMgYSBSRUFETUUgZmlsZSwgaW5jbHVkZSBpdGApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlYWRtZUZpbGUgPSBNYXJrZG93bkVuZ2luZS5yZWFkTmVpZ2hib3VyUmVhZG1lRmlsZShjb21wb25lbnQuZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQucmVhZG1lID0gbWFya2VkKHJlYWRtZUZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogJ2NvbXBvbmVudHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogY29tcG9uZW50Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogY29tcG9uZW50LmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmF2VGFiczogdGhpcy5nZXROYXZUYWJzKGNvbXBvbmVudCksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAnY29tcG9uZW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudDogY29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5JTlRFUk5BTFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuaXNEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UubmFtZSArPSAnLScgKyBjb21wb25lbnQuZHVwbGljYXRlSWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hZGRQYWdlKHBhZ2UpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudFRlbXBsYXRlVXJsUHJvbWlzZSA9IG5ldyBQcm9taXNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGNvbXBvbmVudFRlbXBsYXRlVXJsUmVzb2x2ZSwgY29tcG9uZW50VGVtcGxhdGVVcmxSZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LnRlbXBsYXRlVXJsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAke2NvbXBvbmVudC5uYW1lfSBoYXMgYSB0ZW1wbGF0ZVVybCwgaW5jbHVkZSBpdGApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVRlbXBsYXRldXJsKGNvbXBvbmVudCkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRUZW1wbGF0ZVVybFJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50VGVtcGxhdGVVcmxSZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRUZW1wbGF0ZVVybFJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudFN0eWxlVXJsc1Byb21pc2UgPSBuZXcgUHJvbWlzZShcbiAgICAgICAgICAgICAgICAgICAgICAgIChjb21wb25lbnRTdHlsZVVybHNSZXNvbHZlLCBjb21wb25lbnRTdHlsZVVybHNSZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LnN0eWxlVXJscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgJHtjb21wb25lbnQubmFtZX0gaGFzIHN0eWxlVXJscywgaW5jbHVkZSB0aGVtYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU3R5bGV1cmxzKGNvbXBvbmVudCkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRTdHlsZVVybHNSZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFN0eWxlVXJsc1JlamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFN0eWxlVXJsc1Jlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudFN0eWxlc1Byb21pc2UgPSBuZXcgUHJvbWlzZShcbiAgICAgICAgICAgICAgICAgICAgICAgIChjb21wb25lbnRTdHlsZXNSZXNvbHZlLCBjb21wb25lbnRTdHlsZXNSZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LnN0eWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgJHtjb21wb25lbnQubmFtZX0gaGFzIHN0eWxlcywgaW5jbHVkZSB0aGVtYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU3R5bGVzKGNvbXBvbmVudCkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRTdHlsZXNSZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFN0eWxlc1JlamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFN0eWxlc1Jlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50VGVtcGxhdGVVcmxQcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50U3R5bGVVcmxzUHJvbWlzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFN0eWxlc1Byb21pc2VcbiAgICAgICAgICAgICAgICAgICAgXSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb29wKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1haW5QcmVwYXJlQ29tcG9uZW50UmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsb29wKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcmVwYXJlRGlyZWN0aXZlcyhzb21lRGlyZWN0aXZlcz8pIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1ByZXBhcmUgZGlyZWN0aXZlcycpO1xuXG4gICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlyZWN0aXZlcyA9IHNvbWVEaXJlY3RpdmVzXG4gICAgICAgICAgICA/IHNvbWVEaXJlY3RpdmVzXG4gICAgICAgICAgICA6IERlcGVuZGVuY2llc0VuZ2luZS5nZXREaXJlY3RpdmVzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGxldCBsZW4gPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpcmVjdGl2ZXMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGxvb3AgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRpcmVjdGl2ZSA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlyZWN0aXZlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hcmtkb3duRW5naW5lLmhhc05laWdoYm91clJlYWRtZUZpbGUoZGlyZWN0aXZlLmZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgICR7ZGlyZWN0aXZlLm5hbWV9IGhhcyBhIFJFQURNRSBmaWxlLCBpbmNsdWRlIGl0YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVhZG1lID0gTWFya2Rvd25FbmdpbmUucmVhZE5laWdoYm91clJlYWRtZUZpbGUoZGlyZWN0aXZlLmZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlLnJlYWRtZSA9IG1hcmtlZChyZWFkbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogJ2RpcmVjdGl2ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGlyZWN0aXZlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogZGlyZWN0aXZlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmF2VGFiczogdGhpcy5nZXROYXZUYWJzKGRpcmVjdGl2ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiAnZGlyZWN0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZTogZGlyZWN0aXZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5JTlRFUk5BTFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aXZlLmlzRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlLm5hbWUgKz0gJy0nICsgZGlyZWN0aXZlLmR1cGxpY2F0ZUlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZShwYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICBsb29wKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsb29wKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcmVwYXJlSW5qZWN0YWJsZXMoc29tZUluamVjdGFibGVzPyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJlcGFyZSBpbmplY3RhYmxlcycpO1xuXG4gICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW5qZWN0YWJsZXMgPSBzb21lSW5qZWN0YWJsZXNcbiAgICAgICAgICAgID8gc29tZUluamVjdGFibGVzXG4gICAgICAgICAgICA6IERlcGVuZGVuY2llc0VuZ2luZS5nZXRJbmplY3RhYmxlcygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbmplY3RhYmxlcy5sZW5ndGg7XG4gICAgICAgICAgICBsZXQgbG9vcCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5qZWMgPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmluamVjdGFibGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWFya2Rvd25FbmdpbmUuaGFzTmVpZ2hib3VyUmVhZG1lRmlsZShpbmplYy5maWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCAke2luamVjLm5hbWV9IGhhcyBhIFJFQURNRSBmaWxlLCBpbmNsdWRlIGl0YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVhZG1lID0gTWFya2Rvd25FbmdpbmUucmVhZE5laWdoYm91clJlYWRtZUZpbGUoaW5qZWMuZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmplYy5yZWFkbWUgPSBtYXJrZWQocmVhZG1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6ICdpbmplY3RhYmxlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBpbmplYy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGluamVjLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmF2VGFiczogdGhpcy5nZXROYXZUYWJzKGluamVjKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6ICdpbmplY3RhYmxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGFibGU6IGluamVjLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5JTlRFUk5BTFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5qZWMuaXNEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UubmFtZSArPSAnLScgKyBpbmplYy5kdXBsaWNhdGVJZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2UocGFnZSk7XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJlcGFyZUludGVyY2VwdG9ycyhzb21lSW50ZXJjZXB0b3JzPyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJlcGFyZSBpbnRlcmNlcHRvcnMnKTtcblxuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmludGVyY2VwdG9ycyA9IHNvbWVJbnRlcmNlcHRvcnNcbiAgICAgICAgICAgID8gc29tZUludGVyY2VwdG9yc1xuICAgICAgICAgICAgOiBEZXBlbmRlbmNpZXNFbmdpbmUuZ2V0SW50ZXJjZXB0b3JzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGxldCBsZW4gPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmludGVyY2VwdG9ycy5sZW5ndGg7XG4gICAgICAgICAgICBsZXQgbG9vcCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW50ZXJjZXB0b3IgPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmludGVyY2VwdG9yc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hcmtkb3duRW5naW5lLmhhc05laWdoYm91clJlYWRtZUZpbGUoaW50ZXJjZXB0b3IuZmlsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAgJHtpbnRlcmNlcHRvci5uYW1lfSBoYXMgYSBSRUFETUUgZmlsZSwgaW5jbHVkZSBpdGApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlYWRtZSA9IE1hcmtkb3duRW5naW5lLnJlYWROZWlnaGJvdXJSZWFkbWVGaWxlKGludGVyY2VwdG9yLmZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJjZXB0b3IucmVhZG1lID0gbWFya2VkKHJlYWRtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhZ2UgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiAnaW50ZXJjZXB0b3JzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGludGVyY2VwdG9yLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogaW50ZXJjZXB0b3IuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYXZUYWJzOiB0aGlzLmdldE5hdlRhYnMoaW50ZXJjZXB0b3IpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogJ2ludGVyY2VwdG9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGFibGU6IGludGVyY2VwdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5JTlRFUk5BTFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJjZXB0b3IuaXNEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UubmFtZSArPSAnLScgKyBpbnRlcmNlcHRvci5kdXBsaWNhdGVJZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFkZFBhZ2UocGFnZSk7XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJlcGFyZUd1YXJkcyhzb21lR3VhcmRzPyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJlcGFyZSBndWFyZHMnKTtcblxuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmd1YXJkcyA9IHNvbWVHdWFyZHMgPyBzb21lR3VhcmRzIDogRGVwZW5kZW5jaWVzRW5naW5lLmdldEd1YXJkcygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5ndWFyZHMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGxvb3AgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGd1YXJkID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5ndWFyZHNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXJrZG93bkVuZ2luZS5oYXNOZWlnaGJvdXJSZWFkbWVGaWxlKGd1YXJkLmZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgICR7Z3VhcmQubmFtZX0gaGFzIGEgUkVBRE1FIGZpbGUsIGluY2x1ZGUgaXRgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZWFkbWUgPSBNYXJrZG93bkVuZ2luZS5yZWFkTmVpZ2hib3VyUmVhZG1lRmlsZShndWFyZC5maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGd1YXJkLnJlYWRtZSA9IG1hcmtlZChyZWFkbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogJ2d1YXJkcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBndWFyZC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGd1YXJkLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmF2VGFiczogdGhpcy5nZXROYXZUYWJzKGd1YXJkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6ICdndWFyZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmplY3RhYmxlOiBndWFyZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuSU5URVJOQUxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGd1YXJkLmlzRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlLm5hbWUgKz0gJy0nICsgZ3VhcmQuZHVwbGljYXRlSWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hZGRQYWdlKHBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHByZXBhcmVSb3V0ZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcm9jZXNzIHJvdXRlcycpO1xuICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnJvdXRlcyA9IERlcGVuZGVuY2llc0VuZ2luZS5nZXRSb3V0ZXMoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hZGRQYWdlKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAncm91dGVzJyxcbiAgICAgICAgICAgICAgICBpZDogJ3JvdXRlcycsXG4gICAgICAgICAgICAgICAgY29udGV4dDogJ3JvdXRlcycsXG4gICAgICAgICAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuUk9PVFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmV4cG9ydEZvcm1hdCA9PT0gQ09NUE9ET0NfREVGQVVMVFMuZXhwb3J0Rm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgUm91dGVyUGFyc2VyVXRpbC5nZW5lcmF0ZVJvdXRlc0luZGV4KFxuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dCxcbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5yb3V0ZXNcbiAgICAgICAgICAgICAgICApLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCcgUm91dGVzIGluZGV4IGdlbmVyYXRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJlcGFyZUNvdmVyYWdlKCkge1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJvY2VzcyBkb2N1bWVudGF0aW9uIGNvdmVyYWdlIHJlcG9ydCcpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogbG9vcCB3aXRoIGNvbXBvbmVudHMsIGRpcmVjdGl2ZXMsIGNvbnRyb2xsZXJzLCBjbGFzc2VzLCBpbmplY3RhYmxlcywgaW50ZXJmYWNlcywgcGlwZXMsIGd1YXJkcywgbWlzYyBmdW5jdGlvbnMgdmFyaWFibGVzXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBmaWxlcyA9IFtdO1xuICAgICAgICAgICAgbGV0IHRvdGFsUHJvamVjdFN0YXRlbWVudERvY3VtZW50ZWQgPSAwO1xuICAgICAgICAgICAgbGV0IGdldFN0YXR1cyA9IGZ1bmN0aW9uKHBlcmNlbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhdHVzO1xuICAgICAgICAgICAgICAgIGlmIChwZXJjZW50IDw9IDI1KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cyA9ICdsb3cnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGVyY2VudCA+IDI1ICYmIHBlcmNlbnQgPD0gNTApIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzID0gJ21lZGl1bSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwZXJjZW50ID4gNTAgJiYgcGVyY2VudCA8PSA3NSkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMgPSAnZ29vZCc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzID0gJ3ZlcnktZ29vZCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IHByb2Nlc3NDb21wb25lbnRzQW5kRGlyZWN0aXZlc0FuZENvbnRyb2xsZXJzID0gbGlzdCA9PiB7XG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKGxpc3QsIChlbDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gKE9iamVjdCBhcyBhbnkpLmFzc2lnbih7fSwgZWwpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnQucHJvcGVydGllc0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnByb3BlcnRpZXNDbGFzcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudC5tZXRob2RzQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQubWV0aG9kc0NsYXNzID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50Lmhvc3RCaW5kaW5ncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5ob3N0QmluZGluZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnQuaG9zdExpc3RlbmVycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5ob3N0TGlzdGVuZXJzID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50LmlucHV0c0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmlucHV0c0NsYXNzID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50Lm91dHB1dHNDbGFzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vdXRwdXRzQ2xhc3MgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgY2w6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoOiBlbGVtZW50LmZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBlbGVtZW50LnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rdHlwZTogZWxlbWVudC50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZWxlbWVudC5uYW1lXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGxldCB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdG90YWxTdGF0ZW1lbnRzID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucHJvcGVydGllc0NsYXNzLmxlbmd0aCArXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm1ldGhvZHNDbGFzcy5sZW5ndGggK1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5pbnB1dHNDbGFzcy5sZW5ndGggK1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5ob3N0QmluZGluZ3MubGVuZ3RoICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaG9zdExpc3RlbmVycy5sZW5ndGggK1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vdXRwdXRzQ2xhc3MubGVuZ3RoICtcbiAgICAgICAgICAgICAgICAgICAgICAgIDE7IC8vICsxIGZvciBlbGVtZW50IGRlY29yYXRvciBjb21tZW50XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuY29uc3RydWN0b3JPYmopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50cyArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY29uc3RydWN0b3JPYmogJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNvbnN0cnVjdG9yT2JqLmRlc2NyaXB0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jb25zdHJ1Y3Rvck9iai5kZXNjcmlwdGlvbiAhPT0gJydcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmRlc2NyaXB0aW9uICYmIGVsZW1lbnQuZGVzY3JpcHRpb24gIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIF8uZm9yRWFjaChlbGVtZW50LnByb3BlcnRpZXNDbGFzcywgKHByb3BlcnR5OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5tb2RpZmllcktpbmQgPT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2Vzbid0IGhhbmRsZSBwcml2YXRlIGZvciBjb3ZlcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50cyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5LmRlc2NyaXB0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkuZGVzY3JpcHRpb24gIT09ICcnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkubW9kaWZpZXJLaW5kICE9PSBTeW50YXhLaW5kLlByaXZhdGVLZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIF8uZm9yRWFjaChlbGVtZW50Lm1ldGhvZHNDbGFzcywgKG1ldGhvZDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0aG9kLm1vZGlmaWVyS2luZCA9PT0gU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvZXNuJ3QgaGFuZGxlIHByaXZhdGUgZm9yIGNvdmVyYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTdGF0ZW1lbnRzIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmRlc2NyaXB0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmRlc2NyaXB0aW9uICE9PSAnJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5tb2RpZmllcktpbmQgIT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKGVsZW1lbnQuaG9zdEJpbmRpbmdzLCAocHJvcGVydHk6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5Lm1vZGlmaWVyS2luZCA9PT0gU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvZXNuJ3QgaGFuZGxlIHByaXZhdGUgZm9yIGNvdmVyYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTdGF0ZW1lbnRzIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkuZGVzY3JpcHRpb24gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eS5kZXNjcmlwdGlvbiAhPT0gJycgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eS5tb2RpZmllcktpbmQgIT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKGVsZW1lbnQuaG9zdExpc3RlbmVycywgKG1ldGhvZDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0aG9kLm1vZGlmaWVyS2luZCA9PT0gU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvZXNuJ3QgaGFuZGxlIHByaXZhdGUgZm9yIGNvdmVyYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTdGF0ZW1lbnRzIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmRlc2NyaXB0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmRlc2NyaXB0aW9uICE9PSAnJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5tb2RpZmllcktpbmQgIT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKGVsZW1lbnQuaW5wdXRzQ2xhc3MsIChpbnB1dDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQubW9kaWZpZXJLaW5kID09PSBTeW50YXhLaW5kLlByaXZhdGVLZXl3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9lc24ndCBoYW5kbGUgcHJpdmF0ZSBmb3IgY292ZXJhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudHMgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC5kZXNjcmlwdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LmRlc2NyaXB0aW9uICE9PSAnJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0Lm1vZGlmaWVyS2luZCAhPT0gU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTdGF0ZW1lbnREb2N1bWVudGVkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBfLmZvckVhY2goZWxlbWVudC5vdXRwdXRzQ2xhc3MsIChvdXRwdXQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG91dHB1dC5tb2RpZmllcktpbmQgPT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb2Vzbid0IGhhbmRsZSBwcml2YXRlIGZvciBjb3ZlcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50cyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5kZXNjcmlwdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5kZXNjcmlwdGlvbiAhPT0gJycgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQubW9kaWZpZXJLaW5kICE9PSBTeW50YXhLaW5kLlByaXZhdGVLZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2wuY292ZXJhZ2VQZXJjZW50ID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAgICAgICAgICh0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgLyB0b3RhbFN0YXRlbWVudHMpICogMTAwXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3RhbFN0YXRlbWVudHMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsLmNvdmVyYWdlUGVyY2VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2wuY292ZXJhZ2VDb3VudCA9IHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCArICcvJyArIHRvdGFsU3RhdGVtZW50cztcbiAgICAgICAgICAgICAgICAgICAgY2wuc3RhdHVzID0gZ2V0U3RhdHVzKGNsLmNvdmVyYWdlUGVyY2VudCk7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUHJvamVjdFN0YXRlbWVudERvY3VtZW50ZWQgKz0gY2wuY292ZXJhZ2VQZXJjZW50O1xuICAgICAgICAgICAgICAgICAgICBmaWxlcy5wdXNoKGNsKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsZXQgcHJvY2Vzc0NvdmVyYWdlUGVyRmlsZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvY2VzcyBkb2N1bWVudGF0aW9uIGNvdmVyYWdlIHBlciBmaWxlJyk7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcblxuICAgICAgICAgICAgICAgIGxldCBvdmVyRmlsZXMgPSBmaWxlcy5maWx0ZXIoZiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvdmVyVGVzdCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBmLmNvdmVyYWdlUGVyY2VudCA+PSBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlTWluaW11bVBlckZpbGU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdmVyVGVzdCAmJiAhQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RTaG93T25seUZhaWxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7Zi5jb3ZlcmFnZVBlcmNlbnR9ICUgZm9yIGZpbGUgJHtmLmZpbGVQYXRofSAtICR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLSBvdmVyIG1pbmltdW0gcGVyIGZpbGVgXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvdmVyVGVzdDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBsZXQgdW5kZXJGaWxlcyA9IGZpbGVzLmZpbHRlcihmID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVuZGVyVGVzdCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBmLmNvdmVyYWdlUGVyY2VudCA8IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VNaW5pbXVtUGVyRmlsZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVuZGVyVGVzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke2YuY292ZXJhZ2VQZXJjZW50fSAlIGZvciBmaWxlICR7Zi5maWxlUGF0aH0gLSAke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC0gdW5kZXIgbWluaW11bSBwZXIgZmlsZWBcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVyVGVzdDtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCctLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb3ZlckZpbGVzOiBvdmVyRmlsZXMsXG4gICAgICAgICAgICAgICAgICAgIHVuZGVyRmlsZXM6IHVuZGVyRmlsZXNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxldCBwcm9jZXNzRnVuY3Rpb25zQW5kVmFyaWFibGVzID0gKGlkLCB0eXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKGlkLCAoZWw6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2w6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoOiBlbC5maWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmt0eXBlOiBlbC50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGlua3N1YnR5cGU6IGVsLnN1YnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBlbC5uYW1lXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAndmFyaWFibGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbC5saW5rdHlwZSA9ICdtaXNjZWxsYW5lb3VzJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgdG90YWxTdGF0ZW1lbnREb2N1bWVudGVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvdGFsU3RhdGVtZW50cyA9IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsLm1vZGlmaWVyS2luZCA9PT0gU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9lc24ndCBoYW5kbGUgcHJpdmF0ZSBmb3IgY292ZXJhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50cyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLmRlc2NyaXB0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5kZXNjcmlwdGlvbiAhPT0gJycgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLm1vZGlmaWVyS2luZCAhPT0gU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZFxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY2wuY292ZXJhZ2VQZXJjZW50ID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAgICAgICAgICh0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgLyB0b3RhbFN0YXRlbWVudHMpICogMTAwXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGNsLmNvdmVyYWdlQ291bnQgPSB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgKyAnLycgKyB0b3RhbFN0YXRlbWVudHM7XG4gICAgICAgICAgICAgICAgICAgIGNsLnN0YXR1cyA9IGdldFN0YXR1cyhjbC5jb3ZlcmFnZVBlcmNlbnQpO1xuICAgICAgICAgICAgICAgICAgICB0b3RhbFByb2plY3RTdGF0ZW1lbnREb2N1bWVudGVkICs9IGNsLmNvdmVyYWdlUGVyY2VudDtcbiAgICAgICAgICAgICAgICAgICAgZmlsZXMucHVzaChjbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgcHJvY2Vzc0NsYXNzZXMgPSAobGlzdCwgdHlwZSwgbGlua3R5cGUpID0+IHtcbiAgICAgICAgICAgICAgICBfLmZvckVhY2gobGlzdCwgKGNsOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSAoT2JqZWN0IGFzIGFueSkuYXNzaWduKHt9LCBjbCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudC5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnByb3BlcnRpZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnQubWV0aG9kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5tZXRob2RzID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsYTogYW55ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVBhdGg6IGVsZW1lbnQuZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rdHlwZTogbGlua3R5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBlbGVtZW50Lm5hbWVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0b3RhbFN0YXRlbWVudHMgPSBlbGVtZW50LnByb3BlcnRpZXMubGVuZ3RoICsgZWxlbWVudC5tZXRob2RzLmxlbmd0aCArIDE7IC8vICsxIGZvciBlbGVtZW50IGl0c2VsZlxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmNvbnN0cnVjdG9yT2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudHMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNvbnN0cnVjdG9yT2JqICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jb25zdHJ1Y3Rvck9iai5kZXNjcmlwdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY29uc3RydWN0b3JPYmouZGVzY3JpcHRpb24gIT09ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5kZXNjcmlwdGlvbiAmJiBlbGVtZW50LmRlc2NyaXB0aW9uICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTdGF0ZW1lbnREb2N1bWVudGVkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBfLmZvckVhY2goZWxlbWVudC5wcm9wZXJ0aWVzLCAocHJvcGVydHk6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5Lm1vZGlmaWVyS2luZCA9PT0gU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvZXNuJ3QgaGFuZGxlIHByaXZhdGUgZm9yIGNvdmVyYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTdGF0ZW1lbnRzIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkuZGVzY3JpcHRpb24gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eS5kZXNjcmlwdGlvbiAhPT0gJycgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eS5tb2RpZmllcktpbmQgIT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKGVsZW1lbnQubWV0aG9kcywgKG1ldGhvZDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWV0aG9kLm1vZGlmaWVyS2luZCA9PT0gU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvZXNuJ3QgaGFuZGxlIHByaXZhdGUgZm9yIGNvdmVyYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTdGF0ZW1lbnRzIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmRlc2NyaXB0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmRlc2NyaXB0aW9uICE9PSAnJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5tb2RpZmllcktpbmQgIT09IFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjbGEuY292ZXJhZ2VQZXJjZW50ID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAgICAgICAgICh0b3RhbFN0YXRlbWVudERvY3VtZW50ZWQgLyB0b3RhbFN0YXRlbWVudHMpICogMTAwXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3RhbFN0YXRlbWVudHMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYS5jb3ZlcmFnZVBlcmNlbnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNsYS5jb3ZlcmFnZUNvdW50ID0gdG90YWxTdGF0ZW1lbnREb2N1bWVudGVkICsgJy8nICsgdG90YWxTdGF0ZW1lbnRzO1xuICAgICAgICAgICAgICAgICAgICBjbGEuc3RhdHVzID0gZ2V0U3RhdHVzKGNsYS5jb3ZlcmFnZVBlcmNlbnQpO1xuICAgICAgICAgICAgICAgICAgICB0b3RhbFByb2plY3RTdGF0ZW1lbnREb2N1bWVudGVkICs9IGNsYS5jb3ZlcmFnZVBlcmNlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVzLnB1c2goY2xhKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHByb2Nlc3NDb21wb25lbnRzQW5kRGlyZWN0aXZlc0FuZENvbnRyb2xsZXJzKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY29tcG9uZW50cyk7XG4gICAgICAgICAgICBwcm9jZXNzQ29tcG9uZW50c0FuZERpcmVjdGl2ZXNBbmRDb250cm9sbGVycyhDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpcmVjdGl2ZXMpO1xuICAgICAgICAgICAgcHJvY2Vzc0NvbXBvbmVudHNBbmREaXJlY3RpdmVzQW5kQ29udHJvbGxlcnMoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb250cm9sbGVycyk7XG5cbiAgICAgICAgICAgIHByb2Nlc3NDbGFzc2VzKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY2xhc3NlcywgJ2NsYXNzJywgJ2NsYXNzZScpO1xuICAgICAgICAgICAgcHJvY2Vzc0NsYXNzZXMoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbmplY3RhYmxlcywgJ2luamVjdGFibGUnLCAnaW5qZWN0YWJsZScpO1xuICAgICAgICAgICAgcHJvY2Vzc0NsYXNzZXMoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbnRlcmZhY2VzLCAnaW50ZXJmYWNlJywgJ2ludGVyZmFjZScpO1xuICAgICAgICAgICAgcHJvY2Vzc0NsYXNzZXMoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5ndWFyZHMsICdndWFyZCcsICdndWFyZCcpO1xuICAgICAgICAgICAgcHJvY2Vzc0NsYXNzZXMoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbnRlcmNlcHRvcnMsICdpbnRlcmNlcHRvcicsICdpbnRlcmNlcHRvcicpO1xuXG4gICAgICAgICAgICBfLmZvckVhY2goQ29uZmlndXJhdGlvbi5tYWluRGF0YS5waXBlcywgKHBpcGU6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjbDogYW55ID0ge1xuICAgICAgICAgICAgICAgICAgICBmaWxlUGF0aDogcGlwZS5maWxlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBwaXBlLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGxpbmt0eXBlOiBwaXBlLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHBpcGUubmFtZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbGV0IHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCA9IDA7XG4gICAgICAgICAgICAgICAgbGV0IHRvdGFsU3RhdGVtZW50cyA9IDE7XG4gICAgICAgICAgICAgICAgaWYgKHBpcGUuZGVzY3JpcHRpb24gJiYgcGlwZS5kZXNjcmlwdGlvbiAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxTdGF0ZW1lbnREb2N1bWVudGVkICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY2wuY292ZXJhZ2VQZXJjZW50ID0gTWF0aC5mbG9vcigodG90YWxTdGF0ZW1lbnREb2N1bWVudGVkIC8gdG90YWxTdGF0ZW1lbnRzKSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgY2wuY292ZXJhZ2VDb3VudCA9IHRvdGFsU3RhdGVtZW50RG9jdW1lbnRlZCArICcvJyArIHRvdGFsU3RhdGVtZW50cztcbiAgICAgICAgICAgICAgICBjbC5zdGF0dXMgPSBnZXRTdGF0dXMoY2wuY292ZXJhZ2VQZXJjZW50KTtcbiAgICAgICAgICAgICAgICB0b3RhbFByb2plY3RTdGF0ZW1lbnREb2N1bWVudGVkICs9IGNsLmNvdmVyYWdlUGVyY2VudDtcbiAgICAgICAgICAgICAgICBmaWxlcy5wdXNoKGNsKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9jZXNzRnVuY3Rpb25zQW5kVmFyaWFibGVzKFxuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubWlzY2VsbGFuZW91cy5mdW5jdGlvbnMsXG4gICAgICAgICAgICAgICAgJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHByb2Nlc3NGdW5jdGlvbnNBbmRWYXJpYWJsZXMoXG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5taXNjZWxsYW5lb3VzLnZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAndmFyaWFibGUnXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBmaWxlcyA9IF8uc29ydEJ5KGZpbGVzLCBbJ2ZpbGVQYXRoJ10pO1xuXG4gICAgICAgICAgICBsZXQgY292ZXJhZ2VEYXRhID0ge1xuICAgICAgICAgICAgICAgIGNvdW50OlxuICAgICAgICAgICAgICAgICAgICBmaWxlcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICA/IE1hdGguZmxvb3IodG90YWxQcm9qZWN0U3RhdGVtZW50RG9jdW1lbnRlZCAvIGZpbGVzLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIDogMCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICcnLFxuICAgICAgICAgICAgICAgIGZpbGVzXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY292ZXJhZ2VEYXRhLnN0YXR1cyA9IGdldFN0YXR1cyhjb3ZlcmFnZURhdGEuY291bnQpO1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hZGRQYWdlKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnY292ZXJhZ2UnLFxuICAgICAgICAgICAgICAgIGlkOiAnY292ZXJhZ2UnLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6ICdjb3ZlcmFnZScsXG4gICAgICAgICAgICAgICAgZmlsZXM6IGZpbGVzLFxuICAgICAgICAgICAgICAgIGRhdGE6IGNvdmVyYWdlRGF0YSxcbiAgICAgICAgICAgICAgICBkZXB0aDogMCxcbiAgICAgICAgICAgICAgICBwYWdlVHlwZTogQ09NUE9ET0NfREVGQVVMVFMuUEFHRV9UWVBFUy5ST09UXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvdmVyYWdlRGF0YS5maWxlcyA9IGZpbGVzO1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZURhdGEgPSBjb3ZlcmFnZURhdGE7XG4gICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5leHBvcnRGb3JtYXQgPT09IENPTVBPRE9DX0RFRkFVTFRTLmV4cG9ydEZvcm1hdCkge1xuICAgICAgICAgICAgICAgIEh0bWxFbmdpbmUuZ2VuZXJhdGVDb3ZlcmFnZUJhZGdlKFxuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dCxcbiAgICAgICAgICAgICAgICAgICAgJ2RvY3VtZW50YXRpb24nLFxuICAgICAgICAgICAgICAgICAgICBjb3ZlcmFnZURhdGFcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsZXMgPSBfLnNvcnRCeShmaWxlcywgWydjb3ZlcmFnZVBlcmNlbnQnXSk7XG5cbiAgICAgICAgICAgIGxldCBjb3ZlcmFnZVRlc3RQZXJGaWxlUmVzdWx0cztcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdCAmJlxuICAgICAgICAgICAgICAgICFDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFBlckZpbGVcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIEdsb2JhbCBjb3ZlcmFnZSB0ZXN0IGFuZCBub3QgcGVyIGZpbGVcbiAgICAgICAgICAgICAgICBpZiAoY292ZXJhZ2VEYXRhLmNvdW50ID49IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICAgICAgICAgICAgYERvY3VtZW50YXRpb24gY292ZXJhZ2UgKCR7Y292ZXJhZ2VEYXRhLmNvdW50fSUpIGlzIG92ZXIgdGhyZXNob2xkICgke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkXG4gICAgICAgICAgICAgICAgICAgICAgICB9JSlgXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRpb25Qcm9taXNlUmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSBgRG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSAoJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdmVyYWdlRGF0YS5jb3VudFxuICAgICAgICAgICAgICAgICAgICB9JSkgaXMgbm90IG92ZXIgdGhyZXNob2xkICgke0NvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkfSUpYDtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGlvblByb21pc2VSZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkRmFpbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4obWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICFDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdCAmJlxuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0UGVyRmlsZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY292ZXJhZ2VUZXN0UGVyRmlsZVJlc3VsdHMgPSBwcm9jZXNzQ292ZXJhZ2VQZXJGaWxlKCk7XG4gICAgICAgICAgICAgICAgLy8gUGVyIGZpbGUgY292ZXJhZ2UgdGVzdCBhbmQgbm90IGdsb2JhbFxuICAgICAgICAgICAgICAgIGlmIChjb3ZlcmFnZVRlc3RQZXJGaWxlUmVzdWx0cy51bmRlckZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSBgRG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSBwZXIgZmlsZSBpcyBub3Qgb3ZlciB0aHJlc2hvbGQgKCR7XG4gICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlTWluaW11bVBlckZpbGVcbiAgICAgICAgICAgICAgICAgICAgfSUpYDtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGlvblByb21pc2VSZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkRmFpbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4obWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGBEb2N1bWVudGF0aW9uIGNvdmVyYWdlIHBlciBmaWxlIGlzIG92ZXIgdGhyZXNob2xkICgke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VNaW5pbXVtUGVyRmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSUpYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0aW9uUHJvbWlzZVJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3QgJiZcbiAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFBlckZpbGVcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIFBlciBmaWxlIGNvdmVyYWdlIHRlc3QgYW5kIGdsb2JhbFxuICAgICAgICAgICAgICAgIGNvdmVyYWdlVGVzdFBlckZpbGVSZXN1bHRzID0gcHJvY2Vzc0NvdmVyYWdlUGVyRmlsZSgpO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgY292ZXJhZ2VEYXRhLmNvdW50ID49IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkICYmXG4gICAgICAgICAgICAgICAgICAgIGNvdmVyYWdlVGVzdFBlckZpbGVSZXN1bHRzLnVuZGVyRmlsZXMubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICAgICAgICAgICAgYERvY3VtZW50YXRpb24gY292ZXJhZ2UgKCR7Y292ZXJhZ2VEYXRhLmNvdW50fSUpIGlzIG92ZXIgdGhyZXNob2xkICgke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkXG4gICAgICAgICAgICAgICAgICAgICAgICB9JSlgXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICAgICAgICAgICAgYERvY3VtZW50YXRpb24gY292ZXJhZ2UgcGVyIGZpbGUgaXMgb3ZlciB0aHJlc2hvbGQgKCR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZU1pbmltdW1QZXJGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICB9JSlgXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRpb25Qcm9taXNlUmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgY292ZXJhZ2VEYXRhLmNvdW50ID49IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkICYmXG4gICAgICAgICAgICAgICAgICAgIGNvdmVyYWdlVGVzdFBlckZpbGVSZXN1bHRzLnVuZGVyRmlsZXMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGBEb2N1bWVudGF0aW9uIGNvdmVyYWdlICgke2NvdmVyYWdlRGF0YS5jb3VudH0lKSBpcyBvdmVyIHRocmVzaG9sZCAoJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSUpYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9IGBEb2N1bWVudGF0aW9uIGNvdmVyYWdlIHBlciBmaWxlIGlzIG5vdCBvdmVyIHRocmVzaG9sZCAoJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VNaW5pbXVtUGVyRmlsZVxuICAgICAgICAgICAgICAgICAgICB9JSlgO1xuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0aW9uUHJvbWlzZVJlamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RUaHJlc2hvbGRGYWlsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybihtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGNvdmVyYWdlRGF0YS5jb3VudCA8IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkICYmXG4gICAgICAgICAgICAgICAgICAgIGNvdmVyYWdlVGVzdFBlckZpbGVSZXN1bHRzLnVuZGVyRmlsZXMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZUdsb2JhbCA9IGBEb2N1bWVudGF0aW9uIGNvdmVyYWdlICgke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdmVyYWdlRGF0YS5jb3VudFxuICAgICAgICAgICAgICAgICAgICAgICAgfSUpIGlzIG5vdCBvdmVyIHRocmVzaG9sZCAoJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSUpYCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VQZXJGaWxlID0gYERvY3VtZW50YXRpb24gY292ZXJhZ2UgcGVyIGZpbGUgaXMgbm90IG92ZXIgdGhyZXNob2xkICgke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VNaW5pbXVtUGVyRmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSUpYDtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGlvblByb21pc2VSZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkRmFpbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKG1lc3NhZ2VHbG9iYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKG1lc3NhZ2VQZXJGaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKG1lc3NhZ2VHbG9iYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4obWVzc2FnZVBlckZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSBgRG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSAoJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3ZlcmFnZURhdGEuY291bnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0lKSBpcyBub3Qgb3ZlciB0aHJlc2hvbGQgKCR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RUaHJlc2hvbGRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0lKWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlUGVyRmlsZSA9IGBEb2N1bWVudGF0aW9uIGNvdmVyYWdlIHBlciBmaWxlIGlzIG92ZXIgdGhyZXNob2xkICgke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VNaW5pbXVtUGVyRmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSUpYDtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGlvblByb21pc2VSZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkRmFpbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8obWVzc2FnZVBlckZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4obWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhtZXNzYWdlUGVyRmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHByZXBhcmVVbml0VGVzdENvdmVyYWdlKCkge1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJvY2VzcyB1bml0IHRlc3QgY292ZXJhZ2UgcmVwb3J0Jyk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgY292RGF0LCBjb3ZGaWxlTmFtZXM7XG5cbiAgICAgICAgICAgIGxldCBjb3ZlcmFnZURhdGE6IENvdmVyYWdlRGF0YSA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VEYXRhO1xuXG4gICAgICAgICAgICBpZiAoIWNvdmVyYWdlRGF0YS5maWxlcykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKCdNaXNzaW5nIGRvY3VtZW50YXRpb24gY292ZXJhZ2UgZGF0YScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb3ZEYXQgPSB7fTtcbiAgICAgICAgICAgICAgICBjb3ZGaWxlTmFtZXMgPSBfLm1hcChjb3ZlcmFnZURhdGEuZmlsZXMsIGVsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbGVOYW1lID0gZWwuZmlsZVBhdGg7XG4gICAgICAgICAgICAgICAgICAgIGNvdkRhdFtmaWxlTmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBlbC50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGlua3R5cGU6IGVsLmxpbmt0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGlua3N1YnR5cGU6IGVsLmxpbmtzdWJ0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZWwubmFtZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlsZU5hbWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZWFkIGNvdmVyYWdlIHN1bW1hcnkgZmlsZSBhbmQgZGF0YVxuICAgICAgICAgICAgbGV0IHVuaXRUZXN0U3VtbWFyeSA9IHt9O1xuICAgICAgICAgICAgbGV0IGZpbGVEYXQgPSBGaWxlRW5naW5lLmdldFN5bmMoQ29uZmlndXJhdGlvbi5tYWluRGF0YS51bml0VGVzdENvdmVyYWdlKTtcbiAgICAgICAgICAgIGlmIChmaWxlRGF0KSB7XG4gICAgICAgICAgICAgICAgdW5pdFRlc3RTdW1tYXJ5ID0gSlNPTi5wYXJzZShmaWxlRGF0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCdFcnJvciByZWFkaW5nIHVuaXQgdGVzdCBjb3ZlcmFnZSBmaWxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZ2V0Q292U3RhdHVzID0gZnVuY3Rpb24ocGVyY2VudCwgdG90YWxMaW5lcykge1xuICAgICAgICAgICAgICAgIGxldCBzdGF0dXM7XG4gICAgICAgICAgICAgICAgaWYgKHRvdGFsTGluZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzID0gJ3VuY292ZXJlZCc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwZXJjZW50IDw9IDI1KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cyA9ICdsb3cnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGVyY2VudCA+IDI1ICYmIHBlcmNlbnQgPD0gNTApIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzID0gJ21lZGl1bSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwZXJjZW50ID4gNTAgJiYgcGVyY2VudCA8PSA3NSkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMgPSAnZ29vZCc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzID0gJ3ZlcnktZ29vZCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IGdldENvdmVyYWdlRGF0YSA9IGZ1bmN0aW9uKGRhdGEsIGZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgbGV0IG91dCA9IHt9O1xuICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZSAhPT0gJ3RvdGFsJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY292RGF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5lZWQgYSBuYW1lIHRvIGluY2x1ZGUgaW4gb3V0cHV0IGJ1dCB0aGlzIGlzbid0IHZpc2libGVcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCA9IHsgbmFtZTogZmlsZU5hbWUsIGZpbGVQYXRoOiBmaWxlTmFtZSB9O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmRNYXRjaCA9IF8uZmlsdGVyKGNvdkZpbGVOYW1lcywgZWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbC5pbmNsdWRlcyhmaWxlTmFtZSkgfHwgZmlsZU5hbWUuaW5jbHVkZXMoZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmluZE1hdGNoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXQgPSBfLmNsb25lKGNvdkRhdFtmaW5kTWF0Y2hbMF1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRbJ2ZpbGVQYXRoJ10gPSBmaWxlTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQga2V5c1RvR2V0ID0gWydzdGF0ZW1lbnRzJywgJ2JyYW5jaGVzJywgJ2Z1bmN0aW9ucycsICdsaW5lcyddO1xuICAgICAgICAgICAgICAgIF8uZm9yRWFjaChrZXlzVG9HZXQsIGtleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ID0gZGF0YVtrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0W2tleV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY292ZXJhZ2VQZXJjZW50OiBNYXRoLnJvdW5kKHQucGN0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3ZlcmFnZUNvdW50OiAnJyArIHQuY292ZXJlZCArICcvJyArIHQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBnZXRDb3ZTdGF0dXModC5wY3QsIHQudG90YWwpXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCB1bml0VGVzdERhdGEgPSB7fTtcbiAgICAgICAgICAgIGxldCBmaWxlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgZmlsZSBpbiB1bml0VGVzdFN1bW1hcnkpIHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0ID0gZ2V0Q292ZXJhZ2VEYXRhKHVuaXRUZXN0U3VtbWFyeVtmaWxlXSwgZmlsZSk7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGUgPT09ICd0b3RhbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5pdFRlc3REYXRhWyd0b3RhbCddID0gZGF0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVzLnB1c2goZGF0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1bml0VGVzdERhdGFbJ2ZpbGVzJ10gPSBmaWxlcztcbiAgICAgICAgICAgIHVuaXRUZXN0RGF0YVsnaWRDb2x1bW4nXSA9IGNvdkRhdCAhPT0gdW5kZWZpbmVkOyAvLyBzaG91bGQgd2UgaW5jbHVkZSB0aGUgaWQgY29sdW1uXG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnVuaXRUZXN0RGF0YSA9IHVuaXRUZXN0RGF0YTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24uYWRkUGFnZSh7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3VuaXQtdGVzdCcsXG4gICAgICAgICAgICAgICAgaWQ6ICd1bml0LXRlc3QnLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6ICd1bml0LXRlc3QnLFxuICAgICAgICAgICAgICAgIGZpbGVzOiBmaWxlcyxcbiAgICAgICAgICAgICAgICBkYXRhOiB1bml0VGVzdERhdGEsXG4gICAgICAgICAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgICAgICAgICAgcGFnZVR5cGU6IENPTVBPRE9DX0RFRkFVTFRTLlBBR0VfVFlQRVMuUk9PVFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmV4cG9ydEZvcm1hdCA9PT0gQ09NUE9ET0NfREVGQVVMVFMuZXhwb3J0Rm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGtleXNUb0dldCA9IFsnc3RhdGVtZW50cycsICdicmFuY2hlcycsICdmdW5jdGlvbnMnLCAnbGluZXMnXTtcbiAgICAgICAgICAgICAgICBfLmZvckVhY2goa2V5c1RvR2V0LCBrZXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodW5pdFRlc3REYXRhWyd0b3RhbCddW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEh0bWxFbmdpbmUuZ2VuZXJhdGVDb3ZlcmFnZUJhZGdlKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0LCBrZXksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogdW5pdFRlc3REYXRhWyd0b3RhbCddW2tleV1bJ2NvdmVyYWdlUGVyY2VudCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogdW5pdFRlc3REYXRhWyd0b3RhbCddW2tleV1bJ3N0YXR1cyddXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByb2Nlc3NQYWdlKHBhZ2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2Nlc3MgcGFnZScsIHBhZ2UubmFtZSk7XG5cbiAgICAgICAgbGV0IGh0bWxEYXRhID0gSHRtbEVuZ2luZS5yZW5kZXIoQ29uZmlndXJhdGlvbi5tYWluRGF0YSwgcGFnZSk7XG4gICAgICAgIGxldCBmaW5hbFBhdGggPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dDtcblxuICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQubGFzdEluZGV4T2YoJy8nKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIGZpbmFsUGF0aCArPSAnLyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhZ2UucGF0aCkge1xuICAgICAgICAgICAgZmluYWxQYXRoICs9IHBhZ2UucGF0aCArICcvJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYWdlLmZpbGVuYW1lKSB7XG4gICAgICAgICAgICBmaW5hbFBhdGggKz0gcGFnZS5maWxlbmFtZSArICcuaHRtbCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaW5hbFBhdGggKz0gcGFnZS5uYW1lICsgJy5odG1sJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlU2VhcmNoKSB7XG4gICAgICAgICAgICBTZWFyY2hFbmdpbmUuaW5kZXhQYWdlKHtcbiAgICAgICAgICAgICAgICBpbmZvczogcGFnZSxcbiAgICAgICAgICAgICAgICByYXdEYXRhOiBodG1sRGF0YSxcbiAgICAgICAgICAgICAgICB1cmw6IGZpbmFsUGF0aFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gRmlsZUVuZ2luZS53cml0ZShmaW5hbFBhdGgsIGh0bWxEYXRhKS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBkdXJpbmcgJyArIHBhZ2UubmFtZSArICcgcGFnZSBnZW5lcmF0aW9uJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJycpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJvY2Vzc1BhZ2VzKCkge1xuICAgICAgICBsZXQgcGFnZXMgPSBfLnNvcnRCeShDb25maWd1cmF0aW9uLnBhZ2VzLCBbJ25hbWUnXSk7XG5cbiAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2Nlc3MgcGFnZXMnKTtcbiAgICAgICAgUHJvbWlzZS5hbGwocGFnZXMubWFwKHBhZ2UgPT4gdGhpcy5wcm9jZXNzUGFnZShwYWdlKSkpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNhbGxiYWNrc0FmdGVyR2VuZXJhdGVTZWFyY2hJbmRleEpzb24gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmFkZGl0aW9uYWxQYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NBZGRpdGlvbmFsUGFnZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmFzc2V0c0ZvbGRlciAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NBc3NldHNGb2xkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc1Jlc291cmNlcygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoIUNvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVNlYXJjaCkge1xuICAgICAgICAgICAgICAgICAgICBTZWFyY2hFbmdpbmUuZ2VuZXJhdGVTZWFyY2hJbmRleEpzb24oQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQpLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzQWZ0ZXJHZW5lcmF0ZVNlYXJjaEluZGV4SnNvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3NBZnRlckdlbmVyYXRlU2VhcmNoSW5kZXhKc29uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzTWVudShDb25maWd1cmF0aW9uLm1haW5EYXRhKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcm9jZXNzTWVudShtYWluRGF0YSk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBsb2dnZXIuaW5mbygnUHJvY2VzcyBtZW51Li4uJyk7XG5cbiAgICAgICAgcmV0dXJuIEh0bWxFbmdpbmUucmVuZGVyTWVudShDb25maWd1cmF0aW9uLm1haW5EYXRhLnRlbXBsYXRlcywgbWFpbkRhdGEpLnRoZW4oaHRtbERhdGEgPT4ge1xuICAgICAgICAgICAgbGV0IGZpbmFsUGF0aCA9IGAke21haW5EYXRhLm91dHB1dH0vanMvbWVudS13Yy5qc2A7XG4gICAgICAgICAgICByZXR1cm4gRmlsZUVuZ2luZS53cml0ZShmaW5hbFBhdGgsIGh0bWxEYXRhKS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgZHVyaW5nICcgKyBmaW5hbFBhdGggKyAnIHBhZ2UgZ2VuZXJhdGlvbicpO1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHByb2Nlc3NBZGRpdGlvbmFsUGFnZXMoKSB7XG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcm9jZXNzIGFkZGl0aW9uYWwgcGFnZXMnKTtcbiAgICAgICAgbGV0IHBhZ2VzID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5hZGRpdGlvbmFsUGFnZXM7XG4gICAgICAgIFByb21pc2UuYWxsKFxuICAgICAgICAgICAgcGFnZXMubWFwKHBhZ2UgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc1BhZ2UocGFnZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5wYWdlLmNoaWxkcmVuLm1hcChjaGlsZFBhZ2UgPT4gdGhpcy5wcm9jZXNzUGFnZShjaGlsZFBhZ2UpKVxuICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzUGFnZShwYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgU2VhcmNoRW5naW5lLmdlbmVyYXRlU2VhcmNoSW5kZXhKc29uKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYXNzZXRzRm9sZGVyICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzQXNzZXRzRm9sZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzUmVzb3VyY2VzKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJvY2Vzc0Fzc2V0c0ZvbGRlcigpOiB2b2lkIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ0NvcHkgYXNzZXRzIGZvbGRlcicpO1xuXG4gICAgICAgIGlmICghRmlsZUVuZ2luZS5leGlzdHNTeW5jKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYXNzZXRzRm9sZGVyKSkge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgICAgIGBQcm92aWRlZCBhc3NldHMgZm9sZGVyICR7Q29uZmlndXJhdGlvbi5tYWluRGF0YS5hc3NldHNGb2xkZXJ9IGRpZCBub3QgZXhpc3RgXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZpbmFsT3V0cHV0ID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQ7XG5cbiAgICAgICAgICAgIGxldCB0ZXN0T3V0cHV0RGlyID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQubWF0Y2goY3dkKTtcblxuICAgICAgICAgICAgaWYgKHRlc3RPdXRwdXREaXIgJiYgdGVzdE91dHB1dERpci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZmluYWxPdXRwdXQgPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dC5yZXBsYWNlKGN3ZCArIHBhdGguc2VwLCAnJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gcGF0aC5qb2luKFxuICAgICAgICAgICAgICAgIGZpbmFsT3V0cHV0LFxuICAgICAgICAgICAgICAgIHBhdGguYmFzZW5hbWUoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5hc3NldHNGb2xkZXIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZnMuY29weShcbiAgICAgICAgICAgICAgICBwYXRoLnJlc29sdmUoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5hc3NldHNGb2xkZXIpLFxuICAgICAgICAgICAgICAgIHBhdGgucmVzb2x2ZShkZXN0aW5hdGlvbiksXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBkdXJpbmcgcmVzb3VyY2VzIGNvcHkgJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcHJvY2Vzc1Jlc291cmNlcygpIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oJ0NvcHkgbWFpbiByZXNvdXJjZXMnKTtcblxuICAgICAgICBjb25zdCBvbkNvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oXG4gICAgICAgICAgICAgICAgJ0RvY3VtZW50YXRpb24gZ2VuZXJhdGVkIGluICcgK1xuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dCArXG4gICAgICAgICAgICAgICAgICAgICcgaW4gJyArXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RWxhcHNlZFRpbWUoKSArXG4gICAgICAgICAgICAgICAgICAgICcgc2Vjb25kcyB1c2luZyAnICtcbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS50aGVtZSArXG4gICAgICAgICAgICAgICAgICAgICcgdGhlbWUnXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuc2VydmUpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgICAgICAgICAgICAgYFNlcnZpbmcgZG9jdW1lbnRhdGlvbiBmcm9tICR7XG4gICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dFxuICAgICAgICAgICAgICAgICAgICB9IGF0IGh0dHA6Ly8xMjcuMC4wLjE6JHtDb25maWd1cmF0aW9uLm1haW5EYXRhLnBvcnR9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpcy5ydW5XZWJTZXJ2ZXIoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBnZW5lcmF0aW9uUHJvbWlzZVJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZENhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGZpbmFsT3V0cHV0ID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQ7XG5cbiAgICAgICAgbGV0IHRlc3RPdXRwdXREaXIgPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dC5tYXRjaChjd2QpO1xuXG4gICAgICAgIGlmICh0ZXN0T3V0cHV0RGlyICYmIHRlc3RPdXRwdXREaXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZmluYWxPdXRwdXQgPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dC5yZXBsYWNlKGN3ZCArIHBhdGguc2VwLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmcy5jb3B5KFxuICAgICAgICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSArICcvLi4vc3JjL3Jlc291cmNlcy8nKSxcbiAgICAgICAgICAgIHBhdGgucmVzb2x2ZShmaW5hbE91dHB1dCksXG4gICAgICAgICAgICBlcnJvckNvcHkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnJvckNvcHkpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBkdXJpbmcgcmVzb3VyY2VzIGNvcHkgJywgZXJyb3JDb3B5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHRUaGVtZVByb21pc2UgPSBuZXcgUHJvbWlzZSgoZXh0VGhlbWVSZXNvbHZlLCBleHRUaGVtZVJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZXh0VGhlbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy5jb3B5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLnJlc29sdmUoY3dkICsgcGF0aC5zZXAgKyBDb25maWd1cmF0aW9uLm1haW5EYXRhLmV4dFRoZW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5yZXNvbHZlKGZpbmFsT3V0cHV0ICsgJy9zdHlsZXMvJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVycm9yQ29weVRoZW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3JDb3B5VGhlbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdFcnJvciBkdXJpbmcgZXh0ZXJuYWwgc3R5bGluZyB0aGVtZSBjb3B5ICcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yQ29weVRoZW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRUaGVtZVJlamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnRXh0ZXJuYWwgc3R5bGluZyB0aGVtZSBjb3B5IHN1Y2NlZWRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dFRoZW1lUmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0VGhlbWVSZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1c3RvbUZhdmljb25Qcm9taXNlID0gbmV3IFByb21pc2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAoY3VzdG9tRmF2aWNvblJlc29sdmUsIGN1c3RvbUZhdmljb25SZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jdXN0b21GYXZpY29uICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgQ3VzdG9tIGZhdmljb24gc3VwcGxpZWRgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMuY29weShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGgucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjd2QgKyBwYXRoLnNlcCArIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY3VzdG9tRmF2aWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGgucmVzb2x2ZShmaW5hbE91dHB1dCArICcvaW1hZ2VzL2Zhdmljb24uaWNvJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNvcHlGYXZpY29uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yQ29weUZhdmljb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0Vycm9yIGR1cmluZyByZXNvdXJjZXMgY29weSBvZiBmYXZpY29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yQ29weUZhdmljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdG9tRmF2aWNvblJlamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdFeHRlcm5hbCBjdXN0b20gZmF2aWNvbiBjb3B5IHN1Y2NlZWRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21GYXZpY29uUmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21GYXZpY29uUmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXN0b21Mb2dvUHJvbWlzZSA9IG5ldyBQcm9taXNlKChjdXN0b21Mb2dvUmVzb2x2ZSwgY3VzdG9tTG9nb1JlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY3VzdG9tTG9nbyAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgQ3VzdG9tIGxvZ28gc3VwcGxpZWRgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcy5jb3B5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjd2QgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5zZXAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jdXN0b21Mb2dvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGgucmVzb2x2ZShmaW5hbE91dHB1dCArICcvaW1hZ2VzLycgKyBDb25maWd1cmF0aW9uLm1haW5EYXRhLmN1c3RvbUxvZ28uc3BsaXQoXCIvXCIpLnBvcCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JDb3B5TG9nbyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3JDb3B5TG9nbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0Vycm9yIGR1cmluZyByZXNvdXJjZXMgY29weSBvZiBsb2dvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JDb3B5TG9nb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdG9tTG9nb1JlamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnRXh0ZXJuYWwgY3VzdG9tIGxvZ28gY29weSBzdWNjZWVkZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21Mb2dvUmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdG9tTG9nb1Jlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoW2V4dFRoZW1lUHJvbWlzZSwgY3VzdG9tRmF2aWNvblByb21pc2UsIGN1c3RvbUxvZ29Qcm9taXNlXSkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgdGhlIGVsYXBzZWQgdGltZSBzaW5jZSB0aGUgcHJvZ3JhbSB3YXMgc3RhcnRlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXRFbGFwc2VkVGltZSgpIHtcbiAgICAgICAgcmV0dXJuIChuZXcgRGF0ZSgpLnZhbHVlT2YoKSAtIHN0YXJ0VGltZS52YWx1ZU9mKCkpIC8gMTAwMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJvY2Vzc0dyYXBocygpIHtcbiAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUdyYXBoKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnR3JhcGggZ2VuZXJhdGlvbiBkaXNhYmxlZCcpO1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzUGFnZXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9jZXNzIG1haW4gZ3JhcGgnKTtcbiAgICAgICAgICAgIGxldCBtb2R1bGVzID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS5tb2R1bGVzO1xuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgbGV0IGxlbiA9IG1vZHVsZXMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGxvb3AgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPD0gbGVuIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvY2VzcyBtb2R1bGUgZ3JhcGggJywgbW9kdWxlc1tpXS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmFsUGF0aCA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQubGFzdEluZGV4T2YoJy8nKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsUGF0aCArPSAnLyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZmluYWxQYXRoICs9ICdtb2R1bGVzLycgKyBtb2R1bGVzW2ldLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBfcmF3TW9kdWxlID0gRGVwZW5kZW5jaWVzRW5naW5lLmdldFJhd01vZHVsZShtb2R1bGVzW2ldLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBfcmF3TW9kdWxlLmRlY2xhcmF0aW9ucy5sZW5ndGggPiAwIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmF3TW9kdWxlLmJvb3RzdHJhcC5sZW5ndGggPiAwIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmF3TW9kdWxlLmltcG9ydHMubGVuZ3RoID4gMCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgX3Jhd01vZHVsZS5leHBvcnRzLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yYXdNb2R1bGUucHJvdmlkZXJzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBOZ2RFbmdpbmUucmVuZGVyR3JhcGgoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlc1tpXS5maWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlc1tpXS5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICApLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOZ2RFbmdpbmUucmVhZEdyYXBoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5yZXNvbHZlKGZpbmFsUGF0aCArIHBhdGguc2VwICsgJ2RlcGVuZGVuY2llcy5zdmcnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZXNbaV0ubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVzW2ldLmdyYXBoID0gZGF0YSBhcyBzdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgZHVyaW5nIGdyYXBoIHJlYWQ6ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9vcCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzUGFnZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IGZpbmFsTWFpbkdyYXBoUGF0aCA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0O1xuICAgICAgICAgICAgaWYgKGZpbmFsTWFpbkdyYXBoUGF0aC5sYXN0SW5kZXhPZignLycpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGZpbmFsTWFpbkdyYXBoUGF0aCArPSAnLyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbE1haW5HcmFwaFBhdGggKz0gJ2dyYXBoJztcbiAgICAgICAgICAgIE5nZEVuZ2luZS5pbml0KHBhdGgucmVzb2x2ZShmaW5hbE1haW5HcmFwaFBhdGgpKTtcblxuICAgICAgICAgICAgTmdkRW5naW5lLnJlbmRlckdyYXBoKFxuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcsXG4gICAgICAgICAgICAgICAgcGF0aC5yZXNvbHZlKGZpbmFsTWFpbkdyYXBoUGF0aCksXG4gICAgICAgICAgICAgICAgJ3AnXG4gICAgICAgICAgICApLnRoZW4oXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBOZ2RFbmdpbmUucmVhZEdyYXBoKFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5yZXNvbHZlKGZpbmFsTWFpbkdyYXBoUGF0aCArIHBhdGguc2VwICsgJ2RlcGVuZGVuY2llcy5zdmcnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdNYWluIGdyYXBoJ1xuICAgICAgICAgICAgICAgICAgICApLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm1haW5HcmFwaCA9IGRhdGEgYXMgc3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgZHVyaW5nIG1haW4gZ3JhcGggcmVhZGluZyA6ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlTWFpbkdyYXBoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb29wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAnT29vcHMgZXJyb3IgZHVyaW5nIG1haW4gZ3JhcGggZ2VuZXJhdGlvbiwgbW92aW5nIG9uIG5leHQgcGFydCB3aXRoIG1haW4gZ3JhcGggZGlzYWJsZWQgOiAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZU1haW5HcmFwaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGxvb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJ1bldlYlNlcnZlcihmb2xkZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzV2F0Y2hpbmcpIHtcbiAgICAgICAgICAgIExpdmVTZXJ2ZXIuc3RhcnQoe1xuICAgICAgICAgICAgICAgIHJvb3Q6IGZvbGRlcixcbiAgICAgICAgICAgICAgICBvcGVuOiBDb25maWd1cmF0aW9uLm1haW5EYXRhLm9wZW4sXG4gICAgICAgICAgICAgICAgcXVpZXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgbG9nTGV2ZWw6IDAsXG4gICAgICAgICAgICAgICAgd2FpdDogMTAwMCxcbiAgICAgICAgICAgICAgICBwb3J0OiBDb25maWd1cmF0aW9uLm1haW5EYXRhLnBvcnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLndhdGNoICYmICF0aGlzLmlzV2F0Y2hpbmcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5maWxlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ05vIHNvdXJjZXMgZmlsZXMgYXZhaWxhYmxlLCBwbGVhc2UgdXNlIC1wIGZsYWcnKTtcbiAgICAgICAgICAgICAgICBnZW5lcmF0aW9uUHJvbWlzZVJlamVjdCgpO1xuICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ydW5XYXRjaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEud2F0Y2ggJiYgdGhpcy5pc1dhdGNoaW5nKSB7XG4gICAgICAgICAgICBsZXQgc3JjRm9sZGVyID0gZmluZE1haW5Tb3VyY2VGb2xkZXIodGhpcy5maWxlcyk7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgQWxyZWFkeSB3YXRjaGluZyBzb3VyY2VzIGluICR7c3JjRm9sZGVyfSBmb2xkZXJgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBydW5XYXRjaCgpIHtcbiAgICAgICAgbGV0IHNvdXJjZXMgPSBbZmluZE1haW5Tb3VyY2VGb2xkZXIodGhpcy5maWxlcyldO1xuICAgICAgICBsZXQgd2F0Y2hlclJlYWR5ID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5pc1dhdGNoaW5nID0gdHJ1ZTtcblxuICAgICAgICBsb2dnZXIuaW5mbyhgV2F0Y2hpbmcgc291cmNlcyBpbiAke2ZpbmRNYWluU291cmNlRm9sZGVyKHRoaXMuZmlsZXMpfSBmb2xkZXJgKTtcblxuICAgICAgICBpZiAoTWFya2Rvd25FbmdpbmUuaGFzUm9vdE1hcmtkb3ducygpKSB7XG4gICAgICAgICAgICBzb3VyY2VzID0gc291cmNlcy5jb25jYXQoTWFya2Rvd25FbmdpbmUubGlzdFJvb3RNYXJrZG93bnMoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbmNsdWRlcyAhPT0gJycpIHtcbiAgICAgICAgICAgIHNvdXJjZXMgPSBzb3VyY2VzLmNvbmNhdChDb25maWd1cmF0aW9uLm1haW5EYXRhLmluY2x1ZGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGFsbCBlbGVtZW50cyBvZiBzb3VyY2VzIGxpc3QgZXhpc3RcbiAgICAgICAgc291cmNlcyA9IGNsZWFuU291cmNlc0ZvcldhdGNoKHNvdXJjZXMpO1xuXG4gICAgICAgIGxldCB3YXRjaGVyID0gY2hva2lkYXIud2F0Y2goc291cmNlcywge1xuICAgICAgICAgICAgYXdhaXRXcml0ZUZpbmlzaDogdHJ1ZSxcbiAgICAgICAgICAgIGlnbm9yZUluaXRpYWw6IHRydWUsXG4gICAgICAgICAgICBpZ25vcmVkOiAvKHNwZWN8XFwuZClcXC50cy9cbiAgICAgICAgfSk7XG4gICAgICAgIGxldCB0aW1lckFkZEFuZFJlbW92ZVJlZjtcbiAgICAgICAgbGV0IHRpbWVyQ2hhbmdlUmVmO1xuICAgICAgICBsZXQgcnVubmVyQWRkQW5kUmVtb3ZlID0gKCkgPT4ge1xuICAgICAgICAgICAgc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IHdhaXRlckFkZEFuZFJlbW92ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lckFkZEFuZFJlbW92ZVJlZik7XG4gICAgICAgICAgICB0aW1lckFkZEFuZFJlbW92ZVJlZiA9IHNldFRpbWVvdXQocnVubmVyQWRkQW5kUmVtb3ZlLCAxMDAwKTtcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IHJ1bm5lckNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB0aGlzLnNldFVwZGF0ZWRGaWxlcyh0aGlzLndhdGNoQ2hhbmdlZEZpbGVzKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1dhdGNoZWRGaWxlc1RTRmlsZXMoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0TWljcm9EZXBlbmRlbmNpZXNEYXRhKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaGFzV2F0Y2hlZEZpbGVzUm9vdE1hcmtkb3duRmlsZXMoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVidWlsZFJvb3RNYXJrZG93bnMoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWJ1aWxkRXh0ZXJuYWxEb2N1bWVudGF0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGxldCB3YWl0ZXJDaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXJDaGFuZ2VSZWYpO1xuICAgICAgICAgICAgdGltZXJDaGFuZ2VSZWYgPSBzZXRUaW1lb3V0KHJ1bm5lckNoYW5nZSwgMTAwMCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgd2F0Y2hlci5vbigncmVhZHknLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXdhdGNoZXJSZWFkeSkge1xuICAgICAgICAgICAgICAgIHdhdGNoZXJSZWFkeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgd2F0Y2hlclxuICAgICAgICAgICAgICAgICAgICAub24oJ2FkZCcsIGZpbGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKGBGaWxlICR7ZmlsZX0gaGFzIGJlZW4gYWRkZWRgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRlc3QgZXh0ZW5zaW9uLCBpZiB0c1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzY2FuIGV2ZXJ5dGhpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXRoLmV4dG5hbWUoZmlsZSkgPT09ICcudHMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2FpdGVyQWRkQW5kUmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywgZmlsZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYEZpbGUgJHtmaWxlfSBoYXMgYmVlbiBjaGFuZ2VkYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUZXN0IGV4dGVuc2lvbiwgaWYgdHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc2NhbiBvbmx5IGZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLmV4dG5hbWUoZmlsZSkgPT09ICcudHMnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5leHRuYW1lKGZpbGUpID09PSAnLm1kJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGguZXh0bmFtZShmaWxlKSA9PT0gJy5qc29uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53YXRjaENoYW5nZWRGaWxlcy5wdXNoKHBhdGguam9pbihjd2QgKyBwYXRoLnNlcCArIGZpbGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YWl0ZXJDaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCd1bmxpbmsnLCBmaWxlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgRmlsZSAke2ZpbGV9IGhhcyBiZWVuIHJlbW92ZWRgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRlc3QgZXh0ZW5zaW9uLCBpZiB0c1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzY2FuIGV2ZXJ5dGhpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXRoLmV4dG5hbWUoZmlsZSkgPT09ICcudHMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2FpdGVyQWRkQW5kUmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIGFwcGxpY2F0aW9uIC8gcm9vdCBjb21wb25lbnQgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZ2V0IGFwcGxpY2F0aW9uKCk6IEFwcGxpY2F0aW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0IGlzQ0xJKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuIl19