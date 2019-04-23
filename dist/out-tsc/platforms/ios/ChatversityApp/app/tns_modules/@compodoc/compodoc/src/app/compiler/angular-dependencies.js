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
var path = require("path");
var _ = require("lodash");
var ts_simple_ast_1 = require("ts-simple-ast");
var kind_to_type_1 = require("../../utils/kind-to-type");
var logger_1 = require("../../utils/logger");
var utils_1 = require("../../utils/utils");
var components_tree_engine_1 = require("../engines/components-tree.engine");
var framework_dependencies_1 = require("./framework-dependencies");
var imports_util_1 = require("../../utils/imports.util");
var utils_2 = require("../../utils");
var extends_merger_util_1 = require("../../utils/extends-merger.util");
var router_parser_util_1 = require("../../utils/router-parser.util");
var code_generator_1 = require("./angular/code-generator");
var component_dep_factory_1 = require("./angular/deps/component-dep.factory");
var controller_dep_factory_1 = require("./angular/deps/controller-dep.factory");
var directive_dep_factory_1 = require("./angular/deps/directive-dep.factory");
var component_helper_1 = require("./angular/deps/helpers/component-helper");
var js_doc_helper_1 = require("./angular/deps/helpers/js-doc-helper");
var module_helper_1 = require("./angular/deps/helpers/module-helper");
var symbol_helper_1 = require("./angular/deps/helpers/symbol-helper");
var module_dep_factory_1 = require("./angular/deps/module-dep.factory");
var configuration_1 = require("../configuration");
var crypto = require('crypto');
var marked = require('marked');
var ast = new ts_simple_ast_1.default();
// TypeScript reference : https://github.com/Microsoft/TypeScript/blob/master/lib/typescript.d.ts
var AngularDependencies = /** @class */ (function (_super) {
    __extends(AngularDependencies, _super);
    function AngularDependencies(files, options) {
        var _this = _super.call(this, files, options) || this;
        _this.cache = new component_helper_1.ComponentCache();
        _this.moduleHelper = new module_helper_1.ModuleHelper(_this.cache);
        _this.jsDocHelper = new js_doc_helper_1.JsDocHelper();
        _this.symbolHelper = new symbol_helper_1.SymbolHelper();
        _this.jsdocParserUtil = new utils_2.JsdocParserUtil();
        return _this;
    }
    AngularDependencies.prototype.getDependencies = function () {
        var _this = this;
        var deps = {
            modules: [],
            modulesForGraph: [],
            components: [],
            controllers: [],
            injectables: [],
            interceptors: [],
            guards: [],
            pipes: [],
            directives: [],
            routes: [],
            classes: [],
            interfaces: [],
            miscellaneous: {
                variables: [],
                functions: [],
                typealiases: [],
                enumerations: []
            },
            routesTree: undefined
        };
        var sourceFiles = this.program.getSourceFiles() || [];
        sourceFiles.map(function (file) {
            var filePath = file.fileName;
            if (path.extname(filePath) === '.ts' || path.extname(filePath) === '.tsx') {
                if (!configuration_1.default.mainData.angularJSProject && path.extname(filePath) === '.js') {
                    logger_1.logger.info('parsing', filePath);
                    _this.getSourceFileDecorators(file, deps);
                }
                else {
                    if (filePath.lastIndexOf('.d.ts') === -1 &&
                        filePath.lastIndexOf('spec.ts') === -1) {
                        logger_1.logger.info('parsing', filePath);
                        _this.getSourceFileDecorators(file, deps);
                    }
                }
            }
            return deps;
        });
        // End of file scanning
        // Try merging inside the same file declarated variables & modules with imports | exports | declarations | providers
        if (deps.miscellaneous.variables.length > 0) {
            deps.miscellaneous.variables.forEach(function (_variable) {
                var newVar = [];
                (function (_var, _newVar) {
                    // getType pr reconstruire....
                    if (_var.initializer) {
                        if (_var.initializer.elements) {
                            if (_var.initializer.elements.length > 0) {
                                _var.initializer.elements.forEach(function (element) {
                                    if (element.text) {
                                        newVar.push({
                                            name: element.text,
                                            type: _this.symbolHelper.getType(element.text)
                                        });
                                    }
                                });
                            }
                        }
                    }
                })(_variable, newVar);
                var onLink = function (mod) {
                    var process = function (initialArray, _var) {
                        var indexToClean = 0;
                        var found = false;
                        var findVariableInArray = function (el, index, theArray) {
                            if (el.name === _var.name) {
                                indexToClean = index;
                                found = true;
                            }
                        };
                        initialArray.forEach(findVariableInArray);
                        // Clean indexes to replace
                        if (found) {
                            initialArray.splice(indexToClean, 1);
                            // Add variable
                            newVar.forEach(function (newEle) {
                                if (typeof _.find(initialArray, { name: newEle.name }) ===
                                    'undefined') {
                                    initialArray.push(newEle);
                                }
                            });
                        }
                    };
                    process(mod.imports, _variable);
                    process(mod.exports, _variable);
                    process(mod.controllers, _variable);
                    process(mod.declarations, _variable);
                    process(mod.providers, _variable);
                };
                deps.modules.forEach(onLink);
                deps.modulesForGraph.forEach(onLink);
            });
        }
        /**
         * If one thing extends another, merge them, only for internal sources
         * - classes
         * - components
         * - injectables
         * for
         * - inputs
         * - outputs
         * - properties
         * - methods
         */
        deps = extends_merger_util_1.default.merge(deps);
        // RouterParserUtil.printModulesRoutes();
        // RouterParserUtil.printRoutes();
        if (!configuration_1.default.mainData.disableRoutesGraph) {
            router_parser_util_1.default.linkModulesAndRoutes();
            router_parser_util_1.default.constructModulesTree();
            deps.routesTree = router_parser_util_1.default.constructRoutesTree();
        }
        return deps;
    };
    AngularDependencies.prototype.processClass = function (node, file, srcFile, outputSymbols, fileBody) {
        var name = this.getSymboleName(node);
        var IO = this.getClassIO(file, srcFile, node, fileBody);
        var sourceCode = srcFile.getText();
        var hash = crypto
            .createHash('md5')
            .update(sourceCode)
            .digest('hex');
        var deps = {
            name: name,
            id: 'class-' + name + '-' + hash,
            file: file,
            type: 'class',
            sourceCode: srcFile.getText()
        };
        var excludeFromClassArray = false;
        if (IO.constructor) {
            deps.constructorObj = IO.constructor;
        }
        if (IO.properties) {
            deps.properties = IO.properties;
        }
        if (IO.description) {
            deps.description = IO.description;
        }
        if (IO.rawdescription) {
            deps.rawdescription = IO.rawdescription;
        }
        if (IO.methods) {
            deps.methods = IO.methods;
        }
        if (IO.indexSignatures) {
            deps.indexSignatures = IO.indexSignatures;
        }
        if (IO.extends) {
            deps.extends = IO.extends;
        }
        if (IO.jsdoctags && IO.jsdoctags.length > 0) {
            deps.jsdoctags = IO.jsdoctags[0].tags;
        }
        if (IO.accessors) {
            deps.accessors = IO.accessors;
        }
        if (IO.inputs) {
            deps.inputsClass = IO.inputs;
        }
        if (IO.outputs) {
            deps.outputsClass = IO.outputs;
        }
        if (IO.hostBindings) {
            deps.hostBindings = IO.hostBindings;
        }
        if (IO.hostListeners) {
            deps.hostListeners = IO.hostListeners;
        }
        if (configuration_1.default.mainData.disableLifeCycleHooks) {
            deps.methods = utils_1.cleanLifecycleHooksFromMethods(deps.methods);
        }
        if (IO.implements && IO.implements.length > 0) {
            deps.implements = IO.implements;
            if (this.isGuard(IO.implements)) {
                // We don't want the Guard to show up in the Classes menu
                excludeFromClassArray = true;
                deps.type = 'guard';
                outputSymbols.guards.push(deps);
            }
        }
        if (typeof IO.ignore === 'undefined') {
            this.debug(deps);
            if (!excludeFromClassArray) {
                outputSymbols.classes.push(deps);
            }
        }
        else {
            this.ignore(deps);
        }
    };
    AngularDependencies.prototype.getSourceFileDecorators = function (initialSrcFile, outputSymbols) {
        var _this = this;
        var cleaner = (process.cwd() + path.sep).replace(/\\/g, '/');
        var fileName = initialSrcFile.fileName.replace(cleaner, '');
        var scannedFile = initialSrcFile;
        // Search in file for variable statement as routes definitions
        var astFile = typeof ast.getSourceFile(initialSrcFile.fileName) !== 'undefined'
            ? ast.getSourceFile(initialSrcFile.fileName)
            : ast.addExistingSourceFile(initialSrcFile.fileName);
        var variableRoutesStatements = astFile.getVariableStatements();
        var hasRoutesStatements = false;
        if (variableRoutesStatements.length > 0) {
            // Clean file for spread and dynamics inside routes definitions
            variableRoutesStatements.forEach(function (s) {
                var variableDeclarations = s.getDeclarations();
                var len = variableDeclarations.length;
                var i = 0;
                for (i; i < len; i++) {
                    if (variableDeclarations[i].compilerNode.type) {
                        if (variableDeclarations[i].compilerNode.type.typeName &&
                            variableDeclarations[i].compilerNode.type.typeName.text === 'Routes') {
                            hasRoutesStatements = true;
                        }
                    }
                }
            });
        }
        if (hasRoutesStatements && !configuration_1.default.mainData.disableRoutesGraph) {
            // Clean file for spread and dynamics inside routes definitions
            logger_1.logger.info('Analysing routes definitions and clean them if necessary');
            // scannedFile = RouterParserUtil.cleanFileIdentifiers(astFile).compilerNode;
            var firstClean = router_parser_util_1.default.cleanFileSpreads(astFile).compilerNode;
            scannedFile = router_parser_util_1.default.cleanCallExpressions(astFile).compilerNode;
            scannedFile = router_parser_util_1.default.cleanFileDynamics(astFile).compilerNode;
            scannedFile.kind = ts_simple_ast_1.SyntaxKind.SourceFile;
        }
        ts_simple_ast_1.ts.forEachChild(scannedFile, function (initialNode) {
            if (_this.jsDocHelper.hasJSDocInternalTag(fileName, scannedFile, initialNode) &&
                configuration_1.default.mainData.disableInternal) {
                return;
            }
            var parseNode = function (file, srcFile, node, fileBody) {
                var sourceCode = srcFile.getText();
                var hash = crypto
                    .createHash('md5')
                    .update(sourceCode)
                    .digest('hex');
                if (node.decorators) {
                    var classWithCustomDecorator_1 = false;
                    var visitDecorator = function (visitedDecorator, index) {
                        var deps;
                        var metadata = node.decorators;
                        var name = _this.getSymboleName(node);
                        var props = _this.findProperties(visitedDecorator, srcFile);
                        var IO = _this.componentHelper.getComponentIO(file, srcFile, node, fileBody);
                        if (_this.isModule(visitedDecorator)) {
                            var moduleDep = new module_dep_factory_1.ModuleDepFactory(_this.moduleHelper).create(file, srcFile, name, props, IO);
                            if (router_parser_util_1.default.hasRouterModuleInImports(moduleDep.imports)) {
                                router_parser_util_1.default.addModuleWithRoutes(name, _this.moduleHelper.getModuleImportsRaw(props, srcFile), file);
                            }
                            deps = moduleDep;
                            if (typeof IO.ignore === 'undefined') {
                                router_parser_util_1.default.addModule(name, moduleDep.imports);
                                outputSymbols.modules.push(moduleDep);
                                outputSymbols.modulesForGraph.push(moduleDep);
                            }
                        }
                        else if (_this.isComponent(visitedDecorator)) {
                            if (props.length === 0) {
                                return;
                            }
                            var componentDep = new component_dep_factory_1.ComponentDepFactory(_this.componentHelper).create(file, srcFile, name, props, IO);
                            deps = componentDep;
                            if (typeof IO.ignore === 'undefined') {
                                components_tree_engine_1.default.addComponent(componentDep);
                                outputSymbols.components.push(componentDep);
                            }
                        }
                        else if (_this.isController(visitedDecorator)) {
                            var controllerDep = new controller_dep_factory_1.ControllerDepFactory().create(file, srcFile, name, props, IO);
                            deps = controllerDep;
                            if (typeof IO.ignore === 'undefined') {
                                outputSymbols.controllers.push(controllerDep);
                            }
                        }
                        else if (_this.isInjectable(visitedDecorator)) {
                            var injectableDeps = {
                                name: name,
                                id: 'injectable-' + name + '-' + hash,
                                file: file,
                                properties: IO.properties,
                                methods: IO.methods,
                                description: IO.description,
                                sourceCode: srcFile.getText(),
                                exampleUrls: _this.componentHelper.getComponentExampleUrls(srcFile.getText())
                            };
                            if (IO.constructor) {
                                injectableDeps.constructorObj = IO.constructor;
                            }
                            if (IO.jsdoctags && IO.jsdoctags.length > 0) {
                                injectableDeps.jsdoctags = IO.jsdoctags[0].tags;
                            }
                            if (IO.accessors) {
                                injectableDeps.accessors = IO.accessors;
                            }
                            if (IO.extends) {
                                injectableDeps.extends = IO.extends;
                            }
                            deps = injectableDeps;
                            if (typeof IO.ignore === 'undefined') {
                                if (_.includes(IO.implements, 'HttpInterceptor')) {
                                    injectableDeps.type = 'interceptor';
                                    outputSymbols.interceptors.push(injectableDeps);
                                }
                                else if (_this.isGuard(IO.implements)) {
                                    injectableDeps.type = 'guard';
                                    outputSymbols.guards.push(injectableDeps);
                                }
                                else {
                                    injectableDeps.type = 'injectable';
                                    _this.addNewEntityInStore(injectableDeps, outputSymbols.injectables);
                                }
                            }
                        }
                        else if (_this.isPipe(visitedDecorator)) {
                            var pipeDeps = {
                                name: name,
                                id: 'pipe-' + name + '-' + hash,
                                file: file,
                                type: 'pipe',
                                description: IO.description,
                                properties: IO.properties,
                                methods: IO.methods,
                                pure: _this.componentHelper.getComponentPure(props, srcFile),
                                ngname: _this.componentHelper.getComponentName(props, srcFile),
                                sourceCode: srcFile.getText(),
                                exampleUrls: _this.componentHelper.getComponentExampleUrls(srcFile.getText())
                            };
                            if (IO.jsdoctags && IO.jsdoctags.length > 0) {
                                pipeDeps.jsdoctags = IO.jsdoctags[0].tags;
                            }
                            deps = pipeDeps;
                            if (typeof IO.ignore === 'undefined') {
                                outputSymbols.pipes.push(pipeDeps);
                            }
                        }
                        else if (_this.isDirective(visitedDecorator)) {
                            if (props.length === 0) {
                                return;
                            }
                            var directiveDeps = new directive_dep_factory_1.DirectiveDepFactory(_this.componentHelper).create(file, srcFile, name, props, IO);
                            deps = directiveDeps;
                            if (typeof IO.ignore === 'undefined') {
                                outputSymbols.directives.push(directiveDeps);
                            }
                        }
                        else {
                            var hasMultipleDecoratorsWithInternalOne = _this.hasInternalDecorator(node.decorators);
                            // Just a class
                            if (!classWithCustomDecorator_1 &&
                                !hasMultipleDecoratorsWithInternalOne) {
                                classWithCustomDecorator_1 = true;
                                _this.processClass(node, file, srcFile, outputSymbols, fileBody);
                            }
                        }
                        _this.cache.set(name, deps);
                        if (typeof IO.ignore === 'undefined') {
                            _this.debug(deps);
                        }
                        else {
                            _this.ignore(deps);
                        }
                    };
                    var filterByDecorators = function (filteredNode) {
                        if (filteredNode.expression && filteredNode.expression.expression) {
                            var _test = /(NgModule|Component|Injectable|Pipe|Directive)/.test(filteredNode.expression.expression.text);
                            if (!_test && ts_simple_ast_1.ts.isClassDeclaration(node)) {
                                _test = true;
                            }
                            return _test;
                        }
                        if (ts_simple_ast_1.ts.isClassDeclaration(node)) {
                            return true;
                        }
                        return false;
                    };
                    node.decorators.filter(filterByDecorators).forEach(visitDecorator);
                }
                else if (node.symbol) {
                    if (node.symbol.flags === ts_simple_ast_1.ts.SymbolFlags.Class) {
                        _this.processClass(node, file, srcFile, outputSymbols, fileBody);
                    }
                    else if (node.symbol.flags === ts_simple_ast_1.ts.SymbolFlags.Interface) {
                        var name_1 = _this.getSymboleName(node);
                        var IO = _this.getInterfaceIO(file, srcFile, node, fileBody);
                        var interfaceDeps = {
                            name: name_1,
                            id: 'interface-' + name_1 + '-' + hash,
                            file: file,
                            type: 'interface',
                            sourceCode: srcFile.getText()
                        };
                        if (IO.properties) {
                            interfaceDeps.properties = IO.properties;
                        }
                        if (IO.indexSignatures) {
                            interfaceDeps.indexSignatures = IO.indexSignatures;
                        }
                        if (IO.kind) {
                            interfaceDeps.kind = IO.kind;
                        }
                        if (IO.description) {
                            interfaceDeps.description = IO.description;
                        }
                        if (IO.methods) {
                            interfaceDeps.methods = IO.methods;
                        }
                        if (IO.extends) {
                            interfaceDeps.extends = IO.extends;
                        }
                        if (typeof IO.ignore === 'undefined') {
                            _this.debug(interfaceDeps);
                            outputSymbols.interfaces.push(interfaceDeps);
                        }
                        else {
                            _this.ignore(interfaceDeps);
                        }
                    }
                    else if (ts_simple_ast_1.ts.isFunctionDeclaration(node)) {
                        var infos = _this.visitFunctionDeclaration(node);
                        // let tags = this.visitFunctionDeclarationJSDocTags(node);
                        var name_2 = infos.name;
                        var functionDep = {
                            name: name_2,
                            file: file,
                            ctype: 'miscellaneous',
                            subtype: 'function',
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (infos.args) {
                            functionDep.args = infos.args;
                        }
                        if (infos.returnType) {
                            functionDep.returnType = infos.returnType;
                        }
                        if (infos.jsdoctags && infos.jsdoctags.length > 0) {
                            functionDep.jsdoctags = infos.jsdoctags;
                        }
                        if (typeof infos.ignore === 'undefined') {
                            if (!(_this.hasPrivateJSDocTag(functionDep.jsdoctags) &&
                                configuration_1.default.mainData.disablePrivate)) {
                                outputSymbols.miscellaneous.functions.push(functionDep);
                            }
                        }
                    }
                    else if (ts_simple_ast_1.ts.isEnumDeclaration(node)) {
                        var infos = _this.visitEnumDeclaration(node);
                        var name_3 = node.name.text;
                        var enumDeps = {
                            name: name_3,
                            childs: infos,
                            ctype: 'miscellaneous',
                            subtype: 'enum',
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node),
                            file: file
                        };
                        if (!utils_2.isIgnore(node)) {
                            outputSymbols.miscellaneous.enumerations.push(enumDeps);
                        }
                    }
                    else if (ts_simple_ast_1.ts.isTypeAliasDeclaration(node)) {
                        var infos = _this.visitTypeDeclaration(node);
                        var name_4 = infos.name;
                        var typeAliasDeps = {
                            name: name_4,
                            ctype: 'miscellaneous',
                            subtype: 'typealias',
                            rawtype: _this.classHelper.visitType(node),
                            file: file,
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (node.type) {
                            typeAliasDeps.kind = node.type.kind;
                            if (typeAliasDeps.rawtype === '') {
                                typeAliasDeps.rawtype = kind_to_type_1.kindToType(node.type.kind);
                            }
                        }
                        if (!utils_2.isIgnore(node)) {
                            outputSymbols.miscellaneous.typealiases.push(typeAliasDeps);
                        }
                    }
                    else if (ts_simple_ast_1.ts.isModuleDeclaration(node)) {
                        if (node.body) {
                            if (node.body.statements && node.body.statements.length > 0) {
                                node.body.statements.forEach(function (statement) {
                                    return parseNode(file, srcFile, statement, node.body);
                                });
                            }
                        }
                    }
                }
                else {
                    var IO = _this.getRouteIO(file, srcFile, node);
                    if (IO.routes) {
                        var newRoutes = void 0;
                        try {
                            newRoutes = router_parser_util_1.default.cleanRawRouteParsed(IO.routes);
                        }
                        catch (e) {
                            // tslint:disable-next-line:max-line-length
                            logger_1.logger.error('Routes parsing error, maybe a trailing comma or an external variable, trying to fix that later after sources scanning.');
                            newRoutes = IO.routes.replace(/ /gm, '');
                            router_parser_util_1.default.addIncompleteRoute({
                                data: newRoutes,
                                file: file
                            });
                            return true;
                        }
                        outputSymbols.routes = outputSymbols.routes.concat(newRoutes);
                    }
                    if (ts_simple_ast_1.ts.isClassDeclaration(node)) {
                        _this.processClass(node, file, srcFile, outputSymbols, fileBody);
                    }
                    if (ts_simple_ast_1.ts.isExpressionStatement(node) || ts_simple_ast_1.ts.isIfStatement(node)) {
                        var bootstrapModuleReference = 'bootstrapModule';
                        // Find the root module with bootstrapModule call
                        // 1. find a simple call : platformBrowserDynamic().bootstrapModule(AppModule);
                        // 2. or inside a call :
                        // () => {
                        //     platformBrowserDynamic().bootstrapModule(AppModule);
                        // });
                        // 3. with a catch : platformBrowserDynamic().bootstrapModule(AppModule).catch(error => console.error(error));
                        // 4. with parameters : platformBrowserDynamic().bootstrapModule(AppModule, {}).catch(error => console.error(error));
                        // Find recusively in expression nodes one with name 'bootstrapModule'
                        var rootModule_1;
                        var resultNode = void 0;
                        if (srcFile.text.indexOf(bootstrapModuleReference) !== -1) {
                            if (node.expression) {
                                resultNode = _this.findExpressionByNameInExpressions(node.expression, 'bootstrapModule');
                            }
                            if (typeof node.thenStatement !== 'undefined') {
                                if (node.thenStatement.statements &&
                                    node.thenStatement.statements.length > 0) {
                                    var firstStatement = node.thenStatement.statements[0];
                                    resultNode = _this.findExpressionByNameInExpressions(firstStatement.expression, 'bootstrapModule');
                                }
                            }
                            if (!resultNode) {
                                if (node.expression &&
                                    node.expression.arguments &&
                                    node.expression.arguments.length > 0) {
                                    resultNode = _this.findExpressionByNameInExpressionArguments(node.expression.arguments, 'bootstrapModule');
                                }
                            }
                            if (resultNode) {
                                if (resultNode.arguments.length > 0) {
                                    _.forEach(resultNode.arguments, function (argument) {
                                        if (argument.text) {
                                            rootModule_1 = argument.text;
                                        }
                                    });
                                }
                                if (rootModule_1) {
                                    router_parser_util_1.default.setRootModule(rootModule_1);
                                }
                            }
                        }
                    }
                    if (ts_simple_ast_1.ts.isVariableStatement(node) && !router_parser_util_1.default.isVariableRoutes(node)) {
                        var infos = _this.visitVariableDeclaration(node);
                        var name_5 = infos.name;
                        var deps = {
                            name: name_5,
                            ctype: 'miscellaneous',
                            subtype: 'variable',
                            file: file
                        };
                        deps.type = infos.type ? infos.type : '';
                        if (infos.defaultValue) {
                            deps.defaultValue = infos.defaultValue;
                        }
                        if (infos.initializer) {
                            deps.initializer = infos.initializer;
                        }
                        if (node.jsDoc && node.jsDoc.length > 0 && node.jsDoc[0].comment) {
                            deps.description = marked(node.jsDoc[0].comment);
                        }
                        if (utils_2.isModuleWithProviders(node)) {
                            var routingInitializer = utils_2.getModuleWithProviders(node);
                            router_parser_util_1.default.addModuleWithRoutes(name_5, [routingInitializer], file);
                            router_parser_util_1.default.addModule(name_5, [routingInitializer]);
                        }
                        if (!utils_2.isIgnore(node)) {
                            outputSymbols.miscellaneous.variables.push(deps);
                        }
                    }
                    if (ts_simple_ast_1.ts.isTypeAliasDeclaration(node)) {
                        var infos = _this.visitTypeDeclaration(node);
                        var name_6 = infos.name;
                        var deps = {
                            name: name_6,
                            ctype: 'miscellaneous',
                            subtype: 'typealias',
                            rawtype: _this.classHelper.visitType(node),
                            file: file,
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (node.type) {
                            deps.kind = node.type.kind;
                        }
                        if (!utils_2.isIgnore(node)) {
                            outputSymbols.miscellaneous.typealiases.push(deps);
                        }
                    }
                    if (ts_simple_ast_1.ts.isFunctionDeclaration(node)) {
                        var infos = _this.visitFunctionDeclaration(node);
                        var name_7 = infos.name;
                        var functionDep = {
                            name: name_7,
                            ctype: 'miscellaneous',
                            subtype: 'function',
                            file: file,
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (infos.args) {
                            functionDep.args = infos.args;
                        }
                        if (infos.returnType) {
                            functionDep.returnType = infos.returnType;
                        }
                        if (infos.jsdoctags && infos.jsdoctags.length > 0) {
                            functionDep.jsdoctags = infos.jsdoctags;
                        }
                        if (typeof infos.ignore === 'undefined') {
                            if (!(_this.hasPrivateJSDocTag(functionDep.jsdoctags) &&
                                configuration_1.default.mainData.disablePrivate)) {
                                outputSymbols.miscellaneous.functions.push(functionDep);
                            }
                        }
                    }
                    if (ts_simple_ast_1.ts.isEnumDeclaration(node)) {
                        var infos = _this.visitEnumDeclaration(node);
                        var name_8 = node.name.text;
                        var enumDeps = {
                            name: name_8,
                            childs: infos,
                            ctype: 'miscellaneous',
                            subtype: 'enum',
                            description: _this.visitEnumTypeAliasFunctionDeclarationDescription(node),
                            file: file
                        };
                        if (!utils_2.isIgnore(node)) {
                            outputSymbols.miscellaneous.enumerations.push(enumDeps);
                        }
                    }
                }
            };
            parseNode(fileName, scannedFile, initialNode);
        });
    };
    /**
     * Function to in a specific store an entity, and check before is there is not the same one
     * in that store : same name, id and file
     * @param entity Entity to store
     * @param store Store
     */
    AngularDependencies.prototype.addNewEntityInStore = function (entity, store) {
        var findSameEntityInStore = _.filter(store, {
            name: entity.name,
            id: entity.id,
            file: entity.file
        });
        if (findSameEntityInStore.length === 0) {
            store.push(entity);
        }
    };
    AngularDependencies.prototype.debug = function (deps) {
        if (deps) {
            logger_1.logger.debug('found', "" + deps.name);
        }
        else {
            return;
        }
        ['imports', 'exports', 'declarations', 'providers', 'bootstrap'].forEach(function (symbols) {
            if (deps[symbols] && deps[symbols].length > 0) {
                logger_1.logger.debug('', "- " + symbols + ":");
                deps[symbols]
                    .map(function (i) { return i.name; })
                    .forEach(function (d) {
                    logger_1.logger.debug('', "\t- " + d);
                });
            }
        });
    };
    AngularDependencies.prototype.ignore = function (deps) {
        if (deps) {
            logger_1.logger.warn('ignore', "" + deps.name);
        }
        else {
            return;
        }
    };
    AngularDependencies.prototype.findExpressionByNameInExpressions = function (entryNode, name) {
        var result;
        var loop = function (node, z) {
            if (node) {
                if (node.expression && !node.expression.name) {
                    loop(node.expression, z);
                }
                if (node.expression && node.expression.name) {
                    if (node.expression.name.text === z) {
                        result = node;
                    }
                    else {
                        loop(node.expression, z);
                    }
                }
            }
        };
        loop(entryNode, name);
        return result;
    };
    AngularDependencies.prototype.findExpressionByNameInExpressionArguments = function (arg, name) {
        var result;
        var that = this;
        var i = 0;
        var len = arg.length;
        var loop = function (node, z) {
            if (node.body) {
                if (node.body.statements && node.body.statements.length > 0) {
                    var j = 0;
                    var leng = node.body.statements.length;
                    for (j; j < leng; j++) {
                        result = that.findExpressionByNameInExpressions(node.body.statements[j], z);
                    }
                }
            }
        };
        for (i; i < len; i++) {
            loop(arg[i], name);
        }
        return result;
    };
    AngularDependencies.prototype.parseDecorators = function (decorators, type) {
        var result = false;
        if (decorators.length > 1) {
            _.forEach(decorators, function (decorator) {
                if (decorator.expression.expression) {
                    if (decorator.expression.expression.text === type) {
                        result = true;
                    }
                }
            });
        }
        else {
            if (decorators[0].expression.expression) {
                if (decorators[0].expression.expression.text === type) {
                    result = true;
                }
            }
        }
        return result;
    };
    AngularDependencies.prototype.parseDecorator = function (decorator, type) {
        var result = false;
        if (decorator.expression.expression) {
            if (decorator.expression.expression.text === type) {
                result = true;
            }
        }
        return result;
    };
    AngularDependencies.prototype.isController = function (metadata) {
        return this.parseDecorator(metadata, 'Controller');
    };
    AngularDependencies.prototype.isComponent = function (metadata) {
        return this.parseDecorator(metadata, 'Component');
    };
    AngularDependencies.prototype.isPipe = function (metadata) {
        return this.parseDecorator(metadata, 'Pipe');
    };
    AngularDependencies.prototype.isDirective = function (metadata) {
        return this.parseDecorator(metadata, 'Directive');
    };
    AngularDependencies.prototype.isInjectable = function (metadata) {
        return this.parseDecorator(metadata, 'Injectable');
    };
    AngularDependencies.prototype.isModule = function (metadata) {
        return this.parseDecorator(metadata, 'NgModule') || this.parseDecorator(metadata, 'Module');
    };
    AngularDependencies.prototype.hasInternalDecorator = function (metadatas) {
        return (this.parseDecorators(metadatas, 'Controller') ||
            this.parseDecorators(metadatas, 'Component') ||
            this.parseDecorators(metadatas, 'Pipe') ||
            this.parseDecorators(metadatas, 'Directive') ||
            this.parseDecorators(metadatas, 'Injectable') ||
            this.parseDecorators(metadatas, 'NgModule') ||
            this.parseDecorators(metadatas, 'Module'));
    };
    AngularDependencies.prototype.isGuard = function (ioImplements) {
        return (_.includes(ioImplements, 'CanActivate') ||
            _.includes(ioImplements, 'CanActivateChild') ||
            _.includes(ioImplements, 'CanDeactivate') ||
            _.includes(ioImplements, 'Resolve') ||
            _.includes(ioImplements, 'CanLoad'));
    };
    AngularDependencies.prototype.getSymboleName = function (node) {
        return node.name.text;
    };
    AngularDependencies.prototype.findProperties = function (visitedNode, sourceFile) {
        if (visitedNode.expression &&
            visitedNode.expression.arguments &&
            visitedNode.expression.arguments.length > 0) {
            var pop = visitedNode.expression.arguments[0];
            if (pop && pop.properties && pop.properties.length >= 0) {
                return pop.properties;
            }
            else if (pop && pop.kind && pop.kind === ts_simple_ast_1.SyntaxKind.StringLiteral) {
                return [pop];
            }
            else {
                logger_1.logger.warn('Empty metadatas, trying to found it with imports.');
                return imports_util_1.default.findValueInImportOrLocalVariables(pop.text, sourceFile);
            }
        }
        return [];
    };
    AngularDependencies.prototype.isAngularLifecycleHook = function (methodName) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var ANGULAR_LIFECYCLE_METHODS = [
            'ngOnInit',
            'ngOnChanges',
            'ngDoCheck',
            'ngOnDestroy',
            'ngAfterContentInit',
            'ngAfterContentChecked',
            'ngAfterViewInit',
            'ngAfterViewChecked',
            'writeValue',
            'registerOnChange',
            'registerOnTouched',
            'setDisabledState'
        ];
        return ANGULAR_LIFECYCLE_METHODS.indexOf(methodName) >= 0;
    };
    AngularDependencies.prototype.visitTypeDeclaration = function (node) {
        var result = {
            name: node.name.text,
            kind: node.kind
        };
        var jsdoctags = this.jsdocParserUtil.getJSDocs(node);
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                result.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
            }
        }
        return result;
    };
    AngularDependencies.prototype.visitArgument = function (arg) {
        var result = {
            name: arg.name.text,
            type: this.classHelper.visitType(arg)
        };
        if (arg.dotDotDotToken) {
            result.dotDotDotToken = true;
        }
        if (arg.questionToken) {
            result.optional = true;
        }
        if (arg.type) {
            result.type = this.mapType(arg.type.kind);
            if (arg.type.kind === 157) {
                // try replace TypeReference with typeName
                if (arg.type.typeName) {
                    result.type = arg.type.typeName.text;
                }
            }
        }
        return result;
    };
    AngularDependencies.prototype.mapType = function (type) {
        switch (type) {
            case 95:
                return 'null';
            case 119:
                return 'any';
            case 122:
                return 'boolean';
            case 130:
                return 'never';
            case 133:
                return 'number';
            case 136:
                return 'string';
            case 139:
                return 'undefined';
            case 159:
                return 'typeReference';
        }
    };
    AngularDependencies.prototype.hasPrivateJSDocTag = function (tags) {
        var result = false;
        if (tags) {
            tags.forEach(function (tag) {
                if (tag.tagName && tag.tagName && tag.tagName.text === 'private') {
                    result = true;
                }
            });
        }
        return result;
    };
    AngularDependencies.prototype.visitFunctionDeclaration = function (method) {
        var _this = this;
        var methodName = method.name ? method.name.text : 'Unnamed function';
        var result = {
            name: methodName,
            args: method.parameters ? method.parameters.map(function (prop) { return _this.visitArgument(prop); }) : []
        };
        var jsdoctags = this.jsdocParserUtil.getJSDocs(method);
        if (typeof method.type !== 'undefined') {
            result.returnType = this.classHelper.visitType(method.type);
        }
        if (method.modifiers) {
            if (method.modifiers.length > 0) {
                var kinds = method.modifiers
                    .map(function (modifier) {
                    return modifier.kind;
                })
                    .reverse();
                if (_.indexOf(kinds, ts_simple_ast_1.SyntaxKind.PublicKeyword) !== -1 &&
                    _.indexOf(kinds, ts_simple_ast_1.SyntaxKind.StaticKeyword) !== -1) {
                    kinds = kinds.filter(function (kind) { return kind !== ts_simple_ast_1.SyntaxKind.PublicKeyword; });
                }
            }
        }
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                result.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
                _.forEach(jsdoctags[0].tags, function (tag) {
                    if (tag.tagName) {
                        if (tag.tagName.text) {
                            if (tag.tagName.text.indexOf('ignore') > -1) {
                                result.ignore = true;
                            }
                        }
                    }
                });
            }
        }
        if (result.jsdoctags && result.jsdoctags.length > 0) {
            result.jsdoctags = utils_1.mergeTagsAndArgs(result.args, result.jsdoctags);
        }
        else if (result.args.length > 0) {
            result.jsdoctags = utils_1.mergeTagsAndArgs(result.args);
        }
        return result;
    };
    AngularDependencies.prototype.visitVariableDeclaration = function (node) {
        if (node.declarationList.declarations) {
            var i = 0;
            var len = node.declarationList.declarations.length;
            for (i; i < len; i++) {
                var result = {
                    name: node.declarationList.declarations[i].name.text,
                    defaultValue: node.declarationList.declarations[i].initializer
                        ? this.classHelper.stringifyDefaultValue(node.declarationList.declarations[i].initializer)
                        : undefined
                };
                if (node.declarationList.declarations[i].initializer) {
                    result.initializer = node.declarationList.declarations[i].initializer;
                }
                if (node.declarationList.declarations[i].type) {
                    result.type = this.classHelper.visitType(node.declarationList.declarations[i].type);
                }
                if (typeof result.type === 'undefined' && result.initializer) {
                    result.type = kind_to_type_1.kindToType(result.initializer.kind);
                }
                return result;
            }
        }
    };
    AngularDependencies.prototype.visitFunctionDeclarationJSDocTags = function (node) {
        var jsdoctags = this.jsdocParserUtil.getJSDocs(node);
        var result;
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                result = utils_1.markedtags(jsdoctags[0].tags);
            }
        }
        return result;
    };
    AngularDependencies.prototype.visitEnumTypeAliasFunctionDeclarationDescription = function (node) {
        var description = '';
        if (node.jsDoc) {
            if (node.jsDoc.length > 0) {
                if (typeof node.jsDoc[0].comment !== 'undefined') {
                    description = marked(node.jsDoc[0].comment);
                }
            }
        }
        return description;
    };
    AngularDependencies.prototype.visitEnumDeclaration = function (node) {
        var result = [];
        if (node.members) {
            var i = 0;
            var len = node.members.length;
            for (i; i < len; i++) {
                var member = {
                    name: node.members[i].name.text
                };
                if (node.members[i].initializer) {
                    member.value = node.members[i].initializer.text;
                }
                result.push(member);
            }
        }
        return result;
    };
    AngularDependencies.prototype.visitEnumDeclarationForRoutes = function (fileName, node) {
        if (node.declarationList.declarations) {
            var i = 0;
            var len = node.declarationList.declarations.length;
            for (i; i < len; i++) {
                var routesInitializer = node.declarationList.declarations[i].initializer;
                var data = new code_generator_1.CodeGenerator().generate(routesInitializer);
                router_parser_util_1.default.addRoute({
                    name: node.declarationList.declarations[i].name.text,
                    data: router_parser_util_1.default.cleanRawRoute(data),
                    filename: fileName
                });
                return [
                    {
                        routes: data
                    }
                ];
            }
        }
        return [];
    };
    AngularDependencies.prototype.getRouteIO = function (filename, sourceFile, node) {
        var _this = this;
        var res;
        if (sourceFile.statements) {
            res = sourceFile.statements.reduce(function (directive, statement) {
                if (router_parser_util_1.default.isVariableRoutes(statement)) {
                    if (statement.pos === node.pos && statement.end === node.end) {
                        return directive.concat(_this.visitEnumDeclarationForRoutes(filename, statement));
                    }
                }
                return directive;
            }, []);
            return res[0] || {};
        }
        else {
            return {};
        }
    };
    AngularDependencies.prototype.getClassIO = function (filename, sourceFile, node, fileBody) {
        var _this = this;
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var reducedSource = fileBody ? fileBody.statements : sourceFile.statements;
        var res = reducedSource.reduce(function (directive, statement) {
            if (ts_simple_ast_1.ts.isClassDeclaration(statement)) {
                if (statement.pos === node.pos && statement.end === node.end) {
                    return directive.concat(_this.classHelper.visitClassDeclaration(filename, statement, sourceFile));
                }
            }
            return directive;
        }, []);
        return res[0] || {};
    };
    AngularDependencies.prototype.getInterfaceIO = function (filename, sourceFile, node, fileBody) {
        var _this = this;
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var reducedSource = fileBody ? fileBody.statements : sourceFile.statements;
        var res = reducedSource.reduce(function (directive, statement) {
            if (ts_simple_ast_1.ts.isInterfaceDeclaration(statement)) {
                if (statement.pos === node.pos && statement.end === node.end) {
                    return directive.concat(_this.classHelper.visitClassDeclaration(filename, statement, sourceFile));
                }
            }
            return directive;
        }, []);
        return res[0] || {};
    };
    return AngularDependencies;
}(framework_dependencies_1.FrameworkDependencies));
exports.AngularDependencies = AngularDependencies;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kZXBlbmRlbmNpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9jb21waWxlci9hbmd1bGFyLWRlcGVuZGVuY2llcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQkFBNkI7QUFFN0IsMEJBQTRCO0FBQzVCLCtDQUFvRDtBQUVwRCx5REFBc0Q7QUFDdEQsNkNBQTRDO0FBQzVDLDJDQUFpRztBQUNqRyw0RUFBcUU7QUFFckUsbUVBQWlFO0FBRWpFLHlEQUFtRDtBQUVuRCxxQ0FLcUI7QUFFckIsdUVBQTREO0FBRTVELHFFQUE4RDtBQUU5RCwyREFBeUQ7QUFFekQsOEVBQTJFO0FBQzNFLGdGQUE2RTtBQUM3RSw4RUFBMkU7QUFDM0UsNEVBQXlFO0FBQ3pFLHNFQUFtRTtBQUNuRSxzRUFBb0U7QUFDcEUsc0VBQW9FO0FBQ3BFLHdFQUFxRTtBQUVyRSxrREFBNkM7QUFZN0MsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxJQUFNLEdBQUcsR0FBRyxJQUFJLHVCQUFHLEVBQUUsQ0FBQztBQUV0QixpR0FBaUc7QUFFakc7SUFBeUMsdUNBQXFCO0lBUTFELDZCQUFZLEtBQWUsRUFBRSxPQUFZO1FBQXpDLFlBQ0ksa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUN4QjtRQVJPLFdBQUssR0FBbUIsSUFBSSxpQ0FBYyxFQUFFLENBQUM7UUFDN0Msa0JBQVksR0FBRyxJQUFJLDRCQUFZLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVDLGlCQUFXLEdBQUcsSUFBSSwyQkFBVyxF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QUFJLENBQUMsR0FBRyxFQUFFO29CQUMxRCxPQUFPLFNBQVMsQ0FBQyxNQUFNLENBQ25CLEtBQUksQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FDMUUsQ0FBQztpQkFDTDthQUNKO1lBRUQsT0FBTyxTQUFTLENBQUM7UUFDckIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRVAsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFDTCwwQkFBQztBQUFELENBQUMsQUE3c0NELENBQXlDLDhDQUFxQixHQTZzQzdEO0FBN3NDWSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgQXN0LCB7IHRzLCBTeW50YXhLaW5kIH0gZnJvbSAndHMtc2ltcGxlLWFzdCc7XG5cbmltcG9ydCB7IGtpbmRUb1R5cGUgfSBmcm9tICcuLi8uLi91dGlscy9raW5kLXRvLXR5cGUnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7IGNsZWFuTGlmZWN5Y2xlSG9va3NGcm9tTWV0aG9kcywgbWFya2VkdGFncywgbWVyZ2VUYWdzQW5kQXJncyB9IGZyb20gJy4uLy4uL3V0aWxzL3V0aWxzJztcbmltcG9ydCBDb21wb25lbnRzVHJlZUVuZ2luZSBmcm9tICcuLi9lbmdpbmVzL2NvbXBvbmVudHMtdHJlZS5lbmdpbmUnO1xuXG5pbXBvcnQgeyBGcmFtZXdvcmtEZXBlbmRlbmNpZXMgfSBmcm9tICcuL2ZyYW1ld29yay1kZXBlbmRlbmNpZXMnO1xuXG5pbXBvcnQgSW1wb3J0c1V0aWwgZnJvbSAnLi4vLi4vdXRpbHMvaW1wb3J0cy51dGlsJztcblxuaW1wb3J0IHtcbiAgICBnZXRNb2R1bGVXaXRoUHJvdmlkZXJzLFxuICAgIGlzSWdub3JlLFxuICAgIGlzTW9kdWxlV2l0aFByb3ZpZGVycyxcbiAgICBKc2RvY1BhcnNlclV0aWxcbn0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5pbXBvcnQgRXh0ZW5kc01lcmdlciBmcm9tICcuLi8uLi91dGlscy9leHRlbmRzLW1lcmdlci51dGlsJztcblxuaW1wb3J0IFJvdXRlclBhcnNlclV0aWwgZnJvbSAnLi4vLi4vdXRpbHMvcm91dGVyLXBhcnNlci51dGlsJztcblxuaW1wb3J0IHsgQ29kZUdlbmVyYXRvciB9IGZyb20gJy4vYW5ndWxhci9jb2RlLWdlbmVyYXRvcic7XG5cbmltcG9ydCB7IENvbXBvbmVudERlcEZhY3RvcnkgfSBmcm9tICcuL2FuZ3VsYXIvZGVwcy9jb21wb25lbnQtZGVwLmZhY3RvcnknO1xuaW1wb3J0IHsgQ29udHJvbGxlckRlcEZhY3RvcnkgfSBmcm9tICcuL2FuZ3VsYXIvZGVwcy9jb250cm9sbGVyLWRlcC5mYWN0b3J5JztcbmltcG9ydCB7IERpcmVjdGl2ZURlcEZhY3RvcnkgfSBmcm9tICcuL2FuZ3VsYXIvZGVwcy9kaXJlY3RpdmUtZGVwLmZhY3RvcnknO1xuaW1wb3J0IHsgQ29tcG9uZW50Q2FjaGUgfSBmcm9tICcuL2FuZ3VsYXIvZGVwcy9oZWxwZXJzL2NvbXBvbmVudC1oZWxwZXInO1xuaW1wb3J0IHsgSnNEb2NIZWxwZXIgfSBmcm9tICcuL2FuZ3VsYXIvZGVwcy9oZWxwZXJzL2pzLWRvYy1oZWxwZXInO1xuaW1wb3J0IHsgTW9kdWxlSGVscGVyIH0gZnJvbSAnLi9hbmd1bGFyL2RlcHMvaGVscGVycy9tb2R1bGUtaGVscGVyJztcbmltcG9ydCB7IFN5bWJvbEhlbHBlciB9IGZyb20gJy4vYW5ndWxhci9kZXBzL2hlbHBlcnMvc3ltYm9sLWhlbHBlcic7XG5pbXBvcnQgeyBNb2R1bGVEZXBGYWN0b3J5IH0gZnJvbSAnLi9hbmd1bGFyL2RlcHMvbW9kdWxlLWRlcC5mYWN0b3J5JztcblxuaW1wb3J0IENvbmZpZ3VyYXRpb24gZnJvbSAnLi4vY29uZmlndXJhdGlvbic7XG5cbmltcG9ydCB7XG4gICAgSURlcCxcbiAgICBJRW51bURlY0RlcCxcbiAgICBJRnVuY3Rpb25EZWNEZXAsXG4gICAgSUluamVjdGFibGVEZXAsXG4gICAgSUludGVyZmFjZURlcCxcbiAgICBJUGlwZURlcCxcbiAgICBJVHlwZUFsaWFzRGVjRGVwXG59IGZyb20gJy4vYW5ndWxhci9kZXBlbmRlbmNpZXMuaW50ZXJmYWNlcyc7XG5cbmNvbnN0IGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuY29uc3QgbWFya2VkID0gcmVxdWlyZSgnbWFya2VkJyk7XG5jb25zdCBhc3QgPSBuZXcgQXN0KCk7XG5cbi8vIFR5cGVTY3JpcHQgcmVmZXJlbmNlIDogaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2Jsb2IvbWFzdGVyL2xpYi90eXBlc2NyaXB0LmQudHNcblxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJEZXBlbmRlbmNpZXMgZXh0ZW5kcyBGcmFtZXdvcmtEZXBlbmRlbmNpZXMge1xuICAgIHByaXZhdGUgZW5naW5lOiBhbnk7XG4gICAgcHJpdmF0ZSBjYWNoZTogQ29tcG9uZW50Q2FjaGUgPSBuZXcgQ29tcG9uZW50Q2FjaGUoKTtcbiAgICBwcml2YXRlIG1vZHVsZUhlbHBlciA9IG5ldyBNb2R1bGVIZWxwZXIodGhpcy5jYWNoZSk7XG4gICAgcHJpdmF0ZSBqc0RvY0hlbHBlciA9IG5ldyBKc0RvY0hlbHBlcigpO1xuICAgIHByaXZhdGUgc3ltYm9sSGVscGVyID0gbmV3IFN5bWJvbEhlbHBlcigpO1xuICAgIHByaXZhdGUganNkb2NQYXJzZXJVdGlsID0gbmV3IEpzZG9jUGFyc2VyVXRpbCgpO1xuXG4gICAgY29uc3RydWN0b3IoZmlsZXM6IHN0cmluZ1tdLCBvcHRpb25zOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoZmlsZXMsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXREZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIGxldCBkZXBzID0ge1xuICAgICAgICAgICAgbW9kdWxlczogW10sXG4gICAgICAgICAgICBtb2R1bGVzRm9yR3JhcGg6IFtdLFxuICAgICAgICAgICAgY29tcG9uZW50czogW10sXG4gICAgICAgICAgICBjb250cm9sbGVyczogW10sXG4gICAgICAgICAgICBpbmplY3RhYmxlczogW10sXG4gICAgICAgICAgICBpbnRlcmNlcHRvcnM6IFtdLFxuICAgICAgICAgICAgZ3VhcmRzOiBbXSxcbiAgICAgICAgICAgIHBpcGVzOiBbXSxcbiAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtdLFxuICAgICAgICAgICAgcm91dGVzOiBbXSxcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgaW50ZXJmYWNlczogW10sXG4gICAgICAgICAgICBtaXNjZWxsYW5lb3VzOiB7XG4gICAgICAgICAgICAgICAgdmFyaWFibGVzOiBbXSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbnM6IFtdLFxuICAgICAgICAgICAgICAgIHR5cGVhbGlhc2VzOiBbXSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhdGlvbnM6IFtdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm91dGVzVHJlZTogdW5kZWZpbmVkXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IHNvdXJjZUZpbGVzID0gdGhpcy5wcm9ncmFtLmdldFNvdXJjZUZpbGVzKCkgfHwgW107XG5cbiAgICAgICAgc291cmNlRmlsZXMubWFwKChmaWxlOiB0cy5Tb3VyY2VGaWxlKSA9PiB7XG4gICAgICAgICAgICBsZXQgZmlsZVBhdGggPSBmaWxlLmZpbGVOYW1lO1xuXG4gICAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKGZpbGVQYXRoKSA9PT0gJy50cycgfHwgcGF0aC5leHRuYW1lKGZpbGVQYXRoKSA9PT0gJy50c3gnKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFDb25maWd1cmF0aW9uLm1haW5EYXRhLmFuZ3VsYXJKU1Byb2plY3QgJiYgcGF0aC5leHRuYW1lKGZpbGVQYXRoKSA9PT0gJy5qcycpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ3BhcnNpbmcnLCBmaWxlUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0U291cmNlRmlsZURlY29yYXRvcnMoZmlsZSwgZGVwcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVBhdGgubGFzdEluZGV4T2YoJy5kLnRzJykgPT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlUGF0aC5sYXN0SW5kZXhPZignc3BlYy50cycpID09PSAtMVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdwYXJzaW5nJywgZmlsZVBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTb3VyY2VGaWxlRGVjb3JhdG9ycyhmaWxlLCBkZXBzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRlcHM7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEVuZCBvZiBmaWxlIHNjYW5uaW5nXG4gICAgICAgIC8vIFRyeSBtZXJnaW5nIGluc2lkZSB0aGUgc2FtZSBmaWxlIGRlY2xhcmF0ZWQgdmFyaWFibGVzICYgbW9kdWxlcyB3aXRoIGltcG9ydHMgfCBleHBvcnRzIHwgZGVjbGFyYXRpb25zIHwgcHJvdmlkZXJzXG5cbiAgICAgICAgaWYgKGRlcHMubWlzY2VsbGFuZW91cy52YXJpYWJsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGVwcy5taXNjZWxsYW5lb3VzLnZhcmlhYmxlcy5mb3JFYWNoKF92YXJpYWJsZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1ZhciA9IFtdO1xuICAgICAgICAgICAgICAgICgoX3ZhciwgX25ld1ZhcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBnZXRUeXBlIHByIHJlY29uc3RydWlyZS4uLi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKF92YXIuaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfdmFyLmluaXRpYWxpemVyLmVsZW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF92YXIuaW5pdGlhbGl6ZXIuZWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdmFyLmluaXRpYWxpemVyLmVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFyLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBlbGVtZW50LnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuc3ltYm9sSGVscGVyLmdldFR5cGUoZWxlbWVudC50ZXh0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KShfdmFyaWFibGUsIG5ld1Zhcik7XG5cbiAgICAgICAgICAgICAgICBsZXQgb25MaW5rID0gbW9kID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb2Nlc3MgPSAoaW5pdGlhbEFycmF5LCBfdmFyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXhUb0NsZWFuID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmRWYXJpYWJsZUluQXJyYXkgPSAoZWwsIGluZGV4LCB0aGVBcnJheSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbC5uYW1lID09PSBfdmFyLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhUb0NsZWFuID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbEFycmF5LmZvckVhY2goZmluZFZhcmlhYmxlSW5BcnJheSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDbGVhbiBpbmRleGVzIHRvIHJlcGxhY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxBcnJheS5zcGxpY2UoaW5kZXhUb0NsZWFuLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgdmFyaWFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdWYXIuZm9yRWFjaChuZXdFbGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgXy5maW5kKGluaXRpYWxBcnJheSwgeyBuYW1lOiBuZXdFbGUubmFtZSB9KSA9PT1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbEFycmF5LnB1c2gobmV3RWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzKG1vZC5pbXBvcnRzLCBfdmFyaWFibGUpO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzKG1vZC5leHBvcnRzLCBfdmFyaWFibGUpO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzKG1vZC5jb250cm9sbGVycywgX3ZhcmlhYmxlKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcyhtb2QuZGVjbGFyYXRpb25zLCBfdmFyaWFibGUpO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzKG1vZC5wcm92aWRlcnMsIF92YXJpYWJsZSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGRlcHMubW9kdWxlcy5mb3JFYWNoKG9uTGluayk7XG4gICAgICAgICAgICAgICAgZGVwcy5tb2R1bGVzRm9yR3JhcGguZm9yRWFjaChvbkxpbmspO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgb25lIHRoaW5nIGV4dGVuZHMgYW5vdGhlciwgbWVyZ2UgdGhlbSwgb25seSBmb3IgaW50ZXJuYWwgc291cmNlc1xuICAgICAgICAgKiAtIGNsYXNzZXNcbiAgICAgICAgICogLSBjb21wb25lbnRzXG4gICAgICAgICAqIC0gaW5qZWN0YWJsZXNcbiAgICAgICAgICogZm9yXG4gICAgICAgICAqIC0gaW5wdXRzXG4gICAgICAgICAqIC0gb3V0cHV0c1xuICAgICAgICAgKiAtIHByb3BlcnRpZXNcbiAgICAgICAgICogLSBtZXRob2RzXG4gICAgICAgICAqL1xuICAgICAgICBkZXBzID0gRXh0ZW5kc01lcmdlci5tZXJnZShkZXBzKTtcblxuICAgICAgICAvLyBSb3V0ZXJQYXJzZXJVdGlsLnByaW50TW9kdWxlc1JvdXRlcygpO1xuICAgICAgICAvLyBSb3V0ZXJQYXJzZXJVdGlsLnByaW50Um91dGVzKCk7XG5cbiAgICAgICAgaWYgKCFDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVSb3V0ZXNHcmFwaCkge1xuICAgICAgICAgICAgUm91dGVyUGFyc2VyVXRpbC5saW5rTW9kdWxlc0FuZFJvdXRlcygpO1xuICAgICAgICAgICAgUm91dGVyUGFyc2VyVXRpbC5jb25zdHJ1Y3RNb2R1bGVzVHJlZSgpO1xuXG4gICAgICAgICAgICBkZXBzLnJvdXRlc1RyZWUgPSBSb3V0ZXJQYXJzZXJVdGlsLmNvbnN0cnVjdFJvdXRlc1RyZWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZXBzO1xuICAgIH1cblxuICAgIHByaXZhdGUgcHJvY2Vzc0NsYXNzKG5vZGUsIGZpbGUsIHNyY0ZpbGUsIG91dHB1dFN5bWJvbHMsIGZpbGVCb2R5KSB7XG4gICAgICAgIGxldCBuYW1lID0gdGhpcy5nZXRTeW1ib2xlTmFtZShub2RlKTtcbiAgICAgICAgbGV0IElPID0gdGhpcy5nZXRDbGFzc0lPKGZpbGUsIHNyY0ZpbGUsIG5vZGUsIGZpbGVCb2R5KTtcbiAgICAgICAgbGV0IHNvdXJjZUNvZGUgPSBzcmNGaWxlLmdldFRleHQoKTtcbiAgICAgICAgbGV0IGhhc2ggPSBjcnlwdG9cbiAgICAgICAgICAgIC5jcmVhdGVIYXNoKCdtZDUnKVxuICAgICAgICAgICAgLnVwZGF0ZShzb3VyY2VDb2RlKVxuICAgICAgICAgICAgLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICAgIGxldCBkZXBzOiBhbnkgPSB7XG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgaWQ6ICdjbGFzcy0nICsgbmFtZSArICctJyArIGhhc2gsXG4gICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgdHlwZTogJ2NsYXNzJyxcbiAgICAgICAgICAgIHNvdXJjZUNvZGU6IHNyY0ZpbGUuZ2V0VGV4dCgpXG4gICAgICAgIH07XG4gICAgICAgIGxldCBleGNsdWRlRnJvbUNsYXNzQXJyYXkgPSBmYWxzZTtcblxuICAgICAgICBpZiAoSU8uY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIGRlcHMuY29uc3RydWN0b3JPYmogPSBJTy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoSU8ucHJvcGVydGllcykge1xuICAgICAgICAgICAgZGVwcy5wcm9wZXJ0aWVzID0gSU8ucHJvcGVydGllcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoSU8uZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGRlcHMuZGVzY3JpcHRpb24gPSBJTy5kZXNjcmlwdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoSU8ucmF3ZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGRlcHMucmF3ZGVzY3JpcHRpb24gPSBJTy5yYXdkZXNjcmlwdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoSU8ubWV0aG9kcykge1xuICAgICAgICAgICAgZGVwcy5tZXRob2RzID0gSU8ubWV0aG9kcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoSU8uaW5kZXhTaWduYXR1cmVzKSB7XG4gICAgICAgICAgICBkZXBzLmluZGV4U2lnbmF0dXJlcyA9IElPLmluZGV4U2lnbmF0dXJlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoSU8uZXh0ZW5kcykge1xuICAgICAgICAgICAgZGVwcy5leHRlbmRzID0gSU8uZXh0ZW5kcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoSU8uanNkb2N0YWdzICYmIElPLmpzZG9jdGFncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkZXBzLmpzZG9jdGFncyA9IElPLmpzZG9jdGFnc1swXS50YWdzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChJTy5hY2Nlc3NvcnMpIHtcbiAgICAgICAgICAgIGRlcHMuYWNjZXNzb3JzID0gSU8uYWNjZXNzb3JzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChJTy5pbnB1dHMpIHtcbiAgICAgICAgICAgIGRlcHMuaW5wdXRzQ2xhc3MgPSBJTy5pbnB1dHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKElPLm91dHB1dHMpIHtcbiAgICAgICAgICAgIGRlcHMub3V0cHV0c0NsYXNzID0gSU8ub3V0cHV0cztcbiAgICAgICAgfVxuICAgICAgICBpZiAoSU8uaG9zdEJpbmRpbmdzKSB7XG4gICAgICAgICAgICBkZXBzLmhvc3RCaW5kaW5ncyA9IElPLmhvc3RCaW5kaW5ncztcbiAgICAgICAgfVxuICAgICAgICBpZiAoSU8uaG9zdExpc3RlbmVycykge1xuICAgICAgICAgICAgZGVwcy5ob3N0TGlzdGVuZXJzID0gSU8uaG9zdExpc3RlbmVycztcbiAgICAgICAgfVxuICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlTGlmZUN5Y2xlSG9va3MpIHtcbiAgICAgICAgICAgIGRlcHMubWV0aG9kcyA9IGNsZWFuTGlmZWN5Y2xlSG9va3NGcm9tTWV0aG9kcyhkZXBzLm1ldGhvZHMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChJTy5pbXBsZW1lbnRzICYmIElPLmltcGxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGVwcy5pbXBsZW1lbnRzID0gSU8uaW1wbGVtZW50cztcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNHdWFyZChJTy5pbXBsZW1lbnRzKSkge1xuICAgICAgICAgICAgICAgIC8vIFdlIGRvbid0IHdhbnQgdGhlIEd1YXJkIHRvIHNob3cgdXAgaW4gdGhlIENsYXNzZXMgbWVudVxuICAgICAgICAgICAgICAgIGV4Y2x1ZGVGcm9tQ2xhc3NBcnJheSA9IHRydWU7XG4gICAgICAgICAgICAgICAgZGVwcy50eXBlID0gJ2d1YXJkJztcblxuICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMuZ3VhcmRzLnB1c2goZGVwcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBJTy5pZ25vcmUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGRlcHMpO1xuXG4gICAgICAgICAgICBpZiAoIWV4Y2x1ZGVGcm9tQ2xhc3NBcnJheSkge1xuICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMuY2xhc3Nlcy5wdXNoKGRlcHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pZ25vcmUoZGVwcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNvdXJjZUZpbGVEZWNvcmF0b3JzKGluaXRpYWxTcmNGaWxlOiB0cy5Tb3VyY2VGaWxlLCBvdXRwdXRTeW1ib2xzOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgbGV0IGNsZWFuZXIgPSAocHJvY2Vzcy5jd2QoKSArIHBhdGguc2VwKS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG4gICAgICAgIGxldCBmaWxlTmFtZSA9IGluaXRpYWxTcmNGaWxlLmZpbGVOYW1lLnJlcGxhY2UoY2xlYW5lciwgJycpO1xuICAgICAgICBsZXQgc2Nhbm5lZEZpbGUgPSBpbml0aWFsU3JjRmlsZTtcblxuICAgICAgICAvLyBTZWFyY2ggaW4gZmlsZSBmb3IgdmFyaWFibGUgc3RhdGVtZW50IGFzIHJvdXRlcyBkZWZpbml0aW9uc1xuXG4gICAgICAgIGNvbnN0IGFzdEZpbGUgPVxuICAgICAgICAgICAgdHlwZW9mIGFzdC5nZXRTb3VyY2VGaWxlKGluaXRpYWxTcmNGaWxlLmZpbGVOYW1lKSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICA/IGFzdC5nZXRTb3VyY2VGaWxlKGluaXRpYWxTcmNGaWxlLmZpbGVOYW1lKVxuICAgICAgICAgICAgICAgIDogYXN0LmFkZEV4aXN0aW5nU291cmNlRmlsZShpbml0aWFsU3JjRmlsZS5maWxlTmFtZSk7XG5cbiAgICAgICAgY29uc3QgdmFyaWFibGVSb3V0ZXNTdGF0ZW1lbnRzID0gYXN0RmlsZS5nZXRWYXJpYWJsZVN0YXRlbWVudHMoKTtcbiAgICAgICAgbGV0IGhhc1JvdXRlc1N0YXRlbWVudHMgPSBmYWxzZTtcblxuICAgICAgICBpZiAodmFyaWFibGVSb3V0ZXNTdGF0ZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIENsZWFuIGZpbGUgZm9yIHNwcmVhZCBhbmQgZHluYW1pY3MgaW5zaWRlIHJvdXRlcyBkZWZpbml0aW9uc1xuICAgICAgICAgICAgdmFyaWFibGVSb3V0ZXNTdGF0ZW1lbnRzLmZvckVhY2gocyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFyaWFibGVEZWNsYXJhdGlvbnMgPSBzLmdldERlY2xhcmF0aW9ucygpO1xuICAgICAgICAgICAgICAgIGxldCBsZW4gPSB2YXJpYWJsZURlY2xhcmF0aW9ucy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YXJpYWJsZURlY2xhcmF0aW9uc1tpXS5jb21waWxlck5vZGUudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlRGVjbGFyYXRpb25zW2ldLmNvbXBpbGVyTm9kZS50eXBlLnR5cGVOYW1lICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVEZWNsYXJhdGlvbnNbaV0uY29tcGlsZXJOb2RlLnR5cGUudHlwZU5hbWUudGV4dCA9PT0gJ1JvdXRlcydcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc1JvdXRlc1N0YXRlbWVudHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzUm91dGVzU3RhdGVtZW50cyAmJiAhQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlUm91dGVzR3JhcGgpIHtcbiAgICAgICAgICAgIC8vIENsZWFuIGZpbGUgZm9yIHNwcmVhZCBhbmQgZHluYW1pY3MgaW5zaWRlIHJvdXRlcyBkZWZpbml0aW9uc1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ0FuYWx5c2luZyByb3V0ZXMgZGVmaW5pdGlvbnMgYW5kIGNsZWFuIHRoZW0gaWYgbmVjZXNzYXJ5Jyk7XG5cbiAgICAgICAgICAgIC8vIHNjYW5uZWRGaWxlID0gUm91dGVyUGFyc2VyVXRpbC5jbGVhbkZpbGVJZGVudGlmaWVycyhhc3RGaWxlKS5jb21waWxlck5vZGU7XG4gICAgICAgICAgICBsZXQgZmlyc3RDbGVhbiA9IFJvdXRlclBhcnNlclV0aWwuY2xlYW5GaWxlU3ByZWFkcyhhc3RGaWxlKS5jb21waWxlck5vZGU7XG4gICAgICAgICAgICBzY2FubmVkRmlsZSA9IFJvdXRlclBhcnNlclV0aWwuY2xlYW5DYWxsRXhwcmVzc2lvbnMoYXN0RmlsZSkuY29tcGlsZXJOb2RlO1xuICAgICAgICAgICAgc2Nhbm5lZEZpbGUgPSBSb3V0ZXJQYXJzZXJVdGlsLmNsZWFuRmlsZUR5bmFtaWNzKGFzdEZpbGUpLmNvbXBpbGVyTm9kZTtcblxuICAgICAgICAgICAgc2Nhbm5lZEZpbGUua2luZCA9IFN5bnRheEtpbmQuU291cmNlRmlsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRzLmZvckVhY2hDaGlsZChzY2FubmVkRmlsZSwgKGluaXRpYWxOb2RlOiB0cy5Ob2RlKSA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5qc0RvY0hlbHBlci5oYXNKU0RvY0ludGVybmFsVGFnKGZpbGVOYW1lLCBzY2FubmVkRmlsZSwgaW5pdGlhbE5vZGUpICYmXG4gICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlSW50ZXJuYWxcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBwYXJzZU5vZGUgPSAoZmlsZSwgc3JjRmlsZSwgbm9kZSwgZmlsZUJvZHkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlQ29kZSA9IHNyY0ZpbGUuZ2V0VGV4dCgpO1xuICAgICAgICAgICAgICAgIGxldCBoYXNoID0gY3J5cHRvXG4gICAgICAgICAgICAgICAgICAgIC5jcmVhdGVIYXNoKCdtZDUnKVxuICAgICAgICAgICAgICAgICAgICAudXBkYXRlKHNvdXJjZUNvZGUpXG4gICAgICAgICAgICAgICAgICAgIC5kaWdlc3QoJ2hleCcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuZGVjb3JhdG9ycykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2xhc3NXaXRoQ3VzdG9tRGVjb3JhdG9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2aXNpdERlY29yYXRvciA9ICh2aXNpdGVkRGVjb3JhdG9yLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRlcHM6IElEZXA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtZXRhZGF0YSA9IG5vZGUuZGVjb3JhdG9ycztcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gdGhpcy5nZXRTeW1ib2xlTmFtZShub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcm9wcyA9IHRoaXMuZmluZFByb3BlcnRpZXModmlzaXRlZERlY29yYXRvciwgc3JjRmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgSU8gPSB0aGlzLmNvbXBvbmVudEhlbHBlci5nZXRDb21wb25lbnRJTyhmaWxlLCBzcmNGaWxlLCBub2RlLCBmaWxlQm9keSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzTW9kdWxlKHZpc2l0ZWREZWNvcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kdWxlRGVwID0gbmV3IE1vZHVsZURlcEZhY3RvcnkodGhpcy5tb2R1bGVIZWxwZXIpLmNyZWF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjRmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIElPXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoUm91dGVyUGFyc2VyVXRpbC5oYXNSb3V0ZXJNb2R1bGVJbkltcG9ydHMobW9kdWxlRGVwLmltcG9ydHMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJvdXRlclBhcnNlclV0aWwuYWRkTW9kdWxlV2l0aFJvdXRlcyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZHVsZUhlbHBlci5nZXRNb2R1bGVJbXBvcnRzUmF3KHByb3BzLCBzcmNGaWxlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwcyA9IG1vZHVsZURlcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIElPLmlnbm9yZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUm91dGVyUGFyc2VyVXRpbC5hZGRNb2R1bGUobmFtZSwgbW9kdWxlRGVwLmltcG9ydHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTeW1ib2xzLm1vZHVsZXMucHVzaChtb2R1bGVEZXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTeW1ib2xzLm1vZHVsZXNGb3JHcmFwaC5wdXNoKG1vZHVsZURlcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQ29tcG9uZW50KHZpc2l0ZWREZWNvcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudERlcCA9IG5ldyBDb21wb25lbnREZXBGYWN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudEhlbHBlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkuY3JlYXRlKGZpbGUsIHNyY0ZpbGUsIG5hbWUsIHByb3BzLCBJTyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwcyA9IGNvbXBvbmVudERlcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIElPLmlnbm9yZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29tcG9uZW50c1RyZWVFbmdpbmUuYWRkQ29tcG9uZW50KGNvbXBvbmVudERlcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMuY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudERlcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQ29udHJvbGxlcih2aXNpdGVkRGVjb3JhdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXJEZXAgPSBuZXcgQ29udHJvbGxlckRlcEZhY3RvcnkoKS5jcmVhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyY0ZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJT1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwcyA9IGNvbnRyb2xsZXJEZXA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBJTy5pZ25vcmUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMuY29udHJvbGxlcnMucHVzaChjb250cm9sbGVyRGVwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbmplY3RhYmxlKHZpc2l0ZWREZWNvcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluamVjdGFibGVEZXBzOiBJSW5qZWN0YWJsZURlcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdpbmplY3RhYmxlLScgKyBuYW1lICsgJy0nICsgaGFzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogSU8ucHJvcGVydGllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kczogSU8ubWV0aG9kcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IElPLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VDb2RlOiBzcmNGaWxlLmdldFRleHQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhhbXBsZVVybHM6IHRoaXMuY29tcG9uZW50SGVscGVyLmdldENvbXBvbmVudEV4YW1wbGVVcmxzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjRmlsZS5nZXRUZXh0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKElPLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGFibGVEZXBzLmNvbnN0cnVjdG9yT2JqID0gSU8uY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChJTy5qc2RvY3RhZ3MgJiYgSU8uanNkb2N0YWdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0YWJsZURlcHMuanNkb2N0YWdzID0gSU8uanNkb2N0YWdzWzBdLnRhZ3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChJTy5hY2Nlc3NvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0YWJsZURlcHMuYWNjZXNzb3JzID0gSU8uYWNjZXNzb3JzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoSU8uZXh0ZW5kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmplY3RhYmxlRGVwcy5leHRlbmRzID0gSU8uZXh0ZW5kcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwcyA9IGluamVjdGFibGVEZXBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgSU8uaWdub3JlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlcyhJTy5pbXBsZW1lbnRzLCAnSHR0cEludGVyY2VwdG9yJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGFibGVEZXBzLnR5cGUgPSAnaW50ZXJjZXB0b3InO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3ltYm9scy5pbnRlcmNlcHRvcnMucHVzaChpbmplY3RhYmxlRGVwcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0d1YXJkKElPLmltcGxlbWVudHMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmplY3RhYmxlRGVwcy50eXBlID0gJ2d1YXJkJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMuZ3VhcmRzLnB1c2goaW5qZWN0YWJsZURlcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0YWJsZURlcHMudHlwZSA9ICdpbmplY3RhYmxlJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkTmV3RW50aXR5SW5TdG9yZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmplY3RhYmxlRGVwcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTeW1ib2xzLmluamVjdGFibGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUGlwZSh2aXNpdGVkRGVjb3JhdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwaXBlRGVwczogSVBpcGVEZXAgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAncGlwZS0nICsgbmFtZSArICctJyArIGhhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaXBlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IElPLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiBJTy5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2RzOiBJTy5tZXRob2RzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXJlOiB0aGlzLmNvbXBvbmVudEhlbHBlci5nZXRDb21wb25lbnRQdXJlKHByb3BzLCBzcmNGaWxlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmduYW1lOiB0aGlzLmNvbXBvbmVudEhlbHBlci5nZXRDb21wb25lbnROYW1lKHByb3BzLCBzcmNGaWxlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlQ29kZTogc3JjRmlsZS5nZXRUZXh0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4YW1wbGVVcmxzOiB0aGlzLmNvbXBvbmVudEhlbHBlci5nZXRDb21wb25lbnRFeGFtcGxlVXJscyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyY0ZpbGUuZ2V0VGV4dCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChJTy5qc2RvY3RhZ3MgJiYgSU8uanNkb2N0YWdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlwZURlcHMuanNkb2N0YWdzID0gSU8uanNkb2N0YWdzWzBdLnRhZ3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcHMgPSBwaXBlRGVwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIElPLmlnbm9yZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3ltYm9scy5waXBlcy5wdXNoKHBpcGVEZXBzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNEaXJlY3RpdmUodmlzaXRlZERlY29yYXRvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRpcmVjdGl2ZURlcHMgPSBuZXcgRGlyZWN0aXZlRGVwRmFjdG9yeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRIZWxwZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLmNyZWF0ZShmaWxlLCBzcmNGaWxlLCBuYW1lLCBwcm9wcywgSU8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcHMgPSBkaXJlY3RpdmVEZXBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgSU8uaWdub3JlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTeW1ib2xzLmRpcmVjdGl2ZXMucHVzaChkaXJlY3RpdmVEZXBzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoYXNNdWx0aXBsZURlY29yYXRvcnNXaXRoSW50ZXJuYWxPbmUgPSB0aGlzLmhhc0ludGVybmFsRGVjb3JhdG9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRlY29yYXRvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEp1c3QgYSBjbGFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIWNsYXNzV2l0aEN1c3RvbURlY29yYXRvciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhaGFzTXVsdGlwbGVEZWNvcmF0b3JzV2l0aEludGVybmFsT25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzV2l0aEN1c3RvbURlY29yYXRvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0NsYXNzKG5vZGUsIGZpbGUsIHNyY0ZpbGUsIG91dHB1dFN5bWJvbHMsIGZpbGVCb2R5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnNldChuYW1lLCBkZXBzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBJTy5pZ25vcmUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWJ1ZyhkZXBzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pZ25vcmUoZGVwcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlckJ5RGVjb3JhdG9ycyA9IGZpbHRlcmVkTm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyZWROb2RlLmV4cHJlc3Npb24gJiYgZmlsdGVyZWROb2RlLmV4cHJlc3Npb24uZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBfdGVzdCA9IC8oTmdNb2R1bGV8Q29tcG9uZW50fEluamVjdGFibGV8UGlwZXxEaXJlY3RpdmUpLy50ZXN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZE5vZGUuZXhwcmVzc2lvbi5leHByZXNzaW9uLnRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghX3Rlc3QgJiYgdHMuaXNDbGFzc0RlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90ZXN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90ZXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRzLmlzQ2xhc3NEZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuZGVjb3JhdG9ycy5maWx0ZXIoZmlsdGVyQnlEZWNvcmF0b3JzKS5mb3JFYWNoKHZpc2l0RGVjb3JhdG9yKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUuc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLnN5bWJvbC5mbGFncyA9PT0gdHMuU3ltYm9sRmxhZ3MuQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0NsYXNzKG5vZGUsIGZpbGUsIHNyY0ZpbGUsIG91dHB1dFN5bWJvbHMsIGZpbGVCb2R5KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlLnN5bWJvbC5mbGFncyA9PT0gdHMuU3ltYm9sRmxhZ3MuSW50ZXJmYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0U3ltYm9sZU5hbWUobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgSU8gPSB0aGlzLmdldEludGVyZmFjZUlPKGZpbGUsIHNyY0ZpbGUsIG5vZGUsIGZpbGVCb2R5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnRlcmZhY2VEZXBzOiBJSW50ZXJmYWNlRGVwID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdpbnRlcmZhY2UtJyArIG5hbWUgKyAnLScgKyBoYXNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVyZmFjZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlQ29kZTogc3JjRmlsZS5nZXRUZXh0KClcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoSU8ucHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyZmFjZURlcHMucHJvcGVydGllcyA9IElPLnByb3BlcnRpZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoSU8uaW5kZXhTaWduYXR1cmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJmYWNlRGVwcy5pbmRleFNpZ25hdHVyZXMgPSBJTy5pbmRleFNpZ25hdHVyZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoSU8ua2luZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyZmFjZURlcHMua2luZCA9IElPLmtpbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoSU8uZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcmZhY2VEZXBzLmRlc2NyaXB0aW9uID0gSU8uZGVzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoSU8ubWV0aG9kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyZmFjZURlcHMubWV0aG9kcyA9IElPLm1ldGhvZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoSU8uZXh0ZW5kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyZmFjZURlcHMuZXh0ZW5kcyA9IElPLmV4dGVuZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIElPLmlnbm9yZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGludGVyZmFjZURlcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMuaW50ZXJmYWNlcy5wdXNoKGludGVyZmFjZURlcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlnbm9yZShpbnRlcmZhY2VEZXBzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0cy5pc0Z1bmN0aW9uRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmZvcyA9IHRoaXMudmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGV0IHRhZ3MgPSB0aGlzLnZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbkpTRG9jVGFncyhub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gaW5mb3MubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmdW5jdGlvbkRlcDogSUZ1bmN0aW9uRGVjRGVwID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHlwZTogJ21pc2NlbGxhbmVvdXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnR5cGU6ICdmdW5jdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHRoaXMudmlzaXRFbnVtVHlwZUFsaWFzRnVuY3Rpb25EZWNsYXJhdGlvbkRlc2NyaXB0aW9uKG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZm9zLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkRlcC5hcmdzID0gaW5mb3MuYXJncztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmZvcy5yZXR1cm5UeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25EZXAucmV0dXJuVHlwZSA9IGluZm9zLnJldHVyblR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5mb3MuanNkb2N0YWdzICYmIGluZm9zLmpzZG9jdGFncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25EZXAuanNkb2N0YWdzID0gaW5mb3MuanNkb2N0YWdzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbmZvcy5pZ25vcmUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNQcml2YXRlSlNEb2NUYWcoZnVuY3Rpb25EZXAuanNkb2N0YWdzKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlUHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMubWlzY2VsbGFuZW91cy5mdW5jdGlvbnMucHVzaChmdW5jdGlvbkRlcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRzLmlzRW51bURlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5mb3MgPSB0aGlzLnZpc2l0RW51bURlY2xhcmF0aW9uKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBub2RlLm5hbWUudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbnVtRGVwczogSUVudW1EZWNEZXAgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHM6IGluZm9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eXBlOiAnbWlzY2VsbGFuZW91cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VidHlwZTogJ2VudW0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLnZpc2l0RW51bVR5cGVBbGlhc0Z1bmN0aW9uRGVjbGFyYXRpb25EZXNjcmlwdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNJZ25vcmUobm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTeW1ib2xzLm1pc2NlbGxhbmVvdXMuZW51bWVyYXRpb25zLnB1c2goZW51bURlcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRzLmlzVHlwZUFsaWFzRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmZvcyA9IHRoaXMudmlzaXRUeXBlRGVjbGFyYXRpb24obm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGluZm9zLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZUFsaWFzRGVwczogSVR5cGVBbGlhc0RlY0RlcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eXBlOiAnbWlzY2VsbGFuZW91cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VidHlwZTogJ3R5cGVhbGlhcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF3dHlwZTogdGhpcy5jbGFzc0hlbHBlci52aXNpdFR5cGUobm9kZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy52aXNpdEVudW1UeXBlQWxpYXNGdW5jdGlvbkRlY2xhcmF0aW9uRGVzY3JpcHRpb24obm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZUFsaWFzRGVwcy5raW5kID0gbm9kZS50eXBlLmtpbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVBbGlhc0RlcHMucmF3dHlwZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZUFsaWFzRGVwcy5yYXd0eXBlID0ga2luZFRvVHlwZShub2RlLnR5cGUua2luZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0lnbm9yZShub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMubWlzY2VsbGFuZW91cy50eXBlYWxpYXNlcy5wdXNoKHR5cGVBbGlhc0RlcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRzLmlzTW9kdWxlRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmJvZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5ib2R5LnN0YXRlbWVudHMgJiYgbm9kZS5ib2R5LnN0YXRlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmJvZHkuc3RhdGVtZW50cy5mb3JFYWNoKHN0YXRlbWVudCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VOb2RlKGZpbGUsIHNyY0ZpbGUsIHN0YXRlbWVudCwgbm9kZS5ib2R5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBJTyA9IHRoaXMuZ2V0Um91dGVJTyhmaWxlLCBzcmNGaWxlLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKElPLnJvdXRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld1JvdXRlcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Um91dGVzID0gUm91dGVyUGFyc2VyVXRpbC5jbGVhblJhd1JvdXRlUGFyc2VkKElPLnJvdXRlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JvdXRlcyBwYXJzaW5nIGVycm9yLCBtYXliZSBhIHRyYWlsaW5nIGNvbW1hIG9yIGFuIGV4dGVybmFsIHZhcmlhYmxlLCB0cnlpbmcgdG8gZml4IHRoYXQgbGF0ZXIgYWZ0ZXIgc291cmNlcyBzY2FubmluZy4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdSb3V0ZXMgPSBJTy5yb3V0ZXMucmVwbGFjZSgvIC9nbSwgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJvdXRlclBhcnNlclV0aWwuYWRkSW5jb21wbGV0ZVJvdXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbmV3Um91dGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTeW1ib2xzLnJvdXRlcyA9IFsuLi5vdXRwdXRTeW1ib2xzLnJvdXRlcywgLi4ubmV3Um91dGVzXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodHMuaXNDbGFzc0RlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NDbGFzcyhub2RlLCBmaWxlLCBzcmNGaWxlLCBvdXRwdXRTeW1ib2xzLCBmaWxlQm9keSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRzLmlzRXhwcmVzc2lvblN0YXRlbWVudChub2RlKSB8fCB0cy5pc0lmU3RhdGVtZW50KG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYm9vdHN0cmFwTW9kdWxlUmVmZXJlbmNlID0gJ2Jvb3RzdHJhcE1vZHVsZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGaW5kIHRoZSByb290IG1vZHVsZSB3aXRoIGJvb3RzdHJhcE1vZHVsZSBjYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAxLiBmaW5kIGEgc2ltcGxlIGNhbGwgOiBwbGF0Zm9ybUJyb3dzZXJEeW5hbWljKCkuYm9vdHN0cmFwTW9kdWxlKEFwcE1vZHVsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAyLiBvciBpbnNpZGUgYSBjYWxsIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBwbGF0Zm9ybUJyb3dzZXJEeW5hbWljKCkuYm9vdHN0cmFwTW9kdWxlKEFwcE1vZHVsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDMuIHdpdGggYSBjYXRjaCA6IHBsYXRmb3JtQnJvd3NlckR5bmFtaWMoKS5ib290c3RyYXBNb2R1bGUoQXBwTW9kdWxlKS5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyA0LiB3aXRoIHBhcmFtZXRlcnMgOiBwbGF0Zm9ybUJyb3dzZXJEeW5hbWljKCkuYm9vdHN0cmFwTW9kdWxlKEFwcE1vZHVsZSwge30pLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpbmQgcmVjdXNpdmVseSBpbiBleHByZXNzaW9uIG5vZGVzIG9uZSB3aXRoIG5hbWUgJ2Jvb3RzdHJhcE1vZHVsZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByb290TW9kdWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdE5vZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3JjRmlsZS50ZXh0LmluZGV4T2YoYm9vdHN0cmFwTW9kdWxlUmVmZXJlbmNlKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdE5vZGUgPSB0aGlzLmZpbmRFeHByZXNzaW9uQnlOYW1lSW5FeHByZXNzaW9ucyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib290c3RyYXBNb2R1bGUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZS50aGVuU3RhdGVtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLnRoZW5TdGF0ZW1lbnQuc3RhdGVtZW50cyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS50aGVuU3RhdGVtZW50LnN0YXRlbWVudHMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaXJzdFN0YXRlbWVudCA9IG5vZGUudGhlblN0YXRlbWVudC5zdGF0ZW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Tm9kZSA9IHRoaXMuZmluZEV4cHJlc3Npb25CeU5hbWVJbkV4cHJlc3Npb25zKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0U3RhdGVtZW50LmV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Jvb3RzdHJhcE1vZHVsZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZXhwcmVzc2lvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5leHByZXNzaW9uLmFyZ3VtZW50cyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5leHByZXNzaW9uLmFyZ3VtZW50cy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Tm9kZSA9IHRoaXMuZmluZEV4cHJlc3Npb25CeU5hbWVJbkV4cHJlc3Npb25Bcmd1bWVudHMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5leHByZXNzaW9uLmFyZ3VtZW50cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9vdHN0cmFwTW9kdWxlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Tm9kZS5hcmd1bWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKHJlc3VsdE5vZGUuYXJndW1lbnRzLCAoYXJndW1lbnQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudC50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RNb2R1bGUgPSBhcmd1bWVudC50ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb290TW9kdWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSb3V0ZXJQYXJzZXJVdGlsLnNldFJvb3RNb2R1bGUocm9vdE1vZHVsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRzLmlzVmFyaWFibGVTdGF0ZW1lbnQobm9kZSkgJiYgIVJvdXRlclBhcnNlclV0aWwuaXNWYXJpYWJsZVJvdXRlcyhub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZm9zOiBhbnkgPSB0aGlzLnZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbihub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gaW5mb3MubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZXBzOiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHlwZTogJ21pc2NlbGxhbmVvdXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnR5cGU6ICd2YXJpYWJsZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHMudHlwZSA9IGluZm9zLnR5cGUgPyBpbmZvcy50eXBlIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5mb3MuZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwcy5kZWZhdWx0VmFsdWUgPSBpbmZvcy5kZWZhdWx0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5mb3MuaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBzLmluaXRpYWxpemVyID0gaW5mb3MuaW5pdGlhbGl6ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5qc0RvYyAmJiBub2RlLmpzRG9jLmxlbmd0aCA+IDAgJiYgbm9kZS5qc0RvY1swXS5jb21tZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwcy5kZXNjcmlwdGlvbiA9IG1hcmtlZChub2RlLmpzRG9jWzBdLmNvbW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTW9kdWxlV2l0aFByb3ZpZGVycyhub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByb3V0aW5nSW5pdGlhbGl6ZXIgPSBnZXRNb2R1bGVXaXRoUHJvdmlkZXJzKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJvdXRlclBhcnNlclV0aWwuYWRkTW9kdWxlV2l0aFJvdXRlcyhuYW1lLCBbcm91dGluZ0luaXRpYWxpemVyXSwgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUm91dGVyUGFyc2VyVXRpbC5hZGRNb2R1bGUobmFtZSwgW3JvdXRpbmdJbml0aWFsaXplcl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0lnbm9yZShub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMubWlzY2VsbGFuZW91cy52YXJpYWJsZXMucHVzaChkZXBzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodHMuaXNUeXBlQWxpYXNEZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZm9zID0gdGhpcy52aXNpdFR5cGVEZWNsYXJhdGlvbihub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gaW5mb3MubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZXBzOiBJVHlwZUFsaWFzRGVjRGVwID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R5cGU6ICdtaXNjZWxsYW5lb3VzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJ0eXBlOiAndHlwZWFsaWFzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXd0eXBlOiB0aGlzLmNsYXNzSGVscGVyLnZpc2l0VHlwZShub2RlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLnZpc2l0RW51bVR5cGVBbGlhc0Z1bmN0aW9uRGVjbGFyYXRpb25EZXNjcmlwdGlvbihub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBzLmtpbmQgPSBub2RlLnR5cGUua2luZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNJZ25vcmUobm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTeW1ib2xzLm1pc2NlbGxhbmVvdXMudHlwZWFsaWFzZXMucHVzaChkZXBzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodHMuaXNGdW5jdGlvbkRlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5mb3MgPSB0aGlzLnZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gaW5mb3MubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmdW5jdGlvbkRlcDogSUZ1bmN0aW9uRGVjRGVwID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R5cGU6ICdtaXNjZWxsYW5lb3VzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJ0eXBlOiAnZnVuY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHRoaXMudmlzaXRFbnVtVHlwZUFsaWFzRnVuY3Rpb25EZWNsYXJhdGlvbkRlc2NyaXB0aW9uKG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZm9zLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkRlcC5hcmdzID0gaW5mb3MuYXJncztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmZvcy5yZXR1cm5UeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25EZXAucmV0dXJuVHlwZSA9IGluZm9zLnJldHVyblR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5mb3MuanNkb2N0YWdzICYmIGluZm9zLmpzZG9jdGFncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25EZXAuanNkb2N0YWdzID0gaW5mb3MuanNkb2N0YWdzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbmZvcy5pZ25vcmUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNQcml2YXRlSlNEb2NUYWcoZnVuY3Rpb25EZXAuanNkb2N0YWdzKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlUHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMubWlzY2VsbGFuZW91cy5mdW5jdGlvbnMucHVzaChmdW5jdGlvbkRlcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0cy5pc0VudW1EZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZm9zID0gdGhpcy52aXNpdEVudW1EZWNsYXJhdGlvbihub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gbm9kZS5uYW1lLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW51bURlcHM6IElFbnVtRGVjRGVwID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzOiBpbmZvcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHlwZTogJ21pc2NlbGxhbmVvdXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnR5cGU6ICdlbnVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy52aXNpdEVudW1UeXBlQWxpYXNGdW5jdGlvbkRlY2xhcmF0aW9uRGVzY3JpcHRpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzSWdub3JlKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3ltYm9scy5taXNjZWxsYW5lb3VzLmVudW1lcmF0aW9ucy5wdXNoKGVudW1EZXBzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHBhcnNlTm9kZShmaWxlTmFtZSwgc2Nhbm5lZEZpbGUsIGluaXRpYWxOb2RlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdG8gaW4gYSBzcGVjaWZpYyBzdG9yZSBhbiBlbnRpdHksIGFuZCBjaGVjayBiZWZvcmUgaXMgdGhlcmUgaXMgbm90IHRoZSBzYW1lIG9uZVxuICAgICAqIGluIHRoYXQgc3RvcmUgOiBzYW1lIG5hbWUsIGlkIGFuZCBmaWxlXG4gICAgICogQHBhcmFtIGVudGl0eSBFbnRpdHkgdG8gc3RvcmVcbiAgICAgKiBAcGFyYW0gc3RvcmUgU3RvcmVcbiAgICAgKi9cbiAgICBwcml2YXRlIGFkZE5ld0VudGl0eUluU3RvcmUoZW50aXR5LCBzdG9yZSkge1xuICAgICAgICBsZXQgZmluZFNhbWVFbnRpdHlJblN0b3JlID0gXy5maWx0ZXIoc3RvcmUsIHtcbiAgICAgICAgICAgIG5hbWU6IGVudGl0eS5uYW1lLFxuICAgICAgICAgICAgaWQ6IGVudGl0eS5pZCxcbiAgICAgICAgICAgIGZpbGU6IGVudGl0eS5maWxlXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZmluZFNhbWVFbnRpdHlJblN0b3JlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgc3RvcmUucHVzaChlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWJ1ZyhkZXBzOiBJRGVwKSB7XG4gICAgICAgIGlmIChkZXBzKSB7XG4gICAgICAgICAgICBsb2dnZXIuZGVidWcoJ2ZvdW5kJywgYCR7ZGVwcy5uYW1lfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFsnaW1wb3J0cycsICdleHBvcnRzJywgJ2RlY2xhcmF0aW9ucycsICdwcm92aWRlcnMnLCAnYm9vdHN0cmFwJ10uZm9yRWFjaChzeW1ib2xzID0+IHtcbiAgICAgICAgICAgIGlmIChkZXBzW3N5bWJvbHNdICYmIGRlcHNbc3ltYm9sc10ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnJywgYC0gJHtzeW1ib2xzfTpgKTtcbiAgICAgICAgICAgICAgICBkZXBzW3N5bWJvbHNdXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoaSA9PiBpLm5hbWUpXG4gICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKGQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCcnLCBgXFx0LSAke2R9YCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlnbm9yZShkZXBzOiBJRGVwKSB7XG4gICAgICAgIGlmIChkZXBzKSB7XG4gICAgICAgICAgICBsb2dnZXIud2FybignaWdub3JlJywgYCR7ZGVwcy5uYW1lfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kRXhwcmVzc2lvbkJ5TmFtZUluRXhwcmVzc2lvbnMoZW50cnlOb2RlLCBuYW1lKSB7XG4gICAgICAgIGxldCByZXN1bHQ7XG4gICAgICAgIGxldCBsb29wID0gZnVuY3Rpb24obm9kZSwgeikge1xuICAgICAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5leHByZXNzaW9uICYmICFub2RlLmV4cHJlc3Npb24ubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBsb29wKG5vZGUuZXhwcmVzc2lvbiwgeik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub2RlLmV4cHJlc3Npb24gJiYgbm9kZS5leHByZXNzaW9uLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuZXhwcmVzc2lvbi5uYW1lLnRleHQgPT09IHopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IG5vZGU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb29wKG5vZGUuZXhwcmVzc2lvbiwgeik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGxvb3AoZW50cnlOb2RlLCBuYW1lKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmRFeHByZXNzaW9uQnlOYW1lSW5FeHByZXNzaW9uQXJndW1lbnRzKGFyZywgbmFtZSkge1xuICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IGxlbiA9IGFyZy5sZW5ndGg7XG4gICAgICAgIGxldCBsb29wID0gZnVuY3Rpb24obm9kZSwgeikge1xuICAgICAgICAgICAgaWYgKG5vZGUuYm9keSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmJvZHkuc3RhdGVtZW50cyAmJiBub2RlLmJvZHkuc3RhdGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxlbmcgPSBub2RlLmJvZHkuc3RhdGVtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoajsgaiA8IGxlbmc7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhhdC5maW5kRXhwcmVzc2lvbkJ5TmFtZUluRXhwcmVzc2lvbnMobm9kZS5ib2R5LnN0YXRlbWVudHNbal0sIHopO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbG9vcChhcmdbaV0sIG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYXJzZURlY29yYXRvcnMoZGVjb3JhdG9ycywgdHlwZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgaWYgKGRlY29yYXRvcnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgXy5mb3JFYWNoKGRlY29yYXRvcnMsIGZ1bmN0aW9uKGRlY29yYXRvcjogYW55KSB7XG4gICAgICAgICAgICAgICAgaWYgKGRlY29yYXRvci5leHByZXNzaW9uLmV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlY29yYXRvci5leHByZXNzaW9uLmV4cHJlc3Npb24udGV4dCA9PT0gdHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRlY29yYXRvcnNbMF0uZXhwcmVzc2lvbi5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRlY29yYXRvcnNbMF0uZXhwcmVzc2lvbi5leHByZXNzaW9uLnRleHQgPT09IHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBhcnNlRGVjb3JhdG9yKGRlY29yYXRvciwgdHlwZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgaWYgKGRlY29yYXRvci5leHByZXNzaW9uLmV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIGlmIChkZWNvcmF0b3IuZXhwcmVzc2lvbi5leHByZXNzaW9uLnRleHQgPT09IHR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0NvbnRyb2xsZXIobWV0YWRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEZWNvcmF0b3IobWV0YWRhdGEsICdDb250cm9sbGVyJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0NvbXBvbmVudChtZXRhZGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURlY29yYXRvcihtZXRhZGF0YSwgJ0NvbXBvbmVudCcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNQaXBlKG1ldGFkYXRhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlRGVjb3JhdG9yKG1ldGFkYXRhLCAnUGlwZScpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNEaXJlY3RpdmUobWV0YWRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEZWNvcmF0b3IobWV0YWRhdGEsICdEaXJlY3RpdmUnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzSW5qZWN0YWJsZShtZXRhZGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURlY29yYXRvcihtZXRhZGF0YSwgJ0luamVjdGFibGUnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzTW9kdWxlKG1ldGFkYXRhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlRGVjb3JhdG9yKG1ldGFkYXRhLCAnTmdNb2R1bGUnKSB8fCB0aGlzLnBhcnNlRGVjb3JhdG9yKG1ldGFkYXRhLCAnTW9kdWxlJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYXNJbnRlcm5hbERlY29yYXRvcihtZXRhZGF0YXMpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMucGFyc2VEZWNvcmF0b3JzKG1ldGFkYXRhcywgJ0NvbnRyb2xsZXInKSB8fFxuICAgICAgICAgICAgdGhpcy5wYXJzZURlY29yYXRvcnMobWV0YWRhdGFzLCAnQ29tcG9uZW50JykgfHxcbiAgICAgICAgICAgIHRoaXMucGFyc2VEZWNvcmF0b3JzKG1ldGFkYXRhcywgJ1BpcGUnKSB8fFxuICAgICAgICAgICAgdGhpcy5wYXJzZURlY29yYXRvcnMobWV0YWRhdGFzLCAnRGlyZWN0aXZlJykgfHxcbiAgICAgICAgICAgIHRoaXMucGFyc2VEZWNvcmF0b3JzKG1ldGFkYXRhcywgJ0luamVjdGFibGUnKSB8fFxuICAgICAgICAgICAgdGhpcy5wYXJzZURlY29yYXRvcnMobWV0YWRhdGFzLCAnTmdNb2R1bGUnKSB8fFxuICAgICAgICAgICAgdGhpcy5wYXJzZURlY29yYXRvcnMobWV0YWRhdGFzLCAnTW9kdWxlJylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzR3VhcmQoaW9JbXBsZW1lbnRzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgXy5pbmNsdWRlcyhpb0ltcGxlbWVudHMsICdDYW5BY3RpdmF0ZScpIHx8XG4gICAgICAgICAgICBfLmluY2x1ZGVzKGlvSW1wbGVtZW50cywgJ0NhbkFjdGl2YXRlQ2hpbGQnKSB8fFxuICAgICAgICAgICAgXy5pbmNsdWRlcyhpb0ltcGxlbWVudHMsICdDYW5EZWFjdGl2YXRlJykgfHxcbiAgICAgICAgICAgIF8uaW5jbHVkZXMoaW9JbXBsZW1lbnRzLCAnUmVzb2x2ZScpIHx8XG4gICAgICAgICAgICBfLmluY2x1ZGVzKGlvSW1wbGVtZW50cywgJ0NhbkxvYWQnKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U3ltYm9sZU5hbWUobm9kZSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBub2RlLm5hbWUudGV4dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmRQcm9wZXJ0aWVzKFxuICAgICAgICB2aXNpdGVkTm9kZTogdHMuRGVjb3JhdG9yLFxuICAgICAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlXG4gICAgKTogUmVhZG9ubHlBcnJheTx0cy5PYmplY3RMaXRlcmFsRWxlbWVudExpa2U+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdmlzaXRlZE5vZGUuZXhwcmVzc2lvbiAmJlxuICAgICAgICAgICAgdmlzaXRlZE5vZGUuZXhwcmVzc2lvbi5hcmd1bWVudHMgJiZcbiAgICAgICAgICAgIHZpc2l0ZWROb2RlLmV4cHJlc3Npb24uYXJndW1lbnRzLmxlbmd0aCA+IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBsZXQgcG9wID0gdmlzaXRlZE5vZGUuZXhwcmVzc2lvbi5hcmd1bWVudHNbMF07XG5cbiAgICAgICAgICAgIGlmIChwb3AgJiYgcG9wLnByb3BlcnRpZXMgJiYgcG9wLnByb3BlcnRpZXMubGVuZ3RoID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9wLnByb3BlcnRpZXM7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBvcCAmJiBwb3Aua2luZCAmJiBwb3Aua2luZCA9PT0gU3ludGF4S2luZC5TdHJpbmdMaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtwb3BdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIud2FybignRW1wdHkgbWV0YWRhdGFzLCB0cnlpbmcgdG8gZm91bmQgaXQgd2l0aCBpbXBvcnRzLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiBJbXBvcnRzVXRpbC5maW5kVmFsdWVJbkltcG9ydE9yTG9jYWxWYXJpYWJsZXMocG9wLnRleHQsIHNvdXJjZUZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNBbmd1bGFyTGlmZWN5Y2xlSG9vayhtZXRob2ROYW1lKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb3B5cmlnaHQgaHR0cHM6Ly9naXRodWIuY29tL25nLWJvb3RzdHJhcC9uZy1ib290c3RyYXBcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IEFOR1VMQVJfTElGRUNZQ0xFX01FVEhPRFMgPSBbXG4gICAgICAgICAgICAnbmdPbkluaXQnLFxuICAgICAgICAgICAgJ25nT25DaGFuZ2VzJyxcbiAgICAgICAgICAgICduZ0RvQ2hlY2snLFxuICAgICAgICAgICAgJ25nT25EZXN0cm95JyxcbiAgICAgICAgICAgICduZ0FmdGVyQ29udGVudEluaXQnLFxuICAgICAgICAgICAgJ25nQWZ0ZXJDb250ZW50Q2hlY2tlZCcsXG4gICAgICAgICAgICAnbmdBZnRlclZpZXdJbml0JyxcbiAgICAgICAgICAgICduZ0FmdGVyVmlld0NoZWNrZWQnLFxuICAgICAgICAgICAgJ3dyaXRlVmFsdWUnLFxuICAgICAgICAgICAgJ3JlZ2lzdGVyT25DaGFuZ2UnLFxuICAgICAgICAgICAgJ3JlZ2lzdGVyT25Ub3VjaGVkJyxcbiAgICAgICAgICAgICdzZXREaXNhYmxlZFN0YXRlJ1xuICAgICAgICBdO1xuICAgICAgICByZXR1cm4gQU5HVUxBUl9MSUZFQ1lDTEVfTUVUSE9EUy5pbmRleE9mKG1ldGhvZE5hbWUpID49IDA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdFR5cGVEZWNsYXJhdGlvbihub2RlOiB0cy5UeXBlQWxpYXNEZWNsYXJhdGlvbikge1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnkgPSB7XG4gICAgICAgICAgICBuYW1lOiBub2RlLm5hbWUudGV4dCxcbiAgICAgICAgICAgIGtpbmQ6IG5vZGUua2luZFxuICAgICAgICB9O1xuICAgICAgICBsZXQganNkb2N0YWdzID0gdGhpcy5qc2RvY1BhcnNlclV0aWwuZ2V0SlNEb2NzKG5vZGUpO1xuXG4gICAgICAgIGlmIChqc2RvY3RhZ3MgJiYganNkb2N0YWdzLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICBpZiAoanNkb2N0YWdzWzBdLnRhZ3MpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuanNkb2N0YWdzID0gbWFya2VkdGFncyhqc2RvY3RhZ3NbMF0udGFncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZpc2l0QXJndW1lbnQoYXJnKSB7XG4gICAgICAgIGxldCByZXN1bHQ6IGFueSA9IHtcbiAgICAgICAgICAgIG5hbWU6IGFyZy5uYW1lLnRleHQsXG4gICAgICAgICAgICB0eXBlOiB0aGlzLmNsYXNzSGVscGVyLnZpc2l0VHlwZShhcmcpXG4gICAgICAgIH07XG4gICAgICAgIGlmIChhcmcuZG90RG90RG90VG9rZW4pIHtcbiAgICAgICAgICAgIHJlc3VsdC5kb3REb3REb3RUb2tlbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZy5xdWVzdGlvblRva2VuKSB7XG4gICAgICAgICAgICByZXN1bHQub3B0aW9uYWwgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmcudHlwZSkge1xuICAgICAgICAgICAgcmVzdWx0LnR5cGUgPSB0aGlzLm1hcFR5cGUoYXJnLnR5cGUua2luZCk7XG4gICAgICAgICAgICBpZiAoYXJnLnR5cGUua2luZCA9PT0gMTU3KSB7XG4gICAgICAgICAgICAgICAgLy8gdHJ5IHJlcGxhY2UgVHlwZVJlZmVyZW5jZSB3aXRoIHR5cGVOYW1lXG4gICAgICAgICAgICAgICAgaWYgKGFyZy50eXBlLnR5cGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC50eXBlID0gYXJnLnR5cGUudHlwZU5hbWUudGV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1hcFR5cGUodHlwZSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSA5NTpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ251bGwnO1xuICAgICAgICAgICAgY2FzZSAxMTk6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdhbnknO1xuICAgICAgICAgICAgY2FzZSAxMjI6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdib29sZWFuJztcbiAgICAgICAgICAgIGNhc2UgMTMwOlxuICAgICAgICAgICAgICAgIHJldHVybiAnbmV2ZXInO1xuICAgICAgICAgICAgY2FzZSAxMzM6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdudW1iZXInO1xuICAgICAgICAgICAgY2FzZSAxMzY6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdzdHJpbmcnO1xuICAgICAgICAgICAgY2FzZSAxMzk6XG4gICAgICAgICAgICAgICAgcmV0dXJuICd1bmRlZmluZWQnO1xuICAgICAgICAgICAgY2FzZSAxNTk6XG4gICAgICAgICAgICAgICAgcmV0dXJuICd0eXBlUmVmZXJlbmNlJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFzUHJpdmF0ZUpTRG9jVGFnKHRhZ3MpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBpZiAodGFncykge1xuICAgICAgICAgICAgdGFncy5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRhZy50YWdOYW1lICYmIHRhZy50YWdOYW1lICYmIHRhZy50YWdOYW1lLnRleHQgPT09ICdwcml2YXRlJykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24obWV0aG9kOiB0cy5GdW5jdGlvbkRlY2xhcmF0aW9uKSB7XG4gICAgICAgIGxldCBtZXRob2ROYW1lID0gbWV0aG9kLm5hbWUgPyBtZXRob2QubmFtZS50ZXh0IDogJ1VubmFtZWQgZnVuY3Rpb24nO1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnkgPSB7XG4gICAgICAgICAgICBuYW1lOiBtZXRob2ROYW1lLFxuICAgICAgICAgICAgYXJnczogbWV0aG9kLnBhcmFtZXRlcnMgPyBtZXRob2QucGFyYW1ldGVycy5tYXAocHJvcCA9PiB0aGlzLnZpc2l0QXJndW1lbnQocHJvcCkpIDogW11cbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGpzZG9jdGFncyA9IHRoaXMuanNkb2NQYXJzZXJVdGlsLmdldEpTRG9jcyhtZXRob2QpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgbWV0aG9kLnR5cGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXN1bHQucmV0dXJuVHlwZSA9IHRoaXMuY2xhc3NIZWxwZXIudmlzaXRUeXBlKG1ldGhvZC50eXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXRob2QubW9kaWZpZXJzKSB7XG4gICAgICAgICAgICBpZiAobWV0aG9kLm1vZGlmaWVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGtpbmRzID0gbWV0aG9kLm1vZGlmaWVyc1xuICAgICAgICAgICAgICAgICAgICAubWFwKG1vZGlmaWVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtb2RpZmllci5raW5kO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgXy5pbmRleE9mKGtpbmRzLCBTeW50YXhLaW5kLlB1YmxpY0tleXdvcmQpICE9PSAtMSAmJlxuICAgICAgICAgICAgICAgICAgICBfLmluZGV4T2Yoa2luZHMsIFN5bnRheEtpbmQuU3RhdGljS2V5d29yZCkgIT09IC0xXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGtpbmRzID0ga2luZHMuZmlsdGVyKGtpbmQgPT4ga2luZCAhPT0gU3ludGF4S2luZC5QdWJsaWNLZXl3b3JkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGpzZG9jdGFncyAmJiBqc2RvY3RhZ3MubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgIGlmIChqc2RvY3RhZ3NbMF0udGFncykge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5qc2RvY3RhZ3MgPSBtYXJrZWR0YWdzKGpzZG9jdGFnc1swXS50YWdzKTtcbiAgICAgICAgICAgICAgICBfLmZvckVhY2goanNkb2N0YWdzWzBdLnRhZ3MsIHRhZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWcudGFnTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhZy50YWdOYW1lLnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFnLnRhZ05hbWUudGV4dC5pbmRleE9mKCdpZ25vcmUnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5pZ25vcmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQuanNkb2N0YWdzICYmIHJlc3VsdC5qc2RvY3RhZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVzdWx0LmpzZG9jdGFncyA9IG1lcmdlVGFnc0FuZEFyZ3MocmVzdWx0LmFyZ3MsIHJlc3VsdC5qc2RvY3RhZ3MpO1xuICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5hcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJlc3VsdC5qc2RvY3RhZ3MgPSBtZXJnZVRhZ3NBbmRBcmdzKHJlc3VsdC5hcmdzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgdmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucykge1xuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgbGV0IGxlbiA9IG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQ6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zW2ldLm5hbWUudGV4dCxcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiBub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbaV0uaW5pdGlhbGl6ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5jbGFzc0hlbHBlci5zdHJpbmdpZnlEZWZhdWx0VmFsdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbaV0uaW5pdGlhbGl6ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbaV0uaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmluaXRpYWxpemVyID0gbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zW2ldLmluaXRpYWxpemVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zW2ldLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnR5cGUgPSB0aGlzLmNsYXNzSGVscGVyLnZpc2l0VHlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9uc1tpXS50eXBlXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0LnR5cGUgPT09ICd1bmRlZmluZWQnICYmIHJlc3VsdC5pbml0aWFsaXplcikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQudHlwZSA9IGtpbmRUb1R5cGUocmVzdWx0LmluaXRpYWxpemVyLmtpbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb25KU0RvY1RhZ3Mobm9kZTogdHMuRnVuY3Rpb25EZWNsYXJhdGlvbik6IHN0cmluZyB7XG4gICAgICAgIGxldCBqc2RvY3RhZ3MgPSB0aGlzLmpzZG9jUGFyc2VyVXRpbC5nZXRKU0RvY3Mobm9kZSk7XG4gICAgICAgIGxldCByZXN1bHQ7XG4gICAgICAgIGlmIChqc2RvY3RhZ3MgJiYganNkb2N0YWdzLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICBpZiAoanNkb2N0YWdzWzBdLnRhZ3MpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBtYXJrZWR0YWdzKGpzZG9jdGFnc1swXS50YWdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgdmlzaXRFbnVtVHlwZUFsaWFzRnVuY3Rpb25EZWNsYXJhdGlvbkRlc2NyaXB0aW9uKG5vZGUpOiBzdHJpbmcge1xuICAgICAgICBsZXQgZGVzY3JpcHRpb246IHN0cmluZyA9ICcnO1xuICAgICAgICBpZiAobm9kZS5qc0RvYykge1xuICAgICAgICAgICAgaWYgKG5vZGUuanNEb2MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZS5qc0RvY1swXS5jb21tZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IG1hcmtlZChub2RlLmpzRG9jWzBdLmNvbW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdEVudW1EZWNsYXJhdGlvbihub2RlOiB0cy5FbnVtRGVjbGFyYXRpb24pIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBpZiAobm9kZS5tZW1iZXJzKSB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gbm9kZS5tZW1iZXJzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1lbWJlcjogYW55ID0ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBub2RlLm1lbWJlcnNbaV0ubmFtZS50ZXh0XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5tZW1iZXJzW2ldLmluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lbWJlci52YWx1ZSA9IG5vZGUubWVtYmVyc1tpXS5pbml0aWFsaXplci50ZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChtZW1iZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdEVudW1EZWNsYXJhdGlvbkZvclJvdXRlcyhmaWxlTmFtZSwgbm9kZSkge1xuICAgICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zKSB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJvdXRlc0luaXRpYWxpemVyID0gbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zW2ldLmluaXRpYWxpemVyO1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gbmV3IENvZGVHZW5lcmF0b3IoKS5nZW5lcmF0ZShyb3V0ZXNJbml0aWFsaXplcik7XG4gICAgICAgICAgICAgICAgUm91dGVyUGFyc2VyVXRpbC5hZGRSb3V0ZSh7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9uc1tpXS5uYW1lLnRleHQsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IFJvdXRlclBhcnNlclV0aWwuY2xlYW5SYXdSb3V0ZShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IGZpbGVOYW1lXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBkYXRhXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFJvdXRlSU8oZmlsZW5hbWU6IHN0cmluZywgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgbm9kZTogdHMuTm9kZSkge1xuICAgICAgICBsZXQgcmVzO1xuICAgICAgICBpZiAoc291cmNlRmlsZS5zdGF0ZW1lbnRzKSB7XG4gICAgICAgICAgICByZXMgPSBzb3VyY2VGaWxlLnN0YXRlbWVudHMucmVkdWNlKChkaXJlY3RpdmUsIHN0YXRlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChSb3V0ZXJQYXJzZXJVdGlsLmlzVmFyaWFibGVSb3V0ZXMoc3RhdGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGVtZW50LnBvcyA9PT0gbm9kZS5wb3MgJiYgc3RhdGVtZW50LmVuZCA9PT0gbm9kZS5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkaXJlY3RpdmUuY29uY2F0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlzaXRFbnVtRGVjbGFyYXRpb25Gb3JSb3V0ZXMoZmlsZW5hbWUsIHN0YXRlbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc1swXSB8fCB7fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q2xhc3NJTyhmaWxlbmFtZTogc3RyaW5nLCBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCBub2RlOiB0cy5Ob2RlLCBmaWxlQm9keSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQ29weXJpZ2h0IGh0dHBzOi8vZ2l0aHViLmNvbS9uZy1ib290c3RyYXAvbmctYm9vdHN0cmFwXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgcmVkdWNlZFNvdXJjZSA9IGZpbGVCb2R5ID8gZmlsZUJvZHkuc3RhdGVtZW50cyA6IHNvdXJjZUZpbGUuc3RhdGVtZW50cztcbiAgICAgICAgbGV0IHJlcyA9IHJlZHVjZWRTb3VyY2UucmVkdWNlKChkaXJlY3RpdmUsIHN0YXRlbWVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRzLmlzQ2xhc3NEZWNsYXJhdGlvbihzdGF0ZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlbWVudC5wb3MgPT09IG5vZGUucG9zICYmIHN0YXRlbWVudC5lbmQgPT09IG5vZGUuZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkaXJlY3RpdmUuY29uY2F0KFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGFzc0hlbHBlci52aXNpdENsYXNzRGVjbGFyYXRpb24oZmlsZW5hbWUsIHN0YXRlbWVudCwgc291cmNlRmlsZSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG4gICAgICAgIH0sIFtdKTtcblxuICAgICAgICByZXR1cm4gcmVzWzBdIHx8IHt9O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SW50ZXJmYWNlSU8oZmlsZW5hbWU6IHN0cmluZywgc291cmNlRmlsZSwgbm9kZSwgZmlsZUJvZHkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvcHlyaWdodCBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcFxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IHJlZHVjZWRTb3VyY2UgPSBmaWxlQm9keSA/IGZpbGVCb2R5LnN0YXRlbWVudHMgOiBzb3VyY2VGaWxlLnN0YXRlbWVudHM7XG4gICAgICAgIGxldCByZXMgPSByZWR1Y2VkU291cmNlLnJlZHVjZSgoZGlyZWN0aXZlLCBzdGF0ZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0cy5pc0ludGVyZmFjZURlY2xhcmF0aW9uKHN0YXRlbWVudCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGVtZW50LnBvcyA9PT0gbm9kZS5wb3MgJiYgc3RhdGVtZW50LmVuZCA9PT0gbm9kZS5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZS5jb25jYXQoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzSGVscGVyLnZpc2l0Q2xhc3NEZWNsYXJhdGlvbihmaWxlbmFtZSwgc3RhdGVtZW50LCBzb3VyY2VGaWxlKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcbiAgICAgICAgfSwgW10pO1xuXG4gICAgICAgIHJldHVybiByZXNbMF0gfHwge307XG4gICAgfVxufVxuIl19