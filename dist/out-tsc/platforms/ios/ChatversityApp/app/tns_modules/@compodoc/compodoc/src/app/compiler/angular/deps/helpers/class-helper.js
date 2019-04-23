"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var ts_simple_ast_1 = require("ts-simple-ast");
var utils_1 = require("../../../../../utils/utils");
var kind_to_type_1 = require("../../../../../utils/kind-to-type");
var jsdoc_parser_util_1 = require("../../../../../utils/jsdoc-parser.util");
var utils_2 = require("../../../../../utils");
var angular_version_util_1 = require("../../../../..//utils/angular-version.util");
var basic_type_util_1 = require("../../../../../utils/basic-type.util");
var object_literal_expression_util_1 = require("../../../../../utils/object-literal-expression.util");
var dependencies_engine_1 = require("../../../../engines/dependencies.engine");
var configuration_1 = require("../../../../configuration");
var crypto = require('crypto');
var marked = require('marked');
var ClassHelper = /** @class */ (function () {
    function ClassHelper(typeChecker) {
        this.typeChecker = typeChecker;
        this.jsdocParserUtil = new jsdoc_parser_util_1.JsdocParserUtil();
    }
    /**
     * HELPERS
     */
    ClassHelper.prototype.stringifyDefaultValue = function (node) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        if (node.getText()) {
            return node.getText();
        }
        else if (node.kind === ts_simple_ast_1.SyntaxKind.FalseKeyword) {
            return 'false';
        }
        else if (node.kind === ts_simple_ast_1.SyntaxKind.TrueKeyword) {
            return 'true';
        }
    };
    ClassHelper.prototype.getDecoratorOfType = function (node, decoratorType) {
        var decorators = node.decorators || [];
        for (var i = 0; i < decorators.length; i++) {
            if (decorators[i].expression.expression) {
                if (decorators[i].expression.expression.text === decoratorType) {
                    return decorators[i];
                }
            }
        }
        return undefined;
    };
    ClassHelper.prototype.formatDecorators = function (decorators) {
        var _this = this;
        var _decorators = [];
        _.forEach(decorators, function (decorator) {
            if (decorator.expression) {
                if (decorator.expression.text) {
                    _decorators.push({ name: decorator.expression.text });
                }
                if (decorator.expression.expression) {
                    var info = { name: decorator.expression.expression.text };
                    if (decorator.expression.arguments) {
                        info.stringifiedArguments = _this.stringifyArguments(decorator.expression.arguments);
                    }
                    _decorators.push(info);
                }
            }
        });
        return _decorators;
    };
    ClassHelper.prototype.handleFunction = function (arg) {
        var _this = this;
        if (arg.function.length === 0) {
            return "" + arg.name + this.getOptionalString(arg) + ": () => void";
        }
        var argums = arg.function.map(function (argu) {
            var _result = dependencies_engine_1.default.find(argu.type);
            if (_result) {
                if (_result.source === 'internal') {
                    var path_1 = _result.data.type;
                    if (_result.data.type === 'class') {
                        path_1 = 'classe';
                    }
                    return "" + argu.name + _this.getOptionalString(arg) + ": <a href=\"../" + path_1 + "s/" + _result.data.name + ".html\">" + argu.type + "</a>";
                }
                else {
                    var path_2 = angular_version_util_1.default.getApiLink(_result.data, configuration_1.default.mainData.angularVersion);
                    return "" + argu.name + _this.getOptionalString(arg) + ": <a href=\"" + path_2 + "\" target=\"_blank\">" + argu.type + "</a>";
                }
            }
            else if (basic_type_util_1.default.isKnownType(argu.type)) {
                var path_3 = basic_type_util_1.default.getTypeUrl(argu.type);
                return "" + argu.name + _this.getOptionalString(arg) + ": <a href=\"" + path_3 + "\" target=\"_blank\">" + argu.type + "</a>";
            }
            else {
                if (argu.name && argu.type) {
                    return "" + argu.name + _this.getOptionalString(arg) + ": " + argu.type;
                }
                else {
                    if (argu.name) {
                        return "" + argu.name.text;
                    }
                    else {
                        return '';
                    }
                }
            }
        });
        return "" + arg.name + this.getOptionalString(arg) + ": (" + argums + ") => void";
    };
    ClassHelper.prototype.getOptionalString = function (arg) {
        return arg.optional ? '?' : '';
    };
    ClassHelper.prototype.stringifyArguments = function (args) {
        var _this = this;
        var stringifyArgs = [];
        stringifyArgs = args
            .map(function (arg) {
            var _result = dependencies_engine_1.default.find(arg.type);
            if (_result) {
                if (_result.source === 'internal') {
                    var path_4 = _result.data.type;
                    if (_result.data.type === 'class') {
                        path_4 = 'classe';
                    }
                    return "" + arg.name + _this.getOptionalString(arg) + ": <a href=\"../" + path_4 + "s/" + _result.data.name + ".html\">" + arg.type + "</a>";
                }
                else {
                    var path_5 = angular_version_util_1.default.getApiLink(_result.data, configuration_1.default.mainData.angularVersion);
                    return "" + arg.name + _this.getOptionalString(arg) + ": <a href=\"" + path_5 + "\" target=\"_blank\">" + arg.type + "</a>";
                }
            }
            else if (arg.dotDotDotToken) {
                return "..." + arg.name + ": " + arg.type;
            }
            else if (arg.function) {
                return _this.handleFunction(arg);
            }
            else if (arg.expression && arg.name) {
                return arg.expression.text + '.' + arg.name.text;
            }
            else if (arg.expression && arg.kind === ts_simple_ast_1.SyntaxKind.NewExpression) {
                return 'new ' + arg.expression.text + '()';
            }
            else if (arg.kind && arg.kind === ts_simple_ast_1.SyntaxKind.StringLiteral) {
                return "'" + arg.text + "'";
            }
            else if (arg.kind && arg.kind === ts_simple_ast_1.SyntaxKind.ObjectLiteralExpression) {
                return object_literal_expression_util_1.StringifyObjectLiteralExpression(arg);
            }
            else if (basic_type_util_1.default.isKnownType(arg.type)) {
                var path_6 = basic_type_util_1.default.getTypeUrl(arg.type);
                return "" + arg.name + _this.getOptionalString(arg) + ": <a href=\"" + path_6 + "\" target=\"_blank\">" + arg.type + "</a>";
            }
            else {
                if (arg.type) {
                    var finalStringifiedArgument = '';
                    var separator = ':';
                    if (arg.name) {
                        finalStringifiedArgument += arg.name;
                    }
                    if (arg.kind === ts_simple_ast_1.SyntaxKind.AsExpression &&
                        arg.expression &&
                        arg.expression.text) {
                        finalStringifiedArgument += arg.expression.text;
                        separator = ' as';
                    }
                    if (arg.optional) {
                        finalStringifiedArgument += _this.getOptionalString(arg);
                    }
                    if (arg.type) {
                        finalStringifiedArgument += separator + ' ' + _this.visitType(arg.type);
                    }
                    return finalStringifiedArgument;
                }
                else if (arg.text) {
                    return "" + arg.text;
                }
                else {
                    return "" + arg.name + _this.getOptionalString(arg);
                }
            }
        })
            .join(', ');
        return stringifyArgs;
    };
    ClassHelper.prototype.getPosition = function (node, sourceFile) {
        var position;
        if (node.name && node.name.end) {
            position = ts_simple_ast_1.ts.getLineAndCharacterOfPosition(sourceFile, node.name.end);
        }
        else {
            position = ts_simple_ast_1.ts.getLineAndCharacterOfPosition(sourceFile, node.pos);
        }
        return position;
    };
    ClassHelper.prototype.addAccessor = function (accessors, nodeAccessor, sourceFile) {
        var nodeName = '';
        if (nodeAccessor.name) {
            nodeName = nodeAccessor.name.text;
            var jsdoctags = this.jsdocParserUtil.getJSDocs(nodeAccessor);
            if (!accessors[nodeName]) {
                accessors[nodeName] = {
                    name: nodeName,
                    setSignature: undefined,
                    getSignature: undefined
                };
            }
            if (nodeAccessor.kind === ts_simple_ast_1.SyntaxKind.SetAccessor) {
                var setSignature = {
                    name: nodeName,
                    type: 'void',
                    args: nodeAccessor.parameters.map(function (param) {
                        return {
                            name: param.name.text,
                            type: param.type ? kind_to_type_1.kindToType(param.type.kind) : ''
                        };
                    }),
                    returnType: nodeAccessor.type ? this.visitType(nodeAccessor.type) : 'void',
                    line: this.getPosition(nodeAccessor, sourceFile).line + 1
                };
                if (nodeAccessor.jsDoc && nodeAccessor.jsDoc.length >= 1) {
                    var comment = nodeAccessor.jsDoc[0].comment;
                    if (typeof comment !== 'undefined') {
                        setSignature.description = marked(comment);
                    }
                }
                if (jsdoctags && jsdoctags.length >= 1) {
                    if (jsdoctags[0].tags) {
                        setSignature.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
                    }
                }
                if (setSignature.jsdoctags && setSignature.jsdoctags.length > 0) {
                    setSignature.jsdoctags = utils_1.mergeTagsAndArgs(setSignature.args, setSignature.jsdoctags);
                }
                else if (setSignature.args && setSignature.args.length > 0) {
                    setSignature.jsdoctags = utils_1.mergeTagsAndArgs(setSignature.args);
                }
                accessors[nodeName].setSignature = setSignature;
            }
            if (nodeAccessor.kind === ts_simple_ast_1.SyntaxKind.GetAccessor) {
                var getSignature = {
                    name: nodeName,
                    type: nodeAccessor.type ? kind_to_type_1.kindToType(nodeAccessor.type.kind) : '',
                    returnType: nodeAccessor.type ? this.visitType(nodeAccessor.type) : '',
                    line: this.getPosition(nodeAccessor, sourceFile).line + 1
                };
                if (nodeAccessor.jsDoc && nodeAccessor.jsDoc.length >= 1) {
                    var comment = nodeAccessor.jsDoc[0].comment;
                    if (typeof comment !== 'undefined') {
                        getSignature.description = marked(comment);
                    }
                }
                if (jsdoctags && jsdoctags.length >= 1) {
                    if (jsdoctags[0].tags) {
                        getSignature.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
                    }
                }
                accessors[nodeName].getSignature = getSignature;
            }
        }
    };
    ClassHelper.prototype.isDirectiveDecorator = function (decorator) {
        if (decorator.expression.expression) {
            var decoratorIdentifierText = decorator.expression.expression.text;
            return (decoratorIdentifierText === 'Directive' || decoratorIdentifierText === 'Component');
        }
        else {
            return false;
        }
    };
    ClassHelper.prototype.isServiceDecorator = function (decorator) {
        return decorator.expression.expression
            ? decorator.expression.expression.text === 'Injectable'
            : false;
    };
    ClassHelper.prototype.isPrivate = function (member) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        if (member.modifiers) {
            var isPrivate = member.modifiers.some(function (modifier) { return modifier.kind === ts_simple_ast_1.SyntaxKind.PrivateKeyword; });
            if (isPrivate) {
                return true;
            }
        }
        return this.isHiddenMember(member);
    };
    ClassHelper.prototype.isProtected = function (member) {
        if (member.modifiers) {
            var isProtected = member.modifiers.some(function (modifier) { return modifier.kind === ts_simple_ast_1.SyntaxKind.ProtectedKeyword; });
            if (isProtected) {
                return true;
            }
        }
        return this.isHiddenMember(member);
    };
    ClassHelper.prototype.isInternal = function (member) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var internalTags = ['internal'];
        if (member.jsDoc) {
            for (var _i = 0, _a = member.jsDoc; _i < _a.length; _i++) {
                var doc = _a[_i];
                if (doc.tags) {
                    for (var _b = 0, _c = doc.tags; _b < _c.length; _b++) {
                        var tag = _c[_b];
                        if (internalTags.indexOf(tag.tagName.text) > -1) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    ClassHelper.prototype.isPublic = function (member) {
        if (member.modifiers) {
            var isPublic = member.modifiers.some(function (modifier) { return modifier.kind === ts_simple_ast_1.SyntaxKind.PublicKeyword; });
            if (isPublic) {
                return true;
            }
        }
        return this.isHiddenMember(member);
    };
    ClassHelper.prototype.isHiddenMember = function (member) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var internalTags = ['hidden'];
        if (member.jsDoc) {
            for (var _i = 0, _a = member.jsDoc; _i < _a.length; _i++) {
                var doc = _a[_i];
                if (doc.tags) {
                    for (var _b = 0, _c = doc.tags; _b < _c.length; _b++) {
                        var tag = _c[_b];
                        if (internalTags.indexOf(tag.tagName.text) > -1) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    ClassHelper.prototype.isPipeDecorator = function (decorator) {
        return decorator.expression.expression
            ? decorator.expression.expression.text === 'Pipe'
            : false;
    };
    ClassHelper.prototype.isModuleDecorator = function (decorator) {
        return decorator.expression.expression
            ? decorator.expression.expression.text === 'NgModule'
            : false;
    };
    /**
     * VISITERS
     */
    ClassHelper.prototype.visitClassDeclaration = function (fileName, classDeclaration, sourceFile) {
        var symbol = this.typeChecker.getSymbolAtLocation(classDeclaration.name);
        var rawdescription = '';
        var description = '';
        if (symbol) {
            rawdescription = this.jsdocParserUtil.getMainCommentOfNode(classDeclaration);
            description = marked(this.jsdocParserUtil.getMainCommentOfNode(classDeclaration));
            if (symbol.valueDeclaration && utils_2.isIgnore(symbol.valueDeclaration)) {
                return [{ ignore: true }];
            }
            if (symbol.declarations && symbol.declarations.length > 0) {
                if (utils_2.isIgnore(symbol.declarations[0])) {
                    return [{ ignore: true }];
                }
            }
        }
        var className = classDeclaration.name.text;
        var members;
        var implementsElements = [];
        var extendsElement;
        var jsdoctags = [];
        if (typeof ts_simple_ast_1.ts.getClassImplementsHeritageClauseElements !== 'undefined') {
            var implementedTypes = ts_simple_ast_1.ts.getClassImplementsHeritageClauseElements(classDeclaration);
            if (implementedTypes) {
                var i = 0;
                var len = implementedTypes.length;
                for (i; i < len; i++) {
                    if (implementedTypes[i].expression) {
                        implementsElements.push(implementedTypes[i].expression.text);
                    }
                }
            }
        }
        if (typeof ts_simple_ast_1.ts.getClassExtendsHeritageClauseElement !== 'undefined') {
            var extendsTypes = ts_simple_ast_1.ts.getClassExtendsHeritageClauseElement(classDeclaration);
            if (extendsTypes) {
                if (extendsTypes.expression) {
                    extendsElement = extendsTypes.expression.text;
                }
            }
        }
        if (symbol) {
            if (symbol.valueDeclaration) {
                jsdoctags = this.jsdocParserUtil.getJSDocs(symbol.valueDeclaration);
            }
        }
        members = this.visitMembers(classDeclaration.members, sourceFile);
        if (classDeclaration.decorators) {
            for (var i = 0; i < classDeclaration.decorators.length; i++) {
                if (this.isDirectiveDecorator(classDeclaration.decorators[i])) {
                    return {
                        description: description,
                        rawdescription: rawdescription,
                        inputs: members.inputs,
                        outputs: members.outputs,
                        hostBindings: members.hostBindings,
                        hostListeners: members.hostListeners,
                        properties: members.properties,
                        methods: members.methods,
                        indexSignatures: members.indexSignatures,
                        kind: members.kind,
                        constructor: members.constructor,
                        jsdoctags: jsdoctags,
                        extends: extendsElement,
                        implements: implementsElements,
                        accessors: members.accessors
                    };
                }
                else if (this.isServiceDecorator(classDeclaration.decorators[i])) {
                    return [
                        {
                            fileName: fileName,
                            className: className,
                            description: description,
                            rawdescription: rawdescription,
                            methods: members.methods,
                            indexSignatures: members.indexSignatures,
                            properties: members.properties,
                            kind: members.kind,
                            constructor: members.constructor,
                            jsdoctags: jsdoctags,
                            extends: extendsElement,
                            implements: implementsElements,
                            accessors: members.accessors
                        }
                    ];
                }
                else if (this.isPipeDecorator(classDeclaration.decorators[i])) {
                    return [
                        {
                            fileName: fileName,
                            className: className,
                            description: description,
                            rawdescription: rawdescription,
                            jsdoctags: jsdoctags,
                            properties: members.properties,
                            methods: members.methods
                        }
                    ];
                }
                else if (this.isModuleDecorator(classDeclaration.decorators[i])) {
                    return [
                        {
                            fileName: fileName,
                            className: className,
                            description: description,
                            rawdescription: rawdescription,
                            jsdoctags: jsdoctags,
                            methods: members.methods
                        }
                    ];
                }
                else {
                    return [
                        {
                            description: description,
                            rawdescription: rawdescription,
                            methods: members.methods,
                            indexSignatures: members.indexSignatures,
                            properties: members.properties,
                            kind: members.kind,
                            constructor: members.constructor,
                            jsdoctags: jsdoctags,
                            extends: extendsElement,
                            implements: implementsElements,
                            accessors: members.accessors
                        }
                    ];
                }
            }
        }
        else if (description) {
            return [
                {
                    description: description,
                    rawdescription: rawdescription,
                    inputs: members.inputs,
                    outputs: members.outputs,
                    hostBindings: members.hostBindings,
                    hostListeners: members.hostListeners,
                    methods: members.methods,
                    indexSignatures: members.indexSignatures,
                    properties: members.properties,
                    kind: members.kind,
                    constructor: members.constructor,
                    jsdoctags: jsdoctags,
                    extends: extendsElement,
                    implements: implementsElements,
                    accessors: members.accessors
                }
            ];
        }
        else {
            return [
                {
                    methods: members.methods,
                    inputs: members.inputs,
                    outputs: members.outputs,
                    hostBindings: members.hostBindings,
                    hostListeners: members.hostListeners,
                    indexSignatures: members.indexSignatures,
                    properties: members.properties,
                    kind: members.kind,
                    constructor: members.constructor,
                    jsdoctags: jsdoctags,
                    extends: extendsElement,
                    implements: implementsElements,
                    accessors: members.accessors
                }
            ];
        }
        return [];
    };
    ClassHelper.prototype.visitMembers = function (members, sourceFile) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var inputs = [];
        var outputs = [];
        var hostBindings = [];
        var hostListeners = [];
        var methods = [];
        var properties = [];
        var indexSignatures = [];
        var kind;
        var inputDecorator;
        var hostBinding;
        var hostListener;
        var constructor;
        var outDecorator;
        var accessors = {};
        var result = {};
        for (var i = 0; i < members.length; i++) {
            // Allows typescript guess type when using ts.is*
            var member = members[i];
            inputDecorator = this.getDecoratorOfType(member, 'Input');
            outDecorator = this.getDecoratorOfType(member, 'Output');
            hostBinding = this.getDecoratorOfType(member, 'HostBinding');
            hostListener = this.getDecoratorOfType(member, 'HostListener');
            kind = member.kind;
            if (utils_2.isIgnore(member)) {
                continue;
            }
            if (inputDecorator) {
                inputs.push(this.visitInputAndHostBinding(member, inputDecorator, sourceFile));
                if (ts_simple_ast_1.ts.isSetAccessorDeclaration(member)) {
                    this.addAccessor(accessors, members[i], sourceFile);
                }
            }
            else if (outDecorator) {
                outputs.push(this.visitOutput(member, outDecorator, sourceFile));
            }
            else if (hostBinding) {
                hostBindings.push(this.visitInputAndHostBinding(member, hostBinding, sourceFile));
            }
            else if (hostListener) {
                hostListeners.push(this.visitHostListener(member, hostListener, sourceFile));
            }
            else if (!this.isHiddenMember(member)) {
                if (!(this.isPrivate(member) && configuration_1.default.mainData.disablePrivate)) {
                    if (!(this.isInternal(member) && configuration_1.default.mainData.disableInternal)) {
                        if (!(this.isProtected(member) && configuration_1.default.mainData.disableProtected)) {
                            if (ts_simple_ast_1.ts.isMethodDeclaration(member) || ts_simple_ast_1.ts.isMethodSignature(member)) {
                                methods.push(this.visitMethodDeclaration(member, sourceFile));
                            }
                            else if (ts_simple_ast_1.ts.isPropertyDeclaration(member) ||
                                ts_simple_ast_1.ts.isPropertySignature(member)) {
                                properties.push(this.visitProperty(member, sourceFile));
                            }
                            else if (ts_simple_ast_1.ts.isCallSignatureDeclaration(member)) {
                                properties.push(this.visitCallDeclaration(member, sourceFile));
                            }
                            else if (ts_simple_ast_1.ts.isGetAccessorDeclaration(member) ||
                                ts_simple_ast_1.ts.isSetAccessorDeclaration(member)) {
                                this.addAccessor(accessors, members[i], sourceFile);
                            }
                            else if (ts_simple_ast_1.ts.isIndexSignatureDeclaration(member)) {
                                indexSignatures.push(this.visitIndexDeclaration(member, sourceFile));
                            }
                            else if (ts_simple_ast_1.ts.isConstructorDeclaration(member)) {
                                var _constructorProperties = this.visitConstructorProperties(member, sourceFile);
                                var j = 0;
                                var len = _constructorProperties.length;
                                for (j; j < len; j++) {
                                    properties.push(_constructorProperties[j]);
                                }
                                constructor = this.visitConstructorDeclaration(member, sourceFile);
                            }
                        }
                    }
                }
            }
        }
        inputs.sort(utils_1.getNamesCompareFn());
        outputs.sort(utils_1.getNamesCompareFn());
        hostBindings.sort(utils_1.getNamesCompareFn());
        hostListeners.sort(utils_1.getNamesCompareFn());
        properties.sort(utils_1.getNamesCompareFn());
        methods.sort(utils_1.getNamesCompareFn());
        indexSignatures.sort(utils_1.getNamesCompareFn());
        result = {
            inputs: inputs,
            outputs: outputs,
            hostBindings: hostBindings,
            hostListeners: hostListeners,
            methods: methods,
            properties: properties,
            indexSignatures: indexSignatures,
            kind: kind,
            constructor: constructor
        };
        if (Object.keys(accessors).length) {
            result['accessors'] = accessors;
        }
        return result;
    };
    ClassHelper.prototype.visitTypeName = function (typeName) {
        if (typeName.text) {
            return typeName.text;
        }
        return this.visitTypeName(typeName.left) + "." + this.visitTypeName(typeName.right);
    };
    ClassHelper.prototype.visitType = function (node) {
        var _return = 'void';
        if (!node) {
            return _return;
        }
        if (node.typeName) {
            _return = this.visitTypeName(node.typeName);
        }
        else if (node.type) {
            if (node.type.kind) {
                _return = kind_to_type_1.kindToType(node.type.kind);
            }
            if (node.type.typeName) {
                _return = this.visitTypeName(node.type.typeName);
            }
            if (node.type.typeArguments) {
                _return += '<';
                var typeArguments = [];
                for (var _i = 0, _a = node.type.typeArguments; _i < _a.length; _i++) {
                    var argument = _a[_i];
                    typeArguments.push(this.visitType(argument));
                }
                _return += typeArguments.join(' | ');
                _return += '>';
            }
            if (node.type.elementType) {
                var _firstPart = this.visitType(node.type.elementType);
                _return = _firstPart + kind_to_type_1.kindToType(node.type.kind);
                if (node.type.elementType.kind === ts_simple_ast_1.SyntaxKind.ParenthesizedType) {
                    _return = '(' + _firstPart + ')' + kind_to_type_1.kindToType(node.type.kind);
                }
            }
            if (node.type.types && ts_simple_ast_1.ts.isUnionTypeNode(node.type)) {
                _return = '';
                var i = 0;
                var len = node.type.types.length;
                for (i; i < len; i++) {
                    var type = node.type.types[i];
                    if (type.elementType) {
                        var _firstPart = this.visitType(type.elementType);
                        if (type.elementType.kind === ts_simple_ast_1.SyntaxKind.ParenthesizedType) {
                            _return += '(' + _firstPart + ')' + kind_to_type_1.kindToType(type.kind);
                        }
                        else {
                            _return += _firstPart + kind_to_type_1.kindToType(type.kind);
                        }
                    }
                    else {
                        _return += kind_to_type_1.kindToType(type.kind);
                        if (ts_simple_ast_1.ts.isLiteralTypeNode(type) && type.literal) {
                            _return += '"' + type.literal.text + '"';
                        }
                        if (type.typeName) {
                            _return += this.visitTypeName(type.typeName);
                        }
                        if (type.typeArguments) {
                            _return += '<';
                            var typeArguments = [];
                            for (var _b = 0, _c = type.typeArguments; _b < _c.length; _b++) {
                                var argument = _c[_b];
                                typeArguments.push(this.visitType(argument));
                            }
                            _return += typeArguments.join(' | ');
                            _return += '>';
                        }
                    }
                    if (i < len - 1) {
                        _return += ' | ';
                    }
                }
            }
            if (node.type.elementTypes) {
                var elementTypes = node.type.elementTypes;
                var i = 0;
                var len = elementTypes.length;
                if (len > 0) {
                    _return = '[';
                    for (i; i < len; i++) {
                        var type = elementTypes[i];
                        _return += kind_to_type_1.kindToType(type.kind);
                        if (ts_simple_ast_1.ts.isLiteralTypeNode(type) && type.literal) {
                            _return += '"' + type.literal.text + '"';
                        }
                        if (type.typeName) {
                            _return += this.visitTypeName(type.typeName);
                        }
                        if (i < len - 1) {
                            _return += ', ';
                        }
                    }
                    _return += ']';
                }
            }
        }
        else if (node.elementType) {
            _return = kind_to_type_1.kindToType(node.elementType.kind) + kind_to_type_1.kindToType(node.kind);
            if (node.elementType.typeName) {
                _return = this.visitTypeName(node.elementType.typeName) + kind_to_type_1.kindToType(node.kind);
            }
        }
        else if (node.types && ts_simple_ast_1.ts.isUnionTypeNode(node)) {
            _return = '';
            var i = 0;
            var len = node.types.length;
            for (i; i < len; i++) {
                var type = node.types[i];
                _return += kind_to_type_1.kindToType(type.kind);
                if (ts_simple_ast_1.ts.isLiteralTypeNode(type) && type.literal) {
                    _return += '"' + type.literal.text + '"';
                }
                if (type.typeName) {
                    _return += this.visitTypeName(type.typeName);
                }
                if (i < len - 1) {
                    _return += ' | ';
                }
            }
        }
        else if (node.dotDotDotToken) {
            _return = 'any[]';
        }
        else {
            _return = kind_to_type_1.kindToType(node.kind);
            if (_return === '' &&
                node.initializer &&
                node.initializer.kind &&
                (node.kind === ts_simple_ast_1.SyntaxKind.PropertyDeclaration || node.kind === ts_simple_ast_1.SyntaxKind.Parameter)) {
                _return = kind_to_type_1.kindToType(node.initializer.kind);
            }
            if (node.kind === ts_simple_ast_1.SyntaxKind.TypeParameter) {
                _return = node.name.text;
            }
            if (node.kind === ts_simple_ast_1.SyntaxKind.LiteralType) {
                _return = node.literal.text;
            }
        }
        if (node.typeArguments && node.typeArguments.length > 0) {
            _return += '<';
            var i = 0, len = node.typeArguments.length;
            for (i; i < len; i++) {
                var argument = node.typeArguments[i];
                _return += this.visitType(argument);
                if (i >= 0 && i < len - 1) {
                    _return += ', ';
                }
            }
            _return += '>';
        }
        return _return;
    };
    ClassHelper.prototype.visitCallDeclaration = function (method, sourceFile) {
        var _this = this;
        var sourceCode = sourceFile.getText();
        var hash = crypto
            .createHash('md5')
            .update(sourceCode)
            .digest('hex');
        var result = {
            id: 'call-declaration-' + hash,
            args: method.parameters ? method.parameters.map(function (prop) { return _this.visitArgument(prop); }) : [],
            returnType: this.visitType(method.type),
            line: this.getPosition(method, sourceFile).line + 1
        };
        if (method.jsDoc) {
            result.description = marked(marked(this.jsdocParserUtil.getMainCommentOfNode(method)));
        }
        var jsdoctags = this.jsdocParserUtil.getJSDocs(method);
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                result.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
            }
        }
        return result;
    };
    ClassHelper.prototype.visitIndexDeclaration = function (method, sourceFile) {
        var _this = this;
        var sourceCode = sourceFile.getText();
        var hash = crypto
            .createHash('md5')
            .update(sourceCode)
            .digest('hex');
        var result = {
            id: 'index-declaration-' + hash,
            args: method.parameters ? method.parameters.map(function (prop) { return _this.visitArgument(prop); }) : [],
            returnType: this.visitType(method.type),
            line: this.getPosition(method, sourceFile).line + 1
        };
        if (method.jsDoc) {
            result.description = marked(this.jsdocParserUtil.getMainCommentOfNode(method));
        }
        return result;
    };
    ClassHelper.prototype.visitConstructorDeclaration = function (method, sourceFile) {
        var _this = this;
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        var result = {
            name: 'constructor',
            description: '',
            args: method.parameters ? method.parameters.map(function (prop) { return _this.visitArgument(prop); }) : [],
            line: this.getPosition(method, sourceFile).line + 1
        };
        var jsdoctags = this.jsdocParserUtil.getJSDocs(method);
        if (method.jsDoc) {
            result.description = marked(this.jsdocParserUtil.getMainCommentOfNode(method));
        }
        if (method.modifiers) {
            if (method.modifiers.length > 0) {
                var kinds = method.modifiers.map(function (modifier) {
                    return modifier.kind;
                });
                if (_.indexOf(kinds, ts_simple_ast_1.SyntaxKind.PublicKeyword) !== -1 &&
                    _.indexOf(kinds, ts_simple_ast_1.SyntaxKind.StaticKeyword) !== -1) {
                    kinds = kinds.filter(function (kind) { return kind !== ts_simple_ast_1.SyntaxKind.PublicKeyword; });
                }
                result.modifierKind = kinds;
            }
        }
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                result.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
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
    ClassHelper.prototype.visitProperty = function (property, sourceFile) {
        var result = {
            name: property.name.text,
            defaultValue: property.initializer
                ? this.stringifyDefaultValue(property.initializer)
                : undefined,
            type: this.visitType(property),
            optional: typeof property.questionToken !== 'undefined',
            description: '',
            line: this.getPosition(property, sourceFile).line + 1
        };
        var jsdoctags;
        if (property.initializer && property.initializer.kind === ts_simple_ast_1.SyntaxKind.ArrowFunction) {
            result.defaultValue = '() => {...}';
        }
        if (typeof result.name === 'undefined' && typeof property.name.expression !== 'undefined') {
            result.name = property.name.expression.text;
        }
        if (property.jsDoc) {
            jsdoctags = this.jsdocParserUtil.getJSDocs(property);
            result.description = marked(this.jsdocParserUtil.getMainCommentOfNode(property));
        }
        if (property.decorators) {
            result.decorators = this.formatDecorators(property.decorators);
        }
        if (property.modifiers) {
            if (property.modifiers.length > 0) {
                var kinds = property.modifiers.map(function (modifier) {
                    return modifier.kind;
                });
                if (_.indexOf(kinds, ts_simple_ast_1.SyntaxKind.PublicKeyword) !== -1 &&
                    _.indexOf(kinds, ts_simple_ast_1.SyntaxKind.StaticKeyword) !== -1) {
                    kinds = kinds.filter(function (kind) { return kind !== ts_simple_ast_1.SyntaxKind.PublicKeyword; });
                }
                result.modifierKind = kinds;
            }
        }
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                result.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
            }
        }
        return result;
    };
    ClassHelper.prototype.visitConstructorProperties = function (constr, sourceFile) {
        var that = this;
        if (constr.parameters) {
            var _parameters_1 = [];
            var i = 0;
            var len = constr.parameters.length;
            for (i; i < len; i++) {
                if (this.isPublic(constr.parameters[i])) {
                    _parameters_1.push(this.visitProperty(constr.parameters[i], sourceFile));
                }
            }
            /**
             * Merge JSDoc tags description from constructor with parameters
             */
            if (constr.jsDoc) {
                if (constr.jsDoc.length > 0) {
                    var constrTags = constr.jsDoc[0].tags;
                    if (constrTags && constrTags.length > 0) {
                        constrTags.forEach(function (tag) {
                            _parameters_1.forEach(function (param) {
                                if (tag.tagName &&
                                    tag.tagName.escapedText &&
                                    tag.tagName.escapedText === 'param') {
                                    if (tag.name &&
                                        tag.name.escapedText &&
                                        tag.name.escapedText === param.name) {
                                        param.description = tag.comment;
                                    }
                                }
                            });
                        });
                    }
                }
            }
            return _parameters_1;
        }
        else {
            return [];
        }
    };
    ClassHelper.prototype.visitInputAndHostBinding = function (property, inDecorator, sourceFile) {
        var inArgs = inDecorator.expression.arguments;
        var _return = {};
        _return.name = inArgs.length > 0 ? inArgs[0].text : property.name.text;
        _return.defaultValue = property.initializer
            ? this.stringifyDefaultValue(property.initializer)
            : undefined;
        if (!_return.description) {
            if (property.jsDoc) {
                if (property.jsDoc.length > 0) {
                    if (typeof property.jsDoc[0].comment !== 'undefined') {
                        _return.description = marked(property.jsDoc[0].comment);
                    }
                }
            }
        }
        _return.line = this.getPosition(property, sourceFile).line + 1;
        if (property.type) {
            _return.type = this.visitType(property);
        }
        else {
            // handle NewExpression
            if (property.initializer) {
                if (ts_simple_ast_1.ts.isNewExpression(property.initializer)) {
                    if (property.initializer.expression) {
                        _return.type = property.initializer.expression.text;
                    }
                }
            }
        }
        if (property.kind === ts_simple_ast_1.SyntaxKind.SetAccessor) {
            // For setter accessor, find type in first parameter
            if (property.parameters && property.parameters.length === 1) {
                if (property.parameters[0].type) {
                    _return.type = kind_to_type_1.kindToType(property.parameters[0].type.kind);
                }
            }
        }
        return _return;
    };
    ClassHelper.prototype.visitMethodDeclaration = function (method, sourceFile) {
        var _this = this;
        var result = {
            name: method.name.text,
            args: method.parameters ? method.parameters.map(function (prop) { return _this.visitArgument(prop); }) : [],
            optional: typeof method.questionToken !== 'undefined',
            returnType: this.visitType(method.type),
            typeParameters: [],
            line: this.getPosition(method, sourceFile).line + 1
        };
        var jsdoctags = this.jsdocParserUtil.getJSDocs(method);
        if (typeof method.type === 'undefined') {
            // Try to get inferred type
            if (method.symbol) {
                var symbol = method.symbol;
                if (symbol.valueDeclaration) {
                    var symbolType = this.typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
                    if (symbolType) {
                        try {
                            var signature = this.typeChecker.getSignatureFromDeclaration(method);
                            var returnType = signature.getReturnType();
                            result.returnType = this.typeChecker.typeToString(returnType);
                            // tslint:disable-next-line:no-empty
                        }
                        catch (error) { }
                    }
                }
            }
        }
        if (method.typeParameters && method.typeParameters.length > 0) {
            result.typeParameters = method.typeParameters.map(function (typeParameter) {
                return _this.visitType(typeParameter);
            });
        }
        if (method.jsDoc) {
            result.description = marked(this.jsdocParserUtil.getMainCommentOfNode(method));
        }
        if (method.decorators) {
            result.decorators = this.formatDecorators(method.decorators);
        }
        if (method.modifiers) {
            if (method.modifiers.length > 0) {
                var kinds = method.modifiers.map(function (modifier) {
                    return modifier.kind;
                });
                if (_.indexOf(kinds, ts_simple_ast_1.SyntaxKind.PublicKeyword) !== -1 &&
                    _.indexOf(kinds, ts_simple_ast_1.SyntaxKind.StaticKeyword) !== -1) {
                    kinds = kinds.filter(function (kind) { return kind !== ts_simple_ast_1.SyntaxKind.PublicKeyword; });
                }
                result.modifierKind = kinds;
            }
        }
        if (jsdoctags && jsdoctags.length >= 1) {
            if (jsdoctags[0].tags) {
                result.jsdoctags = utils_1.markedtags(jsdoctags[0].tags);
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
    ClassHelper.prototype.visitOutput = function (property, outDecorator, sourceFile) {
        var inArgs = outDecorator.expression.arguments;
        var _return = {
            name: inArgs.length > 0 ? inArgs[0].text : property.name.text,
            defaultValue: property.initializer
                ? this.stringifyDefaultValue(property.initializer)
                : undefined
        };
        if (property.jsDoc) {
            _return.description = marked(marked(this.jsdocParserUtil.getMainCommentOfNode(property)));
        }
        if (!_return.description) {
            if (property.jsDoc && property.jsDoc.length > 0) {
                if (typeof property.jsDoc[0].comment !== 'undefined') {
                    _return.description = marked(property.jsDoc[0].comment);
                }
            }
        }
        _return.line = this.getPosition(property, sourceFile).line + 1;
        if (property.type) {
            _return.type = this.visitType(property);
        }
        else {
            // handle NewExpression
            if (property.initializer) {
                if (ts_simple_ast_1.ts.isNewExpression(property.initializer)) {
                    if (property.initializer.expression) {
                        _return.type = property.initializer.expression.text;
                    }
                }
            }
        }
        return _return;
    };
    ClassHelper.prototype.visitArgument = function (arg) {
        var _this = this;
        var _result = { name: arg.name.text, type: this.visitType(arg) };
        if (arg.dotDotDotToken) {
            _result.dotDotDotToken = true;
        }
        if (arg.questionToken) {
            _result.optional = true;
        }
        if (arg.type) {
            if (arg.type.kind) {
                if (ts_simple_ast_1.ts.isFunctionTypeNode(arg.type)) {
                    _result.function = arg.type.parameters
                        ? arg.type.parameters.map(function (prop) { return _this.visitArgument(prop); })
                        : [];
                }
            }
        }
        if (arg.initializer) {
            _result.defaultValue = this.stringifyDefaultValue(arg.initializer);
        }
        return _result;
    };
    ClassHelper.prototype.visitHostListener = function (property, hostListenerDecorator, sourceFile) {
        var _this = this;
        var inArgs = hostListenerDecorator.expression.arguments;
        var _return = {};
        _return.name = inArgs.length > 0 ? inArgs[0].text : property.name.text;
        _return.args = property.parameters
            ? property.parameters.map(function (prop) { return _this.visitArgument(prop); })
            : [];
        _return.argsDecorator =
            inArgs.length > 1
                ? inArgs[1].elements.map(function (prop) {
                    return prop.text;
                })
                : [];
        if (property.jsDoc) {
            _return.description = marked(this.jsdocParserUtil.getMainCommentOfNode(property));
        }
        if (!_return.description) {
            if (property.jsDoc) {
                if (property.jsDoc.length > 0) {
                    if (typeof property.jsDoc[0].comment !== 'undefined') {
                        _return.description = marked(property.jsDoc[0].comment);
                    }
                }
            }
        }
        _return.line = this.getPosition(property, sourceFile).line + 1;
        return _return;
    };
    return ClassHelper;
}());
exports.ClassHelper = ClassHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MtaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvY29tcGlsZXIvYW5ndWxhci9kZXBzL2hlbHBlcnMvY2xhc3MtaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMEJBQTRCO0FBSTVCLCtDQUErQztBQUUvQyxvREFBNkY7QUFDN0Ysa0VBQStEO0FBQy9ELDRFQUF5RTtBQUN6RSw4Q0FBZ0Q7QUFDaEQsbUZBQTRFO0FBQzVFLHdFQUFpRTtBQUNqRSxzR0FBdUc7QUFFdkcsK0VBQXlFO0FBQ3pFLDJEQUFzRDtBQUV0RCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRWpDO0lBR0kscUJBQW9CLFdBQTJCO1FBQTNCLGdCQUFXLEdBQVgsV0FBVyxDQUFnQjtRQUZ2QyxvQkFBZSxHQUFHLElBQUksbUNBQWUsRUFBRSxDQUFDO0lBRUUsQ0FBQztJQUVuRDs7T0FFRztJQUVJLDJDQUFxQixHQUE1QixVQUE2QixJQUFhO1FBQ3RDOztXQUVHO1FBQ0gsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDaEIsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDekI7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssMEJBQVUsQ0FBQyxZQUFZLEVBQUU7WUFDOUMsT0FBTyxPQUFPLENBQUM7U0FDbEI7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssMEJBQVUsQ0FBQyxXQUFXLEVBQUU7WUFDN0MsT0FBTyxNQUFNLENBQUM7U0FDakI7SUFDTCxDQUFDO0lBRU8sd0NBQWtCLEdB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M0IsSUFBSSxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLFdBQVcsRUFBRTt3QkFDbEQsT0FBTyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDM0Q7aUJBQ0o7YUFDSjtTQUNKO1FBQ0QsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQy9ELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDTCxrQkFBQztBQUFELENBQUMsQUFyc0NELElBcXNDQztBQXJzQ1ksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJ3V0aWwnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHsgdHMsIFN5bnRheEtpbmQgfSBmcm9tICd0cy1zaW1wbGUtYXN0JztcblxuaW1wb3J0IHsgZ2V0TmFtZXNDb21wYXJlRm4sIG1lcmdlVGFnc0FuZEFyZ3MsIG1hcmtlZHRhZ3MgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlscy91dGlscyc7XG5pbXBvcnQgeyBraW5kVG9UeXBlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbHMva2luZC10by10eXBlJztcbmltcG9ydCB7IEpzZG9jUGFyc2VyVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWxzL2pzZG9jLXBhcnNlci51dGlsJztcbmltcG9ydCB7IGlzSWdub3JlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbHMnO1xuaW1wb3J0IEFuZ3VsYXJWZXJzaW9uVXRpbCBmcm9tICcuLi8uLi8uLi8uLi8uLi8vdXRpbHMvYW5ndWxhci12ZXJzaW9uLnV0aWwnO1xuaW1wb3J0IEJhc2ljVHlwZVV0aWwgZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbHMvYmFzaWMtdHlwZS51dGlsJztcbmltcG9ydCB7IFN0cmluZ2lmeU9iamVjdExpdGVyYWxFeHByZXNzaW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbHMvb2JqZWN0LWxpdGVyYWwtZXhwcmVzc2lvbi51dGlsJztcblxuaW1wb3J0IERlcGVuZGVuY2llc0VuZ2luZSBmcm9tICcuLi8uLi8uLi8uLi9lbmdpbmVzL2RlcGVuZGVuY2llcy5lbmdpbmUnO1xuaW1wb3J0IENvbmZpZ3VyYXRpb24gZnJvbSAnLi4vLi4vLi4vLi4vY29uZmlndXJhdGlvbic7XG5cbmNvbnN0IGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuY29uc3QgbWFya2VkID0gcmVxdWlyZSgnbWFya2VkJyk7XG5cbmV4cG9ydCBjbGFzcyBDbGFzc0hlbHBlciB7XG4gICAgcHJpdmF0ZSBqc2RvY1BhcnNlclV0aWwgPSBuZXcgSnNkb2NQYXJzZXJVdGlsKCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlcikge31cblxuICAgIC8qKlxuICAgICAqIEhFTFBFUlNcbiAgICAgKi9cblxuICAgIHB1YmxpYyBzdHJpbmdpZnlEZWZhdWx0VmFsdWUobm9kZTogdHMuTm9kZSk6IHN0cmluZyB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb3B5cmlnaHQgaHR0cHM6Ly9naXRodWIuY29tL25nLWJvb3RzdHJhcC9uZy1ib290c3RyYXBcbiAgICAgICAgICovXG4gICAgICAgIGlmIChub2RlLmdldFRleHQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZ2V0VGV4dCgpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUua2luZCA9PT0gU3ludGF4S2luZC5GYWxzZUtleXdvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiAnZmFsc2UnO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUua2luZCA9PT0gU3ludGF4S2luZC5UcnVlS2V5d29yZCkge1xuICAgICAgICAgICAgcmV0dXJuICd0cnVlJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RGVjb3JhdG9yT2ZUeXBlKG5vZGUsIGRlY29yYXRvclR5cGUpIHtcbiAgICAgICAgbGV0IGRlY29yYXRvcnMgPSBub2RlLmRlY29yYXRvcnMgfHwgW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWNvcmF0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZGVjb3JhdG9yc1tpXS5leHByZXNzaW9uLmV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICBpZiAoZGVjb3JhdG9yc1tpXS5leHByZXNzaW9uLmV4cHJlc3Npb24udGV4dCA9PT0gZGVjb3JhdG9yVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVjb3JhdG9yc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHByaXZhdGUgZm9ybWF0RGVjb3JhdG9ycyhkZWNvcmF0b3JzKSB7XG4gICAgICAgIGxldCBfZGVjb3JhdG9ycyA9IFtdO1xuXG4gICAgICAgIF8uZm9yRWFjaChkZWNvcmF0b3JzLCAoZGVjb3JhdG9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmIChkZWNvcmF0b3IuZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgIGlmIChkZWNvcmF0b3IuZXhwcmVzc2lvbi50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIF9kZWNvcmF0b3JzLnB1c2goeyBuYW1lOiBkZWNvcmF0b3IuZXhwcmVzc2lvbi50ZXh0IH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZGVjb3JhdG9yLmV4cHJlc3Npb24uZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5mbzogYW55ID0geyBuYW1lOiBkZWNvcmF0b3IuZXhwcmVzc2lvbi5leHByZXNzaW9uLnRleHQgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlY29yYXRvci5leHByZXNzaW9uLmFyZ3VtZW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5mby5zdHJpbmdpZmllZEFyZ3VtZW50cyA9IHRoaXMuc3RyaW5naWZ5QXJndW1lbnRzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY29yYXRvci5leHByZXNzaW9uLmFyZ3VtZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfZGVjb3JhdG9ycy5wdXNoKGluZm8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIF9kZWNvcmF0b3JzO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlRnVuY3Rpb24oYXJnKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGFyZy5mdW5jdGlvbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgJHthcmcubmFtZX0ke3RoaXMuZ2V0T3B0aW9uYWxTdHJpbmcoYXJnKX06ICgpID0+IHZvaWRgO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFyZ3VtcyA9IGFyZy5mdW5jdGlvbi5tYXAoYXJndSA9PiB7XG4gICAgICAgICAgICBsZXQgX3Jlc3VsdCA9IERlcGVuZGVuY2llc0VuZ2luZS5maW5kKGFyZ3UudHlwZSk7XG4gICAgICAgICAgICBpZiAoX3Jlc3VsdCkge1xuICAgICAgICAgICAgICAgIGlmIChfcmVzdWx0LnNvdXJjZSA9PT0gJ2ludGVybmFsJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGF0aCA9IF9yZXN1bHQuZGF0YS50eXBlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3Jlc3VsdC5kYXRhLnR5cGUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSAnY2xhc3NlJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7YXJndS5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhhcmcpfTogPGEgaHJlZj1cIi4uLyR7cGF0aH1zLyR7XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVzdWx0LmRhdGEubmFtZVxuICAgICAgICAgICAgICAgICAgICB9Lmh0bWxcIj4ke2FyZ3UudHlwZX08L2E+YDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGF0aCA9IEFuZ3VsYXJWZXJzaW9uVXRpbC5nZXRBcGlMaW5rKFxuICAgICAgICAgICAgICAgICAgICAgICAgX3Jlc3VsdC5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5hbmd1bGFyVmVyc2lvblxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7YXJndS5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ1xuICAgICAgICAgICAgICAgICAgICApfTogPGEgaHJlZj1cIiR7cGF0aH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2FyZ3UudHlwZX08L2E+YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKEJhc2ljVHlwZVV0aWwuaXNLbm93blR5cGUoYXJndS50eXBlKSkge1xuICAgICAgICAgICAgICAgIGxldCBwYXRoID0gQmFzaWNUeXBlVXRpbC5nZXRUeXBlVXJsKGFyZ3UudHlwZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2FyZ3UubmFtZX0ke3RoaXMuZ2V0T3B0aW9uYWxTdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgIGFyZ1xuICAgICAgICAgICAgICAgICl9OiA8YSBocmVmPVwiJHtwYXRofVwiIHRhcmdldD1cIl9ibGFua1wiPiR7YXJndS50eXBlfTwvYT5gO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJndS5uYW1lICYmIGFyZ3UudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7YXJndS5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhhcmcpfTogJHthcmd1LnR5cGV9YDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJndS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7YXJndS5uYW1lLnRleHR9YDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBgJHthcmcubmFtZX0ke3RoaXMuZ2V0T3B0aW9uYWxTdHJpbmcoYXJnKX06ICgke2FyZ3Vtc30pID0+IHZvaWRgO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0T3B0aW9uYWxTdHJpbmcoYXJnKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGFyZy5vcHRpb25hbCA/ICc/JyA6ICcnO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RyaW5naWZ5QXJndW1lbnRzKGFyZ3MpIHtcbiAgICAgICAgbGV0IHN0cmluZ2lmeUFyZ3MgPSBbXTtcblxuICAgICAgICBzdHJpbmdpZnlBcmdzID0gYXJnc1xuICAgICAgICAgICAgLm1hcChhcmcgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBfcmVzdWx0ID0gRGVwZW5kZW5jaWVzRW5naW5lLmZpbmQoYXJnLnR5cGUpO1xuICAgICAgICAgICAgICAgIGlmIChfcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfcmVzdWx0LnNvdXJjZSA9PT0gJ2ludGVybmFsJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGggPSBfcmVzdWx0LmRhdGEudHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfcmVzdWx0LmRhdGEudHlwZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSAnY2xhc3NlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmcubmFtZX0ke3RoaXMuZ2V0T3B0aW9uYWxTdHJpbmcoYXJnKX06IDxhIGhyZWY9XCIuLi8ke3BhdGh9cy8ke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXN1bHQuZGF0YS5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9Lmh0bWxcIj4ke2FyZy50eXBlfTwvYT5gO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGggPSBBbmd1bGFyVmVyc2lvblV0aWwuZ2V0QXBpTGluayhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVzdWx0LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5hbmd1bGFyVmVyc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmcubmFtZX0ke3RoaXMuZ2V0T3B0aW9uYWxTdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnXG4gICAgICAgICAgICAgICAgICAgICAgICApfTogPGEgaHJlZj1cIiR7cGF0aH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2FyZy50eXBlfTwvYT5gO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcuZG90RG90RG90VG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAuLi4ke2FyZy5uYW1lfTogJHthcmcudHlwZX1gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnLmZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUZ1bmN0aW9uKGFyZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcuZXhwcmVzc2lvbiAmJiBhcmcubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnLmV4cHJlc3Npb24udGV4dCArICcuJyArIGFyZy5uYW1lLnRleHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcuZXhwcmVzc2lvbiAmJiBhcmcua2luZCA9PT0gU3ludGF4S2luZC5OZXdFeHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnbmV3ICcgKyBhcmcuZXhwcmVzc2lvbi50ZXh0ICsgJygpJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kICYmIGFyZy5raW5kID09PSBTeW50YXhLaW5kLlN0cmluZ0xpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAnYCArIGFyZy50ZXh0ICsgYCdgO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgJiYgYXJnLmtpbmQgPT09IFN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZ2lmeU9iamVjdExpdGVyYWxFeHByZXNzaW9uKGFyZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChCYXNpY1R5cGVVdGlsLmlzS25vd25UeXBlKGFyZy50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGF0aCA9IEJhc2ljVHlwZVV0aWwuZ2V0VHlwZVVybChhcmcudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmcubmFtZX0ke3RoaXMuZ2V0T3B0aW9uYWxTdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdcbiAgICAgICAgICAgICAgICAgICAgKX06IDxhIGhyZWY9XCIke3BhdGh9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHthcmcudHlwZX08L2E+YDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJnLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaW5hbFN0cmluZ2lmaWVkQXJndW1lbnQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZXBhcmF0b3IgPSAnOic7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJnLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFN0cmluZ2lmaWVkQXJndW1lbnQgKz0gYXJnLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnLmtpbmQgPT09IFN5bnRheEtpbmQuQXNFeHByZXNzaW9uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnLmV4cHJlc3Npb24gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmcuZXhwcmVzc2lvbi50ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFN0cmluZ2lmaWVkQXJndW1lbnQgKz0gYXJnLmV4cHJlc3Npb24udGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXBhcmF0b3IgPSAnIGFzJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmcub3B0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFN0cmluZ2lmaWVkQXJndW1lbnQgKz0gdGhpcy5nZXRPcHRpb25hbFN0cmluZyhhcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZy50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxTdHJpbmdpZmllZEFyZ3VtZW50ICs9IHNlcGFyYXRvciArICcgJyArIHRoaXMudmlzaXRUeXBlKGFyZy50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaW5hbFN0cmluZ2lmaWVkQXJndW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnLnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmcudGV4dH1gO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2FyZy5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhhcmcpfWA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmpvaW4oJywgJyk7XG5cbiAgICAgICAgcmV0dXJuIHN0cmluZ2lmeUFyZ3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQb3NpdGlvbihub2RlOiB0cy5Ob2RlLCBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogdHMuTGluZUFuZENoYXJhY3RlciB7XG4gICAgICAgIGxldCBwb3NpdGlvbjogdHMuTGluZUFuZENoYXJhY3RlcjtcbiAgICAgICAgaWYgKG5vZGUubmFtZSAmJiBub2RlLm5hbWUuZW5kKSB7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IHRzLmdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKHNvdXJjZUZpbGUsIG5vZGUubmFtZS5lbmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zaXRpb24gPSB0cy5nZXRMaW5lQW5kQ2hhcmFjdGVyT2ZQb3NpdGlvbihzb3VyY2VGaWxlLCBub2RlLnBvcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkQWNjZXNzb3IoYWNjZXNzb3JzLCBub2RlQWNjZXNzb3IsIHNvdXJjZUZpbGUpIHtcbiAgICAgICAgbGV0IG5vZGVOYW1lID0gJyc7XG4gICAgICAgIGlmIChub2RlQWNjZXNzb3IubmFtZSkge1xuICAgICAgICAgICAgbm9kZU5hbWUgPSBub2RlQWNjZXNzb3IubmFtZS50ZXh0O1xuICAgICAgICAgICAgbGV0IGpzZG9jdGFncyA9IHRoaXMuanNkb2NQYXJzZXJVdGlsLmdldEpTRG9jcyhub2RlQWNjZXNzb3IpO1xuXG4gICAgICAgICAgICBpZiAoIWFjY2Vzc29yc1tub2RlTmFtZV0pIHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NvcnNbbm9kZU5hbWVdID0ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBub2RlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgc2V0U2lnbmF0dXJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIGdldFNpZ25hdHVyZTogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5vZGVBY2Nlc3Nvci5raW5kID09PSBTeW50YXhLaW5kLlNldEFjY2Vzc29yKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNldFNpZ25hdHVyZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbm9kZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd2b2lkJyxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogbm9kZUFjY2Vzc29yLnBhcmFtZXRlcnMubWFwKHBhcmFtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogcGFyYW0ubmFtZS50ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHBhcmFtLnR5cGUgPyBraW5kVG9UeXBlKHBhcmFtLnR5cGUua2luZCkgOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblR5cGU6IG5vZGVBY2Nlc3Nvci50eXBlID8gdGhpcy52aXNpdFR5cGUobm9kZUFjY2Vzc29yLnR5cGUpIDogJ3ZvaWQnLFxuICAgICAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLmdldFBvc2l0aW9uKG5vZGVBY2Nlc3Nvciwgc291cmNlRmlsZSkubGluZSArIDFcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGVBY2Nlc3Nvci5qc0RvYyAmJiBub2RlQWNjZXNzb3IuanNEb2MubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbW1lbnQgPSBub2RlQWNjZXNzb3IuanNEb2NbMF0uY29tbWVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21tZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0U2lnbmF0dXJlLmRlc2NyaXB0aW9uID0gbWFya2VkKGNvbW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGpzZG9jdGFncyAmJiBqc2RvY3RhZ3MubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpzZG9jdGFnc1swXS50YWdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRTaWduYXR1cmUuanNkb2N0YWdzID0gbWFya2VkdGFncyhqc2RvY3RhZ3NbMF0udGFncyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNldFNpZ25hdHVyZS5qc2RvY3RhZ3MgJiYgc2V0U2lnbmF0dXJlLmpzZG9jdGFncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFNpZ25hdHVyZS5qc2RvY3RhZ3MgPSBtZXJnZVRhZ3NBbmRBcmdzKFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0U2lnbmF0dXJlLmFyZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRTaWduYXR1cmUuanNkb2N0YWdzXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZXRTaWduYXR1cmUuYXJncyAmJiBzZXRTaWduYXR1cmUuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFNpZ25hdHVyZS5qc2RvY3RhZ3MgPSBtZXJnZVRhZ3NBbmRBcmdzKHNldFNpZ25hdHVyZS5hcmdzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhY2Nlc3NvcnNbbm9kZU5hbWVdLnNldFNpZ25hdHVyZSA9IHNldFNpZ25hdHVyZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlQWNjZXNzb3Iua2luZCA9PT0gU3ludGF4S2luZC5HZXRBY2Nlc3Nvcikge1xuICAgICAgICAgICAgICAgIGxldCBnZXRTaWduYXR1cmUgPSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5vZGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBub2RlQWNjZXNzb3IudHlwZSA/IGtpbmRUb1R5cGUobm9kZUFjY2Vzc29yLnR5cGUua2luZCkgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVHlwZTogbm9kZUFjY2Vzc29yLnR5cGUgPyB0aGlzLnZpc2l0VHlwZShub2RlQWNjZXNzb3IudHlwZSkgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgbGluZTogdGhpcy5nZXRQb3NpdGlvbihub2RlQWNjZXNzb3IsIHNvdXJjZUZpbGUpLmxpbmUgKyAxXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmIChub2RlQWNjZXNzb3IuanNEb2MgJiYgbm9kZUFjY2Vzc29yLmpzRG9jLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21tZW50ID0gbm9kZUFjY2Vzc29yLmpzRG9jWzBdLmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldFNpZ25hdHVyZS5kZXNjcmlwdGlvbiA9IG1hcmtlZChjb21tZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChqc2RvY3RhZ3MgJiYganNkb2N0YWdzLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqc2RvY3RhZ3NbMF0udGFncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0U2lnbmF0dXJlLmpzZG9jdGFncyA9IG1hcmtlZHRhZ3MoanNkb2N0YWdzWzBdLnRhZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYWNjZXNzb3JzW25vZGVOYW1lXS5nZXRTaWduYXR1cmUgPSBnZXRTaWduYXR1cmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGlzRGlyZWN0aXZlRGVjb3JhdG9yKGRlY29yYXRvcjogdHMuRGVjb3JhdG9yKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChkZWNvcmF0b3IuZXhwcmVzc2lvbi5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICBsZXQgZGVjb3JhdG9ySWRlbnRpZmllclRleHQgPSBkZWNvcmF0b3IuZXhwcmVzc2lvbi5leHByZXNzaW9uLnRleHQ7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIGRlY29yYXRvcklkZW50aWZpZXJUZXh0ID09PSAnRGlyZWN0aXZlJyB8fCBkZWNvcmF0b3JJZGVudGlmaWVyVGV4dCA9PT0gJ0NvbXBvbmVudCdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGlzU2VydmljZURlY29yYXRvcihkZWNvcmF0b3IpIHtcbiAgICAgICAgcmV0dXJuIGRlY29yYXRvci5leHByZXNzaW9uLmV4cHJlc3Npb25cbiAgICAgICAgICAgID8gZGVjb3JhdG9yLmV4cHJlc3Npb24uZXhwcmVzc2lvbi50ZXh0ID09PSAnSW5qZWN0YWJsZSdcbiAgICAgICAgICAgIDogZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1ByaXZhdGUobWVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb3B5cmlnaHQgaHR0cHM6Ly9naXRodWIuY29tL25nLWJvb3RzdHJhcC9uZy1ib290c3RyYXBcbiAgICAgICAgICovXG4gICAgICAgIGlmIChtZW1iZXIubW9kaWZpZXJzKSB7XG4gICAgICAgICAgICBjb25zdCBpc1ByaXZhdGU6IGJvb2xlYW4gPSBtZW1iZXIubW9kaWZpZXJzLnNvbWUoXG4gICAgICAgICAgICAgICAgbW9kaWZpZXIgPT4gbW9kaWZpZXIua2luZCA9PT0gU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChpc1ByaXZhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5pc0hpZGRlbk1lbWJlcihtZW1iZXIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNQcm90ZWN0ZWQobWVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChtZW1iZXIubW9kaWZpZXJzKSB7XG4gICAgICAgICAgICBjb25zdCBpc1Byb3RlY3RlZDogYm9vbGVhbiA9IG1lbWJlci5tb2RpZmllcnMuc29tZShcbiAgICAgICAgICAgICAgICBtb2RpZmllciA9PiBtb2RpZmllci5raW5kID09PSBTeW50YXhLaW5kLlByb3RlY3RlZEtleXdvcmRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoaXNQcm90ZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5pc0hpZGRlbk1lbWJlcihtZW1iZXIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNJbnRlcm5hbChtZW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvcHlyaWdodCBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcFxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgaW50ZXJuYWxUYWdzOiBzdHJpbmdbXSA9IFsnaW50ZXJuYWwnXTtcbiAgICAgICAgaWYgKG1lbWJlci5qc0RvYykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBkb2Mgb2YgbWVtYmVyLmpzRG9jKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvYy50YWdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdGFnIG9mIGRvYy50YWdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJuYWxUYWdzLmluZGV4T2YodGFnLnRhZ05hbWUudGV4dCkgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzUHVibGljKG1lbWJlcik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAobWVtYmVyLm1vZGlmaWVycykge1xuICAgICAgICAgICAgY29uc3QgaXNQdWJsaWM6IGJvb2xlYW4gPSBtZW1iZXIubW9kaWZpZXJzLnNvbWUoXG4gICAgICAgICAgICAgICAgbW9kaWZpZXIgPT4gbW9kaWZpZXIua2luZCA9PT0gU3ludGF4S2luZC5QdWJsaWNLZXl3b3JkXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGlzUHVibGljKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuaXNIaWRkZW5NZW1iZXIobWVtYmVyKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzSGlkZGVuTWVtYmVyKG1lbWJlcik6IGJvb2xlYW4ge1xuICAgICAgICAvKipcbiAgICAgICAgICogQ29weXJpZ2h0IGh0dHBzOi8vZ2l0aHViLmNvbS9uZy1ib290c3RyYXAvbmctYm9vdHN0cmFwXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBpbnRlcm5hbFRhZ3M6IHN0cmluZ1tdID0gWydoaWRkZW4nXTtcbiAgICAgICAgaWYgKG1lbWJlci5qc0RvYykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBkb2Mgb2YgbWVtYmVyLmpzRG9jKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvYy50YWdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdGFnIG9mIGRvYy50YWdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW50ZXJuYWxUYWdzLmluZGV4T2YodGFnLnRhZ05hbWUudGV4dCkgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzUGlwZURlY29yYXRvcihkZWNvcmF0b3IpIHtcbiAgICAgICAgcmV0dXJuIGRlY29yYXRvci5leHByZXNzaW9uLmV4cHJlc3Npb25cbiAgICAgICAgICAgID8gZGVjb3JhdG9yLmV4cHJlc3Npb24uZXhwcmVzc2lvbi50ZXh0ID09PSAnUGlwZSdcbiAgICAgICAgICAgIDogZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc01vZHVsZURlY29yYXRvcihkZWNvcmF0b3IpIHtcbiAgICAgICAgcmV0dXJuIGRlY29yYXRvci5leHByZXNzaW9uLmV4cHJlc3Npb25cbiAgICAgICAgICAgID8gZGVjb3JhdG9yLmV4cHJlc3Npb24uZXhwcmVzc2lvbi50ZXh0ID09PSAnTmdNb2R1bGUnXG4gICAgICAgICAgICA6IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZJU0lURVJTXG4gICAgICovXG5cbiAgICBwdWJsaWMgdmlzaXRDbGFzc0RlY2xhcmF0aW9uKFxuICAgICAgICBmaWxlTmFtZTogc3RyaW5nLFxuICAgICAgICBjbGFzc0RlY2xhcmF0aW9uOiB0cy5DbGFzc0RlY2xhcmF0aW9uIHwgdHMuSW50ZXJmYWNlRGVjbGFyYXRpb24sXG4gICAgICAgIHNvdXJjZUZpbGU/OiB0cy5Tb3VyY2VGaWxlXG4gICAgKTogYW55IHtcbiAgICAgICAgbGV0IHN5bWJvbCA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihjbGFzc0RlY2xhcmF0aW9uLm5hbWUpO1xuICAgICAgICBsZXQgcmF3ZGVzY3JpcHRpb24gPSAnJztcbiAgICAgICAgbGV0IGRlc2NyaXB0aW9uID0gJyc7XG4gICAgICAgIGlmIChzeW1ib2wpIHtcbiAgICAgICAgICAgIHJhd2Rlc2NyaXB0aW9uID0gdGhpcy5qc2RvY1BhcnNlclV0aWwuZ2V0TWFpbkNvbW1lbnRPZk5vZGUoY2xhc3NEZWNsYXJhdGlvbik7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbiA9IG1hcmtlZCh0aGlzLmpzZG9jUGFyc2VyVXRpbC5nZXRNYWluQ29tbWVudE9mTm9kZShjbGFzc0RlY2xhcmF0aW9uKSk7XG4gICAgICAgICAgICBpZiAoc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24gJiYgaXNJZ25vcmUoc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFt7IGlnbm9yZTogdHJ1ZSB9XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzeW1ib2wuZGVjbGFyYXRpb25zICYmIHN5bWJvbC5kZWNsYXJhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmIChpc0lnbm9yZShzeW1ib2wuZGVjbGFyYXRpb25zWzBdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3sgaWdub3JlOiB0cnVlIH1dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgY2xhc3NOYW1lID0gY2xhc3NEZWNsYXJhdGlvbi5uYW1lLnRleHQ7XG4gICAgICAgIGxldCBtZW1iZXJzO1xuICAgICAgICBsZXQgaW1wbGVtZW50c0VsZW1lbnRzID0gW107XG4gICAgICAgIGxldCBleHRlbmRzRWxlbWVudDtcbiAgICAgICAgbGV0IGpzZG9jdGFncyA9IFtdO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdHMuZ2V0Q2xhc3NJbXBsZW1lbnRzSGVyaXRhZ2VDbGF1c2VFbGVtZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxldCBpbXBsZW1lbnRlZFR5cGVzID0gdHMuZ2V0Q2xhc3NJbXBsZW1lbnRzSGVyaXRhZ2VDbGF1c2VFbGVtZW50cyhjbGFzc0RlY2xhcmF0aW9uKTtcbiAgICAgICAgICAgIGlmIChpbXBsZW1lbnRlZFR5cGVzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgICAgIGxldCBsZW4gPSBpbXBsZW1lbnRlZFR5cGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW1wbGVtZW50ZWRUeXBlc1tpXS5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbXBsZW1lbnRzRWxlbWVudHMucHVzaChpbXBsZW1lbnRlZFR5cGVzW2ldLmV4cHJlc3Npb24udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRzLmdldENsYXNzRXh0ZW5kc0hlcml0YWdlQ2xhdXNlRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxldCBleHRlbmRzVHlwZXMgPSB0cy5nZXRDbGFzc0V4dGVuZHNIZXJpdGFnZUNsYXVzZUVsZW1lbnQoY2xhc3NEZWNsYXJhdGlvbik7XG4gICAgICAgICAgICBpZiAoZXh0ZW5kc1R5cGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4dGVuZHNUeXBlcy5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4dGVuZHNFbGVtZW50ID0gZXh0ZW5kc1R5cGVzLmV4cHJlc3Npb24udGV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3ltYm9sKSB7XG4gICAgICAgICAgICBpZiAoc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBqc2RvY3RhZ3MgPSB0aGlzLmpzZG9jUGFyc2VyVXRpbC5nZXRKU0RvY3Moc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbWVtYmVycyA9IHRoaXMudmlzaXRNZW1iZXJzKGNsYXNzRGVjbGFyYXRpb24ubWVtYmVycywgc291cmNlRmlsZSk7XG5cbiAgICAgICAgaWYgKGNsYXNzRGVjbGFyYXRpb24uZGVjb3JhdG9ycykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc0RlY2xhcmF0aW9uLmRlY29yYXRvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0RpcmVjdGl2ZURlY29yYXRvcihjbGFzc0RlY2xhcmF0aW9uLmRlY29yYXRvcnNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhd2Rlc2NyaXB0aW9uOiByYXdkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0czogbWVtYmVycy5pbnB1dHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRzOiBtZW1iZXJzLm91dHB1dHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBob3N0QmluZGluZ3M6IG1lbWJlcnMuaG9zdEJpbmRpbmdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgaG9zdExpc3RlbmVyczogbWVtYmVycy5ob3N0TGlzdGVuZXJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogbWVtYmVycy5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kczogbWVtYmVycy5tZXRob2RzLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhTaWduYXR1cmVzOiBtZW1iZXJzLmluZGV4U2lnbmF0dXJlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGtpbmQ6IG1lbWJlcnMua2luZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yOiBtZW1iZXJzLmNvbnN0cnVjdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAganNkb2N0YWdzOiBqc2RvY3RhZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBleHRlbmRzOiBleHRlbmRzRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcGxlbWVudHM6IGltcGxlbWVudHNFbGVtZW50cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc29yczogbWVtYmVycy5hY2Nlc3NvcnNcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNTZXJ2aWNlRGVjb3JhdG9yKGNsYXNzRGVjbGFyYXRpb24uZGVjb3JhdG9yc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF3ZGVzY3JpcHRpb246IHJhd2Rlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZHM6IG1lbWJlcnMubWV0aG9kcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleFNpZ25hdHVyZXM6IG1lbWJlcnMuaW5kZXhTaWduYXR1cmVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IG1lbWJlcnMucHJvcGVydGllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBraW5kOiBtZW1iZXJzLmtpbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0b3I6IG1lbWJlcnMuY29uc3RydWN0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNkb2N0YWdzOiBqc2RvY3RhZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5kczogZXh0ZW5kc0VsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wbGVtZW50czogaW1wbGVtZW50c0VsZW1lbnRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc29yczogbWVtYmVycy5hY2Nlc3NvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNQaXBlRGVjb3JhdG9yKGNsYXNzRGVjbGFyYXRpb24uZGVjb3JhdG9yc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF3ZGVzY3JpcHRpb246IHJhd2Rlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzZG9jdGFnczoganNkb2N0YWdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IG1lbWJlcnMucHJvcGVydGllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2RzOiBtZW1iZXJzLm1ldGhvZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNNb2R1bGVEZWNvcmF0b3IoY2xhc3NEZWNsYXJhdGlvbi5kZWNvcmF0b3JzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXdkZXNjcmlwdGlvbjogcmF3ZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNkb2N0YWdzOiBqc2RvY3RhZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kczogbWVtYmVycy5tZXRob2RzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXdkZXNjcmlwdGlvbjogcmF3ZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kczogbWVtYmVycy5tZXRob2RzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4U2lnbmF0dXJlczogbWVtYmVycy5pbmRleFNpZ25hdHVyZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogbWVtYmVycy5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtpbmQ6IG1lbWJlcnMua2luZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvcjogbWVtYmVycy5jb25zdHJ1Y3RvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2RvY3RhZ3M6IGpzZG9jdGFncyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRlbmRzOiBleHRlbmRzRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBsZW1lbnRzOiBpbXBsZW1lbnRzRWxlbWVudHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzb3JzOiBtZW1iZXJzLmFjY2Vzc29yc1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICByYXdkZXNjcmlwdGlvbjogcmF3ZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgIGlucHV0czogbWVtYmVycy5pbnB1dHMsXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IG1lbWJlcnMub3V0cHV0cyxcbiAgICAgICAgICAgICAgICAgICAgaG9zdEJpbmRpbmdzOiBtZW1iZXJzLmhvc3RCaW5kaW5ncyxcbiAgICAgICAgICAgICAgICAgICAgaG9zdExpc3RlbmVyczogbWVtYmVycy5ob3N0TGlzdGVuZXJzLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2RzOiBtZW1iZXJzLm1ldGhvZHMsXG4gICAgICAgICAgICAgICAgICAgIGluZGV4U2lnbmF0dXJlczogbWVtYmVycy5pbmRleFNpZ25hdHVyZXMsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IG1lbWJlcnMucHJvcGVydGllcyxcbiAgICAgICAgICAgICAgICAgICAga2luZDogbWVtYmVycy5raW5kLFxuICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvcjogbWVtYmVycy5jb25zdHJ1Y3RvcixcbiAgICAgICAgICAgICAgICAgICAganNkb2N0YWdzOiBqc2RvY3RhZ3MsXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuZHM6IGV4dGVuZHNFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICBpbXBsZW1lbnRzOiBpbXBsZW1lbnRzRWxlbWVudHMsXG4gICAgICAgICAgICAgICAgICAgIGFjY2Vzc29yczogbWVtYmVycy5hY2Nlc3NvcnNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZHM6IG1lbWJlcnMubWV0aG9kcyxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBtZW1iZXJzLmlucHV0cyxcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0czogbWVtYmVycy5vdXRwdXRzLFxuICAgICAgICAgICAgICAgICAgICBob3N0QmluZGluZ3M6IG1lbWJlcnMuaG9zdEJpbmRpbmdzLFxuICAgICAgICAgICAgICAgICAgICBob3N0TGlzdGVuZXJzOiBtZW1iZXJzLmhvc3RMaXN0ZW5lcnMsXG4gICAgICAgICAgICAgICAgICAgIGluZGV4U2lnbmF0dXJlczogbWVtYmVycy5pbmRleFNpZ25hdHVyZXMsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IG1lbWJlcnMucHJvcGVydGllcyxcbiAgICAgICAgICAgICAgICAgICAga2luZDogbWVtYmVycy5raW5kLFxuICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvcjogbWVtYmVycy5jb25zdHJ1Y3RvcixcbiAgICAgICAgICAgICAgICAgICAganNkb2N0YWdzOiBqc2RvY3RhZ3MsXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuZHM6IGV4dGVuZHNFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICBpbXBsZW1lbnRzOiBpbXBsZW1lbnRzRWxlbWVudHMsXG4gICAgICAgICAgICAgICAgICAgIGFjY2Vzc29yczogbWVtYmVycy5hY2Nlc3NvcnNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHByaXZhdGUgdmlzaXRNZW1iZXJzKG1lbWJlcnMsIHNvdXJjZUZpbGUpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvcHlyaWdodCBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcFxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IGlucHV0cyA9IFtdO1xuICAgICAgICBsZXQgb3V0cHV0cyA9IFtdO1xuICAgICAgICBsZXQgaG9zdEJpbmRpbmdzID0gW107XG4gICAgICAgIGxldCBob3N0TGlzdGVuZXJzID0gW107XG4gICAgICAgIGxldCBtZXRob2RzID0gW107XG4gICAgICAgIGxldCBwcm9wZXJ0aWVzID0gW107XG4gICAgICAgIGxldCBpbmRleFNpZ25hdHVyZXMgPSBbXTtcbiAgICAgICAgbGV0IGtpbmQ7XG4gICAgICAgIGxldCBpbnB1dERlY29yYXRvcjtcbiAgICAgICAgbGV0IGhvc3RCaW5kaW5nO1xuICAgICAgICBsZXQgaG9zdExpc3RlbmVyO1xuICAgICAgICBsZXQgY29uc3RydWN0b3I7XG4gICAgICAgIGxldCBvdXREZWNvcmF0b3I7XG4gICAgICAgIGxldCBhY2Nlc3NvcnMgPSB7fTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVtYmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gQWxsb3dzIHR5cGVzY3JpcHQgZ3Vlc3MgdHlwZSB3aGVuIHVzaW5nIHRzLmlzKlxuICAgICAgICAgICAgbGV0IG1lbWJlciA9IG1lbWJlcnNbaV07XG5cbiAgICAgICAgICAgIGlucHV0RGVjb3JhdG9yID0gdGhpcy5nZXREZWNvcmF0b3JPZlR5cGUobWVtYmVyLCAnSW5wdXQnKTtcbiAgICAgICAgICAgIG91dERlY29yYXRvciA9IHRoaXMuZ2V0RGVjb3JhdG9yT2ZUeXBlKG1lbWJlciwgJ091dHB1dCcpO1xuICAgICAgICAgICAgaG9zdEJpbmRpbmcgPSB0aGlzLmdldERlY29yYXRvck9mVHlwZShtZW1iZXIsICdIb3N0QmluZGluZycpO1xuICAgICAgICAgICAgaG9zdExpc3RlbmVyID0gdGhpcy5nZXREZWNvcmF0b3JPZlR5cGUobWVtYmVyLCAnSG9zdExpc3RlbmVyJyk7XG5cbiAgICAgICAgICAgIGtpbmQgPSBtZW1iZXIua2luZDtcblxuICAgICAgICAgICAgaWYgKGlzSWdub3JlKG1lbWJlcikpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlucHV0RGVjb3JhdG9yKSB7XG4gICAgICAgICAgICAgICAgaW5wdXRzLnB1c2godGhpcy52aXNpdElucHV0QW5kSG9zdEJpbmRpbmcobWVtYmVyLCBpbnB1dERlY29yYXRvciwgc291cmNlRmlsZSkpO1xuICAgICAgICAgICAgICAgIGlmICh0cy5pc1NldEFjY2Vzc29yRGVjbGFyYXRpb24obWVtYmVyKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEFjY2Vzc29yKGFjY2Vzc29ycywgbWVtYmVyc1tpXSwgc291cmNlRmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChvdXREZWNvcmF0b3IpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRzLnB1c2godGhpcy52aXNpdE91dHB1dChtZW1iZXIsIG91dERlY29yYXRvciwgc291cmNlRmlsZSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChob3N0QmluZGluZykge1xuICAgICAgICAgICAgICAgIGhvc3RCaW5kaW5ncy5wdXNoKHRoaXMudmlzaXRJbnB1dEFuZEhvc3RCaW5kaW5nKG1lbWJlciwgaG9zdEJpbmRpbmcsIHNvdXJjZUZpbGUpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaG9zdExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgaG9zdExpc3RlbmVycy5wdXNoKHRoaXMudmlzaXRIb3N0TGlzdGVuZXIobWVtYmVyLCBob3N0TGlzdGVuZXIsIHNvdXJjZUZpbGUpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNIaWRkZW5NZW1iZXIobWVtYmVyKSkge1xuICAgICAgICAgICAgICAgIGlmICghKHRoaXMuaXNQcml2YXRlKG1lbWJlcikgJiYgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlUHJpdmF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodGhpcy5pc0ludGVybmFsKG1lbWJlcikgJiYgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlSW50ZXJuYWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgISh0aGlzLmlzUHJvdGVjdGVkKG1lbWJlcikgJiYgQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlUHJvdGVjdGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRzLmlzTWV0aG9kRGVjbGFyYXRpb24obWVtYmVyKSB8fCB0cy5pc01ldGhvZFNpZ25hdHVyZShtZW1iZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZHMucHVzaCh0aGlzLnZpc2l0TWV0aG9kRGVjbGFyYXRpb24obWVtYmVyLCBzb3VyY2VGaWxlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHMuaXNQcm9wZXJ0eURlY2xhcmF0aW9uKG1lbWJlcikgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHMuaXNQcm9wZXJ0eVNpZ25hdHVyZShtZW1iZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh0aGlzLnZpc2l0UHJvcGVydHkobWVtYmVyLCBzb3VyY2VGaWxlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0cy5pc0NhbGxTaWduYXR1cmVEZWNsYXJhdGlvbihtZW1iZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh0aGlzLnZpc2l0Q2FsbERlY2xhcmF0aW9uKG1lbWJlciwgc291cmNlRmlsZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRzLmlzR2V0QWNjZXNzb3JEZWNsYXJhdGlvbihtZW1iZXIpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRzLmlzU2V0QWNjZXNzb3JEZWNsYXJhdGlvbihtZW1iZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQWNjZXNzb3IoYWNjZXNzb3JzLCBtZW1iZXJzW2ldLCBzb3VyY2VGaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRzLmlzSW5kZXhTaWduYXR1cmVEZWNsYXJhdGlvbihtZW1iZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4U2lnbmF0dXJlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aXNpdEluZGV4RGVjbGFyYXRpb24obWVtYmVyLCBzb3VyY2VGaWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHMuaXNDb25zdHJ1Y3RvckRlY2xhcmF0aW9uKG1lbWJlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IF9jb25zdHJ1Y3RvclByb3BlcnRpZXMgPSB0aGlzLnZpc2l0Q29uc3RydWN0b3JQcm9wZXJ0aWVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsZW4gPSBfY29uc3RydWN0b3JQcm9wZXJ0aWVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaChfY29uc3RydWN0b3JQcm9wZXJ0aWVzW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvciA9IHRoaXMudmlzaXRDb25zdHJ1Y3RvckRlY2xhcmF0aW9uKG1lbWJlciwgc291cmNlRmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW5wdXRzLnNvcnQoZ2V0TmFtZXNDb21wYXJlRm4oKSk7XG4gICAgICAgIG91dHB1dHMuc29ydChnZXROYW1lc0NvbXBhcmVGbigpKTtcbiAgICAgICAgaG9zdEJpbmRpbmdzLnNvcnQoZ2V0TmFtZXNDb21wYXJlRm4oKSk7XG4gICAgICAgIGhvc3RMaXN0ZW5lcnMuc29ydChnZXROYW1lc0NvbXBhcmVGbigpKTtcbiAgICAgICAgcHJvcGVydGllcy5zb3J0KGdldE5hbWVzQ29tcGFyZUZuKCkpO1xuICAgICAgICBtZXRob2RzLnNvcnQoZ2V0TmFtZXNDb21wYXJlRm4oKSk7XG4gICAgICAgIGluZGV4U2lnbmF0dXJlcy5zb3J0KGdldE5hbWVzQ29tcGFyZUZuKCkpO1xuXG4gICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIGlucHV0cyxcbiAgICAgICAgICAgIG91dHB1dHMsXG4gICAgICAgICAgICBob3N0QmluZGluZ3MsXG4gICAgICAgICAgICBob3N0TGlzdGVuZXJzLFxuICAgICAgICAgICAgbWV0aG9kcyxcbiAgICAgICAgICAgIHByb3BlcnRpZXMsXG4gICAgICAgICAgICBpbmRleFNpZ25hdHVyZXMsXG4gICAgICAgICAgICBraW5kLFxuICAgICAgICAgICAgY29uc3RydWN0b3JcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMoYWNjZXNzb3JzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlc3VsdFsnYWNjZXNzb3JzJ10gPSBhY2Nlc3NvcnM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgdmlzaXRUeXBlTmFtZSh0eXBlTmFtZTogdHMuSWRlbnRpZmllcikge1xuICAgICAgICBpZiAodHlwZU5hbWUudGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVOYW1lLnRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGAke3RoaXMudmlzaXRUeXBlTmFtZSh0eXBlTmFtZS5sZWZ0KX0uJHt0aGlzLnZpc2l0VHlwZU5hbWUodHlwZU5hbWUucmlnaHQpfWA7XG4gICAgfVxuXG4gICAgcHVibGljIHZpc2l0VHlwZShub2RlKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IF9yZXR1cm4gPSAndm9pZCc7XG5cbiAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gX3JldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub2RlLnR5cGVOYW1lKSB7XG4gICAgICAgICAgICBfcmV0dXJuID0gdGhpcy52aXNpdFR5cGVOYW1lKG5vZGUudHlwZU5hbWUpO1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSkge1xuICAgICAgICAgICAgaWYgKG5vZGUudHlwZS5raW5kKSB7XG4gICAgICAgICAgICAgICAgX3JldHVybiA9IGtpbmRUb1R5cGUobm9kZS50eXBlLmtpbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUudHlwZS50eXBlTmFtZSkge1xuICAgICAgICAgICAgICAgIF9yZXR1cm4gPSB0aGlzLnZpc2l0VHlwZU5hbWUobm9kZS50eXBlLnR5cGVOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnR5cGUudHlwZUFyZ3VtZW50cykge1xuICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0gJzwnO1xuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVBcmd1bWVudHMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGFyZ3VtZW50IG9mIG5vZGUudHlwZS50eXBlQXJndW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGVBcmd1bWVudHMucHVzaCh0aGlzLnZpc2l0VHlwZShhcmd1bWVudCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfcmV0dXJuICs9IHR5cGVBcmd1bWVudHMuam9pbignIHwgJyk7XG4gICAgICAgICAgICAgICAgX3JldHVybiArPSAnPic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS50eXBlLmVsZW1lbnRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgX2ZpcnN0UGFydCA9IHRoaXMudmlzaXRUeXBlKG5vZGUudHlwZS5lbGVtZW50VHlwZSk7XG4gICAgICAgICAgICAgICAgX3JldHVybiA9IF9maXJzdFBhcnQgKyBraW5kVG9UeXBlKG5vZGUudHlwZS5raW5kKTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS50eXBlLmVsZW1lbnRUeXBlLmtpbmQgPT09IFN5bnRheEtpbmQuUGFyZW50aGVzaXplZFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3JldHVybiA9ICcoJyArIF9maXJzdFBhcnQgKyAnKScgKyBraW5kVG9UeXBlKG5vZGUudHlwZS5raW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS50eXBlLnR5cGVzICYmIHRzLmlzVW5pb25UeXBlTm9kZShub2RlLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgX3JldHVybiA9ICcnO1xuICAgICAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgICAgICBsZXQgbGVuID0gbm9kZS50eXBlLnR5cGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IG5vZGUudHlwZS50eXBlc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS5lbGVtZW50VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX2ZpcnN0UGFydCA9IHRoaXMudmlzaXRUeXBlKHR5cGUuZWxlbWVudFR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUuZWxlbWVudFR5cGUua2luZCA9PT0gU3ludGF4S2luZC5QYXJlbnRoZXNpemVkVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0gJygnICsgX2ZpcnN0UGFydCArICcpJyArIGtpbmRUb1R5cGUodHlwZS5raW5kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JldHVybiArPSBfZmlyc3RQYXJ0ICsga2luZFRvVHlwZSh0eXBlLmtpbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3JldHVybiArPSBraW5kVG9UeXBlKHR5cGUua2luZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHMuaXNMaXRlcmFsVHlwZU5vZGUodHlwZSkgJiYgdHlwZS5saXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JldHVybiArPSAnXCInICsgdHlwZS5saXRlcmFsLnRleHQgKyAnXCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUudHlwZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmV0dXJuICs9IHRoaXMudmlzaXRUeXBlTmFtZSh0eXBlLnR5cGVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlLnR5cGVBcmd1bWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmV0dXJuICs9ICc8JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlQXJndW1lbnRzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBhcmd1bWVudCBvZiB0eXBlLnR5cGVBcmd1bWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZUFyZ3VtZW50cy5wdXNoKHRoaXMudmlzaXRUeXBlKGFyZ3VtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0gdHlwZUFyZ3VtZW50cy5qb2luKCcgfCAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmV0dXJuICs9ICc+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IGxlbiAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0gJyB8ICc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS50eXBlLmVsZW1lbnRUeXBlcykge1xuICAgICAgICAgICAgICAgIGxldCBlbGVtZW50VHlwZXMgPSBub2RlLnR5cGUuZWxlbWVudFR5cGVzO1xuICAgICAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgICAgICBsZXQgbGVuID0gZWxlbWVudFR5cGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBfcmV0dXJuID0gJ1snO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBlbGVtZW50VHlwZXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmV0dXJuICs9IGtpbmRUb1R5cGUodHlwZS5raW5kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cy5pc0xpdGVyYWxUeXBlTm9kZSh0eXBlKSAmJiB0eXBlLmxpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmV0dXJuICs9ICdcIicgKyB0eXBlLmxpdGVyYWwudGV4dCArICdcIic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS50eXBlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0gdGhpcy52aXNpdFR5cGVOYW1lKHR5cGUudHlwZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCBsZW4gLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JldHVybiArPSAnLCAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0gJ10nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChub2RlLmVsZW1lbnRUeXBlKSB7XG4gICAgICAgICAgICBfcmV0dXJuID0ga2luZFRvVHlwZShub2RlLmVsZW1lbnRUeXBlLmtpbmQpICsga2luZFRvVHlwZShub2RlLmtpbmQpO1xuICAgICAgICAgICAgaWYgKG5vZGUuZWxlbWVudFR5cGUudHlwZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBfcmV0dXJuID0gdGhpcy52aXNpdFR5cGVOYW1lKG5vZGUuZWxlbWVudFR5cGUudHlwZU5hbWUpICsga2luZFRvVHlwZShub2RlLmtpbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUudHlwZXMgJiYgdHMuaXNVbmlvblR5cGVOb2RlKG5vZGUpKSB7XG4gICAgICAgICAgICBfcmV0dXJuID0gJyc7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gbm9kZS50eXBlcy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gbm9kZS50eXBlc1tpXTtcbiAgICAgICAgICAgICAgICBfcmV0dXJuICs9IGtpbmRUb1R5cGUodHlwZS5raW5kKTtcbiAgICAgICAgICAgICAgICBpZiAodHMuaXNMaXRlcmFsVHlwZU5vZGUodHlwZSkgJiYgdHlwZS5saXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0gJ1wiJyArIHR5cGUubGl0ZXJhbC50ZXh0ICsgJ1wiJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUudHlwZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3JldHVybiArPSB0aGlzLnZpc2l0VHlwZU5hbWUodHlwZS50eXBlTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpIDwgbGVuIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBfcmV0dXJuICs9ICcgfCAnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChub2RlLmRvdERvdERvdFRva2VuKSB7XG4gICAgICAgICAgICBfcmV0dXJuID0gJ2FueVtdJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXR1cm4gPSBraW5kVG9UeXBlKG5vZGUua2luZCk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgX3JldHVybiA9PT0gJycgJiZcbiAgICAgICAgICAgICAgICBub2RlLmluaXRpYWxpemVyICYmXG4gICAgICAgICAgICAgICAgbm9kZS5pbml0aWFsaXplci5raW5kICYmXG4gICAgICAgICAgICAgICAgKG5vZGUua2luZCA9PT0gU3ludGF4S2luZC5Qcm9wZXJ0eURlY2xhcmF0aW9uIHx8IG5vZGUua2luZCA9PT0gU3ludGF4S2luZC5QYXJhbWV0ZXIpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBfcmV0dXJuID0ga2luZFRvVHlwZShub2RlLmluaXRpYWxpemVyLmtpbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUua2luZCA9PT0gU3ludGF4S2luZC5UeXBlUGFyYW1ldGVyKSB7XG4gICAgICAgICAgICAgICAgX3JldHVybiA9IG5vZGUubmFtZS50ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUua2luZCA9PT0gU3ludGF4S2luZC5MaXRlcmFsVHlwZSkge1xuICAgICAgICAgICAgICAgIF9yZXR1cm4gPSBub2RlLmxpdGVyYWwudGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS50eXBlQXJndW1lbnRzICYmIG5vZGUudHlwZUFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBfcmV0dXJuICs9ICc8JztcbiAgICAgICAgICAgIGxldCBpID0gMCxcbiAgICAgICAgICAgICAgICBsZW4gPSBub2RlLnR5cGVBcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgYXJndW1lbnQgPSBub2RlLnR5cGVBcmd1bWVudHNbaV07XG4gICAgICAgICAgICAgICAgX3JldHVybiArPSB0aGlzLnZpc2l0VHlwZShhcmd1bWVudCk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPj0gMCAmJiBpIDwgbGVuIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBfcmV0dXJuICs9ICcsICc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3JldHVybiArPSAnPic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXR1cm47XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdENhbGxEZWNsYXJhdGlvbihtZXRob2Q6IHRzLkNhbGxTaWduYXR1cmVEZWNsYXJhdGlvbiwgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSkge1xuICAgICAgICBsZXQgc291cmNlQ29kZSA9IHNvdXJjZUZpbGUuZ2V0VGV4dCgpO1xuICAgICAgICBsZXQgaGFzaCA9IGNyeXB0b1xuICAgICAgICAgICAgLmNyZWF0ZUhhc2goJ21kNScpXG4gICAgICAgICAgICAudXBkYXRlKHNvdXJjZUNvZGUpXG4gICAgICAgICAgICAuZGlnZXN0KCdoZXgnKTtcbiAgICAgICAgbGV0IHJlc3VsdDogYW55ID0ge1xuICAgICAgICAgICAgaWQ6ICdjYWxsLWRlY2xhcmF0aW9uLScgKyBoYXNoLFxuICAgICAgICAgICAgYXJnczogbWV0aG9kLnBhcmFtZXRlcnMgPyBtZXRob2QucGFyYW1ldGVycy5tYXAocHJvcCA9PiB0aGlzLnZpc2l0QXJndW1lbnQocHJvcCkpIDogW10sXG4gICAgICAgICAgICByZXR1cm5UeXBlOiB0aGlzLnZpc2l0VHlwZShtZXRob2QudHlwZSksXG4gICAgICAgICAgICBsaW5lOiB0aGlzLmdldFBvc2l0aW9uKG1ldGhvZCwgc291cmNlRmlsZSkubGluZSArIDFcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKG1ldGhvZC5qc0RvYykge1xuICAgICAgICAgICAgcmVzdWx0LmRlc2NyaXB0aW9uID0gbWFya2VkKG1hcmtlZCh0aGlzLmpzZG9jUGFyc2VyVXRpbC5nZXRNYWluQ29tbWVudE9mTm9kZShtZXRob2QpKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGpzZG9jdGFncyA9IHRoaXMuanNkb2NQYXJzZXJVdGlsLmdldEpTRG9jcyhtZXRob2QpO1xuICAgICAgICBpZiAoanNkb2N0YWdzICYmIGpzZG9jdGFncy5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgaWYgKGpzZG9jdGFnc1swXS50YWdzKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmpzZG9jdGFncyA9IG1hcmtlZHRhZ3MoanNkb2N0YWdzWzBdLnRhZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdEluZGV4RGVjbGFyYXRpb24oXG4gICAgICAgIG1ldGhvZDogdHMuSW5kZXhTaWduYXR1cmVEZWNsYXJhdGlvbixcbiAgICAgICAgc291cmNlRmlsZT86IHRzLlNvdXJjZUZpbGVcbiAgICApIHtcbiAgICAgICAgbGV0IHNvdXJjZUNvZGUgPSBzb3VyY2VGaWxlLmdldFRleHQoKTtcbiAgICAgICAgbGV0IGhhc2ggPSBjcnlwdG9cbiAgICAgICAgICAgIC5jcmVhdGVIYXNoKCdtZDUnKVxuICAgICAgICAgICAgLnVwZGF0ZShzb3VyY2VDb2RlKVxuICAgICAgICAgICAgLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICAgICBpZDogJ2luZGV4LWRlY2xhcmF0aW9uLScgKyBoYXNoLFxuICAgICAgICAgICAgYXJnczogbWV0aG9kLnBhcmFtZXRlcnMgPyBtZXRob2QucGFyYW1ldGVycy5tYXAocHJvcCA9PiB0aGlzLnZpc2l0QXJndW1lbnQocHJvcCkpIDogW10sXG4gICAgICAgICAgICByZXR1cm5UeXBlOiB0aGlzLnZpc2l0VHlwZShtZXRob2QudHlwZSksXG4gICAgICAgICAgICBsaW5lOiB0aGlzLmdldFBvc2l0aW9uKG1ldGhvZCwgc291cmNlRmlsZSkubGluZSArIDFcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKG1ldGhvZC5qc0RvYykge1xuICAgICAgICAgICAgcmVzdWx0LmRlc2NyaXB0aW9uID0gbWFya2VkKHRoaXMuanNkb2NQYXJzZXJVdGlsLmdldE1haW5Db21tZW50T2ZOb2RlKG1ldGhvZCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdENvbnN0cnVjdG9yRGVjbGFyYXRpb24oXG4gICAgICAgIG1ldGhvZDogdHMuQ29uc3RydWN0b3JEZWNsYXJhdGlvbixcbiAgICAgICAgc291cmNlRmlsZT86IHRzLlNvdXJjZUZpbGVcbiAgICApIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvcHlyaWdodCBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcFxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IHJlc3VsdDogYW55ID0ge1xuICAgICAgICAgICAgbmFtZTogJ2NvbnN0cnVjdG9yJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgICAgIGFyZ3M6IG1ldGhvZC5wYXJhbWV0ZXJzID8gbWV0aG9kLnBhcmFtZXRlcnMubWFwKHByb3AgPT4gdGhpcy52aXNpdEFyZ3VtZW50KHByb3ApKSA6IFtdLFxuICAgICAgICAgICAgbGluZTogdGhpcy5nZXRQb3NpdGlvbihtZXRob2QsIHNvdXJjZUZpbGUpLmxpbmUgKyAxXG4gICAgICAgIH07XG4gICAgICAgIGxldCBqc2RvY3RhZ3MgPSB0aGlzLmpzZG9jUGFyc2VyVXRpbC5nZXRKU0RvY3MobWV0aG9kKTtcblxuICAgICAgICBpZiAobWV0aG9kLmpzRG9jKSB7XG4gICAgICAgICAgICByZXN1bHQuZGVzY3JpcHRpb24gPSBtYXJrZWQodGhpcy5qc2RvY1BhcnNlclV0aWwuZ2V0TWFpbkNvbW1lbnRPZk5vZGUobWV0aG9kKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWV0aG9kLm1vZGlmaWVycykge1xuICAgICAgICAgICAgaWYgKG1ldGhvZC5tb2RpZmllcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCBraW5kcyA9IG1ldGhvZC5tb2RpZmllcnMubWFwKG1vZGlmaWVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vZGlmaWVyLmtpbmQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBfLmluZGV4T2Yoa2luZHMsIFN5bnRheEtpbmQuUHVibGljS2V5d29yZCkgIT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgIF8uaW5kZXhPZihraW5kcywgU3ludGF4S2luZC5TdGF0aWNLZXl3b3JkKSAhPT0gLTFcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAga2luZHMgPSBraW5kcy5maWx0ZXIoa2luZCA9PiBraW5kICE9PSBTeW50YXhLaW5kLlB1YmxpY0tleXdvcmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHQubW9kaWZpZXJLaW5kID0ga2luZHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGpzZG9jdGFncyAmJiBqc2RvY3RhZ3MubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgIGlmIChqc2RvY3RhZ3NbMF0udGFncykge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5qc2RvY3RhZ3MgPSBtYXJrZWR0YWdzKGpzZG9jdGFnc1swXS50YWdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0LmpzZG9jdGFncyAmJiByZXN1bHQuanNkb2N0YWdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJlc3VsdC5qc2RvY3RhZ3MgPSBtZXJnZVRhZ3NBbmRBcmdzKHJlc3VsdC5hcmdzLCByZXN1bHQuanNkb2N0YWdzKTtcbiAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXN1bHQuanNkb2N0YWdzID0gbWVyZ2VUYWdzQW5kQXJncyhyZXN1bHQuYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZpc2l0UHJvcGVydHkocHJvcGVydHk6IHRzLlByb3BlcnR5RGVjbGFyYXRpb24sIHNvdXJjZUZpbGUpIHtcbiAgICAgICAgbGV0IHJlc3VsdDogYW55ID0ge1xuICAgICAgICAgICAgbmFtZTogcHJvcGVydHkubmFtZS50ZXh0LFxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiBwcm9wZXJ0eS5pbml0aWFsaXplclxuICAgICAgICAgICAgICAgID8gdGhpcy5zdHJpbmdpZnlEZWZhdWx0VmFsdWUocHJvcGVydHkuaW5pdGlhbGl6ZXIpXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0eXBlOiB0aGlzLnZpc2l0VHlwZShwcm9wZXJ0eSksXG4gICAgICAgICAgICBvcHRpb25hbDogdHlwZW9mIHByb3BlcnR5LnF1ZXN0aW9uVG9rZW4gIT09ICd1bmRlZmluZWQnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgbGluZTogdGhpcy5nZXRQb3NpdGlvbihwcm9wZXJ0eSwgc291cmNlRmlsZSkubGluZSArIDFcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGpzZG9jdGFncztcblxuICAgICAgICBpZiAocHJvcGVydHkuaW5pdGlhbGl6ZXIgJiYgcHJvcGVydHkuaW5pdGlhbGl6ZXIua2luZCA9PT0gU3ludGF4S2luZC5BcnJvd0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICByZXN1bHQuZGVmYXVsdFZhbHVlID0gJygpID0+IHsuLi59JztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0Lm5hbWUgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwcm9wZXJ0eS5uYW1lLmV4cHJlc3Npb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXN1bHQubmFtZSA9IHByb3BlcnR5Lm5hbWUuZXhwcmVzc2lvbi50ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BlcnR5LmpzRG9jKSB7XG4gICAgICAgICAgICBqc2RvY3RhZ3MgPSB0aGlzLmpzZG9jUGFyc2VyVXRpbC5nZXRKU0RvY3MocHJvcGVydHkpO1xuICAgICAgICAgICAgcmVzdWx0LmRlc2NyaXB0aW9uID0gbWFya2VkKHRoaXMuanNkb2NQYXJzZXJVdGlsLmdldE1haW5Db21tZW50T2ZOb2RlKHByb3BlcnR5KSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcGVydHkuZGVjb3JhdG9ycykge1xuICAgICAgICAgICAgcmVzdWx0LmRlY29yYXRvcnMgPSB0aGlzLmZvcm1hdERlY29yYXRvcnMocHJvcGVydHkuZGVjb3JhdG9ycyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcGVydHkubW9kaWZpZXJzKSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydHkubW9kaWZpZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQga2luZHMgPSBwcm9wZXJ0eS5tb2RpZmllcnMubWFwKG1vZGlmaWVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vZGlmaWVyLmtpbmQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBfLmluZGV4T2Yoa2luZHMsIFN5bnRheEtpbmQuUHVibGljS2V5d29yZCkgIT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgIF8uaW5kZXhPZihraW5kcywgU3ludGF4S2luZC5TdGF0aWNLZXl3b3JkKSAhPT0gLTFcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAga2luZHMgPSBraW5kcy5maWx0ZXIoa2luZCA9PiBraW5kICE9PSBTeW50YXhLaW5kLlB1YmxpY0tleXdvcmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHQubW9kaWZpZXJLaW5kID0ga2luZHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGpzZG9jdGFncyAmJiBqc2RvY3RhZ3MubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgIGlmIChqc2RvY3RhZ3NbMF0udGFncykge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5qc2RvY3RhZ3MgPSBtYXJrZWR0YWdzKGpzZG9jdGFnc1swXS50YWdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdENvbnN0cnVjdG9yUHJvcGVydGllcyhjb25zdHIsIHNvdXJjZUZpbGUpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICBpZiAoY29uc3RyLnBhcmFtZXRlcnMpIHtcbiAgICAgICAgICAgIGxldCBfcGFyYW1ldGVycyA9IFtdO1xuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgbGV0IGxlbiA9IGNvbnN0ci5wYXJhbWV0ZXJzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNQdWJsaWMoY29uc3RyLnBhcmFtZXRlcnNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIF9wYXJhbWV0ZXJzLnB1c2godGhpcy52aXNpdFByb3BlcnR5KGNvbnN0ci5wYXJhbWV0ZXJzW2ldLCBzb3VyY2VGaWxlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNZXJnZSBKU0RvYyB0YWdzIGRlc2NyaXB0aW9uIGZyb20gY29uc3RydWN0b3Igd2l0aCBwYXJhbWV0ZXJzXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChjb25zdHIuanNEb2MpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29uc3RyLmpzRG9jLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnN0clRhZ3MgPSBjb25zdHIuanNEb2NbMF0udGFncztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnN0clRhZ3MgJiYgY29uc3RyVGFncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJUYWdzLmZvckVhY2godGFnID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcGFyYW1ldGVycy5mb3JFYWNoKHBhcmFtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnLnRhZ05hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZy50YWdOYW1lLmVzY2FwZWRUZXh0ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWcudGFnTmFtZS5lc2NhcGVkVGV4dCA9PT0gJ3BhcmFtJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWcubmFtZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZy5uYW1lLmVzY2FwZWRUZXh0ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnLm5hbWUuZXNjYXBlZFRleHQgPT09IHBhcmFtLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtLmRlc2NyaXB0aW9uID0gdGFnLmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF9wYXJhbWV0ZXJzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdElucHV0QW5kSG9zdEJpbmRpbmcocHJvcGVydHksIGluRGVjb3JhdG9yLCBzb3VyY2VGaWxlPykge1xuICAgICAgICBsZXQgaW5BcmdzID0gaW5EZWNvcmF0b3IuZXhwcmVzc2lvbi5hcmd1bWVudHM7XG4gICAgICAgIGxldCBfcmV0dXJuOiBhbnkgPSB7fTtcbiAgICAgICAgX3JldHVybi5uYW1lID0gaW5BcmdzLmxlbmd0aCA+IDAgPyBpbkFyZ3NbMF0udGV4dCA6IHByb3BlcnR5Lm5hbWUudGV4dDtcbiAgICAgICAgX3JldHVybi5kZWZhdWx0VmFsdWUgPSBwcm9wZXJ0eS5pbml0aWFsaXplclxuICAgICAgICAgICAgPyB0aGlzLnN0cmluZ2lmeURlZmF1bHRWYWx1ZShwcm9wZXJ0eS5pbml0aWFsaXplcilcbiAgICAgICAgICAgIDogdW5kZWZpbmVkO1xuICAgICAgICBpZiAoIV9yZXR1cm4uZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5qc0RvYykge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5qc0RvYy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHkuanNEb2NbMF0uY29tbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZXR1cm4uZGVzY3JpcHRpb24gPSBtYXJrZWQocHJvcGVydHkuanNEb2NbMF0uY29tbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX3JldHVybi5saW5lID0gdGhpcy5nZXRQb3NpdGlvbihwcm9wZXJ0eSwgc291cmNlRmlsZSkubGluZSArIDE7XG4gICAgICAgIGlmIChwcm9wZXJ0eS50eXBlKSB7XG4gICAgICAgICAgICBfcmV0dXJuLnR5cGUgPSB0aGlzLnZpc2l0VHlwZShwcm9wZXJ0eSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBoYW5kbGUgTmV3RXhwcmVzc2lvblxuICAgICAgICAgICAgaWYgKHByb3BlcnR5LmluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRzLmlzTmV3RXhwcmVzc2lvbihwcm9wZXJ0eS5pbml0aWFsaXplcikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5LmluaXRpYWxpemVyLmV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZXR1cm4udHlwZSA9IHByb3BlcnR5LmluaXRpYWxpemVyLmV4cHJlc3Npb24udGV4dDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcGVydHkua2luZCA9PT0gU3ludGF4S2luZC5TZXRBY2Nlc3Nvcikge1xuICAgICAgICAgICAgLy8gRm9yIHNldHRlciBhY2Nlc3NvciwgZmluZCB0eXBlIGluIGZpcnN0IHBhcmFtZXRlclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5LnBhcmFtZXRlcnMgJiYgcHJvcGVydHkucGFyYW1ldGVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkucGFyYW1ldGVyc1swXS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIF9yZXR1cm4udHlwZSA9IGtpbmRUb1R5cGUocHJvcGVydHkucGFyYW1ldGVyc1swXS50eXBlLmtpbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3JldHVybjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZpc2l0TWV0aG9kRGVjbGFyYXRpb24obWV0aG9kOiB0cy5NZXRob2REZWNsYXJhdGlvbiwgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSkge1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnkgPSB7XG4gICAgICAgICAgICBuYW1lOiBtZXRob2QubmFtZS50ZXh0LFxuICAgICAgICAgICAgYXJnczogbWV0aG9kLnBhcmFtZXRlcnMgPyBtZXRob2QucGFyYW1ldGVycy5tYXAocHJvcCA9PiB0aGlzLnZpc2l0QXJndW1lbnQocHJvcCkpIDogW10sXG4gICAgICAgICAgICBvcHRpb25hbDogdHlwZW9mIG1ldGhvZC5xdWVzdGlvblRva2VuICE9PSAndW5kZWZpbmVkJyxcbiAgICAgICAgICAgIHJldHVyblR5cGU6IHRoaXMudmlzaXRUeXBlKG1ldGhvZC50eXBlKSxcbiAgICAgICAgICAgIHR5cGVQYXJhbWV0ZXJzOiBbXSxcbiAgICAgICAgICAgIGxpbmU6IHRoaXMuZ2V0UG9zaXRpb24obWV0aG9kLCBzb3VyY2VGaWxlKS5saW5lICsgMVxuICAgICAgICB9O1xuICAgICAgICBsZXQganNkb2N0YWdzID0gdGhpcy5qc2RvY1BhcnNlclV0aWwuZ2V0SlNEb2NzKG1ldGhvZCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QudHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIC8vIFRyeSB0byBnZXQgaW5mZXJyZWQgdHlwZVxuICAgICAgICAgICAgaWYgKG1ldGhvZC5zeW1ib2wpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3ltYm9sOiB0cy5TeW1ib2wgPSBtZXRob2Quc3ltYm9sO1xuICAgICAgICAgICAgICAgIGlmIChzeW1ib2wudmFsdWVEZWNsYXJhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3ltYm9sVHlwZSA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0VHlwZU9mU3ltYm9sQXRMb2NhdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5bWJvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzeW1ib2xUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNpZ25hdHVyZSA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0U2lnbmF0dXJlRnJvbURlY2xhcmF0aW9uKG1ldGhvZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0dXJuVHlwZSA9IHNpZ25hdHVyZS5nZXRSZXR1cm5UeXBlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnJldHVyblR5cGUgPSB0aGlzLnR5cGVDaGVja2VyLnR5cGVUb1N0cmluZyhyZXR1cm5UeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1ldGhvZC50eXBlUGFyYW1ldGVycyAmJiBtZXRob2QudHlwZVBhcmFtZXRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVzdWx0LnR5cGVQYXJhbWV0ZXJzID0gbWV0aG9kLnR5cGVQYXJhbWV0ZXJzLm1hcCh0eXBlUGFyYW1ldGVyID0+XG4gICAgICAgICAgICAgICAgdGhpcy52aXNpdFR5cGUodHlwZVBhcmFtZXRlcilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWV0aG9kLmpzRG9jKSB7XG4gICAgICAgICAgICByZXN1bHQuZGVzY3JpcHRpb24gPSBtYXJrZWQodGhpcy5qc2RvY1BhcnNlclV0aWwuZ2V0TWFpbkNvbW1lbnRPZk5vZGUobWV0aG9kKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWV0aG9kLmRlY29yYXRvcnMpIHtcbiAgICAgICAgICAgIHJlc3VsdC5kZWNvcmF0b3JzID0gdGhpcy5mb3JtYXREZWNvcmF0b3JzKG1ldGhvZC5kZWNvcmF0b3JzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXRob2QubW9kaWZpZXJzKSB7XG4gICAgICAgICAgICBpZiAobWV0aG9kLm1vZGlmaWVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGtpbmRzID0gbWV0aG9kLm1vZGlmaWVycy5tYXAobW9kaWZpZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9kaWZpZXIua2luZDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIF8uaW5kZXhPZihraW5kcywgU3ludGF4S2luZC5QdWJsaWNLZXl3b3JkKSAhPT0gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgXy5pbmRleE9mKGtpbmRzLCBTeW50YXhLaW5kLlN0YXRpY0tleXdvcmQpICE9PSAtMVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBraW5kcyA9IGtpbmRzLmZpbHRlcihraW5kID0+IGtpbmQgIT09IFN5bnRheEtpbmQuUHVibGljS2V5d29yZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc3VsdC5tb2RpZmllcktpbmQgPSBraW5kcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoanNkb2N0YWdzICYmIGpzZG9jdGFncy5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgaWYgKGpzZG9jdGFnc1swXS50YWdzKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmpzZG9jdGFncyA9IG1hcmtlZHRhZ3MoanNkb2N0YWdzWzBdLnRhZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQuanNkb2N0YWdzICYmIHJlc3VsdC5qc2RvY3RhZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVzdWx0LmpzZG9jdGFncyA9IG1lcmdlVGFnc0FuZEFyZ3MocmVzdWx0LmFyZ3MsIHJlc3VsdC5qc2RvY3RhZ3MpO1xuICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5hcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJlc3VsdC5qc2RvY3RhZ3MgPSBtZXJnZVRhZ3NBbmRBcmdzKHJlc3VsdC5hcmdzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgdmlzaXRPdXRwdXQoXG4gICAgICAgIHByb3BlcnR5OiB0cy5Qcm9wZXJ0eURlY2xhcmF0aW9uLFxuICAgICAgICBvdXREZWNvcmF0b3I6IHRzLkRlY29yYXRvcixcbiAgICAgICAgc291cmNlRmlsZT86IHRzLlNvdXJjZUZpbGVcbiAgICApIHtcbiAgICAgICAgbGV0IGluQXJncyA9IG91dERlY29yYXRvci5leHByZXNzaW9uLmFyZ3VtZW50cztcbiAgICAgICAgbGV0IF9yZXR1cm46IGFueSA9IHtcbiAgICAgICAgICAgIG5hbWU6IGluQXJncy5sZW5ndGggPiAwID8gaW5BcmdzWzBdLnRleHQgOiBwcm9wZXJ0eS5uYW1lLnRleHQsXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IHByb3BlcnR5LmluaXRpYWxpemVyXG4gICAgICAgICAgICAgICAgPyB0aGlzLnN0cmluZ2lmeURlZmF1bHRWYWx1ZShwcm9wZXJ0eS5pbml0aWFsaXplcilcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgICAgICB9O1xuICAgICAgICBpZiAocHJvcGVydHkuanNEb2MpIHtcbiAgICAgICAgICAgIF9yZXR1cm4uZGVzY3JpcHRpb24gPSBtYXJrZWQoXG4gICAgICAgICAgICAgICAgbWFya2VkKHRoaXMuanNkb2NQYXJzZXJVdGlsLmdldE1haW5Db21tZW50T2ZOb2RlKHByb3BlcnR5KSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfcmV0dXJuLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydHkuanNEb2MgJiYgcHJvcGVydHkuanNEb2MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHkuanNEb2NbMF0uY29tbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgX3JldHVybi5kZXNjcmlwdGlvbiA9IG1hcmtlZChwcm9wZXJ0eS5qc0RvY1swXS5jb21tZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX3JldHVybi5saW5lID0gdGhpcy5nZXRQb3NpdGlvbihwcm9wZXJ0eSwgc291cmNlRmlsZSkubGluZSArIDE7XG5cbiAgICAgICAgaWYgKHByb3BlcnR5LnR5cGUpIHtcbiAgICAgICAgICAgIF9yZXR1cm4udHlwZSA9IHRoaXMudmlzaXRUeXBlKHByb3BlcnR5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBOZXdFeHByZXNzaW9uXG4gICAgICAgICAgICBpZiAocHJvcGVydHkuaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHMuaXNOZXdFeHByZXNzaW9uKHByb3BlcnR5LmluaXRpYWxpemVyKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkuaW5pdGlhbGl6ZXIuZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3JldHVybi50eXBlID0gcHJvcGVydHkuaW5pdGlhbGl6ZXIuZXhwcmVzc2lvbi50ZXh0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmV0dXJuO1xuICAgIH1cblxuICAgIHByaXZhdGUgdmlzaXRBcmd1bWVudChhcmc6IHRzLlBhcmFtZXRlckRlY2xhcmF0aW9uKSB7XG4gICAgICAgIGxldCBfcmVzdWx0OiBhbnkgPSB7IG5hbWU6IGFyZy5uYW1lLnRleHQsIHR5cGU6IHRoaXMudmlzaXRUeXBlKGFyZykgfTtcbiAgICAgICAgaWYgKGFyZy5kb3REb3REb3RUb2tlbikge1xuICAgICAgICAgICAgX3Jlc3VsdC5kb3REb3REb3RUb2tlbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZy5xdWVzdGlvblRva2VuKSB7XG4gICAgICAgICAgICBfcmVzdWx0Lm9wdGlvbmFsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJnLnR5cGUpIHtcbiAgICAgICAgICAgIGlmIChhcmcudHlwZS5raW5kKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRzLmlzRnVuY3Rpb25UeXBlTm9kZShhcmcudHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgX3Jlc3VsdC5mdW5jdGlvbiA9IGFyZy50eXBlLnBhcmFtZXRlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgID8gYXJnLnR5cGUucGFyYW1ldGVycy5tYXAocHJvcCA9PiB0aGlzLnZpc2l0QXJndW1lbnQocHJvcCkpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJnLmluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICBfcmVzdWx0LmRlZmF1bHRWYWx1ZSA9IHRoaXMuc3RyaW5naWZ5RGVmYXVsdFZhbHVlKGFyZy5pbml0aWFsaXplcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdEhvc3RMaXN0ZW5lcihwcm9wZXJ0eSwgaG9zdExpc3RlbmVyRGVjb3JhdG9yLCBzb3VyY2VGaWxlPykge1xuICAgICAgICBsZXQgaW5BcmdzID0gaG9zdExpc3RlbmVyRGVjb3JhdG9yLmV4cHJlc3Npb24uYXJndW1lbnRzO1xuICAgICAgICBsZXQgX3JldHVybjogYW55ID0ge307XG4gICAgICAgIF9yZXR1cm4ubmFtZSA9IGluQXJncy5sZW5ndGggPiAwID8gaW5BcmdzWzBdLnRleHQgOiBwcm9wZXJ0eS5uYW1lLnRleHQ7XG4gICAgICAgIF9yZXR1cm4uYXJncyA9IHByb3BlcnR5LnBhcmFtZXRlcnNcbiAgICAgICAgICAgID8gcHJvcGVydHkucGFyYW1ldGVycy5tYXAocHJvcCA9PiB0aGlzLnZpc2l0QXJndW1lbnQocHJvcCkpXG4gICAgICAgICAgICA6IFtdO1xuICAgICAgICBfcmV0dXJuLmFyZ3NEZWNvcmF0b3IgPVxuICAgICAgICAgICAgaW5BcmdzLmxlbmd0aCA+IDFcbiAgICAgICAgICAgICAgICA/IGluQXJnc1sxXS5lbGVtZW50cy5tYXAocHJvcCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3AudGV4dDtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgOiBbXTtcbiAgICAgICAgaWYgKHByb3BlcnR5LmpzRG9jKSB7XG4gICAgICAgICAgICBfcmV0dXJuLmRlc2NyaXB0aW9uID0gbWFya2VkKHRoaXMuanNkb2NQYXJzZXJVdGlsLmdldE1haW5Db21tZW50T2ZOb2RlKHByb3BlcnR5KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfcmV0dXJuLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydHkuanNEb2MpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkuanNEb2MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3BlcnR5LmpzRG9jWzBdLmNvbW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmV0dXJuLmRlc2NyaXB0aW9uID0gbWFya2VkKHByb3BlcnR5LmpzRG9jWzBdLmNvbW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF9yZXR1cm4ubGluZSA9IHRoaXMuZ2V0UG9zaXRpb24ocHJvcGVydHksIHNvdXJjZUZpbGUpLmxpbmUgKyAxO1xuICAgICAgICByZXR1cm4gX3JldHVybjtcbiAgICB9XG59XG4iXX0=