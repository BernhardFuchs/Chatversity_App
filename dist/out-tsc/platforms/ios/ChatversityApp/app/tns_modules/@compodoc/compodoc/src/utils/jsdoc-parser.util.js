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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNkb2MtcGFyc2VyLnV0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL3V0aWxzL2pzZG9jLXBhcnNlci51dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMEJBQTRCO0FBQzVCLCtDQUErQztBQUkvQztJQUFBO0lBd0pBLENBQUM7SUF2SlUsd0NBQWMsR0FBckIsVUFBc0IsSUFBYTtRQUMvQixJQUFJLElBQUksRUFBRTtZQUNOLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDZixLQUFLLDBCQUFVLENBQUMsY0FBYyxDQUFDO2dCQUMvQixLQUFLLDBCQUFVLENBQUMsVUFBVSxDQUFDO2dCQUMzQixLQUFLLDBCQUFVLENBQUMsU0FBUyxDQUFDO2dCQUMxQixLQUFLLDBCQUFVLENBQUMsa0JBQWtCLENBQUM7Z0JBQ25DLEtBQUssMEJBQVUsQ0FBQyxtQkFBbUIsQ0FBQztnQkFDcEMsS0FBSywwQkFBVSxDQUFDLGlCQUFpQixDQUFDO2dCQUNsQyxLQUFLLDBCQUFVLENBQUMsMkJBQTJCLENBQUM7Z0JBQzVDLEtBQUssMEJBQVUsQ0FBQyxtQkFBbUI7b0JBQy9CLE9BQU8sSUFBSSxDQUFDO2FBQ25CO1NBQ0o7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU0sOENBQW9CLEdBQTNCLFVBQTRCLElBQWE7UUFDckMsSUFBSSxXQUFXLEdBQVcsRUFBRSxDQUFDO1FBQzdCLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNaLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN2QixJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssV0FBVyxFQUFFO29C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Q3hDO3lCQUFNLElBQUksT0FBTyxDQUFDLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTt3QkFDdEMsSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxLQUFLLFdBQVcsRUFBRTs0QkFDM0MsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsS0FBSyxNQUFJLENBQUM7eUJBQ3RDO3FCQUNKO2lCQUNKO1lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDTjthQUFNO1lBQ0gsc0dBQXNHO1lBQ3RHLDBEQUEwRDtZQUMxRCxPQUFPLFNBQVMsQ0FBQztTQUNwQjtJQUNMLENBQUM7SUFDTCxzQkFBQztBQUFELENBQUMsQUF4SkQsSUF3SkM7QUF4SlksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyB0cywgU3ludGF4S2luZCB9IGZyb20gJ3RzLXNpbXBsZS1hc3QnO1xuXG5pbXBvcnQgeyBKU0RvY1BhcmFtZXRlclRhZ0V4dCB9IGZyb20gJy4uL2FwcC9ub2Rlcy9qc2RvYy1wYXJhbWV0ZXItdGFnLm5vZGUnO1xuXG5leHBvcnQgY2xhc3MgSnNkb2NQYXJzZXJVdGlsIHtcbiAgICBwdWJsaWMgaXNWYXJpYWJsZUxpa2Uobm9kZTogdHMuTm9kZSk6IG5vZGUgaXMgdHMuVmFyaWFibGVMaWtlRGVjbGFyYXRpb24ge1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgc3dpdGNoIChub2RlLmtpbmQpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFN5bnRheEtpbmQuQmluZGluZ0VsZW1lbnQ6XG4gICAgICAgICAgICAgICAgY2FzZSBTeW50YXhLaW5kLkVudW1NZW1iZXI6XG4gICAgICAgICAgICAgICAgY2FzZSBTeW50YXhLaW5kLlBhcmFtZXRlcjpcbiAgICAgICAgICAgICAgICBjYXNlIFN5bnRheEtpbmQuUHJvcGVydHlBc3NpZ25tZW50OlxuICAgICAgICAgICAgICAgIGNhc2UgU3ludGF4S2luZC5Qcm9wZXJ0eURlY2xhcmF0aW9uOlxuICAgICAgICAgICAgICAgIGNhc2UgU3ludGF4S2luZC5Qcm9wZXJ0eVNpZ25hdHVyZTpcbiAgICAgICAgICAgICAgICBjYXNlIFN5bnRheEtpbmQuU2hvcnRoYW5kUHJvcGVydHlBc3NpZ25tZW50OlxuICAgICAgICAgICAgICAgIGNhc2UgU3ludGF4S2luZC5WYXJpYWJsZURlY2xhcmF0aW9uOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE1haW5Db21tZW50T2ZOb2RlKG5vZGU6IHRzLk5vZGUpOiBzdHJpbmcge1xuICAgICAgICBsZXQgZGVzY3JpcHRpb246IHN0cmluZyA9ICcnO1xuICAgICAgICBpZiAobm9kZS5qc0RvYykge1xuICAgICAgICAgICAgaWYgKG5vZGUuanNEb2MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZS5qc0RvY1swXS5jb21tZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IG5vZGUuanNEb2NbMF0uY29tbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0aW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SlNEb2NUYWdzKG5vZGU6IHRzLk5vZGUsIGtpbmQ6IFN5bnRheEtpbmQpOiB0cy5KU0RvY1RhZ1tdIHtcbiAgICAgICAgY29uc3QgZG9jcyA9IHRoaXMuZ2V0SlNEb2NzKG5vZGUpO1xuICAgICAgICBpZiAoZG9jcykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0OiB0cy5KU0RvY1RhZ1tdID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGRvYyBvZiBkb2NzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRzLmlzSlNEb2NQYXJhbWV0ZXJUYWcoZG9jKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZG9jLmtpbmQgPT09IGtpbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGRvYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRzLmlzSlNEb2MoZG9jKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCguLi5fLmZpbHRlcihkb2MudGFncywgdGFnID0+IHRhZy5raW5kID09PSBraW5kKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIHR5cGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldEpTRG9jcyhub2RlOiB0cy5Ob2RlKTogUmVhZG9ubHlBcnJheTx0cy5KU0RvYyB8IHRzLkpTRG9jVGFnPiB7XG4gICAgICAgIC8vIFRPRE86IGpzRG9jQ2FjaGUgaXMgaW50ZXJuYWwsIHNlZSBpZiB0aGVyZSdzIGEgd2F5IGFyb3VuZCBpdFxuICAgICAgICBsZXQgY2FjaGU6IFJlYWRvbmx5QXJyYXk8dHMuSlNEb2MgfCB0cy5KU0RvY1RhZz4gPSAobm9kZSBhcyBhbnkpLmpzRG9jQ2FjaGU7XG4gICAgICAgIGlmICghY2FjaGUpIHtcbiAgICAgICAgICAgIGNhY2hlID0gdGhpcy5nZXRKU0RvY3NXb3JrZXIobm9kZSwgW10pLmZpbHRlcih4ID0+IHgpO1xuICAgICAgICAgICAgKG5vZGUgYXMgYW55KS5qc0RvY0NhY2hlID0gY2FjaGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhY2hlO1xuICAgIH1cblxuICAgIC8vIFRyeSB0byByZWNvZ25pemUgdGhpcyBwYXR0ZXJuIHdoZW4gbm9kZSBpcyBpbml0aWFsaXplclxuICAgIC8vIG9mIHZhcmlhYmxlIGRlY2xhcmF0aW9uIGFuZCBKU0RvYyBjb21tZW50cyBhcmUgb24gY29udGFpbmluZyB2YXJpYWJsZSBzdGF0ZW1lbnQuXG4gICAgLy8gLyoqXG4gICAgLy8gICAqIEBwYXJhbSB7bnVtYmVyfSBuYW1lXG4gICAgLy8gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgLy8gICAqL1xuICAgIC8vIHZhciB4ID0gZnVuY3Rpb24obmFtZSkgeyByZXR1cm4gbmFtZS5sZW5ndGg7IH1cbiAgICBwcml2YXRlIGdldEpTRG9jc1dvcmtlcihub2RlOiB0cy5Ob2RlLCBjYWNoZSk6IFJlYWRvbmx5QXJyYXk8YW55PiB7XG4gICAgICAgIGNvbnN0IHBhcmVudCA9IG5vZGUucGFyZW50O1xuICAgICAgICBjb25zdCBpc0luaXRpYWxpemVyT2ZWYXJpYWJsZURlY2xhcmF0aW9uSW5TdGF0ZW1lbnQgPVxuICAgICAgICAgICAgdGhpcy5pc1ZhcmlhYmxlTGlrZShwYXJlbnQpICYmXG4gICAgICAgICAgICBwYXJlbnQuaW5pdGlhbGl6ZXIgPT09IG5vZGUgJiZcbiAgICAgICAgICAgIHRzLmlzVmFyaWFibGVTdGF0ZW1lbnQocGFyZW50LnBhcmVudC5wYXJlbnQpO1xuICAgICAgICBjb25zdCBpc1ZhcmlhYmxlT2ZWYXJpYWJsZURlY2xhcmF0aW9uU3RhdGVtZW50ID1cbiAgICAgICAgICAgIHRoaXMuaXNWYXJpYWJsZUxpa2Uobm9kZSkgJiYgdHMuaXNWYXJpYWJsZVN0YXRlbWVudChwYXJlbnQucGFyZW50KTtcbiAgICAgICAgY29uc3QgdmFyaWFibGVTdGF0ZW1lbnROb2RlID0gaXNJbml0aWFsaXplck9mVmFyaWFibGVEZWNsYXJhdGlvbkluU3RhdGVtZW50XG4gICAgICAgICAgICA/IHBhcmVudC5wYXJlbnQucGFyZW50XG4gICAgICAgICAgICA6IGlzVmFyaWFibGVPZlZhcmlhYmxlRGVjbGFyYXRpb25TdGF0ZW1lbnRcbiAgICAgICAgICAgID8gcGFyZW50LnBhcmVudFxuICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICAgIGlmICh2YXJpYWJsZVN0YXRlbWVudE5vZGUpIHtcbiAgICAgICAgICAgIGNhY2hlID0gdGhpcy5nZXRKU0RvY3NXb3JrZXIodmFyaWFibGVTdGF0ZW1lbnROb2RlLCBjYWNoZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbHNvIHJlY29nbml6ZSB3aGVuIHRoZSBub2RlIGlzIHRoZSBSSFMgb2YgYW4gYXNzaWdubWVudCBleHByZXNzaW9uXG4gICAgICAgIGNvbnN0IGlzU291cmNlT2ZBc3NpZ25tZW50RXhwcmVzc2lvblN0YXRlbWVudCA9XG4gICAgICAgICAgICBwYXJlbnQgJiZcbiAgICAgICAgICAgIHBhcmVudC5wYXJlbnQgJiZcbiAgICAgICAgICAgIHRzLmlzQmluYXJ5RXhwcmVzc2lvbihwYXJlbnQpICYmXG4gICAgICAgICAgICBwYXJlbnQub3BlcmF0b3JUb2tlbi5raW5kID09PSBTeW50YXhLaW5kLkVxdWFsc1Rva2VuICYmXG4gICAgICAgICAgICB0cy5pc0V4cHJlc3Npb25TdGF0ZW1lbnQocGFyZW50LnBhcmVudCk7XG4gICAgICAgIGlmIChpc1NvdXJjZU9mQXNzaWdubWVudEV4cHJlc3Npb25TdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgIGNhY2hlID0gdGhpcy5nZXRKU0RvY3NXb3JrZXIocGFyZW50LnBhcmVudCwgY2FjaGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNNb2R1bGVEZWNsYXJhdGlvbiA9XG4gICAgICAgICAgICB0cy5pc01vZHVsZURlY2xhcmF0aW9uKG5vZGUpICYmIHBhcmVudCAmJiB0cy5pc01vZHVsZURlY2xhcmF0aW9uKHBhcmVudCk7XG4gICAgICAgIGNvbnN0IGlzUHJvcGVydHlBc3NpZ25tZW50RXhwcmVzc2lvbiA9IHBhcmVudCAmJiB0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwYXJlbnQpO1xuICAgICAgICBpZiAoaXNNb2R1bGVEZWNsYXJhdGlvbiB8fCBpc1Byb3BlcnR5QXNzaWdubWVudEV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIGNhY2hlID0gdGhpcy5nZXRKU0RvY3NXb3JrZXIocGFyZW50LCBjYWNoZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQdWxsIHBhcmFtZXRlciBjb21tZW50cyBmcm9tIGRlY2xhcmluZyBmdW5jdGlvbiBhcyB3ZWxsXG4gICAgICAgIGlmICh0cy5pc1BhcmFtZXRlcihub2RlKSkge1xuICAgICAgICAgICAgY2FjaGUgPSBfLmNvbmNhdChjYWNoZSwgdGhpcy5nZXRKU0RvY1BhcmFtZXRlclRhZ3Mobm9kZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNWYXJpYWJsZUxpa2Uobm9kZSkgJiYgbm9kZS5pbml0aWFsaXplcikge1xuICAgICAgICAgICAgY2FjaGUgPSBfLmNvbmNhdChjYWNoZSwgbm9kZS5pbml0aWFsaXplci5qc0RvYyk7XG4gICAgICAgIH1cblxuICAgICAgICBjYWNoZSA9IF8uY29uY2F0KGNhY2hlLCBub2RlLmpzRG9jKTtcblxuICAgICAgICByZXR1cm4gY2FjaGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRKU0RvY1BhcmFtZXRlclRhZ3MoXG4gICAgICAgIHBhcmFtOiB0cy5QYXJhbWV0ZXJEZWNsYXJhdGlvblxuICAgICk6IFJlYWRvbmx5QXJyYXk8dHMuSlNEb2NQYXJhbWV0ZXJUYWc+IHtcbiAgICAgICAgY29uc3QgZnVuYyA9IHBhcmFtLnBhcmVudCBhcyB0cy5GdW5jdGlvbkxpa2VEZWNsYXJhdGlvbjtcbiAgICAgICAgY29uc3QgdGFncyA9IHRoaXMuZ2V0SlNEb2NUYWdzKFxuICAgICAgICAgICAgZnVuYyxcbiAgICAgICAgICAgIFN5bnRheEtpbmQuSlNEb2NQYXJhbWV0ZXJUYWdcbiAgICAgICAgKSBhcyB0cy5KU0RvY1BhcmFtZXRlclRhZ1tdO1xuXG4gICAgICAgIGlmICghcGFyYW0ubmFtZSkge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyBhbiBhbm9ueW1vdXMganNkb2MgcGFyYW0gZnJvbSBhIGBmdW5jdGlvbih0eXBlMSwgdHlwZTIpOiB0eXBlM2Agc3BlY2lmaWNhdGlvblxuICAgICAgICAgICAgY29uc3QgaSA9IGZ1bmMucGFyYW1ldGVycy5pbmRleE9mKHBhcmFtKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtVGFncyA9IF8uZmlsdGVyKHRhZ3MsIHRhZyA9PiB0cy5pc0pTRG9jUGFyYW1ldGVyVGFnKHRhZykpO1xuXG4gICAgICAgICAgICBpZiAocGFyYW1UYWdzICYmIDAgPD0gaSAmJiBpIDwgcGFyYW1UYWdzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbcGFyYW1UYWdzW2ldXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0cy5pc0lkZW50aWZpZXIocGFyYW0ubmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBwYXJhbS5uYW1lLnRleHQ7XG4gICAgICAgICAgICByZXR1cm4gXy5maWx0ZXIodGFncywgdGFnID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodHMgJiYgdHMuaXNKU0RvY1BhcmFtZXRlclRhZyh0YWcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0OiBKU0RvY1BhcmFtZXRlclRhZ0V4dCA9IHRhZztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0LnBhcmFtZXRlck5hbWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdC5wYXJhbWV0ZXJOYW1lLnRleHQgPT09IG5hbWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHQubmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdC5uYW1lLmVzY2FwZWRUZXh0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0Lm5hbWUuZXNjYXBlZFRleHQgPT09IG5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRPRE86IGl0J3MgYSBkZXN0cnVjdHVyZWQgcGFyYW1ldGVyLCBzbyBpdCBzaG91bGQgbG9vayB1cCBhbiBcIm9iamVjdCB0eXBlXCIgc2VyaWVzIG9mIG11bHRpcGxlIGxpbmVzXG4gICAgICAgICAgICAvLyBCdXQgbXVsdGktbGluZSBvYmplY3QgdHlwZXMgYXJlbid0IHN1cHBvcnRlZCB5ZXQgZWl0aGVyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19