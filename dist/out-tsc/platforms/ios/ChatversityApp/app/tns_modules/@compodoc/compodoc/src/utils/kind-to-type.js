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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZC10by10eXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy91dGlscy9raW5kLXRvLXR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQ0FBMkM7QUFFM0MsU0FBZ0IsVUFBVSxDQUFDLElBQVk7SUFDbkMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2YsUUFBUSxJQUFJLEVBQUU7UUFDVixLQUFLLDBCQUFVLENBQUMsYUFBYSxDQUFDO1FBQzlCLEtBQUssMEJBQVUsQ0FBQyxhQUFhO1lBQ3pCLEtBQUssR0FBRyxRQUFRLENBQUM7WUFDakIsTUFBTTtRQUNWLEtBQUssMEJBQVUsQ0FBQyxhQUFhLENBQUM7UUFDOUIsS0FBSywwQkFBVSxDQUFDLGNBQWM7WUFDMUIsS0FBSyxHQUFHLFFBQVEsQ0FBQztZQUNqQixNQUFNO1FBQ1YsS0FBSywwQkFBVSxDQUFDLFNBQVMsQ0FBQztRQUMxQixLQUFLLDBCQUFVLENBQUMsc0JBQXNCO1lBQ2xDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDYixNQUFNO1FBQ1YsS0FBSywwQkFBVSxDQUFDLFdBQVc7WUFDdkIsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUNmLE1BQU07UUFDVixLQUFLLDBCQUFVLENBQUMsWUFBWTtZQUN4QixLQUFLLEdBQUcsVUFBVSxDQUFDO1lBQ25CLE1BQU07UUFDVixLQUFLLDBCQUFVLENBQUMsV0FBVztZQUN2QixLQUFLLEdBQUcsY0FBYyxDQUFDO1lBQ3ZCLE1BQU07UUFDVixLQUFLLDBCQUFVLENBQUMsY0FBYztZQUMxQixLQUFLLEdBQUcsU0FBUyxDQUFDO1lBQ2xCLE1BQU07UUFDVixLQUFLLDBCQUFVLENBQUMsVUFBVTtZQUN0QixLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ2QsTUFBTTtRQUNWLEtBQUssMEJBQVUsQ0FBQyxXQUFXO1lBQ3ZCLEtBQUssR0FBRyxNQUFNLENBQUM7WUFDZixNQUFNO1FBQ1YsS0FBSywwQkFBVSxDQUFDLGFBQWE7WUFDekIsS0FBSyxHQUFHLFFBQVEsQ0FBQztZQUNqQixNQUFNO1FBQ1YsS0FBSywwQkFBVSxDQUFDLFlBQVk7WUFDeEIsS0FBSyxHQUFHLE9BQU8sQ0FBQztZQUNoQixNQUFNO1FBQ1YsS0FBSywwQkFBVSxDQUFDLGdCQUFnQjtZQUM1QixLQUFLLEdBQUcsV0FBVyxDQUFDO1lBQ3BCLE1BQU07UUFDVixLQUFLLDBCQUFVLENBQUMsYUFBYSxDQUFDO1FBQzlCLEtBQUssMEJBQVUsQ0FBQyx1QkFBdUI7WUFDbkMsS0FBSyxHQUFHLFFBQVEsQ0FBQztZQUNqQixNQUFNO0tBQ2I7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBaERELGdDQWdEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN5bnRheEtpbmQgfSBmcm9tICd0cy1zaW1wbGUtYXN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGtpbmRUb1R5cGUoa2luZDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICBsZXQgX3R5cGUgPSAnJztcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgICAgY2FzZSBTeW50YXhLaW5kLlN0cmluZ0tleXdvcmQ6XG4gICAgICAgIGNhc2UgU3ludGF4S2luZC5TdHJpbmdMaXRlcmFsOlxuICAgICAgICAgICAgX3R5cGUgPSAnc3RyaW5nJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFN5bnRheEtpbmQuTnVtYmVyS2V5d29yZDpcbiAgICAgICAgY2FzZSBTeW50YXhLaW5kLk51bWVyaWNMaXRlcmFsOlxuICAgICAgICAgICAgX3R5cGUgPSAnbnVtYmVyJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFN5bnRheEtpbmQuQXJyYXlUeXBlOlxuICAgICAgICBjYXNlIFN5bnRheEtpbmQuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbjpcbiAgICAgICAgICAgIF90eXBlID0gJ1tdJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFN5bnRheEtpbmQuVm9pZEtleXdvcmQ6XG4gICAgICAgICAgICBfdHlwZSA9ICd2b2lkJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFN5bnRheEtpbmQuRnVuY3Rpb25UeXBlOlxuICAgICAgICAgICAgX3R5cGUgPSAnZnVuY3Rpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3ludGF4S2luZC5UeXBlTGl0ZXJhbDpcbiAgICAgICAgICAgIF90eXBlID0gJ2xpdGVyYWwgdHlwZSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTeW50YXhLaW5kLkJvb2xlYW5LZXl3b3JkOlxuICAgICAgICAgICAgX3R5cGUgPSAnYm9vbGVhbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTeW50YXhLaW5kLkFueUtleXdvcmQ6XG4gICAgICAgICAgICBfdHlwZSA9ICdhbnknO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3ludGF4S2luZC5OdWxsS2V5d29yZDpcbiAgICAgICAgICAgIF90eXBlID0gJ251bGwnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3ludGF4S2luZC5TeW1ib2xLZXl3b3JkOlxuICAgICAgICAgICAgX3R5cGUgPSAnc3ltYm9sJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFN5bnRheEtpbmQuTmV2ZXJLZXl3b3JkOlxuICAgICAgICAgICAgX3R5cGUgPSAnbmV2ZXInO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3ludGF4S2luZC5VbmRlZmluZWRLZXl3b3JkOlxuICAgICAgICAgICAgX3R5cGUgPSAndW5kZWZpbmVkJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFN5bnRheEtpbmQuT2JqZWN0S2V5d29yZDpcbiAgICAgICAgY2FzZSBTeW50YXhLaW5kLk9iamVjdExpdGVyYWxFeHByZXNzaW9uOlxuICAgICAgICAgICAgX3R5cGUgPSAnb2JqZWN0JztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gX3R5cGU7XG59XG4iXX0=