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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2luZGV4LWNsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBK0I7QUFDL0IsMkJBQTZCO0FBRTdCLCtDQUFtQztBQUVuQyxpREFBZ0Q7QUFDaEQscURBQWdEO0FBQ2hELHlEQUFtRDtBQUNuRCx5REFBbUQ7QUFHbkQscUVBQThEO0FBQzlELDZDQUFxRDtBQUNyRCx5Q0FBd0M7QUFDeEMsK0RBQXVEO0FBQ3ZELHVDQUF1RDtBQUV2RCxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDM0MsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNsQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN2QyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFckMsSUFBTSxxQkFBcUIsR0FBRyxVQUFVLENBQUM7QUFFekMsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQUksWUFBWSxDQUFDO0FBQ2pCLElBQUksWUFBWSxDQUFDO0FBQ2pCLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUV4QixPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRTNCO0lBQW9DLGtDQUFXO0lBQS9DOztJQTAxQkEsQ0FBQztJQXoxQkc7O09BRUc7SUFDTyxpQ0FBUSxHQUFsQjtR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LFFBQVEsYUFBQyxZQUFZLENBQUMsQ0FBQztnQ0FDN0IsSUFBSSxPQUFPLENBQUMsWUFBWSxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRTtvQ0FDckQsZUFBTSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO29DQUMvQyxpQkFBTSxZQUFZLFlBQUUsQ0FBQztpQ0FDeEI7cUNBQU07b0NBQ0gsaUJBQU0sUUFBUSxZQUFFLENBQUM7aUNBQ3BCOzRCQUNMLENBQUMsQ0FBQyxDQUFDO3lCQUNOOzZCQUFNOzRCQUNILGlCQUFNLFFBQVEsWUFBQyxZQUFZLENBQUMsQ0FBQzs0QkFDN0IsSUFBSSxPQUFPLENBQUMsWUFBWSxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRTtnQ0FDckQsZUFBTSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO2dDQUMvQyxpQkFBTSxZQUFZLFdBQUUsQ0FBQzs2QkFDeEI7aUNBQU07Z0NBQ0gsaUJBQU0sUUFBUSxXQUFFLENBQUM7NkJBQ3BCO3lCQUNKO3FCQUNKO2lCQUNKO2FBQ0o7aUJBQU07Z0JBQ0gsZUFBTSxDQUFDLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO2dCQUNyRSxVQUFVLEVBQUUsQ0FBQzthQUNoQjtTQUNKO0lBQ0wsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQyxBQTExQkQsQ0FBb0MseUJBQVcsR0EwMUI5QztBQTExQlksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgeyB0cyB9IGZyb20gJ3RzLXNpbXBsZS1hc3QnO1xuXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJy4vYXBwL2FwcGxpY2F0aW9uJztcbmltcG9ydCBDb25maWd1cmF0aW9uIGZyb20gJy4vYXBwL2NvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IEZpbGVFbmdpbmUgZnJvbSAnLi9hcHAvZW5naW5lcy9maWxlLmVuZ2luZSc7XG5pbXBvcnQgSTE4bkVuZ2luZSBmcm9tICcuL2FwcC9lbmdpbmVzL2kxOG4uZW5naW5lJztcblxuaW1wb3J0IHsgQ29uZmlndXJhdGlvbkZpbGVJbnRlcmZhY2UgfSBmcm9tICcuL2FwcC9pbnRlcmZhY2VzL2NvbmZpZ3VyYXRpb24tZmlsZS5pbnRlcmZhY2UnO1xuaW1wb3J0IEFuZ3VsYXJWZXJzaW9uVXRpbCBmcm9tICcuL3V0aWxzL2FuZ3VsYXItdmVyc2lvbi51dGlsJztcbmltcG9ydCB7IENPTVBPRE9DX0RFRkFVTFRTIH0gZnJvbSAnLi91dGlscy9kZWZhdWx0cyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQgeyBQYXJzZXJVdGlsIH0gZnJvbSAnLi91dGlscy9wYXJzZXIudXRpbC5jbGFzcyc7XG5pbXBvcnQgeyBoYW5kbGVQYXRoLCByZWFkQ29uZmlnIH0gZnJvbSAnLi91dGlscy91dGlscyc7XG5cbmNvbnN0IGNvc21pY29uZmlnID0gcmVxdWlyZSgnY29zbWljb25maWcnKTtcbmNvbnN0IG9zID0gcmVxdWlyZSgnb3MnKTtcbmNvbnN0IG9zTmFtZSA9IHJlcXVpcmUoJ29zLW5hbWUnKTtcbmNvbnN0IHBrZyA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpO1xuY29uc3QgcHJvZ3JhbSA9IHJlcXVpcmUoJ2NvbW1hbmRlcicpO1xuXG5jb25zdCBjb3NtaWNvbmZpZ01vZHVsZU5hbWUgPSAnY29tcG9kb2MnO1xuXG5sZXQgc2Nhbm5lZEZpbGVzID0gW107XG5sZXQgZXhjbHVkZUZpbGVzO1xubGV0IGluY2x1ZGVGaWxlcztcbmxldCBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xuXG5wcm9jZXNzLnNldE1heExpc3RlbmVycygwKTtcblxuZXhwb3J0IGNsYXNzIENsaUFwcGxpY2F0aW9uIGV4dGVuZHMgQXBwbGljYXRpb24ge1xuICAgIC8qKlxuICAgICAqIFJ1biBjb21wb2RvYyBmcm9tIHRoZSBjb21tYW5kIGxpbmUuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdlbmVyYXRlKCk6IGFueSB7XG4gICAgICAgIGZ1bmN0aW9uIGxpc3QodmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsLnNwbGl0KCcsJyk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm9ncmFtXG4gICAgICAgICAgICAudmVyc2lvbihwa2cudmVyc2lvbilcbiAgICAgICAgICAgIC51c2FnZSgnPHNyYz4gW29wdGlvbnNdJylcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy1jLCAtLWNvbmZpZyBbY29uZmlnXScsXG4gICAgICAgICAgICAgICAgJ0EgY29uZmlndXJhdGlvbiBmaWxlIDogLmNvbXBvZG9jcmMsIC5jb21wb2RvY3JjLmpzb24sIC5jb21wb2RvY3JjLnlhbWwgb3IgY29tcG9kb2MgcHJvcGVydHkgaW4gcGFja2FnZS5qc29uJ1xuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbignLXAsIC0tdHNjb25maWcgW2NvbmZpZ10nLCAnQSB0c2NvbmZpZy5qc29uIGZpbGUnKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLWQsIC0tb3V0cHV0IFtmb2xkZXJdJyxcbiAgICAgICAgICAgICAgICAnV2hlcmUgdG8gc3RvcmUgdGhlIGdlbmVyYXRlZCBkb2N1bWVudGF0aW9uJyxcbiAgICAgICAgICAgICAgICBDT01QT0RPQ19ERUZBVUxUUy5mb2xkZXJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oJy15LCAtLWV4dFRoZW1lIFtmaWxlXScsICdFeHRlcm5hbCBzdHlsaW5nIHRoZW1lIGZpbGUnKVxuICAgICAgICAgICAgLm9wdGlvbignLW4sIC0tbmFtZSBbbmFtZV0nLCAnVGl0bGUgZG9jdW1lbnRhdGlvbicsIENPTVBPRE9DX0RFRkFVTFRTLnRpdGxlKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLWEsIC0tYXNzZXRzRm9sZGVyIFtmb2xkZXJdJyxcbiAgICAgICAgICAgICAgICAnRXh0ZXJuYWwgYXNzZXRzIGZvbGRlciB0byBjb3B5IGluIGdlbmVyYXRlZCBkb2N1bWVudGF0aW9uIGZvbGRlcidcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oJy1vLCAtLW9wZW4gW3ZhbHVlXScsICdPcGVuIHRoZSBnZW5lcmF0ZWQgZG9jdW1lbnRhdGlvbicpXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctdCwgLS1zaWxlbnQnLFxuICAgICAgICAgICAgICAgIFwiSW4gc2lsZW50IG1vZGUsIGxvZyBtZXNzYWdlcyBhcmVuJ3QgbG9nZ2VkIGluIHRoZSBjb25zb2xlXCIsXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy1zLCAtLXNlcnZlJyxcbiAgICAgICAgICAgICAgICAnU2VydmUgZ2VuZXJhdGVkIGRvY3VtZW50YXRpb24gKGRlZmF1bHQgaHR0cDovL2xvY2FsaG9zdDo4MDgwLyknLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKCctciwgLS1wb3J0IFtwb3J0XScsICdDaGFuZ2UgZGVmYXVsdCBzZXJ2aW5nIHBvcnQnLCBDT01QT0RPQ19ERUZBVUxUUy5wb3J0KVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLXcsIC0td2F0Y2gnLFxuICAgICAgICAgICAgICAgICdXYXRjaCBzb3VyY2UgZmlsZXMgYWZ0ZXIgc2VydmUgYW5kIGZvcmNlIGRvY3VtZW50YXRpb24gcmVidWlsZCcsXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy1lLCAtLWV4cG9ydEZvcm1hdCBbZm9ybWF0XScsXG4gICAgICAgICAgICAgICAgJ0V4cG9ydCBpbiBzcGVjaWZpZWQgZm9ybWF0IChqc29uLCBodG1sKScsXG4gICAgICAgICAgICAgICAgQ09NUE9ET0NfREVGQVVMVFMuZXhwb3J0Rm9ybWF0XG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKCctLWZpbGVzIFtmaWxlc10nLCAnRmlsZXMgcHJvdmlkZWQgYnkgZXh0ZXJuYWwgdG9vbCwgdXNlZCBmb3IgY292ZXJhZ2UgdGVzdCcpXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLWxhbmd1YWdlIFtsYW5ndWFnZV0nLFxuICAgICAgICAgICAgICAgICdMYW5ndWFnZSB1c2VkIGZvciB0aGUgZ2VuZXJhdGVkIGRvY3VtZW50YXRpb24gKGVuLVVTLCBmci1GUiwgemgtQ04sIHB0LUJSKScsXG4gICAgICAgICAgICAgICAgQ09NUE9ET0NfREVGQVVMVFMubGFuZ3VhZ2VcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy0tdGhlbWUgW3RoZW1lXScsXG4gICAgICAgICAgICAgICAgXCJDaG9vc2Ugb25lIG9mIGF2YWlsYWJsZSB0aGVtZXMsIGRlZmF1bHQgaXMgJ2dpdGJvb2snIChsYXJhdmVsLCBvcmlnaW5hbCwgbWF0ZXJpYWwsIHBvc3RtYXJrLCByZWFkdGhlZG9jcywgc3RyaXBlLCB2YWdyYW50KVwiXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLWhpZGVHZW5lcmF0b3InLFxuICAgICAgICAgICAgICAgICdEbyBub3QgcHJpbnQgdGhlIENvbXBvZG9jIGxpbmsgYXQgdGhlIGJvdHRvbSBvZiB0aGUgcGFnZScsXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy0tdG9nZ2xlTWVudUl0ZW1zIDxpdGVtcz4nLFxuICAgICAgICAgICAgICAgIFwiQ2xvc2UgYnkgZGVmYXVsdCBpdGVtcyBpbiB0aGUgbWVudSB2YWx1ZXMgOiBbJ2FsbCddIG9yIG9uZSBvZiB0aGVzZSBbJ21vZHVsZXMnLCdjb21wb25lbnRzJywnZGlyZWN0aXZlcycsJ2NsYXNzZXMnLCdpbmplY3RhYmxlcycsJ2ludGVyZmFjZXMnLCdwaXBlcycsJ2FkZGl0aW9uYWxQYWdlcyddXCIsXG4gICAgICAgICAgICAgICAgbGlzdCxcbiAgICAgICAgICAgICAgICBDT01QT0RPQ19ERUZBVUxUUy50b2dnbGVNZW51SXRlbXNcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy0tbmF2VGFiQ29uZmlnIDx0YWIgY29uZmlncz4nLFxuICAgICAgICAgICAgICAgIGBMaXN0IG5hdmlnYXRpb24gdGFiIG9iamVjdHMgaW4gdGhlIGRlc2lyZWQgb3JkZXIgd2l0aCB0d28gc3RyaW5nIHByb3BlcnRpZXMgKFwiaWRcIiBhbmQgXCJsYWJlbFwiKS4gXFxcbkRvdWJsZS1xdW90ZXMgbXVzdCBiZSBlc2NhcGVkIHdpdGggJ1xcXFwnLiBcXFxuQXZhaWxhYmxlIHRhYiBJRHMgYXJlIFwiaW5mb1wiLCBcInJlYWRtZVwiLCBcInNvdXJjZVwiLCBcInRlbXBsYXRlRGF0YVwiLCBcInN0eWxlRGF0YVwiLCBcInRyZWVcIiwgYW5kIFwiZXhhbXBsZVwiLiBcXFxuTm90ZTogQ2VydGFpbiB0YWJzIHdpbGwgb25seSBiZSBzaG93biBpZiBhcHBsaWNhYmxlIHRvIGEgZ2l2ZW4gZGVwZW5kZW5jeWAsXG4gICAgICAgICAgICAgICAgbGlzdCxcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShDT01QT0RPQ19ERUZBVUxUUy5uYXZUYWJDb25maWcpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLXRlbXBsYXRlcyBbZm9sZGVyXScsXG4gICAgICAgICAgICAgICAgJ1BhdGggdG8gZGlyZWN0b3J5IG9mIEhhbmRsZWJhcnMgdGVtcGxhdGVzIHRvIG92ZXJyaWRlIGJ1aWx0LWluIHRlbXBsYXRlcydcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oJy0taW5jbHVkZXMgW3BhdGhdJywgJ1BhdGggb2YgZXh0ZXJuYWwgbWFya2Rvd24gZmlsZXMgdG8gaW5jbHVkZScpXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLWluY2x1ZGVzTmFtZSBbbmFtZV0nLFxuICAgICAgICAgICAgICAgICdOYW1lIG9mIGl0ZW0gbWVudSBvZiBleHRlcm5hbHMgbWFya2Rvd24gZmlsZXMnLFxuICAgICAgICAgICAgICAgIENPTVBPRE9DX0RFRkFVTFRTLmFkZGl0aW9uYWxFbnRyeU5hbWVcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy0tY292ZXJhZ2VUZXN0IFt0aHJlc2hvbGRdJyxcbiAgICAgICAgICAgICAgICAnVGVzdCBjb21tYW5kIG9mIGRvY3VtZW50YXRpb24gY292ZXJhZ2Ugd2l0aCBhIHRocmVzaG9sZCAoZGVmYXVsdCA3MCknXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLWNvdmVyYWdlTWluaW11bVBlckZpbGUgW21pbmltdW1dJyxcbiAgICAgICAgICAgICAgICAnVGVzdCBjb21tYW5kIG9mIGRvY3VtZW50YXRpb24gY292ZXJhZ2UgcGVyIGZpbGUgd2l0aCBhIG1pbmltdW0gKGRlZmF1bHQgMCknXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLWNvdmVyYWdlVGVzdFRocmVzaG9sZEZhaWwgW3RydWV8ZmFsc2VdJyxcbiAgICAgICAgICAgICAgICAnVGVzdCBjb21tYW5kIG9mIGRvY3VtZW50YXRpb24gY292ZXJhZ2UgKGdsb2JhbCBvciBwZXIgZmlsZSkgd2lsbCBmYWlsIHdpdGggZXJyb3Igb3IganVzdCB3YXJuIHVzZXIgKHRydWU6IGVycm9yLCBmYWxzZTogd2FybiknLFxuICAgICAgICAgICAgICAgIENPTVBPRE9DX0RFRkFVTFRTLmNvdmVyYWdlVGVzdFRocmVzaG9sZEZhaWxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oJy0tY292ZXJhZ2VUZXN0U2hvd09ubHlGYWlsZWQnLCAnRGlzcGxheSBvbmx5IGZhaWxlZCBmaWxlcyBmb3IgYSBjb3ZlcmFnZSB0ZXN0JylcbiAgICAgICAgICAgIC5vcHRpb24oXG4gICAgICAgICAgICAgICAgJy0tdW5pdFRlc3RDb3ZlcmFnZSBbanNvbi1zdW1tYXJ5XScsXG4gICAgICAgICAgICAgICAgJ1RvIGluY2x1ZGUgdW5pdCB0ZXN0IGNvdmVyYWdlLCBzcGVjaWZ5IGlzdGFuYnVsIEpTT04gY292ZXJhZ2Ugc3VtbWFyeSBmaWxlJ1xuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS1kaXNhYmxlU291cmNlQ29kZScsXG4gICAgICAgICAgICAgICAgJ0RvIG5vdCBhZGQgc291cmNlIGNvZGUgdGFiIGFuZCBsaW5rcyB0byBzb3VyY2UgY29kZScsXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5vcHRpb24oJy0tZGlzYWJsZURvbVRyZWUnLCAnRG8gbm90IGFkZCBkb20gdHJlZSB0YWInLCBmYWxzZSlcbiAgICAgICAgICAgIC5vcHRpb24oJy0tZGlzYWJsZVRlbXBsYXRlVGFiJywgJ0RvIG5vdCBhZGQgdGVtcGxhdGUgdGFiJywgZmFsc2UpXG4gICAgICAgICAgICAub3B0aW9uKCctLWRpc2FibGVTdHlsZVRhYicsICdEbyBub3QgYWRkIHN0eWxlIHRhYicsIGZhbHNlKVxuICAgICAgICAgICAgLm9wdGlvbignLS1kaXNhYmxlR3JhcGgnLCAnRG8gbm90IGFkZCB0aGUgZGVwZW5kZW5jeSBncmFwaCcsIGZhbHNlKVxuICAgICAgICAgICAgLm9wdGlvbignLS1kaXNhYmxlQ292ZXJhZ2UnLCAnRG8gbm90IGFkZCB0aGUgZG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSByZXBvcnQnLCBmYWxzZSlcbiAgICAgICAgICAgIC5vcHRpb24oJy0tZGlzYWJsZVByaXZhdGUnLCAnRG8gbm90IHNob3cgcHJpdmF0ZSBpbiBnZW5lcmF0ZWQgZG9jdW1lbnRhdGlvbicsIGZhbHNlKVxuICAgICAgICAgICAgLm9wdGlvbignLS1kaXNhYmxlUHJvdGVjdGVkJywgJ0RvIG5vdCBzaG93IHByb3RlY3RlZCBpbiBnZW5lcmF0ZWQgZG9jdW1lbnRhdGlvbicsIGZhbHNlKVxuICAgICAgICAgICAgLm9wdGlvbignLS1kaXNhYmxlSW50ZXJuYWwnLCAnRG8gbm90IHNob3cgQGludGVybmFsIGluIGdlbmVyYXRlZCBkb2N1bWVudGF0aW9uJywgZmFsc2UpXG4gICAgICAgICAgICAub3B0aW9uKFxuICAgICAgICAgICAgICAgICctLWRpc2FibGVMaWZlQ3ljbGVIb29rcycsXG4gICAgICAgICAgICAgICAgJ0RvIG5vdCBzaG93IEFuZ3VsYXIgbGlmZWN5Y2xlIGhvb2tzIGluIGdlbmVyYXRlZCBkb2N1bWVudGF0aW9uJyxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS1kaXNhYmxlUm91dGVzR3JhcGgnLFxuICAgICAgICAgICAgICAgICdEbyBub3QgYWRkIHRoZSByb3V0ZXMgZ3JhcGgnLFxuICAgICAgICAgICAgICAgIENPTVBPRE9DX0RFRkFVTFRTLmRpc2FibGVSb3V0ZXNHcmFwaFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLm9wdGlvbignLS1kaXNhYmxlU2VhcmNoJywgJ0RvIG5vdCBhZGQgdGhlIHNlYXJjaCBpbnB1dCcsIGZhbHNlKVxuICAgICAgICAgICAgLm9wdGlvbihcbiAgICAgICAgICAgICAgICAnLS1taW5pbWFsJyxcbiAgICAgICAgICAgICAgICAnTWluaW1hbCBtb2RlIHdpdGggb25seSBkb2N1bWVudGF0aW9uLiBObyBzZWFyY2gsIG5vIGdyYXBoLCBubyBjb3ZlcmFnZS4nLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub3B0aW9uKCctLWN1c3RvbUZhdmljb24gW3BhdGhdJywgJ1VzZSBhIGN1c3RvbSBmYXZpY29uJylcbiAgICAgICAgICAgIC5vcHRpb24oJy0tY3VzdG9tTG9nbyBbcGF0aF0nLCAnVXNlIGEgY3VzdG9tIGxvZ28nKVxuICAgICAgICAgICAgLm9wdGlvbignLS1nYUlEIFtpZF0nLCAnR29vZ2xlIEFuYWx5dGljcyB0cmFja2luZyBJRCcpXG4gICAgICAgICAgICAub3B0aW9uKCctLWdhU2l0ZSBbc2l0ZV0nLCAnR29vZ2xlIEFuYWx5dGljcyBzaXRlIG5hbWUnLCBDT01QT0RPQ19ERUZBVUxUUy5nYVNpdGUpXG4gICAgICAgICAgICAucGFyc2UocHJvY2Vzcy5hcmd2KTtcblxuICAgICAgICBsZXQgb3V0cHV0SGVscCA9ICgpID0+IHtcbiAgICAgICAgICAgIHByb2dyYW0ub3V0cHV0SGVscCgpO1xuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNvbmZpZ0V4cGxvcmVyID0gY29zbWljb25maWcoY29zbWljb25maWdNb2R1bGVOYW1lKTtcblxuICAgICAgICBsZXQgY29uZmlnRXhwbG9yZXJSZXN1bHQ7XG5cbiAgICAgICAgbGV0IGNvbmZpZ0ZpbGU6IENvbmZpZ3VyYXRpb25GaWxlSW50ZXJmYWNlID0ge307XG5cbiAgICAgICAgaWYgKHByb2dyYW0uY29uZmlnKSB7XG4gICAgICAgICAgICBsZXQgY29uZmlnRmlsZVBhdGggPSBwcm9ncmFtLmNvbmZpZztcbiAgICAgICAgICAgIGxldCB0ZXN0Q29uZmlnRmlsZVBhdGggPSBjb25maWdGaWxlUGF0aC5tYXRjaChwcm9jZXNzLmN3ZCgpKTtcbiAgICAgICAgICAgIGlmICh0ZXN0Q29uZmlnRmlsZVBhdGggJiYgdGVzdENvbmZpZ0ZpbGVQYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25maWdGaWxlUGF0aCA9IGNvbmZpZ0ZpbGVQYXRoLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSArIHBhdGguc2VwLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25maWdFeHBsb3JlclJlc3VsdCA9IGNvbmZpZ0V4cGxvcmVyLmxvYWRTeW5jKHBhdGgucmVzb2x2ZShjb25maWdGaWxlUGF0aCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnRXhwbG9yZXJSZXN1bHQgPSBjb25maWdFeHBsb3Jlci5zZWFyY2hTeW5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmZpZ0V4cGxvcmVyUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbmZpZ0V4cGxvcmVyUmVzdWx0LmNvbmZpZyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBjb25maWdGaWxlID0gY29uZmlnRXhwbG9yZXJSZXN1bHQuY29uZmlnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUub3V0cHV0KSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dCA9IGNvbmZpZ0ZpbGUub3V0cHV0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLm91dHB1dCAmJiBwcm9ncmFtLm91dHB1dCAhPT0gQ09NUE9ET0NfREVGQVVMVFMuZm9sZGVyKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm91dHB1dCA9IHByb2dyYW0ub3V0cHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZXh0VGhlbWUpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZXh0VGhlbWUgPSBjb25maWdGaWxlLmV4dFRoZW1lO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmV4dFRoZW1lKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmV4dFRoZW1lID0gcHJvZ3JhbS5leHRUaGVtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmxhbmd1YWdlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmxhbmd1YWdlID0gY29uZmlnRmlsZS5sYW5ndWFnZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5sYW5ndWFnZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5sYW5ndWFnZSA9IHByb2dyYW0ubGFuZ3VhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS50aGVtZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS50aGVtZSA9IGNvbmZpZ0ZpbGUudGhlbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0udGhlbWUpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudGhlbWUgPSBwcm9ncmFtLnRoZW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUubmFtZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kb2N1bWVudGF0aW9uTWFpbk5hbWUgPSBjb25maWdGaWxlLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0ubmFtZSAmJiBwcm9ncmFtLm5hbWUgIT09IENPTVBPRE9DX0RFRkFVTFRTLnRpdGxlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRvY3VtZW50YXRpb25NYWluTmFtZSA9IHByb2dyYW0ubmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmFzc2V0c0ZvbGRlcikge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5hc3NldHNGb2xkZXIgPSBjb25maWdGaWxlLmFzc2V0c0ZvbGRlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5hc3NldHNGb2xkZXIpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYXNzZXRzRm9sZGVyID0gcHJvZ3JhbS5hc3NldHNGb2xkZXI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5vcGVuKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLm9wZW4gPSBjb25maWdGaWxlLm9wZW47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0ub3Blbikge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vcGVuID0gcHJvZ3JhbS5vcGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUudG9nZ2xlTWVudUl0ZW1zKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRvZ2dsZU1lbnVJdGVtcyA9IGNvbmZpZ0ZpbGUudG9nZ2xlTWVudUl0ZW1zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHByb2dyYW0udG9nZ2xlTWVudUl0ZW1zICYmXG4gICAgICAgICAgICBwcm9ncmFtLnRvZ2dsZU1lbnVJdGVtcyAhPT0gQ09NUE9ET0NfREVGQVVMVFMudG9nZ2xlTWVudUl0ZW1zXG4gICAgICAgICkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS50b2dnbGVNZW51SXRlbXMgPSBwcm9ncmFtLnRvZ2dsZU1lbnVJdGVtcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLnRlbXBsYXRlcykge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS50ZW1wbGF0ZXMgPSBjb25maWdGaWxlLnRlbXBsYXRlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS50ZW1wbGF0ZXMpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudGVtcGxhdGVzID0gcHJvZ3JhbS50ZW1wbGF0ZXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5uYXZUYWJDb25maWcpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubmF2VGFiQ29uZmlnID0gY29uZmlnRmlsZS5uYXZUYWJDb25maWc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgcHJvZ3JhbS5uYXZUYWJDb25maWcgJiZcbiAgICAgICAgICAgIEpTT04ucGFyc2UocHJvZ3JhbS5uYXZUYWJDb25maWcpLmxlbmd0aCAhPT0gQ09NUE9ET0NfREVGQVVMVFMubmF2VGFiQ29uZmlnLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEubmF2VGFiQ29uZmlnID0gSlNPTi5wYXJzZShwcm9ncmFtLm5hdlRhYkNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5pbmNsdWRlcykge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5pbmNsdWRlcyA9IGNvbmZpZ0ZpbGUuaW5jbHVkZXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uaW5jbHVkZXMpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW5jbHVkZXMgPSBwcm9ncmFtLmluY2x1ZGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuaW5jbHVkZXNOYW1lKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmluY2x1ZGVzTmFtZSA9IGNvbmZpZ0ZpbGUuaW5jbHVkZXNOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHByb2dyYW0uaW5jbHVkZXNOYW1lICYmXG4gICAgICAgICAgICBwcm9ncmFtLmluY2x1ZGVzTmFtZSAhPT0gQ09NUE9ET0NfREVGQVVMVFMuYWRkaXRpb25hbEVudHJ5TmFtZVxuICAgICAgICApIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaW5jbHVkZXNOYW1lID0gcHJvZ3JhbS5pbmNsdWRlc05hbWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5zaWxlbnQpIHtcbiAgICAgICAgICAgIGxvZ2dlci5zaWxlbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5zaWxlbnQpIHtcbiAgICAgICAgICAgIGxvZ2dlci5zaWxlbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLnNlcnZlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnNlcnZlID0gY29uZmlnRmlsZS5zZXJ2ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5zZXJ2ZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5zZXJ2ZSA9IHByb2dyYW0uc2VydmU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5wb3J0KSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnBvcnQgPSBjb25maWdGaWxlLnBvcnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0ucG9ydCAmJiBwcm9ncmFtLnBvcnQgIT09IENPTVBPRE9DX0RFRkFVTFRTLnBvcnQpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEucG9ydCA9IHByb2dyYW0ucG9ydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLndhdGNoKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLndhdGNoID0gY29uZmlnRmlsZS53YXRjaDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS53YXRjaCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS53YXRjaCA9IHByb2dyYW0ud2F0Y2g7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5leHBvcnRGb3JtYXQpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZXhwb3J0Rm9ybWF0ID0gY29uZmlnRmlsZS5leHBvcnRGb3JtYXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZXhwb3J0Rm9ybWF0ICYmIHByb2dyYW0uZXhwb3J0Rm9ybWF0ICE9PSBDT01QT0RPQ19ERUZBVUxUUy5leHBvcnRGb3JtYXQpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZXhwb3J0Rm9ybWF0ID0gcHJvZ3JhbS5leHBvcnRGb3JtYXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5oaWRlR2VuZXJhdG9yKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmhpZGVHZW5lcmF0b3IgPSBjb25maWdGaWxlLmhpZGVHZW5lcmF0b3I7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uaGlkZUdlbmVyYXRvcikge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5oaWRlR2VuZXJhdG9yID0gcHJvZ3JhbS5oaWRlR2VuZXJhdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuY292ZXJhZ2VUZXN0KSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdCA9IHRydWU7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZCA9XG4gICAgICAgICAgICAgICAgdHlwZW9mIGNvbmZpZ0ZpbGUuY292ZXJhZ2VUZXN0ID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICA/IHBhcnNlSW50KGNvbmZpZ0ZpbGUuY292ZXJhZ2VUZXN0LCAxMClcbiAgICAgICAgICAgICAgICAgICAgOiBDT01QT0RPQ19ERUZBVUxUUy5kZWZhdWx0Q292ZXJhZ2VUaHJlc2hvbGQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uY292ZXJhZ2VUZXN0KSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdCA9IHRydWU7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFRocmVzaG9sZCA9XG4gICAgICAgICAgICAgICAgdHlwZW9mIHByb2dyYW0uY292ZXJhZ2VUZXN0ID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICA/IHBhcnNlSW50KHByb2dyYW0uY292ZXJhZ2VUZXN0LCAxMClcbiAgICAgICAgICAgICAgICAgICAgOiBDT01QT0RPQ19ERUZBVUxUUy5kZWZhdWx0Q292ZXJhZ2VUaHJlc2hvbGQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5jb3ZlcmFnZU1pbmltdW1QZXJGaWxlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmNvdmVyYWdlVGVzdFBlckZpbGUgPSB0cnVlO1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZU1pbmltdW1QZXJGaWxlID1cbiAgICAgICAgICAgICAgICB0eXBlb2YgY29uZmlnRmlsZS5jb3ZlcmFnZU1pbmltdW1QZXJGaWxlID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgICA/IHBhcnNlSW50KGNvbmZpZ0ZpbGUuY292ZXJhZ2VNaW5pbXVtUGVyRmlsZSwgMTApXG4gICAgICAgICAgICAgICAgICAgIDogQ09NUE9ET0NfREVGQVVMVFMuZGVmYXVsdENvdmVyYWdlTWluaW11bVBlckZpbGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uY292ZXJhZ2VNaW5pbXVtUGVyRmlsZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RQZXJGaWxlID0gdHJ1ZTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY292ZXJhZ2VNaW5pbXVtUGVyRmlsZSA9XG4gICAgICAgICAgICAgICAgdHlwZW9mIHByb2dyYW0uY292ZXJhZ2VNaW5pbXVtUGVyRmlsZSA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICAgICAgPyBwYXJzZUludChwcm9ncmFtLmNvdmVyYWdlTWluaW11bVBlckZpbGUsIDEwKVxuICAgICAgICAgICAgICAgICAgICA6IENPTVBPRE9DX0RFRkFVTFRTLmRlZmF1bHRDb3ZlcmFnZU1pbmltdW1QZXJGaWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuY292ZXJhZ2VUZXN0VGhyZXNob2xkRmFpbCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RUaHJlc2hvbGRGYWlsID1cbiAgICAgICAgICAgICAgICBjb25maWdGaWxlLmNvdmVyYWdlVGVzdFRocmVzaG9sZEZhaWwgPT09ICdmYWxzZScgPyBmYWxzZSA6IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uY292ZXJhZ2VUZXN0VGhyZXNob2xkRmFpbCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RUaHJlc2hvbGRGYWlsID1cbiAgICAgICAgICAgICAgICBwcm9ncmFtLmNvdmVyYWdlVGVzdFRocmVzaG9sZEZhaWwgPT09ICdmYWxzZScgPyBmYWxzZSA6IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5jb3ZlcmFnZVRlc3RTaG93T25seUZhaWxlZCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RTaG93T25seUZhaWxlZCA9XG4gICAgICAgICAgICAgICAgY29uZmlnRmlsZS5jb3ZlcmFnZVRlc3RTaG93T25seUZhaWxlZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5jb3ZlcmFnZVRlc3RTaG93T25seUZhaWxlZCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jb3ZlcmFnZVRlc3RTaG93T25seUZhaWxlZCA9IHByb2dyYW0uY292ZXJhZ2VUZXN0U2hvd09ubHlGYWlsZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS51bml0VGVzdENvdmVyYWdlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnVuaXRUZXN0Q292ZXJhZ2UgPSBjb25maWdGaWxlLnVuaXRUZXN0Q292ZXJhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0udW5pdFRlc3RDb3ZlcmFnZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS51bml0VGVzdENvdmVyYWdlID0gcHJvZ3JhbS51bml0VGVzdENvdmVyYWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZGlzYWJsZVNvdXJjZUNvZGUpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVNvdXJjZUNvZGUgPSBjb25maWdGaWxlLmRpc2FibGVTb3VyY2VDb2RlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmRpc2FibGVTb3VyY2VDb2RlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVTb3VyY2VDb2RlID0gcHJvZ3JhbS5kaXNhYmxlU291cmNlQ29kZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmRpc2FibGVEb21UcmVlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVEb21UcmVlID0gY29uZmlnRmlsZS5kaXNhYmxlRG9tVHJlZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5kaXNhYmxlRG9tVHJlZSkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlRG9tVHJlZSA9IHByb2dyYW0uZGlzYWJsZURvbVRyZWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5kaXNhYmxlVGVtcGxhdGVUYWIpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVRlbXBsYXRlVGFiID0gY29uZmlnRmlsZS5kaXNhYmxlVGVtcGxhdGVUYWI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZGlzYWJsZVRlbXBsYXRlVGFiKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVUZW1wbGF0ZVRhYiA9IHByb2dyYW0uZGlzYWJsZVRlbXBsYXRlVGFiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZGlzYWJsZVN0eWxlVGFiKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVTdHlsZVRhYiA9IGNvbmZpZ0ZpbGUuZGlzYWJsZVN0eWxlVGFiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmRpc2FibGVTdHlsZVRhYikge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlU3R5bGVUYWIgPSBwcm9ncmFtLmRpc2FibGVTdHlsZVRhYjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmRpc2FibGVHcmFwaCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlR3JhcGggPSBjb25maWdGaWxlLmRpc2FibGVHcmFwaDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5kaXNhYmxlR3JhcGgpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUdyYXBoID0gcHJvZ3JhbS5kaXNhYmxlR3JhcGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5kaXNhYmxlQ292ZXJhZ2UpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUNvdmVyYWdlID0gY29uZmlnRmlsZS5kaXNhYmxlQ292ZXJhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZGlzYWJsZUNvdmVyYWdlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVDb3ZlcmFnZSA9IHByb2dyYW0uZGlzYWJsZUNvdmVyYWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZGlzYWJsZVByaXZhdGUpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVByaXZhdGUgPSBjb25maWdGaWxlLmRpc2FibGVQcml2YXRlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmRpc2FibGVQcml2YXRlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVQcml2YXRlID0gcHJvZ3JhbS5kaXNhYmxlUHJpdmF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmRpc2FibGVQcm90ZWN0ZWQpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVByb3RlY3RlZCA9IGNvbmZpZ0ZpbGUuZGlzYWJsZVByb3RlY3RlZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5kaXNhYmxlUHJvdGVjdGVkKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVQcm90ZWN0ZWQgPSBwcm9ncmFtLmRpc2FibGVQcm90ZWN0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5kaXNhYmxlSW50ZXJuYWwpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUludGVybmFsID0gY29uZmlnRmlsZS5kaXNhYmxlSW50ZXJuYWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZGlzYWJsZUludGVybmFsKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVJbnRlcm5hbCA9IHByb2dyYW0uZGlzYWJsZUludGVybmFsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZGlzYWJsZUxpZmVDeWNsZUhvb2tzKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVMaWZlQ3ljbGVIb29rcyA9IGNvbmZpZ0ZpbGUuZGlzYWJsZUxpZmVDeWNsZUhvb2tzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmRpc2FibGVMaWZlQ3ljbGVIb29rcykge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlTGlmZUN5Y2xlSG9va3MgPSBwcm9ncmFtLmRpc2FibGVMaWZlQ3ljbGVIb29rcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmRpc2FibGVSb3V0ZXNHcmFwaCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlUm91dGVzR3JhcGggPSBjb25maWdGaWxlLmRpc2FibGVSb3V0ZXNHcmFwaDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5kaXNhYmxlUm91dGVzR3JhcGgpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVJvdXRlc0dyYXBoID0gcHJvZ3JhbS5kaXNhYmxlUm91dGVzR3JhcGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5kaXNhYmxlU2VhcmNoKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVTZWFyY2ggPSBjb25maWdGaWxlLmRpc2FibGVTZWFyY2g7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZGlzYWJsZVNlYXJjaCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlU2VhcmNoID0gcHJvZ3JhbS5kaXNhYmxlU2VhcmNoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUubWluaW1hbCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlU2VhcmNoID0gdHJ1ZTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVJvdXRlc0dyYXBoID0gdHJ1ZTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUdyYXBoID0gdHJ1ZTtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZUNvdmVyYWdlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5taW5pbWFsKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVTZWFyY2ggPSB0cnVlO1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlUm91dGVzR3JhcGggPSB0cnVlO1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlR3JhcGggPSB0cnVlO1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlQ292ZXJhZ2UgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuY3VzdG9tRmF2aWNvbikge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5jdXN0b21GYXZpY29uID0gY29uZmlnRmlsZS5jdXN0b21GYXZpY29uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmN1c3RvbUZhdmljb24pIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY3VzdG9tRmF2aWNvbiA9IHByb2dyYW0uY3VzdG9tRmF2aWNvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlLmN1c3RvbUxvZ28pIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuY3VzdG9tTG9nbyA9IGNvbmZpZ0ZpbGUuY3VzdG9tTG9nbztcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvZ3JhbS5jdXN0b21Mb2dvKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmN1c3RvbUxvZ28gPSBwcm9ncmFtLmN1c3RvbUxvZ287XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS5nYUlEKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmdhSUQgPSBjb25maWdGaWxlLmdhSUQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0uZ2FJRCkge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5nYUlEID0gcHJvZ3JhbS5nYUlEO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZ2FTaXRlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmdhU2l0ZSA9IGNvbmZpZ0ZpbGUuZ2FTaXRlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9ncmFtLmdhU2l0ZSAmJiBwcm9ncmFtLmdhU2l0ZSAhPT0gQ09NUE9ET0NfREVGQVVMVFMuZ2FTaXRlKSB7XG4gICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmdhU2l0ZSA9IHByb2dyYW0uZ2FTaXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzV2F0Y2hpbmcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vc3JjL2Jhbm5lcicpKS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBrZy52ZXJzaW9uKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBUeXBlU2NyaXB0IHZlcnNpb24gdXNlZCBieSBDb21wb2RvYyA6ICR7dHMudmVyc2lvbn1gKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcnKTtcblxuICAgICAgICAgICAgaWYgKEZpbGVFbmdpbmUuZXhpc3RzU3luYyhjd2QgKyBwYXRoLnNlcCArICdwYWNrYWdlLmpzb24nKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VEYXRhID0gRmlsZUVuZ2luZS5nZXRTeW5jKGN3ZCArIHBhdGguc2VwICsgJ3BhY2thZ2UuanNvbicpO1xuICAgICAgICAgICAgICAgIGlmIChwYWNrYWdlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWREYXRhID0gSlNPTi5wYXJzZShwYWNrYWdlRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2plY3REZXZEZXBlbmRlbmNpZXMgPSBwYXJzZWREYXRhLmRldkRlcGVuZGVuY2llcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2plY3REZXZEZXBlbmRlbmNpZXMgJiYgcHJvamVjdERldkRlcGVuZGVuY2llcy50eXBlc2NyaXB0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0c1Byb2plY3RWZXJzaW9uID0gQW5ndWxhclZlcnNpb25VdGlsLmNsZWFuVmVyc2lvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0RGV2RGVwZW5kZW5jaWVzLnR5cGVzY3JpcHRcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgVHlwZVNjcmlwdCB2ZXJzaW9uIG9mIGN1cnJlbnQgcHJvamVjdCA6ICR7dHNQcm9qZWN0VmVyc2lvbn1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBOb2RlLmpzIHZlcnNpb24gOiAke3Byb2Nlc3MudmVyc2lvbn1gKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBPcGVyYXRpbmcgc3lzdGVtIDogJHtvc05hbWUob3MucGxhdGZvcm0oKSwgb3MucmVsZWFzZSgpKX1gKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdFeHBsb3JlclJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25maWdFeHBsb3JlclJlc3VsdC5jb25maWcgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYFVzaW5nIGNvbmZpZ3VyYXRpb24gZmlsZSA6ICR7Y29uZmlnRXhwbG9yZXJSZXN1bHQuZmlsZXBhdGh9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNvbmZpZ0V4cGxvcmVyUmVzdWx0KSB7XG4gICAgICAgICAgICBsb2dnZXIud2FybihgTm8gY29uZmlndXJhdGlvbiBmaWxlIGZvdW5kLCBzd2l0Y2hpbmcgdG8gQ0xJIGZsYWdzLmApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb2dyYW0ubGFuZ3VhZ2UgJiYgIUkxOG5FbmdpbmUuc3VwcG9ydExhbmd1YWdlKHByb2dyYW0ubGFuZ3VhZ2UpKSB7XG4gICAgICAgICAgICBsb2dnZXIud2FybihcbiAgICAgICAgICAgICAgICBgVGhlIGxhbmd1YWdlICR7cHJvZ3JhbS5sYW5ndWFnZX0gaXMgbm90IGF2YWlsYWJsZSwgZmFsbGluZyBiYWNrIHRvICR7XG4gICAgICAgICAgICAgICAgICAgIEkxOG5FbmdpbmUuZmFsbGJhY2tMYW5ndWFnZVxuICAgICAgICAgICAgICAgIH1gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb2dyYW0udHNjb25maWcgJiYgdHlwZW9mIHByb2dyYW0udHNjb25maWcgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBQbGVhc2UgcHJvdmlkZSBhIHRzY29uZmlnIGZpbGUuYCk7XG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnRmlsZS50c2NvbmZpZykge1xuICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZyA9IGNvbmZpZ0ZpbGUudHNjb25maWc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2dyYW0udHNjb25maWcpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcgPSBwcm9ncmFtLnRzY29uZmlnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZmlsZXMpIHtcbiAgICAgICAgICAgIHNjYW5uZWRGaWxlcyA9IGNvbmZpZ0ZpbGUuZmlsZXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUuZXhjbHVkZSkge1xuICAgICAgICAgICAgZXhjbHVkZUZpbGVzID0gY29uZmlnRmlsZS5leGNsdWRlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25maWdGaWxlLmluY2x1ZGUpIHtcbiAgICAgICAgICAgIGluY2x1ZGVGaWxlcyA9IGNvbmZpZ0ZpbGUuaW5jbHVkZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVjayAtLWZpbGVzIGFyZ3VtZW50IGNhbGxcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGFyZ3YgPSByZXF1aXJlKCdtaW5pbWlzdCcpKHByb2Nlc3MuYXJndi5zbGljZSgyKSk7XG4gICAgICAgIGlmIChhcmd2ICYmIGFyZ3YuZmlsZXMpIHtcbiAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaGFzRmlsZXNUb0NvdmVyYWdlID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndi5maWxlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBzdXBlci5zZXRGaWxlcyhbYXJndi5maWxlc10pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdXBlci5zZXRGaWxlcyhhcmd2LmZpbGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9ncmFtLnNlcnZlICYmICFDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnICYmIHByb2dyYW0ub3V0cHV0KSB7XG4gICAgICAgICAgICAvLyBpZiAtcyAmIC1kLCBzZXJ2ZSBpdFxuICAgICAgICAgICAgaWYgKCFGaWxlRW5naW5lLmV4aXN0c1N5bmMoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQpKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGAke0NvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0fSBmb2xkZXIgZG9lc24ndCBleGlzdGApO1xuICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oXG4gICAgICAgICAgICAgICAgICAgIGBTZXJ2aW5nIGRvY3VtZW50YXRpb24gZnJvbSAke1xuICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXRcbiAgICAgICAgICAgICAgICAgICAgfSBhdCBodHRwOi8vMTI3LjAuMC4xOiR7cHJvZ3JhbS5wb3J0fWBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHN1cGVyLnJ1bldlYlNlcnZlcihwcm9ncmFtLm91dHB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocHJvZ3JhbS5zZXJ2ZSAmJiAhQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZyAmJiAhcHJvZ3JhbS5vdXRwdXQpIHtcbiAgICAgICAgICAgIC8vIGlmIG9ubHkgLXMgZmluZCAuL2RvY3VtZW50YXRpb24sIGlmIG9rIHNlcnZlLCBlbHNlIGVycm9yIHByb3ZpZGUgLWRcbiAgICAgICAgICAgIGlmICghRmlsZUVuZ2luZS5leGlzdHNTeW5jKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0KSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignUHJvdmlkZSBvdXRwdXQgZ2VuZXJhdGVkIGZvbGRlciB3aXRoIC1kIGZsYWcnKTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICAgICAgICBgU2VydmluZyBkb2N1bWVudGF0aW9uIGZyb20gJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEub3V0cHV0XG4gICAgICAgICAgICAgICAgICAgIH0gYXQgaHR0cDovLzEyNy4wLjAuMToke3Byb2dyYW0ucG9ydH1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBzdXBlci5ydW5XZWJTZXJ2ZXIoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5vdXRwdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEuaGFzRmlsZXNUb0NvdmVyYWdlKSB7XG4gICAgICAgICAgICBpZiAocHJvZ3JhbS5jb3ZlcmFnZU1pbmltdW1QZXJGaWxlKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1J1biBkb2N1bWVudGF0aW9uIGNvdmVyYWdlIHRlc3QgZm9yIGZpbGVzJyk7XG4gICAgICAgICAgICAgICAgc3VwZXIudGVzdENvdmVyYWdlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignTWlzc2luZyBjb3ZlcmFnZSBjb25maWd1cmF0aW9uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocHJvZ3JhbS5oaWRlR2VuZXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5oaWRlR2VuZXJhdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcgJiYgcHJvZ3JhbS5hcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIHRzY29uZmlnIGZpbGUgcHJvdmlkZWQgb25seVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGxldCB0ZXN0VHNDb25maWdQYXRoID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZy5pbmRleE9mKHByb2Nlc3MuY3dkKCkpO1xuICAgICAgICAgICAgICAgIGlmICh0ZXN0VHNDb25maWdQYXRoICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnID0gQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZy5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5jd2QoKSArIHBhdGguc2VwLFxuICAgICAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIUZpbGVFbmdpbmUuZXhpc3RzU3luYyhDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnKSkge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBgXCIke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cIiBmaWxlIHdhcyBub3QgZm91bmQgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IF9maWxlID0gcGF0aC5qb2luKFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIHBhdGguZGlybmFtZShDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoLmJhc2VuYW1lKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHVzZSB0aGUgY3VycmVudCBkaXJlY3Rvcnkgb2YgdHNjb25maWcuanNvbiBhcyBhIHdvcmtpbmcgZGlyZWN0b3J5XG4gICAgICAgICAgICAgICAgICAgIGN3ZCA9IF9maWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQocGF0aC5zZXApXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoMCwgLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICAuam9pbihwYXRoLnNlcCk7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdVc2luZyB0c2NvbmZpZyBmaWxlICcsIF9maWxlKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdHNDb25maWdGaWxlID0gcmVhZENvbmZpZyhfZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIHNjYW5uZWRGaWxlcyA9IHRzQ29uZmlnRmlsZS5maWxlcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjYW5uZWRGaWxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nhbm5lZEZpbGVzID0gaGFuZGxlUGF0aChzY2FubmVkRmlsZXMsIGN3ZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNjYW5uZWRGaWxlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVGaWxlcyA9IHRzQ29uZmlnRmlsZS5leGNsdWRlIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZUZpbGVzID0gdHNDb25maWdGaWxlLmluY2x1ZGUgfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FubmVkRmlsZXMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV4Y2x1ZGVQYXJzZXIgPSBuZXcgUGFyc2VyVXRpbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVQYXJzZXIgPSBuZXcgUGFyc2VyVXRpbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlUGFyc2VyLmluaXQoZXhjbHVkZUZpbGVzLCBjd2QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZVBhcnNlci5pbml0KGluY2x1ZGVGaWxlcywgY3dkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0Q3dkID0gY3dkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXhjbHVkZVBhcnNlclRlc3RGaWxlc1dpdGhDd2REZXB0aCA9IGV4Y2x1ZGVQYXJzZXIudGVzdEZpbGVzV2l0aEN3ZERlcHRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWV4Y2x1ZGVQYXJzZXJUZXN0RmlsZXNXaXRoQ3dkRGVwdGguc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDd2QgPSBleGNsdWRlUGFyc2VyLnVwZGF0ZUN3ZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3dkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlUGFyc2VyVGVzdEZpbGVzV2l0aEN3ZERlcHRoLmxldmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmNsdWRlUGFyc2VyVGVzdEZpbGVzV2l0aEN3ZERlcHRoID0gaW5jbHVkZVBhcnNlci50ZXN0RmlsZXNXaXRoQ3dkRGVwdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5jbHVkZVBhcnNlci50ZXN0RmlsZXNXaXRoQ3dkRGVwdGgoKS5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydEN3ZCA9IGluY2x1ZGVQYXJzZXIudXBkYXRlQ3dkKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjd2QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVQYXJzZXJUZXN0RmlsZXNXaXRoQ3dkRGVwdGgubGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmluZGVyID0gcmVxdWlyZSgnZmluZGl0MicpKHN0YXJ0Q3dkIHx8ICcuJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmRlci5vbignZGlyZWN0b3J5JywgZnVuY3Rpb24oZGlyLCBzdGF0LCBzdG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJhc2UgPSBwYXRoLmJhc2VuYW1lKGRpcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJhc2UgPT09ICcuZ2l0JyB8fCBiYXNlID09PSAnbm9kZV9tb2R1bGVzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmRlci5vbignZmlsZScsIChmaWxlLCBzdGF0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC8oc3BlY3xcXC5kKVxcLnRzLy50ZXN0KGZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKCdJZ25vcmluZycsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVQYXJzZXIudGVzdEZpbGUoZmlsZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5leHRuYW1lKGZpbGUpID09PSAnLnRzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybignRXhjbHVkaW5nJywgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbmNsdWRlRmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogSWYgaW5jbHVkZSBwcm92aWRlZCBpbiB0c2NvbmZpZywgdXNlIG9ubHkgdGhpcyBzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGFuZCBub3QgZmlsZXMgZm91bmQgd2l0aCBnbG9iYWwgZmluZGl0IHNjYW4gaW4gd29ya2luZyBkaXJlY3RvcnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXRoLmV4dG5hbWUoZmlsZSkgPT09ICcudHMnICYmIGluY2x1ZGVQYXJzZXIudGVzdEZpbGUoZmlsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnSW5jbHVkaW5nJywgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FubmVkRmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXRoLmV4dG5hbWUoZmlsZSkgPT09ICcudHMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oJ0V4Y2x1ZGluZycsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdJbmNsdWRpbmcnLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nhbm5lZEZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmRlci5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLnNldEZpbGVzKHNjYW5uZWRGaWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2dyYW0uY292ZXJhZ2VUZXN0IHx8IHByb2dyYW0uY292ZXJhZ2VUZXN0UGVyRmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnUnVuIGRvY3VtZW50YXRpb24gY292ZXJhZ2UgdGVzdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci50ZXN0Q292ZXJhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5nZW5lcmF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIuc2V0RmlsZXMoc2Nhbm5lZEZpbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmFtLmNvdmVyYWdlVGVzdCB8fCBwcm9ncmFtLmNvdmVyYWdlVGVzdFBlckZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnUnVuIGRvY3VtZW50YXRpb24gY292ZXJhZ2UgdGVzdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLnRlc3RDb3ZlcmFnZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5nZW5lcmF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnICYmIHByb2dyYW0uYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogdHNjb25maWcgZmlsZSBwcm92aWRlZCB3aXRoIHNvdXJjZSBmb2xkZXIgaW4gYXJnXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgbGV0IHRlc3RUc0NvbmZpZ1BhdGggPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnLmluZGV4T2YocHJvY2Vzcy5jd2QoKSk7XG4gICAgICAgICAgICAgICAgaWYgKHRlc3RUc0NvbmZpZ1BhdGggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcgPSBDb25maWd1cmF0aW9uLm1haW5EYXRhLnRzY29uZmlnLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmN3ZCgpICsgcGF0aC5zZXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2VGb2xkZXIgPSBwcm9ncmFtLmFyZ3NbMF07XG4gICAgICAgICAgICAgICAgaWYgKCFGaWxlRW5naW5lLmV4aXN0c1N5bmMoc291cmNlRm9sZGVyKSkge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBgUHJvdmlkZWQgc291cmNlIGZvbGRlciAke3NvdXJjZUZvbGRlcn0gd2FzIG5vdCBmb3VuZCBpbiB0aGUgY3VycmVudCBkaXJlY3RvcnlgXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnVXNpbmcgcHJvdmlkZWQgc291cmNlIGZvbGRlcicpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghRmlsZUVuZ2luZS5leGlzdHNTeW5jKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYFwiJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS50c2NvbmZpZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cIiBmaWxlIHdhcyBub3QgZm91bmQgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5YFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBfZmlsZSA9IHBhdGguam9pbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgcGF0aC5kaXJuYW1lKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLmJhc2VuYW1lKENvbmZpZ3VyYXRpb24ubWFpbkRhdGEudHNjb25maWcpXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXNlIHRoZSBjdXJyZW50IGRpcmVjdG9yeSBvZiB0c2NvbmZpZy5qc29uIGFzIGEgd29ya2luZyBkaXJlY3RvcnlcbiAgICAgICAgICAgICAgICAgICAgICAgIGN3ZCA9IF9maWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KHBhdGguc2VwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZSgwLCAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuam9pbihwYXRoLnNlcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnVXNpbmcgdHNjb25maWcgZmlsZSAnLCBfZmlsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0c0NvbmZpZ0ZpbGUgPSByZWFkQ29uZmlnKF9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYW5uZWRGaWxlcyA9IHRzQ29uZmlnRmlsZS5maWxlcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY2FubmVkRmlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FubmVkRmlsZXMgPSBoYW5kbGVQYXRoKHNjYW5uZWRGaWxlcywgY3dkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzY2FubmVkRmlsZXMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZUZpbGVzID0gdHNDb25maWdGaWxlLmV4Y2x1ZGUgfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZUZpbGVzID0gdHNDb25maWdGaWxlLmluY2x1ZGUgfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nhbm5lZEZpbGVzID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXhjbHVkZVBhcnNlciA9IG5ldyBQYXJzZXJVdGlsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVQYXJzZXIgPSBuZXcgUGFyc2VyVXRpbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZVBhcnNlci5pbml0KGV4Y2x1ZGVGaWxlcywgY3dkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlUGFyc2VyLmluaXQoaW5jbHVkZUZpbGVzLCBjd2QpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0Q3dkID0gc291cmNlRm9sZGVyO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV4Y2x1ZGVQYXJzZXJUZXN0RmlsZXNXaXRoQ3dkRGVwdGggPSBleGNsdWRlUGFyc2VyLnRlc3RGaWxlc1dpdGhDd2REZXB0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXhjbHVkZVBhcnNlclRlc3RGaWxlc1dpdGhDd2REZXB0aC5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDd2QgPSBleGNsdWRlUGFyc2VyLnVwZGF0ZUN3ZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN3ZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVQYXJzZXJUZXN0RmlsZXNXaXRoQ3dkRGVwdGgubGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluY2x1ZGVQYXJzZXJUZXN0RmlsZXNXaXRoQ3dkRGVwdGggPSBpbmNsdWRlUGFyc2VyLnRlc3RGaWxlc1dpdGhDd2REZXB0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5jbHVkZVBhcnNlci50ZXN0RmlsZXNXaXRoQ3dkRGVwdGgoKS5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRDd2QgPSBpbmNsdWRlUGFyc2VyLnVwZGF0ZUN3ZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN3ZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVQYXJzZXJUZXN0RmlsZXNXaXRoQ3dkRGVwdGgubGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmluZGVyID0gcmVxdWlyZSgnZmluZGl0MicpKHBhdGgucmVzb2x2ZShzdGFydEN3ZCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluZGVyLm9uKCdkaXJlY3RvcnknLCBmdW5jdGlvbihkaXIsIHN0YXQsIHN0b3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJhc2UgPSBwYXRoLmJhc2VuYW1lKGRpcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiYXNlID09PSAnLmdpdCcgfHwgYmFzZSA9PT0gJ25vZGVfbW9kdWxlcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluZGVyLm9uKCdmaWxlJywgKGZpbGUsIHN0YXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC8oc3BlY3xcXC5kKVxcLnRzLy50ZXN0KGZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybignSWdub3JpbmcnLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChleGNsdWRlUGFyc2VyLnRlc3RGaWxlKGZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybignRXhjbHVkaW5nJywgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5jbHVkZUZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogSWYgaW5jbHVkZSBwcm92aWRlZCBpbiB0c2NvbmZpZywgdXNlIG9ubHkgdGhpcyBzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBhbmQgbm90IGZpbGVzIGZvdW5kIHdpdGggZ2xvYmFsIGZpbmRpdCBzY2FuIGluIHdvcmtpbmcgZGlyZWN0b3J5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLmV4dG5hbWUoZmlsZSkgPT09ICcudHMnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZVBhcnNlci50ZXN0RmlsZShmaWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdJbmNsdWRpbmcnLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FubmVkRmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhdGguZXh0bmFtZShmaWxlKSA9PT0gJy50cycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oJ0V4Y2x1ZGluZycsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnSW5jbHVkaW5nJywgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FubmVkRmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluZGVyLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLnNldEZpbGVzKHNjYW5uZWRGaWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9ncmFtLmNvdmVyYWdlVGVzdCB8fCBwcm9ncmFtLmNvdmVyYWdlVGVzdFBlckZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdSdW4gZG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSB0ZXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci50ZXN0Q292ZXJhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLmdlbmVyYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VwZXIuc2V0RmlsZXMoc2Nhbm5lZEZpbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvZ3JhbS5jb3ZlcmFnZVRlc3QgfHwgcHJvZ3JhbS5jb3ZlcmFnZVRlc3RQZXJGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdSdW4gZG9jdW1lbnRhdGlvbiBjb3ZlcmFnZSB0ZXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLnRlc3RDb3ZlcmFnZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLmdlbmVyYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ3RzY29uZmlnLmpzb24gZmlsZSB3YXMgbm90IGZvdW5kLCBwbGVhc2UgdXNlIC1wIGZsYWcnKTtcbiAgICAgICAgICAgICAgICBvdXRwdXRIZWxwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=