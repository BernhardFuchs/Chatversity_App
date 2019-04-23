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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ltYm9sLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvY29tcGlsZXIvYW5ndWxhci9kZXBzL2hlbHBlcnMvc3ltYm9sLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBCQUE0QjtBQUU1QiwrQ0FBK0M7QUFFL0Msd0VBQXFFO0FBRXJFLGtFQUE0RDtBQUU1RDtJQUFBO1FBQ3FCLFlBQU8sR0FBRyxLQUFLLENBQUM7SUFxUHJDLENBQUM7SUFuUFUsMkNBQW9CLEdBQTNCLFVBQTRCLElBQVksRUFBRSxPQUF1QjtRQUM3RCxJQUFJLE1BQU0sR0FBRztZQUNULElBQUksRUFBRSxFQUFFO1lBQ1IsSUFBSSxFQUFFLEVBQUU7U0FDWCxDQUFDO1FBRUYsSUFBSSxPQUFPLElBQUksS0FBSyxXQUFXLEVBQUU7WUFDN0IsT0FBTyxNQUFNLENBQUM7U0FDakI7UUFDRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFOUIsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNyQixNQUFNLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNuQixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNuQixPQUFPLE1BQU0sQ0FBQztTQUNqQjtRQUNELElBQUksT0FBTyxPQUFPLEtBQUssV0FB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b0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7IHRzLCBTeW50YXhLaW5kIH0gZnJvbSAndHMtc2ltcGxlLWFzdCc7XG5cbmltcG9ydCB7IFRzUHJpbnRlclV0aWwgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlscy90cy1wcmludGVyLnV0aWwnO1xuXG5pbXBvcnQgSW1wb3J0c1V0aWwgZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbHMvaW1wb3J0cy51dGlsJztcblxuZXhwb3J0IGNsYXNzIFN5bWJvbEhlbHBlciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSB1bmtub3duID0gJz8/Pyc7XG5cbiAgICBwdWJsaWMgcGFyc2VEZWVwSW5kZW50aWZpZXIobmFtZTogc3RyaW5nLCBzcmNGaWxlPzogdHMuU291cmNlRmlsZSk6IElQYXJzZURlZXBJZGVudGlmaWVyUmVzdWx0IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgICAgdHlwZTogJydcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGxldCBuc01vZHVsZSA9IG5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgbGV0IHR5cGUgPSB0aGlzLmdldFR5cGUobmFtZSk7XG5cbiAgICAgICAgaWYgKG5zTW9kdWxlLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJlc3VsdC5ucyA9IG5zTW9kdWxlWzBdO1xuICAgICAgICAgICAgcmVzdWx0Lm5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgcmVzdWx0LnR5cGUgPSB0eXBlO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHNyY0ZpbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXN1bHQuZmlsZSA9IEltcG9ydHNVdGlsLmdldEZpbGVOYW1lT2ZJbXBvcnQobmFtZSwgc3JjRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0Lm5hbWUgPSBuYW1lO1xuICAgICAgICByZXN1bHQudHlwZSA9IHR5cGU7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFR5cGUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHR5cGU7XG4gICAgICAgIGlmIChuYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignY29tcG9uZW50JykgIT09IC0xKSB7XG4gICAgICAgICAgICB0eXBlID0gJ2NvbXBvbmVudCc7XG4gICAgICAgIH0gZWxzZSBpZiAobmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3BpcGUnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHR5cGUgPSAncGlwZSc7XG4gICAgICAgIH0gZWxzZSBpZiAobmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2NvbnRyb2xsZXInKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHR5cGUgPSAnY29udHJvbGxlcic7XG4gICAgICAgIH0gZWxzZSBpZiAobmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ21vZHVsZScpICE9PSAtMSkge1xuICAgICAgICAgICAgdHlwZSA9ICdtb2R1bGUnO1xuICAgICAgICB9IGVsc2UgaWYgKG5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdkaXJlY3RpdmUnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHR5cGUgPSAnZGlyZWN0aXZlJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPdXRwdXRcbiAgICAgKiBSb3V0ZXJNb2R1bGUuZm9yUm9vdCAxNzlcbiAgICAgKi9cbiAgICBwdWJsaWMgYnVpbGRJZGVudGlmaWVyTmFtZShcbiAgICAgICAgbm9kZTogdHMuSWRlbnRpZmllciB8IHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbiB8IHRzLlNwcmVhZEVsZW1lbnQsXG4gICAgICAgIG5hbWVcbiAgICApIHtcbiAgICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSAmJiAhdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHtub2RlLnRleHR9LiR7bmFtZX1gO1xuICAgICAgICB9XG5cbiAgICAgICAgbmFtZSA9IG5hbWUgPyBgLiR7bmFtZX1gIDogJyc7XG5cbiAgICAgICAgbGV0IG5vZGVOYW1lID0gdGhpcy51bmtub3duO1xuICAgICAgICBpZiAobm9kZS5uYW1lKSB7XG4gICAgICAgICAgICBub2RlTmFtZSA9IG5vZGUubmFtZS50ZXh0O1xuICAgICAgICB9IGVsc2UgaWYgKG5vZGUudGV4dCkge1xuICAgICAgICAgICAgbm9kZU5hbWUgPSBub2RlLnRleHQ7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5leHByZXNzaW9uKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5leHByZXNzaW9uLnRleHQpIHtcbiAgICAgICAgICAgICAgICBub2RlTmFtZSA9IG5vZGUuZXhwcmVzc2lvbi50ZXh0O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlLmV4cHJlc3Npb24uZWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodHMuaXNBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZU5hbWUgPSBub2RlLmV4cHJlc3Npb24uZWxlbWVudHMubWFwKGVsID0+IGVsLnRleHQpLmpvaW4oJywgJyk7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVOYW1lID0gYFske25vZGVOYW1lfV1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0cy5pc1NwcmVhZEVsZW1lbnQobm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBgLi4uJHtub2RlTmFtZX1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmJ1aWxkSWRlbnRpZmllck5hbWUobm9kZS5leHByZXNzaW9uLCBub2RlTmFtZSl9JHtuYW1lfWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcGFyc2UgZXhwcmVzc2lvbnMgc3VjaCBhczpcbiAgICAgKiB7IHByb3ZpZGU6IEFQUF9CQVNFX0hSRUYsIHVzZVZhbHVlOiAnLycgfVxuICAgICAqIHsgcHJvdmlkZTogJ0RhdGUnLCB1c2VGYWN0b3J5OiAoZDEsIGQyKSA9PiBuZXcgRGF0ZSgpLCBkZXBzOiBbJ2QxJywgJ2QyJ10gfVxuICAgICAqL1xuICAgIHB1YmxpYyBwYXJzZVByb3ZpZGVyQ29uZmlndXJhdGlvbihub2RlOiB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbik6IHN0cmluZyB7XG4gICAgICAgIGlmIChub2RlLmtpbmQgJiYgbm9kZS5raW5kID09PSBTeW50YXhLaW5kLk9iamVjdExpdGVyYWxFeHByZXNzaW9uKSB7XG4gICAgICAgICAgICAvLyBTZWFyY2ggZm9yIHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTXG4gICAgICAgICAgICAvLyBhbmQgaWYgdHJ1ZSwgcmV0dXJuIHR5cGU6ICdpbnRlcmNlcHRvcicgKyBuYW1lXG4gICAgICAgICAgICBsZXQgaW50ZXJjZXB0b3JOYW1lLCBoYXNJbnRlcmNlcHRvcjtcbiAgICAgICAgICAgIGlmIChub2RlLnByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5wcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKG5vZGUucHJvcGVydGllcywgcHJvcGVydHkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5LmtpbmQgJiYgcHJvcGVydHkua2luZCA9PT0gU3ludGF4S2luZC5Qcm9wZXJ0eUFzc2lnbm1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkubmFtZS50ZXh0ID09PSAncHJvdmlkZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5LmluaXRpYWxpemVyLnRleHQgPT09ICdIVFRQX0lOVEVSQ0VQVE9SUycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc0ludGVyY2VwdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5Lm5hbWUudGV4dCA9PT0gJ3VzZUNsYXNzJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eS5uYW1lLnRleHQgPT09ICd1c2VFeGlzdGluZydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJjZXB0b3JOYW1lID0gcHJvcGVydHkuaW5pdGlhbGl6ZXIudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNJbnRlcmNlcHRvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnRlcmNlcHRvck5hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVHNQcmludGVyVXRpbCgpLnByaW50KG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBUc1ByaW50ZXJVdGlsKCkucHJpbnQobm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBLaW5kXG4gICAgICogIDE4MSBDYWxsRXhwcmVzc2lvbiA9PiBcIlJvdXRlck1vZHVsZS5mb3JSb290KGFyZ3MpXCJcbiAgICAgKiAgIDcxIElkZW50aWZpZXIgICAgID0+IFwiUm91dGVyTW9kdWxlXCIgXCJUb2RvU3RvcmVcIlxuICAgICAqICAgIDkgU3RyaW5nTGl0ZXJhbCAgPT4gXCIuL2FwcC5jb21wb25lbnQuY3NzXCIgXCIuL3RhYi5zY3NzXCJcbiAgICAgKi9cbiAgICBwdWJsaWMgcGFyc2VTeW1ib2xFbGVtZW50cyhcbiAgICAgICAgbm9kZTpcbiAgICAgICAgICAgIHwgdHMuQ2FsbEV4cHJlc3Npb25cbiAgICAgICAgICAgIHwgdHMuSWRlbnRpZmllclxuICAgICAgICAgICAgfCB0cy5TdHJpbmdMaXRlcmFsXG4gICAgICAgICAgICB8IHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvblxuICAgICAgICAgICAgfCB0cy5TcHJlYWRFbGVtZW50XG4gICAgKTogc3RyaW5nIHtcbiAgICAgICAgLy8gcGFyc2UgZXhwcmVzc2lvbnMgc3VjaCBhczogQW5ndWxhckZpcmVNb2R1bGUuaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZylcbiAgICAgICAgLy8gaWYgKHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZSkgJiYgdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAodHMuaXNDYWxsRXhwcmVzc2lvbihub2RlKSAmJiB0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pKSB8fFxuICAgICAgICAgICAgKHRzLmlzTmV3RXhwcmVzc2lvbihub2RlKSAmJiB0cy5pc0VsZW1lbnRBY2Nlc3NFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbikpXG4gICAgICAgICkge1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IHRoaXMuYnVpbGRJZGVudGlmaWVyTmFtZShub2RlLmV4cHJlc3Npb24pO1xuXG4gICAgICAgICAgICAvLyBmdW5jdGlvbiBhcmd1bWVudHMgY291bGQgYmUgcmVhbGx5IGNvbXBsZXguIFRoZXJlIGFyZSBzb1xuICAgICAgICAgICAgLy8gbWFueSB1c2UgY2FzZXMgdGhhdCB3ZSBjYW4ndCBoYW5kbGUuIEp1c3QgcHJpbnQgXCJhcmdzXCIgdG8gaW5kaWNhdGVcbiAgICAgICAgICAgIC8vIHRoYXQgd2UgaGF2ZSBhcmd1bWVudHMuXG5cbiAgICAgICAgICAgIGxldCBmdW5jdGlvbkFyZ3MgPSBub2RlLmFyZ3VtZW50cy5sZW5ndGggPiAwID8gJ2FyZ3MnIDogJyc7XG4gICAgICAgICAgICBsZXQgdGV4dCA9IGAke2NsYXNzTmFtZX0oJHtmdW5jdGlvbkFyZ3N9KWA7XG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfSBlbHNlIGlmICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgICAgICAgLy8gcGFyc2UgZXhwcmVzc2lvbnMgc3VjaCBhczogU2hhcmVkLk1vZHVsZVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRJZGVudGlmaWVyTmFtZShub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkpIHtcbiAgICAgICAgICAgIC8vIHBhcnNlIGV4cHJlc3Npb25zIHN1Y2ggYXM6IE15Q29tcG9uZW50XG4gICAgICAgICAgICBpZiAobm9kZS50ZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUudGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmVzY2FwZWRUZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuZXNjYXBlZFRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHMuaXNTcHJlYWRFbGVtZW50KG5vZGUpKSB7XG4gICAgICAgICAgICAvLyBwYXJzZSBleHByZXNzaW9ucyBzdWNoIGFzOiAuLi5NWUFSUkFZXG4gICAgICAgICAgICAvLyBSZXNvbHZlIE1ZQVJSQVkgaW4gaW1wb3J0cyBvciBsb2NhbCBmaWxlIHZhcmlhYmxlcyBhZnRlciBmdWxsIHNjYW4sIGp1c3QgcmV0dXJuIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZVxuICAgICAgICAgICAgaWYgKG5vZGUuZXhwcmVzc2lvbiAmJiBub2RlLmV4cHJlc3Npb24udGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmV4cHJlc3Npb24udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlLnRleHQgPyBub2RlLnRleHQgOiB0aGlzLnBhcnNlUHJvdmlkZXJDb25maWd1cmF0aW9uKG5vZGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEtpbmRcbiAgICAgKiAgMTc3IEFycmF5TGl0ZXJhbEV4cHJlc3Npb25cbiAgICAgKiAgMTIyIEJvb2xlYW5LZXl3b3JkXG4gICAgICogICAgOSBTdHJpbmdMaXRlcmFsXG4gICAgICovXG4gICAgcHJpdmF0ZSBwYXJzZVN5bWJvbHMoXG4gICAgICAgIG5vZGU6IHRzLk9iamVjdExpdGVyYWxFbGVtZW50LFxuICAgICAgICBzcmNGaWxlOiB0cy5Tb3VyY2VGaWxlXG4gICAgKTogQXJyYXk8c3RyaW5nIHwgYm9vbGVhbj4ge1xuICAgICAgICBsZXQgbG9jYWxOb2RlID0gbm9kZTtcblxuICAgICAgICBpZiAodHMuaXNTaG9ydGhhbmRQcm9wZXJ0eUFzc2lnbm1lbnQobG9jYWxOb2RlKSkge1xuICAgICAgICAgICAgbG9jYWxOb2RlID0gSW1wb3J0c1V0aWwuZmluZFZhbHVlSW5JbXBvcnRPckxvY2FsVmFyaWFibGVzKG5vZGUubmFtZS50ZXh0LCBzcmNGaWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24obG9jYWxOb2RlLmluaXRpYWxpemVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsTm9kZS5pbml0aWFsaXplci5lbGVtZW50cy5tYXAoeCA9PiB0aGlzLnBhcnNlU3ltYm9sRWxlbWVudHMoeCkpO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgdHMuaXNTdHJpbmdMaXRlcmFsKGxvY2FsTm9kZS5pbml0aWFsaXplcikgfHxcbiAgICAgICAgICAgIHRzLmlzVGVtcGxhdGVMaXRlcmFsKGxvY2FsTm9kZS5pbml0aWFsaXplcikgfHxcbiAgICAgICAgICAgICh0cy5pc1Byb3BlcnR5QXNzaWdubWVudChsb2NhbE5vZGUpICYmIGxvY2FsTm9kZS5pbml0aWFsaXplci50ZXh0KVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiBbbG9jYWxOb2RlLmluaXRpYWxpemVyLnRleHRdO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgbG9jYWxOb2RlLmluaXRpYWxpemVyLmtpbmQgJiZcbiAgICAgICAgICAgIChsb2NhbE5vZGUuaW5pdGlhbGl6ZXIua2luZCA9PT0gU3ludGF4S2luZC5UcnVlS2V5d29yZCB8fFxuICAgICAgICAgICAgICAgIGxvY2FsTm9kZS5pbml0aWFsaXplci5raW5kID09PSBTeW50YXhLaW5kLkZhbHNlS2V5d29yZClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gW2xvY2FsTm9kZS5pbml0aWFsaXplci5raW5kID09PSBTeW50YXhLaW5kLlRydWVLZXl3b3JkID8gdHJ1ZSA6IGZhbHNlXTtcbiAgICAgICAgfSBlbHNlIGlmICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihsb2NhbE5vZGUuaW5pdGlhbGl6ZXIpKSB7XG4gICAgICAgICAgICBsZXQgaWRlbnRpZmllciA9IHRoaXMucGFyc2VTeW1ib2xFbGVtZW50cyhsb2NhbE5vZGUuaW5pdGlhbGl6ZXIpO1xuICAgICAgICAgICAgcmV0dXJuIFtpZGVudGlmaWVyXTtcbiAgICAgICAgfSBlbHNlIGlmICh0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24obG9jYWxOb2RlLmluaXRpYWxpemVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsTm9kZS5pbml0aWFsaXplci5lbGVtZW50cy5tYXAoeCA9PiB0aGlzLnBhcnNlU3ltYm9sRWxlbWVudHMoeCkpO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgbG9jYWxOb2RlLmluaXRpYWxpemVyICYmXG4gICAgICAgICAgICBsb2NhbE5vZGUuaW5pdGlhbGl6ZXIuZWxlbWVudHMgJiZcbiAgICAgICAgICAgIGxvY2FsTm9kZS5pbml0aWFsaXplci5lbGVtZW50cy5sZW5ndGggPiAwXG4gICAgICAgICkge1xuICAgICAgICAgICAgLy8gTm9kZSByZXBsYWNlZCBieSB0cy1zaW1wbGUtYXN0ICYga2luZCA9IDI2NVxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsTm9kZS5pbml0aWFsaXplci5lbGVtZW50cy5tYXAoeCA9PiB0aGlzLnBhcnNlU3ltYm9sRWxlbWVudHMoeCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldFN5bWJvbERlcHMoXG4gICAgICAgIHByb3BzOiBSZWFkb25seUFycmF5PHRzLk9iamVjdExpdGVyYWxFbGVtZW50TGlrZT4sXG4gICAgICAgIHR5cGU6IHN0cmluZyxcbiAgICAgICAgc3JjRmlsZTogdHMuU291cmNlRmlsZSxcbiAgICAgICAgbXVsdGlMaW5lPzogYm9vbGVhblxuICAgICk6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICBpZiAocHJvcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaSA9IDAsXG4gICAgICAgICAgICBsZW4gPSBwcm9wcy5sZW5ndGgsXG4gICAgICAgICAgICBmaWx0ZXJlZFByb3BzID0gW107XG5cbiAgICAgICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChwcm9wc1tpXS5uYW1lICYmIHByb3BzW2ldLm5hbWUudGV4dCA9PT0gdHlwZSkge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkUHJvcHMucHVzaChwcm9wc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsdGVyZWRQcm9wcy5tYXAoeCA9PiB0aGlzLnBhcnNlU3ltYm9scyh4LCBzcmNGaWxlKSkucG9wKCkgfHwgW107XG4gICAgfVxuXG4gICAgcHVibGljIGdldFN5bWJvbERlcHNSYXcoXG4gICAgICAgIHByb3BzOiBSZWFkb25seUFycmF5PHRzLk9iamVjdExpdGVyYWxFbGVtZW50TGlrZT4sXG4gICAgICAgIHR5cGU6IHN0cmluZyxcbiAgICAgICAgbXVsdGlMaW5lPzogYm9vbGVhblxuICAgICk6IEFycmF5PHRzLk9iamVjdExpdGVyYWxFbGVtZW50TGlrZT4ge1xuICAgICAgICByZXR1cm4gcHJvcHMuZmlsdGVyKG5vZGUgPT4gbm9kZS5uYW1lLnRleHQgPT09IHR5cGUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUGFyc2VEZWVwSWRlbnRpZmllclJlc3VsdCB7XG4gICAgbnM/OiBhbnk7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGZpbGU/OiBzdHJpbmc7XG4gICAgdHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xufVxuIl19