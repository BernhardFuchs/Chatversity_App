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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kZXBlbmRlbmNpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2NvbXBpbGVyL2FuZ3VsYXItZGVwZW5kZW5jaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJCQUE2QjtBQUU3QiwwQkFBNEI7QUFDNUIsK0NBQW9EO0FBRXBELHlEQUFzRDtBQUN0RCw2Q0FBNEM7QUFDNUMsMkNBQWlHO0FBQ2pHLDRFQUFxRTtBQUVyRSxtRUFBaUU7QUFFakUseURBQW1EO0FBRW5ELHFDQUtxQjtBQUVyQix1RUFBNEQ7QUFFNUQscUVBQThEO0FBRTlELDJEQUF5RDtBQUV6RCw4RUFBMkU7QUFDM0UsZ0ZBQTZFO0FBQzdFLDhFQUEyRTtBQUMzRSw0RUFBeUU7QUFDekUsc0VBQW1FO0FBQ25FLHNFQUFvRTtBQUNwRSxzRUFBb0U7QUFDcEUsd0VBQXFFO0FBRXJFLGtEQUE2QztBQVk3QyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pDLElBQU0sR0FBRyxHQUFHLElBQUksdUJBQUcsRUFBRSxDQUFDO0FBRXRCLGlHQUFpRztBQUVqRztJQUF5Qyx1Q0FBcUI7SUFRMUQsNkJBQVksS0FBZSxFQUFFLE9BQVk7UUFBekMsWUFDSSxrQkFBTSxLQUFLLEVBQUUsT0FBTyxDQUFDLFNBQ3hCO1FBUk8sV0FBSyxHQUFtQixJQUFJLGlDQUFjLEVBQUUsQ0FBQztRQUM3QyxrQkFBWSxHQUFHLElBQUksNEJBQVksQ0FBQyxLQUFJLENBQUMsS0FBSyxD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SSxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQzFELE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FDbkIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUMxRSxDQUFDO2lCQUNMO2FBQ0o7WUFFRCxPQUFPLFNBQVMsQ0FBQztRQUNyQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFUCxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUNMLDBCQUFDO0FBQUQsQ0FBQyxBQTdzQ0QsQ0FBeUMsOENBQXFCLEdBNnNDN0Q7QUE3c0NZLGtEQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBBc3QsIHsgdHMsIFN5bnRheEtpbmQgfSBmcm9tICd0cy1zaW1wbGUtYXN0JztcblxuaW1wb3J0IHsga2luZFRvVHlwZSB9IGZyb20gJy4uLy4uL3V0aWxzL2tpbmQtdG8tdHlwZSc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHsgY2xlYW5MaWZlY3ljbGVIb29rc0Zyb21NZXRob2RzLCBtYXJrZWR0YWdzLCBtZXJnZVRhZ3NBbmRBcmdzIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXRpbHMnO1xuaW1wb3J0IENvbXBvbmVudHNUcmVlRW5naW5lIGZyb20gJy4uL2VuZ2luZXMvY29tcG9uZW50cy10cmVlLmVuZ2luZSc7XG5cbmltcG9ydCB7IEZyYW1ld29ya0RlcGVuZGVuY2llcyB9IGZyb20gJy4vZnJhbWV3b3JrLWRlcGVuZGVuY2llcyc7XG5cbmltcG9ydCBJbXBvcnRzVXRpbCBmcm9tICcuLi8uLi91dGlscy9pbXBvcnRzLnV0aWwnO1xuXG5pbXBvcnQge1xuICAgIGdldE1vZHVsZVdpdGhQcm92aWRlcnMsXG4gICAgaXNJZ25vcmUsXG4gICAgaXNNb2R1bGVXaXRoUHJvdmlkZXJzLFxuICAgIEpzZG9jUGFyc2VyVXRpbFxufSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmltcG9ydCBFeHRlbmRzTWVyZ2VyIGZyb20gJy4uLy4uL3V0aWxzL2V4dGVuZHMtbWVyZ2VyLnV0aWwnO1xuXG5pbXBvcnQgUm91dGVyUGFyc2VyVXRpbCBmcm9tICcuLi8uLi91dGlscy9yb3V0ZXItcGFyc2VyLnV0aWwnO1xuXG5pbXBvcnQgeyBDb2RlR2VuZXJhdG9yIH0gZnJvbSAnLi9hbmd1bGFyL2NvZGUtZ2VuZXJhdG9yJztcblxuaW1wb3J0IHsgQ29tcG9uZW50RGVwRmFjdG9yeSB9IGZyb20gJy4vYW5ndWxhci9kZXBzL2NvbXBvbmVudC1kZXAuZmFjdG9yeSc7XG5pbXBvcnQgeyBDb250cm9sbGVyRGVwRmFjdG9yeSB9IGZyb20gJy4vYW5ndWxhci9kZXBzL2NvbnRyb2xsZXItZGVwLmZhY3RvcnknO1xuaW1wb3J0IHsgRGlyZWN0aXZlRGVwRmFjdG9yeSB9IGZyb20gJy4vYW5ndWxhci9kZXBzL2RpcmVjdGl2ZS1kZXAuZmFjdG9yeSc7XG5pbXBvcnQgeyBDb21wb25lbnRDYWNoZSB9IGZyb20gJy4vYW5ndWxhci9kZXBzL2hlbHBlcnMvY29tcG9uZW50LWhlbHBlcic7XG5pbXBvcnQgeyBKc0RvY0hlbHBlciB9IGZyb20gJy4vYW5ndWxhci9kZXBzL2hlbHBlcnMvanMtZG9jLWhlbHBlcic7XG5pbXBvcnQgeyBNb2R1bGVIZWxwZXIgfSBmcm9tICcuL2FuZ3VsYXIvZGVwcy9oZWxwZXJzL21vZHVsZS1oZWxwZXInO1xuaW1wb3J0IHsgU3ltYm9sSGVscGVyIH0gZnJvbSAnLi9hbmd1bGFyL2RlcHMvaGVscGVycy9zeW1ib2wtaGVscGVyJztcbmltcG9ydCB7IE1vZHVsZURlcEZhY3RvcnkgfSBmcm9tICcuL2FuZ3VsYXIvZGVwcy9tb2R1bGUtZGVwLmZhY3RvcnknO1xuXG5pbXBvcnQgQ29uZmlndXJhdGlvbiBmcm9tICcuLi9jb25maWd1cmF0aW9uJztcblxuaW1wb3J0IHtcbiAgICBJRGVwLFxuICAgIElFbnVtRGVjRGVwLFxuICAgIElGdW5jdGlvbkRlY0RlcCxcbiAgICBJSW5qZWN0YWJsZURlcCxcbiAgICBJSW50ZXJmYWNlRGVwLFxuICAgIElQaXBlRGVwLFxuICAgIElUeXBlQWxpYXNEZWNEZXBcbn0gZnJvbSAnLi9hbmd1bGFyL2RlcGVuZGVuY2llcy5pbnRlcmZhY2VzJztcblxuY29uc3QgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5jb25zdCBtYXJrZWQgPSByZXF1aXJlKCdtYXJrZWQnKTtcbmNvbnN0IGFzdCA9IG5ldyBBc3QoKTtcblxuLy8gVHlwZVNjcmlwdCByZWZlcmVuY2UgOiBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvYmxvYi9tYXN0ZXIvbGliL3R5cGVzY3JpcHQuZC50c1xuXG5leHBvcnQgY2xhc3MgQW5ndWxhckRlcGVuZGVuY2llcyBleHRlbmRzIEZyYW1ld29ya0RlcGVuZGVuY2llcyB7XG4gICAgcHJpdmF0ZSBlbmdpbmU6IGFueTtcbiAgICBwcml2YXRlIGNhY2hlOiBDb21wb25lbnRDYWNoZSA9IG5ldyBDb21wb25lbnRDYWNoZSgpO1xuICAgIHByaXZhdGUgbW9kdWxlSGVscGVyID0gbmV3IE1vZHVsZUhlbHBlcih0aGlzLmNhY2hlKTtcbiAgICBwcml2YXRlIGpzRG9jSGVscGVyID0gbmV3IEpzRG9jSGVscGVyKCk7XG4gICAgcHJpdmF0ZSBzeW1ib2xIZWxwZXIgPSBuZXcgU3ltYm9sSGVscGVyKCk7XG4gICAgcHJpdmF0ZSBqc2RvY1BhcnNlclV0aWwgPSBuZXcgSnNkb2NQYXJzZXJVdGlsKCk7XG5cbiAgICBjb25zdHJ1Y3RvcihmaWxlczogc3RyaW5nW10sIG9wdGlvbnM6IGFueSkge1xuICAgICAgICBzdXBlcihmaWxlcywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldERlcGVuZGVuY2llcygpIHtcbiAgICAgICAgbGV0IGRlcHMgPSB7XG4gICAgICAgICAgICBtb2R1bGVzOiBbXSxcbiAgICAgICAgICAgIG1vZHVsZXNGb3JHcmFwaDogW10sXG4gICAgICAgICAgICBjb21wb25lbnRzOiBbXSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJzOiBbXSxcbiAgICAgICAgICAgIGluamVjdGFibGVzOiBbXSxcbiAgICAgICAgICAgIGludGVyY2VwdG9yczogW10sXG4gICAgICAgICAgICBndWFyZHM6IFtdLFxuICAgICAgICAgICAgcGlwZXM6IFtdLFxuICAgICAgICAgICAgZGlyZWN0aXZlczogW10sXG4gICAgICAgICAgICByb3V0ZXM6IFtdLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBpbnRlcmZhY2VzOiBbXSxcbiAgICAgICAgICAgIG1pc2NlbGxhbmVvdXM6IHtcbiAgICAgICAgICAgICAgICB2YXJpYWJsZXM6IFtdLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uczogW10sXG4gICAgICAgICAgICAgICAgdHlwZWFsaWFzZXM6IFtdLFxuICAgICAgICAgICAgICAgIGVudW1lcmF0aW9uczogW11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByb3V0ZXNUcmVlOiB1bmRlZmluZWRcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgc291cmNlRmlsZXMgPSB0aGlzLnByb2dyYW0uZ2V0U291cmNlRmlsZXMoKSB8fCBbXTtcblxuICAgICAgICBzb3VyY2VGaWxlcy5tYXAoKGZpbGU6IHRzLlNvdXJjZUZpbGUpID0+IHtcbiAgICAgICAgICAgIGxldCBmaWxlUGF0aCA9IGZpbGUuZmlsZU5hbWU7XG5cbiAgICAgICAgICAgIGlmIChwYXRoLmV4dG5hbWUoZmlsZVBhdGgpID09PSAnLnRzJyB8fCBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpID09PSAnLnRzeCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoIUNvbmZpZ3VyYXRpb24ubWFpbkRhdGEuYW5ndWxhckpTUHJvamVjdCAmJiBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpID09PSAnLmpzJykge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygncGFyc2luZycsIGZpbGVQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTb3VyY2VGaWxlRGVjb3JhdG9ycyhmaWxlLCBkZXBzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlUGF0aC5sYXN0SW5kZXhPZignLmQudHMnKSA9PT0gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoLmxhc3RJbmRleE9mKCdzcGVjLnRzJykgPT09IC0xXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ3BhcnNpbmcnLCBmaWxlUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFNvdXJjZUZpbGVEZWNvcmF0b3JzKGZpbGUsIGRlcHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGVwcztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRW5kIG9mIGZpbGUgc2Nhbm5pbmdcbiAgICAgICAgLy8gVHJ5IG1lcmdpbmcgaW5zaWRlIHRoZSBzYW1lIGZpbGUgZGVjbGFyYXRlZCB2YXJpYWJsZXMgJiBtb2R1bGVzIHdpdGggaW1wb3J0cyB8IGV4cG9ydHMgfCBkZWNsYXJhdGlvbnMgfCBwcm92aWRlcnNcblxuICAgICAgICBpZiAoZGVwcy5taXNjZWxsYW5lb3VzLnZhcmlhYmxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkZXBzLm1pc2NlbGxhbmVvdXMudmFyaWFibGVzLmZvckVhY2goX3ZhcmlhYmxlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbmV3VmFyID0gW107XG4gICAgICAgICAgICAgICAgKChfdmFyLCBfbmV3VmFyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGdldFR5cGUgcHIgcmVjb25zdHJ1aXJlLi4uLlxuICAgICAgICAgICAgICAgICAgICBpZiAoX3Zhci5pbml0aWFsaXplcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF92YXIuaW5pdGlhbGl6ZXIuZWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX3Zhci5pbml0aWFsaXplci5lbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF92YXIuaW5pdGlhbGl6ZXIuZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdWYXIucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGVsZW1lbnQudGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5zeW1ib2xIZWxwZXIuZ2V0VHlwZShlbGVtZW50LnRleHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKF92YXJpYWJsZSwgbmV3VmFyKTtcblxuICAgICAgICAgICAgICAgIGxldCBvbkxpbmsgPSBtb2QgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvY2VzcyA9IChpbml0aWFsQXJyYXksIF92YXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleFRvQ2xlYW4gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmluZFZhcmlhYmxlSW5BcnJheSA9IChlbCwgaW5kZXgsIHRoZUFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsLm5hbWUgPT09IF92YXIubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleFRvQ2xlYW4gPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsQXJyYXkuZm9yRWFjaChmaW5kVmFyaWFibGVJbkFycmF5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENsZWFuIGluZGV4ZXMgdG8gcmVwbGFjZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbEFycmF5LnNwbGljZShpbmRleFRvQ2xlYW4sIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCB2YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Zhci5mb3JFYWNoKG5ld0VsZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBfLmZpbmQoaW5pdGlhbEFycmF5LCB7IG5hbWU6IG5ld0VsZS5uYW1lIH0pID09PVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsQXJyYXkucHVzaChuZXdFbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MobW9kLmltcG9ydHMsIF92YXJpYWJsZSk7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MobW9kLmV4cG9ydHMsIF92YXJpYWJsZSk7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MobW9kLmNvbnRyb2xsZXJzLCBfdmFyaWFibGUpO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzKG1vZC5kZWNsYXJhdGlvbnMsIF92YXJpYWJsZSk7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MobW9kLnByb3ZpZGVycywgX3ZhcmlhYmxlKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZGVwcy5tb2R1bGVzLmZvckVhY2gob25MaW5rKTtcbiAgICAgICAgICAgICAgICBkZXBzLm1vZHVsZXNGb3JHcmFwaC5mb3JFYWNoKG9uTGluayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBvbmUgdGhpbmcgZXh0ZW5kcyBhbm90aGVyLCBtZXJnZSB0aGVtLCBvbmx5IGZvciBpbnRlcm5hbCBzb3VyY2VzXG4gICAgICAgICAqIC0gY2xhc3Nlc1xuICAgICAgICAgKiAtIGNvbXBvbmVudHNcbiAgICAgICAgICogLSBpbmplY3RhYmxlc1xuICAgICAgICAgKiBmb3JcbiAgICAgICAgICogLSBpbnB1dHNcbiAgICAgICAgICogLSBvdXRwdXRzXG4gICAgICAgICAqIC0gcHJvcGVydGllc1xuICAgICAgICAgKiAtIG1ldGhvZHNcbiAgICAgICAgICovXG4gICAgICAgIGRlcHMgPSBFeHRlbmRzTWVyZ2VyLm1lcmdlKGRlcHMpO1xuXG4gICAgICAgIC8vIFJvdXRlclBhcnNlclV0aWwucHJpbnRNb2R1bGVzUm91dGVzKCk7XG4gICAgICAgIC8vIFJvdXRlclBhcnNlclV0aWwucHJpbnRSb3V0ZXMoKTtcblxuICAgICAgICBpZiAoIUNvbmZpZ3VyYXRpb24ubWFpbkRhdGEuZGlzYWJsZVJvdXRlc0dyYXBoKSB7XG4gICAgICAgICAgICBSb3V0ZXJQYXJzZXJVdGlsLmxpbmtNb2R1bGVzQW5kUm91dGVzKCk7XG4gICAgICAgICAgICBSb3V0ZXJQYXJzZXJVdGlsLmNvbnN0cnVjdE1vZHVsZXNUcmVlKCk7XG5cbiAgICAgICAgICAgIGRlcHMucm91dGVzVHJlZSA9IFJvdXRlclBhcnNlclV0aWwuY29uc3RydWN0Um91dGVzVHJlZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlcHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcm9jZXNzQ2xhc3Mobm9kZSwgZmlsZSwgc3JjRmlsZSwgb3V0cHV0U3ltYm9scywgZmlsZUJvZHkpIHtcbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLmdldFN5bWJvbGVOYW1lKG5vZGUpO1xuICAgICAgICBsZXQgSU8gPSB0aGlzLmdldENsYXNzSU8oZmlsZSwgc3JjRmlsZSwgbm9kZSwgZmlsZUJvZHkpO1xuICAgICAgICBsZXQgc291cmNlQ29kZSA9IHNyY0ZpbGUuZ2V0VGV4dCgpO1xuICAgICAgICBsZXQgaGFzaCA9IGNyeXB0b1xuICAgICAgICAgICAgLmNyZWF0ZUhhc2goJ21kNScpXG4gICAgICAgICAgICAudXBkYXRlKHNvdXJjZUNvZGUpXG4gICAgICAgICAgICAuZGlnZXN0KCdoZXgnKTtcbiAgICAgICAgbGV0IGRlcHM6IGFueSA9IHtcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICBpZDogJ2NsYXNzLScgKyBuYW1lICsgJy0nICsgaGFzaCxcbiAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICB0eXBlOiAnY2xhc3MnLFxuICAgICAgICAgICAgc291cmNlQ29kZTogc3JjRmlsZS5nZXRUZXh0KClcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGV4Y2x1ZGVGcm9tQ2xhc3NBcnJheSA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChJTy5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgZGVwcy5jb25zdHJ1Y3Rvck9iaiA9IElPLmNvbnN0cnVjdG9yO1xuICAgICAgICB9XG4gICAgICAgIGlmIChJTy5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBkZXBzLnByb3BlcnRpZXMgPSBJTy5wcm9wZXJ0aWVzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChJTy5kZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgZGVwcy5kZXNjcmlwdGlvbiA9IElPLmRlc2NyaXB0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChJTy5yYXdkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgZGVwcy5yYXdkZXNjcmlwdGlvbiA9IElPLnJhd2Rlc2NyaXB0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChJTy5tZXRob2RzKSB7XG4gICAgICAgICAgICBkZXBzLm1ldGhvZHMgPSBJTy5tZXRob2RzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChJTy5pbmRleFNpZ25hdHVyZXMpIHtcbiAgICAgICAgICAgIGRlcHMuaW5kZXhTaWduYXR1cmVzID0gSU8uaW5kZXhTaWduYXR1cmVzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChJTy5leHRlbmRzKSB7XG4gICAgICAgICAgICBkZXBzLmV4dGVuZHMgPSBJTy5leHRlbmRzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChJTy5qc2RvY3RhZ3MgJiYgSU8uanNkb2N0YWdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGRlcHMuanNkb2N0YWdzID0gSU8uanNkb2N0YWdzWzBdLnRhZ3M7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKElPLmFjY2Vzc29ycykge1xuICAgICAgICAgICAgZGVwcy5hY2Nlc3NvcnMgPSBJTy5hY2Nlc3NvcnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKElPLmlucHV0cykge1xuICAgICAgICAgICAgZGVwcy5pbnB1dHNDbGFzcyA9IElPLmlucHV0cztcbiAgICAgICAgfVxuICAgICAgICBpZiAoSU8ub3V0cHV0cykge1xuICAgICAgICAgICAgZGVwcy5vdXRwdXRzQ2xhc3MgPSBJTy5vdXRwdXRzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChJTy5ob3N0QmluZGluZ3MpIHtcbiAgICAgICAgICAgIGRlcHMuaG9zdEJpbmRpbmdzID0gSU8uaG9zdEJpbmRpbmdzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChJTy5ob3N0TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBkZXBzLmhvc3RMaXN0ZW5lcnMgPSBJTy5ob3N0TGlzdGVuZXJzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVMaWZlQ3ljbGVIb29rcykge1xuICAgICAgICAgICAgZGVwcy5tZXRob2RzID0gY2xlYW5MaWZlY3ljbGVIb29rc0Zyb21NZXRob2RzKGRlcHMubWV0aG9kcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKElPLmltcGxlbWVudHMgJiYgSU8uaW1wbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkZXBzLmltcGxlbWVudHMgPSBJTy5pbXBsZW1lbnRzO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0d1YXJkKElPLmltcGxlbWVudHMpKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgZG9uJ3Qgd2FudCB0aGUgR3VhcmQgdG8gc2hvdyB1cCBpbiB0aGUgQ2xhc3NlcyBtZW51XG4gICAgICAgICAgICAgICAgZXhjbHVkZUZyb21DbGFzc0FycmF5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkZXBzLnR5cGUgPSAnZ3VhcmQnO1xuXG4gICAgICAgICAgICAgICAgb3V0cHV0U3ltYm9scy5ndWFyZHMucHVzaChkZXBzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIElPLmlnbm9yZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoZGVwcyk7XG5cbiAgICAgICAgICAgIGlmICghZXhjbHVkZUZyb21DbGFzc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0U3ltYm9scy5jbGFzc2VzLnB1c2goZGVwcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlnbm9yZShkZXBzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U291cmNlRmlsZURlY29yYXRvcnMoaW5pdGlhbFNyY0ZpbGU6IHRzLlNvdXJjZUZpbGUsIG91dHB1dFN5bWJvbHM6IGFueSk6IHZvaWQge1xuICAgICAgICBsZXQgY2xlYW5lciA9IChwcm9jZXNzLmN3ZCgpICsgcGF0aC5zZXApLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcbiAgICAgICAgbGV0IGZpbGVOYW1lID0gaW5pdGlhbFNyY0ZpbGUuZmlsZU5hbWUucmVwbGFjZShjbGVhbmVyLCAnJyk7XG4gICAgICAgIGxldCBzY2FubmVkRmlsZSA9IGluaXRpYWxTcmNGaWxlO1xuXG4gICAgICAgIC8vIFNlYXJjaCBpbiBmaWxlIGZvciB2YXJpYWJsZSBzdGF0ZW1lbnQgYXMgcm91dGVzIGRlZmluaXRpb25zXG5cbiAgICAgICAgY29uc3QgYXN0RmlsZSA9XG4gICAgICAgICAgICB0eXBlb2YgYXN0LmdldFNvdXJjZUZpbGUoaW5pdGlhbFNyY0ZpbGUuZmlsZU5hbWUpICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgID8gYXN0LmdldFNvdXJjZUZpbGUoaW5pdGlhbFNyY0ZpbGUuZmlsZU5hbWUpXG4gICAgICAgICAgICAgICAgOiBhc3QuYWRkRXhpc3RpbmdTb3VyY2VGaWxlKGluaXRpYWxTcmNGaWxlLmZpbGVOYW1lKTtcblxuICAgICAgICBjb25zdCB2YXJpYWJsZVJvdXRlc1N0YXRlbWVudHMgPSBhc3RGaWxlLmdldFZhcmlhYmxlU3RhdGVtZW50cygpO1xuICAgICAgICBsZXQgaGFzUm91dGVzU3RhdGVtZW50cyA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh2YXJpYWJsZVJvdXRlc1N0YXRlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gQ2xlYW4gZmlsZSBmb3Igc3ByZWFkIGFuZCBkeW5hbWljcyBpbnNpZGUgcm91dGVzIGRlZmluaXRpb25zXG4gICAgICAgICAgICB2YXJpYWJsZVJvdXRlc1N0YXRlbWVudHMuZm9yRWFjaChzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YXJpYWJsZURlY2xhcmF0aW9ucyA9IHMuZ2V0RGVjbGFyYXRpb25zKCk7XG4gICAgICAgICAgICAgICAgbGV0IGxlbiA9IHZhcmlhYmxlRGVjbGFyYXRpb25zLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICAgICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhYmxlRGVjbGFyYXRpb25zW2ldLmNvbXBpbGVyTm9kZS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVEZWNsYXJhdGlvbnNbaV0uY29tcGlsZXJOb2RlLnR5cGUudHlwZU5hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZURlY2xhcmF0aW9uc1tpXS5jb21waWxlck5vZGUudHlwZS50eXBlTmFtZS50ZXh0ID09PSAnUm91dGVzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzUm91dGVzU3RhdGVtZW50cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNSb3V0ZXNTdGF0ZW1lbnRzICYmICFDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVSb3V0ZXNHcmFwaCkge1xuICAgICAgICAgICAgLy8gQ2xlYW4gZmlsZSBmb3Igc3ByZWFkIGFuZCBkeW5hbWljcyBpbnNpZGUgcm91dGVzIGRlZmluaXRpb25zXG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnQW5hbHlzaW5nIHJvdXRlcyBkZWZpbml0aW9ucyBhbmQgY2xlYW4gdGhlbSBpZiBuZWNlc3NhcnknKTtcblxuICAgICAgICAgICAgLy8gc2Nhbm5lZEZpbGUgPSBSb3V0ZXJQYXJzZXJVdGlsLmNsZWFuRmlsZUlkZW50aWZpZXJzKGFzdEZpbGUpLmNvbXBpbGVyTm9kZTtcbiAgICAgICAgICAgIGxldCBmaXJzdENsZWFuID0gUm91dGVyUGFyc2VyVXRpbC5jbGVhbkZpbGVTcHJlYWRzKGFzdEZpbGUpLmNvbXBpbGVyTm9kZTtcbiAgICAgICAgICAgIHNjYW5uZWRGaWxlID0gUm91dGVyUGFyc2VyVXRpbC5jbGVhbkNhbGxFeHByZXNzaW9ucyhhc3RGaWxlKS5jb21waWxlck5vZGU7XG4gICAgICAgICAgICBzY2FubmVkRmlsZSA9IFJvdXRlclBhcnNlclV0aWwuY2xlYW5GaWxlRHluYW1pY3MoYXN0RmlsZSkuY29tcGlsZXJOb2RlO1xuXG4gICAgICAgICAgICBzY2FubmVkRmlsZS5raW5kID0gU3ludGF4S2luZC5Tb3VyY2VGaWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgdHMuZm9yRWFjaENoaWxkKHNjYW5uZWRGaWxlLCAoaW5pdGlhbE5vZGU6IHRzLk5vZGUpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmpzRG9jSGVscGVyLmhhc0pTRG9jSW50ZXJuYWxUYWcoZmlsZU5hbWUsIHNjYW5uZWRGaWxlLCBpbml0aWFsTm9kZSkgJiZcbiAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVJbnRlcm5hbFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHBhcnNlTm9kZSA9IChmaWxlLCBzcmNGaWxlLCBub2RlLCBmaWxlQm9keSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzb3VyY2VDb2RlID0gc3JjRmlsZS5nZXRUZXh0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGhhc2ggPSBjcnlwdG9cbiAgICAgICAgICAgICAgICAgICAgLmNyZWF0ZUhhc2goJ21kNScpXG4gICAgICAgICAgICAgICAgICAgIC51cGRhdGUoc291cmNlQ29kZSlcbiAgICAgICAgICAgICAgICAgICAgLmRpZ2VzdCgnaGV4Jyk7XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5kZWNvcmF0b3JzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc1dpdGhDdXN0b21EZWNvcmF0b3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZpc2l0RGVjb3JhdG9yID0gKHZpc2l0ZWREZWNvcmF0b3IsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGVwczogSURlcDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1ldGFkYXRhID0gbm9kZS5kZWNvcmF0b3JzO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSB0aGlzLmdldFN5bWJvbGVOYW1lKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BzID0gdGhpcy5maW5kUHJvcGVydGllcyh2aXNpdGVkRGVjb3JhdG9yLCBzcmNGaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBJTyA9IHRoaXMuY29tcG9uZW50SGVscGVyLmdldENvbXBvbmVudElPKGZpbGUsIHNyY0ZpbGUsIG5vZGUsIGZpbGVCb2R5KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNNb2R1bGUodmlzaXRlZERlY29yYXRvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGVEZXAgPSBuZXcgTW9kdWxlRGVwRmFjdG9yeSh0aGlzLm1vZHVsZUhlbHBlcikuY3JlYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmNGaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSU9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChSb3V0ZXJQYXJzZXJVdGlsLmhhc1JvdXRlck1vZHVsZUluSW1wb3J0cyhtb2R1bGVEZXAuaW1wb3J0cykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUm91dGVyUGFyc2VyVXRpbC5hZGRNb2R1bGVXaXRoUm91dGVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9kdWxlSGVscGVyLmdldE1vZHVsZUltcG9ydHNSYXcocHJvcHMsIHNyY0ZpbGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBzID0gbW9kdWxlRGVwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgSU8uaWdub3JlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSb3V0ZXJQYXJzZXJVdGlsLmFkZE1vZHVsZShuYW1lLCBtb2R1bGVEZXAuaW1wb3J0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMubW9kdWxlcy5wdXNoKG1vZHVsZURlcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMubW9kdWxlc0ZvckdyYXBoLnB1c2gobW9kdWxlRGVwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNDb21wb25lbnQodmlzaXRlZERlY29yYXRvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50RGVwID0gbmV3IENvbXBvbmVudERlcEZhY3RvcnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50SGVscGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5jcmVhdGUoZmlsZSwgc3JjRmlsZSwgbmFtZSwgcHJvcHMsIElPKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBzID0gY29tcG9uZW50RGVwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgSU8uaWdub3JlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb21wb25lbnRzVHJlZUVuZ2luZS5hZGRDb21wb25lbnQoY29tcG9uZW50RGVwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3ltYm9scy5jb21wb25lbnRzLnB1c2goY29tcG9uZW50RGVwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNDb250cm9sbGVyKHZpc2l0ZWREZWNvcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udHJvbGxlckRlcCA9IG5ldyBDb250cm9sbGVyRGVwRmFjdG9yeSgpLmNyZWF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjRmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIElPXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBzID0gY29udHJvbGxlckRlcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIElPLmlnbm9yZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3ltYm9scy5jb250cm9sbGVycy5wdXNoKGNvbnRyb2xsZXJEZXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0luamVjdGFibGUodmlzaXRlZERlY29yYXRvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5qZWN0YWJsZURlcHM6IElJbmplY3RhYmxlRGVwID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogJ2luamVjdGFibGUtJyArIG5hbWUgKyAnLScgKyBoYXNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiBJTy5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2RzOiBJTy5tZXRob2RzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogSU8uZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUNvZGU6IHNyY0ZpbGUuZ2V0VGV4dCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGFtcGxlVXJsczogdGhpcy5jb21wb25lbnRIZWxwZXIuZ2V0Q29tcG9uZW50RXhhbXBsZVVybHMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmNGaWxlLmdldFRleHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoSU8uY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0YWJsZURlcHMuY29uc3RydWN0b3JPYmogPSBJTy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKElPLmpzZG9jdGFncyAmJiBJTy5qc2RvY3RhZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmplY3RhYmxlRGVwcy5qc2RvY3RhZ3MgPSBJTy5qc2RvY3RhZ3NbMF0udGFncztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKElPLmFjY2Vzc29ycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmplY3RhYmxlRGVwcy5hY2Nlc3NvcnMgPSBJTy5hY2Nlc3NvcnM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChJTy5leHRlbmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGFibGVEZXBzLmV4dGVuZHMgPSBJTy5leHRlbmRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBzID0gaW5qZWN0YWJsZURlcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBJTy5pZ25vcmUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGVzKElPLmltcGxlbWVudHMsICdIdHRwSW50ZXJjZXB0b3InKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0YWJsZURlcHMudHlwZSA9ICdpbnRlcmNlcHRvcic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTeW1ib2xzLmludGVyY2VwdG9ycy5wdXNoKGluamVjdGFibGVEZXBzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzR3VhcmQoSU8uaW1wbGVtZW50cykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGFibGVEZXBzLnR5cGUgPSAnZ3VhcmQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3ltYm9scy5ndWFyZHMucHVzaChpbmplY3RhYmxlRGVwcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmplY3RhYmxlRGVwcy50eXBlID0gJ2luamVjdGFibGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGROZXdFbnRpdHlJblN0b3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGFibGVEZXBzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMuaW5qZWN0YWJsZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNQaXBlKHZpc2l0ZWREZWNvcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBpcGVEZXBzOiBJUGlwZURlcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdwaXBlLScgKyBuYW1lICsgJy0nICsgaGFzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpcGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogSU8uZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IElPLnByb3BlcnRpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZHM6IElPLm1ldGhvZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1cmU6IHRoaXMuY29tcG9uZW50SGVscGVyLmdldENvbXBvbmVudFB1cmUocHJvcHMsIHNyY0ZpbGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZ25hbWU6IHRoaXMuY29tcG9uZW50SGVscGVyLmdldENvbXBvbmVudE5hbWUocHJvcHMsIHNyY0ZpbGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VDb2RlOiBzcmNGaWxlLmdldFRleHQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhhbXBsZVVybHM6IHRoaXMuY29tcG9uZW50SGVscGVyLmdldENvbXBvbmVudEV4YW1wbGVVcmxzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjRmlsZS5nZXRUZXh0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKElPLmpzZG9jdGFncyAmJiBJTy5qc2RvY3RhZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXBlRGVwcy5qc2RvY3RhZ3MgPSBJTy5qc2RvY3RhZ3NbMF0udGFncztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwcyA9IHBpcGVEZXBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgSU8uaWdub3JlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTeW1ib2xzLnBpcGVzLnB1c2gocGlwZURlcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0RpcmVjdGl2ZSh2aXNpdGVkRGVjb3JhdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGlyZWN0aXZlRGVwcyA9IG5ldyBEaXJlY3RpdmVEZXBGYWN0b3J5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudEhlbHBlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkuY3JlYXRlKGZpbGUsIHNyY0ZpbGUsIG5hbWUsIHByb3BzLCBJTyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwcyA9IGRpcmVjdGl2ZURlcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBJTy5pZ25vcmUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMuZGlyZWN0aXZlcy5wdXNoKGRpcmVjdGl2ZURlcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhhc011bHRpcGxlRGVjb3JhdG9yc1dpdGhJbnRlcm5hbE9uZSA9IHRoaXMuaGFzSW50ZXJuYWxEZWNvcmF0b3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGVjb3JhdG9yc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVzdCBhIGNsYXNzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhY2xhc3NXaXRoQ3VzdG9tRGVjb3JhdG9yICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFoYXNNdWx0aXBsZURlY29yYXRvcnNXaXRoSW50ZXJuYWxPbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NXaXRoQ3VzdG9tRGVjb3JhdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzQ2xhc3Mobm9kZSwgZmlsZSwgc3JjRmlsZSwgb3V0cHV0U3ltYm9scywgZmlsZUJvZHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuc2V0KG5hbWUsIGRlcHMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIElPLmlnbm9yZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGRlcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlnbm9yZShkZXBzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyQnlEZWNvcmF0b3JzID0gZmlsdGVyZWROb2RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJlZE5vZGUuZXhwcmVzc2lvbiAmJiBmaWx0ZXJlZE5vZGUuZXhwcmVzc2lvbi5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IF90ZXN0ID0gLyhOZ01vZHVsZXxDb21wb25lbnR8SW5qZWN0YWJsZXxQaXBlfERpcmVjdGl2ZSkvLnRlc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkTm9kZS5leHByZXNzaW9uLmV4cHJlc3Npb24udGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFfdGVzdCAmJiB0cy5pc0NsYXNzRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Rlc3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3Rlc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHMuaXNDbGFzc0RlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgbm9kZS5kZWNvcmF0b3JzLmZpbHRlcihmaWx0ZXJCeURlY29yYXRvcnMpLmZvckVhY2godmlzaXREZWNvcmF0b3IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZS5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuc3ltYm9sLmZsYWdzID09PSB0cy5TeW1ib2xGbGFncy5DbGFzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzQ2xhc3Mobm9kZSwgZmlsZSwgc3JjRmlsZSwgb3V0cHV0U3ltYm9scywgZmlsZUJvZHkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUuc3ltYm9sLmZsYWdzID09PSB0cy5TeW1ib2xGbGFncy5JbnRlcmZhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gdGhpcy5nZXRTeW1ib2xlTmFtZShub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBJTyA9IHRoaXMuZ2V0SW50ZXJmYWNlSU8oZmlsZSwgc3JjRmlsZSwgbm9kZSwgZmlsZUJvZHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGludGVyZmFjZURlcHM6IElJbnRlcmZhY2VEZXAgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogJ2ludGVyZmFjZS0nICsgbmFtZSArICctJyArIGhhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJmYWNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VDb2RlOiBzcmNGaWxlLmdldFRleHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChJTy5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJmYWNlRGVwcy5wcm9wZXJ0aWVzID0gSU8ucHJvcGVydGllcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChJTy5pbmRleFNpZ25hdHVyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcmZhY2VEZXBzLmluZGV4U2lnbmF0dXJlcyA9IElPLmluZGV4U2lnbmF0dXJlcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChJTy5raW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJmYWNlRGVwcy5raW5kID0gSU8ua2luZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChJTy5kZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyZmFjZURlcHMuZGVzY3JpcHRpb24gPSBJTy5kZXNjcmlwdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChJTy5tZXRob2RzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJmYWNlRGVwcy5tZXRob2RzID0gSU8ubWV0aG9kcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChJTy5leHRlbmRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJmYWNlRGVwcy5leHRlbmRzID0gSU8uZXh0ZW5kcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgSU8uaWdub3JlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoaW50ZXJmYWNlRGVwcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3ltYm9scy5pbnRlcmZhY2VzLnB1c2goaW50ZXJmYWNlRGVwcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWdub3JlKGludGVyZmFjZURlcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRzLmlzRnVuY3Rpb25EZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZm9zID0gdGhpcy52aXNpdEZ1bmN0aW9uRGVjbGFyYXRpb24obm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsZXQgdGFncyA9IHRoaXMudmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uSlNEb2NUYWdzKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBpbmZvcy5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZ1bmN0aW9uRGVwOiBJRnVuY3Rpb25EZWNEZXAgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eXBlOiAnbWlzY2VsbGFuZW91cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VidHlwZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy52aXNpdEVudW1UeXBlQWxpYXNGdW5jdGlvbkRlY2xhcmF0aW9uRGVzY3JpcHRpb24obm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5mb3MuYXJncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uRGVwLmFyZ3MgPSBpbmZvcy5hcmdzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZm9zLnJldHVyblR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkRlcC5yZXR1cm5UeXBlID0gaW5mb3MucmV0dXJuVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmZvcy5qc2RvY3RhZ3MgJiYgaW5mb3MuanNkb2N0YWdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkRlcC5qc2RvY3RhZ3MgPSBpbmZvcy5qc2RvY3RhZ3M7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGluZm9zLmlnbm9yZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1ByaXZhdGVKU0RvY1RhZyhmdW5jdGlvbkRlcC5qc2RvY3RhZ3MpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVQcml2YXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3ltYm9scy5taXNjZWxsYW5lb3VzLmZ1bmN0aW9ucy5wdXNoKGZ1bmN0aW9uRGVwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHMuaXNFbnVtRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmZvcyA9IHRoaXMudmlzaXRFbnVtRGVjbGFyYXRpb24obm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IG5vZGUubmFtZS50ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVudW1EZXBzOiBJRW51bURlY0RlcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkczogaW5mb3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R5cGU6ICdtaXNjZWxsYW5lb3VzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJ0eXBlOiAnZW51bScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHRoaXMudmlzaXRFbnVtVHlwZUFsaWFzRnVuY3Rpb25EZWNsYXJhdGlvbkRlc2NyaXB0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0lnbm9yZShub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMubWlzY2VsbGFuZW91cy5lbnVtZXJhdGlvbnMucHVzaChlbnVtRGVwcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHMuaXNUeXBlQWxpYXNEZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZm9zID0gdGhpcy52aXNpdFR5cGVEZWNsYXJhdGlvbihub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gaW5mb3MubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0eXBlQWxpYXNEZXBzOiBJVHlwZUFsaWFzRGVjRGVwID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R5cGU6ICdtaXNjZWxsYW5lb3VzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJ0eXBlOiAndHlwZWFsaWFzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXd0eXBlOiB0aGlzLmNsYXNzSGVscGVyLnZpc2l0VHlwZShub2RlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLnZpc2l0RW51bVR5cGVBbGlhc0Z1bmN0aW9uRGVjbGFyYXRpb25EZXNjcmlwdGlvbihub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlQWxpYXNEZXBzLmtpbmQgPSBub2RlLnR5cGUua2luZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZUFsaWFzRGVwcy5yYXd0eXBlID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlQWxpYXNEZXBzLnJhd3R5cGUgPSBraW5kVG9UeXBlKG5vZGUudHlwZS5raW5kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzSWdub3JlKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3ltYm9scy5taXNjZWxsYW5lb3VzLnR5cGVhbGlhc2VzLnB1c2godHlwZUFsaWFzRGVwcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHMuaXNNb2R1bGVEZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuYm9keSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmJvZHkuc3RhdGVtZW50cyAmJiBub2RlLmJvZHkuc3RhdGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuYm9keS5zdGF0ZW1lbnRzLmZvckVhY2goc3RhdGVtZW50ID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZU5vZGUoZmlsZSwgc3JjRmlsZSwgc3RhdGVtZW50LCBub2RlLmJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IElPID0gdGhpcy5nZXRSb3V0ZUlPKGZpbGUsIHNyY0ZpbGUsIG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoSU8ucm91dGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3Um91dGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdSb3V0ZXMgPSBSb3V0ZXJQYXJzZXJVdGlsLmNsZWFuUmF3Um91dGVQYXJzZWQoSU8ucm91dGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUm91dGVzIHBhcnNpbmcgZXJyb3IsIG1heWJlIGEgdHJhaWxpbmcgY29tbWEgb3IgYW4gZXh0ZXJuYWwgdmFyaWFibGUsIHRyeWluZyB0byBmaXggdGhhdCBsYXRlciBhZnRlciBzb3VyY2VzIHNjYW5uaW5nLidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1JvdXRlcyA9IElPLnJvdXRlcy5yZXBsYWNlKC8gL2dtLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUm91dGVyUGFyc2VyVXRpbC5hZGRJbmNvbXBsZXRlUm91dGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBuZXdSb3V0ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMucm91dGVzID0gWy4uLm91dHB1dFN5bWJvbHMucm91dGVzLCAuLi5uZXdSb3V0ZXNdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0cy5pc0NsYXNzRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0NsYXNzKG5vZGUsIGZpbGUsIHNyY0ZpbGUsIG91dHB1dFN5bWJvbHMsIGZpbGVCb2R5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodHMuaXNFeHByZXNzaW9uU3RhdGVtZW50KG5vZGUpIHx8IHRzLmlzSWZTdGF0ZW1lbnQobm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBib290c3RyYXBNb2R1bGVSZWZlcmVuY2UgPSAnYm9vdHN0cmFwTW9kdWxlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpbmQgdGhlIHJvb3QgbW9kdWxlIHdpdGggYm9vdHN0cmFwTW9kdWxlIGNhbGxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDEuIGZpbmQgYSBzaW1wbGUgY2FsbCA6IHBsYXRmb3JtQnJvd3NlckR5bmFtaWMoKS5ib290c3RyYXBNb2R1bGUoQXBwTW9kdWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDIuIG9yIGluc2lkZSBhIGNhbGwgOlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHBsYXRmb3JtQnJvd3NlckR5bmFtaWMoKS5ib290c3RyYXBNb2R1bGUoQXBwTW9kdWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMy4gd2l0aCBhIGNhdGNoIDogcGxhdGZvcm1Ccm93c2VyRHluYW1pYygpLmJvb3RzdHJhcE1vZHVsZShBcHBNb2R1bGUpLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDQuIHdpdGggcGFyYW1ldGVycyA6IHBsYXRmb3JtQnJvd3NlckR5bmFtaWMoKS5ib290c3RyYXBNb2R1bGUoQXBwTW9kdWxlLCB7fSkuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmluZCByZWN1c2l2ZWx5IGluIGV4cHJlc3Npb24gbm9kZXMgb25lIHdpdGggbmFtZSAnYm9vdHN0cmFwTW9kdWxlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJvb3RNb2R1bGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0Tm9kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzcmNGaWxlLnRleHQuaW5kZXhPZihib290c3RyYXBNb2R1bGVSZWZlcmVuY2UpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Tm9kZSA9IHRoaXMuZmluZEV4cHJlc3Npb25CeU5hbWVJbkV4cHJlc3Npb25zKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5leHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Jvb3RzdHJhcE1vZHVsZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlLnRoZW5TdGF0ZW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUudGhlblN0YXRlbWVudC5zdGF0ZW1lbnRzICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLnRoZW5TdGF0ZW1lbnQuc3RhdGVtZW50cy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpcnN0U3RhdGVtZW50ID0gbm9kZS50aGVuU3RhdGVtZW50LnN0YXRlbWVudHNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHROb2RlID0gdGhpcy5maW5kRXhwcmVzc2lvbkJ5TmFtZUluRXhwcmVzc2lvbnMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RTdGF0ZW1lbnQuZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9vdHN0cmFwTW9kdWxlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5leHByZXNzaW9uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmV4cHJlc3Npb24uYXJndW1lbnRzICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmV4cHJlc3Npb24uYXJndW1lbnRzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHROb2RlID0gdGhpcy5maW5kRXhwcmVzc2lvbkJ5TmFtZUluRXhwcmVzc2lvbkFyZ3VtZW50cyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmV4cHJlc3Npb24uYXJndW1lbnRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib290c3RyYXBNb2R1bGUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHROb2RlLmFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmZvckVhY2gocmVzdWx0Tm9kZS5hcmd1bWVudHMsIChhcmd1bWVudDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50LnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdE1vZHVsZSA9IGFyZ3VtZW50LnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvb3RNb2R1bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJvdXRlclBhcnNlclV0aWwuc2V0Um9vdE1vZHVsZShyb290TW9kdWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodHMuaXNWYXJpYWJsZVN0YXRlbWVudChub2RlKSAmJiAhUm91dGVyUGFyc2VyVXRpbC5pc1ZhcmlhYmxlUm91dGVzKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5mb3M6IGFueSA9IHRoaXMudmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBpbmZvcy5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRlcHM6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eXBlOiAnbWlzY2VsbGFuZW91cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VidHlwZTogJ3ZhcmlhYmxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVwcy50eXBlID0gaW5mb3MudHlwZSA/IGluZm9zLnR5cGUgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmZvcy5kZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBzLmRlZmF1bHRWYWx1ZSA9IGluZm9zLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmZvcy5pbml0aWFsaXplcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcHMuaW5pdGlhbGl6ZXIgPSBpbmZvcy5pbml0aWFsaXplcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmpzRG9jICYmIG5vZGUuanNEb2MubGVuZ3RoID4gMCAmJiBub2RlLmpzRG9jWzBdLmNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBzLmRlc2NyaXB0aW9uID0gbWFya2VkKG5vZGUuanNEb2NbMF0uY29tbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNNb2R1bGVXaXRoUHJvdmlkZXJzKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJvdXRpbmdJbml0aWFsaXplciA9IGdldE1vZHVsZVdpdGhQcm92aWRlcnMobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUm91dGVyUGFyc2VyVXRpbC5hZGRNb2R1bGVXaXRoUm91dGVzKG5hbWUsIFtyb3V0aW5nSW5pdGlhbGl6ZXJdLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSb3V0ZXJQYXJzZXJVdGlsLmFkZE1vZHVsZShuYW1lLCBbcm91dGluZ0luaXRpYWxpemVyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzSWdub3JlKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3ltYm9scy5taXNjZWxsYW5lb3VzLnZhcmlhYmxlcy5wdXNoKGRlcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0cy5pc1R5cGVBbGlhc0RlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5mb3MgPSB0aGlzLnZpc2l0VHlwZURlY2xhcmF0aW9uKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBpbmZvcy5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRlcHM6IElUeXBlQWxpYXNEZWNEZXAgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHlwZTogJ21pc2NlbGxhbmVvdXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnR5cGU6ICd0eXBlYWxpYXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhd3R5cGU6IHRoaXMuY2xhc3NIZWxwZXIudmlzaXRUeXBlKG5vZGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHRoaXMudmlzaXRFbnVtVHlwZUFsaWFzRnVuY3Rpb25EZWNsYXJhdGlvbkRlc2NyaXB0aW9uKG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcHMua2luZCA9IG5vZGUudHlwZS5raW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0lnbm9yZShub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFN5bWJvbHMubWlzY2VsbGFuZW91cy50eXBlYWxpYXNlcy5wdXNoKGRlcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0cy5pc0Z1bmN0aW9uRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmZvcyA9IHRoaXMudmlzaXRGdW5jdGlvbkRlY2xhcmF0aW9uKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBpbmZvcy5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZ1bmN0aW9uRGVwOiBJRnVuY3Rpb25EZWNEZXAgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHlwZTogJ21pc2NlbGxhbmVvdXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnR5cGU6ICdmdW5jdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy52aXNpdEVudW1UeXBlQWxpYXNGdW5jdGlvbkRlY2xhcmF0aW9uRGVzY3JpcHRpb24obm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5mb3MuYXJncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uRGVwLmFyZ3MgPSBpbmZvcy5hcmdzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZm9zLnJldHVyblR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkRlcC5yZXR1cm5UeXBlID0gaW5mb3MucmV0dXJuVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmZvcy5qc2RvY3RhZ3MgJiYgaW5mb3MuanNkb2N0YWdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbkRlcC5qc2RvY3RhZ3MgPSBpbmZvcy5qc2RvY3RhZ3M7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGluZm9zLmlnbm9yZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1ByaXZhdGVKU0RvY1RhZyhmdW5jdGlvbkRlcC5qc2RvY3RhZ3MpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVQcml2YXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0U3ltYm9scy5taXNjZWxsYW5lb3VzLmZ1bmN0aW9ucy5wdXNoKGZ1bmN0aW9uRGVwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRzLmlzRW51bURlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5mb3MgPSB0aGlzLnZpc2l0RW51bURlY2xhcmF0aW9uKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBub2RlLm5hbWUudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbnVtRGVwczogSUVudW1EZWNEZXAgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHM6IGluZm9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eXBlOiAnbWlzY2VsbGFuZW91cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VidHlwZTogJ2VudW0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLnZpc2l0RW51bVR5cGVBbGlhc0Z1bmN0aW9uRGVjbGFyYXRpb25EZXNjcmlwdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNJZ25vcmUobm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRTeW1ib2xzLm1pc2NlbGxhbmVvdXMuZW51bWVyYXRpb25zLnB1c2goZW51bURlcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcGFyc2VOb2RlKGZpbGVOYW1lLCBzY2FubmVkRmlsZSwgaW5pdGlhbE5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0byBpbiBhIHNwZWNpZmljIHN0b3JlIGFuIGVudGl0eSwgYW5kIGNoZWNrIGJlZm9yZSBpcyB0aGVyZSBpcyBub3QgdGhlIHNhbWUgb25lXG4gICAgICogaW4gdGhhdCBzdG9yZSA6IHNhbWUgbmFtZSwgaWQgYW5kIGZpbGVcbiAgICAgKiBAcGFyYW0gZW50aXR5IEVudGl0eSB0byBzdG9yZVxuICAgICAqIEBwYXJhbSBzdG9yZSBTdG9yZVxuICAgICAqL1xuICAgIHByaXZhdGUgYWRkTmV3RW50aXR5SW5TdG9yZShlbnRpdHksIHN0b3JlKSB7XG4gICAgICAgIGxldCBmaW5kU2FtZUVudGl0eUluU3RvcmUgPSBfLmZpbHRlcihzdG9yZSwge1xuICAgICAgICAgICAgbmFtZTogZW50aXR5Lm5hbWUsXG4gICAgICAgICAgICBpZDogZW50aXR5LmlkLFxuICAgICAgICAgICAgZmlsZTogZW50aXR5LmZpbGVcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChmaW5kU2FtZUVudGl0eUluU3RvcmUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBzdG9yZS5wdXNoKGVudGl0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlYnVnKGRlcHM6IElEZXApIHtcbiAgICAgICAgaWYgKGRlcHMpIHtcbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnZm91bmQnLCBgJHtkZXBzLm5hbWV9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgWydpbXBvcnRzJywgJ2V4cG9ydHMnLCAnZGVjbGFyYXRpb25zJywgJ3Byb3ZpZGVycycsICdib290c3RyYXAnXS5mb3JFYWNoKHN5bWJvbHMgPT4ge1xuICAgICAgICAgICAgaWYgKGRlcHNbc3ltYm9sc10gJiYgZGVwc1tzeW1ib2xzXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCcnLCBgLSAke3N5bWJvbHN9OmApO1xuICAgICAgICAgICAgICAgIGRlcHNbc3ltYm9sc11cbiAgICAgICAgICAgICAgICAgICAgLm1hcChpID0+IGkubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoJycsIGBcXHQtICR7ZH1gKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgaWdub3JlKGRlcHM6IElEZXApIHtcbiAgICAgICAgaWYgKGRlcHMpIHtcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKCdpZ25vcmUnLCBgJHtkZXBzLm5hbWV9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmRFeHByZXNzaW9uQnlOYW1lSW5FeHByZXNzaW9ucyhlbnRyeU5vZGUsIG5hbWUpIHtcbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgbGV0IGxvb3AgPSBmdW5jdGlvbihub2RlLCB6KSB7XG4gICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmV4cHJlc3Npb24gJiYgIW5vZGUuZXhwcmVzc2lvbi5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvb3Aobm9kZS5leHByZXNzaW9uLCB6KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuZXhwcmVzc2lvbiAmJiBub2RlLmV4cHJlc3Npb24ubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5leHByZXNzaW9uLm5hbWUudGV4dCA9PT0geikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gbm9kZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvb3Aobm9kZS5leHByZXNzaW9uLCB6KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgbG9vcChlbnRyeU5vZGUsIG5hbWUpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgZmluZEV4cHJlc3Npb25CeU5hbWVJbkV4cHJlc3Npb25Bcmd1bWVudHMoYXJnLCBuYW1lKSB7XG4gICAgICAgIGxldCByZXN1bHQ7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBsZXQgbGVuID0gYXJnLmxlbmd0aDtcbiAgICAgICAgbGV0IGxvb3AgPSBmdW5jdGlvbihub2RlLCB6KSB7XG4gICAgICAgICAgICBpZiAobm9kZS5ib2R5KSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuYm9keS5zdGF0ZW1lbnRzICYmIG5vZGUuYm9keS5zdGF0ZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGogPSAwO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbGVuZyA9IG5vZGUuYm9keS5zdGF0ZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChqOyBqIDwgbGVuZzsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGF0LmZpbmRFeHByZXNzaW9uQnlOYW1lSW5FeHByZXNzaW9ucyhub2RlLmJvZHkuc3RhdGVtZW50c1tqXSwgeik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsb29wKGFyZ1tpXSwgbmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBhcnNlRGVjb3JhdG9ycyhkZWNvcmF0b3JzLCB0eXBlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBpZiAoZGVjb3JhdG9ycy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBfLmZvckVhY2goZGVjb3JhdG9ycywgZnVuY3Rpb24oZGVjb3JhdG9yOiBhbnkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGVjb3JhdG9yLmV4cHJlc3Npb24uZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVjb3JhdG9yLmV4cHJlc3Npb24uZXhwcmVzc2lvbi50ZXh0ID09PSB0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZGVjb3JhdG9yc1swXS5leHByZXNzaW9uLmV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICBpZiAoZGVjb3JhdG9yc1swXS5leHByZXNzaW9uLmV4cHJlc3Npb24udGV4dCA9PT0gdHlwZSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgcGFyc2VEZWNvcmF0b3IoZGVjb3JhdG9yLCB0eXBlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBpZiAoZGVjb3JhdG9yLmV4cHJlc3Npb24uZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgaWYgKGRlY29yYXRvci5leHByZXNzaW9uLmV4cHJlc3Npb24udGV4dCA9PT0gdHlwZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzQ29udHJvbGxlcihtZXRhZGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURlY29yYXRvcihtZXRhZGF0YSwgJ0NvbnRyb2xsZXInKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzQ29tcG9uZW50KG1ldGFkYXRhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlRGVjb3JhdG9yKG1ldGFkYXRhLCAnQ29tcG9uZW50Jyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1BpcGUobWV0YWRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEZWNvcmF0b3IobWV0YWRhdGEsICdQaXBlJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0RpcmVjdGl2ZShtZXRhZGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURlY29yYXRvcihtZXRhZGF0YSwgJ0RpcmVjdGl2ZScpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNJbmplY3RhYmxlKG1ldGFkYXRhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlRGVjb3JhdG9yKG1ldGFkYXRhLCAnSW5qZWN0YWJsZScpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNNb2R1bGUobWV0YWRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEZWNvcmF0b3IobWV0YWRhdGEsICdOZ01vZHVsZScpIHx8IHRoaXMucGFyc2VEZWNvcmF0b3IobWV0YWRhdGEsICdNb2R1bGUnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhc0ludGVybmFsRGVjb3JhdG9yKG1ldGFkYXRhcykge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy5wYXJzZURlY29yYXRvcnMobWV0YWRhdGFzLCAnQ29udHJvbGxlcicpIHx8XG4gICAgICAgICAgICB0aGlzLnBhcnNlRGVjb3JhdG9ycyhtZXRhZGF0YXMsICdDb21wb25lbnQnKSB8fFxuICAgICAgICAgICAgdGhpcy5wYXJzZURlY29yYXRvcnMobWV0YWRhdGFzLCAnUGlwZScpIHx8XG4gICAgICAgICAgICB0aGlzLnBhcnNlRGVjb3JhdG9ycyhtZXRhZGF0YXMsICdEaXJlY3RpdmUnKSB8fFxuICAgICAgICAgICAgdGhpcy5wYXJzZURlY29yYXRvcnMobWV0YWRhdGFzLCAnSW5qZWN0YWJsZScpIHx8XG4gICAgICAgICAgICB0aGlzLnBhcnNlRGVjb3JhdG9ycyhtZXRhZGF0YXMsICdOZ01vZHVsZScpIHx8XG4gICAgICAgICAgICB0aGlzLnBhcnNlRGVjb3JhdG9ycyhtZXRhZGF0YXMsICdNb2R1bGUnKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNHdWFyZChpb0ltcGxlbWVudHM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBfLmluY2x1ZGVzKGlvSW1wbGVtZW50cywgJ0NhbkFjdGl2YXRlJykgfHxcbiAgICAgICAgICAgIF8uaW5jbHVkZXMoaW9JbXBsZW1lbnRzLCAnQ2FuQWN0aXZhdGVDaGlsZCcpIHx8XG4gICAgICAgICAgICBfLmluY2x1ZGVzKGlvSW1wbGVtZW50cywgJ0NhbkRlYWN0aXZhdGUnKSB8fFxuICAgICAgICAgICAgXy5pbmNsdWRlcyhpb0ltcGxlbWVudHMsICdSZXNvbHZlJykgfHxcbiAgICAgICAgICAgIF8uaW5jbHVkZXMoaW9JbXBsZW1lbnRzLCAnQ2FuTG9hZCcpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTeW1ib2xlTmFtZShub2RlKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIG5vZGUubmFtZS50ZXh0O1xuICAgIH1cblxuICAgIHByaXZhdGUgZmluZFByb3BlcnRpZXMoXG4gICAgICAgIHZpc2l0ZWROb2RlOiB0cy5EZWNvcmF0b3IsXG4gICAgICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGVcbiAgICApOiBSZWFkb25seUFycmF5PHRzLk9iamVjdExpdGVyYWxFbGVtZW50TGlrZT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB2aXNpdGVkTm9kZS5leHByZXNzaW9uICYmXG4gICAgICAgICAgICB2aXNpdGVkTm9kZS5leHByZXNzaW9uLmFyZ3VtZW50cyAmJlxuICAgICAgICAgICAgdmlzaXRlZE5vZGUuZXhwcmVzc2lvbi5hcmd1bWVudHMubGVuZ3RoID4gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCBwb3AgPSB2aXNpdGVkTm9kZS5leHByZXNzaW9uLmFyZ3VtZW50c1swXTtcblxuICAgICAgICAgICAgaWYgKHBvcCAmJiBwb3AucHJvcGVydGllcyAmJiBwb3AucHJvcGVydGllcy5sZW5ndGggPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwb3AucHJvcGVydGllcztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocG9wICYmIHBvcC5raW5kICYmIHBvcC5raW5kID09PSBTeW50YXhLaW5kLlN0cmluZ0xpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3BvcF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKCdFbXB0eSBtZXRhZGF0YXMsIHRyeWluZyB0byBmb3VuZCBpdCB3aXRoIGltcG9ydHMuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEltcG9ydHNVdGlsLmZpbmRWYWx1ZUluSW1wb3J0T3JMb2NhbFZhcmlhYmxlcyhwb3AudGV4dCwgc291cmNlRmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0FuZ3VsYXJMaWZlY3ljbGVIb29rKG1ldGhvZE5hbWUpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvcHlyaWdodCBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcFxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgQU5HVUxBUl9MSUZFQ1lDTEVfTUVUSE9EUyA9IFtcbiAgICAgICAgICAgICduZ09uSW5pdCcsXG4gICAgICAgICAgICAnbmdPbkNoYW5nZXMnLFxuICAgICAgICAgICAgJ25nRG9DaGVjaycsXG4gICAgICAgICAgICAnbmdPbkRlc3Ryb3knLFxuICAgICAgICAgICAgJ25nQWZ0ZXJDb250ZW50SW5pdCcsXG4gICAgICAgICAgICAnbmdBZnRlckNvbnRlbnRDaGVja2VkJyxcbiAgICAgICAgICAgICduZ0FmdGVyVmlld0luaXQnLFxuICAgICAgICAgICAgJ25nQWZ0ZXJWaWV3Q2hlY2tlZCcsXG4gICAgICAgICAgICAnd3JpdGVWYWx1ZScsXG4gICAgICAgICAgICAncmVnaXN0ZXJPbkNoYW5nZScsXG4gICAgICAgICAgICAncmVnaXN0ZXJPblRvdWNoZWQnLFxuICAgICAgICAgICAgJ3NldERpc2FibGVkU3RhdGUnXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBBTkdVTEFSX0xJRkVDWUNMRV9NRVRIT0RTLmluZGV4T2YobWV0aG9kTmFtZSkgPj0gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZpc2l0VHlwZURlY2xhcmF0aW9uKG5vZGU6IHRzLlR5cGVBbGlhc0RlY2xhcmF0aW9uKSB7XG4gICAgICAgIGxldCByZXN1bHQ6IGFueSA9IHtcbiAgICAgICAgICAgIG5hbWU6IG5vZGUubmFtZS50ZXh0LFxuICAgICAgICAgICAga2luZDogbm9kZS5raW5kXG4gICAgICAgIH07XG4gICAgICAgIGxldCBqc2RvY3RhZ3MgPSB0aGlzLmpzZG9jUGFyc2VyVXRpbC5nZXRKU0RvY3Mobm9kZSk7XG5cbiAgICAgICAgaWYgKGpzZG9jdGFncyAmJiBqc2RvY3RhZ3MubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgIGlmIChqc2RvY3RhZ3NbMF0udGFncykge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5qc2RvY3RhZ3MgPSBtYXJrZWR0YWdzKGpzZG9jdGFnc1swXS50YWdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgdmlzaXRBcmd1bWVudChhcmcpIHtcbiAgICAgICAgbGV0IHJlc3VsdDogYW55ID0ge1xuICAgICAgICAgICAgbmFtZTogYXJnLm5hbWUudGV4dCxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMuY2xhc3NIZWxwZXIudmlzaXRUeXBlKGFyZylcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGFyZy5kb3REb3REb3RUb2tlbikge1xuICAgICAgICAgICAgcmVzdWx0LmRvdERvdERvdFRva2VuID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJnLnF1ZXN0aW9uVG9rZW4pIHtcbiAgICAgICAgICAgIHJlc3VsdC5vcHRpb25hbCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZy50eXBlKSB7XG4gICAgICAgICAgICByZXN1bHQudHlwZSA9IHRoaXMubWFwVHlwZShhcmcudHlwZS5raW5kKTtcbiAgICAgICAgICAgIGlmIChhcmcudHlwZS5raW5kID09PSAxNTcpIHtcbiAgICAgICAgICAgICAgICAvLyB0cnkgcmVwbGFjZSBUeXBlUmVmZXJlbmNlIHdpdGggdHlwZU5hbWVcbiAgICAgICAgICAgICAgICBpZiAoYXJnLnR5cGUudHlwZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnR5cGUgPSBhcmcudHlwZS50eXBlTmFtZS50ZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgbWFwVHlwZSh0eXBlKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIDk1OlxuICAgICAgICAgICAgICAgIHJldHVybiAnbnVsbCc7XG4gICAgICAgICAgICBjYXNlIDExOTpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2FueSc7XG4gICAgICAgICAgICBjYXNlIDEyMjpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2Jvb2xlYW4nO1xuICAgICAgICAgICAgY2FzZSAxMzA6XG4gICAgICAgICAgICAgICAgcmV0dXJuICduZXZlcic7XG4gICAgICAgICAgICBjYXNlIDEzMzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ251bWJlcic7XG4gICAgICAgICAgICBjYXNlIDEzNjpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3N0cmluZyc7XG4gICAgICAgICAgICBjYXNlIDEzOTpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gICAgICAgICAgICBjYXNlIDE1OTpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3R5cGVSZWZlcmVuY2UnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYXNQcml2YXRlSlNEb2NUYWcodGFncyk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIGlmICh0YWdzKSB7XG4gICAgICAgICAgICB0YWdzLmZvckVhY2godGFnID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGFnLnRhZ05hbWUgJiYgdGFnLnRhZ05hbWUgJiYgdGFnLnRhZ05hbWUudGV4dCA9PT0gJ3ByaXZhdGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbihtZXRob2Q6IHRzLkZ1bmN0aW9uRGVjbGFyYXRpb24pIHtcbiAgICAgICAgbGV0IG1ldGhvZE5hbWUgPSBtZXRob2QubmFtZSA/IG1ldGhvZC5uYW1lLnRleHQgOiAnVW5uYW1lZCBmdW5jdGlvbic7XG4gICAgICAgIGxldCByZXN1bHQ6IGFueSA9IHtcbiAgICAgICAgICAgIG5hbWU6IG1ldGhvZE5hbWUsXG4gICAgICAgICAgICBhcmdzOiBtZXRob2QucGFyYW1ldGVycyA/IG1ldGhvZC5wYXJhbWV0ZXJzLm1hcChwcm9wID0+IHRoaXMudmlzaXRBcmd1bWVudChwcm9wKSkgOiBbXVxuICAgICAgICB9O1xuICAgICAgICBsZXQganNkb2N0YWdzID0gdGhpcy5qc2RvY1BhcnNlclV0aWwuZ2V0SlNEb2NzKG1ldGhvZCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QudHlwZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJlc3VsdC5yZXR1cm5UeXBlID0gdGhpcy5jbGFzc0hlbHBlci52aXNpdFR5cGUobWV0aG9kLnR5cGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1ldGhvZC5tb2RpZmllcnMpIHtcbiAgICAgICAgICAgIGlmIChtZXRob2QubW9kaWZpZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQga2luZHMgPSBtZXRob2QubW9kaWZpZXJzXG4gICAgICAgICAgICAgICAgICAgIC5tYXAobW9kaWZpZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vZGlmaWVyLmtpbmQ7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBfLmluZGV4T2Yoa2luZHMsIFN5bnRheEtpbmQuUHVibGljS2V5d29yZCkgIT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgIF8uaW5kZXhPZihraW5kcywgU3ludGF4S2luZC5TdGF0aWNLZXl3b3JkKSAhPT0gLTFcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAga2luZHMgPSBraW5kcy5maWx0ZXIoa2luZCA9PiBraW5kICE9PSBTeW50YXhLaW5kLlB1YmxpY0tleXdvcmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoanNkb2N0YWdzICYmIGpzZG9jdGFncy5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgaWYgKGpzZG9jdGFnc1swXS50YWdzKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmpzZG9jdGFncyA9IG1hcmtlZHRhZ3MoanNkb2N0YWdzWzBdLnRhZ3MpO1xuICAgICAgICAgICAgICAgIF8uZm9yRWFjaChqc2RvY3RhZ3NbMF0udGFncywgdGFnID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhZy50YWdOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFnLnRhZ05hbWUudGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWcudGFnTmFtZS50ZXh0LmluZGV4T2YoJ2lnbm9yZScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lmlnbm9yZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5qc2RvY3RhZ3MgJiYgcmVzdWx0LmpzZG9jdGFncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXN1bHQuanNkb2N0YWdzID0gbWVyZ2VUYWdzQW5kQXJncyhyZXN1bHQuYXJncywgcmVzdWx0LmpzZG9jdGFncyk7XG4gICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LmFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVzdWx0LmpzZG9jdGFncyA9IG1lcmdlVGFnc0FuZEFyZ3MocmVzdWx0LmFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zKSB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdDogYW55ID0ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbaV0ubmFtZS50ZXh0LFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6IG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9uc1tpXS5pbml0aWFsaXplclxuICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLmNsYXNzSGVscGVyLnN0cmluZ2lmeURlZmF1bHRWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9uc1tpXS5pbml0aWFsaXplclxuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9uc1tpXS5pbml0aWFsaXplcikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuaW5pdGlhbGl6ZXIgPSBub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbaV0uaW5pdGlhbGl6ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbaV0udHlwZSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQudHlwZSA9IHRoaXMuY2xhc3NIZWxwZXIudmlzaXRUeXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zW2ldLnR5cGVcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQudHlwZSA9PT0gJ3VuZGVmaW5lZCcgJiYgcmVzdWx0LmluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC50eXBlID0ga2luZFRvVHlwZShyZXN1bHQuaW5pdGlhbGl6ZXIua2luZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHZpc2l0RnVuY3Rpb25EZWNsYXJhdGlvbkpTRG9jVGFncyhub2RlOiB0cy5GdW5jdGlvbkRlY2xhcmF0aW9uKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGpzZG9jdGFncyA9IHRoaXMuanNkb2NQYXJzZXJVdGlsLmdldEpTRG9jcyhub2RlKTtcbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgaWYgKGpzZG9jdGFncyAmJiBqc2RvY3RhZ3MubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgIGlmIChqc2RvY3RhZ3NbMF0udGFncykge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG1hcmtlZHRhZ3MoanNkb2N0YWdzWzBdLnRhZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdEVudW1UeXBlQWxpYXNGdW5jdGlvbkRlY2xhcmF0aW9uRGVzY3JpcHRpb24obm9kZSk6IHN0cmluZyB7XG4gICAgICAgIGxldCBkZXNjcmlwdGlvbjogc3RyaW5nID0gJyc7XG4gICAgICAgIGlmIChub2RlLmpzRG9jKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5qc0RvYy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlLmpzRG9jWzBdLmNvbW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gbWFya2VkKG5vZGUuanNEb2NbMF0uY29tbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZpc2l0RW51bURlY2xhcmF0aW9uKG5vZGU6IHRzLkVudW1EZWNsYXJhdGlvbikge1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGlmIChub2RlLm1lbWJlcnMpIHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGxldCBsZW4gPSBub2RlLm1lbWJlcnMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbWVtYmVyOiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5vZGUubWVtYmVyc1tpXS5uYW1lLnRleHRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChub2RlLm1lbWJlcnNbaV0uaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyLnZhbHVlID0gbm9kZS5tZW1iZXJzW2ldLmluaXRpYWxpemVyLnRleHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG1lbWJlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZpc2l0RW51bURlY2xhcmF0aW9uRm9yUm91dGVzKGZpbGVOYW1lLCBub2RlKSB7XG4gICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnMpIHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGxldCBsZW4gPSBub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcm91dGVzSW5pdGlhbGl6ZXIgPSBub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbaV0uaW5pdGlhbGl6ZXI7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBuZXcgQ29kZUdlbmVyYXRvcigpLmdlbmVyYXRlKHJvdXRlc0luaXRpYWxpemVyKTtcbiAgICAgICAgICAgICAgICBSb3V0ZXJQYXJzZXJVdGlsLmFkZFJvdXRlKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zW2ldLm5hbWUudGV4dCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogUm91dGVyUGFyc2VyVXRpbC5jbGVhblJhd1JvdXRlKGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogZmlsZU5hbWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXM6IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Um91dGVJTyhmaWxlbmFtZTogc3RyaW5nLCBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlLCBub2RlOiB0cy5Ob2RlKSB7XG4gICAgICAgIGxldCByZXM7XG4gICAgICAgIGlmIChzb3VyY2VGaWxlLnN0YXRlbWVudHMpIHtcbiAgICAgICAgICAgIHJlcyA9IHNvdXJjZUZpbGUuc3RhdGVtZW50cy5yZWR1Y2UoKGRpcmVjdGl2ZSwgc3RhdGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKFJvdXRlclBhcnNlclV0aWwuaXNWYXJpYWJsZVJvdXRlcyhzdGF0ZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZW1lbnQucG9zID09PSBub2RlLnBvcyAmJiBzdGF0ZW1lbnQuZW5kID09PSBub2RlLmVuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZS5jb25jYXQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aXNpdEVudW1EZWNsYXJhdGlvbkZvclJvdXRlcyhmaWxlbmFtZSwgc3RhdGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG4gICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzWzBdIHx8IHt9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDbGFzc0lPKGZpbGVuYW1lOiBzdHJpbmcsIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUsIG5vZGU6IHRzLk5vZGUsIGZpbGVCb2R5KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb3B5cmlnaHQgaHR0cHM6Ly9naXRodWIuY29tL25nLWJvb3RzdHJhcC9uZy1ib290c3RyYXBcbiAgICAgICAgICovXG4gICAgICAgIGxldCByZWR1Y2VkU291cmNlID0gZmlsZUJvZHkgPyBmaWxlQm9keS5zdGF0ZW1lbnRzIDogc291cmNlRmlsZS5zdGF0ZW1lbnRzO1xuICAgICAgICBsZXQgcmVzID0gcmVkdWNlZFNvdXJjZS5yZWR1Y2UoKGRpcmVjdGl2ZSwgc3RhdGVtZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodHMuaXNDbGFzc0RlY2xhcmF0aW9uKHN0YXRlbWVudCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGVtZW50LnBvcyA9PT0gbm9kZS5wb3MgJiYgc3RhdGVtZW50LmVuZCA9PT0gbm9kZS5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZS5jb25jYXQoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzSGVscGVyLnZpc2l0Q2xhc3NEZWNsYXJhdGlvbihmaWxlbmFtZSwgc3RhdGVtZW50LCBzb3VyY2VGaWxlKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcbiAgICAgICAgfSwgW10pO1xuXG4gICAgICAgIHJldHVybiByZXNbMF0gfHwge307XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJbnRlcmZhY2VJTyhmaWxlbmFtZTogc3RyaW5nLCBzb3VyY2VGaWxlLCBub2RlLCBmaWxlQm9keSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQ29weXJpZ2h0IGh0dHBzOi8vZ2l0aHViLmNvbS9uZy1ib290c3RyYXAvbmctYm9vdHN0cmFwXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgcmVkdWNlZFNvdXJjZSA9IGZpbGVCb2R5ID8gZmlsZUJvZHkuc3RhdGVtZW50cyA6IHNvdXJjZUZpbGUuc3RhdGVtZW50cztcbiAgICAgICAgbGV0IHJlcyA9IHJlZHVjZWRTb3VyY2UucmVkdWNlKChkaXJlY3RpdmUsIHN0YXRlbWVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRzLmlzSW50ZXJmYWNlRGVjbGFyYXRpb24oc3RhdGVtZW50KSkge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZW1lbnQucG9zID09PSBub2RlLnBvcyAmJiBzdGF0ZW1lbnQuZW5kID09PSBub2RlLmVuZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGlyZWN0aXZlLmNvbmNhdChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NIZWxwZXIudmlzaXRDbGFzc0RlY2xhcmF0aW9uKGZpbGVuYW1lLCBzdGF0ZW1lbnQsIHNvdXJjZUZpbGUpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuICAgICAgICB9LCBbXSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc1swXSB8fCB7fTtcbiAgICB9XG59XG4iXX0=