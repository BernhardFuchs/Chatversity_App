"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var ts_simple_ast_1 = require("ts-simple-ast");
var application_1 = require("./app/application");
var configuration_1 = require("./app/configuration");
var file_engine_1 = require("./app/engines/file.engine");
var i18n_engine_1 = require("./app/engines/i18n.engine");
var angular_version_util_1 = require("./utils/angular-version.util");
var defaults_1 = require("./utils/defaults");
var logger_1 = require("./utils/logger");
var parser_util_class_1 = require("./utils/parser.util.class");
var utils_1 = require("./utils/utils");
var cosmiconfig = require('cosmiconfig');
var os = require('os');
var osName = require('os-name');
var pkg = require('../package.json');
var program = require('commander');
var cosmiconfigModuleName = 'compodoc';
var scannedFiles = [];
var excludeFiles;
var includeFiles;
var cwd = process.cwd();
process.setMaxListeners(0);
var CliApplication = /** @class */ (function (_super) {
    __extends(CliApplication, _super);
    function CliApplication() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Run compodoc from the command line.
     */
    CliApplication.prototype.generate = function () {
        var _this = this;
        function list(val) {
            return val.split(',');
        }
        program
            .version(pkg.version)
            .usage('<src> [options]')
            .option('-c, --config [config]', 'A configuration file : .compodocrc, .compodocrc.json, .compodocrc.yaml or compodoc property in package.json')
            .option('-p, --tsconfig [config]', 'A tsconfig.json file')
            .option('-d, --output [folder]', 'Where to store the generated documentation', defaults_1.COMPODOC_DEFAULTS.folder)
            .option('-y, --extTheme [file]', 'External styling theme file')
            .option('-n, --name [name]', 'Title documentation', defaults_1.COMPODOC_DEFAULTS.title)
            .option('-a, --assetsFolder [folder]', 'External assets folder to copy in generated documentation folder')
            .option('-o, --open [value]', 'Open the generated documentation')
            .option('-t, --silent', "In silent mode, log messages aren't logged in the console", false)
            .option('-s, --serve', 'Serve generated documentation (default http://localhost:8080/)', false)
            .option('-r, --port [port]', 'Change default serving port', defaults_1.COMPODOC_DEFAULTS.port)
            .option('-w, --watch', 'Watch source files after serve and force documentation rebuild', false)
            .option('-e, --exportFormat [format]', 'Export in specified format (json, html)', defaults_1.COMPODOC_DEFAULTS.exportFormat)
            .option('--files [files]', 'Files provided by external tool, used for coverage test')
            .option('--language [language]', 'Language used for the generated documentation (en-US, fr-FR, zh-CN, pt-BR)', defaults_1.COMPODOC_DEFAULTS.language)
            .option('--theme [theme]', "Choose one of available themes, default is 'gitbook' (laravel, original, material, postmark, readthedocs, stripe, vagrant)")
            .option('--hideGenerator', 'Do not print the Compodoc link at the bottom of the page', false)
            .option('--toggleMenuItems <items>', "Close by default items in the menu values : ['all'] or one of these ['modules','components','directives','classes','injectables','interfaces','pipes','additionalPages']", list, defaults_1.COMPODOC_DEFAULTS.toggleMenuItems)
            .option('--navTabConfig <tab configs>', "List navigation tab objects in the desired order with two string properties (\"id\" and \"label\"). Double-quotes must be escaped with '\\'. Available tab IDs are \"info\", \"readme\", \"source\", \"templateData\", \"styleData\", \"tree\", and \"example\". Note: Certain tabs will only be shown if applicable to a given dependency", list, JSON.stringify(defaults_1.COMPODOC_DEFAULTS.navTabConfig))
            .option('--templates [folder]', 'Path to directory of Handlebars templates to override built-in templates')
            .option('--includes [path]', 'Path of external markdown files to include')
            .option('--includesName [name]', 'Name of item menu of externals markdown files', defaults_1.COMPODOC_DEFAULTS.additionalEntryName)
            .option('--coverageTest [threshold]', 'Test command of documentation coverage with a threshold (default 70)')
            .option('--coverageMinimumPerFile [minimum]', 'Test command of documentation coverage per file with a minimum (default 0)')
            .option('--coverageTestThresholdFail [true|false]', 'Test command of documentation coverage (global or per file) will fail with error or just warn user (true: error, false: warn)', defaults_1.COMPODOC_DEFAULTS.coverageTestThresholdFail)
            .option('--coverageTestShowOnlyFailed', 'Display only failed files for a coverage test')
            .option('--unitTestCoverage [json-summary]', 'To include unit test coverage, specify istanbul JSON coverage summary file')
            .option('--disableSourceCode', 'Do not add source code tab and links to source code', false)
            .option('--disableDomTree', 'Do not add dom tree tab', false)
            .option('--disableTemplateTab', 'Do not add template tab', false)
            .option('--disableStyleTab', 'Do not add style tab', false)
            .option('--disableGraph', 'Do not add the dependency graph', false)
            .option('--disableCoverage', 'Do not add the documentation coverage report', false)
            .option('--disablePrivate', 'Do not show private in generated documentation', false)
            .option('--disableProtected', 'Do not show protected in generated documentation', false)
            .option('--disableInternal', 'Do not show @internal in generated documentation', false)
            .option('--disableLifeCycleHooks', 'Do not show Angular lifecycle hooks in generated documentation', false)
            .option('--disableRoutesGraph', 'Do not add the routes graph', defaults_1.COMPODOC_DEFAULTS.disableRoutesGraph)
            .option('--disableSearch', 'Do not add the search input', false)
            .option('--minimal', 'Minimal mode with only documentation. No search, no graph, no coverage.', false)
            .option('--customFavicon [path]', 'Use a custom favicon')
            .option('--customLogo [path]', 'Use a custom logo')
            .option('--gaID [id]', 'Google Analytics tracking ID')
            .option('--gaSite [site]', 'Google Analytics site name', defaults_1.COMPODOC_DEFAULTS.gaSite)
            .parse(process.argv);
        var outputHelp = function () {
            program.outputHelp();
            process.exit(1);
        };
        var configExplorer = cosmiconfig(cosmiconfigModuleName);
        var configExplorerResult;
        var configFile = {};
        if (program.config) {
            var configFilePath = program.config;
            var testConfigFilePath = configFilePath.match(process.cwd());
            if (testConfigFilePath && testConfigFilePath.length > 0) {
                configFilePath = configFilePath.replace(process.cwd() + path.sep, '');
            }
            configExplorerResult = configExplorer.loadSync(path.resolve(configFilePath));
        }
        else {
            configExplorerResult = configExplorer.searchSync();
        }
        if (configExplorerResult) {
            if (typeof configExplorerResult.config !== 'undefined') {
                configFile = configExplorerResult.config;
            }
        }
        if (configFile.output) {
            configuration_1.default.mainData.output = configFile.output;
        }
        if (program.output && program.output !== defaults_1.COMPODOC_DEFAULTS.folder) {
            configuration_1.default.mainData.output = program.output;
        }
        if (configFile.extTheme) {
            configuration_1.default.mainData.extTheme = configFile.extTheme;
        }
        if (program.extTheme) {
            configuration_1.default.mainData.extTheme = program.extTheme;
        }
        if (configFile.language) {
            configuration_1.default.mainData.language = configFile.language;
        }
        if (program.language) {
            configuration_1.default.mainData.language = program.language;
        }
        if (configFile.theme) {
            configuration_1.default.mainData.theme = configFile.theme;
        }
        if (program.theme) {
            configuration_1.default.mainData.theme = program.theme;
        }
        if (configFile.name) {
            configuration_1.default.mainData.documentationMainName = configFile.name;
        }
        if (program.name && program.name !== defaults_1.COMPODOC_DEFAULTS.title) {
            configuration_1.default.mainData.documentationMainName = program.name;
        }
        if (configFile.assetsFolder) {
            configuration_1.default.mainData.assetsFolder = configFile.assetsFolder;
        }
        if (program.assetsFolder) {
            configuration_1.default.mainData.assetsFolder = program.assetsFolder;
        }
        if (configFile.open) {
            configuration_1.default.mainData.open = configFile.open;
        }
        if (program.open) {
            configuration_1.default.mainData.open = program.open;
        }
        if (configFile.toggleMenuItems) {
            configuration_1.default.mainData.toggleMenuItems = configFile.toggleMenuItems;
        }
        if (program.toggleMenuItems &&
            program.toggleMenuItems !== defaults_1.COMPODOC_DEFAULTS.toggleMenuItems) {
            configuration_1.default.mainData.toggleMenuItems = program.toggleMenuItems;
        }
        if (configFile.templates) {
            configuration_1.default.mainData.templates = configFile.templates;
        }
        if (program.templates) {
            configuration_1.default.mainData.templates = program.templates;
        }
        if (configFile.navTabConfig) {
            configuration_1.default.mainData.navTabConfig = configFile.navTabConfig;
        }
        if (program.navTabConfig &&
            JSON.parse(program.navTabConfig).length !== defaults_1.COMPODOC_DEFAULTS.navTabConfig.length) {
            configuration_1.default.mainData.navTabConfig = JSON.parse(program.navTabConfig);
        }
        if (configFile.includes) {
            configuration_1.default.mainData.includes = configFile.includes;
        }
        if (program.includes) {
            configuration_1.default.mainData.includes = program.includes;
        }
        if (configFile.includesName) {
            configuration_1.default.mainData.includesName = configFile.includesName;
        }
        if (program.includesName &&
            program.includesName !== defaults_1.COMPODOC_DEFAULTS.additionalEntryName) {
            configuration_1.default.mainData.includesName = program.includesName;
        }
        if (configFile.silent) {
            logger_1.logger.silent = false;
        }
        if (program.silent) {
            logger_1.logger.silent = false;
        }
        if (configFile.serve) {
            configuration_1.default.mainData.serve = configFile.serve;
        }
        if (program.serve) {
            configuration_1.default.mainData.serve = program.serve;
        }
        if (configFile.port) {
            configuration_1.default.mainData.port = configFile.port;
        }
        if (program.port && program.port !== defaults_1.COMPODOC_DEFAULTS.port) {
            configuration_1.default.mainData.port = program.port;
        }
        if (configFile.watch) {
            configuration_1.default.mainData.watch = configFile.watch;
        }
        if (program.watch) {
            configuration_1.default.mainData.watch = program.watch;
        }
        if (configFile.exportFormat) {
            configuration_1.default.mainData.exportFormat = configFile.exportFormat;
        }
        if (program.exportFormat && program.exportFormat !== defaults_1.COMPODOC_DEFAULTS.exportFormat) {
            configuration_1.default.mainData.exportFormat = program.exportFormat;
        }
        if (configFile.hideGenerator) {
            configuration_1.default.mainData.hideGenerator = configFile.hideGenerator;
        }
        if (program.hideGenerator) {
            configuration_1.default.mainData.hideGenerator = program.hideGenerator;
        }
        if (configFile.coverageTest) {
            configuration_1.default.mainData.coverageTest = true;
            configuration_1.default.mainData.coverageTestThreshold =
                typeof configFile.coverageTest === 'string'
                    ? parseInt(configFile.coverageTest, 10)
                    : defaults_1.COMPODOC_DEFAULTS.defaultCoverageThreshold;
        }
        if (program.coverageTest) {
            configuration_1.default.mainData.coverageTest = true;
            configuration_1.default.mainData.coverageTestThreshold =
                typeof program.coverageTest === 'string'
                    ? parseInt(program.coverageTest, 10)
                    : defaults_1.COMPODOC_DEFAULTS.defaultCoverageThreshold;
        }
        if (configFile.coverageMinimumPerFile) {
            configuration_1.default.mainData.coverageTestPerFile = true;
            configuration_1.default.mainData.coverageMinimumPerFile =
                typeof configFile.coverageMinimumPerFile === 'string'
                    ? parseInt(configFile.coverageMinimumPerFile, 10)
                    : defaults_1.COMPODOC_DEFAULTS.defaultCoverageMinimumPerFile;
        }
        if (program.coverageMinimumPerFile) {
            configuration_1.default.mainData.coverageTestPerFile = true;
            configuration_1.default.mainData.coverageMinimumPerFile =
                typeof program.coverageMinimumPerFile === 'string'
                    ? parseInt(program.coverageMinimumPerFile, 10)
                    : defaults_1.COMPODOC_DEFAULTS.defaultCoverageMinimumPerFile;
        }
        if (configFile.coverageTestThresholdFail) {
            configuration_1.default.mainData.coverageTestThresholdFail =
                configFile.coverageTestThresholdFail === 'false' ? false : true;
        }
        if (program.coverageTestThresholdFail) {
            configuration_1.default.mainData.coverageTestThresholdFail =
                program.coverageTestThresholdFail === 'false' ? false : true;
        }
        if (configFile.coverageTestShowOnlyFailed) {
            configuration_1.default.mainData.coverageTestShowOnlyFailed =
                configFile.coverageTestShowOnlyFailed;
        }
        if (program.coverageTestShowOnlyFailed) {
            configuration_1.default.mainData.coverageTestShowOnlyFailed = program.coverageTestShowOnlyFailed;
        }
        if (configFile.unitTestCoverage) {
            configuration_1.default.mainData.unitTestCoverage = configFile.unitTestCoverage;
        }
        if (program.unitTestCoverage) {
            configuration_1.default.mainData.unitTestCoverage = program.unitTestCoverage;
        }
        if (configFile.disableSourceCode) {
            configuration_1.default.mainData.disableSourceCode = configFile.disableSourceCode;
        }
        if (program.disableSourceCode) {
            configuration_1.default.mainData.disableSourceCode = program.disableSourceCode;
        }
        if (configFile.disableDomTree) {
            configuration_1.default.mainData.disableDomTree = configFile.disableDomTree;
        }
        if (program.disableDomTree) {
            configuration_1.default.mainData.disableDomTree = program.disableDomTree;
        }
        if (configFile.disableTemplateTab) {
            configuration_1.default.mainData.disableTemplateTab = configFile.disableTemplateTab;
        }
        if (program.disableTemplateTab) {
            configuration_1.default.mainData.disableTemplateTab = program.disableTemplateTab;
        }
        if (configFile.disableStyleTab) {
            configuration_1.default.mainData.disableStyleTab = configFile.disableStyleTab;
        }
        if (program.disableStyleTab) {
            configuration_1.default.mainData.disableStyleTab = program.disableStyleTab;
        }
        if (configFile.disableGraph) {
            configuration_1.default.mainData.disableGraph = configFile.disableGraph;
        }
        if (program.disableGraph) {
            configuration_1.default.mainData.disableGraph = program.disableGraph;
        }
        if (configFile.disableCoverage) {
            configuration_1.default.mainData.disableCoverage = configFile.disableCoverage;
        }
        if (program.disableCoverage) {
            configuration_1.default.mainData.disableCoverage = program.disableCoverage;
        }
        if (configFile.disablePrivate) {
            configuration_1.default.mainData.disablePrivate = configFile.disablePrivate;
        }
        if (program.disablePrivate) {
            configuration_1.default.mainData.disablePrivate = program.disablePrivate;
        }
        if (configFile.disableProtected) {
            configuration_1.default.mainData.disableProtected = configFile.disableProtected;
        }
        if (program.disableProtected) {
            configuration_1.default.mainData.disableProtected = program.disableProtected;
        }
        if (configFile.disableInternal) {
            configuration_1.default.mainData.disableInternal = configFile.disableInternal;
        }
        if (program.disableInternal) {
            configuration_1.default.mainData.disableInternal = program.disableInternal;
        }
        if (configFile.disableLifeCycleHooks) {
            configuration_1.default.mainData.disableLifeCycleHooks = configFile.disableLifeCycleHooks;
        }
        if (program.disableLifeCycleHooks) {
            configuration_1.default.mainData.disableLifeCycleHooks = program.disableLifeCycleHooks;
        }
        if (configFile.disableRoutesGraph) {
            configuration_1.default.mainData.disableRoutesGraph = configFile.disableRoutesGraph;
        }
        if (program.disableRoutesGraph) {
            configuration_1.default.mainData.disableRoutesGraph = program.disableRoutesGraph;
        }
        if (configFile.disableSearch) {
            configuration_1.default.mainData.disableSearch = configFile.disableSearch;
        }
        if (program.disableSearch) {
            configuration_1.default.mainData.disableSearch = program.disableSearch;
        }
        if (configFile.minimal) {
            configuration_1.default.mainData.disableSearch = true;
            configuration_1.default.mainData.disableRoutesGraph = true;
            configuration_1.default.mainData.disableGraph = true;
            configuration_1.default.mainData.disableCoverage = true;
        }
        if (program.minimal) {
            configuration_1.default.mainData.disableSearch = true;
            configuration_1.default.mainData.disableRoutesGraph = true;
            configuration_1.default.mainData.disableGraph = true;
            configuration_1.default.mainData.disableCoverage = true;
        }
        if (configFile.customFavicon) {
            configuration_1.default.mainData.customFavicon = configFile.customFavicon;
        }
        if (program.customFavicon) {
            configuration_1.default.mainData.customFavicon = program.customFavicon;
        }
        if (configFile.customLogo) {
            configuration_1.default.mainData.customLogo = configFile.customLogo;
        }
        if (program.customLogo) {
            configuration_1.default.mainData.customLogo = program.customLogo;
        }
        if (configFile.gaID) {
            configuration_1.default.mainData.gaID = configFile.gaID;
        }
        if (program.gaID) {
            configuration_1.default.mainData.gaID = program.gaID;
        }
        if (configFile.gaSite) {
            configuration_1.default.mainData.gaSite = configFile.gaSite;
        }
        if (program.gaSite && program.gaSite !== defaults_1.COMPODOC_DEFAULTS.gaSite) {
            configuration_1.default.mainData.gaSite = program.gaSite;
        }
        if (!this.isWatching) {
            console.log(fs.readFileSync(path.join(__dirname, '../src/banner')).toString());
            console.log(pkg.version);
            console.log('');
            console.log("TypeScript version used by Compodoc : " + ts_simple_ast_1.ts.version);
            console.log('');
            if (file_engine_1.default.existsSync(cwd + path.sep + 'package.json')) {
                var packageData = file_engine_1.default.getSync(cwd + path.sep + 'package.json');
                if (packageData) {
                    var parsedData = JSON.parse(packageData);
                    var projectDevDependencies = parsedData.devDependencies;
                    if (projectDevDependencies && projectDevDependencies.typescript) {
                        var tsProjectVersion = angular_version_util_1.default.cleanVersion(projectDevDependencies.typescript);
                        console.log("TypeScript version of current project : " + tsProjectVersion);
                        console.log('');
                    }
                }
            }
            console.log("Node.js version : " + process.version);
            console.log('');
            console.log("Operating system : " + osName(os.platform(), os.release()));
            console.log('');
        }
        if (configExplorerResult) {
            if (typeof configExplorerResult.config !== 'undefined') {
                logger_1.logger.info("Using configuration file : " + configExplorerResult.filepath);
            }
        }
        if (!configExplorerResult) {
            logger_1.logger.warn("No configuration file found, switching to CLI flags.");
        }
        if (program.language && !i18n_engine_1.default.supportLanguage(program.language)) {
            logger_1.logger.warn("The language " + program.language + " is not available, falling back to " + i18n_engine_1.default.fallbackLanguage);
        }
        if (program.tsconfig && typeof program.tsconfig === 'boolean') {
            logger_1.logger.error("Please provide a tsconfig file.");
            process.exit(1);
        }
        if (configFile.tsconfig) {
            configuration_1.default.mainData.tsconfig = configFile.tsconfig;
        }
        if (program.tsconfig) {
            configuration_1.default.mainData.tsconfig = program.tsconfig;
        }
        if (configFile.files) {
            scannedFiles = configFile.files;
        }
        if (configFile.exclude) {
            excludeFiles = configFile.exclude;
        }
        if (configFile.include) {
            includeFiles = configFile.include;
        }
        /**
         * Check --files argument call
         */
        var argv = require('minimist')(process.argv.slice(2));
        if (argv && argv.files) {
            configuration_1.default.mainData.hasFilesToCoverage = true;
            if (typeof argv.files === 'string') {
                _super.prototype.setFiles.call(this, [argv.files]);
            }
            else {
                _super.prototype.setFiles.call(this, argv.files);
            }
        }
        if (program.serve && !configuration_1.default.mainData.tsconfig && program.output) {
            // if -s & -d, serve it
            if (!file_engine_1.default.existsSync(configuration_1.default.mainData.output)) {
                logger_1.logger.error(configuration_1.default.mainData.output + " folder doesn't exist");
                process.exit(1);
            }
            else {
                logger_1.logger.info("Serving documentation from " + configuration_1.default.mainData.output + " at http://127.0.0.1:" + program.port);
                _super.prototype.runWebServer.call(this, program.output);
            }
        }
        else if (program.serve && !configuration_1.default.mainData.tsconfig && !program.output) {
            // if only -s find ./documentation, if ok serve, else error provide -d
            if (!file_engine_1.default.existsSync(configuration_1.default.mainData.output)) {
                logger_1.logger.error('Provide output generated folder with -d flag');
                process.exit(1);
            }
            else {
                logger_1.logger.info("Serving documentation from " + configuration_1.default.mainData.output + " at http://127.0.0.1:" + program.port);
                _super.prototype.runWebServer.call(this, configuration_1.default.mainData.output);
            }
        }
        else if (configuration_1.default.mainData.hasFilesToCoverage) {
            if (program.coverageMinimumPerFile) {
                logger_1.logger.info('Run documentation coverage test for files');
                _super.prototype.testCoverage.call(this);
            }
            else {
                logger_1.logger.error('Missing coverage configuration');
            }
        }
        else {
            if (program.hideGenerator) {
                configuration_1.default.mainData.hideGenerator = true;
            }
            if (configuration_1.default.mainData.tsconfig && program.args.length === 0) {
                /**
                 * tsconfig file provided only
                 */
                var testTsConfigPath = configuration_1.default.mainData.tsconfig.indexOf(process.cwd());
                if (testTsConfigPath !== -1) {
                    configuration_1.default.mainData.tsconfig = configuration_1.default.mainData.tsconfig.replace(process.cwd() + path.sep, '');
                }
                if (!file_engine_1.default.existsSync(configuration_1.default.mainData.tsconfig)) {
                    logger_1.logger.error("\"" + configuration_1.default.mainData.tsconfig + "\" file was not found in the current directory");
                    process.exit(1);
                }
                else {
                    var _file = path.join(path.join(process.cwd(), path.dirname(configuration_1.default.mainData.tsconfig)), path.basename(configuration_1.default.mainData.tsconfig));
                    // use the current directory of tsconfig.json as a working directory
                    cwd = _file
                        .split(path.sep)
                        .slice(0, -1)
                        .join(path.sep);
                    logger_1.logger.info('Using tsconfig file ', _file);
                    var tsConfigFile = utils_1.readConfig(_file);
                    scannedFiles = tsConfigFile.files;
                    if (scannedFiles) {
                        scannedFiles = utils_1.handlePath(scannedFiles, cwd);
                    }
                    if (typeof scannedFiles === 'undefined') {
                        excludeFiles = tsConfigFile.exclude || [];
                        includeFiles = tsConfigFile.include || [];
                        scannedFiles = [];
                        var excludeParser_1 = new parser_util_class_1.ParserUtil(), includeParser_1 = new parser_util_class_1.ParserUtil();
                        excludeParser_1.init(excludeFiles, cwd);
                        includeParser_1.init(includeFiles, cwd);
                        var startCwd = cwd;
                        var excludeParserTestFilesWithCwdDepth = excludeParser_1.testFilesWithCwdDepth();
                        if (!excludeParserTestFilesWithCwdDepth.status) {
                            startCwd = excludeParser_1.updateCwd(cwd, excludeParserTestFilesWithCwdDepth.level);
                        }
                        var includeParserTestFilesWithCwdDepth = includeParser_1.testFilesWithCwdDepth();
                        if (!includeParser_1.testFilesWithCwdDepth().status) {
                            startCwd = includeParser_1.updateCwd(cwd, includeParserTestFilesWithCwdDepth.level);
                        }
                        var finder = require('findit2')(startCwd || '.');
                        finder.on('directory', function (dir, stat, stop) {
                            var base = path.basename(dir);
                            if (base === '.git' || base === 'node_modules') {
                                stop();
                            }
                        });
                        finder.on('file', function (file, stat) {
                            if (/(spec|\.d)\.ts/.test(file)) {
                                logger_1.logger.warn('Ignoring', file);
                            }
                            else if (excludeParser_1.testFile(file) &&
                                path.extname(file) === '.ts') {
                                logger_1.logger.warn('Excluding', file);
                            }
                            else if (includeFiles.length > 0) {
                                /**
                                 * If include provided in tsconfig, use only this source,
                                 * and not files found with global findit scan in working directory
                                 */
                                if (path.extname(file) === '.ts' && includeParser_1.testFile(file)) {
                                    logger_1.logger.debug('Including', file);
                                    scannedFiles.push(file);
                                }
                                else {
                                    if (path.extname(file) === '.ts') {
                                        logger_1.logger.warn('Excluding', file);
                                    }
                                }
                            }
                            else {
                                logger_1.logger.debug('Including', file);
                                scannedFiles.push(file);
                            }
                        });
                        finder.on('end', function () {
                            _super.prototype.setFiles.call(_this, scannedFiles);
                            if (program.coverageTest || program.coverageTestPerFile) {
                                logger_1.logger.info('Run documentation coverage test');
                                _super.prototype.testCoverage.call(_this);
                            }
                            else {
                                _super.prototype.generate.call(_this);
                            }
                        });
                    }
                    else {
                        _super.prototype.setFiles.call(this, scannedFiles);
                        if (program.coverageTest || program.coverageTestPerFile) {
                            logger_1.logger.info('Run documentation coverage test');
                            _super.prototype.testCoverage.call(this);
                        }
                        else {
                            _super.prototype.generate.call(this);
                        }
                    }
                }
            }
            else if (configuration_1.default.mainData.tsconfig && program.args.length > 0) {
                /**
                 * tsconfig file provided with source folder in arg
                 */
                var testTsConfigPath = configuration_1.default.mainData.tsconfig.indexOf(process.cwd());
                if (testTsConfigPath !== -1) {
                    configuration_1.default.mainData.tsconfig = configuration_1.default.mainData.tsconfig.replace(process.cwd() + path.sep, '');
                }
                var sourceFolder = program.args[0];
                if (!file_engine_1.default.existsSync(sourceFolder)) {
                    logger_1.logger.error("Provided source folder " + sourceFolder + " was not found in the current directory");
                    process.exit(1);
                }
                else {
                    logger_1.logger.info('Using provided source folder');
                    if (!file_engine_1.default.existsSync(configuration_1.default.mainData.tsconfig)) {
                        logger_1.logger.error("\"" + configuration_1.default.mainData.tsconfig + "\" file was not found in the current directory");
                        process.exit(1);
                    }
                    else {
                        var _file = path.join(path.join(process.cwd(), path.dirname(configuration_1.default.mainData.tsconfig)), path.basename(configuration_1.default.mainData.tsconfig));
                        // use the current directory of tsconfig.json as a working directory
                        cwd = _file
                            .split(path.sep)
                            .slice(0, -1)
                            .join(path.sep);
                        logger_1.logger.info('Using tsconfig file ', _file);
                        var tsConfigFile = utils_1.readConfig(_file);
                        scannedFiles = tsConfigFile.files;
                        if (scannedFiles) {
                            scannedFiles = utils_1.handlePath(scannedFiles, cwd);
                        }
                        if (typeof scannedFiles === 'undefined') {
                            excludeFiles = tsConfigFile.exclude || [];
                            includeFiles = tsConfigFile.include || [];
                            scannedFiles = [];
                            var excludeParser_2 = new parser_util_class_1.ParserUtil(), includeParser_2 = new parser_util_class_1.ParserUtil();
                            excludeParser_2.init(excludeFiles, cwd);
                            includeParser_2.init(includeFiles, cwd);
                            var startCwd = sourceFolder;
                            var excludeParserTestFilesWithCwdDepth = excludeParser_2.testFilesWithCwdDepth();
                            if (!excludeParserTestFilesWithCwdDepth.status) {
                                startCwd = excludeParser_2.updateCwd(cwd, excludeParserTestFilesWithCwdDepth.level);
                            }
                            var includeParserTestFilesWithCwdDepth = includeParser_2.testFilesWithCwdDepth();
                            if (!includeParser_2.testFilesWithCwdDepth().status) {
                                startCwd = includeParser_2.updateCwd(cwd, includeParserTestFilesWithCwdDepth.level);
                            }
                            var finder = require('findit2')(path.resolve(startCwd));
                            finder.on('directory', function (dir, stat, stop) {
                                var base = path.basename(dir);
                                if (base === '.git' || base === 'node_modules') {
                                    stop();
                                }
                            });
                            finder.on('file', function (file, stat) {
                                if (/(spec|\.d)\.ts/.test(file)) {
                                    logger_1.logger.warn('Ignoring', file);
                                }
                                else if (excludeParser_2.testFile(file)) {
                                    logger_1.logger.warn('Excluding', file);
                                }
                                else if (includeFiles.length > 0) {
                                    /**
                                     * If include provided in tsconfig, use only this source,
                                     * and not files found with global findit scan in working directory
                                     */
                                    if (path.extname(file) === '.ts' &&
                                        includeParser_2.testFile(file)) {
                                        logger_1.logger.debug('Including', file);
                                        scannedFiles.push(file);
                                    }
                                    else {
                                        if (path.extname(file) === '.ts') {
                                            logger_1.logger.warn('Excluding', file);
                                        }
                                    }
                                }
                                else {
                                    logger_1.logger.debug('Including', file);
                                    scannedFiles.push(file);
                                }
                            });
                            finder.on('end', function () {
                                _super.prototype.setFiles.call(_this, scannedFiles);
                                if (program.coverageTest || program.coverageTestPerFile) {
                                    logger_1.logger.info('Run documentation coverage test');
                                    _super.prototype.testCoverage.call(_this);
                                }
                                else {
                                    _super.prototype.generate.call(_this);
                                }
                            });
                        }
                        else {
                            _super.prototype.setFiles.call(this, scannedFiles);
                            if (program.coverageTest || program.coverageTestPerFile) {
                                logger_1.logger.info('Run documentation coverage test');
                                _super.prototype.testCoverage.call(this);
                            }
                            else {
                                _super.prototype.generate.call(this);
                            }
                        }
                    }
                }
            }
            else {
                logger_1.logger.error('tsconfig.json file was not found, please use -p flag');
                outputHelp();
            }
        }
    };
    return CliApplication;
}(application_1.Application));
exports.CliApplication = CliApplication;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9pbmRleC1jbGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkJBQStCO0FBQy9CLDJCQUE2QjtBQUU3QiwrQ0FBbUM7QUFFbkMsaURBQWdEO0FBQ2hELHFEQUFnRDtBQUNoRCx5REFBbUQ7QUFDbkQseURBQW1EO0FBR25ELHFFQUE4RDtBQUM5RCw2Q0FBcUQ7QUFDckQseUNBQXdDO0FBQ3hDLCtEQUF1RDtBQUN2RCx1Q0FBdUQ7QUFFdkQsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzNDLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbEMsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDdkMsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRXJDLElBQU0scUJBQXFCLEdBQUcsVUFBVSxDQUFDO0FBRXpDLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLFlBQVksQ0FBQztBQUNqQixJQUFJLFlBQVksQ0FBQztBQUNqQixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFeEIsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUUzQjtJQUFvQyxrQ0FBVztJQUEvQzs7SUEwMUJBLENBQUM7SUF6MUJHOztPQUVHO0lBQ08saUNBQVEsR0FBbEI7UUFBQSxpQkFxMUJDO1FBcDFCRyxTQUFTLElBQUksQ0FBQyxHQUFH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T0FBTyxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsbUJBQW1CLEVBQUU7b0NBQ3JELGVBQU0sQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztvQ0FDL0MsaUJBQU0sWUFBWSxZQUFFLENBQUM7aUNBQ3hCO3FDQUFNO29DQUNILGlCQUFNLFFBQVEsWUFBRSxDQUFDO2lDQUNwQjs0QkFDTCxDQUFDLENBQUMsQ0FBQzt5QkFDTjs2QkFBTTs0QkFDSCxpQkFBTSxRQUFRLFlBQUMsWUFBWSxDQUFDLENBQUM7NEJBQzdCLElBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsbUJBQW1CLEVBQUU7Z0NBQ3JELGVBQU0sQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztnQ0FDL0MsaUJBQU0sWUFBWSxXQUFFLENBQUM7NkJBQ3hCO2lDQUFNO2dDQUNILGlCQUFNLFFBQVEsV0FBRSxDQUFDOzZCQUNwQjt5QkFDSjtxQkFDSjtpQkFDSjthQUNKO2lCQUFNO2dCQUNILGVBQU0sQ0FBQyxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztnQkFDckUsVUFBVSxFQUFFLENBQUM7YUFDaEI7U0FDSjtJQUNMLENBQUM7SUFDTCxxQkFBQztBQUFELENBQUMsQUExMUJELENBQW9DLHlCQUFXLEdBMDFCOUM7QUExMUJZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHsgdHMgfSBmcm9tICd0cy1zaW1wbGUtYXN0JztcblxuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICcuL2FwcC9hcHBsaWNhdGlvbic7XG5pbXBvcnQgQ29uZmlndXJhdGlvbiBmcm9tICcuL2FwcC9jb25maWd1cmF0aW9uJztcbmltcG9ydCBGaWxlRW5naW5lIGZyb20gJy4vYXBwL2VuZ2luZXMvZmlsZS5lbmdpbmUnO1xuaW1wb3J0IEkxOG5FbmdpbmUgZnJvbSAnLi9hcHAvZW5naW5lcy9pMThuLmVuZ2luZSc7XG5cbmltcG9ydCB7IENvbmZpZ3VyYXRpb25GaWxlSW50ZXJmYWNlIH0gZnJvbSAnLi9hcHAvaW50ZXJmYWNlcy9jb25maWd1cmF0aW9uLWZpbGUuaW50ZXJmYWNlJztcbmltcG9ydCBBbmd1bGFyVmVyc2lvblV0aWwgZnJvbSAnLi91dGlscy9hbmd1bGFyLXZlcnNpb24udXRpbCc7XG5pbXBvcnQgeyBDT01QT0RPQ19ERUZBVUxUUyB9IGZyb20gJy4vdXRpbHMvZGVmYXVsdHMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHsgUGFyc2VyVXRpbCB9IGZyb20gJy4vdXRpbHMvcGFyc2VyLnV0aWwuY2xhc3MnO1xuaW1wb3J0IHsgaGFuZGxlUGF0aCwgcmVhZENvbmZpZyB9IGZyb20gJy4vdXRpbHMvdXRpbHMnO1xuXG5jb25zdCBjb3NtaWNvbmZpZyA9IHJlcXVpcmUoJ2Nvc21pY29uZmlnJyk7XG5jb25zdCBvcyA9IHJlcXVpcmUoJ29zJyk7XG5jb25zdCBvc05hbWUgPSByZXF1aXJlKCdvcy1uYW1lJyk7XG5jb25zdCBwa2cgPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKTtcbmNvbnN0IHByb2dyYW0gPSByZXF1aXJlKCdjb21tYW5kZXInKTtcblxuY29uc3QgY29zbWljb25maWdNb2R1bGVOYW1lID0gJ2NvbXBvZG9jJztcblxubGV0IHNjYW5uZWRGaWxlcyA9IFtdO1xubGV0IGV4Y2x1ZGVGaWxlcztcbmxldCBpbmNsdWRlRmlsZXM7XG5sZXQgY3dkID0gcHJvY2Vzcy5jd2QoKTtcblxucHJvY2Vzcy5zZXRNYXhMaXN0ZW5lcnMoMCk7XG5cbmV4cG9ydCBjbGFzcyBDbGlBcHBsaWNhdGlvbiBleHRlbmRzIEFwcGxpY2F0aW9uIHtcbiAgICAvKipcbiAgICAgKiBSdW4gY29tcG9kb2MgZnJvbSB0aGUgY29tbWFuZCBsaW5lLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZW5lcmF0ZSgpOiBhbnkge1xuICAgICAgICBmdW5jdGlvbiBsaXN0KHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbC5zcGxpdCgnLCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvZ3JhbVxuICAgICAgICAgICAgLnZlcnNpb24ocGtnLnZlcnNpb24pXG4gICAgICAgICAgICAudXNhZ2UoJzxzcmM+IFtvcHRpb25zXScpXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctYywgLS1jb25maWcgW2NvbmZpZ10nLFxuICAgICAgICAgICAgICAgICdBIGNvbmZpZ3VyYXRpb24gZmlsZSA6IC5jb21wb2RvY3JjLCAuY29tcG9kb2NyYy5qc29uLCAuY29tcG9kb2NyYy55YW1sIG9yIGNvbXBvZG9jIHByb3BlcnR5IGluIHBhY2thZ2UuanNvbidcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oJy1wLCAtLXRzY29uZmlnIFtjb25maWddJywgJ0EgdHNjb25maWcuanNvbiBmaWxlJylcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy1kLCAtLW91dHB1dCBbZm9sZGVyXScsXG4gICAgICAgICAgICAgICAgJ1doZXJlIHRvIHN0b3JlIHRoZSBnZW5lcmF0ZWQgZG9jdW1lbnRhdGlvbicsXG4gICAgICAgICAgICAgICAgQ09NUE9ET0NfREVGQVVMVFMuZm9sZGVyXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKCcteSwgLS1leHRUaGVtZSBbZmlsZV0nLCAnRXh0ZXJuYWwgc3R5bGluZyB0aGVtZSBmaWxlJylcbiAgICAgICAgICAgIC5vcHRpb24oJy1uLCAtLW5hbWUgW25hbWVdJywgJ1RpdGxlIGRvY3VtZW50YXRpb24nLCBDT01QT0RPQ19ERUZBVUxUUy50aXRsZSlcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy1hLCAtLWFzc2V0c0ZvbGRlciBbZm9sZGVyXScsXG4gICAgICAgICAgICAgICAgJ0V4dGVybmFsIGFzc2V0cyBmb2xkZXIgdG8gY29weSBpbiBnZW5lcmF0ZWQgZG9jdW1lbnRhdGlvbiBmb2xkZXInXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKCctbywgLS1vcGVuIFt2YWx1ZV0nLCAnT3BlbiB0aGUgZ2VuZXJhdGVkIGRvY3VtZW50YXRpb24nKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLXQsIC0tc2lsZW50JyxcbiAgICAgICAgICAgICAgICBcIkluIHNpbGVudCBtb2RlLCBsb2cgbWVzc2FnZXMgYXJlbid0IGxvZ2dlZCBpbiB0aGUgY29uc29sZVwiLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctcywgLS1zZXJ2ZScsXG4gICAgICAgICAgICAgICAgJ1NlcnZlIGdlbmVyYXRlZCBkb2N1bWVudGF0aW9uIChkZWZhdWx0IGh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC8pJyxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbignLXIsIC0tcG9ydCBbcG9ydF0nLCAnQ2hhbmdlIGRlZmF1bHQgc2VydmluZyBwb3J0JywgQ09NUE9ET0NfREVGQVVMVFMucG9ydClcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy13LCAtLXdhdGNoJyxcbiAgICAgICAgICAgICAgICAnV2F0Y2ggc291cmNlIGZpbGVzIGFmdGVyIHNlcnZlIGFuZCBmb3JjZSBkb2N1bWVudGF0aW9uIHJlYnVpbGQnLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctZSwgLS1leHBvcnRGb3JtYXQgW2Zvcm1hdF0nLFxuICAgICAgICAgICAgICAgICdFeHBvcnQgaW4gc3BlY2lmaWVkIGZvcm1hdCAoanNvbiwgaHRtbCknLFxuICAgICAgICAgICAgICAgIENPTVBPRE9DX0RFRkFVTFRTLmV4cG9ydEZvcm1hdFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbignLS1maWxlcyBbZmlsZXNdJywgJ0ZpbGVzIHByb3ZpZGVkIGJ5IGV4dGVybmFsIHRvb2wsIHVzZWQgZm9yIGNvdmVyYWdlIHRlc3QnKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS1sYW5ndWFnZSBbbGFuZ3VhZ2VdJyxcbiAgICAgICAgICAgICAgICAnTGFuZ3VhZ2UgdXNlZCBmb3IgdGhlIGdlbmVyYXRlZCBkb2N1bWVudGF0aW9uIChlbi1VUywgZnItRlIsIHpoLUNOLCBwdC1CUiknLFxuICAgICAgICAgICAgICAgIENPTVBPRE9DX0RFRkFVTFRTLmxhbmd1YWdlXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLXRoZW1lIFt0aGVtZV0nLFxuICAgICAgICAgICAgICAgIFwiQ2hvb3NlIG9uZSBvZiBhdmFpbGFibGUgdGhlbWVzLCBkZWZhdWx0IGlzICdnaXRib29rJyAobGFyYXZlbCwgb3JpZ2luYWwsIG1hdGVyaWFsLCBwb3N0bWFyaywgcmVhZHRoZWRvY3MsIHN0cmlwZSwgdmFncmFudClcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS1oaWRlR2VuZXJhdG9yJyxcbiAgICAgICAgICAgICAgICAnRG8gbm90IHByaW50IHRoZSBDb21wb2RvYyBsaW5rIGF0IHRoZSBib3R0b20gb2YgdGhlIHBhZ2UnLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLXRvZ2dsZU1lbnVJdGVtcyA8aXRlbXM+JyxcbiAgICAgICAgICAgICAgICBcIkNsb3NlIGJ5IGRlZmF1bHQgaXRlbXMgaW4gdGhlIG1lbnUgdmFsdWVzIDogWydhbGwnXSBvciBvbmUgb2YgdGhlc2UgWydtb2R1bGVzJywnY29tcG9uZW50cycsJ2RpcmVjdGl2ZXMnLCdjbGFzc2VzJywnaW5qZWN0YWJsZXMnLCdpbnRlcmZhY2VzJywncGlwZXMnLCdhZGRpdGlvbmFsUGFnZXMnXVwiLFxuICAgICAgICAgICAgICAgIGxpc3QsXG4gICAgICAgICAgICAgICAgQ09NUE9ET0NfREVGQVVMVFMudG9nZ2xlTWVudUl0ZW1zXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLW5hdlRhYkNvbmZpZyA8dGFiIGNvbmZpZ3M+JyxcbiAgICAgICAgICAgICAgICBgTGlzdCBuYXZpZ2F0aW9uIHRhYiBvYmplY3RzIGluIHRoZSBkZXNpcmVkIG9yZGVyIHdpdGggdHdvIHN0cmluZyBwcm9wZXJ0aWVzIChcImlkXCIgYW5kIFwibGFiZWxcIikuIFxcXG5Eb3VibGUtcXVvdGVzIG11c3QgYmUgZXNjYXBlZCB3aXRoICdcXFxcJy4gXFxcbkF2YWlsYWJsZSB0YWIgSURzIGFyZSBcImluZm9cIiwgXCJyZWFkbWVcIiwgXCJzb3VyY2VcIiwgXCJ0ZW1wbGF0ZURhdGFcIiwgXCJzdHlsZURhdGFcIiwgXCJ0cmVlXCIsIGFuZCBcImV4YW1wbGVcIi4gXFxcbk5vdGU6IENlcnRhaW4gdGFicyB3aWxsIG9ubHkgYmUgc2hvd24gaWYgYXBwbGljYWJsZSB0byBhIGdpdmVuIGRlcGVuZGVuY3lgLFxuICAgICAgICAgICAgICAgIGxpc3QsXG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoQ09NUE9ET0NfREVGQVVMVFMubmF2VGFiQ29uZmlnKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS10ZW1wbGF0ZXMgW2ZvbGRlcl0nLFxuICAgICAgICAgICAgICAgICdQYXRoIHRvIGRpcmVjdG9yeSBvZiBIYW5kbGViYXJzIHRlbXBsYXRlcyB0byBvdmVycmlkZSBidWlsdC1pbiB0ZW1wbGF0ZXMnXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKCctLWluY2x1ZGVzIFtwYXRoXScsICdQYXRoIG9mIGV4dGVybmFsIG1hcmtkb3duIGZpbGVzIHRvIGluY2x1ZGUnKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS1pbmNsdWRlc05hbWUgW25hbWVdJyxcbiAgICAgICAgICAgICAgICAnTmFtZSBvZiBpdGVtIG1lbnUgb2YgZXh0ZXJuYWxzIG1hcmtkb3duIGZpbGVzJyxcbiAgICAgICAgICAgICAgICBDT01QT0RPQ19ERUZBVUxUUy5hZGRpdGlvbmFsRW50cnlOYW1lXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLWNvdmVyYWdlVGVzdCBbdGhyZXNob2xkXScsXG4gICAgICAgICAgICAgICAgJ1Rlc3QgY29tbWFuZCBvZiBkb2N1bWVudGF0aW9uIGNvdmVyYWdlIHdpdGggYSB0aHJlc2hvbGQgKGRlZmF1bHQgNzApJ1xuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS1jb3ZlcmFnZU1pbmltdW1QZXJGaWxlIFttaW5pbXVtXScsXG4gICAgICAgICAgICAgICAgJ1Rlc3QgY29tbWFuZCBvZiBkb2N1bWVudGF0aW9uIGNvdmVyYWdlIHBlciBmaWxlIHdpdGggYSBtaW5pbXVtIChkZWZhdWx0IDApJ1xuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS1jb3ZlcmFnZVRlc3RUaHJlc2hvbGRGYWlsIFt0cnVlfGZhbHNlXScsXG4gICAgICAgICAgICAgICAgJ1Rlc3QgY29tbWFuZCBvZiBkb2N1bWVudGF0aW9uIGNvdmVyYWdlIChnbG9iYWwgb3IgcGVyIGZpbGUpIHdpbGwgZmFpbCB3aXRoIGVycm9yIG9yIGp1c3Qgd2FybiB1c2VyICh0cnVlOiBlcnJvciwgZmFsc2U6IHdhcm4pJyxcbiAgICAgICAgICAgICAgICBDT01QT0RPQ19ERUZBVUxUUy5jb3ZlcmFnZVRlc3RUaHJlc2hvbGRGYWlsXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKCctLWNvdmVyYWdlVGVzdFNob3dPbmx5RmFpbGVkJywgJ0Rpc3BsYXkgb25seSBmYWlsZWQgZmlsZXMgZm9yIGEgY292ZXJhZ2UgdGVzdCcpXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLXVuaXRUZXN0Q292ZXJhZ2UgW2pzb24tc3VtbWFyeV0nLFxuICAgICAgICAgICAgICAgICdUbyBpbmNsdWRlIHVuaXQgdGVzdCBjb3ZlcmFnZSwgc3BlY2lmeSBpc3RhbmJ1bCBKU09OIGNvdmVyYWdlIHN1bW1hcnkgZmlsZSdcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy0tZGlzYWJsZVNvdXJjZUNvZGUnLFxuICAgICAgICAgICAgICAgICdEbyBub3QgYWRkIHNvdXJjZSBjb2RlIHRhYiBhbmQgbGlua3MgdG8gc291cmNlIGNvZGUnLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKCctLWRpc2FibGVEb21UcmVlJywgJ0RvIG5vdCBhZGQgZG9tIHRyZWUgdGFiJywgZmFsc2UpXG4gICAgICAgICAgICAub3B0aW9uKCctLWRpc2FibGVUZW1wbGF0ZVRhYicsICdEbyBub3QgYWRkIHRlbXBsYXRlIHRhYicsIGZhbHNlKVxuICAgICAgICAgICAgLm9wdGlvbignLS1kaXNhYmxlU3R5bGVUYWInLCAnRG8gbm90IGFkZCBzdHlsZSB0YWInLCBmYWxzZSlcbiAgICAgICAgICAgIC5vcHRpb24oJy0tZGlzYWJsZUdyYXBoJywgJ0RvIG5vdCBhZGQgdGhlIGRlcGVuZGVuY3kgZ3JhcGgnLCBmYWxzZSlcbiAgICAgICAgICAgIC5vcHRpb24oJy0tZGlzYWJsZUNvdmVyYWdlJywgJ0RvIG5vdCBhZGQgdGhlIGRvY3VtZW50YXRpb24gY292ZXJhZ2UgcmVwb3J0JywgZmFsc2UpXG4gICAgICAgICAgICAub3B0aW9uKCctLWRpc2FibGVQcml2YXRlJywgJ0RvIG5vdCBzaG93IHByaXZhdGUgaW4gZ2VuZXJhdGVkIGRvY3VtZW50YXRpb24nLCBmYWxzZSlcbiAgICAgICAgICAgIC5vcHRpb24oJy0tZGlzYWJsZVByb3RlY3RlZCcsICdEbyBub3Qgc2hvdyBwcm90ZWN0ZWQgaW4gZ2VuZXJhdGVkIGRvY3VtZW50YXRpb24nLCBmYWxzZSlcbiAgICAgICAgICAgIC5vcHRpb24oJy0tZGlzYWJsZUludGVybmFsJywgJ0RvIG5vdCBzaG93IEBpbnRlcm5hbCBpbiBnZW5lcmF0ZWQgZG9jdW1lbnRhdGlvbicsIGZhbHNlKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS1kaXNhYmxlTGlmZUN5Y2xlSG9va3MnLFxuICAgICAgICAgICAgICAgICdEbyBub3Qgc2hvdyBBbmd1bGFyIGxpZmVjeWNsZSBob29rcyBpbiBnZW5lcmF0ZWQgZG9jdW1lbnRhdGlvbicsXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy0tZGlzYWJsZVJvdXRlc0dyYXBoJyxcbiAgICAgICAgICAgICAgICAnRG8gbm90IGFkZCB0aGUgcm91dGVzIGdyYXBoJyxcbiAgICAgICAgICAgICAgICBDT01QT0RPQ19ERUZBVUxUUy5kaXNhYmxlUm91dGVzR3JhcGhcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oJy0tZGlzYWJsZVNlYXJjaCcsICdEbyBub3QgYWRkIHRoZSBzZWFyY2ggaW5wdXQnLCBmYWxzZSlcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy0tbWluaW1hbCcsXG4gICAgICAgICAgICAgICAgJ01pbmltYWwgbW9kZSB3aXRoIG9ubHkgZG9jdW1lbnRhdGlvbi4gTm8gc2VhcmNoLCBubyBncmFwaCwgbm8gY292ZXJhZ2UuJyxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbignLS1jdXN0b21GYXZpY29uIFtwYXRoXScsICdVc2UgYSBjdXN0b20gZmF2aWNvbicpXG4gICAgICAgICAgICAub3B0aW9uKCctLWN1c3RvbUxvZ28gW3BhdGhdJywgJ1VzZSBhIGN1c3RvbSBsb2dvJylcbiAgICAgICAgICAgIC5vcHRpb24oJy0tZ2FJRCBbaWRdJywgJ0dvb2dsZSBBbmFseXRpY3MgdHJhY2tpbmcgSUQnKVxuICAgICAgICAgICAgLm9wdGlvbignLS1nYVNpdGUgW3NpdGVdJywgJ0dvb2dsZSBBbmFseXRpY3Mgc2l0ZSBuYW1lJywgQ09NUE9ET0NfREVGQVVMVFMuZ2FTaXRlKVxuICAgICAgICAgICAgLnBhcnNlKHByb2Nlc3MuYXJndik7XG5cbiAgICAgICAgbGV0IG91dHB1dEhlbHAgPSAoKSA9PiB7XG4gICAgICAgICAgICBwcm9ncmFtLm91dHB1dEhlbHAoKTtcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjb25maWdFeHBsb3JlciA9IGNvc21pY29uZmlnKGNvc21pY29uZmlnTW9kdWxlTmFtZSk7XG5cbiAgICAgICAgbGV0IGNvbmZpZ0V4cGxvcmVyUmVzdWx0O1xuXG4gICAgICAgIGxldCBjb25maWdGaWxlOiBDb25maWd1cmF0aW9uRmlsZUludGVyZmFjZSA9IHt9O1xuXG4gICAgICAgIGlmIChwcm9ncmFtLmNvbmZpZykge1xuICAgICAgICAgICAgbGV0IGNvbmZpZ0ZpbGVQYXRoID0gcHJvZ3JhbS5jb25maWc7XG4gICAgICAgICAgICBsZXQgdGVzdENvbmZpZ0ZpbGVQYXRoID0gY29uZmlnRmlsZVBhdGgubWF0Y2gocHJvY2Vzcy5jd2QoKSk7XG4gICAgICAgICAgICBpZiAodGVzdENvbmZpZ0ZpbGVQYXRoICYmIHRlc3RDb25maWdGaWxlUGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnRmlsZVBhdGggPSBjb25maWdGaWxlUGF0aC5yZXBsYWNlKHByb2Nlc3MuY3dkKCkgKyBwYXRoLnNlcCwgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uZmlnRXhwbG9yZXJSZXN1bHQgPSBjb25maWdFeHBsb3Jlci5sb2FkU3luYyhwYXRoLnJlc29sdmUoY29uZmlnRmlsZVBhdGgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZ0V4cGxvcmVyUmVzdWx0ID0gY29uZmlnRXhwbG9yZXIuc2VhcmNoU3luYygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25maWdFeHBsb3JlclJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25maWdFeHBsb3JlclJlc3VsdC5jb25maWcgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnRmlsZSA9IGNvbmZpZ0V4cGxvcmVyUmVzdWx0LmNvbmZpZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLm91dHB1dCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQgPSBjb25maWdGaWxlLm91dHB1dDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5vdXRwdXQgJiYgcHJvZ3JhbS5vdXRwdXQgIT09IENPTVBPRE9DX0RFRkFVTFRTLmZvbGRlcikge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQgPSBwcm9ncmFtLm91dHB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmV4dFRoZW1lKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmV4dFRoZW1lID0gY29uZmlnRmlsZS5leHRUaGVtZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5leHRUaGVtZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5leHRUaGVtZSA9IHByb2dyYW0uZXh0VGhlbWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5sYW5ndWFnZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5sYW5ndWFnZSA9IGNvbmZpZ0ZpbGUubGFuZ3VhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0ubGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubGFuZ3VhZ2UgPSBwcm9ncmFtLmxhbmd1YWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUudGhlbWUpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudGhlbWUgPSBjb25maWdGaWxlLnRoZW1lO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLnRoZW1lKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRoZW1lID0gcHJvZ3JhbS50aGVtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLm5hbWUpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZG9jdW1lbnRhdGlvbk1haW5OYW1lID0gY29uZmlnRmlsZS5uYW1lO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLm5hbWUgJiYgcHJvZ3JhbS5uYW1lICE9PSBDT01QT0RPQ19ERUZBVUxUUy50aXRsZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kb2N1bWVudGF0aW9uTWFpbk5hbWUgPSBwcm9ncmFtLm5hbWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5hc3NldHNGb2xkZXIpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYXNzZXRzRm9sZGVyID0gY29uZmlnRmlsZS5hc3NldHNGb2xkZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uYXNzZXRzRm9sZGVyKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmFzc2V0c0ZvbGRlciA9IHByb2dyYW0uYXNzZXRzRm9sZGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUub3Blbikge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vcGVuID0gY29uZmlnRmlsZS5vcGVuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLm9wZW4pIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3BlbiA9IHByb2dyYW0ub3BlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLnRvZ2dsZU1lbnVJdGVtcykge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS50b2dnbGVNZW51SXRlbXMgPSBjb25maWdGaWxlLnRvZ2dsZU1lbnVJdGVtcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBwcm9ncmFtLnRvZ2dsZU1lbnVJdGVtcyAmJlxuICAgICAgICAgICAgcHJvZ3JhbS50b2dnbGVNZW51SXRlbXMgIT09IENPTVBPRE9DX0RFRkFVTFRTLnRvZ2dsZU1lbnVJdGVtc1xuICAgICAgICApIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudG9nZ2xlTWVudUl0ZW1zID0gcHJvZ3JhbS50b2dnbGVNZW51SXRlbXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS50ZW1wbGF0ZXMpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudGVtcGxhdGVzID0gY29uZmlnRmlsZS50ZW1wbGF0ZXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0udGVtcGxhdGVzKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRlbXBsYXRlcyA9IHByb2dyYW0udGVtcGxhdGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUubmF2VGFiQ29uZmlnKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm5hdlRhYkNvbmZpZyA9IGNvbmZpZ0ZpbGUubmF2VGFiQ29uZmlnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHByb2dyYW0ubmF2VGFiQ29uZmlnICYmXG4gICAgICAgICAgICBKU09OLnBhcnNlKHByb2dyYW0ubmF2VGFiQ29uZmlnKS5sZW5ndGggIT09IENPTVBPRE9DX0RFRkFVTFRTLm5hdlRhYkNvbmZpZy5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm5hdlRhYkNvbmZpZyA9IEpTT04ucGFyc2UocHJvZ3JhbS5uYXZUYWJDb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuaW5jbHVkZXMpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW5jbHVkZXMgPSBjb25maWdGaWxlLmluY2x1ZGVzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmluY2x1ZGVzKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmluY2x1ZGVzID0gcHJvZ3JhbS5pbmNsdWRlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmluY2x1ZGVzTmFtZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbmNsdWRlc05hbWUgPSBjb25maWdGaWxlLmluY2x1ZGVzTmFtZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBwcm9ncmFtLmluY2x1ZGVzTmFtZSAmJlxuICAgICAgICAgICAgcHJvZ3JhbS5pbmNsdWRlc05hbWUgIT09IENPTVBPRE9DX0RFRkFVTFRTLmFkZGl0aW9uYWxFbnRyeU5hbWVcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmluY2x1ZGVzTmFtZSA9IHByb2dyYW0uaW5jbHVkZXNOYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuc2lsZW50KSB7XG4gICAgICAgICAgICBsb2dnZXIuc2lsZW50ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uc2lsZW50KSB7XG4gICAgICAgICAgICBsb2dnZXIuc2lsZW50ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5zZXJ2ZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5zZXJ2ZSA9IGNvbmZpZ0ZpbGUuc2VydmU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uc2VydmUpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuc2VydmUgPSBwcm9ncmFtLnNlcnZlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUucG9ydCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5wb3J0ID0gY29uZmlnRmlsZS5wb3J0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLnBvcnQgJiYgcHJvZ3JhbS5wb3J0ICE9PSBDT01QT0RPQ19ERUZBVUxUUy5wb3J0KSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnBvcnQgPSBwcm9ncmFtLnBvcnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS53YXRjaCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS53YXRjaCA9IGNvbmZpZ0ZpbGUud2F0Y2g7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0ud2F0Y2gpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEud2F0Y2ggPSBwcm9ncmFtLndhdGNoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZXhwb3J0Rm9ybWF0KSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmV4cG9ydEZvcm1hdCA9IGNvbmZpZ0ZpbGUuZXhwb3J0Rm9ybWF0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmV4cG9ydEZvcm1hdCAmJiBwcm9ncmFtLmV4cG9ydEZvcm1hdCAhPT0gQ09NUE9ET0NfREVGQVVMVFMuZXhwb3J0Rm9ybWF0KSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmV4cG9ydEZvcm1hdCA9IHByb2dyYW0uZXhwb3J0Rm9ybWF0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuaGlkZUdlbmVyYXRvcikge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5oaWRlR2VuZXJhdG9yID0gY29uZmlnRmlsZS5oaWRlR2VuZXJhdG9yO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmhpZGVHZW5lcmF0b3IpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaGlkZUdlbmVyYXRvciA9IHByb2dyYW0uaGlkZUdlbmVyYXRvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmNvdmVyYWdlVGVzdCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3QgPSB0cnVlO1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RUaHJlc2hvbGQgPVxuICAgICAgICAgICAgICAgIHR5cGVvZiBjb25maWdGaWxlLmNvdmVyYWdlVGVzdCA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICAgICAgPyBwYXJzZUludChjb25maWdGaWxlLmNvdmVyYWdlVGVzdCwgMTApXG4gICAgICAgICAgICAgICAgICAgIDogQ09NUE9ET0NfREVGQVVMVFMuZGVmYXVsdENvdmVyYWdlVGhyZXNob2xkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmNvdmVyYWdlVGVzdCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3QgPSB0cnVlO1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RUaHJlc2hvbGQgPVxuICAgICAgICAgICAgICAgIHR5cGVvZiBwcm9ncmFtLmNvdmVyYWdlVGVzdCA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICAgICAgPyBwYXJzZUludChwcm9ncmFtLmNvdmVyYWdlVGVzdCwgMTApXG4gICAgICAgICAgICAgICAgICAgIDogQ09NUE9ET0NfREVGQVVMVFMuZGVmYXVsdENvdmVyYWdlVGhyZXNob2xkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuY292ZXJhZ2VNaW5pbXVtUGVyRmlsZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RQZXJGaWxlID0gdHJ1ZTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VNaW5pbXVtUGVyRmlsZSA9XG4gICAgICAgICAgICAgICAgdHlwZW9mIGNvbmZpZ0ZpbGUuY292ZXJhZ2VNaW5pbXVtUGVyRmlsZSA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICAgICAgPyBwYXJzZUludChjb25maWdGaWxlLmNvdmVyYWdlTWluaW11bVBlckZpbGUsIDEwKVxuICAgICAgICAgICAgICAgICAgICA6IENPTVBPRE9DX0RFRkFVTFRTLmRlZmF1bHRDb3ZlcmFnZU1pbmltdW1QZXJGaWxlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmNvdmVyYWdlTWluaW11bVBlckZpbGUpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0UGVyRmlsZSA9IHRydWU7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlTWluaW11bVBlckZpbGUgPVxuICAgICAgICAgICAgICAgIHR5cGVvZiBwcm9ncmFtLmNvdmVyYWdlTWluaW11bVBlckZpbGUgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgID8gcGFyc2VJbnQocHJvZ3JhbS5jb3ZlcmFnZU1pbmltdW1QZXJGaWxlLCAxMClcbiAgICAgICAgICAgICAgICAgICAgOiBDT01QT0RPQ19ERUZBVUxUUy5kZWZhdWx0Q292ZXJhZ2VNaW5pbXVtUGVyRmlsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmNvdmVyYWdlVGVzdFRocmVzaG9sZEZhaWwpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkRmFpbCA9XG4gICAgICAgICAgICAgICAgY29uZmlnRmlsZS5jb3ZlcmFnZVRlc3RUaHJlc2hvbGRGYWlsID09PSAnZmFsc2UnID8gZmFsc2UgOiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmNvdmVyYWdlVGVzdFRocmVzaG9sZEZhaWwpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0VGhyZXNob2xkRmFpbCA9XG4gICAgICAgICAgICAgICAgcHJvZ3JhbS5jb3ZlcmFnZVRlc3RUaHJlc2hvbGRGYWlsID09PSAnZmFsc2UnID8gZmFsc2UgOiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuY292ZXJhZ2VUZXN0U2hvd09ubHlGYWlsZWQpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0U2hvd09ubHlGYWlsZWQgPVxuICAgICAgICAgICAgICAgIGNvbmZpZ0ZpbGUuY292ZXJhZ2VUZXN0U2hvd09ubHlGYWlsZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uY292ZXJhZ2VUZXN0U2hvd09ubHlGYWlsZWQpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VUZXN0U2hvd09ubHlGYWlsZWQgPSBwcm9ncmFtLmNvdmVyYWdlVGVzdFNob3dPbmx5RmFpbGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUudW5pdFRlc3RDb3ZlcmFnZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS51bml0VGVzdENvdmVyYWdlID0gY29uZmlnRmlsZS51bml0VGVzdENvdmVyYWdlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLnVuaXRUZXN0Q292ZXJhZ2UpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudW5pdFRlc3RDb3ZlcmFnZSA9IHByb2dyYW0udW5pdFRlc3RDb3ZlcmFnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmRpc2FibGVTb3VyY2VDb2RlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVTb3VyY2VDb2RlID0gY29uZmlnRmlsZS5kaXNhYmxlU291cmNlQ29kZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5kaXNhYmxlU291cmNlQ29kZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlU291cmNlQ29kZSA9IHByb2dyYW0uZGlzYWJsZVNvdXJjZUNvZGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5kaXNhYmxlRG9tVHJlZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlRG9tVHJlZSA9IGNvbmZpZ0ZpbGUuZGlzYWJsZURvbVRyZWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZGlzYWJsZURvbVRyZWUpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZURvbVRyZWUgPSBwcm9ncmFtLmRpc2FibGVEb21UcmVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZGlzYWJsZVRlbXBsYXRlVGFiKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVUZW1wbGF0ZVRhYiA9IGNvbmZpZ0ZpbGUuZGlzYWJsZVRlbXBsYXRlVGFiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmRpc2FibGVUZW1wbGF0ZVRhYikge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlVGVtcGxhdGVUYWIgPSBwcm9ncmFtLmRpc2FibGVUZW1wbGF0ZVRhYjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmRpc2FibGVTdHlsZVRhYikge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlU3R5bGVUYWIgPSBjb25maWdGaWxlLmRpc2FibGVTdHlsZVRhYjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5kaXNhYmxlU3R5bGVUYWIpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVN0eWxlVGFiID0gcHJvZ3JhbS5kaXNhYmxlU3R5bGVUYWI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5kaXNhYmxlR3JhcGgpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUdyYXBoID0gY29uZmlnRmlsZS5kaXNhYmxlR3JhcGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZGlzYWJsZUdyYXBoKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVHcmFwaCA9IHByb2dyYW0uZGlzYWJsZUdyYXBoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZGlzYWJsZUNvdmVyYWdlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVDb3ZlcmFnZSA9IGNvbmZpZ0ZpbGUuZGlzYWJsZUNvdmVyYWdlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmRpc2FibGVDb3ZlcmFnZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlQ292ZXJhZ2UgPSBwcm9ncmFtLmRpc2FibGVDb3ZlcmFnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmRpc2FibGVQcml2YXRlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVQcml2YXRlID0gY29uZmlnRmlsZS5kaXNhYmxlUHJpdmF0ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5kaXNhYmxlUHJpdmF0ZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlUHJpdmF0ZSA9IHByb2dyYW0uZGlzYWJsZVByaXZhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5kaXNhYmxlUHJvdGVjdGVkKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVQcm90ZWN0ZWQgPSBjb25maWdGaWxlLmRpc2FibGVQcm90ZWN0ZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZGlzYWJsZVByb3RlY3RlZCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlUHJvdGVjdGVkID0gcHJvZ3JhbS5kaXNhYmxlUHJvdGVjdGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZGlzYWJsZUludGVybmFsKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVJbnRlcm5hbCA9IGNvbmZpZ0ZpbGUuZGlzYWJsZUludGVybmFsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmRpc2FibGVJbnRlcm5hbCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlSW50ZXJuYWwgPSBwcm9ncmFtLmRpc2FibGVJbnRlcm5hbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmRpc2FibGVMaWZlQ3ljbGVIb29rcykge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlTGlmZUN5Y2xlSG9va3MgPSBjb25maWdGaWxlLmRpc2FibGVMaWZlQ3ljbGVIb29rcztcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5kaXNhYmxlTGlmZUN5Y2xlSG9va3MpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUxpZmVDeWNsZUhvb2tzID0gcHJvZ3JhbS5kaXNhYmxlTGlmZUN5Y2xlSG9va3M7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5kaXNhYmxlUm91dGVzR3JhcGgpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVJvdXRlc0dyYXBoID0gY29uZmlnRmlsZS5kaXNhYmxlUm91dGVzR3JhcGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZGlzYWJsZVJvdXRlc0dyYXBoKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVSb3V0ZXNHcmFwaCA9IHByb2dyYW0uZGlzYWJsZVJvdXRlc0dyYXBoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZGlzYWJsZVNlYXJjaCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlU2VhcmNoID0gY29uZmlnRmlsZS5kaXNhYmxlU2VhcmNoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmRpc2FibGVTZWFyY2gpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVNlYXJjaCA9IHByb2dyYW0uZGlzYWJsZVNlYXJjaDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLm1pbmltYWwpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVNlYXJjaCA9IHRydWU7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVSb3V0ZXNHcmFwaCA9IHRydWU7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVHcmFwaCA9IHRydWU7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVDb3ZlcmFnZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0ubWluaW1hbCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlU2VhcmNoID0gdHJ1ZTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVJvdXRlc0dyYXBoID0gdHJ1ZTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUdyYXBoID0gdHJ1ZTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUNvdmVyYWdlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmN1c3RvbUZhdmljb24pIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY3VzdG9tRmF2aWNvbiA9IGNvbmZpZ0ZpbGUuY3VzdG9tRmF2aWNvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5jdXN0b21GYXZpY29uKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmN1c3RvbUZhdmljb24gPSBwcm9ncmFtLmN1c3RvbUZhdmljb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5jdXN0b21Mb2dvKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmN1c3RvbUxvZ28gPSBjb25maWdGaWxlLmN1c3RvbUxvZ287XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uY3VzdG9tTG9nbykge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jdXN0b21Mb2dvID0gcHJvZ3JhbS5jdXN0b21Mb2dvO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZ2FJRCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5nYUlEID0gY29uZmlnRmlsZS5nYUlEO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmdhSUQpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZ2FJRCA9IHByb2dyYW0uZ2FJRDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmdhU2l0ZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5nYVNpdGUgPSBjb25maWdGaWxlLmdhU2l0ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5nYVNpdGUgJiYgcHJvZ3JhbS5nYVNpdGUgIT09IENPTVBPRE9DX0RFRkFVTFRTLmdhU2l0ZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5nYVNpdGUgPSBwcm9ncmFtLmdhU2l0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc1dhdGNoaW5nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL3NyYy9iYW5uZXInKSkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwa2cudmVyc2lvbik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgVHlwZVNjcmlwdCB2ZXJzaW9uIHVzZWQgYnkgQ29tcG9kb2MgOiAke3RzLnZlcnNpb259YCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJyk7XG5cbiAgICAgICAgICAgIGlmIChGaWxlRW5naW5lLmV4aXN0c1N5bmMoY3dkICsgcGF0aC5zZXAgKyAncGFja2FnZS5qc29uJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlRGF0YSA9IEZpbGVFbmdpbmUuZ2V0U3luYyhjd2QgKyBwYXRoLnNlcCArICdwYWNrYWdlLmpzb24nKTtcbiAgICAgICAgICAgICAgICBpZiAocGFja2FnZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkRGF0YSA9IEpTT04ucGFyc2UocGFja2FnZURhdGEpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9qZWN0RGV2RGVwZW5kZW5jaWVzID0gcGFyc2VkRGF0YS5kZXZEZXBlbmRlbmNpZXM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0RGV2RGVwZW5kZW5jaWVzICYmIHByb2plY3REZXZEZXBlbmRlbmNpZXMudHlwZXNjcmlwdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdHNQcm9qZWN0VmVyc2lvbiA9IEFuZ3VsYXJWZXJzaW9uVXRpbC5jbGVhblZlcnNpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdERldkRlcGVuZGVuY2llcy50eXBlc2NyaXB0XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFR5cGVTY3JpcHQgdmVyc2lvbiBvZiBjdXJyZW50IHByb2plY3QgOiAke3RzUHJvamVjdFZlcnNpb259YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgTm9kZS5qcyB2ZXJzaW9uIDogJHtwcm9jZXNzLnZlcnNpb259YCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgT3BlcmF0aW5nIHN5c3RlbSA6ICR7b3NOYW1lKG9zLnBsYXRmb3JtKCksIG9zLnJlbGVhc2UoKSl9YCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRXhwbG9yZXJSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnRXhwbG9yZXJSZXN1bHQuY29uZmlnICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBVc2luZyBjb25maWd1cmF0aW9uIGZpbGUgOiAke2NvbmZpZ0V4cGxvcmVyUmVzdWx0LmZpbGVwYXRofWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb25maWdFeHBsb3JlclJlc3VsdCkge1xuICAgICAgICAgICAgbG9nZ2VyLndhcm4oYE5vIGNvbmZpZ3VyYXRpb24gZmlsZSBmb3VuZCwgc3dpdGNoaW5nIHRvIENMSSBmbGFncy5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9ncmFtLmxhbmd1YWdlICYmICFJMThuRW5naW5lLnN1cHBvcnRMYW5ndWFnZShwcm9ncmFtLmxhbmd1YWdlKSkge1xuICAgICAgICAgICAgbG9nZ2VyLndhcm4oXG4gICAgICAgICAgICAgICAgYFRoZSBsYW5ndWFnZSAke3Byb2dyYW0ubGFuZ3VhZ2V9IGlzIG5vdCBhdmFpbGFibGUsIGZhbGxpbmcgYmFjayB0byAke1xuICAgICAgICAgICAgICAgICAgICBJMThuRW5naW5lLmZhbGxiYWNrTGFuZ3VhZ2VcbiAgICAgICAgICAgICAgICB9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9ncmFtLnRzY29uZmlnICYmIHR5cGVvZiBwcm9ncmFtLnRzY29uZmlnID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgUGxlYXNlIHByb3ZpZGUgYSB0c2NvbmZpZyBmaWxlLmApO1xuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUudHNjb25maWcpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcgPSBjb25maWdGaWxlLnRzY29uZmlnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLnRzY29uZmlnKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnID0gcHJvZ3JhbS50c2NvbmZpZztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmZpbGVzKSB7XG4gICAgICAgICAgICBzY2FubmVkRmlsZXMgPSBjb25maWdGaWxlLmZpbGVzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25maWdGaWxlLmV4Y2x1ZGUpIHtcbiAgICAgICAgICAgIGV4Y2x1ZGVGaWxlcyA9IGNvbmZpZ0ZpbGUuZXhjbHVkZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29uZmlnRmlsZS5pbmNsdWRlKSB7XG4gICAgICAgICAgICBpbmNsdWRlRmlsZXMgPSBjb25maWdGaWxlLmluY2x1ZGU7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2sgLS1maWxlcyBhcmd1bWVudCBjYWxsXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBhcmd2ID0gcmVxdWlyZSgnbWluaW1pc3QnKShwcm9jZXNzLmFyZ3Yuc2xpY2UoMikpO1xuICAgICAgICBpZiAoYXJndiAmJiBhcmd2LmZpbGVzKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmhhc0ZpbGVzVG9Db3ZlcmFnZSA9IHRydWU7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3YuZmlsZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgc3VwZXIuc2V0RmlsZXMoW2FyZ3YuZmlsZXNdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VwZXIuc2V0RmlsZXMoYXJndi5maWxlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvZ3JhbS5zZXJ2ZSAmJiAhQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZyAmJiBwcm9ncmFtLm91dHB1dCkge1xuICAgICAgICAgICAgLy8gaWYgLXMgJiAtZCwgc2VydmUgaXRcbiAgICAgICAgICAgIGlmICghRmlsZUVuZ2luZS5leGlzdHNTeW5jKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0KSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgJHtDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dH0gZm9sZGVyIGRvZXNuJ3QgZXhpc3RgKTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICAgICAgICBgU2VydmluZyBkb2N1bWVudGF0aW9uIGZyb20gJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0XG4gICAgICAgICAgICAgICAgICAgIH0gYXQgaHR0cDovLzEyNy4wLjAuMToke3Byb2dyYW0ucG9ydH1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBzdXBlci5ydW5XZWJTZXJ2ZXIocHJvZ3JhbS5vdXRwdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHByb2dyYW0uc2VydmUgJiYgIUNvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcgJiYgIXByb2dyYW0ub3V0cHV0KSB7XG4gICAgICAgICAgICAvLyBpZiBvbmx5IC1zIGZpbmQgLi9kb2N1bWVudGF0aW9uLCBpZiBvayBzZXJ2ZSwgZWxzZSBlcnJvciBwcm92aWRlIC1kXG4gICAgICAgICAgICBpZiAoIUZpbGVFbmdpbmUuZXhpc3RzU3luYyhDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dCkpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ1Byb3ZpZGUgb3V0cHV0IGdlbmVyYXRlZCBmb2xkZXIgd2l0aCAtZCBmbGFnJyk7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcbiAgICAgICAgICAgICAgICAgICAgYFNlcnZpbmcgZG9jdW1lbnRhdGlvbiBmcm9tICR7XG4gICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dFxuICAgICAgICAgICAgICAgICAgICB9IGF0IGh0dHA6Ly8xMjcuMC4wLjE6JHtwcm9ncmFtLnBvcnR9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgc3VwZXIucnVuV2ViU2VydmVyKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmhhc0ZpbGVzVG9Db3ZlcmFnZSkge1xuICAgICAgICAgICAgaWYgKHByb2dyYW0uY292ZXJhZ2VNaW5pbXVtUGVyRmlsZSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdSdW4gZG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSB0ZXN0IGZvciBmaWxlcycpO1xuICAgICAgICAgICAgICAgIHN1cGVyLnRlc3RDb3ZlcmFnZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ01pc3NpbmcgY292ZXJhZ2UgY29uZmlndXJhdGlvbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHByb2dyYW0uaGlkZUdlbmVyYXRvcikge1xuICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaGlkZUdlbmVyYXRvciA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnICYmIHByb2dyYW0uYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiB0c2NvbmZpZyBmaWxlIHByb3ZpZGVkIG9ubHlcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBsZXQgdGVzdFRzQ29uZmlnUGF0aCA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcuaW5kZXhPZihwcm9jZXNzLmN3ZCgpKTtcbiAgICAgICAgICAgICAgICBpZiAodGVzdFRzQ29uZmlnUGF0aCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZyA9IENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuY3dkKCkgKyBwYXRoLnNlcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFGaWxlRW5naW5lLmV4aXN0c1N5bmMoQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZykpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgYFwiJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XCIgZmlsZSB3YXMgbm90IGZvdW5kIGluIHRoZSBjdXJyZW50IGRpcmVjdG9yeWBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBfZmlsZSA9IHBhdGguam9pbihcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBwYXRoLmRpcm5hbWUoQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5iYXNlbmFtZShDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAvLyB1c2UgdGhlIGN1cnJlbnQgZGlyZWN0b3J5IG9mIHRzY29uZmlnLmpzb24gYXMgYSB3b3JraW5nIGRpcmVjdG9yeVxuICAgICAgICAgICAgICAgICAgICBjd2QgPSBfZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KHBhdGguc2VwKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKDAsIC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4ocGF0aC5zZXApO1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnVXNpbmcgdHNjb25maWcgZmlsZSAnLCBfZmlsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRzQ29uZmlnRmlsZSA9IHJlYWRDb25maWcoX2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICBzY2FubmVkRmlsZXMgPSB0c0NvbmZpZ0ZpbGUuZmlsZXM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY2FubmVkRmlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYW5uZWRGaWxlcyA9IGhhbmRsZVBhdGgoc2Nhbm5lZEZpbGVzLCBjd2QpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzY2FubmVkRmlsZXMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlRmlsZXMgPSB0c0NvbmZpZ0ZpbGUuZXhjbHVkZSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVGaWxlcyA9IHRzQ29uZmlnRmlsZS5pbmNsdWRlIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nhbm5lZEZpbGVzID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBleGNsdWRlUGFyc2VyID0gbmV3IFBhcnNlclV0aWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlUGFyc2VyID0gbmV3IFBhcnNlclV0aWwoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZVBhcnNlci5pbml0KGV4Y2x1ZGVGaWxlcywgY3dkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVQYXJzZXIuaW5pdChpbmNsdWRlRmlsZXMsIGN3ZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGFydEN3ZCA9IGN3ZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV4Y2x1ZGVQYXJzZXJUZXN0RmlsZXNXaXRoQ3dkRGVwdGggPSBleGNsdWRlUGFyc2VyLnRlc3RGaWxlc1dpdGhDd2REZXB0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFleGNsdWRlUGFyc2VyVGVzdEZpbGVzV2l0aEN3ZERlcHRoLnN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Q3dkID0gZXhjbHVkZVBhcnNlci51cGRhdGVDd2QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN3ZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZVBhcnNlclRlc3RGaWxlc1dpdGhDd2REZXB0aC5sZXZlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5jbHVkZVBhcnNlclRlc3RGaWxlc1dpdGhDd2REZXB0aCA9IGluY2x1ZGVQYXJzZXIudGVzdEZpbGVzV2l0aEN3ZERlcHRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWluY2x1ZGVQYXJzZXIudGVzdEZpbGVzV2l0aEN3ZERlcHRoKCkuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDd2QgPSBpbmNsdWRlUGFyc2VyLnVwZGF0ZUN3ZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3dkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlUGFyc2VyVGVzdEZpbGVzV2l0aEN3ZERlcHRoLmxldmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmRlciA9IHJlcXVpcmUoJ2ZpbmRpdDInKShzdGFydEN3ZCB8fCAnLicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5kZXIub24oJ2RpcmVjdG9yeScsIGZ1bmN0aW9uKGRpciwgc3RhdCwgc3RvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiYXNlID0gcGF0aC5iYXNlbmFtZShkaXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYXNlID09PSAnLmdpdCcgfHwgYmFzZSA9PT0gJ25vZGVfbW9kdWxlcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5kZXIub24oJ2ZpbGUnLCAoZmlsZSwgc3RhdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvKHNwZWN8XFwuZClcXC50cy8udGVzdChmaWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybignSWdub3JpbmcnLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlUGFyc2VyLnRlc3RGaWxlKGZpbGUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGguZXh0bmFtZShmaWxlKSA9PT0gJy50cydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oJ0V4Y2x1ZGluZycsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5jbHVkZUZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIElmIGluY2x1ZGUgcHJvdmlkZWQgaW4gdHNjb25maWcsIHVzZSBvbmx5IHRoaXMgc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBhbmQgbm90IGZpbGVzIGZvdW5kIHdpdGggZ2xvYmFsIGZpbmRpdCBzY2FuIGluIHdvcmtpbmcgZGlyZWN0b3J5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKGZpbGUpID09PSAnLnRzJyAmJiBpbmNsdWRlUGFyc2VyLnRlc3RGaWxlKGZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoJ0luY2x1ZGluZycsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nhbm5lZEZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKGZpbGUpID09PSAnLnRzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKCdFeGNsdWRpbmcnLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnSW5jbHVkaW5nJywgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYW5uZWRGaWxlcy5wdXNoKGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5kZXIub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5zZXRGaWxlcyhzY2FubmVkRmlsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmFtLmNvdmVyYWdlVGVzdCB8fCBwcm9ncmFtLmNvdmVyYWdlVGVzdFBlckZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1J1biBkb2N1bWVudGF0aW9uIGNvdmVyYWdlIHRlc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIudGVzdENvdmVyYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIuZ2VuZXJhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLnNldEZpbGVzKHNjYW5uZWRGaWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvZ3JhbS5jb3ZlcmFnZVRlc3QgfHwgcHJvZ3JhbS5jb3ZlcmFnZVRlc3RQZXJGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1J1biBkb2N1bWVudGF0aW9uIGNvdmVyYWdlIHRlc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci50ZXN0Q292ZXJhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIuZ2VuZXJhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZyAmJiBwcm9ncmFtLmFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIHRzY29uZmlnIGZpbGUgcHJvdmlkZWQgd2l0aCBzb3VyY2UgZm9sZGVyIGluIGFyZ1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGxldCB0ZXN0VHNDb25maWdQYXRoID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZy5pbmRleE9mKHByb2Nlc3MuY3dkKCkpO1xuICAgICAgICAgICAgICAgIGlmICh0ZXN0VHNDb25maWdQYXRoICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZy5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5jd2QoKSArIHBhdGguc2VwLFxuICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgc291cmNlRm9sZGVyID0gcHJvZ3JhbS5hcmdzWzBdO1xuICAgICAgICAgICAgICAgIGlmICghRmlsZUVuZ2luZS5leGlzdHNTeW5jKHNvdXJjZUZvbGRlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgYFByb3ZpZGVkIHNvdXJjZSBmb2xkZXIgJHtzb3VyY2VGb2xkZXJ9IHdhcyBub3QgZm91bmQgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1VzaW5nIHByb3ZpZGVkIHNvdXJjZSBmb2xkZXInKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIUZpbGVFbmdpbmUuZXhpc3RzU3luYyhDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcIiR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XCIgZmlsZSB3YXMgbm90IGZvdW5kIGluIHRoZSBjdXJyZW50IGRpcmVjdG9yeWBcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgX2ZpbGUgPSBwYXRoLmpvaW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIHBhdGguZGlybmFtZShDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5iYXNlbmFtZShDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVzZSB0aGUgY3VycmVudCBkaXJlY3Rvcnkgb2YgdHNjb25maWcuanNvbiBhcyBhIHdvcmtpbmcgZGlyZWN0b3J5XG4gICAgICAgICAgICAgICAgICAgICAgICBjd2QgPSBfZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdChwYXRoLnNlcClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoMCwgLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4ocGF0aC5zZXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1VzaW5nIHRzY29uZmlnIGZpbGUgJywgX2ZpbGUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHNDb25maWdGaWxlID0gcmVhZENvbmZpZyhfZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FubmVkRmlsZXMgPSB0c0NvbmZpZ0ZpbGUuZmlsZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2Nhbm5lZEZpbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nhbm5lZEZpbGVzID0gaGFuZGxlUGF0aChzY2FubmVkRmlsZXMsIGN3ZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2Nhbm5lZEZpbGVzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVGaWxlcyA9IHRzQ29uZmlnRmlsZS5leGNsdWRlIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVGaWxlcyA9IHRzQ29uZmlnRmlsZS5pbmNsdWRlIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYW5uZWRGaWxlcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV4Y2x1ZGVQYXJzZXIgPSBuZXcgUGFyc2VyVXRpbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlUGFyc2VyID0gbmV3IFBhcnNlclV0aWwoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVQYXJzZXIuaW5pdChleGNsdWRlRmlsZXMsIGN3ZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZVBhcnNlci5pbml0KGluY2x1ZGVGaWxlcywgY3dkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGFydEN3ZCA9IHNvdXJjZUZvbGRlcjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBleGNsdWRlUGFyc2VyVGVzdEZpbGVzV2l0aEN3ZERlcHRoID0gZXhjbHVkZVBhcnNlci50ZXN0RmlsZXNXaXRoQ3dkRGVwdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWV4Y2x1ZGVQYXJzZXJUZXN0RmlsZXNXaXRoQ3dkRGVwdGguc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Q3dkID0gZXhjbHVkZVBhcnNlci51cGRhdGVDd2QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjd2QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlUGFyc2VyVGVzdEZpbGVzV2l0aEN3ZERlcHRoLmxldmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmNsdWRlUGFyc2VyVGVzdEZpbGVzV2l0aEN3ZERlcHRoID0gaW5jbHVkZVBhcnNlci50ZXN0RmlsZXNXaXRoQ3dkRGVwdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWluY2x1ZGVQYXJzZXIudGVzdEZpbGVzV2l0aEN3ZERlcHRoKCkuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Q3dkID0gaW5jbHVkZVBhcnNlci51cGRhdGVDd2QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjd2QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlUGFyc2VyVGVzdEZpbGVzV2l0aEN3ZERlcHRoLmxldmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmRlciA9IHJlcXVpcmUoJ2ZpbmRpdDInKShwYXRoLnJlc29sdmUoc3RhcnRDd2QpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmRlci5vbignZGlyZWN0b3J5JywgZnVuY3Rpb24oZGlyLCBzdGF0LCBzdG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiYXNlID0gcGF0aC5iYXNlbmFtZShkaXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmFzZSA9PT0gJy5naXQnIHx8IGJhc2UgPT09ICdub2RlX21vZHVsZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmRlci5vbignZmlsZScsIChmaWxlLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvKHNwZWN8XFwuZClcXC50cy8udGVzdChmaWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oJ0lnbm9yaW5nJywgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhjbHVkZVBhcnNlci50ZXN0RmlsZShmaWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oJ0V4Y2x1ZGluZycsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluY2x1ZGVGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIElmIGluY2x1ZGUgcHJvdmlkZWQgaW4gdHNjb25maWcsIHVzZSBvbmx5IHRoaXMgc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogYW5kIG5vdCBmaWxlcyBmb3VuZCB3aXRoIGdsb2JhbCBmaW5kaXQgc2NhbiBpbiB3b3JraW5nIGRpcmVjdG9yeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5leHRuYW1lKGZpbGUpID09PSAnLnRzJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVQYXJzZXIudGVzdEZpbGUoZmlsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnSW5jbHVkaW5nJywgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nhbm5lZEZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXRoLmV4dG5hbWUoZmlsZSkgPT09ICcudHMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKCdFeGNsdWRpbmcnLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoJ0luY2x1ZGluZycsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nhbm5lZEZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmRlci5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5zZXRGaWxlcyhzY2FubmVkRmlsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvZ3JhbS5jb3ZlcmFnZVRlc3QgfHwgcHJvZ3JhbS5jb3ZlcmFnZVRlc3RQZXJGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnUnVuIGRvY3VtZW50YXRpb24gY292ZXJhZ2UgdGVzdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIudGVzdENvdmVyYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5nZW5lcmF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLnNldEZpbGVzKHNjYW5uZWRGaWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2dyYW0uY292ZXJhZ2VUZXN0IHx8IHByb2dyYW0uY292ZXJhZ2VUZXN0UGVyRmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnUnVuIGRvY3VtZW50YXRpb24gY292ZXJhZ2UgdGVzdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci50ZXN0Q292ZXJhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5nZW5lcmF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCd0c2NvbmZpZy5qc29uIGZpbGUgd2FzIG5vdCBmb3VuZCwgcGxlYXNlIHVzZSAtcCBmbGFnJyk7XG4gICAgICAgICAgICAgICAgb3V0cHV0SGVscCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIl19