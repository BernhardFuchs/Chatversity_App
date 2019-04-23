"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_simple_ast_1 = require("ts-simple-ast");
function kindToType(kind) {
    var _type = '';
    switch (kind) {
        case ts_simple_ast_1.SyntaxKind.StringKeyword:
        case ts_simple_ast_1.SyntaxKind.StringLiteral:
            _type = 'string';
            break;
        case ts_simple_ast_1.SyntaxKind.NumberKeyword:
        case ts_simple_ast_1.SyntaxKind.NumericLiteral:
            _type = 'number';
            break;
        case ts_simple_ast_1.SyntaxKind.ArrayType:
        case ts_simple_ast_1.SyntaxKind.ArrayLiteralExpression:
            _type = '[]';
            break;
        case ts_simple_ast_1.SyntaxKind.VoidKeyword:
            _type = 'void';
            break;
        case ts_simple_ast_1.SyntaxKind.FunctionType:
            _type = 'function';
            break;
        case ts_simple_ast_1.SyntaxKind.TypeLiteral:
            _type = 'literal type';
            break;
        case ts_simple_ast_1.SyntaxKind.BooleanKeyword:
            _type = 'boolean';
            break;
        case ts_simple_ast_1.SyntaxKind.AnyKeyword:
            _type = 'any';
            break;
        case ts_simple_ast_1.SyntaxKind.NullKeyword:
            _type = 'null';
            break;
        case ts_simple_ast_1.SyntaxKind.SymbolKeyword:
            _type = 'symbol';
            break;
        case ts_simple_ast_1.SyntaxKind.NeverKeyword:
            _type = 'never';
            break;
        case ts_simple_ast_1.SyntaxKind.UndefinedKeyword:
            _type = 'undefined';
            break;
        case ts_simple_ast_1.SyntaxKind.ObjectKeyword:
        case ts_simple_ast_1.SyntaxKind.ObjectLiteralExpression:
            _type = 'object';
            break;
    }
    return _type;
}
exports.kindToType = kindToType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZC10by10eXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL3V0aWxzL2tpbmQtdG8tdHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtDQUEyQztBQUUzQyxTQUFnQixVQUFVLENBQUMsSUFBWTtJQUNuQyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDZixRQUFRLElBQUksRUFBRTtRQUNWLEtBQUssMEJBQVUsQ0FBQyxhQUFhLENBQUM7UUFDOUIsS0FBSywwQkFBVSxDQUFDLGFBQWE7WUFDekIsS0FBSyxHQUFHLFFBQVEsQ0FBQztZQUNqQixNQUFNO1FBQ1YsS0FBSywwQkFBVSxDQUFDLGFBQWEsQ0FBQztRQUM5QixLQUFLLDBCQUFVLENBQUMsY0FBYztZQUMxQixLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ2pCLE1BQU07UUFDVixLQUFLLDBCQUFVLENBQUMsU0FBUyxDQUFDO1FBQzFCLEtBQUssMEJBQVUsQ0FBQyxzQkFBc0I7WUFDbEMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNiLE1BQU07UUFDVixLQUFLLDBCQUFVLENBQUMsV0FBVztZQUN2QixLQUFLLEdBQUcsTUFBTSxDQUFDO1lBQ2YsTUFBTTtRQUNWLEtBQUssMEJBQVUsQ0FBQyxZQUFZO1lBQ3hCLEtBQUssR0FBRyxVQUFVLENBQUM7WUFDbkIsTUFBTTtRQUNWLEtBQUssMEJBQVUsQ0FBQyxXQUFXO1lBQ3ZCLEtBQUssR0FBRyxjQUFjLENBQUM7WUFDdkIsTUFBTTtRQUNWLEtBQUssMEJBQVUsQ0FBQyxjQUFjO1lBQzFCLEtBQUssR0FBRyxTQUFTLENBQUM7WUFDbEIsTUFBTTtRQUNWLEtBQUssMEJBQVUsQ0FBQyxVQUFVO1lBQ3RCLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDZCxNQUFNO1FBQ1YsS0FBSywwQkFBVSxDQUFDLFdBQVc7WUFDdkIsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUNmLE1BQU07UUFDVixLQUFLLDBCQUFVLENBQUMsYUFBYTtZQUN6QixLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ2pCLE1BQU07UUFDVixLQUFLLDBCQUFVLENBQUMsWUFBWTtZQUN4QixLQUFLLEdBQUcsT0FBTyxDQUFDO1lBQ2hCLE1BQU07UUFDVixLQUFLLDBCQUFVLENBQUMsZ0JBQWdCO1lBQzVCLEtBQUssR0FBRyxXQUFXLENBQUM7WUFDcEIsTUFBTTtRQUNWLEtBQUssMEJBQVUsQ0FBQyxhQUFhLENBQUM7UUFDOUIsS0FBSywwQkFBVSxDQUFDLHVCQUF1QjtZQUNuQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ2pCLE1BQU07S0FDYjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFoREQsZ0NBZ0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3ludGF4S2luZCB9IGZyb20gJ3RzLXNpbXBsZS1hc3QnO1xuXG5leHBvcnQgZnVuY3Rpb24ga2luZFRvVHlwZShraW5kOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGxldCBfdHlwZSA9ICcnO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgICBjYXNlIFN5bnRheEtpbmQuU3RyaW5nS2V5d29yZDpcbiAgICAgICAgY2FzZSBTeW50YXhLaW5kLlN0cmluZ0xpdGVyYWw6XG4gICAgICAgICAgICBfdHlwZSA9ICdzdHJpbmcnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3ludGF4S2luZC5OdW1iZXJLZXl3b3JkOlxuICAgICAgICBjYXNlIFN5bnRheEtpbmQuTnVtZXJpY0xpdGVyYWw6XG4gICAgICAgICAgICBfdHlwZSA9ICdudW1iZXInO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3ludGF4S2luZC5BcnJheVR5cGU6XG4gICAgICAgIGNhc2UgU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uOlxuICAgICAgICAgICAgX3R5cGUgPSAnW10nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3ludGF4S2luZC5Wb2lkS2V5d29yZDpcbiAgICAgICAgICAgIF90eXBlID0gJ3ZvaWQnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3ludGF4S2luZC5GdW5jdGlvblR5cGU6XG4gICAgICAgICAgICBfdHlwZSA9ICdmdW5jdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTeW50YXhLaW5kLlR5cGVMaXRlcmFsOlxuICAgICAgICAgICAgX3R5cGUgPSAnbGl0ZXJhbCB0eXBlJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFN5bnRheEtpbmQuQm9vbGVhbktleXdvcmQ6XG4gICAgICAgICAgICBfdHlwZSA9ICdib29sZWFuJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFN5bnRheEtpbmQuQW55S2V5d29yZDpcbiAgICAgICAgICAgIF90eXBlID0gJ2FueSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTeW50YXhLaW5kLk51bGxLZXl3b3JkOlxuICAgICAgICAgICAgX3R5cGUgPSAnbnVsbCc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTeW50YXhLaW5kLlN5bWJvbEtleXdvcmQ6XG4gICAgICAgICAgICBfdHlwZSA9ICdzeW1ib2wnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3ludGF4S2luZC5OZXZlcktleXdvcmQ6XG4gICAgICAgICAgICBfdHlwZSA9ICduZXZlcic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTeW50YXhLaW5kLlVuZGVmaW5lZEtleXdvcmQ6XG4gICAgICAgICAgICBfdHlwZSA9ICd1bmRlZmluZWQnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3ludGF4S2luZC5PYmplY3RLZXl3b3JkOlxuICAgICAgICBjYXNlIFN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb246XG4gICAgICAgICAgICBfdHlwZSA9ICdvYmplY3QnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBfdHlwZTtcbn1cbiJdfQ==