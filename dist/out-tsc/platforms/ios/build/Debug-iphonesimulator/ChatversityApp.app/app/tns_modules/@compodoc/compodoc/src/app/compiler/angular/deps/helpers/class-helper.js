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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MtaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9jb21waWxlci9hbmd1bGFyL2RlcHMvaGVscGVycy9jbGFzcy1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQkFBNEI7QUFJNUIsK0NBQStDO0FBRS9DLG9EQUE2RjtBQUM3RixrRUFBK0Q7QUFDL0QsNEVBQXlFO0FBQ3pFLDhDQUFnRDtBQUNoRCxtRkFBNEU7QUFDNUUsd0VBQWlFO0FBQ2pFLHNHQUF1RztBQUV2RywrRUFBeUU7QUFDekUsMkRBQXNEO0FBRXRELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFakM7SUFHSSxxQkFBb0IsV0FBMkI7UUFBM0IsZ0JBQVcsR0FBWCxXQUFXLENBQWdCO1FBRnZDLG9CQUFlLEdBQUcsSUFBSSxtQ0FBZSxFQUFFLENBQUM7SUFFRSxDQUFDO0lBRW5EOztPQUVHO0lBRUksMkNBQXFCLEdBQTVCLFVBQTZCLElBQWE7UUFDdEM7O1dBRUc7UUFDSCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUNoQixPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN6QjthQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSywwQkFBVSxDQUFDLFlBQVksRUFBRTtZQUM5QyxPQUFPLE9BQU8sQ0FBQztTQUNsQjthQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSywwQkFBVSxDQUFDLFdBQVcsRUFBRTtZQUM3QyxPQUFPLE1BQU0sQ0FBQztTQUNqQjtJQUNMLENBQUM7SUFFTyx3Q0FBa0IsR0FBMUIsVUFBMkIsSUFBSSxFQUFFLGFBQWE7UUFDMUMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7UUFFdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRTtnQkFDckMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssYUFBYSxFQUFFO29CQUM1RCxPQUFPLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDeEI7YUFDSjtTQUNKO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVPLHNDQUFnQixHQUF4QixVQUF5QixVQUFVO1FBQW5DLGlCQXFCQztRQXBCRyxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFFckIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBQyxTQUFjO1lBQ2pDLElBQUksU0FBUyxDQUFDLFVBQVUsRUFBRTtnQkFDdEIsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTtvQkFDM0IsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7aUJBQ3pEO2dCQUNELElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUU7b0JBQ2pDLElBQUksSUFBSSxHQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUMvRCxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFO3dCQUNoQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUMvQyxTQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FDakMsQ0FBQztxQkFDTDtvQkFDRCxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUMxQjthQUNKO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBRU8sb0NBQWMsR0FBdEIsVUFBdUIsR0FBRztRQUExQixpQkEyQ0M7UUExQ0csSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDM0IsT0FBTyxLQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxpQkFBYyxDQUFDO1NBQ2xFO1FBRUQsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJO1lBQzlCLElBQUksT0FBTyxHQUFHLDZCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakQsSUFBSSxPQUFPLEVBQUU7Z0JBQ1QsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtvQkFDL0IsSUFBSSxNQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQzdCLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO3dCQUMvQixNQUFJLEdBQUcsUUFBUSxDQUFDO3FCQUNuQjtvQkFDRCxPQUFPLEtBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLHVCQUFpQixNQUFJLFVBQ2xFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFDWCxJQUFJLENBQUMsSUFBSSxTQUFNLENBQUM7aUJBQzdCO3FCQUFNO29CQUNILElBQUksTUFBSSxHQUFHLDhCQUFrQixDQUFDLFVBQVUsQ0FDcEMsT0FBTyxDQUFDLElBQUksRUFDWix1QkFBYSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQ3hDLENBQUM7b0JBQ0YsT0FBTyxLQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUN4QyxHQUFHLENBQ04sb0JBQWMsTUFBSSw2QkFBcUIsSUFBSSxDQUFDLElBQUksU0FBTSxDQUFDO2lCQUMzRDthQUNKO2lCQUFNLElBQUkseUJBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM3QyxJQUFJLE1BQUksR0FBRyx5QkFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9DLE9BQU8sS0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUksQ0FBQyxpQkFBaUIsQ0FDeEMsR0FBRyxDQUNOLG9CQUFjLE1BQUksNkJBQXFCLElBQUksQ0FBQyxJQUFJLFNBQU0sQ0FBQzthQUMzRDtpQkFBTTtnQkFDSCxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtvQkFDeEIsT0FBTyxLQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFLLElBQUksQ0FBQyxJQUFNLENBQUM7aUJBQ3JFO3FCQUFNO29CQUNILElBQUksSUFBSSxDQUFDLElBQUksRUFBRTt3QkFDWCxPQUFPLEtBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFNLENBQUM7cUJBQzlCO3lCQUFNO3dCQUNILE9BQU8sRUFBRSxDQUFDO3FCQUNiO2lCQUNKO2FBQ0o7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sS0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsV0FBTSxNQUFNLGNBQVcsQ0FBQztJQUM1RSxDQUFDO0lBRU8sdUNBQWlCLEdBQXpCLFVBQTBCLEdBQUc7UUFDekIsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRU8sd0NBQWtCLEdBQTFCLFVBQTJCLElBQUk7UUFBL0IsaUJBeUVDO1FBeEVHLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUV2QixhQUFhLEdBQUcsSUFBSTthQUNmLEdBQUcsQ0FBQyxVQUFBLEdBQUc7WUFDSixJQUFJLE9BQU8sR0FBRyw2QkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELElBQUksT0FBTyxFQUFFO2dCQUNULElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7b0JBQy9CLElBQUksTUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUM3QixJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTt3QkFDL0IsTUFBSSxHQUFHLFFBQVEsQ0FBQztxQkFDbkI7b0JBQ0QsT0FBTyxLQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyx1QkFBaUIsTUFBSSxVQUNqRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQ1gsR0FBRyxDQUFDLElBQUksU0FBTSxDQUFDO2lCQUM1QjtxQkFBTTtvQkFDSCxJQUFJLE1BQUksR0FBRyw4QkFBa0IsQ0FBQyxVQUFVLENBQ3BDLE9BQU8sQ0FBQyxJQUFJLEVBQ1osdUJBQWEsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUN4QyxDQUFDO29CQUNGLE9BQU8sS0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUksQ0FBQyxpQkFBaUIsQ0FDdkMsR0FBRyxDQUNOLG9CQUFjLE1BQUksNkJBQXFCLEdBQUcsQ0FBQyxJQUFJLFNBQU0sQ0FBQztpQkFDMUQ7YUFDSjtpQkFBTSxJQUFJLEdBQUcsQ0FBQyxjQUFjLEVBQUU7Z0JBQzNCLE9BQU8sUUFBTSxHQUFHLENBQUMsSUFBSSxVQUFLLEdBQUcsQ0FBQyxJQUFNLENBQUM7YUFDeEM7aUJBQU0sSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO2dCQUNyQixPQUFPLEtBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbkM7aUJBQU0sSUFBSSxHQUFHLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ25DLE9BQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQ3BEO2lCQUFNLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLDBCQUFVLENBQUMsYUFBYSxFQUFFO2dCQUNoRSxPQUFPLE1BQU0sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7YUFDOUM7aUJBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssMEJBQVUsQ0FBQyxhQUFhLEVBQUU7Z0JBQzFELE9BQU8sR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO2FBQy9CO2lCQUFNLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLDBCQUFVLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ3BFLE9BQU8saUVBQWdDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDaEQ7aUJBQU0sSUFBSSx5QkFBYSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzVDLElBQUksTUFBSSxHQUFHLHlCQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUMsT0FBTyxLQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUN2QyxHQUFHLENBQ04sb0JBQWMsTUFBSSw2QkFBcUIsR0FBRyxDQUFDLElBQUksU0FBTSxDQUFDO2FBQzFEO2lCQUFNO2dCQUNILElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtvQkFDVixJQUFJLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztvQkFDbEMsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDO29CQUNwQixJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUU7d0JBQ1Ysd0JBQXdCLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQztxQkFDeEM7b0JBQ0QsSUFDSSxHQUFHLENBQUMsSUFBSSxLQUFLLDBCQUFVLENBQUMsWUFBWTt3QkFDcEMsR0FBRyxDQUFDLFVBQVU7d0JBQ2QsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQ3JCO3dCQUNFLHdCQUF3QixJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO3dCQUNoRCxTQUFTLEdBQUcsS0FBSyxDQUFDO3FCQUNyQjtvQkFDRCxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUU7d0JBQ2Qsd0JBQXdCLElBQUksS0FBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUMzRDtvQkFDRCxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUU7d0JBQ1Ysd0JBQXdCLElBQUksU0FBUyxHQUFHLEdBQUcsR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDMUU7b0JBQ0QsT0FBTyx3QkFBd0IsQ0FBQztpQkFDbkM7cUJBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFO29CQUNqQixPQUFPLEtBQUcsR0FBRyxDQUFDLElBQU0sQ0FBQztpQkFDeEI7cUJBQU07b0JBQ0gsT0FBTyxLQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBRyxDQUFDO2lCQUN0RDthQUNKO1FBQ0wsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWhCLE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFFTyxpQ0FBVyxHQUFuQixVQUFvQixJQUFhLEVBQUUsVUFBeUI7UUFDeEQsSUFBSSxRQUE2QixDQUFDO1FBQ2xDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUM1QixRQUFRLEdBQUcsa0JBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMxRTthQUFNO1lBQ0gsUUFBUSxHQUFHLGtCQUFFLENBQUMsNkJBQTZCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyRTtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFTyxpQ0FBVyxHQUFuQixVQUFvQixTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVU7UUFDbkQsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksWUFBWSxDQUFDLElBQUksRUFBRTtZQUNuQixRQUFRLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDbEMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDdEIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHO29CQUNsQixJQUFJLEVBQUUsUUFBUTtvQkFDZCxZQUFZLEVBQUUsU0FBUztvQkFDdkIsWUFBWSxFQUFFLFNBQVM7aUJBQzFCLENBQUM7YUFDTDtZQUVELElBQUksWUFBWSxDQUFDLElBQUksS0FBSywwQkFBVSxDQUFDLFdBQVcsRUFBRTtnQkFDOUMsSUFBSSxZQUFZLEdBQUc7b0JBQ2YsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsSUFBSSxFQUFFLE1BQU07b0JBQ1osSUFBSSxFQUFFLFlBQVksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSzt3QkFDbkMsT0FBTzs0QkFDSCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJOzRCQUNyQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMseUJBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3lCQUN0RCxDQUFDO29CQUNOLENBQUMsQ0FBQztvQkFDRixVQUFVLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07b0JBQzFFLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQztpQkFDNUQsQ0FBQztnQkFFRixJQUFJLFlBQVksQ0FBQyxLQUFLLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO29CQUN0RCxJQUFJLE9BQU8sR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFDNUMsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLEVBQUU7d0JBQ2hDLFlBQVksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUM5QztpQkFDSjtnQkFFRCxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtvQkFDcEMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO3dCQUNuQixZQUFZLENBQUMsU0FBUyxHQUFHLGtCQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUMxRDtpQkFDSjtnQkFDRCxJQUFJLFlBQVksQ0FBQyxTQUFTLElBQUksWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUM3RCxZQUFZLENBQUMsU0FBUyxHQUFHLHdCQUFnQixDQUNyQyxZQUFZLENBQUMsSUFBSSxFQUNqQixZQUFZLENBQUMsU0FBUyxDQUN6QixDQUFDO2lCQUNMO3FCQUFNLElBQUksWUFBWSxDQUFDLElBQUksSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzFELFlBQVksQ0FBQyxTQUFTLEdBQUcsd0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNoRTtnQkFFRCxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQzthQUNuRDtZQUNELElBQUksWUFBWSxDQUFDLElBQUksS0FBSywwQkFBVSxDQUFDLFdBQVcsRUFBRTtnQkFDOUMsSUFBSSxZQUFZLEdBQUc7b0JBQ2YsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsSUFBSSxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHlCQUFVLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDakUsVUFBVSxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUN0RSxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUM7aUJBQzVELENBQUM7Z0JBRUYsSUFBSSxZQUFZLENBQUMsS0FBSyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtvQkFDdEQsSUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzVDLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxFQUFFO3dCQUNoQyxZQUFZLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDOUM7aUJBQ0o7Z0JBRUQsSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7b0JBQ3BDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTt3QkFDbkIsWUFBWSxDQUFDLFNBQVMsR0FBRyxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDMUQ7aUJBQ0o7Z0JBRUQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7YUFDbkQ7U0FDSjtJQUNMLENBQUM7SUFFTywwQ0FBb0IsR0FBNUIsVUFBNkIsU0FBdUI7UUFDaEQsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRTtZQUNqQyxJQUFJLHVCQUF1QixHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztZQUNuRSxPQUFPLENBQ0gsdUJBQXVCLEtBQUssV0FBVyxJQUFJLHVCQUF1QixLQUFLLFdBQVcsQ0FDckYsQ0FBQztTQUNMO2FBQU07WUFDSCxPQUFPLEtBQUssQ0FBQztTQUNoQjtJQUNMLENBQUM7SUFFTyx3Q0FBa0IsR0FBMUIsVUFBMkIsU0FBUztRQUNoQyxPQUFPLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVTtZQUNsQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLFlBQVk7WUFDdkQsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDO0lBRU8sK0JBQVMsR0FBakIsVUFBa0IsTUFBTTtRQUNwQjs7V0FFRztRQUNILElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFNLFNBQVMsR0FBWSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FDNUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxLQUFLLDBCQUFVLENBQUMsY0FBYyxFQUEzQyxDQUEyQyxDQUMxRCxDQUFDO1lBQ0YsSUFBSSxTQUFTLEVBQUU7Z0JBQ1gsT0FBTyxJQUFJLENBQUM7YUFDZjtTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTyxpQ0FBVyxHQUFuQixVQUFvQixNQUFNO1FBQ3RCLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFNLFdBQVcsR0FBWSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FDOUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxLQUFLLDBCQUFVLENBQUMsZ0JBQWdCLEVBQTdDLENBQTZDLENBQzVELENBQUM7WUFDRixJQUFJLFdBQVcsRUFBRTtnQkFDYixPQUFPLElBQUksQ0FBQzthQUNmO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVPLGdDQUFVLEdBQWxCLFVBQW1CLE1BQU07UUFDckI7O1dBRUc7UUFDSCxJQUFNLFlBQVksR0FBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVDLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtZQUNkLEtBQWtCLFVBQVksRUFBWixLQUFBLE1BQU0sQ0FBQyxLQUFLLEVBQVosY0FBWSxFQUFaLElBQVksRUFBRTtnQkFBM0IsSUFBTSxHQUFHLFNBQUE7Z0JBQ1YsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFO29CQUNWLEtBQWtCLFVBQVEsRUFBUixLQUFBLEdBQUcsQ0FBQyxJQUFJLEVBQVIsY0FBUSxFQUFSLElBQVEsRUFBRTt3QkFBdkIsSUFBTSxHQUFHLFNBQUE7d0JBQ1YsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7NEJBQzdDLE9BQU8sSUFBSSxDQUFDO3lCQUNmO3FCQUNKO2lCQUNKO2FBQ0o7U0FDSjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTyw4QkFBUSxHQUFoQixVQUFpQixNQUFNO1FBQ25CLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFNLFFBQVEsR0FBWSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FDM0MsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxLQUFLLDBCQUFVLENBQUMsYUFBYSxFQUExQyxDQUEwQyxDQUN6RCxDQUFDO1lBQ0YsSUFBSSxRQUFRLEVBQUU7Z0JBQ1YsT0FBTyxJQUFJLENBQUM7YUFDZjtTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTyxvQ0FBYyxHQUF0QixVQUF1QixNQUFNO1FBQ3pCOztXQUVHO1FBQ0gsSUFBTSxZQUFZLEdBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDZCxLQUFrQixVQUFZLEVBQVosS0FBQSxNQUFNLENBQUMsS0FBSyxFQUFaLGNBQVksRUFBWixJQUFZLEVBQUU7Z0JBQTNCLElBQU0sR0FBRyxTQUFBO2dCQUNWLElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtvQkFDVixLQUFrQixVQUFRLEVBQVIsS0FBQSxHQUFHLENBQUMsSUFBSSxFQUFSLGNBQVEsRUFBUixJQUFRLEVBQUU7d0JBQXZCLElBQU0sR0FBRyxTQUFBO3dCQUNWLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFOzRCQUM3QyxPQUFPLElBQUksQ0FBQzt5QkFDZjtxQkFDSjtpQkFDSjthQUNKO1NBQ0o7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU8scUNBQWUsR0FBdkIsVUFBd0IsU0FBUztRQUM3QixPQUFPLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVTtZQUNsQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLE1BQU07WUFDakQsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDO0lBRU8sdUNBQWlCLEdBQXpCLFVBQTBCLFNBQVM7UUFDL0IsT0FBTyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVU7WUFDbEMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxVQUFVO1lBQ3JELENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDaEIsQ0FBQztJQUVEOztPQUVHO0lBRUksMkNBQXFCLEdBQTVCLFVBQ0ksUUFBZ0IsRUFDaEIsZ0JBQStELEVBQy9ELFVBQTBCO1FBRTFCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekUsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUNyQixJQUFJLE1BQU0sRUFBRTtZQUNSLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDN0UsV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUNsRixJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsSUFBSSxnQkFBUSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO2dCQUM5RCxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUM3QjtZQUNELElBQUksTUFBTSxDQUFDLFlBQVksSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZELElBQUksZ0JBQVEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ2xDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2lCQUM3QjthQUNKO1NBQ0o7UUFDRCxJQUFJLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzNDLElBQUksT0FBTyxDQUFDO1FBQ1osSUFBSSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxjQUFjLENBQUM7UUFDbkIsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBRW5CLElBQUksT0FBTyxrQkFBRSxDQUFDLHdDQUF3QyxLQUFLLFdBQVcsRUFBRTtZQUNwRSxJQUFJLGdCQUFnQixHQUFHLGtCQUFFLENBQUMsd0NBQXdDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNyRixJQUFJLGdCQUFnQixFQUFFO2dCQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDO2dCQUNsQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNsQixJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRTt3QkFDaEMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDaEU7aUJBQ0o7YUFDSjtTQUNKO1FBRUQsSUFBSSxPQUFPLGtCQUFFLENBQUMsb0NBQW9DLEtBQUssV0FBVyxFQUFFO1lBQ2hFLElBQUksWUFBWSxHQUFHLGtCQUFFLENBQUMsb0NBQW9DLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM3RSxJQUFJLFlBQVksRUFBRTtnQkFDZCxJQUFJLFlBQVksQ0FBQyxVQUFVLEVBQUU7b0JBQ3pCLGNBQWMsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztpQkFDakQ7YUFDSjtTQUNKO1FBRUQsSUFBSSxNQUFNLEVBQUU7WUFDUixJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDekIsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2FBQ3ZFO1NBQ0o7UUFFRCxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFbEUsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUU7WUFDN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pELElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUMzRCxPQUFPO3dCQUNILFdBQVcsYUFBQTt3QkFDWCxjQUFjLEVBQUUsY0FBYzt3QkFDOUIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO3dCQUN0QixPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87d0JBQ3hCLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWTt3QkFDbEMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhO3dCQUNwQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7d0JBQzlCLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTzt3QkFDeEIsZUFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlO3dCQUN4QyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7d0JBQ2xCLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVzt3QkFDaEMsU0FBUyxFQUFFLFNBQVM7d0JBQ3BCLE9BQU8sRUFBRSxjQUFjO3dCQUN2QixVQUFVLEVBQUUsa0JBQWtCO3dCQUM5QixTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7cUJBQy9CLENBQUM7aUJBQ0w7cUJBQU0sSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ2hFLE9BQU87d0JBQ0g7NEJBQ0ksUUFBUSxVQUFBOzRCQUNSLFNBQVMsV0FBQTs0QkFDVCxXQUFXLGFBQUE7NEJBQ1gsY0FBYyxFQUFFLGNBQWM7NEJBQzlCLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTzs0QkFDeEIsZUFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlOzRCQUN4QyxVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7NEJBQzlCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTs0QkFDbEIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXOzRCQUNoQyxTQUFTLEVBQUUsU0FBUzs0QkFDcEIsT0FBTyxFQUFFLGNBQWM7NEJBQ3ZCLFVBQVUsRUFBRSxrQkFBa0I7NEJBQzlCLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUzt5QkFDL0I7cUJBQ0osQ0FBQztpQkFDTDtxQkFBTSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzdELE9BQU87d0JBQ0g7NEJBQ0ksUUFBUSxVQUFBOzRCQUNSLFNBQVMsV0FBQTs0QkFDVCxXQUFXLGFBQUE7NEJBQ1gsY0FBYyxFQUFFLGNBQWM7NEJBQzlCLFNBQVMsRUFBRSxTQUFTOzRCQUNwQixVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7NEJBQzlCLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTzt5QkFDM0I7cUJBQ0osQ0FBQztpQkFDTDtxQkFBTSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDL0QsT0FBTzt3QkFDSDs0QkFDSSxRQUFRLFVBQUE7NEJBQ1IsU0FBUyxXQUFBOzRCQUNULFdBQVcsYUFBQTs0QkFDWCxjQUFjLEVBQUUsY0FBYzs0QkFDOUIsU0FBUyxFQUFFLFNBQVM7NEJBQ3BCLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTzt5QkFDM0I7cUJBQ0osQ0FBQztpQkFDTDtxQkFBTTtvQkFDSCxPQUFPO3dCQUNIOzRCQUNJLFdBQVcsYUFBQTs0QkFDWCxjQUFjLEVBQUUsY0FBYzs0QkFDOUIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPOzRCQUN4QixlQUFlLEVBQUUsT0FBTyxDQUFDLGVBQWU7NEJBQ3hDLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTs0QkFDOUIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJOzRCQUNsQixXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7NEJBQ2hDLFNBQVMsRUFBRSxTQUFTOzRCQUNwQixPQUFPLEVBQUUsY0FBYzs0QkFDdkIsVUFBVSxFQUFFLGtCQUFrQjs0QkFDOUIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO3lCQUMvQjtxQkFDSixDQUFDO2lCQUNMO2FBQ0o7U0FDSjthQUFNLElBQUksV0FBVyxFQUFFO1lBQ3BCLE9BQU87Z0JBQ0g7b0JBQ0ksV0FBVyxhQUFBO29CQUNYLGNBQWMsRUFBRSxjQUFjO29CQUM5QixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07b0JBQ3RCLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztvQkFDeEIsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZO29CQUNsQyxhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWE7b0JBQ3BDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztvQkFDeEIsZUFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlO29CQUN4QyxVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7b0JBQzlCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtvQkFDbEIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXO29CQUNoQyxTQUFTLEVBQUUsU0FBUztvQkFDcEIsT0FBTyxFQUFFLGNBQWM7b0JBQ3ZCLFVBQVUsRUFBRSxrQkFBa0I7b0JBQzlCLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztpQkFDL0I7YUFDSixDQUFDO1NBQ0w7YUFBTTtZQUNILE9BQU87Z0JBQ0g7b0JBQ0ksT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO29CQUN4QixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07b0JBQ3RCLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztvQkFDeEIsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZO29CQUNsQyxhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWE7b0JBQ3BDLGVBQWUsRUFBRSxPQUFPLENBQUMsZUFBZTtvQkFDeEMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVO29CQUM5QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7b0JBQ2xCLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVztvQkFDaEMsU0FBUyxFQUFFLFNBQVM7b0JBQ3BCLE9BQU8sRUFBRSxjQUFjO29CQUN2QixVQUFVLEVBQUUsa0JBQWtCO29CQUM5QixTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7aUJBQy9CO2FBQ0osQ0FBQztTQUNMO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRU8sa0NBQVksR0FBcEIsVUFBcUIsT0FBTyxFQUFFLFVBQVU7UUFDcEM7O1dBRUc7UUFDSCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNwQixJQUFJLGVBQWUsR0FBRyxFQUFFLENBQUM7UUFDekIsSUFBSSxJQUFJLENBQUM7UUFDVCxJQUFJLGNBQWMsQ0FBQztRQUNuQixJQUFJLFdBQVcsQ0FBQztRQUNoQixJQUFJLFlBQVksQ0FBQztRQUNqQixJQUFJLFdBQVcsQ0FBQztRQUNoQixJQUFJLFlBQVksQ0FBQztRQUNqQixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWhCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLGlEQUFpRDtZQUNqRCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFeEIsY0FBYyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDMUQsWUFBWSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDekQsV0FBVyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDN0QsWUFBWSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFFL0QsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFFbkIsSUFBSSxnQkFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNsQixTQUFTO2FBQ1o7WUFFRCxJQUFJLGNBQWMsRUFBRTtnQkFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUMvRSxJQUFJLGtCQUFFLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztpQkFDdkQ7YUFDSjtpQkFBTSxJQUFJLFlBQVksRUFBRTtnQkFDckIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUNwRTtpQkFBTSxJQUFJLFdBQVcsRUFBRTtnQkFDcEIsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO2FBQ3JGO2lCQUFNLElBQUksWUFBWSxFQUFFO2dCQUNyQixhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7YUFDaEY7aUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3JDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksdUJBQWEsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUU7b0JBQ3BFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksdUJBQWEsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUU7d0JBQ3RFLElBQ0ksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksdUJBQWEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFDeEU7NEJBQ0UsSUFBSSxrQkFBRSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxJQUFJLGtCQUFFLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0NBQ2hFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDOzZCQUNqRTtpQ0FBTSxJQUNILGtCQUFFLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDO2dDQUNoQyxrQkFBRSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxFQUNoQztnQ0FDRSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7NkJBQzNEO2lDQUFNLElBQUksa0JBQUUsQ0FBQywwQkFBMEIsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQ0FDOUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7NkJBQ2xFO2lDQUFNLElBQ0gsa0JBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUM7Z0NBQ25DLGtCQUFFLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLEVBQ3JDO2dDQUNFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQzs2QkFDdkQ7aUNBQU0sSUFBSSxrQkFBRSxDQUFDLDJCQUEyQixDQUFDLE1BQU0sQ0FBQyxFQUFFO2dDQUMvQyxlQUFlLENBQUMsSUFBSSxDQUNoQixJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUNqRCxDQUFDOzZCQUNMO2lDQUFNLElBQUksa0JBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQ0FDNUMsSUFBSSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQ3hELE1BQU0sRUFDTixVQUFVLENBQ2IsQ0FBQztnQ0FDRixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0NBQ1YsSUFBSSxHQUFHLEdBQUcsc0JBQXNCLENBQUMsTUFBTSxDQUFDO2dDQUN4QyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO29DQUNsQixVQUFVLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUNBQzlDO2dDQUNELFdBQVcsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDOzZCQUN0RTt5QkFDSjtxQkFDSjtpQkFDSjthQUNKO1NBQ0o7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUNqQyxPQUFPLENBQUMsSUFBSSxDQUFDLHlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUNsQyxZQUFZLENBQUMsSUFBSSxDQUFDLHlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUN2QyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUN4QyxVQUFVLENBQUMsSUFBSSxDQUFDLHlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUNyQyxPQUFPLENBQUMsSUFBSSxDQUFDLHlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUNsQyxlQUFlLENBQUMsSUFBSSxDQUFDLHlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUUxQyxNQUFNLEdBQUc7WUFDTCxNQUFNLFFBQUE7WUFDTixPQUFPLFNBQUE7WUFDUCxZQUFZLGNBQUE7WUFDWixhQUFhLGVBQUE7WUFDYixPQUFPLFNBQUE7WUFDUCxVQUFVLFlBQUE7WUFDVixlQUFlLGlCQUFBO1lBQ2YsSUFBSSxNQUFBO1lBQ0osV0FBVyxhQUFBO1NBQ2QsQ0FBQztRQUVGLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDL0IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLFNBQVMsQ0FBQztTQUNuQztRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTyxtQ0FBYSxHQUFyQixVQUFzQixRQUF1QjtRQUN6QyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDZixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7U0FDeEI7UUFDRCxPQUFVLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBRyxDQUFDO0lBQ3hGLENBQUM7SUFFTSwrQkFBUyxHQUFoQixVQUFpQixJQUFJO1FBQ2pCLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsT0FBTyxPQUFPLENBQUM7U0FDbEI7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDL0M7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDbEIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDaEIsT0FBTyxHQUFHLHlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN4QztZQUNELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3BCLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDcEQ7WUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUN6QixPQUFPLElBQUksR0FBRyxDQUFDO2dCQUNmLElBQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztnQkFDekIsS0FBdUIsVUFBdUIsRUFBdkIsS0FBQSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBdkIsY0FBdUIsRUFBdkIsSUFBdUIsRUFBRTtvQkFBM0MsSUFBTSxRQUFRLFNBQUE7b0JBQ2YsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7aUJBQ2hEO2dCQUNELE9BQU8sSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNyQyxPQUFPLElBQUksR0FBRyxDQUFDO2FBQ2xCO1lBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDdkIsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN6RCxPQUFPLEdBQUcsVUFBVSxHQUFHLHlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssMEJBQVUsQ0FBQyxpQkFBaUIsRUFBRTtvQkFDN0QsT0FBTyxHQUFHLEdBQUcsR0FBRyxVQUFVLEdBQUcsR0FBRyxHQUFHLHlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDakU7YUFDSjtZQUNELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksa0JBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNsRCxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDVixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7Z0JBQ2pDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ2xCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUU5QixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7d0JBQ2xCLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUNwRCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxLQUFLLDBCQUFVLENBQUMsaUJBQWlCLEVBQUU7NEJBQ3hELE9BQU8sSUFBSSxHQUFHLEdBQUcsVUFBVSxHQUFHLEdBQUcsR0FBRyx5QkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDN0Q7NkJBQU07NEJBQ0gsT0FBTyxJQUFJLFVBQVUsR0FBRyx5QkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDakQ7cUJBQ0o7eUJBQU07d0JBQ0gsT0FBTyxJQUFJLHlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNqQyxJQUFJLGtCQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTs0QkFDNUMsT0FBTyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7eUJBQzVDO3dCQUNELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTs0QkFDZixPQUFPLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7eUJBQ2hEO3dCQUNELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTs0QkFDcEIsT0FBTyxJQUFJLEdBQUcsQ0FBQzs0QkFDZixJQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7NEJBQ3pCLEtBQXVCLFVBQWtCLEVBQWxCLEtBQUEsSUFBSSxDQUFDLGFBQWEsRUFBbEIsY0FBa0IsRUFBbEIsSUFBa0IsRUFBRTtnQ0FBdEMsSUFBTSxRQUFRLFNBQUE7Z0NBQ2YsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7NkJBQ2hEOzRCQUNELE9BQU8sSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUNyQyxPQUFPLElBQUksR0FBRyxDQUFDO3lCQUNsQjtxQkFDSjtvQkFDRCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFO3dCQUNiLE9BQU8sSUFBSSxLQUFLLENBQUM7cUJBQ3BCO2lCQUNKO2FBQ0o7WUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN4QixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDMUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLElBQUksR0FBRyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7Z0JBQzlCLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtvQkFDVCxPQUFPLEdBQUcsR0FBRyxDQUFDO29CQUNkLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ2xCLElBQUksSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDM0IsT0FBTyxJQUFJLHlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNqQyxJQUFJLGtCQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTs0QkFDNUMsT0FBTyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7eUJBQzVDO3dCQUNELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTs0QkFDZixPQUFPLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7eUJBQ2hEO3dCQUNELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUU7NEJBQ2IsT0FBTyxJQUFJLElBQUksQ0FBQzt5QkFDbkI7cUJBQ0o7b0JBQ0QsT0FBTyxJQUFJLEdBQUcsQ0FBQztpQkFDbEI7YUFDSjtTQUNKO2FBQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3pCLE9BQU8sR0FBRyx5QkFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcseUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEUsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRTtnQkFDM0IsT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyx5QkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNuRjtTQUNKO2FBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLGtCQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQy9DLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDVixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUM1QixLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNsQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixPQUFPLElBQUkseUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pDLElBQUksa0JBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUM1QyxPQUFPLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztpQkFDNUM7Z0JBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNmLE9BQU8sSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDaEQ7Z0JBQ0QsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRTtvQkFDYixPQUFPLElBQUksS0FBSyxDQUFDO2lCQUNwQjthQUNKO1NBQ0o7YUFBTSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDNUIsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUNyQjthQUFNO1lBQ0gsT0FBTyxHQUFHLHlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLElBQ0ksT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLFdBQVc7Z0JBQ2hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSTtnQkFDckIsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLDBCQUFVLENBQUMsbUJBQW1CLElBQUksSUFBSSxDQUFDLElBQUksS0FBSywwQkFBVSxDQUFDLFNBQVMsQ0FBQyxFQUN0RjtnQkFDRSxPQUFPLEdBQUcseUJBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQy9DO1lBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLDBCQUFVLENBQUMsYUFBYSxFQUFFO2dCQUN4QyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDNUI7WUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssMEJBQVUsQ0FBQyxXQUFXLEVBQUU7Z0JBQ3RDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQzthQUMvQjtTQUNKO1FBQ0QsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNyRCxPQUFPLElBQUksR0FBRyxDQUFDO1lBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUNMLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztZQUNwQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNsQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFO29CQUN2QixPQUFPLElBQUksSUFBSSxDQUFDO2lCQUNuQjthQUNKO1lBQ0QsT0FBTyxJQUFJLEdBQUcsQ0FBQztTQUNsQjtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTywwQ0FBb0IsR0FBNUIsVUFBNkIsTUFBbUMsRUFBRSxVQUF5QjtRQUEzRixpQkFzQkM7UUFyQkcsSUFBSSxVQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3RDLElBQUksSUFBSSxHQUFHLE1BQU07YUFDWixVQUFVLENBQUMsS0FBSyxDQUFDO2FBQ2pCLE1BQU0sQ0FBQyxVQUFVLENBQUM7YUFDbEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25CLElBQUksTUFBTSxHQUFRO1lBQ2QsRUFBRSxFQUFFLG1CQUFtQixHQUFHLElBQUk7WUFDOUIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3RGLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDdkMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO1NBQ3RELENBQUM7UUFDRixJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDZCxNQUFNLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDMUY7UUFDRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2RCxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNwQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ25CLE1BQU0sQ0FBQyxTQUFTLEdBQUcsa0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDcEQ7U0FDSjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTywyQ0FBcUIsR0FBN0IsVUFDSSxNQUFvQyxFQUNwQyxVQUEwQjtRQUY5QixpQkFtQkM7UUFmRyxJQUFJLFVBQVUsR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdEMsSUFBSSxJQUFJLEdBQUcsTUFBTTthQUNaLFVBQVUsQ0FBQyxLQUFLLENBQUM7YUFDakIsTUFBTSxDQUFDLFVBQVUsQ0FBQzthQUNsQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkIsSUFBSSxNQUFNLEdBQUc7WUFDVCxFQUFFLEVBQUUsb0JBQW9CLEdBQUcsSUFBSTtZQUMvQixJQUFJLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUF4QixDQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdEYsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN2QyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUM7U0FDdEQsQ0FBQztRQUNGLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtZQUNkLE1BQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUNsRjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTyxpREFBMkIsR0FBbkMsVUFDSSxNQUFpQyxFQUNqQyxVQUEwQjtRQUY5QixpQkE0Q0M7UUF4Q0c7O1dBRUc7UUFDSCxJQUFJLE1BQU0sR0FBUTtZQUNkLElBQUksRUFBRSxhQUFhO1lBQ25CLFdBQVcsRUFBRSxFQUFFO1lBQ2YsSUFBSSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3RGLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQztTQUN0RCxDQUFDO1FBQ0YsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkQsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2QsTUFBTSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ2xGO1FBRUQsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUM3QixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFFBQVE7b0JBQ3JDLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDekIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsSUFDSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSwwQkFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDakQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsMEJBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDbkQ7b0JBQ0UsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLEtBQUssMEJBQVUsQ0FBQyxhQUFhLEVBQWpDLENBQWlDLENBQUMsQ0FBQztpQkFDbkU7Z0JBQ0QsTUFBTSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7YUFDL0I7U0FDSjtRQUNELElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3BDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtnQkFDbkIsTUFBTSxDQUFDLFNBQVMsR0FBRyxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNwRDtTQUNKO1FBQ0QsSUFBSSxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNqRCxNQUFNLENBQUMsU0FBUyxHQUFHLHdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3RFO2FBQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDL0IsTUFBTSxDQUFDLFNBQVMsR0FBRyx3QkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEQ7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU8sbUNBQWEsR0FBckIsVUFBc0IsUUFBZ0MsRUFBRSxVQUFVO1FBQzlELElBQUksTUFBTSxHQUFRO1lBQ2QsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSTtZQUN4QixZQUFZLEVBQUUsUUFBUSxDQUFDLFdBQVc7Z0JBQzlCLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztnQkFDbEQsQ0FBQyxDQUFDLFNBQVM7WUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7WUFDOUIsUUFBUSxFQUFFLE9BQU8sUUFBUSxDQUFDLGFBQWEsS0FBSyxXQUFXO1lBQ3ZELFdBQVcsRUFBRSxFQUFFO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO1NBQ3hELENBQUM7UUFDRixJQUFJLFNBQVMsQ0FBQztRQUVkLElBQUksUUFBUSxDQUFDLFdBQVcsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSywwQkFBVSxDQUFDLGFBQWEsRUFBRTtZQUNoRixNQUFNLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FBQztTQUN2QztRQUVELElBQUksT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLFdBQVcsRUFBRTtZQUN2RixNQUFNLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztTQUMvQztRQUVELElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtZQUNoQixTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckQsTUFBTSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQ3BGO1FBRUQsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ3JCLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNsRTtRQUVELElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRTtZQUNwQixJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDL0IsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBQSxRQUFRO29CQUN2QyxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQyxDQUFDO2dCQUNILElBQ0ksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsMEJBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2pELENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLDBCQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQ25EO29CQUNFLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxLQUFLLDBCQUFVLENBQUMsYUFBYSxFQUFqQyxDQUFpQyxDQUFDLENBQUM7aUJBQ25FO2dCQUNELE1BQU0sQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2FBQy9CO1NBQ0o7UUFDRCxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNwQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ25CLE1BQU0sQ0FBQyxTQUFTLEdBQUcsa0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDcEQ7U0FDSjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTyxnREFBMEIsR0FBbEMsVUFBbUMsTUFBTSxFQUFFLFVBQVU7UUFDakQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLGFBQVcsR0FBRyxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7WUFDbkMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbEIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDckMsYUFBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztpQkFDMUU7YUFDSjtZQUNEOztlQUVHO1lBQ0gsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUNkLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUN6QixJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDdEMsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7d0JBQ3JDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHOzRCQUNsQixhQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSztnQ0FDckIsSUFDSSxHQUFHLENBQUMsT0FBTztvQ0FDWCxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVc7b0NBQ3ZCLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxLQUFLLE9BQU8sRUFDckM7b0NBQ0UsSUFDSSxHQUFHLENBQUMsSUFBSTt3Q0FDUixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVc7d0NBQ3BCLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQ3JDO3dDQUNFLEtBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztxQ0FDbkM7aUNBQ0o7NEJBQ0wsQ0FBQyxDQUFDLENBQUM7d0JBQ1AsQ0FBQyxDQUFDLENBQUM7cUJBQ047aUJBQ0o7YUFDSjtZQUNELE9BQU8sYUFBVyxDQUFDO1NBQ3RCO2FBQU07WUFDSCxPQUFPLEVBQUUsQ0FBQztTQUNiO0lBQ0wsQ0FBQztJQUVPLDhDQUF3QixHQUFoQyxVQUFpQyxRQUFRLEVBQUUsV0FBVyxFQUFFLFVBQVc7UUFDL0QsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7UUFDOUMsSUFBSSxPQUFPLEdBQVEsRUFBRSxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZFLE9BQU8sQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLFdBQVc7WUFDdkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO1lBQ2xELENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDdEIsSUFBSSxRQUFRLENBQUMsS0FBSyxFQUFFO2dCQUNoQixJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDM0IsSUFBSSxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLFdBQVcsRUFBRTt3QkFDbEQsT0FBTyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDM0Q7aUJBQ0o7YUFDSjtTQUNKO1FBQ0QsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQy9ELElBQUksUUFBUSxDQUFDLElBQUksRUFBRTtZQUNmLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMzQzthQUFNO1lBQ0gsdUJBQXVCO1lBQ3ZCLElBQUksUUFBUSxDQUFDLFdBQVcsRUFBRTtnQkFDdEIsSUFBSSxrQkFBRSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7b0JBQzFDLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUU7d0JBQ2pDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO3FCQUN2RDtpQkFDSjthQUNKO1NBQ0o7UUFDRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssMEJBQVUsQ0FBQyxXQUFXLEVBQUU7WUFDMUMsb0RBQW9EO1lBQ3BELElBQUksUUFBUSxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3pELElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7b0JBQzdCLE9BQU8sQ0FBQyxJQUFJLEdBQUcseUJBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDL0Q7YUFDSjtTQUNKO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVPLDRDQUFzQixHQUE5QixVQUErQixNQUE0QixFQUFFLFVBQXlCO1FBQXRGLGlCQXVFQztRQXRFRyxJQUFJLE1BQU0sR0FBUTtZQUNkLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUk7WUFDdEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3RGLFFBQVEsRUFBRSxPQUFPLE1BQU0sQ0FBQyxhQUFhLEtBQUssV0FBVztZQUNyRCxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ3ZDLGNBQWMsRUFBRSxFQUFFO1lBQ2xCLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQztTQUN0RCxDQUFDO1FBQ0YsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkQsSUFBSSxPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQ3BDLDJCQUEyQjtZQUMzQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQ2YsSUFBSSxNQUFNLEdBQWMsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDdEMsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLEVBQUU7b0JBQ3pCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMseUJBQXlCLENBQ3ZELE1BQU0sRUFDTixNQUFNLENBQUMsZ0JBQWdCLENBQzFCLENBQUM7b0JBQ0YsSUFBSSxVQUFVLEVBQUU7d0JBQ1osSUFBSTs0QkFDQSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLDJCQUEyQixDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUN2RSxJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUM7NEJBQzdDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7NEJBQzlELG9DQUFvQzt5QkFDdkM7d0JBQUMsT0FBTyxLQUFLLEVBQUUsR0FBRTtxQkFDckI7aUJBQ0o7YUFDSjtTQUNKO1FBRUQsSUFBSSxNQUFNLENBQUMsY0FBYyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMzRCxNQUFNLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQUEsYUFBYTtnQkFDM0QsT0FBQSxLQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztZQUE3QixDQUE2QixDQUNoQyxDQUFDO1NBQ0w7UUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDZCxNQUFNLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDbEY7UUFFRCxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUU7WUFDbkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ2hFO1FBRUQsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUM3QixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFFBQVE7b0JBQ3JDLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDekIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsSUFDSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSwwQkFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDakQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsMEJBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDbkQ7b0JBQ0UsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLEtBQUssMEJBQVUsQ0FBQyxhQUFhLEVBQWpDLENBQWlDLENBQUMsQ0FBQztpQkFDbkU7Z0JBQ0QsTUFBTSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7YUFDL0I7U0FDSjtRQUNELElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3BDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtnQkFDbkIsTUFBTSxDQUFDLFNBQVMsR0FBRyxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNwRDtTQUNKO1FBQ0QsSUFBSSxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNqRCxNQUFNLENBQUMsU0FBUyxHQUFHLHdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3RFO2FBQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDL0IsTUFBTSxDQUFDLFNBQVMsR0FBRyx3QkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEQ7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU8saUNBQVcsR0FBbkIsVUFDSSxRQUFnQyxFQUNoQyxZQUEwQixFQUMxQixVQUEwQjtRQUUxQixJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztRQUMvQyxJQUFJLE9BQU8sR0FBUTtZQUNmLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQzdELFlBQVksRUFBRSxRQUFRLENBQUMsV0FBVztnQkFDOUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO2dCQUNsRCxDQUFDLENBQUMsU0FBUztTQUNsQixDQUFDO1FBQ0YsSUFBSSxRQUFRLENBQUMsS0FBSyxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUM5RCxDQUFDO1NBQ0w7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUN0QixJQUFJLFFBQVEsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUM3QyxJQUFJLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssV0FBVyxFQUFFO29CQUNsRCxPQUFPLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUMzRDthQUNKO1NBQ0o7UUFDRCxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFFL0QsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQ2YsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzNDO2FBQU07WUFDSCx1QkFBdUI7WUFDdkIsSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFO2dCQUN0QixJQUFJLGtCQUFFLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRTtvQkFDMUMsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRTt3QkFDakMsT0FBTyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7cUJBQ3ZEO2lCQUNKO2FBQ0o7U0FDSjtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTyxtQ0FBYSxHQUFyQixVQUFzQixHQUE0QjtRQUFsRCxpQkFxQkM7UUFwQkcsSUFBSSxPQUFPLEdBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUN0RSxJQUFJLEdBQUcsQ0FBQyxjQUFjLEVBQUU7WUFDcEIsT0FBTyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDakM7UUFDRCxJQUFJLEdBQUcsQ0FBQyxhQUFhLEVBQUU7WUFDbkIsT0FBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FDM0I7UUFDRCxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUU7WUFDVixJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNmLElBQUksa0JBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2pDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVO3dCQUNsQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQzt3QkFDM0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQztpQkFDWjthQUNKO1NBQ0o7UUFDRCxJQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUU7WUFDakIsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3RFO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVPLHVDQUFpQixHQUF6QixVQUEwQixRQUFRLEVBQUUscUJBQXFCLEVBQUUsVUFBVztRQUF0RSxpQkEyQkM7UUExQkcsSUFBSSxNQUFNLEdBQUcscUJBQXFCLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztRQUN4RCxJQUFJLE9BQU8sR0FBUSxFQUFFLENBQUM7UUFDdEIsT0FBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkUsT0FBTyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsVUFBVTtZQUM5QixDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUF4QixDQUF3QixDQUFDO1lBQzNELENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDVCxPQUFPLENBQUMsYUFBYTtZQUNqQixNQUFNLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQ2IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtvQkFDdkIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNyQixDQUFDLENBQUM7Z0JBQ0osQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNiLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtZQUNoQixPQUFPLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDckY7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUN0QixJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hCLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUMzQixJQUFJLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssV0FBVyxFQUFFO3dCQUNsRCxPQUFPLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUMzRDtpQkFDSjthQUNKO1NBQ0o7UUFDRCxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDL0QsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0FBQyxBQXJzQ0QsSUFxc0NDO0FBcnNDWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAndXRpbCc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgeyB0cywgU3ludGF4S2luZCB9IGZyb20gJ3RzLXNpbXBsZS1hc3QnO1xuXG5pbXBvcnQgeyBnZXROYW1lc0NvbXBhcmVGbiwgbWVyZ2VUYWdzQW5kQXJncywgbWFya2VkdGFncyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWxzL3V0aWxzJztcbmltcG9ydCB7IGtpbmRUb1R5cGUgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlscy9raW5kLXRvLXR5cGUnO1xuaW1wb3J0IHsgSnNkb2NQYXJzZXJVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbHMvanNkb2MtcGFyc2VyLnV0aWwnO1xuaW1wb3J0IHsgaXNJZ25vcmUgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlscyc7XG5pbXBvcnQgQW5ndWxhclZlcnNpb25VdGlsIGZyb20gJy4uLy4uLy4uLy4uLy4uLy91dGlscy9hbmd1bGFyLXZlcnNpb24udXRpbCc7XG5pbXBvcnQgQmFzaWNUeXBlVXRpbCBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlscy9iYXNpYy10eXBlLnV0aWwnO1xuaW1wb3J0IHsgU3RyaW5naWZ5T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24gfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlscy9vYmplY3QtbGl0ZXJhbC1leHByZXNzaW9uLnV0aWwnO1xuXG5pbXBvcnQgRGVwZW5kZW5jaWVzRW5naW5lIGZyb20gJy4uLy4uLy4uLy4uL2VuZ2luZXMvZGVwZW5kZW5jaWVzLmVuZ2luZSc7XG5pbXBvcnQgQ29uZmlndXJhdGlvbiBmcm9tICcuLi8uLi8uLi8uLi9jb25maWd1cmF0aW9uJztcblxuY29uc3QgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5jb25zdCBtYXJrZWQgPSByZXF1aXJlKCdtYXJrZWQnKTtcblxuZXhwb3J0IGNsYXNzIENsYXNzSGVscGVyIHtcbiAgICBwcml2YXRlIGpzZG9jUGFyc2VyVXRpbCA9IG5ldyBKc2RvY1BhcnNlclV0aWwoKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyKSB7fVxuXG4gICAgLyoqXG4gICAgICogSEVMUEVSU1xuICAgICAqL1xuXG4gICAgcHVibGljIHN0cmluZ2lmeURlZmF1bHRWYWx1ZShub2RlOiB0cy5Ob2RlKTogc3RyaW5nIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvcHlyaWdodCBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcFxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKG5vZGUuZ2V0VGV4dCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5nZXRUZXh0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5raW5kID09PSBTeW50YXhLaW5kLkZhbHNlS2V5d29yZCkge1xuICAgICAgICAgICAgcmV0dXJuICdmYWxzZSc7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5raW5kID09PSBTeW50YXhLaW5kLlRydWVLZXl3b3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RydWUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXREZWNvcmF0b3JPZlR5cGUobm9kZSwgZGVjb3JhdG9yVHlwZSkge1xuICAgICAgICBsZXQgZGVjb3JhdG9ycyA9IG5vZGUuZGVjb3JhdG9ycyB8fCBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlY29yYXRvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkZWNvcmF0b3JzW2ldLmV4cHJlc3Npb24uZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgIGlmIChkZWNvcmF0b3JzW2ldLmV4cHJlc3Npb24uZXhwcmVzc2lvbi50ZXh0ID09PSBkZWNvcmF0b3JUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWNvcmF0b3JzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmb3JtYXREZWNvcmF0b3JzKGRlY29yYXRvcnMpIHtcbiAgICAgICAgbGV0IF9kZWNvcmF0b3JzID0gW107XG5cbiAgICAgICAgXy5mb3JFYWNoKGRlY29yYXRvcnMsIChkZWNvcmF0b3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKGRlY29yYXRvci5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRlY29yYXRvci5leHByZXNzaW9uLnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgX2RlY29yYXRvcnMucHVzaCh7IG5hbWU6IGRlY29yYXRvci5leHByZXNzaW9uLnRleHQgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChkZWNvcmF0b3IuZXhwcmVzc2lvbi5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmZvOiBhbnkgPSB7IG5hbWU6IGRlY29yYXRvci5leHByZXNzaW9uLmV4cHJlc3Npb24udGV4dCB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVjb3JhdG9yLmV4cHJlc3Npb24uYXJndW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZvLnN0cmluZ2lmaWVkQXJndW1lbnRzID0gdGhpcy5zdHJpbmdpZnlBcmd1bWVudHMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjb3JhdG9yLmV4cHJlc3Npb24uYXJndW1lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF9kZWNvcmF0b3JzLnB1c2goaW5mbyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gX2RlY29yYXRvcnM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVGdW5jdGlvbihhcmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAoYXJnLmZ1bmN0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke2FyZy5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhhcmcpfTogKCkgPT4gdm9pZGA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYXJndW1zID0gYXJnLmZ1bmN0aW9uLm1hcChhcmd1ID0+IHtcbiAgICAgICAgICAgIGxldCBfcmVzdWx0ID0gRGVwZW5kZW5jaWVzRW5naW5lLmZpbmQoYXJndS50eXBlKTtcbiAgICAgICAgICAgIGlmIChfcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgaWYgKF9yZXN1bHQuc291cmNlID09PSAnaW50ZXJuYWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRoID0gX3Jlc3VsdC5kYXRhLnR5cGU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfcmVzdWx0LmRhdGEudHlwZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9ICdjbGFzc2UnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmd1Lm5hbWV9JHt0aGlzLmdldE9wdGlvbmFsU3RyaW5nKGFyZyl9OiA8YSBocmVmPVwiLi4vJHtwYXRofXMvJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZXN1bHQuZGF0YS5uYW1lXG4gICAgICAgICAgICAgICAgICAgIH0uaHRtbFwiPiR7YXJndS50eXBlfTwvYT5gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRoID0gQW5ndWxhclZlcnNpb25VdGlsLmdldEFwaUxpbmsoXG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVzdWx0LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmFuZ3VsYXJWZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmd1Lm5hbWV9JHt0aGlzLmdldE9wdGlvbmFsU3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnXG4gICAgICAgICAgICAgICAgICAgICl9OiA8YSBocmVmPVwiJHtwYXRofVwiIHRhcmdldD1cIl9ibGFua1wiPiR7YXJndS50eXBlfTwvYT5gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoQmFzaWNUeXBlVXRpbC5pc0tub3duVHlwZShhcmd1LnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBhdGggPSBCYXNpY1R5cGVVdGlsLmdldFR5cGVVcmwoYXJndS50eXBlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7YXJndS5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgYXJnXG4gICAgICAgICAgICAgICAgKX06IDxhIGhyZWY9XCIke3BhdGh9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHthcmd1LnR5cGV9PC9hPmA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChhcmd1Lm5hbWUgJiYgYXJndS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmd1Lm5hbWV9JHt0aGlzLmdldE9wdGlvbmFsU3RyaW5nKGFyZyl9OiAke2FyZ3UudHlwZX1gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmd1Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHthcmd1Lm5hbWUudGV4dH1gO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGAke2FyZy5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhhcmcpfTogKCR7YXJndW1zfSkgPT4gdm9pZGA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRPcHRpb25hbFN0cmluZyhhcmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYXJnLm9wdGlvbmFsID8gJz8nIDogJyc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdHJpbmdpZnlBcmd1bWVudHMoYXJncykge1xuICAgICAgICBsZXQgc3RyaW5naWZ5QXJncyA9IFtdO1xuXG4gICAgICAgIHN0cmluZ2lmeUFyZ3MgPSBhcmdzXG4gICAgICAgICAgICAubWFwKGFyZyA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IF9yZXN1bHQgPSBEZXBlbmRlbmNpZXNFbmdpbmUuZmluZChhcmcudHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKF9yZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9yZXN1bHQuc291cmNlID09PSAnaW50ZXJuYWwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGF0aCA9IF9yZXN1bHQuZGF0YS50eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9yZXN1bHQuZGF0YS50eXBlID09PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9ICdjbGFzc2UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2FyZy5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhhcmcpfTogPGEgaHJlZj1cIi4uLyR7cGF0aH1zLyR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Jlc3VsdC5kYXRhLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0uaHRtbFwiPiR7YXJnLnR5cGV9PC9hPmA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGF0aCA9IEFuZ3VsYXJWZXJzaW9uVXRpbC5nZXRBcGlMaW5rKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXN1bHQuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLm1haW5EYXRhLmFuZ3VsYXJWZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2FyZy5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdcbiAgICAgICAgICAgICAgICAgICAgICAgICl9OiA8YSBocmVmPVwiJHtwYXRofVwiIHRhcmdldD1cIl9ibGFua1wiPiR7YXJnLnR5cGV9PC9hPmA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyZy5kb3REb3REb3RUb2tlbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYC4uLiR7YXJnLm5hbWV9OiAke2FyZy50eXBlfWA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcuZnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRnVuY3Rpb24oYXJnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyZy5leHByZXNzaW9uICYmIGFyZy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmcuZXhwcmVzc2lvbi50ZXh0ICsgJy4nICsgYXJnLm5hbWUudGV4dDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyZy5leHByZXNzaW9uICYmIGFyZy5raW5kID09PSBTeW50YXhLaW5kLk5ld0V4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICduZXcgJyArIGFyZy5leHByZXNzaW9uLnRleHQgKyAnKCknO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgJiYgYXJnLmtpbmQgPT09IFN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCdgICsgYXJnLnRleHQgKyBgJ2A7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCAmJiBhcmcua2luZCA9PT0gU3ludGF4S2luZC5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5naWZ5T2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24oYXJnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEJhc2ljVHlwZVV0aWwuaXNLbm93blR5cGUoYXJnLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRoID0gQmFzaWNUeXBlVXRpbC5nZXRUeXBlVXJsKGFyZy50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2FyZy5uYW1lfSR7dGhpcy5nZXRPcHRpb25hbFN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ1xuICAgICAgICAgICAgICAgICAgICApfTogPGEgaHJlZj1cIiR7cGF0aH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2FyZy50eXBlfTwvYT5gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmcudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmFsU3RyaW5naWZpZWRBcmd1bWVudCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNlcGFyYXRvciA9ICc6JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmcubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsU3RyaW5naWZpZWRBcmd1bWVudCArPSBhcmcubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmcua2luZCA9PT0gU3ludGF4S2luZC5Bc0V4cHJlc3Npb24gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmcuZXhwcmVzc2lvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZy5leHByZXNzaW9uLnRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsU3RyaW5naWZpZWRBcmd1bWVudCArPSBhcmcuZXhwcmVzc2lvbi50ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcGFyYXRvciA9ICcgYXMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZy5vcHRpb25hbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsU3RyaW5naWZpZWRBcmd1bWVudCArPSB0aGlzLmdldE9wdGlvbmFsU3RyaW5nKGFyZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJnLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFN0cmluZ2lmaWVkQXJndW1lbnQgKz0gc2VwYXJhdG9yICsgJyAnICsgdGhpcy52aXNpdFR5cGUoYXJnLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbmFsU3RyaW5naWZpZWRBcmd1bWVudDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcudGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke2FyZy50ZXh0fWA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7YXJnLm5hbWV9JHt0aGlzLmdldE9wdGlvbmFsU3RyaW5nKGFyZyl9YDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuam9pbignLCAnKTtcblxuICAgICAgICByZXR1cm4gc3RyaW5naWZ5QXJncztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFBvc2l0aW9uKG5vZGU6IHRzLk5vZGUsIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiB0cy5MaW5lQW5kQ2hhcmFjdGVyIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uOiB0cy5MaW5lQW5kQ2hhcmFjdGVyO1xuICAgICAgICBpZiAobm9kZS5uYW1lICYmIG5vZGUubmFtZS5lbmQpIHtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gdHMuZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24oc291cmNlRmlsZSwgbm9kZS5uYW1lLmVuZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IHRzLmdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKHNvdXJjZUZpbGUsIG5vZGUucG9zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9zaXRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRBY2Nlc3NvcihhY2Nlc3NvcnMsIG5vZGVBY2Nlc3Nvciwgc291cmNlRmlsZSkge1xuICAgICAgICBsZXQgbm9kZU5hbWUgPSAnJztcbiAgICAgICAgaWYgKG5vZGVBY2Nlc3Nvci5uYW1lKSB7XG4gICAgICAgICAgICBub2RlTmFtZSA9IG5vZGVBY2Nlc3Nvci5uYW1lLnRleHQ7XG4gICAgICAgICAgICBsZXQganNkb2N0YWdzID0gdGhpcy5qc2RvY1BhcnNlclV0aWwuZ2V0SlNEb2NzKG5vZGVBY2Nlc3Nvcik7XG5cbiAgICAgICAgICAgIGlmICghYWNjZXNzb3JzW25vZGVOYW1lXSkge1xuICAgICAgICAgICAgICAgIGFjY2Vzc29yc1tub2RlTmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5vZGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBzZXRTaWduYXR1cmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgZ2V0U2lnbmF0dXJlOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobm9kZUFjY2Vzc29yLmtpbmQgPT09IFN5bnRheEtpbmQuU2V0QWNjZXNzb3IpIHtcbiAgICAgICAgICAgICAgICBsZXQgc2V0U2lnbmF0dXJlID0ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBub2RlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZvaWQnLFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBub2RlQWNjZXNzb3IucGFyYW1ldGVycy5tYXAocGFyYW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwYXJhbS5uYW1lLnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogcGFyYW0udHlwZSA/IGtpbmRUb1R5cGUocGFyYW0udHlwZS5raW5kKSA6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVHlwZTogbm9kZUFjY2Vzc29yLnR5cGUgPyB0aGlzLnZpc2l0VHlwZShub2RlQWNjZXNzb3IudHlwZSkgOiAndm9pZCcsXG4gICAgICAgICAgICAgICAgICAgIGxpbmU6IHRoaXMuZ2V0UG9zaXRpb24obm9kZUFjY2Vzc29yLCBzb3VyY2VGaWxlKS5saW5lICsgMVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZUFjY2Vzc29yLmpzRG9jICYmIG5vZGVBY2Nlc3Nvci5qc0RvYy5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tbWVudCA9IG5vZGVBY2Nlc3Nvci5qc0RvY1swXS5jb21tZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRTaWduYXR1cmUuZGVzY3JpcHRpb24gPSBtYXJrZWQoY29tbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoanNkb2N0YWdzICYmIGpzZG9jdGFncy5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoanNkb2N0YWdzWzBdLnRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFNpZ25hdHVyZS5qc2RvY3RhZ3MgPSBtYXJrZWR0YWdzKGpzZG9jdGFnc1swXS50YWdzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2V0U2lnbmF0dXJlLmpzZG9jdGFncyAmJiBzZXRTaWduYXR1cmUuanNkb2N0YWdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0U2lnbmF0dXJlLmpzZG9jdGFncyA9IG1lcmdlVGFnc0FuZEFyZ3MoXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRTaWduYXR1cmUuYXJncyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFNpZ25hdHVyZS5qc2RvY3RhZ3NcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNldFNpZ25hdHVyZS5hcmdzICYmIHNldFNpZ25hdHVyZS5hcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0U2lnbmF0dXJlLmpzZG9jdGFncyA9IG1lcmdlVGFnc0FuZEFyZ3Moc2V0U2lnbmF0dXJlLmFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGFjY2Vzc29yc1tub2RlTmFtZV0uc2V0U2lnbmF0dXJlID0gc2V0U2lnbmF0dXJlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGVBY2Nlc3Nvci5raW5kID09PSBTeW50YXhLaW5kLkdldEFjY2Vzc29yKSB7XG4gICAgICAgICAgICAgICAgbGV0IGdldFNpZ25hdHVyZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbm9kZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IG5vZGVBY2Nlc3Nvci50eXBlID8ga2luZFRvVHlwZShub2RlQWNjZXNzb3IudHlwZS5raW5kKSA6ICcnLFxuICAgICAgICAgICAgICAgICAgICByZXR1cm5UeXBlOiBub2RlQWNjZXNzb3IudHlwZSA/IHRoaXMudmlzaXRUeXBlKG5vZGVBY2Nlc3Nvci50eXBlKSA6ICcnLFxuICAgICAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLmdldFBvc2l0aW9uKG5vZGVBY2Nlc3Nvciwgc291cmNlRmlsZSkubGluZSArIDFcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGVBY2Nlc3Nvci5qc0RvYyAmJiBub2RlQWNjZXNzb3IuanNEb2MubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbW1lbnQgPSBub2RlQWNjZXNzb3IuanNEb2NbMF0uY29tbWVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21tZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0U2lnbmF0dXJlLmRlc2NyaXB0aW9uID0gbWFya2VkKGNvbW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGpzZG9jdGFncyAmJiBqc2RvY3RhZ3MubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpzZG9jdGFnc1swXS50YWdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRTaWduYXR1cmUuanNkb2N0YWdzID0gbWFya2VkdGFncyhqc2RvY3RhZ3NbMF0udGFncyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhY2Nlc3NvcnNbbm9kZU5hbWVdLmdldFNpZ25hdHVyZSA9IGdldFNpZ25hdHVyZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaXNEaXJlY3RpdmVEZWNvcmF0b3IoZGVjb3JhdG9yOiB0cy5EZWNvcmF0b3IpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGRlY29yYXRvci5leHByZXNzaW9uLmV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIGxldCBkZWNvcmF0b3JJZGVudGlmaWVyVGV4dCA9IGRlY29yYXRvci5leHByZXNzaW9uLmV4cHJlc3Npb24udGV4dDtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgZGVjb3JhdG9ySWRlbnRpZmllclRleHQgPT09ICdEaXJlY3RpdmUnIHx8IGRlY29yYXRvcklkZW50aWZpZXJUZXh0ID09PSAnQ29tcG9uZW50J1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaXNTZXJ2aWNlRGVjb3JhdG9yKGRlY29yYXRvcikge1xuICAgICAgICByZXR1cm4gZGVjb3JhdG9yLmV4cHJlc3Npb24uZXhwcmVzc2lvblxuICAgICAgICAgICAgPyBkZWNvcmF0b3IuZXhwcmVzc2lvbi5leHByZXNzaW9uLnRleHQgPT09ICdJbmplY3RhYmxlJ1xuICAgICAgICAgICAgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzUHJpdmF0ZShtZW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvcHlyaWdodCBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcFxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKG1lbWJlci5tb2RpZmllcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzUHJpdmF0ZTogYm9vbGVhbiA9IG1lbWJlci5tb2RpZmllcnMuc29tZShcbiAgICAgICAgICAgICAgICBtb2RpZmllciA9PiBtb2RpZmllci5raW5kID09PSBTeW50YXhLaW5kLlByaXZhdGVLZXl3b3JkXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGlzUHJpdmF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmlzSGlkZGVuTWVtYmVyKG1lbWJlcik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1Byb3RlY3RlZChtZW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKG1lbWJlci5tb2RpZmllcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzUHJvdGVjdGVkOiBib29sZWFuID0gbWVtYmVyLm1vZGlmaWVycy5zb21lKFxuICAgICAgICAgICAgICAgIG1vZGlmaWVyID0+IG1vZGlmaWVyLmtpbmQgPT09IFN5bnRheEtpbmQuUHJvdGVjdGVkS2V5d29yZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChpc1Byb3RlY3RlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmlzSGlkZGVuTWVtYmVyKG1lbWJlcik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0ludGVybmFsKG1lbWJlcik6IGJvb2xlYW4ge1xuICAgICAgICAvKipcbiAgICAgICAgICogQ29weXJpZ2h0IGh0dHBzOi8vZ2l0aHViLmNvbS9uZy1ib290c3RyYXAvbmctYm9vdHN0cmFwXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBpbnRlcm5hbFRhZ3M6IHN0cmluZ1tdID0gWydpbnRlcm5hbCddO1xuICAgICAgICBpZiAobWVtYmVyLmpzRG9jKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGRvYyBvZiBtZW1iZXIuanNEb2MpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9jLnRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCB0YWcgb2YgZG9jLnRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcm5hbFRhZ3MuaW5kZXhPZih0YWcudGFnTmFtZS50ZXh0KSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNQdWJsaWMobWVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChtZW1iZXIubW9kaWZpZXJzKSB7XG4gICAgICAgICAgICBjb25zdCBpc1B1YmxpYzogYm9vbGVhbiA9IG1lbWJlci5tb2RpZmllcnMuc29tZShcbiAgICAgICAgICAgICAgICBtb2RpZmllciA9PiBtb2RpZmllci5raW5kID09PSBTeW50YXhLaW5kLlB1YmxpY0tleXdvcmRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoaXNQdWJsaWMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5pc0hpZGRlbk1lbWJlcihtZW1iZXIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNIaWRkZW5NZW1iZXIobWVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb3B5cmlnaHQgaHR0cHM6Ly9naXRodWIuY29tL25nLWJvb3RzdHJhcC9uZy1ib290c3RyYXBcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGludGVybmFsVGFnczogc3RyaW5nW10gPSBbJ2hpZGRlbiddO1xuICAgICAgICBpZiAobWVtYmVyLmpzRG9jKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGRvYyBvZiBtZW1iZXIuanNEb2MpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9jLnRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCB0YWcgb2YgZG9jLnRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcm5hbFRhZ3MuaW5kZXhPZih0YWcudGFnTmFtZS50ZXh0KSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNQaXBlRGVjb3JhdG9yKGRlY29yYXRvcikge1xuICAgICAgICByZXR1cm4gZGVjb3JhdG9yLmV4cHJlc3Npb24uZXhwcmVzc2lvblxuICAgICAgICAgICAgPyBkZWNvcmF0b3IuZXhwcmVzc2lvbi5leHByZXNzaW9uLnRleHQgPT09ICdQaXBlJ1xuICAgICAgICAgICAgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzTW9kdWxlRGVjb3JhdG9yKGRlY29yYXRvcikge1xuICAgICAgICByZXR1cm4gZGVjb3JhdG9yLmV4cHJlc3Npb24uZXhwcmVzc2lvblxuICAgICAgICAgICAgPyBkZWNvcmF0b3IuZXhwcmVzc2lvbi5leHByZXNzaW9uLnRleHQgPT09ICdOZ01vZHVsZSdcbiAgICAgICAgICAgIDogZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVklTSVRFUlNcbiAgICAgKi9cblxuICAgIHB1YmxpYyB2aXNpdENsYXNzRGVjbGFyYXRpb24oXG4gICAgICAgIGZpbGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIGNsYXNzRGVjbGFyYXRpb246IHRzLkNsYXNzRGVjbGFyYXRpb24gfCB0cy5JbnRlcmZhY2VEZWNsYXJhdGlvbixcbiAgICAgICAgc291cmNlRmlsZT86IHRzLlNvdXJjZUZpbGVcbiAgICApOiBhbnkge1xuICAgICAgICBsZXQgc3ltYm9sID0gdGhpcy50eXBlQ2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKGNsYXNzRGVjbGFyYXRpb24ubmFtZSk7XG4gICAgICAgIGxldCByYXdkZXNjcmlwdGlvbiA9ICcnO1xuICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSAnJztcbiAgICAgICAgaWYgKHN5bWJvbCkge1xuICAgICAgICAgICAgcmF3ZGVzY3JpcHRpb24gPSB0aGlzLmpzZG9jUGFyc2VyVXRpbC5nZXRNYWluQ29tbWVudE9mTm9kZShjbGFzc0RlY2xhcmF0aW9uKTtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gbWFya2VkKHRoaXMuanNkb2NQYXJzZXJVdGlsLmdldE1haW5Db21tZW50T2ZOb2RlKGNsYXNzRGVjbGFyYXRpb24pKTtcbiAgICAgICAgICAgIGlmIChzeW1ib2wudmFsdWVEZWNsYXJhdGlvbiAmJiBpc0lnbm9yZShzeW1ib2wudmFsdWVEZWNsYXJhdGlvbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3sgaWdub3JlOiB0cnVlIH1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN5bWJvbC5kZWNsYXJhdGlvbnMgJiYgc3ltYm9sLmRlY2xhcmF0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzSWdub3JlKHN5bWJvbC5kZWNsYXJhdGlvbnNbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbeyBpZ25vcmU6IHRydWUgfV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBjbGFzc05hbWUgPSBjbGFzc0RlY2xhcmF0aW9uLm5hbWUudGV4dDtcbiAgICAgICAgbGV0IG1lbWJlcnM7XG4gICAgICAgIGxldCBpbXBsZW1lbnRzRWxlbWVudHMgPSBbXTtcbiAgICAgICAgbGV0IGV4dGVuZHNFbGVtZW50O1xuICAgICAgICBsZXQganNkb2N0YWdzID0gW107XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0cy5nZXRDbGFzc0ltcGxlbWVudHNIZXJpdGFnZUNsYXVzZUVsZW1lbnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbGV0IGltcGxlbWVudGVkVHlwZXMgPSB0cy5nZXRDbGFzc0ltcGxlbWVudHNIZXJpdGFnZUNsYXVzZUVsZW1lbnRzKGNsYXNzRGVjbGFyYXRpb24pO1xuICAgICAgICAgICAgaWYgKGltcGxlbWVudGVkVHlwZXMpIHtcbiAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICAgICAgbGV0IGxlbiA9IGltcGxlbWVudGVkVHlwZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbXBsZW1lbnRlZFR5cGVzW2ldLmV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcGxlbWVudHNFbGVtZW50cy5wdXNoKGltcGxlbWVudGVkVHlwZXNbaV0uZXhwcmVzc2lvbi50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdHMuZ2V0Q2xhc3NFeHRlbmRzSGVyaXRhZ2VDbGF1c2VFbGVtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbGV0IGV4dGVuZHNUeXBlcyA9IHRzLmdldENsYXNzRXh0ZW5kc0hlcml0YWdlQ2xhdXNlRWxlbWVudChjbGFzc0RlY2xhcmF0aW9uKTtcbiAgICAgICAgICAgIGlmIChleHRlbmRzVHlwZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXh0ZW5kc1R5cGVzLmV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kc0VsZW1lbnQgPSBleHRlbmRzVHlwZXMuZXhwcmVzc2lvbi50ZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzeW1ib2wpIHtcbiAgICAgICAgICAgIGlmIChzeW1ib2wudmFsdWVEZWNsYXJhdGlvbikge1xuICAgICAgICAgICAgICAgIGpzZG9jdGFncyA9IHRoaXMuanNkb2NQYXJzZXJVdGlsLmdldEpTRG9jcyhzeW1ib2wudmFsdWVEZWNsYXJhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBtZW1iZXJzID0gdGhpcy52aXNpdE1lbWJlcnMoY2xhc3NEZWNsYXJhdGlvbi5tZW1iZXJzLCBzb3VyY2VGaWxlKTtcblxuICAgICAgICBpZiAoY2xhc3NEZWNsYXJhdGlvbi5kZWNvcmF0b3JzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzRGVjbGFyYXRpb24uZGVjb3JhdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRGlyZWN0aXZlRGVjb3JhdG9yKGNsYXNzRGVjbGFyYXRpb24uZGVjb3JhdG9yc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmF3ZGVzY3JpcHRpb246IHJhd2Rlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBtZW1iZXJzLmlucHV0cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dHM6IG1lbWJlcnMub3V0cHV0cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvc3RCaW5kaW5nczogbWVtYmVycy5ob3N0QmluZGluZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBob3N0TGlzdGVuZXJzOiBtZW1iZXJzLmhvc3RMaXN0ZW5lcnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiBtZW1iZXJzLnByb3BlcnRpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2RzOiBtZW1iZXJzLm1ldGhvZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleFNpZ25hdHVyZXM6IG1lbWJlcnMuaW5kZXhTaWduYXR1cmVzLFxuICAgICAgICAgICAgICAgICAgICAgICAga2luZDogbWVtYmVycy5raW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3RydWN0b3I6IG1lbWJlcnMuY29uc3RydWN0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBqc2RvY3RhZ3M6IGpzZG9jdGFncyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuZHM6IGV4dGVuZHNFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1wbGVtZW50czogaW1wbGVtZW50c0VsZW1lbnRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzb3JzOiBtZW1iZXJzLmFjY2Vzc29yc1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1NlcnZpY2VEZWNvcmF0b3IoY2xhc3NEZWNsYXJhdGlvbi5kZWNvcmF0b3JzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXdkZXNjcmlwdGlvbjogcmF3ZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kczogbWVtYmVycy5tZXRob2RzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4U2lnbmF0dXJlczogbWVtYmVycy5pbmRleFNpZ25hdHVyZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogbWVtYmVycy5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtpbmQ6IG1lbWJlcnMua2luZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvcjogbWVtYmVycy5jb25zdHJ1Y3RvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2RvY3RhZ3M6IGpzZG9jdGFncyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRlbmRzOiBleHRlbmRzRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBsZW1lbnRzOiBpbXBsZW1lbnRzRWxlbWVudHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzb3JzOiBtZW1iZXJzLmFjY2Vzc29yc1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1BpcGVEZWNvcmF0b3IoY2xhc3NEZWNsYXJhdGlvbi5kZWNvcmF0b3JzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXdkZXNjcmlwdGlvbjogcmF3ZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNkb2N0YWdzOiBqc2RvY3RhZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogbWVtYmVycy5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZHM6IG1lbWJlcnMubWV0aG9kc1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc01vZHVsZURlY29yYXRvcihjbGFzc0RlY2xhcmF0aW9uLmRlY29yYXRvcnNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhd2Rlc2NyaXB0aW9uOiByYXdkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2RvY3RhZ3M6IGpzZG9jdGFncyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2RzOiBtZW1iZXJzLm1ldGhvZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhd2Rlc2NyaXB0aW9uOiByYXdkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2RzOiBtZW1iZXJzLm1ldGhvZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhTaWduYXR1cmVzOiBtZW1iZXJzLmluZGV4U2lnbmF0dXJlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiBtZW1iZXJzLnByb3BlcnRpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2luZDogbWVtYmVycy5raW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yOiBtZW1iZXJzLmNvbnN0cnVjdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzZG9jdGFnczoganNkb2N0YWdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuZHM6IGV4dGVuZHNFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcGxlbWVudHM6IGltcGxlbWVudHNFbGVtZW50cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3NvcnM6IG1lbWJlcnMuYWNjZXNzb3JzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgIHJhd2Rlc2NyaXB0aW9uOiByYXdkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBtZW1iZXJzLmlucHV0cyxcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0czogbWVtYmVycy5vdXRwdXRzLFxuICAgICAgICAgICAgICAgICAgICBob3N0QmluZGluZ3M6IG1lbWJlcnMuaG9zdEJpbmRpbmdzLFxuICAgICAgICAgICAgICAgICAgICBob3N0TGlzdGVuZXJzOiBtZW1iZXJzLmhvc3RMaXN0ZW5lcnMsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZHM6IG1lbWJlcnMubWV0aG9kcyxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhTaWduYXR1cmVzOiBtZW1iZXJzLmluZGV4U2lnbmF0dXJlcyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogbWVtYmVycy5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgICAgICBraW5kOiBtZW1iZXJzLmtpbmQsXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yOiBtZW1iZXJzLmNvbnN0cnVjdG9yLFxuICAgICAgICAgICAgICAgICAgICBqc2RvY3RhZ3M6IGpzZG9jdGFncyxcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kczogZXh0ZW5kc0VsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIGltcGxlbWVudHM6IGltcGxlbWVudHNFbGVtZW50cyxcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzb3JzOiBtZW1iZXJzLmFjY2Vzc29yc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kczogbWVtYmVycy5tZXRob2RzLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dHM6IG1lbWJlcnMuaW5wdXRzLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRzOiBtZW1iZXJzLm91dHB1dHMsXG4gICAgICAgICAgICAgICAgICAgIGhvc3RCaW5kaW5nczogbWVtYmVycy5ob3N0QmluZGluZ3MsXG4gICAgICAgICAgICAgICAgICAgIGhvc3RMaXN0ZW5lcnM6IG1lbWJlcnMuaG9zdExpc3RlbmVycyxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhTaWduYXR1cmVzOiBtZW1iZXJzLmluZGV4U2lnbmF0dXJlcyxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogbWVtYmVycy5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgICAgICBraW5kOiBtZW1iZXJzLmtpbmQsXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yOiBtZW1iZXJzLmNvbnN0cnVjdG9yLFxuICAgICAgICAgICAgICAgICAgICBqc2RvY3RhZ3M6IGpzZG9jdGFncyxcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kczogZXh0ZW5kc0VsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIGltcGxlbWVudHM6IGltcGxlbWVudHNFbGVtZW50cyxcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzb3JzOiBtZW1iZXJzLmFjY2Vzc29yc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdE1lbWJlcnMobWVtYmVycywgc291cmNlRmlsZSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQ29weXJpZ2h0IGh0dHBzOi8vZ2l0aHViLmNvbS9uZy1ib290c3RyYXAvbmctYm9vdHN0cmFwXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgaW5wdXRzID0gW107XG4gICAgICAgIGxldCBvdXRwdXRzID0gW107XG4gICAgICAgIGxldCBob3N0QmluZGluZ3MgPSBbXTtcbiAgICAgICAgbGV0IGhvc3RMaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgbGV0IG1ldGhvZHMgPSBbXTtcbiAgICAgICAgbGV0IHByb3BlcnRpZXMgPSBbXTtcbiAgICAgICAgbGV0IGluZGV4U2lnbmF0dXJlcyA9IFtdO1xuICAgICAgICBsZXQga2luZDtcbiAgICAgICAgbGV0IGlucHV0RGVjb3JhdG9yO1xuICAgICAgICBsZXQgaG9zdEJpbmRpbmc7XG4gICAgICAgIGxldCBob3N0TGlzdGVuZXI7XG4gICAgICAgIGxldCBjb25zdHJ1Y3RvcjtcbiAgICAgICAgbGV0IG91dERlY29yYXRvcjtcbiAgICAgICAgbGV0IGFjY2Vzc29ycyA9IHt9O1xuICAgICAgICBsZXQgcmVzdWx0ID0ge307XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZW1iZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBBbGxvd3MgdHlwZXNjcmlwdCBndWVzcyB0eXBlIHdoZW4gdXNpbmcgdHMuaXMqXG4gICAgICAgICAgICBsZXQgbWVtYmVyID0gbWVtYmVyc1tpXTtcblxuICAgICAgICAgICAgaW5wdXREZWNvcmF0b3IgPSB0aGlzLmdldERlY29yYXRvck9mVHlwZShtZW1iZXIsICdJbnB1dCcpO1xuICAgICAgICAgICAgb3V0RGVjb3JhdG9yID0gdGhpcy5nZXREZWNvcmF0b3JPZlR5cGUobWVtYmVyLCAnT3V0cHV0Jyk7XG4gICAgICAgICAgICBob3N0QmluZGluZyA9IHRoaXMuZ2V0RGVjb3JhdG9yT2ZUeXBlKG1lbWJlciwgJ0hvc3RCaW5kaW5nJyk7XG4gICAgICAgICAgICBob3N0TGlzdGVuZXIgPSB0aGlzLmdldERlY29yYXRvck9mVHlwZShtZW1iZXIsICdIb3N0TGlzdGVuZXInKTtcblxuICAgICAgICAgICAga2luZCA9IG1lbWJlci5raW5kO1xuXG4gICAgICAgICAgICBpZiAoaXNJZ25vcmUobWVtYmVyKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW5wdXREZWNvcmF0b3IpIHtcbiAgICAgICAgICAgICAgICBpbnB1dHMucHVzaCh0aGlzLnZpc2l0SW5wdXRBbmRIb3N0QmluZGluZyhtZW1iZXIsIGlucHV0RGVjb3JhdG9yLCBzb3VyY2VGaWxlKSk7XG4gICAgICAgICAgICAgICAgaWYgKHRzLmlzU2V0QWNjZXNzb3JEZWNsYXJhdGlvbihtZW1iZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQWNjZXNzb3IoYWNjZXNzb3JzLCBtZW1iZXJzW2ldLCBzb3VyY2VGaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG91dERlY29yYXRvcikge1xuICAgICAgICAgICAgICAgIG91dHB1dHMucHVzaCh0aGlzLnZpc2l0T3V0cHV0KG1lbWJlciwgb3V0RGVjb3JhdG9yLCBzb3VyY2VGaWxlKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGhvc3RCaW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgaG9zdEJpbmRpbmdzLnB1c2godGhpcy52aXNpdElucHV0QW5kSG9zdEJpbmRpbmcobWVtYmVyLCBob3N0QmluZGluZywgc291cmNlRmlsZSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChob3N0TGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBob3N0TGlzdGVuZXJzLnB1c2godGhpcy52aXNpdEhvc3RMaXN0ZW5lcihtZW1iZXIsIGhvc3RMaXN0ZW5lciwgc291cmNlRmlsZSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5pc0hpZGRlbk1lbWJlcihtZW1iZXIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEodGhpcy5pc1ByaXZhdGUobWVtYmVyKSAmJiBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVQcml2YXRlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoISh0aGlzLmlzSW50ZXJuYWwobWVtYmVyKSAmJiBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVJbnRlcm5hbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhKHRoaXMuaXNQcm90ZWN0ZWQobWVtYmVyKSAmJiBDb25maWd1cmF0aW9uLm1haW5EYXRhLmRpc2FibGVQcm90ZWN0ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHMuaXNNZXRob2REZWNsYXJhdGlvbihtZW1iZXIpIHx8IHRzLmlzTWV0aG9kU2lnbmF0dXJlKG1lbWJlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy5wdXNoKHRoaXMudmlzaXRNZXRob2REZWNsYXJhdGlvbihtZW1iZXIsIHNvdXJjZUZpbGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cy5pc1Byb3BlcnR5RGVjbGFyYXRpb24obWVtYmVyKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cy5pc1Byb3BlcnR5U2lnbmF0dXJlKG1lbWJlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHRoaXMudmlzaXRQcm9wZXJ0eShtZW1iZXIsIHNvdXJjZUZpbGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRzLmlzQ2FsbFNpZ25hdHVyZURlY2xhcmF0aW9uKG1lbWJlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHRoaXMudmlzaXRDYWxsRGVjbGFyYXRpb24obWVtYmVyLCBzb3VyY2VGaWxlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHMuaXNHZXRBY2Nlc3NvckRlY2xhcmF0aW9uKG1lbWJlcikgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHMuaXNTZXRBY2Nlc3NvckRlY2xhcmF0aW9uKG1lbWJlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRBY2Nlc3NvcihhY2Nlc3NvcnMsIG1lbWJlcnNbaV0sIHNvdXJjZUZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHMuaXNJbmRleFNpZ25hdHVyZURlY2xhcmF0aW9uKG1lbWJlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhTaWduYXR1cmVzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpc2l0SW5kZXhEZWNsYXJhdGlvbihtZW1iZXIsIHNvdXJjZUZpbGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0cy5pc0NvbnN0cnVjdG9yRGVjbGFyYXRpb24obWVtYmVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgX2NvbnN0cnVjdG9yUHJvcGVydGllcyA9IHRoaXMudmlzaXRDb25zdHJ1Y3RvclByb3BlcnRpZXMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxlbiA9IF9jb25zdHJ1Y3RvclByb3BlcnRpZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGo7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKF9jb25zdHJ1Y3RvclByb3BlcnRpZXNbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yID0gdGhpcy52aXNpdENvbnN0cnVjdG9yRGVjbGFyYXRpb24obWVtYmVyLCBzb3VyY2VGaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbnB1dHMuc29ydChnZXROYW1lc0NvbXBhcmVGbigpKTtcbiAgICAgICAgb3V0cHV0cy5zb3J0KGdldE5hbWVzQ29tcGFyZUZuKCkpO1xuICAgICAgICBob3N0QmluZGluZ3Muc29ydChnZXROYW1lc0NvbXBhcmVGbigpKTtcbiAgICAgICAgaG9zdExpc3RlbmVycy5zb3J0KGdldE5hbWVzQ29tcGFyZUZuKCkpO1xuICAgICAgICBwcm9wZXJ0aWVzLnNvcnQoZ2V0TmFtZXNDb21wYXJlRm4oKSk7XG4gICAgICAgIG1ldGhvZHMuc29ydChnZXROYW1lc0NvbXBhcmVGbigpKTtcbiAgICAgICAgaW5kZXhTaWduYXR1cmVzLnNvcnQoZ2V0TmFtZXNDb21wYXJlRm4oKSk7XG5cbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgaW5wdXRzLFxuICAgICAgICAgICAgb3V0cHV0cyxcbiAgICAgICAgICAgIGhvc3RCaW5kaW5ncyxcbiAgICAgICAgICAgIGhvc3RMaXN0ZW5lcnMsXG4gICAgICAgICAgICBtZXRob2RzLFxuICAgICAgICAgICAgcHJvcGVydGllcyxcbiAgICAgICAgICAgIGluZGV4U2lnbmF0dXJlcyxcbiAgICAgICAgICAgIGtpbmQsXG4gICAgICAgICAgICBjb25zdHJ1Y3RvclxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhhY2Nlc3NvcnMpLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzdWx0WydhY2Nlc3NvcnMnXSA9IGFjY2Vzc29ycztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdFR5cGVOYW1lKHR5cGVOYW1lOiB0cy5JZGVudGlmaWVyKSB7XG4gICAgICAgIGlmICh0eXBlTmFtZS50ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZU5hbWUudGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYCR7dGhpcy52aXNpdFR5cGVOYW1lKHR5cGVOYW1lLmxlZnQpfS4ke3RoaXMudmlzaXRUeXBlTmFtZSh0eXBlTmFtZS5yaWdodCl9YDtcbiAgICB9XG5cbiAgICBwdWJsaWMgdmlzaXRUeXBlKG5vZGUpOiBzdHJpbmcge1xuICAgICAgICBsZXQgX3JldHVybiA9ICd2b2lkJztcblxuICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBfcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vZGUudHlwZU5hbWUpIHtcbiAgICAgICAgICAgIF9yZXR1cm4gPSB0aGlzLnZpc2l0VHlwZU5hbWUobm9kZS50eXBlTmFtZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS50eXBlKSB7XG4gICAgICAgICAgICBpZiAobm9kZS50eXBlLmtpbmQpIHtcbiAgICAgICAgICAgICAgICBfcmV0dXJuID0ga2luZFRvVHlwZShub2RlLnR5cGUua2luZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS50eXBlLnR5cGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgX3JldHVybiA9IHRoaXMudmlzaXRUeXBlTmFtZShub2RlLnR5cGUudHlwZU5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUudHlwZS50eXBlQXJndW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgX3JldHVybiArPSAnPCc7XG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZUFyZ3VtZW50cyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYXJndW1lbnQgb2Ygbm9kZS50eXBlLnR5cGVBcmd1bWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZUFyZ3VtZW50cy5wdXNoKHRoaXMudmlzaXRUeXBlKGFyZ3VtZW50KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0gdHlwZUFyZ3VtZW50cy5qb2luKCcgfCAnKTtcbiAgICAgICAgICAgICAgICBfcmV0dXJuICs9ICc+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnR5cGUuZWxlbWVudFR5cGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBfZmlyc3RQYXJ0ID0gdGhpcy52aXNpdFR5cGUobm9kZS50eXBlLmVsZW1lbnRUeXBlKTtcbiAgICAgICAgICAgICAgICBfcmV0dXJuID0gX2ZpcnN0UGFydCArIGtpbmRUb1R5cGUobm9kZS50eXBlLmtpbmQpO1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnR5cGUuZWxlbWVudFR5cGUua2luZCA9PT0gU3ludGF4S2luZC5QYXJlbnRoZXNpemVkVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBfcmV0dXJuID0gJygnICsgX2ZpcnN0UGFydCArICcpJyArIGtpbmRUb1R5cGUobm9kZS50eXBlLmtpbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnR5cGUudHlwZXMgJiYgdHMuaXNVbmlvblR5cGVOb2RlKG5vZGUudHlwZSkpIHtcbiAgICAgICAgICAgICAgICBfcmV0dXJuID0gJyc7XG4gICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgICAgIGxldCBsZW4gPSBub2RlLnR5cGUudHlwZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0eXBlID0gbm9kZS50eXBlLnR5cGVzW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlLmVsZW1lbnRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfZmlyc3RQYXJ0ID0gdGhpcy52aXNpdFR5cGUodHlwZS5lbGVtZW50VHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS5lbGVtZW50VHlwZS5raW5kID09PSBTeW50YXhLaW5kLlBhcmVudGhlc2l6ZWRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JldHVybiArPSAnKCcgKyBfZmlyc3RQYXJ0ICsgJyknICsga2luZFRvVHlwZSh0eXBlLmtpbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmV0dXJuICs9IF9maXJzdFBhcnQgKyBraW5kVG9UeXBlKHR5cGUua2luZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmV0dXJuICs9IGtpbmRUb1R5cGUodHlwZS5raW5kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cy5pc0xpdGVyYWxUeXBlTm9kZSh0eXBlKSAmJiB0eXBlLmxpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmV0dXJuICs9ICdcIicgKyB0eXBlLmxpdGVyYWwudGV4dCArICdcIic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS50eXBlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0gdGhpcy52aXNpdFR5cGVOYW1lKHR5cGUudHlwZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUudHlwZUFyZ3VtZW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0gJzwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVBcmd1bWVudHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGFyZ3VtZW50IG9mIHR5cGUudHlwZUFyZ3VtZW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlQXJndW1lbnRzLnB1c2godGhpcy52aXNpdFR5cGUoYXJndW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JldHVybiArPSB0eXBlQXJndW1lbnRzLmpvaW4oJyB8ICcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0gJz4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpIDwgbGVuIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3JldHVybiArPSAnIHwgJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnR5cGUuZWxlbWVudFR5cGVzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnRUeXBlcyA9IG5vZGUudHlwZS5lbGVtZW50VHlwZXM7XG4gICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgICAgIGxldCBsZW4gPSBlbGVtZW50VHlwZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIF9yZXR1cm4gPSAnWyc7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IGVsZW1lbnRUeXBlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0ga2luZFRvVHlwZSh0eXBlLmtpbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRzLmlzTGl0ZXJhbFR5cGVOb2RlKHR5cGUpICYmIHR5cGUubGl0ZXJhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0gJ1wiJyArIHR5cGUubGl0ZXJhbC50ZXh0ICsgJ1wiJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlLnR5cGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JldHVybiArPSB0aGlzLnZpc2l0VHlwZU5hbWUodHlwZS50eXBlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IGxlbiAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmV0dXJuICs9ICcsICc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX3JldHVybiArPSAnXSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUuZWxlbWVudFR5cGUpIHtcbiAgICAgICAgICAgIF9yZXR1cm4gPSBraW5kVG9UeXBlKG5vZGUuZWxlbWVudFR5cGUua2luZCkgKyBraW5kVG9UeXBlKG5vZGUua2luZCk7XG4gICAgICAgICAgICBpZiAobm9kZS5lbGVtZW50VHlwZS50eXBlTmFtZSkge1xuICAgICAgICAgICAgICAgIF9yZXR1cm4gPSB0aGlzLnZpc2l0VHlwZU5hbWUobm9kZS5lbGVtZW50VHlwZS50eXBlTmFtZSkgKyBraW5kVG9UeXBlKG5vZGUua2luZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS50eXBlcyAmJiB0cy5pc1VuaW9uVHlwZU5vZGUobm9kZSkpIHtcbiAgICAgICAgICAgIF9yZXR1cm4gPSAnJztcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGxldCBsZW4gPSBub2RlLnR5cGVzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBub2RlLnR5cGVzW2ldO1xuICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0ga2luZFRvVHlwZSh0eXBlLmtpbmQpO1xuICAgICAgICAgICAgICAgIGlmICh0cy5pc0xpdGVyYWxUeXBlTm9kZSh0eXBlKSAmJiB0eXBlLmxpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgX3JldHVybiArPSAnXCInICsgdHlwZS5saXRlcmFsLnRleHQgKyAnXCInO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZS50eXBlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBfcmV0dXJuICs9IHRoaXMudmlzaXRUeXBlTmFtZSh0eXBlLnR5cGVOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBsZW4gLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0gJyB8ICc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUuZG90RG90RG90VG9rZW4pIHtcbiAgICAgICAgICAgIF9yZXR1cm4gPSAnYW55W10nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3JldHVybiA9IGtpbmRUb1R5cGUobm9kZS5raW5kKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBfcmV0dXJuID09PSAnJyAmJlxuICAgICAgICAgICAgICAgIG5vZGUuaW5pdGlhbGl6ZXIgJiZcbiAgICAgICAgICAgICAgICBub2RlLmluaXRpYWxpemVyLmtpbmQgJiZcbiAgICAgICAgICAgICAgICAobm9kZS5raW5kID09PSBTeW50YXhLaW5kLlByb3BlcnR5RGVjbGFyYXRpb24gfHwgbm9kZS5raW5kID09PSBTeW50YXhLaW5kLlBhcmFtZXRlcilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIF9yZXR1cm4gPSBraW5kVG9UeXBlKG5vZGUuaW5pdGlhbGl6ZXIua2luZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5raW5kID09PSBTeW50YXhLaW5kLlR5cGVQYXJhbWV0ZXIpIHtcbiAgICAgICAgICAgICAgICBfcmV0dXJuID0gbm9kZS5uYW1lLnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5raW5kID09PSBTeW50YXhLaW5kLkxpdGVyYWxUeXBlKSB7XG4gICAgICAgICAgICAgICAgX3JldHVybiA9IG5vZGUubGl0ZXJhbC50ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnR5cGVBcmd1bWVudHMgJiYgbm9kZS50eXBlQXJndW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIF9yZXR1cm4gKz0gJzwnO1xuICAgICAgICAgICAgbGV0IGkgPSAwLFxuICAgICAgICAgICAgICAgIGxlbiA9IG5vZGUudHlwZUFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBhcmd1bWVudCA9IG5vZGUudHlwZUFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgICAgICBfcmV0dXJuICs9IHRoaXMudmlzaXRUeXBlKGFyZ3VtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAoaSA+PSAwICYmIGkgPCBsZW4gLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIF9yZXR1cm4gKz0gJywgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfcmV0dXJuICs9ICc+JztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3JldHVybjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZpc2l0Q2FsbERlY2xhcmF0aW9uKG1ldGhvZDogdHMuQ2FsbFNpZ25hdHVyZURlY2xhcmF0aW9uLCBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKSB7XG4gICAgICAgIGxldCBzb3VyY2VDb2RlID0gc291cmNlRmlsZS5nZXRUZXh0KCk7XG4gICAgICAgIGxldCBoYXNoID0gY3J5cHRvXG4gICAgICAgICAgICAuY3JlYXRlSGFzaCgnbWQ1JylcbiAgICAgICAgICAgIC51cGRhdGUoc291cmNlQ29kZSlcbiAgICAgICAgICAgIC5kaWdlc3QoJ2hleCcpO1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnkgPSB7XG4gICAgICAgICAgICBpZDogJ2NhbGwtZGVjbGFyYXRpb24tJyArIGhhc2gsXG4gICAgICAgICAgICBhcmdzOiBtZXRob2QucGFyYW1ldGVycyA/IG1ldGhvZC5wYXJhbWV0ZXJzLm1hcChwcm9wID0+IHRoaXMudmlzaXRBcmd1bWVudChwcm9wKSkgOiBbXSxcbiAgICAgICAgICAgIHJldHVyblR5cGU6IHRoaXMudmlzaXRUeXBlKG1ldGhvZC50eXBlKSxcbiAgICAgICAgICAgIGxpbmU6IHRoaXMuZ2V0UG9zaXRpb24obWV0aG9kLCBzb3VyY2VGaWxlKS5saW5lICsgMVxuICAgICAgICB9O1xuICAgICAgICBpZiAobWV0aG9kLmpzRG9jKSB7XG4gICAgICAgICAgICByZXN1bHQuZGVzY3JpcHRpb24gPSBtYXJrZWQobWFya2VkKHRoaXMuanNkb2NQYXJzZXJVdGlsLmdldE1haW5Db21tZW50T2ZOb2RlKG1ldGhvZCkpKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQganNkb2N0YWdzID0gdGhpcy5qc2RvY1BhcnNlclV0aWwuZ2V0SlNEb2NzKG1ldGhvZCk7XG4gICAgICAgIGlmIChqc2RvY3RhZ3MgJiYganNkb2N0YWdzLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICBpZiAoanNkb2N0YWdzWzBdLnRhZ3MpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuanNkb2N0YWdzID0gbWFya2VkdGFncyhqc2RvY3RhZ3NbMF0udGFncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZpc2l0SW5kZXhEZWNsYXJhdGlvbihcbiAgICAgICAgbWV0aG9kOiB0cy5JbmRleFNpZ25hdHVyZURlY2xhcmF0aW9uLFxuICAgICAgICBzb3VyY2VGaWxlPzogdHMuU291cmNlRmlsZVxuICAgICkge1xuICAgICAgICBsZXQgc291cmNlQ29kZSA9IHNvdXJjZUZpbGUuZ2V0VGV4dCgpO1xuICAgICAgICBsZXQgaGFzaCA9IGNyeXB0b1xuICAgICAgICAgICAgLmNyZWF0ZUhhc2goJ21kNScpXG4gICAgICAgICAgICAudXBkYXRlKHNvdXJjZUNvZGUpXG4gICAgICAgICAgICAuZGlnZXN0KCdoZXgnKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIGlkOiAnaW5kZXgtZGVjbGFyYXRpb24tJyArIGhhc2gsXG4gICAgICAgICAgICBhcmdzOiBtZXRob2QucGFyYW1ldGVycyA/IG1ldGhvZC5wYXJhbWV0ZXJzLm1hcChwcm9wID0+IHRoaXMudmlzaXRBcmd1bWVudChwcm9wKSkgOiBbXSxcbiAgICAgICAgICAgIHJldHVyblR5cGU6IHRoaXMudmlzaXRUeXBlKG1ldGhvZC50eXBlKSxcbiAgICAgICAgICAgIGxpbmU6IHRoaXMuZ2V0UG9zaXRpb24obWV0aG9kLCBzb3VyY2VGaWxlKS5saW5lICsgMVxuICAgICAgICB9O1xuICAgICAgICBpZiAobWV0aG9kLmpzRG9jKSB7XG4gICAgICAgICAgICByZXN1bHQuZGVzY3JpcHRpb24gPSBtYXJrZWQodGhpcy5qc2RvY1BhcnNlclV0aWwuZ2V0TWFpbkNvbW1lbnRPZk5vZGUobWV0aG9kKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZpc2l0Q29uc3RydWN0b3JEZWNsYXJhdGlvbihcbiAgICAgICAgbWV0aG9kOiB0cy5Db25zdHJ1Y3RvckRlY2xhcmF0aW9uLFxuICAgICAgICBzb3VyY2VGaWxlPzogdHMuU291cmNlRmlsZVxuICAgICkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQ29weXJpZ2h0IGh0dHBzOi8vZ2l0aHViLmNvbS9uZy1ib290c3RyYXAvbmctYm9vdHN0cmFwXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnkgPSB7XG4gICAgICAgICAgICBuYW1lOiAnY29uc3RydWN0b3InLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgYXJnczogbWV0aG9kLnBhcmFtZXRlcnMgPyBtZXRob2QucGFyYW1ldGVycy5tYXAocHJvcCA9PiB0aGlzLnZpc2l0QXJndW1lbnQocHJvcCkpIDogW10sXG4gICAgICAgICAgICBsaW5lOiB0aGlzLmdldFBvc2l0aW9uKG1ldGhvZCwgc291cmNlRmlsZSkubGluZSArIDFcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGpzZG9jdGFncyA9IHRoaXMuanNkb2NQYXJzZXJVdGlsLmdldEpTRG9jcyhtZXRob2QpO1xuXG4gICAgICAgIGlmIChtZXRob2QuanNEb2MpIHtcbiAgICAgICAgICAgIHJlc3VsdC5kZXNjcmlwdGlvbiA9IG1hcmtlZCh0aGlzLmpzZG9jUGFyc2VyVXRpbC5nZXRNYWluQ29tbWVudE9mTm9kZShtZXRob2QpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXRob2QubW9kaWZpZXJzKSB7XG4gICAgICAgICAgICBpZiAobWV0aG9kLm1vZGlmaWVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGtpbmRzID0gbWV0aG9kLm1vZGlmaWVycy5tYXAobW9kaWZpZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9kaWZpZXIua2luZDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIF8uaW5kZXhPZihraW5kcywgU3ludGF4S2luZC5QdWJsaWNLZXl3b3JkKSAhPT0gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgXy5pbmRleE9mKGtpbmRzLCBTeW50YXhLaW5kLlN0YXRpY0tleXdvcmQpICE9PSAtMVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBraW5kcyA9IGtpbmRzLmZpbHRlcihraW5kID0+IGtpbmQgIT09IFN5bnRheEtpbmQuUHVibGljS2V5d29yZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc3VsdC5tb2RpZmllcktpbmQgPSBraW5kcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoanNkb2N0YWdzICYmIGpzZG9jdGFncy5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgaWYgKGpzZG9jdGFnc1swXS50YWdzKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmpzZG9jdGFncyA9IG1hcmtlZHRhZ3MoanNkb2N0YWdzWzBdLnRhZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQuanNkb2N0YWdzICYmIHJlc3VsdC5qc2RvY3RhZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVzdWx0LmpzZG9jdGFncyA9IG1lcmdlVGFnc0FuZEFyZ3MocmVzdWx0LmFyZ3MsIHJlc3VsdC5qc2RvY3RhZ3MpO1xuICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5hcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJlc3VsdC5qc2RvY3RhZ3MgPSBtZXJnZVRhZ3NBbmRBcmdzKHJlc3VsdC5hcmdzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHByaXZhdGUgdmlzaXRQcm9wZXJ0eShwcm9wZXJ0eTogdHMuUHJvcGVydHlEZWNsYXJhdGlvbiwgc291cmNlRmlsZSkge1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnkgPSB7XG4gICAgICAgICAgICBuYW1lOiBwcm9wZXJ0eS5uYW1lLnRleHQsXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IHByb3BlcnR5LmluaXRpYWxpemVyXG4gICAgICAgICAgICAgICAgPyB0aGlzLnN0cmluZ2lmeURlZmF1bHRWYWx1ZShwcm9wZXJ0eS5pbml0aWFsaXplcilcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMudmlzaXRUeXBlKHByb3BlcnR5KSxcbiAgICAgICAgICAgIG9wdGlvbmFsOiB0eXBlb2YgcHJvcGVydHkucXVlc3Rpb25Ub2tlbiAhPT0gJ3VuZGVmaW5lZCcsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICBsaW5lOiB0aGlzLmdldFBvc2l0aW9uKHByb3BlcnR5LCBzb3VyY2VGaWxlKS5saW5lICsgMVxuICAgICAgICB9O1xuICAgICAgICBsZXQganNkb2N0YWdzO1xuXG4gICAgICAgIGlmIChwcm9wZXJ0eS5pbml0aWFsaXplciAmJiBwcm9wZXJ0eS5pbml0aWFsaXplci5raW5kID09PSBTeW50YXhLaW5kLkFycm93RnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHJlc3VsdC5kZWZhdWx0VmFsdWUgPSAnKCkgPT4gey4uLn0nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQubmFtZSA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb3BlcnR5Lm5hbWUuZXhwcmVzc2lvbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJlc3VsdC5uYW1lID0gcHJvcGVydHkubmFtZS5leHByZXNzaW9uLnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcGVydHkuanNEb2MpIHtcbiAgICAgICAgICAgIGpzZG9jdGFncyA9IHRoaXMuanNkb2NQYXJzZXJVdGlsLmdldEpTRG9jcyhwcm9wZXJ0eSk7XG4gICAgICAgICAgICByZXN1bHQuZGVzY3JpcHRpb24gPSBtYXJrZWQodGhpcy5qc2RvY1BhcnNlclV0aWwuZ2V0TWFpbkNvbW1lbnRPZk5vZGUocHJvcGVydHkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wZXJ0eS5kZWNvcmF0b3JzKSB7XG4gICAgICAgICAgICByZXN1bHQuZGVjb3JhdG9ycyA9IHRoaXMuZm9ybWF0RGVjb3JhdG9ycyhwcm9wZXJ0eS5kZWNvcmF0b3JzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wZXJ0eS5tb2RpZmllcnMpIHtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5tb2RpZmllcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCBraW5kcyA9IHByb3BlcnR5Lm1vZGlmaWVycy5tYXAobW9kaWZpZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9kaWZpZXIua2luZDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIF8uaW5kZXhPZihraW5kcywgU3ludGF4S2luZC5QdWJsaWNLZXl3b3JkKSAhPT0gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgXy5pbmRleE9mKGtpbmRzLCBTeW50YXhLaW5kLlN0YXRpY0tleXdvcmQpICE9PSAtMVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBraW5kcyA9IGtpbmRzLmZpbHRlcihraW5kID0+IGtpbmQgIT09IFN5bnRheEtpbmQuUHVibGljS2V5d29yZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc3VsdC5tb2RpZmllcktpbmQgPSBraW5kcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoanNkb2N0YWdzICYmIGpzZG9jdGFncy5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgaWYgKGpzZG9jdGFnc1swXS50YWdzKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmpzZG9jdGFncyA9IG1hcmtlZHRhZ3MoanNkb2N0YWdzWzBdLnRhZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZpc2l0Q29uc3RydWN0b3JQcm9wZXJ0aWVzKGNvbnN0ciwgc291cmNlRmlsZSkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIGlmIChjb25zdHIucGFyYW1ldGVycykge1xuICAgICAgICAgICAgbGV0IF9wYXJhbWV0ZXJzID0gW107XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gY29uc3RyLnBhcmFtZXRlcnMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1B1YmxpYyhjb25zdHIucGFyYW1ldGVyc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgX3BhcmFtZXRlcnMucHVzaCh0aGlzLnZpc2l0UHJvcGVydHkoY29uc3RyLnBhcmFtZXRlcnNbaV0sIHNvdXJjZUZpbGUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1lcmdlIEpTRG9jIHRhZ3MgZGVzY3JpcHRpb24gZnJvbSBjb25zdHJ1Y3RvciB3aXRoIHBhcmFtZXRlcnNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKGNvbnN0ci5qc0RvYykge1xuICAgICAgICAgICAgICAgIGlmIChjb25zdHIuanNEb2MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29uc3RyVGFncyA9IGNvbnN0ci5qc0RvY1swXS50YWdzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29uc3RyVGFncyAmJiBjb25zdHJUYWdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0clRhZ3MuZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9wYXJhbWV0ZXJzLmZvckVhY2gocGFyYW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWcudGFnTmFtZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnLnRhZ05hbWUuZXNjYXBlZFRleHQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZy50YWdOYW1lLmVzY2FwZWRUZXh0ID09PSAncGFyYW0nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZy5uYW1lICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnLm5hbWUuZXNjYXBlZFRleHQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWcubmFtZS5lc2NhcGVkVGV4dCA9PT0gcGFyYW0ubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW0uZGVzY3JpcHRpb24gPSB0YWcuY29tbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gX3BhcmFtZXRlcnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHZpc2l0SW5wdXRBbmRIb3N0QmluZGluZyhwcm9wZXJ0eSwgaW5EZWNvcmF0b3IsIHNvdXJjZUZpbGU/KSB7XG4gICAgICAgIGxldCBpbkFyZ3MgPSBpbkRlY29yYXRvci5leHByZXNzaW9uLmFyZ3VtZW50cztcbiAgICAgICAgbGV0IF9yZXR1cm46IGFueSA9IHt9O1xuICAgICAgICBfcmV0dXJuLm5hbWUgPSBpbkFyZ3MubGVuZ3RoID4gMCA/IGluQXJnc1swXS50ZXh0IDogcHJvcGVydHkubmFtZS50ZXh0O1xuICAgICAgICBfcmV0dXJuLmRlZmF1bHRWYWx1ZSA9IHByb3BlcnR5LmluaXRpYWxpemVyXG4gICAgICAgICAgICA/IHRoaXMuc3RyaW5naWZ5RGVmYXVsdFZhbHVlKHByb3BlcnR5LmluaXRpYWxpemVyKVxuICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICAgIGlmICghX3JldHVybi5kZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5LmpzRG9jKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5LmpzRG9jLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wZXJ0eS5qc0RvY1swXS5jb21tZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3JldHVybi5kZXNjcmlwdGlvbiA9IG1hcmtlZChwcm9wZXJ0eS5qc0RvY1swXS5jb21tZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfcmV0dXJuLmxpbmUgPSB0aGlzLmdldFBvc2l0aW9uKHByb3BlcnR5LCBzb3VyY2VGaWxlKS5saW5lICsgMTtcbiAgICAgICAgaWYgKHByb3BlcnR5LnR5cGUpIHtcbiAgICAgICAgICAgIF9yZXR1cm4udHlwZSA9IHRoaXMudmlzaXRUeXBlKHByb3BlcnR5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBOZXdFeHByZXNzaW9uXG4gICAgICAgICAgICBpZiAocHJvcGVydHkuaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHMuaXNOZXdFeHByZXNzaW9uKHByb3BlcnR5LmluaXRpYWxpemVyKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkuaW5pdGlhbGl6ZXIuZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3JldHVybi50eXBlID0gcHJvcGVydHkuaW5pdGlhbGl6ZXIuZXhwcmVzc2lvbi50ZXh0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wZXJ0eS5raW5kID09PSBTeW50YXhLaW5kLlNldEFjY2Vzc29yKSB7XG4gICAgICAgICAgICAvLyBGb3Igc2V0dGVyIGFjY2Vzc29yLCBmaW5kIHR5cGUgaW4gZmlyc3QgcGFyYW1ldGVyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkucGFyYW1ldGVycyAmJiBwcm9wZXJ0eS5wYXJhbWV0ZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5wYXJhbWV0ZXJzWzBdLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3JldHVybi50eXBlID0ga2luZFRvVHlwZShwcm9wZXJ0eS5wYXJhbWV0ZXJzWzBdLnR5cGUua2luZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmV0dXJuO1xuICAgIH1cblxuICAgIHByaXZhdGUgdmlzaXRNZXRob2REZWNsYXJhdGlvbihtZXRob2Q6IHRzLk1ldGhvZERlY2xhcmF0aW9uLCBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKSB7XG4gICAgICAgIGxldCByZXN1bHQ6IGFueSA9IHtcbiAgICAgICAgICAgIG5hbWU6IG1ldGhvZC5uYW1lLnRleHQsXG4gICAgICAgICAgICBhcmdzOiBtZXRob2QucGFyYW1ldGVycyA/IG1ldGhvZC5wYXJhbWV0ZXJzLm1hcChwcm9wID0+IHRoaXMudmlzaXRBcmd1bWVudChwcm9wKSkgOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbmFsOiB0eXBlb2YgbWV0aG9kLnF1ZXN0aW9uVG9rZW4gIT09ICd1bmRlZmluZWQnLFxuICAgICAgICAgICAgcmV0dXJuVHlwZTogdGhpcy52aXNpdFR5cGUobWV0aG9kLnR5cGUpLFxuICAgICAgICAgICAgdHlwZVBhcmFtZXRlcnM6IFtdLFxuICAgICAgICAgICAgbGluZTogdGhpcy5nZXRQb3NpdGlvbihtZXRob2QsIHNvdXJjZUZpbGUpLmxpbmUgKyAxXG4gICAgICAgIH07XG4gICAgICAgIGxldCBqc2RvY3RhZ3MgPSB0aGlzLmpzZG9jUGFyc2VyVXRpbC5nZXRKU0RvY3MobWV0aG9kKTtcblxuICAgICAgICBpZiAodHlwZW9mIG1ldGhvZC50eXBlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgLy8gVHJ5IHRvIGdldCBpbmZlcnJlZCB0eXBlXG4gICAgICAgICAgICBpZiAobWV0aG9kLnN5bWJvbCkge1xuICAgICAgICAgICAgICAgIGxldCBzeW1ib2w6IHRzLlN5bWJvbCA9IG1ldGhvZC5zeW1ib2w7XG4gICAgICAgICAgICAgICAgaWYgKHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzeW1ib2xUeXBlID0gdGhpcy50eXBlQ2hlY2tlci5nZXRUeXBlT2ZTeW1ib2xBdExvY2F0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ltYm9sLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ltYm9sLnZhbHVlRGVjbGFyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN5bWJvbFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2lnbmF0dXJlID0gdGhpcy50eXBlQ2hlY2tlci5nZXRTaWduYXR1cmVGcm9tRGVjbGFyYXRpb24obWV0aG9kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXR1cm5UeXBlID0gc2lnbmF0dXJlLmdldFJldHVyblR5cGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucmV0dXJuVHlwZSA9IHRoaXMudHlwZUNoZWNrZXIudHlwZVRvU3RyaW5nKHJldHVyblR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1lbXB0eVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWV0aG9kLnR5cGVQYXJhbWV0ZXJzICYmIG1ldGhvZC50eXBlUGFyYW1ldGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXN1bHQudHlwZVBhcmFtZXRlcnMgPSBtZXRob2QudHlwZVBhcmFtZXRlcnMubWFwKHR5cGVQYXJhbWV0ZXIgPT5cbiAgICAgICAgICAgICAgICB0aGlzLnZpc2l0VHlwZSh0eXBlUGFyYW1ldGVyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXRob2QuanNEb2MpIHtcbiAgICAgICAgICAgIHJlc3VsdC5kZXNjcmlwdGlvbiA9IG1hcmtlZCh0aGlzLmpzZG9jUGFyc2VyVXRpbC5nZXRNYWluQ29tbWVudE9mTm9kZShtZXRob2QpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXRob2QuZGVjb3JhdG9ycykge1xuICAgICAgICAgICAgcmVzdWx0LmRlY29yYXRvcnMgPSB0aGlzLmZvcm1hdERlY29yYXRvcnMobWV0aG9kLmRlY29yYXRvcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1ldGhvZC5tb2RpZmllcnMpIHtcbiAgICAgICAgICAgIGlmIChtZXRob2QubW9kaWZpZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQga2luZHMgPSBtZXRob2QubW9kaWZpZXJzLm1hcChtb2RpZmllciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtb2RpZmllci5raW5kO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgXy5pbmRleE9mKGtpbmRzLCBTeW50YXhLaW5kLlB1YmxpY0tleXdvcmQpICE9PSAtMSAmJlxuICAgICAgICAgICAgICAgICAgICBfLmluZGV4T2Yoa2luZHMsIFN5bnRheEtpbmQuU3RhdGljS2V5d29yZCkgIT09IC0xXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGtpbmRzID0ga2luZHMuZmlsdGVyKGtpbmQgPT4ga2luZCAhPT0gU3ludGF4S2luZC5QdWJsaWNLZXl3b3JkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0Lm1vZGlmaWVyS2luZCA9IGtpbmRzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChqc2RvY3RhZ3MgJiYganNkb2N0YWdzLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICBpZiAoanNkb2N0YWdzWzBdLnRhZ3MpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuanNkb2N0YWdzID0gbWFya2VkdGFncyhqc2RvY3RhZ3NbMF0udGFncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5qc2RvY3RhZ3MgJiYgcmVzdWx0LmpzZG9jdGFncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXN1bHQuanNkb2N0YWdzID0gbWVyZ2VUYWdzQW5kQXJncyhyZXN1bHQuYXJncywgcmVzdWx0LmpzZG9jdGFncyk7XG4gICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LmFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVzdWx0LmpzZG9jdGFncyA9IG1lcmdlVGFnc0FuZEFyZ3MocmVzdWx0LmFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdE91dHB1dChcbiAgICAgICAgcHJvcGVydHk6IHRzLlByb3BlcnR5RGVjbGFyYXRpb24sXG4gICAgICAgIG91dERlY29yYXRvcjogdHMuRGVjb3JhdG9yLFxuICAgICAgICBzb3VyY2VGaWxlPzogdHMuU291cmNlRmlsZVxuICAgICkge1xuICAgICAgICBsZXQgaW5BcmdzID0gb3V0RGVjb3JhdG9yLmV4cHJlc3Npb24uYXJndW1lbnRzO1xuICAgICAgICBsZXQgX3JldHVybjogYW55ID0ge1xuICAgICAgICAgICAgbmFtZTogaW5BcmdzLmxlbmd0aCA+IDAgPyBpbkFyZ3NbMF0udGV4dCA6IHByb3BlcnR5Lm5hbWUudGV4dCxcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogcHJvcGVydHkuaW5pdGlhbGl6ZXJcbiAgICAgICAgICAgICAgICA/IHRoaXMuc3RyaW5naWZ5RGVmYXVsdFZhbHVlKHByb3BlcnR5LmluaXRpYWxpemVyKVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgICAgIH07XG4gICAgICAgIGlmIChwcm9wZXJ0eS5qc0RvYykge1xuICAgICAgICAgICAgX3JldHVybi5kZXNjcmlwdGlvbiA9IG1hcmtlZChcbiAgICAgICAgICAgICAgICBtYXJrZWQodGhpcy5qc2RvY1BhcnNlclV0aWwuZ2V0TWFpbkNvbW1lbnRPZk5vZGUocHJvcGVydHkpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV9yZXR1cm4uZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5qc0RvYyAmJiBwcm9wZXJ0eS5qc0RvYy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wZXJ0eS5qc0RvY1swXS5jb21tZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBfcmV0dXJuLmRlc2NyaXB0aW9uID0gbWFya2VkKHByb3BlcnR5LmpzRG9jWzBdLmNvbW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfcmV0dXJuLmxpbmUgPSB0aGlzLmdldFBvc2l0aW9uKHByb3BlcnR5LCBzb3VyY2VGaWxlKS5saW5lICsgMTtcblxuICAgICAgICBpZiAocHJvcGVydHkudHlwZSkge1xuICAgICAgICAgICAgX3JldHVybi50eXBlID0gdGhpcy52aXNpdFR5cGUocHJvcGVydHkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaGFuZGxlIE5ld0V4cHJlc3Npb25cbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5pbml0aWFsaXplcikge1xuICAgICAgICAgICAgICAgIGlmICh0cy5pc05ld0V4cHJlc3Npb24ocHJvcGVydHkuaW5pdGlhbGl6ZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5pbml0aWFsaXplci5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmV0dXJuLnR5cGUgPSBwcm9wZXJ0eS5pbml0aWFsaXplci5leHByZXNzaW9uLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXR1cm47XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2aXNpdEFyZ3VtZW50KGFyZzogdHMuUGFyYW1ldGVyRGVjbGFyYXRpb24pIHtcbiAgICAgICAgbGV0IF9yZXN1bHQ6IGFueSA9IHsgbmFtZTogYXJnLm5hbWUudGV4dCwgdHlwZTogdGhpcy52aXNpdFR5cGUoYXJnKSB9O1xuICAgICAgICBpZiAoYXJnLmRvdERvdERvdFRva2VuKSB7XG4gICAgICAgICAgICBfcmVzdWx0LmRvdERvdERvdFRva2VuID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJnLnF1ZXN0aW9uVG9rZW4pIHtcbiAgICAgICAgICAgIF9yZXN1bHQub3B0aW9uYWwgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmcudHlwZSkge1xuICAgICAgICAgICAgaWYgKGFyZy50eXBlLmtpbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAodHMuaXNGdW5jdGlvblR5cGVOb2RlKGFyZy50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBfcmVzdWx0LmZ1bmN0aW9uID0gYXJnLnR5cGUucGFyYW1ldGVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgPyBhcmcudHlwZS5wYXJhbWV0ZXJzLm1hcChwcm9wID0+IHRoaXMudmlzaXRBcmd1bWVudChwcm9wKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChhcmcuaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgIF9yZXN1bHQuZGVmYXVsdFZhbHVlID0gdGhpcy5zdHJpbmdpZnlEZWZhdWx0VmFsdWUoYXJnLmluaXRpYWxpemVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZpc2l0SG9zdExpc3RlbmVyKHByb3BlcnR5LCBob3N0TGlzdGVuZXJEZWNvcmF0b3IsIHNvdXJjZUZpbGU/KSB7XG4gICAgICAgIGxldCBpbkFyZ3MgPSBob3N0TGlzdGVuZXJEZWNvcmF0b3IuZXhwcmVzc2lvbi5hcmd1bWVudHM7XG4gICAgICAgIGxldCBfcmV0dXJuOiBhbnkgPSB7fTtcbiAgICAgICAgX3JldHVybi5uYW1lID0gaW5BcmdzLmxlbmd0aCA+IDAgPyBpbkFyZ3NbMF0udGV4dCA6IHByb3BlcnR5Lm5hbWUudGV4dDtcbiAgICAgICAgX3JldHVybi5hcmdzID0gcHJvcGVydHkucGFyYW1ldGVyc1xuICAgICAgICAgICAgPyBwcm9wZXJ0eS5wYXJhbWV0ZXJzLm1hcChwcm9wID0+IHRoaXMudmlzaXRBcmd1bWVudChwcm9wKSlcbiAgICAgICAgICAgIDogW107XG4gICAgICAgIF9yZXR1cm4uYXJnc0RlY29yYXRvciA9XG4gICAgICAgICAgICBpbkFyZ3MubGVuZ3RoID4gMVxuICAgICAgICAgICAgICAgID8gaW5BcmdzWzFdLmVsZW1lbnRzLm1hcChwcm9wID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcC50ZXh0O1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICA6IFtdO1xuICAgICAgICBpZiAocHJvcGVydHkuanNEb2MpIHtcbiAgICAgICAgICAgIF9yZXR1cm4uZGVzY3JpcHRpb24gPSBtYXJrZWQodGhpcy5qc2RvY1BhcnNlclV0aWwuZ2V0TWFpbkNvbW1lbnRPZk5vZGUocHJvcGVydHkpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV9yZXR1cm4uZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5qc0RvYykge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5qc0RvYy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHkuanNEb2NbMF0uY29tbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZXR1cm4uZGVzY3JpcHRpb24gPSBtYXJrZWQocHJvcGVydHkuanNEb2NbMF0uY29tbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX3JldHVybi5saW5lID0gdGhpcy5nZXRQb3NpdGlvbihwcm9wZXJ0eSwgc291cmNlRmlsZSkubGluZSArIDE7XG4gICAgICAgIHJldHVybiBfcmV0dXJuO1xuICAgIH1cbn1cbiJdfQ==