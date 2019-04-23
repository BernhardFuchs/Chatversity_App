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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLXBhcnNlci51dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL3V0aWxzL3JvdXRlci1wYXJzZXIudXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUF5QztBQUN6Qyw2QkFBK0I7QUFDL0IsMEJBQTRCO0FBQzVCLDJCQUE2QjtBQUM3QiwrQ0FBNEU7QUFFNUUsMERBQW9EO0FBR3BELCtDQUF5QztBQUN6QyxtQ0FBa0M7QUFFbEMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRXJDLElBQU0sR0FBRyxHQUFHLElBQUksdUJBQUcsRUFBRSxDQUFDO0FBRXRCO0lBVUk7UUFUUSxXQUFNLEdBQVUsRUFBRSxDQUFDO1FBQ25CLHFCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUN0QixZQUFPLEdBQUcsRUFBRSxDQUFDO1FBSWIsc0JBQWlCLEdBQUcsRUFBRSxDQUFDO0lBR1IsQ0FBQztJQUNWLDRCQUFXLEdBQXpCO1FBQ0ksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtZQUM1QixnQkFBZ0IsQ0FBQyxRQUFRLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1NBQ3REO1FBQ0QsT0FBTyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7SUFDckMsQ0FBQztJQUVNLG1DQUFRLEdBQWYsVUFBZ0IsS0FBSztRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFF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QUFJLG1CQUFtQixDQUFDLFVBQVUsRUFBRTt3Q0FDaEMsK0JBQStCLEdBQUcsbUJBQW1CLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dDQUMzRSxJQUFJLE1BQU0sR0FBRyxzQkFBVyxDQUFDLHlDQUF5QyxDQUM5RCwrQkFBK0I7NENBQzNCLEdBQUc7NENBQ0gsOEJBQThCLEVBQ2xDLFVBQVUsQ0FDYixDQUFDLENBQUMsc0JBQXNCO3dDQUN6QixJQUFJLE1BQU0sS0FBSyxFQUFFLEVBQUU7NENBQ2YsbUJBQW1CLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQzs0Q0FDN0IsbUJBQW1CLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQzt5Q0FDckM7cUNBQ0o7aUNBQ0o7NkJBQ0o7eUJBQ0o7d0JBQ0QsTUFBTTtpQkFDYjtZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBQ0wsdUJBQUM7QUFBRCxDQUFDLEFBbnZCRCxJQW12QkM7QUFudkJZLDRDQUFnQjtBQXF2QjdCLGtCQUFlLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgSGFuZGxlYmFycyBmcm9tICdoYW5kbGViYXJzJztcbmltcG9ydCAqIGFzIEpTT041IGZyb20gJ2pzb241JztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgQXN0LCB7IHRzLCBTb3VyY2VGaWxlLCBTeW50YXhLaW5kLCBUeXBlR3VhcmRzIH0gZnJvbSAndHMtc2ltcGxlLWFzdCc7XG5cbmltcG9ydCBGaWxlRW5naW5lIGZyb20gJy4uL2FwcC9lbmdpbmVzL2ZpbGUuZW5naW5lJztcbmltcG9ydCB7IFJvdXRpbmdHcmFwaE5vZGUgfSBmcm9tICcuLi9hcHAvbm9kZXMvcm91dGluZy1ncmFwaC1ub2RlJztcblxuaW1wb3J0IEltcG9ydHNVdGlsIGZyb20gJy4vaW1wb3J0cy51dGlsJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4vbG9nZ2VyJztcblxuY29uc3QgdHJhdmVyc2UgPSByZXF1aXJlKCd0cmF2ZXJzZScpO1xuXG5jb25zdCBhc3QgPSBuZXcgQXN0KCk7XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXJQYXJzZXJVdGlsIHtcbiAgICBwcml2YXRlIHJvdXRlczogYW55W10gPSBbXTtcbiAgICBwcml2YXRlIGluY29tcGxldGVSb3V0ZXMgPSBbXTtcbiAgICBwcml2YXRlIG1vZHVsZXMgPSBbXTtcbiAgICBwcml2YXRlIG1vZHVsZXNUcmVlO1xuICAgIHByaXZhdGUgcm9vdE1vZHVsZTogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xlYW5Nb2R1bGVzVHJlZTtcbiAgICBwcml2YXRlIG1vZHVsZXNXaXRoUm91dGVzID0gW107XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogUm91dGVyUGFyc2VyVXRpbDtcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgICAgICBpZiAoIVJvdXRlclBhcnNlclV0aWwuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIFJvdXRlclBhcnNlclV0aWwuaW5zdGFuY2UgPSBuZXcgUm91dGVyUGFyc2VyVXRpbCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBSb3V0ZXJQYXJzZXJVdGlsLmluc3RhbmNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRSb3V0ZShyb3V0ZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnJvdXRlcy5wdXNoKHJvdXRlKTtcbiAgICAgICAgdGhpcy5yb3V0ZXMgPSBfLnNvcnRCeShfLnVuaXFXaXRoKHRoaXMucm91dGVzLCBfLmlzRXF1YWwpLCBbJ25hbWUnXSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZEluY29tcGxldGVSb3V0ZShyb3V0ZSk6IHZvaWQge1xuICAgICAgICB0aGlzLmluY29tcGxldGVSb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgICAgIHRoaXMuaW5jb21wbGV0ZVJvdXRlcyA9IF8uc29ydEJ5KF8udW5pcVdpdGgodGhpcy5pbmNvbXBsZXRlUm91dGVzLCBfLmlzRXF1YWwpLCBbJ25hbWUnXSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZE1vZHVsZVdpdGhSb3V0ZXMobW9kdWxlTmFtZSwgbW9kdWxlSW1wb3J0cywgZmlsZW5hbWUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tb2R1bGVzV2l0aFJvdXRlcy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IG1vZHVsZU5hbWUsXG4gICAgICAgICAgICBpbXBvcnRzTm9kZTogbW9kdWxlSW1wb3J0cyxcbiAgICAgICAgICAgIGZpbGVuYW1lOiBmaWxlbmFtZVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tb2R1bGVzV2l0aFJvdXRlcyA9IF8uc29ydEJ5KF8udW5pcVdpdGgodGhpcy5tb2R1bGVzV2l0aFJvdXRlcywgXy5pc0VxdWFsKSwgWyduYW1lJ10pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRNb2R1bGUobW9kdWxlTmFtZTogc3RyaW5nLCBtb2R1bGVJbXBvcnRzKTogdm9pZCB7XG4gICAgICAgIHRoaXMubW9kdWxlcy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IG1vZHVsZU5hbWUsXG4gICAgICAgICAgICBpbXBvcnRzTm9kZTogbW9kdWxlSW1wb3J0c1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tb2R1bGVzID0gXy5zb3J0QnkoXy51bmlxV2l0aCh0aGlzLm1vZHVsZXMsIF8uaXNFcXVhbCksIFsnbmFtZSddKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYW5SYXdSb3V0ZVBhcnNlZChyb3V0ZTogc3RyaW5nKTogb2JqZWN0IHtcbiAgICAgICAgbGV0IHJvdXRlc1dpdGhvdXRTcGFjZXMgPSByb3V0ZS5yZXBsYWNlKC8gL2dtLCAnJyk7XG4gICAgICAgIGxldCB0ZXN0VHJhaWxpbmdDb21tYSA9IHJvdXRlc1dpdGhvdXRTcGFjZXMuaW5kZXhPZignfSxdJyk7XG4gICAgICAgIGlmICh0ZXN0VHJhaWxpbmdDb21tYSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJvdXRlc1dpdGhvdXRTcGFjZXMgPSByb3V0ZXNXaXRob3V0U3BhY2VzLnJlcGxhY2UoJ30sXScsICd9XScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBKU09ONS5wYXJzZShyb3V0ZXNXaXRob3V0U3BhY2VzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYW5SYXdSb3V0ZShyb3V0ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHJvdXRlc1dpdGhvdXRTcGFjZXMgPSByb3V0ZS5yZXBsYWNlKC8gL2dtLCAnJyk7XG4gICAgICAgIGxldCB0ZXN0VHJhaWxpbmdDb21tYSA9IHJvdXRlc1dpdGhvdXRTcGFjZXMuaW5kZXhPZignfSxdJyk7XG4gICAgICAgIGlmICh0ZXN0VHJhaWxpbmdDb21tYSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJvdXRlc1dpdGhvdXRTcGFjZXMgPSByb3V0ZXNXaXRob3V0U3BhY2VzLnJlcGxhY2UoJ30sXScsICd9XScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3V0ZXNXaXRob3V0U3BhY2VzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRSb290TW9kdWxlKG1vZHVsZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMucm9vdE1vZHVsZSA9IG1vZHVsZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaGFzUm91dGVyTW9kdWxlSW5JbXBvcnRzKGltcG9ydHM6IEFycmF5PGFueT4pOiBib29sZWFuIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbXBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgaW1wb3J0c1tpXS5uYW1lLmluZGV4T2YoJ1JvdXRlck1vZHVsZS5mb3JDaGlsZCcpICE9PSAtMSB8fFxuICAgICAgICAgICAgICAgIGltcG9ydHNbaV0ubmFtZS5pbmRleE9mKCdSb3V0ZXJNb2R1bGUuZm9yUm9vdCcpICE9PSAtMSB8fFxuICAgICAgICAgICAgICAgIGltcG9ydHNbaV0ubmFtZS5pbmRleE9mKCdSb3V0ZXJNb2R1bGUnKSAhPT0gLTFcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBmaXhJbmNvbXBsZXRlUm91dGVzKG1pc2NlbGxhbmVvdXNWYXJpYWJsZXM6IEFycmF5PGFueT4pOiB2b2lkIHtcbiAgICAgICAgbGV0IG1hdGNoaW5nVmFyaWFibGVzID0gW107XG4gICAgICAgIC8vIEZvciBlYWNoIGluY29tcGxldGVSb3V0ZSwgc2NhbiBpZiBvbmUgbWlzYyB2YXJpYWJsZSBpcyBpbiBjb2RlXG4gICAgICAgIC8vIGlmIG9rLCB0cnkgcmVjcmVhdGluZyBjb21wbGV0ZSByb3V0ZVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW5jb21wbGV0ZVJvdXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtaXNjZWxsYW5lb3VzVmFyaWFibGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5jb21wbGV0ZVJvdXRlc1tpXS5kYXRhLmluZGV4T2YobWlzY2VsbGFuZW91c1ZhcmlhYmxlc1tqXS5uYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZvdW5kIG9uZSBtaXNjIHZhciBpbnNpZGUgaW5jb21wbGV0ZVJvdXRlJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1pc2NlbGxhbmVvdXNWYXJpYWJsZXNbal0ubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoaW5nVmFyaWFibGVzLnB1c2gobWlzY2VsbGFuZW91c1ZhcmlhYmxlc1tqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQ2xlYW4gaW5jb21wbGV0ZVJvdXRlXG4gICAgICAgICAgICB0aGlzLmluY29tcGxldGVSb3V0ZXNbaV0uZGF0YSA9IHRoaXMuaW5jb21wbGV0ZVJvdXRlc1tpXS5kYXRhLnJlcGxhY2UoJ1snLCAnJyk7XG4gICAgICAgICAgICB0aGlzLmluY29tcGxldGVSb3V0ZXNbaV0uZGF0YSA9IHRoaXMuaW5jb21wbGV0ZVJvdXRlc1tpXS5kYXRhLnJlcGxhY2UoJ10nLCAnJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbGlua01vZHVsZXNBbmRSb3V0ZXMoKTogdm9pZCB7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IGxlbiA9IHRoaXMubW9kdWxlc1dpdGhSb3V0ZXMubGVuZ3RoO1xuICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgXy5mb3JFYWNoKHRoaXMubW9kdWxlc1dpdGhSb3V0ZXNbaV0uaW1wb3J0c05vZGUsIChub2RlOiB0cy5Qcm9wZXJ0eURlY2xhcmF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGluaXRpYWxpemVyID0gbm9kZS5pbml0aWFsaXplciBhcyB0cy5BcnJheUxpdGVyYWxFeHByZXNzaW9uO1xuICAgICAgICAgICAgICAgIGlmIChpbml0aWFsaXplcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbGl6ZXIuZWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZm9yRWFjaChpbml0aWFsaXplci5lbGVtZW50cywgKGVsZW1lbnQ6IHRzLkNhbGxFeHByZXNzaW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmluZCBlbGVtZW50IHdpdGggYXJndW1lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuYXJndW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZm9yRWFjaChlbGVtZW50LmFyZ3VtZW50cywgKGFyZ3VtZW50OiB0cy5JZGVudGlmaWVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmZvckVhY2godGhpcy5yb3V0ZXMsIHJvdXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50LnRleHQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUubmFtZSA9PT0gYXJndW1lbnQudGV4dCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZS5maWxlbmFtZSA9PT0gdGhpcy5tb2R1bGVzV2l0aFJvdXRlc1tpXS5maWxlbmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZS5tb2R1bGUgPSB0aGlzLm1vZHVsZXNXaXRoUm91dGVzW2ldLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnQudGV4dCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZS5uYW1lID09PSBhcmd1bWVudC50ZXh0ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlLmZpbGVuYW1lICE9PSB0aGlzLm1vZHVsZXNXaXRoUm91dGVzW2ldLmZpbGVuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhcmd1bWVudEltcG9ydFBhdGggPSBJbXBvcnRzVXRpbC5maW5kRmlsZVBhdGhPZkltcG9ydGVkVmFyaWFibGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudC50ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2R1bGVzV2l0aFJvdXRlc1tpXS5maWxlbmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2xlYW5lciA9IChwcm9jZXNzLmN3ZCgpICsgcGF0aC5zZXApLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvXFxcXC9nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJy8nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50SW1wb3J0UGF0aCA9IGFyZ3VtZW50SW1wb3J0UGF0aC5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYW5lcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50LnRleHQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlLm5hbWUgPT09IGFyZ3VtZW50LnRleHQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlLmZpbGVuYW1lID09PSBhcmd1bWVudEltcG9ydFBhdGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZS5tb2R1bGUgPSB0aGlzLm1vZHVsZXNXaXRoUm91dGVzW2ldLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogZGlyZWN0IHN1cHBvcnQgb2YgZm9yIGV4YW1wbGVcbiAgICAgICAgICAgICAgICAgKiBleHBvcnQgY29uc3QgSG9tZVJvdXRpbmdNb2R1bGU6IE1vZHVsZVdpdGhQcm92aWRlcnMgPSBSb3V0ZXJNb2R1bGUuZm9yQ2hpbGQoSE9NRV9ST1VURVMpO1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICh0cy5pc0NhbGxFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmFyZ3VtZW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKG5vZGUuYXJndW1lbnRzLCAoYXJndW1lbnQ6IHRzLklkZW50aWZpZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmZvckVhY2godGhpcy5yb3V0ZXMsIHJvdXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnQudGV4dCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUubmFtZSA9PT0gYXJndW1lbnQudGV4dCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUuZmlsZW5hbWUgPT09IHRoaXMubW9kdWxlc1dpdGhSb3V0ZXNbaV0uZmlsZW5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZS5tb2R1bGUgPSB0aGlzLm1vZHVsZXNXaXRoUm91dGVzW2ldLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZm91bmRSb3V0ZVdpdGhNb2R1bGVOYW1lKG1vZHVsZU5hbWU6IHN0cmluZyk6IGFueSB7XG4gICAgICAgIHJldHVybiBfLmZpbmQodGhpcy5yb3V0ZXMsIHsgbW9kdWxlOiBtb2R1bGVOYW1lIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBmb3VuZExhenlNb2R1bGVXaXRoUGF0aChtb2R1bGVQYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICAvLyBwYXRoIGlzIGxpa2UgYXBwL2N1c3RvbWVycy9jdXN0b21lcnMubW9kdWxlI0N1c3RvbWVyc01vZHVsZVxuICAgICAgICBsZXQgc3BsaXQgPSBtb2R1bGVQYXRoLnNwbGl0KCcjJyk7XG4gICAgICAgIGxldCBsYXp5TW9kdWxlUGF0aCA9IHNwbGl0WzBdO1xuICAgICAgICBsZXQgbGF6eU1vZHVsZU5hbWUgPSBzcGxpdFsxXTtcbiAgICAgICAgcmV0dXJuIGxhenlNb2R1bGVOYW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RSb3V0ZXNUcmVlKCkge1xuICAgICAgICAvLyByb3V0ZXNbXSBjb250YWlucyByb3V0ZXMgd2l0aCBtb2R1bGUgbGlua1xuICAgICAgICAvLyBtb2R1bGVzVHJlZSBjb250YWlucyBtb2R1bGVzIHRyZWVcbiAgICAgICAgLy8gbWFrZSBhIGZpbmFsIHJvdXRlcyB0cmVlIHdpdGggdGhhdFxuICAgICAgICB0cmF2ZXJzZSh0aGlzLm1vZHVsZXNUcmVlKS5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlLnBhcmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5vZGUuaW5pdGlhbGl6ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub2RlLmltcG9ydHNOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlLmltcG9ydHNOb2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jbGVhbk1vZHVsZXNUcmVlID0gXy5jbG9uZURlZXAodGhpcy5tb2R1bGVzVHJlZSk7XG5cbiAgICAgICAgbGV0IHJvdXRlc1RyZWUgPSB7XG4gICAgICAgICAgICBuYW1lOiAnPHJvb3Q+JyxcbiAgICAgICAgICAgIGtpbmQ6ICdtb2R1bGUnLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiB0aGlzLnJvb3RNb2R1bGUsXG4gICAgICAgICAgICBjaGlsZHJlbjogW11cbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgbG9vcE1vZHVsZXNQYXJzZXIgPSBub2RlID0+IHtcbiAgICAgICAgICAgIGlmIChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIC8vIElmIG1vZHVsZSBoYXMgY2hpbGQgbW9kdWxlc1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgaW4gbm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm91dGUgPSB0aGlzLmZvdW5kUm91dGVXaXRoTW9kdWxlTmFtZShub2RlLmNoaWxkcmVuW2ldLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocm91dGUgJiYgcm91dGUuZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZS5jaGlsZHJlbiA9IEpTT041LnBhcnNlKHJvdXRlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0Vycm9yIGR1cmluZyBnZW5lcmF0aW9uIG9mIHJvdXRlcyBKU09OIGZpbGUsIG1heWJlIGEgdHJhaWxpbmcgY29tbWEgb3IgYW4gZXh0ZXJuYWwgdmFyaWFibGUgaW5zaWRlIG9uZSByb3V0ZS4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByb3V0ZS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUua2luZCA9ICdtb2R1bGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzVHJlZS5jaGlsZHJlbi5wdXNoKHJvdXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5jaGlsZHJlbltpXS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9vcE1vZHVsZXNQYXJzZXIobm9kZS5jaGlsZHJlbltpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGVsc2Ugcm91dGVzIGFyZSBkaXJlY3RseSBpbnNpZGUgdGhlIG1vZHVsZVxuICAgICAgICAgICAgICAgIGxldCByYXdSb3V0ZXMgPSB0aGlzLmZvdW5kUm91dGVXaXRoTW9kdWxlTmFtZShub2RlLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJhd1JvdXRlcykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm91dGVzID0gSlNPTjUucGFyc2UocmF3Um91dGVzLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocm91dGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGVuID0gcm91dGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByb3V0ZUFkZGVkT25jZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcm91dGUgPSByb3V0ZXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvdXRlc1tpXS5jb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVBZGRlZE9uY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXNUcmVlLmNoaWxkcmVuLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2luZDogJ2NvbXBvbmVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6IHJvdXRlc1tpXS5jb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiByb3V0ZXNbaV0ucGF0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJvdXRlQWRkZWRPbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVzVHJlZS5jaGlsZHJlbiA9IFsuLi5yb3V0ZXNUcmVlLmNoaWxkcmVuLCAuLi5yb3V0ZXNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBzdGFydE1vZHVsZSA9IF8uZmluZCh0aGlzLmNsZWFuTW9kdWxlc1RyZWUsIHsgbmFtZTogdGhpcy5yb290TW9kdWxlIH0pO1xuXG4gICAgICAgIGlmIChzdGFydE1vZHVsZSkge1xuICAgICAgICAgICAgbG9vcE1vZHVsZXNQYXJzZXIoc3RhcnRNb2R1bGUpO1xuICAgICAgICAgICAgLy8gTG9vcCB0d2ljZSBmb3Igcm91dGVzIHdpdGggbGF6eSBsb2FkaW5nXG4gICAgICAgICAgICAvLyBsb29wTW9kdWxlc1BhcnNlcihyb3V0ZXNUcmVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjbGVhbmVkUm91dGVzVHJlZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICBsZXQgY2xlYW5Sb3V0ZXNUcmVlID0gcm91dGUgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiByb3V0ZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGxldCByb3V0ZXMgPSByb3V0ZS5jaGlsZHJlbltpXS5yb3V0ZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcm91dGU7XG4gICAgICAgIH07XG5cbiAgICAgICAgY2xlYW5lZFJvdXRlc1RyZWUgPSBjbGVhblJvdXRlc1RyZWUocm91dGVzVHJlZSk7XG5cbiAgICAgICAgLy8gVHJ5IHVwZGF0aW5nIHJvdXRlcyB3aXRoIGxhenkgbG9hZGluZ1xuXG4gICAgICAgIGxldCBsb29wSW5zaWRlTW9kdWxlID0gKG1vZCwgX3Jhd01vZHVsZSkgPT4ge1xuICAgICAgICAgICAgaWYgKG1vZC5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHogaW4gbW9kLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByb3V0ZSA9IHRoaXMuZm91bmRSb3V0ZVdpdGhNb2R1bGVOYW1lKG1vZC5jaGlsZHJlblt6XS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByb3V0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3V0ZS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUuY2hpbGRyZW4gPSBKU09ONS5wYXJzZShyb3V0ZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgcm91dGUuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZS5raW5kID0gJ21vZHVsZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Jhd01vZHVsZS5jaGlsZHJlbi5wdXNoKHJvdXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHJvdXRlID0gdGhpcy5mb3VuZFJvdXRlV2l0aE1vZHVsZU5hbWUobW9kLm5hbWUpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygcm91dGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3V0ZS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3V0ZS5jaGlsZHJlbiA9IEpTT041LnBhcnNlKHJvdXRlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJvdXRlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3V0ZS5raW5kID0gJ21vZHVsZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmF3TW9kdWxlLmNoaWxkcmVuLnB1c2gocm91dGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBsb29wUm91dGVzUGFyc2VyID0gcm91dGUgPT4ge1xuICAgICAgICAgICAgaWYgKHJvdXRlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSBpbiByb3V0ZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm91dGUuY2hpbGRyZW5baV0ubG9hZENoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmZvdW5kTGF6eU1vZHVsZVdpdGhQYXRoKHJvdXRlLmNoaWxkcmVuW2ldLmxvYWRDaGlsZHJlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbW9kdWxlOiBSb3V0aW5nR3JhcGhOb2RlID0gXy5maW5kKHRoaXMuY2xlYW5Nb2R1bGVzVHJlZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNoaWxkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2R1bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgX3Jhd01vZHVsZTogUm91dGluZ0dyYXBoTm9kZSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yYXdNb2R1bGUua2luZCA9ICdtb2R1bGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yYXdNb2R1bGUuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmF3TW9kdWxlLm1vZHVsZSA9IG1vZHVsZS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvb3BJbnNpZGVNb2R1bGUobW9kdWxlLCBfcmF3TW9kdWxlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlLmNoaWxkcmVuW2ldLmNoaWxkcmVuID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGUuY2hpbGRyZW5baV0uY2hpbGRyZW4ucHVzaChfcmF3TW9kdWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsb29wUm91dGVzUGFyc2VyKHJvdXRlLmNoaWxkcmVuW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGxvb3BSb3V0ZXNQYXJzZXIoY2xlYW5lZFJvdXRlc1RyZWUpO1xuXG4gICAgICAgIHJldHVybiBjbGVhbmVkUm91dGVzVHJlZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29uc3RydWN0TW9kdWxlc1RyZWUoKTogdm9pZCB7XG4gICAgICAgIGxldCBnZXROZXN0ZWRDaGlsZHJlbiA9IChhcnIsIHBhcmVudD8pID0+IHtcbiAgICAgICAgICAgIGxldCBvdXQgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFycltpXS5wYXJlbnQgPT09IHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBnZXROZXN0ZWRDaGlsZHJlbihhcnIsIGFycltpXS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJyW2ldLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3V0LnB1c2goYXJyW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFNjYW4gZWFjaCBtb2R1bGUgYW5kIGFkZCBwYXJlbnQgcHJvcGVydHlcbiAgICAgICAgXy5mb3JFYWNoKHRoaXMubW9kdWxlcywgZmlyc3RMb29wTW9kdWxlID0+IHtcbiAgICAgICAgICAgIF8uZm9yRWFjaChmaXJzdExvb3BNb2R1bGUuaW1wb3J0c05vZGUsIGltcG9ydE5vZGUgPT4ge1xuICAgICAgICAgICAgICAgIF8uZm9yRWFjaCh0aGlzLm1vZHVsZXMsIG1vZHVsZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2R1bGUubmFtZSA9PT0gaW1wb3J0Tm9kZS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGUucGFyZW50ID0gZmlyc3RMb29wTW9kdWxlLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tb2R1bGVzVHJlZSA9IGdldE5lc3RlZENoaWxkcmVuKHRoaXMubW9kdWxlcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdlbmVyYXRlUm91dGVzSW5kZXgob3V0cHV0Rm9sZGVyOiBzdHJpbmcsIHJvdXRlczogQXJyYXk8YW55Pik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gRmlsZUVuZ2luZS5nZXQoX19kaXJuYW1lICsgJy8uLi9zcmMvdGVtcGxhdGVzL3BhcnRpYWxzL3JvdXRlcy1pbmRleC5oYnMnKS50aGVuKFxuICAgICAgICAgICAgZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlOiBhbnkgPSBIYW5kbGViYXJzLmNvbXBpbGUoZGF0YSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHRlbXBsYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgcm91dGVzOiBKU09OLnN0cmluZ2lmeShyb3V0ZXMpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGV0IHRlc3RPdXRwdXREaXIgPSBvdXRwdXRGb2xkZXIubWF0Y2gocHJvY2Vzcy5jd2QoKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGVzdE91dHB1dERpciAmJiB0ZXN0T3V0cHV0RGlyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0Rm9sZGVyID0gb3V0cHV0Rm9sZGVyLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSArIHBhdGguc2VwLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIEZpbGVFbmdpbmUud3JpdGUoXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dEZvbGRlciArIHBhdGguc2VwICsgJy9qcy9yb3V0ZXMvcm91dGVzX2luZGV4LmpzJyxcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnIgPT4gUHJvbWlzZS5yZWplY3QoJ0Vycm9yIGR1cmluZyByb3V0ZXMgaW5kZXggZ2VuZXJhdGlvbicpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIHJvdXRlc0xlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICBsZXQgX24gPSAwO1xuICAgICAgICBsZXQgcm91dGVzUGFyc2VyID0gcm91dGUgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByb3V0ZS5wYXRoICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIF9uICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocm91dGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqIGluIHJvdXRlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvdXRlc1BhcnNlcihyb3V0ZS5jaGlsZHJlbltqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAobGV0IGkgaW4gdGhpcy5yb3V0ZXMpIHtcbiAgICAgICAgICAgIHJvdXRlc1BhcnNlcih0aGlzLnJvdXRlc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX247XG4gICAgfVxuXG4gICAgcHVibGljIHByaW50Um91dGVzKCk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdwcmludFJvdXRlczogJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucm91dGVzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJpbnRNb2R1bGVzUm91dGVzKCk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdwcmludE1vZHVsZXNSb3V0ZXM6ICcpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm1vZHVsZXNXaXRoUm91dGVzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNWYXJpYWJsZVJvdXRlcyhub2RlKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgaWYgKG5vZGUuZGVjbGFyYXRpb25MaXN0ICYmIG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucykge1xuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgbGV0IGxlbiA9IG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbaV0udHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbaV0udHlwZS50eXBlTmFtZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zW2ldLnR5cGUudHlwZU5hbWUudGV4dCA9PT0gJ1JvdXRlcydcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFuRmlsZUlkZW50aWZpZXJzKHNvdXJjZUZpbGU6IFNvdXJjZUZpbGUpOiBTb3VyY2VGaWxlIHtcbiAgICAgICAgbGV0IGZpbGUgPSBzb3VyY2VGaWxlO1xuICAgICAgICBjb25zdCBpZGVudGlmaWVycyA9IGZpbGUuZ2V0RGVzY2VuZGFudHNPZktpbmQoU3ludGF4S2luZC5JZGVudGlmaWVyKS5maWx0ZXIocCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIFR5cGVHdWFyZHMuaXNBcnJheUxpdGVyYWxFeHByZXNzaW9uKHAuZ2V0UGFyZW50T3JUaHJvdygpKSB8fFxuICAgICAgICAgICAgICAgIFR5cGVHdWFyZHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQocC5nZXRQYXJlbnRPclRocm93KCkpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgaWRlbnRpZmllcnNJblJvdXRlc1ZhcmlhYmxlU3RhdGVtZW50ID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBpZGVudGlmaWVyIG9mIGlkZW50aWZpZXJzKSB7XG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlaXIgcGFyZW50cyBub2RlcywgYW5kIGlmIG9uZSBpcyBhIHZhcmlhYmxlU3RhdGVtZW50IGFuZCA9PT0gJ3JvdXRlcydcbiAgICAgICAgICAgIGxldCBmb3VuZFBhcmVudFZhcmlhYmxlU3RhdGVtZW50ID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgcGFyZW50ID0gaWRlbnRpZmllci5nZXRQYXJlbnRXaGlsZShuID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobi5nZXRLaW5kKCkgPT09IFN5bnRheEtpbmQuVmFyaWFibGVTdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNWYXJpYWJsZVJvdXRlcyhuLmNvbXBpbGVyTm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kUGFyZW50VmFyaWFibGVTdGF0ZW1lbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZm91bmRQYXJlbnRWYXJpYWJsZVN0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIGlkZW50aWZpZXJzSW5Sb3V0ZXNWYXJpYWJsZVN0YXRlbWVudC5wdXNoKGlkZW50aWZpZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW5saW5lIHRoZSBwcm9wZXJ0eSBhY2Nlc3MgZXhwcmVzc2lvbnNcbiAgICAgICAgZm9yIChjb25zdCBpZGVudGlmaWVyIG9mIGlkZW50aWZpZXJzSW5Sb3V0ZXNWYXJpYWJsZVN0YXRlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgaWRlbnRpZmllckRlY2xhcmF0aW9uID0gaWRlbnRpZmllclxuICAgICAgICAgICAgICAgIC5nZXRTeW1ib2xPclRocm93KClcbiAgICAgICAgICAgICAgICAuZ2V0VmFsdWVEZWNsYXJhdGlvbk9yVGhyb3coKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhVHlwZUd1YXJkcy5pc1Byb3BlcnR5QXNzaWdubWVudChpZGVudGlmaWVyRGVjbGFyYXRpb24pICYmXG4gICAgICAgICAgICAgICAgVHlwZUd1YXJkcy5pc1ZhcmlhYmxlRGVjbGFyYXRpb24oaWRlbnRpZmllckRlY2xhcmF0aW9uKSAmJlxuICAgICAgICAgICAgICAgIChUeXBlR3VhcmRzLmlzUHJvcGVydHlBc3NpZ25tZW50KGlkZW50aWZpZXJEZWNsYXJhdGlvbikgJiZcbiAgICAgICAgICAgICAgICAgICAgIVR5cGVHdWFyZHMuaXNWYXJpYWJsZURlY2xhcmF0aW9uKGlkZW50aWZpZXJEZWNsYXJhdGlvbikpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGBOb3QgaW1wbGVtZW50ZWQgcmVmZXJlbmNlZCBkZWNsYXJhdGlvbiBraW5kOiAke2lkZW50aWZpZXJEZWNsYXJhdGlvbi5nZXRLaW5kTmFtZSgpfWBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFR5cGVHdWFyZHMuaXNWYXJpYWJsZURlY2xhcmF0aW9uKGlkZW50aWZpZXJEZWNsYXJhdGlvbikpIHtcbiAgICAgICAgICAgICAgICBpZGVudGlmaWVyLnJlcGxhY2VXaXRoVGV4dChpZGVudGlmaWVyRGVjbGFyYXRpb24uZ2V0SW5pdGlhbGl6ZXJPclRocm93KCkuZ2V0VGV4dCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhbkZpbGVTcHJlYWRzKHNvdXJjZUZpbGU6IFNvdXJjZUZpbGUpOiBTb3VyY2VGaWxlIHtcbiAgICAgICAgbGV0IGZpbGUgPSBzb3VyY2VGaWxlO1xuICAgICAgICBjb25zdCBzcHJlYWRFbGVtZW50cyA9IGZpbGVcbiAgICAgICAgICAgIC5nZXREZXNjZW5kYW50c09mS2luZChTeW50YXhLaW5kLlNwcmVhZEVsZW1lbnQpXG4gICAgICAgICAgICAuZmlsdGVyKHAgPT4gVHlwZUd1YXJkcy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24ocC5nZXRQYXJlbnRPclRocm93KCkpKTtcblxuICAgICAgICBsZXQgc3ByZWFkRWxlbWVudHNJblJvdXRlc1ZhcmlhYmxlU3RhdGVtZW50ID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBzcHJlYWRFbGVtZW50IG9mIHNwcmVhZEVsZW1lbnRzKSB7XG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlaXIgcGFyZW50cyBub2RlcywgYW5kIGlmIG9uZSBpcyBhIHZhcmlhYmxlU3RhdGVtZW50IGFuZCA9PT0gJ3JvdXRlcydcbiAgICAgICAgICAgIGxldCBmb3VuZFBhcmVudFZhcmlhYmxlU3RhdGVtZW50ID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgcGFyZW50ID0gc3ByZWFkRWxlbWVudC5nZXRQYXJlbnRXaGlsZShuID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobi5nZXRLaW5kKCkgPT09IFN5bnRheEtpbmQuVmFyaWFibGVTdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNWYXJpYWJsZVJvdXRlcyhuLmNvbXBpbGVyTm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kUGFyZW50VmFyaWFibGVTdGF0ZW1lbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZm91bmRQYXJlbnRWYXJpYWJsZVN0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIHNwcmVhZEVsZW1lbnRzSW5Sb3V0ZXNWYXJpYWJsZVN0YXRlbWVudC5wdXNoKHNwcmVhZEVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW5saW5lIHRoZSBBcnJheUxpdGVyYWxFeHByZXNzaW9uIFNwcmVhZEVsZW1lbnRzXG4gICAgICAgIGZvciAoY29uc3Qgc3ByZWFkRWxlbWVudCBvZiBzcHJlYWRFbGVtZW50c0luUm91dGVzVmFyaWFibGVTdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgIGxldCBzcHJlYWRFbGVtZW50SWRlbnRpZmllciA9IHNwcmVhZEVsZW1lbnQuZ2V0RXhwcmVzc2lvbigpLmdldFRleHQoKSxcbiAgICAgICAgICAgICAgICBzZWFyY2hlZEltcG9ydCxcbiAgICAgICAgICAgICAgICBhbGlhc09yaWdpbmFsTmFtZSA9ICcnLFxuICAgICAgICAgICAgICAgIGZvdW5kV2l0aEFsaWFzSW5JbXBvcnRzID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgZm91bmRXaXRoQWxpYXMgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gVHJ5IHRvIGZpbmQgaXQgaW4gaW1wb3J0c1xuICAgICAgICAgICAgY29uc3QgaW1wb3J0cyA9IGZpbGUuZ2V0SW1wb3J0RGVjbGFyYXRpb25zKCk7XG5cbiAgICAgICAgICAgIGltcG9ydHMuZm9yRWFjaChpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZWRJbXBvcnRzID0gaS5nZXROYW1lZEltcG9ydHMoKSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZWRJbXBvcnRzTGVuZ3RoID0gbmFtZWRJbXBvcnRzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgaiA9IDA7XG5cbiAgICAgICAgICAgICAgICBpZiAobmFtZWRJbXBvcnRzTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGo7IGogPCBuYW1lZEltcG9ydHNMZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGltcG9ydE5hbWUgPSBuYW1lZEltcG9ydHNbal0uZ2V0TmFtZU5vZGUoKS5nZXRUZXh0KCkgYXMgc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydEFsaWFzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmFtZWRJbXBvcnRzW2pdLmdldEFsaWFzSWRlbnRpZmllcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0QWxpYXMgPSBuYW1lZEltcG9ydHNbal0uZ2V0QWxpYXNJZGVudGlmaWVyKCkuZ2V0VGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1wb3J0TmFtZSA9PT0gc3ByZWFkRWxlbWVudElkZW50aWZpZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZFdpdGhBbGlhc0luSW1wb3J0cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGltcG9ydEFsaWFzID09PSBzcHJlYWRFbGVtZW50SWRlbnRpZmllcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kV2l0aEFsaWFzSW5JbXBvcnRzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZFdpdGhBbGlhcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpYXNPcmlnaW5hbE5hbWUgPSBpbXBvcnROYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaGVkSW1wb3J0ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgcmVmZXJlbmNlZERlY2xhcmF0aW9uO1xuXG4gICAgICAgICAgICBpZiAoZm91bmRXaXRoQWxpYXNJbkltcG9ydHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNlYXJjaGVkSW1wb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW1wb3J0UGF0aCA9IHBhdGgucmVzb2x2ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGguZGlybmFtZShmaWxlLmdldEZpbGVQYXRoKCkpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaGVkSW1wb3J0LmdldE1vZHVsZVNwZWNpZmllclZhbHVlKCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcudHMnXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZUZpbGVJbXBvcnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGFzdC5nZXRTb3VyY2VGaWxlKGltcG9ydFBhdGgpICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYXN0LmdldFNvdXJjZUZpbGUoaW1wb3J0UGF0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGFzdC5hZGRFeGlzdGluZ1NvdXJjZUZpbGUoaW1wb3J0UGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2VGaWxlSW1wb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFyaWFibGVOYW1lID0gZm91bmRXaXRoQWxpYXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGFsaWFzT3JpZ2luYWxOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBzcHJlYWRFbGVtZW50SWRlbnRpZmllcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZWREZWNsYXJhdGlvbiA9IHNvdXJjZUZpbGVJbXBvcnQuZ2V0VmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZU5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGlmIG5vdCwgdHJ5IGRpcmVjdGx5IGluIGZpbGVcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VkRGVjbGFyYXRpb24gPSBzcHJlYWRFbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIC5nZXRFeHByZXNzaW9uKClcbiAgICAgICAgICAgICAgICAgICAgLmdldFN5bWJvbE9yVGhyb3coKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0VmFsdWVEZWNsYXJhdGlvbk9yVGhyb3coKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFUeXBlR3VhcmRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihyZWZlcmVuY2VkRGVjbGFyYXRpb24pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICBgTm90IGltcGxlbWVudGVkIHJlZmVyZW5jZWQgZGVjbGFyYXRpb24ga2luZDogJHtyZWZlcmVuY2VkRGVjbGFyYXRpb24uZ2V0S2luZE5hbWUoKX1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlZEFycmF5ID0gcmVmZXJlbmNlZERlY2xhcmF0aW9uLmdldEluaXRpYWxpemVySWZLaW5kT3JUaHJvdyhcbiAgICAgICAgICAgICAgICBTeW50YXhLaW5kLkFycmF5TGl0ZXJhbEV4cHJlc3Npb25cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBzcHJlYWRFbGVtZW50QXJyYXkgPSBzcHJlYWRFbGVtZW50LmdldFBhcmVudElmS2luZE9yVGhyb3coXG4gICAgICAgICAgICAgICAgU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgaW5zZXJ0SW5kZXggPSBzcHJlYWRFbGVtZW50QXJyYXkuZ2V0RWxlbWVudHMoKS5pbmRleE9mKHNwcmVhZEVsZW1lbnQpO1xuICAgICAgICAgICAgc3ByZWFkRWxlbWVudEFycmF5LnJlbW92ZUVsZW1lbnQoc3ByZWFkRWxlbWVudCk7XG4gICAgICAgICAgICBzcHJlYWRFbGVtZW50QXJyYXkuaW5zZXJ0RWxlbWVudHMoXG4gICAgICAgICAgICAgICAgaW5zZXJ0SW5kZXgsXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlZEFycmF5LmdldEVsZW1lbnRzKCkubWFwKGUgPT4gZS5nZXRUZXh0KCkpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFuRmlsZUR5bmFtaWNzKHNvdXJjZUZpbGU6IFNvdXJjZUZpbGUpOiBTb3VyY2VGaWxlIHtcbiAgICAgICAgbGV0IGZpbGUgPSBzb3VyY2VGaWxlO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb25zID0gZmlsZVxuICAgICAgICAgICAgLmdldERlc2NlbmRhbnRzT2ZLaW5kKFN5bnRheEtpbmQuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKVxuICAgICAgICAgICAgLmZpbHRlcihwID0+ICFUeXBlR3VhcmRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKHAuZ2V0UGFyZW50T3JUaHJvdygpKSk7XG5cbiAgICAgICAgbGV0IHByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbnNJblJvdXRlc1ZhcmlhYmxlU3RhdGVtZW50ID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBwcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24gb2YgcHJvcGVydHlBY2Nlc3NFeHByZXNzaW9ucykge1xuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZWlyIHBhcmVudHMgbm9kZXMsIGFuZCBpZiBvbmUgaXMgYSB2YXJpYWJsZVN0YXRlbWVudCBhbmQgPT09ICdyb3V0ZXMnXG4gICAgICAgICAgICBsZXQgZm91bmRQYXJlbnRWYXJpYWJsZVN0YXRlbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IHBhcmVudCA9IHByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbi5nZXRQYXJlbnRXaGlsZShuID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobi5nZXRLaW5kKCkgPT09IFN5bnRheEtpbmQuVmFyaWFibGVTdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNWYXJpYWJsZVJvdXRlcyhuLmNvbXBpbGVyTm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kUGFyZW50VmFyaWFibGVTdGF0ZW1lbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZm91bmRQYXJlbnRWYXJpYWJsZVN0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIHByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbnNJblJvdXRlc1ZhcmlhYmxlU3RhdGVtZW50LnB1c2gocHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlubGluZSB0aGUgcHJvcGVydHkgYWNjZXNzIGV4cHJlc3Npb25zXG4gICAgICAgIGZvciAoY29uc3QgcHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uIG9mIHByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbnNJblJvdXRlc1ZhcmlhYmxlU3RhdGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCByZWZlcmVuY2VkRGVjbGFyYXRpb24gPSBwcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAuZ2V0TmFtZU5vZGUoKVxuICAgICAgICAgICAgICAgIC5nZXRTeW1ib2xPclRocm93KClcbiAgICAgICAgICAgICAgICAuZ2V0VmFsdWVEZWNsYXJhdGlvbk9yVGhyb3coKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhVHlwZUd1YXJkcy5pc1Byb3BlcnR5QXNzaWdubWVudChyZWZlcmVuY2VkRGVjbGFyYXRpb24pICYmXG4gICAgICAgICAgICAgICAgVHlwZUd1YXJkcy5pc0VudW1NZW1iZXIocmVmZXJlbmNlZERlY2xhcmF0aW9uKSAmJlxuICAgICAgICAgICAgICAgIChUeXBlR3VhcmRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHJlZmVyZW5jZWREZWNsYXJhdGlvbikgJiZcbiAgICAgICAgICAgICAgICAgICAgIVR5cGVHdWFyZHMuaXNFbnVtTWVtYmVyKHJlZmVyZW5jZWREZWNsYXJhdGlvbikpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGBOb3QgaW1wbGVtZW50ZWQgcmVmZXJlbmNlZCBkZWNsYXJhdGlvbiBraW5kOiAke3JlZmVyZW5jZWREZWNsYXJhdGlvbi5nZXRLaW5kTmFtZSgpfWBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiByZWZlcmVuY2VkRGVjbGFyYXRpb24uZ2V0SW5pdGlhbGl6ZXJPclRocm93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbi5yZXBsYWNlV2l0aFRleHQoXG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZWREZWNsYXJhdGlvbi5nZXRJbml0aWFsaXplck9yVGhyb3coKS5nZXRUZXh0KClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVwbGFjZSBjYWxsZXhwcmVzc2lvbnMgd2l0aCBzdHJpbmcgOiB1dGlscy5kb1dvcmsoKSAtPiAndXRpbHMuZG9Xb3JrKCknIGRvV29yaygpIC0+ICdkb1dvcmsoKSdcbiAgICAgKiBAcGFyYW0gc291cmNlRmlsZSB0cy5Tb3VyY2VGaWxlXG4gICAgICovXG4gICAgcHVibGljIGNsZWFuQ2FsbEV4cHJlc3Npb25zKHNvdXJjZUZpbGU6IFNvdXJjZUZpbGUpOiBTb3VyY2VGaWxlIHtcbiAgICAgICAgbGV0IGZpbGUgPSBzb3VyY2VGaWxlO1xuXG4gICAgICAgIGNvbnN0IHZhcmlhYmxlU3RhdGVtZW50cyA9IHNvdXJjZUZpbGUuZ2V0VmFyaWFibGVEZWNsYXJhdGlvbih2ID0+IHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygdi5jb21waWxlck5vZGUudHlwZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB2LmNvbXBpbGVyTm9kZS50eXBlLnR5cGVOYW1lLnRleHQgPT09ICdSb3V0ZXMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgaW5pdGlhbGl6ZXIgPSB2YXJpYWJsZVN0YXRlbWVudHMuZ2V0SW5pdGlhbGl6ZXIoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNhbGxFeHByIG9mIGluaXRpYWxpemVyLmdldERlc2NlbmRhbnRzT2ZLaW5kKFN5bnRheEtpbmQuQ2FsbEV4cHJlc3Npb24pKSB7XG4gICAgICAgICAgICBpZiAoY2FsbEV4cHIud2FzRm9yZ290dGVuKCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhbGxFeHByLnJlcGxhY2VXaXRoVGV4dCh3cml0ZXIgPT4gd3JpdGVyLnF1b3RlKGNhbGxFeHByLmdldFRleHQoKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xlYW4gcm91dGVzIGRlZmluaXRpb24gd2l0aCBpbXBvcnRlZCBkYXRhLCBmb3IgZXhhbXBsZSBwYXRoLCBjaGlsZHJlbiwgb3IgZHluYW1pYyBzdHVmZiBpbnNpZGUgZGF0YVxuICAgICAqXG4gICAgICogY29uc3QgTVlfUk9VVEVTOiBSb3V0ZXMgPSBbXG4gICAgICogICAgIHtcbiAgICAgKiAgICAgICAgIHBhdGg6ICdob21lJyxcbiAgICAgKiAgICAgICAgIGNvbXBvbmVudDogSG9tZUNvbXBvbmVudFxuICAgICAqICAgICB9LFxuICAgICAqICAgICB7XG4gICAgICogICAgICAgICBwYXRoOiBQQVRIUy5ob21lLFxuICAgICAqICAgICAgICAgY29tcG9uZW50OiBIb21lQ29tcG9uZW50XG4gICAgICogICAgIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogVGhlIGluaXRpYWxpemVyIGlzIGFuIGFycmF5IChBcnJheUxpdGVyYWxFeHByZXNzaW9uIC0gMTc3ICksIGl0IGhhcyBlbGVtZW50cywgb2JqZWN0cyAoT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24gLSAxNzgpXG4gICAgICogd2l0aCBwcm9wZXJ0aWVzIChQcm9wZXJ0eUFzc2lnbm1lbnQgLSAyNjEpXG4gICAgICpcbiAgICAgKiBGb3IgZWFjaCBrbm93IHByb3BlcnR5IChodHRwczovL2FuZ3VsYXIuaW8vYXBpL3JvdXRlci9Sb3V0ZXMjZGVzY3JpcHRpb24pLCB3ZSB0cnkgdG8gc2VlIGlmIHdlIGhhdmUgd2hhdCB3ZSB3YW50XG4gICAgICpcbiAgICAgKiBFeDogcGF0aCBhbmQgcGF0aE1hdGNoIHdhbnQgYSBzdHJpbmcsIGNvbXBvbmVudCBhIGNvbXBvbmVudCByZWZlcmVuY2UuXG4gICAgICpcbiAgICAgKiBJdCBpcyBhbiBpbXBlcmF0aXZlIGFwcHJvYWNoLCBub3QgYSBnZW5lcmljIHdheSwgcGFyc2luZyBhbGwgdGhlIHRyZWVcbiAgICAgKiBhbmQgZmluZCBzb21ldGhpbmcgbGlrZSB0aGlzIHdoaWNoIHdpbGxsIGJyZWFrIEpTT04uc3RyaW5naWZ5IDogTVlJTVBPUlQucGF0aFxuICAgICAqXG4gICAgICogQHBhcmFtICB7dHMuTm9kZX0gaW5pdGlhbGl6ZXIgVGhlIG5vZGUgb2Ygcm91dGVzIGRlZmluaXRpb25cbiAgICAgKiBAcmV0dXJuIHt0cy5Ob2RlfSAgICAgICAgICAgICBUaGUgZWRpdGVkIG5vZGVcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xlYW5Sb3V0ZXNEZWZpbml0aW9uV2l0aEltcG9ydChcbiAgICAgICAgaW5pdGlhbGl6ZXI6IHRzLkFycmF5TGl0ZXJhbEV4cHJlc3Npb24sXG4gICAgICAgIG5vZGU6IHRzLk5vZGUsXG4gICAgICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGVcbiAgICApOiB0cy5Ob2RlIHtcbiAgICAgICAgaW5pdGlhbGl6ZXIuZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudDogdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnQucHJvcGVydGllcy5mb3JFYWNoKChwcm9wZXJ0eTogdHMuUHJvcGVydHlBc3NpZ25tZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5Lm5hbWUuZ2V0VGV4dCgpLFxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eUluaXRpYWxpemVyID0gcHJvcGVydHkuaW5pdGlhbGl6ZXI7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncGF0aCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3JlZGlyZWN0VG8nOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdvdXRsZXQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdwYXRoTWF0Y2gnOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5SW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlJbml0aWFsaXplci5raW5kICE9PSBTeW50YXhLaW5kLlN0cmluZ0xpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWRlbnRpZmllcig3MSkgd29uJ3QgYnJlYWsgcGFyc2luZywgYnV0IGl0IHdpbGwgYmUgYmV0dGVyIHRvIHJldHJpdmUgdGhlbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24oMTc5KSBleDogTVlJTVBPUlQucGF0aCB3aWxsIGJyZWFrIGl0LCBmaW5kIGl0IGluIGltcG9ydFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eUluaXRpYWxpemVyLmtpbmQgPT09IFN5bnRheEtpbmQuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RPYmplY3RMaXRlcmFsQXR0cmlidXRlTmFtZSA9IHByb3BlcnR5SW5pdGlhbGl6ZXIubmFtZS5nZXRUZXh0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RPYmplY3RMaXRlcmFsQXR0cmlidXRlTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eUluaXRpYWxpemVyLmV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdE9iamVjdExpdGVyYWxBdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlJbml0aWFsaXplci5leHByZXNzaW9uLmdldFRleHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gSW1wb3J0c1V0aWwuZmluZFByb3BlcnR5VmFsdWVJbkltcG9ydE9yTG9jYWxWYXJpYWJsZXMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0T2JqZWN0TGl0ZXJhbEF0dHJpYnV0ZU5hbWUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJy4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RPYmplY3RMaXRlcmFsQXR0cmlidXRlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7IC8vIHRzbGludDpkaXNhYmxlLWxpbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eUluaXRpYWxpemVyLmtpbmQgPSA5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eUluaXRpYWxpemVyLnRleHQgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZXI7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSb3V0ZXJQYXJzZXJVdGlsLmdldEluc3RhbmNlKCk7XG4iXX0=