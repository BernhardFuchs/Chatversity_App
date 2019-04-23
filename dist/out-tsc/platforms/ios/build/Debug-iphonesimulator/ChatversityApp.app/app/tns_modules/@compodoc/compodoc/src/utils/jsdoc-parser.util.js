"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var ts_simple_ast_1 = require("ts-simple-ast");
var JsdocParserUtil = /** @class */ (function () {
    function JsdocParserUtil() {
    }
    JsdocParserUtil.prototype.isVariableLike = function (node) {
        if (node) {
            switch (node.kind) {
                case ts_simple_ast_1.SyntaxKind.BindingElement:
                case ts_simple_ast_1.SyntaxKind.EnumMember:
                case ts_simple_ast_1.SyntaxKind.Parameter:
                case ts_simple_ast_1.SyntaxKind.PropertyAssignment:
                case ts_simple_ast_1.SyntaxKind.PropertyDeclaration:
                case ts_simple_ast_1.SyntaxKind.PropertySignature:
                case ts_simple_ast_1.SyntaxKind.ShorthandPropertyAssignment:
                case ts_simple_ast_1.SyntaxKind.VariableDeclaration:
                    return true;
            }
        }
        return false;
    };
    JsdocParserUtil.prototype.getMainCommentOfNode = function (node) {
        var description = '';
        if (node.jsDoc) {
            if (node.jsDoc.length > 0) {
                if (typeof node.jsDoc[0].comment !== 'undefined') {
                    description = node.jsDoc[0].comment;
                }
            }
        }
        return description;
    };
    JsdocParserUtil.prototype.getJSDocTags = function (node, kind) {
        var docs = this.getJSDocs(node);
        if (docs) {
            var result = [];
            for (var _i = 0, docs_1 = docs; _i < docs_1.length; _i++) {
                var doc = docs_1[_i];
                if (ts_simple_ast_1.ts.isJSDocParameterTag(doc)) {
                    if (doc.kind === kind) {
                        result.push(doc);
                    }
                }
                else if (ts_simple_ast_1.ts.isJSDoc(doc)) {
                    result.push.apply(result, _.filter(doc.tags, function (tag) { return tag.kind === kind; }));
                }
                else {
                    throw new Error('Unexpected type');
                }
            }
            return result;
        }
    };
    JsdocParserUtil.prototype.getJSDocs = function (node) {
        // TODO: jsDocCache is internal, see if there's a way around it
        var cache = node.jsDocCache;
        if (!cache) {
            cache = this.getJSDocsWorker(node, []).filter(function (x) { return x; });
            node.jsDocCache = cache;
        }
        return cache;
    };
    // Try to recognize this pattern when node is initializer
    // of variable declaration and JSDoc comments are on containing variable statement.
    // /**
    //   * @param {number} name
    //   * @returns {number}
    //   */
    // var x = function(name) { return name.length; }
    JsdocParserUtil.prototype.getJSDocsWorker = function (node, cache) {
        var parent = node.parent;
        var isInitializerOfVariableDeclarationInStatement = this.isVariableLike(parent) &&
            parent.initializer === node &&
            ts_simple_ast_1.ts.isVariableStatement(parent.parent.parent);
        var isVariableOfVariableDeclarationStatement = this.isVariableLike(node) && ts_simple_ast_1.ts.isVariableStatement(parent.parent);
        var variableStatementNode = isInitializerOfVariableDeclarationInStatement
            ? parent.parent.parent
            : isVariableOfVariableDeclarationStatement
                ? parent.parent
                : undefined;
        if (variableStatementNode) {
            cache = this.getJSDocsWorker(variableStatementNode, cache);
        }
        // Also recognize when the node is the RHS of an assignment expression
        var isSourceOfAssignmentExpressionStatement = parent &&
            parent.parent &&
            ts_simple_ast_1.ts.isBinaryExpression(parent) &&
            parent.operatorToken.kind === ts_simple_ast_1.SyntaxKind.EqualsToken &&
            ts_simple_ast_1.ts.isExpressionStatement(parent.parent);
        if (isSourceOfAssignmentExpressionStatement) {
            cache = this.getJSDocsWorker(parent.parent, cache);
        }
        var isModuleDeclaration = ts_simple_ast_1.ts.isModuleDeclaration(node) && parent && ts_simple_ast_1.ts.isModuleDeclaration(parent);
        var isPropertyAssignmentExpression = parent && ts_simple_ast_1.ts.isPropertyAssignment(parent);
        if (isModuleDeclaration || isPropertyAssignmentExpression) {
            cache = this.getJSDocsWorker(parent, cache);
        }
        // Pull parameter comments from declaring function as well
        if (ts_simple_ast_1.ts.isParameter(node)) {
            cache = _.concat(cache, this.getJSDocParameterTags(node));
        }
        if (this.isVariableLike(node) && node.initializer) {
            cache = _.concat(cache, node.initializer.jsDoc);
        }
        cache = _.concat(cache, node.jsDoc);
        return cache;
    };
    JsdocParserUtil.prototype.getJSDocParameterTags = function (param) {
        var func = param.parent;
        var tags = this.getJSDocTags(func, ts_simple_ast_1.SyntaxKind.JSDocParameterTag);
        if (!param.name) {
            // this is an anonymous jsdoc param from a `function(type1, type2): type3` specification
            var i = func.parameters.indexOf(param);
            var paramTags = _.filter(tags, function (tag) { return ts_simple_ast_1.ts.isJSDocParameterTag(tag); });
            if (paramTags && 0 <= i && i < paramTags.length) {
                return [paramTags[i]];
            }
        }
        else if (ts_simple_ast_1.ts.isIdentifier(param.name)) {
            var name_1 = param.name.text;
            return _.filter(tags, function (tag) {
                if (ts_simple_ast_1.ts && ts_simple_ast_1.ts.isJSDocParameterTag(tag)) {
                    var t = tag;
                    if (typeof t.parameterName !== 'undefined') {
                        return t.parameterName.text === name_1;
                    }
                    else if (typeof t.name !== 'undefined') {
                        if (typeof t.name.escapedText !== 'undefined') {
                            return t.name.escapedText === name_1;
                        }
                    }
                }
            });
        }
        else {
            // TODO: it's a destructured parameter, so it should look up an "object type" series of multiple lines
            // But multi-line object types aren't supported yet either
            return undefined;
        }
    };
    return JsdocParserUtil;
}());
exports.JsdocParserUtil = JsdocParserUtil;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNkb2MtcGFyc2VyLnV0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvdXRpbHMvanNkb2MtcGFyc2VyLnV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQkFBNEI7QUFDNUIsK0NBQStDO0FBSS9DO0lBQUE7SUF3SkEsQ0FBQztJQXZKVSx3Q0FBYyxHQUFyQixVQUFzQixJQUFhO1FBQy9CLElBQUksSUFBSSxFQUFFO1lBQ04sUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNmLEtBQUssMEJBQVUsQ0FBQyxjQUFjLENBQUM7Z0JBQy9CLEtBQUssMEJBQVUsQ0FBQyxVQUFVLENBQUM7Z0JBQzNCLEtBQUssMEJBQVUsQ0FBQyxTQUFTLENBQUM7Z0JBQzFCLEtBQUssMEJBQVUsQ0FBQyxrQkFBa0IsQ0FBQztnQkFDbkMsS0FBSywwQkFBVSxDQUFDLG1CQUFtQixDQUFDO2dCQUNwQyxLQUFLLDBCQUFVLENBQUMsaUJBQWlCLENBQUM7Z0JBQ2xDLEtBQUssMEJBQVUsQ0FBQywyQkFBMkIsQ0FBQztnQkFDNUMsS0FBSywwQkFBVSxDQUFDLG1CQUFtQjtvQkFDL0IsT0FBTyxJQUFJLENBQUM7YUFDbkI7U0FDSjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTSw4Q0FBb0IsR0FBM0IsVUFBNEIsSUFBYTtRQUNyQyxJQUFJLFdBQVcsR0FBVyxFQUFFLENBQUM7UUFDN0IsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1osSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZCLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFD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Q0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLE1BQUksQ0FBQztxQkFDeEM7eUJBQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO3dCQUN0QyxJQUFJLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEtBQUssV0FBVyxFQUFFOzRCQUMzQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxLQUFLLE1BQUksQ0FBQzt5QkFDdEM7cUJBQ0o7aUJBQ0o7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNOO2FBQU07WUFDSCxzR0FBc0c7WUFDdEcsMERBQTBEO1lBQzFELE9BQU8sU0FBUyxDQUFDO1NBQ3BCO0lBQ0wsQ0FBQztJQUNMLHNCQUFDO0FBQUQsQ0FBQyxBQXhKRCxJQXdKQztBQXhKWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IHRzLCBTeW50YXhLaW5kIH0gZnJvbSAndHMtc2ltcGxlLWFzdCc7XG5cbmltcG9ydCB7IEpTRG9jUGFyYW1ldGVyVGFnRXh0IH0gZnJvbSAnLi4vYXBwL25vZGVzL2pzZG9jLXBhcmFtZXRlci10YWcubm9kZSc7XG5cbmV4cG9ydCBjbGFzcyBKc2RvY1BhcnNlclV0aWwge1xuICAgIHB1YmxpYyBpc1ZhcmlhYmxlTGlrZShub2RlOiB0cy5Ob2RlKTogbm9kZSBpcyB0cy5WYXJpYWJsZUxpa2VEZWNsYXJhdGlvbiB7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG5vZGUua2luZCkge1xuICAgICAgICAgICAgICAgIGNhc2UgU3ludGF4S2luZC5CaW5kaW5nRWxlbWVudDpcbiAgICAgICAgICAgICAgICBjYXNlIFN5bnRheEtpbmQuRW51bU1lbWJlcjpcbiAgICAgICAgICAgICAgICBjYXNlIFN5bnRheEtpbmQuUGFyYW1ldGVyOlxuICAgICAgICAgICAgICAgIGNhc2UgU3ludGF4S2luZC5Qcm9wZXJ0eUFzc2lnbm1lbnQ6XG4gICAgICAgICAgICAgICAgY2FzZSBTeW50YXhLaW5kLlByb3BlcnR5RGVjbGFyYXRpb246XG4gICAgICAgICAgICAgICAgY2FzZSBTeW50YXhLaW5kLlByb3BlcnR5U2lnbmF0dXJlOlxuICAgICAgICAgICAgICAgIGNhc2UgU3ludGF4S2luZC5TaG9ydGhhbmRQcm9wZXJ0eUFzc2lnbm1lbnQ6XG4gICAgICAgICAgICAgICAgY2FzZSBTeW50YXhLaW5kLlZhcmlhYmxlRGVjbGFyYXRpb246XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TWFpbkNvbW1lbnRPZk5vZGUobm9kZTogdHMuTm9kZSk6IHN0cmluZyB7XG4gICAgICAgIGxldCBkZXNjcmlwdGlvbjogc3RyaW5nID0gJyc7XG4gICAgICAgIGlmIChub2RlLmpzRG9jKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5qc0RvYy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlLmpzRG9jWzBdLmNvbW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gbm9kZS5qc0RvY1swXS5jb21tZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRpb247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRKU0RvY1RhZ3Mobm9kZTogdHMuTm9kZSwga2luZDogU3ludGF4S2luZCk6IHRzLkpTRG9jVGFnW10ge1xuICAgICAgICBjb25zdCBkb2NzID0gdGhpcy5nZXRKU0RvY3Mobm9kZSk7XG4gICAgICAgIGlmIChkb2NzKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQ6IHRzLkpTRG9jVGFnW10gPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZG9jIG9mIGRvY3MpIHtcbiAgICAgICAgICAgICAgICBpZiAodHMuaXNKU0RvY1BhcmFtZXRlclRhZyhkb2MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkb2Mua2luZCA9PT0ga2luZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZG9jKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHMuaXNKU0RvYyhkb2MpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKC4uLl8uZmlsdGVyKGRvYy50YWdzLCB0YWcgPT4gdGFnLmtpbmQgPT09IGtpbmQpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgdHlwZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0SlNEb2NzKG5vZGU6IHRzLk5vZGUpOiBSZWFkb25seUFycmF5PHRzLkpTRG9jIHwgdHMuSlNEb2NUYWc+IHtcbiAgICAgICAgLy8gVE9ETzoganNEb2NDYWNoZSBpcyBpbnRlcm5hbCwgc2VlIGlmIHRoZXJlJ3MgYSB3YXkgYXJvdW5kIGl0XG4gICAgICAgIGxldCBjYWNoZTogUmVhZG9ubHlBcnJheTx0cy5KU0RvYyB8IHRzLkpTRG9jVGFnPiA9IChub2RlIGFzIGFueSkuanNEb2NDYWNoZTtcbiAgICAgICAgaWYgKCFjYWNoZSkge1xuICAgICAgICAgICAgY2FjaGUgPSB0aGlzLmdldEpTRG9jc1dvcmtlcihub2RlLCBbXSkuZmlsdGVyKHggPT4geCk7XG4gICAgICAgICAgICAobm9kZSBhcyBhbnkpLmpzRG9jQ2FjaGUgPSBjYWNoZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FjaGU7XG4gICAgfVxuXG4gICAgLy8gVHJ5IHRvIHJlY29nbml6ZSB0aGlzIHBhdHRlcm4gd2hlbiBub2RlIGlzIGluaXRpYWxpemVyXG4gICAgLy8gb2YgdmFyaWFibGUgZGVjbGFyYXRpb24gYW5kIEpTRG9jIGNvbW1lbnRzIGFyZSBvbiBjb250YWluaW5nIHZhcmlhYmxlIHN0YXRlbWVudC5cbiAgICAvLyAvKipcbiAgICAvLyAgICogQHBhcmFtIHtudW1iZXJ9IG5hbWVcbiAgICAvLyAgICogQHJldHVybnMge251bWJlcn1cbiAgICAvLyAgICovXG4gICAgLy8gdmFyIHggPSBmdW5jdGlvbihuYW1lKSB7IHJldHVybiBuYW1lLmxlbmd0aDsgfVxuICAgIHByaXZhdGUgZ2V0SlNEb2NzV29ya2VyKG5vZGU6IHRzLk5vZGUsIGNhY2hlKTogUmVhZG9ubHlBcnJheTxhbnk+IHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gICAgICAgIGNvbnN0IGlzSW5pdGlhbGl6ZXJPZlZhcmlhYmxlRGVjbGFyYXRpb25JblN0YXRlbWVudCA9XG4gICAgICAgICAgICB0aGlzLmlzVmFyaWFibGVMaWtlKHBhcmVudCkgJiZcbiAgICAgICAgICAgIHBhcmVudC5pbml0aWFsaXplciA9PT0gbm9kZSAmJlxuICAgICAgICAgICAgdHMuaXNWYXJpYWJsZVN0YXRlbWVudChwYXJlbnQucGFyZW50LnBhcmVudCk7XG4gICAgICAgIGNvbnN0IGlzVmFyaWFibGVPZlZhcmlhYmxlRGVjbGFyYXRpb25TdGF0ZW1lbnQgPVxuICAgICAgICAgICAgdGhpcy5pc1ZhcmlhYmxlTGlrZShub2RlKSAmJiB0cy5pc1ZhcmlhYmxlU3RhdGVtZW50KHBhcmVudC5wYXJlbnQpO1xuICAgICAgICBjb25zdCB2YXJpYWJsZVN0YXRlbWVudE5vZGUgPSBpc0luaXRpYWxpemVyT2ZWYXJpYWJsZURlY2xhcmF0aW9uSW5TdGF0ZW1lbnRcbiAgICAgICAgICAgID8gcGFyZW50LnBhcmVudC5wYXJlbnRcbiAgICAgICAgICAgIDogaXNWYXJpYWJsZU9mVmFyaWFibGVEZWNsYXJhdGlvblN0YXRlbWVudFxuICAgICAgICAgICAgPyBwYXJlbnQucGFyZW50XG4gICAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHZhcmlhYmxlU3RhdGVtZW50Tm9kZSkge1xuICAgICAgICAgICAgY2FjaGUgPSB0aGlzLmdldEpTRG9jc1dvcmtlcih2YXJpYWJsZVN0YXRlbWVudE5vZGUsIGNhY2hlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsc28gcmVjb2duaXplIHdoZW4gdGhlIG5vZGUgaXMgdGhlIFJIUyBvZiBhbiBhc3NpZ25tZW50IGV4cHJlc3Npb25cbiAgICAgICAgY29uc3QgaXNTb3VyY2VPZkFzc2lnbm1lbnRFeHByZXNzaW9uU3RhdGVtZW50ID1cbiAgICAgICAgICAgIHBhcmVudCAmJlxuICAgICAgICAgICAgcGFyZW50LnBhcmVudCAmJlxuICAgICAgICAgICAgdHMuaXNCaW5hcnlFeHByZXNzaW9uKHBhcmVudCkgJiZcbiAgICAgICAgICAgIHBhcmVudC5vcGVyYXRvclRva2VuLmtpbmQgPT09IFN5bnRheEtpbmQuRXF1YWxzVG9rZW4gJiZcbiAgICAgICAgICAgIHRzLmlzRXhwcmVzc2lvblN0YXRlbWVudChwYXJlbnQucGFyZW50KTtcbiAgICAgICAgaWYgKGlzU291cmNlT2ZBc3NpZ25tZW50RXhwcmVzc2lvblN0YXRlbWVudCkge1xuICAgICAgICAgICAgY2FjaGUgPSB0aGlzLmdldEpTRG9jc1dvcmtlcihwYXJlbnQucGFyZW50LCBjYWNoZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpc01vZHVsZURlY2xhcmF0aW9uID1cbiAgICAgICAgICAgIHRzLmlzTW9kdWxlRGVjbGFyYXRpb24obm9kZSkgJiYgcGFyZW50ICYmIHRzLmlzTW9kdWxlRGVjbGFyYXRpb24ocGFyZW50KTtcbiAgICAgICAgY29uc3QgaXNQcm9wZXJ0eUFzc2lnbm1lbnRFeHByZXNzaW9uID0gcGFyZW50ICYmIHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHBhcmVudCk7XG4gICAgICAgIGlmIChpc01vZHVsZURlY2xhcmF0aW9uIHx8IGlzUHJvcGVydHlBc3NpZ25tZW50RXhwcmVzc2lvbikge1xuICAgICAgICAgICAgY2FjaGUgPSB0aGlzLmdldEpTRG9jc1dvcmtlcihwYXJlbnQsIGNhY2hlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFB1bGwgcGFyYW1ldGVyIGNvbW1lbnRzIGZyb20gZGVjbGFyaW5nIGZ1bmN0aW9uIGFzIHdlbGxcbiAgICAgICAgaWYgKHRzLmlzUGFyYW1ldGVyKG5vZGUpKSB7XG4gICAgICAgICAgICBjYWNoZSA9IF8uY29uY2F0KGNhY2hlLCB0aGlzLmdldEpTRG9jUGFyYW1ldGVyVGFncyhub2RlKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1ZhcmlhYmxlTGlrZShub2RlKSAmJiBub2RlLmluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICBjYWNoZSA9IF8uY29uY2F0KGNhY2hlLCBub2RlLmluaXRpYWxpemVyLmpzRG9jKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhY2hlID0gXy5jb25jYXQoY2FjaGUsIG5vZGUuanNEb2MpO1xuXG4gICAgICAgIHJldHVybiBjYWNoZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEpTRG9jUGFyYW1ldGVyVGFncyhcbiAgICAgICAgcGFyYW06IHRzLlBhcmFtZXRlckRlY2xhcmF0aW9uXG4gICAgKTogUmVhZG9ubHlBcnJheTx0cy5KU0RvY1BhcmFtZXRlclRhZz4ge1xuICAgICAgICBjb25zdCBmdW5jID0gcGFyYW0ucGFyZW50IGFzIHRzLkZ1bmN0aW9uTGlrZURlY2xhcmF0aW9uO1xuICAgICAgICBjb25zdCB0YWdzID0gdGhpcy5nZXRKU0RvY1RhZ3MoXG4gICAgICAgICAgICBmdW5jLFxuICAgICAgICAgICAgU3ludGF4S2luZC5KU0RvY1BhcmFtZXRlclRhZ1xuICAgICAgICApIGFzIHRzLkpTRG9jUGFyYW1ldGVyVGFnW107XG5cbiAgICAgICAgaWYgKCFwYXJhbS5uYW1lKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIGFuIGFub255bW91cyBqc2RvYyBwYXJhbSBmcm9tIGEgYGZ1bmN0aW9uKHR5cGUxLCB0eXBlMik6IHR5cGUzYCBzcGVjaWZpY2F0aW9uXG4gICAgICAgICAgICBjb25zdCBpID0gZnVuYy5wYXJhbWV0ZXJzLmluZGV4T2YocGFyYW0pO1xuICAgICAgICAgICAgY29uc3QgcGFyYW1UYWdzID0gXy5maWx0ZXIodGFncywgdGFnID0+IHRzLmlzSlNEb2NQYXJhbWV0ZXJUYWcodGFnKSk7XG5cbiAgICAgICAgICAgIGlmIChwYXJhbVRhZ3MgJiYgMCA8PSBpICYmIGkgPCBwYXJhbVRhZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtwYXJhbVRhZ3NbaV1dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRzLmlzSWRlbnRpZmllcihwYXJhbS5uYW1lKSkge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IHBhcmFtLm5hbWUudGV4dDtcbiAgICAgICAgICAgIHJldHVybiBfLmZpbHRlcih0YWdzLCB0YWcgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0cyAmJiB0cy5pc0pTRG9jUGFyYW1ldGVyVGFnKHRhZykpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHQ6IEpTRG9jUGFyYW1ldGVyVGFnRXh0ID0gdGFnO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHQucGFyYW1ldGVyTmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0LnBhcmFtZXRlck5hbWUudGV4dCA9PT0gbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdC5uYW1lICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0Lm5hbWUuZXNjYXBlZFRleHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQubmFtZS5lc2NhcGVkVGV4dCA9PT0gbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVE9ETzogaXQncyBhIGRlc3RydWN0dXJlZCBwYXJhbWV0ZXIsIHNvIGl0IHNob3VsZCBsb29rIHVwIGFuIFwib2JqZWN0IHR5cGVcIiBzZXJpZXMgb2YgbXVsdGlwbGUgbGluZXNcbiAgICAgICAgICAgIC8vIEJ1dCBtdWx0aS1saW5lIG9iamVjdCB0eXBlcyBhcmVuJ3Qgc3VwcG9ydGVkIHlldCBlaXRoZXJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=