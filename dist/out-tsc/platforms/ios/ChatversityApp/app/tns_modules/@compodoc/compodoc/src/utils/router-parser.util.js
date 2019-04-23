"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handlebars = require("handlebars");
var JSON5 = require("json5");
var _ = require("lodash");
var path = require("path");
var ts_simple_ast_1 = require("ts-simple-ast");
var file_engine_1 = require("../app/engines/file.engine");
var imports_util_1 = require("./imports.util");
var logger_1 = require("./logger");
var traverse = require('traverse');
var ast = new ts_simple_ast_1.default();
var RouterParserUtil = /** @class */ (function () {
    function RouterParserUtil() {
        this.routes = [];
        this.incompleteRoutes = [];
        this.modules = [];
        this.modulesWithRoutes = [];
    }
    RouterParserUtil.getInstance = function () {
        if (!RouterParserUtil.instance) {
            RouterParserUtil.instance = new RouterParserUtil();
        }
        return RouterParserUtil.instance;
    };
    RouterParserUtil.prototype.addRoute = function (route) {
        this.routes.push(route);
        this.routes = _.sortBy(_.uniqWith(this.routes, _.isEqual), ['name']);
    };
    RouterParserUtil.prototype.addIncompleteRoute = function (route) {
        this.incompleteRoutes.push(route);
        this.incompleteRoutes = _.sortBy(_.uniqWith(this.incompleteRoutes, _.isEqual), ['name']);
    };
    RouterParserUtil.prototype.addModuleWithRoutes = function (moduleName, moduleImports, filename) {
        this.modulesWithRoutes.push({
            name: moduleName,
            importsNode: moduleImports,
            filename: filename
        });
        this.modulesWithRoutes = _.sortBy(_.uniqWith(this.modulesWithRoutes, _.isEqual), ['name']);
    };
    RouterParserUtil.prototype.addModule = function (moduleName, moduleImports) {
        this.modules.push({
            name: moduleName,
            importsNode: moduleImports
        });
        this.modules = _.sortBy(_.uniqWith(this.modules, _.isEqual), ['name']);
    };
    RouterParserUtil.prototype.cleanRawRouteParsed = function (route) {
        var routesWithoutSpaces = route.replace(/ /gm, '');
        var testTrailingComma = routesWithoutSpaces.indexOf('},]');
        if (testTrailingComma !== -1) {
            routesWithoutSpaces = routesWithoutSpaces.replace('},]', '}]');
        }
        return JSON5.parse(routesWithoutSpaces);
    };
    RouterParserUtil.prototype.cleanRawRoute = function (route) {
        var routesWithoutSpaces = route.replace(/ /gm, '');
        var testTrailingComma = routesWithoutSpaces.indexOf('},]');
        if (testTrailingComma !== -1) {
            routesWithoutSpaces = routesWithoutSpaces.replace('},]', '}]');
        }
        return routesWithoutSpaces;
    };
    RouterParserUtil.prototype.setRootModule = function (module) {
        this.rootModule = module;
    };
    RouterParserUtil.prototype.hasRouterModuleInImports = function (imports) {
        for (var i = 0; i < imports.length; i++) {
            if (imports[i].name.indexOf('RouterModule.forChild') !== -1 ||
                imports[i].name.indexOf('RouterModule.forRoot') !== -1 ||
                imports[i].name.indexOf('RouterModule') !== -1) {
                return true;
            }
        }
        return false;
    };
    RouterParserUtil.prototype.fixIncompleteRoutes = function (miscellaneousVariables) {
        var matchingVariables = [];
        // For each incompleteRoute, scan if one misc variable is in code
        // if ok, try recreating complete route
        for (var i = 0; i < this.incompleteRoutes.length; i++) {
            for (var j = 0; j < miscellaneousVariables.length; j++) {
                if (this.incompleteRoutes[i].data.indexOf(miscellaneousVariables[j].name) !== -1) {
                    console.log('found one misc var inside incompleteRoute');
                    console.log(miscellaneousVariables[j].name);
                    matchingVariables.push(miscellaneousVariables[j]);
                }
            }
            // Clean incompleteRoute
            this.incompleteRoutes[i].data = this.incompleteRoutes[i].data.replace('[', '');
            this.incompleteRoutes[i].data = this.incompleteRoutes[i].data.replace(']', '');
        }
    };
    RouterParserUtil.prototype.linkModulesAndRoutes = function () {
        var _this = this;
        var i = 0;
        var len = this.modulesWithRoutes.length;
        for (i; i < len; i++) {
            _.forEach(this.modulesWithRoutes[i].importsNode, function (node) {
                var initializer = node.initializer;
                if (initializer) {
                    if (initializer.elements) {
                        _.forEach(initializer.elements, function (element) {
                            // find element with arguments
                            if (element.arguments) {
                                _.forEach(element.arguments, function (argument) {
                                    _.forEach(_this.routes, function (route) {
                                        if (argument.text &&
                                            route.name === argument.text &&
                                            route.filename === _this.modulesWithRoutes[i].filename) {
                                            route.module = _this.modulesWithRoutes[i].name;
                                        }
                                        else if (argument.text &&
                                            route.name === argument.text &&
                                            route.filename !== _this.modulesWithRoutes[i].filename) {
                                            var argumentImportPath = imports_util_1.default.findFilePathOfImportedVariable(argument.text, _this.modulesWithRoutes[i].filename);
                                            var cleaner = (process.cwd() + path.sep).replace(/\\/g, '/');
                                            argumentImportPath = argumentImportPath.replace(cleaner, '');
                                            if (argument.text &&
                                                route.name === argument.text &&
                                                route.filename === argumentImportPath) {
                                                route.module = _this.modulesWithRoutes[i].name;
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    }
                }
                /**
                 * direct support of for example
                 * export const HomeRoutingModule: ModuleWithProviders = RouterModule.forChild(HOME_ROUTES);
                 */
                if (ts_simple_ast_1.ts.isCallExpression(node)) {
                    if (node.arguments) {
                        _.forEach(node.arguments, function (argument) {
                            _.forEach(_this.routes, function (route) {
                                if (argument.text &&
                                    route.name === argument.text &&
                                    route.filename === _this.modulesWithRoutes[i].filename) {
                                    route.module = _this.modulesWithRoutes[i].name;
                                }
                            });
                        });
                    }
                }
            });
        }
    };
    RouterParserUtil.prototype.foundRouteWithModuleName = function (moduleName) {
        return _.find(this.routes, { module: moduleName });
    };
    RouterParserUtil.prototype.foundLazyModuleWithPath = function (modulePath) {
        // path is like app/customers/customers.module#CustomersModule
        var split = modulePath.split('#');
        var lazyModulePath = split[0];
        var lazyModuleName = split[1];
        return lazyModuleName;
    };
    RouterParserUtil.prototype.constructRoutesTree = function () {
        var _this = this;
        // routes[] contains routes with module link
        // modulesTree contains modules tree
        // make a final routes tree with that
        traverse(this.modulesTree).forEach(function (node) {
            if (node) {
                if (node.parent) {
                    delete node.parent;
                }
                if (node.initializer) {
                    delete node.initializer;
                }
                if (node.importsNode) {
                    delete node.importsNode;
                }
            }
        });
        this.cleanModulesTree = _.cloneDeep(this.modulesTree);
        var routesTree = {
            name: '<root>',
            kind: 'module',
            className: this.rootModule,
            children: []
        };
        var loopModulesParser = function (node) {
            if (node.children && node.children.length > 0) {
                // If module has child modules
                for (var i in node.children) {
                    var route = _this.foundRouteWithModuleName(node.children[i].name);
                    if (route && route.data) {
                        try {
                            route.children = JSON5.parse(route.data);
                        }
                        catch (e) {
                            logger_1.logger.error('Error during generation of routes JSON file, maybe a trailing comma or an external variable inside one route.');
                        }
                        delete route.data;
                        route.kind = 'module';
                        routesTree.children.push(route);
                    }
                    if (node.children[i].children) {
                        loopModulesParser(node.children[i]);
                    }
                }
            }
            else {
                // else routes are directly inside the module
                var rawRoutes = _this.foundRouteWithModuleName(node.name);
                if (rawRoutes) {
                    var routes = JSON5.parse(rawRoutes.data);
                    if (routes) {
                        var i = 0;
                        var len = routes.length;
                        var routeAddedOnce = false;
                        for (i; i < len; i++) {
                            var route = routes[i];
                            if (routes[i].component) {
                                routeAddedOnce = true;
                                routesTree.children.push({
                                    kind: 'component',
                                    component: routes[i].component,
                                    path: routes[i].path
                                });
                            }
                        }
                        if (!routeAddedOnce) {
                            routesTree.children = routesTree.children.concat(routes);
                        }
                    }
                }
            }
        };
        var startModule = _.find(this.cleanModulesTree, { name: this.rootModule });
        if (startModule) {
            loopModulesParser(startModule);
            // Loop twice for routes with lazy loading
            // loopModulesParser(routesTree);
        }
        var cleanedRoutesTree = undefined;
        var cleanRoutesTree = function (route) {
            for (var i in route.children) {
                var routes = route.children[i].routes;
            }
            return route;
        };
        cleanedRoutesTree = cleanRoutesTree(routesTree);
        // Try updating routes with lazy loading
        var loopInsideModule = function (mod, _rawModule) {
            if (mod.children) {
                for (var z in mod.children) {
                    var route = _this.foundRouteWithModuleName(mod.children[z].name);
                    if (typeof route !== 'undefined') {
                        if (route.data) {
                            route.children = JSON5.parse(route.data);
                            delete route.data;
                            route.kind = 'module';
                            _rawModule.children.push(route);
                        }
                    }
                }
            }
            else {
                var route = _this.foundRouteWithModuleName(mod.name);
                if (typeof route !== 'undefined') {
                    if (route.data) {
                        route.children = JSON5.parse(route.data);
                        delete route.data;
                        route.kind = 'module';
                        _rawModule.children.push(route);
                    }
                }
            }
        };
        var loopRoutesParser = function (route) {
            if (route.children) {
                for (var i in route.children) {
                    if (route.children[i].loadChildren) {
                        var child = _this.foundLazyModuleWithPath(route.children[i].loadChildren);
                        var module_1 = _.find(_this.cleanModulesTree, {
                            name: child
                        });
                        if (module_1) {
                            var _rawModule = {};
                            _rawModule.kind = 'module';
                            _rawModule.children = [];
                            _rawModule.module = module_1.name;
                            loopInsideModule(module_1, _rawModule);
                            route.children[i].children = [];
                            route.children[i].children.push(_rawModule);
                        }
                    }
                    loopRoutesParser(route.children[i]);
                }
            }
        };
        loopRoutesParser(cleanedRoutesTree);
        return cleanedRoutesTree;
    };
    RouterParserUtil.prototype.constructModulesTree = function () {
        var _this = this;
        var getNestedChildren = function (arr, parent) {
            var out = [];
            for (var i in arr) {
                if (arr[i].parent === parent) {
                    var children = getNestedChildren(arr, arr[i].name);
                    if (children.length) {
                        arr[i].children = children;
                    }
                    out.push(arr[i]);
                }
            }
            return out;
        };
        // Scan each module and add parent property
        _.forEach(this.modules, function (firstLoopModule) {
            _.forEach(firstLoopModule.importsNode, function (importNode) {
                _.forEach(_this.modules, function (module) {
                    if (module.name === importNode.name) {
                        module.parent = firstLoopModule.name;
                    }
                });
            });
        });
        this.modulesTree = getNestedChildren(this.modules);
    };
    RouterParserUtil.prototype.generateRoutesIndex = function (outputFolder, routes) {
        return file_engine_1.default.get(__dirname + '/../src/templates/partials/routes-index.hbs').then(function (data) {
            var template = Handlebars.compile(data);
            var result = template({
                routes: JSON.stringify(routes)
            });
            var testOutputDir = outputFolder.match(process.cwd());
            if (testOutputDir && testOutputDir.length > 0) {
                outputFolder = outputFolder.replace(process.cwd() + path.sep, '');
            }
            return file_engine_1.default.write(outputFolder + path.sep + '/js/routes/routes_index.js', result);
        }, function (err) { return Promise.reject('Error during routes index generation'); });
    };
    RouterParserUtil.prototype.routesLength = function () {
        var _n = 0;
        var routesParser = function (route) {
            if (typeof route.path !== 'undefined') {
                _n += 1;
            }
            if (route.children) {
                for (var j in route.children) {
                    routesParser(route.children[j]);
                }
            }
        };
        for (var i in this.routes) {
            routesParser(this.routes[i]);
        }
        return _n;
    };
    RouterParserUtil.prototype.printRoutes = function () {
        console.log('');
        console.log('printRoutes: ');
        console.log(this.routes);
    };
    RouterParserUtil.prototype.printModulesRoutes = function () {
        console.log('');
        console.log('printModulesRoutes: ');
        console.log(this.modulesWithRoutes);
    };
    RouterParserUtil.prototype.isVariableRoutes = function (node) {
        var result = false;
        if (node.declarationList && node.declarationList.declarations) {
            var i = 0;
            var len = node.declarationList.declarations.length;
            for (i; i < len; i++) {
                if (node.declarationList.declarations[i].type) {
                    if (node.declarationList.declarations[i].type.typeName &&
                        node.declarationList.declarations[i].type.typeName.text === 'Routes') {
                        result = true;
                    }
                }
            }
        }
        return result;
    };
    RouterParserUtil.prototype.cleanFileIdentifiers = function (sourceFile) {
        var _this = this;
        var file = sourceFile;
        var identifiers = file.getDescendantsOfKind(ts_simple_ast_1.SyntaxKind.Identifier).filter(function (p) {
            return (ts_simple_ast_1.TypeGuards.isArrayLiteralExpression(p.getParentOrThrow()) ||
                ts_simple_ast_1.TypeGuards.isPropertyAssignment(p.getParentOrThrow()));
        });
        var identifiersInRoutesVariableStatement = [];
        var _loop_1 = function (identifier) {
            // Loop through their parents nodes, and if one is a variableStatement and === 'routes'
            var foundParentVariableStatement = false;
            var parent_1 = identifier.getParentWhile(function (n) {
                if (n.getKind() === ts_simple_ast_1.SyntaxKind.VariableStatement) {
                    if (_this.isVariableRoutes(n.compilerNode)) {
                        foundParentVariableStatement = true;
                    }
                }
                return true;
            });
            if (foundParentVariableStatement) {
                identifiersInRoutesVariableStatement.push(identifier);
            }
        };
        for (var _i = 0, identifiers_1 = identifiers; _i < identifiers_1.length; _i++) {
            var identifier = identifiers_1[_i];
            _loop_1(identifier);
        }
        // inline the property access expressions
        for (var _a = 0, identifiersInRoutesVariableStatement_1 = identifiersInRoutesVariableStatement; _a < identifiersInRoutesVariableStatement_1.length; _a++) {
            var identifier = identifiersInRoutesVariableStatement_1[_a];
            var identifierDeclaration = identifier
                .getSymbolOrThrow()
                .getValueDeclarationOrThrow();
            if (!ts_simple_ast_1.TypeGuards.isPropertyAssignment(identifierDeclaration) &&
                ts_simple_ast_1.TypeGuards.isVariableDeclaration(identifierDeclaration) &&
                (ts_simple_ast_1.TypeGuards.isPropertyAssignment(identifierDeclaration) &&
                    !ts_simple_ast_1.TypeGuards.isVariableDeclaration(identifierDeclaration))) {
                throw new Error("Not implemented referenced declaration kind: " + identifierDeclaration.getKindName());
            }
            if (ts_simple_ast_1.TypeGuards.isVariableDeclaration(identifierDeclaration)) {
                identifier.replaceWithText(identifierDeclaration.getInitializerOrThrow().getText());
            }
        }
        return file;
    };
    RouterParserUtil.prototype.cleanFileSpreads = function (sourceFile) {
        var _this = this;
        var file = sourceFile;
        var spreadElements = file
            .getDescendantsOfKind(ts_simple_ast_1.SyntaxKind.SpreadElement)
            .filter(function (p) { return ts_simple_ast_1.TypeGuards.isArrayLiteralExpression(p.getParentOrThrow()); });
        var spreadElementsInRoutesVariableStatement = [];
        var _loop_2 = function (spreadElement) {
            // Loop through their parents nodes, and if one is a variableStatement and === 'routes'
            var foundParentVariableStatement = false;
            var parent_2 = spreadElement.getParentWhile(function (n) {
                if (n.getKind() === ts_simple_ast_1.SyntaxKind.VariableStatement) {
                    if (_this.isVariableRoutes(n.compilerNode)) {
                        foundParentVariableStatement = true;
                    }
                }
                return true;
            });
            if (foundParentVariableStatement) {
                spreadElementsInRoutesVariableStatement.push(spreadElement);
            }
        };
        for (var _i = 0, spreadElements_1 = spreadElements; _i < spreadElements_1.length; _i++) {
            var spreadElement = spreadElements_1[_i];
            _loop_2(spreadElement);
        }
        var _loop_3 = function (spreadElement) {
            var spreadElementIdentifier = spreadElement.getExpression().getText(), searchedImport, aliasOriginalName = '', foundWithAliasInImports = false, foundWithAlias = false;
            // Try to find it in imports
            var imports = file.getImportDeclarations();
            imports.forEach(function (i) {
                var namedImports = i.getNamedImports(), namedImportsLength = namedImports.length, j = 0;
                if (namedImportsLength > 0) {
                    for (j; j < namedImportsLength; j++) {
                        var importName = namedImports[j].getNameNode().getText(), importAlias = void 0;
                        if (namedImports[j].getAliasIdentifier()) {
                            importAlias = namedImports[j].getAliasIdentifier().getText();
                        }
                        if (importName === spreadElementIdentifier) {
                            foundWithAliasInImports = true;
                            searchedImport = i;
                            break;
                        }
                        if (importAlias === spreadElementIdentifier) {
                            foundWithAliasInImports = true;
                            foundWithAlias = true;
                            aliasOriginalName = importName;
                            searchedImport = i;
                            break;
                        }
                    }
                }
            });
            var referencedDeclaration = void 0;
            if (foundWithAliasInImports) {
                if (typeof searchedImport !== 'undefined') {
                    var importPath = path.resolve(path.dirname(file.getFilePath()) +
                        '/' +
                        searchedImport.getModuleSpecifierValue() +
                        '.ts');
                    var sourceFileImport = typeof ast.getSourceFile(importPath) !== 'undefined'
                        ? ast.getSourceFile(importPath)
                        : ast.addExistingSourceFile(importPath);
                    if (sourceFileImport) {
                        var variableName = foundWithAlias
                            ? aliasOriginalName
                            : spreadElementIdentifier;
                        referencedDeclaration = sourceFileImport.getVariableDeclaration(variableName);
                    }
                }
            }
            else {
                // if not, try directly in file
                referencedDeclaration = spreadElement
                    .getExpression()
                    .getSymbolOrThrow()
                    .getValueDeclarationOrThrow();
            }
            if (!ts_simple_ast_1.TypeGuards.isVariableDeclaration(referencedDeclaration)) {
                throw new Error("Not implemented referenced declaration kind: " + referencedDeclaration.getKindName());
            }
            var referencedArray = referencedDeclaration.getInitializerIfKindOrThrow(ts_simple_ast_1.SyntaxKind.ArrayLiteralExpression);
            var spreadElementArray = spreadElement.getParentIfKindOrThrow(ts_simple_ast_1.SyntaxKind.ArrayLiteralExpression);
            var insertIndex = spreadElementArray.getElements().indexOf(spreadElement);
            spreadElementArray.removeElement(spreadElement);
            spreadElementArray.insertElements(insertIndex, referencedArray.getElements().map(function (e) { return e.getText(); }));
        };
        // inline the ArrayLiteralExpression SpreadElements
        for (var _a = 0, spreadElementsInRoutesVariableStatement_1 = spreadElementsInRoutesVariableStatement; _a < spreadElementsInRoutesVariableStatement_1.length; _a++) {
            var spreadElement = spreadElementsInRoutesVariableStatement_1[_a];
            _loop_3(spreadElement);
        }
        return file;
    };
    RouterParserUtil.prototype.cleanFileDynamics = function (sourceFile) {
        var _this = this;
        var file = sourceFile;
        var propertyAccessExpressions = file
            .getDescendantsOfKind(ts_simple_ast_1.SyntaxKind.PropertyAccessExpression)
            .filter(function (p) { return !ts_simple_ast_1.TypeGuards.isPropertyAccessExpression(p.getParentOrThrow()); });
        var propertyAccessExpressionsInRoutesVariableStatement = [];
        var _loop_4 = function (propertyAccessExpression) {
            // Loop through their parents nodes, and if one is a variableStatement and === 'routes'
            var foundParentVariableStatement = false;
            var parent_3 = propertyAccessExpression.getParentWhile(function (n) {
                if (n.getKind() === ts_simple_ast_1.SyntaxKind.VariableStatement) {
                    if (_this.isVariableRoutes(n.compilerNode)) {
                        foundParentVariableStatement = true;
                    }
                }
                return true;
            });
            if (foundParentVariableStatement) {
                propertyAccessExpressionsInRoutesVariableStatement.push(propertyAccessExpression);
            }
        };
        for (var _i = 0, propertyAccessExpressions_1 = propertyAccessExpressions; _i < propertyAccessExpressions_1.length; _i++) {
            var propertyAccessExpression = propertyAccessExpressions_1[_i];
            _loop_4(propertyAccessExpression);
        }
        // inline the property access expressions
        for (var _a = 0, propertyAccessExpressionsInRoutesVariableStatement_1 = propertyAccessExpressionsInRoutesVariableStatement; _a < propertyAccessExpressionsInRoutesVariableStatement_1.length; _a++) {
            var propertyAccessExpression = propertyAccessExpressionsInRoutesVariableStatement_1[_a];
            var referencedDeclaration = propertyAccessExpression
                .getNameNode()
                .getSymbolOrThrow()
                .getValueDeclarationOrThrow();
            if (!ts_simple_ast_1.TypeGuards.isPropertyAssignment(referencedDeclaration) &&
                ts_simple_ast_1.TypeGuards.isEnumMember(referencedDeclaration) &&
                (ts_simple_ast_1.TypeGuards.isPropertyAssignment(referencedDeclaration) &&
                    !ts_simple_ast_1.TypeGuards.isEnumMember(referencedDeclaration))) {
                throw new Error("Not implemented referenced declaration kind: " + referencedDeclaration.getKindName());
            }
            if (typeof referencedDeclaration.getInitializerOrThrow !== 'undefined') {
                propertyAccessExpression.replaceWithText(referencedDeclaration.getInitializerOrThrow().getText());
            }
        }
        return file;
    };
    /**
     * replace callexpressions with string : utils.doWork() -> 'utils.doWork()' doWork() -> 'doWork()'
     * @param sourceFile ts.SourceFile
     */
    RouterParserUtil.prototype.cleanCallExpressions = function (sourceFile) {
        var file = sourceFile;
        var variableStatements = sourceFile.getVariableDeclaration(function (v) {
            var result = false;
            if (typeof v.compilerNode.type !== 'undefined') {
                result = v.compilerNode.type.typeName.text === 'Routes';
            }
            return result;
        });
        var initializer = variableStatements.getInitializer();
        var _loop_5 = function (callExpr) {
            if (callExpr.wasForgotten()) {
                return "continue";
            }
            callExpr.replaceWithText(function (writer) { return writer.quote(callExpr.getText()); });
        };
        for (var _i = 0, _a = initializer.getDescendantsOfKind(ts_simple_ast_1.SyntaxKind.CallExpression); _i < _a.length; _i++) {
            var callExpr = _a[_i];
            _loop_5(callExpr);
        }
        return file;
    };
    /**
     * Clean routes definition with imported data, for example path, children, or dynamic stuff inside data
     *
     * const MY_ROUTES: Routes = [
     *     {
     *         path: 'home',
     *         component: HomeComponent
     *     },
     *     {
     *         path: PATHS.home,
     *         component: HomeComponent
     *     }
     * ];
     *
     * The initializer is an array (ArrayLiteralExpression - 177 ), it has elements, objects (ObjectLiteralExpression - 178)
     * with properties (PropertyAssignment - 261)
     *
     * For each know property (https://angular.io/api/router/Routes#description), we try to see if we have what we want
     *
     * Ex: path and pathMatch want a string, component a component reference.
     *
     * It is an imperative approach, not a generic way, parsing all the tree
     * and find something like this which willl break JSON.stringify : MYIMPORT.path
     *
     * @param  {ts.Node} initializer The node of routes definition
     * @return {ts.Node}             The edited node
     */
    RouterParserUtil.prototype.cleanRoutesDefinitionWithImport = function (initializer, node, sourceFile) {
        initializer.elements.forEach(function (element) {
            element.properties.forEach(function (property) {
                var propertyName = property.name.getText(), propertyInitializer = property.initializer;
                switch (propertyName) {
                    case 'path':
                    case 'redirectTo':
                    case 'outlet':
                    case 'pathMatch':
                        if (propertyInitializer) {
                            if (propertyInitializer.kind !== ts_simple_ast_1.SyntaxKind.StringLiteral) {
                                // Identifier(71) won't break parsing, but it will be better to retrive them
                                // PropertyAccessExpression(179) ex: MYIMPORT.path will break it, find it in import
                                if (propertyInitializer.kind === ts_simple_ast_1.SyntaxKind.PropertyAccessExpression) {
                                    var lastObjectLiteralAttributeName = propertyInitializer.name.getText(), firstObjectLiteralAttributeName = void 0;
                                    if (propertyInitializer.expression) {
                                        firstObjectLiteralAttributeName = propertyInitializer.expression.getText();
                                        var result = imports_util_1.default.findPropertyValueInImportOrLocalVariables(firstObjectLiteralAttributeName +
                                            '.' +
                                            lastObjectLiteralAttributeName, sourceFile); // tslint:disable-line
                                        if (result !== '') {
                                            propertyInitializer.kind = 9;
                                            propertyInitializer.text = result;
                                        }
                                    }
                                }
                            }
                        }
                        break;
                }
            });
        });
        return initializer;
    };
    return RouterParserUtil;
}());
exports.RouterParserUtil = RouterParserUtil;
exports.default = RouterParserUtil.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLXBhcnNlci51dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy91dGlscy9yb3V0ZXItcGFyc2VyLnV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBeUM7QUFDekMsNkJBQStCO0FBQy9CLDBCQUE0QjtBQUM1QiwyQkFBNkI7QUFDN0IsK0NBQTRFO0FBRTVFLDBEQUFvRDtBQUdwRCwrQ0FBeUM7QUFDekMsbUNBQWtDO0FBRWxDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUVyQyxJQUFNLEdBQUcsR0FBRyxJQUFJLHVCQUFHLEVBQUUsQ0FBQztBQUV0QjtJQVVJO1FBVFEsV0FBTSxHQUFVLEVBQUUsQ0FBQztRQUNuQixxQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDdEIsWUFBTyxHQUFHLEVBQUUsQ0FBQztRQUliLHNCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUdSLENBQUM7SUFDViw0QkFBVyxHQUF6QjtRQUNJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUU7WUFDNUIsZ0JBQWdCLENBQUMsUUFBUSxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztTQUN0RDtRQUNELE9BQU8sZ0JBQWdCLENBQUMsUUFBUSxDQUFDO0lBQ3JDLENBQUM7SUFFTSxtQ0FBUSxHQUFmLFVBQWdCLEtBQUs7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENB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QixHQUFHLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3Q0FDM0UsSUFBSSxNQUFNLEdBQUcsc0JBQVcsQ0FBQyx5Q0FBeUMsQ0FDOUQsK0JBQStCOzRDQUMzQixHQUFHOzRDQUNILDhCQUE4QixFQUNsQyxVQUFVLENBQ2IsQ0FBQyxDQUFDLHNCQUFzQjt3Q0FDekIsSUFBSSxNQUFNLEtBQUssRUFBRSxFQUFFOzRDQUNmLG1CQUFtQixDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7NENBQzdCLG1CQUFtQixDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7eUNBQ3JDO3FDQUNKO2lDQUNKOzZCQUNKO3lCQUNKO3dCQUNELE1BQU07aUJBQ2I7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUNMLHVCQUFDO0FBQUQsQ0FBQyxBQW52QkQsSUFtdkJDO0FBbnZCWSw0Q0FBZ0I7QUFxdkI3QixrQkFBZSxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEhhbmRsZWJhcnMgZnJvbSAnaGFuZGxlYmFycyc7XG5pbXBvcnQgKiBhcyBKU09ONSBmcm9tICdqc29uNSc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IEFzdCwgeyB0cywgU291cmNlRmlsZSwgU3ludGF4S2luZCwgVHlwZUd1YXJkcyB9IGZyb20gJ3RzLXNpbXBsZS1hc3QnO1xuXG5pbXBvcnQgRmlsZUVuZ2luZSBmcm9tICcuLi9hcHAvZW5naW5lcy9maWxlLmVuZ2luZSc7XG5pbXBvcnQgeyBSb3V0aW5nR3JhcGhOb2RlIH0gZnJvbSAnLi4vYXBwL25vZGVzL3JvdXRpbmctZ3JhcGgtbm9kZSc7XG5cbmltcG9ydCBJbXBvcnRzVXRpbCBmcm9tICcuL2ltcG9ydHMudXRpbCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuL2xvZ2dlcic7XG5cbmNvbnN0IHRyYXZlcnNlID0gcmVxdWlyZSgndHJhdmVyc2UnKTtcblxuY29uc3QgYXN0ID0gbmV3IEFzdCgpO1xuXG5leHBvcnQgY2xhc3MgUm91dGVyUGFyc2VyVXRpbCB7XG4gICAgcHJpdmF0ZSByb3V0ZXM6IGFueVtdID0gW107XG4gICAgcHJpdmF0ZSBpbmNvbXBsZXRlUm91dGVzID0gW107XG4gICAgcHJpdmF0ZSBtb2R1bGVzID0gW107XG4gICAgcHJpdmF0ZSBtb2R1bGVzVHJlZTtcbiAgICBwcml2YXRlIHJvb3RNb2R1bGU6IHN0cmluZztcbiAgICBwcml2YXRlIGNsZWFuTW9kdWxlc1RyZWU7XG4gICAgcHJpdmF0ZSBtb2R1bGVzV2l0aFJvdXRlcyA9IFtdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IFJvdXRlclBhcnNlclV0aWw7XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKCFSb3V0ZXJQYXJzZXJVdGlsLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBSb3V0ZXJQYXJzZXJVdGlsLmluc3RhbmNlID0gbmV3IFJvdXRlclBhcnNlclV0aWwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUm91dGVyUGFyc2VyVXRpbC5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkUm91dGUocm91dGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgICAgIHRoaXMucm91dGVzID0gXy5zb3J0QnkoXy51bmlxV2l0aCh0aGlzLnJvdXRlcywgXy5pc0VxdWFsKSwgWyduYW1lJ10pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRJbmNvbXBsZXRlUm91dGUocm91dGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbmNvbXBsZXRlUm91dGVzLnB1c2gocm91dGUpO1xuICAgICAgICB0aGlzLmluY29tcGxldGVSb3V0ZXMgPSBfLnNvcnRCeShfLnVuaXFXaXRoKHRoaXMuaW5jb21wbGV0ZVJvdXRlcywgXy5pc0VxdWFsKSwgWyduYW1lJ10pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRNb2R1bGVXaXRoUm91dGVzKG1vZHVsZU5hbWUsIG1vZHVsZUltcG9ydHMsIGZpbGVuYW1lKTogdm9pZCB7XG4gICAgICAgIHRoaXMubW9kdWxlc1dpdGhSb3V0ZXMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBtb2R1bGVOYW1lLFxuICAgICAgICAgICAgaW1wb3J0c05vZGU6IG1vZHVsZUltcG9ydHMsXG4gICAgICAgICAgICBmaWxlbmFtZTogZmlsZW5hbWVcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubW9kdWxlc1dpdGhSb3V0ZXMgPSBfLnNvcnRCeShfLnVuaXFXaXRoKHRoaXMubW9kdWxlc1dpdGhSb3V0ZXMsIF8uaXNFcXVhbCksIFsnbmFtZSddKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkTW9kdWxlKG1vZHVsZU5hbWU6IHN0cmluZywgbW9kdWxlSW1wb3J0cyk6IHZvaWQge1xuICAgICAgICB0aGlzLm1vZHVsZXMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBtb2R1bGVOYW1lLFxuICAgICAgICAgICAgaW1wb3J0c05vZGU6IG1vZHVsZUltcG9ydHNcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubW9kdWxlcyA9IF8uc29ydEJ5KF8udW5pcVdpdGgodGhpcy5tb2R1bGVzLCBfLmlzRXF1YWwpLCBbJ25hbWUnXSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFuUmF3Um91dGVQYXJzZWQocm91dGU6IHN0cmluZyk6IG9iamVjdCB7XG4gICAgICAgIGxldCByb3V0ZXNXaXRob3V0U3BhY2VzID0gcm91dGUucmVwbGFjZSgvIC9nbSwgJycpO1xuICAgICAgICBsZXQgdGVzdFRyYWlsaW5nQ29tbWEgPSByb3V0ZXNXaXRob3V0U3BhY2VzLmluZGV4T2YoJ30sXScpO1xuICAgICAgICBpZiAodGVzdFRyYWlsaW5nQ29tbWEgIT09IC0xKSB7XG4gICAgICAgICAgICByb3V0ZXNXaXRob3V0U3BhY2VzID0gcm91dGVzV2l0aG91dFNwYWNlcy5yZXBsYWNlKCd9LF0nLCAnfV0nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSlNPTjUucGFyc2Uocm91dGVzV2l0aG91dFNwYWNlcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFuUmF3Um91dGUocm91dGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCByb3V0ZXNXaXRob3V0U3BhY2VzID0gcm91dGUucmVwbGFjZSgvIC9nbSwgJycpO1xuICAgICAgICBsZXQgdGVzdFRyYWlsaW5nQ29tbWEgPSByb3V0ZXNXaXRob3V0U3BhY2VzLmluZGV4T2YoJ30sXScpO1xuICAgICAgICBpZiAodGVzdFRyYWlsaW5nQ29tbWEgIT09IC0xKSB7XG4gICAgICAgICAgICByb3V0ZXNXaXRob3V0U3BhY2VzID0gcm91dGVzV2l0aG91dFNwYWNlcy5yZXBsYWNlKCd9LF0nLCAnfV0nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm91dGVzV2l0aG91dFNwYWNlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Um9vdE1vZHVsZShtb2R1bGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnJvb3RNb2R1bGUgPSBtb2R1bGU7XG4gICAgfVxuXG4gICAgcHVibGljIGhhc1JvdXRlck1vZHVsZUluSW1wb3J0cyhpbXBvcnRzOiBBcnJheTxhbnk+KTogYm9vbGVhbiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1wb3J0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGltcG9ydHNbaV0ubmFtZS5pbmRleE9mKCdSb3V0ZXJNb2R1bGUuZm9yQ2hpbGQnKSAhPT0gLTEgfHxcbiAgICAgICAgICAgICAgICBpbXBvcnRzW2ldLm5hbWUuaW5kZXhPZignUm91dGVyTW9kdWxlLmZvclJvb3QnKSAhPT0gLTEgfHxcbiAgICAgICAgICAgICAgICBpbXBvcnRzW2ldLm5hbWUuaW5kZXhPZignUm91dGVyTW9kdWxlJykgIT09IC0xXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZml4SW5jb21wbGV0ZVJvdXRlcyhtaXNjZWxsYW5lb3VzVmFyaWFibGVzOiBBcnJheTxhbnk+KTogdm9pZCB7XG4gICAgICAgIGxldCBtYXRjaGluZ1ZhcmlhYmxlcyA9IFtdO1xuICAgICAgICAvLyBGb3IgZWFjaCBpbmNvbXBsZXRlUm91dGUsIHNjYW4gaWYgb25lIG1pc2MgdmFyaWFibGUgaXMgaW4gY29kZVxuICAgICAgICAvLyBpZiBvaywgdHJ5IHJlY3JlYXRpbmcgY29tcGxldGUgcm91dGVcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmluY29tcGxldGVSb3V0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWlzY2VsbGFuZW91c1ZhcmlhYmxlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluY29tcGxldGVSb3V0ZXNbaV0uZGF0YS5pbmRleE9mKG1pc2NlbGxhbmVvdXNWYXJpYWJsZXNbal0ubmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmb3VuZCBvbmUgbWlzYyB2YXIgaW5zaWRlIGluY29tcGxldGVSb3V0ZScpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtaXNjZWxsYW5lb3VzVmFyaWFibGVzW2pdLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGluZ1ZhcmlhYmxlcy5wdXNoKG1pc2NlbGxhbmVvdXNWYXJpYWJsZXNbal0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIENsZWFuIGluY29tcGxldGVSb3V0ZVxuICAgICAgICAgICAgdGhpcy5pbmNvbXBsZXRlUm91dGVzW2ldLmRhdGEgPSB0aGlzLmluY29tcGxldGVSb3V0ZXNbaV0uZGF0YS5yZXBsYWNlKCdbJywgJycpO1xuICAgICAgICAgICAgdGhpcy5pbmNvbXBsZXRlUm91dGVzW2ldLmRhdGEgPSB0aGlzLmluY29tcGxldGVSb3V0ZXNbaV0uZGF0YS5yZXBsYWNlKCddJywgJycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGxpbmtNb2R1bGVzQW5kUm91dGVzKCk6IHZvaWQge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGxldCBsZW4gPSB0aGlzLm1vZHVsZXNXaXRoUm91dGVzLmxlbmd0aDtcbiAgICAgICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIF8uZm9yRWFjaCh0aGlzLm1vZHVsZXNXaXRoUm91dGVzW2ldLmltcG9ydHNOb2RlLCAobm9kZTogdHMuUHJvcGVydHlEZWNsYXJhdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBpbml0aWFsaXplciA9IG5vZGUuaW5pdGlhbGl6ZXIgYXMgdHMuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbjtcbiAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWxpemVyLmVsZW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLmZvckVhY2goaW5pdGlhbGl6ZXIuZWxlbWVudHMsIChlbGVtZW50OiB0cy5DYWxsRXhwcmVzc2lvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgZWxlbWVudCB3aXRoIGFyZ3VtZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmFyZ3VtZW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmZvckVhY2goZWxlbWVudC5hcmd1bWVudHMsIChhcmd1bWVudDogdHMuSWRlbnRpZmllcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKHRoaXMucm91dGVzLCByb3V0ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudC50ZXh0ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlLm5hbWUgPT09IGFyZ3VtZW50LnRleHQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUuZmlsZW5hbWUgPT09IHRoaXMubW9kdWxlc1dpdGhSb3V0ZXNbaV0uZmlsZW5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUubW9kdWxlID0gdGhpcy5tb2R1bGVzV2l0aFJvdXRlc1tpXS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50LnRleHQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUubmFtZSA9PT0gYXJndW1lbnQudGV4dCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZS5maWxlbmFtZSAhPT0gdGhpcy5tb2R1bGVzV2l0aFJvdXRlc1tpXS5maWxlbmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXJndW1lbnRJbXBvcnRQYXRoID0gSW1wb3J0c1V0aWwuZmluZEZpbGVQYXRoT2ZJbXBvcnRlZFZhcmlhYmxlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnQudGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9kdWxlc1dpdGhSb3V0ZXNbaV0uZmlsZW5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNsZWFuZXIgPSAocHJvY2Vzcy5jd2QoKSArIHBhdGguc2VwKS5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgL1xcXFwvZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudEltcG9ydFBhdGggPSBhcmd1bWVudEltcG9ydFBhdGgucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFuZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudC50ZXh0ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZS5uYW1lID09PSBhcmd1bWVudC50ZXh0ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZS5maWxlbmFtZSA9PT0gYXJndW1lbnRJbXBvcnRQYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUubW9kdWxlID0gdGhpcy5tb2R1bGVzV2l0aFJvdXRlc1tpXS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIGRpcmVjdCBzdXBwb3J0IG9mIGZvciBleGFtcGxlXG4gICAgICAgICAgICAgICAgICogZXhwb3J0IGNvbnN0IEhvbWVSb3V0aW5nTW9kdWxlOiBNb2R1bGVXaXRoUHJvdmlkZXJzID0gUm91dGVyTW9kdWxlLmZvckNoaWxkKEhPTUVfUk9VVEVTKTtcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAodHMuaXNDYWxsRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5hcmd1bWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZm9yRWFjaChub2RlLmFyZ3VtZW50cywgKGFyZ3VtZW50OiB0cy5JZGVudGlmaWVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKHRoaXMucm91dGVzLCByb3V0ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50LnRleHQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlLm5hbWUgPT09IGFyZ3VtZW50LnRleHQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlLmZpbGVuYW1lID09PSB0aGlzLm1vZHVsZXNXaXRoUm91dGVzW2ldLmZpbGVuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUubW9kdWxlID0gdGhpcy5tb2R1bGVzV2l0aFJvdXRlc1tpXS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGZvdW5kUm91dGVXaXRoTW9kdWxlTmFtZShtb2R1bGVOYW1lOiBzdHJpbmcpOiBhbnkge1xuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMucm91dGVzLCB7IG1vZHVsZTogbW9kdWxlTmFtZSB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZm91bmRMYXp5TW9kdWxlV2l0aFBhdGgobW9kdWxlUGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgLy8gcGF0aCBpcyBsaWtlIGFwcC9jdXN0b21lcnMvY3VzdG9tZXJzLm1vZHVsZSNDdXN0b21lcnNNb2R1bGVcbiAgICAgICAgbGV0IHNwbGl0ID0gbW9kdWxlUGF0aC5zcGxpdCgnIycpO1xuICAgICAgICBsZXQgbGF6eU1vZHVsZVBhdGggPSBzcGxpdFswXTtcbiAgICAgICAgbGV0IGxhenlNb2R1bGVOYW1lID0gc3BsaXRbMV07XG4gICAgICAgIHJldHVybiBsYXp5TW9kdWxlTmFtZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29uc3RydWN0Um91dGVzVHJlZSgpIHtcbiAgICAgICAgLy8gcm91dGVzW10gY29udGFpbnMgcm91dGVzIHdpdGggbW9kdWxlIGxpbmtcbiAgICAgICAgLy8gbW9kdWxlc1RyZWUgY29udGFpbnMgbW9kdWxlcyB0cmVlXG4gICAgICAgIC8vIG1ha2UgYSBmaW5hbCByb3V0ZXMgdHJlZSB3aXRoIHRoYXRcbiAgICAgICAgdHJhdmVyc2UodGhpcy5tb2R1bGVzVHJlZSkuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbm9kZS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub2RlLmluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlLmluaXRpYWxpemVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5pbXBvcnRzTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbm9kZS5pbXBvcnRzTm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2xlYW5Nb2R1bGVzVHJlZSA9IF8uY2xvbmVEZWVwKHRoaXMubW9kdWxlc1RyZWUpO1xuXG4gICAgICAgIGxldCByb3V0ZXNUcmVlID0ge1xuICAgICAgICAgICAgbmFtZTogJzxyb290PicsXG4gICAgICAgICAgICBraW5kOiAnbW9kdWxlJyxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogdGhpcy5yb290TW9kdWxlLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGxvb3BNb2R1bGVzUGFyc2VyID0gbm9kZSA9PiB7XG4gICAgICAgICAgICBpZiAobm9kZS5jaGlsZHJlbiAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBtb2R1bGUgaGFzIGNoaWxkIG1vZHVsZXNcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpIGluIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdXRlID0gdGhpcy5mb3VuZFJvdXRlV2l0aE1vZHVsZU5hbWUobm9kZS5jaGlsZHJlbltpXS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdXRlICYmIHJvdXRlLmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUuY2hpbGRyZW4gPSBKU09ONS5wYXJzZShyb3V0ZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdFcnJvciBkdXJpbmcgZ2VuZXJhdGlvbiBvZiByb3V0ZXMgSlNPTiBmaWxlLCBtYXliZSBhIHRyYWlsaW5nIGNvbW1hIG9yIGFuIGV4dGVybmFsIHZhcmlhYmxlIGluc2lkZSBvbmUgcm91dGUuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgcm91dGUuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlLmtpbmQgPSAnbW9kdWxlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlc1RyZWUuY2hpbGRyZW4ucHVzaChyb3V0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW5baV0uY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvb3BNb2R1bGVzUGFyc2VyKG5vZGUuY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBlbHNlIHJvdXRlcyBhcmUgZGlyZWN0bHkgaW5zaWRlIHRoZSBtb2R1bGVcbiAgICAgICAgICAgICAgICBsZXQgcmF3Um91dGVzID0gdGhpcy5mb3VuZFJvdXRlV2l0aE1vZHVsZU5hbWUobm9kZS5uYW1lKTtcblxuICAgICAgICAgICAgICAgIGlmIChyYXdSb3V0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdXRlcyA9IEpTT041LnBhcnNlKHJhd1JvdXRlcy5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdXRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxlbiA9IHJvdXRlcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcm91dGVBZGRlZE9uY2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJvdXRlID0gcm91dGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3V0ZXNbaV0uY29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlQWRkZWRPbmNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzVHJlZS5jaGlsZHJlbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtpbmQ6ICdjb21wb25lbnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50OiByb3V0ZXNbaV0uY29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogcm91dGVzW2ldLnBhdGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyb3V0ZUFkZGVkT25jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlc1RyZWUuY2hpbGRyZW4gPSBbLi4ucm91dGVzVHJlZS5jaGlsZHJlbiwgLi4ucm91dGVzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgc3RhcnRNb2R1bGUgPSBfLmZpbmQodGhpcy5jbGVhbk1vZHVsZXNUcmVlLCB7IG5hbWU6IHRoaXMucm9vdE1vZHVsZSB9KTtcblxuICAgICAgICBpZiAoc3RhcnRNb2R1bGUpIHtcbiAgICAgICAgICAgIGxvb3BNb2R1bGVzUGFyc2VyKHN0YXJ0TW9kdWxlKTtcbiAgICAgICAgICAgIC8vIExvb3AgdHdpY2UgZm9yIHJvdXRlcyB3aXRoIGxhenkgbG9hZGluZ1xuICAgICAgICAgICAgLy8gbG9vcE1vZHVsZXNQYXJzZXIocm91dGVzVHJlZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2xlYW5lZFJvdXRlc1RyZWUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgbGV0IGNsZWFuUm91dGVzVHJlZSA9IHJvdXRlID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gcm91dGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBsZXQgcm91dGVzID0gcm91dGUuY2hpbGRyZW5baV0ucm91dGVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJvdXRlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNsZWFuZWRSb3V0ZXNUcmVlID0gY2xlYW5Sb3V0ZXNUcmVlKHJvdXRlc1RyZWUpO1xuXG4gICAgICAgIC8vIFRyeSB1cGRhdGluZyByb3V0ZXMgd2l0aCBsYXp5IGxvYWRpbmdcblxuICAgICAgICBsZXQgbG9vcEluc2lkZU1vZHVsZSA9IChtb2QsIF9yYXdNb2R1bGUpID0+IHtcbiAgICAgICAgICAgIGlmIChtb2QuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB6IGluIG1vZC5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm91dGUgPSB0aGlzLmZvdW5kUm91dGVXaXRoTW9kdWxlTmFtZShtb2QuY2hpbGRyZW5bel0ubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygcm91dGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm91dGUuZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlLmNoaWxkcmVuID0gSlNPTjUucGFyc2Uocm91dGUuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJvdXRlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUua2luZCA9ICdtb2R1bGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yYXdNb2R1bGUuY2hpbGRyZW4ucHVzaChyb3V0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCByb3V0ZSA9IHRoaXMuZm91bmRSb3V0ZVdpdGhNb2R1bGVOYW1lKG1vZC5uYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJvdXRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm91dGUuZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUuY2hpbGRyZW4gPSBKU09ONS5wYXJzZShyb3V0ZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByb3V0ZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUua2luZCA9ICdtb2R1bGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3Jhd01vZHVsZS5jaGlsZHJlbi5wdXNoKHJvdXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgbG9vcFJvdXRlc1BhcnNlciA9IHJvdXRlID0+IHtcbiAgICAgICAgICAgIGlmIChyb3V0ZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgaW4gcm91dGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdXRlLmNoaWxkcmVuW2ldLmxvYWRDaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5mb3VuZExhenlNb2R1bGVXaXRoUGF0aChyb3V0ZS5jaGlsZHJlbltpXS5sb2FkQ2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1vZHVsZTogUm91dGluZ0dyYXBoTm9kZSA9IF8uZmluZCh0aGlzLmNsZWFuTW9kdWxlc1RyZWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjaGlsZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9kdWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IF9yYXdNb2R1bGU6IFJvdXRpbmdHcmFwaE5vZGUgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmF3TW9kdWxlLmtpbmQgPSAnbW9kdWxlJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmF3TW9kdWxlLmNoaWxkcmVuID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Jhd01vZHVsZS5tb2R1bGUgPSBtb2R1bGUubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb29wSW5zaWRlTW9kdWxlKG1vZHVsZSwgX3Jhd01vZHVsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZS5jaGlsZHJlbltpXS5jaGlsZHJlbiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlLmNoaWxkcmVuW2ldLmNoaWxkcmVuLnB1c2goX3Jhd01vZHVsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbG9vcFJvdXRlc1BhcnNlcihyb3V0ZS5jaGlsZHJlbltpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBsb29wUm91dGVzUGFyc2VyKGNsZWFuZWRSb3V0ZXNUcmVlKTtcblxuICAgICAgICByZXR1cm4gY2xlYW5lZFJvdXRlc1RyZWU7XG4gICAgfVxuXG4gICAgcHVibGljIGNvbnN0cnVjdE1vZHVsZXNUcmVlKCk6IHZvaWQge1xuICAgICAgICBsZXQgZ2V0TmVzdGVkQ2hpbGRyZW4gPSAoYXJyLCBwYXJlbnQ/KSA9PiB7XG4gICAgICAgICAgICBsZXQgb3V0ID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGFycikge1xuICAgICAgICAgICAgICAgIGlmIChhcnJbaV0ucGFyZW50ID09PSBwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gZ2V0TmVzdGVkQ2hpbGRyZW4oYXJyLCBhcnJbaV0ubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycltpXS5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG91dC5wdXNoKGFycltpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBTY2FuIGVhY2ggbW9kdWxlIGFuZCBhZGQgcGFyZW50IHByb3BlcnR5XG4gICAgICAgIF8uZm9yRWFjaCh0aGlzLm1vZHVsZXMsIGZpcnN0TG9vcE1vZHVsZSA9PiB7XG4gICAgICAgICAgICBfLmZvckVhY2goZmlyc3RMb29wTW9kdWxlLmltcG9ydHNOb2RlLCBpbXBvcnROb2RlID0+IHtcbiAgICAgICAgICAgICAgICBfLmZvckVhY2godGhpcy5tb2R1bGVzLCBtb2R1bGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kdWxlLm5hbWUgPT09IGltcG9ydE5vZGUubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlLnBhcmVudCA9IGZpcnN0TG9vcE1vZHVsZS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubW9kdWxlc1RyZWUgPSBnZXROZXN0ZWRDaGlsZHJlbih0aGlzLm1vZHVsZXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZW5lcmF0ZVJvdXRlc0luZGV4KG91dHB1dEZvbGRlcjogc3RyaW5nLCByb3V0ZXM6IEFycmF5PGFueT4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIEZpbGVFbmdpbmUuZ2V0KF9fZGlybmFtZSArICcvLi4vc3JjL3RlbXBsYXRlcy9wYXJ0aWFscy9yb3V0ZXMtaW5kZXguaGJzJykudGhlbihcbiAgICAgICAgICAgIGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZTogYW55ID0gSGFuZGxlYmFycy5jb21waWxlKGRhdGEpO1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSB0ZW1wbGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHJvdXRlczogSlNPTi5zdHJpbmdpZnkocm91dGVzKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxldCB0ZXN0T3V0cHV0RGlyID0gb3V0cHV0Rm9sZGVyLm1hdGNoKHByb2Nlc3MuY3dkKCkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRlc3RPdXRwdXREaXIgJiYgdGVzdE91dHB1dERpci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dEZvbGRlciA9IG91dHB1dEZvbGRlci5yZXBsYWNlKHByb2Nlc3MuY3dkKCkgKyBwYXRoLnNlcCwgJycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBGaWxlRW5naW5lLndyaXRlKFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRGb2xkZXIgKyBwYXRoLnNlcCArICcvanMvcm91dGVzL3JvdXRlc19pbmRleC5qcycsXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyID0+IFByb21pc2UucmVqZWN0KCdFcnJvciBkdXJpbmcgcm91dGVzIGluZGV4IGdlbmVyYXRpb24nKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyByb3V0ZXNMZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IF9uID0gMDtcbiAgICAgICAgbGV0IHJvdXRlc1BhcnNlciA9IHJvdXRlID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygcm91dGUucGF0aCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBfbiArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJvdXRlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiBpbiByb3V0ZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICByb3V0ZXNQYXJzZXIocm91dGUuY2hpbGRyZW5bal0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGxldCBpIGluIHRoaXMucm91dGVzKSB7XG4gICAgICAgICAgICByb3V0ZXNQYXJzZXIodGhpcy5yb3V0ZXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9uO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcmludFJvdXRlcygpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coJycpO1xuICAgICAgICBjb25zb2xlLmxvZygncHJpbnRSb3V0ZXM6ICcpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnJvdXRlcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHByaW50TW9kdWxlc1JvdXRlcygpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coJycpO1xuICAgICAgICBjb25zb2xlLmxvZygncHJpbnRNb2R1bGVzUm91dGVzOiAnKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5tb2R1bGVzV2l0aFJvdXRlcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzVmFyaWFibGVSb3V0ZXMobm9kZSkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uTGlzdCAmJiBub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnMpIHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGxldCBsZW4gPSBub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zW2ldLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zW2ldLnR5cGUudHlwZU5hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9uc1tpXS50eXBlLnR5cGVOYW1lLnRleHQgPT09ICdSb3V0ZXMnXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhbkZpbGVJZGVudGlmaWVycyhzb3VyY2VGaWxlOiBTb3VyY2VGaWxlKTogU291cmNlRmlsZSB7XG4gICAgICAgIGxldCBmaWxlID0gc291cmNlRmlsZTtcbiAgICAgICAgY29uc3QgaWRlbnRpZmllcnMgPSBmaWxlLmdldERlc2NlbmRhbnRzT2ZLaW5kKFN5bnRheEtpbmQuSWRlbnRpZmllcikuZmlsdGVyKHAgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICBUeXBlR3VhcmRzLmlzQXJyYXlMaXRlcmFsRXhwcmVzc2lvbihwLmdldFBhcmVudE9yVGhyb3coKSkgfHxcbiAgICAgICAgICAgICAgICBUeXBlR3VhcmRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHAuZ2V0UGFyZW50T3JUaHJvdygpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGlkZW50aWZpZXJzSW5Sb3V0ZXNWYXJpYWJsZVN0YXRlbWVudCA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgaWRlbnRpZmllciBvZiBpZGVudGlmaWVycykge1xuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZWlyIHBhcmVudHMgbm9kZXMsIGFuZCBpZiBvbmUgaXMgYSB2YXJpYWJsZVN0YXRlbWVudCBhbmQgPT09ICdyb3V0ZXMnXG4gICAgICAgICAgICBsZXQgZm91bmRQYXJlbnRWYXJpYWJsZVN0YXRlbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IHBhcmVudCA9IGlkZW50aWZpZXIuZ2V0UGFyZW50V2hpbGUobiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG4uZ2V0S2luZCgpID09PSBTeW50YXhLaW5kLlZhcmlhYmxlU3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzVmFyaWFibGVSb3V0ZXMobi5jb21waWxlck5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZFBhcmVudFZhcmlhYmxlU3RhdGVtZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGZvdW5kUGFyZW50VmFyaWFibGVTdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZGVudGlmaWVyc0luUm91dGVzVmFyaWFibGVTdGF0ZW1lbnQucHVzaChpZGVudGlmaWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlubGluZSB0aGUgcHJvcGVydHkgYWNjZXNzIGV4cHJlc3Npb25zXG4gICAgICAgIGZvciAoY29uc3QgaWRlbnRpZmllciBvZiBpZGVudGlmaWVyc0luUm91dGVzVmFyaWFibGVTdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkZW50aWZpZXJEZWNsYXJhdGlvbiA9IGlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAuZ2V0U3ltYm9sT3JUaHJvdygpXG4gICAgICAgICAgICAgICAgLmdldFZhbHVlRGVjbGFyYXRpb25PclRocm93KCk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgIVR5cGVHdWFyZHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQoaWRlbnRpZmllckRlY2xhcmF0aW9uKSAmJlxuICAgICAgICAgICAgICAgIFR5cGVHdWFyZHMuaXNWYXJpYWJsZURlY2xhcmF0aW9uKGlkZW50aWZpZXJEZWNsYXJhdGlvbikgJiZcbiAgICAgICAgICAgICAgICAoVHlwZUd1YXJkcy5pc1Byb3BlcnR5QXNzaWdubWVudChpZGVudGlmaWVyRGVjbGFyYXRpb24pICYmXG4gICAgICAgICAgICAgICAgICAgICFUeXBlR3VhcmRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihpZGVudGlmaWVyRGVjbGFyYXRpb24pKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICBgTm90IGltcGxlbWVudGVkIHJlZmVyZW5jZWQgZGVjbGFyYXRpb24ga2luZDogJHtpZGVudGlmaWVyRGVjbGFyYXRpb24uZ2V0S2luZE5hbWUoKX1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChUeXBlR3VhcmRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihpZGVudGlmaWVyRGVjbGFyYXRpb24pKSB7XG4gICAgICAgICAgICAgICAgaWRlbnRpZmllci5yZXBsYWNlV2l0aFRleHQoaWRlbnRpZmllckRlY2xhcmF0aW9uLmdldEluaXRpYWxpemVyT3JUaHJvdygpLmdldFRleHQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYW5GaWxlU3ByZWFkcyhzb3VyY2VGaWxlOiBTb3VyY2VGaWxlKTogU291cmNlRmlsZSB7XG4gICAgICAgIGxldCBmaWxlID0gc291cmNlRmlsZTtcbiAgICAgICAgY29uc3Qgc3ByZWFkRWxlbWVudHMgPSBmaWxlXG4gICAgICAgICAgICAuZ2V0RGVzY2VuZGFudHNPZktpbmQoU3ludGF4S2luZC5TcHJlYWRFbGVtZW50KVxuICAgICAgICAgICAgLmZpbHRlcihwID0+IFR5cGVHdWFyZHMuaXNBcnJheUxpdGVyYWxFeHByZXNzaW9uKHAuZ2V0UGFyZW50T3JUaHJvdygpKSk7XG5cbiAgICAgICAgbGV0IHNwcmVhZEVsZW1lbnRzSW5Sb3V0ZXNWYXJpYWJsZVN0YXRlbWVudCA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3Qgc3ByZWFkRWxlbWVudCBvZiBzcHJlYWRFbGVtZW50cykge1xuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZWlyIHBhcmVudHMgbm9kZXMsIGFuZCBpZiBvbmUgaXMgYSB2YXJpYWJsZVN0YXRlbWVudCBhbmQgPT09ICdyb3V0ZXMnXG4gICAgICAgICAgICBsZXQgZm91bmRQYXJlbnRWYXJpYWJsZVN0YXRlbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IHBhcmVudCA9IHNwcmVhZEVsZW1lbnQuZ2V0UGFyZW50V2hpbGUobiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG4uZ2V0S2luZCgpID09PSBTeW50YXhLaW5kLlZhcmlhYmxlU3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzVmFyaWFibGVSb3V0ZXMobi5jb21waWxlck5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZFBhcmVudFZhcmlhYmxlU3RhdGVtZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGZvdW5kUGFyZW50VmFyaWFibGVTdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBzcHJlYWRFbGVtZW50c0luUm91dGVzVmFyaWFibGVTdGF0ZW1lbnQucHVzaChzcHJlYWRFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlubGluZSB0aGUgQXJyYXlMaXRlcmFsRXhwcmVzc2lvbiBTcHJlYWRFbGVtZW50c1xuICAgICAgICBmb3IgKGNvbnN0IHNwcmVhZEVsZW1lbnQgb2Ygc3ByZWFkRWxlbWVudHNJblJvdXRlc1ZhcmlhYmxlU3RhdGVtZW50KSB7XG4gICAgICAgICAgICBsZXQgc3ByZWFkRWxlbWVudElkZW50aWZpZXIgPSBzcHJlYWRFbGVtZW50LmdldEV4cHJlc3Npb24oKS5nZXRUZXh0KCksXG4gICAgICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQsXG4gICAgICAgICAgICAgICAgYWxpYXNPcmlnaW5hbE5hbWUgPSAnJyxcbiAgICAgICAgICAgICAgICBmb3VuZFdpdGhBbGlhc0luSW1wb3J0cyA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZvdW5kV2l0aEFsaWFzID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIFRyeSB0byBmaW5kIGl0IGluIGltcG9ydHNcbiAgICAgICAgICAgIGNvbnN0IGltcG9ydHMgPSBmaWxlLmdldEltcG9ydERlY2xhcmF0aW9ucygpO1xuXG4gICAgICAgICAgICBpbXBvcnRzLmZvckVhY2goaSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG5hbWVkSW1wb3J0cyA9IGkuZ2V0TmFtZWRJbXBvcnRzKCksXG4gICAgICAgICAgICAgICAgICAgIG5hbWVkSW1wb3J0c0xlbmd0aCA9IG5hbWVkSW1wb3J0cy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIGogPSAwO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5hbWVkSW1wb3J0c0xlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChqOyBqIDwgbmFtZWRJbXBvcnRzTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbXBvcnROYW1lID0gbmFtZWRJbXBvcnRzW2pdLmdldE5hbWVOb2RlKCkuZ2V0VGV4dCgpIGFzIHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRBbGlhcztcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWVkSW1wb3J0c1tqXS5nZXRBbGlhc0lkZW50aWZpZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydEFsaWFzID0gbmFtZWRJbXBvcnRzW2pdLmdldEFsaWFzSWRlbnRpZmllcigpLmdldFRleHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGltcG9ydE5hbWUgPT09IHNwcmVhZEVsZW1lbnRJZGVudGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRXaXRoQWxpYXNJbkltcG9ydHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaGVkSW1wb3J0ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbXBvcnRBbGlhcyA9PT0gc3ByZWFkRWxlbWVudElkZW50aWZpZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZFdpdGhBbGlhc0luSW1wb3J0cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRXaXRoQWxpYXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWFzT3JpZ2luYWxOYW1lID0gaW1wb3J0TmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hlZEltcG9ydCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IHJlZmVyZW5jZWREZWNsYXJhdGlvbjtcblxuICAgICAgICAgICAgaWYgKGZvdW5kV2l0aEFsaWFzSW5JbXBvcnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzZWFyY2hlZEltcG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGltcG9ydFBhdGggPSBwYXRoLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoLmRpcm5hbWUoZmlsZS5nZXRGaWxlUGF0aCgpKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJy8nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hlZEltcG9ydC5nZXRNb2R1bGVTcGVjaWZpZXJWYWx1ZSgpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLnRzJ1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzb3VyY2VGaWxlSW1wb3J0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBhc3QuZ2V0U291cmNlRmlsZShpbXBvcnRQYXRoKSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGFzdC5nZXRTb3VyY2VGaWxlKGltcG9ydFBhdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBhc3QuYWRkRXhpc3RpbmdTb3VyY2VGaWxlKGltcG9ydFBhdGgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlRmlsZUltcG9ydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhcmlhYmxlTmFtZSA9IGZvdW5kV2l0aEFsaWFzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBhbGlhc09yaWdpbmFsTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogc3ByZWFkRWxlbWVudElkZW50aWZpZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2VkRGVjbGFyYXRpb24gPSBzb3VyY2VGaWxlSW1wb3J0LmdldFZhcmlhYmxlRGVjbGFyYXRpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBub3QsIHRyeSBkaXJlY3RseSBpbiBmaWxlXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlZERlY2xhcmF0aW9uID0gc3ByZWFkRWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAuZ2V0RXhwcmVzc2lvbigpXG4gICAgICAgICAgICAgICAgICAgIC5nZXRTeW1ib2xPclRocm93KClcbiAgICAgICAgICAgICAgICAgICAgLmdldFZhbHVlRGVjbGFyYXRpb25PclRocm93KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghVHlwZUd1YXJkcy5pc1ZhcmlhYmxlRGVjbGFyYXRpb24ocmVmZXJlbmNlZERlY2xhcmF0aW9uKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgYE5vdCBpbXBsZW1lbnRlZCByZWZlcmVuY2VkIGRlY2xhcmF0aW9uIGtpbmQ6ICR7cmVmZXJlbmNlZERlY2xhcmF0aW9uLmdldEtpbmROYW1lKCl9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZWRBcnJheSA9IHJlZmVyZW5jZWREZWNsYXJhdGlvbi5nZXRJbml0aWFsaXplcklmS2luZE9yVGhyb3coXG4gICAgICAgICAgICAgICAgU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3Qgc3ByZWFkRWxlbWVudEFycmF5ID0gc3ByZWFkRWxlbWVudC5nZXRQYXJlbnRJZktpbmRPclRocm93KFxuICAgICAgICAgICAgICAgIFN5bnRheEtpbmQuQXJyYXlMaXRlcmFsRXhwcmVzc2lvblxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGluc2VydEluZGV4ID0gc3ByZWFkRWxlbWVudEFycmF5LmdldEVsZW1lbnRzKCkuaW5kZXhPZihzcHJlYWRFbGVtZW50KTtcbiAgICAgICAgICAgIHNwcmVhZEVsZW1lbnRBcnJheS5yZW1vdmVFbGVtZW50KHNwcmVhZEVsZW1lbnQpO1xuICAgICAgICAgICAgc3ByZWFkRWxlbWVudEFycmF5Lmluc2VydEVsZW1lbnRzKFxuICAgICAgICAgICAgICAgIGluc2VydEluZGV4LFxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZWRBcnJheS5nZXRFbGVtZW50cygpLm1hcChlID0+IGUuZ2V0VGV4dCgpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhbkZpbGVEeW5hbWljcyhzb3VyY2VGaWxlOiBTb3VyY2VGaWxlKTogU291cmNlRmlsZSB7XG4gICAgICAgIGxldCBmaWxlID0gc291cmNlRmlsZTtcbiAgICAgICAgY29uc3QgcHJvcGVydHlBY2Nlc3NFeHByZXNzaW9ucyA9IGZpbGVcbiAgICAgICAgICAgIC5nZXREZXNjZW5kYW50c09mS2luZChTeW50YXhLaW5kLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbilcbiAgICAgICAgICAgIC5maWx0ZXIocCA9PiAhVHlwZUd1YXJkcy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihwLmdldFBhcmVudE9yVGhyb3coKSkpO1xuXG4gICAgICAgIGxldCBwcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb25zSW5Sb3V0ZXNWYXJpYWJsZVN0YXRlbWVudCA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgcHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uIG9mIHByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbnMpIHtcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGVpciBwYXJlbnRzIG5vZGVzLCBhbmQgaWYgb25lIGlzIGEgdmFyaWFibGVTdGF0ZW1lbnQgYW5kID09PSAncm91dGVzJ1xuICAgICAgICAgICAgbGV0IGZvdW5kUGFyZW50VmFyaWFibGVTdGF0ZW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICAgIGxldCBwYXJlbnQgPSBwcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24uZ2V0UGFyZW50V2hpbGUobiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG4uZ2V0S2luZCgpID09PSBTeW50YXhLaW5kLlZhcmlhYmxlU3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzVmFyaWFibGVSb3V0ZXMobi5jb21waWxlck5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZFBhcmVudFZhcmlhYmxlU3RhdGVtZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGZvdW5kUGFyZW50VmFyaWFibGVTdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb25zSW5Sb3V0ZXNWYXJpYWJsZVN0YXRlbWVudC5wdXNoKHByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbmxpbmUgdGhlIHByb3BlcnR5IGFjY2VzcyBleHByZXNzaW9uc1xuICAgICAgICBmb3IgKGNvbnN0IHByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbiBvZiBwcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb25zSW5Sb3V0ZXNWYXJpYWJsZVN0YXRlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlZERlY2xhcmF0aW9uID0gcHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgLmdldE5hbWVOb2RlKClcbiAgICAgICAgICAgICAgICAuZ2V0U3ltYm9sT3JUaHJvdygpXG4gICAgICAgICAgICAgICAgLmdldFZhbHVlRGVjbGFyYXRpb25PclRocm93KCk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgIVR5cGVHdWFyZHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocmVmZXJlbmNlZERlY2xhcmF0aW9uKSAmJlxuICAgICAgICAgICAgICAgIFR5cGVHdWFyZHMuaXNFbnVtTWVtYmVyKHJlZmVyZW5jZWREZWNsYXJhdGlvbikgJiZcbiAgICAgICAgICAgICAgICAoVHlwZUd1YXJkcy5pc1Byb3BlcnR5QXNzaWdubWVudChyZWZlcmVuY2VkRGVjbGFyYXRpb24pICYmXG4gICAgICAgICAgICAgICAgICAgICFUeXBlR3VhcmRzLmlzRW51bU1lbWJlcihyZWZlcmVuY2VkRGVjbGFyYXRpb24pKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICBgTm90IGltcGxlbWVudGVkIHJlZmVyZW5jZWQgZGVjbGFyYXRpb24ga2luZDogJHtyZWZlcmVuY2VkRGVjbGFyYXRpb24uZ2V0S2luZE5hbWUoKX1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVmZXJlbmNlZERlY2xhcmF0aW9uLmdldEluaXRpYWxpemVyT3JUaHJvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24ucmVwbGFjZVdpdGhUZXh0KFxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2VkRGVjbGFyYXRpb24uZ2V0SW5pdGlhbGl6ZXJPclRocm93KCkuZ2V0VGV4dCgpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlcGxhY2UgY2FsbGV4cHJlc3Npb25zIHdpdGggc3RyaW5nIDogdXRpbHMuZG9Xb3JrKCkgLT4gJ3V0aWxzLmRvV29yaygpJyBkb1dvcmsoKSAtPiAnZG9Xb3JrKCknXG4gICAgICogQHBhcmFtIHNvdXJjZUZpbGUgdHMuU291cmNlRmlsZVxuICAgICAqL1xuICAgIHB1YmxpYyBjbGVhbkNhbGxFeHByZXNzaW9ucyhzb3VyY2VGaWxlOiBTb3VyY2VGaWxlKTogU291cmNlRmlsZSB7XG4gICAgICAgIGxldCBmaWxlID0gc291cmNlRmlsZTtcblxuICAgICAgICBjb25zdCB2YXJpYWJsZVN0YXRlbWVudHMgPSBzb3VyY2VGaWxlLmdldFZhcmlhYmxlRGVjbGFyYXRpb24odiA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHYuY29tcGlsZXJOb2RlLnR5cGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdi5jb21waWxlck5vZGUudHlwZS50eXBlTmFtZS50ZXh0ID09PSAnUm91dGVzJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGluaXRpYWxpemVyID0gdmFyaWFibGVTdGF0ZW1lbnRzLmdldEluaXRpYWxpemVyKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBjYWxsRXhwciBvZiBpbml0aWFsaXplci5nZXREZXNjZW5kYW50c09mS2luZChTeW50YXhLaW5kLkNhbGxFeHByZXNzaW9uKSkge1xuICAgICAgICAgICAgaWYgKGNhbGxFeHByLndhc0ZvcmdvdHRlbigpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWxsRXhwci5yZXBsYWNlV2l0aFRleHQod3JpdGVyID0+IHdyaXRlci5xdW90ZShjYWxsRXhwci5nZXRUZXh0KCkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFuIHJvdXRlcyBkZWZpbml0aW9uIHdpdGggaW1wb3J0ZWQgZGF0YSwgZm9yIGV4YW1wbGUgcGF0aCwgY2hpbGRyZW4sIG9yIGR5bmFtaWMgc3R1ZmYgaW5zaWRlIGRhdGFcbiAgICAgKlxuICAgICAqIGNvbnN0IE1ZX1JPVVRFUzogUm91dGVzID0gW1xuICAgICAqICAgICB7XG4gICAgICogICAgICAgICBwYXRoOiAnaG9tZScsXG4gICAgICogICAgICAgICBjb21wb25lbnQ6IEhvbWVDb21wb25lbnRcbiAgICAgKiAgICAgfSxcbiAgICAgKiAgICAge1xuICAgICAqICAgICAgICAgcGF0aDogUEFUSFMuaG9tZSxcbiAgICAgKiAgICAgICAgIGNvbXBvbmVudDogSG9tZUNvbXBvbmVudFxuICAgICAqICAgICB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIFRoZSBpbml0aWFsaXplciBpcyBhbiBhcnJheSAoQXJyYXlMaXRlcmFsRXhwcmVzc2lvbiAtIDE3NyApLCBpdCBoYXMgZWxlbWVudHMsIG9iamVjdHMgKE9iamVjdExpdGVyYWxFeHByZXNzaW9uIC0gMTc4KVxuICAgICAqIHdpdGggcHJvcGVydGllcyAoUHJvcGVydHlBc3NpZ25tZW50IC0gMjYxKVxuICAgICAqXG4gICAgICogRm9yIGVhY2gga25vdyBwcm9wZXJ0eSAoaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9yb3V0ZXIvUm91dGVzI2Rlc2NyaXB0aW9uKSwgd2UgdHJ5IHRvIHNlZSBpZiB3ZSBoYXZlIHdoYXQgd2Ugd2FudFxuICAgICAqXG4gICAgICogRXg6IHBhdGggYW5kIHBhdGhNYXRjaCB3YW50IGEgc3RyaW5nLCBjb21wb25lbnQgYSBjb21wb25lbnQgcmVmZXJlbmNlLlxuICAgICAqXG4gICAgICogSXQgaXMgYW4gaW1wZXJhdGl2ZSBhcHByb2FjaCwgbm90IGEgZ2VuZXJpYyB3YXksIHBhcnNpbmcgYWxsIHRoZSB0cmVlXG4gICAgICogYW5kIGZpbmQgc29tZXRoaW5nIGxpa2UgdGhpcyB3aGljaCB3aWxsbCBicmVhayBKU09OLnN0cmluZ2lmeSA6IE1ZSU1QT1JULnBhdGhcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge3RzLk5vZGV9IGluaXRpYWxpemVyIFRoZSBub2RlIG9mIHJvdXRlcyBkZWZpbml0aW9uXG4gICAgICogQHJldHVybiB7dHMuTm9kZX0gICAgICAgICAgICAgVGhlIGVkaXRlZCBub2RlXG4gICAgICovXG4gICAgcHVibGljIGNsZWFuUm91dGVzRGVmaW5pdGlvbldpdGhJbXBvcnQoXG4gICAgICAgIGluaXRpYWxpemVyOiB0cy5BcnJheUxpdGVyYWxFeHByZXNzaW9uLFxuICAgICAgICBub2RlOiB0cy5Ob2RlLFxuICAgICAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlXG4gICAgKTogdHMuTm9kZSB7XG4gICAgICAgIGluaXRpYWxpemVyLmVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQ6IHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uKSA9PiB7XG4gICAgICAgICAgICBlbGVtZW50LnByb3BlcnRpZXMuZm9yRWFjaCgocHJvcGVydHk6IHRzLlByb3BlcnR5QXNzaWdubWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eS5uYW1lLmdldFRleHQoKSxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlJbml0aWFsaXplciA9IHByb3BlcnR5LmluaXRpYWxpemVyO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAocHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BhdGgnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdyZWRpcmVjdFRvJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnb3V0bGV0JzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncGF0aE1hdGNoJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eUluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5SW5pdGlhbGl6ZXIua2luZCAhPT0gU3ludGF4S2luZC5TdHJpbmdMaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElkZW50aWZpZXIoNzEpIHdvbid0IGJyZWFrIHBhcnNpbmcsIGJ1dCBpdCB3aWxsIGJlIGJldHRlciB0byByZXRyaXZlIHRoZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKDE3OSkgZXg6IE1ZSU1QT1JULnBhdGggd2lsbCBicmVhayBpdCwgZmluZCBpdCBpbiBpbXBvcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlJbml0aWFsaXplci5raW5kID09PSBTeW50YXhLaW5kLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsYXN0T2JqZWN0TGl0ZXJhbEF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eUluaXRpYWxpemVyLm5hbWUuZ2V0VGV4dCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0T2JqZWN0TGl0ZXJhbEF0dHJpYnV0ZU5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlJbml0aWFsaXplci5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RPYmplY3RMaXRlcmFsQXR0cmlidXRlTmFtZSA9IHByb3BlcnR5SW5pdGlhbGl6ZXIuZXhwcmVzc2lvbi5nZXRUZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IEltcG9ydHNVdGlsLmZpbmRQcm9wZXJ0eVZhbHVlSW5JbXBvcnRPckxvY2FsVmFyaWFibGVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdE9iamVjdExpdGVyYWxBdHRyaWJ1dGVOYW1lICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0T2JqZWN0TGl0ZXJhbEF0dHJpYnV0ZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlJbml0aWFsaXplci5raW5kID0gOTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlJbml0aWFsaXplci50ZXh0ID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGluaXRpYWxpemVyO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUm91dGVyUGFyc2VyVXRpbC5nZXRJbnN0YW5jZSgpO1xuIl19