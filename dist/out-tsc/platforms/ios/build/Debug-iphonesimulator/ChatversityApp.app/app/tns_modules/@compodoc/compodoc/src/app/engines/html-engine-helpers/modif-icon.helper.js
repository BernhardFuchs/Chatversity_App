"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_simple_ast_1 = require("ts-simple-ast");
var ModifIconHelper = /** @class */ (function () {
    function ModifIconHelper() {
    }
    ModifIconHelper.prototype.helperFunc = function (context, kind) {
        var _kindText = '';
        switch (kind) {
            case ts_simple_ast_1.SyntaxKind.PrivateKeyword:
                _kindText = 'lock'; // private
                break;
            case ts_simple_ast_1.SyntaxKind.ProtectedKeyword:
                _kindText = 'lock'; // protected
                break;
            case ts_simple_ast_1.SyntaxKind.StaticKeyword:
                _kindText = 'reset'; // static
                break;
            case ts_simple_ast_1.SyntaxKind.ExportKeyword:
                _kindText = 'export'; // export
                break;
            default:
                _kindText = 'reset';
                break;
        }
        return _kindText;
    };
    return ModifIconHelper;
}());
exports.ModifIconHelper = ModifIconHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kaWYtaWNvbi5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvaHRtbC1lbmdpbmUtaGVscGVycy9tb2RpZi1pY29uLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLCtDQUErQztBQUUvQztJQUFBO0lBc0JBLENBQUM7SUFyQlUsb0NBQVUsR0FBakIsVUFBa0IsT0FBWSxFQUFFLElBQWdCO1FBQzVDLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNuQixRQUFRLElBQUksRUFBRTtZQUNWLEtBQUssMEJBQVUsQ0FBQyxjQUFjO2dCQUMxQixTQUFTLEdBQUcsTUFBTSxDQUFDLENBQUMsVUFBVTtnQkFDOUIsTUFBTTtZQUNWLEtBQUssMEJBQVUsQ0FBQyxnQkFBZ0I7Z0JBQzVCLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQyxZQUFZO2dCQUNoQyxNQUFNO1lBQ1YsS0FBSywwQkFBVSxDQUFDLGFBQWE7Z0JBQ3pCLFNBQVMsR0FBRyxPQUFPLENBQUMsQ0FBQyxTQUFTO2dCQUM5QixNQUFNO1lBQ1YsS0FBSywwQkFBVSxDQUFDLGFBQWE7Z0JBQ3pCLFNBQVMsR0FBRyxRQUFRLENBQUMsQ0FBQyxTQUFTO2dCQUMvQixNQUFNO1lBQ1Y7Z0JBQ0ksU0FBUyxHQUFHLE9BQU8sQ0FBQztnQkFDcEIsTUFBTTtTQUNiO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNMLHNCQUFDO0FBQUQsQ0FBQyxBQXRCRCxJQXNCQztBQXRCWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElIdG1sRW5naW5lSGVscGVyIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXIuaW50ZXJmYWNlJztcblxuaW1wb3J0IHsgdHMsIFN5bnRheEtpbmQgfSBmcm9tICd0cy1zaW1wbGUtYXN0JztcblxuZXhwb3J0IGNsYXNzIE1vZGlmSWNvbkhlbHBlciBpbXBsZW1lbnRzIElIdG1sRW5naW5lSGVscGVyIHtcbiAgICBwdWJsaWMgaGVscGVyRnVuYyhjb250ZXh0OiBhbnksIGtpbmQ6IFN5bnRheEtpbmQpOiBzdHJpbmcge1xuICAgICAgICBsZXQgX2tpbmRUZXh0ID0gJyc7XG4gICAgICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgICAgICAgY2FzZSBTeW50YXhLaW5kLlByaXZhdGVLZXl3b3JkOlxuICAgICAgICAgICAgICAgIF9raW5kVGV4dCA9ICdsb2NrJzsgLy8gcHJpdmF0ZVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTeW50YXhLaW5kLlByb3RlY3RlZEtleXdvcmQ6XG4gICAgICAgICAgICAgICAgX2tpbmRUZXh0ID0gJ2xvY2snOyAvLyBwcm90ZWN0ZWRcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU3ludGF4S2luZC5TdGF0aWNLZXl3b3JkOlxuICAgICAgICAgICAgICAgIF9raW5kVGV4dCA9ICdyZXNldCc7IC8vIHN0YXRpY1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTeW50YXhLaW5kLkV4cG9ydEtleXdvcmQ6XG4gICAgICAgICAgICAgICAgX2tpbmRUZXh0ID0gJ2V4cG9ydCc7IC8vIGV4cG9ydFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBfa2luZFRleHQgPSAncmVzZXQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfa2luZFRleHQ7XG4gICAgfVxufVxuIl19