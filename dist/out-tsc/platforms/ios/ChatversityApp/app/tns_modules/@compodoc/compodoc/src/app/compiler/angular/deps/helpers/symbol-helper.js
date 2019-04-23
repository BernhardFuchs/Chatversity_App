"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var ts_simple_ast_1 = require("ts-simple-ast");
var ts_printer_util_1 = require("../../../../../utils/ts-printer.util");
var imports_util_1 = require("../../../../../utils/imports.util");
var SymbolHelper = /** @class */ (function () {
    function SymbolHelper() {
        this.unknown = '???';
    }
    SymbolHelper.prototype.parseDeepIndentifier = function (name, srcFile) {
        var result = {
            name: '',
            type: ''
        };
        if (typeof name === 'undefined') {
            return result;
        }
        var nsModule = name.split('.');
        var type = this.getType(name);
        if (nsModule.length > 1) {
            result.ns = nsModule[0];
            result.name = name;
            result.type = type;
            return result;
        }
        if (typeof srcFile !== 'undefined') {
            result.file = imports_util_1.default.getFileNameOfImport(name, srcFile);
        }
        result.name = name;
        result.type = type;
        return result;
    };
    SymbolHelper.prototype.getType = function (name) {
        var type;
        if (name.toLowerCase().indexOf('component') !== -1) {
            type = 'component';
        }
        else if (name.toLowerCase().indexOf('pipe') !== -1) {
            type = 'pipe';
        }
        else if (name.toLowerCase().indexOf('controller') !== -1) {
            type = 'controller';
        }
        else if (name.toLowerCase().indexOf('module') !== -1) {
            type = 'module';
        }
        else if (name.toLowerCase().indexOf('directive') !== -1) {
            type = 'directive';
        }
        return type;
    };
    /**
     * Output
     * RouterModule.forRoot 179
     */
    SymbolHelper.prototype.buildIdentifierName = function (node, name) {
        if (ts_simple_ast_1.ts.isIdentifier(node) && !ts_simple_ast_1.ts.isPropertyAccessExpression(node)) {
            return node.text + "." + name;
        }
        name = name ? "." + name : '';
        var nodeName = this.unknown;
        if (node.name) {
            nodeName = node.name.text;
        }
        else if (node.text) {
            nodeName = node.text;
        }
        else if (node.expression) {
            if (node.expression.text) {
                nodeName = node.expression.text;
            }
            else if (node.expression.elements) {
                if (ts_simple_ast_1.ts.isArrayLiteralExpression(node.expression)) {
                    nodeName = node.expression.elements.map(function (el) { return el.text; }).join(', ');
                    nodeName = "[" + nodeName + "]";
                }
            }
        }
        if (ts_simple_ast_1.ts.isSpreadElement(node)) {
            return "..." + nodeName;
        }
        return "" + this.buildIdentifierName(node.expression, nodeName) + name;
    };
    /**
     * parse expressions such as:
     * { provide: APP_BASE_HREF, useValue: '/' }
     * { provide: 'Date', useFactory: (d1, d2) => new Date(), deps: ['d1', 'd2'] }
     */
    SymbolHelper.prototype.parseProviderConfiguration = function (node) {
        if (node.kind && node.kind === ts_simple_ast_1.SyntaxKind.ObjectLiteralExpression) {
            // Search for provide: HTTP_INTERCEPTORS
            // and if true, return type: 'interceptor' + name
            var interceptorName_1, hasInterceptor_1;
            if (node.properties) {
                if (node.properties.length > 0) {
                    _.forEach(node.properties, function (property) {
                        if (property.kind && property.kind === ts_simple_ast_1.SyntaxKind.PropertyAssignment) {
                            if (property.name.text === 'provide') {
                                if (property.initializer.text === 'HTTP_INTERCEPTORS') {
                                    hasInterceptor_1 = true;
                                }
                            }
                            if (property.name.text === 'useClass' ||
                                property.name.text === 'useExisting') {
                                interceptorName_1 = property.initializer.text;
                            }
                        }
                    });
                }
            }
            if (hasInterceptor_1) {
                return interceptorName_1;
            }
            else {
                return new ts_printer_util_1.TsPrinterUtil().print(node);
            }
        }
        else {
            return new ts_printer_util_1.TsPrinterUtil().print(node);
        }
    };
    /**
     * Kind
     *  181 CallExpression => "RouterModule.forRoot(args)"
     *   71 Identifier     => "RouterModule" "TodoStore"
     *    9 StringLiteral  => "./app.component.css" "./tab.scss"
     */
    SymbolHelper.prototype.parseSymbolElements = function (node) {
        // parse expressions such as: AngularFireModule.initializeApp(firebaseConfig)
        // if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
        if ((ts_simple_ast_1.ts.isCallExpression(node) && ts_simple_ast_1.ts.isPropertyAccessExpression(node.expression)) ||
            (ts_simple_ast_1.ts.isNewExpression(node) && ts_simple_ast_1.ts.isElementAccessExpression(node.expression))) {
            var className = this.buildIdentifierName(node.expression);
            // function arguments could be really complex. There are so
            // many use cases that we can't handle. Just print "args" to indicate
            // that we have arguments.
            var functionArgs = node.arguments.length > 0 ? 'args' : '';
            var text = className + "(" + functionArgs + ")";
            return text;
        }
        else if (ts_simple_ast_1.ts.isPropertyAccessExpression(node)) {
            // parse expressions such as: Shared.Module
            return this.buildIdentifierName(node);
        }
        else if (ts_simple_ast_1.ts.isIdentifier(node)) {
            // parse expressions such as: MyComponent
            if (node.text) {
                return node.text;
            }
            if (node.escapedText) {
                return node.escapedText;
            }
        }
        else if (ts_simple_ast_1.ts.isSpreadElement(node)) {
            // parse expressions such as: ...MYARRAY
            // Resolve MYARRAY in imports or local file variables after full scan, just return the name of the variable
            if (node.expression && node.expression.text) {
                return node.expression.text;
            }
        }
        return node.text ? node.text : this.parseProviderConfiguration(node);
    };
    /**
     * Kind
     *  177 ArrayLiteralExpression
     *  122 BooleanKeyword
     *    9 StringLiteral
     */
    SymbolHelper.prototype.parseSymbols = function (node, srcFile) {
        var _this = this;
        var localNode = node;
        if (ts_simple_ast_1.ts.isShorthandPropertyAssignment(localNode)) {
            localNode = imports_util_1.default.findValueInImportOrLocalVariables(node.name.text, srcFile);
        }
        if (ts_simple_ast_1.ts.isArrayLiteralExpression(localNode.initializer)) {
            return localNode.initializer.elements.map(function (x) { return _this.parseSymbolElements(x); });
        }
        else if (ts_simple_ast_1.ts.isStringLiteral(localNode.initializer) ||
            ts_simple_ast_1.ts.isTemplateLiteral(localNode.initializer) ||
            (ts_simple_ast_1.ts.isPropertyAssignment(localNode) && localNode.initializer.text)) {
            return [localNode.initializer.text];
        }
        else if (localNode.initializer.kind &&
            (localNode.initializer.kind === ts_simple_ast_1.SyntaxKind.TrueKeyword ||
                localNode.initializer.kind === ts_simple_ast_1.SyntaxKind.FalseKeyword)) {
            return [localNode.initializer.kind === ts_simple_ast_1.SyntaxKind.TrueKeyword ? true : false];
        }
        else if (ts_simple_ast_1.ts.isPropertyAccessExpression(localNode.initializer)) {
            var identifier = this.parseSymbolElements(localNode.initializer);
            return [identifier];
        }
        else if (ts_simple_ast_1.ts.isArrayLiteralExpression(localNode.initializer)) {
            return localNode.initializer.elements.map(function (x) { return _this.parseSymbolElements(x); });
        }
        else if (localNode.initializer &&
            localNode.initializer.elements &&
            localNode.initializer.elements.length > 0) {
            // Node replaced by ts-simple-ast & kind = 265
            return localNode.initializer.elements.map(function (x) { return _this.parseSymbolElements(x); });
        }
    };
    SymbolHelper.prototype.getSymbolDeps = function (props, type, srcFile, multiLine) {
        var _this = this;
        if (props.length === 0) {
            return [];
        }
        var i = 0, len = props.length, filteredProps = [];
        for (i; i < len; i++) {
            if (props[i].name && props[i].name.text === type) {
                filteredProps.push(props[i]);
            }
        }
        return filteredProps.map(function (x) { return _this.parseSymbols(x, srcFile); }).pop() || [];
    };
    SymbolHelper.prototype.getSymbolDepsRaw = function (props, type, multiLine) {
        return props.filter(function (node) { return node.name.text === type; });
    };
    return SymbolHelper;
}());
exports.SymbolHelper = SymbolHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ltYm9sLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2NvbXBpbGVyL2FuZ3VsYXIvZGVwcy9oZWxwZXJzL3N5bWJvbC1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQkFBNEI7QUFFNUIsK0NBQStDO0FBRS9DLHdFQUFxRTtBQUVyRSxrRUFBNEQ7QUFFNUQ7SUFBQTtRQUNxQixZQUFPLEdBQUcsS0FBSyxDQUFDO0lBcVByQyxDQUFDO0lBblBVLDJDQUFvQixHQUEzQixVQUE0QixJQUFZLEVBQUUsT0FBdUI7UUFDN0QsSUFBSSxNQUFNLEdBQUc7WUFDVCxJQUFJLEVBQUUsRUFBRTtZQUNSLElBQUksRUFBRSxFQUFFO1NBQ1gsQ0FBQztRQUVGLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQzdCLE9BQU8sTUFBTSxDQUFDO1NBQ2pCO1FBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTlCLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDckIsTUFBTSxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDbkIsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDbkIsT0FBTyxNQUFNLENBQUM7U0FDakI7UUFDRCxJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsRUFBRTtZQUNoQyxNQUFNLENBQUMsSUFBSSxHQUFHLHNCQUFX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XyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyB0cywgU3ludGF4S2luZCB9IGZyb20gJ3RzLXNpbXBsZS1hc3QnO1xuXG5pbXBvcnQgeyBUc1ByaW50ZXJVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbHMvdHMtcHJpbnRlci51dGlsJztcblxuaW1wb3J0IEltcG9ydHNVdGlsIGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWxzL2ltcG9ydHMudXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBTeW1ib2xIZWxwZXIge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgdW5rbm93biA9ICc/Pz8nO1xuXG4gICAgcHVibGljIHBhcnNlRGVlcEluZGVudGlmaWVyKG5hbWU6IHN0cmluZywgc3JjRmlsZT86IHRzLlNvdXJjZUZpbGUpOiBJUGFyc2VEZWVwSWRlbnRpZmllclJlc3VsdCB7XG4gICAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICAgIHR5cGU6ICcnXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbnNNb2R1bGUgPSBuYW1lLnNwbGl0KCcuJyk7XG4gICAgICAgIGxldCB0eXBlID0gdGhpcy5nZXRUeXBlKG5hbWUpO1xuXG4gICAgICAgIGlmIChuc01vZHVsZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZXN1bHQubnMgPSBuc01vZHVsZVswXTtcbiAgICAgICAgICAgIHJlc3VsdC5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgIHJlc3VsdC50eXBlID0gdHlwZTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzcmNGaWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmVzdWx0LmZpbGUgPSBJbXBvcnRzVXRpbC5nZXRGaWxlTmFtZU9mSW1wb3J0KG5hbWUsIHNyY0ZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5uYW1lID0gbmFtZTtcbiAgICAgICAgcmVzdWx0LnR5cGUgPSB0eXBlO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRUeXBlKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGxldCB0eXBlO1xuICAgICAgICBpZiAobmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2NvbXBvbmVudCcpICE9PSAtMSkge1xuICAgICAgICAgICAgdHlwZSA9ICdjb21wb25lbnQnO1xuICAgICAgICB9IGVsc2UgaWYgKG5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdwaXBlJykgIT09IC0xKSB7XG4gICAgICAgICAgICB0eXBlID0gJ3BpcGUnO1xuICAgICAgICB9IGVsc2UgaWYgKG5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdjb250cm9sbGVyJykgIT09IC0xKSB7XG4gICAgICAgICAgICB0eXBlID0gJ2NvbnRyb2xsZXInO1xuICAgICAgICB9IGVsc2UgaWYgKG5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdtb2R1bGUnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHR5cGUgPSAnbW9kdWxlJztcbiAgICAgICAgfSBlbHNlIGlmIChuYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignZGlyZWN0aXZlJykgIT09IC0xKSB7XG4gICAgICAgICAgICB0eXBlID0gJ2RpcmVjdGl2ZSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT3V0cHV0XG4gICAgICogUm91dGVyTW9kdWxlLmZvclJvb3QgMTc5XG4gICAgICovXG4gICAgcHVibGljIGJ1aWxkSWRlbnRpZmllck5hbWUoXG4gICAgICAgIG5vZGU6IHRzLklkZW50aWZpZXIgfCB0cy5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24gfCB0cy5TcHJlYWRFbGVtZW50LFxuICAgICAgICBuYW1lXG4gICAgKSB7XG4gICAgICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkgJiYgIXRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7bm9kZS50ZXh0fS4ke25hbWV9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5hbWUgPSBuYW1lID8gYC4ke25hbWV9YCA6ICcnO1xuXG4gICAgICAgIGxldCBub2RlTmFtZSA9IHRoaXMudW5rbm93bjtcbiAgICAgICAgaWYgKG5vZGUubmFtZSkge1xuICAgICAgICAgICAgbm9kZU5hbWUgPSBub2RlLm5hbWUudGV4dDtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLnRleHQpIHtcbiAgICAgICAgICAgIG5vZGVOYW1lID0gbm9kZS50ZXh0O1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUuZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgaWYgKG5vZGUuZXhwcmVzc2lvbi50ZXh0KSB7XG4gICAgICAgICAgICAgICAgbm9kZU5hbWUgPSBub2RlLmV4cHJlc3Npb24udGV4dDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZS5leHByZXNzaW9uLmVsZW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRzLmlzQXJyYXlMaXRlcmFsRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVOYW1lID0gbm9kZS5leHByZXNzaW9uLmVsZW1lbnRzLm1hcChlbCA9PiBlbC50ZXh0KS5qb2luKCcsICcpO1xuICAgICAgICAgICAgICAgICAgICBub2RlTmFtZSA9IGBbJHtub2RlTmFtZX1dYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHMuaXNTcHJlYWRFbGVtZW50KG5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gYC4uLiR7bm9kZU5hbWV9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYCR7dGhpcy5idWlsZElkZW50aWZpZXJOYW1lKG5vZGUuZXhwcmVzc2lvbiwgbm9kZU5hbWUpfSR7bmFtZX1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHBhcnNlIGV4cHJlc3Npb25zIHN1Y2ggYXM6XG4gICAgICogeyBwcm92aWRlOiBBUFBfQkFTRV9IUkVGLCB1c2VWYWx1ZTogJy8nIH1cbiAgICAgKiB7IHByb3ZpZGU6ICdEYXRlJywgdXNlRmFjdG9yeTogKGQxLCBkMikgPT4gbmV3IERhdGUoKSwgZGVwczogWydkMScsICdkMiddIH1cbiAgICAgKi9cbiAgICBwdWJsaWMgcGFyc2VQcm92aWRlckNvbmZpZ3VyYXRpb24obm9kZTogdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pOiBzdHJpbmcge1xuICAgICAgICBpZiAobm9kZS5raW5kICYmIG5vZGUua2luZCA9PT0gU3ludGF4S2luZC5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgLy8gU2VhcmNoIGZvciBwcm92aWRlOiBIVFRQX0lOVEVSQ0VQVE9SU1xuICAgICAgICAgICAgLy8gYW5kIGlmIHRydWUsIHJldHVybiB0eXBlOiAnaW50ZXJjZXB0b3InICsgbmFtZVxuICAgICAgICAgICAgbGV0IGludGVyY2VwdG9yTmFtZSwgaGFzSW50ZXJjZXB0b3I7XG4gICAgICAgICAgICBpZiAobm9kZS5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uZm9yRWFjaChub2RlLnByb3BlcnRpZXMsIHByb3BlcnR5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5raW5kICYmIHByb3BlcnR5LmtpbmQgPT09IFN5bnRheEtpbmQuUHJvcGVydHlBc3NpZ25tZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5Lm5hbWUudGV4dCA9PT0gJ3Byb3ZpZGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5pbml0aWFsaXplci50ZXh0ID09PSAnSFRUUF9JTlRFUkNFUFRPUlMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNJbnRlcmNlcHRvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eS5uYW1lLnRleHQgPT09ICd1c2VDbGFzcycgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkubmFtZS50ZXh0ID09PSAndXNlRXhpc3RpbmcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyY2VwdG9yTmFtZSA9IHByb3BlcnR5LmluaXRpYWxpemVyLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzSW50ZXJjZXB0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJjZXB0b3JOYW1lO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFRzUHJpbnRlclV0aWwoKS5wcmludChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVHNQcmludGVyVXRpbCgpLnByaW50KG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogS2luZFxuICAgICAqICAxODEgQ2FsbEV4cHJlc3Npb24gPT4gXCJSb3V0ZXJNb2R1bGUuZm9yUm9vdChhcmdzKVwiXG4gICAgICogICA3MSBJZGVudGlmaWVyICAgICA9PiBcIlJvdXRlck1vZHVsZVwiIFwiVG9kb1N0b3JlXCJcbiAgICAgKiAgICA5IFN0cmluZ0xpdGVyYWwgID0+IFwiLi9hcHAuY29tcG9uZW50LmNzc1wiIFwiLi90YWIuc2Nzc1wiXG4gICAgICovXG4gICAgcHVibGljIHBhcnNlU3ltYm9sRWxlbWVudHMoXG4gICAgICAgIG5vZGU6XG4gICAgICAgICAgICB8IHRzLkNhbGxFeHByZXNzaW9uXG4gICAgICAgICAgICB8IHRzLklkZW50aWZpZXJcbiAgICAgICAgICAgIHwgdHMuU3RyaW5nTGl0ZXJhbFxuICAgICAgICAgICAgfCB0cy5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb25cbiAgICAgICAgICAgIHwgdHMuU3ByZWFkRWxlbWVudFxuICAgICk6IHN0cmluZyB7XG4gICAgICAgIC8vIHBhcnNlIGV4cHJlc3Npb25zIHN1Y2ggYXM6IEFuZ3VsYXJGaXJlTW9kdWxlLmluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpXG4gICAgICAgIC8vIGlmICh0cy5pc0NhbGxFeHByZXNzaW9uKG5vZGUpICYmIHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbikpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgKHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZSkgJiYgdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKSkgfHxcbiAgICAgICAgICAgICh0cy5pc05ld0V4cHJlc3Npb24obm9kZSkgJiYgdHMuaXNFbGVtZW50QWNjZXNzRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSB0aGlzLmJ1aWxkSWRlbnRpZmllck5hbWUobm9kZS5leHByZXNzaW9uKTtcblxuICAgICAgICAgICAgLy8gZnVuY3Rpb24gYXJndW1lbnRzIGNvdWxkIGJlIHJlYWxseSBjb21wbGV4LiBUaGVyZSBhcmUgc29cbiAgICAgICAgICAgIC8vIG1hbnkgdXNlIGNhc2VzIHRoYXQgd2UgY2FuJ3QgaGFuZGxlLiBKdXN0IHByaW50IFwiYXJnc1wiIHRvIGluZGljYXRlXG4gICAgICAgICAgICAvLyB0aGF0IHdlIGhhdmUgYXJndW1lbnRzLlxuXG4gICAgICAgICAgICBsZXQgZnVuY3Rpb25BcmdzID0gbm9kZS5hcmd1bWVudHMubGVuZ3RoID4gMCA/ICdhcmdzJyA6ICcnO1xuICAgICAgICAgICAgbGV0IHRleHQgPSBgJHtjbGFzc05hbWV9KCR7ZnVuY3Rpb25BcmdzfSlgO1xuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH0gZWxzZSBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgICAgICAgIC8vIHBhcnNlIGV4cHJlc3Npb25zIHN1Y2ggYXM6IFNoYXJlZC5Nb2R1bGVcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJ1aWxkSWRlbnRpZmllck5hbWUobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICAgICAgICAvLyBwYXJzZSBleHByZXNzaW9ucyBzdWNoIGFzOiBNeUNvbXBvbmVudFxuICAgICAgICAgICAgaWYgKG5vZGUudGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5lc2NhcGVkVGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmVzY2FwZWRUZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRzLmlzU3ByZWFkRWxlbWVudChub2RlKSkge1xuICAgICAgICAgICAgLy8gcGFyc2UgZXhwcmVzc2lvbnMgc3VjaCBhczogLi4uTVlBUlJBWVxuICAgICAgICAgICAgLy8gUmVzb2x2ZSBNWUFSUkFZIGluIGltcG9ydHMgb3IgbG9jYWwgZmlsZSB2YXJpYWJsZXMgYWZ0ZXIgZnVsbCBzY2FuLCBqdXN0IHJldHVybiB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGVcbiAgICAgICAgICAgIGlmIChub2RlLmV4cHJlc3Npb24gJiYgbm9kZS5leHByZXNzaW9uLnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5leHByZXNzaW9uLnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZS50ZXh0ID8gbm9kZS50ZXh0IDogdGhpcy5wYXJzZVByb3ZpZGVyQ29uZmlndXJhdGlvbihub2RlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBLaW5kXG4gICAgICogIDE3NyBBcnJheUxpdGVyYWxFeHByZXNzaW9uXG4gICAgICogIDEyMiBCb29sZWFuS2V5d29yZFxuICAgICAqICAgIDkgU3RyaW5nTGl0ZXJhbFxuICAgICAqL1xuICAgIHByaXZhdGUgcGFyc2VTeW1ib2xzKFxuICAgICAgICBub2RlOiB0cy5PYmplY3RMaXRlcmFsRWxlbWVudCxcbiAgICAgICAgc3JjRmlsZTogdHMuU291cmNlRmlsZVxuICAgICk6IEFycmF5PHN0cmluZyB8IGJvb2xlYW4+IHtcbiAgICAgICAgbGV0IGxvY2FsTm9kZSA9IG5vZGU7XG5cbiAgICAgICAgaWYgKHRzLmlzU2hvcnRoYW5kUHJvcGVydHlBc3NpZ25tZW50KGxvY2FsTm9kZSkpIHtcbiAgICAgICAgICAgIGxvY2FsTm9kZSA9IEltcG9ydHNVdGlsLmZpbmRWYWx1ZUluSW1wb3J0T3JMb2NhbFZhcmlhYmxlcyhub2RlLm5hbWUudGV4dCwgc3JjRmlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHMuaXNBcnJheUxpdGVyYWxFeHByZXNzaW9uKGxvY2FsTm9kZS5pbml0aWFsaXplcikpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbE5vZGUuaW5pdGlhbGl6ZXIuZWxlbWVudHMubWFwKHggPT4gdGhpcy5wYXJzZVN5bWJvbEVsZW1lbnRzKHgpKTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIHRzLmlzU3RyaW5nTGl0ZXJhbChsb2NhbE5vZGUuaW5pdGlhbGl6ZXIpIHx8XG4gICAgICAgICAgICB0cy5pc1RlbXBsYXRlTGl0ZXJhbChsb2NhbE5vZGUuaW5pdGlhbGl6ZXIpIHx8XG4gICAgICAgICAgICAodHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQobG9jYWxOb2RlKSAmJiBsb2NhbE5vZGUuaW5pdGlhbGl6ZXIudGV4dClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gW2xvY2FsTm9kZS5pbml0aWFsaXplci50ZXh0XTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIGxvY2FsTm9kZS5pbml0aWFsaXplci5raW5kICYmXG4gICAgICAgICAgICAobG9jYWxOb2RlLmluaXRpYWxpemVyLmtpbmQgPT09IFN5bnRheEtpbmQuVHJ1ZUtleXdvcmQgfHxcbiAgICAgICAgICAgICAgICBsb2NhbE5vZGUuaW5pdGlhbGl6ZXIua2luZCA9PT0gU3ludGF4S2luZC5GYWxzZUtleXdvcmQpXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIFtsb2NhbE5vZGUuaW5pdGlhbGl6ZXIua2luZCA9PT0gU3ludGF4S2luZC5UcnVlS2V5d29yZCA/IHRydWUgOiBmYWxzZV07XG4gICAgICAgIH0gZWxzZSBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obG9jYWxOb2RlLmluaXRpYWxpemVyKSkge1xuICAgICAgICAgICAgbGV0IGlkZW50aWZpZXIgPSB0aGlzLnBhcnNlU3ltYm9sRWxlbWVudHMobG9jYWxOb2RlLmluaXRpYWxpemVyKTtcbiAgICAgICAgICAgIHJldHVybiBbaWRlbnRpZmllcl07XG4gICAgICAgIH0gZWxzZSBpZiAodHMuaXNBcnJheUxpdGVyYWxFeHByZXNzaW9uKGxvY2FsTm9kZS5pbml0aWFsaXplcikpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbE5vZGUuaW5pdGlhbGl6ZXIuZWxlbWVudHMubWFwKHggPT4gdGhpcy5wYXJzZVN5bWJvbEVsZW1lbnRzKHgpKTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIGxvY2FsTm9kZS5pbml0aWFsaXplciAmJlxuICAgICAgICAgICAgbG9jYWxOb2RlLmluaXRpYWxpemVyLmVsZW1lbnRzICYmXG4gICAgICAgICAgICBsb2NhbE5vZGUuaW5pdGlhbGl6ZXIuZWxlbWVudHMubGVuZ3RoID4gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIE5vZGUgcmVwbGFjZWQgYnkgdHMtc2ltcGxlLWFzdCAmIGtpbmQgPSAyNjVcbiAgICAgICAgICAgIHJldHVybiBsb2NhbE5vZGUuaW5pdGlhbGl6ZXIuZWxlbWVudHMubWFwKHggPT4gdGhpcy5wYXJzZVN5bWJvbEVsZW1lbnRzKHgpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTeW1ib2xEZXBzKFxuICAgICAgICBwcm9wczogUmVhZG9ubHlBcnJheTx0cy5PYmplY3RMaXRlcmFsRWxlbWVudExpa2U+LFxuICAgICAgICB0eXBlOiBzdHJpbmcsXG4gICAgICAgIHNyY0ZpbGU6IHRzLlNvdXJjZUZpbGUsXG4gICAgICAgIG11bHRpTGluZT86IGJvb2xlYW5cbiAgICApOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgaWYgKHByb3BzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGkgPSAwLFxuICAgICAgICAgICAgbGVuID0gcHJvcHMubGVuZ3RoLFxuICAgICAgICAgICAgZmlsdGVyZWRQcm9wcyA9IFtdO1xuXG4gICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocHJvcHNbaV0ubmFtZSAmJiBwcm9wc1tpXS5uYW1lLnRleHQgPT09IHR5cGUpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZFByb3BzLnB1c2gocHJvcHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkUHJvcHMubWFwKHggPT4gdGhpcy5wYXJzZVN5bWJvbHMoeCwgc3JjRmlsZSkpLnBvcCgpIHx8IFtdO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTeW1ib2xEZXBzUmF3KFxuICAgICAgICBwcm9wczogUmVhZG9ubHlBcnJheTx0cy5PYmplY3RMaXRlcmFsRWxlbWVudExpa2U+LFxuICAgICAgICB0eXBlOiBzdHJpbmcsXG4gICAgICAgIG11bHRpTGluZT86IGJvb2xlYW5cbiAgICApOiBBcnJheTx0cy5PYmplY3RMaXRlcmFsRWxlbWVudExpa2U+IHtcbiAgICAgICAgcmV0dXJuIHByb3BzLmZpbHRlcihub2RlID0+IG5vZGUubmFtZS50ZXh0ID09PSB0eXBlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVBhcnNlRGVlcElkZW50aWZpZXJSZXN1bHQge1xuICAgIG5zPzogYW55O1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBmaWxlPzogc3RyaW5nO1xuICAgIHR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbn1cbiJdfQ==